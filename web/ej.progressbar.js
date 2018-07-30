/**
* @fileOverview Plugin to style the Progressbar elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejProgressBar", "ej.ProgressBar", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _addToPersist: ["value", "percentage"],
        _setFirst: false,
        _rootCSS: "e-progressbar",

        defaults: {

            text: "",

            cssClass: "",

            minValue: 0,

            maxValue: 100,

            value: 0,

            percentage: 0,

            height: null,

            htmlAttributes: {},

            width: null,

            enabled: true,

            enableRTL: false,

            showRoundedCorner: false,

            enablePersistence: false,

            start: null,

            complete: null,

            change: null,

            create: null,

            destroy: null

        },


        dataTypes: {
            cssClass: "string",
            minValue: "number",
            maxValue: "number",
            enabled: "boolean",
            enableRTL: "boolean",
            showRoundedCorner: "boolean",
            htmlAttributes: "data"
        },


        _setValue: function (value) {
            if (value == null) value = this.model.minValue;
            else if (typeof value === "string") value = parseFloat(value);
            if (this._isNumber(value)) this.model.value = value;
            else if (!this._isNumber(this.model.value)) this.model.value = this.model.minValue;
            this.model.value = this._validateRange(this.model.value, this.model.minValue, this.model.maxValue);
            this._setProgressValue();
        },

        _setPercent: function (percent) {
            this.initial = this.model.percentage;
            if (this.initial == 100) this.initial = 0;
            if (percent == null) percent = 0;
            else if (typeof percent === "string") percent = parseFloat(percent);
            if (this._isNumber(percent)) this.model.percentage = percent;
            else if (!this._isNumber(this.model.percentage)) this.model.percentage = 0;
            this.model.percentage = this._validateRange(this.model.percentage, 0, 100);
            this.model.value = this._percentToValue(this.model.percentage);
            this._increaseProgressWidth();
        },

        _validateMinMax: function () {
            if (isNaN(this.model.minValue)) this.model.minValue = 0;
            if (isNaN(this.model.maxValue)) this.model.maxValue = 100;
        },

        _setText: function (text) {
            if (text) {
                if (this.text) this.text.html(text);
                else {
                    this.text = ej.buildTag("div.e-progress-txt", text);
                    this.element.append(this.text);
                    this._setTop();
                }
            }
            else if (this.text) {
                this.text.remove();
                this.text = null;
            }
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
            }
        },


        enable: function () {
            this.element.removeClass("e-disable");
            this.model.enabled = true;
        },

        disable: function () {
            this.element.addClass("e-disable");
            this.model.enabled = false;
        },

        getValue: function () {
            return this.model.value;
        },

        getPercentage: function () {
            return this.model.percentage;
        },


        _init: function () {
            this._initialize();
            this._render();
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "value":
                        this._setValue(options[option]);
                        options[option] = this.model.value; break;
                    case "percentage":
                        this._setPercent(options[option]);
                        options[option] = this.model.percentage; break;
                    case "minValue":
                        if (!isNaN(options[option])) this._minValidation(options[option]);
                        options[option] = this.model.minValue; break;
                    case "maxValue":
                        if (!isNaN(options[option])) this._maxValidation(options[option]);
                        options[option] = this.model.maxValue; break;
                    case "text": this._setText(options[option]); break;
                    case "height": this._setHeight(options[option]); if (this.text) this._setTop(); break;
                    case "width": this._setWidth(options[option]); break;
                    case "enabled": this._disabled(!options[option]); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "enableRTL": this._rtl(options[option]); break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }
        },

        _destroy: function () {
            this.element.empty();
            this.element.removeClass("e-widget e-box e-corner " + this.model.cssClass).css("height","");
        },


        _initialize: function () {
            this.text = null;
            this.header = null;
            this._preVal = null;
        },


        _render: function () {
            this.initialRender = true;
            this.element.addClass("e-widget e-box " + this.model.cssClass).attr("role", "progressbar");
            this._setDimention();
            this.header = ej.buildTag("div.e-progress");
            this.element.append(this.header);
            this._setText(this.model.text);
            this._setInitialValue();
            this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
            this._roundedCorner(this.model.showRoundedCorner);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy._disabled(false);
                else proxy.element.attr(key, value)
            });
        },


        _setDimention: function () {
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
        },

        _setHeight: function (height) {
            if (height) this.element.height(height);
        },

        _setWidth: function (width) {
            if (width) this.element.css("width", width);
        },


        _setInitialValue: function () {
            this._validateMinMax();
            if (this.model.percentage) this._setPercent(this.model.percentage);
            else this._setValue(this.model.value);
        },

        _disabled: function (boolean) {
            if (boolean) this.disable();
            else this.enable();
        },

        _checkProperties: function () {
            if (this.model.enableRTL) this._rtl(this.model.enableRTL);
            this._minValidation(this.model.minValue);
            this._maxValidation(this.model.maxValue);
            if (!this.model.enabled) this._disabled(true);
        },

        _rtl: function (boolean) {
            if (boolean) this.element.addClass("e-rtl");
            else this.element.removeClass("e-rtl");
        },

        _roundedCorner: function (value) {
            if (value && !this.element.hasClass('e-corner'))
                this.element.addClass('e-corner');
            else if (this.element.hasClass('e-corner'))
                this.element.removeClass('e-corner');
        },

        _minValidation: function (minvalue) {
            if (this.model.maxValue && this.model.maxValue < minvalue) this.model.maxValue = minvalue;
            if (this.model.value < minvalue)
                this.model.value = minvalue;
            this.model.minValue = minvalue;
            this._setProgressValue();
        },

        _maxValidation: function (maxValue) {
            if (this.model.minValue && this.model.minValue > maxValue) this.model.minValue = maxValue;
            if (this.model.value > maxValue)
                this.model.value = maxValue;
            this.model.maxValue = maxValue;
            this._setProgressValue();
        },


        _setTop: function () {
            var top = (this.element.height() - this.text.height()) / 2;
            this.text.css("top", Math.floor(top));
        },


        _increaseProgressWidth: function () {
            this.header.css("width", this.model.percentage + "%");
            if (this.initial == 0 && this.model.percentage != this.initial)
                this._raiseEvent("start");
            if (this._preVal != this.model.value) {
                this._preVal = this.model.value;
                $(this.header).attr("aria-label", this.model.percentage);
                if (this.header.hasClass("e-complete"))
                    this.header.removeClass("e-complete");
				this.initialRender ? this.initialRender = false : this._raiseEvent("change");
                if (this.model.percentage == 100) {
                    this.header.addClass("e-complete");
                    this._raiseEvent("complete");
                }
            }
        },

        _raiseEvent: function (event) {
            this._trigger(event, { value: this.model.value, percentage: this.model.percentage });
        },

        _setProgressValue: function () {
            this.initial = this.model.percentage;
            this.model.percentage = this._valueToPercent(this.model.value);
            this._increaseProgressWidth();
        },


        _isNumber: function (number) {
            return typeof number === "number" && !isNaN(number);
        },


        _validateRange: function (value, minvalue, maxValue) {
            if (value < minvalue) return minvalue;
            else if (value > maxValue) return maxValue;
            return value;
        },


        _valueToPercent: function (value) {
            if (this.model.maxValue <= this.model.minValue) return 100;
            value = this._validateRange(value, this.model.minValue, this.model.maxValue);
            value = (100 * (value - this.model.minValue)) / (this.model.maxValue - this.model.minValue);
            return value;
        },


        _percentToValue: function (percent) {
            if (this.model.maxValue <= this.model.minValue) { return this.model.minValue; }
            if (percent >= 0 && percent <= 100) {
                var diff = this.model.maxValue - this.model.minValue;
                var val = diff * percent / 100;
                percent = val + this.model.minValue;
            }
            else if (percent < 0) percent = this.model.minValue;
            else if (percent > 100) percent = this.model.maxValue;
            return percent;
        }
    });

})(jQuery, Syncfusion);