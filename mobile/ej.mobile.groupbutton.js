/**
* @fileOverview Plugin to style the Html groupbutton elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej, undefined) {
    // ejmGroupButton is the plugin name 
    // "ej.mobile.GroupButton" is "namespace.className" will hold functions and properties

    ej.widget("ejmGroupButton", "ej.mobile.GroupButton", {
        _setFirst: true,
        _rootCSS: "e-m-grpbtn",
        _tags: [{
            tag: "items",
            attr: ["text", "type", "name", "imageClass", "imageUrl"]
        }],
        defaults: {
            selectedItemIndex: 0,
            renderMode: "auto",
            enablePersistence: false,
            cssClass: "",
            items: [],
            touchStart: null,
            touchEnd: null,
            select: null
        },
        dataTypes: {
            renderMode: "enum",
            enablePersistence: "boolean"
        },
        observables: ["selectedItemIndex"],
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),

        _init: function () {
            this._orgEle = this.element.clone();
            this._renderControl();
            this._createDelegates();
            this._wireEvents();
        },

        _renderControl: function () {
            ej.setRenderMode(this);
            var element = this.element;
            element.addClass("e-m-grpbtn e-m-" + this.model.renderMode + " " + this.model.cssClass);
            if (typeof this.model.items === "string") { this.model.items = eval(this.model.items) };
            var isAngular = this.model.items.length > 0 ? true : false;
            for (var i = 0, btnelement = element.children() ; i < (isAngular ? this.model.items.length : btnelement.length) ; i++) {
                if (isAngular)
                    var label = (!ej.isNullOrUndefined(this.model.items[i].type) || !ej.isNullOrUndefined(this.model.items[i].type)) ? ej.buildTag('label', ('<input ' + (ej.isNullOrUndefined(this.model.items[i].type) ? "" : 'type="' + this.model.items[i].type + '"') + (ej.isNullOrUndefined(this.model.items[i].name) ? "" : 'name="' + this.model.items[i].name + '"') + ' />' + this.model.items[i].text)) : ej.buildTag("button", this.model.items[i].text).appendTo(element);
                else
                    this.model.items.push(this._insertItem(btnelement[i]));
            }
            var proxy = this;
            $.each(element.children(), function (index, val) {
                var $img = $(this);
                imageClass = proxy.model.items[index].imageClass;
                imagePath = proxy.model.items[index].imageUrl;
                if (imageClass || imagePath) {
                    var image = ej.buildTag("div.grpimage " + imageClass).appendTo($img)
                    if (imagePath) {
                        image.css({ "background-image": "url('" + imagePath + "')" });
                        $img.text().trim() == "" && $img.addClass("e-m-imageonly");
                    }
                }
                $img.addClass("e-m-btn");
            });
            this._selectItem(this.selectedItemIndex());
        },
        _insertItem: function (element) {
            var item = {};
            for (var j = 0, attrLength = this._tags[0].attr.length; j < attrLength; j++) {
                var attr = this._tags[0].attr[j];
                item[attr] = ej.getAttrVal(element, 'data-ej-' + attr.toLowerCase(), undefined);
            }
            return item;
        },
        _createDelegates: function () {
            this._touchStartHandler = $.proxy(this._touchStartHandler, this);
            this._touchEndHandler = $.proxy(this._touchEndHandler, this);
            this._touchMoveHandler = $.proxy(this._onTouchMove, this);
        },

        _wireEvents: function (remove) {
            var selector = this.element.find(".e-m-btn");
            ej.listenEvents([selector], [ej.startEvent()], [this._touchStartHandler], remove);
        },

        _touchStartHandler: function (evt) {
            if (!$(this.element.children()[this.model.selectedItemIndex]).children().is(":checked")) $(this.element.children()[this.model.selectedItemIndex]).removeClass("e-m-active");
            this._prevItem = this.model.selectedItemIndex;
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            this._clickX = point.clientX;
            this._isMouseMove = false;
            this._target = evt.target;
            this.currentText = $(evt.target).text();
            this.data = { text: this.currentText.trim() };
            ej.listenEvents([this._target, this._target], [ej.endEvent(), ej.moveEvent()], [this._touchEndHandler, this._touchMoveHandler], false);
            if (this.model.touchStart) this._trigger("touchStart", this.data);
        },
        _onTouchMove: function (evt) {
            var point = evt.touches ? (evt.touches[0] ? evt.touches[0] : (evt.changedTouches ? evt.changedTouches[0] : evt)) : evt;
            if (this._clickX != point.clientX) this._isMouseMove = true;
        },

        _touchEndHandler: function (evt) {
            ej.listenEvents([$(evt.currentTarget), $(evt.currentTarget)], [ej.moveEvent(), ej.endEvent()], [this._touchMoveHandler, this._touchEndHandler], true);
            if (evt.target === this._target && !this._isMouseMove) {
                var element = this.element;
                $(evt.target).addClass('e-m-active');
                var parent = $(evt.currentTarget);
                this.model.selectedItemIndex = parent.index();
                if ((parent.find('input').length == 0) || (parent.find("input[type='groupbutton']").length == 0)) {
                    if (element.children().find("input").attr("type") != "checkbox") element.find('.e-m-active').removeClass('e-m-active').find("input[type='radio']").attr("checked", false);
                    parent.addClass('e-m-active').find("input[type='radio']").prop("checked", true);
                }
                else
                    parent.find("input").is(":checked") ? parent.removeClass('e-m-active') : parent.addClass('e-m-active');

                if (element.children().find("input").attr("type") == "checkbox") {
                    if ($(element.children()[this._prevItem]).children().is(":checked")) $(element.children()[this._prevItem]).addClass("e-m-active");
                    if ($(element.children()[this.model.selectedItemIndex]).children().is(":checked")) $(element.children()[this.model.selectedItemIndex]).removeClass("e-m-active");

                }
                this.selectedItemIndex($(evt.currentTarget).index());
                if (this.model.touchEnd) this._trigger("touchEnd", this.data);
            }
            this.data = { text: this.currentText.trim() };
            if (this.model.select) this._trigger("select", this.data);
        },

        _selectItem: function (index) {
            var element = this.element;
            if (index >= 0) {
                this.selectedItemIndex(index);
                var select = $(element.find("input")[this.selectedItemIndex()]);
                if (element.find(".e-m-active").children().attr("type") == "checkbox") {
                    if ($(element.children().find("input")[index]).is(":checked")) {
                        $(element.children()[index]).removeClass("e-m-active");
                        select.prop("checked", false);
                    }
                    else {
                        $(element.children()[index]).addClass("e-m-active");
                        select.prop("checked", true);
                    }
                } else {
                    element.find('.e-m-active').removeClass("e-m-active");
                    $(element.find('.e-m-btn')[this.selectedItemIndex()]).addClass("e-m-active");
                    select.prop("checked", true);
                }
                this.currentText = $(element.find('.e-m-btn')[this.selectedItemIndex()]).text();
                this.data = { text: this.currentText.trim() };
                if (this.model.select) this._trigger("select", this.data);
            }
        },

        _setModel: function (options) {
            var refresh = false;
            for (var prop in options) {
                var setModel = "_set" + prop.charAt(0).toUpperCase() + prop.slice(1);
                var tempProp = (typeof (options[prop]) == "function") ? this[prop]() : options[prop];
                if (this[setModel]) this[setModel](tempProp);
                else
                    refresh = true;
            }
            if (refresh) this._refresh();
        },

        _setRenderMode: function () {
            this.element.removeClass("e-m-ios7 e-m-android e-m-windows e-m-flat").addClass("e-m-" + this.model.renderMode + "");
        },

        _setSelectedItemIndex: function (index) {
            this._selectItem(index);
        },

        _refresh: function () {
            this._destroy();
            this.element.addClass("ejm-groupbutton");
            this._renderControl();
            this._wireEvents(false);
        },

        _clearElement: function () {
            this.element.removeAttr("class")
            this.element.html(this._orgEle.html());
        },

        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        }

    });

})(jQuery, Syncfusion);