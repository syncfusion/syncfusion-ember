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

    ej.widget({ "ejmButton": "ej.mobile.Button", "ejmActionlink": "ej.mobile.Actionlink" },
        {
            _setFirst: true,
            _rootCSS: "e-m-btn",
            defaults: {
                touchStart: null,
                touchEnd: null,
                enabled: true,
                cssClass: "",
                renderMode: "auto",
                enableRippleEffect: ej.isAndroid() ? true : false,
                text: null,
                href: "",
                imageClass: null,
                imagePosition: "left",
                contentType: "text",
                enablePersistence: false,
                showBorder: true,
                style: "normal",
                color: {
                    "border": "",
                    "fill": "",
                    "text": ""
                },
                locale: 'en-US'
            },

            dataTypes: {
                enabled: "boolean",
                renderMode: "enum",
                imagePoisition: "enum",
                contentType: "enum",
                enablePersistence: "boolean",
                enableRippleEffect: "boolean"
            },

            _init: function () {
                this._getLocalizedLabels();
                this.model.text = !ej.isNullOrUndefined(this.model.text) ? this.model.text : this._localizedLabels["text"];
                this._renderControl();
                this._createDelegates();
                this._wireEvents();
            },

            _renderControl: function () {
                ej.setRenderMode(this);
                this._isLinkButton = this.element[0].nodeName == "A";
                if (this._isLinkButton && this.model.href)
                    this.element.attr("href", this.model.href);
                this.element.addClass("e-m-" + this.model.renderMode + " e-m-btn-" + this.model.style + " e-m-btn-image e-m-state-default e-m-user-select e-m-border" + (this._isLinkButton ? " e-m-actionlink " : " ") + this.model.cssClass);
                if (!this.element.attr("name") && this.element[0].id)
                    this.element.attr("name", this.element[0].id);
                this._setImagePosition();
                this.model.text = this.element.html() != "" ? this.element.html() : !ej.isNullOrUndefined(this.element.attr("value")) ? this.element.attr("value") : this.model.text;
                this._setText(this.model.text);
                if (this.model.style == "back")
                    this.element.addClass("e-m-icon-back");
                this._controlStatus(this.model.enabled);
                if (!this.model.showBorder)
                    this._setShowBorder(false);
                this._setColor();
                    this._setEnableRippleEffect();
            },
            _setEnableRippleEffect: function () {
                this.element[(this.model.enableRippleEffect ? "addClass" : "removeClass")]("e-ripple");
            },

            _getLocalizedLabels: function () {
                this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale);
            },

            _setColor: function () {
                this.element.css({ "color": this.model.color.text, "border-color": this.model.color.border, "background-color": this.model.color.fill });
            },

            _createDelegates: function () {
                this._touchStartHandler = $.proxy(this._touchStart, this);
                this._touchEndHandler = $.proxy(this._touchEnd, this);
                this._touchMoveHandler = $.proxy(this._touchMove, this);
            },

            _wireEvents: function (remove) {
                ej.listenTouchEvent(this.element, ej.startEvent(), this._touchStartHandler, remove);
            },

            _touchStart: function (evt) {
                this._target = evt.currentTarget;
                this.element.removeClass("e-m-state-default").addClass("e-m-state-active");
                if (this.model.touchStart)
                    this._trigger("touchStart", data = { text: this.model.text, currentEvent: evt });
                ej.listenEvents([window, this.element], [ej.moveEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler], false);
            },

            _touchMove: function (evt) {
                this.element.removeClass("e-m-state-active").addClass("e-m-state-default");
                ej.listenTouchEvent(window, ej.moveEvent(), this._touchMoveHandler, true);
            },

            _touchEnd: function (evt) {
                if (this._target == this.element[0]) {
                    this._target = [];
                    this.element.removeClass("e-m-state-active").addClass("e-m-state-default");
                    if (this.element.hasClass("e-m-btn-large"))
                        evt.preventDefault();
                    if (this.model.style == "back" && !this.model.touchEnd)
                        history.back();
                    else if (this.model.touchEnd)
                        this._trigger("touchEnd", data = { text: this.model.text, currentEvent: evt });
                }
            },

            _controlStatus: function (enabled) {
                this.element[enabled ? "removeClass" : "addClass"]("e-m-state-disabled");
                this._wireEvents(!enabled);
            },

            _setImagePosition: function () {
                if (this.model.imageClass && this.model.contentType != "text") {
                    this._imgClass = this.model.imageClass;
                    this.element.addClass("e-m-btn-image " + this.model.imageClass);
                    if (this.model.contentType == "both")
                        this.element.removeClass("e-m-image-left e-m-image-right").addClass("e-m-image-" + this.model.imagePosition);
                    if (this.model.contentType == "image") {
                        this.element.removeClass("e-m-image-" + this.model.imagePosition).addClass("e-m-btn-imageonly").attr("value", "").html("");
                        this.model.text = "";
                    }
                }
                if (this.model.contentType == "text")
                    this.element.removeClass(this.model.imageClass + " e-m-image-" + this.model.imagePosition);
            },

            _setLocale: function () {
                this._getLocalizedLabels();
                this.model.text = this._localizedLabels["text"];
                this._setText(this.model.text);
            },

            _setModel: function (options) {
                for (var prop in options) {
                    setprop = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                    if (this[setprop])
                        this[setprop](options[prop])
                }
            },

            _setRenderMode: function () {
                this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
            },

            _setStyle: function () {
                this.element.removeClass("e-m-btn-normal e-m-btn-back e-m-btn-header e-m-btn-large").addClass("e-m-btn-" + this.model.style + " " + (this.model.style == "back" ? "e-m-icon-back" : ""));
                this._setText(this.model.text);
            },
            _setShowBorder: function (border) {
                border ? this.element.removeClass("e-m-noborder").addClass("e-m-border") : this.element.addClass("e-m-noborder").removeClass("e-m-border");
            },

            _setEnabled: function () {
                this._controlStatus(this.model.enabled);
            },

            _setText: function () {
                this.element[0].nodeName == "INPUT" ? this.element.attr("value", this.model.text) : this.element.html(this.model.text);
            },

            _setContentType: function () {
                this._setImagePosition();
            },

            _setImageClass: function () {
                this.element.removeClass(this._imgClass);
                this._setImagePosition();
            },

            _clearElement: function () {
                this.element.removeAttr("class");
                this.element.addClass("e-m-btn");
            },

            _destroy: function () {
                this._wireEvents(true);
                this._clearElement();
            },

            /*---------------Public Methods---------------*/
            enable: function () {
                this.model.enabled = true;
                this._controlStatus(true);
            },

            disable: function () {
                this.model.enabled = false;
                this._controlStatus(false);
            }
        });


    ej.mobile.Button.ImagePosition = {
        Left: "left",
        Right: "right"
    };

    ej.mobile.Button.ContentType = {
        Text: "text",
        Image: "image",
        Both: "both"
    };

    ej.mobile.Button.Style = {
        Normal: "normal",
        Back: "back",
        Header: "header",
        Large: "large"
    };

    ej.mobile.Button.Locale = ej.mobile.Button.Locale || {};
    ej.mobile.Actionlink.Locale = ej.mobile.Actionlink.Locale || {};
    ej.mobile.Button.Locale["default"] = ej.mobile.Button.Locale["en-US"] = {
        text: "Button"
    };

    ej.mobile.Actionlink.Locale["default"] = ej.mobile.Actionlink.Locale["en-US"] = {
        text: "Actionlink"
    };
})(jQuery, Syncfusion);