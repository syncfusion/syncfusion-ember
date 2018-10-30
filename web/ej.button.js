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

    ej.widget("ejButton", "ej.Button", {

        element: null,

        model: null,
        validTags: ["button", "input"],
        _setFirst: false,

        _rootCSS: "e-button",
        _requiresID: true,

        defaults: {

            size: "normal",

            type: "submit",

            height: "",

            width: "",

            enabled: true,

            htmlAttributes: {},

            text: null,

            contentType: "textonly",

            imagePosition: "imageleft",

            showRoundedCorner: false,

            cssClass: "",

            prefixIcon: null,

            suffixIcon: null,

            enableRTL: false,

            repeatButton: false,

            timeInterval: "150",

            create: null,

            click: null,

            destroy: null
        },


        dataTypes: {
            size: "enum",
            enabled: "boolean",
            type: "enum",
            showRoundedCorner: "boolean",
            text: "string",
            contentType: "enum",
            imagePosition: "enum",
            prefixIcon: "string",
            suffixIcon: "string",
            cssClass: "string",
            repeatButton: "boolean",
            enableRTL: "boolean",
            timeInterval: "string",
            htmlAttributes: "data"
        },

        disable: function () {
            this.element.addClass("e-disable").attr("aria-disabled", true);
            this.model.enabled = false;
        },

        enable: function () {
            this.element.removeClass("e-disable").attr("aria-disabled", false);
            this.model.enabled = true;
        },

        _init: function () {
            this._cloneElement = this.element.clone();
            this._initialize();
            this._render();
            this._controlStatus(this.model.enabled);
            this._wireEvents(this.model.repeatButton);
            this._addAttr(this.model.htmlAttributes);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.element.addClass(value);
                else proxy.element.attr(key, value);
                if (key == "disabled" && value == "disabled") proxy.disable();
            });
        },

        _destroy: function () {
            this._off(this.element, "blur", this._btnBlur);
            this.element.removeClass(this.model.cssClass + "e-ntouch e-btn e-txt e-select e-disable e-corner e-widget").removeAttr("role aria-describedby aria-disabled");
            !this._cloneElement.attr("type") && this.element.attr("type") && this.element.removeAttr("type");			
            this.element.removeClass("e-btn-" + this.model.size);
            this.model.contentType && this.model.contentType != "textonly" ? this.element.append(this._cloneElement.text()) && this.imgtxtwrap[0].remove() : "";
            
        },


        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "size":
                        this._setSize(options[option]);
                        break;
                    case "height":
                        this._setHeight(options[option]);
                        break;
                    case "width":
                        this._setWidth(options[option]);
                        break;
                    case "contentType":
                        this._setContentType(options[option]);
                        break;
                    case "imagePosition":
                        this._setImagePosition(options[option]);
                        break;
                    case "text":
                        this._setText(options[option]);
                        break;
                    case "prefixIcon":
                        if (!this.element.is("input"))
                        this._setMajorIcon(options[option]);
                        break;
                    case "suffixIcon":
                        if (!this.element.is("input"))
                        this._setMinorIcon(options[option]);
                        break;
                    case "enabled":
                        this._controlStatus(options[option]);
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
                    case "timeInterval":
                        this.model.timeInterval = options[option];
                        break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }
        },


        _setSize: function (val) {
            this.element.removeClass('e-btn-mini e-btn-medium e-btn-small e-btn-large e-btn-normal');
            this.element.addClass("e-btn-" + val);
        },
        _setType: function (val) {
            this.element.prop({ "type": val });
        },

        _setHeight: function (val) {
            this.element.css('height', val);
        },

        _setWidth: function (val) {
            this.element.css('width', val);
        },

        _setText: function (val) {
            if (this.buttonType == "inputButton") {
                this.element.val(val);
            } else {
                if (this.model.contentType == ej.ContentType.TextOnly) {
                    this.element.html(val);
                } else {
                    this.textspan.html(val);
                }
            }
            this.model.text = val;
        },

        _setMajorIcon: function (val) {
            this.majorimgtag.removeClass(this.model.prefixIcon);
            this.majorimgtag.addClass(val);
            this.model.prefixIcon = val;
        },

        _setMinorIcon: function (val) {
            this.minorimgtag.removeClass(this.model.suffixIcon);
            this.minorimgtag.addClass(val);
            this.model.suffixIcon = val;
        },

        _setContentType: function (val) {
            if (val != this.model.contentType) {
                this.element.empty();
                this.model.contentType = val;
                if (!this.element.is("input"))
                this._renderButtonNormal();
            }
        },

        _setImagePosition: function (val) {
            if ((this.model.contentType == ej.ContentType.TextAndImage) && (val != this.model.imagePosition)) {
                this.element.empty();
                this.model.imagePosition = val;
                if (!this.element.is("input"))
                this._renderButtonNormal();
            }
        },

        _setRTL: function (val) {
            if (val) {
                this.element.addClass("e-rtl");
            } else {
                this.element.removeClass("e-rtl");
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
            if (this.model.cssClass != skin) {
                this.element.removeClass(this.model.cssClass);
                this.element.addClass(skin);
            }
        },

        _initialize: function () {
            if(!ej.isTouchDevice()) this.element.addClass("e-ntouch");
            if (this.element.is("input")) {
                this.buttonType = "inputButton";
            }
            else if ((this.element.is("a")) || (this.element.is("button"))) {
                this.buttonType = "tagButton";
            }
            else {
                this.element.removeClass("e-button");
            }
            if (this.element.attr("type")) {
                this.model.type = this.element.attr("type");
            }
            else
                this._setType(this.model.type);
            this._timeout = null;
        },


        _render: function () {
            this._setSize(this.model.size);
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
            this._setRTL(this.model.enableRTL);
            this.element.addClass(this.model.cssClass + " e-btn e-select e-widget").attr("role", "button");
            if (this.buttonType == "inputButton") {
                this.element.addClass("e-txt");
                if ((this.model.text != null) && (this.model.text != "")) {
                    this.element.val(this.model.text);
                } else {
                    this.model.text = this.element.val();
                }
            } else { this._renderButtonNormal(); }
            this._roundedCorner(this.model.showRoundedCorner);
            if (this.element[0].id)
                this.element.attr("aria-describedby", this.element[0].id);
        },

        _renderButtonNormal: function () {
            if ((this.model.text == null) || (this.model.text == "")) {
                this.model.text = this.element.html();
            }
            this.element.empty();
            /*Image and Text*/
            this.textspan = ej.buildTag('span.e-btntxt', this.model.text);
            if (this.model.contentType.indexOf("image") > -1) {
                this.majorimgtag = ej.buildTag('span').addClass(this.model.prefixIcon);
                this.minorimgtag = ej.buildTag('span').addClass(this.model.suffixIcon);
                this.imgtxtwrap = ej.buildTag('span').addClass('e-btn-span');
            }

            if (this.model.contentType == ej.ContentType.TextAndImage) {
                switch (this.model.imagePosition) {
                    case ej.ImagePosition.ImageRight:
                        this.imgtxtwrap.append(this.textspan, this.majorimgtag);
                        break;
                    case ej.ImagePosition.ImageLeft:
                        this.imgtxtwrap.append(this.majorimgtag, this.textspan);
                        break;
                    case ej.ImagePosition.ImageBottom:
                        this.majorimgtag.attr("style", "display:inherit");
                        this.imgtxtwrap.append(this.textspan, this.majorimgtag);
                        break;
                    case ej.ImagePosition.ImageTop:
                        this.majorimgtag.attr("style", "display:inherit");
                        this.imgtxtwrap.append(this.majorimgtag, this.textspan);
                        break;
                }
                this.element.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageTextImage) {
                this.imgtxtwrap.append(this.majorimgtag, this.textspan, this.minorimgtag);
                this.element.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageBoth) {
                this.imgtxtwrap.append(this.majorimgtag, this.minorimgtag);
                this.element.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageOnly) {
                this.imgtxtwrap.append(this.majorimgtag);
                this.element.append(this.imgtxtwrap);
            } else {
                this.element.addClass("e-txt");
                this.element.html(this.model.text);
            }
        },

        _roundedCorner: function (value) {
            value == true ? this.element.addClass('e-corner') : this.element.removeClass('e-corner');
        },

        _wireEvents: function (val) {
            if (val) {
                this._on(this.element, "mousedown", this._btnRepatMouseClickEvent);
                this._on($(document), 'mouseup', this._mouseUpClick);
                this._on(this.element, "keyup", this._btnRepatKeyUpEvent);
                this._on($(document), "keypress", this._btnRepatKeyDownEvent);

            }
            this._on(this.element, "click", this._btnMouseClickEvent);
            this._on(this.element, "blur", this._btnBlur);
        },

        _btnBlur:function(e){
            this.element.removeClass("e-animate");
        },

        _btnMouseClickEvent: function (e) {
            var self = this;
            this.element.addClass("e-animate");
            if(!self.model.enabled) return false;
            if (!self.element.hasClass("e-disable")) {
                // here aregument 'e' used in serverside events 
                var args = { target: e.currentTarget, e : e , status:self.model.enabled};
				//Trigger _click function to apply scope changes
                self._trigger("_click", args);
                self._trigger("click", args);
            } 
        },

        _btnRepatMouseClickEvent: function (e) {
            var self = this;
            if(!self.model.enabled) return false;
            if (!self.element.hasClass("e-disable")) {
                var args = { status: self.model.enabled };
                if ((e.button == 0) || (e.which == 1)) {

                    self._timeout = setInterval(function () { self._trigger("click", { target: e.currentTarget, status: self.model.enabled }); }, this.model.timeInterval);
                }
            }
        },

        _mouseUpClick: function (event) {
            clearTimeout(this._timeout);
        },

        _btnRepatKeyDownEvent: function (e) {
            var self = this;
            if (!self.element.hasClass("e-disable")) {
                var args = { status: self.model.enabled };
                if ((e.keyCode == 32) || (e.keyCode == 13)) {
                    self._trigger("click", args);
                }
            }
        },

        _btnRepatKeyUpEvent: function (e) {
            if ((e.keyCode == 32) || (e.keyCode == 13)) {
                clearTimeout(this._timeout);
            }
        },
    });


    ej.ContentType = {
		/**  Supports only for text content only */
		TextOnly: "textonly", 
		/** Supports only for image content only */
		ImageOnly: "imageonly", 
		/** Supports image for both ends of the button */
		ImageBoth: "imageboth", 
		/** Supports image with the text content */
		TextAndImage: "textandimage", 
		/** Supports image with both ends of the text */
        ImageTextImage: "imagetextimage"
    };


    ej.ImagePosition = {
		/**  support for aligning text in left and image in right. */
		ImageRight: "imageright", 
		/**  support for aligning text in right and image in left. */
		ImageLeft: "imageleft",
		/**  support for aligning text in bottom and image in top. */
		ImageTop: "imagetop", 
		/**  support for aligning text in top and image in bottom. */
		ImageBottom: "imagebottom"
    };

    ej.ButtonSize = {
		/**  Creates button with inbuilt default size height, width specified */
		Normal : "normal",
		/**  Creates button with inbuilt mini size height, width specified */
		Mini: "mini", 
		/**  Creates button with inbuilt small size height, width specified */
		Small: "small",
		/**  Creates button with inbuilt medium size height, width specified */
		Medium:"medium", 
		/**  Creates button with inbuilt large size height, width specified */
        Large: "large"
    };

    ej.ButtonType = {
		/**  Creates button with inbuilt button type specified */
		Button : "button",
		/**  Creates button with inbuilt reset type specified */
		Reset: "reset", 
		/**  Creates button with inbuilt submit type specified */
		Submit: "submit"
    };
})(jQuery, Syncfusion);
