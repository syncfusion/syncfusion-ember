/**
* @fileOverview Plugin to style the Html Menu elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    //mMenu is the plugin name 
    //"m.Menu" is "namespace.className" will hold functions and properties

    ej.widget("ejmMenu", "ej.mobile.Menu", {
        _setFirst: true,
        _rootCSS: "e-m-menu",
        _tags: [{
            tag: "items",
            attr: ["text", "touchStart", "touchEnd", "href", "color"],
            content: "textTemplate"
        }],

        defaults: {
            renderMode: "auto",
            height: null,
            width: null,
            templateId: null,
            dataSource: [],
            fields: {
                text: "",
                href: null,
                color: ""
            },
            query: ej.Query(),
            allowScrolling: true,
            enablePersistence: false,
            text: "",
            color: "",
            target: null,
            showOn: "tap",
            //Cancel Button properties works only Actionsheet type
            cancelButton: {
                text: null,
                show: true,
                color: ""
            },
            //Title properties works only Actionsheet and PopOver types
            showTitle: true,
            title: null,
            //showArrow property works only PopOver type
            showArrow: true,
            type: "actionsheet",
            locale: "en-US",
            load: null,
            loadComplete: null,
            touchStart: null,
            touchEnd: null,
            hide: null,
            show: null,
            cssClass: "",
            enableRippleEffect: ej.isAndroid() ? true : false,
            items: [],
            href: null,
            actionSuccess: null,
            actionFailure: null,
            actionComplete: null
        },

        dataTypes: {
            dataSource: "data",
            query: "data",
            enableRippleEffect: "boolean",
            renderMode: "enum",
            locale: "string",
        },
        observableArray: ["dataSource"],
        dataSource: ej.util.valueFunction("dataSource"),

        _init: function () {
            ej.getCurrentPage().append(this.element);
            this._getLocalizedLabels();
            this.model.title = !ej.isNullOrUndefined(this.model.title) ? this.model.title : this._localizedLabels["title"];
            this.model.cancelButton.text = !ej.isNullOrUndefined(this.model.cancelButton.text) ? this.model.cancelButton.text : this._localizedLabels["cancelButtonText"];
            this._template = ej.getCurrentPage().find("#" + this.model.templateId);
            if (Object.keys(this.model.dataSource).length > 1)
                this._initDataSource();
            else
                this._render();
        },

        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        _load: function () {
            ej.setRenderMode(this);
            this._touchStart = this.model.touchStart;
            this._touchEnd = this.model.touchEnd;
            this._orgEle = this.element.clone();
            if (this._orgEle.find("ul").length || Object.keys(this.model.dataSource).length > 1)
                this.model.items = [];
            this.model.id = this.element[0].id;
            if (Object.keys(this.model.dataSource).length > 1)
                this._dataSourceList(this._dataSource);
            if (this.model.load)
                this._trigger("load");
        },

        _renderItems: function (proxy) {
            if (proxy.model.items.length < 1) {
                var elements = this.element.find("li");
                for (i = 0; i < elements.length; i++) {
                    var item = {};
                    var element = elements[i];
                    item.text = ej.getAttrVal(element, 'data-ej-text', "")
                    item.href = ej.getAttrVal(element, 'data-ej-href', null);
                    item.color = ej.getAttrVal(element, 'data-ej-color', "");
                    item.templateId = ej.getAttrVal(element, 'data-ej-templateid', undefined);
                    item.touchStart = ej.getAttrVal(element, 'data-ej-touchstart', undefined);
                    item.touchEnd = ej.getAttrVal(element, 'data-ej-touchend', undefined);
                    this.model.items.push(item);
                }
            }
            else {
                var ul = ej.buildTag('ul.e-m-menu-hdr e-m-clearall');
                var elements = this.model.items;
                for (i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    element.text = element.text ? element.text : "";
                    element.href = element.href ? element.href : null;
                    element.color = element.color ? element.color : "";
                    element.templateId = element.templateId ? element.templateId : undefined;
                    element.touchStart = element.touchStart ? element.touchStart : undefined;
                    element.touchEnd = element.touchEnd ? element.touchEnd : undefined;
                    var li = ej.buildTag('li', elements[i].textTemplate);
                    this.element.append(ul.append(li));
                }
            }
            this._setEnableRippleEffect();
        },

        _setEnableRippleEffect: function () {
            this.element.find("li")[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
                this.element.find("span.e-m-menu-btn")[(this.model.enableRippleEffect && this.model.cancelButton.show ? "addClass" : "removeClass")]("e-ripple");
        },

        _render: function () {
            this._renderControl();
            this._wireEvents();
        },

        _initDataSource: function () {
            ej.mobile.WaitingPopup.show();
            var proxy = this;
            if (this.dataSource() instanceof ej.DataManager)
                this.dataSource().executeQuery(proxy.model.query).done(function (e) {
                    proxy._dataSource = e.result;
                    proxy._render();
                    proxy._trigger("actionSuccess", e);
                    ej.mobile.WaitingPopup.hide();
                }).fail(function (e) {
                    proxy._trigger("actionFailure", e);
                }).always(function (e) {
                    proxy._trigger("actionComplete", e);
                });
            else {
                this._dataSource = ej.DataManager(this.dataSource()).executeLocal(this.model.query);
                this._render();
                ej.mobile.WaitingPopup.hide();
            }
        },

        _renderControl: function () {
            this._load();
            this.element.addClass("e-m-" + this.model.renderMode + " " + this.model.cssClass);
            var proxy = this;
            this._renderItems(proxy);
            this._menuUl = this.element.find("ul").addClass("e-m-menulist");
            if (this.model.templateId && (Object.keys(this.model.dataSource).length < 1)) {
                ej.getCurrentPage().find("#" + this.model.templateId).remove();
                this.element.append(ej.buildTag("div.e-m-menutemplate").append(this._template.html()));
                this._menuProperties();
            }
            else {
                this._menuLiItems = this.element.find("li").addClass("e-m-state-default e-m-user-select e-m-menuitem");
                this._menuLiItems.first().addClass("e-m-firstitem");
                this._menuLiItems.last().addClass("e-m-lastitem");
                this._menuProperties();
                this._menuLiItems.each(function (index, element) {
                    proxy._renderMenuItems(element, index);
                });
                this._liHeight = ej.getDimension(this._menuLiItems, "height");
            }
            ej.widget.init(this.element);
            this.hide();
            this._setHeightWidth();
            if (this.model.allowScrolling)
                this._renderScrollPanel();
            if (this.model.loadComplete)
                this._trigger("loadComplete");
        },

        _getTarget: function () {
            return ((typeof (this.model.target) == "string") ? (((ej.getCurrentPage().find("#" + this.model.target)).length > 0) ? (ej.getCurrentPage().find("#" + this.model.target)) : $("body").find("#" + this.model.target)) : this.model.target);
        },

        _setHeightWidth: function () {
            if (this.model.width)
                this.element.width(this.model.width);
            this._titleHeight = (Math.abs(this._titleDiv ? ej.getDimension(this._titleDiv, "outerHeight") : 0));
            this._menuHeight = (this._liHeight * 5) + (this._titleHeight) + this._menuArrowHeight;
            if (this.model.height)
                this._menuUl.height(this.model.height - (this._titleHeight + this.element.find(".e-m-menu-cancelbtn").outerHeight() + (this.model.type == "actionsheet" ? 10 : 0)));
            else if (this.model.allowScrolling) {
                if (this.model.type == "actionsheet") {
                    if (window.innerHeight < ((this._liHeight * 5) + (this._titleDiv ? this._titleDiv.outerHeight() : 0) + this.element.find(".e-m-menu-cancelbtn").outerHeight() + 25))
                        this._menuUl.css("max-height", window.innerHeight - ((this._titleDiv ? this._titleDiv.outerHeight() : 0) + this.element.find(".e-m-menu-cancelbtn").outerHeight() + 20));
                    else
                        this._menuUl.css("max-height", this._liHeight * 5);
                }
                else {
                    var top = this._getTarget().offset().top;
                    var hgt = top + this._getTarget().outerHeight();
                    this.element.css({ "top": "auto", "bottom": "auto" });
                    if (((this._menuHeight) + (this.element.offset().top + 10)) > window.innerHeight)
                        this._menuUl.css("max-height", (this._liHeight * 5) - ((this._menuHeight) - (window.innerHeight - (this.element.offset().top))));
                    else if (!this.model.height && this.model.allowScrolling && ej.isNullOrUndefined(this.model.templateId) && (window.innerHeight >= (this._menuHeight)))
                        this._menuUl.css("max-height", this._liHeight * 5);
                }
            }
        },

        _renderScrollPanel: function () {
            var scrollWrapper = ej.buildTag("div.e-m-menuscrollwrapper");
            if (ej.isNullOrUndefined(this.model.templateId))
                this._menuUl.wrap(scrollWrapper);
            else
                this.element.find(".e-m-menutemplate").wrap(scrollWrapper);
            this.element.find(".e-m-menuscrollwrapper").ejmScrollPanel({ isRelative: true });
        },

        _dataSourceList: function (dataObj) {
            if (ej.isNullOrUndefined(this.model.templateId)) {
                var proxy = this;
                this._datasrcUl = ej.buildTag("ul");
                this.element.append(this._datasrcUl);
                $(dataObj).each(function (i, e) {
                    var li = ej.buildTag("li", e[proxy.model.fields.text], { color: e[proxy.model.fields.color] }, {}).attr("data-ej-href", e[proxy.model.fields.href]).appendTo(proxy.element);
                    proxy._datasrcUl.append(li);
                });
            }
            else {
                var template = ej.getCurrentPage().find("#" + this.model.templateId);
                if (this._dataSource.length) {
                    this._temp = ej.buildTag("div.e-m-menutemplate");
                    this.element.append(this._temp);
                    this._temp.html(template.render(this._dataSource));
                }
            }
        },

        _menuProperties: function () {
            this.element.addClass("e-m-menu-" + this.model.type + (this.model.type == "actionsheet" ? " e-m-abs" : " e-m-fixed"));
            if (this.model.type == "popover")
                this.element.addClass("e-m-corner-all").prepend(this.model.showArrow ? ej.buildTag("div.e-m-icon-arrow e-m-top") : "").append(this.model.showArrow ? ej.buildTag("div.e-m-icon-arrow e-m-bottom") : "");
            if (this.model.showTitle && !(this.model.type == "popup")) {
                this._titleDiv = ej.buildTag("span.e-m-menu-title", this.model.title);
                this.model.type == "actionsheet" ? this.element.prepend(this._titleDiv) : (this.model.showArrow ? this._titleDiv.insertAfter(this.element.find('.e-m-icon-arrow.e-m-top')) : this.element.prepend(this._titleDiv));
            }
            this._menuArrowHeight = this.element.find(".e-m-icon-arrow").height();
            if (this.model.cancelButton.show && this.model.type == "actionsheet") 
                this.element.append(ej.buildTag("span.e-m-menu-btn").addClass("e-m-menu-cancelbtn").text(this.model.cancelButton.text).css("color", this.model.cancelButton.color));
            this._createOverlayDiv();
        },

        _renderMenuItems: function (element, index) {
            if (!$(element).hasClass("e-m-menu-title")) {
                var text = (ej.getAttrVal(element, 'data-ej-text') == ("" || undefined)) ? ((this.model.items[index].text == "") ? $(this._menuLiItems[index]).html() : this.model.items[index].text) : (ej.getAttrVal(element, 'data-ej-text'));
                ctrl = ej.buildTag("a.e-m-menu-btn#" + this.model.id + index, text, {}, { href: ej.getAttrVal(element, 'data-ej-href') || (this.model.items[index].href) }).css("color", ej.getAttrVal(element, 'data-ej-color') || this.model.items[index].color);
                $(element).empty().append(ctrl.css("color", element.style.color == "" ? this.model.items[index].color : element.style.color));
            }
        },

        //Popover and popup positioning
        _normalPosition: function (target) {
            if (target.length) {
                var width = this.element.width();
                this.element.find('.e-m-icon-arrow.e-m-top').removeClass("e-m-state-hide").addClass("e-m-state-block");
                this.element.find('.e-m-icon-arrow.e-m-bottom').removeClass("e-m-state-block").addClass("e-m-state-hide");
                var left = target.offset().left + target.outerWidth() / 2 - (width / 2);
                var win_width = window.innerWidth;
                this._windowHeight = window.innerHeight;
                this._targetHeight = this.element.outerHeight();
                if (left < 0)
                    left = 5;
                else if (win_width - left < width)
                    left = win_width - width;
                if (this.model.type == "popover")
                    this.element.css({ "left": left + "px" });
                else
                    this.element.css({ "left": win_width / 2 - (this.element.width() / 2) + "px" });
                this.element.find('.e-m-icon-arrow').css("left", target.offset().left + ((target.outerWidth() - this.element.find('.e-m-icon-arrow').width()) / 2) - left);
                var top = target.offset().top;
                var hgt = top + target.outerHeight();
                this.element.css({ "top": hgt + 10, "bottom": "auto" });
                if (!this.model.showArrow && this.model.type == "popover")
                    this.element.css("top", this.element.offset().top - (target.height() + 10));
                if (window.innerHeight < this.element.offset().top)
                    this.element.css({ "top": "auto" });
                if (this.model.type == "popover") {
                    if (!this.model.height && ((window.innerHeight - (top + 10)) < this._targetHeight))
                        this._menuUl.css("max-height", ((this._liHeight * 5) - ((this._titleDiv ? this._titleDiv.outerHeight() : 0) + this._menuArrowHeight + 10)));
                    if (top > (this._targetHeight + 10) && ((window.innerHeight - top) < this._targetHeight)) {
                        this.element.css({ "bottom": this._windowHeight - top + 10, "top": "auto" });
                        this.element.find('.e-m-icon-arrow.e-m-bottom').removeClass("e-m-state-hide").addClass("e-m-state-block");
                        this.element.find('.e-m-icon-arrow.e-m-top').removeClass("e-m-state-block").addClass("e-m-state-hide");
                    }
                }
                if (!this.model.showArrow && this.model.type == "popover")
                    this.element.css("bottom", (this._windowHeight - top + 10) - (target.height() + 10));
                if (this.model.type == "popup") {
                    this.element.css({ "top": (this._windowHeight - this._targetHeight) / 2 });
                    this.element.css({ "left": (this._windowWidth - this.element.outerWidth()) / 2 });
                }
            }
        },

        _createOverlayDiv: function () {
            this._overlay = ej.buildTag("div#" + this.model.id + "_overlay", "", "", { "class": "e-m-overlay e-m-menu-overlay" + " e-m-menu-" + this.model.type });
            this.element.after(this._overlay);
        },

        _cancelbtnTouchEnd: function (evt) {
            this.element.find(".e-m-menu-cancelbtn").removeClass("e-m-state-active");
            var currentMenu = evt.currentTarget;
            var data = { item: $(currentMenu), text: $(currentMenu).text() };
            this._trigger("touchEnd", data);
            this.hide();
        },

        _cancelbtnTouchStart: function (evt) {
            this.element.find(".e-m-menu-cancelbtn").addClass("e-m-state-active");
            var currentMenu = evt.currentTarget;
            var data = { item: $(currentMenu), text: $(currentMenu).text() };
            this._trigger("touchStart", data);
        },

        _docTouchStartHandler: function (e) {
            this._currentTarget = (this.model.target && (e.currentTarget.id != this.model.target || e.target.id != this.model.target));
            if (!$(e.target).closest('.e-m-menu').length && this._currentTarget) {
                this._hide = true;
                this.hide();
            }
        },
        _docTouchEndHandler: function (e) {
            if (this._hide && !$(e.target).closest('.e-m-menu').length && this._currentTarget)
                this._hide = false;
        },

        _onTouchHandler: function (evt, evtName) {
            if (ej.isNullOrUndefined(this.model.templateId)) {
                this._currentItem[evtName == "touchStart" ? "addClass" : "removeClass"]("e-m-state-active");
                var index = $(evt.currentTarget).index();
                this.model[evtName] = this.model.items[index][evtName] ? this.model.items[index][evtName] : this["_" + evtName];
                if (this.model[evtName])
                    this._trigger(evtName, { item: this._currentItem, text: this._currentItem.text() });
            }
        },

        _onTouchStartHandler: function (evt) {
            this._currentItem = $(evt.currentTarget);
            this._onTouchHandler(evt, "touchStart");
        },

        _onTouchEndHandler: function (evt) {
            this._onTouchHandler(evt, "touchEnd");
        },

        _onTapEventHandler: function (evt) {
            if (this.model.showOn == "taphold" && (evt.currentTarget == this._getTarget()[0])) {
                ej.listenEvents([$(document), $(document)], [ej.startEvent(), ej.endEvent], [this._docTouchStartDelegate, this._docTouchEndDelegate], true);
                this.show();
                ej.listenEvents([$(document), $(document)], [ej.startEvent(), ej.endEvent], [this._docTouchStartDelegate, this._docTouchEndDelegate], false);
            }
        },

        _onTouchMoveHandler: function (evt) {
            this._currentItem = $(evt.currentTarget);
            this._currentItem.removeClass("e-m-state-active");
        },

        _orientation: function (evt) {
            var target = this._getTarget();
            var proxy = this;
            setTimeout(function () {
                proxy._setHeightWidth();
                if (proxy.model.type != "actionsheet")
                    proxy._normalPosition(target);
            }, ej.isAndroid() ? 100 : 0);
        },


        _createDelegates: function () {
            this._showDelegate = $.proxy(this.show, this);
            this._cancelbtnTouchEndDelegate = $.proxy(this._cancelbtnTouchEnd, this);
            this._cancelbtnTouchStartDelegate = $.proxy(this._cancelbtnTouchStart, this);
            this._docTouchStartDelegate = $.proxy(this._docTouchStartHandler, this);
            this._docTouchEndDelegate = $.proxy(this._docTouchEndHandler, this);
            this._touchStartDelegate = $.proxy(this._onTouchStartHandler, this);
            this._touchEndDelegate = $.proxy(this._onTouchEndHandler, this);
            this._tapDelegate = $.proxy(this._onTapEventHandler, this);
            this._touchMoveDelegate = $.proxy(this._onTouchMoveHandler, this);
            this._resizeDelegate = $.proxy(this._orientation, this);
            this._orientationDelegate = $.proxy(this._orientation, this);
        },

        _wireEvents: function (remove) {
            var eventType = remove ? "unbind" : "bind";
			if(!remove){
				this._createDelegates();
			}
            this._li = this.element.find("li");
            ej.listenEvents([this._li, this._li, this._li, window], [ej.startEvent(), ej.endEvent(), ej.moveEvent(), 'orientationchange'], [this._touchStartDelegate, this._touchEndDelegate, this._touchMoveDelegate, this._orientationDelegate], remove);
            this._tapEvent = (this.model.showOn == "taphold") ? ej.tapHoldEvent() : ej.tapEvent();
            if (this.model.target) {
                if (this.model.showOn == "taphold")
                    ej.listenTouchEvent(this._getTarget(), this._tapEvent, this._tapDelegate, remove);
                else
                    ej.listenEvents([this._getTarget(), $(document), $(document)], [this._tapEvent, ej.startEvent(), ej.endEvent()], [this._showDelegate, this._docTouchStartDelegate, this._docTouchEndDelegate], remove);
            }
            if (this.model.cancelButton.show)
                ej.listenEvents([this.element.find('.e-m-menu-cancelbtn'), this.element.find('.e-m-menu-cancelbtn')], [ej.startEvent(), ej.endEvent()], [this._cancelbtnTouchStartDelegate, this._cancelbtnTouchEndDelegate], remove);
            if (!ej.isTouchDevice())
                $(window)[eventType]("resize", this._resizeDelegate);
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("e-m-menu");
            this._render();
        },

        _clearElement: function () {
            this.element.removeAttr("class").removeAttr("style");
            this._overlay.remove();
            this.element.html(this._orgEle.html());
        },

        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },

        _setCancelButton: function () {
            this.element.find(".e-m-menu-cancelbtn").css("color", this.model.cancelButton.color).text(this.model.cancelButton.text);
        },
        _setShowCancelButton: function (state) {
            this.element.find(".e-m-menu-cancelbtn").css("display", state ? "block" : "none");
        },

        _setType: function () {
            this._refresh();
        },

        _setAllowScrolling: function () {
            this._refresh();
        },

        _setTitle: function () {
            this._titleDiv.text(this.model.title);
        },

        _setRendermode: function () {
            this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
        },

        _setLocale: function () {
            this._getLocalizedLabels();
            this.model.title = this._localizedLabels["title"];
            this.model.cancelButton.text = this._localizedLabels["cancelButtonText"];
            this._setTitle();
            this._setCancelButtonText();
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

        /*---------------Public Methods---------------*/
        show: function (e) {
            this.element.addClass("e-m-menushow");
            if (this.model.type == "popover" || this.model.type == "popup") {
                var target = $(e.currentTarget);
                this.element.show().css({ "opacity": "1" });
                this._setHeightWidth();
                this._normalPosition(target);
            }
            if (this.model.type == "actionsheet")
                this.element.css({ "bottom": 0 });
            this._overlay.removeClass("e-m-overlay-hide").css("pointer-events", "auto");
            if (this.model.show)
                this._trigger("show");
        },

        hide: function () {
            if (this.model.type == "actionsheet")
                this.element.css({ "bottom": (-ej.getDimension(this.element, "outerHeight") - this.model.height) + "px" });
            else
                this.element.css("display", "none");
            this._overlay.addClass("e-m-overlay-hide").css("pointer-events", "none");
            if (this.model.hide && this.element.hasClass("e-m-menushow"))
                if (this._trigger("hide")) return;
            this.element.removeClass("e-m-menushow");
        },
        _enableDisable: function (val) {
            this.element[val ? "removeClass" : "addClass"]('e-m-state-disabled');
        },
        _enableDisableItem: function (index, val) {
            if (index)
                $(this.element.find('li.e-m-menuitem')[index - 1])[val ? "removeClass" : "addClass"]('e-m-state-disabled');
        },
        enableItem: function (index) {
            this._enableDisableItem(index, true);
        },
        disableItem: function (index) {
            this._enableDisableItem(index, false);
        },
        enable: function () {
            this._enableDisable(true);
        },

        disable: function () {
            this._enableDisable(false);
        },

        disableCancelButton: function () {
            this.element.find(".e-m-menu-cancelbtn").addClass("e-m-state-disabled");
        },

        enableCancelButton: function () {
            this.element.find(".e-m-menu-cancelbtn").removeClass("e-m-state-disabled");
        },

        addItem: function (menu, index) {
            if ($(this._orgEle.children()).length)
                (index) ?
                    menu.insertBefore($(this._orgEle.children().children()[index - 1])) :
                    this._orgEle.children().append(menu);
            else
                this.model.items.push(menu);
            this._refresh();
        },

        removeItem: function (index) {
            if ($(this._orgEle.children()).length)
                (index) ?
                    $(this._orgEle.children().children()[index - 1]).remove() :
                    $(this._orgEle.children().children()).last().remove();
            else 
                (index) ? this.model.items.splice((index - 1), 1) : this.model.items.pop();
            this._refresh();
        }
    });

    ej.mobile.Menu.ShowOn = {
        Tap: "tap",
        TapHold: "taphold"
    };

    ej.mobile.Menu.Type = {
        Popover: "popover",
        Popup: "popup",
        ActionSheet: "actionsheet"
    };
    ej.mobile.Menu.Locale = ej.mobile.Menu.Locale || {};
    ej.mobile.Menu.Locale["default"] = ej.mobile.Menu.Locale["en-US"] = {
        title: "Title",
        cancelButtonText: "Cancel"
    };

})(jQuery, Syncfusion);