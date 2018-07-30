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

    ej.widget("ejToggleButton", "ej.ToggleButton", {

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["toggleState"],
        _setFirst: false,

        _rootCSS: "e-togglebutton",

        defaults: {

            size: "normal",

            type: "button",

            width: "",

            height: "",

            enabled: true,

            toggleState: false,

            defaultText: null,

            preventToggle: false,

            activeText: null,

            contentType: "textonly",

            htmlAttributes: {},

            imagePosition: "imageleft",

            showRoundedCorner: false,

            enablePersistence: false,

            cssClass: "",

            defaultPrefixIcon: null,

            defaultSuffixIcon: null,

            activePrefixIcon: null,

            activeSuffixIcon: null,

            enableRTL: false,

            create: null,

            click: null,

            change: null,

            destroy: null
        },


        dataTypes: {
            size: "string",
            type: "enum",
            enabled: "boolean",
            showRoundedCorner: "boolean",
            preventToggle: "boolean",
            defaultText: "string",
            activeText: "string",
            contentType: "enum",
            imagePosition: "enum",
            defaultPrefixIcon: "string",
            defaultSuffixIcon: "string",
            activePrefixIcon: "string",
            activeSuffixIcon: "string",
            cssClass: "string",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            htmlAttributes: "data"
        },
        observables: ["toggleState"],
        toggleState: ej.util.valueFunction("toggleState"),


        disable: function () {
            this.buttontag.addClass("e-disable").attr({ "aria-disabled": true });
            this.model.enabled = false;
        },

        enable: function () {
            if (this.buttontag.hasClass("e-disable")) {
                this.buttontag.removeClass("e-disable").attr({ "aria-disabled": false });
                this.model.enabled = true;
            }
        },


        _init: function () {
            this._cloneElement = this.element.clone();
            this._initialize();
            this._controlStatus(this.model.enabled);
            this._wireEvents();
            this.initialRender = false;
        },

        _destroy: function () {
            this._off(this.buttontag, "blur", this._tglebtnblur);
            this.element.unwrap();
            this.element.removeClass('e-chkbx-hidden e-tbtn');
            !this._cloneElement.attr("name") && this.element.attr("name") && this.element.removeAttr("name");
            this.labelFinder.empty();
            this.labelFinder.text(this.model.defaultText);
            this.buttontag.remove();
            this.element.unwrap();
            this.defaultLabel.insertAfter(this.element);
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "size":
                        this._setSize(options[option]);
                        break;
                    case "type":
                        this._settype(options[option]);
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
                    case "defaultText":
                        this._setDefaultText(options[option]);
                        break;
                    case "activeText":
                        this._setActiveText(options[option]);
                        break;
                    case "defaultPrefixIcon":
                        this._setDefaultMajorIcon(options[option]);
                        break;
                    case "defaultSuffixIcon":
                        this._setDefaultMinorIcon(options[option]);
                        break;
                    case "activePrefixIcon":
                        this._setActiveMajorIcon(options[option]);
                        break;
                    case "activeSuffixIcon":
                        this._setActiveMinorIcon(options[option]);
                        break;
                    case "enabled":
                        this._controlStatus(options[option]);
                        break;
                    case "toggleState":
                        this._tglevaluestatus(ej.util.getVal(options[option]));
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
                    case "htmlAttributes": this._addAttr(options[option]); break;
                }
            }
        },

        _setSize: function (val) {
            this.buttontag.removeClass('e-btn-mini e-btn-medium e-btn-small e-btn-large e-btn-normal');
            this.buttontag.addClass("e-btn-" + val);
        },

        _settype: function (val) {
            this.model.type = val;
        },


        _setHeight: function (val) {
            this.buttontag.css('height', val);
        },

        _setWidth: function (val) {
            this.buttontag.css('width', val);
        },

        _setDefaultText: function (val) {
            if (!this.toggleState()) {
                if (this.model.contentType == ej.ContentType.TextOnly) {
                    this.buttontag.html(val);
                } else {
                    this.defaulttxtspan.html(val);
                }
            }	
        },

        _setActiveText: function (val) {
            if (this.toggleState()) {
                if (this.model.contentType == ej.ContentType.TextOnly) {
                    this.buttontag.html(val);
                } else {
                    this.defaulttxtspan.html(val);
                }
            }
        },

        _setDefaultMajorIcon: function (val) {
            this.defMainIcon.removeClass(this.model.defaultPrefixIcon);
            this.defMainIcon.addClass(val);
        },

        _setDefaultMinorIcon: function (val) {
            this.defMiniIcon.removeClass(this.model.defaultSuffixIcon);
            this.defMiniIcon.addClass(val);
        },

        _setActiveMajorIcon: function (val) {
            if (this.toggleState()) {
                this.defMainIcon.removeClass(this.model.activePrefixIcon);
                this.defMainIcon.addClass(val);
            }
        },

        _setActiveMinorIcon: function (val) {
            if (this.toggleState()) {
                this.defMiniIcon.removeClass(this.model.activeSuffixIcon);
                this.defMiniIcon.addClass(val);
            }
        },

        _setContentType: function (val) {
            if (val != this.model.contentType) {
                this.buttontag.empty();
                this.model.contentType = val;
                this._renderButtonContent();
            }
        },

        _setImagePosition: function (val) {
            if ((this.model.contentType == ej.ContentType.TextAndImage) && (val != this.model.imagePosition)) {
                this.buttontag.empty();
                this.model.imagePosition = val;
                this._renderButtonContent();
            }
        },

        _setRTL: function (val) {
            if (val) {
                this.buttontag.addClass("e-rtl");
            } else {
                this.buttontag.removeClass("e-rtl");
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
                this.buttontag.removeClass(this.model.cssClass);
                this.buttontag.addClass(skin);
            }
        },

        _initialize: function () {
            if (this.element.is('[type = "checkbox"]')) {
                this._render();
            } else {
                this.element.removeClass("e-togglebutton");
            }
        },


        _render: function () {
			this.initialRender = true;
            var predecessor, labelSelector;
            /*Determine Button Type*/
            this.element.addClass('e-chkbx-hidden e-tbtn');
            if (!this.element.attr("name"))
                this.element.attr("name", this.element[0].id);
            /*Finding the label element in the dom*/
            predecessor = this.element.parents().last();
            labelSelector = "label[for='" + this.element[0].id + "']";
            this.labelFinder = predecessor.find(labelSelector);
            this.defaultLabel = predecessor.find(labelSelector).clone();
            if (!this.labelFinder.length) {
                this.labelFinder = ej.buildTag('label', "Button", {}, { "for": this.element[0].id });
                this.labelFinder.insertAfter(this.element);
            }
            if ((this.model.defaultText == null) || (this.model.defaultText == "")) {
                this.model.defaultText = this.labelFinder.text();
            }
            this.labelFinder.empty();
            this.wrapper = $('<span id="' + this.element[0].id + '-wrapper" class="e-tbtn-wrap e-widget"></span>');
            this.labelFinder.append(this.element);
            this.buttontag = ej.buildTag('button.e-togglebutton e-btn e-tbtn ' + this.model.cssClass + ' e-select', "", {}, { "role": "button", "tabindex": 0, "type": this.model.type, "data-role": "none" });
            if (!ej.isTouchDevice()) this.buttontag.addClass("e-ntouch");
            $(this.labelFinder).wrap(this.wrapper);
            this.buttontag.insertAfter(this.labelFinder);
            if (ej.util.isNullOrUndefined(this.model.activeText)) {
                this.model.activeText = this.model.defaultText;
            }
            if (ej.util.isNullOrUndefined(this.model.activePrefixIcon)) {
                this.model.activePrefixIcon = this.model.defaultPrefixIcon;
            }
            if (ej.util.isNullOrUndefined(this.model.activeSuffixIcon)) {
                this.model.activeSuffixIcon = this.model.defaultSuffixIcon;
            }
            this._setSize(this.model.size);
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
            this._setRTL(this.model.enableRTL);
            this._renderButtonContent();
            if (!this.toggleState() && !ej.isNullOrUndefined(this.element.attr('checked')))
                this.toggleState(true);
            this._tglevaluestatus(this.toggleState());
            this._roundedCorner(this.model.showRoundedCorner);
            this._addAttr(this.model.htmlAttributes);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "disabled" && value == "disabled") proxy.disable();
                else if (key == "checked" && value == "checked") proxy._tglevaluestatus(this.toggleState());
                else proxy.wrapper.attr(key, value);
            });
        },

        _renderButtonContent: function () {
            this.imgtxtwrap = ej.buildTag('span').addClass('e-btn-span');
            this.defaulttxtspan = ej.buildTag('span.e-btntxt' + '#' + this.element[0].id + 'textstatic',(this.toggleState() ? this.model.activeText : this.model.defaultText));
            if (this.model.contentType.indexOf("image") > -1) {
                this.defMainIcon = ej.buildTag('span ' + '#' + this.element[0].id + 'mainiconstatic');
                this.defMiniIcon = ej.buildTag('span ' + '#' + this.element[0].id + 'miniconstatic');
                (this.toggleState() ? this.defMainIcon.addClass(this.model.activePrefixIcon) : this.defMainIcon.addClass(this.model.defaultPrefixIcon));
                (this.toggleState() ? this.defMiniIcon.addClass(this.model.activeSuffixIcon) : this.defMiniIcon.addClass(this.model.defaultSuffixIcon))
            }
            if (this.model.contentType == ej.ContentType.TextAndImage) {
                switch (this.model.imagePosition) {
                    case ej.ImagePosition.ImageRight:
                        this.imgtxtwrap.append(this.defaulttxtspan, this.defMainIcon);
                        break;
                    case ej.ImagePosition.ImageLeft:
                        this.imgtxtwrap.append(this.defMainIcon, this.defaulttxtspan);
                        break;
                    case ej.ImagePosition.ImageBottom:
                        this.defMainIcon.attr("style", "display:inherit");
                        this.imgtxtwrap.append(this.defaulttxtspan, this.defMainIcon);
                        break;
                    case ej.ImagePosition.ImageTop:
                        this.defMainIcon.attr("style", "display:inherit");
                        this.imgtxtwrap.append(this.defMainIcon, this.defaulttxtspan);
                        break;
                }
                this.buttontag.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageTextImage) {
                this.imgtxtwrap.append(this.defMainIcon, this.defaulttxtspan, this.defMiniIcon);
                this.buttontag.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageOnly) {
                this.imgtxtwrap.append(this.defMainIcon);
                this.buttontag.append(this.imgtxtwrap);
            } else if (this.model.contentType == ej.ContentType.ImageBoth) {
                this.imgtxtwrap.append(this.defMainIcon, this.defMiniIcon);
                this.buttontag.append(this.imgtxtwrap);
            } else {
                this.buttontag.addClass("e-txt");
                this.buttontag.text(this.model.defaultText);
            }
        },

        _tglevaluestatus: function (value) {
            if (value) {
                this._toggleButtonStatus(value);
                this.element.attr("checked", "checked");
            } else {
                this._toggleButtonStatus(value);
                this.element.prop("checked",false);
            }
        },

        _roundedCorner: function (value) {
            value == true ? this.buttontag.addClass('e-corner') : this.buttontag.removeClass('e-corner');
        },


        _wireEvents: function () {
            this._on(this.buttontag, "click", this._tglebtnclicked);
            this._on(this.buttontag, "blur", this._tglebtnblur);
        },

        _tglebtnblur:function(e){
            this.buttontag.removeClass("e-animate");
        },

        _tglebtnclicked: function (e) {
            if (this.model.preventToggle && !this.model.enabled) return false;
            if (!this.model.preventToggle) {
                if (!this.buttontag.hasClass("e-disable")) {
                    this.toggleState(this.toggleState() ? false : true);
                    if (ej.browserInfo().name == "msie" && (ej.browserInfo().version == "8.0"))
                        this._tglevaluestatus(this.toggleState());
                    else
                        this._toggleButtonStatus(this.toggleState());
                    $(this.element).prop("checked", this.toggleState());
                    e.preventDefault();
                    this.buttontag.addClass("e-animate");
                    this._trigger("click", { "isChecked": this.toggleState(), status: this.model.enabled });
                }
            }
        },

        _toggleButtonStatus: function (buttonstatus) {
            if (buttonstatus) {
                if (this.model.contentType == ej.ContentType.TextOnly) {
                    this.buttontag.html(this.model.activeText);
                } else {
                    this.defaulttxtspan.html(this.model.activeText);
                    this.defMainIcon.removeClass(this.model.defaultPrefixIcon).addClass(this.model.activePrefixIcon);
                    this.defMiniIcon.removeClass(this.model.defaultSuffixIcon).addClass(this.model.activeSuffixIcon);
                }
                this.buttontag.addClass("e-active").attr("aria-pressed", true);
            } else {
                if (this.model.contentType == ej.ContentType.TextOnly) {
                    this.buttontag.html(this.model.defaultText);
                } else {
                    this.defaulttxtspan.html(this.model.defaultText);
                    this.defMainIcon.removeClass(this.model.activePrefixIcon).addClass(this.model.defaultPrefixIcon);
                    this.defMiniIcon.removeClass(this.model.activeSuffixIcon).addClass(this.model.defaultSuffixIcon);
                }
                this.buttontag.removeClass("e-active").attr("aria-pressed", false);
            }
            this.toggleState(buttonstatus);
            if(!this.initialRender)
            this._trigger('change', { "isChecked": this.toggleState() });
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
        /**  Creates button with button type as button */
        Button: "button",
        /**  Creates button with button type as reset */
        Reset: "reset",
        /**  Creates button with button type as submit */
        Submit: "submit"

    };
})(jQuery, Syncfusion);;