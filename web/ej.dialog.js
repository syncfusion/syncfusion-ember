
/**
* @fileOverview Plugin to style the Dialog control
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejDialog", "ej.Dialog", {
        _rootCSS: "e-dialog",

        element: null,
        _ignoreOnPersist: ["drag", "dragStart", "dragStop", "resizeStop", "resizeStart", "resize", "beforeClose", "beforeOpen", "collapse", "expand", "close", "open", "destroy", "create", "ajaxSuccess", "ajaxError", "contentLoad", "actionButtonClick", "enableResize"],

        model: null,
        validTags: ["div", "span"],
        _setFirst: false,
        angular: {
            terminal: false
        },

        defaults: {

            showOnInit: true,

            closeOnEscape: true,

            //currently we have deprecated this API
            closeIconTooltip: "close",

            enableAnimation: true,

            allowDraggable: true,

            backgroundScroll: true,

            height: "auto",

            minHeight: 120,

            minWidth: 200,

            maxHeight: null,

            maxWidth: null,

            enableModal: false,

            position: { X: "", Y: "" },

            containment: null,

            enableResize: true,

            htmlAttributes: {},

            showHeader: true,

            showFooter: false,

            contentType: null,

            contentUrl: null,

            ajaxSettings: {

                type: 'GET',

                cache: false,

                data: {},

                dataType: "html",

                contentType: "html",

                async: true
            },

            title: "",

            width: 400,

            zIndex: 1000,

            cssClass: "",

            enableRTL: false,

            allowKeyboardNavigation: true,

            showRoundedCorner: false,

            actionButtons: ["close"],

            animation:{
                show:{
                    effect:"fade",
                    duration:400
                },
                hide:{
                    effect:"fade",
                    duration:400
                }
            },            

            tooltip:{
                close: "Close",
                collapse: "Collapse",
                restore: "Restore",
                maximize: "Maximize",
                minimize: "Minimize",
                expand: "Expand",
                unPin: "UnPin",
                pin: "Pin"
            },

            footerTemplateId: null,
            
            locale:"en-US",
            
            faviconCSS: null,

            content: null,

            target: null,

            enablePersistence: false,

            enabled: true,

            isResponsive: false,

            actionButtonClick: null,

            beforeClose: null,

            close: null,            

            expand: null,

            collapse: null,

            beforeOpen: null,

            open: null,

            drag: null,

            dragStart: null,

            dragStop: null,

            resize: null,

            resizeStart: null,

            resizeStop: null,

            contentLoad: null,

            ajaxSuccess: null,

            ajaxError: null,

            create: null,

            destroy: null,

            /*Deprecated*/            
            Close:null
        },

        dataTypes: {
            showOnInit: "boolean",
            closeOnEscape: "boolean",
            enableAnimation: "boolean",
            backgroundScroll: "boolean",
            position: "data",
            animation:"data",
            closeIconTooltip: "string",
            tooltip: "data",
            allowDraggable: "boolean",
            enableModal: "boolean",
            enableResize: "boolean",
            isResponsive: "boolean",
            showHeader: "boolean",
            showFooter: "boolean",
            title: "string",
            faviconCSS:"string",
            zIndex: "number",
            cssClass: "string",
            enablePersistence: "boolean",
            contentUrl: "string",
            contentType: "string",
            enableRTL: "boolean",
            enabled: "boolean",
            allowKeyboardNavigation: "boolean",
            showRoundedCorner: "boolean",
            locale: "string",
            htmlAttributes: "data",
            ajaxSettings: "data",
            actionButtons: "array",
			footerTemplateId: "string"
        },

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "closeIconTooltip": this._dialogClose.attr("title", options[key]); break;
                    case "tooltip": this._tooltipText(options[key]); break;
                    case "title":
                        this.model.title = options[key];
                        if (this._ejDialog.find("span.e-title").length <= 0) 
                            this._addTitleText();
                        else
                            this._ejDialog.find("span.e-title").html(options[key]);
                        this._updateCaptionWidth();
                        break;
                    case "width": this.model.width = options[key]; this._changeSize(); this._updateCaptionWidth(); options[key] = this.model.width; break;
                    case "height": this.model.height = options[key]; this._changeSize(); options[key] = this.model.height; break;
                    case "position": this.model.position = options[key]; this._dialogPosition(); break;
                    case "cssClass": this._changeSkin(options[key]); break;
                    case "showRoundedCorner": this.model.showRoundedCorner=options[key]; this._roundedCorner(options[key]); break;
                    case "contentType": { this.model.contentType = options[key]; this._appendContent(options[key]); break; }
                    case "enabled": { this.model.enabled = options[key]; this._enabledAction(options[key]); break; }
                    case "contentUrl": { this.model.contentUrl = options[key]; this._appendContent(this.model.contentType); break; }
					case "backgroundScroll":
						this.model.backgroundScroll = options[key]; 
						if (!this.model.backgroundScroll && this.model.enableModal) $("body").addClass("e-dialog-modal");
						else $("body").removeClass("e-dialog-modal");
						break;
                    case "content":
                    case "target": 
                        this._ejDialog.appendTo($(options[key]));
                        this.model.target = this.model.content = options[key];
                        this._dialogPosition();
                        break;
                    case "containment":
                        this._setDragArea(options[key]);
                        !ej.isNullOrUndefined(this._target) ? this._ejDialog.appendTo(this._target) : this._ejDialog.appendTo(document.body);
                        this.model.position.X = this.model.position.Y = "";
                        this._dialogPosition();
                        this.model.containment = options[key] = this._target;
                        this.model.enableModal && this._createOverlay();
                        this._dialogTitlebar.ejDraggable({ dragArea: this._target });
                        break;
                    case "locale":
					    this.model.locale = options[key];
                        this.localizedLabels = this._getLocalizedLabels(); 
                        this._setLocaleCulture(this.localizedLabels, true);
                        this._tooltipText(this.model.tooltip);
						if (this._ejDialog.find("span.e-title").length <= 0) 
                            this._addTitleText();
                        else
                            this._ejDialog.find("span.e-title").html(this.model.title);
                        this._updateCaptionWidth();                       				
                        break;
                    case "minHeight": { this.model.minHeight = options[key]; this._ejDialog.css("minHeight", options[key]); this._minMaxValidation(); this._resetScroller(); this._resizeDialog(); break; }
                    case "minWidth": { this.model.minWidth = options[key]; this._ejDialog.css("minWidth", options[key]); this._minMaxValidation(); this._resetScroller(); this._resizeDialog(); break; }
                    case "maxHeight": { this.model.maxHeight = options[key]; this._ejDialog.css("maxHeight", options[key]); this._minMaxValidation(); this._resetScroller(); this._resizeDialog(); break; }
                    case "maxWidth": { this.model.maxWidth = options[key]; this._ejDialog.css("maxWidth", options[key]); this._minMaxValidation(); this._resetScroller(); this._resizeDialog(); break; }
                    case "zIndex": { this._ejDialog.css('z-index', options[key]); break; }
                    case "faviconCSS":
                        this.model.faviconCSS = options[key]; this._favIcon();this._updateCaptionWidth(); break;
                    case "isResponsive": {
                        this.model.isResponsive = options[key];
                        this.model.isResponsive ? this._ejDialog.addClass("e-dialog-resize") : this._ejDialog.removeClass("e-dialog-resize");
                        this._wireResizing();
                        break;
                    }
                    case "allowDraggable": {
                        this.model.allowDraggable = options[key];
                        if (options[key])
                            this._enableDrag();
                        else {
                            this._dialogTitlebar.removeClass("e-draggable");
                        }
                        break;
                    }
                    case "enableResize": {
                        this.model.enableResize = options[key];
                        if (options[key])
                            this._enableResize();
                        else {
                            this._ejDialog.removeClass("e-resizable");
                            this._ejDialog.find(".e-resize-handle").remove();
                        }
                        this._reRenderScroller();
                        break;
                    }
                    case "showHeader": {
                        this.model.showHeader = options[key];
                        if (options[key]) {
                            this._renderTitleBar();
                            this._iconsRender(this.model.actionButtons);
                            if (this.model.faviconCSS) { this._dialogFavIcon = false; this._favIcon(); }
                            this._enableDrag();
                            if (!this._maximize) this._updateScroller((!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? (this._ejDialog.outerHeight(true) - (this._dialogTitlebar.outerHeight(true))) : this._ejDialog.outerHeight(true) - 1 - (this._dialogTitlebar.outerHeight(true)), (!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? this._ejDialog.width() : this._ejDialog.width() - 2);
                        }
                        else {
                            this._ejDialog.find(".e-titlebar").remove();
                            this._maximize ? this.refresh() : this._updateScroller((!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? this._ejDialog.outerHeight(true) : this._ejDialog.outerHeight(true) - 1, (!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? this._ejDialog.width() : this._ejDialog.width() - 2);
                        }
                        this._roundedCorner(this.model.showRoundedCorner);
                        if (this.model.showFooter) this._setContainerSize()._resetScroller();
                        break;
                    }
                    case "showFooter": {
                        this.model.showFooter = options[key];
                        if (options[key]) {
                            this._appendContent();
                            this._ejDialog.find(".e-resizable").remove();
                        }
                        else 
                            this._ejDialog.find(".e-footerbar").remove();
                        this._enableResize()._enableDrag()._sizeInPercent();
                        this._reRenderScroller();
                        this._setContainerSize()._resetScroller();
                        this._roundedCorner(this.model.showRoundedCorner);
                        break;
                    }
                    case "footerTemplateId": {
                        this.model.footerTemplateId = options[key];
                        if (this.model.showFooter) {
                            this._ejDialog.find(".e-footerbar").empty();
                            var templateContent = $('body').find("#" + this.model.footerTemplateId).html();
                            this._dialogFooterbar.append(templateContent);
                            this._enableResize();
                        }
                        break;
                    }
                    case "enableRTL":
                        {
                            this.model.enableRTL = options[key];
                            if (this.model.faviconCSS) this._favIcon();
                            if (options[key]) {
                                this._ejDialog.addClass("e-rtl");
                                this.iframe && this.iframe.contents().find("body").css("direction", "rtl");
                                if (this.scroller) 
                                    this._resetScroller();
                            } else {
                                this._ejDialog.removeClass("e-rtl");
                                this.iframe && this.iframe.contents().find("body").css("direction", "ltr");
                                if (this.scroller) 
                                    this._resetScroller();
                            }
                            break;
                        }
                    case "actionButtons":
                        {
                            if (!ej.isNullOrUndefined(this._dialogTitlebar) ){
                                this._removeAllIcons();
                                this._iconsRender(options[key]);
                            }
                            this.model.actionButtons = options[key];
                            this._updateCaptionWidth();
                            break;
                        }
                    case "enableModal": {
                        this._enableModal(options[key]);
                        break;
                    }
                    case "htmlAttributes": this._addAttr(options[key]); break;
                }
            }
        },


        _destroy: function () {
            if (this._overLay) this._overLay.remove();
            this._cloneElement.appendTo(this._ejDialog.parent());
            this._ejDialog.remove();
            if (this.model.enableAnimation) this._ejDialog.stop();
            this._cloneElement.removeClass("e-dialog");
            this.element = this._cloneElement;
            this._isOpen = false;
            $(window).off("resize", $.proxy(this._reSizeHandler, this));
        },

        keyConfigs: [37, 38, 39, 40],

        _init: function () {
			this._init=true;
            this._widthPercent = null;
            this._heightPercent = null;
            this._windowSize = { outerWidth: $(window).outerWidth(), outerHeight: $(window).outerHeight() };
            this._initSize = { width: this.model.width, height: this.model.height };
            this._sizeType = { width: isNaN(this.model.width) ? this.model.width.match(/px|%|auto/g)[0] : null, height: isNaN(this.model.height) ? this.model.height.match(/px|%|auto/g)[0] : null };
            this._isOpen = this._maximize = this._minimize = false;
            this.localizedLabels = this._getLocalizedLabels(); 
            this._setLocaleCulture(this.localizedLabels);
            this._setDimension();
            if (!this.model.close) this.model.close = this.model.Close;
            if (!this.model.target) this.model.target = this.model.content;
			this._responsive();
            this._renderControl();
            this._wireEvents();    
            this.scrObj= this._ejDialog.closest(".e-dialog.e-js").data("ejDialog")
            if(this.scrObj) this.scrObj._resetScroller(); 
			this.hidden=false;			
            this._init=false;
            this._keyNavigation=false;	
        },
		
		_responsive: function () {
            this.width = this.model.width;
            $(this.element).width(this.width);

            this.height = this.model.height;
            $(this.element).height(this.height);
            $(window).on("resize", $.proxy(this._resizeHandler, this));
        },
        
        _resizeHandler: function () {
            if (this._maximize) {
                this.width = $(this._dialogTitlebar).outerWidth();
                $(this.contentDiv).width(this.width);
                $(this.contentDiv).children().width(this.width);

                this.model.height = this.height = $(window).height();
                this._ejDialog.css({ height: this.height });
                this.contentDiv.height(this._ejDialog.height() - $(this._dialogTitlebar).outerHeight() - $(this._dialogFooterbar).outerHeight());
                this.element.height(this.contentDiv.height());
            }
			if(!ej.isNullOrUndefined(this.element) && !this._collapsible) this._resetScroller();
        },
       
        _setLocaleCulture:function(localizedLabels, isSetModel){
            //Deprecated closeIconTooltip locale
            if(this.defaults.closeIconTooltip===this.model.closeIconTooltip)
                this.model.closeIconTooltip=localizedLabels.closeIconTooltip;
			
                if (isSetModel) {	
                 	 this.model.tooltip= this.localizedLabels.tooltip ;
                     this.model.title= this.localizedLabels.title;			 
				} 
				if(JSON.stringify(this.model.tooltip) === JSON.stringify(this.defaults.tooltip))
                this.model.tooltip=localizedLabels.tooltip;  				
				if(this.model.title === this.defaults.title)
				this.model.title=localizedLabels.title;  
        },

        _setDragArea: function (value) {
            if (!ej.isNullOrUndefined(value))
            {
                if (typeof value == "string") {
                    if (value == "parent") this._target = $(this.element).parent();
                    if (value.toLowerCase() == "document") this._target = $(document);
                    if (value.toLowerCase() == "window") this._target = $(window);
                    else if ($(value).length > 0) this._target = $(value);
                } else if (typeof value == "object") {
                    if (value.length > 0) this._target = value;
                }
                else this._target = null;
            } else this._target = null;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy._ejDialog.addClass(value);
                else if (key == "disabled" && value == "disabled") { proxy.model.enabled = false; proxy._enabledAction(false); }
                else{
					if(proxy._ejDialog[0].hasAttribute("style")){
					 var newValue = proxy._ejDialog[0].getAttribute("style") + value;
					 proxy._ejDialog.attr(key, newValue);
					}					
				} 
            });
        },
        _tooltipText: function(data){
            $.extend(this.model.tooltip, data);
            if(!ej.isNullOrUndefined(this._dialogClose) && this._dialogClose.hasClass('e-close'))
                this._dialogClose.attr("title", this.model.tooltip.close);
            if (!ej.isNullOrUndefined(this._dialogCollapsible) && (data.collapse || data.expand)) {
                if (this._dialogCollapsible.hasClass('e-arrowhead-up'))
                    this._dialogCollapsible.attr("title", this.model.tooltip.collapse);
                if (this._dialogCollapsible.hasClass('e-arrowhead-down'))
                    this._dialogCollapsible.attr("title", this.model.tooltip.expand);
            }
            if (!ej.isNullOrUndefined(this._dialogMaximize) && (data.maximize || data.restore)) {
                if (this._dialogMaximize.hasClass('e-maximize'))
                    this._dialogMaximize.attr("title", this.model.tooltip.maximize);
                if (this._dialogMaximize.hasClass('e-restore'))
                    this._dialogMaximize.attr("title", this.model.tooltip.restore);
            }
            if (!ej.isNullOrUndefined(this._dialogMinimize) && (data.minimize || data.restore)) {
                if (this._dialogMinimize.hasClass('e-minus'))
                    this._dialogMinimize.attr("title", this.model.tooltip.minimize);
                if (this._dialogMinimize.hasClass('e-restore'))
                    this._dialogMinimize.attr("title", this.model.tooltip.restore);
            }
            if (!ej.isNullOrUndefined(this._dialogPin) && (data.pin || data.unPin)) {
                if (this._dialogPin.hasClass('e-unpin'))
                    this._dialogPin.attr("title", this.model.tooltip.pin);
                if (this._dialogPin.hasClass('e-pin'))
                    this._dialogPin.attr("title", this.model.tooltip.unPin);
            }
        },
        _renderControl: function () {
            this._cloneElement = this.element.clone();
            this.element.attr("tabindex", 0).attr({ "role": "dialog", "aria-labelledby": this.element.prop("id") + "_title" });
            this._ejDialog = ej.buildTag("div.e-dialog e-widget e-box " + this.model.cssClass + " e-dialog-wrap e-shadow#" + (this.element.prop("id") == "" ? "" : this.element.prop("id") + "_wrapper"), "", { display: "none", zIndex: this.model.zIndex }, { tabindex: 0 });
            if(this.model.isResponsive) this._ejDialog.addClass("e-dialog-resize");
            this.wrapper = this._ejDialog;
            this._addAttr(this.model.htmlAttributes);
            this._setDragArea(this.model.containment);
            if(!ej.isNullOrUndefined(this.model.containment) && !ej.isNullOrUndefined(this._target)) var target = this._target;                
            else if(!ej.isNullOrUndefined(this.model.target)) var target = this.model.target;
            var wrapperTarget = !ej.isNullOrUndefined(target) ? target : document.body;
            var oldWrapper = $(wrapperTarget).find("#" + this._id + "_wrapper").get(0);
            if (oldWrapper) $(oldWrapper).remove();
            this._ejDialog.appendTo(wrapperTarget);
            if (this.model.enableRTL) this._ejDialog.addClass("e-rtl");
            if (this.model.showHeader) {
                this._renderTitleBar();
                this._iconsRender(this.model.actionButtons);
                if (this.model.faviconCSS) this._favIcon();
            }
            this._appendContent(this.model.contentType);
            this._enableResize()._enableDrag()._setSize();
			if(this.model.height != "auto") this._sizeInPercent();
            if (this.model.contentType != "ajax"){                                                                  
                if (this.model.showOnInit && this.open()) {
                    this._setContainerSize()._resetScroller();
                }
                else this._setHiddenDialogSize();
            }
            this._roundedCorner(this.model.showRoundedCorner);
            this._enabledAction(this.model.enabled);
            if (this._sizeType.width == "auto") this._maxWidth = this.model.width;
            if (this._sizeType.height == "auto") this._maxHeight = this.model.height;
        },

        _setContainerSize: function () {
            if (this.model.height != "auto") {
                var cntHeight = this._ejDialog.outerHeight() - ((this.model.showHeader)? $(this._ejDialog.find("div.e-titlebar")).outerHeight(true) : 0)  + ((this.model.showFooter)? $(this._ejDialog.find("div.e-footerbar")).outerHeight(true) : 0) - 1;
                this.contentDiv.height(cntHeight);
                this.element.outerHeight(cntHeight);
            }
            return this;
        },

        _changeSize: function () {
            this._initSize = { width: this.model.width, height: this.model.height };
            this._sizeType.width = isNaN(this.model.width) ? this.model.width.match(/px|%|auto/g) : null;
            this._sizeType.height = isNaN(this.model.height) ? this.model.height.match(/px|%|auto/g) : null;
            this._setSize()._sizeInPercent()._setContainerSize()._resetScroller();
        },

        _enableDrag: function () {
            if (this.model.allowDraggable && this.model.showHeader) {
                this._dialogTitlebar.addClass("e-draggable");
                this._dragDialog();
            }
            return this;
        },

        _enableResize: function () {
            if (this.model.enableResize) {
                this._ejDialog.addClass("e-resizable");
                var resizeDiv = ej.buildTag("div.e-icon e-resize-handle");
                if (this.model.showFooter) 
                    resizeDiv.appendTo(this._dialogFooterbar);
                else
                    resizeDiv.appendTo(this._ejDialog);
                this._resizeDialog();
            }
            return this;
        },


        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this._ejDialog.removeClass(this.model.cssClass).addClass(skin);
            }
        },
        _enableModal: function (value) {
            if (value) this._isOpen && this._createOverlay();
            else if (this._overLay) this._overLay.remove();
        },

        _enabledAction: function (flag) {
            if (flag) {
                this._ejDialog.removeClass("e-disable");
                this.wrapper.children(".e-disable-overlay").remove();
                if (!ej.isNullOrUndefined(this.scroller))
                    this.scroller.enable();
            }
            else {
                this._ejDialog.addClass("e-disable");
                ej.buildTag("div.e-disable-overlay").appendTo(this.wrapper);
                if (!ej.isNullOrUndefined(this.scroller))
                    this.scroller.disable();
            }
        },

        _renderTitleBar: function () {
            this._elementTitle = this.element.attr("title");
            if (typeof this._elementTitle !== "string")
                this._elementTitle = "";
            this.model.title = this.model.title || this._elementTitle;
            this._dialogTitlebar = ej.buildTag("div#" + this.element.prop("id") + "_title.e-titlebar e-header e-dialog").prependTo(this._ejDialog);
            this._addTitleText();
        },

        _renderFooterBar: function () {
            this._dialogFooterbar = ej.buildTag("div#" + this.element.prop("id") + "_foot.e-footerbar e-dialog e-js").appendTo(this._ejDialog);
        },

        _addTitleText: function () {
            if (this.model.title) 
                this._titleText = ej.buildTag("span.e-title", this.model.title).prependTo(this._dialogTitlebar);
            return this;
        },
        _updateCaptionWidth: function () {
            var addWidth=this.model.faviconCSS && !ej.isNullOrUndefined(this._dialogFavIcon)?this._dialogFavIcon.outerWidth():0;
			if(this._titleText && !ej.isNullOrUndefined(this._dialogTitlebar))
			    this._titleText.css("max-width", (this._dialogTitlebar.width() - 20 - (this._dialogTitlebar.find(".e-dialog-icon").width() * this._dialogTitlebar.find(".e-dialog-icon").length) - addWidth));
			return this;
        },
        _iconsRender: function (iconArray) {
            for (var icon = 0; icon < iconArray.length; icon++) {
                switch ((ej.browserInfo().name == "msie" && ej.browserInfo().version <= 8) ? $.trim(iconArray[icon]) : iconArray[icon].trim()) {
                    case "close": {
                        this._closeIcon();
                        break;
                    }
                    case "collapse":
                    case "collapsible": {
                        this._collapsibleIcon();
                        break;
                    }
                    case "maximize": {
                        this._maximizeIcon();
                        break;
                    }
                    case "minimize": {
                        this._minimizeIcon();
                        break;
                    }
                    case "pin": {
                        this._pinIcon();
                        break;
                    }
                    default: {
                        this._customIconsRender(iconArray[icon]);
                        break;
                    }
                }
            }
        },

        _customIconsRender: function (icon) {
            this._customIcon = ej.util.buildTag("div#" + this.element[0].id + "_" + icon + "button.e-dialog-icon e-icon e-" + icon, null, null).attr('tabIndex', '0').attr('title', icon);
            this._customIcon.appendTo(this._dialogTitlebar);
            this._on(this._customIcon, "touchstart click", this._iconClick);
        },

        _iconClick: function (event) {
            
            if (!this.element.hasClass("e-disable")) {
                var args = {
                    cancel: false,
                    buttonID: $(event.target).attr("id"),
                    event: event.type,
                    model: this.model,
                    currentTarget: event.currentTarget.title
                }
                this._trigger("actionButtonClick", args);
            }
        },

        _removeAllIcons: function () {
            this._dialogTitlebar.find("div.e-dialog-icon").remove();
        },

        _appendContent: function (contentType) {
            this.contentDiv = ej.isNullOrUndefined(this.contentDiv) ? ej.buildTag("div.e-dialog-scroller") : this.contentDiv;
            this.element.removeAttr("title").addClass("e-widget-content e-box");
            var proxy = this;
            if (!ej.isNullOrUndefined(this.model.contentUrl) && !ej.isNullOrUndefined(contentType)) {
                if (contentType == "ajax") {
                    this.model.ajaxSettings.url = this.model.contentUrl;
                    this._sendAjaxOptions(this.element, this.model.ajaxSettings.url);
                }
                else if (contentType == "iframe") {
                    if (this.element.children('.e-iframe').length > 0) {
                        this.iframe = this.element.find('iframe.e-iframe');
                        this.iframe.attr('src', this.model.contentUrl);
                    }
                    else {
                        this.iframe = ej.buildTag("iframe.e-iframe", "", { width: "100%", height:"100%" }, { scrolling: "auto", frameborder: 0, src: this.model.contentUrl });
                        this.element.appendTo(this.contentDiv).append(this.iframe).show();
                    }
                    if (this.model.enableRTL) {
                        $(this.iframe).load(function () {
                            proxy.iframe.contents().find("body").css("direction", "rtl");
                        });
                    }
                    this._trigger("contentLoad", { contentType: contentType, url: this.model.contentUrl });
                }
                else if (contentType == "image") {
                    var img = ej.buildTag("img.e-images", "", "", { src: this.model.contentUrl });
                    this.element.append(img).show().appendTo(this.contentDiv);
                    $(img).on("load", function () {
                        proxy._dialogPosition();
                    });
                    this._trigger("contentLoad", { contentType: contentType, url: this.model.contentUrl });
                }
                else
                    this.element.show().appendTo(this.contentDiv);
            }
            else {
				this.dialogIframeContent = this.element.children().find('iframe').contents()[0];
				if (!ej.isNullOrUndefined(this.dialogIframeContent)) {
				   this.element.show().appendTo(this.contentDiv).find('iframe').append(this.dialogIframeContent.lastChild);
				}
				else
					this.element.show().appendTo(this.contentDiv);
			}
            if (this._ejDialog.find("div.e-resize-handle").length > 0) {
                if (this._ejDialog.find(".e-footerbar").length == 0)
				this.contentDiv.insertBefore(this._ejDialog.find("div.e-resize-handle"));
			}
			else {
				var dialogIframeContent = this.element.children().find('iframe').contents()[0];
				if (!ej.isNullOrUndefined(dialogIframeContent)) {
                    this.contentDiv.appendTo(this._ejDialog);
					var getid = $("#"+this.contentDiv.find('iframe').attr('id'));
					$(getid[0].contentDocument.lastChild).remove();
				    getid[0].contentDocument.appendChild(dialogIframeContent);
					if(ej.browserInfo().name == "mozilla")
					setTimeout(function () {
						$(getid[0].contentDocument.lastChild).remove();
				        getid[0].contentDocument.appendChild(dialogIframeContent);
                    },500);
				}
				else {
					if(this._ejDialog.find(".e-footerbar").length == 0)
					this.contentDiv.appendTo(this._ejDialog);
				    else
                    this.contentDiv.insertBefore(this._dialogFooterbar);
				     }
				}
            if (this.model.showFooter && this._ejDialog.find(".e-footerbar").length == 0) {
                this._renderFooterBar();
                if (this.model.footerTemplateId != null) {
                    var templateContent = $('body').find("#" + this.model.footerTemplateId).html();
                    this._dialogFooterbar.append(templateContent);
                }
            }
        },

        _roundedCorner: function (value) {
            this._ejDialog[(value ? "addClass" : "removeClass")]('e-corner');
            this.contentDiv.removeClass('e-dialog-top e-dialog-bottom e-dialog-content');
            if (this.model.showRoundedCorner) {
                this.model.showHeader && !this.model.showFooter ? this.contentDiv.addClass('e-dialog-bottom') : !this.model.showHeader && this.model.showFooter ? this.contentDiv.addClass('e-dialog-top') : !this.model.showHeader && !this.model.showFooter ? this.contentDiv.addClass('e-dialog-content') : true;
            }
        },

        _reRenderScroller: function () {
            if (this.scroller != undefined) {
                    this.scroller.refresh(true);
                if (!this.model.enableRTL) {
                    if ((this.scroller._vScrollbar && this.scroller._vScrollbar._scrollData) && this.model.enableResize) {
                        if (this.model.showFooter) 
                            var height = this.scroller._vScrollbar.element.find('> div.e-vscroll').height(), padngSpace = 0, resizeHandleSize = 0;
                        else
                            var height = this.scroller._vScrollbar.element.find('> div.e-vscroll').height(), padngSpace = 2, resizeHandleSize = this._ejDialog.find('div.e-resize-handle').outerHeight();
	                    if (Math.floor(this.contentDiv.outerHeight()) === Math.floor(this.scroller._vScrollbar.model.height + 1)) {
                            this.scroller._vScrollbar.model.height -= resizeHandleSize + padngSpace;
                            this.scroller._vScrollbar._scrollData.handle -= resizeHandleSize;
                            this.scroller._vScrollbar._scrollData.handleSpace -= resizeHandleSize + padngSpace;
                            this.scroller._vScrollbar._updateLayout(this.scroller._vScrollbar._scrollData);
                            this.scroller._vScrollbar.element.find('> div.e-vscroll').height(height - resizeHandleSize - padngSpace);
                        }
                    }
                    if (!(this.scroller._vScrollbar && this.scroller._vScrollbar._scrollData) && (this.scroller._hScrollbar && this.scroller._hScrollbar._scrollData) && this.model.enableResize) {
                        if (this.model.showFooter) 
                            var width = this.scroller._hScrollbar.element.find('> div.e-hscroll').width(), padngSpace = 0, resizeHandleSize = 0;
                        else
                            var width = this.scroller._hScrollbar.element.find('> div.e-hscroll').width(), padngSpace = 2, resizeHandleSize = this._ejDialog.find('div.e-resize-handle').outerWidth();
                        this.scroller._hScrollbar.model.width -= resizeHandleSize + padngSpace;
                        this.scroller._hScrollbar._scrollData.handle -= resizeHandleSize + padngSpace;
                        this.scroller._hScrollbar._scrollData.handleSpace -= resizeHandleSize + padngSpace;
                        this.scroller._hScrollbar._updateLayout(this.scroller._hScrollbar._scrollData);
                        this.scroller._hScrollbar.element.find('> div.e-hscroll').width(width - resizeHandleSize - padngSpace);
                    }
                }
            }
        },       

        _dialogMaxZindex: function () {
            var parents = this.element.parents(), bodyEle, contEle,index,cindex;
            bodyEle = $('body').children(), index = bodyEle.index(this.popup);
            bodyEle.splice(index, 1);
            $(bodyEle).each(function (i, ele) { parents.push(ele); });
            contEle = $(this.model.target).children(), cindex = contEle.index(this.popup);
            contEle.splice(cindex, 1);
            $(contEle).each(function (i, ele) { parents.push(ele); });
            var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
            }));
            if (!maxZ || maxZ < 10000) maxZ = 10000;
            else maxZ += 1;
            return maxZ;
        },

        _setZindex: function () {
            var zindex = this._dialogMaxZindex();
            if (this.model.zIndex <= zindex)
                this._ejDialog.css({ zIndex: zindex + 1 });
        },

        _createOverlay: function () {
            var zindex = this._ejDialog.css('zIndex'), target, element, position;
            !ej.isNullOrUndefined(this._overLay) && this._overLay.remove();
            if (!this.model.backgroundScroll) $("body").addClass("e-dialog-modal");
            this._overLay = ej.buildTag("div#" + this.element.attr("id") + "_overLay.e-overlay", "", { zIndex: zindex - 1 });
			$(this._overLay).addClass("e-widget");
            if (!ej.isNullOrUndefined(this.model.containment) && !ej.isNullOrUndefined(this._target)) target = this._target;
            else if (!ej.isNullOrUndefined(this.model.target)) target = this.model.target;
            this._overLay.appendTo(!ej.isNullOrUndefined(target) ? target : document.body);
            var position = !ej.isNullOrUndefined(this.model.containment) && !ej.isNullOrUndefined(this._target) ? "absolute" : "fixed";
            var left =(ej.isNullOrUndefined(target) || position=="fixed") ? 0 : $(target).css('position').toLowerCase() != "static" ? 0 : $(target).offset().left;
            var top = (ej.isNullOrUndefined(target) || position=="fixed") ? 0 : $(target).css('position').toLowerCase() != "static" ? 0 : $(target).offset().top;
            this._overLay.css({ top: top, left: left, position: position });
        },

        _sendAjaxOptions: function (content, link) {
            //load waiting popup
            content.addClass("e-load");
            var proxy = this;
            var curTitle = this.model.title;
            var hrefLink = link;
            var ajaxOptions = {
                "success": function (data) {
                    try { proxy._ajaxSuccessHandler(data, content, link, curTitle); }
                    catch (e) { }
                },
                "error": function (e) {
                    try { proxy._ajaxErrorHandler({ "status": e.status, "responseText": e.responseText, "statusText": e.statusText }, content, link, curTitle); }
                    catch (e) { }
                },
                "complete": function () {
                    try {
                        proxy._setContainerSize();
                        proxy._resetScroller();
                        if (!proxy.model.showOnInit) proxy._setHiddenDialogSize();
                    } catch (e) {}
                }
            };
            $.extend(true, ajaxOptions, this.model.ajaxSettings);
            this._sendAjaxRequest(ajaxOptions);
        },

        _setHiddenDialogSize: function () {
            if (!this._isOpen) {
                this._ejDialog.css({ "display": "block", "visibility": "hidden" });
                this._setContainerSize()._resetScroller();
                this._ejDialog.css({ "display": "none", "visibility": "" });
            }
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

        _ajaxSuccessHandler: function (data, content, link, curTitle) {
            content.removeClass("e-load");
            content.html(data).addClass("e-dialog-loaded").appendTo(this._ejDialog);
            content.appendTo(this.contentDiv);
            this._dialogPosition();
            if (this.model.showOnInit)
                this.open();
            this._trigger("ajaxSuccess", { data: data, url: link });
        },

        _ajaxErrorHandler: function (data, content, link, curTitle) {
            content.addClass("e-dialog-loaded").appendTo(this.contentDiv);
            this._dialogPosition().open();
            this._trigger("ajaxError", { data: data, url: link });
        },
        _closeIcon: function () {
            this._dialogClose = ej.util.buildTag("div#" + this.element[0].id + "_closebutton.e-dialog-icon e-icon e-close",null,null).attr('tabIndex','0');            
            if(this.model.closeIconTooltip == "close" && this.model.tooltip.close == "Close")
                this._dialogClose.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.close);
            else if(this.model.closeIconTooltip != "close" && this.model.tooltip.close == "Close")
                this._dialogClose.appendTo(this._dialogTitlebar).attr("title", this.model.closeIconTooltip);
            else if(this.model.closeIconTooltip == "close" && this.model.tooltip.close != "Close")
                this._dialogClose.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.close);
            else   this._dialogClose.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.close);
            this._on(this._dialogClose, "touchstart click", this._closeClick);
        },
		
        _collapsibleIcon: function () {            
            this._dialogCollapsible = ej.util.buildTag("div#" + this.element[0].id + "_collapsbutton.e-dialog-icon e-icon",null,null).attr('tabIndex','0');             
            if (this._collapsible) {
                this._dialogCollapsible.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.expand).addClass("e-arrowhead-down").removeClass("e-arrowhead-up");
            }
            else {
                this._dialogCollapsible.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.collapse).addClass("e-arrowhead-up").removeClass("e-arrowhead-down");
            }
            this._on(this._dialogCollapsible, "touchstart click", this._collapsibleClick);
        },

        _maximizeIcon: function () {
            this._dialogMaximize = ej.util.buildTag("div#" + this.element[0].id + "_maximizebutton.e-dialog-icon e-icon",null,null).attr('tabIndex','0'); 
            if (this._maximize) {
                this._dialogMaximize.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.restore).addClass("e-restore").removeClass("e-maximize");
            }
            else {
                this._dialogMaximize.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.maximize).addClass("e-maximize").removeClass("e-restore");
            }
            this._on(this._dialogMaximize, "touchstart click", this._maximizeClick);
        },

        _minimizeIcon: function () {
            this._dialogMinimize = ej.util.buildTag("div#" + this.element[0].id + "_minimizebutton.e-dialog-icon e-icon",null,null).attr('tabIndex','0');           
            if (this._minimize) {
                this._dialogMinimize.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.restore).addClass("e-restore").removeClass("e-minus");
            }
            else {
                this._dialogMinimize.appendTo(this._dialogTitlebar).attr("title", this.model.tooltip.minimize).addClass("e-minus").removeClass("e-restore");
            }
            this._on(this._dialogMinimize, "touchstart click", this._minimizeClick);
        },

        _pinIcon: function () {
            this._dialogPin = ej.util.buildTag("div#" + this.element[0].id + "_pinbutton.e-dialog-icon e-icon",null,null).attr('tabIndex','0'); 
            this._dialogPin.appendTo(this._dialogTitlebar).attr("title", this.dialogPin ? this.model.tooltip.unPin : this.model.tooltip.pin).addClass(this.dialogPin ? "e-pin" : "e-unpin").removeClass(this.dialogPin ? "e-unpin" : "e-pin");
            this._on(this._dialogPin, "touchstart click", this._pinClick);
        },

        _favIcon: function () {
            if (!this._dialogFavIcon) {
                this._dialogFavIcon = ej.util.buildTag("div.e-dialog-favicon", "", {}, { style: "float:"+ (this.model.enableRTL?"right":"left") });
                var span = ej.util.buildTag("span.e-dialog-custom", "", {}, { role: "presentation" });
                span.appendTo(this._dialogFavIcon);
                this._dialogFavIcon.appendTo(this._dialogTitlebar);
            }
            else 
                span = this._dialogFavIcon.find("span").removeClass().addClass("e-dialog-custom");
            if (!this.model.faviconCSS) this._dialogFavIcon.remove();
            else span.addClass(this.model.faviconCSS); this._dialogFavIcon.css("float", (this.model.enableRTL ? "right" : "left"));
        },

        _minMaxValidation: function () {
            var _minWidth = parseInt(this.model.minWidth), _minHeight = parseInt(this.model.minHeight), _maxWidth = parseInt(this.model.maxWidth), _maxHeight = parseInt(this.model.maxHeight),_width = parseInt(this.model.width), _height = parseInt(this.model.height), parentObj = this._getParentObj();
            if (isNaN(this.model.minWidth) && (this.model.minWidth.indexOf("%") > 0))
                _minWidth = this._convertPercentageToPixel(parentObj.outerWidth(), _minWidth);
            if (isNaN(this.model.minHeight) && (this.model.minHeight.indexOf("%") > 0))
                _minHeight = this._convertPercentageToPixel(parentObj.outerHeight(), _minHeight);
            if (isNaN(this.model.maxWidth) && (this.model.maxWidth.indexOf("%") > 0))
                _maxWidth = this._convertPercentageToPixel(parentObj.innerWidth(), _maxWidth);
            if (isNaN(this.model.maxHeight) && (this.model.maxHeight.indexOf("%") > 0))
                _maxHeight = this._convertPercentageToPixel(parentObj.innerHeight(), _maxHeight);
			if (isNaN(this.model.width) && (this.model.width.indexOf("%") > 0))
                _width = this._convertPercentageToPixel(parentObj.innerWidth(), _width);
            if (isNaN(this.model.height) && (this.model.height.indexOf("%") > 0))
                _height = this._convertPercentageToPixel(parentObj.innerHeight(), _height);
            if (_maxWidth && _width > _maxWidth || _minWidth && _width < _minWidth) {
                if (_width > _maxWidth) this.model.width = _maxWidth;
                else this.model.width = _minWidth;
            }
            if (_maxHeight && _height >_maxHeight || _minHeight && _height< _minHeight) {
                if (_height > _maxHeight) this.model.height = _maxHeight;
                else this.model.height = _minHeight;
            }
			 
        },

        _setSize: function () {
            var mdl = this.model;
            this._minMaxValidation();
            this._ejDialog.css({ width: mdl.width, minWidth: mdl.minWidth, maxWidth: mdl.maxWidth });
            this._ejDialog.css({ height: mdl.height, minHeight: mdl.minHeight, maxHeight: mdl.maxHeight });
            this._dialogPosition();
            return this;
        },

        _resetScroller: function () {		
			this.element.css({ "height": "auto", "max-width": "", "max-height": "", "width": "" });
            var scrHeight = this._ejDialog.outerHeight(true) - ((this.model.showHeader)? $(this._ejDialog.find("div.e-titlebar")).outerHeight(true) : 0)-((this.model.showFooter)? $(this._ejDialog.find("div.e-footerbar")).outerHeight(true) : 0), eleHeight;
            var scrModel = { width: (this.contentDiv.css('border-width') == "0px" || this.contentDiv.css('border-left-width') == "0px") ? Math.round(this._ejDialog.width()) : Math.round(this._ejDialog.width() - 2), enableRTL: this.model.enableRTL, height: (this.contentDiv.css('border-width') == "0px") ? scrHeight : scrHeight - 1, enableTouchScroll: false }; // 2px border width
            if ((this.model.height == "auto") && (this.element.height() < this.model.maxHeight || !this.model.maxHeight) && !this._maximize)
                scrModel.height = "auto";
            if (this.model.width == "auto" && !this._maximize)
                scrModel.width = this.model.width;
            this.contentDiv.ejScroller(scrModel);
            this.scroller = this.contentDiv.data("ejScroller");
            this._reRenderScroller();
            this._padding = parseInt($(this.element).css("padding-top")) + parseInt($(this.element).css("padding-bottom"));
            if(($(this._ejDialog).css("display"))=="none"){
				  this.hidden=true;         
                  this._ejDialog.css({"display":"block"}); 
			}		
			if (!ej.isNullOrUndefined(this.contentDiv.height()) && this.contentDiv.height() > 0) {
                if (!ej.isNullOrUndefined(this.scroller))
                    if (!this.scroller._hScrollbar && this.scroller._vScrollbar)
                        eleHeight = this.contentDiv.outerHeight();
                    else if (this.scroller._hScrollbar)
                         eleHeight = this.contentDiv.outerHeight() - this.scroller.model.buttonSize;
                     else  eleHeight = this.contentDiv.outerHeight();
                 else
                    eleHeight = this.contentDiv.outerHeight() - this._padding;
                if ((this.model.height != "auto" && this.model.height != "100%"))
                    this.element.css({ "height": eleHeight-1 });
                else
                    this.element.css("height", this.model.height);
                if ((this.model.height == "auto" || this.model.height == "100%") && !this.scroller._vScrollbar)
                    this.element.css({ "min-height": this.model.minHeight -((this.model.showHeader)? $(this._ejDialog.find("div.e-titlebar")).outerHeight(true) : 0)});
                if (!this.scroller._vScrollbar && (this.model.width != "auto" && this.model.width != "100%"))
                    this.element.outerWidth((this.contentDiv.css('border-width') == "0px" || this.contentDiv.css('border-left-width') == "0px") ? this._ejDialog.width() : this._ejDialog.width() - 2);
                else if (!this.scroller._vScrollbar)
                    this.element.css("width", this.model.width);
                this.element.css({"max-width": this.model.maxWidth, "max-height": this.model.maxHeight });
            }
			if(this.hidden) this._ejDialog.css({"display":"none"});					
			this.hidden=false;
        },

        _updateScroller: function (height, width) {
            this.contentDiv.ejScroller({ width: width, height: height, enableRTL: this.model.enableRTL, enableTouchScroll: false });
            this.scroller = this.contentDiv.data("ejScroller");
            this._reRenderScroller();
			this._changeSize();
        },

        _dragDialog: function () {
            var proxy = this;
            var pos = this._ejDialog.parents(".e-dialog-scroller");
            this._dialogTitlebar.ejDraggable({
                handle: ".e-titlebar",
                cursorAt: { top: 0, left: 0 },
                dragArea: proxy._target,
                dragStart: function (event) {
					event.element.attr('aria-grabbed', true);
                    proxy._clickHandler();
                    if (proxy.dialogPin || !proxy.model.allowDraggable || !proxy.model.enabled) {
                        event.cancel = true;
                        return false;
                    }
                    if (proxy._trigger("dragStart", { event: event })) {
                        event.cancel = true;
                        return false;
                    }
                },
                drag: function (event) {
                    proxy._trigger("drag", { event: event });
                },
                dragStop: function (event) {
                    proxy._ejDialog.focus();
					event.element.attr('aria-grabbed', false);
                    if (proxy.element.find("> .e-draggable.e-titlebar")) {
                       var dragobject = $("#" + proxy.element.find("> .e-draggable.e-titlebar").attr("id")).data("ejDraggable");
                        if (dragobject)
                            dragobject.option("cursorAt", proxy.element.offset());
                    }
                    var pos = this.helper.offsetParent().offset();
                    proxy._trigger("dragStop", { event: event });
                    proxy.model.position.X = ej.isNullOrUndefined(this.position.left) ? parseInt(this.helper.css('left')) : this.position.left - [pos.left + parseFloat(this.helper.offsetParent().css('border-left-width'))];
                    proxy.model.position.Y = ej.isNullOrUndefined(this.position.top) ? parseInt(this.helper.css('top')) : this.position.top - [pos.top + parseFloat(this.helper.offsetParent().css('border-top-width'))];
                    proxy._positionChanged = true;
                    proxy.dlgresized = true;
                },
                helper: function (event) {
                    return $(proxy._ejDialog).addClass("dragClone");
                }
            });
            return this;
        },

        _resizeDialog: function () {
            if (!this.model.enableResize)  return;
            var proxy = this, started = false, parentObj;
            var _minWidth = parseInt(this.model.minWidth), _minHeight = parseInt(this.model.minHeight);
            var _maxWidth = parseInt(this.model.maxWidth), _maxHeight = parseInt(this.model.maxHeight);
            parentObj = this._getParentObj();
            if (isNaN(this.model.minWidth) && (this.model.minWidth.indexOf("%") > 0))
                _minWidth = this._convertPercentageToPixel(parentObj.outerWidth(), _minWidth);
            if (isNaN(this.model.minHeight) && (this.model.minHeight.indexOf("%") > 0))
                _minHeight = this._convertPercentageToPixel(parentObj.outerHeight(), _minHeight);
            if (isNaN(this.model.maxWidth) && (this.model.maxWidth.indexOf("%") > 0))
                _maxWidth = this._convertPercentageToPixel(parentObj.innerWidth(), _maxWidth);
            if (isNaN(this.model.maxHeight) && (this.model.maxHeight.indexOf("%") > 0))
                _maxHeight = this._convertPercentageToPixel(parentObj.innerHeight(), _maxHeight);
            this._ejDialog.find("div.e-resize-handle").ejResizable(
                {
                    minHeight: _minHeight,
                    minWidth: _minWidth,
                    maxHeight: _maxHeight,
                    maxWidth: _maxWidth,
                    handle: "e-widget-content",
                    resizeStart: function (event) {
                        proxy.dlgresized=true;
                        if (!proxy.model.enabled)
                            return false;
                        !started && proxy._trigger("resizeStart", { event: event });
                        started = true;
                        proxy.model.position = { X: proxy._ejDialog.css("left"), Y: proxy._ejDialog.css("top") };
                        proxy._dialogPosition();
                    },
                    resize: function (event) {
                        proxy.dlgresized=true;
                        var reElement = $(event.element).parents("div.e-dialog-wrap");
                        proxy.model.height = $(reElement).outerHeight();
                        proxy.model.width = $(reElement).outerWidth();
                        proxy._setSize();
                        proxy._setContainerSize();
                        proxy._resetScroller();
                        proxy._updateCaptionWidth();
                        proxy._trigger("resize", { event: event });
                        proxy._sizeType = { width: "px", height: "px" };
                        if(this.scrObj) this.scrObj._resetScroller();                      
                    },
                    resizeStop: function (event) {
                        proxy.dlgresized=true;
                        proxy._ejDialog.focus();
                        proxy._sizeInPercent();
                        var reElement = $(event.element).parents("div.e-dialog-wrap");
                        proxy.model.height = $(reElement).outerHeight();
                        proxy.model.width = $(reElement).outerWidth();
                        proxy._setSize();
                        proxy._setContainerSize();
                        proxy._resetScroller();
                        started && proxy._trigger("resizeStop", { event: event });
                        started = false;
                        proxy._setDimension();
                    },
                    helper: function (event) {
                        return $(proxy._ejDialog);
                    }
                });
            return this;
        },

        _dialogPosition: function () {
            if (this._ejDialog.parents("form").length > 0 && ej.isNullOrUndefined(this.model.containment) && ej.isNullOrUndefined(this.model.target)) {
                this._ejDialog.appendTo(this._ejDialog.parents("form"));
            }
            if (this.model.position.X != "" || this.model.position.Y != "") {
                this._ejDialog.css("position", "absolute");
                if(ej.isNullOrUndefined(this.model.target) && ej.isNullOrUndefined(this.model.containment)) {
                this._ejDialog.css("left", this.model.position.X);
                this._ejDialog.css("top", this.model.position.Y);
				}
				else {
					  var containerEle=ej.isNullOrUndefined(this.model.containment)?this.model.target:this.model.containment;
					  if (this.dlgresized || this._keyNavigation){
                         this._ejDialog.css("left", this.model.position.X);
                         this._ejDialog.css("top", this.model.position.Y);                   
                                    }
                      else{
                      this._ejDialog.css("left", $(containerEle).offset()["left"]+ parseInt(this.model.position.X));
					  this._ejDialog.css("top", $(containerEle).offset()["top"]+ parseInt(this.model.position.Y));
				}
            }
            }
            else {
                this._centerPosition();
            }
            return this;
        },
        _centerPosition:function(){
            var x = 0, y = 0;
            if (!ej.isNullOrUndefined(this.model.target) ||!ej.isNullOrUndefined(this._target) && !$(this._target).is($(document)) && !($(this._target).is($(window)))) {
                var $content = !ej.isNullOrUndefined(this._target) ? $(this._target) : $(this.model.target);
                if ($content.css("position") == 'static') {
                    var parentOffset = $content.offsetParent().offset();
                    var contentOffset = $content.offset();
                    x = contentOffset.left - parentOffset.left;
                    y = contentOffset.top - parentOffset.top;
                }
                if ($content.outerWidth() > this._ejDialog.width()) x += ($content.outerWidth() - this._ejDialog.width()) / 2;
                if ($content.outerHeight() > this._ejDialog.height()) y += ($content.outerHeight() - this._ejDialog.height()) / 2;
            }
            else {
                var doc = document.documentElement;
                x = (($(window).outerWidth() > this._ejDialog.width()) ? ($(window).outerWidth() - this._ejDialog.outerWidth()) / 2 : 0) + (window.pageXOffset || doc.scrollLeft);
                y = (($(window).outerHeight() > this._ejDialog.height()) ? ($(window).outerHeight() - this._ejDialog.outerHeight()) / 2 : 0) + (window.pageYOffset || doc.scrollTop);
            }
            this._ejDialog.css({ top: y, left: x });
            this._ejDialog.css("position", "absolute");
        },
        _closeClick: function (event) {
			if(event.type == "touchstart")
		    	event.preventDefault();
            if (this.model.enabled) {
                event.stopPropagation();
                this.close(event);
            }
        },

        _collapsibleClick: function (e) {
            if (this.model.enabled) {
                if ($(e.target).hasClass("e-arrowhead-up")) {
                    this._actionCollapse(e);
                }
                else if ($(e.target).hasClass("e-arrowhead-down")) {
                    this._actionExpand(e);
                }
            }
        },
        _actionCollapse: function (e) {
            if (!this._minimize) {
                this._dialogCollapsible&& this._dialogCollapsible.removeClass("e-arrowhead-up").addClass("e-arrowhead-down");
                this._dialogCollapsible && this._dialogCollapsible.attr("title", this.model.tooltip.expand);
                this._ejDialog.find("div.e-resize-handle").hide();
                this._ejDialog.find(".e-widget-content").parent().slideUp("fast");
                if(this.model.showFooter)  this._dialogFooterbar.slideUp("fast");
                this._ejDialog.removeClass("e-shadow");
                this._ejDialog.css("minHeight", "0");
                this._ejDialog.height("auto");
                this._trigger("collapse",{isInteraction :(e ? true : false )});
                this._collapsible = true;
            }
        },
        _actionExpand: function (e) {
            if (!this._minimize) {
                this._dialogCollapsible&& this._dialogCollapsible.removeClass("e-arrowhead-down").addClass("e-arrowhead-up");
                this._dialogCollapsible && this._dialogCollapsible.attr("title", this.model.tooltip.collapse);
                this._ejDialog.addClass("e-shadow");
                this._ejDialog.find(".e-widget-content").parent().slideDown("fast");
                if (this.model.showFooter) this._dialogFooterbar.slideDown("fast");
                if (this._maximize) {
                    this._ejDialog.css({ width: "100%", height: "100%" });
                    this.element.css({ width: "100%", height: "100%" });
                    this.contentDiv.css({ width: "100%", height: "100%" });
                }
                else this._ejDialog.height(this.model.height);
                this._ejDialog.find("div.e-resize-handle").show();
                this._trigger("expand",{isInteraction :(e ? true : false )});
                this._collapsible = false;
            }
        },

        _maximizeClick: function (e) {
            if (this.model.enabled) {
                var _target = $(e.target);
                var hideIcon = this._dialogMaximize;
                if (_target.hasClass("e-maximize")) {
                    this._actionMaximize();
                    if (this._dialogTitlebar){
                        this._dialogTitlebar.find('.e-restore').removeClass('e-restore').addClass('e-minus');
                        this._dialogMinimize && this._dialogMinimize.attr('title', this.model.tooltip.minimize);
                    }
                    _target.removeClass("e-maximize").addClass("e-restore");
                    this._dialogMaximize.attr('title', this.model.tooltip.restore);
                    this._hideIcon(true);
                }
                else if (_target.hasClass("e-restore")) {
                    this._actionRestore();
                    _target.removeClass("e-restore").addClass("e-maximize");
                    this._dialogMaximize.attr('title', this.model.tooltip.maximize);
                    if (!ej.isNullOrUndefined(hideIcon) && $(hideIcon).hasClass('e-arrowhead-down')){
                        $(hideIcon).removeClass('e-arrowhead-down').addClass('e-arrowhead-up');
                        this._dialogMaximize.attr('title', this.model.tooltip.collapse);
                    }
                    this._hideIcon(true);
                }
            }
			this._resetScroller();
        },
        _actionMaximize: function () {
            this._ejDialog.css("top", "0px").css("left", "0px").css("overflow", "hidden").css("position", (this.model.containment ? "absolute" : this.model.target ? "absolute" : "fixed"));
            this._ejDialog.css({ width: "100%", height: "100%" });
            this.element.css({ width: "100%", height: "100%" });
            this.contentDiv.css({ width: "100%", height: "100%" });
            this._maximize = true;
            this._minimize = false;
            var proxy=this;
            if (this._dialogCollapsible && !ej.isNullOrUndefined(this._dialogCollapsible.hasClass("e-arrowhead-down"))) {
                this._dialogCollapsible.removeClass("e-arrowhead-down").addClass("e-arrowhead-up");
                this._dialogCollapsible.attr('title', this.model.tooltip.collapse);
                this._collapseValue = true
            }
            if(this._collapseValue == true) {
                this._ejDialog.find(".e-widget-content").parent().slideDown("fast",function(){
					proxy.refresh();
                    proxy._reRenderScroller();
                });
            }
            this._resetScroller();
			if($(this.contentDiv).is(":hidden"))
			    this.contentDiv.show();
        },
        _actionRestore: function () {
            this.element.height("").width("");
            this.contentDiv.height("").width("");
            this._restoreDialog();
            this._maximize = this._minimize = false;
        },

        _minimizeClick: function (e) {
            if (this.model.enabled) {
                var _target = $(e.target);
                var hideIcon = this._dialogMinimize.hasClass("e-icon")&& this._dialogMinimize;
                if (_target.hasClass("e-minus")) {
                    if (this._maximize)
                        this._setSize();
                    this._actionMinimize();
                } else if (_target.hasClass("e-restore")) {
                    this._actionRestore();
                    _target.removeClass("e-restore").addClass("e-minus");
                    this._dialogMinimize.attr('title', this.model.tooltip.minimize);
                    if (!ej.isNullOrUndefined(hideIcon) && $(hideIcon).hasClass('e-arrowhead-down')){
                        $(hideIcon).removeClass('e-arrowhead-down').addClass('e-arrowhead-up');
                        this._dialogMinimize.attr('title', this.model.tooltip.collapse);
                    }
                    this._hideIcon(true);
                }
            }
        },

        _actionMinimize: function () {
            var top = ($(window).height() - this._ejDialog.height()) + this.element.height() + 14, _height;
            this._ejDialog.css("top", "").css("bottom", "0").css("left", "0").css("position", (this.model.containment ? "absolute" : this.model.target ? "absolute" : "fixed"));
            this._ejDialog.css("minHeight", "0");
            if (this._dialogTitlebar) {
                this._dialogTitlebar.find('.e-restore').removeClass('e-restore').addClass('e-maximize');
                this._dialogMaximize && this._dialogMaximize.attr('title', this.model.tooltip.maximize);
                this._dialogTitlebar.find(".e-minus").removeClass("e-minus").addClass("e-restore");
                this._dialogMinimize && this._dialogMinimize.attr('title', this.model.tooltip.restore);
                if (this._isOpen)
                    _height = this._dialogTitlebar.outerHeight();
                else {
                    this._ejDialog.css({ "display": "block", "visibility": "hidden" });
                    _height = this._dialogTitlebar.outerHeight();
                    this._ejDialog.css({ "display": "none", "visibility": "" });
                }
                this._ejDialog.css("height", _height + 2); // 1px bordertop + 1px borderbottom of the dialog wrapper is added
                this._hideIcon(false);
            } else this._ejDialog.css("height", "");
            this.contentDiv.hide();
			if(this.model.showFooter) this._dialogFooterbar.hide();
            this._maximize = false;
            this._minimize = true;
        },

        _hideIcon: function (value) {
            var hideIcon = this._dialogCollapsible ? this._dialogCollapsible : null;
            if (value) {
                if (!ej.isNullOrUndefined(hideIcon)) $(hideIcon).parent('.e-dialog-icon').show();
                this._ejDialog.find("div.e-resize-handle").show();
            } else {
                if (!ej.isNullOrUndefined(hideIcon)) $(hideIcon).parent('.e-dialog-icon').hide();
                this._ejDialog.find("div.e-resize-handle").hide();
            }
        },

        _pinClick: function (e) {
            if (this.model.enabled) {
                var _target = $(e.target);
                if (_target.hasClass("e-unpin")) {
                    this.dialogPin = true;
                    _target.removeClass("e-unpin").addClass("e-pin");
                    this._dialogPin.attr('title', this.model.tooltip.unPin);
                }
                else if (_target.hasClass("e-pin")) {
                    this.dialogPin = false;
                    _target.removeClass("e-pin").addClass("e-unpin");
                    this._dialogPin.attr('title', this.model.tooltip.pin);
                }
            }
        },

        _restoreDialog: function () {
            this.contentDiv.show();
			if(this.model.showFooter) this._dialogFooterbar.show();
            this._ejDialog.css({"position": "absolute", "bottom": ""}).addClass("e-shadow");
            this._setSize()._resetScroller();
            if (this._dialogTitlebar) {
                this._dialogTitlebar.find(".e-minus").parent().show();
                if (this._dialogCollapsible) {
                    this._dialogCollapsible.removeClass("e-arrowhead-down").addClass("e-arrowhead-up");
                    this._dialogCollapsible.attr("title", this.model.tooltip.collapse);
                }
            }
        },

        _clickHandler: function (e) {
            var zindex = this._dialogMaxZindex();
            if (parseInt(this._ejDialog.css("zIndex")) < zindex) 
                this._ejDialog.css({ zIndex: zindex + 1 });            
        },

        _mouseClick: function (e) {
			if(e.currentTarget==this._id)
				if ($(e.target).hasClass("e-dialog") || $(e.target).hasClass("e-icon e-resize-handle")) {
					this._setZindex();
					$(e.target).closest(".e-dialog.e-widget").focus();
				}
        },

        _keyDown: function (e) {
            if (e.keyCode) code = e.keyCode; // ie and mozilla/gecko
            else if (e.which) code = e.which; // ns4 and opera
            else code = e.charCode;
            if (this.model.allowKeyboardNavigation && this.model.enabled && $(e.target).hasClass("e-dialog"))
                if ($.inArray(code, this.keyConfigs) > -1 && this.model.allowDraggable && !this.dialogPin) {
                    this._keyPressed(code, e.ctrlKey);
                    e.preventDefault();
                }            
            if (this.model.closeOnEscape && code === 27 && this.model.enabled) 
                if (!this.element.find(".e-js.e-dialog").first().is(":visible")) {
                    this.close(e);
                    e.preventDefault();
                }
            if (code===13 && this.model.enabled){
                if($(e.target).hasClass("e-close")) this.close(e);
                else if ($(e.target).hasClass("e-arrowhead-up") || $(e.target).hasClass("e-arrowhead-down")) this._collapsibleClick(e);                
                if ($(e.target).hasClass("e-maximize") || ($(e.target).hasClass("e-restore") && $(e.target).is(this._dialogMaximize)))
				    this._maximizeClick(e);
                else if ($(e.target).hasClass("e-minus") || ($(e.target).hasClass("e-restore") && $(e.target).is(this._dialogMinimize)))
				    this._minimizeClick(e);
				if ($(e.target).hasClass("e-pin") || $(e.target).hasClass("e-unpin")){
				    this._pinClick(e);
					}
            }
            if (code == 9 && this.model.enableModal)
                this._focusOnTab(e);
        },

        _focusOnTab: function (e) {
            var focusEle = this._ejDialog.find("a, button, :input, select, [tabindex]:not('-1')");
            focusEle = $(focusEle).find("a, button, :input, select, [tabindex]:not('')");
            if (e.shiftKey) {
                if (!focusEle[focusEle.index(e.target) - 1]) {
                    e.preventDefault();
                    focusEle.last().focus();
                }
            }
            else if (!focusEle[focusEle.index(e.target) + 1]) {
                e.preventDefault();
                focusEle[0].focus();
            }
        },

        _keyPressed: function (code, ctrlKey) {
            this._keyNavigation=true;
            switch (code) {
                case 40:
                    ctrlKey ?  this._resizing("height", (this._ejDialog.outerHeight() + 3)) : this.option("position", { X: this._ejDialog.position().left, Y: (this._ejDialog.position().top + 3) });
                    break;
                case 39:
                    ctrlKey ? this._resizing("width", (this._ejDialog.outerWidth() + 3)) : this.option("position", { X: (this._ejDialog.position().left + 3), Y: this._ejDialog.position().top });
                    break;
                case 38:
                    ctrlKey ? this._resizing("height", (this._ejDialog.outerHeight() - 3)) : this.option("position", { 
						X: (this._ejDialog.position().left == 0 ? 0 : this._ejDialog.position().left),
						Y: (this._ejDialog.position().top > 3 ? this._ejDialog.position().top - 3 : 0) 
					});
                    break;
                case 37:
                    ctrlKey ? this._resizing("width", (this._ejDialog.outerWidth() - 3)) : this.option("position", { 
						X: (this._ejDialog.position().left > 3 ? this._ejDialog.position().left - 3 : 0), 
						Y: (this._ejDialog.position().top == 0 ? 0 : this._ejDialog.position().top)
					});
                    break;
            }
        },

        _resizing:function(key, value){
            if (this.model.enableResize) this.option(key, value);
        },

        _sizeInPercent: function () {
            if (!this._enableWindowResize()) return this;
            var parentObj = this._getParentObj();
            if (this._sizeType.width == "%") this._widthPercent = parseFloat(this.model.width);
            else this._widthPercent = this._convertPixelToPercentage(parentObj.outerWidth(), this._ejDialog.outerWidth());
            if (this._sizeType.height == "%") this._heightPercent = parseFloat(this.model.height);
            else this._heightPercent = this._convertPixelToPercentage(parentObj.outerHeight(), this._ejDialog.outerHeight());
            if (this._widthPercent >= 100) {
                this._widthPercent = 100;
                this._ejDialog.outerWidth(parentObj.outerWidth());
                this.model.width = this._ejDialog.width();
            }
            if (this._heightPercent >= 100) {
                this._heightPercent = 100;
                this._ejDialog.outerHeight(parentObj.outerHeight());
                this.model.height = this._ejDialog.height();
            }
            return this;
        },

        _getParentObj: function () {
            return (!ej.isNullOrUndefined(this.model.containment) ? $(this.model.containment) : !ej.isNullOrUndefined(this.model.target) ? $(this.model.target) : $(document));
        },

        _convertPercentageToPixel: function (parent, child) {
            return Math.round((child * parent) / 100);
        },

        _convertPixelToPercentage: function (parent, child) {
            return Math.round((child / parent) * 100);
        },

        _reSizeHandler: function () {
            var parentObj;
            if (this._maximize) { this._resetScroller(); return; }
            if (this.model.position.X == "" || this.model.position.Y == "" && !this._minimize) this._centerPosition();
            parentObj = this._getParentObj();
            this._change = false;
            if (this._windowSize.outerWidth != $(window).outerWidth()) {
                if (this._sizeType.width == "%") this._percentageWidthDimension(parentObj);
                else this._pixelsWidthDimension(parentObj);
            }
            else if (this._windowSize.outerHeight != $(window).outerHeight()) {
                if (this._sizeType.height == "%") this._percentageHeightDimension(parentObj);
                else this._pixelsHeightDimension(parentObj);
            }
            this._change && this._resizeContainer(parentObj);
            this._windowSize = { outerWidth: $(window).outerWidth(), outerHeight: $(window).outerHeight() };
			this._centerPosition();
        },
        _setDimension:function(){
            if (ej.isNullOrUndefined(this.model.maxWidth)) {
                if (ej.isNullOrUndefined(this._sizeType.width)) this._maxWidth = +this.model.width;
                else if (this._sizeType.width == "px" || this._sizeType.width == "auto") this._maxWidth = this.model.width;
            } else this._maxWidth = this.model.maxWidth;
            if (ej.isNullOrUndefined(this.model.maxHeight)) {
                if (ej.isNullOrUndefined(this._sizeType.height)) this._maxHeight = +this.model.height;
                else if (this._sizeType.height == "px" || this._sizeType.height == "auto") this._maxHeight = this.model.height;
            } else this._maxHeight = this.model.maxHeight;
        },
        _percentageWidthDimension: function (parentObj) {
            this._ejDialog.outerWidth(this._convertPercentageToPixel(parentObj.outerWidth(), this._widthPercent));
            this._change = true;
        },
        _percentageHeightDimension: function (parentObj) {
            this._ejDialog.outerHeight(this._convertPercentageToPixel(parentObj.outerHeight(), this._heightPercent));
            this._change = true;
        },
        _pixelsWidthDimension: function (parentObj) {
            if ($(parentObj).outerWidth() <= this._ejDialog.outerWidth()) this._setWidth(parentObj);
            if (($(parentObj).outerHeight() <= this._ejDialog.outerHeight()) && !this.model.isResponsive) this._setHeight(parentObj);
            if (parseInt(this._ejDialog.css("width")) < parseInt(this._maxWidth)) {
                if (parseInt(this._maxWidth) < $(parentObj).outerWidth()) this._ejDialog.outerWidth((parseInt(this._maxWidth)));
                else this._ejDialog.outerWidth((parentObj.outerWidth()));
                this._change = true;
            }
        },
        _pixelsHeightDimension: function (parentObj) {
            if (($(parentObj).outerHeight() <= this._ejDialog.outerHeight()) && !this.model.isResponsive) this._setHeight(parentObj);
            if ($(parentObj).outerWidth() <= this._ejDialog.outerWidth()) this._setWidth(parentObj);
            if (parseInt(this._ejDialog.css("height")) < parseInt(this._maxHeight)) {
                if (parseInt(this._maxHeight) < $(parentObj).outerHeight()) this._ejDialog.outerWidth((parseInt(this._maxHeight)));
                else this._ejDialog.outerHeight((parentObj.outerHeight()));
                this._change = true;
            }
        },
        _setWidth: function (parentObj) {
            this._ejDialog.outerWidth((parentObj.outerWidth()));
            this._change = true;
        },
        _setHeight: function (parentObj) {
            this._ejDialog.outerHeight((parentObj.outerHeight()));
            this._change = true;
        },
        _resizeContainer: function (parentObj) {
            this.contentDiv.width(this._ejDialog.width());
            this.element.outerWidth(this.contentDiv.width());
            var contentDivheight = this._ejDialog.height() - ((this.model.showHeader) ? $(this._ejDialog.find("div.e-titlebar")).outerHeight(true) : 0);
            this.contentDiv.height((!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? contentDivheight : contentDivheight - 1);
            this.element.outerHeight((!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? contentDivheight : contentDivheight - 1);
            this.scroller = this.contentDiv.ejScroller({ width: (!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") ? this._ejDialog.width() : this._ejDialog.width() - 2 : false , height: (!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") ? this.element.outerHeight() : this.element.outerHeight() - 2 : false, rtl: this.model.rtl, enableTouchScroll: false });
            this.scroller = this.contentDiv.data("ejScroller");
            this._reRenderScroller();
            if ((this.model.position.X == "" || this.model.position.Y == "" && !this._minimize)||(this._positionChanged)) this._centerPosition();
            else this._ejDialog.css("height", this._dialogTitlebar.outerHeight());
            this._updateCaptionWidth();
            this._change = false;
        },
        _getLocalizedLabels:function(){
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }, 

        _enableWindowResize: function () {
            return (this.model.isResponsive || ((isNaN(this.model.width) && (this.model.width.indexOf("%") > 0)) && (isNaN(this.model.height) && (this.model.height.indexOf("%") > 0) && (this.model.height != "auto")))) ? true : false;
        },

        _wireResizing: function () {             
            $(window)[(this._enableWindowResize() ? "on" : "off")]('resize', $.proxy(this._reSizeHandler, this));                        
        },

        _wireEvents: function () {
            this._on(this._ejDialog, "keydown", this._keyDown);
            this._on(this._ejDialog, "click", this._mouseClick);
            this._wireResizing();
        },

        refresh: function () {
            this._resetScroller();
        },

        open: function () {
            if (this._isOpen) return true;
            if (true == this._trigger("beforeOpen")) return false;
            this.element.css("display", "block");
            this._setZindex();
            if (!this._minimize && !this._maximize && !this._init) this._dialogPosition();
            var proxy = this, effect = {}, height;
            this._ejDialog.show();
            if (this.model.enableAnimation) {
                this._ejDialog.css({ "opacity": 0});
                if (this.model.animation.show.effect == "slide") {
                    var eLeft = this._ejDialog.css("left");
                    this._ejDialog.css({ "left": -this._ejDialog.width() });
                    effect = { left: eLeft, opacity: 1 };
                }
                else {
                    effect = { opacity: 1 };
                }
            }
            this._ejDialog.animate(effect, (this.model.enableAnimation ? Number(this.model.animation.show.duration) : 0), function () {
                if (proxy.model) {
					  if (proxy._ejDialog.css("display") == "none") proxy._ejDialog.show();
                    proxy._ejDialog.eq(0).focus();
                    proxy._ejDialog.css({ "opacity": "" });
                    proxy.contentDiv.find("a:visible:enabled, button:visible:enabled, :input:visible:enabled, select:visible:enabled, .e-input").first().focus();
                    proxy._trigger("open");
                    proxy._updateCaptionWidth();
					if(proxy.model.enableModal && !proxy.model.backgroundScroll)
					{
						if( proxy._ejDialog.height() > $(window).height()) proxy._ejDialog.css("height",$(window).height());
						proxy.model.height=$(window).height(); proxy._overLay.css("position","fixed");
						proxy.scroller.refresh(true); proxy.refresh();
					}
                    if (proxy.model.maxHeight || proxy.model.maxWidth)
                    {
                        height = proxy._ejDialog.outerHeight(true) - ((proxy._dialogTitlebar ? proxy._dialogTitlebar.outerHeight(true) : 0));
                        if ((proxy.model.height == "auto" || proxy.model.height == "100%"))
                            height = proxy.model.height;
                        proxy._updateScroller((!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? height : height - 2, (!ej.isNullOrUndefined(this.contentDiv)) ? (this.contentDiv.css('border-width') == "0px") : false ? proxy._ejDialog.width() : proxy._ejDialog.width() - 2);
						proxy.scroller.refresh();
                    }
                }
            });
            if (this.model.enableModal == true) this._createOverlay();
            this._isOpen = true;
            if (this.element.find("> .e-draggable.e-titlebar")) {
               var dragobject = $("#" + this.element.find("> .e-draggable.e-titlebar").attr("id")).data("ejDraggable");
                if (dragobject)
                    dragobject.option("cursorAt", this.element.offset());
            }
            return this;
        },

        close: function (event) {
            if (!this._isOpen || !this.model.enabled) return true;
            var isInteraction= event ? true : false;            
            if (true == this._trigger("beforeClose", { event: event,isInteraction:isInteraction })) return false;
            this._isOpen = false;
            var proxy = this, effect = {};
            if (this.model.enableAnimation) 
            effect = this.model.animation.hide.effect == "slide" ? { left: -this._ejDialog.width(), opacity: 0 } : { opacity: 0 };
            this._ejDialog.animate(effect, (this.model.enableAnimation ? Number(this.model.animation.hide.duration) : 0), function () {
                proxy._trigger("close", { event: event, isInteraction:isInteraction });
                proxy._ejDialog.hide();
            });
            if (this.model.enableModal){
                if (this._overLay) this._overLay.remove();
                if (!this.model.backgroundScroll) $("body").removeClass("e-dialog-modal");
            }
            return this;
        },

        isOpened: function () { return this.isOpen() },
        isOpen: function () { return this._isOpen; },

        setTitle: function (titleText) {
            this.model.title = titleText;
            this._titleText.text(titleText);
            this._updateCaptionWidth();
            return this;
        },

        setContent: function (htmlContent) {
            if (!this.model.enabled) return false;
            this.element.html(htmlContent);
            this._resetScroller();
            return this;
        },      

        focus: function () {
            this._setZindex();
            this.element.focus();
            return this;
        },

        minimize: function () {
			if(this.model.showHeader){
            this._actionMinimize();
            $(this.wrapper.find(".e-minus")[0]).parent().hide();
            return this;
			}
        },

        maximize: function () {
			if(this.model.showHeader){
            this._actionMaximize();
            $(this.wrapper.find(".e-maximize")[0]).removeClass("e-maximize").addClass("e-restore");
            $(this.wrapper.find(".e-restore")[1]).removeClass("e-restore").addClass("e-minus");
            this._dialogMaximize && this._dialogMaximize.attr('title', this.model.tooltip.restore);
            this._dialogTitlebar && this._dialogTitlebar.find(".e-minus").parent().show();
            this._hideIcon(true);
            return this;
			}
        },

        restore: function () {
			if(this.model.showHeader){
            var action = this._minimize;
            this._actionRestore();
            $(this.wrapper.find(".e-restore")[0]).removeClass("e-restore").addClass(action ? "e-minus" : "e-maximize");
            this._dialogMaximize && this._dialogMaximize.attr('title', this.model.tooltip.maximize);
            this._hideIcon(true);
            return this;
			}
        },

        pin: function () {
			if(this.model.showHeader){
            this.dialogPin = true;
            $(this.wrapper.find(".e-unpin")[0]).removeClass("e-unpin").addClass("e-pin");
            this._dialogPin && this._dialogPin.attr('title', this.model.tooltip.unPin);
            return this;
			}
        },

        unpin: function () {
            if(this.model.showHeader){
			this.dialogPin = false;
            $(this.wrapper.find(".e-pin")[0]).removeClass("e-pin").addClass("e-unpin");
            this._dialogPin && this._dialogPin.attr('title', this.model.tooltip.pin);
            return this;
			}
        },

        collapse: function () {
			if(this.model.showHeader){
            this._actionCollapse();
            this._collapseValue=true;
            return this;
			}
        },

        expand: function () {
			if(this.model.showHeader){
            this._actionExpand();
            return this;
			}
        }
    });
    
ej.Dialog.Locale = ej.Dialog.Locale || {} ;
    
ej.Dialog.Locale["default"] = ej.Dialog.Locale["en-US"] = {
    tooltip:{
                close: "Close",
                collapse: "Collapse",
                restore: "Restore",
                maximize: "Maximize",
                minimize: "Minimize",
                expand: "Expand",
                unPin: "UnPin",
                pin: "Pin"
            },
    title:"",
     //currently we have deprecated this API
    closeIconTooltip: "close"
};

})(jQuery, Syncfusion);