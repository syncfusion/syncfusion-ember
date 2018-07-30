/**
* @fileOverview Plugin to style the Html NavigationBar elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {

    ej.widget({ "ejmNavigationBar": "ej.mobile.NavigationBar", "ejmHeader": "ej.mobile.Header", "ejmFooter": "ej.mobile.Footer", "ejmToolbar": "ej.mobile.Toolbar" }, {
        _setFirst: true,
        _rootCSS: "e-m-navbar",
        _tags: [{
            tag: "items",
            attr: ["iconName", "badgeValue"],
            content: "template"
        }],
        defaults: {
            title: null,
            titleAlignment: "left",
            isRelative: false,
            renderMode: "auto",
            templateID: null,
            enablePersistence: false,
            cssClass: "",
            mode: "header",
            position: "auto",
            iconAlignment: "auto",
            locale: "en-US",
            badge: {
                "maxValue": 99
            },
            android: {
                "position": "auto"
            },
            ios7: {
                "position": "auto"
            },
            flat: {
                "position": "auto"
            },
            windows: {
                "position": "auto"
            },
            touchStart: null,
            touchEnd: null,
            ellipsisTouchStart: null,
            ellipsisTouchEnd: null,
            enableRippleEffect: ej.isAndroid() ? true : false,
            items: []
        },
        dataTypes: {
            title: "string",
            titleAlignment: "enum",
            items: "data",
            isRelative: "boolean",
            renderMode: "enum",
            templateID: "string",
            cssClass: "string",
            enableRippleEffect: "boolean",
            mode: "enum",
            position: "enum",
            iconAlignment: "enum",
            android: {
                "position": "enum"
            },
            ios7: {
                "position": "enum"
            },
            flat: {
                "position": "enum"
            },
            windows: {
                "position": "enum"
            },
            badge: {
                "maxValue": "number"
            },
            enablePersistence: "boolean"
        },
        _init: function () {
            ej.setRenderMode(this);
            this._getLocalizedLabels();
            this.model.title = !ej.isNullOrUndefined(this.model.title) ? this.model.title : this._localizedLabels["title"];
            this._renderControl();
            this._wireEvents(false);
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
        },
        _renderControl: function () {
            this._orgEle = $(this.element).clone();
            this._angularContent = this.element.children();
            this._position = this.model[this.model.renderMode].position != "auto" ? this.model[this.model.renderMode].position : this.model.position != "auto" ? this.model.position : this.model.mode == "header" ? "top" : this.model.renderMode == "android" ? "top" : "bottom";
            this.model.iconAlignment = (!ej.isNullOrUndefined(this.model.iconAlignment) && this.model.iconAlignment != "auto") ? this.model.iconAlignment : this.model.renderMode == "windows" ? "group" : "split";
            this.element.addClass("e-m-user-select e-m-" + this.model.renderMode + " " + this.model.cssClass + " e-m-navbar-" + this._position + " e-m-navbar-" + this.model.mode + " e-m-" + (this.model.isRelative ? "rel" : "abs") + (this.model.templateID ? " e-m-navbar-template" : ""));
            this.model.templateID ? this._renderNavigationBarTemplate() : this._renderDefaultNavigationBar();
        },
        _renderNavigationBarTemplate: function () {
            var templateContent = ej.getCurrentPage().find("#" + this.model.templateID);
            if (templateContent.length) {
                this.element.empty();
                ej.destroyWidgets(templateContent);
                this._template = templateContent[0].nodeName && templateContent[0].nodeName.toLowerCase() == "script" ? ej.getClearString(templateContent[0].innerHTML) : templateContent;
                this.element.append(this._template);
                ej.widget.init(this.element);
                this._compileAngularElement(this.element.children());
            }
        },
        _renderDefaultNavigationBar: function () {
            this._compileAngularElement(this._angularContent);
            if (this.model.mode == "header" || (this.model.mode == "toolbar" && this._position == "top")) {
                this._titleSpan = ej.buildTag("span.e-m-navbar-text", this.model.title, null, null).appendTo(this.element);
                this._titleSpan.addClass("e-m-title-" + this.model.titleAlignment).css({ "margin-left": this.element.find(".e-m-navbar-left").length ? (ej.getDimension(this.element.find(".e-m-navbar-left"), "outerWidth") + 32) : 16, "margin-right": (this.model.mode == "header") ? this.element.find(".e-m-navbar-right").length ? (ej.getDimension(this.element.find(".e-m-navbar-right"), "outerWidth") + 32) : 16 : "" });
            }
            if (this.model.mode == "toolbar")
                this._toolbarRendering();
        },
        _compileAngularElement: function (element) {
            if ((!ej.isAppNullOrUndefined() && App.angularAppName) || ej.angular.defaultAppName)
                ej.angular.compile($(element));
        },
        _toolbarRendering: function () {
            var proxy = this, isAngular = this.model.items.length ? true : false;
            this._items = [];
            if (!isAngular) {
                this._navIcons = this.element.find("li");
                for (var i = 0, itemLength = this._navIcons.length; i < itemLength; i++)
                    this._items.push(this._insertItemValue($(this._navIcons[i])));
            }
            else this._items = this.model.items;
            this._navContainer = isAngular ? ej.buildTag("ul.e-m-clearall").appendTo(this.element) : this.element.find('ul').addClass("e-m-clearall");
            $.each(this._items, function (index) {
                var liitem = (isAngular ? (ej.buildTag("li").attr("data-ej-badgevalue", (!ej.isNullOrUndefined(this.badgeValue) && this.badgeValue > 0) ? this.badgeValue : null)) : $(proxy._navIcons[index])).attr("id", "nav-item" + index).addClass("e-m-navbar-icon e-m-icon-" + this.iconName).appendTo(proxy._navContainer);
                if (parseInt(liitem.attr("data-ej-badgevalue")) > 0) {
                    var val = parseInt(this.badgeValue);
                    liitem.addClass("e-m-nav-badge").attr("badgeValue", val <= proxy.model.badge.maxValue ? val : proxy.model.badge.maxValue.toString() + "+");
                }
            });
            this._allIconsLength = this._navContainer.find("li").length;
            this._maxIconsLength = this._position == "top" ? (this._allIconsLength > 3 ? 2 : this._allIconsLength) : this._allIconsLength > 5 ? 5 : this._allIconsLength;
            this._ellipsis = null;
            if (this._allIconsLength > this._maxIconsLength) {
                this._ellipsis = ej.buildTag("span.e-m-navbar-ellipsis e-m-icon-overflow").appendTo(this.element);
                this._overflowContainer = this._navContainer.clone();
                this.element.append(this._overflowContainer);
                this._navContainer.find("li").slice(this._maxIconsLength, this._allIconsLength).remove();
                this._overflowContainer.addClass("e-m-overflow-container").find("li").slice(0, this._maxIconsLength).remove();
                this._overflowIcons = this._overflowContainer.find("li").addClass("e-m-overflow-icon");
            }
            this._navbarIcons = this._navContainer.addClass("e-m-navbar-container" + (this._position == "bottom" ? " e-m-" + this.model.iconAlignment + "-icons" + (!ej.isNullOrUndefined(this._ellipsis) ? " e-m-more" : "") : "")).find("li");
            if (this._position == "top") {
                this._navContainer.addClass((this._allIconsLength > this._maxIconsLength ? "e-m-margin-right" : ""));
                this._titleSpan.addClass("e-m-margin-right-" + (this._allIconsLength > this._maxIconsLength ? 3 : this._allIconsLength));
            }
            this._iconWidth();
            this._setEnableRippleEffect();
        },

        _setEnableRippleEffect: function () {
            this.element.find("li")[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
        },
        _insertItemValue: function (item) {
            var itemVal = {};
            itemVal.iconName = ej.getAttrVal(item, 'data-ej-iconname', undefined);
            itemVal["badgeValue"] = ej.getAttrVal(item, 'data-ej-badgevalue', undefined);
            return itemVal;
        },
        _iconWidth: function () {
            if (this.model.iconAlignment != "group") {
                if (this.model.mode == "toolbar" && this._position == "bottom") {
                    if (!ej.isNullOrUndefined(this._ellipsis))
                        this._navContainer.width(window.innerWidth - 56);
                    else this._navContainer.width("100%");
                }
            }
            else this._navContainer.width("auto");

        },
        _createDelegates: function () {
            this._ellipsisTouchStartHndlr = $.proxy(this._ellipsisTouchStart, this);
            this._ellipsisTouchEndHndlr = $.proxy(this._ellipsisTouchEnd, this);
            this._touchStartHndlr = $.proxy(this._touchStart, this);
            this._touchEndHndlr = $.proxy(this._touchEnd, this);
            this._resizeHndlr = $.proxy(this._resize, this);
        },
        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenEvents([$(this._ellipsis), $(this._ellipsis), this._navbarIcons, this._navbarIcons], [ej.startEvent(), ej.endEvent(), ej.startEvent(), ej.endEvent()], [this._ellipsisTouchStartHndlr, this._ellipsisTouchEndHndlr, this._touchStartHndlr, this._touchEndHndlr], remove);
            ej.listenTouchEvent($(document), ej.tapEvent(), this._docClickHndlr, remove);
            ej.listenTouchEvent($(window), "onorientationchange" in window ? "orientationchange" : "resize", this._resizeHndlr, remove);
        },
        _touchStart: function (args) {
            this._touchEvents(args, true, 'touchStart');
        },
        _touchEnd: function (args) {
            this._touchEvents(args, true, 'touchEnd');
        },
        _ellipsisTouchStart: function (args) {
            this._touchEvents(args, false, 'ellipsisTouchStart');
        },
        _ellipsisTouchEnd: function (args) {
            this._touchEvents(args, false, 'ellipsisTouchEnd');
        },
        _touchEvents: function (args, isIconEvent, event) {
            var data = isIconEvent ? { element: $(args.target), iconname: args.target.getAttribute("data-ej-iconname"), index: args.target.id.split("item")[1] } : { element: $(args.target) };
            var add = args.type == ej.startEvent() ? "add" : "remove";
            $(args.target)[add + "Class"]("e-m-state-active");
            if (this.model[event])
                this._trigger(event, data);
        },
        _resize: function (args) {
            var proxy = this;
            setTimeout(function () {
                proxy._iconWidth();
            }, (ej.isAndroid() ? 200 : 0));
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
        _setRenderMode: function (renderMode) {
            this.element.removeClass("e-m-android e-m-ios7 e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
        },
        _setIsRelative: function (relative) {
            this.element.removeClass("e-m-abs e-m-rel").addClass("e-m-" + (relative ? "rel" : "abs"));
        },
        _setTitle: function () {
            this._titleSpan.text(this.model.title);
        },
        _setTemplateID: function () {
            this._renderNavigationBarTemplate();
        },
        _setTitleAlignment: function () {
            this._titleSpan.removeClass("e-m-title-left e-m-title-center e-m-title-right").addClass("e-m-title-" + this.model.titleAlignment);
        },
        _setIconAlignment: function () {
            this._navContainer.removeClass("e-m-split-icons e-m-group-icons").addClass("e-m-" + this.model.iconAlignment + "-icons");
            this._iconWidth();
        },
        _setLocale: function () {
            this._getLocalizedLabels();
            this.model.title = this._localizedLabels["title"];
            this._setTitle(this.model.title)
        },
        _refresh: function () {
            this._clearElement();
            this.element.addClass("e-m-navbar");
            this._renderControl();
        },
        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },
        _destroy: function () {
            this._clearElement();
        },
        _addRemoveRefresh: function () {
            this.element.empty();
            this._renderControl();
            this._wireEvents();
            this._items = this.model.items;
        },

        /*---------------Public Methods---------------*/
        removeItem: function (index) {
            this.model.items = this._items;
            if (index >= 0)
                this.model.items.splice(index, 1);
            this._addRemoveRefresh();
        },
        addItem: function (item, index) {
            this.model.items = this._items;
            (index >= 0) ? this.model.items.splice(index, 0, this._insertItemValue($(item))) : this.model.items.push(this._insertItemValue($(item)));
            this._addRemoveRefresh();
        },
        disableItem: function (index) {
            if (index >= 0)
                $(this._navbarIcons[index]).addClass("e-m-state-disabled");
        },
        enableItem: function (index) {
            if (index >= 0)
                $(this._navbarIcons[index]).removeClass("e-m-state-disabled");
        },
        hideItem: function (index) {
            if (index >= 0)
                $(this._navbarIcons[index]).addClass("e-m-hide");
        },
        showItem: function (index) {
            if (index >= 0)
                $(this._navbarIcons[index]).removeClass("e-m-hide");
        },
        getTitle: function () {
            return this._titleSpan.text();
        },
        hide: function () {
            this.element.addClass("e-m-hide");
        },
        show: function () {
            this.element.removeClass("e-m-hide");
        }
        /*---------------Public Methods End---------------*/

    });

    ej.mobile.NavigationBar.Position = {
        Top: "top",
        Bottom: "bottom"
    };

    ej.mobile.NavigationBar.Mode = {
        Header: "header",
        Toolbar: "toolbar"
    };

    ej.mobile.NavigationBar.TitleAlignment = {
        Left: "left",
        Center: "center",
        Right: "right"
    };

    ej.mobile.NavigationBar.IconAlignment = {
        Split: "split",
        Group: "group"
    };
    var navBarLocaleObj = {
        title: null
    }
    ej.mobile.NavigationBar.Locale = ej.mobile.NavigationBar.Locale || {};
    ej.mobile.Header.Locale = ej.mobile.Header.Locale || {};
    ej.mobile.Footer.Locale = ej.mobile.Footer.Locale || {};
    ej.mobile.Toolbar.Locale = ej.mobile.Toolbar.Locale || {};
    ej.mobile.NavigationBar.Locale["default"] = ej.mobile.NavigationBar.Locale["en-US"] =
    ej.mobile.Header.Locale["default"] = ej.mobile.NavigationBar.Locale["en-US"] =
    ej.mobile.Footer.Locale["default"] = ej.mobile.NavigationBar.Locale["en-US"] =
    ej.mobile.Toolbar.Locale["default"] = ej.mobile.NavigationBar.Locale["en-US"] =
    navBarLocaleObj;

})(jQuery, Syncfusion);