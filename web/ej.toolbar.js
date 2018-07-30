/**
* @fileOverview Plugin to style the Toolbar elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejToolbar", "ej.Toolbar", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _setFirst: false,

        _rootCSS: "e-toolbar",
        angular: {
            terminal: false
        },


        defaults: {

            height: "",

            width: "",

            enabled: true,

            hide: false,

            disabledItemIndices: [],

            enabledItemIndices: [],

            enableSeparator: false,

            orientation: "horizontal",

            enableRTL: false,

            isResponsive: false,

            showRoundedCorner: false,

            htmlAttributes: {},

            dataSource: null,
			
			Items:{

                id: "id",

                tooltipText: "tooltipText",

                imageUrl: "imageUrl",

                text: "text",

                imageAttributes: "imageAttributes",

                spriteCssClass: "spriteCssClass",

                htmlAttributes: "htmlAttributes",

                group: "group",
				
				template:"template"
            },

            query: null,
		
			responsiveType:"popup",


            fields: {

                id: "id",

                tooltipText: "tooltipText",

                imageUrl: "imageUrl",

                text: "text",

                imageAttributes: "imageAttributes",

                spriteCssClass: "spriteCssClass",

                htmlAttributes: "htmlAttributes",

                group: "group",
				
				template:"template"
            },
            tooltipSettings: {
                associate: "mouseenter",
                showShadow: true,
                position: {
                    stem: { horizontal: "left", vertical: "top" }
                },
                tip: {
                    size: { width: 5, height: 5 },
					adjust: { xValue: 17, yValue: 17 }
                },
                isBalloon: false
            },

            cssClass: "",
			
			targetID : null,

            create: null,

            click: null,

            itemHover: null,

            itemLeave: null,
			
			overflowOpen:null,
			
			overflowClose:null,

            destroy: null

        },


        dataTypes: {
            enabled: "boolean",
            hide: "boolean",
            enableSeparator: "boolean",
            disabledItemIndices: "data",
            enabledItemIndices: "data",
            orientation: "enum",
            enableRTL: "boolean",
            showRoundedCorner: "boolean",
            isResponsive: "boolean",
            dataSource: "data",
            query: "data",
            fields: "data",
            cssClass: "string",
            htmlAttributes: "data",
			targetID: "string",
			responsiveType:"enum"
        },



        hide: function () {
            if (!this.model.enabled && (this.element.css("display") == "none")) return false;
            this.element.css("display", "none");
			this.model.hide = true;
        },

        show: function () {
            if (!this.model.enabled && (this.element.css("display") != "none")) return false;
            this.element.css("display", "block");
			this.model.hide = false;
        },


        _init: function () {
            if(this.model.targetID != null)
				this.element.html($("#" + this.model.targetID).find('ul,ol'));
			this._cloneElement = $(this.element).clone();
			//Stored the local & remote data source processed value. 
			 
			this._localDataSource=null;
            if (this.model.dataSource != null) {
                this._generateTemplate();
            }
			else if(this.model.Items != null)
			{
			  this._generateTemplate();
			}
            (!(this.model.dataSource instanceof ej.DataManager)) && this._initialize();
            this._renderTooltip(this.model.tooltipSettings);
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "height":
                        this._setHeight(options[option]);
                        break;
                    case "width":
                        this.model.width = options[option];
                        this._setWidth();
                        this._bindUnbindWidth();
                        break;
                    case "enabled":
                        this._controlStatus(options[option]);
                        break;
                    case "disabledItemIndices": {
                        this._disableItemByIndex(options[option]);
						options[option] = this.model.disabledItemIndices;
                        break;
                    }
                    case "enabledItemIndices": {
						this._enableItemByIndex(options[option]); 
						break;
					}
                    case "isResponsive":
                        this.model.isResponsive = options[option];
                        if(this.model.isResponsive) {
							this._responsiveLayout();
							this._renderTooltip(this.model.tooltipSettings);
						}
						else
							this._removeResponsive();
                        break;
                    case "hide":
                        this._controlVisibleOptions(options[option]);
                        break;
                    case "orientation":
                        this._setOrientation(options[option]);
                        this.model.orientation = options[option];
                        this._wireResizing();
                        break;
					case "tooltipSettings":
					    this.model.tooltipSettings = $.extend(true, this.model.tooltipSettings, options[option]);
						this._renderTooltip(this.model.tooltipSettings);
						break;
                    case "enableRTL":
                        this._enableRTL(options[option]);
                        break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "cssClass":
                        this._setSkin(options[option]);
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "enableSeparator":
                        this.model.enableSeparator = options[option];
                        this._renderToolbarSeparator();
                        break;
                    case "fields":
                        $.extend(this.model.fields, options[option]);
                        break;
                    case "query":
                        this.model.query = options[option];
                        break;
                    case "dataSource":
                        for (var optio in options) {
                            if (optio == "fields") $.extend(this.model.fields, options[optio]);
                            if (optio == "query") this.model.query = options[optio];
                        }
                        this._refreshTagItems(option, options[option]);
                        break;
					case "Items":
					 
					   $.extend(this.model.Items, options[option]);
					   this._refreshTagItems(option, options[option]);
					   break;
					case "targetID":
						this.model.targetID = options[option];
						this._setTargetID();					
						break;
					
                }
            }
        },
		
		_setTargetID: function() {
			this.element.removeAttr('role tabindex aria-disabled style');			
			$(this._spantag).remove();
			$(this._liTemplte).remove();			
			this._liTemplte = this._tipRes = null;		
			this.element.removeClass('e-widget e-box e-toolbarspan e-rtl');
			this.element.find('ul,ol').removeClass('e-ul e-horizontal e-vertical e-separator e-comnrtl');
			this.element.find('li').removeClass('e-tooltxt e-comnrtl');
			this.element.find('li').removeAttr('aria-label');
			this._init();
		},
		
        _refreshTagItems: function (key, value) {
            this.model[key] = value;
            this.element.empty();
            this._generateTemplate();
            this._initialize();
        },

        _setHeight: function (val) {
            this.element.css('height', val);
        },

        _setWidth: function () {
            if (this.model.width == "auto") {
                var itemswidth = parseFloat(this.element.css('border-left-width')) + parseFloat(this.element.css('border-right-width')),
                listElement = this.element.find('ul').children('li'), listUl = this.element.find('ul'),resEle;
				if(this.model.responsiveType=="inline")
				 resEle = this.element.find('.e-arrow-sans-down');
				 else
				resEle = this.element.find('.e-toolbar-res-arrow');
				
				for(var i=0, len = listUl.length; i < len; i++) {           // calculate separator width also
                    if (listUl[i] != null && $(listUl[i]).hasClass('e-separator'))
                        itemswidth += parseFloat(listUl.eq(i).css('border-right-width')) + parseFloat(listUl.eq(i).css('border-left-width'));
                }
                if (resEle[0] != null)
				 if(this.model.responsiveType=="inline")
                   itemswidth += Math.round(this.element.find('.e-arrow-sans-down').outerWidth()) + 8; // 8px for position
				 else
				   itemswidth += Math.round(this.element.find('.e-toolbar-res-arrow').outerWidth()) + 8;// 8px for position
                
                for (var i = 0, len = listElement.length; i < len; i++) {
                    if (listElement[i] != null)
                        itemswidth += Math.round(listElement.eq(i).outerWidth());
                }
                this.element.css("width", Math.ceil(itemswidth));
            } else
                this.element.css('width', this.model.width);
        },
        _bindUnbindWidth: function () {
            (this.model.width != "auto") ? this._off($(window), "resize", this._widthHandler) : this._on($(window), "resize", this._widthHandler);
        },
        _widthHandler: function (e) {
            this._setWidth(this.model.width);
        },

        _setOrientation: function (value) {
            if (value != ej.Orientation.Vertical) {
                this.element.removeClass(this.model.cssClass).addClass("e-toolbarspan " + this.model.cssClass);
                this.itemsContainer.removeClass("e-ul e-vertical").addClass("e-ul e-horizontal");
            }
            else {
                this.element.removeClass("e-toolbarspan " + this.model.cssClass).addClass(this.model.cssClass);
                this.itemsContainer.removeClass("e-ul e-horizontal").addClass("e-ul e-vertical");
            }
            this.items.addClass("e-tooltxt");
			
        },

        _reSizeHandler: function () {
			if (this._isResized && this._liTemplte.children().length > 0) {
                $(this._liTemplte.children()).insertBefore($(this.element).find("span.e-res-pos"));
                this._renderToolbarSeparator();
			  if(this.model.responsiveType!="inline")
                this._liTemplte.addClass("e-display-none");
                this._contstatus = false;
            }
			this._elementWidth = (typeof window.getComputedStyle == "function") ? parseFloat(window.getComputedStyle(this.element[0]).width) : this.element.width()-1; // -1 for IE8 get exact width of an element no border and margin            
            this._liWidth = this._spanWidth;
            this._spantag.removeClass("e-display-block").addClass("e-display-none");
            for (var i = 0; i < this.itemsContainer.length; i++) {
                this._liWidth += $(this.itemsContainer[i]).outerWidth(true)+8;
                if (this._liWidth > this._elementWidth) {
                    if (!this._spantag.hasClass("e-display-block"))
                    this._spantag.removeClass("e-display-none").addClass("e-display-block");
                    this._spantag.addClass('e-res-pos');
					this._liTemplte.addClass('e-normal');
                    this._liTemplte.append(this.itemsContainer[i]);
                }
            }
			if(this.model.responsiveType=="inline")
			{
			this._liTemplte.removeClass('e-normal');
            this._liTemplte.css("width",this.element.width());
			}
		    this._isResized = true;
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popup);
        },
        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _btnMouseClick: function (e) {
            var args, btnpos, btnposx, btnposy, poscur = 1, eleWidth = this.element.outerWidth(), eleHeight = this.element.outerHeight(), resWidth = $(this._liTemplte).outerWidth(), winWidth = $(window).width(), winLeft = $(window).scrollLeft();
            if (!$(e.currentTarget).hasClass("e-disable")) {
                /*Context Menu Functionality*///need to write enableRTL
              var maxZ = this._getZindexPartial();
                btnpos = this._getOffset(this.element);
                btnposx = this.model.enableRTL ? btnpos.left : (btnpos.left + eleWidth - resWidth);
                btnposy = btnpos.top + eleHeight - poscur + 2;
                btnposx = btnposx < winLeft ? winLeft + poscur : ((btnposx + resWidth) > (winWidth + winLeft) ? winWidth - resWidth + winLeft - poscur : btnposx);
                if (this._contstatus) {
                    this._liTemplte.addClass("e-display-none");
					if(this.model.responsiveType=="inline")
					   this._spantag.removeClass("e-active");
                    this._contstatus = false;	
                   args = { currentTarget: e.currentTarget, clientX:e.clientX ,clientY:e.clientY , cancel:e.cancellable};					
					this._trigger("overflowClose",args);
                  					
                } else {
				   this._liTemplte.removeClass("e-display-none");
                   if(this.model.responsiveType!="inline")
				     this._liTemplte.css({ "top": btnposy + "px", "left": btnposx + "px", "z-index": maxZ });
				   if(this.model.responsiveType=="inline")	
                      this._spantag.addClass("e-active");
                    this._contstatus = true;
					args = { currentTarget: e.currentTarget, clientX:e.clientX ,clientY:e.clientY , cancel:e.cancellable};
					this._trigger("overflowOpen",args);
				 if(this.model.responsiveType!="inline")
                    this._on(ej.getScrollableParents(this.element), "scroll", this._hidecontext);
                    this.element.bind("click", $.proxy(this._hidecontext, this));
                }
                if ((this._contstatus)&&(this.model.responsiveType!="inline"))
                    this._on($(document), "mouseup", this._documentClick);
					 if(!this._contstatus)
				 this._off($(document), "mouseup", this._documentClick);
                this._removeListHover();
            }
        },

        _hidecontext: function (e) {
            if ((!$(e.target).is($("#" + this.element[0].id + "_target")))&&(this.model.responsiveType!="inline")) {
                this._liTemplte.addClass("e-display-none");
                this._contstatus = false;
                this.element.unbind("click", $.proxy(this._hidecontext, this));
                this._off(ej.getScrollableParents(this.element), "scroll", this._hidecontext);
                this._off($(document), "mouseup", this._documentClick);
            }
        },

        _documentClick: function (e) {
            if (!$(e.target).is($("#" + this.element[0].id + "_target")) && !($(e.target).closest("div#" + this.element[0].id + "_hiddenlist").length != 0 || $(e.target).parents().hasClass("e-ddl-popup"))) {
                this._liTemplte.addClass("e-display-none");
                this._contstatus = false;
				var args = { currentTarget: e.currentTarget, clientX: e.clientX, clientY: e.clientY, cancel: e.cancellable };
                this._trigger("overflowClose", args);
                this._off($(document), "mouseup", this._documentClick);
            }
        },

        _setSkin: function (skin) {
            this.element.removeClass(this.model.cssClass).addClass(skin);
			var tooltipCssClass = "e-toolbarTooltip " + skin; 
			this._subControlsSetModel("cssClass", tooltipCssClass);
        },
		_subControlsSetModel : function (prop, value){
			!ej.isNullOrUndefined(this._tipToolbar) && $(this.target).ejTooltip("option", prop, value);
			!ej.isNullOrUndefined(this._tipRes) && $(this._liTemplte).ejTooltip("option", prop, value);
		},

        _destroy: function () {
            this.element.html("");
			!ej.isNullOrUndefined(this._tipToolbar) && $(this.target).ejTooltip("destroy");
			!ej.isNullOrUndefined(this._tipRes) && $(this._liTemplte).ejTooltip("destroy");
            this._cloneElement.removeClass('e-toolbar e-js');
            this.element.replaceWith(this._cloneElement);
            this._liTemplte && this._liTemplte.remove();
            this._unWireResizing();
        },

        _initialize: function () {
            this.element.attr({ "role": "toolbar", "tabindex": "0" });
            var liList = this.element.children().find('li');
            this._focusEnable = true;
            this._renderControl();
            this._responsiveLayout();
            this._wireEvents();
        },
        _responsiveLayout: function () {
            this._roundedCorner(this.model.showRoundedCorner);
            if (this.model.isResponsive && (this.model.orientation == "horizontal")) {
                if (!ej.isNullOrUndefined(this._liTemplte)) {
                    !ej.isNullOrUndefined(this._tipRes) && this._tipRes.destroy();
                    $(this._liTemplte).remove();
                }
				this._spantag = $("<span id='" + this.element[0].id + "_target' class='e-icon e-toolbar-res-arrow e-rel-position e-display-block' unselectable='on'></span>");
				if(this.model.responsiveType=="inline")
				{
				this._spantag.removeClass("e-toolbar-res-arrow").addClass("e-inlinearrow e-arrow-sans-down");
				}
                this._spantag.appendTo(this.element);
				this._liTemplte = $("<div id='" + this.element[0].id + "_hiddenlist' class='e-responsive-toolbar e-display-none e-abs-position " + $(this.element)[0].className + "'></div>");
                if(this.model.responsiveType=="inline")
                   this._liTemplte.removeClass("e-abs-position").addClass("e-inline");				 
                this._spantag.appendTo(this.element);
                this._spanWidth = this._spantag.outerWidth(true) + 8; // 8px from right of span 
                if (this.model.enableRTL) this._liTemplte.addClass('e-rtl');
                this._isResized = false;
				this._elementWidth = (typeof window.getComputedStyle == "function") ? parseFloat(window.getComputedStyle(this.element[0]).width) : this.element.width()-1; // -1 for IE8 get exact width of an element no border and margin            
				this._liWidth = this._spanWidth;
				for (var i = 0; i < this.itemsContainer.length; i++) {
                this._liWidth += $(this.itemsContainer[i]).outerWidth(true);
				}
                if (this._liWidth > this._elementWidth)
                this._reSizeHandler();
                else 
				this._spantag.removeClass("e-display-block").addClass("e-display-none");
				if(this.model.responsiveType=="inline")
				  $(this.element[0]).append(this._liTemplte);
				else
                  $('body').append(this._liTemplte);
                this._renderTooltip(this.model.tooltipSettings);
            }
            this._on($("#" + this.element[0].id + "_target"), "mousedown", this._btnMouseClick);
            this._wireResizing();
            this._controlVisibleOptions(this.model.hide);
            this._enableRTL(this.model.enableRTL);
			this._disabledItems = this.model.disabledItemIndices; 
            this._controlStatus(this.model.enabled);
			this.model.disabledItemIndices = this._disabledItems;
            if (this.model.disabledItemIndices.length != 0)
                this._disableItemByIndex(this.model.disabledItemIndices);
            if (this.model.enabledItemIndices.length != 0)
                this._enableItemByIndex(this.model.enabledItemIndices);
            this._setWidth();
        },
        _removeResponsive: function () {
            $(this._spantag).remove();
			!ej.isNullOrUndefined(this._tipRes) && $(this._liTemplte).ejTooltip("destroy");
            var list = $(this._liTemplte).children('ul');
            $(this._liTemplte).detach();
            $(this.element).append(list);
            this.itemsContainer = this.element.children("ol,ul");
            this.items = this.itemsContainer.children('li');
            this._off(this.items, "mouseup");
            this._off(this.items, "mousedown");
            this._off(this.element, "mousedown");
            this._wireEvents();
            this._wireResizing();
            this._setWidth();
        },

        _controlVisibleOptions: function (value) {
            value != false ? this.hide() : this.show();
        },

        _controlStatus: function (value) {
            value != true ? this.disable() : this.enable();
        },

        _roundedCorner: function (value) {
            if (value) {
                this.element.addClass('e-corner');
                this._liTemplte && this._liTemplte.addClass('e-corner');
            } else {
                this.element.removeClass('e-corner');
                this._liTemplte && this._liTemplte.removeClass('e-corner');
            }
			this._subControlsSetModel("showRoundedCorner", value);
        },

        _generateTemplate: function () {
            var proxy = this, queryPromise;
            this.element.css("visibility", "hidden");
            if (this.model.dataSource instanceof ej.DataManager) {
                queryPromise = this.model.dataSource.executeQuery(this.model.query);
                queryPromise.done(function (e) {
                    proxy._generateGroup(e.result);
                    proxy._initialize();
                    proxy.element.css("visibility", "");
                });
            } else if(this.model.dataSource!=null)
			{ 
			    proxy._generateGroup(proxy.model.dataSource);
                proxy.element.css("visibility", "");
               
            }
			else {
                proxy._generateGroup(proxy.model.Items);
                proxy.element.css("visibility", "");
            }
        },
        _generateGroup: function (value) {
            var proxy = this;
			this._localDataSource=value;
            var y = -1;
            var groupArray = [];
            for (var i = 0; i < value.length; i++) {
                if (this._isNewGroup(value[i][this.model.fields.group], groupArray)) {
                    groupArray[++y] = value[i][this.model.fields.group];
                    var index = -1;
                    proxy.itemsSource = [];
                    for (var x = i; x < value.length; x++) {
                        if (value[i][this.model.fields.group] == value[x][this.model.fields.group]) {
                            proxy.itemsSource[++index] = value[x];
                        }
                    }
                    proxy.element.append(proxy._generateTagitems());
                }
            }

        },
        _isNewGroup: function (value, group) {
            if (!group)
                return true;
            for (var i = 0; i < group.length; i++) {
                if (value == group[i])
                    return false;
            }
            return true;
        },


        _renderControl: function () {
            this.element.addClass("e-widget e-box");
            this._renderToolbarItems();
            this._addAttr(this.model.htmlAttributes);
            this._setOrientation(this.model.orientation);
            this._renderToolbarSeparator();
            this._setHeight(this.model.height);
            this._bindUnbindWidth();
        },

        _renderToolbarItems: function () {
            this.target = this.element[0];
            this.itemsContainer = this.element.children("ol,ul");
            this.itemsContainer.children("ol,ul").remove();
            this.items = this.itemsContainer.children('li');
            for (var i = 0; i < this.items.length; i++) {
                if (ej.isNullOrUndefined($(this.items[i]).attr("title")))
                    $(this.items[i]).attr("aria-label", this.items[i].id);
            }
            this._liCount = this.items.length;
        },

        _generateTagitems: function () {
            var list, i;
            list = this.itemsSource;
            this.ultag = ej.buildTag('ul');
            for (i = 0; i < list.length; i++) {
                this.ultag.append(this._generateLi(list[i]));
            }
            return this.ultag;
        },

        _generateLi: function (toolbarItem) {
            var litag, imgtag, divtag, i;
            litag = ej.buildTag('li');
            if (toolbarItem[this.model.fields.id])
                litag.attr('id', toolbarItem[this.model.fields.id]);
            else 
                (toolbarItem[this.model.fields.text]) && litag.attr('id', toolbarItem[this.model.fields.text]);
            if (toolbarItem[this.model.fields.tooltipText])
                litag.attr('title', toolbarItem[this.model.fields.tooltipText]);
            if ((toolbarItem[this.model.fields.imageUrl]) && (toolbarItem[this.model.fields.imageUrl] != "")) {
                //Creating the image tag
                imgtag = ej.buildTag('img.e-align', '', {}, { 'src': toolbarItem[this.model.fields.imageUrl], 'alt': toolbarItem[this.model.fields.text] });
                if (toolbarItem[this.model.fields.imageAttributes]) this._setAttributes(toolbarItem[this.model.fields.imageAttributes], imgtag);
                litag.append(imgtag);
            }
            if ((toolbarItem[this.model.fields.spriteCssClass]) && (toolbarItem[this.model.fields.spriteCssClass] != "")) {
                //Creating the Sprite image tag
                divtag = ej.buildTag('div.e-align ' + toolbarItem[this.model.fields.spriteCssClass] + ' e-spriteimg');
                litag.append(divtag);
            }
            if ((toolbarItem[this.model.fields.text]) && (toolbarItem[this.model.fields.text] != "")) {
                //Creating text Content inside the  tag
                litag.append(toolbarItem[this.model.fields.text]);
            }
            if (toolbarItem[this.model.fields.htmlAttributes]) this._setAttributes(toolbarItem[this.model.fields.htmlAttributes], litag);
              if(toolbarItem[this.model.fields.template])
			{
			
			divtag=ej.buildTag('div .e-align' ,toolbarItem[this.model.fields.template]);
			litag.append(divtag);
			}
            return litag;
        },


        _setAttributes: function (data, element) {
            for (var key in data) {
                $(element).attr(key, data[key]);
            }
        },

        _renderToolbarSeparator: function () {
            var i, len;
            if (this.model.enableSeparator) {
                for (i = 0, len = this.itemsContainer.length - 1; i < len; i++) {
                    $(this.itemsContainer[i]).addClass("e-separator");
                }
				if (this.itemsContainer.length == 1) {
                        for (i = 0, len = this.itemsContainer[0].children.length; i < len; i++) {
                            if (i == len - 1) $(this.itemsContainer[0].children[i]).removeClass("e-separator");
                            else
                                $(this.itemsContainer[0].children[i]).addClass("e-separator");
                        }
                    }    
            } else {
                this.itemsContainer.removeClass('e-separator').find('.e-separator').removeClass('e-separator');
            }
            this._setWidth();
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else proxy.element.attr(key, value)
            });
        },


        _enableRTL: function (value) {
            if (value) {
                this.element.addClass('e-rtl');
                this.items.addClass('e-comnrtl');
                if (this.model.orientation == ej.Orientation.Horizontal) {
                    this.itemsContainer.addClass('e-comnrtl');
                }
                if (this._liTemplte) this._liTemplte.addClass('e-rtl');
            } else {
                this.element.removeClass('e-rtl');
                this.items.removeClass('e-comnrtl');
                if (this.model.orientation == ej.Orientation.Horizontal) {
                    this.itemsContainer.removeClass('e-comnrtl');
                }
                if (this._liTemplte) this._liTemplte.removeClass('e-rtl');
            }
            this.model.enableRTL = value;
			this._subControlsSetModel("enableRTL", value);
            this._renderToolbarSeparator();
        },

        _renderTooltip: function (options) {
            var model =$.extend(true, {}, options); 
			if(!ej.isNullOrUndefined(model.cssClass))//which holds the css for the tooltip
				model.cssClass = model.cssClass + " e-toolbarTooltip " + this.model.cssClass;
			else 
				model.cssClass = "e-toolbarTooltip " + this.model.cssClass;
            model.enableRTL = this.model.enableRTL;
			model.showRoundedCorner = this.model.showRoundedCorner;
			model.target ="li[data-content], li[title]" ;
			model.beforeOpen = this._showTooltip;
            this._tipToolbar = $(this.target).ejTooltip(model).data("ejTooltip");
			if(this.model.isResponsive && !ej.isNullOrUndefined(this._liTemplte))
				this._tipRes = $(this._liTemplte).ejTooltip(model).data("ejTooltip");
        },
		_showTooltip : function (e){
			var currentItem = $(e.event.currentTarget), targetItem = e.event.target;
			if (currentItem.hasClass("e-disable"))
				e.cancel = true;
		
		},
		_hideTooltip : function (){
			//tap to select the items, mousemove triggered after the tap, so private variable isHided of Tooltip is set as false
			if(!ej.isNullOrUndefined(this._tipToolbar)){ this._tipToolbar.hide(); this._tipToolbar._isHidden= false;}
			if(!ej.isNullOrUndefined(this._tipRes)){ this._tipRes.hide(); this._tipRes._isHidden = false;}
		},
        _addOverlay: function (element) {
            for (var i = 0; i < element.length; i++) {
                if (!$(element[i]).hasClass('e-disable')) {
                    $(element[i]).addClass('e-disable');
                    var ele = ej.buildTag("div.e-item-overlay");
                    $(element[i]).append(ele);
                }
            }
        },
        _removeOverlay: function (element) {
            for (var i = 0; i < element.length; i++) {
                $(element[i]).children(".e-item-overlay").remove();
            }
        },



        disableItem: function (lielement) {
            var current = $(lielement);
            if ((current == null) || (current.length <= 0)) return;
            if (!current.hasClass("e-disable")) {
                current.attr("aria-disabled", true).removeAttr("aria-label");
                this._addOverlay(current);
            }
            current.removeClass("e-hover e-active").attr("data-aria-selected", false);
        },


        enableItem: function (lielement) {
            var current = $(lielement);
            if ((current == null) || (current.length <= 0)) return;
            current.removeClass("e-disable").attr("aria-disabled", false).removeClass('e-disable');
            this._removeOverlay(current);
        },


        disableItemByID: function (liid) {
            var lielement = this.itemsContainer.find("li#" + liid);
            if ((lielement == null) || (lielement.length <= 0)) return;
            this.disableItem(lielement);
        },

        enableItemByID: function (liid) {
            var lielement = this.itemsContainer.find("li#" + liid);
            if ((lielement == null) || (lielement.length <= 0)) return;
            this.enableItem(lielement);
        },

        _enableItemByIndex: function (indices) {
            var index;
            if (!this.model.enabled) return false;
            if (indices.length != 0) {
                for (var i = 0; i < indices.length; i++) {
                    if ($.inArray(indices[i], this.model.disabledItemIndices) > -1) {
                        index = $.inArray(indices[i], this.model.disabledItemIndices);
                        this.enableItem(this.items[this.model.disabledItemIndices[index]]);
						this.model.disabledItemIndices.splice(index, 1);
                    }

                }
            }
        },

        _disableItemByIndex: function (indices) {
			if (!this.model.enabled) return false;
			this._disabledItems = this.model.disabledItemIndices; 
			for(var i=0; i< indices.length; i++){
				if ($.inArray(indices[i], this.model.disabledItemIndices) < 0)
					this._disabledItems.push(parseInt(indices[i]));
			}
			for (var i = 0; i < this.items.length; i++) {
				if ($.inArray(i, this.model.disabledItemIndices) > -1)
					this.disableItem(this.items[i]);
			}
			this.model.disabledItemIndices = this._disabledItems ;
        },

        disable: function () {
            if (this.element.attr("aria-disabled") == "true") return false;
            this.element.attr("aria-disabled", true).removeAttr("aria-label");
            this._addOverlay(this.items);
            if (this.model.isResponsive && (this.model.orientation == "horizontal"))
                this._spantag.addClass("e-disable");
            this.model.enabled = false;
			this._subControlsSetModel("enabled", false);
        },


        enable: function () {
			this.model.disabledItemIndices = [];
            if (this.element.attr("aria-disabled") == "false") return false;
            this.items.removeClass("e-disable");
            this._removeOverlay(this.items);
            this.element.attr("aria-disabled", false);
            if (this.model.isResponsive && (this.model.orientation == "horizontal"))
                this._spantag.removeClass("e-disable");
            this.model.enabled = true;
			this._subControlsSetModel("enabled", true);
        },


        selectItem: function (lielement) {
            var current = $(lielement);
            if ((current == null) || (current.length <= 0)) return;
            current.addClass("e-active").attr("data-aria-selected", true);
            this._activeItem = $(this.items).index(current);
        },


        deselectItem: function (lielement) {
            var current = $(lielement);
            if ((current == null) || (current.length <= 0)) return;
            current.removeClass("e-active").attr("data-aria-selected", false);
        },

        selectItemByID: function (liid) {
            var lielement = this.itemsContainer.find("li#" + liid);
            if ((lielement == null) || (lielement.length <= 0)) return;
            this.selectItem(lielement);
        },


        deselectItemByID: function (liid) {
            var lielement = this.itemsContainer.find("li#" + liid);
            if ((lielement == null) || (lielement.length <= 0)) return;
            this.deselectItem(lielement);
        },


        removeItem: function (lielement) {
            this.model.disabledItemIndices = [];
            var current = $(lielement);
			var j=0;
            if ((current == null) || (current.length <= 0)) return;
            current.remove();
            this.items = this.itemsContainer.children('li');
			for(var i=0; i< this.items.length ; i++){
				if($(this.items[i]).hasClass("e-disable"))
					this.model.disabledItemIndices [j++] = i;
			}
        },


        removeItemByID: function (liid) {
            var lielement = this.itemsContainer.find("li#" + liid);
            if ((lielement == null) || (lielement.length <= 0)) return;
            this.removeItem(lielement);
        },
        _wireResizing: function () {
            (this.model.isResponsive && (this.model.orientation == "horizontal")) ? $(window).bind('resize', $.proxy(this._reSizeHandler, this)) : this._unWireResizing();
        },

        _unWireResizing: function () {
            $(window).unbind('resize', $.proxy(this._reSizeHandler, this));
        },

        _wireEvents: function () {
            this._on(this.element, "mousedown", this._clickEventHandler);
            this._on(this.element, "focus", this._focusElement);
            this._on(this.element, "blur", this._targetBlur);
            this._on(this.items, "mouseenter", this._onItemHover);
            this._on(this.items, "mouseleave", this._onItemLeave);
            this._on(this.items, "mousedown", this._onItemClick);
            this._on(this.items, "mouseup", this._onItemClick);
        },

        _onItemHover: function (e) {
            var currentItem = $(e.currentTarget), targetItem = e.target;
            if (!currentItem.hasClass("e-disable")) {
                this.items.removeClass("e-hover");
                currentItem.addClass("e-hover");
               var args = { currentTarget: currentItem, target: targetItem, status: this.model.enabled };
                this._trigger("itemHover", args);
            }
			else
				clearTimeout(this._tipToolbar.mouseTimer);
        },

        _onItemClick: function (e) {
            if ($(e.currentTarget).hasClass('e-disable') || e.which!=1) return false; //e.which for Opera
            var currentItem = e.currentTarget, targetItem = e.target;
			if(!ej.isDevice()) this._hideTooltip();
            if (e.type == "mousedown") {
                this._focusEnable = false;
                $(currentItem).addClass('e-active');
                this._focusedItem = this._currentItem = $(currentItem);
				
            }
            else if (e.type == "mouseup") {
                this._removeSelection();
				 if (!$(currentItem).hasClass("e-disable")) {
                    var args = { currentTarget: currentItem, text: $(currentItem).attr("data-content"), target: targetItem, status: this.model.enabled, event: e };
                    if (this.model.isResponsive && this._contstatus && $(currentItem).closest('.e-responsive-toolbar').length > 0)
                        this._activeItem = this._liTemplte.find('.e-tooltxt').index(currentItem);
                    else
                        this._activeItem = $(this.items).index(currentItem);
                    this._trigger("click", args);
                }
               
            }
        },

        _onItemLeave: function (e) {
            var currentItem = $(e.currentTarget), targetItem = e.target;
            if (!currentItem.hasClass("e-disable")) {
                this._removeSelection();
                currentItem.removeClass("e-hover");
               var args = { currentTarget: currentItem, target: targetItem, status: this.model.enabled };
                this._trigger("itemLeave", args);
            }
        },

        _onKeyPress: function(e) {
            var code, items, active, toFocus;
            code = (e.keyCode) ? e.keyCode : (e.which) ? e.which : e.charCode;
            if (this.model.isResponsive && this._liTemplte.find('.e-tooltxt').length > 0) {
                this._keyPressed = true;
                this._items = (this._contstatus) ? this._liTemplte.find('.e-tooltxt') : this.element.find('.e-tooltxt');
                items = this._items.filter('.e-tooltxt:visible:not(.e-hidden, .e-disable)');
            } else {
                this._keyPressed = false;
                items = this.items.filter('.e-tooltxt:visible:not(.e-hidden, .e-disable)');
            }
            if (this._focusedItem) {
                active = this._focusedItem;
                this._focusedItem = null;
            } else
                active = items.filter('.e-hover');
            if(e.type == 'keydown') {
                if(code == 9 && e.shiftKey && $(items[items.index(active) - 1]).length > 0 ){                    
                    e.preventDefault();
                    toFocus = $(items[items.index(active) - 1]);               
                } else if (code == 9 && $(items[items.index(active) + 1]).length > 0) {                    
                    e.preventDefault();
                    toFocus = $(items[items.index(active) + 1]);
                } else if(((code == 38 || code == 39) && this.model.orientation != ej.Orientation.Vertical) || ((code == 39 || code == 40) && this.model.orientation == ej.Orientation.Vertical)) {
                    e.preventDefault();
                    toFocus = $(items[items.index(active) + 1]).length > 0 ? $(items[items.index(active) + 1]) : items.first();
                } else if(((code == 37 || code == 40) && this.model.orientation != ej.Orientation.Vertical) || ((code == 37 || code == 38) && this.model.orientation == ej.Orientation.Vertical)) {
                    e.preventDefault();
                    toFocus = $(items[items.index(active) - 1]).length > 0 ? $(items[items.index(active) - 1]) : items.last();
                } else if(code == 33 || code == 36) {
                    e.preventDefault();
                    toFocus = items.first();
                } else if(code == 34 || code == 35) {
                    e.preventDefault();
                    toFocus = items.last();
                }
                if(toFocus) {
                    this._removeListHover();
                    toFocus.addClass('e-hover');
                }
            } else {
                switch(code) {
                    case 33: case 34: case 35: case 36: case 37: case 38: case 39: case 40: break;
                    case 13: case 32:
                        e.preventDefault();
                        if (!active[0])
                            break;
                        var args = { currentTarget: active[0], target: $(active)[0], status: this.model.enabled, event: e };
                        this._trigger("click", args);
                        this._removeListHover();
                        break;
                    case 27:
                        e.preventDefault();
                        this.element.blur();
                        break;                    
                }
            }
        },

        _removeListHover: function () {
            $(this.items).removeClass("e-hover");
        },

        _addListHover: function () {
            var activeItem = this._getActiveItem();
            if (!activeItem.hasClass('e-disable'))
                activeItem.addClass("e-hover").focus();
        },

        _getActiveItem: function () {
            if (this.model.isResponsive && this._keyPressed)
                return $(this._items[this._activeItem]);
            else
                return $(this.items[this._activeItem]);
        },

        _targetBlur: function (e) {
            e.preventDefault();
            this.element.focusout().removeClass("e-focus");
            this._removeListHover();
            this._off(this.element, "keyup", this._onKeyPress)
                ._off(this.element, "keydown", this._onKeyPress);
            this._trigger("focusOut");
        },

        _clickEventHandler: function (e) {
            this._clicked = true;
        },

        _removeSelection: function() {
            (this._currentItem && this._currentItem.attr("data-aria-selected") != "true") && this._currentItem.removeClass('e-active');
        },

        _focusElement: function (e) {
		    if(!this.element.hasClass("e-focus")){
				this.element.addClass("e-focus");
				this._on(this.element, "keyup", this._onKeyPress)
					._on(this.element, "keydown", this._onKeyPress);
				if (!this._focusEnable) {
					this._focusEnable = true;
					return;
				}
			}
            this._removeListHover();
            this._activeItem = (this._clicked) ? -1 : 0;
            if (this._getActiveItem().hasClass('e-disable') || this._getActiveItem().is(':hidden'))
                this._activeItem = $(this.items).filter('li:not([class*="e-disable"])').first().index();
            this._addListHover();
        },
    });
ej.Toolbar.ResponsiveType = {
        /**  Renders overflow popup with hamburger icon as usual. */
        Popup:"popup",
        /**  Renders overflow popup  below the toolbar itself on clicking the arrow. */
        Inline: "inline"
    };
	
})(jQuery, Syncfusion);


