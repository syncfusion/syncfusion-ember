/**
* @fileOverview Plugin to style the Html Datepicker elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejmDatePicker", "ej.mobile.DatePicker", {
        _setFirst: true,
        _requiresID: true,
        _rootCSS: "e-m-datepicker",
        defaults: {
            dateFormat: null,
            renderMode: "auto",
            minDate: null,
            maxDate: null,
            locale: "en-US",
            value: null,
            enabled: true,
            enablePersistence: false,
            cssClass: "",
            select: null,
            load: null,
            focusIn: null,
            focusOut: null,
            open: null,
            close: null,
            change: null,
        },
        dataTypes: {
            renderMode: "enum",
            enabled: "boolean",
            enablePersistence: "boolean"
        },
        _init: function () {
            this._createDelegates();
            this._renderControl();
            this._wireEvents();
        },
        _datepickerInitialize: function () {
            this._winrt = this.model.renderMode == "windows" && !ej.isLowerResolution();
            this._menuTargetId = this._id;
            this._setLocale(this.model.locale);
            this.model.dateFormat = this.model.dateFormat == null ? Date.format : this.model.dateFormat;
            this.model.minDate = this.model.minDate ? this.model.minDate : "01/01/2000";
            this.model.maxDate = this.model.maxDate ? this.model.maxDate : "12/31/2030";
            if (!this.model.value) {
                date = new Date();
                this.model.value = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
            }
            this._currentDate = new Date(this.model.minDate) > new Date(this.model.value) ? this.model.minDate : new Date(this.model.maxDate) < new Date(this.model.value) ? this.model.maxDate : this.model.value;
            this._prevResolution = ej.isLowerResolution();
        },
        _setLocale: function (culture) {
            this.culture = ej.preferredCulture(culture);
            this._localizedLabels = this._getLocalizedLabels();
            if (this.culture) {
                Date.dayNames = this.culture.calendar.days.names;
                Date.abbrDayNames = this.culture.calendar.days.namesAbbr;
                Date.monthNames = this.culture.calendar.months.names;
                Date.abbrMonthNames = this.culture.calendar.months.namesAbbr;
                Date.format = this.culture.calendar.patterns.d;
            }
        },
        _renderControl: function () {
            ej.setRenderMode(this);
            this._datepickerInitialize();
            this._datepickerwrapper = ej.buildTag("div.e-m-datepickerwrapper" + " " + this.model.cssClass + " " + "e-m-" + this.model.renderMode + " e-m-user-select#" + this._id + "_Wrapper", "", {}, {});
            this.element.attr({ "name": this._id }).wrap(this._datepickerwrapper);
            this._datepickerwrapper = this.element.parent();
            this.element.attr({ "readonly": true });
            this._outerdiv = ej.buildTag("div.e-m-" + this.model.renderMode + " e-m-dp e-m-user-select #" + this._id + "_dp", "", {}, {});
            this._innerdiv = ej.buildTag("div.e-m-dpinner", "", {}, {});
            this._wrapdiv = ej.buildTag("div.e-m-dpwrap", "", {}, {});
            this._visibletexthtml = this._winrt ? "" : "<div class='col-fill'></div>";
            this._months = ej.buildTag("div.e-m-dp e-m-dpmonth e-m-left", "<div class='e-m-datewrapper'><div id=" + this._id + "_dpmonth><div class='e-m-dpouter'>" + this._visibletexthtml + "</div></div></div><div class='e-m-dp-overlay'></div></div>", {}, {});
            this._days = ej.buildTag("div.e-m-dp e-m-dpdate e-m-center", "<div class='e-m-datewrapper'><div id=" + this._id + "_dpdate><div class='e-m-dpouter'>" + this._visibletexthtml + "</div></div></div><div class='e-m-dp-overlay'></div></div>", {}, {});
            this._years = ej.buildTag("div.e-m-dp e-m-dpyear e-m-right", "<div class='e-m-datewrapper'><div id=" + this._id + "_dpyear><div class='e-m-dpouter'>" + this._visibletexthtml + "</div></div></div><div class='e-m-dp-overlay'></div></div>", {}, {});
            this["_" + this.model.renderMode + "Rendering"]();
            this._scrollInitialize();
            this._domElements();
            this._minDateInitialize();
            this._maxDateInitialize();
            if (this.model.load)
                this._trigger("load", this._argsValue());
            this._controlStatus(this.model.enabled);
            this._initscroll = false;
            this._setcurrent = false;
            this._setformat = false;
            this.element.addClass("e-m-user-select");
            this._setCurrentPreviousDate();
        },
        _setCurrentPreviousDate: function () {
            this._updateValue(this.model.dateFormat);
            this._previousDate = $(this.element).val();
        },
        _scrollPanel: function (e) {
            this["_" + e] = ej.buildTag("div#" + this._id + "dp" + e + "_scrollpanel");
            this._outerdiv.find("#" + this._id + "_dp" + e).append(this["_" + e]);
            this["_" + e].ejmScrollPanel({
                enableMouseWheel: false, enableNativeScrolling: false, enableTransition: false, enableTransform: false, showScrollbars: false, target: this._id + "_dp" + e, targetHeight: this._targetHeight, renderMode: this.model.renderMode,
                scrollStart: $.proxy(this._onScrollStart, this), scrollStop: $.proxy(this._onScrollStop, this), enableBounce: false, enableDisplacement: true, displacementValue: this._displacement, displacementTime: ej.isWindows() ? 800 : 350, isRelative: true
            });
        },
        _windowsTargetHeight: function () {
            return this._closestAppview.innerHeight() - (ej.getDimension(this._toolbar, "outerHeight") + ej.getDimension($(this._outerdiv).find(".e-m-dp-header"), "outerHeight"))
        },
        _scrollInitialize: function () {
            this._displacement = this.model.renderMode == "ios7" ? 40 : (this.model.renderMode == "android" ? 45 : 90); //40, 45, 90 - height of ios7, android, windows tiles
            this._targetHeight = this.model.renderMode == "ios7" ? 200 : (this.model.renderMode == "android" ? 135 : !this._winrt ? this._windowsTargetHeight() : 0); //200, 135 - scrollheights of ios7, android
            if (!this._winrt) {
                this._scrollPanel("date");
                this._scrollPanel("month");
                this._scrollPanel("year");
            }
        },
        _minDateInitialize: function () {
            if (!this._winrt) {
                this._minDate = new Date(this.model.minDate);
                var d = this._minDate.getDate(), m = this._minDate.getMonth();
                this._minMonths = this._monthtext.slice(0, m);
                this._minDates = this._datetext.slice(0, d - 1);
            }
        },
        _maxDateInitialize: function () {
            if (!this._winrt) {
                this._maxDate = new Date(this.model.maxDate);
                var d = this._maxDate.getDate(), m = this._maxDate.getMonth();
                this._maxMonths = this._monthtext.slice(m + 1, 12);
                this._maxDates = this._datetext.slice(d, 31);
            }
        },
        _renderTemplate: function () {
            var template = {};
            template["default"] = "<div class='e-m-text {{:class}}'>{{:value}}</div>";
            template["monthtemplate"] = "<div class='e-m-text'>{{:secondvalue}}</div>";
            template["windows"] = "<div class='e-m-text {{:class}}'><div class='e-m-text-inner'>{{:value}}</div><div class='e-m-text-val e-m-dp-dayweek'>{{:secondvalue}}</div></div>";
            template["winrt"] = "<option value='{{:value}}'>{{:value}}</option>";
            template["winrtmonths"] = "<option value='{{:value}}'>{{:secondvalue}}</option>";
            $.templates(template);
        },
        _renderDateContent: function () {
            this._renderTemplate();
            this._monthsRendering();
            this._daysRendering();
            this._yearsRendering();
            this._innerdiv.append(this._wrapdiv);
            this._outerdiv.append(this._innerdiv);
        },
        _ios7Rendering: function () {
            this._renderDateContent();
            this._innerdiv.append("<div class='e-m-ios7-overlay'></div>");
            this._menu = ej.buildTag('div#' + this._id + '_menu.e-m-dp-menu');
            this._menu.append(this._outerdiv);
            ej.getCurrentPage().append(this._menu);
            this._menu.ejmMenu({
                allowScrolling: false, type: (ej.isLowerResolution() ? "actionsheet" : "popover"), target: this._menuTargetId, height: 205,
                renderMode: this.model.renderMode, show: $.proxy(this._setInitialDate, this), showTitle: false, cancelButton: { show: false }, hide: $.proxy(this._menuHide, this)
            });
        },
        _androidRendering: function () {
            this._renderDateContent();
            this._dialog = ej.buildTag("div.e-m-dp-dialog#" + this._id + "_dialog");
            this._dialog.ejmDialog({ allowScrolling: false, title: this._localizedLabels.headerText, mode: "confirm", leftButtonCaption: this._localizedLabels.confirmText, rightButtonCaption: this._localizedLabels.cancelText, renderMode: this.model.renderMode, enableAnimation: false });
            this._dialog.find(".e-m-dlg-content").append(this._outerdiv);
        },
        _windowsRendering: function () {
            if (this.model.renderMode == "windows" && !ej.isLowerResolution()) {
                this._renderDateContent();
                this._dialog = ej.buildTag("div.e-m-dp-dialog#" + this._id + "_dialog");
                this._dialog.ejmDialog({
                    enableModal: true, allowScrolling: false, width: "100%", enableAnimation: false, title: this._localizedLabels.headerText, leftButtonCaption: this._localizedLabels.confirmText, rightButtonCaption: this._localizedLabels.cancelText, mode: "confirm", renderMode: this.model.renderMode
                });
                this._dialog.find(".e-m-dlg-content").append(this._outerdiv);
            }
            else {
                this._outerdiv.append("<div class='e-m-dp-header' style='visibility:hidden;'>" + this._localizedLabels.headerText + "</div>");
                this._renderDateContent();
                this._toolbar = ej.buildTag("div#" + this._id + "_toolbar.e-m-dp-tb", "<ul><li data-ej-iconname='check'></li><li data-ej-iconname='close'></li></ul>");
                this._toolbar.ejmNavigationBar({ mode: "toolbar", position: "bottom", renderMode: this.model.renderMode, touchEnd: $.proxy(this._winToolbarItem, this) });
                this._closestAppview = this._outerdiv.closest(".appview").length ? this._outerdiv.closest(".appview") : ej.getCurrentPage();
                ej.getCurrentPage().append(this._outerdiv).append(this._toolbar);
                this._outerdiv.find(".e-m-dpouter").find(".col-fill").css("height", ((this._windowsTargetHeight() - 90) / 2)); //height of a tile is 90px
                this._outerdiv.css("top", -this._closestAppview.innerHeight() + "px");
                this._toolbar.css({ "visibility": "hidden" });
            }
        },
        _flatRendering: function () {
            this._windowsRendering();
        },
        _daysRendering: function () {
            var daysdata = [];
            this._daysofmonth = this._getDaysInMonth(new Date(this.model.value));
            for (var i = 1; i <= 31; i++) {
                var dayofweek = Date.dayNames[(new Date(new Date(this.model.value).getMonth() + 1 + '/' + (i) + "/" + new Date(this.model.value).getFullYear()).getDay())];
                if (i <= this._daysofmonth)
                    daysdata.push({ "value": i, "secondvalue": dayofweek, "class": "" });
                else
                    daysdata.push({ "value": i, "secondvalue": dayofweek, "class": "e-m-state-disabled" });
            }
            this._columnRendering("days", daysdata);
        },
        _winrtContent: function (column, data) {
            this._select = ej.buildTag("select");
            data = $.render[column == "months" ? "winrtmonths" : "winrt"](data);
            this["_" + column].find(".e-m-dpouter").html(this._select.append(data));
            this._wrapdiv.append(this["_" + column]);
        },
        _monthsRendering: function () {
            var monthsdata = [];
            var monthnames = this.model.renderMode == "android" ? "abbrMonthNames" : "monthNames";
            for (var i = 0; i < 12; i++)
                monthsdata.push({ "secondvalue": Date[monthnames][i], "value": (i + 1) });
            this._columnRendering("months", monthsdata);
        },
        _yearsRendering: function () {
            var yeardata = [];
            for (var i = new Date(this.model.minDate).getFullYear() ; i <= new Date(this.model.maxDate).getFullYear() ; i++)
                yeardata.push({ "value": i });
            this._columnRendering("years", yeardata);
        },
        _columnRendering: function (column, data) {
            if (this._winrt)
                this._winrtContent(column, data);
            else {
                var templateval = this.model.renderMode == "windows" || this.model.renderMode == "flat" ? "windows" : column == "years" ? "default" : (column == "months" ? "monthtemplate" : "default");
                data = $.render[templateval](data) + this._visibletexthtml;
                this["_" + column].find(".e-m-dpouter").html(this["_" + column].find(".e-m-dpouter").html() + data);
                this._wrapdiv.append(this["_" + column]);
            }
        },
        _createDelegates: function () {
            this._winScrlHndlr = $.proxy(this._outerScroll, this);
            this._focusHndlr = $.proxy(this._showDatePicker, this);
            this._blurHndlr = $.proxy(this._blurEventHandler, this);
            this._andBtnClkHndlr = $.proxy(this._androidDialogButtonClick, this);
            this._winrtBtnClkHndlr = $.proxy(this._winrtDialogButtonClick, this);
            this._OrientationChangeHndlr = $.proxy(this._OrientationChange, this);
            this._resizeHndlr = $.proxy(this._resize, this);
        },
        _wireEvents: function (remove) {
            if (this.model.renderMode == "android")
                ej.listenTouchEvent($(this._dialog).find(".e-m-dlg-btn"), ej.tapEvent(), this._andBtnClkHndlr, remove);
            else if (this._winrt)
                ej.listenTouchEvent($(this._dialog).find(".e-m-dlg-btn"), ej.tapEvent(), this._winrtBtnClkHndlr, remove);
            else if (this.model.renderMode == "windows" || this.model.renderMode == "flat")
                ej.listenTouchEvent($(this._outerdiv).find(".e-m-dpwrap .e-m-dp"), ej.startEvent(), this._winScrlHndlr, remove);
            ej.listenEvents([$(this.element), $(this.element)], ["focus", "blur"], [this._focusHndlr, this._blurHndlr], remove);
            ej.listenTouchEvent($(window), "onorientationchange" in window ? "orientationchange" : "resize", this._resizeHndlr, remove);
        },
        _resize: function (e) {
            this._currentResolution = ej.isLowerResolution();
            if ((this.model.renderMode == "ios7" || this.model.renderMode == "windows") && this._prevResolution != this._currentResolution)
                this._refresh();
            else
                this._prevResolution = this._currentResolution;
            if ((this.model.renderMode == "windows" && ej.isLowerResolution()) || this.model.renderMode == "flat") {
                this._outerdiv.find(".e-m-dpouter").find(".col-fill").css("height", ((this._windowsTargetHeight() - 90) / 2)); //height of a tile is 90px
                this._date.ejmScrollPanel({ "targetHeight": this._windowsTargetHeight() });
                this._month.ejmScrollPanel({ "targetHeight": this._windowsTargetHeight() });
                this._year.ejmScrollPanel({ "targetHeight": this._windowsTargetHeight() });
                this._setValue(this._currentDate);
                if (this._outerdiv.offset().top != 0)
                    this._outerdiv.css("top", -this._closestAppview.innerHeight());
            }
        },
        _scrollCoordinates: function () {
            var day = {};
            day.Scrolldate = Math.round(this._date.ejmScrollPanel("getScrollPosition").y / this._displacement);
            day.Scrollmonth = Math.round(this._month.ejmScrollPanel("getScrollPosition").y / this._displacement);
            day.Scrollyear = Math.round(this._year.ejmScrollPanel("getScrollPosition").y / this._displacement);
            day.date = -(day.Scrolldate) + 1;
            day.month = -(day.Scrollmonth) + 1;
            day.year = -(day.Scrollyear) + new Date(this.model.minDate).getFullYear();
            return day;
        },
        _domElements: function () {
            this._windate = this._days.find("#" + this._id + "_dpdate");
            this._winmonth = this._months.find("#" + this._id + "_dpmonth");
            this._winyear = this._years.find("#" + this._id + "_dpyear");
            this._datetext = this._windate.find(".e-m-text");
            this._monthtext = this._winmonth.find(".e-m-text");
            this._yeartext = this._winyear.find(".e-m-text");
        },
        _activeText: function (date, month, year, target) {
            if ((target && target == "dpdate") || target == null) {
                $(this._datetext).removeClass("e-m-text-active");
                $(this._datetext[date - 1]).addClass("e-m-text-active");
            }
            if (target && target == "dpmonth" || target == null) {
                $(this._monthtext).removeClass("e-m-text-active");
                $(this._monthtext[month - 1]).addClass("e-m-text-active");
            }
            if (target && target == "dpyear" || target == null) {
                $(this._yeartext).removeClass("e-m-text-active");
                $(this._yeartext[(year - new Date(this.model.minDate).getFullYear())]).addClass("e-m-text-active");
            }
        },
        _setDateInput: function () {
            if (this.model.renderMode != "ios7")
                this._updateValue(this.model.dateFormat);
            this._dateSelect();
        },
        _winrtInitialDate: function (date) {
            var date = new Date(this._currentDate);
            this._windate.find("select option[value='" + date.getDate() + "']").attr("selected", true);
            this._winmonth.find("select option[value='" + (date.getMonth() + 1) + "']").attr("selected", true);
            this._winyear.find("select option[value='" + date.getFullYear() + "']").attr("selected", true);
        },
        _setInitialDate: function () {
            if (this._winrt)
                this._winrtInitialDate(this._currentDate);
            else {
                if (this.model.renderMode == "ios7")
                    this._initscroll = true;
                this._setValue(this._currentDate);
                var proxy = this;
                setTimeout(function () {
                    proxy._setProperDate(100);
                }, 200);
                if (this.model.renderMode == "ios7")
                    this._initscroll = false;
            }
        },
        _setValue: function (date) {
            var date = new Date(date);
            this._resetScrollPos();
            this._time = !ej.isIOS7() ? 0 : (!this._initscroll && !this._setcurrent) ? 200 : 0;
            this._date.ejmScrollPanel("scrollTo", 0, -this._displacement * (date.getDate() - 1), this._time);
            this._month.ejmScrollPanel("scrollTo", 0, -this._displacement * (date.getMonth()), this._time);
            this._year.ejmScrollPanel("scrollTo", 0, -this._displacement * (date.getFullYear() - new Date(this.model.minDate).getFullYear()), this._time);
        },
        _resetScrollPos: function () {
            this._date.ejmScrollPanel("scrollTo", 0, 0, 0);
            this._month.ejmScrollPanel("scrollTo", 0, 0, 0);
            this._year.ejmScrollPanel("scrollTo", 0, 0, 0);
        },
        _formatter: function (date, format) {
            var newFormat = this._checkFormat(format);
            return ej.format(date, newFormat, this.model.locale);
        },
        _parseDate: function (date) {
            if (!this._setformat)
                this._oldFormat = this.model.dateFormat;
            var newFormat = this._checkFormat(this._oldFormat);
            return ej.parseDate(date, newFormat, this.model.locale);
        },
        _checkFormat: function (format) {
            var proxy = this;
            var dateFormatRegExp = this._regExp();
            return format.replace(dateFormatRegExp, function (match) {
                match = match === "/" ? proxy.culture.calendars.standard['/'] !== "/" ? "'/'" : match : match;
                return match;
            });
        },
        _changeFormat: function (dateformat) {
            var proxy = this;
            var dateFormatRegExp = this._regExp();
            return dateformat.replace(dateFormatRegExp, function (match) {
                match = match === "/" ? proxy.culture.calendars.standard['/'] !== "/" ? "'/'" : match : match == 'd' ? new Date(proxy._currentDate).getDate() : match == 'M' ? new Date(proxy._currentDate).getMonth() + 1 : ej.format(new Date(proxy._currentDate), match);
                return match;
            });
        },
        _regExp: function () {
            return /dddd|\/|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|gg|g|"[^"]*"|'[^']*'|[/]/g;
        },
        _checkMinMax: function (day) {
            this._outerdiv.find(".e-m-state-disabled").removeClass("e-m-state-disabled");
            if (day.year == this._minDate.getFullYear() || day.year == this._maxDate.getFullYear()) {
                var m = day.year == this._minDate.getFullYear() ? "min" : "max";
                this["_" + m + "Months"].addClass("e-m-state-disabled");
                if (m == "min" ? day.month < this._minDate.getMonth() + 1 : day.month > this._maxDate.getMonth() + 1) {
                    day.month = this["_" + m + "Date"].getMonth() + 1;
                    this._month.ejmScrollPanel("scrollTo", 0, -this._displacement * (this["_" + m + "Date"].getMonth()), this._time);
                }
                else if (m == "min" ? day.month == this._minDate.getMonth() + 1 : day.month == this._maxDate.getMonth() + 1) {
                    this["_" + m + "Dates"].addClass("e-m-state-disabled");
                    if (m == "min" ? day.date < this._minDate.getDate() : day.date > this._maxDate.getDate()) {
                        day.date = this["_" + m + "Date"].getDate();
                        this._date.ejmScrollPanel("scrollTo", 0, -this._displacement * (this["_" + m + "Date"].getDate() - 1), this._time);
                    }
                }
            }
            return day;
        },
        _setProperDate: function (duration, target) {
            var day = this._scrollCoordinates();
            day = this._checkMinMax(day);
            var proxy = this;
            if (target == "dpmonth" || target == "dpyear")
                this._daysofmonth = this._getDaysInMonth(new Date(day.month + "/1/" + day.year));
            for (var i = 27; i <= 30; i++) {
                if (i + 1 > this._daysofmonth)
                    $(this._datetext[i]).addClass("e-m-state-disabled");
            }
            if (this._daysofmonth < day.date) {
                day.date = this._daysofmonth;
                this._date.ejmScrollPanel("scrollTo", 0, -this._displacement * (this._daysofmonth - 1), this._time);
            }
            if (this.model.renderMode == "ios7" && !this._initscroll) {
                setTimeout(function () {
                    $(proxy.element).val(proxy._formatter(new Date(day.month + "/" + day.date + "/" + day.year), proxy.model.dateFormat));
                }, duration);
            }
            this._currentDate = day.month + "/" + day.date + "/" + day.year;
            this._activeText(day.date, day.month, day.year, target);
            this.model.value = this._currentDate;
            if (this.model.change)
                this._trigger("change", this._argsValue());
        },
        _argsValue: function () {
            return { value: this._currentDate };
        },
        _onScrollStop: function (e) {
            var target = e.model.target.replace(this._id + "_", '');
            this._setProperDate(this.model.renderMode == "windows" ? 700 : 200, target);
            if (this["_" + this.model.renderMode + "ScrollStop"])
                this["_" + this.model.renderMode + "ScrollStop"](e.model.target, target, e);
        },
        _windowsScrollStop: function (e, target, scrollModel) {
            var day = this._scrollCoordinates();
            for (var i = 0; i < this._getDaysInMonth(new Date(day.month + "/" + day.date + "/" + day.year)) ; i++) {
                var dayofweek = Date.dayNames[(new Date(day.month + '/' + (i + 1) + "/" + day.year)).getDay()];
                $(this._datetext[i]).find(".e-m-dp-dayweek").html(dayofweek);
            }
            var startTarget = this._id + "_" + this._target;
            this._hideWrapper(target);
        },
        _flatScrollStop: function (e, target, scrollModel) {
            this._windowsScrollStop(e, target, scrollModel);
        },
        _onScrollStart: function (e) {
            this._target = e.model.target.replace(this._id + "_", '');
            if (this["_" + this.model.renderMode + "ScrollStart"])
                this["_" + this.model.renderMode + "ScrollStart"](e.model.target, this._target);
        },
        _windowsScrollStart: function (e, target) {
            $("#" + e + "").find(".e-m-text.e-m-text-active").removeClass("e-m-text-active");
            this._hideWrapper(target);
        },
        _flatScrollStart: function (e, target) {
            this._windowsScrollStart(e, target);
        },
        _hideWrapper: function (target) {
            if (target && target == "dpdate") {
                if (!this._year.ejmScrollPanel("instance")._moved)
                    this._winyear.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
                if (!this._month.ejmScrollPanel("instance")._moved)
                    this._winmonth.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
            }
            if (target && target == "dpmonth") {
                if (!this._year.ejmScrollPanel("instance")._moved)
                    this._winyear.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
                if (!this._date.ejmScrollPanel("instance")._moved)
                    this._windate.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
            }
            if (target && target == "dpyear") {
                if (!this._month.ejmScrollPanel("instance")._moved)
                    this._winmonth.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
                if (!this._date.ejmScrollPanel("instance")._moved)
                    this._windate.closest(".e-m-datewrapper").removeClass("e-m-scrollstart");
            }
        },
        _blurEventHandler: function () {
            if (this.model.focusOut) {
                this._trigger("focusOut", this._argsValue());
            }
            if (this.model.renderMode == "ios7") {
                if (this.model.select) {
                    if (this._previousDate != $(this.element).val())
                        this._trigger("select", this._argsValue());
                }
                if (this.model.close)
                    this._trigger("close", this._argsValue());
            }
        },
        _dateSelect: function (e) {
            if (this._previousDate != $(this.element).val()) {
                if (this.model.select)
                    this._trigger("select", this._argsValue());
            }
            this._previousDate = $(this.element).val();
            this._hideDatePicker();
        },
        _winToolbarItem: function (e) {
            if (e.iconname == "check")
                this._setDateInput();
            else if (e.iconname == "close")
                this._hideDatePicker();
        },
        _winrtDialogButtonClick: function (e) {
            if ($(e.target).text() == this._localizedLabels.confirmText) {
                this._currentDate = this._formatter(new Date(this._winmonth.find("select option:selected").val() + "/" + this._windate.find("select option:selected").val() + "/" + this._winyear.find("select option:selected").val()), this._setformat ? this._oldFormat : this.model.dateFormat);
                this._setDateInput();
            }
            else
                this._showHidePicker(true);
        },
        _androidDialogButtonClick: function (e) {
            if ($(e.target).text() == this._localizedLabels.confirmText)
                this._setDateInput();
            else
                this._showHidePicker(true);
        },
        _outerScroll: function (e) {
            this._hideWrapper($(e.target).parents(".e-m-scrollpanel")[0].id.replace(this._id + "_", ''));
            $(e.target).closest(".e-m-dp").find(".e-m-datewrapper").addClass("e-m-scrollstart");
        },
        _showHidePicker: function (remove) {
            var proxy = this;
            var e = { currentTarget: this._datepickerwrapper };
            var visibility = remove ? "hidden" : "visible";
            var zindex = ej.getMaxZindex();
            this.element.blur();
            if (this._winrt)
                this._dialog.ejmDialog(remove ? "close" : "open");
            else if (this.model.renderMode == "android")
                this._dialog.ejmDialog(remove ? "close" : "open");
            else if (this.model.renderMode == "windows" || this.model.renderMode == "flat") {
                this._outerdiv.css({ "top": remove ? -this._closestAppview.innerHeight() : "0px", "visibility ": visibility });
                $(this._outerdiv).find(".e-m-dp-header").css({ "visibility": visibility });
                this._toolbar.css({ "visibility": visibility });
            }
        },
        _showDatePicker: function (e) {
            this._setInitialDate();
            if (this.model.focusIn)
                this._trigger("focusIn", this._argsValue());
            this._showHidePicker();
            this._outerdiv.find(".e-m-datewrapper").removeClass("e-m-scrollstart");
            if (this.model.open)
                this._trigger("open", this._argsValue());
        },
        _hideDatePicker: function (e) {
            this._showHidePicker(true);
            if (this.model.close)
                this._trigger("close", this._argsValue());
        },
        _getDaysInMonth: function (date) {
            return [31, (this._isLeapYear(date.getFullYear()) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
        },
        _isLeapYear: function (year) {
            return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        },
        _refreshScroller: function (e) {
            this._date.ejmScrollPanel("refresh");
            this._month.ejmScrollPanel("refresh");
            this._year.ejmScrollPanel("refresh");
        },
        _setModel: function (options) {
            var refresh;
            for (var prop in options) {
                if (prop == "renderMode" || prop == "minDate" || prop == "maxDate" || prop == "locale")
                    refresh = true;
                else {
                    setprop = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                    if (this[setprop])
                        this[setprop](options[prop])
                }
            }
            if (refresh)
                this._refresh();
        },
        _setEnabled: function (enabled) {
            this._controlStatus(enabled);
        },
        _setDateFormat: function (dateformat) {
            this._setformat = true;
            this._updateValue(dateformat);
        },
        _updateValue: function (dateformat) {
            var newVal = this._changeFormat(dateformat);
            $(this.element).val(newVal);
        },
        _controlStatus: function (enabled) {
            this._datepickerwrapper[!enabled ? "addClass" : "removeClass"]("e-m-state-disabled");
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-datepicker");
            this._renderControl();
            this._wireEvents();
        },
        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this.element.insertAfter(this._datepickerwrapper);
            this._datepickerwrapper.remove();
            if (this._dialog) {
                this._dialog.ejmDialog("instance")._destroy();
                this._dialog.remove();
                this._dialog = null;
            }
            else if (this._toolbar) {
                this._toolbar.ejmNavigationBar("instance")._destroy();
                this._toolbar.remove();
                this._toolbar = null;
            }
            else if (this._menu) {
                this._menu.ejmMenu("instance")._destroy();
                this._menu.remove();
                this._menu = null;
            }
            this.element = $(this.element);
            this._outerdiv.remove();
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale)
        },

        /*---------------Public Methods---------------*/
        show: function (e) {
            var e = { currentTarget: this._datepickerwrapper };
            if (this.model.renderMode == "ios7")
                this._menu.ejmMenu("show", e);
            else
                this._showHidePicker();
        },
        hide: function (e) {
            var e = { currentTarget: this._datepickerwrapper };
            if (this.model.renderMode == "ios7")
                this._menu.ejmMenu("hide", e);
            else
                this._showHidePicker(true);
        },
        enable: function (e) {
            this.model.enabled = true;
            this._controlStatus(this.model.enabled);
            this._showHidePicker(true);
        },

        disable: function (e) {
            this.model.enabled = false;
            this._controlStatus(this.model.enabled);
            this._showHidePicker(true);
        },
        getValue: function () {
            return $(this.element).val();
        },
        setCurrentDate: function (date) {
            this._setcurrent = true;
            this._currentDate = date;
            this._daysofmonth = this._getDaysInMonth(new Date(date));
            this._setCurrentPreviousDate();
            this._setcurrent = false;
        }
        /*---------------Public Methods End---------------*/
    });
    ej.mobile.DatePicker.Locale = ej.mobile.DatePicker.Locale || {};

    ej.mobile.DatePicker.Locale["default"] = ej.mobile.DatePicker.Locale["en-US"] = {
        confirmText: "Done",
        cancelText: "Cancel",
        headerText: "CHOOSE DATE",
    };
})(jQuery, Syncfusion);