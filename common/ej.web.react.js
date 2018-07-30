
        (function ($, ej, wd, undefined) {
            'use strict';
            var module = {};
            var eR = {
                firstCap: function (str) {
                    return str.charAt(0).toUpperCase() + str.slice(1);
                },
                loadTags: function (proto, tags) {
                    var res = proto, tmp, attrs;
                    if (res) return res;
                    res = {};
                    for (var i = 0; i < tags.length; i++) {
                        tmp = tags[i].attr || [], attrs = {};
                        for (var j = 0; j < tmp.length; j++) {
                            if (typeof tmp[j] === "object")
                                attrs["e-tag"] = eR.loadTags(null, tmp[j]);
                            else
                                attrs[tmp[j].toLowerCase().replace(/\./g, "-")] = tmp[j];
                        }
                        res[tags[i].tag.toLowerCase().replace(/\./g, "-")] = { field: tags[i].tag, attr: attrs, content: tags[i].content, singular: (tags[i].singular || tags[i].tag.replace(/s$/, "")).replace(/\./g, "-") };
                    }
                    return res;
                },
                getTagValues: function (tags, properties, tagExist) {
                    var childs = $(properties.children), res = {};
                    if (childs.length === 0)
                        return res;
                    for (var i = 0; i < childs.length; i++) {
                        var children, tagName = childs[i].type.toLowerCase(), key = tags[tagName];
                        var current = [];
                        children = $(childs[i].props.children);
                        for (var j = 0; j < children.length; j++) {
                            var r = eR.getModel(children[j], tagExist), t;
                            if (!ej.isNullOrUndefined(key) && key.attr["e-tag"]) {
                                var rr = eR.getTagValues(key.attr["e-tag"], children[j].props, tagExist);
                                $.extend(true, r || {}, rr);
                            }
                            current.push(r);
                        }
                        if (!ej.isNullOrUndefined(key) && current.length) {
                            eR.createAndAddAttr(key.field, current, res);
                        }
                    }
                    return res;
                },
                createAndAddAttr: function (nameSpace, value, initIn) {
                    var splits = nameSpace.split('.'), start = initIn || window, from = start, i, t, length = splits.length;
                    for (i = 0; i < length; i++) {
                        t = splits[i];
                        if (i + 1 == length)
                            from[t] = ej.isNullOrUndefined(value) ? {} : value;
                        else if (ej.isNullOrUndefined(from[t])) {
                            from[t] = {};
                        }
                        from = from[t];
                    }
                    return start;
                },
                getModel: function (properties, tagExist) {
                    var model = {}, t, value, attribs = this.getProps(properties);
                    for (var att in attribs) {
                        value = properties.props[att];
                        if (att == "children" || (att == "id" && !tagExist))
                            continue;
                        if (att.indexOf("-") !== -1)
                            att = att.replace("-", ".");
                        t = att;

                        ej.createObject(t, value, model);
                    }
                    return model;
                },
                getProps: function (properties) {
                    if (!ej.isNullOrUndefined(properties["key"])) 
                          properties["props"].key=properties["key"];
                     return properties["props"]
                }
            };
            var generateComponent = function (name, proto) {
                var compName = name.replace("ej", "");
                module[compName] = createReactClass({
                    observableObj: [],
                    widgetName: name,
                    componentWillReceiveProps: function (nextProps) {
                        var i, str, str1, instance = $(ReactDOM.findDOMNode(this)).data(this.widgetName);
                        for (i = 0; i < this.observableObj.length; i++) {
                            str = str1 = this.observableObj[i].value;
                            if (str.indexOf(".") !== -1)
                                str1 = str.replace(".", "-");
                            if (this.props[str1] !== nextProps[str1]) {
                                instance.option(str, nextProps[str1], nextProps[str1] instanceof Array);
                            }
                        }
                    },
                    componentDidMount: function () {
                        var model = {}, i = 0, stateObj = {}, tagExist = false;
                        if (!ej.isNullOrUndefined(proto.observables)) {
                            for (i = 0; i < proto.observables.length; i++) {
                                ej.createObject("value", proto.observables[i], stateObj)
                                this.observableObj.push(stateObj);
                                stateObj = {};
                            }
                        }
                        model = eR.getModel(this);
                        if (!ej.isNullOrUndefined(this.props.children)) {
                            for (var i = 0; !ej.isNullOrUndefined(proto._tags) && i < proto._tags.length; i++) {
                                if (proto._tags[i].tag == this.props.children.type)
                                    tagExist = true;
                            }
                            if (tagExist) {
                                var tags = proto["ob.tags"] = eR.loadTags(proto["ob.tags"], proto._tags);
                                var res = eR.getTagValues(tags, this.props, tagExist);
                                $.extend(model, res);
                            }
                        }
                        $(ReactDOM.findDOMNode(this))[this.widgetName](model);
                    },
                    componentWillUnmount: function () {
                        $(ReactDOM.findDOMNode(this))[this.widgetName]("destroy");
                    },
                    render: function () {
                        var args = [proto.validTags[0], $.extend({ id: this.props.id }, this.props.ejHtmlAttributes)], tagExist = false;
                        if (!ej.isNullOrUndefined(this.props.children)) {
                            for (var i = 0; !ej.isNullOrUndefined(proto._tags) && i < proto._tags.length; i++) {
                                if (proto._tags[i].tag == this.props.children.type)
                                    tagExist = true;
                            }
                            if (!tagExist)
                                args.push(this.props.children);
                        }
                        return React.createElement.apply(React, args);

                    }
                });
            }
            var widgets = wd.registeredWidgets;
            for (var wid in widgets) {
                generateComponent(widgets[wid].name, widgets[wid].proto);
            }
            window["EJ"] = module;
        })(window.jQuery, window.Syncfusion, window.Syncfusion.widget);
