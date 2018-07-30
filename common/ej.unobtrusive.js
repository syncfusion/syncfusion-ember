/// <reference path="ej.core.js" />

(function ($, ej, wd, undefined) {
    'use strict';

    var options = wd.unobtrusive = {
        dataRole: false,
        ejRole: false,
        directive: false
    };
    var propMaps = {};

    // IE8
    String.prototype.trim = String.prototype.trim || function () {
        return this.replace(/^\s+|\s+$/g, '');
    }

    var div = $(document.createElement("div"));

    var processAttrib = function (obj, name, value) {
        if (name.indexOf("-") === -1) {
            obj[name] = value;
            return;
        }

        ej.createObject(name.replace(/-/g, '.'), value, obj);
    }

    var processData = function (value) {
        return value === "true" ? true :
            value === "false" ? false :
            +value + "" === value ? +value : value;
    }

    var readAttributes = function (element, op, plugin) {
        var attributes = element[0].attributes, att, data = {},
            control = plugin.slice(2).toLowerCase(),
            dataName = "data-ej-",
            dataLength = dataName.length,
            ejName = "ej-",
            ejLength = ejName.length,
            value;

        for (var i = 0; i < attributes.length; i++) {
            att = attributes[i];
            if (op.dataRole && att.name.startsWith(dataName)) {
                processAttrib(data, att.name.slice(dataLength), processData(att.value));
            }
            if ((op.ejRole && att.name.startsWith(ejName)) ||
                (op.dataRole === false && op.ejRole === false && op.directive === true && att.name.startsWith(ejName))) {
                processAttrib(data, att.name.slice(ejLength), processData(att.value));
            }
        }

        return data;
    }

    var iterateAndSetModel = function (model, data, map, type) {
        var field = "", current;
        for (var prop in data) {
            field = map && prop in map ? map[prop] : prop;
            current = data[prop];
            if (type && type[field] === "string")
                current = current.toString();
            if (ej.isPlainObject(current) && (map || type)) {
                model[field] = {};
                iterateAndSetModel(model[field], current, map[prop + ".value"] ? map[prop + ".value"] : map, ej.isPlainObject(type[field]) ? type[field] : type);
                continue;
            }
            if (type && (type[field] === "array" || type[field] === "parent")) {
                try {
                    current = JSON.parse(current);
                }
                catch (e) {
                    current = eval(current);
                }
            }
            else if (type && type[field] === "data") {
                if (/^\[{0,1}\{.+\}\]{0,1}$/.test(current))
                    current = JSON.parse(current);
                else if (current.indexOf('/') === -1) // json instance
                    current = ej.getObject(current.indexOf("window.") === 0 ? current.slice(7) : current, window) || current;
            }

            model[field] = current;
        }
    }

    var changeTag = function (el, tag) {
        var $el = $(el);
        if (ej.support.outerHTML) {
            div.insertBefore($el);
            var currentTag = el.tagName, res = [];
            res[0] = "<";
            res[1] = el.outerHTML.trim().replace(RegExp("^<" + currentTag + "|" + currentTag + ">$", "ig"), tag);
            if (!res[1].endsWith(">"))
                res[2] = ">";
            el.outerHTML = res.join("");
            el = div.next()[0];
            div.remove();
            return el;
        }
        var clone = $el.clone(), currentTag = el.tagName, html = "";
        $el.html(html);
        html += "<";
        html += div.append(clone).html().replace(RegExp("^<" + currentTag + "|" + currentTag + ">$", "ig"), tag);
        html += ">";
        div.html(html);
        clone = $el.wrap(div.children().first()).parent();
        $el.remove();
        div.empty();
        return clone[0];
    }

    var findAndChangeTag = function (controls, tag, query, el) {
        var requiresFind = false, len = controls.length;
        for (var i = 0; i < len; i++) {
            if (controls[i].offsetParent) {
                controls[i] = changeTag(controls[i], tag);
            }
            else {
                controls.splice(i--, 1);
                requiresFind = true;
                len--;
            }
        }
        if (requiresFind) {
            controls.push.apply(controls, findAndChangeTag(el.find(query), tag, query, el));
        }
        return controls;
    }

    var findElements = function (name, op, el, proto) {
        var query = [], controlName = name.replace("ej", '').toLowerCase(), res = {};

        if (op.dataRole === true) {
            query.push("[data-role='" + name.toLowerCase() + "']");
        }
        if (op.ejRole === true) {
            query.push("[ej-" + controlName + "]");
        }

        res["role"] = el.find(query.join(','));

        if (op.directive === true) {
            res["directive"] = findAndChangeTag(el.find(controlName), (proto.validTags && proto.validTags[0]) || "div", controlName, el);
        }
        return res;
    };

    var generatePropMap = function (obj) {
        var map = {}, field;
        for (var prop in obj) {
            field = prop.toLowerCase();
            if (ej.isPlainObject(obj[prop])) {
                map[field + ".value"] = generatePropMap(obj[prop]);
            }
            map[field] = prop;
        }
        return map;
    };

    var initControls = function (controls, op, name, proto, map, dir) {
        var types = proto.dataTypes, len = controls.length;
        for (var i = 0; i < len; i++) {
            var control = controls.eq(i), model = {};
            iterateAndSetModel(model, readAttributes(control, op, name), map, types);
            control[name](model);
        }
    }

    var checkUnobtrusive = function (name, proto, op, el) {
        var controls = findElements(name, op, el, proto), map = propMaps[name];

        if (((controls.role && controls.role.length) || (controls.directive && controls.directive.length)) && !map) {
            map = generatePropMap(proto.defaults);
            map["serverevents"] = "serverEvents";
            map["clientid"] = "clientId";
            map["uniqueid"] = "uniqueId";
            propMaps[name] = map;

            if (proto._unobtrusive)
                $.extend(true, map, proto._unobtrusive);
        }

        initControls(controls.role, op, name, proto, map);

        if (controls.directive)
            initControls(controls.directive, op, name, proto, map, true);
    };

    var readBoolAttr = function (obj, attr) {
        if (obj.hasOwnProperty(attr))
            return obj[attr] !== false;

        return false;
    }

    wd.init = function (element) {
        if (!element) element = $(document);
        else element = element.jquery ? element : $(element);

        var widgets = wd.registeredWidgets;
        for (var name in widgets) {
            checkUnobtrusive(widgets[name].name, widgets[name].proto, options, element);
        }
    }

    $(function () {
        var ds = $(document.body).data();
        options.ejRole = ds.hasOwnProperty("ejrole") ? readBoolAttr(ds, "ejrole") : options.ejRole;
        options.directive = ds.hasOwnProperty("directive") ? readBoolAttr(ds, "directive") : options.directive;
        if (options.ejRole !== true && options.directive !== true) options.dataRole = true;
        options.dataRole = ds.hasOwnProperty("datarole") ? readBoolAttr(ds, "datarole") : options.dataRole;

        if (options.ejRole !== true && options.dataRole !== true && options.directive !== true)
            return;

        wd.autoInit = ds.hasOwnProperty("autoinit") ? readBoolAttr(ds, "autoinit") : true;

        if (wd.autoInit !== true)
            return;

        var query = [], el;
        if (options.dataRole === true)
            query.push("[data-ej-init]");
        if (options.ejRole === true)
            query.push("[ej-init]");
        el = $(query.join(','));

        if (!el.length) el = $(document);
        wd.init(el);
    });

})(window.jQuery, window.Syncfusion, window.Syncfusion.widget);