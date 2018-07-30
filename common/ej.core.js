
window.ej = window.Syncfusion = window.Syncfusion || {};


(function ($, ej, undefined) {
    'use strict';

    ej.version = "13.3.0.8";

    ej.consts = {
        NamespaceJoin: '-'
    };
    ej.TextAlign = {
        Center: 'center',
        Justify: 'justify',
        Left: 'left',
        Right: 'right'
    };
    ej.Orientation = { Horizontal: "horizontal", Vertical: "vertical" };

    ej.serverTimezoneOffset = 0;

    ej.parseDateInUTC = false;

    ej.persistStateVersion = null;

    ej.locales = ej.locales || [];

    if (!Object.prototype.hasOwnProperty) {
        Object.prototype.hasOwnProperty = function (obj, prop) {
            return obj[prop] !== undefined;
        };
    }

    //to support toISOString() in IE8
    if (!Date.prototype.toISOString) {
        (function () {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }
            Date.prototype.toISOString = function () {
                return this.getUTCFullYear()
                    + '-' + pad(this.getUTCMonth() + 1)
                    + '-' + pad(this.getUTCDate())
                    + 'T' + pad(this.getUTCHours())
                    + ':' + pad(this.getUTCMinutes())
                    + ':' + pad(this.getUTCSeconds())
                    + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
            };
        }());
    }

    String.format = function () {
        var source = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++)
            source = source.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i + 1]);

        source = source.replace(/\{[0-9]\}/g, "");
        return source;
    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    // Function to create new class
    ej.defineClass = function (className, constructor, proto, replace) {
        /// <summary>Creates the javascript class with given namespace & class name & constructor etc</summary>
        /// <param name="className" type="String">class name prefixed with namespace</param>
        /// <param name="constructor" type="Function">constructor function</param>
        /// <param name="proto" type="Object">prototype for the class</param>
        /// <param name="replace" type="Boolean">[Optional]Replace existing class if exists</param>
        /// <returns type="Function">returns the class function</returns>
        if (!className || !proto) return undefined;

        var parts = className.split(".");

        // Object creation
        var obj = window, i = 0;
        for (; i < parts.length - 1; i++) {

            if (ej.isNullOrUndefined(obj[parts[i]]))
                obj[parts[i]] = {};

            obj = obj[parts[i]];
        }

        if (replace || ej.isNullOrUndefined(obj[parts[i]])) {

            //constructor
            constructor = typeof constructor === "function" ? constructor : function () {
            };

            obj[parts[i]] = constructor;

            // prototype
            obj[parts[i]].prototype = proto;
        }

        return obj[parts[i]];
    };

    ej.util = {
        getNameSpace: function (className) {
            /// <summary>Internal function, this will create namespace for plugins using class name</summary>
            /// <param name="className" type="String"></param>
            /// <returns type="String"></returns>
            var splits = className.toLowerCase().split(".");
            splits[0] === "ej" && (splits[0] = "e");

            return splits.join(ej.consts.NamespaceJoin);
        },

        getObject: function (nameSpace, from) {
            if (!from || !nameSpace) return undefined;
			(typeof(nameSpace) != "string") && (nameSpace = JSON.stringify(nameSpace));
            var value = from, splits = nameSpace.split('.');

            for (var i = 0; i < splits.length; i++) {

                if (ej.util.isNullOrUndefined(value)) break;

                value = value[splits[i]];
            }

            return value;
        },

        createObject: function (nameSpace, value, initIn) {
            var splits = nameSpace.split('.'), start = initIn || window, from = start, i, t, length = splits.length;

            for (i = 0; i < length; i++) {
                t = splits[i];
                if (i + 1 == length)
                    from[t] = value;
                else if (ej.isNullOrUndefined(from[t]))
                    from[t] = {};

                from = from[t];
            }

            return start;
        },

        isNullOrUndefined: function (value) {
            /// <summary>Util to check null or undefined</summary>
            /// <param name="value" type="Object"></param>
            /// <returns type="Boolean"></returns>
            return value === undefined || value === null;
        },
        exportAll: function (action, controlIds) {
            var inputAttr = [], widget, locale = [], index, controlEle, controlInstance, controlObject, modelClone;
            var attr = { action: action, method: 'post', "data-ajax": "false" };
            var form = ej.buildTag('form', "", null, attr);
            if (controlIds.length != 0) {
                for (var i = 0; i < controlIds.length; i++) {
                    index = i;
                    controlEle = $("#" + controlIds[i]);
                    controlInstance = $("#" + controlIds[i]).data();
                    widget = controlInstance["ejWidgets"];
                    controlObject = $(controlEle).data(widget[0]);
                    locale.push({ id: controlObject._id, locale: controlObject.model.locale });
                    if (!ej.isNullOrUndefined(controlObject)) {
                        modelClone = controlObject._getExportModel(controlObject.model);
                        inputAttr.push({ name: widget[0], type: 'hidden', value: controlObject.stringify(modelClone) });
                        var input = ej.buildTag('input', "", null, inputAttr[index]);
                        form.append(input);
                    }
                }
                $('body').append(form);
                form.submit();
                setTimeout(function () {
                    var ctrlInstance, ctrlObject;
                    if (locale.length) {
                        for (var j = 0; j < locale.length; j++) {
                            if (!ej.isNullOrUndefined(locale[j].locale)) {
                                ctrlInstance = $("#" + locale[j].id).data();
                                widget = ctrlInstance["ejWidgets"];
                                ctrlObject = $("#" + locale[j].id).data(widget[0]);
                                ctrlObject.model.locale = locale[j].locale;
                            }
                        }
                    }
                }, 0);
                form.remove();
            }
            return true;
        },
        print: function (element, printWin) {
            var $div = ej.buildTag('div')
            var elementClone = element.clone();
            $div.append(elementClone);
            if (!printWin)
                var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
            printWin.document.write('<!DOCTYPE html>');
            var links = $('head').find('link').add("style");
            if (ej.browserInfo().name === "msie") {
                var a = ""
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.write('<html><head></head><body>' + a + $div[0].innerHTML + '</body></html>');
            }
            else {
                var a = ""
                printWin.document.write('<html><head>')
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.writeln(a + '</head><body>')
                printWin.document.writeln($div[0].innerHTML + '</body></html>')
            }
            printWin.document.close();
            printWin.focus();
            setTimeout(function () {
                if (!ej.isNullOrUndefined(printWin.window)) {
                    printWin.print();
                    setTimeout(function () { printWin.close() }, 1000);
                }
            }, 1000);
        },
        ieClearRemover: function (element) {
            var searchBoxHeight = $(element).height();
            element.style.paddingTop = parseFloat(searchBoxHeight / 2) + "px";
            element.style.paddingBottom = parseFloat(searchBoxHeight / 2) + "px";
            element.style.height = "1px";
            element.style.lineHeight = "1px";
        },
        //To send ajax request
        sendAjaxRequest: function (ajaxOptions) {
            $.ajax({
                type: ajaxOptions.type,
                cache: ajaxOptions.cache,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                contentType: ajaxOptions.contentType,
                async: ajaxOptions.async,
                success: ajaxOptions.successHandler,
                error: ajaxOptions.errorHandler,
                beforeSend: ajaxOptions.beforeSendHandler,
                complete: ajaxOptions.completeHandler
            });
        },

        buildTag: function (tag, innerHtml, styles, attrs) {
            /// <summary>Helper to build jQuery element</summary>
            /// <param name="tag" type="String">tagName#id.cssClass</param>
            /// <param name="innerHtml" type="String"></param>
            /// <param name="styles" type="Object">A set of key/value pairs that configure styles</param>
            /// <param name="attrs" type="Object">A set of key/value pairs that configure attributes</param>
            /// <returns type="jQuery"></returns>
            var tagName = /^[a-z]*[0-9a-z]+/ig.exec(tag)[0];

           var id = /#([_a-z0-9-&@\/\\,+()$~%:*?<>{}\[\]]+\S)/ig.exec(tag);
            id = id ? id[id.length - 1].replace(/[&@\/\\,+()$~%.:*?<>{}\[\]]/g, ''): undefined;

            var className = /\.([a-z]+[-_0-9a-z ]+)/ig.exec(tag);
            className = className ? className[className.length - 1] : undefined;

            return $(document.createElement(tagName))
                .attr(id ? { "id": id } : {})
                .addClass(className || "")
                .css(styles || {})
                .attr(attrs || {})
                .html(innerHtml || "");
        },
        _preventDefaultException: function (el, exceptions) {
            if (el) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }
            }

            return false;
        },

        //Gets the maximum z-index in the document
        getMaxZindex: function () {
            var maxZ = 1;
            maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
                if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                    return parseInt($(e).css('z-index')) || 1;
            })
            );
            if (maxZ == undefined || maxZ == null)
                maxZ = 1;
            return maxZ;
        },

        //To prevent default actions for the element
        blockDefaultActions: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        },

        //To get dimensions of the element when its hidden
        getDimension: function (element, method) {
            var value;
            var $hidden = $(element).parents().andSelf().filter(':hidden');
            if ($hidden) {
                var prop = { visibility: 'hidden', display: 'block' };
                var tmp = [];
                $hidden.each(function () {
                    var temp = {}, name;
                    for (name in prop) {
                        temp[name] = this.style[name];
                        this.style[name] = prop[name];
                    }
                    tmp.push(temp);
                });
                value = /(outer)/g.test(method) ?
                $(element)[method](true) :
               $(element)[method]();

                $hidden.each(function (i) {
                    var temp = tmp[i], name;
                    for (name in prop) {
                        this.style[name] = temp[name];
                    }
                });
            }
            return value;
        },
        //Get triggers when transition End
        transitionEndEvent: function () {
            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[ej.userAgent()];
        },
        //Get triggers when transition End
        animationEndEvent: function () {
            var animationEnd = {
                '': 'animationend',
                'webkit': 'webkitAnimationEnd',
                'Moz': 'animationend',
                'O': 'webkitAnimationEnd',
                'ms': 'animationend'
            };

            return animationEnd[ej.userAgent()];
        },
        //To return the start event to bind for element
        startEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchstart" : "mousedown";
        },
        //To return end event to bind for element
        endEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchend" : "mouseup"
        },
        //To return move event to bind for element
        moveEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? ($.support.hasPointer && !ej.isMobile()) ? "ejtouchmove" : "touchmove" : "mousemove";
        },
        //To return cancel event to bind for element
        cancelEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchcancel" : "mousecancel";
        },
        //To return tap event to bind for element
        tapEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "tap" : "click";
        },
        //To return tap hold event to bind for element
        tapHoldEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "taphold" : "click";
        },
        //To check whether its Device
        isDevice: function () {
            if (ej.getBooleanVal($('head'), 'data-ej-forceset', false))
                return ej.getBooleanVal($('head'), 'data-ej-device', this._device());
            else
                return this._device();
        },
        //To check whether its portrait or landscape mode
        isPortrait: function () {
            var elem = document.documentElement;
            return (elem) && ((elem.clientWidth / elem.clientHeight) < 1.1);
        },
        //To check whether its in lower resolution
        isLowerResolution: function () {
            return ((window.innerWidth <= 640 && ej.isPortrait() && ej.isDevice()) || (window.innerWidth <= 800 && !ej.isDevice()) || (window.innerWidth <= 800 && !ej.isPortrait() && ej.isWindows() && ej.isDevice()) || ej.isMobile());
        },
        //To check whether its iOS web view
        isIOSWebView: function () {
            return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent));
        },
        //To check whether its Android web view
        isAndroidWebView: function () {
            return (!(typeof (Android) === "undefined"));
        },
        //To check whether its windows web view
        isWindowsWebView: function () {
            return location.href.indexOf("x-wmapp") != -1;
        },
        _device: function () {
            return (/Android|BlackBerry|iPhone|iPad|iPod|IEMobile|kindle|windows\sce|palm|smartphone|iemobile|mobile|pad|xoom|sch-i800|playbook/i.test(navigator.userAgent.toLowerCase()));
        },
        //To check whether its Mobile
        isMobile: function () {
            return ((/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase()) && /mobile/i.test(navigator.userAgent.toLowerCase()))) || (ej.getBooleanVal($('head'), 'data-ej-mobile', false) === true);
        },
        //To check whether its Tablet
        isTablet: function () {
            return (/ipad|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) || (ej.getBooleanVal($('head'), 'data-ej-tablet', false) === true) || (!ej.isMobile() && ej.isDevice());
        },
        //To check whether its Touch Device
        isTouchDevice: function () {
            return (('ontouchstart' in window || (window.navigator.msPointerEnabled && ej.isMobile())) && this.isDevice());
        },
        //To get the outerHTML string for object
        getClearString: function (string) {
            return $.trim(string.replace(/\s+/g, " ").replace(/(\r\n|\n|\r)/gm, "").replace(new RegExp("\>[\n\t ]+\<", "g"), "><"));
        },
        //Get the attribute value with boolean type of element
        getBooleanVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value.toLowerCase() == "true";
            else
                return option;
        },
        //Gets the Skew class based on the element current position
        _getSkewClass: function (item, pageX, pageY) {
            var itemwidth = item.width();
            var itemheight = item.height();
            var leftOffset = item.offset().left;
            var rightOffset = item.offset().left + itemwidth;
            var topOffset = item.offset().top;
            var bottomOffset = item.offset().top + itemheight;
            var widthoffset = itemwidth * 0.3;
            var heightoffset = itemheight * 0.3;
            if (pageX < leftOffset + widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topleft";
            if (pageX > rightOffset - widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topright";
            if (pageX > rightOffset - widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomright";
            if (pageX < leftOffset + widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomleft";
            if (pageX > leftOffset + widthoffset && pageY < topOffset + heightoffset && pageX < rightOffset - widthoffset)
                return "e-m-skew-top";
            if (pageX < leftOffset + widthoffset)
                return "e-m-skew-left";
            if (pageX > rightOffset - widthoffset)
                return "e-m-skew-right";
            if (pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottom";
            return "e-m-skew-center";
        },
        //Removes the added Skew class on the element
        _removeSkewClass: function (element) {
            $(element).removeClass("e-m-skew-top e-m-skew-bottom e-m-skew-left e-m-skew-right e-m-skew-topleft e-m-skew-topright e-m-skew-bottomleft e-m-skew-bottomright e-m-skew-center e-skew-top e-skew-bottom e-skew-left e-skew-right e-skew-topleft e-skew-topright e-skew-bottomleft e-skew-bottomright e-skew-center");
        },
        //Object.keys  method to support all the browser including IE8.
        _getObjectKeys: function (obj) {
            var i, keys = [];
            obj = Object.prototype.toString.call(obj) === Object.prototype.toString() ? obj : {};
            if (!Object.keys) {
                for (i in obj) {
                    if (obj.hasOwnProperty(i))
                        keys.push(i);
                }
                return keys;
            }
            if (Object.keys)
                return Object.keys(obj);
        },
        _touchStartPoints: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt;
                object._distX = 0;
                object._distY = 0;
                object._moved = false;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
            }
        },
        _isTouchMoved: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt,
                deltaX = point.pageX - object._pointX,
                deltaY = point.pageY - object._pointY,
                timestamp = Date.now(),
                newX, newY,
                absDistX, absDistY;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
                object._distX += deltaX;
                object._distY += deltaY;
                absDistX = Math.abs(object._distX);
                absDistY = Math.abs(object._distY);
                return !(absDistX < 5 && absDistY < 5);
            }
        },
        //To bind events for element
        listenEvents: function (selectors, eventTypes, handlers, remove, pluginObj, disableMouse) {
            for (var i = 0; i < selectors.length; i++) {
                ej.listenTouchEvent(selectors[i], eventTypes[i], handlers[i], remove, pluginObj, disableMouse);
            }
        },
        //To bind touch events for element
        listenTouchEvent: function (selector, eventType, handler, remove, pluginObj, disableMouse) {
            var event = remove ? "removeEventListener" : "addEventListener";
            var jqueryEvent = remove ? "off" : "on";
            var elements = $(selector);
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                switch (eventType) {
                    case "touchstart":
                        ej._bindEvent(element, event, eventType, handler, "mousedown", "MSPointerDown", "pointerdown", disableMouse);
                        break;
                    case "touchmove":
                        ej._bindEvent(element, event, eventType, handler, "mousemove", "MSPointerMove", "pointermove", disableMouse);
                        break;
                    case "touchend":
                        ej._bindEvent(element, event, eventType, handler, "mouseup", "MSPointerUp", "pointerup", disableMouse);
                        break;
                    case "touchcancel":
                        ej._bindEvent(element, event, eventType, handler, "mousecancel", "MSPointerCancel", "pointercancel", disableMouse);
                        break;
                    case "tap": case "taphold": case "ejtouchmove": case "click":
                        $(element)[jqueryEvent](eventType, handler);
                        break;
                    default:
                        if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)
                            pluginObj["_on"]($(element), eventType, handler);
                        else
                            element[event](eventType, handler, true);
                        break;
                }
            }
        },
        //To bind events for element
        _bindEvent: function (element, event, eventType, handler, mouseEvent, pointerEvent, ie11pointerEvent, disableMouse) {
            if ($.support.hasPointer)
                element[event](window.navigator.pointerEnabled ? ie11pointerEvent : pointerEvent, handler, true);
            else
                element[event](eventType, handler, true);
        },
        _browser: function () {
            return (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : (/trident/i).test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
        },
        styles: document.createElement('div').style,
        /**
       * To get the userAgent Name     
       * @example             
       * &lt;script&gt;
       *       ej.userAgent();//return user agent name
       * &lt;/script&gt         
       * @memberof AppView
       * @instance
       */
        userAgent: function () {
            var agents = 'webkitT,t,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = agents.length;

            for (; i < l; i++) {
                t = agents[i] + 'ransform';
                if (t in ej.styles) {
                    return agents[i].substr(0, agents[i].length - 1);
                }
            }

            return false;
        },
        addPrefix: function (style) {
            if (ej.userAgent() === '') return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return ej.userAgent() + style;
        },
        //To Prevent Default Exception

        //To destroy the mobile widgets
        destroyWidgets: function (element) {
            var dataEl = $(element).find("[data-role *= ejm]");
            dataEl.each(function (index, element) {
                var $element = $(element);
                var plugin = $element.data("ejWidgets");
                if (plugin)
                    $element[plugin]("destroy");
            });
        },
        //Get the attribute value of element
        getAttrVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },

        // Get the offset value of element
        getOffset: function (ele) {
            var pos = {};
            var offsetObj = ele.offset() || { left: 0, top: 0 };
            $.extend(true, pos, offsetObj);
            if ($("body").css("position") != "static") {
                var bodyPos = $("body").offset();
                pos.left -= bodyPos.left;
                pos.top -= bodyPos.top;
            }
            return pos;
        },

        // Z-index calculation for the element
        getZindexPartial: function (element, popupEle) {
            if (!ej.isNullOrUndefined(element) && element.length > 0) {
                var parents = element.parents(), bodyEle;
                bodyEle = $('body').children();
                if (!ej.isNullOrUndefined(element) && element.length > 0)
                    bodyEle.splice(bodyEle.index(popupEle), 1);
                $(bodyEle).each(function (i, ele) { parents.push(ele); });

                var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                    if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
                }));
                if (!maxZ || maxZ < 10000) maxZ = 10000;
                else maxZ += 1;
                return maxZ;
            }
        },

        isValidAttr: function (element, attribute) {
            var element = $(element)[0];
            if (typeof element[attribute] != "undefined")
                return true;
            else {
                var _isValid = false;
                $.each(element, function (key) {
                    if (key.toLowerCase() == attribute.toLowerCase()) {
                        _isValid = true;
                        return false;
                    }
                });
            }
            return _isValid;
        }

    };

    $.extend(ej, ej.util);

    // base class for all ej widgets. It will automatically inhertied
    ej.widgetBase = {
        droppables: { 'default': [] },
        resizables: { 'default': [] },

        _renderEjTemplate: function (selector, data, index, prop, ngTemplateType) {
            var type = null;
            if (typeof selector === "object" || selector.startsWith("#") || selector.startsWith("."))
                type = $(selector).attr("type");
            if (type) {
                type = type.toLowerCase();
                if (ej.template[type])
                    return ej.template[type](this, selector, data, index, prop);
            }
            // For ejGrid Angular2 Template Support
            else if (!ej.isNullOrUndefined(ngTemplateType))
                 return ej.template['text/x-'+ ngTemplateType](this, selector, data, index, prop);
            return ej.template.render(this, selector, data, index, prop);
        },

        destroy: function () {

            if (this._trigger("destroy"))
                return;

            if (this.model.enablePersistence) {
                this.persistState();
                $(window).off("unload", this._persistHandler);
            }

            try {
                this._destroy();
            } catch (e) { }

            var arr = this.element.data("ejWidgets") || [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == this.pluginName) {
                    arr.splice(i, 1);
                }
            }
            if (!arr.length)
                this.element.removeData("ejWidgets");

            while (this._events) {
                var item = this._events.pop(), args = [];

                if (!item)
                    break;

                for (var i = 0; i < item[1].length; i++)
                    if (!$.isPlainObject(item[1][i]))
                        args.push(item[1][i]);

                $.fn.off.apply(item[0], args);
            }

            this._events = null;

            this.element
                .removeClass(ej.util.getNameSpace(this.sfType))
                .removeClass("e-js")
                .removeData(this.pluginName);

            this.element = null;
            this.model = null;
        },

        _on: function (element) {
            if (!this._events)
                this._events = [];
            var args = [].splice.call(arguments, 1, arguments.length - 1);

            var handler = {}, i = args.length;
            while (handler && typeof handler !== "function") {
                handler = args[--i];
            }

            args[i] = ej.proxy(args[i], this);

            this._events.push([element, args, handler, args[i]]);

            $.fn.on.apply(element, args);

            return this;
        },

        _off: function (element, eventName, selector, handlerObject) {
            var e = this._events, temp;
            if (!e || !e.length)
                return this;
            if (typeof selector == "function") {
                temp = handlerObject;
                handlerObject = selector;
                selector = temp;
            }
            var t = (eventName.match(/\S+/g) || [""]);
            for (var i = 0; i < e.length; i++) {
                var arg = e[i],
                r = arg[0].length && (!handlerObject || arg[2] === handlerObject) && (arg[1][0] === eventName || t[0]) && (!selector || arg[1][1] === selector) && $.inArray(element[0], arg[0]) > -1;
                if (r) {
                    $.fn.off.apply(element, handlerObject ? [eventName, selector, arg[3]] : [eventName, selector]);
                    e.splice(i, 1);
                    break;
                }
            }

            return this;
        },

        // Client side events wire-up / trigger helper.
        _trigger: function (eventName, eventProp) {
            var fn = null, returnValue, args, clientProp = {};
            $.extend(clientProp, eventProp)

            if (eventName in this.model)
                fn = this.model[eventName];

            if (fn) {
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }

                if ($.isFunction(fn)) {

                    args = ej.event(eventName, this.model, eventProp);

                    var scopeFn = this.model["_applyScope"];

                    returnValue = fn.call(this, args);

                    scopeFn && scopeFn.call();

                    // sending changes back - deep copy option should not be enabled for this $.extend 
                    if (eventProp) $.extend(eventProp, args);

                    if (args.cancel || !ej.isNullOrUndefined(returnValue))
                        return returnValue === false || args.cancel;
                }
            }

            var isPropDefined = Boolean(eventProp);
            eventProp = eventProp || {};
            eventProp.originalEventType = eventName;
            eventProp.type = this.pluginName + eventName;

            args = $.Event(eventProp.type, ej.event(eventProp.type, this.model, eventProp));

            this.element && this.element.trigger(args);

            // sending changes back - deep copy option should not be enabled for this $.extend 
            if (isPropDefined) $.extend(eventProp, args);

            if (ej.isOnWebForms && args.cancel == false && this.model.serverEvents && this.model.serverEvents.length)
                ej.raiseWebFormsServerEvents(eventName, eventProp, clientProp);

            return args.cancel;
        },

        setModel: function (options, forceSet) {
            // check for whether to apply values are not. if _setModel function is defined in child,
            //  this will call that function and validate it using return value

            if (this._trigger("modelChange", { "changes": options }))
                return;

            for (var prop in options) {
                if (!forceSet) {
                    if (this.model[prop] === options[prop]) {
                        delete options[prop];
                        continue;
                    }
                    if ($.isPlainObject(options[prop])) {
                        iterateAndRemoveProps(this.model[prop], options[prop]);
                        if ($.isEmptyObject(options[prop])) {
                            delete options[prop];
                            continue;
                        }
                    }
                }

                if (this.dataTypes) {
                    var returnValue = this._isValidModelValue(prop, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + prop + " - " + returnValue;
                }
                if (this.model.notifyOnEachPropertyChanges && this.model[prop] !== options[prop]) {
                    var arg = {
                        oldValue: this.model[prop],
                        newValue: options[prop]
                    };

                    options[prop] = this._trigger(prop + "Change", arg) ? this.model[prop] : arg.newValue;
                }
            }
            if ($.isEmptyObject(options))
                return;

            if (this._setFirst) {
                var ds = options.dataSource;
                if (ds) delete options.dataSource;

                $.extend(true, this.model, options);
                if (ds) {
                    this.model.dataSource = (ds instanceof Array) ? ds.slice() : ds;
                    options["dataSource"] = this.model.dataSource;
                }
                !this._setModel || this._setModel(options);

            } else if (!this._setModel || this._setModel(options) !== false) {
                $.extend(true, this.model, options);
            }
            if ("enablePersistence" in options) {
                this._setState(options.enablePersistence);
            }
        },
        option: function (prop, value, forceSet) {
            if (!prop)
                return this.model;

            if ($.isPlainObject(prop))
                return this.setModel(prop, forceSet);

            if (typeof prop === "string") {
                prop = prop.replace(/^model\./, "");
                var oldValue = ej.getObject(prop, this.model);

                if (value === undefined && !forceSet)
                    return oldValue;

                if (prop === "enablePersistence")
                    return this._setState(value);

                if (forceSet && value === ej.extensions.modelGUID) {
                    return this._setModel(ej.createObject(prop, ej.getObject(prop, this.model), {}));
                }

                if (forceSet || ej.getObject(prop, this.model) !== value)
                    return this.setModel(ej.createObject(prop, value, {}), forceSet);
            }
            return undefined;
        },

        _isValidModelValue: function (prop, types, options) {
            var value = types[prop], option = options[prop], returnValue;

            if (!value)
                return true;

            if (typeof value === "string") {
                if (value == "enum") {
                    options[prop] = option ? option.toString().toLowerCase() : option;
                    value = "string";
                }

                if (value === "array") {
                    if (Object.prototype.toString.call(option) === '[object Array]')
                        return true;
                }
                else if (value === "data") {
                    return true;
                }
                else if (value === "parent") {
                    return true;
                }
                else if (typeof option === value)
                    return true;

                return "Expected type - " + value;
            }

            if (option instanceof Array) {
                for (var i = 0; i < option.length; i++) {
                    returnValue = this._isValidModelValue(prop, types, option[i]);
                    if (returnValue !== true) {
                        return " [" + i + "] - " + returnValue;
                    }
                }
                return true;
            }

            for (var innerProp in option) {
                returnValue = this._isValidModelValue(innerProp, value, option);
                if (returnValue !== true)
                    return innerProp + " : " + returnValue;
            }

            return true;
        },

        _returnFn: function (obj, propName) {
            if (propName.indexOf('.') != -1) {
                this._returnFn(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
            }
            else
                obj[propName] = obj[propName].call(obj.propName);
        },

        _removeCircularRef: function (obj) {
            var seen = [];
            function detect(obj, key, parent) {
                if (typeof obj != 'object') { return; }
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (val) {
                        return jQuery.inArray(val, this);
                    };
                }
                if (seen.indexOf(obj) >= 0) {
                    delete parent[key];
                    return;
                }
                seen.push(obj);
                for (var k in obj) { //dive on the object's children
                    if (obj.hasOwnProperty(k)) { detect(obj[k], k, obj); }
                }
                seen.pop();
                return;
            }
            detect(obj, 'obj', null);
            return obj;
        },

        stringify: function (model, removeCircular) {
            var observables = this.observables;
            for (var k = 0; k < observables.length; k++) {
                var val = ej.getObject(observables[k], model);
                if (!ej.isNullOrUndefined(val) && typeof (val) === "function")
                    this._returnFn(model, observables[k]);
            }
            if (removeCircular) model = this._removeCircularRef(model);
            return JSON.stringify(model);
        },

        _setState: function (val) {
            if (val === true) {
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
            } else {
                this.deleteState();
                $(window).off("unload", this._persistHandler);
            }
        },

        _removeProp: function (obj, propName) {
            if (!ej.isNullOrUndefined(obj)) {
                if (propName.indexOf('.') != -1) {
                    this._removeProp(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
                }
                else
                    delete obj[propName];
            }
        },

        persistState: function () {
            var model;

            if (this._ignoreOnPersist) {
                model = copyObject({}, this.model);
                for (var i = 0; i < this._ignoreOnPersist.length; i++) {
                    this._removeProp(model, this._ignoreOnPersist[i]);
                }
                model.ignoreOnPersist = this._ignoreOnPersist;
            } else if (this._addToPersist) {
                model = {};
                for (var i = 0; i < this._addToPersist.length; i++) {
                    ej.createObject(this._addToPersist[i], ej.getObject(this._addToPersist[i], this.model), model);
                }
                model.addToPersist = this._addToPersist;
            } else {
                model = copyObject({}, this.model);
            }

            if (this._persistState) {
                model.customPersists = {};
                this._persistState(model.customPersists);
            }

            if (window.localStorage) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") == null)
                    window.localStorage.setItem("persistKey", ej.persistStateVersion);
                window.localStorage.setItem("$ej$" + this.pluginName + this._id, JSON.stringify(model));
            }
            else if (document.cookie) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") == null)
                    ej.cookie.set("persistKey", ej.persistStateVersion);
                ej.cookie.set("$ej$" + this.pluginName + this._id, model);
            }
        },

        deleteState: function () {
            if (window.localStorage)
                window.localStorage.removeItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                ej.cookie.set("$ej$" + this.pluginName + this._id, model, new Date());
        },

        restoreState: function (silent) {
            var value = null;
            if (window.localStorage)
                value = window.localStorage.getItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                value = ej.cookie.get("$ej$" + this.pluginName + this._id);

            if (value) {
                var model = JSON.parse(value);

                if (this._restoreState) {
                    this._restoreState(model.customPersists);
                    delete model.customPersists;
                }

                if (ej.isNullOrUndefined(model) === false)
                    if (!ej.isNullOrUndefined(model.ignoreOnPersist)) {
                        this._ignoreOnPersist = model.ignoreOnPersist;
                        delete model.ignoreOnPersist;
                    } else if (!ej.isNullOrUndefined(model.addToPersist)) {
                        this._addToPersist = model.addToPersist;
                        delete model.addToPersist;
                    }
            }
            if (!ej.isNullOrUndefined(model) && !ej.isNullOrUndefined(this._ignoreOnPersist)) {
                for (var i in this._ignoreOnPersist) {
                    if (this._ignoreOnPersist[i].indexOf('.') !== -1)
                        ej.createObject(this._ignoreOnPersist[i], ej.getObject(this._ignoreOnPersist[i], this.model), model);
                    else
                        model[this._ignoreOnPersist[i]] = this.model[this._ignoreOnPersist[i]];
                }
                this.model = model;
            }
            else
                this.model = $.extend(true, this.model, model);

            if (!silent && value && this._setModel)
                this._setModel(this.model);
        },

        //to prevent persistence
        ignoreOnPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    this._ignoreOnPersist.push(collection[i]);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    var index = this._addToPersist.indexOf(collection[i]);
                    this._addToPersist.splice(index, 1);
                }
            }
        },

        //to maintain persistence
        addToPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    var index = this._ignoreOnPersist.indexOf(collection[i]);
                    this._ignoreOnPersist.splice(index, 1);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    if ($.inArray(collection[i], this._addToPersist) === -1)
                        this._addToPersist.push(collection[i]);
                }
            }
        },

        // Get formatted text 
        formatting: function (formatstring, str, locale) {
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            locale = ej.preferredCulture(locale) ? locale : "en-US";
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (typeof (str) == "string" && $.isNumeric(str))
                str = Number(str);
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], locale) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], locale);
                } else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            } else if (s.startsWith("{") && !s.startsWith("{0:")) {
                var fVal = s.split(""), str = (str || "") + "", strSplt = str.split(""), formats = /[0aA\*CN<>\?]/gm;
                for (var f = 0, f, val = 0; f < fVal.length; f++)
                    fVal[f] = formats.test(fVal[f]) ? "{" + val++ + "}" : fVal[f];
                return String.format.apply(String, [fVal.join("")].concat(strSplt)).replace('{', '').replace('}', '');
            } else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            } else {
                return this.data.Value;
            }
        },
    };

    ej.WidgetBase = function () {
    }

    var iterateAndRemoveProps = function (source, target) {
        for (var prop in source) {
            if (source[prop] === target[prop])
                delete target[prop];
            if ($.isPlainObject(target[prop]) && $.isPlainObject(source[prop]))
                iterateAndRemoveProps(source[prop], target[prop]);
        }
    }

    ej.widget = function (pluginName, className, proto) {
        /// <summary>Widget helper for developers, this set have predefined function to jQuery plug-ins</summary>
        /// <param name="pluginName" type="String">the plugin name that will be added in jquery.fn</param>
        /// <param name="className" type="String">the class name for your plugin, this will help create default cssClas</param>
        /// <param name="proto" type="Object">prototype for of the plug-in</param>

        if (typeof pluginName === "object") {
            proto = className;
            for (var prop in pluginName) {
                var name = pluginName[prop];

                if (name instanceof Array) {
                    proto._rootCSS = name[1];
                    name = name[0];
                }

                ej.widget(prop, name, proto);

                if (pluginName[prop] instanceof Array)
                    proto._rootCSS = "";
            }

            return;
        }

        var nameSpace = proto._rootCSS || ej.getNameSpace(className);

        proto = ej.defineClass(className, function (element, options) {

            this.sfType = className;
            this.pluginName = pluginName;
            this.instance = pInstance;

            if (ej.isNullOrUndefined(this._setFirst))
                this._setFirst = true;

            this["ob.values"] = {};

            $.extend(this, ej.widgetBase);

            if (this.dataTypes) {
                for (var property in options) {
                    var returnValue = this._isValidModelValue(property, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + property + " - " + returnValue;
                }
            }

            var arr = (element.data("ejWidgets") || []);
            arr.push(pluginName);
            element.data("ejWidgets", arr);

            for (var i = 0; ej.widget.observables && this.observables && i < this.observables.length; i++) {
                var t = ej.getObject(this.observables[i], options);
                if (t) ej.createObject(this.observables[i], ej.widget.observables.register(t, this.observables[i], this, element), options);
            }

            this.element = element.jquery ? element : $(element);
            this.model = copyObject(true, {}, proto.prototype.defaults, options);
            this.model.keyConfigs = copyObject(this.keyConfigs);

            this.element.addClass(nameSpace + " e-js").data(pluginName, this);

            this._id = element[0].id;

            if (this.model.enablePersistence) {
                if (window.localStorage && !ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") != ej.persistStateVersion) {
                    for (var i in window.localStorage) {
                        if (i.indexOf("$ej$") != -1) {
                            window.localStorage.removeItem(i); //removing the previously stored plugin item from local storage
							window.localStorage.setItem("persistKey", ej.persistStateVersion);
						}				
                    }
                }
                else if (document.cookie && !ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") != ej.persistStateVersion) {
                    var splits = document.cookie.split(/; */);
                    for (var k in splits) {
                        if (k.indexOf("$ej$") != -1) {
                            ej.cookie.set(k.split("=")[0], model, new Date()); //removing the previously stored plugin item from local storage
							ej.cookie.set("persistKey", ej.persistStateVersion);
						}		
                    }
                }
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
                this.restoreState(true);
            }

            this._init(options);

            if (typeof this.model.keyConfigs === "object" && !(this.model.keyConfigs instanceof Array)) {
                var requiresEvt = false;
                if (this.model.keyConfigs.focus)
                    this.element.attr("accesskey", this.model.keyConfigs.focus);

                for (var keyProps in this.model.keyConfigs) {
                    if (keyProps !== "focus") {
                        requiresEvt = true;
                        break;
                    }
                }

                if (requiresEvt && this._keyPressed) {
                    var el = element, evt = "keydown";

                    if (this.keySettings) {
                        el = this.keySettings.getElement ? this.keySettings.getElement() || el : el;
                        evt = this.keySettings.event || evt;
                    }

                    this._on(el, evt, function (e) {
                        if (!this.model.keyConfigs) return;

                        var action = keyFn.getActionFromCode(this.model.keyConfigs, e.which, e.ctrlKey, e.shiftKey, e.altKey);
                        var arg = {
                            code: e.which,
                            ctrl: e.ctrlKey,
                            alt: e.altKey,
                            shift: e.shiftKey
                        };
                        if (!action) return;

                        if (this._keyPressed(action, e.target, arg, e) === false)
                            e.preventDefault();
                    });
                }
            }
            this._trigger("create");
        }, proto);

        $.fn[pluginName] = function (options) {
            var opt = options, args;
            for (var i = 0; i < this.length; i++) {

                var $this = $(this[i]),
                    pluginObj = $this.data(pluginName),
                    isAlreadyExists = pluginObj && $this.hasClass(nameSpace),
                    obj = null;

                if (this.length > 0 && $.isPlainObject(opt))
                    options = ej.copyObject({}, opt);

                // ----- plug-in creation/init
                if (!isAlreadyExists) {
                    if (proto.prototype._requiresID === true && !$(this[i]).attr("id")) {
                        $this.attr("id", getUid("ejControl_"));
                    }
                    if (!options || typeof options === "object") {
                        if (proto.prototype.defaults && !ej.isNullOrUndefined(ej.setCulture) && "locale" in proto.prototype.defaults && pluginName != "ejChart") {
                            if (options && !("locale" in options)) options.locale = ej.setCulture().name;
                            else if (ej.isNullOrUndefined(options)) {
                                options = {}; options.locale = ej.setCulture().name;
                            }
                        }
                        new proto($this, options);
                    }
                    else {
                        throwError(pluginName + ": methods/properties can be accessed only after plugin creation");
                    }
                    continue;
                }

                if (!options) continue;

                args = [].slice.call(arguments, 1);

                if (this.length > 0 && args[0] && opt === "option" && $.isPlainObject(args[0])) {
                    args[0] = ej.copyObject({}, args[0]);
                }

                // --- Function/property set/access
                if ($.isPlainObject(options)) {
                    // setModel using JSON object
                    pluginObj.setModel(options);
                }

                    // function/property name starts with "_" is private so ignore it.
                else if (options.indexOf('_') !== 0
                    && !ej.isNullOrUndefined(obj = ej.getObject(options, pluginObj))
                    || options.indexOf("model.") === 0) {

                    if (!obj || !$.isFunction(obj)) {

                        // if property is accessed, then break the jquery chain
                        if (arguments.length == 1)
                            return obj;

                        //setModel using string input
                        pluginObj.option(options, arguments[1]);

                        continue;
                    }

                    var value = obj.apply(pluginObj, args);

                    // If function call returns any value, then break the jquery chain
                    if (value !== undefined)
                        return value;

                } else {
                    throwError(className + ": function/property - " + options + " does not exist");
                }
            }
            if (pluginName.indexOf("ejm") != -1)
                ej.widget.registerInstance($this, pluginName, className, proto.prototype);
            // maintaining jquery chain
            return this;
        };

        ej.widget.register(pluginName, className, proto.prototype);
        ej.loadLocale(pluginName);
    };

    ej.loadLocale = function (pluginName) {
        var i, len, locales = ej.locales;
        for (i = 0, len = locales.length; i < len; i++)
            $.fn["Locale_" + locales[i]](pluginName);
    };


    $.extend(ej.widget, (function () {
        var _widgets = {}, _registeredInstances = [],

        register = function (pluginName, className, prototype) {
            if (!ej.isNullOrUndefined(_widgets[pluginName]))
                throwError("ej.widget : The widget named " + pluginName + " is trying to register twice.");

            _widgets[pluginName] = { name: pluginName, className: className, proto: prototype };

            ej.widget.extensions && ej.widget.extensions.registerWidget(pluginName);
        },
        registerInstance = function (element, pluginName, className, prototype) {
            _registeredInstances.push({ element: element, pluginName: pluginName, className: className, proto: prototype });
        }

        return {
            register: register,
            registerInstance: registerInstance,
            registeredWidgets: _widgets,
            registeredInstances: _registeredInstances
        };

    })());

    ej.widget.destroyAll = function (elements) {
        if (!elements || !elements.length) return;

        for (var i = 0; i < elements.length; i++) {
            var data = elements.eq(i).data(), wds = data["ejWidgets"];
            if (wds && wds.length) {
                for (var j = 0; j < wds.length; j++) {
                    if (data[wds[j]] && data[wds[j]].destroy)
                        data[wds[j]].destroy();
                }
            }
        }
    };

    ej.cookie = {
        get: function (name) {
            var value = RegExp(name + "=([^;]+)").exec(document.cookie);

            if (value && value.length > 1)
                return value[1];

            return undefined;
        },
        set: function (name, value, expiryDate) {
            if (typeof value === "object")
                value = JSON.stringify(value);

            value = escape(value) + ((expiryDate == null) ? "" : "; expires=" + expiryDate.toUTCString());
            document.cookie = name + "=" + value;
        }
    };

    var keyFn = {
        getActionFromCode: function (keyConfigs, keyCode, isCtrl, isShift, isAlt) {
            isCtrl = isCtrl || false;
            isShift = isShift || false;
            isAlt = isAlt || false;

            for (var keys in keyConfigs) {
                if (keys === "focus") continue;

                var key = keyFn.getKeyObject(keyConfigs[keys]);
                for (var i = 0; i < key.length; i++) {
                    if (keyCode === key[i].code && isCtrl == key[i].isCtrl && isShift == key[i].isShift && isAlt == key[i].isAlt)
                        return keys;
                }
            }
            return null;
        },
        getKeyObject: function (key) {
            var res = {
                isCtrl: false,
                isShift: false,
                isAlt: false
            };
            var tempRes = $.extend(true, {}, res);
            var $key = key.split(","), $res = [];
            for (var i = 0; i < $key.length; i++) {
                var rslt = null;
                if ($key[i].indexOf("+") != -1) {
                    var k = $key[i].split("+");
                    for (var j = 0; j < k.length; j++) {
                        rslt = keyFn.getResult($.trim(k[j]), res);
                    }
                }
                else {
                    rslt = keyFn.getResult($.trim($key[i]), $.extend(true, {}, tempRes));
                }
                $res.push(rslt);
            }
            return $res;
        },
        getResult: function (key, res) {
            if (key === "ctrl")
                res.isCtrl = true;
            else if (key === "shift")
                res.isShift = true;
            else if (key === "alt")
                res.isAlt = true;
            else res.code = parseInt(key, 10);
            return res;
        }
    };

    ej.getScrollableParents = function (element) {
        return $(element).parentsUntil("html").filter(function () {
            return $(this).css("overflow") != "visible";
        }).add($(window));
    }
    ej.browserInfo = function () {
        var browser = {}, clientInfo = [],
        browserClients = {
            opera: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i, edge: /(edge)(?:.*version|)[ \/]([\w.]+)/i, webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie|trident) ([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
        };
        for (var client in browserClients) {
            if (browserClients.hasOwnProperty(client)) {
                clientInfo = navigator.userAgent.match(browserClients[client]);
                if (clientInfo) {
                    browser.name = clientInfo[1].toLowerCase() == "opr" ? "opera" : clientInfo[1].toLowerCase();
                    browser.version = clientInfo[2];
                    browser.culture = {};
                    browser.culture.name = browser.culture.language = navigator.language || navigator.userLanguage;
                    if (typeof (ej.globalize) != 'undefined') {
                        var oldCulture = ej.preferredCulture().name;
                        var culture = (navigator.language || navigator.userLanguage) ? ej.preferredCulture(navigator.language || navigator.userLanguage) : ej.preferredCulture("en-US");
                        for (var i = 0; (navigator.languages) && i < navigator.languages.length; i++) {
                            culture = ej.preferredCulture(navigator.languages[i]);
                            if (culture.language == navigator.languages[i])
                                break;
                        }
                        ej.preferredCulture(oldCulture);
                        $.extend(true, browser.culture, culture);
                    }
                    if (!!navigator.userAgent.match(/Trident\/7\./)) {
                        browser.name = "msie";
                    }
                    break;
                }
            }
        }
        browser.isMSPointerEnabled = (browser.name == 'msie') && browser.version > 9 && window.navigator.msPointerEnabled;
        browser.pointerEnabled = window.navigator.pointerEnabled;
        return browser;
    };
    ej.eventType = {
        mouseDown: "mousedown touchstart",
        mouseMove: "mousemove touchmove",
        mouseUp: "mouseup touchend",
        mouseLeave: "mouseleave touchcancel",
        click: "click touchend"
    };

    ej.event = function (type, data, eventProp) {

        var e = $.extend(eventProp || {},
            {
                "type": type,
                "model": data,
                "cancel": false
            });

        return e;
    };

    ej.proxy = function (fn, context, arg) {
        if (!fn || typeof fn !== "function")
            return null;

        if ('on' in fn && context)
            return arg ? fn.on(context, arg) : fn.on(context);

        return function () {
            var args = arg ? [arg] : []; args.push.apply(args, arguments);
            return fn.apply(context || this, args);
        };
    };

    ej.hasStyle = function (prop) {
        var style = document.documentElement.style;

        if (prop in style) return true;

        var prefixs = ['ms', 'Moz', 'Webkit', 'O', 'Khtml'];

        prop = prop[0].toUpperCase() + prop.slice(1);

        for (var i = 0; i < prefixs.length; i++) {
            if (prefixs[i] + prop in style)
                return true;
        }

        return false;
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (searchElement) {
        var len = this.length;

        if (len === 0) return -1;

        for (var i = 0; i < len; i++) {
            if (i in this && this[i] === searchElement)
                return i;
        }
        return -1;
    };

    String.prototype.startsWith = String.prototype.startsWith || function (key) {
        return this.slice(0, key.length) === key;
    };
    var copyObject = ej.copyObject = function (isDeepCopy, target) {
        var start = 2, current, source;
        if (typeof isDeepCopy !== "boolean") {
            start = 1;
        }
        var objects = [].slice.call(arguments, start);
        if (start === 1) {
            target = isDeepCopy;
            isDeepCopy = undefined;
        }

        for (var i = 0; i < objects.length; i++) {
            for (var prop in objects[i]) {
                current = target[prop], source = objects[i][prop];

                if (source === undefined || current === source || objects[i] === source || target === source)
                    continue;
                if (source instanceof Array) {
                    if (i === 0 && isDeepCopy) {
						if(prop === "dataSource")
						  target[prop] = source.slice();
					  else  {
                        target[prop] = new Array();
                        for (var j = 0; j < source.length; j++) {
                            copyObject(true, target[prop], source);
                        }
					  }
                    }
                    else
                        target[prop] = source.slice();
                }
                else if (ej.isPlainObject(source)) {
                    target[prop] = current || {};
                    if (isDeepCopy)
                        copyObject(isDeepCopy, target[prop], source);
                    else
                        copyObject(target[prop], source);
                } else
                    target[prop] = source;
            }
        }
        return target;
    };
    var pInstance = function () {
        return this;
    }

    var _uid = 0;
    var getUid = function (prefix) {
        return prefix + _uid++;
    }

    ej.template = {};

    ej.template.render = ej.template["text/x-jsrender"] = function (self, selector, data, index, prop) {
        if (selector.slice(0, 1) !== "#")
            selector = ["<div>", selector, "</div>"].join("");
        var property = { prop: prop, index: index };
        return $(selector).render(data, property);
    }

    ej.isPlainObject = function (obj) {
        if (!obj) return false;
        if (ej.DataManager !== undefined && obj instanceof ej.DataManager) return false;
        if (typeof obj !== "object" || obj.nodeType || jQuery.isWindow(obj)) return false;
        try {
            if (obj.constructor &&
                !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        var key, ownLast = ej.support.isOwnLast;
        for (key in obj) {
            if (ownLast) break;
        }

        return key === undefined || obj.hasOwnProperty(key);
    };
    var getValueFn = false;
    ej.util.valueFunction = function (prop) {
        return function (value, getObservable) {
            var val = ej.getObject(prop, this.model);

            if (getValueFn === false)
                getValueFn = ej.getObject("observables.getValue", ej.widget);

            if (value === undefined) {
                if (!ej.isNullOrUndefined(getValueFn)) {
                    return getValueFn(val, getObservable);
                }
                return typeof val === "function" ? val.call(this) : val;
            }

            if (typeof val === "function") {
                this["ob.values"][prop] = value;
                val.call(this, value);
            }
            else
                ej.createObject(prop, value, this.model);
        }
    };
    ej.util.getVal = function (val) {
        if (typeof val === "function")
            return val();
        return val;
    };
    ej.support = {
        isOwnLast: function () {
            var fn = function () { this.a = 1; };
            fn.prototype.b = 1;

            for (var p in new fn()) {
                return p === "b";
            }
        }(),
        outerHTML: function () {
            return document.createElement("div").outerHTML !== undefined;
        }()
    };

    var throwError = ej.throwError = function (er) {
        try {
            throw new Error(er);
        } catch (e) {
            throw e.message + "\n" + e.stack;
        }
    };

    ej.getRandomValue = function (min, max) {
        if (min === undefined || max === undefined)
            return ej.throwError("Min and Max values are required for generating a random number");

        var rand;
        if ("crypto" in window && "getRandomValues" in crypto) {
            var arr = new Uint16Array(1);
            window.crypto.getRandomValues(arr);
            rand = arr[0] % (max - min) + min;
        }
        else rand = Math.random() * (max - min) + min;
        return rand | 0;
    }

    ej.extensions = {};
    ej.extensions.modelGUID = "{0B1051BA-1CCB-42C2-A3B5-635389B92A50}";
})(window.jQuery, window.Syncfusion);
(function () {
    $.fn.addEleAttrs = function (json) {
        var $this = $(this);
        $.each(json, function (i, attr) {
            if (attr && attr.specified) {
                $this.attr(attr.name, attr.value);
            }
        });

    };
    $.fn.removeEleAttrs = function (regex) {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && regex.test(attr.name)) {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.fn.attrNotStartsWith = function (regex) {
        var proxy = this;
        var attributes = [], attrs;
        this.each(function () {
            attrs = $(this.attributes).clone();
        });
        for (i = 0; i < attrs.length; i++) {
            if (attrs[i] && attrs[i].specified && regex.test(attrs[i].name)) {
                continue
            }
            else
                attributes.push(attrs[i])
        }
        return attributes;

    }
    $.fn.removeEleEmptyAttrs = function () {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && attr.value === "") {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.extend($.support, {
        has3d: ej.addPrefix('perspective') in ej.styles,
        hasTouch: 'ontouchstart' in window,
        hasPointer: navigator.msPointerEnabled,
        hasTransform: ej.userAgent() !== false,
        pushstate: "pushState" in history &&
        "replaceState" in history,
        hasTransition: ej.addPrefix('transition') in ej.styles
    });
    //Ensuring elements having attribute starts with 'ejm-' 
    $.extend($.expr[':'], {
        attrNotStartsWith: function (element, index, match) {
            var i, attrs = element.attributes;
            for (i = 0; i < attrs.length; i++) {
                if (attrs[i].nodeName.indexOf(match[3]) === 0) {
                    return false;
                }
            }
            return true;
        }
    });
    //addBack() is supported from Jquery >1.8 and andSelf() supports later version< 1.8. support for both the method is provided by extending the JQuery function.
    var oldSelf = $.fn.andSelf || $.fn.addBack;
    $.fn.andSelf = $.fn.addBack = function () {
        return oldSelf.apply(this, arguments);
    };
})();;
