/**
* @fileOverview Plugin to style the Html ProgressBar elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejmProgress", "ej.mobile.Progress", {
        _setFirst: true,
        _rootCSS: "e-m-progress",

        defaults: {
            renderMode: "auto",
            value: 0,
            percentage: 0,
            incrementStep: 0,
            minValue: 0,
            maxValue: 100,
            width: null,
            height: null,
            orientation: "horizontal",
            create: null,
            change: null,
            start: null,
            complete: null,
            text: "",
            enabled: true,
            enableCustomText: false,
            theme: "auto",
            enablePersistence: false
        },
        dataTypes: {
            renderMode: "enum",
            orientation: "enum",
            enabled: "boolean",
            enableCustomText: "boolean",
            theme: "enum",
            enablePersistence: "boolean"
        },

        // constructor function
        _init: function () {
            if (!App.activePage)
                App.createAppView();
            this._getLocalizedLabels();
            this.model.text = !ej.isNullOrUndefined(this.model.text) ? this.model.text : this._localizedLabels["text"];
            this._cloneElement = this.element.clone();
            this._createDelegate();
            this._wireEvents(false);
            this._renderControl();
            this._progressbarInit();
            this._pageLoad();
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _renderControl: function () {

            ej.setRenderMode(this);
            ej.setTheme(this);
            var canvas = ej.buildTag("canvas");
            this.element.append(canvas);
        },
        _createDelegate: function () {
            this._onOrientationChangedDelegate = $.proxy(this._onOrientationChangedHandler, this);
            this._onWindowsResizeDelegate = $.proxy(this._onWindowResizeHandler, this);
        },
        _wireEvents: function (remove) {
            if (!remove)
                ej.listenEvents([window], ["onorientationchange" in window ? "orientationchange" : "resize"], [this._onWindowsResizeDelegate], remove);
        },
        _onWindowResizeHandler: function () {
            var proxy = this;
            window.setTimeout(function () {
                proxy._draw();
            }, 250);
        },
        _widthAndHeightProperties: function () {
            this._tempHeight = this.model.orientation == "horizontal" ? (this.model.height ? this.model.height : 3) : (this.model.width ? this.model.width : this.element.parent().height());
            this._tempWidth = this.model.orientation == "horizontal" ? (this.model.width ? this.model.width : this.element.parent().width()) : (this.model.height ? this.model.height : 3);
        },
        _progressbarInit: function () {

            var span;
            this._initialX = 0;
            this._initialY = 0;
            this._mProgress = this.element;
            this._increment = 0;
            this._result = 0;
            this._context = null;
            this._text = this.model.textStyle;
            this._externalText = null;
            this._totalWidth = 0;
            this._totalHeight = 0;
            this._radius = 0;
            this._currentValue = 1;
        },
        _pageLoad: function () {

            var elem = this.element.find("canvas")[0];
            var parent = $(elem).parent();
            if (typeof window.G_vmlCanvasManager != "undefined")
                elem = window.G_vmlCanvasManager.initElement(elem);
            if (!elem || !elem.getContext)
                return;
            var elem = this.element.find("canvas")[0];
            this._context = elem.getContext('2d');
            if (!this._context)
                return;
            this.model.value = this.model.value + this.model.incrementStep;
            this._validate();
            var data = { element: this.element, value: this.model.value };
            this._result = this._draw();
            var data = { value: this._setValue, percentage: this.model.percentage };
            if (this.model.minValue == this.model.value)
                this._trigger("start", data);
        },
        _validate: function () {
            if (this._setValue == this.model.maxValue) {
                var data = { value: this._setValue, text: this.model.text, percentage: this.model.percentage };
                if (this.model.complete)
                    this._trigger("complete", data);
            }
            this._setValue = this._setValue < this.model.minValue ? this.model.minValue : (this._setValue > this.model.maxValue ? this.model.maxValue : this._setValue);
            if (this._step > this._max)
                this._step = 1;
        },
        _draw: function () {
            this._widthAndHeightProperties();
            if (this._context != null) {
                if (!this.model.enabled) {
                    $(this.element).addClass("e-m-state-disabled");
                    this._wireEvents(true);
                }
                if (this.model.value <= 0 && this.model.percentage != 0)
                    this.model.value = Math.round((this.model.percentage * this.model.maxValue) / 100);
                else if (this.model.value != 0 && this.model.percentage <= 0)
                    this.model.percentage = Math.round((this.model.value / this.model.maxValue) * 100);
                else if (this.model.value != 0 && this.model.percentage != 0)
                    this.model.percentage = Math.round((this.model.value / this.model.maxValue) * 100);
                if ((this.model.minValue <= this.model.value) && (this.model.maxValue >= this.model.value)) {
                    this._cutOffValue = this.model.value - this.model.minValue;
                    if (this.model.percentage >= 100)
                        this.model.percentage = 100;
                    else if (this.model.percentage <= 0)
                        this.model.percentage = 0;
                    if (this.model.percentage != undefined)
                        this._setValue = this.model.percentage;
                    else
                        this._setValue = Math.round((100 / (this.model.maxValue - this.model.minValue)) * this._cutOffValue);
                }
                else if ((this.model.minValue > this.model.value) && (this.model.maxValue > this.model.value))
                    this._setValue = 0;
                else if ((this.model.minValue < this.model.value) && (this.model.maxValue < this.model.value))
                    this._setValue = 100;
                this._setOrientationProperties(this._tempWidth, this._tempHeight, this._tempHeight + 50, this._tempWidth + 50);
                this._context.translate(0.5, 0.5);
                // Clear everything before drawing
                this._context.clearRect(this._initialX - 5, this._initialY - 5, this._totalWidth + 15, this._totalHeight + 15);
                var value;
                value = (this.model.renderMode == "windows" || this.model.renderMode == "flat") ? 10 : 25;
                this._initialY = (this.model.orientation == "horizontal") ? value : 0;
                this._initialX = (this.model.orientation == "horizontal") ? 0 : value;
                if (this.model.renderMode == "ios7") {
                    if (this.model.orientation == "horizontal")
                        this._totalHeight = (this._tempHeight == "") ? 3 : this._tempHeight;
                    else
                        this._totalWidth = (this._tempWidth == "") ? 3 : this._tempWidth;
                    this.totalRadius = (this.model.orientation == "horizontal") ? Math.round(this._totalHeight / 2) : Math.round(this._totalWidth / 2);
                    this._fillRadius = this.totalRadius;
                }
                else {
                    if (this.model.orientation == "horizontal")
                        this._totalHeight = (this._tempHeight == "") ? 2 : this._tempHeight;
                    else
                        this._totalWidth = (this._tempWidth == "") ? 2 : this._tempWidth;
                    this.totalRadius = 0; //default radius value for other modes
                    this._fillRadius = 0;
                }
                (this.model.orientation == "horizontal") ?
                this._roundRectOuter(this._context, this._initialX, this._initialY, this._totalWidth - 15, this._totalHeight, this.totalRadius) :
                this._roundRectOuter(this._context, this._initialX, this._initialY, this._totalWidth, this._totalHeight - 15, this.totalRadius);
                (this.model.orientation == "horizontal") ?
                this._roundRectFill(this._context, this._initialX, this._initialY, this._increment, this._totalHeight, this._fillRadius) :
                this._roundRectFill(this._context, this._initialX, this._initialY, this._increment, this._totalHeight - 15, this._fillRadius);
                if (this._increment >= this._totalWidth)
                    window.clearInterval(this._result);
            }
            this._validate();
        },
        _setOrientationProperties: function (horLength, verLength, canvasHeight, canvasWidth) {
            this._totalWidth = horLength;
            this._totalHeight = verLength;
            this._radius = (this.model.orientation == "horizontal" ? this._totalHeight : this._totalWidth) / 2;
            this._increment = (this._setValue) * ((this.model.orientation == "horizontal") ? (this._totalWidth - 15) / 100 : (this._totalHeight - 15) / 100);
            this._context.canvas.width = (this.model.orientation == "horizontal") ? horLength : canvasWidth;
            this._context.canvas.height = (this.model.orientation == "horizontal") ? canvasHeight : verLength;
        },

        _setLocale: function () {
            this._getLocalizedLabels();
            this._setText(this._localizedLabels["text"])
        },

        _roundRect: function (ctx, x, y, width, height, radius) {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = this._strokeStyle;
            ctx.fillStyle = this._fillStyle;
            ctx.lineWidth = 1;
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        },
        _roundRectOuter: function (ctx, x, y, width, height, radius) {
            if (this.model.renderMode == "ios7") {
                var gradientColor = (this.model.theme == 'dark') ? [{ "ColorStop": 1, "Color": "#363636" }] : [{ "ColorStop": 1, "Color": "#b5b5b6" }];
                grd = (this.model.orientation == "horizontal") ? ctx.createLinearGradient(x, y, x, y + height) : ctx.createLinearGradient(x, y, x + width, y);
                ej._setGradientColor(this, grd, gradientColor);
                this._strokeStyle = grd;
                this._fillStyle = grd;
            }
            else if (this.model.renderMode == "android")
                this._setRectOuterProperties("#3A3A3A", "#A9A9A9");
            else if (this.model.renderMode == "windows")
                this._setRectOuterProperties("#373737", "#c5c5c5");
            else if (this.model.renderMode == "flat")
                this._setRectOuterProperties("#b3b3b3", "#b3b3b3");
            (this.model.orientation == "horizontal") ? this._roundRect(ctx, x, y, width + radius, height, radius) : this._roundRect(ctx, x + 5, y, width, height + radius, radius);
        },
        _setRectOuterProperties: function (dark, light) {
            if (this.model.theme == "dark") {
                this._strokeStyle = dark;
                this._fillStyle = dark;
            }
            else {
                this._strokeStyle = light;
                this._fillStyle = light;
            }

        },
        _roundRectFill: function (ctx, x, y, width, height, radius) {//for positioning the progressbar
            if (this.model.renderMode == "ios7") {
                var gradientColor = [{ "ColorStop": 0, "Color": "#017aff" }];
                grd = (this.model.orientation == "horizontal") ? ctx.createLinearGradient(x, y, x, y + height) : ctx.createLinearGradient(x, y, x + width, y);
                ej._setGradientColor(this, grd, gradientColor);
                this._strokeStyle = grd;
                this._fillStyle = grd;
            }
            else if (this.model.renderMode == "android")
                this._strokeStyle = this._fillStyle = "#33B5E5";
            else if (this.model.renderMode == "windows")
                this._strokeStyle = this._fillStyle = "#2ca1dd";
            else if (this.model.renderMode == "flat")
                this._strokeStyle = this._fillStyle = "#f48b22";
            if (width > 0)
                (this.model.orientation == "horizontal") ? this._roundRect(ctx, x, y, width + radius, height, radius) : this._roundRect(ctx, x + 5, height - width + y, this._totalWidth, width + radius, radius);
            ctx.save();
            if (this.model.orientation == "horizontal")
                this._setTextProperties();
            else {
                this._setTextProperties();
                var ang = 270;
                ctx.save();
                ctx.translate(this._totalWidth / 2, height / 2);
                ctx.rotate(ang * 2 * 3.1416 / 360);
                if (this.model.renderMode == "ios7")
                    ctx.textAlign = "center";
                else if (this.model.renderMode == "android")
                    ctx.textAlign = "right";
            }
            if (this.model.enableCustomText) {
                if (this.model.text == "" || this.model.text == undefined)
                    this.setCustomText(this._text);
                else
                    this.setCustomText(this.model.text);
            }
            else
                this.setCustomText(this._text);
            var data = { value: this._setValue, text: this.model.text, percentage: this.model.percentage };
            if (this.model.change && this.model.value > 0)
                this._trigger("change", data);
            ctx.restore();
        },
        _setTextProperties: function () {
            if (this.model.renderMode == "ios7")
                this._text = "Downloading " + this._setValue + " of 100%";
            else if (this.model.renderMode == "android")
                this._text = this._setValue + "%";
            else if (this.model.renderMode == "windows" || this.model.renderMode == "flat")
                this._text = this._setValue;
        },
        _setCustomtextProperties: function (context, dark, light, font) {
            context.fillStyle = this.model.theme == "dark" ? dark : light;
            context.font = font;
        },

        _setRenderMode: function (mode) {
            if (this.model.enabled) {
                this.model.renderMode = mode;
                if (mode == "auto")
                    ej.setRenderMode(this);
                this._draw();
            }
        },

        _setTheme: function (theme) {
            if (this.model.enabled) {
                this.model.theme = theme;
                this._draw();
            }
        },

        _value: function (value) {
            if (this.model.enabled) {
                this._setValue = value;
                this.model.percentage = Math.round((this.model.value * this.model.maxValue) / 100);
                this._draw();
            }
        },

        _setPercentage: function (percentage) {
            if (this.model.enabled) {
                this._value = percentage;
                this._draw();
            }
        },

        _disable: function () {
            this.model.enabled = false;
            this.element.addClass('e-m-state-disabled');
            this._wireEvents(true);
        },

        _enable: function () {
            this.model.enabled = true;
            this.element.removeClass('e-m-state-disabled');
            this._wireEvents(false);
        },

        _refresh: function () {
            this._clearElements();
            this._wireEvents(false);
            this._renderControl();
            this._progressbarInit();
            this._pageLoad();
        },

        _setWidth: function (width) {
            this._tempWidth = this.model.width = width;
            this._draw();
        },

        _setHeight: function (height) {
            this._tempHeight = this.model.height = height;
            this._draw();
        },

        _setText: function (text) {
            if (this.model.enabled) {
                this.model.text = text;
                this._draw();
            }
        },
        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "renderMode": this._setRenderMode(options.renderMode); break;
                    case "theme": (this.model.enabled) ? this._setTheme(options.theme) : ""; break;
                    case "width": (this.model.enabled) ? this._setWidth(options.width) : ""; break;
                    case "height": (this.model.enabled) ? this._setHeight(options.height) : ""; break;
                    case "orientation": (this.model.enabled) ? this._draw() : ""; break;
                    case "value": (this.model.enabled) ? this._value(options.value) : ""; break;
                    case "percentage": (this.model.enabled) ? this._setPercentage(options.percentage) : ""; break;
                    case "minValue": (this.model.enabled) ? this._draw() : ""; break;
                    case "maxValue": (this.model.enabled) ? this._draw() : ""; break;
                    case "enabled": (options.enabled) ? this._enable() : this._disable(); break;
                    case "text": (this.model.enabled) ? this._setText(options.text) : ""; break;
                }
            }
        },
        _clearElements: function () {
            this._wireEvents(true);
            this.element.removeAttr("class");
            this.element.removeClass('e-m-progress');
            this.element.html("");
        },
        // all events bound using this._on will be unbind automatically
        _destroy: function () {
            this._cloneElement.insertBefore(this.element).removeClass('e-m-progress');
            this.element.remove();
        },

        /*---------------Public Methods---------------*/

        getValue: function () {
            return this._setValue;
        },

        getPercentage: function () {
            /// <summary>Returns the Progress bar value in percentage.</summary>
            return this.model.percentage;
        },

        setCustomText: function (customText) {
            var context = this._context, height = this._totalHeight, radius = this.totalRadius, width = this._totalWidth, x, y;
            this.model.text = customText;
            var ang = 270;
            if (this.model.renderMode == "ios7") {
                x = (this.model.orientation == "horizontal") ? 0 : 8;
                y = (this.model.orientation == "horizontal") ? 8 : 0;
            }
            else if (this.model.renderMode == "android")
                y = 15;
            else if (this.model.renderMode == "windows" || this.model.renderMode == "flat") {
                x = 0;
                y = 30;
            }
            context.save();
            if (this.model.renderMode == "ios7")
                this._setCustomtextProperties(context, "#fefefe", "#000000", "14px Helvetica");
            else if (this.model.renderMode == "android")
                this._setCustomtextProperties(context, "#fefefe", "#333333", "17px Roboto");
            else if (this.model.renderMode == "windows")
                this._setCustomtextProperties(context, "#ffffff", "#000000", "17px Segoe UI");
            else if (this.model.renderMode == "flat")
                this._setCustomtextProperties(context, "#333333", "#333333", "17px Segoe UI");
            var textWidth = context.measureText(this.model.text).width;
            var def_wid = context.measureText(this._setValue + "%").width;
            if (this.model.orientation == "horizontal") {
                var textX = x + width / 2 - textWidth / 2;
                if (this.model.renderMode == "ios7")
                    context.fillText(this.model.text, textX, y + 5);
                else if (this.model.renderMode == "android") {
                    if (this.model.text != "" && this.model.text != undefined)
                        context.fillText(this.model.text, width - textWidth - 15, y);
                    else
                        context.fillText(this.model.text, width - def_wid - 15, y);

                }
                else if (this.model.renderMode == "windows" || this.model.renderMode == "flat")
                    context.fillText(this.model.text, x, height + y);
            }
            else {
                var textX = y + 15;
                if (this.model.renderMode == "ios7")
                    context.fillText(this.model.text, y, textX);
                else if (this.model.renderMode == "android") {
                    if (this.model.text != "" && this.model.text != undefined)
                        context.fillText(this.model.text, (height - 15) / 2, 15);
                    else
                        context.fillText(this.model.text, (height - 15) / 2, y);
                    context.textAlign = "right";
                }
                else if (this.model.renderMode == "windows" || this.model.renderMode == "flat")
                    context.fillText(this.model.text, -(height - 15) / 2, y + width);
            }
            context.restore();
        },
        changeEventHandler: function (proxy, value) {
            var data = { element: this.element, value: this._setValue, percentage: this._value };
            if (this.model.change)
                this._trigger("change", data);
        }
        /*---------------Public Methods End---------------*/
    });


    ej.mobile.Progress.Orientation = {
        Horizontal: "horizontal",
        Vertical: "vertical"
    };
    ej.mobile.Progress.Locale = ej.mobile.Progress.Locale || {};

    ej.mobile.Progress.Locale["default"] = ej.mobile.Progress.Locale["en-US"] = {
        text: ""
    }
})(jQuery, Syncfusion);