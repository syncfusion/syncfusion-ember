/**
* @fileOverview Plugin to style the Html Timepicker elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmTimePicker", "ej.mobile.TimePicker", {
        _setFirst: true,
        _requiresID: true,
        _rootCSS: "e-m-timepicker",
        defaults: {
            renderMode: "auto",
            hourFormat: "twentyfour",
            value: null,
            timeFormat: null,
            locale: "en-US",
            enabled: true,
            enablePersistence: false,
            cssClass: "",
            select: null,
            load: null,
            focusIn: null,
            focusOut: null,
            open: null,
            close: null,
            change: null
        },
        dataTypes: {
            renderMode: "enum",
            hourFormat: "enum",
            value: "string",
            timeFormat: "enum",
            locale: "string",
            enabled: "boolean",
            enablePersistence: "boolean",
            cssClass: "string"
        },
        _init: function () {
            this._renderControl();
            this._createDelegates();
            this._wireEvents();
        },
        _timepickerInitialize: function () {
            this.model.timeFormat = this.model.timeFormat == null ? (this.model.hourFormat == "twelve" ? "hh:mm tt" : "HH:mm") : this.model.timeFormat;
            this.model.value = new Date(ej.format(new Date(), "MM/dd/yyyy") + " " + (typeof this.model.value == "string" ? this.model.value : ej.format(new Date(), this.model.timeFormat)));
            this._currentTime = this.model.value;
            this._twelvedata = [{ "value": "01" }, { "value": "02" }, { "value": "03" }, { "value": "04" }, { "value": "05" }, { "value": "06" }, { "value": "07" }, { "value": "08" }, { "value": "09" }, { "value": "10" }, { "value": "11" }, { "value": "12" }];
            this._twentyfourdata = [{ "value": "00" }, { "value": "01" }, { "value": "02" }, { "value": "03" }, { "value": "04" }, { "value": "05" }, { "value": "06" }, { "value": "07" }, { "value": "08" }, { "value": "09" }, { "value": "10" }, { "value": "11" }, { "value": "12" }, { "value": "13" }, { "value": "14" }, { "value": "15" }, { "value": "16" }, { "value": "17" }, { "value": "18" }, { "value": "19" }, { "value": "20" }, { "value": "21" }, { "value": "22" }, { "value": "23" }];
            this._minsdata = [{ "value": "00" }, { "value": "01" }, { "value": "02" }, { "value": "03" }, { "value": "04" }, { "value": "05" }, { "value": "06" }, { "value": "07" }, { "value": "08" }, { "value": "09" }, { "value": "10" }, { "value": "11" }, { "value": "12" }, { "value": "13" }, { "value": "14" }, { "value": "15" }, { "value": "16" }, { "value": "17" }, { "value": "18" }, { "value": "19" },
                                { "value": "20" }, { "value": "21" }, { "value": "22" }, { "value": "23" }, { "value": "24" }, { "value": "25" }, { "value": "26" }, { "value": "27" }, { "value": "28" }, { "value": "29" }, { "value": "30" }, { "value": "31" }, { "value": "32" }, { "value": "33" }, { "value": "34" }, { "value": "35" }, { "value": "36" }, { "value": "37" }, { "value": "38" }, { "value": "39" },
                                { "value": "40" }, { "value": "41" }, { "value": "42" }, { "value": "43" }, { "value": "44" }, { "value": "45" }, { "value": "46" }, { "value": "47" }, { "value": "48" }, { "value": "49" }, { "value": "50" }, { "value": "51" }, { "value": "52" }, { "value": "53" }, { "value": "54" }, { "value": "55" }, { "value": "56" }, { "value": "57" }, { "value": "58" }, { "value": "59" }];
            this._meridiansdata = [{ "value": this._localizedLabels.AM }, { "value": this._localizedLabels.PM }];
        },
        _renderControl: function () {
            this._orgEle = $(this.element).clone();
            ej.setRenderMode(this);
            this._localizedLabels = this._getLocalizedLabels();
            this._timepickerInitialize();
            this.element.addClass(this.model.cssClass + " e-m-" + this.model.renderMode + " e-m-user-select").attr({ "name": this._id, "readonly": true });
            this._outerdiv = ej.buildTag("div.e-m-" + this.model.renderMode + " e-m-tp e-m-user-select #" + this._id + "_tp", "<div class='e-m-tp-header'><span class='e-m-tp-time'></span>" + (this.model.hourFormat == "twelve" ? "<div class='e-m-tp-mer'><span class='mer am'>" + this._localizedLabels.AM + "</span><span class='mer pm'>" + this._localizedLabels.PM + "</span></div>" : "") + "</div>");
            this._innerdiv = ej.buildTag("div.e-m-tpinner");
            this._wrapdiv = ej.buildTag("div.e-m-tpwrap");
            this._visibletexthtml = "<div class='e-m-col-fill'></div>";
            this._hours = ej.buildTag("div.e-m-tp e-m-tphours e-m-left", "<div class='e-m-timewrapper'><div id=" + this._id + "_tphour><div class='e-m-tpouter'>" + this._visibletexthtml + "</div></div></div></div>");
            this._mins = ej.buildTag("div.e-m-tp e-m-tpmins e-m-center", "<div class='e-m-timewrapper'><div id=" + this._id + "_tpmin><div class='e-m-tpouter'>" + this._visibletexthtml + "</div></div></div></div>");
            this._meridians = ej.buildTag("div.e-m-tp e-m-tpmeridians e-m-right", "<div class='e-m-timewrapper'><div id=" + this._id + "_tpmeridian><div class='e-m-tpouter'>" + this._visibletexthtml + "</div></div></div></div>");
            this._dialogRendering();
            this._scrollInitialize();
            this._setCurrentPreviousTime();
            this._hourstext = this._outerdiv.find("#" + this._id + "_tphour .e-m-text");
            this._minstext = this._outerdiv.find("#" + this._id + "_tpmin .e-m-text");
            this._meridianstext = this._outerdiv.find("#" + this._id + "_tpmeridian .e-m-text");
            if (this.model.load)
                this._trigger("load", { value: this._currentTime });
            this._controlStatus(this.model.enabled);
        },
        _setCurrentPreviousTime: function () {
            var time = ej.format(new Date(this._currentTime), this.model.timeFormat, this.model.locale);
            $(this.element).val(time);
            this._updateHeader();
            this._previousTime = time;
        },
        _updateHeader: function () {
            this._outerdiv.find(".e-m-tp-header .e-m-tp-time").text(ej.format(new Date(this._currentTime), this.model.timeFormat, this.model.locale).slice(0, 5));
            if (this.model.hourFormat == "twelve") {
                this._outerdiv.find(".e-m-state-active").removeClass("e-m-state-active");
                this._outerdiv.find(".e-m-tp-header .e-m-tp-mer ." + ej.format(new Date(this._currentTime), "tt", this.model.locale).toLowerCase()).addClass("e-m-state-active");
            }
        },
        _scrollInitialize: function () {
            this._displacement = 45;    //height of a time element is 45px
            this._targetHeight = (window.innerHeight < 260) ? 45 : (window.innerHeight < 350) ? 135 : 225;   //height of a time element is 45
            this._minHeight = (window.innerHeight < 260) ? "low" : (window.innerHeight < 350) ? "medium" : "high";
            this._outerdiv.find(".e-m-col-fill").addClass("e-m-" + this._minHeight);
            this._scrollPanel("hour");
            this._scrollPanel("min");
            this._scrollPanel("meridian");
        },
        _scrollPanel: function (e) {
            this["_" + e] = ej.buildTag("div#" + this._id + "tp" + e + "_scrollpanel");
            this._outerdiv.find("#" + this._id + "_tp" + e).append(this["_" + e]);
            this["_" + e].ejmScrollPanel({
                enableMouseWheel: false, enableNativeScrolling: false, enableTransition: false, enableTransform: false, showScrollbars: false, target: this._id + "_tp" + e, targetHeight: this._targetHeight, renderMode: this.model.renderMode,
                scrollStart: $.proxy(this._onScrollStart, this), scrollStop: $.proxy(this._onScrollStop, this), enableBounce: false, enableDisplacement: true, displacementValue: this._displacement, displacementTime: 500,
                isRelative: true
            });
        },
        _dialogRendering: function () {
            this._renderTimeContent();
            this._dialog = ej.buildTag("div.e-m-tp-dialog e-m-" + this.model.hourFormat + "#" + this._id + "_dialog");
            this._dialog.ejmDialog({ allowScrolling: false, mode: "confirm", showHeader: false, leftButtonCaption: this._localizedLabels.cancelText, rightButtonCaption: this._localizedLabels.confirmText, renderMode: this.model.renderMode, enableAnimation: false });
            this._dialog.find(".e-m-dlg-content").append(this._outerdiv);
            this._dialog.find(".e-m-dlgbtnwrapper").appendTo(this._outerdiv);
        },
        _renderTimeContent: function () {
            if (this.model.hourFormat == "twentyfour")
                this._meridians.addClass("e-m-display-none");
            this._renderTemplate();
            this._columnRendering("hours");
            this._columnRendering("mins");
            this._columnRendering("meridians");
            this._innerdiv.append(this._wrapdiv);
            this._outerdiv.append(this._innerdiv);
        },
        _renderTemplate: function () {
            var template = {};
            template["default"] = "<div class='e-m-text'>{{:value}}</div>";
            $.templates(template);
        },
        _columnRendering: function (colname) {
            var dataval = (colname == "hours") ? this["_" + this.model.hourFormat + "data"] : this["_" + colname + "data"];
            var htmldata = $.render["default"](dataval) + this._visibletexthtml;
            this["_" + colname].find(".e-m-tpouter").html(this["_" + colname].find(".e-m-tpouter").html() + htmldata);
            this._wrapdiv.append(this["_" + colname]);
        },
        _createDelegates: function () {
            this._focusHndlr = $.proxy(this._showTimePicker, this);
            this._blurHndlr = $.proxy(this._blurEventHandler, this);
            this._dlgBtnClkHndlr = $.proxy(this._dialogButtonClick, this);
            this._resizeHndlr = $.proxy(this._resize, this);
        },
        _wireEvents: function (remove) {
            ej.listenTouchEvent($(this._dialog).find(".e-m-dlg-btn"), "mousedown", this._dlgBtnClkHndlr, remove);
            ej.listenEvents([$(this.element), $(this.element)], ["focus", "blur"], [this._focusHndlr, this._blurHndlr], remove);
            ej.listenTouchEvent($(window), "onorientationchange" in window ? "orientationchange" : "resize", this._resizeHndlr, remove);
        },
        _showTimePicker: function (e) {
            if (this.model.focusIn)
                this._trigger("focusIn", { value: this._currentTime });
            this._showHidePicker();
            this._setInitialTime();
            this._outerdiv.find(".e-m-timewrapper").removeClass("e-m-scrollstart");
            if (this.model.open)
                this._trigger("open", { value: this._currentTime });
        },
        _setInitialTime: function () {
            this._setValue(this._currentTime);
            this._setProperTime();
        },
        _setValue: function (date) {
            var date = new Date(date);
            this._resetScrollPos();
            this._hour.ejmScrollPanel("scrollTo", 0, -this._displacement * (this.model.hourFormat == "twelve" ? (date.getHours() % 12 == 0 ? 11 : date.getHours() % 12 - 1) : date.getHours()), 0);
            this._min.ejmScrollPanel("scrollTo", 0, -this._displacement * (date.getMinutes()), 0);
            this._meridian.ejmScrollPanel("scrollTo", 0, -this._displacement * (date.getHours() > 11 ? 1 : 0), 0);
        },
        _resetScrollPos: function () {
            this._hour.ejmScrollPanel("scrollTo", 0, 0, 0);
            this._min.ejmScrollPanel("scrollTo", 0, 0, 0);
            this._meridian.ejmScrollPanel("scrollTo", 0, 0, 0);
        },
        _blurEventHandler: function () {
            if (this.model.focusOut)
                this._trigger("focusOut", { value: this._currentTime });
        },
        _dialogButtonClick: function (e) {
            if ($(e.target).text() == this._localizedLabels.confirmText) {
                $(this.element).val(ej.format(this._currentTime, this.model.timeFormat));
                if (this._previousTime != $(this.element).val()) {
                    if (this.model.select)
                        this._trigger("select", { value: this._currentTime });
                }
                this._previousTime = $(this.element).val();
            }
            else if ($(e.target).text() == this._localizedLabels.cancelText) {
                this._currentTime = new Date(ej.format(new Date(), "MM/dd/yyyy") + " " + this._previousTime);
                this._setInitialTime();
            }
            this._showHidePicker(true);
            if (this.model.close)
                this._trigger("close", { value: this._currentTime });
        },
        _showHidePicker: function (remove) {
            var proxy = this;
            var e = { currentTarget: this.element };
            var visibility = remove ? "hidden" : "visible";
            this.element.blur();
            this._dialog.ejmDialog(remove ? "close" : "open");
        },
        _resize: function (e) {
            var proxy = this;
            setTimeout(function () {
                var currentHeight = (window.innerHeight < 350) ? (window.innerHeight < 260) ? "low" : "medium" : "high";
                if (proxy._minHeight != currentHeight) {
                    proxy._targetHeight = (currentHeight == "low") ? 45 : (currentHeight == "medium") ? 135 : 225;   //height of a time element is 45
                    proxy._minHeight = currentHeight;
                    proxy._hour.ejmScrollPanel({ targetHeight: proxy._targetHeight });
                    proxy._min.ejmScrollPanel({ targetHeight: proxy._targetHeight });
                    proxy._meridian.ejmScrollPanel({ targetHeight: proxy._targetHeight });
                    proxy._outerdiv.find(".e-m-col-fill").removeClass("e-m-short e-m-low e-m-high").addClass("e-m-" + currentHeight);
                    proxy._setInitialTime();
                }
            }, 200);
        },
        _onScrollStart: function (e) {
            $("#" + e.model.target).find(".e-m-text-active").removeClass('e-m-text-active');
        },
        _onScrollStop: function (e) {            
                var target = e.model.target.replace(this._id + "_tp", '');
                this._setProperTime(target);            
        },
        _setProperTime: function (target) {
            var time = this._scrollCoordinates();
            var hours = this.model.hourFormat == "twelve" ? (time.meridian > 0 ? (time.hours == 12 ? 12 : time.hours == 0 ? 13 : time.hours == 11 ? 12 : time.hours + 13) : (time.hours == 0 ? 1 : time.hours == 12 ? 11 : time.hours == 11 ? 0 : time.hours + 1)) : time.hours;
            this._currentTime = new Date(new Date().setHours(this.model.hourFormat == "twelve" ? hours : time.hours, time.mins));
            this._activeText(this.model.hourFormat == 'twelve' ? time.hours == 12 ? time.hours : time.hours + 1 : time.hours + 1, time.mins + 1, time.meridian, target);
            this._updateHeader();
            if (this.model.change)
                this._trigger("change", { value: this._currentTime });
        },
        _scrollCoordinates: function () {
            var time = {};
            time.Scrollhours = Math.round(this._hour.ejmScrollPanel("getScrollPosition").y / this._displacement);
            time.Scrollmins = Math.round(this._min.ejmScrollPanel("getScrollPosition").y / this._displacement);
            time.Scrollmeridian = Math.round(this._meridian.ejmScrollPanel("getScrollPosition").y / this._displacement);
            time.hours = -(time.Scrollhours);
            time.mins = -(time.Scrollmins);
            time.meridian = -(time.Scrollmeridian);
            return time;
        },
        _activeText: function (hours, mins, meridians, target) {
            if (target) {
                $(this["_" + target + "stext"]).removeClass("e-m-text-active");
                $(this["_" + target + "stext"][eval(target + "s") - (target == "meridian" ? 0 : 1)]).addClass("e-m-text-active");
            }
            else {
                $(this._hourstext[hours - 1]).addClass("e-m-text-active");
                $(this._minstext[mins - 1]).addClass("e-m-text-active");
                $(this._meridianstext[meridians]).addClass("e-m-text-active");
            }
        },
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                if (this[setModel])
                    this[setModel](options[prop]);
                else
                    refresh = true;
            }
            if (refresh)
                this._refresh();
        },
        _setTimeFormat: function (timeformat) {
            $(this.element).val(ej.format(this._currentTime, this.model.timeFormat));
        },
        _setEnabled: function (enabled) {
            this._controlStatus(enabled);
        },
        _controlStatus: function (enabled) {
            this.element[!enabled ? "addClass" : "removeClass"]("e-m-state-disabled");
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-timepicker");
            this._renderControl();
            this._wireEvents();
        },
        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        /*---------------Public Methods---------------*/
        show: function (e) {
            this._showHidePicker();
        },
        hide: function (e) {
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
        setCurrentTime: function (time) {
            this._currentTime = new Date(ej.format(new Date(), "MM/dd/yyyy") + " " + time);
            this._setCurrentPreviousTime();
        }
        /*---------------Public Methods End---------------*/
    });

    ej.mobile.TimePicker.HourFormat = {
        TwentyFour: "twentyfour",
        Twelve: "twelve"
    };
    ej.mobile.TimePicker.Locale = ej.mobile.TimePicker.Locale || {};
    ej.mobile.TimePicker.Locale["default"] = ej.mobile.TimePicker.Locale["en-US"] = {
        confirmText: "OK",
        cancelText: "CANCEL",
        AM: "AM",
        PM: "PM",
    };
})(jQuery, Syncfusion);