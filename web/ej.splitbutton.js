/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejSplitButton", "ej.SplitButton", {

        element: null,

        model: null,
        validTags: ["button"],
        _setFirst: false,

        _rootCSS: "e-splitbutton",

        defaults: {

            size: "normal",

            width: "",

            height: "",

            enabled: true,

            htmlAttributes: {},

            text: null,

            contentType: "textonly",

            imagePosition: "imageleft",

            buttonMode: "split",

            arrowPosition: "right",

            targetID: null,

            target: null, 

            showRoundedCorner: false,

            prefixIcon: null,

            suffixIcon: null,

            cssClass: "",

            enableRTL: false,

            create: null,

            beforeOpen: null,

            click: null,

            itemMouseOver: null,

            itemMouseOut: null,

            itemSelected: null,

            open: null,

            close: null,

            destroy: null,

            popupPosition: "down",
    
        },

        dataTypes: {
            size: "string",
            enabled: "boolean",
            showRoundedCorner: "boolean",
            text: "string",
            contentType: "enum",
            imagePosition: "enum",
            buttonMode: "enum",
            arrowPosition: "enum",
            target: "string",       
            targetID: "string",
            prefixIcon: "string",
            suffixIcon: "string",
            cssClass: "string",
            enableRTL: "boolean",
            htmlAttributes: "data"
        },


        disable: function () {
            this.element.addClass("e-disable");
            this.wrapper.addClass("e-disable");
            if (this.contstatus) {
                this._hidePopup();
            }
            if (this.model.buttonMode == ej.ButtonMode.Split)
                this.dropbutton.addClass("e-disable").attr("aria-disabled", true);
            if (this.model.buttonMode == ej.ButtonMode.Dropdown)
                this.btnimgwrap.addClass("e-disable").attr("aria-disabled", true);
            this.model.enabled = false;
        },

        visible: function (display) {
            if (!display) {
               this.wrapper.addClass("e-split-btn-hide");
               this.wrapper.find(".e-icon").css("visibility", "hidden");
            }
            else {
               this.wrapper.removeClass("e-split-btn-hide");
               this.wrapper.find(".e-icon").css("visibility", "");
            }
        },

        enable: function () {
            this.element.removeClass("e-disable");
            this.wrapper.removeClass("e-disable");
            if (this.model.buttonMode == ej.ButtonMode.Split)
                this.dropbutton.removeClass("e-disable").attr("aria-disabled", false);
            if (this.model.buttonMode == ej.ButtonMode.Dropdown)
                this.btnimgwrap.removeClass("e-disable").attr("aria-disabled", false);
            this.model.enabled = true;
        },

        hide: function () {
            if (this.contstatus) {
                this._hidePopup();
            }
        },

        show: function () {
            if (!this.contstatus) {
                if (this.model.buttonMode == ej.ButtonMode.Dropdown)
                    this.element.click();
                else if (this.model.buttonMode == ej.ButtonMode.Split)
                    this.dropbutton.click();
            }
        },

        setPopupPosition: function (val) {
            this._setPosition = true;
            this._val = val;
        },

        _init: function () {
            this._cloneElement = this.element.clone();
            this._setPosition = false;
            this._initialize();
            this._controlStatus(this.model.enabled);
            this._documentClickHandler = $.proxy(this._documentClick, this);
            this._wireEvents();
        },

        _createElement: function (tagName, attrs) {
            var ele = document.createElement(tagName);
            this._setAttributes(ele, attrs);
            return $(ele);
        },
        _setAttributes: function (ele, attrs) {
            for (var key in attrs) {
                ele.setAttribute(key, attrs[key]);
            }
        },

        _destroy: function () {
            if (this.contstatus) {
                this._hide();
            }
            this.splitwrap.removeClass("e-drop");
            this.splitwrap.removeClass("e-btn-" + this.model.size);
            this.innerWrap.removeClass("e-splitarrowright e-splitarrowleft e-splitarrowbottom e-splitarrowtop");
            this.element.removeClass(this.model.cssClass + "e-ntouch e-select e-corner e-btn e-disable e-split-btn e-droparrowright e-droparrowleft e-droparrowbottom e-droparrowtop e-left-btn e-txt").empty();
            this.element.append(this._cloneElement.text());
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
            if(this._contextObj) this._contextObj.model && this._contextObj.destroy();            
			if(this._contextObj) this._contextObj = null;			
            //this has to be worked out in Menu
            $(this.model.target).show();
            $(this.model.target).insertAfter(this.element); 
            this._off(this.element, "click", this._btnMouseClick);
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "size":
                        this._setSize(options[option]);
                        break;
                    case "width":
                        this._splitbtnWidth(options[option]);
                        break;
                    case "height":
                        this._splitbtnHeight(options[option]);
                        break;
                    case "contentType":
                        this._setContentType(options[option]);
                        break;
                    case "imagePosition":
                        this._setImagePosition(options[option]);
                        break;
                    case "buttonMode":
                        this._setButtonMode(options[option]);
                        break;
                    case "arrowPosition":
                        this._setArrowPosition(options[option]);
                        break;
                    case "text":
                        this._setText(options[option]);
                        break;
                    case "prefixIcon":
                        this._setMajorIcon(options[option]);
                        break;
                    case "suffixIcon":
                        this._setMinorIcon(options[option]);
                        break;
                    case "enabled":
                        this._controlStatus(options[option]);
                        break;
                    case "targetID":
                    case "target":
                        this._setTarget(options[option]);
                        break;
                    case "showRoundedCorner":
                        this._roundedCorner(options[option]);
                        break;
                    case "cssClass":
                        this._setSkin(options[option]);
                        break;
                    case "enableRTL":
                        this._setRTL(options[option]);
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "popupPosition":
                        this._setPopupPosition(options[option]);
                        break;
                }
            }
        },

        _setText: function (val) {
            if (this.model.contentType == ej.ContentType.TextOnly) {
                if (this.model.buttonMode == ej.ButtonMode.Split)
                    this.element.html(val);
                else {
                    this.element.empty();
                    this.imgtxtwrap = val;
                    if (this.model.arrowPosition == ej.ArrowPosition.Left || this.model.arrowPosition == ej.ArrowPosition.Top)
                        this.element.append(this.btnimgwrap, this.imgtxtwrap);
                    else
                        this.element.append(this.imgtxtwrap, this.btnimgwrap);
                }
            } else {
                this.textspan.html(val);
            }
        },

        _setMajorIcon: function (val) {
            this.majorimgtag.removeClass(this.model.prefixIcon);
            this.majorimgtag.addClass(val);
        },

        _setMinorIcon: function (val) {
            this.minorimgtag.removeClass(this.model.suffixIcon);
            this.minorimgtag.addClass(val);
        },
        _setTarget: function (val) {
            if ((val.substring(0, 1) == ".") || (val.substring(0, 1) == "#")) {
                this.model.target = val; 
            }
            else {
                this.model.targetID = val;
                this.model.target = "#" + val;
            }
            this._renderContxtMenu();
        },

        _setContentType: function (val) {
            if (val != this.model.contentType) {
                this.element.empty();
                this.model.contentType = val;
                this._renderButtonContent();
            }
        },

        _setImagePosition: function (val) {
            if (val == ej.ImagePosition.ImageRight || val == ej.ImagePosition.ImageLeft || val == ej.ImagePosition.ImageBottom || val == ej.ImagePosition.ImageTop) {
                if ((this.model.contentType == ej.ContentType.TextAndImage) && (val != this.model.imagePosition)) {
                    this.element.empty();
                    this.model.imagePosition = val;
                    this._renderButtonContent();
                }
            }
        },

        _setButtonMode: function (val) {
            if (val == ej.ButtonMode.Split || val == ej.ButtonMode.Dropdown) {
                if (val != this.model.buttonMode) {
                    this._destroy();
                    this.model.buttonMode = val;
                    this._init();
                }
            }
        },

        _setArrowPosition: function (val) {
            if (val == ej.ArrowPosition.Right || val == ej.ArrowPosition.Left || val == ej.ArrowPosition.Bottom || val == ej.ArrowPosition.Top) {
                if ((this.model.buttonMode == ej.ButtonMode.Dropdown) && (val != this.model.arrowPosition)) {
                    this.model.arrowPosition = val;
                    this.element.empty();
                    this._setSize(this.model.size);
                    this.element.removeClass("e-droparrowright e-droparrowleft e-droparrowbottom e-droparrowtop");
                    this._renderButtonContent();
                }
                else if ((this.model.buttonMode == ej.ButtonMode.Split) && (val != this.model.arrowPosition)) {
                    this.model.arrowPosition = val;
                    this._setSize(this.model.size);
                    this.innerWrap.removeClass("e-splitarrowright e-splitarrowleft e-splitarrowbottom e-splitarrowtop");
                    this._setRTL(this.model.enableRTL);
                }
            }
        },

        _setPopupPosition: function (val) {
            this.model.popupPosition = val;
            if (this.model.popupPosition == "down")
                this.dropdownimg.addClass("e-arrow-sans-down").removeClass("e-arrow-sans-up");
            if (this.model.popupPosition == "up")
                this.dropdownimg.addClass("e-arrow-sans-up").removeClass("e-arrow-sans-down");
        },

        _setRTL: function (val) {
            if (this.model.buttonMode == ej.ButtonMode.Split) {
                this.dropdownimg.removeClass("e-arrow-sans-up").addClass("e-arrow-sans-down");
                switch (this.model.arrowPosition) {
                    case ej.ArrowPosition.Right:
                        this.innerWrap.addClass("e-splitarrowright");
                        break;
                    case ej.ArrowPosition.Left:
                        this.innerWrap.addClass("e-splitarrowleft");
                        break;
                    case ej.ArrowPosition.Bottom:
                        this.innerWrap.addClass("e-splitarrowbottom");
                        break;
                    case ej.ArrowPosition.Top:
                        this.innerWrap.addClass("e-splitarrowtop");
                        this.dropdownimg.addClass("e-arrow-sans-up").removeClass("e-arrow-sans-down");
                        break;
                }
                val == true ? (this.innerWrap.hasClass("e-splitarrowleft") ? "" : this.splitwrap.addClass("e-rtl e-btnrtl")) && (this._contextObj && this._contextObj.model && this._contextObj.element.addClass('e-rtl')) : this.splitwrap.removeClass("e-rtl e-btnrtl") && (this._contextObj && this._contextObj.model && this._contextObj.element.removeClass('e-rtl'));
            }
            else
                val == true ? this.splitwrap.addClass('e-rtl') && (this._contextObj && this._contextObj.model && this._contextObj.element.addClass('e-rtl')) : this.splitwrap.removeClass('e-rtl') && (this._contextObj && this._contextObj.model && this._contextObj.element.removeClass('e-rtl'));
            this.model.enableRTL = val;
            this._roundedCorner(this.model.showRoundedCorner);
        },

        _roundedCorner: function (value) {
            if (value) {
                this.element.addClass('e-corner');
                if ($(this.model.target).length > 0) $(this.model.target).addClass('e-corner');  
            } else {
                this.element.removeClass('e-corner');
                if ($(this.model.target).length > 0) $(this.model.target).removeClass('e-corner');
            }
        },

        _controlStatus: function (value) {
            if (!value) {
                this.disable();
            } else {
                this.enable();
            }
        },

        _setSkin: function (skin) {
            this.element.removeClass(this.model.cssClass);
            if (this.model.buttonMode == ej.ButtonMode.Split) {
                this.dropbutton.removeClass(this.model.cssClass);
                this.dropbutton.addClass(skin);
            }
            this.element.addClass(skin);
            if(this._contextObj) this._contextObj.model && this._contextObj.option('cssClass', skin);  
        },

        _initialize: function () {
            if (this.element.is("button") || this.element.is("ej-splitbutton")) {
                this._render();
            } else {
                this.element.removeClass("e-splitbutton");//need to change in src level
            }
            this._timeout = null;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy._controlStatus(false);
                else proxy.wrapper.attr(key, value)
            });
        },


        _render: function () {
            this.element.addClass(this.model.cssClass + " e-btn e-select e-split-btn " + (!ej.isTouchDevice() ? "e-ntouch" : ""));
            this._setAttributes(this.element[0]);
            if ((this.model.text == null) || (this.model.text == "")) {
                this.model.text = this.element.text();
            }
            else
                this._setAttributes(this.element[0],{"aria-describedby": this.model.text});
            if (this.model.buttonMode != ej.ButtonMode.Split && this.model.buttonMode != ej.ButtonMode.Dropdown)
                this.model.buttonMode = ej.ButtonMode.Split;
            if (this.model.arrowPosition != ej.ArrowPosition.Right && this.model.arrowPosition != ej.ArrowPosition.Left && this.model.arrowPosition != ej.ArrowPosition.Bottom && this.model.arrowPosition != ej.ArrowPosition.Top)
                this.model.arrowPosition = ej.ArrowPosition.Right;
            this.element.empty();
            this.splitwrap = (this.model.buttonMode == ej.ButtonMode.Split ? this._createElement('span', { 'class': 'e-split e-widget' }) : this._createElement('span', { 'class': 'e-split e-drop e-widget' }));
            this.splitwrap.insertBefore(this.element);
            this.innerWrap = this._createElement('span', { 'class': 'e-in-wrap e-box e-padding' });
            this.splitwrap[0].appendChild(this.innerWrap[0]);
            this.wrapper = this.splitwrap;
            /*DropDown Image*/
            this.dropdownimg = this._createElement('span', { "class": "e-icon e-arrow-sans-down" });
            this.dropdownimage = this._createElement('span', { "class": "e-icon e-arrow-sans-up" });
            this.btnimgwrap = this._createElement('span', { 'class': 'e-split-btn-div e-btn-span' });
            if (this.model.popupPosition == "up")
                this.btnimgwrap[0].appendChild(this.dropdownimage[0])
            else
            this.btnimgwrap[0].appendChild(this.dropdownimg[0]);
            /*Split Button*/
            if (this.model.buttonMode == ej.ButtonMode.Split) {
                this.dropbutton = ej.buildTag('button.e-split-btn e-btn e-select ' + this.model.cssClass + ' e-drp-btn' + (!ej.isTouchDevice() ? " e-ntouch" : ""), "", {}, { type: "button", "data-role": "none", "id": this.element[0].id + 'drpbtn' });
                this.dropbutton[0].appendChild(this.btnimgwrap[0]);
                this.dropbutton.insertAfter(this.element);
                if (this.model.contentType == ej.ContentType.TextOnly)
                    this.dropbutton.addClass("e-btn-txt");
                else
                    this.dropbutton.addClass("e-rht-btn");
            }
            this._setSize(this.model.size);
            this.element.addClass("e-left-btn");
            this._renderButtonContent();
            if (this.model.buttonMode == ej.ButtonMode.Dropdown)
                this.innerWrap[0].appendChild(this.element[0]);
            else {
                this.innerWrap[0].appendChild(this.element[0]);
                this.innerWrap[0].appendChild(this.dropbutton[0]);
            }
            /* If target ID is set, the value of target will be set to target prefixed with # tag */
            if ((this.model.target == null) && (this.model.targetID != null)) {
                this.model.target = "#"+this.model.targetID;
            }
            /*Rendering Context menu*/
            $(this.model.target).hide();
            this._roundedCorner(this.model.showRoundedCorner);
            this._setRTL(this.model.enableRTL);
            this._addAttr(this.model.htmlAttributes);
        },

        _renderButtonContent: function () {
            /*Image and Text*/
            this.textspan = ej.buildTag('span.e-btntxt', this.model.text);
            this.majorimgtag = ej.buildTag('span').addClass(this.model.prefixIcon);
            this.minorimgtag = ej.buildTag('span').addClass(this.model.suffixIcon);
            this.imgtxtwrap = ej.buildTag('span').addClass('e-btn-span');;
            /*Rendering Option*/
            if (this.model.contentType == ej.ContentType.TextAndImage) {
                switch (this.model.imagePosition) {
                    case ej.ImagePosition.ImageRight:
                        this.imgtxtwrap.append(this.textspan, this.majorimgtag);
                        break;
                    case ej.ImagePosition.ImageLeft:
                        this.imgtxtwrap.append(this.majorimgtag, this.textspan);
                        break;
                    case ej.ImagePosition.ImageBottom:
                        this.majorimgtag.css("display", "inline-table");
                        this.imgtxtwrap.append(this.textspan, this.majorimgtag);
                        break;
                    case ej.ImagePosition.ImageTop:
                        this.majorimgtag.css("display", "inline-table");
                        this.imgtxtwrap.append(this.majorimgtag, this.textspan);
                        break;
                }
            } else if (this.model.contentType == ej.ContentType.ImageTextImage) {
                this.imgtxtwrap.append(this.majorimgtag, this.textspan, this.minorimgtag);
            } else if (this.model.contentType == ej.ContentType.ImageBoth) {
                this.imgtxtwrap.append(this.majorimgtag, this.minorimgtag);
            } else if (this.model.contentType == ej.ContentType.ImageOnly) {
                this.imgtxtwrap.append(this.majorimgtag);
            } else {
                this.element.addClass("e-txt");
                this.imgtxtwrap = this.model.text;
            }
            if (this.model.buttonMode == ej.ButtonMode.Dropdown)
                this._renderDropdownArrow();
            else
                this.element.append(this.imgtxtwrap);
        },

        _renderDropdownArrow: function () {
            this.btnimgwrap.css("position", "absolute");
            this.dropdownimg.removeClass("e-arrow-sans-up").addClass("e-arrow-sans-down");
            switch (this.model.arrowPosition) {
                case ej.ArrowPosition.Right:
                    this.element.addClass("e-droparrowright");
                    this.element.append(this.imgtxtwrap, this.btnimgwrap);
                    break;
                case ej.ArrowPosition.Left:
                    this.element.addClass("e-droparrowleft");
                    this.element.append(this.btnimgwrap, this.imgtxtwrap);
                    break;
                case ej.ArrowPosition.Bottom:
                    this.element.addClass("e-droparrowbottom");
                    this.element.append(this.imgtxtwrap, this.btnimgwrap);
                    break;
                case ej.ArrowPosition.Top:
                    this.element.addClass("e-droparrowtop");
                    this.dropdownimg.addClass("e-arrow-sans-up").removeClass("e-arrow-sans-down");
                    this.element.append(this.btnimgwrap, this.imgtxtwrap);
                    break;
            }
        },


        _setSize: function (val) {
            this.wrapper.css({ "height": "", "width": "" });
            switch (val) {
                case "mini":
                    this._splitbtnSize(val);
                    break;
                case "small":
                    this._splitbtnSize(val);
                    break;
                case "medium":
                    this._splitbtnSize(val);
                    break;
                case "large":
                    this._splitbtnSize(val); 
                    break;
                default:
                    this._splitbtnSize(val);
                    break;
            }
            if ((this.model.arrowPosition == ej.ArrowPosition.Bottom || this.model.arrowPosition == ej.ArrowPosition.Top) && this.model.height == "")
                this.splitwrap.addClass("e-btn-arrowsplit-" + val);		   // 15px added the height of the wrapper due to Arrow positioned in bottom
            var wd, ht = this.model.height === "" ? this.wrapper.outerHeight() + "px" : this.model.height;
            this._splitbtnHeight(ht);
            if (this.model.size !== "normal") {
                wd = this.model.width === "" ? this.wrapper.outerWidth() + "px" : this.model.width;
                this._splitbtnWidth(wd);
            }
            else if (this.model.width !== "") {
                wd = this.model.width;
                this._splitbtnWidth(wd);
            }
        },

        _splitbtnSize: function (val) {
        
            this.splitwrap.removeClass('e-btn-mini e-btn-medium e-btn-small e-btn-large e-btn-normal e-btn-arrowsplit-large e-btn-arrowsplit-small e-btn-arrowsplit-mini e-btn-arrowsplit-medium e-btn-arrowsplit-normal');
            if (this.model.arrowPosition == ej.ArrowPosition.Left || this.model.arrowPosition == ej.ArrowPosition.Right)
            {
            this.splitwrap.addClass("e-btn-" + val);
            }
        },
        _splitbtnHeight: function (val) {
           if ((val == "") || (val == null)) val = '30px';
          this.splitwrap.css("height", val);
        },


        _splitbtnWidth: function (val) {
            this.splitwrap.css("width", val);
        },


        _renderContxtMenu: function () {
            /* Check whether target is a class and add a id to that target element if id of that element is not given */
            if ((this.model.target != null) && ($(this.model.target).attr("id") == null)) {
                if (this.model.target.substring(0, 1) == ".") {
                    $(this.model.target).attr("id", this.element.attr('id') + "_" + this.model.target.replace(".", ""));
                }
            }
            
            $(this.model.target).ejMenu({
                menuType: ej.MenuType.ContextMenu,
                openOnClick: false,
                contextMenuTarget: "",
                fields: this.model.fields,
                showArrow: true,
                cssClass: "e-split " + this.model.cssClass,
                enableRTL: this.model.enableRTL
            }).on("ejMenuclose", $.proxy(this._onKeyDown, this));
            this._contextObj = $(this.model.target).ejMenu("instance");
        },
        _onKeyDown: function (e) {
            e.keyCode == 27 && this._hide();
        },
        _itemClick: function (args) {
            args = { status: this.model.enabled, ID: args.ID, text: args.text };
            this._trigger("itemSelected", args);
            (!$(args.element).hasClass("e-haschild")) && this._hide();
        },

        _itemMouseOver: function (args) {
            this._trigger("itemMouseOver", args);
        },

        _itemMouseOut: function (args) {
            this._trigger("itemMouseOut", args);
        },


        _wireEvents: function () {
            this._on(this.element, "click", this._btnMouseClick);
            this._on(this.element, "mousedown", this._btnMouseDown);
            /*DrpBTN*/
            if (this.model.buttonMode == ej.ButtonMode.Split)
                this._on(this.dropbutton, "click", this._btnMouseClick);
            /*DocClk*/
            this._on($(document), "mousedown", this._docrhtclk);
        },


        _btnMouseClick: function (e) {
            !this._contextObj ? this._renderContxtMenu() : !this._contextObj.model && this._renderContxtMenu();
            var args;
            if(!this.model.enabled) return false;
            if (!$(e.currentTarget).hasClass("e-disable")) {
                if (e.currentTarget.id != this.element[0].id + "drpbtn" && this.model.buttonMode == ej.ButtonMode.Split) {
                    args = { status: this.model.enabled };
                    this._trigger("click", args);
                } else {
                    !this.contstatus && this._trigger("beforeOpen");
                    this.wrapper.addClass('e-active');
                    if (this.contstatus) {
                        this._hidecontext(e);
                    } else {
                        this._contextPosition(e);
                        this._trigger("open");
                        this._on($(window), "resize", this._OnWindowResize);
                        this.contstatus = true;
                        this.element.on("click", $.proxy(this._hidecontext, this));
                        ej.listenTouchEvent($(document), ej.startEvent(), this._documentClickHandler, false, this);
                        this._on(ej.getScrollableParents(this.wrapper), "scroll", this._hidePopup);
                    }
                }
            }
        },

        _OnWindowResize: function (e) {
            this._contextPosition(e);
        },

        _contextPosition: function (e,value,m,n) {
            if (this._contextObj.model) {
                if (this._setPosition) 
                    var position = this._val;
                else
                var position = this._getXYpos(e);
                var posleft, targetElement, posadjustleft;
                targetElement = (this.model.buttonMode == ej.ButtonMode.Split ? this.dropbutton : this.element);
                var contextObj = this._contextObj;
                posleft = position.x - ($(this.model.target).outerWidth() - (this.model.buttonMode == ej.ButtonMode.Split ? this.dropbutton.outerWidth() : this.element.outerWidth()));
                if (this.model.enableRTL)
                    position.x = (this.model.popupPosition=="left" || (posleft < $(this.model.target).outerWidth())) ? position.x : posleft;
                else
                    position.x = ((this.model.popupPosition == "left") || (position.x + $(this.model.target).outerWidth() < $(window).width())) ? position.x : posleft;
                if (this._posright < 0 && this.model.popupPosition == "left") position.x = $(window).outerWidth();
                 contextObj.option({
                    click: $.proxy(this._itemClick, this),
                    mouseover: $.proxy(this._itemMouseOver, this),
                    mouseout: $.proxy(this._itemMouseOut, this)
                 });
                 if (value)
                     contextObj.show(m, n, targetElement, e);
                else
                 contextObj.show(position.x, position.y, targetElement, e);
            }
        },

        _getXYpos: function (e) {
            var btnpos, btnposx, btnposy, posleft, posright, poscur = 1, postop;
            btnpos = this._getOffset(this.model.buttonMode == ej.ButtonMode.Split ? this.dropbutton : this.element);
            posleft = (this.model.popupPosition == "right" && ((!this.model.enableRTL) && (this.model.arrowPosition != ej.ArrowPosition.Left) && (this.model.arrowPosition != ej.ArrowPosition.Bottom) && (this.model.arrowPosition != ej.ArrowPosition.Top))) ? (this.model.buttonMode == ej.ButtonMode.Split?(btnpos.left + this.dropbutton.outerWidth()):(btnpos.left + this.element.outerWidth())) : ((this.model.popupPosition == "left" && (((this.model.enableRTL)||(this.model.arrowPosition != ej.ArrowPosition.Right)) && (this.model.arrowPosition != ej.ArrowPosition.Bottom) && (this.model.arrowPosition != ej.ArrowPosition.Top)))) ? (btnpos.left - ($(this.model.target).outerWidth())) : btnpos.left;
            this._posright = ($(window).width() - posleft) - ($(this.model.target).outerWidth());
            this._posleft = posleft - $(this.model.target).outerHeight();
            this._posrightht = ($(window).height() - btnpos.top - $(this.model.target).outerHeight());
            btnposx = ((this.model.popupPosition=="right" && (this._posright<0))||(posleft < 0))  ? (btnpos.left) : posleft;
            postop = ((this.model.arrowPosition == ej.ArrowPosition.Top) || (this.model.popupPosition == "up")) ? (btnpos.top - $(this.model.target).outerHeight() + 1) : (((this.model.arrowPosition != ej.ArrowPosition.Top) && (this.model.arrowPosition != ej.ArrowPosition.Bottom) && ((((this.model.arrowPosition == ej.ArrowPosition.Right) != (this.model.popupPosition == "left")) || ((this.model.arrowPosition == ej.ArrowPosition.Right) && this.model.enableRTL && (this.model.popupPosition == "left"))) && (((this.model.arrowPosition == ej.ArrowPosition.Left)) != (this.model.popupPosition == "right")) || ((this.model.arrowPosition == ej.ArrowPosition.Right) && this.model.enableRTL && (this.model.popupPosition == "left"))) && (((!this.model.enableRTL) && (this.model.popupPosition == "right")) || (this.model.popupPosition == "left")))  ? (btnpos.top) : ((this.model.buttonMode == ej.ButtonMode.Split ? (btnpos.top + this.dropbutton.outerHeight()) : (btnpos.top + this.element.outerHeight())) - poscur));//1px added to top due to element border-top as none
            btnposy =((this.model.popupPosition == "left") && this._posrightht < 0 && this._posright > 0 && this._posleft <0) ? (btnpos.top - ($(this.model.target).outerHeight())) : ((this.model.popupPosition == "left") && this._posrightht < 0 && this._posright > 0) ? (btnpos.top+this.element.outerHeight() - ($(this.model.target).outerHeight())) : ((this.model.popupPosition == "right"||this.model.popupPosition=="up"||this.model.popupPosition) && this._posrightht < 0 && this._posright < 0) ? (btnpos.top - ($(this.model.target).outerHeight())) : ((this.model.popupPosition == "right" || this.model.popupPosition == "left") && this._posrightht < 0) ? (btnpos.top + this.element.outerHeight() - ($(this.model.target).outerHeight())) : (this.model.popupPosition == "right" && this._posright < 0 && this._posrightht > 0) ? btnpos.top + this.element.outerHeight() :(this.model.popupPosition=="down"&&this._posrightht<0&&this._posright>0)?(btnpos.top-$(this.model.target).outerHeight()):((posleft < 0) || (this._posright < 0)) ? (btnpos.top + this.element.outerHeight()) : (postop < 0) ? (this.model.buttonMode == ej.ButtonMode.Split && this.model.popupPosition == "up" && this.model.arrowPosition != ej.ArrowPosition.Top) ? (btnpos.top + this.element.outerHeight() - poscur) : ((btnpos.top + (this.model.buttonMode == ej.ButtonMode.Split ? this.dropbutton.outerHeight() + this.element.outerHeight() : this.element.outerHeight()) - poscur)) : postop;
            return { x: btnposx, y: btnposy };
        },
        _getOffset: function (ele) {
            var pos = ele.offset();
            if ($("body").css("position") != "static") {
                var bodyPos = $("body").offset();
                pos.left -= bodyPos.left;
                pos.top -= bodyPos.top;
            }
            return pos;
        },


        _btnMouseDown: function (e) {
            if (!$(e.currentTarget).hasClass("e-disable")) {
                this._docrhtclk(e);
            }
        },
        _hidePopup: function (e) {
           this._contextObj && this._contextObj.hide(e);   
            this._hide();
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hidePopup);
        },
        _hide: function () {
            this.contstatus = false;
            this.wrapper.removeClass('e-active');
            this.element.off("click", $.proxy(this._hidecontext, this));
            ej.listenTouchEvent($(document), ej.startEvent(), this._documentClickHandler, true, this);
            this._off($(window), "resize", this._OnWindowResize);
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hide);
            this._closeEvent();
        },
        _closeEvent: function () {
            this._trigger("close");
        },

        _hidecontext: function (e) {
            if (($(e.target).is(this.element) || $(e.target).is(this.dropbutton) || $(e.target).is(this.textspan) || $(e.target).is(this.dropdownimg) || $(e.target).is(this.btnimgwrap) || !$(e.target).is(this.majorimgtag) || !$(e.target).is(this.minorimgtag)) && !$(e.target).is(this.splitwrap) && !$(e.target).parents().is($(this.model.target)) || (this.element.hasClass("e-txt") || $(e.target).is(this.imgtxtwrap))) {
                this._hidePopup(e);
            }
        },

        _documentClick: function (e) {
            if (!$(e.target).is(this.element) && !$(e.target).is(this.dropbutton) && !$(e.target).is(this.textspan) && !$(e.target).is(this.dropdownimg) && !$(e.target).is(this.btnimgwrap) && !$(e.target).is(this.majorimgtag) && !$(e.target).is(this.minorimgtag) && !$(e.target).is(this.splitwrap) && !$(e.target).parents().is($(this.model.target)) && (this.element.hasClass("e-txt") || !$(e.target).is(this.imgtxtwrap))) {
                this._hidePopup(e);
            }
        },

        _docrhtclk: function (e) {
            var isRightClick, targetElement;
            isRightClick = false;
            if (e.button) {
                isRightClick = (e.button == 2);
            } else if (e.which) {
                isRightClick = (e.which == 3); //for Opera
            }
            targetElement = e.target;
            if (isRightClick) {
                e.preventDefault();
            }
        },

    });

    ej.ContentType = { TextOnly: "textonly", ImageOnly: "imageonly", ImageBoth: "imageboth", TextAndImage: "textandimage", ImageTextImage: "imagetextimage" };

    ej.ImagePosition = { ImageRight: "imageright", ImageLeft: "imageleft", ImageTop: "imagetop", ImageBottom: "imagebottom" };

    ej.ButtonSize = { Mini: "mini", Small: "small", Medium: "medium", Large: "large" };

    ej.ButtonMode = { Split: "split", Dropdown: "dropdown" };

    ej.ArrowPosition = { Right: "right", Left: "left", Top: "top", Bottom: "bottom" };
})(jQuery, Syncfusion);