/**
* @fileOverview Plugin to style the Html input elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget(
    {
        "ejNumericTextbox": ["ej.NumericTextbox", "e-numerictextbox"],
        "ejPercentageTextbox": ["ej.PercentageTextbox", "e-percentagetextbox"],
        "ejCurrencyTextbox": ["ej.CurrencyTextbox", "e-currencytextbox"]
    },
    {
        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _setFirst: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true,
            requireParser:true
        },

        defaults: {

            width: "",

            height: "",

            value: null,

            name: null,

            htmlAttributes: {},

            minValue: -(Number.MAX_VALUE),

            maxValue: Number.MAX_VALUE,

            incrementStep: 1,

            decimalPlaces: 0,

            validateOnType: false,

            cssClass: "",

            enablePersistence: false,

            showSpinButton: true,

            locale: "en-US",

            enableStrictMode: false,

            showRoundedCorner: false,

            readOnly: false,

            enabled: true,

            enableRTL: false,

            watermarkText: "Enter value",

            validationRules: null,

            validationMessage: null,

            groupSeparator: null,

            groupSize: null,

            positivePattern: null,

            currencySymbol:null,

            negativePattern: null,

            change: null,

            focusIn: null,

            focusOut: null,

            create: null,

            destroy: null
        },

        dataTypes: {
            minValue: "number",
            maxValue: "number",
            incrementStep: "number",
            decimalPlaces: "number",
            showSpinButton: "boolean",
            enableStrictMode: "boolean",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            locale: "string",
            watermarkText: "string",
            cssClass: "string",
            readOnly: "boolean",
            enabled: "boolean",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data",
            validateOnType: "boolean",
            groupSeparator: "string"
        },
        observables: ["value"],

        _setModel: function (jsondata) {
            var validate = false;
            for (var key in jsondata) {
                switch (key) {
                    case "value":
                        if (ej.isNullOrUndefined(jsondata["minValue"]) && ej.isNullOrUndefined(jsondata["maxValue"])) {
                            this._setValue(jsondata[key], true);
                            jsondata[key] = this.model.value;
                        }
                        else {
                            this.model.value = this._checkNumValue(jsondata[key]);
                            this._localizedFormat();
                            this._raiseChangeEvent(true);
                            validate = true;
                        }
                        break;
                    case "enableRTL": this._enableRTL(jsondata[key]); break;
                    case "width": this._setWidth(jsondata[key]); break;
                    case "height": this._setHeight(jsondata[key]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessage = null;
                        }
                        this.model.validationRules = jsondata[key];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessage = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessage != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "minValue":
                        if (isNaN(jsondata[key])) return;
                        this.model.minValue = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        validate = true;
                        break;
                    case "maxValue":
                        if (isNaN(jsondata[key])) return;
                        this.model.maxValue = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        validate = true;
                        break;
                    case "incrementStep":
                        if (isNaN(jsondata[key])) return;
                        this.model.incrementStep = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        break;
                    case "enableStrictMode": this.model.enableStrictMode = jsondata[key]; validate = true; break;
                    case "showSpinButton": this._showSpin(jsondata[key]); break;
                    case "showRoundedCorner": this._roundedCorner(jsondata[key]); break;
                    case "locale":                        
                        this.model.decimalPlaces = ((ej.isNullOrUndefined(this._options.decimalPlaces)) && (this.model.decimalPlaces === this.culture.numberFormat.decimals))
                           ? -1 : (this._options.decimalPlaces === -1) ? -1 : this.model.decimalPlaces;
                        this._setLocalize(jsondata[key]);
                        this._options.decimalPlaces = this.model.decimalPlaces;
						jsondata[key] = this.model.locale;
						break;
                    case "decimalPlaces":
                        this._setDecimal(jsondata[key]);
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["decimalPlaces"] = jsondata[key];
                        break;
                    case "cssClass": this._setSkin(jsondata[key]); break;
                    case "readOnly": this._setReadOnly(jsondata[key]); break;
                    case "enabled": if (jsondata[key]) this.enable(); else this.disable(); break;
                    case "watermarkText":
                        if(!ej.isNullOrUndefined(this._options)) this._options = [];
                        this._options["watermarkText"] = this.model.watermarkText = jsondata[key];
                        this._localizedLabels.watermarkText = this.model.watermarkText;						
						this._changeWatermark(jsondata[key]);
						break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "groupSeparator":
                        this._checkSeparator(jsondata[key]);
                        jsondata[key] = this.model.groupSeparator;
                        break;
                    case "positivePattern":
                    case "negativePattern":
                    case "groupSize":
                    case "currencySymbol":
                        this.model[key] = jsondata[key];
                        this._options[key] = jsondata[key];
                        this._initCustomValue();
                        jsondata[key] = this.model[key];
                        this._setValue(this.model.value, true);
                        break;                    
                }
            }
            if (validate) {
                this._validateMinMaxValue(true, true);
                jsondata["value"] = this.model.value;
                jsondata["maxValue"] = this.model.maxValue;
                jsondata["minValue"] = this.model.minValue;
                if (this.model.minValue != -(Number.MAX_VALUE)) this._startValue = this.model.minValue;
				this.wrapper.attr({ 'aria-valuemin': this.model.minValue, 'aria-valuemax': this.model.maxValue, 'aria-valuenow': this.model.value });
            }
            this._checkSeparator(this.model.groupSeparator);
            this.element.val(this._removeSeparator(this.model.value));
            this._updateSeparator();
            this._checkErrorClass();
        },


        _destroy: function () {
            if (this.wrapper) {
                this.element.insertBefore(this.wrapper);
                this.wrapper.remove();
            }
            if (this._isWatermark) this.element.removeAttr("placeholder");
            this.element.val("").removeClass('e-input e-disable e-no-spin').empty();
            this.element.removeAttr('disabled aria-disabled');
			this.wrapper.removeAttr('aria-valuemin aria-valuemax aria-valuenow aria-live');
            if (!(this._cloneElement).attr('role')) this.element.removeAttr('role');
            this.element.css("display", "block");
        },



        _init: function (options) {
            this._cloneElement = this.element.clone();
            this._options = ej.isNullOrUndefined(options) ? {} :options;
            if (this.element.is("input") && (this.element.is("input[type=text]") || this.element.is("input[type=number]") || !this.element.attr('type'))) {
                if (this.model.decimalPlaces > 0) {
                    if (this.element.is("input[type=number]"))
                        this.element[0].type = "tel";
                    else this.element[0].type = "text";
                }
                if (this.element.is("input[type=number]")) this.element.addClass("e-no-spin");
                this._isWatermark = 'placeholder' in document.createElement('input');
                this.model.locale = ej.preferredCulture(this.model.locale).name == "en" ? "en-US" : ej.preferredCulture(this.model.locale).name;
                this._localizedLabels = this._getLocalizedLabels();
                this.culture = ej.preferredCulture(this.model.locale);
                this._browsername = ej.browserInfo().name;
                this._initCustomValue();
                this._prevSeparator = null;
                this._checkSeparator(this.model.groupSeparator);
                this._checkAttribute();
                this._renderControl();
                this._setValues();
                this._wireEvents();
                this._initObjects();
                this._addAttr(this.model.htmlAttributes);
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
                this._updateSeparator();
                if (options && options.value != undefined) {
                    this._trigger("_change", { value: this.model.value });
                }
            }
            else {
                this._destroy();
                return false;
            }
        },
		
        _checkAttribute: function () {
            var attr = ["min", "max", "step", "readonly", "disabled", "placeholder"], propName = ["minValue", "maxValue", "incrementStep", "readOnly", "enabled", "watermarkText"], value, propValue;
            for (var i = 0; i < attr.length; i++) {
                value = this.element.attr(attr[i]); propValue = propName[i];
                if ((!ej.isNullOrUndefined(value)) && !ej.isNullOrUndefined(this._options) && (ej.isNullOrUndefined(this._options[propValue]))) {
                    if (propValue == "watermarkText") this._options[propValue] = value;
                    else this.model[propValue] = ((propValue != "disabled") && (propValue != "readOnly")) ? ej.parseFloat(value, this.model.locale) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                }
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "accesskey") proxy._hiddenInput.attr(key, value);
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readonly" && value == "readOnly") proxy._setReadOnly(true);
                else if (keyName == "tabindex") {
                    proxy._hiddenInput.attr(key, value);
                    proxy.element.attr(key, value);
                }
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);
            });
        },

        _setValues: function () {
            this._id = this.element[0].id;
            this._textBox = this._hiddenInput[0];
            this._error = false;
            this._timeout = null;
            this.isValidState = true;
            this._allowkeyboard = true;
            this._validateOnType = false;
            this._focused = false;
            this._startValue = 0;
            if (this.sfType === "ej.CurrencyTextbox" && this.model.minValue == -(Number.MAX_VALUE))
                this.model.minValue = 0;
            if (ej.isNullOrUndefined(this.model.decimalPlaces)) {
                if (this.sfType === "ej.CurrencyTextbox")
                    this.model.decimalPlaces = ej.preferredCulture(this.model.locale).numberFormat.currency.decimals;
                else this.model.decimalPlaces = ej.preferredCulture(this.model.locale).numberFormat.decimals;

            }
            if (this.model.decimalPlaces >= 0) {
                this.model.minValue = parseFloat(this.model.minValue.toFixed(this.model.decimalPlaces));
                this.model.maxValue = parseFloat(this.model.maxValue.toFixed(this.model.decimalPlaces));
            }
            if (this.model.minValue != -(Number.MAX_VALUE)) this._startValue = this.model.minValue;
			if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
                
            }
            this._localizedLabelToModel();
            this._localizedFormat();
            this._validateMinMaxValue(true);
            this._updateSymbol(this.model.locale);
            var value;
            if (ej.isNullOrUndefined(this.model.value)) {
                value = this.model.value;
                this.wrapper.removeClass('e-valid');
            }
            else {
                value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                this.wrapper.addClass('e-valid');
            }
           this.element.val(value);
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            var rules = this.model.validationRules;
            this.element.rules("add", rules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this.element.attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in rules) {
                var message = null;
                if (!ej.isNullOrUndefined(rules[ruleName])) {
                    if (!ej.isNullOrUndefined(rules["messages"] && rules["messages"][ruleName]))
                        message = rules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessage)
                            ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },


        _renderControl: function () {
            this.wrapper = ej.buildTag("span.e-widget e-pinch");
            this.innerWrap = ej.buildTag("span.e-in-wrap e-box ");
            this.wrapper.attr("style", this.element.attr("style"));
            if (this.sfType === "ej.NumericTextbox")
                this.wrapper.addClass('e-numeric');
            else if (this.sfType === "ej.PercentageTextbox")
                this.wrapper.addClass('e-percent');
            else if (this.sfType === "ej.CurrencyTextbox")
                this.wrapper.addClass('e-currency');
            this.wrapper.append(this.innerWrap).insertAfter(this.element);
            this.innerWrap.append(this.element);
            this._hiddenInput = ej.buildTag("input", "", {}, { type: "text" }).insertBefore(this.element);
            this._hiddenInput.attr('data-role', 'none');

            this._hiddenInput[0].tabIndex = this.element[0].tabIndex;
            this._hiddenInput.attr("accesskey", this.element[0].accessKey);
            this.element[0].accessKey = "";

            this._hiddenInput.css("display", "block");
            this.element.css("display", "none");
            if (!this._isWatermark) {
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(this._localizedLabels.watermarkText);
                this._hiddenSpan.css("display", "none");
                this._on(this._hiddenSpan,"mousedown", this._focusIn);
                this._on(this._hiddenSpan,'mousewheel', this._mouseWheel);
                this._on(this._hiddenSpan,'DOMMouseScroll',this._mouseWheel);
            }
            this.model.name = this.element.attr("name") != null ? this.element.attr("name") : (this.model.name != null ? this.model.name : this.element[0].id);
            this.element.attr("name") == null ? this.element.attr("name", this.model.name) : "";
            this.element.addClass('e-input');
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "") {
                if (ej.preferredCulture(this.model.locale).numberFormat[','] == ".")
                    this.element[0].value = this.element[0].value.replace(".", ",");
                this.model.value = this._checkNumValue(this.element[0].value);
            }   
            else {
                if (typeof this.model.value== "string" && ej.preferredCulture(this.model.locale).numberFormat[','] == ".")
                    this.model.value = this.model.value.replace(".", ",");
                this.model.value = this._checkNumValue(this.model.value);
            }
            this._hiddenInput.attr({ 'value': this.model.value }).addClass('e-input');
			this.wrapper.attr({'role': 'spinbutton', 'aria-valuemin': this.model.minValue, 'aria-valuemax': this.model.maxValue, 'aria-valuenow': this.model.value,});
            this.element.attr({'aria-live': 'assertive', "value": this.model.value });
            var spinbutton = $('<span class="e-select"><span class="e-spin e-spin-up " role="button" aria-label="Increase Value" unselectable="on" /><span class="e-spin e-spin-down" role="button" aria-label="Decrease Value" unselectable="on" /></span>');
            spinbutton.find('.e-spin-up').append(ej.buildTag('span.e-icon e-arrow e-arrow-sans-up').attr({ 'role': 'presentation', 'unselectable': 'on' }));
            spinbutton.find('.e-spin-down').append(ej.buildTag('span.e-icon e-arrow e-arrow-sans-down').attr({ 'role': 'presentation', 'unselectable': 'on' }));
            this.innerWrap.append(spinbutton);
            this.spin = this.wrapper.find('.e-select');
            this.spinUp = this.wrapper.find('.e-spin-up');
            this.spinDown = this.wrapper.find('.e-spin-down');
            this._setWidth(this.model.width);
            this._setHeight(this.model.height);
            if (this.model.cssClass != "") this._setSkin(this.model.cssClass);
            this._showSpin(this.model.showSpinButton);
            if (this.model.showRoundedCorner) this._roundedCorner(this.model.showRoundedCorner);
            if (this.model.enableRTL) this._enableRTL(this.model.enableRTL);
            if (this.model.readOnly) this._setReadOnly(this.model.readOnly);
            if (!this.model.enabled) this.disable();
            else if (this.model.enabled && this.element.hasClass("e-disable")) this.enable();
        },


        _initObjects: function () {
            this._preVal = this.model.value;
            if (this.model.value === null) {
                this.isValidState = true;
                this._hiddenInput.val(null);
            }
            else if ((this.model.value < this.model.minValue) || (this.model.value > this.model.maxValue))
                this.isValidState = false;
            this._checkErrorClass();
            this._setWaterMark();
        },


        _showSpin: function (value) {
            if (!value) {
                if (this.spin) {
                    this.spin.hide();
                    this.innerWrap.removeClass('e-padding');
                }
                this._spinEvents("_off");
            }
            else {
                if (this.spin) {
                    this.spin.show();
                    this.innerWrap.addClass('e-padding');
                }
                this._spinEvents("_on");
            }
        },


        _roundedCorner: function (value) {
            if (value && !this.innerWrap.hasClass('e-corner')) {
                this.innerWrap.addClass('e-corner');
            } else if (this.innerWrap.hasClass('e-corner')) {
                this.innerWrap.removeClass('e-corner');
            }
        },


        _enableRTL: function (enableRTL) {
            if (enableRTL) {
                if (this.spin) {
                    this.wrapper.addClass("e-rtl");
                }
                else this.element.addClass("e-rtl");
            }
            else {
                if (this.spin) {
                    this.wrapper.removeClass("e-rtl");
                }
                else this.element.removeClass("e-rtl");
            }
        },


        _setWidth: function (value) {
            value != "" ? this.wrapper.width(value) : this.model.width = this.wrapper.outerWidth();
        },


        _setHeight: function (value) {
            value != "" ? this.wrapper.height(value) : this.model.height = this.wrapper.outerHeight();
        },


        _setSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass);
            this.wrapper.addClass(skin);
        },


        _setValue: function (value, isCode) {
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this.model.value = this._checkNumValue(value);
            this._validateMinMaxValue(false);
            this._checkErrorClass();
            this._localizedFormat();
            this._raiseChangeEvent(isCode);
            this._setWaterMark();
        },

        _setLocalize: function (val) {
            var prevSeparator = ej.preferredCulture(this.model.locale).numberFormat[',']
            this.model.locale = ej.preferredCulture(val).name == "en" ? "en-US" : ej.preferredCulture(val).name;
            this.model.groupSeparator = ((ej.isNullOrUndefined(this._options.groupSeparator) && (prevSeparator === this.model.groupSeparator))) ?
                ej.preferredCulture(this.model.locale).numberFormat[','] : this.model.groupSeparator;
			this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            this._localizedLabelToModel();
            this.culture = ej.preferredCulture(this.model.locale);
            this._initCustomValue();
            this._updateSymbol(this.model.locale);
            this._localizedFormat();
            this._changeWatermark(this.model.watermarkText);
            if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
            else value = (this.model.value.toString().indexOf('e') == -1) ? this._formatValue(this.model.value, "n",true) : this._convertToExponetial(this.model.value).unformattedValue;
            this.element.val(value);
			
        },
		 _localizedLabelToModel: function () {
            this.model.watermarkText = this._localizedLabels.watermarkText;
            
        },
        _updateSymbol: function (locale) {
            this._percentSymbol = ej.preferredCulture(locale).numberFormat.percent.symbol;
            this._currencySymbol = ej.preferredCulture(locale).numberFormat.currency.symbol;
        },

        _setDecimal: function (val) {
            this.model.decimalPlaces = val;
            this._localizedFormat();
        },


        _validateMinMaxValue: function (fromMinMax, isCode) {
            var valChange = false, value;
            if (this.model.minValue > this.model.maxValue) this.model.minValue = this.model.maxValue;
            if (!ej.isNullOrUndefined(this.model.value) && this.model.minValue > this.model.value) {
                if (this.model.enableStrictMode != true) {
                    this.isValidState = true;
                    this._startValue = this.model.value = this.model.minValue;
                }
                else this.isValidState = false;
                valChange = true;
            }
            else if (!ej.isNullOrUndefined(this.model.value) && this.model.maxValue < this.model.value) {
                if (this.model.enableStrictMode != true) {
                    this.isValidState = true;
                    this.model.value = this.model.maxValue;
                }
                else this.isValidState = false;
                valChange = true;
            }
            else this.isValidState = true;
            if (this.model.minValue == this.model.maxValue) this._startValue = this.model.minValue;
            if ((valChange && fromMinMax)) {
                value = this._formatValue(this.model.value, "n", true);
                this._hiddenInput.val(value);
                if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
                else value = (this.model.value.toString().indexOf('e') == -1) ? this._formatValue(this.model.value, "n", true) : this._convertToExponetial(this.model.value).unformattedValue;
                this.element.val(value);
                this._localizedFormat();
                this._raiseChangeEvent(isCode);
            }
        },

        _convertToExponetial: function (value) {
            var number = "", pattern, format, unformattedValue, symbol;
            var negative = value < 0 ? true : false;
            value = value.toString();
            format = ej.preferredCulture(this.model.locale).numberFormat;
            value = value.replace(".", format["."]);
            unformattedValue = value;
            var length = null;
            if (this.sfType === "ej.NumericTextbox") {
                pattern = negative ? format.pattern[0] : ej.isNullOrUndefined(format.pattern[1]) ? "n" : format.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = "";
            }
            else if (this.sfType === "ej.PercentageTextbox") {
                pattern = negative ? format.percent.pattern[0] : format.percent.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = format.percent.symbol;
            }
            else if (this.sfType === "ej.CurrencyTextbox") {
                pattern = negative ? format.currency.pattern[0] : format.currency.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = format.currency.symbol;
            }
            for (var idx = 0, length = pattern.length; idx < length; idx++) {
                var ch = pattern.charAt(idx);
                (ch === "n") ? number += value : (ch === "$" || ch === "%") ? number += symbol : number += ch;
            }
            return { formattedValue: number, unformattedValue: unformattedValue }
        },

        _localizedFormat: function () {
            this.culture = ej.preferredCulture(this.model.locale);
            this._decimalSep = ej.preferredCulture(this.model.locale).numberFormat['.'];
            if (ej.isNullOrUndefined(this.model.value)) {
                this._textBox.value = "";
                return;
            }
            if (this.model.value.toString().indexOf('e') == -1) {
                this._textBox.value = this._removeSeparator(this.model.value)
                if (!this._focused && this._textBox.value != "") {
                    this._textBox.value = this._formatValue(this.model.value, "n", true);
					
                    if (this.sfType === "ej.PercentageTextbox") this._appendPercentSymbol(this._textBox.value);
                    else if (this.sfType === "ej.CurrencyTextbox") this._appendCurrencySymbol(this._textBox.value);


                    var symbolIndex = (this.sfType === "ej.CurrencyTextbox") ? this._textBox.value.indexOf(this._currencySymbol) : (this.sfType === "ej.PercentageTextbox") ? this._textBox.value.indexOf(this._percentSymbol) : -1;

                    if (this.model.decimalPlaces == -1 && this._afterDec !=0) {
                        this._textBox.value = this._textBox.value.substr(0, this._textBox.value.lastIndexOf(this._decimalSep));
                        if (symbolIndex > 1 && (ej.isNullOrUndefined(this._afterDec) || this._afterDec == "")) {
                            if (this.sfType === "ej.CurrencyTextbox")
                                this._textBox.value = this._textBox.value + " " + this._currencySymbol;
                            if (this.sfType === "ej.PercentageTextbox")
                                this._textBox.value = this._textBox.value + " " + this._percentSymbol;
                        }
                        if (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this._afterDec) && this._afterDec != "") {
                            var index = this._textBox.value.lastIndexOf(this._decimalSep);
                            if (index >= 0) {
                                this._textBox.value = this._textBox.value.substr(0, index);
                            }
                            var symbolPos = this._afterDec;
                            if (symbolIndex > 1) {
                                if (this.sfType === "ej.CurrencyTextbox")
                                    symbolPos = symbolPos + " " + this._currencySymbol;
                                if (this.sfType === "ej.PercentageTextbox")
                                    symbolPos = symbolPos + " " + this._percentSymbol;

                            }
                            this._textBox.value = this._textBox.value + this._decimalSep + symbolPos;
                        }
                    }
                }
                else {
                    var value = this._convertToExponetial(this.model.value);
                    this._textBox.value = value.unformattedValue;
                    if (!this._focused && this._textBox.value != "")
                        this._textBox.value = value.formattedValue;
                }
            }
            else {
                this._textBox.value = this.model.value.toString();
            }
        },

        _checkNumValue: function (value) {
            if (typeof value == "string")
                value = !this._changeSeparator ? value : this._replaceSeparator(value, this.model.groupSeparator, ej.preferredCulture(this.model.locale).numberFormat[',']);
            if (typeof value == "string" && !isNaN(this._parseValue(value))) {
                value = this._parseValue(value);
                return parseFloat(value);
            }
            else if ((typeof value == "number") && !isNaN(value))
                return value;
            else return null;
        },


        _setReadOnly: function (bool) {
            this.model.readOnly = bool;
            if (bool) {
                this.element.attr("readonly", true);
                this._hiddenInput.attr("readonly", true);
            }
            else {
                this.element.prop("readonly",false);
                this._hiddenInput.prop("readonly",false);
            }
        },


        _setWaterMark: function () {
            if ((this._localizedLabels.watermarkText != null) && (this._textBox.value === "") && $.trim(this._hiddenInput.val()) === "") {
                if (this._isWatermark) {
                    this._hiddenInput.attr("placeholder", this._localizedLabels.watermarkText);
                    this.element.attr("placeholder", this._localizedLabels.watermarkText);
                }
                else
                    this._hiddenSpan.css("display", "block").text(this._localizedLabels.watermarkText);
            }
        },


        _changeWatermark: function (text) {
            if (!this.model.enabled) return false;
            if (this._isWatermark) {
                this._hiddenInput.attr("placeholder", text);
                this.element.attr("placeholder", text);
            }
            else this._hiddenSpan.text(text);
        },


        _setSelectionRange: function (selectionStart, selectionEnd) {
            var input = this._textBox;
            try {
                if (input.setSelectionRange) {
                    if (this._browsername == "edge")  setTimeout(function () { input.setSelectionRange(selectionStart, selectionEnd) })
                    else input.setSelectionRange(selectionStart, selectionEnd);
                }
                else if (input.createTextRange) {
                    var range = input.createTextRange();
                    _setselction(range);
                }
            }
            catch (e) {
                var control = this;
                window.setTimeout(function () {
                    document.body.focus();
                    control._textBox.select();
                    if (document.selection) {
                        var range = document.selection.createRange();
                        _setselction(range);
                    }
                }, 1);
            }
            function _setselction(range) {
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        },


        _getSelection: function (value) {
            if (this._textBox.type != "number") {
                var oSel = null;
                if (document.selection) {
                    oSel = document.selection.createRange();
                    return (oSel.text === "" ? oSel.text : this._removeFormats(oSel.text));
                }
                else {
                    if (value == null)
                        return this.model.value;
                    else {
                        oSel = this._removeFormats(value.substring(this._textBox.selectionStart, this._textBox.selectionEnd));
                        return oSel;
                    }
                }
            }
        },


        _caretPosition: function () {
            var oField = this._textBox;
            var iCaretPos = 0;
            // IE Support
            if (oField.type != "number") {
                if (document.selection) {
                    oField.focus();
                    // To get cursor position, get empty selection range
                    var oSel = document.selection.createRange();
                    // Move selection start to 0 position
                    oSel.moveStart('character', -oField.value.length);
                    // The caret position is selection length
                    iCaretPos = oSel.text.length;
                }
                    // Firefox support
                else if (oField.selectionStart || oField.selectionStart == '0')
                    iCaretPos = oField.selectionEnd;
                return (iCaretPos);
            }  
        },


        _appendPercentSymbol: function (value) {
            if (this._percentSymbol) value = value.replace(this._percentSymbol, "");
            if (value.indexOf(ej.preferredCulture(this.model.locale).numberFormat.percent.symbol) < 0)
                this._textBox.value = this._formatValue(this._parseValue(value) / 100, "p", true);
            this._percentSymbol = ej.preferredCulture(this.model.locale).numberFormat.percent.symbol;
        },

        _appendCurrencySymbol: function (value) {
            if (this._currencySymbol) value = value.replace(this._currencySymbol, "");
            if (value.indexOf(ej.preferredCulture(this.model.locale).numberFormat.currency.symbol) < 0)
                this._textBox.value = this._formatValue(this._parseValue(value), "c", true);
            this._currencySymbol = ej.preferredCulture(this.model.locale).numberFormat.currency.symbol;

        },

        _removeFormats: function (val) {
            var grpSep = ej.preferredCulture(this.model.locale).numberFormat[","];
            if (val != null) {
                if (grpSep == ".")
                    return (val.toString().replace(/["."]/g, ""));
                else if (val.toString().match(new RegExp(grpSep, "g")))
                    return (val.toString().replace(new RegExp(grpSep, "g"), ""));
                else
                    return val;
            }
            else
                return null;
        },


        _checkErrorClass: function (obj) {
            if (this.isValidState) this.wrapper.removeClass("e-error");
            else this.wrapper.addClass("e-error");
        },
		


        enable: function () {
            this.model.enabled = true;
            this.element[0].disabled = false;
            this.element.prop("disabled",false);
            this._hiddenInput.prop("disabled", false);
            this.element.removeClass('e-disable').attr({ "aria-disabled": false });
            this._hiddenInput.removeClass('e-disable').attr({ "aria-disabled": false });
            this.wrapper.find(".e-select").removeClass('e-disable').attr({ "aria-disabled": false });
            this.wrapper.find(".e-select span.e-icon.e-arrow").removeClass('e-disable');
            this.wrapper.removeClass('e-disable-wrap');
        },


        disable: function () {
            this.model.enabled = false;
            this.element[0].disabled = true;
            this.element.attr("disabled", "disabled");
            this._hiddenInput.attr("disabled", "disabled");
            this.element.addClass('e-disable').attr({ "aria-disabled": true });
            this._hiddenInput.addClass('e-disable').attr({ "aria-disabled": true });
            this.wrapper.find(".e-select").addClass('e-disable').attr({ "aria-disabled": true });
            this.wrapper.find(".e-select span.e-icon.e-arrow").addClass('e-disable');
            this.wrapper.addClass('e-disable-wrap');
        },


        getValue: function () {
            return this.model.value;
        },

        _wireEvents: function () {
            this._on(this._hiddenInput, 'focus', this._focusIn);
            this._on(this.element, 'paste', this._paste);
            this._on(this.element, 'blur', this._focusOut);
            this._on(this.element, 'keydown', this._keyDown);
            this._on(this.element, 'keypress', this._keyPress);
            this._on(this.element, 'mousewheel', this._mouseWheel);
            this._on(this.element, 'DOMMouseScroll', this._mouseWheel);
        },

        _spinEvents: function (action) {
            this[action](this.spinUp, "mousedown mouseup touchstart touchend", this._spinUpClick);
            this[action](this.spinDown, "mousedown mouseup touchstart touchend", this._spinDownClick);
        },

        _isIE8: function () {
            var _ie8 = false, browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie' && browserInfo.version == "8.0") {
                _ie8 = true;
            }
            return _ie8;
        },

        _spinUpClick: function (event) {
            var isNotLeftClick = false;
            if (event.button)
                isNotLeftClick = this._isIE8() ? event.button != 1 : event.button != 0;
            else if (event.which)
                isNotLeftClick = (event.which == 3); //for Opera
            if (isNotLeftClick) return;
            var self = this;
            event.preventDefault();
            clearTimeout(this._timeout);
            if (!this.model.enabled || this.model.readOnly) return;
            this.wrapper.find(".e-animate").removeClass("e-animate");
            this.spinUp.addClass("e-animate");
            this._on(this.spinUp, 'mouseleave', this._mouseUpClick);
            this.spinUp.addClass("e-active");
            var self = this;
            if (event.type == "mouseup"|| event.type == "touchend") {
                this._updateInputField("increment");
                this.spinUp.removeClass("e-active");
                this._off($(document), 'mouseup', this._mouseUpClick);
            }
            else if (event.type == "mousedown"|| event.type == "touchstart") {
                if (!this._focused) this._hiddenInput[0].focus();
                this._timeout = setInterval(function () {
                    self._updateInputField("increment");
                }, 150);
                this._on($(document), 'mouseup', this._mouseUpClick);
            }
        },

        _spinDownClick: function (event) {
            var isNotLeftClick = false;
            if (event.button)
                isNotLeftClick = this._isIE8() ? event.button != 1 : event.button != 0;
            else if (event.which)
                isNotLeftClick = (event.which == 3); //for Opera
            if (isNotLeftClick) return;
            var self = this;
            event.preventDefault();
            clearTimeout(this._timeout);
            if (!this.model.enabled || this.model.readOnly) return;
            this.wrapper.find(".e-animate").removeClass("e-animate");
            this.spinDown.addClass("e-animate");
            this._on(this.spinDown, 'mouseleave', this._mouseUpClick);
            this.spinDown.addClass("e-active");
            if (event.type == "mouseup"|| event.type == "touchend") {
                this._updateInputField("decrement");
                this.spinDown.removeClass("e-active");
                this._off($(document), 'mouseup', this._mouseUpClick);
            }
            else if (event.type == "mousedown"|| event.type == "touchstart") {
                if (!this._focused) this._hiddenInput[0].focus()
                this._timeout = setInterval(function () {
                    self._updateInputField("decrement");
                }, 150);
                this._on($(document), 'mouseup', this._mouseUpClick);
            }
        },

        _mouseUpClick: function (event) {
            event.stopPropagation();
            clearTimeout(this._timeout);
            this._off(this.spinUp, 'mouseleave', this._mouseUpClick);
            this._off(this.spinDown, 'mouseleave', this._mouseUpClick);
            this.spinDown.removeClass("e-active");
            this.spinUp.removeClass("e-active");
        },

        _mouseWheel: function (event) {
            event.preventDefault();
            if (!this._focused) this.element[0].focus();
            if (!this.model.enabled || this.model.readOnly) return;
            var delta;
            var rawEvent = event.originalEvent;
            if (rawEvent.wheelDelta) {
                // IE and Opera use wheelDelta, which is a multiple of 120 (possible values -120, 0, 120).
                delta = rawEvent.wheelDelta / 120;
                // In Opera, value is negated.
                //if (Sys.Browser.agent === Sys.Browser.Opera) delta = -delta;
            }
            else if (rawEvent.detail) {
                // Firefox uses detail property, which is a multiple of 3.
                delta = -rawEvent.detail / 3;
            }
            if (delta > 0)
                this._updateInputField("increment");
            else if (delta < 0)
                this._updateInputField("decrement");
            this._cancelEvent(event);
        },


        _numberValue: function () {
            var value = this._textBox.value;
            if (this.sfType === "ej.NumericTextbox")
                value = this._formatValue(this.model.value, "n", true);
            if (this.sfType === "ej.PercentageTextbox")
                value = this._formatValue(this.model.value, "n", true);
            else if (this.sfType === "ej.CurrencyTextbox")
                value = this._formatValue(this.model.value, "n", true);
            value = (typeof value == "string" && !isNaN(this._parseValue(value))) ? value : "";
            return value;
        },
        _formatValue: function (value, format,flag) {
            if(flag) this._updateCultureInfo();
			var value;
			    if(this.model.decimalPlaces != -1 || (this.model.decimalPlaces == -1 && this.model.value==null)){
				 value = ej.format(value, format + this.model.decimalPlaces, this.model.locale);
				}
				else{
					  value = ej.format(value, format + this._afterDec.length, this.model.locale);
			    }
				
            if (flag) this._restCultureInfo();
            return value;
        },
        _parseValue: function (value) {
            this._updateCultureInfo();
            var value = ej.parseFloat(value, this.model.locale);
            this._restCultureInfo();
            return value;            
        },

        _initCustomValue: function () {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            switch (ctr) {
                case "percent":
                case "currency":
                    format = this.culture.numberFormat[ctr];
                    if (ej.isNullOrUndefined(this._options.negativePattern)) this.model.negativePattern = format.pattern[0];
                    if (ej.isNullOrUndefined(this._options.positivePattern)) this.model.positivePattern = format.pattern[1];
                    if (ej.isNullOrUndefined(this._options.currencySymbol) && ctr == "currency") this.model.currencySymbol = format.symbol;
                    if (ej.isNullOrUndefined(this._options.groupSize)) this.model.groupSize = format.groupSizes[0];                    
                    break;
                case "numeric":
                    format = this.culture.numberFormat;
                    if (ej.isNullOrUndefined(this._options.negativePattern)) this.model.negativePattern = format.pattern[0];
                    if (ej.isNullOrUndefined(this._options.positivePattern)) this.model.positivePattern = ej.isNullOrUndefined(format.pattern[1]) ? "n" : format.pattern[1];
                    if (ej.isNullOrUndefined(this._options.groupSize)) this.model.groupSize = format.groupSizes[0];
                    break;
            }
        },

        _updateCultureInfo: function (flag) {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            format = ctr == "numeric" ? this.culture.numberFormat : this.culture.numberFormat[ctr];
            this._oldNegativePattern = format.pattern[0];
            this._oldGroupSize = format.groupSizes[0];
            format.pattern[0] = this.model.negativePattern;
            format.groupSizes[0] = this.model.groupSize;
            this._oldPositivePattern = format.pattern[1];
            format.pattern[1] = this.model.positivePattern;
            if (ctr == "currency") {
                this._oldcurrencySymbol = format.symbol;
                format.symbol = this.model.currencySymbol;
            }
        },
        _restCultureInfo: function () {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            format = ctr == "numeric" ? this.culture.numberFormat : this.culture.numberFormat[ctr];
            format.pattern[0] = this._oldNegativePattern;
            format.groupSizes[0] = this._oldGroupSize;
            format.pattern[1] = this._oldPositivePattern;
            if (ctr == "currency")
                format.symbol = this._oldcurrencySymbol;;
        },
        _toggleTextbox: function (toggle) {
            var proxy = this;
            proxy._hiddenInput.toggle(toggle);
            proxy.element.toggle(!toggle);
        },

        _paste: function (event) {
            var text;
            if (window.clipboardData && window.clipboardData.getData) { // IE
                text = window.clipboardData.getData('Text');
            }
            else if (event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData) { // other browsers
                text = event.originalEvent.clipboardData.getData('text/plain');
            }
            var data = ej.parseFloat(text, this.model.locale);
            if (isNaN(data) && text) this._cancelEvent(event)
        },
        _focusIn: function (event) {
            if (this.model.readOnly)
                return;
            this._focused = true;
            if(!ej.isNullOrUndefined(this.model.value)) this.element.val(this._removeSeparator(this.model.value));
            this._toggleTextbox(false);
            this._textBox = this.element[0];
            this.element[0].focus();
            this._preVal = this.model.value;
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this.wrapper.addClass("e-focus");
            this.wrapper.removeClass('e-error');
            if (!this._error) {
                if (this._textBox.value != "") {
                    var value = this._formatValue(this._textBox.value, "n", true);
                    if (this.model.decimalPlaces == -1) {
                        this._separateValue(this._textBox.value.toString(), true, true);
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            value = this._beforeDec + this._decimalSep + this._afterDec
                    }
                    this._textBox.value = value;
                    this._hiddenInput.val(value);
                }
                this._setSelectionRange(0, this._textBox.value.length);
            }
            this._trigger("focusIn", { value: this.model.value });
        },

        _separateValue: function (value, isDecimal, isgroupSep) {
            var index = (!isDecimal) ? value.lastIndexOf(".") : value.lastIndexOf(this._decimalSep);
            this._beforeDec = (index >= 0) ? value.substr(0, index) : value;
            if (!isDecimal && isgroupSep)
                this._afterDec = (index >= 0) ? value.substr(index + 1) : "";
        },

        _focusOut: function (event) {
            this._focused = false;
            this.wrapper.removeClass("e-focus");
            this._separateValue(this._textBox.value,false,true);
            if (!this._error) {
                if (this._textBox.value != "") {
                    var value = ej.parseFloat(this._textBox.value, this.model.locale);
                    if (value < this.model.minValue) {
                        if (!this.model.enableStrictMode)
                            this._textBox.value = this._formatValue(this.model.minValue, "n", false)
                        else
                            this.isValidState = false
                    }
                    else if (value > this.model.maxValue) {
                        if (!this.model.enableStrictMode)
                            this._textBox.value = this._formatValue(this.model.maxValue, "n", false);
                        else
                            this.isValidState = false;
                    }
                    this.model.value = (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this._afterDec) && (this._textBox.value.lastIndexOf(this._decimalSep) == -1) && (value.toString().indexOf('e') == -1)) ? ej.parseFloat(this._textBox.value + this._decimalSep + this._afterDec, this.model.locale) : ej.parseFloat(this._textBox.value, this.model.locale);
                    if (isNaN(this.model.value) && !this.model.value) {
                        this.model.value = null;
                        this.isValidState = false;
                    }
                    this._toggleTextbox(true);
                    this._textBox = this._hiddenInput[0];
                    this._localizedFormat();
                    this._checkErrorClass();
                }
                else {
                    var value = this._textBox.value == "" ? null : this._textBox.value;
                    this.model.value = value;
                    this._hiddenInput.val(value);
                    this._toggleTextbox(true);
                    this._textBox = this._hiddenInput[0];
                }
                if (this.model.value === null || this.model.value >= this.model.minValue && this.model.value <= this.model.maxValue) this.isValidState = true;
                else if (this.model.enableStrictMode) this.isValidState = false;
                this._raiseChangeEvent();
                this._setWaterMark();
                if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
                else value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                this.element.val(value);
                this._updateSeparator();
                this._trigger("focusOut", { value: this.model.value });
            }
            this._checkErrorClass();
            this._afterDec = "";
        },

        _cancelEvent: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            e.stopPropagation();
            e.preventDefault();
            return false;
        },

        _updateInputField: function (operation) {
            this.isValidState = true;
            if (!this._focused) $(this._hiddenInput[0]).focus();
            var step = this.model.incrementStep;
            var itemValue = this.model.value;
            if (this._textBox.value === "") {
                this._textBox.value = this._formatValue(this._startValue, "n", true);
                step = 0;
            }
            else if (this._textBox.value.indexOf(" ") >= 0)
                this._textBox.value = this._textBox.value.replace(" ", "");
            if (this.sfType === "ej.PercentageTextbox" || this.sfType === "ej.CurrencyTextbox") {
                var editorvalue = this._textBox.value, value = editorvalue;
                if (editorvalue.indexOf(ej.preferredCulture(this.model.locale).numberFormat.percent.symbol) > -1)
                    value = editorvalue.substring(0, editorvalue.length - 1);
                this.model.value = this._parseValue(value);
            }
            else if (this.sfType == "ej.NumericTextbox")
                this.model.value = ej.parseFloat(this._textBox.value, this.model.locale);

            if (isNaN(this.model.value) && !this.model.value)
                this.model.value = this._startValue;

            if (this.model.value >= this.model.minValue && this.model.value > this.model.maxValue) {
                this.model.value = this.model.maxValue;
                this._setValue(this.model.value);
            }
            else if (this.model.value < this.model.minValue && this.model.value <= this.model.maxValue) {
                this.model.value = this.model.minValue;
                this._setValue(this.model.value);
            }
            else if (this.model.value >= this.model.minValue && this.model.value <= this.model.maxValue) {
                value = operation == "increment" ? this.model.value + step : this.model.value - step;
                if(this.model.decimalPlaces == -1) {
					 if (this.value == undefined  ) {
                             this._setValue(this.model.value);
                         } 
                    value = (this.model.value.toString().indexOf('e') == -1) ? parseFloat(value.toFixed(this._afterDec.length)) : parseFloat(value);
                    };
                if (value >= this.model.minValue && value <= this.model.maxValue)
                    this._setValue(value);
            }
            this._checkErrorClass();
        },

        _validateDecimal: function (e) {
            var char = String.fromCharCode(e.keyCode);
            char = e.keyCode == 188 ? "," : (e.keyCode == 190) ? "." : (e.keyCode == 110) ? ej.preferredCulture(this.model.locale).numberFormat["."] : char;
            if (ej.preferredCulture(this.model.locale).numberFormat["."].charCodeAt(0) == char.charCodeAt(0))
                return true;
            return false;
        },

        _allowKeyCodes: function (e) {
            var keys = new Array(38, 40, 35, 36, 109, 189, 46, 8, 127, 37, 39, 190, 9, 13, 16, 17, 18, 20, 110, 173, 86, 88, 67);
            for (var i = 0; i < keys.length; i++) {
                if (e.keyCode == keys[i] || (this._validateDecimal(e) && this.model.decimalPlaces != 0))
                    return true;
            }
            return false;
        },

        _raiseChangeEvent: function (isCode) {
            var currVal = this.model.value, value;
            if ((this._checkNumValue(this._preVal) !== this._checkNumValue(currVal))) {
                this._preVal = currVal;
                this.model.value = (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this.model.value)) ? parseFloat(this.model.value) : this._checkNumValue(this._formatValue(this._preVal, "n", false));
                this._updateHiddenField();
                if (ej.isNullOrUndefined(this.model.value)) {
                    value = this.model.value;
                    this.wrapper.removeClass('e-valid');
                }
                else {
                    value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                    if (this.model.decimalPlaces == -1) {
                        this._separateValue(this.model.value.toString(), false,true);
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            value = this._beforeDec + this._decimalSep + this._afterDec;
                    }
                    this.wrapper.addClass('e-valid');
                }
                this.element.val(value);
			    this.wrapper.attr('aria-valuenow', value);
                this._updateSeparator();
                // Trigger the Jquery change event for the input element.
                this.element.trigger("change");
                this._trigger("_change", { value: this.model.value, isInteraction: !isCode });
                this._trigger("change", { value: this.model.value, isInteraction: !isCode });
            }
        },
        _updateHiddenField: function () {
            var prevActive = this._textBox;
            this._textBox = this._hiddenInput[0];
            this._localizedFormat();
            this._textBox = prevActive;
        },
        _removeSeparator: function (number) {
            if (ej.isNullOrUndefined(number)) return;
            var value, format, tag;
            if (this.model.decimalPlaces == -1) {
                this._separateValue(number.toString(), false,true);
            }
            if (number.toString().indexOf('e') == -1) {
                number = this._checkNumValue(this._formatValue(number, "n", false));
            }
            value = number.toString();
            format = ej.preferredCulture(this.model.locale).numberFormat;
            value = value.replace(".", format["."]);
            return value;
        },
        _updateSeparator: function () {
            if (this._changeSeparator && this.model.value) {
                var formatValue;
                    if (this.sfType === "ej.NumericTextbox")
                        formatValue = this._formatValue(this.model.value, "n", true);
                    else if (this.sfType === "ej.PercentageTextbox")
                        formatValue = this._formatValue((this.model.value) / 100, "p", true);
                    else if (this.sfType === "ej.CurrencyTextbox")
                        formatValue = this._formatValue(this.model.value, "c", true);
                    if (this.model.decimalPlaces == -1) {
                        var index = formatValue.lastIndexOf(this._decimalSep);
                        var val = formatValue.substr(index + 1);
                        this._separateValue(formatValue, true, false);
                        var symbolIndex = (this.sfType === "ej.CurrencyTextbox") ? formatValue.indexOf(this._currencySymbol) : (this.sfType === "ej.PercentageTextbox") ? this._textBox.value.indexOf(this._percentSymbol) : -1;
                        var symbolPos = this._afterDec;
                         if (symbolIndex > 1) {
                           if (this.sfType === "ej.CurrencyTextbox")
                                symbolPos = symbolPos + " " + this._currencySymbol;
                            if (this.sfType === "ej.PercentageTextbox")
                                symbolPos = symbolPos + " " + this._percentSymbol;
                         }
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            formatValue = this._beforeDec + this._decimalSep + symbolPos;
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec == "")
                            formatValue = this._beforeDec + this._decimalSep + val;
                    }
                
                this._hiddenInput.val(this._replaceSeparator(formatValue, ej.preferredCulture(this.model.locale).numberFormat[","], this.model.groupSeparator));
            }
        },

        _replaceSeparator: function (value, find, replaceWith) {
            this._decimalSep = ej.preferredCulture(this.model.locale).numberFormat['.'];
            var reg = find === "" ? new RegExp("\\s", "g") : new RegExp("\\" + find, "g");
            if (this.model.groupSeparator == ej.preferredCulture(this.model.locale).numberFormat['.']) {
                var decimalpoints = this.model.decimalPlaces;
                if (this.model.decimalPlaces == -1) {
                    var index = value.lastIndexOf(this._decimalSep);
                    decimalpoints = value.substr(index + 1).length;
                 }
                var valuelength = value.length - decimalpoints - 1;
                return value.substring(0, valuelength).replace(reg, replaceWith) + value.substring(valuelength, value.length);
            }
            return value.replace(reg, replaceWith);
        },

        _checkSeparator: function (value) {
            this.model.groupSeparator = value != null ? this._validateSeparator(value) : ej.preferredCulture(this.model.locale).numberFormat[','];
            this._changeSeparator = ej.preferredCulture(this.model.locale).numberFormat[","] != this.model.groupSeparator ? true : false;
            this._prevSeparator = this.model.groupSeparator;
        },
        _validateSeparator: function (value) {
            var separator = value.toString();
            var reg = new RegExp("[a-zA-Z0-9]");
            separator = (separator.length > 1) ? separator[0] : separator;
            separator = (!reg.test(separator)) ? separator : this._prevSeparator != null ? this._prevSeparator : ej.preferredCulture(this.model.locale).numberFormat[','];
            return separator;
        },
        _keyPress: function (e) {
            if (e.which === 0 || e.metaKey || e.ctrlKey || e.keyCode === 8 || e.keyCode === 13)
                return;
            var proxy = this, regExp = null, point = ".", cursor, beforeCursor, afterCursor, numberFormat, value;
            cursor = this._caretPosition();
            beforeCursor = this._textBox.value.toString().substring(0, cursor);
            afterCursor = this._textBox.value.toString().substring(cursor);
            numberFormat = ej.preferredCulture(this.model.locale).numberFormat;

            var character = String.fromCharCode(e.which);
            value = beforeCursor + character + afterCursor;
            var separator = numberFormat[point];
            separator = (separator === point) ? "\\" + separator : separator;
            regExp = proxy.model.decimalPlaces === 0 ? new RegExp("^((-)?(\\d*)(-)?)?$") : new RegExp("^(-)?(((\\d+(" + separator + "\\d*)?)|(" + separator + "\\d*)))?((-)?)$");
            // Validate the textbox value 
            if (!regExp.test(value))
                return false;
        },
        _validateDecimalOnType: function (e) {
            var cursor, cancelEvent, beforeCursor, afterCursor, sel, temp;
            cursor = this._caretPosition();
            beforeCursor = this._textBox.value.toString().substring(0, cursor);
            afterCursor = this._textBox.value.toString().substring(cursor);
            sel = this._getSelection(this._textBox.value);
            var decSep = ej.preferredCulture(this.model.locale).numberFormat["."];
            temp = (ej.isNullOrUndefined(this.model.value)) ? "" : this.model.value.toString();
            if (this.model.decimalPlaces != 0) {
                var afterdeci = (this._textBox.value).split(decSep)[1];
                if (temp.indexOf(decSep) > 0) {
                    if ((temp.substring(temp.indexOf(decSep) + 1, temp.length)).length > this.model.decimalPlaces)
                        cancelEvent = true;
                    else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                    else cancelEvent = false;
                }
                else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                else
                    cancelEvent = false;
            }
            else
                cancelEvent = false;
            if (cancelEvent) {
                this._keypressFlag = false;
                this._cancelEvent(e);
                return false;
            }
        },

        _keyDown: function (e) {
            if (this.model.readOnly) return;
            this._CurrentCultureInfo = JSON.parse(JSON.stringify(ej.preferredCulture()));
            var cursor, cancelEvent, beforeCursor, afterCursor, sel;
            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || this._allowKeyCodes(e)) {
                if (e.shiftKey && (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 127) || (e.ctrlKey && (e.keyCode == 86 || e.keyCode == 118 || e.keyCode == 67 || e.keyCode == 88)))
                    return true;
                if ((((e.ctrlKey == true) && (e.keyCode != 9 && e.keyCode != 17 && e.keyCode != 86 && e.keyCode != 67))) || (e.keyCode == 67 || e.keyCode == 86 || e.keyCode == 88)) {//Prevent Shift + Tab event
                    this._keypressFlag = false;
                    this._cancelEvent(e);
                    return false;
                }

                if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode == 110) {//Numbers from 0 to 9 in keyboard and numpad (110 for decimal)
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.toString().substring(0, cursor);
                    afterCursor = this._textBox.value.toString().substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                    // For Numpad issue
                    if (e.keyCode >= 96 && e.keyCode <= 105)
                        e.keyCode -= 48;
                    if (this.model.validateOnType && this.model.decimalPlaces != -1) this._validateDecimalOnType(e);
                    if (this._validateOnType) {
                        var decSep = ej.preferredCulture(this.model.locale).numberFormat["."];
                        var temp = this.model.value.toString();
                        var tempIndex = temp.indexOf(decSep);
                        var value = this.model.value;

                        var replaceminVal = (this.model.decimalPlaces == -1) ? this.model.minValue : this.model.minValue.toFixed(this.model.decimalPlaces);
                        var replacemaxVal = (this.model.decimalPlaces == -1) ? this.model.maxValue : this.model.maxValue.toFixed(this.model.decimalPlaces);
                        var exp = false;
                        if (replaceminVal.toString().indexOf("e") > 0 || replacemaxVal.toString().indexOf("e") > 0)
                            exp = true;
                        if (!exp) {
                            if (decSep != ".") {
                                temp = this._textBox.value.toString();
                                if (this.model.minValue.toString().match(new RegExp(".", "g")))
                                    replaceminVal = this.model.minValue.toString().replace(/["."]/g, decSep);
                                if (this.model.maxValue.toString().match(new RegExp(".", "g")))
                                    replacemaxVal = this.model.maxValue.toString().replace(/["."]/g, decSep);
                            }
                            if (replaceminVal.toString().indexOf(decSep) > 0)
                                minVal = Number(replaceminVal.toString().substring(0, replaceminVal.toString().indexOf(decSep)));
                            else
                                minVal = this.model.minValue;
                            if (replacemaxVal.toString().indexOf(decSep) > 0)
                                maxVal = Number(replacemaxVal.toString().toString().substring(0, replacemaxVal.toString().indexOf(decSep)));
                            else
                                maxVal = this.model.maxValue;
                            if (tempIndex > 0) {
                                value = Number(temp.substring(temp.indexOf(decSep) + 1, temp.toString().length));
                                if (replaceminVal.toString().indexOf(decSep) > 0)
                                    minVal = Number(replaceminVal.toString().substring(replaceminVal.toString().indexOf(decSep) + 1, replaceminVal.toString().length));
                                else
                                    minVal = 0;
                                if (replacemaxVal.toString().indexOf(decSep) > 0)
                                    maxVal = Number(replacemaxVal.toString().substring(replacemaxVal.toString().indexOf(decSep) + 1, replacemaxVal.toString().length));
                                else
                                    maxVal = 0;
                                var valb4Dec = Number(temp.substring(0, temp.indexOf(decSep)));
                                var minValb4Dec = Number(replaceminVal.toString().substring(0, replaceminVal.toString().indexOf(decSep)));
                                var maxValb4Dec = Number(replacemaxVal.toString().substring(0, replacemaxVal.toString().indexOf(decSep)));
                                if (!this._validateValue(value, minVal, maxVal, true, valb4Dec, minValb4Dec, maxValb4Dec))
                                    cancelEvent = true;
                                else
                                    cancelEvent = false;
                            }
                            else {
                                if (!this._validateValue(value, minVal, maxVal, false))
                                    cancelEvent = true;
                                else
                                    cancelEvent = false;
                            }
                        }
                        else if (this.model.decimalPlaces != 0) {
                            var afterdeci = (this._textBox.value).split(".")[1];
                            if (temp.indexOf(decSep) > 0 || (Number(temp) < Number(replaceminVal) || Number(temp) > Number(replacemaxVal))) {
                                if ((temp.substring(temp.indexOf(decSep) + 1, temp.length)).length > this.model.decimalPlaces)
                                    cancelEvent = true;
                                else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                                else cancelEvent = false;
                            }
                            else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                            else
                                cancelEvent = false;
                        }
                        else
                            cancelEvent = false;
                        if (cancelEvent) {
                            this._keypressFlag = false;
                            this._cancelEvent(e);
                            return false;
                        }
                    }

                }
                if (e.keyCode == 38 && this._allowkeyboard) {
                    this._updateInputField("increment");
                    this._cancelEvent(e);
                }

                if (e.keyCode == 40 && this._allowkeyboard) {
                    this._updateInputField("decrement");
                    this._cancelEvent(e);

                }
                if (e.keyCode == 8) {
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.substring(0, cursor);
                    afterCursor = this._textBox.value.substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                }

                if (e.keyCode == 46 || e.keyCode == 127) {
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.substring(0, cursor);
                    afterCursor = this._textBox.value.substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                }
                if (this._validateDecimal(e) && this.model.decimalPlaces != 0 && e.keyCode != 46) {
                    var decChar = ej.preferredCulture(this.model.locale).numberFormat["."];
                    var minVal, maxVal;
                    var dotSplit = this._textBox.value.split(decChar);
                    var curPosition = this._caretPosition();
                     if(this._textBox.selectionEnd - this._textBox.selectionStart == this._textBox.value.length){
                            this._textBox.value = decChar;
                            this._setSelectionRange(curPosition + 1, curPosition + 1);
                            this._keypressFlag = false;
                            this._cancelEvent(e);
                            return false;
                        }       
                    if (dotSplit[1] == undefined) {                        
                        var strBeforeCursor = dotSplit[0].substring(0, curPosition);
                        var strAfterCursor = dotSplit[0].substring(curPosition);
                        if (this.model.minValue.toString().indexOf("e") > 0 || this.model.maxValue.toString().indexOf("e") > 0)
                            exp = true;
                        if (this.model.decimalPlaces != -1 && strAfterCursor.length > this.model.decimalPlaces && this.model.validateOnType == true) {
                            this._keypressFlag = false;
                            this._cancelEvent(e);
                            return false;
                        }
                        if (this._validateOnType && !exp) {
                            if (this.model.minValue.toString().match(new RegExp(".", "g")))
                                minVal = this.model.minValue.toString().replace(/["."]/g, decChar);
                            if (this.model.maxValue.toString().match(new RegExp(".", "g")))
                                maxVal = this.model.maxValue.toString().replace(/["."]/g, decChar);
                            if (minVal.indexOf(decChar) > 0)
                                minVal = Number(minVal.substring(0, minVal.indexOf(decChar)));
                            else
                                minVal = Number(minVal);
                            if (maxVal.indexOf(decChar) > 0)
                                maxVal = Number(maxVal.substring(0, maxVal.indexOf(decChar)));
                            else
                                maxVal = Number(maxVal);
                            if (this._validateValue(this.model.value, minVal, maxVal, "DecimalKeyPressed"))
                                this._textBox.value = strBeforeCursor + decChar + strAfterCursor;
                            else {
                                this._keypressFlag = false;
                                this._cancelEvent(e);
                                return false;
                            }
                        }
                        else
                            this._textBox.value = strBeforeCursor + decChar + strAfterCursor;
                        this._setSelectionRange(curPosition + 1, curPosition + 1);
                    }
                    this._cancelEvent(e);
                } else if (e.keyCode == 190 || e.keyCode == 110) {
                    this._cancelEvent(e);
                }
                if (e.keyCode == 109 || e.keyCode == 189 || e.keyCode == 173) { //'-' char key press.
                    if (this.model.value === this._preVal || this.model.value === null) this.model.value = this._textBox.value;
                    if ((this._caretPosition() != 0 && this._getSelection(this._removeFormats(this._textBox.value)) != this.model.value) || (this.model.minValue >= 0 && !this.model.enableStrictMode) || (this._textBox.value.toString().match(new RegExp("-", "g")) && this._getSelection(this._textBox.value) === "")){
                         this._preVal = this.model.value;
                         this.model.value = this._textBox.value;
                         this._cancelEvent(e);
                    }
                    else if (this._getSelection() == this.model.value){
                        this._preVal = this.model.value;
                        this.model.value = null;
                    }
                }

                if (e.keyCode == 13)
                    if ((this._checkNumValue(this._preVal) !== this._checkNumValue(this._textBox.value)))
                        this._setValue(this._textBox.value);
            }

            else if (e.keyCode != 27 && !e.ctrlKey || (e.ctrlKey && e.keyCode == 90 && $.trim(this._textBox.value) === "")) {
                this._keypressFlag = false;
                this._cancelEvent(e);
            }
        },
		_getLocalizedLabels: function(){
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
		
    });
	
    ej.NumericTextbox.Locale = ej.NumericTextbox.Locale || {} ;
    
    ej.NumericTextbox.Locale['default'] = ej.NumericTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	ej.PercentageTextbox.Locale = ej.PercentageTextbox.Locale || {} ;
    
    ej.PercentageTextbox.Locale['default'] = ej.PercentageTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	ej.CurrencyTextbox.Locale = ej.CurrencyTextbox.Locale || {} ;
    
    ej.CurrencyTextbox.Locale['default'] = ej.CurrencyTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	
		
})(jQuery, Syncfusion);