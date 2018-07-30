
(function () {

    var args, clientArgs;
    refreshFlag();
    ej.raiseWebFormsServerEvents = function (eventName, eventProp, clientProp) {
        if (eventProp.model.serverEvents.indexOf(eventName) != -1) {
            args = eventProp, clientArgs = ignoreDOMElement(clientProp);
            if (args.type == "ejButtonclick" && args.model.type.toLowerCase() == "submit") {
                args.e.preventDefault();
                (typeof theForm == "undefined" ? $("body form") : $(theForm)).submit();
            }
            setTimeout(function () {
                try {
                    var modelStr = JSON.stringify({ type: args.originalEventType, args: clientArgs });
                    __doPostBack(args.model.uniqueId, modelStr);
                }
                catch (e) { }
            }, 0);
        }
    }
    function ignoreDOMElement(args) {
        if (!args) return null;
        for (var name in args) {
            var ele = args[name];
            if (isDOMObj(ele) || (ele && typeof ele.preventDefault == "function"))
                delete args[name];
            else if ($.isPlainObject(ele)) ignoreDOMElement(ele);
        }
        return args;
    }
    function isDOMObj(o) {
        return o instanceof $ || (o && o.nodeType && o.nodeType == 1);
    }

})();

function refreshFlag() {
    setTimeout(function () { ej.isOnWebForms = true; }, 0);
}

function EJ_ClientSideOnPostBack() {
    var $form = typeof theForm == "undefined" ? $("body form") : $(theForm);
    if (!$form.length) return;
    $form.append(getPostBackData());
    addPostBackHandler();
    ej.isOnWebForms = false;
}

function getPostBackData() {
    var controls = $("body .e-js");
    $("#ej-hidden-model-container").remove();
    var div = $(document.createElement("div"));
    div.attr("id", "ej-hidden-model-container");
    for (var i = 0; i < controls.length; i++) {
        var widgets = $(controls[i]).data("ejWidgets");
        if (!widgets) continue;
        for (var j = 0; j < widgets.length; j++) {
            var that = $(controls[i]).data(widgets[j]);
            if (!that || !that.model.clientId) continue;
            var hidden = $(document.createElement("input")).attr({
                "type": "hidden",
                "id": that.model.clientId + "_hidden_model",
                "name": that.model.clientId + "_hidden_model"
            }).val(JSON.stringify(includeRequiredProp(that)));
            div.append(hidden);
        }
    }
    return div;
}

function includeRequiredProp(that) {
    var propArray = that._includeOnViewstate || [], model = {};
    for (var n = 0; n < propArray.length; n++)
        if (propArray[n].indexOf(".") > -1) {
            if (ej.isNullOrUndefined(model[propArray[n].split(".")[0]]))
                model[propArray[n].split(".")[0]] = complexDataFilter(propArray[n], that.model);
            else {
                var obj = {};
                obj[propArray[n].split(".")[0]] = complexDataFilter(propArray[n], that.model);
                model = $.extend(true, model, obj);
            } 
        }
        else
            model[propArray[n]] = ej.util.getObject(propArray[n], that.model);
    return model;
}

function complexDataFilter(propArray, propValue) {
    var propSplit = propArray.split(".") || [], propIndex = 0, model = {};
    if (propValue[propSplit[propIndex]] instanceof Array)
        model[propSplit[propIndex]] = arrayModelFilter(propArray, [], propValue[propSplit[propIndex]], propSplit, propIndex + 1);
    else if (typeof propValue[propSplit[propIndex]] == "object")
        model[propSplit[propIndex]] = objectModelFilter(propArray, {}, propValue[propSplit[propIndex]], propSplit, propIndex + 1);
    return model[propSplit[propIndex]];
}

function arrayModelFilter(propArray, model, propValue, propSplit, propIndex) {
    for (var n = 0; n < propValue.length; n++) {
        var obj = new Object();
        if (propSplit != [] && propSplit.length - 1 != propIndex) {
            if (propValue[n][propSplit[propIndex]] instanceof Array)
                obj[propSplit[propIndex]] = arrayModelFilter(propSplit[propIndex + 1], [], propValue[n][propSplit[propIndex]], propSplit, propIndex + 1);
            else if (typeof propValue[n][propSplit[propIndex]] == "object")
                obj[propSplit[propIndex]] = objectModelFilter(propSplit[propIndex + 1], {}, propValue[n][propSplit[propIndex]], propSplit, propIndex + 1);
        }
        else if (propSplit != [])
            obj[propSplit[propIndex]] = ej.util.getObject(propSplit[propIndex], propValue[n]);
        else
            obj[propSplit[propIndex]] = ej.util.getObject(propArray, propValue[n]);
        model.push(obj);
    }
    return model;
}

function objectModelFilter(propObject, model, propValue, propSplit, propIndex) {
    if (propSplit != [] && propSplit.length - 1 != propIndex) {
        if (propValue[propSplit[propIndex]] instanceof Array)
            model[propSplit[propIndex]] = arrayModelFilter(propSplit[propIndex + 1], [], propValue[propSplit[propIndex]], propSplit, propIndex + 1);
        else if (typeof propValue[propSplit[propIndex]] == "object")
            model[propSplit[propIndex]] = objectModelFilter(propSplit[propIndex + 1], {}, propValue[propSplit[propIndex]], propSplit, propIndex + 1);
    }
    else if (propSplit != [])
        model[propSplit[propIndex]] = ej.util.getObject(propSplit[propIndex], propValue);
    else
        model[propObject] = ej.util.getObject(propObject, propValue);
    return model;
}

function clearPostBackData() {
    refreshFlag();
    removePostBackHandler();
    $("#ej-hidden-model-container").remove();
}

function addPostBackHandler() {
    if (typeof Sys != "undefined")
        Sys.WebForms.PageRequestManager.getInstance().add_endRequest(clearPostBackData);
}
function removePostBackHandler() {
    if (typeof Sys != "undefined")
        Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(clearPostBackData);
}