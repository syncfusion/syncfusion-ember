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

    ej.widget("ejmRadialMenu", "ej.mobile.RadialMenu", {
        _setFirst: true,
        _rootCSS: "e-m-radialmenu",
        defaults: {
            renderMode: "auto",
            imageClass: "e-m-radialimage",
            backImageClass: "e-m-backimage",
            touch: null,
            //Deprecated property
            select:null,
            position: "rightcenter"
        },
        dataTypes: {
            renderMode: "enum",
            position: "enum"
        },
        _init: function () {
            this._initialization();
            this._setValues();
            this._renderRadial();
            this._wireEvents();
            this._id = this.element[0].id;
        },
        _setValues: function () {
            if (!(ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)) {
                ej.setRenderMode(this);
                this._degDis = 0;
                this._totDis = 0;
                this._prefix = "e-m-";
                this._pos = this.model.position;
            }
        },
        _renderRadial: function () {
            this._radial = ej.buildTag("div.e-m-radial e-m-abs " + this.model.imageClass + "").css({ "left": this._startXY - 25 + "px", "top": this._startXY - 25 + "px" });
            this._radialContainer = ej.buildTag("div.e-m-rel").css({ "height": this._diameter, "width": this._diameter });
            this.element.addClass("e-m-radialmenu e-m-overlow e-m-abs e-m-user-select e-m-" + this.model.renderMode + " e-m-radial" + this.model.position + "")
                        .append(this._radialContainer.append(this._radial));
            if (this._pos.charAt(0).toLowerCase() == "r")
                this._radialContainer.addClass("e-m-radialright").css("right", -this._startXY + "px");
            else
                this._radialContainer.css("left", -this._startXY + "px");
            this._posCenter();
            this["_" + this.model.renderMode + "RadialMenu"]();
        },
        _wireEvents: function () {
            this._touchStart = $.proxy(this._touchStartHandler, this);
            this._touchMove = $.proxy(this._touchMoveHandler, this);
            this._touchCanel = $.proxy(this._touchCancelHandler, this);
            this._touchEnd = $.proxy(this._touchEndHandler, this);
            this._radialTouch = $.proxy(this._showMenu, this);
            ej.listenEvents([this._radial, this._radialSVGDiv], [ej.endEvent(), ej.startEvent()], [this._radialTouch, this._touchStart], false);
        },
        _touchCancelHandler: function (e) {
            ele = e.toElement || e.relatedTarget;
            if (!$(ele).hasClass("e-m-radial") && $(ele).attr("class") != ("e-m-radialcircle") && $(ele).attr("class") != "e-m-radialdefault" && !this._radialSVGDiv.find(ele).length) {
                ej.listenEvents([this._radialSVGDiv], ["mouseout", ], [this._touchCanel], true);
                ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
                ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
                this._move = false;
            }
        },
        _ios7RadialMenu: function () {
            this._radialSVG = this._createSVGElement();
            this._menuItemsGroup = this._createGroupElement("menuitemsgroup");
            var childCircleGroup = this._createGroupElement();
            this._radialSVGDiv = ej.buildTag("div#" + this._id + "_svgdiv.e-m-abs").css("height", this._diameter);
            this._radialMenuSVGDiv = ej.buildTag("div#" + this._id + "_menusvgdiv.e-m-abs e-m-displaynone");
            var pointsVal = this._calculateRadialArc(this._itemCount, 1, 0.35, 0.2, 0.95),
                imgDim = 32;
            for (var i = 0; i < this._itemCount; i++) {
                var circleImgGroup = this._createGroupElement(),
                    currentEle = this.model.items[i],
                    imgEle = this._createImageElement(imgDim, imgDim, currentEle, pointsVal.midx[i] - imgDim / 2, pointsVal.midy[i] - imgDim / 2),
                    itemEnable = this._ejmEnableItem(currentEle, imgEle);
                this._menuItemsGroup.append(circleImgGroup
                                   .append(this._createCircleElement(pointsVal.midx[i], pointsVal.midy[i], 22, !itemEnable ? "e-m-radialdefault e-m-pathdisabled" : "e-m-radialdefault"))
                                   .append(imgEle));
                if (currentEle.badge && (currentEle.badge.enabled == "true" || currentEle.badge.enabled == true))
                    circleImgGroup.append(this._createCircleElement(pointsVal.midx[i] + 30, pointsVal.midy[i] - 5, 10, !itemEnable ? "e-m-badgecircle e-m-itemdisabled" : "e-m-badgecircle"))
                                  .append(this._createTextElement(pointsVal.midx[i] + 30, pointsVal.midy[i] - 2, !itemEnable ? "e-m-badgetext e-m-itemdisabled" : "e-m-badgetext", currentEle.badge.value));
                if (currentEle.items || (currentEle.type && currentEle.type.toLowerCase() == ej.mobile.RadialMenu.ItemType.Slider))
                    childCircleGroup.append(this._createCircleElement(pointsVal.midx[i], pointsVal.midy[i], 25, "e-m-chaildcircle"));
            }
            var radialCircle = this._createCircleElement(this._startXY, this._startXY, this._startXY, "e-m-radialcircle");
            this._radialContainer.append(this._radialSVGDiv.append(this._radialMenuSVGDiv.append(this._radialSVG.append(radialCircle)
                                 .append(this._menuItemsGroup).append(childCircleGroup))));
        },
        _ios7ChildRadialMenu: function (child, childCount, index) {
            this._radialChildSVG = this._createSVGElement();
            this._menuChildItemsGroup = this._createGroupElement("menuchilditemsgroup");
            var pointsVal = this._calculateRadialArc(childCount, 1, 0.35, 0.2, 0.95),
                imgDim = 32;
            for (var i = 0; i < childCount; i++) {
                var circleImgGroup = this._createGroupElement(),
                    currentEle = this.model.items[index].items[i],
                    imgEle = this._createImageElement(imgDim, imgDim, currentEle, pointsVal.midx[i] - imgDim / 2, pointsVal.midy[i] - imgDim / 2),
                    itemEnable = this._ejmEnableItem(currentEle, imgEle);
                this._menuChildItemsGroup.append(circleImgGroup
                                         .append(this._createCircleElement(pointsVal.midx[i], pointsVal.midy[i], 22, !itemEnable ? "e-m-radialdefault e-m-pathdisabled" : "e-m-radialdefault"))
                                         .append(imgEle));
            }
            var radialCircle = this._createCircleElement(this._startXY, this._startXY, this._startXY, "e-m-radialcircle");
            this._radialSVGDiv.append(this._menuChildSVGDiv.append(this._radialChildSVG.append(radialCircle).append(this._menuChildItemsGroup)));
        },
        _androidRadialMenu: function () {
            this._radialSVG = this._createSVGElement();
            this._menuItemsGroup = this._createGroupElement("menuitemsgroup");
            this._androidArcGroup = this._createGroupElement("androidarcgroup");
            this._imageBadgeGroup = this._createGroupElement("imagebadgegroup");
            this._imageBadgeGroup.attr("transform", "translate(-12,-12)");
            this._radialSVGDiv = ej.buildTag("div#" + this._id + "_svgdiv.e-m-abs").css("height", this._diameter);
            this._radialMenuSVGDiv = ej.buildTag("div#" + this._id + "_menusvgdiv.e-m-abs e-m-displaynone");
            var pointsVal = this._calculateRadialArc(this._itemCount, 1, 0.41, 0.65, null),
                pointsArcVal = this._calculateRadialArc(this._itemCount, 0.63, null, 0.95, null),
                childArc = this._createGroupElement(),
                imgDim = 25;
            for (var i = 0; i < this._itemCount; i++) {
                var direction = this._pathDirection(pointsVal.x1[i], pointsVal.y1[i], pointsVal.radius, pointsVal.longArc[i], pointsVal.x2[i], pointsVal.y2[i],
                    pointsVal.dEndX[i], pointsVal.dEndY[i], pointsVal.dradius, pointsVal.dStartX[i], pointsVal.dStartY[i]),
                    arcDirection = this._pathDirection(pointsArcVal.x1[i], pointsArcVal.y1[i], pointsArcVal.radius, pointsArcVal.longArc[i], pointsArcVal.x2[i],
                    pointsArcVal.y2[i], pointsArcVal.dEndX[i], pointsArcVal.dEndY[i], pointsArcVal.dradius, pointsArcVal.dStartX[i], pointsArcVal.dStartY[i]),
                    currentEle = this.model.items[i],
                    arcPath = this._createPathElement(i, arcDirection, "e-m-radialarcdefault"),
                    itemsContainer = this._createGroupElement("itemscontainer"),
                    itemEnable = this._ejmEnableItem(currentEle, itemsContainer);
                this._imageBadgeGroup.append(itemsContainer.append(this._createImageElement(imgDim, imgDim, currentEle, pointsVal.midx[i], pointsVal.midy[i])));
                if (currentEle.badge && (currentEle.badge.enabled == "true" || currentEle.badge.enabled == true))
                    itemsContainer.append(this._createCircleElement(pointsVal.midx[i] + 25, pointsVal.midy[i], 10, "e-m-badgecircle"))
                                  .append(this._createTextElement(pointsVal.midx[i] + 25, pointsVal.midy[i] + 3, "e-m-badgetext", currentEle.badge.value));
                this._androidArcGroup.append(this._createPathElement(i, direction, !itemEnable ? "e-m-radialdefault e-m-pathdisabled" : "e-m-radialdefault"));
                childArc.append(arcPath);
                if (currentEle.items || (currentEle.type && currentEle.type.toLowerCase() == ej.mobile.RadialMenu.ItemType.Slider))
                    arcPath.setAttribute("class", "e-m-radialarcactive");
            }
            this._radialContainer.append(this._radialSVGDiv.append(this._radialMenuSVGDiv.append(this._radialSVG.append(this._menuItemsGroup
                                 .append(this._androidArcGroup).append(childArc).append(this._imageBadgeGroup)))));
        },
        _androidChildRadialMenu: function (child, childCount, index) {
            this._radialChildSVG = this._createSVGElement();
            this._menuChildItemsGroup = this._createGroupElement("menuchilditemsgroup");
            this._androidChildArcGroup = this._createGroupElement("androidchildarcgroup");
            this._childImageBadgeGroup = this._createGroupElement("childimagebadgegroup");
            this._childImageBadgeGroup.attr("transform", "translate(-12,-12)");
            var pointsVal = this._calculateRadialArc(childCount, 1, 0.41, 0.65, null),
                pointsArcVal = this._calculateRadialArc(childCount, 0.63, null, 0.95, null),
                childArc = this._createGroupElement(),
                imgDim = 25;
            for (var i = 0; i < childCount; i++) {
                var direction = this._pathDirection(pointsVal.x1[i], pointsVal.y1[i], pointsVal.radius, pointsVal.longArc[i], pointsVal.x2[i], pointsVal.y2[i],
                    pointsVal.dEndX[i], pointsVal.dEndY[i], pointsVal.dradius, pointsVal.dStartX[i], pointsVal.dStartY[i]),
                    arcDirection = this._pathDirection(pointsArcVal.x1[i], pointsArcVal.y1[i], pointsArcVal.radius, pointsArcVal.longArc[i], pointsArcVal.x2[i],
                    pointsArcVal.y2[i], pointsArcVal.dEndX[i], pointsArcVal.dEndY[i], pointsArcVal.dradius, pointsArcVal.dStartX[i], pointsArcVal.dStartY[i]),
                    currentEle = this.model.items[index].items[i],
                    itemsContainer = this._createGroupElement("childitemscontainer"),
                    itemEnable = this._ejmEnableItem(currentEle, itemsContainer);
                this._childImageBadgeGroup.append(itemsContainer.append(this._createImageElement(imgDim, imgDim, currentEle, pointsVal.midx[i], pointsVal.midy[i])));
                this._androidChildArcGroup.append(this._createPathElement(i, direction, !itemEnable ? "e-m-radialdefault e-m-pathdisabled" : "e-m-radialdefault"));
                childArc.append(this._createPathElement(i, arcDirection, "e-m-radialarcdefault"));
            }
            this._radialSVGDiv.append(this._menuChildSVGDiv.append(this._radialChildSVG.append(this._menuChildItemsGroup.append(this._androidChildArcGroup)
                              .append(this._childImageBadgeGroup).append(childArc))));
        },
        _windowsRadialMenu: function () {
            this._renderRadialMenu();
        },
        _flatRadialMenu: function () {
            this._renderRadialMenu();
        },
        _ejmEnableItem: function (currentObj, ele) {
            if (currentObj.enabled == "false" || currentObj.enabled == false) {
                $(ele).attr("class", "e-m-itemdisabled");
                return false;
            }
            return true;
        },
        _ejmMenuBaseItemsRemove: function () {
            var proxy = this;
            this._degDis = 0;
            this._totDis = 0;
            this._menuChildSVGDiv = ej.buildTag("div#" + this._id + "_menuchildsvgdiv.e-m-abs");
            if (this.model.enableAnimation) {
                setTimeout(function () { proxy._radialMenuSVGDiv.removeClass("e-m-scalehide e-m-scaleshow").addClass("e-m-displaynone"); }, 150);
                this._menuChildSVGDiv.addClass("e-m-scaleshow");
            }
            else
                this._radialMenuSVGDiv.addClass("e-m-displaynone");
            this._radial.removeClass(this.model.imageClass).addClass("e-m-backarrow " + this.model.backImageClass + "");
        },
        _touchStartHandler: function (evt) {
            evt.preventDefault();
            ej._touchStartPoints(evt, this);
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._startY = evt.clientY;
            this["_" + this.model.renderMode + "TouchStart"](evt);
            ej.listenEvents([this._radialSVGDiv], ["mouseout"], [this._touchCanel], false);
            ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], false);
            ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, true);
        },
        _ios7TouchStart: function (evt) {
            var targetEle = $(evt.target), eleClass = targetEle.attr("class"), tagName = evt.target.tagName;
            if (eleClass == "e-m-radialdefault" || this._isBadge(eleClass, tagName)) {
                this._currentTarget = targetEle.parent();
                this._currentTarget.find("circle.e-m-radialdefault").attr("class", "e-m-radialactive");
            }
        },
        _androidTouchStart: function (evt) {
            var targetEle = $(evt.target), eleClass = targetEle.attr("class"), tagName = evt.target.tagName,
                index = !this._isBadge(eleClass, tagName) ? targetEle.index() : targetEle.parent().index();
            if (eleClass == "e-m-radialdefault" || this._isBadge(eleClass, tagName)) {
                var ele = this._childTarget ? this._androidChildArcGroup : this._androidArcGroup;
                this._currentTarget = $(ele.children()[index]);
                this._currentTarget.attr("class", "e-m-radialactive");
            }
        },
        _windowsTouchStart: function (evt) {
            this._windowsTouchStartAction(evt);
        },
        _flatTouchStart: function (evt) {
            this._windowsTouchStartAction(evt);
        },
        _windowsTouchStartAction: function (evt) {
            var targetEle = $(evt.target), eleClass = targetEle.attr("class"), tagName = evt.target.tagName, index, text;
            if (eleClass == "e-m-itembgcolor" || eleClass == "e-m-default") {
                index = targetEle.index();
                text = !this._childTarget ? $(this._menuItemsGroup.children()[targetEle.index()]).text() : $(this._childItemsGroup.children()[targetEle.index()]).text();
                this._event = true;
            }
            else if ((tagName == "text" && !this._isRSText(eleClass)) || tagName == "image") {
                index = targetEle.parent().index();
                text = targetEle.parent().text();
                this._event = true;
            }
            else if (eleClass == "e-m-childdefault" || tagName == "polygon") {
                index = parseInt(targetEle.attr("index"));
                this._windowsChild = this._childArcGroup.find('path[index=' + index + ']');
                this._windowsChild.attr("class", "e-m-active");
            }
            if (this._event) {
                this._currentTarget = !this._childTarget ? $(this._menuItemsArcPaths.children()[index]) : $(this._childItemsArcPaths.children()[index]);
                this._currentTarget.attr("class", "e-m-childdefault");
                this._event = false;
            }
        },
        _touchMoveHandler: function (evt) {
            evt.preventDefault();
            if (ej.isTouchDevice())
                evt = evt.touches ? evt.touches[0] : evt;
            this._relativeDis = evt.clientY - this._startY;
            if (this._degDis != 0)
                this._relativeDis += this._totDis;
            this._degDis = this._pos.charAt(0).toLowerCase() == "r" ? -(this._relativeDis % 360) : this._relativeDis % 360;
            if (ej._isTouchMoved(evt, this)) {
                this["_" + this.model.renderMode + "TouchMove"](evt);
                this._move = true;
                this._currentTarget = null;
            }
        },
        _windowsTouchMoveAction: function (evt) {
            if (this._windowsChild)
                this._windowsChild.attr("class", "e-m-childdefault");
            if (this._currentTarget)
                this._currentTarget.attr("class", "e-m-arcbgcolor");
            if (!this._childTarget) {
                this._radialSVG.css({ "transform-origin": "center", "transform": "rotate(" + this._degDis + "deg)" });
                this._radialChildSVG.css({ "transform-origin": "center", "transform": "rotate(" + this._degDis + "deg)" });
                this._iconRotation(this._menuItemsGroup);
            }
            else {
                this._menuChildSVG.css({ "transform-origin": "center", "transform": "rotate(" + this._degDis + "deg)" });
                this._iconRotation(this._childItemsGroup);
            }
        },
        _touchMoveAction: function (childEle, ele) {
            if (this._childTarget) {
                this._radialChildSVG.css({ "transform-origin": "center", "transform": "rotate(" + this._degDis + "deg)" });
                this._iconRotation(childEle);
            }
            else {
                this._radialSVG.css({ "transform-origin": "center", "transform": "rotate(" + this._degDis + "deg)" });
                this._iconRotation(ele);
            }
        },
        _ios7TouchMove: function () {
            this._touchMoveAction(this._menuChildItemsGroup, this._menuItemsGroup);
            if (this._currentTarget)
                this._currentTarget.find("circle.e-m-radialactive").attr("class", "e-m-radialdefault");
        },
        _androidTouchMove: function () {
            this._touchMoveAction(this._childImageBadgeGroup, this._imageBadgeGroup);
            if (this._currentTarget)
                this._currentTarget.attr("class", "e-m-radialdefault");
        },
        _windowsTouchMove: function (evt) {
            this._windowsTouchMoveAction(evt);
        },
        _flatTouchMove: function () {
            this._windowsTouchMoveAction();
        },
        _touchEndHandler: function (evt) {
            this._totDis = this._relativeDis;
            this["_" + this.model.renderMode + "TouchEnd"](evt);
            ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
            ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
            this._move = false;
        },
        _ios7TouchEnd: function (evt) {
            this._ios7TouchEndAction(evt);
        },
        _androidTouchEnd: function (evt) {
            this._ios7TouchEndAction(evt);
        },
        _windowsTouchEnd: function (evt) {
            this._windowsTouchEndAction(evt);
        },
        _flatTouchEnd: function (evt) {
            this._windowsTouchEndAction(evt);
        },
        _ios7TouchEndAction: function (evt) {
            if (this._currentTarget) {
                var index = this._currentTarget.index();
                this.model.renderMode == "ios7" ? this._currentTarget.find("circle.e-m-radialactive").attr("class", "e-m-radialdefault")
                : this._currentTarget.attr("class", "e-m-radialdefault");
                var currentItem = this.model.items[index];
                if (!this._childTarget && currentItem.items) {
                    this._ejmMenuBaseItemsRemove();
                    this["_" + this.model.renderMode + "ChildRadialMenu"](currentItem.items, currentItem.items.length, index);
                    this._childTarget = true;
                    this._index = index;
                }
                else if (!this._childTarget && currentItem.type && currentItem.type.toLowerCase() == ej.mobile.RadialMenu.ItemType.Slider) {
                    this._ejmMenuBaseItemsRemove();
                    var container = ej.buildTag("div"), sliderEle = ej.buildTag("div.e-m-rm-slider"), radialChildSVG = this._createSVGElement(),
                        radialCircle = this._createCircleElement(this._startXY, this._startXY, this._startXY, "e-m-radialcircle");
                    this._renderRadialSlider(currentItem, sliderEle);
                    this._radialSVGDiv.append(this._menuChildSVGDiv.append(container.append(radialChildSVG.append(radialCircle)).append(sliderEle.removeAttr("style"))));
                    if (this.model.renderMode == "android")
                        radialChildSVG.append(this._createCircleElement(this._startXY, this._startXY, this._startXY - 60, "e-m-radialcircle"));
                    this._index = index;
                }              
                    var data = this._childTarget ? { index: this._index, childIndex: index } : { index: index, childIndex: null };
                        this._eventsTrigger(data, "select");
                        this._eventsTrigger(data, "touch");              
            }
            this._currentTarget = null;
        },
        _windowsTouchEndAction: function (evt) {
            var targetEle = $(evt.target);
            if (targetEle.attr("class") == "e-m-active" || evt.target.tagName == "polygon") {
                this._index = parseInt(targetEle.attr("index"));
                this._ejMenuBaseItemsRemove();
                var currentItem = this.model.items[this._index];
                $(this._childArcGroup.find('path[index=' + this._index + ']')).attr("class", "e-m-childdefault");
                if (currentItem.type && currentItem.type.toLowerCase() == ej.mobile.RadialMenu.ItemType.Slider) {
                    this._renderRadialSlider(currentItem, this._menuChildSVGDiv);
                    this._radialSVGDiv.append(this._menuChildSVGDiv.removeAttr("style").addClass("e-m-rm-slider"));
                }
                else {
                    this._renderRadialChildMenu(currentItem);
					data ={ index: this._index, childIndex: null };
                    this._eventsTrigger(data, "select");
                    this._eventsTrigger(data, "touch");
                    this._childTarget = true;
                }
            }
            if (this._currentTarget) {
                var index = this._currentTarget.index(),
                    data = this._childTarget ? { index: this._index, childIndex: index } : { index: index, childIndex: null };
                    this._eventsTrigger(data, "select");
                    this._eventsTrigger(data, "touch");
                this._currentTarget.attr("class", "e-m-arcbgcolor");
            }
            this._currentTarget = null;
        },
        _isBadge: function (eleClass, tagName) {
            return (eleClass == "e-m-badgetext" || eleClass == "e-m-badgecircle" || tagName == "image" ? true : false);
        },
        _renderRadialSlider: function (currentItem, sliderEle) {
            var ticks = currentItem.sliderSettings.ticks ? eval(currentItem.sliderSettings.ticks) : [0, 2, 4, 6, 8, 10, 12],
                value = currentItem.badge.value ? parseInt(currentItem.badge.value) : 4,
                radius = this.model.renderMode == "android" ? this.model.radius - 22 : (this.model.renderMode == "ios7" ? this.model.radius - 35 : this.model.radius - 30),
                stroke = currentItem.sliderSettings.strokeWidth ? parseInt(currentItem.sliderSettings.strokeWidth) : ((this.model.renderMode == "windows" || this.model.renderMode == "flat") ? 10 : 2),
                labelSpace = currentItem.sliderSettings.labelSpace ? parseInt(currentItem.sliderSettings.labelSpace) : (this.model.renderMode == "android" ? 22 : 25);
            sliderEle.ejmRadialSlider({
                enableAnimation: false, radius: radius, value: value, ticks: ticks, strokeWidth: stroke, labelSpace: labelSpace,
                position: this.model.position, renderMode: this.model.renderMode, change: $.proxy(this._radialSliderHandler, this)
            });
        },
        resize: function (evt) {
            this._posCenter();
        },
        _posCenter: function () {
            var proxy = this;
            window.setTimeout(function () {
                if (proxy._pos == "rightcenter" || proxy._pos == "leftcenter")
                    proxy.element.css({ "top": (window.innerHeight / 2) - (proxy.model.radius) + "px" });
            }, ej.isAndroid() ? 200 : 0);
        },
        _showMenu: function () {
            this["_" + this.model.renderMode + "RadialTouch"]();
        },
        showRadialMenu: function () {
            this._showMenu();
        },
        _ios7RadialTouch: function () {
            this._ios7RadialAction();
        },
        _androidRadialTouch: function () {
            this._ios7RadialAction();
        },
        _windowsRadialTouch: function () {
            this._windowsRadialAction();
        },
        _flatRadialTouch: function () {
            this._windowsRadialAction();
        },
        _ios7RadialAction: function () {
            var proxy = this;
            if (this._radial.hasClass("e-m-backarrow")) {
                this._radial.removeClass("e-m-backarrow " + this.model.backImageClass + "").addClass(this.model.imageClass);
                if (this.model.enableAnimation) {
                    this._menuChildSVGDiv.removeClass("e-m-scaleshow").addClass("e-m-scalehide");
                    setTimeout(function () { proxy._menuChildSVGDiv.remove(); }, 150);
                    setTimeout(function () { proxy._radialMenuSVGDiv.removeClass("e-m-scalehide e-m-displaynone").addClass("e-m-scaleshow"); }, 200);
                }
                else {
                    this._menuChildSVGDiv.remove();
                    this._radialMenuSVGDiv.removeClass("e-m-displaynone");
                }
                ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
                ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
            }
            else {
                if (this._radialMenuSVGDiv.hasClass("e-m-displaynone")) {
                    this.model.enableAnimation ? this._radialMenuSVGDiv.removeClass("e-m-displaynone e-m-radialhide").addClass("e-m-radialshow") : this._radialMenuSVGDiv.removeClass("e-m-displaynone");
                    ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
                    this._openCloseTrigger("open");
                }
                else {
                    if (this.model.enableAnimation) {
                        this._radialMenuSVGDiv.removeClass("e-m-radialshow e-m-scaleshow").addClass("e-m-radialhide");
                        setTimeout(function () { proxy._radialMenuSVGDiv.addClass("e-m-displaynone"); }, 160);
                    }
                    else
                        this._radialMenuSVGDiv.addClass("e-m-displaynone");
                    this._openCloseTrigger("close");
                    ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
                }
            }
            this._degDis = 0;
            this._totDis = 0;
            this._childTarget = false;
            $(this._menuItemsGroup).each(function (e) {
                $(this).find("image,circle,text").removeAttr("transform");
            });
            this._radialSVG.css("transform", "rotate(0deg)");
        },
        _windowsRadialAction: function () {
            if (this._radial.hasClass("e-m-backarrow")) {
                this._windowsInnerMenuHide(this);
                ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
                ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
            }
            else {
                if (this._radialCircleSVGDiv.hasClass("e-m-displaynone")) {
                    this._windowsMenuShow();
                    ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
                }
                else {
                    this._windowsMenuHide(this);
                    ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
                }
            }
            this._degDis = 0;
            this._totDis = 0;
            this._childTarget = false;
            $(this._menuItemsGroup).each(function (e) {
                $(this).find("g").removeAttr("transform");
            });
            this._radialSVG.css("transform", "rotate(0deg)");
            this._radialChildSVG.css("transform", "rotate(0deg)");
        },
        _radialChildAnimate: function () {
            this._degDis = 0;
            this._totDis = 0;
            var proxy = this;
            setTimeout(function () {
                proxy._radialChildSVGDiv.removeClass("e-m-scalehide e-m-scaleshow").addClass("e-m-displaynone");
            }, 150);
        },
        _iconRotation: function (element) {
            var proxy = this;
            $.each(element.children(), function (i, ele) {
                var currentEle = $(ele), currentImgEle = currentEle.find("image"), currentCircleEle = currentEle.find("circle"),
                    x = parseFloat(currentImgEle.attr("x")), y = parseFloat(currentImgEle.attr("y")), disX = currentImgEle.attr("width") / 2, disY = currentImgEle.attr("height") / 2,
                    cX = parseFloat(currentCircleEle.attr("cx")), cY = parseFloat(currentCircleEle.attr("cy")),
                    imageRotateX = proxy.model.renderMode == "ios7" ? cX : x + disX, imageRotateY = proxy.model.renderMode == "ios7" ? cY : y + disY,
                    imgRotate = "rotate(" + (-proxy._degDis) + " " + imageRotateX + " " + imageRotateY + ")",
                    circleRotate = "rotate(" + (-proxy._degDis) + " " + (x + disX) + " " + (y + disY) + ")";
                if (proxy.model.renderMode == "windows" || proxy.model.renderMode == "flat")
                    currentEle.attr({ "transform": imgRotate });
                else {
                    currentImgEle.attr({ "transform": imgRotate });
                    currentEle.find("text,circle").attr({ "transform": circleRotate });
                }
            });
        },
        _menuItems: function (proxy, index, menuClass) {
            if (proxy.model.renderMode == "ios7") {
                var currentGroupEle = $(proxy._menuItemsGroup.find("g")[index]),
                    imgEle = currentGroupEle.find("image"), itemCircleEle = currentGroupEle.find("circle.e-m-radialdefault"),
                    badgeCircleEle = currentGroupEle.find("circle.e-m-badgecircle"), textEle = currentGroupEle.find("text");
                if (menuClass == "disabled") {
                    imgEle.attr("class", "e-m-itemdisabled");
                    itemCircleEle.attr("class", "e-m-radialdefault e-m-pathdisabled");
                    badgeCircleEle.attr("class", "e-m-badgecircle e-m-itemdisabled");
                    textEle.attr("class", "e-m-badgetext e-m-itemdisabled");
                }
                else {
                    imgEle.removeAttr("class");
                    itemCircleEle.attr("class", "e-m-radialdefault");
                    badgeCircleEle.attr("class", "e-m-badgecircle");
                    textEle.attr("class", "e-m-badgetext");
                }
            }
            else if (proxy.model.renderMode == "android") {
                var currentGroupEle = $(proxy._imageBadgeGroup.find("g")[index]),
                    currentPathEle = $(proxy._androidArcGroup.find("path")[index]);
                if (menuClass == "disabled") {
                    currentGroupEle.attr("class", "e-m-itemdisabled");
                    currentPathEle.attr("class", "e-m-radialdefault e-m-pathdisabled");
                }
                else {
                    currentGroupEle.removeAttr("class");
                    currentPathEle.attr("class", "e-m-radialdefault");
                }
            }
            else
                this._ejMenuItem(proxy, index, menuClass);
        },
        _hideMenu: function () {
            var proxy = this;
            if (this.model.renderMode == "ios7" || this.model.renderMode == "android") {
                if (this._radial.hasClass("e-m-backarrow")) {
                    this._radial.removeClass("e-m-backarrow " + this.model.backImageClass + "").addClass(this.model.imageClass);
                    this._childTarget = false;
                    if (this.model.enableAnimation) {
                        this._radialMenuSVGDiv.removeClass("e-m-radialshow e-m-radialhide e-m-scaleshow e-m-scalehide").addClass("e-m-displaynone");
                        this._menuChildSVGDiv.removeClass("e-m-scaleshow").addClass("e-m-radialhide");
                        setTimeout(function () { proxy._menuChildSVGDiv.removeClass("e-m-radialhide").remove(); }, 150);
                    }
                    else {
                        this._radialMenuSVGDiv.addClass("e-m-displaynone");
                        this._menuChildSVGDiv.remove();
                    }
                    ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
                }
                else {
                    if (this.model.enableAnimation) {
                        this._radialMenuSVGDiv.removeClass("e-m-radialshow e-m-scaleshow").addClass("e-m-radialhide");
                        setTimeout(function () {
                            proxy._radialMenuSVGDiv.addClass("e-m-displaynone").removeClass("e-m-radialshow e-m-radialhide e-m-scaleshow e-m-scalehide");
                        }, 160);
                    }
                    else
                        this._radialMenuSVGDiv.addClass("e-m-displaynone");
                }
                this._openCloseTrigger("close");
                ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
            }
            else {
                if (this._radial.hasClass("e-m-backarrow")) {
                    this._childTarget = false;
                    this._ejInnerMenuHide(this);
                    ej.listenTouchEvent(this._radialSVGDiv, ej.startEvent(), this._touchStart, false);
                }
                else
                    this._ejMenuHide(this);
                ej.listenEvents([this._radialSVGDiv, this._radialSVGDiv], [ej.moveEvent(), ej.endEvent()], [this._touchMove, this._touchEnd], true);
            }
        },
        documentClick: function (evt) {
            if ($($(evt.target).closest("div.e-m-rel")).length == 0 && !this._move) {
                this.hideMenu();
                this._move = false;
            }
        }
    });
    ej.mobile.RadialMenu.Position = {
        RightCenter: "rightcenter",
        RightTop: "righttop",
        RightBottom: "rightbottom",
        LeftCenter: "leftcenter",
        LeftTop: "lefttop",
        LeftBottom: "leftbottom"
    };
    ej.mobile.RadialMenu.ItemType = {
        Default: "default",
        Slider: "slider"
    };
    $.extend(true, ej.mobile.RadialMenu.prototype, ej.RadialMenuBase.prototype);
})(jQuery, Syncfusion);