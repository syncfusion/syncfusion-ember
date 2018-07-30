(function ($, ej, wd, ko, undefined) {
    'use strict';

    var eKO = {
        binder: function (element, valueAccessor, allBindings, viewModel, bindingContext, proto, name) {
            var data = $(element).data(name), evt = !data, value = koUnwrap(valueAccessor, proto["ob.ignore"], !evt), changeFn, modelVal, cur, curModel;

            if(!evt && JSON){
                for(var prop in value){
                    cur = value[prop];
                    if(cur instanceof Array && (curModel = data.model[prop]) instanceof Array
                        && cur.length === curModel.length
                        && JSON.stringify(cur) === JSON.stringify(curModel)){
                        delete value[prop];
                    }
                }
            }

            if (evt && proto.type === "editor" && ko.isObservable(value.value)) {
                modelVal = value.value;
                changeFn = eKO.modelChange(modelVal);
                value = $.extend({}, value, { value: value.value() });
            }
            $(element)[name](value);
            var instance = $(element).data(name);
            if ("tmpl.$bindingContext" in instance) 
                eKO.refreshTemplate(element, instance["tmpl.$bindingContext"]);
            $(element).on(name + "refresh", function () {
                if ("tmpl.$bindingContext" in instance) 
                    eKO.refreshTemplate(element, instance["tmpl.$bindingContext"]);
            });
            if (changeFn) {
                $(element).data(name)["kosubscribe"]= modelVal.subscribe(eKO.valueChange($(element)[name]("model._change", changeFn).data(name)));
            }
        },
        modelChange: function (accessor) {
            return function (val) {
                accessor(val.value);
            };
        },
        valueChange: function(instance){
            return function (val) {
                instance.option("value", eKO.processData(val));
            };
        },
        processData: function (value) {
            return value === "true" ? true :
                value === "false" ? false :
                +value + "" === value ? +value : value;
        },

        bindKoHandler: function (name, proto) {
            proto["ob.ignore"] = [];
            [].push.apply(proto["ob.ignore"], proto.observables || []);

            ko.bindingHandlers[name] = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(element).off(name + "refresh");
                        var instance = $(element).data(name);
                        var tmpl = instance["tmpl.$bindingContext"] || {};
                        for (var t in tmpl) 
                            delete tmpl[t];
                        var subscriptions = $(element).data(name)["kosubscribe"];
                        if (subscriptions) {
                            if (typeof (subscriptions["dispose"]) === "function") {
                                subscriptions.dispose();
                            }
                            else {
                                for (var subscribe in subscriptions)
                                    for (var property in subscriptions[subscribe])
                                        if (subscriptions[subscribe].hasOwnProperty(property)) {
                                            subscriptions[subscribe][property].dispose();
                                            delete subscriptions[subscribe][property];
                                        }
                            }
                        }
                        $(element)[name]("destroy");
                    });
                },
                update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    eKO.binder(element, valueAccessor, allBindings, viewModel, bindingContext, proto, name);
                }
            };
            ko.bindingHandlers["ejTemplate"] = {
                init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                    return { controlsDescendantBindings: true };
                }
            };
        },
        refreshTemplate: function (element, tmpl) {
            var templates = $(element).find(".ej-knockout-template");
            for (var template in tmpl) {
                var el = templates.filter("." + tmpl[template].key);
                if (!el.length) {
                    delete tmpl[template];
                    continue;
                }
                for (var i = 0; i < el.length; i++) {
                    ko.renderTemplate(template.replace("#", ""), tmpl[template]["bindingContext"]["items"][i], {}, el[i]);
                }
            }
        }
    }

    var koUnwrap = function (valueAccessor, ignoreProps, removeIgnores, pre) {
        var val = ko.utils.unwrapObservable(valueAccessor), res = {};
        pre = pre || "";
        if (typeof val === "function")
            val = val();
        if (ej.isPlainObject(val)) {
            for (var prop in val) {
                if (ignoreProps.indexOf(pre + prop) === -1) {
                    res[prop] = ko.utils.unwrapObservable(val[prop]);

                    if (ej.isPlainObject(res[prop]) || ko.isObservable(res[prop])) {
                        res[prop] = koUnwrap(res[prop], ignoreProps, removeIgnores, pre + prop + ".");
                    }
                } else {
                    if (removeIgnores)
                        continue;
                    res[prop] = val[prop];
                }
            }
        }
        return res;
    }

    var widgets = wd.registeredWidgets;
    for (var name in widgets) {
        eKO.bindKoHandler(widgets[name].name, widgets[name].proto);
    }

    ej.widget.extensions = {
        registerWidget: function (name) {
            eKO.bindKoHandler(name, widgets[name].proto);
        }
    }

    ej.extensions.ko = {
        subscriptions: {},
        register: function (value, field, instance) {
			if (!ko || !ko.isObservable(value))
                return value;	
				
			var evt = value, obj= {};			
			if (value.ejComputed !== undefined) {
			    evt = value.ejComputed;
			    value = value.ejValue;
			    instance.isejObservableArray = true;
			}
			ej.widget.observables.subscriptions[field] = evt.subscribe(ej.proxy(ej.widget.observables.raise, { instance: instance, field: field }));
			!instance["kosubscribe"] && (instance["kosubscribe"] = []);
			obj[field] = ej.widget.observables.subscriptions[field];
			instance["kosubscribe"].push(obj);
            return value;
        },
        raise: function (value) {
            var obValues = this.instance["ob.values"], isCached = this.field in obValues;
            if (!isCached)
                obValues[this.field] = this.instance.option(this.field);

            if (obValues[this.field] !== value || $.isArray(this.instance.option(this.field)())) {
                this.instance.option(this.field, ej.extensions.modelGUID, true);
                obValues[this.field] = value;
            }
        },
        getValue: function (val, getObservable) {
            if (getObservable)
                return val;
            return typeof val === "function" ? val() : val;
        }
    };
	
	ko.extenders.ejObservableArray = function (target, option) {
        var ejcomputed = ko.computed({
            read: function () {
                return ko.toJS(target);
            },
            write: function (newValue, index, action) {                
                switch (action) {
                    case "insert":
                        var obj = new target.ejObsFunc(newValue);
                        target.splice(index, 0, obj);
                        break;
                    case "remove":
                        target.splice(index, 1);
                        break;
                    case "update":
                        var obj = Object.keys(newValue);
                        for (var j = 0; j < obj.length; j++) {
                            var key = obj[j];
                            target()[index][key](newValue[key]);
                        }
                        break;
                }
            },
        }, this);
        target.ejValue = ko.observableArray(ejcomputed)();
        target.ejComputed = ejcomputed;
        target.ejObsFunc = option;
        return target;
    };

    ej.template["text/ko-template"] = function (self, selector, data, index) {
        var bindingContext, context, tt, tmpl = self["tmpl.$bindingContext"];

        if (!tmpl || !tmpl[selector]) {
            tmpl = tmpl || {};
            tmpl[selector] = { bindingContext: {}, key: ej.getGuid("tmpl") };
            bindingContext = tmpl[selector].bindingContext;
            self["tmpl.$bindingContext"] = tmpl;
        }

        bindingContext = tmpl[selector].bindingContext;
        if (!ej.isNullOrUndefined(index)) {
            if (!bindingContext.items)
                bindingContext.items = [];
            bindingContext.items[index] = data;
        } else {
            index = 1;
            bindingContext.items = [data];
        }

        tt = "<div data-bind='ejTemplate:{}' ej-prop='" + index + "' class='" + tmpl[selector].key + " ej-knockout-template'></div>";
        return tt;
    }
    ej.widget.observables = ej.extensions.ko;
})(window.jQuery, window.Syncfusion, window.Syncfusion.widget, ko || window.ko);