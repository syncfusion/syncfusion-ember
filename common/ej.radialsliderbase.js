// JavaScript source code
/**
* @fileOverview Plugin to style the Html RadialSlider elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    ej.widget("ejRadialSliderBase", "ej.RadialSliderBase", {
        defaults: {
            radius: 200,
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            enableRoundOff: true,
            value: 10,
            autoOpen: true,
            enableAnimation: true,
            cssClass: null,
            labelSpace: 30,
            stop: null,
            slide: null,
            start: null,
            change: null,
            create: null,
            destroy: null
        },
        dataTypes: {
            radius: "number",
            enableRoundOff: "boolean",
            enableAnimation: "boolean",
            cssClass: "string"
        },
        observables: ["value"],
        observableArray: ["ticks"],
        value: ej.util.valueFunction("value"),
        ticks: ej.util.valueFunction("ticks"),
        _outerTextCalculation: function (length, startAngle, endAngle) {
            var radius = this._isMobile() ? (this.model.radius - this.model.labelSpace) : (this.model.radius + this.model.labelSpace);
            this._point = ((endAngle - startAngle) / (length - 1));
            endAngle = startAngle + ((endAngle - startAngle) / (length - 1));
            var endValueCal = endAngle,
                startValueCal = endValueCal;
            this._textPoints = [];
            for (var j = 0; j < length; j++) {
                var line = {};
                var angleCondition = startAngle;
                startAngle = startAngle * Math.PI / 180.0;
                endAngle = endAngle * Math.PI / 180.0;
                line.X2 = (this._startXY) + (radius) * Math.cos(startAngle);
                line.Y2 = (this._startXY) + (radius) * Math.sin(startAngle);
                if (angleCondition <= 270 && 90 <= angleCondition)
                    line.textAlignment = "middle";
                else
                    line.textAlignment = "start";
                startAngle = endValueCal;
                endAngle = endValueCal + this._point;
                endValueCal += this._point;
                this._textPoints.push(line);
            }
            var line = {};
            var angleCondition = this._startValueAngle;
            this._startValueAngle = this._startValueAngle * Math.PI / 180.0;
            line.X2 = (this._startXY) + (radius) * Math.cos(this._startValueAngle);
            line.Y2 = (this._startXY) + (radius) * Math.sin(this._startValueAngle);
            if (angleCondition <= 270 && 90 <= angleCondition)
                line.textAlignment = "middle";
            else
                line.textAlignment = "start";
            this._textPoints.push(line);
            return this._textPoints;
        },

        _polarToCartesian: function (cX, cY, radius, angle, isDynamic) {
            var angleRadians = (angle) * Math.PI / 180.0;
            return {
                x: cX + (radius * Math.cos(angleRadians)),
                y: cY + (radius * Math.sin(isDynamic ? -angleRadians : angleRadians))
            };
        },
        _tapHandlerEvent: function (e) {
            var ticksValue, ticksdata;
            var baseRect = $("#" + this._prefix + this._elementID + "-radial-slider-svg").offset();
            var y2 = e.clientY, x2 = e.clientX, y1 =( baseRect.top + (this._radialWidth / 2)) - $(window).scrollTop(), x1 = baseRect.left + (this._radialWidth / 2);
            this._dynamicAngleCalculation(x1, x2, y1, y2);
            var space = this._isMobile() && this.model.renderMode == "ios7" ? 6.5 : this._isMobile() && this.model.renderMode == "windows" ? 2.5 : 5;
            if ((!this._isMobile() && (this._angle >= (360 - this._endAngle) && this._angle <= (360 - this._startAngle))) || (this._isMobile() && (this._angle >= (360 - (this._endAngle - space)) && this._angle <= (360 - (this._startAngle + space)))) || (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "l" && (this._angle > (270 + space) || this._angle < (90 - space)))) {
                this._lineAngleCalculation(true);
                this._previousAngle = this._angle;
                if (!this._isMobile()) {
                    $(this._overLine).remove();
                    this._pathBeforeAddlength = this._tickCount + 1;
                    this._pathAfterAddLength = this._directionLine.toString().replace(/[^M]/g, "").length;
                    if (this._pathBeforeAddlength < this._pathAfterAddLength) {
                        var deleteCount = this._isTapSelected ? 2 : 1;
                        this._directionLine.remove(this._tickCount, deleteCount, deleteCount);
                    }
                    else
                        this._directionLine.remove(this._tickCount, 1);
                    this._dynamicLineCalculation(this._angle, false, true, true, this._tickCount, this._tickCount + 1, true);
                    $(this._pathLineElement).attr("d", this._directionLine.toString());
                }
                if ($(this._textGroupElement).find('[id=' + this._prefix + this._elementID + "-dynamic-text" + ']').length > 0)
                    this._textGroupElement.find('[id=' + this._prefix + this._elementID + "-dynamic-text" + ']').remove();
                var selectPart = this._selectPart();
                var select = selectPart.select;
                var selectValue;
                if (this._isTicksControl()) {
                    selectValue = this._ticksCalculation();
                    if (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "l")
                        this.line.textAlignment = "end";
                    else if (this._isMobile() && this.model.position.charAt(0).toLowerCase() == "r")
                        this.line.textAlignment = "start";
                    else if (this._isMobile() && (this.model.position.charAt(0).toLowerCase() == "b" || this.model.position.charAt(0).toLowerCase() == "t"))
                        this.line.textAlignment = "middle";
                    if (this._isMobile() && (this.ticks().indexOf(selectValue) == 0) || (this.ticks().indexOf(selectValue) == this._tickCount - 1))
                        this.line.textAlignment = "middle";
                    if (this.ticks().indexOf(selectValue) < 0) {
                            ticksValue = selectValue.toString().split('.');
                            var grpSep = ej.preferredCulture(this.model.locale).numberFormat["."];
                            if ((!ej.isNullOrUndefined(ticksValue[1]))) {
                                ticksValue = ticksValue[0] + grpSep + ticksValue[1];
                            }
                            else ticksValue = ticksValue[0];
                            ticksdata = ticksValue;
                        this._outerTextElement = this._createSVGElements("text", { "stroke-width": 0.5, "x": this.line.X2, "y": this.line.Y2, "class": this._prefix + "dynamic-text", "id": this._prefix + this._elementID + "-dynamic-text", "textContent": ticksdata, "text-anchor": this.line.textAlignment });
                        this._textGroupElement.append(this._outerTextElement);
                        var dynamicText = document.getElementById(this._prefix + this._elementID + "-dynamic-text").getBoundingClientRect();
                        var x1 = this._textPoints[select.toFixed()].X2,
                            y1 = this._textPoints[select.toFixed()].Y2,
                            x2 = this.line.X2,
                            y2 = this.line.Y2;
                        var distance = Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
                        if (distance < (dynamicText.width * 72 / 96)) {
                            this.line = {};
                            var value = (selectValue.toString().length)
                            var pixToDegree = (dynamicText.width * 72 / 96) - (this._isMobile() ? (value * 2) : (value * 4));
                            var degPoint = (parseFloat(select.toFixed(3).substr(0, 1)) == select.toFixed()) ? this._degPoint[select.toFixed()] + pixToDegree : this._degPoint[select.toFixed()] - pixToDegree;
                            var angle = (360 - degPoint) * (Math.PI / 180.0)
                            var radius = this._isMobile() ? (this.model.radius - (this.model.labelSpace)) : (this.model.radius + (this.model.labelSpace));
                            this.line.X2 = (this._startXY) + radius * Math.cos(angle);
                            this.line.Y2 = (this._startXY) + radius * Math.sin(-angle);
                            $("#" + this._prefix + this._elementID + "-dynamic-text").attr({ "x": this.line.X2, "y": this.line.Y2 });
                        }
                    }
                }
                else
                    selectValue = this.ticks()[select.toFixed()];
                this._trigger("change", { value: selectValue, oldValue: this.value() });
                if (this._needleStop && this.model.stop)
                    this._trigger("stop", { value: selectValue });
                this.value(selectValue);
                this._needleStop = true;
                this._needleMove = false;
                if (this._isMobile())
                    ((this.model.renderMode == "windows" || this.model.renderMode == "flat") ? this._dynamicWindowsRadial() : this._dynamicIOSandAndroidRadial());
            }
        },
        _selectPart: function () {
            var dynamicAngle = this._dynamicAngle, startAngle = this._startAngle, endAngle = this._endAngle;
            if (this._isMobile()) {
                var space = this.model.renderMode == "ios7" ? 5 : this.model.renderMode == "windows" ? 2.5 : 5;
                startAngle = this._startAngle + space, endAngle = this._endAngle - space;
                if (this.model.position.charAt(0).toLowerCase() == "l") {
                    if (this._dynamicAngle < 180)
                        dynamicAngle = this._dynamicAngle + 360;
                }
            }
            var select = (dynamicAngle - startAngle) / ((endAngle - startAngle) / (this.ticks().length - 1));
            var firstValue = this.ticks()[parseInt(select)];
            var secondValue = this.ticks()[parseInt(select) + 1];
            var difference = (secondValue - firstValue);
            return { select: select, firstValue: firstValue, space: space, difference: difference, dynamicAngle: dynamicAngle, };
        },
        _lineAngleCalculation: function (isMove) {
            var selectPart = this._selectPart();
            this._degPoint.splice(this.ticks().length, this.ticks().length + 1);
            this._degPoint.push(this._degPoint[this._degPoint.length - 1] + this._point);
            var innerValue = (((this._degPoint[parseInt(selectPart.select) + 1] - this._degPoint[parseInt(selectPart.select)]) - (this._degPoint[parseInt(selectPart.select) + 1] - (selectPart.dynamicAngle))) / (this._point / selectPart.difference));
            var startDegree = parseInt(selectPart.select) != 0 ? this._degPoint[parseInt(selectPart.select)] : this._degPoint[parseInt(selectPart.select)];
            var range;
            if (this.model.enableRoundOff && isMove) {
                var smallValue = parseFloat(innerValue.toFixed(2));
                innerValue = parseInt(innerValue.toFixed());
                range = (selectPart.difference == 0.5 && smallValue >= 0.25) ? this._point * 1 : (this._point / selectPart.difference) * innerValue;
            }
            else
                range = (this._point / selectPart.difference) * parseFloat(innerValue.toFixed(2));
            this._angle = (360 - this._degPoint[parseInt(selectPart.select)]) - Math.abs(range);
        },

        _isTicksControl: function () {
            var selectPart = this._selectPart();
            this._degPoint.splice(this.ticks().length, this.ticks().length + 1);
            this._degPoint.push(this._degPoint[this._degPoint.length - 1] + this._point);
            var innerValue = (((this._degPoint[parseInt(selectPart.select) + 1] - this._degPoint[parseInt(selectPart.select)]) - (this._degPoint[parseInt(selectPart.select) + 1] - (this._dynamicAngle))) / (this._point / selectPart.difference));
            var isSecSame = this.model.enableRoundOff ? parseInt(innerValue.toFixed()) == 0 || parseInt(innerValue.toFixed()) == (selectPart.difference) ? false : true : $.inArray(this._angle, this._degPoint) > -1 ? false : true;
            return isSecSame;
        },

        _ticksCalculation: function () {
            var selectPart = this._selectPart();
            var select = selectPart.select, dynamicAngle = selectPart.dynamicAngle, difference = selectPart.difference, firstValue = selectPart.firstValue, space = selectPart.space;
            var firstValue = this.ticks()[parseInt(select)];
            this.line = {};
            var angle = (this._angle) * (Math.PI / 180.0)
            var radius = this._isMobile() ? (this.model.radius - this.model.labelSpace) : (this.model.radius + this.model.labelSpace);
            this.line.X2 = (this._startXY) + radius * Math.cos(angle);
            this.line.Y2 = (this._startXY) + radius * Math.sin(-angle);
            if (this._angle <= 270 && 90 <= this._angle)
                this.line.textAlignment = "middle";
            else
                this.line.textAlignment = "start";
            var startDegree = parseInt(select) != 0 ? this._degPoint[parseInt(select)] : this._degPoint[parseInt(select)];
            var range = (dynamicAngle - startDegree) / (this._point / difference);
            var setValue;
            if (this.model.enableRoundOff) {
                var controlValue = parseFloat(range.toFixed(1).substr(1, 3));
                range = parseInt(range.toFixed());
                setValue = firstValue + Math.abs(range);
            }
            else {
                setValue = firstValue + Math.abs(parseFloat(range.toFixed(2)));
                setValue = parseFloat(setValue.toFixed(2));
            }
            return setValue;
        },
        _dynamicAngleCalculation: function (x1, x2, y1, y2) {
            var theta = Math.atan2((y2 - y1), (x2 - x1));
            this._angle = (360 - ((theta * 180) / Math.PI)) % 360;
            this._dynamicAngle = (360 + ((theta * 180) / Math.PI)) % 360;
        },
        _createSVGElements: function (element, attr) {
            var svgObj = document.createElementNS(this._svgLink, element);
            $.each(attr, function (attr, value) {
                if (attr == 'xlink:href')
                    svgObj.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', value);
                if (attr != "textContent")
                    svgObj.setAttribute(attr, value);
                else
                    svgObj.textContent = value;
            })
            return svgObj;
        },
        show: function () {
            if (this.model.enableAnimation) {
                this.element.removeClass(this._prefix + "slider-hide").addClass(this._prefix + "slider-show");
                this._radialSVG.attr("class", "").attr("class", (this._prefix + "radialslider-svg-show " + this._prefix + "rs-svg"));
            }
            this.element.css("display", "block");
            this.model.autoOpen = true;
        },
        hide: function () {
            var proxy = this;
            if (this.model.enableAnimation) {
                this.element.removeClass(this._prefix + "slider-show").addClass(this._prefix + "slider-hide");
                this._radialSVG.attr("class", "").attr("class", this._prefix + "radialslider-svg-hide " + this._prefix + "rs-svg");
               (this.model.autoOpen) ?
                setTimeout(function () {
                    proxy.element.css("display", "none");
                }, this._isMobile ? 150 : 400)
                : proxy.element.css("display", "none");
            }
            else
                proxy.element.css("display", "none");
            this.model.autoOpen = false;
        },
        _setModel: function (options) {
            if (!ej.isNullOrUndefined(options["inline"]) && !options["inline"]) this.model.radius += 50;
            if (options.ticks) this.model.ticks = options.ticks;
            if (options.locale) {
                this.model.locale = options.locale;
            }
            if (options.enableRoundOff) this.model.value(Math.round(ej.util.getVal(this.model.value)));
            this._refresh();
        },
        _clearElement: function () {
            this.element.removeAttr("class");
            this.element.html(this._orgEle.html());
        },
        _destroy: function () {
            this._wireEvents(true);
            this._clearElement();
        },
        _isMobile: function () {
            return (this._prefix == "e-m-" ? true : false);
        },
    });
})(jQuery, Syncfusion);