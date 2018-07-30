/**
* @fileOverview Plugin to style the Html Tab elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmTab", "ej.mobile.Tab", {
        _setFirst: true,
        _rootCSS: "e-m-tab",
        validTags: ["ul"],
        _tags: [{
            tag: "items",
            attr: ["icon", "text", "href", "enableAjax", "imageClass", "badge.value", "badge.maxValue"],
            content: "template"
        }],
        defaults: { 
            renderMode: "auto",
            enableAjax: false,
            enableCache: false,
            showAjaxPopup: false,
            selectedItemIndex: 0,
            enablePersistence: false,
            badge: {
                maxValue: "100"
            },
            itemStyle: "bothblock",
            allowSwiping: true,
            position: "bottom",
            prefetchAjaxContent: false,
            cssClass: "",
            items: [],
            contentId: null,
            ajaxSettings: {
                type: 'GET',
                cache: false,
                async: true,
                dataType: "html",
                contentType: "html",
                url: "",
                data: {}
            },
            enableRippleEffect: ej.isAndroid() ? true : false,
            load: null,
            loadComplete: null,
            touchStart: null,
            touchEnd: null,
            ajaxBeforeLoad: null,
            ajaxSuccess: null,
            ajaxError: null,
            ajaxComplete: null,
            select: null

        },
        observables: ["selectedItemIndex"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        dataTypes: {
            renderMode: "enum",
            enablePersistence: "boolean",
            items: "data",
            enableRippleEffect: "boolean"
        },
        _init: function () {
            this._orgEle = this.element.clone();
            this._storedContent = [];
            this._items = [];
            this._renderControl();
            this._wireEvents(false);
        },
        _renderControl: function () {
            ej.setRenderMode(this);
            this.element.addClass("e-m-user-select e-m-" + this.model.renderMode + " e-m-tab-" + this.model.position + " e-m-tab-content-" + this.model.itemStyle + " " + this.model.cssClass);
            this.elementId = this.element[0].id;
            this._tabContainer = $("#" + this.model.contentId).addClass("e-m-" + this.model.renderMode + " e-m-tab-" + this.model.position + " e-m-tab-content-wrapper");
            this.model.items = typeof this.model.items == "string" ? eval(this.model.items) : this.model.items;
            if (this.model.itemStyle == "bothblock")
                this._tabContainer.addClass("e-m-tab-content-bothblock");
            if (this.model.load)
                this._trigger("load");
            if (!this.model.items.length) {
                this._tabItems = this.element.find("li");
                for (var i = 0, itemLength = this._tabItems.length; i < itemLength; i++) {
                    this._items.push(this._insertItemValue($(this._tabItems[i])));
                    this._renderTabItems(this._tabItems[i], i);
                }
            }
            else {
                for (var i = 0, itemLength = this.model.items.length; i < itemLength; i++) {
                    var liItem = ej.buildTag('li', this.model.items[i].template);
                    this.element.append(liItem);
                    this._renderTabItems(liItem, i);
                }
                this._tabItems = this.element.find("li");
            }
            if (!this.model.prefetchAjaxContent && this.selectedItemIndex() >= 0)
                this._showHideItems(this._tabItems[this.selectedItemIndex()], this._tabContainer, this.selectedItemIndex());
            if (this.model.loadComplete)
                this._trigger("loadComplete");
                this._setEnableRippleEffect();
        },

        _setEnableRippleEffect: function () {
            this.element.find("li")[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
        },
        _insertItemValue: function (element) {
            var item = {};
            for (var j = 0, attrLength = this._tags[0].attr.length + 1; j < attrLength; j++) {
                var attr = this._tags[0].attr[j] == undefined ? "template" : this._tags[0].attr[j];
                item[attr] = (attr == "enableAjax") ? ej.getBooleanVal(element, 'data-ej-' + attr.replace(".", "-").toLowerCase(), undefined) : (attr == "template") ? element.html() : ej.getAttrVal(element, 'data-ej-' + attr.replace(".", "-").toLowerCase(), undefined);
            }
            return item;
        },
        _renderTabItems: function (element, index) {
            this._items = this.model.items.length > 0 ? this.model.items : this._items;
            var element = $(element);
            element.attr("id", this.elementId + "-tab-item" + index);
            if (!ej.isNullOrUndefined(this._items[index].icon))
                element.addClass("e-m-icon-" + this._items[index].icon.toLowerCase());
            if ((this._items[index]["badge.value"] || this.model.badge.value) > 0) {
                var val = this._items[index]["badge.value"] ? this._items[index]["badge.value"] : null,
                 maxVal = this._items[index]["badge.maxValue"] ? this._items[index]["badge.maxValue"] : this.model.badge.maxValue;
                element.addClass("e-m-tab-badge").attr("badgeValue", this._setBadgeValue(parseInt(val), parseInt(maxVal)));
            }
            this._renderItems(element, this._tabContainer, index);
            if (!ej.isNullOrUndefined(this._items[index].text))
                element.text(this._items[index].text)
        },
        _ajaxSuccessHandler: function () {
            if (this.model.prefetchAjaxContent)
                this._showHideItems(this._tabItems[this.selectedItemIndex()], this._tabContainer, this.selectedItemIndex());
        },
        _setBadgeValue: function (val, maxVal) {
            return (val <= maxVal ? val : maxVal + "+").toString();
        },
        _createDelegates: function () {
            this._touchStartDelegate = $.proxy(this._onTouchStartHandler, this);
            this._touchEndDelegate = $.proxy(this._onTouchEndHandler, this);
            this._touchMoveDelegate = $.proxy(this._onTouchMoveHandler, this);
            this._contentTouchStartDelegate = $.proxy(this._onContentTouchStartHandler, this);
            this._contentTouchMoveDelegate = $.proxy(this._onContentTouchMoveHandler, this);
            this._contentTouchEndDelegate = $.proxy(this._onContentTouchEndHandler, this);
        },
        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenEvents([this._tabItems], [ej.startEvent()], [this._touchStartDelegate], remove);
            if (this.model.allowSwiping)
                ej.listenEvents([this._tabContainer], [ej.startEvent()], [this._contentTouchStartDelegate], remove)
        },
        _eventArgs: function (currentTab) {
            return { item: $(currentTab), text: $(currentTab).text(), index: $(currentTab).index() };
        },
        _onTouchStartHandler: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            this._tabClickX = point.clientX;
            this._currentTab = evt.target;
            this._targetItemId = evt.target.id;
            this._tabItems = this.element.find(".e-m-tab-item");
            this._index = parseInt(this._targetItemId.split(this.elementId + "-tab-item")[1]);
            if (this.model.touchStart) this._trigger("touchStart", this._eventArgs(this._currentTab));
            this._tabMouseMove = false;
            ej.listenEvents([this._tabItems, this._tabItems], [ej.moveEvent(), ej.endEvent()], [this._touchMoveDelegate, this._touchEndDelegate], false);
        },

        _onTouchMoveHandler: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            if (this._tabClickX != point.clientX) this._tabMouseMove = true;
        },
        _onTouchEndHandler: function (evt) {
            this._isInteraction = true;
            ej.listenEvents([this._tabItems, this._tabItems], [ej.moveEvent(), ej.endEvent()], [this._touchMoveDelegate, this._touchEndDelegate], true);
            if (this._tabMouseMove) return;
            this.selectedItemIndex(this._index);
            this._showHideItems(this._currentTab, this._tabContainer, this._index);
            if (this.model.touchEnd)
                this._trigger("touchEnd", this._eventArgs(this._currentTab));
            this._isInteraction = false;
        },


        _onContentTouchStartHandler: function (evt) {
            var point = evt.touches ? evt.touches[0] : evt;
            this._pointX = point.pageX;
            this._pointY = point.pageY;
            ej.listenEvents([this._tabContainer], [ej.moveEvent()], [this._contentTouchMoveDelegate], false);
        },
        _onContentTouchMoveHandler: function (evt) {
            ej.listenEvents([this._tabContainer], [ej.moveEvent()], [this._contentTouchMoveDelegate], true);
            ej.listenEvents([this._tabContainer], [ej.endEvent()], [this._contentTouchEndDelegate], false);
        },
        _onContentTouchEndHandler: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            ej.listenEvents([this._tabContainer, this._tabContainer], [ej.moveEvent(), ej.endEvent()], [this._contentTouchMoveDelegate, this._contentTouchEndDelegate], true);
            this._endPointX = point.pageX;
            this._endPointY = point.pageY;
            relativeX = Math.abs(this._endPointX - this._pointX);
            relativeY = Math.abs(this._endPointY - this._pointY);
            relativeXY = Math.abs(relativeX - relativeY);
            if (relativeX > 30 && relativeXY > 30 && relativeX > relativeY) {
                direction = (this._endPointX - this._pointX) > 30 ? "swiperight" : "swipeleft";
                var index = direction == "swiperight" ? this.selectedItemIndex() - 1 : this.selectedItemIndex() + 1;
                if (index >= 0 && index < this._items.length) {
                    var element = this.element.find("#" + this.elementId + "-tab-item" + index);
                    this.selectedItemIndex(index);
                    this._showHideItems(element[0], this._tabContainer, index);
                }
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
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-tab");
            this._renderControl();
            this._wireEvents();
        },
        _clearElement: function () {
            this.element.removeAttr("class").find("*").removeAttr("class id");
            $.each(this._storedContent, function (index, element) {
                ej.getCurrentPage().append(element);
            });
            this._tabContainer.removeAttr("class").find("*").remove();
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        //api setmodel function
        _setContentId: function (value) {
            $.each(this._storedContent, function (index, element) {
                ej.getCurrentPage().append(element);
            });
            if (this.model.allowSwiping)
                ej.listenEvents([this._tabContainer], [ej.startEvent()], [this._contentTouchStartDelegate], true);
            this._tabContainer.removeAttr("class").find("*").remove();
            this._tabContainer = $("#" + value).addClass("e-m-" + this.model.renderMode + " e-m-tab-" + this.model.position + " e-m-tab-content-wrapper");
            for (var i = 0, itemLength = this._tabItems.length; i < itemLength; i++) {
                this._renderItems(this._tabItems[i], this._tabContainer, i);
            }
            if (!this.model.prefetchAjaxContent && this.selectedItemIndex() >= 0)
                this._showHideItems(this._tabItems[this.selectedItemIndex()], this._tabContainer, this.selectedItemIndex());
            if (this.model.allowSwiping)
                ej.listenEvents([this._tabContainer], [ej.startEvent()], [this._contentTouchStartDelegate], false);
        },
        _addRemovClass: function (classes, value) {
            this.element.removeClass(classes).addClass("e-m-" + value);
            this._tabContainer.removeClass(classes).addClass("e-m-" + value);
        }, 
        _setRenderMode: function (value) {
            this._addRemovClass("e-m-ios7 e-m-android e-m-windows e-m-flat", value);
        },
        _setPosition: function (value) {
            this._addRemovClass("e-m-tab-top e-m-tab-bottom", value);
        },
        _setItemStyle: function (value) {
            this.element.removeClass("e-m-tab-content-bothblock e-m-tab-content-bothinline e-m-tab-content-image e-m-tab-content-text").addClass("e-m-" + value);
        },
        _setSelectedItemIndex: function (value) {
            if (this.selectedItemIndex() >= 0 && this.selectedItemIndex() != "")
                this._showHideItems(this._tabItems[parseInt(this.selectedItemIndex())], this._tabContainer, parseInt(this.selectedItemIndex()));
        },
        _setCssClass: function (value) {
            this.element.addClass(value)
        },
        //public method
        showBadge: function (index) {
            var element = this.element.find("#" + this.elementId + "-tab-item" + index);
            if (index >= 0) {
                element.addClass("e-m-tab-badge");
            }
        },
        hideBadge: function (index) {
            var element = this.element.find("#" + this.elementId + "-tab-item" + index);
            if (index >= 0) {
                element.removeClass("e-m-tab-badge");
            }
        },
        setBadgeValue: function (index, val) {
            var element = this.element.find("#" + this.elementId + "-tab-item" + index);
            if (index >= 0 && val != undefined) {
                var maxVal = this._items[index]["badge.maxValue"] ? this._items[index]["badge.maxValue"] : this.model.badge.maxValue;
                element.addClass("e-m-tab-badge").attr("badgeValue", this._setBadgeValue(parseInt(val), parseInt(maxVal)));
                this._items[index]["badge.value"] = val;
            }
        },
        setActiveItem: function (index) {
            if (index >= 0) {
                this.selectedItemIndex(index);
                this._showHideItems(this._tabItems[index], this._tabContainer, index)
            }
        },
        enableItem: function (index) {
            if (index >= 0) {
                var element = this.element.find("#" + this.elementId + "-tab-item" + index);
                element.removeClass('e-m-state-disabled');
                this.enableContent(index);
            }
        },
        disableItem: function (index) {
            if (index >= 0) {
                var element = this.element.find("#" + this.elementId + "-tab-item" + index);
                element.addClass('e-m-state-disabled');
                this.disableContent(index);
            }
        },
        enableContent: function (index) {
            var ele = $(this._tabContainer.find("#" + this.elementId + "-tab-item" + index + "-content"));
            if (index >= 0)
                ele.removeClass('e-m-state-disabled');
            else
                this._tabContainer.removeClass('e-m-state-disabled');
        },
        disableContent: function (index) {
            var ele = $(this._tabContainer.find("#" + this.elementId + "-tab-item" + index + "-content"));
            if (index >= 0)
                ele.addClass('e-m-state-disabled');
            else
                this._tabContainer.addClass('e-m-state-disabled');
        },
        addItem: function (tab, index) {
            if (index >= 0) {
                this._items.splice(index, 0, this._insertItemValue($(tab)));
                this.element.find("#" + this.elementId + "-tab-item" + index).before($(tab).addClass('e-m-tab-item'));
            }
            else {
                this._items.push(this._insertItemValue($(tab).addClass('e-m-tab-item')));
                this.element.find("#" + this.elementId + "-tab-item" + this._items.length).after($(tab))
            }
            $.each(this._storedContent, function (index, element) {
                ej.getCurrentPage().append(element);
            });
            this._storedContent = [];
            this._tabContainer.find("*").remove();
            for (var i = 0, itemLength = this.element.find('.e-m-tab-item').length; i < itemLength; i++) {
                var li = $(this.element.find('.e-m-tab-item')[i]);
                this._renderTabItems(li, i);
            }
            if (!this.model.prefetchAjaxContent && this.selectedItemIndex() >= 0)
                this._showHideItems(this._tabItems[this.selectedItemIndex()], this._tabContainer, this.selectedItemIndex());
            this._tabItems = this.element.find("li");
            this._wireEvents(false);
        },
        removeItem: function (index) {
            if (index >= 0) {
                this.element.find("#" + this.elementId + "-tab-item" + index).remove();
                this._tabContainer.find("#" + this.elementId + "-tab-item" + index + "-content").remove();
                this._items.splice(index, 1);
                for (var i = 0, itemLength = this.element.find('.e-m-tab-item').length; i < itemLength; i++) {
                    $(this.element.find('.e-m-tab-item')[i]).attr("id", this.elementId + "-tab-item" + i);
                    $(this._tabContainer.find(".e-m-tab-content")[i]).attr("id", this.elementId + "-tab-item" + i + "-content");
                }
            }
        },
        getItemsCount: function () {
            return this.element.find('.e-m-tab-item').length;
        },
        getActiveItem: function () {
            return this.element.find('li.e-m-state-active');
        },
        getActiveItemText: function () {
            return this.element.find('li.e-m-state-active').text();
        },
        setContent: function (url, index) {
            if (index >= 0)
                this._items[index].href = url;
            this._refresh();
        }

    });
    ej.mobile.Tab.ItemStyle = {
        BothBlock: "bothblock",
        Image: "image",
        Text: "text",
        BothInline: "bothinline"
    };
    ej.mobile.Tab.Position = {
        Top: "top",
        Bottom: "bottom"
    };
    $.extend(true, ej.mobile.Tab.prototype, ej.mobile.AjaxLoader);
})(jQuery, Syncfusion);