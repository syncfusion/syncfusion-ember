/**
* @fileOverview Plugin to craete a Timepicker with the Html input element
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejTimePicker", "ej.TimePicker", {

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _rootCSS: "e-timepicker",
        _setFirst: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },
        _requiresID: true,

        defaults: {

            cssClass: "",

            timeFormat: "",

            value: null,

            enableAnimation: true,

            locale: "en-US",

            htmlAttributes: {},

            readOnly: false,

            showPopupButton: true,

            enableStrictMode: false,

            interval: 30,

            hourInterval: 1,

            minutesInterval: 1,

            secondsInterval: 1,

            height: "",

            width: "",

            minTime: "12:00 AM",

            maxTime: "11:59 PM",

            showRoundedCorner: false,

            enableRTL: false,

            popupHeight: "191px",

            popupWidth: "auto",

            enabled: true,

            enablePersistence: false,

            disableTimeRanges: null,

            validationRules: null,

            validationMessages: null,

            focusIn: null,

            focusOut: null,

            beforeChange: null,

            change: null,

            select: null,

            create: null,

            destroy: null,

            beforeOpen: null,

            open: null,

            close: null,

            watermarkText:"select a time"
        },


        dataTypes: {
            timeFormat: "string",
            minTime: "string",
            maxTime: "string",
            readOnly: "boolean",
            interval: "number",
            showPopupButton: "boolean",
            locale: "string",
            hourInterval: "number",
            minutesInterval: "number",
            secondsInterval: "number",
            enabled: "boolean",
            enablePersistence: "boolean",
            enableAnimation: "boolean",
            enableStrictMode: "boolean",
            disableTimeRanges: "data",
            htmlAttributes: "data",
            validationRules: "data",
            validationMessages: "data",
            watermarkText:"string"
        },

        observables: ["value"],

        enable: function () {
            if (!this.model.enabled) {
                this.element[0].disabled = false;
                this.element.prop("disabled", false);
                this.model.enabled = true;
                this.wrapper.removeClass('e-disable');
                this.element.removeClass("e-disable").attr("aria-disabled", false);
                if (this.model.showPopupButton) {
                    this.timeIcon.removeClass("e-disable").attr("aria-disabled", false);
                    if (this.popupList) this.popupList.removeClass("e-disable").attr("aria-disabled", false);
                }
                if (this._isIE8) this.timeIcon.children().removeClass("e-disable");
            }
        },


        disable: function () {
            if (this.model.enabled) {
                this.element[0].disabled = true;
                this.model.enabled = false;
                this.element.attr("disabled", "disabled");
                this.wrapper.addClass('e-disable');
                this.element.addClass("e-disable").attr("aria-disabled", true);
                if (this.model.showPopupButton) {
                    this.timeIcon.addClass("e-disable").attr("aria-disabled", true);
                    if (this.popupList) this.popupList.addClass("e-disable").attr("aria-disabled", true);
                }
                if (this._isIE8) this.timeIcon.children().addClass("e-disable");
                this._hideResult();
            }
        },


        getValue: function () {
            return this.element.val();
        },


        setCurrentTime: function () {
            if (!this.model.readOnly) this._setMask();
        },

        show: function () {
            (!this.showDropdown && !this._getInternalEvents) && this._showResult();
        },

        hide: function () {
            (this.showDropdown) && this._hideResult();
        },


        _ISORegex: function () {
            this._tokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            // complex case for iso 8601 regex only
            this._extISORegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
            this._basicISORegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
            this._numberRegex = {
                2: /\d\d?/,
                4: /^\d{4}/,
                "z": /Z|[+-]\d\d(?::?\d\d)?/gi,
                "t": /T/,
                "-": /\-/,
                ":": /:/
            };
            this._zeroRegex = /Z|[+-]\d\d(?::?\d\d)?/;
            this._dates = [
                ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
                ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
                ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
                ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
                ['YYYY-DDD', /\d{4}-\d{3}/],
                ['YYYY-MM', /\d{4}-\d\d/, false],
                ['YYYYYYMMDD', /[+-]\d{10}/],
                ['YYYYMMDD', /\d{8}/],
                // YYYYMM is NOT allowed by the standard
                ['GGGG[W]WWE', /\d{4}W\d{3}/],
                ['GGGG[W]WW', /\d{4}W\d{2}/, false],
                ['YYYYDDD', /\d{7}/]
            ];

            // iso time formats and regexes
            this._times = [
                ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
                ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
                ['HH:mm:ss', /\d\d:\d\d:\d\d/],
                ['HH:mm', /\d\d:\d\d/],
                ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
                ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
                ['HHmmss', /\d\d\d\d\d\d/],
                ['HHmm', /\d\d\d\d/],
                ['HH', /\d\d/]
            ];
        },

        _timeFormat: function (format) {
            if (!format)
                format = ej.preferredCulture(this.model.locale).calendars.standard.patterns.t;
            var validatedformat = this._validateTimeFormat(format);
            if (validatedformat) {
                this.model.timeFormat = validatedformat;
                // Only change the format when model is not null.   
                this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
                this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);

                if (this.model.value) {
                    this._setModelOption = true;
                    this.model.value = this._localizeTime(this.model.value);
                    this.element.val(this.model.value);
                }
                else {
                    this._setModelOption = false;
                    var timeValue = this._localizeTime(this.element.val());
                    if (timeValue && this._checkMinMax(timeValue)) {
                        this.model.value = timeValue;
                        this.element.val(timeValue);
                    }
                }
            }
            return validatedformat;
        },

        _getTimeFormat: function () {
            if (this._prevTimeFormat)
                this.model.timeFormat = ej.preferredCulture(this.model.locale).calendar.patterns.t || "h:mm tt";
            this.seperator = this._getSeperator();
        },

        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            if (this.popupList) this.popupList.removeClass(this.model.cssClass).addClass(skin);
        },

        _localize: function (culture) {
            var currentTime = this._createObject(this.model.value, true);
            this.model.locale = culture;
            this._getTimeFormat();

            this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
            this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            if (currentTime) {
                this.model.value = this._localizeTime(currentTime);
                this.element.val(this.model.value);
            }
            else {
                currentTime = this._localizeTime(this.element.val());
                if (currentTime && this._checkMinMax(currentTime)) {
                    this.model.value = currentTime;
                    this.element.val(currentTime);
                }
            }
            this._getAmPm();
        },
        _setWaterMark: function () {
            if (this.element != null && this.element.hasClass("e-input")) {
                if (this._localizedLabels.watermarkText && this.element.val() == "") {
                    this.isValidState = true;
                    this._checkErrorClass();
                }
                if ((!this._isSupport) && this.element.val() == "") {
                    this._hiddenInput.css("display", "block").val(this._localizedLabels.watermarkText);
                }
                else {
                    $(this.element).attr("placeholder", this._localizedLabels.watermarkText);
                }
                return true;
            }
        },
        _localizedLabelToModel: function () {
            this.model.watermarkText = this._localizedLabels.watermarkText;
            this.model.buttonText = this._localizedLabels.buttonText;
        },
        _setLocalize: function (culture) {
            var culture = ej.preferredCulture(culture);
            if (culture) {
                this.model.locale = culture.name == "en" ? "en-US" : culture.name;
                if (!ej.isNullOrUndefined(this._options) && (ej.isNullOrUndefined(this._options.timeFormat) || (!this._options.timeFormat)))
                    this.model.timeFormat = ej.preferredCulture(this.model.locale).calendars.standard.patterns.t;
                    this._prevTimeFormat = (ej.isNullOrUndefined(this._options.timeFormat)||this._options.timeFormat=="") ? true : false;
            }
        },
        _updateInput: function () {
            if (ej.isNullOrUndefined(this._options)) return;
            var value = this._localizeTime(this._options.value);
            if (!ej.isNullOrUndefined(value))
                if (typeof value === "string" && this.model.enableStrictMode && !this.model.value) {
                    this.element.val(this._options.value);
                    this.isValidState = (this.element.val() == "") ? true : false;
                    this._checkErrorClass();
                }
        },
        _createMinMaxObj: function () {
            // create minTime object
            this._minTimeObj = this._createObject(this.model.minTime);
            if (!this._minTimeObj)
                this.model.minTime = ej.format(this._createObject(new Date().setHours(0, 0, 0, 0)), this.model.timeFormat, this.model.locale);

            // create maxTime object
            this._maxTimeObj = this._createObject(this.model.maxTime);
            if (!this._maxTimeObj)
                this.model.maxTime = ej.format(this._createObject(new Date().setHours(23, 59, 59, 59)), this.model.timeFormat, this.model.locale);
        },
        _setMinMax: function () {
            var minVal = new Date().setHours(0, 0, 0, 0);
            var maxval = new Date().setHours(23, 59, 59, 59);
            if (!ej.isNullOrUndefined(this._options) && ej.isNullOrUndefined(this._options.minTime))
                this.model.minTime = ej.format(this._createObject(minVal), this.model.timeFormat, this.model.locale);
            if (!ej.isNullOrUndefined(this._options) && ej.isNullOrUndefined(this._options.maxTime))
                this.model.maxTime = ej.format(this._createObject(maxval), this.model.timeFormat, this.model.locale);
            this._createMinMaxObj();
        },
        _init: function (options) {
            this._options = options;
            this._cloneElement = this.element.clone();
            this._ISORegex();
            this._isSupport = document.createElement("input").placeholder == undefined ? false : true;
            if (!this.element.is("input") || (this.element.attr('type') && this.element.attr('type') != "text")) return false;
            this._initialize();
            this._render();
            this._wireEvents();
            if (options && options.value != undefined && options.value != this.element.val()) {
                this._trigger("_change", { value: this.element.val() });
            }
            this._updateInput();
            this._updateTextbox();
            if (this.model.validationRules != null) {
                this._initTimeValidator();
                this._setTimeValidation();
            }

        },
        _updateTextbox: function () {
            if (this._options.disableTimeRanges) {
                var isValid = true;
                for (var i = 0; i < this._options.disableTimeRanges.length; i++) {
                    if (this.model.minTime >= this._options.disableTimeRanges[i].startTime || this.model.minTime <= this._options.disableTimeRanges[i].endTime) {
                        if ((this._options.disableTimeRanges[i].startTime == this.model.minTime)) {
                            isValid = false;
                            break;
                        }
                    }
                }

                if (this._options === undefined || (this._options.value === undefined && !this.model.value && isValid))
                    this._setTime(this._localizeTime(this.model.minTime));
            }

            else if (this._options === undefined || (this._options.value === undefined && !this.model.value))
                this._setTime(this._localizeTime(this.model.minTime));
        },

        _setMinMaxTime: function (prev, options) {
            if (!ej.isNullOrUndefined(options["minTime"]) && $.trim(options["minTime"]) && this._isValid(options["minTime"])) {
                this.model.minTime = options["minTime"];
                this._minTimeObj = this._createObject(this.model.minTime);
                this._validateTimes();
            }
            if (!ej.isNullOrUndefined(options["maxTime"]) && $.trim(options["maxTime"]) && this._isValid(options["maxTime"])) {
                this.model.maxTime = options["maxTime"];
                this._maxTimeObj = this._createObject(this.model.maxTime);
                this._validateTimes();
            }

            this._validateMinMax();
            this._createMinMaxObj();
            if (!ej.isNullOrUndefined(options["minTime"])) options["minTime"] = this.model.minTime;
            if (!ej.isNullOrUndefined(options["maxTime"])) options["maxTime"] = this.model.maxTime;
            if (!this._checkMinMax(this.model.value)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                        this.model.value = this.model.minTime;
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                        this.model.value = this.model.maxTime;
                }
                else {
                    this.isValidState = false;
                    this.model.value = null;
                }
            }
            if (prev !== this.model.value && this._isValid(this.model.value, true))
                this.element.val(this.model.value);
        },
        _setModel: function (options) {
            var change = false, prev = this.model.value;
			
            for (var option in options) {
			if(option != "timeFormat" && option != "height" && option != "width" && option != "htmlAttributes" && option != "watermarkText" && option != "enabled" && option != "validationRules" && option != "validationMessages"){
				if (ej.isNullOrUndefined(this.popupList)) this._renderDropdown();
			}
                switch (option) {
                    case "timeFormat":
                        var prevTime = this._createObject(this.model.value);
                        this._preTimeformat = this.model.timeFormat;
                        var newFormat = this._timeFormat(options[option]);
                        options[option] = this.model.timeFormat;
                        if (newFormat)
                            this.seperator = this._getSeperator();
                        var currentTime = this._createObject(this.model.value);
                        change = (+prevTime === +currentTime) ? false : true;
                        break;
                    case "locale":
                        var prevTime = this._createObject(this.model.value);
                        this._localize(options[option]);
                        this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
                        this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);
                        var currentTime = this._createObject(this.model.value);
                        change = (+prevTime === +currentTime) ? false : true;
                        break;
                    case "interval":
                        this.model.interval = options[option];
                        break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[option]); break;
                    case "enableRTL": this._setRtl(options[option]); break;
                    case "height":
                        this._setHeight(options[option]); break;
                    case "width":
                        this.wrapper.width(options[option]);
                        this._setListWidth();
                        break;
                    case "value":
                        if (ej.isPlainObject(options[option])) options[option] = null;
                        this.model.value = ej.format(this._createObject(options[option], true), this.model.timeFormat, this.model.locale);
                        this._ensureValue();
                        this._enableMask();
                        if (this.model.enableStrictMode && !this._isValid(options[option], true)) {
                            var tval = this._isValid(options[option]) ? this._localizeTime(options[option]) : options[option];
                            this.element.val(tval);
                        }
                        options[option] = this.model.value;
                        change = true;
                        break;
                    case "enableStrictMode":
                        this.model.enableStrictMode = options[option];
                        break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = options[option];
                        if (this.model.validationRules != null) {
                            this._initTimeValidator();
                            this._setTimeValidation();
                        }
                        break;
                    case "validationMessages":
                        this.model.validationMessages = options[option];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initTimeValidator();
                            this._setTimeValidation();
                        }
                        break;
                    case "popupHeight": this.model.popupHeight = options[option]; this._setListHeight(); break;
                    case "popupWidth": this.model.popupWidth = options[option]; this._setListWidth(); break;
                    case "enabled": if (options[option]) this.enable(); else this.disable(); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "disableTimeRanges":
                        this.model.disableTimeRanges = options[option];
                        this._initStartEnd();
                        this.model.value = ej.format(this._createObject(this.element.val(), true), this.model.timeFormat, this.model.locale);
                        this._ensureValue();
                        this._enableMask();
                        if (this.model.enableStrictMode && !this._isValid(this.element.val(), true))
                            this.element.val(this.element.val());
                        change = true;
                        break;
                    case "watermarkText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options[option] = this.model.watermarkText = options[option];
                        this._localizedLabels.watermarkText = this.model.watermarkText;
                        this._setWaterMark();
                        break;
                }
            }
            if (!ej.isNullOrUndefined(options["minTime"]) || !ej.isNullOrUndefined(options["maxTime"])) {
                this._setMinMaxTime(prev, options);
                change = true;
            }
            if (!ej.isNullOrUndefined(options["showPopupButton"]))
                this._showButton(options[option]);
            else if (this.model.showPopupButton && (newFormat || !ej.isNullOrUndefined(options["minTime"]) || !ej.isNullOrUndefined(options["maxTime"]) ||
                   !ej.isNullOrUndefined(options["locale"]) || !ej.isNullOrUndefined(options["interval"]) || !ej.isNullOrUndefined(options["disableTimeRanges"]))) {
                this._reRenderDropdown();
            }
            if (change) {
                this._raiseChangeEvent(prev, true);
                options["value"] = this.model.value;
            }
            this._checkErrorClass();
        },


        _destroy: function () {
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
            this.element.removeClass("e-input").removeAttr("ondragstart draggable aria-atomic aria-live aria-readonly").val(this.element.attr("value"));
            if (!this._cloneElement.attr('name')) this.element.removeAttr('name');
            if (this.popupList) this.popupList.remove();
        },

        _initialize: function () {
            this.target = this.element[0];
            this.timeIcon = null;
            this._disabledItems = [];
            this.popupList = null;
            this.focused = false;
            this.start = 0;
            this.end = 0;
            this.min = null;
            this.max = null;
            this.incomplete = false;
            this.downPosition = 0;
            this._setLocalize(this.model.locale);
            this._setMinMax();
            this._getAmPm();
            this.showDropdown = false;
            this._activeItem = 0;
            this.isValidState = true;
            this._manualFocus = false;
            this._isIE7 = this._checkIE7();
            this._initStartEnd();
            this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "")
                this.model.value = this.element[0].value;
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            // _getInternalEvents is used when TimePicker used as a subcontrol of DateTimePicker 
            this._getInternalEvents = false;
            this._dateTimeInternal = false;
            if (!this.model.timeFormat) this._getTimeFormat();
            else this.seperator = this._getSeperator();
        },

        _render: function () {
            this._renderWrapper();
            this._setDimentions();
            this._renderTimeIcon();
            this._validateTimes();
            this._createMinMaxObj();
            this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
            this._enableMask();
            this._checkErrorClass();
            this.element.attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', "aria-readonly": this.model.readOnly, "value": this.model.value });
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.addClass('e-valid') : this.wrapper.removeClass('e-valid');
        },

        _renderWrapper: function () {
            this.element.addClass("e-input").attr({'tabindex':'0','role':'combobox','aria-expanded':'false'});
            this.wrapper = ej.buildTag("span.e-timewidget e-widget " + this.model.cssClass + "#" + this.target.id + "_timewidget").insertAfter(this.element);
            this.wrapper.attr("style", this.element.attr("style"));
            this.element.removeAttr('style');
            if (!ej.isTouchDevice()) this.wrapper.addClass('e-ntouch');
            this.container = ej.buildTag("span.e-in-wrap e-box").append(this.element);
            this.wrapper.append(this.container);
            if (!this._isSupport) {
                this._hiddenInput = ej.buildTag("input.e-input e-placeholder ", "", {}, { type: "text" }).insertAfter(this.element);
                this._hiddenInput.val(this._localizedLabels.watermarkText);
                this._hiddenInput.css("display", "block");
                var proxy = this;
                $(this._hiddenInput).focus(function () {
                    proxy.element.focus();
                });
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readOnly" && value == "readOnly") proxy.model.readOnly = true;
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);

            });
        },
        _initTimeValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setTimeValidation: function () {
            this.element.rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this.element.attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in this.model.validationRules) {
                var message = null;
                if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                    if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                        message = this.model.validationRules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessages)
                            ruleName == msgName ? (message = this.model.validationMessages[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },
        _renderTimeIcon: function () {
            if (this.model.showPopupButton) {
                this.timeIcon = ej.buildTag("span.e-select").attr({ 'role': 'button', 'aria-label': 'select' });
                var icon = ej.buildTag("span.e-icon e-clock").attr('role', 'presentation');
                if (this._isIE8) {
                    this.timeIcon.attr("unselectable", "on");
                    icon.attr("unselectable", "on");
                }
                this.timeIcon.append(icon);
                this.container.append(this.timeIcon).addClass("e-padding");
                this._on(this.timeIcon, "mousedown", this._timeIconClick);
            }

        },
        _elementClick: function (e) {
            if (!this.showDropdown) this._showResult();
        },
        _renderDropdown: function () {
            var oldWrapper = $("#" + this.element[0].id + "_popup").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            if (!this.model.showPopupButton || this.popupList) return false;
            this.popupList = ej.buildTag("div.e-time-popup e-popup e-widget e-box " + this.model.cssClass + "#" + this.target.id + "_popup", "", {}, { 'tabindex': 0, 'role':'listbox'});
            if (!ej.isTouchDevice()) this.popupList.addClass('e-ntouch');
            this.popup = this.popupList;
            this.ul = ej.buildTag("ul.e-ul");
            if (this._isIE8)
                this.ul.attr("unselectable", "on");
            var scrollDiv = ej.buildTag("div").append(this.ul);
            $('body').append(this.popupList.append(scrollDiv));
            this._renderLiTags();
            this._setListHeight();
            this._setListWidth();
            this.popupList.ejScroller({ height: this.popupList.height(), width: 0, scrollerSize: 20 });
            this.scrollerObj = this.popupList.ejScroller("instance");
            this.popupList.css("display", "none");
            this._listSize = this.ul.find("li").length;
        },
        _renderLiTags: function () {
            this._disabledItems = [];
            var start, end, timeVal, interval = this.model.interval * 60000;
            // Maintain the min and max time as object;
            var disableTime = (!ej.isNullOrUndefined(this.model.disableTimeRanges) && this.model.disableTimeRanges.length > 0) ? true : false;
            start = this._minTimeObj;
            end = this._maxTimeObj;
            var i = 0;
            while (this._compareTime(end, start, true)) {
                timeVal = this._localizeTime(start);
                var litag = $(document.createElement('li'));
                litag[0].appendChild(document.createTextNode(timeVal));
                if (this._isIE8) litag.attr("unselectable", "on");
                if (disableTime) {
                    if (this._ensureTimeRange(timeVal)) {
                        litag.addClass('e-disable');
                        this._disabledItems.push(i);
                    }
                    else {
                        litag.removeClass('e-disable');
                    }
                }
                this.ul[0].appendChild(litag[0]);
                start = new Date(start).getTime() + interval;
                i++;
            }

            var liTags = this.ul.find("li");
            if (!ej.isTouchDevice()) {
                this._on(liTags, "mouseenter", $.proxy(this._OnMouseEnter, this));
                this._on(liTags, "mouseleave", $.proxy(this._OnMouseLeave, this));
            }
            this._on(liTags, "click", $.proxy(this._OnMouseClick, this));
            if (this.model.showPopupButton || !ej.isNullOrUndefined(this.popupList))
                this.ul.find("li").attr({ 'tabindex': -1, 'aria-selected': false,'role':'option' });
        },
        _ensureTimeRange: function (value) {
            if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                var timeVal = this._makeDateTimeObj(value);
                for (var i = 0; i < this.model.disableTimeRanges.length; i++) {
                    if (+timeVal >= +this._makeDateTimeObj(this.model.disableTimeRanges[i].startTime) && +timeVal <= +this._makeDateTimeObj(this.model.disableTimeRanges[i].endTime))
                        return true;
                }
            }
            return false;
        },
        _initStartEnd: function () {
            this._startTime = [];
            this._endTime = [];
            if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                for (var i = 0; i < this.model.disableTimeRanges.length; i++) {
                    this._startTime[i] = this._makeDateTimeObj(this.model.disableTimeRanges[i].startTime);
                    this._endTime[i] = this._makeDateTimeObj(this.model.disableTimeRanges[i].endTime);
                }
            }
        },
        _makeDateTimeObj: function (value) {
            if (typeof value === "string") {
                var dateFormat = ej.preferredCulture(this.model.locale).calendar.patterns.d;
                var dateValue = ej.format(new Date("1/1/2000"), dateFormat, this.model.locale);
                var obj = ej.parseDate(dateValue + " " + value, dateFormat + " " + this.model.timeFormat, this.model.locale);
                if (!obj) {
                    var isJSONString = new Date(value);
                    if (!isNaN(Date.parse(isJSONString)) && !ej.isNullOrUndefined(value))
                        return this._setEmptyDate(value);
                    else
                        obj = new Date("1/1/2000 " + value);
                }
                return obj;
            }
            else if (value instanceof Date)
                return this._setEmptyDate(value);
            else return null;
        },
        _reRenderDropdown: function () {
            this.ul.empty();
            this._renderLiTags();
            this._refreshScroller();
            this._changeActiveEle();
        },
        _refreshScroller: function () {
            var flag = this.popupList.css("display") == "none" ? true : false;
            this.popupList.css("height", "auto");
            this.popupList.find(".e-content, .e-vscroll").removeAttr("style");
            this.popupList.find(".e-vscroll div").removeAttr("style");

            if (flag) this.popupList.css("display", "block");
            this.scrollerObj.model.height = this.popupList.height();
            this.scrollerObj.model.scrollTop = 0;
            this.scrollerObj.refresh();
            if (this._isIE8) {
                $("#" + this.scrollerObj._id).children('.e-vscroll').children().attr("unselectable", "on");
                $("#" + this.scrollerObj._id).find('.e-vhandle').attr("unselectable", "on");
            }
            if (flag) this.popupList.css("display", "none");
        },

        _removeWatermark: function () {
            if (this.element.val() != "" && !this._isSupport)
                this._hiddenInput.css("display", "none");
        },

        _setListWidth: function () {
            if (this.popupList) {
                var timePopupWidth = this.model.popupWidth,width;
                if ((typeof (timePopupWidth) == "string" && timePopupWidth.indexOf("%") != -1) || typeof (timePopupWidth) == "string") width = parseInt(timePopupWidth) > 0 ? timePopupWidth : "auto" && (this.model.popupWidth = "auto");
                else {
                    width = timePopupWidth > 0 ? timePopupWidth : "auto" && (this.model.popupWidth = "auto");
                }
                if (width && width != "auto") this.popupList.css({ "width": width });
                else this.popupList.css({ "width": this.wrapper.width() });
            }
            if (this.scrollerObj) {
                this._refreshScroller();
                this._updateScrollTop();
            }
        },
        _setListHeight: function () {
            if (this.popupList) this.popupList.css({ "max-height": this.model.popupHeight || "191px" });
            if (this.scrollerObj) {
                this._refreshScroller();
                this._updateScrollTop();
            }
        },
        _updateScrollTop: function () {
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
        },
        _refreshPopup: function () {
            if (this.model.popupWidth == "auto") this.popupList.css({ "width": this.wrapper.width() });
            this._setListPosition();
            this._refreshScroller();
        },

        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popupList.outerHeight(),
            popupWidth = this.popupList.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popupList.outerWidth() - elementObj.outerWidth();
            this.popupList.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popupList);
        },

        _enableMask: function () {
            var flag = false;
            if ((this.model.minTime && this._compareTime(this.model.minTime, this.model.value)) ||
                this.model.maxTime && this._compareTime(this.model.value, this.model.maxTime))
                this.isValidState = false;
            else this.isValidState = true;
            this._setTime(this.model.value);
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
            if (this._getInternalEvents && !this.isValidState) this._trigger("outOfRange");
            this._changeActiveEle();
            this._preVal = this.element.val();
        },
        _setTime: function (time) {
            var modifiedTime = this._localizeTime(time);
            this.element.val(modifiedTime);
            if (this.model.enableStrictMode) {
                this.model.value = (this._compareTime(this.model.value, this.model.minTime) && this._compareTime(this.model.maxTime, this.model.value)) ? modifiedTime : null;
            } else {
                this.model.value = modifiedTime;
            }
            this._setWaterMark();
        },
        _timeFromISO: function (date) {
            var result = this._extISORegex.exec(date) || this._basicISORegex.exec(date), dateFormat = '', timeFormat = '', zeroFormat = '', format;
            if (result) {
                for (var i = 0; i < this._dates.length; i++) {
                    if (this._dates[i][1].exec(result[1])) {
                        dateFormat = this._dates[i][0];
                        break;
                    }
                }
                if (result[3]) {
                    for (var k = 0; k < this._times.length; k++) {
                        if (this._times[k][1].exec(result[3])) {
                            // result[2] should be 'T' (time) or space
                            timeFormat = (result[2] || ' ') + this._times[k][0];
                            break;
                        }
                    }
                }
                if (result[4]) if (this._zeroRegex.exec(result[4])) zeroFormat = 'Z';
                format = dateFormat + timeFormat + zeroFormat;
                var token = format.match(this._tokens), input, val = [], literal, char;
                for (var j = 0; j < token.length; j++) {
                    var str = token[j];
                    literal = this._checkLiteral(token[j]);
                    var rg = this._numberRegex[literal ? token[j].toLowerCase() : str.length] || new RegExp('^\\d{1,' + str.length + '}');
                    input = date.match(rg);
                    if (input) {
                        if (date.substr(0, date.indexOf(input)) >= 0 && !literal) token[j].indexOf('M') >= 0 ? val.push(parseInt(input[0]) - 1) : val.push(parseInt(input[0]));
                        date = date.slice(date.indexOf(input[0]) + input[0].length);
                    }
                }
                //if you want to get the value in UTC format use the "new Date(Date.UTC.apply(null, val)"
                //return the date object value as exact as given input value
                //new Date(year, month, day, hour, minute, seconds);
                return result[4] == "Z" ? new Date(Date.UTC.apply(null, val)) : new Date(val[0], val[1], val[2], val[3], val[4], val[5]);
            }
            else {
                return new Date(date + "");
            }
        },
        _checkLiteral: function (str) {
            char = str.toLowerCase();
            return (char == 't' || char == 'z' || char == ':' || char == '-') ? true : false;
        },
        _setMask: function () {
            this.model.value = new Date();
            this._enableMask();
        },

        _validateTimes: function () {
            var validatedformat = this._validateTimeFormat(this.model.timeFormat);
            if (validatedformat) this.model.timeFormat = validatedformat;
            else this.model.timeFormat = "h:mm tt";
            if (!this._isValid(this.model.minTime)) this.model.minTime = "12:00 AM";
            if (!this._isValid(this.model.maxTime)) this.model.maxTime = "11:59 PM";
            if (!this._isValid(this.model.value, true)) this.model.value = null;
            if (!this._checkMinMax(this.model.value) && !this.model.enableStrictMode) {
                if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                    this.model.value = this.model.minTime;
                if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                    this.model.value = this.model.maxTime;
            }
            this._validateMinMax();
        },
        _ensureValue: function () {
            if (!this._checkMinMax(this.model.value) && this._isValid(this.model.value, true)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                        this.model.value = this.model.minTime;
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                        this.model.value = this.model.maxTime;
                }
                else
                    this.isValidState = false;
            }
        },
        _validateMinMax: function () {
            if (this.model.minTime && this.model.maxTime && this._compareTime(this.model.minTime, this.model.maxTime)) {
                this.model.minTime = this.model.maxTime;
            }
        },
        _checkProperties: function () {
            if (!this.model.enabled) {
                this.model.enabled = true;
                this.disable();
            }
            else if (this.model.enabled && this.element.hasClass("e-disable")) {
                this.model.enabled = false;
                this.enable();
            }
            this._addProperty();
            this._checkAttributes();
        },
        _addProperty: function () {
            this._setRtl(this.model.enableRTL);
            this._setRoundedCorner(this.model.showRoundedCorner);
        },
        _setRtl: function (boolean) {
            if (boolean) {
                this.wrapper.addClass("e-rtl");
                if (this.popupList) this.popupList.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
                if (this.popupList) this.popupList.removeClass("e-rtl");
            }
        },
        _setRoundedCorner: function (boolean) {
            if (boolean) {
                this.container.addClass("e-corner");
                if (this.popupList) this.popupList.addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                if (this.popupList) this.popupList.removeClass("e-corner");
            }
        },
        _showButton: function (show) {
            this.model.showPopupButton = show;
            if (show) {
                this.container.addClass("e-padding");
                this._renderTimeIcon();
                this._renderDropdown();
                this._addProperty();
            }
            else {
                this.container.removeClass("e-padding");
                this.timeIcon.remove();
                this.popupList.remove();
                this.timeIcon = this.popupList = null;
                $(document).off("mousedown", $.proxy(this._OnDocumentClick, this));
            }
        },
        _checkAttributes: function () {
            if (!this.element.attr("name"))
                this.element.attr({ "name": this.element[0].id });
            if ('ondragstart' in document.createElement('input'))
                this.element.attr({ "ondragstart": "return false" });
            if ('draggable' in document.createElement('input'))
                this.element.attr({ "draggable": "false" });
        },

        _getAmPm: function () {
            var dateObj = new Date();
            dateObj.setHours(0);
            this.ttAM = $.trim(this._localizeMeridian(dateObj));
            dateObj.setHours(23);
            this.ttPM = $.trim(this._localizeMeridian(dateObj));
        },

        _setDimentions: function () {
            if (!this.model.height) this.model.height = this.element.attr("height"); if (!this.model.width) this.model.width = this.element.attr("width");
            this._setHeight(this.model.height);
            if (this.model.width) this.wrapper.width(this.model.width);
        },
        _setHeight: function (height) {
            if (height) this.wrapper.height(height);
            if (this._isIE7) this.element.height(this.container.height());
        },

        _validateTimeFormat: function (timeFormat) {
            var parts = timeFormat.split(" "), format = "";
            if (parts.length == 1 || parts.length == 2) {
                $(parts).each(function (i, part) {
                    format += $.trim(part) + " ";
                });
                return $.trim(format);
            }
            else return null;
        },

        _getSeperator: function () {
            var p = this._getElePlace(), formats = this.model.timeFormat.split(" ")[p.time];
            var regex = new RegExp("^[a-zA-Z0-9]+$");

            for (var i = 0; i < formats.length; i++) {
                if (!regex.test(formats.charAt(i))) return formats.charAt(i);
            }
        },

        _checkInComplete: function () {
            var pos = this._getCaretSelection(), cursor = this._getStartEnd(pos);
            var replace = "00", selected = this._getSelectedValue(cursor), category = this._getCategory(cursor);
            if (pos.end - pos.start == this.element.val().length) this._checkAll();

            if (category && category != "tt") {
                this._findCategoryPosition(category);
                if (selected == "__") {
                    if (category == "h" || category == "hh") replace = "12";
                    this._changeToDefault(replace);
                }
                else if (category.length != 1 && selected.length == 1) {
                    selected = this._changeWhole(selected);
                    this.element.val(this._replaceAt(this.target.value, this.start, this.end, selected));
                }
            }
        },
        _checkAll: function () {
            var i, p = this._getElePlace(), categories = this.model.timeFormat.split(" ")[p.time].split(this.seperator);
            for (i = 0; i < categories.length; i++) {
                this._findCategoryPosition(categories[i]);
                var selected = this._getSelectedValue({ start: this.start, end: this.end });

                if (categories[i].length != 1 && selected.length == 1) {
                    selected = this._changeWhole(selected);
                    this.element.val(this._replaceAt(this.element.val(), this.start, this.end, selected));
                }
            }
        },

        _changeToDefault: function (replace) {
            this.incomplete = true;
            var preVal = this.element[0].value
            this.element[0].value = this._replaceAt(this.target.value, this.start, this.end, replace);
            var timeValue = this._checkExceedRange(this.target.value);
            if (!!timeValue) {
                this._setTime(this.model[timeValue]);
            }
            this._setSelection(this.start, this.end);
            this._raiseChangeEvent(preVal);
        },

        _setSelection: function (start, end) {
            var element = this.element[0];

            if (element.setSelectionRange)
                element.setSelectionRange(start, end);
            else if (element.createTextRange) {
                // For lower version browsers (IE8, IE7 ...)
                element = element.createTextRange();
                element.collapse(true);
                element.moveEnd('character', end);
                element.moveStart('character', start);
                element.select();
            }
        },

        _getSelectedValue: function (cursor) {
            return this.target.value.substring(cursor.start, cursor.end);
        },

        _getMinMax: function (currPart, keydown) {
            if (currPart == "hh" || currPart == "h") {
                this.min = 1; this.max = 11;
                if (keydown) this.max = 12;
            }
            else if (currPart == "HH" || currPart == "H") {
                this.min = 0; this.max = 23;
            }
            else if (currPart == "mm" || currPart == "m" || currPart == "ss" || currPart == "s") {
                this.min = 0; this.max = 59;
            }
        },

        _focusElement: function () {
            this._manualFocus = true;
            this.element.focus();
        },
        _targetFocus: function (e) {
            this._clearRange();
            e.preventDefault();
            this.focused = true;
            this.element.on('mousewheel DOMMouseScroll', $.proxy(this._mouseWheel, this));
            this.wrapper.addClass("e-focus").removeClass("e-error").attr('aria-invalid', "false");
            if (!this._manualFocus) {
                this._findCategoryPosition(this._getLeast(false));
                this._setSelection(this.start, this.end);
            }
            this._manualFocus = false;
            this._prevTimeVal = this.element.val();
            this._raiseEvent("focusIn");
            this.wrapper.addClass('e-valid');
        },
        _targetBlur: function () {
            this.focused = false;
            this.element.off('mousewheel DOMMouseScroll', $.proxy(this._mouseWheel, this));
            this.wrapper.removeClass("e-focus");
            if (!this.model.enableStrictMode) {
                // To remove the min value mask while focusout the timepicker.
                if (this.target.value.indexOf('_') > -1) this.element.val('');
            }
            if (!this._checkMinMax(this.target.value) && this._isValid(this.target.value, true)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this._createObject(this.target.value), this.model.minTime, true))
                        this.element.val(this.model.minTime);
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this._createObject(this.target.value), true))
                        this.element.val(this.model.maxTime);
                    if (!this._isValid(this.model.value, true))
                        this.element.val(null);
                    this.isValidState = true;
                    (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
                }
                else
                    this.isValidState = false;
            }
            else this.isValidState = true;
            this._ensureValue();
            this._raiseChangeEvent();
            this._checkErrorClass();
            this._raiseEvent("focusOut");
            if (!this.model.enableStrictMode) this._checkInComplete();
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
        },
        _clearRange: function () {
            var input = this.element[0];
            if (!isNaN(input.selectionStart)) {
                input.selectionStart = 0;
                input.selectionEnd = 0;
            }
        },
        _checkErrorClass: function () {
            if (this.isValidState) this.wrapper.removeClass("e-error").attr('aria-invalid', "false");
            else this.wrapper.addClass("e-error").attr('aria-invalid', "true");
        },

        _getCaretSelection: function () {
            var input = this.element[0], start = 0, end = 0;
            if (!isNaN(input.selectionStart)) {
                start = input.selectionStart;
                end = input.selectionEnd;
                return { start: Math.abs(start), end: Math.abs(end) };
            }
            // For lower version browsers (IE8, IE7 ...)
            var bookmark = document.selection.createRange().getBookmark();
            var selection = input.createTextRange();
            selection.moveToBookmark(bookmark);

            var before = input.createTextRange();
            before.collapse(true);
            before.setEndPoint("EndToStart", selection);
            var beforeLength = before.text.length, selLength = selection.text.length;
            return { start: beforeLength, end: beforeLength + selLength };
        },

        _mouseDownOnInput: function (e) {
            if (!this.focused && (!ej.isTouchDevice())) this._focusElement();
            this.downPosition = this._getCaretSelection();
            $(document).on("mouseup", $.proxy(this._mouseUpOnInput, this));
        },

        _mouseUpOnInput: function (e) {
            e.preventDefault();
            $(document).off("mouseup", $.proxy(this._mouseUpOnInput, this));
            var pos = this._getCaretSelection();

            if (this.incomplete) {
                this.incomplete = false;
                pos = this.downPosition;
            }
            // Select the Complete Time value using mouse.            
            if (this.target.value != this._getSelectedText()) {
                pos = this._getStartEnd(pos);
                this._setSelection(pos.start, pos.end);
            }
        },

        _getCategoryPosition: function (category) {
            var s = 0, e = 0, parts = this.target.value.split(" "), p = this._getElePlace(), sep = this.seperator, valid = false;
            var fParts = this.model.timeFormat.split(" ")[p.time].split(sep);
            var tParts = parts[p.time].split(sep);
            if (fParts.length > tParts.length) return { start: s, end: e, isValid: valid };

            if (category == "tt") {
                if (parts[p.tt] == this.ttAM || parts[p.tt] == this.ttPM) {
                    if (p.tt == 0) s = 0;
                    else s = parts[p.time].length + 1;
                    e = s + parts[p.tt].length;
                    valid = true;
                }
            }
            else {
                if (p.time == 0) s = 0;
                else s = parts[p.tt].length + 1;

                var index = fParts.indexOf(category);
                if (index != -1) {
                    for (var i = 0; i < fParts.length; i++) {
                        e = tParts[i].length + 1;
                        if (i == index) break;
                        else s += e;
                    }
                    e += s - 1;
                    valid = true;
                }
            }
            return { start: s, end: e, isValid: valid };
        },
        _getCategory: function (cursor) {
            var parts = this.model.timeFormat.split(" "), sep = this.seperator;
            var p = this._getElePlace();
            if (cursor.isTT) return parts[p.tt];
            else return parts[p.time].split(sep)[cursor.index];
        },

        _getStartEnd: function (pos) {
            var tt, sep = this.seperator;
            var value = this.element.val(), parts = value.split(" "), s = 0, e = 0, place = tt = null, i, j;

            for (j = 0; j < parts.length; j++) {
                if (parts[j] != this.ttAM && parts[j] != this.ttPM) {
                    var time = parts[j].split(sep), tempS = s, tempE = s + time[0].length;
                    for (i = 0; i < time.length; i++) {
                        e = time[i].length + s;
                        if (pos.start <= e) {
                            place = i;
                            tt = false;
                            j = parts.length;
                            break;
                        }
                        else s += time[i].length + 1;
                    }
                }
                else {
                    if (pos.start <= s + parts[j].length) {
                        e = parts[j].length + s;
                        place = 0;
                        tt = true;
                        j = parts.length;
                        break;
                    }
                    else s += parts[j].length + 1;
                }
            }
            if (place == null) s = tempS, e = tempE, place = 0, tt = false;

            return { start: s, end: e, index: place, isTT: tt };
        },

        _modifyValue: function (isIncrement) {
            if (!this._isValid(this.target.value)) return;
            if (!this.model.enableStrictMode) this._checkInComplete();
            var pos = this._getCaretSelection(), cursor;
            if (pos.start == pos.end) {
                var cate = this._getLeast(true);
                var position = this._getCategoryPosition(cate);
                cursor = this._getStartEnd(position);
            }
            else cursor = this._getStartEnd(pos);
            this.start = cursor.start; this.end = cursor.end;
            this._changeValue(cursor, isIncrement);
        },

        _keyUpOnInput: function (e) {
            e.preventDefault();
            if (this._preVal != this.element.val()) {
                this._preVal = this.element.val();
            }
            var proxy = this;
            pos = this._getCaretSelection();
            cursor = this._getStartEnd(pos);
            category = this._getCategory(cursor);
            proxy = this;
            var currSelection = this._getSelectedValue(cursor);
            spl = this.element.val();
            spl.split(":");
            if (spl[0] < 3)
                if (isNaN(spl[0] + spl[1]) == true && (spl[0]) < 10)
                    this._poschange = true;
                else
                    this._poschange = false;

            if (((category == 'h') && (pos.start == 2 && pos.end == 2) && (currSelection > 9 && currSelection < 13)) || ((category == 'H') && (currSelection > 9 && currSelection < 24)) || ((category == 'H') && (currSelection < 9) && (pos.start == 2 && pos.end == 2)) || (category == "mm" && this._poschange == true && (pos.start == 4 && pos.end == 4)) || (category == "ss" && (pos.start == 8 && pos.end == 8)) || (category == "ss" && this._poschange == true && (pos.start == 7 && pos.end == 7)) || (category == 'mm' && (pos.start == 5 && pos.end == 5))) {
                if (!((category == 'mm' && (this.model.timeFormat == "HH:mm" || this.model.timeFormat == "hh:mm" || this.model.timeFormat == "H:mm" || this.model.timeFormat == "h:mm")) || (category == "ss" && (this.model.timeFormat == "HH:mm:ss" || this.model.timeFormat == "hh:mm:ss" || this.model.timeFormat == "H:mm:ss" || this.model.timeFormat == "h:mm:ss"))))
                    this._movePosition(pos, null);
            }
            else if (((category == 'hh' || category == 'HH') && (pos.start && pos.end == 2)) && (currSelection < 24)) {
                this._movePosition(pos, null);
            }
        },

        _getNextCategory: function (cate, direction) {
            var categories = [], sep = this.seperator;
            var fParts = this.model.timeFormat.split(" ");
            $(fParts).each(function (i, part) {
                if (part == "tt") categories.push(part);
                else {
                    var inner = part.split(sep);
                    categories = inner.concat(categories);
                }
            });
            var index = categories.indexOf(cate), ix;
            if (index != -1) {
                if (direction) {
                    if (index == 0) ix = categories.length - 1;
                    else ix = index - 1;
                }
                else {
                    if (index == categories.length - 1) ix = 0;
                    else ix = index + 1;
                }
                return categories[ix];
            }
            return cate;
        },
        _getElePlace: function () {
            var fParts = this.model.timeFormat.split(" "), time, tt;
            if (fParts[0] == "tt") time = 1, tt = 0;
            else time = 0, tt = 1;
            return { time: time, tt: tt };
        },
        _movePosition: function (pos, direction) {
            var cursor = this._getStartEnd(pos);
            var currCate = this._getCategory(cursor);
            if (!currCate) currCate = this._getLeast(direction);
            var next = this._getNextCategory(currCate, direction);
            var cursor = this._getCategoryPosition(next);

            if (cursor.isValid) {
                this._setSelection(cursor.start, cursor.end);
            }
        },
        _findActiveIndex: function () {
            var elements = this.ul.find("li");
            var currTime = this.element.val(), firstTime = elements.first().html(), index;
            index = (this._parse(currTime) - this._parse(firstTime)) / (this.model.interval * 60000);
            index = Math.round(index);
            this._activeItem = (index == elements.length) ? index : index + 1;
            if (this._activeItem < 0 || this._activeItem > elements.length || isNaN(this._activeItem)) this._activeItem = 0;
        },
        _keyDownOnInput: function (e) {
            if (this.model.readOnly && !this._readOnlyKeys(e)) return false;
            var pos, cursor, category, key = e.keyCode;

            // _getInternalEvents is set to true when TimePicker used inside DateTimePicker control
            // in DateTimePicker control it allows Up, Down, Home, End, Tab keys only
            if (this._getInternalEvents && key != 38 && key != 40 && key != 36 && key != 35 && key != 9) return false;
            // Up, Down, Esc
            if (!this.model.enableStrictMode) {
                // Prevent type operation on popup open in state.
                if (this.showDropdown && key != 38 && key != 40 && key != 27 && !this._readOnlyKeys(e)) return false;
                else if (this.showDropdown && (key == 37 || key == 39)) e.keyCode = (key == 37) ? 38 : 40;
            }
            pos = this._getCaretSelection();
            cursor = this._getStartEnd(pos);
            category = this._getCategory(cursor);
            switch (e.keyCode) {
                case 38:
                    e.preventDefault();
                    if (!this.showDropdown) {
                        if (this._isValid(this.target.value)) this._modifyValue(true);
                    }
                    else if (this.showDropdown) {
                        e.preventDefault();
                        this._findActiveIndex();
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectUp(this._activeItem - 1);
                        if (this._activeItem == 0) this._activeItem = prevActiveItem;
                        this._addListHover();
                        activeItem = this._getActiveItem();
                        if (activeItem.length) this._selectTimeItem(activeItem);
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (e.altKey && this.model.showPopupButton)
                        this._showhidePopup();
                    else if (!this.showDropdown) {
                        if (this._isValid(this.target.value)) this._modifyValue(false);
                    }
                    else if (this.showDropdown) {
                        e.preventDefault();
                        this._findActiveIndex();
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectDown(this._activeItem);
                        if (this._activeItem < this._listSize) this._activeItem += 1;
                        else
                            this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 37:
                    e.preventDefault();
                    if (pos.start == pos.end) this._setSelection(pos.start - 1, pos.start - 1);
                    else this._movePosition(pos, true);
                    break;
                case 39:
                    e.preventDefault();
                    if (pos.start == pos.end) this._setSelection(pos.start + 1, pos.start + 1);
                    else this._movePosition(pos, false);
                    break;

                case 36:
                    // Home key 
                    e.preventDefault();
                    if (!this.showDropdown) {
                        var homecate = this._firstlastVal(true);
                        var hPos = this._getCategoryPosition(homecate);
                        if (hPos.isValid) this._setSelection(hPos.start, hPos.end);
                    }
                    else {
                        this._activeItem = 0;
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectDown(this._activeItem);
                        if (this._activeItem < this._listSize) this._activeItem += 1;
                        else
                            this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 35:
                    // End key
                    e.preventDefault();
                    if (!this.showDropdown) {
                        var endcate = this._firstlastVal(false);
                        var ePos = this._getCategoryPosition(endcate);
                        if (ePos.isValid) this._setSelection(ePos.start, ePos.end);
                    }
                    else {
                        this._activeItem = this._listSize + 1;
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectUp(this._activeItem - 1);
                        if (this._activeItem == 0) this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 9:
                    if (this._getInternalEvents) break;
                    this._hideResult();
                    var flag = null;
                    if (e.shiftKey && pos.start > 0) flag = true;
                    else if (!e.shiftKey && pos.end < this.element.val().length) flag = false;
                    if (flag != null) {
                        e.preventDefault();
                        this._checkInComplete();
                        this._movePosition(pos, flag);
                    }
                    break;
                case 13:
                    if (!this.showDropdown) {
                        this._raiseChangeEvent();
                        break;
                    }
                case 27:
                    e.preventDefault();
                    this._hideResult();
                    break;
                case 8:
                case 46:
                    if (this.model.enableStrictMode) return;
                    if (this.target.value != this._getSelectedText()) {
                        e.preventDefault();
                        if (category && category != "tt") {
                            this._findCategoryPosition(category);
                            var _doBackspace = (key == 8 && pos.start != this.start), _doDelete = (key == 46 && pos.end != this.end), len;
                            len = this.end - this.start;

                            if ((pos.start != pos.end || len == 1) && (_doBackspace || _doDelete || pos.start != pos.end)) {
                                var s1 = this.start, s2 = this.end, te;
                                this.element[0].value = this._replaceAt(this.target.value, s1, s2, "__");
                                te = (s2 - s1 != 2) ? s2 + 1 : s2;
                                this._setSelection(s1, te);
                            }
                            else {
                                if (_doBackspace) {
                                    this.element[0].value = this._replaceAt(this.target.value, pos.start - 1, pos.start, "");
                                    this._setSelection(pos.start - 1, pos.start - 1);
                                }
                                else if (_doDelete) {
                                    this.element[0].value = this._replaceAt(this.target.value, pos.end, pos.end + 1, "");
                                    this._setSelection(pos.end, pos.end);
                                }
                            }
                        }

                    }
                    break;

            }

            var currSelection = this._getSelectedValue(cursor);
            var unicode = e.keyCode ? e.keyCode : e.charCode, actualkey;

            if (e.keyCode > 47 && e.keyCode < 58)
                actualkey = String.fromCharCode(unicode);
            else if (e.keyCode > 95 && e.keyCode < 106)
                actualkey = String.fromCharCode(unicode - 48);
            if (category == "tt" && ((!e.shiftKey && !e.ctrlKey && !e.altKey) && (e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106))) {
                e.preventDefault();
                var ttPos = this._getCategoryPosition(category);
                this.start = ttPos.start;
                this.end = ttPos.end;
                this._changeAmPm(currSelection);
                this._raiseChangeEvent();
            }

            // Select complete text and then press time value in the textbox               
            if (this.target.value == this._getSelectedText() && (!e.shiftKey && !e.ctrlKey && !e.altKey)) {
                if (e.keyCode > 64 && e.keyCode < 91 && !this.model.enableStrictMode) e.preventDefault();
                if ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
                    var cursor = this._getStartEnd(pos);
                    this._setSelection(cursor.start, cursor.end);
                }
            }

            if ((!e.shiftKey && !e.ctrlKey && !e.altKey) && (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
                if (category != "tt") {
                    this._getMinMax(category, true);
                    if (pos.start == pos.end) {
                        this._findCategoryPosition(category);
                        var newVal;
                        if (pos.start == this.start) {
                            newVal = actualkey + currSelection;
                            if (this.model.enableStrictMode == false) {
                                this._validateTimes();
                                this._targetBlur();
                            }
                            if (this.model.value == null) this.element.val(this.model.minTime);
                            var cursor = this._getStartEnd(pos);
                            this._setSelection(cursor.start, cursor.end);
                        }
                        else {
                            newVal = currSelection + actualkey;
                        }
                        if (newVal.length > 2 || !(Number(newVal) >= this.min && this.max >= Number(newVal))) {
                            !this.model.enableStrictMode && e.preventDefault();
                        }
                    }
                    else if (!(Number(actualkey) >= this.min && this.max >= Number(actualkey))) {
                        !this.model.enableStrictMode && e.preventDefault();
                    }
                }
            }
            else if (!this._allowKeyCodes(e)) {
                !this.model.enableStrictMode ? (e.keyCode == 8 || e.keyCode == 46) ? e.stopPropagation() : e.preventDefault() : e.stopPropagation();
            }
        },

        _getSelectedText: function (e) {
            if (window.getSelection) {
                var element = $('#' + this.element[0].id).get(0);
                return element.value.substring(element.selectionStart, element.selectionEnd);
            }
                // For IE
            else return document.selection.createRange().text;
        },
        _allowKeyCodes: function (e) {
            if ((e.ctrlKey && (e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 90 || e.keyCode == 89))
                || e.keyCode == 9 || e.keyCode == 116 || e.keyCode == 13)
                return true;
            return false;
        },
        _readOnlyKeys: function (e) {
            if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || this._allowKeyCodes(e))
                return true;
            return false;
        },

        _firstlastVal: function (initial) {
            var parts = this.model.timeFormat.split(" "), sep = this.seperator;
            if (initial) {
                if (parts[0] != "tt") return parts[0].split(sep)[0];
                return "tt";
            }
            else {
                if (parts[0] != "tt") return "tt";
                else if (parts[1]) {
                    var lastItem = parts[1].split(sep);
                    return lastItem.length ? lastItem[lastItem.length - 1] : "tt";
                }
                return "tt";
            }
        },

        _mouseWheel: function (event) {
            event.preventDefault();
            if (this.model.readOnly) return false;
            var delta, rawEvent = event.originalEvent;
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
                this._modifyValue(true);
            else if (delta < 0)
                this._modifyValue(false);
        },

        _addListHover: function () {
            this._addSelected();
            this._updateScrollTop();
        },
        _addSelected: function () {
            this.ul.find("li").removeClass("e-active e-hover");
            var activeItem = this._getActiveItem();
            if (activeItem.length && !activeItem.hasClass('e-disable'))
                activeItem.addClass('e-active');
        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0)
                    return current;
                else
                    return this._disableItemSelectDown(current + 1);
            }
            else return this._listSize;
        },

        _disableItemSelectUp: function (current) {
            current = current - 1;
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0)
                    return current + 1;
                else if (current > 0)
                    return this._disableItemSelectUp(current);
            }
            return 0;
        },
        _getActiveItem: function () {
            return $(this.ul.find("li")[this._activeItem - 1]);
        },

        _timeIconClick: function (event) {
            if (ej.isNullOrUndefined(this.popupList)) {
                this._renderDropdown();
                this._addProperty();
            };
            var isRightClick = false;
            if (event.button)
                isRightClick = (event.button == 2);
            else if (event.which)
                isRightClick = (event.which == 3); //for Opera
            if (isRightClick) return;
            event.preventDefault();
            if (!this.model.enabled || this.model.readOnly || this.ul.find("li").length < 1) return false;
            this._showhidePopup();
            var len = this.element.val().length;
            if (!ej.isTouchDevice()) this._setSelection(len, len);
        },
        _showhidePopup: function () {
            if (this._getInternalEvents) return false;
            if (!this.showDropdown)
                this._showResult();
            else
                this._hideResult();
        },
        _showResult: function () {
            if (this.popupList == null) this._renderDropdown();
            this._raiseEvent("beforeOpen");
            if (!this.focused && (!ej.isTouchDevice())) this._focusElement();
            if (this.model.value) this._changeActiveEle();
            else
                this.ul.find("li").removeClass("e-active");

            var proxy = this, sTop = this._visibleAndCalculateTop();
            this.popupList.slideDown(this.model.enableAnimation ? 200 : 0, function () {
                $(document).on("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
            });
            this.scrollerObj.setModel({ "scrollTop": sTop });
            this.showDropdown = true;
            this._listSize = this.ul.find("li").length;
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            this._on(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
            this._on(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
            this._raiseEvent("open");
            this.wrapper.addClass("e-active");
        },
        _hideResult: function (e) {
			if ( e && (e.type == "touchmove" || e.type== "scroll")) {
				if ($(e.target).parents("#"+this.popupList[0].id).length > 0)
			   return;
			}           
			if (this.showDropdown && !this._getInternalEvents) {
			this.showDropdown = false;
			this.popupList.slideUp(this.model.enableAnimation ? 100 : 0);
			$(document).off("mousedown", $.proxy(this._OnDocumentClick, this));
			$(window).off("resize", $.proxy(this._OnWindowResize, this));
			this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
			this._off(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
			this._raiseEvent("close");
			this.wrapper.removeClass("e-active");
            }
        },

        _visibleAndCalculateTop: function () {
            this.popupList.css({ "display": "block" });
            var scrollTop = this._calcScrollTop();
			this._refreshPopup();
            this.popupList.css({ "display": "none" });
            return scrollTop;
        },
        _calcScrollTop: function () {
            var ulH = this.ul.outerHeight(), liH = this.ul.find("li").outerHeight(), index, top;
            index = this.ul.find("li.e-active").index();
            top = (liH * index) - ((this.popupList.outerHeight() - liH) / 2);
            return top;
        },
        _changeActiveEle: function () {
            if (!this.model.showPopupButton || !this.popupList) return false;
            var elements = this.ul.find("li");
            var currTime = this.element.val(), firstTime = elements.first().html(), index;
            index = (this._parse(currTime) - this._parse(firstTime)) / (this.model.interval * 60000);
            index = Math.round(index);
            this._activeItem = (index == elements.length) ? index : index + 1;
            if (this._activeItem < 0 || this._activeItem > elements.length || isNaN(this._activeItem) || this._ensureTimeRange(currTime)) this._activeItem = 0;
            this._addListHover();
        },

        _OnDocumentClick: function (e) {
            if (!$(e.target).is(this.popupList) && !$(e.target).parents(".e-time-popup").is(this.popupList) &&
                !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-timewidget").is(this.wrapper)) {
                this._hideResult();
            }
            else if ($(e.target).is(this.popupList) || $(e.target).parents(".e-time-popup").is(this.popupList))
                e.preventDefault();
        },
        _OnWindowResize: function (e) {
            this._refreshPopup();
        },

        _OnMouseEnter: function (e) {
            var targetEle = e.target;
            this.ul.find("li").removeClass("e-hover");
            if (!$(targetEle).hasClass('e-disable'))
                $(targetEle).addClass("e-hover");
        },
        _OnMouseLeave: function (e) {
            if (!this._dateTimeInternal || this.model.value)
                this.ul.find("li").removeClass("e-hover");
        },
        _OnMouseClick: function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('e-disable')) return;
            if (this.model.enabled && !this.model.readOnly) {
                this._activeItem = $(e.target).index() + 1;
                this.ul.find("li").attr({ 'tabindex': -1, 'aria-selected': false });
                $(e.target).attr({ 'aria-selected': true, 'tabindex': 0 });
                this._addSelected();
                this._selectTimeItem($(e.target));
            }
            this._showhidePopup();
        },
        _selectTimeItem: function (ele) {
            this._beforeChange(ele);
            var flag = this._raiseChangeEvent();
            if (flag)
                this._trigger("select", { value: this.model.value, prevTime: this._previousValue });
        },

        _findCategoryPosition: function (category) {
            if (category == "least") category = this._getLeast(true);
            var pos = this._getCategoryPosition(category);
            this.start = pos.start;
            this.end = pos.end;
        },

        _getLeast: function (lower) {
            var formats = this.model.timeFormat.split(" "), sep = this.seperator, res = null;
            $(formats).each(function (i, e) {
                if (e != "tt") {
                    var times = e.split(sep);
                    if (lower) res = times[times.length - 1];
                    else res = times[0];
                }
            });
            return res;
        },

        _changeValue: function (cursor, isIncrement) {
            var preVal = this.target.value, currValue, category = this._getCategory(cursor);
            if (!category) return false;
            this._setSelection(this.start, this.end);
            currValue = this.target.value.substring(this.start, this.end);
            if (this._checkMinMax(this.target.value)) {
                if (currValue != this.ttAM && currValue != this.ttPM) {
                    currValue = this._changeCurrentValue(currValue, category, isIncrement);
                    if (category.length != 1) currValue = this._changeWhole(currValue);
                    this._findCategoryPosition(category);
                    this.element.val(this._replaceAt(this.target.value, this.start, this.end, currValue));
                    this.end = this.start + currValue.toString().length;
                    this._setSelection(this.start, this.end);
                    if (this._ensureTimeRange(this.target.value) && this._checkMinMax(this.target.value)) {
                        var timeObject = this._createObject(this.target.value);
                        var hour = timeObject.getHours();
                        var fromTime = isIncrement ? this._startTime : this._endTime;
                        var toTime = isIncrement ? this._endTime : this._startTime;
                        if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                            for (i = 0; i < this.model.disableTimeRanges.length; i++) {
                                if ((fromTime[i].getHours() === hour) || ((+timeObject >= +this._startTime[i]) && +timeObject <= +this._endTime[i])) {
                                    this.target.value = this._localizeTime(toTime[i]);
                                    this._findCategoryPosition(category);
                                    this._setSelection(this.start, this.end);
                                    this._changeValue(cursor, isIncrement);
                                }
                            }
                        }
                    }
                }
                else this._changeAmPm(currValue);
            }
            else {
                var timeValue = this._checkExceedRange(this.target.value);
                this._setTime(this.model[timeValue]);
                this._findCategoryPosition(category);
                this._setSelection(this.start, this.end);
            }
            if (!this._checkMinMax(this.target.value)) {
                this.element.val(this.model.value);
                this._findCategoryPosition(category);
                this._setSelection(this.start, this.end);
            }
            else this._raiseChangeEvent();
        },

        _checkMinMax: function (value) {
            var res = this._checkExceedRange(value);
            if (res == null) res = false;
            return !res;
        },
        _checkExceedRange: function (value) {
            if (value) {
                if (this.model.minTime && !this._compareTime(value, this.model.minTime, true)) return "minTime";
                if (this.model.maxTime && !this._compareTime(this.model.maxTime, value, true)) return "maxTime";
            }
            return null;
        },

        _changeWhole: function (currValue) {
            return currValue > 9 ? "" + currValue : "0" + currValue;
        },
        _changeAmPm: function (ampm) {
            ampm = ampm == this.ttAM ? this.ttPM : this.ttAM;
            this.element.val(this._replaceAt(this.target.value, this.start, this.end, ampm));
            this._setSelection(this.start, this.end);
        },
        _changeMinute: function (isIncrement) {
            var formats = ["mm", "m"];
            var currFormat = this._getExactFormat(formats);
            if (currFormat) {
                this._findCategoryPosition(currFormat);
                var minute = Number(this.target.value.substring(this.start, this.end));
                this._getMinMax(currFormat);
                if (isIncrement) {
                    if (minute == this.max) {
                        minute = this.min;
                        this._changeHour(isIncrement);
                    }
                    else minute += 1;
                }
                else {
                    if (minute == this.min) {
                        minute = this.max;
                        this._changeHour(isIncrement);
                    }
                    else minute -= 1;
                }
                this._findCategoryPosition(currFormat);
                if (currFormat.length != 1) minute = this._changeWhole(minute);
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, minute));
            }
        },
        _changeHour: function (isIncrement) {
            var formats = ["hh", "h", "HH", "H"];
            var currFormat = this._getExactFormat(formats);
            if (currFormat) {
                this._findCategoryPosition(currFormat);
                var hour = Number(this.target.value.substring(this.start, this.end));
                this._getMinMax(currFormat);
                if (isIncrement) {
                    if (hour == this.max) {
                        hour += 1;
                        this._changeMeridian();
                    }
                    else if (hour > this.max) hour = this.min;
                    else hour += 1;
                }
                else {
                    if (hour == this.min) hour = this.max + 1;
                    else if (hour > this.max) {
                        hour = this.max;
                        this._changeMeridian();
                    }
                    else hour -= 1;
                }
                this._findCategoryPosition(currFormat);
                if (currFormat.length != 1) hour = this._changeWhole(hour);
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, hour));
            }
        },
        _getExactFormat: function (cate) {
            var tFormat = this.model.timeFormat;
            for (var i = 0; i < cate.length; i++) {
                if (tFormat.indexOf(cate[i]) != -1) return cate[i];
            }
            return null;
        },
        _changeMeridian: function () {
            var start = this.model.timeFormat.indexOf("tt");
            if (start != -1) {
                this._findCategoryPosition("tt");
                var meridian = this.target.value.substring(this.start, this.end);
                meridian = (meridian == this.ttAM) ? this.ttPM : this.ttAM;
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, meridian));
            }
        },
        _changeCurrentValue: function (current, category, isIncrement) {
            current = Number(current);
            var c = category, step = 1, change = true;
            this._getMinMax(c);

            if (c == "hh" || c == "h" || c == "HH" || c == "H") step = this.model.hourInterval;
            else if (c == "mm" || c == "m") step = this.model.minutesInterval;
            else if (c == "ss" || c == "s") step = this.model.secondsInterval;
            if (step <= 0) return current;

            if (isIncrement) {
                if ((c == "hh" || c == "h") && current > this.max) current = this.min - 1 + step;
                else if (current < this.max) current += step;
                else {
                    change = false;
                    if (c != "hh" && c != "h") current = this.min - 1 + step;
                    else current += step;
                    this._changeAdjacent(c, isIncrement);
                }
                if ((c == "hh" || c == "h") && current == this.max + 1)
                    change && this._changeAdjacent(c, isIncrement);
                else if (current > this.max + 1) {
                    current = current - (this.max + 1);
                    change && this._changeAdjacent(c, isIncrement);
                }
                if ((c != "hh" && c != "h") && current == this.max + 1) {
                    current = this.min;
                    change && this._changeAdjacent(c, isIncrement);
                }
            }
            else {
                if ((c != "hh" && c != "h") && current > this.min) current -= step;
                else if ((c == "hh" || c == "h") && current > this.min && current <= this.max) current -= step;
                else if ((c == "hh" || c == "h") && current == this.min) current = this.max + 2 - step;
                else {
                    change = false;
                    current = this.max + 1 - step;
                    this._changeAdjacent(c, isIncrement);
                }
                if (current < this.min) {
                    current = current + (this.max + 1);
                    change && this._changeAdjacent(c, isIncrement);
                }
            }
            return current;
        },
        _changeAdjacent: function (c, isIncrement) {
            if (c == "ss" || c == "s") this._changeMinute(isIncrement);
            else if (c == "mm" || c == "m") this._changeHour(isIncrement);
            else if (c == "hh" || c == "h" || c == "HH" || c == "H") this._changeMeridian();
        },

        _valueChange: function (e) {
            this._raiseChangeEvent();
        },

        _beforeChange: function (ele) {
            if (!this._raiseEvent("beforeChange")) {
                this.element.val(ele.text());
            }
            return true;
        },

        _raiseChangeEvent: function (prev, isCode) {
            prev = (prev === undefined) ? this.model.value : prev;
            this._previousValue = prev;
            var current = !this.target.value ? null : this.target.value;
            if (prev == current) return false;
            if (this._checkMinMax(this.target.value) && this._isValid(this.target.value, this.model.enableStrictMode) || !this.target.value) this.isValidState = true;
            else this.isValidState = false;
            this.model.value = this._isValid(this.target.value, true) && this._checkMinMax(this.target.value) ? this.target.value : null;
            if (!this.model.value && !this.model.enableStrictMode) this._setTime(this.model.value);
            if (this.model.value == this._previousValue) return false;
            this._raiseEvent("change", isCode);
            this._raiseEvent("_change", isCode);
            return true;
        },
        _raiseEvent: function (name, isCode) {
            var data = { value: this.model.value, prevTime: this._previousValue };
            if (name == "change") data.isInteraction = !isCode;
            return (this._trigger(name, data));
        },
        _checkIE7: function () {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"), version = -1;
                if (re.exec(navigator.userAgent) != null)
                    version = parseFloat(RegExp.$1);
                if (version >= 7 && version < 8) return true;
            }
            return false;
        },
        _replaceAt: function (mainString, from, to, replace) {
            return mainString.substring(0, from) + replace + mainString.substring(to);
        },
        _localizeTime: function (value) {
            if (value)
                return $.trim(ej.format(this._createObject(value), this.model.timeFormat, this.model.locale));
            return null;
        },
        _localizeMeridian: function (value) {
            return $.trim(ej.format(value, "tt", this.model.locale));
        },
        _compareTime: function (time1, time2, orEqual) {
            orEqual = (!orEqual) ? false : true;
            if (orEqual) return this._parse(time1) >= this._parse(time2);
            else return this._parse(time1) > this._parse(time2);
        },
        _isValid: function (time, validate) {
            time = this._createObject(time, validate);
            return time && typeof time.getTime === "function" && isFinite(time.getTime());
        },
        _parse: function (time) {
            return Date.parse(this._createObject(time));
        },
        _setEmptyDate: function (date) {
            var newDate = new Date(date);
            newDate.setDate(1);
            newDate.setMonth(0);
            newDate.setFullYear(2000);
            return newDate;
        },
        _createObject: function (value, validate) {
            var obj = null;
            if (typeof value === "string") {
                var format = this._setModelOption ? this._preTimeformat : this.model.timeFormat;
                var dateFormat = ej.preferredCulture(this.model.locale).calendar.patterns.d;
                var dateValue = ej.format(new Date("1/1/2000"), dateFormat, this.model.locale);
                obj = ej.parseDate(dateValue + " " + value, dateFormat + " " + format, this.model.locale);
                if (this._extISORegex.exec(value) || this._basicISORegex.exec(value)) this.model.value = obj = this._timeFromISO(value);
                this._setModelOption = false;
                if (!obj) {
                    var isJSONString = new Date(value);
                    if (!isNaN(Date.parse(isJSONString)) && !ej.isNullOrUndefined(value))
                        obj = this._setEmptyDate(value);
                    else
                        obj = !this._dateTimeInternal || value == "" ? null : new Date("1/1/2000 " + value);
                }
            }
            else if (typeof value === "number")
                obj = new Date(value);
            else if (value instanceof Date)
                obj = this._setEmptyDate(value);

            if (obj && !this._dateTimeInternal && validate) {
                var timeVal = this._localizeTime(obj);
                if (this._ensureTimeRange(timeVal))
                    obj = null;
            }
            return obj;
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        _wireEvents: function () {
            this._on(this.element, "focus", this._targetFocus);
            this._on(this.element, "blur", this._targetBlur);
            this._on(this.element, "mousedown", this._mouseDownOnInput);
            this._on(this.element, "keydown", this._keyDownOnInput);
            this._on(this.element, "keyup", this._keyUpOnInput);
        }
    });
    ej.TimePicker.Locale = ej.TimePicker.Locale || {};

    ej.TimePicker.Locale['default'] = ej.TimePicker.Locale['en-US'] = {
        watermarkText: "select a time",
    };
    
})(jQuery, Syncfusion);