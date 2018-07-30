ej.mobUtil = {

    /*------Public Properties------*/
    cssUA: ej.userAgent ? '-' + ej.userAgent().toString().toLowerCase() + '-' : '',
    transform: ej.addPrefix('transform'),
    transition: ej.addPrefix('transition'),
    transitionProperty: ej.addPrefix('transitionProperty'),
    transformStyle: ej.addPrefix('transformStyle'),
    transitionDuration: ej.addPrefix('transitionDuration'),
    transformOrigin: ej.addPrefix('transformOrigin'),
    transitionTimingFunction: ej.addPrefix('transitionTimingFunction'),
    transitionDelay: ej.addPrefix('transitionDelay'),
    ease: {
        quadratic: {
            style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            fn: function (k) {
                return k * (2 - k);
            }
        },
        circular: {
            style: 'cubic-bezier(0.1, 0.57, 0.1, 1)',
            fn: function (k) {
                return Math.sqrt(1 - (--k * k));
            }
        },
        back: {
            style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            fn: function (k) {
                var b = 4;
                return (k = k - 1) * k * ((b + 1) * k + b) + 1;
            }
        },
        bounce: {
            style: '',
            fn: function (k) {
                if ((k /= 1) < (1 / 2.75)) {
                    return 7.5625 * k * k;
                } else if (k < (2 / 2.75)) {
                    return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                } else if (k < (2.5 / 2.75)) {
                    return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                } else {
                    return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                }
            }
        },
        elastic: {
            style: '',
            fn: function (k) {
                var f = 0.22,
					e = 0.4;

                if (k === 0) { return 0; }
                if (k == 1) { return 1; }

                return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
            }
        }
    },

    /*------Public Methods------*/

    //Angular dynamic compiler
    angular: {
        defaultAppName: $('[ng-app]').attr('ng-app'),
        //Compile Code
        compile: function ($targetElement, appName) {
            var $injector = angular.element(document.querySelector('[ng-app],[data-ng-app]') || document).injector();
            $injector.invoke(["$compile", "$rootScope", function ($compile, $rootScope) {
                //Get the scope of the target, use the rootScope if it does not exists
                var $localScope = angular.element($targetElement.closest(".ng-scope") || $targetElement).scope();
                if ($localScope || $rootScope) {
                    $compile($targetElement)($localScope || $rootScope);
                }
                if (!($localScope || $rootScope).$$phase)
                    ($localScope || $rootScope).$digest();
            }]);
        }
    },
    angularMobileSettings: {
        enableAnimation: true,
        animationTime: 300
    },
    isAppNullOrUndefined: function () {
        return (typeof App == 'undefined');
    },
    device: {
        //To check whether its iOS
        isIOS: function () {
            return ((/(ipad|iphone|ipod touch)/i).test(navigator.userAgent.toLowerCase()) && !this.isWindows());
        },
        //To check whether its iOS7
        isIOS7: function () {
            return ((/(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i).test(navigator.userAgent.toLowerCase()) && !this.isWindows());
        },
        //To check whether its Android
        isAndroid: function () {
            return ((/android/i.test(navigator.userAgent.toLowerCase())) && !this.isWindows());
        },
        //To check whether its Windows
        isWindows: function () {
            return (/trident|windows phone/i.test(navigator.userAgent.toLowerCase()));
        },
        //To check whether its Flat
        isFlat: function () {
            return (ej.getBooleanVal($('head'), 'data-ej-flat', false) === true);
        }
    },

    //To check whether its iOS
    isIOS: function () {
        if (!ej.getBooleanVal($('head'), 'data-ej-windows') && !ej.getBooleanVal($('head'), 'data-ej-android') && !ej.getBooleanVal($('head'), 'data-ej-flat'))
            return this._ios();
    },
    //To check whether its iOS7
    isIOS7: function () {
        if (!ej.getBooleanVal($('head'), 'data-ej-windows') && !ej.getBooleanVal($('head'), 'data-ej-android') && !ej.getBooleanVal($('head'), 'data-ej-flat'))
            return this._ios7();
    },
    //To check whether its Android
    isAndroid: function () {
        if (!ej.getBooleanVal($('head'), 'data-ej-windows') && !ej.getBooleanVal($('head'), 'data-ej-ios') && !ej.getBooleanVal($('head'), 'data-ej-ios7') && !ej.getBooleanVal($('head'), 'data-ej-flat'))
            return this._android();
    },
    setTransition: function () {
        return ej.isAndroid() ? "pop" : ej.isWindows() ? (ej.isMobile() ? "slide" : "slide") : "slide";
    },
    //To check whether its lower version Android device
    isLowerAndroid: function () {
        return /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion));
    },
    //To get the version of Android device
    getAndroidVersion: function () {
        if (this._android() && navigator.userAgent.toLowerCase().match(/android\s+([\d\.]+)/))
            return parseFloat(navigator.userAgent.toLowerCase().match(/android\s+([\d\.]+)/)[1]);
        else
            return false;
    },
    //To check whether its Windows
    isWindows: function () {
        if (!ej.getBooleanVal($('head'), 'data-ej-android') && !ej.getBooleanVal($('head'), 'data-ej-ios') && !ej.getBooleanVal($('head'), 'data-ej-ios7') && !ej.getBooleanVal($('head'), 'data-ej-flat'))
            return this._windows();
    },
    //To check whether its Flat
    isFlat: function () {
        return (ej.getBooleanVal($('head'), 'data-ej-flat', false) === true);
    },
    //To check whether element has theme
    hasTheme: function (element) {
        return element.hasClass('e-m-dark') || element.hasClass('e-m-light') || element.hasClass('e-m-default');
    },
    //Sets the Theme for the element
    setTheme: function (object) {
        if (object.model.renderMode != "windows" && !ej.isMobile() && object.model.theme == "default")
            object.model.theme = "auto";
        var comTheme = ej.getAttrVal($('head'), "data-ej-theme", "auto");
        var renderDefault = ej.getBooleanVal($('head'), "data-ej-windows-renderdefault", object.model.windows ? object.model.windows.renderDefault : false);
        if (object.model.windows)
            object.model.windows.renderDefault = renderDefault;
        object.model.theme = object.model.theme == "auto" ? comTheme == "auto" ? ((object.model.renderMode == "ios7" || ((object.model.renderMode == "android" || object.model.renderMode == "windows") && !ej.isMobile())) ? "light" : "dark") : comTheme : object.model.theme;
    },
    //Get theme that applied for app
    getTheme: function () {
        objTheme = { model: { theme: "auto" } };
        this.setTheme(objTheme);
        return objTheme.model.theme;
    },
    //To check whether element has rendermode
    hasRenderMode: function (element) {
        return element.hasClass('e-m-ios7') || element.hasClass('e-m-android') || element.hasClass('e-m-windows') || element.hasClass('e-m-flat');
    },
    //Sets the Render Mode for the element
    setRenderMode: function (element) {
        element.model.renderMode = ej.getAttrVal(element.element, 'data-ej-rendermode', element.model.renderMode);
        if (element.model.renderMode == "auto") {
            if (ej.isAndroid())
                element.model.renderMode = "android";
            else if (ej.isIOS())
                element.model.renderMode = "ios7";
            else if (ej.isWindows())
                element.model.renderMode = "windows";
            else if (ej.isFlat())
                element.model.renderMode = "flat";
            else
                element.model.renderMode = "ios7";
        }
    },
    //Gets the Render Mode for the element
    getRenderMode: function () {
        if (this.isAndroid())
            return "android";
        else if (this.isIOS())
            return "ios7";
        else if (this.isWindows())
            return "windows";
        else if (this.isFlat())
            return "flat";
        else
            return "ios7";
    },
    //To get CurrentPage
    getCurrentPage: function () {
        return ej.isAppNullOrUndefined() ? $("body") : App._renderingPage ? App._renderingPage : App.activePage;
    },
    //To detect the browser
    browser: function () {
        return (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : (/trident/i).test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
    },

    //To round the value
    round: function (value, div, up) {
        return div * (up ? Math.ceil(value / div) : Math.floor(value / div));
    },
    //To log base the value
    logBase: function (val, base) {
        return Math.log(val) / Math.log(base);
    },
    //To make the rectangle with absolute value
    correctRect: function (x1, y1, x2, y2) {
        return { X: Math.min(x1, x2), Y: Math.min(y1, y2), Width: Math.abs(x2 - x1), Height: Math.abs(y2 - y1) };
    },
    //To check the text length
    measureText: function (text, maxwidth, font) {
        var textObj = document.createElement('DIV');
        textObj.innerHTML = text;
        if (font != null)
            textObj.style.font = font;
        textObj.style.backgroundColor = 'white';
        textObj.style.position = 'absolute';
        textObj.style.top = -100
        textObj.style.left = 0;
        if (maxwidth)
            textObj.style.maxwidth = maxwidth + "px";

        document.body.appendChild(textObj);

        var bounds = { width: textObj.offsetWidth, height: textObj.offsetHeight };
        $(textObj).remove();
        return bounds;
    },
    //To get the current time
    getTime: Date.now || new Date().getTime(),
    //To get the Font String
    getFontString: function (fontObj) {
        if (fontObj == null)
            fontObj = {};
        if (!fontObj.FontFamily)
            fontObj.FontFamily = "Arial";
        if (!fontObj.FontStyle)
            fontObj.FontStyle = 0;
        if (!fontObj.Size)
            fontObj.Size = "12px";

        return ej.GetFontStyle(fontObj.FontStyle) + " " + fontObj.Size + " " + fontObj.FontFamily;
    },
    //To get the Font Style
    getFontStyle: function (style) {
        switch (style) {
            case 0:
                return "Regular";
            case 1:
                return "Bold";
            case 2: return "Italic";
            case 4: return "Underline";
            case 8: return "StrikeOut";
        }
    },
    //To convert RGB to Hexadecimal value
    hexFromRGB: function (color) {
        var r = color.R;
        var g = color.G;
        var b = color.B;
        var hex = [r.toString(16), g.toString(16), b.toString(16)];
        $.each(hex, function (nr, val) { if (val.length === 1) { hex[nr] = "0" + val; } });
        return hex.join("").toUpperCase();
    },

    adjustFixedElement: function (ele) {
            ele.removeClass("e-m-adjheader e-m-adjfooter");
            var topnavLen = ele.siblings(".e-m-navbar-top").length,
                bottomnavLen = ele.siblings(".e-m-navbar-bottom").length;
            //Audjust Fixed position for Header
            if (topnavLen) ele.addClass("e-m-adjheader-" + topnavLen);
            //Audjust Fixed position for Footer
            if (bottomnavLen) ele.addClass("e-m-adjfooter-" + bottomnavLen);
    },

    //To set caret position in the textbox
    setCaretToPos: function (input, pos1, pos2) {
        if (input.setSelectionRange && input.type != "number") {
            input.focus();
            input.setSelectionRange(pos1, pos2);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveStart('character', pos1);
            range.moveEnd('character', pos2);
            range.select();
        }
    },
    isCssCalc: function () {
        $('body').append('<div id="css3-calc" style=" width: 10px; width: calc(10px + 10px);display: none;"></div>');
        var css3_calc = $('#css3-calc').width();
        $('#css3-calc').remove();
        return css3_calc == 20 ? true : false;
    },  

    getLocation: function (url) {
        var uri = url ? this.route.splitUrl(url) : location,
                hash = this.route.splitUrl(url || location.href).hash;
        hash = hash === "#" ? "" : hash;
        return uri.protocol + "//" + uri.host + uri.pathname + uri.search + hash;
    },

    route: {
        urlSplitReg: /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
        splitUrl: function (url) {
            if ($.type(url) === "object") {
                return url;
            }
            var matches = this.urlSplitReg.exec(url || "") || [];
            return {
                href: matches[0] || "",
                protocol: matches[4] || "",
                host: matches[10] || "",
                pathname: matches[13] || "",
                search: matches[16] || "",
                hash: matches[17] || ""
            };
        },
    },

    resize: function () {
        $(window).bind("onorientationchange" in window ? "orientationchange" : "resize", function (e) {
            if (ej.getRenderMode() == "android" || ej.getRenderMode() == "ios7")
                $(document.activeElement).blur();

            if (ej._currentResolution != ej.isLowerResolution()) {
                ej._currentResolution = ej.isLowerResolution();
                $.extend(true, e, { resolutionChanged: true });
            }
            else
                $.extend(true, e, { resolutionChanged: false });
            for (var i = 0; i < ej.widget.registeredInstances.length; i++) {
                if ($(ej.widget.registeredInstances[i].element).is(":visible") && $.isFunction(ej.widget.registeredInstances[i].proto.resize))
                    $(ej.widget.registeredInstances[i].element).data(ej.widget.registeredInstances[i].pluginName).resize(e);
            }
            if (e.type == "orientationchange") {
                window.setTimeout(function () {
                    if (ej.getRenderMode() == "ios7")
                        window.scrollTo(0, 0);
                });
            }
        });
    },

    initPage: function () {
        if ((/(ipad|iphone|ipod touch);.*os 7_\d/i).test(navigator.userAgent.toLowerCase())) {
            $(document).on('blur', 'input, select, textarea', function () {
                window.setTimeout(function () {
                    if (document.activeElement.nodeName && document.activeElement.nodeName.toLowerCase() != "input")
                        window.scrollTo(0, 0);
                });
            });
        }
        $(window).bind('touchmove', function (e) {
            if ($(e.target).closest('.e-m-scroll-native').length == 0 && ej.isTouchDevice())
                ej.blockDefaultActions(e);
        });
    },


    /*------Private Methods------*/
    //To do momentum for the desired element
    _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
        var deceleration = 0.0006,
			speed = Math.abs(dist) / time,
			newDist = (speed * speed) / (2 * deceleration),
			newTime = 0, outsideDist = 0;

        // Proportinally reduce speed if we are outside of the boundaries
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }

        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return { dist: newDist, time: Math.round(newTime) };
    },
    //To do native momentum for the desired element
    _nativeMomentum: function (current, start, time, lowerMargin, wrapperSize, deceleration, division) {
        var distance = current - start,
			speed = Math.abs(distance) / time,
			dest,
			duration;

        deceleration = deceleration == null ? 0.0006 : deceleration;
        dest = current + (speed * speed) / (2 * (deceleration / division)) * (distance < 0 ? -1 : 1);
        duration = speed / deceleration;

        if (dest < lowerMargin) {
            dest = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
            distance = Math.abs(dest - current);
            duration = distance / speed;
        } else if (dest > 0) {
            dest = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
            distance = Math.abs(current) + dest;
            duration = distance / speed;
        }

        return {
            dest: Math.round(dest),
            duration: duration
        };
    },
    //Sets the hidden style for element 
    _setHidden: function (element) {
        var proxy = this;
        this.hidden.each(function (i) {
            var temp = proxy.tmp[i], name;
            for (name in prop) {
                this.style[name] = temp[name];
            }
        });
    },
    //Removes the hidden style for element 
    _removeHidden: function (element) {
        var value;
        var proxy = this;
        this.hidden = $(element).parents().andSelf().filter(':hidden');
        prop = { visibility: 'hidden', display: 'block' };
        this.tmp = [];
        this.hidden.each(function () {
            var temp = {}, name;
            for (name in prop) {
                temp[name] = this.style[name];
                this.style[name] = prop[name];
            }
            proxy.tmp.push(temp);
        });

    },

    _transitionTime: function (time, target) {
        time += 'ms';
        target.style[ej.transitionDuration] = time;
    },
    _slideOutWithoutDuration: function (target, reverse) {
        ej._transitionTime(0, target);
        target.style[ej.transform] = reverse ? "translateX(-100%)" : "translateX(100%)";
    },
    _slideInWithoutDuration: function (target, reverse) {
        ej._transitionTime(0, target);
        target.style[ej.transform] = reverse ? "translateX(100%)" : "translateX(-100%)";
    },
    _slideOutWithDuration: function (target, reverse) {
        ej._transitionTime(300, target);
        target.style[ej.transform] = reverse ? "translateX(-100%)" : "translateX(100%)";
    },
    _slideInWithDuration: function (target, reverse) {
        ej._transitionTime(100, target);
        target.style[ej.transform] = reverse ? "translateX(100%)" : "translateX(-100%)";
    },
    _slide: function (target) {
        ej._transitionTime(100, target);
        target.style[ej.transform] = "translateX(0)";
    },
    _device: function () {
        return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));
    },
    _ios: function () {
        return ((/(ipad|iphone|ipod touch)/i).test(navigator.userAgent.toLowerCase()) && !this._windows()) || (ej.getBooleanVal($('head'), 'data-ej-ios7', false) === true);
    },
    _ios7: function () {
        return ((/(ipad|iphone|ipod touch);.*os 7_\d|(ipad|iphone|ipod touch);.*os 8_\d/i).test(navigator.userAgent.toLowerCase()) && !this._windows()) || (ej.getBooleanVal($('head'), 'data-ej-ios7', false) === true);
    },
    _android: function () {
        return ((/android/i.test(navigator.userAgent.toLowerCase())) && !this._windows()) || (ej.getBooleanVal($('head'), 'data-ej-android', false) === true);
    },
    _windows: function () {
        return (/trident|windows phone|edge/i.test(navigator.userAgent.toLowerCase())) || (ej.getBooleanVal($('head'), 'data-ej-windows', false) === true);
    },
    _getFontString: function (element, font) {
        return element.model.fontStyle[font.FontStyle] + " " + ((font.Size == null) ? "11px" : font.Size) + " " + font.FontFamily;
    },
    _setScroller: function (proxy) {
        proxy._wrpWd = proxy.element[0].clientWidth;
        proxy._scrollerWidth = proxy.element[0].scrollWidth;
        proxy._maxScrollX = proxy._wrpWd - proxy._scrollerWidth;
    },
    _inputTouchStart: function (evt, proxy) {
        var point = evt.touches ? evt.touches[0] : evt,
			pos;
        proxy._moved = false;
        proxy._distX = 0;
        proxy._x = proxy._x == undefined ? proxy.element[0].scrollLeft : proxy._x;
        proxy._cloned = false;
        proxy._startX = 0;
        proxy._pointX = point.pageX;
        proxy._startTime = ej.getTime();
    },
    _inputTouchMove: function (evt, proxy) {
        var point = evt.touches ? evt.touches[0] : evt,
			deltaX = point.pageX - proxy._pointX;
        if (deltaX > 0)
            proxy._reverse = true;
        if (proxy.element[0].scrollLeft == 0 && deltaX > 0 || (deltaX > 0 && proxy.element[0].scrollLeft < deltaX) || (deltaX < 0 && proxy.element[0].scrollLeftMax <= proxy.element[0].scrollLeft))
            return;
        if (deltaX > 0 && proxy.element[0].scrollLeft + deltaX > proxy.element[0].scrollLeftMax) {
            if (proxy._x < 0)
                proxy._x = -proxy._x;
            deltaX = -deltaX;
        }
        var newX = proxy._x + deltaX,
            timestamp = ej.getTime();
        proxy._distX += deltaX;
        ej._translateText(proxy.element, newX);
    },
    _inputTouchEnd: function (evt, proxy) {
        var point = evt.touches ? evt.changedTouches[0] : evt,
			deltaX = point.pageX - proxy._pointX;
        var newX = deltaX,
            timestamp = ej.getTime();
        proxy._distX += deltaX;
        ej._translateText(proxy.element, proxy.element[0].scrollLeft);
        proxy._x = -proxy.element[0].scrollLeft;
    },
    _translateText: function (ele, scrollX) {
        ele[0].scrollLeft = Math.abs(scrollX);
    },
    _setGradientColor: function (element, gradient, options) {
        var self = element;
        if (options.Name || typeof (options) === "string")
            gradient.addColorStop(0, ej._getColor(options));
        else
            $.each(options, function (index, colorElement) {
                gradient.addColorStop(colorElement.ColorStop != NaN ? colorElement.ColorStop : 0, typeof (colorElement.Color) === "string" ? colorElement.Color : ej._getColor(colorElement.Color));
            });
    },
    //To push value into array in particular index
    _pushValue: function (stored, val, index) {
        var tempStored = [];
        for (i = 0; i < index; i++) {
            tempStored[i] = stored[i];
        }
        tempStored[index] = val;
        var index = tempStored.length;
        for (i = index; i <= stored.length; i++) {
            tempStored[i] = stored[i - 1];
        }
        stored = tempStored;
        return stored;
    }
};
$.extend(ej, ej.mobUtil);
ej.mobile = {};
ej.mobile.enableRippleEffect = true;
ej.mobile.WaitingPopup = {
    _init: function (options) {
        this.model = {
            text: ("Loading..."),
            target: $("body"),
            showOnInit: false
        };
        $.extend(true, this.model, options);
        this.createWaitingPopup();
    },
    createWaitingPopup: function () {
        if (!this.waitingPopupDiv) {
            var devName = ej.isMobile() ? 'mobile' : 'tablet';
            this.waitingPopupDiv = ej.buildTag('div.e-m-waitingpopup e-m-' + ej.getRenderMode() + ' e-m-' + devName, "<div class='e-m-image' style='top: " + (!ej.isCssCalc() ? window.innerHeight / 2 - 16 : '') + "px'></div>");
            this.waitingPopupDiv.find(".e-m-image").text(this.model.text);
            this.model.target.append(this.waitingPopupDiv);
            if (!this.model.showOnInit)
                this.hide();
        }
    },

    setText: function (text) {
        this.model.text = text;
        this.waitingPopupDiv.find(".e-m-image").text(text);
    },
    changeTarget: function (target) {
        this.model.target = target;
        this.model.target.append(this.waitingPopupDiv);
    },
    show: function () {
        this.model.showOnInit = true;
        this.waitingPopupDiv.addClass("e-m-show").removeClass("e-m-hide");
    },
    hide: function () {
        this.model.showOnInit = false;
        this.waitingPopupDiv.removeClass("e-m-show").addClass("e-m-hide");
    }
};

$(function () {
    ej.initPage();
    ej._currentResolution = ej.isLowerResolution();
    ej.mobile.WaitingPopup._init();
    if (ej.mobile.enableRippleEffect && !ej.isNullOrUndefined(window["ejAnimation"]))
        $("body").ejAnimation("rippleEffect");
    ej.resize();    
});
ej.mobile.RenderMode = {    
    Auto: "auto",    
    IOS7: "ios7",    
    Android: "android",    
    Windows: "windows"
};

ej.mobile.Theme = {    
    Auto: "auto",    
    Dark: "dark",    
    Light: "light"
};
