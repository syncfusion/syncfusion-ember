/**
* @fileOverview Plugin to style the Html DropDown elements
* @copyright Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmDropDownList", "ej.mobile.DropDownList", {
        _setFirst: true,
        _rootCSS: "e-m-dropdownlist",
        validTags: ["input"],
        defaults: {
            renderMode: "auto",
            cssClass: "",
            targetId: null,
            templateId: "",
            popupHeight: "164px",
            popupWidth: "auto",
            dataSource: [],
            fields: {
                text: null,
                value: null,
                groupBy: null,
                image: null,
                checkBy: null,
            },
            enableMultiSelect: false,
            enablePersistence: false,
            readOnly: false,
            enabled: true,
            query: null,
            watermarkText: null,
            locale: "en-US",
            selectedItemIndex: -1,
            delimiterChar: ",",
            itemsCount: 0,
            allowVirtualScrolling: false,
            focusIn: null,
            focusOut: null,
            select: null,
            change: null,
            actionSuccess: null,
            actionFailure: null,
            actionComplete: null,
        },
        dataTypes: {
            renderMode: "enum",
            dataSource: "data",
            itemsCount: "number",
            enableMultiSelect: "boolean",
            enablePersistence: "boolean",
            readOnly: "boolean",
            enabled: "boolean",
            allowVirtualScrolling: "boolean",
            locale: "string",
        },
        observables: ["selectedItemIndex"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        _init: function () {
            ej.setRenderMode(this);
            this._getLocalizedLabels();
            this._initialization();
            this._renderControl();
            !this.model.readOnly && this._wireEvents();
            this.model.watermarkText = !ej.isNullOrUndefined(this.model.watermarkText) ? this.model.watermarkText : this._localizedLabels["watermarkText"];
        },
        _renderControl: function () {
            this._renderList();
        },
        _wireEvents: function (remove) {
			if(!remove){
            this._touchStart = $.proxy(this._touchStartHandler, this);
            this._docTouchStart = $.proxy(this._docTouchStartHandler, this);
            this._docTouchEnd = $.proxy(this._docTouchEndHandler, this);
			}
            var doc = $(document);
            ej.listenEvents([this._eleWarpper, this._dropDownIcon, doc, doc], ["focus", ej.startEvent(), ej.startEvent(), ej.endEvent()], [this._touchStart, this._touchStart, this._docTouchStart, this._docTouchEnd], remove);
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _initialization: function () {
            this._index = 0;
            var id = this.element.attr("id"),
                selectEle = this.element.is('select'),
                ulEle = selectEle && this._renderSelectOption(id);
            this._orgEle = this.element.clone();
            this._text = [];
            this._hiddenVal = [];
            this._targetEle = this.model.targetId ? $("#" + this.model.targetId) : (selectEle ? ulEle : ej.buildTag("ul"));
            this._eleWarpper = ej.buildTag("div#" + id + "_wrapper.e-m-dropdown-wrapper " + this.model.cssClass + " " + " e-m-" + this.model.renderMode + " e-m-user-select");
            this._hiddenElement = ej.buildTag("input#" + this._id + "_hidden", {}, { "display": "none" }, { "name": this._id });
            this.element.addClass("e-m-user-select " + "e-m-" + this.model.renderMode).attr({ "name": id, "readonly": true }).wrap(this._eleWarpper);
            this._eleWarpper = this.element.parent();
            this._dropDownIcon = ej.buildTag("div.e-m-icon-down").appendTo(this._eleWarpper.append(this._hiddenElement));
            this._setWatermarkText(this.model.watermarkText = !ej.isNullOrUndefined(this.model.watermarkText) ? this.model.watermarkText : this._localizedLabels["watermarkText"]);
            this._controlState(this.model.enabled);
        },
        _renderList: function () {
            if (ej.isNullOrUndefined(this._targetWrapper))
                this._targetWrapper = ej.buildTag("div.e-m-target-wrapper");
            this._targetWrapper.append(this._targetEle.ejmListView({
                renderMode: this.model.renderMode, dataSource: this.model.dataSource,
                query: this.model.query, enableChecklist: this.model.enableMultiSelect, itemsCount: this.model.itemsCount,
                fields: {
                    text: this.model.fields.text, value: this.model.fields.value, groupBy: this.model.fields.groupBy,
                    image: this.model.fields.image, checkBy: this.model.fields.checkBy
                }, templateId: this.model.templateId, touchEnd: $.proxy(this._listItemClickHandler, this),
                actionSuccess: $.proxy(this._onComplete, this), actionFailure: this.model.actionFailure, actionComplete: this.model.actionComplete
            })).appendTo(this._eleWarpper);
            !(this.model.dataSource instanceof ej.DataManager) && this._renderScroll();
            this.hidePopup();
            this._setSelectedItemIndex(this.selectedItemIndex(), true);
        },
        _renderScroll: function (evt) {
            var scrollEnd = this.model.allowVirtualScrolling ? $.proxy(this._virtualScroll, this) : null,
                lHeight = this._targetWrapper.height(), wHeight = window.innerHeight, popupHeight = parseInt(this.model.popupHeight),
                tarHeight = lHeight > popupHeight ? popupHeight : lHeight, tarOffSet = this.element.offset().top + this.element.height();
            popupHeight < lHeight && this._targetWrapper.ejmScrollPanel({
                renderMode: this.model.renderMode, targetHeight: popupHeight, scrollEnd: scrollEnd
            });
            (tarOffSet + tarHeight) > wHeight && this._targetWrapper.css('top', -tarHeight);
            this.model.popupWidth != "auto" && this._targetWrapper.css('width', this.model.popupWidth);
        },
        _onComplete: function (evt) {
            this._renderScroll(evt);
            this.model.actionSuccess && this._trigger("actionSuccess");
        },
        _touchStartHandler: function (evt) {
            if (!this.model.readOnly) {
                if (this._targetWrapper.css("display") == "none") {
                    this.element.addClass("e-m-focus");
                    this.model.focusIn && this._trigger("focusIn");
                    this.showPopup();
                }
                else {
                    this.element.removeClass("e-m-focus");
                    this.model.focusOut && this._trigger("focusOut");
                    this.hidePopup();
                }
                this.element.blur();
            }
        },
        _virtualScroll: function (evt) {
            if (evt.position == "bottom") {
                var listIns = this._targetEle.data('ejmListView'),
                    scollIns = this._targetWrapper.data('ejmScrollPanel');
                listIns.append(this.model.dataSource);
                scollIns.refresh();
            }
        },
        _docTouchStartHandler: function (evt) {
            if (!this._isTargetDropDown(evt.target))
                this._hide = true;
        },
        _docTouchEndHandler: function (evt) {
            if (!this._isTargetDropDown(evt.target) && this._hide) {
                this.element.removeClass("e-m-focus");
                this.model.focusOut && this._trigger("focusOut");
                this.hidePopup();
                this._hide = false;
            }
        },
        _isTargetDropDown: function (target) {
            return $(target).closest(this._eleWarpper).hasClass("e-m-dropdown-wrapper");
        },
        _listItemClickHandler: function (evt) {
            var text = this.model.templateId != "" ? evt.data[this.model.fields.text] : evt.text;
            this._updateSelectedItem(evt.item, text, evt.item.attr("data-value"), evt.isChecked);
            this.element.blur();
			evt.event.preventDefault(); // Prevents further propagation of the event which trigger click for elements underneath the dropdownlist's popup 
        },
        _renderSelectOption: function (id) {
            var inputEle = ej.buildTag("input#" + id + ".e-m-dropdownlist", null, null, { 'data-role': 'ejmdropdownlist' }),
                ulEle = ej.buildTag("ul");
            $(this.element.children()).each(function (i, e) {
                var liEle = ej.buildTag("li", null, null, { 'data-ej-text': e.text });
                ulEle.append(liEle);
            });
            this.element.hide();
            this.element.before(inputEle.after(ulEle));
            this.element = inputEle;
            return ulEle;
        },
        _setWatermarkText: function (text) {
            text ? this.element.attr("placeholder", text) : this.element.removeAttr("placeholder");
        },
        _controlState: function (enabled) {
            this._eleWarpper[!enabled ? "addClass" : "removeClass"]("e-m-state-disabled");
        },
        _setSelectedItemIndex: function (index, option) {
            var listObj = this._targetEle.data("ejmListView");
            if (this.selectedItemIndex() >= 0) {
                var text = listObj.getTextByIndex(this.selectedItemIndex()),
                    item = listObj.getItemByIndex(this.selectedItemIndex());
                if (option)
                    this.model.enableMultiSelect ? listObj.checkItemsByIndex(this.selectedItemIndex()) : listObj.selectItemByIndex(this.selectedItemIndex());
                else
                    this.model.enableMultiSelect ? listObj.uncheckItemsByIndex(this.selectedItemIndex()) : listObj.deselectItem();
                this._updateSelectedItem(item, text, item.attr("data-value"), option ? true : false);
            }
            else if (this.model.fields.checkBy) {
                index = this._targetWrapper.find(".e-m-lv-checked").length;
                for (i = 0; i < index; i++) {
                    text = $(this._targetWrapper.find(".e-m-lv-checked")[i]).find(".e-m-lv-content").text();
                    this._updateSelectedItem([], text, null, option ? true : false);
                }
            }
        },
        _updateSelectedItem: function (item, text, keyVal, isChecked) {
            var val = keyVal ? keyVal : text;
            if (this.model.enableMultiSelect) {
                if (!isChecked) {
                    this._text = jQuery.grep(this._text, function (value) { return value != text; });
                    this._hiddenVal = jQuery.grep(this._hiddenVal, function (value) { return value != val; });
                }
                else if ($.inArray(text, this._text) == -1) {
                    this._text.push(text);
                    this._hiddenVal.push(val);
                }
                this.model.select && this._trigger("select", this._getArgs(item, text, keyVal, isChecked));
                this.element.val(this._setDelimiterChar(this._text));
                this._hiddenElement.attr("value", this._hiddenVal.toString());
                this.model.change && this._trigger("change", this._getArgs(item, text, keyVal, isChecked));
            }
            else {
                this._hiddenVal = [];
                this._hiddenVal.push(val);
                this.model.select && this._trigger("select", this._getArgs(item, text, keyVal, isChecked));
                if (this.element.val() != text) {
                    this.selectedItemIndex(this._targetEle.data("ejmListView").getIndexByText(text));
                    this.element.val(text);
                    this._hiddenElement.attr("value", val);
                    this.model.change && this._trigger("change", this._getArgs(item, text, keyVal, isChecked));
                }
                this.hidePopup();
            }
        },
        _getArgs: function (item, text, keyVal, isChecked) {
            return data = { selectedItem: item, selectedText: text, selectedValue: keyVal, isChecked: isChecked };
        },
        _setDelimiterChar: function (textObj) {
            var text = textObj.toString();
            return text.replace(/,/g, this.model.delimiterChar + " ");
        },
        showPopup: function () {
            this._targetWrapper.show();
        },
        hidePopup: function () {
            this._targetWrapper.hide();
        },
        getValue: function () {
            return this.element.val();
        },
        selectItemByIndex: function (index) {
            this.model.selectedItemIndex = index;
            this._setSelectedItemIndex(this.selectedItemIndex(), true);
        },
        selectItemByIndices: function (indices) {
            if (this.model.enableMultiSelect) {
                var proxy = this;
                $(indices).each(function (i, e) {
                    proxy.model.selectedItemIndex = e;
                    proxy._setSelectedItemIndex(proxy.selectedItemIndex(), true);
                });
            }
        },
        unselectItemByIndex: function (index) {
            this.model.selectedItemIndex = index;
            this._setSelectedItemIndex(this.selectedItemIndex(), false);
        },
        unselectItemByIndices: function (indices) {
            if (this.model.enableMultiSelect) {
                var proxy = this;
                $(indices).each(function (i, e) {
                    proxy.model.selectedItemIndex = e;
                    proxy._setSelectedItemIndex(proxy.selectedItemIndex(), false);
                });
            }
        },
        getSelectedItemValue: function () {
            return (this.model.enableMultiSelect || ej.isNullOrUndefined(this._hiddenVal[0])) ? this._hiddenVal : this._hiddenVal[0];
        },
        _setModel: function (options) {
            var refresh;
            for (var option in options) {
                switch (option) {
                    case "renderMode": {
                        this._targetWrapper.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
                        this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
                        this._targetEle.ejmListView({ renderMode: this.model.renderMode });
                        this._targetWrapper.ejmScrollPanel({ renderMode: this.model.renderMode });
                        break;
                    }
                    case "delimiterChar": this.model.enableMultiSelect && this._setDelimiterChar(this._text); break;
                    case "enabled": this._controlState(this.model.enabled); break;
                    case "watermarkText": this._setWatermarkText(this.model.watermarkText); break;
                    case "selectedItemIndex": this._setSelectedItemIndex(this.selectedItemIndex(), true); break;
                    case "locale": this._setLocale(); break;
                    default: refresh = true; break;
                }
            }
            refresh && this._refresh();
            refresh = false;
        },
        _setLocale: function () {
            this._getLocalizedLabels();
            this.model.watermarkText = this._localizedLabels["watermarkText"];
            this._setWatermarkText(this.model.watermarkText);
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass(this._rootCSS);            
			this._initialization();
            this._renderControl();
            this._wireEvents();
        },
        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this.element.empty().html(this._orgEle.html());
			this._targetEle.remove();
            this.element.unwrap();
            this._eleWarpper.remove();
            this._hiddenElement.remove();
            this._dropDownIcon.remove();
            this._targetWrapper.remove();
			this._targetWrapper = null;
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
    });
    ej.mobile.DropDownList.Locale = ej.mobile.DropDownList.Locale || {};
    ej.mobile.DropDownList.Locale["default"] = ej.mobile.DropDownList.Locale["en-US"] = {
        watermarkText: null
    };
})(jQuery, Syncfusion);


