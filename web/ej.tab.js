/**
* @fileOverview Plugin to style the tab control.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejTab", "ej.Tab", {
        _rootCSS: "e-tab",

        element: null,

        model: null,
        validTags: ["div", "span"],
        _addToPersist: ["selectedItemIndex"],
        _setFirst: false,
        angular: {
            terminal: false
        },

        defaults: {

            collapsible: false,

            enableAnimation: true,

            ajaxSettings: {

                type: 'GET',

                cache: false,

                data: {},

                dataType: "html",

                contentType: "html",

                async: true
            },

            disabledItemIndex: [],

            enabledItemIndex: [],

            hiddenItemIndex: [],

            events: "click",

            idPrefix: "ej-tab-",

            heightAdjustMode: "content",

            selectedItemIndex: 0,

            cssClass: "",

            showCloseButton: false,

            htmlAttributes: {},

            enableTabScroll: false,

            showReloadIcon: false,

            headerPosition: "top",

            width: null,

            height: null,

            headerSize: null,

            enableRTL: false,

            allowKeyboardNavigation: true,

            showRoundedCorner: false,

            enablePersistence: false,

            enabled: true,

            ajaxLoad: null,

            ajaxBeforeLoad: null,

            ajaxSuccess: null,

            ajaxError: null,

            itemActive: null,

            beforeActive: null,

            itemAdd: null,

            itemRemove: null,

            beforeItemRemove: null,

            create: null,

            destroy: null

        },
        dataTypes: {
            cssClass: "string",
            collapsible: "boolean",
            events: "string",
            heightAdjustMode: "enum",
            enabled: "boolean",
            ajaxSettings: "data",
            disabledItemIndex: "data",
            enabledItemIndex: "data",
            enableAnimation: "boolean",
            htmlAttributes: "data"
        },
        observables: ["selectedItemIndex"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),


        _destroy: function () {
            this._unWireEvents();
            this._removeBaseClass();
        },

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "events": {
                        this._off(this.items, this.model.events);
                        this._on(this.items, options[key], this._tabItemClick);
                        break;
                    }
                    case "disabledItemIndex": {
                        this._disableItems(options[key]);
                        options[key] = this.model.disabledItemIndex;
                        break;
                    }
                    case "enabledItemIndex": this._enableItems(options[key]); break;
                    case "enabled": this._enabledAction(options[key]); break;
                    case "selectedItemIndex": {
                        this._isInteraction = false;
                        this.showItem(ej.util.getVal(options[key]));
                        options[key] = this.model.selectedItemIndex;
                        break;
                    }
                    case "heightAdjustMode": {
                        this.model.heightAdjustMode = options[key];
                        this._setTabsHeightStyle(options[key]);
                        this._resizeEvents(options[key]);
                        break;
                    }
                    case "cssClass": this._changeSkin(options[key]); break;
                    case "showRoundedCorner": this._roundedCorner(options[key]); break;
                    case "height": {
                        this.model.height = options[key];
                        this._setTabsHeightStyle(this.model.heightAdjustMode);
                        break;
                    }
                    case "width": this.element.width(options[key]);
                        $(this.contentPanels).width(Number(options[key]));
                        this.refreshTabScroll();
                        break;
                    case "headerSize": this._setHeaderSize(options[key]); break;
                    case "allowKeyboardNavigation": {
                        if (options[key])
                            this._on(this.element, 'keydown', this._keyPress);
                        else
                            this._off(this.element, "keydown");
                        break;
                    }
                    case "headerPosition":
                        {
                            this.model.headerPosition = options[key];
                            if (this.model.headerPosition == ej.Tab.Position.Top) {
                                this._removeVerticalClass();
                                this._removeScroll();
                                this.itemsContainer.remove();
                                this.itemsContainer.insertBefore(this.element.find(">div").first());
                                this.element.find("div.e-active-content").removeClass("e-activebottom");
                                $(this.contentPanels).css("margin-top", "0")
                            }
                            else if (this.model.headerPosition == ej.Tab.Position.Bottom) {
                                this._removeVerticalClass();
                                this._removeScroll();
                                this.element.find("div.e-active-content").removeClass("e-activetop");
                                this.model.enableTabScroll ? $(this.contentPanels).css("margin-top", "0") : $(this.contentPanels).css("position", "relative")
                            }
                            else if (this.model.headerPosition == ej.Tab.Position.Left || this.model.headerPosition == ej.Tab.Position.Right) {
                                this._removeHeaderClass();
                                $(this.items).css('display', '');
                                this._removeScroll();

                            }
                            this._refresh();
                            if (this.model.headerPosition == ej.Tab.Position.Right)
                                this.element.css("position", "")
                            if (this.model.headerPosition == ej.Tab.Position.Left || this.model.headerPosition == ej.Tab.Position.Right) {
                                this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                                
                            }

                            this.scrollstep = 30
                            break;
                        }
                    case "showCloseButton":
                        {
                            if (options[key]) {
                                this._addDeleteIcon();
                                this._on(this.element.find("div.e-close"), "click", this._tabDeleteClick);
                            } else
                                this.element.find("div.e-close").remove();
                            break;
                        }
                    case "enableTabScroll":
                        {
                            this.model.enableTabScroll = options[key];
                            if (options[key]) {
                                this._removeScroll();
                                this._addScroll();
                                if (this.model.headerPosition == "left") {
                                    this._refresh();
                                    this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                                }
                            } else {
                                this._removeScroll();
                                this.itemsContainer.removeAttr("style");
                                $(this.contentPanels).css("margin-top", "0")
                            }
                            if (this.model.headerPosition == ej.Tab.Position.Left || this.model.headerPosition == ej.Tab.Position.Right) {
                                this._refresh();
                                this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                                if (this.model.headerPosition == ej.Tab.Position.Right && !this.model.enableTabScroll)
                                    this.element.css("margin-left", "")
                            }
                            break;
                        }
                    case "showReloadIcon":
                        {
                            if (options[key]) {
                                this._addReloadIcon();
                            } else
                                this.element.find("div.e-reload").remove();
                            break;
                        }
                    case "enableRTL":
                        {
                            this.model.enableRTL = options[key];
                            this._removeScroll();
                            this.itemsContainer.removeAttr("style");
                            $(this.contentPanels).css("margin-top", "0")
                            this.element.find("ul").removeAttr("style")
                            options[key] ? this.element.addClass("e-rtl") : this.element.removeClass("e-rtl");
                            if (this.model.enableTabScroll)
                                this._addScroll();
                            this._refresh();
                            this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                            if (this.model.headerPosition == ej.Tab.Position.Right && this.model.enableRTL)
                                this.element.css("margin-left", '')

                            break;
                        }
                    case "htmlAttributes": this._addAttr(options[key]); break;
                    case "hiddenItemIndex": {
                        if (this.model.headerPosition == ej.Tab.Position.Top || this.model.headerPosition == ej.Tab.Position.Bottom)
                            $(this.items).css('display', 'inline-block');
                        else $(this.items).css('display', '');
                        this.model.hiddenItemIndex = options[key];
                        this.model.hiddenItemIndex.length > 0 && this._hiddenIndexItem(this.model.hiddenItemIndex);
                        break;
                    }
                }
            }
        },

        _removeScroll: function () {
            this.element.find("div.e-chevron-circle-right").remove();
            this.element.find("div.e-chevron-circle-left").remove();
        },

        _addScroll: function () {
            if ((this.model.headerPosition == "left" || this.model.headerPosition == "right" && this._tabContentsHeight() > (this.element.width() || Number(this.model.height))) || (this.model.headerPosition == "top" || this.model.headerPosition == "bottom"))
                this._checkScroll();
            this._addScrollIcon();
            this.refreshTabScroll();
        },

        _init: function () {
            this._addItemIndex = null;
            this.tabId = 0;
            this._hiddenIndex = this.model.hiddenItemIndex;
            this._initialize();
            this._prevSize = this._getDimension($(this.element).parent(), "height");
        },


        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _tabContentsWidth: function () {
            var length = this.element.find("li").length;
            var tabLength = 0;
            for (var i = 0; i < length; i++) {
                tabLength = tabLength + $(this.element.find("li")[i]).width();
            }
            return tabLength
        },

        _tabContentsHeight: function () {
            var length = this.element.find("li").length;
            var tabHeight = 0;
            for (var i = 0; i < length; i++) {
                tabHeight = tabHeight + $(this.element.find("li")[i]).height();
            }
            return tabHeight
        },

        _initialize: function () {
            this.initialRender = true;
            this.element.attr("tabindex", 0).attr("role", "tablist");
            this._itemsRefreshing();
            $(this.anchors).addClass("e-link");
            this._preTabSelectedIndex = this._preTabIndex = -1;
            if (!ej.isNullOrUndefined(this.model.width))
                this.element.width(this.model.width);
            if (!ej.isNullOrUndefined(this.model.height))
                this.element.height(this.model.height);
            this._setTabPosition(this.model.headerPosition);
            if (this.model.showCloseButton)
                this._addDeleteIcon();
            if (this.model.showReloadIcon)
                this._addReloadIcon();
            if (this.model.showRoundedCorner)
                this._roundedCorner(this.model.showRoundedCorner);
            this._enabledAction(this.model.enabled);
            this.contentPanels = [];
            this._addAttr(this.model.htmlAttributes);
            this._reinitialize();
            this._addBaseClass();
            if (!ej.isNullOrUndefined(this.model.headerSize))
                this._setHeaderSize(this.model.headerSize);
            this._disableTabs();
            this._roundedCorner(this.model.showRoundedCorner);
            if (this.model.enableTabScroll) {
                if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                    if (this.itemsContainer.width() > (this.element.width()))
                        this._addScrollIcon();
                }
                else {
                    if (this.element.height() < (this.items.height() * this.items.length))
                        this._addScrollIcon();
                }
            }
            this._wireEvents(this.model.events);
            // Added for rendering the Windows tab...
            this.showItem(this.selectedItemIndex());
            this._setTabsHeightStyle(this.model.heightAdjustMode);
            this._enabledAction(this.model.enabled);
            this._resizeEvents(this.model.heightAdjustMode);
			if(this.selectedItemIndex() > -1 && this.contentPanels != 0 && this.model.enableRTL)		
				$(this.element).height(this.itemsContainer.height()+parseInt($(this.contentPanels).css("height")));        
            this.model.hiddenItemIndex.length > 0 && this._hiddenIndexItem(this.model.hiddenItemIndex);
        },

        _reinitialize: function ( addContentBaseClass ) {
            var hid, href, hrefBase;
            for (var i = (this._addItemIndex != null) ? this._addItemIndex : 0; i < this.anchors.length; i++) {
                hid = this.anchors[i];
                if (this.divId == undefined)
                    href = $(hid).attr("href");
                else
                    href = this.divId;
                this.divId = undefined;
                hrefBase = href.split("#")[0];
                if (hrefBase && (hrefBase === location.toString().split("#")[0])) {
                    href = a.hash;
                    hid.href = href;
                }
                if (href && href !== "#") {
                    this._addContentTag(href, i);
                    if(addContentBaseClass) this._addContentBaseClass($(this.contentPanels[i]));
                }
                else if (!this.model.enablePersistence) {
                    this.model.disabledItemIndex.push(i);
                }
                if (this._addItemIndex != null) {
                    this._unWireEvents();
                    this._wireEvents(this.model.events);
				if (this.items.length == 1) {
					this.showItem(this.selectedItemIndex());
				}
                    break;
                }
            }

        },
        _itemsRefreshing: function () {
            this.itemsContainer = this.element.find("ol,ul").eq(0);
            this.items = this.itemsContainer.find(" > li:has(a[href])");
            this.anchors = this.items.find('a[href]');
        },
        _setHeaderSize: function (size) {
            this.element.find(">ul li.e-item").css("height", "auto");
            this.element.find(">ul li.e-item").children("a.e-link").css("margin-top", "0px");
            if (this.model.headerPosition == "left") {
                this.element.find(">ul.e-left").css({ "width": size, "text-align": "center" });
            }
            else if (this.model.headerPosition == "right") {
                this.element.find(">ul.e-right").css({ "width": size, "text-align": "center" });
            }
            else {
                this.element.find(">ul.e-header li.e-item").css("height", size);
                this.element.find(">ul.e-header li.e-item a.e-link").css("margin-top", ((this.element.find(">ul.e-header").outerHeight() / 2) - this.element.find(">.e-header li.e-item a.e-link").outerHeight()).toString() + "px");
				this.element.find(">ul.e-header li.e-item .e-icon.e-tabdelete").css("margin-top", (((this.element.find(">ul.e-header").outerHeight() / 2) - this.element.find(">.e-header li.e-item .e-icon.e-tabdelete").outerHeight())-5).toString() + "px");
				this.element.find(">ul.e-header li.e-item .e-icon.e-reload").css("margin-top", (((this.element.find(">ul.e-header").outerHeight() / 2) - this.element.find(">.e-header li.e-item .e-icon.e-reload").outerHeight())-5).toString() + "px");
            }
        },
        _enabledAction: function (flag) {
            if (flag) {
                this.element.removeClass("e-disable");
            }
            else {
                this.element.addClass("e-disable");
            }
        },
        _hiddenIndexItem: function (value) {
            var elementId;
            for (var i = 0; i < value.length; i++) {
                if (!$.inArray(parseInt(value[i]), this._hiddenIndex) > -1) {
                    elementId = $(this.items[parseInt(value[i])]).children('a').attr('href');
                    this._hidePanel(elementId);
                }
            }
            this._hideContentPanel(this.selectedItemIndex(), this.model.hiddenItemIndex);
            this._hiddenIndex = this.model.hiddenItemIndex;
        },
        _hidePanel: function (value) {
            for (var j = 0; j < this.contentPanels.length; j++) {
                if ("#" + $(this.contentPanels[j]).attr('id') == value) {
                    $(this.contentPanels[j]).css('display', 'none');
                    break;
                }
            }
            for (var i = 0; i < this.items.length; i++) {
                if ($(this.items.children('a')[i]).attr('href') == value) {
                    $(this.items[i]).css('display', 'none');
                    break;
                }
            }
        },
        _hideContentPanel: function (index, value) {
            if ($.inArray(index, value) > -1) {
                index += 1;
                if (index <= this.items.length - 1) {
                    this._hideContentPanel(index, value);
                }
                else if (index > this.items.length - 1 && value.length != this.items.length) {
                    this._hideContentPanel(0, value);
                }
            }
            else this.showItem(index);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && value == "disabled") { proxy.model.enabled = false; proxy._enabledAction(false); }
                else proxy.element.attr(key, value)
            });
        },


        _setTabPosition: function (position) {
            if (position == ej.Tab.Position.Bottom) {
                this.itemsContainer.appendTo(this.element);
                this.items.removeClass("e-bottom-line");
                this.items.addClass("e-top-line");
            }
            else if (position == ej.Tab.Position.Top) {
                this.items.removeClass("e-top-line");
				this.itemsContainer.prependTo(this.element);
                if (this.model.enableRTL)
                    this.items.addClass("e-rtl-top-line e-top-hover");
                else
                    this.items.addClass("e-bottom-line");
            }
            else if (position == ej.Tab.Position.Left || position == ej.Tab.Position.Right) {
                if (this.items.length >= 0) {
                    if (this.model.height)
                        this.itemsContainer.css("height", this.model.height);
                    else {
                        if (!this.model.heightAdjustMode === "fill") $(this.itemsContainer).css("height", "");
                    }
                    this.element.addClass("e-vertical");
                }
            }
        },


        _addDeleteIcon: function () {
            if (this.element.find("div.e-close.e-tabdelete").length <= 0 && this.items.length > 0) {
                var deleteIcon = ej.buildTag('div.e-icon e-close e-tabdelete', "", {}, { role: "presentation" }).css("visibility", "hidden");
                if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                    var delIconPosition = this.items.find("a");
                    deleteIcon.insertBefore(delIconPosition);
                }
                else
                    this.items.append(deleteIcon);
            }
        },
        _tabScrollIconCalc: function(){
            this.padding = {
                left : Number(this.element.css("padding-left").split("px")[0]),
                right : Number(this.element.css("padding-right").split("px")[0]),
                top : Number(this.element.css("padding-top").split("px")[0]),
                bottom : Number(this.element.css("padding-bottom").split("px")[0]),
            }; 
            this.scrollPosition = (this.itemsContainer.width() / 2) - this._rightScrollIcon.width();
            this.rightScroll = ej.getDimension(this.element, "width")- (this.itemsContainer.outerWidth()/2);
        },
        _addScrollIcon: function () { 
            this.element.addClass("e-tabscroll").css({"position":"relative", "overflow":"hidden"});
            if (this.element.find("div.e-chevron-circle-right").length <= 0 && this.items.length > 0) {
                this._rightScrollIcon = ej.buildTag('div.e-icon e-chevron-circle-right', "", {}, { role: "presentation" }).css("visibility", "hidden");
                this.itemsContainer.after(this._rightScrollIcon);
                this.scrollstep = 30;
                this._tabScrollIconCalc();
                this._rightScrollIcon.css("position", "absolute");
                if (!this.model.enableRTL) {
                    if (this.model.headerPosition == "left"){
                        this._rightScrollIcon.css("top", this.padding.top + 20 + "px");
                        this._rightScrollIcon.css("left", (this.scrollPosition + this.padding.left) + "px");
                    }
                    else if (this.model.headerPosition == "right"){
                        this._rightScrollIcon.css({"margin-left": this.itemsContainer.width() / 2 - this.scrollstep + "px", "z-index": "15", "top": this.padding.top + 20 + "px", "left": this.rightScroll + "px" });
                        this.element.css({"position": "relative"});
                    }
                    else {
                        if (this.model.enablePersistence == true && this._beforeWidth != 0 && (this._beforeWidth > this.scrollPanelWidth))
                            this._rightScrollIcon.css("margin-right", this.itemsContainer.width() - this.scrollPanelWidth + 20 - ((this.items[this.selectedItemIndex()].offsetLeft - this.scrollPanelWidth) * 2) + "px");
                        else
                            this._rightScrollIcon.css("left", (this.scrollPanelWidth-(this.scrollstep + 20) + this.padding.left) + "px");
                    }
                }
                if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                    this._rightScrollIcon.css("transform", "rotate(270deg)");
                    if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) < 11) {
                            if (!this.model.enableRTL)
                                this._rightScrollIcon.css("top", this.padding.top + 20 + "px");
                            else
                                this._rightScrollIcon.css("top", this.padding.top + 20 + "px");
                    }
                    else {
                        if (this.model.enablePersistence == true && this._beforeWidth != 0 && (this._beforeWidth > this.scrollPanelHeight))
                            this._rightScrollIcon.css("margin-top", "-" + ((this.items[this.selectedItemIndex()].offsetTop * 3 - this.scrollPanelHeight * 2)) + "px");
                        else
                            if (this.model.enableRTL)
                                if(this.model.headerPosition == "left")
                                this._rightScrollIcon.css({"left": "0px", "margin-left": (this.scrollPosition + this.padding.left) + "px", "z-index":"15"});
                                else
                                this._rightScrollIcon.css({"right": (this.itemsContainer.outerWidth()/2) + this.padding.right + "px","z-index":"15"});
                                    

                    }
                }

                else {
                    if (this.model.enableRTL) { 
                        this._rightScrollIcon.css("margin-left", (this.itemsContainer.width() - 14) + "px");
                    } 
                }
                if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) < 11) {
                     if (this.model.headerPosition == "bottom") {
                        if (!this.model.enableRTL)
                            this._rightScrollIcon.css("top", ((this.itemsContainer.height() / 2) + 27) + "px");
                        else
                            this._rightScrollIcon.css("top", ((this.itemsContainer.height() / 2) + 20) + "px");
                    }
                }
                
                this.element.attr('unselectable', 'on')
                this.element.css('user-select', 'none')
                this.element.on('selectstart', false);
                this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                this._on(this.element.find("div.e-chevron-circle-right"), "mouseover", this._hoverHandler);
                this._on(this.element.find("div.e-chevron-circle-right"), "mouseout", this._hoverHandler);
            }
        },
        _addScrollBackIcon: function () {
            if (this.element.find("div.e-chevron-circle-left").length <= 0) {
                this._leftScrollIcon = ej.buildTag('div.e-icon e-chevron-circle-left', "", {}, { role: "presentation" }).css("visibility", "hidden");
                this.itemsContainer.before(this._leftScrollIcon);
                this.rightscrollstep = 30;
                this.element.attr('unselectable', 'on')
                this.element.css('user-select', 'none')
                this.element.on('selectstart', false);
                this._leftScrollIcon.css("position", "absolute").css("z-index", "10");
                if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                    if (this.model.enableRTL){ 
                        this._leftScrollIcon.css("left", (this.padding.left + this.rightscrollstep) + "px");
                    }
                }
                if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                    if (!this.model.enableRTL) {
                        if (this.model.headerPosition == "right"){
                            this._leftScrollIcon.css({"margin-left": ((this.itemsContainer.width() / 2) - 30) + "px", "z-index": "15", "left": this.rightScroll + "px"});
                            this._leftScrollIcon.css("top", this.scrollPanelHeight + 30 + "px");
                        }
                        else if (this.model.headerPosition == "left"){
                            this._leftScrollIcon.css("left", (this.scrollPosition + this.padding.left) + "px");
                            this._leftScrollIcon.css("top", (this.scrollPanelHeight- 20) + this.padding.top + "px");
                        }
                    }
                    else {
                        this._leftScrollIcon.css("top", this.scrollPanelHeight + "px");
                        if (this.model.headerPosition == "right")
                            
                            this._leftScrollIcon.css({"right": (this.itemsContainer.outerWidth()/2) + this.padding.right + "px", "margin-left": (this.scrollPosition + this.padding.left) + "px", "z-index": "15"});
                        else
                            this._leftScrollIcon.css({"left":"0px", "margin-left": (this.scrollPosition + this.padding.left) + "px"});
                    }
                    this._leftScrollIcon.css("transform", "rotate(270deg)");
                }
                if (ej.browserInfo().name == "msie" && parseInt(ej.browserInfo().version) < 11)
                    if (this.model.headerPosition == "bottom") {
                    this._leftScrollIcon.css("top", ((this.itemsContainer.height() / 2) + 27) + "px");     
                    }
                this._on(this._leftScrollIcon, "click", this._tabScrollBackClick);
                this._on(this.element.find("div.e-chevron-circle-left"), "mouseout", this._hoverHandler);
                this._on(this.element.find("div.e-chevron-circle-left"), "mouseover", this._hoverHandler);
            }
        },


        _addReloadIcon: function () {
            if (this.element.find("div.e-reload").length <= 0 && this.items.length > 0) {
                var reloadIcon = ej.buildTag('div.e-icon e-reload', "", {}, { role: "presentation" }).css("visibility", "hidden");
                if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                    var iconPosition = this.items.find("a");
                    reloadIcon.insertBefore(iconPosition);
                }
                else
                    this.items.append(reloadIcon);
            }
        },


        _addBaseClass: function () {
            this.element.addClass("e-widget " + this.model.cssClass);
            this.itemsContainer.addClass("e-box")
            if (this.model.enableRTL)
                this.element.addClass("e-rtl");
            // To avoid border blinking 
            if (this.model.headerPosition == "top") {
                $(this.contentPanels).addClass("e-hidebottom e-addborderbottom");
                $(this.itemsContainer).addClass("e-addborderbottom");
                $(this.contentPanels).removeClass("e-hidetop e-addbordertop e-hideright e-addborderright e-hideleft e-addborderleft");
                $(this.itemsContainer).removeClass("e-addbordertop e-addborderright e-addborderleft");
                this.items.length > 0 && this.itemsContainer.addClass("e-header");
                if (this.model.enableRTL) {
                    this.items.addClass("e-rtl-top-line");
                    this.items.removeClass("e-rtl-bottom-line");
                }
            }
            if (this.model.headerPosition == "bottom") {
                $(this.contentPanels).removeClass("e-hidebottom e-addborderbottom e-hideright e-addborderright e-hideleft e-addborderleft");
                $(this.itemsContainer).removeClass("e-addborderbottom e-addborderright e-addborderleft");
                $(this.contentPanels).addClass("e-hidetop e-addbordertop");
                $(this.itemsContainer).addClass("e-addbordertop");
                this.items.length > 0 && this.itemsContainer.addClass("e-header");
                if (this.model.enableRTL) {
                    this.items.addClass("e-rtl-bottom-line")
                    this.items.removeClass("e-rtl-top-line e-top-line");
                }
            }
            if (this.model.headerPosition == "left") {
                this.items.length > 0 && this.itemsContainer.addClass("e-left");
                $(this.contentPanels).removeClass("e-hidetop e-addbordertop e-hidebottom e-addborderbottom e-hideright e-addborderright");
                $(this.itemsContainer).removeClass("e-addbordertop e-addborderbottom e-addborderright");
                $(this.contentPanels).addClass("e-hideleft e-addborderleft");
                $(this.itemsContainer).addClass("e-addborderleft");
                $(this.items).removeClass("e-rtl-bottom-line e-rtl-top-line");
            }
            if (this.model.headerPosition == "right") {
                this.items.length > 0 && this.itemsContainer.addClass("e-right");
                $(this.contentPanels).removeClass("e-hidetop e-addbordertop e-hidebottom e-addborderbottom e-hideleft e-addborderleft");
                $(this.itemsContainer).removeClass("e-addbordertop e-addborderbottom e-addborderleft");
                $(this.contentPanels).addClass("e-hideright e-addborderright");
                $(this.itemsContainer).addClass("e-addborderright");
                if (this.model.enableTabScroll && this._tabContentsHeight() > (this.element.height || Number(this.model.height)))
                    $(this.itemsContainer).css("z-index", "12").css("margin-left", "-" + this.itemsContainer.find("li").width() + "px");
                $(this.items).removeClass("e-rtl-bottom-line e-rtl-top-line");
            }
            this.items.addClass("e-select e-item").attr("role", "tab").attr("tabindex", -1).attr("aria-expanded", true).attr("aria-selected", false);
            $(this.contentPanels).addClass("e-content  e-content-item e-box").attr("role", "tabpanel").attr("aria-hidden", true);
            if (((this.model.headerPosition == "left" || this.model.headerPosition == "right") && (this._tabContentsHeight() > (this.element.height() || Number(this.model.height)))) || ((this.model.headerPosition == "top" || this.model.headerPosition == "bottom") && this._tabContentsWidth() > ((ej.getDimension(this.element, "width")) || this.model.width)))
                this._checkScroll();
        },
        _addContentBaseClass: function (panelElement) {
            if (this.model.headerPosition == "top") {
                panelElement.addClass("e-hidebottom e-addborderbottom");
                panelElement.removeClass("e-hidetop e-addbordertop e-hideright e-addborderright e-hideleft e-addborderleft");
            }
            if (this.model.headerPosition == "bottom") {
                panelElement.removeClass("e-hidebottom e-addborderbottom e-hideright e-addborderright e-hideleft e-addborderleft");
                panelElement.addClass("e-hidetop e-addbordertop");
            }
            if (this.model.headerPosition == "left") {
                panelElement.removeClass("e-hidetop e-addbordertop e-hidebottom e-addborderbottom e-hideright e-addborderright");
                panelElement.addClass("e-hideleft e-addborderleft");
            }
            if (this.model.headerPosition == "right") {
                panelElement.removeClass("e-hidetop e-addbordertop e-hidebottom e-addborderbottom e-hideleft e-addborderleft");
                panelElement.addClass("e-hideright e-addborderright");
            }
            panelElement.addClass("e-content  e-content-item e-box").attr("role", "tabpanel").attr("aria-hidden", true);
        },

        _checkScroll: function () {
            this.scrollPanelWidth = ej.getDimension(this.element, "width");
            this.scrollPanelHeight = ej.getDimension(this.element, "height");
            if (this.model.enableTabScroll == true && this._tabContentsHeight() > this.items.height()) {
                this.scrollstep = 0;
                this.model.enableTabScroll = true;
                if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                    this.itemsContainer.css({ "width": ((ej.getDimension(this.element, "width") + (parseInt(this.items.css("width")) * this.items.length))) + "px", "position": "absolute" });
                }
                this._beforeWidth = 0;
                if (this.model.enablePersistence == true) {
                    if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                        for (var val = 0; val < this.selectedItemIndex() ; val++) {
                            this._beforeWidth += this.items[val].offsetWidth;
                        }
                    }
                    else {
                        for (var val = 0; val < this.selectedItemIndex() ; val++) {
                            this._beforeWidth += this.items[val].offsetHeight;
                        }
                    }
                }
                var widthValue = parseInt(this.itemsContainer.css("width"));
                if (this.model.headerPosition == "top") {
                    var item = $(this.contentPanels);
                    item.css("padding-top", this.itemsContainer.outerHeight() + (item.hasClass("e-activetop") ? 0 : (this.model.enableRTL ? 4 : 3)) + "px");
                    $(this.contentPanels).css({"border-top": "none", "width": ej.getDimension(this.element, "width") - 1 + "px" });
                    this.itemsContainer.css("border-bottom", "1px solid #bbbcbb");
                }
                if (this.model.headerPosition == "bottom") {
                    $(this.contentPanels).css({ "position": "relative", "width": ej.getDimension(this.element, "width") - 1 + "px", "border-bottom": "none" });
                    this.itemsContainer.css("border-top", "1px solid #bbbcbb");
                    $(this.contentPanels).css({ "border-top": "" });
                }

                var rigtVaule = parseInt(widthValue - (this.scrollPanelWidth + this.scrollstep - 1));
                if (this.model.enableRTL && (this.model.headerPosition == "top" || this.model.headerPosition == "bottom")) {
                    this.itemsContainer.css("clip", "rect(0px," + widthValue + "px,100px," + rigtVaule + "px)");
                }
                else if (this.model.headerPosition == "left") {
                    if (this._tabContentsHeight() > Number(this.model.height.split("px")[0])) {
                        this.itemsContainer.css({ "height": ((parseInt(this.itemsContainer.css("height")) + (parseInt(this.items.css("height")) * this.items.length)) + 30) + "px", "position": "absolute", "border-right": "1px solid #bbbcbb", "background": "white" });
                        $(this.contentPanels).css("padding-left", this.itemsContainer.width() + 5 + "px");
                        if (this.model.enableRTL)
                            this.itemsContainer.css("margin-right", (ej.getDimension(this.element, "width") - this.itemsContainer.width()));
                        if (this._beforeWidth == 0 || this._beforeWidth < this.scrollPanelHeight)
                            this.itemsContainer.css("clip", "rect(0px," + (this.itemsContainer.width() + 4) + "px," + this.scrollPanelHeight + "px," + (this.scrollstep) + "px)");
                        else {
                            if (this._beforeWidth > this.scrollPanelHeight) {
                                this.itemsContainer.css({
                                    "clip": "rect(" + ((this.items[this.selectedItemIndex()].offsetTop - this.scrollPanelHeight) * 2) + "px," + (this.itemsContainer.width() + 2) + "px," + (this.items[this.selectedItemIndex()].offsetTop * 2 - this.scrollPanelHeight) + "px,0px)",
                                    "margin-top": "-" + ((this.items[this.selectedItemIndex()].offsetTop - this.scrollPanelHeight) * 2) + "px"
                                });
                            }
                        }

                        this.element.removeClass("e-scrolltab");
                    }
                }
                else if (this.model.headerPosition == "right") {
                    if (this._tabContentsHeight() > Number(this.model.height.split("px")[0])) {
                        this.itemsContainer.css({ "height": ((parseInt(this.itemsContainer.css("height")) + (parseInt(this.items.css("height")) * this.items.length)) + 30) + "px", "position": "absolute", "margin-left": "-1px", "right": 0 + Number(this.element.css("padding-left").split("px")[0]) + "px" }).css("z-index", "12")
                        $(this.contentPanels).css({ "position": "absolute", "width": ej.getDimension(this.element, "width")-this.itemsContainer.outerWidth() + "px", "height": ej.getDimension(this.element, "height") + "px", "border-right": "none" });
                        this.itemsContainer.css("border-left", "1px solid #bbbcbb");
                        if (this.model.enableRTL)
                            this.itemsContainer.css("margin-right", "-" + (this.itemsContainer.width() + 1) + "px");
                        if (this._beforeWidth == 0 || this._beforeWidth < this.scrollPanelHeight)
                            this.itemsContainer.css("clip", "rect(0px," + this.itemsContainer.width() + 2 + "px," + this.scrollPanelHeight + "px," + (this.scrollstep) + "px)");
                        else {
                            if (this._beforeWidth > this.scrollPanelHeight) {
                                this.itemsContainer.css({
                                    "clip": "rect(" + ((this.items[this.selectedItemIndex()].offsetTop - this.scrollPanelHeight) * 2) + "px," + (this.itemsContainer.width() + 2) + "px," + (this.items[this.selectedItemIndex()].offsetTop * 2 - this.scrollPanelHeight) + "px,0px)",
                                    "margin-top": "-" + ((this.items[this.selectedItemIndex()].offsetTop - this.scrollPanelHeight) * 2) + "px"
                                });
                            }
                        }
                        this.element.removeClass("e-scrolltab");
                    }
                    if(this.model.enableRTL){
                        this.itemsContainer.css({ "height": ((parseInt(this.itemsContainer.css("height")) + (parseInt(this.items.css("height")) * this.items.length)) + 30) + "px", "position": "absolute", "margin-left": "-1px", "right": this.itemsContainer.width() + Number(this.element.css("padding-right").split("px")[0]) + "px" }).css("z-index", "12")
                        $(this.contentPanels).css({ "position": "absolute", "width": ej.getDimension(this.element, "width")-this.itemsContainer.outerWidth() + "px", "left": this.element.css("padding-left"), "height": ej.getDimension(this.element, "height") + "px", "border-right": "none", "left": 0 + Number(this.element.css("padding-right").split("px")[0]) + "px"});
                    }
                }
                else {
                    if (this._beforeWidth == 0 || this._beforeWidth < this.scrollPanelWidth) {
                        this.itemsContainer.css({ "clip": "rect(0px," + (this.scrollPanelWidth + this.scrollstep) + "px,100px," + (this.scrollstep) + "px)", "margin-left": "-" + this.scrollstep + "px" });
                    }
                    else {
                        if (this._beforeWidth > this.scrollPanelWidth) {
                            this.itemsContainer.css({ "clip": "rect(0px," + (this.items[this.selectedItemIndex()].offsetLeft * 2 - this.scrollPanelWidth) + "px,100px," + ((this.items[this.selectedItemIndex()].offsetLeft - this.scrollPanelWidth) * 2) + "px)", "margin-left": "-" + ((this.items[this.selectedItemIndex()].offsetLeft - this.scrollPanelWidth) * 2) + "px" });
                        }
                    }
                }
                this.element.find(".e-icon.e-chevron-circle-left").length && this.element.find(".e-icon.e-chevron-circle-left").css("display", "none");
                this._initialClip = this.itemsContainer.css("clip");
            }
        },
        _executeForwardScrolling: function (args , scrollStep) {
			var tabScrollStep= (scrollStep) ? scrollStep :(args.type=='swiperight'||args.type=='swipeleft')? 50: 30;
            if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                if (!this.model.enableRTL) {
                    var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[1].replace(",", ""));
                    var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[3].replace(",", ""));
                    var scrollValue = Number(this._rightScrollIcon.css("margin-right").split("px")[0]);
                    this.itemsContainer.css({ "clip": "rect(0px," + (ClipValue1 + tabScrollStep) + "px,100px," + (ClipValue2 + tabScrollStep) + "px)", "margin-left": "-" + (ClipValue2 + tabScrollStep) + "px" });
					if(args.type=='swipeleft' && Math.abs(Number((this.itemsContainer.css('margin-left')).split("px")[0])) >= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))
					   this._off(this.items, "swipeleft", this._tabSwipe);
					if ((this._leftScrollIcon && this._leftScrollIcon.css("margin-left")) && (Number(this.itemsContainer.css("margin-left").split("px")[0].replace("-", "")) >= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))) {
                        this._rightScrollIcon.css("display", "none"); 
						this._off(this.items, "swipeleft", this._tabSwipe);
                    }

                }
                else {
                    var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[1].replace(",", ""));
                    var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[3].replace(",", ""));
                    var itemsMargin = this.itemsContainer.css("margin-right") ? Number(this.itemsContainer.css("margin-right").split("px")[0].replace(",", "")) : 0;
                    var scrollValue = Number(this._rightScrollIcon.css("margin-left").split("px")[0]);
                    var RightScroll = this._leftScrollIcon && this._leftScrollIcon.css("margin-right") ? Number(this._leftScrollIcon.css("margin-right").split("px")[0]) : "";
                    this.itemsContainer.css({ "clip": "rect(0px," + (ClipValue1 - tabScrollStep) + "px,100px," + (ClipValue2 - tabScrollStep) + "px)", "margin-right": "-" + (-itemsMargin + tabScrollStep) + "px" });
                    this._rightScrollIcon.css("margin-left", (scrollValue - tabScrollStep) + "px");
                    this._leftScrollIcon ? this._leftScrollIcon.css("margin-right", (RightScroll + tabScrollStep) + "px") : "";
					 if(args.type=='swipeleft' && Math.abs(Number((this.itemsContainer.css('margin-right')).split("px")[0])) >= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))
					   this._off(this.items, "swipeleft", this._tabSwipe);
                    if (this._leftScrollIcon && this._leftScrollIcon.css("margin-right") && (Number(this.itemsContainer.css("margin-right").split("px")[0].replace("-", ""))) >= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))
                        this._rightScrollIcon.css("display", "none")

                }

            }
            else if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[0].replace(",", "").split("(")[1]);
                var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[2].replace(",", ""));
                var scrollValue = Number(this._rightScrollIcon.css("margin-top").split("px")[0].replace(",", ""));
                var RightTop = this._leftScrollIcon && this._leftScrollIcon.css("margin-top") ? Number(this._leftScrollIcon.css("margin-top").split("px")[0]) : 0;
                var MarginTop = this.itemsContainer.css("margin-top") ? Number(this.itemsContainer.css("margin-top").split("px")[0]) : 0;
                this.itemsContainer.css({ "clip": "rect(" + (ClipValue1 + tabScrollStep) + "px, " + (this.itemsContainer.width() + 4) + "px," + (ClipValue2 + tabScrollStep) + "px, 0px)", "margin-top": "-" + (-MarginTop + tabScrollStep) + "px" });
                if (ClipValue2 > (this._tabContentsHeight() - 20)) {
                    this.itemsContainer.css({ "clip": "rect(" + (this._tabContentsHeight() - Number(this.model.height) + 2) + "px, " + (this.itemsContainer.width() + 4) + "px, " + (this._tabContentsHeight() + 2) + "px, 0px", "margin-top": "-" + (this._tabContentsHeight() - Number(this.model.height) + 2) + "px" })
                    this._rightScrollIcon.css("display", "none");
                }
            }
        },
        _executeBackwardScrolling: function ( args , scrollStep ) {
            if (this._rightScrollIcon != "") this._rightScrollIcon.css("display", "block");
			var tabScrollStep= (scrollStep) ? scrollStep :(args.type=='swiperight'||args.type=='swipeleft')? 50: 30;
            if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") {
                if (!this.model.enableRTL) {
                    var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[1].replace(",", ""));
                    var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[3].replace(",", ""));
                    var scrollValue = Number(this._rightScrollIcon.css("margin-right").split("px")[0]);
                    this.itemsContainer.css({ "clip": "rect(0px," + (ClipValue1 - tabScrollStep) + "px,100px," + (ClipValue2 - tabScrollStep) + "px)", "margin-left": "-" + (ClipValue2 - tabScrollStep) + "px" });
                    if (ClipValue2 - tabScrollStep < 0) {
                        this.itemsContainer.css({ "clip": "rect(0px," + ej.getDimension(this.element, "width") + "px,100px, 0px", "margin-left": "0px" });
                        this._rightScrollIcon.css("margin-right", this.itemsContainer.width() - ej.getDimension(this.element, "width") + 20 + "px");
                    }
					if(args.type=='swiperight' && Math.abs(Number((this.itemsContainer.css('margin-left')).split("px")[0])) <= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))
						this._on(this.items, "swipeleft", this._tabSwipe);
                    if (ClipValue2 <= tabScrollStep && this._leftScrollIcon)
                        this._leftScrollIcon.css("display", "none");
                }
                else {
                    var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[1].replace(",", ""));
                    var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[3].replace(",", ""));
                    var itemsMargin = Number(this.itemsContainer.css("margin-right").split("px")[0]) ? Number(this.itemsContainer.css("margin-right").split("px")[0]) : 0;
                    var RightScroll = this._leftScrollIcon && this._leftScrollIcon.css("margin-right") ? Number(this._leftScrollIcon.css("margin-right").split("px")[0]) : "";
                    var scrollValue = Number(this._rightScrollIcon.css("margin-left").split("px")[0]);
                    this.itemsContainer.css({ "clip": "rect(0px," + (ClipValue1 + tabScrollStep) + "px,100px," + (ClipValue2 + tabScrollStep) + "px)", "margin-right": "-" + (-itemsMargin - tabScrollStep) + "px" });
                    this._rightScrollIcon.css("margin-left", (scrollValue + tabScrollStep) + "px");
                    this._leftScrollIcon ? this._leftScrollIcon.css("margin-right", (RightScroll - tabScrollStep) + "px") : "";
					if(args.type=='swiperight' && Math.abs(Number((this.itemsContainer.css('margin-right')).split("px")[0])) <= (this._tabContentsWidth() - ej.getDimension(this.element, "width")))
						this._on(this.items, "swipeleft", this._tabSwipe);
                    if (itemsMargin >= -tabScrollStep && this._leftScrollIcon) {
                        this._leftScrollIcon.css("display", "none");
                    }
                }
            }

            else if (this.model.headerPosition == "left" || this.model.headerPosition == "right") {
                var ClipValue1 = Number(this.itemsContainer.css("clip").split("px")[0].replace(",", "").split("(")[1]);
                var ClipValue2 = Number(this.itemsContainer.css("clip").split("px")[2].replace(",", ""));
                var scrollValue = Number(this._rightScrollIcon.css("margin-top").split("px")[0]);
                var RightTop = this._leftScrollIcon.css("margin-top") ? Number(this._leftScrollIcon.css("margin-top").split("px")[0]) : 0;
                var MarginTop = this.itemsContainer.css("margin-top") ? Number(this.itemsContainer.css("margin-top").split("px")[0]) : 0;
                this.itemsContainer.css({ "clip": "rect(" + (ClipValue1 - tabScrollStep) + "px, " + this.itemsContainer.width() + "px," + (ClipValue2 - tabScrollStep) + "px, 0px)", "margin-top": "-" + (-MarginTop - tabScrollStep) + "px" });
                if (Number(this.itemsContainer.css("clip").split("px")[0].split("(")[1]) <= 0) {
                    this.itemsContainer.css({ "clip": "rect( 0px, " + this.itemsContainer.width() + "px," + (Number(this.model.height)) + "px, 0px)", "margin-top": "0px" });
                    this._leftScrollIcon.css("display", "none");
                }
            }
        },

        _removeHeaderClass: function () {
            this.itemsContainer.remove();
            this.itemsContainer.insertBefore(this.element.find(">div").first());
            this.items.removeClass("e-bottom-line e-top-line");
            $(this.contentPanels).removeClass("e-content-bottom e-activetop e-activebottom");
            this.itemsContainer.removeClass("e-header e-left e-right");
        },

        _removeVerticalClass: function () {
            this.element.removeClass("e-vertical");
            this.itemsContainer.removeClass("e-left e-right").removeAttr("style");
        },


        _removeBaseClass: function () {
            this.element.removeClass("e-tab e-widget e-corner e-js e-tabscroll").removeAttr("role tabindex unselectable");
            if ((this.model.headerPosition == "left" || this.model.headerPosition == "right"))
                this._removeVerticalClass();
            this.itemsContainer.removeClass("e-header e-box e-clearall e-select e-addborderbottom e-addbordertop e-addborderleft e-addborderright");
            this.anchors.removeClass("e-link");
            this.items.removeClass("e-select e-item e-active e-bottom-line e-top-line e-margine-top e-margine-bottom e-rtl-top-line e-top-hover e-rtl-bottom-line e-disable").removeAttr("role tabindex aria-selected aria-expanded");
            $(this.contentPanels).removeClass("e-content  e-content-item e-box e-content-bottom e-activetop e-activebottom e-active-content e-hidebottom e-addborderbottom e-hidetop e-addbordertop e-hideleft e-addborderleft e-hideright e-addborderright e-disable").removeAttr("role aria-hidden").css("display", "");
            this.element.find("div.e-close.e-tabdelete,div.e-icon.e-chevron-circle-right,div.e-icon.e-chevron-circle-left,div.e-icon.e-reload").remove();
        },


        _addContentTag: function (href, index) {
            var id = this._getTabId(href);
            var panel = this.element.find("#" + id);
            if (!panel.length) {
                panel = ej.buildTag("div.e-content  e-content-item e-box e-content-bottom #" + id)
                    .insertAfter(this.contentPanels[index - 1] || this.itemsContainer);
            }
            this.contentPanels.splice(index, 0, panel[0]);
        },

        _roundedCorner: function (value) {
            if (value) {
                this.element.addClass('e-corner');
            }
            else if (this.element.hasClass('e-corner')) {
                this.element.removeClass('e-corner');
            }
        },


        _setTabsHeightStyle: function (heightFormat) {
            if (ej.Tab.HeightAdjustMode.Content != heightFormat) $(this.contentPanels).height("");
            if (ej.Tab.HeightAdjustMode.Fill == heightFormat) {
                if (ej.Tab.Position.Left === this.model.headerPosition || ej.Tab.Position.Right === this.model.headerPosition) {
                    $(this.contentPanels).css("height", "100vh");
                }
                this._contentPaneSize();
            }
            else if (ej.Tab.HeightAdjustMode.Auto == heightFormat) {
                var maxHeight = 0;
                $(this.contentPanels).css({ "display": "none" }).addClass('e-active-content');
                for (var i = 0; i < this.contentPanels.length; i++) {
                    maxHeight = Math.max(maxHeight, this._getDimension($(this.contentPanels[i]), "outerHeight"));
                }
                $(this.contentPanels).removeClass('e-active-content');
                $(this.contentPanels).height(maxHeight);
                this.maxAutoHeight = maxHeight;
                this.showItem(this.selectedItemIndex());
            }
            else if (ej.Tab.HeightAdjustMode.None == heightFormat) {
                if (this.model.height != null) {
                    this._contentPaneSize();
                }
            }
            if (ej.Tab.HeightAdjustMode.Fill !== heightFormat) $(this.itemsContainer).height("");
            if (ej.Tab.HeightAdjustMode.Content == heightFormat)
                $(this.contentPanels).height("auto");

            if (this.model.enableTabScroll && (this.model.headerPosition == "left" || this.model.headerPosition == "right")) {
                $(this.contentPanels).css("height", this.model.height + "px");
            }

        },
        _getDimension: function (element, method) {
            var value;
            var $hidden = $(element).parents().addBack().filter(':hidden');
            var prop = { visibility: 'hidden', display: 'block' };
            var hiddenCollection = [];
            $hidden.each(function () {
                var hidden = {}, name;
                for (name in prop) {
                    hidden[name] = this.style[name];
                    this.style[name] = prop[name];
                }
                hiddenCollection.push(hidden);
            });
            value = /(outer)/g.test(method) ?
            $(element)[method](true) :
           $(element)[method]();

            $hidden.each(function (i) {
                var hidden = hiddenCollection[i], name;
                for (name in prop) {
                    this.style[name] = hidden[name];
                }
            });
            return value;
        },
        // Tab to active given index value
        showItem: function (index) {
            if ($.inArray(index, this.model.disabledItemIndex) < 0) {
                var proxy = this;
                if (this._isInteraction != false) this._isInteraction = true;
                this._preTabSelectedIndex = this.selectedItemIndex();
                this.selectedItemIndex(index);
                if (this.selectedItemIndex() >= this.contentPanels.length) {
                    this.selectedItemIndex(0);
                    index = this.selectedItemIndex();
                }
                if (index >= 0 && !this.initialRender && true === this._onBeforeActive(index)){
                    this.selectedItemIndex(this._preTabSelectedIndex);
                    return false;
                } 
                else this._preTabIndex = this._preTabSelectedIndex;
                $(this.items[this.selectedItemIndex()]).attr("aria-expanded", true).attr("aria-selected", true).attr("tabindex", 0);
                if (this.selectedItemIndex() != null && this.selectedItemIndex() < this.contentPanels.length) {
                    this._ajaxLoad();
                    this.hideItem(this._preTabIndex);
                    $(this.contentPanels[this.selectedItemIndex()]).fadeIn(this.model.enableAnimation ? 20 : 0, function () {
                        if (!proxy.initialRender && proxy._onActive())
                            return true;
                        proxy.initialRender = false;
                    });
                    if (!(this.model.headerPosition == "left" || this.model.headerPosition == "right")) {
                        var activeClass = this.model.headerPosition == ej.Tab.Position.Top ? "e-activetop" : "e-activebottom";
                        $(this.contentPanels[this.selectedItemIndex()]).addClass(activeClass)
                    }
                    else
                        $(this.contentPanels[this.selectedItemIndex()]).addClass("e-active-content ");
                    $(this.items[this.selectedItemIndex()]).addClass("e-active").removeClass("e-select");
                    $(this.items[this.selectedItemIndex()]).removeClass("e-margine-top e-margine-bottom");

                    for (var i = 0; i <= $(this.items).length; i++) {
                        if ($(this.items[i]).hasClass("e-select")) {
                            if (this.model.headerPosition == "right") {
                                $(this.items[i]).removeClass("e-margine-top e-margine-bottom");
                            }
                            if (this.model.headerPosition == "left") {
                                $(this.items[i]).removeClass("e-margine-top e-margine-bottom");
                            }
                            if (this.model.headerPosition == "top") {
                                if (!this.element.hasClass("e-tab-collapsed"))
                                    $(this.items[i]).addClass("e-margine-top");
                                else
                                    $(this.items[i]).removeClass("e-margine-top");
                                $(this.items[i]).removeClass("e-margine-bottom");
                            }
                            if (this.model.headerPosition == "bottom") {
                                $(this.items[i]).removeClass("e-margine-top");
                                $(this.items[i]).addClass("e-margine-bottom");
                            }
                        }
                    }
                    $(this.contentPanels[this.selectedItemIndex()]).addClass("e-active-content").removeAttr("aria-hidden", false);
                }
            }
            if (this.model.enableTabScroll && this._tabContentsWidth() > (this.model.width || this.element.width()) && this.itemsContainer.find("li").length && (this.model.headerPosition == "top" || this.model.headerPosition == "bottom")) {
                if (!this.model.enableRTL) {
                    var itemPosition = Number(this.itemsContainer.find("li.e-active").position().left.toFixed(0)) + this.itemsContainer.find("li.e-active").width() - ej.getDimension(this.element, "width");
                    if ((itemPosition > 0) && (Number(this.itemsContainer.find("li.e-active").offset().left.toFixed(0)) + this.itemsContainer.find("li.e-active").width() > ej.getDimension(this.element, "width") || (Number(this.itemsContainer.find("li.e-active").offset().left.toFixed(0)) - this.itemsContainer.find("li.e-active").width() < 0))) {
                        this.itemsContainer.css("clip", "rect(0 ," + (ej.getDimension(this.element, "width") + (itemPosition + 10)) + "px, 100px," + (itemPosition + 10) + "px)").css("margin-left", "-" + (itemPosition + 10) + "px")
                        this._rightScrollIcon ? this._rightScrollIcon.css("margin-right", (this.itemsContainer.width() - ej.getDimension(this.element, "width") + 10 - itemPosition) + "px").css("display", "block") : "";
                        this._addScrollBackIcon();
                        if ((this._leftScrollIcon && this._leftScrollIcon.css("margin-left")) && (Number(this.itemsContainer.css("margin-left").split("px")[0].replace("-", "")) >= (this._tabContentsWidth() - ej.getDimension(this.element, "width"))) && ((Number(this.itemsContainer.find("li.e-active").offset().left.toFixed(0)) - this.itemsContainer.find("li.e-active").width() < 0))) {
                        this._rightScrollIcon.css("display", "none"); 
						this._off(this.items, "swipeleft", this._tabSwipe);
                    }else
                        this._leftScrollIcon ? this._leftScrollIcon.css("display", "block") : "";
                        this._rightScrollIcon ? this._rightScrollIcon.css("display", "none") : "";
                    }
                }
            }
            else if (this.model.enableTabScroll && this.model.height && (this.model.headerPosition == "left" || this.model.headerPosition == "right") && !this.model.enableRTL) {
                var itemPosition = Number(this.itemsContainer.find("li.e-active").position().top.toFixed(0)) + this.itemsContainer.find("li.e-active").height() - Number(this.model.height);
                if ((itemPosition > 0) && (Number(this.itemsContainer.find("li.e-active").offset().top.toFixed(0)) + this.itemsContainer.find("li.e-active").height() > Number(this.model.height) || (Number(this.itemsContainer.find("li.e-active").offset().top.toFixed(0)) - this.itemsContainer.find("li.e-active").height() < 0))) {
                    this.itemsContainer.css("clip", "rect(" + itemPosition + "px," + (this.itemsContainer.outerWidth() + 2) + "px, " + (Number(this.model.height) + itemPosition) + "px, 0px").css("margin-top", "-" + itemPosition + "px");
                    this._addScrollBackIcon();
                }
            }

        },

        hideItem: function (index) {
            $(this.contentPanels[index]).fadeOut(0);
            if (!(this.model.headerPosition == "left" || this.model.headerPosition == "right"))
                var activeClass = this.model.headerPosition == ej.Tab.Position.Top ? "e-activetop" : "e-activebottom";
            $(this.items[index]).removeClass("e-active").addClass("e-select");
            $(this.contentPanels[index]).removeClass("e-active-content " + activeClass).attr("aria-hidden", true);
        },


        _ajaxLoad: function () {
            var content = $(this.contentPanels[this.selectedItemIndex()]);
            var link = this.anchors[this.selectedItemIndex()];
            var href = $(link).attr("href");
            if (content.is(':empty') && href.indexOf("#") !== 0)
                this._sendAjaxOptions(content, link);
        },


        _getTabId: function (href) {
            return !href.indexOf("#") ? href.replace("#", "") : this.model.idPrefix + this._getNextTabId();
        },

        _getNextTabId: function () {
            return ++this.tabId;
        },


        _disableTabs: function () {
            for (var i = 0, li; (li = this.items[i]) ; i++) {
                if ($.inArray(i, this.model.disabledItemIndex) > -1) {
                    $(li).find("a").off(this.model.events);
                    $(li).find("div.e-close").off("click");
                }
                $(li)[$.inArray(i, this.model.disabledItemIndex) != -1 &&
                    !$(li).hasClass("e-tab-selected") ? "addClass" : "removeClass"]("e-disable");
                $(this.contentPanels[i])[$.inArray(i, this.model.disabledItemIndex) != -1 &&
                    !$(this.contentPanels[i]).hasClass("e-tab-selected") ? "addClass" : "removeClass"]("e-disable");
            }
        },


        _tabItemClick: function (args) {

            if (this.model.enabled) {
                args.preventDefault(); // Prevent the ancher tag url action
                var index;
                if (this.selectedItemIndex() == $(this.items).index($(args.currentTarget)) && this.model.collapsible) {
                    index = -1; $(this.element).addClass("e-tab-collapsed");
                }
                else {
                    index = $(this.items).index($(args.currentTarget));
                }
                if (index != this.selectedItemIndex())
                    this.showItem(index);
                $(this.element).removeClass("e-tab-collapsed");               
				if(this.selectedItemIndex() > -1 && this.contentPanels != 0 && this.model.enableRTL)
				    $(this.element).height(this.itemsContainer.height()+parseInt($(this.contentPanels[this.selectedItemIndex()]).css("height")));
            }
        },

        _tabDeleteClick: function (args) {
            if (this.model.enabled) {
                var currentTab = $(args.target);
                var tabWidth = $(args.target).parent().width();
                if (currentTab.hasClass("e-close"))
                    var index = $(this.items).index($(args.target).parent());
                if (index == this.selectedItemIndex() && this.items.length > index)
                    this.selectedItemIndex(this.selectedItemIndex() + 1)
                var itemsMargin = Number(this.itemsContainer.css("margin-right").split("px")[0]) ? Number(this.itemsContainer.css("margin-right").split("px")[0]) : 0;
                if(this.model.enableTabScroll && (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") && ( this._leftScrollIcon || this._rightScrollIcon )) {
                     if(!this.model.enableRTL || (this.model.enableRTL && itemsMargin < -tabWidth )) this._executeBackwardScrolling(args,tabWidth);
                     else {
                         this.itemsContainer.css({"margin-right":"0px","clip":this._initialClip});
                         this._leftScrollIcon && this._leftScrollIcon.css("display", "none");
                         this._rightScrollIcon && this._rightScrollIcon.css("display", "none");
                     }	 
                }
                this.removeItem(index);
                if(this.model.enableTabScroll && (this.model.headerPosition == "top" || this.model.headerPosition == "bottom") && ( this._leftScrollIcon || this._rightScrollIcon ) && !this.model.enableRTL) {
                    this._removeScroll();
                    var itemswidth = 0;
                    for(var i = 0; i< this.items.length; i++){
                        itemswidth += $(this.items[i]).width(); 
                    }
                    if(this.scrollPanelWidth <= itemswidth){
                        this._addScroll();
                    }
                }
            }
        },
        _tabScrollClick: function (args) {
            if (this.model.enabled) {
                if ((this._rightScrollIcon[0] == args.target)) {
                    this._executeForwardScrolling(args);

                    this._addScrollBackIcon();
                    this._leftScrollIcon.css("display", "block");
                }
            }
        },
		
		_tabSwipe: function(e){ 
			 if(e.type=='swipeleft')  
			this._executeForwardScrolling(e);
			else 
			this._executeBackwardScrolling(e);
		},
        _tabScrollBackClick: function (args) { 
            if (this.model.enabled) {
                if ((this._leftScrollIcon[0] == args.target)) {
                    this._executeBackwardScrolling(args);
                }
            }
        },

        _tabReloadClick: function (args) {
            if (this.model.enabled) {
                var currentTab = $(args.target);
                if (currentTab.hasClass("e-reload")) {
                    var link = this.anchors[this.selectedItemIndex()];
                    var href = $(link).attr("href");
                    var content = $(this.contentPanels[this.selectedItemIndex()]);
                    if (href.indexOf("#") !== 0)
                        this._sendAjaxOptions(content, link);
                    else
                        this.showItem(this.selectedItemIndex());
                }
            }
        },


        _sendAjaxOptions: function (content, link) {
            //load waiting popup
            if (this._onBeforeLoad(link))
                return true;
            content.addClass("e-load");
            var proxy = this;
            var curTabTitle = $(link).html();
            var hrefLink = link.href.replace("#", "");
            var ajaxOptions = {
                type: this.model.ajaxSettings.type, cache: this.model.ajaxSettings.cache, url: hrefLink, data: this.model.ajaxSettings.data,
                dataType: this.model.ajaxSettings.dataType, contentType: this.model.ajaxSettings.contentType, async: this.model.ajaxSettings.async,
                "success": function (data) {
                    try {
                        proxy._ajaxSuccessHandler(data, content, link, curTabTitle);
                    } catch (e) {

                    }
                }, "error": function () {
                    try {
                        proxy._ajaxErrorHandler(link, proxy.selectedItemIndex(), curTabTitle);
                    } catch (e) {

                    }
                }
            };
            this._sendAjaxRequest(ajaxOptions);
        },

        _sendAjaxRequest: function (ajaxOptions) {
            $.ajax({
                type: ajaxOptions.type,
                cache: ajaxOptions.cache,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                contentType: ajaxOptions.contentType,
                async: ajaxOptions.async,
                success: ajaxOptions.success,
                error: ajaxOptions.error,
                beforeSend: ajaxOptions.beforeSend,
                complete: ajaxOptions.complete
            });
        },


        _ajaxSuccessHandler: function (data, content, link, curTabTitle) {
            if (curTabTitle != null)
                $(link).html(curTabTitle);
            content.removeClass("e-load");
            content.html(data).addClass("e-tab-loaded"); //to indicate the content is already loaded
            var eventData = { data: data, url: link, content: content };
            this._trigger("ajaxSuccess", eventData);
            if (this._onLoad(link))
                return true;
        },


        _ajaxErrorHandler: function (data, link, index, title) {
            this._trigger("ajaxError", { data: data, url: link });
            this._onLoad(link);
        },

        _createContentPanel: function (id) {
            return $('<div></div>')
				.attr("id", id)
				.addClass("e-content  e-content-item e-content-bottom e-box");
        },


        _refresh: function () {
            this._unWireEvents();
            this.itemsContainer.removeAttr("style class");
            $(this.contentPanels).removeAttr("style class");
            this.element.css("margin-left", "");
            this._removeVerticalClass();
            this._removeHeaderClass();
            this._initialize();
        },

        _keyPress: function (e) {
            if (this.model.enabled) {
                var index, currentEle, targetEle = $(e.target),code;
                if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
                else if (e.which) code = e.which; // ns4 and opera
                else code = e.charCode;
                if (targetEle.hasClass("e-link") || targetEle.hasClass("e-item")) {
                    switch (code) {
                        case 39:
                        case 40:
                            {
                                e.preventDefault();
								var index = [];
								for(var i=0; i<this.getItemsCount();i++) {
									if($.inArray(i,this.model.hiddenItemIndex) < 0)
									{
										index.push(i);
									}
								}
								var tabIndex = $.inArray(this.selectedItemIndex(),index);
								tabIndex==index.length-1?this.showItem(index[0]): this.showItem(index[tabIndex+1]);
                                break;
                            }
                        case 37:
                        case 38:
                            {
                                e.preventDefault();
								var index = [];
								for(var i=0; i<this.getItemsCount();i++) {
									if($.inArray(i,this.model.hiddenItemIndex) < 0)
									{
										index.push(i);
									}
								}
								var tabIndex = $.inArray(this.selectedItemIndex(),index);
								tabIndex==0 ? this.showItem(index[index.length-1]) : this.showItem(index[tabIndex-1]);
                                break;
                            }
                        case 35:
                            {
                                e.preventDefault();
                                this.showItem(this.getItemsCount() - 1);
                                break;
                            }
                        case 36:
                            {
                                e.preventDefault();
                                this.showItem(0);
                                break;
                            }
                        case 13:
                            {
                                e.preventDefault();
                                this.showItem(this.selectedItemIndex());
                                break;
                            }
                    }
                }
                else if (e.ctrlKey && !targetEle.hasClass("e-tab")) {
                    switch (code) {
                        case 38:
                            e.preventDefault();
                            index = $(this.contentPanels).index(targetEle.parent(".e-content"));
                            currentEle = $(this.items[index]);
                            break;
                        case 33:
                            e.preventDefault();
                            currentEle = $(this.items[0]);
                            this.showItem(0);
                            break;
                        case 34:
                            e.preventDefault();
                            currentEle = $(this._headers[this.getItemsCount() - 1]);
                            this.showItem(this.getItemsCount() - 1);
                            break;
                    }
                }
                if (!ej.isNullOrUndefined(currentEle)) {
                    currentEle.addClass("e-focus");
                    currentEle.focus();
                }
            }
        },

        _hoverHandler: function (args) {
            args.preventDefault();
            if (this.model.enabled) {
                var index = $(this.items).index($(args.target).parent());
                if (index == -1)
                    index = $(this.items).index($(args.target));
				if((this.model.showCloseButton || this.model.showReloadIcon) && !$(this.items[index]).hasClass("e-disable")){
                args.type === "mouseout" ? $(this.element.find("div.e-tabdelete")[index]).css("visibility", "hidden") : $(this.element.find("div.e-tabdelete")[index]).css("visibility", "visible");
				args.type === "mouseout" ? $(this.element.find("div.e-reload")[index]).css("visibility", "hidden") : $(this.element.find("div.e-reload")[index]).css("visibility", "visible");
				}
                args.type === "mouseout" ? $(this.element.find("div.e-chevron-circle-right")).css("visibility", "hidden") : $(this.element.find("div.e-chevron-circle-right")).css("visibility", "visible");
                args.type === "mouseout" ? $(this.element.find("div.e-chevron-circle-left")).css("visibility", "hidden") : $(this.element.find("div.e-chevron-circle-left")).css("visibility", "visible");
            }
        },


        _wireEvents: function (event) {
            this._on(this.items, event, this._tabItemClick);
            this._on(this.itemsContainer, "mouseover", this._hoverHandler);
            this._on(this.itemsContainer, "mouseout", this._hoverHandler);
            this._on(this.element.find(">ul").eq(0).find(">li div.e-close"), "click", this._tabDeleteClick);
            this._on(this.element.find("div.e-chevron-circle-left"), "click", this._tabScrollBackClick);
			if (this.model.enableTabScroll)this._on(this.items, "swipeleft swiperight", this._tabSwipe);
            this._on(this.itemsContainer, "focusin", this._focusIn);
            this._on(this.itemsContainer, "focusout", this._focusOut);
            $(window).on('resize', $.proxy(this._resize, this));
            this._on(this.element.find(">ul").eq(0).find(">li div.e-reload"), "click", this._tabReloadClick);
			this._resizeEvents(this.model.heightAdjustMode);
        },
        _resize: function () {
            if (this.model && this.model.width == null && this.model.enableTabScroll && (this.model.headerPosition == "top" || this.model.headerPosition == "bottom")) {
                this._removeScroll()
                this._addScroll()
            }
        },


        _unWireEvents: function () {
            this._off(this.items, this.model.events);
            this._off(this.element.find(">ul").eq(0).find(">li div.e-close"), "click");
            this._off(this.element.find("div.e-chevron-circle-right"), "click");
            this._off(this.element.find("div.e-chevron-circle-left"), "click");
			if (this.model.enableTabScroll)this._off(this.items, "swipeleft swiperight", this._tabSwipe);
            this._off(this.itemsContainer, "mouseover", this._hoverHandler);
            this._off(this.itemsContainer, "mouseout", this._hoverHandler);
            this._off(this.element.find("div.e-chevron-circle-left"), "mouseover", this._hoverHandler);
            this._off(this.element.find("div.e-chevron-circle-right"), "mouseover", this._hoverHandler);
            this._off(this.element.find("div.e-chevron-circle-left"), "mouseout", this._hoverHandler);
            this._off(this.element.find("div.e-chevron-circle-right"), "mouseout", this._hoverHandler);
            this._off(this.itemsContainer, "focusin", this._focusIn);
            this._off(this.itemsContainer, "focusout", this._focusOut);
            this._off(this.element.find(">ul").eq(0).find(">li div.e-reload"), "click");
            this._resizeEvents();
        },
        _resizeEvents: function (value) {
            if (value === "fill") $(window).on('resize', $.proxy(this._windowResized, this));
            else $(window).off('resize', $.proxy(this._windowResized, this));
        },


        _windowResized: function (e) {
            var maxHeight = this._getDimension($(this.element).parent(), "height");
            if (this._prevSize == maxHeight) return;
            else this._contentPaneSize();
            this._prevSize = maxHeight;
            if (!this.model.width && this.model.enableTabScroll)
                this._addScroll();
        },
        _contentPaneSize: function () {
            if (this.model.height != null && this.model.heightAdjustMode == "none") {
                $(this.element).height(this.model.height);
                var maxHeight = this._getDimension($(this.element), "height");
            }
            else var maxHeight = this._getDimension($(this.element).parent(), "height");
            $(this.contentPanels).height("");
            $(this.element).parent().css({ "overflow": "auto" });
            if (this.model.headerPosition === "top" || this.model.headerPosition === "bottom")
                maxHeight -= this._getDimension($(this.itemsContainer), "outerHeight");
            var maxPadding = 0, padding;
            for (var i = 0; i < this.contentPanels.length; i++) {
                if ($(this.contentPanels[i]).hasClass("e-active-content")) {
                    padding = Math.max(maxPadding, this._getDimension($(this.contentPanels[i]), "outerHeight") - this._getDimension($(this.contentPanels[i]), "height"));
                    if (this.model.height != null && this.model.heightAdjustMode == "none") $(this.contentPanels[i]).outerHeight(maxHeight).css({ "overflow": "auto" })
                    else $(this.contentPanels[i]).height(maxHeight - padding).css({ "overflow": "auto" });
                } else {
                    maxPadding = Math.max(maxPadding, this._getDimension($(this.contentPanels[i]), "outerHeight") - this._getDimension($(this.contentPanels[i]), "height"));
                    if (this.model.height != null && this.model.heightAdjustMode == "none") $(this.contentPanels[i]).outerHeight(maxHeight).css({ "overflow": "auto" })
                    else $(this.contentPanels[i]).height(maxHeight - maxPadding).css({ "overflow": "auto" });
                }
            }
        },
        _disableItems: function (indexes) {
            if (!this.model.enabled) return false;
            if (indexes != null) {
                for (var i = 0; i < indexes.length; i++) {
                    if ($.inArray(indexes[i], this.model.disabledItemIndex) == -1)
                        this.model.disabledItemIndex.push(indexes[i]);
                }
                this.model.disabledItemIndex.sort();
                this._disableTabs();
            }
        },

        _enableItems: function (indexes) {
            if (!this.model.enabled) return false;
            for (var i = 0; i < indexes.length; i++) {
                var index = indexes[i];
                this.model.disabledItemIndex = $.grep(this.model.disabledItemIndex, function (n, i) {
                    return n != index;
                });
            }
            this._disableTabs();
        },


        disable: function () {
            var indexes = [];
            for (var index = 0; index < this.getItemsCount() ; index++) {
                indexes.push(index);
            }
            this._disableItems(indexes);
            this.model.enabledItemIndex = [];
            this._unWireEvents();
        },

        enable: function () {
            var indexes = [];
            this.model.disabledItemIndex = [];
            for (var index = 0; index < this.getItemsCount() ; index++) {
                if ($.inArray(index, this.model.enabledItemIndex) < 0) {
                    this.model.enabledItemIndex.push(index);
                    indexes.push(index);
                }
                this._enableItems(index);
            }
        },

        getItemsCount: function () {
            if (this.items) {
                return this.items.length;
            }
        },

        addItem: function (url, displayLabel, index, cssClass, id) {
            (index >= 0 && index < this.items.length) ? this._addItemIndex = index : this._addItemIndex = this.items.length;
            for (var disable_index = 0; disable_index < this.model.disabledItemIndex.length; disable_index++) {
                if (this.model.disabledItemIndex[disable_index] >= index)
                    this.model.disabledItemIndex[disable_index]++;
            }
            if (this.model.headerPosition == "left") {
                this.items.length >= 0 && this.itemsContainer.addClass("e-left");
            }
            else if (this.model.headerPosition == "right") {
                this.items.length >= 0 && this.itemsContainer.addClass("e-right");
            }
            else
                this.items.length == 0 && this.itemsContainer.addClass("e-header");
            var liTag = ej.buildTag("li.e-select e-item");
            if ((this.model.headerPosition == "top"))
                if (this.model.enableRTL)
                    $(liTag).addClass("e-rtl-top-line e-top-hover");
                else
                    $(liTag).addClass("e-bottom-line");
            if (!ej.isNullOrUndefined(cssClass)) {
                var span = ej.buildTag('span').addClass(cssClass);
                liTag.append(span);
            }
            if (index === undefined && displayLabel === undefined && url != null)
                displayLabel = "Item";
            if (index === undefined && displayLabel === undefined && id === undefined) {
                url = "#Item" + this.items.length;
                displayLabel = "Item"
            }
            if (id != undefined) {
                if (id.indexOf("#") != 0)
                    id = "#" + id;
                this.divId = id;
            }
            else if (url != undefined)
                id = url;
            var aTag = ej.buildTag("a", displayLabel, {}, { href: url });
            aTag.addClass("e-link");
            if (this.model.headerPosition == "top" || this.model.headerPosition == "bottom")
                aTag.appendTo(liTag);
            if (this.model.showCloseButton) {
                var deleteIcon = ej.buildTag('div.e-icon e-close e-tabdelete', "", {}, {}).css("visibility", "hidden");
                liTag.append(deleteIcon);
                this._on(deleteIcon, "click", this._tabDeleteClick);
            }
            if (this.model.headerPosition == "left" || this.model.headerPosition == "right")
                aTag.appendTo(liTag);
            if (index === undefined) {
                index = this.anchors.length;
            }
            var insertIndex = index >= this.items.length;
            if (insertIndex) {
                liTag.appendTo(this.itemsContainer);
            } else {
                liTag.insertBefore(this.items[index]);
            }
            if (!ej.isNullOrUndefined(this.model.headerSize))
                this._setHeaderSize(this.model.headerSize);
            if (this.selectedItemIndex() == index) {
                this.hideItem[index];
                this.selectedItemIndex(this.selectedItemIndex() + 1);
            } else {
                this.hideItem[index];
                if (index < this.selectedItemIndex())
                    this.selectedItemIndex(this.selectedItemIndex() + 1);
            }
            this._itemsRefreshing();
            this._reinitialize(true);
            if (this.model.headerPosition == "top")
                $(this.contentPanels[index]).addClass("e-hidebottom");
            if (this.model.headerPosition == "bottom") {
                $(this.contentPanels[index]).addClass("e-hidetop");
                liTag.addClass("e-top-line e-item e-select e-margine-bottom")
            }
            if (this.model.headerPosition == "left")
                $(this.contentPanels[index]).addClass("e-hideleft");
            if (this.model.headerPosition == "right")
                $(this.contentPanels[index]).addClass("e-hideright");
            var data = {
                tabHeader: this.anchors[index],
                tabContent: this.contentPanels[index]
            };
            this.refreshTabScroll();
            this._addItemIndex = null;
            this._onAdd(data);
            if (this.model.showReloadIcon) {
                var reloadIcon = ej.buildTag('div.e-icon e-reload', "", {}, { role: "presentation" }).css("visibility", "hidden");
                $(this.element.find("li")[index]).append(reloadIcon)
            }
            if (this.model.enableTabScroll && this.model.headerPosition == "right") {
                $(this.contentPanels).css("height", this.model.height + "px");
            }
			this._setTabsHeightStyle(this.model.heightAdjustMode);
        },

        _isSizeExceeded: function () {
            var eleWidth = this.element.width(), itemsWidth = 0;
            var tabcount = this.items.length;
            for (var tabVal = 0; tabVal < tabcount; tabVal++) {
                var tabWidth = $(this.items[tabVal]).width();
                itemsWidth += tabWidth;
            }
            return (itemsWidth > eleWidth ? true : false);
        },

        refreshTabScroll: function () {
            if (this._isSizeExceeded()) {
                this.element.find("div.e-chevron-circle-right").length >= 1 && this.element.find("div.e-chevron-circle-right").remove();
                if (this.model.enableTabScroll) {
                    this._checkScroll();
                    this._addScrollIcon();
                }
            }
            else {
                if (((this.model.headerPosition == "left" || this.model.headerPosition == "right") && this._tabContentsHeight() > (this.element.width() || Number(this.model.height))) || ((this.model.headerPosition == "top" || this.model.headerPosition == "bottom") && (this.itemsContainer.width() > (this.element.outerWidth()))))
                    this._checkScroll();
            }
        },

        removeItem: function (index) {
            if (!this.model.enabled) return false;
            if (index != null && index > -1 && index < this.items.length) {
                if (this._onBrforeRemove({ index: index }) === true)
                    return false;
                var removedTab = $(this.items[index]).remove();
                this.model.disabledItemIndex = [];
                if (removedTab.hasClass("e-active")) {
                    index == 0 ? this.selectedItemIndex(index + 1) : this.selectedItemIndex(index - 1);
                    this.showItem(this.selectedItemIndex());
                }
                $(this.element.find(">div.e-content")[index]).remove();
                this.contentPanels.splice(index, 1);
                index < this.selectedItemIndex() ? this.selectedItemIndex(this.selectedItemIndex() - 1) : this.selectedItemIndex();

                if (index < 0 || index >= this.anchors.length) {
                    this.selectedItemIndex(0);
                }
                if ((this.model.headerPosition == "left" || this.model.headerPosition == "right") && this.items.length == 1)
                    this._removeVerticalClass();
                else
                    this.items.length == 1 && this.itemsContainer.removeClass("e-header");
                this._unWireEvents();
                this._itemsRefreshing();
                this._wireEvents(this.model.events);
                if (this.model.enableTabScroll)
                    this._on(this.element.find("div.e-chevron-circle-right"), "click", this._tabScrollClick);
                for (var indx = 0; indx < this.items.length; indx++)
                    if ($(this.items[indx]).hasClass('e-disable'))
                        this.model.disabledItemIndex.push(indx);
                this._disableTabs();
                var data = {
                    removedTab: removedTab
                };
                this._onRemove(data);
            }
            if (this.getItemsCount() == 0) {
                this.itemsContainer.removeAttr("style")
                this.itemsContainer.find("div").remove()
            }
            if (this._tabContentsHeight() < Number(this.model.height) && this.itemsContainer.css("clip").split("px").length && this.model.enableTabScroll && (this.model.headerPosition == "left" || this.model.headerPosition == "right")) {
                this._refresh();
                this.itemsContainer.removeAttr("style");
                this._leftScrollIcon ? this._leftScrollIcon.remove() : "";
                this._rightScrollIcon ? this._rightScrollIcon.remove() : "";
            }
            else if (this.model.enableTabScroll && (this.model.headerPosition == "left" || this.model.headerPosition == "right")) {
                if (this._leftScrollIcon && Number(this.itemsContainer.css("clip").split("px")[0].replace(",", "").split("(")[1]) != -(Number(this._leftScrollIcon.css("margin-top").split("px")[0]))) {
                    this._removeScroll();
                    this._addScroll();
                } else
                    this.refreshTabScroll();
                this.showItem(this.selectedItemIndex())
            }

        },

        show: function () {
            if (!this.model.enabled) return false;
            this.element.css("visibility", "visible");
        },

        hide: function () {
            if (!this.model.enabled) return false;
            this.element.css("visibility", "hidden");
        },

        _onBeforeLoad: function (link) {
            var data;
            if (this.selectedItemIndex() == -1 && this.model.collapsible)
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: null, activeIndex: null, url: link, isInteraction: this._isInteraction };
            else
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: this.items[this.selectedItemIndex()], activeIndex: this.selectedItemIndex(), url: link, isInteraction: this._isInteraction };
            return this._trigger("ajaxBeforeLoad", data);
        },

        _focusIn: function () {
            if (!this.model.readOnly && this.model.allowKeyboardNavigation)
                $(this.element).on("keydown", $.proxy(this._keyPress, this));
        },

        _focusOut: function (e) {
            $(this.element).off("keydown", $.proxy(this._keyPress, this));
        },

        _onLoad: function (link) {
            var data;
            if (this.selectedItemIndex() == -1 && this.model.collapsible)
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: null, activeIndex: null, url: link, isInteraction: this._isInteraction };
            else
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: this.items[this.selectedItemIndex()], activeIndex: this.selectedItemIndex(), url: link, isInteraction: this._isInteraction };
            return this._trigger("ajaxLoad", data);
        },

        _onActive: function () {
            var data;
            if (this.selectedItemIndex() == -1 && this.model.collapsible)
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: null, activeIndex: null, isInteraction: this._isInteraction };
            else
                data = { prevActiveHeader: this.items[this._preTabIndex], prevActiveIndex: this._preTabIndex, activeHeader: this.items[this.selectedItemIndex()], activeIndex: this.selectedItemIndex(), isInteraction: this._isInteraction };
            this._isInteraction = true;
            return this._trigger("itemActive", data);

        },

        _onBeforeActive: function (index) {
            if (this.model.beforeActive != null) {
                var data;
                if (this.selectedItemIndex() == -1 && this.model.collapsible)
                    data = { prevActiveHeader: this.items[this._preTabSelectedIndex], prevActiveIndex: this._preTabSelectedIndex, activeHeader: null, activeIndex: null, isInteraction: this._isInteraction };
                else
                    data = { prevActiveHeader: this.items[this._preTabSelectedIndex], prevActiveIndex: this._preTabSelectedIndex, activeHeader: this.items[index], activeIndex: index, isInteraction: this._isInteraction };
                return this._trigger("beforeActive", data);
            }
        },

        _onAdd: function (data) {
            return this._trigger("itemAdd", data);
        },

        _onRemove: function (data) {
            return this._trigger("itemRemove", data);
        },

        _onBrforeRemove: function (data) {
            return this._trigger("beforeItemRemove", data);
        }
    });

    ej.Tab.HeightAdjustMode = {
        /**  Panel height adjusts based on the content */
        Content: "content",
        /**  All panel height will be set the tallest panel height. */
        Auto: "auto",
        /**  Content panel take based on the parent height. */
        Fill: "fill",
        /**  Content panel take based on the height property. */
        None: "none"
    };

    ej.Tab.Position = {
        /**  Tab headers display to top position. */
        Top: "top",
        /**  Tab headers display to bottom position. */
        Bottom: "bottom",
        /**  Tab headers display to left position. */
        Left: "left",
        /** Tab headers display to right position. */
        Right: "right"
    };

})(jQuery, Syncfusion);