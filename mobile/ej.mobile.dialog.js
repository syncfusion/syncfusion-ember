/**
* @fileOverview Plugin to style the Html Dialog elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejmDialog", "ej.mobile.Dialog", {
        _setFirst: true,
        _rootCSS: "e-m-dialog",
        defaults: {
            renderMode: "auto",
            mode: "alert",
            enableAutoOpen: false,
            title: null,
            closeOndocumentTap: false,
            cssClass: "",
            enableModal: true,
            showButtons: true,
            showHeader: true,
            leftButtonCaption: null,
            rightButtonCaption: null,
            allowScrolling: false,
            enableNativeScrolling: (ej.isAndroid() || ej.isIOS()) ? false : ej.isDevice() ? true : false,
            templateId: null,
            height: null,
            width: null,
            enablePersistence: false,
            enableAnimation: true,
            locale: "en-US",
            open: null,
            close: null,
            beforeClose: null,
            buttonTap: null
        },
        dataTypes: {
            renderMode: "enum",
            mode: "enum",
            enableAutoOpen: "boolean",
            title: "string",
            cssClass: "string",
            enableModal: "boolean",
            showButtons: "boolean",
            showHeader: "boolean",
            leftButtonCaption: "string",
            rightButtonCaption: "string",
            allowScrolling: "boolean",
            templateId: "string",
            height: "string" || "number",
            width: "string" || "number",
            locale: "string",
            enablePersistence: "boolean",
            enableAnimation: "boolean",
        },
        _init: function () {
            ej.setRenderMode(this);
            this._orgEle = this.element.clone();
            this._getLocalizedLabels();
            this.model.title = !ej.isNullOrUndefined(this.model.title) ? this.model.title : this._localizedLabels["title"];
            this.model.leftButtonCaption = !ej.isNullOrUndefined(this.model.leftButtonCaption) ? this.model.leftButtonCaption : this._localizedLabels["leftButtonCaption"];
            this.model.rightButtonCaption = !ej.isNullOrUndefined(this.model.rightButtonCaption) ? this.model.rightButtonCaption : this._localizedLabels["rightButtonCaption"];
            this._renderControl();
            this._createDelegates();
            this._wireEvents();
            if (this.model.enableAutoOpen)
                this.open();
        },
        _getLocalizedLabels: function () {
            this._localizedLabels = ej.getLocalizedConstants(this.sfType, this.model.locale)
        },
        _renderControl: function () {
            this.element.addClass("e-m-" + this.model.renderMode + " e-m-dialog e-m-user-select " + this.model.cssClass + " " + "e-m-" + this.model.mode);
            if (this.model.enableAnimation) this.element.addClass("e-m-dlg-animate");
            if (!ej.isNullOrUndefined(this.model.templateId)) this._setTemplate();
            else this._html = this.element.html();
            this.element.empty();
            this._renderDialog();
            this._dialogInit();
            this.element.addClass("e-m-" + (this.model.enableAutoOpen ? "show" : "hide"));
            if (this.model.enableModal) this._setModal();
        },
        _setTemplate: function () {
            if (ej.getCurrentPage().find("#" + this.model.templateId).length) {
                var templateContent = ej.getCurrentPage().find("#" + this.model.templateId);
                this._html = templateContent[0].nodeName.toLowerCase() == "script" ? ej.getClearString(templateContent[0].innerHTML) : templateContent;
            }
            ej.destroyWidgets(this._html);
        },
        _renderButton: function () {
            this._leftbtn = ej.buildTag("button").addClass("e-m-" + this.model.mode + "btn e-m-dlg-btn e-m-dlg-alertbtn e-m-state-default").html(this.model.leftButtonCaption);
            this._dlgbtnwrapper = ej.buildTag("div.e-m-dlgbtnwrapper");
            this._innerDiv.append(this._dlgbtnwrapper);
            if (this.model.mode == "alert") this._dlgbtnwrapper.append(this._leftbtn);
            else if (this.model.mode == "confirm") {
                this._leftBtn = this._leftbtn.removeClass("e-m-" + this.model.mode + "btn").addClass("e-m-dlg-btn e-m-dlg-leftbtn").html(this.model.leftButtonCaption);
                this._rightBtn = ej.buildTag("button").addClass("e-m-dlg-btn e-m-dlg-rightbtn e-m-state-default").html(this.model.rightButtonCaption);
                this._dlgbtnwrapper.append(this._leftBtn).append(this._rightBtn);
            }
        },
        _renderDialog: function () {
            var height = !ej.isNullOrUndefined(this.model.height) && parseInt(this.model.height) ? this.model.height : "";
            var width = !ej.isNullOrUndefined(this.model.width) && parseInt(this.model.width) ? this.model.width : "";
            this.element.addClass("e-m-dialog e-m-abs");
            this._innerDiv = ej.buildTag("div", "", { "width": width }, { "class": "e-m-dlg-container e-m-abs " });
            this.element.append(this._innerDiv);
            this._contentContainer = ej.buildTag("div", this._html, { "height": height }, { "class": "e-m-dlg-content e-m-rel" });
            if (this.model.allowScrolling) this._contentContainer.attr({ "data-role": "ejmscrollpanel", "data-ej-showscrollbars": true, "data-ej-enablenativescrolling": this.model.enableNativeScrolling, "data-ej-isrelative": true })
            this._innerDiv.append(this._contentContainer);
            if (!(this.model.mode == "custom")) {
                ej.buildTag("div", this.model.title, {}, { "class": "e-m-dlg-hdr " + (!this.model.showHeader ? "e-m-hide" : "") }).insertBefore(this._contentContainer);
                this._header = this._innerDiv.find(".e-m-dlg-hdr");
                if (this.model.showButtons) this._renderButton();
            }
        },
        _dialogInit: function () {
            var target = this.element.parents("form").length > 0 ? this.element.parents("form") : ej.getCurrentPage();
            this.element.appendTo(target);
            ej.widget.init(this._innerDiv);
            if ((!ej.isAppNullOrUndefined()) && ej.angular.defaultAppName)
                ej.angular.compile(this._innerDiv);
        },
        _setModal: function () {
            var dialogZIndex = this.element.css("zIndex");
            this._overlay = ej.buildTag("div#" + ".e-m-overlay e-m-abs", "", { "zIndex": dialogZIndex - 1 });
            this.element.append(this._overlay);
        },
        _setTemplateId: function () {
            if (ej.getCurrentPage().find("#" + this.model.templateId).length) {
                this._setTemplate()
                this._contentContainer.empty().html(this._html);
                this._dialogInit()
            }
        },
        _setCloseOndocumentTap: function () {
            if (this.model.closeOndocumentTap) this._documentClickHandler = $.proxy(this._docClick, this);
            ej.listenEvents([$(document)], [ej.endEvent()], [this._documentClickHandler], !this.model.closeOndocumentTap);
        },
        _setLocale: function (option) {
            this._getLocalizedLabels();
            this.model.title = this._localizedLabels["title"];
            this.model.leftButtonCaption = this._localizedLabels["leftButtonCaption"];
            this.model.rightButtonCaption = this._localizedLabels["rightButtonCaption"];
            this._setTitle();
            this._setLeftButtonCaption();
            this._setRightButtonCaption();
        },
        _createDelegates: function () {
            this._touchEndHandler = $.proxy(this._buttonTap, this);
            this._touchStartHandler = $.proxy(this._touchStart, this);
            if (this.model.closeOndocumentTap) this._documentClickHandler = $.proxy(this._docClick, this);
        },
        _wireEvents: function (remove) {
            var evt = "onorientationchange" in window ? "orientationchange" : "resize";
            ej.listenEvents([window, this.element.find(".e-m-dlg-btn"), this.element.find(".e-m-dlg-btn"), $(document)], [evt, ej.startEvent(), ej.endEvent(), ej.endEvent()], [this._resizeHandler, this._touchStartHandler, this._touchEndHandler, this._documentClickHandler], remove);
        },
        _docClick: function (e) {
            if (($(e.target).hasClass("e-m-overlay") || $(e.target).hasClass("e-m-dialog")) && this.element.hasClass("e-m-show"))
                this.close();
        },
        _buttonTap: function (evt) {
            $(evt.target).removeClass("e-m-state-active").addClass("e-m-state-default");
            if (this.model.buttonTap) this._trigger("buttonTap", { text: $(evt.target).text(), title: this.model.title, currentEvent: evt });
        },
        _touchStart: function (evt) {
            $(evt.target).removeClass("e-m-state-default").addClass("e-m-state-active");
        },
        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                if (this[setModel])
                    this[setModel]();
                else
                    refresh = true;
            }
            if (refresh)
                this._refresh();
        },
        _setRenderMode: function () {
            this.element.removeClass("e-m-android e-m-ios7 e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode);
        },

        _setMode: function () {
            this._refresh();
        },

        _setTitle: function () {
            if (this._header.length) this._header.html(this.model.title);
        },

        _setLeftButtonCaption: function () {
            this.element.find(".e-m-dlg-btn.e-m-dlg-" + (this.model.mode == "confirm" ? "leftbtn" : "alertbtn")).html(this.model.leftButtonCaption);
        },

        _setRightButtonCaption: function () {
            this.element.find(".e-m-dlg-btn.e-m-dlg-rightbtn").html(this.model.rightButtonCaption);
        },

        _setEnableModal: function () {
            if (this.model.enableModal)
                this.element.find(".e-m-overlay").length ? "" : this._setModal()
            else
                this.element.find(".e-m-overlay").remove();
        },

        _setShowButtons: function () {
            this._refresh();
        },

        _setShowHeader: function () {
            this.model.showHeader ? this._header.removeClass("e-m-hide") : this._header.addClass("e-m-hide")
        },

        /*** Instead of re-rendering dialog control, empty method triggerred ***/
        _setButtonTap: function () {
        },

        _setBeforeClose: function () {
        },

        _setClose: function () {
        },

        _setOpen: function () {
        },

        _destroy: function () {
            this._wireEvents(true);
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },

        _refresh: function () {
            this._destroy();
            this._renderControl();
            this._wireEvents(false);
        },

        _animate: function (add, remove) {
            var proxy = this;
            this._innerDiv.removeClass(add + " " + remove);
            this._innerDiv.addClass(add);
            if (add == "e-m-dlg-hideanimate") {
                delay = this.model.renderMode == "android" ? 250 : this.model.renderMode == "windows" ? 200 : 0;
                setTimeout(function () {
                    proxy.element.addClass("e-m-hide");
                }, delay);
            }
        },
        open: function () {
            if (this.model.allowScrolling) this._contentContainer.ejmScrollPanel("scrollTo", 0, 0);
            this.element.addClass("e-m-show").removeClass("e-m-hide");
            if (this.model.enableAnimation)
                this._animate("e-m-dlg-showanimate", "e-m-dlg-hideanimate");
            if (this.model.open)
                this._trigger("open", { "title": this.model.title });
        },
        close: function () {
            var data = { "title": this.model.title };
            if (this.model.beforeClose)
                this._trigger("beforeClose", data);
            if (this.model.enableAnimation)
                this._animate("e-m-dlg-hideanimate", "e-m-dlg-showanimate");
            else
                this.element.addClass("e-m-hide");
            this.element.removeClass("e-m-show");
            if (this.model.close)
                this._trigger("close", data);
        },

        disableButton: function (args) {
            ej.isNullOrUndefined(args) ? this.element.find(".e-m-dlg-btn").addClass("e-m-state-disabled") : this.element.find(".e-m-dlg-btn.e-m-" + args + "btn").addClass("e-m-state-disabled")
        },

        enableButton: function (args) {
            ej.isNullOrUndefined(args) ? this.element.find(".e-m-dlg-btn").removeClass("e-m-state-disabled") : this.element.find(".e-m-dlg-btn.e-m-" + args + "btn").removeClass("e-m-state-disabled")
        }
    });

    ej.mobile.Dialog.Mode = {
        Alert: "alert",
        Confirm: "confirm",
        Custom: "custom"
    };
    ej.mobile.Dialog.Locale = ej.mobile.Dialog.Locale || {};
    ej.mobile.Dialog.Locale["default"] = ej.mobile.Dialog.Locale["en-US"] = {
        title: "Title",
        leftButtonCaption: "Cancel",
        rightButtonCaption: "Continue"
    };
})(jQuery, Syncfusion);;