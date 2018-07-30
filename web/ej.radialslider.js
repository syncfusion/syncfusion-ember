// JavaScript source code
/**
* @fileOverview Plugin to style the Html Radial Slider elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejRadialSlider", "ej.RadialSlider", {
        _setFirst: true,
        validTags: ["div"],
        _rootCSS: "e-radialslider",
        defaults: {
            mouseover: null,
            strokeWidth: 2,
            inline: false,
            endAngle: 360,
            startAngle: 0,
            innerCircleImageClass: null,
            innerCircleImageUrl: null,
            showInnerCircle: true,
            inline: false,
            locale: "en-US"

        },
        dataTypes: {
            innerCircleImageClass: "string",
            innerCircleImageUrl: "string",
            showInnerCircle: "boolean",
            inline: "boolean",
            strokeWidth: "number",
            endAngle: "number",
            startAngle: "number",
            locale: "string",
        },
        _init: function () {
            this._orgEle = this.element.clone();
            this._renderEJControl();
        },
        _renderEJControl: function () {
            this._prefix = "e-";
            this._directionLine = this._getStringBuilder();
            this._initialization();
            this.model.locale = ej.preferredCulture(this.model.locale).name == "en" ? "en-US" : ej.preferredCulture(this.model.locale).name;
            this._localizedLabels = this._getLocalizedLabels();
            this._setLocaleCulture(this._localizedLabels);
            this.culture = ej.preferredCulture(this.model.locale);
            this._renderControl();
            this._wireEvents(false);
        },
        _initialization: function () {
            this.element.addClass(this.model.cssClass);
            this._svgLink = "http://www.w3.org/2000/svg";
            this._startXY = this.model.radius - (this.model.inline ? 50 : 0);
            this._startAngle = this.model.startAngle;
            this._endAngle = this.model.endAngle;
            this._diameter = 2 * this.model.radius;
            this._elementID = this.element.attr("id");
            this.model.radius = this._startXY;
            this._tickCount = this.ticks().length;
            this._labelSpacing = this.model.inline ? 0 : 200;
            this._radialWidth = this._diameter + this._labelSpacing;
            this.element.css({ "width": this._diameter + this._labelSpacing, "height": this._diameter + this._labelSpacing });
            this._radialSliderWrapper = ej.buildTag("div", {}, {}, { "class": this._prefix + "radail-slider-wrapper" }).css({ "width": this._radialWidth, "height": this._radialWidth });
            if (this.model.showInnerCircle) {
                this._innerCircle = ej.buildTag("div", {}, {}, { "class": this._prefix + "inner-circle" }).css({ "left": ((this._radialWidth / 2) - (20 + this.model.strokeWidth + 1)), "top": ((this._radialWidth / 2) - (20 + this.model.strokeWidth + 1)), "border-width": this.model.strokeWidth + 1 });
                if (this.model.innerCircleImageClass)
                    this._innerCircle.addClass(this.model.innerCircleImageClass);
                else
                    this._innerCircle.css({ "background-image": "url('" + this.model.innerCircleImageUrl + "')" });
                this._radialSliderWrapper.append(this._innerCircle);
            }
            this.element.append(this._radialSliderWrapper);
        },
        _renderControl: function () {
            var tickstext = [], ticksvalue = [], ticksdata = [], t, selectvalue=[];
            //svg element creaton
            this._radialSVG = $(this._createSVGElements("svg", { "id": this._prefix +this._elementID+ "-radial-slider-svg", "class": this._prefix + "rs-svg", "width": this._diameter + this._labelSpacing, "height": this._diameter + this._labelSpacing }));
            //Outer line circle group
            var pathTranslate = this.model.inline ? 50 : 100, textTranslateX = this.model.inline ? 45 : 95, textTranslateY = this.model.inline ? 55 : 105;
            this._pathLineGroupElement = $(this._createSVGElements("g", { "id": "outerLineCircle", "transform": "translate(" + pathTranslate + "," + pathTranslate + ")" }));
            this._lineDirection = this._outerLineCalculation(50, 40, this._tickCount, true, true, "path");
            //Outer test  circle group
            this._textGroupElement = $(this._createSVGElements("g", { "id": "outerTextCircle", "transform": "translate(" + textTranslateX + "," + textTranslateY + ")" }));
            //Circle group
            this._circleGroupElement = $(this._createSVGElements("g", { "id": "circlegroup", "transform": "translate(" + pathTranslate + "," + pathTranslate + ")" }));
            this._circlePath = this._createSVGElements("path", { "id": "circlepath", "d": this._circleArcDirection(this._startAngle, this._endAngle), "class": this._prefix + "radialarcdefault", "fill": "none", "stroke-width": this.model.strokeWidth });
            this._circleGroupElement.append(this._circlePath);
            this._circleGroupElement.append(this._radialCircle);
            this._outerTextDirection = this._outerTextCalculation(this._tickCount, this._startAngle, this._endAngle);
            // Text value set in corresponding point
            for (var i = 0; i < this._tickCount + 1; i++) {
                var k = (i == 0) && (this._startAngle == 0) && (this._endAngle == 360) ? (this._tickCount - 1) : i;
                this._outerTextElement;
                    for (var j = 0; j < this.ticks().length; j++) {
                        tickstext[j] = this.ticks()[j].toString().split('.');
                    }
                    for (t = 0; t < tickstext.length; t++) {
                        ticksvalue[t] = tickstext[t];
                        var data = ticksvalue[t];
                        var data1;
                        var grpSep = ej.preferredCulture(this.model.locale).numberFormat["."];
                        if ((!ej.isNullOrUndefined(data[1]))) {
                            data1 = data[0] + grpSep + data[1];
                        }
                        else data1 = data[0];
                        ticksdata[t] = data1;

                    }
                    if(!ej.isNullOrUndefined(this.value())){
                    selectvalue = this.value().toString().split('.');
                    var grpSep = ej.preferredCulture(this.model.locale).numberFormat["."];
                    if ((!ej.isNullOrUndefined(selectvalue[1]))) {
                        selectvalue = selectvalue[0] + grpSep + selectvalue[1];
                    }
                    else selectvalue = selectvalue[0];
                    }
                if (i == this._tickCount) {
                    if ((this.ticks()[0] == this.value()))
                        continue;
                    else
                        this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "id": this._prefix + this._elementID + "-dynamic-text", "class": this._prefix + "dynamic-text", "textContent": ((this.model.enableRoundOff) ? Math.round(selectvalue) : selectvalue), "text-anchor": this._outerTextDirection[i].textAlignment });
                }
                else
            this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this._outerTextDirection[i].X2, "y": this._outerTextDirection[i].Y2, "class": this._prefix + "ticks-text", "textContent": ticksdata[k] , "text-anchor": this._outerTextDirection[i].textAlignment });
                this._textGroupElement.append(this._outerTextElement);
            }
            this._pathLineElement = this._createSVGElements("path", { "class": this._prefix + "radial-needle", "d": this._lineDirection, "fill": "none", "stroke-width": this.model.strokeWidth });
            this._pathLineGroupElement.append(this._pathLineElement);
            this._radialSliderWrapper.append(this._radialSVG.append(this._pathLineGroupElement).append(this._textGroupElement).append(this._circleGroupElement));
            if (this.model.autoOpen)
                this.show();
            else
                this.hide();
        },
        //Circel direction calculation
        _circleArcDirection: function (startAngle, endAngle) {
            var radius = (0.5 * Math.min(this._diameter - (this.model.inline ? 100 : 0), this._diameter - (this.model.inline ? 100 : 0)));
            var startPoint = this._polarToCartesian(this._startXY, this._startXY, radius, startAngle),
            endPoint = this._polarToCartesian(this._startXY, this._startXY, radius, endAngle);
           var ArcSweep = endAngle - startAngle <= 180 ? "0" : "1";
            var direction = [
            "M", startPoint.x, startPoint.y,
            "A", radius, radius, 0, ArcSweep, 1, endPoint.x, endPoint.y - 1
            ].join(" ");
            return direction;
        },
        _overNeedleMoveHandler: function (e) {
            e.preventDefault();
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 = (baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            if ((this._angle > (360 - this._endAngle) && this._angle < (360 - this._startAngle))) {
                //Over element
                this.line = {};
                var radius = this.model.radius;
                this.line.X1 = this._startXY;
                this.line.Y1 = this._startXY;
                var cosAngle = Math.cos(this._angle * Math.PI / 180.0);
                var sinAngle = -(Math.sin(this._angle * Math.PI / 180.0));
                this.line.X2 = this._startXY + (radius - 5) * cosAngle;
                this.line.Y2 = this._startXY + (radius - 5) * sinAngle;
                if (this._overLine != undefined)
                    $(this._overLine).attr({ "d": [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "), "stroke-width": (this.model.strokeWidth == 1 ? this.model.strokeWidth - 0.5 : this.model.strokeWidth - 1) });
                else
                    this._overLine = this._createSVGElements("path", { "class": this._prefix + "needle-over", "d": [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "), "stroke-width": this.model.strokeWidth == 1 ? this.model.strokeWidth - 0.5 : this.model.strokeWidth - 1 });
                this._pathLineGroupElement.append(this._overLine);
                this._isNeedleOver = true;
                var selectValue = this._ticksCalculation();
                if (this.model.mouseover) {
                    this._trigger("mouseover", { value: selectValue, selectedValue: this.value() });
                }
            }
        },
        _needleMoveHandler: function (e) {
             ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 = (baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            if ((this._angle > (360 - this._endAngle) && this._angle < (360 - this._startAngle))) {
                $(this._overLine).remove();
                this._lineAngleCalculation();
                var index = this._isTapSelected ? this._tickCount + 1 : this._tickCount;
                this._directionLine.remove(index, 1, 1);
                this._dynamicLineCalculation(this._angle, false, true, true, this._tickCount, this._tickCount + 1, false);
                $(this._pathLineElement).attr("d", this._directionLine.toString());
                if (this.model.slide) {
                    var selectValue = this._ticksCalculation();
                    this._trigger("slide", { value: selectValue, selectedValue: this.value() });
                }
                this._needleMove = true;
            }
        },
        _dynamicLineDirection: function (angle, lastValue, isDynamic) {
            var outerLine = {};
            var firstPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius), angle, isDynamic);
            var secondPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius + 10), angle, isDynamic);
            outerLine.X1 = firstPoint.x;
            outerLine.Y1 = firstPoint.y;
            outerLine.X2 = secondPoint.x;
            outerLine.Y2 = secondPoint.y;
            this._isTapSelected = true;
            this._directionLine.insert(lastValue + 2, [" M", outerLine.X1, outerLine.Y1, "L", outerLine.X2, outerLine.Y2].join(" "));
            return this._directionLine.toString();
        },
        _inLineCalculation: function (angle, isDynamic) {
            var line = {};
            var secondPoint = this._polarToCartesian(this._startXY, this._startXY, (this.model.radius - 5), angle, isDynamic);
            line.X1 = this._startXY, line.Y1 = this._startXY, line.X2 = secondPoint.x, line.Y2 = secondPoint.y;
            this._directionLine.append([" M", line.X1, line.Y1, "L", line.X2, line.Y2].join(" "));
            return this._directionLine.toString();
        },

        _dynamicLineCalculation: function (angle, isAppend, isRemove, isInsert, lastValue, insertValue, isOuter) {
            this.line = {};
            var radius = this.model.radius;
            this.line.X1 = this._startXY;
            this.line.Y1 = this._startXY;
            var cosAngle = Math.cos(angle * Math.PI / 180.0);
            var sinAngle = -(Math.sin(angle * Math.PI / 180.0));
            this.line.X2 = this._startXY + (radius - 5) * cosAngle;
            this.line.Y2 = this._startXY + (radius - 5) * sinAngle;
            if (isOuter) {
                this._dynamicLineDirection(angle, lastValue, true);
            }
            if (isAppend) {
                this._directionLine.append([" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "));
            }
            if (isInsert) {
                this._directionLine.insert(lastValue + 3, [" M", this.line.X1, this.line.Y1, "L", this.line.X2, this.line.Y2].join(" "));
            }
            return this._directionLine.toString();
        },

        _setLocaleCulture: function (localizedLabels, isSetModel) {
            if (this.defaults.ticks === this.model.ticks)
                this.model.ticks = localizedLabels.ticks;

            if (isSetModel) {
                this.model.ticks = this._localizedLabels.ticks;
                this.model.value = this._localizedLabels.value;
            }
            if (JSON.stringify(this.model.ticks) === JSON.stringify(this.defaults.ticks))
                this.model.ticks = localizedLabels.ticks;
            if (this.model.value === this.defaults.value)
                this.model.value = localizedLabels.value;
        },

        _getStringBuilder: function () {
            var data = [];
            var counter = 0;
            return {
                append: function (s) {
                    data[counter++] = s;
                    return this;
                },
                remove: function (i, j, k) {
                    counter = counter - (k || 1);
                    data.splice(i, j || 1);
                    return this;
                },
                insert: function (i, s) {
                    data.splice(i, 0, s);
                    counter++;
                    return this;
                },
                toString: function (s) { return data.join(s || ""); }
            }
        },
        _outerLineCalculation: function (dis1, dis2, length, isOuterLine, isinLine, element) {
            var radius = this.model.radius;
            var startAngle = this._startAngle,
                 endAngle = startAngle + ((this._endAngle - this._startAngle) / (length - 1));
            this._point = ((this._endAngle - this._startAngle) / (length - 1));
            var endValueCal = endAngle,
                startValueCal = endValueCal;
            var textPoints = [];
            this._degPoint = [];
            this._degPoint.push(startAngle);
            if (isOuterLine) {
                for (var j = 0; j < length; j++) {
                    var line = {};
                    startAngle = startAngle * Math.PI / 180.0;
                    endAngle = endAngle * Math.PI / 180.0;
                    this._degPoint.push(endValueCal);
                    if (element != "text") {
                        line.X1 = this._startXY + (radius) * Math.cos(startAngle);
                        line.Y1 = this._startXY + (radius) * Math.sin(startAngle);
                    }
                    line.X2 = this._startXY + (radius + 10) * Math.cos(startAngle);
                    line.Y2 = this._startXY + (radius + 10) * Math.sin(startAngle);
                    startAngle = endValueCal;
                    endAngle = endValueCal + this._point;
                    endValueCal += this._point;
                    element == "path" ? this._directionLine.append([" M", line.X1, line.Y1, "L", line.X2, line.Y2].join(" ")) : textPoints.push(line);
                }
            }
            if (isinLine) {
                for (var i = 0; i < this.ticks().length; i++) {
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
                            this._dynamicLineDirection(this._startValueAngle, this._tickCount - 2, false);
                            this._inLineCalculation(this._startValueAngle, false);
                        }
                        else {
                            this._startValueAngle = this._degPoint[i];
                            this._inLineCalculation(this._startValueAngle, false);
                        }
                    }
                }
            }
            this._path = element == "path" ? this._directionLine.toString() : textPoints;
            return this._path;
        },
        _refresh: function () {
            this._destroy();
            this.element.addClass("e-radialslider e-js");			
            this._renderEJControl();
        },
        //events part
        _createDelegates: function () {
            this._touchStartDelegate = $.proxy(this._touchStartHandler, this);
            this._needleMoveDelegate = $.proxy(this._needleMoveHandler, this);
            this._touchEndDelegate = $.proxy(this._touchEndHandler, this);
            this._overNeedleMoveDelegate = $.proxy(this._overNeedleMoveHandler, this);
            this._mouseOutDelegate = $.proxy(this._mouseOutHandler, this);
            this._enterMouseDelegates = $.proxy(this._entermouse, this);
        },
        _wireEvents: function (remove) {
            var eventType = remove ? "off" : "on";
            this._createDelegates();
            ej.listenEvents([this._radialSVG, this._radialSVG, this._radialSVG, this._radialSVG], [ej.endEvent(), ej.startEvent(), "mouseenter", "mouseleave"], [this._touchEndDelegate, this._touchStartDelegate, this._enterMouseDelegates, this._mouseOutDelegate], false);
        },
        _entermouse: function (e) {
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._overNeedleMoveDelegate], false);
        },
        _mouseOutHandler: function (e) {
            e.preventDefault();
            if (this._radialSVG.has(e.target).length == 0 && this._needleMove) {
                ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], true);
                var lastAngle = this._previousAngle != undefined ? this._previousAngle : this._startValueAngle;
                this._pathAfterAddLength = this._directionLine.toString().replace(/[^M]/g, "").length;
                this._directionLine.remove(this._pathAfterAddLength - 1, 1);
                this._inLineCalculation(lastAngle, true);
                $(this._pathLineElement).attr("d", this._directionLine.toString());
                this._needleMove = false;
            }
            $(this._overLine).remove();
        },
        _touchEndHandler: function (e) {
            e = e.touches ? e.changedTouches[0] : e;
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], true);
            this._tapHandlerEvent(e);
        },
        _touchStartHandler: function (e) {
            ej.blockDefaultActions(e);
            if (ej.isTouchDevice())
                e = e.touches ? e.touches[0] : e;
            this._needleStop = false;
            if (this.model.start)
                this._trigger("start", { value: this.value() });
            ej.listenEvents([this._radialSVG], [ej.moveEvent()], [this._needleMoveDelegate], false);
        },
        _getLocalizedLabels: function(){
        return ej.getLocalizedConstants(this.sfType, this.model.locale);
    }

    })
    $.extend(true, ej.RadialSlider.prototype, ej.RadialSliderBase.prototype);
    ej.RadialSlider.Locale = ej.RadialSlider.Locale || {};

    ej.RadialSlider.Locale['default'] = ej.RadialSlider.Locale['en-US'] = {
        ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        value: 10
    };
})(jQuery, Syncfusion);