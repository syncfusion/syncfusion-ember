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
    ej.widget("ejAccordion", "ej.Accordion", {
        _rootCSS: "e-acrdn",

        element: null,

        model: null,
        validTags: ["div", "span"],
        _addToPersist: ["selectedItemIndex", "selectedItems"],
        _setFirst: false,
        angular: {
            terminal: false
        },

        defaults: {

            collapsible: false,

            ajaxSettings: {

                type: 'GET',

                cache: false,

                data: {},

                dataType: "html",

                contentType: "html",

                async: true
            },

            events: "click",

            customIcon: {

                header: "e-plus",

                selectedHeader: "e-minus"
            },

            heightAdjustMode: "content",

            height: null,

            width: null,

            headerSize: null,

            enableAnimation: true,

            selectedItemIndex: 0,

            cssClass: "",

            enableRTL: false,

            showCloseButton: false,

            showRoundedCorner: false,

            allowKeyboardNavigation: true,

            enableMultipleOpen: false,

            expandSpeed: '300',

            collapseSpeed: '300',

            selectedItems: [],

            disabledItems: [],

            enabledItems: [],

            enablePersistence: false,

            enabled: true,

            htmlAttributes: {},

            ajaxLoad: null,

            ajaxBeforeLoad: null,

            activate: null,

            beforeActivate: null,

            inActivate: null,

            beforeInactivate: null,

            ajaxSuccess: null,

            ajaxError: null,

            create: null,

            destroy: null

        },

        dataTypes: {
            cssClass: "string",
            collapsible: "boolean",
            enabled: "boolean",
            events: "string",
            heightAdjustMode: "enum",
            ajaxSettings: "data",
            customIcon: "data",
            selectedItems: "array",
            disabledItems: "array",
            enabledItems: "array",
            enableAnimation: "boolean",
            htmlAttributes: "data",
        },


        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "events": {
                        this._off(this._headers, this.model.events);
                        this._on(this._headers, options[key], this._headerEventHandler);
                        break;
                    }
                    case "disabledItems": this.disableItems(options[key]); break;
                    case "enabledItems": this.enableItems(options[key]); break;
                    case "enabled": this._enabledAction(options[key]); break;
                    case "selectedItemIndex": {
                        if ($(this._contentPanels[options[key]]).hasClass("e-disable") || options[key] > this._headers.length || this.model.enableMultipleOpen)
                            options[key] = this.model.selectedItemIndex;
                        else {
                            this._isInteraction = true;
                            (!this.model.enableMultipleOpen) && this._activeTab(options[key], false, true);
                            this._isInteraction = false;
                        }
                        break;
                    }
                    case "heightAdjustMode": this._setHeightStyle(options[key]); break;
                    case "cssClass": this._changeSkin(options[key]); break;
                    case "showRoundedCorner": this._roundedCorner(options[key]); break;
                    case "customIcon":
                        {
                            var icons = this.model.customIcon;
                            var newIcons = options[key];
                            this._headers.find("span." + icons.header).removeClass(icons.header).addClass(newIcons.header);
                            this._headers.find("span." + icons.selectedHeader).removeClass(icons.selectedHeader).addClass(newIcons.selectedHeader);
                            break;
                        }
                    case "height": {
                        this.element.height(options[key]);
                        this.model.height = options[key];
                        if (this.model.heightAdjustMode != "fill") {
                            if (this._getHeight() > this.element.height())
                                this._scrollerObj ? this._scrollerObj.option({ height: this.element.height() }) : this._setScoller();
                        }
                        else this._setHeight();
                        break;
                    }
                    case "width": {
                        this.element.width(options[key]);
                        if (this._scrollerObj) this._scrollerObj.option("width", options[key]);
                        if (options[key].toString().indexOf("%"))
                            $(window).on('resize', $.proxy(this._scrollerRefresh, this));
                        else $(window).off('resize', $.proxy(this._scrollerRefresh, this));
                        if (this._scrollerObj) this._scrollerObj.refresh();
                        break;
                    }
                    case "headerSize": {
                        this.model.headerSize = options[key];
                        this._setHeaderSize();
                        break;
                    }
                    case "showCloseButton":{
                        this.model.showCloseButton = options[key];
                        this._addDeleteIcon();
                        break;
                    }
                    case "allowKeyboardNavigation": {
                        if (options[key]) {
                            this._off(this.element, "keydown");
                            this._on(this.element, 'keydown', this._keyPress);
                        }
                        else
                            this._off(this.element, "keydown");
                        break;
                    }
                    case "enableRTL":
                        {
                            if (options[key])
                                this.element.addClass("e-rtl");
                            else
                                this.element.removeClass("e-rtl");
                            if (this._scrollerObj) this._scrollerObj.option("enableRTL", options[key]);
                            break;
                        }
                    case "selectedItems": this._showHideSelectedItems(options[key]);
                        options[key] = this.model.selectedItems;
                        break;
                    case "expandSpeed":this.model.expandSpeed=options[key]; break;                        
                    case "collapseSpeed":this.model.collapseSpeed=options[key]; break;                                           
                    case "htmlAttributes": this._addAttr(options[key]); break;
					case "enableMultipleOpen":
					{	
						this.model.enableMultipleOpen=options[key];						
                        if(this.model.selectedItems.length<=0)
						{
						  var enabledItems=$.extend(true, [],this.model.enabledItems); 
                          this._activeTab(this.model.enabledItems[0]);						
					    }					
					    else if((this.model.selectedItemIndex>0)&&(this.model.selectedItemIndex<=this._headers.length))
						{													
                          var temp=$.extend(true, [],this.model.selectedItems);                       
 						  temp.sort(function(a, b) {
						  return a - b;
						  });	
                          this.model.selectedItemIndex=temp[0];						   
                          var items=temp;						  
						  for(var i=1;i<items.length;i++){														
						  this._hideTab(items[i]);                             					
						  }							
					    }									
						break;
					}
                }
            }
        },

        _destroy: function () {

            this._removeBaseClass();
            this.element.children('.e-disable').removeClass("e-disable");
            this.element.removeClass("e-acrdn e-corner e-widget");
            this._headers.removeClass("e-active  e-state-disabled");
            this._contentPanels.removeClass("e-content-active e-disable e-acrdn-content-active");
            $(this._headers.find(".e-icon.e-acrdn-icon")).remove();
            if (this.model.height) this._contentPanels.height("auto");
            if (this.model.width) this._contentPanels.width("auto");
            if (this._scrollerObj) this._scrollerObj.destroy();
            this._unWireEvents();
        },

        _init: function () {
            this.beforeRender= false;
            this._renderControl();
            this._prevSize = this._getDimension($(this.element).parent(), "height");
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else if (key == "disabled" && (value == "disabled" || value == "true")) proxy.disable();
                else proxy.element.attr(key, value);
            });
        },

        _renderControl: function () {
            this._headers = this.element.find("> :even");
            this.element.attr("tabindex", 0).attr("role", "tablist");
            this._contentPanels = this._headers.next();
            //Index check negative values
            this._nagativeIndexCheck(this.model.selectedItemIndex);

            this._addBaseClass();
            this._addAttr(this.model.htmlAttributes);
			// Add header icons
            ej.buildTag("span.e-icon e-acrdn-icon " + this.model.customIcon.header).prependTo(this._headers);
            if(this.model.showCloseButton)
                this._addDeleteIcon();
            this._setHeightStyle(this.model.heightAdjustMode);
            if (this.model.height) this.element.css("height", this.model.height);
            this.model.width && this.element.css("width", this.model.width);
            (!this.model.enableMultipleOpen) && this._renderHeaderIcon();
            if (!ej.isNullOrUndefined(this.model.headerSize)) this._setHeaderSize();
            this._wireEvents();
            this._roundedCorner(this.model.showRoundedCorner);
            !this.model.enabled && this._enabledAction(this.model.enabled);
            //Activate the header & content               
            this._selectedItemsAction(this.model.enableMultipleOpen ? this.model.selectedItems : this.model.selectedItemIndex);
            this._disableItems(this.model.disabledItems);
            this._setEnabledItems();
        },
        _setHeight: function () {
            var proxy = this, headersHeight = 0, activeHeaderHeight = 0;
            this.element.css("height", this.model.height);
            maxHeight = this.element.height();
            this._contentPanels.css("height", "auto");
            if (this._scrollerObj) this._scrollerObj.option("height", this.element.height());
            this._headers.each(function (i) {
                maxHeight -= $(this).outerHeight();
                headersHeight += $(this).outerHeight();
                if ($(proxy._contentPanels[i]).hasClass("e-acrdn-content-active"))
                    activeHeaderHeight += $(proxy._contentPanels[i]).outerHeight();
            });
            maxPadding = 0;
            var padding = this.element.height() - (activeHeaderHeight + headersHeight);
            if (padding > 0)
                this._contentPanels.each(function () {
                    $(this).height($(this).height() + padding / proxy.element.find(".e-select.e-active").length);
                });
            else this._setScoller();
            if (this._scrollerObj) this._scrollerObj.refresh();
        },
        _setScoller: function () {
            if (this.element.parent(".e-acrdn-scroller.e-scroller").length < 1) {
                this.scroller = ej.buildTag("div.e-acrdn-scroller");
                this.element.wrap(this.scroller);
                var width = this.element.css("width");
                this.element.parent(".e-acrdn-scroller").ejScroller({ "height": this.element.height(), "width": this.model.width });
                this.element.css("width", width);
                this._scrollerObj = this.element.parent(".e-js").data("ejScroller");
                if (this.model.showRoundedCorner) this.element.parent(".e-acrdn-scroller").addClass("e-corner");
                if (this.model.enableRTL) this._scrollerObj.option("enableRTL", true);
            }
        },
        _setHeaderSize: function () {
            var proxy = this;
            this._headers.each(function () {
                $(this).css({ "padding-top": 0, "padding-bottom": 0 });
                $(this).css("height", proxy.model.headerSize);
                var value = typeof proxy.model.headerSize === "string" && proxy.model.headerSize.indexOf("px") != -1 ? proxy.model.headerSize : proxy.model.headerSize + "px";
                $($(this).find("a[href]")).css("line-height", value);
                if ($(this).find(".e-icon.e-acrdn-icon").length > 0) {
                    $(this).find(".e-icon.e-acrdn-icon").css("margin-top", ($(this).height() / 2 - 5));
                }
            });
            if (this.model.height) {
                if (this.model.heightAdjustMode != "fill") {
                    if (this._getHeight() > this.element.height())
                        this._scrollerObj ? this._scrollerObj.refresh() : this._setScoller();
                }
                else this._setHeight();
                if (this._scrollerObj) this._scrollerObj.refresh();
            }
        },
        _addDeleteIcon: function(){
            if(this.model.showCloseButton){
                if (this.getItemsCount() > 0)
                    this._headers.append(this._createDeleteIcon());
                this._on(this._headers.children("div.e-close.e-acrdn-icon"), "click", this._panelDeleteClick);
            }else{
                this._headers.children("div.e-close.e-acrdn-icon").remove();
                this._off(this._headers.children("div.e-close.e-acrdn-icon"), "click", this._panelDeleteClick);
            }
        },
        _createDeleteIcon: function(){
            var deleteIcon = ej.buildTag('div.e-icon e-close e-acrdn-icon');
            return deleteIcon;
        },
        _getHeight: function () {
            var headersHeight = 0, activeHeaderHeight = 0;
            var proxy = this;
            this._headers.each(function (i) {
                headersHeight += $(this).outerHeight();
                if ($(proxy._contentPanels[i]).hasClass("e-acrdn-content-active"))
                    activeHeaderHeight += $(proxy._contentPanels[i]).outerHeight();
            });
            return headersHeight + activeHeaderHeight;
        },
        _setEnabledItems: function () {
            for (var index = 0; index < this.getItemsCount() ; index++) {
                if (($.inArray(index, this.model.disabledItems) < 0) && ($.inArray(index, this.model.enabledItems) < 0))
                    this.model.enabledItems.push(index);
            }
        },


        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _panelDeleteClick: function(args){
            if(this.model.enabled){
                var currentPanel = $(args.target);
                if(currentPanel.hasClass("e-close"))
                    var index = $(this._headers).index($(args.target).parent())
                this.removeItem(index);
            }
        },

        _showHideSelectedItems: function (activeList) {
            if (this.model.enableMultipleOpen && activeList instanceof Array) {
                for (var index = 0; index < activeList.length; index++) {
                    if (activeList[index] >= 0 && activeList[index] < this._headers.length && this.model.selectedItems.indexOf(activeList[index]) == -1)
                        this._activeTab(activeList[index], true);
                }
                var len = this.model.selectedItems.length, temp = JSON.parse(JSON.stringify(this.model.selectedItems));
                for (var index = 0; index < len; index++) {
                    if (activeList.indexOf(temp[index]) == -1)
                        this._hideTab(temp[index]);
                }
            }
        },
        
        _selectedItemsAction: function (activeList) {
            if (this.model.enableMultipleOpen && activeList instanceof Array && activeList.length > 0) {
                for (var seletedindex = 0; seletedindex < activeList.length; seletedindex++) {
					if(activeList[seletedindex]>=0)
                    this._activeTab(activeList[seletedindex], true);
                }
            }
            else
                if (!(this.collapseALL && this.model.collapsible) && this.model.selectedItemIndex >= 0)
                    this._activeTab(this.model.selectedItemIndex, true);
        },

        _enabledAction: function (flag) {
            if (!flag)
                this.disable();
            else
                this.enable();
        },


        _addBaseClass: function () {
            this.element.addClass(this.model.cssClass + " e-widget");
            if (this.model.enableRTL) this.element.addClass("e-rtl");
            this._headers.addClass(" e-select").attr("role", "tab").attr("tabindex", 0);
            this._contentPanels.addClass("e-content").attr("role", "tabpanel").attr("aria-hidden", true).hide(); // hide all the content panels while loding
            if (!this.model.enableMultipleOpen)
                $(this._contentPanels[this.model.selectedItemIndex]).show();
        },


        _removeBaseClass: function () {
            this._headers.removeClass(" e-select");
            this._contentPanels.removeClass("e-content").show(); // hide all the content panels while loding
        },

        _roundedCorner: function (value) {
            if (value) {
                this.element.addClass('e-corner');
            }
            else if (this.element.hasClass('e-corner')) {
                this.element.removeClass('e-corner');
            }
        },

        _nagativeIndexCheck: function (index) {

            var panels;
            if (index < 0 && this.model.collapsible) {
                this.collapseALL = true;
                panels = this.getItemsCount();
                for (var pane = 0; pane < panels; pane++) {
                    this._hideTab(pane);
                }
            }
            else if (index < 0 || index >= this._headers.length)
                this.model.selectedItemIndex = 0;
        },
		collapsePanel: function (val) {
			this._expandcollapsepanel(false, val);
		},
		expandPanel: function (val) {
		    this._expandcollapsepanel(true, val);
		},
		_expandcollapsepanel: function(action, val){
			proxy = this;
			if (val instanceof Array) {
			    $.each(val, function (values, indexes) {
			        proxy._activehideIndex(action, indexes);
				});
			}
			else if (typeof val == "number") {
			    proxy._activehideIndex(action, val);
			}
		},
		_activehideIndex: function (action, indexes) {
		    if (indexes >= 0 && indexes <= proxy._headers.length) {
		        if (action)
		            this._activeTab(indexes, false, true);
		        else {
		            this._hideTab(indexes, false, true);
		            this._deleteSelectedItems(indexes);
		            if (this.model.selectedItemIndex == indexes)
		                this.model.selectedItemIndex = null;
		        }
		    }
		},
        _activeTab: function (index, raiseEvent, isCode) {

            if ($.inArray(index, this.model.disabledItems) < 0) {
                var data = { activeIndex: index, isInteraction: !isCode };
                if (true === (!raiseEvent && this._trigger("beforeActivate", data))) {
                    return false;
                }
				
                if (!this.model.enableMultipleOpen && this.beforeRender)
                    this._hideTab(this.model.selectedItemIndex, raiseEvent, isCode);
				this.model.selectedItemIndex = index;
                if(!ej.isNullOrUndefined(this.model.selectedItemIndex)){
                    var icons = this.model.customIcon;
                    this._headers.attr("tabindex", 0).removeAttr("aria-expanded");
                    this._activeHeader = this._headers.eq(index).addClass("e-active ").attr("aria-selected", true).attr("tabindex", 0).attr("aria-expanded", true);
                    this._activeHeader.find("span.e-icon.e-acrdn-icon")
                            .removeClass(icons.header)
                            .addClass(icons.selectedHeader);
                    this._addSelectedItems(index);
                    this._ajaxLoad();
                    this._roundedCorner(this.model.showRoundedCorner);
                    data = { activeHeader: this._activeHeader, activeIndex: this.model.selectedItemIndex, isInteraction: !isCode };
                    var proxy = this;
                    this._activeHeader.next().addClass("e-acrdn-content-active").removeAttr("aria-hidden", false);
                    this._paneAdjustSize();
                    this._activeContent = this._activeHeader.next().slideDown(this.model.enableAnimation ? this._validateSpeed(this.model.expandSpeed) : 0, function () {
                        if (!raiseEvent) proxy._trigger("activate", data);
                        if (proxy.model.height) {
                            if (proxy.model.heightAdjustMode != "fill") {
                                if (proxy._getHeight() > proxy.element.height())
                                    proxy._scrollerObj ? proxy._scrollerObj.refresh() : proxy._setScoller();
                            }
                            else proxy._setHeight();
                                if (proxy._scrollerObj) proxy._scrollerObj.refresh();
                            }
                    });
                }
                this.beforeRender=true;
            }
        },
        _paneAdjustSize: function () {
            var proxy = this;
            if (this.model.heightAdjustMode === "fill") {
                if (this.model.enableMultipleOpen) {
                    maxHeight = this._getDimension($(this.element).parent(), "height");
                    $(this.element).parent().css({ "overflow": "auto" });
                    this._headers.each(function () {
                        maxHeight -= proxy._getDimension($(this), "outerHeight");
                    });
                    var maxPadding = 0;
                    maxPadding = Math.max(maxPadding, proxy._getDimension($(this._activeHeader.next()), "outerHeight") - proxy._getDimension($(this._activeHeader.next()), "height"));
                    maxHeight = (maxHeight / this.model.selectedItems.length) - maxPadding;
                    this._headers.next().animate({ "height": maxHeight }, 300);
                }
            }
        },
        _validateSpeed:function(val){

			if(val && (val=$.trim(val.toString().toLowerCase())) && ((val == 'fast') ||(val == 'slow')))
				return val;
			return Number(val);
		},

        _hideTab: function (index, raiseEvent, isCode) {
            var icons = this.model.customIcon, data;
            if (index >= 0) {
                data = { inActiveIndex: index, isInteraction: !isCode};
                if (true === (!raiseEvent && this._trigger("beforeInactivate", data))) {
                    return false;
                }
                this._activeHeader = this._headers.eq(index).removeClass("e-active ").removeAttr("aria-selected").attr("tabindex", 0).attr("aria-expanded", false);
                this._activeHeader.find("span.e-icon.e-acrdn-icon")
                        .removeClass(icons.selectedHeader)
                        .addClass(icons.header);
                data = { inActiveHeader: this._activeHeader, inActiveIndex: index, isInteraction: !isCode };
                var proxy = this; proxy.raiseEvent=raiseEvent;
                this._activeHeader.next().removeClass("e-acrdn-content-active").attr("aria-hidden", true).slideUp(this.model.enableAnimation ? this._validateSpeed(this.model.collapseSpeed) : 0, function () {
                    if(!proxy.raiseEvent) proxy._trigger("inActivate", data);
                    if (proxy.model.height) {
                        if (proxy.model.heightAdjustMode != "fill") {
                            if (proxy._getHeight() > proxy.element.height())
                                proxy._scrollerObj ? proxy._scrollerObj.refresh() : proxy._setScoller();
                        }
                        else proxy._setHeight();
                    }
                    if (proxy._scrollerObj) proxy._scrollerObj.refresh();
                    proxy._paneAdjustSize();
                });
                this._deleteSelectedItems(index);
            }
        },


        _renderHeaderIcon: function () {
            if (this._headers.find(".e-icon.e-acrdn-icon").length <= 0) {
                var icons = this.model.customIcon;
                if (icons) {
                    if (!(this.collapseALL && this.model.collapsible)) {
                        this._headers.eq(this.model.selectedItemIndex).find("span.e-icon.e-acrdn-icon")
                        .removeClass(icons.header)
                        .addClass(icons.selectedHeader);
                    }
                }
            }
        },


        _ajaxLoad: function () {
            var anchor = this._activeHeader.find("a[href]");
            if (anchor.length > 0) {
                var content = $(this._contentPanels[this.model.selectedItemIndex]);
                var href = $(anchor).attr("href");
                if (href && href !== "#")
                    this._sendAjaxOptions(content, anchor[0]);
            }
        },


        _sendAjaxOptions: function (content, link) {


            if (true === (this._trigger("ajaxBeforeLoad", { url: link })))
                return false;
            content.addClass("e-load");
            var proxy = this;
            var curTabTitle = $(link).html();
            var _hrefLink = link.href.replace("#", "");
            var _ajaxOptions = {
                type: this.model.ajaxSettings.type, cache: this.model.ajaxSettings.cache, url: _hrefLink, data: this.model.ajaxSettings.data,
                dataType: this.model.ajaxSettings.dataType, contentType: this.model.ajaxSettings.contentType, async: this.model.ajaxSettings.async,
                "success": function (data) {
                    try {
                        proxy._ajaxSuccessHandler(data, content, link, curTabTitle);
                    } catch (e) {

                    }
                }, "error": function () {
                    try {
                        proxy._ajaxErrorHandler(data, link, proxy.model.selectedItemIndex, curTabTitle);
                    } catch (e) {

                    }
                }
            };
            this._sendAjaxRequest(_ajaxOptions);
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
            content.html(data).addClass("e-acrdn-loaded"); //to indicate the content is already loaded
            var eventData = { data: data, url: link, content: content };
            this._trigger("ajaxSuccess", eventData);

            this._trigger("ajaxLoad", { url: link });
        },


        _ajaxErrorHandler: function (data, link, index, title) {
            this._trigger("ajaxError", { data: data, url: link });

            this._trigger("ajaxLoad", { url: link });
        },


        _setHeightStyle: function (heightFormat) {
            var proxy = this, maxHeight;
            if (ej.Accordion.HeightAdjustMode.Fill == heightFormat) {
                if (this.model.height != null) this._setHeight();
                else {
                    maxHeight = this._getDimension($(this.element).parent(), "height");
                    $(this.element).parent().css({ "overflow": "auto" });
                    proxy._headers.each(function () {
                        maxHeight -= proxy._getDimension($(this), "outerHeight");
                    });
                    var maxPadding = 0;
                    proxy._headers.next().each(function () {
                        maxPadding = Math.max(maxPadding, proxy._getDimension($(this), "outerHeight") - proxy._getDimension($(this), "height"));
                    }).height(maxHeight - maxPadding).css({ "overflow": "auto" });
                }
            } else if (ej.Accordion.HeightAdjustMode.Auto == heightFormat) {
                maxHeight = 0;
                proxy._headers.next().each(function () {
                    maxHeight = Math.max(maxHeight, proxy._getDimension($(this), "outerHeight"));
                }).height(maxHeight);
                this.maxAutoHeight = maxHeight;
            }
            if (ej.Accordion.HeightAdjustMode.Fill != heightFormat)
                if (this.model.height && this._getHeight() > this.element.height()) this._setScoller();
        },

        _getDimension: function (element, method) {
            var value;
            var $hidden = $(element).parents().addBack().filter(':hidden');
            var prop = { visibility: 'hidden', display: 'block' };
            var tmp = [];
            $hidden.each(function () {
                var temp = {}, name;
                for (name in prop) {
                    temp[name] = this.style[name];
                    this.style[name] = prop[name];
                }
                tmp.push(temp);
            });
            value = /(outer)/g.test(method) ?
            $(element)[method](true) :
           $(element)[method]();

            $hidden.each(function (i) {
                var temp = tmp[i], name;
                for (name in prop) {
                    this.style[name] = temp[name];
                }
            });

            return value;
        },


        _headerEventHandler: function (event) {
            if (this.model.enabled) {
                event.preventDefault();
                var clicked = $(event.currentTarget);
                var index = this._headers.index(clicked);
                if (this.model.enableMultipleOpen && this._headers.eq(index).hasClass("e-active")) {
                    this._hideTab(index);
                }
				else if(this.model.enableMultipleOpen && this.model.collapsible)
					this._activeTab(index);
                else if (this.model.selectedItemIndex == index && this.model.collapsible) {
                    this._hideTab(this.model.selectedItemIndex);
                    this.model.selectedItemIndex = -1
                }
                else if (!this._headers.eq(index).hasClass("e-active")) {
                    this._activeTab(index);
                }
            }
        },

        _addSelectedItems: function (index) {
			var _items = this.model.selectedItems;
            this._removeNullInArray(_items);
            if ($.inArray(index, _items) == -1)
                this.model.selectedItems.push(index);
        },

        _deleteSelectedItems: function (index) {
			
		    var _items = this.model.selectedItems;
            if ($.inArray(index, _items) > -1) {
                this.model.selectedItems.splice($.inArray(index, _items), 1);
                _items.length == 0 && (_items.push(-1));
            }
        },
         _removeNullInArray: function (array) {
            var i = array.indexOf(-1);
            if (i != -1) array.splice(i, 1);
        },
        _deleteDisabledItems: function (index) {
            var position;
            if ($.inArray(index, this.model.disabledItems) > -1) {
                position = $.inArray(index, this.model.disabledItems);
                this.model.disabledItems.splice(position, 1);
            }
        },
        _addEnabledItems: function (index) {
            if ($.inArray(index, this.model.enabledItems) < 0)
                this.model.enabledItems.push(index);
        },
        _deleteEnabledItems: function (index) {
            var position;
            if ($.inArray(index, this.model.enabledItems) > -1) {
                position = $.inArray(index, this.model.enabledItems);
                this.model.enabledItems.splice(position, 1);
            }
        },

        _keyPress: function (e) {
            if (this.model.enabled) {
                var index, currentEle, targetEle = $(e.target);
                if ((targetEle.hasClass("e-select")) || (targetEle.hasClass("e-acrdn"))) {
                    index = this.model.selectedItemIndex;
                }

                if (e.keyCode) var code = e.keyCode; // ie and mozilla/gecko
                else if (e.which) code = e.which; // ns4 and opera
                else code = e.charCode;
                if ((targetEle.hasClass("e-select")) || (targetEle.hasClass("e-acrdn"))) {
                    switch (code) {

                        case 39:
                        case 40:
                            e.preventDefault();
                            index = index == (this.getItemsCount() - 1) ? 0 : index + 1;
                            this._activeTab(index);
                            currentEle = $(this._headers[index]);
                            break;

                        case 38:
                        case 37:
                            e.preventDefault();
                            index = index == 0 ? (this.getItemsCount() - 1) : index - 1;
                            this._activeTab(index);
                            currentEle = $(this._headers[index]);
                            break;

                        case 35:
                            e.preventDefault();
                            currentEle = $(this._headers[this.getItemsCount() - 1]);
                            this._activeTab((this.getItemsCount() - 1));
                            break;

                        case 36:
                            e.preventDefault();
                            currentEle = $(this._headers[0]);
                            this._activeTab(0);
                            break;
                        case 32:
                        case 13:
                            e.preventDefault();
                            $(this._headers[index]).hasClass("e-active") && (this.model.enableMultipleOpen || this.model.collapsible) ? this._hideTab(index) : this._activeTab(index);
                            break;
                    }
                }
                else if (e.ctrlKey && !targetEle.hasClass("e-acrdn")) {
                    switch (code) {
                        case 38:
                            e.preventDefault();
                            index = this._contentPanels.index(targetEle.parent(".e-content"));
                            currentEle = $(this._headers[index]);
                            this._activeTab(index);
                            break;
                        case 33:
                            e.preventDefault();
                            currentEle = $(this._headers[0]);
                            this._activeTab(0);
                            break;
                        case 34:
                            e.preventDefault();
                            currentEle = $(this._headers[this.getItemsCount() - 1]);
                            this._activeTab((this.getItemsCount() - 1));
                            break;
                    }
                }
                if (!ej.isNullOrUndefined(currentEle)) {
                    currentEle.addClass("e-focus");
                    currentEle.focus();
                }
            }
        },


        _wireEvents: function () {
            this._on(this._headers, this.model.events, this._headerEventHandler);
            if (this.model.allowKeyboardNavigation) this._on(this.element, 'keydown', this._keyPress);
            $(window).on('resize', $.proxy(this._contentPaneSize, this));
            if (this.model.height && this.model.width && this.model.width.toString().indexOf("%") != -1)
                $(window).on('resize', $.proxy(this._scrollerRefresh, this));
        },
        _scrollerRefresh: function (e) {
            if (this.model.height) {
                if (this.model.heightAdjustMode != "fill") {
                    if (this._getHeight() > this.model.height)
                        this._scrollerObj ? this._scrollerObj.refresh() : this._setScoller();
                }
                else this._setHeight();
            }
        },
        _unWireEvents: function () {
            this._off(this._headers, this.model.events);
            $(window).off('resize', $.proxy(this._contentPaneSize, this));
            $(window).off('resize', $.proxy(this._scrollerRefresh, this));
            if (this.model.allowKeyboardNavigation) {
                this._off(this.element, 'keydown');
            }
        },

        _contentPaneSize: function () {
            var maxHeight = this._getDimension($(this.element).parent(), "height");
            if (this._prevSize == maxHeight) return;
            if (ej.Accordion.HeightAdjustMode.Fill == this.model.heightAdjustMode) {
                if (this.model.enableMultipleOpen) this._paneAdjustSize()
                else this._setHeightStyle(this.model.heightAdjustMode);
            }
            this._prevSize = maxHeight;
        },
        _disableItems: function (itemIndexes) {
            if ($.isArray(itemIndexes)) {
                for (var i = 0; i < itemIndexes.length; i++) {
                    $(this._headers[itemIndexes[i]]).addClass("e-disable");
                    $(this._contentPanels[itemIndexes[i]]).addClass("e-disable");
                    $(this._headers[itemIndexes[i]]).off(this.model.events);
                    if (this.model.disabledItems.indexOf(itemIndexes[i]) == -1) this.model.disabledItems.push(itemIndexes[i]);
                    this._hideTab(itemIndexes[i], true);
                    this._deleteEnabledItems(itemIndexes[i]);

                }
            }
            else {
                $(this._headers[itemIndexes]).addClass("e-disable");
                $(this._contentPanels[itemIndexes]).addClass("e-disable");
                $(this._headers[itemIndexes]).off(this.model.events);
                if ($(this.model.disabledItems).index(itemIndexes[i]) == -1 && this.model.disabledItems != itemIndexes)
                    this.model.disabledItems.push(itemIndexes);
                this._hideTab(itemIndexes, true);
                this._deleteEnabledItems(itemIndexes[i]);
            }
            if (!this.model.enableMultipleOpen) {
                var index, previous = this.model.selectedItemIndex;
                for (i = 0; i < this.model.disabledItems.length; i++) {
                    index = this.model.selectedItemIndex;
                    if ($.inArray(index, this.model.disabledItems) >= 0) {
                        index++;
                        this.model.selectedItemIndex = index;
                        //this._selectedItemsAction(index);
                    }
                }
                if(index == this._headers.length){
                    index = index - 1;
                    for (i = 0; i < this.model.disabledItems.length; i++) 
                        if ($.inArray(index, this.model.disabledItems) >= 0) {
                            index--;
                            this.model.selectedItemIndex = index;
                        }
                }
                if (previous !== this.model.selectedItemIndex)
                    this._selectedItemsAction(index);
            }
        },
        enableItems: function (itemIndexes) {
            if (!this.model.enabled) return false;
            if ($.isArray(itemIndexes)) {
                for (var i = 0; i < itemIndexes.length; i++) {
                    $(this._headers[itemIndexes[i]]).removeClass("e-disable");
                    $(this._contentPanels[itemIndexes[i]]).removeClass("e-disable");
                    this._on($(this._headers[itemIndexes[i]]), this.model.events, this._headerEventHandler);
                    if (this.model.enabledItems.indexOf(itemIndexes[i]) == -1) this.model.enabledItems.push(itemIndexes[i]);
                    this._deleteDisabledItems(itemIndexes[i]);
                }
            }
            else {
                $(this._headers[itemIndexes]).removeClass("e-disable");
                $(this._contentPanels[itemIndexes]).removeClass("e-disable");
                this._on($(this._headers[itemIndexes]), this.model.events, this._headerEventHandler);
                if (this.model.enabledItems.indexOf(itemIndexes[i]) == -1) this.model.enabledItems.push(itemIndexes[i]);
                this._deleteDisabledItems(itemIndexes);
            }
        },
        disableItems: function (itemIndexes) {
            if (!this.model.enabled) return false;
            this._disableItems(itemIndexes);
        },

        addItem: function (header_name, content, index, isAjaxReq) {
            var contentTag, headerTag, anchorTag, animation;
            if (ej.isNullOrUndefined(isAjaxReq)) isAjaxReq = false;
            if (ej.isNullOrUndefined(index) || index > this._headers.length) this._addItemIndex = this._headers.length;
            else if (index >= 0 && index <= this._headers.length) this._addItemIndex = index;
            else return false;
            animation = this.model.enableAnimation;
            if(animation)
                this.model.enableAnimation = false;
            if(this.model.heightAdjustMode == "fill") this._headers.next().height("auto")
            for (var disable_index = 0; disable_index < this.model.disabledItems.length; disable_index++) {
                if (this.model.disabledItems[disable_index] >= this._addItemIndex)
                    this.model.disabledItems[disable_index]++;
            }
            var headerTag = ej.buildTag('h3').addClass("e-select").attr("role", "tab").attr("tabindex", 0);
            if(this._addItemIndex == 0)
                headerTag.insertBefore($(this._headers[this._addItemIndex]));
            else
                headerTag.insertAfter($(this._headers[this._addItemIndex - 1]).next());
            if(this._addItemIndex <= this.model.selectedItemIndex)
                this.model.selectedItemIndex += 1;
            if (!this._headers.length) {
                this._headers = headerTag;
                this.element.append(this._headers);
                this.model.selectedItemIndex = 0;
            }
            var anchorTag = ej.buildTag("a").attr("href", isAjaxReq ? content : "#").text(header_name);
            anchorTag.appendTo(headerTag);
            if (isAjaxReq) content = "";
            if ($(content).length > 0) contentTag = $(content);
            else contentTag = ej.buildTag('div').text(content);
            contentTag.addClass("e-content").attr("role", "tabpanel").attr("aria-hidden", true).hide();
            contentTag.insertAfter(headerTag);
            this._headers = this.element.find("> :even");
            this._contentPanels = this._headers.next();
            ej.buildTag("span.e-icon e-acrdn-icon " + this.model.customIcon.header).prependTo(headerTag);
            if(this.model.showCloseButton) {
                var deleteIcon = this._createDeleteIcon();
                headerTag.append(deleteIcon);
                this._on(deleteIcon, "click", this._panelDeleteClick);
            }
            if(this.model.enableMultipleOpen){
                this.model.selectedItems = [];
                for(var value = 0; value < this._headers.length; value++)
                    if($(this._headers[value]).hasClass('e-active'))
                        this.model.selectedItems.push(value);
                this._selectedItemsAction(this.model.selectedItems);
            }
            else{
                this.model.selectedItems = [];
                this.model.selectedItems.push(this.model.selectedItemIndex);
                this._selectedItemsAction(this.model.selectedItems);
            }
            this.model.width = this.model.width || this.element.css("width");
            if (this.model.height) this.element.css("height", this.model.height);
            if (this.model.enableRTL) {
                headerTag.addClass("e-rtl");
                contentTag.addClass("e-rtl");
            }
            (!this.model.enableMultipleOpen) && this._renderHeaderIcon();
            if (!ej.isNullOrUndefined(this.model.headerSize)) this._setHeaderSize();
            this._on(headerTag, this.model.events, this._headerEventHandler);
            this._roundedCorner(this.model.showRoundedCorner);

            if (this.model.heightAdjustMode == "fill" && !this.model.enableMultipleOpen)
                this._setHeightStyle(this.model.heightAdjustMode);
            this.disableItems(this.model.disabledItems);
            this._setEnabledItems();
            if(animation)
                this.model.enableAnimation = true;
        },

        removeItem: function (index) {
            if (!this.model.enabled) return false;
            if (index != null && index > -1 && index < this._headers.length) {
                var animation = this.model.enableAnimation;
                if(animation)
                    this.model.enableAnimation = false;
                var removedTab = $(this._headers[index]).remove();
                for (var disable_index = 0; disable_index < $(this.model.disabledItems).length; disable_index++) {
                    if (this.model.disabledItems[disable_index] > index)
                        this.model.disabledItems[disable_index]--;
                    else if (this.model.disabledItems[disable_index] == index) {
                        this.model.disabledItems.splice(disable_index, 1);
                    }
                }
                $(this.element.find(">div.e-content")[index]).remove();
                this._contentPanels.splice(index, 1);
                this._headers.splice(index, 1);
                if(this.model.enableMultipleOpen && this.model.selectedItemIndex == index)
                    this.model.selectedItemIndex = null;
                else if(!this.model.enableMultipleOpen){
                    if (index == this.model.selectedItemIndex && this.model.collapsible)
                        this.model.selectedItemIndex = null;
                    else if (index == 0 && this.model.selectedItemIndex == 0)
                        this.model.selectedItemIndex = 0;
                    else if (index <= this.model.selectedItemIndex)
                        this.model.selectedItemIndex -= 1;
                }
                this._unWireEvents();
                this._wireEvents();
                if (this.model.heightAdjustMode == "fill" && !this.model.enableMultipleOpen)
                   this._setHeightStyle(this.model.heightAdjustMode);
                if(this.model.enableMultipleOpen){
                    this.model.selectedItems = [];
                    for(var value = 0; value < this._headers.length; value++)
                        if($(this._headers[value]).hasClass('e-active'))
                            this.model.selectedItems.push(value);
                    this._selectedItemsAction(this.model.selectedItems);
                }else{
                    this.model.selectedItems = [];
                    this.model.selectedItems.push(this.model.selectedItemIndex);
                    this._selectedItemsAction(this.model.selectedItems);
                }
                this.disableItems(this.model.disabledItems);
                this._setEnabledItems();
                if(animation)    
                    this.model.enableAnimation = true;
            }
        },

        collapseAll: function () {
            if (this.model.enableMultipleOpen || this.model.collapsible) {
                this.model.selectedItemIndex = null;
                for (var index = 0; index < this.getItemsCount() ; index++)
                    this._hideTab(index, false, true);
            }
        },

        expandAll: function (val) {
            if (this.model.enableMultipleOpen) {
                for (var index = 0; index < this.getItemsCount() ; index++) {
                    this._activeTab(index, false, true);
                    this.model.selectedItemIndex = index;
            }
            }
        },


        disable: function () {
			this.model.enabled = false;
            for (var i = 0; i < this._headers.length; i++) this._disableItems([i]);
            
            $(this.element.parent(".e-scroller")).addClass(".e-disable");
            if (this._scrollerObj) {
                var scroller = $(this.element.parent(".e-scroller")).find(".e-vscrollbar");
                if (scroller.length > 0) this._scrollerObj.disable();
            }
            this._unWireEvents();
        },

        enable: function () {
			this.model.enabled = true;
            for (var i = 0; i < this._headers.length; i++) this.enableItems([i]);
            if (this._scrollerObj) this._scrollerObj.enable();
            this._unWireEvents();
            this._wireEvents();
        },

        refresh: function () {
            this._contentPaneSize();
        },
        _selected: function (index) {
            if (!this.model.enabled) return false;
            if (index != null && this.model.selectedItemIndex != index) {
                this._activeTab(index);
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


        getItemsCount: function () {
            if (this._headers) {
                return this._headers.length;
            }
        }
    });


    ej.Accordion.HeightAdjustMode = {
		/**  Height fit to the content in the panel */
        Content: "content",
		/**  Height set to the largest content in the panel */
        Auto: "auto",
		/**  Height filled to the content of the panel */
        Fill: "fill"
    };
})(jQuery, Syncfusion);