// JavaScript source code
/**
* @fileOverview Plugin to style the Html Tile elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    // ejmTile is the plugin name 
    // "ej.mobile.Tile" is "namespace.className" will hold functions and properties
    ej.widget("ejmRadialSlider", "ej.mobile.RadialSlider", {
        _setFirst: true,
        _rootCSS: "e-m-radialslider",
        defaults: {
            renderMode: "auto",
            theme: "auto",
            position: "rightcenter",
            strokeWidth: ej.isWindows() || ej.isFlat() ? 12 : 5
        },
        dataTypes:{
            ticks:"array"
        },
        _init: function () {
            this._docClick = false;
            this._orgEle = this.element.clone();
            this._renderEJMControl();
        },
        _renderEJMControl: function () {
            ej.setRenderMode(this);
            ej.setTheme(this);
            this._prefix = "e-m-";
            this._initialization();
            this.element.addClass("e-m-radialslider e-m-overlow e-m-abs e-m-user-select e-m-" + this.model.renderMode + " e-m-" + this.model.theme + " e-m-radial" + this.model.position + "")
            this._radialSVG = $(this._createSVGElements("svg", { "id": this._prefix + this._elementID + "-radial-slider-svg", "class": this._prefix + "rs-svg", "width": this._diameter, "height": this._diameter }));
            this._circleGroupElement = $(this._createSVGElements("g", { "id": "circlegroup" }));
            this._radialCircleCalculation(50, 40, this._tickCount, true, true, "path");
            this._textGroupElement = $(this._createSVGElements("g", { "id": "outerTextCircle", "transform": "translate(0, 4)" }));
            var space = this.model.renderMode == "ios7" ? 6.5 : 5;
            this._outerTextDirection = this._outerTextCalculation(this._tickCount, (this._startAngle + space), (this._endAngle - space));
            for (var i = 0; i < this._tickCount + 1; i++) {
                var k = (i == 0) && (this._startAngle == 0) && (this._endAngle == 360) ? (this._tickCount - 1) : i;
                var isCornerTicks = ((i == 0 || i == this._tickCount - 1) || ((this.ticks()[i] == this.value() && this.ticks()[0] == this.value()) || (this.ticks()[i] == this.value() && this.ticks()[this._tickCount - 1] == this.value())));
                if (this.model.position.charAt(0).toLowerCase() == "l")
                    this._outerTextDirection[i].textAlignment = "end";
                if (isCornerTicks)
                    this._outerTextDirection[i].textAlignment = "middle";
                if (this.model.position.charAt(0).toLowerCase() == "r" && !isCornerTicks)
                    this._outerTextDirection[i].textAlignment = "start";
                if (this.model.position.charAt(0).toLowerCase() == "b" || this.model.position.charAt(0).toLowerCase() == "t")
                    this._outerTextDirection[i].textAlignment = "middle";
                this._outerTextElement;
                if (i == this._tickCount) {
                    if ((this.ticks()[0] == this.value()))
                        continue;
                    else
                        this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "id": this._prefix + this._elementID + "-dynamic-text", "class": this._prefix + "dynamic-text", "textContent": this.value(), "text-anchor": this._outerTextDirection[i].textAlignment });
                }
                else
                    this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "class": this._prefix + "ticks-text", "textContent": this.ticks()[k], "text-anchor": this._outerTextDirection[i].textAlignment });
                this._textGroupElement.append(this._outerTextElement);
            }
            this._radialSliderWrapper.append(this._radialSVG.append(this._textGroupElement).append(this._circleGroupElement));
            if (this.model.autoOpen)
                this.element.css("display", "block");
            else
                this.element.css("display", "none");
            this._wireEvents(false);
        },
        _initialization: function () {
            this.element.addClass(this.model.cssClass);
            this._svgLink = "http://www.w3.org/2000/svg";
            this._startXY = this.model.radius;
            this._diameter = 2 * this.model.radius;
            this.model.radius = this._startXY;
            this._elementID = this.element.attr("id");
            this._tickCount = this.ticks().length;
            this._radialWidth = this._diameter;
            //Angle initialization
            if (this.model.position.charAt(0).toLowerCase() == "r") {
                this._startAngle = 90;
                this._endAngle = 270;
            }
            if (this.model.position.charAt(0).toLowerCase() == "l") {
                this._startAngle = 270;
                this._endAngle = 450;
            }
            if (this.model.position.charAt(0).toLowerCase() == "t") {
                this._startAngle = 0;
                this._endAngle = 180;
            }
            if (this.model.position.charAt(0).toLowerCase() == "b") {
                this._startAngle = 180;
                this._endAngle = 360;
            }
            this._radialSliderWrapper = ej.buildTag("div", {}, {}, { "class": this._prefix + "radail-slider-wrapper" });
            this.element.append(this._radialSliderWrapper);
            this._positionRadial();
        },
        resize: function (e) {
            var proxy = this;
            window.setTimeout(function () {
                proxy._positionRadial();
            }, ej.isAndroid() ? 200 : 0);
        },
        _documentClick: function (evt) {
            if ($($(evt.target).closest("svg.e-m-rs-svg")).length == 0 && this._docClick) {
                this.hide();
                this._docClick = false;
            }
            if (this.element.hasClass("e-m-slider-show"))
                this._docClick = true;
        },
        _positionRadial: function () {
            if (this.model.position.charAt(0).toLowerCase() == "r")
                this.element.addClass("e-m-radialright").css("right", -this._startXY + "px");
            if (this.model.position == "rightcenter" || this.model.position == "leftcenter")
                this.element.css({ "top": (window.innerHeight / 2) - (this.model.radius) + "px" });
            if (this.model.position.charAt(0).toLowerCase() == "b") {
                this.element.css({ "bottom": -(this.model.radius) + "px" });
                if (this.model.position == "bottomcenter")
                    this.element.css({ "left": (window.innerWidth / 2) - (this.model.radius) + "px" });
                if (this.model.position == "bottomright")
                    this.element.css({ "right": 10 + "px" });
                if (this.model.position == "bottomleft")
                    this.element.css({ "left": 10 + "px" });
            }
            if (this.model.position.charAt(0).toLowerCase() == "t") {
                this.element.css({ "top": -(this.model.radius) + "px" });
                if (this.model.position == "topcenter")
                    this.element.css({ "left": (window.innerWidth / 2) - (this.model.radius) + "px" });
                else if (this.model.position == "topleft")
                    this.element.css({ "left": 10 + "px" });
                else if (this.model.position == "topright")
                    this.element.css("right", 10 + "px");
            }
            if (this.model.position.charAt(0).toLowerCase() == "l")
                this.element.css({ "left": -(this.model.radius) + "px" });
        },

        _pathDirection: function (x1, y1, radius, lArc, x2, y2, dEndX, dEndY, dRadius, dStartX, dStartY, isDynamic) {
            lArc = isDynamic ? 0 : lArc;
            return ["M", x1, y1, "A", radius, radius, "0", lArc, "1", x2, y2, "L", dEndX, dEndY, "A", dRadius, dRadius, "1", lArc, "0", dStartX, dStartY, "z"].join(" ");
        },

        _radialCircleCalculation: function (dis1, dis2, length, isOuterLine, isInnerLine, element) {
            var space = this.model.renderMode == "ios7" ? 6.5 : this.model.renderMode == "windows" ? 2.5 : 5;
            var startAngle = this._startAngle + space, endAngle = startAngle + (((this._endAngle - space) - (this._startAngle + space)) / (length - 1));
            this._point = (((this._endAngle - space) - (this._startAngle + space)) / (length - 1));
            var endValueCal = endAngle, startValueCal = endValueCal;
            this._degPoint = [];
            this._degPoint.push(startAngle);
            for (var j = 0; j < length; j++) {
                var line = {};
                startAngle = startAngle * Math.PI / 180.0;
                endAngle = endAngle * Math.PI / 180.0;
                this._degPoint.push(endValueCal);
                startAngle = endValueCal;
                endAngle = endValueCal + this._point;
                endValueCal += this._point;
            }
            for (var i = 0; i < length; i++) {
                var k = i + 1;
                var lastValue = i == (this.ticks().length - 1) ? this.ticks()[this.ticks().length - 1] + 0.5 : this.ticks()[k];
                var firstValue = i == 0 ? this.ticks()[i] - 0.5 : this.ticks()[i];
                var ticksSecond = firstValue <= 0 && firstValue >= this.value() ? true : false;
                var ticksFirst = lastValue <= 0 && lastValue <= this.value() ? true : false;
                var condition = ticksSecond && ticksFirst ? true : (firstValue <= this.value() && this.value() < lastValue);
                if (condition) {
                    if (this.ticks()[i] != this.value()) {
                        var difference = this._point / (this.ticks()[k] - this.ticks()[i]);
                        var angleDifference = this.ticks()[k] - this.value();
                        this._startValueAngle = this._degPoint[k] - (difference * angleDifference);
                        this._radialSliderCircle();
                    }
                    else {
                        this._startValueAngle = this._degPoint[i];
                        this._radialSliderCircle();
                    }
                }
            }
        },
        _radialSliderCircle: function () {
            var direction = this._calculateCircleDirection(this._startAngle, (this.model.renderMode == "windows" || this.model.renderMode == "flat") ? this._startValueAngle - 2.5 : this._startValueAngle);
            this._fillCircleElement = this._createSVGElements("path", { "d": direction, "class": this._prefix + "rs-fill-circle" });
            this._circleGroupElement.append(this._fillCircleElement);
            var direction = this._calculateCircleDirection(((this.model.renderMode == "windows" || this.model.renderMode == "flat") ? this._startValueAngle + 2.5 : this._startValueAngle), this._endAngle);
            this._radialCircleDefault = this._createSVGElements("path", { "d": direction, "class": this._prefix + "rs-circle-default" });
            this._circleGroupElement.append(this._radialCircleDefault);
            if ((this.model.renderMode == "windows" || this.model.renderMode == "flat")) {
                var direction = this._calculateCircleDirection(this._startValueAngle - 2.5, this._startValueAngle + 2.5);
                this._markerElement = this._createSVGElements("path", { "d": direction, "class": this._prefix + "rs-marker", "stroke-width": ej.isFlat() ? (this.model.strokeWidth - 5) : "none" });
                this._circleGroupElement.append(this._markerElement);
            }
            else {
                var radius = (0.5 * Math.min(this._diameter, this._diameter));
                radius = radius - ((radius - this._arcRadius) / 2);
                if (this.model.renderMode == "android") {
                    var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, this._startValueAngle);
                    this._smallCircle = this._createSVGElements("circle", { "class": "e-m-rs-marker", "cx": (startPoint.x), "cy": startPoint.y, "r": 6 });
                    this._outerSmallCircel = this._createSVGElements("circle", { "class": "e-m-marker-large", "cx": (startPoint.x), "cy": startPoint.y, "r": 15 });
                    this._circleGroupElement.append(this._outerSmallCircel).append(this._smallCircle);
                }
                else {
                    this._iosMarkerElement = ej.buildTag("div.e-m-rs-marker");
                    var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, this._startValueAngle);
                    this._radialSliderWrapper.append(this._iosMarkerElement);
                    this._iosMarkerElement.css({ "left": startPoint.x - 15, "top": startPoint.y - 15 });
                }
            }
        },

        _refresh: function () {
            this._destroy();
            this.element.removeAttr("style");
            this.element.addClass("e-m-radialslider e-js");
            this._renderEJMControl();
        },
        //events part
        _createDelegates: function () {
            this._documentDelegate = $.proxy(this._documentClick, this);
            this._touchStartDelegate = $.proxy(this._touchStartHandler, this);
            this._markerMoveDelegate = $.proxy(this._markerMoveHandler, this);
            this._touchEndDelegate = $.proxy(this._touchEndHandler, this);
        },
        _wireEvents: function (remove) {
            this._createDelegates();
            ej.listenEvents([this._radialSVG], [ej.startEvent()], [this._touchStartDelegate], remove);
            ej.listenEvents([$(document)], ["click"], [this._documentDelegate], remove);
            if (this.model.renderMode == "ios7")
                ej.listenEvents([this._iosMarkerElement], [ej.startEvent()], [this._touchStartDelegate], remove);
        },

        _touchEndHandler: function (e) {
            e = e.touches ? e.changedTouches[0] : e;
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._markerMoveDelegate], true);
            if (this.model.renderMode == "ios7")
                ej.listenEvents([this._iosMarkerElement], [ej.moveEvent()], [this._markerMoveDelegate], true);
            this._tapHandlerEvent(e);
            this._docClick = false;
        },
        _touchStartHandler: function (e) {
            ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            if (this.model.start)
                this._trigger("start", { value: this.value() });
            ej.listenEvents([this._radialSVG, this._radialSVG], [ej.moveEvent(), ej.endEvent()], [this._markerMoveDelegate, this._touchEndDelegate], false);
            if (this.model.renderMode == "ios7")
                ej.listenEvents([this._iosMarkerElement, this._iosMarkerElement], [ej.moveEvent(), ej.endEvent()], [this._markerMoveDelegate, this._touchEndDelegate], false);
        },
        _markerMoveHandler: function (e) {
            ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 = baseRect.top + (this._radialWidth / 2), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            var space = this.model.renderMode == "ios7" ? 6.5 : this.model.renderMode == "windows" ? 2.5 : 5;
            if ((this.model.position.charAt(0).toLowerCase() == "l" && (this._angle > (270 + space) || this._angle < (90 - space))) || (this.model.position.charAt(0).toLowerCase() != "l" && (this._angle > ((360 - (this._endAngle - space))) && this._angle < ((360 - (this._startAngle + space)))))) {
                ((this.model.renderMode == "windows" || this.model.renderMode == "flat") ? this._dynamicWindowsRadial() : this._dynamicIOSandAndroidRadial());
                if (this.model.slide) {
                    var selectValue = this._ticksCalculation();
                    this._trigger("slide", { value: selectValue, selectedValue: this.value() });
                }
            }
        },

        _calculateCircleDirection: function (startAngle, endAngle, isDynamic, isFill, isDefault) {
            var radius = 0.5 * Math.min(this._diameter, this._diameter),
            dradius = radius - this.model.strokeWidth;
            this._arcRadius = dradius;
            var x1, y1, x2, y2, midx, dStartX, dStartY, dEndX, dEndY, longArc;
            startAngle = startAngle * Math.PI / 180.0;
            endAngle = endAngle * Math.PI / 180.0;
            longArc = endAngle - startAngle < Math.PI ? 0 : 1;
            var midAngle = (startAngle + endAngle) / 2;
            x1 = this._startXY + radius * Math.cos(startAngle);
            y1 = this._startXY + radius * Math.sin(isDynamic ? -startAngle : startAngle);
            x2 = this._startXY + radius * Math.cos(endAngle);
            y2 = this._startXY + radius * Math.sin(isDynamic ? -endAngle : endAngle);
            dStartX = this._startXY + dradius * Math.cos(startAngle);
            dStartY = this._startXY + dradius * Math.sin(isDynamic ? -startAngle : startAngle);
            dEndX = this._startXY + dradius * Math.cos(endAngle);
            dEndY = this._startXY + dradius * Math.sin(isDynamic ? -endAngle : endAngle);
            leftPosition = false;
            if (this.model.position.charAt(0).toLowerCase() == "l"  || this.model.position.charAt(0).toLowerCase() == "b")
                leftPosition = true;
            return this._pathDirection(x1, y1, radius, longArc, x2, y2, dEndX, dEndY, dradius, dStartX, dStartY, leftPosition);
        },

        _dynamicWindowsRadial: function () {
            var direction = this._calculateCircleDirection(360 - this._startAngle, this._angle + 2.5, true, true);
            $(this._fillCircleElement).attr("d", direction);
            var direction = this._calculateCircleDirection(this._angle + 2.5, this._angle - 2.5, true, false);
            $(this._markerElement).attr("d", direction);
            var direction = this._calculateCircleDirection(this._angle - 2.5, (360 - this._endAngle), true, false, true);
            $(this._radialCircleDefault).attr("d", direction);
        },

        _dynamicIOSandAndroidRadial: function () {
            var direction = this._calculateCircleDirection(this._angle, (360 - this._endAngle), true, false, true);
            $(this._radialCircleDefault).attr("d", direction);
            var direction = this._calculateCircleDirection((360 - this._startAngle), this._angle, true, true);
            $(this._fillCircleElement).attr("d", direction);
            var radius = (0.5 * Math.min(this._diameter, this._diameter));
            radius = radius - ((radius - this._arcRadius) / 2);
            if (this.model.renderMode == "android") {
                var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, this._angle, true);
                $(this._smallCircle).attr({ "cx": (startPoint.x), "cy": startPoint.y });
                $(this._outerSmallCircel).attr({ "cx": (startPoint.x), "cy": startPoint.y });
            }
            else {
                var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, this._angle, true);
                this._iosMarkerElement.css({ "left": startPoint.x - 15, "top": startPoint.y - 15 });
            }
        },

    })
    ej.mobile.RadialSlider.Position = {
        RightCenter: "rightcenter",
        RightTop: "righttop",
        RightBottom: "rightbottom",
        LeftCenter: "leftcenter",
        LeftTop: "lefttop",
        LeftBottom: "leftbottom",
        TopLeft: "topleft",
        TopRight: "topright",
        TopCenter: "topcenter",
        BottomLeft: "bottomleft",
        BottomRight: "bottomright",
        BottomCenter: "bottomcenter"
    };

    $.extend(true, ej.mobile.RadialSlider.prototype, ej.RadialSliderBase.prototype);

})(jQuery, Syncfusion);