/**
* @fileOverview Plugin to style the Html AutoComplete elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmAutocomplete", "ej.mobile.Autocomplete", {
        _setFirst: true,
        _rootCSS: "e-m-ac",
        defaults: {
            renderMode: "auto",
            cssClass: "",
            watermarkText: null,
            minCharacter: 1,
            enableMultiSelect: false,
            caseSensitiveSearch: false,
            enableDistinct: false,
            enablePersistence: false,
            enableAutoFill: false,
            allowSorting: true,
            templateId: "",
            popupHeight: "164px",
            popupWidth: "auto",
            itemsCount: 0,
            sortOrder: "ascending",
            delimiterChar: ",",
            emptyResultText: null,
            showEmptyResultText: true,
            filterType: "startswith",
            mode: "default",
            value: "",
            enabled: true,
            dataSource: [],
            fields: {
                text: null,
                key: null,
                image: null
            },
            locale: "en-US",
            touchEnd: null,
            keyPress: null,
            select: null,
            change: null,
            focusIn: null,
            focusOut: null
        },
        dataTypes: {
            renderMode: "enum",
            filterType: "enum",
            sortOrder: "enum",
            minCharacter: "number",
            dataSource: "data",
            enableMultiSelect: "boolean",
            caseSensitiveSearch: "boolean",
            enableDistinct: "boolean",
            enablePersistence: "boolean",
            enableAutoFill: "boolean",
            allowSorting: "boolean",
            showEmptyResultText: "boolean",
            enabled: "boolean",
            itemsCount: "number",
            locale: "string"
        },
        observables: ["value"],
        value: ej.util.valueFunction("value"),
        _init: function () {
            this._orgEle = this.element.clone();
            ej.setRenderMode(this);
            this._getLocalizedLabels();
            this.model.emptyResultText = !ej.isNullOrUndefined(this.model.emptyResultText) ? this.model.emptyResultText : this._localizedLabels["emptyResultText"];
            this.model.watermarkText = !ej.isNullOrUndefined(this.model.watermarkText) ? this.model.watermarkText : this._localizedLabels["watermarkText"];
            this._initialize();
            this._renderControl();
            this._wireEvents();
        },
        _initialize: function () {
            this._id = this.element.attr('id');
            this._noResultEle = ej.buildTag('li.e-m-lv-item e-m-emptyresult', ej.buildTag('a.e-m-lv-content',
                this.model.emptyResultText, {}, { 'data-ej-appajax': false }));
            this._selectedData = [];
            this._hiddenVal = [];
            this.model.dataSource = eval(this.model.dataSource);
            if (this.model.value != "") {
                this._selectedData.push(this.model.value);
                this.element.val(this.model.value);
            }
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale)
        },
        _renderControl: function () {
            this.element.addClass(this.model.cssClass);
            this._wrapper = ej.buildTag("div#" + this._id + "_wrapper.e-m-ac-wrapper").addClass("e-m-" + this.model.renderMode);
            this._wrapper = this.element.wrap(this._wrapper).parent();
            this._setWatermarkText(this.model.watermarkText);
            this._controlState(this.model.enabled);
            this._hiddenElement = ej.buildTag("input#" + this._id + "_hidden", {}, { "display": "none" }, { "name": this._id });
            this._accList = ej.buildTag('ul#' + this._id + 'list.e-m-ac-list').appendTo(this._wrapper.append(this._hiddenElement));
            this._listWrapper = ej.buildTag("div.e-m-list-wrapper");
            if (this.model.mode == ej.mobile.Autocomplete.Mode.Search) {
                this._search = ej.buildTag("div.e-m-icon-search");
                this._clear = ej.buildTag("div.e-m-icon-close");
                this._search.appendTo(this._wrapper.addClass('e-m-ac-search'));
                this._clear.appendTo(this._wrapper).hide();
            }
            this._listWrapper.appendTo(this._wrapper).append(this._accList).hide();
        },
        _createDelegates: function () {
            this._focus = $.proxy(this._focusHandler, this);
            this._blur = $.proxy(this._blurHandler, this);
            this._keyPress = $.proxy(this._keyPressHandler, this);
            this._docTouchStart = $.proxy(this._docTouchStartHandler, this);
            this._docTouchEnd = $.proxy(this._docTouchEndHandler, this);
            this._clearClick = $.proxy(this._clearClickHandler, this);
        },
        _wireEvents: function (remove) {
            var doc = $(document);
            this._createDelegates();
            ej.listenEvents([this.element, this.element, this.element, doc, doc], ["focus", "blur", "keyup", ej.startEvent(), ej.endEvent()],
                [this._focus, this._blur, this._keyPress, this._docTouchStart, this._docTouchEnd], remove);
            this.model.mode == ej.mobile.Autocomplete.Mode.Search && ej.listenTouchEvent(this._clear, ej.endEvent(), this._clearClick, remove);
        },
        _focusHandler: function (evt) {
            this.element.addClass("e-m-focus");
            var char = this.element.val().substring(this.element.val().length - 2, this.element.val().length);
            char != this.model.delimiterChar + " " && this.model.enableMultiSelect && this.element.val().length &&
            this.element.val(this.element.val() + this.model.delimiterChar + " ");
            this.model.focusIn && this._trigger("focusIn", { event: evt, isInteraction: true });
        },
        _blurHandler: function (evt) {
            this.element.removeClass("e-m-focus");
            this.model.focusOut && this._trigger("focusOut", { event: evt, isInteraction: true });
        },
        _keyPressHandler: function (evt) {
            var delimitterIndex = this.element.val().lastIndexOf(this.model.delimiterChar),
                searchKey = (delimitterIndex < 0) ? this.element.val() : this.element.val().substring(delimitterIndex + 2);
            if (searchKey.length >= this.model.minCharacter) {
                dataQuery = ej.Query().where(this.model.fields.text, this.model.filterType, searchKey, !this.model.caseSensitiveSearch);
                this._addQuery(dataQuery);
                this._renderSuggestionsList(dataQuery);
                this.model.enableAutoFill && evt.keyCode != 8 && this.model.filterType == ej.mobile.Autocomplete.FilterType.StartsWith
                && !this._selectedData.length && this._autoFill();
                if (!(this.model.dataSource instanceof ej.DataManager)) {
                    this._listWrapper.show();
                    !this._accList.children().length ? this.model.showEmptyResultText &&
                    this._accList.append(this._noResultEle) : this._checkItems();
                }
            }
            !this.element.val() && this.clearText();
            this.model.keyPress && this._trigger("keyPress", { event: evt, isInteraction: true });
        },
        _listTouchHandler: function (evt) {
            if (!$(evt.event.target).closest(this._noResultEle).length) {
                var text = this.model.templateId != "" ? evt.data.text : evt.text, key = evt.item.attr("data-value"),
                    val = key ? key : text;
                if (this.model.enableMultiSelect) {
                    if (!evt.isChecked) {
                        this._selectedData = jQuery.grep(this._selectedData, function (value) { return value != text; });
                        this._hiddenVal = jQuery.grep(this._hiddenVal, function (value) { return value != val; });
                    }
                    else if ($.inArray(text, this._selectedData) == -1) {
                        this._selectedData.push(text);
                        this._hiddenVal.push(val);
                    }
                    this.element.val(this._setDelimiterChar(this._selectedData));
                    this._hiddenElement.attr("value", this._hiddenVal.toString());
                    this.value(this._setDelimiterChar(this._selectedData));
                }
                else {
                    this.element.val(text);
                    this.value(text);
                    this._hiddenElement.attr("value", val);
                    this._selectedData = [];
                    this._hiddenVal = [];
                    this._selectedData.push(text);
                    this._listWrapper.hide();
                }
                this.element.blur();
                this.model.select && this._trigger("select", evt);
                this.model.touchEnd && this._trigger("touchEnd", evt);
                this.model.change && this._trigger("change", evt);
            }
            this._accList.find('.e-m-emptyresult').removeClass('e-m-lv-selected e-m-lv-checked');
        },
        _onComplete: function (evt) {
            this.model.enableDistinct && this._distinctList();
            this.element.val() && this._listWrapper.show();
            !this._accList.children().length ? this.model.showEmptyResultText && this._accList.append(this._noResultEle) : this._checkItems();
            this._renderScroll();
        },
        _clearClickHandler: function (evt) {
            this.clearText();
        },
        _docTouchStartHandler: function (evt) {
            if (!this._isTargetDropDown(evt.target))
                this._hide = true;
        },
        _docTouchEndHandler: function (evt) {
            if (!this._isTargetDropDown(evt.target) && this._hide) {
                this._listWrapper.hide();
                this.element.removeClass("e-m-focus");
                this.model.enableMultiSelect && this.element.val(this.element.val().replace(eval("/" + this.model.delimiterChar + "\\s*$/"), ''));
                this._hide = false;
            }
        },
        _isTargetDropDown: function (target) {
            return $(target).closest(this._wrapper).length;
        },
        _addQuery: function (query) {
            if (this.model.allowSorting) {
                var order = (this.model.sortOrder == ej.mobile.Autocomplete.SortOrder.Descending) ? true : false;
                query.sortBy(this.model.fields.text ? this.model.fields.text : "", order);
            }
            this.model.itemsCount > 0 && query.take(this.model.itemsCount);
        },
        _renderSuggestionsList: function (dataQuery) {
            var listModel = {
                renderMode: this.model.renderMode, dataSource: this.model.dataSource, query: dataQuery, templateId: this.model.templateId,
                touchEnd: $.proxy(this._listTouchHandler, this), enableChecklist: this.model.enableMultiSelect,
                fields: { text: this.model.fields.text, image: this.model.fields.image, value: this.model.fields.key },
                actionSuccess: $.proxy(this._onComplete, this)
            };
            this._accList.ejmListView(listModel);
            this._listWrapper.hide();
            this.model.enableDistinct && this._distinctList();
            this._renderScroll();
            this.model.mode == ej.mobile.Autocomplete.Mode.Search && this._clear.show();
        },
        _renderScroll: function () {
            this._scrollDestroy();
            var lHeight = this._listWrapper.height(), wHeight = window.innerHeight, popupHeight = parseInt(this.model.popupHeight),
                tarHeight = lHeight > popupHeight ? popupHeight : lHeight, tarOffSet = this.element.offset().top + this.element.height();
            popupHeight < lHeight && this._listWrapper.ejmScrollPanel({
                renderMode: this.model.renderMode, targetHeight: popupHeight
            });
            (tarOffSet + tarHeight) > wHeight && this._listWrapper.css('top', -tarHeight);
            this.model.popupWidth != "auto" && this._listWrapper.css('width', this.model.popupWidth);
        },
        _scrollDestroy: function () {
            var scrollEle = this._wrapper.find('.e-m-scroll');
            if (scrollEle.length) {
                scrollEle.ejmScrollPanel("destroy");
                this._listWrapper.addClass('e-m-list-wrapper');
            }
        },
        _autoFill: function () {
            var data = this._accList.ejmListView("getTextByIndex", 0);
            data.length && typeof data === "string" ? this._setInputText(data) : this.model.showEmptyResultText &&
            this._accList.append(this._noResultEle);
        },
        _distinctList: function () {
            var list = this._accList.data("ejmListView"), data = ej.dataUtil.distinct(list.model.dataSource, this.model.fields.text, true);
            this._accList.ejmListView({ dataSource: data });
            this._listWrapper.hide();
        },
        _setDelimiterChar: function (textObj) {
            var text = textObj.toString();
            return text.replace(/,/g, this.model.delimiterChar + " ");
        },
        _getDelimiterIndex: function () {
            return this.element.val().lastIndexOf(this.model.delimiterChar);
        },
        _setInputText: function (data) {
            var delimiterIndex = this._getDelimiterIndex() + 1;
            var currentVal = this.element.val();
            var x = this.element[0].selectionStart;
            this.element.val(currentVal.substring(0, delimiterIndex) + data);
            this.element[0].selectionStart = x;
            var y = this.element[0].selectionEnd;
            this.element[0].selectionEnd = y;
        },
        _setWatermarkText: function (text) {
            text ? this.element.attr("placeholder", text) : this.element.removeAttr("placeholder");
        },
        _controlState: function (enabled) {
            this._wrapper[!enabled ? "addClass" : "removeClass"]("e-m-state-disabled");
        },
        _checkItems: function () {
            if (this.model.enableMultiSelect) {
                var listInstance = this._accList.data("ejmListView");
                var checked = [];
                for (i = 0; i < this._selectedData.length; i++) {
                    for (j = 0; j < listInstance.model.dataSource.length; j++) {
                        var text = this.model.fields.text ? listInstance.model.dataSource[j][this.model.fields.text]
                            : listInstance.model.dataSource[j];
                        this._selectedData[i] == text && checked.push(j);
                    }
                }
                listInstance.checkItemsByIndices(checked);
            }
        },
        enable: function () {
            this.element.removeClass("e-m-state-disabled");
        },
        disable: function () {
            this.element.addClass("e-m-state-disabled");
        },
        getValue: function () {
            return this.element.val();
        },
        clearText: function () {
            this.element.val('');
            this.value('');
            this._selectedData = [];
            this._hiddenVal = [];
            this.model.mode == ej.mobile.Autocomplete.Mode.Search && this._clear.hide();
            this._listWrapper.hide();
        },
        getSelectedItems: function () {
            return this._selectedData;
        },
        _setModel: function (options) {
            var refresh;
            if (!this.model.enabled && ej.isNullOrUndefined(options["enabled"])) return false;
            for (var option in options) {
                switch (option) {
                    case "renderMode": this._setRenderMode(options.renderMode); break;
                    case "delimiterChar": this.model.enableMultiSelect && this._setDelimiterChar(this._text); break;
                    case "enabled": this._controlState(this.model.enabled); break;
                    case "watermarkText": this._setWatermarkText(this.model.watermarkText); break;
                    case "value": this.value(this.model.value); break;
                    case "emptyResultText": this._setEmptyRestultText(); break;
                    case "locale": this._setLocale(options.locale); break;
                    default: refresh = true; break;
                }
            }
            refresh && this._refresh();
            refresh = false;
        },
        _setEmptyRestultText: function () {
            this._noResultEle.find("a.e-m-lv-content").html(this.model.emptyResultText);
        },
        _setLocale: function (option) {
            this._getLocalizedLabels();
            this.model.emptyResultText = this._localizedLabels["emptyResultText"];
            this.model.watermarkText = this._localizedLabels["watermarkText"];
            this._setWatermarkText();
            this._setEmptyRestultText();
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass(this._rootCSS);
            this._renderControl();
            this._wireEvents();
        },
        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this._orgEle.insertBefore(this._wrapper);
            this._wrapper.remove();
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        }
    });

    ej.mobile.Autocomplete.FilterType = {
        StartsWith: "startswith",
        Contains: "contains"
    };
    ej.mobile.Autocomplete.Mode = {
        Search: "search",
        Default: "default"
    };
    ej.mobile.Autocomplete.SortOrder = {
        Ascending: "ascending",
        Descending: "descending"
    };
    ej.mobile.Autocomplete.Locale = ej.mobile.Autocomplete.Locale || {};
    ej.mobile.Autocomplete.Locale["default"] = ej.mobile.Autocomplete.Locale["en-US"] = {
        watermarkText: null,
        emptyResultText: "No suggestions"
    };
})(jQuery, Syncfusion);