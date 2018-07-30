/**
* @fileOverview Plugin to style the Menu control.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejMenu", "ej.Menu", {

        element: null,

        model: null,
        validTags: ["ul"],
        _setFirst: false,
        _rootCss: "e-menu",
        angular: {
            terminal: false
        },


        defaults: {

            height: "",

            width: "",

            animationType: "default",

            orientation: ej.Orientation.Horizontal,

            menuType: "normalmenu",
			
			isResponsive: true,

            contextMenuTarget: null,

            htmlAttributes: {},

            cssClass: "",

            openOnClick: false,

            subMenuDirection: "none",

            enableCenterAlign: false,

            showRootLevelArrows: true,

            showSubLevelArrows: true,

            enableAnimation: true,
            
            container: null,

            enableSeparator: true,

            enabled: true,

            overflowHeight: "auto",

            overflowWidth: "auto",

            fields: {

                child: null,

                dataSource: null,

                query: null,

                tableName: null,

                id: "id",

                parentId: "parentId",

                text: "text",

                spriteCssClass: "spriteCssClass",

                url: "url",

                imageAttribute: "imageAttribute",

                htmlAttribute: "htmlAttribute",

                linkAttribute: "linkAttribute",

                imageUrl: "imageUrl",
            },

            enableRTL: false,

            titleText: "Menu",

            locale: "en-US",

            excludeTarget: null,

            beforeOpen: null,

            open: null,

            close: null,

            mouseover: null,

            mouseout: null,

            click: null,

            keydown: null,

            overflowOpen: null,

            overflowClose:null,

            create: null,

            destroy: null
        },

        dataTypes: {
            animationType: "enum",
            cssClass: "string",
            titleText: "string",
            locale: "string",
            openOnClick: "boolean",
            enabled: "boolean",
            enableCenterAlign: "boolean",
            showArrow: "boolean",
            showRootLevelArrows: "boolean",
            showSubLevelArrows: "boolean",
            enableSeparator: "boolean",
			isResponsive: "boolean",
            enableRTL: "boolean",
            enableAnimation: "boolean",
            fields: {
                dataSource: "data",
                query: "data",
                child: "data"
            },
            excludeTarget: "string",
            htmlAttributes: "data"
        },


        _setModel: function (jsondata) {
            for (var key in jsondata) {
                switch (key) {
                    case "menuType":
                        jsondata[key] = this.model.menuType;
                        break;
                    case "fields":
                        this._wireEvents("_off");
                        this.element.empty().insertBefore(this.wrapper);
                        this.wrapper.remove();
                        $.extend(this.model.fields, jsondata[key]);
                        this._intializeData();
                        if (!this.model.enabled)
                            this._wireEvents("_off");
                        break;
                    case "orientation": this._setOrientation(jsondata[key]); break;
                    case "showRootLevelArrows": this._addArrow(jsondata[key], this.model.showSubLevelArrows); break;
                    case "showSubLevelArrows": this._addArrow(this.model.showRootLevelArrows, jsondata[key]); break;
                    case "enableSeparator": this._setSeparator(jsondata[key]); break;
                    case "height": this._setHeight(jsondata[key]); break;
                    case "width": this._setWidth(jsondata[key]); break;
                    case "cssClass": this._setSkin(jsondata[key]); break;
                    case "isResponsive":
                        if (this.model.isResponsive)
                            this._responsiveLayout();
                        else {
                            $(this.resWrap).remove();
                            $(this.wrapper).removeClass("e-menu-responsive");
                            $(this.element).removeClass("e-menu-responsive");
                            this.resWrap = null;
                        }
                        break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "enableRTL": this._setRTL(jsondata[key]); break;
                    case "enableCenterAlign": this._centerAlign(jsondata[key]); break;
                    case "excludeTarget": this.model.excludeTarget = jsondata[key];
                        break;
                    case "enabled": this.model.enabled = jsondata[key]; this._controlStatus(jsondata[key]); break;
                    case "animationType":
                        this._setAnimation(jsondata[key]);
                        break;
                    case "enableAnimation": this.model.enableAnimation = jsondata[key]; break;
                    case "openOnClick":
                            this._hoverOpen = !jsondata[key];
                            this._hoverClose = !jsondata[key]; 
                        break;
                    case "subMenuDirection": this._setSubMenuDirection(this.model.subMenuDirection); break;
                    case "titleText":
						this._titleText(jsondata[key]);
                        break;
                    case "locale":
                        this.model.locale = jsondata[key];
                        this._updateLocalConstant();
                        this._setLocale();
                        break;
                    case "overflowHeight":                       
                            this._setOverflowDimensions("height",jsondata[key]); break;
                    case "overflowWidth":                      
                        this._setOverflowDimensions("width",jsondata[key]); break;

                }
            }
        },
        _updateLocalConstant: function () {
            this._localizedLabels = ej.getLocalizedConstants("ej.Menu", this.model.locale);
        },
        		
        _setLocale: function () {
            this._titleText(this._localizedLabels.titleText);
        },
        _titleText: function(val){
            if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical"))
                $(this.label).text(val);
        },

        _destroy: function () {
            this.model.menuType == ej.MenuType.ContextMenu ? this._referenceElement.append(this._cloneElement) : this._cloneElement.insertBefore(this.wrapper);
            this._cloneElement.removeClass('e-menu e-js');
            this.wrapper.remove();
        },


        _init: function () {
            this._cloneElement = this.element.clone();
            this.element.css("visibility", "hidden");
            this._setValues();
            this._intializeData();
            this.element.css("visibility", "visible");
        },

        _setValues: function () {
            this._mouseOver = true;
            this._hoverOpen = true;
            this._hoverClose = true;
            this._isMenuOpen = false;
            this._hideSpeed = 100;
            this._showSpeed = 100;
            this._isSubMenuOpen = false;
            this._isContextMenuOpen = false;
            this._disabledMenuItems = new Array();
            this._hiddenMenuItems = new Array();
            this._delayMenuHover = 0;
            this._delaySubMenuHover = 0;
            this._delaySubMenuShow = 0;
            this._preventContextOpen = true;
            this._setAnimation(this.model.animationType);
            this._isFocused = true;
            this._menuOverflowItems = new Array();
            this._menuHeaderItems = new Array();
            this._menuCloneItems = new Array();
            this._itemWidth = 0; 
        },
        _intializeData: function () {
            if (!ej.isNullOrUndefined(this.model.fields) && this.model.fields["dataSource"] != null) {
                this._generateTemplate(this.model.fields["dataSource"]);
                this._renderMenu();
            }
            else {
                this._renderMenu();
                this._wireEvents("_on");
                this._calculateOverflowItems();
            }
        },
        _renderMenu: function () {
            this._renderControl();
            this._addArrow(this.model.showRootLevelArrows, this.model.showSubLevelArrows);
			this._renderArrow();
			this._intializeMenu();
            //item Width for width property		
			    this._itemWidth = this.element.width();
			    if (this.model.isResponsive) {
			        this._ensureResponsiveClasses($(window).width() < 767);
			    }
			    if (this.model.orientation == "horizontal") {
			        this._on(this.element.parent().find("span.e-check-wrap.e-icon"), "click", this._mobileResponsiveMenu);
			        if(this.model.fields["dataSource"] != null) this._calculateOverflowItems();
			    }
        },      

        _renderControl: function () {
            var label, checkBox, checkObj, list, spanlist, i;
            if (this.model.menuType == "normalmenu") {
                this.wrapper = ej.buildTag("div");
                this.wrapper.addClass(this.model.cssClass + " e-menu-wrap");
            } else
                this.wrapper = ej.buildTag("div.e-menu-wrap");
            if (this.model.isResponsive) this._responsiveLayout();
            if (this.model.menuType != ej.MenuType.ContextMenu) {
                this.wrapper.insertBefore(this.element);
                this.wrapper.append(this.element);
                }            
            this.element.addClass("e-menu e-widget e-box").attr({ "role": "menu", "tabindex": 0 });
            this._addAttr(this.model.htmlAttributes);
            if (this.model.enableRTL) this._setRTL(this.model.enableRTL);
            this._setSubMenuDirection(this.model.subMenuDirection);
            if (this.model.menuType == "normalmenu") {
                this.model.orientation == "horizontal" ? this.element.addClass("e-horizontal") : this.element.addClass("e-vertical");
            }
            //For ContextMenu Mode
            else this._contextMenu_Template();
            this._addClass();
            if (this.model.enableCenterAlign) this._centerAlign(this.model.enableCenterAlign);
            if (this.model.enableSeparator) this._setSeparator(true);
            (!this.model.enabled) && this.disable();
        },
        _renderPopupWrapper: function (e) {
            if(this._ensureOverflowPopup()){                          
                this.popupWrapper = ej.buildTag("div.e-menu-popwrap");                         
                this.popupWrapper.insertAfter(this.element);              
                var height = typeof value === "number" ? this.model.overflowHeight + "px" :this.model.overflowHeight;
                var width = typeof value === "number" ? this.model.overflowWidth + "px" : this.model.overflowWidth;
                this.popupWrapper.css({ "height": height,"width":width});
                this.popupWrapper.hide();
                this._addOverflowItems();                
            }
        
        },
        _calculateOverflowItems: function (e) {        
            if (this._ensureOverflowPopup()) {
                this.element.find("li.e-list").removeClass("e-menu-show");
                $(this.lastelement).removeClass("e-last");
                this._menuHeaderItems = [];  
                var menuHeaderWidth = this.element.outerWidth();               
                if (this.element.find("li.e-ham-wrap").length > 0) //for window resizing event neglect the hamburger icon list from the listCollection
                {                   
                    if ((this._itemWidth<=this.element.width())||(this._itemWidth>=this.element.width()) && (!(this._isOverflowPopupOpen()))) {
						if(!ej.isNullOrUndefined(this.popupWrapper))
							this.popupWrapper.hide();                        
                    }
                }
				this._renderHamburgerIcon();	
				this.element.find("li.e-ham-wrap").css({display: 'list-item'});
                var hamburgerWidth = this.element.find("li.e-ham-wrap").outerWidth(), itemsOuterWidth = 0, hideState=true;
				this.element.find("li.e-ham-wrap").hide();
                this._menuHeaderItems = this.element.find(">li.e-list");
                this._menuOverflowItems = [];
                for ( var i = 0; i < this._menuHeaderItems.length; i++) {
                   var menuItem = $(this._menuHeaderItems[i]);                                        
                        itemsOuterWidth = itemsOuterWidth + menuItem.outerWidth();
                        if (itemsOuterWidth < menuHeaderWidth) {                      
                            menuItem.removeClass('e-menu-hide');
							this.element.find(">li.e-list.e-haschild>ul").find("li.e-haschild").find("span.e-icon.e-arrowhead-down").removeClass("e-arrowhead-down").addClass("e-arrowhead-right");
                            if (this.model.enableSeparator) this._setSeparator(true);                  
                        }
                        else {
							if(hideState)
							{
								hideState=false;
								this.element.find("li.e-ham-wrap").css({display: 'list-item'}); 
								itemsOuterWidth = itemsOuterWidth - menuItem.outerWidth() + hamburgerWidth;
								if(i>1){
									(itemsOuterWidth = itemsOuterWidth - $(this._menuHeaderItems[i-1]).outerWidth());
									i=i-2;
								}								
								continue;
							}
                            this._menuOverflowItems.push($(menuItem).clone(true));                            
                            menuItem.addClass('e-menu-hide');                            
                        }
                }            
                if (this._menuOverflowItems.length>0) {
                    this._renderHamburgerIcon();
                    $('.e-menu-popwrap').length ?  this._addOverflowItems():  this._renderPopupWrapper();                     
                    this.lastelement = this.element.find('>li.e-list:visible').last().addClass('e-last');
                    this.element.find(">li.e-list.e-haschild>ul").find("li.e-haschild").find("span.e-icon.e-arrowhead-down").removeClass("e-arrowhead-down").addClass("e-arrowhead-right");            
                }
                else if (this._menuOverflowItems.length == 0 && $("li.e-ham-wrap").length > 0) {
                    this.element.find("li.e-ham-wrap").remove();
                }

            }           
            if (this.model.orientation == "vertical" || this.model.menuType == ej.MenuType.ContextMenu && ($(window).width() >= 768) && (this.model.isResponsive)) {
                this.element.find("span.e-icon.e-arrowhead-down").removeClass('e-arrowhead-down').addClass('e-arrowhead-right');
            }
            

        },
        _renderHamburgerIcon: function () {
            if((this._ensureOverflowPopup())&& (this.element.find("li.e-ham-wrap").length==0)){            
                var liTag = ej.buildTag("li.e-ham-wrap");
                var divTag = ej.buildTag("div");
                this.hamburgerspan = ej.buildTag('span.e-hamburger');                                                     
                divTag.append(this.hamburgerspan);
                liTag.append(divTag);    
                this.element.append(liTag);
                //to set border
                if (this.model.height != 0) this._setHeight(this.model.height);
                else {                       
                    $("li.e-ham-wrap").css({"height":this.element.find("li.e-list").first().height()});
                }
                //button click event
                this._on(this.element.find("li.e-ham-wrap"), "click", this._overflowOpen);                
            }
        },
        _addOverflowItems: function () {
            if ((this._ensureOverflowPopup()) && ($('.e-menu-popwrap').length>0)) {
				if(!ej.isNullOrUndefined(this.popupWrapper)){
					this.popupWrapper.empty();
					this._menuCloneItems.length = 0;                
					for (var i = 0; i < this._menuOverflowItems.length; i++) {
						this._menuCloneItems.push($(this._menuOverflowItems[i]).clone(true));                    
					}
					this.ulTag = ej.buildTag("ul");
					this.ulTag.addClass("e-menu e-js e-responsive e-widget e-box e-vertical");
					this.popupWrapper.append(this.ulTag);
					for (var i = 0; i < this._menuCloneItems.length; i++) {
						if ($(this._menuCloneItems[i]).hasClass('e-haschild')) {
							$(this._menuCloneItems[i]).find('span.e-icon').removeClass('e-arrowhead-down e-arrowhead-right').addClass('e-arrowhead-down');
							$(this._menuCloneItems[i]).children('span.e-menu-arrow.e-menu-left').remove();                       
						}
						this.ulTag.append(this._menuCloneItems[i]);
					}
					$(this.ulTag).children("li").removeClass("e-menu-hide");
					//to set width of ULTag          
					var popupWidth = Math.round(this.popupWrapper.width());
					if (popupWidth>0) {
						var popupWrapperWidth = this.popupWrapper.innerWidth();
						this.popupWrapper.find("ul.e-menu").css({ "width":popupWrapperWidth+ "px" });                
					}
					//to set the separator                  
					if (this.model.enableSeparator) this._setSeparator(true);                    
				}
            }         
        },
        _overflowOpen: function (e) {           
            if(this._isOverflowPopupOpen ()){   
                //set popup wrapper left position 
                 var location = ej.util.getOffset(this.element);
					var left = location.left + (this.model.enableRTL? 0 :(this.element.outerWidth() - this.popupWrapper.outerWidth()));
					var top = location.top + this.element.outerHeight();
					
					if(this.wrapper.parent().length && (this.wrapper.parent().css("position") == "absolute" || this.wrapper.parent().css("position") == "relative"))
					{
						location = ej.util.getOffset(this.wrapper.parent());
						left = left-location.left;
						top = top-location.top;
					}						
					this.popupWrapper.css({ "left": left,"top":top});                          
                this.popupWrapper.show();                                
                this._trigger("overflowOpen",  {e:e});
            }
            else {
                this._overflowClose(e);
            }
        },           
        _overflowClose: function (e) {
            if(this._ensureOverflowPopup() && !ej.isNullOrUndefined(this.popupWrapper)){            
                this.popupWrapper.find("li.e-list").removeClass(".e-mhover.e-active.e-mfocused");
                this._hideAnimation(this.popupWrapper.find('li.e-list:has("> ul")').find('> ul:visible'), this._hideAnim);
                this.popupWrapper.hide();                               
                this._trigger("overflowClose", { e: e });
            }
        },
        _isOverflowPopupOpen: function () {
		       if($(this.popupWrapper).length>0)
            return this.popupWrapper.css("display")=="none";           
        },
        _removePopup:function(e){
            if(($(window).width()<767)&& (this.model.isResponsive)){
			        this._ensureResponsiveClasses($(window).width());
                if ((this.element.find("li.e-ham-wrap").length > 0) && (this.popupWrapper.length>0)){
                    this.element.find("li.e-ham-wrap").remove();
                    $('.e-menu-popwrap').remove();                   
                    this.element.find("li.e-list").addClass("e-menu-show");             
                }
            }          
        },      
        _mobileResponsiveMenu:function(e){            
            if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical") && ((this.element.css("display")=="none"))) {
                    this.element.removeClass("e-res-hide").addClass("e-res-show");                 
                }
            else if((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical") && (!(this.element.css("display")=="none")))
                {
                    this.element.removeClass("e-res-show").addClass("e-res-hide");                    
                }          
        },
        _ensureOverflowPopup:function(e){
            return (this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical") && ($(window).width() >= 768) && (this.model.isResponsive);                
        },
        _onResize:function(e){
			this.element.find("li.e-ham-wrap").hide(); 
            $(window).width()>=768 ? this._calculateOverflowItems() : this._removePopup();
        },
        _ensureResponsiveClasses:function(viewport){
            if (viewport && this.element.find("span.e-icon").hasClass("e-arrowhead-right") ) this.element.find("span.e-icon.e-arrowhead-right").removeClass('e-arrowhead-right').addClass('e-arrowhead-down');            
        },

        _responsiveLayout: function () {
            if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical")) {
                this.wrapper.addClass("e-menu-responsive");
                this.element.addClass("e-menu-responsive")
                this.resWrap = ej.buildTag('span.e-menu-res-wrap e-menu-responsive');
                this.inResWrap = ej.buildTag('span.e-in-wrap e-box e-menu-res-in-wrap');
                this.label = ej.buildTag('span.e-res-title').html(this.model.locale == "en-US" ? this.model.titleText : (ej.Menu.Locale[this.model.locale] && ej.Menu.Locale[this.model.locale].titleText)?ej.Menu.Locale[this.model.locale].titleText:this.model.titleText);
                this.check = ej.buildTag('span.e-check-wrap e-icon');
                this.wrapper.append(this.resWrap)
                this.resWrap.append(this.inResWrap);
                this.inResWrap.append(this.label).append(this.check);
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else proxy.element.attr(key, value)
            });
        },

        _oncheck: function (e) {
            var obj = this.element.parents('.e-menu-wrap').children('.e-menu');
            e.isChecked ? obj.removeClass('e-res-hide').addClass('e-res-show') : obj.removeClass('e-res-show').addClass('e-res-hide');
        },
        _addClass : function (){
            //Adding arrows to items with sub items
            this.element.find('li:has("> ul")').find('> a,> span').addClass('aschild');
            this.element.find('>li').addClass('e-list').attr({ "role": "menuitem" });
			this.element.find('li').find(">a, >span").addClass('e-menulink');
            var list = this.element.find('.e-list a.aschild');
            var spanlist = this.element.find('.e-list span.aschild');
            var listElement, spanElement;
            for ( var i = 0; i < list.length; i++) {
                listElement = $(list[i]);
                listElement.siblings().attr({ "aria-hidden": true });
                listElement.parent().attr({ "aria-haspopup": true, "role": "menuitem" }).addClass("e-haschild");
                listElement.siblings('ul').children('li').addClass('e-list').attr("role", "menuitem");
            }
            for ( var i = 0; i < spanlist.length; i++) {
                spanElement = $(spanlist[i]);
                spanElement.siblings().attr({ "aria-hidden": true });
                spanElement.parent().attr({ "aria-haspopup": true, "role": "menu" }).addClass("e-haschild");
                spanElement.siblings('ul').children('li').addClass('e-list').attr("role", "menuitem");
            }
        },
		_renderArrow : function(){
			 if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical")) {
				if( $($(this.element).find("span.e-menu-arrow")).length == 0){
					var arrow = ej.buildTag("span.e-menu-arrow e-menu-left");
					$(arrow).append("<span class='e-arrowMenuOuter'></span>").append("<span class='e-arrowMenuInner'></span>");
					this.element.find('>li.e-list.e-haschild').append(arrow);
				}
			 }
		},
        _generateTemplate: function (data) {
            var proxy = this, queryPromise;
            if (data instanceof ej.DataManager) {
                queryPromise = data.executeQuery(this._columnToSelect(this.model.fields));
                queryPromise.done(function (e) {
                    proxy._odataFlag = true;
                    proxy._generateItemTemplate(e.result);
                    if (proxy.model.height != 0) proxy._setHeight(proxy.model.height);
                    proxy._wireEvents("_on");
                });
            } else {
                proxy._odataFlag = false;
                this._generateItemTemplate(proxy.model.fields['dataSource']);
                this._wireEvents("_on");
            }
        },

        _generateItemTemplate: function (items) {
            for (var i = 0; i < items.length; i++) {
                if ((items[i][this.model.fields.parentId] == null) || (items[i][this.model.fields.parentId] == 0)) {
                    var subItem = this._menuTemplate(items[i], items, this.model.fields);
                    this.element.append(subItem);
                }
            }
        },

        _menuTemplate: function (item, tableData, mapper) {
            var liTag, aTag, imgTag, spanTag;
            liTag = $(document.createElement('li'));
            liTag.attr("class", 'e-list');
            if (item[mapper.htmlAttribute]) this._setAttributes(item[mapper.htmlAttribute], liTag);
			aTag = $(document.createElement('a'));
			aTag.attr("class", 'e-menulink');
			if (item[mapper.imageUrl] && item[mapper.imageUrl] != "") {
				imgTag = $(document.createElement('img'));
				imgTag.attr('src', item[mapper.imageUrl]);
				if (item[mapper.imageAttribute]) this._setAttributes(item[mapper.imageAttribute], imgTag);
				aTag.append(imgTag);
			}
			else if (item[mapper.spriteCssClass] && item[mapper.spriteCssClass] != "") {
				spanTag = $(document.createElement('span'));
				spanTag.addClass(item[mapper.spriteCssClass]);
				aTag.append(spanTag);
			}
			aTag.append(item[mapper.text]);
			if (item[mapper.linkAttribute]) this._setAttributes(item[mapper.linkAttribute], aTag);
			if (item[mapper.url])
				aTag.attr('href', item[mapper.url]);
			liTag.append(aTag);
            if (item[mapper.id]) {
                liTag.prop("id", item[mapper.id]);
            }
            if (!ej.isNullOrUndefined(mapper["child"])) {
                this._odataFlag = true;
                if (mapper["child"]["dataSource"] instanceof ej.DataManager) {
                    var proxy = this, queryManager = ej.Query();
					$(liTag).attr({ "aria-haspopup": true, "role": "menu" }).addClass("e-haschild");
                    queryManager = this._columnToSelect(mapper["child"]);
                    queryManager.where(mapper["child"]["parentId"], ej.FilterOperators.equal, item[mapper.id]);
                    var queryPromise = mapper["child"]["dataSource"].executeQuery(queryManager);
                    queryPromise.done(function (e) {
                        var childItems = e.result;
                        if (childItems && childItems.length > 0) {
                            var ul = $(document.createElement('ul'));
                            for (var i = 0; i < childItems.length; i++) {
                                var liItem = proxy._menuTemplate(childItems[i], mapper["child"]["dataSource"], mapper["child"]);
                                ul.append(liItem);
                            }
                            liTag.append(ul);
                            $(liTag).children('a').addClass('aschild');
                            if ($(liTag).parent().hasClass('e-menu') && (proxy.model.showRootLevelArrows))
                                $(liTag).children('a.aschild').append($('<span>').addClass("e-icon e-arrowhead-down")).addClass("e-arrow-space");
                            else if (proxy.model.showSubLevelArrows)
                                $(liTag).children('a.aschild').append($('<span>').addClass("e-icon e-arrowhead-right")).addClass("e-arrow-space");
                            if (proxy.model.height != 0) proxy._setHeight(proxy.model.height);
                        }
                    });
                    queryPromise.then(function (e) {
                        proxy._renderArrow();
                    });
                }
                else {
					var childItems;
					if(!ej.isNullOrUndefined(item.child)){
						if(ej.isPlainObject(item.child))
							childItems = ej.DataManager(mapper["child"]["dataSource"]).executeLocal(ej.Query().where(mapper["child"]["parentId"], ej.FilterOperators.equal, item[mapper.id]));
						else if(item.child instanceof Array)
							childItems =  item.child;
					}	
                    if (childItems && childItems.length > 0) {
                        var ul = $(document.createElement('ul'));
                        for (var i = 0; i < childItems.length; i++) {
                            var liItem = this._menuTemplate(childItems[i], mapper["child"]["dataSource"], mapper["child"]);
                            ul.append(liItem);
                        }
                        liTag.append(ul);
                    }
                }
            }
            else if (!this._odataFlag) {
                var childItems = ej.DataManager(mapper["dataSource"]).executeLocal(ej.Query().where(mapper["parentId"], ej.FilterOperators.equal, item[mapper.id]));
                if (childItems && childItems.length > 0) {
                    var ul = ej.buildTag('ul');
                    for (var i = 0; i < childItems.length; i++) {
                        var liItem = this._menuTemplate(childItems[i], mapper["dataSource"], mapper);
                        ul.append(liItem);
                    }
                    liTag.append(ul);
                }
            }
            return liTag;
        },

        _setAttributes: function (data, element) {
            for (var key in data) {
                if (key == "class")
                    element.addClass(data[key]);
                else
                    element.attr(key, data[key]);
            }
        },

        _addArrow: function (topArrows, bottomArrows) {
            if (topArrows) {
				var arrowIcon = (this.model.orientation == "horizontal") ? "e-arrowhead-down" : "e-arrowhead-right";
				this.element.find('>li.e-list:has("> ul")').children('a').append($('<span>').addClass("e-icon "+arrowIcon)).addClass("e-arrow-space");
			}
            else {
                this.element.find('>li.e-list:has("> ul")').children('a').removeClass("e-arrow-space").children('span.e-icon').remove();
            }

            if (bottomArrows)
                this.element.find('>li.e-list > ul li.e-list:has(>ul)').children('a').append($('<span>').addClass("e-icon e-arrowhead-right")).addClass("e-arrow-space");
            else {
                this.element.find('>li.e-list > ul li.e-list:has(>ul)').children('a').removeClass("e-arrow-space").children('span.e-icon').remove();
            }

        },

        _intializeMenu: function () {
            if (this.model.height != 0) this._setHeight(this.model.height);
            if (this.model.width != 0) this._setWidth(this.model.width);
            if (this.model.menuType == "contextmenu")
                this.model.openOnClick = false;
            if (this.model.openOnClick) {
                this._hoverOpen = false;
                this._hoverClose = false;
            }
        },

        _setOrientation: function (val) {
            if (val == "horizontal") {
                this.element.removeClass("e-vertical e-horizontal").addClass("e-horizontal");
            } else {
                this.element.removeClass("e-horizontal e-vertical").addClass("e-vertical");
            }
            if (val == "vertical") {
                this._removePopup();
            }
        },

        _setHeight: function (value) {
            if (this.model.orientation == "horizontal" && value !=="auto") {
                value = typeof value === "number" ? value + "px" : value;
                this.element.find('> li').find('>a:first').css("line-height", value);
                if (this.model.showRootLevelArrows)
                    this.element.find('> li').find('>a:first').find('> span:first').css({ "line-height": value, "top": "0px" })
                if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical")){
                    if ($("li.e-ham-wrap").length > 0) {                        
                        this.element.find("li.e-ham-wrap").children("div").css({ "line-height": value });
                        this.element.find("li.e-ham-wrap").css({ "height": value });
                        if($(".e-menu-popwrap").length>0)
                        this.popupWrapper.find("a.e-menulink").css({ "line-height":value });                        
                    }
                }
            }
            else
                this.element.height(value);
        },

        _setWidth: function (value) {
            this.element.css("width", value);
            if (this.model.orientation === "horizontal" && value !== "auto") {
                if (this.model.isResponsive)
                    this.resWrap.css("width", value);
            }
            if (this.model.orientation == "horizontal" &&  ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical")) ) {
                this._calculateOverflowItems();
            }
            
        },        
        _setOverflowDimensions:function(property,value){
            if ((this.model.menuType != ej.MenuType.ContextMenu) && (this.model.orientation != "vertical"))
                value = typeof value == "number" ? value + "px" : value;
                if (property == "height") this.popupWrapper.css({ height: value });
                else if (property == "width") this.popupWrapper.css({ width: value });                           
                this._addOverflowItems();
        },

        _setRTL: function (isRTL) {
            if (isRTL) {
                this.element.removeClass("e-rtl").addClass("e-rtl");
            } else {
                this.element.removeClass("e-rtl");
            }
            if (isRTL && this.model.orientation === "horizontal")
                this.wrapper.removeClass("e-menu-rtl").addClass("e-menu-rtl");
            else
                this.wrapper.removeClass("e-menu-rtl");
			this.model.subMenuDirection = isRTL ? "left" : "right";
        },

        _setSubMenuDirection: function (direction) {
            if (direction != "left" && direction != "right")
                this.model.subMenuDirection = this.model.enableRTL ? "left" : "right";
        },

        _setAnimation: function (value) {
            value === "none" ? (this._showAnim = "none", this._hideAnim = "none") : (this._showAnim = "slideDown", this._hideAnim = "slideUp");
        },

        _controlStatus: function (value) {
            value != true ? this.disable() : this.enable();
        },

        _centerAlign: function (enableCenterAlign) {
            if (this.model.orientation == "horizontal" && enableCenterAlign)
                this.element.css('text-align', 'center');
            else
                this.element.css('text-align', 'inherit');
        },
        _columnToSelect: function (mapper) {
            var column = [], queryManager = ej.Query();
            if (ej.isNullOrUndefined(mapper.query)) {
                for (var col in mapper) {
                    if (col !== "tableName" && col !== "child" && col !== "dataSource" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!this.model.fields["dataSource"].dataSource.url.match(mapper.tableName + "$"))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            }
            else
                queryManager = mapper.query;
            return queryManager;
        },


        _max_zindex: function () {
            var parents, bodyEle, maxZ, index;
            if (this.model.menuType == "contextmenu") {
                parents = $(this._targetElement).parents();
                parents.push(this._targetElement);
            }
            else
                parents = $(this.element).parents();
            bodyEle = $('body').children(), index = bodyEle.index(this.popup);
            bodyEle.splice(index, 1);
            $(bodyEle).each(function (i, ele) { parents.push(ele); });
            maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
            }));
            if (!maxZ || maxZ < 10000) maxZ = 10000;
            else maxZ += 1;
            return maxZ;

        },

        _recursiveFunction: function (items, menuText) {
            var context = this;
            var isFound = false;
            $.each(items, function (key, value) {
                if (value.Text == menuText) {
                    context.selectedItem = value;
                    isFound = true;
                    return false;
                }
                else if (value.ChildItems != null) {
                    context._recursiveFunction(value.ChildItems, menuText);
                }
                if (isFound)
                    return false;
            });
        },

        _contextMenu_Template: function () {
            if(this.element[0].id !="")
            var oldWrapper = $(".e-menu-wrap #" + this.element[0].id).get(0);
            if (oldWrapper)
                $(oldWrapper.parentElement).remove();
            this.model.orientation = "vertical";
            this.element.addClass(this.model.cssClass + " e-context");
			 this.element.css("display", "none");
            this._referenceElement = this.element.parent();
            $("body").append(this.element);
            this.wrapper.insertBefore(this.element);
            this.wrapper.append(this.element);
        },

        _closeMenu: function () {
            this._hideAnimation(this.element.find('li.e-list:has("> ul")').find('> ul:visible'), this._hideAnim);
        },

        _onMenuIntent: function (element, obj, canOpen) {
            obj._delayMenuHover = window.setTimeout(function () {
                if (obj._mouseOver == true && canOpen) {
                    var showanim = obj._showAnim;
                    var hideanim = obj._hideAnim;
                    var showSpeed = obj._showSpeed;
                    var hideSpeed = obj._hideSpeed;
                    obj._show(element, showanim, hideanim);
                }
            }, this._showSpeed);
        },

        _onHide: function (element, obj, canHide) {
            obj._delaySubMenuHover = window.setTimeout(function () {
                if (obj._mouseOver == false && canHide) {
                    var id = obj._id;
                    var hideanim = obj._hideAnim;
                    var hideSpeed = obj._hideSpeed;
                    obj._closeAll();
                }

            }, obj._hideSpeed);
        },

        _subMenuPos: function (element, direction) {
            var pos = $(element).offset();
            var subMenuLeft, subMenuRight ;
            var posLeft = pos.left;
            var subMenu = $('ul:first', element);
            var menuWidth = $(element).outerWidth();
            if (pos == null || pos == undefined)
                return false;
            var submenuWidth = subMenu.outerWidth() + 1; // +1 for the space between menu and submenu
            var left = this.model.container ? $(this.model.container).width() + $(document).scrollLeft() : document.documentElement.clientWidth + $(document).scrollLeft();
            if (this.model.menuType == "normalmenu") {
                if ($(element.parentNode).is(this.element)) {
                    if (this.model.orientation == "horizontal"){
                        subMenu.css("top", $(element).outerHeight() + "px");
                        if (!this.model.enableRTL) {
                            subMenuLeft = (left < (posLeft + submenuWidth)) ? ((posLeft + submenuWidth) - left) : 1;
                            subMenu.css("left", (subMenuLeft *(-1)) + "px");
                        }
                        else {
                            subMenuRight = (((posLeft + menuWidth) - submenuWidth) < 0) ? ((posLeft + menuWidth) - submenuWidth) : 1;
                            subMenu.css({ "left": "auto", "right": subMenuRight + "px" });
                        }
                    }
                    else if ((direction == "left" && posLeft > submenuWidth) || (direction == "right" && left <= pos.left + menuWidth + submenuWidth &&  posLeft > submenuWidth))
                        subMenu.css("left", -(submenuWidth + 4) + "px");
                    else {
                        subMenu.css("left", ($(element).outerWidth() + 4) + "px");
                    }
                } else if ((direction == "left" && posLeft > submenuWidth) || (direction == "right" && left <= pos.left + menuWidth + submenuWidth &&  posLeft > submenuWidth)) {
                    subMenu.css("left", -(submenuWidth + 4) + "px");
                }
                else {
                    subMenu.css("left", ($(element).outerWidth() + 4) + "px");
                    var submenuHeight = subMenu.outerHeight();
                    var winHeight = $(window).height();
                    var submenuTop = (winHeight - (pos.top - $(window).scrollTop()));
                    if (winHeight < submenuHeight) {
					     var menuPos = pos.top - $(window).scrollTop();
						subMenu.css("top", -(menuPos) + 4 + "px");
					}
                    else if (submenuTop < submenuHeight) {
                        var menuPos = submenuTop - submenuHeight;
						subMenu.css("top", menuPos - 2 + "px");
					}
					else subMenu.css("top", "");
				}
            }
            else {
                left -= (pos.left + (2 * submenuWidth) + 4);
                if (left < 0) {
                    var menuLeftPos = (submenuWidth == null) ? "-206.5px" : "-" + (submenuWidth + 5) + "px";
                    subMenu.css("left", menuLeftPos);
                }
                else {
                    if (subMenu.parent('li.e-list').parent('ul').width() && direction == "right") {
                        subMenu.css("left", (subMenu.parent('li.e-list').parent('ul').width() + 4) + "px");
                    }
                    else if (pos.left > submenuWidth)
                        subMenu.css("left", -(submenuWidth + 4) + "px");
                }
                var submenuHeight = subMenu.outerHeight();
                if ((pos.top + submenuHeight > $(window).height())) {
                    var top = -(submenuHeight) + $(element).outerHeight();
                    if (submenuHeight > (pos.top + ($(element).outerHeight() / 2))) {
                        subMenu.css("top", -(submenuHeight / 2) + "px");
                    }
                    else
                        subMenu.css("top", top + "px");
                }
                else
                    subMenu.css("top","0px");
            }
        },


        _setSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin + " e-menu-wrap");
        },

        _setSeparator: function (separator) {
            if (separator){
                this.element.addClass("e-separator");
                if ($('.e-menu-popwrap').length>0 && !ej.isNullOrUndefined(this.ulTag))
                    this.ulTag.addClass("e-separator");     
            }
            else this.element.removeClass("e-separator");
        },

        _contextMenuEvents: function (action) {
            this[action]($(this.model.contextMenuTarget), "mouseup taphold", this._ContextMenuHandler);
            this[action](this.element, "contextmenu", this._onDefaultPreventer);
            this[action]($(this.model.contextMenuTarget), "contextmenu", this._onDefaultPreventer);
            this[action]($(document), "mousedown", this._onContextClose);
        },

        _show: function (element, showanim, hideanim) {
            var siblingElement;
            var sibling = $('> ul', element);
			var zIndex = this._max_zindex();
            sibling.attr({ "aria-hidden": false });
            this._hideAnimation($(element).siblings().find(' > ul:visible'), hideanim);
            if (!($.inArray(this._disabledMenuItems, element) > -1)) {
                if (sibling.css('display') != "none") {
                    siblingElement = this.model.openOnClick ? $(sibling) : sibling.children().find('> ul');
                    this._hideAnimation(siblingElement, hideanim);
                }
                else $('> ul', element).children().find('> ul').hide();
                this._subMenuPos(element, this.model.subMenuDirection);
                sibling.css({ "z-index": zIndex + 1 });
				$(element).children('span.e-menu-arrow').css({"z-index": zIndex + 2 });
                if ($('> ul', element).css('display') != 'block' && !$(element).hasClass("e-disable-item")) {
                    this._showAnimation(sibling, showanim);
                    sibling.closest('li').addClass('e-active e-mfocused');
                }
                if ($(element).siblings("li.e-active").length > 0)
                    $(element).siblings("li.e-active").removeClass("e-active e-mfocused");
            }
        },

        _closeAll: function () {
            this._hideAnimation(this.element.find('li.e-list:has("> ul")').find('> ul:visible'), this._hideAnim);
            this._hideAnimation(this.element.find('> ul:visible'), this._hideAnim);
        },

        _showAnimation: function (element, anim) {
            switch (anim) {
                case "slideDown":
                    element.slideDown(this.model.enableAnimation ? 200 : 0); break;
                case "none":
                    element.css("display", "block"); break;
            }
        },

        _hideAnimation: function (element, anim) {
            switch (anim) {
                case "slideUp":
                    $(element).attr({ "aria-hidden": true });
                    element.slideUp(this.model.enableAnimation ? 100 : 0); break;
                case "none":
                    element.css("display", "none"); break;
            }
            element.closest('li').removeClass('e-active e-mfocused');
        },

        _removeValue: function (text, disableList) {
            var $browInfo = ej.browserInfo(), elementText;
            $browInfo.version === "8.0" && $browInfo.name === "msie" ? elementText = text[0].outerText : elementText = text[0].textContent;
            var count = $(disableList).length, i = 0;
            var childEle = $(disableList).children('a').length == 0 ? $(disableList).children('span') : $(disableList).children('a');
            while (i <= count) {
                if ($(childEle[i]).text() === elementText)
                    return i;
                i++;
            }
        },

        _createSubLevelItem: function (target, element) {
            var ulTag;
            ulTag = $(document.createElement('ul'));
            ulTag.append(element);
            target.append(ulTag);
            target.attr({ 'role': 'menu', 'aria-haspopup': 'true' });
            target.addClass("e-haschild");
            this.element.find('li:has("> ul")').find('> a,>span').addClass('aschild e-arrow-space');
            this._insertArrows(ulTag);
        },

        _insertArrows: function (ulTag) {
            if (this.model.showRootLevelArrows)
                ulTag.find('>a,>span').append($('<span>').addClass("e-icon e-arrowhead-down")).addClass("e-arrow-space");
            else
                ulTag.find('>a,>span').removeClass("e-arrow-space").find('>span.e-icon').remove();

            if (this.model.showSubLevelArrows)
                ulTag.parent('li.e-list:has(>ul)').children('a,span').append($('<span>').addClass("e-icon e-arrowhead-right")).addClass("e-arrow-space");
            else
                ulTag.parent('li.e-list:has(>ul)').children('a,span').removeClass("e-arrow-space").find('>span.e-icon').remove();
        },

        _createMenuItem: function (item) {
            var liTag, aTag, imgTag, spanTag;
            liTag = $(document.createElement('li'));
            liTag.attr({ "class": 'e-list', "role": "menuitem" });
            if (item["htmlAttribute"]) this._setAttributes(item["htmlAttribute"], liTag);
            if (item["text"] && item["text"] != "") {
                aTag = $(document.createElement('a'));
				aTag.attr({ "class": 'e-menulink'});
                if (item["imageUrl"] && item["imageUrl"] != "") {
                    imgTag = $(document.createElement('img'));
                    imgTag.attr('src', item["imageUrl"]);
                    if (item["imageAttribute"]) this._setAttributes(item["imageAttribute"], imgTag);
                    aTag.append(imgTag);
                }
                else if (item["spriteCssClass"] && item["spriteCssClass"] != "") {
                    spanTag = $(document.createElement('span'));
                    spanTag.addClass(item["spriteCssClass"]);
                    aTag.append(spanTag);
                }
                aTag.append(item["text"]);
                if (item["linkAttribute"]) this._setAttributes(item["linkAttribute"], aTag);
                if (item["url"])
                    aTag.attr('href', item["url"]);
                liTag.append(aTag);
            }
            if (item["id"]) {
                liTag.prop("id", item["id"]);
            }
            if (!this.model.enabled)
                liTag.addClass("e-disable-item");
            return liTag;
        },

        _insertNode: function (itemCollection, targetNode, operation) {
            var item = 0, targetList = 0, target = 0, targetCollection = [];
            if ($(targetNode).is(this.element))
                targetCollection.push(this.element);
            else
                typeof (targetNode) === "string" ? targetCollection.push(this.element.find(targetNode)) : typeof (targetNode) === "undefined" ? targetCollection.push(this.element) : targetCollection.push(targetNode);
            for (targetList = 0; targetList < targetCollection.length; targetList++) {
                for (target = 0; target < targetCollection[targetList].length; target++)
                    for (item = 0; item < itemCollection.length && !ej.isNullOrUndefined(itemCollection[item]) ; item++)
                        this._addItem(itemCollection[item], targetCollection[targetList][target], operation);
            }
        },

        _addItem: function (item, target, operation) {
            var element, targetElement;
            this._wireEvents("_off");
            element = this._createMenuItem(item);
            target = target === "default" ? $("#" + item["parentId"]) : $(target);
            switch (operation) {
                case "insert":
                    $(target).is(this.element) ? targetElement = target : targetElement = target.children('ul');
                    targetElement.length != 0 ? targetElement.append(element) : this._createSubLevelItem(target, element);
                    break;
                case "insertBefore":
                    if (!$(target).is(this.element))
                        element.insertBefore(target);
                    else
                        target.prepend(element);
                    break;
                case "insertAfter":
                    if (!$(target).is(this.element))
                        element.insertAfter(target);
                    else
                        target.append(element);
                    break;
            }
            this._wireEvents("_on");
        },

        _removeItem: function (item) {
            if (item.siblings('li').length == 0) {
                item.closest("ul").siblings('a.aschild').removeClass("aschild e-arrow-space").children('span.e-icon').remove();
                !item.closest("ul").hasClass("e-menu") ? item.closest("ul").remove() : item.remove();
            }
            else
                item.remove();
        },

        _hiddenElement: function (ele) {
            if (ele.length > 0 && ($.inArray(ele[0], this._hiddenMenuItems) == -1)) {
                ele.addClass("e-hidden-item");
                this._hiddenMenuItems.push(ele[0]);
            }
        },

        _showElement: function (ele) {
            if (ele.length > 0 && ($.inArray(ele[0], this._hiddenMenuItems) > -1)) {
                ele.removeClass("e-hidden-item");
                this._hiddenMenuItems.splice(this._hiddenMenuItems.indexOf(ele[0]), 1);
            }
        },

        _getNodeByID: function (node) {
            (typeof node != "object" && node != "") && (node = this.element.find(".e-list" + node));
            return $(node);
        },

        _processItems: function (node, bool) {
            var ele = this._getNodeByID(node);
            for (var i = 0; i < ele.length; i++) bool ? this._showElement($(ele[i])) : this._hiddenElement($(ele[i]));
        },

        insert: function (item, target) {
            this._insertNode(item, target, "insert");
        },

        insertBefore: function (item, target) {
            this._insertNode(item, target, "insertBefore");
        },

        insertAfter: function (item, target) {
            this._insertNode(item, target, "insertAfter");
        },

        remove: function (targetCollection) {
            var target = 0, innerTarget = 0;
            for (target = 0; target < targetCollection.length; target++) {
                targetCollection[target] = typeof (targetCollection[target]) === "string" ? (this.element.find(targetCollection[target])) : targetCollection[target];
                for (innerTarget = 0; innerTarget < targetCollection[target].length; innerTarget++)
                    (targetCollection[target][innerTarget].tagName === "LI" || targetCollection[target][innerTarget].tagName === "UL") ? this._removeItem($(targetCollection[target][innerTarget])) : targetCollection[target][innerTarget].remove();
            }
        },

        showContextMenu: function (locationX, locationY, targetElement, e, update) {
            this._closeMenu();
            this._eventArgs = e;
            if (!ej.isNullOrUndefined(e) && this._checkForExclusion(e.target)) return;
            if (this._trigger("beforeOpen", { target: targetElement, events: e })) return false;
            if (this._preventContextOpen) {
                if (!ej.isNullOrUndefined(targetElement))
                    this._targetElement = targetElement;
                else if (!ej.isNullOrUndefined(target))
                    this._targetElement = target;
                else
                    this._targetElement = this.element;
                if (update) {
                    var position = this._calculateContextMenuPosition(e);
                    locationX = position.X;
                    locationY = position.Y;
                }
                this.element.css({ "left": locationX, "top": locationY });
                this.element.css({ "z-index": this._max_zindex() + 1 });
                this._showAnimation(this.element, this._showAnim);
                this._isContextMenuOpen = true;
                this.element.focus();

                this._trigger("open", { target: targetElement });
                this._on(ej.getScrollableParents($(this.model.contextMenuTarget)), "scroll", this.hideContextMenu);
            }
            return false;
        },

        _checkForExclusion: function (e) {
            if (!ej.isNullOrUndefined(this.model.excludeTarget)) {
                var excludeTargets = this.model.excludeTarget.split(",");
                for (var target = 0; target < excludeTargets.length; target++) {
                    if ($(e).closest(this.model.excludeTarget).is($.trim(excludeTargets[target])))
                        return true;
                }
            }
        },


        hideContextMenu: function (e) {
            this._closeMenu();
            this.element.find(".e-mhover").removeClass("e-mhover");
            this.element.find(".e-mfocused").removeClass("e-mfocused");
            this._hideAnimation(this.element, this._hideAnim);
            this._isContextMenuOpen = false;

            this._trigger("close", $.extend({ events: e }, e));
            this._off(ej.getScrollableParents($(this.model.contextMenuTarget)), "scroll", this.hideContextMenu);
        },


        disableItem: function (itemToDisable) {
            var isMenuItem = $(this.element.find('li.e-list >a ,li.e-list >span')).filter(function () { return $.trim($(this).text()) === itemToDisable; });
            if (isMenuItem.length > 0 && !($.inArray(isMenuItem.parent()[0], this._disabledMenuItems) > -1)) {
                isMenuItem.parent().addClass("e-disable-item").attr({ "aria-disabled": true });
                isMenuItem.parent().find('>a.aschild span.e-icon').addClass("e-disable");
                this._disabledMenuItems.push(isMenuItem.parent()[0]);
            }
        },


        disableItemByID: function (itemId) {
            if (itemId && itemId != "") {
                var itemToDisable = this.element.find("#" + itemId) ? this.element.find("#" + itemId)[0] : undefined;
                if (itemToDisable && !($.inArray(itemToDisable, this._disabledMenuItems) > -1)) {
                    $(itemToDisable).addClass("e-disable-item").attr({ "aria-disabled": true });
                    $(itemToDisable).find('>a.aschild span.e-icon').addClass("e-disable");
                    this._disabledMenuItems.push(itemToDisable);
                }
            }
        },

        getHiddenItems:function(){
            return this._hiddenMenuItems;
        },

        hideItems: function (node) {
            if (typeof node == "object" && node.length !== undefined) {
                for (var i = 0; i < node.length; i++) this._processItems(node[i], false);                
            }
            else this._processItems(node, false);
        },

        showItems:function(node){
            if (typeof node == "object" && node.length !== undefined) {
                for (var i = 0; i < node.length; i++) this._processItems(node[i], true);
            }
            else this._processItems(node, true);
        },

        enableItem: function (itemToEnable) {
            var isMenuItem = $(this.element.find('li.e-list >a ,li.e-list >span')).filter(function () { return $.trim($(this).text()) === itemToEnable; });
            if (isMenuItem.length > 0 && ($.inArray(isMenuItem.parent()[0], this._disabledMenuItems) > -1)) {
                isMenuItem.parent().removeClass("e-disable-item").attr({ "aria-disabled": false });
                isMenuItem.parent().find('>a.aschild span.e-icon').removeClass("e-disable");
                var index = this._removeValue(isMenuItem, this._disabledMenuItems);
                this._disabledMenuItems.splice(index, 1);
            }
        },


        enableItemByID: function (itemId) {
            if (itemId && itemId != "") {
                var itemToEnable = this.element.find("#" + itemId)[0];
                if (itemToEnable && ($.inArray(itemToEnable, this._disabledMenuItems) > -1)) {
                    $(itemToEnable).removeClass("e-disable-item").attr({ "aria-disabled": false });
                    $(itemToEnable).find('>a.aschild span.e-icon').removeClass("e-disable");
                    for (var i = this._disabledMenuItems.length - 1; i >= 0; i--) {
                        if (this._disabledMenuItems[i].id == itemId) {
                            this._disabledMenuItems.splice(i, 1);
                        }
                    }
                }
            }
        },


        disable: function () {
            this.model.enabled = false;
            var menuItemCollection = this.element.find('>li[class~=e-list]');
            var proxy = this;
            $.each(menuItemCollection, function (key, value) {
                if (!($.inArray(value, proxy._disabledMenuItems) > -1))
                {
                    $(value).addClass("e-disable-item").attr({ "aria-disabled": true });
                    $(value).find('>a.aschild span.e-icon').addClass("e-disable");
                    proxy._disabledMenuItems.push(value);
                }
                
            });
        },


        enable: function () {
            var proxy = this;
            this.model.enabled = true;
            var menuItemCollection = this.element.find('li.e-disable-item');
            $.each(menuItemCollection, function (key, value) {
                $(value).removeClass("e-disable-item").attr({ "aria-disabled": false });
                $(value).find('>a.aschild span.e-icon').removeClass("e-disable");
                proxy._disabledMenuItems.pop(value);
            });
        },

        show: function (locationX, locationY, targetElement, e) {
            if (!this.model.enabled) return false;
            if (this.model.menuType == "contextmenu")
                this.showContextMenu(locationX, locationY, targetElement, e, false);
            else
                this.element.css("display", "block");
        },

        hide: function (e) {
            if (!this.model.enabled) return false;
            if (this.model.menuType == "contextmenu")
                this.hideContextMenu(e);
            else {
                this._closeMenu();
                this.element.css("display", "none");
            }
        },

        _wireEvents: function (action) {
            this[action](this.element.find("li.e-list"), "mouseout", this._mouseOutHandler);
            this[action](this.element.find("li.e-list"), "mouseover", this._mouseOverHandler);
            this[action](this.element.children(), "click", this._onClickHandler); 
            this[action](this.element, "keydown", this._onKeyDownHandler);
            this[action](this.element, "focus", this._OnFocusHandler);
            this[action](this.element, "blur", this._OnFocusOutHandler);
            if (this.model.menuType == "contextmenu" && $(this.model.contextMenuTarget)[0] != null) {
                this._contextMenuEvents(action);
            }
            if (this.model.menuType != "contextmenu") {
                this[action]($(document), "click", this._onDocumentClick);
                this[action](this.element, "mousedown", this._onMouseDownHandler);
            }
            this[action]($(window),"resize", $.proxy(this._onResize, this));            
        },

        _mouseOverHandler: function (event) {
            var element, itemId = "";
            this.element.find(".e-mhover").removeClass("e-mhover");
            event.currentTarget = $(event.target).closest("li")[0];
            if (!$(event.currentTarget).hasClass('e-disable-item'))
                $(event.currentTarget).addClass("e-mhover");
            else this._isFocused = false;
            if (event.stopPropagation)
                event.stopPropagation();
            if (typeof (this._delaySubMenuHover) !== 'undefined') {
                clearTimeout(this._delaySubMenuHover);
            }
            if (typeof (this._delaySubMenuHover) !== 'undefined') {
                clearTimeout(this._delayMenuHover);
            }
            this._mouseOver = true;
            this._isMenuOpen = true;
            if ($(event.currentTarget.parentNode.parentNode).is(this.element)) {
                this._isSubMenuOpen = false;
            }
            else {
                this._isSubMenuOpen = true;
            }
            if (event.currentTarget.nodeName == "LI")
                element = event.currentTarget;
            else if (event.currentTarget.parentNode) {
                if (event.currentTarget.parentNode.nodeName == "LI")
                    element = event.currentTarget.parentNode;
                else
                    return false;
            }
            else {
                event.preventDefault();
                return false;
            }
            if (!$(event.currentTarget).hasClass('e-disable-item'))
                this._onMenuIntent(element, this, this._hoverOpen);
            if (!($.inArray(element, this._disabledMenuItems) > -1)) {
                var menuText = $(element).children('a,span').text();
                itemId = !ej.isNullOrUndefined(element) ? $(element)[0].id : "";
                var eventArgs = { "text": menuText, "element": element, "event": event, "ID": itemId };

                this._trigger("mouseover", $.extend({ events: eventArgs }, eventArgs));
            }
        },

        _onMouseDownHandler: function (e) {
            if ($(e.target).hasClass('e-menu')) this._isFocused = false;
        },


        _mouseOutHandler: function (event) {
            var element, itemId = "";
            $(event.currentTarget).removeClass("e-mhover");
            if (event.stopPropagation)
                event.stopPropagation();
            if (typeof (this._delaySubMenuHover) !== 'undefined') {
                clearTimeout(this._delaySubMenuHover);
            }
            if (typeof (this._delaySubMenuHover) !== 'undefined') {
                clearTimeout(this._delayMenuHover);
            }
            this._mouseOver = false;
            this._isMenuOpen = false;

            if (event.currentTarget.nodeName == "LI")
                element = event.currentTarget;
            else if (event.currentTarget.parentNode) {
                if (event.currentTarget.parentNode.nodeName == "LI")
                    element = event.currentTarget.parentNode;
                else
                    return false;
            }
            else {
                event.preventDefault();
                return false;
            }
            this._onHide(element, this, this._hoverClose);
            if (!($.inArray(element, this._disabledMenuItems) > -1)) {
                var menuText = $(element).children('a,span').text();
                itemId = !ej.isNullOrUndefined(element) ? $(element)[0].id : "";
                var eventArgs = { "text": menuText, "element": element, "event": event, "ID": itemId };

                this._trigger("mouseout", $.extend({ events: eventArgs }, eventArgs));
            }
        },

        _onClickHandler: function (event) {
            var element, itemId = "" , parentId, parentText;
            this._isFocused = true;
            var openOnClickStart = false;
            if (!$(event.target).closest("li.e-list").hasClass('e-disable-item') && $(event.target).closest("li.e-list").length > 0) {
                element = $(event.target).closest("li.e-list")[0];
                if ($(element).is(this.element.find(">li.e-list")))
                    this._activeElement = element;
            }
            else {
                if ($(event.target).is(this.element))
                    this._activeElement = this.element.find(">li:first");
                return;
            }
            if ($(event.target).is("a") && $(element).find(">a,>span").hasClass('aschild') && this.model.openOnClick) {
                this._isFocused = false;
            }
            if (!this._hoverOpen && $(element).find(">a,>span").hasClass('aschild')) {
                this._show(element, this._showAnim, this._hideAnim);
                this._hoverOpen = false;
                openOnClickStart = true;
            }
            if (!($.inArray(element, this._disabledMenuItems) > -1)) {
                //Check if Context Menu, then hide the context menu firing the events
                if (this.model.menuType == "contextmenu") {
                    if (this._isContextMenuOpen && !$(element).hasClass("e-haschild")) {
                        this._hideAnimation(this.element, this._hideAnim);
                        this._isContextMenuOpen = false;

                        this._trigger("close", $.extend({ events: event }, event));
						this._off(ej.getScrollableParents($(this.model.contextMenuTarget)), "scroll", this.hideContextMenu);
                    }
                }
                if (!openOnClickStart) {



                    if (!$(element).find(">a,>span").hasClass("aschild")) {
                        this._closeMenu();
                        if (this.model.openOnClick)
                            this._hoverOpen = false;
                    }
                }
                var menuText = $(element).children('a,span').text();
                var parent = $(element).closest("ul").parent("li");
                if (parent.length != 0) {
                    parentId = ej.isNullOrUndefined(parent.attr("id")) ? null : parent.attr("id");
                    parentText = parent.children('a,span').text();
                }
                else {
                    parentId = null;
                    parentText = null;
                }
                itemId = !ej.isNullOrUndefined(element) ? $(element)[0].id : "";
                var eventArgs = { "text": menuText, "element": element, "event": event, "selectedItem": this.selectedItem, "ID": itemId, "parentId": parentId, "parentText": parentText };
                this._trigger("click", $.extend({ events: eventArgs }, eventArgs));
                this.selectedItem = null;
                if (this.model.openOnClick && this.model.menuType != "contextmenu")
                    this.element.focus();
            }
        },


        _onKeyDownHandler: function (e) {
            if( e.target && e.target.nodeName && $( e.target ).closest( "input, textarea" ).length > 0) return true;
            if (this.model.menuType == "contextmenu" && !this._isContextMenuOpen) return;
            var element, focusEle, itemId = "", hoverElement = this.element.find(".e-mhover"), focusedElement = this.element.find(".e-mfocused"), currentElement, liVisible;
            if (!$(hoverElement).length > 0 && $(this._activeElement).length > 0)
                hoverElement = focusedElement = $(this._activeElement);

            if (e.keyCode == 9) {
                this._isFocused = false;
                this._OnFocusOutHandler();
            }
            else if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40)
                e.preventDefault();

            if (e.keyCode == 40) {
                if (this.model.orientation == "horizontal") {
                    if (this.element.find(">li.e-mhover").children("ul").length > 0 || $(this._activeElement).length > 0) {
                        if ($(hoverElement).children("ul").css('display') === "none")
                            this._show(hoverElement[hoverElement.length - 1], this._showAnim, this._hideAnim);
                        hoverElement.removeClass("e-mhover e-mfocused").children("ul:first").find("li:first").addClass("e-mhover");
                        this._activeElement == null ? hoverElement.addClass("e-mfocused") : $(this._activeElement).addClass("e-mfocused");
                    } else {
                        liVisible = hoverElement.parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                        $(hoverElement[hoverElement.length-1]).removeClass("e-mfocused e-mhover");
                        focusEle = $(liVisible[liVisible.index(hoverElement) + 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) + 1]) : liVisible.first();
                        focusEle.addClass("e-mhover");
                    }
                }
                else if (this.model.orientation != "horizontal") {
                    if (hoverElement.length == 0) liVisible = this.element.children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    else liVisible = hoverElement.parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    hoverElement.removeClass("e-mfocused e-mfocused");
                    if (hoverElement.length > 0) {
                        hoverElement.removeClass("e-mhover");
                        focusEle = $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) + 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) + 1]) : liVisible.first();
                    } else focusEle = liVisible.first();
                    focusEle.addClass("e-mhover");
                }
            }
            if (e.keyCode == 39) {
                if (this.model.orientation == "horizontal" && (this.element.find(">li.e-list").hasClass("e-mhover") || $(this._activeElement).length > 0)) {
                    hoverElement.removeClass("e-mfocused e-mhover");
                    liVisible = this.element.children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    focusEle = $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) + 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) + 1]) : liVisible.first();
                    focusEle.addClass("e-mhover");
                }
                else if ($(hoverElement).children("ul").length > 0) {
                    hoverElement.removeClass("e-mfocused e-mhover");
                    var firstChild = hoverElement.children("ul:first").find("li:first");
                    this._show(hoverElement[hoverElement.length - 1], this._showAnim, this._hideAnim);
                    liVisible = hoverElement.addClass('e-mfocused').children("ul:first").children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    focusEle = $(liVisible[liVisible.index(firstChild)]).length > 0 ? $(liVisible[liVisible.index(firstChild)]) : liVisible.first();
                    focusEle.addClass("e-mhover");
                }
                else if (hoverElement.children("ul").length <= 0) {
                    if (this.model.orientation == "horizontal" && hoverElement.parent().closest('.e-list').parent().hasClass('e-menu')) {
                        this._hideAnimation(hoverElement.parent(), this._hideAnim);
                        hoverElement.removeClass("e-mfocused e-mhover");
                        $(focusedElement[focusedElement.length - 1]).removeClass("e-mfocused");
                        liVisible = hoverElement.parent().closest('.e-list').parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                        focusEle = $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1]) + 1]).length > 0 ? $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1]) + 1]) : $(liVisible[liVisible.index(focusedElement.first())]);
                        focusEle.addClass("e-mhover");
                    }
                }
            }

            if (e.keyCode == 38) {
                if (this.model.orientation == "horizontal") {
                    liVisible = hoverElement.parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    hoverElement.removeClass("e-mfocused e-mhover");
                    focusEle = $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]) : liVisible.last();
                }
                else if (this.model.orientation != "horizontal") {
                    if (hoverElement.length == 0) liVisible = this.element.children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    else liVisible = hoverElement.parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                    if (hoverElement.length > 0) {
                        hoverElement.removeClass("e-mfocused e-mhover");
                        focusEle = $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]) : liVisible.last();
                    } else focusEle = liVisible.last();
                }
                focusEle.addClass("e-mhover");
            }

            if (e.keyCode == 37) {
                if (this.model.orientation == "horizontal") {
                    if (this.element.find(">li.e-list").hasClass("e-mhover") || $(this._activeElement).length > 0) {
                        hoverElement.removeClass("e-mfocused e-mhover");
                        liVisible = this.element.find('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                        focusEle = $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]).length > 0 ? $(liVisible[liVisible.index(hoverElement[hoverElement.length - 1]) - 1]) : liVisible.last();
                        focusEle.addClass("e-mhover");
                    }
                    else {
                        this._hideAnimation(hoverElement.parent(), this._hideAnim);
                        hoverElement.removeClass("e-mfocused e-mhover");
                        $(focusedElement[focusedElement.length - 1]).removeClass("e-mfocused e-active");
                        liVisible = hoverElement.parent().closest('.e-list').parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                        if (hoverElement.parent().closest('.e-list').parent('.e-menu').length > 0)
                            focusEle = $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1]) - 1]).length > 0 ? $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1]) - 1]) : liVisible.last();
                        else
                            focusEle = $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1])]).length > 0 ? $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1])]) : liVisible.last();
                        focusEle.addClass("e-mhover");
                    }
                }
                else if (hoverElement.parent(".e-menu").length == 0 || (this.model.menuType == "contextmenu" && hoverElement.parent("ul.e-context").length == 0)) {
                        this._hideAnimation(hoverElement.parent(), this._hideAnim);
                        hoverElement.removeClass("e-mfocused e-mhover");
                        $(focusedElement[focusedElement.length - 1]).removeClass("e-mfocused");
                        liVisible = hoverElement.parent().closest('.e-list').parent().children('li.e-list:visible:not(.e-hidden-item, .e-disable-item)');
                        focusEle = $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1])]).length > 0 ? $(liVisible[liVisible.index(focusedElement[focusedElement.length - 1])]) : $(liVisible[liVisible.index(focusedElement.last())]);
                        focusEle.addClass("e-mhover");
                }
            }
            if (e.keyCode == 13) {
                var menuText = $(hoverElement).children('a,span').text();
                itemId = !ej.isNullOrUndefined($(hoverElement)[0]) ? $(hoverElement)[0].id : "";
                var eventArgs = { "menuId": this.element[0].id, "text": menuText, "selectedItem": focusedElement, "ID": itemId };
                if (this.model.menuType == "contextmenu") {
                    if (this._isContextMenuOpen && hoverElement.length > 0 && !focusedElement.hasClass("e-disable-item")) {
                        if (this.model.click)
                            this._trigger("click", $.extend({ events: eventArgs }, eventArgs));
                        this.selectedItem = null;
                        this.hideContextMenu(e);
                    }
                } else {
                    if (hoverElement.length > 0 && !hoverElement.hasClass("e-disable-item")) {
                        if ($(hoverElement).find(">a,>span").hasClass('aschild') && $(hoverElement).children("ul").css('display') === "none") {
                            this._show(hoverElement[0], this._showAnim, this._hideAnim);
                            hoverElement.removeClass("e-mhover").children("ul:first").find("li:first").addClass("e-mhover");
                        }
                        else {
                            this.element.find(".e-mhover >a,.e-mhover >span ").focus();
                            this.element.find("li.e-list").removeClass("e-mhover e-mfocused");
                            this._closeAll();
                        }
                        if (ej.isNullOrUndefined($(hoverElement).find(">a").attr("href")))
                            this._trigger("click", $.extend({ events: eventArgs }, eventArgs));
                    }
                }
            }
            if (e.keyCode == 27) {
                if (this.model.menuType == "contextmenu")
                    this.hideContextMenu(e);
                else
					this.element.find("li.e-list").removeClass("e-mhover");
                    this.element.find('li.e-list:has("> ul")').find('> ul:visible').parents("li.e-list").addClass("e-mhover");
                    this._closeAll();
            }
            if ($(e.target).is(this.element) && e.target.parentNode) {
                if (hoverElement.length)
                    element = hoverElement;
            }
            else
                return false;
            if (!($.inArray(element, this._disabledMenuItems) > -1)) {
                var menuText = $(element).children('a,span').text();

                itemId = !ej.isNullOrUndefined(element) ? $(element)[0].id : "";
                if (this.element.find('li.e-mfocused.e-mhover').length || e.keyCode == 13)
                    currentElement = (e.keyCode == 13) ? hoverElement : this.element.find('li.e-mfocused.e-mhover');
                var eventArgs = { "text": menuText, "element": element, "targetElement": currentElement , "event": e, "ID": itemId };

                this._trigger("keydown", $.extend({ events: eventArgs }, eventArgs));
            }
            this._activeElement = null; focusedElement = this.element.find(".e-mfocused");
        },

        _OnFocusHandler: function (event) {
            if (this.model.menuType != "contextmenu" && !this.element.find(">li:first").hasClass("e-disable-item") && this._isFocused && this.element.find(".e-mhover").length == 0 && $('li.e-ham-wrap').length ==0) {
                this.element.find(">li:first").addClass("e-mhover");
            }
            else this._isFocused = true;
            if (this.model.menuType != "contextmenu")
                this._activeElement = this.element.find(">li:first");
        },

        _OnFocusOutHandler: function () {
            if (!this._isFocused) {
                this.element.find("li.e-list").removeClass("e-mhover e-mfocused");
                this._closeAll();
            }
            this._isFocused = false;
        },

        _onDocumentClick: function (event) {
            if (this.model.openOnClick)
                this._hoverOpen = false;
            if (!$(event.target).parents(".e-menu").is(this.element)) {
                this.element.find("li.e-list").removeClass("e-mhover e-mfocused");
                this._closeAll();
                this._isFocused = true;
            }
            if ((!$(event.target).parents("ul.e-menu").is(this.popupWrapper)) && (!$(event.target).hasClass('e-ham-wrap')) && (!($(event.target).parent().hasClass('e-ham-wrap'))) && (!$(event.target).hasClass('e-hamburger')) && (!$(event.target).parent("li").hasClass("e-haschild")) && (!$(event.target).is('span.e-icon.e-arrowhead-down')) && !(this._isOverflowPopupOpen()) && this.model.menuType != "contextmenu" && $("li.e-ham-wrap").length > 0) {
                this._overflowClose();
            }           
        },


        _ContextMenuHandler: function (e) {
            var isRightClick = false;
            if (e.type == "taphold" && e.button != 0)
                isRightClick = true;
            else if (e.button)
                isRightClick = (e.button == 2);
            else if (e.which)
                isRightClick = (e.which == 3); //for Opera
            var targetElement = e.target;
            if (isRightClick) {
                var evt = e;
                if (e.type == "taphold") {
                    if (e.options.type == "touchstart") evt = e.options.touches[0];
                    else evt = e.options;
                }
                var showSpeed = this._showSpeed;
                this.showContextMenu(null, null, targetElement, evt, true);
            }
            else {
                if (this._isContextMenuOpen) {
                    var hideanim = this._hideAnim;
                    var hideSpeed = this._hideSpeed;
                    this.hideContextMenu(e, hideanim, hideSpeed);
                }
            }
        },

        _calculateContextMenuPosition: function (e) {
            var locationX, locationY;
            this.element.css({"top": "", "left": ""}); 
            locationX = (e.clientX + this.element.width() < $(window).width()) ? e.pageX : e.pageX - this.element.width();
            locationY = (e.clientY + this.element.height() < $(window).height()) ? e.pageY : (e.clientY > this.element.height()) ? e.pageY - this.element.height() : $(window).height() - this.element.outerHeight();
            var bodyPos = $("body").css("position") != "static" ? $("body").offset() : { left: 0, top: 0 };
            locationX -= bodyPos.left, locationY -= bodyPos.top;
            return {
                X: locationX,
                Y: locationY
            };
        },


        _onDefaultPreventer: function (e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        },


        _onContextClose: function (e) {
            var proxy = this;
            if (this._isContextMenuOpen) {
                var isRightClick = false;
                if ($(e.target).is(this.element) || $(e.target).parents(".e-context").is(this.element))
                    isRightClick = true;
                if (!isRightClick) {
                    var hideanim = this._hideAnim;
                    var hideSpeed = this._hideSpeed;
                    this.hideContextMenu(e, hideanim, hideSpeed);
                    var parentElements = $(e.target).parents();
                    $.each(parentElements, function (index, value) {
                        if (value.id == proxy._ContextTargetId) {
                            return;
                        }
                    });

                }
            }
        }

    });

    ej.Menu.Locale = ej.Menu.Locale || {} ;
       
    ej.Menu.Locale['default'] = ej.Menu.Locale["en-US"] = {  	
        titleText: "Menu"
    };
    ej.MenuType = {
        /**  support for list of items appears as normal menu in horizontal or vertical direction. */
        NormalMenu: "normalmenu",
        /**  support for list of items appears as menu when right clicked on target area, thereby preventing browser’s default right click.. */
        ContextMenu: "contextmenu"
    };

    ej.Direction = {
        /**  support for Render sub menu popup in left direction. */
        Left: "left",
        /**  support for Render sub menu popup in Right direction. */
        Right: "right",
        /** Default opening direction of menu sub items */
        None: "none",
    };

    ej.AnimationType = {
        /**  support for disable the AnimationType while hover or click an menu items. */
        None: "none",
        /**  support for enable the AnimationType while hover or click an menu items. */
        Default: "default"
    };

})(jQuery, Syncfusion);