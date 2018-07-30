/**
* @fileOverview Plugin to style the Waiting pop elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejWaitingPopup", "ej.WaitingPopup", {

        element: null,

        model: null,
        validTags: ["div", "span"],
        _setFirst: false,
        _rootCSS: "e-waitingpopup",


        defaults: {

            showOnInit: false,

            target: null,

            appendTo: null,

            showImage: true,

            htmlAttributes: {},

            cssClass: "",

            text: null,

            template: null,

            create: null,

            destroy: null
        },

        dataTypes: {
            showOnInit: "boolean",
            showImage: "boolean",
            cssClass: "string"
        },
		_isTargetVisible: function(){
			return this.element.css('display') != 'none';
		},
        show: function () {
			if(this._isTargetVisible()){
				this._refreshPanel();
				this.maindiv.css("display", "block");
				this.model.showOnInit = true;
			}
        },

        hide: function () {
			this.maindiv.css("display", "none");
			this.model.showOnInit = false;
        },

        refresh: function () {
            if(this._isTargetVisible())
				this._refreshPanel();
        },

        _setText: function (text) {
            if (text) {
                if (this.popupText) this.popupText.html(text);
                else {
                    this._generateTextTag(text);
                    this._setContentPosition();
                }
            }
            else if (this.popupText) {
                this.popupText.remove();
                this.popupText = null;
            }
        },

        _showImage: function (boolean) {
            if (boolean) {
                this.popupImage = ej.buildTag("span.e-image");
                if (this.popupText) this.popupImage.insertBefore(this.popupText);
                else this.maindiv.append(this.popupImage);
            }
            else if (this.popupImage) {
                this.popupImage.remove();
                this.popupImage = null;
            }
        },

        _setTemplate: function () {
            var template = this.model.template;
            if (typeof template === "string") template = $(template);
            if (typeof template === "object" && typeof template.css === "function")
                this.templateObj = template;
            else
                this.templateObj = ej.buildTag("div", "", { "text-align": "center" }).append(template);

            this.templateObj.css({ "visibility": "visible", "display": "block" });
            this.maindiv.append(this.templateObj);
        },

        _setTheme: function (skin) {
            this.maindiv.removeClass(this.model.cssClass).addClass(skin);
        },



        _init: function () {
			this._initialize();
			this._render();
			this._wireEvents();
        },

        _wireEvents: function () {
            $(window).on('resize', $.proxy(this._resizeHandler, this));
        },
        _unwireEvents: function () {
            $(window).off("resize", $.proxy(this._resizeHandler, this));
        },

        _resizeHandler: function () {
            this.refresh();
         },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "text": this._setText(options[option]); break;
                    case "cssClass": this._setTheme(options[option]); break;
                    case "htmlAttributes ": this._addAttr(options[option]); break;
                    case "showOnInit": this._setVisibility(options[option]); break;
                    case "showImage": this._showImage(options[option]); this._setContentPosition(); break;
                    case "target": this.model.target = options[option]; this._setTarget(); this.refresh(); break;
                    case "appendTo": this.model.appendTo = options[option]; this._setTarget();
                        if (!ej.isNullOrUndefined(this.model.appendTo) && this.model.appendTo != "document" && this.model.appendTo != "window")
                            this.maindiv.appendTo($(this.model.appendTo));
                        else
                            $('body').append(this.maindiv);
                        this.refresh(); break;
                    case "template":
                        this.maindiv.empty();
                        if (options[option]) {
                            this.model.template = options[option];
                            this._setTemplate();
                        }
                        else {
                            this.model.template = options[option] = null;
                            this._showImage(this.model.showImage);
                            if (this.model.text) this._generateTextTag(this.model.text);
                        }
                        this._setContentPosition();
                        break;
                }
            }
        },
        _setTarget: function () {
            if (this.model.target == "document") 
                this.targetElement = $(document);
            else if (this.model.target == "window")
                this.targetElement = $(window);
            else
                this.targetElement = this.model.target ? $(this.model.target) : this.element;
        },
        _destroy: function () {
            this.maindiv.remove();
			this._unwireEvents();
        },

        _initialize: function () {
            this.maindiv = null;
            this.popupText = null;
            this.popupImage = null;
            this.templateObj = null;
            this.targetElement = null;
        },


        _render: function () {
            this._setTarget();
            var oldWrapper = $("#" + this.element[0].id + "_WaitingPopup").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            this.maindiv = ej.buildTag("div.e-waitpopup-pane e-widget " + this.model.cssClass + "#" + this.element[0].id + "_WaitingPopup");
            if (this.model.template) {
                this._setTemplate();
            }
            else {
                this._showImage(this.model.showImage);
                if (this.model.text) {
                    this._generateTextTag(this.model.text);
                }
            }
            if (!ej.isNullOrUndefined(this.model.appendTo) && this.model.appendTo != "document" && this.model.appendTo != "window")
                this.maindiv.appendTo($(this.model.appendTo));
            else
                $('body').append(this.maindiv);
            this._setVisibility(this.model.showOnInit);
            this._addAttr(this.model.htmlAttributes);
        },

        _refreshPanel: function () {
            this.maindiv.width(this.targetElement.outerWidth());
            this.maindiv.height(this.targetElement.outerHeight());
            this._setPanelPosition();
            this._setContentPosition();
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.maindiv.addClass(value);
                else proxy.maindiv.attr(key, value)
            });
        },

        _setPanelPosition: function () {			 
            var location = ej.util.getOffset(this.targetElement);
			if(this.model.appendTo != null && $(this.model.appendTo).length >0) {				
				if ((this.targetElement.css("position") == "relative" || this.targetElement.css("position") == "absolute") && this.targetElement[0] === $(this.model.appendTo)[0] ) {					
					location = {left:0, top:0};														
				}
				else{
					location.left -= this.targetElement.offsetParent().offset().left;
					location.top -= this.targetElement.offsetParent().offset().top;
				}
			}
            this.maindiv.css({
                "position": "absolute",
                "left": Math.ceil(location.left) + "px",
                "top": Math.ceil(location.top) + "px",
                "z-index": this._maxZindex() + 1
            });
        },

        _setContentPosition: function () {
            if (this.model.template == null) {
                var textHeight = 0, imgHeight = 0, targetHeight, top = null;
                targetHeight = this.targetElement.outerHeight();
                if (this.popupText) textHeight = this.popupText.outerHeight();
                if (this.popupImage) imgHeight = this.popupImage.outerHeight();

                if (this.popupImage) {
                    top = Math.ceil((targetHeight - (imgHeight + textHeight)) / 2);
                    this.popupImage.css("top", top + "px");
                }
                if (this.popupText) {
                    if (!top) top = Math.ceil((targetHeight - textHeight) / 2);
                    this.popupText.css("top", top + "px");
                }
            }
            else {
                this.templateObj.css({
                    "position": "relative",
                    "left": Math.ceil((this.targetElement.outerWidth() - this.templateObj.outerWidth()) / 2),
                    "top": Math.ceil((this.targetElement.outerHeight() - this.templateObj.outerHeight()) / 2)
                });
            }
        },

        _generateTextTag: function (text) {
            this.popupText = ej.buildTag("div.e-text", text);
            this.maindiv.append(this.popupText);
        },

        _setVisibility: function (showOnInit) {
            if (showOnInit && this._isTargetVisible()) this.show();
            else this.hide();
        },

        _maxZindex: function () {
            return ej.util.getZindexPartial(this.element);
        }
    });
})(jQuery, Syncfusion);