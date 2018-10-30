
ej.seriesTypes = {};

ej.EjSeriesRender = function () {

};
ej.indicatorTypes = {};

ej.EjIndicatorRender = function () {

};
ej.trendlineTypes = {};

ej.EjTrendLineRenderer = function () {

};
(function ($) {
    ej.EjTrendLineRenderer.prototype = {
        draw: function (trendline, series, sender) {
            this.chartObj = sender;
            var trendIndex = $.inArray(trendline, series.trendlines);
            trendline._isTransposed = sender.model.requireInvertedAxes;
            trendline.xAxis = series.xAxis;
            trendline.yAxis = series.yAxis;
            var type = trendline.type.toLowerCase();
            if (trendline.points.length > 1) {
                if (type == "linear" || type == "movingaverage")
                    this.calculateLineDirection(trendline, series, trendIndex);
                else
                    this.calculateSplineDirection(trendline, series, trendIndex);
            }
            return false;
        },
        calculateSplineDirection: function (trendline, series, trendIndex) {
            //var series = trendline;
            var spDirection = "";
            var splinesb = ej.EjSvgRender.utils._getStringBuilder();
            var startingPoint = true;
            var yIndex = 0;
            var visiblePoints = trendline.points;
            var ySpline = ej.EjSeriesRender.prototype.naturalSpline(visiblePoints, series);
            var firstPoint = null;
            var secondPoint = null;
            var firstIndex = -1;
            var canvasX = 0;
            var canvasY = 0;
            var point, pointIndex;
            var length = visiblePoints.length;
            for (var i = 0; i < length; i++) {
                pointIndex = i;
                secondPoint = visiblePoints[i];
                if (firstPoint != null) {
                    var controlPoint1 = null;
                    var controlPoint2 = null;
                    var data = ej.EjSeriesRender.prototype.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, series, this);
                    controlPoint1 = data["controlPoint1"];
                    controlPoint2 = data["controlPoint2"];
                    var pt1 = ej.EjSvgRender.utils._getPoint(firstPoint, trendline);
                    var pt2 = ej.EjSvgRender.utils._getPoint(secondPoint, trendline);
                    var bpt1 = ej.EjSvgRender.utils._getPoint(controlPoint1, trendline);
                    var bpt2 = ej.EjSvgRender.utils._getPoint(controlPoint2, trendline);
                    var chartObj = this.chartObj;
                    if (startingPoint) {
                        splinesb.append("M" + " " + (pt1.X) + " " + (pt1.Y) + " " + "C" + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (pt2.X) + " " + (pt2.Y) + " ");
                        startingPoint = false;
                    }
                    else
                        splinesb.append("C" + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (pt2.X) + " " + (pt2.Y) + " ");
                }
                firstPoint = secondPoint;
                firstIndex = pointIndex;
            }
            spDirection = splinesb.toString();
            this._drawLinePath(trendline, series, spDirection, trendIndex);

            return false;
        },
        calculateLineDirection: function (trendline, series, trendIndex) {
            var canvasX = 0;
            var canvasY = 0;
            var point;
            var lDirection;
            var sb = ej.EjSvgRender.utils._getStringBuilder();

            var firstPoint = false;
            var secondPoint;
            var length = trendline.points.length;
            for (var i = 0; i < length; i++) {
                secondPoint = trendline.points[i];
                point = ej.EjSvgRender.utils._getPoint(secondPoint, trendline);
                if (firstPoint)
                    sb.append("L" + " " + (point.X) + " " + ((point.Y)) + " ");
                else {
                    sb.append("M" + " " + (point.X) + " " + ((point.Y)) + " ");
                    sb.append("L" + " " + (point.X) + " " + ((point.Y)) + " ");
                    firstPoint = true;
                }
            }
            lDirection = sb.toString();
            this._drawLinePath(trendline, series, lDirection, trendIndex);
            return false;
        },
        _drawLinePath: function (trendline, series, lDirection, trendIndex) {
            var translate = [];
            translate[0] = trendline.xAxis.x;
            translate[1] = trendline.yAxis.y;

            if (lDirection != "") {
                var options = {
                    'id': this.chartObj.svgObject.id + "_" + trendline.seriesIndex + "_" + trendIndex + "_" + trendline.name.replace(/[^a-zA-Z ]/g, ""),
                    'fill': 'none',
                    'stroke-dasharray': trendline.dashArray,
                    'stroke-width': trendline.width,
                    'stroke': trendline.fill,
                    'opacity': trendline.opacity,
                    'd': lDirection
                };
                trendline.id = options.id;
                this.chartObj.svgRenderer.drawPath(options, series.gTrendGroupEle, translate);
            }
            this.chartObj.svgRenderer.append(series.gTrendGroupEle, this.chartObj.gTrendlinesGroupEle[trendline.seriesIndex]);

            return false;
        },

        calculateTrendLineSegment: function (series, trendline, axis, sender) {
            var chartmodel = sender.model;
            var axis, points = $.extend([], series.points);
            var trendlineType = trendline.type.toLowerCase();
            trendline.xAxis = series.xAxis ? series.xAxis : chartmodel.primaryXAxis;
            trendline.yAxis = series.yAxis ? series.yAxis : chartmodel.primaryYAxis;
            trendline.backwardForecast = trendline.backwardForecast < 0 ? 0 : trendline.backwardForecast;
            trendline.forwardForecast = trendline.forwardForecast < 0 ? 0 : trendline.forwardForecast;
            points = points.sort(function (a, b) { return (a.xValue > b.xValue) ? 1 : ((b.xValue > a.xValue) ? -1 : 0); });
            switch (trendlineType) {
                case "linear":
                    this.updateTrendSource(points, trendline);
                    this.calculateLinearTrendline(series, trendline, axis);
                    break;
                case "exponential":
                    this.updateExponentialTrendSource(points, trendline);
                    this.calculateExponentialTrendline(series, trendline, axis);
                    break;
                case "logarithmic":
                    this.updateLogarithmicTrendSource(points, trendline);
                    this.calculateLogarithmicTrendline(series, trendline, axis);
                    break;
                case "power":
                    this.updatePowerTrendSource(points, trendline);
                    this.calculatePowerTrendline(series, trendline, axis);
                    break;
                case "polynomial":
                    var length = series.points.length;
                    trendline.polynomialOrder = length <= trendline.polynomialOrder ? length : trendline.polynomialOrder;
                    trendline.polynomialOrder = trendline.polynomialOrder < 2 ? 2 : trendline.polynomialOrder;
                    trendline.polynomialOrder = trendline.polynomialOrder > 6 ? 6 : trendline.polynomialOrder;
                    if (length > 1) {
                        this.updateTrendSource(points, trendline);
                        this.calculatePolynomialTrendline(series, trendline, axis);
                    }
                    break;
                case "movingaverage":
                    this.updateMovingAverageTrendSource(points, trendline);
                    this.calculateMovingAverageTrendline(series, trendline, axis);
                    break;
            }
            if (series.points.length > 1 && trendline.points)
                this.calculateTrendLineRange(trendline, axis);
            return false;
        },
        updateTrendSource: function (points, trendline) {
            var len = points.length, point, xValue;

            trendline.xPoints = [];
            trendline.xValues = [];
            trendline.yValues = [];
            for (var i = 0; i < len; i++) {
                point = points[i];
                if (!point.isEmpty && !ej.isNullOrUndefined(point.y)) {
                    trendline.xPoints.push(point.xValue);
                    xValue = typeof (point.xValue) === 'number' ? point.xValue : Date.parse(point.xValue);
                    trendline.xValues.push(xValue);
                    trendline.yValues.push(point.y);
                }
            }
            this.calculateSumXAndYValue(trendline);
            return false;
        },
        calculateLinearTrendline: function (series, trendline, axis) {

            var count = trendline.xValues.length;
            var x1, x2;
            trendline.points = [];

            if (count > 1) {
                if (axis._valueType.toLowerCase() == "datetime") {
                    x1 = this._increaseDateTimeInterval(trendline.xPoints[0], -trendline.backwardForecast, axis._intervalType);
                    x2 = this._increaseDateTimeInterval(trendline.xPoints[count - 1], trendline.forwardForecast, axis._intervalType);
                } else {
                    x1 = (trendline.xPoints[0] - trendline.backwardForecast);
                    x2 = (trendline.xPoints[count - 1] + trendline.forwardForecast);
                }

                //trendline linear segment  y = ax + b;
                var y1 = trendline.slope * x1 + trendline._intercept;
                var y2 = trendline.slope * x2 + trendline._intercept;
                trendline.points.push({ x: x1, xValue: x1, y: y1, YValues: [], visible: true });
                trendline.points.push({ x: x2, xValue: x2, y: y2, YValues: [], visible: true });

                trendline.points[0].YValues[0] = trendline.points[0].y;
                trendline.points[1].YValues[0] = trendline.points[1].y;
            }
            return false;
        },

        //// Calculate Trendline range
        calculateTrendLineRange: function (trendline, axis) {

            var length = trendline.points.length;
            var y;
            trendline.minY = trendline.points[0].y;
            trendline.maxY = trendline.points[length - 1].y;
            if (!axis.setRange) {
                if (trendline.backwardForecast > 0 && axis._valueType != "category" && length > 1) {
                    axis.range.min = axis.range.min > trendline.points[0].x ? trendline.points[0].x : axis.range.min;
                    axis.visibleRange.min = axis.range.min;
                }
                if (trendline.forwardForecast > 0 && length > 1) {
                    axis.range.max = axis.range.max < trendline.points[length - 1].x ? trendline.points[length - 1].x : axis.range.max;
                    axis.visibleRange.max = axis.range.max;
                }
            }
            for (var i = 0; i < length; i++) {
                y = trendline.points[i].y;
                trendline.minY = Math.min(trendline.minY, y);
                trendline.maxY = Math.max(trendline.maxY, y);
            }
            return false;
        },

        /// Calculate Sum of x and y values
        calculateSumXAndYValue: function (trendline) {
            var points = trendline.points,
                N = trendline.xPoints.length,
                type = trendline.type.toLowerCase(),
                Slope, Intercept, SX = 0, SY = 0,
                SXX = 0, SXY = 0, SYY = 0, i,
                SumProduct = 0, X = trendline.xValues, Y = trendline.yValues;

            for (i = 0; i < N; i++) {
                SX = SX + X[i];
                SY = SY + Y[i];
                SumProduct = SumProduct + (X[i] * Y[i]);
                SXY = SXY + X[i] * Y[i];
                SXX = SXX + X[i] * X[i];
                SYY = SYY + Y[i] * Y[i];
            }
            if (!ej.util.isNullOrUndefined(trendline.intercept) && (type == "linear" || type == "exponential" || type == "polynomial")) { //Set intercept value externally
                switch (type) {
                    case "polynomial":
                        Slope = (((SumProduct) - (Math.log(trendline.intercept) * SX)) / SXX) * 3;
                        break;
                    case "linear":
                        Slope = ((SumProduct) - (trendline.intercept * SX)) / SXX;
                        break;
                    case "exponential":
                        Slope = ((SumProduct) - (Math.log(trendline.intercept) * SX)) / SXX;
                        break;

                }
                trendline._intercept = trendline.intercept;
            }
            else {
                Slope = ((N * SXY) - (SX * SY)) / ((N * SXX) - (SX * SX));
                if (type == "exponential" || type == "power")
                    Intercept = Math.exp((SY - (Slope * SX)) / N);
                else
                    Intercept = (SY - (Slope * SX)) / N;

                trendline._intercept = Intercept;
            }
            trendline.slope = Slope;
            return false;
        },

        ////Calculate forward backward Forecast points for dateTime axis
        _increaseDateTimeInterval: function (date, interval, intervalType) {
            var result = new Date(date);
            date = typeof (date) === "object" ? date : result;
            if (intervalType.toLowerCase() == "days") {
                result.setDate(date.getDate() + interval);
            } else if (intervalType.toLowerCase() == "hours") {
                result.setHours(date.getHours() + interval);
            } else if (intervalType.toLowerCase() == "milliseconds") {
                result.setMilliseconds(date.getMilliseconds() + interval);
            } else if (intervalType.toLowerCase() == "seconds") {
                result.setSeconds(date.getSeconds() + interval);
            } else if (intervalType.toLowerCase() == "minutes") {
                result.setMinutes(date.getMinutes() + interval);
            } else if (intervalType.toLowerCase() == "months") {
                result.setMonth(date.getMonth() + interval);
            } else if (intervalType.toLowerCase() == "years") {
                result.setYear(date.getFullYear() + interval);
            }
            return result;
        }

    },

        ej.ejLinear = ejExtendClass(ej.EjTrendLineRenderer);
    ej.trendlineTypes.linear = ej.ejLinear;

    ej.Exponential = ejExtendClass(ej.EjTrendLineRenderer, {

        updateExponentialTrendSource: function (points, trendline) {
            var len = points.length, point, xValue;
            trendline.xPoints = [];
            trendline.xValues = [];
            trendline.yValues = [];
            for (var i = 0; i < len; i++) {
                point = points[i];
                if (!point.isEmpty && !ej.isNullOrUndefined(point.y)) {
                    trendline.xPoints.push(point.xValue);
                    xValue = typeof (point.xValue) === 'number' ? point.xValue : Date.parse(point.xValue);
                    trendline.xValues.push(xValue);
                    trendline.yValues.push(Math.log(point.y));
                }
            }
            this.calculateSumXAndYValue(trendline);
            return false;
        },
        calculateExponentialTrendline: function (series, trendline, axis) {
            var count = trendline.xValues.length;
            var x1, x2, x3;
            var X1, X2, X3;

            var midPoint = Math.round((count / 2));
            trendline.points = [];

            if (count > 1) {
                if (axis._valueType.toLowerCase() == "datetime") {
                    x1 = this._increaseDateTimeInterval(trendline.xPoints[0], -trendline.backwardForecast, axis._intervalType);
                    X1 = x1.getTime();
                    x2 = (trendline.xPoints[midPoint - 1]);
                    X2 = new Date(x2).getTime();
                    x3 = this._increaseDateTimeInterval(trendline.xPoints[count - 1], trendline.forwardForecast, axis._intervalType);
                    X3 = x3.getTime();
                } else {
                    x1 = X1 = (trendline.xPoints[0] - trendline.backwardForecast);
                    x2 = X2 = (trendline.xPoints[midPoint - 1]);
                    x3 = X3 = (trendline.xPoints[count - 1] + trendline.forwardForecast);
                }

                //trendline exponential segment  (Intercept * Math.Exp(Slope * xValue));
                var y1 = (trendline._intercept * Math.exp(trendline.slope * x1));
                var y2 = (trendline._intercept * Math.exp(trendline.slope * x2));
                var y3 = (trendline._intercept * Math.exp(trendline.slope * x3));
                trendline.points.push({ x: x1, xValue: X1, y: y1, YValues: [], visible: true });
                trendline.points.push({ x: x2, xValue: X2, y: y2, YValues: [], visible: true });
                trendline.points.push({ x: x3, xValue: X3, y: y3, YValues: [], visible: true });

                trendline.points[0].YValues[0] = trendline.points[0].y;
                trendline.points[1].YValues[0] = trendline.points[1].y;
                trendline.points[2].YValues[0] = trendline.points[2].y;
            }
            return false;
        }
    });
    ej.trendlineTypes.exponential = ej.Exponential;

    ej.Logarithmic = ejExtendClass(ej.EjTrendLineRenderer, {

        updateLogarithmicTrendSource: function (points, trendline) {
            var len = points.length, point, xValue;
            trendline.xPoints = [];
            trendline.xValues = [];
            trendline.yValues = [];
            for (var i = 0; i < len; i++) {
                point = points[i];
                if (!point.isEmpty && !ej.isNullOrUndefined(point.y)) {
                    trendline.xPoints.push(point.xValue);
                    xValue = typeof (point.xValue) === 'number' ? point.xValue : Date.parse(point.xValue);
					var xVal = isFinite(Math.log(xValue)) ? Math.log(xValue) : xValue;
					trendline.xValues.push(xVal);
                    trendline.yValues.push(point.y);
                }
            }
            this.calculateSumXAndYValue(trendline);
            return false;
        },
        calculateLogarithmicTrendline: function (series, trendline, axis) {
            var count = trendline.xValues.length;
            var x1, x2, x3;
            var X1, X2, X3;
            var midPoint = Math.round((count / 2));
            trendline.points = [];

            if (count > 1) {
                if (axis._valueType.toLowerCase() == "datetime") {
                    x1 = this._increaseDateTimeInterval(trendline.xPoints[0], -trendline.backwardForecast, axis._intervalType);
                    X1 = x1.getTime();
                    x2 = (trendline.xPoints[midPoint - 1]);
                    X2 = new Date(x2).getTime();
                    x3 = this._increaseDateTimeInterval(trendline.xPoints[count - 1], trendline.forwardForecast, axis._intervalType);
                    X3 = x3.getTime();
                } else {
                    x1 = X1 = (trendline.xPoints[0] - trendline.backwardForecast);
                    x2 = X2 = (trendline.xPoints[midPoint - 1]);
                    x3 = X3 = (trendline.xPoints[count - 1] + trendline.forwardForecast);
                }

                //trendline logarithmic segment  Intercept + Slope * Math.Log(xValue);
                var y1 = trendline._intercept + (trendline.slope * (isFinite(Math.log(x1)) ? Math.log(x1) : x1));
                var y2 = trendline._intercept + (trendline.slope * (isFinite(Math.log(x2))? Math.log(x2) : x2));
                var y3 = trendline._intercept + (trendline.slope * (isFinite(Math.log(x3))? Math.log(x3) : x3));
                trendline.points.push({ x: x1, xValue: X1, y: y1, YValues: [], visible: true });
                trendline.points.push({ x: x2, xValue: X2, y: y2, YValues: [], visible: true });
                trendline.points.push({ x: x3, xValue: X3, y: y3, YValues: [], visible: true });

                trendline.points[0].YValues[0] = trendline.points[0].y;
                trendline.points[1].YValues[0] = trendline.points[1].y;
                trendline.points[2].YValues[0] = trendline.points[2].y;
            }
            return false;
        }
    });
    ej.trendlineTypes.logarithmic = ej.Logarithmic;

    ej.Power = ejExtendClass(ej.EjTrendLineRenderer, {

        updatePowerTrendSource: function (points, trendline) {
            var len = points.length, point, xValue;
            trendline.xPoints = [];
            trendline.xValues = [];
            trendline.yValues = [];
            for (var i = 0; i < len; i++) {
                point = points[i];
                if (!point.isEmpty) {
                    trendline.xPoints.push(point.xValue);
                    xValue = typeof (point.xValue) === 'number' ? point.xValue : Date.parse(point.xValue);
                    trendline.xValues.push(Math.log(xValue));
                    trendline.yValues.push(Math.log(point.y));
                }
            }
            this.calculateSumXAndYValue(trendline);
            return false;
        },
        calculatePowerTrendline: function (series, trendline, axis) {
            var count = trendline.xValues.length;
            var x1, x2, x3;
            var X1, X2, X3;
            var midPoint = Math.round((count / 2));
            trendline.points = [];

            if (count > 1) {
                if (axis._valueType.toLowerCase() == "datetime") {
                    x1 = this._increaseDateTimeInterval(trendline.xPoints[0], -trendline.backwardForecast, axis._intervalType);
                    X1 = x1.getTime();
                    x2 = (trendline.xPoints[midPoint - 1]);
                    X2 = new Date(x2).getTime();
                    x3 = this._increaseDateTimeInterval(trendline.xPoints[count - 1], trendline.forwardForecast, axis._intervalType);
                    X3 = x3.getTime();
                } else {
                    var p1 = (trendline.xPoints[0] - trendline.backwardForecast);
                    x1 = X1 = p1 > -1 ? p1 : 0;
                    x2 = X2 = (trendline.xPoints[midPoint - 1]);
                    x3 = X3 = (trendline.xPoints[count - 1] + trendline.forwardForecast);
                }

                //trendline power segment  (Intercept * Math.Pow(xValue, Slope))
                var y1 = trendline._intercept * Math.pow(x1, trendline.slope);
                var y2 = trendline._intercept * Math.pow(x2, trendline.slope);
                var y3 = trendline._intercept * Math.pow(x3, trendline.slope);
                trendline.points.push({ x: x1, xValue: X1, y: y1, YValues: [], visible: true });
                trendline.points.push({ x: x2, xValue: X2, y: y2, YValues: [], visible: true });
                trendline.points.push({ x: x3, xValue: X3, y: y3, YValues: [], visible: true });

                trendline.points[0].YValues[0] = trendline.points[0].y;
                trendline.points[1].YValues[0] = trendline.points[1].y;
                trendline.points[2].YValues[0] = trendline.points[2].y;
            }
            return false;
        }
    });
    ej.trendlineTypes.power = ej.Power;

    ej.Polynomial = ejExtendClass(ej.EjTrendLineRenderer, {

        //// Calculate Polynomial Trendline with order
        calculatePolynomialTrendline: function (series, trendline, axis) {
            var power = trendline.polynomialOrder;

            // Calculate sum of y datapoints 1 X power matrix
            trendline.polynomialSlopes = new Array(power + 1);
            var xLength = trendline.xValues.length;
            for (var index1 = 0; index1 < xLength; index1++) {
                var num2 = trendline.xValues[index1];
                var yval = trendline.yValues[index1];

                for (var index2 = 0; index2 <= power; ++index2) {
                    if (!trendline.polynomialSlopes[index2]) trendline.polynomialSlopes[index2] = 0;
                    trendline.polynomialSlopes[index2] += Math.pow(num2, index2) * yval;
                }
            }

            // Calculate sum matrix of x datapoints
            var numArray = new Array(1 + 2 * power);
            var matrixOfA = new Array(power + 1);
            for (var i = 0; i < (power + 1); i++)
                matrixOfA[i] = new Array(3);
            var num1 = 0;
            for (var index1 = 0; index1 < xLength; ++index1) {
                var num2 = 1.0;
                var d = trendline.xValues[index1];
                for (var index2 = 0; index2 < numArray.length; ++index2) {
                    if (!numArray[index2]) numArray[index2] = 0;
                    numArray[index2] += num2;
                    num2 *= d;
                    ++num1;
                }
            }

            for (var index1 = 0; index1 <= power; ++index1) {
                for (var index2 = 0; index2 <= power; ++index2)
                    matrixOfA[index1][index2] = numArray[index1 + index2];
            }

            //Calculation Gauss jordan eliminiation value of a and b matrix
            if (!this.gaussJordanEliminiation(matrixOfA, trendline.polynomialSlopes))
                trendline.polynomialSlopes = null;

            //Create segments methods
            this.createPolynomialSegments(series, axis, trendline);
            return false;
        },
        createPolynomialSegments: function (series, axis, trendline) {
            var polynomialSlopes = trendline.polynomialSlopes;
            if (polynomialSlopes != null) {
                var count = trendline.xValues.length, midPoint = Math.round((count / 2)), x1 = 1, X, length = polynomialSlopes.length;
                var valueType = axis._valueType.toLowerCase();

                trendline.points = [];
                for (var i = 1; i <= length; i++) {
                    var x, y;
                    if (i == 1) {
                        if (valueType == "datetime") {
                            x = this._increaseDateTimeInterval(trendline.xPoints[0], -trendline.backwardForecast, axis._intervalType);
                            X = x.getTime();
                        }
                        else
                            x = X = (trendline.xPoints[0] - trendline.backwardForecast);
                        var y = this.getPolynomialYValue(polynomialSlopes, X);
                    }
                    else if (i == polynomialSlopes.length) {
                        if (valueType == "datetime") {
                            x = this._increaseDateTimeInterval(trendline.xPoints[count - 1], trendline.forwardForecast, axis._intervalType);
                            X = x.getTime();
                        }
                        else
                            x = X = (trendline.xPoints[count - 1] + trendline.forwardForecast);

                        var y = this.getPolynomialYValue(polynomialSlopes, X);
                    } else {
                        x1 += (count + trendline.forwardForecast) / polynomialSlopes.length;
                        if (valueType == "category") {
                            x = X = trendline.xPoints[0] + (x1 - 1);

                        }
                        else {
                            x = X = trendline.xPoints[parseInt(x1) - 1];
                            if (valueType == "datetime" && count > x1)
                                X = new Date(x).getTime();
                        }
                        var y = this.getPolynomialYValue(polynomialSlopes, X);
                    }
                    if (i == 1 || i == polynomialSlopes.length || valueType == "category" || count > x1) {
                        trendline.points.push({ x: x, xValue: X, y: y, YValues: [], visible: true });
                        trendline.points[trendline.points.length - 1].YValues[0] = trendline.points[trendline.points.length - 1].y;
                    }
                }
            }
            return false;
        },

        getPolynomialYValue: function (slopes, x) {
            var sum = 0;
            for (var i = 0; i < slopes.length; i++) {
                sum += slopes[i] * Math.pow(x, i);
            }
            return sum;
        },

        gaussJordanEliminiation: function (matrixOfA, polynomialSlopes) {
            var length = matrixOfA.length;
            var numArray1 = new Array(length);
            var numArray2 = new Array(length);
            var numArray3 = new Array(length);
            for (var index = 0; index < length; ++index)
                numArray3[index] = 0;
            for (var index1 = 0; index1 < length; ++index1) {
                var num1 = 0.0;
                var index2 = 0;
                var index3 = 0;
                for (var index4 = 0; index4 < length; ++index4) {
                    if (numArray3[index4] != 1) {
                        for (var index5 = 0; index5 < length; ++index5) {
                            if (numArray3[index5] == 0 && Math.abs(matrixOfA[index4][index5]) >= num1) {
                                num1 = Math.abs(matrixOfA[index4][index5]);
                                index2 = index4;
                                index3 = index5;
                            }
                        }
                    }
                }
                ++numArray3[index3];
                if (index2 != index3) {
                    for (var index4 = 0; index4 < length; ++index4) {
                        var num2 = matrixOfA[index2, index4];
                        matrixOfA[index2][index4] = matrixOfA[index3][index4];
                        matrixOfA[index3][index4] = num2;
                    }
                    var num3 = polynomialSlopes[index2];
                    polynomialSlopes[index2] = polynomialSlopes[index3];
                    polynomialSlopes[index3] = num3;
                }
                numArray2[index1] = index2;
                numArray1[index1] = index3;
                if (matrixOfA[index3][index3] == 0.0)
                    return false;
                var num4 = 1.0 / matrixOfA[index3][index3];
                matrixOfA[index3][index3] = 1.0;

                for (var index4 = 0; index4 < length; ++index4)
                    matrixOfA[index3][index4] *= num4;

                polynomialSlopes[index3] *= num4;

                for (var index4 = 0; index4 < length; ++index4) {
                    if (index4 != index3) {
                        var num2 = matrixOfA[index4][index3];
                        matrixOfA[index4][index3] = 0.0;
                        for (var index5 = 0; index5 < length; ++index5)
                            matrixOfA[index4][index5] -= matrixOfA[index3][index5] * num2;
                        polynomialSlopes[index4] -= polynomialSlopes[index3] * num2;
                    }
                }
            }
            for (var index1 = length - 1; index1 >= 0; --index1) {
                if (numArray2[index1] != numArray1[index1]) {
                    for (var index2 = 0; index2 < length; ++index2) {
                        var num = matrixOfA[index2, numArray2[index1]];
                        matrixOfA[index2][numArray2[index1]] = matrixOfA[index2][numArray1[index1]];
                        matrixOfA[index2][numArray1[index1]] = num;
                    }
                }
            }
            return true;
        }
    });
    ej.trendlineTypes.polynomial = ej.Polynomial;

    ej.MovingAverage = ejExtendClass(ej.EjTrendLineRenderer, {

        updateMovingAverageTrendSource: function (points, trendline) {
            var len = points.length, i, yVal;
            trendline.xPoints = [];
            trendline.xValues = [];
            trendline.yValues = [];
            for (i = 0; i < len; i++) {
                trendline.xPoints.push(points[i].xValue);
                trendline.xValues.push(i + 1);
                yVal = !points[i].isEmpty ? points[i].y : null;
                trendline.yValues.push(yVal);
            }
            return false;
        },
        calculateMovingAverageTrendline: function (series, trendline, axis) {
            var pointsLength = trendline.xPoints.length,
                period = trendline.period >= pointsLength ? pointsLength - 1 : trendline.period,
                x1, i, j, yVal, count, nullCount, xVal, length;
            period = period < 2 ? 2 : period;
            trendline.points = [];

            for (i = 0; i < pointsLength - 1; i++) {
                yVal = count = nullCount = 0;
                for (j = i; count < period; j++) {
                    count++;
                    if (ej.util.isNullOrUndefined(trendline.yValues[j])) nullCount++;
                    yVal += trendline.yValues[j];
                }
                yVal = period - nullCount <= 0 ? null : yVal / (period - nullCount);
                if (!ej.util.isNullOrUndefined(yVal) && !isNaN(yVal)) {
                    xVal = trendline.xPoints[period - 1 + i];
                    trendline.points.push({
                        x: xVal, xValue: xVal,
                        y: yVal, YValues: [], visible: true
                    });
                    length = trendline.points.length;
                    trendline.points[length - 1].YValues[0] = trendline.points[length - 1].y;
                }
            }
        }
    });
    ej.trendlineTypes.movingaverage = ej.MovingAverage;

    ej.EjIndicatorRender.prototype = {

        draw: function (indicator, sender) {

            this.chartObj = sender;
            var translate = null;

            if (this.chartObj.model.AreaType == "cartesianaxes") {
                var transX = indicator.xAxis.x;
                var transY = indicator.yAxis.y;
                translate = 'translate(' + transX + ',' + transY + ')';
            }

            var indicatorIndex = $.inArray(indicator, this.chartObj.model.indicators);
            var indicatorOptions = { 'id': this.chartObj.svgObject.id + '_indicatorGroup' + '_' + indicatorIndex, 'transform': translate };
            this.gIndicatorGroupEle = this.chartObj.svgRenderer.createGroup(indicatorOptions);


            if (indicator._points.length > 0) {
                for (var i = 0; i < indicator.segment.length; i++) {
                    var segment = indicator.segment[i];
                    var style = { fill: segment.fill, width: segment.width, opacity: indicator.opacity };
                    segment.isIndicator = true;
                    segment.xAxis = indicator.xAxis;
                    segment.yAxis = indicator.yAxis;
                    if (segment.type == "line")
                        this.calculateDirection(segment, style, indicatorIndex);
                    else
                        this.drawColumn(segment, style, indicator);
                }
            }

        },

        _drawLinePath: function (indicator, style, lDirection, indicatorIndex) {




            if (lDirection != "") {
                var options = {
                    'name': 'line',
                    'id': this.chartObj.svgObject.id + "_" + indicatorIndex + "_" + indicator.name,
                    'fill': 'none',
                    'stroke-dasharray': indicator.dashArray,
                    'stroke-width': style.width,
                    'stroke': style.fill,
                    'stroke-linecap': indicator.lineCap,
                    'stroke-linejoin': indicator.lineJoin,
                    'opacity': style.opacity,
                    'd': lDirection
                };

                this.chartObj.svgRenderer.drawPath(options, this.gIndicatorGroupEle);
            }

            this.chartObj.svgRenderer.append(this.gIndicatorGroupEle, this.chartObj.gIndicatorEle);
        },

        calculateDirection: function (currentseries, style, indicatorIndex) {
            var canvasX = 0;
            var canvasY = 0;
            var point;
            if (this.chartObj.model.enableCanvasRendering) {
                canvasX = currentseries.xAxis.x;
                canvasY = currentseries.yAxis.y;
            }
            currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();

            var visiblePoints = ej.EjSeriesRender.prototype._isVisiblePoints(currentseries);
            var lDirection;
            var sb = ej.EjSvgRender.utils._getStringBuilder();

            // Dashed Line issue in Indicator is fixed.
            var firstPoint = false;
            var secondPoint;

            for (var i = 0; i < visiblePoints.length; i++) {
                secondPoint = visiblePoints[i];
                if (secondPoint.visible) {
                    point = ej.EjSvgRender.utils._getPoint(secondPoint, currentseries);
                    if (firstPoint) {
                        sb.append("L" + " " + (point.X + canvasX) + " " + ((point.Y + canvasY)) + " ");
                    }
                    else {
                        sb.append("M" + " " + (point.X + canvasX) + " " + ((point.Y + canvasY)) + " ");
                        firstPoint = true;
                    }

                }
                else {
                    firstPoint = false;
                }

            }

            lDirection = sb.toString();

            this._drawLinePath(currentseries, style, lDirection, indicatorIndex);
        },

        drawColumn: function (option, style, indicator) {
            var series = option;
            var seriesIndex = $.inArray(indicator, this.chartObj.model.indicators);
            series.index = seriesIndex;
            var origin = Math.max(option.yAxis.visibleRange.min, 0);

            var sidebysideinfo = { Start: -0.35, End: 0.35 };
            var visiblePoints = ej.EjSeriesRender.prototype._isVisiblePoints(series);

            var cSer = this;
            var chart = cSer.chartObj;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = visiblePoints[i];

                var y1 = point.YValues[0];
                var y2 = origin;
                if (point.visible) {
                    //calculate sides
                    var data = ej.EjSeriesRender.prototype.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;
                    var rect = ej.EjSeriesRender.prototype.getRectangle(x1, y1, x2, y2, series, chart);

                    //drawing part
                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);
                    if (rect.Width < 0.0001)// condition checked for IE width issue
                        rect.Width = 0.0001;
                    var bounds;
                    if ((xr == 0 || yr == 0) && rect.Width > 0) {
                        var options = {
                            'id': this.chartObj.svgObject.id + "_" + seriesIndex + "_" + series.name,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': (!visiblePoints[i].fill) ? style.fill : visiblePoints[i].fill,
                            'stroke-width': series.border.width,
                            'plot': y1 < 0 ? "negative" : "positive",
                            'opacity': series.histogram.opacity,
                            'stroke': (!visiblePoints[i].fill) ? series.border.color : visiblePoints[i].fill
                        };

                        this.chartObj.svgRenderer.drawRect(options, this.gIndicatorGroupEle);

                        var svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };

                        this._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }
                }
            }

            this.chartObj.svgRenderer.append(this.gIndicatorGroupEle, this.chartObj.gIndicatorEle);
        },
        _addRegion: function (chart, bounds, series, point, pointIndex) {
            var type = series.type;
            if (series.index >= 0) {
                var regionItem = { SeriesIndex: series.index, Region: { PointIndex: pointIndex, Bounds: bounds }, type: type, isIndicator: true };
                chart.model.chartRegions.push(regionItem);
            }
        },

        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};
            indicator.period = parseInt(indicator.period);   // to convert float value to integer
            if (indicator.period < indicator._points.length && indicator.period > 0) {
                //Upperband 
                var upperSeries = $.extend(true, {}, indicator);
                upperSeries.name = "upperseries";
                upperSeries.fill = indicator.upperLine.fill;
                upperSeries.width = indicator.upperLine.width;
                upperSeries.type = "line";

                for (var k = 0; k < indicator._points.length; k++) {
                    indicator._points[k].YValues.length = 1;
                    indicator._points[k].YValues[0] = indicator._points[k].y = 70;
                }

                upperSeries.points = $.extend(true, [], indicator._points);
                var xValues = sender._getXValues(upperSeries.points);
                var yValues = sender._getYValues(upperSeries.points);

                indicator.xRange.min = Math.min.apply(Math, xValues);
                indicator.xRange.max = Math.max.apply(Math, xValues);
                indicator.yRange.min = Math.min.apply(Math, yValues);
                indicator.yRange.max = Math.max.apply(Math, yValues);

                indicator.segment.push(upperSeries);

                //Lowerband
                var lowerSeries = $.extend(true, {}, indicator);
                lowerSeries.name = "lowerSeries";
                lowerSeries.width = indicator.lowerLine.width;
                lowerSeries.fill = indicator.lowerLine.fill;
                lowerSeries.type = "line";


                for (var n = 0; n < indicator._points.length; n++) {
                    indicator._points[n].YValues[0] = indicator._points[n].y = 30;
                }

                lowerSeries.points = $.extend(true, [], indicator._points);

                yValues = sender._getYValues(lowerSeries.points);

                indicator.yRange.min = Math.min(Math.min.apply(Math, yValues), indicator.yRange.min);
                indicator.yRange.max = Math.max(Math.max.apply(Math, yValues), indicator.yRange.max);

                indicator.segment.push(lowerSeries);

                // signalLine
                var trendSeries = $.extend(true, {}, indicator);
                trendSeries.name = "signalSeries";
                trendSeries.width = indicator.width;
                trendSeries.fill = indicator.fill;
                trendSeries.type = "line";

                var c = 0, c1 = 0;
                var pmf = 0;
                var nmf = 0;
                var len = indicator.period;
                c1 = indicator._points[0].close;

                for (var i = 1; i <= len; ++i) {
                    c = indicator._points[i].close;
                    if (c > c1)
                        pmf += c - c1;
                    else if (c < c1)
                        nmf += c1 - c;
                    c1 = c;
                    indicator._points[i - 1].YValues[0] = indicator._points[i - 1].y = null;
                }
                pmf = pmf / len;
                nmf = nmf / len;

                indicator._points[len].YValues[0] = indicator._points[len].y = 100 - 100 / (1 + pmf / nmf);

                for (var j = len + 1; j < indicator._points.length; j++) {
                    c = indicator._points[j].close;
                    if (c > c1) {
                        pmf = (pmf * (len - 1) + (c - c1)) / len;
                        nmf = (nmf * (len - 1)) / len;
                    }
                    else if (c < c1) {
                        nmf = (nmf * (len - 1) + (c1 - c)) / len;
                        pmf = (pmf * (len - 1)) / len;
                    }
                    c1 = c;
                    indicator._points[j].YValues[0] = indicator._points[j].y = 100 - (100 / (1 + pmf / nmf));
                }
                trendSeries.points = $.extend(true, [], indicator._points);
                var trendPoints = [];
                for (var i = len, j = 0; i < trendSeries.points.length; i++ , j++) {
                    trendPoints[j] = trendSeries.points[i].y;
                }

                indicator.yRange.min = Math.min(Math.min.apply(Math, trendPoints), indicator.yRange.min);
                indicator.yRange.max = Math.max(Math.max.apply(Math, trendPoints), indicator.yRange.max);

                indicator.segment.push(trendSeries);
                this.calculateIndicatorRange(sender, indicator);
            }
        },

        calculateIndicatorRange: function (sender, indicator) {
            //Indicator X-Axis Calculation
            if (sender.model.indicatorRange[indicator.xAxisName] == undefined) {
                sender.model.indicatorRange[indicator.xAxisName] = {};
                sender.model.indicatorRange[indicator.xAxisName] = { min: indicator.xRange.min, max: indicator.xRange.max };
            } else {
                if (sender.model.indicatorRange[indicator.xAxisName].min > indicator.xRange.min)
                    sender.model.indicatorRange[indicator.xAxisName].min = indicator.xRange.min;
                if (sender.model.indicatorRange[indicator.xAxisName].max < indicator.xRange.max)
                    sender.model.indicatorRange[indicator.xAxisName].max = indicator.xRange.max;
            }
            //Indicator Y-Axis Calculation
            if (sender.model.indicatorRange[indicator.yAxisName] === undefined) {
                sender.model.indicatorRange[indicator.yAxisName] = {};
                sender.model.indicatorRange[indicator.yAxisName] = { min: indicator.yRange.min, max: indicator.yRange.max };
            } else {
                if (sender.model.indicatorRange[indicator.yAxisName].min > indicator.yRange.min)
                    sender.model.indicatorRange[indicator.yAxisName].min = indicator.yRange.min;
                if (sender.model.indicatorRange[indicator.yAxisName].max < indicator.yRange.max)
                    sender.model.indicatorRange[indicator.yAxisName].max = indicator.yRange.max;
            }
        }
    },
        ej.ejRSI = ejExtendClass(ej.EjIndicatorRender);

    ej.indicatorTypes.rsi = ej.ejRSI;
    ej.ejMACD = ejExtendClass(ej.EjIndicatorRender, {


        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};

            var pointsLength = indicator._points.length;
            var longPeriod = indicator.longPeriod;
            var shortPeriod = indicator.shortPeriod;
            var trigger = indicator.trigger;
            var diff = longPeriod - shortPeriod;
            var shortEMA = [];
            var longEMA = [];
            var macdPoints = [];
            var signalEMA = [];
            var histogramPoints = [];
            var length = longPeriod + trigger;
            if (length <= indicator._points.length && ((length - 2) >= 0) && (shortPeriod <= longPeriod) && (shortPeriod > 0)) {
                shortEMA = this.calculateEMA(indicator._points, shortPeriod, true);
                longEMA = this.calculateEMA(indicator._points, longPeriod, true);

                //Calculte MACD Line points: MACD Line: (shortPeriod EMA - longPeriod EMA)  
                for (i = 0; i < longEMA.length; i++)
                    macdPoints.push((shortEMA[i + diff] - longEMA[i]));

                //MACD Line 
                var macdSeries = $.extend(true, {}, indicator);
                macdSeries.name = "macdSeries";
                macdSeries.fill = indicator.macdLine.fill;
                macdSeries.width = indicator.macdLine.width;
                macdSeries.type = "line";
                macdSeries.xAxis = indicator.xAxis;
                macdSeries.yAxis = indicator.yAxis;

                var l = longPeriod - 1;
                for (var t = 0, i = 0; t < pointsLength; t++) {
                    if (t < l)
                        indicator._points[t].YValues[0] = indicator._points[t].y = null;
                    else {
                        indicator._points[t].YValues[0] = indicator._points[t].y = macdPoints[i];
                        i += 1;
                    }
                }
                macdSeries.points = $.extend(true, [], indicator._points);
                //////////////////////////////////////////////

                //Signal Line: Trigger value(9-day default) EMA of MACD Line 
                signalEMA = this.calculateEMA(macdPoints, trigger, false);
                var trendSeries = $.extend(true, {}, indicator);
                trendSeries.name = "signalSeries";
                trendSeries.fill = indicator.fill;
                trendSeries.width = indicator.width;
                trendSeries.type = "line";
                trendSeries.xAxis = indicator.xAxis;
                trendSeries.yAxis = indicator.yAxis;

                var l = longPeriod + trigger - 2;
                for (var t = 0, i = 0; t < pointsLength; t++) {
                    if (t < l)
                        indicator._points[t].YValues[0] = indicator._points[t].y = null;
                    else {
                        indicator._points[t].YValues[0] = indicator._points[t].y = signalEMA[i];
                        i += 1;
                    }
                }
                trendSeries.points = $.extend(true, [], indicator._points);
                /////////////////////////////////////////

                //MACD Histogram: MACD Line - Signal Line
                var histogramSeries = $.extend(true, {}, indicator);
                histogramSeries.border = {};
                histogramSeries.name = "histogramSeries";
                histogramSeries.fill = indicator.histogram.fill;
                histogramSeries.opacity = indicator.histogram.opacity;
                histogramSeries.fill = indicator.histogram.fill;
                histogramSeries.border = indicator.histogram.border;
                histogramSeries.type = "column";
                histogramSeries.xAxis = indicator.xAxis;
                histogramSeries.yAxis = indicator.yAxis;

                for (var j = 0, k = l; k < pointsLength; j++ , k++)
                    histogramPoints.push((macdPoints[j + (trigger - 1)]) - (signalEMA[j]));
                for (var j = 0, k = l; k < pointsLength; j++ , k++) {
                    indicator._points[k].YValues[0] = indicator._points[k].y = histogramPoints[j];
                }
                histogramSeries.points = $.extend(true, [], indicator._points);
                var xValues = sender._getXValues(macdSeries.points);
                indicator.xRange.min = Math.min.apply(Math, xValues);
                indicator.xRange.max = Math.max.apply(Math, xValues);

                switch (indicator.macdType) {
                    case "line":
                        {
                            //Push MACD Line
                            indicator.yRange.min = Math.min.apply(Math, macdPoints);
                            indicator.yRange.max = Math.max.apply(Math, macdPoints);
                            indicator.segment.push(macdSeries);

                            //Push Signal Line
                            var min = Math.min.apply(Math, signalEMA), max = Math.max.apply(Math, signalEMA);
                            indicator.yRange.min = indicator.yRange.min < min ? indicator.yRange.min : min;
                            indicator.yRange.max = indicator.yRange.max > max ? indicator.yRange.max : max;
                            indicator.segment.push(trendSeries);
                        }
                        break;
                    case "histogram":
                        {
                            //Push histogram Series
                            var min1 = Math.min.apply(Math, histogramPoints), max1 = Math.max.apply(Math, histogramPoints);
                            indicator.yRange.min = indicator.yRange.min < min1 ? indicator.yRange.min : min1;
                            indicator.yRange.max = indicator.yRange.max > max1 ? indicator.yRange.max : max1;
                            indicator.segment.push(histogramSeries);
                        }
                        break;
                    case "both":
                        {
                            //Push histogram Series
                            var min1 = Math.min.apply(Math, histogramPoints), max1 = Math.max.apply(Math, histogramPoints);
                            indicator.yRange.min = indicator.yRange.min < min1 ? indicator.yRange.min : min1;
                            indicator.yRange.max = indicator.yRange.max > max1 ? indicator.yRange.max : max1;
                            indicator.segment.push(histogramSeries);

                            //Push MACD Line 
                            indicator.yRange.min = Math.min.apply(Math, macdPoints);
                            indicator.yRange.max = Math.max.apply(Math, macdPoints);
                            indicator.segment.push(macdSeries);

                            //Push Signal Line
                            var min = Math.min.apply(Math, signalEMA), max = Math.max.apply(Math, signalEMA);
                            indicator.yRange.min = indicator.yRange.min < min ? indicator.yRange.min : min;
                            indicator.yRange.max = indicator.yRange.max > max ? indicator.yRange.max : max;
                            indicator.segment.push(trendSeries);
                        }
                        break;
                }
                this.calculateIndicatorRange(sender, indicator);
            }
        },
        calculateEMA: function (points, period, flag) {
            var sma = 0;
            var initialEMA = 0;
            var pointsLength = points.length;
            var getPoints = [];
            var getEma = [];
            var emaPercent = (2 / (period + 1));
            if (flag) { // calculating EMA for Indicators Points
                for (var i = 0; i < period; i++) {
                    getPoints.push(points[i].close);
                    sma = sma + getPoints[i];
                }

                initialEMA = (sma / period);
                getEma.push(initialEMA);
                var emaAvg = initialEMA;
                for (var j = period; j < pointsLength; j++) {
                    emaAvg = (points[j].close - emaAvg) * emaPercent + emaAvg;
                    getEma.push(emaAvg);
                }
            } else { //Calculating EMA for Signal Points
                for (var i = 0; i < period; i++) {
                    getPoints.push(points[i]);
                    sma = sma + getPoints[i];
                }

                initialEMA = (sma / period);
                getEma.push(initialEMA);
                var emaAvg = initialEMA;
                for (var j = period; j < pointsLength; j++) {
                    emaAvg = (points[j] - emaAvg) * emaPercent + emaAvg;
                    getEma.push(emaAvg);
                }
            }
            return getEma;
        }

    });

    ej.indicatorTypes.macd = ej.ejMACD;
    ej.ejSMA = ejExtendClass(ej.EjIndicatorRender, {


        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};



            // signalLine
            var trendSeries = $.extend(true, {}, indicator);
            trendSeries.name = "trendSeries";
            trendSeries.width = indicator.width;
            trendSeries.fill = indicator.fill;
            trendSeries.type = "line";

            //variable declaration
            var closevalues = [];
            var smavalues = [];
            var trendPoints = [];
            var sum, xValues;
            var length = indicator._points.length;
            var period = indicator.period;

            if (period <= 0 || length < period) return;

            //Push the Close values
            for (var i = 0; i < length; i++) {

                closevalues.push(indicator._points[i].close);

            }

            var close_length = closevalues.length;
            //calculation for SMA values


            while (close_length >= period) {
                sum = 0;
                for (var j = 0; j < period; j++) {
                    sum = sum + closevalues[j];

                }
                sum = sum / period;
                smavalues.push(sum);
                closevalues.splice(0, 1);
                close_length = closevalues.length;
            }


            //set the SMA values to Y-Axis
            for (var k = 0; k < length; k++) {
                if (k < period - 1) {
                    indicator._points[k].YValues[0] = indicator._points[k].y = null;

                }
                else {
                    indicator._points[k].YValues[0] = indicator._points[k].y = smavalues[k - (period - 1)];
                }

            }


            trendSeries.points = $.extend(true, [], indicator._points);
            var xValues = sender._getXValues(trendSeries.points);

            //Assign the Y-Axis values into trendPoints
            for (var i = period - 1, j = 0; i < trendSeries.points.length; i++ , j++) {
                trendPoints[j] = trendSeries.points[i].y;
            }

            //X-Axis and Y-Axis range calculation
            indicator.xRange.min = Math.min.apply(Math, xValues);
            indicator.xRange.max = Math.max.apply(Math, xValues);
            indicator.yRange.min = Math.min.apply(Math, trendPoints);
            indicator.yRange.max = Math.max.apply(Math, trendPoints);

            //push trendSeries
            indicator.segment.push(trendSeries);
            this.calculateIndicatorRange(sender, indicator);


        }

    });

    ej.indicatorTypes.sma = ej.ejSMA;

    ej.ejEMA = ejExtendClass(ej.EjIndicatorRender, {


        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};



            // signalLine

            var trendSeries = $.extend(true, {}, indicator);
            trendSeries.name = "trendSeries";
            trendSeries.type = "line";
            trendSeries.xAxis = indicator.xAxis;
            trendSeries.yAxis = indicator.yAxis;


            var getCloseValues = [];
            var ema = [];
            var pointsLength = indicator._points.length;
            var period = indicator.period;
            var sma = 0, xValues;
            if (pointsLength < period || period <= 0) return;
            // K=Smoothing Factor
            var k = (2 / (period + 1));

            //Get a close Values and push the previous Ema 
            for (var i = 0; i < period; i++) {
                getCloseValues.push(indicator._points[i].close);
                sma = sma + getCloseValues[i];
            }
            ema.push(sma / period);

            //Find Remaining EMA by Adding smoothing factor K to the close values
            for (j = period; j < pointsLength; j++) {
                ema.push((indicator._points[j].close - ema[j - period]) * k + ema[j - period]);
            }

            // Set Ema to the Indicator Points

            for (var t = 0; t < pointsLength; t++) {
                if (t < (period - 1)) {
                    indicator._points[t].YValues[0] = indicator._points[t].y = null;
                }
                else if (t >= (period - 1)) {
                    indicator._points[t].YValues[0] = indicator._points[t].y = ema[t - (period - 1)];
                }
            }

            // Send the indicator Points for draw series.
            trendSeries.points = $.extend(true, [], indicator._points);
            xValues = sender._getXValues(trendSeries.points);
            var trendPoints = [];
            for (var i = period, j = 0; i < trendSeries.points.length; i++ , j++)
                trendPoints[j] = trendSeries.points[i].y;

            indicator.xRange.min = Math.min.apply(Math, xValues);
            indicator.xRange.max = Math.max.apply(Math, xValues);
            indicator.yRange.min = Math.min.apply(Math, trendPoints);
            indicator.yRange.max = Math.max.apply(Math, trendPoints);

            indicator.segment.push(trendSeries);
            this.calculateIndicatorRange(sender, indicator);


        }

    });

    ej.indicatorTypes.ema = ej.ejEMA;


    ej.ejSTOCHASTIC = ejExtendClass(ej.EjIndicatorRender, {

        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};
            var KPeriod = indicator.kPeriod;
            var DPeriod = indicator.dPeriod;
            var Period = indicator.period;
            if (Period < 1 || DPeriod < 1 || KPeriod < 1) return;
            if (Period > indicator._points.length || DPeriod > indicator._points.length || KPeriod > indicator._points.length) return;
            // Upper Line Calculation
            var upperSeries = $.extend(true, {}, indicator);
            upperSeries.name = "upperseries";
            upperSeries.type = "line";
            upperSeries.fill = indicator.upperLine.fill;
            upperSeries.width = indicator.upperLine.width;

            for (var k = 0; k < indicator._points.length; k++) {
                indicator._points[k].YValues.length = 1;
                indicator._points[k].YValues[0] = indicator._points[k].y = 80;
            }

            upperSeries.points = $.extend(true, [], indicator._points);
            var xValues = sender._getXValues(upperSeries.points);
            var yValues = sender._getYValues(upperSeries.points);

            indicator.xRange.min = Math.min.apply(Math, xValues);
            indicator.xRange.max = Math.max.apply(Math, xValues);
            indicator.yRange.min = Math.min.apply(Math, yValues);
            indicator.yRange.max = Math.max.apply(Math, yValues);

            indicator.segment.push(upperSeries);
            // End for Upper Line Calculation

            // Lower Line Calculation
            var lowerSeries = $.extend(true, {}, indicator);
            lowerSeries.name = "lowerSeries";
            lowerSeries.width = indicator.lowerLine.width;
            lowerSeries.fill = indicator.lowerLine.fill;
            lowerSeries.type = "line";


            for (var n = 0; n < indicator._points.length; n++) {
                indicator._points[n].YValues[0] = indicator._points[n].y = 20;
            }

            lowerSeries.points = $.extend(true, [], indicator._points);

            xValues = sender._getXValues(lowerSeries.points);
            yValues = sender._getYValues(lowerSeries.points);

            indicator.xRange.min = Math.min(Math.min.apply(Math, xValues), indicator.xRange.min);
            indicator.xRange.max = Math.max(Math.max.apply(Math, xValues), indicator.xRange.max);
            indicator.yRange.min = Math.min(Math.min.apply(Math, yValues), indicator.yRange.min);
            indicator.yRange.max = Math.max(Math.max.apply(Math, yValues), indicator.yRange.max);

            indicator.segment.push(lowerSeries);
            // End for Lower Line Calculation

            // Signal and Period Line Calculation

            var periodSeries = $.extend(true, {}, indicator);
            periodSeries.name = "periodSeries";
            periodSeries.width = indicator.periodLine.width;
            periodSeries.fill = indicator.periodLine.fill;
            periodSeries.type = "line";

            var HighValues = [];
            var LowValues = [];
            var CloseValues = [];
            var check = [];
            for (var i = 0; i < indicator._points.length; i++) {
                LowValues[i] = indicator._points[i].low;
                HighValues[i] = indicator._points[i].high;
                CloseValues[i] = indicator._points[i].close;
            }


            AddPoints(Period, KPeriod, indicator._points);
            check = indicator._points;
            SMA(Period, KPeriod, indicator._points);
            check = indicator._points;
            periodSeries.points = $.extend(true, [], indicator._points);

            xValues = sender._getXValues(periodSeries.points);
            yValues = sender._getYValues(periodSeries.points);

            indicator.xRange.min = Math.min(Math.min.apply(Math, xValues), indicator.xRange.min);
            indicator.xRange.max = Math.max(Math.max.apply(Math, xValues), indicator.xRange.max);
            indicator.yRange.min = Math.min(Math.min.apply(Math, yValues), indicator.yRange.min);
            indicator.yRange.max = Math.max(Math.max.apply(Math, yValues), indicator.yRange.max);

            indicator.segment.push(periodSeries);


            var trendSeries = $.extend(true, {}, indicator);
            trendSeries.name = "trendSeries";
            trendSeries.width = indicator.width;
            trendSeries.fill = indicator.fill;
            trendSeries.type = "line";

            SMA((Period + KPeriod - 1), DPeriod, indicator._points);
            trendSeries.points = $.extend(true, [], indicator._points);

            indicator.segment.push(trendSeries);

            ///SMA Calculation(Signal Line and Period Line)

            function SMA(Period1, Period2, series) {
                if (indicator._points.length >= Period1 + Period2) {
                    SMACal(Period1, Period2, series);
                }
            }

            function SMACal(period1, period2, series) {
                var count = period1 + (period2 - 1);
                var temp = [];
                var values = [];
                var sum;
                for (var i = 0; i < indicator._points.length; i++) {
                    var val = check[i].y;
                    temp.push(val);
                }
                var length = temp.length;

                while (length >= count) {
                    sum = 0;
                    for (var j = period1 - 1; j < (period1 + period2 - 1); j++) {
                        sum = sum + temp[j];

                    }
                    sum = sum / period2;
                    values.push(sum.toFixed(2));
                    temp.splice(0, 1);
                    length = temp.length;
                }
                var len = count - 1;
                for (var k = 0; k < indicator._points.length; k++) {
                    if (k < len) {
                        series[k].YValues[0] = series[k].y = null;

                    }
                    else {
                        series[k].YValues[0] = series[k].y = Number((values[k - len]));
                    }

                }

            }

            // End for SMA Calculation

            // Period Line Calculation

            function AddPoints(Period1, Period2, series) {
                if (indicator._points.length > Period1) {
                    ComputeStochastics(Period1, Period2, series);
                }
            }
            function ComputeStochastics(len1, len2, series) {
                var len = len1 + len2;
                var mins = [];
                var maxs = [];
                var max;
                var min;
                var top = 0;
                var bottom = 0;
                for (var i = 0; i < len1 - 1; ++i) {
                    maxs.push(0);
                    mins.push(0);
                }

                for (var i = len1 - 1; i < indicator._points.length; ++i) {
                    min = Number.MAX_VALUE;
                    max = Number.MIN_VALUE;
                    for (var j = 0; j < len1; ++j) {
                        min = Math.min(min, LowValues[i - j]);
                        max = Math.max(max, HighValues[i - j]);
                    }
                    maxs.push(max);
                    mins.push(min);
                }

                for (var i = 0; i < len - 1; ++i) {
                    series[i].YValues.length = 1;
                    series[i].YValues[0] = series[i].y = null;
                }

                for (var i = len1 - 1; i < indicator._points.length; ++i) {
                    top = 0;
                    bottom = 0;
                    top += CloseValues[i] - mins[i];
                    bottom += maxs[i] - mins[i];
                    series[i].YValues.length = 1;
                    series[i].YValues[0] = series[i].y = (((top / bottom) * 100));
                }
            }

            // End for Period Line Calculation

            // Indicator Axis Range Calculation
            this.calculateIndicatorRange(sender, indicator);
        }


    });
    ej.indicatorTypes.stochastic = ej.ejSTOCHASTIC;
    ej.ejbollingerBand = ejExtendClass(ej.EjIndicatorRender, {
        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};
            var sum = 0.0;
            var deviationSum = 0.0;
            var limit = indicator._points.length;
            var multiplier = indicator.standardDeviations;
            var movingavg = indicator.period;
            var length = Math.round(movingavg);
            var smaPoints = [];
            var deviations = [];
            var bbiPoints = [];
            //Calculating simple moving average
            if ((length < limit) && (length > 0)) {
                for (var i = 0; i < length; i++) {
                    sum += indicator._points[i].close;

                }
                var sma = sum / movingavg;
                //Calculating smapoints using iteration
                for (var i = 0; i < limit; ++i) {
                    if (i >= length - 1 && i < limit) {
                        if (i - movingavg >= 0) {
                            var diff = indicator._points[i].close - indicator._points[i - length].close;

                            sum = sum + diff;
                            sma = sum / (movingavg);
                            smaPoints[i] = sma;
                            deviations[i] = Math.pow(indicator._points[i].close - sma, 2);
                            deviationSum += deviations[i] - deviations[i - length];


                        }
                        else {

                            smaPoints[i] = sma;
                            deviations[i] = Math.pow(indicator._points[i].close - sma, 2);
                            deviationSum += deviations[i];
                        }


                        //calculation for standarddeviation for each period

                        var range = Math.sqrt(deviationSum / (movingavg));

                        //lower Band points for bollinger band
                        var lb = smaPoints[i] - (multiplier * range);
                        //upper Band points for bollinger band
                        var ub = smaPoints[i] + (multiplier * range);
                        //Binding the lowerband,upperband and middleband values to bollingerband array if the i value equal to period
                        if (i + 1 == length) {
                            for (var j = 0; j < length - 1; j++)
                                bbiPoints[j] = { "X": indicator._points[j].X, "mb": smaPoints[i], "lb": lb, "ub": ub, visible: true };



                        }
                        //binding the lb,ub,mb values to bollinger band array if i greather than period value.
                        bbiPoints[i] = { "X": indicator._points[i].X, "mb": smaPoints[i], "lb": lb, "ub": ub, visible: true };


                    }


                    else {
                        if (i < movingavg - 1) {

                            smaPoints[i] = sma;
                            deviations[i] = Math.pow(indicator._points[i].close - sma, 2);
                            deviationSum += deviations[i];
                        }


                    }

                }


                var upperSeries = $.extend(true, {}, indicator);
                upperSeries.name = "upperseries";
                upperSeries.fill = indicator.upperLine.fill;
                upperSeries.width = indicator.upperLine.width;
                upperSeries.type = "line";

                //binding bollingerband array values to upper series and assigning null values 
                for (var k = 0; k < indicator._points.length; k++) {
                    if (k >= (length - 1)) {
                        indicator._points[k].YValues.length = 1;
                        indicator._points[k].YValues[0] = indicator._points[k].y = bbiPoints[k].ub;
                    }
                    else {
                        indicator._points[k].YValues[0] = indicator._points[k].y = null;
                    }
                }

                upperSeries.points = $.extend(true, [], indicator._points);
                var xValues = sender._getXValues(upperSeries.points);
                var values = [];
                //storing the y values from the period value
                for (var i = length; i < upperSeries.points.length; i++)
                    values.push(upperSeries.points[i].y);
                var yValues = values;
                indicator.xRange.min = Math.min.apply(Math, xValues);
                indicator.xRange.max = Math.max.apply(Math, xValues);
                indicator.yRange.min = Math.min.apply(Math, yValues);
                indicator.yRange.max = Math.max.apply(Math, yValues);

                indicator.segment.push(upperSeries);


                var lowerSeries = $.extend(true, {}, indicator);
                lowerSeries.name = "lowerSeries";
                lowerSeries.width = indicator.lowerLine.width;
                lowerSeries.fill = indicator.lowerLine.fill;
                lowerSeries.type = "line";


                for (var n = 0; n < indicator._points.length; n++) {
                    if (n >= (length - 1)) {
                        indicator._points[n].YValues.length = 1;
                        indicator._points[n].YValues[0] = indicator._points[n].y = bbiPoints[n].lb;
                    }
                    else {
                        indicator._points[n].YValues[0] = indicator._points[n].y = null;
                    }
                }


                lowerSeries.points = $.extend(true, [], indicator._points);

                xValues = sender._getXValues(lowerSeries.points);

                var lowvalues = [];
                for (var i = length; i < lowerSeries.points.length; i++)
                    lowvalues.push(lowerSeries.points[i].y);
                var yValues = lowvalues;

                indicator.xRange.min = Math.min(Math.min.apply(Math, xValues), indicator.xRange.min);
                indicator.xRange.max = Math.max(Math.max.apply(Math, xValues), indicator.xRange.max);
                indicator.yRange.min = Math.min(Math.min.apply(Math, yValues), indicator.yRange.min);
                indicator.yRange.max = Math.max(Math.max.apply(Math, yValues), indicator.yRange.max);

                indicator.segment.push(lowerSeries);



                var trendSeries = $.extend(true, {}, indicator);
                trendSeries.name = "trendSeries";
                trendSeries.width = indicator.width;
                trendSeries.fill = indicator.fill;
                trendSeries.type = "line";

                for (var m = 0; m < indicator._points.length; m++) {
                    if (m >= (length - 1)) {
                        indicator._points[m].YValues.length = 1;
                        indicator._points[m].YValues[0] = indicator._points[m].y = bbiPoints[m].mb;
                    }
                    else {
                        indicator._points[m].YValues[0] = indicator._points[m].y = null;
                    }
                }
                trendSeries.points = $.extend(true, [], indicator._points);
                xValues = sender._getXValues(trendSeries.points);
                var trendvalues = [];
                for (var i = length; i < trendSeries.points.length; i++)
                    trendvalues.push(trendSeries.points[i].y);
                var yValues = trendvalues;

                indicator.xRange.min = Math.min(Math.min.apply(Math, xValues), indicator.xRange.min);
                indicator.xRange.max = Math.max(Math.max.apply(Math, xValues), indicator.xRange.max);
                indicator.yRange.min = Math.min(Math.min.apply(Math, yValues), indicator.yRange.min);
                indicator.yRange.max = Math.max(Math.max.apply(Math, yValues), indicator.yRange.max);
                indicator.segment.push(trendSeries);
                //calculating indicator range
                this.calculateIndicatorRange(sender, indicator);
            }
        }

    });
    ej.indicatorTypes.bollingerband = ej.ejbollingerBand;
    ej.ejATR = ejExtendClass(ej.EjIndicatorRender, {
        calculateSegment: function (indicator, sender) {
            //calculation for atr
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};
            var atrPoints = [];
            var high_Low, high_ClosePrevious, low_ClosePrevious;
            high_Low = high_ClosePrevious = low_ClosePrevious = 0.0;
            var trueRange;
            var sumTruRange = 0.0;
            var firstFlag = false;
            var atr;
            var period = indicator.period;
            if ((period <= 0) || (period > indicator._points.length))
                return;
            for (var i = 0; i < period; i++) {

                high_Low = indicator._points[i].high - indicator._points[i].low;
                if (i > 0) {
                    high_ClosePrevious = Math.abs(indicator._points[i].high - indicator._points[i - 1].close);
                    low_ClosePrevious = Math.abs(indicator._points[i].low - indicator._points[i - 1].close);
                }

                trueRange = Math.max(high_Low, high_ClosePrevious, low_ClosePrevious);

                sumTruRange += trueRange;
                atr = (sumTruRange / period);

                atrPoints[i] = { "X": indicator._points[i].X, "YValues": atr };

            }

            for (var i = period; i < indicator._points.length; ++i) {
                high_Low = indicator._points[i].high - indicator._points[i].low;
                high_ClosePrevious = Math.abs(indicator._points[i].high - indicator._points[i - 1].close);
                low_ClosePrevious = Math.abs(indicator._points[i].low - indicator._points[i - 1].close);
                trueRange = Math.max(high_Low, high_ClosePrevious, low_ClosePrevious);

                atr = (atrPoints[i - 1].YValues * (period - 1) + trueRange) / period;

                atrPoints[i] = {
                    "X": indicator._points[i].X, "YValues": atr
                };

            }



            var trendSeries = $.extend(true, {}, indicator);


            trendSeries.name = "trendSeries";
            trendSeries.width = indicator.width;
            trendSeries.fill = indicator.fill;
            trendSeries.type = "line";



            for (var k = 0; k < indicator._points.length; k++) {
                if (k >= (period - 1)) {
                    indicator._points[k].YValues.length = 1;
                    indicator._points[k].YValues[0] = indicator._points[k].y = atrPoints[k].YValues;
                }
                else {
                    indicator._points[k].YValues[0] = indicator._points[k].y = null;
                }
            }



            trendSeries.points = $.extend(true, [], indicator._points);

            var xValues = sender._getXValues(trendSeries.points);

            var values = [];
            for (var i = period; i < trendSeries.points.length; i++)
                values.push(trendSeries.points[i].y);

            indicator.xRange.min = Math.min.apply(Math, xValues);
            indicator.xRange.max = Math.max.apply(Math, xValues);
            indicator.yRange.min = Math.min.apply(Math, values);
            indicator.yRange.max = Math.max.apply(Math, values);

            indicator.segment.push(trendSeries);


            this.calculateIndicatorRange(sender, indicator);



        }

    });
    ej.indicatorTypes.atr = ej.ejATR;

    ej.ejaccumulationDistribution = ejExtendClass(ej.EjIndicatorRender, {
        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};
            var adlPoints = [];
            var sum = 0;
            //calculating accumulation distribution line points 
            for (var i = 0; i < indicator._points.length; i++) {
                var close = indicator._points[i].close;

                var value = (((close - indicator._points[i].low) - (indicator._points[i].high - close)) / (indicator._points[i].high - indicator._points[i].low));
                sum += (isNaN(value) ? 0 : value) * indicator._points[i].volume;
                adlPoints[i] = sum;

            }
            var trendSeries = $.extend(true, {}, indicator);
            trendSeries.name = "trendseries";
            trendSeries.fill = indicator.fill;
            trendSeries.width = indicator.width;
            trendSeries.type = "line";

            //Binding the accumulation distribution array values to indicator y values
            for (var k = 0; k < indicator._points.length; k++) {

                indicator._points[k].YValues[0] = indicator._points[k].y = adlPoints[k];
            }

            trendSeries.points = $.extend(true, [], indicator._points);
            var xValues = sender._getXValues(trendSeries.points);
            var yValues = sender._getYValues(trendSeries.points);

            indicator.xRange.min = Math.min.apply(Math, xValues);
            indicator.xRange.max = Math.max.apply(Math, xValues);
            indicator.yRange.min = Math.min.apply(Math, yValues);
            indicator.yRange.max = Math.max.apply(Math, yValues);

            indicator.segment.push(trendSeries);
            //calculating indicator range
            this.calculateIndicatorRange(sender, indicator);


        }

    });
    ej.indicatorTypes.accumulationdistribution = ej.ejaccumulationDistribution;
    ej.ejTMA = ejExtendClass(ej.EjIndicatorRender, {
        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};

            // signalLine
            var trendSeries = $.extend(true, {}, indicator);
            trendSeries.name = "trendSeries";
            trendSeries.width = indicator.width;
            trendSeries.fill = indicator.fill;
            trendSeries.type = "line";

            //variable declaration
            var closevalues = [];
            var close_values = [];
            var smavalues = [];
            var tmavalues = [];
            var smaPoints = [];
            var trendPoints = [];
            var sum = 0;
            var sum1;
            var length = indicator._points.length;
            var period = indicator.period;
            if (period < 1) return;

            if (period < length) {
                //Push the values to closevalues array
                for (var i = 0; i < length; i++) {
                    closevalues.push(indicator._points[i].close);
                }
                //find the closevalues length
                var close_length = closevalues.length;

                //calculation for SMA values

                while (close_length >= period) {
                    sum = 0;
                    for (var j = 0; j < period; j++) {
                        sum = sum + closevalues[j];

                    }
                    sum = sum / period;
                    smavalues.push(parseFloat(sum.toFixed(2)));
                    closevalues.splice(0, 1);
                    close_length = closevalues.length;
                }
                //calculating sma values depend on period
                for (var k = 0; k < length; k++) {
                    if (k < period - 1) {
                        sum = 0;
                        for (var j = 0; j < k + 1; j++) {
                            sum = sum + indicator._points[j].close;

                        }
                        sum = sum / (k + 1);
                        smaPoints[k] = parseFloat(sum.toFixed(2));
                    }
                    else {
                        smaPoints[k] = smavalues[k - (period - 1)];
                    }

                }
                //find the smavalues count
                var sma_count = smaPoints.length;
                //calculating TMA values
                while (sma_count >= period) {
                    sum1 = 0;
                    for (var j = 0; j < period; j++) {
                        sum1 = sum1 + smaPoints[j];

                    }
                    sum1 = sum1 / period;
                    tmavalues.push(sum1);
                    smaPoints.splice(0, 1);
                    sma_count = smaPoints.length;
                }
                //set the TMA values to Y-Axis
                for (var k = 0; k < length; k++) {
                    if (k < period - 1) {
                        indicator._points[k].YValues[0] = indicator._points[k].y = null;

                    }
                    else {
                        indicator._points[k].YValues[0] = indicator._points[k].y = tmavalues[k - (period - 1)];

                    }

                }
                trendSeries.points = $.extend(true, [], indicator._points);
                var xValues = sender._getXValues(trendSeries.points);

                //Assign the Y-Axis values into trendPoints
                for (var i = period - 1, j = 0; i < trendSeries.points.length; i++ , j++) {
                    trendPoints[j] = trendSeries.points[i].y;
                }

                //X-Axis and Y-Axis range calculation
                indicator.xRange.min = Math.min.apply(Math, xValues);
                indicator.xRange.max = Math.max.apply(Math, xValues);
                indicator.yRange.min = Math.min.apply(Math, trendPoints);
                indicator.yRange.max = Math.max.apply(Math, trendPoints);

                //push trendSeries
                indicator.segment.push(trendSeries);
                this.calculateIndicatorRange(sender, indicator);


            }
        }
    });
    ej.indicatorTypes.tma = ej.ejTMA;

    ej.ejMomentum = ejExtendClass(ej.EjIndicatorRender, {
        calculateSegment: function (indicator, sender) {
            this.chartObj = sender;
            indicator.segment = [];
            indicator.xRange = {};
            indicator.yRange = {};

            //Upperband 
            var upperSeries = $.extend(true, {}, indicator);
            upperSeries.name = "upperseries";
            upperSeries.fill = indicator.upperLine.fill;
            upperSeries.width = indicator.upperLine.width;
            upperSeries.type = "line";

            var period = indicator.period;
            var pointsLength = indicator._points.length;

            if (period > 0 && period < pointsLength - 1) {  // to check period value is greater than 0 and it is less than pointslength
                for (var k = 0; k < pointsLength; k++) {
                    indicator._points[k].YValues.length = 1;
                    indicator._points[k].YValues[0] = indicator._points[k].y = 100;
                }

                upperSeries.points = $.extend(true, [], indicator._points);
                var xValues = sender._getXValues(upperSeries.points);
                var yValues = sender._getYValues(upperSeries.points);

                indicator.xRange.min = Math.min.apply(Math, xValues);
                indicator.xRange.max = Math.max.apply(Math, xValues);
                indicator.yRange.min = Math.min.apply(Math, yValues);
                indicator.yRange.max = Math.max.apply(Math, yValues);

                indicator.segment.push(upperSeries);

                // signalLine
                var trendSeries = $.extend(true, {}, indicator);
                trendSeries.name = "trendSeries";
                trendSeries.width = indicator.width;
                trendSeries.fill = indicator.fill;
                trendSeries.type = "line";

                var c = [];
                var len = indicator.period;      // period value

                for (var i = 0; i < indicator._points.length; ++i) {
                    var points = indicator._points;
                    if (!(i < len))                                       // calculate signal line points
                        indicator._points[i].YValues[0] = indicator._points[i].y = (points[i].close / (points[i - len].close) * 100);
                }

                for (var k = 0; k < len && k < indicator._points.length; k++) {
                    indicator._points[k].YValues[0] = indicator._points[k].y = null;
                }

                trendSeries.points = $.extend(true, [], indicator._points);
                xValues = sender._getXValues(trendSeries.points);
                var trendPoints = [];
                for (var i = len, j = 0; i < trendSeries.points.length; i++ , j++) {
                    trendPoints[j] = trendSeries.points[i].y;
                }

                indicator.xRange.min = Math.min(Math.min.apply(Math, xValues), indicator.xRange.min);
                indicator.xRange.max = Math.max(Math.max.apply(Math, xValues), indicator.xRange.max);
                indicator.yRange.min = Math.min(Math.min.apply(Math, trendPoints), indicator.yRange.min);
                indicator.yRange.max = Math.max(Math.max.apply(Math, trendPoints), indicator.yRange.max);

                indicator.segment.push(trendSeries);
                this.calculateIndicatorRange(sender, indicator);
            }
        }
    });

    ej.indicatorTypes.momentum = ej.ejMomentum;

    ej.EjSeriesRender.prototype = {

        getOrigin: function (chart, options, params) {
            if (params.axes[options.xAxis.name]._validCross) {
                var crossAxis = chart.chartObj._getCrossAxis(chart.chartObj.model._axes, true, options.xAxis.crossesInAxis);
                if ((chart.chartObj.model.requireInvertedAxes ? options.xAxis.name : options.yAxis.name === crossAxis.name))
                    return options.xAxis._crossValue;
            }
            return Math.max(options.yAxis.visibleRange.min, 0);
        },

        setLineSeriesStyle: function (currentSeries) {

            var seriesIndex = $.inArray(currentSeries, this.chartObj.model._visibleSeries);
            var serColor = this.chartObj.model.seriesColors[seriesIndex], seriesInterior;

            if (!currentSeries.isTransposed)
                seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(currentSeries) + seriesIndex, serColor, 0, 0, 0, 100, this.chartObj.gSeriesEle);
            else
                seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(currentSeries) + seriesIndex, serColor, 100, 0, 0, 0, this.chartObj.gSeriesEle);
            var seriesBorder = this.chartObj.model.seriesBorderColors[seriesIndex];
            return { SeriesInterior: seriesInterior, SeriesBorder: seriesBorder };

        },
        getSeriesName: function (series) {
            var serName;
            if (series.name)
                serName = series.name.replace(/\s/g, '');
            else
                serName = "series";

            return serName;
        },

        drawAreaPath: function (series, style, direction, canvasTranslate) {
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes,
                seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries),
                translate = null, areaType = this.chartObj.model.AreaType, seriesBorder = series.border;
            if (areaType == "cartesianaxes") {
                var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);
                translate = 'translate(' + trans.x + ',' + trans.y + ')'
            }
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': translate };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            if (direction != "") {
                var options = {
                    'id': this.chartObj.svgObject.id + "_Series" + seriesIndex,
                    'fill': style.SeriesInterior,
                    'fill-opacity': series.opacity,
                    'stroke-width': seriesBorder.width,
                    'stroke': seriesBorder.color,
                    'stroke-dasharray': seriesBorder.dashArray,
                    'stroke-linecap': series.lineCap,
                    'stroke-linejoin': series.lineJoin,
                    'd': direction
                };
                if (this.chartObj.dragPoint) {
                    options.id = this.chartObj.svgObject.id + "_PreviewSeries" + seriesIndex;
                    options['fill-opacity'] = 0.6;
                    if (this.chartObj.model.enableCanvasRendering) this.chartObj.svgRenderer.drawPath(options, this.chartObj.canvasElement, canvasTranslate);
                    else this.chartObj.svgRenderer.drawPath(options, this.chartObj.gPreviewSeriesGroupEle, canvasTranslate);
                }
                else
                    this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle, canvasTranslate);
            }
        },

        setAreaSeriesStyle: function (series) {

            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var serColor = this.chartObj.model.seriesColors[seriesIndex], seriesInterior;

            if (!series.isTransposed)
                seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(series) + seriesIndex, serColor, 0, 0, 0, 100, this.chartObj.gSeriesEle);
            else
                seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(series) + seriesIndex, serColor, 100, 0, 0, 0, this.chartObj.gSeriesEle);
            return { SeriesInterior: seriesInterior };

        },





        naturalSpline: function (points, series) {
            var count = points.length, dx = [], dy = [], slope = [];
            var ySpline = [], ySplineDuplicate = [];
            var cardinalSplineTension = ej.util.isNullOrUndefined(series.cardinalSplineTension) ? 0.5 : series.cardinalSplineTension < 0 ? 0 : series.cardinalSplineTension > 1 ? 1 : series.cardinalSplineTension;
            if (series.splineType == "monotonic") {
                for (var i = 0; i < count - 1; i++) {
                    //slope calculation                
                    dx[i] = points[i + 1].xValue - points[i].xValue;
                    dy[i] = points[i + 1].YValues[0] - points[i].YValues[0];
                    slope[i] = dy[i] / dx[i];
                }
                //interpolant points
                var slopeLength = slope.length, interPoint;
                // to find the first and last co-efficient value
                ySpline[0] = slope[0];
                ySpline[count - 1] = slope[slopeLength - 1];

                //to find the other co-efficient values
                for (var j = 0; j < dx.length; j++) {
                    if (slopeLength > j + 1) {
                        if (slope[j] * slope[j + 1] <= 0)
                            ySpline[j + 1] = 0;
                        else {
                            interPoint = dx[j] + dx[j + 1];
                            ySpline[j + 1] = 3 * interPoint / ((interPoint + dx[j + 1]) / slope[j] + (interPoint + dx[j]) / slope[j + 1]);
                        }

                    }
                }
            }
            else if (series.splineType == "cardinal") {
                for (var i = 0; i < count; i++) {
                    if (i == 0)
                        ySpline[i] = (count > 2) ? (cardinalSplineTension * (points[i + 2].xValue - points[i].xValue)) : 0;
                    else if (i == (count - 1))
                        ySpline[i] = (count > 2) ? (cardinalSplineTension * (points[count - 1].xValue - points[count - 3].xValue)) : 0;
                    else
                        ySpline[i] = (cardinalSplineTension * (points[i + 1].xValue - points[i - 1].xValue));
                }


            }
            else {
                var yIndex = 0, a = 6;
                if (series.splineType == "clamped") {
                    // calculating the first and last index value for clamped spline series type					
                    var firstIndex = (points[1].xValue - points[0].xValue) / (points[1].YValues[yIndex] - points[0].YValues[yIndex]);
                    var lastIndex = (points[count - 1].xValue - points[count - 2].xValue) / (points[count - 1].YValues[yIndex] - points[count - 2].YValues[yIndex]);
                    ySpline[0] = (3 * (points[1].YValues[yIndex] - points[0].YValues[yIndex])) / (points[1].xValue - points[0].xValue) - 3 * firstIndex;
                    ySplineDuplicate[0] = 0.5;
                    ySpline[points.length - 1] = 3 * lastIndex - (3 * (points[points.length - 1].YValues[yIndex] - points[points.length - 2].YValues[yIndex])) / (points[points.length - 1].xValue - points[points.length - 2].xValue);
                    ySpline[0] = Math.abs(ySpline[0]) == "Infinity" ? 0 : ySpline[0];
                    ySpline[points.length - 1] = Math.abs(ySpline[points.length - 1]) == "Infinity" ? 0 : ySpline[points.length - 1];
                }
                else {
                    // assigning the first and last value as zero
                    ySpline[0] = ySplineDuplicate[0] = 0;
                    ySpline[points.length - 1] = 0;
                }

                for (var i = 1; i < count - 1; i++) {
                    var d1 = points[i].xValue - points[i - 1].xValue;
                    var d2 = points[i + 1].xValue - points[i - 1].xValue;
                    var d3 = points[i + 1].xValue - points[i].xValue;
                    var dy1 = points[i + 1].YValues[yIndex] - points[i].YValues[yIndex] || null;
                    var dy2 = points[i].YValues[yIndex] - points[i - 1].YValues[yIndex] || null;

                    if (d1 == 0 || d2 == 0 || d3 == 0) {
                        ySpline[i] = 0;
                        ySplineDuplicate[i] = 0;
                    }
                    else {
                        var p = 1 / (d1 * ySpline[i - 1] + 2 * d2);

                        ySpline[i] = -p * d3;
                        ySplineDuplicate[i] = p * (a * (dy1 / d3 - dy2 / d1) - d1 * ySplineDuplicate[i - 1]);
                    }
                }

                for (var k = count - 2; k >= 0; k--)
                    ySpline[k] = ySpline[k] * ySpline[k + 1] + ySplineDuplicate[k];

            }
            return ySpline;

        },

        getDaysInMonth: function (month, year) {
            return new Date(year, month + 1, 0).getDate();
        },

        getBezierControlPoints: function (point1, point2, ySpline1, ySpline2, yIndex, series, chart) {
            var controlPoint1;
            var controlPoint2;
            var yDuplicate1, yDuplicate2;
            var oneDay = 24 * 60 * 60 * 1000;
            var xPoint = new Date(point1.xValue);
            var haxesCount = chart.chartObj.model.hAxes.length;
            var seriesIndex = $.inArray(series, chart.chartObj.model._visibleSeries);
            var j = (seriesIndex != haxesCount && seriesIndex < haxesCount) ? seriesIndex : 0;
            if (series.splineType == "cardinal") {
                if (ej.util.isNullOrUndefined(chart.chartObj.model.hAxes[j].intervalType) || chart.chartObj.model.hAxes[j].intervalType.toLowerCase() == "years" || chart.chartObj.model.hAxes[j].intervalType.toLowerCase() == "auto") {

                    var year = new Date(xPoint.getFullYear());
                    var yearValue = (year % 4 == 0 && (year % 100 == 0 || year % 400 != 0)) ? 366 : 365;
                    yDuplicate1 = (ySpline1 / (oneDay * yearValue));
                    yDuplicate2 = (ySpline2 / (oneDay * yearValue));

                }
                else if (chart.chartObj.model.hAxes[j].intervalType.toLowerCase() == "months") {
                    var dateObj = new Date(xPoint);
                    var year = dateObj.getFullYear();
                    var month = dateObj.getMonth();
                    var CountDays = ej.EjSeriesRender.prototype.getDaysInMonth(month, year);
                    yDuplicate1 = (ySpline1 / (oneDay * CountDays));
                    yDuplicate2 = (ySpline2 / (oneDay * CountDays));
                }
                else {
                    yDuplicate1 = ySpline1;
                    yDuplicate2 = ySpline2;
                }

                controlPoint1 = { xValue: (point1.xValue + ySpline1 / 3), YValues: [point1.YValues[0] + yDuplicate1 / 3] };
                controlPoint2 = { xValue: (point2.xValue - ySpline2 / 3), YValues: [point2.YValues[0] - yDuplicate2 / 3] };
            }
            else if (series.splineType == "monotonic") {
                var value = (point2.xValue - point1.xValue) / 3;
                controlPoint1 = { xValue: point1.xValue + value, YValues: [point1.YValues[0] + ySpline1 * value] };
                controlPoint2 = { xValue: point2.xValue - value, YValues: [point2.YValues[0] - ySpline2 * value] };
            }
            else {
                var one3 = 1 / 3.0;
                var deltaX2 = (point2.xValue - point1.xValue);

                deltaX2 = deltaX2 * deltaX2;

                var dx1 = 2 * parseFloat(point1.xValue) + parseFloat(point2.xValue);
                var dx2 = parseFloat(point1.xValue) + 2 * parseFloat(point2.xValue);

                var dy1 = 2 * point1.YValues[yIndex] + point2.YValues[yIndex];
                var dy2 = point1.YValues[yIndex] + 2 * point2.YValues[yIndex];

                var y1 = one3 * (dy1 - one3 * deltaX2 * (ySpline1 + 0.5 * ySpline2));
                var y2 = one3 * (dy2 - one3 * deltaX2 * (0.5 * ySpline1 + ySpline2));

                controlPoint1 = { xValue: dx1 * one3, YValues: [y1] };
                controlPoint2 = { xValue: dx2 * one3, YValues: [y2] };
            }
            return { controlPoint1: controlPoint1, controlPoint2: controlPoint2 };


        },

        improveChartPerformance: function (chartSeries) {
            var tempPoints = [],
                seriesPoints = chartSeries.pointCollection && chartSeries.dragPoint ? chartSeries.pointCollection : chartSeries.points,
                AreaBounds = this.chartObj.model.m_AreaBounds,
                emptyPoints,
                emptyPointsCount = 0,
                xTolerance = chartSeries.xAxis.visibleRange.delta / AreaBounds.Width,
                yTolerance = chartSeries.yAxis.visibleRange.delta / AreaBounds.Height,
                prevXValue = (seriesPoints[0] && seriesPoints[0].xValue > xTolerance) ? 0 : xTolerance,
                prevYValue = (seriesPoints[0] && seriesPoints[0].y > yTolerance) ? 0 : yTolerance,
                xVal = 0, yVal = 0, isEmpty, point, xDiff, yDiff,
                currentPointsLenght = seriesPoints.length,
                markerCount = 0, dataLabelCount = 0, sorted = true,
                count = 0, minPoint = currentPointsLenght > 0 && seriesPoints[0].xValue;

            for (var k = 0; k < currentPointsLenght; k++) {
                point = seriesPoints[k];
                xVal = point.xValue;
                yVal = point.YValues[0];
                (point.fill) && (chartSeries.pointFill = true);
                if (sorted && xVal != minPoint) {
                    sorted = minPoint < xVal;
                    minPoint = xVal;
                }
                (point.isEmpty || xVal == null || yVal == null || xVal !== xVal || yVal !== yVal || isNaN(xVal) || isNaN(yVal)) && (point.isEmpty = true);
                (xVal == null) && (point.xValue = chartSeries.xAxis.visibleRange.min);
                (yVal == null) && (point.YValues[0] = chartSeries.yAxis.visibleRange.min);
                (point.marker && point.marker.visible) && (markerCount++);
                (point.marker && point.marker.dataLabel && point.marker.dataLabel.visible) && (dataLabelCount++);
                point.isEmpty && emptyPointsCount++;
                xDiff = xVal - prevXValue;
                yDiff = yVal - prevYValue;
                if ((xDiff >= xTolerance || -xDiff >= xTolerance) || yDiff >= yTolerance || -yDiff >= yTolerance) {
                    point.visible = !point.isEmpty ? true : (point.visible || false);
                    tempPoints[count++] = point;
                    (xVal === xVal) && (prevXValue = xVal);
                    (yVal === yVal) && (prevYValue = yVal);
                }
            }
            sorted && (chartSeries._sorted = sorted);
            chartSeries._pointMarker = markerCount;
            chartSeries._dataLabels = dataLabelCount;
            return ((emptyPointsCount == 0 && (chartSeries.marker && !chartSeries.marker.dataLabel.visible)) ? tempPoints : this._calculateEmptyPoints(chartSeries, tempPoints));
        },
        _isVisiblePoints: function (chartSeries) {
            var points = chartSeries.pointCollection && chartSeries.dragPoint ? chartSeries.pointCollection : chartSeries.points,
                emptyPoints,
                isEmpty,
                checkNull = ej.util.isNullOrUndefined,
                length = points.length;
            for (var k = 0; k < length; k++) {
                isEmpty = (checkNull(points[k].isEmpty)) ? false : points[k].isEmpty;
                points[k].visible = (checkNull(points[k].visible)) ? true : points[k].visible;
                if (checkNull(points[k].xValue)) {
                    points[k].isEmpty = true;
                    points[k].visible = false;
                    points[k].xValue = chartSeries.xAxis ? chartSeries.xAxis.visibleRange.min : null;
                } else
                    points[k].isEmpty = isEmpty;

                if ((typeof points[k].YValues[0] != "object" && isNaN(points[k].YValues[0]) || points[k].YValues[0] == null || points[k].YValues[0] == 'undefined') ||
                    (!chartSeries.isIndicator && (chartSeries._hiloTypes && (isNaN(points[k].YValues[1]) || points[k].YValues[1] == undefined || points[k].YValues[1] == null)))) {
                    points[k].isEmpty = true;
                    points[k].visible = false;
                } else {
                    points[k].isEmpty = points[k].isEmpty;
                    points[k].visible = (points[k].isEmpty) ? !points[k].isEmpty : points[k].visible;
                }
                if (!checkNull(points[k].x)) {
                    if (jQuery.type(points[k].xValue) == "date")
                        points[k].xValue = (points[k].xValue).getTime();
                }
            }
            if (chartSeries.emptyPointSettings)
                emptyPoints = this._calculateEmptyPoints(chartSeries, points);
            else
                emptyPoints = points;

            if (chartSeries.type.toLowerCase() == "waterfall")
                this.chartObj.calculateWaterfallSeriesPoints(emptyPoints);

            chartSeries._visiblePoints = emptyPoints;

            return emptyPoints;

        },

        _calculateEmptyPoints: function (series, points, chartObj) {
            var currentPoints;
            var emptyPoints = series.emptyPointSettings,
                style = emptyPoints.style,
                fill = style.color,
                checkNull = ej.util.isNullOrUndefined,
                borderColor = style.border.color,
                borderWidth = style.border.width,
                mode = emptyPoints.displayMode.toLowerCase(),
                emptyPointsVisible = emptyPoints.visible,
                length = points.length,
                point,
                xPoints = [],
                visiblePoints = [];
            currentPoints = $.extend(true, {}, points, currentPoints);
            var seriesType = series.type.toLowerCase();
            currentPoints.length = points.length;
            mode = (seriesType == "boxandwhisker") ? "gap" : mode;
            if (emptyPointsVisible) {
                if (mode != 'gap') {
                    for (var i = 0; i < length; i++) {
                        currentPoints[i].actualIndex = checkNull(chartObj) ? i : (chartObj.model._isPieOfPie ? currentPoints[i].actualIndex : i);
                        point = currentPoints[i];
                        if ((point.isEmpty) && (!checkNull(point.x) || series._xAxisValueType == "string")) {
                            if (fill != '')
                                point.fill = fill;
                            if (borderColor != '') {
                                point.border = point.border ? point.border : {};
                                point.border.color = borderColor;
                                point.border.width = borderWidth;
                            }
                            switch (mode) {
                                case 'average':
                                    if (series._hiloTypes) {
                                        $.each(point.YValues, function (index, value) {
                                            value = ((currentPoints[i - 1] ? currentPoints[i - 1].YValues[index] : 0) + (currentPoints[i + 1] ? (currentPoints[i + 1].isEmpty ? 0 : currentPoints[i + 1].YValues[index]) : 0)) / 2
                                            point.YValues[index] = value;
                                            ej.EjSeriesRender.prototype._sethlocPoint(index, point, value);
                                        })
                                    } else {
                                        value = ((currentPoints[i - 1] ? currentPoints[i - 1].y : 0) + (currentPoints[i + 1] ? (currentPoints[i + 1].isEmpty ? 0 : currentPoints[i + 1].y) : 0)) / 2;
                                        point.YValues[0] = value;
                                        point.y = value;
                                    }
                                    break;
                                case 'zero':
                                    if (series._hiloTypes) {
                                        $.each(point.YValues, function (index, value) {
                                            point.y = 0;
                                            point.YValues[index] = 0;
                                            ej.EjSeriesRender.prototype._sethlocPoint(index, point, 0);
                                        })
                                    } else {
                                        var yvalue = seriesType.indexOf("stackingspline") != -1 ? currentPoints[i].YValues[0] : 0;
                                        point.YValues[0] = yvalue;
                                        point.y = yvalue;
                                    }
                                    break;
                            }
                            point.isEmpty = false;
                            point.visible = true;
                            visiblePoints.push(point);
                        } else {
                            if (!checkNull(currentPoints[i].x) || series._xAxisValueType == "string")
                                visiblePoints.push(point);
                        }
                    }
                } else {
                    for (var i = 0; i < length; i++) {
                        currentPoints[i].actualIndex = checkNull(chartObj) ? i : (chartObj.model._isPieOfPie ? currentPoints[i].actualIndex : i);
                        visiblePoints[i] = (currentPoints[i]);
                    }
                }
            } else {
                for (var i = 0; i < length; i++) {
                    currentPoints[i].actualIndex = i;
                    if (currentPoints[i].visible)
                        visiblePoints.push(currentPoints[i]);
                }
            }

            return visiblePoints;

        },

        _sethlocPoint: function (index, point, value) {
            switch (index) {
                case 0:
                    point.high = value;
                    break;
                case 1:
                    point.low = value;
                    break;
                case 2:
                    point.open = value;
                    break;
                case 3:
                    point.close = value;
                    break;
            }
        },

        _calculatePolarAxesSegment: function (currentseries) {

            var points = currentseries._visiblePoints;
            var segment = ej.EjSvgRender.utils._getStringBuilder();
            var SeriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries)
            var size;
            var interval;
            var centerX = this.chartObj.model.centerX;
            var centerY = this.chartObj.model.centerY;
            // calculating side by side info.
            var sideInfo = this._getSeriesPosition(currentseries);
            var drawType = currentseries.drawType.toLowerCase();
            spDirection = "",
                splinesb = ej.EjSvgRender.utils._getStringBuilder(),
                style = this.setLineSeriesStyle(currentseries),
                yIndex = 0,
                firstPoint = null,
                secondPoint = null,
                firstIndex = -1, controlPointsCount = 0,
                controlPoint1 = null,
                controlPoint2 = null,
                data = null,
                bpt1 = null,
                bpt2 = null,
                chartObj = this.chartObj;
            size = $.extend(true, {}, currentseries.marker.size, size);
            if (size.width <= 10) {
                size.width = size.height = (1.5 * this.chartObj.model.elementSpacing);
            }
            if (currentseries.drawType.toLowerCase() == 'column' || currentseries.drawType.toLowerCase() == 'rangecolumn') {

                var innerRadius = 0;
                var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + SeriesIndex };
                this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
                var interval = currentseries.xAxis.visibleRange.interval;
                currentseries.xAxis.labelPlacement = !(currentseries.xAxis.labelPlacement) ? "betweenticks" : currentseries.xAxis.labelPlacement;
                var ticks = 0, temp, point;
                if (currentseries.xAxis._valueType != "category" || (currentseries.xAxis._valueType == "category" && currentseries.xAxis.labelPlacement == "onticks"))
                    ticks = interval / 2;
                var inversed = (currentseries.xAxis.isInversed) ? 0 : 1;
                interval = interval / sideInfo.all;
                var nextPoint = interval;
                var visiblePoints = currentseries._visiblePoints;
                var length = visiblePoints.length;
                // calculation for start and end angle for each positions.
                for (var l = 0; l < length; l++) {
                    var itemCurrentXPos = temp = (visiblePoints[l].xValue - currentseries.xAxis.visibleRange.min) + ((interval) * sideInfo.pos - ticks);
                    itemCurrentXPos = (itemCurrentXPos) / this.chartObj.model.sumofYValues;
                    point = visiblePoints[l];

                    var nextPoint = (currentseries.xAxis.visibleRange.interval) / sideInfo.all;
                    point.startAngle = 2 * Math.PI * itemCurrentXPos;
                    point.endAngle = 2 * Math.PI * (itemCurrentXPos + ((nextPoint) / this.chartObj.model.sumofYValues));
                }
                if (!visiblePoints[visiblePoints.length - 1].startAngle) {
                    visiblePoints[visiblePoints.length - 1].startAngle = visiblePoints[0].startAngle;
                    visiblePoints[visiblePoints.length - 1].endAngle = visiblePoints[0].endAngle;
                }
            }
            var gap = false;
            for (var i = 0; i < points.length; i++) {
                var point1;
                var point2;

                // drawType 'Scatter' calculation
                if (drawType == 'scatter') {
                    point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, points[i].y, this.chartObj);
                    this.drawSymbol(SeriesIndex, currentseries, i, point1.X, point1.Y);
                }

                // drawType 'Line' calculation
                else if (currentseries.drawType.toLowerCase() == 'line') {
                    point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, points[i].y, this.chartObj);

                    if (i < points.length - 1 && points[i + 1].visible) {
                        point2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i + 1].xValue, points[i + 1].y, this.chartObj);
                        segment.append("M" + " " + (point1.X) + " " + (point1.Y) + " " + "L" + " " + (point2.X) + " " + (point2.Y) + " ");
                    }
                    // when isClosed is true
                    else if (i == points.length - 1) {
                        if (currentseries.isClosed) {
                            point2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[0].xValue, points[0].y, this.chartObj);
                            segment.append("M" + " " + (point1.X) + " " + (point1.Y) + " " + "L" + " " + (point2.X) + " " + (point2.Y) + " ");
                        }
                    }
                }

                else if (currentseries.drawType.toLowerCase() == 'column') {
                    var interval = currentseries.xAxis.visibleRange.interval;
                    var inversed = (currentseries.xAxis.isInversed) ? 0 : 1;
                    var interval = interval / sideInfo.all;
                    // radius for each point based on the y values.
                    var radius = this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, points[i].y);

                    var chartStartAngle = -.5 * Math.PI;
                    var startAngle = points[i].startAngle + chartStartAngle;
                    var endAngle = points[i].endAngle + chartStartAngle - 0.000001;

                    var x1, y1, x2, y2, direction;

                    // calculating arc when the Stacking mode is enabled

                    if (currentseries.isStacking) {
                        var startValue = currentseries.stackedValue.StartValues[i];
                        var endValue = currentseries.stackedValue.EndValues[i];
                        radius = ((startValue == endValue) ? 0 : (this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, endValue)));

                        x1 = centerX + radius * Math.cos(startAngle);
                        y1 = centerY + radius * Math.sin(startAngle);

                        x2 = centerX + radius * Math.cos(endAngle);
                        y2 = centerY + radius * Math.sin(endAngle);

                        innerRadius = this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, (startValue == 0 && currentseries.yAxis.visibleRange.min != 0) ? currentseries.yAxis.visibleRange.min : startValue);

                        var dStartX = centerX + innerRadius * Math.cos(startAngle);
                        var dStartY = centerY + innerRadius * Math.sin(startAngle);

                        var dEndX = centerX + innerRadius * Math.cos(endAngle);
                        var dEndY = centerY + innerRadius * Math.sin(endAngle);
                        if (this.chartObj.model.isPolar)
                            direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + "0" + " " + inversed + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "A" + " " + innerRadius + " " + innerRadius + " " + "1" + " " + "0" + " " + "0" + " " + dStartX + " " + dStartY + " " + "z";
                        else
                            direction = "M" + " " + x1 + " " + y1 + " " + "L" + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "L" + " " + dStartX + " " + dStartY + " " + "z";
                    }
                    // calculating arc for normal mode.
                    else {

                        x1 = centerX + radius * Math.cos(startAngle);
                        y1 = centerY + radius * Math.sin(startAngle);

                        x2 = centerX + radius * Math.cos(endAngle);
                        y2 = centerY + radius * Math.sin(endAngle);
                        if (this.chartObj.model.isPolar)
                            direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + "0" + " " + inversed + " " + x2 + " " + y2 + " " + "L" + " " + centerX + " " + centerY + " " + "z";
                        else
                            direction = "M" + " " + x1 + " " + y1 + " " + "L" + " " + x2 + " " + y2 + " " + "L" + " " + centerX + " " + centerY + " " + "z";
                    }

                    // gradient creation
                    var seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(currentseries) + "_" + SeriesIndex + i, this.chartObj.model.seriesColors[SeriesIndex], 0, 0, 0, 100, this.chartObj.gSeriesEle),
                        seriesBorder = currentseries.border;
                    var options = {
                        'id': this.chartObj.svgObject.id + "_Series" + SeriesIndex + "_Point" + i,
                        'fill': seriesInterior,
                        'stroke': seriesBorder.color,
                        'stroke-dasharray': seriesBorder.dashArray,
                        'stroke-width': seriesBorder.width,

                        'opacity': currentseries.opacity,
                        'pointIndex': i,
                        'd': direction,
                        'start': points[i].startAngle - 1.57,
                        'end': points[i].endAngle - 1.57,
                        'radius': radius,
                        'innerR': innerRadius
                    };
                    if (this.chartObj.model.isPolar) {
                        options.x = centerX;
                        options.y = centerY;
                        bounds = { PointIndex: i, StartAngle: points[i].startAngle, EndAngle: points[i].endAngle, CenterX: centerX, CenterY: centerY, Radius: radius, DRadius: innerRadius };
                    }
                    if (currentseries.type == "radar") {
                        var line1 = { x: centerX, y: centerY };
                        var line2 = { x: x1, y: y1 };
                        var line3 = { x: x2, y: y2 };
                        bounds = { PointIndex: i, Line1: line1, Line2: line2, Line3: line3 };
                        var hasStackingInnerRadius = innerRadius ? true : false;
                        options.hasStackingInnerRadius = hasStackingInnerRadius;
                    }
                    point = currentseries._visiblePoints[i];
                    if ((!ej.util.isNullOrUndefined(currentseries.marker) && currentseries.marker.visible) || (!ej.util.isNullOrUndefined(currentseries.marker) && currentseries.marker.dataLabel.visible))
                        point.symbolLocation = { X: ((x1 + x2) / 2), Y: ((y1 + y2) / 2) };

                    this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);

                }
                else if (drawType == 'spline') {
                    visiblePoints = this.chartObj.dragPoint ? series.pointCollection : this._isVisiblePoints(currentseries),
                        point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, points[i].y, this.chartObj);
                    if (i < points.length - 1 && points[i + 1].visible) {
                        point2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i + 1].xValue, points[i + 1].y, this.chartObj);
                        ySpline = this.naturalSpline(points, currentseries),
                            pointIndex = firstIndex = i;
                        firstPoint = visiblePoints[i];
                        secondPoint = visiblePoints[i + 1];
                        data = this.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, currentseries, this);
                        controlPoint1 = (data["controlPoint1"]);
                        controlPoint2 = (data["controlPoint2"]);
                        bpt1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, controlPoint1.xValue, controlPoint1.YValues, chartObj);
                        bpt2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, controlPoint2.xValue, controlPoint2.YValues, chartObj);
                        segment.append("M" + " " + (point1.X) + " " + (point1.Y) + " " + "C" + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (point2.X) + " " + (point2.Y) + " ")
                        if (currentseries.isClosed) {
                            if (i == points.length - 1) {
                                if (point1 != null) {
                                    point3 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[0].xValue, points[0].y, chartObj);
                                    firstPoint = visiblePoints[visiblePoints.length - 1];
                                    secondPoint = visiblePoints[0];
                                    pointIndex = firstIndex = 0;
                                    data = this.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, currentseries, this);
                                    controlPoint1 = (data["controlPoint1"]);
                                    controlPoint2 = (data["controlPoint2"]);
                                    bpt1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, controlPoint1.xValue, controlPoint1.YValues, chartObj);
                                    bpt2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, controlPoint2.xValue, controlPoint2.YValues, chartObj);
                                    segment.append("M" + " " + (point2.X) + " " + (point2.Y) + " " + "C" + " " + (bpt1.X + chartObj.canvasX) + " " + (bpt1.Y + chartObj.canvasY) + " " + (bpt2.X + chartObj.canvasX) + " " + (bpt2.Y + chartObj.canvasY) + " " + (point3.X) + " " + (point3.Y) + " ");
                                }
                            }
                        }
                    }
                }

                else if (currentseries.drawType.toLowerCase() == 'rangecolumn') {
                    var interval = currentseries.xAxis.visibleRange.interval;
                    var inversed = (currentseries.xAxis.isInversed) ? 0 : 1;
                    var interval = interval / sideInfo.all;
                    var chartStartAngle = -.5 * Math.PI;
                    var startAngle = points[i].startAngle + chartStartAngle;
                    var endAngle = points[i].endAngle + chartStartAngle - 0.000001;
                    var x1, y1, x2, y2, direction;
                    var startValue = points[i].YValues[1];
                    var endValue = points[i].YValues[0];
                    radius = ((startValue == endValue) ? 0 : (this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, endValue)));
                    x1 = centerX + radius * Math.cos(startAngle);
                    y1 = centerY + radius * Math.sin(startAngle);
                    x2 = centerX + radius * Math.cos(endAngle);
                    y2 = centerY + radius * Math.sin(endAngle);
                    innerRadius = this.chartObj.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(currentseries.yAxis, (startValue == 0 && currentseries.yAxis.visibleRange.min != 0) ? currentseries.yAxis.visibleRange.min : startValue);
                    var dStartX = centerX + innerRadius * Math.cos(startAngle);
                    var dStartY = centerY + innerRadius * Math.sin(startAngle);
                    var dEndX = centerX + innerRadius * Math.cos(endAngle);
                    var dEndY = centerY + innerRadius * Math.sin(endAngle);
                    if (this.chartObj.model.isPolar)
                        direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + "0" + " " + inversed + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "A" + " " + innerRadius + " " + innerRadius + " " + "1" + " " + "0" + " " + "0" + " " + dStartX + " " + dStartY + " " + "z";
                    else
                        direction = "M" + " " + x1 + " " + y1 + " " + "L" + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "L" + " " + dStartX + " " + dStartY + " " + "z";
                    var seriesInterior = this.chartObj.svgRenderer.createGradientElement(this.getSeriesName(currentseries) + "_" + SeriesIndex + i, this.chartObj.model.seriesColors[SeriesIndex], 0, 0, 0, 100, this.chartObj.gSeriesEle),
                        seriesBorder = currentseries.border;
                    var options = {
                        'id': this.chartObj.svgObject.id + "_Series" + SeriesIndex + "_Point" + i,
                        'fill': seriesInterior,
                        'stroke': seriesBorder.color,
                        'stroke-dasharray': seriesBorder.dashArray,
                        'stroke-width': seriesBorder.width,
                        'opacity': currentseries.opacity,
                        'pointIndex': i,
                        'd': direction,
                        'start': points[i].startAngle - 1.57,
                        'end': points[i].endAngle - 1.57,
                        'radius': radius,
                        'innerR': innerRadius
                    };
                    if (this.chartObj.model.isPolar) {
                        options.x = centerX;
                        options.y = centerY;
                        bounds = { PointIndex: i, StartAngle: points[i].startAngle, EndAngle: points[i].endAngle, CenterX: centerX, CenterY: centerY, Radius: radius, DRadius: innerRadius };
                    }

                    if (currentseries.type == "radar") {
                        var line1 = { x: dEndX, y: dEndY };
                        var line2 = { x: x1, y: y1 };
                        var line3 = { x: x2, y: y2 };
                        var line4 = { x: dStartX, y: dStartY };
                        bounds = { PointIndex: i, Line1: line1, Line2: line2, Line3: line3, Line4: line4 };
                        var hasStackingInnerRadius = innerRadius ? true : false;
                        options.hasStackingInnerRadius = hasStackingInnerRadius;
                    }
                    point = currentseries._visiblePoints[i];
                    if ((!ej.util.isNullOrUndefined(currentseries.marker) && currentseries.marker.visible) || (!ej.util.isNullOrUndefined(currentseries.marker) || currentseries.marker.dataLabel.visible)) {
                        point.symbolLocation = { X: ((x1 + x2) / 2), Y: ((y1 + y2) / 2) };
                        this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);
                    }
                }

                // drawType 'Area' calculation
                else {
                    if (currentseries.isStacking) {
                        startValue = currentseries.stackedValue.StartValues[i];
                        endValue = currentseries.stackedValue.EndValues[i];
                        if (i == 0) {
                            point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, endValue, this.chartObj);
                            for (j = points.length - 1; j >= 0; j--) {
                                startValue = currentseries.stackedValue.StartValues[j];
                                points[j].y = Math.max(currentseries.yAxis.actualRange.min, startValue);
                                //points[j].y=startValue;
                                point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[j].xValue, points[j].y, this.chartObj);
                                text = (j == points.length - 1) ? "M" : "L"
                                segment.append("" + text + "" + " " + (point1.X) + " " + (point1.Y) + " ");
                            }
                        }
                        if (i <= points.length - 1) {
                            points[i].y = endValue;
                            point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, points[i].y, this.chartObj);
                            segment.append("L" + " " + (point1.X) + " " + (point1.Y) + " ");
                            if (i == points.length - 1) {
                                if (currentseries.isClosed) {
                                    point2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[0].xValue, currentseries.stackedValue.EndValues[0], this.chartObj);
                                    point3 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[0].xValue, currentseries.stackedValue.StartValues[0], this.chartObj);
                                    point4 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, currentseries.stackedValue.StartValues[i], this.chartObj);
                                    segment.append("L" + " " + (point2.X) + " " + (point2.Y) + " " + " L" + " " + (point3.X) + " " + (point3.Y) + " " + " L" + " " + (point4.X) + " " + (point4.Y) + " " + " L" + " " + (point3.X) + " " + (point3.Y) + " " + "z ");
                                }
                                else
                                    segment.append("L" + " " + (centerX) + " " + (centerY) + " ");
                            }
                        }
                    }
                    else {
                        point1 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[i].xValue, points[i].y, this.chartObj);
                        if (i == 0 || gap) {
                            segment.append("M" + " " + (point1.X) + " " + (point1.Y) + " ");
                        }
                        // when isClosed is enabled
                        else if (i == points.length - 1) {
                            if (!currentseries.isClosed) {
                                segment.append("L" + " " + (point1.X) + " " + (point1.Y) + " " + "L" + " " + (centerX) + " " + (centerY));
                            }
                            else {
                                point2 = ej.EjSvgRender.utils.TransformToVisible(currentseries, points[0].xValue, points[0].y, this.chartObj);
                                segment.append("L" + " " + (point1.X) + " " + (point1.Y) + " " + "z");
                            }
                        }

                        else {
                            if (points[i + 1].visible)
                                segment.append("L" + " " + (point1.X) + " " + (point1.Y) + " ");
                            else
                                segment.append("L" + " " + (point1.X) + " " + (point1.Y) + " " + "L" + " " + (centerX) + " " + (centerY) + " " + "z");
                        }
                        if (points[i + 1] && points[i + 1].visible)
                            gap = false;
                        else
                            gap = true;
                    }
                }
                if (!currentseries.regionAdded && currentseries.drawType.toLowerCase() != 'column' && (currentseries.drawType.toLowerCase() != 'rangecolumn')) {
                    var bounds = { X: point1.X - size.width / 2, Y: point1.Y - size.height / 2, Width: size.width, Height: size.height };
                    ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, currentseries, points[i], i);
                }
                if (!currentseries.regionAdded && currentseries.drawType.toLowerCase() == 'column' && this.chartObj.model.enableCanvasRendering || (currentseries.drawType.toLowerCase() == 'rangecolumn' && this.chartObj.model.enableCanvasRendering))
                    ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, currentseries, null, null);

            }

            if (!currentseries.regionAdded && currentseries.drawType.toLowerCase() == 'column' && !this.chartObj.model.enableCanvasRendering || (currentseries.drawType.toLowerCase() == 'rangecolumn' && !this.chartObj.model.enableCanvasRendering))
                ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, currentseries, null, null);
            return segment.toString();
        },
        _calculateVisiblePoints: function (currentseries, chartObj) {
            var visiblePoints = [],
                legendPoints = [],
                emptyPointsLength,
                checkNull = ej.util.isNullOrUndefined,
                points = checkNull(chartObj) ? currentseries.points : (chartObj.model._isPieOfPie ? currentseries.pieCollections[currentseries.collectionIndex] : currentseries.points), currentPoints,
                length = points.length, emptyPoints,
                point;

            // calculate visible points
            for (var i = 0; i < length; i++) {
                // for legend visibility
                point = points[i];
                if (checkNull(point._visibility))
                    point._visibility = 'visible';
                point.actualIndex = checkNull(chartObj) ? i : (chartObj.model._isPieOfPie ? point.actualIndex : i);
                point.visible = (point.isEmpty) ? false : point.visible;
                if (checkNull(point.visible))
                    point.visible = true;
                if (point.y < 0) {
                    point.YValues[0] = Math.abs(point.YValues[0])
                }
                if (checkNull(point.x) && currentseries._xAxisValueType != "string") {
                    point.visible = false;
                    point.isEmpty = true;
                }
                if (checkNull(point.y)) {
                    point.visible = false;
                    point.isEmpty = true;
                }
            }
            currentPoints = $.extend(true, {}, points, currentPoints);
            currentPoints.length = length;
            if (currentseries.emptyPointSettings.visible) {
                emptyPoints = this._calculateEmptyPoints(currentseries, currentPoints, chartObj);
                emptyPointsLength = emptyPoints.length;
                for (var j = 0; j < emptyPointsLength; j++) {
                    if (emptyPoints[j].visible) {
                        emptyPoints[j].visible = emptyPoints[j]._visibility == 'hidden' ? false : true;
                        legendPoints.push(emptyPoints[j]);
                        if (emptyPoints[j].visible)
                            visiblePoints.push(emptyPoints[j]);
                    } else {
                        //calculating gap mode values
                        emptyPoints[j].y = ((emptyPoints[j - 1] ? emptyPoints[j - 1].y : 0) + (emptyPoints[j + 1] ? emptyPoints[j + 1].y : 0)) / 2;
                        if (isNaN(emptyPoints[j].y))
                            emptyPoints[j].y = ((emptyPoints[j - 2] ? emptyPoints[j - 2].y : 0) + (emptyPoints[j + 2] ? emptyPoints[j + 2].y : 0)) / 2;

                        emptyPoints[j].YValues[0] = emptyPoints[j].y;
                        if (!checkNull(emptyPoints[j].x) || currentseries._xAxisValueType == "string") {
                            emptyPoints[j].gapMode = true;
                            visiblePoints.push(emptyPoints[j]);
                        }
                    }
                }
            }
            else {
                for (var j = 0; j < length; j++) {
                    legendPoints.push(currentPoints[j]);
                    if (currentPoints[j].visible) {
                        currentPoints[j].visible = currentPoints[j]._visibility == 'hidden' ? false : true;
                        if (currentPoints[j].visible)
                            visiblePoints.push(currentPoints[j]);
                    }
                }
            }
            if (currentseries.visibility == "hidden") {
                for (var i = 0; i < legendPoints.length; i++) {
                    legendPoints[i].visible = false;
                }
            }
            currentseries._visiblePoints = visiblePoints;
            currentseries.visiblePoints = legendPoints;

            return {
                'visiblePoints': visiblePoints,
                'legendPoints': legendPoints
            };
        },
        getMinMaxValue: function (point1, point2, degree) {
            var minX = Math.min(point1.x, point2.x);
            var minY = Math.min(point1.y, point2.y);
            var maxX = Math.max(point1.x, point2.x);
            var maxY = Math.max(point1.y, point2.y);
            var pointValue;
            switch (degree) {
                case 0:
                case 360:
                    pointValue = maxY;
                    break;
                case 90:
                    pointValue = minX;
                    break;
                case 180:
                    pointValue = minY;
                    break;
                case 270:
                    pointValue = maxX;
                    break;
            }
            return pointValue;
        },
        pieDoughnutCenter: function (currentseries) {
            var startAngle = currentseries.startAngle;
            var endAngle = currentseries.endAngle;
            this.chartObj.model.centerCount++;
            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var regions = [-630, -540, -450, -360, -270, -180, -90, 0, 90, 180, 270, 360, 450, 540, 630];
            var region = [];
            var oldCenterX = this.chartObj.model.circleCenterX[seriesIndex];
            var oldCenterY = this.chartObj.model.circleCenterY[seriesIndex];

            if (currentseries.startAngle < currentseries.endAngle) {
                for (i = 0; i < regions.length; i++) {
                    if (regions[i] > startAngle && regions[i] < endAngle)
                        region[region.length] = (regions[i] % 360) < 0 ? (regions[i] % 360) + 360 : (regions[i] % 360);
                }
            }
            else {
                for (i = 0; i < regions.length; i++) {
                    if (regions[i] < startAngle && regions[i] > endAngle)
                        region[region.length] = (regions[i] % 360) < 0 ? (regions[i] % 360) + 360 : (regions[i] % 360);
                }
            }
            if (this.chartObj.model.centerCount == 1) {

                var radius = this.chartObj.model.circularRadius[seriesIndex];
                var startRadian = 2 * Math.PI * (startAngle - 90) / 360;
                var endRadian = 2 * Math.PI * (endAngle - 90) / 360;
                var centerPoint = { x: this.chartObj.model.circleCenterX[seriesIndex], y: this.chartObj.model.circleCenterY[seriesIndex] };
                var startPoint = { x: this.chartObj.model.circleCenterX[seriesIndex] + radius * Math.cos(startRadian), y: this.chartObj.model.circleCenterY[seriesIndex] + radius * Math.sin(startRadian) }
                var endPoint = { x: this.chartObj.model.circleCenterX[seriesIndex] + radius * Math.cos(endRadian), y: this.chartObj.model.circleCenterY[seriesIndex] + radius * Math.sin(endRadian) }
                switch (region.length) {
                    case 0:
                        var longX = Math.abs(centerPoint.x - startPoint.x) > Math.abs(centerPoint.x - endPoint.x) ? startPoint.x : endPoint.x;
                        var longY = Math.abs(centerPoint.y - startPoint.y) > Math.abs(centerPoint.y - endPoint.y) ? startPoint.y : endPoint.y;
                        var midPoint = { x: (centerPoint.x + longX) / 2, y: (centerPoint.y + longY) / 2 }
                        this.chartObj.model.circleCenterX[seriesIndex] = this.chartObj.model.circleCenterX[seriesIndex] + (this.chartObj.model.circleCenterX[seriesIndex] - midPoint.x);
                        this.chartObj.model.circleCenterY[seriesIndex] = this.chartObj.model.circleCenterY[seriesIndex] + (this.chartObj.model.circleCenterY[seriesIndex] - midPoint.y);
                        break;
                    case 1:
                        var maxRadian = 2 * Math.PI * (region[0] - 90) / 360;
                        var maxPoint = { x: this.chartObj.model.circleCenterX[seriesIndex] + radius * Math.cos(maxRadian), y: this.chartObj.model.circleCenterY[seriesIndex] + radius * Math.sin(maxRadian) }
                        switch (region[0]) {
                            case 0:
                            case 360:
                                point1 = { x: startPoint.x, y: maxPoint.y };
                                point2 = { x: endPoint.x, y: centerPoint.y };
                                break;
                            case 90:
                                point1 = { x: centerPoint.x, y: endPoint.y };
                                point2 = { x: maxPoint.x, y: startPoint.y };
                                break;
                            case 180:
                                point1 = { x: endPoint.x, y: centerPoint.y };
                                point2 = { x: startPoint.x, y: maxPoint.y };
                                break;
                            case 270:
                                point1 = { x: maxPoint.x, y: startPoint.y };
                                point2 = { x: centerPoint.x, y: endPoint.y };
                                break;
                        }
                        var midPoint = { x: (point1.x + point2.x) / 2, y: (point1.y + point2.y) / 2 }
                        this.chartObj.model.circleCenterX[seriesIndex] = this.chartObj.model.circleCenterX[seriesIndex] + ((this.chartObj.model.circleCenterX[seriesIndex] - midPoint.x) >= radius ? 0 : (this.chartObj.model.circleCenterX[seriesIndex] - midPoint.x));
                        this.chartObj.model.circleCenterY[seriesIndex] = this.chartObj.model.circleCenterY[seriesIndex] + ((this.chartObj.model.circleCenterY[seriesIndex] - midPoint.y) >= radius ? 0 : (this.chartObj.model.circleCenterY[seriesIndex] - midPoint.y));
                        break;
                    case 2:
                        var minRadian = 2 * Math.PI * (region[0] - 90) / 360;
                        var maxRadian = 2 * Math.PI * (region[1] - 90) / 360;
                        var maxPoint = { x: this.chartObj.model.circleCenterX[seriesIndex] + radius * Math.cos(maxRadian), y: this.chartObj.model.circleCenterY[seriesIndex] + radius * Math.sin(maxRadian) }
                        var minPoint = { x: this.chartObj.model.circleCenterX[seriesIndex] + radius * Math.cos(minRadian), y: this.chartObj.model.circleCenterY[seriesIndex] + radius * Math.sin(minRadian) }
                        var point1;
                        var point2
                        if (region[0] == 90 && region[1] == 180 || region[0] == 270 && region[1] == 0)
                            point1 = { x: minPoint.x, y: maxPoint.y }
                        else
                            point1 = { x: maxPoint.x, y: minPoint.y }
                        if (region[0] == 90 || region[0] == 270)
                            point2 = { x: this.getMinMaxValue(startPoint, endPoint, region[0]), y: this.getMinMaxValue(startPoint, endPoint, region[1]) }
                        else
                            point2 = { x: this.getMinMaxValue(startPoint, endPoint, region[1]), y: this.getMinMaxValue(startPoint, endPoint, region[0]) }
                        var midPoint = { x: Math.abs(point1.x - point2.x) / 2 >= radius ? 0 : (point1.x + point2.x) / 2, y: Math.abs(point1.y - point2.y) / 2 >= radius ? 0 : (point1.y + point2.y) / 2 }
                        this.chartObj.model.circleCenterX[seriesIndex] = this.chartObj.model.circleCenterX[seriesIndex] + (midPoint.x == 0 ? 0 : (this.chartObj.model.circleCenterX[seriesIndex] - midPoint.x) >= radius ? 0 : (this.chartObj.model.circleCenterX[seriesIndex] - midPoint.x));
                        this.chartObj.model.circleCenterY[seriesIndex] = this.chartObj.model.circleCenterY[seriesIndex] + (midPoint.y == 0 ? 0 : (this.chartObj.model.circleCenterY[seriesIndex] - midPoint.y) >= radius ? 0 : (this.chartObj.model.circleCenterY[seriesIndex] - midPoint.y));
                        break;
                }
            }
            for (var i = 0; i < currentseries.points.length; i++) {
                if (seriesIndex < this.chartObj.model._visibleSeries.length && this.chartObj.model.centerCount > 1) {
                    if (this.chartObj.model._visibleSeries[seriesIndex + 1].startAngle == startAngle && this.chartObj.model._visibleSeries[seriesIndex + 1].endAngle == endAngle) {
                        this.chartObj.model.circleCenterX[seriesIndex] = this.chartObj.model.circleCenterX[seriesIndex + 1];
                        this.chartObj.model.circleCenterY[seriesIndex] = this.chartObj.model.circleCenterY[seriesIndex + 1];
                    }
                }
                this.chartObj.model.startX[i] = this.chartObj.model.startX[i] - (oldCenterX - this.chartObj.model.circleCenterX[seriesIndex]);
                this.chartObj.model.startY[i] = this.chartObj.model.startY[i] - (oldCenterY - this.chartObj.model.circleCenterY[seriesIndex]);


            }

        },
        _drawEmptyPieOfPie: function (chartObj) {
            var startAngle = -.5 * Math.PI,
                endAngle = 360 * (Math.PI / 180) + (-.5 * Math.PI) - 0.000001,
                startX = chartObj.model.circleCenterX[1],
                startY = chartObj.model.circleCenterY[1],
                radius = chartObj.model.circularRadius[1];
            var direction = "M" + " " + (startX + radius * Math.cos(startAngle)) + " " + (startY + radius * Math.sin(startAngle)) + " " + "A" + " " + radius + " " + radius + " " + "0" + " " +
                1 + " " + 1 + " " + (startX + radius * Math.cos(endAngle)) + " " + (startY + radius * Math.sin(endAngle)) + " " + "z";
            var theme = chartObj.model.theme.toLowerCase();
            var pathOptions = {
                'id': chartObj.svgObject.id + '_Series' + 0 + "_EmptyCircle",
                'fill': 'none',
                'stroke-width': 1.5,
                'stroke': theme.indexOf("dark") >= 0 || theme.indexOf("contrast") >= 0 ? " #FFFFFF" : "#000000",
                'stroke-dasharray': '',
                'd': direction,
                'opacity': 1,
                'radius': radius,
                'start': 0 - 1.57,
                'end': (360 * (Math.PI / 180)) - 1.57,
                'cx': startX,
                'cy': startY
            };
            return pathOptions;
        },
        calculatingSliceAngle: function (currentseries, chartObj) {
            var chart = this.chartObj ? this.chartObj : chartObj,
                chartModel = chart.model,
                legend = chartModel.legend,
                seriesIndex = $.inArray(currentseries, chartModel._visibleSeries),
                legendPosition = legend.position.toLowerCase(),
                legendActualBounds = chartModel.LegendActualBounds,
                visiblePoints = currentseries._visiblePoints,
                visiblePointslength = visiblePoints.length,
                legXSpace = 0, totalDegree,
                legYSpace = 0,
                legendBorder = legend.border.width,
                border = chartModel.border.width,
                point, margin = chartModel.margin,
                elementSpacing = chartModel.elementSpacing,
                itemCurrentXPos = 0,
                subTitle = chartModel.title.subTitle.text ? chartModel.title.subTitle : '';
            chartModel.arcData = [];
            currentseries.rightsidePoints = [];
            currentseries.leftsidePoints = [];
            currentseries.labels = [];
            chartModel.sumofYValues = 0;
            chartModel.midPoint = 0;
            var type = currentseries.type.toLowerCase(),
                gapWidthValue = currentseries.gapWidth;


            for (j = 0; j < visiblePoints.length; j++) {
                chartModel.sumofYValues += visiblePoints[j].YValues[0];
            }
            if (currentseries.endAngle != null && type != "pieofpie")
                totalDegree = (currentseries.endAngle - currentseries.startAngle);
            else
                totalDegree = 360;
            totalDegree = (totalDegree != 360 && totalDegree != -360) ? totalDegree % 360 : totalDegree;
            if (currentseries.startAngle && type != "pieofpie") {
                currentseries.startAngle = currentseries.startAngle % 360;
                currentseries.endAngle = currentseries.startAngle + totalDegree;
                itemCurrentXPos = (currentseries.startAngle) ? ((chartModel.sumofYValues / 360) * currentseries.startAngle) : 0;
                itemCurrentXPos = itemCurrentXPos / chartModel.sumofYValues;
                chartModel.itemCurrentXPos = itemCurrentXPos;
            }
            else
                currentseries.endAngle = totalDegree;
            if (legend.visible && legendPosition != "custom") {
                if (legendPosition == "right" || legendPosition == "left")
                    legXSpace += legendActualBounds.Width + (legendBorder * 2) + elementSpacing;
                else
                    legYSpace += legendActualBounds.Height + (legendBorder * 2) + elementSpacing;

            }

            var yOffset = ((chartModel.title.text && chartModel.title.visible) ? chartModel._titleLocation.size.height + chartModel.elementSpacing + (subTitle == '' ? 0 : (subTitle.text && subTitle.visible && subTitle.enableTrim && (subTitle.textOverflow == 'wrap' || subTitle.textOverflow == 'wrapandtrim') ? chartModel._subTitleLocation.size.height : 0)) : 0);

            var constantWidth = 0.1 * Math.min($(chart.svgObject).width(), $(chart.svgObject).height());
            var actualWidth = $(chart.svgObject).width() - (legXSpace + margin.left + margin.right + border * 2) - (type == "pieofpie" ? gapWidthValue : 0);
            var actualHeight = $(chart.svgObject).height() - (legYSpace + yOffset + margin.top + margin.bottom + border * 2);
            seriesIndex = chart.model._isPieOfPie ? currentseries.collectionIndex : seriesIndex;

            if (type == "pieofpie") {
                if (actualWidth < constantWidth) {
                    var widthDifference = constantWidth - actualWidth;
                    actualWidth = constantWidth;
                }
                gapWidthValue = widthDifference ? gapWidthValue - widthDifference : $(chart.svgObject).width() >= gapWidthValue ? gapWidthValue : 0;
            }
            var value = type == "pieofpie" ? (seriesIndex == 0 ? 0.25 : 0.25 * 3) : 0.5;
            chartModel.circleCenterX[seriesIndex] = (actualWidth * value) + (seriesIndex == 1 && type == "pieofpie" ? gapWidthValue : 0) + margin.left + ((legend.visible && legendPosition === "left") ? legXSpace : 0);
            chartModel.circleCenterY[seriesIndex] = (actualHeight * 0.5) + margin.top + yOffset + ((legend.visible && legendPosition === "top") ? legYSpace : 0);

            if (!ej.util.isNullOrUndefined(chart.model.pieGapWidth) && chart.model.pieGapWidth != 0) {
                if (seriesIndex == 0)
                    chartModel.circleCenterX[seriesIndex] = chartModel.circleCenterX[seriesIndex] + chart.model.pieGapWidth / 2;
                else
                    chartModel.circleCenterX[seriesIndex] = chartModel.circleCenterX[seriesIndex] - chart.model.pieGapWidth / 2;
            }
            var endAngle;
            currentseries.startAngle = (type == "pieofpie") ? 0 : currentseries.startAngle;
            totalDegree = currentseries.endAngle - currentseries.startAngle;
            var pieFactor = totalDegree / 180;
            var circleMidAngle = (totalDegree / 4) * (Math.PI / 180);
            for (var l = 0; l < visiblePointslength; l++) {
                point = currentseries._visiblePoints[l];
                if (point.visible || point.gapMode) {
                    var pointIndex = type == "pieofpie" ? point.actualIndex : l;
                    if (l == 0 && seriesIndex == 0 && type == "pieofpie") {
                        var startAngle = 2 * Math.PI * itemCurrentXPos;
                        var endAngle = pieFactor * Math.PI * (point.YValues[0] / chartModel.sumofYValues) + startAngle;
                        endAngle = (isNaN(endAngle)) ? startAngle : endAngle;
                        midAngle = (endAngle + startAngle) / 2;
                        point.start = point.startAngle = circleMidAngle - midAngle;
                        point.end = point.endAngle = circleMidAngle + midAngle;
                        point.midAngle = circleMidAngle;
                    }
                    else {
                        if (l == 0)
                            point.startAngle = 2 * Math.PI * itemCurrentXPos;
                        else
                            point.startAngle = (type == "pieofpie") ? currentseries.pieCollections[seriesIndex][l - 1].endAngle : endAngle;
                        endAngle = point.endAngle = pieFactor * Math.PI * (point.YValues[0] / chartModel.sumofYValues) + point.startAngle;
                        endAngle = point.endAngle = (isNaN(endAngle)) ? point.startAngle : endAngle;
                        point.start = point.startAngle;
                        point.end = point.endAngle;
                        point.midAngle = (point.endAngle + point.startAngle) / 2;
                    }
                    point.pointIndex = pointIndex;
                    var chartStartingAngle = -.5 * Math.PI;

                    point.radian = (point.midAngle) % (2 * Math.PI)

                    if (currentseries.labelPosition.toLowerCase() == "outsideextended" && type != "pieofpie") {

                        if (point.radian < Math.PI)
                            currentseries.rightsidePoints.push(point);
                        else
                            currentseries.leftsidePoints.push(point);
                    }
                    itemCurrentXPos += point.YValues[0] / chartModel.sumofYValues;

                    var midAngle = point.midAngle + chartStartingAngle;

                    if ((point.actualIndex == currentseries.explodeIndex || currentseries.explodeAll) && !chart.vmlRendering) {

                        chartModel.startX[pointIndex] = chartModel.circleCenterX[seriesIndex] + Math.cos(midAngle) * currentseries.explodeOffset;
                        chartModel.startY[pointIndex] = chartModel.circleCenterY[seriesIndex] + Math.sin(midAngle) * currentseries.explodeOffset;
                    }
                    else {
                        chartModel.startX[pointIndex] = chartModel.circleCenterX[seriesIndex];
                        chartModel.startY[pointIndex] = chartModel.circleCenterY[seriesIndex];
                    }
                }

            }

            if (currentseries.labelPosition.toLowerCase() == "outsideextended") {
                currentseries.rightsidePoints = ej.DataManager(currentseries.rightsidePoints, ej.Query().sortBy("radian")).executeLocal();
                currentseries.leftsidePoints = ej.DataManager(currentseries.leftsidePoints, ej.Query().sortBy("radian")).executeLocal();
            }
            if (currentseries.marker.dataLabel.template) {
                if (currentseries.labelPosition.toLowerCase() == "outsideextended") {
                    for (var i = 0; i < currentseries.rightsidePoints.length; i++) {
                        ej.EjSvgRender.utils._getSeriesTemplateSize(currentseries.rightsidePoints[i], currentseries.rightsidePoints[i].actualIndex, currentseries, false, chart);
                    }
                    for (var k = 0; k < currentseries.leftsidePoints.length; k++) {
                        ej.EjSvgRender.utils._getSeriesTemplateSize(currentseries.leftsidePoints[k], currentseries.leftsidePoints[k].actualIndex, currentseries, true, chart);
                    }

                }
                else {
                    for (var j = 0; j < currentseries._visiblePoints.length; j++) {
                        ej.EjSvgRender.utils._getSeriesTemplateSize(currentseries._visiblePoints[j], currentseries._visiblePoints[j].actualIndex, currentseries, true, chart);
                    }
                }

            }
            else {
                ej.EjSvgRender.utils._getSeriesMaxLabel(currentseries);
            }


            currentseries.finalSize = { width: actualWidth, height: actualHeight };
            return currentseries.finalSize;
        },
        _drawHiloPath: function (series, style, interior, direction, i, pointbounds) {

            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);

            var options = {
                'name': series.type,
                'id': this.chartObj.svgObject.id + "_Series" + seriesIndex + "_Point" + i,
                'fill': "none",
                'stroke-dasharray': series.dashArray,
                'stroke-width': style.borderWidth,
                'stroke': interior,
                'stroke-linecap': series.lineCap,
                'stroke-linejoin': series.lineJoin,
                'opacity': series.opacity,
                'd': direction
            };
            this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);
            var valWidth, valHeight, x, y;
            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, this.chartObj.model.requireInvertedAxes);
            x = (Math.min(pointbounds.point2.X, pointbounds.point1.X) + trans.x) - (style.borderWidth);
            y = (Math.min(pointbounds.point2.Y, pointbounds.point1.Y) + trans.y);
            if (pointbounds.point1.Y != pointbounds.point2.Y) {
                valWidth = style.borderWidth + (style.borderWidth / 2);
                valHeight = Math.abs(pointbounds.point1.Y - pointbounds.point2.Y);
            }
            else {
                valWidth = Math.abs(pointbounds.point2.X - pointbounds.point1.X);
                valHeight = style.borderWidth + (style.borderWidth / 2);
            }
            var bounds = { X: x, Y: y, Width: valWidth, Height: valHeight };
            ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, series, null, i);

        },
        isIntersec: function (other, currBounds) {
            if (currBounds.Bottom < other.Top || currBounds.Right < other.Left
                || currBounds.Top > other.Bottom || currBounds.Left > other.Right) {
                return false;
            }
            return true;
        },
        IntersectWith: function (sender, point, currBounds, labelPosition, seriesIndex, size) {
            var chartObj = this, intersect = false,
                smartIndex, bounds;
            if (ej.util.isNullOrUndefined(sender.model.rightsidebounds[seriesIndex]) || ej.util.isNullOrUndefined(sender.model.leftsidebounds[seriesIndex])) {
                sender.model.leftsidebounds[seriesIndex] = [];
                sender.model.rightsidebounds[seriesIndex] = [];
                sender.model.leftsidebounds[seriesIndex].points = [];
                sender.model.rightsidebounds[seriesIndex].points = [];
            }
            if (labelPosition == "outsideExtended") {
                for (var i = seriesIndex; i < sender.model.bounds.length; i++) {
                    if (sender.model._visibleSeries[i].labelPosition.toLowerCase() == "outsideextended") {
                        if ((!ej.util.isNullOrUndefined(sender.model.bounds[i].points["left"])) && (sender.model.bounds[i].points["left"].length > 0)) {
                            var pointsLength = sender.model.bounds[i].points["left"].length;
                            for (var j = pointsLength - 1; j >= 0 && !(ej.util.isNullOrUndefined(sender.model.bounds[i].points["left"][j])); j--) {
                                sender.model.leftsidebounds[i].points[j] = sender.model.bounds[i].points["left"][j];

                            }
                        }
                        if ((!ej.util.isNullOrUndefined(sender.model.bounds[i].points["right"])) && (sender.model.bounds[i].points["right"].length > 0)) {
                            var pointsLength = sender.model.bounds[i].points["right"].length;
                            for (var k = 0; k < pointsLength && !(ej.util.isNullOrUndefined(sender.model.bounds[i].points["right"][k])); k++) {
                                sender.model.rightsidebounds[i].points[k] = sender.model.bounds[i].points["right"][k];
                            }
                        }

                    }
                }
            }
            else {

                if (sender.model.bounds[seriesIndex].points.length > 0 || seriesIndex >= 0) {
                    for (var i = seriesIndex; i < sender.model.bounds.length && (!ej.util.isNullOrUndefined(sender.model.bounds[i])); i++) {
                        if (sender.model._visibleSeries[i].labelPosition.toLowerCase() != "outsideextended") {
                            var pointsLength = sender.model.bounds[i].points.length;
                            for (var j = 0; j < pointsLength && !(ej.util.isNullOrUndefined(sender.model.bounds[i].points[j])); j++) {
                                if (sender.model.bounds[i].points[j].X < sender.model.circleCenterX[seriesIndex]) {
                                    if (($.inArray(sender.model.bounds[i].points[j], sender.model.leftsidebounds[i].points)) == -1)
                                        sender.model.leftsidebounds[i].points[j] = sender.model.bounds[i].points[j];
                                }
                                else if (($.inArray(sender.model.bounds[i].points[j], sender.model.rightsidebounds[i].points)) == -1)
                                    sender.model.rightsidebounds[i].points[j] = (sender.model.bounds[i].points[j]);

                            }
                        }
                    }
                }

            }
            for (i = seriesIndex; i < sender.model.bounds.length && (!ej.util.isNullOrUndefined(sender.model.bounds[i])); i++) {
                if (sender.model.leftsidebounds[i].points.length > 0) {
                    bounds = sender.model.leftsidebounds[i].points;
                    if (bounds.length > 0) {
                        for (var j = bounds.length - 1; j >= 0; j--) {
                            var other = bounds[j];

                            if (!(ej.util.isNullOrUndefined(other) && other != currBounds)) {
                                if (other.SeriesIndex == currBounds.SeriesIndex && other.PointIndex == currBounds.PointIndex) {
                                    if (point.smartLabelPosition == "outside")
                                        continue;
                                    else
                                        break;
                                }
                                else if (this.isIntersec(other, currBounds))
                                    return true;
                                else if (currBounds.X < sender.model.circleCenterX[seriesIndex] && other.X < sender.model.circleCenterX[seriesIndex] && sender.model.series[seriesIndex].marker.dataLabel.shape != "none") {                                  
                                    var yDiff = Math.abs(other.Y - currBounds.Y);
                                    if (size && yDiff <= size.height && other.Bottom > currBounds.Top && other.Left < currBounds.X)
                                        currBounds.overlap = true;
                                }
                            }
                        }
                    }

                }
            }
            for (i = seriesIndex; i < sender.model.bounds.length && (!ej.util.isNullOrUndefined(sender.model.bounds[i])); i++) {
                bounds = sender.model.rightsidebounds[i].points;
                if (bounds.length > 0) {
                    for (var j = bounds.length - 1; j >= 0; j--) {
                        var other = bounds[j];
                        if (!(ej.util.isNullOrUndefined(other) && other != currBounds)) {
                            if (other.SeriesIndex == currBounds.SeriesIndex && other.PointIndex == currBounds.PointIndex) {
                                if (point.smartLabelPosition == "outside")
                                    continue;
                                else
                                    break;
                            }
                            else if (this.isIntersec(other, currBounds))
                                return true;
                            else if (currBounds.X > sender.model.circleCenterX[seriesIndex] && other.X > sender.model.circleCenterX[seriesIndex]  && sender.model.series[seriesIndex].marker.dataLabel.shape != "none") {
                                var yDiff = Math.abs(other.Y - currBounds.Y);
                                if (size && yDiff <= size.height && other.Bottom > currBounds.Top && (other.X + (other.Right - other.Left)) > currBounds.X)
                                    currBounds.overlap = true;
                            }
                        }
                    }

                }
            }
            return intersect;

        },


        _calculateArcData: function (sender, pointIndex, point, series, seriesIndex, pieSeriesIndex) {
            var seriesIndex = sender.model._isPieOfPie ? pieSeriesIndex : seriesIndex;
            var visiblePoints = series._visiblePoints;
            var index = point.actualIndex;
            var chartObj = sender;
            var chartStartAngle = -.5 * Math.PI;
            var currBounds, startAngle, endAngle;
            // fix for doughnut width is inconsistent when series having single point-EJMVC-6272
            if (series.type.toLowerCase() == "doughnut" && series._visiblePoints.length == 1 && Math.abs(series.endAngle - series.startAngle) == 360
                && series.startAngle % 90 != 0) {
                startAngle = parseFloat((point.startAngle + chartStartAngle).toFixed(3));
                endAngle = parseFloat((point.endAngle + chartStartAngle).toFixed(3)) - 0.000001;
            }
            else {
                startAngle = point.startAngle + chartStartAngle;
                endAngle = point.endAngle + chartStartAngle - 0.000001;
            }
            var totalDegree = series.endAngle - series.startAngle;
            var longArc = endAngle - startAngle < Math.PI ? 0 : 1;
            var midAngle = (startAngle + endAngle) / 2;
            if (ej.util.isNullOrUndefined(point.currentMidAngle)) {
                point.currentMidAngle = (startAngle + endAngle) / 2;
            }
            var direction;
            var startX;
            var startY
            var clockWise = totalDegree > 0 ? 1 : 0;
            var longArc = clockWise ? endAngle - startAngle < Math.PI ? 0 : 1 : endAngle - startAngle > -1 * Math.PI ? 0 : 1;
            var radius = chartObj.model.circularRadius[seriesIndex];
            var innerRadius = chartObj.model.innerRadius[seriesIndex];
            if ((index == series.explodeIndex || series.explodeAll) && !chartObj.vmlRendering) {

                startX = chartObj.model.circleCenterX[seriesIndex] + Math.cos(midAngle) * series.explodeOffset;
                startY = chartObj.model.circleCenterY[seriesIndex] + Math.sin(midAngle) * series.explodeOffset;
            }
            else {
                startX = chartObj.model.circleCenterX[seriesIndex];
                startY = chartObj.model.circleCenterY[seriesIndex];
            }


            var x1 = startX + radius * Math.cos(startAngle);
            var y1 = startY + radius * Math.sin(startAngle);

            var x2 = startX + radius * Math.cos(endAngle);
            var y2 = startY + radius * Math.sin(endAngle);

            if (series.type.toLowerCase() == "doughnut") {
                var dStartX = startX + innerRadius * Math.cos(startAngle);
                var dStartY = startY + innerRadius * Math.sin(startAngle);

                var dEndX = startX + innerRadius * Math.cos(endAngle);
                var dEndY = startY + innerRadius * Math.sin(endAngle);
                var dClockWise = clockWise ? 0 : 1;
                if ((startAngle < 0) && Math.round(point.endAngle - point.startAngle) == 6) {
                    dEndX = dEndX - 0.01;
                    x2 = x2 - 0.01;
                }
                direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + longArc + " " + clockWise + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "A" + " " + innerRadius + " " + innerRadius + " " + "1" + " " + longArc + " " + dClockWise + " " + dStartX + " " + dStartY + " " + "z";
            }

            else {
                if ((point.endAngle - point.startAngle).toFixed(4) == (2 * Math.PI).toFixed(4)) {
                    var centerx = startX;
                    var centery = startY;
                    direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + longArc + " " + clockWise + " " + x2 + " " + y2;
                }
                else
                    direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + longArc + " " + clockWise + " " + x2 + " " + y2 + " " + "L" + " " + startX + " " + startY + " " + "z";
            }

            // display label for pie and doughnut chart


            return { Direction: direction, centerX: centerx, centerY: centery };

        },

        getXCordinate: function (x, radius, angle) {
            var x1 = x + radius * (Math.cos(angle));
            return x1;
        },

        getYCordinate: function (y, radius, angle) {
            var y1 = y + radius * (Math.sin(angle));
            return y1;
        },
        getDoubleRange: function (start, end) {
            var mstart;
            var mend;
            if (start > end) {
                mstart = end;
                mend = start;
            }
            else {
                mstart = start;
                mend = end;
            }

            var mdelta = mend - mstart;
            var mmedian = (mstart + mend) / 2;
            var misEmpty = isNaN(mstart) || isNaN(mend);

            return { Start: mstart, End: mend, Delta: mdelta, Median: mmedian, IsEmpty: misEmpty };

        },
        isDependentSeries: function (series) {
            var type = series.type.toLowerCase();
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            if ((!requireInvertedAxes) || (requireInvertedAxes && series.isTransposed))
                return ((type.indexOf("bar") != -1 && !series._isTransposed) || (type.indexOf("column") != -1) || (type.indexOf("waterfall") != -1) || (type.indexOf("hilo") != -1) || (type.indexOf("candle") != -1) || (type.indexOf("boxandwhisker") != -1)) ? true : false;
            else
                return (type.indexOf("bar") != -1) ? true : false;
        },

        getPointXYOrgin: function (x, y, series, sender) {
            var requireInvertedAxes = sender.model.requireInvertedAxes;
            var xvalue;
            var yvalue;
            if ((series.isTransposed && requireInvertedAxes) || series._isTransposed) {
                xvalue = (1 - ej.EjSvgRender.utils._valueToCoefficient(series.xAxis, x)) * (series.xAxis.height);
                yvalue = (ej.EjSvgRender.utils._valueToCoefficient(series.yAxis, y)) * (series.yAxis.width);
                return { X: yvalue, Y: xvalue };
            }
            else {
                xvalue = ej.EjSvgRender.utils._valueToCoefficient(series.xAxis, x) * (series.xAxis.width);
                yvalue = (1 - ej.EjSvgRender.utils._valueToCoefficient(series.yAxis, y)) * (series.yAxis.height);
                return { X: xvalue, Y: yvalue };
            }
        },
        getRectangle: function (x1, y1, x2, y2, series, sender) {
            var pt1 = this.getPointXYOrgin(x1, y1, series, sender);
            var pt2 = this.getPointXYOrgin(x2, y2, series, sender);
            return ej.EjSvgRender.utils._correctRect(pt1.X, pt1.Y, pt2.X, pt2.Y);
        },

        calculateMean: function (values, series, pointIndex) {

            var q1Arr, q3Arr, q1Arrodd, q1Arreven, q2Arr, q3Arrodd, q3Arreven, q1half, q3half, midhalf, lowerquartile, upperquartile;
            var wholenumlower, remainderlower, intpartlower, decimalpartlower, wholenumupper, remainderupper, intpartupper, decimalpartupper,
                intpartlowerposition, intpartupperposition, averageValue = 0, boxAverageValue = 0, boxWhiskerValues = [], boxWhiskerCount = 0, boxes = [], boxArrCount = 0;
            if (values.length > 1)
                values.sort(function (a, b) { return a - b; });

            //showMean calculation
            for (var q = 0; q < values.length; q++) {
                averageValue = averageValue + values[q];
            }
            boxAverageValue = averageValue / values.length;
            boxAverageValue = parseInt(boxAverageValue.toFixed(2));
            boxes[boxArrCount] = boxAverageValue;
            boxArrCount++;

            if (series.boxPlotMode.toLowerCase() == "normal") {
                //Lower quartile calculation for normal mode
                q1Arr = (values.length % 2 == 0) ? values.slice(0, (values.length / 2)) : values.slice(0, Math.floor(values.length / 2));
                q1half = Math.floor(q1Arr.length / 2);
                lowerquartile = q1Arr.length % 2 == 0 ? (q1Arr[q1half - 1] + q1Arr[q1half]) / 2 : q1Arr[q1half];
                lowerquartile = (values.length <= 3) ? values[0] : lowerquartile;
                boxes[boxArrCount] = lowerquartile;
                boxArrCount++;
                //Upper quartile calculation for normal mode 	 
                q3Arr = (values.length % 2 == 0) ? values.slice((values.length / 2), values.length) : values.slice(Math.ceil(values.length / 2), values.length);
                q3half = Math.floor(q3Arr.length / 2);
                upperquartile = q3Arr.length % 2 == 0 ? (q3Arr[q3half - 1] + q3Arr[q3half]) / 2 : q3Arr[q3half];
                upperquartile = (values.length <= 3) ? values[values.length - 1] : upperquartile;
                boxes[boxArrCount] = upperquartile;
                boxArrCount++;
            }
            else if (series.boxPlotMode.toLowerCase() == "exclusive" || series.boxPlotMode.toLowerCase() == "inclusive") {

                //Lower quartile calculation for exclusive meadian and inclusive median 
                wholenumlower = series.boxPlotMode.toLowerCase() == "exclusive" ? (values.length + 1) / 4 : (values.length - 1) / 4;
                intpartlower = Math.floor(wholenumlower);
                decimalpartlower = wholenumlower - intpartlower;
                intpartlowerposition = series.boxPlotMode.toLowerCase() == "exclusive" ? intpartlower - 1 : intpartlower;
                q1Arr = (1 - decimalpartlower) * values[intpartlowerposition] + decimalpartlower * values[intpartlowerposition + 1];
                q1Arr = (values.length <= 3) ? values[0] : q1Arr;
                lowerquartile = q1Arr;
                boxes[boxArrCount] = lowerquartile;
                boxArrCount++;

                //Upper quartile calculation for exclusive meadian and inclusive median 
                wholenumupper = series.boxPlotMode.toLowerCase() == "exclusive" ? (3 * (values.length + 1)) / 4 : (3 * (values.length - 1)) / 4;
                intpartupper = Math.floor(wholenumupper);
                decimalpartupper = wholenumupper - intpartupper;
                intpartupperposition = series.boxPlotMode.toLowerCase() == "exclusive" ? intpartupper - 1 : intpartupper;
                q3Arr = (1 - decimalpartupper) * values[intpartupperposition] + decimalpartupper * values[intpartupperposition + 1];
                q3Arr = (values.length <= 3) ? values[values.length - 1] : q3Arr;
                upperquartile = q3Arr;
                boxes[boxArrCount] = upperquartile;
                boxArrCount++;
            }


            //calculate median
            midhalf = Math.floor(values.length / 2);
            q2Arr = values.length % 2 == 0 ? (values[midhalf - 1] + values[midhalf]) / 2 : values[midhalf];
            boxes[boxArrCount] = q2Arr;
            boxArrCount++;

            //calculate interquartile range
            var iqr = upperquartile - lowerquartile;
            var upperrange = upperquartile + 1.5 * (iqr);
            var lowerrange = lowerquartile - 1.5 * (iqr);
            var maximum = values[values.length - 1];
            var minimum = values[0];
            var outliers = [], maxNumCount = 0, index = 0;


            for (var i = 0; i < values.length; i++) {
                if (upperrange < values[i]) {
                    maxNumCount++;
                    outliers[index] = values[i];
                    index++;
                    maximum = values[i - maxNumCount];

                }
                if (lowerrange > values[i]) {
                    outliers[index] = values[i];
                    index++;
                    minimum = values[i + 1];
                }
            }
            boxes[boxArrCount] = minimum;
            boxArrCount++;
            boxes[boxArrCount] = maximum;
            boxArrCount++;

            var boxPlotValues = { Minimum: minimum, LowerQuartile: lowerquartile, midvalue: q2Arr, UpperQuartile: upperquartile, Maximum: maximum, boxAverage: boxAverageValue, outliers: outliers };
            series._visiblePoints[pointIndex].boxPlotValues = boxPlotValues;
            series._visiblePoints[pointIndex].boxPlotValues.quartileValues = boxes;




            return { Minimum: minimum, LowerQuartile: lowerquartile, midvalue: q2Arr, UpperQuartile: upperquartile, Maximum: maximum, boxAverage: boxAverageValue, outliers: outliers };
        },
        calculateBoxAndWhiskerPath: function (options, rect, options1, list2, series, point, pointIndex) {

            series._visiblePoints[pointIndex].boxPlotLocation = [];
            series._visiblePoints[pointIndex].dataLabelLocation = [];
            var boxCount = 0;
            var cSer = this, offset = 5;
            var isTransposed = series._isTransposed;
            var outlierShape = series.outlierSettings.shape.toLowerCase();
            var invertedAxis = this.chartObj.model.requireInvertedAxes, whiskerpath, boxAvg, boxAvgValue, fenceValue, outlierpoint;


            for (var p = 0; p < series._visiblePoints[pointIndex].boxPlotValues.quartileValues.length; p++) {
                boxAvg = { "xValue": point.xValue, "YValues": series._visiblePoints[pointIndex].boxPlotValues.quartileValues[p] };
                boxAvgValue = ej.EjSvgRender.utils._getPoint(boxAvg, series);
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount] = boxAvgValue;
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount].xValue = boxAvg.xValue;
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount].YValues = boxAvg.YValues;
                if (isTransposed)
                    series._visiblePoints[pointIndex].dataLabelLocation[boxCount] = { X: boxAvgValue.X, Y: rect.Y + rect.Height / 2 + offset }
                else
                    series._visiblePoints[pointIndex].dataLabelLocation[boxCount] = { X: rect.X + rect.Width / 2, Y: boxAvgValue.Y };
                boxCount++;

            }

            for (var k = 0; k < list2.outliers.length && outlierShape != "none"; k++) {
                fenceValue = { "xValue": point.xValue, "YValues": list2.outliers[k] };
                outlierpoint = ej.EjSvgRender.utils._getPoint(fenceValue, series);
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount] = outlierpoint;//to store x and y positions of upper outlier
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount].xValue = fenceValue.xValue;
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount].YValues = fenceValue.YValues;
                series._visiblePoints[pointIndex].boxPlotLocation[boxCount].outlier = true;
                if (isTransposed)
                    outlierpoint.Y = rect.Y + rect.Height / 2;
                else
                    outlierpoint.X = rect.X + rect.Width / 2;
                if (isTransposed)
                    series._visiblePoints[pointIndex].dataLabelLocation[boxCount] = { X: outlierpoint.X - series.outlierSettings.size.height, Y: rect.Y + rect.Height / 2 + series.outlierSettings.size.width, outlier: true }
                else
                    series._visiblePoints[pointIndex].dataLabelLocation[boxCount] = { X: rect.X + rect.Width / 2, Y: outlierpoint.Y, outlier: true };
                boxCount++;
            }
            whiskerpath = series._visiblePoints[pointIndex].boxPlotLocation;

            if (series._isTransposed) {
                var plotlowerwhisker = "M" + " " + (cSer.chartObj.canvasX + whiskerpath[4].X) + " " + (cSer.chartObj.canvasY + rect.Y) + " L " + (whiskerpath[4].X + cSer.chartObj.canvasX) + " " + (rect.Height + rect.Y + cSer.chartObj.canvasY) + " M " + (cSer.chartObj.canvasX + whiskerpath[4].X) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2)) + " L " + (cSer.chartObj.canvasX + whiskerpath[1].X) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2)) + " " + " z";
                var plotupperwhisker = "M" + " " + (cSer.chartObj.canvasX + whiskerpath[5].X) + " " + (cSer.chartObj.canvasY + rect.Y) + " L " + (cSer.chartObj.canvasX + whiskerpath[5].X) + " " + (rect.Height + rect.Y + cSer.chartObj.canvasY) + " M " + (cSer.chartObj.canvasX + whiskerpath[5].X) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2)) + " L " + (cSer.chartObj.canvasX + whiskerpath[2].X) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2)) + " " + " z";

            }
            else {
                var plotlowerwhisker = "M" + " " + (cSer.chartObj.canvasX + rect.X) + " " + (cSer.chartObj.canvasY + whiskerpath[4].Y) + " L " + (cSer.chartObj.canvasX + rect.X + rect.Width) + " " + (cSer.chartObj.canvasY + whiskerpath[4].Y) + " M " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2)) + " " + (cSer.chartObj.canvasY + whiskerpath[4].Y) + " L " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2)) + " " + (cSer.chartObj.canvasY + whiskerpath[1].Y) + " " + " z";
                var plotupperwhisker = "M" + " " + (cSer.chartObj.canvasX + rect.X) + " " + (cSer.chartObj.canvasY + whiskerpath[5].Y) + " L " + (cSer.chartObj.canvasX + rect.X + rect.Width) + " " + (cSer.chartObj.canvasY + whiskerpath[5].Y) + " M " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2)) + " " + (cSer.chartObj.canvasY + whiskerpath[5].Y) + " L " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2)) + " " + (cSer.chartObj.canvasY + whiskerpath[2].Y) + " " + " z";
            }

            var meanPath = !series._isTransposed ? "M" + " " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2) - 5) + " " + (cSer.chartObj.canvasY + whiskerpath[0].Y - 5) + " L " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2) + 5) + " " + (cSer.chartObj.canvasY + whiskerpath[0].Y + 5) + " M " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2) - 5) + " " + (cSer.chartObj.canvasY + whiskerpath[0].Y + 5) + " L " + (cSer.chartObj.canvasX + rect.X + (rect.Width / 2) + 5) + " " + (cSer.chartObj.canvasY + whiskerpath[0].Y - 5) + " " + "z" :
                "M" + " " + (cSer.chartObj.canvasX + whiskerpath[0].X - 5) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2) - 5) + " L " + (cSer.chartObj.canvasX + whiskerpath[0].X + 5) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2) + 5) + " M " + (cSer.chartObj.canvasX + whiskerpath[0].X + 5) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2) - 5) + " L " + (cSer.chartObj.canvasX + whiskerpath[0].X - 5) + " " + (cSer.chartObj.canvasY + rect.Y + (rect.Height / 2) + 5) + " " + "z";


            return { upperWhisker: plotupperwhisker, lowerWhisker: plotlowerwhisker, mean: meanPath };
        },
        calculateSides: function (point, sidebysideinfo) {
            var x1 = point.xValue + sidebysideinfo.Start;
            var x2 = point.xValue + sidebysideinfo.End;
            return { x1: x1, x2: x2 };
        },
        _getSeriesPosition: function (currentSeries) {
            // calculation for position of series in radar and polar.
            if (ej.util.isNullOrUndefined(currentSeries.position) || this.chartObj.model.legendCollapsed) {
                var stacked;
                var stackingposition
                var all = 0;
                var seriesCollection = [];
                for (var i = 0; i < this.chartObj.model._visibleSeries.length; i++) {
                    var series = this.chartObj.model._visibleSeries[i];
                    if (series.visibility.toLowerCase() === 'visible' && series.drawType.toLowerCase() == 'column' || (series.drawType.toLowerCase() == 'rangecolumn')) {
                        seriesCollection.push(series);
                    }
                }
                for (var j = 0; j < seriesCollection.length; j++) {
                    var series = seriesCollection[j];
                    if (series._xAxisName == this.chartObj.model._axes[0].name && series._yAxisName == this.chartObj.model._axes[1].name) {
                        if (series.isStacking) {
                            if (!stacked) {
                                stackingposition = all;
                                all++;
                                stacked = true;
                            }
                            series.position = stackingposition;
                        }
                        else {
                            series.position = all;
                            all++;
                        }
                    }
                }
                for (var k = 0; k < seriesCollection.length; k++)
                    seriesCollection[k].all = all;

            }
            return { all: currentSeries.all, pos: currentSeries.position };
        },
        getSideBySidePositions: function (currentSeries, params) {

            var chart = this,
                stackingGroup = [],
                model = chart.chartObj.model,
                vAxeseries, i, j, k, visibleSeriesLength;
            i = j = k = 0;
            visibleSeriesLength = model._visibleSeries.length;
            //Spacing not calculated during resize event because position value in series is not null or undefined		 
            if (ej.util.isNullOrUndefined(currentSeries.position) || model.legendCollapsed || !params.spacingCalculated) {
                var hAxes = (model.requireInvertedAxes) ? model.vAxes : model.hAxes;
                var vAxes = (model.requireInvertedAxes) ? model.hAxes : model.vAxes;

                $.each(hAxes, function (index, hAxis) {
                    var all = 0, seriesCollection = [];
                    vAxeseries = [];
                    for (j = 0; j < visibleSeriesLength; j++) {
                        var series = model._visibleSeries[j];
                        if (series.visibility.toLowerCase() === 'visible') {
                            if (chart.isDependentSeries(series)) {
                                if (hAxis.name == series._xAxisName) {
                                    seriesCollection.push(series);
                                }
                            }
                        }
                    }
                    var seriesCollectionLength = seriesCollection.length;
                    for (j = 0; j < seriesCollectionLength; j++) {
                        var index = (model.requireInvertedAxes) ? seriesCollection[j].yAxis.columnIndex : seriesCollection[j].yAxis.rowIndex;
                        if (!vAxeseries[index]) {
                            vAxeseries[index] = [];
                            seriesCollection[j].yAxis.position = null;
                        }
                        vAxeseries[index].push(seriesCollection[j]);
                    }

                    for (i = 0; i < vAxeseries.length; i++) {
                        if (!ej.util.isNullOrUndefined(vAxeseries[i])) {
                            vAxeseries[i].all = 0;
                            for (j = 0; j < vAxeseries[i].length; j++) {
                                series = vAxeseries[i][j];
                                if (series.type.toLowerCase().indexOf("stacking") != -1) {
                                    if (series.stackingGroup) {
                                        if (ej.util.isNullOrUndefined(stackingGroup[series.stackingGroup])) {
                                            vAxeseries[i].all++;
                                            series.position = vAxeseries[i].all;
                                            stackingGroup[series.stackingGroup] = vAxeseries[i].all;
                                        }
                                        else
                                            series.position = stackingGroup[series.stackingGroup];
                                    }
                                    else {
                                        if (ej.util.isNullOrUndefined(series.yAxis.position) || model.legendCollapsed) {
                                            vAxeseries[i].all++;
                                            series.position = vAxeseries[i].all;
                                            series.yAxis.position = vAxeseries[i].all;
                                            model.legendCollapsed = false;
                                        }
                                        else
                                            series.position = series.yAxis.position;
                                    }
                                }
                                else {
                                    vAxeseries[i].all++;
                                    series.position = vAxeseries[i].all;
                                }
                            }
                        }
                    }
                    var columnWidth = seriesCollectionLength > 0 && seriesCollection[0].columnWidth;
                    for (k = 0; k < seriesCollectionLength; k++) {
                        var index = (model.requireInvertedAxes) ? seriesCollection[k].yAxis.columnIndex : seriesCollection[k].yAxis.rowIndex;
                        seriesCollection[k].all = vAxeseries[index].all;
                        params.needSpace = params.needSpace || columnWidth != seriesCollection[k].columnWidth
                    }

                });
                if (params.needSpace && this.chartObj.model._sideBySideSeriesPlacement)
                    this._getColumnSpacing(vAxeseries, params);
                params.spacingCalculated = true;
            }
            return { all: currentSeries.all, pos: currentSeries.position };
        },

        getSideBySideInfo: function (series, params) {
            if (ej.util.isNullOrUndefined(series.xAxis.m_minPointsDelta)) {
                this.chartObj.currentSeries = series;
                series.xAxis.m_minPointsDelta = ej.EjSvgRender.utils.getMinPointsDelta(series.xAxis, this.chartObj);
            }
            var spacing = series.columnSpacing,
                columnWidth = series.columnWidth,
                data = this.getSideBySidePositions(series, params),
                pos = data.pos,
                all = data.all,
                needSpace = params.needSpace && this.chartObj.model._sideBySideSeriesPlacement,
                width = series.xAxis.m_minPointsDelta * (needSpace ? 1 : columnWidth),
                loc = needSpace ? params[series.name || series._name].loc : (pos - 1) / all - 0.5,
                range = this.getDoubleRange(loc, loc + (needSpace ? columnWidth : 1) / all);
            if (!this.chartObj.model._sideBySideSeriesPlacement)
                return this.getDoubleRange(-width / 2, width / 2);


            // multiplying with width  and scaling
            if (!range.IsEmpty) {
                range = this.getDoubleRange(range.Start * width, range.End * width);
                var radius = spacing * range.Delta;
                range = this.getDoubleRange(range.Start + radius / 2, range.End - radius / 2);
            }
            return range;
        },

        _getColumnSpacing: function (axesSeries, params) {
            var i = j = 0, length, len, series, name;
            for (len = axesSeries.length; i < len; i++) {
                var width = 0, stackingSeries = [], group = {};
                for (length = axesSeries[i].length; j < length; j++)
                    if ((series = axesSeries[i][j]).type.toLowerCase().indexOf("stacking") == -1)
                        width += series.columnWidth / series.all;
                    else
                        group[name = series.stackingGroup] = { width: Math.max(series.columnWidth, group[name] ? group[name].width : 0), all: series.all }
                for (var key in group)
                    width += group[key].width / group[key].all;

                var start = (1 - width) / 2 - .5;
                for (j = 0, length = axesSeries[i].length; j < length; j++) {
                    if ((series = axesSeries[i][j]).type.toLowerCase().indexOf("stacking") == -1) {
                        params[series.name || (series._name = "series" + i + j)] = { loc: start };
                        start += series.columnWidth / series.all;
                    }
                    else {
                        if (group[name = series.stackingGroup].loc == null) {
                            params[series.name || (series._name = "series" + i + j)] = { loc: start + (group[name].width - series.columnWidth) / 2 / series.all };
                            group[name].loc = params[series.name || series._name].loc + series.columnWidth / 2 / series.all;
                            start += group[name].width / series.all;
                        }
                        else
                            params[series.name || series._name] = { loc: group[name].loc - series.columnWidth / 2 / series.all };
                    }
                }
            }
        },

        _getPoint: function (point, xLength, yLength, xRange, xInversed, yRange, yInversed) {

            var x = point.xValue,
                y = point.YValues[0];

            x = (x - xRange.min) / (xRange.delta);
            y = (y - yRange.min) / (yRange.delta);

            return { X: (!xInversed ? x : 1 - x) * xLength, Y: (1 - (!yInversed ? y : 1 - y)) * yLength };
        },

        _getLogPoint: function (point, xLength, yLength, xRange, xInversed, yRange, yInversed, series) {

            var x = point.xValue,
                y = point.YValues[0];
            if (series.xAxis._valueType.toLowerCase() == "logarithmic")
                x = (ej.EjSvgRender.utils._logBase((x == 0 ? 1 : x), series.xAxis.logBase) - xRange.min) / (xRange.delta);
            else
                x = (x - xRange.min) / (xRange.delta);

            if (series.yAxis._valueType.toLowerCase() == "logarithmic")
                y = (ej.EjSvgRender.utils._logBase((y == 0 ? 1 : y), series.yAxis.logBase) - yRange.min) / (yRange.delta);
            else
                y = (y - yRange.min) / (yRange.delta);

            return { X: (!xInversed ? x : 1 - x) * xLength, Y: (1 - (!yInversed ? y : 1 - y)) * yLength };
        },

        _getTransposedPoint: function (point, xLength, yLength, xRange, xInversed, yRange, yInversed) {

            var x = point.xValue,
                y = point.YValues[0];

            x = (x - xRange.min) / xRange.delta;
            y = (y - yRange.min) / yRange.delta;

            return { X: (!yInversed ? y : 1 - y) * yLength, Y: (1 - (!xInversed ? x : 1 - x)) * xLength };
        },

        _getTransposedLogPoint: function (point, xLength, yLength, xRange, xInversed, yRange, yInversed, series) {

            var x = point.xValue,
                y = point.YValues[0];

            if (series.xAxis._valueType.toLowerCase() == "logarithmic")
                x = (ej.EjSvgRender.utils._logBase((x == 0 ? 1 : x), series.xAxis.logBase) - xRange.min) / (xRange.delta);
            else
                x = (x - xRange.min) / (xRange.delta);

            if (series.yAxis._valueType.toLowerCase() == "logarithmic")
                y = (ej.EjSvgRender.utils._logBase((y == 0 ? 1 : y), series.yAxis.logBase) - yRange.min) / (yRange.delta);
            else
                y = (y - yRange.min) / (yRange.delta);

            return { X: (!yInversed ? y : 1 - y) * yLength, Y: (1 - (!xInversed ? x : 1 - x)) * xLength };
        },

        draw: function (chart, options, excludeDataUpdate) {

            //DrawLineGraph
            var lDirection, sb = ej.EjSvgRender.utils._getStringBuilder(),
                visiblePoints, limit, i, pathOptions,
                firstPoint, secondPoint, firstIndex,
                point1, point2, canvasX = chart.canvasX, canvasY = chart.canvasY,
                seriesIndex, nextPoint, context,
                previousStyle, styleOptions, point,
                requireInvertedAxes = chart.model.requireInvertedAxes,
                count = 0, isCanvas = chart.model.enableCanvasRendering,
                chartObj = chart, trans,
                isLog = options.xAxis._valueType.toLowerCase() == "logarithmic" || options.yAxis._valueType.toLowerCase() == "logarithmic",
                isTransposed = options._isTransposed,
                xLength = isTransposed ? options.xAxis.height : options.xAxis.width,
                yLength = isTransposed ? options.yAxis.width : options.yAxis.height,
                xRange = options.xAxis.visibleRange, yRange = options.yAxis.visibleRange,
                xInversed = options.xAxis.isInversed, yInversed = options.yAxis.isInversed,
                style, getPoint = this["_get" + (isTransposed ? "Transposed" : "") + (isLog ? "Log" : "") + "Point"];

            this.chartObj = chart;
            style = this.setLineSeriesStyle(options);
            options._animationType = "path";
            if (options.sorting)
                options.points = ej.DataManager(options.points, ej.Query().sortBy("xValue")).executeLocal();
            options._visiblePoints = undefined;
            visiblePoints = this.improveChartPerformance(options);

            limit = { min: 0, max: visiblePoints.length };
            if (!options.pointFill) {
                if (isCanvas) {
                    context = chart.svgRenderer.ctx;
                    context.save();
                    context.beginPath();
                    if (chart.model.AreaType == "cartesianaxes") {
                        trans = ej.EjSvgRender.utils._getTransform(options.xAxis, options.yAxis, requireInvertedAxes);
                        trans = 'translate(' + trans.x + ',' + trans.y + ')'
                    }
                    styleOptions = {
                        'stroke-dasharray': options.dashArray,
                        'stroke-width': options.width,
                        'stroke': style.SeriesInterior,
                        'stroke-linecap': options.lineCap,
                        'stroke-linejoin': options.lineJoin,
                        'opacity': options.opacity
                    };
                    chart.svgRenderer._setLinePathStyle(styleOptions, trans);
                }
                firstPoint = null;
                secondPoint;
                firstIndex = -1;
                for (i = limit.min; i < limit.max; i++) {
                    secondPoint = visiblePoints[i];
                    if (secondPoint.visible !== false) {
                        if (firstPoint != null && visiblePoints.length > firstIndex + 1) {
                            nextpoint = visiblePoints[firstIndex + 1];
                            point1 = getPoint(firstPoint, xLength, yLength, xRange, xInversed, yRange, yInversed, options);
                            point2 = getPoint(nextpoint, xLength, yLength, xRange, xInversed, yRange, yInversed, options);
                            if (isCanvas) {
                                context.moveTo(point1.X + canvasX, point1.Y + canvasY);
                                context.lineTo(point2.X + canvasX, point2.Y + canvasY);
                            }
                            else
                                sb.append("M " + (point1.X + canvasX) + " " + (point1.Y + canvasY) + " L " + (point2.X + canvasX) + " " + (point2.Y + canvasY) + " ");
                        }
                        firstPoint = secondPoint;
                        firstIndex = i;
                    }
                    else
                        firstPoint = null;
                }
                if (isCanvas) {
                    context.stroke();
                    context.restore();
                }
                else
                    this._drawLinePath(options, style, sb.toString());
            }

            else {
                seriesIndex = $.inArray(options, this.chartObj.model._visibleSeries),
                    length = visiblePoints.length - 1;

                trans = ej.EjSvgRender.utils._getTransform(options.xAxis, options.yAxis, requireInvertedAxes);

                canvasX = chartObj.canvasX, canvasY = chartObj.canvasY,

                    serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

                this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

                for (i = 0; i < length; i++) {
                    point = visiblePoints[i];
                    nextpoint = visiblePoints[i + 1];

                    if (!previousStyle)
                        previousStyle = this.chartObj.setStyle(this, options, seriesIndex, i, undefined, visiblePoints);

                    if (nextpoint.visible && point.visible) {
                        point1 = ej.EjSvgRender.utils._getPoint(point, options);

                        point2 = ej.EjSvgRender.utils._getPoint(nextpoint, options);

                        sb.append("M" + " " + (point1.X + canvasX) + " " + ((point1.Y + canvasY)) + " " + "L" + " " + (point2.X + canvasX) + " " + ((point2.Y + canvasY)) + " ");
                    }

                    styleOptions = this.chartObj.setStyle(this, options, seriesIndex, i + 1, undefined, visiblePoints);

                    if (styleOptions.interior == previousStyle.interior && (i != length - 1) && nextpoint.visible)
                        continue;

                    pathOptions = {
                        'name': options.type,
                        'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + (count++),
                        'stroke-dasharray': previousStyle.dashArray,
                        'fill': "none",
                        'stroke-width': previousStyle.width,
                        'stroke-linecap': options.lineCap,
                        'stroke-linejoin': options.lineJoin,
                        'stroke': previousStyle.interior,
                        'opacity': previousStyle.opacity,
                        'd': sb.toString()
                    };

                    this.chartObj.svgRenderer.drawPath(pathOptions, this.gSeriesGroupEle);
                    sb = ej.EjSvgRender.utils._getStringBuilder();
                    previousStyle = styleOptions;
                }
            }
            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

            //Calculate visible points for points with data label
            if (options._dataLabels > 0 || options.marker && options.marker.dataLabel.visible == true && options.enableSmartLabels)
                options._visiblePoints = this._isVisiblePoints(options);
            else //Use sampled data points if data labels are not visible 
                options._visiblePoints = visiblePoints;
        },

        doCircularAnimation: function (chartObj, series, seriesType, seriesIndex, duration) {
            var type = series.type.toLowerCase();
            if (type == "pie" || type == "doughnut" || type == "pieofpie") {
                var seriesRender = this, startAngle, endAngle,
                    angle = (series.points[0]) ? series.points[0].startAngle : 0;
                var collectionIndex = chartObj.model._isPieOfPie ? series.collectionIndex : 0,
                    visiblePoints = series.emptyPointSettings.visible ? series.visiblePoints : series._visiblePoints;
                duration = !ej.util.isNullOrUndefined(duration) ? duration : 1200;
                $.each(visiblePoints, function (pointIndex, point) {
                    startAngle = point.startAngle;
                    endAngle = point.endAngle;
                    chartObj.model._radius = chartObj.model._isPieOfPie ? chartObj.model.circularRadius[collectionIndex] : chartObj.model.circularRadius[seriesIndex];
                    point.startAngle = 0;
                    point.endAngle = point.startAngle;
                    chartObj.model.Radius = 0;
                    var piePath = $(chartObj.gSeriesEle).find("#" + chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex)[collectionIndex].childNodes[pointIndex];
                    if (type == "pie" || type == "pieofpie") {
                        $(piePath).each(function () { this.StartAngle = angle, this.EndAngle = angle; }).animate(
                            { StartAngle: startAngle, EndAngle: endAngle, pieRadius: chartObj.model._radius },
                            {
                                duration: duration, queue: false, step: function (now, fx) {
                                    if (fx.prop.toString() === "StartAngle") {
                                        point.startAngle = now;
                                        point.endAngle = point.startAngle;
                                    }
                                    else if (fx.prop.toString() == "pieRadius" && chartObj.model)
                                        chartObj.model.Radius = now;
                                    else
                                        point.endAngle = now;
                                    if (chartObj.model) {
                                        var result = seriesRender._calculateArcData(chartObj, pointIndex, point, series, seriesIndex, collectionIndex);
                                        chartObj.svgRenderer._setAttr($(piePath), { "d": result.Direction });
                                        chartObj.model.Radius = chartObj.model._radius;
                                    }
                                },
                                complete: function () {
                                    seriesRender.circularAnimationComplete(pointIndex, chartObj, series);
                                }
                            });
                    }
                    else {
                        $(piePath).each(function () { this.StartAngle = angle, this.EndAngle = angle; }).animate(
                            { StartAngle: startAngle, EndAngle: endAngle },
                            {
                                duration: duration, queue: false, step: function (now, fx) {
                                    if (fx.prop.toString() === "StartAngle") {
                                        point.startAngle = now;
                                        point.endAngle = point.startAngle;
                                    }
                                    else
                                        point.endAngle = now;
                                    if (chartObj.model) {
                                        var result = seriesRender._calculateArcData(chartObj, pointIndex, point, series, seriesIndex);
                                        chartObj.svgRenderer._setAttr($(piePath), { "d": result.Direction });
                                        chartObj.model.Radius = chartObj.model._radius;
                                    }
                                },
                                complete: function () {
                                    seriesRender.circularAnimationComplete(pointIndex, chartObj, series);
                                }
                            });
                    }
                });
            }
        },
        circularAnimationComplete: function (pointIndex, chartObj, series) {
            if (!ej.util.isNullOrUndefined(chartObj.model)) {
                var commonEventArgs, i, seriesIndex = $.inArray(series, chartObj.model._visibleSeries), elements;
                if (chartObj.gSeriesTextEle[seriesIndex])
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gSeriesTextEle[seriesIndex].id), { "visibility": "visible" });
                if (chartObj.gSymbolGroupEle[seriesIndex])
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gSymbolGroupEle[seriesIndex].id), { "visibility": "visible" });
                if (chartObj.gDataLabelEle[seriesIndex])
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gDataLabelEle[seriesIndex].id), { "visibility": "visible" });
                if (series.marker.dataLabel.template) {
                    elements = $(chartObj.element[0].childNodes[0].childNodes);
                    for (i = 0; i < elements.length; i++)
                        $(elements[i]).css('display', 'block');
                }
                if (chartObj.gConnectorEle[seriesIndex])
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gConnectorEle[seriesIndex].id), { "visibility": "visible" });
                if (chartObj.gConnectorLinesGroup)
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gConnectorLinesGroup.id), { "visibility": "visible" });
                chartObj.model.AnimationComplete = true;
                series.AnimationComplete = true;
                commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { series: series };
                chartObj._trigger("animationComplete", commonEventArgs);
            }
        },

        _doLineSymbol: function (element, sec, val, series, invertedAxes, chartobj, duration) {
            if (element.tagName != "defs") {
                var beginTime = parseInt(val * sec),
                    chartObj = (this.chartObj == undefined) ? chartobj : this.chartObj,
                    box = ej.EjSvgRender.utils._getBoundingClientRect(element, chartObj, series, invertedAxes),
                    centerX = box.x + (box.width / 2),
                    centerY = box.y + (box.height / 2),
                    scaleVal, $ele = $(element),
                    rotate = chartObj.svgRenderer._getAttrVal($ele, "transform");
                rotate = !ej.util.isNullOrUndefined(rotate) ? rotate : " ";
                chartObj.svgRenderer._setAttr($ele, { "transform": "scale(0)" });
                $ele.delay(beginTime).animate(
                    {
                        scales: 1
                    },
                    {
                        duration: duration,
                        step: function (now) {
                            scaleVal = now;
                            chartObj.svgRenderer._setAttr($ele, { "transform": "translate(" + centerX + " " + centerY + ") scale(" + scaleVal + ") translate(" + (-centerX) + " " + (-centerY) + ")" + rotate });

                        }
                    }
                );
            }
        },
        animateSymbol: function (element, delayInterval, series, invertedAxes, chartobj, duration) {
            if (element.tagName != "defs") {
                var chartObj = (this.chartObj == undefined) ? chartobj : this.chartObj,
                    box = ej.EjSvgRender.utils._getBoundingClientRect(element, chartObj, series, invertedAxes),
                    centerX = box.x + (box.width / 2),
                    centerY = box.y + (box.height / 2),
                    scaleVal, $ele = $(element),
                    rotate = chartObj.svgRenderer._getAttrVal($ele, "transform");
                rotate = !ej.util.isNullOrUndefined(rotate) ? rotate : " ";
                $ele.delay(delayInterval).each(function () { this.scale = 0.5; }).animate(
                    {
                        scales: 1
                    },
                    {
                        duration: duration,
                        step: function (now) {
                            scaleVal = now;
                            chartObj.svgRenderer._setAttr($ele, { "transform": "translate(" + centerX + " " + centerY + ") scale(" + scaleVal + ") translate(" + (-centerX) + " " + (-centerY) + ")" + (rotate) });
                        }
                    }
                );
            }
        },
        animateCylinder: function (chartObj, series, invertedAxes, clipRect, duration) {
            if (series.isTransposed && invertedAxes) {
                var width = clipRect[0].width.animVal.value
                if (chartObj.model.series[0].type.indexOf("bar") > -1) {
                    chartObj.svgRenderer._setAttr($(clipRect), { "x": width });
                    $(clipRect).animate({
                        x: 0,
                    }, duration, function () {
                    });
                }
                else {
                    var height = clipRect[0].height.animVal.value;
                    chartObj.svgRenderer._setAttr($(clipRect), { "y": 0 });
                    $(clipRect).animate(
                        {
                            y: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "y")),
                            height: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "height"))
                        },
                        {
                            duration: duration,
                            step: function (now) {
                                chartObj.svgRenderer._setAttr($(clipRect), { "y": height - now });
                                chartObj.svgRenderer._setAttr($(clipRect), { "height": now });
                            }
                        });
                }
            }
            else {
                if (chartObj.model.series[0].type.indexOf("bar") > -1) {
                    $(clipRect).animate(
                        {
                            width: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "width"))
                        },
                        {
                            duration: duration,
                            step: function (now) {
                                chartObj.svgRenderer._setAttr($(clipRect), { "width": now });
                            }
                        });
                }
                else {
                    var height = clipRect[0].height.animVal.value;
                    chartObj.svgRenderer._setAttr($(clipRect), { "y": height });
                    $(clipRect).animate({

                        y: 0,
                    }, duration, function () {
                    });
                }
            }
        },
        animateRect: function (element, series, invertedAxes, chartObj, duration) {
            var animationType = series.animationType.toLowerCase();
            var box = ej.EjSvgRender.utils._getBoundingClientRect(
                animationType == "smooth" ? element[0] : element, chartObj, series, invertedAxes
            ), centerX, centerY, scale1, scale2, scaleVal, $element = $(element), size, isBar;
            if ((series.isTransposed && invertedAxes) || invertedAxes) {
                size = animationType == "smooth" ? parseFloat(chartObj.svgRenderer._getAttrVal(element, "width")) : 0;
                isBar = true;
                if (chartObj.svgRenderer._getAttrVal($element, "plot") === "negative") {
                    centerX = box.x + box.width;
                    centerY = box.y + box.height;
                } else {
                    centerX = box.x;
                    centerY = box.y;
                }
                scale1 = ") scale(";
                scale2 = ",1) translate(";
            }
            else {
                size = animationType == "smooth" ? parseFloat(chartObj.svgRenderer._getAttrVal(element, "height")) : 0;
                isBar = false;
                if (chartObj.svgRenderer._getAttrVal($element, "plot") === "negative") {
                    centerX = box.x;
                    centerY = box.y;
                }
                else {
                    centerX = (box.x + box.width);
                    centerY = (box.y + box.height);
                }
                scale1 = ") scale(1,";
                scale2 = ") translate(";
            }
            var diff = Math.abs(
                ej.EjSvgRender.utils._getPointXY(
                    series.yAxis.visibleRange.min < 0 ? 0 : series.yAxis.visibleRange.min, series.yAxis.visibleRange, series.yAxis.isInversed
                ) * (isBar ? series.yAxis.width : series.yAxis.height)
            );

            $element.animate(
                {
                    scales: animationType == "smooth" ? size : 1
                },
                {
                    duration: duration,
                    complete: function () {
                        if (series.type.toLowerCase() == "waterfall")
                            $("#" + chartObj.svgObject.id + '_SeriesGroup' + '_waterfallLine_' + series.index).attr("visibility", "visible");
                    },
                    step: function (now) {
                        scaleVal = now;
                        if (animationType == "smooth") {
                            if (now) {
                                isBar ? chartObj.svgRenderer._setAttr($element, {
                                    'width': (diff + now) >= size ? size : now
                                }) : chartObj.svgRenderer._setAttr($element, {
                                    'height': now
                                });
                            }
                            isBar ? chartObj.svgRenderer._setAttr($element, { 'x': (diff + now) >= size ? (size  - now) : diff }) :
                                chartObj.svgRenderer._setAttr($element, { 'y': (size - diff - now) >= 0 ? (size - diff - now) : 0 });
                        } else {
                            chartObj.svgRenderer._setAttr($element, { "transform": "translate(" + centerX + " " + centerY + scale1 + scaleVal + scale2 + (-centerX) + " " + (-centerY) + ")" });
                        }
                    }
                });
        },
        animateStackingRect: function (element, series, invertedAxes, chartObj, duration) {
            var centerX, centerY, scale1, scale2, $element = $(element), boxX, boxY, scaleVal,
                box = ej.EjSvgRender.utils._getBoundingClientRect(element, chartObj, series, invertedAxes);
            if ((series.isTransposed && invertedAxes) || invertedAxes) {
                boxX = (ej.EjSvgRender.utils._valueToCoefficient(series.yAxis, 0)) * (series.yAxis.width);
                centerX = boxX;
                centerY = box.y;
                scale1 = ") scale(";
                scale2 = ",1) translate(";
            }
            else {
                boxY = (1 - ej.EjSvgRender.utils._valueToCoefficient(series.yAxis, 0)) * (series.yAxis.height);
                centerX = box.x;
                centerY = boxY;
                scale1 = ") scale(1,";
                scale2 = ") translate(";
            }
            $element.animate(
                {
                    scales: 1
                },
                {
                    duration: duration,

                    step: function (now) {
                        scaleVal = now;
                        chartObj.svgRenderer._setAttr($element, { "transform": "translate(" + centerX + " " + centerY + scale1 + scaleVal + scale2 + (-centerX) + " " + (-centerY) + ")" });
                    }
                });
        },
        _doLineAnimation: function (chartObj, clipRect, duration) {
            var duration = !ej.util.isNullOrUndefined(duration) ? duration : 2000;
            var animationReversed = chartObj.model.primaryXAxis.isInversed;
            var width = parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "width"));
            if (chartObj.model.requireInvertedAxes) {
                var height = parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "height"));
                //Animation for transposed series is working from top to bottom instead of bottom to top
                //In some scenario, series is not appearing because clip rect location gets changed
                //chartObj.svgRenderer._setAttr($(clipRect), { "y": height });
                $(clipRect).animate(
                    {
                        //y: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "y")),
                        clipRectHeight: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "height"))
                    },
                    {
                        duration: duration,
                        step: function (now) {
                            chartObj.svgRenderer._setAttr($(clipRect), { "y": height - now });
                            chartObj.svgRenderer._setAttr($(clipRect), { "height": now });
                        }
                    });
            }
            else {
                $(clipRect).animate(
                    {
                        clipRectWidth: parseFloat(chartObj.svgRenderer._getAttrVal(clipRect, "width"))
                    },
                    {
                        duration: duration,
                        step: function (now) {
                            if (animationReversed)
                                chartObj.svgRenderer._setAttr($(clipRect), { "x": width - now });
                            chartObj.svgRenderer._setAttr($(clipRect), { "width": now });
                        }
                    });
            }
        },

        _drawLinePath: function (series, style, direction) {
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var trans;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var translate = null;
            if (this.chartObj.model.AreaType == "cartesianaxes") {
                trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);
                translate = 'translate(' + trans.x + ',' + trans.y + ')'
            }

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': translate };
            this.chartObj.gSeriesGroupEle = this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            if (direction != "" && direction.indexOf("NaN") == -1) {
                var options = {

                    'id': this.chartObj.svgObject.id + "_Series" + seriesIndex,
                    'fill': 'none',
                    'stroke-dasharray': series.dashArray,
                    'stroke-width': series.width,
                    'stroke': style.SeriesInterior,
                    'stroke-linecap': series.lineCap,
                    'stroke-linejoin': series.lineJoin,
                    'opacity': series.opacity,
                    'd': direction
                };
                if (this.chartObj.dragPoint) {
                    options.id = this.chartObj.svgObject.id + "_PreviewSeries" + seriesIndex;
                    options.opacity = 0.6;
                    if (this.chartObj.model.enableCanvasRendering) this.chartObj.svgRenderer.drawPath(options, this.chartObj.canvasElement, translate);
                    else this.chartObj.svgRenderer.drawPath(options, this.chartObj.gPreviewSeriesGroupEle);
                }
                else
                    this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);
            }


        },

        _applySaturation: function (chartObj, pointColor) {
            var format, color, rgbValue, contrast;
            format = ej.EjSvgRender.prototype.checkColorFormat(pointColor);
            if (!format)
                pointColor = chartObj.colorNameToHex(pointColor);
            rgbColorValue = ej.EjSvgRender.prototype.hexToRGB(pointColor);
            contrast = Math.round(((parseInt(rgbColorValue.R) * 299) + (parseInt(rgbColorValue.G) * 587) + (parseInt(rgbColorValue.B) * 114)) / 1000);
            color = (contrast >= 128) ? "black" : "white";
            return color;
        },



        drawDataLabel: function (series, index, point, x, y, chartRegionIndex, params, outlier) {
            // method for data label symbols - cartesianaxes
            point.marker = point.marker ? point.marker : {};
            var labelFormat = series.yAxis.labelFormat, labelPrecision, labelPrecisionDefault = 6, labelPrecisionHighest = 20,
                valueType = series.yAxis.valueType, pointText,
                boxPlotLabels = series._visiblePoints[index].boxPlotValues,
                value = (series.type.toLowerCase() == "waterfall" && (point.showIntermediateSum || point.showTotalSum)) ? point.waterfallSum : point.y;
            if (point.text)
                pointText = point.text;
            else if (labelFormat) {
                if (labelFormat.indexOf("{value}") > -1)
                    pointText = labelFormat.replace("{value}", value);
                else if (labelFormat.indexOf('e') == 0 || labelFormat.indexOf('E') == 0) {
                    labelPrecision = labelFormat.match(/(\d+)/g);
                    labelPrecision = labelPrecision == null ? labelPrecisionDefault : labelPrecision > labelPrecisionHighest ? labelPrecisionHighest : labelPrecision;
                    pointText = value.toExponential(labelPrecision);
                }
                else pointText = ej.format(value, labelFormat, this.chartObj.model.locale);
            }
            else pointText = value;
            var chart = this.chartObj,
                chartModel = chart.model,
                seriesIndex = $.inArray(series, chartModel._visibleSeries),
                textAlign, element, fontBackgroundColor,
                textBaseline, symbolName,
                marker = $.extend(true, {}, series.marker, point.marker),
                dataLabel = marker.dataLabel, areaBounds = chartModel.m_AreaBounds,
                dataLabelFont = dataLabel.font,
                textPosition = dataLabel.textPosition.toLowerCase(),
                type = series.type.toLowerCase(), isCanvas = chartModel.enableCanvasRendering,
                regiontype = ej.seriesTypes[type].prototype.isRegion,
                size = ej.util.isNullOrUndefined(dataLabelFont.size) ? "11px" : dataLabelFont.size,
                fontStyle = ej.util.isNullOrUndefined(dataLabelFont.fontStyle) ? "Normal" : dataLabelFont.fontStyle,
                fontFamily = ej.util.isNullOrUndefined(dataLabelFont.fontFamily) ? "Segoe UI" : dataLabelFont.fontFamily,
                labelfont = { size: size, fontStyle: fontStyle, fontFamily: fontFamily },
                textOffset = ej.EjSvgRender.utils._measureText(pointText, null, labelfont),
                position = this.textPosition(series, seriesIndex, point, textOffset, type, x, y, chartRegionIndex, index, params),
                commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs), contrastColor = dataLabel.enableContrastColor,
                chartAreaBackground = chartModel.chartArea.background.toLowerCase(), chartBackground = chartModel.background.toLowerCase();
            commonEventArgs.data = { text: pointText, location: { x: position.x + chart.canvasX, y: position.y + chart.canvasY }, seriesIndex: seriesIndex, pointIndex: index };
            if (series.isStacking && series.drawType == "area" && ((series.type == "polar") || (series.type == "radar"))) {
                commonEventArgs.data.text = series.stackedValue.EndValues[index] - series.stackedValue.StartValues[index];
            }
            chart._trigger("displayTextRendering", commonEventArgs);
            var dataLabelOffset = (marker.dataLabel.offset.y == undefined) ? marker.dataLabel.offset : marker.dataLabel.offset.y;
            var xval = marker.dataLabel.offset.x;
            var textOffset = ej.EjSvgRender.utils._measureText(commonEventArgs.data.text, null, labelfont);
            if (textPosition == 'bottom')
                commonEventArgs.data.location.y = commonEventArgs.data.location.y + dataLabelOffset;
            else
                commonEventArgs.data.location.y = commonEventArgs.data.location.y - dataLabelOffset;
            if (xval)
                commonEventArgs.data.location.x = commonEventArgs.data.location.x + xval;

            if (!commonEventArgs.cancel) {
                var options = {
                    'id': chart.svgObject.id + '_SeriesText' + index + seriesIndex,
                    'x': commonEventArgs.data.location.x,
                    'y': commonEventArgs.data.location.y,
                    'fill': dataLabelFont.color,
                    'font-size': dataLabelFont.size,
                    'font-family': dataLabelFont.fontFamily,
                    'font-style': dataLabelFont.fontStyle,
                    'font-weight': dataLabelFont.fontWeight,
                    'opacity': dataLabelFont.opacity,

                    'text-anchor': 'middle'
                };
                var margin = dataLabel.margin,
                    width = textOffset.width + margin.left + margin.right,
                    height = textOffset.height + margin.top + margin.bottom,
                    location = { X: commonEventArgs.data.location.x, Y: commonEventArgs.data.location.y };

                if (ej.util.isNullOrUndefined(dataLabel.template)) {
                    if (dataLabel.shape)
                        element = dataLabel.shape;
                    else
                        element = "None";
                    $.each(chartModel.symbolShape, function (name) {
                        if (element.toLowerCase() == name.toLowerCase())
                            symbolName = name;
                    });

                    var xXalue = commonEventArgs.data.location.x - (margin.left) / 2 + (margin.right) / 2,
                        yValue = commonEventArgs.data.location.y - (margin.top) / 2 - (height / margin.top) + (margin.bottom) / 2,
                        degree = dataLabel.angle,
                        angle = (degree > 360) ? degree - 360 : (degree < -360) ? degree + 360 : degree;




                    //For accurate placement of rotated data labels in canvas
                    if (chartModel.enableCanvasRendering && (degree % 360 != 0)) {
                        options.y -= textOffset.height / 4;
                        options.baseline = 'middle';
                    }

                    if (dataLabel.showEdgeLabels) {
                        xPos = isCanvas ? options.x - chart.canvasX : options.x;
                        yPos = isCanvas ? options.y - chart.canvasY : options.y;
                        textWidth = textOffset.width;
                        textHeight = textOffset.height;
                        var isLastLabelOut = (series._visiblePoints[series._visiblePoints.length-1] == point) && xPos + textWidth / 2 >= chart.model.m_AreaBounds.Width;
                        if (xPos - textWidth / 2 < 0 || xPos < -textWidth / 2 || isLastLabelOut) {
                            diff = xPos - textWidth / 2;
                            options.x = xXalue = Math.abs(diff) + (!isLastLabelOut ? xPos + 10 : - 10);
                        }
                        else if (xPos + textWidth / 2 > areaBounds.textWidth || xPos + textWidth / 2 > areaBounds.textWidth + textWidth / 2) {
                            diff = xPos - textWidth / 2;
                            options.x = xXalue = areaBounds.textWidth - textWidth / 2 - 10;
                        }
                        if (yPos + textHeight / 2 > areaBounds.textHeight || yPos + textHeight / 2 > areaBounds.textHeight + textHeight / 2) {
                            diff = yPos + textHeight / 2 - areaBounds.textHeight;
                            yValue = yPos - diff - 10;
                            options.y = yValue + 5;
                        }
                        else if (yPos - textHeight / 2 < 0 || yPos < -textHeight / 2) {
                            diff = yPos - textHeight / 2;
                            yValue += Math.abs(diff) + 10;
                            options.y = yValue + 5;
                        }
                    }
                    if (series._enableSmartLabels) {
                        point.dataLabel = { textX: options.x, textY: options.y, x: xXalue, y: yValue, width: width, height: height }
                        point.margin = { top: margin.top, bottom: margin.bottom }
                    }
                    // to get the point color for saturation
                    pointColor = jQuery.type(chartModel.seriesColors[seriesIndex]) == "array" ?
                        chartModel.seriesColors[seriesIndex][0].color : chartModel.seriesColors[seriesIndex];
                    pointColor = point.fill ? jQuery.type(point.fill) == "array" ? point.fill[0].color : point.fill : pointColor;
                    if (contrastColor) {
                        fontBackgroundColor = !regiontype || textPosition == "top" ?
                            (chartAreaBackground === "transparent" && chartBackground === "transparent") ? "white" : (chartAreaBackground != "transparent") ?
                                chartAreaBackground : chartBackground : pointColor;
                        options.fill = this._applySaturation(chart, fontBackgroundColor);
                    }

                    if (point.y == point.low && !(point.y === undefined && point.low === undefined)) //undefined condition checked for waterfall series sum value display
                    {
                        point.xPosLow = xXalue;
                        point.yPosLow = yValue;
                        point.widthLow = (symbolName == "None") ? textOffset.width : width;
                        point.heightLow = (symbolName == "None") ? textOffset.height : height;
                        point.textOptionsLow = options;
                        point.textOptionsLow.angle = angle;
                        point.drawTextLow = commonEventArgs.data.text;
                    }
                    else if (type.toLowerCase() == "boxandwhisker" && (boxPlotLabels.midvalue != point.y)) {
                        var textOptionsBox = {
                            'id': chart.svgObject.id + '_SeriesText' + index + seriesIndex,
                            'x': ej.util.isNullOrUndefined(outlier) ? commonEventArgs.data.location.x : xXalue,
                            'y': ej.util.isNullOrUndefined(outlier) ? commonEventArgs.data.location.y : yValue,
                            'fill': dataLabelFont.color,
                            'font-size': dataLabelFont.size,
                            'font-family': dataLabelFont.fontFamily,
                            'font-style': dataLabelFont.fontStyle,
                            'font-weight': dataLabelFont.fontWeight,
                            'opacity': dataLabelFont.opacity,

                            'text-anchor': 'middle',
                        };
                        var boxLabelCount = point.textOptionsBoxValues.length;

                        point.textOptionsBoxValues[boxLabelCount] = textOptionsBox;
                        if (angle != 0)
                            point.textOptionsBoxValues[boxLabelCount].angle = angle;
                        point.textOptionsBoxValues[boxLabelCount].drawText = commonEventArgs.data.text;
                        point.textOptionsBoxValues[boxLabelCount].index = index;
                        point.textOptionsBoxValues[boxLabelCount].xPos = ej.util.isNullOrUndefined(outlier) ? xXalue : xXalue - (margin.left) / 2 + (margin.right) / 2;
                        point.textOptionsBoxValues[boxLabelCount].yPos = ej.util.isNullOrUndefined(outlier) ? yValue : yValue - (margin.top) / 2 - (height / margin.top) + (margin.bottom) / 2;
                        point.textOptionsBoxValues[boxLabelCount].seriesIndex = seriesIndex;
                        point.textOptionsBoxValues[boxLabelCount].width = (symbolName == "None") ? textOffset.width : width;
                        point.textOptionsBoxValues[boxLabelCount].height = (symbolName == "None") ? textOffset.height : height;
                        point.textOptionsBoxValues[boxLabelCount].symbolName = symbolName;

                    }

                    else {
                        // storing the values in point
                        point.textOptions = options;

                        if (angle != 0)
                            point.textOptions.angle = angle;
                        point.drawText = commonEventArgs.data.text;
                        point.index = index;
                        point.xPos = xXalue;
                        point.yPos = yValue;
                        point.seriesIndex = seriesIndex;
                        point.width = (symbolName == "None") ? textOffset.width : width;
                        point.height = (symbolName == "None") ? textOffset.height : height;
                        if (angle == 90 || angle == -90) //Swapping datalabel text height and width value
                            point.width = [point.height, point.height = point.width][0];

                        point.symbolName = symbolName;
                    }
                }
                else {
                    location.X -= chart.canvasX;
                    location.Y -= chart.canvasY;
                    this.drawLabelTemplate(series, point, index, location, chart);
                }
                // to test the datalabel whether it is placed inside / outside the region in column and bar series 
                if ((type.indexOf("column") > -1 || type.indexOf("bar") > -1) && contrastColor) {
                    var region = chart.model.chartRegions[chartRegionIndex];
                    var group = params.stackingGroup;
                    if (textPosition == "top" && type.indexOf("stacking") > -1) {// to apply the saturation color for the datalabel in stacking column top position 
                        if (ej.util.isNullOrUndefined(series.stackingGroup) || series.stackingGroup == "") {
                            if (seriesIndex < chartModel._visibleSeries.length - 1) {
                                pointColor = jQuery.type(chartModel.seriesColors[seriesIndex + 1]) == "array" ?
                                    chartModel.seriesColors[seriesIndex + 1][0].color : chartModel.seriesColors[seriesIndex + 1];
                                pointColor = point.fill ? jQuery.type(point.fill) == "array" ? point.fill[0].color : point.fill : pointColor;
                                fontBackgroundColor = pointColor;
                            }
                            else
                                fontBackgroundColor = (chartAreaBackground === "transparent" && chartBackground === "transparent") ?
                                    "white" : (chartAreaBackground != "transparent") ? chartAreaBackground : chartBackground;
                        }
                        else { // stacking along with grouping 
                            for (var key in group) {
                                if (key == series.stackingGroup && seriesIndex < group[key].length - 1) {
                                    pointColor = jQuery.type(chartModel.seriesColors[seriesIndex + 1]) == "array" ?
                                        chartModel.seriesColors[seriesIndex + 1][0].color : chartModel.seriesColors[seriesIndex + 1];
                                    pointColor = point.fill ? jQuery.type(point.fill) == "array" ? point.fill[0].color : point.fill : pointColor;
                                    fontBackgroundColor = pointColor;
                                    break;
                                }
                                else {
                                    fontBackgroundColor = (chartAreaBackground === "transparent" && chartBackground === "transparent") ?
                                        "white" : (chartAreaBackground != "transparent") ? chartAreaBackground : chartBackground;
                                    break;
                                }
                            }
                        }
                        options.fill = this._applySaturation(chart, fontBackgroundColor);
                    }
                    else { // when the textposition is middle/bottom to check whether the datalabel lies within the region
                        collide = ej.ejChart.isCollide(region, point, 0, contrastColor, chart);
                        if ((textPosition == "bottom" || textPosition == "middle") && !collide.state) {
                            fontBackgroundColor = (chartAreaBackground === "transparent" && chartBackground === "transparent") ?
                                "white" : (chartAreaBackground != "transparent") ? chartAreaBackground : chartBackground;
                            options.fill = this._applySaturation(chart, fontBackgroundColor);
                        }
                    }
                }
            }
        },

        //smart labels for pie and doughnut

        updateSmartLabelPosition: function (currentseries, point, pointIndex, bounds, midAngle, startPoint, textOffset, size, sender, seriesIndex) {
            var renderingPoints = [],
                chartObj = sender,
                chartModel = chartObj.model,
                legend = chartModel.legend,
                legendActualBounds = chartModel.LegendActualBounds,
                legendPosition = legend.position.toLowerCase(),
                seriesType = new ej.seriesTypes[currentseries.type.toLowerCase()](),
                connectorDirection = "",
                bezierPoints = "",
                connectorX = bounds.connector.connectorX,
                connectorY = bounds.connector.connectorY,
                midX = bounds.midPoint.midX,
                midY = bounds.midPoint.midY,
                dMidX = bounds.doughnutMidPoint.dMidX,
                dMidY = bounds.doughnutMidPoint.dMidY,
                startX = startPoint.startX,
                startY = startPoint.startY,
                marker = $.extend(true, {}, currentseries.marker, point.marker),
                textGap = (marker.dataLabel.template) ? 0 : 4,
                outerX, positionX, positionY,
                radius,
                isIntersectedLabel,
                angle = midAngle,
                smartAngle = (currentseries.startAngle > currentseries.endAngle) ? -0.01 : 0.01,
                connectorType = marker.dataLabel.connectorLine.type.toLowerCase(),
                previousLeft, type = currentseries.type.toLowerCase(),
                radius = chartModel._isPieOfPie ? chartModel.circularRadius[currentseries.collectionIndex] : chartModel.circularRadius[seriesIndex],
                labelPosition = type == "pieofpie" ? "inside" : currentseries.labelPosition.toLowerCase();
            if (ej.util.isNullOrUndefined(chartModel.bounds[seriesIndex])) {
                chartModel.bounds[seriesIndex] = [];
                chartModel.bounds[seriesIndex].points = [];
                if (labelPosition == 'outsideextended') {
                    chartModel.bounds[seriesIndex].points["left"] = [];
                    chartModel.bounds[seriesIndex].points["right"] = [];
                }
            }

            //calculation for inside labels
            if (labelPosition == 'inside' && ej.util.isNullOrUndefined(point.smartLabelPosition)) {
                positionX = (midX + startX) / 2;
                positionY = (midY + startY) / 2;

                positionX = (midX + positionX) / 2;
                positionY = (midY + positionY) / 2;

                if (point.isIntersected && chartModel.bounds[seriesIndex].points[point.index]) {
                    currBounds = chartModel.bounds[seriesIndex].points[point.index];
                }
                else {
                    if (midX > startX)
                        currBounds = { X: positionX, Y: positionY, Left: positionX, Top: positionY, Right: positionX + size.width, Bottom: positionY + size.height, SeriesIndex: seriesIndex, PointIndex: pointIndex };
                    else
                        currBounds = { X: positionX, Y: positionY, Left: positionX - size.width, Top: positionY, Right: positionX, Bottom: positionY + size.height, SeriesIndex: seriesIndex, PointIndex: pointIndex };
                }

                do {
                    isIntersectedLabel = false;
                    if (!this.IntersectWith(chartObj, point, currBounds, "inside", seriesIndex)) continue;
                    previousLeft = currBounds.Left;
                    var initialAngle = midAngle * 180 / Math.PI;

                    //convert radian to degree and break the loop after complete the 360 degree 
                    var degree = angle * 180 / Math.PI;
                    // chart start the angle from -90. So it will be skip in 270 degree
                    if (((degree - initialAngle) >= 270)) continue;

                    angle += smartAngle;
                    point.isIntersected = true;
                    currBounds.Angle = angle;
                    if (midX > startX) {
                        currBounds.X = currBounds.Left = seriesType.getXCordinate(startX, (radius) + textOffset, angle);
                        currBounds.Right = currBounds.X + size.width;
                    }
                    else {
                        currBounds.X = currBounds.Right = seriesType.getXCordinate(startX, (radius) + textOffset, angle);
                        currBounds.Left = currBounds.Right - size.width;
                    }
                    currBounds.Y = currBounds.Top = seriesType.getYCordinate(startY, (radius) + textOffset, angle);
                    currBounds.Bottom = currBounds.Y + size.height;
                    isIntersectedLabel = true;
                } while (isIntersectedLabel)
                if (midX > startX && currBounds.X < startX) {
                    currBounds.Right = previousLeft;
                    currBounds.Left = previousLeft - size.width;
                }
                chartModel.bounds[seriesIndex].points[pointIndex] = currBounds;


                if (point.isIntersected && chartModel.bounds[seriesIndex].points[pointIndex].Angle) {

                    positionX = seriesType.getXCordinate(startX, (radius) + textOffset, chartModel.bounds[seriesIndex].points[pointIndex].Angle);
                    positionY = seriesType.getYCordinate(startY, (radius) + textOffset, chartModel.bounds[seriesIndex].points[pointIndex].Angle);

                    var connectorMidX = seriesType.getXCordinate(startX, (radius) + textOffset / 3, midAngle);
                    var connectorMidY = seriesType.getYCordinate(startY, (radius) + textOffset / 3, midAngle);
                    renderingPoints.push({ X: midX, Y: midY });
                    renderingPoints.push({ X: connectorMidX, Y: connectorMidY });
                    renderingPoints.push({ X: positionX, Y: positionY });
                    if (point.isIntersected && connectorType == 'bezier' && !chartObj.vmlRendering) {
                        bezierPoints = seriesType.drawBezierSegment(renderingPoints, currentseries, pointIndex, chartObj, seriesIndex);
                    }
                    connectorDirection = "M" + " " + midX + " " + midY + " " + "L" + " " + connectorMidX + " " + connectorMidY + " " + "M" + " " + connectorMidX + " " + connectorMidY + " " + "L" + " " + positionX + " " + positionY;

                }
            }

            //calculation for outside labels
            else if (labelPosition == 'outside' || point.smartLabelPosition == "outside") {

                if (midX >= startX)
                    currBounds = { X: connectorX, Y: connectorY, Left: connectorX, Top: connectorY, Right: connectorX + size.width, Bottom: connectorY + size.height, SeriesIndex: seriesIndex, PointIndex: pointIndex };
                else
                    currBounds = { X: connectorX, Y: connectorY, Left: connectorX - size.width, Top: connectorY, Right: connectorX, Bottom: connectorY + size.height, SeriesIndex: seriesIndex, PointIndex: pointIndex };

                do {
                    isIntersectedLabel = false;
                    if (!this.IntersectWith(chartObj, point, currBounds, "outside", seriesIndex, size)) continue;
                    previousLeft = currBounds.Left;
                    angle += smartAngle;
                    point.isIntersected = true;
                    if (midX > startX || currentseries.startAngle <= 0) {
                        currBounds.X = currBounds.Left = seriesType.getXCordinate(startX, (radius) + textOffset, angle);
                        currBounds.Right = currBounds.X + size.width;
                    }
                    else {
                        currBounds.X = currBounds.Right = seriesType.getXCordinate(startX, (radius) + textOffset, angle);
                        currBounds.Left = currBounds.Right - size.width;
                    }

                    currBounds.Y = currBounds.Top = seriesType.getYCordinate(startY, (radius) + textOffset, angle);
                    currBounds.Bottom = currBounds.Y + size.height;
                    isIntersectedLabel = true;
                } while (isIntersectedLabel)
                if (midX > startX && currBounds.X < startX) {
                    currBounds.Right = previousLeft;
                    currBounds.Left = previousLeft - size.width;
                }
                chartModel.bounds[seriesIndex].points[pointIndex] = currBounds;
                var connectorMidX = seriesType.getXCordinate(startX, (radius) + textOffset / 3, midAngle);
                var connectorMidY = seriesType.getYCordinate(startY, (radius) + textOffset / 3, midAngle);

                renderingPoints.push({ X: midX, Y: midY });
                renderingPoints.push({ X: connectorMidX, Y: connectorMidY });
                renderingPoints.push({ X: currBounds.X, Y: currBounds.Y });
                positionX = currBounds.X;
                positionY = currBounds.Y;
                if (textOffset > 0) {
                    if (midX < startX) {
                        outerX = currBounds.X - chartModel.elementSpacing;
                        positionX = outerX - textGap;
                    }
                    else {
                        outerX = currBounds.X + chartModel.elementSpacing;
                        positionX = outerX + textGap;
                    }
                    renderingPoints.push({ X: outerX, Y: currBounds.Y });
                }
                if (connectorType == 'bezier' && !chartObj.vmlRendering) {
                    bezierPoints = seriesType.drawBezierSegment(renderingPoints, currentseries, pointIndex, chartObj, seriesIndex);
                }
                else {
                    connectorDirection = "M" + " " + midX + " " + midY + " " + "L" + " " + connectorMidX + " " + connectorMidY + " " + "M" + " " + connectorMidX + " " + connectorMidY + " " + "L" + " " + currBounds.X + " " + currBounds.Y + " " + "M" + " " + currBounds.X + " " + currBounds.Y + " " + "L" + " " + outerX + " " + currBounds.Y;
                }

            }


            //calculation for outsideExtended labels
            else {
                var labelX = midX;
                var labelY = midY;

                midX = midX + (Math.cos((midAngle)) * (-(radius / 10)));
                midY = midY + (Math.sin((midAngle)) * (-(radius / 10)));

                var connectorHeight = radius / 4;

                renderingPoints.push({ X: midX, Y: midY });
                midX = midX + (Math.cos((midAngle)) * connectorHeight);
                midY = midY + (Math.sin((midAngle)) * connectorHeight);

                renderingPoints.push({ X: midX, Y: midY });

                var legendWidth = (legend.visible && legendPosition == "left") ? (chartModel.margin.left + legendActualBounds.Width) : 0;
                var centerX = chartModel.circleCenterX[seriesIndex];
                var labelEdge, connectorLineEdge;

                if (midX < startX) {

                    midX = ((centerX - radius - (connectorHeight * 2) - currentseries.LeftLabelMaxWidth > 0)
                        ? centerX - radius - (connectorHeight * 2) + legendWidth
                        : (currentseries.LeftLabelMaxWidth > labelX) ? labelX : currentseries.LeftLabelMaxWidth + legendWidth) - size.width / 2;

                    labelEdge = renderingPoints[1].X - currentseries.LeftLabelMaxWidth;

                    var height = (centerX - radius - (connectorHeight * 2) - currentseries.LeftLabelMaxWidth > 0) ? connectorHeight
                        : (currentseries.LeftLabelMaxWidth > labelX) ? 0
                            : (labelEdge > 3 * (connectorHeight / 2)) ? connectorHeight : labelEdge / 2;

                    connectorLineEdge = +size.width / 2;

                }
                else {
                    var legendRight = (legend.visible && legendPosition == "right") ? (chartModel.margin.right + legendActualBounds.Width) : 0;
                    midX = ((centerX + radius + (connectorHeight * 2) + currentseries.RightLabelMaxWidth < $(chartObj.svgObject).width() - legendRight)
                        ? centerX + radius + (connectorHeight * 2) - legendWidth
                        : ((centerX + radius + currentseries.RightLabelMaxWidth) > $(chartObj.svgObject).width()) ? labelX : $(chartObj.svgObject).width() - currentseries.RightLabelMaxWidth - legendRight) + size.width / 2;


                    labelEdge = ($(chartObj.svgObject).width() - currentseries.RightLabelMaxWidth) - renderingPoints[1].X;

                    var height = (centerX + radius + (connectorHeight * 2) + currentseries.RightLabelMaxWidth < $(chartObj.svgObject).width()) ? connectorHeight
                        : ((centerX + radius + currentseries.RightLabelMaxWidth) > $(chartObj.svgObject).width()) ? 0
                            : (labelEdge > 3 * (connectorHeight / 2)) ? connectorHeight : labelEdge / 2;
                    connectorLineEdge = -size.width / 2;
                }

                var distanceFromOrigin = (Math.sqrt(Math.pow(labelX - midX, 2) + Math.pow(labelY - midY, 2))) / 10;

                var isLeft = (midX < startX) ? true : false;
                midX = isLeft ? midX + distanceFromOrigin : midX - distanceFromOrigin;
                var index = isLeft ? 1 : -1;

                var bounds = isLeft ? chartModel.bounds[seriesIndex].points["left"] : chartModel.bounds[seriesIndex].points["right"];
                var currBounds = { X: midX, Y: midY, Left: midX, Top: midY, Right: midX + size.width, Bottom: midY + size.height, index: pointIndex, SeriesIndex: seriesIndex, PointIndex: pointIndex };
                var clockwise = currentseries.endAngle > currentseries.startAngle ? true : false;
                if (this.IntersectWith(chartObj, point, currBounds, "outsideExtended", seriesIndex)) {
                    renderingPoints.push(midX < startX
                        ? { X: midX + height + connectorLineEdge, Y: midY }
                        : { X: midX - height + connectorLineEdge, Y: midY });
                    if (!clockwise && currentseries.startAngle != null) {
                        if (!isLeft)
                            midY = bounds[bounds.length - 1].Y + size.height + 2;
                        else
                            midY = bounds[bounds.length - 1].Y - size.height - 2;
                    }
                    else {
                        midY = bounds[bounds.length - 1].Y + size.height + 2;
                    }
                    currBounds.Y = midY;
                    currBounds.Top = midY;
                    currBounds.Bottom = midY + size.height;
                }
                renderingPoints.push({ X: midX + connectorLineEdge, Y: midY });
                if (centerX < renderingPoints[0].X && (renderingPoints[1].X > renderingPoints[2].X))
                    renderingPoints[2].X = renderingPoints[1].X;
                if (centerX > renderingPoints[0].X && (renderingPoints[1].X < renderingPoints[2].X))
                    renderingPoints[2].X = renderingPoints[1].X;
                if (!isLeft) {
                    if (!chartModel.bounds[seriesIndex].points["right"])
                        chartModel.bounds[seriesIndex].points.right = [];
                    chartModel.bounds[seriesIndex].points["right"].push(currBounds);
                    if (renderingPoints[renderingPoints.length - 1].X < renderingPoints[renderingPoints.length - 2].X)
                        renderingPoints[renderingPoints.length - 2].X = renderingPoints[renderingPoints.length - 1].X;

                }
                else {
                    if (!chartModel.bounds[seriesIndex].points["left"])
                        chartModel.bounds[seriesIndex].points.left = [];
                    chartModel.bounds[seriesIndex].points["left"].push(currBounds);
                    if (renderingPoints[renderingPoints.length - 1].X > renderingPoints[renderingPoints.length - 2].X)
                        renderingPoints[renderingPoints.length - 2].X = renderingPoints[renderingPoints.length - 1].X;
                }


                connectorDirection = ej.EjSvgRender.utils._getStringBuilder();
                if (connectorType == 'bezier' && !chartObj.vmlRendering) {
                    bezierPoints = seriesType.drawBezierSegment(renderingPoints, currentseries, pointIndex, chartObj, seriesIndex);
                }
                else {
                    for (k = 0; k < renderingPoints.length; k++) {
                        if (k == renderingPoints.length - 1)
                            connectorDirection.append(" ");
                        else
                            connectorDirection.append("M" + " " + (renderingPoints[k].X) + " " + (renderingPoints[k].Y) + " " + "L" + " " + (renderingPoints[k + 1].X) + " " + (renderingPoints[k + 1].Y) + " ");
                    }
                    connectorDirection = connectorDirection.toString();
                }
                positionX = renderingPoints[renderingPoints.length - 1].X + ((midX < startX) ? -textGap : textGap);
                positionY = renderingPoints[renderingPoints.length - 1].Y;
            }
            return { positionX: positionX, positionY: positionY, connectorDirection: connectorDirection, isInterSected: point.isIntersected, bezierPath: bezierPoints };
        },

        updateLabelPosition: function (currentseries, point, pointIndex, bounds, midAngle, startPoint, textOffset, size, sender, seriesIndex) {

            var renderingPoints = [];
            var chartObj = sender;
            var seriesType = new ej.seriesTypes[currentseries.type.toLowerCase()]();
            var connectorDirection = "";

            var connectorX = bounds.connector.connectorX;
            var connectorY = bounds.connector.connectorY;
            var midX = bounds.midPoint.midX;
            var midY = bounds.midPoint.midY;
            var dMidX = bounds.doughnutMidPoint.dMidX;
            var dMidY = bounds.doughnutMidPoint.dMidY;
            var startX = startPoint.startX;
            var startY = startPoint.startY;
            var marker = $.extend(true, {}, currentseries.marker, point.marker);
            var textGap = (marker.dataLabel.template) ? 0 : 4;

            var outerX;
            var type = currentseries.type.toLowerCase();
            var radius = chartObj.model.circularRadius[seriesIndex];
            var labelPosition = type == "pieofpie" ? "inside" : currentseries.labelPosition.toLowerCase();

            //calculation for outside labels

            renderingPoints.push({ X: midX, Y: midY });
            renderingPoints.push({ X: connectorX, Y: connectorY });
            positionX = connectorX;
            positionY = connectorY;

            if (labelPosition == 'outside') {
                if (textOffset > 0) {
                    if (connectorX < startX) {
                        outerX = connectorX - chartObj.model.elementSpacing;
                        positionX = outerX - textGap;
                    }
                    else {
                        outerX = connectorX + chartObj.model.elementSpacing;
                        positionX = outerX + textGap;
                    }
                    renderingPoints.push({ X: outerX, Y: connectorY });
                }

                if (marker.dataLabel.connectorLine.type.toLowerCase() == 'bezier' && !chartObj.vmlRendering) {
                    seriesType.drawBezierSegment(renderingPoints, currentseries, pointIndex, chartObj, seriesIndex);
                }
                else {
                    connectorDirection = "M" + " " + midX + " " + midY + " " + "L" + " " + connectorX + " " + connectorY + " " + "M" + " " + connectorX + " " + connectorY + " " + "L" + " " + outerX + " " + connectorY;
                }

            }


            //calculation for outsideextended labels
            else if (labelPosition == 'outsideextended') {

                labelX = midX;
                labelY = midY;

                midX = midX + (Math.cos((midAngle)) * (-(radius / 10)));
                midY = midY + (Math.sin((midAngle)) * (-(radius / 10)));


                var renderingPoints = [];

                var connectorHeight = radius / 4;

                renderingPoints.push({ X: midX, Y: midY });
                connectorX = midX + (Math.cos((midAngle)) * connectorHeight);
                connectorY = midY + (Math.sin((midAngle)) * connectorHeight);

                renderingPoints.push({ X: connectorX, Y: connectorY });

                var legendWidth = (chartObj.model.legend.visible && (chartObj.model.legend.position.toLowerCase() == "left" || chartObj.model.legend.position.toLowerCase() == "right")) ? (chartObj.model.elementSpacing) : 0;

                if (midX < startX) {
                    connectorX = (chartObj.model.centerX - radius - (connectorHeight * 2) - currentseries.LeftLabelMaxWidth > 0)
                        ? chartObj.model.centerX - radius - (connectorHeight * 2) + legendWidth
                        : (currentseries.LeftLabelMaxWidth > labelX) ? labelX : currentseries.LeftLabelMaxWidth;
                }
                else {
                    connectorX = (chartObj.model.centerX + radius + (connectorHeight * 2) + currentseries.RightLabelMaxWidth < $(chartObj.svgObject).width())
                        ? chartObj.model.centerX + radius + (connectorHeight * 2) - legendWidth
                        : ((chartObj.model.centerX + radius + currentseries.RightLabelMaxWidth) > $(chartObj.svgObject).width()) ? labelX : $(chartObj.svgObject).width() - currentseries.RightLabelMaxWidth;

                }

                renderingPoints.push({ X: connectorX, Y: connectorY });

                connectorDirection = ej.EjSvgRender.utils._getStringBuilder();
                if (marker.dataLabel.connectorLine.type.toLowerCase() == 'bezier' && !chartObj.vmlRendering) {
                    seriesType.drawBezierSegment(renderingPoints, currentseries, pointIndex, chartObj, seriesIndex);
                }
                else {
                    for (k = 0; k < renderingPoints.length; k++) {
                        if (k == renderingPoints.length - 1)
                            connectorDirection.append(" ");
                        else
                            connectorDirection.append("M" + " " + (renderingPoints[k].X) + " " + (renderingPoints[k].Y) + " " + "L" + " " + (renderingPoints[k + 1].X) + " " + (renderingPoints[k + 1].Y) + " ");
                    }
                    connectorDirection = connectorDirection.toString();
                }
                positionX = renderingPoints[renderingPoints.length - 1].X + ((midX < startX) ? -textGap : textGap);;
                positionY = renderingPoints[renderingPoints.length - 1].Y;
            }

            //calculation for inside labels

            else {
                if (currentseries.type.toLowerCase() == "doughnut") {
                    positionX = (midX + dMidX) / 2;
                    positionY = (midY + dMidY) / 2;
                }
                else {
                    positionX = (midX + startX) / 2;
                    positionY = (midY + startY) / 2;

                    positionX = (midX + positionX) / 2;
                    positionY = (midY + positionY) / 2;
                }
            }

            return { positionX: positionX, positionY: positionY, connectorDirection: connectorDirection, points: renderingPoints[renderingPoints.length - 1] };
        },
        // method to update the position of the data labels in pyramid chart
        updateSmartLabel: function (chartObj, currentseries, pointIndex, point) {
            // declaration
            var datalabelTemplateVisiblity = true,
                connectorDirection = "",
                labelPosition = currentseries.labelPosition.toLowerCase(),
                marker = $.extend(true, {}, currentseries.marker, point.marker),
                dataLabel = marker.dataLabel,
                areaBounds = chartObj.model.m_AreaBounds,
                svgHeight = chartObj.model.svgHeight,
                type = currentseries.type.toLowerCase(),
                pyrX, pyrY, ele, xPos, yPos;
            point._labelPlacement = "";
            if (labelPosition == "inside" || labelPosition == "outsideextended")
                this.calculateInsideConnectorLines(pointIndex, point, currentseries, chartObj);
            else
                this.compareDataLabels(point, pointIndex, chartObj.model.outsideDataRegionPoints, currentseries, chartObj);

            pyrX = (chartObj.model.enableCanvasRendering && !dataLabel.template) ? chartObj.pyrX : 0;
            pyrY = (chartObj.model.enableCanvasRendering && !dataLabel.template) ? chartObj.pyrY : 0;
            if (type == "pyramid") {
                if ((chartObj.model.actualHeight < point.yPos - pyrY) || (point.xPos - pyrX > areaBounds.Width && point._labelPlacement == "insideoverlap") || (chartObj.model.legend.position == "right" && dataLabel.template && (point.xPos + point.width) > areaBounds.Width + chartObj.model.LegendActualBounds.Width)) {
                    datalabelTemplateVisiblity = false;
                    point.drawTextacc = "";
                }
            }
            else {
                if ((point.yPos - pyrY < 0) || (point.xPos - pyrX > areaBounds.Width && point._labelPlacement == "insideoverlap") || (chartObj.model.legend.position == "right" && dataLabel.template && (point.xPos + point.width) > areaBounds.Width + chartObj.model.LegendActualBounds.Width)) {
                    datalabelTemplateVisiblity = false;
                    point.drawTextacc = "";

                }
            }
            if ((labelPosition == "outside" || point._labelPlacement == "insideoverlap") && datalabelTemplateVisiblity)
                connectorDirection = this.drawConnectorLines(pointIndex, point, currentseries, chartObj);

            if (dataLabel.template) {
                ele = $("#" + point.id);
                if (!datalabelTemplateVisiblity) {
                    ele.css("display", "none");
                }
                else {
                    xPos = (point._labelPlacement == "insidenooverlap") ? point.textOptionsacc.x + chartObj.pyrX - point.width / 2 : point.textOptionsacc.x + chartObj.pyrX;
                    yPos = (point._labelPlacement == "insidenooverlap") ? point.textOptionsacc.y + chartObj.pyrY : point.textOptionsacc.y + chartObj.pyrY - chartObj.model.elementSpacing;
                    ele.css("left", xPos).css("top", yPos);
                    ele.css("height", point.height).css("overflow", "hidden");
                }
            }


            return { xPos: point.xPos, yPos: point.yPos, textOptionsacc: point.textOptionsacc, connectorDirection: connectorDirection.connectorDirection, bezierPath: connectorDirection.bezierdir, drawTextacc: point.drawTextacc };
        },
        // method to compare the data labels in chart for intersection
        compareDataLabels: function (point, pointIndex, outsideDataRegionPoints, currentseries, chartObj) {

            var marker = $.extend(true, {}, currentseries.marker, point.marker),
                dataLabel = marker.dataLabel,
                prevLabel, collide, regionPoint, degree, angle, rotate,
                elementSpacing = chartObj.model.elementSpacing,
                margin = marker.dataLabel.margin,
                visiblePointslength = currentseries._visiblePoints.length,
                labelPosition = currentseries.labelPosition.toLowerCase(),
                pyrX = (chartObj.model.enableCanvasRendering) ? chartObj.pyrX : 0,
                pyrY = (chartObj.model.enableCanvasRendering) ? chartObj.pyrY : 0;
            for (var j = 0, length = outsideDataRegionPoints.length; j < length; j++) {
                prevLabel = outsideDataRegionPoints[j];
                collide = this.isCollide(prevLabel, point, currentseries);
                if (collide.state) {
                    if (labelPosition == "inside" || labelPosition == "outsideextended") {
                        point.textOptionsacc.y = point.yPos = point.textOptionsacc.y + collide.height;
                        positionPoint = (dataLabel.template) ? { x: point.xPos, y: point.yPos } : { x: point.xPos - pyrX, y: point.yPos - pyrY };
                        for (var k = 0, visibleLength = visiblePointslength; k < visibleLength; k++) {
                            regionPoint = (chartObj.isPointInPolygon(chartObj.model.chartRegions[0].Region[k].Polygon, positionPoint));
                            if (regionPoint) {
                                point.textOptionsacc.x = point.xPos = point.textOptionsacc.x + point.width;
                                positionPoint = (dataLabel.template) ? { x: point.xPos, y: point.yPos } : { x: point.xPos - pyrX, y: point.yPos - pyrY };
                            }
                        }
                    }
                    else {
                        point._labelPlacement = "outside";
                        point.textOptionsacc.y = point.yPos = (currentseries.type.toLowerCase() == "pyramid") ? point.yPos + collide.height + elementSpacing / 2 : point.yPos + collide.height - elementSpacing / 2;
                        point.textOptionsacc.y = point.textOptionsacc.y + point.height / 4 - elementSpacing / 2 + margin.top / 2 - margin.bottom / 2;
                    }
                }
            }
            degree = dataLabel.angle;
            angle = (degree > 360) ? degree - 360 : (degree < -360) ? degree + 360 : degree;
            rotate = 'rotate(' + angle + ',' + (point.textOptionsacc.x) + ',' + (point.textOptionsacc.y) + ')';
            $(point.textOptionsacc).attr('transform', rotate);

            $(point.textOptionsacc).attr({
                'transform': rotate
            });
            if (labelPosition == "inside" || labelPosition == "outsideextended") {
                point.yPos = point.yPos + elementSpacing / 4;
                point.textOptionsacc.y = point.textOptionsacc.y + point.height / 4 + margin.top / 2 - margin.bottom / 2;
            }
            outsideDataRegionPoints[outsideDataRegionPoints.length] = point;
        },

        //Inside region checking and smartlabels
        calculateInsideConnectorLines: function (pointIndex, point, currentseries, chartObj) {

            var polygon = point.Polygon,
                marker = $.extend(true, {}, currentseries.marker, point.marker),
                dataLabel = marker.dataLabel,
                font = dataLabel.font, connectorHeight,
                pyrX = (chartObj.model.enableCanvasRendering) ? chartObj.pyrX : 0,
                pyrY = (chartObj.model.enableCanvasRendering) ? chartObj.pyrY : 0,
                //inside connector line height
                connectorLength = 70,
                datalabelWidth = ej.EjSvgRender.utils._measureText(point.drawTextacc, null, font),
                positionPoint = (dataLabel.template) ? { x: point.xPos, y: point.yPos } : { x: point.xPos + (datalabelWidth.width / 2) - pyrX, y: point.yPos - (point.height / 2) - pyrY },
                regionPoint = chartObj.isPointInPolygon(polygon, positionPoint);
            if (!regionPoint) {
                point._labelPlacement = "insideoverlap";
                point.textOptionsacc['text-anchor'] = 'start';
                if (point.startX + connectorLength < chartObj.model.m_AreaBounds.Width)
                    connectorHeight = connectorLength;
                else
                    connectorHeight = chartObj.model.m_AreaBounds.Width - (point.startX);

                point.textOptionsacc.x = point.xPos = point.startX + connectorHeight;
                point.textOptionsacc.y = point.yPos = point.yLocation;
                if (chartObj.model.enableCanvasRendering && !dataLabel.template) {
                    point.textOptionsacc.x += chartObj.pyrX;
                    point.textOptionsacc.y += chartObj.pyrY;
                    point.xPos += chartObj.pyrX;
                    point.yPos += chartObj.pyrY;
                }
                this.compareDataLabels(point, pointIndex, chartObj.model.outsideDataRegionPoints, currentseries, chartObj);

            }

            else {
                point._labelPlacement = "insidenooverlap";
            }
        },
        //smartLabels connector Lines
        drawConnectorLines: function (index, currentPoint, currentseries, chartObj) {
            var bezierdir = "";
            var seriesType = new ej.seriesTypes[currentseries.type.toLowerCase()](),
                startx = currentseries._visiblePoints[index].startX,
                starty = currentseries._visiblePoints[index].startY,
                connectorDirection = "",
                seriesIndex = $.inArray(currentseries, chartObj.model._visibleSeries),
                marker = $.extend(true, {}, currentseries.marker, currentPoint.marker),
                dataLabel = marker.dataLabel,
                endy = currentPoint.textOptionsacc.y - chartObj.model.elementSpacing / 2,
                pyrX = (chartObj.model.enableCanvasRendering) ? chartObj.pyrX : 0,
                pyrY = (chartObj.model.enableCanvasRendering) ? chartObj.pyrY : 0,
                renderingPoints = [{ X: startx + pyrX, Y: starty + pyrY },//bezier curve control points
                { X: currentPoint.textOptionsacc.x, Y: endy }];
            if (dataLabel.connectorLine.type.toLowerCase() == 'bezier' && !chartObj.vmlRendering)
                bezierdir = seriesType.drawBezierSegment(renderingPoints, currentseries, index, chartObj, seriesIndex);
            else {
                connectorDirection = "M" + " " + (startx) + " " + (starty) + " " + "L" + " " + (currentPoint.textOptionsacc.x) + " " + (endy);
                if (chartObj.model.enableCanvasRendering && !dataLabel.template)
                    connectorDirection = "M" + " " + (startx) + " " + (starty) + " " + "L" + " " + (currentPoint.textOptionsacc.x - pyrX) + " " + (endy - pyrY);
            }
            return { connectorDirection: connectorDirection, bezierdir: bezierdir };
        },

        //method to detect collision between data labels
        isCollide: function (prevlabel, currentlabel, currentseries) {
            var width = 0,
                height = 0,
                type = currentseries.type.toLowerCase(),
                state;
            state = !(
                ((prevlabel.yPos + prevlabel.height) < (currentlabel.yPos)) ||
                (prevlabel.yPos > (currentlabel.yPos + currentlabel.height)) ||
                ((prevlabel.xPos + prevlabel.width / 2) < currentlabel.xPos - currentlabel.width / 2) ||
                ((prevlabel.xPos - prevlabel.width) > (currentlabel.xPos + currentlabel.width)));

            if (state && type == "pyramid") {
                height = ((prevlabel.yPos + prevlabel.height) - (currentlabel.yPos));
                width = (prevlabel.xPos + prevlabel.width) - currentlabel.xPos;
            }
            else if (state && type == "funnel") {
                height = ((prevlabel.yPos) - (currentlabel.yPos + currentlabel.height));
                width = (prevlabel.xPos + prevlabel.width) - currentlabel.xPos;
            }
            return { state: state, height: height, width: width };
        },
        // trimming the text when it exceeds chart area
        trimText: function (text, maxLength, ellipsis) {
            maxLength--;
            var length = maxLength - ellipsis.length,
                trimmedText = text.substr(0, length);
            return trimmedText + ellipsis;
        },

        //calculate a length of a text for datalabel trimming
        trimfunction: function (datalabelText, remainingWidth, datalabelLength, elipsis, axisWidth, font) {
            var datalabelText, datalabelLength;
            while (remainingWidth < datalabelLength) {
                datalabelText = this.trimText(datalabelText, datalabelText.length, elipsis);
                datalabelLength = ej.EjSvgRender.utils._measureText(datalabelText, axisWidth, font).width;
                if (datalabelText == elipsis) {
                    datalabelText = "";
                    break;
                }
            }
            return datalabelText;
        },

        //To calculate start and end point of a text inside a pie and doughnut region
        calculatePosition: function (chartObj, textOptions, datalabelLength, startX, startY) {
            var rightEndX, rightEndY, leftEndX, leftEndY;
            rightEndX = (textOptions.x + (datalabelLength / 2)) - startX;
            rightEndY = (textOptions.y) - (startY);
            leftEndX = (textOptions.x - (datalabelLength / 2)) - startX;
            leftEndY = textOptions.y - startY;
            return { rightEndX: rightEndX, rightEndY: rightEndY, leftEndX: leftEndX, leftEndY: leftEndY };

        },

        //To caluculate textoptions
        textOption: function (currentseries, chartObj, textsize, pyrX, pyrY, pointIndex, textAnchor, positionX, positionY, seriesIndex, visiblePoint) {
            if (chartObj.model._isPieOfPie)
                var marker = $.extend(true, {}, currentseries.marker, visiblePoint.marker);
            else
                var marker = $.extend(true, {}, currentseries.marker, currentseries._visiblePoints[pointIndex].marker);
            if (!marker.dataLabel.template) {
                $("#" + chartObj.svgObject.id + 'series' + seriesIndex + '_PointText' + pointIndex).remove();
                var textOptions = {
                    'id': chartObj.svgObject.id + 'series' + seriesIndex + '_PointText' + pointIndex,
                    'x': positionX + pyrX,
                    'y': positionY + textsize.height / 4 + pyrY,
                    'fill': marker.dataLabel.font.color,
                    'font-size': marker.dataLabel.font.size,
                    'font-family': marker.dataLabel.font.fontFamily,
                    'font-style': marker.dataLabel.font.fontStyle,
                    'font-weight': marker.dataLabel.font.fontWeight,
                    'opacity': marker.dataLabel.font.opacity,
                    'text-anchor': textAnchor,
                    'cursor': 'default',
                    'degree': marker.dataLabel.angle
                };
                //To rotate datalabels
                var degree = marker.dataLabel.angle;
                var angle = (degree > 360) ? degree - 360 : (degree < -360) ? degree + 360 : degree;
                var rotate = 'rotate(' + angle + ',' + (positionX) + ',' + (positionY) + ')';
                $(textOptions).attr('transform', rotate);
                if (chartObj.model.enableCanvasRendering) {
                    $(textOptions).attr('labelRotation', degree);
                }
                $(textOptions).attr({
                    'transform': rotate
                });
            }
            return textOptions;
        },

        //To trim  datalabel when it exceed a particular pie and doughnut region
        labelTrim: function (chartObj, textOptions, datalabelLength, datalabelText, startX, startY, point, font, seriesIndex, pieSeriesIndex) {
            var chartStartAngle = -.5 * Math.PI;
            var chartEndAngle = .5 * Math.PI;
            var position = this.calculatePosition(chartObj, textOptions, datalabelLength, startX, startY);
            var startAngle = chartObj.model.series[seriesIndex].startAngle;
            var endAngle = chartObj.model.series[seriesIndex].endAngle;
            var regionData = (chartObj.model.chartRegions.length < chartObj.model._visibleSeries.length) ? chartObj.model.chartRegions[0].Region : chartObj.model.chartRegions[seriesIndex].Region;
            var pointStartAngle, pointEndAngle;
            var distanceFromCenter;
            var textinRegion;
            var trimPosition, datalabelWidth;
            var ellipsis = "...";
            var firstStartAngle = [];
            var totalDegree = endAngle - startAngle;
            var seriesIndex = chartObj.model._isPieOfPie ? pieSeriesIndex : seriesIndex;
            if (totalDegree < 0) {
                endAngle = endAngle / 360;
                var arcAngle = (endAngle) ? 2 * Math.PI * (endAngle < 0 ? 1 + endAngle : endAngle) : 0;
            }
            else
                var arcAngle = startAngle ? 2 * Math.PI * (chartObj.model.itemCurrentXPos < 0 ? 1 + chartObj.model.itemCurrentXPos : chartObj.model.itemCurrentXPos) : 0;
            startAngle = (Math.atan2(position.rightEndY, position.rightEndX) - chartStartAngle - arcAngle) % (2 * Math.PI);
            if (startAngle < 0) startAngle = 2 * Math.PI + startAngle;
            endAngle = (Math.atan2(position.leftEndY, position.leftEndX) - chartStartAngle - arcAngle) % (2 * Math.PI);
            if (endAngle < 0) endAngle = 2 * Math.PI + endAngle;
            pointStartAngle = parseFloat(point.start.toFixed(14));
            pointEndAngle = parseFloat(point.end.toFixed(14));
            if (totalDegree > 0) {
                if (ej.util.isNullOrUndefined(chartObj.firstStartAngle[0])) {
                    chartObj.firstStartAngle.push(pointStartAngle);
                }
                pointStartAngle = (chartObj.firstStartAngle[0] < 0) ? (chartObj.model._isPieOfPie ? pointStartAngle : 2 * Math.PI + pointStartAngle) : pointStartAngle;
                pointEndAngle = (chartObj.firstStartAngle[0] < 0) ? (chartObj.model._isPieOfPie ? pointEndAngle : 2 * Math.PI + pointEndAngle) : pointEndAngle;
            }
            else {
                pointStartAngle = pointStartAngle < 0 ? (chartObj.model._isPieOfPie ? pointStartAngle : 2 * Math.PI + pointStartAngle) : pointStartAngle;
                pointEndAngle = pointEndAngle < 0 ? (chartObj.model._isPieOfPie ? pointEndAngle : 2 * Math.PI + pointEndAngle) : pointEndAngle;
            }
            pointStartAngle -= arcAngle;
            pointEndAngle -= arcAngle;
            // to check start and end angle when greater than 360 in pieofpie
            if (pointStartAngle > 2 * Math.PI && pointEndAngle > 2 * Math.PI) {
                startAngle = startAngle + 2 * Math.PI;
                endAngle = endAngle + 2 * Math.PI;
            }
            else if (pointStartAngle < 2 * Math.PI && pointEndAngle > 2 * Math.PI) {
                if (startAngle < Math.PI / 2)
                    startAngle = startAngle + 2 * Math.PI;
                if (endAngle < Math.PI / 2)
                    endAngle = endAngle + 2 * Math.PI;
            }
            if (startAngle < 0 && (endAngle > 0 || endAngle == null)) {
                pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                pointEndAngle = pointEndAngle <= 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
            }
            if (chartObj.model.circleCenterX[seriesIndex] < textOptions.x) {
                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position.rightEndX), 2) + Math.pow(Math.abs(position.rightEndY), 2));
            }
            else
                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position.leftEndX), 2) + Math.pow(Math.abs(position.leftEndY), 2));
            if (totalDegree < 0) {
                pointEndAngle = [pointStartAngle, pointStartAngle = pointEndAngle][0];
            }
            if ((endAngle >= pointStartAngle && endAngle <= pointEndAngle) && (startAngle >= pointStartAngle && startAngle <= pointEndAngle) && (distanceFromCenter <= chartObj.model.circularRadius[seriesIndex] && distanceFromCenter > 0)) {
                textinRegion = true;
            }
            else {
                textinRegion = false;
                while (!textinRegion) {
                    datalabelText = this.trimText(datalabelText, datalabelText.length, ellipsis);
                    if (datalabelText == ellipsis) {
                        datalabelText = "";
                        break;
                    }
                    datalabelWidth = ej.EjSvgRender.utils._measureText(datalabelText, null, font);
                    trimPosition = this.calculatePosition(chartObj, textOptions, datalabelWidth.width, startX, startY);
                    var startangle = (Math.atan2(trimPosition.rightEndY, trimPosition.rightEndX) - chartStartAngle - arcAngle) % (2 * Math.PI);
                    if (startangle < 0) startangle = 2 * Math.PI + startangle;
                    var endAngle = (Math.atan2(trimPosition.leftEndY, trimPosition.leftEndX) - chartStartAngle - arcAngle) % (2 * Math.PI);
                    if (endAngle < 0) endAngle = 2 * Math.PI + endAngle;
                    if (chartObj.model.circleCenterX[seriesIndex] < textOptions.x) {
                        distanceFromCenter = Math.sqrt(Math.pow(Math.abs(trimPosition.rightEndX), 2) + Math.pow(Math.abs(trimPosition.rightEndY), 2));
                    }
                    else
                        distanceFromCenter = Math.sqrt(Math.pow(Math.abs(trimPosition.leftEndX), 2) + Math.pow(Math.abs(trimPosition.leftEndY), 2));
                    // to check when startangle and endangle is greater than 360 degree for pieofpie
                    if ((pointStartAngle > 2 * Math.PI && pointEndAngle > 2 * Math.PI) && chartObj.model._isPieOfPie) {
                        var stAngle = pointStartAngle - 2 * Math.PI;
                        pointStartAngle = stAngle;
                        var enAngle = pointEndAngle - 2 * Math.PI;
                        pointEndAngle = enAngle;
                    }
                    else if ((pointStartAngle != 0 && pointStartAngle < 2 * Math.PI && pointEndAngle >= 2 * Math.PI) && chartObj.model._isPieOfPie) {
                        var stAngle = pointStartAngle - 2 * Math.PI;
                        pointStartAngle = stAngle;
                    }
                    if ((endAngle >= pointStartAngle && endAngle <= pointEndAngle) &&
                        (startangle >= pointStartAngle && startangle <= pointEndAngle) &&
                        (distanceFromCenter <= chartObj.model.circularRadius[seriesIndex] && distanceFromCenter > 0)) {
                        textinRegion = true;
                    }

                }
            }

            return datalabelText;
        },


        drawDataLabelAcc: function (sender, currentseries, pointIndex, point, seriesIndex, pieSeriesIndex) {
            // method for data label symbols - accumulation series	
            var pointMarker = point.marker;
            if (point.visible && ((pointMarker && pointMarker.dataLabel && pointMarker.dataLabel.visible) || (!pointMarker || !pointMarker.dataLabel) && currentseries.marker.dataLabel.visible)) {
                var chartObj = sender,
                    type = currentseries.type.toLowerCase(),
                    seriesType = new ej.seriesTypes[type](),
                    isNull = ej.util.isNullOrUndefined,
                    _labelPosition = type == "pieofpie" ? "inside" : currentseries.labelPosition.toLowerCase(),
                    chartModel = chartObj.model,
                    chartTitle = chartModel.title,
                    measureText = ej.EjSvgRender.utils._measureText,
                    elementSpacing = chartModel.elementSpacing,
                    seriesMarker = currentseries.marker,
                    dataLabel = seriesMarker.dataLabel,
                    margin = dataLabel.margin,
                    dataLabelFont = dataLabel.font,
                    connectorLine = dataLabel.connectorLine,
                    connectorType = connectorLine.type.toLowerCase(),
                    legend = chartModel.legend,
                    legendPosition = legend.position.toLowerCase(),
                    legendActualBounds = chartModel.LegendActualBounds,
                    text = isNull(point.text) ? point.y : point.text,
                    enableWrap = dataLabel.enableWrap,
                    wrapConnectorpoints, shape, size,
                    labelText = text,
                    srIndex = chartModel._isPieOfPie ? pieSeriesIndex : seriesIndex;

                var connectorDirection, labelfont,
                    commonEventArgs, textsize, position, symbolPos, accDataLabelRegion,
                    positionX = 0, textWidth, textHeight,
                    positionY = 0, symbolName,
                    pointColor, chartBackground = chartModel.background.toLowerCase(), fontBackgroundColor, contrastColor = dataLabel.enableContrastColor;

                if ((type == "pyramid" || type == "funnel") && _labelPosition == 'outsideextended')
                    _labelPosition = 'inside';

                commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { text: text, series: currentseries, pointIndex: pointIndex };
                chartObj._trigger("displayTextRendering", commonEventArgs);

                labelfont = { size: dataLabelFont.size, fontStyle: dataLabelFont.fontStyle, fontFamily: dataLabelFont.fontFamily };
                textsize = measureText(commonEventArgs.data.text, null, labelfont);
                textWidth = textsize.width + margin.left + margin.right;
                textHeight = textsize.height + margin.top + margin.bottom;

                if (type == "pyramid" || type == "funnel") {
                    var measureTitle = (chartModel.title.text) ? measureText(chartModel.title.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.font) : 0;
                    var mesureSubTitle = (chartObj.model.title.subTitle.text) ? ej.EjSvgRender.utils._measureText(chartObj.model.title.subTitle.text, $(this.svgObject).width() - chartObj.model.margin.left - chartObj.model.margin.right, chartObj.model.title.subTitle.font) : 0;
                    var subtitleHeight = (chartObj.model.title.subTitle.text === '') ? 0 : mesureSubTitle.height;
                    var pyrX = elementSpacing + chartModel.margin.left + (legendPosition === "left") ? (legendActualBounds.Width) : 0;
                    var pyrY = ((legendPosition === "top") ? (legendActualBounds.Height) : 0) + ((chartModel.title.text && chartModel.title.visible) ? (chartModel._titleLocation.Y + measureTitle.height + subtitleHeight) : (chartModel.margin.top + elementSpacing));
                    textWidth = textWidth + 10;
                    var Location = { X: point.xLocation + chartObj.pyrX, Y: point.yLocation + chartObj.pyrY };
                    positionX = point.xLocation;
                    positionY = point.yLocation;
                    var marker = point.marker ? point.marker : seriesMarker;
                    marker = $.extend(true, {}, seriesMarker, marker);
                    connectorDirection = point.connectorLine;
                    symbolPos = { positionX: positionX, positionY: positionY };
                }

                if (type != "pyramid" && type != "funnel") {
                    var chartStartingAngle = -.5 * Math.PI,
                        midAngle = point.midAngle + chartStartingAngle,
                        midPoint, doughnutMidPoint, connector, bounds,
                        startPoint,
                        measureTitle = (chartModel.title.text) ? measureText(chartModel.title.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.font) : 0,
                        mesureSubTitle = (chartObj.model.title.subTitle.text) ? ej.EjSvgRender.utils._measureText(chartObj.model.title.subTitle.text, $(this.svgObject).width() - chartObj.model.margin.left - chartObj.model.margin.right, chartObj.model.title.subTitle.font) : 0,
                        subtitleHeight = (chartObj.model.title.subTitle.text === '') ? 0 : mesureSubTitle.height,
                        textOffset, startX, startY, midX, midY, dMidX, dMidY, connectorX, connectorY,
                        renderingPoints = [],
                        radius = chartModel.circularRadius[srIndex];
                    if (isNull(connectorLine.height))
                        textOffset = measureText(commonEventArgs.data.text, null, dataLabelFont).height;
                    else
                        textOffset = connectorLine.height;
                    var actualIndex = chartObj.model._isPieOfPie ? point.actualIndex : currentseries._visiblePoints[pointIndex].actualIndex;
                    if ((actualIndex == currentseries.explodeIndex || currentseries.explodeAll) && !chartObj.vmlRendering) {
                        startX = chartModel.circleCenterX[srIndex] + Math.cos(midAngle) * currentseries.explodeOffset;
                        startY = chartModel.circleCenterY[srIndex] + Math.sin(midAngle) * currentseries.explodeOffset;
                    }
                    else {
                        startX = chartModel.circleCenterX[srIndex];
                        startY = chartModel.circleCenterY[srIndex];
                    }
                    midX = seriesType.getXCordinate(startX, (radius), midAngle);
                    midX = point.y != 0 ? midX : parseFloat(midX.toFixed(12));
                    midY = seriesType.getYCordinate(startY, (radius), midAngle);

                    dMidX = seriesType.getXCordinate(startX, (chartModel.innerRadius[seriesIndex]), midAngle);
                    dMidY = seriesType.getYCordinate(startY, (chartModel.innerRadius[seriesIndex]), midAngle);

                    connectorX = this.getXCordinate(startX, (radius) + textOffset, midAngle);
                    connectorX = point.y != 0 ? connectorX : parseFloat(connectorX.toFixed(12));
                    connectorY = this.getYCordinate(startY, (radius) + textOffset, midAngle);

                    if (dataLabel.template)
                        size = point.size;
                    else {
                        var marker = point.marker ? point.marker : seriesMarker,
                            marker = $.extend(true, {}, seriesMarker, marker);
                        shape = marker.dataLabel.shape;
                        size = measureText(commonEventArgs.data.text, $(chartObj.svgObject).width(), dataLabelFont);
                        if (shape.toLowerCase() != "none") {
                            size.height = size.height + margin.top + margin.bottom;
                            size.width = size.width + margin.left + margin.right;
                        }
                    }

                    midPoint = { midX: midX, midY: midY };
                    doughnutMidPoint = { dMidX: dMidX, dMidY: dMidY };
                    connector = { connectorX: connectorX, connectorY: connectorY };
                    bounds = { midPoint: midPoint, doughnutMidPoint: doughnutMidPoint, connector: connector };
                    startPoint = { startX: startX, startY: startY };

                    if (!currentseries._enableSmartLabels) {
                        position = seriesType.updateLabelPosition(currentseries, point, pointIndex, bounds, midAngle, startPoint, textOffset, size, sender, seriesIndex);
                        positionX = position.positionX;
                        positionY = position.positionY;
                        connectorDirection = position.connectorDirection;
                    }
                    // smart labels

                    else {
                        position = seriesType.updateSmartLabelPosition(currentseries, point, pointIndex, bounds, midAngle, startPoint, textOffset, size, sender, seriesIndex);
                        if (chartObj.model.bounds[seriesIndex].points[pointIndex])
                            var isOverlapped = chartObj.model.bounds[seriesIndex].points[pointIndex].overlap;
                   		positionX = position.positionX;
						positionY = position.positionY;
                        symbolPos = { positionX: positionX, positionY: positionY, isInterSected: position.isInterSected };
                        connectorDirection = chartObj.model._isPieOfPie || isOverlapped ? "" : position.connectorDirection;
                    }
                }

                var textAnchor = ((_labelPosition != 'inside' && _labelPosition != 'insidenooverlap') || ((type == "pyramid" || type == "funnel") && _labelPosition == 'outside')) ? (positionX < chartModel.circleCenterX[srIndex] ? 'end' : 'start') : 'middle',
                    width = (_labelPosition == 'inside' || _labelPosition == 'insidenooverlap') ? 0 : (positionX < chartModel.circleCenterX[srIndex]) ? -textsize.width : textsize.width,
                    pyrX = 0, pyrY = 0, textOptions;

                if ((type == "pie" || type == "doughnut" || type == "pieofpie") && _labelPosition == "inside")
                    textAnchor = (connectorDirection != "") ? (positionX < chartModel.circleCenterX[srIndex] ? 'end' : 'start') : 'middle';
                if ((type == "pyramid" || type == "funnel") && _labelPosition == "outside")
                    textAnchor = 'start';

                var subtitleHeight = (chartObj.model.title.subTitle.text === '') ? 0 : mesureSubTitle.height;
                if ((this.chartObj && chartModel.enableCanvasRendering) && (type == "pyramid" || type == "funnel")) {
                    pyrX = ((legendPosition === "left") ? (legendActualBounds.Width) : 0) + elementSpacing + chartModel.margin.left;
                    pyrY = ((legendPosition === "top") ? (legendActualBounds.Height) : 0) + ((chartTitle.text) ? (chartModel._titleLocation.Y + measureTitle.height + subtitleHeight) : (chartModel.margin.top + elementSpacing));
                }

                pointIndex = chartObj.model._isPieOfPie ? point.actualIndex : pointIndex;
                textOptions = this.textOption(currentseries, chartObj, textsize, pyrX, pyrY, pointIndex, textAnchor, positionX, positionY, seriesIndex, point);
                // to obtain the background color
                pointColor = jQuery.type(chartModel.pointColors[point.actualIndex]) == "array" ?
                    chartModel.pointColors[point.actualIndex][0].color : chartModel.pointColors[point.actualIndex];
                // To set the point color when set the color in empty point
                pointColor = point.fill ? jQuery.type(point.fill) == "array" ? point.fill[0].color : point.fill : pointColor;
                if (dataLabel.template) {
                    Location = isNull(Location) ? { X: positionX, Y: positionY } : Location;
                    var pointindex = point.actualIndex;
                    seriesType.drawLabelTemplate(currentseries, point, pointindex, Location, sender);
                    if (connectorType == "bezier" && (position.bezierPath) != "")
                        sender.svgRenderer.drawPolyline(position.bezierPath, sender.gConnectorEle[seriesIndex]);
                }
                else {
                    $.each(chartModel.symbolShape, function (name) {
                        marker = point.marker ? point.marker : seriesMarker;
                        marker = $.extend(true, {}, seriesMarker, marker);
                        shape = marker.dataLabel.shape;
                        if (shape.toLowerCase() == name.toLowerCase())
                            symbolName = name;
                    });

                    positionX = pyrX + positionX - (margin.left) / 2 + (margin.right) / 2 + width / 2;
                    positionY = pyrY + positionY - (margin.top) / 2 + (margin.bottom) / 2;
                    //SmartLabels value storing for pyramid and funnel
                    if (type == "pyramid" || type == "funnel") {
                        point.xPos = symbolPos.positionX + pyrX;
                        point.yPos = symbolPos.positionY + pyrY;
                        point.width = (symbolName == "None") ? textsize.width : textWidth;
                        point.height = (symbolName == "None") ? textsize.height : textHeight;
                        point.symbolName = (dataLabel.template) ? "none" : symbolName;
                        point.textOptionsacc = textOptions;
                        point.drawTextacc = commonEventArgs.data.text;
                    }
                    //For accurate placement of rotated data labels in canvas
                    if (chartModel.enableCanvasRendering && (textOptions.degree % 360 != 0)) {
                        textOptions.y -= (textsize.height / 4);
                        textOptions.baseline = 'middle';
                    }
                    if (contrastColor && !currentseries._enableSmartLabels) {
                        fontBackgroundColor = _labelPosition != "inside" ? (chartBackground === "transparent") ? "white" :
                            chartBackground : pointColor;
                        textOptions.fill = this._applySaturation(chartObj, fontBackgroundColor);
                    }
                    if (currentseries._enableSmartLabels) {
                        var axisWidth = chartModel.m_AreaBounds.Width + chartModel.m_AreaBounds.X + chartModel.margin.left,
                            labelPosition = _labelPosition,
                            enableCanvasRendering = chartModel.enableCanvasRendering,
                            datalabelText = (typeof commonEventArgs.data.text == "string") ? commonEventArgs.data.text : commonEventArgs.data.text.toString(),
                            datalabelLength = measureText(datalabelText, datalabelText.length, dataLabelFont).width,
                            legendBounds,
                            remainingWidth,
                            legendWidth = 0, legendHeight = 0;
                        if (legend.visible) {
                            if (legendPosition == "left" || legendPosition == "right")
                                legendBounds = legendActualBounds;
                        }
                        else
                            legendBounds = { Width: 0 };

                        if (type == "pie" || type == "doughnut" || type == "pieofpie") {

                            if (labelPosition == "outside" || labelPosition == "outsideextended" || connectorDirection != "") {
                                if (chartModel.circleCenterX[srIndex] < textOptions.x)
                                    remainingWidth = (axisWidth - textOptions.x);
                                else
                                    remainingWidth = legendPosition == "left" ? (textOptions.x - chartModel.margin.left - (chartModel.elementSpacing * 2) - legendBounds.Width) : (textOptions.x - chartModel.margin.left);
                                datalabelText = this.trimfunction(datalabelText, remainingWidth, datalabelLength, "...", axisWidth, dataLabelFont);

                                if (legend.visible && (legendPosition == 'top' || legendPosition == 'bottom')) {
                                    datalabelText = this._overlapLegend(textOptions, datalabelText, sender, seriesIndex);
                                }
                            }
                            if (labelPosition == "inside" && (connectorDirection == "")) {
                                datalabelText = this.labelTrim(chartObj, textOptions, datalabelLength, datalabelText, startX, startY, point, dataLabelFont, seriesIndex, pieSeriesIndex);

                                if (datalabelText == "" && !chartObj.model._isPieOfPie) {
                                    point.smartLabelPosition = "outside";
                                    position = seriesType.updateSmartLabelPosition(currentseries, point, pointIndex, bounds, midAngle, startPoint, textOffset, size, sender, seriesIndex);
                                    symbolPos = { positionX: position.positionX, positionY: position.positionY, isInterSected: position.isInterSected };
                                    datalabelText = commonEventArgs.data.text;
                                    connectorDirection = position.connectorDirection;
                                    textAnchor = (chartModel.circleCenterX[srIndex] < position.positionX) ? "start" : "end";
                                    textOptions = this.textOption(currentseries, chartObj, textsize, pyrX, pyrY, pointIndex, textAnchor, position.positionX, position.positionY, seriesIndex, point);
                                    if (chartModel.circleCenterX[srIndex] < position.positionX)
                                        remainingWidth = legendPosition == "right" ? (axisWidth - textOptions.x - legendBounds) : (axisWidth - textOptions.x);
                                    else
                                        remainingWidth = legendPosition == "left" ? (textOptions.x - legendBounds) : (textOptions.x);
                                    datalabelText = this.trimfunction(datalabelText, remainingWidth, datalabelLength, "...", axisWidth, dataLabelFont);
                                    delete point.smartLabelPosition;
                                }
                            }
                        }
                        else if ((type == "pyramid" || type == "funnel")) {
                            position = seriesType.updateSmartLabel(sender, currentseries, pointIndex, point);
                            positionX = position.xPos;
                            positionY = position.yPos;
                            connectorDirection = position.connectorDirection;
                            textOptions = position.textOptionsacc;
                            datalabelText = point.drawTextacc;

                            if ((connectorDirection != "" || connectorType == "bezier") && datalabelText != "") {
                                datalabelText = datalabelText.toString();
                                if (legendPosition == "right")
                                    remainingWidth = (enableCanvasRendering) ? (axisWidth - textOptions.x) : (axisWidth - textOptions.x - chartObj.pyrX);
                                else if (legendPosition == "left")
                                    remainingWidth = enableCanvasRendering ? (axisWidth - textOptions.x) : (axisWidth - textOptions.x - chartObj.pyrX);
                                else if (legendPosition == "top")
                                    remainingWidth = (enableCanvasRendering) ? (axisWidth - textOptions.x) : axisWidth - textOptions.x - chartObj.pyrX;
                                else
                                    remainingWidth = (enableCanvasRendering) ? (axisWidth - textOptions.x) : axisWidth - textOptions.x - chartObj.pyrX;
                                if (remainingWidth < datalabelLength)
                                    datalabelText = this.trimfunction(datalabelText, remainingWidth, datalabelLength, "...", axisWidth, dataLabelFont);
                            }
                        }

                        var datalabelShape = measureText(datalabelText, null, dataLabelFont);
                        if (type == "pie" || type == "doughnut" || type == "pieofpie")
                            var width = ((_labelPosition == 'inside' || _labelPosition == 'insidenooverlap') && !symbolPos.isInterSected && connectorDirection == "") ? 0 : (positionX < chartModel.circleCenterX[srIndex]) ? -datalabelShape.width : datalabelShape.width;
                        else if (type == "pyramid" || type == "funnel")
                            var width = (point._labelPlacement == "insidenooverlap") ? 0 : datalabelShape.width;
                        if (type == "pie" || type == "doughnut" || type == "pieofpie") {
                            positionX = pyrX + symbolPos.positionX - (margin.left) / 2 + (margin.right) / 2 + (width / 2);
                            positionY = pyrY + symbolPos.positionY - (margin.top) / 2 + (margin.bottom) / 2;
                        }
                        else {
                            positionX = positionX - (margin.left) / 2 + (margin.right) / 2 + (width / 2);
                            positionY = positionY - (margin.top) / 2 + (margin.bottom) / 2;
                        }

                        var dataLabelEle = $('#' + chartObj.svgObject.id + '_dataLabel_series' + seriesIndex + "_point_" + pointIndex);
                        var conEle = $('#' + chartObj.svgObject.id + "_connectorLine_series" + seriesIndex + "_point_" + pointIndex);
                        if (datalabelText !== "") {
                            dataLabelEle.show();
                            conEle.show();
                            if (contrastColor) {
                                fontBackgroundColor = labelPosition != "inside" ? (chartBackground === "transparent") ? "white" : chartBackground :
                                    (position.connectorDirection != "" && !ej.util.isNullOrUndefined(position.connectorDirection)
                                        || position.bezierPath != "" && !ej.util.isNullOrUndefined(position.bezierPath)) ?
                                        (chartBackground === "transparent") ? "white" : chartBackground : pointColor;
                                textOptions.fill = this._applySaturation(chartObj, fontBackgroundColor);
                            }
                            if (!enableWrap && !isOverlapped) {
                                seriesType.dataLabelSymbol(seriesIndex, currentseries, pointIndex, positionX, positionY, textWidth, textHeight, symbolName, chartObj);
                            }
                            if (connectorType == "bezier" && (position.bezierPath) != "" && !(ej.util.isNullOrUndefined(position.bezierPath)))
                                sender.svgRenderer.drawPolyline(position.bezierPath, sender.gConnectorEle[seriesIndex]);
                        }
                        else {
                            dataLabelEle.hide();
                            conEle.hide();
                            connectorDirection = "";
                        }
                        if (!enableWrap && !isOverlapped)
                            chartObj.svgRenderer.drawText(textOptions, datalabelText, chartObj.gSeriesTextEle[seriesIndex]);
                        var datalabelSize = measureText(datalabelText, datalabelText.length, dataLabelFont);
                        var untrimmedSize = measureText(commonEventArgs.data.text, null, dataLabelFont);
                        var bounds;
                        var minX, minY, maxX, maxY;
                        if (type == "pie" || type == "doughnut" || type == "pieofpie") {
                            if (labelPosition == "inside" && position.connectorDirection == "") {
                                minX = textOptions.x - datalabelShape.width / 2;
                                maxX = textOptions.x + datalabelShape.width / 2;
                                minY = textOptions.y - datalabelShape.height / 2;
                                maxY = textOptions.y + datalabelShape.height / 2;
                            }
                            else {
                                if (chartModel.circleCenterX[srIndex] < textOptions.x) {
                                    minX = textOptions.x;
                                    maxX = textOptions.x + datalabelShape.width;
                                }
                                else {
                                    minX = textOptions.x - datalabelShape.width;
                                    maxX = textOptions.x;
                                }
                                minY = textOptions.y - datalabelShape.height / 2;
                                maxY = textOptions.y + datalabelShape.height / 3;
                            }
                            bounds = { centerX: chartModel.circleCenterX[srIndex], minX: minX, minY: minY, maxX: maxX, maxY: maxY, width: datalabelSize.width, height: datalabelSize.height, labelPosition: labelPosition };
                        }

                        if ((type == "funnel" || type == "pyramid")) {
                            legendWidth = legendPosition == "left" ? legendWidth : 0;
                            var legendHeight = 0;
                            if (connectorDirection != "" || connectorType == "bezier") {
                                minX = textOptions.x - legendWidth;
                                maxX = textOptions.x + datalabelShape.width - legendWidth;
                                minY = textOptions.y - datalabelShape.height;
                                maxY = textOptions.y;
                            }
                            if (!enableCanvasRendering)
                                bounds = { minX: minX + chartObj.pyrX + legendWidth, maxX: maxX + chartObj.pyrX + legendWidth, minY: minY + chartObj.pyrY + legendHeight, maxY: maxY + chartObj.pyrY + legendHeight, width: datalabelSize.width, height: datalabelSize.height, labelPosition: labelPosition };
                            else
                                bounds = { minX: minX + legendWidth, maxX: maxX + legendWidth, minY: minY + legendHeight, maxY: maxY + legendHeight, width: datalabelSize.width, height: datalabelSize.height, labelPosition: labelPosition };
                        }
                        accDataLabelRegion = { bounds: bounds, trimmedText: datalabelText, text: commonEventArgs.data.text, type: type, font: dataLabelFont };
                        chartObj.accDataLabelRegion.type = type;
                        chartObj.accDataLabelRegion.connectorDirection = connectorDirection;
                        if (ej.util.isNullOrUndefined(chartObj.accDataLabelRegion[srIndex])) {
                            chartObj.accDataLabelRegion[srIndex] = [];
                        }

                        if (chartObj.accDataLabelRegion[srIndex].length < currentseries._visiblePoints.length)
                            chartObj.accDataLabelRegion[srIndex].push(accDataLabelRegion);
                        if (((!isNull(point.index) && currentseries.explode) && (!enableCanvasRendering)))
                            chartObj.accDataLabelRegion[srIndex].splice(point.index, 1, accDataLabelRegion);
                        if (pieSeriesIndex == 1 && chartObj.accDataLabelRegion[srIndex].length == currentseries._visiblePoints.length) {
                            chartObj.accDataLabelRegion[seriesIndex] = $.merge($.merge([], chartObj.accDataLabelRegion[0]), chartObj.accDataLabelRegion[1]);
                        }
                    }

                    else if (!enableWrap && !isOverlapped) {
                        seriesType.dataLabelSymbol(seriesIndex, currentseries, point.index, positionX, positionY, textWidth, textHeight, symbolName, chartObj);
                        chartObj.svgRenderer.drawText(textOptions, commonEventArgs.data.text, chartObj.gSeriesTextEle[seriesIndex]);
                    }

                    if (enableWrap) {
                        var labelTextSize = measureText(labelText, null, labelfont), maxWidth, collection, padding = 5;
                        collection = this.updateWrappedText(textOptions, labelText, labelTextSize, point, type, startX, startY, radius, chartModel.innerRadius[seriesIndex], _labelPosition, dataLabel, (connectorType == "bezier") ? (currentseries._enableSmartLabels ? (!isNull(position.bezierPath) ? position.bezierPath.points : "") : position.points) : connectorDirection);
                        datalabelText = collection.text;
                        textOptions.x = parseFloat(collection.x); textOptions.y = parseFloat(collection.y);
                        if (datalabelText != "" && !isOverlapped) {
                            var x = (textOptions['text-anchor'] == 'start') ? parseFloat(textOptions.x + collection.width / 2) : (isNull(connectorDirection) || connectorDirection == "") ? parseFloat(textOptions.x) : parseFloat(textOptions.x - collection.width / 2);
                            seriesType.dataLabelSymbol(seriesIndex, currentseries, pointIndex, x, textOptions.y + collection.height / 2 - labelTextSize.height / 2 - padding, collection.width, collection.height, symbolName, chartObj);
                        }
                        if (!isNull(connectorDirection) && connectorDirection != "") {
                            var pyrX, pyrY;
                            if (type == "funnel" || type == "pyramid") {
                                pyrX = ((chartModel.enableCanvasRendering) ? this.chartObj.pyrX : 0);
                                pyrY = ((chartModel.enableCanvasRendering) ? this.chartObj.pyrY : 0);
                            }
                            var connectorSegments = connectorDirection.split(" "), connectorLength = (_labelPosition == "outsideextended" && (type == "pie" || type == "doughnut")) ? connectorSegments.length - 2 : connectorSegments.length;
                            connectorSegments[connectorLength - 1] = textOptions.y - pyrY + (collection.height / 2 - labelTextSize.height);//canvas connector line issue fix
                            connectorSegments[connectorLength - 2] = textOptions.x - pyrX;//canvas connector line issue fix
                            connectorDirection = connectorSegments.toString().replace(/,/g, " ");
                        }
                        connectorDirection = (collection.exceed == false) ? "" : connectorDirection;

                        if ((chartModel.enableCanvasRendering || this.chartObj.vmlRendering) && (typeof datalabelText == "object") && !isOverlapped) {
                            for (var txt = 0, tempY = textOptions.y, tempX = textOptions.x; txt < datalabelText.length; txt++) {
                                textOptions.y = parseFloat(tempY) + ((txt) * textsize.height);
                                textOptions.x = tempX;
                                chartObj.svgRenderer.drawText(textOptions, datalabelText[txt], chartObj.gSeriesTextEle[seriesIndex]);
                            }
                        }
                        else if(!isOverlapped){
                            chartObj.svgRenderer.drawText(textOptions, datalabelText, chartObj.gSeriesTextEle[seriesIndex]);
                        }
                    }
                }
                if ((type == "pyramid" || type == "funnel") && dataLabel.template && currentseries._enableSmartLabels) {
                    position = seriesType.updateSmartLabel(sender, currentseries, pointIndex, point);
                    positionX = position.xPos;
                    positionY = position.yPos;
                    connectorDirection = position.connectorDirection;

                }
                var translate = [];
                translate[0] = pyrX;
                translate[1] = pyrY;
                if ((connectorType != 'bezier' || chartObj.vmlRendering || (type == "pyramid" || type == "funnel")) && (connectorDirection != '')) {
                    if (connectorDirection) {
                        var connectorOptions = {
                            'id': chartObj.svgObject.id + "_connectorLine_series" + seriesIndex + "_point_" + pointIndex,
                            'stroke': (connectorLine.color) ? connectorLine.color : pointColor,
                            'stroke-width': connectorLine.width,
                            'd': connectorDirection
                        };
                        chartObj.svgRenderer.drawPath(connectorOptions, chartObj.gConnectorEle[seriesIndex], translate);
                    }
                }
            }
        },

        _overlapLegend: function (textOptions, datalabelText, chart, seriesIndex) {

            var svgHeight = $(chart.svgObject).height(),
                svgWidth = $(chart.svgObject).width(),
                legendBounds = chart.model.LegendActualBounds,
                elementSpacing = chart.model.elementSpacing,
                margin = chart.model.series[seriesIndex].marker.dataLabel.margin,
                shape = chart.model.series[seriesIndex].marker.dataLabel.shape,
                top = shape != 'none' ? margin.top : 0,
                bottom = shape != 'none' ? margin.bottom : 0,
                textHeight = ej.EjSvgRender.utils._measureText((datalabelText, null, textOptions)).height,
                dataLabelEndPos = textOptions.y + textHeight + bottom,
                dataLabelTopPos = textOptions.y - top,
                legendPosition = chart.model.legend.position.toLowerCase(),
                title = chart.model.title,
                subTitle = title.subTitle,
                margin = chart.model.margin,
                borderSize = chart.model.border.width,
                modelsubTitleHeight = subTitle.text == "" ? 0 : ej.EjSvgRender.utils._measureText(subTitle.text, svgWidth - margin.left - margin.right, subTitle.font).height + elementSpacing,
                titleLocation = chart.model._titleLocation ? chart.model._titleLocation.Y : 0 + modelsubTitleHeight,
                text = datalabelText, legendPosY;


            if (legendPosition == 'bottom') {
                legendPosY = svgHeight - chart.model.LegendActualBounds.Height - elementSpacing;
                text = dataLabelEndPos > legendPosY ? '' : text;
            } else {
                legendPosY = titleLocation == 0 ? borderSize + elementSpacing : titleLocation + elementSpacing;
                text = dataLabelTopPos < (legendPosY + legendBounds.Height) ? '' : text;
            }
            if (dataLabelEndPos > svgHeight)
                text = '';
            return text;

        },

        updateWrappedText: function (textOptions, labelText, textSize, currentPoint, seriesType, centerX, centerY, radius, innerRadius, labelPlacement, dataLabel, connector) {
            var chartObj = this.chartObj,
                point = currentPoint,
                previousBoundary = {},
                textWidth = textSize.width,
                textHeight = textSize.height,
                wrapTrim,
                text, arrayText,
                textPosX = textOptions.x,
                textPosY = textOptions.y,
                segmentHeight,
                segmentWidth,
                midX = textPosX,
                exceed = true,
                areaSpace = chartObj.model.m_AreaBounds.X,
                midY = textPosY,
                connectorPoints,
                txtLength,
                textX, textY;
            if (!ej.util.isNullOrUndefined(connector) && connector != "") {
                if (typeof connector == "object") {
                    textX = connector.X;
                    textY = connector.Y;
                }
                else {
                    connectorPoints = connector.split(" "),
                        txtLength = (labelPlacement == "outsideextended") ? (connectorPoints.length - 2) : (dataLabel.connectorLine.type.toLowerCase() == "bezier") ? connectorPoints.length - 2 : connectorPoints.length;
                    if (connectorPoints[txtLength - 1].indexOf(",") > -1) {
                        var tempXY = connectorPoints[txtLength].split(",");
                        textX = tempXY[0];
                        textY = tempXY[1];
                    }
                    else {
                        textX = connectorPoints[txtLength - 2];
                        textY = connectorPoints[txtLength - 1];
                    }
                }
            }
            if (seriesType == 'pie' || seriesType == 'doughnut') {
                if (labelPlacement == "inside") {
                    var innerRadius = (ej.util.isNullOrUndefined(innerRadius)) ? 0 : innerRadius,
                        chartStartingAngle = -.5 * Math.PI,
                        startAngle = point.startAngle + chartStartingAngle,
                        endAngle = point.endAngle + chartStartingAngle,
                        midAngleRadian = point.midAngle + chartStartingAngle,
                        midAngle = ((180 / Math.PI) * midAngleRadian) % 360,
                        startANG = ((180 / Math.PI) * startAngle) % 360,
                        endANG = ((180 / Math.PI) * endAngle) % 360,
                        radiusTextPosPercentage = (seriesType == "doughnut") ? 0.75 : 0.5;
                    midX = this.getXCordinate(centerX, (radius * radiusTextPosPercentage), midAngleRadian),
                        midY = this.getYCordinate(centerY, (radius * radiusTextPosPercentage), midAngleRadian),
                        startPointX = this.getXCordinate(centerX, (radius), startAngle),
                        startPointY = this.getYCordinate(centerY, (radius), startAngle),
                        endPointX = this.getXCordinate(centerX, (radius), endAngle),
                        endPointY = this.getYCordinate(centerY, (radius), endAngle),
                        midPointX = this.getXCordinate(centerX, (radius), midAngleRadian),
                        midPointY = this.getYCordinate(centerY, (radius), midAngleRadian),
                        innerCenterX = this.getXCordinate(centerX, innerRadius, midAngleRadian),
                        innerCenterY = this.getYCordinate(centerY, innerRadius, midAngleRadian),
                        segmentBounds = this.getSegementMinMax([startPointX, endPointX, (seriesType == "doughnut") ? innerCenterX : centerX, midPointX], [startPointY, endPointY, (seriesType == "doughnut") ? innerCenterY : centerY, midPointY]);
                    segmentBounds.width = (segmentBounds.height > radius) ? segmentBounds.height : segmentBounds.width;
                    segmentWidth = segmentBounds.width * 0.75;
                }
                else if (((labelPlacement == "outside" || labelPlacement == "outsideextended") && (seriesType == 'pie' || seriesType == 'doughnut')) && connector != "") {
                    var areabounds = chartObj.model.m_AreaBounds,
                        areaStartX = areaSpace,
                        areaEndX = chartObj.svgWidth - areaSpace;
                    segmentWidth = (textX <= centerX) ? (textX - areaStartX) : (areaEndX - textX);
                    midX = textX;
                    midY = textY;
                }
            }
            else {
                var svgWidth = chartObj.svgWidth;
                if (labelPlacement == "outside") {
                    segmentWidth = svgWidth - (textX);
                }
                else {
                    segmentWidth = point.width;
                    var insidenooverap = chartObj.isPointInPolygon(point.Polygon, { x: midX + textWidth, y: midY });
                    if (!insidenooverap) {
                        segmentWidth = ((seriesType == "funnel") ? (point.Polygon[3].x - point.Polygon[4].x) : (point.Polygon[1].x - point.Polygon[0].x));
                        segmentHeight = point.Polygon[3].y - point.Polygon[0].y;
                        var changedHeight = Math.round(textWidth / segmentWidth) * textHeight, padding = 5,
                            exceed = ((changedHeight >= (segmentHeight - (2 * padding))) || (segmentWidth <= 50)) ? true : false;
                        if (!exceed) {
                            textOptions["text-anchor"] = "middle";
                            midX = ((seriesType == "funnel") ? point.Polygon[4].x : point.Polygon[0].x) + (segmentWidth / 2) + ((chartObj.model.enableCanvasRendering) ? chartObj.pyrX : 0);
                            midY = ((point.Polygon[0].y + point.Polygon[3].y) / 2) - (changedHeight / 2) + ((chartObj.model.enableCanvasRendering) ? chartObj.pyrY : 0);
                            point._labelPlacement = "insidenooverlap";
                        }
                        else {
                            segmentWidth = svgWidth - midX - areaSpace;
                        }
                    }
                }
            }
            if (labelPlacement == "inside" || (connector != "" || !ej.util.isNullOrUndefined(connector))) {
                maxWidth = (dataLabel.maximumLabelWidth != null) ? dataLabel.maximumLabelWidth : parseFloat(segmentWidth);
                text = labelText;
                wrapText = chartObj._rowsCalculation({ text: text.toString(), font: dataLabel.font }, maxWidth, wrapTrim);
                text = wrapText.textCollection;
                arrayText = $.extend([], text);
                for (var i = 0, temp; i < arrayText.length - 1; i++) {
                    arrayText[i + 1] = arrayText[i].concat("<br/>", arrayText[i + 1]);
                }
                arrayText = arrayText[arrayText.length - 1];
            }
            else {
                text = "";
            }
            var changedText = ej.EjSvgRender.utils._measureText(arrayText, segmentWidth, dataLabel.font);
            changedText.height += (textHeight / 2);// size differing canvas and svg space between new line text more 
            if ((seriesType == "pie" || seriesType == "doughnut") && (labelPlacement == "inside")) {
                midY = midY - (changedText.height / 2) + (textHeight / 2);
                text = (changedText.height > (segmentBounds.height)) ? "" : text;
                text = (changedText.width > (segmentBounds.width)) ? "" : text;
                if (text == "") {
                    changedText.width = 0; changedText.height = 0;
                }
            }
            previousBoundary = (this.currentBoundary == 'undefined') ? "undefined" : this.currentBoundary;
            this.currentBoundary = ({ X: midX - (changedText.width / 2), Y: parseFloat(midY), Height: changedText.height, Width: changedText.width });
            if (!!previousBoundary && (point._labelPlacement != "insidenooverlap")) {
                var overlap = this.checkOverlapping(chartObj, this.currentBoundary, previousBoundary, seriesType, text, firstSegment, midAngle, labelPlacement, { startAngle: startAngle, endAngle: endAngle, radius: radius, centerX: centerX, centerY: centerY });

                if (overlap[1] && (overlap[2] != "")) {
                    previousBoundary = overlap[0];
                    midX = previousBoundary.X + (previousBoundary.Width / 2);
                    midY = previousBoundary.Y;
                    text = overlap[2];
                    changedText.height = overlap[0].Height;
                    changedText.width = overlap[0].Width;
                }
                else {
                    text = overlap[2];
                }
            }
            else {
                firstSegment = this.currentBoundary;

            }
            exceed = (text == "") ? false : exceed;
            this.currentBoundary = (text == "") ? previousBoundary : this.currentBoundary;
            return { text: text, x: midX, y: midY, exceed: exceed, height: changedText.height, width: changedText.width };
        },
        checkOverlapping: function (chartObj, current, previous, seriesType, text, firstSegment, midAngle, labelPlacement, segmentBounds) {
            var gap = 10, overlap = false, textOverlap, xOverlap, yOverlap;
            textOverlap = this.getOverlapArea(current, previous);
            overlap = textOverlap.overlap;
            xOverlap = textOverlap.xOverlap;
            yOverlap = textOverlap.yOverlap;
            if (overlap) {
                if (seriesType == "pie" || seriesType == "doughnut") {
                    if (labelPlacement.toLowerCase() == "inside") {
                        var minDiff = (xOverlap >= yOverlap) ? "Y" : "X",
                            flag;
                        if (minDiff == "X") {
                            flag = (midAngle > 0 && midAngle < 180) ? -1 : 1;
                            current.X += flag * (xOverlap + gap);
                        }
                        else {
                            flag = (midAngle > 90 && midAngle < 270) ? -1 : 1
                            current.Y += (flag) * (yOverlap + gap);
                        }

                    }
                    else {
                        current.Y -= (yOverlap + gap);
                    }
                }
                else if (seriesType == "funnel") {
                    current.Y = (previous.Y - current.Height - gap);
                }
                else {
                    current.Y = (previous.Y + previous.Height + gap);
                }
            }
            if ((seriesType == "pie" || seriesType == "doughnut" || seriesType == "pieofpie") && labelPlacement.toLowerCase() == "inside") {
                textOverlap = this.getOverlapArea(current, firstSegment);
                text = (textOverlap.overlap == true) ? "" : text;
                overlap = (textOverlap.overlap == true) ? true : overlap;
                var labelexceeding = this.checkSegmentExceeding(current, segmentBounds);
                text = (!labelexceeding) ? "" : text;
            }
            else if (seriesType == "funnel") {
                if ((current.Y + current.Height) >= previous.Y) {
                    text = "";
                }
            }
            else if (seriesType == "pyramid") {
                if ((current.Y + current.Height) <= (previous.Y + previous.Height)) {
                    text = "";
                }
            }
            var areaBounds = chartObj.model.m_AreaBounds;
            return [{ X: current.X, Y: current.Y, Height: current.Height, Width: current.Width }, overlap, text];
        },
        getOverlapArea: function (firstTextSegment, lastTextSegment) {
            var xOverlap = Math.max(0, Math.min((firstTextSegment.X + firstTextSegment.Width), (lastTextSegment.X + lastTextSegment.Width)) - Math.max(firstTextSegment.X, lastTextSegment.X)),
                yOverlap = Math.max(0, Math.min((firstTextSegment.Y + firstTextSegment.Height), (lastTextSegment.Y + lastTextSegment.Height)) - Math.max(firstTextSegment.Y, lastTextSegment.Y)),
                overlapArea = xOverlap * yOverlap;
            overlap = (overlapArea > 0) ? true : false;
            return { overlap: overlap, xOverlap: xOverlap, yOverlap: yOverlap };
        },
        getSegementMinMax: function (xArray, yArray) {
            var minX, maxX, minY, maxY, width, height;
            xArray.sort(function (a, b) { return a - b; });
            yArray.sort(function (a, b) { return a - b; });
            minX = xArray[0]; maxX = xArray[3]; minY = yArray[0]; maxY = yArray[3];
            width = maxX - minX;
            height = maxY - minY;
            return { minX: minX, maxX: maxX, minY: minY, maxY: maxY, width: width, height: height };
        },
        checkSegmentExceeding: function (textBounds, limits) {
            var inside = false, midPointX = textBounds.X + (textBounds.Width / 2), midPointY = textBounds.Y + (textBounds.Height / 2);
            var dx = midPointX - limits.centerX, dy = midPointY - limits.centerY, angle = Math.atan2(dy, dx), pointRadius = Math.abs(Math.sqrt(dx * dx + dy * dy));
            if (pointRadius <= limits.radius) {
                var PI = 2 * Math.PI;
                angle = (angle < 0) ? (PI + angle) : angle;
                limits.startAngle = (limits.startAngle < 0) ? (PI + limits.startAngle) : limits.startAngle;
                limits.endAngle = (limits.endAngle < 0) ? (PI + limits.endAngle) : limits.endAngle;
                if (angle <= limits.endAngle && angle >= limits.startAngle) {
                    inside = true;
                }
                else if ((angle <= PI && angle >= limits.startAngle && limits.endAngle < limits.startAngle) || (angle > 0 && angle <= limits.endAngle && limits.startAngle > limits.endAngle)) {
                    inside = true;
                }
            }
            return inside;
        },
        drawBezierSegment: function (controlpoints, currentseries, pointIndex, sender, seriesIndex) {
            //currentseries.points[pointIndex].marker = currentseries.points[pointIndex].marker ? currentseries.points[pointIndex].marker : {};
            //var marker = $.extend(true, {}, currentseries.marker, currentseries.points[pointIndex].marker);
            var polyLine = ej.EjSvgRender.utils._getStringBuilder();
            var seriesType = new ej.seriesTypes[currentseries.type.toLowerCase()]();
            for (var i = 0; i <= 16; i++) {
                var t = i / 16;
                var points = seriesType.GetBezierPoint(t, controlpoints, 0, controlpoints.length, currentseries);
                polyLine.append(points.X + "," + points.Y + " ");
            }
            var connectorOptions = {
                'id': sender.svgObject.id + "_bezierLine_series" + seriesIndex + "_point" + pointIndex,
                'stroke': (currentseries.marker.dataLabel.connectorLine.color) ? currentseries.marker.dataLabel.connectorLine.color : sender.model.pointColors[pointIndex],
                'stroke-width': currentseries.marker.dataLabel.connectorLine.width,
                'fill': 'none',
                'points': polyLine.toString()
            };
            if (!currentseries._enableSmartLabels)
                sender.svgRenderer.drawPolyline(connectorOptions, sender.gConnectorEle);
            else
                return connectorOptions;
        },
        GetBezierPoint: function (t, controlPoints, index, count, currentseries) {
            var seriesType = new ej.seriesTypes[currentseries.type.toLowerCase()]();
            if (count == 1)
                return controlPoints[index];
            var p0 = seriesType.GetBezierPoint(t, controlPoints, index, count - 1, currentseries);
            var p1 = seriesType.GetBezierPoint(t, controlPoints, index + 1, count - 1, currentseries);
            var x = (p0.X) ? p0.X : p0.x;
            var y = (p0.Y) ? p0.Y : p0.y;
            var x1 = (p1.X) ? p1.X : p1.x;
            var y1 = (p1.Y) ? p1.Y : p1.y;
            var X = (1 - t) * x + t * x1;
            var Y = (1 - t) * y + t * y1;
            if (p0.x)
                return { x: X, y: Y }
            else
                return { X: X, Y: Y };;



            // return new Point((1 - t) * p0.X + t * p1.X, (1 - t) * p0.Y + t * p1.Y);
        },

        drawLabelTemplate: function (series, point, pointIndex, location, sender) {
            // method for data label template
            if (sender)
                this.chartObj = sender;
            var areaBoundsX = this.chartObj.model.m_AreaBounds.X;
            var areaBoundsY = this.chartObj.model.m_AreaBounds.Y;
            var areaBoundsWidth = this.chartObj.model.m_AreaBounds.Width;
            var areaBoundsHeight = this.chartObj.model.m_AreaBounds.Height;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var areaType = this.chartObj.model.AreaType;
            var currentSeries = this.chartObj.model.series[seriesIndex];
            var xPosition = 0, yPosition = 0;
            var chartContainer = this.chartObj._id;
            var marker = $.extend(true, {}, series.marker, point.marker);
            var style = { 'interior': marker.dataLabel.fill, 'opacity': marker.dataLabel.opacity, 'borderColor': marker.dataLabel.border.color, 'borderWidth': marker.dataLabel.border.width };
            var color, width, height;
            var type = this.chartObj.model.chartRegions[pointIndex] ? this.chartObj.model.chartRegions[pointIndex].type : "";
            if (areaType != "none" || this.chartObj.model.enable3D) {

                if ($('#template_group_' + chartContainer).length != 0)
                    var templateContainer = $('#template_group_' + chartContainer);
                else
                    templateContainer = $("<div></div>").attr('id', "template_group_" + chartContainer);

                templateContainer.css('position', 'relative').css('z-index', 1000);
                if ($("#" + marker.dataLabel.template).length == 0) // To check the specified div is in DOM
                    return;
                else
                    var cloneNode = $("#" + marker.dataLabel.template).clone();
                $(cloneNode).attr("id", marker.dataLabel.template + '_' + seriesIndex + '_' + pointIndex + '_' + chartContainer);
                var $cloneNode = $(cloneNode);
                $cloneNode.css("position", "absolute");

                var pointX = point.x;
                point.dataLabeltemplate = true;
                point.id = marker.dataLabel.template + '_' + seriesIndex + '_' + pointIndex + '_' + chartContainer;
                if (series.xAxis._valueType.indexOf("datetime") > -1)
                    point.x = (ej.format(new Date(point.xValue), ((ej.util.isNullOrUndefined(series.xAxis.labelFormat)) ? (series.xAxis._valueType == "datetime" ? ej.EjSvgRender.utils._dateTimeLabelFormat(series.xAxis._intervalType, series.xAxis) : ej.EjSvgRender.utils._dateTimeLabelFormat(series.xAxis.intervalType, series.xAxis)) : series.xAxis.labelFormat), this.chartObj.model.locale));
                if (series.xAxis._valueType.toLowerCase() == "category")
                    point.x = ej.EjSvgRender.utils._getLabelContent(pointIndex, series.xAxis, this.chartObj.model.locale);

                point.count = 1;
                var data = { series: series, point: point };
                $cloneNode.html($cloneNode.html().parseTemplate(data));

                point.x = pointX;
                var display = (areaType == "cartesianaxes" || !series.enableAnimation || (series.type.toLowerCase() == "pyramid" || series.type.toLowerCase() == "funnel")) ? "block" : "none";
                $cloneNode.css("display", display).appendTo($(templateContainer));
                //template_group_container Div appended in chartcontainer_container Div 
                $(templateContainer).appendTo('#' + 'chartContainer_' + chartContainer);
                var areaBound = this.chartObj.model.m_AreaBounds;
                if (areaType == "cartesianaxes" && !this.chartObj.model.enable3D) {
                    xPosition = areaBound.X + (this.chartObj.model.requireInvertedAxes ? currentSeries.yAxis.plotOffset : currentSeries.xAxis.plotOffset);
                    yPosition = currentSeries.yAxis.y;
                }
                width = $cloneNode.width() / 2;
                height = $cloneNode.height();
                if (ej.util.isNullOrUndefined(style) && style.interior)
                    color = style.interior;
                else
                    color = (areaType == "none") ? this.chartObj.model.pointColors[pointIndex] : this.chartObj.model.seriesColors[seriesIndex];
            }
            else {
                if (ej.util.isNullOrUndefined(style) && style.interior)
                    color = style.interior;
                else
                    color = this.chartObj.model.pointColors[pointIndex];
                width = this.chartObj.model.circleCenterX[seriesIndex] > location.X ? point.size.width : 0;
                $cloneNode = $('#template_group_' + chartContainer).find("#" + marker.dataLabel.template + '_' + seriesIndex + '_' + pointIndex + '_' + chartContainer);
                point.id = marker.dataLabel.template + '_' + seriesIndex + '_' + pointIndex + '_' + chartContainer;
                height = (!this.chartObj.model.enable3D) ? point.size.height / 2 : 0;
            }

            if (currentSeries.type == 'hilo' || currentSeries.type == 'hiloopenclose' || currentSeries.type == 'candle')
                color = currentSeries._visiblePoints[pointIndex]._hiloFill;
            color = jQuery.type(color) == "array" ? color[0].color : color;


            if (currentSeries.type.indexOf("bar") != -1) {
                var left = location.X + xPosition - width;
                var top = location.Y + ((!this.chartObj.model.enable3D) ? areaBound.Y : 0) - height + currentSeries.xAxis.plotOffset;
                var right = location.X + xPosition + width;
            } else {
                var left = location.X + xPosition - width;
                var top = yPosition + location.Y - height;
                var right = location.X + xPosition + width;
            }
            var backgroundColor = $cloneNode[0].style.backgroundColor;
            $cloneNode.css("left", left).css("top", top).css("background-color", (backgroundColor != '' ? backgroundColor : color)).css("display", "block").css("cursor", "default");

            if (this.chartObj.model.AreaType != "cartesianaxes") {
                point.xPos = left - this.chartObj.pyrX;
                point.yPos = top - this.chartObj.pyrY;
                point.textOptionsacc = { x: left - this.chartObj.pyrX, y: top - this.chartObj.pyrY };
            }
            else {
                if (point.y == point.low) {
                    point.xPosLow = left;
                    point.yPosLow = top;
                    point.textOptionsLow = { x: left, y: top };
                    point.dataLabelLow = { textX: left, textY: top, x: left, y: top };
                }
                else {
                    point.xPos = left;
                    point.yPos = top;
                    point.seriesIndex = seriesIndex;
                    point.textOptions = { x: left, y: top };
                    point.dataLabel = { textX: left, textY: top, x: left, y: top };
                    point.margin = { top: 0, bottom: 0, left: 0, right: 0 };
                }
            }
            point.height = $cloneNode.outerHeight();
            point.width = $cloneNode.outerWidth();
            var topHeight, leftWidth, rightWidth;
            topHeight = leftWidth = rightWidth = 0;
            var bottomHeight = 0;
            if (areaType == "cartesianaxes") {
                if ((left > xPosition + areaBound.Width || top + height > areaBound.Y + areaBound.Height) || ((left < xPosition || top < yPosition || left > xPosition + areaBound.Width || top > yPosition + areaBound.Height || right > areaBound.Width + areaBound.X))) {
                    width = $cloneNode.outerWidth();
                    if (left < areaBoundsX) {
                        leftWidth = areaBoundsX - left;
                    }
                    if (areaBoundsHeight + areaBoundsY < top + height) {
                        var excessHeight = (top + height) - (areaBoundsHeight + areaBoundsY);
                        bottomHeight = height - excessHeight;
                    }
                    if (top < areaBoundsY) {
                        topHeight = areaBoundsY - top;
                    }
                    if (areaBoundsWidth + areaBoundsX < left + width) {
                        var excessWidth = (left + width) - (areaBoundsWidth + areaBoundsX);
                        rightWidth = width - excessWidth;
                    }
                    rightWidth = (rightWidth == 0) ? width : rightWidth;
                    bottomHeight = (bottomHeight == 0) ? height : bottomHeight;
                    if (!currentSeries.marker.dataLabel.showEdgeLabels) {
                        document.getElementById($cloneNode[0].id).style.clip = "rect(" + topHeight + "px," +
                            rightWidth + "px," +
                            bottomHeight + "px," +
                            leftWidth + "px)";
                    }
                }
            }
        },

        animateLabelTemplate: function (options) {
            // method to animate data label template
            var seriesIndex = $.inArray(options, this.chartObj.model._visibleSeries);
            var length = options._visiblePoints.length;
            var secondsPerPoint = 1000;

            for (var i = 0; i < length; i++) {
                var ele = options.marker.dataLabel.template + '_' + seriesIndex + '_' + i + '_' + this.chartObj._id;
                ele = $('#' + ele);
                ele.css("display", "none");
                ele.delay(secondsPerPoint).fadeIn(300);
            }
        },

        textPosition: function (series, seriesIndex, point, textOffset, type, x, y, chartRegionIndex, index, params) {
            var marker = $.extend(true, {}, series.marker, point.marker),
                dataLabel = marker.dataLabel,
                isRTL = dataLabel.isReversed,
                horizontalTextAlignment = dataLabel.horizontalTextAlignment.toLowerCase(),
                verticalTextAlignment = dataLabel.verticalTextAlignment.toLowerCase(),
                textPosition = dataLabel.textPosition.toLowerCase(),
                visiblePointLength = series._visiblePoints.length,
                seriesPointIndex = chartRegionIndex,
                lineHeight = 10,
                padding = 3,
                margin = dataLabel.margin,
                isYInversed = series.yAxis.isInversed,
                xOrigin = this.chartObj._getXCrossValue(series, series.xAxis, params);
            var seriesType = (type.indexOf("bar") != -1 || (type.indexOf("column") != -1 && type != "rangecolumn")) ? (this.chartObj.model.requireInvertedAxes) ? "bar" : "column" : type;
            if (seriesType == 'column' || seriesType == 'stackingcolumn' || seriesType == 'stackingcolumn100') {
                var bounds = this.chartObj.model.chartRegions[seriesPointIndex].Region.Bounds,
                    originChanged = params.axes[series.xAxis.name]._validCross || false;
                pointHeight = bounds.Height,
                    pointWidth = bounds.Width;

                if (!originChanged) {
                    if (textPosition == "bottom") {
                        if ((point.y >= xOrigin && !series.yAxis.isInversed) || (point.y < xOrigin && series.yAxis.isInversed))
                            y = y + pointHeight - margin.bottom;
                        else
                            y = textOffset.height + margin.bottom;
                    } else if (textPosition == "middle") {
                        if ((point.y > xOrigin && !series.yAxis.isInversed) || (point.y < xOrigin && series.yAxis.isInversed))
                            y += pointHeight / 2 + (textOffset.height) / 4;
                        else
                            y -= pointHeight / 2;
                    }
                    else {
                        if ((point.y > xOrigin && series.yAxis.isInversed) || (point.y < xOrigin && !series.yAxis.isInversed))
                            y += lineHeight;
                        else
                            y -= lineHeight;
                    }
                }
                else {
                    var origin = Math.abs((isYInversed ? series.yAxis.visibleRange.min : series.yAxis.visibleRange.max) - xOrigin) / series.yAxis.visibleRange.delta * series.yAxis.height;
                    if (textPosition == "bottom") {
                        if (y <= origin)
                            y = y + pointHeight - margin.bottom;
                        else
                            y = y - pointHeight + textOffset.height - margin.bottom;
                    } else if (textPosition == "middle") {
                        if (y < origin)
                            y += pointHeight / 2 + (textOffset.height) / 4;
                        else
                            y -= pointHeight / 2;
                    }
                    else {
                        if ((y < origin && isYInversed) || (y < origin && !isYInversed))
                            y -= (lineHeight + (2 * textOffset.height) / 2);
                        else
                            y += (lineHeight + (2 * textOffset.height) / 2);
                    }
                }

                if (horizontalTextAlignment && horizontalTextAlignment == "far")
                    x = isRTL ? x - pointWidth / 2 : x + pointWidth / 2;
                else if (horizontalTextAlignment && horizontalTextAlignment == "near")
                    x = isRTL ? x + pointWidth / 2 : x - pointWidth / 2;

                if (verticalTextAlignment && verticalTextAlignment == "near") {
                    if (textPosition == "bottom")
                        y += lineHeight;
                    else
                        y += lineHeight - padding;
                }
                else if (verticalTextAlignment && verticalTextAlignment == "far") {
                    if (textPosition == "bottom")
                        y -= lineHeight;
                    else
                        y -= lineHeight;
                }
            }

            else if (seriesType.indexOf("bar") != -1) {
                var bounds = this.chartObj.model.chartRegions[seriesPointIndex].Region.Bounds,
                    pointWidth = bounds.Width,
                    originChanged = params.axes[series.xAxis.name]._validCross || false,
                    pointHeight = bounds.Height;
                y = y + textOffset.height / 4;
                if (!originChanged) {
                    if (textPosition == "bottom") {
                        if ((point.y >= 0 && !series.yAxis.isInversed) || (point.y < 0 && series.yAxis.isInversed))
                            x = (seriesType.indexOf("stacking") == -1 && seriesIndex > 0) ? x - pointWidth + textOffset.width / 2 : margin.left + textOffset.width / 4;
                        else
                            x += (pointWidth - textOffset.height - margin.right);
                    } else if (textPosition == "middle") {
                        if ((point.y > 0 && !series.yAxis.isInversed) || (point.y < 0 && series.yAxis.isInversed))
                            x -= pointWidth / 2 + textOffset.width / 2;
                        else
                            x += pointWidth / 2;
                    } else {
                        if ((point.y >= 0 && !series.yAxis.isInversed) || (point.y < 0 && series.yAxis.isInversed))
                            x += textOffset.width / 4 + lineHeight;
                        else
                            x -= textOffset.width / 4 + lineHeight;
                    }
                }
                else {
                    var yOrigin = series.xAxis._crossValue || 0,
                        origin = Math.abs(isYInversed ? series.yAxis.visibleRange.max : series.yAxis.visibleRange.min - yOrigin) / series.yAxis.visibleRange.delta * series.yAxis.width;
                    if (textPosition == "bottom") {
                        if ((x < origin && !isYInversed) || (x >= origin && isYInversed))
                            x = x + pointWidth - textOffset.width;
                        else
                            x = x - pointWidth + margin.left;
                    } else if (textPosition == "middle") {
                        if ((x < origin && !isYInversed) || (x >= origin && isYInversed))
                            x = x + pointWidth / 2 - textOffset.width / 2;
                        else
                            x = x - pointWidth / 2 - textOffset.width / 2;
                    }
                    else {
                        if ((x < origin && !isYInversed) || (x >= origin && isYInversed))
                            x -= (lineHeight + (2 * textOffset.width) / 2);
                        else
                            x += (lineHeight + (2 * textOffset.width) / 2);
                    }
                }

                if (horizontalTextAlignment && horizontalTextAlignment == "far") {
                    if (textPosition == "bottom")
                        x += textOffset.width - textOffset.width / 4;
                    else
                        x += textOffset.width / 4 + lineHeight;
                }
                else if (horizontalTextAlignment && horizontalTextAlignment == "near") {
                    if (textPosition == "bottom")
                        x -= textOffset.width / 4;
                    else
                        x -= lineHeight - textOffset.width / 4 - padding;
                }
                else // for center
                    x += textOffset.width / 4;

                if (verticalTextAlignment && verticalTextAlignment == "near")
                    y += pointHeight / 2;
                else if (verticalTextAlignment && verticalTextAlignment == "far")
                    y -= pointHeight / 2;
            }
            else if (seriesType == "rangecolumn") {
                var bounds = this.chartObj.model.chartRegions[seriesPointIndex].Region.Bounds;
                var height = 0;
                var width = 0;
                if (point.high != point.y) {
                    height = bounds.Height;
                    width = bounds.Width;
                }
                if (this.chartObj.model.requireInvertedAxes) {
                    if (textPosition == "top")
                        x = x - width + (lineHeight + (2 * textOffset.width) / 2);
                    else if (textPosition == "bottom")
                        x = x - width - (2 * textOffset.width + lineHeight);
                    else if (textPosition == "middle")
                        x = x - width;
                }
                else {
                    if (textPosition == "top")
                        y += height - lineHeight;

                    else if (textPosition == "bottom")
                        y = y + height + (2 * textOffset.height + lineHeight);
                    else if (textPosition == "middle")
                        y = y + height;
                }
                if (horizontalTextAlignment && horizontalTextAlignment.toLowerCase() == "far")
                    x += bounds.Width / 2;
                else if (horizontalTextAlignment && horizontalTextAlignment.toLowerCase() == "near")
                    x -= bounds.Width / 2;
                if (verticalTextAlignment && verticalTextAlignment.toLowerCase() == "near")
                    y += lineHeight - padding;
                else if (verticalTextAlignment && verticalTextAlignment.toLowerCase() == "far")
                    y -= lineHeight;

            }

            else if (seriesType == "boxandwhisker") {
                var bounds = this.chartObj.model.chartRegions[seriesPointIndex].Region.Bounds;
                var height = 0;
                var width = 0;
                if (this.chartObj.model.requireInvertedAxes) {
                    if (textPosition == "top")
                        x = x - width + (lineHeight + (2 * textOffset.width) / 2);
                    else if (textPosition == "bottom")
                        x = x - width - (2 * textOffset.width + lineHeight);
                    else if (textPosition == "middle")
                        x = x - width;
                }
                else {
                    if (textPosition == "top")
                        y += height - padding;
                    else if (textPosition == "bottom")
                        //  y = y + height + (2 * textOffset.height + lineHeight);
                        y += height + lineHeight + (textOffset.width / 2);
                    else if (textPosition == "middle")
                        y += height + lineHeight;
                }
                if (horizontalTextAlignment && horizontalTextAlignment.toLowerCase() == "far")
                    x += 2 * textOffset.width;
                else if (horizontalTextAlignment && horizontalTextAlignment.toLowerCase() == "near")
                    x -= 2 * textOffset.width;

                if (verticalTextAlignment && verticalTextAlignment.toLowerCase() == "near")
                    y = (textPosition == "top") ? y + lineHeight : y - lineHeight;
                else if (verticalTextAlignment && verticalTextAlignment.toLowerCase() == "far")
                    y = (textPosition == "top") ? y - lineHeight : y + lineHeight;

            }

            else if (type == "waterfall") {
                var bounds = this.chartObj.model.chartRegions[seriesPointIndex].Region.Bounds,
                    pointHeight = bounds.Height,
                    pointWidth = bounds.Width;

                var isNegativePoint = point.waterfallSum < 0 || (!point.showIntermediateSum && !point.showTotalSum && point.y < 0);

                switch (textPosition) {
                    case "bottom":
                        if (!series.isTransposed) {
                            if (!series.yAxis.isInversed)
                                y = y + pointHeight - margin.bottom - (isNegativePoint ? pointHeight : 0);
                            else
                                y = y - textOffset.height + margin.bottom + (isNegativePoint ? pointHeight : 0);
                        } else {
                            if (!series.yAxis.isInversed)
                                x = x - pointWidth + (lineHeight + (2 * textOffset.height) / 2) + (isNegativePoint ? pointWidth : 0);
                            else
                                x = x + pointWidth - (lineHeight + (2 * textOffset.height) / 2) - (isNegativePoint ? pointWidth : 0);
                        }
                        break;

                    case "middle":
                        if (!series.isTransposed) {
                            if (!series.yAxis.isInversed)
                                y = y + (pointHeight / 2 + (textOffset.height) / 4) - (isNegativePoint ? pointHeight : 0);
                            else
                                y = y - (pointHeight / 2) + (isNegativePoint ? pointHeight : 0);
                        } else {
                            if (!series.yAxis.isInversed)
                                x = x - (pointWidth / 2 + (textOffset.width) / 4) + (isNegativePoint ? pointWidth : 0);
                            else
                                x = x + (pointWidth / 2) - (isNegativePoint ? pointWidth : 0);
                        }
                        break;

                    default:
                        if (!series.isTransposed) {
                            if (!series.yAxis.isInversed)
                                y = y - (lineHeight + (2 * textOffset.height) / 2) - (isNegativePoint ? pointHeight : 0);
                            else
                                y = y + (lineHeight + (2 * textOffset.height) / 2) + (isNegativePoint ? pointHeight : 0);
                        } else {
                            if (!series.yAxis.isInversed)
                                x = x + (lineHeight + (2 * textOffset.height) / 2) + (isNegativePoint ? pointWidth : 0);
                            else
                                x = x - (lineHeight + (2 * textOffset.height) / 2) - (isNegativePoint ? pointWidth : 0);
                        }
                }

                if (horizontalTextAlignment && horizontalTextAlignment == "far")
                    x += pointWidth / 2;
                else if (horizontalTextAlignment && horizontalTextAlignment == "near")
                    x -= pointWidth / 2;

                if (verticalTextAlignment && verticalTextAlignment == "near") {
                    if (textPosition == "bottom")
                        y += textOffset.height / 3;
                    else
                        y += (textOffset.height + lineHeight);
                }
                else if (verticalTextAlignment && verticalTextAlignment == "far") {
                    if (textPosition == "bottom")
                        y -= textOffset.height / 3;
                    else
                        y -= (lineHeight + (textOffset.height) / 2);
                }

            }
            else if (type == "polar" || type == "radar") {
                y += textOffset.height / 4;
                if (textPosition == "bottom")
                    y += (textOffset.height);
                else if (textPosition == "top")
                    y -= (textOffset.height);

                if (horizontalTextAlignment && horizontalTextAlignment == "far")
                    x += textOffset.width;
                else if (horizontalTextAlignment && horizontalTextAlignment == "near")
                    x -= (textOffset.width);

                if (verticalTextAlignment && verticalTextAlignment == "near")
                    y += (textOffset.height) / 2;
                else if (verticalTextAlignment && verticalTextAlignment == "far")
                    y -= ((textOffset.height) / 2);
            }
            else {
                if ((seriesType == "rangearea") && (point.high != point.y)) {
                    if (this.chartObj.model.series.length == 1) {
                        var length = this.chartObj.model.chartRegions[seriesIndex][index].region.length;
                        y = this.chartObj.model.chartRegions[seriesIndex][index].region[length - 1].Y;
                        x = this.chartObj.model.chartRegions[seriesIndex][index].region[length - 1].X;
                    }
                    else {
                        var precount = 0;
                        for (var a = 0; a < seriesIndex; a++) {
                            var pretype = this.chartObj.model.series[a].type;
                            if (pretype != "rangearea")
                                precount = precount + this.chartObj.model.series[a].points.length;
                            else
                                precount = precount + 1;

                        }
                        var length = this.chartObj.model.chartRegions[precount][index].region.length;
                        y = this.chartObj.model.chartRegions[precount][index].region[length - 1].Y;
                        x = this.chartObj.model.chartRegions[precount][index].region[length - 1].X;
                    }


                }
                if (this.chartObj.model.requireInvertedAxes) {
                    if (textPosition == "top")
                        x += lineHeight;
                    else if (textPosition == "bottom")
                        x -= (lineHeight + (2 * textOffset.width) / 2);
                }
                else {
                    if (textPosition == "bottom") {
                        if (dataLabel.showEdgeLabels)
                            y += (2 * textOffset.height - lineHeight);
                        else
                            y += (2 * textOffset.height + lineHeight);
                    }
                    else if (textPosition == "top")
                        y -= lineHeight;
                }
                if (horizontalTextAlignment && horizontalTextAlignment == "far")
                    x += textOffset.width + lineHeight;
                else if (horizontalTextAlignment && horizontalTextAlignment == "near")
                    x -= ((textOffset.width) + lineHeight);

                if (verticalTextAlignment && verticalTextAlignment == "near")
                    y += lineHeight - padding;
                else if (verticalTextAlignment && verticalTextAlignment == "far")
                    y -= lineHeight;
                else {
                    if ((type == "bubble" || type == "scatter") && textPosition == "middle")
                        y += textOffset.height / 4;   // for placing the data label at the center of bubble
                }
            }
            var location = { x: x, y: y };
            return location;
        },




        changeCrossHairSymbol: function (element, track, ptIndex, serIndex, series) {
            var drawType = series.drawType;
            if (!ej.util.isNullOrUndefined(track)) {
                var trackMarker = {};
                element = $.extend(true, {}, series.marker, element);
                trackMarker = $.extend(true, {}, this.chartObj.model.crosshair.marker, trackMarker);
                var point = series.points[ptIndex], seriesType = series.type.toLowerCase();
                if (ej.util.isNullOrUndefined(trackMarker.shape)) {
                    trackMarker.shape = element.shape;
                    if (seriesType == 'bubble') {
                        trackMarker.border.color = ((point.border) && point.border.color) ? point.border.color : series.border.color;
                        trackMarker.border.width = ((point.border) && point.border.width) ? point.border.width : series.border.width;
                    }
                }

                if ((!this.chartObj.model.crosshair.visible || ej.util.isNullOrUndefined(trackMarker.fill)) && series.type.toLowerCase() != "bubble" && series.type.toLowerCase() != "scatter" && (drawType != "scatter")) {
                    if (trackMarker.shape.toLowerCase() == "cross" || trackMarker.shape.toLowerCase() == "horizline" || trackMarker.shape.toLowerCase() == "vertline")
                        trackMarker.fill = jQuery.type(this.chartObj.model.seriesColors[serIndex]) == "array" ? this.chartObj.model.seriesColors[serIndex][0].color : this.chartObj.model.seriesColors[serIndex];
                    else
                        trackMarker.fill = element.border.color;
                }
                if (series.type.toLowerCase() == "bubble" && !this.chartObj.model.enableCanvasRendering) {
                    var box = $(this.chartObj.gSeriesEle).find("#" + this.chartObj.svgObject.id + '_Series' + serIndex + '_Point' + ptIndex)[0].getBoundingClientRect();
                    trackMarker.size.width = (box.right - box.left) / 2 + 15;
                    trackMarker.size.height = (box.bottom - box.top) / 2 + 15;
                } else {
                    if (trackMarker.size.width <= element.size.width)
                        trackMarker.size.width = element.size.width + 2;
                    if (trackMarker.size.height <= element.size.height)
                        trackMarker.size.height = element.size.height + 2;

                    if (ej.util.isNullOrUndefined(trackMarker.border.color) || !this.chartObj.model.crosshair.visible) {
                        if (!ej.util.isNullOrUndefined(element.fill))
                            trackMarker.border.color = jQuery.type(element.fill) == "array" ? element.fill._gradientStop[0].color : element.fill;
                        else if (seriesType == 'scatter') {
                            trackMarker.border.color = ((point.border) && point.border.color) ? point.border.color : series.border.color;
                            trackMarker.border.width = ((point.border) && point.border.width) ? point.border.width : series.border.width;
                        }
                        else
                            trackMarker.border.color = (point.fill) ? point.fill : (jQuery.type(this.chartObj.model.seriesColors[serIndex]) == "array" ? this.chartObj.model.seriesColors[serIndex][0].color : this.chartObj.model.seriesColors[serIndex]);
                    }
                }
            }
            series._trackMarker = trackMarker;
            return trackMarker;


        },

        dataLabelSymbol: function (seriesIndex, series, pointIndex, x, y, width, height, symbolName, sender, group) {
            var chartObj = sender;
            if (symbolName == 'None')
                return;
            var point = chartObj.model._isPieOfPie ? ej.ejChart._getPieOfPiePoint(pointIndex, series) : series._visiblePoints[pointIndex];
            var location = { startX: x, startY: y };
            if (!sender.model.enable3D)
                var symbolEle = group ? group : chartObj.gDataLabelEle[seriesIndex];
            symbolEle = chartObj.model.enableCanvasRendering ? null : symbolEle;
            var element = $.extend(true, {}, series.marker, point.marker);
            var gradientName = "symbol";
            var style = { 'interior': element.dataLabel.fill, 'opacity': element.dataLabel.opacity, 'borderColor': element.dataLabel.border.color, 'borderWidth': element.dataLabel.border.width };
            var options = {
                'style': style,
                'gradientName': gradientName,
                'symbolEle': symbolEle,
                'width': width,
                'height': height,
                'point': point,
                'location': location,
                'seriesIndex': seriesIndex,
                'pointIndex': pointIndex,
                'element': element,
                'symbolName': symbolName,
                'id': chartObj.svgObject.id + '_dataLabel_series' + seriesIndex + "_" + pointIndex
            };
            this.drawSymbolStyle(options, chartObj);
        },

        drawSymbolStyle: function (options, sender) {
            var chartObj = sender;
            var borderColor, borderWidth, opacity;
            var style = options.style, gradientName = options.gradientName, symbolEle = options.symbolEle,
                width = options.width, dashArray = options.dashArray;
            var height = options.height, point = options.point, location = options.location,
                seriesIndex = options.seriesIndex, visibility = options.visibility;
            var pointIndex = options.pointIndex, element = options.element, symbolName = options.symbolName;
            var trackSymbol = options.trackSymbol;
            var isCanvas = chartObj.model.enableCanvasRendering;
            var isPolar = chartObj.model.AreaType == 'polaraxes';
            var series = chartObj.model.series[seriesIndex];

            if (style != null) {
                if (style.borderColor != "")
                    borderColor = style.borderColor ? style.borderColor : "transparent";

                opacity = style.opacity;
                borderWidth = style.borderWidth < 0 ? 0 : style.borderWidth;
            }
            var colors = null;
            if (style.interior) {
                colors = ej.util.isNullOrUndefined(style.interior._gradientStop) ? style.interior : style.interior._gradientStop;
            }
            else {
                if (point.fill)
                    colors = jQuery.type(point.fill) == "array" ? point.fill[0].color : point.fill;
                else {
                    var pointColors = chartObj.model.pointColors;
                    colors = (chartObj.model.AreaType != "none") ? ((series.type.toLowerCase() == "waterfall" && series.positiveFill && (point.y > 0 || point.waterfallSum > 0)) ? series.positiveFill :
                        chartObj.model.seriesColors[seriesIndex]) : jQuery.type(pointColors[pointIndex]) == "array" ? pointColors[pointIndex][0].color : pointColors[pointIndex];
                }
            }
            chartObj.symbolColorName = chartObj.svgRenderer.createGradientElement(gradientName + seriesIndex, colors, 0, 0, 0, $(chartObj.svgObject).height(), symbolEle);

            var symbolStyle = {
                dashArray: options.dashArray,
                ShapeSize: {
                    width: width,
                    height: height
                },
                Style: {
                    BorderColor: borderColor,
                    BorderWidth: borderWidth,
                    Opacity: opacity,
                    Visibility: visibility,
                    Color: chartObj.symbolColorName
                },
                PointIndex: pointIndex,
                SeriesIndex: seriesIndex,
                Imageurl: element.imageUrl,
                Image: element.image,
                ID: options.id
            };

            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { location: location, style: symbolStyle };
            chartObj._trigger("symbolRendering", commonEventArgs);
            if (!commonEventArgs.cancel) {
                if (isCanvas) {
                    //Added for Marker location while setting plotoffset value to axis
                    location.startY = (!chartObj.model.requireInvertedAxes) ? (location.startY + (series.yAxis.y ? (series.yAxis.y - chartObj.canvasY) : 0)) : location.startY;
                    location.startX = (!chartObj.model.requireInvertedAxes) ? (location.startX + (series.xAxis.x ? (series.xAxis.x - chartObj.canvasX) : 0)) : location.startX;

                    commonEventArgs.data.location.startY = location.startY;
                    if (ej.util.isNullOrUndefined(trackSymbol)) { // to draw marker/datalabel
                        if (chartObj.model.AreaType == "cartesianaxes") {
                            symbolEle = chartObj.svgRenderer.ctx;
                            chartObj.svgRenderer.ctx.save();
                            chartObj.svgRenderer.ctx.beginPath();
                            if (!chartObj.model.requireInvertedAxes)
                                chartObj.svgRenderer.ctx.rect(series.xAxis.x, series.yAxis.y, series.xAxis.width, series.yAxis.height);
                            else
                                chartObj.svgRenderer.ctx.rect(series.yAxis.x, series.xAxis.y, series.yAxis.width, series.xAxis.height);
                            chartObj.svgRenderer.ctx.clip();
                            ej.EjSvgRender.chartSymbol["_draw" + symbolName](commonEventArgs.data.location, commonEventArgs.data.style, chartObj, symbolEle);
                            chartObj.svgRenderer.ctx.restore();
                        }
                        else {
                            if (isCanvas && isPolar) {
                                chartObj.svgRenderer.ctx.save();
                                chartObj.svgRenderer.ctx.beginPath();
                                chartObj.svgRenderer.ctx.arc(chartObj.model.centerX, chartObj.model.centerY, chartObj.model.Radius, 0, 2 * Math.PI, false);
                                chartObj.svgRenderer.ctx.clip();
                            }
                            ej.EjSvgRender.chartSymbol["_draw" + symbolName](commonEventArgs.data.location, commonEventArgs.data.style, chartObj, symbolEle);
                            if (isCanvas && isPolar)
                                chartObj.svgRenderer.ctx.restore();
                        }

                    }
                    else {
                        var ptIndex = commonEventArgs.data.style.PointIndex;
                        var serIndex = commonEventArgs.data.style.SeriesIndex;
                        if (!chartObj.model.series[serIndex].highlightSettings.enable) {
                            if ($('#' + chartObj._id + '_selection_' + serIndex + '_' + ptIndex + '_canvas').length == 0)
                                chartObj.svgRenderer.trackSymbol(commonEventArgs.data.style, commonEventArgs.data.location, symbolName, trackSymbol, chartObj);
                        }
                    }
                }
                else {
                    var ptIndex = commonEventArgs.data.style.PointIndex;
                    var serIndex = commonEventArgs.data.style.SeriesIndex;
                    var type = series.type;
                    var className;
                    if (series.highlightSettings.enable && trackSymbol && !chartObj.model.crosshair.visible) {
                        var style = $.extend(true, commonEventArgs.data.style);
                        var highlight = series.highlightSettings;
                        style.Style.Color = (highlight.pattern.toLowerCase() == "none" || highlight.pattern == "") ? (highlight.color != "" ? highlight.color : style.Style.Color) : "url(#" + highlight.pattern.toLowerCase() + '_Highlight_2D_' + serIndex + ")";
                        style.Style.Opacity = highlight.opacity;
                        style.Style.BorderColor = highlight.border.color;
                        style.Style.BorderWidth = highlight.border.width;
                        // checked condition for is already selected or not
                        if (type == 'bubble')
                            className = $('#' + this.chartObj.svgObject.id + '_Series' + serIndex + '_Point' + ptIndex).attr('class');
                        else
                            className = $('#' + this.chartObj.svgObject.id + '_Series' + serIndex + '_Point' + ptIndex + '_symbol').attr('class');
                        if (className != "SelectionStyleseries" + serIndex)
                            ej.EjSvgRender.chartSymbol["_draw" + symbolName](commonEventArgs.data.location, style, chartObj, (chartObj.model.enable3D) ? sender.chart3D : symbolEle);
                    }
                    else {
                        if (type == 'scatter')
                            className = $('#' + chartObj.svgObject.id + '_Series' + serIndex + '_Point' + ptIndex + '_symbol').attr('class');
                        else
                            className = $('#' + chartObj.svgObject.id + '_Series' + serIndex + '_Point' + ptIndex).attr('class');
                        if (className != "SelectionStyleseries" + serIndex)
                            ej.EjSvgRender.chartSymbol["_draw" + symbolName](commonEventArgs.data.location, commonEventArgs.data.style, chartObj, (chartObj.model.enable3D) ? sender.chart3D : symbolEle);
                    }
                }
            }

            if (!sender.chart3D && type != "pieofpie" && chartObj.model.AreaType == "none" && $(symbolEle).children().not("defs").length > chartObj.model._visibleSeries[seriesIndex]._visiblePoints.length) {
                $(symbolEle.childNodes[options.pointIndex]).replaceWith($(symbolEle.childNodes[$(symbolEle.childNodes).length - 1]));
            }

        },

        drawSymbol: function (seriesIndex, series, pointIndex, x, y, chart, trackSymbol, trackcount) {
            var drawType = series.drawType;
            if (ej.util.isNullOrUndefined(this.chartObj)) this.chartObj = chart;


            var point = series._visiblePoints[pointIndex], seriesType = series.type.toLowerCase(),
                index = seriesType == "boxandwhisker" ? trackcount : pointIndex,
                dashArray = (seriesType == 'bubble' || seriesType == 'scatter') ? series.border.dashArray : "";
            var symbolName = "None";
            var tracker = this.changeCrossHairSymbol(point.marker ? point.marker : series.marker, trackSymbol, pointIndex, seriesIndex, series);
            if (seriesType.toLowerCase() == 'boxandwhisker')
                var element = tracker ? tracker : $.extend(true, {}, series.outlierSettings, point.outlierSettings, series.border, point.border);
            else
                var element = tracker ? tracker : $.extend(true, {}, series.marker, point.marker);

            $.each(this.chartObj.model.symbolShape, function (name) {
                if (element.shape.toLowerCase() == name.toLowerCase())
                    symbolName = name;
            });
            if (symbolName == "None")
                return;
            var location = this.chartObj.model.AreaType == "cartesianaxes" ? { startX: x + this.chartObj.canvasX, startY: y + this.chartObj.canvasY } : { startX: x, startY: y };
            var borderColor, borderWidth, style;
            if (seriesType == 'scatter' || series.drawType == "scatter") {
                borderColor = ((point.border) && point.border.color) ? point.border.color : series.border.color;
                borderWidth = ((point.border) && point.border.width) ? point.border.width : series.border.width;
                style = { 'interior': element.fill, 'opacity': element.opacity, 'borderColor': borderColor, 'borderWidth': borderWidth };
            }
            else if (seriesType == "boxandwhisker") {
                borderColor = ((point.border) && point.border.color) ? (point.border.color == "transparent" ? this.chartObj._saturationColor(series.fill, -0.6) : point.border.color) : (series.border.color == "transparent" ? this.chartObj._saturationColor(series.fill, -0.6) : series.border.color);
                borderWidth = ((point.border) && point.border.width) ? point.border.width : series.border.width;
                style = { 'interior': series.fill, 'opacity': series.opacity, 'borderColor': borderColor, 'borderWidth': borderWidth };
            }
            else {
                var style = { 'interior': element.fill, 'opacity': element.opacity, 'borderColor': element.border.color, 'borderWidth': element.border.width };
            }
            var symbolEle = (trackSymbol) ? this.chartObj.gTrackerEle : this.chartObj.gSymbolGroupEle[seriesIndex];
            var id = (trackSymbol) ? (this.chartObj.svgObject.id + '_trackSymbol_' + seriesIndex + "_" + index) : (this.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + index + '_symbol');
            var gradientName = trackSymbol ? "TrackSymbol" : "symbol";
            var width = element.size.width;
            var height = element.size.height;
            var options = {
                'style': style,
                'gradientName': gradientName,
                'symbolEle': symbolEle,
                'width': width,
                'height': height,
                'point': point,
                'location': location,
                'seriesIndex': seriesIndex,
                'pointIndex': pointIndex,
                'element': element,
                'visibility': (point.visible) ? 'visible' : 'hidden',
                'symbolName': symbolName,
                'trackSymbol': trackSymbol,
                'id': id,
                'dashArray': dashArray
            };
            if (!this.chartObj.model.enableCanvasRendering)
                var imgMarkerEle = this.chartObj.gSymbolGroupEle[seriesIndex].childNodes[pointIndex];
            if (!ej.util.isNullOrUndefined(imgMarkerEle) && symbolName.toLowerCase() == "image") {
                imgMarkerEle.setAttribute('width', width);
                imgMarkerEle.setAttribute('height', height);
            }
            else
                this.drawSymbolStyle(options, this.chartObj, trackSymbol);

            if (series.type.toLowerCase() == "scatter") {
                var areaBoundsX = series.xAxis.x;
                var areaBoundsY = series.yAxis.y;
                if (this.chartObj.model.enableCanvasRendering) {
                    areaBoundsX = 0;
                    areaBoundsY = 0;
                }
                var bounds = { X: areaBoundsX + location.startX - (height / 2), Y: areaBoundsY + location.startY - (width / 2), Height: height, Width: width };
                ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, series, null, pointIndex);
            }
        },

        chartAreaType: "cartesianAxes",
        requireInvertedAxes: false,
        stackingSeries: false,
        hiloTypes: false

    };


    function ejExtendClass(parent, members) {
        var object = function () { };
        object.prototype = new parent();
        $.extend(object.prototype, members);
        return object;
    }

    ej.ejLineSeries = ejExtendClass(ej.EjSeriesRender);

    ej.seriesTypes.line = ej.ejLineSeries;


    ej.ejStepLineSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options) {
            var chartObj = this.chartObj = chart;
            var lDirection;
            options._animationType = "path";
            var sb = ej.EjSvgRender.utils._getStringBuilder();
            var currentseries = options;
            var style = this.setLineSeriesStyle(currentseries);
            if (currentseries.sorting)
                currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = options._visiblePoints = currentseries.points.length > 100 || !currentseries.enableSmartLabels ? this.improveChartPerformance(currentseries) : this._isVisiblePoints(currentseries);
            var firstPoint = null;
            var startPath = "M";
            var secondPoint, nextpoint, point1, point2, point3;
            var firstIndex = -1;
            for (var i = 0; i < visiblePoints.length; i++) {
                secondPoint = visiblePoints[i];
                if (secondPoint.visible) {
                    if (firstPoint != null) {
                        if (visiblePoints.length > firstIndex + 1) {
                            nextpoint = { xValue: visiblePoints[firstIndex + 1].xValue, YValues: [firstPoint.YValues[0]] };
                            point1 = ej.EjSvgRender.utils._getPoint(firstPoint, currentseries);
                            point2 = ej.EjSvgRender.utils._getPoint(nextpoint, currentseries);
                            point3 = ej.EjSvgRender.utils._getPoint(visiblePoints[firstIndex + 1], currentseries);
                            chartObj = this.chartObj;
                            sb.append(startPath + " " + (point1.X + chartObj.canvasX) + " " + ((point1.Y + chartObj.canvasY)) + " " +
                                "L" + " " + (point2.X + chartObj.canvasX) + " " + ((point2.Y + chartObj.canvasY)) + " " +
                                "L" + " " + (point3.X + chartObj.canvasX) + " " + ((point3.Y + chartObj.canvasY)) + " ");
                        }
                        startPath = "L";
                    }
                    firstPoint = secondPoint;
                    firstIndex = i;
                }
                else {
                    firstPoint = null;
                    startPath = "M";
                }
            }
            lDirection = sb.toString();

            this._drawLinePath(currentseries, style, lDirection);

            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);
        }

    });

    ej.ejStepAreaSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            options._animationType = "path";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var aDirection;
            var sb = ej.EjSvgRender.utils._getStringBuilder();
            var currentseries = options;
            var style = this.setAreaSeriesStyle(currentseries);
            if (currentseries.sorting)
                currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = options._visiblePoints = currentseries.points.length > 100 || !currentseries.enableSmartLabels ? this.improveChartPerformance(currentseries) : this._calculateVisiblePoints(currentseries).visiblePoints;
            var xOffset = 0;
            var firstPoint = null;
            var secondPoint;
            if (currentseries.xAxis._valueType.toLowerCase() == "category" && currentseries.xAxis.labelPlacement.toLowerCase() != "onticks")
                xOffset = 0.5;
            var origin = ej.EjSeriesRender.prototype.getOrigin(this, currentseries, params);
            var startPoint = null;
            var start = true;
            var chartObj = this.chartObj;
            for (var i = 0; i <= visiblePoints.length; i++) {

                if (i < visiblePoints.length) {
                    if (visiblePoints[i].visible) {

                        secondPoint = { xValue: visiblePoints[i].xValue - xOffset, YValues: [visiblePoints[i].y] };
                        point1 = ej.EjSvgRender.utils._getPoint(secondPoint, currentseries);
                        if (!startPoint) {
                            startPoint = { xValue: visiblePoints[i].xValue - xOffset, YValues: [origin] }
                            var startLoc = ej.EjSvgRender.utils._getPoint(startPoint, currentseries);
                            sb.append("M" + " " + (startLoc.X + chartObj.canvasX) + " " + (startLoc.Y + chartObj.canvasY) + " ");
                        }
                        if (firstPoint != null) {
                            var step = { xValue: secondPoint.xValue, YValues: [firstPoint.YValues[0]] };
                            var stepPoint = ej.EjSvgRender.utils._getPoint(step, currentseries);
                            if (start) {
                                sb.append("L" + " " + (point2.X + chartObj.canvasX) + " " + (point2.Y + chartObj.canvasY) + " ");
                                start = false;
                            }
                            sb.append("L" + " " + (stepPoint.X + chartObj.canvasX) + " " + ((stepPoint.Y + chartObj.canvasY)) + " " + "L" + " " + (point1.X + chartObj.canvasX) + " " + (point1.Y + chartObj.canvasY) + " ");
                            if ((xOffset == 0 && i == visiblePoints.length - 1) || (i < (visiblePoints.length - 1) && !visiblePoints[i + 1].visible)) {
                                if (xOffset > 0) {
                                    secondPoint = { xValue: visiblePoints[i].xValue + xOffset, YValues: [visiblePoints[i].y] };
                                    var point1 = ej.EjSvgRender.utils._getPoint(secondPoint, currentseries);
                                    if (requireInvertedAxes)
                                        sb.append("L" + " " + (point1.X + chartObj.canvasX) + " " + (point1.Y + chartObj.canvasY) + " " + "L" + " " + (point1.Y + chartObj.canvasX) + " " + (startLoc.X + chartObj.canvasY) + " ");
                                    else
                                        sb.append("L" + " " + (point1.X + chartObj.canvasX) + " " + (point1.Y + chartObj.canvasY) + " " + "L" + " " + (point1.X + chartObj.canvasX) + " " + (startLoc.Y + chartObj.canvasY) + " ");
                                }
                                else
                                    if (requireInvertedAxes)
                                        sb.append("L" + " " + (startLoc.X + chartObj.canvasY) + " " + (point1.Y + chartObj.canvasX) + " ");
                                    else
                                        sb.append("L" + " " + (point1.X + chartObj.canvasX) + " " + (startLoc.Y + chartObj.canvasY) + " ");
                                startPoint = null;
                                firstPoint = null;
                                start = true;
                            }
                        }
                        if (startPoint) {
                            var point2 = point1;
                            firstPoint = secondPoint;
                        }
                    }
                    else {
                        startPoint = null;
                        firstPoint = null;
                        start = true;
                    }

                }
                else {
                    if (visiblePoints[i - 1].visible && xOffset > 0) {
                        secondPoint = { xValue: visiblePoints[i - 1].xValue + xOffset, YValues: [visiblePoints[i - 1].y] };
                        var point1 = ej.EjSvgRender.utils._getPoint(secondPoint, currentseries);
                        if (requireInvertedAxes)
                            sb.append("L" + " " + (point1.X + chartObj.canvasX) + " " + (point1.Y + chartObj.canvasY) + " " + "L" + " " + (point1.Y + chartObj.canvasX) + " " + (startLoc.X + chartObj.canvasY) + " ");
                        else
                            sb.append("L" + " " + (point1.X + chartObj.canvasX) + " " + (point1.Y + chartObj.canvasY) + " " + "L" + " " + (point1.X + chartObj.canvasX) + " " + (startLoc.Y + chartObj.canvasY) + " ");
                    }
                }

            }
            aDirection = sb.toString();

            this.drawAreaPath(currentseries, style, aDirection);
            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        }
    });
    ej.seriesTypes.steparea = ej.ejStepAreaSeries;


    ej.seriesTypes.stepline = ej.ejStepLineSeries;


    ej.ejColumnSeries = ejExtendClass(ej.EjSeriesRender, {



        draw: function (chart, options, params) {
            this.chartObj = chart;
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            options._animationType = "rect";
            if (options.columnFacet == "cylinder")
                options._animationType = "cylinder";
            var series = options;
            var cornerRadius = series.cornerRadius;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var origin = ej.EjSeriesRender.prototype.getOrigin(this, series, params);

            var sidebysideinfo = this.getSideBySideInfo(series, params);
            if (series.dragSettings.enable) series.sidebysideInfo = sidebysideinfo;
            var visiblePoints = this._isVisiblePoints(series);

            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);

            var pointMarker;

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = visiblePoints[i];
                pointMarker = visiblePoints[i].marker;

                var y1 = point.YValues[0];
                var y2 = origin;
                if (point.visible) {
                    //calculate sides
                    var data = cSer.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;

                    var styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);

                    var rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);

                    //drawing part
                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);

                    var bounds;
                    if ((xr == 0 || yr == 0) && rect.Width > 0) {
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'plot': y1 < 0 ? "negative" : "positive",
                            'stroke-width': styleOptions.borderWidth,
                            'opacity': styleOptions.opacity,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };
                        var cylinderSeriesOption = {
                            'isColumn': true,
                            'stacking': false,
                            'isLastSeries': true,
                        };
                        if (series.columnFacet == "cylinder")
                            cSer.chartObj.svgRenderer.drawCylinder(options, cSer.gSeriesGroupEle, cylinderSeriesOption);
                        //calculate path for rounded corner
                        else if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0 || cornerRadius.topRight > 0
                            || cornerRadius.bottomRight > 0) {
                            var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                            options.d = roundrect;
                            series._animationType = "path";
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }
                        else if (series.columnFacet == "rectangle")
                            cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle);
                        var svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };
                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }
                    options.plot = y1 < 0 ? "negative" : "positive";
                    if (requireInvertedAxes)
                        point.symbolLocation = { X: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? (rect.X) : (rect.X + rect.Width), Y: ((rect.Y) + (rect.Height / 2)) };
                    else
                        point.symbolLocation = { X: rect.X + (rect.Width / 2), Y: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? ((rect.Y) + (rect.Height)) : (rect.Y) };

                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        isRegion: true

    });
    ej.seriesTypes.column = ej.ejColumnSeries;

    ej.ejStackingColumnSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            options._animationType = "rect";
            if (options.columnFacet == "cylinder")
                options._animationType = "cylinder";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var series = options;
            var cornerRadius = series.cornerRadius;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            //var origin = Math.max(options.yAxis.visibleRange.min, 0);

            var sidebysideinfo = this.getSideBySideInfo(series, params);
            var visiblePoints = this._isVisiblePoints(series);

            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = series._visiblePoints[i];

                var y2 = series.stackedValue.StartValues[i];
                var y1 = series.stackedValue.EndValues[i];
                if (point.visible) {
                    //calculate sides
                    var data = cSer.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;

                    var styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);

                    var rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);

                    //drawing part
                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);

                    var bounds;
                    var isstacking100 = series.type == 'stackingcolumn100' ? true : false;
                    if ((xr == 0 || yr == 0) && rect.Width > 0) {
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'plot': y1 < 0 ? "negative" : "positive",
                            'opacity': styleOptions.opacity,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };
                        var cylinderSeriesOption = {
                            'isColumn': true,
                            'stacking': isstacking100,
                            'isLastSeries': series.stackedValue.stackedSeries,
                        };
                        if (series.columnFacet == "cylinder")
                            cSer.chartObj.svgRenderer.drawCylinder(options, cSer.gSeriesGroupEle, cylinderSeriesOption);
                        else if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                            || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0)           //calculate path for rounded corner
                        {
                            var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                            options.d = roundrect;
                            series._animationType = "path";
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }
                        else if (series.columnFacet == "rectangle")
                            cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle);

                        var svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };
                        var rx = rect.Width / 2,
                            length = Math.round(rect.Height),
                            ry = Math.round(rx / 4);
                        if (ry == length)
                            bounds.Height = rect.Height + 2 * ry;
                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }

                    if (requireInvertedAxes)
                        point.symbolLocation = { X: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? (rect.X) : (rect.X + rect.Width), Y: ((rect.Y) + (rect.Height / 2)) };
                    else
                        point.symbolLocation = { X: rect.X + (rect.Width / 2), Y: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? ((rect.Y) + (rect.Height)) : (rect.Y) };

                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);



        },

        stackingSeries: true,
        isRegion: true

    });
    ej.seriesTypes.stackingcolumn = ej.ejStackingColumnSeries;

    ej.seriesTypes.stackingcolumn100 = ej.ejStackingColumnSeries;

    ej.seriesTypes.rangecolumn = ej.ejRangeColumnSeries;

    ej.ejRangeColumnSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            options._animationType = "rect";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var series = options;
            var cornerRadius = series.cornerRadius;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);

            var sidebysideinfo = this.getSideBySideInfo(series, params);
            var visiblePoints = this._isVisiblePoints(series);

            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = visiblePoints[i];

                var y1 = point.YValues[0];
                var y2 = point.YValues[1];
                if (point.visible) {
                    //calculate sides
                    var data = cSer.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;

                    var styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);

                    var rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);
                    var width = cSer.chartObj.model.m_AreaBounds.Width;
                    //drawing part
                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);

                    var bounds;
                    if (xr == 0 || yr == 0) {
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'opacity': styleOptions.opacity,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };

                        if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                            || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0)           //calculate path for rounded corner
                        {
                            var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                            options.d = roundrect;
                            series._animationType = "path";
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }
                        else
                            cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle, trans.y);

                        cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle, trans.y);

                        //Add region for each rect
                        var svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };
                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }
                    //Add rect location details for symbol                
                    if (series.type.toLowerCase() == "waterfall")
                        y1 = point.waterfallSum ? point.waterfallSum : point.y;
                    if (requireInvertedAxes)
                        point.symbolLocation = { X: ((y1 < 0 && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > 0)) ? (rect.X) : (rect.X + rect.Width), Y: ((rect.Y) + (rect.Height / 2)) };
                    else
                        point.symbolLocation = { X: rect.X + (rect.Width / 2), Y: ((y1 < 0 && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > 0)) ? ((rect.Y) + (rect.Height)) : (rect.Y) };

                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);



        },

        hiloTypes: true,
        isRegion: true

    });
    ej.seriesTypes.rangecolumn = ej.ejRangeColumnSeries;


    ej.ejBoxandwhiskerSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes, previousStyle;
            options._animationType = "rect";
            var series = options,
                seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries),
                origin = ej.EjSeriesRender.prototype.getOrigin(this, series, params),
                sidebysideinfo = this.getSideBySideInfo(series, params),
                visiblePoints = this._isVisiblePoints(series),
                trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes),
                pointMarker, trackCount = 0,
                serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i, list1, list2, count = 0, y1, y2, data, x1, x2, styleOptions, rect, xr, yr, seriesIndex, sb, newPoint, boxplotmidpoint,
                    bounds, options1, whiskerpath, newPoint1, outlierpoint, svgXyOutlier, boundsOutlier, svgXy,
                    point = visiblePoints[i];
                pointMarker = visiblePoints[i].marker;
                list1 = point.YValues[0];
                list2 = cSer.calculateMean(list1, series, pointIndex);
                y1 = list2.UpperQuartile;
                y2 = list2.LowerQuartile;
                if (point.visible) {
                    //calculate sides
                    data = cSer.calculateSides(point, sidebysideinfo);
                    x1 = data.x1;
                    x2 = data.x2;
                    styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);
                    rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);
                    //drawing part
                    xr = Math.min(0, rect.Width);
                    yr = Math.min(0, rect.Height);
                    seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
                    previousStyle = this.chartObj.setStyle(this, series, seriesIndex, i);
                    sb = ej.EjSvgRender.utils._getStringBuilder();
                    newPoint = { "xValue": point.xValue, "YValues": list2.midvalue };
                    boxplotmidpoint = ej.EjSvgRender.utils._getPoint(newPoint, series);
                    var boxStrokeColor = styleOptions.borderColor == "transparent" ? this.chartObj._saturationColor(styleOptions.interior, -0.6) : styleOptions.borderColor;

                    bounds;
                    if ((xr == 0 || yr == 0) && rect.Width > 0) {
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'plot': y1 < 0 ? "negative" : "positive",
                            'opacity': styleOptions.opacity,
                            'stroke': boxStrokeColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };

                        options1 = {
                            'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex + '_median',
                            x1: series._isTransposed ? boxplotmidpoint.X + cSer.chartObj.canvasX : rect.X + cSer.chartObj.canvasX,
                            y1: series._isTransposed ? rect.Y + cSer.chartObj.canvasY : boxplotmidpoint.Y + cSer.chartObj.canvasY,
                            x2: series._isTransposed ? boxplotmidpoint.X + cSer.chartObj.canvasX : rect.X + rect.Width + cSer.chartObj.canvasX,
                            y2: series._isTransposed ? rect.Y + rect.Height + cSer.chartObj.canvasY : boxplotmidpoint.Y + cSer.chartObj.canvasY,
                            'stroke-width': styleOptions.borderWidth,
                            'stroke': boxStrokeColor,
                        };

                        cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle);

                        //draw mean line for boxandwhisker
                        cSer.chartObj.svgRenderer.drawLine(options1, cSer.gSeriesGroupEle);
                        //draw lowerwhisker path calculation
                        whiskerpath = cSer.calculateBoxAndWhiskerPath(options, rect, options1, list2, series, point, pointIndex);
                        options.d = whiskerpath.lowerWhisker;
                        options.id = options.id + '_whisker';
                        cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        //draw upperwhisker path calculation
                        options.d = whiskerpath.upperWhisker;
                        cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);

                        if (series.showMedian == true) {
                            options.d = whiskerpath.mean;
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }


                        //draw outliers
                        for (var k = 0; k < list2.outliers.length; k++) {
                            newPoint1 = { "xValue": point.xValue, "YValues": list2.outliers[k] };
                            outlierpoint = ej.EjSvgRender.utils._getPoint(newPoint1, series);


                            outlierpoint.X = series._isTransposed ? outlierpoint.X : (rect.X + (rect.Width / 2));
                            outlierpoint.Y = series._isTransposed ? rect.Y + rect.Height / 2 : outlierpoint.Y;

                            this.drawSymbol(seriesIndex, series, pointIndex, outlierpoint.X, outlierpoint.Y, null, null, trackCount);
                            trackCount++;
                            //to store the outlier regions
                            svgXyOutlier = ej.EjSvgRender.utils._getSvgXY(outlierpoint.X, outlierpoint.Y, series, cSer.chartObj);
                            boundsOutlier = { X: svgXyOutlier.X - (series.outlierSettings.size.width / 2), Y: svgXyOutlier.Y - (series.outlierSettings.size.height / 2), Width: series.outlierSettings.size.width, Height: series.outlierSettings.size.height };
                            ej.EjSvgRender.utils._addRegion(cSer.chartObj, boundsOutlier, series, point, pointIndex);

                        }
                        svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };
                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }
                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        isRegion: true



    });
    ej.seriesTypes.boxandwhisker = ej.ejBoxandwhiskerSeries;

    ej.ejWaterfallSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {

            ej.ejRangeColumnSeries.prototype.draw.call(this, chart, options, params);
            options._animationType = "rect";
            var chartRegions = this.chartObj.model.chartRegions;
            var seriesRegions = [];
            var areaBounds = this.chartObj.model.m_AreaBounds;
            var seriesIndex = $.inArray(options, this.chartObj.model._visibleSeries);
            options.index = seriesIndex;

            for (var j = 0, i = 0; j < chartRegions.length; j++) {
                if (seriesIndex == chartRegions[j].SeriesIndex) {
                    seriesRegions[i] = chartRegions[j];
                    i += 1;
                }
            }
            var serOptions1 = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_waterfallLine_' + seriesIndex };

            this.connectorLineGroup = this.chartObj.svgRenderer.createGroup(serOptions1);

            var sb, point1, point2, y, y1, y2, t1, t2, lineOptions, x, x1, x2, w1, w2, h1, h2, lDirection;
            for (var k = 0; k < seriesRegions.length - 1; k++) {
                sb = ej.EjSvgRender.utils._getStringBuilder();
                point1 = seriesRegions[k].Region.Bounds;
                point2 = seriesRegions[k + 1].Region.Bounds;

                if (!options.isTransposed) {
                    y1 = Math.ceil(point1.Y), h1 = Math.ceil(point1.Height), y2 = Math.ceil(point2.Y), h2 = Math.ceil(point2.Height);
                    t1 = Math.ceil(point1.Y + point1.Height);
                    y = ((y1 == y2) ? point1.Y : (t1 == y2 ? point2.Y : (point2.Y + point2.Height)));
                    sb.append("M " + (point1.X) + " " + (y) + " L " + (point2.X + point2.Width) + " " + y);
                } else {
                    x1 = Math.ceil(point1.X), w1 = Math.ceil(point1.Width), x2 = Math.ceil(point2.X), w2 = Math.ceil(point2.Width);
                    t1 = Math.ceil(point1.X + point1.Width);
                    t2 = Math.ceil(point2.X + point2.Width);
                    x = ((t1 == t2) ? (point1.X + point1.Width) : (x1 == x2 ? point1.X : (x1 == t2 ? point1.X : (point1.X + point1.Width))));
                    sb.append("M " + (x) + " " + (point1.Y + point1.Height) + " L " + x + " " + (point2.Y));
                }


                lDirection = sb.toString();
                if (lDirection != "" && point1.Height >= 0) {
                    lineOptions = {
                        'id': this.chartObj.svgObject.id + "_waterFall_" + seriesIndex + "_connectorLine_" + k,
                        'fill': 'none',
                        'stroke-dasharray': options.connectorLine.dashArray,
                        'stroke-width': options.connectorLine.width,
                        'stroke': options.connectorLine.color,
                        'opacity': options.connectorLine.opacity,
                        'd': lDirection
                    };
                    this.chartObj.svgRenderer.drawPath(lineOptions, this.connectorLineGroup);
                }
            }
            this.chartObj.svgRenderer.append(this.connectorLineGroup, this.chartObj.gSeriesEle);

            if (options.enableAnimation && !options._animatedSeries)
                this.chartObj.svgRenderer._setAttr(this.connectorLineGroup, { "visibility": "hidden" });
        },

        hiloTypes: false,
        isRegion: true
    });
    ej.seriesTypes.waterfall = ej.ejWaterfallSeries;

    ej.ejStackingBarSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            options._animationType = "rect";
            if (options.columnFacet == "cylinder")
                options._animationType = "cylinder";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var series = options;
            var cornerRadius = series.cornerRadius;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            //var origin = Math.max(options.yAxis.visibleRange.min, 0);
            var sidebysideinfo = this.getSideBySideInfo(series, params);
            var visiblePoints = this._isVisiblePoints(series);
            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = visiblePoints[i];
                var y1 = series.stackedValue.EndValues[i];
                var y2 = series.stackedValue.StartValues[i];
                if (point.visible) {
                    //calculate sides
                    var data = cSer.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;

                    var styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);

                    var rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);
                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);
                    var isstacking100 = series.type == 'stackingbar100' ? true : false;
                    if (xr == 0 || yr == 0) {
                        var bounds;
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'opacity': styleOptions.opacity,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };
                        var cylinderSeriesOption = {
                            'isColumn': false,
                            'stacking': isstacking100,
                            'isLastSeries': series.stackedValue.stackedSeries,
                        };
                        if (series.columnFacet == "cylinder")
                            cSer.chartObj.svgRenderer.drawCylinder(options, cSer.gSeriesGroupEle, cylinderSeriesOption);
                        else if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                            || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0)           //calculate path for rounded corner
                        {
                            var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                            options.d = roundrect;
                            series._animationType = "path";
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }
                        else if (series.columnFacet == "rectangle")
                            cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle);

                        var svgXy = ej.EjSvgRender.utils._getSvgXY((rect.X), (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };

                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }


                    if (!requireInvertedAxes)
                        point.symbolLocation = { X: rect.X + (rect.Width / 2), Y: ((y1 < (series.yAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.yAxis._crossValue || 0))) ? ((rect.Y) + (rect.Height)) : (rect.Y) };
                    else
                        point.symbolLocation = { X: ((y1 < (series.yAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.yAxis._crossValue || 0))) ? (rect.X) : (rect.X + rect.Width), Y: ((rect.Y) + (rect.Height / 2)) };

                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        stackingSeries: true,
        requireInvertedAxes: true,
        isRegion: true

    });
    ej.seriesTypes.stackingbar = ej.ejStackingBarSeries;

    ej.seriesTypes.stackingbar100 = ej.ejStackingBarSeries;

    ej.ejBarSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            this.chartObj = chart;
            options._animationType = "rect";
            if (options.columnFacet == "cylinder")
                options._animationType = "cylinder";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var series = options;
            var cornerRadius = series.cornerRadius;
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var origin = ej.EjSeriesRender.prototype.getOrigin(this, series, params);
            var style = $.extend(true, {}, this.chartObj.model.seriesStyle, series.style);
            var sidebysideinfo = this.getSideBySideInfo(series, params);
            if (series.dragSettings.enable) series.sidebysideInfo = sidebysideinfo;
            var visiblePoints = this._isVisiblePoints(series);
            var colors;
            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var cSer = this;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                var point = visiblePoints[i];
                var y1 = point.YValues[0];
                var y2 = origin;
                if (point.visible) {
                    //calculate sides
                    var data = cSer.calculateSides(point, sidebysideinfo);
                    var x1 = data.x1;
                    var x2 = data.x2;

                    var styleOptions = this.chartObj.setStyle(cSer, series, seriesIndex, pointIndex);

                    var rect = cSer.getRectangle(x1, y1, x2, y2, series, chart);

                    var xr = Math.min(0, rect.Width);
                    var yr = Math.min(0, rect.Height);

                    if (xr == 0 || yr == 0) {
                        var bounds;
                        options = {
                            'id': cSer.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                            'x': rect.X + cSer.chartObj.canvasX,
                            'y': rect.Y + cSer.chartObj.canvasY,
                            'width': rect.Width,
                            'height': rect.Height,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'plot': y1 < 0 ? "negative" : "positive",
                            'opacity': styleOptions.opacity,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                        };
                        var cylinderSeriesOption = {
                            'isColumn': false,
                            'stacking': false,
                            'isLastSeries': true,
                        };
                        if (series.columnFacet == "cylinder")
                            cSer.chartObj.svgRenderer.drawCylinder(options, cSer.gSeriesGroupEle, cylinderSeriesOption);
                        else if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                            || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0)           //calculate path for rounded corner
                        {
                            var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                            options.d = roundrect;
                            series._animationType = "path";
                            cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                        }
                        else if (series.columnFacet == "rectangle")
                            cSer.chartObj.svgRenderer.drawRect(options, cSer.gSeriesGroupEle);

                        var svgXy = ej.EjSvgRender.utils._getSvgXY((rect.X), (rect.Y), series, cSer.chartObj);
                        bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };

                        ej.EjSvgRender.utils._addRegion(cSer.chartObj, bounds, series, point, pointIndex);
                    }



                    if (!requireInvertedAxes)
                        point.symbolLocation = { X: rect.X + (rect.Width / 2), Y: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? ((rect.Y) + (rect.Height)) : (rect.Y) };
                    else
                        point.symbolLocation = { X: ((y1 < (series.xAxis._crossValue || 0) && !series.yAxis.isInversed) || (series.yAxis.isInversed && y1 > (series.xAxis._crossValue || 0))) ? (rect.X) : (rect.X + rect.Width), Y: ((rect.Y) + (rect.Height / 2)) };

                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        requireInvertedAxes: true,
        isRegion: true
    });
    ej.seriesTypes.bar = ej.ejBarSeries;


    ej.ejStackingAreaSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options) {
            this.chartObj = chart;
            options._animationType = "path";
            var aDirection, currentPoint, point1;
            var areasb = ej.EjSvgRender.utils._getStringBuilder();
            var currentSeries = options;
            var style = this.setAreaSeriesStyle(currentSeries);





            var visiblePoints = this._isVisiblePoints(currentSeries);

            var origin = Math.max(options.yAxis.visibleRange.min, currentSeries.stackedValue.StartValues[0]);
            var canvasX = this.chartObj.canvasX;
            var canvasY = this.chartObj.canvasY;

            var startPoint = { xValue: visiblePoints[0].xValue, YValues: [origin] };
            var startLoc = ej.EjSvgRender.utils._getPoint(startPoint, currentSeries), startValue = 0, endLength = currentSeries.stackedValue.EndValues.length;
            areasb.append("M" + " " + (startLoc.X + canvasX) + " " + (startLoc.Y + canvasY) + " ");

            //var index = $.inArray(currentSeries, this.chartObj.model._visibleSeries);

            for (var j = 0; j <= endLength; j++) {
                if (j != endLength && visiblePoints[j].visible) {
                    currentPoint = { xValue: visiblePoints[j].xValue, YValues: [currentSeries.stackedValue.EndValues[j]] };
                    if (visiblePoints[j].visible) {
                        point1 = visiblePoints[j].location = ej.EjSvgRender.utils._getPoint(currentPoint, currentSeries);
                        areasb.append("L" + " " + (point1.X + canvasX) + " " + ((point1.Y + canvasY)) + " ");
                        visiblePoints[j].YValues[0] = currentPoint.YValues[0];
                    }

                }
                else {
                    origin = currentSeries.stackedValue.StartValues[j + 1];
                    for (var i = j - 1; i >= startValue; i--) {
                        currentPoint = { xValue: visiblePoints[i].xValue, YValues: [currentSeries.stackedValue.StartValues[i]] };
                        point1 = ej.EjSvgRender.utils._getPoint(currentPoint, currentSeries);
                        areasb.append("L" + " " + (point1.X + canvasX) + " " + ((point1.Y + canvasY)) + " ");
                    }
                    if (visiblePoints[j + 1] && visiblePoints[j + 1].visible) {
                        var startPoint = { xValue: visiblePoints[j + 1].xValue, YValues: [currentSeries.stackedValue.StartValues[j + 1]] };
                        var startLoc = ej.EjSvgRender.utils._getPoint(startPoint, currentSeries);
                        areasb.append("M" + " " + (startLoc.X + canvasX) + " " + (startLoc.Y + canvasY) + " ");
                    }
                    startValue = j + 1;
                }
            }




            aDirection = areasb.toString();

            this.drawAreaPath(currentSeries, style, aDirection);

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);




        },

        stackingSeries: true

    });
    ej.seriesTypes.stackingarea = ej.ejStackingAreaSeries;

    ej.seriesTypes.stackingarea100 = ej.ejStackingAreaSeries;

    ej.ejAreaSeries = ejExtendClass(ej.EjSeriesRender, {


        draw: function (chart, options, params) {
            this.chartObj = chart;
            var aDirection;
            options._animationType = "path";
            var areasb = ej.EjSvgRender.utils._getStringBuilder();
            var currentSeries = options;
            var style = this.setAreaSeriesStyle(currentSeries);
            var chartObj = this.chartObj;
            if (currentSeries.sorting)
                currentSeries.points = ej.DataManager(currentSeries.points, ej.Query().sortBy("xValue")).executeLocal();

            var visiblePoints = this.chartObj.dragPoint ? currentSeries.pointCollection : this._isVisiblePoints(currentSeries);
            var origin = ej.EjSeriesRender.prototype.getOrigin(this, currentSeries, params);

            var startPoint;
            var translate = [];
            translate[0] = chartObj.canvasX;
            translate[1] = chartObj.canvasY;
            if (visiblePoints.length > 0) {
                for (var i = 0; i < visiblePoints.length; i++) {
                    if (visiblePoints[i].visible) {
                        if (visiblePoints.length > i + 1) {
                            if (!startPoint) {
                                startPoint = { xValue: visiblePoints[i].xValue, YValues: [origin] }
                                var point1 = ej.EjSvgRender.utils._getPoint(startPoint, currentSeries);
                                areasb.append("M" + " " + (point1.X) + " " + ((point1.Y)) + " ");
                            }


                            var point1 = ej.EjSvgRender.utils._getPoint(visiblePoints[i], currentSeries);

                            areasb.append("L" + " " + (point1.X) + " " + ((point1.Y)) + " ");

                            if (!visiblePoints[i + 1].visible) {
                                var point = { xValue: visiblePoints[i].xValue, YValues: [origin] }
                                var point2 = ej.EjSvgRender.utils._getPoint(point, currentSeries);
                                var point3 = ej.EjSvgRender.utils._getPoint(startPoint, currentSeries);
                                areasb.append("L" + " " + (point2.X) + " " + ((point2.Y)) + " " + "L" + " " + (point3.X) + " " + ((point3.Y)) + " ");
                                startPoint = null;
                            }
                        }
                        else {
                            if (visiblePoints[i - 1] && visiblePoints[i - 1].visible) {
                                var point1 = ej.EjSvgRender.utils._getPoint(visiblePoints[i], currentSeries);
                                areasb.append("L" + " " + (point1.X) + " " + ((point1.Y)) + " ");
                            }
                        }
                    }
                }

                var endPoint = { xValue: visiblePoints[visiblePoints.length - 1].xValue, YValues: [origin] };
                var endLoc = ej.EjSvgRender.utils._getPoint(endPoint, currentSeries);
                if (visiblePoints.length > 1)
                    areasb.append("L" + " " + (endLoc.X) + " " + ((endLoc.Y)) + " ");

                aDirection = areasb.toString();

                this.drawAreaPath(currentSeries, style, aDirection, translate);
            }
            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);




        }

    });

    ej.seriesTypes.area = ej.ejAreaSeries;

    ej.ejRangeAreaSeries = ejExtendClass(ej.EjSeriesRender, {


        draw: function (chart, options) {
            this.chartObj = chart;
            var aDirection;
            options._animationType = "path";
            var areasb = ej.EjSvgRender.utils._getStringBuilder();
            var currentSeries = options;
            var style = this.setAreaSeriesStyle(currentSeries);
            var seriesIndex = $.inArray(currentSeries, this.chartObj.model._visibleSeries);
            currentSeries.points = ej.DataManager(currentSeries.points, ej.Query().sortBy("xValue")).executeLocal();

            var visiblePoints = this._isVisiblePoints(currentSeries);
            var translate = [];
            translate[0] = this.chartObj.canvasX;
            translate[1] = this.chartObj.canvasY;
            var startPoint;
            var internalRegion = []
            for (var i = 0; i < visiblePoints.length; i++) {
                internalRegion[i] = { Region: { PointIndex: i }, SeriesIndex: seriesIndex, region: [] };
                if (visiblePoints[i].visible) {
                    if (!startPoint) {
                        var origin = visiblePoints[i].low;
                        startPoint = { xValue: visiblePoints[i].xValue, YValues: [origin] }
                        var point1 = ej.EjSvgRender.utils._getPoint(startPoint, currentSeries);
                        areasb.append("M" + " " + (point1.X) + " " + ((point1.Y)) + " ");
                    }
                    var point1 = ej.EjSvgRender.utils._getPoint(visiblePoints[i], currentSeries);
                    areasb.append("L" + " " + (point1.X) + " " + ((point1.Y)) + " ");
                    internalRegion[i].region.push({ X: point1.X, Y: point1.Y });
                    if (i != 0)
                        internalRegion[i - 1].region.push({ X: point1.X, Y: point1.Y });

                    if ((i + 1) < visiblePoints.length && !visiblePoints[i + 1].visible) {
                        for (var j = i; j >= 0; j--) {
                            if (visiblePoints[j].visible) {
                                origin = visiblePoints[j].low;
                                var point = { xValue: visiblePoints[j].xValue, YValues: [origin] };
                                var point2 = ej.EjSvgRender.utils._getPoint(point, currentSeries);
                                areasb.append("L" + " " + (point2.X) + " " + ((point2.Y)) + " ");
                                internalRegion[j].region.push({ X: point2.X, Y: point2.Y });
                                if (j != 0)
                                    internalRegion[j - 1].region.push({ X: point2.X, Y: point2.Y });
                            }
                            else
                                break;
                        }
                        startPoint = null;
                    }


                }
            }
            for (var i = visiblePoints.length - 1; i >= 0; i--) {
                if (visiblePoints[i].visible) {
                    origin = visiblePoints[i].low;
                    var point = { xValue: visiblePoints[i].xValue, YValues: [origin] };
                    var point2 = ej.EjSvgRender.utils._getPoint(point, currentSeries);
                    areasb.append("L" + " " + (point2.X) + " " + ((point2.Y)) + " ");
                    internalRegion[i].region.push({ X: point2.X, Y: point2.Y });
                    if (i != 0)
                        internalRegion[i - 1].region.push({ X: point2.X, Y: point2.Y });

                }
                else if (visiblePoints.length > i && visiblePoints[i].visible) {
                    var point2 = ej.EjSvgRender.utils._getPoint(visiblePoints[i], currentSeries);
                    areasb.append("L" + " " + (point2.X) + " " + ((point2.Y)) + " ");
                    break;
                }
                else if (i != (visiblePoints.length - 1)) {
                    var count = 0;
                    for (k = i - 1; k >= 0; k--) {
                        if (visiblePoints[k].visible)
                            count++;
                        else if (!visiblePoints[k].visible)
                            break;
                    }
                    i = i - count;
                }
            }
            aDirection = areasb.toString();
            this.chartObj.model.chartRegions.push(internalRegion);

            this.drawAreaPath(currentSeries, style, aDirection, translate);
            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);
        },

        hiloTypes: true

    });

    ej.seriesTypes.rangearea = ej.ejRangeAreaSeries;

    ej.ejSplineSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options, params) {
            if (!params.seriesCollection) {
                params.seriesCollection = {};
                options._name = ej.util.isNullOrUndefined(options.name) ? "" : options.name.replace(/ /g, '');
            }
            if (!params.seriesCollection[options._name])
                params.seriesCollection[options._name] = {};
            this.chartObj = chart;
            options._animationType = "path";
            var series = options,
                spDirection = "",
                splinesb = ej.EjSvgRender.utils._getStringBuilder(),
                style = this.setLineSeriesStyle(series),
                yIndex = 0,
                visiblePoints = this.chartObj.dragPoint ? series.pointCollection : this._isVisiblePoints(series),
                ySpline = params.seriesCollection[series._name].naturalSpline || this.naturalSpline(visiblePoints, series),
                firstPoint = null,
                secondPoint = null,
                firstIndex = -1, controlPointsCount = 0,
                controlPoints = params.seriesCollection[series._name].controlPoints || [];

            //Removed spline sorting behavior based on the 'X' points.
            //series.points = ej.DataManager(series.points, ej.Query().sortBy("X")).executeLocal();

            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                secondPoint = visiblePoints[i];
                if (secondPoint.visible) {
                    if (firstPoint != null) {
                        var controlPoint1 = null;
                        var controlPoint2 = null;
                        var data = controlPoints[controlPointsCount++] || this.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, series, this);
                        controlPoint1 = data["controlPoint1"];
                        controlPoint2 = data["controlPoint2"];
                        var pt1 = ej.EjSvgRender.utils._getPoint(firstPoint, series);
                        var pt2 = ej.EjSvgRender.utils._getPoint(secondPoint, series);
                        var bpt1 = ej.EjSvgRender.utils._getPoint(controlPoint1, series);
                        var bpt2 = ej.EjSvgRender.utils._getPoint(controlPoint2, series);
                        var chartObj = this.chartObj;
                        splinesb.append("M" + " " + (pt1.X + chartObj.canvasX) + " " + (pt1.Y + chartObj.canvasY) + " " + "C" + " " + (bpt1.X + chartObj.canvasX) + " " + (bpt1.Y + chartObj.canvasY) + " " + (bpt2.X + chartObj.canvasX) + " " + (bpt2.Y + chartObj.canvasY) + " " + (pt2.X + chartObj.canvasX) + " " + (pt2.Y + chartObj.canvasY) + " ");

                    }
                    firstPoint = secondPoint;
                    firstIndex = pointIndex;
                } else {
                    firstPoint = null;
                }
            }

            spDirection = splinesb.toString();
            this._drawLinePath(series, style, spDirection);
            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        }

    });

    ej.seriesTypes.spline = ej.ejSplineSeries;

    ej.ejSplineAreaSeries = ejExtendClass(ej.EjSeriesRender, {


        draw: function (chart, options, params) {
            if (!params.seriesCollection) {
                params.seriesCollection = {};
                options._name = ej.util.isNullOrUndefined(options.name) ? "" : options.name.replace(/ /g, '');
            }
            if (!params.seriesCollection[options._name])
                params.seriesCollection[options._name] = {};
            this.chartObj = chart;
            options._animationType = "path";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            var series = options;
            var spDirection = "";
            var splinesb = ej.EjSvgRender.utils._getStringBuilder();
            var style = this.setAreaSeriesStyle(series);
            var yIndex = 0;
            //Removed splineArea sorting behavior based on the 'X' points.
            if (series.sorting)
                series.points = ej.DataManager(series.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = this.chartObj.dragPoint ? series.pointCollection : this._isVisiblePoints(series);
            var ySpline = params.seriesCollection[series._name].naturalSpline || this.naturalSpline(visiblePoints, series);
            var firstPoint = null;
            var secondPoint = null;
            var firstIndex = -1;

            var origin = ej.EjSeriesRender.prototype.getOrigin(this, series, params);
            var startPoint = null;
            var start = true;
            var chartObj = this.chartObj;
            var translate = [], controlPointsCount = 0, controlPoints = params.seriesCollection[series._name].controlPoints || [];
            translate[0] = chartObj.canvasX;
            translate[1] = chartObj.canvasY;
            var count = 0;
            var seriesIndex = chartObj.model._seriesIndex;
            var previousSeriesPoints = null;
            var stackingsplinepath = [];
            var seriesType = series.type.toLowerCase();
            var emptyPointSettings = series.emptyPointSettings;
            chartObj.model._previousSeries = ej.util.isNullOrUndefined(chartObj.model._previousSeries) ? null : chartObj.model._previousSeries;
            series._prevpointIndex = null;
            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                secondPoint = visiblePoints[i];
                secondPoint.YValues[0] = seriesType.indexOf("stackingsplinearea") != -1 ? series.stackedValue.EndValues[i] : secondPoint.YValues[0];
                if (secondPoint.visible) {
                    if (!startPoint) {
                        if (seriesIndex == 0 || seriesType.indexOf('stackingsplinearea') == -1)
                            startPoint = { xValue: visiblePoints[i].xValue, YValues: [origin] };
                        else {
                            var actualIndex = $.inArray(options, chartObj.model._visibleSeries);
                            for (var m = actualIndex; m > 0; m--) {
                                var ser = chartObj.model.series[m - 1];
                                if (ser.visibility != "hidden") {
                                    previousSeriesPoints = ser.points;
                                    break;
                                }
                            }
                            startPoint = { xValue: visiblePoints[i].xValue, YValues: [previousSeriesPoints[i].YValues[0]] };
                        }
                        var startLoc = ej.EjSvgRender.utils._getPoint(startPoint, series);
                    }
                    if (firstPoint != null) {
                        var controlPoint1 = null;
                        var controlPoint2 = null;
                        if (seriesType.indexOf("stackingsplinearea") != -1)
                            var data = controlPoints[pointIndex - 1] || this.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, series, this);
                        else
                            var data = controlPoints[controlPointsCount++] || this.getBezierControlPoints(firstPoint, secondPoint, ySpline[firstIndex], ySpline[pointIndex], yIndex, series, this);
                        controlPoint1 = data["controlPoint1"];
                        controlPoint2 = data["controlPoint2"];
                        var pt1 = ej.EjSvgRender.utils._getPoint(firstPoint, series);
                        var pt2 = ej.EjSvgRender.utils._getPoint(secondPoint, series);
                        var bpt1 = ej.EjSvgRender.utils._getPoint(controlPoint1, series);
                        var bpt2 = ej.EjSvgRender.utils._getPoint(controlPoint2, series);
                        if (start) {
                            if (requireInvertedAxes)
                                splinesb.append("M" + " " + (startLoc.X) + " " + (pt1.Y) + " " + "L" + " " + (pt1.X) + " " + ((pt1.Y)) + " ");
                            else
                                splinesb.append("M" + " " + (pt1.X) + " " + (startLoc.Y) + " " + "L" + " " + (pt1.X) + " " + ((pt1.Y)) + " ");
                            start = false;
                        }
                        splinesb.append("C" + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (pt2.X) + " " + (pt2.Y) + " ");
                        if (seriesType.indexOf("stackingsplinearea") != -1)
                            stackingsplinepath[pointIndex] = ("C" + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (pt1.X) + " " + (pt1.Y) + " ");
                        if (pointIndex == visiblePoints.length - 1 || (pointIndex < visiblePoints.length - 1 && !visiblePoints[i + 1].visible)) {
                            if (seriesIndex != 0 && seriesType.indexOf("stackingsplinearea") != -1) {
                                startPoint = { xValue: visiblePoints[i].xValue, YValues: [previousSeriesPoints[i].YValues[0]] };
                                startLoc = ej.EjSvgRender.utils._getPoint(startPoint, series);
                            }
                            if (requireInvertedAxes)
                                splinesb.append("L" + " " + (startLoc.X) + " " + (pt2.Y) + " ");
                            else
                                splinesb.append("L" + " " + (pt2.X) + " " + (startLoc.Y) + " ");
                            startPoint = null;
                            start = true;
                            if (emptyPointSettings.displayMode.toLowerCase() == "gap" && pointIndex != visiblePoints.length - 1 && seriesIndex != 0 && seriesType.indexOf("stacking") != -1) {
                                var minvalue = ej.util.isNullOrUndefined(series._prevpointIndex) ? 1 : series._prevpointIndex;
                                for (var j = pointIndex; j >= minvalue; j--) {
                                    if (visiblePoints[j - 1].visible && !ej.util.isNullOrUndefined(chartObj.model._previousSeries)) {
                                        splinesb.append(chartObj.model._previousSeries[j]);
                                        chartObj.model._previousSeries[j] = "";
                                    }
                                    else
                                        break;

                                }
                                series._prevpointIndex = pointIndex + 3;
                            }
                        }
                    }
                    else if (seriesType.indexOf('stackingsplinearea') != -1) {
                        if (pointIndex > 0 && emptyPointSettings.displayMode == "gap") {
                            this.drawbackCurve(controlPoints, series, stackingsplinepath, pointIndex, secondPoint);
                        }

                    }
                    firstPoint = secondPoint;
                    firstIndex = pointIndex;
                } else {
                    firstPoint = null;
                    if (seriesType.indexOf("stackingsplinearea") != -1 && pointIndex > 0 && emptyPointSettings.displayMode == "gap") {
                        this.drawbackCurve(controlPoints, series, stackingsplinepath, pointIndex, secondPoint);
                    }
                }
            }

            spDirection = splinesb.toString();
            if (seriesType.indexOf("stackingsplinearea") != -1 && seriesIndex > 0) {
                chartObj.model._previousSeries = this._getReversePath(chartObj, seriesIndex, chartObj.model._previousSeries);
            }
            spDirection = ej.util.isNullOrUndefined(chartObj.model._previousSeries) ? spDirection : spDirection + chartObj.model._previousSeries + "Z";
            chartObj.model._previousSeries = stackingsplinepath;
            this.drawAreaPath(series, style, spDirection, translate);
            if (this.chartObj.dragPoint)
                this.chartObj.svgRenderer.append(this.chartObj.gPreviewSeriesGroupEle, this.chartObj.gSeriesEle);
            else
                this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        },
        stackingSeries: true,

        _getReversePath: function (chartObj, seriesIndex, reversePath) {
            var emptyPointSettings = chartObj.model.series[seriesIndex].emptyPointSettings,
                path = "", points = chartObj.model.series[seriesIndex].points;
            if (!ej.util.isNullOrUndefined(reversePath)) {
                for (var i = 0; i < points.length; i++) {
                    var pointIndex = i;
                    if (!points[pointIndex].visible) {
                        if (!points[pointIndex].isEmpty || emptyPointSettings.displayMode == "gap") {
                            if (pointIndex == 0) {
                                if (reversePath[pointIndex + 1])
                                    reversePath[pointIndex + 1] = "";
                            }
                            else if (pointIndex == points.length - 1) {
                                if (reversePath[pointIndex])
                                    reversePath[pointIndex] = "";
                            }
                            else {
                                if (reversePath[pointIndex])
                                    reversePath[pointIndex] = "";
                                if (reversePath[pointIndex + 1])
                                    reversePath[pointIndex + 1] = "";
                            }
                        }

                    }
                }
                for (var j = reversePath.length - 1; j > 0; j--) {
                    path = path + reversePath[j];
                }
            }
            return path;
        },

        drawbackCurve: function (controlPoints, series, stackingsplinepath, pointIndex, secondPoint) {
            var data = controlPoints[pointIndex - 1];
            controlPoint1 = data["controlPoint1"];
            controlPoint2 = data["controlPoint2"];
            var pt1 = ej.EjSvgRender.utils._getPoint(series.points[pointIndex - 1], series);
            var pt2 = ej.EjSvgRender.utils._getPoint(secondPoint, series);
            var bpt1 = ej.EjSvgRender.utils._getPoint(controlPoint1, series);
            var bpt2 = ej.EjSvgRender.utils._getPoint(controlPoint2, series);
            stackingsplinepath[pointIndex] = ("C" + " " + (bpt2.X) + " " + (bpt2.Y) + " " + (bpt1.X) + " " + (bpt1.Y) + " " + (pt1.X) + " " + (pt1.Y) + " ");
        }
    });

    ej.seriesTypes.splinearea = ej.ejSplineAreaSeries;
    ej.seriesTypes.stackingsplinearea = ej.ejSplineAreaSeries;
    ej.seriesTypes.stackingsplinearea100 = ej.ejSplineAreaSeries;



    ej.ejScatterSeries = ejExtendClass(ej.EjSeriesRender, {



        draw: function (chart, options) {
            this.chartObj = chart;
            var series = options;
            options._animationType = "scatter";
            var seriesIndex = $.inArray(options, this.chartObj.model._visibleSeries);
            var visiblePoints = series.points.length > 100 || !series.enableSmartLabels ? this.improveChartPerformance(series) : this._isVisiblePoints(series);
            var visiblePointsLength = visiblePoints.length;
            var point, point1;
            options._visiblePoints = visiblePoints;
            for (var i = 0; i < visiblePointsLength; i++) {
                point = visiblePoints[i];
                var pointIndex = i;
                point1 = ej.EjSvgRender.utils._getPoint(point, options);
                this.drawSymbol(seriesIndex, options, pointIndex, point1.X, point1.Y);
            }

        }
    });

    ej.seriesTypes.scatter = ej.ejScatterSeries;


    ej.ejBubbleSeries = ejExtendClass(ej.EjSeriesRender, {

        createBubbleGroup: function (series) {

            var seriesIndex = $.inArray(series, this.chartObj.model.series);
            var areaBoundsX = this.chartObj.model.m_AreaBounds.X;
            var areaBoundsY = this.chartObj.model.m_AreaBounds.Y;
            var isTransposed = series._isTransposed;
            var transX = isTransposed ? areaBoundsX : series.xAxis.x;

            var transY = isTransposed ? areaBoundsY : series.yAxis.y;
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + transX + ',' + transY + ')' };

            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

        },
        draw: function (chart, options) {
            this.chartObj = chart;
            options._animationType = "bubble";
            var series = options;
            var cornerRadius = series.cornerRadius;
            series.points = ej.DataManager(series.points, ej.Query().sortBy("xValue")).executeLocal();
            var seriesIndex = $.inArray(series, this.chartObj.model._visibleSeries);
            var visiblePoints = this._isVisiblePoints(series);
            var sizeValueIndex = 1;
            //bubble responsive
            var bubbleOptions = options.bubbleOptions;
            var mode = bubbleOptions.radiusMode.toLowerCase();
            var temp = 100, minRadius, maxRadius;
            var areaBounds = chart.model.m_AreaBounds;
            var visibleSeries = chart.model._visibleSeries, maximumSize = 0;
            var value = Math.max(areaBounds.Height, areaBounds.Width);
            var segmentRadius, radius, percentChange;

            if (mode == "minmax") {  // minmax mode radius calculation
                percentChange = value / temp;
                minRadius = bubbleOptions.minRadius * percentChange;
                maxRadius = bubbleOptions.maxRadius * percentChange;
                radius = maxRadius - minRadius;
                maximumSize = Math.max.apply(0, $.map(visiblePoints, function (v) { return v.YValues[sizeValueIndex]; }));
            } else {    // auto mode radius calculation
                maxValue = (value / 5) / 2;
                minRadius = maxRadius = 1;
                radius = maxValue * maxRadius;
                for (m = 0; m < visibleSeries.length; m++) {
                    if (visibleSeries[m].type.toLowerCase() == "bubble" && visibleSeries[m].visibility == "visible"
                        && visibleSeries[m].bubbleOptions.radiusMode.toLowerCase() == "auto") {
                        points = visibleSeries[m]._visiblePoints;
                        for (n = 0; n < points.length; n++)
                            maximumSize = maximumSize < points[n].YValues[sizeValueIndex] ? points[n].YValues[sizeValueIndex] : maximumSize;
                    }
                }
            }
            this.createBubbleGroup(series);
            for (var i = 0; i < visiblePoints.length; i++) {
                var point = visiblePoints[i];
                var pointIndex = i;
                if (point.visible) {
                    if (series.bubbleOptions.radiusMode.toLowerCase() == "minmax")
                        segmentRadius = minRadius + radius * Math.abs(point.YValues[sizeValueIndex] / maximumSize);
                    else
                        segmentRadius = radius * Math.abs(point.YValues[sizeValueIndex] / maximumSize);

                    var location = ej.EjSvgRender.utils._getPoint(point, series);

                    var styleOptions = this.chartObj.setStyle(this, series, seriesIndex, pointIndex);

                    var options = {
                        'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex,
                        'cx': location.X + this.chartObj.canvasX,
                        'cy': (location.Y) + this.chartObj.canvasY,
                        'r': segmentRadius,
                        'fill': styleOptions.interior,
                        'cornerRadius': cornerRadius,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke-dasharray': styleOptions.dashArray,
                        'opacity': styleOptions.opacity,
                        'stroke': styleOptions.borderColor
                    };
                    if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                        || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0)           //calculate path for rounded corner
                    {
                        var roundrect = ej.EjSvgRender.utils.calculateroundedCorner(options);
                        options.d = roundrect;
                        cSer.chartObj.svgRenderer.drawPath(options, cSer.gSeriesGroupEle);
                    }
                    else

                        point.radius = segmentRadius; // radius is stored to draw tracksymbol for bubble in canvas

                    this.chartObj.svgRenderer.drawCircle(options, this.gSeriesGroupEle);



                    var cx = location.X;
                    var cy = location.Y;
                    var r = segmentRadius;


                    var valwidth, x, y, valheight;
                    x = ((cx - r) + (series.isTransposed ? this.chartObj.model.m_AreaBounds.X : series.xAxis.x));
                    y = ((cy - r) + (series.isTransposed ? this.chartObj.model.m_AreaBounds.Y : series.yAxis.y));

                    valheight = 2 * r;
                    valwidth = 2 * r;

                    var bounds = { X: x, Y: y, Width: valwidth, Height: valheight };
                    ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, series, null, i);
                }
            }
            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        }
    });

    ej.seriesTypes.bubble = ej.ejBubbleSeries;
    ej.ejhiloSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options, params) {

            this.chartObj = chart;
            options._animationType = "hilo";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            //DrawHiloGraph      

            var currentseries = options;
            currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = this._isVisiblePoints(currentseries);
            var sidebysideinfo = this.getSideBySideInfo(currentseries, params);
            var point = null;

            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var trans = ej.EjSvgRender.utils._getTransform(currentseries.xAxis, currentseries.yAxis, requireInvertedAxes);
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);


            for (var i = 0; i < visiblePoints.length; i++) {
                point = visiblePoints[i];
                var pointIndex = i;
                if (point.visible) {

                    var lDirection = "";
                    if (ej.util.isNullOrUndefined(point.YValues[0]) || ej.util.isNullOrUndefined(point.YValues[1]))
                        continue;

                    var styleOptions = this.chartObj.setStyle(this, currentseries, seriesIndex, pointIndex);

                    var pathInterior = this.chartObj.setHiloStyle(currentseries, pointIndex, seriesIndex);


                    var lowvalue = {}, highvalue = {};
                    if (point.YValues[0] < point.YValues[1]) {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                    } else {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                    }
                    var point1 = ej.EjSvgRender.utils._getPoint(lowvalue, currentseries);
                    var point2 = ej.EjSvgRender.utils._getPoint(highvalue, currentseries);
                    lDirection = "M" + " " + (point1.X + this.chartObj.canvasX) + " " + ((point1.Y + this.chartObj.canvasY)) + " " + "L" + " " + (point2.X + this.chartObj.canvasX) + " " + ((point2.Y + this.chartObj.canvasY)) + " ";
                    var pointbounds = { point1: point1, point2: point2 };
                    this._drawHiloPath(currentseries, styleOptions, pathInterior, lDirection, i, pointbounds);
                }
            }

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);
        },

        hiloTypes: true
    });

    ej.seriesTypes.hilo = ej.ejhiloSeries;

    //Draw HiloOpenClose
    ej.ejhiloopencloseSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options, params) {

            this.chartObj = chart;
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            //DrawHiloGraph      
            options._animationType = "hilo";
            var currentseries = options;
            currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = this._isVisiblePoints(currentseries);
            var sidebysideinfo = this.getSideBySideInfo(currentseries, params);
            var point = null;
            var paletteColor = this.chartObj.model.palette;
            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var trans = ej.EjSvgRender.utils._getTransform(currentseries.xAxis, currentseries.yAxis, requireInvertedAxes);
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

            var interior;




            for (var i = 0; i < visiblePoints.length; i++) {
                var pointIndex = i;
                point = visiblePoints[i];
                if (point.visible) {

                    var lDirection = "";
                    var drawOpenWing = (ej.util.isNullOrUndefined(currentseries.drawMode) ? true : (currentseries.drawMode.toLowerCase() == "both" || currentseries.drawMode.toLowerCase() == "open") ? true : false);
                    var drawCloseWing = (ej.util.isNullOrUndefined(currentseries.drawMode) ? true : (currentseries.drawMode.toLowerCase() == "both" || currentseries.drawMode.toLowerCase() == "close") ? true : false);


                    var lowvalue = {}, highvalue = {}, openvalue = {}, closevalue = {};


                    if (point.YValues[0] < point.YValues[1]) {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                        openvalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[3]] };

                    } else {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                        openvalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[3]] };

                    }
                    currentseries.fill = currentseries.isFill ? currentseries.fill : null;
                    if (point.YValues[2] < point.YValues[3])
                        currentseries.bearFillColor = interior = (ej.util.isNullOrUndefined(currentseries.bearFillColor)) ? ((currentseries.fill) ? currentseries.fill : ((paletteColor && paletteColor.length > 0) ? paletteColor[seriesIndex] : "#339933")) : currentseries.bearFillColor;

                    else
                        currentseries.bullFillColor = interior = (ej.util.isNullOrUndefined(currentseries.bullFillColor)) ? ((currentseries.fill) ? currentseries.fill : ((paletteColor && paletteColor.length > 0) ? paletteColor[seriesIndex] : "#E51400")) : currentseries.bullFillColor;


                    var styleOptions = this.chartObj.setStyle(this, currentseries, seriesIndex, pointIndex, interior);

                    var pathInterior = this.chartObj.setHiloStyle(currentseries, pointIndex, seriesIndex, interior);


                    if (point.fill) {
                        interior = jQuery.type(point.interior) == "array" ? point.fill[0] : point.fill;
                    }
                    else {
                        point._hiloFill = interior;
                    }
                    var canvasX = this.chartObj.canvasX;
                    var canvasY = this.chartObj.canvasY;

                    //Draw open points
                    if (drawOpenWing) {

                        var startOpenValue = { xValue: openvalue.xValue + sidebysideinfo.Median, YValues: openvalue.YValues };
                        var pto1 = ej.EjSvgRender.utils._getPoint(startOpenValue, currentseries);
                        var endOpenValue = { xValue: openvalue.xValue + sidebysideinfo.Start, YValues: openvalue.YValues };
                        var pto2 = ej.EjSvgRender.utils._getPoint(endOpenValue, currentseries);
                        lDirection = "M" + " " + (pto1.X + canvasX) + " " + ((pto1.Y + canvasY)) + " " + "L" + " " + (pto2.X + canvasX) + " " + ((pto2.Y + canvasY)) + " ";
                        var openbounds = { point1: pto1, point2: pto2 };
                        this._drawHiloPath(currentseries, styleOptions, pathInterior, lDirection, i, openbounds);
                        lDirection = "";

                    }
                    //Draw close points
                    if (drawCloseWing) {
                        var startCloseValue = { xValue: closevalue.xValue + sidebysideinfo.Median, YValues: closevalue.YValues };
                        var ptc1 = ej.EjSvgRender.utils._getPoint(startCloseValue, currentseries);
                        var endCloseValue = { xValue: closevalue.xValue + sidebysideinfo.End, YValues: closevalue.YValues };
                        var ptc2 = ej.EjSvgRender.utils._getPoint(endCloseValue, currentseries);
                        lDirection = "M" + " " + (ptc1.X + canvasX) + " " + ((ptc1.Y + canvasY)) + " " + "L" + " " + (ptc2.X + canvasX) + " " + ((ptc2.Y + canvasY)) + " ";
                        var pointbounds = { point1: ptc1, point2: ptc2 };
                        this._drawHiloPath(currentseries, styleOptions, pathInterior, lDirection, i, pointbounds);
                        lDirection = "";

                    }
                    // Draw High low points
                    var point1 = ej.EjSvgRender.utils._getPoint(lowvalue, currentseries);
                    var point2 = ej.EjSvgRender.utils._getPoint(highvalue, currentseries);
                    lDirection = "M" + " " + (point1.X + canvasX) + " " + ((point1.Y + canvasY)) + " " + "L" + " " + (point2.X + canvasX) + " " + ((point2.Y + canvasY)) + " ";
                    var bounds = { point1: point1, point2: point2 };
                    this._drawHiloPath(currentseries, styleOptions, pathInterior, lDirection, i, bounds);
                }

            }
            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        },

        hiloTypes: true

    });

    ej.seriesTypes.hiloopenclose = ej.ejhiloopencloseSeries;

    //Draw candle
    ej.ejCandleSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options, params) {

            this.chartObj = chart;
            options._animationType = "hilo";
            var requireInvertedAxes = this.chartObj.model.requireInvertedAxes;
            //DrawCandleGraph      

            var currentseries = options;
            currentseries.points = ej.DataManager(currentseries.points, ej.Query().sortBy("xValue")).executeLocal();
            var visiblePoints = this._isVisiblePoints(currentseries);
            var sidebysideinfo = this.getSideBySideInfo(currentseries, params);
            var point = null;
            var paletteColor = this.chartObj.model.palette;
            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var trans = ej.EjSvgRender.utils._getTransform(currentseries.xAxis, currentseries.yAxis, requireInvertedAxes);
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);
            var interior, defaultrectHeight = 1;

            for (var i = 0; i < visiblePoints.length; i++) {
                point = visiblePoints[i];
                var pointIndex = i;
                if (point.visible) {

                    var lDirection = "";

                    var lowvalue = {}, highvalue = {}, openvalue = {}, closevalue = {};


                    if (point.YValues[0] < point.YValues[1]) {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                        openvalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[3]] };

                    } else {
                        lowvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[1]] };
                        highvalue = { xValue: point.xValue + sidebysideinfo.Median, YValues: [point.YValues[0]] };
                        openvalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[3]] };

                    }
                    if (point.YValues[2] < point.YValues[3]) {

                        openvalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[3]] };
                        currentseries.bearFillColor = interior = (ej.util.isNullOrUndefined(currentseries.bearFillColor)) ? ((paletteColor && paletteColor.length > 0) ? paletteColor[seriesIndex] : "#339933") : currentseries.bearFillColor;

                    } else {

                        openvalue = { xValue: point.xValue, YValues: [point.YValues[3]] };
                        closevalue = { xValue: point.xValue, YValues: [point.YValues[2]] };
                        currentseries.bullFillColor = interior = (ej.util.isNullOrUndefined(currentseries.bullFillColor)) ? ((paletteColor && paletteColor.length > 0) ? paletteColor[seriesIndex] : "#E51400") : currentseries.bullFillColor;

                    }

                    var styleOptions = this.chartObj.setStyle(this, currentseries, seriesIndex, pointIndex, interior);

                    var pathInterior = this.chartObj.setHiloStyle(currentseries, pointIndex, seriesIndex, interior);

                    if (point.style && point.style.interior) {
                        interior = jQuery.type(point.style.interior) == "array" ? point.style.interior[0] : point.style.interior;
                    }

                    else {
                        point._hiloFill = pathInterior;
                    }

                    //Draw High low points
                    var point1 = ej.EjSvgRender.utils._getPoint(lowvalue, currentseries);
                    var point2 = ej.EjSvgRender.utils._getPoint({ xValue: openvalue.xValue + sidebysideinfo.Median, YValues: [openvalue.YValues[0]] }, currentseries);
                    var point3 = ej.EjSvgRender.utils._getPoint({ xValue: closevalue.xValue + sidebysideinfo.Median, YValues: [closevalue.YValues[0]] }, currentseries);
                    var point4 = ej.EjSvgRender.utils._getPoint(highvalue, currentseries);
                    var canvasX = this.chartObj.canvasX;
                    var canvasY = this.chartObj.canvasY;
                    lDirection = "M" + " " + (point1.X + canvasX) + " " + ((point1.Y + canvasY)) + " " + "L" + " " + (point2.X + canvasX) + " " + ((point2.Y + canvasY)) + " " + "M" + " " + (point3.X + canvasX) + " " + ((point3.Y + canvasY)) + " " + "L" + " " + (point4.X + canvasX) + " " + ((point4.Y + canvasY)) + " ";
                    var pointbounds = { point1: point1, point2: point2 };
                    this._drawHiloPath(currentseries, styleOptions, pathInterior, lDirection, i, pointbounds);
                    //Draw open and close points

                    var startRect = { xValue: closevalue.xValue + sidebysideinfo.Start, YValues: closevalue.YValues };
                    var orginRect = ej.EjSvgRender.utils._getPoint(startRect, currentseries);

                    var rectSize = { xValue: openvalue.xValue + sidebysideinfo.End, YValues: openvalue.YValues },
                        sizeRect = ej.EjSvgRender.utils._getPoint(rectSize, currentseries),
                        rect = ej.EjSvgRender.utils._correctRect(orginRect.X, orginRect.Y, sizeRect.X, sizeRect.Y);
                    //line is drawn when open and close value are same 
                    if (openvalue.YValues[0] == closevalue.YValues[0]) {
                        rect.Y = orginRect.Y - (defaultrectHeight / 2);
                        rect.Height = defaultrectHeight;
                    }
                    var candleOptions = {
                        'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + '_Point' + i,
                        'x': rect.X + this.chartObj.canvasX,
                        'y': rect.Y + this.chartObj.canvasY,
                        'width': rect.Width,
                        'height': rect.Height,
                        'fill': styleOptions.interior,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke-dasharray': styleOptions.dashArray,
                        'stroke': styleOptions.borderColor
                    };

                    this.chartObj.svgRenderer.drawRect(candleOptions, this.gSeriesGroupEle);

                    var svgXy = ej.EjSvgRender.utils._getSvgXY(rect.X, rect.Y, currentseries, this.chartObj);
                    var bounds = { X: svgXy.X, Y: svgXy.Y, Width: rect.Width, Height: rect.Height };

                    ej.EjSvgRender.utils._addRegion(this.chartObj, bounds, currentseries, point, i);

                }

            }
            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        hiloTypes: true
    });
    ej.seriesTypes.candle = ej.ejCandleSeries;

    ej.ejPieOfPieSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options) {
            this.chartObj = chart;
            var series = new ej.seriesTypes["pie"]();
            series.draw(chart, options);
        },
        chartAreaType: "None"
    });
    ej.seriesTypes.pieofpie = ej.ejPieOfPieSeries;

    ej.ejPieSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options) {

            this.chartObj = chart;
            var currentseries = options;
            var internalRegion = [];
            var seriesType = options.type.toLowerCase();
            var pieSeriesIndex = options.collectionIndex;
            var coefficient = pieSeriesIndex == 0 ? currentseries.pieCoefficient : currentseries.pieOfPieCoefficient;
            var isCanvas = this.chartObj.model.enableCanvasRendering;
            var visiblePoints = this._calculateVisiblePoints(options, this.chartObj).visiblePoints;

            var size = this.calculatingSliceAngle(currentseries);
            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var seriesLength = this.chartObj.model._visibleSeries.length;

            var currentSeries = this.chartObj.model._visibleSeries[seriesIndex];
            currentSeries._pieCoefficient = currentSeries.pieCoefficient;
            if (this.chartObj.model.circularRadius.length > 1) {
                for (var i = seriesIndex; !ej.util.isNullOrUndefined(currentSeries.zOrder) ? i >= 0 : i < this.chartObj.model.circularRadius.length; !ej.util.isNullOrUndefined(currentSeries.zOrder) ? i-- : i++) {
                    if (!ej.util.isNullOrUndefined(this.chartObj.model.circularRadius[i])) {
                        this.chartObj.model.circularRadius[seriesIndex] = this.chartObj.model.circularRadius[i] * currentSeries._pieCoefficient;
                        break;
                    }
                }
            }
            else {
                if (seriesType == "pieofpie" && currentSeries.splitMode != "")
                    this.chartObj.model.circularRadius[pieSeriesIndex] = 0.25 * coefficient * Math.min(size.width, size.height);
                else
                    this.chartObj.model.circularRadius[seriesIndex] = 0.5 * currentSeries._pieCoefficient * Math.min(size.width, size.height);
            }

            var min = Math.min(size.width, size.height);
            if (min < 0) {
                return min;
            }
            var totalDegree = Math.abs(currentseries.endAngle - currentseries.startAngle);
            if (totalDegree < 270)
                this.pieDoughnutCenter(currentseries);
            var text;

            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

            var visibility = (currentseries.enableAnimation && !currentseries._animatedSeries) ? 'hidden' : 'visible';


            var txtOptions = { 'id': this.chartObj.svgObject.id + '_TextGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gSeriesTextEle) this.chartObj.gSeriesTextEle = [];
            this.chartObj.gSeriesTextEle[seriesIndex] = pieSeriesIndex == 1 ? this.chartObj.gSeriesTextEle[0] : this.chartObj.svgRenderer.createGroup(txtOptions);
            var symbolOptions = { 'id': this.chartObj.svgObject.id + '_symbolGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gSymbolGroupEle) this.chartObj.gSymbolGroupEle = [];
            this.chartObj.gSymbolGroupEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(symbolOptions);

            var connectorOptions = { 'id': this.chartObj.svgObject.id + '_connectorGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gConnectorEle) this.chartObj.gConnectorEle = [];
            this.chartObj.gConnectorEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(connectorOptions);
            var dataLabelOptions = { 'id': this.chartObj.svgObject.id + '_DataLabel_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gDataLabelEle) this.chartObj.gDataLabelEle = [];
            this.chartObj.gDataLabelEle[seriesIndex] = pieSeriesIndex == 1 ? this.chartObj.gDataLabelEle[0] : this.chartObj.svgRenderer.createGroup(dataLabelOptions);


            for (var j = 0; j < visiblePoints.length; j++) {
                var pointIndex = this.chartObj.model._isPieOfPie ? visiblePoints[j].actualIndex : j;
                if (isNaN(currentseries._visiblePoints[j].startAngle)) continue;
                var point = currentseries._visiblePoints[j];
                if (point.visible) {
                    var result = this._calculateArcData(this.chartObj, pointIndex, point, currentseries, seriesIndex, pieSeriesIndex);
                    var sliceXY = result.Direction.split(" ");
                    var styleOptions = this.chartObj.setStyle(this, currentseries, seriesIndex, j);
                    if (currentseries.startAngle < currentseries.endAngle) // for canvas rendering with modified start and end angle
                        var counterClockWise = false;
                    else
                        counterClockWise = true;
                    if (!this.chartObj.model._isPieOfPie) {
                        for (k = 0; k < currentseries.visiblePoints.length; k++) {
                            if (point == currentseries.visiblePoints[k]) {
                                pointIndex = k;
                                break;
                            }
                        }
                    }
                    options = {
                        'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                        'fill': styleOptions.interior,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke': styleOptions.borderColor,
                        'stroke-dasharray': styleOptions.dashArray,
                        'stroke-linecap': currentseries.lineCap,
                        'stroke-linejoin': currentseries.lineJoin,
                        'd': result.Direction,
                        'opacity': styleOptions.opacity,
                        'data-pointIndex': pointIndex,
                    };

                    canvasOptions = {
                        'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                        'fill': styleOptions.interior,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke': styleOptions.borderColor,
                        'stroke-dasharray': styleOptions.dashArray,
                        'stroke-linecap': currentseries.lineCap,
                        'stroke-linejoin': currentseries.lineJoin,
                        'd': result.Direction,
                        'opacity': styleOptions.opacity,
                        'radius': seriesType == "pieofpie" ? this.chartObj.model.circularRadius[pieSeriesIndex] : this.chartObj.model.circularRadius[seriesIndex],
                        'start': point.startAngle - 1.57,
                        'end': point.endAngle - 1.57,
                        'data-pointIndex': pointIndex,
                        'counterClockWise': counterClockWise,
                        'innerR': 0,
                        'cx': result.centerX,
                        'cy': result.centerY,
                        'x': sliceXY[12],
                        'y': sliceXY[13]
                    };

                    if (isCanvas)
                        this.chartObj.svgRenderer.drawPath(canvasOptions, this.gSeriesGroupEle);
                    else
                        this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);

                    region = {
                        PointIndex: pointIndex, Index: j, StartAngle: point.startAngle, EndAngle: point.endAngle, StartX: this.chartObj.model.startX[pointIndex], StartY: this.chartObj.model.startY[pointIndex],
                        PieSeriesIndex: pieSeriesIndex, SeriesIndex: $.inArray(currentseries, this.chartObj.model._visibleSeries)
                    };
                    internalRegion.push(region);

                }
            }
            var seriesIndex = this.chartObj.model._isPieOfPie ? pieSeriesIndex : seriesIndex;

            if (this.chartObj.model._isPieOfPie && pieSeriesIndex == 1
                && currentSeries.pieCollections[0].length > 0 && currentSeries.pieCollections[1].length == 0) {
                var emptyCircleOptions = this._drawEmptyPieOfPie(this.chartObj);
                this.chartObj.svgRenderer.drawPath(emptyCircleOptions, this.gSeriesGroupEle);
            }

            var seriesData = { Radius: this.chartObj.model.circularRadius[seriesIndex], CenterX: this.chartObj.model.circleCenterX[seriesIndex], CenterY: this.chartObj.model.circleCenterY[seriesIndex] };
            var region = { Series: currentseries, SeriesData: seriesData, Region: internalRegion, SeriesIndex: $.inArray(currentseries, this.chartObj.model._visibleSeries) };
            this.chartObj.model.chartRegions.push(region);

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);
        },

        chartAreaType: "None"

    });

    ej.seriesTypes.pie = ej.ejPieSeries;

    ej.ejDoughnutSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options) {
            this.chartObj = chart;
            var currentseries = options;
            var internalRegion = [];

            var visiblePoints = this._calculateVisiblePoints(options).visiblePoints;
            var size = this.calculatingSliceAngle(currentseries), isCanvas = this.chartObj.model.enableCanvasRendering;
            var visiblePointslength = visiblePoints.length;
            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var seriesLength = this.chartObj.model._visibleSeries.length;
            var seriesLength = this.chartObj.model._visibleSeries.length;
            var currentSeries = this.chartObj.model._visibleSeries[seriesIndex];
            currentSeries._doughnutSize = currentSeries.doughnutSize;
            currentSeries._doughnutCoefficient = currentSeries.doughnutCoefficient;
            if (this.chartObj.model.circularRadius.length > 1) {
                for (var i = seriesIndex; !ej.util.isNullOrUndefined(currentSeries.zOrder) ? i >= 0 : i < this.chartObj.model.circularRadius.length; !ej.util.isNullOrUndefined(currentSeries.zOrder) ? i-- : i++) {
                    if (!ej.util.isNullOrUndefined(this.chartObj.model.circularRadius[i])) {
                        this.chartObj.model.circularRadius[seriesIndex] = this.chartObj.model.circularRadius[i] * currentSeries._doughnutSize;
                        break;
                    }
                }
            }
            else
                this.chartObj.model.circularRadius[seriesIndex] = 0.5 * currentSeries._doughnutSize * Math.min(size.width, size.height);
            var min = Math.min(size.width, size.height);
            if (min < 0) {
                return min;
            }
            var totalDegree = Math.abs(currentseries.endAngle - currentseries.startAngle);
            if (totalDegree < 270)//for centering the chart
                this.pieDoughnutCenter(currentseries);
            this.chartObj.model.innerRadius[seriesIndex] = currentSeries._doughnutCoefficient * this.chartObj.model.circularRadius[seriesIndex];


            var numberToFixed = ej.util.isNullOrUndefined(this.chartObj.model.roundingPlaces) ? 2 : this.chartObj.model.roundingPlaces;

            var seriesIndex = $.inArray(currentseries, this.chartObj.model._visibleSeries);
            var serOptions = { 'id': this.chartObj.svgObject.id + '_SeriesGroup' + '_' + seriesIndex };
            this.gSeriesGroupEle = this.chartObj.svgRenderer.createGroup(serOptions);

            var visibility = (currentseries.enableAnimation && !currentseries._animatedSeries) ? 'hidden' : 'visible';


            var txtOptions = { 'id': this.chartObj.svgObject.id + '_TextGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gSeriesTextEle) this.chartObj.gSeriesTextEle = [];
            this.chartObj.gSeriesTextEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(txtOptions);

            var symbolOptions = { 'id': this.chartObj.svgObject.id + '_symbolGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gSymbolGroupEle) this.chartObj.gSymbolGroupEle = [];
            this.chartObj.gSymbolGroupEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(symbolOptions);

            var connectorOptions = { 'id': this.chartObj.svgObject.id + '_connectorGroup' + '_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gConnectorEle) this.chartObj.gConnectorEle = [];
            this.chartObj.gConnectorEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(connectorOptions);

            var dataLabelOptions = { 'id': this.chartObj.svgObject.id + '_DataLabel_' + seriesIndex, 'visibility': visibility };
            if (!this.chartObj.gDataLabelEle) this.chartObj.gDataLabelEle = [];
            this.chartObj.gDataLabelEle[seriesIndex] = this.chartObj.svgRenderer.createGroup(dataLabelOptions);
            if ((currentseries._doughnutSize > 0) && (currentSeries._doughnutCoefficient >= 0) && (currentseries._doughnutSize <= 1) && (currentSeries._doughnutCoefficient <= 1)) {

                for (var j = 0; j < visiblePointslength; j++) {
                    var point = currentseries._visiblePoints[j];
                    var pointIndex = j;
                    if (point.visible) {
                        var explodeX = 0;
                        var explodeY = 0;
                        var result = this._calculateArcData(this.chartObj, pointIndex, point, currentseries, seriesIndex);
                        //for canvas slice explode
                        if ((point.actualIndex == currentseries.explodeIndex || currentseries.explodeAll) && !this.chartObj.vmlRendering) {
                            var chartStartAngle = -.5 * Math.PI;
                            var startAngle = point.startAngle + chartStartAngle;
                            var endAngle = point.endAngle + chartStartAngle - 0.000001;
                            var midAngle = (startAngle + endAngle) / 2;
                            explodeX = this.chartObj.model.circleCenterX[seriesIndex] + Math.cos(midAngle) * currentseries.explodeOffset;
                            explodeY = this.chartObj.model.circleCenterY[seriesIndex] + Math.sin(midAngle) * currentseries.explodeOffset;
                        }

                        var styleOptions = this.chartObj.setStyle(this, currentseries, seriesIndex, pointIndex);

                        if (currentseries.startAngle < currentseries.endAngle) // for canvas rendering with modified start and end angle
                            var counterClockWise = false;
                        else
                            counterClockWise = true;
                        for (k = 0; k < currentseries.visiblePoints.length; k++) {
                            if (point == currentseries.visiblePoints[k]) {
                                pointIndex = k;
                                break;
                            }
                        }
                        options = {
                            'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                            'stroke-linecap': currentseries.lineCap,
                            'opacity': styleOptions.opacity,
                            'stroke-linejoin': currentseries.lineJoin,
                            'd': result.Direction,
                            'data-pointIndex': pointIndex,
                        };
                        canvasOptions = {
                            'id': this.chartObj.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                            'fill': styleOptions.interior,
                            'stroke-width': styleOptions.borderWidth,
                            'stroke': styleOptions.borderColor,
                            'stroke-dasharray': styleOptions.dashArray,
                            'stroke-linecap': currentseries.lineCap,
                            'opacity': styleOptions.opacity,
                            'stroke-linejoin': currentseries.lineJoin,
                            'd': result.Direction,
                            'start': point.startAngle - 1.57,
                            'end': point.endAngle - 1.57,
                            'data-pointIndex': pointIndex,
                            'radius': this.chartObj.model.circularRadius[seriesIndex],
                            'innerR': this.chartObj.model.innerRadius[seriesIndex],
                            'counterClockWise': counterClockWise,
                            'x': explodeX != 0 ? explodeX : this.chartObj.model.circleCenterX[seriesIndex],
                            'y': explodeY != 0 ? explodeY : this.chartObj.model.circleCenterY[seriesIndex]
                        };
                        if (isCanvas)
                            this.chartObj.svgRenderer.drawPath(canvasOptions, this.gSeriesGroupEle);
                        else
                            this.chartObj.svgRenderer.drawPath(options, this.gSeriesGroupEle);


                        region = { PointIndex: pointIndex, Index: j, StartAngle: point.startAngle, EndAngle: point.endAngle, StartX: this.chartObj.model.startX[pointIndex], StartY: this.chartObj.model.startY[pointIndex], SeriesIndex: $.inArray(currentseries, this.chartObj.model._visibleSeries) };
                        internalRegion.push(region);

                    }
                }
            }
            var seriesData = { Radius: this.chartObj.model.circularRadius[seriesIndex], DRadius: this.chartObj.model.innerRadius[seriesIndex], CenterX: this.chartObj.model.circleCenterX[seriesIndex], CenterY: this.chartObj.model.circleCenterY[seriesIndex] };
            var region = { Series: currentseries, SeriesData: seriesData, Region: internalRegion, SeriesIndex: $.inArray(currentseries, this.chartObj.model._visibleSeries) };
            this.chartObj.model.chartRegions.push(region);

            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);

        },

        chartAreaType: "None"
    });

    ej.seriesTypes.doughnut = ej.ejDoughnutSeries;

    ej.ejPyramidSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options) {

            this.chartObj = chart;
            var chartModel = chart.model,
                point,
                seriesRender = this,
                legendActualBounds = chartModel.LegendActualBounds,
                currentseries = options,
                visiblePoints = this._calculateVisiblePoints(currentseries).visiblePoints,
                visiblePointslength = visiblePoints.length,
                internalRegion = [],
                translate = [],
                legend = chartModel.legend,
                dataLabel = currentseries.marker.dataLabel,
                legendPosition = legend.position.toLowerCase(),
                legendWidth = legend.border.width,
                textSize = 0,
                text,
                title = chartModel.title,
                subTitle = chartModel.title.subTitle,
                borderSize = chartModel.border.width,
                titleVisibility = title.text != '' && title.visible && title.enableTrim ? true : false,
                subTitleVisibility = subTitle.text != '' && subTitle.visible && subTitle.enableTrim ? true : false,
                measureTitle = (chartModel.title.text && chartModel.title.visible) ? ej.EjSvgRender.utils._measureText(chartModel.title.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.font) : 0,
                measureSubTitle = (chartModel.title.subTitle.text && chartModel.title.subTitle.visible) ? ej.EjSvgRender.utils._measureText(chartModel.title.subTitle.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.subTitle.font) : 0,
                measureTitleHeight = (chart.model.title.text == '' || !chart.model.title.visible) ? 0 : ((titleVisibility && title.textOverflow == 'wrap') ? measureTitle.height * chart.model.titleWrapTextCollection.length : (titleVisibility && title.textOverflow == 'wrapandtrim') ?
                    measureTitle.height * chart.model.titleWrapTextCollection.length : measureTitle.height),
                measureSubTitleHeight = (chart.model.title.subTitle.text == '' || !chart.model.title.subTitle.visible) ? 0 : ((subTitleVisibility && subTitle.textOverflow == 'wrap') ? measureSubTitle.height * chart.model.subTitleWrapTextCollection.length : (subTitleVisibility && subTitle.textOverflow == 'wrapandtrim') ?
                    measureSubTitle.height * chart.model.subTitleWrapTextCollection.length : measureSubTitle.height),
                xOffset = (chartModel.margin.left + chartModel.elementSpacing + (borderSize * 2) + chartModel.elementSpacing + chartModel.margin.right + ((legendPosition === "right" || legendPosition === "left") ? legendActualBounds.Width + (2 * legendWidth) : 0)),
                yOffset = (((chartModel.title.text && chartModel.title.visible) ? (chartModel._titleLocation.Y + measureTitleHeight + measureSubTitleHeight) : chartModel.elementSpacing) + (borderSize * 2) + chartModel.margin.top + chartModel.elementSpacing + chartModel.elementSpacing + ((legendPosition === "top" || legendPosition === "bottom") ? legendActualBounds.Height + (2 * legendWidth) + chartModel.elementSpacing : 0));
            if (dataLabel.visible && dataLabel.shape != 'none' && currentseries.labelPosition == 'outside')
                xOffset = xOffset + (dataLabel.margin.left + dataLabel.margin.right);
            chartModel.chartRegions = [];
            chartModel.sumofYValues = 0;

            if (currentseries.labelPosition.toLowerCase() === 'outside') {
                for (var i = 0; i < visiblePointslength; i++) {
                    var textWidth = ej.EjSvgRender.utils._measureText((ej.util.isNullOrUndefined(visiblePoints[i].text) ? visiblePoints[i].y : visiblePoints[i].text), null, currentseries.marker.dataLabel.font).width;
                    if (textSize < textWidth)
                        textSize = textWidth;
                }
                chartModel.textSize = textSize;
            }
            if (currentseries._enableSmartLabels) {
                chartModel.actualWidth = ($(chart.svgObject).width() - xOffset) * 0.8; //calculate a pyramid width when smartlabel is enabled
                chartModel.resWidth = ($(chart.svgObject).width() - xOffset - chartModel.actualWidth) / 2;
            }
            else {
                chartModel.actualWidth = $(chart.svgObject).width() - xOffset - textSize;
                chartModel.resWidth = 0;
            }
            var seriesIndex = $.inArray(currentseries, chartModel._visibleSeries);
            chartModel.actualHeight = $(chart.svgObject).height() - yOffset;
            var subtitleHeight = (chart.model.title.subTitle.text == '') ? 0 : measureSubTitleHeight;
            var pyrX = chart.pyrX = ((legendPosition === "left") ? (legendActualBounds.Width + (2 * legendWidth)) : 0) + chartModel.elementSpacing + chartModel.margin.left;
            var pyrY = chart.pyrY = ((legendPosition === "top") ? (legendActualBounds.Height + (2 * legendWidth)) : 0) + ((title.text && title.visible) ? (chartModel._titleLocation.Y + measureTitleHeight + subtitleHeight) : (chartModel.margin.top + chartModel.elementSpacing));
            translate[0] = pyrX;
            translate[1] = pyrY;
            for (var j = 0; j < visiblePointslength; j++) {
                chartModel.sumofYValues += visiblePoints[j].YValues[0];
            }
            var dataLabelOptions = { 'id': chart.svgObject.id + '_DataLabel_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gDataLabelEle = [];
            chart.gDataLabelEle[seriesIndex] = chart.svgRenderer.createGroup(dataLabelOptions);


            var numberToFixed = ej.util.isNullOrUndefined(chartModel.roundingPlaces) ? 2 : chartModel.roundingPlaces;

            var serOptions = { 'id': chart.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            this.gSeriesGroupEle = chart.svgRenderer.createGroup(serOptions);


            var txtOptions = { 'id': chart.svgObject.id + '_textGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gSeriesTextEle = [];
            chart.gSeriesTextEle[seriesIndex] = chart.svgRenderer.createGroup(txtOptions);

            var symbolOptions = { 'id': chart.svgObject.id + '_symbolGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gSymbolGroupEle = [];
            chart.gSymbolGroupEle[seriesIndex] = chart.svgRenderer.createGroup(symbolOptions);

            var connectorOptions = { 'id': chart.svgObject.id + '_connectorGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gConnectorEle = [];
            chart.gConnectorEle[seriesIndex] = chart.svgRenderer.createGroup(connectorOptions);


            if (currentseries.pyramidMode.toLowerCase() == "linear")
                this.calculateLinearSegments(currentseries);
            else
                this.calculateSurfaceSegments(currentseries);

            for (j = 0; j < visiblePointslength; j++) {
                var pointIndex = j;
                point = currentseries._visiblePoints[j];
                if (point.visible) {
                    var result = this._getPyramidData(currentseries, pointIndex);

                    var styleOptions = chart.setStyle(this, currentseries, 0, pointIndex);

                    options = {
                        'id': chart.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                        'fill': styleOptions.interior,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke': styleOptions.borderColor,
                        'stroke-dasharray': styleOptions.dashArray,
                        'stroke-linecap': currentseries.lineCap,
                        'stroke-linejoin': currentseries.lineJoin,
                        'opacity': styleOptions.opacity,
                        'pointIndex': pointIndex,
                        'd': result.Direction
                    };
                    chart.svgRenderer.drawPath(options, this.gSeriesGroupEle, translate);

                    if (currentseries.marker.dataLabel.template) {
                        ej.EjSvgRender.utils._getSeriesTemplateSize(point, pointIndex, currentseries, true, chart);
                    }

                    point.xLocation = result.PositionX;
                    point.yLocation = result.PositionY;
                    point.connectorLine = result.Connector;
                    point.startX = result.startX;
                    point.startY = result.startY;
                    point.Polygon = result.Polygon;
                    region = { PointIndex: pointIndex, Line1: result.Line1, Line2: result.Line2, Line3: result.Line3, Line4: result.Line4, Polygon: result.Polygon };
                    internalRegion.push(region);
                }
            }
            var region = { Series: currentseries, Region: internalRegion, SeriesIndex: $.inArray(currentseries, chartModel._visibleSeries) };
            chartModel.chartRegions.push(region);

            if (this.gSeriesGroupEle) {
                $(this.gSeriesGroupEle.childNodes[pointIndex]).bind('mousemove', function (evt) {
                    evt.target = seriesRender.gSeriesGroupEle.childNodes[pointIndex];
                    seriesRender.chartObj.chartInteractiveBehavior(evt);
                });

                chart.svgRenderer.append(this.gSeriesGroupEle, chart.gSeriesEle);
            }



        },

        _getPyramidData: function (series, index) {

            var model = this.chartObj.model;
            var pointMarker = series._visiblePoints[index].marker;
            var actualIndex = series._visiblePoints[index].actualIndex;
            var offset = ((series.explodeIndex == actualIndex) || (series.explodeAll) ? series.explodeOffset : 0);
            var resWidth = model.resWidth;
            var top = model.pyramidData[index].CurrY;
            var bottom = model.pyramidData[index].CurrY + model.pyramidData[index].Height;
            var topRadius = 0.5 * (1 - model.pyramidData[index].CurrY);
            var bottomRadius = 0.5 * (1 - bottom);
            var point = series.points[index];

            var line1 = { x: resWidth + offset + topRadius * model.actualWidth, y: top * model.actualHeight };
            var line2 = { x: resWidth + offset + (1 - topRadius) * model.actualWidth, y: top * model.actualHeight };
            var line3 = { x: resWidth + offset + (1 - bottomRadius) * model.actualWidth, y: bottom * model.actualHeight };
            var line4 = { x: resWidth + offset + bottomRadius * model.actualWidth, y: bottom * model.actualHeight };

            var direction = "M" + " " + (line1.x) + " " + (line1.y) + " " + "L" + " " + (line2.x) + " " + (line2.y) + " " + "L" + " " + (line3.x) + " " + (line3.y) + " " + "L" + " " + (line4.x) + " " + (line4.y) + " " + "z";
            var polygon = [
                { x: line1.x, y: line1.y },
                { x: line2.x, y: line2.y },
                { x: line3.x, y: line3.y },
                { x: line4.x, y: line4.y }
            ];
            if ((pointMarker && pointMarker.dataLabel && pointMarker.dataLabel.visible) || (!pointMarker || !pointMarker.dataLabel) && series.marker.dataLabel.visible) {
                var positionX;
                var positionY;
                var startX = (line2.x + line3.x) / 2;
                var startY = (line2.y + line3.y) / 2;
                if (series.labelPosition.toLowerCase() === 'outside') {

                    positionX = (line2.x + line3.x) / 2;
                    positionY = (line2.y + line3.y) / 2;

                    var pyrX = ((this.chartObj.model.legend.position.toLowerCase() == "left" || this.chartObj.model.legend.position.toLowerCase() == "right") ? (this.chartObj.model.LegendActualBounds.Width) : 0) + this.chartObj.model.elementSpacing + this.chartObj.model.margin.left;

                    if (ej.util.isNullOrUndefined(series.marker.dataLabel.connectorLine.height)) {
                        if (series._enableSmartLabels)
                            var textOffset = $(this.chartObj.svgObject).width() - (pyrX + positionX + resWidth + (2 * this.chartObj.model.elementSpacing));
                        else
                            var textOffset = $(this.chartObj.svgObject).width() - (pyrX + positionX + this.chartObj.model.textSize + this.chartObj.model.elementSpacing);
                    }
                    else
                        textOffset = series.marker.dataLabel.connectorLine.height;

                    var connectorX = this.getXCordinate(positionX, textOffset, 0);
                    var connectorY = this.getYCordinate(positionY, textOffset, 0);

                    var connectorDirection = "M" + " " + positionX + " " + positionY + " " + "L" + " " + connectorX + " " + connectorY;

                    positionX = connectorX;
                    positionY = connectorY;


                }
                else {
                    positionX = (line1.x + line2.x) / 2;
                    positionY = (line3.y + line1.y) / 2;
                }
            }
            return { Direction: direction, PositionX: positionX, PositionY: positionY, Connector: connectorDirection, Line1: line1, Line2: line2, Line3: line3, Line4: line4, startX: startX, startY: startY, Polygon: polygon };
        },

        calculateLinearSegments: function (series) {
            var currY = 0;
            var model = this.chartObj.model;
            model.pyramidData = [];
            var gapRatio = series.gapRatio >= 0 ? (series.gapRatio <= 1 ? series.gapRatio : 1) : 0;
            var coef = 1 / (model.sumofYValues * (1 + gapRatio / (1 - gapRatio)));
            var count = series._visiblePoints.length;
            for (var i = 0; i < count; i++) {
                if (series._visiblePoints[i].visible || series._visiblePoints[i].gapMode) {
                    var height = coef * series._visiblePoints[i].YValues[0];
                    model.pyramidData[i] = { CurrY: currY, Height: height };
                    currY += (gapRatio / (count - 1)) + height;
                }
            }
        },

        calculateSurfaceSegments: function (series) {
            var count = series._visiblePoints.length;
            var model = this.chartObj.model;
            model.pyramidData = [];
            var currY = 0;
            var y = [];
            var height = [];
            var gapRatio = series.gapRatio >= 0 ? (series.gapRatio <= 1 ? series.gapRatio : 1) : 0;
            var gapHeight = gapRatio / (count - 1);
            var preSum = this.getSurfaceHeight(0, model.sumofYValues);
            for (i = 0; i < count; i++) {
                if (series._visiblePoints[i].visible || series._visiblePoints[i].gapMode) {
                    y[i] = currY;
                    height[i] = this.getSurfaceHeight(currY, Math.abs(series._visiblePoints[i].YValues[0]));
                    currY += height[i] + gapHeight * preSum;
                }
            }
            var coef = 1 / (currY - gapHeight * preSum);
            for (var i = 0; i < count; i++) {
                if (series._visiblePoints[i].visible || series._visiblePoints[i].gapMode) {
                    var currHeight = coef * y[i];
                    model.pyramidData[i] = { CurrY: currHeight, Height: coef * height[i] };
                }
            }
        },

        getSurfaceHeight: function (y, surface) {
            var result = this.solveQuadraticEquation(1, 2 * y, -surface);
            if (result) {
                return result;
            }
            return 0;
        },
        solveQuadraticEquation: function (a, b, c) {
            var root1;
            var root2;

            if (a != 0) {
                var d = b * b - 4 * a * c;

                if (d >= 0) {
                    var sd = Math.sqrt(d);

                    root1 = (-b - sd) / (2 * a);
                    root2 = (-b + sd) / (2 * a);
                    return Math.max(root1, root2);

                }
            }
            else if (b != 0) {
                root1 = -c / b;
                root2 = -c / b;
                return Math.max(root1, root2);
            }

            return false;
        },

        chartAreaType: "None"
    });

    ej.seriesTypes.pyramid = ej.ejPyramidSeries;

    ej.ejFunnelSeries = ejExtendClass(ej.EjSeriesRender, {
        draw: function (chart, options) {
            this.chartObj = chart;
            var chartModel = chart.model,
                legend = chartModel.legend,
                legendPosition = legend.position.toLowerCase(),
                legendActualBounds = chartModel.LegendActualBounds,
                point,
                seriesRender = this,
                currentseries = options,
                visiblePoints = this._calculateVisiblePoints(currentseries).visiblePoints,
                visiblePointslength = visiblePoints.length,
                internalRegion = [],
                dataLabel = currentseries.marker,
                legendWidth = legend.border.width,
                translate = [],
                textSize = 0,
                text,
                title = (chart.model.title.text == '') ? '' : chartModel.title,
                subTitle = (chart.model.title.subTitle.text == '') ? '' : chartModel.title.subTitle,
                borderSize = chartModel.border.width,
                titleVisibility = title.text != '' && title.visible && title.enableTrim ? true : false,
                subTitleVisibility = subTitle.text != '' && subTitle.visible && subTitle.enableTrim ? true : false,
                measureTitle = (chartModel.title.text && chartModel.title.visible) ? ej.EjSvgRender.utils._measureText(chartModel.title.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.font) : 0,
                measureSubTitle = (chartModel.title.subTitle.text && chartModel.title.subTitle.visible) ? ej.EjSvgRender.utils._measureText(chartModel.title.subTitle.text, $(this.svgObject).width() - chartModel.margin.left - chartModel.margin.right, chartModel.title.subTitle.font) : 0,
                measureTitleHeight = (chart.model.title.text == '' || !chart.model.title.visible) ? 0 : ((titleVisibility && title.textOverflow == 'wrap') ? measureTitle.height * chart.model.titleWrapTextCollection.length : (titleVisibility && title.textOverflow == 'wrapandtrim') ?
                    measureTitle.height * chart.model.titleWrapTextCollection.length : measureTitle.height),
                measureSubTitleHeight = (chart.model.title.subTitle.text == '' || !chart.model.title.subTitle.visible) ? 0 : ((subTitleVisibility && subTitle.textOverflow == 'wrap') ? measureSubTitle.height * chart.model.subTitleWrapTextCollection.length : (subTitleVisibility && subTitle.textOverflow == 'wrapandtrim') ?
                    measureSubTitle.height * chart.model.subTitleWrapTextCollection.length : measureSubTitle.height),
                xOffset = (chartModel.margin.left + chartModel.elementSpacing + chartModel.elementSpacing + chartModel.margin.right + (borderSize * 2) + ((legendPosition === "right" || legendPosition === "left") ? legendActualBounds.Width + (2 * legendWidth) : 0)),
                yOffset = (((chartModel.title.text && chartModel.title.visible) ? (chartModel._titleLocation.Y + measureTitleHeight + measureSubTitleHeight) : chartModel.elementSpacing) + chartModel.margin.top + (borderSize * 2) + chartModel.elementSpacing + chartModel.elementSpacing + ((legendPosition === "top" || legendPosition === "bottom") ? legendActualBounds.Height + (2 * legendWidth) + chartModel.elementSpacing : 0));
            if (dataLabel.visible && dataLabel.shape != 'none' && currentseries.labelPosition == 'outside')
                xOffset = xOffset + (dataLabel.margin.left + dataLabel.margin.right);
            chartModel.chartRegions = [];
            chartModel.sumofYValues = 0;
            if (currentseries.labelPosition.toLowerCase() === 'outside') {
                for (var i = 0; i < visiblePointslength; i++) {
                    var textWidth = ej.EjSvgRender.utils._measureText((ej.util.isNullOrUndefined(visiblePoints[i].text) ? visiblePoints[i].y : visiblePoints[i].text), null, currentseries.marker.dataLabel.font).width;
                    if (textSize < textWidth)
                        textSize = textWidth;
                }
                chartModel.textSize = textSize;
            }
            if (currentseries._enableSmartLabels) {
                chartModel.actualWidth = ($(chart.svgObject).width() - xOffset) * 0.8;  //calculate a width of a funnel chart when smartlabel is enabled
                chartModel.resWidth = ($(chart.svgObject).width() - xOffset - chartModel.actualWidth) / 2;
            }
            else {
                chartModel.actualWidth = $(chart.svgObject).width() - xOffset - textSize;
                chartModel.resWidth = 0;
            }
            var subtitleHeight = (chart.model.title.subTitle.text == '') ? 0 : measureSubTitleHeight;
            chartModel.actualHeight = $(chart.svgObject).height() - yOffset;
            var pyrX = chart.pyrX = ((legendPosition === "left") ? (legendActualBounds.Width + (2 * legendWidth)) : 0) + chartModel.elementSpacing + chartModel.margin.left;
            var pyrY = chart.pyrY = ((legendPosition === "top") ? (legendActualBounds.Height + (2 * legendWidth)) : 0) + ((chartModel.title.text && chartModel.title.visible) ? (chartModel._titleLocation.Y + measureTitleHeight + subtitleHeight) : (chartModel.margin.top + chartModel.elementSpacing));
            translate[0] = pyrX;
            translate[1] = pyrY;
            for (var j = 0; j < visiblePointslength; j++) {
                chartModel.sumofYValues += visiblePoints[j].YValues[0];
            }


            var numberToFixed = ej.util.isNullOrUndefined(chartModel.roundingPlaces) ? 2 : chartModel.roundingPlaces;

            var seriesIndex = $.inArray(currentseries, chartModel._visibleSeries);
            var serOptions = { 'id': chart.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            this.gSeriesGroupEle = chart.svgRenderer.createGroup(serOptions);
            var dataLabelOptions = { 'id': chart.svgObject.id + '_DataLabel_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gDataLabelEle = [];
            chart.gDataLabelEle[seriesIndex] = chart.svgRenderer.createGroup(dataLabelOptions);


            var txtOptions = { 'id': chart.svgObject.id + '_textGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gSeriesTextEle = [];
            chart.gSeriesTextEle[seriesIndex] = chart.svgRenderer.createGroup(txtOptions);

            var symbolOptions = { 'id': chart.svgObject.id + '_symbolGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gSymbolGroupEle = [];
            chart.gSymbolGroupEle[seriesIndex] = chart.svgRenderer.createGroup(symbolOptions);

            var connectorOptions = { 'id': chart.svgObject.id + '_connectorGroup' + '_' + seriesIndex, 'transform': 'translate(' + pyrX + ',' + pyrY + ')' };
            chart.gConnectorEle = [];
            chart.gConnectorEle[seriesIndex] = chart.svgRenderer.createGroup(connectorOptions);

            var currY = 0;
            var model = chartModel;
            model.funnelData = [];
            var gapRatio = currentseries.gapRatio >= 0 ? (currentseries.gapRatio <= 1 ? currentseries.gapRatio : 1) : 0;
            var coef = 1 / (model.sumofYValues * (1 + gapRatio / (1 - gapRatio)));
            var spacing = gapRatio / visiblePointslength;
            for (var i = visiblePointslength - 1; i >= 0; i--) {
                if (currentseries._visiblePoints[i].visible || currentseries._visiblePoints[i].gapMode) {
                    var height = coef * currentseries._visiblePoints[i].YValues[0];
                    model.funnelData[i] = { CurrY: currY, Height: height };
                    currY += height + spacing;
                }
            }
            for (j = 0; j < visiblePointslength; j++) {
                var pointIndex = j;
                point = currentseries._visiblePoints[j];
                if (point.visible) {
                    var result = this._getFunnelData(currentseries, pointIndex, chart);

                    var styleOptions = chart.setStyle(this, currentseries, 0, pointIndex);

                    options = {
                        'id': chart.svgObject.id + '_Series' + seriesIndex + "_Point" + pointIndex,
                        'fill': styleOptions.interior,
                        'stroke-width': styleOptions.borderWidth,
                        'stroke': styleOptions.borderColor,
                        'stroke-dasharray': styleOptions.dashArray,
                        'stroke-linecap': currentseries.lineCap,
                        'stroke-linejoin': currentseries.lineJoin,
                        'opacity': styleOptions.opacity,
                        'pointIndex': pointIndex,
                        'd': result.Direction
                    };
                    chart.svgRenderer.drawPath(options, this.gSeriesGroupEle, translate);

                    if (currentseries.marker.dataLabel.template) {
                        ej.EjSvgRender.utils._getSeriesTemplateSize(point, pointIndex, currentseries, true, chart);
                    }

                    point.xLocation = result.PositionX;
                    point.yLocation = result.PositionY;
                    point.connectorLine = result.Connector;
                    point.startX = result.startX;
                    point.startY = result.startY;
                    point.Polygon = result.Polygon;
                    region = { PointIndex: pointIndex, Line1: result.Line1, Line2: result.Line2, Line3: result.Line3, Line4: result.Line4, Line5: result.Line5, Line6: result.Line6, Polygon: result.Polygon };
                    internalRegion.push(region);
                }
            }
            var region = { Series: currentseries, Region: internalRegion, SeriesIndex: $.inArray(currentseries, chartModel._visibleSeries) };
            chartModel.chartRegions.push(region);

            if (this.gSeriesGroupEle)
                $(this.gSeriesGroupEle.childNodes[pointIndex]).bind('mousemove', function (evt) {
                    evt.target = seriesRender.gSeriesGroupEle.childNodes[pointIndex];
                    seriesRender.chartObj.chartInteractiveBehavior(evt);
                });

            chart.svgRenderer.append(this.gSeriesGroupEle, chart.gSeriesEle);


        },

        _getFunnelData: function (series, index, chart) {

            var model = this.chartObj.model,
                point = series._visiblePoints[index],
                pointMarker = point.marker,
                seriesMarer = series.marker,
                funnelWidth = series.funnelWidth,
                funnelHeight = series.funnelHeight,
                actualHeight = model.actualHeight,
                actualWidth = model.actualWidth,
                elementSpacing = model.elementSpacing,
                pyrX, legendPosition = model.legend.position.toLowerCase(),
                actualIndex = point.actualIndex,
                direction,
                resWidth = model.resWidth, polygon,
                textOffset, connectorDirection,
                offset = ((series.explodeIndex == actualIndex) || (series.explodeAll) ? series.explodeOffset : 0),
                topRadius, minRadius, bottomRadius, endTop,
                endMin, endBottom, top, bottomY,
                bottom, connectorX, connectorY,
                positionX, positionY, startX, startY,
                line1, line2, line3, line4, line5, line6,
                lineWidth, minimumHeight, minimumWidth;
            if (funnelHeight.indexOf("%") != -1)
                minimumHeight = actualHeight * (parseInt(funnelHeight) / 100);
            else
                minimumHeight = parseInt(funnelHeight);
            if (funnelWidth.indexOf("%") != -1)
                minimumWidth = actualWidth * (parseInt(funnelWidth) / 100);
            else
                minimumWidth = parseInt(funnelWidth);

            top = model.funnelData[index].CurrY * actualHeight;
            bottom = top + model.funnelData[index].Height * actualHeight;
            lineWidth = minimumWidth + (actualWidth - minimumWidth) * ((actualHeight - minimumHeight - top) / (actualHeight - minimumHeight));
            topRadius = (actualWidth / 2) - lineWidth / 2;
            endTop = topRadius + lineWidth;
            if (bottom > actualHeight - minimumHeight || actualHeight == minimumHeight)
                lineWidth = minimumWidth;
            else
                lineWidth = minimumWidth + (actualWidth - minimumWidth) * ((actualHeight - minimumHeight - bottom) / (actualHeight - minimumHeight));
            bottomRadius = (actualWidth / 2) - (lineWidth / 2);
            endBottom = bottomRadius + lineWidth;
            if (top >= actualHeight - minimumHeight) {
                topRadius = bottomRadius = minRadius = (actualWidth / 2) - minimumWidth / 2;
                endTop = endBottom = endMin = (actualWidth / 2) + minimumWidth / 2;

            } else if (bottom > (actualHeight - minimumHeight)) {
                minRadius = bottomRadius = (actualWidth / 2) - lineWidth / 2;
                endMin = endBottom = minRadius + lineWidth;
                bottomY = actualHeight - minimumHeight;
            }

            line1 = { x: resWidth + offset + topRadius, y: top };
            line2 = { x: resWidth + offset + endTop, y: top };
            line4 = { x: resWidth + offset + endBottom, y: bottom };
            line5 = { x: resWidth + offset + bottomRadius, y: bottom };
            line3 = { x: resWidth + offset + endBottom, y: bottom };
            line6 = { x: resWidth + offset + bottomRadius, y: bottom };
            if (bottomY) {
                line3 = { x: resWidth + offset + endMin, y: bottomY };
                line6 = { x: resWidth + offset + minRadius, y: bottomY };
            }
            direction = "M" + " " + (line1.x) + " " + (line1.y) + " " + "L" + " " + (line2.x) + " " + (line2.y) + " " + "L" + " " + (line3.x) + " " + (line3.y) + " " + "L" + " " + (line4.x) + " " + (line4.y) + " " + "L" + " " + (line5.x) + " " + (line5.y) + " " + "L" + " " + (line6.x) + " " + (line6.y) + " " + "z";
            polygon = [
                { x: line1.x, y: line1.y },
                { x: line2.x, y: line2.y },
                { x: line3.x, y: line3.y },
                { x: line4.x, y: line4.y },
                { x: line5.x, y: line5.y },
                { x: line6.x, y: line6.y }
            ];
            if ((pointMarker && pointMarker.dataLabel && pointMarker.dataLabel.visible) || (!pointMarker || !pointMarker.dataLabel) && seriesMarer.dataLabel.visible) {
                positionX;
                positionY;
                startX = (line2.x + line3.x) / 2;
                startY = (line2.y + line3.y) / 2;
                if (series.labelPosition.toLowerCase() === 'outside') {

                    positionX = (line2.x + line3.x) / 2;
                    positionY = (line2.y + line3.y) / 2;

                    pyrX = ((legendPosition == "left" || legendPosition == "right") ? (model.LegendActualBounds.Width) : 0) + elementSpacing + model.margin.left;

                    if (ej.util.isNullOrUndefined(seriesMarer.dataLabel.connectorLine.height)) {
                        if (series._enableSmartLabels)
                            textOffset = $(this.chartObj.svgObject).width() - (pyrX + positionX + resWidth + (2 * elementSpacing));
                        else
                            textOffset = $(this.chartObj.svgObject).width() - (positionX + model.textSize + elementSpacing);
                    }
                    else
                        textOffset = seriesMarer.dataLabel.connectorLine.height;

                    connectorX = this.getXCordinate(positionX, textOffset, 0);
                    connectorY = this.getYCordinate(positionY, textOffset, 0);

                    connectorDirection = "M" + " " + positionX + " " + positionY + " " + "L" + " " + connectorX + " " + connectorY;

                    positionX = connectorX;
                    positionY = connectorY;


                }
                else {
                    positionX = (line1.x + line2.x) / 2;
                    positionY = (line1.y + line4.y) / 2;
                }
            }
            return { Direction: direction, PositionX: positionX, PositionY: positionY, Connector: connectorDirection, Line1: line1, Line2: line2, Line3: line3, Line4: line4, Line5: line5, Line6: line6, startX: startX, startY: startY, Polygon: polygon };
        },


        chartAreaType: "None"
    });

    ej.seriesTypes.funnel = ej.ejFunnelSeries;
    /*Funnel series*/

    ej.ejPolarSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options) {

            this.chartObj = chart;
            var point;
            var seriesRender = this;
            var currentseries = options;
            var visiblePoints = this._isVisiblePoints(currentseries);
            var internalRegion = [];


            var style = this.setLineSeriesStyle(currentseries);

            if (currentseries.drawType.toLowerCase() == "column" || currentseries.drawType.toLowerCase() == "rangecolumn") {
                var range = currentseries.xAxis.visibleRange;
                range.interval = 1;
                var length = (currentseries.xAxis._valueType == "category") ? range.max : range.max - 1;
                this.chartObj.model.sumofYValues = 0;
                var count = range.interval;
                var min = range.min;
                do {
                    this.chartObj.model.sumofYValues += range.interval;
                    min += range.interval;
                } while (min <= length)
                //  this.chartObj.model.sumofYValues = visiblePoints.length;
            }

            var direction = this._calculatePolarAxesSegment(currentseries);

            if (currentseries.drawType.toLowerCase() == "area")
                this.drawAreaPath(currentseries, style, direction);
            else if (currentseries.drawType.toLowerCase() == "line")
                this._drawLinePath(currentseries, style, direction);
            else if (currentseries.drawType.toLowerCase() == "spline")
                this._drawLinePath(currentseries, style, direction);



            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);


        },

        chartAreaType: "PolarAxes"

    });

    ej.seriesTypes.polar = ej.ejPolarSeries;
    ej.ejRadarSeries = ejExtendClass(ej.EjSeriesRender, {

        draw: function (chart, options) {

            this.chartObj = chart;
            var point;
            var seriesRender = this;
            var currentseries = options;
            var visiblePoints = this._isVisiblePoints(currentseries);
            var internalRegion = [];

            var style = this.setLineSeriesStyle(currentseries);

            if (currentseries.drawType.toLowerCase() == "column" || currentseries.drawType.toLowerCase() == "rangecolumn") {
                var range = currentseries.xAxis.visibleRange;
                range.interval = 1;
                var length = (currentseries.xAxis._valueType == "category") ? range.max : range.max - 1;
                this.chartObj.model.sumofYValues = 0;
                var count = range.interval;
                var min = range.min;
                do {
                    this.chartObj.model.sumofYValues += range.interval;
                    min += range.interval;
                } while (min <= length)
                //  this.chartObj.model.sumofYValues = visiblePoints.length;
            }

            var direction = this._calculatePolarAxesSegment(currentseries);

            if (currentseries.drawType.toLowerCase() == "area")
                this.drawAreaPath(currentseries, style, direction);
            else if (currentseries.drawType.toLowerCase() == "line")
                this._drawLinePath(currentseries, style, direction);
            else if (currentseries.drawType.toLowerCase() == "spline")
                this._drawLinePath(currentseries, style, direction);



            this.chartObj.svgRenderer.append(this.gSeriesGroupEle, this.chartObj.gSeriesEle);



        },
        doAnimation: function (series, chart) {     // for polar/radar animation
            var chartObj = chart.chartObj;
            var drawType = series.drawType.toLowerCase();
            series.regionAdded = true;
            chartObj.model._radius = chartObj.model.Radius || chartObj.model._radius;
            chartObj.model.Radius = 0;
            var seriesRender = chart;
            var seriesIndex = $.inArray(series, chartObj.model._visibleSeries);
            var Path = $(chartObj.gSeriesEle).find("#" + seriesRender.gSeriesGroupEle.id)[0].childNodes[0];
            $(Path).animate(
                { Radius: chartObj.model._radius },

                {
                    duration: 1200, queue: false, step: function (now, fx) {
                        if (!ej.util.isNullOrUndefined(chartObj.model)) {
                            chartObj.model.Radius = now;

                            var direction = seriesRender._calculatePolarAxesSegment(series);
                            if ((series.drawType.toLowerCase() != 'column') && (series.drawType.toLowerCase() != 'rangecolumn') && (drawType != 'scatter'))
                                chartObj.svgRenderer._setAttr($(Path), { "d": direction });
                            chartObj.model.Radius = chartObj.model._radius;
                        }
                        else
                            $(Path).stop(true, true);
                    },
                    complete: function () {
                        if (!ej.util.isNullOrUndefined(chartObj.model)) {
                            series.regionAdded = false;
                            chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.svgObject.id + '_TextGroup' + '_' + seriesIndex), { "visibility": "visible" });

                            chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.svgObject.id + '_symbolGroup' + '_' + seriesIndex), { "visibility": "visible" });
                            chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.svgObject.id + '_DataLabel' + '_' + seriesIndex), { "visibility": "visible" });
                            chartObj.model.AnimationComplete = true;
                            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                            commonEventArgs.data = { series: series };
                            chartObj._trigger("animationComplete", commonEventArgs);
                        }
                    }

                });
        },
        chartAreaType: "PolarAxes"

    });

    ej.seriesTypes.radar = ej.ejRadarSeries;
})(jQuery);