/**
* @fileOverview Plugin to style the Html Accordion elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejmAccordion", "ej.mobile.Accordion", {
        _setFirst: true,
        _requiresID: true,
        _rootCSS: "e-m-acc",
        validTags: ["ul"],
        _tags: [{
            tag: "items",
            attr: ["text", "href", "enableAjax"],
            content: "template"
        }],

        defaults: {
            renderMode: "auto",
            cssClass: "",
            selectedItems: [0],
            disabledItems: [],
            enableMultipleOpen: false,
            expandAll: false,
            collapseAll: false,
            heightAdjustMode: "content",
            enableRippleEffect: ej.isAndroid() ? true : false,
            showHeaderIcon: true,
            headerIcon: {
                normal: "e-m-icon-down",
                active: "e-m-icon-up"
            },
            spinnerText: null,
            enablePersistence: false,
            enableAjax: false,
            enableCache: false,
            prefetchAjaxContent: false,
            showAjaxPopup: false,
            items: [],
            itemTouchStart: null,
            itemTouchEnd: null,
            select: null,
            expand: null,
            collapse: null,
            ajaxBeforeLoad: null,
            ajaxSuccess: null,
            ajaxError: null,
            ajaxComplete: null,
            ajaxSettings: {
                type: 'GET',
                cache: false,
                async: true,
                dataType: "html",
                contentType: "html",
                url: "",
                data: {}
            },
            locale: "en-US"
        },

        dataTypes: {
            renderMode: "enum",
            cssClass: "string",
            selectedItems: "array",
            disabledItems: "array",
            enableMultipleOpen: "boolean",
            expandAll: "boolean",
            enableRippleEffect: "boolean",
            collapseAll: "boolean",
            heightAdjustMode: "enum",
            showHeaderIcon: "boolean",
            headerIcon: {
                normal: "string",
                active: "string"
            },
            spinnerText: "string",
            enablePersistence: "boolean",
            enableAjax: "boolean",
            enableCache: "boolean",
            prefetchAjaxContent: "boolean",
            showAjaxPopup: "boolean",
            locale: "string"
        },
        observableArray: ["selectedItems"],
        selectedItems: ej.util.valueFunction("selectedItems"),

        _init: function () {
            this._getLocalizedLabels();
            this.model.spinnerText = !ej.isNullOrUndefined(this.model.spinnerText) ? this.model.spinnerText : this._localizedLabels["spinnerText"];
            this._renderControl();
            this._wireEvents(false);
        },

        _renderControl: function () {
            this._orgEle = $(this.element).clone();
            ej.setRenderMode(this);
            this.element.addClass("e-m-user-select e-m-clearall e-m-" + this.model.renderMode + " " + this.model.cssClass);
            this.elementId = this.element[0].id;
            this._headerIcon = jQuery.extend({}, this.model.headerIcon);
            this.model.prefetchAjaxContent = (this.model.expandAll && this.model.enableAjax) ? true : this.model.prefetchAjaxContent;
            this.model.enableMultipleOpen = this.model.expandAll ? true : this.model.enableMultipleOpen;
            if (typeof this.model.items === "string") { this.model.items = eval(this.model.items) };
            this._storedContent = [], this._accItems = [], this._items = [], this._isAngular = this.model.items.length > 0 ? true : false;
            if (!this._isAngular) {
                this._accItems = this.element.find("li");
                for (var i = 0, itemLength = this._accItems.length; i < itemLength; i++)
                    this._items.push(this._insertItem($(this._accItems[i])));
            }
            else this._items = this.model.items;
            for (var li = 0, itemLength = this._items.length; li < itemLength; li++) {
                if (this._isAngular)
                    this._accItems.push(ej.buildTag('li').appendTo(this.element)[0]);
                var content = ej.buildTag("li#" + this.elementId + "-acc-item" + li + "-content-wrapper.e-m-acc-content-wrapper e-m-acc-state-hide");
                $(this._accItems[li]).after(content);
                this._renderItems(this._accItems[li], content, li);
                $(this._accItems[li]).text(this._items[li].text ? this._items[li].text : $(this._accItems[li]).attr("data-ej-text")).addClass((li == 0 ? "e-m-acc-item-first " : li == itemLength - 1 ? "e-m-acc-item-last " : "") + (this.model.showHeaderIcon ? this.model.headerIcon.normal : ""));
            }
            this._setEnableRippleEffect();
            this._postRendering();
        },

        _setEnableRippleEffect: function () {
            $(this._accItems)[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
        },
        _insertItem: function (item) {
            var itemVal = {};
            itemVal.text = (ej.getAttrVal(item, 'data-ej-text') == undefined) ? $(item).html() : ej.getAttrVal(item, 'data-ej-text');
            itemVal.href = ej.getAttrVal(item, 'data-ej-href', undefined);
            itemVal.enableAjax = ej.getBooleanVal(item, 'data-ej-enableAjax', undefined);
            itemVal.template = $(item).html();
            return itemVal;
        },
        _postRendering: function () {
            this._setHeightAdjustMode();
            this.model.expandAll ? this._setExpandAll(true) : this.model.collapseAll ? this._setCollapseAll(true) : this._loadItem(this.selectedItems());
            if (this.model.disabledItems.length)
                this._enableDisable(this.model.disabledItems, true);
        },
        _ajaxSuccessHandler: function (args) {
            if ($(args.item).text() == this.model.spinnerText) {
                $(args.item).text(this._items[args.index].text).next(".e-m-acc-content-wrapper").slideDown(300, "linear");
                if (this.model.expand && !this.model.enableMultipleOpen) {
                    var proxy = this;
                    var data = { item: args.item, index: args.index };
                    setTimeout(function () {
                        proxy._trigger('expand', data);
                    }, 300);
                }
            }
        },
        _loadItem: function (items, itemClick) {
            var proxy = this;
            if (this.model.enableMultipleOpen) {
                for (var i = 0, itemLength = items.length; i < itemLength; i++) {
                    var data = { item: targetItem, index: items[i] };
                    var targetItem = $(this._accItems[items[i]]), targetWrapper = this.element.find("#" + this._accItems[items[i]].id + "-content-wrapper"), contentExists = targetWrapper.find(".e-m-acc-content").length > 0;
                    !(targetItem.hasClass("e-m-state-active")) ? targetItem.addClass("e-m-state-active " + (this.model.showHeaderIcon ? this.model.headerIcon.active : "")).removeClass(this.model.headerIcon.normal) : itemClick ? targetItem.removeClass("e-m-state-active " + this.model.headerIcon.active).addClass(this.model.headerIcon.normal) : "";
                    targetItem.hasClass("e-m-state-active") ? itemClick ? this.selectedItems().push(parseInt(items[i])) : "" : this.selectedItems().splice(items[i], 1);
                    if ((!(ej.isNullOrUndefined(this._items[items[i]].enableAjax)) ? this._items[items[i]].enableAjax : this.model.enableAjax) && !this.model.prefetchAjaxContent && !contentExists) {
                        targetItem.text(this.model.spinnerText);
                        this._loadAjaxContent(targetItem, targetWrapper, items[i]);
                    }
                    if (targetWrapper.hasClass("e-m-acc-state-hide")) {
                        if (!this.model.enableAjax || (this.model.prefetchAjaxContent || contentExists))
                            $(targetWrapper).slideDown(300, "linear");
                        if (this.model.expand) {
                            setTimeout(function () {
                                proxy._trigger('expand', data);
                            }, 300);
                        }
                        targetWrapper.removeClass("e-m-acc-state-hide");
                    }
                    else if (itemClick) {
                        targetWrapper.slideUp(300, "linear").addClass("e-m-acc-state-hide");
                        if (this.model.collapse) {
                            setTimeout(function () {
                                proxy._trigger('collapse', data);
                            }, 300);
                        }
                    }
                }
                if (!this.model.enableCache && !this.model.prefetchAjaxContent)
                    this.element.find(".e-m-acc-content-wrapper.e-m-acc-state-hide > .e-m-acc-ajax-content").remove();
            }
            else {
                this.selectedItems(items);
                if (itemClick && !this.model.collapseAll)
                    var collapseData = { item: this.element.find(".e-m-acc-item.e-m-state-active"), index: this.element.find(".e-m-acc-item.e-m-state-active")[0].id.split("item")[1] };
                this.element.find(".e-m-acc-item.e-m-state-active").removeClass(this.model.headerIcon.active).addClass((this.model.showHeaderIcon ? this.model.headerIcon.normal : ""));
                var targetWrapper = this.element.find("#" + this._accItems[items[0]].id + "-content-wrapper"), contentExists = targetWrapper.find(".e-m-acc-content").length > 0;
                if ((!(ej.isNullOrUndefined(this._items[items[0]].enableAjax)) ? this._items[items[0]].enableAjax : this.model.enableAjax) && !this.model.prefetchAjaxContent && !contentExists)
                    $(this._accItems[items[0]]).text(this.model.spinnerText);
                if (!this.model.enableAjax || (this.model.prefetchAjaxContent || contentExists)) {
                    $(targetWrapper).slideDown(300, "linear");
                    var data = { item: this._accItems[items[0]], index: items[0] };
                    if (this.model.expand) {
                        setTimeout(function () {
                            proxy._trigger('expand', data);
                        }, 300);
                    }
                }
                targetWrapper.removeClass("e-m-acc-state-hide");
                this._showHideItems(this._accItems[items[0]], targetWrapper, items[0]);
                if (this.model.collapse && itemClick) {
                    setTimeout(function () {
                        proxy._trigger('collapse', collapseData);
                    }, 300);
                }
            }
            this.element.find(".e-m-acc-item.e-m-state-active").removeClass(this.model.headerIcon.normal).addClass((this.model.showHeaderIcon ? this.model.headerIcon.active : ""));
            this.element.find(".e-m-acc-item:not(.e-m-state-active)").next(".e-m-acc-content-wrapper").slideUp(itemClick ? 300 : 0, "linear").addClass("e-m-acc-state-hide");
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _setLocale: function () {
            this._getLocalizedLabels();
            this.model.spinnerText = this._localizedLabels["spinnerText"];
        },
        _createDelegates: function () {
            this._itemTouchStartHndlr = $.proxy(this._itemTouchStart, this);
            this._itemTouchEndHndlr = $.proxy(this._itemTouchEnd, this);
            this._touchMoveHndlr = $.proxy(this._onTouchMove, this);
            this._resizeHndlr = $.proxy(this._resize, this);
        },
        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenEvents([this._accItems], [ej.startEvent()], [this._itemTouchStartHndlr], remove);
            ej.listenTouchEvent($(window), "onorientationchange" in window ? "orientationchange" : "resize", this._resizeHndlr, remove);
        },
        _itemTouchStart: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            this._clickX = point.clientX;
            this._isMouseMove = false;
            var data = { item: evt.target, index: evt.target.id.split("item")[1] };
            this._target = evt.target;
            ej.listenEvents([this._accItems, this._accItems], [ej.endEvent(), ej.moveEvent()], [this._itemTouchEndHndlr, this._touchMoveHndlr], false);
            if (this.model.itemTouchStart)
                this._trigger('itemTouchStart', data);
        },
        _onTouchMove: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            if (this._clickX != point.clientX) this._isMouseMove = true;
        },
        _itemTouchEnd: function (evt) {
            ej.listenEvents([this._accItems, this._accItems], [ej.moveEvent(), ej.endEvent()], [this._touchMoveHndlr, this._itemTouchEndHndlr], true);
            if (evt.target === this._target && !this._isMouseMove) {
                var data = { item: evt.target, index: evt.target.id.split("item")[1] };
                if (!(!this.model.enableMultipleOpen && $(evt.target).hasClass("e-m-state-active")) && !$(evt.target).hasClass("e-m-state-disabled"))
                    this._loadItem([parseInt(evt.target.id.split("item")[1])], true);
                this.element.find(".e-m-state-active").length == this._items.length ? this.model.expandAll = true : this.element.find(".e-m-state-active").length == 0 ? this.model.collapseAll = true : this.model.collapseAll = false, this.model.expandAll = false;
                if (this.model.itemTouchEnd)
                    this._trigger('itemTouchEnd', data);
            }
        },
        _resize: function () {
            this._setHeightAdjustMode();
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
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-acc");
            this._renderControl();
            this._wireEvents();
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },
        _setExpandAll: function (options) {
            if (options) {
                (this.model.enableAjax && !this.model.prefetchAjaxContent) ? this._refresh() : this._addRemoveClass(true);
                if (this.model.collapseAll) this.model.collapseAll = false;
            }
        },
        _setCollapseAll: function (options) {
            if (options) {
                this._addRemoveClass(false);
                if (this.model.expandAll) this.model.expandAll = false;
            }
        },
        _addRemoveClass: function (option, index) {
            $(index >= 0 ? this._accItems[index] : this._accItems)[(option ? "add" : "remove") + "Class"]("e-m-state-active " + this.model.headerIcon.active)[(option ? "remove" : "add") + "Class"](this.model.headerIcon.normal);
            this.element.find(index >= 0 ? "#" + this._accItems[index].id + "-content-wrapper" : ".e-m-acc-content-wrapper")["slide" + (option ? "Down" : "Up")](0);
            this.element.find(index >= 0 ? "#" + this._accItems[index].id + "-content-wrapper" : ".e-m-acc-content-wrapper")[(option ? "remove" : "add") + "Class"]("e-m-acc-state-hide");
        },
        _setSelectedItems: function (options) {
            if (options.length)
                this.model.enableMultipleOpen ? this._selectDeselect(this.selectedItems(), true) : !($(this._accItems[options[0]]).hasClass("e-m-state-active") || $(this._accItems[options[0]]).hasClass("e-m-state-disabled")) ? this._loadItem(options) : "";
        },
        _setSpinnerText: function () {  //empty method given to avoid control refresh
        },
        _selectDeselect: function (items, select) {
            for (var i = 0, itemLength = items.length; i < itemLength; i++) {
                if (this.element.find("#" + this._accItems[items[i]].id + "-content").length == 0)
                    this._loadAjaxContent(this._accItems[items[i]], this.element.find("#" + this._accItems[items[i]].id + "-content-wrapper"), items[i]);
                this._addRemoveClass(select, items[i]);
            }
        },
        _setDisabledItems: function () {
            this._enableDisable(this.model.disabledItems, true);
        },
        _enableDisable: function (items, disable) {
            addremove = disable ? "add" : "remove";
            for (var i = 0, itemLength = items.length; i < itemLength; i++) {
                $(this._accItems[items[i]])[addremove + "Class"]("e-m-state-disabled");
                this.element.find("#" + this._accItems[items[i]].id + "-content-wrapper")[[addremove + "Class"]]("e-m-state-disabled");
            }
        },
        _setHeightAdjustMode: function () {
            var maxHeight = this.model.heightAdjustMode == "fill" ? this._adjustFillHeight() : (this.model.heightAdjustMode == "fixed") ? this._adjustFixedHeight() : "auto";
            $(this.element.find(".e-m-acc-content-wrapper")).height(maxHeight);
        },
        _adjustFixedHeight: function () {
            if (!this.model.enableAjax) {
                return maxHeight = Math.max.apply(null, $(".e-m-acc-content-wrapper").map(function () {
                    return $(this).height();
                }).get());
            }
        },
        _adjustFillHeight: function () {
            return ej.getDimension(this.element.parent(), "height") - (ej.getDimension(this._accItems[0], "outerHeight") * this._accItems.length);
        },
        _setHeaderIcon: function () {
            this.element.find(".e-m-acc-item.e-m-state-active").removeClass(this._headerIcon.active).addClass(this.model.headerIcon.active);
            this.element.find(".e-m-acc-item:not(.e-m-state-active)").removeClass(this._headerIcon.normal).addClass(this.model.headerIcon.normal);
            this._headerIcon = jQuery.extend({}, this.model.headerIcon);
        },
        //Public Methods
        selectItems: function (items) {
            this.model.enableMultipleOpen ? this._selectDeselect(items, true) : this._loadItem(items);
        },
        deselectItems: function (items) {
            if (this.model.enableMultipleOpen) this._selectDeselect(items, false);
        },
        enableItems: function (items) {
            this._enableDisable(items, false);
        },
        disableItems: function (items) {
            this._enableDisable(items, true);
        },
        addItem: function (item, index) {
            this.model.items = this._items;
            (index >= 0) ? this.model.items.splice(index, 0, this._insertItem($(item))) : this.model.items.push(this._insertItem($(item)));
            this.element.empty();
            this._renderControl();
            this._wireEvents();
            this._items = this.model.items;
        },
        removeItem: function (index) {
            this.model.items = this._items;
            if (index >= 0) {
                this.model.items.splice(index, 1);
                this.element.empty();
                this._renderControl();
                this._wireEvents();
            }
            this._items = this.model.items;
        },
        getItemsCount: function () {
            return this._items.length;
        },
    });
    $.extend(true, ej.mobile.Accordion.prototype, ej.mobile.AjaxLoader);

        ej.mobile.Accordion.HeightAdjustMode = {
        Fixed: "fixed",
        Content: "content",
        Fill: "fill"
    };

    ej.mobile.Accordion.Locale = ej.mobile.Accordion.Locale || {};
    ej.mobile.Accordion.Locale["default"] = ej.mobile.Accordion.Locale["en-US"] = {
        spinnerText: "Loading..."
    };
})(jQuery, Syncfusion);;