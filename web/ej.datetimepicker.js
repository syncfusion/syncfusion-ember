/**
* @fileOverview Plugin to select the date and time values.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejDateTimePicker", "ej.DateTimePicker", {

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _setFirst: false,
        _rootCSS: "e-datetimepicker",
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },
        _requiresID: true,


        defaults: {

            cssClass: "",

            locale: "en-US",

            readOnly: false,

            showRoundedCorner: false,

            enableRTL: false,

            htmlAttributes: {},
            allowEdit: true,

            enabled: true,

            value: "",

            name: null,

            minDateTime: new Date("1/1/1900 12:00:00 AM"),

            maxDateTime: new Date("12/31/2099 11:59:59 PM"),

            height: "",

            width: "",

            dateTimeFormat: "",

            showPopupButton: true,

            enableStrictMode: false,

            buttonText: {

                today: "Today",

                timeNow: "Time Now",

                done: "Done",

                timeTitle: "Time"
            },

            watermarkText: "Select datetime",

            enablePersistence: false,

            interval: 30,

            timeDisplayFormat: "",

            timePopupWidth: 105,
            popupPosition: "bottom",

            dayHeaderFormat: "short",

            startLevel: "month",

            depthLevel: "",

            startDay: -1,

            stepMonths: 1,

            showOtherMonths: true,

            enableAnimation: true,

            headerFormat: 'MMMM yyyy',

            validationRules: null,

            validationMessage: null,

            validationMessages: null,
            timeDrillDown: {
                enabled: false,
                interval: 5,
                showMeridian: false,
                autoClose: true,
                showFooter: true
            },

            beforeOpen: null,

            beforeClose: null,

            open: null,

            close: null,

            change: null,

            create: null,

            destroy: null,

            focusIn: null,

            focusOut: null,

            disableDateTimeRanges: null,

           
        },


        dataTypes: {
            allowEdit: "boolean",
            cssClass: "string",
            locale: "string",
            readOnly: "boolean",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            enabled: "boolean",
            enableAnimation: "boolean",
            dateTimeFormat: "string",
            showPopupButton: "boolean",
            buttonText: "data",
            watermarkText: "string",
            enablePersistence: "boolean",
            enableStrictMode: "boolean",
            interval: "number",
            timeDrillDown: "data",
            timeDisplayFormat: "string",
            dayHeaderFormat: "string",
            startLevel: "string",
            depthLevel: "string",
            startDay: "number",
            stepMonths: "number",
            showOtherMonths: "boolean",
            headerFormat: "string",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data",
            disableDateTimeRanges: "data"
        },

        _setModel: function (options) {
		
            var option, validate = false;
            for (option in options) {
			if(option != "allowEdit" && option != "readOnly" && option != "enabled" && option != "validationRules" && option != "validationMessages" && option != "enableStrictMode" &&
			option != "height" && option != "width" && option != "showPopupButton" && option != "dateTimeFormat" && option != "watermarkText" && option != "htmlAttributes"){
					if (!this.popup) this._renderDropdown();
				}
                switch (option) {
                    case "allowEdit": this._changeEditable(options[option]); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "locale": this._localize(options[option]); break;
                    case "readOnly": this._readOnly(options[option]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[option]); break;
                    case "enableRTL": this._setRtl(options[option]); break;
                    case "enabled": this._enabled(options[option]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = options[option];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessages = options[option];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessages":
                        this.model.validationMessages = options[option];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "value":
                        options[option] = this._setValue(options[option]);
                        if (this._specificFormat())
                            this._stopRefresh = true
                        validate = true;
                        this._prevDateTime = this._prevDateTimeVal || this._preVal;
                        break;
                    case "enableStrictMode":
                        this.model.enableStrictMode = options[option];
                        validate = true;
                        break;
                    case "minDateTime":
                        var temp = this._stringToObject(options[option]);
                        var mintime = this._getFormat(temp, this.timePicker.model.timeFormat);
                        if (this._isValidDate(temp)) {
                            this.datePicker.option("minDate", temp);
                            if(this.datePicker.model.value && this.datePicker.model.value.toDateString() == this.datePicker.model.minDate.toDateString() )this.timePicker.option("minTime", mintime);
                            options[option] = temp;
                            this.model.minDateTime = temp;
                        }
                        else options[option] = this.model[option];
                        validate = true;
                        break;
                    case "maxDateTime":
                        var temp = this._stringToObject(options[option]);
                        var maxtime = this._getFormat(options[option], this.timePicker.model.timeFormat);
                        if (this._isValidDate(temp)) {
                            this.datePicker.option("maxDate", temp);
                            if(this.datePicker.model.value && this.datePicker.model.value.toDateString() == this.datePicker.model.maxDate.toDateString() )this.timePicker.option("maxTime", maxtime);
                            options[option] = temp;
                            this.model.maxDateTime = temp;
                        }
                        else options[option] = this.model[option];
                        validate = true; break;
                    case "height": this.wrapper.height(options[option]); break;
                    case "width": this.wrapper.width(options[option]); break;
                    case "dateTimeFormat":
                        this.model.dateTimeFormat = options[option];
                        if (this.isValidState) this._setValue(this.model.value);
                        break;
                    case "showPopupButton": this._showButton(options[option]); break;
                    case "watermarkText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options[option] = this.model.watermarkText = options[option];
                        this._localizedLabels.watermarkText = this.model.watermarkText;
                        this._setWaterMark();
                        break;
                    case "buttonText":
                        if (!ej.isNullOrUndefined(this._options))
                            this._options["buttonText"] = this.model.buttonText = options[option];
                        this._localizedLabels.buttonText = this.model.buttonText;
                        this._buttonText(options[option]); break;
                    case "interval":
                        this._updateTimeHeight();
                        this.timePicker.option("interval", options[option]); break;
                    case "timeDisplayFormat":
                        this._updateTimeHeight();
                        this.timePicker.option("timeFormat", options[option]); break;
					case "disableDateTimeRanges": 
					if(this._disabledDate) this._disabledDates = false;
					this.model.disableDateTimeRanges = (options[option]);
					this._setValue(this.model.value);
					break;
                    case "timePopupWidth":
                        this._updateTimeHeight();
                        var width = options[option];
                        if ((typeof (width) == "string" && width.indexOf("%") != -1) || typeof (width) == "string" )  options[option] = parseInt(width) > 0 ? width : 105;
                        else {
                            options[option] = width > 0 ? width : 105;
                        }
                        this.timePicker.option("popupWidth", options[option]);
                        break;
                    case "dayHeaderFormat": this.datePicker.option("dayHeaderFormat", options[option]); break;
                    case "startLevel": this.datePicker.option("startLevel", options[option]); break;
                    case "depthLevel": this.datePicker.option("depthLevel", options[option]); break;
                    case "startDay": this.datePicker.option("startDay", options[option]);
                        this.model.startDay = this.datePicker.model.startDay;
                        options[option] = this.model.startDay; break;
                    case "stepMonths": this.datePicker.option("stepMonths", options[option]); break;
                    case "showOtherMonths": this.datePicker.option("showOtherMonths", options[option]); break;
                    case "headerFormat": this.datePicker.option("headerFormat", options[option]); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "popupPosition": this.model.popupPosition = options[option]; this._setListPosition(); break;
                    case "timeDrillDown":

                        // For timeDrillDown.enabled
                        if (!ej.isNullOrUndefined(options[option].enabled)) {
                            this.model.timeDrillDown.enabled = options[option].enabled; this._changeDesign();
                        }

                        // For timeDrillDown.interval
                        if (!ej.isNullOrUndefined(options[option].interval)) {
                            this.model.timeDrillDown.interval = options[option].interval;
                            this._generateMins($.trim(ej.format(this.timePicker._createObject(this._datetimeValue), "HH:00", this.model.locale)));
                        }

                        // For timeDrillDown.showMeridian
                        if (!ej.isNullOrUndefined(options[option].showMeridian)) {
                            this.model.timeDrillDown.showMeridian = options[option].showMeridian;
                            this._sfTimeHour.empty(); this._renderHourTable();
                        }

                        // For timeDrillDown.showFooter
                        if (!ej.isNullOrUndefined(options[option].showFooter)) {
                            this.model.timeDrillDown.showFooter = options[option].showFooter;
                            this._changeDesign();
                        }
                        break;

                }
            }
            if (validate) this._validateMinMax();
            this._valueChange(true);
            if (option == "value") options[option] = this.model.value;
            if(this.popup)this._updateTimeHeight();
            this._checkErrorClass();
        },
        observables: ["value"],

        _destroy: function () {
            if (this.isPopupOpen)
                this._hideResult();
            if (this.wrapper) {
                this.element.insertAfter(this.wrapper);
                this.wrapper.remove();
            }
            this.element.removeClass("e-js e-input").removeClass(ej.util.getNameSpace(this.sfType));
            this.element.removeAttr(" type aria-atomic aria-live tabindex aria-expanded aria-disabled placeholder role")
            !this._cloneElement[0].hasAttribute("name") && this.element.removeAttr("name");
            if (!ej.isNullOrUndefined(this.datePicker))
                this.datePicker.destroy();
            if (!ej.isNullOrUndefined(this.timePicker))
                this.timePicker.destroy();
            if(this.popup)this.popup.remove();
        },
        _initDisableTimeRanges: function (currvalue) {
            var value = this._getDateObj(currvalue, this.datePicker.model.dateFormat);
                for (var i = 0; i < this.model.disableDateTimeRanges.length; i++) {
					if(ej.isNullOrUndefined(this.model.disableDateTimeRanges[i].endDateTime)) this.model.disableDateTimeRanges[i].endDateTime = this.model.disableDateTimeRanges[i].startDateTime;
					if(this.model.disableDateTimeRanges[i].startDateTime instanceof Date || this.model.disableDateTimeRanges[i].endDateTime instanceof Date){
						var sdate = this._getFormat(this.model.disableDateTimeRanges[i].startDateTime, this.datePicker.model.dateFormat);
						var edate = this._getFormat(this.model.disableDateTimeRanges[i].endDateTime, this.datePicker.model.dateFormat);
					}
                    else{
						var sdate = this.model.disableDateTimeRanges[i].startDateTime.split(' ')[0];
						var edate = this.model.disableDateTimeRanges[i].endDateTime.split(' ')[0];
					}
                    var startval = new Date(this.model.disableDateTimeRanges[i].startDateTime);
                    var endval = new Date(this.model.disableDateTimeRanges[i].endDateTime);
                    if (sdate == edate) {
                        if (this._compare(value, this._setEmptyTime(this.model.disableDateTimeRanges[i].startDateTime))) {
                            var stime = this._getFormat(startval, this.timePicker.model.timeFormat);
                            var etime = this._getFormat(endval, this.timePicker.model.timeFormat);
                            var values = [];
                            values.push({ startTime: stime, endTime: etime });
                            this.timePicker.option("disableTimeRanges", values);
							return;
                        }
                        else
                            this.timePicker.option("disableTimeRanges", this._defaultMinVal());
					if(!this._disabledDates && this.model.disableDateTimeRanges[i].endDateTime == this.model.disableDateTimeRanges[i].startDateTime){
						if(this.model.disableDateTimeRanges[i].endDateTime instanceof Date == false){
							if((this._getFormat(this.model.disableDateTimeRanges[i].endDateTime,this.model.dateTimeFormat) == this._getFormat(this.model.disableDateTimeRanges[i].endDateTime,this.model.dateFormat) && ej.isNullOrUndefined(this.model.disableDateTimeRanges[i].endDateTime.split(' ')[1]))){
									this._between.push(new Date(this.model.disableDateTimeRanges[i].endDateTime));
								}
						}
					}
                   }
                    else if (sdate != edate) {                            
						if (this._compare(value, this._setEmptyTime(this.model.disableDateTimeRanges[i].startDateTime))||this._compare(value, this._setEmptyTime(this.model.disableDateTimeRanges[i].endDateTime))) {
							var stime = this.timePicker.model.minTime,etime = this.timePicker.model.maxTime;
                            if(this.datePicker.model.value.toDateString() == new Date(this.model.disableDateTimeRanges[i].startDateTime).toDateString()) stime = this._getFormat(new Date(this.model.disableDateTimeRanges[i].startDateTime), this.timePicker.model.timeFormat);
                            if(this.datePicker.model.value.toDateString() == new Date(this.model.disableDateTimeRanges[i].endDateTime).toDateString()) etime = this._getFormat(new Date(this.model.disableDateTimeRanges[i].endDateTime), this.timePicker.model.timeFormat);
                            var values = [];
                            values.push({ startTime: stime, endTime: etime });
                            this.timePicker.option("disableTimeRanges", values);
							return;
                        }
						if(!this._disabledDates){
							var stime = this._getFormat(new Date(this.model.disableDateTimeRanges[i].startDateTime), this.timePicker.model.timeFormat);
							var etime = this._getFormat(new Date(this.model.disableDateTimeRanges[i].endDateTime), this.timePicker.model.timeFormat);
							if(stime == this.timePicker.model.minTime){
								this._between.push(new Date(this.model.disableDateTimeRanges[i].startDateTime));
							}
							if(this.model.disableDateTimeRanges[i].endDateTime instanceof Date == false){
								if(this._getFormat(this.model.disableDateTimeRanges[i].endDateTime,this.model.dateTimeFormat) == this._getFormat(new Date(this.model.disableDateTimeRanges[i].endDateTime), this.datePicker.model.dateFormat)){
									etime = this.timePicker.model.maxTime;
								}
							}
							if(etime == this.timePicker.model.maxTime){
								this._between.push(new Date(this.model.disableDateTimeRanges[i].endDateTime));
							}
						}
                    }

            }
        },
		_disableBetweenDates: function(){
			for (var i = 0; i < this.model.disableDateTimeRanges.length; i++) {
					var datePickedStr1 = this.model.disableDateTimeRanges[i].startDateTime;
                    var datePickedDate1 = this._setEmptyTime(datePickedStr1);
					var startDateTimeVal = this._getFormat(new Date(this.model.disableDateTimeRanges[i].startDateTime), this.timePicker.model.timeFormat);
                    var endDateTimeVal = this._getFormat(new Date(this.model.disableDateTimeRanges[i].endDateTime), this.timePicker.model.timeFormat);
                    var datePickedStr2 = this.model.disableDateTimeRanges[i].endDateTime;
                    var datePickedDate2 = this._setEmptyTime(datePickedStr2);
                        while (datePickedDate1 < datePickedDate2) {
                           datePickedDate1.setDate(datePickedDate1.getDate() + 1);
							if(new Date(datePickedDate1) < datePickedDate2){
								this._between.push(new Date(datePickedDate1));
								}
                        }
					
			}
			this._datesDisabled = true;
		},
		_init: function (options) {
		    this._cloneElement = this.element.clone();
            if (!this.element.is("input") || (this.element.attr('type') && this.element.attr('type') != "text")) return false;
            this._options = options;
            this._ISORegex();
            this._isSupport = document.createElement("input").placeholder == undefined ? false : true;
            this._validateMeridian();
            this._checkAttribute();
            this._initialize();
            this._initial = true;
            this._interval = 60;
            this._render();
            this._wireEvents();
            this._addAttr(this.model.htmlAttributes);
            if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
                this.model.validationMessages = this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
			this._removeWatermark();
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
        _changeDesign: function () {
            if (this.model.timeDrillDown.enabled) {
                var state = this.model.timeDrillDown.showFooter ? "block" : "none";
                this.popup.addClass("e-drill-down");
                this._timeContainer.css("display", "none");
                this._buttonContainer.css("display", "none");
                this.datePicker.option("showFooter", this.model.timeDrillDown.showFooter);
                $('.e-footer', this._sfTimeHour).css("display", state);
                $('.e-footer', this._sfTimeMins).css("display", state);
            }
            else {
                this.popup.removeClass("e-drill-down");
                this._sfTimeHour.hide();
                this._sfTimeMins.hide();
                this._updateTimeHeight();
                this._dateContainer.show();
                this._timeContainer.show();
                this._buttonContainer.show();
                this.datePicker.option("showFooter", false);
                this.timePicker._refreshScroller();
                this.timePicker._changeActiveEle();
            }
        },
        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _checkAttribute: function () {
            this.model.value = this.model.value === "" ? this.element[0].value : this.model.value;
            if (!this._options.minDateTime) this.model.minDateTime = this.element[0].min;
            if (!this._options.maxDateTime) this.model.maxDateTime = this.element[0].max;
            if (ej.isNullOrUndefined(this._options.readOnly)) this.model.readOnly = this.element.is("[readonly]");
            if (ej.isNullOrUndefined(this._options.enabled)) this.model.enabled = !this.element.is("[disabled]");
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
		_validateDisableRanges: function(){
			for (var i = 0; i < this.model.disableDateTimeRanges.length; i++) {
				var tempValue = this.model.value;
				if(new Date(this.model.value).getTime() >= new Date(this.model.disableDateTimeRanges[i].startDateTime).getTime() && new Date(this.model.value).getTime() <= new Date(this.model.disableDateTimeRanges[i].endDateTime).getTime()) this.model.value = null;
				if(this.model.value == null && tempValue !=null && this.model.enableStrictMode) this.isValidState = false;	
				if(this.isValidState) this.element.val(this._getFormat(this.model.value,this.model.dateTimeFormat));
			}
		},
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled") proxy._enabled(false);
                else if (keyName == "readOnly") proxy._readOnly(true);
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], keyName)) proxy.element.attr(keyName, value);
                else proxy.wrapper.attr(keyName, value);
            });
        },
        _validateMeridian: function () {
            var culture = ej.preferredCulture(this.model.locale);
            if (culture) this.model.locale = culture.name == "en" ? "en-US" : culture.name;
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.timeDrillDown)) {
                    if (ej.isNullOrUndefined(this._options.timeDrillDown.showMeridian))
                        this.model.timeDrillDown.showMeridian = ej.isNullOrUndefined(ej.preferredCulture(this.model.locale).calendars.standard["AM"]) ? false : true;
                }
                else this.model.timeDrillDown.showMeridian = ej.isNullOrUndefined(ej.preferredCulture(this.model.locale).calendars.standard["AM"]) ? false : true;
            }
            else
                this.model.timeDrillDown.showMeridian = ej.isNullOrUndefined(ej.preferredCulture(this.model.locale).calendars.standard["AM"]) ? false : true;
        },
        _initialize: function () {
            var val;
            this.popup = null;
            this.isPopupOpen = false;
            this.isValidState = true;
            this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.buttonText))
                    $.extend(this._localizedLabels.buttonText, this._options.buttonText);
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            this._localizedLabelToModel();
            if (this.model.startDay == -1) this.model.startDay = ej.preferredCulture(this.model.locale).calendar.firstDay;
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            this._isIE9 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "9.0") ? true : false;
            if (!this.model.dateTimeFormat || !this.model.timeDisplayFormat) this._getDateTimeFormat();
            if (!this.model.value || (typeof JSON === "object" && JSON.stringify(this.model.value) === "{}")) val = null;
            else if (!(this.model.value instanceof Date)) {
                var dateTimeObj = ej.parseDate(this.model.value, this.model.dateTimeFormat, this.model.locale);
                val = dateTimeObj ? dateTimeObj : (dateTimeObj = this._checkJSONString(this.model.value)) ? dateTimeObj : null;
            }
            else val = this.model.value;
            if (val) this.model.value = val;
            var min = this.model.minDateTime = this._stringToObject(this.model.minDateTime);
            if (!min || !this._isValidDate(min)) this.model.minDateTime = this.defaults.minDateTime;
            var max = this.model.maxDateTime = this._stringToObject(this.model.maxDateTime);
            if (!max || !this._isValidDate(max)) this.model.maxDateTime = this.defaults.maxDateTime;
        },
        _checkJSONString: function (dateTimeString) {
            // Validate the string value
            var dateTimeObj = new Date(dateTimeString);
            if (!isNaN(Date.parse(dateTimeObj))) {
                if ((dateTimeObj.toJSON() === this.model.value) || (dateTimeObj.toGMTString() === this.model.value) ||
                    (dateTimeObj.toISOString() === this.model.value) || (dateTimeObj.toLocaleString() === this.model.value) ||
                    (dateTimeObj.toString() === this.model.value) || (dateTimeObj.toUTCString() === this.model.value))
                    return dateTimeObj;
                else if (typeof dateTimeString == "string") return this._dateFromISO(dateTimeString);
            } else if (this._extISORegex.exec(dateTimeString) || this._basicISORegex.exec(dateTimeString)) return this._dateFromISO(dateTimeString);
        },
        _render: function () {
            this._renderWrapper();
            this._renderIcon();
            this._setDimentions();
            this._checkProperties();
        },

        _renderWrapper: function () {
            this.element.addClass("e-input").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', "tabindex": "0", 'role':'combobox','aria-expanded':'false' });
            this.wrapper = ej.buildTag("span.e-datetime-wrap e-widget " + this.model.cssClass + "#" + this.element[0].id + "_wrapper").insertAfter(this.element);
            this._setValue(this.model.value);
            this.wrapper.attr("style", this.element.attr("style"));
            this.element.removeAttr("style");
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
        _removeWatermark: function () {
            if (this.element.val() != "" && !this._isSupport && this._hiddenInput)
                this._hiddenInput.css("display", "none");
        },
        _renderIcon: function () {
            if (!this.model.showPopupButton) return false;
            this.datetimeIcon = ej.buildTag("span.e-select", "", {}).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            var icon = ej.buildTag("span.e-icon e-datetime", "", {}, { "aria-label": "select" }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this.datetimeIcon.append(icon);
            this.container.append(this.datetimeIcon).addClass("e-padding");
            this._on(this.datetimeIcon, "click", this._iconClick);
            this._on(this.datetimeIcon, "mousedown", function (e) { e.preventDefault(); });
        },
        _setDimentions: function () {
            if (!this.model.height) this.model.height = this.element.attr("height"); if (!this.model.width) this.model.width = this.element.attr("width");
            this.wrapper.height(this.model.height);
            this.wrapper.width(this.model.width);
        },

        _renderDropdown: function () {
            var oldWrapper = $("#" + this.element[0].id + "_popup").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            this.popup = ej.buildTag("div.e-datetime-popup e-popup e-widget e-box " + this.model.cssClass + "#" + this.element[0].id + "_popup").css("visibility", "hidden");
            if (!ej.isTouchDevice()) this.popup.addClass('e-ntouch');
            $('body').append(this.popup);
            this._renderControls();

            var _timeTitle, _dateContainer, popupContainer, _today, _now, _done;

            _timeTitle = ej.buildTag("div.e-header", this._localizedLabels.buttonText.timeTitle).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._dateContainer = ej.buildTag("div.e-datecontainer").append(this.datePicker.popup).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._timeContainer = ej.buildTag("div.e-timecontainer").append(_timeTitle, this.timePicker.popup).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._drillDownContainer = ej.buildTag("div.e-drillDowncontainer").append().attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            popupContainer = ej.buildTag("div.e-popup-container").append(this._dateContainer, this._timeContainer, this._drillDownContainer).attr((this._isIE8) ? { 'unselectable': 'on' } : {});

            _today = ej.buildTag("div.e-dt-button e-dt-today e-btn e-select e-flat", this._localizedLabels.buttonText.today).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            _now = ej.buildTag("div.e-dt-button e-dt-now e-btn e-select e-flat", this._localizedLabels.buttonText.timeNow).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            _done = ej.buildTag("div.e-dt-button e-dt-done e-btn e-select e-flat", this._localizedLabels.buttonText.done).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._buttonContainer = ej.buildTag("div.e-button-container").append(_today, _now, _done).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._renderDrillDown();
            this.popup.append(popupContainer, this._buttonContainer);
            this._checkForResponsive();
            this._updateTimeHeight();

            this._bindOperations();
            this._updateValues();
            this.popup.css({ "visibility": "visible", "display": "none" });

            this._on(_today, "click", this._todayClick);
            this._on(_now, "click", this._nowClick);
            this._on(_done, "click", this._doneClick);
            this.popup.on("mouseenter touchstart", $.proxy(function () { this._popClose = true; }, this));
            this.popup.on("mouseleave touchend", $.proxy(function () { this._popClose = false; }, this));
            this._changeDesign();
        },
        _renderControls: function () {
            this._renderDateControl();
            this._renderTimeControl();
            var tempContainer = ej.buildTag("span").append(this.datePicker.wrapper, this.timePicker.wrapper);
            tempContainer.find("span").css("display", "none");
            this.popup.append(tempContainer);
        },
        _renderDrillDown: function () {
            this._renderHourPopup();
            this._renderMinsPopup();
        },
        _renderHourPopup: function () {
            var table;
            this._sfTimeHour = ej.buildTag('div.e-timepicker e-popup e-widget ' + this.model.cssClass + ' e-time-hours ', "", {}, { id: (this._id ? 'e-hours-' + this._id : "") }).attr({ 'aria-hidden': 'true' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
            if (!ej.isTouchDevice()) this._sfTimeHour.addClass('e-ntouch');
            this._drillDownContainer.append(this._sfTimeHour);
            this._renderHourTable();
        },
        _renderHourTable: function () {
            // Rendering header template
            ej.buildTag("div.e-header").attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                   .append(ej.buildTag("span.e-prev").append(ej.buildTag('a.e-icon e-arrow-sans-left').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-hours-headertext").text("October 2015").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .append(ej.buildTag("span.e-next").append(ej.buildTag('a.e-icon e-arrow-sans-right').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .appendTo(this._sfTimeHour);

            // Render meridian calendar popup.
            if (this._interval < 1) return false;
            var start, end, timeVal, rowCount, table, tr, interval = this._interval * 60000;
            var tableCount = this.model.timeDrillDown.showMeridian ? 2 : 1; rowCount = this.model.timeDrillDown.showMeridian ? 6 : 4;
            var timeDisplayFormat = this.model.timeDrillDown.showMeridian ? "hh" : "HH:00";
            var meridianText = ["AM", "PM"], count = 0, meridianClass = "";

            start = this.timePicker._createObject("12:00:00 AM");
            end = this.model.timeDrillDown.showMeridian ? this.timePicker._createObject("11:59:59 AM") : this.timePicker._createObject("11:59:59 PM");

            for (var i = 0; i < tableCount; i++) {
                if (this.model.timeDrillDown.showMeridian) {
                    meridianClass = meridianText[i].toLowerCase();
                    var txt = !ej.isNullOrUndefined(ej.preferredCulture(this.model.locale).calendars.standard[meridianText[i]]) ? ej.preferredCulture(this.model.locale).calendars.standard[meridianText[i]][0] : "";
                    ej.buildTag("div.e-header-" + meridianClass).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                      .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-hours-meridiantxt-" + meridianClass).text(txt)
                      .attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                      .appendTo(this._sfTimeHour);
                }

                // Table for Time Value
                table = ej.buildTag("table.e-dp-viewhours", "", {}).data("e-table", "data").attr({ 'role': 'grid' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                this._sfTimeHour.append(table);

                var tbody = ej.buildTag('tbody.e-timepicker-hours').attr((this._isIE8) ? { 'unselectable': 'on' } : {});

                tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});

                while (this.timePicker._compareTime(end, start, true)) {
                    timeVal = this._localizeTime(start, timeDisplayFormat);
                    var tdtag = ej.buildTag("td.e-hour e-state-default", timeVal);
                    this.model.timeDrillDown.showMeridian && tdtag.addClass("e-hour-" + meridianClass);
                    if (this._isIE8) tdtag.attr("unselectable", "on");
                    tr.append(tdtag);
                    count++;
                    if (count >= rowCount) {
                        count = 0;
                        tbody.append(tr);
                        tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    }
                    start = this.timePicker._createObject(start).getTime() + interval;
                }

                //tbody.append(tr);
                table.append(tbody);

                if (this.model.timeDrillDown.showMeridian) {
                    start = this.timePicker._createObject("12:00:00 PM");
                    end = this.timePicker._createObject("11:59:59 PM");
                }
            }

            // Rendering the footer template
            ej.buildTag("div.e-footer")
              .append(ej.buildTag("span.e-footer-icon"))
              .append(ej.buildTag("span.e-footer-text"))
              .appendTo(this._sfTimeHour);
            $('.e-footer-text', this._sfTimeHour).html(this._localizedLabels.buttonText.timeNow);
            $(".e-hours-headertext", this._sfTimeHour).text(ej.format(this.datePicker.model.value, "dd MMM yyyy"));

            // Bind action to the item.
            this._on(this._sfTimeHour.find('.e-hour'), "click", $.proxy(this._hourNavHandler, this));
            this._on($('.e-next', this._sfTimeHour), "click", $.proxy(this._prevNextHourHandler, this));
            this._on($('.e-prev', this._sfTimeHour), "click", $.proxy(this._prevNextHourHandler, this));
            this._on($('.e-footer', this._sfTimeHour), "click", this._todayBtn);
            $('.e-hours-headertext', this._sfTimeHour).on("click", $.proxy(this._forwardNavHandler, this));

            this._sfTimeHour.hide();
        },
        _localizeTime: function (value, format) {
            return $.trim(ej.format(this.timePicker._createObject(value), format, this.model.locale));
        },
        _renderMinsPopup: function () {
            this._sfTimeMins = ej.buildTag('div.e-timepicker e-popup e-widget ' + this.model.cssClass + ' e-time-minitues ', "", {}, { id: (this._id ? 'e-time-minitues-' + this._id : "") }).attr({ 'aria-hidden': 'true' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
            if (!ej.isTouchDevice()) this._sfTimeMins.addClass('e-ntouch');
            this._drillDownContainer.append(this._sfTimeMins);

            // Rendering header template
            ej.buildTag("div.e-header").attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                   .append(ej.buildTag("span.e-prev").append(ej.buildTag('a.e-icon e-arrow-sans-left').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-minitues-headertext").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .append(ej.buildTag("span.e-next").append(ej.buildTag('a.e-icon e-arrow-sans-right').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                   .appendTo(this._sfTimeMins);

            // Meridian Header template
            ej.buildTag("div.e-mins-header").attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                          .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-minitues-meridiantxt").text("AM")
                          .attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                          .appendTo(this._sfTimeMins);

            // Table for Time Value
            var table = ej.buildTag("table.e-dp-viewmins", "", {}).data("e-table", "data").attr({ 'role': 'grid' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._sfTimeMins.append(table);

            var tbody = ej.buildTag('tbody.e-timepicker-mins').attr((this._isIE8) ? { 'unselectable': 'on' } : {});

            // Render Time value
            if (this._intervall < 1) return false;
            var start, end, timeVal, interval = this._interval * 60000;
            start = this.timePicker._createObject("12:00:00 AM");
            end = this.timePicker._createObject("11:59:59 PM");
            var tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            var count = 0;
            while (this.timePicker._compareTime(end, start, true)) {
                timeVal = this._localizeTime(start, "HH:00");
                var tdtag = ej.buildTag("td.e-mins e-state-default", timeVal);
                if (this._isIE8)
                    tdtag.attr("unselectable", "on");
                tr.append(tdtag);
                count++;
                if (count >= 4) {
                    count = 0;
                    tbody.append(tr);
                    tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                }
                start = this.timePicker._createObject(start).getTime() + interval;
            }
            //tbody.append(tr);
            table.append(tbody);
            $('.e-minitues-headertext', this._sfTimeMins).text($('.e-hours-headertext', this._sfTimeHour).text());

            // Rendering the footer template
            ej.buildTag("div.e-footer")
               .append(ej.buildTag("span.e-footer-icon"))
               .append(ej.buildTag("span.e-footer-text"))
               .appendTo(this._sfTimeMins);
            $('.e-footer-text', this._sfTimeMins).html(this._localizedLabels.buttonText.timeNow);
            $(".e-minitues-headertext", this._sfTimeMins).text(ej.format(this.datePicker.model.value, "dd MMM yyyy"));
            !this.model.timeDrillDown.showMeridian && $(".e-mins-header", this._sfTimeMins).css("display", "none");

            // Bind action to the item.
            this._on(table.find('.e-mins'), "click", $.proxy(this._minsNavHandler, this));
            this._on($('.e-next', this._sfTimeMins), "click", $.proxy(this._prevNextMinsHandler, this));
            this._on($('.e-prev', this._sfTimeMins), "click", $.proxy(this._prevNextMinsHandler, this));
            this._on($('.e-footer', this._sfTimeMins), "click", this._todayBtn);
            $('.e-minitues-headertext', this._sfTimeMins).on("click", $.proxy(this._forwardNavHandler, this));
            this._sfTimeMins.hide();
        },
        _todayBtn: function () {
            this._nowClick();
            this._hideResult();
        },
        _hourNavHandler: function (e) {
            var value;
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e && $(e.target).hasClass("e-disable")) return false;
            if (e && e.type) e.preventDefault();

            $("table", this._sfTimeHour).find("td").removeClass("e-active");
            $(e.target).addClass("e-active");

            this._sfTimeHour.hide();
            this._sfTimeMins.show();
            this._addFocus(this._sfTimeMins);
            if (this.model.timeDrillDown.showMeridian) {
                var txt = $(e.target).hasClass("e-hour-am") ? "AM" : "PM";
                value = $(e.target).text() + ":00 " + txt;
            }
            else
                value = $(e.target).text();
            this._generateMins(value);
            var temp = new Date(this._datetimeValue.toString()).setMinutes(this.model.value.getMinutes());
            var val = $.trim(ej.format(this.timePicker._createObject(temp), "HH:mm", this.model.locale));
            var val2 = $.trim(ej.format(this.timePicker._createObject(temp), "HH:00", this.model.locale));
            var index = (this.timePicker._parse(val) - this.timePicker._parse(val2)) / (this.model.timeDrillDown.interval * 60000);
            index = Math.ceil(index);
            this._hoverMins = this._setFocusByIndex("mins", index, this._sfTimeMins);
        },
        _minsNavHandler: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e && $(e.target).hasClass("e-disable")) return false;
            if (e && e.type) e.preventDefault();
            $("table", this._sfTimeMins).find("td").removeClass("e-active").removeClass("e-state-hover");
            $(e.target).addClass("e-active");
            if (this.model.timeDrillDown.showMeridian) {
                var value = $(e.target).text() + " " + ej.format(this._datetimeValue, "tt", "en-US");
                value = this.timePicker._localizeTime(value)
            }
            else
                value = $(e.target).text();
            this.timePicker.option("value", value);
            this.datePicker.option("value", this._datetimeValue);
            this._datetimeValue = new Date(this.model.value.toString());
            this._updateInput();
            this.model.timeDrillDown.autoClose && this._hideResult(e);
        },
        _generateMins: function (value) {
            var minsTable = $('table', this._sfTimeMins);
            minsTable.empty();
            this.model.timeDrillDown.showMeridian ? $(".e-mins-header", this._sfTimeMins).show() : $(".e-mins-header", this._sfTimeMins).hide()
            var displayFormat = this.model.timeDrillDown.showMeridian ? "hh:mm" : "HH:mm";
            $('.e-minitues-headertext', this._sfTimeMins).text($('.e-hours-headertext', this._sfTimeHour).text());
            var tbody = ej.buildTag('tbody.e-timepicker-mins').attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            var start, tr, end, timeVal, count = 0, interval = this.model.timeDrillDown.interval * 60000;
            start = this.timePicker._createObject(value);
            this._datetimeValue.setHours(start.getHours());
            end = this.timePicker._createObject(start).getTime() + 59 * 60000;
            tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            tbody.append(tr);
            while (this.timePicker._compareTime(end, start, true)) {
                if (count >= 4) {
                    count = 0;
                    tr = ej.buildTag('tr', "").attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    tbody.append(tr);
                }
                timeVal = this._localizeTime(start, displayFormat);
                var tdtag = ej.buildTag("td.e-mins e-state-default", timeVal);
                if (this._isIE8)
                    tdtag.attr("unselectable", "on");
                tr.append(tdtag);
                count++;
                start = this.timePicker._createObject(start).getTime() + interval;
            }
            minsTable.append(tbody);
            $(".e-mins-header", this._sfTimeMins).find('.e-minitues-meridiantxt').text(ej.format(this._datetimeValue, "tt", this.model.locale))
            this._disableRange("mins");
            this._on(minsTable.find('.e-mins'), "click", $.proxy(this._minsNavHandler, this));
        },
        _prevNextHourHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled) return false;
            event.preventDefault();
            var element = ($(event.target).is('a')) ? $(event.target.parentNode) : $(event.target);
            var progress = element.hasClass('e-prev') ? true : false;
            this._processNextPrev(progress, this._sfTimeHour);
        },
        _prevNextMinsHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled) return false;
            event.preventDefault();
            var element = ($(event.target).is('a')) ? $(event.target.parentNode) : $(event.target);
            var progress = element.hasClass('e-prev') ? true : false;
            this._processNextPrev(progress, this._sfTimeMins);
        },
        _processNextPrev: function (progress, wrapper) {
            if (progress && wrapper.find(".e-arrow-sans-left").hasClass("e-disable")) return false;
            else if (!progress && wrapper.find(".e-arrow-sans-right").hasClass("e-disable")) return false;
            var currentTable = $("table", wrapper), temp;
            var incVal, tClassName = currentTable.get(0).className;
            switch (tClassName) {
                case "e-dp-viewhours":
                    incVal = progress ? -1 : 1;
                    this._datetimeValue.setDate(this._datetimeValue.getDate() + incVal);
                    this._disableRange("hour");

                    this._hoverHour = this._setFocusByIndex("hour", this._hoverHour, this._sfTimeHour);
                    $(".e-hours-headertext", this._sfTimeHour).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    $(".e-minitues-headertext", this._sfTimeMins).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    break;
                case "e-dp-viewmins":
                    incVal = progress ? -1 : 1;
                    this._datetimeValue.setHours(this._datetimeValue.getHours() + incVal);
                    this._generateMins($.trim(ej.format(this.timePicker._createObject(this._datetimeValue), "HH:00", this.model.locale)));

                    var temp = new Date(this._datetimeValue.toString()).setMinutes(this.model.value.getMinutes());
                    var val = $.trim(ej.format(this.timePicker._createObject(temp), "HH:mm", this.model.locale));
                    var val2 = $.trim(ej.format(this.timePicker._createObject(temp), "HH:00", this.model.locale));

                    var index = (this.timePicker._parse(val) - this.timePicker._parse(val2)) / (this.model.timeDrillDown.interval * 60000);
                    index = Math.ceil(index);

                    this._disableRange("mins");

                    this._hoverMins = this._setFocusByIndex("mins", index, this._sfTimeMins);

                    $(".e-hours-headertext", this._sfTimeHour).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    $(".e-minitues-headertext", this._sfTimeMins).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    break;
            }
        },
        _forwardNavHandler: function (event, table) {
            if (this.model.readOnly || !this.model.enabled) return false;
            var hclassName, proxy = this;
            if (event) event.preventDefault();
            if (event)
                hclassName = $(event.currentTarget).get(0).className;
            else
                hclassName = table.find(".e-text>span").get(0).className;

            switch (hclassName) {
                case "e-hours-headertext":
                    this._sfTimeHour.css("display", "none");
                    this._dateContainer.css("display", "block");
                    this._addFocus(this._dateContainer.find('.e-datepicker'));
                    break;
                case "e-minitues-headertext":
                    this._sfTimeMins.css("display", "none");
                    this._disableRange("hour");

                    var start = this._localizeTime(this.timePicker._createObject("12:00:00 AM"), "HH:00")
                    var val = $.trim(ej.format(this.timePicker._createObject(this._datetimeValue), "HH:00", this.model.locale));
                    indx = (this.timePicker._parse(val) - this.timePicker._parse(start)) / (this._interval * 60000);
                    indx = Math.floor(indx);

                    this._hoverHour = this._setFocusByIndex("hour", indx, this._sfTimeHour);

                    $(".e-hours-headertext", this._sfTimeHour).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    $(".e-minitues-headertext", this._sfTimeMins).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
                    this._sfTimeHour.css("display", "block");
                    this._addFocus(this._sfTimeHour);
                    break;
            }
        },
        _renderDateControl: function () {
            var dateInput = ej.buildTag("input#" + this.element[0].id + "_date", "", {}, { "type": "text" });
            this.popup.append(dateInput);
            dateInput.ejDatePicker({

                height: "0px", width: "0px",
                displayInline: true,
                showDateIcon: false,
                showFooter: this.model.timeDrillDown.enabled ? this.model.timeDrillDown.showFooter : false,
                enableStrictMode: true,
                buttonText: this._localizedLabels.buttonText.today,

                minDate: this._stringToObject(this.model.minDateTime),
                maxDate: this._stringToObject(this.model.maxDateTime),

                dayHeaderFormat: this.model.dayHeaderFormat,
                startLevel: this.model.startLevel,
                depthLevel: this.model.depthLevel,
                startDay: this.model.startDay,
                stepMonths: this.model.stepMonths,
                showOtherMonths: this.model.showOtherMonths,
                headerFormat: this.model.headerFormat,

                enabled: this.model.enabled,
                enableRTL: this.model.enableRTL,
                showRoundedCorner: this.model.showRoundedCorner,
                readOnly: this.model.readOnly,
                cssClass: this.model.cssClass,
                locale: this.model.locale,
                
            });
            if (!ej.isNullOrUndefined(this.model.value))
                this._datetimeValue = new Date(this.model.value.toString());
            this.datePicker = dateInput.data("ejDatePicker");
            this._datetimeValue = new Date(this.datePicker._dateValue.toString());
            this.model.startDay = this.datePicker.model.startDay;
            this.datePicker._getInternalEvents = true;
            this.datePicker._dt_drilldown = true;
            this.datePicker.popup.css({ "position": "static", "display": "block" });
        },
        _renderTimeControl: function () {
            var timeInput = ej.buildTag("input#" + this.element[0].id + "_time", "", {}, { "type": "text" });
            this.popup.append(timeInput);
            var popupWidth = this.model.timePopupWidth,width;
            if ((typeof (popupWidth) == "string" && popupWidth.indexOf("%") != -1) || typeof (popupWidth) == "string") width = parseInt(popupWidth) > 0 ? popupWidth : 105 && (this.model.timePopupWidth = 105);
            else {
                width = popupWidth > 0 ? popupWidth : 105 && (this.model.timePopupWidth = 105);
            }
            timeInput.ejTimePicker({
                height: "0px", width: "0px",
                interval: this.model.interval,
                timeFormat: this.model.timeDisplayFormat,
                popupWidth: width,
                enabled: this.model.enabled,
                enableRTL: this.model.enableRTL,
                showRoundedCorner: this.model.showRoundedCorner,
                readOnly: this.model.readOnly,
                cssClass: this.model.cssClass,
                locale: this.model.locale,
            });
            this.timePicker = timeInput.data("ejTimePicker");
            this.timePicker._renderDropdown();
            this.timePicker.popup.css({ "position": "static", "display": "block" });
            this.timePicker._getInternalEvents = true;
            this.timePicker.showDropdown = true;
            this.timePicker._dateTimeInternal = true;
            var min = (this.model.minDateTime) ? this._stringToObject(this.model.minDateTime) : this.defaults.minDateTime;
            var max = (this.model.maxDateTime) ? this._stringToObject(this.model.maxDateTime) : this.defaults.maxDateTime;

        },
        _updateTimeHeight: function () {
            var height = this.popup.find(".e-timecontainer .e-header").is(":visible") ? this.datePicker.popup.height() - this.popup.find(".e-header").height() : this.datePicker.popup.height();
            height = this.popup.hasClass("e-dt-responsive") ? "98px" : height;
            this.timePicker.option("popupHeight", height);
        },

        _bindOperations: function () {
            var proxy = this;
            this.datePicker.option("layoutChange", function () { proxy._updateTimeHeight(); });
            this.datePicker.option("outOfRange", function () { proxy.isValidState = false; });
            this.timePicker.option("outOfRange", function () { proxy.isValidState = false; });
            this.datePicker.option("change", function (a) {
                proxy._refreshTimes(a);
            });
            this.datePicker.option("select", function (e) {
                proxy._updateInput(e);
            });
            this.datePicker.option("dt_drilldown", function (e) {
                if (proxy.model.timeDrillDown.enabled) {
                    proxy._updateInput(e);
                    proxy._switchToDrilDown(e);
                }
            });
            this.timePicker.option("select", function () { proxy._updateInput(); });
        },
        _switchToDrilDown: function (e) {
            this._dateContainer.hide();
            this._sfTimeHour.show();
            this._addFocus(this._sfTimeHour);
            var selected = new Date(this.model.value.toString());
            this._datetimeValue = new Date(selected.setHours(this._datetimeValue.getHours(), this._datetimeValue.getMinutes(), this._datetimeValue.getSeconds(), this._datetimeValue.getMilliseconds()));

            // To hide the hours that exceeds the min and max.
            this._disableRange("hour");

            var start = this._localizeTime(this.timePicker._createObject("12:00:00 AM"), "HH:00")
            var val = $.trim(ej.format(this.timePicker._createObject(this._datetimeValue), "HH:00", this.model.locale));
            var indx = (this.timePicker._parse(val) - this.timePicker._parse(start)) / (this._interval * 60000);
            indx = Math.floor(indx);

            this._hoverHour = this._setFocusByIndex("hour", indx, this._sfTimeHour);

            $(".e-hours-headertext", this._sfTimeHour).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
            $(".e-minitues-headertext", this._sfTimeMins).text(ej.format(this._datetimeValue, "dd MMM yyyy"));
        },
        _disableRange: function (view) {
            var interval = view == "hour" ? this._interval : this.model.timeDrillDown.interval, table = view == "hour" ? this._sfTimeHour : this._sfTimeMins
            var addClassName = view == "hour" ? "e-hide-hour e-disable" : "e-hide-mins e-disable";
            table.find('tbody tr td.e-' + view).removeClass(addClassName);
            table.find('.e-arrow-sans-left').removeClass("e-disable");
            table.find('.e-arrow-sans-right').removeClass("e-disable");
            var start = view == "hour" ? this._localizeTime(this.timePicker._createObject("12:00:00 AM"), "HH:00") :
                this._localizeTime($.trim(ej.format(this.timePicker._createObject(this._datetimeValue), "HH:00", this.model.locale)), "HH:00");

            if (this._compareDate(this.model.minDateTime, this._datetimeValue)) {
                if (view == "mins")
                    if (!(this.model.minDateTime.getHours() === this._datetimeValue.getHours())) return false;
                var val = $.trim(ej.format(this.timePicker._createObject(this.model.minDateTime), "HH:mm", this.model.locale));
                indx = (this.timePicker._parse(val) - this.timePicker._parse(start)) / (interval * 60000);
                indx = view == "hour" ? Math.floor(indx) : Math.ceil(indx);
                for (i = 0; i < indx; i++) {
                    var allValues = table.find('tbody tr td.e-' + view), cell;
                    cell = allValues[i];
                    $(cell).addClass(addClassName);
                }
                table.find('.e-arrow-sans-left').addClass("e-disable");
            }
            if (this._compareDate(this.model.maxDateTime, this._datetimeValue)) {
                if (view == "mins")
                    if (!(this.model.maxDateTime.getHours() === this._datetimeValue.getHours())) return false;
                var val = $.trim(ej.format(this.timePicker._createObject(this.model.maxDateTime), "HH:mm", this.model.locale));
                indx = (this.timePicker._parse(val) - this.timePicker._parse(start)) / (interval * 60000);
                indx = Math.floor(indx) + 1;
                var length = table.find('tbody tr td.e-' + view).length
                for (i = indx; i < length; i++) {
                    var allValues = table.find('tbody tr td.e-' + view), cell;
                    cell = allValues[i];
                    $(cell).addClass(addClassName);
                }
                table.find('.e-arrow-sans-right').addClass("e-disable");
            }
        },
        _setFocusByName: function (name, value, table) {
            var allValues = table.find('tbody tr td.e-' + name), index, cell;
            $(allValues).each(function (i, ele) {
                if (ele.innerHTML == value) {
                    index = i;
                    return;
                }
            });
            cell = allValues[index];
            if (!cell) cell = allValues.last();
            table.find('table td').removeClass("e-state-hover").removeClass('e-active');
            if (!$(cell).hasClass("e-hide-" + name))
                $(cell).addClass("e-state-hover");
            this._setActiveState(name, table);
            return index;
        },

        _setFocusByIndex: function (name, index, table) {
            var allValues = table.find('tbody tr td.e-' + name), cell;
            cell = allValues[index];
            if (!cell) cell = allValues.last();
            table.find('table td').removeClass("e-state-hover").removeClass('e-active');
            if (!$(cell).hasClass("e-hide-" + name))
                $(cell).addClass("e-state-hover");
            this._setActiveState(name, table);
            return index;
        },

        _setActiveState: function (selection, table) {
            var items = table.find('tbody tr td.e-' + selection), cell, proxy = this;
            var indx = -1;
            switch (selection) {
                case "hour":
                    if (this._compareDate(this.model.value, this._datetimeValue)) {

                        var start = this._localizeTime(this.timePicker._createObject("12:00:00 AM"), "HH:00")
                        var val = $.trim(ej.format(this.timePicker._createObject(this.model.value), "HH:00", this.model.locale));
                        indx = (this.timePicker._parse(val) - this.timePicker._parse(start)) / (this._interval * 60000);
                        indx = Math.floor(indx);

                    }
                    break;
                case "mins":
                    if (this._compareDate(this.model.value, this._datetimeValue) && (this.model.value.getHours() === this._datetimeValue.getHours())) {

                        var temp = new Date(this._datetimeValue.toString()).setMinutes(this.model.value.getMinutes());
                        var val = $.trim(ej.format(this.timePicker._createObject(temp), "HH:mm", this.model.locale));
                        var val2 = $.trim(ej.format(this.timePicker._createObject(temp), "HH:00", this.model.locale));

                        indx = (this.timePicker._parse(val) - this.timePicker._parse(val2)) / (this.model.timeDrillDown.interval * 60000);
                        indx = Math.ceil(indx);
                    }
                    break;
            }
            cell = items[indx];
            if (cell) {
                table.find('table td').removeClass("e-active");
                $(cell).removeClass("e-state-hover").addClass("e-active");
            }
        },

        _compareDate: function (first, second) {
            var val1 = new Date(first.toString()).setHours(0, 0, 0, 0);
            var val2 = new Date(second.toString()).setHours(0, 0, 0, 0);
            var result = (+val1 === +val2) ? true : false;
            return result;
        },

        _updateInput: function (e) {
            var minVal = new Date().setHours(0, 0, 0, 0);
            var date = this._getDate() || new Date(), time = this._getTime() || this.timePicker._createObject(minVal);
            this.model.value = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                time.getHours(), time.getMinutes(), time.getSeconds());
            this._updateDateTime();
            this._raiseChangeEvent();
            this._updateModel(e, true);
            if (e)
                e.cancel = true;
        },
        _updateDateTime: function () {
            this.isValidState = true;
            var datetime = this._objectToString(this.model.value);
            this.element.val(datetime);
            this._removeWatermark();
        },
        _refreshTimes: function (args) {
            var value = this._getDateObj(args.value, this.datePicker.model.dateFormat);
            if (!value) return false;
            this.isValidState = true;

            if (this._compare(value, this._setEmptyTime(this.model.minDateTime))) {
                var mintime = this._getFormat(this.model.minDateTime, this.timePicker.model.timeFormat);
                var preTime = this._getTime();
                this.timePicker.option("minTime", mintime);
                if (!this.model.enableStrictMode) {
                    this._updateInput();
                }
            }
            else
                this.timePicker.option("minTime", this._defaultMinVal());

            if (this._compare(value, this._setEmptyTime(this.model.maxDateTime))) {
                var maxtime = this._getFormat(this.model.maxDateTime, this.timePicker.model.timeFormat);
                var preTime = this._getTime();
                this.timePicker.option("maxTime", maxtime);
                if (!this.model.enableStrictMode) {
                    this._updateInput();
                }
            }
            else
                this.timePicker.option("maxTime", this._defaultMaxVal());

            this.timePicker._changeActiveEle();
            if (!ej.isNullOrUndefined(this.model.disableDateTimeRanges)) {
                this._setDisabledTimeRanges(args);				
            }

        },
		_setDisabledTimeRanges: function(args){
				var currvalue = args? args.value : this._setEmptyTime(this.model.value);
				this._between=[];
                this._initDisableTimeRanges(currvalue);
				if(!this._datesDisabled){
					this._disableBetweenDates();
					this.datePicker.option("blackoutDates", this._between);
				}
		},

        _defaultMinVal: function () {
            var minVal = new Date().setHours(0, 0, 0, 0);
            var minTimeVal = ej.format(this.timePicker._createObject(minVal), this.timePicker.model.timeFormat, this.timePicker.model.locale);
            return minTimeVal;
        },
        _defaultMaxVal: function () {
            var maxval = new Date().setHours(23, 59, 59, 59);
            var maxTimeVal = ej.format(this.timePicker._createObject(maxval), this.timePicker.model.timeFormat, this.timePicker.model.locale);
            return maxTimeVal;
        },
        _updateValues: function () {
            var dateValue = this.model.enableStrictMode && this.model.value == null ? this.element.val() : this.model.value;
            if (this.model.value != null) {
                this.datePicker.option("value", this.model.value);
                this.timePicker.option("value", this.model.value);
            }
            this._setValue(dateValue);
            this._validateMinMax();
            this._preVal = this.element.val();
            this._checkErrorClass();
        },
        _specificFormat: function () {
            var parseInfo = ej.globalize._getDateParseRegExp(ej.globalize.findCulture(this.model.locale).calendar, this.model.dateFormat);
            return ($.inArray("dddd", parseInfo.groups) > -1 || $.inArray("ddd", parseInfo.groups) > -1)
        },
        _changeEditable: function (bool) {
            var action = bool ? "_on" : "_off";
            if (this.element.is(":input")) {
                if (bool) {
                    if (!this.model.readOnly) this.element.attr("readonly", false);
                    this.element.off("mousedown", $.proxy(this._showhidePopup, this));
                }
                else {
                    if (!this.model.readOnly) this.element.attr("readonly", "readonly");
                    this.element.on("mousedown", $.proxy(this._showhidePopup, this));
                }
                this[action](this.element, "blur", this._targetBlur);
                this[action](this.element, "focus", this._targetFocus);
                this[action](this.element, "keydown", this._keyDownOnInput);
            }
            this._change("allowEdit", bool);
        },
        _setValue: function (value) {
            if (!value || (typeof JSON === "object" && JSON.stringify(value) === "{}")) {
                this.element.val("");
                this.model.value = null;
                this.isValidState = true;
                this.wrapper.removeClass('e-valid');
            }
            else if (typeof value === "string") {
                if (this._extISORegex.exec(value) || this._basicISORegex.exec(value)) this._checkObject(this._dateFromISO(value));
                else {
                    this.element.val(value);
                    this._updateModel();
                    this._validateMinMax();
                    this._checkStrictMode();
                    this.wrapper.addClass('e-valid');
                }
            }
            else if (value instanceof Date && this._isValidDate(value)) {
                this._checkObject(value);
            }
			if(!ej.isNullOrUndefined(this.model.disableDateTimeRanges))this._validateDisableRanges();
            this._checkErrorClass();
            return this.model.value;
        },
        _checkObject: function (value) {
            if (value instanceof Date && this._isValidDate(value)) {
                this.model.value = value;
                this._updateDateTime();
                this._validateMinMax();
                this._checkStrictMode();
            }
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
        _validateValue: function (value) {
            var dateObj = ej.parseDate(value, this.model.dateTimeFormat,this.model.locale);
            if (!dateObj || dateObj < this.model.minDateTime || dateObj > this.model.maxDateTime) {
                this.model.value = null;
                this._change("value", this.model.value);
                this.isValidState = false;
            }
            else {
                this._change("value", this.model.value);
                this.isValidState = true;
            }
        },
        _validateMinMax: function () {
            var value, min, max;
            value = (this.model.value) ? this._stringToObject(this.model.value) : null;
            min = (this.model.minDateTime) ? this._stringToObject(this.model.minDateTime) : this.defaults.minDateTime;
            max = (this.model.maxDateTime) ? this._stringToObject(this.model.maxDateTime) : this.defaults.maxDateTime;
            if (!value || !min || !max) return false;
            if (min > max) this.model.minDateTime = this.model.maxDateTime;
            if (value < min) {
                if (!this.model.enableStrictMode) {
                    this._setValue(min);
                    this.isValidState = true;
                }
                else if (this.model.enableStrictMode) {
					if (this.popup){
                    this.datePicker.option('minDate', this._getFormat(min, this.datePicker.model.dateFormat));
                    this.timePicker.option('minTime', this._getFormat(min, this.timePicker.model.timeFormat));
					}
                    this.isValidState = false;
                }
            }
            if (value > max) {
                if (!this.model.enableStrictMode) {
                    this._setValue(max);
                    this.isValidState = true;
                }
                else if (this.model.enableStrictMode) {
					if (this.popup){
                    this.datePicker.option('maxDate', this._getFormat(max, this.datePicker.model.dateFormat));
                    this.timePicker.option('maxTime', this._getFormat(max, this.timePicker.model.timeFormat));
					}
                    this.isValidState = false;

                }
            }

            if (!(value < min) && !(value > max)) this.isValidState = true;
        },

        _checkProperties: function () {
            this.model.readOnly && this._readOnly(true);
            this.model.showRoundedCorner && this._setRoundedCorner(true);
            this.model.enableRTL && this._setRtl(true);
            this.model.enabled && this._enabled(true);
            if (!this.model.enabled) this._enabled(false);
            else if (this.model.enabled && this.element.hasClass("e-disable")) this._enabled(true);
            this.model.name = !this._options.name ? !this.element.attr("name") ? this.element[0].id : this.element.attr("name") : this.model.name;
            this.element.attr("name", this.model.name);
            this._checkStrictMode();
            this._checkErrorClass();
            this._setWaterMark();
        },

        _checkStrictMode: function () {
            if (!this.model.enableStrictMode) {
                if (!this.isValidState) {
                    if (this.model.value < this.model.minDateTime) {
                        this.element.val(this._objectToString(this.model.minDateTime));
                        this.model.value = this.model.minDateTime;
                        this.isValidState = true;
                    }
                    else if (this.model.value > this.model.maxDateTime) {
                        this.element.val(this._objectToString(this.model.maxDateTime));
                        this.model.value = this.model.maxDateTime;
                        this.isValidState = true;
                    }
                    else {
                        this.model.value = "";
                        this.element.val("");
                        this.isValidState = true;
                    }
                }
            }
            else if (this.model.enableStrictMode) {
                if (!this.isValidState) {

                    this.model.value = null;
                    this.isValidState = false;
                }
            }
        },

        _targetFocus: function (e) {
            e.preventDefault();
            this.isFocused = true;
            this.wrapper.addClass("e-focus");
            this.wrapper.removeClass("e-error");
            if (!this._isSupport) this._hiddenInput.css("display", "none");
            this._prevDateTimeVal = this.element.val();
            if (!this.model.showPopupButton && !this.model.readOnly) this._showResult();
            if (!this.model.showPopupButton) this._on(this.element, "click", this._elementClick);
            if (!this.model.showPopupButton && this.model.readOnly) this._off(this.element, "click", this._elementClick);
            this._trigger("focusIn", { value: this.model.value });
            this.wrapper.addClass('e-valid');
        },
        _targetBlur: function () {
            this.isFocused = false;
            this.wrapper.removeClass("e-focus");
            if (!this.model.showPopupButton) this._hideResult();
            var dateObj = ej.parseDate(this.element.val(), this.model.dateTimeFormat, this.model.locale);
            if (dateObj && !this.model.enableStrictMode) {
                if (dateObj < this.model.minDateTime || dateObj > this.model.maxDateTime) {
                    dateObj = dateObj < this.model.minDateTime ? this.model.minDateTime : this.model.maxDateTime;
                    this.element.val(this._objectToString(dateObj));
                }
            }
            var val = ej.parseDate(this.element.val(), this.model.dateTimeFormat, this.model.locale);
            if (val == null && !this.model.enableStrictMode) {
                if (this._prevDateTimeVal == null || this.element.val() == "") {
                    this.element.val("");
                } else
                    this.element.val(this._preVal);
            }
            this._valueChange();
            if (!this.model.enableStrictMode) {
                if (!this.isValidState) {
                    this.element.val(this._prevDateTimeVal);
                    this._preVal = this._prevDateTimeVal;
                    this.model.value = this._stringToObject(this._prevDateTimeVal);
                    this.isValidState = true;
                }
                else
                    this._prevDateTimeVal = this.element.val();
            } else if (this.element.val() != "")
                this._validateValue(this.element.val());
            if (!this._isSupport && this.element.val() == "")
                this._hiddenInput.css("display", "block");
            this._checkErrorClass();
            if (!this.model.showPopupButton) this._off(this.element, "click", this._elementClick);
            this._trigger("focusOut", { value: this.model.value });
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
            this._previousDateUpdate();
        },
        _previousDateUpdate: function () {
            var previous = ej.parseDate(this._prevDateTime, this.model.dateTimeFormat);
            var current = ej.parseDate(this.element.val(), this.model.dateTimeFormat);
            if (!(+previous === +current)) {
                this._preValString = this._prevDateTime;
                this._prevDateTime = this.element.val();
            }
            return this._preValString;
        },
        _elementClick: function () {
            if (!this.isPopupOpen) this._showResult();
        },
        _keyDownOnInput: function (e) {
            switch (e.keyCode) {
                case 40:
                    if (e.altKey) this._showhidePopup();
                    break;
                case 37:
                case 39:
                    if (!this.model.timeDrillDown.enabled)
                        if (e.altKey && this.isPopupOpen) {
                            e.preventDefault();
                            this._addPrevNextFocus(e.keyCode == 37);
                        }
                    break;
                case 27:
                    e.preventDefault();
                case 9:
                    this._hideResult();
                    break;
                case 13:    // Enter Key
                    var val = ej.parseDate(this.element.val(), this.model.dateTimeFormat);
                    if (val == null && !this.model.enableStrictMode) {
                        if (this._prevDateTimeVal == null || this.element.val() == "") {
                            this.element.val("");
                        } else
                            this.element.val(this._preVal);
                    }
                    this._valueChange();
                    if (!this.model.timeDrillDown.enabled) {
                        this._valueChange();
                        if (this.model.enableStrictMode)
                            this._checkErrorClass();
                        break;
                    }
            }
        },
        _addFocus: function (target) {
            if (!target.hasClass("e-focus")) {
                this._removeFocus();
                target.addClass("e-focus");
                if (target.hasClass("e-datepicker e-popup"))
                    $(document).on("keydown", $.proxy(this.datePicker._keyboardNavigation, this.datePicker));
                else if (target.hasClass("e-timecontainer"))
                    $(document).on("keydown", $.proxy(this.timePicker._keyDownOnInput, this.timePicker));
                else if (target.hasClass("e-time-hours"))
                    $(document).on("keydown", $.proxy(this._keyDownOnHours, this));
                else if (target.hasClass("e-time-minitues"))
                    $(document).on("keydown", $.proxy(this._keyDownOnMinutes, this));
                else if (target.hasClass("e-dt-button"))
                    $(document).on("keydown", $.proxy(this._buttonClick, this));
            }
        },
        _removeFocus: function () {
            var target = this._getFocusedElement();
            if (target.length > 0) {
                target.removeClass("e-focus");
                if (target.hasClass("e-datepicker e-popup"))
                    $(document).off("keydown", $.proxy(this.datePicker._keyboardNavigation, this.datePicker));
                else if (target.hasClass("e-timecontainer"))
                    $(document).off("keydown", $.proxy(this.timePicker._keyDownOnInput, this.timePicker));
                else if (target.hasClass("e-time-hours"))
                    $(document).off("keydown", $.proxy(this._keyDownOnHours, this));
                else if (target.hasClass("e-time-minitues"))
                    $(document).off("keydown", $.proxy(this._keyDownOnMinutes, this));
                else if (target.hasClass("e-dt-button"))
                    $(document).off("keydown", $.proxy(this._buttonClick, this));
            }
        },
        _addPrevNextFocus: function (flag) {
            // flag true means previous focus, false means next focus
            var target = this._getFocusedElement(), next;
            if (target.length > 0) {
                if (target.hasClass("e-datepicker e-popup"))
                    next = flag ? this.popup.find(".e-dt-done") : this.popup.find(".e-timecontainer");
                else if (target.hasClass("e-timecontainer"))
                    next = flag ? this.popup.find(".e-datecontainer >.e-datepicker.e-popup") : this.popup.find(".e-dt-today");
                else if (target.hasClass("e-dt-today"))
                    next = flag ? this.popup.find(".e-timecontainer") : this.popup.find(".e-dt-now");
                else if (target.hasClass("e-dt-now"))
                    next = flag ? this.popup.find(".e-dt-today") : this.popup.find(".e-dt-done");
                else if (target.hasClass("e-dt-done"))
                    next = flag ? this.popup.find(".e-dt-now") : this.popup.find(".e-datecontainer >.e-datepicker.e-popup");
            }
            else next = flag ? this.popup.find(".e-dt-done") : this.popup.find(".e-datecontainer >.e-datepicker.e-popup");
            this._addFocus(next);
        },
        _getFocusedElement: function () {
            return this.popup.children("div").find("div.e-focus")
        },
        _keyDownOnHours: function (e) {
            if ((e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 36 || e.keyCode == 35)) {
                e.preventDefault && e.preventDefault();
                var t = { row: null, col: null };

                t.col = this._sfTimeHour.find('tbody tr td.e-state-hover').index();
                t.row = this._sfTimeHour.find('tbody tr td.e-state-hover').parent().index();

                if (t.col != -1)
                    t.col = t.col + 1;
                else
                    t.col = this._sfTimeHour.find('tbody tr td.e-active').index() + 1;


                if (t.row != -1) {
                    t.row = t.row + 1;
                    if (this.model.timeDrillDown.showMeridian && this._sfTimeHour.find('tbody tr td.e-state-hover').hasClass('e-hour-pm'))
                        t.row = t.row + 2;
                }
                else {
                    t.row = this._sfTimeHour.find('tbody tr td.e-active').parent().index() + 1;
                    if (this.model.timeDrillDown.showMeridian && this._sfTimeHour.find('tbody tr td.e-active').hasClass('e-hour-pm'))
                        t.row = t.row + 2;
                }

                var tableClass = this._sfTimeHour.find('table')[0].className, next;
                rowLength = this._sfTimeHour.find('tbody.e-timepicker-hours tr').length, colLength = this.model.timeDrillDown.showMeridian ? 6 : 4;
                next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "hours", e.ctrlKey);
                if (!e.ctrlKey) this._hoverHour = this._sfTimeHour.find('tbody.e-timepicker-hours tr td').index(next);

                if (!e.ctrlKey) {
                    this._sfTimeHour.find('table td').removeClass("e-state-hover");
                    next.addClass("e-state-hover");
                }
            }
        },

        _changeRowCol: function (t, key, rows, cols, target, ctrlKey) {
            var eleClass, table, cls = { parent: null, child: null };
            switch (target) {
                case "hours": eleClass = "tbody.e-timepicker-hours tr td.e-hour";
                    cls.parent = ".e-timepicker-hours", cls.child = ".e-hour";
                    hiddenClass = ".e-hide-hour";
                    table = this._sfTimeHour;
                    break;
                case "mins": eleClass = "tbody.e-timepicker-mins tr td.e-mins";
                    cls.parent = ".e-timepicker-mins", cls.child = ".e-mins";
                    hiddenClass = ".e-hide-mins";
                    table = this._sfTimeMins;
                    cols = table.find('tbody' + cls.parent + ' tr:nth-child(' + t.row + ') td' + cls.child).length;
                    break;

            }
            if (t.row <= 0 && t.col <= 0)
                return table.find(eleClass + ':not(.e-disable):first');
            var cell, proxy = this;
            switch (key) {
                case 36:
                    return table.find(eleClass + ':not(.e-disable):first');
                case 35:
                    return table.find(eleClass + ':not(.e-disable):last');
                case 38:
                    if (ctrlKey) {
                        this._forwardNavHandler(null, table);
                    }
                    else if (t.row > 1) {
                        t.row -= 1;
                    }
                    else {
                        this._processNextPrev(true, table);
                        cell = table.find(eleClass + ':nth-child(' + t.col + '):last');
                        return cell;
                    }
                    cell = this._getCell(t, cls, table).not(hiddenClass);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "up", table);
                        if (cell !== null) return cell;
                        this._processNextPrev(true, table);
                        cell = table.find(eleClass + ':nth-child(' + t.col + '):last');
                    }
                    return cell;
                case 37:
                    if (ctrlKey) {
                        this._processNextPrev(true, table);
                        return table.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col > 1)
                        t.col -= 1;
                    else if (t.row > 1) {
                        t = { row: t.row - 1, col: cols }
                        // different columns for the mins popup.
                        if (target == "mins") t.col = cols = table.find('tbody' + cls.parent + ' tr:nth-child(' + t.row + ') td' + cls.child).length;
                    }
                    else {
                        this._processNextPrev(true, table);
                        cell = table.find(eleClass + ':not(.e-disable):last');
                        return cell;
                    }
                    cell = this._getCell(t, cls, table).not(hiddenClass);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "left", table);
                        if (cell !== null) return cell;
                        this._processNextPrev(true, table);
                        cell = table.find(eleClass + ':not(.e-disable):last');
                    }
                    return cell;
                case 39:
                    if (ctrlKey) {
                        this._processNextPrev(false, table);
                        return table.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col < cols)
                        t.col += 1;
                    else if (t.row < rows) {
                        t = { row: t.row + 1, col: 1 }
                    }
                    else {
                        this._processNextPrev(false, table);
                        cell = table.find(eleClass + ':not(.e-disable):first');
                        return cell;
                    }
                    cell = this._getCell(t, cls, table).not(hiddenClass);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "right", table);
                        if (cell !== null) return cell;
                        this._processNextPrev(false, table);
                        cell = table.find(eleClass + ':not(.e-disable):first');
                    }
                    return cell;
                case 40:
                    if (!ctrlKey) {
                        if (t.row < rows) {
                            t.row += 1;
                        }
                        else {
                            this._processNextPrev(false, table);
                            cell = table.find(eleClass + ':nth-child(' + t.col + '):first');
                            return cell;
                        }
                        cell = this._getCell(t, cls, table).not(hiddenClass);
                        if (cell.length <= 0) {
                            cell = this._findVisible(t, cls, "down", table);
                            if (cell !== null) return cell;
                            this._processNextPrev(false, table);
                            cell = table.find(eleClass + ':nth-child(' + t.col + '):first');
                        }
                        return cell;
                    }
                case 13:
                    var ele, element;
                    ele = this._getCell(t, cls, table); element = $(ele)[0];
                    args = { type: null, target: ele };
                    if (target == "hours") this._hourNavHandler(args);
                    if (target == "mins") this._minsNavHandler(args);
                    break;
            }
            return this._getCell(t, cls, table).not(hiddenClass);
        },
        _getCell: function (t, cls, table) {
            var row = t.row;
            if (this.model.timeDrillDown.showMeridian && t.row > 2 && table.hasClass('e-time-hours'))
                row = row - 2;
            var cell = table.find('tbody' + cls.parent + ' tr:nth-child(' + row + ') td' + cls.child + ':nth-child(' + t.col + ')');
            if (this.model.timeDrillDown.showMeridian && cell.length > 0 && table.hasClass('e-time-hours'))
                cell = t.row <= 2 ? $(cell[0]) : $(cell[1]);
            return cell;
        },
        _findVisible: function (t, cls, key, table) {
            var cols = t.col, rows = t.row, requiredClass = cls.child.slice(1, cls.child.length);
            for (i = 0; i >= 0; i++) {
                //nextElement = table.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td:nth-child(' + cols + ')');
                nextElement = this._getCell({ row: rows, col: cols }, cls, table)
                if (nextElement.length <= 0) {
                    return null;
                }
                if (nextElement.hasClass('e-disable') || !nextElement.is(":visible")) {
                    key == "right" || key == "left" ? (key == "right" ? cols++ : cols--) : (key == "down" ? rows++ : rows--);
                    if ((rows <= 0) || (rows > table.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                    // Column exceeds the range. 
                    if (cols > table.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length) {
                        //move to next row and select first column
                        rows++;
                        cols = 1;
                    }
                    if (cols <= 0) {
                        //move to previous row and select last column
                        rows--;
                        cols = table.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length;
                    }
                    // Row exceeds the range.
                    if ((rows <= 0) || (rows > table.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                } else if (nextElement.hasClass(requiredClass)) {
                    t.col = cols; t.row = rows;
                    nextElement = this._getCell(t, cls, table)
                    return nextElement;
                }
            }
        },
        _keyDownOnMinutes: function (e) {
            if ((e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 36 || e.keyCode == 35)) {
                e.preventDefault && e.preventDefault();
                var t = { row: null, col: null };

                t.col = this._sfTimeMins.find('tbody tr td.e-state-hover').index();
                t.row = this._sfTimeMins.find('tbody tr td.e-state-hover').parent().index();

                t.col = (t.col != -1) ? t.col + 1 : this._sfTimeMins.find('tbody tr td.e-active').index() + 1;
                t.row = (t.row != -1) ? t.row + 1 : this._sfTimeMins.find('tbody tr td.e-active').parent().index() + 1;

                var tableClass = this._sfTimeMins.find('table')[0].className, next;
                rowLength = this._sfTimeMins.find('tbody.e-timepicker-mins tr').length, colLength = 4;
                next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "mins", e.ctrlKey);
                if (!e.ctrlKey) this._hoverHour = this._sfTimeMins.find('tbody.e-timepicker-mins tr td').index(next);

                if (!e.ctrlKey) {
                    this._sfTimeMins.find('table td').removeClass("e-state-hover");
                    next.addClass("e-state-hover");
                }
            }
        },
        _valueChange: function (isCode) {
            if (!this.model.enableStrictMode) {
                if (this._preVal != this.element.val()) {
                    this._preVal = this.element.val();
                    this._updateModel();
                    this._validateMinMax();
                    this._raiseChangeEvent(isCode);
                }
                this._setWaterMark();
            }
            else if (this.model.enableStrictMode) {
                if (this._preVal != this.element.val() || this.model.value < this.model.minDateTime || this.model.value > this.model.maxDateTime) {
                    this._updateModel();
                    this._raiseChangeEvent(isCode);
                }
            }
        },
        _updateModel: function (e, stopUpdateModel) {
            if (this._stopRefresh) {
                this._stopRefresh = false
                return;
            }
            var value = this.element.val();
            if (value == "") {
                this.model.value = null;
                this._change("value", this.model.value);
                this.isValidState = true;
            }
            else {
                var dateObj;
                if (e != undefined && e.type == "select" || this._prevDateTimeVal == this.element.val()) dateObj = this.model.value;
                else dateObj = ej.parseDate(value, this.model.dateTimeFormat, this.model.locale);
                if (dateObj) {
                    this.model.value = dateObj;
                    this.isValidState = true;
                    if (!stopUpdateModel)
                        this._refreshPopup();
                    if (this._specificFormat() && this._prevDateTimeVal != this.element.val())
                        this.element.val(this._objectToString(this.model.value));
                }
                else {
                    this.model.value = null;
                    this._change("value", this.model.value);
                    this.isValidState = false;
                    if (!this.model.enableStrictMode)
                        this.element.val(this._objectToString(this.model.value));
                }
            }
        },
        _refreshPopup: function () {
            if (this.isValidState && this.isPopupOpen) {
                var date = this._setEmptyTime(this.model.value), time = this._setEmptyDate(this.model.value);
                var getDate = this._getDate(), getTime = this._getTime();
                if (!getDate || !this._compare(getDate, date)) this.datePicker.option("value", date);
                if (!getTime || !this._compare(getTime, time)) this.timePicker.option("value", time);
            }
        },

        _buttonClick: function (e) {
            if (e.keyCode == 13) {
                e.preventDefault();
                var target = this._getFocusedElement();
                if (target.hasClass("e-dt-today"))
                    this._todayClick();
                else if (target.hasClass("e-dt-now"))
                    this._nowClick();
                else if (target.hasClass("e-dt-done"))
                    this._doneClick();
            }
        },
        _todayClick: function () {
            if (!this.model.enabled || this.model.readOnly) return false;
            if (!this.datePicker.popup.find(".today").hasClass("e-active") ||
                !this.datePicker.popup.children("table").hasClass("e-dp-viewdays") ||
                this.element.val() == "" || !this.isValidState) {
                this.datePicker._setCurrDate();
                this._updateInput();
            }
        },
        _nowClick: function () {
            if (!this.model.enabled || this.model.readOnly) return false;
            this.timePicker.setCurrentTime();
            var mintime = this.model.minDateTime, maxtime = this.model.maxDateTime, date = this.datePicker.model.value, time = new Date();
            date = ej.isNullOrUndefined(date) ? new Date() : date;
            var currTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds());
            if (currTime < mintime)
                this.timePicker.option("value", this.timePicker._localizeTime(mintime));
            else if (currTime > maxtime)
                this.timePicker.option("value", this.timePicker._localizeTime(maxtime));
            this._updateInput();
        },
        _doneClick: function () {
            this._hideResult();
        },

        _iconClick: function (e) {
            e.preventDefault();
            if (!this.isFocused && (!ej.isTouchDevice())) this.element.focus();
            this._showhidePopup();
			if(this.model.disableDateTimeRanges && ej.isNullOrUndefined(this.model.value)) this._setDisabledTimeRanges(this.datePicker.model.value);
            if (this._isIE9)
                this.popup.find(".e-popup-container").css("display", "inline-block");
        },
        _setInitialSelection: function () {
            var elements = this.timePicker.ul.find("li");
            if (elements.hasClass('e-hover')) { this._calcScrollTop(); return; }
            var currentTime = this.timePicker._setEmptyDate(new Date()), selected;
            selected = currentTime;
            if (this.timePicker.minTime && !this._compareTime(this._createObject(currentTime), this.timePicker.minTime, true))
                selected = this.timePicker.minTime;
            if (this.timePicker.maxTime && !this._compareTime(this.timePicker.maxTime, this._createObject(currentTime), true))
                selected = this.timePicker.maxTime;
            var firstTime = elements.first().html(), index;
            index = (this.timePicker._parse(selected) - this.timePicker._parse(firstTime)) / (this.timePicker.model.interval * 60000);
            index = Math.round(index);
            var activeItem = (index == elements.length) ? index : index + 1;
            if (activeItem < 0 || activeItem > elements.length || isNaN(activeItem)) activeItem = 1;
            var activeEle = $(this.timePicker.ul.find("li")[activeItem - 1]);
            activeEle.addClass('e-hover');
            this._calcScrollTop();
        },
        _calcScrollTop: function () {
            var ulH = this.timePicker.ul.outerHeight(), liH = this.timePicker.ul.find("li").outerHeight(), index, top;
            index = this.timePicker.ul.find("li.e-hover").index();
            top = (liH * index) - ((this.timePicker.popupList.outerHeight() - liH) / 2);
            this.timePicker.scrollerObj.setModel({ "scrollTop": top });
        },
        _showhidePopup: function () {
            if (this.model.readOnly) return false;
            if (!this.isPopupOpen)
                this._showResult();
            else
                this._hideResult();
        },
        _showResult: function () {
            if (!this.popup) this._renderDropdown();
            if (this.isPopupOpen || !this.model.enabled) return false;
			this._setRtl(this.model.enableRTL);
			this._setRoundedCorner(this.model.showRoundedCorner);
            if (this._trigger("beforeOpen", { element: this.popup })) return false;
            this.isPopupOpen = true;
			this.element.attr({'aria-expanded':'true'})
            this._setListPosition();
            this._checkForResponsive();
            var proxy = this;
            this.popup.slideDown(this.model.enableAnimation ? 200 : 0, function () {
                proxy._on($(document), "mousedown", proxy._OnDocumentClick);
                proxy.model.timeDrillDown.enabled && proxy._addFocus(proxy._dateContainer.find('.e-datepicker'));
                if (!proxy.timePicker.model.value) proxy._setInitialSelection();
            });
            this._updateModel();
            this._updateTimeHeight();
            this._validateMinMax();
            this._on($(window), "resize", this._OnWindowResize);
            this._on(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
            this._on(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
            this._raiseEvent("open");
            if (this._initial) {
                this.timePicker._refreshScroller();
                this.timePicker._changeActiveEle();
                this._initial = false;
            }
            this.wrapper.addClass("e-active");
        },
        _hideResult: function (e) {
			if ( e && (e.type == "touchmove" || e.type== "scroll")) {
				if ($(e.target).parents("#"+this.popup[0].id).length > 0)
				return;
	        }
            var proxy = this;
            if (!this.isPopupOpen) return false;
            if (this._trigger("beforeClose", { element: this.popup })) return false;
            this.isPopupOpen = false;
			this.element.attr({'aria-expanded':'false'})
            this._removeFocus();
            if (this._popClose && e && e.type != "click") {
                this.isPopupOpen = true;
                return;
            }
            this.popup.slideUp(this.model.enableAnimation ? 100 : 0, function () {
                if (proxy.model) {
                    if (proxy.model.timeDrillDown.enabled) {
                        proxy._sfTimeHour.hide();
                        proxy._sfTimeMins.hide();
                        proxy._dateContainer.show();
                    }
                    if (!ej.isNullOrUndefined(proxy.model.value))
                        proxy._datetimeValue = new Date(proxy.model.value.toString());
                }
            });
            this._raiseEvent("close");
            this._off($(document), "mousedown", this._OnDocumentClick);
            this._off($(window), "resize", this._OnWindowResize);
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
            this._off(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
            this.wrapper.removeClass("e-active");
        },

        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popup.outerHeight(),
            popupWidth = this.popup.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
			popupPosition = this.model.popupPosition;
            if (this.model.popupPosition == ej.PopupPosition.Bottom)
                var topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            else
                var topPos = ((popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popup.outerWidth() - elementObj.outerWidth();
            this.popup.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _OnDocumentClick: function (e) {
            if (this.model) {
                if (!$(e.target).is(this.popup) && !$(e.target).parents(".e-datetime-popup").is(this.popup) &&
                    !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-datetime-wrap").is(this.wrapper)) {
                    this._hideResult();
                }
                else if ($(e.target).is(this.popup) || $(e.target).parents(".e-datetime-popup").is(this.popup)) {
                    e.preventDefault();
                    if ($(e.target).parents(".e-datepicker").length > 0) this._addFocus($(e.target).parents(".e-datepicker"));
                    else if ($(e.target).parents(".e-timecontainer").length > 0) this._addFocus($(e.target).parents(".e-timecontainer"));
                    else if ($(e.target).hasClass("e-dt-button")) this._addFocus($(e.target));
                    else if ($(e.target).parents(".e-time-hours").length > 0) this._addFocus($(e.target).parents(".e-time-hours"));
                    else if ($(e.target).parents(".e-time-minitues").length > 0) this._addFocus($(e.target).parents(".e-time-minitues"));
                    else this._removeFocus();
                }
            }
        },
        _OnWindowResize: function (e) {
            this._setListPosition();
            this._checkForResponsive();
            this._updateTimeHeight();
        },

        _raiseChangeEvent: function (isCode) {
            var previous = ej.parseDate(this._prevDateTimeVal, this.model.dateTimeFormat);
            var current = ej.parseDate(this.element.val(), this.model.dateTimeFormat);
            if (!(+previous === +current)) {
                this._preVal = this.element.val();
                var data = { prevDateTime: this._prevDateTimeVal, value: this.element.val(), isInteraction: !isCode, isValidState: this.isValidState };
                this._trigger("_change", data);
                data.value = $.trim(this.element.val()) == "" ? null : this.element.val();
                this._trigger("change", data);
                this._prevDateTimeVal = this.element.val();
            }
            else if ((this._prevDateTimeVal != this.element.val())) {
                var data = { prevDateTime: this._prevDateTimeVal, value: this.element.val(), isValidState: this.isValidState };
                this._prevDateTimeVal = this.element.val()
                this._trigger("_change", data);
            }
        },
        _raiseEvent: function (name) {
            var dateStringVal = this._previousDateUpdate();
            if (this.element != null && this.model[name])
                return this._trigger(name, { prevDateTime: ej.isNullOrUndefined(dateStringVal || this._preValString) ? '' : dateStringVal || this._preValString, value: this.element.val() });
            return false;
        },
        _getDateTimeFormat: function () {
            var pattern = ej.preferredCulture(this.model.locale).calendar.patterns;

            if (!this.model.dateTimeFormat) this.model.dateTimeFormat = pattern.d + " " + pattern.t;
            if (!this.model.timeDisplayFormat) this.model.timeDisplayFormat = pattern.t;
        },
        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popup);
        },
        _checkErrorClass: function () {
            if (this.isValidState) this.wrapper.removeClass("e-error");
            else this.wrapper.addClass("e-error");
        },
        _getDate: function () {
            return this.datePicker.model.value;
        },
        _getTime: function () {
            return this._getDateObj(this.timePicker.model.value, this.timePicker.model.timeFormat);
        },
        _setEmptyTime: function (date) {
            var newDate = new Date(date);
            newDate.setMilliseconds(0);
            newDate.setSeconds(0);
            newDate.setMinutes(0);
            newDate.setHours(0);
            return newDate;
        },
        _setEmptyDate: function (date) {
            var newDate = new Date(date);
            newDate.setDate(1);
            newDate.setMonth(0);
            newDate.setFullYear(2000);
            return newDate;
        },
        _objectToString: function (obj) {
            return this._getFormat(obj, this.model.dateTimeFormat);
        },
        _stringToObject: function (value) {
            return this._getDateObj(value, this.model.dateTimeFormat);
        },
        _getFormat: function (value, format) {
            if (value instanceof Date) {
                var newFormat = this._checkFormat(format);
                return ej.format(value, newFormat, this.model.locale);
            }
            else return value;
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
        _getDateObj: function (value, format) {
            if (typeof value === "string") {
                var newFormat = this._checkFormat(format);
                var temp = ej.parseDate(value, newFormat, this.model.locale);
                if (temp != null)
                    return temp;
                else {
                    if (value != "" && value != null) {
                        var dateregexp = /^\s*(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d).*Z\s*$/, month, datetimesplit = dateregexp.exec(value);
                        var datevariable = new Date();
                        if (datetimesplit) {
                            datevariable = new Date();
                            month = +datetimesplit[2];
                            datevariable.setUTCFullYear(datetimesplit[1], month - 1, datetimesplit[3]);
                            datevariable.setUTCHours(datetimesplit[4], datetimesplit[5], datetimesplit[6]);
                            if (month != datevariable.getUTCMonth() + 1)
                                datevariable.setTime();
                        }
                        if (this._isValidDate(datevariable))
                            return datevariable;
                    }
                    else return null;
                }
            }
            else return value;
        },
        _compare: function (obj1, obj2) {
            return obj1 && obj2 && obj1.getTime() == obj2.getTime();
        },
        _isValidDate: function (dateObj) {
            return dateObj && typeof dateObj.getTime === "function" && isFinite(dateObj.getTime());
        },


        _change: function (property, value) {
            if (this.popup) {
                this.datePicker.option(property, value);
                this.timePicker.option(property, value);
            }
        },
        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            this.popup.removeClass(this.model.cssClass).addClass(skin);

            this._change("cssClass", skin);
        },
        _localize: function (culture) {
            this.model.locale = culture;
            if (ej.isNullOrUndefined(this._options.timeDisplayFormat))
                this.model.timeDisplayFormat = "";
            if (ej.isNullOrUndefined(this._options.dateTimeFormat))
                this.model.dateTimeFormat = "";
            var meridianText = ["AM", "PM"];
            this._getDateTimeFormat();
            this.timePicker.option("timeFormat", this.model.timeDisplayFormat);
            this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.buttonText))
                    $.extend(this._localizedLabels.buttonText, this._options.buttonText);
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            this._localizedLabelToModel();
            this._buttonText(this._localizedLabels.buttonText);
            if (this.isValidState || (this.model.value instanceof Date && this._isValidDate(this.model.value)))
                this.element.val(this._objectToString(this.model.value));
            this._preVal = this.element.val();
            this._change("locale", culture);
            this.model.startDay = this.datePicker.model.startDay;
            this._validateMeridian();
            this._sfTimeHour.empty();
            this._renderHourTable();

            // Update the meridian support
            if (this.model.timeDrillDown.showMeridian)
                for (i = 0; i < 2; i++) {
                    var txt = !ej.isNullOrUndefined(ej.preferredCulture(this.model.locale).calendars.standard[meridianText[i]]) ? ej.preferredCulture(this.model.locale).calendars.standard[meridianText[i]][0] : "";
                    $("span.e-hours-meridiantxt-" + meridianText[i].toLowerCase(), this._sfTimeHour).text(txt);

                }
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
        _readOnly: function (boolean) {
            this.model.readOnly = boolean;
            if (boolean) this.element.attr("readonly", "readonly");
            else this.element.prop("readonly", false);

            this._change("readOnly", boolean);
        },
        _setRoundedCorner: function (boolean) {
            if (boolean) {
                this.container.addClass("e-corner");
                if(this.popup)this.popup.addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                if(this.popup) this.popup.removeClass("e-corner");
            }
            !ej.isNullOrUndefined(this.datePicker) && this.datePicker.option("showRoundedCorner", boolean);
			!ej.isNullOrUndefined(this.timePicker) && this.timePicker.option("showRoundedCorner", boolean);
        },
        _setRtl: function (boolean) {
            if (boolean) {
                this.wrapper.addClass("e-rtl");
                if(this.popup) this.popup.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
                if(this.popup) this.popup.removeClass("e-rtl");
            }

            this._change("enableRTL", boolean);
        },
        _enabled: function (boolean) {
            if (boolean) {
                this.model.enabled = false;
                this.enable();
            }
            else {
                this.model.enabled = true;
                this.disable();
            }
        },
        _showButton: function (show) {
            this.model.showPopupButton = show;
            if (show) {
                this.container.addClass("e-padding");
                this._renderIcon();
            }
            else {
                this.container.removeClass("e-padding");
                this.datetimeIcon.remove();
                this.datetimeIcon = null;
            }
        },
        _buttonText: function (data) {
            $.extend(this.model.buttonText, data);
            this.popup.find(".e-dt-today").html(this.model.buttonText.today);
            this.popup.find(".e-dt-now").html(this.model.buttonText.timeNow);
            this.popup.find(".e-dt-done").html(this.model.buttonText.done);
            this.popup.find(".e-timecontainer").find(".e-header").html(this.model.buttonText.timeTitle);
        },
        _checkForResponsive: function () {
            if (($(window).outerWidth() > 200) && ($(window).outerWidth() <= 500)) {
                if (!this.popup.hasClass("e-dt-responsive")) {
                    this.popup.addClass("e-dt-responsive");
                    this.timePicker.option("popupWidth", this.datePicker.popup.outerWidth());
                    this.timePicker.option("popupHeight", 98);
                    this.timePicker._refreshScroller();
                    this.timePicker._changeActiveEle();
                }
            }
            else if (this.popup.hasClass("e-dt-responsive")) {
                this.popup.removeClass("e-dt-responsive");
                this.timePicker.option("popupWidth", this.model.timePopupWidth);
                var height = this.datePicker.popup.height() - this.popup.find(".e-header").height();
                this.timePicker.option("popupHeight", height);
                this.timePicker._refreshScroller();
                this.timePicker._changeActiveEle();
            }
        },

        enable: function () {
            if (!this.model.enabled) {
                this.element[0].disabled = false;
                this.model.enabled = true;
                this.element.prop("disabled", false);
                this.wrapper.removeClass("e-disable");
                this.element.removeClass("e-disable").attr("aria-disabled", false);
                if (!this._isSupport)
                    this._hiddenInput.prop("disabled", false);
                if (this.datetimeIcon) this.datetimeIcon.removeClass("e-disable").attr("aria-disabled", false);
                if (this._isIE8 && this.datetimeIcon) this.datetimeIcon.children().removeClass("e-disable");
                if (this.popup) {
                    this.popup.children("div").removeClass("e-disable").attr("aria-disabled", false);
                    this._change("enabled", true);
                }
            }
        },


        disable: function () {
            if (this.model.enabled) {
                this.element[0].disabled = true;
                this.model.enabled = false;
                this.wrapper.addClass("e-disable");
                this.element.addClass("e-disable").attr("aria-disabled", true);
                this.element.attr("disabled", "disabled");
                if (!this._isSupport)
                    this._hiddenInput.attr("disabled", "disabled");
                if (this.datetimeIcon) this.datetimeIcon.addClass("e-disable").attr("aria-disabled", true);
                if (this._isIE8 && this.datetimeIcon) this.datetimeIcon.children().addClass("e-disable");
                this._hideResult();
                this._change("enabled", false);
                if (this.popup) {
                    this.popup.children("div").addClass("e-disable").attr("aria-disabled", true);
                    this.datePicker.popup.removeClass("e-disable").attr("aria-disabled", false);
                    this.timePicker.popup.removeClass("e-disable").attr("aria-disabled", false);
                }
            }
        },


        getValue: function () {
            return this._objectToString(this.model.value);
        },


        setCurrentDateTime: function () {
            if (!this.model.readOnly)
                this._setValue(new Date());
        },


        show: function () {
            this._showResult();
        },


        hide: function () {
            this._hideResult();
        },


        _wireEvents: function () {
            if (this.model.allowEdit) {
                this._on(this.element, "focus", this._targetFocus);
                this._on(this.element, "blur", this._targetBlur);
                this._on(this.element, "keydown", this._keyDownOnInput);
            }
            if (!this.model.allowEdit) {
                this.element.attr("readonly", "readonly");
                this.element.on("mousedown", $.proxy(this._showhidePopup, this));
            }
        },

        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
    });

    ej.DateTimePicker.Locale = ej.DateTimePicker.Locale || {};

    ej.DateTimePicker.Locale['default'] = ej.DateTimePicker.Locale['en-US'] = {
        watermarkText: "Select datetime",
        buttonText: {
            today: "Today",
            timeNow: "Time Now",
            done: "Done",
            timeTitle: "Time"
        }
    };

    ej.PopupPosition = {
        Bottom: "bottom",
        Top: "top"
    };
})(jQuery, Syncfusion);