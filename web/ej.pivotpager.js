/**
* @fileOverview Plugin to style the Html Pivot Pager elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget("ejPivotPager", "ej.PivotPager", {

        _rootCSS: "e-pivotpager",
        element: null,
        model: null,

        _getModel: function () {
            return this.model;
        },

        _setModel: function (value) {
            this.model = value;
        },

        defaults: {
            targetControlID: "",
            categoricalCurrentPage: 1,
            seriesCurrentPage: 1,
            seriesPageCount: 0,
            categoricalPageCount: 0,
            locale: "en-US",
            mode: "both"
        },

        _init: function () {
            if ($("#" + this.model.targetControlID).hasClass('e-pivotgrid') || this.element.parents().find("#" + this.model.targetControlID).hasClass("e-pivotgrid")) {
                this.targetControlName = "PivotGrid";
                this.targetControl = $("#" + this.model.targetControlID).data("ejPivotGrid") || this.element.parents().find("#" + this.model.targetControlID).data("ejPivotGrid");
                this.targetControl._pagerObj = this;
            }
            else if ($("#" + this.model.targetControlID).hasClass('e-pivotchart') || this.element.parents().find("#" + this.model.targetControlID).hasClass("e-pivotchart")) {
                this.targetControlName = "PivotChart";
                this.targetControl = $("#" + this.model.targetControlID).data("ejPivotChart") || this.element.parents().find("#" + this.model.targetControlID).data("ejPivotChart");
                this.targetControl._pagerObj = this;
            }
            else if ($("#" + this.model.targetControlID).hasClass('e-pivotclient') || this.element.parents("#" + this.model.targetControlID).hasClass("e-pivotclient")) {
                this.targetControlName = "PivotClient";
                this.targetControl = $("#" + this.model.targetControlID).data("ejPivotClient") || this.element.parents("#" + this.model.targetControlID).data("ejPivotClient");
                this.targetControl._pagerObj = this;
            }
            this._load();
            this._unwireEvents();
            this._wireEvents();
        },

        _destroy: function () {
            this.element.empty().removeClass("e-pivotpager");
            this.element.removeClass("e-js pivotPager").removeAttr("data-targetControlID tabindex");
            if (this.element.attr("class") == "") this.element.removeAttr("class");
        },

        _wireEvents: function () {
            this._on(this.element, "keydown", ".e-pagerTextBox", this._pagerTextBoxClick);
            this._on(this.element, "click", ".e-moveNext", this._moveNextPage);
            this._on(this.element, "click", ".e-moveLast", this._moveLastPage);
            this._on(this.element, "click", ".e-moveFirst", this._moveFirstPage);
            this._on(this.element, "blur", ".e-pagerTextBox", this._restorePageNo);
            this._on(this.element, "click", ".e-movePrevious", this._movePreviousPage);
        },

        _unwireEvents: function () {
            this._off(this.element, "click", ".e-moveNext", this._moveNextPage);
            this._off(this.element, "blur", ".e-pagerTextBox", this._restorePageNo);
            this._off(this.element, "click", ".e-moveLast", this._moveLastPage);
            this._off(this.element, "click", ".e-moveFirst", this._moveFirstPage);
            this._off(this.element, "click", ".e-movePrevious", this._movePreviousPage);
            this._off(this.element, "keydown", ".e-pagerTextBox", this._pagerTextBoxClick);
        },

        _getLocalizedLabels: function (property) {
            return (ej.isNullOrUndefined(ej.PivotPager.Locale[this.model.locale]) || ej.PivotPager.Locale[this.model.locale][property] === undefined) ? ej.PivotPager.Locale["en-US"][property] : ej.PivotPager.Locale[this.model.locale][property];
        },

        _load: function () {
            $(this.element).addClass("pivotPager").attr("data-targetControlID", this.model.targetControlID);
            var pagerContent = "";
            if (this.targetControl.model.enableRTL) {
                this.element.addClass("e-rtl");
            }
            if (this.model.mode != "series") {
                var categoricalPager = ej.buildTag("td.e-categPagerTd", "");
                $(categoricalPager).html(ej.buildTag("div.e-pagerDiv", ej.buildTag("span.e-moveFirst e-icon").attr("role", "button").attr("aria-label", "move first")[0].outerHTML + ej.buildTag("span.e-movePrevious e-icon").attr("role", "button").attr("aria-label", "move previous")[0].outerHTML + ej.buildTag("span.e-pagerLabel", this._getLocalizedLabels("CategoricalPage"))[0].outerHTML + ej.buildTag("input#" + this._id + "_CategCurrentPage.e-pagerTextBox")[0].outerHTML + ej.buildTag("span.e-categPageCount")[0].outerHTML + ej.buildTag("span.e-moveNext e-icon").attr("role", "button").attr("aria-label", "move next")[0].outerHTML + ej.buildTag("span.e-moveLast e-icon").attr("role", "button").attr("aria-label", "move last")[0].outerHTML));
                pagerContent = categoricalPager[0].outerHTML;
            }
            if (this.model.mode != "categorical") {
                var seriesPager = ej.buildTag("td.e-seriesPagerTd", "");
                $(seriesPager).html(ej.buildTag("div.e-pagerDiv", ej.buildTag("span.e-moveFirst e-icon").attr("role", "button").attr("aria-label", "move first")[0].outerHTML + ej.buildTag("span.e-movePrevious e-icon").attr("role", "button").attr("aria-label", "move previous")[0].outerHTML + ej.buildTag("span.e-pagerLabel", this._getLocalizedLabels("SeriesPage"))[0].outerHTML + ej.buildTag("input#" + this._id + "_SeriesCurrentPage.e-pagerTextBox")[0].outerHTML + ej.buildTag("span.e-seriesPageCount")[0].outerHTML + ej.buildTag("span.e-moveNext e-icon").attr("role", "button").attr("aria-label", "move next")[0].outerHTML + ej.buildTag("span.e-moveLast e-icon").attr("role", "button").attr("aria-label", "move last")[0].outerHTML));
                pagerContent += seriesPager[0].outerHTML;
            }
            var pagerTable = ej.buildTag("table", ej.buildTag("tbody", ej.buildTag("tr", pagerContent)))[0];
            $(this.element).html(pagerTable);
        },

        initPagerProperties: function (headerCounts, pageSettings) {
            if (headerCounts.Row <= pageSettings.SeriesPageSize) {
                $("#" + this._id + "_SeriesCurrentPage").attr("disabled", true);
                $(".e-seriesPagerTd").fadeTo(0, 0.5);
            }
            else {
                $("#" + this._id + "_SeriesCurrentPage").attr("disabled", false);
                $(".e-seriesPagerTd").fadeTo(0, 1);
            }
            if (headerCounts.Column <= pageSettings.CategoricalPageSize) {
                $("#" + this._id + "_CategCurrentPage").attr("disabled", true);
                $(".e-categPagerTd").fadeTo(0, 0.5);
            }
            else {
                $("#" + this._id + "_CategCurrentPage").attr("disabled", false);
                $(".e-categPagerTd").fadeTo(0, 1);
            }
            this.model.categoricalPageCount = pageSettings.CategoricalPageSize == 0 ? 1 : Math.ceil(headerCounts.Column / pageSettings.CategoricalPageSize);
            this.model.seriesPageCount = pageSettings.SeriesPageSize == 0 ? 1 : Math.ceil(headerCounts.Row / pageSettings.SeriesPageSize);
            this.model.categoricalCurrentPage = pageSettings.CategoricalCurrentPage;
            this.model.seriesCurrentPage = pageSettings.SeriesCurrentPage;
            this._initPagerControl();
        },

        _initPagerControl: function (e) {
            if (this.model.mode != "series") {
                $(this.element.find(".e-categPageCount")[0]).html("/ " + this.model.categoricalPageCount);
                $("#" + this._id + "_CategCurrentPage")[0].value = this.model.categoricalCurrentPage;
                this._setNavigators(this.model.categoricalCurrentPage, this.model.categoricalPageCount, this.element.find(".e-categPagerTd")[0]);
            }
            if (this.model.mode != "categorical") {
                $(this.element.find(".e-seriesPageCount")[0]).html("/ " + this.model.seriesPageCount);
                $("#" + this._id + "_SeriesCurrentPage")[0].value = this.model.seriesCurrentPage;
                this._setNavigators(this.model.seriesCurrentPage, this.model.seriesPageCount, this.element.find(".e-seriesPagerTd")[0]);
            }
        },
		
        _moveNextPage: function (e) {
            if (!$(e.target).hasClass("e-disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".e-pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".e-movePrevious")[0]).removeClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-moveFirst")[0]).removeClass("e-disabled");
                pagerInput.value = parseInt(pagerInput.value) + 1;
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("categorical", pagerInput.value);
                    if (pagerInput.value == this.model.categoricalPageCount) {
                        $(e.target).addClass("e-disabled");
                        $($($(e.target).parents('td')[0]).find(".e-moveLast")[0]).addClass("e-disabled");
                    }
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("series", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("series", pagerInput.value);
                    if (pagerInput.value == this.model.seriesPageCount) {
                        $(e.target).addClass("e-disabled");
                        $($($(e.target).parents('td')[0]).find(".e-moveLast")[0]).addClass("e-disabled");
                    }
                }
            }
        },

        _movePreviousPage: function (e) {
            if (!$(e.target).hasClass("e-disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".e-pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".e-moveNext")[0]).removeClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-moveLast")[0]).removeClass("e-disabled");
                pagerInput.value = parseInt(pagerInput.value) - 1;
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("categorical", pagerInput.value);
                    if (pagerInput.value == "1") {
                        $(e.target).addClass("e-disabled");
                        $($($(e.target).parents('td')[0]).find(".e-moveFirst")[0]).addClass("e-disabled");
                    }
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("series", pagerInput.value);
                    if (this.targetControlName == "PivotClient") {
                        this.targetControl.refreshPagedPivotClient("series", pagerInput.value);
                    }
                    if (pagerInput.value == "1") {
                        $(e.target).addClass("e-disabled");
                        $($($(e.target).parents('td')[0]).find(".e-moveFirst")[0]).addClass("e-disabled");
                    }
                }
            }
        },

        _moveLastPage: function (e) {
            if (!$(e.target).hasClass("e-disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".e-pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".e-movePrevious")[0]).removeClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-moveFirst")[0]).removeClass("e-disabled");
                $(e.target).addClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-moveNext")[0]).addClass("e-disabled");
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value = this.model.categoricalPageCount;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("categorical", pagerInput.value);                    
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value = this.model.seriesPageCount;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("series", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("series", pagerInput.value);
                }
            }
        },

        _moveFirstPage: function (e) {
            if (!$(e.target).hasClass("e-disabled")) {
                var pagerInput = $($(e.target).parents('td')[0]).find(".e-pagerTextBox")[0];
                $($($(e.target).parents('td')[0]).find(".e-moveNext")[0]).removeClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-moveLast")[0]).removeClass("e-disabled");
                $(e.target).addClass("e-disabled");
                $($($(e.target).parents('td')[0]).find(".e-movePrevious")[0]).addClass("e-disabled");
                if (pagerInput.id.indexOf("Categ") != -1) {
                    this.model.categoricalCurrentPage = pagerInput.value = 1;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("categorical", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("categorical", pagerInput.value);
                }
                else if (pagerInput.id.indexOf("Series") != -1) {
                    this.model.seriesCurrentPage = pagerInput.value = 1;
                    if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid("series", pagerInput.value);
                    else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart("series", pagerInput.value);
                    else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient("series", pagerInput.value);
                }
            }
        },
        _pagerTextBoxClick: function (e) {
            if (e.which == 13) {
                e.preventDefault();
                var pagerTd = $(e.target).parents('td')[0];
                var pageCount = pagerTd.className.indexOf('categ') != -1 ? this.model.categoricalPageCount : this.model.seriesPageCount;
                if (parseInt(e.target.value) > pageCount || parseInt(e.target.value) < 1 || e.target.value == "") {
                    this._restorePageNo(e);
                    ej.Pivot._createErrorDialog(this._getLocalizedLabels("PageCountErrorMsg"), "Error", this);
                }
                else {
                    if (pagerTd.className.indexOf('categ') != -1 && this.model.categoricalCurrentPage != parseInt(e.target.value)) {
                        this.model.categoricalCurrentPage = e.target.value;
                        if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid(pagerTd.className, e.target.value);
                        else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart(pagerTd.className, e.target.value);
                        else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient(pagerTd.className, e.target.value);
                    }
                    else if (pagerTd.className.indexOf('series') != -1 && this.model.seriesCurrentPage != parseInt(e.target.value)) {
                        this.model.seriesCurrentPage = e.target.value;
                        if (this.targetControlName == "PivotGrid") this.targetControl.refreshPagedPivotGrid(pagerTd.className, e.target.value);
                        else if (this.targetControlName == "PivotChart") this.targetControl.refreshPagedPivotChart(pagerTd.className, e.target.value);
                        else if (this.targetControlName == "PivotClient") this.targetControl.refreshPagedPivotClient(pagerTd.className, e.target.value);
                    }
                    this._setNavigators(e.target.value, pageCount, pagerTd);
                    e.target.blur();
                }
            }
            else {
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) return;
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) e.preventDefault();
            }
        },

        _restorePageNo: function (e) { e.target.value = e.target.id.indexOf("Categ") != -1 ? this.model.categoricalCurrentPage : this.model.seriesCurrentPage; },

        _setNavigators: function (value, pageCount, pagerTd) {
            if (value == pageCount) {
                $($(pagerTd).find(".e-moveNext")[0]).addClass("e-disabled");
                $($(pagerTd).find(".e-moveLast")[0]).addClass("e-disabled");
            }
            if (value == "1") {
                $($(pagerTd).find(".e-movePrevious")[0]).addClass("e-disabled");
                $($(pagerTd).find(".e-moveFirst")[0]).addClass("e-disabled");
            }
            if (value > 1) {
                $($(pagerTd).find(".e-movePrevious")[0]).removeClass("e-disabled");
                $($(pagerTd).find(".e-moveFirst")[0]).removeClass("e-disabled");
            }
            if (value < pageCount) {
                $($(pagerTd).find(".e-moveNext")[0]).removeClass("e-disabled");
                $($(pagerTd).find(".e-moveLast")[0]).removeClass("e-disabled");
            }
        }
    })

    ej.PivotPager.Locale = ej.PivotPager.Locale || {};

    ej.PivotPager.Locale["en-US"] = {
        SeriesPage: "Series Page",
        CategoricalPage: "Categorical Page",
        Error: "Error",
        OK: "OK",
        Close: "Close",
        PageCountErrorMsg:"Enter valid page number"
    };

    ej.PivotPager.Mode = {
        Both: "both",
        Categorical: "categorical",
        Series: "series"
    };

})(jQuery, Syncfusion);

