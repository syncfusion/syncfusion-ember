/**
* @fileOverview Plugin to style the Html ListView elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmListView", "ej.mobile.ListView", {
        _setFirst: true,
        _rootCSS: "e-m-lv",
        validTags: ["ul"],
        _tags: [{
            tag: "items",
            attr: ["text", "value", "href", "imageUrl", "enabled", "badge.value", "badge.maxValue", "allowSelection"],
            content: "template"
        }],
        defaults: {
            renderMode: "auto",
            cssClass: "",
            dataSource: [],
            templateId: "",
            enabled: true,
            enableChecklist: false,
            persistSelection: false,
            enablePersistence: false,
            enableRippleEffect: ej.isAndroid() ? true : false,
            allowSelection: true,
            selectedIndex: null,
            checkedIndices: [],
            query: null,
            deleteMode: "none",
            fields: {
                text: null,
                value: null,
                image: null,
                groupBy: null,
                checkBy: null,
                enabled: null,
                href: null,
                allowSelection: null,
                badge: {
                    value: null,
                    maxValue: 100
                }
            },
            windows: {
                preventSkew: false
            },
            itemsCount: 0,
            items: [],
            touchStart: null,
            select: null,
            touchEnd: null,
            beforeDelete: null,
            afterDelete: null,
            actionSuccess: null,
            actionFailure: null,
            actionComplete: null
        },
        dataTypes: {
            renderMode: "enum",
            dataSource: "data",
            items: "data",
            enabled: "boolean",
            enableRippleEffect: "boolean",
            selectedIndex: ["string", "number"],
            checkedIndices: "array",
            enableChecklist: "boolean",
            persistSelection: "boolean",
            allowSelection: "boolean",
            windows: { preventSkew: "boolean" },
            templateId: "string",
            itemsCount: "number"
        },
        observables: ["selectedIndex"],
        selectedIndex: ej.util.valueFunction("selectedIndex"),
        _init: function () {
            ej.setRenderMode(this);
            this._dataObj = this.model.dataSource;
            this._index = 0;
            this._initialize();
        },
        _initialize: function () {
            this._listItems = [];
            this._orgEle = this.element.clone();
            if (typeof this.model.dataSource === "string") this.model.dataSource = eval(this.model.dataSource);
            Object.keys(this.model.dataSource).length ? this._dataProcess(this.model.dataSource, null) : this._render();
            this._browser = ej.browser().toLowerCase();
            this._doc = $(document);
            this._relDis = 0;
            this._move = false;
        },
        _dataProcess: function (data, action) {
            var proxy = this, query;
            query = action == "append" ? this.model.query ? this.model.query : "ej.Query()" + ".range(" + this._index + "," + (this._index + this.model.itemsCount) + ")"
                    : (this.model.query && this.model.itemsCount ? this.model.query + ".take(" + this.model.itemsCount + ")" :
                    (!this.model.query && this.model.itemsCount ? "ej.Query().take(" + this.model.itemsCount + ")" : (this.model.query ? this.model.query : "ej.Query()")));
            if (data instanceof ej.DataManager)
                data.executeQuery(eval(query)).done(function (e) {
                    action == "refresh" && proxy.element.children().remove();
                    proxy.model.dataSource = (action == "append") ? proxy.model.dataSource.concat(e.result) : e.result;
                    proxy._dataSource = e.result;
                    proxy._render();
                    proxy._trigger("actionSuccess", e);
                    if (proxy.model.itemsCount)
                        proxy._index += proxy.model.itemsCount;
                }).fail(function (e) {
                    proxy._trigger("actionFailure", e);
                }).always(function (e) {
                    proxy._trigger("actionComplete", e);
                });
            else {
                this._dataSource = ej.DataManager(data).executeLocal(eval(query));
                action == "refresh" && this.element.children().remove();
                this.model.dataSource = (action == "append") ? this.model.dataSource.concat(this._dataSource) : this._dataSource;
                this._render();
                if (this.model.itemsCount)
                    this._index += this.model.itemsCount;
            }
        },
        _render: function () {
            this._renderControl();
            this._setValues();
            this._wireEvents();
        },
        _setValues: function () {
            if (!this.model.enabled) this.disable();
            else {
                this.model.selectedIndex != null && this.selectItemByIndex(this.selectedIndex());
                this.model.checkedIndices.length && this.checkItemsByIndices(this.model.checkedIndices);
            }
        },
        _renderItems: function (proxy) {
            if (this.model.items.length < 1) {
                var elements = this.element.find("li");
                for (i = 0; i < elements.length; i++) {
                    this.model.items.push({
                        text: ej.getAttrVal(elements[i], 'data-ej-text', null),
                        value: ej.getAttrVal(elements[i], 'data-ej-value', null),
                        href: ej.getAttrVal(elements[i], 'data-ej-href', null),
                        imageUrl: ej.getAttrVal(elements[i], 'data-ej-imageurl', null),
                        enabled: ej.getAttrVal(elements[i], 'data-ej-enabled', true),
                        allowSelection: ej.getAttrVal(elements[i], 'data-ej-allowselection', true),
                        badge: {
                            value: ej.getAttrVal(elements[i], 'data-ej-badge-value', null),
                            maxValue: ej.getAttrVal(elements[i], 'data-ej-badge-maxvalue', null)
                        }
                    });
                }
            }
            else {
                for (i = 0; i < this.model.items.length; i++)
                    if (this.model.items[i].template)
                        this.element.append(ej.buildTag('li', this.model.items[i].template));
            }
        },
        _renderControl: function () {
            this.element.addClass('e-m-' + this.model.renderMode + ' e-m-lv' + ' e-m-user-select' + (!this.model.allowSelection ? ' e-m-lv-preventselection' : '') + " " + this.model.cssClass);
            if (this.model.templateId.length)
                this._renderTemplateList();
            else if (this._dataObj.length == 0) {
                this._renderItems();
                this._renderList();
            }
            else if (this.model.dataSource.length)
                this.model.fields.groupBy ? this._dataSourceGroupList() : this._dataSourceList(this._dataSource);
        },
        _wireEvents: function (remove) {
            this._touchStart = $.proxy(this._touchStartHandler, this);
            this._touchEnd = $.proxy(this._touchEndHandler, this);
            this._touchMove = $.proxy(this._touchMoveHandler, this);
            ej.listenEvents([this.element], [ej.startEvent()], [this._touchStart], remove);
        },
        _renderList: function () {
            this._listItems = this.element.find('li').addClass("e-m-lv-item");
            this._setEnableRippleEffect();
            this._listHeaders = this.element.find(">span").addClass("e-m-lv-group");
            for (var i = 0; i < this._listItems.length; i++) {
                var currentItem = $(this._listItems[i]).attr({ "index": i, "data-value": this.model.items[i].value, "data-allowselection": this.model.items[i].allowSelection }).addClass((this.model.items[i].enabled == "false") ? "e-m-state-disabled" : "");
                var ele = ej.buildTag("a.e-m-lv-content", this.model.items[i].text ? this.model.items[i].text : currentItem.html(), {}, { 'data-ej-appajax': false, "href": this.model.items[i].href });
                currentItem.empty().append(ele);
                this._slideDeleteButton(currentItem, ele);
                if (this.model.items[i].imageUrl) ele.css("background-image", "url(" + this.model.items[i].imageUrl + ")").addClass("e-m-lv-image");
                this._setBadge(currentItem);
            }
        },
        _setEnableRippleEffect: function () {
            this._listItems[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
        },
        _slideDeleteButton: function (currentItem, ele) {
            if (this.model.deleteMode == ej.mobile.ListView.DeleteMode.SlideButton) {
                var container = ej.buildTag("div.e-m-lv-slideitem"), deleteBtn = ej.buildTag("span.e-m-lv-delete", "Delete");
                currentItem.append(container.append(deleteBtn));
                ele.addClass("e-m-lv-swipeout");
                this._swipeDis = this.element.find(".e-m-lv-slideitem").width();
            }
        },
        _renderTemplateList: function () {
            var template = $("#" + this.model.templateId);
            template.html("<li class='e-m-lv-item'>" + template.html() + "</li>");
            this._dataSource.length && this.element.html(template.render(this._dataSource));
            ej.widget.init(this.element);
        },
        _dataSourceList: function (dataObj) {
            var proxy = this;
            $(dataObj).each(function (i, e) {
                var ele = ej.buildTag("a.e-m-lv-content", e[proxy.model.fields.text], {}, { 'data-ej-appajax': false, "href": e[proxy.model.fields.href] });
                var item = { badge: { value: !ej.isNullOrUndefined(e[proxy.model.fields.badge.value]) ? e[proxy.model.fields.badge.value] : null, maxValue: !ej.isNullOrUndefined(e[proxy.model.fields.badge.value]) ? e[proxy.model.fields.badge.maxValue] : null } };
                var li = ej.buildTag("li.e-m-lv-item" + (e[proxy.model.fields.checkBy] ? " e-m-lv-checked" : "") + (e[proxy.model.fields.enabled] ? " e-m-state-disabled" : ""), ele, {}, { "data-ej-badge-value": !ej.isNullOrUndefined(e[proxy.model.fields.badge.value]) ? e[proxy.model.fields.badge.value] : null, "data-ej-badge-maxvalue": !ej.isNullOrUndefined(e[proxy.model.fields.badge.maxValue]) ? e[proxy.model.fields.badge.maxValue] : null });
                if (!ej.isNullOrUndefined(e[proxy.model.fields.image]))
                    ele.css("background-image", "url(" + e[proxy.model.fields.image] + ")").addClass("e-m-lv-image");
                proxy.model.items.push(item);
                proxy._listItems.push(li);
                proxy._slideDeleteButton(li, ele);
                proxy.element.append(li.attr({ "index": i, "data-value": e[proxy.model.fields.value], "data-allowselection": e[proxy.model.fields.allowSelection] }));
                proxy._setBadge(li);
            });
        },
        _dataSourceGroupList: function () {
            var proxy = this, groupDataObj = ej.DataManager(proxy._dataSource).executeLocal(ej.Query().group(proxy.model.fields.groupBy));
            $(groupDataObj).each(function (i, e) {
                proxy.element.append(ej.buildTag("span.e-m-lv-group", e.key));
                proxy._dataSourceList(e.items);
            });
        },
        _touchStartHandler: function (evt) {
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._startX = evt.clientX;
            this._startY = evt.clientY;
            this._timeStart = evt.timeStamp || Date.now();
            var curTarget = $(evt.target);
            this._curentEle = curTarget.closest('li');
            this._removeSelect();
            if (!curTarget.hasClass("e-m-lv-delete")) {
                if (!this._curentEle.hasClass("swipeend")) {
                    if (this.model.allowSelection && this._curentEle.attr("data-allowselection") != "false")
                        this._curentEle.addClass("e-m-lv-active e-m-lv-selected");
                    if (this.model.renderMode == "windows" && !this.model.windows.preventSkew)
                        this._curentEle.addClass(ej.isMobile() ? ej._getSkewClass($(this._curentEle), evt.pageX, evt.pageY) : "e-m-skew-center");
                    this.element.find('a,span').css("-" + this._browser + "-transform", "");
                    this.element.find(".e-m-lv-slideitem,.e-m-lv-delete").removeClass("e-m-lv-swipe");
                    this.element.find("li").removeClass("swipeend");
                }
            }
            ej.listenEvents([this._doc, this.element], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], false);
            this.model.touchStart && this._trigger("touchStart", this._getItemObject(this._curentEle, evt));
        },
        _touchMoveHandler: function (evt) {
            this._isMoved = (evt.clientX != this._startX) ? true : false;
            if (this._isMoved)
                evt.preventDefault();
            var target = $(evt.target);
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            var relDis = evt.clientX - this._startX, relDisY = evt.clientY - this._startY;
            if (Math.abs(relDisY) >= 10) {
                this._move = true;
                this._removeActive();
                ej._removeSkewClass(this._curentEle);
            }
            this.model.deleteMode != ej.mobile.ListView.DeleteMode.Default && this._removeActive();
            if (target.closest(this.element).length != 0) {
                if (this.model.deleteMode == ej.mobile.ListView.DeleteMode.SlideButton && (relDis < 0 || this._curentEle.hasClass("swipeend"))) {
                    this._relDis = this._curentEle.hasClass("swipeend") ? -this._swipeDis + relDis : relDis;
                    if (this._relDis <= 0) {
                        this._curentEle.find('a,span').css("-" + this._browser + "-transform", "translate3d(" + this._relDis + "px,0px,0px) scale(1)").css("-" + this._browser + "-transition", "none");
                        this._curentEle.find(".e-m-lv-slideitem,.e-m-lv-delete").addClass("e-m-lv-swipe");
                    }
                }
                if (this.model.deleteMode == ej.mobile.ListView.DeleteMode.Swipe) {
                    this._relDis = relDis;
                    this._curentEle.find('a').css("-" + this._browser + "-transform", "translate3d(" + relDis + "px,0px,0px) scale(1)").css("-" + this._browser + "-transition", "none");
                }
            }
            else
                this._touchEndHandler(evt);
        },
        _touchEndHandler: function (evt) {
            var curTarget = $(evt.target), duration = (evt.timeStamp || Date.now()) - this._timeStart;
            !this.model.persistSelection && this._curentEle.removeClass("e-m-lv-active");
            if (this.model.deleteMode == ej.mobile.ListView.DeleteMode.Swipe) {
                this._curentEle.find('a').css("-" + this._browser + "-transform", "translate3d(0px,0px,0px) scale(1)").css("-" + this._browser + "-transition", "").addClass("e-m-lv-swipeout");
                if (this._curentEle.width() / 2 <= Math.abs(this._relDis) || (duration >= 120 && duration <= 200 && Math.abs(this._relDis) >= 10))
                    this._deleteItem(this._curentEle, evt);
            }
            if (this.model.deleteMode == ej.mobile.ListView.DeleteMode.SlideButton) {
                if (this._relDis != 0) {
                    var dis = (-this._swipeDis / 2 <= this._relDis) ? 0 : -this._swipeDis;
                    dis != 0 ? this._curentEle.addClass("swipeend") : this._curentEle.removeClass("swipeend");
                    this._curentEle.find('a,span').css("-" + this._browser + "-transform", "translate3d(" + dis + "px,0px,0px) scale(1)").css("-" + this._browser + "-transition", "").addClass("e-m-lv-swipeout");
                }
                else if (curTarget.hasClass("e-m-lv-delete"))
                    this._deleteItem(this._curentEle, evt);
                this._relDis = 0;
            }
            if (!this._move) {
                this.model.enableChecklist && this._curentEle.toggleClass("e-m-lv-checked");
                this.model.renderMode == "windows" && !this.model.windows.preventSkew && ej._removeSkewClass(this._curentEle);
                this._setModelValues();
                this.model.touchEnd && this._trigger("touchEnd", this._getItemObject(this._curentEle, evt));
                this.model.select && this._trigger("select", this._getItemObject(this._curentEle, evt));
            }
            ej.listenEvents([this._doc, this.element], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
            this._move = false;
        },
        _deleteItem: function (curentEle, evt) {
            var index = curentEle.index();
            this.model.beforeDelete && this._trigger("beforeDelete", this._getItemObject(curentEle, evt));
            this.model.dataSource.length && this.model.dataSource.splice(index, 1);
            curentEle.remove();
            this.model.afterDelete && this._trigger("afterDelete", this._getItemObject(curentEle, evt));
        },
        _removeSelect: function () {
            this.element.find(".e-m-lv-active,.e-m-lv-selected").removeClass("e-m-lv-active e-m-lv-selected");
        },
        _removeActive: function () {
            this.element.find(".e-m-lv-active").removeClass("e-m-lv-active");
        },
        _setModelValues: function () {
            var proxy = this;
            this.model.selectedIndex = parseInt(this.element.find(".e-m-lv-selected").attr("index"));
            this.model.checkedIndices = [];
            this.element.find(".e-m-lv-checked").each(function (e) {
                proxy.model.checkedIndices.push(parseInt($(this).attr('index')));
            });
        },
        _setBadge: function (li, value) {
            var currentBageValue = value || (this.model.items[li.attr('index')].badge ? this.model.items[li.attr('index')].badge.value : null);
            maxBadgeValue = this.model.items[li.attr('index')].badge ? this.model.items[li.attr('index')].badge.maxValue : this.model.fields.bage.maxValue;
            if (!ej.isNullOrUndefined(currentBageValue)) {
                var badgeValue = (parseInt(currentBageValue) > parseInt(maxBadgeValue)) ? maxBadgeValue + "+" : currentBageValue;
                li.find('.e-m-lv-content').attr('badgeValue', badgeValue).addClass('e-m-lv-badge');
            }
        },
        _getItemObject: function (item, evt) {
            var index = this.element.find('li').index(item);
            return {
                item: item,
                index: index,
                text: item.find('a').html(),
                badge: item.find('a').attr("badgeValue") || null,
                isSelected: item.hasClass("e-m-lv-selected"),
                isChecked: item.hasClass("e-m-lv-checked"),
                data: this.model.dataSource[index] || null,
                event: evt,
                isInteraction: evt ? true : false
            };
        },
        /* Public Methods */
        addItem: function (itemVal, index) {
            var proxy = this;
            if (!this.model.dataSource.length) {
                ItemObj = $.isArray(itemVal) ? itemVal : $.makeArray(itemVal);
                $(ItemObj).each(function (i, e) {
                    var ele = ej.buildTag("a.e-m-lv-content");
                    var li = ej.buildTag("li.e-m-lv-item");
                    index ? $(proxy.element.find("li")[index]).before(li.append(ele.html(e))) : $(proxy.element.find("li")[proxy.element.find("li").length - 1]).after(li.append(ele.html(e)));
                });
            }
            else {
                $(itemVal).each(function (i, e) {
                    proxy.model.dataSource.splice(index ? index : proxy.model.dataSource.length, 0, e);
                });
                this._refresh();
            }
        },
        refresh: function (data) {
            this._dataProcess(data, "refresh");
        },
        append: function (newData) {
            this._dataProcess(newData, "append");
        },
        enable: function () {
            this.element.removeClass("e-m-state-disabled");
            this.model.enabled = true;
        },
        disable: function () {
            this.element.addClass("e-m-state-disabled");
            this.model.enabled = false;
        },
        enableItemByIndex: function (index) {
            if (!this.model.enabled) return;
            $(this.element.find('li')[index]).removeClass("e-m-state-disabled");
        },
        disableItemByIndex: function (index) {
            if (!this.model.enabled) return;
            $(this.element.find('li')[index]).addClass("e-m-state-disabled");
        },
        enableItemsByIndices: function (indices) {
            if (!this.model.enabled) return;
            var proxy = this;
            $(indices).each(function (e, index) {
                proxy.enableItemByIndex(index);
            });
        },
        disableItemsByIndices: function (indices) {
            if (!this.model.enabled) return;
            var proxy = this;
            $(indices).each(function (e, index) {
                proxy.disableItemByIndex(index);
            });
        },
        enableAll: function () {
            if (!this.model.enabled) return;
            $(this.element.find('li').removeClass("e-m-state-disabled"));
        },
        disableAll: function () {
            if (!this.model.enabled) return;
            $(this.element.find('li').addClass("e-m-state-disabled"));
        },
        selectItemByIndex: function (index) {
            if (!this.model.enabled) return;
            if (index >= 0) {
                this._curentEle = $(this.element.find('li').removeClass("e-m-lv-selected e-m-lv-active")[this.model.selectedIndex = index]);
                this._curentEle.addClass("e-m-lv-selected " + ((this.model.persistSelection) ? "e-m-lv-active" : ""));
                this.model.select && this._trigger("select", this._getItemObject(this._curentEle));
            }
        },
        deselectItem: function () {
            if (!this.model.enabled) return;
            $(this.element.find('li').removeClass("e-m-lv-selected e-m-lv-active"));
            this.model.selectedIndex = null;
        },
        checkItemsByIndex: function (index) {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            $(this.element.find('li')[index]).addClass("e-m-lv-checked");
            this._setModelValues();
        },
        checkItemsByIndices: function (indices) {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            var proxy = this;
            $(indices).each(function (e, index) {
                $(proxy.element.find('li')[index]).addClass("e-m-lv-checked");
            });
            this._setModelValues();
        },
        uncheckItemsByIndex: function (index) {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            $(this.element.find('li')[index]).removeClass("e-m-lv-checked");
            this._setModelValues();
        },
        uncheckItemsByIndices: function (indices) {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            var proxy = this;
            $(indices).each(function (e, index) {
                $(proxy.element.find('li')[index]).removeClass("e-m-lv-checked");
            });
            this._setModelValues();
        },
        checkAll: function () {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            $(this.element.find('li').addClass("e-m-lv-checked"));
            this._setModelValues();
        },
        uncheckAll: function () {
            if (!this.model.enableChecklist || !this.model.enabled) return;
            $(this.element.find('li').removeClass("e-m-lv-checked"));
            this._setModelValues();
        },
        getItemByIndex: function (index) {
            if (!this.model.enabled) return;
            return $(this.element.find('li')[index]);
        },
        getItemByText: function (text) {
            if (!this.model.enabled) return;
            var index;
            $(this.element.find('li')).each(function (i, element) {
                if ($(element).find('a').html() == text) index = i;
            });
            return this.getItemByIndex(index);
        },
        getTextByIndex: function (index) {
            if (!this.model.enabled) return;
            return $(this.element.find('li')[index]).find('a').html();
        },
        getIndexByText: function (text) {
            if (!this.model.enabled) return;
            var index;
            $(this.element.find('li')).each(function (i, element) {
                if ($(element).find('a').html() == text) index = i;
            });
            return index;
        },
        deleteItemByIndex: function (index) {
            if (!this.model.enabled) return;
            var item = $(this.element.find('li')[index]).remove().find('a').html();
            if (this.model.dataSource.length)
                item = this.model.dataSource.splice(index, 1);
            return item;
        },
        deleteItemByText: function (text) {
            if (!this.model.enabled) return;
            return this.deleteItemByIndex(this.getIndexByText(text));
        },
        setBadge: function (index, value) {
            if (!this.model.enabled) return;
            this._setBadge(this.getItemByIndex(index), value);
        },
        /* Public Methods */
        _setModel: function (options) {
            var option, refresh = false;
            for (option in options) {
                if (!this.model.enabled && option != "enabled") return false;
                switch (option) {
                    case "renderMode":
                        this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
                    case "selectedIndex":
                        this.selectItemByIndex(options[option]); break;
                    case "checkedIndices":
                        this.checkItemsByIndices(options[option]); break;
                    case "enabled":
                        options[option] ? this.enable() : this.disable(); break;
                    case "enableRippleEffect":
                        this._setEnableRippleEffect(); break;
                    case "allowSelection":
                        this.element[(options[option] ? "addClass" : "removeClass")]("e-m-lv-preventselection");
                }
                if (options.dataSource || options.fields || options.query) {
                    if (!options.dataSource)
                        this.model.dataSource = this._dataObj;
                    this.deselectItem();
                    this.uncheckAll();
                    refresh = true;
                }
            }
            refresh && this._refresh();
            refresh = false;
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass(this._rootCSS);
            this._initialize();
        },
        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this.element.empty().html(this._orgEle.html());
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
    });

    ej.mobile.ListView.DeleteMode = {
        Default: "none",
        Swipe: "swipe",
        SlideButton: "slideButton"
    };
})(jQuery, Syncfusion);
