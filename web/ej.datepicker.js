/**
* @fileOverview Plugin provides support to display calendar within your web page and allows to pick the date.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejDatePicker", "ej.DatePicker", {

        element: null,
        _rootCss: "e-datepicker",

        model: null,
        validTags: ["input", "div", "span"],
        _setFirst: false,
        _addToPersist: ["value"],
        _cancelValue: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },


        defaults: {

            dayHeaderFormat: "min",

            showPopupButton: true,

            enableAnimation: true,

            showFooter: true,

            displayInline: false,

            htmlAttributes: {},

            dateFormat: '',

            watermarkText: "Select date",

            value: null,
            minDate: new Date("01/01/1900"),

            maxDate: new Date("12/31/2099"),

            startLevel: "month",

            depthLevel: "",

            cssClass: "",

            startDay: -1,

            stepMonths: 1,

            locale: "en-US",

            showOtherMonths: true,

            enableStrictMode: false,

            enablePersistence: false,

            enabled: true,

            width: "",

            height: "",

            enableRTL: false,

            showRoundedCorner: false,

            headerFormat: 'MMMM yyyy',

            buttonText: 'Today',

            readOnly: false,

            specialDates: null,

            fields: {

                date: "date",

                tooltip: "tooltip",

                iconClass: "iconClass",

                cssClass: "cssClass"
            },

            showTooltip: true,

            showDisabledRange: true,

            highlightSection: "none",

            highlightWeekend: false,

            validationRules: null,

            validationMessage: null,
            validationMessages: null,

            allowEdit: true,

            tooltipFormat: "ddd MMM dd yyyy",

            allowDrillDown: true,

            blackoutDates: [],

            beforeDateCreate: null,

            open: null,

            close: null,

            select: null,

            change: null,

            focusIn: null,

            focusOut: null,

            beforeOpen: null,

            beforeClose: null,

            navigate: null,

            create: null,

            destroy: null,

            weekNumber: false,

            timeZone: true

        },


        dataTypes: {
            startDay: "number",
            stepMonths: "number",
            showOtherMonths: "boolean",
            enableStrictMode: "boolean",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            displayInline: "boolean",
            showPopupButton: "boolean",
            locale: "string",
            readOnly: "boolean",
            cssClass: "string",
            dateFormat: "string",
            watermarkText: "string",
            headerFormat: "string",
            buttonText: "string",
            specialDates: "data",
            showTooltip: "boolean",
            highlightSection: "enum",
            highlightWeekend: "boolean",
            enableAnimation: "boolean",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data",
            tooltipFormat: "string",
            allowEdit: "boolean",
            allowDrillDown: "boolean",
            weekNumber: "boolean"

        },

        _renderPopup: function () {
            this.sfCalendar = ej.buildTag('div.e-datepicker e-popup e-widget ' + this.model.cssClass + ' e-calendar ' + (this.model.specialDates ? (this.model.specialDates[0][this._mapField._icon] ? 'e-icons ' : '') : ''), "", {}, { id: (this._id ? 'e-' + this._id : "") }).attr({ 'aria-hidden': 'true' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                     .insertBefore(this.element);
            if (this.model.displayInline && !this.element.is("input"))
                this.sfCalendar.addClass('e-inline');
            this.popup = this.sfCalendar;
            if (!ej.isTouchDevice()) this.sfCalendar.addClass('e-ntouch');
            this._setRestrictDateState(this.model.showDisabledRange);
            this._createCalender();
            this._setDisplayInline(this.model.displayInline);
            this._resizeCalender();
            this._setRTL(this.model.enableRTL);
            this._setRoundedCorner(this.model.showRoundedCorner);
            this._wireCalendarEvents();
        },

        _setModel: function (jsondata) {
            
            var callRefresh = false, start = false, validate = false;
            for (var key in jsondata) {
				if(key != "showPopupButton" && key != "width" && key != "dateFormat" && key != "height" && key != "readOnly" && key != "allowEdit" && key != "enabled" && key != "watermarkText" && key != "htmlAttributes" && key != "validationMessages" && key != "validationRules"){
					if (ej.isNullOrUndefined(this.sfCalendar)) this._renderPopup();
				}
                switch (key) {
                    case "dayHeaderFormat":
                        this.model.dayHeaderFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "weekNumber":
                        this.model.weekNumber = jsondata[key];
                        this._refreshDatepicker();
                        break;
                    case "showPopupButton":
                        this._renderDateIcon(jsondata[key], true);
                        break;
                    case "displayInline":
                        if (!jsondata[key]) this._bindDateButton();
                        this._setDisplayInline(jsondata[key]);
                        if (!this.model.allowEdit && !jsondata[key] && this._isInputBox)
                            this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
                        break;
                    case "value":
                        if (ej.isPlainObject(jsondata[key])) jsondata[key] = null;
                        if (ej.isNullOrUndefined(jsondata["minDate"]) && ej.isNullOrUndefined(jsondata["maxDate"])) {
                            this._setDateValue(jsondata[key]);
                            if (this._specificFormat())
                                this._stopRefresh = true;
                            jsondata[key] = this.model.value;
                        }
                        else
                            this._updateDateValue(jsondata[key]);
                        validate = callRefresh = start = true;
                        break;
                    case "specialDates":
                        this.model.specialDates = jsondata[key];
                        this._createSpecialDateObject();
                        callRefresh = start = true;
                        break;
                    case "fields":
                        this.model.fields = jsondata[key];
                        this._mapField = this._getMapper();
                        callRefresh = start = true;
                        break;
                    case "showTooltip":
                        this.model.showTooltip = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "highlightWeekend":
                        this.model.highlightWeekend = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "highlightSection":
                        this.model.highlightSection = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "dateFormat":
                        this.model.dateFormat = jsondata[key];
                        this._ensureValue();
                        break;
                    case "minDate":
                        this._setMinDate(jsondata[key]);
                        jsondata[key] = this.model.minDate;
                        this._ensureValue();
                        validate = callRefresh = start = true;
                        break;
                    case "maxDate":
                        this._setMaxDate(jsondata[key]);
                        jsondata[key] = this.model.maxDate;
                        this._ensureValue();
                        validate = callRefresh = start = true;
                        break;
                    case "locale":
                        this.model.locale = jsondata[key];
                        this.model.startDay = ((ej.isNullOrUndefined(this._options.startDay)) && (this.model.startDay === this.culture.calendar.firstDay))
                            ? -1 : (this._options.startDay === this.defaults.startDay) ? -1 : this.model.startDay;
                        this.model.dateFormat = ((ej.isNullOrUndefined(this._options.dateFormat)) && (this.model.dateFormat === this.culture.calendar.patterns.d))
                            ? '' : this.model.dateFormat;
                        this._setCulture(jsondata[key]);
                        if (this.model.value) this._setDateValue(this.model.value);
                        jsondata[key] = this.model.locale;
                        callRefresh = start = true;
                        break;
                    case "showOtherMonths":
                        this.model.showOtherMonths = jsondata[key];
                        this._otherMonthsVisibility();
                        break;
                    case "enableStrictMode":
                        this.model.enableStrictMode = jsondata[key];
                        validate = callRefresh = start = true;
                        break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = jsondata[key];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessages":
                        this.model.validationMessages = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessages = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "readOnly":
                        this.model.readOnly = jsondata[key];
                        this._disbleMaualInput();
                        break;
                    case "width":
                        this._setWidth(jsondata[key]);
                        break;
                    case "height":
                        this._setHeight(jsondata[key]);
                        break;
                    case "cssClass":
                        this._setSkin(jsondata[key]);
                        break;
                    case "enableRTL":
                        this._setRTL(jsondata[key]);
                        break;
                    case "showRoundedCorner":
                        this._setRoundedCorner(jsondata[key]);
                        break;
                    case "enabled":
                        if (!jsondata[key]) this.disable();
                        else this.enable();
                        break;
                    case "buttonText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["buttonText"] = this.model.buttonText = jsondata[key];
                        this._localizedLabels.buttonText = this.model.buttonText;
                        this._setFooterText(jsondata[key]);
                        break;
                    case "showFooter":
                        this._enableFooter(jsondata[key]);
                        break;
                    case "watermarkText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["watermarkText"] = this.model.watermarkText = jsondata[key];
                        this._localizedLabels.watermarkText = this.model.watermarkText;
                        this._setWaterMark();
                        break;
                    case "startDay":
                        var initial = jsondata[key];
                        if (parseInt(jsondata[key]) < 0 || parseInt(jsondata[key]) > 6) {
                            jsondata[key] = this.culture.calendar.firstDay;
                            initial = -1;
                        }
                        this.model.startDay = jsondata[key];
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["startDay"] = initial;
                        callRefresh = start = true;
                        break;
                    case "startLevel":
                        this.model.startLevel = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "headerFormat":
                        this.model.headerFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "depthLevel":
                        this.model.depthLevel = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "allowEdit": this._changeEditable(jsondata[key]); break;
                    case "tooltipFormat":
                        this.model.tooltipFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "allowDrillDown":
                        this._allowQuickPick(jsondata[key]);
                        callRefresh = start = true;
                        break;
                    case "showDisabledRange":
                        this._setRestrictDateState(jsondata[key]);
                        break;
                    case "blackoutDates":
                        this.model.blackoutDates = jsondata[key];
                        this._initDisableObj(this.model.blackoutDates);
                        callRefresh = start = true;
                        break;
                }
            }
            if (validate) {
                this._validateMinMaxDate();
                jsondata["value"] = this.model.value;
                jsondata["maxDate"] = this.model.maxDate;
                jsondata["minDate"] = this.model.minDate;
            }
            this._setWaterMark();

            if (callRefresh && (this.isValidState || this.model.displayInline))
                this._refreshDatepicker();
            if (start) this._startLevel(this.model.startLevel);
            this._triggerChangeEvent();
            this._checkErrorClass();
        },
        observables: ["value"],

        _destroy: function () {
            if (this.model.displayInline)
                $(window).off("resize", $.proxy(this._OnWindowResize, this));
            if (this._isOpen)
                this.hide();
            this.sfCalendar && this.sfCalendar.remove();
            if (this.wrapper) {
                this.element.insertAfter(this.wrapper);
                this.wrapper.remove();
            }
            this.element.removeClass('e-datepicker e-input');
            this.element.removeAttr('aria-atomic aria-live aria-activedescendant aria-expanded role placeholder tabindex' );
            !this._cloneElement.hasAttribute("name") && this.element.removeAttr("name");
        },

        _init: function (options) {
            this._options = options;
            this._cloneElement = this.element.clone();
            this._dt_drilldown = false;
            this._ISORegex();
            this._initDisableObj(this.model.blackoutDates);
            this.animation = {
                open: { duration: 200 },
                close: { duration: 100 }
            };
            this._animating = false;
            this._isInputBox = this._isInputBox();
            this._isSupport = document.createElement("input").placeholder == undefined ? false : true;
            this._checkAttribute();
            this._setValues();
            this._createDatePicker();
            if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
                this.model.validationMessages = this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            if (options && options.value != undefined && options.value != this.element.val()) {
                this._trigger("_change", { value: this.element.val() });
            }
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

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
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
        _checkAttribute: function () {
            var attr = ["min", "max", "readonly", "disabled"], propName = ["minDate", "maxDate", "readOnly", "enabled"], value, propValue;
            for (var i = 0; i < attr.length; i++) {
                value = this.element.attr(attr[i]); propValue = propName[i];
                if (!ej.isNullOrUndefined(value)) {
                    if (ej.isNullOrUndefined(this._options))
                        this.model[propValue] = ((propValue != "enabled") && (propValue != "readOnly")) ? new Date(value) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                    else if (ej.isNullOrUndefined(this._options[propValue]))
                        this.model[propValue] = ((propValue != "enabled") && (propValue != "readOnly")) ? new Date(value) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                }
            }
        },
        _updateDateValue: function (value) {
            var date = this._checkDateObject(value);
            if (date != null) {
                this.isValidState = true;
                if (date == "") {
                    this.element.val("");
                    this.model.value = null;
                } else {
                    this.model.value = date;
                    this._preTxtValue = this.element.val(this._formatter(this.model.value, this.model.dateFormat));
                }
            }
            else {
                (typeof date === "string" && this.model.enableStrictMode) ? this.element.val(value) : this.element.val("");
                this.model.value = null;
                this.isValidState = (this.element.val() == "") ? true : false;
            }
            this._removeWatermark();
        },
        _ensureValue: function () {
            var dateValue = this._parseDate(this.element.val(), this.model.dateFormat);
            if (this.model.value)
                this._setDateValue(this.model.value);
            else if (dateValue)
                this._setDateValue(dateValue);
        },
        _changeEditable: function (bool) {
            var action = bool ? "_on" : "_off";
            if (this.element.is(":input")) {
                if (bool) {
                    if (!this.model.readOnly) this.element.attr("readonly", false);
                    this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
                }
                else {
                    if (!this.model.readOnly) this.element.attr("readonly", "readonly");
                    if (!this.model.displayInline) this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
                }
                this[action](this.element, "blur", this._onFocusOut);
                this[action](this.element, "focus", this._onFocusIn);
                this[action](this.element, "keydown", this._onKeyDown);
            }
        },
        _allowQuickPick: function (value) {
            $('.e-datepicker-headertext', this.sfCalendar)[value ? "on" : "off"]("click", $.proxy(this._forwardNavHandler, this));
        },
        _setRestrictDateState: function (value) {
            var action = value ? "addClass" : "removeClass";
            this.sfCalendar[action]("e-dp-restrict-show");
        },
        _setValues: function () {
            this.Date = new Date();
            this._id = this.element[0].id;
            this.isValidState = true;
            this._setCulture(this.model.locale);
            this._setMinDate(this.model.minDate);
            this._setMaxDate(this.model.maxDate);
            this._calendarDate = this._zeroTime(new Date());
            if (this.model.startDay < 0 || this.model.startDay > 6) this.model.startDay = 0;
            this.Date.firstDayOfWeek = this.model.startDay;
            this.Date.fullYearStart = '20';
            this._showHeader = true;
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "")
                this.model.value = this.element[0].value;
            this._validateMinMaxDate();
            this._dateValue = new Date(this._calendarDate.toString());
            this._isIE7 = this._checkIE7();
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            this._isIE9 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "9.0") ? true : false;
            // this variable is set to true in DateTimePicker control
            this._getInternalEvents = false;
            this._flag = true;
            this._ejHLWeekEnd = false;
            this._isOpen = false;
            this._prevDate = null;
            this._preValue = null;
            this._isFocused = false;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled") proxy.disable();
                else if (keyName == "readOnly") proxy.model.readOnly = true;
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);

            });
        },
        _createDatePicker: function () {
            this._createWrapper();
            this._wireEvents();
            if (this.model.displayInline) {
                this.show();
            }
            if (this.model.enableRTL) this._setRTL(true);
            if (this.model.showRoundedCorner) this._setRoundedCorner(true);
        },
        _checkNameAttr: function () {
            if (!this.element.attr("name") && this._isInputBox)
                this.element.attr("name", this.element[0].id);
            if (this.model.displayInline && !this._isInputBox)
                this._hiddenInput.attr("name", this.element[0].id);
        },
        _createWrapper: function () {
            this._getMapper();
            if (this.model.specialDates)
                this._createSpecialDateObject();
			if(!this.element[0].hasAttribute("tabindex"))this.element.attr("tabindex","0");
            if (this._isInputBox) {
			    this.element.addClass("e-input").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive','aria-activedescendant': 'null', 'aria-expanded':'false','role':'combobox' });
                this.wrapper = ej.buildTag("span.e-datewidget e-widget " + this.model.cssClass);
                this.wrapper.attr("style", this.element.attr("style"));
                this.element.removeAttr('style');
                if (!ej.isTouchDevice()) this.wrapper.addClass('e-ntouch');
                this.innerWrapper = ej.buildTag("span.e-in-wrap e-box e-padding");
                this.wrapper.append(this.innerWrapper).insertBefore(this.element);
                this.innerWrapper.append(this.element);
                this.dateIcon = ej.buildTag("span.e-select#" + this._id + "-img", "", {}, (this._isIE8) ? { 'unselectable': 'on' } : {})
                    .append(ej.buildTag("span.e-icon e-calendar", "", {}, { 'aria-label': 'Select' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})).insertAfter(this.element);
            }
            if (!this._isSupport || (this.model.displayInline && !this._isInputBox)) {
                this._hiddenInput = ej.buildTag("input.e-input e-placeholder ", "", {}, { type: "text" }).insertAfter(this.element);
                if (this._isInputBox) this._hiddenInput.val(this._localizedLabels.watermarkText);
                this._hiddenInput.css("display", "block");
                var proxy = this;
                $(this._hiddenInput).focus(function () {
                    proxy.element.focus();
                });
            }
            this._checkNameAttr();
            if (!this.model.height) this.model.height = this.element.attr("height"); if (!this.model.width) this.model.width = this.element.attr("width");
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
            if (this._id)
                $("#e-" + this._id).remove();
            this._setDateValue(this.model.value);
            this._preValue = this._parseDate(this.element.val(), this.model.dateFormat);
            this._setWaterMark();
            this._dateValue = new Date(this._calendarDate.toString());
            if (this.model.displayInline) this._renderPopup();
            else if (this._isInputBox) this._renderDateIcon(this.model.showPopupButton, false);
            if (this.model.readOnly) this._disbleMaualInput();
            if (!this.model.enabled) this.disable();
            else if (this.model.enabled && $(this.element).hasClass("e-disable")) this.enable();
            this._layoutChanged();
            this._checkErrorClass();
            this._addAttr(this.model.htmlAttributes);
        },
        _isInputBox: function () {
			if(this.element.is("input[type=date]")) this.element.attr('type',"text");
            return (this.element.is("input") && (this.element.is("input[type=text]") || !this.element.attr('type')));
        },

        _renderDateIcon: function (bool, reRender) {
            if (reRender && this.model.showPopupButton == bool) return;
            if (!bool && this.dateIcon) {
                this._bindInputEvent();
                this.dateIcon.css('display', 'none');
                this.innerWrapper.removeClass('e-padding');
            }
            else {
                if (this.innerWrapper) {
                    this.innerWrapper.addClass('e-padding');
                    this.dateIcon.css('display', 'block');
                }
                if (!this.model.displayInline)
                    this._bindDateButton();
            }
            this.model.showPopupButton = bool;
        },

        _resizeCalender: function () {
            if ((this.model.dayHeaderFormat == "short") || (this.model.dayHeaderFormat == "min") || (this.model.dayHeaderFormat == "none"))
                this.sfCalendar.removeClass("e-headerlong");
            else if (this.model.dayHeaderFormat == "long") {
                this.sfCalendar.addClass("e-headerlong");
            }
        },

        _setWidth: function (value) {
            if (value) {
                if (this.wrapper) this.wrapper.width(value);
                else this.element.width(value);
            }
            else
                this.model.width = this.wrapper ? this.wrapper.outerWidth() : this.element.width();
        },
        _setHeight: function (value) {
            if (value) {
                if (this.wrapper) this.wrapper.height(value);
                else this.element.height(value);
            }
            else
                this.model.height = this.wrapper ? this.wrapper.outerHeight() : this.element.height();
            if (this._isIE7) this.element.height(this.innerWrapper.height());
        },
        _setRTL: function (isRTL) {
            if (isRTL) {
                if (this.wrapper) {
                    this.wrapper.addClass("e-rtl");
                }
                this.sfCalendar && this.sfCalendar.addClass("e-rtl");
            }
            else {
                if (this.wrapper) {
                    this.wrapper.removeClass("e-rtl");
                }
                this.sfCalendar && this.sfCalendar.removeClass("e-rtl");
            }
        },
        _setRoundedCorner: function (bool) {
            if (bool) {
                if (this.innerWrapper)
                    this.innerWrapper.addClass("e-corner");
                this.sfCalendar && this.sfCalendar.addClass("e-corner");
            }
            else {
                if (this.innerWrapper)
                    this.innerWrapper.removeClass("e-corner");
                this.sfCalendar && this.sfCalendar.removeClass("e-corner");
            }
        },

        _refreshDatepicker: function () {
            if (this._stopRefresh) {
                this._stopRefresh = false
                return;
            }
            var _currentVal = this.element.val();
            //  For checking the year maximum range....
            if (this._specificFormat() && this._formatter(this._preValue, this.model.dateFormat, this.model.locale) != _currentVal)
                var currentValue = this._parseDate(_currentVal, true);
            else var currentValue = this._parseDate(_currentVal);
            currentValue = this._validateYearValue(currentValue);
            this._setDateValue(currentValue);
            if (this._specificFormat() && this._compareDate(this.model.value, this._calendarDate))
                this.element.val(_currentVal)
            $(".e-datepicker-headertext", this.sfCalendar).text(this._formatter(this._calendarDate, this.model.headerFormat));
            this._resizeCalender();
            this._dateValue = new Date(this._calendarDate.toString());
            this._hoverDate = this._calendarDate.getDate() - 1;
            this._renderCalendar(this, this._dateValue);
            this._setFooterText(this._localizedLabels.buttonText);
            this._enableFooter(this.model.showFooter);
            this._layoutChanged();
        },
        _validateYearValue: function (value) {
            if (value != null) {
                var twoDigitYearMax = ej.preferredCulture(this.model.locale).calendars.standard.twoDigitYearMax;
                twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
                if (this._calendarDate.getFullYear() - value.getFullYear() == 100) {
                    if (this._calendarDate.getFullYear() > twoDigitYearMax)
                        value.setFullYear(this._calendarDate.getFullYear())
                }
            }
            return value;
        },
        _setFooterText: function (footerText) {
            $('.e-footer-text', this.sfCalendar).html(footerText);
        },
        _setSkin: function (skin) {
            if (this.wrapper) {
                this.wrapper.removeClass(this.model.cssClass);
                this.wrapper.addClass(skin);
            }
            else {
                this.element.removeClass(this.model.cssClass);
                this.element.addClass(skin);
            }
            this.sfCalendar.removeClass(this.model.cssClass);
            this.sfCalendar.addClass(skin);
        },
        _setDisplayInline: function (isDisplayInline) {
            this.model.displayInline = isDisplayInline;
            if (isDisplayInline && this._isInputBox) {
                this.sfCalendar.insertAfter(this.wrapper);
                this._setDatePickerPosition();
            }
            else if (isDisplayInline) {
                this.element.append(this.sfCalendar);
                if (!this._isSupport || !this._isInputBox) this._hiddenInput.css("display", "none");
            }
            else {
                this.sfCalendar.css('display', 'none');
                $('body').append(this.sfCalendar);
                this._isOpen = false;
            }
            if (isDisplayInline) {
                this.show();
                this._off(this.dateIcon, "mousedown", this._showDatePopUp);
                this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
            }

        },

        _disbleMaualInput: function () {
            if (this.model.readOnly) {
                $(this.element).attr("readonly", "readonly");
                if (!this.model.displayInline) this.hide();
            }
            else if (this.model.allowEdit)
                $(this.element).prop("readonly", false);

        },
        _checkDateObject: function (date, val) {
            if (!date || (typeof JSON === "object" && JSON.stringify(date) === "{}")) return date = null;
            else if (!(date instanceof Date)) {
                if (this._specificFormat())
                    var val = this._parseDate(date, true);
                else
                    var val = this._parseDate(date, val);
                date = val ? val : (val = this._checkJSONString(date)) ? val : null;
            }
            if (!isNaN(Date.parse(date))) {
                this._dateValue = this._calendarDate = this._zeroTime(date)
                if (this._validateDate(date))
                    return this._dateValue;
            }
            return null;
        },
        _checkJSONString: function(date) {
            // Validate the string value
            if (!isNaN(Date.parse(date))) {
                if ((new Date(date).toJSON() === date) || (new Date(date).toDateString() === date) || (new Date(date).toGMTString() === date) ||
                    (new Date(date).toISOString() === date) || (new Date(date).toLocaleString() === date) ||
                    (new Date(date).toString() === date) || (new Date(date).toUTCString() === date)) {
                    if (this.model.timeZone) {
                        return new Date(new Date(date).getTime() + (ej.serverTimezoneOffset * 60 * 60 * 1000));
                    } else {
                        if (date.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i) && date.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i).length > 0) {
                            date = date.split('T')
                            date = date[0];
                            return ej.parseDate(date, "yyyy-MM-dd", this.model.locale);
                        }
                    }
                } else if (typeof date == "string") return this._dateFromISO(date);
            }else if(this.model.enableStrictMode && ej.parseDate(date, this.model.value, this.model.locale) == null) return null; 
			else if (this._extISORegex.exec(date) || this._basicISORegex.exec(date)) return this._dateFromISO(date);
        },
        _dateFromISO: function (date) {
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
        _checkInstanceType: function (date) {
            date = this._stringToObject(date);
            if (!date) return null;
            else if (!(date instanceof Date)) {
                date = this._parseDate(date);
            }
            if (!isNaN(Date.parse(date))) return this._zeroTime(date);
            return null;
        },
        _stringToObject: function (value) {
            if (typeof value === "string") {
                var val = ej.parseDate(value, this.model.dateFormat, this.model.locale);
                value = (val != null) ? val : new Date(value);
            }
            return value;
        },
        _validateMinMaxDate: function () {
            var dateChange = false, valueExceed = false;
            if (this.model.maxDate < this.model.minDate) this.model.minDate = this.model.maxDate;
            if (!this.model.enableStrictMode) {
                if (this.model.value) {
                    if (this.model.value < this.model.minDate) {
                        this._calendarDate = this.model.value = this.model.minDate;
                        dateChange = true;
                    }
                    else if (this.model.value > this.model.maxDate) {
                        this._calendarDate = this.model.value = this.model.maxDate;
                        dateChange = true;
                    }
                }
                else {
                    this.element.val("");
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
                this.isValidState = true;
            }
            else {
                if (this.model.value) {
                    if (this.model.value < this.model.minDate) {
                        this._calendarDate = this.model.minDate;
                        this.isValidState = false;
                        valueExceed = true;
                    }
                    else if (this.model.value > this.model.maxDate) {
                        this._calendarDate = this.model.maxDate;
                        this.isValidState = false;
                        valueExceed = true;
                    }
                    else this.isValidState = true;
                }
                else {
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
            }
            if (dateChange) this.element.val(this._formatter(this.model.value, this.model.dateFormat));
            if (valueExceed && this._getInternalEvents) this._trigger("outOfRange");
        },
        _setCulture: function (culture) {
            this.culture = ej.preferredCulture(culture);
            if (this.culture) {
                this.model.locale = this.culture.name == "en" ? "en-US" : this.culture.name;
                this.Date.dayNames = this.culture.calendar.days.names;
                this.Date.dayNamesMin = this.culture.calendar.days.namesShort;
                this.Date.abbrDayNames = this.culture.calendar.days.namesAbbr;
                this.Date.monthNames = this.culture.calendar.months.names;
                this.Date.abbrMonthNames = this.culture.calendar.months.namesAbbr;
                this.Date.format = this.culture.calendar.patterns.d;
                if (this.model.dateFormat == '') this.model.dateFormat = this.culture.calendar.patterns.d;
                if (this.model.startDay == -1) this.model.startDay = this.culture.calendar.firstDay;
            }
            this._separator = this._getSeparator();
            this._localizedLabels = this._getLocalizedLabels();

            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
                if (!ej.isNullOrUndefined(this._options.buttonText))
                    this._localizedLabels.buttonText = this._options.buttonText;
            }
            this._localizedLabelToModel();
        },

        _localizedLabelToModel: function () {
            this.model.watermarkText = this._localizedLabels.watermarkText;
            this.model.buttonText = this._localizedLabels.buttonText;
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

        _setDatePickerPosition: function () {
            if (!this.model.displayInline || this._isInputBox) {
                var elementObj = this.element.is('input') ? this.wrapper : this.element;
                var pos = this._getOffset(elementObj), winLeftWidth, winRightWidth,
                winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
                winTopHeight = pos.top - $(document).scrollTop(),
                popupHeight = this.sfCalendar.outerHeight(),
                popupWidth = this.sfCalendar.outerWidth(),
                left = pos.left,
                totalHeight = elementObj.outerHeight(),
                border = (totalHeight - elementObj.height()) / 2,
                maxZ = this._getZindexPartial(), popupmargin = 3,
                topPos = (popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin; // popupmargin denotes space b/w the element and the popup.
                winLeftWidth = $(document).scrollLeft() + $(window).width() - left;
                winRightWidth = $(document).scrollLeft() + left + elementObj.width();
                if (this.model.enableRTL || popupWidth > winLeftWidth && (popupWidth < left + elementObj.outerWidth()) && !ej.isNullOrUndefined(this.wrapper))
                    left += this.wrapper.width() - this.sfCalendar.width();
                if (popupWidth > winRightWidth) left = pos.left;
                this.sfCalendar.css({
                    "left": left + "px",
                    "top": topPos + "px",
                    "z-index": maxZ
                });
            }
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.sfCalendar);
        },

        _setMinDate: function (d) {
            this.model.minDate = this._checkInstanceType(d);
            if (!this.model.minDate) {
                this.model.minDate = (new Date('11/31/1899'));
            }
        },

        _setMaxDate: function (d) {
            this.model.maxDate = this._checkInstanceType(d);
            if (!this.model.maxDate) {
                this.model.maxDate = (new Date('12/31/2099')); // using the JS Date.parse function which expects mm/dd/yyyy
            }
        },
        _setDateValue: function (date, val) {
            var newDate = this._checkDateObject(date, val);
            if (newDate != null) {
                this.isValidState = true;
                this.model.value = new Date(newDate.toString());
                if (!this.model.displayInline)
                    this.wrapper.addClass('e-valid');
                this._validateMinMaxDate();
                this._preTxtValue = this.element.val(this._formatter(this.model.value, this.model.dateFormat));
            }
            else {
                if (date instanceof Date) {
                    this._validateMinMaxDate();
                    date = this._formatter(date, this.model.dateFormat);
                }
                (this.model.enableStrictMode) ? this.element.val(date) : this.element.val(null);
                this.model.value = null; //updating model value as null to avoid the recursive call to this method
                if (!this.model.displayInline)
                    this.wrapper.removeClass('e-valid');
                this._triggerChangeEvent();
                this.isValidState = (this.element.val() == "" || ej.isNullOrUndefined(this.element.val())) ? true : false;
            }
            this._removeWatermark();
        },
        _updateInputVal: function () {
            var val = this._validateValue();
            if ((val != null || !this.model.enableStrictMode) && this.sfCalendar && this.sfCalendar.find('.e-datepicker-days').is(':visible'))
                this._refreshDatepicker();
        },
        _validateInputVal: function () {
            var val = this._validateValue();
            if (val != null) {
                if (!this.model.enableStrictMode) {
                    if (val <= this.model.maxDate && val >= this.model.minDate)
                        this.isValidState = true;
                    else {
                        this.model.value = null;
                        this.isValidState = true;
                    }
                }
            }
        },

        _validateValue: function () {
            if (this._specificFormat() && this.element.val() != this._formatter(this._preValue, this.model.dateFormat, this.model.locale))
                var value = this._parseDate(this.element.val(), true);
            else var value = this._parseDate(this.element.val());
            return this._validateYearValue(value);
        },
        _getSeparator: function () {
            var formats;
            if (this.culture) {
                formats = this.culture.calendar.patterns.d;
            }
            else formats = this.model.dateFormat;
            var regex = new RegExp("^[a-zA-Z0-9]+$");
            for (var i = 0; i < formats.length; i++) {
                if (!regex.test(formats[i])) return formats[i];
            }
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
        _isValidDate: function (dateObj) {
            return dateObj && typeof dateObj.getTime === "function" && isFinite(dateObj.getTime());
        },

        //Date formatter - Convert date object to specific date format
        _formatter: function (date, format) {
            var newFormat = this._checkFormat(format);
            return ej.format(date, newFormat, this.model.locale);
        },
        _parseDate: function (date, type) {
            var newFormat = this._checkFormat(this.model.dateFormat);
            var DateValue = date;
            if ((this._specificFormat()) && DateValue != undefined && date != "" && type != true && !(ej.format(ej.parseDate(DateValue, newFormat, this.model.locale), this.model.dateFormat, this.model.locale) == DateValue)) {
                return this._dateValue;
            }
            else return ej.parseDate(date, newFormat, this.model.locale);
        },
        _checkFormat: function (format) {
            var proxy = this;
            var dateFormatRegExp = this._regExp();
            return format.replace(dateFormatRegExp, function (match) {
                match = match === "/" ? ej.preferredCulture(proxy.model.locale).calendars.standard['/'] !== "/" ? "'/'" : match : match;
                return match;
            });
        },
        _regExp: function () {
            return /\/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|gg|g|"[^"]*"|'[^']*'|[/]/g;
        },

        isLeapYear: function (year) {
            return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        },
        //Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
        _zeroTime: function (date) {
            var newDate = typeof date === "string" ? this._parseDate(date) : new Date(date);
            newDate.setMilliseconds(0);
            newDate.setSeconds(0);
            newDate.setMinutes(0);
            newDate.setHours(0);
            return newDate;
        },

        _getDaysInMonth: function (date) {
            return [31, (this.isLeapYear(date) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
        },

        _addDays: function (d, number) {
            d.setDate(d.getDate() + number);
            return d;
        },

        _addYears: function (d, number) {
            d.setFullYear(d.getFullYear() + number);
            return d;
        },

        _addMonths: function (d, number) {
            var tempDatedateMonth = d.getDate();
            d.setMonth(d.getMonth() + number);
            if (tempDatedateMonth > d.getDate())
                this._addDays(d, -d.getDate());
            return d;
        },
        //Checks if the day is a weekend day (Sat or Sun).
        _isWeekend: function (date) {
            return date.getDay() == 0 || date.getDay() == 6;
        },

        _isSpecialDates: function (dates) {
            if (this.model.specialDates) {
                for (var i = 0; i < this.model.specialDates.length; i++) {
                    if (this.model.specialDates[i] && this.model.specialDates[i][this._mapField._date]) {
                        if (dates.getDate() == this.model.specialDates[i][this._mapField._date].getDate() && dates.getMonth() == this.model.specialDates[i][this._mapField._date].getMonth() && dates.getFullYear() == this.model.specialDates[i][this._mapField._date].getFullYear()) {
                            this._getIndex = i;
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        _getMapper: function () {
            var mapper = this.model.fields;
            this._mapField = {};
            this._mapField["_date"] = (mapper && mapper.date) ? mapper["date"] : "date";
            this._mapField["_tooltip"] = (mapper && mapper.tooltip) ? mapper["tooltip"] : "tooltip";
            this._mapField["_icon"] = (mapper && mapper.iconClass) ? mapper["iconClass"] : "iconClass";
            this._mapField["_custom"] = (mapper && mapper.cssClass) ? mapper["cssClass"] : "cssClass";
        },
        _createSpecialDateObject: function () {
            for (var i = 0; i < this.model.specialDates.length; i++) {
                this.model.specialDates[i][this._mapField._date] = this._checkInstanceType(this.model.specialDates[i][this._mapField._date]);
            }
        },

        _getMonthName: function (abbreviated, date) {
            return abbreviated ? this.Date.abbrMonthNames[date.getMonth()] : this.Date.monthNames[date.getMonth()];
        },



        _displayNewMonth: function (m, y) {
            this._setDisplayedMonth(this.displayedMonth + m, this.displayedYear + y, true);
            return false;
        },

        _setDisplayedMonth: function (m, y, rerender) {
            if (this.model.minDate == undefined || this.model.maxDate == undefined) {
                return;
            }
            var s = new Date(this.model.minDate.getTime());
            s.setDate(1);
            var e = new Date(this.model.maxDate.getTime());
            e.setDate(1);

            var t;
            if ((!m && !y) || (isNaN(m) && isNaN(y))) {

                t = this._zeroTime(new Date());
                t.setDate(1);
            } else if (isNaN(m)) {

                t = new Date(y, this.displayedMonth, 1);
            } else if (isNaN(y)) {

                t = new Date(this.displayedYear, m, 1);
            } else {

                t = new Date(y, m, 1);
            }

            if (t.getTime() < s.getTime()) {
                t = s;
            } else if (t.getTime() > e.getTime()) {
                t = e;
            }
            var oldMonth = this.displayedMonth;
            var oldYear = this.displayedYear;
            this.displayedMonth = t.getMonth();
            this.displayedYear = t.getFullYear();
            var tempDate = t;
            if (rerender && (this.displayedMonth != oldMonth || this.displayedYear != oldYear)) {
                this._renderCalendar(this, tempDate);
                this._dateValue = tempDate;
                this._trigger("monthChanged", [this.displayedMonth, this.displayedYear]);
            }
        },
        _clearSelected: function () {
            this.numSelected = 0;
            if (!ej.isNullOrUndefined(this.sfCalendar)) {
            if (this.model.highlightSection == "week") {
                $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().removeClass('e-selected-week');
            }
            else if (this.model.highlightSection == "month") {
                $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().parent().removeClass('e-selected-month');
            }
            else if (this.model.highlightSection == "workdays") {
                $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().removeClass('e-work-week');
            }
            else
                $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false);
            }

        },
        _addSelected: function () {
            if (this.model.highlightSection == "week") {
                $('td.e-active', this.sfCalendar).parent().addClass('e-selected-week');
            }
            else if (this.model.highlightSection == "month") {
                $('td.e-active, this.sfCalendar').parent().parent().addClass('e-selected-month');
            }
            else if (this.model.highlightSection == "workdays") {
                $('td.e-active', this.sfCalendar).parent().addClass('e-work-week');
            }
        },

        _hideOtherMonths: function (sfCalendar) {
            $('td.other-month', sfCalendar).css("visibility", "hidden");
        },
        _showOtherMonths: function (sfCalendar) {
            $('td.other-month', sfCalendar).css({ 'visibility': 'visible' });
        },
        _otherMonthsVisibility: function () {
            if (this.model.showOtherMonths)
                this._showOtherMonths(this.sfCalendar);
            else
                this._hideOtherMonths(this.sfCalendar);
        },

        _createCalender: function () {
            ej.buildTag("div.e-header").attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                    .append(ej.buildTag("span.e-prev").append(ej.buildTag('a.e-icon e-arrow-sans-left').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-datepicker-headertext").text(this._formatter(this._calendarDate, this.model.headerFormat)).attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .append(ej.buildTag("span.e-next").append(ej.buildTag('a.e-icon e-arrow-sans-right').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .appendTo(this.sfCalendar);
            this._enableHeader(this._showHeader);
            var table = ej.buildTag("table.e-dp-viewdays", "", {}).data("e-table", "data").attr({ 'role': 'grid'}).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this.sfCalendar.append(table);
            this._renderCalendar(this);
            this._startLevel(this.model.startLevel);
            ej.buildTag("div.e-footer")
                .append(ej.buildTag("span.e-footer-icon"))
                .append(ej.buildTag("span.e-footer-text"))
                .appendTo(this.sfCalendar);
            $('.e-footer-text', this.sfCalendar).html(this._localizedLabels.buttonText);
            this._enableFooter(this.model.showFooter);
        },
        _enableHeader: function (show) {
            if (show) $(".e-header", this.sfCalendar).show();
            else $(".e-header", this.sfCalendar).hide();
        },
        _enableFooter: function (show) {
            if (show) $('.e-footer', this.sfCalendar).show();
            else $('.e-footer', this.sfCalendar).hide();
            this._todayBtnDisable();
        },
        _todayBtnDisable: function () {
            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
            if (!(+this.model.minDate <= +today && +this.model.maxDate >= +today)) {
                $('.e-footer', this.sfCalendar).addClass('e-footer-disable')
            } else {
                $('.e-footer', this.sfCalendar).removeClass('e-footer-disable')
            }
        },
        _checkArrows: function (min, max) {
            this._preArrowCondition(min, this.model.minDate.getFullYear());
            this._nextArrowCondition(max, this.model.maxDate.getFullYear());
        },
        _checkDateArrows: function () {
            this._preArrowCondition(this._tempMinDate, this.model.minDate);
            this._nextArrowCondition(this._tempMaxDate, this.model.maxDate);
        },
        _preArrowCondition: function (val1, val2) {
            if (val1 <= val2) this.sfCalendar.find(".e-prev").addClass("e-disable").attr({ "aria-disabled": true });
            else this.sfCalendar.find(".e-prev").removeClass("e-disable").attr({ "aria-disabled": false });
        },
        _nextArrowCondition: function (val1, val2) {
            if (val1 >= val2) this.sfCalendar.find(".e-next").addClass("e-disable").attr({ "aria-disabled": true });
            else this.sfCalendar.find(".e-next").removeClass("e-disable").attr({ "aria-disabled": false });
        },

        _previousNextHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled || $(event.target).hasClass("e-disable") || $(event.currentTarget).hasClass("e-disable")) return false;
            event.preventDefault();
            var prevTable = $("table", this.sfCalendar), navFrom;
            navFrom = this._navigateFrom(prevTable);
            var element = ($(event.target).is('a')) ? $(event.target.parentNode) : $(event.target);
            var progress = element.hasClass('e-prev') ? true : false;
            this._processNextPrevDate(progress);
            var currentTable = $("table", this.sfCalendar), tClassName, navTo;
            tClassName = currentTable.get(0).className;
            switch (tClassName) {
                case "e-dp-viewdays": navTo = "month"; break;
                case "e-dp-viewmonths": navTo = "year"; break;
                case "e-dp-viewyears": navTo = "decade"; break;
                case "e-dp-viewallyears": navTo = "century"; break;
            }
            this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
        },
        _processNextPrevDate: function (progress) {
            if (this._DRPdisableFade) {
                var s = new Date(this.sfCalendar.find("td.current-month").attr("data-date"));
                this._dateValue = s;
            }
            if (progress && this.sfCalendar.find(".e-arrow-sans-left").hasClass("e-disable")) return false;
            else if (!progress && this.sfCalendar.find(".e-arrow-sans-right").hasClass("e-disable")) return false;

            var currentTable = $("table", this.sfCalendar), temp;
            var tClassName = currentTable.get(0).className;
            switch (tClassName) {
                case 'e-dp-viewdays':
                    var step = this.model.stepMonths;
                    if (progress) {
                        if (this._dateValue <= this.model.minDate) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (this._dateValue >= this.model.maxDate) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    this._addMonths(this._dateValue, (progress ? -step : step));
                    if (this._clickedDate)
                        this._calendarDate = this._clickedDate;
                    this._dateValue = this._dateValue < this.model.minDate ? new Date(this.model.minDate.toString()) : this._dateValue;
                    this._dateValue = this._dateValue > this.model.maxDate ? new Date(this.model.maxDate.toString()) : this._dateValue;
                    this._renderCalendar(this, this._dateValue);
                    $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat));
                    this._addFocus('day', this._hoverDate);
                    var dateRange = this._findFirstLastDay(new Date(this._dateValue.toString()));
                    this._preArrowCondition(dateRange.firstDay, this.model.minDate);
                    this._nextArrowCondition(dateRange.lastDay, this.model.maxDate);
                    break;
                case 'e-dp-viewmonths':
                    var dateValue = this._dateValue;
                    dateValue.setFullYear($('.e-datepicker-headertext', this.sfCalendar).text())
                    if (progress) {
                        if (dateValue.getFullYear() <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (dateValue.getFullYear() >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    this._addYears(dateValue, (progress ? -1 : 1));
                    this._renderCalendar(this, dateValue);
                    temp = dateValue.getFullYear();
                    $('.e-datepicker-headertext', this.sfCalendar).text(temp);
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-months').hide();
                    $($(currentTable).find('.e-datepicker-months')).show();
                    this._addFocus('month', this._hoverMonth);
                    this._checkArrows(temp, temp);
                    break;
                case 'e-dp-viewyears':
                    var yearValue;
                    yearValue = this._dateValue
                    yearValue.setFullYear($(currentTable).find(".e-state-hover").text());
                    if (progress) {
                        if (parseInt(this.popup.find('td.e-year-first:first').text()) <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (parseInt($('td.e-year-last:first').prev().text()) >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    if (($(currentTable).find(".e-state-hover").hasClass('e-year-first') && progress) || ($(currentTable).find(".e-state-hover").hasClass('e-year-last') && !progress))
                        this._dateValue.setFullYear(yearValue.getFullYear());
                    else if (($(currentTable).find(".e-state-hover").hasClass('e-year-first') && !progress))
                        this._dateValue.setFullYear(yearValue.getFullYear() + 11);
                    else if (($(currentTable).find(".e-state-hover").hasClass('e-year-last') && progress))
                        this._dateValue.setFullYear(yearValue.getFullYear() - 11);
                    else
                        this._dateValue.setFullYear(yearValue.getFullYear() + (progress ? -10 : 10));
                    this._renderCalendar(this, this._dateValue);
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 10) + 1);
                    $(".e-datepicker-headertext", this.sfCalendar).text((setYear + 1) + ' - ' + (setYear + 10));
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-years').hide();
                    $($(currentTable).find('.e-datepicker-years')).show();
                    this._addFocus('year', this._hoverYear + (!($('.e-year-first.e-hidedate').length) ? 0 : -1));
                    this._checkArrows(setYear + 1, setYear + 10);
                    break;
                case 'e-dp-viewallyears':
                    var headYears;
                    if (progress) {
                        headYears = parseFloat($('td.e-allyear-first', currentTable.get(0)).text().split('-')[1]);
                        if (headYears <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        } else {
                            this._flag = true;
                        }

                    } else {
                        headYears = parseFloat($('td.e-allyear-last', currentTable.get(0)).prev().text().split('-')[1]);
                        if (headYears >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        } else
                            this._flag = true;
                    }
                    this._dateValue.setFullYear((!(this._lastHoveredYear) ? this._dateValue.getFullYear() : this._lastHoveredYear) + (progress ? -100 : 100));
                    this._lastHoveredYear = this._dateValue.getFullYear();
                    this._renderCalendar(this, this._dateValue);
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 100) + 1);
                    temp = parseFloat($('td.e-allyear-last', currentTable.get(0)).prev().text().split('-')[1]);
                    $('.e-datepicker-headertext', this.sfCalendar).text((setYear + 1) + ' - ' + temp);
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-allyears').hide();
                    $($(currentTable).find('.e-datepicker-allyears')).show();
                    this._addFocus('allyear', this._hoverAllYear + (!($('.e-allyear-first.e-hidedate').length) ? 0 : -1));
                    this._checkArrows(setYear + 1, temp);
                    break;
            }
            this._layoutChanged();
        },
        _addFocus: function (selection, index) {
            var cls = 'e-current-' + selection;
            if (selection == 'day') cls = 'current-month';
            var items = this.sfCalendar.find('tbody tr td.' + cls);
            if (selection == "month") {
                $(items).each(function (i, ele) {
                    if (parseInt($(ele).attr("data-index")) == parseInt(index)) {
                        index = i;
                        return;
                    }
                });
            }
            var cell = items[index];
            if (!cell) cell = items.last();
            this.sfCalendar.find('table td').removeClass("e-state-hover");
            $(cell).addClass("e-state-hover");
            this._setActiveState(selection);
            return index;
        },
        _setActiveState: function (selection) {
            if (!(this.model.value instanceof Date)) return;
            var items = this.sfCalendar.find('tbody tr td.e-current-' + selection), cell, proxy = this;
            var indx = -1;
            switch (selection) {
                case "month":
                    if (this.model.value.getFullYear() === parseInt($('.e-text', this.sfCalendar).text())) {
                        $(items).each(function (i, ele) {
                            if (parseInt($(ele).attr("data-index")) == parseInt(proxy.model.value.getMonth())) {
                                indx = i;
                                return;
                            }
                        });
                    }
                    break;
                case "year":
                    var value = this.model.value.getFullYear();
                    $(items).each(function (i, ele) {
                        if (parseInt(ele.innerHTML) == parseInt(value)) {
                            indx = i;
                            return;
                        }
                    });
                    break;
                case "allyear":
                    var start = parseInt(this.model.value.getFullYear()) - ((parseInt(this.model.value.getFullYear()) % 10) + 1);
                    var active = (start + 1) + ' - ' + (start + 10);
                    $(items).each(function (i, ele) {
                        if (parseInt(ele.innerHTML) == parseInt(active)) {
                            indx = i;
                            return;
                        }
                    });
                    break;
            }
            cell = items[indx];
            if (cell) {
                this.sfCalendar.find('table td').removeClass("e-active");
                if (!$(cell).hasClass('e-hidedate'))
                    $(cell).addClass("e-active");
            }
        },
        _setFocusByName: function (name, value) {
            var allValues = this.sfCalendar.find('tbody tr td.e-current-' + name), index, cell;
            $(allValues).each(function (i, ele) {
                if (parseInt(ele.innerHTML) == parseInt(value)) {
                    index = i;
                    return;
                }
            });
            cell = allValues[index];
            if (!cell) cell = allValues.last();
            this.sfCalendar.find('table td').removeClass("e-state-hover");
            $(cell).addClass("e-state-hover");
            this._setActiveState(name);
            return index;
        },
        _getHeaderTxt: function () {
            return this.sfCalendar.find(".e-datepicker-headertext").text();
        },
        _findFirstLastDay: function (value) {
            var y = value.getFullYear(), m = value.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);
            return { firstDay: firstDay, lastDay: lastDay }
        },
        _forwardNavHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (event) event.preventDefault();

            var currentTable = $("table", this.sfCalendar);
            var tclassName = $("table", this.sfCalendar).get(0).className, proxy = this, headerTxt, navTo;
            var navFrom = this._navigateFrom(currentTable);
            switch (tclassName) {
                case 'e-dp-viewdays':
                    this._hoverMonth = this._getDateObj(currentTable.find(".e-state-hover")).getMonth() ||
                                this._getDateObj(currentTable.find(".e-active")).getMonth() || 0;
                    if (this._DRPdisableFade) {
                        this._renderCalendar(this, this._calendarDate);
                        $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat));
                    }
                    this._startLevel("year"); navTo = "year";
                    this._addFocus('month', this._hoverMonth);
                    break;
                case 'e-dp-viewmonths':
                    headerTxt = this._getHeaderTxt();
                    this._startLevel("decade"); navTo = "decade";
                    this._hoverYear = this._setFocusByName('year', headerTxt);
                    break;
                case 'e-dp-viewyears':
                    headerTxt = this._getHeaderTxt();
                    this._startLevel("century"); navTo = "century";
                    this._hoverAllYear = this._setFocusByName('allyear', headerTxt);
                    break;
            }
            if (navFrom != "century") this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
            this._layoutChanged();
        },
        _cellSelection: function () {
            var currentTable = $("table", this.sfCalendar);
            var tclassName = $("table", this.sfCalendar).get(0).className;
            switch (tclassName) {
                case 'e-dp-viewmonths':
                    this._hoverMonth = this._addFocus('month', this._dateValue.getMonth());
                    break;
                case 'e-dp-viewyears':
                    var dateValue = new Date(this._dateValue.toString());
                    // Navigate to Prev/Next year Calendar while selecting the first/last year in the calendar view.
                    this._navigationToPrevNext('year');
                    // Reasssign the old value
                    this._dateValue = dateValue;
                    this._hoverYear = this._setFocusByName('year', this._dateValue.getFullYear());
                    break;
                case 'e-dp-viewallyears':
                    var dateValue = new Date(this._dateValue.toString());
                    // Navigate to Prev/Next year Calendar while selecting the first/last year in the calendar view.
                    this._navigationToPrevNext('allyear');
                    // Reasssign the old value
                    this._dateValue = dateValue;
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 10) + 1);
                    this._hoverAllYear = this._setFocusByName('allyear', setYear + 1 + ' - ' + setYear + 10);
                    break;
            }
            this._layoutChanged();
        },
        _navigationToPrevNext: function (name) {
            var allValues = this.sfCalendar.find('tbody tr td.e-current-' + name), index, cell;
            var value = this._dateValue.getFullYear();
            $(allValues).each(function (i, ele) {
                if (parseInt(ele.innerHTML) == parseInt(value)) {
                    index = i;
                    return;
                }
            });
            cell = allValues[index];
            if (cell) {
                if ($(cell).hasClass('e-' + name + '-last'))
                    this._processNextPrevDate(false)
                else if ($(cell).hasClass('e-' + name + '-first'))
                    this._processNextPrevDate(true);
            }
        },
        _navigateFrom: function (prevTable) {
            var tPrevClassName = prevTable.get(0).className, navFrom;
            switch (tPrevClassName) {
                case "e-dp-viewdays": navFrom = "month"; break;
                case "e-dp-viewmonths": navFrom = "year"; break;
                case "e-dp-viewyears": navFrom = "decade"; break;
                case "e-dp-viewallyears": navFrom = "century"; break;
            }
            return navFrom;
        },
        _backwardNavHandler: function (event) {
            this._animating = true;
            if (this.model.readOnly || !this.model.enabled) return false;
            var element;
            if (event.type) {
                event.preventDefault();
                element = $(event.currentTarget);
            }
            else element = event;
            var cTable = $("table", this.sfCalendar), temp;
            var tclassName = $("table", this.sfCalendar).get(0).className, proxy = this, navTo;
            var navFrom = this._navigateFrom(cTable);
            switch (tclassName) {
                case 'e-dp-viewmonths':
                    cTable.removeClass("e-dp-viewmonths").addClass("e-dp-viewdays");
                    this._lastHoveredMonth = parseInt($(element).attr('data-index'));
                    this._dateValue = new Date(this._dateValue.getFullYear(), this._lastHoveredMonth, 1);
                    if (this._DRPdisableFade) this._trigger("_month_Loaded", { currentTarget: event.currentTarget });
                    this._renderCalendar(this, this._dateValue);
                    $('tbody', cTable).not('.e-datepicker-days,.e-week-header').hide();
                    $($(cTable).find('.e-datepicker-days,.e-week-header')).fadeIn("fast", function () {
                        proxy._addFocus('day', proxy._hoverDate || 0);
                        proxy._animating = false;
                    });
                    $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat)); navTo = "month";
                    break;
                case 'e-dp-viewyears':
                    cTable.removeClass("e-dp-viewyears").addClass("e-dp-viewmonths");
                    this._lastHoveredYear = parseInt(element.text());
                    this._dateValue.setFullYear(this._lastHoveredYear);
                    this._renderCalendar(this, this._dateValue);
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-months').hide();
                    if (ej.isNullOrUndefined(this._hoverMonth) && !ej.isNullOrUndefined(this._dateValue)) this._hoverMonth = this._dateValue.getMonth();
                    $($(cTable).find('.e-datepicker-months')).fadeIn("fast", function () {
                        proxy._addFocus('month', proxy._hoverMonth || 0);
                        proxy._animating = false;
                    });
                    temp = element.text();
                    $('.e-datepicker-headertext', this.sfCalendar).text(temp);
                    this._checkArrows(temp, temp); navTo = "year";
                    break;
                case 'e-dp-viewallyears':
                    var headYears = element.text().split('-');
                    cTable.removeClass("e-dp-viewallyears").addClass("e-dp-viewyears");
                    if (headYears[0] < this.model.minDate.getFullYear()) headYears[0] = this.model.minDate.getFullYear().toString();
                    else if (headYears[0] > this.model.maxDate.getFullYear()) headYears[0] = this.model.maxDate.getFullYear().toString();
                    this._renderCalendar(this, (new Date(headYears[0], 0, 1)));
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-years').hide();
                    $($(cTable).find('.e-datepicker-years')).fadeIn("fast", function () {
                        proxy._addFocus('year', proxy._hoverYear || 0);
                        proxy._animating = false;
                    });
                    $('.e-datepicker-headertext', this.sfCalendar).text(headYears[0] + ' - ' + headYears[1]);
                    this._checkArrows(headYears[0], headYears[1]); navTo = "decade";
                    this._dateValue = new Date(this._dateValue.setFullYear(parseInt($.trim(headYears[0])) + ((!this._lastHoveredYear) ? this._dateValue.getFullYear() % 10 : this._lastHoveredYear % 10)));
                    break;
                default:
                    this._clearSelected();
                    this.sfCalendar.find('table td').removeClass("e-state-hover");
                    element.not('td.other-month.e-hidedate').addClass('e-active').attr('aria-selected', true);
                    this._addSelected();

                    this._hoverDate = this._getDateObj(element).getDate() - 1;
                    this._dateValue = new Date(element.attr('data-date'));
                    this._clickedDate = new Date(element.attr('data-date'));
                    this._animating = false;
                    break;
            }
            if (navFrom != "month") this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
            this._layoutChanged();
        },

        _startLevel: function (start) {
            var cTable = $("table", this.sfCalendar);
            var headerText = $(".e-datepicker-headertext", this.sfCalendar), s, e;
            var dateValue = this._dateValue;
            switch (start) {
                case "decade":
                    cTable.removeClass("e-dp-viewallyears e-dp-viewmonths e-dp-viewdays").addClass("e-dp-viewyears");
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-years').hide();
                    $($(cTable).find('.e-datepicker-years')).show();
                    if (this.model.enableStrictMode && this._calendarDate < this._dateValue) dateValue = this._calendarDate;
                    else dateValue = dateValue;
                    var setYear = parseInt(dateValue.getFullYear()) - ((parseInt(dateValue.getFullYear()) % 10) + 1);
                    s = setYear + 1;
                    e = setYear + 10;
                    headerText.text(s + ' - ' + e);
                    this._checkArrows(s, e);
                    this._hoverYear = this._setFocusByName('year', dateValue.getFullYear());
                    break;
                case "century":
                    if (!(this._calendarDate < this._dateValue)) this._renderCalendar(this, dateValue);
                    cTable.removeClass("e-dp-viewyears e-dp-viewdays e-dp-viewmonths").addClass("e-dp-viewallyears");
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-allyears').hide();
                    $($(cTable).find('.e-datepicker-allyears')).show();
                    s = parseFloat($('td.e-allyear-first', cTable.get(0)).text().split('-')[1]) + 1;
                    e = parseFloat($('td.e-allyear-last', cTable.get(0)).prev().text().split('-')[1]);
                    var headYears = s + ' - ' + e;
                    headerText.text(headYears);
                    this._checkArrows(s, e);
                    var setYear = parseInt(dateValue.getFullYear()) - ((parseInt(dateValue.getFullYear()) % 10) + 1);
                    this._hoverAllYear = this._setFocusByName('allyear', (setYear + 1) + ' - ' + (setYear + 10));
                    break;
                case "year":
                    cTable.removeClass("e-dp-viewyears e-dp-viewallyears e-dp-viewdays").addClass("e-dp-viewmonths");
                    $('tbody,tr.e-week-header', cTable).hide();
                    $($(cTable).find('.e-datepicker-months')).show();
                    if (this.model.enableStrictMode && this._calendarDate < this._dateValue) s = this._calendarDate.getFullYear();
                    else s = dateValue.getFullYear();
                    headerText.text(s);
                    this._checkArrows(s, s);
                    this._hoverMonth = dateValue.getMonth();
                    this._addFocus('month', this._hoverMonth);
                    break;
                case "month":
                    cTable.removeClass("e-dp-viewyears e-dp-viewallyears e-dp-viewmonths").addClass("e-dp-viewdays ");
                    break;
            }
        },
        _depthLevel: function (depth) {
            var calendarTable = this.sfCalendar;
            switch (depth) {
                case "year":
                    $(calendarTable.find('.e-current-year,.e-current-allyear')).on("click", $.proxy(this._backwardNavHandler, this));
                    this._on($('.e-current-month', this.sfCalendar), "click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "decade":
                    $(calendarTable.find('.e-current-allyear')).on("click", $.proxy(this._backwardNavHandler, this));
                    $('.e-current-year', this.sfCalendar).on("click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "century":
                    $(calendarTable.find('.e-current-allyear')).on("click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "month":
                    this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                    this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
            }
        },
        _onDepthSelectHandler: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if ($(e.target).hasClass("e-current-month"))
                this._dateValue = new Date(this._dateValue.setMonth(parseInt(e.target.attributes["data-index"].value)));
            else if ($(e.target).hasClass("e-current-year"))
                this._dateValue = new Date(this._dateValue.setFullYear(parseInt(e.target.innerHTML)));
            else if ($(e.target).hasClass("e-current-allyear"))
                this._dateValue = new Date(this._dateValue.setFullYear(parseInt(e.target.innerHTML)));
            this._onSetCancelDateHandler(e);
        },

        _datepickerMonths: function (tbody, calendarTable, currentDate) {
            var dc = function (a) {
                return document.createElement(a);
            };
            var month = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(dc('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(dc('td'))
                        .addClass('e-current-month e-state-default')
                        .attr({ 'data-index': month }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .html(this.Date.abbrMonthNames[month++]);
                    if (currentDate.getFullYear() < this.model.minDate.getFullYear() || currentDate.getFullYear() > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-month');
                    }
                    else if ((currentDate.getFullYear() <= this.model.minDate.getFullYear() && month < this.model.minDate.getMonth() + 1) ||
                        (currentDate.getFullYear() >= this.model.maxDate.getFullYear() && month > this.model.maxDate.getMonth() + 1)) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-month');
                    }
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
            var s = currentDate.getFullYear();
            this._checkArrows(s, s);
        },

        _datepickerYears: function (tbody, calendarTable, currentYear) {
            var dc = function (a) {
                return document.createElement(a);
            };
            var Year = parseInt(currentYear) - ((parseInt(currentYear) % 10) + 1);
            var years = [];
            for (var j = 0; j < 12; j++) {
                years.push(Year + j);
            }
            var year = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(dc('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(dc('td'));
                    td.attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    if (year == 0)
                        td.addClass('e-year-first e-current-year ');
                    else if (year == 11)
                        td.addClass('e-year-last e-current-year ');
                    else
                        td.addClass('e-current-year e-state-default');
                    if (years[year] < this.model.minDate.getFullYear() || years[year] > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-year');
                    }
                    td.html(years[year++]);
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
            this._checkArrows(years[0], years[years.length]);
        },

        _datepickerAllYears: function (tbody, calendarTable, currentYear) {
            var Year = parseInt(currentYear) - ((parseInt(currentYear) % 100) + 10);
            var headYear = Year;
            var years = [], newline = this._isIE8 || this._isIE9 ? "" : "\n";

            for (var j = 0; j < 12; j++) {
                years.push(parseInt(Year) + " -" + newline + parseInt(Year + 9));
                Year = Year + 10;
            }
            var year = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(document.createElement('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(document.createElement('td'));
                    td.attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    if (year == 0)
                        td.addClass('e-allyear-first e-current-allyear ');
                    else if (year == 11)
                        td.addClass('e-allyear-last e-current-allyear ');
                    else
                        td.addClass('e-current-allyear e-state-default');
                    if (parseInt(years[year].split('-\n')[1]) < this.model.minDate.getFullYear() || parseInt(years[year].split('-\n')[0]) > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-allyear');
                    }
                    td.html(years[year++]);
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
        },
        _renderHeader: function (dpObject) {
            var thead = $(document.createElement('thead'));
            var cultureObj = ej.preferredCulture(this.model.locale).calendars.standard.days;
            if (dpObject.model.dayHeaderFormat != "none") {
                var headRow = ej.buildTag("tr.e-week-header").attr({ 'role': 'row' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                if (this.model.weekNumber == true) {
                    var WeekCulture = ej.preferredCulture(this.model.locale).calendars.standard.week;
                    var day = WeekCulture.name;
                    var headerday;
                    if (dpObject.model.dayHeaderFormat == "short")
                        headerday = WeekCulture.nameAbbr;
                    else if (dpObject.model.dayHeaderFormat == "long") headerday = week;
                    else headerday = WeekCulture.nameShort;
                    var tr = ej.buildTag("th", "", {}, { 'scope': 'col', 'abbr': day, 'data-date': day, 'title': this._formatter(day, "dddd") }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .html(headerday);
                    headRow.append(tr);
                }
                for (var i = this.Date.firstDayOfWeek; i < this.Date.firstDayOfWeek + 7; i++) {
                    var weekday = i % 7;
                    var day = cultureObj.names[weekday];
                    var headerday;
                    if (dpObject.model.dayHeaderFormat == "short")
                        headerday = cultureObj.namesAbbr[weekday];
                    else if (dpObject.model.dayHeaderFormat == "long") headerday = day;
                    else headerday = cultureObj.namesShort[weekday];
                    var th = ej.buildTag("th", "", {}, { 'scope': 'col', 'abbr': day, 'data-date': day, 'title': this._formatter(day, "dddd"), 'class': (weekday == 0 || weekday == 6 ? 'e-week-end' : 'e-week-day') }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                            .html(headerday);
                    headRow.append(th);
                }
            };
            return thead.append(headRow);
        },

        _renderCalendar: function (dpObject, date) {
            var proxy = this, today;
            dpObject = $.extend({}, ej.DatePicker.prototype.defaults, dpObject);
            this.Date.firstDayOfWeek = this.model.startDay;
            if (date) today = date;
            else if (this._calendarDate) today = this._calendarDate;
            else today = proxy._zeroTime(new Date());
            var calendarTable = $('table', this.sfCalendar);
            calendarTable.empty();

            calendarTable.append(this._renderHeader(dpObject));

            var tbody = ej.buildTag('tbody.e-datepicker-allyears', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._datepickerAllYears(tbody, calendarTable, today.getFullYear());

            tbody = ej.buildTag("tbody.e-datepicker-years", "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._datepickerYears(tbody, calendarTable, today.getFullYear());
            var month = dpObject.model.month == undefined ? today.getMonth() : dpObject.model.month;
            var year = dpObject.model.year || today.getFullYear();
            var currentDate = (new Date(year, month, 1, 0, 0, 0));
            var firstDayOffset = this.Date.firstDayOfWeek - currentDate.getDay() + 1;
            if (firstDayOffset > 1) firstDayOffset -= 7;
            var weeksToDraw = Math.ceil(((-1 * firstDayOffset + 1) + this._getDaysInMonth(currentDate)) / 7);
            this._addDays(currentDate, (firstDayOffset - 1));
            var newdate = proxy._zeroTime(new Date());
            var selected = this._calendarDate;
            tbody = ej.buildTag('tbody.e-datepicker-months', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});

            this._datepickerMonths(tbody, calendarTable, today);

            tbody = ej.buildTag('tbody.e-datepicker-days', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            var w = 0, _first = true, _last = true;
            while (w++ < weeksToDraw) {
                var r = jQuery(document.createElement('tr')).attr({'role':'row'});
                if (this.model.weekNumber == true)
                {
                    var week = this._weekDate(currentDate);
                    week = $(document.createElement('td')).attr({}).addClass('e-weeknumber').html(week)
                    r.append(week);
                }
                for (var i = 0; i < 7; i++) {
                    var thisMonth = currentDate.getMonth() == month;
                    var checkSpecialDate = this._isSpecialDates(currentDate);
                    var disable = this._checkDisableRange(currentDate);
                    var index = this._getIndex;
                    var d = $(document.createElement('td')).
                        html(checkSpecialDate ? '<span></span>' + currentDate.getDate() : currentDate.getDate() + '')
                        .attr({

                            'data-date': currentDate.toDateString(),
                            'title': (this.model.showTooltip ? (checkSpecialDate && this.model.specialDates[index][this._mapField._tooltip] ? this.model.specialDates[index][this._mapField._tooltip] : this._formatter(currentDate, this.model.tooltipFormat)) : ''),
                            'aria-selected': false,
                            'role': 'gridcell',
                            'id': this._formatter(currentDate, "yyyyddMM")
                        }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .addClass((thisMonth ? 'current-month e-state-default ' : 'other-month e-state-default ') +
                            (this._isWeekend(currentDate) ? (this._ejHLWeekEnd ? 'e-dp-weekend e-week-end ' : (this.model.highlightWeekend ? 'e-week-end ' : '')) : 'e-week-day ') +
                            (thisMonth && currentDate.getTime() == newdate.getTime() ? 'today ' : ''));

                    d.find('span:first-of-type').addClass((checkSpecialDate ? (this.model.specialDates[index][this._mapField._icon] ? 'e-special-date-icon ' + this.model.specialDates[index][this._mapField._icon] + ' ' : 'e-special-day') : ''));
                    d.addClass(checkSpecialDate ? (this.model.specialDates[index][this._mapField._custom] ? this.model.specialDates[index][this._mapField._custom] : '') : '');
                    if (disable) this._disableDates({ date: currentDate, element: d });
                    if (selected.getTime() == currentDate.getTime() && thisMonth) {
                        if (!d.hasClass('e-hidedate'))
                            if (this.model.value) {
                                d.addClass('e-active').attr({ 'aria-selected': true });
                                if (this.model.highlightSection == "week") {
                                    r.addClass('e-selected-week');
                                }
                                if (this.model.highlightSection == "month") {
                                    tbody.addClass('e-selected-month');
                                }
                                if (this.model.highlightSection == "workdays") {
                                    r.addClass('e-work-week');
                                }
                            }
                            else { if(this.model.value!=null)d.addClass('e-state-hover').attr({ 'aria-selected': false }); }
                        if (!this._hoverDate) {
                            if (!d.hasClass('e-hidedate')) d.addClass('e-state-hover');
                            this._hoverDate = currentDate.getDate() - 1;
                        }
                    }
                    var cond = true;
                    if (currentDate < this.model.minDate || currentDate > this.model.maxDate) {
                        d.addClass('e-hidedate');
                        d.removeClass('current-month');
                        if (this.model.showOtherMonths) d.removeClass('other-month');
                        cond = _last = false;
                    }
                    if (thisMonth) {
                        if (cond && _first) {
                            this._tempMinDate = currentDate;
                            _first = false; _last = true;
                        }
                        if (_last) this._tempMaxDate = currentDate;
                    }
                    this._trigger("beforeDateCreate", { date: currentDate, value: this._formatter(currentDate, this.model.dateFormat), element: d });
                    r.append(d);
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);
                }
                tbody.append(r);
            }
            calendarTable.append(tbody);
            if (this._DRPdisableFade) {
                $(tbody).css("display", "block");
                $(tbody).css({ display: "table-row-group", "vertical-align": "middle", "border-color": "inherit" });
            }
            else {
                (this._isIE8 || this._isIE7) ? $(tbody).css("display", "table-row-group") : $(tbody).fadeIn("fast");
            }
            if (this.model.startLevel === this.model.depthLevel)
                this._depthLevel(this.model.depthLevel);
            else if (this.model.depthLevel != "month" && this.model.depthLevel != "") {
                if (this.model.startLevel == "century")
                    this._depthLevel(this.model.depthLevel);
                else if (this.model.startLevel == "decade" && this.model.depthLevel != "century")
                    this._depthLevel(this.model.depthLevel);
                else if (this.model.startLevel == "year" && this.model.depthLevel != "decade" && this.model.depthLevel != "century")
                    this._depthLevel(this.model.depthLevel);
                else {
                    this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                    this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
                }
            }
            else {
                this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
            }

            this._otherMonthsVisibility();
            this._checkDateArrows();
        },

        _checkDisableRange: function (value) {
            if (!ej.isNullOrUndefined(this._disableCollection[value.getFullYear()]))
                if (jQuery.inArray(value.getMonth(), this._disableCollection[value.getFullYear()]) !== -1)
                    return true;
            return false;
        },
        _initDisableObj: function (disableDates) {
            this._disableCollection = {};
            for (var i = 0; i < this.model.blackoutDates.length; i++) {
                var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                if (dateObj) {
                    var year = dateObj.getFullYear();
                    var month = dateObj.getMonth();
                    if (ej.isNullOrUndefined(this._disableCollection[year])) this._disableCollection[year] = [];
                    if (jQuery.inArray(month, this._disableCollection[year]) == -1) this._disableCollection[year].push(month);
                }
            }
        },

        _disableDates: function (args) {
            for (var i = 0; i < this.model.blackoutDates.length; i++) {
                var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                if (dateObj && +args.date === +dateObj)
                    args.element.removeClass('current-month').addClass('e-hidedate');
            }
        },

        _keyboardNavigation: function (e) {
            if (this._animating) return false;
            if ((this._isOpen) && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 36 || e.keyCode == 35)) {
                e.preventDefault && e.preventDefault();
                if (e.altKey) { if (e.keyCode == 13) { this._setCurrDate(e); return false; } else return; }
                var t = { row: null, col: null };

                t.col = this.sfCalendar.find('tbody tr td.e-state-hover').index();
                t.row = this.sfCalendar.find('tbody tr td.e-state-hover').parent().index();

                t.col = (t.col != -1) ? t.col + 1 : this.sfCalendar.find('tbody tr td.e-active').index() + 1;
                t.row = (t.row != -1) ? t.row + 1 : this.sfCalendar.find('tbody tr td.e-active').parent().index() + 1;

                var tableClass = this.sfCalendar.find('table')[0].className, next, rowLength = 3, colLength = 4;
                switch (tableClass) {
                    case "e-dp-viewallyears":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "yearall", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverAllYear = this.sfCalendar.find('tbody.e-datepicker-allyears tr td').index(next);
                        break;
                    case "e-dp-viewyears":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "year", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverYear = this.sfCalendar.find('tbody.e-datepicker-years tr td').index(next);
                        break;
                    case "e-dp-viewmonths":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "month", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverMonth = this.sfCalendar.find('tbody.e-datepicker-months tr td').index(next);
                        break;
                    case "e-dp-viewdays":
                        rowLength = this.sfCalendar.find('tbody.e-datepicker-days tr').length, colLength = 7;
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "day", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverDate = this._getDateObj(next).getDate() - 1;
                        break;
                }
                if (!e.ctrlKey) {
                    this.sfCalendar.find('table td').removeClass("e-state-hover");
                    next.addClass("e-state-hover");
                    this._setAriaAttributes(next);
                }
            }
            else if (!this.model.displayInline && (e.keyCode == 27 || e.keyCode == 9)) { this.hide(); }
            else if (e.altKey && e.keyCode == 40) { this.show(); return false; }
        },
        _setAriaAttributes: function (next) {
            if (this._popupOpen) {
                this.sfCalendar.find("[aria-selected=true]").attr("aria-selected", false)
                this.sfCalendar.find("[aria-label]").removeAttr("aria-label");
                $(this.element).attr("aria-activedescendant", next.attr('id'));
                $(next).attr("aria-selected", true);
                $(next).attr("aria-label", "The current focused date is " + this._formatter(this._getDateObj(next), "dddd, dd MMMM, yyyy"));
            }
        },
        _changeRowCol: function (t, key, rows, cols, target, ctrlKey) {
            var eleClass, cls = { parent: null, child: null };
            switch (target) {
                case "day": eleClass = "tbody.e-datepicker-days tr td.current-month";
                    cls.parent = ".e-datepicker-days", cls.child = ".current-month";
                    break;
                case "month": eleClass = "tbody.e-datepicker-months tr td.e-current-month";
                    cls.parent = ".e-datepicker-months", cls.child = ".e-current-month";
                    break;
                case "year": eleClass = "tbody.e-datepicker-years tr td.e-current-year";
                    cls.parent = ".e-datepicker-years", cls.child = ".e-current-year";
                    break;
                case "yearall": eleClass = "tbody.e-datepicker-allyears tr td.e-current-allyear";
                    cls.parent = ".e-datepicker-allyears", cls.child = ".e-current-allyear";
                    break;
            }
            if (t.row <= 0 && t.col <= 0)
                return this.sfCalendar.find(eleClass + ':first');
            var cell, proxy = this;
            switch (key) {
                case 36:
                    return this.sfCalendar.find(eleClass + ':first');
                case 35:
                    return this.sfCalendar.find(eleClass + ':last');
                case 38:
                    if (ctrlKey && this.model.allowDrillDown) {
                        this._forwardNavHandler();
                    }
                    else if (t.row > 1) {
                        t.row -= 1;
                    }
                    else {
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):last');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "up");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):last');
                    }
                    return cell;
                case 37:
                    if (ctrlKey) {
                        this._processNextPrevDate(true);
                        return this.sfCalendar.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col > 1)
                        t.col -= 1;
                    else if (t.row > 1) {
                        t = { row: t.row - 1, col: cols }
                    }
                    else {
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':last');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "left");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':last');
                    }
                    return cell;
                case 39:
                    if (ctrlKey) {
                        this._processNextPrevDate(false);
                        return this.sfCalendar.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col < cols)
                        t.col += 1;
                    else if (t.row < rows) {
                        t = { row: t.row + 1, col: 1 }
                    }
                    else {
                        this._processNextPrevDate(false);
                        cell = this.sfCalendar.find(eleClass + ':first');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "right");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(false);
                        cell = this.sfCalendar.find(eleClass + ':first');
                    }
                    return cell;
                case 40:
                    if (!ctrlKey) {
                        if (t.row < rows) {
                            t.row += 1;
                        }
                        else {
                            this._processNextPrevDate(false);
                            cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):first');
                            return cell;
                        }
                        cell = this._getCell(t, cls);
                        if (cell.length <= 0) {
                            cell = this._findVisible(t, cls, "down");
                            if (cell !== null) return cell;
                            this._processNextPrevDate(false);
                            cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):first');
                        }
                        return cell;
                    }
                case 13:
                    var tclassName = $("table", this.sfCalendar).get(0).className, ele, element;
                    ele = this._getCell(t, cls); element = $(ele)[0];
                    if (tclassName == "e-dp-viewmonths" && this.model.startLevel == "year" && this.model.depthLevel == "year") {
                        this._dateValue = new Date(this._dateValue.setMonth(parseInt(element.attributes["data-index"].value)));
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else if ((tclassName == "e-dp-viewyears" && this.model.startLevel == "decade" && this.model.depthLevel == "decade") ||
                        (tclassName == "e-dp-viewallyears" && this.model.startLevel == "century" && this.model.depthLevel == "century")) {
                        this._dateValue = new Date(this._dateValue.setFullYear(parseInt(element.innerHTML)));
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else if (tclassName == "e-dp-viewdays") {
                        this._backwardNavHandler(ele);
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else
                        this._backwardNavHandler(ele);
                    break;
            }
            return this._getCell(t, cls);
        },
        _findVisible: function (t, cls, key) {
            var cols = t.col, rows = t.row, requiredClass = cls.child.slice(1, cls.child.length);
            for (i = 0; i >= 0; i++) {
                nextElement = this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td:nth-child(' + cols + ')');
                if (nextElement.length <= 0) {
                    return null;
                }
                if (nextElement.hasClass('e-hidedate') || !nextElement.is(":visible")) {
                    key == "right" || key == "left" ? (key == "right" ? cols++ : cols--) : (key == "down" ? rows++ : rows--);
                    if ((rows <= 0) || (rows > this.sfCalendar.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                    // Column exceeds the range. 
                    if (cols > this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length) {
                        //move to next row and select first column
                        rows++;
                        cols = 1;
                    }
                    if (cols <= 0) {
                        //move to previous row and select last column
                        rows--;
                        cols = this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length;
                    }
                    // Row exceeds the range.
                    if ((rows <= 0) || (rows > this.sfCalendar.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                } else if (nextElement.hasClass('other-month')) {
                    return null;
                } else if (nextElement.hasClass(requiredClass)) {
                    t.col = cols; t.row = rows;
                    return nextElement;
                }
            }
        },
        _getCell: function (t, cls) {
            return this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + t.row + ') td' + cls.child + ':nth-child(' + t.col + ')');
        },
        _getDateObj: function (element) {
            return new Date(element.attr("data-date"));
        },
        _touchCalendar: function (e) {
            var tableClass = this.sfCalendar.find('table')[0].className;
            switch (e.type) {
                case "pinchin":
                    if (tableClass != "e-dp-viewdays")
                        this._keyboardNavigation({ keyCode: 13 });
                    break;
                case "pinchout":
                    if (tableClass != "e-dp-viewallyears" && this.model.allowDrillDown)
                        this._forwardNavHandler();
                    break;
                case "swipeleft":
                    this._processNextPrevDate(false);
                    break;
                case "swiperight":
                    this._processNextPrevDate(true);
                    break;
            }
        },

        show: function (e) {
            if (ej.isNullOrUndefined(this.sfCalendar)) this._renderPopup();
            if (this._isOpen) return false;
            var proxy = this;
            this._popupOpen = true;
            $(this.element).attr("aria-expanded", true);
            var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
            if (!this.model.enabled) return;
            if (!this.model.displayInline) this._setDatePickerPosition();
            if (this._trigger("beforeOpen", { element: this.sfCalendar, events: e })) return false;
            this.sfCalendar.attr({ 'aria-hidden': 'false' });
            proxy._isOpen = true;
            this.sfCalendar.slideDown(this.model.enableAnimation ? this.animation.open.duration : 0, function () {
                if (proxy.model && !proxy.model.displayInline)
                    $(document).on("mousedown", $.proxy(proxy._onDocumentClick, proxy));
            });
            if (this._isIE8) {
                if (this.element.val() && this._compareDate(new Date(this.element.val()), previous)) this._updateInputVal();
            }
            else this._updateInputVal();
            this._refreshLevel(previous);
            this._trigger("open", { prevDate: previous, date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            if (!this.model.displayInline) {
              this._on(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
              this._on(ej.getScrollableParents(this.wrapper), "touchmove", this.hide);
			}
            this._isInputBox && this.wrapper.addClass("e-active");
        },


        hide: function (e) {
            if (!this._isOpen || this._getInternalEvents) return false;
            if (this._trigger("beforeClose", { element: this.sfCalendar, events: e })) return false;
            var proxy = this;
            this._popupOpen = false;
            $(this.element).attr("aria-expanded", false);
            this.sfCalendar.attr({ 'aria-hidden': 'true' });
            if (this._popClose && e != undefined && e.type != "click") {
                return;
            }
            this.sfCalendar.slideUp(this.model.enableAnimation ? this.animation.close.duration : 0, function () {
                proxy._isOpen = false;
                $(document).off("mousedown", $.proxy(proxy._onDocumentClick, proxy));
                proxy._setWaterMark();
            });
            if (this.element.val() != "") this._validateInputVal();
            this._trigger("close", { prevDate: this._prevDate, date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
            $(window).off("resize", $.proxy(this._OnWindowResize, this));
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
            this._off(ej.getScrollableParents(this.wrapper), "touchmove", this.hide);
            this._isInputBox && this.wrapper.removeClass("e-active");
            $(this.element).attr("aria-activedescendant", 'null');
        },


        enable: function () {
            this.model.enabled = true;
            this.wrapper && this.wrapper.removeClass('e-disable');
            this.element.removeClass('e-disable').attr({ "aria-disabled": false });
            this.element.prop("disabled", false);
            if (this.dateIcon) this.dateIcon.removeClass('e-disable').attr({ "aria-disabled": false });
            if (this._isIE8 && this.dateIcon) this.dateIcon.children().removeClass("e-disable");
            this.element.prop("disabled", false);
            if (!this._isSupport)
                this._hiddenInput.prop("disabled", false);
            this.sfCalendar && this.sfCalendar.removeClass('e-disable').attr({ "aria-disabled": false });
        },


        disable: function () {
            this.model.enabled = false;
            this.wrapper && this.wrapper.addClass('e-disable');
            this.element.addClass('e-disable').attr({ "aria-disabled": true });
            this.element.attr("disabled", "disabled");
            if (this.dateIcon) this.dateIcon.addClass('e-disable').attr({ "aria-disabled": true });
            if (this._isIE8 && this.dateIcon) this.dateIcon.children().addClass("e-disable");
            this.element.attr("disabled", "disabled");
            if (!this._isSupport)
                this._hiddenInput.attr("disabled", "disabled");
            this.sfCalendar && this.sfCalendar.addClass('e-disable').attr({ "aria-disabled": true });
            if (this._isOpen) {
                if (this.element.is(':input')) this.element.blur();
                if (!this.model.displayInline) this.hide();
            }
        },

        getValue: function () { return this._formatter(this.model.value, this.model.dateFormat); },

        _wireCalendarEvents: function () {
            this._allowQuickPick(this.model.allowDrillDown);
            this._on($('.e-next', this.sfCalendar), "click", $.proxy(this._previousNextHandler, this));
            this._on($('.e-prev', this.sfCalendar), "click", $.proxy(this._previousNextHandler, this));
            if (!this.model.displayInline) {
                this.sfCalendar.on("mouseenter touchstart", $.proxy(function () { this._popClose = true; }, this));
                this.sfCalendar.on("mouseleave touchend", $.proxy(function () { this._popClose = false; }, this));
            }
            if (this.model.showFooter)
                this._on($('.e-footer', this.sfCalendar), "click", this._setCurrDate);
            this.sfCalendar && this._on(this.sfCalendar, "pinchin pinchout swipeleft swiperight", $.proxy(this._touchCalendar, this));
        },

        _wireEvents: function () {
            if (this.element.is(":input") && (this.model.allowEdit)) {
                this._on(this.element, "blur", this._onFocusOut);
                this._on(this.element, "focus", this._onFocusIn);
                this._on(this.element, "keydown", this._onKeyDown);
            }

            if (!this.model.allowEdit) {
                this.element.attr("readonly", "readonly");
                this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
            }
        },
        _bindDateButton: function () {
            this._on(this.dateIcon, "mousedown", this._showDatePopUp);
            if (this.model.allowEdit)
                this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
        },
        _bindInputEvent: function () {
            this._off(this.dateIcon, "mousedown", this._showDatePopUp);
        },

        _specificFormat: function () {
            var parseInfo = ej.globalize._getDateParseRegExp(ej.globalize.findCulture(this.model.locale).calendar, this.model.dateFormat);
            return ($.inArray("dddd", parseInfo.groups) > -1 || $.inArray("ddd", parseInfo.groups) > -1)
        },

        _onFocusOut: function (e) {
            this._isFocused = false;
            var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
			if(this.model.enableStrictMode && this.element.val() && !isNaN(+new Date(this.element.val()))){
				this._formatArray = this.model.dateFormat.split(this._getSeparator());
				this._valArray = this.element.val().split(this._getSeparator());
				for(i = 0; i < this._formatArray.length ; i++){
					if(this._formatArray[i].startsWith("y") && this._valArray.length > 1){
						if((this._formatArray[i].length == 4 && this._valArray[i].length == 2) || (this._formatArray[i].length == 2 && this._valArray[i].length == 2)){
							this._valArray[i] = (parseInt(this._valArray[i]) + 2000).toString();
							this.element.val(this._valArray.join(this._getSeparator()));
						}
					}
				}
				
			}
            this._validateOnFocusOut(this._validateValue(), e);
            this.wrapper.removeClass("e-focus");
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
            if ((!this._isOpen || this.model.displayInline) && !this._setWaterMark() && !this._compareDate(this._preValue, this._parseDate(this.element.val(), this.model.dateFormat))) this._updateInputVal();
            if ((!this._isOpen || this.model.displayInline)) this._refreshLevel(previous);
            if (this.element.val() != "" && (!this._isOpen || this.model.displayInline)) { this._validateInputVal(); }
            this.element.off("keydown", $.proxy(this._keyboardNavigation, this));
            if (!this.model.showPopupButton) this._off(this.element, "click", this._elementClick);
            var _currentVal = this.element.val();
            var data = { prevDate: this._prevDate, value: _currentVal };
            if (this._specificFormat()) {
                if (this._prevDate != _currentVal)
                    this._setDateValue(_currentVal, true);
            }
            else
                this._setDateValue(_currentVal);
            if (!this.model.value) this._clearSelected();
            this._trigger("focusOut", data);
            this._checkErrorClass();
        },
        _onFocusIn: function (e) {
            if (this._isSupport) {
                e.preventDefault();
                this._isFocused = true;
            }
            this.wrapper.removeClass('e-error');
            this.isValidState = true;
            this.wrapper.addClass("e-focus");
            this.wrapper.addClass('e-valid');
            if (this.model.readOnly)
                return;
            if (!this._isSupport) this._hiddenInput.css("display", "none");
            this.element.on("keydown", $.proxy(this._keyboardNavigation, this));
            if (!this.model.showPopupButton && !this.model.readOnly) this.show(e);
            if (!this.model.showPopupButton) this._on(this.element, "click", this._elementClick);
            this._trigger("focusIn", { date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
        },
        _elementClick: function (e) {
            if (!this._popupOpen) this.show(e);
        },
        _removeWatermark: function () {
            if (this.element.val() != "" && !this._isSupport)
                this._hiddenInput.css("display", "none");
        },
        _refreshPopup: function () {
            this._refreshDatepicker();
            this._startLevel(this.model.startLevel);
        },
        _weekDate: function (currentDate) {
            var time, checkDate = new Date(currentDate.getTime());
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
            time = checkDate.getTime();
            checkDate.setMonth(0);
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;

        },
        _refreshLevel: function (previous) {
            if ((this.model.startLevel == this.model.depthLevel) && this.model.startLevel != "month") {
                var val = this._stringToObject(this.element.val());
                val = this._validateYearValue(val);
                if (val)
                    if (!this._compareDate(previous, val))
                        this._refreshPopup();
            }
        },
        _validateOnFocusOut: function (val, e) {
            var dateVal = this._preValue != null ? this._calendarDate : this._preValue;
            var calenderDate = this._formatter(dateVal, this.model.dateFormat);
			this._prevDate = this._formatter(this._preValue, this.model.dateFormat);
			var _currentVal = calenderDate;
            var data = { prevDate: this._prevDate, value: _currentVal, isInteraction: !!e };
            if (this._specificFormat() && (val > this.model.minDate) && (val < this.model.maxDate)) {
                if (val == null) this.model.value = dateVal
                else {
                    this.model.value = val;
                    var currDate = this._formatter(val, this.model.dateFormat, this.model.locale);
                }
            }
            else var currDate = this._formatter(this._parseDate((this._formatter(new Date(), "MM/dd/yyyy"))), this.model.dateFormat);
            var dateChange = false, valueExceed = false;
            if (val != null && !this.model.enableStrictMode) {
                if (ej.isNullOrUndefined(this.model.value))
                    this.model.value = this._parseDate(this.element.val());
                if (this.model.maxDate < this.model.minDate) this.model.minDate = this.model.maxDate;
                if (!this.model.enableStrictMode) {
                    if (val) {
                        if ((val < this.model.minDate) || (val > this.model.maxDate)) {
                            dateChange = true,
                            this._calendarDate = val = val < this.model.minDate ? this.model.minDate : this.model.maxDate
                        }
                    }
                    else {
                        this.element.val("");
                        if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                        else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                    }
                    this.isValidState = true;
                }
                if (dateChange) this.element.val(this._formatter(val, this.model.dateFormat));
                if (!this._compareDate(this._preValue, this._parseDate(this.element.val(), true))) this._triggerChangeEvent(e);
            }
            else if (val == null && !this.model.enableStrictMode) {
                if (this._preTxtValue == null || this.element.val() == "") {
                    this.element.val("");
                    if (!this._isSupport) this._hiddenInput.css("display", "block");
                } else
                    this.element.val(calenderDate);
                this._triggerChangeEvent(e);
				if(this.model.value != null)
				this._trigger("change", data);
            }
            else {
                if (val) {
                    if ((val < this.model.minDate) || (val > this.model.maxDate)) {
                        this.isValidState = false, valueExceed = true,
                        this._calendarDate = val < this.model.minDate ? this.model.minDate : this.model.maxDate
                    }
                    else
                        this.isValidState = true;
                    this._triggerChangeEvent(e);
                    if (valueExceed && this._getInternalEvents) this._trigger("outOfRange");
                }
                else {
                    this.isValidState = false;
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
            }
        },
        _onKeyDown: function (e) {
            if (e.keyCode === 13) {
                var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
                this._validateOnFocusOut(this._validateValue(), e);
                if ((!this._isOpen || this.model.displayInline) && !this._setWaterMark() && !this._compareDate(this._preValue, this._parseDate(this.element.val(), this.model.dateFormat))) this._updateInputVal();
                if ((!this._isOpen || this.model.displayInline)) this._refreshLevel(previous);
                if (this.element.val() != "" && (!this._isOpen || this.model.displayInline)) { this._validateInputVal(); }
                this._checkErrorClass();
            }
        },
        _showhidePopup: function (e) {
            if (!this.model.enabled) return false;
            if (this._isOpen) {
                if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) this.element.focus();
                if (!this._cancelValue) this.hide(e);
            }
            else {
                if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) this.element.focus();
                this.show(e);
            }
        },
        _compareDate: function (first, second) {
            var result = (+first === +second) ? true : false;
            return result;
        },
        _validateDate: function (val) {
            var result = true;
            if (val != null) {
                for (var i = 0; i < this.model.blackoutDates.length; i++) {
                    var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                    if (dateObj && +val === +dateObj)
                        result = false;
                }
                if ((val < this.model.minDate || val > this.model.maxDate) && this.model.enableStrictMode) {
                    result = false;
                    this.isValidState = false;
                }
            }

            return result;
        },

        _triggerChangeEvent: function (e) {
            var currentValue;
            var _currentVal = this.element.val() == "" ? null : this.element.val();
            this._prevDate = this._formatter(this._preValue, this.model.dateFormat);
            var data = { prevDate: this._prevDate, value: _currentVal, isInteraction: !!e };
            if (this._specificFormat() && e != undefined && e.type == "keydown" && this._formatter(this._preValue, this.model.dateFormat, this.model.locale) != this.element.val())
                currentValue = this._parseDate(this.element.val(), true);
            else if ((this._specificFormat() && e != undefined && e.type == "blur"))
                currentValue = this.model.value;
            else currentValue = this._parseDate(_currentVal);
            currentValue = this._validateYearValue(currentValue);
            if (!this._validateDate(currentValue)) currentValue = null;
            if (!this._compareDate(this._preValue, currentValue)) {
                this._preValue = this.model.value = currentValue;
                data.value = this._formatter(this.model.value, this.model.dateFormat);
                if (this.model.value) this._clickedDate = this._calendarDate = this.model.value;
                if (this.model.displayInline && !this._isInputBox) this._hiddenInput.attr('value', _currentVal);
                if (!this.model.value && !this.model.enableStrictMode) this._setDateValue(this.model.value);
                data.value = _currentVal;
                this._trigger("_change", data);
                data.value = this._formatter(this.model.value, this.model.dateFormat);
                this._trigger("change", data);
                this._checkErrorClass();
            }
            else if (!(this.element.val() == "" && this._prevDate == null) && this.element.val() != this._prevDate) {
                data.value = this.element.val();
                this._trigger("_change", data);
            }
        },

        _triggerSelectEvent: function (e) {
            var val = this.element.val();
            if (this._parseDate(val)) {
                var data = { prevDate: this._prevDate, date: this.model.value, value: val, isSpecialDay: this._isSpecialDates(this.model.value) };
                if (this._prevDate != val) {
                    if (this._parseDate(data.value) && (this.model.value >= this.model.minDate && this.model.value <= this.model.maxDate)) {
                        this._cancelValue = this._trigger("select", data);
                    }
                }
                if (this._dt_drilldown) this._trigger("dt_drilldown", data);
            }
        },

        _onDocumentClick: function (e) {
            if (this.model) {
                if (!$(e.target).is(this.popup) && !$(e.target).parents(".e-popup").is(this.popup) &&
                    !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-datewidget").is(this.wrapper)) {
                    this.hide(e);
                }
                else if ($(e.target).is(this.popup) || $(e.target).parents(".e-popup").is(this.popup)) {
                    e.preventDefault();
                }
            }
        },

        _OnWindowResize: function (e) {
            if (this.sfCalendar) this._setDatePickerPosition();
        },

        _showDatePopUp: function (e) {
            var isRightClick = false;
            if (e.button)
                isRightClick = (e.button == 2);
            else if (e.which)
                isRightClick = (e.which == 3); //for Opera
            if (isRightClick) return;
            if (!this._isSupport && !this.model.showPopupButton) {
                e.preventDefault();
                this._onFocusIn();
            }
            if (this.model.readOnly) return;
            e.preventDefault();
            if (!this.model.enabled && this.model.displayInline) return false;
            this._showhidePopup(e);
        },
        _layoutChanged: function (e) {
            // this event internally used to observe the layout change in "DateTimePicker" control
            if (this._getInternalEvents) this._trigger("layoutChange");
        },
        _setCurrDate: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e) e.preventDefault();
            var proxy = this;
            this._prevDate = this._formatter(this.model.value, this.model.dateFormat);
            this._dateValue = this._zeroTime(new Date());
            this.model.value = this._calendarDate = new Date(this._dateValue.toString());
            this._setDateValue(this.model.value);
            this._triggerSelectEvent(e);
            this._triggerChangeEvent(e);
            this._refreshDatepicker();
            this._changeDayClass();
            this._startLevel(this.model.startLevel);
            this._onSetCancelDateHandler(e);
            this._layoutChanged();
        },
        _changeDayClass: function () {
            var className = this.popup.children("table")[0].className;
            if (className != "e-dp-viewdays") {
                this.popup.children("table").removeClass(className).addClass("e-dp-viewdays");
            }
        },

        _onSetCancelDateHandler: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e && ($(e.target).hasClass("e-disable") || $(e.target).hasClass("e-hidedate"))) return false;
            if (e && e.type) e.preventDefault();
            if (this._specificFormat()) this._prevDate = this.element.val();
            else this.model.value = this._parseDate(this.element.val());
            this._prevDate = this._formatter(this.model.value, this.model.dateFormat);
            this._setDateValue(this._dateValue);
            this._triggerSelectEvent(e);
            this._triggerChangeEvent(e);
            this._dateValue = (this.model.value == null)? null:new Date(this.model.value.toString());
            if (this.element.is(':input') && !this.model.displayInline) {
                this._showhidePopup(e);
            }
            if (e && $(e.currentTarget).hasClass("other-month"))
                this._refreshDatepicker();
            this._cellSelection();
        },
        _closeCalendar: function (ele) {
            if (!ele || ele == this.element) {
                this.sfCalendar.empty().remove();
            }
        },
        //Error class for input value validation
        _checkErrorClass: function () {
            if (this.wrapper) {
                if (this.isValidState) this.wrapper.removeClass("e-error");
                else this.wrapper.addClass("e-error");
            }
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
    });

    ej.DatePicker.Locale = ej.DatePicker.Locale || {};

    ej.DatePicker.Locale['default'] = ej.DatePicker.Locale['en-US'] = {
        watermarkText: "Select date",
        buttonText: 'Today'
    };


    ej.DatePicker.Header = {
        /**  Removes the day header */
        None: "none",
        /**  Shows the day header format in short like Sun, Mon, Tue … */
        Short: "short",
        /**  Shows the day header format in min like Su, Mo, Tu … */
        Min: "min",
        /**  Shows the day header format in long like Sunday, Monday, Tuesday … */
        Long: "long"
    };

    ej.DatePicker.HighlightSection = {
        /**  Highlight the Current Month. */
        Month: "month",
        /**  Highlight the Current Week. */
        Week: "week",
        /**  Highlight the Current WorkDays. */
        WorkDays: "workdays",
        /** Don't Highlight Anything. */
        None: "none"
    };


    ej.DatePicker.Level = {
        /**  Starts from month level view. */
        Month: "month",
        /**  Starts from year level view. */
        Year: "year",
        /**  Starts from year decade level view. */
        Decade: "decade",
        /**  Starts from century level view.  */
        Century: "century"
    };
})(jQuery, Syncfusion);