ej.axisTypes = {};

ej.EjAxisRenderer = function () {
};
var _sideBySeriesPadding = function (chartObj, start, end, axis) {
    var visibleSeries = ej.DataManager(chartObj.model._visibleSeries, ej.Query().sortBy("_zOrder")).executeLocal();
    var isPadding = false;
    var data, startPadding, endPadding;
    var visibleSeriesLength = visibleSeries.length;
    var axisOrientation = axis.orientation.toLowerCase();
    for (var i = 0; i < visibleSeriesLength; i++) {
        var type = visibleSeries[i].type.toLowerCase();
        if (((type.indexOf("column") != -1 || type.indexOf("bar") != -1 || type.indexOf("waterfall") != -1 || type == "candle" || type.indexOf("hilo") != -1 || type.indexOf("box") != -1))) {
            isPadding = true;
            break;
        }

    }
    if (chartObj.model.AreaType != "polaraxes" && isPadding) {
        axis.m_minPointsDelta = undefined;
        var padding = ej.EjSvgRender.utils.getMinPointsDelta(axis, chartObj, start) * 0.5;
        start = start - padding;
        end = (end + padding > Number.MAX_VALUE) ? Number.MAX_VALUE : end + padding;
        axis.padding = padding;
    }
    else
        axis.padding = 0;
    return data = { startPadding: start, endPadding: end };
};
ej.EjStripline = function (chartobj) {
    this.chart = chartobj;
};
(function ($) {
    ej.EjAxisRenderer.prototype = {

        //Calculate min/max value for series
        _seriesMinMax: function (chartObj, axis, seriesCollection, type, params) {
            var orientation = axis.orientation.toLowerCase(), seriesLength = seriesCollection.length;
            params.seriesCollection = ej.util.isNullOrUndefined(params.seriesCollection) ? {} : params.seriesCollection;
            var count;
            if ((seriesLength > 0 && chartObj.model._hasSeriesPoints && seriesCollection[0].points.length > 0) || this.chartObj.model.indicators[0]._points.length > 0) {

                var maxX, minY, minX, maxY, min, max, delta;
                var maxMinXValue = { maxX: null, minX: null };
                var maxMinYValue = { maxY: null, minY: null };
                var xMax = maxMinXValue.maxX;
                var xMin = maxMinXValue.minX;
                var yMax = maxMinYValue.maxY;
                var yMin = maxMinYValue.minY;
                var seriesVisibility, pointsLength, visibleLength, seriesType;

                for (var i = 0; i < seriesLength; i++) {
                    seriesVisibility = seriesCollection[i].visibility.toLowerCase();
                    pointsLength = seriesCollection[i].points.length;
                    count = 0;
                    if (seriesVisibility === 'visible') {
                        seriesCollection[i]._visiblePoints = [];
                        for (var j = 0; j < pointsLength; j++) {
                            var point = seriesCollection[i].points[j];
                            if ((point.x != null && point.x != undefined) && ((typeof point.y == "object" || !isNaN(point.y)) && point.y != null && point.y != undefined)
                                || point.showIntermediateSum || point.showTotalSum || point.isEmpty == false) {
                                seriesCollection[i]._visiblePoints[count] = point;
                                seriesCollection[i]._visiblePoints[count].actualIndex = j;
                                count++;
                            }
                        }
                    }
                    axis.maxPointLength = pointsLength;
                }

                for (var i = 0; i < seriesLength; i++) {
                    visibleLength = seriesCollection[i]._visiblePoints.length;
                    var series = seriesCollection[i];
                    if (visibleLength > 0) {
                        seriesVisibility = seriesCollection[i].visibility.toLowerCase();
                        pointsLength = seriesCollection[i].points.length;
                        if (seriesVisibility === 'visible' && pointsLength > 0) {
                            if ((orientation == "horizontal" && !(chartObj.model.requireInvertedAxes)) || (orientation == "vertical" && chartObj.model.requireInvertedAxes)) {
                                minX = maxX = seriesCollection[i]._visiblePoints[0].xValue;
                                for (var j = 0; j < visibleLength; j++) {
                                    var currentPoint = seriesCollection[i]._visiblePoints[j].xValue;
                                    if (minX > currentPoint)
                                        minX = currentPoint;
                                    if (maxX < currentPoint)
                                        maxX = currentPoint;
                                }
                                seriesCollection[i].minX = minX;
                                seriesCollection[i].maxX = maxX;

                                if ((xMin === null || xMin === undefined) && visibleLength > 0) {
                                    xMax = seriesCollection[i].maxX;
                                    xMin = seriesCollection[i].minX;
                                }
                                if (xMin > seriesCollection[i].minX) {
                                    xMin = seriesCollection[i].minX;
                                }
                                if (xMax < seriesCollection[i].maxX) {
                                    xMax = seriesCollection[i].maxX;
                                }
                            }
                            else {
                                var isSpline = (series.type.toLowerCase().indexOf('spline') != -1), controlPoint, naturalSpline, getBezierControlPoints, splineVisiblePoints,
                                    controlPointsCount = 0, visiblePoints = seriesCollection[i]._visiblePoints;
                                if (isSpline) {
                                    var seriesKey = series._name = series.name || 'series' + i;
                                    params.seriesCollection[seriesKey] = {};
                                    visiblePoints = ej.ejSplineSeries.prototype._isVisiblePoints(series),
                                        naturalSpline = params.seriesCollection[seriesKey].naturalSpline = ej.ejSplineSeries.prototype.naturalSpline(visiblePoints, series);
                                    params.seriesCollection[seriesKey].controlPoints = [];
                                    getBezierControlPoints = ej.ejSplineSeries.prototype.getBezierControlPoints;
                                    splineVisiblePoints = visiblePoints.filter(function (currentPt,  index,  array) {
                                        return  !ej.isNullOrUndefined(currentPt.YValues[0])  &&  !isNaN(currentPt.YValues[0]);
                                    });
                                }
                                maxY = minY = !isSpline ? visiblePoints[0].YValues[0] : splineVisiblePoints[0].YValues[0];
                                var minval, maxval;
                                for (var j = 0; j < visiblePoints.length; j++) {
                                    var currentPoint = visiblePoints[j];
                                    if (seriesCollection[i]._hiloTypes) {
                                        for (var y = 0; y < 2; y++) {
                                            if (minY > currentPoint.YValues[y])
                                                minY = currentPoint.YValues[y];
                                            if (maxY < currentPoint.YValues[y])
                                                maxY = currentPoint.YValues[y];
                                        }
                                    }
                                    else if (series.type.toLowerCase() == "boxandwhisker") {
                                        minval = visiblePoints[j].YValues[0][0];
                                        maxval = visiblePoints[j].YValues[0][0];
                                        for (var yindex = 0; yindex < currentPoint.YValues[0].length; yindex++) {
                                            if (minval > currentPoint.YValues[0][yindex])
                                                minval = currentPoint.YValues[0][yindex];
                                            if (maxval < currentPoint.YValues[0][yindex])
                                                maxval = currentPoint.YValues[0][yindex];
                                        }
                                        minY = minval > minY ? minY : minval;
                                        maxY = maxval < maxY ? maxY : maxval;
                                    }
                                    else if (isSpline) {
                                        if (j != 0 && currentPoint.visible && visiblePoints[j - 1].visible) {
                                            params.seriesCollection[seriesKey].controlPoints.push(getBezierControlPoints(visiblePoints[j - 1], currentPoint, naturalSpline[j - 1], naturalSpline[j], 0, series, this));
                                            controlPoint = params.seriesCollection[seriesKey].controlPoints[controlPointsCount++];
                                            minY = Math.min(minY, currentPoint.YValues[0], controlPoint.controlPoint1.YValues[0], controlPoint.controlPoint2.YValues[0]);
                                            maxY = Math.max(maxY, currentPoint.YValues[0], controlPoint.controlPoint1.YValues[0], controlPoint.controlPoint2.YValues[0]);
                                        }
                                        else {
                                            if (j != 0 && series.type.toLowerCase().indexOf("stacking") != -1) {
                                                params.seriesCollection[seriesKey].controlPoints.push(getBezierControlPoints(visiblePoints[j - 1], currentPoint, naturalSpline[j - 1], naturalSpline[j], 0, series, this));
                                                controlPoint = params.seriesCollection[seriesKey].controlPoints[controlPointsCount++];
                                            }
                                            minY = Math.min(minY, isNaN(currentPoint.YValues[0]) ? minY : (currentPoint.YValues[0] || null));
                                            maxY = Math.max(maxY, currentPoint.YValues[0] || null);
                                        }
                                    }
                                    else {
                                        if (minY > currentPoint.YValues[0])
                                            minY = currentPoint.YValues[0];
                                        if (maxY < currentPoint.YValues[0])
                                            maxY = currentPoint.YValues[0];
                                    }
                                }
                                seriesCollection[i].minY = minY;
                                seriesCollection[i].maxY = maxY;

                                if ((yMin === null || yMin === undefined) && visibleLength > 0) {
                                    yMax = seriesCollection[i].maxY;
                                    yMin = seriesCollection[i].minY;
                                }
                                if (yMin > seriesCollection[i].minY) {
                                    yMin = seriesCollection[i].minY;
                                }
                                if (yMax < seriesCollection[i].maxY) {
                                    yMax = seriesCollection[i].maxY;
                                }

                                // Finding Min and Max for Column and Bar series
                                seriesType = seriesCollection[i].type
                                if ((seriesType == 'column' || seriesType == 'bar') && axis.startFromZero)
                                    yMin = (yMin < 0) ? yMin : 0;
                            }
                        }
                    }
                }
                if ((orientation == "horizontal" && !(chartObj.model.requireInvertedAxes)) || (orientation == "vertical" && chartObj.model.requireInvertedAxes)) {

                    // Find min/max for indicator series
                    if (this.chartObj.model.indicatorRange && this.chartObj.model.indicatorRange[axis.name]) {
                        var value = this.chartObj.model.indicatorRange[axis.name];
                        if (yMin > value.min || yMin == null)
                            yMin = value.min;
                        if (yMax < value.max || yMax == null)
                            yMax = value.max;
                    }

                    if (xMax == xMin)
                        xMax += 1;

                    if (type == "double") {
                        var data = _sideBySeriesPadding(chartObj, xMin, xMax, axis);
                        xMin = data.startPadding;
                        xMax = data.endPadding;
                        var deltaX = xMax - xMin;
                        axis.range = this._getDoubleAutoRange(axis, xMin, xMax, deltaX);
                    }
                    else
                        axis.range = this._getLogAutoRange(axis, xMin, xMax, xMax - xMin);

                }
                else {

                    // Find min/max for stacked series
                    if (this.chartObj.model.stackedValue[axis.name]) {
                        var value = this.chartObj.model.stackedValue[axis.name],
                            isStacked = true;
                        if (yMin > value.min)
                            yMin = value.min;
                        if (yMax < value.max)
                            yMax = value.max;
                    }

                    // Find min/max for indicator series
                    if (this.chartObj.model.indicatorRange && this.chartObj.model.indicatorRange[axis.name]) {
                        var value = this.chartObj.model.indicatorRange[axis.name];
                        if (yMin > value.min || yMin == null)
                            yMin = value.min;
                        if (yMax < value.max || yMax == null)
                            yMax = value.max;
                    }

                    if (yMax == yMin) {                   // max == min
                        if (yMax < 0)                                  // value less than 0
                            yMax = 0;
                        else if (yMax <= 1 && yMax > 0)   // value between 0 and 1
                            yMin = 0;
                        else {                                                      // value greater than 1
                            yMin = 0;
                            yMax += 1;
                        }
                    }

                    if ((seriesType == 'column' || seriesType == 'bar') && !axis.startFromZero) {
                        var maxLimit = (axis.range && axis.range.max) || yMax;
                        var interval = (axis.range && axis.range.interval) || this.calculateNumericNiceInterval(maxLimit - yMin, axis, null, maxLimit);
                        yMax += interval;
                        if ((yMin - interval < 0 && yMin > 0) || isStacked) {
                            yMin = 0;
                        }
                        else
                            yMin -= interval;
                    }

                    var deltaY = yMax - yMin;
                    isStacked = false;

                    if (type == "double")
                        axis.range = this._getDoubleAutoRange(axis, yMin, yMax, deltaY)
                    else
                        axis.range = this._getLogAutoRange(axis, yMin, yMax, deltaY)

                }
            }
            else {
                if (!axis.setRange) {
                    axis.range = { min: 0, max: 5, interval: 1, Delta: 4 };
                }
                else {
                    min = (axis.range.min == null || axis.range.min == undefined) ? 0 : axis.range.min;
                    max = (axis.range.max == null || axis.range.max == undefined) ? 5 : axis.range.max;
                    delta = max - min;
                    axis.range = (type == "double") ? this._getDoubleAutoRange(axis, min, max, delta) : this._getLogAutoRange(axis, min, max, delta);
                }
            }
            var commonAxisEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonAxisEventArgs.data = { range: axis.range, axis: axis };
            this.chartObj._trigger("axesRangeCalculate", commonAxisEventArgs);
            var range = commonAxisEventArgs.data.range;
            axis.range = { min: range.min, max: range.max, interval: range.interval, delta: (range.max - range.min) };

        },

        //Calculate ranges for Trendline series
        _calculateTrendLineRange: function (chart, axis, seriesCollection) {
            var series, trendlines, trendline, count, serLength, trendLength, trendlineType, options;
            var serLength = seriesCollection.length;
            for (var m = 0; m < serLength; m++) {
                series = seriesCollection[m];
                trendlines = series.trendlines;
                if (chart.model.AreaType == "cartesianaxes" && (axis.name == series._xAxisName || axis.name == series._yAxisName)) {
                    trendLength = trendlines.length;
                    for (var i = 0; i < trendLength; i++) {
                        trendline = trendlines[i];
                        if (trendline.visibility.toLowerCase() === 'visible') {

                            if (axis.name == series._xAxisName) {
                                trendlineType = trendline.type.toLowerCase();
                                options = new ej.trendlineTypes[trendlineType]();
                                options.calculateTrendLineSegment(series, trendline, axis, chart);
                            } else
                                if (axis.name == series._yAxisName && !axis.setRange && trendline.points && trendline.points.length > 1) {
                                    count = trendline.points.length - 1;
                                    axis.range.min = axis.range.min > trendline.minY ? trendline.minY : axis.range.min;
                                    axis.range.max = axis.range.max < trendline.maxY ? trendline.maxY : axis.range.max;
                                }
                        }
                    }
                }
            }
            return false;
        },

        AlignRangeStart: function (sDate, intervalSize, intervalType) {
            var sResult = new Date(sDate);
            if (intervalType.toLowerCase() == "days") {
                var day = Math.floor(Math.floor((sDate.getDate()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), sDate.getMonth(), day, 0, 0, 0);
            } else if (intervalType.toLowerCase() == "hours") {
                var hour = Math.floor(Math.floor((sDate.getHours()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), hour, 0, 0);
            } else if (intervalType.toLowerCase() == "milliseconds") {
                var milliseconds = Math.floor(Math.floor((sDate.getMilliseconds()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), sDate.getMinutes(), sDate.getSeconds(), milliseconds);
            } else if (intervalType.toLowerCase() == "seconds") {
                var seconds = Math.floor(Math.floor((sDate.getSeconds()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), sDate.getMinutes(), seconds, 0);
            } else if (intervalType.toLowerCase() == "minutes") {
                var minutes = Math.floor(Math.floor((sDate.getMinutes()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate(), sDate.getHours(), minutes, 0, 0);
            } else if (intervalType.toLowerCase() == "months") {
                var month = Math.floor(Math.floor((sDate.getMonth()) / intervalSize) * intervalSize);
                sResult = new Date(sDate.getFullYear(), month, sDate.getDate(), 0, 0, 0);
            } else if (intervalType.toLowerCase() == "years") {
                var year = Math.floor(Math.floor(sDate.getFullYear() / intervalSize) * intervalSize);
                sResult = new Date(year, sDate.getMonth(), sDate.getDate(), 0, 0, 0);
            }
            return sResult;
        },
        _increaseDateTimeInterval: function (date, interval, intervalType) {
            var result = new Date(date);
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
        },

        _calculatePadding: function (axis) {

            var start = (typeof axis.range.min == "string" && !isNaN(Date.parse(axis.range.min))) ? Date.parse(axis.range.min) : (axis.range.min).getTime();
            var end = (typeof axis.range.max == "string" && !isNaN(Date.parse(axis.range.max))) ? Date.parse(axis.range.max) : (axis.range.max).getTime();
            var interval = ((this._increaseDateTimeInterval(new Date(start), axis.range.interval, axis._intervalType)).getTime()) - start;
            var rangePadding = axis.rangePadding.toLowerCase();
            if (!this.chartObj.zoomed && !axis.setRange) {
                start = new Date(start);
                end = new Date(end);
                var intervalType = axis._intervalType.toLowerCase();
                if (axis.rangePadding.toLowerCase() == 'none') {
                    start = start.getTime();
                    end = end.getTime();
                } else if (rangePadding == 'additional' || rangePadding == 'round') {
                    switch (intervalType) {
                        case 'years':
                            var startYear = start.getFullYear();
                            var endYear = end.getFullYear();
                            if (axis.rangePadding.toLowerCase() == 'additional') {
                                start = (new Date(startYear - axis.range.interval, 1, 1, 0, 0, 0)).getTime();
                                end = (new Date(endYear + axis.range.interval, 1, 1, 0, 0, 0)).getTime();
                            } else {
                                start = new Date(startYear, 0, 0, 0, 0, 0).getTime();
                                end = new Date(endYear, 11, 30, 23, 59, 59).getTime();
                            }
                            break;
                        case 'months':
                            var month = start.getMonth();
                            var endMonth = end.getMonth();
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), month, 0, 0, 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), endMonth, new Date(end.getFullYear(), end.getMonth(), 0).getDate(), 23, 59, 59)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), month + (-axis.range.interval), 1, 0, 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), endMonth + (axis.range.interval), endMonth == 2 ? 28 : 30, 0, 0, 0)).getTime();
                            }
                            break;
                        case 'days':
                            var day = start.getDate();
                            var endDay = end.getDate();
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), start.getMonth(), day, 0, 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), endDay, 23, 59, 59)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), start.getMonth(), day + (-axis.range.interval), 0, 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), endDay + (axis.range.interval), 0, 0, 0)).getTime();
                            }
                            break;
                        case 'hours':
                            var hour = (start.getHours() / axis.range.interval) * axis.range.interval;
                            var endHour = end.getHours() + (start.getHours() - hour);
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), hour, 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), endHour, 59, 59)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), hour + (-axis.range.interval), 0, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), endHour + (axis.range.interval), 0, 0)).getTime();
                            }
                            break;
                        case 'minutes':
                            var minute = (start.getMinutes() / axis.range.interval) * axis.range.interval;
                            var endMinute = end.getMinutes() + (start.getMinutes() - minute);
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHour(), minute, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHour(), endMinute, 59)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHours(), minute + (-axis.range.interval), 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHours(), minute + (axis.range.interval), 0)).getTime();
                            }
                            break;
                        case 'seconds':
                            var second = (start.getSeconds() / axis.range.interval) * axis.range.interval;
                            var endSecond = end.getSeconds() + (start.getSeconds() - second);
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHours(), start.getMinutes(), second, 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHour(), end.getMinutes(), endSecond, 0)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHours(), start.getMinutes(), second + (-axis.range.interval), 0)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHours(), end.getMinutes(), endSecond + (axis.range.interval), 0)).getTime();
                            }
                            break;
                        case 'milliseconds':
                            var milliSecond = (start.getMilliseconds() / axis.range.interval) * axis.range.interval;
                            var endMilliSecond = end.getMilliseconds() + (start.getMilliseconds() - milliSecond);
                            if (rangePadding == 'round') {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHours(), start.getMinutes(), start.getSeconds(), milliSecond)).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHours(), end.getMinutes(), end.getSeconds(), endMilliSecond)).getTime();
                            } else {
                                start = (new Date(start.getFullYear(), start.getMonth(), start.getDay(), start.getHours(), start.getMinutes(), start.getSeconds(), milliSecond + (-axis.range.interval))).getTime();
                                end = (new Date(end.getFullYear(), end.getMonth(), end.getDay(), end.getHours(), end.getMinutes(), end.getSeconds(), endMilliSecond + (axis.range.interval))).getTime();
                            }
                            break;
                    }

                }

            }
            axis.actualRange.interval = interval;
            axis.actualRange.min = start;
            axis.actualRange.max = end;
            axis._interval = axis.range.interval;
            axis.actualRange.delta = (axis.actualRange.max - axis.actualRange.min);
            axis.range.min = new Date(start);
            axis.range.max = new Date(end);
            this._calculateVisibleRange(axis);

        },
        _calculateVisibleRange: function (axis, sender, isScroll) {
            this.chartObj = sender ? sender : this.chartObj;
            axis.visibleRange = (!isScroll) ? $.extend(true, {}, axis.actualRange) : axis.visibleRange;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && this.chartObj.model.AreaType != "polaraxes" && !this.chartObj.model.disableZoom) {

                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : (axis.zoomFactor < 0 ? 0 : axis.zoomFactor);
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : (axis.zoomPosition > 1 ? 1 : axis.zoomPosition);
                var baseRange = axis.actualRange;
                if (axis.isInversed) {
                    var start = axis.actualRange.max - axis.zoomPosition * axis.actualRange.delta;
                    var end = start - axis.zoomFactor * axis.actualRange.delta;
                }
                else {
                    var start = axis.actualRange.min + axis.zoomPosition * axis.actualRange.delta;
                    var end = start + axis.zoomFactor * axis.actualRange.delta;
                }

                if (start < baseRange.min) {
                    end = end + (baseRange.min - start);
                    start = baseRange.min;
                }

                if (end > baseRange.max) {
                    start = start - (end - baseRange.max);
                    end = baseRange.max;
                }

                var startDate = new Date(start);
                var endDate = new Date(end);
                if (start == end) {
                    startDate = new Date(Date.parse(startDate) - 2592000000);
                    endDate = new Date(Date.parse(endDate) + 2592000000);
                }
                //Use below code to find min,max and interval for visible range
                var min = Math.min(startDate.getTime(), endDate.getTime());
                var max = Math.max(startDate.getTime(), endDate.getTime());
                var intervalX = axis.enableAutoIntervalOnZooming ? this.calculateDateTimeNiceInterval(axis, startDate, endDate) : { 'interval': axis._interval, 'intervalType': axis._intervalType };
                var interval = ((this._increaseDateTimeInterval(startDate, intervalX.interval, intervalX.intervalType)).getTime()) - min;

                if (isScroll) {
                    return { min: min, max: max, interval: interval };
                }
                else {
                    axis._intervalType = intervalX.intervalType;
                    axis.visibleRange.min = min;
                    axis.visibleRange.max = max;
                    axis.visibleRange.interval = interval;
                    axis.visibleRange.delta = Math.abs(axis.visibleRange.max - axis.visibleRange.min);
                    axis._interval = intervalX.interval;
                }
            }

        },
        _calculateAxisLabels: function (axis) {
            var position, text;
            var minRange = axis.enableAutoIntervalOnZooming ? axis.visibleRange.min : axis.actualRange.min;
            if (this.chartObj.zoomed || axis.zoomed || !axis.setRange)
                position = (this.AlignRangeStart(new Date(minRange), axis._interval, axis._intervalType)).getTime();

            else
                position = axis.visibleRange.min;
            while (position <= axis.visibleRange.max) {
                if (position >= axis.visibleRange.min && position <= axis.visibleRange.max) {
                    text = (ej.format(new Date(position), ((!(axis.labelFormat)) ? ej.EjSvgRender.utils._dateTimeLabelFormat(axis._intervalType, axis) : axis.labelFormat), this.chartObj.model.locale));
                    var commonAxesEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonAxesEventArgs.data = { label: { Text: text, Value: position }, axis: axis };
                    this.chartObj._trigger("axesLabelRendering", commonAxesEventArgs);
                    axis.visibleLabels.push({ Value: position, Text: commonAxesEventArgs.data.label.Text });
                }
                position = (this._increaseDateTimeInterval(new Date(position), axis._interval, axis._intervalType)).getTime();

                axis.visibleLabels[axis.visibleLabels.length - 1] = axis.visibleLabels[axis.visibleLabels.length - 1];
            }
            axis._LableMaxWidth = ej.EjSvgRender.utils._getMaxLabelWidth(axis, this.chartObj);
        },
        calculateDateTimeNiceInterval: function (axis, startDate, endDate) {
            var oneDay = 24 * 60 * 60 * 1000;
            //var axisInterval ;
            var totalDays = (Math.abs((startDate.getTime() - endDate.getTime()) / (oneDay)));
            var interval = this.calculateNumericNiceInterval(totalDays / 365, axis, "years");

            if (interval >= 1) {
                return { interval: interval, intervalType: "Years" };
            }

            interval = this.calculateNumericNiceInterval(totalDays / 30, axis, "months");

            if (interval >= 1) {
                return { interval: interval, intervalType: "Months" };
            }

            interval = this.calculateNumericNiceInterval(totalDays, axis, "days");

            if (interval >= 1) {


                return { interval: interval, intervalType: "Days" };
            }

            var totalHours = totalDays * 24;

            interval = this.calculateNumericNiceInterval(totalHours, axis, "hours");

            if (interval >= 1) {

                return { interval: interval, intervalType: "Hours" };
            }

            var totalMinutes = totalDays * 24 * 60;

            interval = this.calculateNumericNiceInterval(totalMinutes, axis, "minutes");

            if (interval >= 1) {

                return { interval: interval, intervalType: "Minutes" };
            }

            var totalSeconds = totalDays * 24 * 60 * 60;

            interval = this.calculateNumericNiceInterval(totalSeconds, axis, "seconds");

            if (interval >= 1) {

                return { interval: interval, intervalType: "Seconds" };
            }

            var totalMilliseconds = totalDays * 24 * 60 * 60 * 1000;

            interval = this.calculateNumericNiceInterval(totalMilliseconds, axis, "milliseconds");

            if (interval >= 1) {

                return { interval: interval, intervalType: "Milliseconds" };
            }

        },
        calculateNumericNiceInterval: function (delta, axis, setInterval, max) {
            var desiredIntervalsCount = this.GetActualDesiredIntervalsCount(axis, axis.length);
            var niceInterval = delta / desiredIntervalsCount;
            if (axis._valueType == 'double') {
                if (axis.desiredIntervals != null)
                    return niceInterval;
            }
            var minInterval = Math.pow(10, Math.floor(ej.EjSvgRender.utils._logBase(niceInterval, 10))),
                intervalDivs = [10, 5, 2, 1],
                maxLimit = max || (axis.range && axis.range.max);


            for (var i = 0; i < intervalDivs.length; i++) {
                var currentInterval = minInterval * intervalDivs[i];
                if (desiredIntervalsCount < (delta / currentInterval)) {
                    if (axis._valueType == "datetime") {
                        return niceInterval = (!ej.util.isNullOrUndefined(axis.intervalType) && axis.intervalType.toLowerCase() == setInterval) ? Math.ceil(niceInterval) : niceInterval;
                    }
                    if (!ej.util.isNullOrUndefined(axis.range) && !ej.util.isNullOrUndefined(axis.range.max))
                        return (niceInterval > maxLimit ? currentInterval : niceInterval);
                    else
                        return niceInterval;
                }

                niceInterval = currentInterval;
            }

            return niceInterval;
        },
        GetActualDesiredIntervalsCount: function (axis, size) {
            if (ej.util.isNullOrUndefined(axis.desiredIntervals)) {
                var desiredIntervalsCount = (axis.orientation.toLowerCase() == "horizontal" ? 0.533 : 1) * axis.maximumLabels;
                desiredIntervalsCount = Math.max((size * (desiredIntervalsCount / 100)), 1);

                return desiredIntervalsCount;
            } else {
                return axis.desiredIntervals;
            }
        },
        _calculateRange: function (axis, seriesCollection) {
            if (!this.chartObj.zoomed) {
                var defaultDate = new Date();
                if (seriesCollection.length > 0 && this.chartObj.model._hasSeriesPoints && seriesCollection[0].points.length > 0 || this.chartObj.model.indicators[0]._points.length > 0) {
                    var maxX, minY;
                    var maxY, minX;
                    var maxMinXValue = { maxX: null, minX: null };
                    var maxMinYValue = { maxY: null, minY: null };
                    var pointLength;
                    for (var i = 0; i < seriesCollection.length; i++) {
                        pointLength = seriesCollection[i].points.length;
                        if (pointLength > 0) {
                            if (seriesCollection[i].visibility.toLowerCase() === 'visible' && seriesCollection[i].points.length > 0) {
                                minX = maxX = new Date(seriesCollection[i].points[0].xValue);
                                maxY = minY = seriesCollection[i].points[0].YValues[0];
                                for (var j = 0; j < pointLength; j++) {
                                    if (minX != null && minX != undefined) {
                                        if (minX > seriesCollection[i].points[j].xValue)
                                            minX = seriesCollection[i].points[j].xValue;
                                        if (maxX < seriesCollection[i].points[j].xValue)
                                            maxX = seriesCollection[i].points[j].xValue;
                                    }
                                    else {
                                        minX = maxX = new Date(seriesCollection[i].points[j + 1].xValue);
                                    }
                                    if (minY > seriesCollection[i].points[j].YValues[0])
                                        minY = seriesCollection[i].points[j].YValues[0];
                                    if (maxY < seriesCollection[i].points[j].YValues[0])
                                        maxY = seriesCollection[i].points[j].YValues[0];
                                }
                                seriesCollection[i].minX = minX;
                                seriesCollection[i].maxX = maxX;
                                seriesCollection[i].minY = minY;
                                seriesCollection[i].maxY = maxY;
                                if (!axis.maxPointLength || axis.maxPointLength < pointLength)
                                    axis.maxPointLength = pointLength;
                            }
                        }

                        if ((maxMinXValue.minX = (maxMinXValue.minX == null && typeof seriesCollection[i].minX != "number") ? seriesCollection[i].minX : maxMinXValue.minX) > seriesCollection[i].minX) {
                            maxMinXValue.minX = (typeof seriesCollection[i].minX != "number") ? seriesCollection[i].minX : maxMinXValue.minX;
                        }
                        if ((maxMinXValue.maxX = (maxMinXValue.maxX == null && typeof seriesCollection[i].maxX != "number") ? seriesCollection[i].maxX : maxMinXValue.maxX) < seriesCollection[i].maxX) {
                            maxMinXValue.maxX = (typeof seriesCollection[i].maxX != "number") ? seriesCollection[i].maxX : maxMinXValue.maxX;
                        }
                        if (maxMinYValue.minY > seriesCollection[i].minY) {
                            maxMinYValue.minY = seriesCollection[i].minY;
                        }
                        if (maxMinYValue.maxY < seriesCollection[i].maxY) {
                            maxMinYValue.maxY = seriesCollection[i].maxY;
                        }

                    }
                    // Find min/max for indicator series

                    if (this.chartObj.model.indicatorRange && this.chartObj.model.indicatorRange[axis.name]) {
                        var value = this.chartObj.model.indicatorRange[axis.name];
                        if (maxMinXValue.minX > new Date(value.min) || maxMinXValue.minX == null)
                            maxMinXValue.minX = new Date(value.min);
                        if (maxMinXValue.maxX < new Date(value.max) || maxMinXValue.maxX == null)
                            maxMinXValue.maxX = new Date(value.max);
                    }
                    maxMinXValue.minX = (maxMinXValue.minX == null) ? defaultDate : maxMinXValue.minX;
                    maxMinXValue.maxX = (maxMinXValue.maxX == null) ? new Date(new Date().setMonth(defaultDate.getMonth() + 5)) : maxMinXValue.maxX;
                    if (maxMinXValue.minX == maxMinXValue.maxX) {
                        maxMinXValue.minX = new Date(Date.parse(maxMinXValue.minX) - 2592000000);
                        maxMinXValue.maxX = new Date(Date.parse(maxMinXValue.maxX) + 2592000000);
                    }

                    var data = _sideBySeriesPadding(this.chartObj, maxMinXValue.minX.getTime(), maxMinXValue.maxX.getTime(), axis);
                    maxMinXValue.minX = new Date(data.startPadding);
                    maxMinXValue.maxX = new Date(data.endPadding);



                    var intervalX = this.calculateDateTimeNiceInterval(axis, maxMinXValue.minX, maxMinXValue.maxX);
                    axis._intervalType = (axis.intervalType) ? axis.intervalType : intervalX.intervalType;
                    if (axis.intervalType == "auto")
                        axis._intervalType = axis.intervalType = intervalX.intervalType;
                    if (axis.setAxisInterval == null || axis.setAxisInterval == undefined) {
                        axis.setAxisInterval = (axis.range && axis.range.interval) ? true : false;
                    }

                    //condition chechked when changing interval dynamically
                    if (axis._setInterval && !this.chartObj._chartResize && axis.range && axis._setInterval != axis.range.interval)
                        axis._setInterval = null;

                    if (!axis.setRange) {
                        axis.range = { min: maxMinXValue.minX, max: maxMinXValue.maxX, interval: intervalX.interval };
                    } else {
                        if (!axis.range.max)
                            axis.range.max = maxMinXValue.maxX;
                        if (!axis.range.min)
                            axis.range.min = maxMinXValue.minX;
                        if (typeof axis.range.min == "string" && axis.range.min.indexOf("/Date(") != -1)
                            axis.range.min = new Date(parseInt(axis.range.min.substr(6)));
                        if (typeof axis.range.max == "string" && axis.range.max.indexOf("/Date(") != -1)
                            axis.range.max = new Date(parseInt(axis.range.max.substr(6)));
                        if (new Date(axis.range.min).getTime() == new Date(axis.range.max).getTime()) {
                            axis.range.max = new Date(Date.parse(axis.range.max) + 86400000);
                        }
                        intervalX = this.calculateDateTimeNiceInterval(axis, new Date(axis.range.min), new Date(axis.range.max));
                        axis._intervalType = (axis.intervalType) ? axis.intervalType : intervalX.intervalType;
                        if (!axis.setAxisInterval) {
                            axis.range.interval = intervalX.interval; // set auto interval value
                            axis._setInterval = intervalX.interval;
                        }
                        axis.actual_Range = $.extend(true, {}, axis.range);
                        axis.setRange = true;
                        var interval = axis._setInterval ? intervalX.interval : (axis.range.interval || axis.actual_Range.interval);
                        axis.range = { min: axis.actual_Range.min, max: axis.actual_Range.max, interval: interval };
                    }
                } else {
                    if (!axis.setRange) {
                        axis.range = { min: defaultDate, max: new Date(new Date().setMonth(defaultDate.getMonth() + 5)), interval: 1 };
                        axis._intervalType = ej.util.isNullOrUndefined(axis.intervalType) ? "Months" : axis.intervalType;
                    }
                    else {
                        axis.range.min = (axis.range.min === null || axis.range.min === undefined) ? defaultDate : axis.range.min;
                        axis.range.max = (axis.range.max === null || axis.range.max === undefined) ? new Date(new Date().setMonth(defaultDate.getMonth() + 5)) : axis.range.max;
                        axis.range.interval = (axis.range.interval === null || axis.range.interval === undefined) ? 1 : axis.range.interval;
                        axis._intervalType = 'Months';
                    }

                }
                var commonAxisEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonAxisEventArgs.data = { range: axis.range, axis: axis };
                this.chartObj._trigger("axesRangeCalculate", commonAxisEventArgs);
                var range = commonAxisEventArgs.data.range;
                axis.range = { min: range.min, max: range.max, interval: range.interval, delta: (range.max - range.min) };
            }
        },
        _calculateRanges: function (chartObj, axis, seriesCollection) {

            this.chartObj = chartObj;
            this._saveRange(chartObj, axis);
            this._calculateRange(axis, seriesCollection);
            axis._range = axis.range;
            if (chartObj.model._drawTrendline)
                this._calculateTrendLineRange(chartObj, axis, seriesCollection);

            this._calculatePadding(axis);

            this._calculateAxisLabels(axis);
        },
        _saveRange: function (chartObj, axis) {
            if (chartObj.zoomed || chartObj.resetZooming)
                axis.range = axis._range;
            //To check range is set in while redrawing the chart
            if (axis._initialRange) {
                if (axis._initialRange != axis.range && axis.range != null)
                    axis.setRange = true;
                else if (axis.range == null)
                    axis.setRange = false;
            }
            if (!chartObj.zoomed && !chartObj.resetZooming)
                axis._initialRange = axis.range == null ? { min: null, max: null, interval: null } : { min: axis.range.min, max: axis.range.max, interval: axis.range.interval };
        }
    };

    function ejExtendClass(parent, members) {
        var object = function () {
        };
        object.prototype = new parent();
        $.extend(object.prototype, members);
        return object;
    }

    //DateTime calculation
    var ejDateTimeValue = ejExtendClass(ej.EjAxisRenderer);
    ej.axisTypes.datetime = ejDateTimeValue;

    var ejDoubleValue = ejExtendClass(ej.EjAxisRenderer, {


        _calculateRange: function (chartObj, axis, seriesCollection, params) {
            if (!chartObj.zoomed) {
                this._seriesMinMax(chartObj, axis, seriesCollection, "double", params);
            }
        },

        _getDoubleAutoRange: function (axis, min, max) {
            var delta;
            var interval;
            var intervalstr;
            if (!axis.setRange) {
                axis.range = { min: min, max: max };

            } else {

                if (ej.util.isNullOrUndefined(axis.range.max))
                    axis.range.max = max;
                if (ej.util.isNullOrUndefined(axis.range.min))
                    axis.range.min = min;

                axis.actual_Range = $.extend(true, {}, axis.range);
                axis.setRange = true;
            }
            delta = axis.range.max - axis.range.min;
            interval = this.calculateNumericNiceInterval(delta, axis);
            if (ej.EjSvgRender.utils._decimalPlaces(interval) > 20) {
                intervalstr = interval.toString();
                interval = parseFloat((intervalstr.substring(0, intervalstr.indexOf(".")) + intervalstr.substring(intervalstr.indexOf("."), 22)));
            }
            if ((ej.util.isNullOrUndefined(axis.range.interval)) || (axis.range.interval < 0))
                axis.range.interval = interval;
            axis.range.delta = delta;

            return axis.range;
        },
        _calculatePadding: function (chartObj, axis, baseRange) {
            var start = baseRange.min;
            var end = baseRange.max;
            var rangePadding = axis.rangePadding.toLowerCase();
            var interval = baseRange.interval;
            if ((!axis.setRange) && (!chartObj.zoomed)) {

                if (rangePadding == 'normal') {
                    var minimum = 0, remaining;
                    if (start < 0) {
                        start = 0;
                        minimum = baseRange.min + (baseRange.min / 20);

                        remaining = interval + (minimum % interval);

                        if ((0.365 * interval) >= remaining) {
                            minimum -= interval;
                        }

                        if (minimum % interval < 0) {
                            minimum = (minimum - interval) - (minimum % interval);
                        }
                    } else {
                        minimum = start < ((5.0 / 6.0) * end)
                            ? 0
                            : (start - (end - start) / 2);
                        if (minimum % interval > 0) {
                            minimum -= (minimum % interval);
                        }
                    }
                    if (end > 0)
                        var maximum = ((end + (end - start) / 20) > Number.MAX_VALUE) ? Number.MAX_VALUE : (end + (end - start) / 20);
                    else
                        var maximum = (end - (end - start) / 20);

                    remaining = interval - (maximum % interval);

                    if ((0.365 * interval) >= remaining) {
                        maximum = (maximum + interval > Number.MAX_VALUE) ? Number.MAX_VALUE : maximum + interval;
                    }

                    if (maximum % interval > 0) {
                        maximum = ((maximum + interval) - (maximum % interval) > Number.MAX_VALUE) ? Number.MAX_VALUE : (maximum + interval) - (maximum % interval);
                    }
                    if (minimum <= 0) {
                        interval = this.calculateNumericNiceInterval(maximum - minimum, axis);
                        maximum = (Math.ceil(maximum / interval) * interval > Number.MAX_VALUE) ? Number.MAX_VALUE : Math.ceil(maximum / interval) * interval;
                    }
                    start = (!(axis.roundingPlaces)) ? parseFloat(minimum.toFixed((ej.EjSvgRender.utils._decimalPlaces(interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(interval)))) : parseFloat(minimum.toFixed(axis.roundingPlaces));
                    end = (!(axis.roundingPlaces)) ? parseFloat(maximum.toFixed((ej.EjSvgRender.utils._decimalPlaces(interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(interval)))) : parseFloat(maximum.toFixed(axis.roundingPlaces));

                } else if (rangePadding == 'additional' || rangePadding == 'round') {
                    start = Math.floor(start / interval) * interval;
                    end = (Math.ceil(end / interval) * interval > Number.MAX_VALUE) ? Number.MAX_VALUE : Math.ceil(end / interval) * interval;
                    if (rangePadding == 'additional') {
                        start -= interval;
                        end = end + interval >= Number.MAX_VALUE ? Number.MAX_VALUE : end + interval;
                    }
                }


            }
            axis.actualRange.min = start;
            axis.actualRange.max = end;
            axis.actualRange.interval = interval;
            axis.range.min = start;
            axis.range.max = end;
            axis.range.interval = interval;
            axis.actualRange.delta = end - start >= Number.MAX_VALUE ? end : end - start;
            this._calculateVisibleRange(axis);
            axis.rangePadding = axis._rangePadding;
        },
        _calculateVisibleRange: function (axis, sender, isScroll) {
            this.chartObj = sender ? sender : this.chartObj;
            axis.visibleRange = (!isScroll) ? $.extend(true, {}, axis.actualRange) : axis.visibleRange;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && this.chartObj.model.AreaType != "polaraxes" && !this.chartObj.model.disableZoom) {
                var baseRange = axis.actualRange;

                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : (axis.zoomFactor < 0 ? 0 : axis.zoomFactor);
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : (axis.zoomPosition > 1 ? 1 : axis.zoomPosition);
                if (axis.isInversed) {
                    var start = axis.actualRange.max - axis.zoomPosition * axis.actualRange.delta;
                    var end = start - axis.zoomFactor * axis.actualRange.delta;
                }
                else {
                    var start = axis.actualRange.min + axis.zoomPosition * axis.actualRange.delta;
                    var end = start + axis.zoomFactor * axis.actualRange.delta;
                }

                if (start < baseRange.min) {
                    end = end + (baseRange.min - start);
                    start = baseRange.min;
                }

                if (end > baseRange.max) {
                    start = start - (end - baseRange.max);
                    end = baseRange.max;
                }

                var delta = Math.abs(end - start);
                var interval = axis.enableAutoIntervalOnZooming ? this.calculateNumericNiceInterval(delta, axis) : axis.actualRange.interval;
                if (isScroll) {
                    return { min: Math.min(start, end), max: Math.max(start, end), delta: delta, interval: interval };
                }
                else {
                    axis.visibleRange.min = Math.min(start, end);
                    axis.visibleRange.max = Math.max(start, end);
                    axis.visibleRange.delta = delta;
                    axis.visibleRange.interval = interval;
                    axis.zoomed = (this.chartObj.zoomed === null || this.chartObj.zoomed === undefined) ? true : this.chartObj.zoomed;
                }
            }

        },
        _calculateAxisLabels: function (chartObj, currentAxis) {

            var tempInterval,
                customFormat,
                round = currentAxis.roundingPlaces,
                tempPlace, labelValue,
                commonAxesEventArgs,
                labelText, locale = this.chartObj.model.locale,
                labelFormat = currentAxis.labelFormat, labelPrecision, labelPrecisionHighest = 20, labelPrecisionDefault = 6;
            if (chartObj.zoomed || currentAxis.zoomed || currentAxis.padding)
                tempInterval = currentAxis.visibleRange.min - (currentAxis.visibleRange.min % currentAxis.visibleRange.interval);
            else
                tempInterval = currentAxis.visibleRange.min;
            for (; tempInterval <= currentAxis.visibleRange.max; tempInterval += currentAxis.visibleRange.interval) {

                if (ej.EjSvgRender.utils._inside(tempInterval, currentAxis.visibleRange)) {
                    tempPlace = (tempInterval.toString().split(0).length - 1 > 10) ? 10 : 20;
                    tempInterval = parseFloat(tempInterval.toFixed((!round && round > tempPlace) ? round : tempPlace));
                    //By default axis labels are rounded based on interval. These rounded values are not used to draw labels, so labels are misplaced from ticks
                    labelValue = (!round) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(currentAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(currentAxis.visibleRange.interval)))) : tempInterval;
                    labelText = (!(round)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(currentAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(currentAxis.visibleRange.interval)))) : parseFloat(tempInterval.toFixed(round));

                    customFormat = currentAxis.labelFormat;
                    if (!(customFormat))
                        labelText = !currentAxis.isStacked100 ? (!locale ? labelText : labelText.toLocaleString(locale)) : labelText + "%";
                    else if (customFormat.match('{value}') != null)
                        labelText = customFormat.replace('{value}', labelText);
                    else if ((customFormat.indexOf('e') == 0 || customFormat.indexOf('E') == 0) && (customFormat.indexOf("ej.format") == -1)) {
                        labelPrecision = customFormat.match(/(\d+)/g);
                        labelPrecision = labelPrecision == null ? labelPrecisionDefault : labelPrecision > labelPrecisionHighest ? labelPrecisionHighest : labelPrecision;
                        labelText = labelText.toExponential(labelPrecision);
                    }
                    else {
                        if (customFormat.indexOf("ej.format") != -1)
                            customFormat = customFormat.substring(customFormat.indexOf("(") + 1, customFormat.indexOf(")"));
                        labelText = ej.format(labelText, customFormat, locale);
                    }

                    // customize label by event
                    commonAxesEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonAxesEventArgs.data = { label: { Text: labelText, Value: tempInterval }, axis: currentAxis };
                    chartObj._trigger("axesLabelRendering", commonAxesEventArgs);
                    currentAxis.visibleLabels.push({ Value: labelValue, Text: commonAxesEventArgs.data.label.Text });

                }
            }
            var rowCount = 0, labels = currentAxis.visibleLabels;
            for (var r = 0; r < labels.length; r++) {
                if (typeof labels[r].Text === 'string') {
                    var labelLength = (labels[r].Text.split('<br>')).length;
                    rowCount = Math.max(labelLength, rowCount);
                }
            }
            currentAxis.rowsCount = rowCount;
            currentAxis._LableMaxWidth = ej.EjSvgRender.utils._getMaxLabelWidth(currentAxis, this.chartObj);

        },

        _calculateRanges: function (chartObj, axis, seriesCollection, params) {
            this.chartObj = chartObj;
            this._saveRange(chartObj, axis);
            this._calculateRange(chartObj, axis, seriesCollection, params);
            axis._range = axis.range;
            if (chartObj.model._drawTrendline)
                this._calculateTrendLineRange(chartObj, axis, seriesCollection);

            this._calculatePadding(chartObj, axis, axis.range);

            if (axis.maximumLabels > 0)  // to calculate only if labels have to be displayed
                this._calculateAxisLabels(chartObj, axis);

        }
    });
    ej.axisTypes.double = ejDoubleValue;
    //log axis
    var ejLogValue = ejExtendClass(ej.EjAxisRenderer, {

        // Get value for log min and max
        _getRoundValue: function (x, div, up) {
            return (up ? Math.ceil(x / div) : Math.floor(x / div)) * div;
        },

        // Caculate log nice interval
        calculateLogNiceInterval: function (delta, axis) {
            var desiredIntervalsCount = this.GetActualDesiredIntervalsCount(axis, axis.length);
            var niceInterval = delta;
            var minInterval = Math.pow(10, Math.floor(ej.EjSvgRender.utils._logBase(niceInterval, 10)));
            var intervalDivs = [10, 5, 2, 1];

            for (var i = 0; i < intervalDivs.length; i++) {
                var currentInterval = minInterval * intervalDivs[i];
                if (desiredIntervalsCount < (delta / currentInterval)) {
                    return niceInterval;
                }

                niceInterval = currentInterval;
            }

            return niceInterval;
        },

        // Get log value for auto range
        _getLogAutoRange: function (axis, min, max, delta) {

            var logStart = ej.EjSvgRender.utils._logBase(min, axis.logBase);
            logStart = $.isNumeric(logStart) ? logStart : min;
            var logEnd = ej.EjSvgRender.utils._logBase(max, axis.logBase);
            logEnd = $.isNumeric(logEnd) ? logEnd : max;

            var mulS = this._getRoundValue(logStart, 1, false);
            var mulE = this._getRoundValue(logEnd, 1, true);
            if (mulS == 0 && mulE == 0) {
                mulS = ej.EjSvgRender.utils._logBase((max - max / 2), axis.logBase);
                mulE = ej.EjSvgRender.utils._logBase((max + max / 2), axis.logBase);
            }
            delta = mulE - mulS;
            var interval = this.calculateLogNiceInterval(delta, axis);

            axis.actual_Range = { min: mulS, max: mulE, interval: interval, Delta: delta };

            mulS = Math.pow(axis.logBase, Math.floor(logStart));
            mulE = Math.pow(axis.logBase, Math.ceil(logEnd));

            delta = mulE - mulS;

            if (!axis.setRange) {

                return axis.range = { min: mulS, max: mulE, interval: interval, Delta: delta };

            } else {
                if (ej.util.isNullOrUndefined(axis.range.interval))
                    axis.range.interval = interval;
                if (ej.util.isNullOrUndefined(axis.range.max))
                    axis.range.max = mulE;
                if (ej.util.isNullOrUndefined(axis.range.min))
                    axis.range.min = mulS;

                axis.actual_Range = $.extend(true, {}, axis.range);

                if (!ej.util.isNullOrUndefined(axis.actual_Range.max)) {
                    axis.actual_Range.max = ej.EjSvgRender.utils._logBase(axis.actual_Range.max, axis.logBase);
                    axis.actual_Range.max = this._getRoundValue(axis.actual_Range.max, 1, true);
                }
                if (!ej.util.isNullOrUndefined(axis.range.min)) {
                    axis.actual_Range.min = ej.EjSvgRender.utils._logBase(axis.actual_Range.min, axis.logBase);
                    axis.actual_Range.min = this._getRoundValue(axis.actual_Range.min, 1, false);
                }

                axis.setRange = true;

                return axis.range;
            }
        },

        //Calcualte auto log range from series
        _calculateLogRange: function (chartObj, axis, seriesCollection, params) {
            if (!chartObj.zoomed) {
                this._seriesMinMax(chartObj, axis, seriesCollection, "logarithmic", params);
            }
        },

        //Assign base range values to actual range
        _calculateLogPadding: function (chartObj, axis, baseRange) {
            // No padding support for log axis
            var start = baseRange.min;
            var end = baseRange.max;
            var interval = baseRange.interval;
            axis.actualRange.min = start;
            axis.actualRange.max = end;
            axis.actualRange.interval = interval;
            axis.actualRange.delta = end - start;
            this._calculateVisibleRange(axis);
        },

        // Calculate visible range for zooming
        _calculateVisibleRange: function (axis, sender, isScroll) {
            this.chartObj = sender ? sender : this.chartObj;
            axis.visibleRange = (!isScroll) ? $.extend(true, {}, axis.actualRange) : axis.visibleRange;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && this.chartObj.model.AreaType != "polaraxes" && !this.chartObj.model.disableZoom) {
                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : (axis.zoomFactor < 0 ? 0 : axis.zoomFactor);
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : (axis.zoomPosition > 1 ? 1 : axis.zoomPosition);
                var baseRange = axis.actualRange;
                if (axis.isInversed) {
                    var start = axis.actualRange.max - axis.zoomPosition * axis.actualRange.delta;
                    var end = start - axis.zoomFactor * axis.actualRange.delta;
                }
                else {
                    var start = axis.actualRange.min + axis.zoomPosition * axis.actualRange.delta;
                    var end = start + axis.zoomFactor * axis.actualRange.delta;
                }

                if (start < baseRange.min) {
                    end = end + (baseRange.min - start);
                    start = baseRange.min;
                }

                if (end > baseRange.max) {
                    start = start - (end - baseRange.max);
                    end = baseRange.max;
                }
                var delta = Math.abs(end - start);
                var interval = axis.enableAutoIntervalOnZooming ? (this.calculateLogNiceInterval(delta, axis)) : axis.visibleRange.interval;
                var factor = (ej.util.isNullOrUndefined(axis.roundingPlaces)) ?
                    (ej.EjSvgRender.utils._decimalPlaces(axis.visibleRange.interval) == 0 ? 1
                        : ej.EjSvgRender.utils._decimalPlaces(axis.visibleRange.interval)) : axis.roundingPlaces;
                interval = parseFloat(axis.visibleRange.interval.toFixed(factor));
                if (isScroll)
                    return { min: Math.min(start, end), max: Math.max(start, end), interval: interval };
                else {
                    axis.visibleRange.interval = interval;
                    axis.visibleRange.min = Math.min(start, end);
                    axis.visibleRange.max = Math.max(start, end);
                    axis.visibleRange.delta = delta;
                    axis.zoomed = (this.chartObj.zoomed === null || this.chartObj.zoomed === undefined) ? true : this.chartObj.zoomed;
                }
            }

        },

        //Method implementation for Generate Labels in ChartAxis
        _calculateAxisLabels: function (chartObj, currentAxis) {

            var tempInterval, round = currentAxis.roundingPlaces;
            if (chartObj.zoomed || currentAxis.zoomed)
                tempInterval = currentAxis.visibleRange.min - (currentAxis.visibleRange.min % currentAxis.visibleRange.interval);
            else
                tempInterval = currentAxis.visibleRange.min;
            for (; tempInterval <= currentAxis.visibleRange.max; tempInterval += currentAxis.visibleRange.interval) {


                if (ej.EjSvgRender.utils._inside(tempInterval, currentAxis.visibleRange)) {
                    var customFormat = (!(currentAxis.labelFormat)) ? null : currentAxis.labelFormat.match('{value}');
                    var tempIntervaltext = Math.pow(currentAxis.logBase, tempInterval),
                        tempPlace = (tempIntervaltext.toString().split(0).length - 1 > 10) ? 10 : 20;
                    tempIntervaltext = parseFloat(tempIntervaltext.toFixed((!round && round > tempPlace) ? round : tempPlace));

                    var labelText = (!(currentAxis.labelFormat)) ? tempIntervaltext : (customFormat != null) ?
                        currentAxis.labelFormat.replace('{value}', tempIntervaltext) :
                        (ej.format(tempIntervaltext, currentAxis.labelFormat, chartObj.model.locale));
                    // customize label by event
                    var commonAxesEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonAxesEventArgs.data = { label: { Text: labelText, Value: tempInterval }, axis: currentAxis };
                    chartObj._trigger("axesLabelRendering", commonAxesEventArgs);
                    currentAxis.visibleLabels.push({ Value: tempInterval, Text: commonAxesEventArgs.data.label.Text });
                }
            }

            currentAxis._LableMaxWidth = ej.EjSvgRender.utils._getMaxLabelWidth(currentAxis, this.chartObj);

        },


        //Category axis calculation
        _calculateRanges: function (chartObj, axis, seriesCollection, params) {
            this.chartObj = chartObj;
            this._calculateLogRange(chartObj, axis, seriesCollection, params);
            if (chartObj.model._drawTrendline)
                this._calculateTrendLineRange(chartObj, axis, seriesCollection);
            this._calculateLogPadding(chartObj, axis, axis.actual_Range);
            this._calculateAxisLabels(chartObj, axis);
        }


    });
    ej.axisTypes.logarithmic = ejLogValue;

    //Category Axes calculation
    var ejCategoryValue = ejExtendClass(ej.EjAxisRenderer, {
        //axis range calculation and assign indexed value to x value of points
        _calculateCategoryRange: function (axis, seriesCollection) {
            var legendCollapsed = (this.chartObj.model.legendCollapsed == undefined) ? !this.chartObj.zoomed : this.chartObj.model.legendCollapsed;
            if (!this.chartObj.model.excludeDataUpdate || legendCollapsed) {
                var maxXValue = { maxX: null, minX: 0 },
                    labels = [],
                    pointX,
                    intervalX,
                    deltaX,
                    index,
                    pointsLength,
                    isIndex = axis.isIndexed,
                    locale = this.chartObj.model.locale;
                if (seriesCollection.length > 0 && this.chartObj.model._hasSeriesPoints && seriesCollection[0].points.length > 0 || this.chartObj.model.indicators[0]._points.length > 0) {
                    for (var m = 0; m < seriesCollection.length; m++) {
                        pointsLength = seriesCollection[m].points.length;
                        for (var n = 0; n < pointsLength; n++) {
                            if (seriesCollection[m]._xAxisValueType == "date")
                                pointX = ej.format(new Date(seriesCollection[m].points[n].x), (ej.util.isNullOrUndefined(axis.labelFormat) ? "dd/MM/yyyy" : axis.labelFormat), locale);
                            else
                                pointX = seriesCollection[m].points[n].x;
                            if (!isIndex) {
                                index = $.inArray(pointX, labels);
                                if (index < 0)
                                    labels.push(pointX);
                            }
                            else {
                                if (m == 0)
                                    labels[n] = pointX;
                                else
                                    labels[n] = labels[n] + ", " + pointX;
                            }

                        }
                        if (!axis.maxPointLength || axis.maxPointLength < pointsLength)
                            axis.maxPointLength = pointsLength;
                    }
                    for (var l = 0; l < seriesCollection.length; l++) {
                        seriesCollection[l]._pointCollection = [];
                        for (var k = 0; k < seriesCollection[l].points.length; k++) {
                            seriesCollection[l]._pointCollection.push(seriesCollection[l].points[k].x);
                            if (seriesCollection[l]._xAxisValueType == "date")
                                pointX = ej.format(new Date(seriesCollection[l].points[k].x), (ej.util.isNullOrUndefined(axis.labelFormat) ? "dd/MM/yyyy" : axis.labelFormat), locale);
                            else
                                pointX = seriesCollection[l].points[k].x;
                            if (!isIndex)
                                seriesCollection[l].points[k].xValue = $.inArray(pointX, labels);
                            else
                                seriesCollection[l].points[k].xValue = k;

                        }
                        seriesCollection[l].minX = 0;
                        seriesCollection[l].maxX = (seriesCollection[l]._xAxisValueType == "date") ? seriesCollection[l]._pointCollection.length - 1 : labels.length - 1;
                        // To find maximum x value of axis from series collection
                        if (l == 0) {
                            maxXValue.maxX = seriesCollection[l].maxX;
                            axis.labels = (seriesCollection[l]._xAxisValueType == "date") ? seriesCollection[l]._pointCollection : labels;
                            axis._categoryValueType = seriesCollection[l]._xAxisValueType;
                        }
                        if (maxXValue.maxX < (seriesCollection[l].maxX)) {
                            maxXValue.maxX = seriesCollection[l].maxX;
                            axis.labels = [];
                            axis.labels = labels;
                        }
                    }
                    if (this.chartObj.model.indicatorRange && this.chartObj.model.indicatorRange[axis.name]) {
                        var value = this.chartObj.model.indicatorRange[axis.name];
                        if (maxXValue.minX > value.min || maxXValue.minX == null)
                            maxXValue.minX = value.min;
                        if (maxXValue.maxX < value.max || maxXValue.maxX == null)
                            maxXValue.maxX = value.max;
                    }

                    deltaX = maxXValue.maxX - maxXValue.minX;

                    if (axis.setRange && axis.range.interval) {
                        intervalX = Math.ceil(axis.range.interval);
                    }
                    else {
                        intervalX = this._calculateActualInterval(deltaX, axis);
                    }

                    axis.range = { min: maxXValue.minX, max: maxXValue.maxX, interval: intervalX, Delta: deltaX };
                }
                else {
                    var labelLength = axis.labels.length;
                    if (labelLength > 0) {
                        deltaX = labelLength - 1;
                        intervalX = this._calculateActualInterval(deltaX, axis);
                        axis.range = { min: 0, max: labelLength - 1, interval: intervalX, Delta: deltaX };
                    }
                    else if (!axis.range) // set default range when no series points added to category axes
                        axis.range = { min: 0, max: 6, interval: 1, Delta: 6 };
                }
            }
            var rowCount = 0, r, intersectAction = axis.labelIntersectAction, labelRotation = axis.labelRotation;
            if ((intersectAction != "rotate45" || intersectAction != "rotate90") && (labelRotation == 0 || labelRotation == null)) {
                for (r = 0; r < axis.labels.length; r++) {
                    if (typeof axis.labels[r] == "string") {
                        var labelLength = (axis.labels[r].split('<br>')).length;
                        rowCount = Math.max(labelLength, rowCount);
                    }
                }
            }
            axis.rowsCount = rowCount;
        },

        //Calculates actual interval
        _calculateActualInterval: function (delta, axis) {
            if (axis.categoryInterval == null)
                return Math.max(1, Math.floor(delta / this.GetActualDesiredIntervalsCount(axis, axis.length)));
            else
                return axis.categoryInterval;
        },

        //Apply padding based on labelPlacement
        _applyRangePadding: function (axis) {
            if (!this.chartObj.zoomed && !this.chartObj._scrollBarEnabled && !axis.zoomed) {
                // ticks based on labelplacement and polaraxes
                var ticks = 0;
                if (this.chartObj.model.AreaType !== 'polaraxes')
                    ticks = ((axis.labelPlacement === null || axis.labelPlacement === undefined || axis.labelPlacement === "")) ? -0.5 : (axis.labelPlacement.toLowerCase() == "betweenticks") ? (-0.5) : 0;
                if (!this.chartObj.scrollsvgObj) {
                    if (ticks < 0) {
                        axis.range.min = axis.range.min + ticks;
                        axis.range.max = axis.range.max - ticks;
                        axis.range.delta = axis.range.max - axis.range.min;
                        axis.actualRange = axis.range;
                    } else {
                        var data = _sideBySeriesPadding(this.chartObj, axis.range.min, axis.range.max, axis);
                        axis.range.min = data.startPadding;
                        axis.range.max = data.endPadding;
                        axis.range.delta = axis.range.max - axis.range.min;
                        axis.actualRange = axis.range;
                    }
                }
            }
            this._calculateVisibleRange(axis);
        },

        //Calculates the visible range  
        _calculateVisibleRange: function (axis, sender, isScroll) {
            this.chartObj = sender ? sender : this.chartObj;
            axis.visibleRange = (!isScroll) ? $.extend(true, {}, axis.actualRange) : axis.visibleRange;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && this.chartObj.model.AreaType != "polaraxes" && !this.chartObj.model.disableZoom) {
                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : (axis.zoomFactor < 0 ? 0 : axis.zoomFactor);
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : (axis.zoomPosition > 1 ? 1 : axis.zoomPosition);
                var baseRange = axis.actualRange;
                if (axis.isInversed) {
                    var start = axis.actualRange.max - axis.zoomPosition * axis.actualRange.delta;
                    var end = start - axis.zoomFactor * axis.actualRange.delta;
                }
                else {
                    var start = axis.actualRange.min + (axis.zoomPosition * axis.actualRange.delta);
                    var end = start + axis.zoomFactor * axis.actualRange.delta;
                }

                if (start < baseRange.min) {
                    end = end + (baseRange.min - start);
                    start = baseRange.min;
                }

                if (end > baseRange.max) {
                    start = start - (end - baseRange.max);
                    end = baseRange.max;
                }
                var delta = Math.abs(end - start);
                var interval = this._calculateActualInterval(delta, axis);
                var min = Math.min(start, end);
                var max = Math.max(start, end);
                if (isScroll) {
                    return { min: min, max: max, interval: interval };
                }
                else {
                    var delta = Math.abs(end - start);
                    axis.visibleRange.interval = interval;
                    axis.visibleRange.min = min;
                    axis.visibleRange.max = max;
                    axis.visibleRange.delta = delta;
                    axis.zoomed = (this.chartObj.zoomed === null || this.chartObj.zoomed === undefined) ? true : this.chartObj.zoomed;
                }
            }

        },

        //Generate category label for axis
        _calculateAxisLabels: function (axis) {
            var interval = axis.visibleRange.interval;
            var position = axis.visibleRange.min - (axis.visibleRange.min % axis.range.interval);
            for (; position <= axis.visibleRange.max; position += interval) {
                if (ej.EjSvgRender.utils._inside(position, axis.visibleRange)) {
                    var pos = Math.round(position);
                    axis.visibleLabels.push({ Value: pos, Text: ej.EjSvgRender.utils._getLabelContent(pos, axis, this.chartObj.model.locale) });

                    // customize label by event
                    var commonAxesEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonAxesEventArgs.data = { label: axis.visibleLabels[axis.visibleLabels.length - 1], axis: axis };
                    this.chartObj._trigger("axesLabelRendering", commonAxesEventArgs);
                    axis.visibleLabels[axis.visibleLabels.length - 1] = commonAxesEventArgs.data.label;
                }
            }
            axis._LableMaxWidth = ej.EjSvgRender.utils._getMaxLabelWidth(axis, this.chartObj);
        },

        //Category axis calculation
        _calculateRanges: function (chartObj, axis, seriesCollection) {
            this.chartObj = chartObj;
            this._saveRange(chartObj, axis);
            this._calculateCategoryRange(axis, seriesCollection);
            axis._range = axis.range;
            if (chartObj.model._drawTrendline)
                this._calculateTrendLineRange(chartObj, axis, seriesCollection);
            this._applyRangePadding(axis);

            this._calculateAxisLabels(axis);
        }
    });
    ej.axisTypes.category = ejCategoryValue;

    // for Datetime category axis calculation

    var ejDateTimeCategory = ejExtendClass(ej.EjAxisRenderer, {
        _calculateDateTimeCategoryRange: function (axis, seriesCollection) {
            ///Variables declaration part here ///
            var xRange = { minX: 0, MaxX: null }, xLabels = [], xValue = [], xPoint, index, index1, deltaX, intervalX,
                prevDateVal, points, xVerfiedPoints = [], dateDouble, xValues = [], dateLabels = [],
                xDateVal, xVal, previous, current, pointsLength, point, m, pt, ser;
            for (ser = 0; ser < seriesCollection.length; ser++) {
                seriesCollection[ser]._pointCollection = [], points = [], seriesCollection[ser]._points = [], seriesCollection[ser]._xPoints = [], seriesCollection[ser]._yPoints = [],
                    pointsLength = seriesCollection[ser].points.length;
                for (pt = 0; pt < pointsLength; pt++) {
                    dateDouble = !isNaN(new Date(seriesCollection[ser].points[pt].x).getTime()) ? new Date(seriesCollection[ser].points[pt].x).getTime() : null;
                    if (points.indexOf(dateDouble) != -1) {
                        seriesCollection[ser].points[pt].xValue = points.indexOf(dateDouble);
                    }
                    points.push(dateDouble);
                    seriesCollection[ser]._xPoints.push(dateDouble);
                    seriesCollection[ser]._yPoints.push(seriesCollection[ser].points[pt].y);
                    if (dateDouble != null)
                        xValues.push(dateDouble);
                }
                if (ej.isNullOrUndefined(axis.intervalType)) {
                    intervalX = this.calculateDateTimeNiceInterval(axis, new Date(Math.min.apply(null, xValues)), new Date(Math.max.apply(null, xValues)));
                    axis.intervalType = intervalX.intervalType.toLowerCase();
                }
                for (point = 0; point < points.length; point++) {
                    xPoint = new Date(points[point]);
                    if (seriesCollection[ser]._points.indexOf(xPoint.getTime()) == -1)
                        seriesCollection[ser]._points.push(xPoint.getTime());
                    var ySortPos = $.inArray(points[point], seriesCollection[ser]._xPoints);
                    seriesCollection[ser]._pointCollection.push(new Date(seriesCollection[ser].points[point].x));
                    if (ser == 0) {
                        if (seriesCollection[ser].points[point].x == seriesCollection[ser].points[point].xValue)
                            seriesCollection[ser].points[point].xValue = point;
                    }
                    else {
                        for (var i = 0; i < ser; i++) {
                            index1 = $.inArray(new Date(seriesCollection[ser].points[point].x).getTime(), seriesCollection[i]._points);
                            if (index1 >= 0) {
                                if (i == 0)
                                    seriesCollection[ser].points[point].xValue = index1;
                                else {
                                    seriesCollection[ser].points[point].xValue = seriesCollection[i].points[index1].xValue;
                                }
                                break;
                            }
                            else if (i == ser - 1) {
                                if (seriesCollection[ser].points[point].x == seriesCollection[ser].points[point].xValue) {
                                    seriesCollection[ser].points[point].xValue = axis.maxPointLength++;
                                }
                                else {
                                    var ind = seriesCollection[ser].points[point].xValue;
                                    seriesCollection[ser].points[point].xValue = seriesCollection[ser].points[ind].xValue;
                                }
                                break;
                            }
                        }
                    }
                    index = (ser == 0) ? -1 : $.inArray(xPoint.getTime(), xVerfiedPoints);
                    switch (axis.intervalType) {
                        case "auto": // for auto calculate
                            if (xLabels.indexOf(xPoint.getTime()) == -1)
                                xLabels.push(xPoint.getTime());
                            break;
                        case "years":  // for years calculate
                            xVal = xPoint.getFullYear();
                            break;
                        case "months":  // for months calculate
                            current = xPoint.getFullYear();
                            xDateVal = xPoint.getMonth();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getFullYear();
                                xVal += (current != previous) ? ((12 - prevDateVal) + (xDateVal)) : (xDateVal - prevDateVal);
                            }
                            prevDateVal = xDateVal;
                            break;
                        case "days":  // for days calculate
                            current = xPoint.getMonth();
                            xDateVal = xPoint.getDate();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getMonth();
                                xVal += (current != previous) ? (((new Date(xPoint.getFullYear(), previous, 1).getDate() - prevDateVal) + (xDateVal))) : (xDateVal - prevDateVal);
                                if (current == previous) {
                                    var diff = this._diffDate(xPoint, new Date(points[point - 1]), 1);
                                    var days = (new Date(xPoint.getFullYear(), previous, 0).getDate());
                                    xVal = (diff > days) ? (xValue[xValue.length - 1]) + 1 : xVal;
                                }
                            }
                            prevDateVal = xDateVal;
                            break;
                        case "hours":  // for hours calculate
                            current = xPoint.getDate();
                            xDateVal = xPoint.getHours();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getDate();
                                xVal += (current != previous) ? ((24 - prevDateVal) + (xDateVal)) : (xDateVal - prevDateVal);
                                if (current == previous) {
                                    var diff = this._diffDate(xPoint, new Date(points[point - 1]), 24);
                                    xVal = (diff > 24) ? (xValue[xValue.length - 1]) + 1 : xVal;
                                }
                            }
                            prevDateVal = xDateVal;
                            break;
                        case "minutes": // for minutes calculate
                            current = xPoint.getHours();
                            xDateVal = xPoint.getMinutes();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getHours();
                                xVal += (current != previous) ? ((60 - prevDateVal) + (xDateVal)) : (xDateVal - prevDateVal);
                                if (current == previous) {
                                    var diff = this._diffDate(xPoint, new Date(points[point - 1]), (24 * 60));
                                    xVal = (diff > 60) ? (xValue[xValue.length - 1]) + 1 : xVal;
                                }
                            }
                            prevDateVal = xDateVal;
                            break;
                        case "seconds": // for seconds calculate
                            current = xPoint.getMinutes();
                            xDateVal = xPoint.getSeconds();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getMinutes();
                                xVal += (current != previous) ? ((60 - prevDateVal) + (xDateVal)) : (xDateVal - prevDateVal);
                                if (current == previous) {
                                    var diff = this._diffDate(xPoint, new Date(points[point - 1]), (24 * 60 * 60));
                                    xVal = (diff > 60) ? (xValue[xValue.length - 1]) + 1 : xVal;
                                }
                            }
                            prevDateVal = xDateVal;
                            break;
                        case "milliseconds": // for milliseconds calculate
                            current = xPoint.getSeconds();
                            xDateVal = xPoint.getMilliseconds();
                            if (point <= 0) xVal = point + 1;
                            else {
                                previous = new Date(points[point - 1]).getSeconds();
                                xVal += (current != previous) ? ((1000 - prevDateVal) + (xDateVal)) : (xDateVal - prevDateVal);
                                if (current == previous) {
                                    var diff = this._diffDate(xPoint, new Date(points[point - 1]), (24 * 60 * 60 * 1000));
                                    xVal = (diff > 1000) ? (xValue[xValue.length - 1]) + 1 : xVal;
                                }
                            }
                            prevDateVal = xDateVal;
                            break;
                    }
                    if (axis.intervalType != "auto" && xLabels.indexOf(xPoint.getTime()) == -1)
                        xLabels.push(xPoint.getTime());
                    xVal = (ser == 0) ? xVal : xValue[xValue.length - 1] + xVal;
                    if (xValue.indexOf(xVal) == -1)
                        xValue.push(xVal);
                    dateLabels.push(xVal);
                    xVerfiedPoints.push(new Date(points[point]).getTime());
                }
                if (!axis.maxPointLength) {
                    if (axis.intervalType != "auto")
                        axis.maxPointLength = xValue.length;
                    else
                        axis.maxPointLength = xLabels.length;
                }
            }
            for (m = 0; m < seriesCollection.length; m++) { // set the min and max range for axis
                if (!axis.setRange) axis.range = { min: null, max: null, interval: null };
                if (!ej.isNullOrUndefined(axis.m_minPointsDelta)) axis.m_minPointsDelta = undefined;
                seriesCollection[m].minX = (ej.isNullOrUndefined(axis.range.min)) ? 0 : (axis.range.min < xRange.minX) ? 0 : axis.range.min;
                seriesCollection[m].maxX = (ej.isNullOrUndefined(axis.range.max)) ? xLabels.length - 1 : (axis.range.max > xLabels.length - 1) ? xLabels.length - 1 : axis.range.max;
                xRange.MaxX = seriesCollection[m].maxX;
                xRange.minX = seriesCollection[m].minX;
                axis.labels = xLabels;
                axis.dateLabels = dateLabels;
                axis._categoryValueType = "date";
            }
            if (xRange.minX == xRange.MaxX && axis.labelPlacement.toLowerCase() == "onticks") xRange.MaxX += 1;
            if (seriesCollection.length > 0) {
                deltaX = xRange.MaxX - xRange.minX;
                intervalX = ((axis.range.interval == null || axis.range.interval == undefined)) ? 1 : (axis.range.interval < 1) ? 1 : Math.ceil(axis.range.interval);
                axis.range = { min: xRange.minX, max: xRange.MaxX, interval: intervalX, Delta: deltaX };
            }
            else if (!axis.setInterval) {
                axis.range = { min: 0, max: 6, interval: 1, Delta: 6 };
                axis.dateLabels = [];
                for (var i = 0; i <= axis.range.max; i++) {
                    axis.labels.push("");
                    axis.dateLabels.push("");
                }
            }
        },

        _diffDate: function (currentPoint, previousPoint, mul) {
            var oneDay, diff;
            oneDay = 24 * 60 * 60 * 1000;
            diff = (Math.abs((currentPoint.getTime() - previousPoint.getTime())) / (oneDay));
            return (Math.round(diff * mul));
        },

        _calculateAxisLabels: function (axis) // calculate visible labels for axis
        {
            var interval = axis.visibleRange.interval, currentLabels = [], count = 0, seriesCollection = this.chartObj.model.series.length,
                prevLabelVal, pos, arr, currentLabel, expectLabel, index, i, isCurrentLabel, isNextLabel, commonAxesEventArgs;
            var position = axis.visibleRange.min - (axis.visibleRange.min % axis.range.interval);
            for (; position <= axis.visibleRange.max; position += interval) {
                if (ej.EjSvgRender.utils._inside(position, axis.visibleRange)) {
                    pos = Math.round(position);
                    arr = axis.dateLabels;
                    //Commented for the issue JS-55566
                    //if (axis.intervalType != "auto") {
                    //    if (count > 0 && interval > 1) {
                    //        if (pos > arr.length - 1)
                    //            pos = arr.length - 1;
                    //        currentLabel = arr[count];
                    //        expectLabel = prevLabelVal + interval;
                    //        isCurrentLabel = $.inArray(currentLabel, arr);
                    //        isNextLabel = $.inArray(expectLabel, arr);
                    //        if (isCurrentLabel > 0 && (Math.abs(currentLabel - prevLabelVal) == interval) && currentLabel > prevLabelVal) {
                    //            pos = isCurrentLabel;
                    //            prevLabelVal = arr[pos];
                    //        }
                    //        else {
                    //            for (i = 0; i < i + 1; i++) {
                    //                expectLabel += (i == 0) ? i : 1;
                    //                isNextLabel = $.inArray(expectLabel, arr);
                    //                if (isNextLabel > 0) {
                    //                    pos = isNextLabel;
                    //                    prevLabelVal = arr[pos];
                    //                    break;
                    //                }
                    //            }
                    //        }
                    //    }
                    //}
                    //count++;
                    if (!ej.util.isNullOrUndefined(arr)) {
                        if (((arr[arr.length - 1] - arr[pos]) >= interval) && (axis.visibleRange.max < (position + interval))) axis.visibleRange.max += ((position + interval) - axis.visibleRange.max);
                        index = $.inArray(arr[pos], currentLabels);
                    }
                    if ((index < 0 || axis.intervalType == "auto" || seriesCollection == 0) && (pos < axis.labels.length)) {
                        if (axis.intervalType != "auto") {
                            prevLabelVal = arr[pos];
                            currentLabels.push(prevLabelVal);
                        }
                        axis.visibleLabels.push({ Value: pos, Text: ((!(axis.labelFormat) && axis.labels[Math.floor(pos)] != "") ? ej.format(new Date(axis.labels[Math.floor(pos)]), ej.EjSvgRender.utils._dateTimeLabelFormat(axis.intervalType, axis), this.chartObj.model.locale) : ej.EjSvgRender.utils._getLabelContent(pos, axis, this.chartObj.model.locale)) });
                        commonAxesEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                        commonAxesEventArgs.data = { label: axis.visibleLabels[axis.visibleLabels.length - 1], axis: axis };
                        this.chartObj._trigger("axesLabelRendering", commonAxesEventArgs);
                        axis.visibleLabels[axis.visibleLabels.length - 1] = commonAxesEventArgs.data.label;
                    }
                }
            }
            axis._LableMaxWidth = ej.EjSvgRender.utils._getMaxLabelWidth(axis, this.chartObj);
        },

        //Calculates actual interval
        _calculateActualInterval: function (delta, axis) {
            if (axis.categoryInterval == null)
                return Math.max(1, Math.floor(delta / this.GetActualDesiredIntervalsCount(axis, axis.length)));
            else
                return axis.categoryInterval;
        },

        //Apply padding based on labelPlacement
        _applyRangePadding: function (axis) {
            if (!this.chartObj.zoomed && !this.chartObj._scrollBarEnabled) {
                // ticks based on labelplacement and polaraxes
                var ticks = 0;
                if (this.chartObj.model.AreaType !== 'polaraxes')
                    ticks = ((axis.labelPlacement === null || axis.labelPlacement === undefined)) ? -0.5 : (axis.labelPlacement.toLowerCase() == "betweenticks") ? (-0.5) : 0;
                if (ticks < 0) {
                    axis.range.min = axis.range.min + ticks;
                    axis.range.max = axis.range.max - ticks;
                    axis.range.delta = axis.range.max - axis.range.min;
                    axis.actualRange = axis.range;
                } else {
                    var data = _sideBySeriesPadding(this.chartObj, axis.range.min, axis.range.max, axis);
                    axis.range.min = data.startPadding;
                    axis.range.max = data.endPadding;
                    axis.range.delta = axis.range.max - axis.range.min;
                    axis.actualRange = axis.range;
                }
            }
            this._calculateVisibleRange(axis);
        },

        //Calculates the visible range  
        _calculateVisibleRange: function (axis, sender, isScroll) {
            this.chartObj = sender ? sender : this.chartObj;
            axis.visibleRange = (!isScroll) ? $.extend(true, {}, axis.actualRange) : axis.visibleRange;
            if ((axis.zoomFactor < 1 || axis.zoomPosition > 0) && this.chartObj.model.AreaType != "polaraxes" && !this.chartObj.model.disableZoom) {
                axis.zoomFactor = axis.zoomFactor > 1 ? 1 : (axis.zoomFactor < 0 ? 0 : axis.zoomFactor);
                axis.zoomPosition = axis.zoomPosition < 0 ? 0 : (axis.zoomPosition > 1 ? 1 : axis.zoomPosition);
                var baseRange = axis.actualRange;
                if (axis.isInversed) {
                    var start = axis.actualRange.max - axis.zoomPosition * axis.actualRange.delta;
                    var end = start - axis.zoomFactor * axis.actualRange.delta;
                }
                else {
                    var start = axis.actualRange.min + (axis.zoomPosition * axis.actualRange.delta);
                    var end = start + axis.zoomFactor * axis.actualRange.delta;
                }

                if (start < baseRange.min) {
                    end = end + (baseRange.min - start);
                    start = baseRange.min;
                }

                if (end > baseRange.max) {
                    start = start - (end - baseRange.max);
                    end = baseRange.max;
                }
                var delta = Math.abs(end - start);
                var interval = this._calculateActualInterval(delta, axis);
                var min = Math.min(start, end);
                var max = Math.max(start, end);
                if (isScroll) {
                    return { min: min, max: max, interval: interval };
                }
                else {
                    var delta = Math.abs(end - start);
                    axis.visibleRange.interval = interval;
                    axis.visibleRange.min = min;
                    axis.visibleRange.max = max;
                    axis.visibleRange.delta = delta;
                    axis.zoomed = (this.chartObj.zoomed === null || this.chartObj.zoomed === undefined) ? true : this.chartObj.zoomed;
                }
            }

        },

        _calculateRanges: function (chartObj, axis, seriesCollection) {
            this.chartObj = chartObj;
            this._saveRange(chartObj, axis);
            this._calculateDateTimeCategoryRange(axis, seriesCollection);
            if (chartObj.model._drawTrendline)
                this._calculateTrendLineRange(chartObj, axis, seriesCollection);
            axis._range = axis.range;
            this._applyRangePadding(axis);
            this._calculateAxisLabels(axis);
        }
    });

    ej.axisTypes.datetimecategory = ejDateTimeCategory;

    ej.EjAxisRenderer.prototype = {
        _drawGridLines: function (axisIndex, axis, params) {
            if (this.model.AreaType == "cartesianaxes") {
                if (axis.orientation.toLowerCase() == "horizontal")
                    this._drawXAxisGridLine(axisIndex, axis, params);

                else
                    this._drawYAxisGridLine(axisIndex, axis, params);
            }
            else {
                if (axis.orientation.toLowerCase() == "horizontal" && axisIndex == 0) {
                    this._drawPolarGridLine(axis);
                    this._drawPolarLabels(axis);

                }
                else if (axisIndex == 1)
                    this._drawPolarCircle(axis);
            }
        },
        _drawAxes: function (axisIndex, axis) {

            if (this.model.AreaType == "cartesianaxes") {
                if (axis.visible && axis.orientation.toLowerCase() == "horizontal") {
                    this._drawXAxisLabels(axisIndex, axis);
                    this._drawXTitle(axisIndex, axis);
                }

                if (axis.visible && axis.orientation.toLowerCase() == "vertical") {
                    this._drawYAxisLabels(axisIndex, axis);
                    this._drawYTitle(axisIndex, axis);
                }
            }
        },
        _getSharpPath: function (width) {
            var value = ((width % 2) == 0) ? 0 : 0.5;
            return value;
        },
        _drawAxisLine: function (axis) {

            // Yaxis MajorGridlines, Ticklines and Labels.
            var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisLine' });
            var sbYMajorTick = ej.EjSvgRender.utils._getStringBuilder();
            var x1 = this.model.centerX;
            var y1 = this.model.centerY;
            var x2 = this.model.centerX;
            var y2 = this.model.centerY - this.model.Radius;
            var axisLine = "M" + " " + x1 + " " + y1 + " " + "L" + " " + x2 + " " + y2;
            if (axis.visible && axis.axisLine.visible) {
                var options = {
                    'id': this.svgObject.id + '_YAxisLines',
                    'fill': 'none',
                    'stroke-width': axis.axisLine.width,
                    'stroke': axis.axisLine.color,
                    'opacity': axis.axisLine.opacity,
                    'stroke-dasharray': axis.axisLine.dashArray,
                    'd': axisLine
                };
                this.svgRenderer.drawPath(options, gEle);

                //Drawing Major Grid Lines 
                $(gEle).appendTo(this.gPolarAxisEle);
            }


            if (axis.visible && axis.majorTickLines.visible) {
                gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisMajorTicks' });
                for (var j = 0; j < axis.visibleLabels.length; j++) {
                    var label = axis.visibleLabels[j];
                    var radius = this.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(axis, label.Value, this);
                    var line = {};
                    line.X1 = this.model.centerX;
                    line.Y1 = this.model.centerY - radius;
                    line.X2 = line.X1 - axis.majorTickLines.size;
                    line.Y2 = line.Y1;
                    sbYMajorTick.append("M" + " " + line.X1 + " " + line.Y1 + " " + "L" + " " + line.X2 + " " + line.Y2 + " ");
                }

                var yMajorTickDir = sbYMajorTick.toString();
                var options = {
                    'id': this.svgObject.id + '_YAxisMajorTicks',
                    'fill': 'none',
                    'stroke-width': axis.majorTickLines.width,
                    'stroke': axis.majorTickLines.color,
                    'd': yMajorTickDir
                };
                //Drawing Major Tickline Lines
                this.svgRenderer.drawPath(options, gEle);
                $(gEle).appendTo(this.gPolarAxisEle);

            }
            if (axis.visible) {
                var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisLabels' }),
                    font = axis.font,
                    bounds,
                    regionX,
                    labelsLength = axis.visibleLabels.length;
                for (var j = 0; j < labelsLength; j++) {
                    var radius = (this.model.Radius || this.model._radius) * ej.EjSvgRender.utils._valueToCoefficient(axis, axis.visibleLabels[j].Value, this);
                    var labelText = axis.visibleLabels[j].Text;

                    var size = ej.EjSvgRender.utils._measureText(labelText, null, axis.font);

                    var X = this.model.centerX - axis.majorTickLines.size - (this.model.elementSpacing / 3);
                    var Y = this.model.centerY - radius + (size.height / 5);


                    var options = {
                        'id': this.svgObject.id + '_' + axis.name + '_YLabel_' + j,
                        'x': X,
                        'y': Y,
                        'fill': font.color,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': 'end'
                    };

                    this.svgRenderer.drawText(options, labelText, gEle);
                    regionX = options.x - size.width;
                    bounds = { x: regionX, y: options.y, width: size.width, height: size.height };
                    axis.visibleLabels[j].region = { bounds: bounds, labelText: labelText };
                }
                //Drawing YAxis Labels
                $(gEle).appendTo(this.gPolarAxisEle);
            }


        },
        _drawPolarLabels: function (axis) {
            if (!axis.visible)
                return 0;
            var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisLabels' }),
                aroundRadius = this.model.Radius + axis.majorTickLines.size,
                font = axis.font,
                length = axis.visibleLabels.length,
                firstLabelX,
                bounds,
                regionX,
                lastLabelX;
            for (var j = 0; j < length; j++) {
                var coef = ej.EjSvgRender.utils._valueToPolarCoefficient(axis, axis.visibleLabels[j].Value);

                var vector = ej.EjSvgRender.utils._valueToVector(axis, axis.visibleLabels[j].Value);
                if (!isNaN(vector.X) && !isNaN(vector.Y)) {
                    var labelText = axis.visibleLabels[j].Text;
                    var x = this.model.centerX + aroundRadius * vector.X;
                    var y = this.model.centerY + aroundRadius * vector.Y;
                    var textAnchor = (x < this.model.centerX) ? 'end' : ((x > this.model.centerX) ? 'start' : 'middle');

                    var size = ej.EjSvgRender.utils._measureText(labelText, this.model.m_AreaBounds.Height, axis.font);
                    // calculation for positioning the label along the arc
                    if (coef == 0.25) {
                        x -= this.model.elementSpacing / 2;
                        y += (size.height) / 4;
                    }
                    else if (coef == 0.5) {
                        y += (size.height);
                    }
                    else if (coef == 0.75) {
                        x += this.model.elementSpacing / 2;
                        y += (size.height) / 4;
                    }
                    else if (coef == 1 || coef == 0) {
                        y -= (size.height) / 2;
                    }

                    else if (0.25 < coef && coef < 0.5) {
                        x -= this.model.elementSpacing / 2;
                        y += (size.height) / 2;
                    }
                    else if (0.5 < coef && coef <= 0.75) {
                        x += this.model.elementSpacing / 2;
                        y += (size.height) / 2;
                    }
                    else if (0 < coef && coef < 0.25) {
                        x -= this.model.elementSpacing / 2;
                    }
                    else
                        x += this.model.elementSpacing / 2;

                    if (j == 0) {
                        firstLabelX = x;
                    }
                    if (j == length - 1 && axis._valueType != "category") {
                        lastLabelX = ej.EjSvgRender.utils._measureText(labelText, null, font).width;
                        lastLabelX += x;
                        if (lastLabelX > firstLabelX)
                            labelText = ""; //Hide the last overlapping labels
                    }
                    var options = {
                        'id': this.svgObject.id + '_' + axis.name + '_XLabel_' + j,
                        'x': x,
                        'y': y,
                        'fill': font.color,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': textAnchor
                    };

                    this.svgRenderer.drawText(options, labelText, gEle);
                    if (textAnchor == "middle")
                        regionX = options.x - size.width / 2;

                    else if (textAnchor == "end")
                        regionX = options.x - size.width;
                    else
                        regionX = options.x;

                    bounds = { x: regionX, y: options.y, width: size.width, height: size.height };
                    axis.visibleLabels[j].region = { bounds: bounds, labelText: labelText };
                }
            }

            $(gEle).appendTo(this.gXaxisEle);

        },
        _drawPolarCircle: function (axis) {
            if (axis.majorGridLines.visible) {
                var sbYMajorGrid = ej.EjSvgRender.utils._getStringBuilder();
                var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisGrid' });
                if (this.model.isPolar) {
                    for (var j = 0; j < axis.visibleLabels.length; j++) {
                        var label = axis.visibleLabels[j];
                        var radius = this.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(axis, label.Value, this);

                        var options = {
                            'id': this.svgObject.id + '_YAxisGridLines_' + j,
                            'cx': this.model.centerX,
                            'cy': this.model.centerY,
                            'r': radius,
                            'fill': 'transparent',
                            'stroke-width': axis.majorGridLines.width,
                            'stroke': axis.majorGridLines.color,
                            'opacity': (this.vmlRendering) ? 0.3 : axis.majorGridLines.opacity
                        };

                        //Drawing Major Grid Lines for polar
                        this.svgRenderer.drawCircle(options, gEle);

                    }
                }
                else {
                    for (var j = 0; j < axis.visibleLabels.length; j++) {

                        var label = axis.visibleLabels[j];
                        var radius = this.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(axis, label.Value, this);
                        // calculation for spider web
                        for (var i = 0; i < this.model._axes[0].visibleLabels.length; i++) {
                            var xAxis = this.model._axes[0];
                            var vector = ej.EjSvgRender.utils._valueToVector(xAxis, xAxis.visibleLabels[i].Value);
                            if (!isNaN(vector.X) && !isNaN(vector.Y)) {
                                var vector2;
                                if ((i + 1) < xAxis.visibleLabels.length) {
                                    vector2 = ej.EjSvgRender.utils._valueToVector(xAxis, xAxis.visibleLabels[i + 1].Value);
                                }
                                else {
                                    vector2 = ej.EjSvgRender.utils._valueToVector(xAxis, xAxis.visibleLabels[0].Value);
                                }
                                var connectPoint = { X: this.model.centerX + radius * vector.X, Y: this.model.centerY + radius * vector.Y };
                                var endPoint = { X: this.model.centerX + radius * vector2.X, Y: this.model.centerY + radius * vector2.Y };
                                sbYMajorGrid.append("M" + " " + connectPoint.X + " " + connectPoint.Y + " " + "L" + " " + endPoint.X + " " + endPoint.Y + " ");
                            }
                        }
                    }
                    if (axis.majorGridLines.visible) {
                        var yMajorGridDir = sbYMajorGrid.toString();
                        var options = {
                            'id': this.svgObject.id + '_YAxisGridLines',
                            'fill': 'none',
                            'stroke-width': axis.majorGridLines.width,
                            'stroke': axis.majorGridLines.color,
                            'opacity': axis.majorGridLines.opacity,
                            'stroke-dasharray': axis.majorGridLines.dashArray,
                            'd': yMajorGridDir
                        };
                        //Drawing Major Grid Lines for radar
                        this.svgRenderer.drawPath(options, gEle);
                    }
                }
            }
            $(gEle).appendTo(this.gYaxisEle);

        },
        _drawPolarGridLine: function (axis) {

            var chartModel = this.model,
                legend = chartModel.legend,
                legendTitleHeight = ej.EjSvgRender.utils._measureText(legend.title.text, null, legend.title.font).height,
                legendPosition = legend.position.toLowerCase(),
                legXSpace = 0,
                legYSpace = 0,
                sbXMajorGrid = ej.EjSvgRender.utils._getStringBuilder(),
                sbXMajorTick = ej.EjSvgRender.utils._getStringBuilder(),
                borderSize = legend.border.width,
                yOffset, actualWidth, actualHeight,
                isRadar = false, vector, line, xMajorGridDir, xMajorTickDir,
                length = axis.visibleLabels.length,
                chartBorder = chartModel.border.width,
                title = chartModel.title,
                subTitle = chartModel.title.subTitle,
                titleEnable = title.enableTrim && (title.textOverflow == 'wrap' || title.textOverflow == 'wrapandtrim') ? true : false,
                subTitleEnable = subTitle.text != "" && subTitle.visible && subTitle.enableTrim && (subTitle.textOverflow == 'wrap' || subTitle.textOverflow == 'wrapandtrim') ? true : false;
            if (legend.visible && legendPosition != "custom") {
                if (legendPosition == "right" || legendPosition == "left")
                    legXSpace = ((legendPosition == "right") ? chartModel.margin.right : chartModel.margin.left) + chartModel.LegendActualBounds.Width + (borderSize + chartBorder) * 2;
                else
                    legYSpace = ((legendPosition == "top") ? chartModel.margin.top : chartModel.margin.bottom) + chartModel.LegendActualBounds.Height + legendTitleHeight + (borderSize + chartBorder) * 2;

            }
            // calculating the radius of the chart with avaible size
            yOffset = ((chartModel.title.text && chartModel.title.visible) ? chartModel._titleLocation.Y + (titleEnable ? chartModel._titleLocation.size.height : 0) + (subTitleEnable ? chartModel._subTitleLocation.size.height : 0) : 0) + legYSpace;

            actualWidth = chartModel.svgWidth - legXSpace;
            actualHeight = chartModel.svgHeight - yOffset;

            chartModel.centerX = actualWidth * 0.5 + ((legendPosition === "left") ? legXSpace : 0);
            chartModel.centerY = actualHeight * 0.5 + ((legendPosition === "top") ? yOffset : ((title.text && title.visible) ? (chartModel._titleLocation.Y + (titleEnable ? chartModel._titleLocation.size.height : 0) +
                (subTitleEnable ? chartModel._subTitleLocation.size.height : 0)) : 0));

            var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisGrid' });
            chartModel.finalSize = { width: actualWidth, height: actualHeight };

            chartModel.Radius = Math.min(chartModel.finalSize.width, chartModel.finalSize.height) / 2 - (2 * chartModel.elementSpacing) - axis.majorTickLines.size - axis._LableMaxWidth.maxHeight;

            var pos = 0;

            if (axis.majorGridLines.visible) {

                for (var j = 0; j < length; j++) {

                    vector = ej.EjSvgRender.utils._valueToVector(axis, axis.visibleLabels[j].Value);
                    line = {};
                    line.X1 = chartModel.centerX;

                    line.Y1 = chartModel.centerY;
                    line.X2 = chartModel.centerX + chartModel.Radius * vector.X;
                    line.Y2 = chartModel.centerY + chartModel.Radius * vector.Y;
                    sbXMajorGrid.append("M" + " " + line.X1 + " " + line.Y1 + " " + "L" + " " + line.X2 + " " + line.Y2 + " ");
                }

            }
            if (axis.visible && axis.majorTickLines.visible) {
                var radius = chartModel.Radius;
                for (var j = 0; j < length; j++) {
                    vector = ej.EjSvgRender.utils._valueToVector(axis, axis.visibleLabels[j].Value);
                    line = {};
                    line.X1 = chartModel.centerX + radius * vector.X;
                    line.Y1 = chartModel.centerY + radius * vector.Y;
                    line.X2 = line.X1 + axis.majorTickLines.size * vector.X;
                    line.Y2 = line.Y1 + axis.majorTickLines.size * vector.Y;
                    var direction = "M" + " " + line.X1 + " " + line.Y1 + " " + "L" + " " + line.X2 + " " + line.Y2 + " ";
                    if (direction.indexOf("NaN") == -1)
                        sbXMajorTick.append(direction);
                }
            }



            if (axis.majorGridLines.visible) {
                xMajorGridDir = sbXMajorGrid.toString();
                var options = {
                    'id': this.svgObject.id + '_XAxisGridLines',
                    'fill': 'none',
                    'stroke-width': axis.majorGridLines.width,
                    'stroke': axis.majorGridLines.color,
                    'opacity': axis.majorGridLines.opacity,
                    'stroke-dasharray': axis.majorGridLines.dashArray,
                    'd': xMajorGridDir
                };
                //Drawing XAxis Major Grid Lines
                if (xMajorGridDir.indexOf("NaN") == -1) {
                    this.svgRenderer.drawPath(options, gEle);
                    $(gEle).appendTo(this.gXaxisEle);
                }
            }

            if (axis.visible && axis.majorTickLines.visible) {
                xMajorTickDir = sbXMajorTick.toString();
                var options = {
                    'id': this.svgObject.id + '_XAxisMajorTicks',
                    'fill': 'none',
                    'stroke-width': axis.majorTickLines.width,
                    'stroke': axis.majorTickLines.color,
                    'd': xMajorTickDir
                };
                //Drawing XAxis Major Ticks Lines
                this.svgRenderer.drawPath(options, gEle);
                $(gEle).appendTo(this.gXaxisEle);
            }
        },
        _drawXAxisTickLine: function (axisIndex, xAxis, gEle, params) {
            var xMajorTicksDir, xMinorTicksDir;
            var sbXMinorTicks = ej.EjSvgRender.utils._getStringBuilder();
            var sbXMajorTicks = ej.EjSvgRender.utils._getStringBuilder();
            var minorPointX;
            var x1 = Math.floor(xAxis.x);
            var x2 = Math.floor(xAxis.x + xAxis.width);
            var opposedPosition = xAxis._opposed;
            var labelValue, xPointValue = [];
            var isScroll = xAxis._isScroll && !(xAxis.scrollbarSettings.pointsLength != null && xAxis.scrollbarSettings.pointsLength < xAxis.maxPointLength);
            var labelBorder = xAxis.labelBorder;
            var isCrossesAt = params.axes[xAxis.name]._validCross;
            if (axisIndex != 0 && !isCrossesAt && ((xAxis.labelPosition == 'inside' && xAxis.tickLinesPosition == 'inside') || (xAxis.labelPosition == 'inside' && xAxis.tickLinesPosition != 'inside')) && (!(xAxis.y == (this.model.m_AreaBounds.Height + this.model.m_AreaBounds.Y) || (xAxis.y == this.model.m_AreaBounds.Y)))) {
                var y1 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis._LableMaxWidth.height) : Math.floor(xAxis.y - xAxis._LableMaxWidth.height);
                var y2 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis._LableMaxWidth.height) : Math.floor(xAxis.y - xAxis._LableMaxWidth.height);
            }
            else if (axisIndex != 0 && !isCrossesAt && (xAxis.labelPosition != 'inside' && xAxis.tickLinesPosition == 'inside') && (!(xAxis.y == (this.model.m_AreaBounds.Height + this.model.m_AreaBounds.Y) || (xAxis.y == this.model.m_AreaBounds.Y)))) {
                var y1 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis.majorTickLines.size) : Math.floor(xAxis.y - xAxis.majorTickLines.size);
                var y2 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis.majorTickLines.size) : Math.floor(xAxis.y - xAxis.majorTickLines.size);
            }

            else {
                var y1 = y2 = (xAxis._y) ? (!xAxis.showNextToAxisLine) ? xAxis._y : xAxis.y : Math.floor(xAxis.y + xAxis.majorTickLines.size - 5);
            }
            if (!gEle)
                var gTickEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisTicklines' + '_' + axisIndex });
            xAxis.labelPlacement = (!(xAxis.labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.BetweenTicks : xAxis.labelPlacement;
            var ticksbwtLabel = ((xAxis.labels.length > 0) && (xAxis.labelPlacement.toLowerCase() == "betweenticks")) ? -0.5 : 0;
            var collectionLength = xAxis.visibleLabels.length;
            //For between ticks and gridlines
            if ((xAxis._valueType.toLowerCase() == ej.datavisualization.Chart.ValueType.Category) && ticksbwtLabel < 0) {
                collectionLength = collectionLength > 0 ? xAxis.visibleLabels.length + 1 : collectionLength;
            }
            for (var i = 0; i < collectionLength; i++) {

                labelValue = (!xAxis.visibleLabels[i]) ? xAxis.visibleLabels[i - 1].Value + xAxis.range.interval : xAxis.visibleLabels[i].Value;

                var tempInterval = ((xAxis.labels.length > 0) && (ticksbwtLabel < 0)) ? labelValue + ticksbwtLabel : labelValue;

                tempInterval = (!(xAxis.roundingPlaces)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(xAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(xAxis.visibleRange.interval)))) : tempInterval;

                if (ej.EjSvgRender.utils._inside(tempInterval, xAxis.visibleRange)) {

                    if ((xAxis.hidePartialLabels) && ((i == 0) || (i == (collectionLength - 1))))
                        continue;
                    if (xAxis.minorGridLines.visible || xAxis.minorTickLines.visible) {
                        var ticksVal = this._getSharpPath(xAxis.minorTickLines.width);
                        var linesVal = this._getSharpPath(xAxis.minorGridLines.width);
                        var yTickPosition;
                        if (xAxis._valueType == "logarithmic") {
                            minorTicks = tempInterval;
                            var logmax = xAxis.visibleRange.max;
                            var logmin = xAxis.visibleRange.min;

                            var logtickstart = Math.pow(xAxis.logBase, minorTicks - xAxis.visibleRange.interval);
                            var logtickend = Math.pow(xAxis.logBase, minorTicks);
                            var logtickInterval = (logtickend - logtickstart) / (xAxis.minorTicksPerInterval + 1);
                            var logtickPos = logtickstart + logtickInterval;
                            minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, xAxis.logBase);
                            for (var j = 0; j < xAxis.minorTicksPerInterval; j++) {


                                if (minorTicks < logmax && minorTicks > logmin) {

                                    minorPointX = Math.ceil(((minorTicks - logmin) / (logmax - logmin)) * (xAxis.width));

                                    //Calculate Minor Ticks
                                    if ((xAxis.minorTickLines) && xAxis.minorTickLines.visible) {
                                        var xTickPosition = Math.floor(minorPointX + x1);
                                        if ((xAxis.tickLinesPosition != 'inside' && xAxis.labelPosition != 'inside') || (xAxis.tickLinesPosition != 'inside' && xAxis.labelPosition == 'inside'))
                                            yTickPosition = (opposedPosition) ? Math.floor(y1 - xAxis.minorTickLines.size) : Math.floor(xAxis.minorTickLines.size + y1);
                                        else
                                            yTickPosition = (opposedPosition) ? Math.floor(y1 + xAxis.minorTickLines.size) : y1 - Math.floor(xAxis.minorTickLines.size);
                                        sbXMinorTicks.append("M" + " " + (xTickPosition + ticksVal) + " " + (yTickPosition + ticksVal) + " " + "L" + " " + (xTickPosition + ticksVal) + " " + (y1 + ticksVal) + " ");
                                    }
                                }
                            }
                        }
                        else {
                            for (var j = 0, minorTicks = tempInterval; j < xAxis.minorTicksPerInterval; j++) {
                                minorTicks += xAxis.visibleRange.interval / (xAxis.minorTicksPerInterval + 1);
                                if (minorTicks < xAxis.visibleRange.max && minorTicks > xAxis.visibleRange.min) {
                                    minorPointX = Math.ceil(((minorTicks - xAxis.visibleRange.min) / (xAxis.visibleRange.max - xAxis.visibleRange.min)) * (xAxis.width));

                                    //Calculate Minor Ticks
                                    if ((xAxis.minorTickLines) && xAxis.minorTickLines.visible) {
                                        if ((xAxis.tickLinesPosition != 'inside' && xAxis.labelPosition != 'inside') || (xAxis.tickLinesPosition != 'inside' && xAxis.labelPosition == 'inside'))
                                            yTickPosition = (opposedPosition) ? Math.floor(y1 - xAxis.minorTickLines.size) : Math.floor(xAxis.minorTickLines.size + y1);
                                        else
                                            yTickPosition = (opposedPosition) ? Math.floor(y1 + xAxis.minorTickLines.size) : Math.floor(y1 - xAxis.minorTickLines.size);
                                        var points = Math.floor(minorPointX + x1);
                                        sbXMinorTicks.append("M" + " " + (points + ticksVal) + " " + (yTickPosition + ticksVal) + " " + "L" + " " + (points + ticksVal) + " " + (y1 + ticksVal) + " ");
                                    }
                                }
                            }
                        }

                    }

                    //calculate major ticks
                    if (xAxis.majorTickLines.visible || xAxis.majorGridLines.visible || labelBorder.width > 0) {
                        var mtVal = this._getSharpPath(xAxis.majorTickLines.width);
                        var mlVal = this._getSharpPath(xAxis.majorGridLines.width);
                        //Calculate Major Ticks and Grid lines
                        var pointX = xPointValue[i] = this.pointX = Math.ceil(ej.EjSvgRender.utils._getPointXY(tempInterval, xAxis.visibleRange, xAxis.isInversed) * (xAxis.width));
                        //Calculate Major Ticks
                        if (xAxis.majorTickLines.visible) {

                            var lineStart = xAxis.majorTickLines.size + xAxis.axisLine.width / 2;
                            if ((xAxis.tickLinesPosition == 'inside' && xAxis.labelPosition == 'inside') || (xAxis.tickLinesPosition == 'inside' && xAxis.labelPosition != 'inside'))
                                var yPosition = (opposedPosition) ? y1 + lineStart : y1 - lineStart;
                            else
                                var yPosition = ((opposedPosition) ? y1 - lineStart : lineStart + y1) - ((isScroll) ? opposedPosition ? this.model.scrollerSize : -this.model.scrollerSize : 0);
                            sbXMajorTicks.append("M" + " " + (Math.floor(pointX + x1) + mtVal) + " " + (Math.floor(yPosition) + mtVal) + " " + "L" + " " + (Math.floor(pointX + x1) + mtVal) + " " + (Math.floor(y1 + ((opposedPosition) ? (-xAxis.axisLine.width / 2) : (xAxis.axisLine.width / 2))) + mtVal) + " ");
                        }
                    }
                }
            }
            // draw xAxis label border
            if (labelBorder.width > 0) {
                var xLabelGrid = ej.EjSvgRender.utils._getStringBuilder(), scrollSize = isScroll ? this.model.scrollerSize : 0,
                    lineStart = xAxis.axisLine.width, yPosition, endY, startX, endX, i, gap, labelPosition = xAxis.labelPosition.toLowerCase(), boundsX = this.model.m_AreaBounds.X,
                    boundsWidth = this.model.m_AreaBounds.Width, borderSize = labelBorder.width, length = xAxis._LableMaxWidth.height + xAxis.axisLine.width / 2 + 2,
                    collectionLength = xAxis.visibleLabels.length;

                if (xAxis.tickLinesPosition == labelPosition) length += xAxis.majorTickLines.size;
                if (labelPosition == 'inside') {
                    yPosition = (opposedPosition) ? y1 + lineStart : y1 + lineStart;
                    endY = opposedPosition ? y1 + length : y1 - length;
                }
                else {
                    yPosition = (opposedPosition) ? y1 - lineStart : lineStart + y1 + ((xAxis.zoomFactor < 1 && this.model.zooming.enableScrollbar
                        && axisIndex == 0) ? this.model.scrollerSize : 0);
                    endY = opposedPosition ? y1 - length - scrollSize : y1 + length + scrollSize;
                }

                for (i = 0; i < collectionLength; i++) {
                    gap = (xPointValue[xPointValue.length - 1] - xPointValue[xPointValue.length - 2]) / 2;
                    if (!ej.util.isNullOrUndefined(xPointValue[i]) && xPointValue.length >= 1 && !isNaN(gap)) {
                        if (xAxis._valueType == "category" && xAxis.labelPlacement.toLowerCase() == "betweenticks") {
                            startX = xPointValue[i] + x1;
                            endX = xPointValue[i] + (gap * 2) + x1;
                        } else {
                            startX = xPointValue[i] - gap + x1;
                            endX = xPointValue[i] + gap + x1;
                        }
                        endX = Math.floor(endX);
                        endY = Math.floor(endY);
                        startX = Math.floor(startX);
                        yPosition = Math.floor(yPosition);
                        if (startX < xAxis.x)
                            xLabelGrid.append("M" + " " + Math.floor(x1) + " " + endY + " " +
                                "L" + " " + endX + " " + endY + " ");
                        else if (endX > xAxis.width + xAxis.x) {
                            xLabelGrid.append("M" + " " + startX + " " + yPosition + " " + "L" + " " + startX + " " + endY + " " +
                                "L" + " " + Math.floor(xAxis.width + x1) + " " + endY + " ");
                            if (endX - borderSize <= xAxis.width + xAxis.x)
                                xLabelGrid.append("M " + Math.floor(xAxis.width + x1) + " " + endY + " L " + (xAxis.x + xAxis.width) + " " + yPosition);
                        }
                        else {
                            if (i == 0)
                                xLabelGrid.append("M " + xAxis.x + " " + endY + " L " + startX + " " + endY + " ");
                            xLabelGrid.append("M" + " " + startX + " " + yPosition + " " + "L" + " " + startX + " " + endY + " " +
                                "L" + " " + endX + " " + endY + " ");
                            if (i == collectionLength - 1)
                                xLabelGrid.append("M" + " " + endX + " " + yPosition + " " + "L" + " " + endX + " " + endY + " " +
                                    "M " + endX + " " + endY + " L " + (xAxis.x + xAxis.width) + " " + endY);
                        }
                    }
                }
                var labelGridOptions = {
                    'id': this.svgObject.id + '_XAxisLabelBorder_' + axisIndex,
                    'fill': 'transparent',
                    'stroke-width': labelBorder.width,
                    'stroke': labelBorder.color,
                    'd': xLabelGrid.toString()
                };
                this.svgRenderer.drawPath(labelGridOptions, gEle);
                $(gEle).appendTo(this.gXaxisEle);
            }

            //draw minor ticks
            if (xAxis.minorTickLines.visible && xAxis.visible && xAxis.minorTicksPerInterval > 0) {
                xMinorTicksDir = sbXMinorTicks.toString();
                var optionsMinorTicks = {
                    'id': this.svgObject.id + '_XAxisMinorTicks_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': xAxis.minorTickLines.width,
                    'stroke': xAxis.minorTickLines.color,
                    'd': xMinorTicksDir
                };
                if (!gEle)
                    this.svgRenderer.drawPath(optionsMinorTicks, gTickEle);
                else
                    this.svgRenderer.drawPath(optionsMinorTicks, gEle);

            }
            if (xAxis.majorTickLines.visible && xAxis.visible) {
                xMajorTicksDir = sbXMajorTicks.toString();
                var optionsMajorTicks = {
                    'id': this.svgObject.id + '_XAxisMajorTicks_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': xAxis.majorTickLines.width,
                    'stroke': xAxis.majorTickLines.color,
                    'd': xMajorTicksDir
                };
                if (!gEle) {

                    this.svgRenderer.drawPath(optionsMajorTicks, gTickEle);
                }
                else
                    this.svgRenderer.drawPath(optionsMajorTicks, gEle);
            }
            if (xAxis.tickLinesPosition == 'inside')
                $(gTickEle).appendTo(this.gXaxisEle);

        },
        _drawXAxisGridLine: function (axisIndex, xAxis, params) {
            var xMajorGridDir, xMinorGridDir,
                sbXMinorGrid = ej.EjSvgRender.utils._getStringBuilder(),
                sbXMajorGrid = ej.EjSvgRender.utils._getStringBuilder(),
                minorPointX,
                xPoint = [], padding = this.model.elementSpacing + 5,
                labelValue,
                opposedPosition = xAxis._opposed,
                x1 = Math.floor(xAxis.x),
                x2 = Math.floor(xAxis.x + xAxis.width),
                gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisGrid' + '_' + axisIndex }),
                gAgb = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisAlternateGridBand' + '_' + axisIndex });
            var isCrossesAt = params.axes[xAxis.name]._validCross;
            if (axisIndex != 0 && !isCrossesAt && (xAxis.labelPosition == 'inside' && xAxis.tickLinesPosition == 'inside') && (!(xAxis.y == (this.model.m_AreaBounds.Height + this.model.m_AreaBounds.Y) || (xAxis.y == this.model.m_AreaBounds.Y)))) {
                var y1 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis._LableMaxWidth.height) : Math.floor(xAxis.y - xAxis._LableMaxWidth.height);
                var y2 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis._LableMaxWidth.height) : Math.floor(xAxis.y - xAxis._LableMaxWidth.height);
            }
            else if ((xAxis.labelPosition == 'inside' && xAxis.tickLinesPosition != 'inside') && (!(xAxis.y == (this.model.m_AreaBounds.Height + this.model.m_AreaBounds.Y) || (xAxis.y == this.model.m_AreaBounds.Y)))) {
                var y1 = y2 = (!opposedPosition) ? (xAxis.showNextToAxisLine) ? Math.floor(xAxis.y + xAxis._LableMaxWidth.height) - padding : Math.floor(xAxis.y + xAxis._LableMaxWidth.height) : Math.floor(xAxis.y - xAxis._LableMaxWidth.height) + padding;
            }
            else if (axisIndex != 0 && !isCrossesAt && (xAxis.labelPosition != 'inside' && xAxis.tickLinesPosition == 'inside') && (!(xAxis.y == (this.model.m_AreaBounds.Height + this.model.m_AreaBounds.Y) || (xAxis.y == this.model.m_AreaBounds.Y)))) {
                var y1 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis.majorTickLines.size) : Math.floor(xAxis.y - xAxis.majorTickLines.size);
                var y2 = (!opposedPosition) ? Math.floor(xAxis.y + xAxis.majorTickLines.size) : Math.floor(xAxis.y - xAxis.majorTickLines.size);
            }
            else {
                var y1 = Math.floor(xAxis.y);
                var y2 = Math.floor(xAxis.y);
            }

            if (xAxis.visible && xAxis.axisLine.visible) {
                var offset = xAxis.axisLine.offset > 0 ? xAxis.axisLine.offset : 0;
                var val = this._getSharpPath(xAxis.axisLine.width);
                var optionsLine = {
                    'id': this.svgObject.id + '_XAxisLine_' + axisIndex,
                    x1: (x1 - xAxis.plotOffset) + val + offset,
                    y1: y1 + val,
                    x2: (x2 + xAxis.plotOffset) - offset + val,
                    y2: y2 + val,
                    'stroke-dasharray': xAxis.axisLine.dashArray,
                    'stroke-width': xAxis.axisLine.width,
                    'stroke': xAxis.axisLine.color,
                    'opacity': xAxis.axisLine.opacity || 1
                };

                params.axes[xAxis.name]._lineOption = [optionsLine, this.gXaxisEle];
            }
            else
                params.axes[xAxis.name]._lineOption = [null, this.gXaxisEle];
            xAxis.labelPlacement = (!(xAxis.labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.BetweenTicks : xAxis.labelPlacement;
            var ticksbwtLabel = ((xAxis.labels.length > 0) && (xAxis.labelPlacement.toLowerCase() == "betweenticks")) ? -0.5 : 0;
            var collectionLength = xAxis.visibleLabels.length;
            //For between ticks and gridlines
            if ((xAxis._valueType.toLowerCase() == ej.datavisualization.Chart.ValueType.Category) && ticksbwtLabel < 0) {
                collectionLength = collectionLength > 0 ? xAxis.visibleLabels.length + 1 : collectionLength;
            }
            for (var i = 0; i < collectionLength; i++) {
                labelValue = (!xAxis.visibleLabels[i]) ? xAxis.visibleLabels[i - 1].Value + xAxis.range.interval : xAxis.visibleLabels[i].Value;

                var tempInterval = ((xAxis.labels.length > 0) && (ticksbwtLabel < 0)) ? labelValue + ticksbwtLabel : labelValue;

                tempInterval = (!(xAxis.roundingPlaces)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(xAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(xAxis.visibleRange.interval)))) : tempInterval;

                if (ej.EjSvgRender.utils._inside(tempInterval, xAxis.visibleRange)) {

                    if ((xAxis.hidePartialLabels) && ((i == 0) || (i == (collectionLength - 1))))
                        continue;

                    //Calculate Minor Ticks and Grid lines
                    if (xAxis.minorGridLines.visible || xAxis.minorTickLines.visible) {
                        var ticksVal = this._getSharpPath(xAxis.minorTickLines.width);
                        var linesVal = this._getSharpPath(xAxis.minorGridLines.width);
                        var yTickPosition;
                        if (xAxis._valueType == "logarithmic") {
                            minorTicks = tempInterval;
                            var logmax = xAxis.visibleRange.max;
                            var logmin = xAxis.visibleRange.min;

                            var logtickstart = Math.pow(xAxis.logBase, minorTicks - xAxis.visibleRange.interval);
                            var logtickend = Math.pow(xAxis.logBase, minorTicks);
                            var logtickInterval = (logtickend - logtickstart) / (xAxis.minorTicksPerInterval + 1);
                            var logtickPos = logtickstart + logtickInterval;
                            minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, xAxis.logBase);
                            for (var j = 0; j < xAxis.minorTicksPerInterval; j++) {


                                if (minorTicks < logmax && minorTicks > logmin) {

                                    minorPointX = Math.ceil(((minorTicks - logmin) / (logmax - logmin)) * (xAxis.width));



                                    //Calculate Minor Gridlines
                                    if ((xAxis.minorGridLines) && xAxis.minorGridLines.visible) {
                                        var tickPosition = Math.floor(minorPointX + x1);
                                        sbXMinorGrid.append("M" + " " + (tickPosition + linesVal) + " " + (y1 + linesVal) + " " + "L" + " " + (tickPosition + linesVal) + " " + (Math.floor(opposedPosition ? this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height : this.model.m_AreaBounds.Y) + linesVal) + " ");
                                    }

                                }
                                logtickPos += logtickInterval;
                                minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, xAxis.logBase);
                            }
                        } else {
                            for (var j = 0, minorTicks = tempInterval; j < xAxis.minorTicksPerInterval; j++) {
                                minorTicks += xAxis.visibleRange.interval / (xAxis.minorTicksPerInterval + 1);
                                if (minorTicks < xAxis.visibleRange.max && minorTicks > xAxis.visibleRange.min) {
                                    minorPointX = Math.ceil(((minorTicks - xAxis.visibleRange.min) / (xAxis.visibleRange.max - xAxis.visibleRange.min)) * (xAxis.width));


                                    //Calculate Minor Gridlines
                                    if ((xAxis.minorGridLines) && xAxis.minorGridLines.visible)
                                        sbXMinorGrid.append("M" + " " + (Math.floor(minorPointX + x1) + linesVal) + " " + (y1 + linesVal) + " " + "L" + " " + (Math.floor(minorPointX + x1) + linesVal) + " " + (Math.floor(opposedPosition ? this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height : this.model.m_AreaBounds.Y) + linesVal) + " ");
                                }
                            }
                        }
                    }

                    if (xAxis.majorTickLines.visible || xAxis.majorGridLines.visible) {
                        var mtVal = this._getSharpPath(xAxis.majorTickLines.width);
                        var mlVal = this._getSharpPath(xAxis.majorGridLines.width);
                        var pointX = this.pointX = Math.ceil(ej.EjSvgRender.utils._getPointXY(tempInterval, xAxis.visibleRange, xAxis.isInversed) * (xAxis.width));
                        var mX1 = (Math.floor(pointX + x1));
                        if (xAxis.zoomed)
                            xPoint[0] = xAxis.x;
                        if (i == 0) {
                            if (mX1 == Math.floor(this.model.m_AreaBounds.X)) {
                                xPoint.push(mX1 + mlVal);
                                continue;

                            }
                        }
                        if ((i == (collectionLength - 1)) && (this.model.chartArea.border.color != "transparent" && this.model.chartArea.border.width > 0)) {
                            if (mX1 == Math.floor(this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width))
                                continue;
                            if (xAxis.zoomed)
                                xPoint[collectionLength] = mX1 + mlVal;

                        }

                        //Calculate Major Gridlines
                        if (xAxis.majorGridLines.visible)
                            sbXMajorGrid.append("M" + " " + (mX1 + mlVal) + " " + (Math.floor(this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height) + mlVal) + " " + "L" + " " + (mX1 + mlVal) + " " + (Math.floor(this.model.m_AreaBounds.Y) + mlVal) + " ");
                        if ((xAxis._valueType.toLowerCase() != "category") && i == collectionLength - 1)
                            continue;
                        xPoint.push((mX1 + mlVal));
                    }

                }

            }


            if (xAxis.alternateGridBand.odd.fill != "transparent" || xAxis.alternateGridBand.even.fill != "transparent") {
                var height = this.model.m_AreaBounds.Height, optionsAlternateeven;

                if (xPoint.length === 0) {
                    optionsAlternateeven = {
                        'id': this.svgObject.id + '_XAxis' + axisIndex + '_Alternateeven' + 0,
                        'x': xAxis.x,
                        'y': Math.floor(this.model.m_AreaBounds.Y),
                        'width': xAxis.width,
                        'height': height,
                        'fill': xAxis.alternateGridBand.even.fill,
                        'opacity': xAxis.alternateGridBand.even.opacity,
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)',
                        'stroke': "transparent"
                    };
                    this.svgRenderer.drawRect(optionsAlternateeven, gAgb);
                }

                for (var i = 1; i < xPoint.length; i += 2) {
                    var width = xPoint[i + 1] - xPoint[i];
                    width = (width || xAxis.labelPlacement.toLowerCase() == 'onticks') ? width : (xAxis.width + xAxis.x) - xPoint[i];
                    if (i == xPoint.length - 1 && xAxis.zoomed)
                        width = this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width - xPoint[xPoint.length - 1] - xAxis.plotOffset;
                    var optionsAlternateodd = {
                        'id': this.svgObject.id + '_XAxis' + axisIndex + '_Alternateodd' + [i],
                        'x': xPoint[i],
                        'y': Math.floor(this.model.m_AreaBounds.Y),
                        'width': width,
                        'height': height,
                        'fill': xAxis.alternateGridBand.odd.fill,
                        'opacity': xAxis.alternateGridBand.odd.opacity,
                        'stroke': "transparent",
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)'

                    };
                    if (width > 0)
                        this.svgRenderer.drawRect(optionsAlternateodd, gAgb);
                }

                for (var i = 0; i < xPoint.length; i += 2) {
                    var width = xPoint[i + 1] - xPoint[i];
                    width = (width || xAxis.labelPlacement.toLowerCase() == 'onticks') ? width : (xAxis.width + xAxis.x) - xPoint[i];
                    if (i == 0 && xAxis.zoomed)
                        width = xPoint[1] - xAxis.x;

                    if (i == xPoint.length - 1 && xAxis.zoomed)
                        width = this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width - xPoint[xPoint.length - 1] - xAxis.plotOffset;

                    optionsAlternateeven = {
                        'id': this.svgObject.id + '_XAxis' + axisIndex + '_Alternateeven' + [i],
                        'x': xPoint[i],
                        'y': Math.floor(this.model.m_AreaBounds.Y),
                        'width': width,
                        'height': height,
                        'fill': xAxis.alternateGridBand.even.fill,
                        'opacity': xAxis.alternateGridBand.even.opacity,
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)',
                        'stroke': "transparent"
                    };
                    if (width > 0)
                        this.svgRenderer.drawRect(optionsAlternateeven, gAgb);
                }
                $(gAgb).appendTo(gEle);
            }
            if (xAxis.minorGridLines.visible && xAxis.minorTicksPerInterval > 0) {
                xMinorGridDir = sbXMinorGrid.toString();
                //Drawing Minor Grid Lines
                var optionsMinorGrid = {
                    'id': this.svgObject.id + '_XAxisMinorGridLines_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': xAxis.minorGridLines.width,
                    'stroke': xAxis.minorGridLines.color,
                    'stroke-dasharray': xAxis.minorGridLines.dashArray,
                    'd': xMinorGridDir
                };
                this.svgRenderer.drawPath(optionsMinorGrid, gEle);
            }
            xMajorGridDir = sbXMajorGrid.toString();
            if (xAxis.majorGridLines.visible) {
                var options = {
                    'id': this.svgObject.id + '_XAxisMajorGridLines_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': xAxis.majorGridLines.width,
                    'stroke': xAxis.majorGridLines.color,
                    'opacity': xAxis.majorGridLines.opacity,
                    'stroke-dasharray': xAxis.majorGridLines.dashArray,
                    'd': xMajorGridDir
                };

                //Drawing Major Grid Lines
                if (options.d != '')
                    this.svgRenderer.drawPath(options, gEle);

            }
            $(gEle).appendTo(this.svgObject);


        },

        _drawYAxisTickLine: function (axisIndex, yAxis, gEle, isValidCross) {
            var yMajorTicksDir = "", yMinorTicksDir = "";
            var pointY = 0;
            var isScroll = yAxis._isScroll && !(yAxis.scrollbarSettings.pointsLength != null && yAxis.scrollbarSettings.pointsLength < yAxis.maxPointLength);
            var opposedPosition = yAxis._opposed;
            var labelValue, yPointValue = [];
            var labelBorder = yAxis.labelBorder;

            if (axisIndex != 1 && ((yAxis.labelPosition == 'inside' && yAxis.tickLinesPosition == 'inside') || (yAxis.labelPosition == 'inside' && yAxis.tickLinesPosition != 'inside')) && (!(yAxis.x == (this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) || (yAxis.x == (this.model.m_AreaBounds.X))))) {
                var x1 = (!opposedPosition && !isValidCross) ? Math.floor(yAxis.x - yAxis._LableMaxWidth.width - this.model.elementSpacing) : yAxis.showNextToAxisLine ? yAxis.x : Math.floor(yAxis.x + yAxis._LableMaxWidth.width + this.model.elementSpacing);
                var x2 = (!opposedPosition && !isValidCross) ? Math.floor(yAxis.x - yAxis._LableMaxWidth.width - this.model.elementSpacing) : yAxis.showNextToAxisLine ? yAxis.x : Math.floor(yAxis.x + yAxis._LableMaxWidth.width + this.model.elementSpacing);
            }
            else if (axisIndex != 1 && !isValidCross && (yAxis.labelPosition != 'inside' && yAxis.tickLinesPosition == 'inside') && (!(yAxis.x == (this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) || (yAxis.x == (this.model.m_AreaBounds.X))))) {
                var x1 = Math.floor(yAxis.x + yAxis.majorTickLines.size);
                var x2 = Math.floor(yAxis.x + yAxis.majorTickLines.size);
            }
            else {
                var x1 = x2 = (!yAxis.showNextToAxisLine) ? yAxis._x : !yAxis.showNextToAxisLine && yAxis.tickLinesPosition == "inside" ? yAxis.x + yAxis.majorTickLines.size : yAxis.x;
            }

            var y1 = Math.floor(yAxis.y + yAxis.height);
            var y2 = Math.floor(yAxis.y);


            var sbYMinorTicks = ej.EjSvgRender.utils._getStringBuilder();
            var sbYMajorTicks = ej.EjSvgRender.utils._getStringBuilder();
            var gTickEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisTicklines' + '_' + axisIndex });

            yAxis.labelPlacement = (!(yAxis.labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.BetweenTicks : yAxis.labelPlacement;
            var ticksbwtLabel = ((yAxis.labels.length > 0) && (yAxis.labelPlacement.toLowerCase() == "betweenticks")) ? -0.5 : 0;
            var collectionLength = yAxis.visibleLabels.length;
            //For between ticks and gridlines
            if ((yAxis._valueType.toLowerCase() == ej.datavisualization.Chart.ValueType.Category) && ticksbwtLabel < 0) {
                collectionLength = collectionLength > 0 ? yAxis.visibleLabels.length + 1 : collectionLength;
            }
            for (var i = 0; i < collectionLength; i++) {
                labelValue = (!yAxis.visibleLabels[i]) ? yAxis.visibleLabels[i - 1].Value + yAxis.range.interval : yAxis.visibleLabels[i].Value;
                var tempInterval = ((yAxis.labels.length > 0) && (ticksbwtLabel < 0)) ? labelValue + ticksbwtLabel : labelValue;
                tempInterval = (!(yAxis.roundingPlaces)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(yAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(yAxis.visibleRange.interval)))) : tempInterval;

                if (ej.EjSvgRender.utils._inside(tempInterval, yAxis.visibleRange)) {

                    if ((yAxis.hidePartialLabels) && ((i == 0) || (i == (yAxis.visibleLabels.length - 1))))
                        continue;

                    // Calculate Minor Ticks and Grid lines      
                    if (yAxis.minorGridLines.visible || yAxis.minorTickLines.visible) {
                        var minorPointY;
                        var tickVal = this._getSharpPath(yAxis.minorTickLines.width);
                        var lineVal = this._getSharpPath(yAxis.minorGridLines.width);
                        if (yAxis._valueType == "logarithmic") {
                            minorTicks = tempInterval;
                            var logmax = yAxis.visibleRange.max;
                            var logmin = yAxis.visibleRange.min;

                            var logtickstart = Math.pow(yAxis.logBase, minorTicks - yAxis.visibleRange.interval);
                            var logtickend = Math.pow(yAxis.logBase, minorTicks);
                            var logtickInterval = (logtickend - logtickstart) / (yAxis.minorTicksPerInterval + 1);
                            var logtickPos = logtickstart + logtickInterval;
                            minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, yAxis.logBase);
                            for (var j = 0; j < yAxis.minorTicksPerInterval; j++) {


                                if (minorTicks < logmax && minorTicks > logmin) {

                                    minorPointY = Math.ceil(((minorTicks - logmin) / (logmax - logmin)) * (yAxis.height));

                                    //Calculate Minor Ticks
                                    if ((yAxis.minorTickLines) && yAxis.minorTickLines.visible) {

                                        if (yAxis.minorTickLines.visible) {
                                            if ((yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition != 'inside') || (yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition == 'inside'))
                                                ytickPosition = (opposedPosition) ? yAxis.minorTickLines.size : -yAxis.minorTickLines.size;
                                            else
                                                var ytickPosition = (opposedPosition) ? -yAxis.minorTickLines.size : yAxis.minorTickLines.size;
                                            sbYMinorTicks.append("M" + " " + (Math.floor(ytickPosition + x1) + tickVal) + " " + (Math.floor((minorPointY * -1) + y1) + tickVal) + " " + "L" + " " + (x1 + tickVal) + " " + (Math.floor((minorPointY * -1) + y1) + tickVal) + " ");
                                        }
                                    }
                                }
                                logtickPos += logtickInterval;
                                minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, yAxis.logBase);
                            }
                        }
                        else {
                            for (var j = 0, minorTicks = tempInterval; j < yAxis.minorTicksPerInterval; j++) {

                                minorTicks += yAxis.visibleRange.interval / (yAxis.minorTicksPerInterval + 1);
                                if (minorTicks < yAxis.visibleRange.max && minorTicks > yAxis.visibleRange.min) {
                                    minorPointY = ((minorTicks - yAxis.visibleRange.min) / (yAxis.visibleRange.delta)) * (yAxis.height);
                                    // Calculate Minor Ticks   
                                    if (yAxis.minorTickLines.visible) {
                                        if ((yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition != 'inside') || (yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition == 'inside'))
                                            var ytickPosition = (opposedPosition) ? yAxis.minorTickLines.size : -yAxis.minorTickLines.size;
                                        else
                                            var ytickPosition = (opposedPosition) ? -yAxis.minorTickLines.size : yAxis.minorTickLines.size;
                                        sbYMinorTicks.append("M" + " " + (Math.floor(ytickPosition + x1) + tickVal) + " " + (Math.floor((minorPointY * -1) + y1) + tickVal) + " " + "L" + " " + (x1 + tickVal) + " " + (Math.floor((minorPointY * -1) + y1) + tickVal) + " ");
                                    }

                                }
                            }
                        }
                    }
                    // Calculate Major Ticks and Grid lines
                    if (yAxis.majorTickLines.visible || yAxis.majorGridLines.visible || labelBorder.width > 0) {
                        var mtVal = this._getSharpPath(yAxis.minorTickLines.width);
                        var mlVal = this._getSharpPath(yAxis.majorGridLines.width);
                        pointY = yPointValue[i] = ej.EjSvgRender.utils._getPointXY(tempInterval, yAxis.visibleRange, yAxis.isInversed) * (yAxis.height);
                        // Calculate Major Ticks
                        if (yAxis.majorTickLines.visible) {
                            if ((yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition != 'inside') || (yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition == 'inside'))
                                var xPosition = ((opposedPosition) ? yAxis.majorTickLines.size + yAxis.axisLine.width / 2 : -(yAxis.majorTickLines.size + yAxis.axisLine.width / 2)) + ((isScroll) ? opposedPosition ? this.model.scrollerSize : opposedPosition - this.model.scrollerSize : 0);
                            else if ((yAxis.tickLinesPosition == 'inside' && yAxis.labelPosition != 'inside') || (yAxis.tickLinesPosition == 'inside' && yAxis.labelPosition == 'inside'))
                                var xPosition = (opposedPosition) ? -(yAxis.majorTickLines.size + yAxis.axisLine.width / 2) : (yAxis.majorTickLines.size + yAxis.axisLine.width / 2);

                            sbYMajorTicks.append("M" + " " + (Math.floor(xPosition + x1) + mtVal) + " " + (Math.floor((pointY * -1) + y1) + mtVal) + " " + "L" + " " + (Math.floor(x1 + ((opposedPosition) ? (yAxis.axisLine.width / 2) : (yAxis.axisLine.width / 2))) + mtVal) + " " + (Math.floor((pointY * -1) + y1) + mtVal) + " ");

                        }



                    }
                }
            }

            // draw yAxis label border
            if (labelBorder.width > 0) {
                var yLabelGrid = ej.EjSvgRender.utils._getStringBuilder(), xPosition = yAxis.axisLine.width / 2, i,
                    startY, endY, endX, gap, scrollSize = isScroll ? this.model.scrollerSize : 0, length = yAxis._LableMaxWidth.maxWidth + 10;

                if (yAxis.tickLinesPosition == yAxis.labelPosition) length += yAxis.majorTickLines.size;
                endX = Math.floor(x1 - length);
                if (yAxis.labelPosition == "outside")
                    endX = opposedPosition ? Math.floor(x1 + length) + scrollSize : Math.floor(x1 - length) - scrollSize;
                else
                    endX = opposedPosition ? Math.floor(x1 - length) : Math.floor(x1 + length);

                for (var i = 0; i < collectionLength; i++) {
                    gap = (yPointValue[yPointValue.length - 1] - yPointValue[yPointValue.length - 2]) / 2;
                    if (!ej.util.isNullOrUndefined(yPointValue[i]) && yPointValue.length > 1 && !isNaN(gap)) {
                        if (yAxis._valueType == "category" && yAxis.labelPlacement.toLowerCase() == "betweenticks") {
                            startY = Math.floor((yPointValue[i] * -1) + y1);
                            endY = Math.floor((yPointValue[i] * -1) - (gap * 2) + y1);
                        } else {
                            startY = Math.floor((yPointValue[i] * -1) + gap + y1);
                            endY = Math.floor((yPointValue[i] * -1) - gap + y1);
                        }
                        if (startY > y1)
                            yLabelGrid.append("M" + " " + endX + " " + y1 + " " + "L" + " " + endX + " " + endY + " ");
                        else if (endY < this.model.m_AreaBounds.Y)
                            yLabelGrid.append("M" + " " + Math.floor(xPosition + x1) + " " + startY + " " + "L" + " " + endX + " " + startY + " "
                                + "L" + " " + endX + " " + this.model.m_AreaBounds.Y + " ");
                        else {
                            yLabelGrid.append("M" + " " + Math.floor(xPosition + x1) + " " + startY + " " + "L" + " " + endX + " " + startY + " "
                                + "L" + " " + endX + " " + endY + " ");
                            if (i == collectionLength - 1)
                                yLabelGrid.append("M" + " " + Math.floor(xPosition + x1) + " " + endY + " " + "L" + " " + endX + " " + endY + " ");
                        }
                    }
                }
                var labelGridOptions = {
                    'id': this.svgObject.id + '_YAxisLabelBorder_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': labelBorder.width,
                    'stroke': labelBorder.color,
                    'd': yLabelGrid.toString()
                };
                this.svgRenderer.drawPath(labelGridOptions, gEle);
                $(gEle).appendTo(this.gYaxisEle);
            }

            //Drawning Minor Ticks
            if (yAxis.minorTickLines.visible && yAxis.visible && yAxis.minorTicksPerInterval > 0) {
                yMinorTicksDir = sbYMinorTicks.toString();
                var optionsMinotTick = {
                    'id': this.svgObject.id + '_YAxisMinorTicks_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': yAxis.minorTickLines.width,
                    'stroke': yAxis.minorTickLines.color,
                    'd': yMinorTicksDir
                };
                this.svgRenderer.drawPath(optionsMinotTick, gEle);
            }


            if (yAxis.majorTickLines.visible && yAxis.visible) {
                yMajorTicksDir = sbYMajorTicks.toString();
                //Drawning Major Ticks
                var optionsMajorTick = {
                    'id': this.svgObject.id + '_YAxisMajorTicks_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': yAxis.majorTickLines.width,
                    'stroke': yAxis.majorTickLines.color,
                    'd': yMajorTicksDir
                };
                this.svgRenderer.drawPath(optionsMajorTick, gEle);
            }
        },

        _drawYAxisGridLine: function (axisIndex, yAxis, params) {

            var yMajorGridDir = "", yMajorTicksDir = "", yMinorTicksDir = "", yMinorGridDir = "";
            var pointY = 0;
            var labelValue;
            var y1 = Math.floor(yAxis.y + yAxis.height);
            var y2 = Math.floor(yAxis.y);
            var opposedPosition = yAxis._opposed;
            var yPoint = [];
            var isCrossesAt = params.axes[yAxis.name]._validCross;
            var axisName = (yAxis.name).replace(/[^a-zA-Z0-9]/g, "");
            if (axisIndex != 1 && !isCrossesAt && ((yAxis.labelPosition == 'inside' && yAxis.tickLinesPosition == 'inside') || (yAxis.labelPosition == 'inside' && yAxis.tickLinesPosition != 'inside')) && (!(yAxis.x == (this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) || (yAxis.x == (this.model.m_AreaBounds.X))))) {
                var x1 = (!opposedPosition) ? Math.floor(yAxis.x - yAxis._LableMaxWidth.width - this.model.elementSpacing) : Math.floor(yAxis.x + yAxis._LableMaxWidth.width + this.model.elementSpacing);
                var x2 = (!opposedPosition) ? Math.floor(yAxis.x - yAxis._LableMaxWidth.width - this.model.elementSpacing) : Math.floor(yAxis.x + yAxis._LableMaxWidth.width + this.model.elementSpacing);
            }
            else if (axisIndex != 1 && !isCrossesAt && (yAxis.labelPosition != 'inside' && yAxis.tickLinesPosition == 'inside') && (!(yAxis.x == (this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) || (yAxis.x == (this.model.m_AreaBounds.X))))) {

                var x1 = (!opposedPosition) ? Math.floor(yAxis.x - yAxis.majorTickLines.size) : Math.floor(yAxis.x + yAxis.majorTickLines.size);
                var x2 = (!opposedPosition) ? Math.floor(yAxis.x - yAxis.majorTickLines.size) : Math.floor(yAxis.x + yAxis.majorTickLines.size);
            }
            else {
                var x1 = Math.floor(yAxis.x);
                var x2 = Math.floor(yAxis.x);
            }
            var sbYMinorGrid = ej.EjSvgRender.utils._getStringBuilder();
            var sbYMajorGrid = ej.EjSvgRender.utils._getStringBuilder();
            var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisGrid' + '_' + axisIndex });
            var gAgb = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisAlternateGridBand' + '_' + axisIndex });

            if (yAxis.visible && yAxis.axisLine.visible) {
                var offset = yAxis.axisLine.offset > 0 ? yAxis.axisLine.offset : 0;
                var val = this._getSharpPath(yAxis.axisLine.width);

                var optionsLine = {
                    'id': this.svgObject.id + axisName + '_YAxisLine_' + axisIndex,
                    x1: x1 + val,
                    y1: (y2 - yAxis.plotOffset) + offset + val,
                    x2: x2 + val,
                    y2: (y1 + yAxis.plotOffset) - offset + val,
                    'stroke-width': yAxis.axisLine.width,
                    'stroke-dasharray': yAxis.axisLine.dashArray,
                    'stroke': yAxis.axisLine.color,
                    'opacity': yAxis.axisLine.opacity || 1
                };
                params.axes[yAxis.name]._lineOption = [optionsLine, this.gYaxisEle];
            }
            else
                params.axes[yAxis.name]._lineOption = [null, this.gYaxisEle];

            if (yAxis.axisBottomLine) {
                if (yAxis.axisBottomLine.visible) {
                    var optionsBottomLine = {
                        'id': this.svgObject.id + axisName + '_YAxisBottomLine_' + axisIndex,
                        x1: this.model.m_AreaBounds.X,
                        y1: y1,
                        x2: this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width,
                        y2: y1,
                        'stroke-width': yAxis.axisBottomLine.width,
                        'stroke': yAxis.axisBottomLine.color
                    };
                    this.svgRenderer.drawLine(optionsBottomLine, gEle);
                }
            }
            yAxis.labelPlacement = (!(yAxis.labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.BetweenTicks : yAxis.labelPlacement;
            var ticksbwtLabel = ((yAxis.labels.length > 0) && (yAxis.labelPlacement.toLowerCase() == "betweenticks")) ? -0.5 : 0;
            var collectionLength = yAxis.visibleLabels.length;
            for (var i = 0; i < collectionLength; i++) {
                labelValue = yAxis.visibleLabels[i].Value;
                var tempInterval = ((yAxis.labels.length > 0) && (ticksbwtLabel < 0)) ? labelValue + ticksbwtLabel : labelValue;
                tempInterval = (!(yAxis.roundingPlaces)) ? parseFloat(tempInterval.toFixed((ej.EjSvgRender.utils._decimalPlaces(yAxis.visibleRange.interval) == 0 ? 1 : ej.EjSvgRender.utils._decimalPlaces(yAxis.visibleRange.interval)))) : tempInterval;

                if (ej.EjSvgRender.utils._inside(tempInterval, yAxis.visibleRange)) {

                    if ((yAxis.hidePartialLabels) && ((i == 0) || (i == (yAxis.visibleLabels.length - 1))))
                        continue;

                    // Calculate Minor Ticks and Grid lines      
                    if (yAxis.minorGridLines.visible || yAxis.minorTickLines.visible) {
                        var minorPointY;
                        var tickVal = this._getSharpPath(yAxis.minorTickLines.width);
                        var lineVal = this._getSharpPath(yAxis.minorGridLines.width);
                        if (yAxis._valueType == "logarithmic") {
                            minorTicks = tempInterval;
                            var logmax = yAxis.visibleRange.max;
                            var logmin = yAxis.visibleRange.min;

                            var logtickstart = Math.pow(yAxis.logBase, minorTicks - yAxis.visibleRange.interval);
                            var logtickend = Math.pow(yAxis.logBase, minorTicks);
                            var logtickInterval = (logtickend - logtickstart) / (yAxis.minorTicksPerInterval + 1);
                            var logtickPos = logtickstart + logtickInterval;
                            minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, yAxis.logBase);
                            for (var j = 0; j < yAxis.minorTicksPerInterval; j++) {


                                if (minorTicks < logmax && minorTicks > logmin) {

                                    minorPointY = Math.ceil(((minorTicks - logmin) / (logmax - logmin)) * (yAxis.height));



                                    //Calculate Minor Gridlines
                                    if (yAxis.minorGridLines.visible)
                                        sbYMinorGrid.append("M" + " " + (Math.floor(this.model.m_AreaBounds.X) + lineVal) + " " + (Math.floor((minorPointY * -1) + y1) + lineVal) + " " + "L" + " " + (Math.floor(this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) + lineVal) + " " + (Math.floor((minorPointY * -1) + y1) + lineVal) + " ");

                                }
                                logtickPos += logtickInterval;
                                minorTicks = ej.EjSvgRender.utils._logBase(logtickPos, yAxis.logBase);
                            }
                        } else {
                            for (var j = 0, minorTicks = tempInterval; j < yAxis.minorTicksPerInterval; j++) {

                                minorTicks += yAxis.visibleRange.interval / (yAxis.minorTicksPerInterval + 1);
                                if (minorTicks < yAxis.visibleRange.max && minorTicks > yAxis.visibleRange.min) {
                                    minorPointY = ((minorTicks - yAxis.visibleRange.min) / (yAxis.visibleRange.delta)) * (yAxis.height);

                                    // Calculate Minor Grid lines   
                                    if (yAxis.minorGridLines.visible)
                                        sbYMinorGrid.append("M" + " " + (Math.floor(this.model.m_AreaBounds.X) + lineVal) + " " + (Math.floor((minorPointY * -1) + y1) + lineVal) + " " + "L" + " " + (Math.floor(this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) + lineVal) + " " + (Math.floor((minorPointY * -1) + y1) + lineVal) + " ");
                                }
                            }
                        }
                    }
                    // Calculate Grid lines
                    if (yAxis.majorTickLines.visible || yAxis.majorGridLines.visible) {
                        var mtVal = this._getSharpPath(yAxis.minorTickLines.width);
                        var mlVal = this._getSharpPath(yAxis.majorGridLines.width);

                        // Calculate Major Grid lines
                        if (yAxis.majorGridLines.visible) {
                            pointY = ej.EjSvgRender.utils._getPointXY(tempInterval, yAxis.visibleRange, yAxis.isInversed) * (yAxis.height);
                            var mX1 = (Math.floor(this.model.m_AreaBounds.X) + mlVal);
                            var mY1 = (Math.floor((pointY * -1) + y1));
                            var mX2 = (Math.floor(this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) + mlVal);
                            if (i == 0) {
                                if (mY1 == Math.floor(this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height))
                                    continue;
                                if (yAxis.zoomed)
                                    yPoint[0] = mY1 + mlVal;

                            }
                            if ((i == (yAxis.visibleLabels.length - 1)) && (this.model.chartArea.border.color != "transparent" && this.model.chartArea.border.width > 0)) {

                                if (mY1 == (Math.floor(this.model.m_AreaBounds.Y))) {
                                    yPoint.push(mY1 + mlVal);
                                    continue;
                                }

                            }



                            sbYMajorGrid.append("M" + " " + mX1 + " " + (mY1 + mlVal) + " " + "L" + " " + mX2 + " " + (mY1 + mlVal) + " ");
                            if (i == 0)
                                continue;

                            yPoint.push(mY1 + mlVal);

                        }
                    }
                }
            }

            if (yAxis.alternateGridBand.odd.fill != "transparent" || yAxis.alternateGridBand.even.fill != "transparent") {

                var width = this.model.m_AreaBounds.Width;
                if (yAxis.zoomed) {
                    yPoint[yPoint.length] = yAxis.y;

                }
                for (var i = 1; i < yPoint.length; i += 2) {
                    var height = yPoint[0] - yPoint[1];
                    if (i == yPoint.length - 1 && yAxis.zoomed) {
                        var zoomHeight = yPoint[yPoint.length - 2] - yAxis.y;
                        height = zoomHeight;
                    }
                    var yoptionsAlternateodd = {
                        'id': this.svgObject.id + '_YAxisAlternateodd' + [i],
                        'x': Math.floor(this.model.m_AreaBounds.X),
                        'y': yPoint[i],
                        'width': width,
                        'height': height,
                        'fill': yAxis.alternateGridBand.odd.fill,
                        'opacity': yAxis.alternateGridBand.odd.opacity,
                        'stroke': "transparent",
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)'
                    };
                    this.svgRenderer.drawRect(yoptionsAlternateodd, gAgb);
                }

                for (var i = 0; i < yPoint.length; i += 2) {
                    var height = yPoint[0] - yPoint[1];
                    if (i == yPoint.length - 1 && yAxis.zoomed) {
                        var zoomHeight = yPoint[yPoint.length - 2] - yAxis.y;
                        height = zoomHeight;
                    }
                    if (i == 0 && yAxis.zoomed) {
                        var zoomHeight = yAxis.y + yAxis.height - yPoint[0] - yAxis.plotOffset;
                        height = zoomHeight;
                    }
                    var yoptionsAlternateeven = {
                        'id': this.svgObject.id + '_YAxisAlternateeven' + [i],
                        'x': Math.floor(this.model.m_AreaBounds.X),
                        'y': yPoint[i],
                        'width': width,
                        'height': height,
                        'fill': yAxis.alternateGridBand.even.fill,
                        'opacity': yAxis.alternateGridBand.even.opacity,
                        'stroke': "transparent",
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)'
                    };
                    this.svgRenderer.drawRect(yoptionsAlternateeven, gAgb);
                }
                $(gAgb).appendTo(gEle);
            }


            if (yAxis.minorGridLines.visible && yAxis.minorTicksPerInterval > 0) {
                //Drawning Minor Grid Lines
                yMinorGridDir = sbYMinorGrid.toString();
                var optionsMinorGrid = {
                    'id': this.svgObject.id + '_YAxisMinorGridLines_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': yAxis.minorGridLines.width,
                    'stroke': yAxis.minorGridLines.color,
                    'stroke-dasharray': yAxis.minorGridLines.dashArray,
                    'd': yMinorGridDir
                };
                this.svgRenderer.drawPath(optionsMinorGrid, gEle);

            }

            //Drawing Major Grid Lines
            yMajorGridDir = sbYMajorGrid.toString();
            if (yAxis.majorGridLines.visible) {
                var options = {
                    'id': this.svgObject.id + '_YAxisMajorGridLines_' + axisIndex,
                    'fill': 'none',
                    'stroke-width': yAxis.majorGridLines.width,
                    'opacity': yAxis.majorGridLines.opacity,
                    'stroke-dasharray': yAxis.majorGridLines.dashArray,
                    'stroke': yAxis.majorGridLines.color,
                    'd': yMajorGridDir
                };

                if (options.d != '')
                    this.svgRenderer.drawPath(options, gEle);

            }
            $(gEle).appendTo(this.svgObject);
        },

        textOverflowMultiLevelLabels: function (axis, gap, text, actualText, textOverflow, font, labelSize, textOptions, gMultiLevelEle, chartObj) {
            var yVal = textOptions.y, count = 0, bounds;
            if (textOverflow == "wrap" || textOverflow == "wrapandtrim") {
                collection = chartObj._wrap(axis, gap, text, textOverflow, font, labelSize);
                textCollection = collection["text"];
                rows = textCollection.length;
                for (j = 0; j < rows; j++) {
                    textOptions.y += labelSize.height;
                    if (!chartObj.model.enable3D) {
                        textOptions.id += "_" + j;
                        chartObj.svgRenderer.drawText(textOptions, textCollection[j], gMultiLevelEle);
                    }
                    if (textOverflow == "wrapandtrim" && textCollection[j].indexOf("...") > -1) {
                        if (chartObj.model.enable3D && count == 0)
                            textOptions.y -= labelSize.height;
                        unTrimmedText = collection["unTrimmedText"];
                        labelSize = ej.EjSvgRender.utils._measureText(textCollection[j], null, font);
                        bounds = { X: textOptions.x - labelSize.width / 2, Y: textOptions.y, Width: labelSize.width, Height: labelSize.height };
                        chartObj.model.axisMultiLevelLabelRegions.push({ trimText: textCollection[j], labelText: unTrimmedText[count], Bounds: bounds });
                        count++;
                    }
                }
                return textCollection;
            } else {
                text = (textOverflow == "trim") ? ej.EjSvgRender.utils._trimText(actualText, gap, font) : actualText;
                // to store region
                if (!chartObj.model.enable3D)
                    yVal = textOptions.y + labelSize.height;
                if (axis.orientation.toLowerCase() == "vertical")
                    yVal = textOptions.y - labelSize.height / 4;
                labelSize = ej.EjSvgRender.utils._measureText(text, null, font);
                bounds = { X: textOptions.x - labelSize.width / 2, Y: yVal, Width: labelSize.width, Height: labelSize.height };
                chartObj.model.axisMultiLevelLabelRegions.push({ trimText: text, labelText: actualText, Bounds: bounds });
                return text;
            }
        },

        _triggerMultiLevelLabelsRendering: function (text, x, y, textOverflow, font, border, chart) {
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);          // trigger event
            commonEventArgs.data = {
                text: text, location: { x: x, y: y },
                textOverflow: textOverflow, font: font, border: border
            };
            chart._trigger("multiLevelLabelRendering", commonEventArgs);
            return commonEventArgs.data;
        },

        _drawXAxisMultiLevelLabels: function (axisIndex, xAxis) {          // to render x axis multi level labels
            // declaration 
            var i, j, x, y, rows, count, gap, actualText, text, labelSize, grpLabel, font, startX, startY, endX, textOptions, level, textOverflow, clipX, clipY, clipWidth, clipHeight, anchor, height, width,
                textCollection, borderOptions, border, style, alignment, svgId = this.svgObject.id, range = xAxis.visibleRange,
                gMultiLevelEle = this.svgRenderer.createGroup({
                    'id': svgId + '_XAxisMultiLevelLabels' + '_' + axisIndex, 'clip-path': 'url(#' + this.svgObject.id +
                        '_XAxis_Clippath_' + axisIndex + ")"
                }), areaBounds = this.model.m_AreaBounds, opposedPosition = xAxis.opposedPosition, borderWidth,
                labelPosition = xAxis.labelPosition.toLowerCase(), labelBorder = xAxis.labelBorder, padding = 10,
                scrollerSize = xAxis._isScroll ? this.model.scrollerSize : 0;

            // create clip path
            startY = xAxis.majorTickLines.size + xAxis._LableMaxWidth.height + (labelBorder.width);
            clipX = xAxis.x;
            clipY = xAxis.y + startY + scrollerSize;
            clipWidth = xAxis.width + this.model.chartArea.border.width;
            clipHeight = xAxis._multiLevelLabelHeight + padding - 2;

            if (opposedPosition) {
                if (labelPosition == "outside")
                    clipY = xAxis.y - startY - xAxis._multiLevelLabelHeight - padding / 2 - scrollerSize;
                else
                    clipY = xAxis.y + startY - padding / 2;
            } else {
                if (labelPosition == "inside")
                    clipY = xAxis.y - startY - xAxis._multiLevelLabelHeight;
            }

            // to clip multi level labels
            var clipRectOptions = {
                'id': this.svgObject.id + '_XAxis_Clippath_' + axisIndex,
                'x': clipX,
                'y': clipY,
                'width': clipWidth,
                'height': clipHeight,
                'fill': 'white',
                'stroke-width': 1,
                'stroke': 'Gray'
            };
            this.svgRenderer.drawClipPath(clipRectOptions, gMultiLevelEle);

            for (i = 0; i < xAxis.multiLevelLabels.length; i++) {
                // assignment
                grpLabel = xAxis.multiLevelLabels[i];
                if (typeof grpLabel.start == "string" && grpLabel.start.indexOf("/Date(") != -1)
                    grpLabel.start = parseInt(grpLabel.start.substr(6));
                if (typeof grpLabel.end == "string" && grpLabel.end.indexOf("/Date(") != -1)
                    grpLabel.end = parseInt(grpLabel.end.substr(6));
                if (grpLabel.visible && ((grpLabel.start >= range.min && grpLabel.start <= range.max)
                    || (grpLabel.end >= range.min && grpLabel.end <= range.max) ||
                    (grpLabel.start < range.min && grpLabel.end > range.max))) {
                    font = grpLabel.font;
                    border = grpLabel.border;
                    borderWidth = border.width;
                    level = grpLabel._level;
                    textOverflow = grpLabel.textOverflow.toLowerCase();
                    style = border.type.toLowerCase();
                    alignment = grpLabel.textAlignment.toLowerCase();
                    startX = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.start, range, xAxis.isInversed) * (xAxis.width));
                    endX = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.end, range, xAxis.isInversed) * (xAxis.width));
                    if (xAxis.isInversed) {
                        startX = startX - endX;
                        endX = startX + endX;
                        startX = endX - startX;
                    }
                    actualText = grpLabel.text;
                    labelSize = ej.EjSvgRender.utils._measureText(actualText, null, font);
                    gap = ej.util.isNullOrUndefined(grpLabel.maximumTextWidth) ? endX - startX - borderWidth - padding : grpLabel.maximumTextWidth - padding;
                    rows = 1;
                    count = 0;
                    x = startX + xAxis.x + padding / 2;
                    y = startY + xAxis.y;

                    // to position text
                    if (opposedPosition) {
                        if (labelPosition == "outside")
                            y = xAxis.y - startY - xAxis.multiLevelLabelHeight[level] - padding - xAxis.prevHeight[level] - scrollerSize;
                        else
                            y = xAxis.y + startY - padding / 2 + xAxis.prevHeight[level];
                    } else {
                        if (labelPosition == "inside")
                            y = xAxis.y - startY - xAxis.multiLevelLabelHeight[level] - xAxis.prevHeight[level];
                        else
                            y = startY + xAxis.y + xAxis.prevHeight[level] + scrollerSize;
                    }

                    // to clip canvas
                    if (this.model.enableCanvasRendering) {
                        this.svgRenderer.ctx.save();
                        this.svgRenderer.ctx.beginPath();
                        this.svgRenderer.ctx.rect(clipX, clipY, clipWidth, clipHeight);
                        this.svgRenderer.ctx.clip();
                    }

                    // text alignment calculation
                    if (alignment == "center") {
                        x += gap / 2;
                        anchor = "middle";
                    } else if (alignment == "far") {
                        x = x + gap - borderWidth / 2;
                        anchor = "end";
                    } else {
                        anchor = "start";
                        x += borderWidth / 2;
                    }

                    var data = this._triggerMultiLevelLabelsRendering(actualText, x, y, textOverflow, font, grpLabel.border, this);
                    var actualText = data.text;
                    x = data.location.x;
                    y = data.location.y;
                    textOverflow = data.textOverflow.toLowerCase();
                    font = data.font;
                    border = data.border;
                    style = data.border.type.toLowerCase();
                    borderWidth = data.border.width;

                    // options required to render text
                    textOptions = {
                        'id': svgId + '_XAxisMultiLevelLabels_Text_' + axisIndex + '_' + i,
                        'x': x,
                        'y': style == "curlybrace" ? y + 10 : y,
                        'fill': font.color ? font.color : xAxis.multiLevelLabelsFontColor,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': anchor
                    };
                    text = actualText;
                    // calculation for wrap and wrapbyword
                    if (textOverflow != "none")
                        text = this.textOverflowMultiLevelLabels(xAxis, gap, text, actualText, textOverflow, font, labelSize, textOptions, gMultiLevelEle, this);

                    if (textOverflow != "wrap" && textOverflow != "wrapandtrim") {
                        textOptions.y += labelSize.height;
                        if (labelSize.height < xAxis.multiLevelLabelHeight[level])
                            textOptions.y = textOptions.y + xAxis.multiLevelLabelHeight[level] / 2 - labelSize.height / 2;
                        this.svgRenderer.drawText(textOptions, text, gMultiLevelEle);   // to draw text
                    }

                    // border calculation
                    if (opposedPosition) {
                        if (labelPosition == "inside")
                            y = startY + xAxis.y + xAxis.prevHeight[level] - padding / 2;
                        else
                            y = xAxis.y - startY - xAxis.multiLevelLabelHeight[level] - padding + 2 - xAxis.prevHeight[level] - scrollerSize;
                    } else {
                        if (labelPosition == "inside")
                            y = xAxis.y - startY - xAxis.multiLevelLabelHeight[level] - 3 - xAxis.prevHeight[level];
                        else
                            y = startY + xAxis.y + xAxis.prevHeight[level] + scrollerSize;
                    }
                    x = startX + xAxis.x;
                    y += borderWidth;
                    height = xAxis.multiLevelLabelHeight[level] + padding / 2;
                    width = gap + padding + borderWidth;

                    // storing region for multi level labels click event
                    var region = { bounds: { x: x, y: y, height: height, width: width }, axisIndex: axisIndex, multiLevelLabel: grpLabel };
                    this.model.multiLevelLabelRegions.push(region);

                    var path = "",
                        braceGap = ((width + borderWidth) - labelSize.width) / 2 - 2;
                    if (style == "rectangle") {
                        borderOptions = {
                            'id': svgId + '_XAxisMultiLevelLabels_Rect_' + axisIndex + '_' + i,
                            'x': x,
                            'y': y,
                            'width': width,
                            'height': height,
                            'fill': "transparent",
                            'stroke': border.color ? border.color : xAxis.multiLevelLabelsColor,
                            'stroke-width': borderWidth,
                        };
                        this.svgRenderer.drawRect(borderOptions, gMultiLevelEle);
                    } else {
                        switch (style) {
                            case "withouttopandbottomborder":
                                path = "M " + x + " " + y + " L " + x + " " + (y + height) +
                                    " M " + (x + width) + " " + y + " L " + (x + width) + " " + (y + height);
                                break;
                            case "withouttopborder":
                                if ((!opposedPosition && labelPosition == "outside") || (opposedPosition && labelPosition == "inside"))
                                    labelHeight = height;
                                else
                                    labelHeight = 0;
                                path = "M " + x + " " + (y + labelHeight) + " L " + (x + width) + " " + (y + labelHeight) + " M " + x + " " + y + " L " + x + " " +
                                    (y + height) + " M " + (x + width) + " " + y + " L " + (x + width) + " " + (y + height);
                                break;
                            case "brace":
                                if (alignment == "near") {
                                    var value = textOptions.x;
                                    value2 = textOptions.x + labelSize.width + 2;
                                }
                                else if (alignment == "center") {
                                    var value = textOptions.x - labelSize.width / 2 - 2 <= areaBounds.X + startX ? areaBounds.X + startX + padding :
                                        textOptions.x - labelSize.width / 2 - 2;
                                    var value2 = textOptions.x + labelSize.width / 2 + 2 > areaBounds.X + endX ? areaBounds.X + endX - padding :
                                        textOptions.x + labelSize.width / 2 + 2
                                } else {
                                    var value = textOptions.x - labelSize.width - 2;
                                    value2 = textOptions.x;
                                }
                                if ((!opposedPosition && labelPosition == "outside") || (opposedPosition && labelPosition == "inside"))
                                    path = "M " + x + " " + y + " L " + x + " " + (y + height / 2) +
                                        " M " + x + " " + (y + height / 2) + " L " + (value - 2) + " " + (y + height / 2) +
                                        " M " + (value2) + " " + (y + height / 2) + " L " + (x + width) + " " + (y + height / 2) +
                                        " M " + (x + width) + " " + (y + height / 2) + " L " + (x + width) + " " + (y);
                                else
                                    path = "M " + (x) + " " + (y + height) + " L " + (x) + " " + (y + height / 2) +
                                        " M " + x + " " + (y + height / 2) + " L " + (value) + " " + (y + height / 2) +
                                        " M " + (value2) + " " + (y + height / 2) + " L " + (x + width) + " " + (y + height / 2) +
                                        " M " + (x + width) + " " + (y + height) + " L " + (x + width) + " " + (y + height / 2);
                                break;
                            case "curlybrace":        // using constant values to render a curely brace
                                y = xAxis.y + startY + xAxis.prevHeight[level];
                                if (width < 30) {
                                    path = "M " + (x + width / 2 - 5) + " " + (y + 10) + " L " + (x + width / 2) + " " + (y + 15) + " L " + (x + width / 2 + 5) + " " + (y + 10);
                                }
                                else if (!opposedPosition) {
                                    if (alignment == "center") {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x + 5) + " " + (y + 10) + " " + (x + 10) + " " + (y + 10) +
                                            " L " + (x + width / 2 - 5) + " " + (y + 10) + " L " + (x + width / 2) + " " + (y + 15) +
                                            " L " + (x + width / 2 + 5) + " " + (y + 10) + " L " + (x + width - 10) + " " + (y + 10) +
                                            " C " + (x + width - 10) + " " + (y + 10) + " " + (x + width) + " " + (y + 5) + " " + (x + width) + " " + (y);
                                    } else if (alignment == "near") {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x + 5) + " " + (y + 10) + " " + (x + 10) + " " + (y + 10) +
                                            " L " + (x + 15) + " " + (y + 15) +
                                            " L " + (x + 15 + 5) + " " + (y + 10) + " L " + (x + width - 10) + " " + (y + 10) +
                                            " C " + (x + width - 10) + " " + (y + 10) + " " + (x + width) + " " + (y + 5) + " " + (x + width) + " " + (y);
                                    } else {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x + 5) + " " + (y + 10) + " " + (x + 10) + " " + (y + 10) +
                                            " L " + (x + width - 20) + " " + (y + 10) + " L " + (x + width - 15) + " " + (y + 15) +
                                            " L " + (x + width - 10) + " " + (y + 10) + " L " + (x + width - 10) + " " + (y + 10) +
                                            " C " + (x + width - 10) + " " + (y + 10) + " " + (x + width) + " " + (y + 5) + " " + (x + width) + " " + (y);
                                    }
                                }
                                else {
                                    path = "M " + x + " " + y + " C " + x + " " + y + " " + (x + 5) + " " + (y + 10) + " " + (x + 10) + " " + (y + 10) +
                                        " L " + (x + width / 2 - 5) + " " + (y + 10) + " L " + (x + width / 2) + " " + (y + 15) +
                                        " L " + (x + width / 2 + 5) + " " + (y + 10) + " L " + (x + width - 10) + " " + (y + 10) +
                                        " C " + (x + width - 10) + " " + (y + 10) + " " + (x + width) + " " + (y + 5) + " " + (x + width) + " " + (y);
                                }
                                break;
                        }
                        if (path) {
                            borderOptions = {
                                'id': svgId + '_XAxisMultiLevelLabels_Rect_' + axisIndex + '_' + i,
                                'd': path,
                                'stroke': border.color ? border.color : xAxis.multiLevelLabelsColor,
                                'stroke-width': border.width,
                                'fill': 'none'
                            }
                            this.svgRenderer.drawPath(borderOptions, gMultiLevelEle);
                        }
                    }
                    if (this.model.enableCanvasRendering)
                        this.svgRenderer.ctx.restore();

                    $(gMultiLevelEle).appendTo(this.gXaxisEle);
                }
            }
        },

        _drawYAxisMultiLevelLabels: function (axisIndex, yAxis) {          // to render y axis multi level labels
            // declaration 
            var i, j, x, y, rows, gap, labelSize, grpLabel, font, startX, startY, endX, endY, textOptions, textOverflow, padding = 5, level, maximumTextWidth, actualText, space, count, text, height, width, value1, value2,
                textCollection, borderOptions, border, style, alignment, svgId = this.svgObject.id, range = yAxis.visibleRange, clipX, clipY, clipWidth, clipHeight, textX, data, borderWidth, path, braceGap, newHeight,
                gMultiLevelEle = this.svgRenderer.createGroup({
                    'id': svgId + '_YAxisMultiLevelLabels' + '_' + axisIndex, 'clip-path': 'url(#' + this.svgObject.id +
                        '_YAxis_Clippath_' + axisIndex + ")"
                }), anchor = "middle", areaBounds = this.model.m_AreaBounds, opposedPosition = yAxis.opposedPosition,
                labelPosition = yAxis.labelPosition.toLowerCase(), labelBorder = yAxis.labelBorder, multiLevelLabelWidth = yAxis._multiLevelLabelHeight,
                startX = yAxis.majorTickLines.size + yAxis._LableMaxWidth.width + (labelBorder.width) + 2 * padding,
                scrollerSize = yAxis._isScroll ? this.model.scrollerSize : 0;

            // to clip the multi level labels
            clipY = yAxis.y;
            clipWidth = multiLevelLabelWidth + padding;
            clipHeight = yAxis.height + padding;
            if (opposedPosition) {
                if (labelPosition == "outside")
                    clipX = yAxis.x + startX - padding + scrollerSize;
                else
                    clipX = yAxis.x - multiLevelLabelWidth - startX + padding;
            }
            else {
                if (labelPosition == "outside")
                    clipX = yAxis.x - multiLevelLabelWidth - startX - scrollerSize;
                else
                    clipX = yAxis.x + startX - padding;
            }
            var clipRectOptions = {
                'id': this.svgObject.id + '_YAxis_Clippath_' + axisIndex,
                'x': clipX,
                'y': yAxis.y,
                'width': clipWidth,
                'height': clipHeight,
                'fill': 'white',
                'stroke-width': 1,
                'stroke': 'Gray'
            };
            this.svgRenderer.drawClipPath(clipRectOptions, gMultiLevelEle);

            for (i = 0; i < yAxis.multiLevelLabels.length; i++) {
                // assignment
                grpLabel = $.extend(true, {}, this.model.multiLevelLabelsDefault, yAxis.multiLevelLabels[i]);
                if (grpLabel.visible && ((grpLabel.start >= range.min && grpLabel.start <= range.max)
                    || (grpLabel.end >= range.min && grpLabel.end <= range.max) ||
                    (grpLabel.start < range.min && grpLabel.end > range.max))) {
                    font = grpLabel.font;
                    border = grpLabel.border;
                    level = grpLabel._level;
                    maximumTextWidth = grpLabel.maximumTextWidth;
                    textOverflow = grpLabel.textOverflow.toLowerCase();
                    style = border.type.toLowerCase();
                    alignment = grpLabel.textAlignment.toLowerCase();
                    startY = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.start, range, yAxis.isInversed) * (yAxis.height));
                    endY = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.end, range, yAxis.isInversed) * (yAxis.height));
                    if (yAxis.isInversed) {
                        startY = startY - endY;
                        endY = startY + endY;
                        startY = endY - startY;
                    }
                    actualText = grpLabel.text;
                    labelSize = ej.EjSvgRender.utils._measureText(actualText, null, font);
                    gap = endY - startY - border.width;
                    space = ej.util.isNullOrUndefined(maximumTextWidth) ? yAxis.multiLevelLabelHeight[level] + padding : maximumTextWidth - padding;
                    rows = 1; count = 0; textX = 0;
                    x = yAxis.x - startX - yAxis.prevHeight[level] - yAxis.multiLevelLabelHeight[level] / 2 + border.width - padding / 2;
                    y = yAxis.height + yAxis.y - startY - (gap / 2);

                    // for text position
                    if ((opposedPosition)) {
                        if (labelPosition == "outside")
                            x = yAxis.x + startX + yAxis.multiLevelLabelHeight[level] / 2 + yAxis.prevHeight[level] + border.width + scrollerSize;
                        else
                            x = yAxis.x - startX - yAxis.multiLevelLabelHeight[level] / 2 - yAxis.prevHeight[level] + border.width + padding / 2;
                    }
                    else {
                        if (labelPosition == "inside")
                            x = yAxis.x + startX + yAxis.multiLevelLabelHeight[level] / 2 + yAxis.prevHeight[level] - padding / 2;
                        else
                            x = x + textX - scrollerSize;
                    }
                    if (this.model.enableCanvasRendering) {
                        this.svgRenderer.ctx.save();
                        this.svgRenderer.ctx.beginPath();
                        this.svgRenderer.ctx.rect(clipX, clipY, clipWidth, clipHeight);
                        this.svgRenderer.ctx.clip();
                    }

                    // text alignment calculation
                    if (alignment == "far")
                        y = y + gap / 2 - labelSize.height / 2;
                    else if (alignment == "near")
                        y = y - gap / 2 + labelSize.height;
                    else
                        y = y + labelSize.height / 4;
                    data = this._triggerMultiLevelLabelsRendering(actualText, x, y, textOverflow, font, grpLabel.border, this);
                    var actualText = data.text;
                    x = data.location.x;
                    y = data.location.y;
                    textOverflow = data.textOverflow;
                    font = data.font;
                    border = data.border;
                    style = border.type.toLowerCase();
                    borderWidth = border.width;

                    // options required to render text
                    textOptions = {
                        'id': svgId + '_YAxisMultiLevelLabels_Text_' + axisIndex + '_' + i,
                        'x': style == "curlybrace" ? (opposedPosition ? x + textX + 10 : x + textX - 10) : x + textX,
                        'y': y,
                        'fill': font.color ? font.color : yAxis.multiLevelLabelsFontColor,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': anchor
                    };

                    text = actualText;
                    // calculation for wrap and wrapandtrim
                    if (textOverflow != "none")
                        text = this.textOverflowMultiLevelLabels(yAxis, space, text, actualText, textOverflow, font, labelSize, textOptions, gMultiLevelEle, this);
                    if (textOverflow != "wrap" && textOverflow != "wrapandtrim")
                        this.svgRenderer.drawText(textOptions, text, gMultiLevelEle);   // to draw text
                    x = x - padding / 2 - yAxis.multiLevelLabelHeight[level] / 2;
                    y = yAxis.y + yAxis.height - endY + border.width;
                    height = endY - startY;
                    width = yAxis.multiLevelLabelHeight[level] + padding;
                    path = "";
                    braceGap = ((width + border.width) - multiLevelLabelWidth) / 2 - 2;

                    // storing region for multi level labels click event
                    var region = { bounds: { x: x, y: y, height: height, width: width }, axisIndex: axisIndex, multiLevelLabel: grpLabel };
                    this.model.multiLevelLabelRegions.push(region);

                    if (style == "rectangle") {
                        borderOptions = {
                            'id': svgId + '_YAxisMultiLevelLabels_Rect_' + axisIndex + '_' + i,
                            'x': x,
                            'y': y,
                            'width': width,
                            'height': height,
                            'fill': "transparent",
                            'stroke': border.color ? border.color : yAxis.multiLevelLabelsColor,
                            'stroke-width': border.width,
                        };
                        this.svgRenderer.drawRect(borderOptions, gMultiLevelEle);
                    } else {
                        switch (style) {
                            case "withouttopandbottomborder":
                                path = "M" + " " + x + " " + (y + height) + " " + "L" + " " + (x + width) + " " + (y + height) + " " +
                                    "M" + " " + x + " " + y + " " + "L" + " " + (x + width) + " " + y;
                                break;
                            case "withouttopborder":
                                if ((!opposedPosition && labelPosition == "outside") || (opposedPosition && labelPosition == "inside"))
                                    labelWidth = 0;
                                else
                                    labelWidth = width;
                                path = "M" + " " + x + " " + (y + height) + " " + "L" + " " + (x + width) + " " + (y + height) + " " +
                                    "M" + " " + x + " " + y + " " + "L" + " " + (x + width) + " " + y +
                                    " M" + " " + (x + labelWidth) + " " + (y + height) + " " + "L" + " " + (x + labelWidth) + " " + (y);
                                break;
                            case "brace":
                                value1 = textOptions.y - labelSize.height / 2 - 4;
                                value2 = textOptions.y + labelSize.height / 4 + 2;
                                if ((!opposedPosition && labelPosition == "outside") || (opposedPosition && labelPosition == "inside"))
                                    path = "M " + (x + width) + " " + y + " L " + (x + width / 2) + " " + y +
                                        " M " + (x + width / 2) + " " + y + " L " + (x + width / 2) + " " + value1 +
                                        " M " + (x + width / 2) + " " + value2 + " L " + (x + width / 2) + " " + (y + height) +
                                        " M " + (x + width / 2) + " " + (y + height) + " L " + (x + width) + " " + (y + height);
                                else
                                    path = "M " + (x) + " " + y + " L " + (x + width / 2) + " " + y +
                                        " M " + (x + width / 2) + " " + y + " L " + (x + width / 2) + " " + value1 +
                                        " M " + (x + width / 2) + " " + value2 + " L " + (x + width / 2) + " " + (y + height) +
                                        " M " + (x + width / 2) + " " + (y + height) + " L " + (x) + " " + (y + height);
                                break;
                            case "curlybrace":               // using constant values to render a curely brace
                                x = yAxis.x - startX - yAxis.prevHeight[level];
                                newHeight = height - 10;
                                if (height < 30) {
                                    if (opposedPosition) {
                                        x = yAxis.x + startX + yAxis.prevHeight[level];
                                        newHeight = height - 10;
                                        path =
                                            " M " + (x + 10) + " " + (y + newHeight / 2) + " " + " L " + (x + 15) + " " + (y + newHeight / 2 + 5) +
                                            " L " + (x + 10) + " " + (y + newHeight / 2 + 10);
                                    }
                                    else
                                        path = "M " + (x - 10) + " " + (y + height / 2 - 5) + " L " + (x - 15) + " " + (y + height / 2) + " L " + (x - 10) + " " + (y + height / 2 + 5);
                                }
                                else if (!opposedPosition) {
                                    if (alignment == "center") {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x - 10) + " " + y + " " + (x - 10) + " " + (y + 10) +
                                            " L " + (x - 10) + " " + (y + newHeight / 2) + " L " + (x - 15) + " " + (y + newHeight / 2 + 5) +
                                            " L " + (x - 10) + " " + (y + newHeight / 2 + 10) + " L " + (x - 10) + " " + (y + newHeight) +
                                            " C " + (x - 10) + " " + (y + newHeight) + " " + (x - 5) + " " + (y + newHeight + 10) + " " + x + " " + (y + newHeight + 10);
                                    } else if (alignment == "far") {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x - 10) + " " + y + " " + (x - 10) + " " + (y + 10) +
                                            " L " + (x - 10) + " " + (y + newHeight - 10) + " " + " L " + (x - 15) + " " + (y + newHeight - 10 + 5) +
                                            " L " + (x - 10) + " " + (y + newHeight) + " L " + (x - 10) + " " + (y + newHeight) +
                                            " C" + (x - 10) + " " + (y + newHeight) + " " + (x - 10) + " " + (y + newHeight + 10) + " " + x + " " + (y + newHeight + 10);
                                    } else {
                                        path = "M " + x + " " + y + " C " + x + " " + y + " " + (x - 10) + " " + y + " " + (x - 10) + " " + (y + 10) +
                                            " L " + (x - 15) + " " + (y + 10 + 5) +
                                            " L " + (x - 10) + " " + (y + 10 + 10) + " L " + (x - 10) + " " + (y + newHeight) +
                                            " C" + (x - 10) + " " + (y + newHeight) + " " + (x - 5) + " " + (y + newHeight + 10) + " " + x + " " + (y + newHeight + 10);
                                    }
                                } else {
                                    x = yAxis.x + startX + yAxis.prevHeight[level];
                                    newHeight = height - 10;
                                    path = "M " + x + " " + y + " C " + x + " " + y + " " + (x + 10) + " " + y + " " + (x + 10) + " " + (y + 10) +
                                        " L " + (x + 10) + " " + (y + newHeight / 2) + " " + " L " + (x + 15) + " " + (y + newHeight / 2 + 5) +
                                        " L " + (x + 10) + " " + (y + newHeight / 2 + 10) + " L " + (x + 10) + " " + (y + newHeight) +
                                        " C" + (x + 10) + " " + (y + newHeight) + " " + (x + 5) + " " + (y + newHeight + 10) + " " + x + " " + (y + newHeight + 10);
                                }
                        }
                        if (path) {
                            borderOptions = {
                                'id': svgId + '_YAxisMultiLevelLabels_Rect_' + axisIndex + '_' + i,
                                'd': path,
                                'stroke': border.color ? border.color : yAxis.multiLevelLabelsColor,
                                'stroke-width': border.width,
                                'fill': "none"
                            }
                            this.svgRenderer.drawPath(borderOptions, gMultiLevelEle);
                        }
                    }
                    if (this.model.enableCanvasRendering)
                        this.svgRenderer.ctx.restore();
                    $(gMultiLevelEle).appendTo(this.gYaxisEle);
                }
            }
        },
        // to find highest label textwidth for textanchor positions
        _getLabelCollection: function (labelText, areaBoundWidth, xAxis, gap, options) {
            var labelTextColl = [], arrColl = [], length;
            if (typeof labelText == "string" && labelText.indexOf('<br>') != -1)
                labelTextColl = labelText.split('<br>');
            else
                labelTextColl.push(labelText);
            gap = gap <= 0 ? xAxis.width / xAxis.labels.length : gap;
			length = labelTextColl.length;
            for (var col = 0; col < length; col++) {
                textcoll = this.rowscalculation(labelTextColl[col].toString(), areaBoundWidth, xAxis, gap, options);
                for (var t = 0; t < textcoll.length; t++) {
                    arrColl.push(textcoll[t]);
                }
            }
            return arrColl;
        },

        _drawXAxisLabels: function (axisIndex, xAxis) {
            var gTickEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisLabels' + '_' + axisIndex, 'cursor': 'default' }),
                gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisLabels' + '_' + axisIndex, 'cursor': 'default' }),
                prevLabels = [],
                bounds, areaBounds = this.model.m_AreaBounds,
                isCanvas = this.model.enableCanvasRendering,
                labelSize,
                axisName = (xAxis.name).replace(/[^a-zA-Z0-9]/g, ""),
                opposedPosition = xAxis._opposed,
                valueType = xAxis._valueType,
                pixel = 3,
                xAxisAignment = xAxis.alignment.toLowerCase(),
                labelIntersectAction = xAxis.labelIntersectAction,
                labelPlacement = xAxis.labelPlacement.toLowerCase(),
                x, y, flag = false, count = 0,
                insideTicks = xAxis.tickLinesPosition == 'inside',
                labelMaxWidth = xAxis._LableMaxWidth,
                labelMaxHeight = labelMaxWidth.height,
                labelMaxRow = labelMaxWidth.rows == 0 ? 1 : labelMaxWidth.rows,
                vmlrendering = this.svgRenderer.vmlNamespace,
                lineWidth = xAxis.axisLine.width,
                font = xAxis.font,
                labelRotation = xAxis.rotationValue,
                textSize, trimLabelText,
                textWidth,
                textHeight,
                chartAreaWidth = areaBounds.Width,
                chartAreaX = areaBounds.X, anchor,
                intersectAction = xAxis.labelIntersectAction.toLowerCase(),
                svgWidth = $(this.svgObject).width(), maxLineWidth, gap,
                textanchor = null, newGapVal1, newGapVal2, nextPointX, nextLabel, nextLabelValue,
                nextPoint, nextTextWidth, value,
                textcollection = [], label, labelText,
                trimGap = xAxis.maximumLabelWidth, // this holds maximumLabelWidth value      
                range = xAxis.visibleRange,
                areaBoundWidth = chartAreaWidth,
                majorTickSize = xAxis.majorTickLines.size,
                labels = xAxis.visibleLabels,
                valueType = (xAxis.valueType && xAxis.valueType.toLowerCase()),
                axisWidth = xAxis.width,
                inversed = xAxis.isInversed,
                textheight,
                majorTickWidth = xAxis.majorTickLines.width,
                position, lastLabel, diff,
                current = false, scrollerSize = this.model.scrollerSize,
                line, textcoll, count, displayText,
                preLabel,
                temp,
                prePoint,
                preTextWidth,
                textAnchor = xAxis.rotateOn.toLowerCase(),
                insideLabels = xAxis.labelPosition == 'inside',
                count1 = 0, multipleRowsColl = [], nextLabelCollection = [], lblCollection = [], highestText;
            isScroll = xAxis._isScroll && !(xAxis.scrollbarSettings.pointsLength != null && xAxis.scrollbarSettings.pointsLength < xAxis.maxPointLength);

            this.edgeLabel = false;

            if (axisIndex != 0 && ((insideLabels && insideTicks) || (insideLabels && !insideTicks)) && (!(xAxis.y == (areaBounds.Height + areaBounds.Y) || (xAxis.y == areaBounds.Y))))
                xAxis.y = (!opposedPosition) ? Math.floor(xAxis.y + labelMaxHeight) : Math.floor(xAxis.y - labelMaxHeight);

            else if (axisIndex != 0 && (insideLabels && insideTicks) && (!(xAxis.y == (areaBounds.Height + areaBounds.Y) || (xAxis.y == areaBounds.Y))))
                xAxis.y = (!opposedPosition) ? Math.floor(xAxis.y + majorTickSize) : Math.floor(xAxis.y - majorTickSize);

            else {
                xAxis._y = Math.floor(xAxis.y);//to store the current positons of the labels,before the property showNextToAxisLine as false.
                xAxis.y = (!xAxis.showNextToAxisLine) ? opposedPosition ? Math.floor(areaBounds.Y) : Math.floor(areaBounds.Height + areaBounds.Y) : Math.floor(xAxis.y);
            }

            // loop to draw labels
            for (var i = 0; i < labels.length; i++) {
                label = labels[i];
                labelText = label.displayText = ej.util.isNullOrUndefined(label.displayText) ? label.Text : label.displayText;
                if (ej.EjSvgRender.utils._inside(label.Value, range)) {
                    gap = axisWidth / labels.length;       //space between ticks					 
                    if (!ej.isNullOrUndefined(valueType)) {
                        if (i < labels.length - 1 && valueType == "datetimecategory" && intersectAction == "wrap" && labelPlacement == "betweenticks") {
                            nextLabel = labels[i + 1];
                            label.Value -= .5;
                            nextLabelValue = nextLabel.Value - .5;
                        }
                    }
                    var pointX = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(label.Value, range, inversed) * (axisWidth)));
                    if (!ej.isNullOrUndefined(valueType)) {
                        if (i < labels.length - 1 && valueType == "datetimecategory" && intersectAction == "wrap" && labelPlacement == "betweenticks") {
                            nextPointX = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(nextLabelValue, range, inversed) * (axisWidth)));
                            newGapVal1 = (i == 0) ? (xAxis.x + pointX) + (majorTickWidth - 0.5) : (xAxis.x + pointX) + (majorTickWidth + 0.5);
                            newGapVal2 = (xAxis.x + nextPointX) + (majorTickWidth + 0.5);
                            gap = newGapVal2 - newGapVal1;
                        }
                        else if (valueType == "datetimecategory" && intersectAction == "wrap" && labelPlacement == "betweenticks") {
                            gap = (axisWidth + xAxis.x) - newGapVal2;
                            newGapVal1 = newGapVal2;
                        }
                        else if (valueType == "datetimecategory" && intersectAction == "wrap" && labelPlacement == "onticks") {
                            gap = axisWidth / xAxis.labels.length;
                        }
                    }
                    xAxis._gap = newGapVal1;

                    this.edgeLabel = false; // flag to find the supprot for edge labels
                    if (typeof labelText == "string" && labelText.indexOf('<br>') != -1)
                        highestText = ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, labelText);
                    else
                        highestText = labelText;
                    textSize = ej.EjSvgRender.utils._measureText(highestText, areaBoundWidth, xAxis.font);
                    textWidth = textSize.width;
                    textHeight = textSize.height;
                    count = 0;
                    flag = false;

                    //To Perform trim 
                    if (intersectAction == "trim" || xAxis.enableTrim) {
                        if (labelPlacement == "onticks") {
                            if (i != labels.length - 1) {
                                var firstLabel = label;
                                var secondLabel = labels[i + 1];
                                lblCollection = [], nextLabelCollection = [];
                                nextLabel = labels[i + 1];
                                if ((typeof nextLabel.Text == "string" && nextLabel.Text.indexOf('<br>') != -1) || (typeof label.Text == "string" && label.Text.indexOf('<br>') != -1)) {
                                    lblCollection = label.Text.split('<br>');
                                    nextLabelCollection = nextLabel.Text.split('<br>');
                                }
                                else {
                                    nextLabelCollection.push(nextLabel.Text);
                                    if (label.displayText)
                                        lblCollection.push(label.displayText);
                                    else
                                        lblCollection.push(label.Text);
                                }
                                for (var q = 0; q < nextLabelCollection.length; q++) {
                                    nextPoint = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(nextLabel.Value, range, inversed) * (axisWidth)));
                                    nextTextWidth = ej.EjSvgRender.utils._measureText(nextLabelCollection[q], chartAreaWidth, font).width;
                                    value = nextPoint - nextTextWidth / 2;
                                    count = 0;
                                    flag1 = true;
                                    for (var q1 = 0; q1 < lblCollection.length && flag1; q1++) {
                                        var textWidth = ej.EjSvgRender.utils._measureText(lblCollection[q1], areaBoundWidth, xAxis.font).width;
                                        while (value < pointX + textWidth / 2 && count < 2) {             // intersect
                                            count++;
                                            if (nextTextWidth > textWidth) {                            // getting max label
                                                otherLabel = trimLabel = nextLabelCollection[q];
                                                current = false;
                                            }
                                            else {
                                                trimLabel = lblCollection[q1];
                                                current = true;
                                            }
                                            trimLabelText = trimLabel;
                                            var trimmedLabel = {};
                                            trimmedLabel.displayText = trimLabel;
                                            for (var t = 1; t < trimLabelText.length; t++) {
                                                trimLabelText = trimmedLabel.displayText.substring(0, t) + '... ';
                                                newTextWidth = ej.EjSvgRender.utils._measureText(trimLabelText, chartAreaWidth, font).width;
                                                if (!current) {                                                  // to trim next label
                                                    value = nextPoint - newTextWidth / 2;
                                                    if (value < pointX + textWidth / 2) {
                                                        if (t - 1 != 0)
                                                            trimLabelText = trimLabelText.toString().substring(0, t - 1) + '... ';
                                                        nextTextWidth = newTextWidth;
                                                        trimmedLabel.displayText = secondLabel.displayText = trimLabelText;
                                                        nextLabelCollection[q] = trimLabelText;
                                                        flag1 = false;
                                                        break;
                                                    }
                                                }
                                                else {                                                           // to trim current label
                                                    value = nextPoint - nextTextWidth / 2;
                                                    if (value < pointX + newTextWidth / 2) {
                                                        if (t - 1 != 0)
                                                            trimLabelText = trimLabelText.toString().substring(0, t - 1) + '... ';
                                                        textWidth = newTextWidth;
                                                        labelText = trimmedLabel.displayText = firstLabel.displayText = trimLabelText;
                                                        lblCollection[q1] = trimLabelText;
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            else if (i == labels.length - 1)
                                lblCollection = nextLabelCollection;
                        }
                        else if (labelPlacement == "betweenticks") {
                            var derivedGap = (xAxis.enableTrim) ? trimGap : gap;
                            var lblCollection = [];
                            if (typeof labelText == "string" && labelText.indexOf('<br>') != -1)
                                lblCollection = labelText.split('<br>');
                            else
                                lblCollection.push(labelText);
                            var lblColLength = lblCollection.length;
                            for (var q = 0; q < lblColLength; q++) {
                                label.displayText = lblCollection[q];
                                textSize = ej.EjSvgRender.utils._measureText(lblCollection[q], areaBoundWidth, xAxis.font);
                                textWidth = textSize.width;
                                if (textWidth > derivedGap && lblCollection[q] != "") { // check textwidth is greater than gap
                                    for (var t = 1; t < lblCollection[q].toString().length; t++) {
                                        lblCollection[q] = label.displayText.toString().substring(0, t) + '... ';
                                        textWidth = ej.EjSvgRender.utils._measureText(lblCollection[q], chartAreaWidth, font).width;
                                        if (textWidth >= derivedGap) {
                                            lblCollection[q] = lblCollection[q].toString().substring(0, t - 1) + '... ';
                                            label.displayText = lblCollection[q];
                                            if (i == labels.length - 1) {
                                                if (((pointX + xAxis.x) + (textWidth / 2) > (svgWidth)) && derivedGap == gap) {
                                                    derivedGap -= (textWidth / 2);
                                                    t = 1;
                                                    continue;
                                                }
                                            }
                                            break;
                                        }
                                    }
                                    label.displayText = lblCollection[q]; // trimed text is assigned to displayText
                                }
                            }
                        }
                        if (xAxis._valueType != "double" || typeof label.displayText == "string") {
                            highestText = lblCollection.length > 0 ? ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, lblCollection, null) : highestText;
                            textSize = ej.EjSvgRender.utils._measureText(highestText, chartAreaWidth, font);
                        }
                    }
                    else {
                        if (typeof labelText == "string" && labelText.indexOf('<br>') != -1)
                            textSize = ej.EjSvgRender.utils._measureText(highestText, chartAreaWidth, font);
                        else
                            textSize = ej.EjSvgRender.utils._measureText(label.displayText, chartAreaWidth, font);
                    }
                    anchor = textSize.width / 2;
                    textHeight = textSize.height;
                    textWidth = textSize.width;
                    if (xAxis.majorGridLines.width > majorTickWidth)
                        maxLineWidth = xAxis.majorGridLines.width
                    else maxLineWidth = majorTickWidth;
                    if (!ej.util.isNullOrUndefined(label.Text)) {
                        if (xAxisAignment == "near")
                            x = pointX + xAxis.x + maxLineWidth + ((valueType == "category" && labelPlacement != "onticks") ? -(axisWidth / xAxis.actualRange.delta) / 2 + pixel : -textSize.width - pixel);
                        else if (xAxisAignment == "far")
                            x = (pointX + xAxis.x) + ((valueType == "category" && labelPlacement != "onticks") ? +((axisWidth / xAxis.actualRange.delta) / 2) - textSize.width : +maxLineWidth + pixel);
                        else
                            x = pointX + xAxis.x - anchor;
                        if ((insideLabels && insideTicks) || ((insideLabels && !insideTicks) && intersectAction == 'multiplerows')) {
                            y = (opposedPosition) ? (xAxis.y + majorTickSize + textHeight / 2 + (lineWidth / 2)
                                + (labelMaxHeight / (2 * labelMaxRow)) - 5) : (xAxis.y - majorTickSize - (lineWidth / 2)
                                    - (labelMaxHeight / (2 * labelMaxRow)) + 5);
                        }
                        else if (insideLabels && !insideTicks) {
                            y = (opposedPosition) ? (xAxis.y + textHeight / 2 + (lineWidth / 2)
                                + (labelMaxHeight / (2 * labelMaxRow)) - 5) : (xAxis.y - (lineWidth / 2)
                                    - (labelMaxHeight / (2 * labelMaxRow)) + 5);
                        }
                        else if ((!insideLabels && !insideTicks) || ((!insideLabels && insideTicks) && intersectAction == 'multiplerows')) {
                            y = (opposedPosition) ? (xAxis.y - majorTickSize + textHeight / 2 - (lineWidth / 2)
                                - (labelMaxHeight / (2 * labelMaxRow)) - 5) : (xAxis.y + majorTickSize + (lineWidth / 2)
                                    + (labelMaxHeight / (2 * labelMaxRow)) + 5);
                            y = y + ((isScroll ? (opposedPosition ? - scrollerSize : scrollerSize) : 0));
                        }
                        else if (!insideLabels && insideTicks) {
                            y = (opposedPosition) ? (xAxis.y + textHeight / 2 - (lineWidth / 2)
                                - (labelMaxHeight / (2 * labelMaxRow)) - 5) : (xAxis.y + (lineWidth / 2)
                                    + (labelMaxHeight / (2 * labelMaxRow)) + 5);
                            y = y + ((isScroll ? (opposedPosition ? - scrollerSize : scrollerSize) : 0));
                        }


                        if (insideLabels && !insideTicks) {
                            if (labelRotation == 90 || intersectAction == 'rotate90')
                                y = (opposedPosition) ? y : y - majorTickSize;
                        }
                        else if (!insideLabels && insideTicks) {
                            if (xAxis.labelRotation == 90 || intersectAction == 'rotate90')
                                y = (opposedPosition) ? y - majorTickSize : y - majorTickSize;
                        }
                        else if (insideLabels && insideTicks) {
                            if (xAxis.labelRotation == 90 || intersectAction == 'rotate90')
                                y = (opposedPosition) ? y : y - majorTickSize;
                        }

                        var options = {
                            'id': this.svgObject.id + '_' + axisName + '_XLabel_' + i,
                            'x': x,
                            'y': y,
                            'fill': font.color,
                            'font-size': font.size,
                            'font-family': font.fontFamily,
                            'font-style': font.fontStyle,
                            'font-weight': font.fontWeight,
                            'opacity': font.opacity
                        };

                        // To set position of edge labels
                        if (xAxis.edgeLabelPlacement) {
                            position = xAxis.edgeLabelPlacement.toLowerCase();
                            lastLabel = labels.length - 1;
                            switch (position) {
                                case "none":
                                    break;
                                case "shift":
                                    {
                                        if (i == 0) {  // Shift first label
                                            if (options.x < xAxis.x) {
                                                diff = xAxis.x - options.x;
                                                options.x = x = options.x + diff;
                                                this.diff = diff;
                                                this.edgeLabel = true;
                                            }
                                        } else if (i == lastLabel)  // Shift last label
                                            if (options.x + textSize.width > xAxis.x + xAxis.width) {
                                                diff = (options.x + textSize.width) - (xAxis.x + xAxis.width);
                                                options.x = x = options.x - diff;
                                                this.diff = diff;
                                                this.edgeLabel = true;
                                            }
                                        break;
                                    }
                                case "hide": // to hide the edge labels
                                    if ((i == 0 && options.x < xAxis.x) || (i == lastLabel && options.x + textWidth > chartAreaWidth + chartAreaX)) {
                                        labelText = "";
                                    }
                            }
                        }
                        if (intersectAction == "wrap" || intersectAction == "wrapbyword") {
                            var arrColl = this._getLabelCollection(labelText, areaBoundWidth, xAxis, gap, options);                                     
                            var text = ej.EjSvgRender.utils._getHighestLabel(xAxis, $(this.svgObject).width(), arrColl, null);
                            textWidth = ej.EjSvgRender.utils._measureText(text, chartAreaWidth, font).width;
                        }
                        //To perform rotation             
                        if (labelRotation != 0 && !vmlrendering) {
                            label.displayText = typeof label.displayText == "string" && label.displayText.indexOf('<br>') != -1 ? ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, label.displayText) : label.displayText;
                            this.labelRotation(xAxis, x + anchor, y, options, label, labelRotation);
                        }
                        //To perform labelIntersect Actions none , wrap, hide ,multiplerows
                        if (xAxis.labelIntersectAction || xAxis.enableTrim) {
                            this.diff = ej.util.isNullOrUndefined(this.diff) ? 0 : this.diff;
                            if (intersectAction == 'none' && !xAxis.enableTrim) {
                                if (typeof labelText == "string" && labelText.indexOf('<br>') != -1) {
                                    var labelTextColl = labelText.split('<br>');

                                    if (!insideLabels)
                                        options.y = (opposedPosition) ? options.y - (textHeight * (labelTextColl.length - 1)) : options.y;
                                    else
                                        options.y = (opposedPosition) ? options.y : options.y - (textHeight * (labelTextColl.length - 1));
                                    if (labelRotation != 0) {
                                        options.x = options.x + textWidth / 2;
                                        options['text-anchor'] = textAnchor;
                                    }

                                    this.svgRenderer.drawText(options, labelTextColl, isCanvas ? highestText : gTickEle);
                                }
                                else {
                                    if ((textAnchor == "start") && labelRotation !=0 && labelRotation != -360 && labelRotation != 360) {
                                        options.x = options.x + textWidth / 2;
                                        options['text-anchor'] = textAnchor;
                                    }
                                    this.svgRenderer.drawText(options, labelText, isCanvas ? highestText : gTickEle);
                                }
                                //create region to chart axis labels
                                labels[i].region = this.calculateRegion(labelText, font, options, label);
                                this.model.xAxisLabelRegions.push(labels[i].region)
                                if (insideLabels)
                                    $(gTickEle).appendTo(this.gXaxisTickEle);
                                else
                                    $(gTickEle).appendTo(this.gXaxisEle);
                                continue;
                            }
                            else if ((intersectAction == 'wrap' || intersectAction == 'wrapbyword') && !xAxis.enableTrim) {

                                line = 0;
                                var labelTextColl = [], arrColl = [];
                                if (typeof labelText == "string" && labelText.indexOf('<br>') != -1)
                                    labelTextColl = labelText.split('<br>');
                                else
                                    labelTextColl.push(labelText);
                                displayText = '';
                                gap = gap <= 0 ? axisWidth / labels.length : gap;
                                for (var col = 0; col < labelTextColl.length; col++) {
                                    textcoll = this.rowscalculation(labelTextColl[col].toString(), areaBoundWidth, xAxis, gap, options);
                                    for (var t = 0; t < textcoll.length; t++) {
                                        arrColl.push(textcoll[t]);
                                        displayText = displayText + textcoll[t];
                                    }
                                }
                                options.x = options.x + anchor;
                                if (!(displayText.indexOf("...") != -1))
                                    displayText = labelText;
                                var highestText = ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, arrColl, null);
                                var textSize = ej.EjSvgRender.utils._measureText(highestText, chartAreaWidth, font);
                                var textWidth = textSize.width;
                                options.x = options.x - (textWidth / 2);
                                if (!insideLabels)
                                    options.y = (opposedPosition) ? options.y - (textHeight * (arrColl.length - 1)) : options.y;
                                else
                                    options.y = (opposedPosition) ? options.y : options.y - (textHeight * (arrColl.length - 1));

                                if (labelRotation != 0 && labelRotation != -360 && labelRotation != 360) {
                                    options['text-anchor'] = textAnchor;
                                    options.x = options.x + (textWidth / 2);
                                }
                                this.svgRenderer.drawText(options, arrColl, isCanvas ? highestText : gTickEle);

                                labelSize = ej.EjSvgRender.utils._measureText(arrColl[0], null, font);
                                var colLength = arrColl.length;
                                textheight = labelSize.height * arrColl.length;
                                bounds = { x: options.x, y: options.y, width: textWidth, height: textheight - textheight / (colLength) };
                                labels[i].region = { bounds: bounds, labelText: label.Text, displayText: displayText };
                                labels[i].displayText = displayText;
                                this.model.xAxisLabelRegions.push(labels[i].region)
                                continue;
                            }
                            else if (intersectAction == 'hide') {
                                var xAxisLabelLength = labels.length - 1;
                                for (var j = 0; j < i; j++) {
                                    // loop to get previous label

                                    preLabel = labels[j];
                                    temp = 0;
                                    prePoint = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(preLabel.Value, range, xAxis.isInversed) * (xAxis.width)));
                                    preTextWidth = ej.EjSvgRender.utils._measureText(preLabel.displayText, areaBoundWidth, xAxis.font).width;
                                    value = prePoint + ((xAxis.isInversed) ? -preTextWidth / 2 : preTextWidth / 2);
                                    value = (j == 0) ? value + this.diff : value;
                                    var width = (preTextWidth == 0) ? preTextWidth : textWidth;
                                    if ((i != xAxisLabelLength) || (i == xAxisLabelLength && textWidth <= preTextWidth))
                                        width = width / 2;
                                    if (position == "shift" && i == xAxisLabelLength) {
                                        var nextXLabel = labels[i],
                                            nextPoint = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(nextXLabel.Value, range, xAxis.isInversed) * (xAxis.width))),
                                            nextTextWidth = ej.EjSvgRender.utils._measureText(nextXLabel.displayText, areaBoundWidth, xAxis.font).width,
                                            nextValue = nextPoint + ((xAxis.isInversed) ? nextTextWidth / 2 : -nextTextWidth / 2);
                                        if ((xAxis.isInversed) ? (value <= nextValue - this.diff) : (value >= nextValue - this.diff))
                                            labelText = label.displayText = '';
                                    }
                                    if (intersectAction == 'hide' && ((xAxis.isInversed) ? (value < pointX + width) : (value > pointX - width)))
                                        label.displayText = labelText = '';
                                }
                            }
                            else if (intersectAction == 'multiplerows' && !xAxis.enableTrim) { // to perform multipleRows on intersect

                                var currentLabelColl = [];
                                var currentLabel = label;
                                if (typeof currentLabel.Text == "string" && currentLabel.Text.indexOf('<br>') != -1)
                                    currentLabelColl = currentLabel.Text.split('<br>');
                                else
                                    currentLabelColl.push(currentLabel.Text);
                                var collectionLength = currentLabelColl.length;
                                if (labelText == '' && xAxis.edgeLabelPlacement == "hide") {
                                    for (var m = 0; m < collectionLength; m++)
                                        currentLabelColl[m] = '';
                                }
                                var largestText = ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, currentLabelColl),
                                    textWidth = ej.EjSvgRender.utils._measureText(largestText, chartAreaWidth, font).width,
                                    xAxisLabelLength = xAxis.visibleLabels.length - 1;
                                textWidth = textWidth / 2;

                                if (multipleRowsColl.length > 0) {
                                    var previousLabels = multipleRowsColl;
                                    for (var k = 0; k < previousLabels.length && !flag; k++) {
                                        var prevLabel = previousLabels[k];
                                        for (var l = 0; prevLabel && l < prevLabel.length; l++) {
                                            for (var c = 0; c < collectionLength; c++) {
                                                var temp = 0,
                                                    textWidth = ej.EjSvgRender.utils._measureText(currentLabelColl[c], chartAreaWidth, font).width,
                                                    preLabel = prevLabel[l],
                                                    prePoint = Math.abs(Math.floor(ej.EjSvgRender.utils._getPointXY(preLabel.Value, range, xAxis.isInversed) * (xAxis.width))),
                                                    preTextWidth = ej.EjSvgRender.utils._measureText(preLabel.Text, areaBoundWidth, xAxis.font).width;
                                                if (i != xAxisLabelLength)
                                                    textWidth = textWidth / 2;
                                                var value = prePoint + ((xAxis.isInversed) ? -preTextWidth / 2 : preTextWidth / 2);
                                                if (this.edgeLabel || previousLabels.length == 1)
                                                    value = value + this.diff;
                                                if ((xAxis.isInversed) ? (value < pointX + textWidth) : (value > pointX - textWidth)) {
                                                    if (opposedPosition) {
                                                        if (!insideLabels)
                                                            temp = options.y - textHeight;
                                                        else
                                                            temp = options.y + textHeight;
                                                        options.y = temp;
                                                        count = count + 1;
                                                        if (count < count1) {
                                                            count = count + count1;
                                                            count1 = 0;
                                                        }
                                                        if (k + 1 == previousLabels.length)
                                                            flag = true;
                                                        break;
                                                    } else {
                                                        if (!insideLabels)
                                                            temp = options.y + textHeight;
                                                        else
                                                            temp = options.y - textHeight;
                                                        options.y = temp;
                                                        count = count + 1;
                                                        if (count < count1) {
                                                            count = count + count1;
                                                            count1 = 0;
                                                        }
                                                        if (k + 1 == previousLabels.length)
                                                            flag = true;
                                                        break;

                                                    }
                                                }
                                                else {
                                                    if (l + 1 == prevLabel.length) {
                                                        if (c == collectionLength - 1)
                                                            flag = true;
                                                        else {
                                                            count1++;
                                                            flag = false;
                                                        }
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if (temp == undefined) {
                                    if (multipleRowsColl[0] == undefined)
                                        multipleRowsColl[0] = [];
                                    if (collectionLength == 1)
                                        multipleRowsColl[0].push(currentLabel);
                                    else {
                                        for (var c = 0; c < collectionLength; c++) {
                                            if (multipleRowsColl[c] == undefined)
                                                multipleRowsColl[c] = [];
                                            multipleRowsColl[c].push({
                                                Text: currentLabelColl[c],
                                                Value: currentLabel.Value,
                                            });
                                        }
                                    }
                                }
                                else {
                                    if (multipleRowsColl[count] == undefined)
                                        multipleRowsColl[count] = [];
                                    if (collectionLength == 1)
                                        multipleRowsColl[count].push(currentLabel);
                                    else {
                                        for (var c = 0; c < collectionLength; c++) {
                                            if (multipleRowsColl[count] == undefined)
                                                multipleRowsColl[count] = [];
                                            multipleRowsColl[count].push({
                                                Text: currentLabelColl[c],
                                                Value: currentLabel.Value,
                                            });
                                            if (c != collectionLength - 1) {
                                                count = count + 1;
                                            }
                                        }
                                    }
                                }
                                if (!insideLabels)
                                    options.y = (opposedPosition) ? options.y - (textHeight * (currentLabelColl.length - 1)) : options.y;
                                else
                                    options.y = (opposedPosition) ? options.y : options.y - (textHeight * (currentLabelColl.length - 1));
                                if (labelRotation != 0 && labelRotation != -360 && labelRotation != 360) {
                                    var largestText = ej.EjSvgRender.utils._getHighestLabel(xAxis, svgWidth, currentLabelColl);
                                    textWidth = ej.EjSvgRender.utils._measureText(largestText, chartAreaWidth, font).width;
                                    options['text-anchor'] = textAnchor;
                                    options.x = options.x + textWidth / 2;
                                }
                                this.svgRenderer.drawText(options, currentLabelColl, gTickEle);

                            }


                        }
                        if ((!this.edgeLabel) && !this.zoomed && !xAxis.zoomed && !(labelRotation) && !(labelIntersectAction == "rotate90") && !(labelIntersectAction == "rotate45") && (((pointX + xAxis.x) + (textWidth / 2)) > ($(this.svgObject).width()))) {
                            $(options).attr('x', ($(this.svgObject).width() - 2));
                            $(options).attr('text-anchor', 'end');
                        }
                        xAxis.visibleLabels[i].y = options.y;

                        if (this.model.enableCanvasRendering && insideLabels && (xAxis.labelIntersectAction == "rotate45" || xAxis.labelIntersectAction == "rotate90")) {
                            options.y = options.y - textWidth;
                        }

                        if ((intersectAction == "trim" || xAxis.enableTrim) && (xAxis._valueType != "double" || typeof label.displayText == "string")) {
                            if (!insideLabels)
                                options.y = (opposedPosition) ? options.y - (textHeight * (lblCollection.length - 1)) : options.y;
                            else
                                options.y = (opposedPosition) ? options.y : options.y - (textHeight * (lblCollection.length - 1));

                            label.displayText = lblCollection.length > 0 ? lblCollection.join('') : labelText;
                            if (!(label.displayText.indexOf("...") != -1))
                                label.displayText = labelText;
                            if (labelRotation != 0 && textAnchor != "middle") {
                                options.x = options.x + textWidth / 2;
                                options['text-anchor'] = textAnchor;
                            }
                            this.svgRenderer.drawText(options, lblCollection.length > 0 ? lblCollection : labelText, isCanvas ? highestText : gTickEle);
                        }
                        else if (intersectAction != "multiplerows") {
                            if (typeof labelText == "string" && labelText.indexOf('<br>') != -1) {
                                labelTextColl = labelText.split('<br>');
                                if (!insideLabels)
                                    options.y = (opposedPosition) ? options.y - (textHeight * (labelTextColl.length - 1)) : options.y;
                                else
                                    options.y = (opposedPosition) ? options.y : options.y - (textHeight * (labelTextColl.length - 1));
                                if ((labelRotation != 0 || labelIntersectAction == "rotate45" || labelIntersectAction == "rotate90")) {
                                    options.x = options.x + textWidth / 2;
                                    options['text-anchor'] = textAnchor;
                                }
                                this.svgRenderer.drawText(options, labelTextColl, isCanvas ? highestText : gTickEle);
                            }
                            else {
                                if ((textAnchor == "start") && labelRotation != 0 && labelRotation != -360 && labelRotation != 360) {
                                    options.x = options.x + textWidth / 2;
                                    options['text-anchor'] = textAnchor;
                                }
                                this.svgRenderer.drawText(options, labelText, isCanvas ? highestText : gTickEle);
                        }
                        }
                        //create region to chart axis labels
                        if (i != labels.length - 1 && (intersectAction == "trim" || xAxis.enableTrim))
                            options.x = options.x - textWidth / 2;
                        xAxis.visibleLabels[i].region = this.calculateRegion(labelText, font, options, label, lblCollection ? lblCollection : labelTextColl, highestText, intersectAction);

                        this.model.xAxisLabelRegions.push(xAxis.visibleLabels[i].region)
                    }
                }
            }
            $(gTickEle).appendTo(this.gXaxisEle);

        },
        calculateRegion: function (labelText, font, options, label, lblCollection, highestText, intersectAction) {

            if (intersectAction == "trim" && lblCollection.length > 0) {
                var labelTxt = lblCollection.join('');
                if (!(labelTxt.indexOf("...") != -1))
                    labelTxt = label.Text;
            }
            else
                var labelTxt = highestText ? highestText : labelText;
            var count = lblCollection ? (lblCollection.length> 0 ? lblCollection.length : 1) : 1;
            var labelSize = count > 1 && highestText ? ej.EjSvgRender.utils._measureText(highestText, null, font) : ej.EjSvgRender.utils._measureText(labelTxt, null, font);
            var textHeight = labelSize.height * count;
            var bounds = { x: options.x, y: options.y, width: labelSize.width, height: textHeight };
            var xAxisLabelRegions = { bounds: bounds, trimText: labelTxt, labelText: label.Text };
            return xAxisLabelRegions;
        },
        rowscalculation: function (labelText, areaBoundWidth, xAxis, gap, options) {
            var measureText = ej.EjSvgRender.utils._measureText,
                font = xAxis.font,
                textSize = measureText(labelText, areaBoundWidth, font),
                textWidth = textSize.width,
                anchor = textWidth / 2,
                text = labelText.toString(),
                textLength = text.length,
                textcollection = [],
                i = 0, line, currentTextCollextion,
                intersectAction = xAxis.labelIntersectAction,
                labelCollection = text.split(' '),
                labelCollectionLength = labelCollection.length;

            if (this.edgeLabel) gap = (i == 0) ? gap - this.diff : gap;

            if (textWidth > gap && options) {
                line = 0;
                if (this.edgeLabel) options.x = (i == 0) ? options.x - this.diff : options.x + this.diff;
            }

            if (intersectAction == 'wrap') {
                if (textWidth > gap) {
                    for (var w = 1; w <= text.length; w++) {
                        labelText = text.substring(0, w);
                        textWidth = measureText(labelText, areaBoundWidth, font).width;
                        if (textWidth > gap) {
                            line = line + 1; // To find the no of rows splitted
                            labelText = text.substring(0, w - 1);
                            textcollection[i] = labelText;
                            text = text.slice(w - 1, textLength);
                            currentTextCollextion = text.split(' ');
                            text = labelCollection.indexOf(currentTextCollextion[0]) > -1 ? text : '-' + text;
                            var newTextWidth = measureText(labelText, areaBoundWidth, font).width;

                            i++;
                            w = 0;
                        }
                    }
                }
                if (options) options.x = (xAxis.valueType == "datetimeCategory" && xAxis.labelPlacement.toLowerCase() == "betweenticks") ? xAxis._gap : options.x;
                textcollection[i] = labelText;
            }
            else {
                var max = 0, word, currentWidth, nextWidth;

                for (var i = 0; i < labelCollectionLength; i++) {
                    word = labelCollection[i];
                    currentWidth = measureText(word, areaBoundWidth, font).width;
                    if (currentWidth < gap && textWidth > gap) {
                        while (i < labelCollectionLength) {
                            currentWidth = measureText(word, areaBoundWidth, font).width;
                            nextWidth = (labelCollection[i + 1]) ? measureText(labelCollection[i + 1], areaBoundWidth, font).width : 0;
                            if ((currentWidth + nextWidth) <= gap && nextWidth > 0) {
                                word = word.concat(' ' + labelCollection[i + 1]);
                                i++;
                            }
                            else {
                                // find the maximum width of the lines
                                max = Math.max(max, currentWidth);
                                break;
                            }
                        }
                        textcollection.push(word);
                    }
                    else {
                        if (textWidth > gap) {
                            word = ej.EjSvgRender.utils._trimText(word, gap, font);
                            newTextWidth = measureText(word, areaBoundWidth, font).width;
                            max = Math.max(max, newTextWidth)
                            textcollection.push(word);
                        } else {
                            textcollection.push(labelText);
                            break;
                        }
                    }
                }

            }

            return textcollection;
        },

        labelRotation: function (axis, x, y, options, label, degree, i) {
            var opposedPosition = axis._opposed;
            var textAnchor = axis.rotateOn.toLowerCase();
            var intersectAction = axis.labelIntersectAction.toLowerCase();
            var diffHeight = 0;
            // To rotate axis labels
            var labelText = (label.displayText) ? label.displayText : label.Text;
            var angle = (degree > 360) ? degree - 360 : (degree < -360) ? degree + 360 : degree;
            var rotate = 'rotate(' + angle + ',' + (x) + ',' + y + ')';
            $(options).attr('transform', rotate);
            $(options).attr('labelRotation', angle);
            $(options).attr('labelPosition', axis.labelPosition);
            if (intersectAction == "wrap" || intersectAction == "wrapbyword")
            {
                var gap = axis.width / axis.labels.length;
                var arrColl = this._getLabelCollection(labelText, this.model.m_AreaBounds.width, axis, gap, options);
                var labelText = ej.EjSvgRender.utils._getHighestLabel(axis, $(this.svgObject).width(), arrColl, null);
            }
            var textElement = this.svgRenderer.createText(options, labelText);
            var textElementHeight =Math.round(ej.EjSvgRender.utils._measureBounds(textElement, this).height);
            var labelTextHeight = ej.EjSvgRender.utils._measureText(labelText, null, axis.font).height;
            diffHeight = Math.ceil(ej.EjSvgRender.utils._measureBounds(textElement, this).height - ej.EjSvgRender.utils._measureText(labelText, null, axis.font).height);
            diffHeight = axis._LableMaxWidth.height - diffHeight - ej.EjSvgRender.utils._measureText(labelText, null, axis.font).height;

            if (axis.labelPosition != 'inside')
                var yLocation = (opposedPosition) ? (diffHeight / 2) : (-diffHeight / 2);
            else
                var yLocation = (opposedPosition) ? (-diffHeight / 2) : (diffHeight / 2);
            
            if (textAnchor == "start")
                yLocation = yLocation + ((angle < 0 && angle > -180) || angle > 180 ? ((textElementHeight) / 2) : -((textElementHeight - labelTextHeight) / 2));

            rotate = 'rotate(' + angle + ',' + (x) + ',' + (y + (this.model.enableCanvasRendering && axis.opposedPosition ? -yLocation : yLocation)) + ')';
            if (this.edgeLabel && degree == 90)
                y = (i == 0) ? options.y + this.diff : options.y - this.diff;

            $(options).attr({
                'transform': rotate,
                'y': (y + (this.model.enableCanvasRendering && axis.opposedPosition ? -yLocation : yLocation))
            });
        },

        _drawYAxisLabels: function (axisIndex, yAxis) {
            // method to draw y axis labels
            //if(yAxis.labelPosition=='inside')
            var axisName = (yAxis.name).replace(/[^a-zA-Z0-9]/g, ""),
                gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisLabels' + '_' + axisIndex, 'cursor': 'default' }),
                labelSize, textElement, diffHeight,
                yAxisLabelRegions, opposedPosition = yAxis._opposed,
                insideLabels = yAxis.labelPosition == 'inside',
                insideTicks = yAxis.tickLinesPosition == 'inside',
                bounds,
                regionX, areaBounds = this.model.m_AreaBounds,
                requireInvertedAxes = this.model.requireInvertedAxes,
                isCanvas = this.model.enableCanvasRendering,
                isScroll = yAxis._isScroll && !(yAxis.scrollbarSettings.pointsLength != null && yAxis.scrollbarSettings.pointsLength < yAxis.maxPointLength), pointY, text, position, lastLabel,
                textHeight, yLocation,
                font = yAxis.font,
                range = yAxis.visibleRange,
                lineWidth = yAxis.axisLine.width,
                labelMaxWidth = yAxis._LableMaxWidth,
                labelMaxHeight = labelMaxWidth.height,
                labelMaxRow = labelMaxWidth.rows,
                areaBounds = this.model.m_AreaBounds,
                areaBoundWidth = areaBounds.Width,
                gap = yAxis.maximumLabelWidth,  // width for 4 digits
                labelText, x, textAnchor, diff, angle, rotate,
                textSize, options, scrollerSize = this.model.scrollerSize,
                textWidth, intersectAction = yAxis.labelIntersectAction.toLowerCase(),
                label, labels = yAxis.visibleLabels,
                visibleRange = range, inversed = yAxis.isInversed, axisHeight = yAxis.height,
                prevLabel, temp, prevPoint, prevTextHeight, value,
                degree = yAxis.labelRotation, maxLineWidth,
                yAxisAlignment = yAxis.alignment.toLowerCase(), pixel = 3, y;
            if (axisIndex != 1 && ((insideLabels && insideTicks) || (insideLabels && !insideTicks) && !((yAxis.x == (areaBounds.Width + areaBounds.X)) || (yAxis.x == areaBounds.X))))
                yAxis.x = (!opposedPosition) ? (yAxis.showNextToAxisLine) ? Math.floor(yAxis.x) : Math.floor(yAxis.x - labelMaxWidth.width - this.model.elementSpacing) : insideLabels && insideTicks ? Math.floor(yAxis.x) : Math.floor(yAxis.x + labelMaxWidth.width + this.model.elementSpacing);
            else if (axisIndex != 1 && (!(yAxis.x == (areaBounds.Width + areaBounds.X)) || (yAxis.x == areaBounds.X)) && (!insideLabels && insideTicks)) {
                yAxis._x = Math.floor(yAxis.x);
                yAxis.x = (!opposedPosition) ? !yAxis.showNextToAxisLine ? Math.floor(areaBounds.X) : Math.floor(yAxis.x - yAxis.majorTickLines.size) : Math.floor(yAxis.x + yAxis.majorTickLines.size);
            }
            else {
                yAxis._x = Math.floor(yAxis.x);//to store the current positons of the labels,before the property showNextToAxisLine as false.
                yAxis.x = (!yAxis.showNextToAxisLine) ? opposedPosition ? Math.floor(areaBounds.X + areaBounds.Width) : Math.floor(areaBounds.X) : Math.floor(yAxis.x);
            }

            for (var i = 0; i < labels.length; i++) {
                label = labels[i];
                if (ej.EjSvgRender.utils._inside(label.Value, visibleRange)) {
                    pointY = Math.abs(ej.EjSvgRender.utils._getPointXY(label.Value, visibleRange, inversed) * axisHeight);
                    text = ej.EjSvgRender.utils._measureText(label.Text, areaBounds.Height, font);
                    textHeight = text.height;
                    labelText = label.displayText = label.Text;
                    textSize = ej.EjSvgRender.utils._measureText(labelText, areaBoundWidth, font);
                    textWidth = textSize.width;

                    if (insideLabels && insideTicks) {
                        x = (opposedPosition) ? (yAxis.x - (yAxis.majorTickLines.size) - (lineWidth / 2) - 5)
                            : (yAxis.x + (lineWidth / 2) + 5 + yAxis.majorTickLines.size);
                        textanchor = (opposedPosition) ? 'end' : 'start';
                    }
                    else if (insideLabels && !insideTicks) {
                        x = (opposedPosition) ? (yAxis.x - (lineWidth / 2) - 5)
                            : (yAxis.x + (lineWidth / 2) + 5);
                        textanchor = (opposedPosition) ? 'end' : 'start';
                    }
                    else if (insideTicks && !insideLabels) {

                        x = (opposedPosition) ? ((lineWidth / 2) + yAxis.x + 5)
                            : (yAxis.x - (lineWidth / 2) - 5);
                        textanchor = (opposedPosition) ? 'start' : 'end';
                        x = x - ((isScroll ? (opposedPosition ? -scrollerSize : scrollerSize) : 0));
                    }
                    else {
                        x = (opposedPosition) ? ((yAxis.majorTickLines.size) + (lineWidth / 2) + yAxis.x + 5)
                            : (yAxis.x - (lineWidth / 2) - 5 - yAxis.majorTickLines.size);
                        textanchor = (opposedPosition) ? 'start' : 'end';
                        x = x - ((isScroll ? (opposedPosition ? -scrollerSize : scrollerSize) : 0));
                    }
                    if (yAxis.majorGridLines.width > yAxis.majorTickLines.width)
                        maxLineWidth = yAxis.majorGridLines.width;
                    else maxLineWidth = yAxis.majorTickLines.width;
                    if (yAxisAlignment == "far")
                        y = ((-pointY) + (yAxis.y + axisHeight)) - maxLineWidth - pixel;
                    else if (yAxisAlignment == "near")
                        y = ((-pointY) + (yAxis.y + axisHeight) + textHeight / 2) + maxLineWidth + pixel;
                    else
                        y = ((-pointY) + (yAxis.y + axisHeight) + textHeight / 4);
                    options = {
                        'id': this.svgObject.id + '_' + axisName + '_YLabel_' + i,
                        'x': x,
                        'y': y,
                        'fill': font.color,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        'opacity': font.opacity,
                        'text-anchor': !ej.util.isNullOrUndefined(degree) && degree != 0 ? "middle" : textanchor
                    };
                    labelText = (label.displayText) ? label.displayText : label.Text;
                    var labelCollection = [], highestText;
                    if (typeof labelText == "string" && labelText.indexOf('<br>') != -1) {
                        labelCollection = labelText.split('<br>');
                        highestText = labelText = ej.EjSvgRender.utils._getHighestLabel(yAxis, areaBounds.Height, labelCollection);
                        textWidth = ej.EjSvgRender.utils._measureText(labelText, areaBoundWidth, font).width;
                    }
                    else
                        labelCollection.push(labelText);

                    // To set position of edge labels in yAxis
                    if (yAxis.edgeLabelPlacement) {
                        position = yAxis.edgeLabelPlacement.toLowerCase();
                        lastLabel = labels.length - 1;

                        switch (position) {
                            case "none":
                                break;
                            case "shift":
                                {
                                    if (i == 0) {  // Shift first label
                                        if (options.y > yAxis.y + axisHeight) {
                                            diff = options.y - (yAxis.y + axisHeight);
                                            options.y = y = options.y - diff;
                                            this.diff = diff;
                                            this.edgeLabel = true;
                                        }
                                    } else if (i == lastLabel) // Shift last label
                                        if (options.y - textHeight / 2 < yAxis.y) {
                                            diff = yAxis.y - (options.y - textHeight / 2);
                                            options.y = y = options.y + diff;
                                            this.diff = diff;
                                            this.edgeLabel = true;
                                        }
                                    break;
                                }
                            case "hide": //to hide the edge labels
                                if ((i == 0 && options.y > yAxis.y + axisHeight) || (i == lastLabel && options.y - textHeight / 2 < areaBounds.Y)) {
                                    labelText = label.Text = "";
                                    if (labelCollection.length == 1) labelCollection[0] = labelText;
                                }
                        }
                    }

                    //To perform rotation         
                    if (!ej.util.isNullOrUndefined(degree) && degree != 0 && !this.svgRenderer.vmlNamespace) {
                        if (!insideLabels)
                            x = (opposedPosition) ? (x + textWidth / 2) : (x - textWidth / 2);
                        else
                            x = (opposedPosition) ? (x - textWidth / 2) : (x + textWidth / 2);

                        labelText = (label.displayText) ? label.displayText : label.Text;
                        labelText = highestText ? highestText : labelText;
                        angle = (degree > 360) ? degree - 360 : (degree < -360) ? degree + 360 : degree;
                        rotate = 'rotate(' + angle + ',' + (x) + ',' + y + ')';
                        $(options).attr('transform', rotate);
                        $(options).attr('labelRotation', angle);
                        textElement = this.svgRenderer.createText(options, labelText);
                        diffHeight = Math.ceil(ej.EjSvgRender.utils._measureBounds(textElement, this).width -
                            ej.EjSvgRender.utils._measureText(labelText, null, font).width);

                        if (!insideLabels)
                            yLocation = (opposedPosition) ? (diffHeight / 2) : (-diffHeight / 2);
                        else
                            yLocation = (opposedPosition) ? (-diffHeight / 2) : (diffHeight / 2);

                        rotate = 'rotate(' + angle + ',' + (x + yLocation) + ',' + (y) + ')';

                        $(options).attr({
                            'transform': rotate,
                            'x': (x + yLocation)
                        });
                    }

                    //Label intersection
                    if (yAxis.labelIntersectAction || yAxis.enableTrim) {
                        if (intersectAction == 'none' && !(yAxis.enableTrim)) {
                            this.svgRenderer.drawText(options, labelCollection.length > 0 ? labelCollection : label.Text, isCanvas && highestText ? highestText : gEle);
                            labelSize = ej.EjSvgRender.utils._measureText(labelText, null, font);
                            if (yAxis.opposedPosition)
                                regionX = options.x;
                            else
                                regionX = options.x - labelSize.width;
                            // yAxis labels region stored 
                            bounds = { x: regionX, y: options.y, width: labelSize.width, height: labelSize.height };
                            yAxisLabelRegions = { bounds: bounds, trimText: labelText, labelText: label.Text };
                            yAxis.visibleLabels[i].region = { bounds: bounds, trimText: labelText, labelText: label.Text };
                            this.model.yAxisLabelRegions.push(yAxisLabelRegions)
                            continue;
                        }
                        else if (yAxis.enableTrim) {
                            for (var l = 0; l < labelCollection.length; l++) {
                                var labelText = labelCollection[l];
                                textWidth = ej.EjSvgRender.utils._measureText(labelText, null, font).width;
                                if (textWidth > gap && labelText != "") { // check textwidth is greater than gap
                                    for (var t = 1; t < labelText.toString().length; t++) {
                                        labelText = label.displayText.toString().substring(0, t - 1) + '...';
                                        textWidth = ej.EjSvgRender.utils._measureText(labelText, areaBoundWidth, font).width;
                                        if (textWidth >= gap) {
                                            labelText = labelText.toString().substring(0, t - 1) + '...';
                                            break;
                                        }
                                    }
                                    label.displayText = labelCollection[l] = labelText;
                                }
                            }

                        }

                        for (var j = 0; j < i; j++) {
                            prevLabel = labels[j];
                            temp = 0;
                            prevPoint = Math.abs((ej.EjSvgRender.utils._getPointXY(prevLabel.Value, range, inversed) * (axisHeight)));
                            prevTextHeight = ej.EjSvgRender.utils._measureText(prevLabel.Text, areaBounds.Height, font).height;
                            value = ((prevPoint * -1) + (yAxis.y + axisHeight) + prevTextHeight / 4);
                            value = value + ((inversed) ? prevTextHeight / 2 : -prevTextHeight / 2);
                            if (this.edgeLabel)
                                value = (j == 0) ? value - prevTextHeight / 4 : value;
                            if (intersectAction == 'hide' && prevLabel.Text.toString() != "" && ((inversed) ? value > options.y - textHeight / 4 : value < options.y + textHeight / 4))
                                labelText = label.Text = '';
                            else if (intersectAction == 'multiplerows' && ((inversed) ? value > options.y - textHeight / 4 : value < options.y + textHeight / 4) && prevLabel.x == options.x) {
                                options.x = prevLabel.x + opposedPosition ? (!insideLabels ? (labelMaxWidth.maxWidth + 5) : (-labelMaxWidth.maxWidth - 5)) : (!insideLabels ? (-labelMaxWidth.maxWidth - 5) : (labelMaxWidth.maxWidth + 5));
                            }
                        }
                    }

                    labels[i].x = options.x;
                    this.svgRenderer.drawText(options, labelCollection.length > 0 ? labelCollection : labelText, gEle);
                    //create region to chart axis labels
                    labelSize = ej.EjSvgRender.utils._measureText(labelText, null, font);

                    if (opposedPosition)
                        regionX = options.x;
                    else
                        regionX = options.x - labelSize.width;

                    // yAxis labels region stored 
                    bounds = { x: regionX, y: options.y, width: labelSize.width, height: labelSize.height };
                    yAxisLabelRegions = { bounds: bounds, trimText: labelText, labelText: label.Text };
                    labels[i].region = { bounds: bounds, trimText: labelText, labelText: label.Text };
                    this.model.yAxisLabelRegions.push(yAxisLabelRegions)


                }
            }
            $(gEle).appendTo(this.gYaxisEle);
        },
        //To Trim axis title
        trimText: function (text, maxLength, ellipsis) {
            maxLength--;
            text = text.substring(0, maxLength - ellipsis.length);
            return text + ellipsis;
        },

        _drawXTitle: function (axisIndex, axis) {

            if (axis.title.text != "" && axis.title.text && axis.title.visible) {
                var gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxis_Title' + '_' + axisIndex, 'cursor': 'default' }),
                    xtitleLocation = (this.model.elementSpacing) + axis._LableMaxWidth.height,
                    axisTitleSize = ej.EjSvgRender.utils._measureText(axis.title.text, (axis.width), axis.title.font),
                    titlesize = axisTitleSize.height / 2,
                    opposedPosition = axis._opposed,
                    titleText = axis.title.text,
                    _LableMaxWidth = axis._LableMaxWidth,
                    textAnchor = "middle",
                    elementSpacing = this.model.elementSpacing,
                    isEnableTrim = axis.title.enableTrim,
                    isScroll = (axis._isScroll || (this.model.zooming.enableScrollbar && axis.scrollbarSettings.visible && (axis.zoomFactor < 1 || axis.zoomPosition > 0))),
                    axisTitleWidth = axis.title.maximumTitleWidth,
                    axisTitlePosition = axis.title.position.toLowerCase(),
                    axisTitleAlignment = axis.title.alignment.toLowerCase(), y,
                    isRTL = axis.title.isReversed,
                    tickLinesPosition = axis.tickLinesPosition.toLowerCase(),
                    labelPosition = axis.labelPosition.toLowerCase(),
                    m_AreaBounds = this.model.m_AreaBounds,
                    axistitleoffset = axis.title.offset, locX, newY,
                    scrollerSize = this.model.scrollerSize;
                if (isEnableTrim && (ej.util.isNullOrUndefined(axisTitleWidth) || axisTitleWidth > 0 || isNaN(axisTitleWidth))) {
                    var maxTitleWidth = (!axisTitleWidth) ? axis.width - (elementSpacing * 2) : axisTitleWidth;
                    while (axisTitleSize.width > maxTitleWidth) {
                        titleText = this.trimText(titleText, titleText.length, "...");
                        axisTitleSize = ej.EjSvgRender.utils._measureText(titleText, (axis.width), axis.title.font);
                        if (titleText == "...") {
                            titleText = "";
                            break;
                        }
                    }
                }
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);

                var y = elementSpacing + _LableMaxWidth.height + titlesize + axis._multiLevelLabelHeight + axis.majorTickLines.size + axis.axisLine.width;

                if ((tickLinesPosition == 'inside' && labelPosition == 'inside') && (axisIndex == 0 || (axis.y == (m_AreaBounds.Height + m_AreaBounds.Y)) || (axis.y == (m_AreaBounds.Y))))
                    y = (axisTitlePosition == "inside") ? elementSpacing + _LableMaxWidth.height + titlesize + axis._multiLevelLabelHeight + axis.majorTickLines.size + axis.axisLine.width : elementSpacing + titlesize + axis.axisLine.width;
                else if ((axisIndex == 0 || (axis.y == (m_AreaBounds.Width + m_AreaBounds.X)) || (axis.y == (m_AreaBounds.X))) && (tickLinesPosition != 'inside' && labelPosition == 'inside'))
                    y = (axisTitlePosition == "inside") ? elementSpacing + _LableMaxWidth.height + titlesize + axis._multiLevelLabelHeight + axis.axisLine.width : elementSpacing + axis.majorTickLines.size + axis.axisLine.width;
                else if ((axisIndex == 0 || (axis.y == (m_AreaBounds.Width + m_AreaBounds.X)) || (axis.y == (m_AreaBounds.X))) && (tickLinesPosition == 'inside' && labelPosition != 'inside'))
                    y = (axisTitlePosition == "inside") ? elementSpacing + titlesize + axis.majorTickLines.size + axis.axisLine.width : elementSpacing + _LableMaxWidth.height + titlesize + axis._multiLevelLabelHeight + axis.axisLine.width;
                else if ((tickLinesPosition != 'inside' && labelPosition != 'inside') || (axisIndex != 1))
                    y = (axisTitlePosition == "inside") ? elementSpacing : elementSpacing + _LableMaxWidth.height + titlesize + axis.majorTickLines.size + axis.axisLine.width + axis._multiLevelLabelHeight;
                else if ((tickLinesPosition != 'inside' && labelPosition == 'inside' && !axis.showNextToAxisLine))
                    y = (axisTitlePosition == "inside") ? elementSpacing + _LableMaxWidth.height + titlesize + axis._multiLevelLabelHeight + axis.axisLine.width : elementSpacing + titlesize + axis.majorTickLines.size + axis.axisLine.width + elementSpacing + elementSpacing;
                if (axisTitleAlignment == "far") {
                    locX = isRTL ? axis.x + axistitleoffset : axis.x + axis.width + axistitleoffset;
                    textAnchor = isRTL ? "start" : "end";
                }
                else if (axisTitleAlignment == "near") {
                    locX = isRTL ? axis.x + axis.width + axistitleoffset : axis.x + axistitleoffset;
                    textAnchor = isRTL ? "end":"start";
                }
                else
                    locX = (axis.x + axis.width / 2) + axistitleoffset;

                commonEventArgs.data = { title: axis.title.text, location: { x: locX, y: y }, axes: axis };
                this._trigger("axesTitleRendering", commonEventArgs);

                if (axisTitlePosition == "inside")
                    newY = ((opposedPosition) ? (tickLinesPosition == "inside" && labelPosition == "outside" ? axis.y + commonEventArgs.data.location.y - (isScroll ? scrollerSize : 0) - axis.majorTickLines.size
                        : (axis.y + commonEventArgs.data.location.y - (isScroll ? scrollerSize : 0)))
                        : (tickLinesPosition == "outside" && labelPosition == "inside" ? (isScroll ? scrollerSize : 0) + (axis.y - commonEventArgs.data.location.y) + axis.majorTickLines.size
                            : (isScroll ? scrollerSize : 0) + (axis.y - commonEventArgs.data.location.y))) + axisTitleSize.height / 3.5;
                else
                    newY = ((opposedPosition) ? (tickLinesPosition == "inside" && labelPosition == "outside" ? axis.y - commonEventArgs.data.location.y - (isScroll ? scrollerSize : 0) - axis.majorTickLines.size
                        : (axis.y - commonEventArgs.data.location.y - (isScroll ? scrollerSize : 0)))
                        : (tickLinesPosition == "outside" && labelPosition == "inside" ? (isScroll ? scrollerSize : 0) + (commonEventArgs.data.location.y + axis.y) - axis.majorTickLines.size
                            : (isScroll ? scrollerSize : 0) + (commonEventArgs.data.location.y + axis.y))) + axisTitleSize.height / 3.5;

                var options = {
                    'id': this.svgObject.id + '_XAxisTitle' + '_' + axisIndex,
                    'x': commonEventArgs.data.location.x,
                    'y': newY,
                    'fill': axis.title.font.color,
                    'font-size': axis.title.font.size,
                    'font-family': axis.title.font.fontFamily,
                    'font-style': axis.title.font.fontStyle,
                    'font-weight': axis.title.font.fontWeight,
                    'opacity': axis.title.font.opacity,
                    'text-anchor': textAnchor
                };
                if (this.model.enableCanvasRendering) {
                    var matched = jQuery.uaMatch(navigator.userAgent);
                    var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
                    var browser = matched.browser.toLowerCase();
                    if (browser != "msie" && !isIE11)
                        options.y = !opposedPosition ? options.y + (titlesize / 2) + (browser == "mozilla" ? 1 : -2) : options.y + (titlesize / 2) + 1; // text dominant baseline for canvas
                }
                if ($(this.svgObject).find("#" + this.svgObject.id + '_XAxisTitle' + '_' + axisIndex).length > 0)
                    $(this.svgObject).find("#" + this.svgObject.id + '_XAxisTitle' + '_' + axisIndex).attr(options);
                else if (!isEnableTrim)
                    this.svgRenderer.drawText(options, commonEventArgs.data.title, gEle);
                else if (isEnableTrim && (ej.util.isNullOrUndefined(axisTitleWidth) || axisTitleWidth > 0 || isNaN(axisTitleWidth))) {
                    var x = (textAnchor == "middle") ? options.x - (axisTitleSize.width) / 2 : (textAnchor == "end" ? options.x - axisTitleSize.width : options.x);
                    var bounds = { X: x, Y: options.y, Width: axisTitleSize.width, Height: axisTitleSize.height };
                    var xAxisTitleRegion = { Bounds: bounds, trimText: titleText, labelText: axis.title.text };
                    this.model.xAxisTitleRegion.push(xAxisTitleRegion)
                    this.svgRenderer.drawText(options, titleText, gEle);
                }

                if (!this.model.enableCanvasRendering) {
                    var borderY = (textAnchor == "start" ? 0 : (textAnchor == "end" ? axisTitleSize.width : axisTitleSize.width / 2));
                    var borderOptions = {
                        'id': this.svgObject.id + '_XAxisTitleBorder' + '_' + axisIndex,
                        'x': commonEventArgs.data.location.x - borderY - elementSpacing,
                        'y': newY - axisTitleSize.height + (axisTitleSize.height / 4),
                        'width': axisTitleSize.width + (2 * elementSpacing),
                        'height': axisTitleSize.height,
                        'fill': "transparent",
                        'class': "e-xaxistitleborder"
                    };
                    this.svgRenderer.drawRect(borderOptions, gEle);
                }
                $(gEle).appendTo(this.gXaxisEle);
            }
        },
        _drawYTitle: function (axisIndex, yAxis) {

            if (yAxis.title.text != "" && yAxis.title.text && yAxis.title.visible) {
                var opposedPosition = yAxis._opposed,
                    elementSpacing = this.model.elementSpacing,
                    textAnchor = "middle",
                    isTransposed = this.model.series.isTransposed,
                    majorTickLinesize = yAxis.majorTickLines.size,
                    axisTitlePosition = yAxis.title.position.toLowerCase(),
                    _LableMaxWidth = yAxis._LableMaxWidth,
                    m_AreaBounds = this.model.m_AreaBounds, x,
                    axisLine = yAxis.axisLine,
                    tickLinesPosition = yAxis.tickLinesPosition.toLowerCase(),
                    labelPosition = yAxis.labelPosition.toLowerCase(),
                    titleText = yAxis.title.text,
                    isEnableTrim = yAxis.title.enableTrim,
                    requireInvertedAxes = this.model.requireInvertedAxes, y,
                    isScroll = yAxis._isScroll,
                    axisTitleWidth = yAxis.title.maximumTitleWidth,
                    axistitleoffset = yAxis.title.offset,
                    axisTitleAlignment = yAxis.title.alignment.toLowerCase(),
                    gEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisTitleGroup' + '_' + axisIndex, 'cursor': 'default' });//Group id and text element id should not be same
                var titleSize = ej.EjSvgRender.utils._measureText(yAxis.title.text, (yAxis.height), yAxis.title.font);
                if ((tickLinesPosition == 'inside' && labelPosition == 'inside') && (axisIndex == 1 || (yAxis.x == (m_AreaBounds.Width + m_AreaBounds.X)) || (yAxis.x == (m_AreaBounds.X)))) {
                    if (axisTitlePosition == "inside")
                        x = (opposedPosition) ? (yAxis.x - ((3 * elementSpacing) + _LableMaxWidth.width + yAxis._multiLevelLabelHeight + majorTickLinesize + axisLine.width)) : yAxis.x + ((3 * elementSpacing) + _LableMaxWidth.width + yAxis._multiLevelLabelHeight + majorTickLinesize + axisLine.width);
                    else
                        x = (opposedPosition) ? yAxis.x + ((3 * elementSpacing) + axisLine.width - 5) : yAxis.x - ((3 * elementSpacing) + axisLine.width);
                } else if ((axisIndex == 1 || (yAxis.x == (m_AreaBounds.Width + m_AreaBounds.X)) || (yAxis.x == (m_AreaBounds.X))) && (tickLinesPosition != 'inside' && labelPosition == 'inside')) {
                    if (axisTitlePosition == "inside")
                        x = (opposedPosition) ? (yAxis.x - ((3 * elementSpacing) + _LableMaxWidth.width + axis._multiLevelLabelHeight + axisLine.width)) : yAxis.x + ((3 * elementSpacing) + _LableMaxWidth.width + yAxis._multiLevelLabelHeight + axisLine.width);
                    else
                        x = (opposedPosition) ? yAxis.x + ((3 * elementSpacing) + majorTickLinesize + axisLine.width) : yAxis.x - ((3 * elementSpacing) + majorTickLinesize + axisLine.width);
                } else if ((axisIndex == 1 || (yAxis.x == (m_AreaBounds.Width + m_AreaBounds.X)) || (yAxis.x == (m_AreaBounds.X))) && (tickLinesPosition == 'inside' && labelPosition != 'inside')) {
                    if (axisTitlePosition == "inside")
                        x = (opposedPosition) ? (yAxis.x - ((3 * elementSpacing) + majorTickLinesize + axisLine.width)) : yAxis.x + ((3 * elementSpacing) + majorTickLinesize + axisLine.width) +
                            (!yAxis.showNextToAxisLine ? -(elementSpacing) : labelPosition == "inside" ? -yAxis._multiLevelLabelHeight : yAxis._multiLevelLabelHeight);

                    else
                        x = (opposedPosition) ? yAxis.x + ((3 * elementSpacing) + yAxis._multiLevelLabelHeight + _LableMaxWidth.width + axisLine.width) : yAxis.x - ((3 * elementSpacing) + _LableMaxWidth.width + axisLine.width + yAxis._multiLevelLabelHeight);
                } else if ((yAxis.tickLinesPosition != 'inside' && yAxis.labelPosition != 'inside') || (axisIndex != 1)) {
                    if (axisTitlePosition == "inside")
                        x = (opposedPosition) ? (yAxis.x - (elementSpacing + axisLine.width + majorTickLinesize)) : yAxis.x + (elementSpacing + (!yAxis.showNextToAxisLine ? _LableMaxWidth.width : 0) + axisLine.width + majorTickLinesize);
                    else
                        x = (opposedPosition) ? yAxis.x + ((3 * elementSpacing) + yAxis._multiLevelLabelHeight + _LableMaxWidth.width + majorTickLinesize + axisLine.width) : yAxis.x - ((3 * elementSpacing) + _LableMaxWidth.width + yAxis._multiLevelLabelHeight + majorTickLinesize + axisLine.width);
                }
                var axisTitleSize = ej.EjSvgRender.utils._measureText(titleText, (yAxis.height), yAxis.title.font);
                if (isEnableTrim && (ej.util.isNullOrUndefined(axisTitleWidth) || axisTitleWidth > 0 || isNaN(axisTitleWidth))) {
                    var maxTitleWidth = (!axisTitleWidth) ? yAxis.height - (elementSpacing * 2) : axisTitleWidth;
                    while (axisTitleSize.width > maxTitleWidth) {
                        titleText = this.trimText(titleText, titleText.length, "...");
                        axisTitleSize = ej.EjSvgRender.utils._measureText(titleText, (yAxis.height), yAxis.title.font);
                        if (titleText == "...") {
                            titleText = "";
                            break;
                        }

                    }
                }
                x = (yAxis.opposedPosition) ? x : x - (isScroll ? this.model.scrollerSize : 0)
                if (document.documentMode === 8)
                    x = (!opposedPosition) ? (x - axisTitleSize.width / 2 + elementSpacing) : (x + axisTitleSize.width / 2 - elementSpacing);
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { title: yAxis.title.text, location: { x: titleSize.width / 2, y: 0 }, axes: yAxis };
                this._trigger("axesTitleRendering", commonEventArgs);
                y = commonEventArgs.data.location.y + (yAxis.y + yAxis.height) + (((yAxis.height) / 2) * -1);

                if (axisTitleAlignment == "near") {
                    y = (yAxis.y + yAxis.height) - axistitleoffset;
                    textAnchor = opposedPosition || isTransposed ? "end" : "start";
                }
                else if (axisTitleAlignment == "far") {
                    y = yAxis.y - axistitleoffset;
                    textAnchor = opposedPosition || isTransposed ? "start" : "end";
                }
                else if (axisTitleAlignment == "center")
                    y = yAxis.y + (yAxis.height / 2) - axistitleoffset;

                var labelRotation = (opposedPosition) ? 90 : -90;

                var options = {
                    'id': this.svgObject.id + '_YAxisTitle' + '_' + axisIndex,
                    'x': x,
                    'y': y,
                    'fill': yAxis.title.font.color,
                    'labelRotation': labelRotation,
                    'transform': 'rotate(' + labelRotation + ',' + (x) + ',' + y + ')',
                    'font-size': yAxis.title.font.size,
                    'font-family': yAxis.title.font.fontFamily,
                    'font-style': yAxis.title.font.fontStyle,
                    'font-weight': yAxis.title.font.fontWeight,
                    'opacity': yAxis.title.font.opacity,
                    'text-anchor': textAnchor,
                    'dominant-baseline': 'middle'
                };
                if (this.model.enableCanvasRendering) {
                    var matched = jQuery.uaMatch(navigator.userAgent);
                    var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
                    var browser = matched.browser.toLowerCase();
                    if (browser != "msie" && !isIE11)
                        options.x = !opposedPosition ? options.x + (titleSize.height / 4) + (browser == "mozilla" ? 1 : -2) : options.x - (titleSize.height / 4) + 1; // text dominant baseline for canvas
                }
                if ($(this.svgObject).find("#" + this.svgObject.id + '_YAxisTitle' + '_' + axisIndex).length > 0)
                    $(this.svgObject).find("#" + this.svgObject.id + '_YAxisTitle' + '_' + axisIndex).attr(options);
                else if (!isEnableTrim)
                    this.svgRenderer.drawText(options, commonEventArgs.data.title, gEle);
                else if (isEnableTrim && (ej.util.isNullOrUndefined(axisTitleWidth) || axisTitleWidth > 0 || isNaN(axisTitleWidth))) {
                    if (!this.svgRenderer.vmlNamespace)
                        var bounds = { X: options.x - (axisTitleSize.height / 2), Y: options.y + (axisTitleSize.width / 2), Width: (axisTitleSize.height) / 2, Height: axisTitleSize.width };
                    else
                        var bounds = { X: options.x - (axisTitleSize.width) / 2, Y: options.y + (axisTitleSize.height / 2), Width: (axisTitleSize.width), Height: axisTitleSize.height };
                    var yAxisTitleRegion = { Bounds: bounds, trimText: titleText, labelText: yAxis.title.text };
                    this.model.yAxisTitleRegion.push(yAxisTitleRegion)
                    this.svgRenderer.drawText(options, titleText, gEle);
                }

                if (!this.model.enableCanvasRendering) {
                    var borderY = (textAnchor == "start" ? (axisTitleSize.width) : (textAnchor == "end" ? 0 : axisTitleSize.width / 2));
                    var borderOptions = {
                        'id': this.svgObject.id + '_YAxisTitleBorder' + '_' + axisIndex,
                        'x': options.x - axisTitleSize.height + (axisTitleSize.height / 2),
                        'y': options.y - borderY - elementSpacing,
                        'width': axisTitleSize.height,
                        'height': axisTitleSize.width + (2 * elementSpacing),
                        'fill': "transparent",
                        'class': "e-yaxistitleborder"
                    };
                    this.svgRenderer.drawRect(borderOptions, gEle);
                }
                $(gEle).appendTo(this.gYaxisEle);
            }
        }
    },
        ej.EjStripline.prototype = {
            _drawStripline: function (axis, stripLine, axisIndex, stripLineIndex) {

                var start = (stripLine.start < axis.range.min) ? axis.range.min : stripLine.start;
                var end = (stripLine.end > axis.range.max) ? axis.range.max : stripLine.end;
                var x = 0, height = 0, angle = 0;
                var y = 0, pointYstart = 0, yHeight = 0;
                var width = 0, widthValue = 0, textX = 0, textY = 0;
                if (stripLine.visible) {
                    this.model._stripeline = true;
                    var striplineid = (stripLine.zIndex == 'over') ? this.gStriplineOver : this.gStriplineBehind;
                    striplineid = ej.util.isNullOrUndefined(striplineid) ? "" : striplineid;
                    var isVisible = true;
                    if (axis.orientation.toLowerCase() == "horizontal") {
                        var pointstart = 0;

                        if (stripLine.startFromAxis) {

                            var point = (ej.util.isNullOrUndefined(stripLine.offset)) ? axis.visibleRange.min : axis.visibleRange.min + stripLine.offset;
                            pointstart = (((point - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.width)) + axis.x; //($(this.svgObject).width() - this.model.m_Spacing.Left - this.model.m_Spacing.Right);

                            widthValue = (((point + (ej.util.isNullOrUndefined(stripLine.width) ? 0 : stripLine.width) - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.width));

                        } else {
                            if (ej.util.isNullOrUndefined(start) && (ej.util.isNullOrUndefined(end) || ej.util.isNullOrUndefined(stripLine.width))) {
                                isVisible = false;
                            } else {
                                start = (jQuery.type(start) == "date") ? (start).getTime() : start;
                                if (!ej.util.isNullOrUndefined(end) && (jQuery.type(end) == "date")) {
                                    end = (end).getTime();
                                }
                                pointstart = (ej.EjSvgRender.utils._getPointXY(start, axis.visibleRange, axis.isInversed) * (axis.width)) + axis.x; //($(this.svgObject).width() - this.model.m_Spacing.Left - this.model.m_Spacing.Right);
                                var pointend = (ej.EjSvgRender.utils._getPointXY(end, axis.visibleRange, axis.isInversed) * (axis.width)) + axis.x; //($(this.svgObject).width() - this.model.m_Spacing.Left - this.model.m_Spacing.Right);
                                var widthMax = (ej.EjSvgRender.utils._getPointXY((start + (ej.util.isNullOrUndefined(stripLine.width) ? 0 : stripLine.width)), axis.visibleRange, axis.isInversed) * (axis.width)) + axis.x;

                                widthValue = (axis.isInversed ? (pointend < widthMax) : (pointend > widthMax)) ? Math.abs(pointstart - pointend) : Math.abs(pointstart - widthMax);

                            }
                        }
                        width = widthValue;
                        height = this.chart.model.m_AreaBounds.Height;
                        x = (axis.isInversed) ? (pointstart - widthValue) : pointstart;
                        y = this.chart.model.m_AreaBounds.Y;
                        angle = -90;
                        var textWidth = ej.EjSvgRender.utils._measureText(stripLine.text, null, stripLine.font).height;
                        if (stripLine.textAlignment == 'middletop') {
                            textX = x + textWidth;
                            textY = Math.abs(y + height / 2);
                        } else if (stripLine.textAlignment == 'middlecenter') {
                            textX = (Math.floor(x + width / 2) + (textWidth / 3));
                            textY = Math.abs(y + height / 2);
                        } else if (stripLine.textAlignment == 'middlebottom') {
                            textX = x + width - (textWidth);
                            textY = Math.abs(y + height / 2);
                        }


                    } else {
                        if (stripLine.startFromAxis) {
                            var pointY = (ej.util.isNullOrUndefined(stripLine.offset)) ? axis.visibleRange.min : axis.visibleRange.min + stripLine.offset;
                            pointYstart = (axis.y + axis.height) - (((pointY - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.height));
                            widthValue = (((pointY + (ej.util.isNullOrUndefined(stripLine.width) ? 0 : stripLine.width) - axis.visibleRange.min) / (axis.visibleRange.delta)) * (axis.height));
                            yHeight = widthValue;
                        } else {

                            if (ej.util.isNullOrUndefined(start) && (ej.util.isNullOrUndefined(end) || ej.util.isNullOrUndefined(stripLine.width))) {
                                isVisible = false;
                            } else {
                                start = (jQuery.type(start) == "date") ? (start).getTime() : start;
                                if (!ej.util.isNullOrUndefined(end) && (jQuery.type(end) == "date")) {
                                    end = (end).getTime();
                                }
                                pointYstart = (axis.y + axis.height) - (ej.EjSvgRender.utils._getPointXY(start, axis.visibleRange, axis.isInversed) * (axis.height));
                                var pointYend = (axis.y + axis.height) - (ej.EjSvgRender.utils._getPointXY((ej.util.isNullOrUndefined(end) ? 0 : end), axis.visibleRange, axis.isInversed) * (axis.height));
                                var widthYValue = (axis.y + axis.height) - (ej.EjSvgRender.utils._getPointXY((start + (ej.util.isNullOrUndefined(stripLine.width) ? 0 : stripLine.width)), axis.visibleRange, axis.isInversed) * (axis.height));
                                yHeight = (axis.isInversed ? (pointYend > widthYValue) : (pointYend < widthYValue)) ? Math.abs(pointYstart - pointYend) : Math.abs(pointYstart - widthYValue);
                            }
                        }
                        height = yHeight;
                        x = this.chart.model.m_AreaBounds.X;
                        width = this.chart.model.m_AreaBounds.Width;
                        y = pointYstart + ((axis.isInversed) ? 0 : -yHeight);
                        var textHeight = ej.EjSvgRender.utils._measureText(stripLine.text, width, stripLine.font).height;

                        if (stripLine.textAlignment == 'middletop') {
                            textX = x + width / 2;
                            textY = y + textHeight;
                        } else if (stripLine.textAlignment == 'middlecenter') {
                            textX = x + width / 2;
                            textY = (Math.abs(y + (height / 2)) + (textHeight / 3));
                        } else if (stripLine.textAlignment == 'middlebottom') {
                            textX = x + width / 2;
                            textY = (y + height) - textHeight;

                        }


                    }
                    if (isVisible) {
                        if (!ej.util.isNullOrUndefined(stripLine.imageUrl)) {
                            var imgOptions = {
                                'height': height,
                                'width': width,
                                'href': stripLine.imageUrl,
                                'x': x,
                                'y': y,
                                'id': striplineid.id + '_backImage',
                                'visibility': 'visible',
                                'preserveAspectRatio': 'none'
                            };

                            this.svgRenderer.drawImage(imgOptions, striplineid);
                        } else {
                            var options = {
                                'id': striplineid.id + '_striplineRect_' + axisIndex + '_' + stripLineIndex,
                                'x': x,
                                'y': y,
                                'width': width,
                                'height': height,
                                'fill': stripLine.color,
                                'opacity': stripLine.opacity,
                                'stroke-width': stripLine.borderWidth,
                                'stroke': (stripLine.borderWidth == 0) ? "transparent" : stripLine.borderColor
                            };
                            var textOptions = {
                                'id': striplineid.id + '_striplineRectText_' + axisIndex + '_' + stripLineIndex,
                                'x': textX,
                                'y': textY,
                                'fill': stripLine.font.color,
                                'transform': 'rotate(' + angle + ',' + (textX) + ',' + textY + ')',
                                'labelRotation': angle,
                                'font-size': stripLine.font.size,
                                'font-family': stripLine.font.fontFamily,
                                'font-style': stripLine.font.fontStyle,
                                'font-weight': stripLine.font.fontWeight,
                                'opacity': stripLine.font.opacity,
                                'text-anchor': 'middle'
                            };

                            var bounds = { X: x, Y: y, Width: width, Height: height };
                            var isStripline = stripLine.zIndex == "over" ? true : false;
                            ej.EjSvgRender.utils.AddRegion(this.chart, bounds, isStripline)

                            if (this.chart.model.enableCanvasRendering) {
                                var ctx = this.chart.svgObject.getContext("2d");
                                var clipBounds = axis.orientation.toLowerCase() == 'horizontal' ? { X: axis.x, Y: y, Width: axis.width, Height: this.chart.model.m_AreaBounds.Height }
                                    : { X: x, Y: axis.y, Width: this.chart.model.m_AreaBounds.Width, Height: axis.height };
                                ctx.save();
                                ctx.beginPath();
                                ctx.rect(clipBounds.X, clipBounds.Y, clipBounds.Width, clipBounds.Height);
                                ctx.clip();
                                this.svgRenderer.drawRect(options, striplineid);
                                this.svgRenderer.drawText(textOptions, stripLine.text, striplineid);
                                ctx.closePath();
                                ctx.restore();
                            }
                            else {
                                this.svgRenderer.drawRect(options, striplineid);
                                this.svgRenderer.drawText(textOptions, stripLine.text, striplineid);
                            }
                        }
                    }

                }
            }
        };
})(jQuery)