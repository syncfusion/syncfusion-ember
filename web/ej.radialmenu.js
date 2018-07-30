/**
* @fileOverview Plugin to style the Html Radial Menu elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRadialMenu", "ej.RadialMenu", {
        _rootCSS: "e-radialmenu",
        element: null,
        model: null,
         validTags: ["div"],
        _setFirst: true,
        defaults: {
            imageClass: "e-radialimage",
            backImageClass: "e-backimage",
            targetElementId: null,
            click: null,
            //Deprecated property
            select: null,
            autoOpen: false,
            position: {
                x: null,
                y: null
            }
        },
        dataTypes: {
            autoOpen: "boolean"
        },
        _init: function () {
            this._id = this.element[0].id;
            if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)) {
                this._initialization();
                this._prefix = "e-";
                this._renderRadial();
                this._wireEvents();
            }
        },
        _renderRadial: function () {
            this._radial = ej.buildTag("div.e-radial e-abs " + this.model.imageClass + "").css({ "left": this._startXY - 22 + "px", "top": this._startXY - 22 + "px" });
            this._radialContainer = ej.buildTag("div.e-rel").css({ "height": this._diameter, "width": this._diameter });
            this.element.append(this._radialContainer.append(this._radial)).addClass("e-radialmenu e-overlow e-user-select e-abs");
            this._radialInitialPosition();
            this._renderRadialMenu();
            var childArc = this._childArcGroup.children(),
                polygonGroup = this._polygonGroup.children();
            this._on(childArc, "mouseenter", this._arcOverHandler);
            this._on(childArc, "mouseleave", this._arcOverHandler);
            this._on(polygonGroup, "mouseenter", this._arcOverHandler);
            this._on(polygonGroup, "mouseleave", this._arcOverHandler);
            this._itemsEvents(this._menuItemsGroup.children(), this._menuItemsPaths.children(), this._menuItemsArcGroup.children());
        },
        _wireEvents: function () {
            var doc = $(document);
            this._radialClick = $.proxy(this._showMenu, this);
            this._targetDown = $.proxy(this._targetDownHandler, this);
            this._targetClick = $.proxy(this._targetClickHandler, this);
            this._itemClick = $.proxy(this._itemClickHandler, this);
            ej.listenEvents([this._radial, this._radialSVGDiv, doc, doc], [ej.endEvent(), ej.endEvent(), ej.endEvent(), ej.startEvent()],
                [this._radialClick, this._itemClick, this._targetClick, this._targetDown], false);
        },
        _itemsEvents: function (group, path, arcPath) {
            this._on(group, "mouseenter", this._itemOverHandler);
            this._on(group, "touchstart", this._itemOverHandler);
            this._on(group, "mouseleave", this._itemOverHandler);
            this._on(group, "touchend", this._itemOverHandler);
            this._on(path, "mouseenter", this._itemOverHandler);
            this._on(path, "touchstart", this._itemOverHandler);
            this._on(path, "mouseleave", this._itemOverHandler);
            this._on(path, "touchend", this._itemOverHandler);
            this._on(arcPath, "mouseenter", this._itemOverHandler);
            this._on(arcPath, "touchstart", this._itemOverHandler);
            this._on(arcPath, "mouseleave", this._itemOverHandler);
            this._on(arcPath, "touchend", this._itemOverHandler);
        },
        _showMenu: function () {
            if (this._radial.hasClass("e-backarrow"))
                this._windowsInnerMenuHide(this);
            else {
                if (this._radialCircleSVGDiv.hasClass("e-displaynone"))
                    this._windowsMenuShow();
                else
                    this._windowsMenuHide(this);
            }
            this._childTarget = false;
        },
        _itemClickHandler: function (e) {
            var targetEle = $(e.target);
            if (targetEle.attr("class") == "e-active" || e.target.tagName == "polygon" || ( !ej.isNullOrUndefined(e.type) && e.type == "touchend" && targetEle.attr("class") == "e-childdefault" )) {
                this._index = parseInt(targetEle.attr("data-ej-index"));
                this._ejMenuBaseItemsRemove();
                var currentItem = this.model.items[this._index];
                if (currentItem.type && currentItem.type.toLowerCase() == ej.RadialMenu.ItemType.Slider) {
                    var ticks = currentItem.sliderSettings.ticks ? eval(currentItem.sliderSettings.ticks) : [8, 9, 11, 13, 16, 20, 26, 36, 72],
                        value = currentItem.badge.value ? parseInt(currentItem.badge.value) : 10,
                        stroke = currentItem.sliderSettings.strokeWidth ? parseInt(currentItem.sliderSettings.strokeWidth) : 1,
                        labelSpace = currentItem.sliderSettings.labelSpace ? parseInt(currentItem.sliderSettings.labelSpace) : 22;
                    this._menuChildSVGDiv.ejRadialSlider({
                        showInnerCircle: false, enableAnimation: false, radius: this.model.radius - 29, inline: true, strokeWidth: stroke,
                        labelSpace: labelSpace, value: value, ticks: ticks, change: $.proxy(this._radialSliderHandler, this)
                    });
                    this._radialSVGDiv.append(this._menuChildSVGDiv);
                }
                else {
                    this._renderRadialChildMenu(currentItem);
                    this._childTarget = true;
                    this._itemsEvents(this._childItemsGroup.children(), this._childItemsPaths.children(), this._childItemArcGroup.children());
                }
            }
            this._eventAction(e);
            if (this._event) {
                this._eventsTrigger(this._data, "click");
                this._eventsTrigger(this._data, "select");
            }
            this._event = false;
        },
        _eventAction: function (e) {
            var targetEle = $(e.target), eleClass = targetEle.attr("class"), tagName = e.target.tagName, index, text;
            if (eleClass == "e-itembgcolor" || eleClass == "e-default") {
                index = targetEle.index();
                text = !this._childTarget ? $(this._menuItemsGroup.children()[targetEle.index()]).text() : $(this._childItemsGroup.children()[targetEle.index()]).text();
                this._event = true;
                this._data = !this._childTarget ? { index: index, text: text, childIndex: null} : { index: this._index, childIndex: index, text: text };
            }
            else if ((tagName == "text" && !this._isRSText(eleClass)) || tagName == "image") {
                index = targetEle.parent().index();
                text = targetEle.parent().text();
                this._event = true;
                this._data = !this._childTarget ? { index: index, text: text, childIndex: null } : { index: this._index, childIndex: index, text: text };
            }
        },
        _radialInitialPosition: function () {
            this._targetElement = $("#" + this.model.targetElementId + "");
            if (this.model.autoOpen) {
                if (this.model.position.x != null && this.model.position.y != null)
                    this.element.css({ "top": this.model.position.y, "left": this.model.position.x });
                else if (this.model.targetElementId)
                    this.element.css({ "top": this._targetElement.height() / 2 - this.model.radius + "px", "left": this._targetElement.width() / 2 - this.model.radius + "px" });
                this.show();
            }
            else
                this.hide();
        },
        _radialChildAnimate: function () {
            var proxy = this;
            setTimeout(function () {
                proxy._radialChildSVGDiv.removeClass("e-scalehide e-scaleshow").addClass("e-displaynone");
            }, 150);
        },
        _arcOverHandler: function (e) {
            var targetEle = $(e.target),
                index = parseInt(targetEle.attr("data-ej-index")),
                targetGroupEle = $(this._childArcGroup.find('path[index=' + index + ']')),
                polygonEle = $(this._polygonGroup.find('polygon[index=' + index + ']'));
            if (e.type == "mouseenter") {
                polygonEle.attr('fill', '#808080');
                if (targetEle.attr("class") == "e-childdefault")
                    targetEle.attr("class", "e-active");
                else
                    targetGroupEle.attr("class", "e-active");
            }
            else {
                polygonEle.attr('fill', '#FFFFFF');
                if (targetEle.attr("class") == "e-active")
                    targetEle.attr("class", "e-childdefault");
                else
                    targetGroupEle.attr("class", "e-childdefault");
            }
        },
        _itemOverHandler: function (e) {
            var index = $(e.currentTarget).index();
            var targetEle = !this._childTarget ? $(this._menuItemsArcPaths.children()[index]) : $(this._childItemsArcPaths.children()[index]);
            if ((e.type == "mouseenter") || (e.type == "touchstart"))
                targetEle.attr("class", "e-childdefault");
            else
                targetEle.attr("class", "e-arcbgcolor");
        },
        _targetDownHandler: function (e) {
            var targetEle = $(e.target);
            if (!targetEle.hasClass("e-rel") && $(targetEle.closest(".e-radialmenu")).length) {
                e.preventDefault();
            }
        },
        _targetClickHandler: function (e) {
            var targetEle = $(e.target), x = e.clientX, y = e.clientY, width, height,
                menuTarget = $(targetEle.closest(".e-radialmenu")).length,
                menuState = this._radialCircleSVGDiv.hasClass("e-displaynone");
            if (this.model.targetElementId) {
                width = this._targetElement.width();
                height = this._targetElement.height();
            }
            else {
                width = window.innerWidth;
                height = window.innerHeight;
            }
            if (menuTarget == 0 && $(targetEle.closest(this._targetElement)).length == 0 && this.model.targetElementId) {
                menuState ? this.hide() : this.hideMenu();
            }
			else if( this.model.position.x && this.model.position.y ) {
				this.element.css({ "top": this.model.position.y, "left": this.model.position.x });
			}
            else if ($(targetEle.closest("div.e-radial")).length == 0 && menuState) {
                var left = x > width - this.model.radius ? width - this._diameter : (x > this.model.radius ? x - this.model.radius : 0),
                    top = y > height - this.model.radius ? height - this._diameter : (y > this.model.radius ? y - this.model.radius : 0);
                this.element.css({ "top": top + "px", "left": left + "px" });
            }
            else if (menuTarget == 0)
                this.hideMenu();
        },
        _menuItems: function (proxy, index, menuClass) {
            this._ejMenuItem(proxy, index, menuClass);
        },
        _hideMenu: function () {
            if (this._radial.hasClass("e-backarrow"))
                this._ejInnerMenuHide(this);
            else
                this._ejMenuHide(this);
        },
        setPosition: function (x, y) {
            this.element.css({ "top": y + "px", "left": x + "px" });
            this.show();
        },
        menuHide: function () {
            this._hideMenu();
        },
        enableItem: function (item) {
            this._ejMenuEnabledDisabled(item, "enabled");
        },
        disableItem: function (item) {
            this._ejMenuEnabledDisabled(item, "disabled");
        },
        enableItems: function (items) {
            this._ejMenuEnabledDisabled(items, "enabled");
        },
        disableItems: function (items) {
            this._ejMenuEnabledDisabled(items, "disabled");
        },
        _ejMenuEnabledDisabled: function (items, menuClass) {
            var proxy = this, ItemObj = Array.isArray(items) ? items : $.makeArray(items);
            $.each(ItemObj, function (i, curItem) {
                $.each(proxy.model.items, function (j, baseItem) {
                    if (baseItem.text.toLowerCase() == curItem.toLowerCase())
                        proxy._menuItems(this, j, menuClass);
                    if (baseItem.items) {
                        $.each(baseItem.items, function (k, childItem) {
                            if (childItem.text.toLowerCase() == curItem.toLowerCase())
                                childItem.enabled = (menuClass == "disabled") ? false : true;
                        });
                    }
                });
            });
        }
    });
    ej.RadialMenu.ItemType = {
        Default: "default",
        Slider: "slider"
    };
    $.extend(true, ej.RadialMenu.prototype, ej.RadialMenuBase.prototype);
})(jQuery, Syncfusion);