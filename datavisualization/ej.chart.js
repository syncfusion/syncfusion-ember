ej.ejChart = {};
(function ($) {
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'function' && (typeof obj !== 'object' || obj === null)) {
                    return;
                }

                var result = [], prop, i;

                for (prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }

    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    if (Array.prototype.map === undefined) {
        Array.prototype.map = function (fn) {
            var rv = [];

            for (var i = 0, l = this.length; i < l; i++)
                rv.push(fn(this[i]));

            return rv;
        };
    }
    String.prototype.parseTemplate = function () {
        var str = this;
        $.each(arguments[0], function (dataIndex, dataValue) {
            if (dataValue.count > 0) {
                $.each(dataValue, function (datachildIndex, datachildValue) {
                    var val = new RegExp('#' + dataIndex + '.' + datachildIndex + '#', 'gm')
                    str = str.replace(val.source, datachildValue);
                });
            } else {
                str = str.replace(new RegExp('\\#' + dataIndex + '\\#', 'gm'), dataValue);
            }

        });
        while (str.indexOf('ej.') >= 0) {
            substr = str.substring(str.indexOf('ej.'), str.indexOf(")") + 1);
            str = str.replace(substr, eval(substr));
        }
        return str;
    };

    String.prototype.capitalizeFirstString = (function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    });

    var Gradient = function (colors) {
        this._gradientStop = [];
        for (var j = 0; j < colors.length; j++) {
            this._gradientStop.push(colors[j]);
        }
    };



    ej.ejChart = {

        _renderSfChart: function () {

            var svgSupport = (window.SVGSVGElement) ? true : false;
            var isCanvas = this.model.enableCanvasRendering;
			this.isChartElemId = false;
            //Create id to chart container, if the element don't have id
            if (!this.element[0].id)
                this._createChartId();
            $("#chartContainer_" + this._id).remove();
            if (svgSupport) {
                this.renderer = new ej.EjSvgRender(this.element);
                if (isCanvas) {
                    this.svgRenderer = new ej.EjCanvasRender(this.element);
                    this.legendSvgContainer = this.svgRenderer.createLegendCanvas(this.element); //creating new CANVAS element for legend
                } else {
                    this.svgRenderer = new ej.EjSvgRender(this.element);
                    this.legendSvgContainer = this.svgRenderer.createLegendSvg(this.element); //creating new SVG element for legend
                }
                this._appendChartElements();
                if (!isCanvas)
                    this.legendContainer.find("svg").attr("class", "e-designerhide");
                this._createChart();
                $(this.svgObject).appendTo(this.element);
            }
            else {
                isCanvas = false;
                this.svgRenderer = new ej.EjVmlRender(this.element);
                this.legendSvgContainer = this.svgRenderer.createLegendSvg(this.element); //creating new div element for legend
                this.renderer = new ej.EjVmlRender(this.element);
                this._appendChartElements();
                this._createChart();
                $(this.svgObject).appendTo(this.chartContainer);
            }
            return true;
        },

        _appendChartElements: function () {
            this.legendContainer = $("<div></div>").attr('id', "legend_" + this._id).css("height", "0px");
            this.scrollerContainer = $("<div></div>").attr('id', "legend_Scroller" + this._id).css("height", "0px");
            this.templateContainer = $("<div></div>").attr('id', this._id + "_container_svg_TrackToolTip").css("height", "0px");
            this.chartContainer = $("<div></div>").css("position", "relative").attr('id', "chartContainer_" + this._id);
            this.axisScroll = $("<div></div>").attr('id', "axisScrollbar_" + this._id).css("height", "0px");
            this.svgRenderer.append(this.legendSvgContainer, this.scrollerContainer);
            $(this.scrollerContainer).appendTo(this.legendContainer);
            $(this.axisScroll).appendTo(this.chartContainer);
            $(this.legendContainer).appendTo(this.chartContainer);
            $(this.templateContainer).appendTo(this.chartContainer);
            $(this.chartContainer).appendTo(this.element);
        },

        setSvgSize: function (sender) {
            var chartObj = sender;
            var containerHeight = $(chartObj.element).height();
            var height = 450; //set default height if size not specified to chart or container
            var width = (ej.isTouchDevice()) ? 250 : 600;
            var containerWidth = $(chartObj.element).width();
            var legendcontainerHeight = $(chartObj.chartContainer).height();
            if (chartObj.model.size.width) {
                var chartWidth = chartObj.model.size.width;
                if (typeof (chartWidth) == "string" && chartWidth.indexOf("%") != -1)
                    width = (containerWidth / 100) * parseInt(chartWidth);
                else
                    width = parseInt(chartWidth);
            }
            else if (containerWidth > 0)
                width = containerWidth;

            $(chartObj.svgObject).width(width);

            if (chartObj.model.size.height) {
                var chartHeight = chartObj.model.size.height;
                if (typeof (chartHeight) == "string" && chartHeight.indexOf("%") != -1)
                    height = (!this.vmlRendering) ? (containerHeight / 100) * parseInt(chartHeight) : height;
                else
                    height = parseInt(chartHeight);
            }
            else if (containerHeight > 0)
                height = containerHeight;
            else
                $(chartObj.svgObject).css("display", "block"); //Added css to chart due to 5px difference for container and svg (http://jsfiddle.net/Me5Zd/)       
            $(chartObj.svgObject).height(height);

            $("#" + chartObj._id).css("overflow", "hidden");//Added css to remove scrollbar on zooming the chart
            chartObj.svgObject.setAttribute('width', width);   // assigning width for canvas
            chartObj.svgObject.setAttribute('height', height);  // assigning height for 
        },
        compareExtend: function (temp, src, def) {
            if (typeof def === 'object' && def !== null) {
                var defProp = Object.keys(def), len = defProp.length, currPro;
                for (var i = 0; i < len; i++) {
                    currPro = defProp[i];
                    if (src.hasOwnProperty(currPro) && src[currPro] != null) {
                        if (Array.isArray(src[currPro]) || typeof src[currPro] === 'object' && src[currPro] !== null) {
                            this.compareExtend({}, src[currPro], def[currPro]);
                        }
                    }
                    else {
                        src[currPro] = def[currPro];
                    }
                }
            }
            return src;
        },
        setModelProperties: function (excludeDataUpdate) {

            //set size for the svgObject
            if (!excludeDataUpdate)
                this.setSvgSize(this);

            this.svgWidth = $(this.svgObject).width();
            this.svgHeight = $(this.svgObject).height();

            this.chartCross = {
                visible: (excludeDataUpdate) ? this.chartCross.visible : this.model.crosshair.visible,
                mArea: this.model.crosshair.type
            };

            // extend series with commonSeriesOptions
            this.serAnimation = [];
            if (this.model.series && !excludeDataUpdate) {
                var trendlines, len, currentPoint, currentSeries, nullValue = false, trendLineType, datasource;
                this.model._drawTrendline = false;
                for (var j = 0; j < this.model.series.length; j++) {
					datasource = null;
                    if (!ej.util.isNullOrUndefined(this.model.series[j].dataSource) || !ej.util.isNullOrUndefined(this.model.commonSeriesOptions.dataSource)) {
                        if (!ej.util.isNullOrUndefined(this.model.series[j].dataSource))
                            datasource = this.model.series[j].dataSource;
                        else
                            datasource = this.model.commonSeriesOptions.dataSource;
                    }
                    this.model.series[j] = ej.copyObject({}, this.model.commonSeriesOptions, this.model.series[j]);
                    this.model.series[j].dataSource = datasource;
                    currentSeries = this.model.series[j];
                    this.serAnimation.push((currentSeries.enableAnimation === null || currentSeries.enableAnimation === undefined) ? this.model.commonSeriesOptions.enableAnimation : currentSeries.enableAnimation);
                    trendlines = currentSeries.trendlines;
                    len = trendlines.length;
                    for (var i = 0; i < len; i++) {
                        trendlines[i] = ej.copyObject({}, this.model.trendlineDefaults, trendlines[i]);
                        trendlines[i]._visibility = trendlines[i].visibility;
                        if (trendlines[i].visibility.toLowerCase() == "visible") {
                            this.model._drawTrendline = true;
                            trendLineType = trendlines[i].type.toLowerCase();
                            if (!ej.util.isNullOrUndefined(currentSeries.points)) {
                                for (var l = 0; l < currentSeries.points.length; l++) {
                                    currentPoint = currentSeries.points[l];
                                    if (ej.util.isNullOrUndefined(currentPoint.y) || currentPoint.y == 0) {
                                        nullValue = true;
                                        break;
                                    }
                                }
                            }
                            trendlines[i].isNull = nullValue && (trendLineType == "power" || trendLineType == "exponential") ? true : false;
                        }
                    }
                }
            }
            if (this.model.indicators) {
                for (var k = 0; k < this.model.indicators.length; k++) {
                    this.model.indicators[k] = ej.copyObject({}, this.model.indicatorDefaults, this.model.indicators[k]);
                }
            }

        },

        _createChart: function () {
            this.svgObject = this.svgRenderer.svgObj;
            var commonlaodEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            this._trigger("load", commonlaodEventArgs);
            this.setTheme(ej.EjSvgRender.themes, this.model.theme);
            var model = this.model;

            if (model.series[0] && model.series[0]._isdesigntime) {
                model.series[0] = {};
                model.series[0].points = [];
                var randomPoints = [];
                for (var i = 1; i <= 10; i++) {
                    randomPoints.push({ x: i, y: (Math.floor(Math.random() * (10 - 40)) + 40) });

                }
                model.series[0].points = randomPoints;
            }
            this.vmlRendering = (this.svgRenderer.vmlNamespace) ? true : false;
            if ($(this.element).is(":visible") || $(this.element).css("visibility") != "hidden" || $(this.element).css('display') != 'none') {
                this.bindEvents();
                this.bindTo();
            }
        },
        setTheme: function (jsonObj, themeName) {
            var name = themeName.toLowerCase();
            if ((name.indexOf("azure") >= 0 || name.indexOf("lime") >= 0 || name.indexOf("saffron") >= 0) && (name.indexOf("gradient") == -1) && (name.indexOf("dark") == -1))
                jsonObj[name] = $.extend(true, {}, jsonObj["flatlight"], jsonObj[name]);
            else if ((name.indexOf("azuredark") >= 0 || name.indexOf("limedark") >= 0 || name.indexOf("saffrondark")) >= 0 && (name.indexOf("gradient") == -1))
                jsonObj[name] = $.extend(true, {}, jsonObj["flatdark"], jsonObj[name]);
            else if ((name.indexOf("azure") >= 0 || name.indexOf("lime") >= 0 || name.indexOf("saffron") >= 0) && (name.indexOf("gradient") >= 0) && (name.indexOf("dark") == -1))
                jsonObj[name] = $.extend(true, {}, jsonObj["gradientlight"], jsonObj[name]);
            else if ((name.indexOf("azuredark") >= 0 || name.indexOf("limedark") >= 0 || name.indexOf("saffrondark") >= 0) && (name.indexOf("gradient") >= 0))
                jsonObj[name] = $.extend(true, {}, jsonObj["gradientdark"], jsonObj[name]);
            else if ((name.indexOf("high") >= 0))
                jsonObj[name] = $.extend(true, {}, jsonObj["highcontrast01"], jsonObj[name]);
            else if ((name.indexOf("material") >= 0) || (name.indexOf("office") >= 0))
                jsonObj[name] = $.extend(true, {}, jsonObj["material"], jsonObj[name]);
            else if (!(jsonObj[name])) name = "flatlight";

            if (this.model._themeChanged)
                this.model = ej.copyObject({}, this.model, jsonObj[name]);
            else
                this.model = this.compareExtend({}, this.model, jsonObj[name]);
            // added default property background in synchart to work in angular 1
            this.model.background = ej.util.isNullOrUndefined(this.model.background) ? jsonObj[name].background : this.model.background;


        },
        _drawBackInterior: function () {
            if (this.model.backInterior && this.model.backInterior._gradientStop) {
                var options = {
                    'id': this.svgObject.id + '_backGradient',
                    'x1': '0%',
                    'y1': '0%',
                    'x2': '0%',
                    'y2': $(this.svgObject).height() + '%'
                };
                this.svgRenderer.drawGradient(options, this.model.backInterior._gradientStop);
            }
        },



        _drawBackImage: function () {
            var options = {
                'height': $(this.svgObject).height(),
                'width': $(this.svgObject).width(),
                'href': this.model.backGroundImageUrl,
                'x': 0,
                'y': 0,
                'id': this.svgObject.id + '_backImage',
                'visibility': 'visible',
                'preserveAspectRatio': 'none'
            };

            this.svgRenderer.drawImage(options, this.svgObject);

        },
        _getDataType: function (val) {
            var type = typeof (val);
            if (type === "number" || type === "string")
                return type;
            else if (jQuery.type(val) == "date")
                return "date";
            else if (val == null) {
                return null;
            }
            else
                return false;

        },
        addedXYValues: function (excludeDataUpdate) {
            excludeDataUpdate = (excludeDataUpdate) ? excludeDataUpdate : false;
            var model = this.model,
                series = model.series,
                type = series[0].type.toLowerCase(),
                pointLength, visiblePoints, i, j, k,
                isNullOrUndefined = ej.util.isNullOrUndefined,
                valueType = model.primaryXAxis.valueType,
                setXValueType, isDatetime = false, pointX, currentSeries,
                setSize, //do not compare and set size for all the points
                regExpTest, parsed, points,
                areaType;

            areaType = model.AreaType = ej.seriesTypes[type].prototype.chartAreaType;
            if (areaType != "cartesianAxes" && areaType != "None") {
                areaType = model.AreaType = "polaraxes";
                model.isPolar = (type == 'polar');
            }
            areaType = model.AreaType = model.AreaType.toLowerCase();
            if (!excludeDataUpdate) {
                for (i = 0; i < series.length; i++) {
                    if (series[i].visibility == "visible") {
                        setSize = true;
                        setXValueType = false;
                        if (!series[i].dataSource || series[i].dataSource.length == 0) {
                            points = series[i].points;
                            series[i].points = null;
                            series[i] = $.extend(true, {}, model.commonSeriesOptions, series[i]);
                            series[i].points = points;
                            currentSeries = series[i];
                            if (valueType == "datetime")
                                isDatetime = true;
                            pointLength = points.length;
                            for (var k = 0; k < pointLength; k++) {
                                points[k].YValues = [];

                                //test regular expression only for first point
                                regExpTest = (/^-?[0-9]*\.?[0-9]+$/.test(points[k].x) == true);

                                //avoid using parseFloat unnecessarily. If x is already a number, then no need to use parseFloat
                                parsed = (valueType != "category") && (valueType != "datetime") && (typeof points[k].x === 'string' || points[k].x instanceof String) && parseFloat(points[k].x);

                                if (!isNaN(parsed ? points[k].x : parseFloat(points[k].x)) && parsed && regExpTest && (valueType != "category") && (areaType != "none"))
                                    points[k].x = (!isDatetime ? parseFloat(points[k].x) : new Date(points[k].x));
                                if (typeof points[k].x == "string" && points[k].x.indexOf('<br>') != -1)
                                    points[k].x = points[k].x.replace(/(<br>)+/g, '<br>');
                                points[k].xValue = points[k].x;
                                if (!setXValueType) {
                                    pointX = points[k].x;
                                    if (!isNullOrUndefined(pointX)) {
                                        currentSeries._xAxisValueType = this._getDataType(pointX);
                                        setXValueType = true;
                                    }
                                }
                                if (!(currentSeries._hiloTypes) && (currentSeries.drawType.toLowerCase() != "rangecolumn")) {
                                    points[k].YValues[0] = currentSeries.points[k].y;

                                    setSize = setSize && !isNullOrUndefined(points[k].size);
                                    if (setSize)
                                        points[k].YValues[1] = points[k].size;
                                }
                                else {
                                    if (!isNullOrUndefined(points[k].high)) {
                                        points[k].YValues[0] = points[k].high;
                                        points[k].y = points[k].high;
                                    }
                                    if (!isNullOrUndefined(points[k].low))
                                        points[k].YValues[1] = points[k].low;
                                    if (!isNullOrUndefined(points[k].open))
                                        points[k].YValues[2] = points[k].open;
                                    if (!isNullOrUndefined(points[k].close))
                                        points[k].YValues[3] = points[k].close;
                                }
                            }
                        }
                        else {
                            currentSeries = series[i];
                            currentSeries._xAxisValueType = null;
                            pointLength = currentSeries.points.length;
                            pointX = currentSeries.points[0].x;

                            if (pointX != null) {
                                currentSeries._xAxisValueType = this._getDataType(pointX);
                            }
                            var pointsLength = currentSeries.points.length;
                            var points = currentSeries.points;
                            for (var p = 0; p < pointsLength; p++) {
                                if (typeof points[p].x == "string" && points[p].x.indexOf('<br>') != -1)
                                    points[p].x = points[p].x.replace(/(<br>)+/g, '<br>');
                            }
                        }
                        //Calculate waterfall series points and remove on series changed
                        if (currentSeries.type.toLowerCase() == "waterfall")
                            this.calculateWaterfallSeriesPoints(currentSeries.points);
                        else if (currentSeries._previousType && currentSeries._previousType.toLowerCase() == "waterfall") {
                            visiblePoints = currentSeries.points;
                            for (j = 0; j < visiblePoints.length; j++) {
                                visiblePoints[j].waterfallSum = undefined;
                                visiblePoints[j].textOptions = null;
                            }
                        }
                    }
                }
                this._setInternalValues();
            }
        },
        calculateWaterfallSeriesPoints: function (visiblePoints) {

            var intermediateStartValue = 0;
            var totalSum = 0;
            var previousSum = 0;

            for (var j = 0; j < visiblePoints.length; j++) {
                if (!visiblePoints[j].isEmpty) {
                    totalSum += ((visiblePoints[j].showIntermediateSum || visiblePoints[j].showTotalSum) ? 0 : visiblePoints[j].y);

                    if (visiblePoints[j].showIntermediateSum) {
                        visiblePoints[j].YValues[1] = intermediateStartValue;
                        visiblePoints[j].YValues[0] = totalSum;
                        visiblePoints[j].waterfallSum = totalSum - intermediateStartValue;
                        intermediateStartValue = totalSum;
                    } else if (visiblePoints[j].showTotalSum) {
                        visiblePoints[j].YValues[1] = 0;
                        visiblePoints[j].YValues[0] = totalSum;
                        visiblePoints[j].waterfallSum = totalSum;
                    }
                    else {
                        visiblePoints[j].YValues[1] = previousSum;
                        visiblePoints[j].YValues[0] = previousSum + visiblePoints[j].y;
                        previousSum = totalSum;
                    }
                } else {
                    visiblePoints[j].YValues[1] = 0;
                    visiblePoints[j].YValues[0] = 0;
                }
            }
        },
        _setInternalValues: function () {

            for (var k = 0; k < this.model.series.length; k++) {
                var series = this.model.series[k];
                if (this.model.AreaType == "cartesianaxes" && ej.seriesTypes[series.type.toLowerCase()].prototype.chartAreaType == "cartesianAxes") {
                    series._zOrder = (series.zOrder) ? series.zOrder : 0;
                    this.model._visibleSeries.push(series);
                }
                else if (this.model.AreaType == "none" && ej.seriesTypes[series.type.toLowerCase()].prototype.chartAreaType == "None") {
                    series._zOrder = (series.zOrder) ? series.zOrder : 0;
                    var type = this.model.series[k].type.toLowerCase();
                    if (type == 'funnel' || type == 'pyramid') {
                        this.model._visibleSeries.push(series);
                        break;
                    }
                    else {
                        this.model._visibleSeries.push(series);
                    }
                }
                else if (this.model.AreaType == "polaraxes" && ej.seriesTypes[series.type.toLowerCase()].prototype.chartAreaType == "PolarAxes") {
                    series._zOrder = (series.zOrder) ? series.zOrder : 0;
                    this.model._visibleSeries.push(series);
                }

                if (series._yAxisName || series._xAxisName) {
                    if (this.model._axes) {
                        for (var t = 0; t < this.model._axes.length; t++) {
                            if (series._yAxisName && (series._yAxisName == this.model._axes[t].name)) {
                                this.model._axes[t].orientation = (this.model._axes[t].orientation) ? this.model._axes[t].orientation : (this.model.requireInvertedAxes) ? "horizontal" : "vertical";
                            }
                            if (series._xAxisName && (series._xAxisName == this.model._axes[t].name)) {
                                this.model._axes[t].orientation = (this.model._axes[t].orientation) ? this.model._axes[t].orientation : (this.model.requireInvertedAxes) ? "vertical" : "horizontal";
                            }
                        }
                    }
                }
            }
        },
        setHiloStyle: function (series, pointIndex, seriesIndex, interiorColor) {
            var point = series.points[pointIndex], interior, seriesInterior;

            if (point.fill)
                interior = point.fill;
            else
                interior = series.fill ? series.fill : interiorColor;

            // setting default series color		
            var colors = interior ? interior : this.model.seriesColors[seriesIndex];

            // applying gradient color		  

            seriesInterior = jQuery.type(colors) == "array" ? colors[0].color : colors;

            return seriesInterior;

        },
        setStyle: function (chart, series, seriesIndex, pointIndex, interiorColor, visiblePoints) {

            var pointsColl = visiblePoints || series._visiblePoints, point = pointsColl[pointIndex], interior, borderColor, borderWidth, dashArray, width,
                opacity, seriesFill, pointBorder = point.border, seriesBorder = series.border;
            // var pointStyle = point.style ? point.style : " ";

            if (series._hiloTypes)
                seriesFill = series.isFill ? series.fill : null;

            // setting interior
            if (chart.chartObj.model.AreaType == "cartesianaxes") {
                if (point.fill)
                    interior = point.fill;
                else {
                    if (series.type.toLowerCase() == "waterfall") {
                        if (((point.showIntermediateSum || point.showTotalSum) && (point.waterfallSum > 0)) || (point.y > 0) && !point.showIntermediateSum && !point.showTotalSum)
                            interior = series.positiveFill ? series.positiveFill : interiorColor;
                    } else
                        interior = seriesFill ? seriesFill : interiorColor;
                }

                // setting default series color		
                var colors = interior ? interior : this.model.seriesColors[seriesIndex];

                // applying gradient color		  
                if (chart.chartObj.model.requireInvertedAxes)
                    var seriesInterior = this.svgRenderer.createGradientElement(chart.getSeriesName(series) + "_" + seriesIndex + pointIndex, colors, 0, 0, 100, 0, chart.gSeriesGroupEle);
                else
                    seriesInterior = this.svgRenderer.createGradientElement(chart.getSeriesName(series) + "_" + seriesIndex + pointIndex, colors, 0, 0, 0, 100, chart.gSeriesGroupEle);
            }

            // interior for pie type series
            else {
                var pointColors = this.model.pointColors;
                interior = point.fill ? point.fill : jQuery.type(pointColors[pointIndex]) == "array" ? pointColors[pointIndex][0].color : pointColors[pointIndex];
                var pointInterior = this.svgRenderer.createGradientElement(chart.getSeriesName(series) + pointIndex, interior, 0, 0, 0, ($(chart.svgObject).height() || parseFloat(this.model.size.height)), chart.chartObj.gSeriesEle);
            }

            // setting borderColor
            borderColor = ((pointBorder) && pointBorder.color) ? pointBorder.color : seriesBorder.color;
            borderWidth = ((pointBorder) && !ej.util.isNullOrUndefined(pointBorder.width)) ? pointBorder.width : seriesBorder.width;
            opacity = point.opacity ? point.opacity : series.opacity;
            width = (point.width) ? point.width : series.width;
            dashArray = ((pointBorder) && pointBorder.dashArray) ? pointBorder.dashArray : seriesBorder.dashArray;

            var options = {
                'interior': seriesInterior ? seriesInterior : pointInterior,
                'borderColor': borderColor,
                'borderWidth': borderWidth,
                'width': width,
                'opacity': opacity,
                'dashArray': dashArray
            };
            return options;
        },

        colorNameToHex: function (colour) {
            var color = colour;
            var colours = {
                "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
                "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
                "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
                "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
                "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
                "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
                "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
                "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
                "honeydew": "#f0fff0", "hotpink": "#ff69b4",
                "indianred ": "#cd5c5c", "indigo ": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
                "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
                "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
                "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
                "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
                "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
                "navajowhite": "#ffdead", "navy": "#000080",
                "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
                "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
                "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
                "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
                "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
                "violet": "#ee82ee",
                "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
                "yellow": "#ffff00", "yellowgreen": "#9acd32"
            };

            if (Object.prototype.toString.call(color) == '[object Array]')
                return color;

            if (typeof colours[color.toLowerCase()] != 'undefined')
                return colours[color.toLowerCase()];

            return color;
        },

        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        },

        // set culture for chart
        _setCulture: function (culture) {
            this.culture = ej.preferredCulture(culture);
        },


        draw: function (excludeDataUpdate) {
            this.removeMultiRect();
            var params = {};
            params.axes = {};
            this._drawBackInterior();
            this.model.chartRegions = [];
            this.model.outsideDataRegionPoints = [];
            this.model.regionCount = null;
            this.model.circularRadius = [];
			this.model.circleCenterX = [];
            this.model.circleCenterY = [];
            this.model.innerRadius = [];
            this.model.bounds = [];
            this.accDataLabelRegion = [];
            this.model.rightsidebounds = [];
            this.model.leftsidebounds = [];
            this.model.excludeDataUpdate = excludeDataUpdate;
            this.model.yAxisLabelRegions = [];
            this.model.xAxisLabelRegions = [];
            this.model.axisMultiLevelLabelRegions = [];
            this.model.multiLevelLabelRegions = [];
            this.model.minhightwidth = false;
            this.model._isPieOfPie = false;
            if (!excludeDataUpdate)
                this.model._visibleSeries = [];
            this.model.stackedValue = {};
            this.model._locale = this.model.locale || "en-US";
            this._setCulture(this.model._locale);
            this._localizedLabels = this._getLocalizedLabels();
            var seriesLength = this.model.series.length;
            var series, seriesType;
            if (ej.util.isNullOrUndefined(this.model.sideBySideSeriesPlacement))  // for setting sideBySideSeriesPlacement property values
                this.model._sideBySideSeriesPlacement = (this.model.enable3D) ? false : true;
            else
                this.model._sideBySideSeriesPlacement = this.model.sideBySideSeriesPlacement;
            for (var i = 0; i < seriesLength; i++) {
                series = this.model.series[i];
                seriesType = series.type.toLowerCase();
                series._isTransposed = (seriesType.indexOf("bar") == -1) ? series.isTransposed : !series.isTransposed;
            }
            if (seriesLength > 0)
                this.addedXYValues(excludeDataUpdate);
            this.model.AreaType = this.model.AreaType || "cartesianaxes";

            this._isEjScroller();

            var commonpreRenderEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonpreRenderEventArgs.data = {};
            this._trigger("preRender", commonpreRenderEventArgs);

            this.gLegendEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_Legend' });

            this.gTitleEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_ChartTitle', 'cursor': 'default' });
            this.gSubTitleEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_ChartsubTitle', 'cursor': 'default' });
            this._createAxisLabelAndRange();
            for (var i = 0; i < this.model._axes.length; i++)
                params.axes[this.model._axes[i].name] = {};
            this._initializeSeriesColors();

            this._calculateLegendBounds();

            this.legendRender = new ej.EjLegendRender(this);

            var commonLegendEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonLegendEventArgs.data = { legendBounds: this.model.LegendBounds };
            this._trigger("legendBoundsCalculate", commonLegendEventArgs);

            // Assigning indicator points
            for (var j = 0; j < this.model.indicators.length; j++) {
                var indicator = this.model.indicators[j];
                indicator._points = [];
                indicator.xAxisName = (!(indicator.xAxisName)) ? this.model._axes[0].name : indicator.xAxisName;
                indicator.yAxisName = (!(indicator.yAxisName)) ? this.model._axes[1].name : indicator.yAxisName;
                indicator.isIndicator = true;
                if (indicator.dataSource && indicator.dataSource.length > 0) {
                    indicator._hiloTypes = true;
                    this._processJsonData(indicator.dataSource, indicator);
                    //Indicator uses _points but ProcessJsonData only populate points collection
                    indicator._points = indicator.points;
                } else if (indicator.points.length > 0) {
                    for (var i = 0; i < indicator.points.length; i++) {
                        indicator._points = indicator.points;
                        indicator._points[i].xValue = indicator.points[i].x;
                        indicator._points[i].YValues = [];
                        indicator._points[i].YValues[0] = indicator.points[i].close;
                    }
                }
                else if (indicator.seriesName != "") {
                    for (var index = 0; index < this.model._visibleSeries.length; index++) {
                        var series = this.model._visibleSeries[index];
                        if (indicator.seriesName == series.name)
                            indicator._points = $.extend(true, [], series.points);
                    }
                }
            }

            // calculate category points
            for (k = 0; k < this.model._axes.length; k++) {
                if (this.model._axes[k].valueType && this.model._axes[k].valueType.toLowerCase() == "category") {
                    for (i = 0; i < this.model.indicators.length; i++) {
                        indicator = this.model.indicators[i];
                        if (this.model._axes[k].name == indicator.xAxisName) {
                            for (j = 0; j < indicator._points.length; j++)
                                indicator._points[j].xValue = j;
                        }
                    }
                }
            }

            // calculate ranges for indicator
            this.model.indicatorRange = [];
            for (index = 0; index < this.model.indicators.length; index++) {
                indicator = this.model.indicators[index];
                if (indicator._points.length > 0) {
                    type = indicator.type.toLowerCase();
                    options = new ej.indicatorTypes[type]();
                    options.calculateSegment(indicator, this);
                }
            }


            for (var m = 0; m < this.model._visibleSeries.length; m++) {
                var options = this.model._visibleSeries[m];
                for (i = 0; i < options.points.length; i++) {
                    if (typeof options.points[i].xValue == "string" && options.points[i].xValue.indexOf("/Date(") != -1)
                        options.points[i].xValue = new Date(parseInt(options.points[i].xValue.substr(6)));
                    else
                        break;
                }
            }
            this.model.hAxes = [];
            this.model.vAxes = [];
            var chartobj = this;
            var isStriplineOver = false, isStriplineBehind = false;
            this._arrangeAxis();
            var scrollbarSettings;
            this.model.crosshairLabelVisibility = false;
            for (var k = 0; k < this.model._axes.length; k++) {
                var axis = this.model._axes[k];
                this.model.crosshairLabelVisibility = axis.crosshairLabel.visible || this.model.crosshairLabelVisibility;
                var seriesCollection = [];
                var seriesLength = this.model.series.length;
                var orientation = this.model._axes[k].orientation.toLowerCase();
                var padding = this.model._axes[k].rangePadding.toLowerCase();
                if (ej.util.isNullOrUndefined(this.model._axes[k]._rangePadding))
                    this.model._axes[k]._rangePadding = this.model._axes[k].rangePadding;
                if (padding == "auto") {
                    if (orientation == "vertical") {
                        axis.rangePadding = (!this.model.requireInvertedAxes) ? "normal" : "none";
                    }
                    if (orientation == "horizontal") {
                        axis.rangePadding = (this.model.requireInvertedAxes) ? "normal" : "none";
                    }
                    for (var j = 0; j < seriesLength; j++) {
                        var type = this.model.series[j].type.toLowerCase();
                        if (type.indexOf("100") != -1) {
                            if (axis.name == this.model.series[j]._yAxisName) {
                                axis.rangePadding = "round"; break;
                            }
                        }
                    }
                }
                for (var slCount = 0; slCount < axis.stripLine.length; slCount++) {
                    axis.stripLine[slCount] = $.extend(true, {}, this.model.stripLineDefault, axis.stripLine[slCount]);
                    if (axis.stripLine[slCount].zIndex.toLowerCase() == 'over') {
                        isStriplineOver = true;
                    } else {
                        isStriplineBehind = true;
                    }
                }
                var axisOrientation = axis.orientation.toLowerCase();
                var zOrder = this.model._visibleSeries.length - 1;
                for (j = 0; j < this.model._visibleSeries.length; ++j) {
                    zOrder -= 1;

                    var series = this.model._visibleSeries[j];
                    this.model._hasSeriesPoints = series.points.length > 0 || this.model._hasSeriesPoints;
                    if ((!series.xAxisName)) {
                        series._xAxisName = chartobj.model._axes[0].name;
                    }
                    if (!series.yAxisName) {
                        series._yAxisName = chartobj.model._axes[1].name;
                    }
                    series._xAxisName = (!(series._xAxisName)) ? (!(series.xAxisName) ? chartobj.model._axes[0].name : series.xAxisName) : series._xAxisName;
                    series._yAxisName = (!(series._yAxisName)) ? (!(series.yAxisName) ? chartobj.model._axes[1].name : series.yAxisName) : series._yAxisName;
                    var xAxisName = series._xAxisName.toLowerCase();
                    var yAxisName = series._yAxisName.toLowerCase();
                    var name = axis.name.toLowerCase();
                    if (xAxisName || yAxisName) {
                        if (xAxisName == name || yAxisName == name) {
                            if ((axisOrientation == "horizontal" || (series.type.toLowerCase().indexOf("bar") != -1 && axisOrientation == "vertical")) && axis.valueType && axis.valueType.toLowerCase() == "datetime") {
                                for (var m = 0; m < series.points.length; m++) {
                                    if (typeof series.points[m].xValue == "string" && !isNaN(Date.parse(series.points[m].xValue)))
                                        series.points[m].xValue = new Date(Date.parse(series.points[m].xValue));
                                }
                            }
                            else {
                                if (series._xAxisValueType == "string" && !(axis.valueType))
                                    axis._valueType = (axisOrientation == 'horizontal' && !this.model.requireInvertedAxes) ? 'category' : (axisOrientation == 'vertical' && this.model.requireInvertedAxes) ? 'category' : 'double';

                                if (series._xAxisValueType == "date" && !(axis.valueType))
                                    axis._valueType = (axisOrientation == 'horizontal' && !this.model.requireInvertedAxes) ? "datetime" : (axisOrientation == 'vertical' && this.model.requireInvertedAxes) ? 'datetime' : 'double';
                            }
                            if (this.model._visibleSeries[j].visibility.toLowerCase() == 'visible')
                                seriesCollection.push(series);
                        }

                    }
                }
                if (axisOrientation == ((!this.model.requireInvertedAxes) ? "vertical" : "horizontal")) {
                    var isStacked100 = false;
                    var isStacked = false;
                    var seriesLength = seriesCollection.length;
                    axis.isStacked100 = (seriesCollection.length > 0) ? true : false;
                    for (var i = 0; i < seriesLength; i++) {
                        var type = seriesCollection[i].type.toLowerCase();
                        if (type.indexOf("stacking") != -1 || (this.model.AreaType == 'polaraxes' && (seriesCollection[i].drawType.toLowerCase() == 'column' || seriesCollection[i].drawType.toLowerCase() == 'area') && seriesCollection[i].isStacking)) {
                            if (type.indexOf("100") != -1 && (!isStacked100)) {
                                this._calculateStackingCumulativeValues(seriesCollection, axis, params);
                                isStacked100 = true;
                            } else if (type.indexOf("100") == -1 && (!isStacked)) {
                                this._calculateStackingValues(seriesCollection, axis, params);
                                isStacked = true;
                                axis.isStacked100 = false;
                            }
                        }
                        else {
                            axis.isStacked100 = false;
                        }
                    }
                }
                scrollbarSettings = axis.scrollbarSettings;
                if ((scrollbarSettings.visible) && (scrollbarSettings.pointsLength != null || scrollbarSettings.range.min != null || scrollbarSettings.range.max != null)) {
                    this.model.isLazyZooming = true;
                }
                axis._valueType = (!(axis._valueType)) ? (!(axis.valueType) ? "double" : axis.valueType) : axis._valueType;
                var axisRange = new ej.axisTypes[axis._valueType.toLowerCase()]();
                for (var ser = 0; ser < seriesCollection.length; ser++) {
                    for (var trend = 0; trend < seriesCollection[ser].trendlines.length; trend++) {
                        if (seriesCollection[ser].trendlines[trend].visibility == "visible") {
                            this.model._drawTrendline = true;
                            break;
                        }
                    }
                }
                axisRange._calculateRanges(chartobj, axis, seriesCollection, params, excludeDataUpdate);
            }
            chartobj._chartResize = false;

            var commonAxesInitEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonAxesInitEventArgs.data = { axes: this.model._axes };
            this._trigger("axesLabelsInitialize", commonAxesInitEventArgs);

            this.model.isLazyZooming ? 0 : this._updateScroll();
            var prevHeight,
                prevWidth;
            if (this.svgHeight != this.model.svgHeight || this.svgWidth != this.model.svgWidth) {
                // beforeResize event
                prevHeight = ej.util.isNullOrUndefined(this.prevHeight) ? this.svgHeight : this.prevHeight;
                prevWidth = ej.util.isNullOrUndefined(this.prevWidth) ? this.svgWidth : this.prevWidth;
                commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { currentHeight: prevHeight, currentWidth: prevWidth, newHeight: this.model.svgHeight, newWidth: this.model.svgWidth };
                this._trigger("beforeResize", commonEventArgs);
                if (!commonEventArgs.cancel) {
                    if (this.model.enableCanvasRendering) {
                        this.svgRenderer.svgObj.width = commonEventArgs.data.newWidth;
                        this.svgRenderer.svgObj.height = commonEventArgs.data.newHeight;
                    }
                    this.model.svgWidth = commonEventArgs.data.newWidth;
                    this.model.svgHeight = commonEventArgs.data.newHeight;
                    $(this.svgObject).width(commonEventArgs.data.newWidth);
                    $(this.svgObject).height(commonEventArgs.data.newHeight);
                }
                else {
                    if (this.model.enableCanvasRendering) {
                        this.svgRenderer.svgObj.width = commonEventArgs.data.currentWidth;
                        this.svgRenderer.svgObj.height = commonEventArgs.data.currentHeight;
                    }
                    this.model.svgWidth = commonEventArgs.data.currentWidth;
                    this.model.svgHeight = commonEventArgs.data.currentHeight;
                    $(this.svgObject).width(commonEventArgs.data.currentWidth);
                    $(this.svgObject).height(commonEventArgs.data.currentHeight);
                }
            }
            this._calculateAreaBounds(params);

            if (this.model.enable3D) {

                var Ej3DRender = new ej.Ej3DRender();
                this.vector = new Ej3DRender.vector3D();
                this.matrixobj = new Ej3DRender.matrix3D();
                this.bsptreeobj = new Ej3DRender.BSPTreeBuilder();
                this.polygon = new Ej3DRender.polygon3D();
                this.graphics = new Ej3DRender.Graphics3D();

                this.chart3D = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_Chart3D' });
                ej.Ej3DRender.Polygons = [];
            }


            if (this.model.AreaType != "none") {

                this._calculateAxisSize(params);

                //AxisCrossing                
                for (var i = 0, len = this.model._axes.length; i < len; i++)
                    if (this._validateCrossing(this.model._axes[i]))
                        this._axisCrossing(this.model._axes[i], false, params);
                if (params._crossAxisOverlap) {
                    for (var i = 0, len = this.model._axes.length; i < len; i++)
                        if (params.axes[this.model._axes[i].name]._validCross)
                            this._axisCrossing(this.model._axes[i], true, params);
                    params._crossAxisOverlap = false;
                }

                var commonAreaEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonAreaEventArgs.data = { areaBounds: this.model.m_AreaBounds };
                this._trigger("chartAreaBoundsCalculate", commonAreaEventArgs);

                this._drawChartAreaRect();

                if (this.model.title.text != "" && this.model.title.text && this.model.title.visible)
                    this._drawTitle();

                this.gXaxisEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxis' });

                this.gYaxisEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxis' });

                this.gPolarAxisEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_AxisLine' });
                if (this.model.enable3D) {

                    $.extend(ej.Ej3DAxisRenderer.prototype, this);
                    this.chartaxis = new ej.Ej3DAxisRenderer(this);
                }
                else {
                    $.extend(ej.EjAxisRenderer.prototype, this);
                    this.chartaxis = new ej.EjAxisRenderer(this);
                }

                var chartaxis = this.chartaxis;
                this.model.xAxisTitleRegion = [];
                this.model.yAxisTitleRegion = [];

                if (this.model.enable3D) {
                    for (var l = 0; l < this.model._axes.length; l++) {
                        chartaxis._drawAxes(l, this.model._axes[l], params);
                    }
                    ej.Ej3DChart.prototype.update3DWall(this, params);
                }
                else {
                    for (var l = 0; l < this.model._axes.length; l++) {
                        chartaxis._drawGridLines(l, this.model._axes[l], params);
                    }
                }


                //Based on the column/bar series, modified primaryAxis append to the SVG Object
                if (!this.model.requireInvertedAxes) {
                    this.svgRenderer.append(this.gXaxisEle, this.svgObject);
                    this.svgRenderer.append(this.gYaxisEle, this.svgObject);
                } else {
                    this.svgRenderer.append(this.gYaxisEle, this.svgObject);
                    this.svgRenderer.append(this.gXaxisEle, this.svgObject);
                }

                var x = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.X;
                var y = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.Y;

                var width = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).width() : this.model.m_AreaBounds.Width;
                var height = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).height() : this.model.m_AreaBounds.Height;

                var clipRectOptions = {
                    'id': this.svgObject.id + '_ChartAreaClipRect',
                    'x': x,
                    'y': y,
                    'width': width,
                    'height': height,
                    'fill': 'white',
                    'stroke-width': 1,
                    'stroke': 'Gray'
                };

                this.svgRenderer.drawClipPath(clipRectOptions, this.svgObject);

                this._setZoomProperties();
            }

            else {
                this._drawChartAreaRect();

                clipRectOptions = {
                    'id': this.svgObject.id + '_ChartAreaClipRect',
                    'x': 0,
                    'y': 0,
                    'width': $(this.svgObject).width(),
                    'height': $(this.svgObject).height(),
                    'fill': 'white',
                    'stroke-width': 1,
                    'stroke': 'Gray'
                };

                this.svgRenderer.drawClipPath(clipRectOptions, this.svgObject);

                if (this.model.title.text != "" && this.model.title.text && this.model.title.visible)
                    this._drawTitle();
            }

            if (isStriplineBehind && this.model.AreaType == "cartesianaxes" && !this.model.enable3D) {
                this.gStriplineBehind = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_StriplineBehind', 'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)' });
                this._renderStripline('behind');
            }
            if (this.model.initSeriesRender) {
                this.seriesRender(params, excludeDataUpdate);
                this.indicatorRender();
            }

            var annotationsLength = this.model.annotations.length;
            $('#annotation_group_' + this._id).empty();
            for (var a = 0; a < annotationsLength; a++) {
                var currentAnnotation = this.model.annotations[a];
                if (currentAnnotation.visible) {
                    this.annotationRender(currentAnnotation, a);
                }
            }

            if (this.model.AreaType == "polaraxes" && this.model._axes[1].visible && !this.model.enable3D) {
                this.chartaxis._drawAxisLine(this.model._axes[1]);
            }

            if (this.model.AreaType === "cartesianaxes") {
                if (!this.model.requireInvertedAxes) {
                    this.svgRenderer.append(this.gXaxisEle, this.svgObject);
                    this.svgRenderer.append(this.gYaxisEle, this.svgObject);
                } else {
                    this.svgRenderer.append(this.gYaxisEle, this.svgObject);
                    this.svgRenderer.append(this.gXaxisEle, this.svgObject);
                }

                this.gXaxisTickEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_XAxisTick' });

                this.gYaxisTickEle = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_YAxisTick' });
            }

            $.extend(ej.EjAxisRenderer.prototype, this);
            this.chartaxis = new ej.EjAxisRenderer(this);
            var chartaxis = this.chartaxis;

            if (isStriplineOver && this.model.AreaType == "cartesianaxes" && !this.model.enable3D) {
                this.gStriplineOver = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_StriplineOver', 'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)' });
                this._renderStripline('over');
            }

            if (!this.model.enable3D) {
                var isCartesian = this.model.AreaType.toLowerCase() == "cartesianaxes",
                    axes = this.model._axes,
                    isCanvas = this.model.enableCanvasRendering;
                //draw axes, labels and ticks
                for (var l = 0, len = axes.length; l < len; l++) {
                    var axis = axes[l], lineOption = params.axes[axis.name]._lineOption, isValidCross = params.axes[axis.name]._validCross;
                    if (isCartesian) {
                        chartaxis._drawAxes(l, axis);
                        if (lineOption[0])
                            this.svgRenderer.drawLine(lineOption[0], lineOption[1]);
                        if (axis.orientation.toLowerCase() === "horizontal") {
                            chartaxis._drawXAxisTickLine(l, axis, isCanvas ? null : lineOption[1], params);
                            chartaxis._drawXAxisMultiLevelLabels(l, axis);
                        }
                        else {
                            chartaxis._drawYAxisTickLine(l, axis, isCanvas ? null : lineOption[1], isValidCross);
                            chartaxis._drawYAxisMultiLevelLabels(l, axis);
                        }
                        axis._crossValue = null;
                    }
                }
            }
            if (!this.resetZooming && (this.model._chartAreaZoom || this.panning))
                this._enableZoomingButtons();
            this.resetZooming = false;

            if (this.svgHeight != this.model.svgHeight || this.svgWidth != this.model.svgWidth) {

                this.prevHeight = this.model.svgHeight;
                this.prevWidth = this.model.svgWidth;
                // afterResize event 
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { height: this.prevHeight, width: this.prevWidth, prevHeight: prevHeight, prevWidth: prevWidth, originalHeight: this.svgHeight, originalWidth: this.svgWidth };
                this._trigger("afterResize", commonEventArgs);
            }

            //Checking Selection setting enable 
            var seriesCollection = this.model._visibleSeries, selectionFound;
            selectionFound = $.grep(seriesCollection, function (series) { return series.selectionSettings.enable.toString() == "true"; });
            if (selectionFound.length == 0) {
                this.model.selectionEnable = false;
                this._removeSelection();
            } else
                this.model.selectionEnable = true;

            var selectedData = this.remove_duplicates(this.model.selectedDataPointIndexes);
            //Maintaning the selection state and triggering seleceted data
            if (this.model.selectionEnable) {
                this._removeSelection();
                this.model._isStateChaged = true;
                var data,
                    mode,
                    length = selectedData.length;
                for (var i = 0; i < length; i++) {
                    data = selectedData[i];
                    series = this.model._visibleSeries[data.seriesIndex];
                    if (series) {
                        mode = series.selectionSettings.mode;
                        if ((mode != 'series' && series.points[data.pointIndex]) || mode == 'series')
                            this.segmentSelection(data.event, data.legendData, data.seriesIndex, data.pointIndex, data.data);
                    }
                }
            }
            this.chartUpdating = false;
            var commonLoadedEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonLoadedEventArgs.data = { model: this.model };
            this._trigger("loaded", commonLoadedEventArgs);
            for (var i = 0; i < this.model._axes.length; i++) {
                var axis = $.extend(true, {}, this.model._axes[i]);
                if (axis._valueType.toLowerCase() != "logarithmic")
                    this.model._axes[i].range = axis._initialRange;
            }


        },
        remove_duplicates: function (arr) {
            var arr1 = [],
                arr2 = [],
                length = arr.length,
                mode,
                currentSeries,
                series = this.model._visibleSeries;
            for (var i = 0; i < length; i++) {
                currentSeries = series[arr[i].seriesIndex];
                mode = currentSeries ? currentSeries.selectionSettings.mode : "";
                if (mode == "series") {
                    if (!(arr1.indexOf(arr[i].seriesIndex) > -1))
                        arr2.push(arr[i]);
                    arr1.push(arr[i].seriesIndex);
                }
                else if (mode == "cluster") {
                    if (!(arr1.indexOf(arr[i].pointIndex) > -1))
                        arr2.push(arr[i]);
                    arr1.push(arr[i].pointIndex);
                } else {
                    if (!(arr[i] in arr1))
                        arr2.push(arr[i]);
                    arr1.push(arr[i]);
                }
            }

            return arr2;

        },

        // set value to private variable for two way binding
        _setZoomProperties: function () {

            var axis, _zf, _zp, orientation;
            for (var l = 0; l < this.model._axes.length; l++) {
                axis = this.model._axes[l];
                orientation = axis.orientation.toLowerCase();
                _zf = axis.zoomFactor.toFixed(3);
                _zp = axis.zoomPosition.toFixed(3);
                if (orientation == "horizontal" && (_zf != this._xZoomFactor() || _zp != this._xZoomPosition())) {
                    this._xZoomFactor(axis.zoomFactor.toFixed(3));
                    this._xZoomPosition(axis.zoomPosition.toFixed(3));
                }
                if (orientation == "vertical" && (_zf != this._yZoomFactor() || _zp != this._yZoomPosition())) {
                    this._yZoomFactor(axis.zoomFactor.toFixed(3));
                    this._yZoomPosition(axis.zoomPosition.toFixed(3));
                }
            }
        },

        annotationRender: function (currentAnnotation, a) {                           // method to render annotation
            //declaration and initialization
            var chartContainer = this._id;
            var flag = false;
            var currentSeries = this.model.series[0];
            var seriesType = currentSeries.type.toLowerCase();
            var areaBoundsX = this.model.m_AreaBounds.X;
            var areaBoundsY = this.model.m_AreaBounds.Y;
            var areaBoundsWidth = this.model.m_AreaBounds.Width;
            var areaBoundsHeight = this.model.m_AreaBounds.Height;
            var marginLeft = this.model.margin.left;
            var marginTop = this.model.margin.top;

            var seriesIndex = $.inArray(currentSeries, this.model._visibleSeries);
            var radius = this.model.circularRadius[seriesIndex];
            var centerX = this.model.circleCenterX[seriesIndex];
            var centerY = this.model.circleCenterY[seriesIndex];
            var currentDocument = $(document);
            var annotationIndex = false;

            currentAnnotation = $.extend(true, {}, this.model.annotationsDefault, currentAnnotation);   // extending defaults

            // creating annotation group
            if ($('#annotation_group_' + chartContainer).length != 0)
                var annotationContainer = $('#annotation_group_' + chartContainer);
            else
                annotationContainer = $("<div></div>").attr('id', "annotation_group_" + chartContainer);
            annotationContainer.css({ "position": "absolute", "left": "0px", "top": "0px" });

            var content = currentAnnotation.content;
            element = $("#" + content);
            if (element.get(0).tagName == "SCRIPT")                // for jsrender
                var element = $($("#" + content)[0].innerHTML);
            var cloneNode = element.clone();                        // clone
            var id = 'annotation_' + chartContainer + "_" + content + "_" + a;
            $(cloneNode).attr("id", id);
            var $cloneNode = $(cloneNode);
            $cloneNode.css({
                'position': "absolute",
                'z-index': 2000
            });

            // initialization
            var region = currentAnnotation.region.toLowerCase();
            var coordinateUnit = currentAnnotation.coordinateUnit.toLowerCase();
            var annotationX = (typeof currentAnnotation.x == "string" || typeof currentAnnotation.x == "object") ? Date.parse(currentAnnotation.x) : currentAnnotation.x;
            var annotationY = currentAnnotation.y;
            var horizontalAlignment = currentAnnotation.horizontalAlignment.toLowerCase();
            var verticalAlignment = currentAnnotation.verticalAlignment.toLowerCase();

            if (coordinateUnit == "pixels") {                          //pixels
                if (region == "series") {                             // chart area / series
                    if ((areaBoundsWidth + areaBoundsX + marginLeft > annotationX + areaBoundsX) &&
                        areaBoundsHeight + areaBoundsY + marginTop > annotationY + areaBoundsY) {
                        var left = annotationX + areaBoundsX;
                        var top = annotationY + areaBoundsY;
                    }
                }
                else if (region == "chart") {                         // chart
                    if (($(this.svgObject).width() > annotationX) &&
                        $(this.svgObject).height() > annotationY) {
                        left = annotationX;
                        top = annotationY;
                    }
                }

                $cloneNode.css({
                    "left": left,
                    "top": top
                });
                flag = true;                                // to denote that the annotation should be appended in DOM
            } else if (coordinateUnit == "points") {        //points
                var point = {
                    'x': annotationX,
                    'y': annotationY
                };

                if (this.model.AreaType == "polaraxes") {   // polar
                    xAxis = this.model._axes[0];
                    yAxis = this.model._axes[1];
                    if ((annotationX >= xAxis.visibleRange.min && annotationX <= xAxis.visibleRange.max)
                        && (annotationY >= yAxis.visibleRange.min && annotationY <= yAxis.visibleRange.max)) {
                        var location = this.TransformToVisibleAnnotation(xAxis, yAxis, annotationX, annotationY, this);
                        $cloneNode.css({
                            "left": location.X,
                            "top": location.Y
                        });
                        flag = true;
                    }
                } else if (seriesType == "pyramid" || seriesType == "funnel") { // pyramid and funnel
                    for (var k = 0; k < currentSeries._visiblePoints.length; k++) {
                        annotationIndex = (currentSeries._visiblePoints[k].xValue <= annotationX && annotationX < currentSeries._visiblePoints.length) ? true
                            : (Date.parse(currentSeries._visiblePoints[k].xValue) <= annotationX && annotationX < currentSeries._visiblePoints.length) ? true : false;
                        if (annotationIndex) {
                            var currentPoint = currentSeries._visiblePoints[annotationX];
                            $cloneNode.css({
                                "left": currentPoint.xLocation + this.pyrX,
                                "top": currentPoint.yLocation + this.pyrY - (currentPoint.height / 2)
                            });
                            flag = true;
                        }
                    }
                } else if (seriesType == "pie" || seriesType == "doughnut" || seriesType == "pieofpie") { // pie, pieofpie and doughnut
                    for (var k = 0; k < currentSeries._visiblePoints.length; k++) {
                        annotationIndex = (currentSeries._visiblePoints[k].xValue <= annotationX && annotationX < currentSeries._visiblePoints.length) ? true
                            : (Date.parse(currentSeries._visiblePoints[k].xValue) <= annotationX && annotationX < currentSeries._visiblePoints.length) ? true : false;
                        if (annotationIndex) {
                            currentPoint = currentSeries._visiblePoints[annotationX];
                            var pointIndex = annotationX;
                            var startX, startY;
                            var series = new ej.seriesTypes[seriesType]();
                            var midAngle = currentPoint ? currentPoint.currentMidAngle : 0;
                            if ((pointIndex == currentSeries.explodeIndex || currentSeries.explodeAll) && !this.vmlRendering) {
                                startX = centerX + Math.cos(midAngle) * currentSeries.explodeOffset;
                                startY = centerY + Math.sin(midAngle) * currentSeries.explodeOffset;
                            } else {
                                startX = centerX;
                                startY = centerY;
                            }
                            var midX = series.getXCordinate(startX, (radius), midAngle);
                            var midY = series.getYCordinate(startY, (radius), midAngle);

                            positionX = (midX + startX) / 2;
                            positionY = (midY + startY) / 2;

                            positionX = (midX + positionX) / 2;
                            positionY = (midY + positionY) / 2;

                            $cloneNode.css({
                                "left": positionX,
                                "top": positionY
                            });
                            flag = true;
                        }
                    }
                } else {                                               // cartesianaxes
                    var xAxisName = currentAnnotation.xAxisName;
                    var yAxisName = currentAnnotation.yAxisName;
                    var axesLength = this.model._axes.length;
                    for (var i = 0; i < axesLength; i++) {
                        if (this.model._axes[i].name == xAxisName)
                            var xAxis = this.model._axes[i];
                        if (this.model._axes[i].name == yAxisName)
                            var yAxis = this.model._axes[i];
                    }
                    if (!xAxis) xAxis = this.model._axes[0];           // setting primary axis by default
                    if (!yAxis) yAxis = this.model._axes[1];
                    var minRange = (typeof xAxis.range.min == "string" || typeof xAxis.range.min == "object") ? Date.parse(xAxis.range.min) : xAxis.range.min;
                    var maxRange = (typeof xAxis.range.max == "string" || typeof xAxis.range.max == "object") ? Date.parse(xAxis.range.max) : xAxis.range.max;
                    if (minRange <= annotationX && maxRange >= annotationX) {

                        if (!this.model.requireInvertedAxes) {
                            location = this._getAnnotationPoint(point, xAxis, yAxis);
                            $cloneNode.css({
                                "left": location.X + areaBoundsX,
                                "top": location.Y + yAxis.y
                            });
                        }
                        else {
                            point.x = point.y + (point.y = point.x, 0);// swapping x, y => a = b + (b=a, 0)
                            location = this._getAnnotationPoint(point, yAxis, xAxis);
                            $cloneNode.css({
                                "left": location.X + areaBoundsX,
                                "top": location.Y + xAxis.y
                            });
                        }
                        flag = true;
                    }
                }
            } else {                                                                      //other alignment
                $cloneNode.css("display", "block").appendTo($(annotationContainer));       //append
                $(annotationContainer).appendTo('#' + 'chartContainer_' + chartContainer);
                var width = $cloneNode.outerWidth();
                var height = $cloneNode.outerHeight();
                if (region == "chart") {
                    switch (horizontalAlignment) {
                        case "middle":
                            left = $(this.svgObject).width() / 2 - width / 2;
                            break;
                        case "left":
                            left = 0;
                            break;
                        case "right":
                            left = $(this.svgObject).width() - width;
                    }
                    switch (verticalAlignment) {
                        case "middle":
                            top = $(this.svgObject).height() / 2 - height / 2;
                            break;
                        case "top":
                            top = 0;
                            break;
                        case "bottom":
                            top = $(this.svgObject).height() - height;
                    }
                } else {
                    if (seriesType == "pie" || seriesType == "doughnut" || seriesType == "pieofpie") {             // for pie, pieofpie and doughnut
                        left = centerX;
                        top = centerY;
                        switch (horizontalAlignment) {
                            case "middle":
                                left = centerX - width / 2;
                                break;
                            case "left":
                                left = centerX - radius;
                                break;
                            case "right":
                                left = centerX + radius - width;
                        }

                        switch (verticalAlignment) {
                            case "middle":
                                top = centerY - height / 2;
                                break;
                            case "top":
                                top = centerY - radius;
                                break;
                            case "bottom":
                                top = centerY + radius;
                        }
                    } else {
                        switch (horizontalAlignment) {
                            case "middle":
                                left = areaBoundsX + (areaBoundsWidth / 2) - width / 2;
                                break;
                            case "left":
                                left = areaBoundsX;
                                break;
                            case "right":
                                left = areaBoundsX + areaBoundsWidth - width;
                        }

                        switch (verticalAlignment) {
                            case "middle":
                                top = areaBoundsY + (areaBoundsHeight / 2) - height / 2;
                                break;
                            case "top":
                                top = areaBoundsY;
                                break;
                            case "bottom":
                                top = areaBoundsY + areaBoundsHeight - height;
                        }
                    }
                }
                if (seriesType == "pyramid" || seriesType == "funnel") {         // to remove margin value
                    left -= marginLeft;
                }
                $cloneNode.css({
                    "left": left,
                    "top": top
                });
            }

            left = parseFloat($cloneNode.css("left"));
            top = parseFloat($cloneNode.css("top"));                              // get left and top value
            if (coordinateUnit != "none" && flag) {
                $cloneNode.css("display", "block").appendTo($(annotationContainer));   //append
                $(annotationContainer).appendTo('#' + 'chartContainer_' + chartContainer);
                width = $cloneNode.outerWidth();
                height = $cloneNode.outerHeight();
                switch (horizontalAlignment) {
                    case "middle":
                        left -= width / 2;
                        break;
                    case "left":
                        left -= width;
                        break;
                }
                switch (verticalAlignment) {
                    case "middle":
                        top -= height / 2;
                        break;
                    case "top":
                        top -= height;
                        break;
                }
            }
            var margin = currentAnnotation.margin;                      // margin values
            left = left + margin.left - margin.right;
            top = top + margin.top - margin.bottom;

            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);          // trigger event
            commonEventArgs.data = {
                content: $cloneNode.html(), location: { x: left, y: top },
                opacity: currentAnnotation.opacity, angle: currentAnnotation.angle
            };
            this._trigger("annotationRendering", commonEventArgs);

            $cloneNode.html(commonEventArgs.data.content);
            $cloneNode.css({
                "left": commonEventArgs.data.location.x,
                "top": commonEventArgs.data.location.y,
                "opacity": commonEventArgs.data.opacity                  //opacity
            });

            var angle = commonEventArgs.data.angle;                     // angle
            if (angle) {
                $cloneNode.css({
                    '-ms-transform': 'rotate(' + angle + 'deg)',        //IE 10 and 9
                    '-webkit-transform': 'rotate(' + angle + 'deg)',    // chrome
                    '-moz-transform': 'rotate(' + angle + 'deg)',       // firefox
                    '-o-transform': 'rotate(' + angle + 'deg)',         // opera
                    '-transform': 'rotate(' + angle + 'deg)'            // general
                });
            }

            var eleId = $cloneNode.attr("id");                          // id of annotation
            var topHeight = bottomHeight = leftWidth = rightWidth = 0;
            var chartWidth = $("#" + this._id).width();
            var chartHeight = $("#" + this._id).height();
            if (flag && (angle == 0) && (region == "series" || coordinateUnit == "points")) {
                if (areaBoundsWidth + areaBoundsX < left + width) {                       // clip right width
                    var excessWidth = (left + width) - (areaBoundsWidth + areaBoundsX);
                    rightWidth = width - excessWidth;
                }
                if (left < areaBoundsX) {                                                  // clip left width
                    leftWidth = areaBoundsX - left;
                }
                if (areaBoundsHeight + areaBoundsY < top + height) {                      // clip bottom height
                    excessHeight = (top + height) - (areaBoundsHeight + areaBoundsY);
                    bottomHeight = height - excessHeight;
                }
                if (top < areaBoundsY) {                                                 // clip top height
                    topHeight = areaBoundsY - top;
                }
                rightWidth = (rightWidth == 0) ? width : rightWidth;
                bottomHeight = (bottomHeight == 0) ? height : bottomHeight;
                document.getElementById(eleId).style.clip = "rect(" + topHeight.toString() + "px," +  // clipping annotation
                    rightWidth.toString() + "px," +
                    bottomHeight.toString() + "px," +
                    leftWidth + "px)";
            }
            else if (flag && (angle == 0) && region == "chart") {
                if (chartWidth < left + width) {                              // clip right width
                    excessWidth = (left + width) - chartWidth;
                    var rightWidth = width - excessWidth;
                }
                if (left < 0) {                                              // clip left width
                    var leftWidth = width + left;
                    leftWidth = (leftWidth == 0) ? width : leftWidth;
                }
                if (chartHeight < top + height) {                            // clip bottom height
                    var excessHeight = (top + height) - chartHeight;
                    var bottomHeight = height - excessHeight;
                }
                if (top < 0) {                                               // clip top height
                    topHeight = height + top;
                    topHeight = (topHeight == 0) ? height : topHeight;
                }
                rightWidth = (rightWidth == 0) ? width : rightWidth;
                bottomHeight = (bottomHeight == 0) ? height : bottomHeight;
                document.getElementById(eleId).style.clip = "rect(" +
                    topHeight.toString() + "px," +
                    rightWidth.toString() + "px," +
                    bottomHeight.toString() + "px," +
                    leftWidth + "px)";
            }
            else if (flag && (angle == 90) && (region == "series" || coordinateUnit == "points")) {

                var clientRect = document.getElementById(eleId).getBoundingClientRect();
                left = clientRect.left - $(this.svgObject).offset().left + currentDocument.scrollLeft();
                top = clientRect.top - $(this.svgObject).offset().top + currentDocument.scrollTop();

                if (areaBoundsHeight + areaBoundsY < top + width) {                      // clip right width
                    excessWidth = (top + width) - (areaBoundsHeight + areaBoundsY);
                    rightWidth = width - excessWidth;
                }

                if (left < areaBoundsX) {                                                  // clip bottom height

                    excessHeight = areaBoundsX - left;
                    bottomHeight = height - excessHeight;
                }

                if (top < areaBoundsY) {                                                 // clip left width
                    leftWidth = areaBoundsY - top;
                }

                if (areaBoundsWidth + areaBoundsX < left + height) {                       // clip top height
                    excessHeight = (left + height) - (areaBoundsWidth + areaBoundsX);
                    topHeight = excessHeight;
                }

                rightWidth = (rightWidth == 0) ? width : rightWidth;
                bottomHeight = (bottomHeight == 0) ? height : bottomHeight;

                document.getElementById(eleId).style.clip = "rect(" + topHeight.toString() + "px," +         // clipping annotation
                    rightWidth.toString() + "px," +
                    bottomHeight.toString() + "px," +
                    leftWidth + "px)";
            }
            else if (flag && (angle == 90) && region == "chart") {
                var clientRect = document.getElementById(eleId).getBoundingClientRect();
                left = clientRect.left - $(this.svgObject).offset().left;
                top = clientRect.top - $(this.svgObject).offset().top;

                if (chartHeight < top + width) {                              // clip right width
                    excessWidth = (top + width) - chartHeight;
                    rightWidth = width - excessWidth;
                }
                if (left < 0) {                                              // clip bottom height
                    excessHeight = 0 - left;
                    bottomHeight = height - excessHeight;
                    bottomHeight = (bottomHeight == 0) ? height : bottomHeight;
                }
                if (top < 0) {                                               // clip left width
                    leftWidth = 0 - top;
                    leftWidth = (leftWidth == 0) ? width : leftWidth;
                }
                if (chartWidth < left + height) {                            // clip top height
                    excessHeight = (left + height) - chartWidth;
                    topHeight = excessHeight;
                }

                rightWidth = (rightWidth == 0) ? width : rightWidth;
                bottomHeight = (bottomHeight == 0) ? height : bottomHeight;
                document.getElementById(eleId).style.clip = "rect(" +
                    topHeight.toString() + "px," +
                    rightWidth.toString() + "px," +
                    bottomHeight.toString() + "px," +
                    leftWidth + "px)";
            }
        },                                                                 // ---------------------------- end of annotation 

        TransformToVisibleAnnotation: function (xAxis, yAxis, x, y, sender) {       // method to get the position of points in polar/ radar
            x = (xAxis._valueType == "logarithmic") && x > 0 ? Math.log(x, xAxis.logBase) : x;
            y = (xAxis._valueType == "logarithmic") && y > 0 ? Math.log(y, yAxis.logBase) : y;
            var radius = sender.model.Radius * ej.EjSvgRender.utils._valueToCoefficient(yAxis, y, this);
            var point = ej.EjSvgRender.utils._valueToVector(xAxis, x);
            return { X: sender.model.centerX + radius * point.X, Y: sender.model.centerY + radius * point.Y };
        },

        _getAnnotationPoint: function (point, xAxis, yAxis) {                     // method to get the position of points (cartesianaxes)
            var requireInvertedAxes = this.model.requireInvertedAxes;
            var x = point.x;
            var y = point.y;

            var xvalue = (xAxis._valueType == "logarithmic") ? ej.EjSvgRender.utils._logBase((x == 0 ? 1 : x), xAxis.logBase) : x;
            var yvalue = (yAxis._valueType == "logarithmic") ? ej.EjSvgRender.utils._logBase((y == 0 ? 1 : y), xAxis.logBase) : y;
            xvalue = ej.EjSvgRender.utils._getPointXY(xvalue, xAxis.visibleRange, xAxis.isInversed) * (xAxis.width);
            yvalue = (1 - ej.EjSvgRender.utils._getPointXY(yvalue, yAxis.visibleRange, yAxis.isInversed)) * (yAxis.height);

            point.location = { X: xvalue, Y: yvalue };
            return point.location;
        },

        indicatorRender: function () {
            if ($(this.svgObject).find("#" + this.svgObject.id + "_IndicatorCollection").length > 0) {
                $(this.svgObject).find("#" + this.svgObject.id + "_IndicatorCollection").remove();
            }

            var indOptions = { 'id': this.svgObject.id + '_IndicatorCollection', 'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)' };

            this.gIndicatorEle = this.svgRenderer.createGroup(indOptions);

            for (var i = 0; i < this.model.indicators.length && this.model.indicators[i].visible && this.model.indicators[i]._points.length > 0; i++) {
                var indicator = this.model.indicators[i];
                var options;
                var duration = indicator.animationDuration;
                for (var j = 0; j < this.model._axes.length; j++) {
                    var axis = this.model._axes[j];

                    if (axis.name && axis.orientation.toLowerCase() == 'horizontal' && axis.name.toLowerCase() == indicator.xAxisName.toLowerCase()) {
                        indicator.xAxis = axis;
                    } else if (axis.name && axis.orientation.toLowerCase() == 'vertical' && axis.name.toLowerCase() == indicator.yAxisName.toLowerCase()) {
                        indicator.yAxis = axis;
                    }
                }
                var type = indicator.type.toLowerCase();
                options = new ej.indicatorTypes[type]();
                //Clip the canvas Chart indicator series out of chartArea Bounds
                if (this.model.enableCanvasRendering) {
                    this.svgRenderer.ctx.save();
                    this.svgRenderer.ctx.beginPath();
                    this.svgRenderer.ctx.rect(this.model.m_AreaBounds.X, indicator.yAxis.y, indicator.xAxis.width, indicator.yAxis.height);
                    this.svgRenderer.ctx.clip();
                    options.draw(indicator, this);
                    this.svgRenderer.ctx.restore();
                } else
                    options.draw(indicator, this);
                var element = options.gIndicatorGroupEle;
                if (element) ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, indicator, this);

                if (!this.vmlRendering && !this.model.enableCanvasRendering) {
                    if (indicator.enableAnimation && (!indicator._animatedSeries || indicator.type != indicator._previousType)) {
                        this.svgRenderer.append(this.gIndicatorEle, this.svgObject);
                        var clipRect = $(this.gIndicatorEle).find("#" + this.svgObject.id + '_indicatorGroup' + '_' + i + "_ClipRect").children();
                        ej.EjSeriesRender.prototype._doLineAnimation(this, clipRect, duration);    // for indicator animation
                        this.model.AnimationComplete = true;
                        indicator._animatedSeries = true;
                        indicator._previousType = indicator.type;

                    }
                }
                this.svgRenderer.append(this.gIndicatorEle, this.svgObject);
            }

        },

        doAnimation: function (series) {
            // Declaration
            var chartObj = this,
                model = chartObj.model,
                requireInvertedAxes = model.requireInvertedAxes,
                type = series.type.toLowerCase(),
                seriesIndex = $.inArray(series, model._visibleSeries),
                gSeriesGroupId = this.svgObject.id + "_SeriesGroup_" + seriesIndex,
                markerElements = $(chartObj.gSymbolGroupEle)[seriesIndex].childNodes,
                markerLength = markerElements.length,
                dataLabels = $(chartObj.gDataLabelEle)[seriesIndex].childNodes,
                dataLabelLength = dataLabels.length,
                connectorLines = $(chartObj.gConnectorEle)[seriesIndex].childNodes,
                connectorLineLength = connectorLines.length,
                errorBarElements = $(chartObj.gErrorBarGroupEle)[seriesIndex] == undefined ?
                    undefined : $(chartObj.gErrorBarGroupEle)[seriesIndex].childNodes,
                errorBarEleLength = ej.util.isNullOrUndefined(errorBarElements) ? 0 : errorBarElements.length,
                animationType = series._animationType, clipRect, errorBarInterval, boxWhiskerInterval, lineEle, pathEle,
                markerInterval, dataLabelInterval, index, elements, elementsLength, clipRect, time,
                ubound = 20, lbound = 0, randomValue, delayInterval, marker, i, j, defaultDuration, doLineSymbolDuration,
                animateSymbolDuration, animateRectDuration, animationDuration,
                seriesRender = ej.EjSeriesRender.prototype;
            chartObj.gSeriesGroupEle = $("#" + gSeriesGroupId)[0];
            animationDuration = chartObj.model.series[seriesIndex].animationDuration;
            if (!ej.util.isNullOrUndefined(animationDuration)) {
                defaultDuration = animateSymbolDuration = animateRectDuration = parseFloat(animationDuration);
                doLineSymbolDuration = defaultDuration / 10;
            } else {
                defaultDuration = 2000;
                doLineSymbolDuration = 200;
                animateSymbolDuration = 500;
                animateRectDuration = 1000;
            }

            switch (animationType) {
                case "rect":
                    elements = $(this.gSeriesEle).find("#" + gSeriesGroupId).children("rect");
                    elementsLength = elements.length;
                    clipRect = $(chartObj.gSeriesEle).find("#" + gSeriesGroupId + "_ClipRect").children();
                    if (type == "boxandwhisker") {
                        lineEle = $(this.gSeriesEle).find("#" + gSeriesGroupId).children("line");
                        pathEle = $(this.gSeriesEle).find("#" + gSeriesGroupId).children("path");
                        boxWhiskerInterval = defaultDuration / pathEle.length;
                        for (var k = 0; k < lineEle.length; k++) {
                            seriesRender._doLineSymbol(lineEle[k], boxWhiskerInterval, k, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                            seriesRender._doLineSymbol(elements[k], boxWhiskerInterval, k, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                        }
                        for (var j = 0; j < pathEle.length; j++) {
                            seriesRender._doLineSymbol(pathEle[j], boxWhiskerInterval, j, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                        }
                    }
                    else {
                        if (!type.indexOf("stacking") > -1 && series.animationType.toLowerCase() == "smooth") {
                            seriesRender.animateRect(clipRect, series, requireInvertedAxes, chartObj, animateRectDuration);
                        } else {
                            for (i = 0; i < elementsLength; i++) {
                                if (type.indexOf("stacking") > -1)
                                    seriesRender.animateStackingRect(elements[i], series, requireInvertedAxes, chartObj, animateRectDuration);
                                else
                                    seriesRender.animateRect(elements[i], series, requireInvertedAxes, chartObj, animateRectDuration);
                            }
                        }                        
                    }
                    markerInterval = dataLabelInterval = errorBarInterval = (defaultDuration / 4);
                    break;
                case "path":
                    clipRect = $(chartObj.gSeriesEle).find("#" + gSeriesGroupId + "_ClipRect").children();
                    seriesRender._doLineAnimation(chartObj, clipRect, defaultDuration);
                    markerInterval = defaultDuration / markerLength;
                    dataLabelInterval = defaultDuration / dataLabelLength;
                    errorBarInterval = defaultDuration / errorBarEleLength;
                    break;
                case "scatter":
                    for (i = 0; i < markerLength; i++) {
                        randomValue = Math.floor(Math.random() * (ubound - lbound) + lbound);
                        delayInterval = parseInt(randomValue * 50);
                        seriesRender.animateSymbol(markerElements[i], delayInterval, series, requireInvertedAxes, chartObj, animateSymbolDuration);
                    }
                    break;
                case "bubble":
                    elements = $(this.gSeriesGroupEle).children().not("defs");
                    delayInterval = 0;
                    for (i = 0; i < elements.length; i++)
                        seriesRender.animateSymbol(elements[i], delayInterval, series, requireInvertedAxes, chartObj, animateSymbolDuration);
                    for (i = 0; i < markerLength; i++)
                        seriesRender.animateSymbol(markerElements[i], delayInterval, series, requireInvertedAxes, chartObj, animateSymbolDuration);
                    for (i = 0; i < dataLabelLength; i++)
                        seriesRender.animateSymbol(dataLabels[i], delayInterval, series, requireInvertedAxes, chartObj, animateSymbolDuration);
                    for (i = 0; i < connectorLineLength; i++)
                        seriesRender.animateSymbol(connectorLines[i], delayInterval, series, requireInvertedAxes, chartObj, animateSymbolDuration);
                    break;
                case "hilo":
                    elements = $(this.gSeriesGroupEle).children().not("defs");
                    elementsLength = elements.length;
                    time = defaultDuration / elementsLength;
                    for (var i = 0; i < elementsLength; i++)
                        seriesRender._doLineSymbol(elements[i], time, i, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                    dataLabelInterval = defaultDuration / dataLabelLength;
                    break;
                case "cylinder":
                    clipRect = $(chartObj.gSeriesEle).find("#" + gSeriesGroupId + "_ClipRect").children();
                    seriesRender.animateCylinder(chartObj, series, requireInvertedAxes, clipRect, defaultDuration);
                    markerInterval = dataLabelInterval = errorBarInterval = (defaultDuration / 4);
                    break;
            }

            if (animationType != "bubble") {
                for (j = 0; j < markerLength; j++) {              // for marker
                    index = animationType == "rect" || animationType == "stackingRect" ? 2 : j;
                    seriesRender._doLineSymbol(markerElements[j], markerInterval, index, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                }

                for (j = 0; j < dataLabelLength; j++) {            // for data label
                    index = animationType == "rect" || animationType == "stackingRect" ? 2 : j;
                    seriesRender._doLineSymbol(dataLabels[j], dataLabelInterval, index, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                }

                time = defaultDuration / connectorLineLength;
                for (j = 0; j < connectorLineLength; j++) {        // for connector lines
                    index = animationType == "rect" || animationType == "stackingRect" ? 2 : j;
                    seriesRender._doLineSymbol(connectorLines[j], time, index, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                }
            }

            if (series.errorBar.visibility == "visible") {
                for (j = 0; j < errorBarEleLength; j++) {      // for error bar
                    index = animationType == "rect" || animationType == "stackingRect" ? 2 : j;
                    seriesRender._doLineSymbol(errorBarElements[j], errorBarInterval, index, series, requireInvertedAxes, chartObj, doLineSymbolDuration);
                }
            }
        },
        _animationElements: function (seriesOptions, seriesType, seriesIndex) {
            var chartObj = this;
            var animationDuration = chartObj.model.series[seriesIndex].animationDuration;
            var duration = !ej.util.isNullOrUndefined(animationDuration) ? parseFloat(animationDuration) : 2000;
            seriesOptions._previousType = ej.util.isNullOrUndefined(seriesOptions._previousType) ? seriesOptions.type : seriesOptions._previousType;
            if (seriesOptions.enableAnimation && !this.vmlRendering && !this.model.enableCanvasRendering && (!seriesOptions._animatedSeries || seriesOptions.type != seriesOptions._previousType)) {
                ej.EjSeriesRender.prototype.doCircularAnimation(this, seriesOptions, seriesType, seriesIndex, duration);
                seriesOptions._previousType = seriesOptions.type;
                seriesOptions._animatedSeries = chartObj.isSplitted ? false : true;
            }
            chartObj.isSplitted = false;
            this.drawAccDisplayText(seriesType, seriesOptions, seriesIndex);
            //Show the datalabel text element on redraw when enable animation of series
            if (seriesOptions.enableAnimation && seriesOptions._visiblePoints.length > 0 && seriesOptions.AnimationComplete && !this.vmlRendering && !this.model.enableCanvasRendering) {
                chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gSeriesTextEle[seriesIndex].id), { "visibility": "visible" });
                if (chartObj.gSymbolGroupEle)
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gSymbolGroupEle[seriesIndex].id), { "visibility": "visible" });
                var elements;
                if (seriesOptions.marker.dataLabel.template) {
                    elements = $(chartObj.element[0].childNodes[0].childNodes);
                    for (var i = 0; i < elements.length; i++)
                        $(elements[i]).css('display', 'block');
                }
                if (chartObj.gConnectorEle)
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gConnectorEle[seriesIndex].id), { "visibility": "visible" });
                if (chartObj.gDataLabelEle)
                    chartObj.svgRenderer._setAttr($(chartObj.gSeriesEle).find("#" + chartObj.gDataLabelEle[seriesIndex].id), { "visibility": "visible" });
            }



        },
        _appendConnectorElements: function (i) {
            var visibleSeries = ej.DataManager(this.model._visibleSeries, ej.Query().sortBy("_zOrder")).executeLocal();
            var currentSeries = visibleSeries[i];
            var type = currentSeries.type.toLowerCase();
            if (currentSeries.visibility == "visible" && !this.model.enable3D && currentSeries.connectorLine && (currentSeries.connectorLines || this.model.AreaType == "none")) {
                this.svgRenderer.append(this.gConnectorEle[i], this.gSeriesEle);
                currentSeries.connectorLines = false;
            }
        },
        _appendDataLabelElement: function (i) {
            var currentSeries, type, index;
            currentSeries = this.model._visibleSeries[i];
            index = !ej.util.isNullOrUndefined(currentSeries.zOrder) ? currentSeries.zOrder : index;
            if (currentSeries.visibility == "visible" && !this.model.enable3D) {
                this.svgRenderer.append(this.gSymbolGroupEle[i], this.gSeriesEle);
                if (!this.model.enable3D && !this.model.enableCanvasRendering) {
                    if (this.gDataLabelEle[i].childNodes.length > 0)
                        this.svgRenderer.append(this.gDataLabelEle[i], this.gSeriesEle);
                    if (this.gSeriesTextEle[i].childNodes.length > 0)
                        this.svgRenderer.append(this.gSeriesTextEle[i], this.gSeriesEle);
                }
            }
            if (!this.vmlRendering && currentSeries.visibility == "visible" && !this.model.enableCanvasRendering && !this.model.enable3D) {
                this.svgRenderer.append(this.gSeriesEle, this.svgObject);
                this.svgRenderer.append(this.svgObject, this.element);
            }

        },
        _accSeriesDraw: function (index, seriesOptions, type) {
            var chartObj = this;
            var visibleSeries = ej.DataManager(this.model._visibleSeries, ej.Query().sortBy("_zOrder")).executeLocal();
            var seriesIndex = $.inArray(visibleSeries[index], this.model._visibleSeries);
            this.model._visibleSeries[seriesIndex] = visibleSeries[index] = $.extend(true, seriesOptions, visibleSeries[index]);
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { series: seriesOptions };
            this._trigger("seriesRendering", commonEventArgs);
            var seriesType = new ej.seriesTypes[type.toLowerCase()]();
            var minhightwidth = seriesType.draw(chartObj, seriesOptions);
            if (!minhightwidth) {
                this.model.minhightwidth = true;
                chartObj._animationElements(seriesOptions, seriesType, seriesIndex);
            }


        },
        // to split the series for pie of pie rendering
        _splitSeries: function (visibleSeries) {
            //declaration of splitseries variables            
            var pieCollections = [];
            pieCollections[0] = $.extend(true, [], visibleSeries._visiblePoints);
            pieCollections[1] = [];
            var series = visibleSeries,
                splitValue = parseInt(series.splitValue),
                splitMode = series.splitMode.toLowerCase(),
                length = pieCollections[0].length,
                count = 0, j = 0, yValues = [], i = 0, totalValue = 0, yvalue, valueType;
            // to calculate sum of y values
            while (i != length) {
                totalValue += pieCollections[0][i].y;
                i++;
            }
            // to split points based on splitmode    
            if (splitMode == "position") {
                for (var i = length - 1; i >= 0 && j != splitValue; i--) {
                    count = count + pieCollections[0][i].y;
                    pieCollections[1][j] = pieCollections[0][i];
                    j++;
                    pieCollections[0].splice(i, 1);
                }
                pieCollections[1].reverse();
            }
            else if (splitMode == "value" || splitMode == "percentage") {
                for (var k = 0; k < pieCollections[0].length; k++) {
                    yvalue = splitMode == "value" ? pieCollections[0][k].y : Math.round((pieCollections[0][k].y / totalValue) * 100);
                    if (yvalue < splitValue) {
                        count = count + pieCollections[0][k].y;
                        pieCollections[1][j] = pieCollections[0][k];
                        j++;
                        pieCollections[0].splice(k, 1);
                        k = -1;
                    }
                }
            }
            else if (splitMode == "indexes") {
                var splitArray = JSON.parse("[" + series.splitValue + "]");
                // to remove duplicate indices
                splitArray = splitArray.filter(function (item, d, inputArray) {
                    return inputArray.indexOf(item) == d;
                });
                splitArray.sort();
                for (var k = 0; k < pieCollections[0].length; k++) {
                    for (var s = 0; s < splitArray.length; s++) {
                        if (k == splitArray[s]) {
                            count = count + pieCollections[0][k].y;
                            pieCollections[1][j] = pieCollections[0][k];
                            j++;
                        }
                    }
                }
                for (var i = 0; i < splitArray.length; i++) {
                    var index = splitArray[i] - i;
                    pieCollections[0].splice(index, 1);
                }
            }

            // to append the added point in first pie collection
            if (pieCollections[1].length > 0) {
                yValues[0] = count,
                    valueType = series._xAxisValueType,
                    pieCollections[0].unshift({
                        _visibility: "visible",
                        visible: true,
                        text: "Others",
                        // dataPoint: undefined,
                        x: valueType == "string" ? "Others" : count,
                        xValue: valueType == "string" ? series.points.length : count,
                        y: count,
                        YValues: yValues,
                        fill: this.model.colors[(series.points.length + 1) % this.model.colors.length],
                        isFill: false,
                        actualIndex: series.points.length
                    });
            }
            this.isSplitted = true;
            series.pieCollections = pieCollections;
        },
        _calculateGapWidth: function (currentSeries) {
            var circle1end = 0, circle2start = 0, coefficient, centerX, gapWidth;
            var constantWidth = 0.1 * Math.min($(this.svgObject).width(), $(this.svgObject).width());
            ej.EjSeriesRender.prototype._calculateVisiblePoints(currentSeries).visiblePoints;
            this._splitSeries(currentSeries);  // to split the series points for pieofpie seriestype
            this.chartObj = this;
            // gapwidth calculation for pieofpie series type
            for (var j = 0; j < 2; j++) {
                coefficient = (j == 0) ? currentSeries.pieCoefficient : currentSeries.pieOfPieCoefficient;
                currentSeries._visiblePoints = currentSeries.pieCollections[j];
                currentSeries.collectionIndex = j;
                gapWidth = currentSeries.gapWidth;
                var size = ej.EjSeriesRender.prototype.calculatingSliceAngle(currentSeries, this.chartObj);
                var circleradius = size.width < constantWidth ? 0.25 * coefficient * constantWidth : 0.25 * coefficient * Math.min(size.width, size.height);
                centerX = this.model.circleCenterX[j];
                if (j == 0)
                    circle1end = centerX + circleradius;
                else
                    circle2start = centerX - circleradius;
            }
            var pieGapWidth = (circle2start - circle1end) - gapWidth;
            this.model.pieGapWidth = (pieGapWidth > 0) ? pieGapWidth : 0;
            // to draw connector lines for pieofpie series type
            if (currentSeries.pieCollections[0].length > 0 && currentSeries.pieCollections[1].length > 0 && currentSeries.connectorLine.width > 0)
                this.drawPieofPieConnectors(size, currentSeries);
            return currentSeries;
        },
        seriesRender: function (params, excludeDataUpdate) {
            this.model.allPoints = [];
            this.model.markerRegion = [];
            this.model.startX = [];
            this.model.startY = [];
            this.model.centerCount = 0;
            this.gTrendlinesGroupEle = null;
            this.model._seriesIndex = null;
            this.model._previousSeries = null;

            if (!params) {
                params = { _crossAxisOverlap: false, axes: {} };
                for (var i = 0; i < this.model._axes.length; i++)
                    params.axes[this.model._axes[i].name] = {};
            }
            if ($(this.svgObject).find("#" + this.svgObject.id + "_SeriesCollection").length > 0) {
                $(this.svgObject).find("#" + this.svgObject.id + "_SeriesCollection").remove();
            }
            var chartObj = this,
                svg = this.svgObject,
                serOptions = { 'id': svg.id + '_SeriesCollection', 'clip-path': 'url(#' + svg.id + '_ChartAreaClipRect)' },
                enable3D = this.model.enable3D,
                areaType = this.model.AreaType,
                enableCanvasRendering = this.model.enableCanvasRendering,
                axesLength = this.model._axes.length,
                visibleSeries = ej.DataManager(this.model._visibleSeries, ej.Query().sortBy("_zOrder")).executeLocal(),
                visibleSeriesLength = visibleSeries.length,
                i, j, axis, index, axisOrientation, index,
                seriesOptions, seriesOptionsVisibility, type, commonEventArgs,
                currentSeries, currentPoint, points, currentSeriesType,
                isCanvas = enableCanvasRendering, renderer = this.svgRenderer,
                areaBounds = this.model.m_AreaBounds, currentPointXPos, currentPointYPos,
                currentPointLabel, areaBoundsX = areaBounds.X, box,
                h, currentPointVisibility, visiblePointsLength, p, length,
                s, series, templateContainer, dataLabel, clipRect,
                trendlines, trendline, trendlineType, options, trendLineLength, duration,
                seriesEle, symbolEle, svgObjectId, waterfallLineEle, size, detachEle,
                seriesIndex, seriesType, minhightwidth, showLabels, l, visibility, xVisibleRange, yVisibleRange, yValue, zoomed = this.zoomed;

            this.gSeriesEle = renderer.createGroup(serOptions);

            for (i = 0; i < visibleSeriesLength; i++) {
                if (visibleSeries[i].visibility == "visible") {
                    if (ej.util.isNullOrUndefined(this.model.series[i].enableSmartLabels))  // for setting enablesmartlabels property values
                        this.model.series[i]._enableSmartLabels = (areaType) == "none" ? true : false;
                    else
                        this.model.series[i]._enableSmartLabels = this.model.series[i].enableSmartLabels;
                    if (!ej.util.isNullOrUndefined(visibleSeries[i].xAxis)) {
                        visibleSeries[i].xAxis = null;
                        visibleSeries[i].yAxis = null;
                    }
                    for (j = 0; j < axesLength; j++) {
                        axis = this.model._axes[j];
                        index = i;
                        axisOrientation = axis.orientation.toLowerCase();
                        if (axis.name && axisOrientation == 'horizontal' && axis.name.toLowerCase() == visibleSeries[i]._xAxisName.toLowerCase()) {
                            visibleSeries[i].xAxis = axis;
                        }
                        else if (axis.name && axisOrientation == 'vertical' && axis.name.toLowerCase() == visibleSeries[i]._yAxisName.toLowerCase()) {
                            visibleSeries[i].yAxis = axis;
                        }
                        if (this.model.requireInvertedAxes) {
                            if (axis.name && axisOrientation == 'vertical' && axis.name.toLowerCase() == visibleSeries[i]._xAxisName.toLowerCase()) {
                                visibleSeries[i].xAxis = axis;
                            }
                            else if (axis.name && axisOrientation == 'horizontal' && axis.name.toLowerCase() == visibleSeries[i]._yAxisName.toLowerCase()) {
                                visibleSeries[i].yAxis = axis;
                            }
                        }

                    }
                }
            }
            if (visibleSeriesLength > 0) {
                currentSeries = visibleSeries[0];
                seriesType = currentSeries.type.toLowerCase(),
                    visibility = currentSeries.visibility.toLowerCase();
                if (seriesType == "pieofpie" && visibility == 'visible' && !enable3D) {
                    this.model._isPieOfPie = true;
                    currentSeries = this._calculateGapWidth(currentSeries); // method to split point, gapwidth calculation and to draw pieofpie connectors
                    // pieofpie rendering with splitted points
                    for (var k = 0; k < 2; k++) {
                        currentSeries.collectionIndex = k;
                        currentSeries._visiblePoints = currentSeries.pieCollections[k];
                        this._accSeriesDraw(0, currentSeries, seriesType);
                    }
                    currentSeries._visiblePoints = $.merge(currentSeries.pieCollections[0], currentSeries.pieCollections[1]);
                    this.model.pieGapWidth = null;
                    currentSeries.collectionIndex = 0;
                }
                else {
                    //pie doughnut rendering from higher order to lower order
                    for (var l = visibleSeriesLength; l > 0 && areaType == "none"; l--) {
                        index = l - 1;
                        seriesOptions = visibleSeries[l - 1];
                        seriesOptionsVisibility = seriesOptions.visibility.toLowerCase();
                        type = seriesOptions.type.toLowerCase();
                        if (seriesOptionsVisibility === 'visible' && !enable3D && (type == "pie" || type == "doughnut")) {

                            this._accSeriesDraw(index, seriesOptions, type);


                        }
                        else {
                            if ((areaType == "none") && seriesOptionsVisibility === 'visible' && !enableCanvasRendering)
                                ej.Ej3DChart.prototype.renderSeries(this, seriesOptions, excludeDataUpdate);
                        }
                    }
                }
            }
            for (m = 0; m < visibleSeriesLength; m++) {
                index = m;
                seriesOptions = visibleSeries[m];
                seriesOptionsVisibility = seriesOptions.visibility.toLowerCase();
                type = seriesOptions.type.toLowerCase();
                if (areaType == "none" && seriesOptionsVisibility === 'visible' && !enable3D && (index === 0) && (type == "pyramid" || type == "funnel")) {
                    this._accSeriesDraw(index, seriesOptions, type);


                }
                else {
                    if (seriesOptionsVisibility === 'visible' && !enable3D && areaType != "none") {
                        this.model._seriesIndex = ej.util.isNullOrUndefined(this.model._seriesIndex) ? 0 : this.model._seriesIndex + 1;
                        this.renderSeries(seriesOptions, params, excludeDataUpdate);
                        if (areaType == "cartesianaxes" && this.model.series[m].type != "boxandwhisker")
                            this._renderTrendline(chartObj, seriesOptions);
                    }
                    else {
                        if (!enable3D && areaType != "none")
                            renderer.append(svg, this.element);
                        else {
                            if ((areaType == "cartesianaxes") && seriesOptionsVisibility === 'visible' && !enableCanvasRendering)
                                ej.Ej3DChart.prototype.renderSeries(this, seriesOptions, params, excludeDataUpdate);
                        }
                    }
                    if (!ej.util.isNullOrUndefined(seriesOptions.xAxis) && seriesOptions.xAxis._valueType == "datetime") {
                        for (var i = 0; i < seriesOptions.points.length; i++) {
                            if (seriesOptions.points[i].xValue instanceof Date == false)
                                seriesOptions.points[i].xValue = new Date(seriesOptions.points[i].xValue);
                        }
                    }
                }
            }

            if (areaType != "none") {
                // smart labels for cartesian axis
                for (i = 0; i < visibleSeriesLength; i++) {
                    currentSeries = this.model.series[i];
                    points = currentSeries._visiblePoints;
                    if (currentSeries._enableSmartLabels && this.model.AreaType == "cartesianaxes") {
                        currentSeriesType = currentSeries.type.toLowerCase();
                        if (currentSeriesType == "column" || currentSeriesType == "stackingcolumn" ||
                            currentSeriesType == "bar" || currentSeriesType == "stackingbar" || currentSeriesType == "waterfall"
                            || currentSeriesType == "stackingbar100" || currentSeriesType == "stackingcolumn100" || currentSeriesType == "rangecolumn")
                            this.cartesianColumnSmartLabels(currentSeries, points, i)
                        else if (currentSeriesType != "boxandwhisker") {
                            this.cartesianSmartLabels(currentSeries, points, i);
                        }
                        for (j = 0; j < points.length; j++) {
                            currentPoint = points[j]; // condition to hide partially visible labels
                            currentPoint.hide = false;
                            currentPointXPos = isCanvas ? currentPoint.xPos - this.canvasX : currentPoint.xPos;
                            currentPointYPos = isCanvas ? currentPoint.yPos - this.canvasY : currentPoint.yPos;
                            xVisibleRange = currentSeries.xAxis.visibleRange;
                            yVisibleRange = currentSeries.yAxis.visibleRange;
							yValue = (type.indexOf("100") != -1) ? parseFloat(currentPoint.percentage) : currentPoint.y;
                            if ((currentPointXPos - currentPoint.width / 2 < 0) || (currentPointXPos + currentPoint.width / 2 > areaBounds.Width) ||
                                (currentPointYPos + currentPoint.height / 2 > areaBounds.Height) || (currentPointYPos - currentPoint.height / 2 < 0) || (zoomed && currentPoint.xValue <= xVisibleRange.min || currentPoint.xValue >= xVisibleRange.max) || yValue <= yVisibleRange.min || yValue >= yVisibleRange.max)
                                currentPoint.hide = true;
                        }
                    }
                }

                // to draw connector lines for data label
                for (i = 0; i < visibleSeriesLength; i++) {
                    currentSeries = visibleSeries[i];
                    //For series with improved performance, it will avoid unnecessary looping
                    showLabels = currentSeries._dataLabels ? (currentSeries.marker.dataLabel.visible || currentSeries._dataLabels > 0) : true;
                    if (currentSeries.visibility == "visible" && showLabels) {
                        visiblePointsLength = currentSeries._visiblePoints.length;
                        for (h = 0; h < visiblePointsLength; h++) {
                            currentPoint = currentSeries._visiblePoints[h];
                            currentPointVisibility = currentPoint.marker && currentPoint.marker.dataLabel && currentPoint.marker.dataLabel.visible;
                            if (currentSeries.marker.dataLabel.visible || currentPointVisibility) {
                                if ((currentPoint.connectorFlag || currentPoint.newConnectorFlag) && !currentPoint.hide && currentPoint.drawText != "" && currentSeries.visibility == "visible" && !ej.util.isNullOrUndefined(currentPoint.textOptions)) {
                                    currentSeries.connectorLine = true;
                                    if (enableCanvasRendering) {
                                        renderer.ctx.save();
                                        if (!chartObj.model.requireInvertedAxes)
                                            renderer.ctx.rect(areaBoundsX, currentSeries.yAxis.y, currentSeries.xAxis.width, currentSeries.yAxis.height);
                                        else
                                            renderer.ctx.rect(areaBoundsX + currentSeries.yAxis.plotOffset, currentSeries.xAxis.y, currentSeries.yAxis.width, currentSeries.xAxis.height);
                                        renderer.ctx.clip();
                                        this.drawConnectorLines(i, h, currentPoint);
                                        renderer.ctx.restore();
                                    } else if (currentSeries._enableSmartLabels)
                                        this.drawConnectorLines(i, h, currentPoint);
                                }
								currentPoint.newConnectorFlag = false;
                            }
                        }
                    }
                }

                // to draw data label symbol and text

                for (i = 0; i < visibleSeriesLength; i++) {
                    currentSeries = visibleSeries[i];
                    type = currentSeries.type.toLowerCase();
                    //For series with improved performance, it will avoid unnecessary looping
                    showLabels = currentSeries._dataLabels ? (currentSeries.marker.dataLabel.visible || currentSeries._dataLabels > 0) : true;
                    if (currentSeries.visibility == "visible" && showLabels && !this.model.enable3D) {
                        visiblePointsLength = currentSeries._visiblePoints.length;
                        for (h = 0; h < visiblePointsLength; h++) {
                            currentPoint = currentSeries._visiblePoints[h];
                            currentPointLabel = currentPoint.marker && currentPoint.marker.dataLabel && currentPoint.marker.dataLabel.visible;
                            if ((currentSeries.marker.dataLabel.visible || currentPointLabel) && !currentPoint.hide && !currentPoint.dataLabeltemplate && currentSeries.visibility == "visible" && !ej.util.isNullOrUndefined(currentPoint.textOptions) && !currentPoint.hide) {
                                if (!ej.util.isNullOrUndefined(currentPoint.textOptions.angle))
                                    currentPoint.textOptions.transform = 'rotate(' + currentPoint.textOptions.angle + ',' + (currentPoint.xPos) + ',' + (currentPoint.yPos) + ')';
                                if (enableCanvasRendering) {    // for canvas
                                    currentPoint.textOptions.labelRotation = currentPoint.textOptions.angle;  //for canvas label rotation
                                    renderer.ctx.save();
                                    if (!chartObj.model.requireInvertedAxes)
                                        renderer.ctx.rect(areaBoundsX, currentSeries.yAxis.y, currentSeries.xAxis.width, currentSeries.yAxis.height);
                                    else
                                        chartObj.svgRenderer.ctx.rect(areaBoundsX + currentSeries.yAxis.plotOffset, currentSeries.xAxis.y, currentSeries.yAxis.width, currentSeries.xAxis.height);
                                    chartObj.svgRenderer.ctx.save();
                                    chartObj.svgRenderer.ctx.clip();

                                    if (type.toLowerCase() == "boxandwhisker") {
                                        if (currentSeries.showMedian == true && currentPoint.textOptionsBoxValues != "") {
                                            if (!ej.util.isNullOrUndefined(currentPoint.textOptionsBoxValues[0].angle)) {
                                                currentPoint.textOptionsBoxValues[0].labelRotation = currentPoint.textOptionsBoxValues[0].angle;
                                                currentPoint.textOptionsBoxValues[0].transform = 'rotate(' + currentPoint.textOptionsBoxValues[0].angle + ',' + (currentPoint.textOptionsBoxValues[0].xPos) + ',' + (currentPoint.textOptionsBoxValues[0].yPos) + ')';
                                            }
                                            ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.textOptionsBoxValues[0].xPos, currentPoint.textOptionsBoxValues[0].yPos, currentPoint.textOptionsBoxValues[0].width, currentPoint.textOptionsBoxValues[0].height, currentPoint.textOptionsBoxValues[0].symbolName, this)
                                            delete currentPoint.textOptionsBoxValues[0].angle;
                                            this.svgRenderer.drawText(currentPoint.textOptionsBoxValues[0], currentPoint.textOptionsBoxValues[0].drawText, this.gSeriesTextEle[i]);
                                        }
                                        for (var box = 1; box < currentPoint.textOptionsBoxValues.length; box++) {
                                            if (!ej.util.isNullOrUndefined(currentPoint.textOptionsBoxValues[box].angle)) {
                                                currentPoint.textOptionsBoxValues[box].labelRotation = currentPoint.textOptionsBoxValues[box].angle;
                                                currentPoint.textOptionsBoxValues[box].transform = 'rotate(' + currentPoint.textOptionsBoxValues[box].angle + ',' + (currentPoint.textOptionsBoxValues[box].xPos) + ',' + (currentPoint.textOptionsBoxValues[box].yPos) + ')';

                                            }
                                            ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.textOptionsBoxValues[box].xPos, currentPoint.textOptionsBoxValues[box].yPos, currentPoint.textOptionsBoxValues[box].width, currentPoint.textOptionsBoxValues[box].height, currentPoint.textOptionsBoxValues[box].symbolName, this)
                                            delete currentPoint.textOptionsBoxValues[box].angle;
                                            this.svgRenderer.drawText(currentPoint.textOptionsBoxValues[box], currentPoint.textOptionsBoxValues[box].drawText, this.gSeriesTextEle[i]);
                                        }
                                    }
                                    else {
                                        ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.xPos, currentPoint.yPos, currentPoint.width, currentPoint.height, currentPoint.symbolName, this)
                                        delete currentPoint.textOptions.angle;
                                        this.svgRenderer.drawText(currentPoint.textOptions, currentPoint.drawText, this.gSeriesTextEle);
                                    }
                                    chartObj.svgRenderer.ctx.restore();
                                } else {
                                    ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.xPos, currentPoint.yPos, currentPoint.width, currentPoint.height, currentPoint.symbolName, this, this.gDataLabelEle[i])
                                    delete currentPoint.textOptions.angle;
                                    renderer.drawText(currentPoint.textOptions, currentPoint.drawText, this.gSeriesTextEle[i]);
                                }
                                if (type == "rangecolumn" || type == "rangearea") {

                                    currentPoint.textOptionsLow.transform = 'rotate(' + currentPoint.textOptionsLow.angle + ',' + (currentPoint.xPosLow) + ',' + (currentPoint.yPosLow) + ')';
                                    if (enableCanvasRendering) {    // for canvas
                                        currentPoint.textOptionsLow.labelRotation = currentPoint.textOptionsLow.angle;  //for canvas label rotation
                                        renderer.ctx.save();
                                        if (!chartObj.model.requireInvertedAxes)
                                            renderer.ctx.rect(areaBoundsX, currentSeries.yAxis.y, currentSeries.xAxis.width, currentSeries.yAxis.height);
                                        else
                                            renderer.ctx.rect(areaBoundsX + currentSeries.yAxis.plotOffset, currentSeries.xAxis.y, currentSeries.yAxis.width, currentSeries.xAxis.height);
                                        renderer.ctx.clip();

                                        ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.xPosLow, currentPoint.yPosLow, currentPoint.widthLow, currentPoint.heightLow, currentPoint.symbolName, this)
                                        delete currentPoint.textOptionsLow.angle;
                                        renderer.drawText(currentPoint.textOptionsLow, currentPoint.drawTextLow, this.gSeriesTextEle);
                                        renderer.ctx.restore();
                                    }
                                    else {

                                        ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.xPosLow, currentPoint.yPosLow, currentPoint.widthLow, currentPoint.heightLow, currentPoint.symbolName, this, this.gDataLabelEle[i])
                                        delete currentPoint.textOptionsLow.angle;
                                        renderer.drawText(currentPoint.textOptionsLow, currentPoint.drawTextLow, this.gSeriesTextEle[i]);
                                    }
                                }
                                else if (type.toLowerCase() == "boxandwhisker") {
                                    if (currentSeries.showMedian == true && currentPoint.textOptionsBoxValues != "") {
                                        if (!ej.util.isNullOrUndefined(currentPoint.textOptionsBoxValues[0].angle))
                                            currentPoint.textOptionsBoxValues[0].transform = 'rotate(' + currentPoint.textOptionsBoxValues[0].angle + ',' + (currentPoint.textOptionsBoxValues[0].xPos) + ',' + (currentPoint.textOptionsBoxValues[0].yPos) + ')';
                                        ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.textOptionsBoxValues[0].xPos, currentPoint.textOptionsBoxValues[0].yPos, currentPoint.textOptionsBoxValues[0].width, currentPoint.textOptionsBoxValues[0].height, currentPoint.textOptionsBoxValues[0].symbolName, this)
                                        delete currentPoint.textOptionsBoxValues[0].angle;
                                        this.svgRenderer.drawText(currentPoint.textOptionsBoxValues[0], currentPoint.textOptionsBoxValues[0].drawText, this.gSeriesTextEle[i]);
                                    }
                                    for (var box = 1; box < currentPoint.textOptionsBoxValues.length; box++) {
                                        if (!ej.util.isNullOrUndefined(currentPoint.textOptionsBoxValues[box].angle))
                                            currentPoint.textOptionsBoxValues[box].transform = 'rotate(' + currentPoint.textOptionsBoxValues[box].angle + ',' + (currentPoint.textOptionsBoxValues[box].xPos) + ',' + (currentPoint.textOptionsBoxValues[box].yPos) + ')';
                                        ej.EjSeriesRender.prototype.dataLabelSymbol(i, currentSeries, h, currentPoint.textOptionsBoxValues[box].xPos, currentPoint.textOptionsBoxValues[box].yPos, currentPoint.textOptionsBoxValues[box].width, currentPoint.textOptionsBoxValues[box].height, currentPoint.textOptionsBoxValues[box].symbolName, this)
                                        delete currentPoint.textOptionsBoxValues[box].angle;
                                        this.svgRenderer.drawText(currentPoint.textOptionsBoxValues[box], currentPoint.textOptionsBoxValues[box].drawText, this.gSeriesTextEle[i]);
                                    }
                                }
                            }
                        }
                    }
                }

                // to append connector lines
                if (areaType != "none") {
                    // to append connector lines
                    for (i = 0; i < visibleSeriesLength; i++) {
                        this._appendConnectorElements(i);

                    }

                    // to append marker, data label symbol and text
                    length = this.model._visibleSeries.length;
                    for (i = 0; i < length; i++) {
                        this._appendDataLabelElement(i);
                    }
                }
            }  //to append conector lines ,marker,datalabel symbol and text  for pie and doughnut 
            else {
                for (p = visibleSeriesLength - 1; p >= 0; p--) {
                    currentSeries = this.model._visibleSeries[p];
                    type = currentSeries.type.toLowerCase();
                    if ((type == "pie" || type == "doughnut") && this.model.minhightwidth)
                        this._appendConnectorElements(p);
                }
                length = this.model._visibleSeries.length;
                if (length > 0 && type == "pieofpie")
                    this._appendDataLabelElement(0);
                else {
                    for (p = visibleSeriesLength - 1; p >= 0; p--) {
                        currentSeries = this.model._visibleSeries[p];
                        type = currentSeries.type.toLowerCase();
                        if ((type == "pie" || type == "doughnut") && this.model.minhightwidth)
                            this._appendDataLabelElement(p);
                    }
                }
            }
            length = this.model._visibleSeries.length;
            for (s = 0; s < length; s++) {
                options = this.model._visibleSeries[s];
                drawType = options.drawType;
                type = options.type.toLowerCase();
                options._previousType = ej.util.isNullOrUndefined(options._previousType) ? options.type : options._previousType;
                if (!this.vmlRendering && options.visibility == "visible" && !enableCanvasRendering && !enable3D && areaType != "none") {
                    this.renderer.append(this.gSeriesEle, this.svgObject);
                    this.renderer.append(this.svgObject, this.element);
                    series = new ej.seriesTypes[options.type.toLowerCase()]();
                    series.chartObj = chartObj;
                    if (drawType == "scatter")
                        series.gSeriesGroupEle = $("#" + this.svgObject.id + "_symbolGroup_" + s)[0];
                    else
                        series.gSeriesGroupEle = $("#" + this.svgObject.id + "_SeriesGroup_" + s)[0];
                    if (options.enableAnimation && (!options._animatedSeries || options._previousType != options.type) && this.model.AreaType != "none") {
                        options._animatedSeries = true;
                        options._previousType = options.type;
                        templateContainer = $('#template_group_' + this._id);
                        dataLabel = options.marker.dataLabel;
                        if (templateContainer.children().length != 0 && (dataLabel.visible && dataLabel.template))
                            series.animateLabelTemplate(options);
                        if (type == "polar" || type == "radar")
                            ej.ejRadarSeries.prototype.doAnimation(options, series); // to animate polar/ radar
                        else
                            this.doAnimation(options);   // to animate cartesian series
                    }
                }
            }

            // to append trend line to DOM and perform animation
            visibleSeries = this.model._visibleSeries;
            length = visibleSeries.length;
            if (!enableCanvasRendering && !enable3D) {
                for (k = 0; k < length; k++) {
                    if (visibleSeries[k].visibility.toLowerCase() == "visible" && this.gTrendlinesGroupEle &&
                        this.gTrendlinesGroupEle[k] && this.gTrendlinesGroupEle[k].childElementCount != 0)
                        this.renderer.append(this.gTrendlinesGroupEle[k], svg);
                }
            }
            for (i = 0; i < length; i++) {
                currentSeries = this.model._visibleSeries[i];
                trendlines = currentSeries.trendlines;
                trendLineLength = currentSeries.trendlines.length;
                duration = currentSeries.animationDuration;
                for (j = 0; j < trendLineLength; j++) {
                    trendline = trendlines[j];
                    if (trendline.visibility) {
                        trendlineType = trendline.type.toLowerCase();
                        options = new ej.trendlineTypes[trendlineType]();
                        if (trendline.visibility.toLowerCase() === 'visible' && trendline.points && trendline.points.length > 1 &&
                            currentSeries.enableAnimation && !this.vmlRendering && (!currentSeries._animatedTrendline || trendline._previousType != trendline.type)) {
                            trendline._previousType = trendline.type;
                            clipRect = $(this.svgObject).find("#" + this.svgObject.id + '_TrendGroup' + '_' + i + '_' + j + "_ClipRect").children();
                            ej.EjSeriesRender.prototype._doLineAnimation(this, clipRect, duration); // for trendline animation
                            currentSeries._animatedTrendline = (trendLineLength - 1 == i) ? true : false;
                        }
                    }
                }
            }

            length = this.model._visibleSeries.length;
            svgObjectId = svg.id;
            for (i = 0; i < length; i++) {
                seriesEle = $("#" + svgObjectId + "_SeriesGroup_" + i);
                waterfallLineEle = $("#" + svgObjectId + '_SeriesGroup_waterfallLine_' + i);
                symbolEle = $("#" + svgObjectId + "_symbolGroup_" + i);
                if (seriesEle.length > 0 && symbolEle.length > 0)
                    symbolEle.insertAfter(seriesEle);
                if (seriesEle.length > 0 && waterfallLineEle.length > 0)
                    waterfallLineEle.insertAfter(seriesEle);
            }


            this.model.AnimationComplete = true;
            commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { series: options };
            this._trigger("animationComplete", commonEventArgs);

            if (enableCanvasRendering) {
                renderer.append(svg, this.element);
                if (this.panning) $("#" + this._id + "_canvas").css({ "cursor": "pointer" });
            }
            if (enable3D && !enableCanvasRendering) {
                renderer.append(this.chart3D, svg);

                size = { Width: $(svg).width(), Height: $(svg).height() };
                this.graphics.prepareView(this.model.perspectiveAngle, this.model.depth, this.model.rotation, this.model.tilt, size, this);
                this.graphics.view(svg, this);
                renderer.append(svg, this.element);
                //for (var i = 0; i < visibleSeries.length; i++) {
                //    if (visibleSeries[i].visibility.toLowerCase() == "visible" && visibleSeries[i].enableAnimation && !(this.model.animated)) {
                //        var seriesRendering = new ej.Ej3DSeriesRender();
                //        var type = visibleSeries[i].type.toLowerCase();
                //        var options = ej.series3DTypes[type];
                //        if (this.model.AreaType == "none" && i > 0)
                //            break;
                //        options.doAnimation(visibleSeries[i], seriesRendering);
                //    }

                //}

            }

            if (renderer.vmlNamespace)
                renderer.append(this.gSeriesEle, svg);
            if (areaType == 'polaraxes')
                renderer.append(this.gPolarAxisEle, svg);
            if ($(svg).find("#" + svg.id + "_StriplineOver").length > 0) {
                detachEle = $(svg).find("#" + svg.id + "_StriplineOver").detach();
                detachEle.appendTo(svg);
            }

            this._renderScrollbar();

            this.legendRender.drawLegend(params);

            chartObj.model.initSeriesRender = true;
        },

        _calculateZoomValue: function (startX, endX, axis, scrollObj) {
            var model = this.model,
                delta, zoomPos, zoomFact, start, end,
                scrollRange = axis.scrollbarSettings.range,
                valueType = axis._valueType.toLowerCase();
            if (valueType == "datetime") {
                start = Date.parse(!ej.util.isNullOrUndefined(scrollRange.min) ? new Date(scrollRange.min) : startX);
                end = Date.parse(!ej.util.isNullOrUndefined(scrollRange.max) ? new Date(scrollRange.max) : endX);
            } else {
                start = parseFloat(!ej.util.isNullOrUndefined(scrollRange.min) ? scrollRange.min : startX);
                end = parseFloat(!ej.util.isNullOrUndefined(scrollRange.max) ? scrollRange.max : endX);
            }
            start = Math.min(start, startX);
            end = Math.max(end, endX);
            delta = end - start;
            if (!scrollObj.isRTL) {
                zoomPos = (startX - start) / delta;
                zoomFact = (endX - startX) / delta;
            } else {
                zoomPos = (end - endX) / delta;
                zoomFact = (endX - startX) / delta;
            }
            scrollObj.scrollRange = { min: start, max: end, delta: end - start };
            scrollObj._previousStart = startX;
            scrollObj._previousEnd = endX;
            scrollObj.zoomPosition = zoomPos;
            scrollObj.zoomFactor = zoomFact;
        },

        _renderScrollbar: function () {

            var model = this.model,
                scrollSize = model.scrollerSize,
                scrollObj, index,
                chartOffsetVal = $('#' + this._id).offset(),
                offsetVal = ($(this.svgObject).offset().left - chartOffsetVal.left),
                scrollerWidth, scrollerHeight, scrollerX,
                scrollerY, scrollerX, axis, posY, width, isRedraw,
                zoomFac, zoomPos, opposed,
                axesCollections = model._axes,
                axesLength = axesCollections.length, inversed,
                zoomingScroll = model.zooming.enableScrollbar, range,
                areaType = model.AreaType, scrollbarSettings, pointLength,
                scrollEleLength, scrollRange, scrObj,
                orientation, valueType, isZoomAble;

            model.scrollObj = model.scrollObj ? model.scrollObj : [];


            for (var r = 0; r < axesLength; r++) {
                axis = axesCollections[r];
                valueType = axis._valueType;
                scrollbarSettings = axis.scrollbarSettings;
                range = scrollbarSettings.range;
                inversed = axis.isInversed,
                    isZoomAble = areaType == "cartesianaxes" && !model.enable3D;
                opposed = axis._opposed;
                pointLength = scrollbarSettings.pointsLength;
                orientation = axis.orientation.toLowerCase();
                zoomFac = axis.zoomFactor;
                scrollEleLength = $("#scrollbar_" + this.axisScroll[0].id + r).length;
                zoomPos = axis.zoomPosition;

                if (isZoomAble && ((axis._isScroll && model.isLazyZooming) || ((zoomFac < 1 || zoomPos > 0) && zoomingScroll))) {

                    scrollerX = axis.x + ((orientation == "vertical") ? (-scrollSize + (opposed ? scrollSize : 0)) : 0) + (offsetVal <= 0 ? 0 : offsetVal);
                    scrollerY = axis.y + ((orientation == "horizontal") ? (axis.height + (opposed ? -scrollSize : 0)) : 0);
                    posY = scrollerY - (orientation == 'horizontal' ? 0 : axis.plotOffset);
                    width = axis.plotOffset + (orientation == 'horizontal' ? axis.width : axis.height);
                    scrObj = model.scrollObj;
                    if (range.min != null || range.max != null)
                        isRedraw = scrObj[r] ? (scrObj[r].actualRange.min != range.min || scrObj[r].actualRange.max != range.max) : false;
                    else
                        isRedraw = scrObj[r] ? (scrObj[r].actualRange != scrollbarSettings.pointsLength) : false;
                    this.scrollDraw = scrObj[r] ? (scrObj[r].x != scrollerX || scrObj[r].y != scrollerY || scrObj[r].width != width) : this.scrollDraw;
                    var options = {
                        'orientation': axis.orientation,
                        'index': r,
                        'width': width,
                        'x': scrollerX,
                        'y': posY,
                        'opposed': opposed,
                        'isRTL': inversed,
                        'parent': this.axisScroll,
                        'enableResize': scrollbarSettings.canResize,
                    }
                    if (model.isLazyZooming) {

                        if (scrollEleLength == 0 || this.scrollDraw || isRedraw) {
                            $("#scrollbar_" + this.axisScroll[0].id + r).remove();
                            if (range.min != null || range.max != null) {
                                scrollRange = (scrObj[r] && scrObj[r].scrollRange) ? scrObj[r].scrollRange : axis.visibleRange;
                                if (!this.scrollDraw || isRedraw) {
                                    scrObj[r] = {
                                        'isVirtual': true,
                                        'valueType': valueType,
                                        'scrollRange': scrollRange
                                    };
                                    scrObj[r].actualRange = $.extend(scrObj[r].actualRange, scrollbarSettings.range);
                                    $.extend(scrObj[r], options);
                                    if (valueType == 'datetime') {
                                        scrObj[r].startDateTime = new Date(axis.visibleRange.min);
                                        scrObj[r].endDateTime = new Date(axis.visibleRange.max);
                                    } else {
                                        scrObj[r].startValue = axis.visibleRange.min;
                                        scrObj[r].endValue = axis.visibleRange.max;
                                    }

                                    this._calculateZoomValue(axis.visibleRange.min, axis.visibleRange.max, axis, this.model.scrollObj[r]);
                                } else {
                                    scrObj[r].width = width;
                                    scrObj[r].x = scrollerX;
                                    scrObj[r].y = posY;
                                }
                            } else if (pointLength >= axis.maxPointLength) {
                                zoomFac = axis.maxPointLength / pointLength;
                                zoomPos = (inversed) ? (1 - axis.zoomPosition) : axis.zoomPosition;
                                if (!this.scrollDraw || isRedraw) {
                                    scrObj[r] = {
                                        'isVirtual': true,
                                        'zoomPosition': zoomPos,
                                        'zoomFactor': zoomFac,
                                        'scrollRange': {
                                            'min': 0,
                                            'max': pointLength - 1,
                                            'delta': pointLength - 1
                                        },
                                        'valueType': 'double'
                                    };
                                    scrObj[r].actualRange = scrollbarSettings.pointsLength;
                                    $.extend(scrObj[r], options);
                                    scrObj[r].startValue = 0;
                                    scrObj[r].endValue = axis.maxPointLength;
                                } else {
                                    scrObj[r].width = width;
                                    scrObj[r].x = scrollerX;
                                    scrObj[r].y = posY;
                                }

                            }
                            if (this.model.scrollObj[r]) {
                                this.scrollbarContainer = new ej.EjSvgScrollbarRender(this.axisScroll, this.model.scrollObj[r]);
                                this.scrollbarContainer._initializeScrollbarVariables(this.model.scrollObj[r]);
                                this.scrollbarContainer._renderScrollbar.call(this, this.model.scrollObj[r]);
                            }
                        }
                    }
                    else if (scrollbarSettings.visible) {

                        //* Started Resizable Scrollbar here *// 
                        scrObj = model.scrollObj;

                        if (scrollEleLength == 0 || this.scrollDraw) {
                            $("#scrollbar_" + this.axisScroll[0].id + r).remove();
                            scrObj[r] = {
                                'zoomPosition': zoomPos,
                                'zoomFactor': zoomFac,
                                'valueType': valueType,
                                'scrollRange': axis.actualRange,
                                'isZooming': true
                            };
                            $.extend(scrObj[r], options);
                            if (scrObj[r].valueType == 'datetime') {
                                scrObj[r].startDateTime = new Date(scrObj[r].scrollRange.min);
                                scrObj[r].endDateTime = new Date(scrObj[r].scrollRange.max);
                            } else {
                                scrObj[r].startValue = scrObj[r].scrollRange.min;
                                scrObj[r].endValue = scrObj[r].scrollRange.max;
                            }
                            this.scrollbarContainer = new ej.EjSvgScrollbarRender(this.axisScroll, this.model.scrollObj[r]);
                            this.scrollbarContainer._initializeScrollbarVariables(this.model.scrollObj[r]);
                            this.scrollbarContainer._renderScrollbar.call(this, this.model.scrollObj[r]);
                        }
                    }

                } else {
                    if (scrollEleLength > 0)
                        $("#scrollbar_" + this.axisScroll[0].id + r).remove();

                }
            }
            this.scrollDraw = false;
        },

        //Draw the trendline series
        _renderTrendline: function (chartObj, seriesOptions) {
            // declaration
            var seriesIndex = $.inArray(seriesOptions, chartObj.model.series),
                transX = chartObj.model.requireInvertedAxes ? seriesOptions.yAxis.x : seriesOptions.xAxis.x,
                transY = chartObj.model.requireInvertedAxes ? seriesOptions.xAxis.y : seriesOptions.yAxis.y,
                translate = 'translate(' + transX + ',' + transY + ')',
                trendlinesOptions = { 'id': chartObj.svgObject.id + '_TrendlinesGroup' + '_' + seriesIndex, 'clip-path': 'url(#' + chartObj.svgObject.id + '_TrendlinesGroup' + '_' + seriesIndex + '_ClipRect)' },
                trendlines = seriesOptions.trendlines, m, element, polynomialSlopes, slopeLength,
                options, trendline, i, slope, intercept, displayText, text = "",
                length = trendlines.length, trendOptions, trendlineType, commonEventArgs, backwardPoints, forwardPoints;

            if (!chartObj.gTrendlinesGroupEle) chartObj.gTrendlinesGroupEle = [];
            chartObj.gTrendlinesGroupEle[seriesIndex] = chartObj.svgRenderer.createGroup(trendlinesOptions);
            for (i = 0; i < length; i++) {
                trendline = trendlines[i];
                trendline.seriesIndex = seriesIndex;
                trendline.isTrendLine = true;
                trendline.trendlineIndex = i;
                if (trendline.visibility.toLowerCase() === 'visible' && !trendline.isNull && trendline.points) {
                    trendOptions = { 'id': chartObj.svgObject.id + '_TrendGroup' + '_' + seriesIndex + '_' + i, 'transform': translate, 'clip-path': 'url(#' + chartObj.svgObject.id + '_TrendGroup' + '_' + seriesIndex + '_' + i + '_ClipRect)' };
                    seriesOptions.gTrendGroupEle = null;
                    seriesOptions.gTrendGroupEle = chartObj.svgRenderer.createGroup(trendOptions);
                    trendlineType = trendline.type.toLowerCase();
                    options = new ej.trendlineTypes[trendlineType]();
                    slope = trendline.slope;
                    intercept = trendline._intercept;
                    switch (trendlineType) {
                        case "linear":
                            text = "y = " + slope.toFixed(4) + "x + " + intercept.toFixed(4);
                            break;
                        case "exponential":
                            text = "y = " + intercept.toFixed(3) + "e" + "^" + slope.toFixed(4) + "x";
                            break;
                        case "logarithmic":
                            text = "y = " + slope.toFixed(3) + "ln(x) + " + intercept.toFixed(4);
                            break;
                        case "power":
                            text = "y = " + intercept.toFixed(3) + "x^" + slope.toFixed(4);
                            break;
                        case "polynomial":
                            polynomialSlopes = trendline.polynomialSlopes;
                            slopeLength = polynomialSlopes.length;
                            text = "y = ";
                            for (m = slopeLength - 1; m >= 0; m--) {
                                displayText = polynomialSlopes[m];
                                text += displayText > 0 ? "+" + displayText : "-" + Math.abs(displayText);
                                if (m != 0)
                                    text += "x^" + m + " ";
                            }
                            break;
                    }
                    trendline.equation = text;   // for equation

                    ////Trigger Trendline rendering events
                    commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    backwardPoints = trendline.points[0];
                    forwardPoints = trendline.points[trendline.points.length - 1];
                    commonEventArgs.data = { series: seriesOptions, trendline: trendline, forwardForecastPoints: forwardPoints, backwardForecastPoints: backwardPoints };
                    this._trigger("trendlineRendering", commonEventArgs);

                    if (chartObj.model.enableCanvasRendering) {
                        this.svgRenderer.ctx.save();
                        this.svgRenderer.ctx.beginPath();
                        this.svgRenderer.ctx.rect(chartObj.model.m_AreaBounds.X, seriesOptions.yAxis.y, seriesOptions.xAxis.width, seriesOptions.yAxis.height);
                        this.svgRenderer.ctx.clip();
                        this.svgRenderer.ctx.beginPath();
                        options.draw(trendline, seriesOptions, chartObj);
                        this.svgRenderer.ctx.restore();
                    } else {
                        options.draw(trendline, seriesOptions, chartObj);
                        //Add axes bounds clip path for series
                        element = seriesOptions.gTrendGroupEle;
                        if (element) ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, seriesOptions, this);
                    }
                }
            }

        },
        _renderStripline: function (zIndex) {
            $.extend(ej.EjStripline.prototype, this);
            this.chartstripline = new ej.EjStripline(this);
            var stripline = this.chartstripline;
            this.model._stripeline = false;
            for (var sl = 0; sl < this.model._axes.length; sl++) {
                var slAxis = this.model._axes[sl];
                for (var slCount = 0; slCount < slAxis.stripLine.length; slCount++) {
                    if (slAxis.stripLine[slCount].zIndex.toLowerCase() == zIndex)
                        stripline._drawStripline(slAxis, slAxis.stripLine[slCount], sl, slCount);
                }
            }
            if (zIndex == 'over' && this.model._stripeline) {

                this.svgRenderer.append(this.gStriplineOver, this.svgObject);
            } else if (this.model._stripeline) {
                this.svgRenderer.append(this.gStriplineBehind, this.svgObject);
            }
        },

        renderSeries: function (options, params, excludeDataUpdate) {

            var chart = this, axis, showLabels, index;
            var drawType = options.drawType;
            var seriesIndex = $.inArray(options, this.model._visibleSeries);

            for (var i = 0; i < options.points.length; i++) {
                if (typeof options.points[i].x == "string" && options.points[i].x.indexOf("/Date(") != -1)
                    options.points[i].x = new Date(parseInt(options.points[i].x.substr(6)));
                else
                    break;
            }
            options.xAxis = (options.xAxis === null || options.xAxis === undefined) ? this.model._axes[0] : options.xAxis;
            options.yAxis = (options.yAxis === null || options.yAxis === undefined) ? this.model._axes[1] : options.yAxis;
            var type = options.type.toLowerCase();
            var drawtype = options.drawType.toLowerCase();
            var symbolOptions;
            var translate = null;
            var visibility;

            if (this.model.AreaType == "cartesianaxes") {
                var trans = ej.EjSvgRender.utils._getTransform(options.xAxis, options.yAxis, this.model.requireInvertedAxes);
                var translate = 'translate(' + trans.x + ',' + trans.y + ')';
                visibility = 'visible';
            }
            else {
                visibility = (options.enableAnimation && !options._animatedSeries) ? 'hidden' : 'visible'
            }
            var txtOptions = { 'id': this.svgObject.id + '_TextGroup_' + seriesIndex, 'transform': translate, 'visibility': visibility };
            var dataLabelOptions = { 'id': this.svgObject.id + '_DataLabel_' + seriesIndex, 'transform': translate, 'visibility': visibility };
            if (type != "scatter")
                symbolOptions = { 'id': this.svgObject.id + '_symbolGroup_' + seriesIndex, 'transform': translate, 'visibility': visibility };
            else
                symbolOptions = { 'id': this.svgObject.id + '_SeriesGroup' + '_' + seriesIndex, 'transform': translate };
            var connectorOptions = { 'id': this.svgObject.id + '_ConnectorGroup_' + seriesIndex, 'transform': translate, 'visibility': visibility };
            if (!this.gSymbolGroupEle) this.gSymbolGroupEle = [];
            this.gSymbolGroupEle[seriesIndex] = this.svgRenderer.createGroup(symbolOptions);
            if (!this.gSeriesTextEle) this.gSeriesTextEle = [];
            this.gSeriesTextEle[seriesIndex] = this.svgRenderer.createGroup(txtOptions);
            if (!this.gConnectorEle) this.gConnectorEle = [];
            this.gConnectorEle[seriesIndex] = this.svgRenderer.createGroup(connectorOptions);
            if (!this.gDataLabelEle) this.gDataLabelEle = [];
            this.gDataLabelEle[seriesIndex] = this.svgRenderer.createGroup(dataLabelOptions);

            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { series: options };
            this._trigger("seriesRendering", commonEventArgs);

            var series = new ej.seriesTypes[type]();
            if (this.model.enableCanvasRendering && this.model.AreaType != "none") {
                this.svgRenderer.ctx.save();
                this.svgRenderer.ctx.beginPath();
                if (!this.model.requireInvertedAxes) { //checked for bar and stackingbar series
                    this.canvasX = options.xAxis.x;
                    this.canvasY = options.yAxis.y;
                    this.svgRenderer.ctx.rect(options.xAxis.x, options.yAxis.y, options.xAxis.width, options.yAxis.height);
                } else {
                    var translate = ej.EjSvgRender.utils._getTransform(options.xAxis, options.yAxis, this.model.requireInvertedAxes);
                    this.canvasX = translate.x;
                    this.canvasY = translate.y;
                    this.svgRenderer.ctx.rect(options.yAxis.x, options.xAxis.y, options.yAxis.width, options.xAxis.height);
                }
                this.svgRenderer.ctx.clip();
                series.draw(this, options, params, excludeDataUpdate);
                this.svgRenderer.ctx.restore();
            }
            else if (this.model.enableCanvasRendering && this.model.AreaType == "polaraxes") {
                this.svgRenderer.ctx.save();
                this.svgRenderer.ctx.beginPath();
                this.svgRenderer.ctx.arc(this.model.centerX, this.model.centerY, this.model.Radius, 0, 2 * Math.PI, false);
                this.svgRenderer.ctx.clip();
                this.canvasX = this.canvasY = 0;
                series.draw(this, options, excludeDataUpdate);
                this.svgRenderer.ctx.restore();
            }
            else {
                this.canvasX = this.canvasY = 0;
                if (this.model.AreaType == "cartesianaxes")
                    series.draw(this, options, params);
                else if (this.model.AreaType == "polaraxes" && (options._xAxisName == this.model._axes[0].name && options._yAxisName == this.model._axes[1].name))
                    series.draw(this, options, excludeDataUpdate);
            }
            var errorbar = this.model.series[seriesIndex].errorBar,
                areaType = this.model.AreaType;
            if (errorbar.visibility == 'visible' && areaType == 'cartesianaxes' && (this.model.series[seriesIndex].type != "boxandwhisker"))
                this.renderErrorBar(errorbar, options);                           // to render error bar

            //Add axes bounds clip path for series
            var element = series.gSeriesGroupEle;
            if (element) ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);

            // Draw Symbols       
            if (!(type == "candle" || type == "hilo" || type == "hiloopenclose" || type == "boxandwhisker")) {
                var chartObj = this, point1,
                    areatype = chartObj.model.AreaType.toLowerCase(),
                    regiontype = ej.seriesTypes[type].prototype.isRegion;
                showLabels = options._pointMarker ? (options.marker.visible || options._pointMarker) : true;
                if (!(type == "scatter") && showLabels) {
                    $.each(options._visiblePoints, function (pointIndex, point) {
                        if ((point.visible !== false) && (point.x !== "") && ((point.marker && point.marker.visible) || (options.marker.visible))) {
                            //this condition provide for better Scatter performance
                            if ((areatype == "polaraxes" && drawtype == "column") || regiontype)
                                point1 = point.symbolLocation;
                            else
                                point1 = (areatype != "polaraxes")
                                    ? ej.EjSvgRender.utils._getPoint(point, options) : ej.EjSvgRender.utils.TransformToVisible(options, point.xValue, point.y, chartObj)
                            if (areatype == "polaraxes") {
                                var labelFormat = options.yAxis.labelFormat ? options.yAxis.labelFormat : "";
                                var pointText = (point.text) ? point.text : point.y + labelFormat.substring(labelFormat.indexOf('}') + 1);
                                var textOffset = ej.EjSvgRender.utils._measureText(pointText, null, options.marker.dataLabel.font);
                            }
                            if ((areatype == "polaraxes" && (options._xAxisName == chartObj.model._axes[0].name && options._yAxisName == chartObj.model._axes[1].name)) && ((type.toLowerCase() == "polar" || type.toLowerCase() == "radar") && (drawType != "scatter")) || areatype == "cartesianaxes")
                                series.drawSymbol(seriesIndex, options, pointIndex, point1.X, point1.Y);
                        }
                    });
                }
                if (type != "scatter") {
                    //Add axes bounds clip path for marker
                    if ((options.marker.visible) && (drawType != "scatter")) {
                        element = this.gSymbolGroupEle[seriesIndex];
                        ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);
                    }
                    // Add axes bounds clip path for marker text
                    if (options.marker.dataLabel.visible) {
                        element = this.gSeriesTextEle[seriesIndex];
                        ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);
                        // for data label shape
                        element = this.gDataLabelEle[seriesIndex];
                        ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);
                    }
                    // Add axes bounds clip path for connector line
                    if (!ej.util.isNullOrUndefined(this.gConnectorEle) && this.gConnectorEle.length > 0) {
                        element = this.gConnectorEle[seriesIndex];
                        ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);
                    }
                } else {
                    element = this.gSymbolGroupEle[seriesIndex];
                    ej.EjSvgRender.utils._drawAxesBoundsClipPath(element, options, this);
                    this.svgRenderer.append(element, this.gSeriesEle);

                    if (options.tooltip.visible || type == "scatter") {
                        if (this.vmlRendering) {
                            this.cloneSeriesEle = $(this.gSeriesEle).clone();
                            this.cloneobj = $(this.element).clone();
                            this.svgclone = $(this.svgObject).clone();
                            $(document.body).append(this.cloneobj);
                            this.svgRenderer.append(this.cloneSeriesEle, this.svgclone);
                            this.svgRenderer.append(this.svgclone, this.cloneobj);
                        }
                        else {
                            this.svgRenderer.append(this.gSeriesEle, this.svgObject);
                            this.svgRenderer.append(this.svgObject, this.element);
                        }

                        if (this.vmlRendering) {
                            $(this.cloneobj).remove();
                            $(this.svgclone).remove();
                        }
                    }
                }
            }



            //Draw Series Text
            showLabels = options._dataLabels ? (options.marker.dataLabel.visible || options._dataLabels > 0) : true;
            if (options.marker.dataLabel.visible || showLabels)
                this.drawDisplayText(series, options, params);


        },

        renderErrorBar: function (errorOptions, seriesOptions) {
            // declaration
            var chartobj = this,
                model = chartobj.model,
                currentseries = seriesOptions,
                type, mode, direction, fill, cap,
                capFill, capWidth, capLength,
                visiblePoints = currentseries._visiblePoints,
                len = visiblePoints.length,
                canvasX = chartobj.canvasX, canvasY = chartobj.canvasY,
                seriesIndex = $.inArray(currentseries, model._visibleSeries),
                translate = null, i,
                trans = ej.EjSvgRender.utils._getTransform(currentseries.xAxis, currentseries.yAxis, model.requireInvertedAxes),
                verticalErrorValue, horizontalErrorValue,
                requireInvertedAxes = model.requireInvertedAxes,
                verticalPositive, verticalNegative,
                horizontalPositive, horizontalNegative,
                svgObjectId = chartobj.svgObject.id,
                areaBounds = chartobj.model.m_AreaBounds,
                translate = 'translate(' + trans.x + ',' + trans.y + ')',
                errorBarElement, errorBarGroup, event, errorBarPoint,
                pointIndex, point, yValue, xVal, standY, standX,
                location, verHighvalue, verLowvalue,
                horHighvalue, horLowvalue, mean, verMean, horMean,
                verStandSquareRoot, horStandSquareRoot, centervalueX, centervalueY,
                verStandardDeviationValue, horStandardDeviationValue,
                verCentervalue, horCentervalue,
                verStandardErrorValue, horStandardErrorValue,
                values, values1, verHighCapX1, verHighCapX2,
                verLowCapX1, verLowCapX2, horHighCapY1, horHighCapY2,
                horLowCapY1, horLowCapY2, eDirectionV, cDirectionV,
                eDirectionH, cDirectionH, eDirection, cDirection,
                fixvalue, pervalue, perY, perX, standDeviValue, standError,
                custom, capValues, commonEventArgs, errorBarPointGroup;

            // parent group creation
            errorBarGroup = {
                'id': svgObjectId + '_ErrorBarGroup' + '_' + seriesIndex,
                'transform': translate,
                'clip-path': 'url(#' + svgObjectId + '_ChartAreaClipRect)'
            };

            if (ej.util.isNullOrUndefined(chartobj.gErrorBarGroupEle))
                chartobj.gErrorBarGroupEle = [];
            errorBarElement = chartobj.gErrorBarGroupEle[seriesIndex] = chartobj.svgRenderer.createGroup(errorBarGroup);

            commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = {
                errorBar: errorOptions
            };
            this._trigger("errorBarRendering", commonEventArgs);      // trigger event

            event = commonEventArgs.data.errorBar;
            type = event.type;
            mode = event.mode;
            direction = event.direction;
            fill = event.fill;
            cap = event.cap;
            capFill = event.cap.fill;
            capWidth = event.cap.width;
            capLength = event.cap.length;
            verticalErrorValue = event.verticalErrorValue;
            horizontalErrorValue = event.horizontalErrorValue;
            verticalPositive = event.verticalPositiveErrorValue;
            verticalNegative = event.verticalNegativeErrorValue;
            horizontalPositive = event.horizontalPositiveErrorValue;
            horizontalNegative = event.horizontalNegativeErrorValue;

            for (i = 0; i < len; i++) {
                if (visiblePoints[i].isEmpty !== true && visiblePoints[i].visible == true) {
                    // error bar group creation
                    errorBarPoint = {
                        'id': chartobj.svgObject.id + '_ErrorBarGroup' + '_' + seriesIndex + '_Point' + i
                    }
                    errorBarPointGroup = chartobj.svgRenderer.createGroup(errorBarPoint);

                    pointIndex = i;
                    point = visiblePoints[i];
                    yValue = point.YValues[0];
                    xVal = point.xValue;
                    standY = visiblePoints[i].YValues[0];
                    standX = visiblePoints[i].xValue;

                    if (type.indexOf("column") || type.indexOf("bar") > -1)
                        location = point.symbolLocation;
                    else
                        location = point.location;
                    if (ej.util.isNullOrUndefined(location))
                        location = ej.EjSvgRender.utils._getPoint(point, currentseries);
                    centervalueX = location.X;
                    centervalueY = location.Y;
                    //error bar type calculation
                    switch (type) {
                        case "fixedValue":
                            fixvalue = point;
                            if (mode == 'vertical' || mode == 'both') {          //vertical mode calculation for fixed value point location
                                fixvalue.YValues[0] = yValue + verticalErrorValue;
                                verHighvalue = ej.EjSvgRender.utils._getPoint(fixvalue, currentseries);
                                fixvalue.YValues[0] = yValue - verticalErrorValue;
                                verLowvalue = ej.EjSvgRender.utils._getPoint(fixvalue, currentseries);
                                if (!requireInvertedAxes)
                                    verHighvalue.X = verLowvalue.X = location.X;
                                else
                                    verHighvalue.Y = verLowvalue.Y = location.Y;
                            }
                            if (mode == 'horizontal' || mode == 'both') {
                                fixvalue.YValues[0] = yValue;
                                fixvalue.xValue = xVal;                    //horizontal mode calculation for fixed value point location
                                fixvalue.xValue = xVal + horizontalErrorValue;
                                horHighvalue = ej.EjSvgRender.utils._getPoint(fixvalue, currentseries);
                                fixvalue.xValue = xVal - horizontalErrorValue;
                                horLowvalue = ej.EjSvgRender.utils._getPoint(fixvalue, currentseries);
                            }
                            fixvalue.YValues[0] = yValue;
                            fixvalue.xValue = xVal;
                            break;

                        case "percentage":
                            pervalue = point;
                            perY = verticalErrorValue / 100 * yValue;
                            perX = horizontalErrorValue / 100 * xVal;
                            if (mode == 'vertical' || mode == 'both') {                  //vertical mode calculation for percentage point locaion
                                pervalue.YValues[0] = yValue + perY;
                                verHighvalue = ej.EjSvgRender.utils._getPoint(pervalue, currentseries);
                                pervalue.YValues[0] = yValue - perY;
                                verLowvalue = ej.EjSvgRender.utils._getPoint(pervalue, currentseries);
                                if (!requireInvertedAxes)
                                    verHighvalue.X = verLowvalue.X = location.X;
                                else
                                    verHighvalue.Y = verLowvalue.Y = location.Y;
                            }
                            if (mode == 'horizontal' || mode == 'both') {
                                pervalue.YValues[0] = yValue;
                                pervalue.xValue = xVal;                              //horizontal mode calculation for percentage
                                pervalue.xValue = xVal + perX;
                                horHighvalue = ej.EjSvgRender.utils._getPoint(pervalue, currentseries);
                                pervalue.xValue = xVal - perX;
                                horLowvalue = ej.EjSvgRender.utils._getPoint(pervalue, currentseries);
                            }
                            pervalue.YValues[0] = yValue;
                            pervalue.xValue = xVal;
                            break;

                        case "standardDeviation":
                            standDeviValue = point;
                            mean = chartobj.meanCalculation(mode, visiblePoints);
                            verMean = mean.verMean;
                            horMean = mean.horMean;
                            verStandSquareRoot = mean.verStandSquareRoot;
                            horStandSquareRoot = mean.horStandSquareRoot;
                            if (mode == 'vertical' || mode == 'both') {
                                verStandardDeviationValue = verticalErrorValue * verStandSquareRoot;
                                standDeviValue.YValues[0] = verMean;
                                verCentervalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                yValue = standDeviValue.YValues[0];
                                standDeviValue.YValues[0] = yValue + verStandardDeviationValue;
                                verHighvalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                standDeviValue.YValues[0] = yValue - verStandardDeviationValue;
                                verLowvalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                if (!requireInvertedAxes)
                                    verCentervalue.X = verHighvalue.X = verLowvalue.X = location.X;
                                else
                                    verCentervalue.Y = verHighvalue.Y = verLowvalue.Y = location.Y;
                                verCentervalue.X = verCentervalue.X + canvasX;
                                verCentervalue.Y = verCentervalue.Y + canvasY;
                            }
                            if (mode == 'horizontal' || mode == 'both') {
                                horStandardDeviationValue = horizontalErrorValue * horStandSquareRoot;
                                standDeviValue.xValue = horMean;
                                horCentervalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                if (!requireInvertedAxes)
                                    horCentervalue.Y = location.Y;
                                else
                                    horCentervalue.X = location.X;
                                standDeviValue.YValues[0] = standY;
                                xVal = standDeviValue.xValue;
                                standDeviValue.xValue = xVal + horStandardDeviationValue;
                                horHighvalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                standDeviValue.xValue = xVal - horStandardDeviationValue;
                                horLowvalue = ej.EjSvgRender.utils._getPoint(standDeviValue, currentseries);
                                horCentervalue.X = horCentervalue.X + canvasX;
                                horCentervalue.Y = horCentervalue.Y + canvasY;

                            }
                            standDeviValue.YValues[0] = standY;
                            standDeviValue.xValue = standX;

                            break;
                        case "standardError":
                            standError = point;
                            mean = chartobj.meanCalculation(mode, visiblePoints);
                            verStandSquareRoot = mean.verStandSquareRoot;
                            horStandSquareRoot = mean.horStandSquareRoot;
                            if (mode == 'vertical' || mode == 'both') {                                   //vertical mode standard Error calculation
                                verStandardDeviationValue = verticalErrorValue * verStandSquareRoot;
                                verStandardErrorValue = verStandardDeviationValue / Math.sqrt(len);
                                standError.YValues[0] = yValue + verStandardErrorValue;
                                verHighvalue = ej.EjSvgRender.utils._getPoint(standError, currentseries);
                                standError.YValues[0] = yValue - verStandardErrorValue
                                verLowvalue = ej.EjSvgRender.utils._getPoint(standError, currentseries);
                                if (!requireInvertedAxes)
                                    verHighvalue.X = verLowvalue.X = location.X;
                                else
                                    verHighvalue.Y = verLowvalue.Y = location.Y;
                            }
                            if (mode == 'horizontal' || mode == 'both') {                             //horizontal mode standard Error calculation
                                horStandardDeviationValue = horizontalErrorValue * horStandSquareRoot;
                                horStandardErrorValue = horStandardDeviationValue / Math.sqrt(len);
                                standError.YValues[0] = yValue;
                                standError.xValue = xVal;                      //horizontal mode calculation for  point location
                                standError.xValue = xVal + horStandardErrorValue;
                                horHighvalue = ej.EjSvgRender.utils._getPoint(standError, currentseries);
                                standError.xValue = xVal - horStandardErrorValue;
                                horLowvalue = ej.EjSvgRender.utils._getPoint(standError, currentseries);
                            }
                            standError.YValues[0] = yValue;
                            standError.xValue = xVal;
                            i = pointIndex;
                            break;

                        case "custom":
                            custom = point;
                            if (mode == 'vertical' || mode == 'both') {                         //calculation for vertical mode point locaton
                                custom.YValues[0] = yValue + verticalPositive;
                                verHighvalue = ej.EjSvgRender.utils._getPoint(custom, currentseries);
                                custom.YValues[0] = yValue - verticalNegative;
                                verLowvalue = ej.EjSvgRender.utils._getPoint(custom, currentseries);
                                if (!requireInvertedAxes)
                                    verHighvalue.X = verLowvalue.X = location.X;
                                else
                                    verHighvalue.Y = verLowvalue.Y = location.Y;
                            }
                            if (mode == 'horizontal' || mode == 'both') {
                                custom.YValues[0] = yValue;
                                custom.xValue = xVal;                     //calculation for horizontal mode point location
                                custom.xValue = xVal + horizontalPositive;
                                horHighvalue = ej.EjSvgRender.utils._getPoint(custom, currentseries);
                                custom.xValue = xVal - horizontalNegative;
                                horLowvalue = ej.EjSvgRender.utils._getPoint(custom, currentseries);
                            }
                            custom.YValues[0] = yValue;
                            custom.xValue = xVal;
                            break;
                    }

                    //to render cap 
                    if (cap.visible == true) {
                        if (mode == 'vertical' || mode == 'both')
                            values = { verHighvalue: verHighvalue, verLowvalue: verLowvalue }
                        if (mode == 'horizontal' || mode == 'both')
                            values1 = { horHighvalue: horHighvalue, horLowvalue: horLowvalue }
                        capValues = chartobj.renderCap(cap, mode, values, values1, requireInvertedAxes);
                        verHighCapX1 = capValues.verHighCapX1, verHighCapX2 = capValues.verHighCapX2,
                            verLowCapX1 = capValues.verLowCapX1, verLowCapX2 = capValues.verLowCapX2,
                            horHighCapY1 = capValues.horHighCapY1, horHighCapY2 = capValues.horHighCapY2,
                            horLowCapY1 = capValues.horLowCapY1, horLowCapY2 = capValues.horLowCapY2;
                    }
                    centervalueX = centervalueX + canvasX;
                    centervalueY = centervalueY + canvasY;
                    if (mode == 'vertical' || mode == 'both') {
                        verHighvalue.X = verHighvalue.X + canvasX;
                        verHighvalue.Y = verHighvalue.Y + canvasY;
                        verLowvalue.X = verLowvalue.X + canvasX;
                        verLowvalue.Y = verLowvalue.Y + canvasY;
                    }
                    if (mode == 'horizontal' || mode == 'both') {
                        horHighvalue.X = horHighvalue.X + canvasX;
                        horHighvalue.Y = horHighvalue.Y + canvasY;
                        horLowvalue.X = horLowvalue.X + canvasX;
                        horLowvalue.Y = horLowvalue.Y + canvasY;
                    }
                    //drawing error bar and error bar cap  
                    //drawing both direction    
                    if (direction == 'both') {
                        if (mode == 'vertical' || mode == 'both') {             //vertical mode for both direction
                            if (type != 'standardDeviation')
                                eDirectionV = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionV = "M" + " " + (verCentervalue.X) + " " + (verCentervalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "M" + " " + (verCentervalue.X) + " " + (verCentervalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighCapX1) + " " + (verHighvalue.Y) + " " + "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighCapX2) + " " + (verHighvalue.Y) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowCapX1) + " " + (verLowvalue.Y) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowCapX2) + " " + (verLowvalue.Y) + " ";
                            else
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighCapX1) + " " + "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighCapX2) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowCapX1) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowCapX2) + " ";
                            eDirection = eDirectionV, cDirection = cDirectionV;
                        }
                        if (mode == 'horizontal' || mode == 'both') {
                            if (type != 'standardDeviation')                          //horizontal mode for both direction
                                eDirectionH = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionH = "M" + " " + (horCentervalue.X) + " " + (horCentervalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "M" + " " + (horCentervalue.X) + " " + (horCentervalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighCapY1) + " " + "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighCapY2) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowCapY1) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowCapY2) + " ";
                            else
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighCapY1) + " " + (horHighvalue.Y) + " " + "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighCapY2) + " " + (horHighvalue.Y) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowCapY1) + " " + (horLowvalue.Y) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowCapY2) + " " + (horLowvalue.Y) + " ";
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                        if (mode == 'both') {
                            eDirectionH += eDirectionV, cDirectionH += cDirectionV;
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                    }
                    //drawing plus direction
                    else if (direction == 'plus') {
                        if (mode == 'vertical' || mode == 'both') {        //vertical mode for plus direction
                            if (type != 'standardDeviation')
                                eDirectionV = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionV = "M" + " " + (verCentervalue.X) + " " + (verCentervalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighCapX1) + " " + (verHighvalue.Y) + " " + "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighCapX2) + " " + (verHighvalue.Y) + " ";
                            else
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighCapX1) + " " + "M" + " " + (verHighvalue.X) + " " + (verHighvalue.Y) + " " + "L" + " " + (verHighvalue.X) + " " + (verHighCapX2) + " ";
                            var eDirection = eDirectionV, cDirection = cDirectionV;
                        }
                        if (mode == 'horizontal' || mode == 'both') {
                            if (type != 'standardDeviation')                        //horizontal mode for both direction
                                eDirectionH = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionH = "M" + " " + (horCentervalue.X) + " " + (horCentervalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighCapY1) + " " + "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighvalue.X) + " " + (horHighCapY2) + " ";
                            else
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighCapY1) + " " + (horHighvalue.Y) + " " + "M" + " " + (horHighvalue.X) + " " + (horHighvalue.Y) + " " + "L" + " " + (horHighCapY2) + " " + (horHighvalue.Y) + " ";
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                        if (mode == 'both') {
                            eDirectionH += eDirectionV, cDirectionH += cDirectionV;
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                    }
                    // drawing minus direction
                    else {
                        if (mode == 'vertical' || mode == 'both') {             //vertical mode for both direction
                            if (type != 'standardDeviation')
                                eDirectionV = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionV = "M" + " " + (verCentervalue.X) + " " + (verCentervalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowCapX1) + " " + (verLowvalue.Y) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowCapX2) + " " + (verLowvalue.Y) + " ";
                            else
                                cDirectionV = !cap.visible ? "" : "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowCapX1) + " " + "M" + " " + (verLowvalue.X) + " " + (verLowvalue.Y) + " " + "L" + " " + (verLowvalue.X) + " " + (verLowCapX2) + " ";
                            var eDirection = eDirectionV, cDirection = cDirectionV;
                        }
                        if (mode == 'horizontal' || mode == 'both') {
                            if (type != 'standardDeviation')                        //horizontal mode for both direction
                                eDirectionH = "M" + " " + (centervalueX) + " " + (centervalueY) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " ";
                            else if (type == 'standardDeviation')
                                eDirectionH = "M" + " " + (horCentervalue.X) + " " + (horCentervalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " ";
                            if (!requireInvertedAxes)
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowCapY1) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowvalue.X) + " " + (horLowCapY2) + " ";
                            else
                                cDirectionH = !cap.visible ? "" : "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowCapY1) + " " + (horLowvalue.Y) + " " + "M" + " " + (horLowvalue.X) + " " + (horLowvalue.Y) + " " + "L" + " " + (horLowCapY2) + " " + (horLowvalue.Y) + " ";
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                        if (mode == 'both') {
                            eDirectionH += eDirectionV, cDirectionH += cDirectionV;
                            eDirection = eDirectionH, cDirection = cDirectionH;
                        }
                    }

                    var errorBarOptions = {             //error bar path creation
                        'id': chartobj.svgObject.id + '_ErrorBar' + '_' + seriesIndex + '_Point' + pointIndex,
                        'd': eDirection,
                        'stroke': fill,
                        'stroke-width': errorOptions.width,
                        'opacity': errorOptions.opacity
                    };
                    var errorBarCapOptions = {       //error bar cap creation
                        'id': chartobj.svgObject.id + '_ErrorBarCap' + '_' + seriesIndex + '_Point' + pointIndex,
                        'd': cDirection,
                        'stroke': capFill,
                        'stroke-width': capWidth
                    }
                    //canvas rendering
                    if (chartobj.model.enableCanvasRendering) {
                        this.svgRenderer.ctx.rect(areaBounds.X, areaBounds.Y, areaBounds.Width, areaBounds.Height);
                        this.svgRenderer.ctx.clip();
                        chartobj.svgRenderer.drawPath(errorBarOptions, null);              //To draw error bar for canvas
                        chartobj.svgRenderer.drawPath(errorBarCapOptions, null);           //To drae error bar cap for canvas
                    }
                    else {                                        //svg rendering
                        chartobj.svgRenderer.drawPath(errorBarOptions, errorBarPointGroup);
                        chartobj.svgRenderer.drawPath(errorBarCapOptions, errorBarPointGroup);
                        chartobj.svgRenderer.append(errorBarPointGroup, errorBarElement);
                    }
                }
            }
            //append with series group
            chartobj.svgRenderer.append(errorBarElement, chartobj.gSeriesEle);
            //clip-path 
            ej.EjSvgRender.utils._drawAxesBoundsClipPath(errorBarElement, currentseries, chartobj);
        },

        meanCalculation: function (mode, visiblePoints) {
            var temp = temp1 = 0, total, verTotal, horTotal, verMean, horMean, ded, i,
                eachDev, squareEachDev, squareTotal, verEachDev, horEachDev,
                verSquareEachDev, verSquareTotal, horSquareTotal, horSquareTotal,
                verStandardMean, horStandardMean, verStandSquareRoot,
                horStandSquareRoot, values, len = visiblePoints.length;
            for (i = 0; i < len; i++) {
                if (mode == 'vertical') {             //vertical mode total calculation
                    total = temp + visiblePoints[i].y;
                    temp = total;
                }
                else if (mode == 'horizontal') {    //horizontal mode total calculation 
                    total = temp1 + visiblePoints[i].xValue;
                    temp1 = total;
                }
                else {                     //both mode  total calculation
                    verTotal = temp + visiblePoints[i].y;
                    temp = verTotal;
                    horTotal = temp1 + visiblePoints[i].xValue;
                    temp1 = horTotal;
                }
            }
            verMean = temp / len;
            horMean = temp1 / len;
            ded = len - 1;
            for (i = 0; i < len; i++) {
                if (mode == 'vertical') {
                    eachDev = visiblePoints[i].y - verMean;
                    squareEachDev = Math.pow(eachDev, 2);
                    squareTotal = temp + squareEachDev;
                    temp = squareTotal;
                }
                else if (mode == 'horizontal') {
                    eachDev = visiblePoints[i].xValue - horMean;
                    squareEachDev = Math.pow(eachDev, 2);
                    squareTotal = temp1 + squareEachDev;
                    temp1 = squareTotal;
                }
                else {
                    verEachDev = visiblePoints[i].y - verMean;
                    verSquareEachDev = Math.pow(verEachDev, 2);
                    verSquareTotal = temp + verSquareEachDev;
                    temp = verSquareTotal;
                    horEachDev = visiblePoints[i].xValue - horMean;
                    horSquareEachDiv = Math.pow(horEachDev, 2);
                    horSquareTotal = temp1 + horSquareEachDiv;
                    temp1 = horSquareTotal;
                }
            }
            verStandardMean = temp / ded;
            verStandSquareRoot = Math.sqrt(verStandardMean);
            horStandardMean = temp1 / ded;
            horStandSquareRoot = Math.sqrt(horStandardMean);
            values = { verStandSquareRoot: verStandSquareRoot, horStandSquareRoot: horStandSquareRoot, verMean: verMean, horMean: horMean }
            return values;
        },
        renderCap: function (cap, mode, values, values1, requireInvertedAxes) {
            //declaration
            var canvasX, canvasY, capLen, verHighvalue,
                verLowvalue, horHighvalue, horLowvalue,
                verHighCapX1, verHighCapX2, verLowCapX1,
                verLowCapX2, horHighCapY1, horHighCapY2,
                horLowCapY1, horLowCapY2, capValues;
            canvasX = this.canvasX;
            canvasY = this.canvasY;
            capLen = cap.length / 2;
            if (mode == 'vertical' || mode == 'both') {
                verHighvalue = values.verHighvalue;
                verLowvalue = values.verLowvalue;
            }
            if (mode == 'horizontal' || mode == 'both') {
                horHighvalue = values1.horHighvalue;
                horLowvalue = values1.horLowvalue;
            }
            if (mode == 'vertical' || mode == 'both') {
                if (!requireInvertedAxes) {
                    verHighCapX1 = verHighvalue.X + canvasX - capLen,
                        verHighCapX2 = verHighvalue.X + canvasX + capLen,
                        verLowCapX1 = verLowvalue.X + canvasX - capLen,
                        verLowCapX2 = verLowvalue.X + canvasX + capLen;
                }
                else {
                    verHighCapX1 = verHighvalue.Y + canvasY + capLen;
                    verHighCapX2 = verHighvalue.Y + canvasY - capLen;
                    verLowCapX1 = verLowvalue.Y + canvasY + capLen;
                    verLowCapX2 = verLowvalue.Y + canvasY - capLen;
                }
            }
            if (mode == 'horizontal' || mode == 'both') {
                if (!requireInvertedAxes) {
                    horHighCapY1 = horHighvalue.Y + canvasY - capLen,
                        horHighCapY2 = horHighvalue.Y + canvasY + capLen,
                        horLowCapY1 = horLowvalue.Y + canvasY - capLen,
                        horLowCapY2 = horLowvalue.Y + canvasY + capLen;
                }
                else {
                    horHighCapY1 = horHighvalue.X + canvasX + capLen;
                    horHighCapY2 = horHighvalue.X + canvasX - capLen;
                    horLowCapY1 = horLowvalue.X + canvasX + capLen;
                    horLowCapY2 = horLowvalue.X + canvasX - capLen;
                }
            }
            capValues = { verHighCapX1: verHighCapX1, verHighCapX2: verHighCapX2, verLowCapX1: verLowCapX1, verLowCapX2: verLowCapX2, horHighCapY1: horHighCapY1, horHighCapY2: horHighCapY2, horLowCapY1: horLowCapY1, horLowCapY2: horLowCapY2 }
            return capValues;
        },

        drawDisplayText: function (series, options, params) {
            // method to draw text 

            var chartObj = this;
            var point1;
            var type = options.type.toLowerCase();
            var areatype = chartObj.model.AreaType.toLowerCase();
            var regiontype = ej.seriesTypes[type].prototype.isRegion;
            var drawtype = options.drawType.toLowerCase();
            var pointMarker;
            var zoomed = false;
            var seriesIndex = $.inArray(options, chartObj.model._visibleSeries);
            if (ej.util.isNullOrUndefined(chartObj.model.regionCount))
                chartObj.model.regionCount = -1;

            var isCanvas = chartObj.model.enableCanvasRendering;
            var isPolar = chartObj.model.AreaType.toLowerCase() == 'polaraxes';
            var j = 0, stackingGroup = {}, length;
            for (length = chartObj.model.series.length; j < length; j++)
                stackingGroup[name = chartObj.model.series[j].stackingGroup] = { length: stackingGroup[name] ? stackingGroup[name].length + 1 : 1, seriesIndex: j }
            params.stackingGroup = stackingGroup;
            $.each(options._visiblePoints, function (pointIndex, point) {
                var type = chartObj.model.series[seriesIndex].type.toLowerCase();
                options._visiblePoints[pointIndex].textOptionsBoxValues = [];
                pointMarker = point.marker;
                if ((areatype == "polaraxes" && drawtype == "column") || regiontype || (drawtype == "rangecolumn"))
                    point1 = type.toLowerCase() == "boxandwhisker" ? point.dataLabelLocation : point.symbolLocation;
                else
                    point1 = (areatype != "polaraxes")
                        ? ej.EjSvgRender.utils._getPoint(point, options) : ej.EjSvgRender.utils.TransformToVisible(options, point.xValue, point.y, chartObj)
                if (point.visible !== false && ((pointMarker && pointMarker.dataLabel && pointMarker.dataLabel.visible) || (!pointMarker || !pointMarker.dataLabel) && options.marker.dataLabel.visible)) {
                    if (regiontype)
                        chartObj.model.regionCount++;

                    var type = chartObj.model.series[seriesIndex].type.toLowerCase();
                    for (i = 0; i < chartObj.model._axes.length; i++) {
                        if (chartObj.model._axes[i].zoomFactor < 1 || chartObj.model._axes[i].zoomPosition > 0) {
                            zoomed = true;
                            break;
                        }
                    }
                    //we have reset the chartRegions array based on the zooming points for column and stackingColumn series only
                    if ((chartObj.zoomed || options.xAxis._isScroll || zoomed) && (type == "column" || type == "stackingcolumn" || type == "stackingcolumn100")) {
                        for (var i = 0; i < chartObj.model.chartRegions.length; i++) {
                            if (seriesIndex == chartObj.model.chartRegions[i].SeriesIndex && pointIndex == chartObj.model.chartRegions[i].Region.PointIndex) {
                                if (isCanvas && chartObj.model.AreaType == "cartesianaxes") {
                                    chartObj.svgRenderer.ctx.save();
                                    chartObj.svgRenderer.ctx.beginPath();
                                    if (!chartObj.model.requireInvertedAxes) // checked for bar and stackingbar
                                        chartObj.svgRenderer.ctx.rect(options.xAxis.x, options.yAxis.y, options.xAxis.width, options.yAxis.height);
                                    else
                                        chartObj.svgRenderer.ctx.rect(options.yAxis.x, options.xAxis.y, options.yAxis.width, options.xAxis.height);
                                    chartObj.svgRenderer.ctx.clip();
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, i, params);
                                    chartObj.svgRenderer.ctx.restore();
                                }
                                else
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, i, params);
                            }
                        }
                    }
                    else {
                        if (isCanvas && chartObj.model.AreaType == "cartesianaxes") {
                            chartObj.svgRenderer.ctx.save();
                            chartObj.svgRenderer.ctx.beginPath();
                            if (!chartObj.model.requireInvertedAxes) // checked for bar and stackingbar
                                chartObj.svgRenderer.ctx.rect(options.xAxis.x, options.yAxis.y, options.xAxis.width, options.yAxis.height);
                            else
                                chartObj.svgRenderer.ctx.rect(options.yAxis.x, options.xAxis.y, options.yAxis.width, options.xAxis.height);
                            chartObj.svgRenderer.ctx.clip();
                            //Check regions for column type, bar type and waterfall series
                            if (chartObj.model.chartRegions[chartObj.model.regionCount] || (type.indexOf('column') == -1 && type.indexOf('bar') == -1 && type.indexOf('waterfall') == -1)) {
                                if (type.toLowerCase() == "boxandwhisker") {
                                    for (var box = 0; box < point1.length; box++) {
                                        point.y = point.boxPlotLocation[box].YValues;
                                        series.drawDataLabel(options, pointIndex, point, point1[box].X, point1[box].Y, chartObj.model.regionCount, params, point1[box].outlier);
                                    }
                                }
                                else
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, chartObj.model.regionCount, params);
                                if (type == "rangecolumn" || type == "rangearea") {
                                    point.y = point.low;
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, chartObj.model.regionCount, params);
                                    point.y = point.high;
                                }
                            }
                            chartObj.svgRenderer.ctx.restore();
                        }
                        else {
                            if (isCanvas && isPolar) {
                                chartObj.svgRenderer.ctx.save();
                                chartObj.svgRenderer.ctx.beginPath();
                                chartObj.svgRenderer.ctx.arc(chartObj.model.centerX, chartObj.model.centerY, chartObj.model.Radius, 0, 2 * Math.PI, false);
                                chartObj.svgRenderer.ctx.clip();
                                point1.X -= chartObj.canvasX;
                                point1.Y -= chartObj.canvasY;
                            }
                            if ((type == "column" || type == "stackingcolumn" || type == "stackingcolumn100")) {
                                if (chartObj.model.chartRegions[chartObj.model.regionCount])
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, chartObj.model.regionCount, params);
                            }
                            else {
                                if (type.toLowerCase() == "boxandwhisker") {
                                    for (var box = 0; box < point1.length; box++) {
                                        point.y = point.boxPlotLocation[box].YValues;
                                        series.drawDataLabel(options, pointIndex, point, point1[box].X, point1[box].Y, chartObj.model.regionCount, params, point1[box].outlier);
                                    }
                                }
                                else
                                    series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, chartObj.model.regionCount, params);
                            }
                            if (type == "rangecolumn" || type == "rangearea") {
                                point.y = point.low;
                                series.drawDataLabel(options, pointIndex, point, point1.X, point1.Y, chartObj.model.regionCount, params);
                                point.y = point.high;
                            }
                            if (isCanvas && isPolar)
                                chartObj.svgRenderer.ctx.restore();
                        }
                    }
                }
            });
        },

        // method to avoid collision between data labels 
        cartesianSmartLabels: function (currentSeries, points, seriesIndex) {
            // declaration
            var length = points.length;
            var count = 0;
            this.connectorFlag = false;
            this.processCount = 1;
            this.posObj = {
                top: [], rightTop: [],
                left: [], leftTop: [],
                right: [], rightTop: [],
                rightBottom: [], leftBottom: [],
                bottom: []
            };
            var markerWidth, markerHeight, i, d, c, currentPoint, location,
                ele, leftValue, topValue, regionType, type;
            // loop to store marker region
            for (d = 0; d < this.model.series.length; d++) {
                markerWidth = this.model.series[d].marker.size.width;
                markerHeight = this.model.series[d].marker.size.height;
                type = this.model.series[d].type.toLowerCase();
                regionType = ej.seriesTypes[type].prototype.isRegion;
                if (this.model.series[d].visibility != "hidden" && this.model.series[d].marker.visible && !regionType) {
                    for (c = 0; c < this.model.series[d]._visiblePoints.length; c++) {
                        currentPoint = this.model.series[d]._visiblePoints[c];
                        location = currentPoint.location;
                        this.model.markerRegion[this.model.markerRegion.length] = { seriesIndex: d, xPos: location.X + this.canvasX, yPos: location.Y + this.canvasY, width: markerWidth, height: markerHeight };
                    }
                }
            }

            var currentPoint, j, padding = 10, diff;
            var areaBounds = this.model.m_AreaBounds;
            var width, height, xPos, yPos;
            for (j = 0; j < length; j++) {   // to reposition the partially visible data labels
                currentPoint = points[j];
                currentPoint.hide = false;
                xPos = currentPoint.xPos; yPos = currentPoint.yPos;
                width = currentPoint.width; height = currentPoint.height;
                if (xPos - width / 2 < 0 && xPos > -width / 2) {
                    diff = xPos - width / 2;
                    currentPoint.textOptions.x = currentPoint.xPos = xPos + Math.abs(diff) + 10;
                    currentPoint.newConnectorFlag = true;
                }
                if (xPos + width / 2 > areaBounds.Width && xPos + width / 2 < areaBounds.Width + width / 2) {
                    diff = xPos - width / 2;
                    currentPoint.textOptions.x = currentPoint.xPos = areaBounds.Width - width / 2 - 10;
                    currentPoint.newConnectorFlag = true;
                }
                if (yPos + width / 2 > areaBounds.Height && yPos + height / 2 < areaBounds.Height + height / 2) {
                    diff = yPos + height / 2 - areaBounds.Height;
                    currentPoint.yPos = yPos - diff - 10;
                    currentPoint.textOptions.y = currentPoint.yPos + 5;
                    currentPoint.newConnectorFlag = true;
                }
                if (yPos - height / 2 < 0 && yPos > -height / 2) {
                    diff = yPos - height / 2;
                    currentPoint.yPos = currentPoint.yPos + Math.abs(diff) + 10;
                    currentPoint.textOptions.y = currentPoint.yPos + 5;
                    currentPoint.newConnectorFlag = true;
                }
            }

            // loop to compare the points
            for (i = 0; i < length; i++) {
                if (!ej.util.isNullOrUndefined(points[i].yPos))
                    this.model.allPoints[this.model.allPoints.length] = points[i];
                else
                    continue;
                this.connectorFlag = false;
                this.compareDataLabels(i, points, count, this.processCount);
                currentPoint = points[i];
                currentPoint.connectorFlag = this.connectorFlag; // flag to draw connector lines
                if (points[i].dataLabeltemplate) {    // for repositioning data label template
                    ele = $("#" + points[i].id);
                    leftValue = points[i].xPos;
                    topValue = !this.model.enableCanvasRendering ? points[i].yPos : points[i].yPos + this.model.m_AreaBounds.Y;
                    ele.css("left", leftValue).css("top", topValue);
                    if (this.model.AreaType == "cartesianaxes") {   // to avoid template rendering outside area bounds
                        areaBounds = this.model.m_AreaBounds;
                        xPosition = areaBounds.X + (this.model.requireInvertedAxes ? currentSeries.yAxis.plotOffset : currentSeries.xAxis.plotOffset);
                        yPosition = currentSeries.yAxis.y;
                        width = points[i].width;
                        height = points[i].height;
                        if ((leftValue > xPosition + areaBounds.Width || leftValue + width < xPosition || topValue + height < yPosition || topValue + height > areaBounds.Y + areaBounds.Height) ||
                            (this.zoomed && (leftValue < xPosition || topValue < yPosition || leftValue > xPosition + areaBounds.Width || topValue > yPosition + areaBounds.Height)))
                            ele.remove();
                    }
                }
                // to store data label position for furture processing
                this.storeDataLabelPositions(currentPoint);

            }
        },

        storeDataLabelPositions: function (currentPoint) {
            var position = currentPoint.position;
            var posObj = this.posObj;
            switch (position) {
                case "top":
                    posObj.top[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "rightTop":
                    posObj.rightTop[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "right":
                    posObj.right[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "rightBottom":
                    posObj.rightBottom[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break
                case "bottom":
                    posObj.bottom[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "left":
                    posObj.left[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "leftBottom":
                    posObj.leftBottom[this.processCount - 1] = currentPoint;
                    this.processCount = 1;
                    break;
                case "leftTop":
                    posObj.leftTop[this.processCount - 1] = currentPoint;
                    break;
            }
        },

        // method to avoid collision between data labels  - column series type
        cartesianColumnSmartLabels: function (currentSeries, points, seriesIndex) {
            var length = points.length, left, top, right;
            var count = 0;
            this.connectorFlag = false;
            this.processCount = 1;
            var i, currentPoint, ele;
            this.model.outsideLabels = [];
            // loop to compare the points
            for (i = 0; i < length; i++) {
                if (!ej.util.isNullOrUndefined(points[i].yPos) && !isNaN(points[i].yPos))
                    this.model.allPoints[this.model.allPoints.length] = points[i];
                else
                    continue;
                if (currentSeries._enableSmartLabels) {
                    this.connectorFlag = false;
                    this.compareColumnDataLabels(currentSeries, i, points, count, this.processCount);
                }
                currentPoint = currentSeries._visiblePoints[i];
                if (points[i].dataLabeltemplate) {
                    ele = $("#" + points[i].id);
                    ele.css("left", points[i].xPos).css("top", points[i].yPos);
                    left = points[i].xPos, top = points[i].yPos;
                    points.height = ele.outerHeight(); var areaBoundsX = this.model.m_AreaBounds.X;
                    var areaBoundsY = this.model.m_AreaBounds.Y;
                    var areaBoundsWidth = this.model.m_AreaBounds.Width;
                    var areaBoundsHeight = this.model.m_AreaBounds.Height;
                    points.width = ele.outerWidth(); width = ele.width() / 2;
                    height = ele.height();
                    var topHeight, leftWidth, rightWidth;
                    topHeight = leftWidth = rightWidth = 0;
                    var bottomHeight = 0, areaBound = this.model.m_AreaBounds;
                    xPosition = areaBound.X + (this.model.requireInvertedAxes ? currentSeries.yAxis.plotOffset : currentSeries.xAxis.plotOffset);
                    yPosition = currentSeries.yAxis.y; right = left - width;
                    if (currentSeries.marker.dataLabel.showEdgeLabels) {
                        if ((left > xPosition + areaBound.Width || top + height > areaBound.Y + areaBound.Height) || ((left < xPosition || top < yPosition || left > xPosition + areaBound.Width || top > yPosition + areaBound.Height || right > areaBound.Width + areaBound.X))) {
                            width = ele.outerWidth();
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
                            document.getElementById(ele[0].id).style.clip = "rect(" + topHeight + "px," +
                                rightWidth + "px," +
                                bottomHeight + "px," +
                                leftWidth + "px)";
                        }
                    }
                }
            }
        },


        compareColumnDataLabels: function (currentSeries, i, points, count, processCount) {
            var length = this.model.allPoints.length - 1, areaBounds = this.model.m_AreaBounds, isOutside;
            var prevLabel, currentLabel, padding, enableContrastColor = currentSeries.marker.dataLabel.enableContrastColor,
                contrastColorRegion = [];
            var type = currentSeries.type.toLowerCase();
            var seriesType = new ej.seriesTypes[currentSeries.type.toLowerCase()](); this.firstPoints = [];
            for (var j = 0; j < length; j++) {
                prevLabel = this.model.allPoints[j];
                currentLabel = this.model.allPoints[this.model.allPoints.length - 1];
                this.currentCollideLabel = prevLabel;
                padding = 5;
                collide = this.isCollide(prevLabel, currentLabel);
                textPosition = currentSeries.marker.dataLabel.textPosition.toLowerCase(),
                    dataLabel = currentSeries.marker.dataLabel;
                if (collide.state) {
                    // for vertical orientation series types
                    if (type == "column" || type == "stackingcolumn" || type == "rangecolumn" || type == "waterfall") {
                        if (dataLabel.showEdgeLabels)
                            currentLabel.textOptions.y = currentLabel.yPos = currentLabel.yPos + collide.height + padding;
                        else {
                            if (textPosition == "top" || textPosition == "middle")
                                currentLabel.textOptions.y = currentLabel.yPos = currentLabel.yPos + collide.height + padding;
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = currentLabel.yPos - collide.height - padding;
                        }
                        currentLabel.textOptions.y = currentLabel.textOptions.y + padding + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                    } else {
                        // for horizontal orientation series types
                        if (textPosition == "top" || textPosition == "middle")
                            currentLabel.textOptions.x = currentLabel.xPos = prevLabel.xPos - prevLabel.width / 2 - currentLabel.width / 2 - padding;
                        else
                            currentLabel.textOptions.x = currentLabel.xPos = prevLabel.xPos + prevLabel.width / 2 + currentLabel.width / 2 + padding;
                    }
                    this.compareColumnDataLabels(currentSeries, i, points, count, this.processCount);  // to call recursive
                    isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                    for (a = 0; a < this.model.allPoints.length; a++) {
                        if (a == 0)
                            this.firstPoints.push(this.model.allPoints[0])
                        else {
                            if (this.firstPoints[this.firstPoints.length - 1].x != this.model.allPoints[a].x)
                                this.firstPoints.push(this.model.allPoints[a]);
                        }
                    }
                    if (isOutside || this.zoomed) {
                        for (l = 0; l <= this.model.allPoints.length - 1; l++) {
                            this._positionOutsideLabels(currentLabel, this.model.allPoints, l, type);
                        }
                        this.model.outsideLabels.push(currentLabel);

                    }
                    if (enableContrastColor && (type.indexOf("stacking") > -1)) {
                        var region = this.model.chartRegions;
                        for (a = 0; a < this.model.chartRegions.length; a++) {
                            if (region[a].Region.PointIndex == i)
                                collide = this.isCollide(region[a], currentLabel, 0, enableContrastColor, this);
                            if (collide.state)
                                contrastColorRegion.push(region[a]);
                        }
                        if (contrastColorRegion.length > 5)
                            break;
                        else if (contrastColorRegion.length >= 1) {
                            pointColor = jQuery.type(this.model.seriesColors[contrastColorRegion[0].SeriesIndex]) == "array" ?
                                this.model.seriesColors[contrastColorRegion[0].SeriesIndex][0].color : this.model.seriesColors[contrastColorRegion[0].SeriesIndex];
                            currentLabel.textOptions.fill = seriesType._applySaturation(this, pointColor);
                        }
                    }
                }
            }
        },

        //to reposition the outside labels in column type series 

        _positionOutsideLabels: function (currentLabel, points, k, type) {

            prevLabel = points[k];
            var padding = 5;
            if (k == 0) {
                if (type && (type == "column" || type == "stackingcolumn" || type == "rangecolumn" || type == "waterfall")) {
                    if (this.model.outsideLabels.length > 0 && currentLabel.x == this.model.outsideLabels[this.model.outsideLabels.length - 1].x)
                        currentLabel.textOptions.y = currentLabel.yPos = this.model.outsideLabels[this.model.outsideLabels.length - 1].yPos - collide.height;
                    else {
                        for (k = 0; k < this.firstPoints.length; k++) {
                            if (currentLabel.x == this.firstPoints[k].x)
                                currentLabel.textOptions.y = currentLabel.yPos = this.firstPoints[k].yPos - collide.height;
                        }
                    }
                    currentLabel.textOptions.y = currentLabel.textOptions.y + padding + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                }
                else
                    currentLabel.textOptions.x = currentLabel.xPos = this.model.outsideLabels.length > 0 ? this.model.outsideLabels[this.model.outsideLabels.length - 1].xPos : points[0].xPos + prevLabel.width / 2 + currentLabel.width / 2 + padding;
            }
            collide = this.isCollide(prevLabel, currentLabel);
            if (collide.state) {
                if (type == "column" || type == "stackingcolumn" || type == "rangecolumn" || type == "waterfall") {
                    currentLabel.textOptions.y = currentLabel.yPos = currentLabel.yPos - collide.height - padding;
                    currentLabel.textOptions.y = currentLabel.textOptions.y + padding + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                }
                else
                    currentLabel.textOptions.x = currentLabel.xPos = currentLabel.xPos + prevLabel.width / 2 + currentLabel.width / 2 + padding;
            }

        },

        // method to comapare data labels and place without collision
        compareDataLabels: function (i, points, count, processCount) {
            var length = this.model.allPoints.length, areaBounds = this.model.m_AreaBounds, isOutside;
            var j, padding, prevLabel, currentLabel, collide, checkCollide, type, isColumn;
            var posObj = this.posObj; this.breakLoop = false;
            for (j = 0; j < length; j++) {
                type = this.model.series[this.model.allPoints[j].seriesIndex].type.toLowerCase();
                prevLabel = this.model.allPoints[j];
                currentLabel = this.model.allPoints[length - 1];
                this.currentCollideLabel = prevLabel;
                padding = 10;
                collide = this.isCollide(prevLabel, currentLabel, j);
                if (collide.state || collide.marker) {
                    this.connectorFlag = true;
                    switch (count) {
                        case 0:                        // top
                            if (this.processCount > 1) this.resetValues(currentLabel);
                            if (!collide.marker) {
                                if (!ej.util.isNullOrUndefined(this.prevLabel)) {
                                    checkCollide = this.isCollide(this.prevLabel, currentLabel);
                                    if (!checkCollide.state) { this.prevLabel = prevLabel; this.processCount = 1; };
                                } else {
                                    this.prevLabel = prevLabel;
                                    this.processCount = 1;
                                }
                            }
                            else {
                                this.prevLabel = collide.markerRegion;
                                this.processCount = 1;
                            }
                            // right
                            this.resetValues(currentLabel);
                            if (processCount > 1 && posObj.right[this.processCount - 2]) {
                                prevLabel = posObj.right[this.processCount - 2];
                                currentLabel.textOptions.x = currentLabel.xPos = prevLabel.xPos + (prevLabel.width / 2 + currentLabel.width / 2 + padding);
                            }
                            else
                                currentLabel.textOptions.x = currentLabel.xPos = this.prevLabel.xPos + (this.prevLabel.width / 2 + currentLabel.width / 2 + padding);

                            count += 1;
                            currentLabel.position = "right";
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 1:
                            // right bottom
                            this.resetValues(currentLabel);
                            currentLabel.textOptions.x = currentLabel.xPos = this.prevLabel.xPos + this.prevLabel.width / 2 + currentLabel.width / 2 + padding;
                            if (processCount > 1 && posObj.rightBottom[this.processCount - 2]) {
                                prevLabel = posObj.rightBottom[this.processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = prevLabel.yPos + this.canvasY + prevLabel.height + padding;
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = currentLabel.location.Y + this.canvasY + currentLabel.height + padding / 2;
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            currentLabel.position = "rightBottom";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 2:

                            // bottom
                            this.resetValues(currentLabel);
                            currentLabel.textOptions.y = currentLabel.yPos = currentLabel.location.Y + this.canvasY + currentLabel.height + padding / 2;
                            if (processCount > 1 && posObj.bottom[this.processCount - 2]) {
                                prevLabel = posObj.bottom[this.processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = prevLabel.yPos + currentLabel.height + padding;
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = currentLabel.location.Y + this.canvasY + currentLabel.height + padding / 2;
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            currentLabel.position = "bottom";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 3:
                            // left bottom
                            this.resetValues(currentLabel);
                            currentLabel.textOptions.x = currentLabel.xPos = this.prevLabel.xPos - this.prevLabel.width / 2 - currentLabel.width / 2 - padding;
                            if (processCount > 1 && posObj.leftBottom[this.processCount - 2]) {
                                prevLabel = posObj.leftBottom[this.processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = prevLabel.yPos + this.canvasY + prevLabel.height + padding;
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = currentLabel.location.Y + this.canvasY + currentLabel.height + padding / 2;
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            currentLabel.position = "leftBottom";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 4:
                            // left
                            this.resetValues(currentLabel);
                            if (processCount > 1 && posObj.left[this.processCount - 2]) {
                                prevLabel = posObj.left[this.processCount - 2];
                                currentLabel.textOptions.x = currentLabel.xPos = (prevLabel.xPos - prevLabel.width / 2 - currentLabel.width / 2 - padding);
                            }
                            else
                                currentLabel.textOptions.x = currentLabel.xPos = (this.prevLabel.xPos - this.prevLabel.width / 2 - currentLabel.width / 2 - padding);

                            currentLabel.position = "left";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 5:
                            // left top
                            this.resetValues(currentLabel);
                            currentLabel.textOptions.x = currentLabel.xPos = this.prevLabel.xPos - this.prevLabel.width / 2 - currentLabel.width / 2 - padding;
                            if (processCount > 1 && posObj.leftTop[this.processCount - 2]) {
                                prevLabel = posObj.leftTop[this.processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = (prevLabel.yPos) - (currentLabel.height + padding);
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = this.prevLabel.yPos - currentLabel.height - padding;
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            currentLabel.position = "leftTop";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 6:
                            //top

                            this.resetValues(currentLabel);
                            if (processCount > 1 && posObj.top[processCount - 2]) {
                                prevLabel = posObj.top[processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = (prevLabel.yPos) - (currentLabel.height + padding);
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = (this.prevLabel.yPos) - (this.processCount * (currentLabel.height + padding));
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            count += 1;
                            currentLabel.position = "top";
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 7:
                            // right top
                            this.resetValues(currentLabel);
                            currentLabel.textOptions.x = currentLabel.xPos = this.prevLabel.xPos + this.prevLabel.width / 2 + currentLabel.width / 2 + padding;
                            if (processCount > 1 && posObj.rightTop[this.processCount - 2]) {
                                prevLabel = posObj.rightTop[this.processCount - 2];
                                currentLabel.textOptions.y = currentLabel.yPos = prevLabel.yPos - currentLabel.height - padding;
                            }
                            else
                                currentLabel.textOptions.y = currentLabel.yPos = this.prevLabel.yPos - currentLabel.height - padding;
                            currentLabel.textOptions.y = currentLabel.textOptions.y + padding / 2 + currentLabel.margin.top / 2 - currentLabel.margin.bottom / 2;
                            currentLabel.position = "rightTop";
                            count += 1;
                            if (this.breakLoop)
                                break;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 8:

                            count = 0;
                            this.processCount += 1;
                            if (i == this.processCount)
                                count = 9;
                            else {
                                isOutside = this.checkOutsideLabels(this.model, currentLabel, areaBounds);
                                if (!isOutside) {
                                    this.compareDataLabels(i, points, count, this.processCount);
                                    break;
                                }
                            }
                        case 9:
                            // to skip the labelplacement when reaching outside the chart Area
                            if (i == this.processCount || this.processCount > length) {
                                this.processCount -= 1;
                                count = count < 0 || count == 8 ? 0 : count - 1;
                                this.breakLoop = true;
                            }
                    }
                }
            }
        },

        checkOutsideLabels: function (model, currentPoint, areaBounds) {
            var isCanvas = model.enableCanvasRendering, isTemplate = currentPoint.dataLabeltemplate, height, width;
            if (model.series[currentPoint.seriesIndex].marker.dataLabel.showEdgeLabels) {
                currentPointXPos = isCanvas ? currentPoint.xPos - this.canvasX : currentPoint.xPos;
                currentPointYPos = isCanvas ? currentPoint.yPos - this.canvasY : currentPoint.yPos;
                height = isTemplate ? areaBounds.Height + areaBounds.Y : areaBounds.Height;
                width = isTemplate ? areaBounds.Width + areaBounds.X : areaBounds.width;
                if ((currentPointXPos - currentPoint.width / 2 < 0) || (currentPointXPos + currentPoint.width / 2 > width) ||
                    (currentPointYPos + currentPoint.height / 2 > height) || (currentPointYPos - currentPoint.height / 2 < 0))
                    return true;
            }
        },

        //to draw connector lines for pieofpie series
        drawPieofPieConnectors: function (size, series) {
            //if (series.connectorLine.width > 0) {
            var visibility = (series.enableAnimation && !series._animatedSeries) ? 'hidden' : 'visible';
            if (!this.model.enableCanvasRendering) {
                if (!this.gConnectorLinesGroup)
                    this.gConnectorLinesGroup = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_connectorLineGroup', 'visibility': visibility });
                else (this.gConnectorLinesGroup.childNodes.length > 0)
                $(this.gConnectorLinesGroup.childNodes).remove();
            }
            var radius = [], startX = [], startY = [], loc = [],
                chartStartAngle = -.5 * Math.PI, coefficient, pieCollections;
            for (var j = 0; j < 2; j++) {
                pieCollections = series.pieCollections[j];
                coefficient = j == 0 ? series.pieCoefficient : series.pieOfPieCoefficient;
                radius[j] = 0.25 * coefficient * Math.min(size.width, size.height);
                startX[j] = this.model.circleCenterX[j];
                startX[j] = (j == 0) ? startX[j] + this.model.pieGapWidth / 2 : startX[j] - this.model.pieGapWidth / 2;
                startY[j] = this.model.circleCenterY[j];
                if (pieCollections[0].start > 0 && pieCollections[0].end < Math.PI && j == 0) {
                    var startAngle = pieCollections[0].start + chartStartAngle,
                        endAngle = pieCollections[0].end + chartStartAngle - 0.000001;
                    var x1 = startX[j] + radius[j] * Math.cos(startAngle),
                        y1 = startY[j] + radius[j] * Math.sin(startAngle),
                        x2 = startX[j] + radius[j] * Math.cos(endAngle),
                        y2 = startY[j] + radius[j] * Math.sin(endAngle);
                }
                else {
                    x1 = startX[j] + radius[j] * Math.cos(chartStartAngle),
                        y1 = startY[j] + radius[j] * Math.sin(chartStartAngle),
                        x2 = x1,
                        y2 = y1 + radius[j] * 2;
                }
                loc.push({ X1: x1, Y1: y1, X2: x2, Y2: y2 });
            }
            var pieConnectorLines = series.connectorLine;
            for (var k = 0; k < 2; k++) {
                var lineOptions = {
                    'id': this.svgObject.id + '_connectorLine' + k,
                    'x1': k == 0 ? loc[k].X1 : loc[k - 1].X2,
                    'y1': k == 0 ? loc[k].Y1 : loc[k - 1].Y2,
                    'x2': k == 0 ? loc[k + 1].X1 : loc[k].X2,
                    'y2': k == 0 ? loc[k + 1].Y1 : loc[k].Y2,
                    'stroke': pieConnectorLines.color,
                    'stroke-width': pieConnectorLines.width,
                    'opacity': pieConnectorLines.opacity,
                    'stroke-dasharray': pieConnectorLines.dashArray
                };
                this.svgRenderer.drawLine(lineOptions, this.gConnectorLinesGroup);
            }
            this.svgRenderer.append(this.gConnectorLinesGroup, this.gSeriesEle);
        },
        // method to draw connector lines for data labels in cartesian axis
        drawConnectorLines: function (seriesIndex, index, currentPoint) {
            var bottom = false;
            var drawConnectorLine = true;
            var xPos = currentPoint.xPos;
            var yPos = currentPoint.yPos;
            var areaBounds = this.model.m_AreaBounds;
            var dataLabel = this.model.series[seriesIndex].marker.dataLabel;
            var location = currentPoint.location ? currentPoint.location : currentPoint.symbolLocation;
            if (location.Y > currentPoint.textOptions.y)
                var endY = (currentPoint.textOptions.y);                         // top
            else {
                bottom = true
                endY = (currentPoint.textOptions.y - currentPoint.height / 2);  // bottom
            }
            if (currentPoint.dataLabeltemplate) {                               // for template
                endY = currentPoint.yPos - this.model.m_AreaBounds.Y + currentPoint.height;
                currentPoint.textOptions.x = currentPoint.textOptions.x - this.model.m_AreaBounds.X + currentPoint.width / 4 + this.canvasX;
            } else if ((xPos > areaBounds.Width || (xPos + currentPoint.width) < 0 ||
                yPos - currentPoint.height > areaBounds.Height || yPos + currentPoint.height < 0) && !dataLabel.showEdgeLabels)
                drawConnectorLine = false;
            if (drawConnectorLine) {
                var connectorDirection = "M" + " " + (location.X + this.canvasX) + " " + (location.Y + this.canvasY) + " " + "L" + " " + (currentPoint.textOptions.x) + " " + (endY);
                var connectorLineValues = this.model.series[seriesIndex].marker.dataLabel.connectorLine;
                var stroke = !ej.util.isNullOrUndefined(connectorLineValues.color) ? connectorLineValues.color : this.model.series[seriesIndex].fill;
                var connectorOptions = {
                    'id': this.svgObject.id + "_dataLabelConnectorLine_series" + seriesIndex + "_" + index,
                    'stroke': stroke,
                    'stroke-width': connectorLineValues.width,
                    'd': connectorDirection
                };
                this.model.series[seriesIndex].connectorLines = true;
                this.svgRenderer.drawPath(connectorOptions, this.gConnectorEle[seriesIndex]);
            }
        },

        // to reset the data label values back 
        resetValues: function (currentPoint) {
            currentPoint.textOptions.y = currentPoint.dataLabel.textY;
            currentPoint.yPos = currentPoint.dataLabel.y;
            currentPoint.textOptions.x = currentPoint.dataLabel.textX;
            currentPoint.xPos = currentPoint.dataLabel.x
        },

        // to detect collision
        isCollide: function (a, b, j, contrastColor, chart) {
            var width = 0;
            var height = 0;
            var state = false, markerState = false, aVal, areaBounds, aBounds;
            if (contrastColor) {
                aVal = a.Region.Bounds,
                    areaBounds = chart.model.m_AreaBounds;
                aBounds = {
                    "X": aVal.X - areaBounds.X,
                    "Y": aVal.Y - areaBounds.Y,
                    "Width": aVal.Width,
                    "Height": aVal.Height
                };
                if (b.symbolName != "None") {
                    rectLeft = b.xPos;
                    rectRight = b.xPos + b.width;
                    rectTop = b.yPos - b.height / 2;
                    rectBottom = b.yPos + b.height / 2;
                }
                else {
                    rectLeft = b.textOptions.x - b.width / 2;
                    rectRight = b.textOptions.x + b.width / 2;
                    rectTop = b.textOptions.y - ((b.textOptions.angle == 90 || b.textOptions.angle == -90) ? b.height / 2 : b.height);
                    rectBottom = b.textOptions.y + ((b.textOptions.angle == 90 || b.textOptions.angle == -90) ? b.height / 2 : 0);
                }
                state = ((aBounds.X < rectRight) && ((aBounds.X + aBounds.Width) > rectLeft) &&
                    (aBounds.Y < rectBottom) && ((aBounds.Y + aBounds.Height) > rectTop));
            }
            else {
                var borderWidth = a.seriesIndex ? this.model.series[a.seriesIndex].marker.dataLabel.border.width : 0;
                borderWidth += b.seriesIndex ? this.model.series[b.seriesIndex].marker.dataLabel.border.width : 0;
                var series = this.model.series;
                var firstSeries = series[a.seriesIndex];
                var secondSeries = series[b.seriesIndex];
                var aXPos = a.xPos, aYPos = a.yPos, bXPos = b.xPos, bYPos = b.yPos;
                a.xPos += firstSeries.xAxis.x, a.yPos += firstSeries.yAxis.y,
                    b.xPos += secondSeries.xAxis.x, b.yPos += secondSeries.yAxis.y;

                if (a != b) {
                    state = !(                    // to compare data labels
                        ((a.yPos + a.height) < (b.yPos)) ||
                        (a.yPos > (b.yPos + b.height)) ||
                        ((a.xPos + a.width / 2 + borderWidth) < b.xPos - b.width / 2) ||
                        (a.xPos - a.width / 2 > (b.xPos + b.width / 2)));
                    if (state) {
                        height = (a.yPos + a.height) - b.yPos;
                        width = (a.xPos + a.width) - b.xPos;
                    }
                    a.xPos = aXPos, a.yPos = aYPos;
                }
                if (!state) {
                    for (var f = 0; f < this.model.markerRegion.length; f++) {
                        a = this.model.markerRegion[f];
                        firstSeries = series[a.seriesIndex];
                        aXPos = a.xPos, aYPos = a.yPos;
                        a.xPos += firstSeries.xAxis.x, b.yPos += firstSeries.yAxis.y;
                        markerState = !(                // to compare data label and marker
                            ((a.yPos + a.height) < (b.yPos - b.height / 2)) ||
                            (a.yPos > (b.yPos + b.height)) ||
                            ((a.xPos + a.width) < b.xPos) ||
                            (a.xPos > (b.xPos + b.width)));
                        if (markerState)
                            break;
                    }
                }

                a.xPos = aXPos, a.yPos = aYPos;
                b.xPos = bXPos, b.yPos = bYPos;
                // to hide the partially visible data labels
            }


            return { state: state, marker: markerState, markerRegion: a, width: width, height: height };
        },

        drawAccDisplayText: function (series, options, seriesIndex) {
            // method to draw text 
            var chartObj = this;
            var pointsLength = options._visiblePoints.length;
            chartObj.firstStartAngle = [];
            var type = options.type.toLowerCase();
            if ((type != "pyramid" && type != "funnel" && type != "pieofpie") && (options.leftsidePoints.length > 0 || options.rightsidePoints.length > 0)) {
                var rightsidePointsLength = options.rightsidePoints.length;
                var leftsidePointsLength = options.leftsidePoints.length;

                for (var i = 0; i < rightsidePointsLength; i++) {
                    options.rightsidePoints[i].index = i;
                    series.drawDataLabelAcc(chartObj, options, options.rightsidePoints[i].pointIndex, options.rightsidePoints[i], seriesIndex)
                }
                for (var j = leftsidePointsLength - 1; j >= 0; j--) {
                    options.leftsidePoints[j].index = j;
                    series.drawDataLabelAcc(chartObj, options, options.leftsidePoints[j].pointIndex, options.leftsidePoints[j], seriesIndex)
                }
            }
            else {
                for (var i = 0; i < pointsLength; i++) {
                    options._visiblePoints[i].index = i;
                    var pointIndex = type == "pieofpie" ? options._visiblePoints[i].actualIndex : i;
					if (options._visiblePoints[i].start != options._visiblePoints[i].startAngle)
                        options._visiblePoints[i].startAngle = options._visiblePoints[i].start;
                    if (isNaN(options._visiblePoints[i].startAngle) && options.type.toLowerCase() == "pie" && options.type.toLowerCase == "pieofpie") continue;
                    series.drawDataLabelAcc(chartObj, options, pointIndex, options._visiblePoints[i], seriesIndex, options.collectionIndex)
                }
            }
            if (options.type.toLowerCase() == "pyramid" || options.type.toLowerCase() == "funnel") {
                this.svgRenderer.append(this.gConnectorEle, this.gSeriesEle);

                this.svgRenderer.append(this.gSymbolGroupEle, this.gSeriesEle);

                this.svgRenderer.append(this.gDataLabelEle, this.gSeriesEle);

                this.svgRenderer.append(this.gSeriesTextEle, this.gSeriesEle);


                this.svgRenderer.append(this.gSeriesEle, this.svgObject);

                if (!this.vmlRendering)
                    this.svgRenderer.append(this.svgObject, this.element)

            }
        },

        _processOData: function (series) {
            var chart = this, type = series.type.toLowerCase();
            var queryPromise = series.dataSource.executeQuery(series.query);
            queryPromise.done(function (e) {
                chart._processJsonData(e.result, series);
                series.visibility = 'visible';
                $(chart.svgObject).empty();
                $(chart.legendSvgContainer).empty();
                if (chart.model.enableCanvasRendering) {
                    chart.svgRenderer.ctx.clearRect(0, 0, chart.svgObject.width, chart.svgObject.height);
                    $("#canvas_trackSymbol").remove();
                }

                var redrawChart = true;
                var dec = (type != "pie" || type != "doughnut") ? 0 : chart.model.series.length - 1
                for (var i = dec, cond; cond = (type != "pie" || type != "doughnut") ? i < chart.model.series.length : i >= 0; (type != "pie" || type != "doughnut") ? i++ : i--) {
                    if (chart.model.series[i].dataSource) {
                        if (chart.model.series[i].visibility == 'hidden') {
                            redrawChart = false;
                            break;
                        }
                    }
                }
                if (redrawChart) {
                    chart.draw();
                }
            });
            queryPromise.fail(function (e) {
                series.visibility = 'visible';
                $(chart.svgObject).empty();
                $(chart.legendSvgContainer).empty();
                var redrawChart = true;
                for (var i = 0; i < chart.model.series.length; i++)
                    if (chart.model.series[i].dataSource) {
                        if (chart.model.series[i].visibility == 'hidden') {
                            redrawChart = false;
                            break;
                        }
                    }
                if (redrawChart) {
                    chart.draw();
                }
            });
        },
        _findDatatype: function (series, chart) {
            var isDate;
            if (series.xAxisName == null)
                isDate = chart.model.primaryXAxis.valueType != null && chart.model.primaryXAxis.valueType.toLowerCase() == "datetime" ? true : false;
            else {
                for (var i = 0; i < chart.model._axes.length; i++) {
                    var axis = chart.model._axes[i];
                    if (axis.name == series.xAxisName && axis.valueType != null && axis.valueType.toLowerCase() == "datetime")
                        isDate = true;
                    else
                        isDate = false;
                }
            }
            return isDate;
        },
        _processJsonData: function (jsonObj, series) {

            var xName = series.xName,
                yNames = series.yName,
                colorMap = series.pointColorMappingName,
                textMap = series.marker && series.marker.dataLabel && series.marker.dataLabel.textMappingName,
                type = series.type.toLowerCase(),
                jsonLength = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg") ? jsonObj.length : jsonObj[jsonObj.length - 1] === undefined ? jsonObj.length - 1 : jsonObj.length,
                yLength = yNames.length,
                isBubble = type == 'bubble',
                checkString = !!jsonObj[0][xName].indexOf || (!series._hiloTypes ? !!(jsonObj[0][yNames] == 0 ? 0 : jsonObj[0][yNames] || jsonObj[0][series.size] || 0).indexOf : (jsonObj[0][series.high] && jsonObj[0][series.high].indexOf)),
                isDate = checkString && jsonObj[0][xName].indexOf && (jsonObj[0][xName].indexOf("/Date(") != -1),
                point, m = 0, x, y,
                hiddenIndex = this.model._hiddenPointIndex;

            series.points = new Array(jsonLength);

            if (!checkString) {
                while (m < jsonLength) {
                    x = jsonObj[m][xName];
                    if (!series._hiloTypes)
                        y = typeof jsonObj[m][yNames] == "string" ? parseFloat(jsonObj[m][yNames]) : jsonObj[m][yNames];
                    series.points[m++] = { x: x, xValue: x, y: y, YValues: [y] };
                }
            }
            else if (type != "boxandwhisker")
                this._processStringData(jsonObj, series, xName, yNames, isDate, jsonLength);

            //Using separate function for boxandwhisker series
            if (type == "boxandwhisker")
                this._processBoxandWhiskerData(jsonObj, series, xName, yNames, isDate);

            //Using separate functions for bubble and hilo type series improves the performance a lot
            (isBubble || colorMap.length > 0 || textMap.length > 0 || hiddenIndex.length > 0) && this._processBubbleSize(jsonObj, series, checkString, colorMap, textMap, hiddenIndex, isBubble, jsonLength);

            (series._hiloTypes) && this._processHiLoValues(jsonObj, series, checkString, type, jsonLength);
            return 0;
        },

        _processBoxandWhiskerData: function (jsonObj, series, xName, yName, isDate) {
            var m = 0, jsonLength = jsonObj.length, x, y,
                isDateString = jsonObj[0][xName].indexOf && jsonObj[0][xName].indexOf("/Date(") != -1;
            while (m < jsonLength) {
                x = jsonObj[m][xName];
                isDate && (x = new Date(isDateString ? parseInt(x.substr(6)) : x));
                y = jsonObj[m][yName];
                series.points[m++] = { x: x, xValue: x, y: y, YValues: [y] };
            }
        },

        _processStringData: function (jsonObj, series, xName, yName, isDate, jsonLength) {
            var m = 0, x, y,
                isDateString = jsonObj[0][xName].indexOf && jsonObj[0][xName].indexOf("/Date(") != -1;
            while (m < jsonLength) {
                x = jsonObj[m][xName];
                isDate && !(x instanceof Date) && (x = new Date(isDateString ? parseInt(x.substr(6)) : x));
                y = parseFloat(jsonObj[m][yName]);
                series.points[m++] = { x: x, xValue: x, y: y, YValues: [y] };
            }
        },

        _processBubbleSize: function (jsonObj, series, checkString, colorMap, textMap, hiddenIndex, isBubble, jsonLength) {
            var point, m = 0;
            for (; m < jsonLength; m++) {
                point = series.points[m];
                point.YValues[0] = checkString ? parseFloat(jsonObj[m][series.yName]) : jsonObj[m][series.yName];
                isBubble && (point.size = point.YValues[1] = checkString ? parseFloat(jsonObj[m][series.size]) : jsonObj[m][series.size]);
                (colorMap.length > 0) && (point.fill = jsonObj[m][colorMap]);
                (textMap.length > 0) && (point.text = jsonObj[m][textMap]);
                (hiddenIndex.length > 0 && m == hiddenIndex[m]) && (point.visibility = "hidden");
            }
        },
        _processHiLoValues: function (jsonObj, series, checkString, type, jsonLength) {
            var point, obj, m = 0;
            for (; m < jsonLength; m++) {
                point = series.points[m];
                obj = jsonObj[m];
                point.y = point.high = point.YValues[0] = checkString ? (this.tryParseFloat(obj[series.high])) : obj[series.high];
                point.low = point.YValues[1] = checkString ? this.tryParseFloat(obj[series.low]) : obj[series.low];
                if (type != 'hilo' && type != 'rangecolumn' && type != 'waterfall') {
                    point.open = point.YValues[2] = checkString ? this.tryParseFloat(obj[series.open]) : obj[series.open];
                    point.close = point.YValues[3] = checkString ? this.tryParseFloat(obj[series.close]) : obj[series.close];
                    if (series.volume)
                        point.volume = point.YValues[4] = checkString ? this.tryParseFloat(obj[series.volume]) : obj[series.volume];
                }
            }
        },
        tryParseFloat: function (str) {
            return (str && str.length > 0) ? parseFloat(str) : str;
        },
        bindTo: function (excludeDataUpdate) {
            var model = this.model,
                seriesCollection = model.series;
            $("#" + this.svgObject.id + '_CrosshairVertical').remove();
            $("#" + this.svgObject.id + '_CrosshairHorizontal').remove();
            if ($.finish) {
                $(".ejTooltip" + this._id).finish();
                $(".tooltipDiv" + this._id).finish();
            }
            else {
                $(".ejTooltip" + this._id).stop(true, true);
                $(".tooltipDiv" + this._id).stop(true, true);
            }
            $(document).find('[id*="_TrackToolTip"]').remove();// fixed for mobile issue
            $('#template_group_' + this._id).remove();
			//Create id to chart elements, if the chart element don't have id
			if(this.isChartElemId)
				this.createElementsId();


            model.primaryXAxis._valueType = null;
            model.primaryXAxis.position = null;
            model.primaryYAxis._valueType = null;
            model.primaryYAxis.position = null;
            model.requireInvertedAxes = false;
            model._hiddenPointIndex = [];
            var seriesLength = seriesCollection.length,
                axesLength = model.axes.length,
                axis;
            for (var i = 0; i < axesLength; i++) {
                axis = model.axes[i];
                axis._valueType = null;
                axis.position = null;
            }
            if (model._axes) {
                axesLength = model._axes.length;
                for (var j = 0; j < axesLength; j++) {
                    axis = model._axes[j];
                    axis._valueType = null;
                    axis.position = null;
                    axis.zoomFactor = (axis._pointsLength && axis._pointsLength != axis.scrollbarSettings.pointsLength) ? 1 : axis.zoomFactor;
                }
            }
            for (var i = 0; i < seriesLength; i++) {
                var series = seriesCollection[i];
                var mappingYNames = ["y", "high", "low", "open", "close"];
                if (!(ej.isNullOrUndefined(series.points))) {
                    for (var j = 0; j < series.points.length; j++) {
                        mappingYNames.map(function (name, index) {
                            var value = series.points[j][name];
                            if (!ej.isNullOrUndefined(value)) series.points[j][name] = (typeof (value) == "string") ? parseFloat(value) : value;
                        });
                    }
                }
                series.position = null;
                if (series.fill && this.model.seriesColors && series.fill != this.model.seriesColors[i])
                    seriesCollection[i].isFill = true;
            }
            if (model.AreaType && model.AreaType == "none") {
                var series = seriesCollection[0];
                var point;
                for (var i = 0; series.points && i < series.points.length; i++) {
                    point = series.points[i]
                    //point._visibility = point._visibility ? point._visibility : null;
                    if (point._visibility == "hidden" && model.AreaType == "none" && seriesCollection.length == 1)
                        this.model._hiddenPointIndex[i] = i;
                    point.isFill = (point.fill && model.pointColors && point.fill != model.pointColors[i]) || point.isFill;
                    point.fill = !point.isFill ? null : point.fill;
                }
            }
            if (model.enable3D)
                ej.Ej3DRender.transform = null;
            if (seriesCollection) {
                //var series = seriesCollection;
                this.setModelProperties(excludeDataUpdate);
                if (!excludeDataUpdate) {
                    for (var i = 0; i < seriesCollection.length; i++) {
                        var series = seriesCollection[i];
                        if (series.visibility == null || series.visibility == undefined) {
                            series.visibility = 'visible';
                        }
                        if (series.type) series._hiloTypes = series.type.toLowerCase() == "polar" || series.type.toLowerCase() == "radar" ? ej.seriesTypes[series.drawType.toLowerCase()].prototype.hiloTypes : ej.seriesTypes[series.type.toLowerCase()].prototype.hiloTypes;
                        if (!(series.points))
                            series.points = [];
                        if (series.dataSource) {
                            if (series.dataSource instanceof ej.DataManager) {
                                series.visibility = 'hidden';
                                if (ej.isNullOrUndefined(series.query) || !(series.query instanceof ej.Query))
                                    series.query = ej.Query();
                                this._processOData(series);
                            } else if (series.dataSource.length > 0) {
                                if (typeof series.dataSource === 'string' || series.dataSource.toLowerCase)
                                    series.dataSource = JSON.parse(series.dataSource.replace(/'''/g, "\""));
                                this._processJsonData(series.dataSource, series);
                            }
                        }
                    }
                }
                if ($(this.svgObject).width() > 0)
                    this.draw(excludeDataUpdate);
            }



        },

        _createChartId: function () {
            var exsistId = false, count = 0;
            var className = $(this.element)[0].className.split(" ")[0];
            do {
                if (!$("#" + className + "_" + count).length) {
					$(this).attr("_id", className + "_" + count);
					$(this.element).attr('id', className + "_" + count);
					exsistId = true;
                }
                count++;
            } while (!exsistId);
			this.isChartElemId = true;
        },
		
		createElementsId: function () {
			this.legendContainer.attr('id', "legend_" + this._id);
			this.scrollerContainer.attr('id', "legend_Scroller" + this._id);
			this.chartContainer.attr('id', "chartContainer_" + this._id);
			this.axisScroll.attr('id', "axisScrollbar_" + this._id);
			$(this.svgObject).attr('id', this._id + (this.model.enableCanvasRendering ? '_canvas' : '_svg'));
		},

        calculateHeight: function (chart) {              // height calculation
            var $svgObj = $(chart.svgObject);
            var chartHeight = chart.model.size.height;
            var containerHeight = $(chart.element).height();
            var height = (containerHeight / 100) * parseInt(chartHeight);
            $svgObj.height(height);
            return height;
        },

        calculateWidth: function (chart) {               // width calculation
            var $svgObj = $(chart.svgObject);
            var chartWidth = chart.model.size.width;
            var containerWidth = $(chart.element).width();
            var width = (containerWidth / 100) * parseInt(chartWidth);
            $svgObj.width(width);
            return width;
        },

        // store the element class logic perform here
        selectedStyle: function (chart) {
            var selected = $('#' + chart._id).find('[class*="Selection"]');
            var selection = [];
            for (var i = 0; i < selected.length; i++) {
                selection[i] = [];
                selection[i].id = selected[i].id;
                selection[i].className = $('#' + selection[i].id).attr('class');
            }
            if ($('[id $= Def ]').length > 0) {
                selection.pattern = $('[id $= Def ]');
            }

            return selection;
        },

        chartResize: function () {
            var chart = this;
            var $svgObj = $(chart.svgObject);
            var selection = this.selectedStyle(chart);
            this.removeMultiRect();
            this._chartResize = true;
            if (this.model.enableCanvasRendering) {
                $('[id*=' + this._id + '_Selection_' + ']').remove();
                $("#canvas_trackSymbol").remove();
                var ctx = chart.svgObject.getContext("2d");
                ctx.clearRect(0, 0, this.svgRenderer.svgObj.width, this.svgRenderer.svgObj.height);

                if (typeof chart.model.size.width == "string" && chart.model.size.width.indexOf("%") != -1) {           // to set width 
                    var width = chart.calculateWidth(chart);
                    this.svgRenderer.svgObj.width = width;
                }
                else
                    this.svgRenderer.svgObj.width = $("#" + this._id).width();

                if (typeof chart.model.size.height == "string" && chart.model.size.height.indexOf("%") != -1) {          // to set height
                    var height = chart.calculateHeight(chart);
                    this.svgRenderer.svgObj.height = height;
                }
                else
                    this.svgRenderer.svgObj.height = ej.util.isNullOrUndefined(this.model.size.height) ? "450" : parseInt($(chart.element).height());


            }
            if (this.resizeTO) clearTimeout(this.resizeTO);
            this.resizeTO = setTimeout(function () {
                if (!ej.util.isNullOrUndefined(chart.model)) {
                    if (typeof chart.model.size.width == "string" && chart.model.size.width.indexOf("%") != -1) {
                        chart.calculateWidth(chart);
                    }
                    else
                        $svgObj.width($(chart.element).width());

                    if (typeof chart.model.size.height == "string" && chart.model.size.height.indexOf("%") != -1) {
                        chart.calculateHeight(chart);
                    }
                    else
                        $svgObj.height(chart.model.size.height);
                    if ($(chart.svgObject).width() > 0) {
                        $(chart.svgObject).empty();
                        $(chart.legendSvgContainer).empty();
                        $('#template_group_' + chart._id).remove();
                        $("#annotation_group_" + chart._id).remove();       //to remove annotation from DOM on resize
                        chart.disableAnimation();
                        for (var j = 0; j < chart.model.series.length; j++)
                            chart.model.series[j].regionAdded = false;
                        chart.draw();
                        for (var i = 0; i < selection.length; i++) {
                            $('#' + selection[i].id).attr('class', selection[i].className);
                        }
                        if (selection.pattern)
                            chart.svgRenderer.append(selection.pattern, chart.svgObject);
                        if (chart.zoomed && !chart.vmlRendering)
                            chart._enableZoomingButtons();
                        chart.enableAnimation();
                    }
                }
            }, 500);

        },
        isDevice: function () {
            return (/mobile|tablet|android|kindle/i.test(navigator.userAgent.toLowerCase()));
            // comment above line temporary. Due to the below code event wont bind for tablet device
            //  return (/mobile|android|kindle/i.test(navigator.userAgent.toLowerCase()));
        },

        //To check whether the device is Windows
        isWindows: function () {
            if (!ej.getBooleanVal($('head'), 'data-ej-android') && !ej.getBooleanVal($('head'), 'data-ej-ios') && !ej.getBooleanVal($('head'), 'data-ej-ios7') && !ej.getBooleanVal($('head'), 'data-ej-flat'))
                return this._windows();
        },

        _windows: function () {
            return (/trident|windows phone/i.test(navigator.userAgent.toLowerCase())) || (ej.getBooleanVal($('head'), 'data-ej-windows', false) === true);
        },

        bindResizeEvents: function () {
            if (this.model._resizeEventRegistered)
                return 0;
            if (ej.isTouchDevice() && this._isOrientationSupported())
                this._on($(window), "orientationchange", this.chartResize);
            else
                this._on($(window), "resize", this.chartResize);
            this.model._resizeEventRegistered = true;
        },
        removeResizeEvents: function () {
            if (this.model._resizeEventRegistered) {
                if (ej.isTouchDevice() && this._isOrientationSupported())
                    this._off($(window), "orientationchange", this.chartResize);
                else
                    this._off($(window), "resize", this.chartResize);
                this.model._resizeEventRegistered = false;
            }
        },
        _isOrientationSupported: function () {
            return ("orientation" in window && "onorientationchange" in window);
        },
        _calculatePinchZoomPosition: function (e) {
            var areaBounds = this.model.m_AreaBounds, zoomPosition, axes = this.model._axes, axis,
                event = (e.originalEvent.touches && e.originalEvent.touches.length > 0 ? e.originalEvent.touches[0] : e.originalEvent),
                pageX = event.pageX, pageY = event.pageY, panTouch = this.previousPanTouch, pinchPan,
                orientation, offset, j = 0, length = axes.length;

            if (pageX > areaBounds.X && pageX < areaBounds.X + areaBounds.Width && pageY > areaBounds.Y && pageY < areaBounds.Y + areaBounds.Height) {
                if (!panTouch)
                    panTouch = this.previousPanTouch = { pageX: pageX, pageY: pageY };

                if (ej.isTouchDevice() || this.model.zooming.enableDeferredZoom) {
                    this.oPreviousCoords = { x: this.previousPanTouch.pageX, y: this.previousPanTouch.pageY };
                    return this.chartMouseMove(e); //Deferred panning for slow devices
                }

                for (; j < length; j++) {
                    axis = axes[j];
                    orientation = axis.orientation.toLowerCase() == "horizontal";
                    offset = orientation ? ((panTouch.pageX - pageX) / axis.width * axis.zoomFactor) : ((panTouch.pageY - pageY) / axis.height * axis.zoomFactor);
                    zoomPosition = axis.zoomPosition;
                    axis.zoomPosition = this._ensureValueInMinMax(orientation ? zoomPosition + offset : zoomPosition - offset, 0, 1 - axis.zoomFactor);
                    pinchPan = pinchPan || (zoomPosition != axis.zoomPosition);
                }
                this.previousPanTouch = { pageX: pageX, pageY: pageY };
                if (pinchPan && !this.chartUpdating) {
                    this.redraw(true, pinchPan, e.target);
                    this._enableZoomingButtons();
                }
            }

        },
        _calculateTouchDistance: function (previous, current) {
            var result = [], j = 0, length = current.length;

            for (; j < length; j++) {
                if (previous[j] == null)
                    previous[j] = current[j];
                result[j] = {};
                if (j > 0) {
                    result[j].scaleX = ((previous[0].pageX != previous[1].pageX) && ((current[0].pageX - current[1].pageX) / (previous[0].pageX - previous[1].pageX)));
                    result[j].scaleY = ((previous[0].pageY != previous[1].pageY) && ((current[0].pageY - current[1].pageY) / (previous[0].pageY - previous[1].pageY)));
                    result[j].center = { x: (previous[0].pageX + current[0].pageX) / 2, y: (previous[1].pageY + current[1].pageY) / 2 };
                }
            }
            return result;
        },
        _ensureValueInMinMax: function (valueToCheck, minValue, maxValue) {
            return valueToCheck < minValue ? minValue : (valueToCheck > maxValue ? maxValue : valueToCheck);
        },
        _calculatePinchZoomFactor: function (scale, orientation, target) {
            var model = this.model, axes = model._axes, zoomedOut = true, zoomed, currentScale, origin, cumulativeScale,
                axisScale, axis, factor, zoomFactor, zoomPosition, areaBounds = model.m_AreaBounds,
                prevScale, scaleLimit = 10000, i = 0, length = axes.length;

            orientation = (orientation == 'x' ? 'horizontal' : (orientation == 'y' ? 'vertical' : null));

            if (this.previousScale != null) {
                for (; i < length; i++) {
                    if (!orientation || axes[i].orientation === orientation) {
                        axis = axes[i];
                        currentScale = axis.orientation == 'horizontal' ? scale[1].scaleX : scale[1].scaleY;
                        if (!currentScale)
                            break;
                        prevScale = axis.orientation == 'horizontal' ? this.previousScale[1].scaleX : this.previousScale[1].scaleY;
                        zoomFactor = axis.zoomFactor;
                        zoomPosition = axis.zoomPosition;
                        axisScale = this._ensureValueInMinMax(1 / axis.zoomFactor, 1, scaleLimit);
                        cumulativeScale = this._ensureValueInMinMax(axisScale + (axisScale * (currentScale - prevScale) / prevScale), 1, scaleLimit);
                        origin = (axis.orientation == 'horizontal' ? (scale[1].center.x / areaBounds.Width) : (1 - scale[1].center.y / areaBounds.Height));
                        axis.zoomFactor = this._ensureValueInMinMax(1 / cumulativeScale, 1 / scaleLimit, 1);
                        axis.zoomPosition = this._ensureValueInMinMax(zoomPosition + (zoomFactor - axis.zoomFactor) * origin, 0, 1 - axis.zoomFactor);
                        zoomed = zoomed || (zoomFactor != axis.zoomFactor);
                        zoomedOut = zoomedOut && (axis.zoomFactor == 1);
                    }
                }
                if (zoomed && !zoomedOut && !this.chartUpdating) {
                    this.zoomed = true;
                    this.redraw(true, true, target);
                    this._enableZoomingButtons();
                }
                else if (zoomedOut && this.zoomed && !this.chartUpdating) {
                    this.redraw(true, true, target);
                    this.zoomed = false;
                    this._removeZoomkit();
                }
            }
            this.previousScale = scale;
        },
        _addTouchPointer: function (touches, e, overwrite, j) {
            for (j = touches.length; j--;)
                if (e.pointerId == touches[j].pointerId) {
                    if (overwrite) touches[j] = e;
                    return 0;
                }
            touches.push(e);
        },
        _removeTouchPointer: function (touches, e, j) {
            for (j = touches && touches.length; j--;)
                if (e.pointerId == touches[j].pointerId) {
                    touches.splice(j, 1);
                    return 0;
                }
        },
        _copyTouches: function (touches) {
            var target = [], i = 0, length = touches.length;
            for (; i < length; i++)
                target[i] = { pageX: touches[i].pageX, pageY: touches[i].pageY };
            return target;
        },
        _initEventParams: function () {
            return { touches: [], movements: [] };
        },
        _pointerPinchStart: function (e) {
            var event = e.originalEvent, targetId, model = this.model, bounds = model.m_AreaBounds, eventObj, elementOffset = $(this.element).offset(),
                params = this.eventParams || (this.eventParams = this._initEventParams()),
                x = (event.pageX || event.changedTouches[0].pageX) - elementOffset.left, y = (event.pageY || event.changedTouches[0].pageY) - elementOffset.top;

            if (this.model.selectionEnable) {
                this.cancelEvent(e);
                event.preventDefault();
            }

            if (!model.enable3D && model.AreaType == 'cartesianaxes' && event.pointerType != 'mouse' && event.pointerType != 4 && model.zooming.enable && model.zooming.enablePinching && (event.touches || event.pointerId)) {
                targetId = e.target.id;
                if (targetId.indexOf("ResetZoom") != -1)
                    this.resetZoom(e);
                else if (targetId.indexOf("panIcon") != -1)
                    this.startPan(e);
                else if (targetId.indexOf("ZoomIcon") != -1)
                    this.startZoom(e);
                else if (targetId.indexOf("ZoomOut") != -1 || targetId.indexOf("ZoomIn") != -1)
                    this.startZoomInOut(e);
                else if (x > bounds.X && x < bounds.X + bounds.Width && y > bounds.Y && y < bounds.Y + bounds.Height) {
                    event.touches ? (params.touches = this._copyTouches(event.touches)) : this._addTouchPointer(params.touches, { pageX: x, pageY: y, pointerId: event.pointerId });
                    if (params.touches.length < 2)
                        this.chartMouseDown(e);
                }
                else
                    this.chartMouseDown(e);
            }
            else
                this.chartMouseDown(e);
        },
        _removeInteractions: function () {
            $("[id*=_TrackSymbol]").remove();
            this._removeTrackBall();
            this._removeHighlight();
            $("#" + this.svgObject.id + "_TrackToolTip").hide();
            $("#" + this._id + "_tooltip").remove();
        },
        _pinchGestureMove: function (e) {
            var event = e.originalEvent.changedTouches[0], touches = e.originalEvent.touches, model = this.model, elementOffset = $(this.element).offset(),
                areaBounds = model.m_AreaBounds, x = event.pageX - elementOffset.left, y = event.pageY - elementOffset.top;

            this.eventParams = this.eventParams || this._initEventParams(model, event);
            if (!model.enable3D && model.AreaType == 'cartesianaxes' && event.pointerType != 'mouse' && event.pointerType != 4 && model.zooming.enable && model.zooming.enablePinching && touches) {
                if (x > areaBounds.X && x < areaBounds.X + areaBounds.Width && y > areaBounds.Y && y < areaBounds.Y + areaBounds.Height) {
                    this._removeInteractions();
                    if (touches.length > 1)
                        this._calculatePinchZoomFactor(this._calculateTouchDistance(this.eventParams.touches, touches), model.zooming.type, e.target);
                    else
	                (this.doPan || this.panning) ? this._calculatePinchZoomPosition(e) : this.chartMouseMove(e);
                }
                else
                    this.chartMouseMove(e);
            } else
                this.chartMouseMove(e);
        },
        _pointerPinchMove: function (e) {
            var areaBounds, touches, j = 0, event = e.originalEvent, elementOffset = $(this.element).offset(), x = event.pageX - elementOffset.left, y = event.pageY - elementOffset.top,
                model = this.model, params = this.eventParams || this._initEventParams(model, event), startTouches = params.touches, previous = this.previousPointerMove,
                length = startTouches.length, touches = params.movements;


            if (previous != null && previous.pageX == event.pagex && previous.pageY == event.pageY && previous.pointerId == e.pointerId)
                return false;
            if (!model.enable3D && model.AreaType == 'cartesianaxes' && event.pointerType != 'mouse' && event.pointerType != 4 && model.zooming.enable && model.zooming.enablePinching) {
                areaBounds = model.m_AreaBounds;
                if (x > areaBounds.X && x < areaBounds.X + areaBounds.Width && y > areaBounds.Y && y < areaBounds.Y + areaBounds.Height) {
                    this._addTouchPointer(startTouches, { pageX: x, pageY: y, pointerId: event.pointerId });
                    if (startTouches && startTouches.length > 1) {
                        for (; j < length; j++)
                            this._addTouchPointer(touches, startTouches[j], false);
                        this._addTouchPointer(touches, { pageX: x, pageY: y, pointerId: event.pointerId }, true);
                        if (!((touches[0].pageX == startTouches[0].pageX) && (touches[1].pageX == startTouches[1].pageX) && (touches[0].pageY == startTouches[0].pageY) && (touches[1].pageY == touches[1].pageY)))
                            this._calculatePinchZoomFactor(this._calculateTouchDistance(startTouches, touches), this.model.zooming.type, e.target);
                    }
                    else
	                (this.doPan || this.panning) ? this._calculatePinchZoomPosition(e) : this.chartMouseMove(e);
                }
                else {
                    startTouches.length > 0 && this._removeTouchPointer(startTouches, e);
                    touches.length > 0 && this._removeTouchPointer(touches, e);
                    this.chartMouseMove(e);
                }
                this.previousPointerMove = { pageX: x, pageY: y, pointerId: event.pointerId };
            }
            else
                this.chartMouseMove(e);
        },
        _pointerPinchEnd: function (e) {
            var model = this.model, event = e.originalEvent, params = this.eventParams || (this.eventParams = this._initEventParams(model, event)),
                mouseLeave = (event.type.indexOf("leave") != -1 || event.type.indexOf("out") != -1 || event.type.indexOf("Out") != -1);
            if (!model.enable3D && model.AreaType == 'cartesianaxes' && event.pointerType != 'mouse' && event.pointerType != 4 && model.zooming.enable && model.zooming.enablePinching && (event.touches || event.pointerId)) {
                if (this.continuePinching != null)
                    this.svgObject.removeChild(this.svgObject.firstChild);
                this.continuePinching = this.previousPanTouch = this.previousScale = null;
                if (event.touches) {
                    this.eventParams = null;
                    this.chartMouseUp(e);
                    mouseLeave && this.chartMouseLeave(e);
                }
                else {
                    this._removeTouchPointer(params.touches, { pointerId: event.pointerId });
                    if (params.movements.length > 0)
                        this._removeTouchPointer(params.movements, { pointerId: event.pointerId });
                    if (params.touches.length == 0) {
                        this.chartMouseUp(e);
                        mouseLeave && this.chartMouseLeave(e);
                        this.eventParams = null;
                    }
                }
            }
            else {
                this.chartMouseUp(e);
                mouseLeave && this.chartMouseLeave(e); //Trigger mouse leave event
            }
        },
        _appendStyle: function (selector) {
            var css = '#' + selector + '.e-canvas * {touch-action:none; -ms-touch-action:none}',
                head = document.head || document.body,
                style = document.createElement('style');

            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            head.appendChild(style);
        },
        bindEvents: function () {

            var matched = jQuery.uaMatch(navigator.userAgent),
                browserInfo = ej.EjSvgRender.utils.browserInfo(),
                isPointer = browserInfo.isMSPointerEnabled,
                isIE11Pointer = browserInfo.pointerEnabled,
                touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : "touchstart mousedown",
                touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup",
                touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove",
                touchCancelEvent = isPointer ? (isIE11Pointer ? "pointerleave" : "MSPointerOut") : "touchleave mouseleave";
            this.model.browserInfo = browserInfo;

            if ((window.navigator.maxTouchPoints > 1 && window.PointerEvent) || window.PointerEventsPolyfill) { //For IE11 and IE devices that supports pointer events
                this._on(this.element, "pointerup pointerleave", this._pointerPinchEnd);
                this._on(this.element, "pointerdown", this._pointerPinchStart);
                this._on(this.element, "pointermove", this._pointerPinchMove);
                this._appendStyle(this.element[0].id);
            }
            else if (window.TouchEvent)//For chrome, safari and android
            {
                this._on(this.element, "touchstart", this._pointerPinchStart);
                this._on(this.element, "touchmove", this._pinchGestureMove);
                this._on(this.element, "touchend", this._pointerPinchEnd);
                this._on($(this.element), "mousedown", this.chartMouseDown);
                this._on($(this.element), "mousemove", this.chartMouseMove);
                this._on(this.element, 'mouseleave', this.chartMouseLeave);
                this._on($(document), "mouseup", this.chartMouseUp);
                this._appendStyle(this.element[0].id);
            }
            else if (window.navigator.msMaxTouchPoints && window.navigator.msPointerEnabled) { //For IE10
                this._on(this.element, "MSPointerUp", this._pointerPinchEnd);
                this._on(this.element, "mouseleave", this.chartMouseLeave);
                this._on(this.element, "MSPointerDown", this._pointerPinchStart);
                this._on(this.element, "MSPointerMove", this._pointerPinchMove);
                this._appendStyle(this.element[0].id);
            }
            else {
                this._on(this.element, touchMoveEvent, this.chartMouseMove);
                this._on(this.element, touchCancelEvent, this.chartMouseLeave);
                this._on($(document), touchStopEvent, this.chartMouseUp);
                this._on($(this.element), touchStartEvent, this.chartMouseDown);
            }
            this._isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
            if ((this.isDevice() && this._isSafari) != true)
                this._on($(this.element), "click", this.chartMouseClick);
            this._on($(this.element), "contextmenu", this.chartRightClick);
            this._on($(this.element), "dblclick", this.chartMouseDoubleClick);


            if (this.model.canResize || this.model.isResponsive) {
                this.bindResizeEvents();
            }
            var touchAction = this.model.zooming.enable || this.model.commonSeriesOptions.dragSettings.enable ? 'none' : 'pan-y';

            $(this.element).css({ 'ms-touch-action': touchAction, 'touch-action': touchAction, 'content-zooming': 'none' }); //disable browser touch action   
            // $(this.svgObject).css({ 'ms-touch-action': 'none', 'touch-action': 'none', 'content-zooming': 'none' });
            $(this.element).css({
                "-webkit-touch-callout": "none", /* iOS Safari */
                "-webkit-user-select": "none",  /* Chrome/Safari/Opera */
                "-moz-user-select": "none",     /* Firefox */
                "-ms-user-select": "none",     /* Internet Explorer/Edge */
                "user-select": "none"
            });
            var eventName = matched.browser.toLowerCase() == "mozilla" ? (isIE11Pointer ? "mousewheel" : "DOMMouseScroll") : "mousewheel";
            this._on(this.element, eventName, this.chartMouseWheel);

        },

        calZoomFactors: function (cumulativeScale, origin, currentZoomFactor, currentZoomPos) {
            var calcZoomFactorVal, calcZoomPosition;
            if (cumulativeScale == 1) {
                calcZoomFactorVal = 1;
                calcZoomPosition = 0;
            } else {
                calcZoomFactorVal = ej.EjSvgRender.utils._minMax(1 / cumulativeScale, 0, 1);
                calcZoomPosition = currentZoomPos + ((currentZoomFactor - calcZoomFactorVal) * origin);
            }
            return { zoomMFactor: calcZoomFactorVal, zoomMPosition: calcZoomPosition };
        },
        doMouseWheelZoom: function (cumulativeScale, origin, axis) {
            if (cumulativeScale >= 1) {
                var calZoomVal = this.calZoomFactors(cumulativeScale, origin, axis.zoomFactor, axis.zoomPosition);
                //calcZoomPos = Math.Round(calcZoomPos, 2);
                if (axis.zoomPosition != calZoomVal.zoomMPosition || axis.zoomFactor != calZoomVal.zoomMFactor) {
                    this.zoomed = true;
                    axis.zoomPosition = calZoomVal.zoomMPosition;
                    axis.zoomFactor = (calZoomVal.zoomMPosition + calZoomVal.zoomMFactor) > 1 ? (1 - calZoomVal.zoomMPosition) : calZoomVal.zoomMFactor;
                    return true;
                }
            }

            return false;

        },
        enableAnimation: function () {
            for (var m = 0; m < this.model.series.length; m++) {
                var series = this.model.series[m];
                series.enableAnimation = this.serAnimation[m];
            }
        },
        disableAnimation: function () {
            var chart = this;
            for (var m = 0; m < chart.model.series.length; m++)
                chart.model.series[m].enableAnimation = false;
            for (var k = 0; k < chart.model.indicators.length; k++)
                chart.model.indicators[k].enableAnimation = false;
        },
        _removeTrackBall: function () {
            var id = "#" + this.svgObject.id;
            $("#" + this.svgObject.id + "_trackSymbol").remove();
            $(document).find("#measureTex").remove();
            if (this.chartCross.visible) {
                // Visibility is set to hidden
                var element = $(this.svgObject).find(id + "_AxisCrossToolTip");
                this.svgRenderer._setAttr($(element), { "visibility": 'hidden' });
                element = $(this.svgObject).find(id + "_CrosshairVertical");
                this.svgRenderer._setAttr($(element), { "d": 'M 0 0' });
                element = $(this.svgObject).find(id + "_CrosshairHorizontal");
                this.svgRenderer._setAttr($(element), { "d": 'M 0 0' });

                element = $(this.svgObject).find(id + "_TrackAxisToolTip");
                this.svgRenderer._setAttr($(element), { "visibility": 'hidden' });
                element = $(this.svgObject).find(id + "_Tracker");
                this.svgRenderer._setAttr($(element), { "d": 'M 0 0' });
                element = $(this.svgObject).find('[id*="_TrackToolTip"]');
                this.svgRenderer._setAttr($(element), { "visibility": 'hidden' });
                element = $(this.svgObject).find('[id*="_TrackToolTip"]').children();
                this.svgRenderer._setAttr($(element), { "visibility": 'hidden' });
                $(element).css('visibility', 'hidden');
                element = $(this.svgObject).find('[id*="_trackSymbol_"]');
                this.svgRenderer._setAttr($(element), { "visibility": 'hidden' });
                $(document).find('[id*="_TrackToolTipTemplate_"]').attr("visibility", "hidden");
                $(document).find('[id*="_TrackToolTipTemplate_"]').css("display", "none");
                $(id + "_CrosshairVertical").css("display", "none");
                $(id + "_CrosshairHorizontal").css("display", "none");
                $("#" + this._id).find('[id*="canvas_AxisToolTipRect"]').css("visibility", "hidden");
                $("#" + this._id).find('[id*="canvas_Tracker"]').remove();
                $("#" + this._id).find('[id*="canvas_trackSymbol"]').css("visibility", "hidden");
                $("#" + this._id).find('[id*="_gTooltip_"]').remove();
                $("#secondCanvas").remove();
                $(document).find('[id*="TrackGroupToolTipTemplate"]').remove();
                $(document).find('[id*="_TrackToolTipTemplate_"]').remove();
                $("#" + this._id).find('[id*="_trackball_grouping_tooltip"]').remove();
            }

        },
        enableTrackBall: function () {
            this.model.crosshair.visible = this.chartCross.visible;
            this.model.crosshair.type = this.chartCross.mArea;
        },
        disableTrackBall: function () {

            this.model.crosshair.visible = false;

            this._removeTrackBall();
        },
        _enableZoomingButtons: function () {
            var svgObjectId = this.svgObject.id;
            if (this.model.AreaType != 'cartesianaxes') {
                $("#" + svgObjectId + "_ResetZoom").remove();
                $("#" + svgObjectId + "_PanBtn").remove();
                $("#" + svgObjectId + "_ZoomBtn").remove();
                $("#" + svgObjectId + "_ZoomInBtn").remove();
                $("#" + svgObjectId + "_ZoomOutBtn").remove();
            }
            if (this.model.AreaType == 'cartesianaxes') {
                //Remove zoom buttons before adding them
                this._removeZoomkit();
                var isRTL = this.model.zooming.isReversed;
                if (!this.toolbarItems)
                {
                    this.toolbarItems = $.extend(true, [],  this.model.zooming.toolbarItems);
                    this.toolbarItems.reverse();
                }
                var toolbar = isRTL ? this.toolbarItems : this.model.zooming.toolbarItems;
                var length = toolbar.length;
                var currentItem, index;
                for (var i = length - 1; i >= 0; i--) {
                    currentItem = toolbar[i];
                    index = length - i;
                    switch (currentItem) {
                        case "reset":
                            this.resetZoomButton(index);
                            break;
                        case "pan":
                            this.panButton(index);
                            break;
                        case "zoom":
                        case "zoomIn":
                        case "zoomOut":
                            this.zoomButton(index, currentItem);
                            break;
                        default:
                            length = length - 1;
                            break;
                    }
                }
            }
        },
        chartMouseWheel: function (e) {
            $("#" + this.svgObject.id + "_TrackToolTip").hide(); // fixed tooltip mouse wheel issue
            $(document).find('[id*="TrackGroupToolTipTemplate"]').remove();
            $(document).find('[id*="_TrackToolTipTemplate_"]').remove();
            $(this.svgObject).find('[id*="_trackSymbol_"]').remove();
            if (this.model.zooming.enableMouseWheel && this.model.AreaType == "cartesianaxes" && !this.model.enable3D && !this.vmlRendering && ej.util.isNullOrUndefined(this.model.isLazyZooming)) {
                var chart = this;
                var chartZoomed;
                this.zoomed = false;
                var canUpdate = false;
                var id = "#" + chart.svgObject.id;
                var matched = jQuery.uaMatch(navigator.userAgent);
                var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
                var wheelDelta = e.originalEvent.wheelDelta;
                var direction = matched.browser.toLowerCase() == "mozilla" ? ((isIE11 ? ((wheelDelta / 120) > 0 ? 1 : -1) : -(e.originalEvent.detail) / 3 > 0 ? 1 : -1)) : ((wheelDelta / 120) > 0 ? 1 : -1);
                for (var i = 0; i < this.model._axes.length; i++) {
                    var axis = this.model._axes[i];
                    if ((axis.orientation.toLowerCase() == "vertical" && (chart.model.zooming.type.toLowerCase() == "y" || chart.model.zooming.type.trim().toLowerCase() == "x,y")) || (axis.orientation.toLowerCase() == "horizontal" && (chart.model.zooming.type.toLowerCase() == "x" || chart.model.zooming.type.trim().toLowerCase() == "x,y"))) {

                        var currentScale = Math.max(1 / ej.EjSvgRender.utils._minMax(axis.zoomFactor, 0, 1), 1);
                        var cumulativeScale = Math.max(currentScale + (0.25 * direction), 1);
                        canUpdate = canUpdate | chart.doMouseWheelZoom(cumulativeScale, 0.5, axis);
                    }
                    if (axis.zoomFactor != 1 && axis.zoomPosition != 0)
                        chartZoomed = true;
                }
                this._updateScroll();
                this.disableAnimation();

                this.disableTrackBall();
                if (canUpdate) {
                    this.model.legendCollapsed = false;
                    this.zoomed = true;
                    chart.redraw(true);
                }
                this.model._chartAreaZoom = true;
                this._enableZoomingButtons();
                this.mouseWheelCoords = { x: e.originalEvent.pageX, y: e.originalEvent.pageY };
                if (!chartZoomed) {
                    $(id + '_ResetZoom').remove();
                    $(id + '_PanBtn').remove();
                    $(id + '_ZoomBtn').remove();
                    $(id + '_ZoomInBtn').remove();
                    $(id + '_ZoomOutBtn').remove();
                    this.enableAnimation();
                    this.panning = false;
                }
                var matched = jQuery.uaMatch(navigator.userAgent);
                if (e.preventDefault && matched.browser == 'chrome' && this.model.zooming.enable)
                    e.preventDefault();
                e.returnValue = false;
            }

            $(".tooltipDiv" + this._id).remove();

        },

        getAxisMultiLevelLabelsData: function (evt) {
            var mouseMoveCords = this.calMousePosition(evt),
                grpLabelsLength = this.model.multiLevelLabelRegions.length,
                ele, x, y, height, width, i;
            this.mousemoveX = mouseMoveCords.X;
            this.mousemoveY = mouseMoveCords.Y;
            for (i = 0; i < grpLabelsLength; i++) {
                ele = this.model.multiLevelLabelRegions[i];
                x = ele.bounds.x;
                y = ele.bounds.y;
                height = ele.bounds.height;
                width = ele.bounds.width;
                if ((this.mousemoveX >= x) && (this.mousemoveX <= x + width) && (this.mousemoveY <= y + height) && (this.mousemoveY >= y)) {
                    data = { location: { x: this.mousemoveX, y: this.mousemoveY }, axis: this.model._axes[ele.axisIndex], multiLevelLabel: ele.multiLevelLabel };
                    return data;
                }
            }
        },

        getAxisLabelData: function (evt) {

            var mouseMoveCords = this.calMousePosition(evt),
                targetid = evt.target.id,
                region,
                x,
                y,
                width,
                height,
                data,
                labelsLength,
                axisVisible,
                axesLength = this.model._axes.length;
            this.mousemoveX = mouseMoveCords.X;
            this.mousemoveY = mouseMoveCords.Y;
            if (this.model.AreaType == 'cartesianaxes' || this.model.AreaType == 'polaraxes') {
                if (!this.model.enable3D) {
                    for (var j = 0; j < axesLength; j++) {
                        labelsLength = this.model._axes[j].visibleLabels.length;
                        axisVisible = this.model._axes[j].visible;
                        if (axisVisible)
                            for (var k = 0; k < labelsLength; k++) {

                                region = this.model._axes[j].visibleLabels[k].region;
                                if (!ej.util.isNullOrUndefined(region)) {
                                    x = region.bounds.x;
                                    y = region.bounds.y;
                                    width = region.bounds.width;
                                    height = region.bounds.height;
                                    x = (this.vmlRendering && (targetid.indexOf("_YLabel_") >= 0)) ? (this.model._axes[j].opposedPosition) ? x : x + width : x;
                                    if ((this.mousemoveX >= x) && (this.mousemoveX <= x + width)) {
                                        if ((this.vmlRendering) ? ((this.mousemoveY <= y + height) && (this.mousemoveY >= y)) : (this.mousemoveY >= y - height) && (this.mousemoveY <= y)) {
                                            data = { location: { x: this.mousemoveX, y: this.mousemoveY }, index: k, axis: this.model._axes[j], text: region.labelText };
                                            return data;
                                        }
                                    }
                                }

                            }
                    }
                }
                else {
                    if (targetid.indexOf("horizontal") >= 0 || targetid.indexOf("vertical") >= 0) {
                        for (var j = 0; j < axesLength; j++) {
                            labelsLength = this.model._axes[j].visibleLabels.length;
                            for (var k = 0; k < labelsLength; k++) {

                                if (targetid == this.svgObject.id + this.model._axes[j].orientation + k) {
                                    data = { location: { x: this.mousemoveX, y: this.mousemoveY }, index: k, axis: this.model._axes[j], text: this.model._axes[j].visibleLabels[k].Text };
                                    return data;

                                }
                            }
                        }
                    }
                }
            }
        },
        getLegendData: function (evt) {
            var mouseMoveCords = this.calMousePosition(evt);
            var vScrollerWidth = 18;
            var isRTL = this.model.legend.isReversed;           
            mouseMoveCords.X = isRTL && ($("#legend_" + this._id).find('[class*="e-vscrollbar"]').length || $("#legend_" + this._id)[0].style.overflowY == "scroll") ? mouseMoveCords.X - vScrollerWidth : mouseMoveCords.X;
            mouseMoveCords.X -= parseFloat($(this.element).css("padding-left"));
            mouseMoveCords.Y -= parseFloat($(this.element).css("padding-top"));
            var isEjScroll = this.model.legend._ejScroller;
            var scrolltop = 0;
            var scrollleft = 0;
            scrolltop = isEjScroll ? $("#legend_" + this._id).ejScroller('instance').model.scrollTop : $("#legend_" + this._id).scrollTop();
            scrollleft = isEjScroll ? $("#legend_" + this._id).ejScroller('instance').model.scrollLeft : $("#legend_" + this._id).scrollLeft();
            if (isRTL && isEjScroll) {
                    if (scrollleft == 0)
                        scrollleft = $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue;
                    else if ($("#legend_" + this._id).ejScroller('instance').model.scrollLeft == $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue)
                        scrollleft = 0;
                    else
                        scrollleft = $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue - $("#legend_" + this._id).ejScroller('instance').model.scrollLeft;         
            }
            this.scrolltop = scrolltop ? scrolltop : 0;
            this.scrollleft = scrollleft ? scrollleft : 0;
            this.mousemoveX = mouseMoveCords.X + scrollleft;
            this.mousemoveY = mouseMoveCords.Y + scrolltop;
            var targetId = evt.target.id;

            {
                var currentX = this.mousemoveX;
                var currentY = this.mousemoveY;
                var chartId = this._id;
                var region;
                if ((!ej.util.isNullOrUndefined(targetId) && this.svgRenderer._getAttrVal($(evt.target).parents(':eq(1)'), 'id') == this.svgObject.id + '_Legend') || (this.model.enableCanvasRendering && targetId == "legend_" + chartId + "_canvas") || (this.vmlRendering)) {
                    $.each(this.model.legendRegion, function (index, regionItem) {

                        if ((currentX >= regionItem.Bounds.LegendBound.X + regionItem.Bounds.ItemBound.X) && (currentX <= regionItem.Bounds.LegendBound.X + regionItem.Bounds.ItemBound.X + regionItem.Bounds.ItemBound._Width)) {
                            if ((currentY >= regionItem.Bounds.LegendBound.Y + regionItem.Bounds.ItemBound.Y - (regionItem.Bounds.ItemBound.Height / 4)) && (currentY <= regionItem.Bounds.LegendBound.Y + regionItem.Bounds.ItemBound.Y + regionItem.Bounds.ItemBound.Height)) {
                                region = regionItem;
                                $("#legend_" + chartId + "_canvas").css("cursor", "pointer");
                            } else
                                $("#legend_" + chartId + "_canvas").css("cursor", "default");
                        }
                    });
                    if (!ej.util.isNullOrUndefined(region)) {
                        return { legendItem: region, series: this.model._visibleSeries[region.LegendItem.SeriesIndex] };
                    }
                }

            }
            return false;
        },

        get3DSeriesPoint: function (evt) {
            var currentX = this.mousemoveX;
            var currentY = this.mousemoveY;
            var x = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.X;
            var y = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.Y;
            var width = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).width() : this.model.m_AreaBounds.Width;
            var height = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).height() : this.model.m_AreaBounds.Height;
            var index, pointIndex, seriesIndex, region;
            if (currentX > x && currentX < (x + width) && currentY > y && currentY < (y + height)) {
                var nodeName = $(evt.target)[0].nodeName;
                if ((nodeName == "path" || nodeName == "shape") && $(evt.target)[0].id.indexOf("Region") > 1) {
                    index = $(evt.target)[0].id.match(/(\d+)/g);
                    pointIndex = parseInt(index[index.length - 1]);
                    seriesIndex = parseInt(index[index.length - 2]);
                    var regionValue = {};
                    regionValue.Region = {};
                    regionValue.Region.PointIndex = pointIndex;
                    regionValue.SeriesIndex = seriesIndex;
                    var pointData = {};
                    pointData.pointIndex = pointIndex;
                    region = { region: regionValue, pointData: pointData, location: { x: currentX, y: currentY } };
                    return region;
                }
            }
        },

        GetSeriesPoint: function (evt) {
            var mouseX;
            var mouseY;
            var currentX = this.mousemoveX;
            var currentY = this.mousemoveY;
            var region, pointIndex;
            var chartObj = this;
            var indicators = chartObj.model.indicators;
            var seriesCollection = chartObj.model._visibleSeries;
            for (var j = 0; j < indicators.length && indicators[j].segment; j++) {
                seriesCollection = seriesCollection.concat(indicators[j].segment);
            }
            if (chartObj.model.enable3D) {
                return this.get3DSeriesPoint(evt);
            }
            var x = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.X;
            var y = (this.model.AreaType == 'polaraxes') ? 0 : this.model.m_AreaBounds.Y;
            var width = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).width() : this.model.m_AreaBounds.Width;
            var height = (this.model.AreaType == 'polaraxes') ? $(this.svgObject).height() : this.model.m_AreaBounds.Height;

            if ((this.model.AreaType == 'cartesianaxes' || this.model.AreaType == 'polaraxes')) {

                if (currentX > x && currentX < (x + width) && currentY > y && currentY < (y + height)) {
                    $.each(this.model.chartRegions, function (index, regionItem) {
                        if (!ej.util.isNullOrUndefined(regionItem.SeriesIndex)) {
                            var currentSer = seriesCollection[regionItem.SeriesIndex];
                            if (chartObj.model.AreaType == "polaraxes" && currentSer.drawType.toLowerCase() == 'column' && evt.target || (currentSer.drawType.toLowerCase() == 'rangecolumn')) {
                                if (chartObj.model.enableCanvasRendering) {
                                    if (currentSer.type.toLowerCase() == "polar") {
                                        var bounds = regionItem.Region.Bounds;
                                        var chartStartAngle = -.5 * Math.PI;
                                        var innerRadius = bounds.innerRadius || bounds.DRadius;
                                        var fromCenterX;
                                        var fromCenterY;
                                        fromCenterX = (currentX) - (bounds.CenterX);
                                        fromCenterY = (currentY) - (bounds.CenterY);
                                        var series = chartObj.model._visibleSeries[regionItem.SeriesIndex];
                                        var startAngle = series.startAngle;
                                        var endAngle = series.endAngle;

                                        var arcAngle = (startAngle) ? 2 * Math.PI * (chartObj.model.itemCurrentXPos < 0 ? 1 + chartObj.model.itemCurrentXPos : chartObj.model.itemCurrentXPos) : 0;
                                        var clickAngle = (Math.atan2(fromCenterY, fromCenterX) - chartStartAngle - arcAngle) % (2 * Math.PI);
                                        if (clickAngle < 0 && bounds.PointIndex != 0) clickAngle = 2 * Math.PI + clickAngle;

                                        var pointStartAngle = parseFloat(bounds.StartAngle.toFixed(14));
                                        var pointEndAngle = parseFloat(bounds.EndAngle.toFixed(14));
                                        pointStartAngle -= arcAngle;
                                        pointEndAngle -= arcAngle;

                                        if (clickAngle >= pointStartAngle && clickAngle <= pointEndAngle) {
                                            index = bounds.PointIndex;
                                            distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2));
                                            if (distanceFromCenter <= bounds.Radius && distanceFromCenter > innerRadius) {
                                                var pointRegion = { Region: { PointIndex: index }, SeriesIndex: regionItem.SeriesIndex, type: regionItem.type };
                                                region = pointRegion;
                                            }
                                        }
                                    } else if (currentSer.type.toLowerCase() == "radar") {
                                        var bounds = regionItem.Region.Bounds;
                                        if (bounds.Line1) {
                                            line1 = bounds.Line1;
                                            line2 = bounds.Line2;
                                            line3 = bounds.Line3;
                                            line4 = bounds.Line4;
                                            var polygon = [
                                                { x: line1.x, y: line1.y },
                                                { x: line2.x, y: line2.y },
                                                { x: line3.x, y: line3.y },
                                            ];
                                            var currentPoint = { x: currentX, y: currentY };
                                            var point = false;
                                            if (currentSer.drawType.toLowerCase() == 'column') {
                                                for (var p = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i)
                                                    ((polygon[i].y <= currentPoint.y && currentPoint.y < polygon[j].y) || (polygon[j].y <= currentPoint.y && currentPoint.y < polygon[i].y))
                                                        && (currentPoint.x < (polygon[j].x - polygon[i].x) * (currentPoint.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)
                                                        && (p = !p);
                                            }
                                            else {
                                                var polygon1 = [
                                                    { x: line1.x, y: line1.y },
                                                    { x: line2.x, y: line2.y },
                                                    { x: line3.x, y: line3.y },
                                                    { x: line4.x, y: line4.y }
                                                ];
                                                var i = 0; j = 2;
                                                for (var p = false, q = 0; q < polygon1.length; q++) {
                                                    ((polygon1[i].y <= currentPoint.y && currentPoint.y < polygon1[j].y) || (polygon1[j].y <= currentPoint.y && currentPoint.y < polygon1[i].y))
                                                        && (currentPoint.x < (polygon1[j].x - polygon1[i].x) * (currentPoint.y - polygon1[i].y) / (polygon1[j].y - polygon1[i].y) + polygon1[i].x)
                                                        && (p = !p);
                                                    var k;
                                                    k = i;
                                                    i = j;
                                                    j = ++k;
                                                    if (q == 2)
                                                        j = 0;
                                                }
                                            }
                                            point = p;
                                            if (point) {
                                                index = bounds.PointIndex;
                                                var pointRegion = { Region: { PointIndex: index }, SeriesIndex: regionItem.SeriesIndex, type: regionItem.type };
                                                region = pointRegion;
                                            }
                                        }
                                    }
                                }
                                else {
                                    var nodeName = $(evt.target)[0].nodeName;
                                    if ((nodeName == "path" || nodeName == "shape") && $($(evt.target).parent())[0].id == chartObj.svgObject.id + '_SeriesGroup' + '_' + regionItem.SeriesIndex) {
                                        index = $(evt.target)[0].id.match(/(\d+)/g);
                                        pointIndex = parseInt(index[index.length - 1]);
                                        regionItem = { Region: { PointIndex: pointIndex }, SeriesIndex: regionItem.SeriesIndex, type: regionItem.type };
                                        region = regionItem;
                                        return false;
                                    }
                                }
                            }
                            else {
                                if ((((currentX >= regionItem.Region.Bounds.X) && (currentX <= (regionItem.Region.Bounds.X + (regionItem.Region.Bounds.Width))))) && ((currentY > regionItem.Region.Bounds.Y) && (currentY < (regionItem.Region.Bounds.Y) + (regionItem.Region.Bounds.Height)))) {
                                    region = regionItem;
                                }
                            }
                        }
                        else {
                            regionValue = chartObj.model.chartRegions;
                            var pointData = {};
                            var areaValue;
                            if (!regionItem.isStripLine) {
                                var regionLength = regionItem.length;
                                var requireInvertedAxes = chartObj.model.requireInvertedAxes;
                                var axisName = (!requireInvertedAxes) ? chartObj.model.series[regionItem[regionLength - 1].SeriesIndex]._yAxisName : chartObj.model.series[regionItem[regionLength - 1].SeriesIndex]._xAxisName;
                                for (var k = 0; k < chartObj.model._axes.length; k++) {
                                    if (axisName == chartObj.model._axes[k].name) {
                                        areaValue = chartObj.model._axes[k];
                                        break;
                                    }
                                }
                                for (var i = 0; i < regionValue.length; i++) {
                                    for (var j = 0; j < regionValue[i].length; j++) {
                                        var polygon = [],
                                            line1 = regionValue[i][j].region;
                                        if (line1[0]) polygon.push({ x: line1[0].X + areaValue.x, y: line1[0].Y + areaValue.y });
                                        if (line1[1]) polygon.push({ x: line1[1].X + areaValue.x, y: line1[1].Y + areaValue.y });
                                        if (line1[2]) polygon.push({ x: line1[2].X + areaValue.x, y: line1[2].Y + areaValue.y });
                                        if (line1[3]) polygon.push({ x: line1[3].X + areaValue.x, y: line1[3].Y + areaValue.y });

                                        var currentPoint = { x: currentX, y: currentY };
                                        var point = chartObj.isPointInPolygon(polygon, currentPoint);
                                        if (point)
                                            region = regionValue[i][j];
                                    }

                                }
                            }
                        }
                    });
                }
                if (region) {
                    return { region: region, location: { x: currentX, y: currentY } };
                }
            }

            else {
                var chartObj = this;
                var distanceFromCenter;
                var regionValue;
                var chartRegions = chartObj.model.chartRegions;
                if (chartRegions.length > 0 && (chartRegions[0].Series.type.toLowerCase() == "pyramid" || chartRegions[0].Series.type.toLowerCase() == "funnel")) {
                    var nodeName = $(evt.target)[0].nodeName;
                    if ((nodeName == "path" || nodeName == "shape") && $($(evt.target).parent())[0].id == chartObj.svgObject.id + '_SeriesGroup' + '_' + chartRegions[0].SeriesIndex) {
                        regionValue = chartObj.model.chartRegions[0];
                        index = $(evt.target)[0].id.match(/(\d+)/g);
                        index = parseInt(index[index.length - 1]);
                        regionValue.Region.PointIndex = index;
                        var pointData = {};
                        pointData.pointIndex = index;
                        region = { region: regionValue, pointData: pointData, location: { x: currentX, y: currentY } };
                        return region;
                    }
                    else {
                        regionValue = chartRegions[0];
                        var pyrX = this.pyrX;
                        var pyrY = this.pyrY;
                        var pointData = {};
                        var polygon, line1, line2, line3, line4, line5, line6;
                        for (var j = 0; j < regionValue.Region.length; j++) {
                            line1 = regionValue.Region[j].Line1;
                            line2 = regionValue.Region[j].Line2;
                            line3 = regionValue.Region[j].Line3;
                            line4 = regionValue.Region[j].Line4;
                            if (chartRegions[0].Series.type.toLowerCase() == "pyramid")
                                polygon = [
                                    { x: line1.x + pyrX, y: line1.y + pyrY },
                                    { x: line2.x + pyrX, y: line2.y + pyrY },
                                    { x: line3.x + pyrX, y: line3.y + pyrY },
                                    { x: line4.x + pyrX, y: line4.y + pyrY }
                                ];
                            else {
                                line5 = regionValue.Region[j].Line5;
                                line6 = regionValue.Region[j].Line6;
                                polygon = [
                                    { x: line1.x + pyrX, y: line1.y + pyrY },
                                    { x: line2.x + pyrX, y: line2.y + pyrY },
                                    { x: line3.x + pyrX, y: line3.y + pyrY },
                                    { x: line4.x + pyrX, y: line4.y + pyrY },
                                    { x: line5.x + pyrX, y: line5.y + pyrY },
                                    { x: line6.x + pyrX, y: line6.y + pyrY }
                                ];
                            }

                            var currentPoint = { x: currentX, y: currentY };
                            var point = this.isPointInPolygon(polygon, currentPoint);
                            if (point) {
                                pointData.pointIndex = regionValue.Region[j].PointIndex;
                                regionValue.Region.PointIndex = pointData.pointIndex;
                                region = { region: regionValue, pointData: pointData, location: { x: currentX, y: currentY } };
                                return region;
                            }

                        }
                    }
                }

                else {
                    // ReSharper disable DuplicatingLocalDeclaration
                    $.each(chartObj.model.chartRegions, function (regionIndex, regionValue) {
                        // ReSharper restore DuplicatingLocalDeclaration
                        var chartStartAngle = -.5 * Math.PI;
                        var seriesData = regionValue.SeriesData,
                            regionData = regionValue.Region,
                            innerRadius = (chartObj.model._visibleSeries[regionValue.SeriesIndex].type.toLowerCase() == 'doughnut') ? seriesData.DRadius : 0;
                        var fromCenterX;
                        var fromCenterY;
                        fromCenterX = (currentX) - (seriesData.CenterX);
                        fromCenterY = (currentY) - (seriesData.CenterY);
                        var series = chartObj.model._visibleSeries[regionValue.SeriesIndex];
                        var startAngle = series.startAngle;
                        var endAngle = series.endAngle;
                        startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
                        endAngle = endAngle < 0 ? endAngle + 360 : endAngle;
                        var totalDegree = (series.endAngle - series.startAngle);
                        //Anticlockwise pie and doughnut
                        if (totalDegree < 0) {
                            endAngle = endAngle / 360;
                            var arcAngle = (endAngle) ? 2 * Math.PI * (endAngle < 0 ? 1 + endAngle : endAngle) : 0;
                            var clickAngle = (Math.atan2(fromCenterY, fromCenterX) - chartStartAngle - arcAngle) % (2 * Math.PI);;
                            if (clickAngle < 0) clickAngle = 2 * Math.PI + clickAngle;

                            pointData = [];
                            for (var i = 0; i < regionData.length; i++) {
                                var pointStartAngle = parseFloat(regionData[i].StartAngle.toFixed(14));
                                var pointEndAngle = parseFloat(regionData[i].EndAngle.toFixed(14));
                                pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                                pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                                pointStartAngle -= arcAngle;
                                pointEndAngle -= arcAngle;
                                pointStartAngle = parseFloat(pointStartAngle.toFixed(14));
                                pointEndAngle = parseFloat(pointEndAngle.toFixed(14));
                                if (series.startAngle >= 0 && series.endAngle <= 0) {
                                    pointStartAngle = pointStartAngle <= 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                                    pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                                }
                                if (clickAngle <= pointStartAngle && clickAngle >= pointEndAngle) {
                                    pointData.push(regionData[i]);
                                    break;
                                }
                            }
                        }  //Clockwise pie,pieofpie and doughnut
                        else {
                            var arcAngle = (startAngle) ? 2 * Math.PI * (chartObj.model.itemCurrentXPos < 0 ? 1 + chartObj.model.itemCurrentXPos : chartObj.model.itemCurrentXPos) : 0;
                            var clickAngle = (Math.atan2(fromCenterY, fromCenterX) - chartStartAngle - arcAngle) % (2 * Math.PI);
                            if (clickAngle < 0) clickAngle = chartObj.model._isPieOfPie ? clickAngle : 2 * Math.PI + clickAngle;
                            pointData = [];
                            for (var i = 0; i < regionData.length; i++) {
                                var pointStartAngle = parseFloat(regionData[i].StartAngle.toFixed(14));
                                var pointEndAngle = parseFloat(regionData[i].EndAngle.toFixed(14));
                                pointStartAngle = pointStartAngle < 0 ? (chartObj.model._isPieOfPie ? pointStartAngle : 2 * Math.PI + pointStartAngle) : pointStartAngle;
                                pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                                pointStartAngle -= arcAngle;
                                pointEndAngle -= arcAngle;
                                pointStartAngle = parseFloat(pointStartAngle.toFixed(14));
                                pointEndAngle = parseFloat(pointEndAngle.toFixed(14));
                                if (series.startAngle < 0 && (series.endAngle > -1 || series.endAngle == null)) {
                                    pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                                    pointEndAngle = pointEndAngle <= 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                                }
                                if (clickAngle + 2 * Math.PI < pointEndAngle && series.type == "pieofpie")
                                    clickAngle = clickAngle + 2 * Math.PI;
                                if (clickAngle >= pointStartAngle && clickAngle <= pointEndAngle) {
                                    pointData.push(regionData[i]);
                                    break;
                                }
                            }
                        }
                        if (pointData.length > 0) {
                            var isExploded = (series.explodeAll || (series.explodeIndex == pointData[0].PointIndex));
                            if (isExploded) {

                                var fromCenterX1 = currentX - pointData[0].StartX;
                                var fromCenterY1 = currentY - pointData[0].StartY;

                                if (pointData.length > 0) {

                                    distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX1), 2) + Math.pow(Math.abs(fromCenterY1), 2));
                                    if (distanceFromCenter <= seriesData.Radius && distanceFromCenter > innerRadius) {
                                        regionData.PointIndex = pointData[0].PointIndex;
                                        regionData.Index = pointData[0].Index;
                                        regionData.SeriesIndex = pointData[0].SeriesIndex;
                                        region = { region: regionValue, pointData: pointData, location: { x: currentX, y: currentY } };
                                    }
                                }
                            }
                            else {
                                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2));
                                if (distanceFromCenter <= seriesData.Radius && distanceFromCenter > innerRadius) {
                                    regionData.PointIndex = pointData[0].PointIndex;
                                    regionData.Index = pointData[0].Index;
                                    regionData.SeriesIndex = pointData[0].SeriesIndex;
                                    region = { region: regionValue, pointData: pointData, location: { x: currentX, y: currentY } };
                                }
                            }
                        }

                    });

                    return region;
                }
            }
        },
        isPointInPolygon: function (polygon, point) {
            for (var p = false, i = -1, l = polygon.length, j = l - 1; ++i < l; j = i)
                ((polygon[i].y <= point.y && point.y < polygon[j].y) || (polygon[j].y <= point.y && point.y < polygon[i].y))
                    && (point.x < (polygon[j].x - polygon[i].x) * (point.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)
                    && (p = !p);
            return p;
        },
        mousePosition: function (evt) {
            if (!ej.util.isNullOrUndefined(evt.pageX) && evt.pageX > 0)
                return { x: evt.pageX, y: evt.pageY };
            else if (evt.originalEvent && !ej.util.isNullOrUndefined(evt.originalEvent.pageX) && evt.originalEvent.pageX > 0)
                return { x: evt.originalEvent.pageX, y: evt.originalEvent.pageY };
            else if (evt.originalEvent && evt.originalEvent.changedTouches != undefined) {
                if (!ej.util.isNullOrUndefined(evt.originalEvent.changedTouches[0].pageX) && evt.originalEvent.changedTouches[0].pageX > 0)
                    return { x: evt.originalEvent.changedTouches[0].pageX, y: evt.originalEvent.changedTouches[0].pageY };
            }
            else
                return { x: 0, y: 0 };

        },


        calMousePosition: function (e) {
            var matched = jQuery.uaMatch(navigator.userAgent);
            var mouseposition = this.mousePosition(e);
            e.pageX = mouseposition.x;
            e.pageY = mouseposition.y;
            var mouseX, mouseY;
            var browser = matched.browser.toLowerCase();
            mouseX = (e.pageX) - $(this.svgObject).offset().left;
            mouseY = (e.pageY) - $(this.svgObject).offset().top;


            return { X: mouseX, Y: mouseY };

        },

        calTouchPosition: function (e) {
            var matched = jQuery.uaMatch(navigator.userAgent);
            var mouseX, mouseY;

            if (matched.browser.toLowerCase() == "mozilla" || matched.browser.toLowerCase() == "webkit") {
                var touch = e.originalEvent.touches[0];
                mouseX = (touch.pageX) - $(this.svgObject).parent().offset().left;
                mouseY = (touch.pageY) - $(this.svgObject).parent().offset().top;
                this.leftPadding = $(this.svgObject).offset().left;
                this.grabPadding = 0;
            } else if (matched.browser.toLowerCase() == "msie") {

                mouseX = (e.originalEvent.pageX) - $(this.svgObject).offset().left;
                mouseY = (e.originalEvent.pageY) - $(this.svgObject).offset().top;
                this.leftPadding = $(this.svgObject).offset().left;
            }
            else {
                var touch = e.originalEvent.touches[0];
                mouseX = (touch.pageX) - $(this.svgObject).offset().left;
                mouseY = (touch.pageY) - $(this.svgObject).offset().top;
                this.leftPadding = $(this.svgObject).offset().left;
            }

            return { X: mouseX, Y: mouseY };

        },

        cancelEvent: function (e) {
            e.stopPropagation();
            var matched = jQuery.uaMatch(navigator.userAgent);
            if (matched.browser == 'chrome' && (this.model.zooming.enable || this.model.crosshair.visible)) {
                e.preventDefault();
            }
            if (this.model.enable3D) {
                e.preventDefault();
                e.stopPropagation();
            }
            e.returnValue = false;
            e.cancelBubble = true;
            return false;
        },
        resetZoom: function () {
            var chartobj = this;
            var id = "#" + this.svgObject.id;
            $(".tooltipDiv" + this._id).remove(); //To remove tooltip template
            $(".zoom" + this._id).remove();
            if (chartobj.zoomed) {
                $.each(this.model._axes, function (index, axis) {
                    axis.zoomed = false;
                    axis.zoomFactor = 1;
                    axis.zoomPosition = 0;
                });
                //Reset primary axis zoomFactor and zoomPosition
                chartobj.model.primaryXAxis.zoomFactor = 1;
                chartobj.model.primaryYAxis.zoomFactor = 1;
                chartobj.model.primaryXAxis.zoomPosition = 0;
                chartobj.model.primaryYAxis.zoomPosition = 0;
                $("#" + chartobj._id + "_canvas").css({ "cursor": "default" });
                $(id + "_ResetZoom").remove();
                $(id + "_PanBtn").remove();
                $(id + "_ZoomBtn").remove();
                $(id + "_ZoomInBtn").remove();
                $(id + "_ZoomOutBtn").remove();
                chartobj.zoomed = false;
                chartobj.zooming = false;
                chartobj.panning = false;
                chartobj.model._chartAreaZoom = false;
                chartobj.resetZooming = true;
                chartobj.enableTrackBall();
                //No need for data update during reset zoom
                chartobj.redraw(true);
                chartobj.enableAnimation();
                chartobj.svgRenderer._setAttr($(chartobj.svgObject).find(id + "_XAxis," + id + "_ChartArea," + id + "_YAxis," + id + "_SeriesCollection"), { "cursor": "default" });
            }
        },
        startZoomInOut: function (currentEle) {
            var currentItem = currentEle.target.id.indexOf("ZoomIn") > -1 ? "zoomIn" : "zoomOut";
            this.drag = false;
            this.zoomed = true;
            var type = this.model.zooming.type.toLowerCase();
            var zoomValue = currentItem == "zoomIn" ? 0.2 : -0.2;
            var zoomedOut = true;
            var axis, previousZoomFactor, previousZoomPosition;
            for (var k = 0; k < this.model._axes.length; k++) {
                axis = this.model._axes[k];
                previousZoomFactor = axis.zoomFactor;
                previousZoomPosition = axis.zoomPosition;
                if (axis.orientation.toLowerCase() == "horizontal") {
                    axis.zoomFactor = type != "y" ? previousZoomFactor - zoomValue : axis.zoomFactor;
                    axis.zoomPosition = type != "y" ? previousZoomPosition + zoomValue : axis.zoomPosition;
                } else {
                    axis.zoomFactor = type != "x" ? previousZoomFactor - zoomValue : axis.zoomFactor;
                    axis.zoomPosition = type != "x" ? previousZoomPosition + zoomValue : axis.zoomPosition;
                }
                if (parseFloat(axis.zoomFactor.toFixed(3)) <= 0.001) {
                    axis.zoomFactor = previousZoomFactor;
                    axis.zoomPosition = previousZoomPosition;
                }
                if (parseFloat(axis.zoomFactor.toFixed(3)) >= 1) {
                    axis.zoomFactor = 1;
                    axis.zoomPosition = 0;
                }
                zoomedOut = zoomedOut && (axis.zoomFactor == 1);
            }
            selectedData = this._getZoomedData(this);
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = {};
            commonEventArgs.data.series = selectedData;
            this._trigger("zoomed", commonEventArgs);
            this._updateScroll();
            this.redraw(true);
            if (zoomedOut) {
                this._removeZoomkit();
                this.resetZooming = true;
                this.zoomed = this.panning = false;
                this.model._chartAreaZoom = false
            }
            else
                this._enableZoomingButtons();
        },
        startZoom: function () {
            var chartObj = this;
            var id = "#" + this.svgObject.id;
            $(".tooltipDiv" + this._id).remove(); //To remove tooltip template
            var iconColor = this.model.theme.toLowerCase().indexOf("dark") >= 0 ? "#000000" : " #FFFFFF";
            chartObj.svgRenderer._setAttr($(id + '_ZoomBtn'), { 'selected': 'true' });
            chartObj.svgRenderer._setAttr($(id + '_ZoomPath'), { "fill": "#14B9FF" });
            chartObj.svgRenderer._setAttr($(id + '_ZoomIcon'), { "fill": '#FFFFFF' });
            chartObj.svgRenderer._setAttr($(id + '_PanPath'), { "fill": '#B7B7B7' });
            chartObj.svgRenderer._setAttr($(id + '_panIcon'), { "fill": iconColor });
            $(id + "_ZoomBtn").css({ "border-color": "#14B9FF", "background-color": "#14B9FF" });
            $(id + "_PanBtn").css({ "border-color": "#B7B7B7", "background-color": "#B7B7B7" });
            $("#" + chartObj._id + "_canvas").css({ "cursor": "default" });
            this._cursorToDefault();
            chartObj.panning = false;
            chartObj.enableTrackBall();
        },
        startPan: function () {
            var chartObj = this;
            var id = "#" + this.svgObject.id;
            $(".tooltipDiv" + this._id).remove(); //To remove tooltip template
            var iconColor = this.model.theme.toLowerCase().indexOf("dark") >= 0 ? "#000000" : " #FFFFFF";
            chartObj.svgRenderer._setAttr($(id + '_ZoomBtn'), { 'selected': 'false' });
            chartObj.svgRenderer._setAttr($(id + '_PanBtn'), { 'selected': 'true' });
            chartObj.svgRenderer._setAttr($(id + '_ZoomPath'), { "fill": "#B7B7B7" });
            chartObj.svgRenderer._setAttr($(id + '_ZoomIcon'), { "fill": iconColor });
            chartObj.svgRenderer._setAttr($(id + '_PanPath'), { "fill": '#14B9FF' });
            chartObj.svgRenderer._setAttr($(id + '_panIcon'), { "fill": '#FFFFFF' });
            $(id + "_ZoomBtn").css({ "border-color": "#B7B7B7", "background-color": "#B7B7B7" });
            $(id + "_PanBtn").css({ "border-color": "#14B9FF", "background-color": "#14B9FF" });
            $("#" + chartObj._id + "_canvas").css({ "cursor": "pointer" });
            this._cursorToPointer();
            chartObj.panning = true;
            chartObj.disableTrackBall();

        },
        zoomButton: function (index, currentItem) {
            if (currentItem == "zoom")
                var currentItemId = "_Zoom";
            else if (currentItem == "zoomIn")
                currentItemId = "_ZoomIn";
            else
                currentItemId = "_ZoomOut";

            var padding = index * 5 + 5, chartOffset = { left: 0, top: 0 };
            var transX = this.model.m_AreaBounds.X + (this.model.m_AreaBounds.Width - (index * 32) - padding); //32 path bouding box for pan,reset, zoom button 
            var transY = (this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height) + (this.model.elementSpacing - (this.model.m_AreaBounds.Height));
            var iconColor = this.model.theme.toLowerCase().indexOf("dark") >= 0 ? "#000000" : " #FFFFFF";

            var pathOptions = {
                'id': this.svgObject.id + currentItemId + 'Path',
                'd': "M32,27c0,2.75-2.25,5-5,5H5c-2.75,0-5-2.25-5-5V5c0-2.75,2.25-5,5-5h22c2.75,0,5,2.25,5,5V27z",
                'fill': this.panning || currentItem == "zoomIn" || currentItem == "zoomOut" ? '#b7b7b7' : '#14B9FF',
                'zoomId': this._id + currentItemId + "Btn",
                'width': 26,
                'height': 26,
                'left': transX + chartOffset.left,
                'top': transY + chartOffset.top,
                'iconColor': iconColor
            };

            ej.EjCanvasRender.prototype.zoomButton(pathOptions, currentItem, this);
            if (currentItem == "zoom")
                this._on($("#" + this.svgObject.id + currentItemId + "Btn"), "touchstart click", this.startZoom);
            else
                this._on($("#" + this.svgObject.id + currentItemId + "Btn"), "touchstart click", this.startZoomInOut);
        },
        panButton: function (index) {
            var padding = index * 5 + 5, chartOffset = { left: 0, top: 0 };
            var transX = this.model.m_AreaBounds.X + (this.model.m_AreaBounds.Width - (index * 32) - padding); //32 path bounding box for pan and resetzoom button
            var transY = (this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height) + (this.model.elementSpacing - (this.model.m_AreaBounds.Height));
            var iconColor = this.model.theme.toLowerCase().indexOf("dark") >= 0 ? "#000000" : " #FFFFFF";

            var pathOptions = {
                'id': this.svgObject.id + '_PanPath',
                'd': "M 32 27 c 0 2.75 -2.25 5 -5 5 H 5 c -2.75 0 -5 -2.25 -5 -5 V 5 c 0 -2.75 2.25 -5 5 -5 h 22 c 2.75 0 5 2.25 5 5 V 27 Z",
                'fill': !this.panning ? '#b7b7b7' : '#14B9FF',
                'panId': this._id + '_PanBtn',
                'width': 26,
                'height': 26,
                'left': transX + chartOffset.left,
                'top': transY + chartOffset.top,
                'iconColor': iconColor
            };
            ej.EjCanvasRender.prototype.panButton(pathOptions, this);
            this._on($("#" + this.svgObject.id + '_PanBtn'), "touchstart click", this.startPan);
        },
        resetZoomButton: function (index) {
            var padding = index * 5 + 5, chartOffset = { left: 0, top: 0 };
            var transX = this.model.m_AreaBounds.X + (this.model.m_AreaBounds.Width - (index * 32 + padding)); //32 path bouding box
            var transY = (this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height) + (this.model.elementSpacing - (this.model.m_AreaBounds.Height));
            var iconColor = this.model.theme.toLowerCase().indexOf("dark") >= 0 ? "#000000" : " #FFFFFF";
            var options = {
                'id': this.svgObject.id + '_ResetZoomPath',
                'd': "M 32 27 c 0 2.75 -2.25 5 -5 5 H 5 c -2.75 0 -5 -2.25 -5 -5 V 5 c 0 -2.75 2.25 -5 5 -5 h 22 c 2.75 0 5 2.25 5 5 V 27 Z",
                'fill': '#b7b7b7',
                'resetZoomId': this._id + '_ResetZoom',
                'width': 26,
                'height': 26,
                'left': transX + chartOffset.left,
                'top': transY + chartOffset.top,
                'iconColor': iconColor
            };
            ej.EjCanvasRender.prototype.resetZoom(options, this);
            var events = (window.TouchEvent ? "touchstart" : (window.PointerEvent ? "pointerdown" : (window.MSPointerEvent ? "MSPointerDown" : "click"))) + " click";
            this._on($("#" + this.svgObject.id + '_ResetZoom'), events, this.resetZoom);
        },

        doZoom: function (zoomRect, zoomRectWidth, zoomRectHeight) {
            var chart = this;
            this.model._chartAreaZoom = true;
            this.scrollDraw = true;
            $(".tooltipDiv" + this._id).remove(); //To remove tooltip template
            if (chart.model.enableCanvasRendering) {
                var zoomArea = $("#" + this.svgObject.id + "_ZoomArea")[0].getClientRects()[0];
                var chartArea = $("#" + this.svgObject.id)[0].getClientRects()[0];
                var zoomX = zoomArea.left - chartArea.left - $(document).scrollLeft();
                var zoomY = zoomArea.top - chartArea.top - $(document).scrollTop();
            } else {
                var zoomX = parseFloat(chart.svgRenderer._getAttrVal($(zoomRect), "x"));
                var zoomY = parseFloat(chart.svgRenderer._getAttrVal($(zoomRect), "y"));
            }
            $("#" + this.svgObject.id + "_ZoomArea").remove();
            this.drag = false;
            this.zoomed = true;
            for (var k = 0; k < this.model._axes.length; k++) {
                var axis = this.model._axes[k];
                var previousZoomFactor = axis.zoomFactor;
                var previousZoomPosition = axis.zoomPosition;
                if (axis.orientation.toLowerCase() == "horizontal") {
                    axis.zoomFactor = chart.model.zooming.type.toLowerCase() != "y"
                        ? previousZoomFactor * (zoomRectWidth / (chart.model.m_AreaBounds.Width)) : axis.zoomFactor;
                    axis.zoomPosition = chart.model.zooming.type.toLowerCase() != "y"
                        ? previousZoomPosition + Math.abs((zoomX - chart.model.m_AreaBounds.X) / (chart.model.m_AreaBounds.Width)) * previousZoomFactor : axis.zoomPosition;
                    if (parseFloat(axis.zoomFactor.toFixed(3)) <= 0.001) {
                        axis.zoomFactor = previousZoomFactor;
                        axis.zoomPosition = previousZoomPosition;

                    }
                } else {
                    axis.zoomFactor = chart.model.zooming.type.toLowerCase() != "x"
                        ? previousZoomFactor * zoomRectHeight / chart.model.m_AreaBounds.Height : axis.zoomFactor;
                    axis.zoomPosition = chart.model.zooming.type.toLowerCase() != "x"
                        ? previousZoomPosition + (1 - Math.abs((zoomRectHeight + (zoomY - chart.model.m_AreaBounds.Y)) / (chart.model.m_AreaBounds.Height))) * previousZoomFactor : axis.zoomPosition;
                    if (parseFloat(axis.zoomFactor.toFixed(3)) <= 0.001) {
                        axis.zoomFactor = previousZoomFactor;
                        axis.zoomPosition = previousZoomPosition;

                    }
                }
            }

            //Getting zoomed region data when zoomedData event fired                    
            selectedData = this._getZoomedData(chart);
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = {};
            commonEventArgs.data.series = selectedData;
            this._trigger("zoomed", commonEventArgs);

            this.disableAnimation();
            this.model.legendCollapsed = false;
            this.redraw(true);

            this._enableZoomingButtons();
        },
        _getZoomedData: function (chart) {
            //Getting zoomed region data when zoomedData event fired                    
            var series = this.model._visibleSeries;
            var seriesLength = series.length;
            var zoomedData = [];
            var selectedData = [];
            var points = [];
            var type;
            var axisValueType;
            var xVisibleRange;
            var yVisibleRange;
            var pointsLength;
            for (var j = 0; j < seriesLength; j++) {
                if (series[j].visibility == "visible") {
                    points = series[j].points;
                    pointsLength = points.length;
                    type = series[j].type.toLowerCase();
                    axisValueType = new ej.axisTypes[series[j].xAxis._valueType.toLowerCase()]();
                    axisValueType._calculateVisibleRange(series[j].xAxis, chart);
                    axisValueType = new ej.axisTypes[series[j].yAxis._valueType.toLowerCase()]();
                    axisValueType._calculateVisibleRange(series[j].yAxis, chart);
                    xVisibleRange = series[j].xAxis.visibleRange;
                    yVisibleRange = series[j].yAxis.visibleRange;
                    for (var k = 0; k < pointsLength; k++) {
                        if ((xVisibleRange.min <= points[k].xValue && xVisibleRange.max >= points[k].xValue) && (yVisibleRange.min <= points[k].y && yVisibleRange.max >= points[k].y)) {
                            if (series[j]._hiloTypes) {
                                if (type == "rangearea" || type == "rangecolumn" || type == "waterfall" || type == "hilo")
                                    zoomedData.push({ XValue: points[k].x, High: points[k].high, Low: points[k].low });
                                else
                                    zoomedData.push({ XValue: points[k].x, High: points[k].high, Low: points[k].low, Open: points[k].open, Close: points[k].close });
                            }
                            else
                                zoomedData.push({ XValue: points[k].x, YValue: points[k].y });
                        }
                    }
                }
                if (zoomedData.length != 0)
                    selectedData.push({ selectedData: zoomedData });
                zoomedData = [];
            }
            return selectedData;
        },
        _cursorToDefault: function () {
            var id = "#" + this.svgObject.id;
            this.svgRenderer._setAttr($(this.svgObject).find(id + "_XAxis," + id + "_ChartArea," + id + "_YAxis," + id + "_SeriesCollection," + id + "_StriplineBehind," + id + '_StriplineOver'), { "cursor": "default" });
        },
        _cursorToPointer: function () {
            var id = "#" + this.svgObject.id;
            this.svgRenderer._setAttr($(this.svgObject).find(id + "_XAxis," + id + "_ChartArea," + id + "_YAxis," + id + "_SeriesCollection," + id + "_StriplineBehind," + id + '_StriplineOver'), { "cursor": "pointer" });
        },
        //to remove the select region on redraw
        removeMultiRect: function () {
            $(this.parentgEle).empty();
            this.model.selectedDataCollection = [];
        },
        multiSelectDataCalculation: function () {
            var chart = this, selectedData = [], selectedRectIndex = this.selectedRectIndex,
                rectX = this.oldRectX[selectedRectIndex],
                rectY = this.oldRectY[selectedRectIndex],
                rectWidth = this.oldRectWidth[selectedRectIndex],
                rectHeight = this.oldRectHeight[selectedRectIndex],
                selectFactor = 1,
                selectPosition = 0,
                seriesCollection = this.model.series,
                seriesCollectionLength = seriesCollection.length,
                axes = this.multiAxis,
                axesLength = axes.length,
                multiSelectType = this.multiSelectType,
                axis, previousSelectFactor, previousSelectPosition,
                xMin, xMax, yMin, yMax,
                visiblePoints, type, baseRange,
                start, end, isEmpty, xOriginalVisibleRange, yOriginalVisibleRange,
                areaType = this.model.AreaType.toLowerCase(),
                xValue, y, isInversed, stackYValue,
                isTransposed, selectionSettings, series;
            for (var i = 0; i < seriesCollectionLength; i++) {
                series = seriesCollection[i];
                xOriginalVisibleRange = series.xAxis.visibleRange;
                yOriginalVisibleRange = series.yAxis.visibleRange;
                var xAxisName = axes.some((function (val) {
                    return val.name.toLowerCase() == series._xAxisName.toLowerCase();
                }));
                var yAxisName = axes.some((function (val) {
                    return val.name.toLowerCase() == series._yAxisName.toLowerCase();
                }));

                selectionSettings = series.selectionSettings;
                if ((xAxisName && yAxisName) && series.visibility.toLowerCase() == 'visible') {
                    for (var k = 0; k < axesLength; k++) {
                        axis = axes[k];
                        previousSelectFactor = selectFactor;
                        previousSelectPosition = selectPosition;
                        if (axis.orientation.toLowerCase() == "horizontal") {
                            this.selectFactor = selectionSettings.rangeType.toLowerCase() != "y"
                                ? previousSelectFactor * (rectWidth / (this.multiAxis[k].width)) : selectFactor;
                            this.selectPosition = selectionSettings.rangeType.toLowerCase() != "y"
                                ? previousSelectPosition + Math.abs((rectX - this.multiAxis[k].x) / (this.multiAxis[k].width)) * previousSelectFactor : selectPosition;
                            if (parseFloat(selectFactor.toFixed(3)) <= 0.001) {
                                this.selectFactor = previousSelectFactor;
                                this.selectPosition = previousSelectPosition;
                            }
                        }
                        else {
                            this.selectFactor = selectionSettings.rangeType.toLowerCase() != "x"
                                ? previousSelectFactor * rectHeight / this.multiAxis[k].height : selectFactor;
                            this.selectPosition = selectionSettings.rangeType.toLowerCase() != "x"
                                ? previousSelectPosition + (1 - Math.abs((rectHeight + (rectY - this.multiAxis[k].y)) / (this.multiAxis[k].height))) * previousSelectFactor : selectPosition;
                            if (parseFloat(selectFactor.toFixed(3)) <= 0.001) {
                                this.selectFactor = previousSelectFactor;
                                this.selectPosition = previousSelectPosition;
                            }
                        }
                        axis.visibleRange = $.extend(true, {}, axis.actualRange);
                        if (this.selectFactor < 1 || this.selectPosition > 0) {
                            if (axis.valueType == "logarithmic") baseRange = axis.visibleRange;
                            else baseRange = axis.actualRange;
                            this.selectFactor = this.selectFactor > 1 ? 1 : (this.selectFactor < 0 ? 0 : this.selectFactor);
                            this.selectPosition = this.selectPosition < 0 ? 0 : (this.selectPosition > 1 ? 1 : this.selectPosition);
                            if (axis.isInversed) {
                                start = axis.actualRange.max - this.selectPosition * axis.actualRange.delta;
                                end = start - this.selectFactor * axis.actualRange.delta;
                                isInversed = true;
                            }
                            else {
                                start = axis.actualRange.min + this.selectPosition * axis.actualRange.delta;
                                end = start + this.selectFactor * axis.actualRange.delta;
                            }
                            if (start < baseRange.min) {
                                end = end + (baseRange.min - start);
                                start = baseRange.min;
                            }
                            if (end > baseRange.max) {
                                start = start - (end - baseRange.max);
                                end = baseRange.max;
                            }
                            if (axis.valueType == "logarithmic") {
                                start = Math.pow(10, start);
                                end = Math.pow(10, end);
                            }
                            axis.visibleRange.min = Math.min(start, end);
                            axis.visibleRange.max = Math.max(start, end);
                        }
                    }
                    visiblePoints = series._visiblePoints;
                    type = series.type.toLowerCase(), isTransposed = series.isTransposed;
                    xMin = series.xAxis.visibleRange.min; xMax = series.xAxis.visibleRange.max;
                    yMin = series.yAxis.visibleRange.min; yMax = series.yAxis.visibleRange.max;
                    if (ej.util.isNullOrUndefined(selectedData)) selectedData = [];
                    if (series.selectionSettings.enable) {
                        switch (multiSelectType) {
                            case 'x':
                                for (var k = 0; k < visiblePoints.length; k++) {
                                    visiblePoints[k].seriesIndex = i;
                                    isEmpty = visiblePoints[k].isEmpty;
                                    xValue = visiblePoints[k].xValue;
                                    y = visiblePoints[k].y;
                                    if (series.xAxis.isInversed || series.yAxis.isInversed) {
                                        if (type.indexOf('bar') >= 0) {
                                            if (type.indexOf('stacking') >= 0) {
                                                stackYValue = series.stackedValue.EndValues[k];
                                                if (!isEmpty && yMax >= stackYValue && yMin <= stackYValue)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                            else {
                                                if (type == 'waterfall' && !isEmpty && yMax >= visiblePoints[k].YValues[0] && yMin <= visiblePoints[k].YValues[0])
                                                    selectedData.push(visiblePoints[k]);
                                                else if (!isEmpty && yMax >= y && yMin <= y)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                        }
                                        else {
                                            if (!isEmpty && xMax >= xValue && xMin <= xValue)
                                                selectedData.push(visiblePoints[k]);
                                        }
                                    }
                                    else {
                                        if (isTransposed && (type.indexOf('bar') >= 0)) {
                                            if (!isEmpty && xMin <= xValue && xMax >= xValue)
                                                selectedData.push(visiblePoints[k]);
                                        }
                                        else if ((type.indexOf('bar') >= 0) || ((series.isTransposed) && (!(type.indexOf('bar') >= 0)))) {
                                            if (type.indexOf('stacking') >= 0) {
                                                stackYValue = series.stackedValue.EndValues[k];
                                                if (!isEmpty && yMin <= stackYValue && yMax >= stackYValue)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                            else {
                                                if (type == 'waterfall' && !isEmpty && yMin <= visiblePoints[k].YValues[0] && yMax >= visiblePoints[k].YValues[0])
                                                    selectedData.push(visiblePoints[k]);
                                                else if (!isEmpty && yMin <= y && yMax >= y)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                        }
                                        else {
                                            if (!isEmpty && Math.round(xMin) <= xValue && xMax >= xValue)
                                                selectedData.push(visiblePoints[k]);
                                        }
                                    }
                                }
                                break;
                            case 'y':
                                for (var k = 0; k < visiblePoints.length; k++) {
                                    visiblePoints[k].seriesIndex = i;
                                    isEmpty = visiblePoints[k].isEmpty;
                                    xValue = visiblePoints[k].xValue;
                                    y = visiblePoints[k].y;
                                    if (series.xAxis.isInversed || series.yAxis.isInversed) {
                                        if (type.indexOf('bar') >= 0) {
                                            if (!isEmpty && xMax >= xValue && xMin <= xValue)
                                                selectedData.push(visiblePoints[k]);
                                        }
                                        else {
                                            if (type.indexOf('stacking') >= 0) {
                                                stackYValue = series.stackedValue.EndValues[k];
                                                if (!isEmpty && yMin <= stackYValue && yMax >= stackYValue)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                            else {
                                                if (type == 'waterfall' && !isEmpty && yMax >= visiblePoints[k].YValues[0] && yMin <= visiblePoints[k].YValues[0])
                                                    selectedData.push(visiblePoints[k]);
                                                else if (!isEmpty && yMax >= y && yMin <= y)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                        }
                                    }
                                    else {
                                        if (isTransposed && (type.indexOf('bar') >= 0)) {
                                            if (type.indexOf('stacking') >= 0) {
                                                stackYValue = series.stackedValue.EndValues[k];
                                                if (!isEmpty && yMin <= stackYValue && yMax >= stackYValue)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                            else {
                                                if (type == 'waterfall' && !isEmpty && yMin <= visiblePoints[k].YValues[0] && yMax >= visiblePoints[k].YValues[0])
                                                    selectedData.push(visiblePoints[k]);
                                                else if (!isEmpty && yMin <= y && yMax >= y)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                        }
                                        else if ((type.indexOf('bar') >= 0) || ((series.isTransposed) && (!(type.indexOf('bar') >= 0)))) {
                                            if (!isEmpty && xMin <= xValue && xMax >= xValue)
                                                selectedData.push(visiblePoints[k]);
                                        }
                                        else {
                                            if (type.indexOf('stacking') >= 0) {
                                                stackYValue = series.stackedValue.EndValues[k];
                                                if (!isEmpty && yMin <= stackYValue && yMax >= stackYValue)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                            else {
                                                if (type == 'waterfall' && !isEmpty && yMin <= visiblePoints[k].YValues[0] && yMax >= visiblePoints[k].YValues[0])
                                                    selectedData.push(visiblePoints[k]);
                                                else if (!isEmpty && yMin <= y && yMax >= y)
                                                    selectedData.push(visiblePoints[k]);
                                            }
                                        }
                                    }
                                }
                                break;
                            case 'xy':
                                for (var k = 0; k < visiblePoints.length; k++) {
                                    visiblePoints[k].seriesIndex = i;
                                    isEmpty = visiblePoints[k].isEmpty;
                                    xValue = visiblePoints[k].xValue;
                                    y = visiblePoints[k].y;
                                    if (type.indexOf('stacking') >= 0) {
                                        stackYValue = series.stackedValue.EndValues[k];
                                        if (!isEmpty && xMax >= xValue && xMin <= xValue && yMin <= stackYValue && yMax >= stackYValue)
                                            selectedData.push(visiblePoints[k]);
                                    }
                                    else {
                                        if (type == 'waterfall' && !isEmpty && xMax >= xValue && xMin <= xValue && yMin <= visiblePoints[k].YValues[0] && yMax >= visiblePoints[k].YValues[0])
                                            selectedData.push(visiblePoints[k]);
                                        else if (!isEmpty && xMax >= xValue && Math.round(xMin) <= xValue && yMin <= y && yMax >= y)
                                            selectedData.push(visiblePoints[k]);
                                    }
                                }
                                break;
                        }
                    }
                }
                series.xAxis.visibleRange = xOriginalVisibleRange;
                series.yAxis.visibleRange = yOriginalVisibleRange;
            }
            var currentIndex = this.currentIndex;
            if (ej.util.isNullOrUndefined(this.model.selectedDataCollection) || $("#" + this.svgObject.id + "_rectSelectionGroup").length == 0)
                this.model.selectedDataCollection = [];
            if (this.removeRect) this.model.selectedDataCollection.splice(currentIndex, 1);
            else if (this.rectPan || this.resize) {
                this.model.selectedDataCollection[currentIndex] = 0;
                this.model.selectedDataCollection[currentIndex] = selectedData;
            }
            else this.model.selectedDataCollection[this.model.selectedDataCollection.length] = selectedData;
            //trigger rangeSelected event to get the selected region's data
            var commonloadEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonloadEventArgs.data = {};
            commonloadEventArgs.data.selectedData = selectedData;
            commonloadEventArgs.data.selectedDataCollection = this.model.selectedDataCollection;
            this._trigger("rangeSelected", commonloadEventArgs);
        },
        multiSelectMouseUp: function (evt) {
            if (this._isMultiSelect && (this.multiSelectMode == 'range')) {
                var selectRectWidth, selectRectHeight, selectRectX, selectRectY, cx, cy, index,
                    containerSvg = this.svgObject.id, selectedRectIndex = this.selectedRectIndex,
                    selectRectId = "#" + containerSvg + "_selectRect",
                    selectRectWidth = parseInt($(selectRectId + selectedRectIndex).attr("width")),
                    selectRectHeight = parseInt($(selectRectId + selectedRectIndex).attr("height")),
                    selectRectX = parseInt($(selectRectId + selectedRectIndex).attr("x")),
                    selectRectY = parseInt($(selectRectId + selectedRectIndex).attr("y"));
                if ((this.multiSelectDraw || !this.removeRect || !this.resize || !this.rectPan) && (selectRectWidth > 0 && selectRectHeight > 0)) {
                    var rightRectOptions = {
                        'id': containerSvg + '_resize_rightRect' + selectedRectIndex,
                        'x': selectRectX + selectRectWidth - 5,
                        'y': selectRectY + 10,
                        'width': 10,
                        'height': selectRectHeight - 20 > 0 ? selectRectHeight - 20 : 0,
                        'fill': "transparent",
                        'stroke': "transparent",
                        'stroke-width': 2,
                        'cursor': 'e-resize'
                    };
                    this.svgRenderer.drawRect(rightRectOptions, this.gEle);
                    var bottomRectOptions = {
                        'id': containerSvg + '_resize_bottomRect' + selectedRectIndex,
                        'x': selectRectX,
                        'y': selectRectY + selectRectHeight - 5,
                        'width': selectRectWidth - 10 > 0 ? selectRectWidth - 10 : 0,
                        'height': 10,
                        'fill': "transparent",
                        'stroke': "transparent",
                        'stroke-width': 2,
                        'cursor': 's-resize'
                    };
                    this.svgRenderer.drawRect(bottomRectOptions, this.gEle);
                    var leftRectOptions = {
                        'id': containerSvg + '_resize_leftRect' + selectedRectIndex,
                        'x': selectRectX - 5,
                        'y': selectRectY,
                        'width': 10,
                        'height': selectRectHeight,
                        'fill': "transparent",
                        'stroke': "transparent",
                        'stroke-width': 2,
                        'cursor': 'w-resize'
                    };
                    this.svgRenderer.drawRect(leftRectOptions, this.gEle);
                    var topRectOptions = {
                        'id': containerSvg + '_resize_topRect' + selectedRectIndex,
                        'x': selectRectX,
                        'y': selectRectY - 5,
                        'width': selectRectWidth - 10 > 0 ? selectRectWidth - 10 : 0,
                        'height': 10,
                        'fill': "transparent",
                        'stroke': "transparent",
                        'stroke-width': 2,
                        'cursor': 'n-resize'
                    };
                    this.svgRenderer.drawRect(topRectOptions, this.gEle);
                    var bottomRightCornerCircleOptions = {
                        'id': containerSvg + '_resize_bottomRightCornerCircle' + selectedRectIndex,
                        'cx': selectRectX + selectRectWidth,
                        'cy': selectRectY + selectRectHeight,
                        'r': 10,
                        'fill': "transparent",
                        'stroke': "transparent",
                        'stroke-width': 2,
                        'cursor': 'se-resize'
                    };
                    this.svgRenderer.drawCircle(bottomRightCornerCircleOptions, this.gEle);
                    var topRightCornerCircleOptions = {
                        'id': containerSvg + '_closeTopRightCornerCircle' + selectedRectIndex,
                        'cx': selectRectX + selectRectWidth,
                        'cy': selectRectY,
                        'r': 10,
                        'fill': "white",
                        'stroke': "#2988d6",
                        'stroke-width': 2,
                        'cursor': 'pointer'
                    };
                    this.svgRenderer.drawCircle(topRightCornerCircleOptions, this.gEle);
                    var closingPathOptions = {
                        'id': containerSvg + '_closePath' + selectedRectIndex,
                        'x1': selectRectX + selectRectWidth - 4,
                        'y1': selectRectY - 4,
                        'x2': selectRectX + selectRectWidth + 4,
                        'y2': selectRectY + 4,
                        'stroke': "#2988d6",
                        'stroke-width': 2,
                        'cursor': 'pointer'
                    };
                    this.svgRenderer.drawLine(closingPathOptions, this.gEle);
                    var closingPathOppositeOptions = {
                        'id': containerSvg + '_closePathOpposite' + selectedRectIndex,
                        'x1': selectRectX + selectRectWidth + 4,
                        'y1': selectRectY - 4,
                        'x2': selectRectX + selectRectWidth - 4,
                        'y2': selectRectY + 4,
                        'stroke': "#2988d6",
                        'stroke-width': 2,
                        'cursor': 'pointer'
                    };
                    this.svgRenderer.drawLine(closingPathOppositeOptions, this.gEle);
                    cx = [16, 10, 4, 10, 4, 4];
                    cy = [4, 4, 4, 10, 10, 16];
                    index = ["a", "b", "c", "d", "e", "f"];
                    for (var t = 0; t < 6; t++) {
                        var gripOptions = {
                            'id': containerSvg + '_gripCircle_' + index[t] + selectedRectIndex,
                            'cx': selectRectX + selectRectWidth - cx[t],
                            'cy': selectRectY + selectRectHeight - cy[t],
                            'r': 0.4,
                            'stroke': "#5B5B5B",
                            'stroke-width': 2,
                        }
                        this.svgRenderer.drawCircle(gripOptions, this.gripCollection);
                    }
                    if ((this.gripCollection != null))
                        $(this.gripCollection).appendTo(this.gEle);
                    $("#" + containerSvg + "_gripCollection" + selectedRectIndex).css({ 'visibility': 'hidden' });
                }
                if (ej.util.isNullOrUndefined(this.oldRectX)) {
                    this.oldRectX = []; this.oldRectY = []; this.oldRectWidth = []; this.oldRectHeight = [];
                    this.oldReRightRectX = []; this.oldReTopRectY = []; this.oldReBottomRectY = [];
                }
                this.oldRectX[selectedRectIndex] = parseInt($(selectRectId + selectedRectIndex).attr('x'));
                this.oldRectY[selectedRectIndex] = parseInt($(selectRectId + selectedRectIndex).attr('y'));
                this.oldRectWidth[selectedRectIndex] = parseInt($(selectRectId + selectedRectIndex).attr('width'));
                this.oldRectHeight[selectedRectIndex] = parseInt($(selectRectId + selectedRectIndex).attr('height'));
                this.oldReRightRectX[selectedRectIndex] = parseInt($("#" + containerSvg + "_resize_rightRect" + selectedRectIndex).attr('x'));
                this.oldReTopRectY[selectedRectIndex] = parseInt($("#" + containerSvg + "_resize_topRect" + selectedRectIndex).attr('y'));
                this.oldReBottomRectY[selectedRectIndex] = parseInt($("#" + containerSvg + "_resize_bottomRect" + selectedRectIndex).attr('y'));
                this.oldMultiSelectType = this.multiSelectType;
                if (this.resize || this.rectPan) {
                    //to remove the grip after resizing at the bottom right corner
                    if (this.resize)
                        $("#" + this.svgObject.id + "_gripCollection" + selectedRectIndex).attr({ 'transform': "" });
                    $("#" + containerSvg + "_closeTopRightCornerCircle" + selectedRectIndex).css({ 'display': 'inline' });
                    $("#" + containerSvg + "_closePath" + selectedRectIndex).css({ 'display': 'inline' });
                    $("#" + containerSvg + "_closePathOpposite" + selectedRectIndex).css({ 'display': 'inline' });
                    $("#" + containerSvg + '_resize_rightRect' + selectedRectIndex).css({ 'cursor': 'e-resize' });
                    $("#" + containerSvg + '_resize_leftRect' + selectedRectIndex).css({ 'cursor': 'w-resize' });
                    $("#" + containerSvg + '_resize_bottomRect' + selectedRectIndex).css({ 'cursor': 's-resize' });
                    $("#" + containerSvg + '_resize_topRect' + selectedRectIndex).css({ 'cursor': 'n-resize' });
                }
                this.drag = false;
                if (this.removeRect) {
                    $("#" + containerSvg + "_selectedRectGroup" + selectedRectIndex).remove();
                    if (this.parentgEle.childNodes.length <= 0) $(this.parentgEle).remove();
                }
                if ((this.multiSelectDraw || this.removeRect || this.resize || this.rectPan) && (selectRectWidth > 0 && selectRectHeight > 0)) {
                    this.multiSelectDraw = false;
                    this.multiSelectDataCalculation(evt);
                }
                if (this.resize) this.resize = false;
                if (this.rectPan) this.rectPan = false;
                this.removeRect = false;
                this.enableTrackBall();
            }
        },
        chartMouseUp: function (evt) {
            if (this.isTouch(evt)) {
                this.model.touchCross = false;
                this.chartMouseUpTouch(evt);
            }
            if (!this.currentPageX && this.panning) {
                var mouseDownCords = this.calMousePosition(evt);
                this.currentPageX = mouseDownCords.X;
                this.currentPageY = mouseDownCords.Y;
            }

            var chart = this;
            var model = this.model;
            this.mousedownPointX = this.mousedownPointY = null;
            $("[id*=" + "_PreviewSeries" + "]").remove();
            $("[id*=" + "_Marker" + "]").remove();
            if (chart.dragPoint) {
                var i = this.dragIndex.seriesIndex,
                    chartSeries = model._visibleSeries[i];
                if (!this.model.enableCanvasRendering) {
                    if (this.gPreviewSeriesGroupEle) {
                        $(this.svgObject).find("#" + this.svgObject.id + "_PreviewSeriesGroup_" + i).remove();
                        if (this.gPreviewSeriesGroupEle.childNodes.length > 0)
                            this.gPreviewSeriesGroupEle.removeChild(this.gPreviewSeriesGroupEle.childNodes[0]);
                    }
                }
                var commonDragEventArgs, valAxis, srIndex, ptIndex;
                this.dragPoint = chartSeries.dragPoint = false;
                var draggedPoints = this._getDraggedPoint(chartSeries, this.mousemoveX, this.mousemoveY),
                    xPoint = draggedPoints.X,
                    yPoint = draggedPoints.Y;
                srIndex = chartSeries.data.seriesIndex,
                    ptIndex = chartSeries.data.pointIndex;

                var oldValue = { X: this.commonDragEventArgs.data.oldValue.X, Y: this.commonDragEventArgs.data.oldValue.Y },
                    newValue = { X: xPoint, Y: yPoint };
                commonDragEventArgs = $.extend({}, this.commonDragEventArgs);
                commonDragEventArgs.data = { series: chartSeries, seriesIndex: srIndex, pointIndex: ptIndex, oldValue: oldValue, newValue: newValue };
                this._trigger("dragEnd", commonDragEventArgs);
                chart.commonDragEventArgs = commonDragEventArgs;
                chart._changeDraggingPoints(chartSeries, ptIndex, commonDragEventArgs.data.newValue.X, commonDragEventArgs.data.newValue.Y);
                chartSeries.region = null;
                this.redraw();		// to redraw the chart after changing the points  
            }
            if (this.multiSelectAreaType == 'cartesianaxes' && (!model.zooming.enable) && (!model.enableCanvasRendering))
                this.multiSelectMouseUp(evt);
            var chart = this;
            if (model.zooming.enable && model.AreaType == "cartesianaxes") {
                var zoomRect = $("#" + this.svgObject.id + "_ZoomArea");
                if (zoomRect[0]) {
                    if (model.enableCanvasRendering) {
                        var zoomArea = zoomRect[0].getClientRects()[0];
                        var zoomRectWidth = zoomArea.width;
                        var zoomRectHeight = zoomArea.height;
                    } else {
                        var $zoomRect = $(zoomRect);
                        var zoomRectWidth = parseFloat(this.svgRenderer._getAttrVal($zoomRect, "width"));
                        var zoomRectHeight = parseFloat(this.svgRenderer._getAttrVal($zoomRect, "height"));
                    }
                }
                if (zoomRectWidth > 0 && zoomRectHeight > 0) {
                    chart.doZoom(zoomRect, zoomRectWidth, zoomRectHeight);
                }
                else
                    this.drag = false;
                if (!chart.panning)
                    this.enableTrackBall();
            }
            // Panning is done on mouse up for other devices and when deferredZoom is set to true
            var id = this.svgObject.id;
            var parentId = ej.util.isNullOrUndefined(evt.target.parentNode) ? "" : evt.target.parentNode.id;

            //condition to find the buttons
            if (parentId == id + "_ResetZoom" || parentId == id + '_ZoomBtn' || evt.target.id == id + "_ResetZoom" || evt.target.id == id + '_ZoomBtn') {
                this.panning = false;
                this.model._chartAreaZoom = false;
            }

            //Panning for other devices
            if ((ej.isTouchDevice() || model.zooming.enableDeferredZoom) && this.panning && this.doPan && model.AreaType == "cartesianaxes") {
                var oDelta;
                oDelta = {
                    'x': this.oPreviousCoords.x - this.currentPageX,
                    'y': this.oPreviousCoords.y - this.currentPageY
                };

                this.oPreviousCoords = {
                    'x': this.currentPageX,
                    'y': this.currentPageY
                };
                $.each(model._axes, function (index, axis) {
                    var currentScale = Math.max(1 / ej.EjSvgRender.utils._minMax(axis.zoomFactor, 0, 1), 1);
                    chart.translate(axis, (oDelta.x), (oDelta.y), currentScale);
                });
                this.model.legendCollapsed = false;
                var panEndEventArgs = panStartEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs),
                    $proxy = this;

                panStartEventArgs.data = { model: this.model };
                this._trigger("panStart", panStartEventArgs);

                //setTimeout is necessary to show waiting popup
                window.setTimeout(function () {
                    $proxy.redraw(true, true, evt.target); //to avoid touch event termination in mobiles / deferred pan           
                    $proxy._cursorToPointer();
                    $proxy._enableZoomingButtons();
                    panEndEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    panEndEventArgs.data = { model: $proxy.model };
                    $proxy._trigger("panEnd", panEndEventArgs);
                }, 10);
            }

            if (this.doPan)
                this.doPan = false;

            this.rotateActivate = false;
        },
        multiSelectMouseDown: function (evt) {
            this.multiSelectAreaType = this.model.AreaType.toLowerCase();
            var model = this.model, chartX = model.m_AreaBounds.X, chartWidth = model.m_AreaBounds.Width,
                chartY = model.m_AreaBounds.Y, chartHeight = model.m_AreaBounds.Height, mouseDownCords = this.calMousePosition(evt);
            //to check whether the click is made within the chart area
            if (this.multiSelectAreaType == 'cartesianaxes' && (!model.zooming.enable) && (!model.enableCanvasRendering)
                && mouseDownCords.X >= chartX && mouseDownCords.X < (chartX + chartWidth) && mouseDownCords.Y < (chartY + chartHeight) && mouseDownCords.Y >= chartY) {
                var seriesCollection = this.model.series,
                    seriesCollectionLength = seriesCollection.length,
                    id, mouseDownCords, matchStr,
                    containerSvg = this.svgObject.id,
                    selectMode = seriesCollection.some((function (val) {
                        return val.selectionSettings.mode.toLowerCase() == 'range';
                    }));
                this._isMultiSelect = seriesCollection.some((function (val) {
                    return val.selectionSettings.enable == true && val.selectionSettings.mode.toLowerCase() == "range";
                }));
                if (selectMode) this.multiSelectMode = 'range';
                for (var i = 0; i < seriesCollectionLength; i++) {
                    if ((seriesCollection[i].selectionSettings.enable == true) && (seriesCollection[i].selectionSettings.mode.toLowerCase() == 'range'))
                        this.multiSelectType = seriesCollection[i].selectionSettings.rangeType.toLowerCase();
                }
                if (this._isMultiSelect && this.multiSelectMode == 'range') {
                    this.disableTrackBall();
                    mouseDownCords = this.calMousePosition(evt);
                    this.mouseDownX = mouseDownCords.X;
                    this.mouseDownY = mouseDownCords.Y;
                    this.drag = true;
                    if (($(this.parentgEle).find("g").length < 1))
                        this.selectedRectIndex = 0;
                    else {
                        id = $(this.parentgEle).find("g").last().attr("id");
                        matchStr = containerSvg + "_gripCollection";
                        id = parseInt(id.substr(matchStr.length));
                        this.selectedRectIndex = id + 1;
                    }
                    if ($(this.parentgEle).find("g").length == 0) {
                        this.parentgEle = this.svgRenderer.createGroup({ 'id': containerSvg + '_rectSelectionGroup' });
                    }
                    this.gEle = this.svgRenderer.createGroup({ 'id': containerSvg + '_selectedRectGroup' + this.selectedRectIndex });
                    if ($(this.gripCollection).find("g").length == 0)
                        this.gripCollection = this.svgRenderer.createGroup({ 'id': containerSvg + '_gripCollection' + this.selectedRectIndex });
                    if (evt.target.id.indexOf("resize") >= 0) {
                        id = evt.target.id.split("resize")[1].match(/\d+/)[0];
                        this.selectedRectIndex = eval(id);
                    }
                    if (evt.target.id.indexOf("close") >= 0) {
                        id = evt.target.id.split("close")[1].match(/\d+/)[0];
                        this.selectedRectIndex = eval(id);
                    }
                    if ((evt.target.id.indexOf(this.svgObject.id + "_selectRect") >= 0)) {
                        matchStr = this.svgObject.id + "_selectRect";
                        this.selectedRectIndex = parseInt(evt.target.id.substr(matchStr.length));
                    }
                    this.currentIndex = $(evt.target.parentNode).index();
                    var axes = this.model._axes,
                        axesLength = axes.length, axis,
                        mouseMoveCords = this.calMousePosition(evt),
                        mouseMoveX = mouseMoveCords.X,
                        mouseMoveY = mouseMoveCords.Y;
                    this.multiAxis = []
                    for (var k = 0; k < axesLength; k++) {
                        axis = axes[k];
                        if ((mouseMoveX > axis.Location.X1) && (mouseMoveX < axis.Location.X2))
                            this.multiAxis.push(axis);
                        if ((mouseMoveY < axis.Location.Y1) && (mouseMoveY > axis.Location.Y2))
                            this.multiAxis.push(axis);
                    }
                }
            }
        },
        //Triggers while start dragging column or bar points
        _grab: function (chartSeries, chartObj, srIndex, ptIndex, point) {
            var commonDragEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonDragEventArgs.data = { seriesIndex: srIndex, pointIndex: ptIndex, currentPoint: point };
            chartObj._trigger("dragStart", commonDragEventArgs);
            chartSeries.data = commonDragEventArgs.data;
            this.commonDragEventArgs = commonDragEventArgs;
            this.mousedownPointX = this.mousedownPointY = null;
        },
        _enableDragging: function (chartSeries, seriesIndex, e) {
            var chartObj = this, closestXyPoint, data,
                type = chartSeries.type.toLowerCase(),
                areaType = chartObj.model.AreaType,
                visibility = chartSeries.visibility.toLowerCase();
            if (this.mousedownPointX && this.mousedownPointY && areaType == "cartesianaxes" && !this.model.enable3D && visibility == 'visible' && (type == "line" || type == "spline" || type == "area" ||
                type == "stepline" || type == "steparea" || type == "splinearea" || type == "column" || type == "bar" || type == "bubble" || type == "scatter")) {
                var serY = [], serX = [];
                closestXyPoint = this.getClosesPointXY(serX, serY, chartSeries, this.mousedownPointX, this.mousedownPointY, e);
                this.mousemoveX = this.mousedownPointX;
                this.mousemoveY = this.mousedownPointY;
                data = this.GetSeriesPoint(e);
                if (!ej.util.isNullOrUndefined(closestXyPoint.point)) {
                    this.dragPoint = chartSeries.dragPoint = true;
                    closestXyPoint.seriesIndex = seriesIndex;
                    chartSeries.pointData = closestXyPoint;
                    var point = { xValue: closestXyPoint.point.xValue, yValue: closestXyPoint.point.YValues };
                    chartObj._grab(chartSeries, chartObj, seriesIndex, closestXyPoint.index, point);
                    this.dragIndex = { pointIndex: closestXyPoint.index, seriesIndex: seriesIndex };
                }
                if (!ej.util.isNullOrUndefined(data)) {
                    var region = data.region;
                    if (seriesIndex == region.SeriesIndex) {
                        chartSeries.region = data.region;
                        this.dragPoint = chartSeries.dragPoint = true;
                        var xVal = chartSeries._visiblePoints[region.Region.PointIndex].xValue,
                            yVal = chartSeries._visiblePoints[region.Region.PointIndex].YValues,
                            point = { xValue: xVal, yValue: yVal };
                        chartObj._grab(chartSeries, chartObj, region.SeriesIndex, region.Region.PointIndex, point);
                        this.dragIndex = { pointIndex: region.Region.PointIndex, seriesIndex: region.SeriesIndex };
                    }
                }
            }
        },
        chartMouseDown: function (e) {

            //this.cancelEvent(e);   

            var model = this.model,
                matchStr = this._id + '_scrollbar' + '_',
                parentNodeId = (e.target.parentNode && e.target.parentNode.id) ? e.target.parentNode.id : '',
                selectionIndex = parentNodeId.indexOf(matchStr) > -1 ? parseInt(parentNodeId.substr(matchStr.length)) : NaN,
                isZoom = this.isZoomButtonHovered(e.target),
                axes = model._axes,
                chart = this, id,
                mouseDownCords = this.calMousePosition(e),
                browserInfo = this.model.browserInfo;
            this.mousedownPointX = mouseDownCords.X;
            this.mousedownPointY = mouseDownCords.Y;
            if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
                this.chartRightClick = e.which == 3;
            else if ("button" in e)  // IE, Opera 
                this.chartRightClick = e.button == 2;
            if (!isNaN(selectionIndex) && !ej.util.isNullOrUndefined(selectionIndex))
                axes[selectionIndex].previousRange = $.extend(true, {}, model._axes[selectionIndex].visibleRange);

            this.mousemoveX = this.mouseDownX = mouseDownCords.X;
            this.mousemoveY = this.mouseDownY = mouseDownCords.Y;
            if (this.isTouch(e)) {
                this.model.event = e;
                this.model.touchCross = true;
                //this.cancelEvent(e);  
                if ($.finish)
                    $(this.model.trackerElement).finish();
                else
                    $(this.model.trackerElement).stop(true, true);
                this.model.tapNum = this.model.tapNum || 0;
                if (!isZoom)
                    this.doubleTap(e);
                if (chart.model.crosshair.visible && !isZoom) {
                    var timer = setTimeout(function () {
                        var zoom = $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + '_ZoomArea'),
                            padding = chart.model.elementSpacing / 2,
                            pointer = chart.getEvent(chart.model.event), currX = pointer.pageX,
                            currY = pointer.pageY;
                        if (chart.model.touchCross && !chart.panning && Math.abs(currX - chart.model.cachedX) < padding && Math.abs(currY - chart.model.cachedY) < padding && (zoom.length == 0 || (parseFloat($(zoom).attr("width")) == 0 || parseFloat($(zoom).attr("height")) == 0))) {
                            chart.chartInteractiveBehavior(e);
                            chart.model.crosshairMoved = true;
                            chart.drag = false;
                        }


                    }, 500);

                }

            }

            if (this.model.enable3D && this.model.enableRotation)
                this.rotateActivate = true;

            if (!this.svgRenderer.vmlNamespace) {
                this.oPreviousCoords = {};
                if (e.target.id.indexOf("resize") >= 0) {
                    id = e.target.id.split("resize")[1].match(/\d+/)[0];
                    this.selectedRectIndex = eval(id);
                    this.multiSelectMouseDownId = e.target.id;
                    this.resize = true;
                }
                if (e.target.id.indexOf("close") >= 0) {
                    id = e.target.id.split("close")[1].match(/\d+/)[0];
                    this.selectedRectIndex = eval(id);
                    this.removeRect = true;
                }
                if ((e.target.id.indexOf(this.svgObject.id + "_selectRect") >= 0)) {
                    matchStr = this.svgObject.id + "_selectRect";
                    this.selectedRectIndex = parseInt(e.target.id.substr(matchStr.length));
                }
                if (e.target.id == this.svgObject.id + '_selectRect' + this.selectedRectIndex) {
                    this.rectPan = true;
                    this.PreviousCoords = {
                        'X': e.pageX, 'Y': e.pageY
                    }
                }
                if (!this.isTouch(e))
                    this.multiSelectMouseDown(e);
                var parent = this.svgRenderer._getAttrVal($(e.target).parent(), "id");
                var isZoomToolkit = parent != this.svgObject.id + "_ZoomBtn" && parent != this.svgObject.id + "_ZoomInBtn" && parent != this.svgObject.id + "_ZoomOutBtn" && parent != this.svgObject.id + "_ResetZoom" && parent != this.svgObject.id + "_PanBtn";
                if (isZoomToolkit && this.model.zooming.enable && !this.model.isLazyZooming && !(this.panning) && this.model.AreaType == "cartesianaxes") {

                    if (this.mouseDownX >= this.model.m_AreaBounds.X && this.mouseDownX < (model.m_AreaBounds.X + model.m_AreaBounds.Width) && this.mouseDownY < (model.m_AreaBounds.Y + model.m_AreaBounds.Height) && this.mouseDownY >= model.m_AreaBounds.Y && !this.isTouch(e)) {
                        if (isNaN(selectionIndex) || ej.util.isNullOrUndefined(selectionIndex))
                            this.drag = true;
                        this.disableTrackBall();
                    }


                }
                else if (isZoomToolkit && this.panning || $(e.target)[0].className == "e-hhandle e-box") {
                    var mousePanCords = this.calMousePosition(e);
                    this.mousePanX = mousePanCords.X;
                    this.mousePanY = mousePanCords.Y;
                    if (this.mousePanX >= model.m_AreaBounds.X && this.mousePanX < (model.m_AreaBounds.X + model.m_AreaBounds.Width) && this.mousePanY < (model.m_AreaBounds.Y + model.m_AreaBounds.Height + 18) && this.mousePanY >= model.m_AreaBounds.Y) {
                        this.doPan = true;

                    }
                }
                if (this.rotateActivate || this.doPan)
                    this.oPreviousCoords = {
                        'x': e.pageX,
                        'y': e.pageY
                    };
            }

        },
        chartMouseLeave: function (evt) {

            this.cancelEvent(evt);

            if (!this.isTouch(evt)) {
                // Changes the visibility to hidden

                $("[id*=" + "_TrackSymbol" + "]").remove();

                this._removeHighlight();

                this._removeTrackBall();

                $("#" + this.svgObject.id + "_TrackToolTip").hide();

                $("#" + this._id + "_tooltip").remove();
                if (($(".tooltipDiv" + this._id).hasClass(this.svgObject.id)))
                    $(".tooltipDiv" + this._id).remove();
            }



            // chartMouseLeave event           
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, size: { height: this.model.svgHeight, width: this.model.svgWidth }, id: evt.target.id, pageX: evt.pageX, pageY: evt.pageY };
            this._trigger("chartMouseLeave", commonEventArgs);

        },


        _doClick: function (evt) {
            this.drag = false;
            if (!this.model.crosshairMoved)
                this._removeHighlight();
            if (!this.model.selectedDataPointIndexes)
                this.model.selectedDataPointIndexes = [];
            this.model.clusterPoints = [];
            this.model._isStateChaged = false;
            var seriesIndex, pointIndex, seriesLength, chartSeries, data, pointer = this.getEvent(evt),
                currX = pointer.pageX,
                currY = pointer.pageY,
                padding = 10,
                targetId = evt.target.id,
                svgObjectId = this.svgObject.id,
                seriesCollection = this.model._visibleSeries,
                isZoom = this.isZoomButtonHovered(evt.target),
                targetid = evt.target.id;

            //Set current seriesCollection Selection type for selection state maintains            
            seriesLength = seriesCollection.length;
            var isMultiSelection, mode, commonEventArgs, text, getIndex;
            data = this.GetSeriesPoint(evt);
            if (data) {
                seriesIndex = data.region.SeriesIndex;
                pointIndex = data.region.Region.PointIndex;
            } else {
                //Getting SeriesIndex and PointIndex for Path element type series when marker and dataLabels visible
                if (this.model.selectionEnable) {
                    if (!this.model.enable3D && !(evt.target.id.indexOf('LegendItem') != -1) && this.model.AreaType != 'none') {
                        text = evt.target.id;
                        getIndex = text.match(/(\d+)/g);
                        if (getIndex && (text.indexOf('symbol') != -1 || text.indexOf('Series') != -1) && !(text.indexOf('Text') != -1)) {
                            seriesIndex = parseInt(getIndex[0]);
                            pointIndex = isNaN(parseInt(getIndex[1])) ? 0 : parseInt(getIndex[1]);
                        } else if (getIndex && (text.indexOf('Text') != -1 || text.indexOf('dataLabel') != -1)) {
                            seriesIndex = parseInt(getIndex[0].charAt(1));
                            pointIndex = isNaN(parseInt(getIndex[0].charAt(0))) ? parseInt(getIndex[0].charAt(1)) : parseInt(getIndex[0].charAt(0));
                        }
                    }
                }
            }
            if (!isZoom || this.model.enableCanvasRendering) {
                for (var i = 0; i < this.model._visibleSeries.length; i++) {
                    chartSeries = this.model._visibleSeries[i];
                    var type = chartSeries.type.toLowerCase();
                    if (this.model.AreaType == "cartesianaxes" && chartSeries.visibility.toLowerCase() == 'visible' && type !== "scatter" && type !== "bubble" && type !== "column" && type.indexOf("bar") == -1 && type !== "stackingcolumn" && type !== "stackingcolumn100" && !chartSeries._hiloTypes) {
                        var serY = [];
                        var serX = [];
                        var location = null;
                        var mouseMoveCords = this.calMousePosition(evt);
                        this.mousemoveX = mouseMoveCords.X;
                        this.mousemoveY = mouseMoveCords.Y;
                        var closestXyPoint = this.getClosesPointXY(serX, serY, chartSeries, this.mousemoveX, this.mousemoveY, evt);
                        if (!ej.util.isNullOrUndefined(closestXyPoint.point)) {
                            seriesIndex = i;
                            pointIndex = closestXyPoint.index;
                            var commonPointEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                            commonPointEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, region: { SeriesIndex: i, Region: { PointIndex: closestXyPoint.index } } };
                            this._trigger("pointRegionClick", commonPointEventArgs);
                        }
                    }
                }
                if (data && (!isZoom || this.model.enableCanvasRendering)) {
                    commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                    commonEventArgs.data = data;
                    this._trigger("pointRegionClick", commonEventArgs);
                }
            }

            if (this.model.AreaType == "none" && this.model.enable3D && $(evt.target)[0].nodeName == "path" && (!this.isTouch(evt) || (Math.abs(currX - this.model.cachedX) < padding && Math.abs(currY - this.model.cachedY) < padding))) {
                index = $(evt.target)[0].id.match(/(\d+)/g);
                seriesIndex = parseInt(index[index.length - 2]);
                pointIndex = parseInt(index[index.length - 1]);
                var currentexplodeindex = this.model._visibleSeries[seriesIndex].explodeIndex;
                var actualIndex = this.model._visibleSeries[seriesIndex]._visiblePoints[pointIndex].actualIndex;
                if (currentexplodeindex == actualIndex)
                    this.model._visibleSeries[seriesIndex].explodeIndex = null;
                else
                    this.model._visibleSeries[seriesIndex].explodeIndex = actualIndex;
                if (!this.vmlRendering && !this.model.enableCanvasRendering)
                    var selection = this.selectedStyle(this);
                $(this.svgObject).empty();
                $(this.legendSvgContainer).empty();
                this.draw();
                if (this.model.AreaType == 'none') {
                    this.model._isStateChaged = false;
                    var className, elementsLenth,
                        styleLength = selection.length,
                        pathId = "_Region_Series_" + seriesIndex + "_Point_" + pointIndex,
                        gElement = $(this.svgObject).find('[id$=' + pathId + '],[id*=' + pathId + 'back],[id*=' + pathId + 'front]'),
                        elementsLength = gElement.length;
                    for (var k = 0; k < styleLength; k++) {
                        for (var i = 0; i < elementsLength; i++) {
                            if (selection[k].id == gElement[i].id) {
                                className = selection[k].className;
                                if (className.indexOf('SelectionStyle') < 0 && (className.indexOf('Selection' + name + 'Style') < 0)) {
                                    $("[id=" + gElement[i].id + "]").attr('class', className);
                                }
                            }
                        }
                    }
                    if (selection.pattern)
                        this.svgRenderer.append(selection.pattern, this.svgObject);
                }
                else {
                    $('[id*=' + this.svgObject.id + '_LegendItemShape],[id*=_Region_Series_]').each(function () {
                        $(this).attr('class', '');
                    });
                }
            }
            var legenddata = this.getLegendData(evt);
            if (legenddata) {
                $('#template_group_' + this._id).remove();
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = legenddata;
                this._trigger("legendItemClick", commonEventArgs);
                var seriesIndex = legenddata.legendItem.LegendItem.SeriesIndex;
                // legend selection logic perform here
                if (!this.model.legend.toggleSeriesVisibility && legenddata.series.selectionSettings.enable) {
                    this.model._isStateChaged = false;
                    this.legendSelection(this, legenddata, evt, data);
                }
                if (!commonEventArgs.cancel && this.model.legend.toggleSeriesVisibility) {
                    $('[id*=' + this._id + '_Selection_' + ']').remove();
                    var length = this.model._visibleSeries.length;
                    if (this.model.AreaType != "none" || this.model.AreaType == "none" && type != 'pieofpie' && type != 'pyramid' && type != 'funnel' && length > 1) {
                        var seriesIndex = legenddata.legendItem.LegendItem.SeriesIndex;
                        var trendlineIndex = legenddata.legendItem.LegendItem.TrendLineIndex;
                        if (ej.util.isNullOrUndefined(trendlineIndex)) {
                            legenddata.series.visibility = legenddata.series.visibility.toLowerCase() === 'visible' ? 'hidden' : 'visible';
                            this.model.series[seriesIndex].visibility = legenddata.series.visibility;
                            if (this._notifyArrayChange)
                                this._notifyArrayChange("series[" + seriesIndex + "]visibility", legenddata.series.visibility);
                        } else {
                            var trendlineVisible = legenddata.series.trendlines[trendlineIndex].visibility.toLowerCase();
                            trendlineVisible = trendlineVisible === 'visible' ? 'hidden' : 'visible';
                            this.model.series[seriesIndex].trendlines[trendlineIndex].visibility = trendlineVisible;
                            if (this._notifyArrayChange)
                                this._notifyArrayChange("series[" + seriesIndex + "].trendlines[" + trendlineIndex + "].visibility", trendlineVisible);
                        }
                    }
                    else {
                        if (this.model._isPieOfPie) {
                            var point = this._getPieOfPiePoint(legenddata.legendItem.LegendItem.ActualIndex, legenddata.series, legenddata)._visibility;
                            var pointIndex = legenddata.legendItem.LegendItem.ActualIndex;
                        }
                        else {
                            var point = legenddata.series.visiblePoints[legenddata.legendItem.LegendItem.PointIndex]._visibility;
                            var pointIndex = legenddata.series.visiblePoints[legenddata.legendItem.LegendItem.PointIndex].actualIndex;
                        }
                        legenddata.series.points[pointIndex]._visibility = point === 'visible' ? 'hidden' : 'visible';
                    }
                    if (this.model.enableCanvasRendering) {
                        /** Canvas Chart image is cleared when click the legend item to show/hide the series**/
                        var chartRect = document.getElementById(this._id).getClientRects()[0];
                        this.svgRenderer.ctx.clearRect(0, 0, chartRect.width, chartRect.height);
                        //Canvas series marker element removed
                        $("#" + this._id).find('[id*="canvas_symbol"]').remove();
                    }
                    $(this.svgObject).empty();
                    $(this.legendSvgContainer).empty();
                    for (var j = 0; j < this.model.series.length; j++)
                        this.model.series[j].regionAdded = false;
                    this.model.legendCollapsed = true;
                    this.disableAnimation();
                    this.draw();
                    this.enableAnimation();
                    if (this.model.AreaType != "none" && this.zoomed)
                        this._enableZoomingButtons();
                }
            }

            //axisLabelClick event
            var axisData = this.getAxisLabelData(evt);
            if (axisData) {
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = axisData;
                this._trigger("axisLabelClick", commonEventArgs);

            }

            // multi level labels click event
            var labelData = this.getAxisMultiLevelLabelsData(evt);
            if (labelData) {
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = labelData;
                this._trigger("multiLevelLabelClick", commonEventArgs);
            }

            //annotationClick event
            if (targetid.indexOf("annotation_") >= 0) {
                var len = targetid.lastIndexOf("_");
                var str = targetid.substr(len + 1, targetid.length);
                var index = parseInt(str);
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, contentData: this.model.annotations[index], pageX: evt.pageX, pageY: evt.pageY };
                this._trigger("annotationClick", commonEventArgs);


            }

            //Selection started here
            var isSelectionSetting = !ej.isNullOrUndefined(seriesIndex) ? this.model._visibleSeries[seriesIndex].selectionSettings.enable : false;
            if (!ej.isNullOrUndefined(seriesIndex) && !legenddata && isSelectionSetting && (!this.isTouch(evt) || (!this.model.crosshairMoved && Math.abs(currX - this.model.cachedX) < padding && Math.abs(currY - this.model.cachedY) < padding))) {
                isMultiSelection = seriesCollection[seriesIndex].selectionSettings.type.toLowerCase() == 'multiple' ? true : false;
                mode = seriesCollection[seriesIndex].selectionSettings.mode;
                if (mode.toLowerCase() != 'range')
                    this.segmentSelection(evt, legenddata, seriesIndex, pointIndex, data, seriesCollection);
            }
            this.model.crosshairMoved = false;
            //chartClick event
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, size: { height: this.model.svgHeight, width: this.model.svgWidth }, id: targetid, pageX: evt.pageX, pageY: evt.pageY };
            this._trigger("chartClick", commonEventArgs);

        },

        //Getting targetId when selection state changed by redraw,setmodel
        getTargetId: function (seriesIndex, pointIndex, mode) {
            var getSelectionId,
                type = this.model._visibleSeries[seriesIndex].type.toLowerCase(),
                isAreaType = (type.indexOf("area") != -1 || type.indexOf("line") != -1 || type.indexOf("scatter") != -1 ? true : false) ? true : false;
            if (this.model.enable3D)
                $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + pointIndex + "]").each(function () {
                    getSelectionId = this.id;
                });
            else {
                if (mode != 'series' || this.model.AreaType == 'none')
                    !isAreaType ? $("[id$=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex + "]").each(function () {
                        getSelectionId = this.id;
                    }) : $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex + '_symbol' + "]").each(function () {
                        getSelectionId = this.id;
                    });
                else
                    $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + "]").each(function () {
                        getSelectionId = this.id;
                    });
            }
            return getSelectionId;
        },

        findCanvasSelection: function (seriesIndex, pointIndex, mode) {
            var isSelectionFound;
            if (mode == 'point')
                isSelectionFound = $('#' + this._id + '_Selection_series' + seriesIndex + '_point_' + pointIndex + '_canvas').length;
            else if (mode == 'series')
                isSelectionFound = $('#' + this._id + '_Selection_series' + seriesIndex + '_canvas').length;
            else
                isSelectionFound = $('#' + this._id + '_Selection_Cluster' + '_point_' + pointIndex + '_canvas').length;
            return isSelectionFound == 1 ? true : false;
        },

        //Selection logic started here
        segmentSelection: function (evt, legendData, seriesIndex, pointIndex, data) {
            var seriesCollection = this.model._visibleSeries,
                series = seriesCollection[seriesIndex];

            if (ej.isNullOrUndefined(series)) return 0;
            var selectionSettings = series.selectionSettings,
                isSelectionSettings = selectionSettings.enable,
                isMultiSelection = selectionSettings.type.toLowerCase() == 'multiple' ? true : false,
                mode = selectionSettings.mode,
                isTrackball = false, chart = this,
                targetId, parentNodeId, isSelectionFound, isElement, sIndex, pIndex, data, dataLength, seriesFlag, pointFlag, accPointFlag, clusterFlag, accSeriesClusterFlag, className;
            this.model.isSelected = true;
            //Calculating cluster points
            if (!ej.isNullOrUndefined(pointIndex) && mode == 'cluster') {
                var clusterPoints = [],
                    points, pointsLength,
                    xvalue = seriesCollection[seriesIndex]._visiblePoints[pointIndex].xValue;
                for (var i = 0, len = seriesCollection.length; i < len; i++) {
                    points = seriesCollection[i].points;
                    pointsLength = points.length;
                    for (var j = 0; j < pointsLength; j++)
                        if (xvalue == points[j].xValue && points[j].isEmpty == false && points[j].visible == true)
                            clusterPoints[clusterPoints.length] = { seriesIndex: i, pointIndex: j };
                }
                this.model.clusterPoints = clusterPoints;
            }

            //Get Target and parent node Id's by using seriesIndex and pointIndex
            if (!this.model.enableCanvasRendering) {
                targetId = this.getTargetId(seriesIndex, pointIndex, mode);
                if (targetId) {
                    parentNodeId = $('#' + targetId)[0].parentNode.id;
                    var parentNode = $('#' + parentNodeId)[0];
                    //Checking wether target parent or tracker symbols  present or not
                    if (parentNode != null) {
                        if (parentNodeId) {
                            isElement = (parentNodeId.indexOf(this.svgObject.id + "_TextGroup_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_symbolGroup") >= 0) ? true : false;
                            if (parentNodeId.indexOf(this.svgObject.id + "_TrackSymbol_") >= 0) {
                                isElement = true;
                                isTrackball = true;
                            }
                        }
                    }
                }
            }

            if (this.model.enableCanvasRendering)
                isSelectionFound = this.findCanvasSelection(seriesIndex, pointIndex, mode);
            else {
                className = $("#" + targetId).attr('class') ? $("#" + targetId).attr('class') : '';
                isSelectionFound = className.indexOf('Selection') != -1 ? true : false;
                if (this.model.enable3D) {
                    className = $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + pointIndex + "]").attr('class') ? $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + pointIndex + "]").attr('class') : '';
                    isSelectionFound = className.indexOf('Selection') != -1 ? true : false;
                }
            }
            //Selection Removal Logic 
            if ((isSelectionFound || !isMultiSelection) || isMultiSelection) {
                this.removeSelection(seriesIndex, pointIndex, seriesCollection, mode, isMultiSelection, legendData, isSelectionFound);
                data = this.model.selectedDataPointIndexes;
                dataLength = data.length;
                if (dataLength > 0 && !this.model._isStateChaged) {
                    if (!isMultiSelection) {
                        for (var k = 0; k < dataLength; k++) {
                            sIndex = data[k].seriesIndex;
                            pIndex = data[k].pointIndex;
                            seriesFlag = (mode == 'series' && ((sIndex == seriesIndex && pIndex == pointIndex) || (sIndex != seriesIndex || pIndex != pointIndex)));
                            accPointFlag = ((mode == 'point' || this.model.AreaType == 'none') && (sIndex == seriesIndex && pIndex == pointIndex));
                            clusterFlag = (mode == 'cluster' && (pIndex == pointIndex));
                            if (seriesFlag || accPointFlag || clusterFlag) {
                                data.splice(k, 1); dataLength = data.length; k = -1;
                            }
                        }
                    } else if (isSelectionFound) {
                        for (var k = 0; k < dataLength; k++) {
                            sIndex = data[k].seriesIndex;
                            pIndex = data[k].pointIndex;
                            seriesFlag = (mode == 'series' && (sIndex == seriesIndex));
                            accPointFlag = ((mode == 'point' || this.model.AreaType == 'none') && (sIndex == seriesIndex && pIndex == pointIndex));
                            clusterFlag = (mode == 'cluster' && (pIndex == pointIndex));
                            if (((seriesFlag || clusterFlag) && this.model.AreaType != 'none') || accPointFlag) {
                                data.splice(k, 1); dataLength = data.length; k = -1;
                            }
                        }
                    }
                }
            }
            //Selection Started for 2D,3D,Canvas
            if (!isSelectionFound) {
                this.model.enableCanvasRendering ? this.canvasSelection(this, evt, series, legendData, seriesIndex, pointIndex, data, selectionSettings) : this.selection(chart, evt, series, isTrackball, legendData, seriesIndex, pointIndex, parentNodeId, targetId, data);
                data = this.model.selectedDataPointIndexes;
                dataLength = data.length;
                if (!this.model._isStateChaged) {
                    if (dataLength > 0) {
                        if (!isMultiSelection) {
                            for (var k = 0; k < dataLength; k++) {
                                sIndex = data[k].seriesIndex;
                                pIndex = data[k].pointIndex;
                                accSeriesClusterFlag = ((mode == 'series' || mode == 'cluster' || this.model.AreaType == 'none') && (data[k].SeriesIndex != seriesIndex || data[k].PointIndex != pointIndex));
                                pointFlag = (mode == 'point' && (data[k].SeriesIndex == seriesIndex));
                                if (accSeriesClusterFlag || pointFlag) {
                                    data.splice(k, 1); dataLength = this.model.selectedDataPointIndexes.length; k = -1;
                                }
                            }
                            data.push({ 'legendData': legendData, 'seriesIndex': seriesIndex, 'pointIndex': pointIndex });
                        } else {
                            data.push({ 'legendData': legendData, 'seriesIndex': seriesIndex, 'pointIndex': pointIndex });
                        }
                    } else
                        data.push({ 'legendData': legendData, 'seriesIndex': seriesIndex, 'pointIndex': pointIndex });
                }
            }

            //Getting selected data here
            var selectedData = { selectedData: this.model.selectedDataPointIndexes };
            this._trigger("seriesRegionClick", selectedData);
        },


        //legend Selection logic perform here
        legendSelection: function (chart, legenddata, evt, data) {
            var selectedData = this.model.selectedDataPointIndexes ? this.model.selectedDataPointIndexes : [],
                length = this.model._visibleSeries.length,
                index = (chart.model.AreaType == 'none' && length == 1) ? legenddata.legendItem.LegendItem.PointIndex : legenddata.legendItem.LegendItem.SeriesIndex,
                seriesIndex = legenddata.legendItem.LegendItem.SeriesIndex,
                pointIndex = index,
                legendItem = chart.svgObject.id + '_LegendItemShape' + index,
                legendClass = $('#' + legendItem).attr('class') ? $('#' + legendItem).attr('class') : '';
            if ($('#' + chart._id + '_Selection_Legend' + index + '_canvas').length == 1 || legendClass.indexOf('Selection') != -1) {
                $('#' + chart._id + '_Selection_Legend' + index + '_canvas').remove();
                $("[id*=" + chart._id + '_Selection_series' + index + "]").remove();
                $('#' + this._id + '_Selection_series' + seriesIndex + '_point_' + pointIndex + '_canvas').remove();
                $('#' + legendItem).attr('class', '');
                $("[id*=" + chart.svgObject.id + '_Series' + seriesIndex + "]").attr('class', '');
                $("[id*=" + '_Region_Series_' + seriesIndex + "]").attr('class', '');
                for (var k = 0; k < selectedData.length; k++) {
                    if (selectedData[k].seriesIndex == index || (this.model.AreaType == 'none' && selectedData[k].pointIndex == index)) {
                        selectedData.splice(k, 1); break;
                    }
                }
            }
            else
                chart.segmentSelection(evt, legenddata, seriesIndex, pointIndex, data);
        },

        chartMouseClick: function (evt) {

            this.cancelEvent(evt);
            if (window.navigator.msPointerEnabled) {
                evt = evt.originalEvent;
            }
            this._doClick(evt);
        },
        chartMouseDoubleClick: function (evt) {


            if (window.navigator.msPointerEnabled) {
                evt = evt.originalEvent;
            }
            //chartDoubleClick event
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, size: { height: this.model.svgHeight, width: this.model.svgWidth }, id: evt.target.id, pageX: evt.pageX, pageY: evt.pageY };
            this._trigger("chartDoubleClick", commonEventArgs);

        },
        drawTrackerSymbol: function (series, seriesIndex, ptIndex, tracker, point, id, trackcount) {

            var type = series.type.toLowerCase(), offsetX, offsetY;
            var chartSeriesObj = new ej.seriesTypes[type]();
            var index = series.type.toLowerCase() == "boxandwhisker" ? trackcount : ptIndex;
            var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, this.model.requireInvertedAxes);
            offsetX = !series.isTransposed ? series.xAxis.plotOffset : series.yAxis.plotOffset;
            offsetY = !series.isTransposed ? series.yAxis.plotOffset : series.xAxis.plotOffset;
            var clipRectOptions = {
                'id': this.svgObject.id + '_ClipRectTrack' + '_' + seriesIndex,
                'x': - offsetX,
                'y': - offsetY,
                'width': trans.width + offsetX * 2,
                'height': trans.height + offsetY * 2,
                'fill': 'white',
                'stroke-width': 1,
                'stroke': 'Gray'
            };
            if (this.model.AreaType != "none") {
                if (this.model.AreaType == 'cartesianaxes' && ((point.X + trans.x) <= (trans.x + trans.width)) && ((point.X + trans.x) >= trans.x || point.X == 0) &&
                    ((point.Y + trans.y) >= (trans.y) || point.Y == 0)) {
                    if (this.model.crosshair.visible || type == "bubble" || type == "scatter") {
                        if (!series.trackerRemoved) {
                            var trackId = this.svgObject.id + '_TrackSymbol' + '_' + seriesIndex;
                            trackId = (type == "boxandwhisker") ? trackId + index : trackId;
                            $("#" + this._id).find('[id*=' + trackId + ']').remove();
                            var trackId = "canvas_trackSymbol_" + seriesIndex;
                            trackId = (type == "boxandwhisker") ? trackId + index : trackId;
                            $("#" + this._id).find('[id*=' + trackId + ']').remove();

                        }
                        var transSymbolOptions = { 'clip-path': 'url(#' + this.svgObject.id + '_ClipRectTrack' + '_' + seriesIndex + ')', 'class': 'Tracker', 'id': this.svgObject.id + '_TrackSymbol' + '_' + seriesIndex + '_' + index, 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
                        this.gTrackerEle = this.svgRenderer.createGroup(transSymbolOptions);
                    } else
                        this.gTrackerEle = null; // empty the previously created tracker group if no tracker is drawn now
                }
                else {

                    $('#' + this.svgObject.id + '_TrackSymbol' + '_' + seriesIndex + '_' + index).remove();
                    var transSymbolOptions = { 'id': this.svgObject.id + '_TrackSymbol' + '_' + seriesIndex + '_' + index };
                    this.gTrackerEle = this.svgRenderer.createGroup(transSymbolOptions);
                    if (!this.model.enableCanvasRendering) {
                        if (this.model.AreaType == 'polaraxes')
                            this.gTrackerEle.setAttribute('clip-path', 'url(#' + this.svgObject.id + '_SeriesGroup_' + seriesIndex + '_ClipRect)');
                        else {
                            this.gTrackerEle.setAttribute('clip-path', 'url(#' + this.svgObject.id + '_ClipRectTrack' + '_' + seriesIndex + ')');
                            this.gTrackerEle.setAttribute('transform', 'translate(' + trans.x + ',' + trans.y + ')');
                        }
                    }
                }
                if ($("#" + this.svgObject.id + "_CrosshairGroup").length == 0) {
                    var gTrackballOptions = { 'id': this.svgObject.id + '_CrosshairGroup', 'visibility': 'visible' };
                    this.gTrackball = this.svgRenderer.createGroup(gTrackballOptions);
                    this.svgRenderer.append(this.gTrackball, this.svgObject);
                }
                if (this.model.crosshair.marker.visible && !series.isIndicator && series._visiblePoints[ptIndex].visible) {
                    chartSeriesObj.drawSymbol(seriesIndex, series, ptIndex, (point.X), (point.Y), this, tracker, trackcount);
                    if (point.low)
                        chartSeriesObj.drawSymbol(seriesIndex, series, ptIndex, (this.model.requireInvertedAxes ? point.low : point.X), (this.model.requireInvertedAxes ? point.Y : point.low), this, tracker);
                }
                if (this.gTrackerEle && $("#" + this.gTrackerEle.id).length < 1)
                    this.svgRenderer.append(this.gTrackerEle, this.gTrackball);
            }
            if ($(this.svgObject).find("#" + this.svgObject.id + '_ClipRectTrack' + '_' + seriesIndex).length == 0 && !this.vmlRendering) {
                this.svgRenderer.drawClipPath(clipRectOptions, $("#" + this.svgObject.id + "_CrosshairGroup"));
            }


        },
        getClosesPointXY: function (serX, serY, series, x, y, evt) {
            var closestPoint,
                valAxis = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, this.model.requireInvertedAxes), outlierPosition,
                ptIndex, chartPoint, location, pointIndex, pointVisible, closestX, padding = 10, isTouch = this.isTouch(evt),
                visiblePointsLength = series._visiblePoints ? series._visiblePoints.length : 0, closestY,
                size = series.marker ? $.extend(true, {}, series.marker.size) : { height: 6, width: 6 };
            size.height = (isTouch && size.height < padding * 2) ? size.height + padding : size.height;
            size.width = (isTouch && size.width < padding * 2) ? size.width + padding : size.width;
            if ((y <= (valAxis.y + valAxis.height) && valAxis.y <= y) && (valAxis.x <= x && x <= (valAxis.x + valAxis.width))) {
                for (var i = 0; i < visiblePointsLength; i++) {
                    chartPoint = series._visiblePoints[i];
                    location = chartPoint.location;
                    pointVisible = false;
                    pointIndex = i;
                    closestX = null;
                    closestY = null;

                    if (series.type == "boxandwhisker" && (!this.model.enable3D) && !(ej.util.isNullOrUndefined(chartPoint.boxPlotLocation))) {

                        for (var k = 0; k < chartPoint.boxPlotLocation.length; k++) {
                            var symbolOptions = {
                                X: chartPoint.boxPlotLocation[k].X, Y: chartPoint.boxPlotLocation[k].Y
                            };
                            if (chartPoint.boxPlotLocation[k].outlier == true) {
                                if (x > ((symbolOptions.X + valAxis.x) - size.width) && x < (symbolOptions.X + valAxis.x + size.width)) {
                                    closestX = chartPoint.x;
                                    if (ej.util.isNullOrUndefined(closestX))
                                        pointVisible = chartPoint.visible;
                                    if (y > ((symbolOptions.Y + valAxis.y) - size.height) && y < symbolOptions.Y + valAxis.y + size.height + padding) {
                                        closestY = chartPoint.boxPlotValues.outliers[k];
                                        outlierPosition = { X: symbolOptions.X, Y: symbolOptions.Y };
                                    }
                                    if (!ej.util.isNullOrUndefined(outlierPosition)) {
                                        closestPoint = chartPoint;
                                        ptIndex = i;
                                    }
                                }
                            }

                        }
                    }
                    if (location) {
                        if (x > location.X + valAxis.x - (size.width / 2) && x < location.X + valAxis.x + (size.width / 2)) {
                            closestX = chartPoint.x;
                            if (ej.util.isNullOrUndefined(closestX))
                                pointVisible = chartPoint.visible;
                        }
                        if (y > location.Y + valAxis.y - (size.height / 2) && y < location.Y + valAxis.y + (size.height / 2)) {
                            closestY = chartPoint.YValues[0];
                        }
                        if ((!ej.util.isNullOrUndefined(closestX) || pointVisible) && !ej.util.isNullOrUndefined(closestY)) {
                            closestPoint = chartPoint;
                            ptIndex = i;
                        }
                    }
                }
            }
            return { point: closestPoint, index: ptIndex, outlierPosition: outlierPosition };
        },
        getClosestPointX: function (serX, series, x, y) {
            var closestPoint = [];
            var valAxis = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, this.model.requireInvertedAxes);
            if (this.model.requireInvertedAxes) {
                x = Math.abs(y - (valAxis.y + valAxis.height));
                y = Math.abs(x - valAxis.x);
            }
            else {
                x = Math.abs(x - valAxis.x);
                y = Math.abs(y - (valAxis.y + valAxis.height));
            }
            var mousePoint = ej.EjSvgRender.utils._getValuebyPoint(x, y, series, this.model.requireInvertedAxes);
            var pointX = (this.model.requireInvertedAxes) ? mousePoint.PointX : mousePoint.PointX;
            var ptIndex = [];

            $.each(series.points, function (pointIndex, chartPoint) {
                serX.push(chartPoint.xValue);
            });
            var closest = this.getClosest(serX, pointX);
            if (!ej.util.isNullOrUndefined(closest)) {
                if (typeof closest == 'number') {
                    $.each(series._visiblePoints, function (pointIndex, cPoint) {
                        if (cPoint.xValue == closest) {
                            closestPoint.push(cPoint);
                            ptIndex.push(pointIndex);

                        }
                    });
                } else {
                    closest = closest.getTime();
                    $.each(series._visiblePoints, function (pointIndex, cPoint) {
                        if (typeof cPoint.xValue == "number" ? cPoint.xValue == closest : cPoint.xValue.getTime() == closest) {
                            closestPoint.push(cPoint);
                            ptIndex.push(pointIndex);

                        }
                    });
                }
            }
            return { point: closestPoint, index: ptIndex };
        },
        getClosest: function (obj, val) {
            var closest = null;
            this._beforeMin = false;
            this._afterMax = false;

            // Work out min and max
            var min = Math.min.apply(null, obj);
            var max = Math.max.apply(null, obj);

            // Only calculate closest if point is within array
            if (val >= min - 0.5 && val <= max + 0.5) {
                var i;
                for (i = 0; i < obj.length; i++) {
                    if (closest == null || Math.abs(obj[i] - val) < Math.abs(closest - val)) {
                        closest = obj[i];
                    }
                }
                this._closest = null;
            }
            else {
                if (val > max) {
                    closest = obj[obj.length - 1];
                    this._closest = ej.util.isNullOrUndefined(this._closest) ? closest : (closest > this._closest ? closest : this._closest);
                    this._afterMax = true;
                }
                else {
                    closest = obj[0];
                    this._closest = ej.util.isNullOrUndefined(this._closest) ? closest : (closest < this._closest ? closest : this._closest);
                    this._beforeMin = true;

                }
            }
            return closest;
        },
        createTooltip: function (region, evt, series) {
            if (!series)
                series = this.model._visibleSeries[region.SeriesIndex];
            var seriesPoint = (series.type == "pieofpie") ? this._getPieOfPiePoint(region.Region.PointIndex, series) : (series.type == "pie" || series.type == "doughnut") && !this.model.enable3D ? series._visiblePoints[region.Region.Index] : series._visiblePoints[region.Region.PointIndex];
            var point = (this.dragPoint) ? series.pointCollection[region.Region.PointIndex] : $.extend(true, {}, seriesPoint);
            var tooltipMargin = 10;
            var isRTL = series.tooltip.isReversed;
            if (point.visible !== false) {
                var format = series.tooltip.format;
                if (series.type == "boxandwhisker") {
                    var mouseMoveCords = this.calMousePosition(evt);
                    this.mousemoveX = mouseMoveCords.X;
                    this.mousemoveY = mouseMoveCords.Y;
                    var flag = region.Region.Bounds ? true : false;
                    if (flag) {
                        if (region.Region.Bounds.Width == series.outlierSettings.size.width) {
                            for (var s = 0; s < point.boxPlotLocation.length; s++) {
                                if (point.boxPlotLocation[s].outlier == true) {
                                    if ((point.boxPlotLocation[s].X + (series.outlierSettings.size.width / 2) > (this.mousemoveX - series.xAxis.x)) && (point.boxPlotLocation[s].X - (series.outlierSettings.size.width / 2) < (this.mousemoveX - series.xAxis.x))) {
                                        if ((point.boxPlotLocation[s].Y + (series.outlierSettings.size.height / 2) > (this.mousemoveY - series.yAxis.y)) && (point.boxPlotLocation[s].Y - (series.outlierSettings.size.height / 2) < (this.mousemoveY - series.yAxis.y))) {
                                            var dataPoints = this.getTooltipFormat(point, series, region.SeriesIndex, region.Region.PointIndex, format, point.boxPlotLocation[s]);
                                            point.x = dataPoints.data.x;
                                            point.y = dataPoints.text;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            var dataPoints = this.getTooltipFormat(point, series, region.SeriesIndex, region.Region.PointIndex, format, point.boxPlotLocation[0]);
                            point.x = dataPoints.data.x;
                            point.y = dataPoints.text;
                        }
                    }
                }
                else {
                    var dataPoints = this.getTooltipFormat(point, series, region.SeriesIndex, region.Region.PointIndex, format);
                    point.x = dataPoints.data.x;
                    point.y = dataPoints.data.y;
                }
                var tooltip = null;
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { currentText: tooltip, seriesIndex: region.SeriesIndex, pointIndex: region.Region.PointIndex, series: series };
                this._trigger("toolTipInitialize", commonEventArgs);
                var tooltipdiv = $('.tooltipDiv' + this._id);
                $("#" + this.svgObject.id).find("#" + this.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                $("#" + this.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden').hide();
                if ($('.tooltipDiv' + this._id).length == 0) {
                    this.tooltipFirst = true;
                    tooltipdiv = $("<div></div>").attr('class', 'tooltipDiv' + this._id).css({ 'position': 'absolute', 'z-index': '13000', 'display': 'block' });
                    $(document.body).append(tooltipdiv);
                    $('.tooltipDiv' + this._id).addClass(this.svgObject.id);
                } else {
                    $(".tooltipDiv" + this._id).css("display", "block");
                    this.tooltipFirst = false;
                }
                if (series.tooltip.template != null) {
                    var cloneNode = $("#" + series.tooltip.template).clone();
                    $('.tooltipDiv' + this._id)[0].innerHTML = "";
                    $(cloneNode).css("display", "block").appendTo(tooltipdiv);
                    series.count = 1;
                    point.count = 1;
                    var seriesColor = this.getSeriesColor(point, region.SeriesIndex, series);
                    if (seriesColor)
                        $(tooltipdiv).css("background-color", jQuery.type(seriesColor) == "array" ? seriesColor[0].color : seriesColor);
                    else
                        $(tooltipdiv).css("background-color", this.model.pointColors[region.Region.PointIndex]);
                    var data = { series: series, point: point };
                    if (!ej.util.isNullOrUndefined(commonEventArgs.data.currentText))
                        $(tooltipdiv).html($(cloneNode).html(commonEventArgs.data.currentText));
                    else
                        $(tooltipdiv).html($(tooltipdiv).html().parseTemplate(data));
                } else {
                    $(tooltipdiv).html(commonEventArgs.data.ToolTip);
                }
                var areaBounds = this.model.m_AreaBounds;
                var xPos = evt.pageX + tooltipMargin;
                var yPos = evt.pageY + tooltipMargin;
                var tooltipWidth = $(tooltipdiv).width();
                var tooltipHeight = $(tooltipdiv).height();
                var position = document.getElementById(this.svgObject.id).getClientRects()[0];
                if (xPos === undefined || xPos === null)
                    xPos = evt.pageX + tooltipMargin;
                if (yPos === undefined || yPos === null)
                    yPos = evt.pageY + tooltipMargin;
                var leftPos = xPos;
                var topPos = yPos;
                //Checking top position whether tooltip display outside of the area bounds
                if ((xPos - $(this.svgObject).offset().left + tooltipWidth) > (areaBounds.X + areaBounds.Width)) {
                    var diff = (xPos - (tooltipWidth + (2 * tooltipMargin)));
                    leftPos = diff + $(document).scrollLeft();
                }
                if ((yPos - $(this.svgObject).offset().top + tooltipHeight) > areaBounds.Y + areaBounds.Height) {
                    var diff = (yPos + tooltipHeight) - (areaBounds.Y + areaBounds.Height + position.top)
                    topPos = yPos - diff + $(document).scrollTop();
                }

                $(tooltipdiv).css('left', leftPos);
                $(tooltipdiv).css('top', topPos);

                var tooltipOptions = series.tooltip;
                if (tooltipOptions.enableAnimation) {
                    $(tooltipdiv).css({
                        'transition-property': 'left,top',
                        '-moz-transition-property': 'left,top', /* Firefox 4 */
                        '-webkit-transition-property': 'left,top', /* Safari and Chrome */
                        '-o-transition-property': 'left,top',
                        'transition-duration': tooltipOptions.duration,
                        '-moz-transition-duration': tooltipOptions.duration, /* Firefox 4 */

                        '-webkit-transition-duration': this.tooltipFirst ? '0s' : tooltipOptions.duration, /* Safari and Chrome */
                        '-o-transition-duration': tooltipOptions.duration /* Opera */
                    });
                }
                var templateRect = $(tooltipdiv)[0].getBoundingClientRect();
                if (templateRect.top < areaBounds.Y + position.top)
                    $(tooltipdiv).css('top', areaBounds.Y + position.top + $(document).scrollTop());
                if (isRTL) {
                    $(tooltipdiv).css('left', xPos - (tooltipWidth + (tooltipMargin*2)));
                    if (xPos - (tooltipWidth + (tooltipMargin*2)) < series.xAxis.x)
                        $(tooltipdiv).css('left', xPos);
                }
            }
        },

        translate: function (axis, translateX, translateY, currentScale) {
            var offset = axis.orientation.toLowerCase() == "horizontal"
                ? translateX / axis.width / currentScale
                : translateY / axis.height / currentScale;

            axis.zoomPosition = axis.orientation.toLowerCase() == "horizontal"
                ? ej.EjSvgRender.utils._minMax(axis.zoomPosition + offset, 0, (1 - axis.zoomFactor))
                : ej.EjSvgRender.utils._minMax(axis.zoomPosition - offset, 0, (1 - axis.zoomFactor));
        },
        highlightFill: function (highlight, chart, seriesIndex, pointIndex, legendData) {
            var seriesColors = chart.model.seriesColors;
            var pointColors = chart.model.pointColors;
            var color = highlight.color;
            var length = this.model._visibleSeries.length;
            if (legendData && chart.model.AreaType == 'none') {
                if (length == 1)
                    pointIndex = legendData.legendItem.LegendItem.PointIndex;
                else
                    seriesIndex = legendData.legendItem.LegendItem.SeriesIndex;
            }
            var pointColor = legendData ? seriesColors[seriesIndex] : pointIndex ? chart.model.series[seriesIndex].points[pointIndex] ? chart.model.series[seriesIndex].points[pointIndex].fill : null : null;
            var fill = (color != "" ? color : chart.model.AreaType == 'none' ? pointColors[pointIndex] : legendData ? seriesColors[seriesIndex] : pointColor ? pointColor : seriesColors[seriesIndex]);
            if (Object.prototype.toString.call(fill) === '[object Array]')
                fill = fill[1].color;
            return fill;
        },



        // Canvas highlight and selection started here
        // Canvas highlight started here
        canvasHighlight: function (chart, evt, series, legendData) {

            var highlight = series.highlightSettings;
            var data = series.data;
            var color = highlight.color;
            var opacity = highlight.opacity;
            var borderColor = highlight.border.color;
            var borderWidth = highlight.border.width;
            var patternName = highlight.pattern.toLowerCase();
            var legendVisible = chart.model.legend.visible;
            var mode = highlight.mode;
            var seriesIndex = series.seriesIndex;
            var pointIndex = series.pointIndex;
            var seriesType = series.type.toLowerCase();
            var containerStyle = document.getElementById(chart._id + '_canvas').getBoundingClientRect();
            var regions = [];
            var points = [];
            var clusterPoints = [];
            var length = this.model._visibleSeries.length;
            var fill = this.highlightFill(highlight, chart, seriesIndex, pointIndex, legendData);
            if (chart.model.AreaType != 'none' || (chart.model.AreaType == 'none' && length > 1 && (mode == 'series' || legendData))) {
                for (var i = 0, len = chart.model.chartRegions.length; i < len; i++) {
                    if ((mode == 'series' || legendData) && (seriesIndex == chart.model.chartRegions[i].SeriesIndex))
                        regions.push(chart.model.chartRegions[i].Region);
                }


            } else {
                for (var i = 0, len = chart.model.chartRegions.length; i < len; i++) {
                    if (seriesIndex == chart.model.chartRegions[i].SeriesIndex && pointIndex == chart.model.chartRegions[i].Region.PointIndex)
                        regions.push(chart.model._isPieOfPie ? chart._getPieOfPiePoint(chart.model.chartRegions[i].Region.PointIndex, series) : chart.model.chartRegions[i].Region[pointIndex]);
                }
            }
            if (mode == 'cluster' && chart.model.Areatype != 'none' && typeof pointIndex !== "undefined") {
                var xvalue = chart.model._visibleSeries[seriesIndex]._visiblePoints[pointIndex].xValue;
                for (var i = 0, len = chart.model._visibleSeries.length; i < len; i++) {
                    for (var j = 0; j < chart.model._visibleSeries[i]._visiblePoints.length; j++) {
                        if (xvalue == chart.model._visibleSeries[i]._visiblePoints[j].xValue)
                            clusterPoints[clusterPoints.length] = { seriesIndex: i, pointIndex: j };

                    }
                }
            }
            for (var k = 0; k < clusterPoints.length; k++) {
                clusterseriesIndex = clusterPoints[k].seriesIndex;
                clusterpointIndex = clusterPoints[k].pointIndex;
                for (var l = 0; l < chart.model.chartRegions.length; l++) {
                    if (clusterseriesIndex == chart.model.chartRegions[l].SeriesIndex && clusterpointIndex == chart.model.chartRegions[l].Region.PointIndex)
                        if (mode != "cluster")
                            regions.push(chart.model.chartRegions[l].Region);
                        else
                            regions.push(chart.model.chartRegions[l]);
                }
            }
            var index = (chart.model.AreaType == 'none' && length == 1) ? pointIndex : seriesIndex;
            if ((mode == 'series' || legendData) && ($('#' + chart._id + '_Selection_series' + index + '_canvas').length == 0) && $('#' + chart._id + '_Selection_' + 'Cluster' + '_point_' + pointIndex + '_canvas').length == 0 && $('#' + chart._id + '_Selection_' + seriesIndex + '_point_' + pointIndex + '_canvas').length == 0) {
                points = series._visiblePoints
                ctx = this.createCanvasElement(chart._id + '_Highlight_series' + seriesIndex + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, highlight);
                this.createRect(chart, ctx);
                if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1) {
                    for (i = 0; i < regions.length; i++) {
                        var isUnSelected = $('#' + chart._id + '_Selection_' + seriesIndex + '_point_' + i + '_canvas').length == 0 ? true : false;
                        this.canvasSeriesRect(regions[i], opacity, borderColor, borderWidth, color, isUnSelected, series);
                    }
                }
                else if (seriesType == 'pie' || seriesType == 'doughnut' || seriesType == "pieofpie") {
                    regions = (length == 1) ? regions : regions[0];
                    this.canvasHighlightCircle(chart, highlight, pointIndex, opacity, borderColor, borderWidth, color, regions, seriesType, ctx);
                }
                else if (seriesType == 'pyramid' || seriesType == 'funnel')
                    this.canvasHighlightPyramid(chart, regions[0], highlight, ctx, opacity, borderColor, borderWidth, color, seriesType);
                else if (seriesType == 'bubble')
                    this.canvasBubbleHighlight(highlight, regions, chart, seriesIndex, color, borderWidth, opacity, borderColor);
                else if (seriesType == 'scatter')
                    this.canvasScatterHighlight(regions, color, borderWidth, opacity, borderColor);
            }
            else if (mode == 'cluster' && $('#' + chart._id + '_Selection_' + 'Cluster' + '_point_' + pointIndex + '_canvas').length == 0 && this.model.AreaType != 'none' && $('#' + chart._id + '_Selection_' + seriesIndex + '_point_' + pointIndex + '_canvas').length == 0 && $('#' + chart._id + '_Selection_series' + seriesIndex + '_canvas').length == 0) {
                for (var i = 0, len = this.model._visibleSeries.length; i < len; i++) {
                    var series = this.model._visibleSeries[i];
                    series.seriesIndex = i;
                    points.push(series._visiblePoints[pointIndex]);

                }
                var sbRegion = [], colors = [];// scatter & bubble region calculation
                ctx = this.createCanvasElement(chart._id + '_Highlight_' + '_Cluster' + '_point_' + pointIndex + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                this.createRect(chart, ctx);
                for (var i = 0, len = this.model._visibleSeries.length; i < len; i++) {
                    sbRegion = [];
                    highlight = chart.model._visibleSeries[i].highlightSettings;
                    color = highlight.color;
                    opacity = highlight.opacity;
                    borderColor = highlight.border.color;
                    borderWidth = highlight.border.width;
                    patternName = highlight.pattern.toLowerCase();
                    fill = this.highlightFill(highlight, chart, i, pointIndex, index, legendData);
                    color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, highlight);
                    colors.push(color);
                    for (var r = 0, rlen = regions.length; r < rlen; r++) {
                        if (regions[r].SeriesIndex == i) {
                            sbRegion.push(regions[r].Region);
                        }
                    }
                    if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1) {
                        var isUnSelected = $('#' + chart._id + '_Selection_' + i + '_point_' + pointIndex + '_canvas').length == 0 ? true : false;
                        for (var r = 0, rlen = sbRegion.length; r < rlen; r++) {
                            this.canvasSeriesRect(sbRegion[r], opacity, borderColor, borderWidth, color, isUnSelected, series);
                        }
                    }
                    else if (seriesType == 'bubble') {
                        this.canvasBubbleHighlight(highlight, sbRegion, chart, i, color, borderWidth, opacity, borderColor);
                    }
                    else if (seriesType == 'scatter') {
                        this.canvasScatterHighlight(sbRegion, color, borderWidth, opacity, borderColor);
                    }

                }
            }
            else if ((mode == "cluster" && this.model.AreaType == 'none') || mode == 'point' && $('#' + chart._id + '_Selection_' + seriesIndex + '_point_' + pointIndex + '_canvas').length == 0 && $('#' + chart._id + '_Selection_series' + seriesIndex + '_canvas').length == 0 && $('#' + chart._id + '_Selection_' + 'Cluster' + '_point_' + pointIndex + '_canvas').length == 0) {
                points[0] = this.model._isPieOfPie ? this._getPieOfPiePoint(pointIndex, series) : series._visiblePoints[pointIndex];
                ctx = this.createCanvasElement(chart._id + '_Highlight_' + seriesIndex + '_point_' + pointIndex + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                this.createRect(chart, ctx);
                color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, highlight);
                if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1) {
                    regions = []; regions[0] = data.region.Region;
                    this.canvasSeriesRect(regions[0], opacity, borderColor, borderWidth, color, true, series);
                }
                else if (seriesType == 'pie' || seriesType == 'doughnut' || seriesType == "pieofpie") {
                    regions = []; regions[0] = data.pointData[0];
                    this.canvasHighlightCircle(chart, highlight, pointIndex, opacity, borderColor, borderWidth, color, regions, seriesType, ctx);
                }
                else if (seriesType == 'pyramid' || seriesType == 'funnel') {
                    this.canvasHighlightPyramid(chart, regions[0], highlight, ctx, opacity, borderColor, borderWidth, color, seriesType);
                }
                else if (seriesType == 'bubble') {
                    regions = []; regions[0] = data.region.Region;
                    this.canvasBubbleHighlight(highlight, regions, chart, seriesIndex, color, borderWidth, opacity, borderColor);
                }
                else if (seriesType == 'scatter') {
                    regions = []; regions[0] = data.region.Region;
                    this.canvasScatterHighlight(regions, color, borderWidth, opacity, borderColor);
                }
            }
            // legend highlight (legend symbol)
            if (legendVisible && $('#' + chart._id + '_Selection_Legend' + index + '_canvas').length == 0) {
                if (mode == 'cluster' && !legendData && this.model.AreaType != 'none') {
                    var serIndex;
                    for (var i = 0, len = clusterPoints.length; i < len; i++) {
                        serIndex = clusterPoints[i].seriesIndex;
                        chartSeries = this.model._visibleSeries[serIndex];
                        this.canvasHighlightLegend(chart, chartSeries, highlight, 'Highlight', containerStyle, colors[serIndex]);
                    }
                }
                else
                    this.canvasHighlightLegend(chart, series, highlight, 'Highlight', containerStyle, color);

            }
            if (series.visibility === 'visible' && series.marker.visible == true && this.model.AreaType != 'none')
                this.canvasHighlightMarker(chart, series, points, highlight, ctx, evt, colors);
        },

        // canvas rect operations perform here
        canvasSeriesRect: function (regions, opacity, borderColor, borderWidth, color, isUnSelected, series) {
            var options = {
                'opacity': opacity,
                'stroke': borderColor,
                'stroke-width': borderWidth,
                'fill': color
            }
            var cornerRadius = series.cornerRadius;
            if (regions) {
                options.x = regions.Bounds.X;
                options.y = regions.Bounds.Y;
                options.width = regions.Bounds.Width;
                options.height = regions.Bounds.Height;
                if (isUnSelected)
                    if ((typeof (cornerRadius) != "object" && cornerRadius > 0) || cornerRadius.topLeft > 0 || cornerRadius.bottomLeft > 0
                        || cornerRadius.topRight > 0 || cornerRadius.bottomRight > 0) {
                        var roundrect = ej.EjSvgRender.utils._calculateroundedCorner(cornerRadius, options);
                        options.d = roundrect;
                        ej.EjCanvasRender.prototype.drawPath(options, ctx);
                    }
                    else
                        this.drawRect(options, ctx);
            }
        },

        // // canvas selection logic started here
        canvasSelection: function (chart, evt, series, legendData, seriesIndex, pointIndex, data, selectionSettings) {
            series.seriesIndex = seriesIndex;
            series.pointIndex = pointIndex;
            var seriesCollection = this.model._visibleSeries,
                color = selectionSettings.color,
                opacity = selectionSettings.opacity,
                borderColor = selectionSettings.border.color,
                borderWidth = selectionSettings.border.width,
                patternName = selectionSettings.pattern.toLowerCase(),
                legendVisible = chart.model.legend.visible,
                mode = selectionSettings.mode,
                seriesType = series.type.toLowerCase(),
                containerStyle = document.getElementById(chart._id + '_canvas').getBoundingClientRect(),
                regions = [],
                points = [],
                length = this.model._visibleSeries.length,
                chartRegions = chart.model.chartRegions,
                clusterPoints = this.model.clusterPoints,
                seriesData = { seriesIndex: seriesIndex, series: series },
                index = (chart.model.AreaType == 'none' && length == 1) ? pointIndex : seriesIndex,
                fill = this.highlightFill(selectionSettings, chart, seriesIndex, pointIndex, legendData, data), regionsLength, cRlength;
            regionsLength = chartRegions.length;
            if (chart.model.AreaType != 'none' || (chart.model.AreaType == 'none' && length > 1)) {
                for (var i = 0; i < regionsLength; i++) {
                    if (((mode == 'series' || legendData) && seriesIndex == chartRegions[i].SeriesIndex) || ((mode == 'point' || legendData) && (seriesIndex == chartRegions[i].SeriesIndex && pointIndex == chartRegions[i].Region.PointIndex))) {
                        if (chart.model.AreaType == 'none' && mode == 'point' && !legendData)
                            regions.push(chartRegions[i].Region[pointIndex])
                        else
                            regions.push(chartRegions[i].Region);
                    }
                }
            } else if (regionsLength > 0) {
                if (this.model._isPieOfPie) {
                    if (legendData) {
                        for (var p = 0; p < series.pieCollections.length; p++) {
                            var piePoints = series.pieCollections[p];
                            for (var q = 0; q < piePoints.length; q++) {
                                if (piePoints[q].actualIndex == legendData.legendItem.LegendItem.PointIndex) {
                                    var pieColIndex = p;
                                    break;
                                }
                            }
                        }
                    }
                    var pieSrIndex = series.data ? series.data.pointData[0].PieSeriesIndex : pieColIndex;
                    var chartRegion = chartRegions[pieSrIndex];
                }
                else
                    var chartRegion = chartRegions[0];
                cRlength = chartRegion.Region.length;
                for (var i = 0; i < cRlength; i++) {
                    if (pointIndex == chartRegion.Region[i].PointIndex)
                        regions.push(chartRegion.Region[i]);
                }
            }
            if ((mode == 'series' || legendData) && (this.model.AreaType != 'none' || this.model.AreaType == 'none' && length > 1)) {
                points = series._visiblePoints;
                ctx = this.createCanvasElement(chart._id + '_Selection_series' + index + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, selectionSettings);
                this.createRect(chart, ctx);
                if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1) {
                    for (i = 0; i < regions.length; i++)
                        this.canvasSeriesRect(regions[i], opacity, borderColor, borderWidth, color, true, series);
                }
                else if (seriesType == 'pie' || seriesType == 'doughnut' || seriesType == "pieofpie")
                    this.canvasHighlightCircle(chart, selectionSettings, pointIndex, opacity, borderColor, borderWidth, color, regions[0], seriesType, ctx);
                else if (seriesType == 'bubble')
                    this.canvasBubbleHighlight(selectionSettings, regions, chart, seriesIndex, color, borderWidth, opacity, borderColor);
                else if (seriesType == 'scatter')
                    this.canvasScatterHighlight(regions, color, borderWidth, opacity, borderColor);
            }
            else if (mode == 'cluster' && this.model.AreaType != 'none' && $('#' + chart._id + '_Selection_' + 'Cluster' + '_point_' + pointIndex + '_canvas').length == 0) {
                var clength = clusterPoints.length, clusterseriesIndex, clusterpointIndex, region, rlength;
                for (var k = 0; k < clength; k++) {
                    clusterseriesIndex = clusterPoints[k].seriesIndex;
                    clusterpointIndex = clusterPoints[k].pointIndex;
                    region = $.grep(chartRegions, function (x) { return x.SeriesIndex == clusterseriesIndex && x.Region.PointIndex == clusterpointIndex });
                    rlength = region.length;
                    if (rlength > 0) {
                        regions.push(region[0]);
                        points.push(seriesCollection[region[0].SeriesIndex]._visiblePoints[pointIndex]);
                    } else
                        points.push(seriesCollection[k]._visiblePoints[pointIndex]);
                }
                this.selectedPoint = pointIndex;
                var sbRegion = [], colors = [];
                ctx = this.createCanvasElement(chart._id + '_Selection_' + 'Cluster' + '_point_' + pointIndex + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                this.createRect(chart, ctx);
                for (i = 0, len = seriesCollection.length; i < len; i++) {
                    sbRegion = [];// scatter & bubble region calculation
                    highlight = seriesCollection[i].selectionSettings;
                    color = highlight.color;
                    opacity = highlight.opacity;
                    borderColor = highlight.border.color;
                    borderWidth = highlight.border.width;
                    patternName = highlight.pattern.toLowerCase();
                    fill = this.highlightFill(highlight, chart, i, pointIndex, legendData);
                    color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, highlight);
                    colors.push(color);
                    for (var r = 0, rlen = regions.length; r < rlen; r++) {
                        if (regions[r].SeriesIndex == i) {
                            sbRegion.push(regions[r].Region);
                        }
                    }
                    if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1) {
                        for (var sr = 0, srlen = sbRegion.length; sr < srlen; sr++) {
                            this.canvasSeriesRect(sbRegion[sr], opacity, borderColor, borderWidth, color, true, series);
                        }
                    }
                    else if (seriesType == 'bubble')
                        this.canvasBubbleHighlight(highlight, sbRegion, chart, i, color, borderWidth, opacity, borderColor);
                    else if (seriesType == 'scatter')
                        this.canvasScatterHighlight(sbRegion, color, borderWidth, opacity, borderColor);
                    if (!legendData && this.model.AreaType != 'none' && legendVisible) {
                        series = seriesCollection[i];
                        series.seriesIndex = i;
                        this.canvasHighlightLegend(chart, series, selectionSettings, 'Selection_Cluster', containerStyle, color);
                    }
                }
            }
            else if ((mode == 'point' && $('#' + chart._id + '_Selection_' + seriesIndex + '_point_' + pointIndex + '_canvas').length == 0) || this.model.AreaType == 'none') {
                this.selectedPoint = pointIndex;

                points[0] = this.model._isPieOfPie ? this._getPieOfPiePoint(pointIndex, series) : series._visiblePoints[pointIndex];
                ctx = this.createCanvasElement(chart._id + '_Selection_series' + seriesIndex + '_point_' + pointIndex + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                this.createRect(chart, ctx);
                color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, selectionSettings);
                if (seriesType.indexOf("column") != -1 || seriesType.indexOf("waterfall") != -1 || seriesType.indexOf("bar") != -1)
                    this.canvasSeriesRect(regions[0], opacity, borderColor, borderWidth, color, true, series);
                else if (seriesType == 'pie' || seriesType == 'doughnut' || seriesType == "pieofpie")
                    this.canvasHighlightCircle(chart, selectionSettings, pointIndex, opacity, borderColor, borderWidth, color, regions, seriesType, ctx);
                else if (seriesType == 'pyramid' || seriesType == 'funnel')
                    this.canvasHighlightPyramid(chart, regions[0], selectionSettings, ctx, opacity, borderColor, borderWidth, color, seriesType);
                else if (seriesType == 'bubble')
                    this.canvasBubbleHighlight(selectionSettings, regions, chart, seriesIndex, color, borderWidth, opacity, borderColor);
                else if (seriesType == 'scatter')
                    this.canvasScatterHighlight(regions, color, borderWidth, opacity, borderColor);
            }
            // legend highlight (legend symbol)
            if (legendVisible && (mode != 'cluster' || legendData))
                this.canvasHighlightLegend(chart, series, selectionSettings, 'Selection', containerStyle, color);
            if (series.marker.visible == true && this.model.AreaType != 'none')
                this.canvasHighlightMarker(chart, series, points, selectionSettings, ctx, evt, colors);
        },

        // clip rect logic calculated here
        createRect: function (chart, ctx) {
            if (chart.model.AreaType != 'none') {
                ctx.lineWidth = 0;
                ctx.strokeStyle = 'transparent';
                ctx.rect(chart.model.m_AreaBounds.X, chart.model.m_AreaBounds.Y, chart.model.m_AreaBounds.Width, chart.model.m_AreaBounds.Height);
                ctx.clip();
                ctx.stroke();
                ctx.save();
            }
        },

        //canvas pyramid and funnel draw
        canvasHighlightPyramid: function (chart, regions, highlight, ctx, opacity, borderColor, borderWidth, color, seriesType) {
            var fill = (highlight.color != "" ? highlight.color : chart.model.pointColors[regions.PointIndex]);
            var measureTitle = (chart.model.title.text) ? ej.EjSvgRender.utils._measureText(chart.model.title.text, $(this.svgObject).width() - chart.model.margin.left - chart.model.margin.right, chart.model.title.font) : 0;
            var pyrX = chart.pyrX = ((chart.model.legend.position.toLowerCase() === "left") ? (chart.model.LegendViewerBounds.Width) : 0) + chart.model.elementSpacing + chart.model.margin.left;
            var pyrY = chart.pyrY = ((chart.model.legend.position.toLowerCase() === "top") ? (chart.model.LegendViewerBounds.Height) : 0) + ((chart.model.title.text) ? (chart.model._titleLocation.Y + measureTitle.height) : (chart.model.margin.top + chart.model.elementSpacing));
            var options = {
                'opacity': opacity,
                'stroke': borderColor,
                'stroke-width': borderWidth,
                'fill': color,
                'type': seriesType,
                'd': "M" + " " + (pyrX + regions.Line1.x) + " " + (pyrY + regions.Line1.y) + " " + "L" + " " + (pyrX + regions.Line2.x) + " " + (pyrY + regions.Line2.y) + " " + "L" + " " + (pyrX + regions.Line3.x) + " " + (pyrY + regions.Line3.y) + " " + "L" + " " + (pyrX + regions.Line4.x) + " " + (pyrY + regions.Line4.y) + " " + "z"
            }
            if (seriesType == 'funnel')
                options.d = "M" + " " + (pyrX + regions.Line1.x) + " " + (pyrY + regions.Line1.y) + " " + "L" + " " + (pyrX + regions.Line2.x) + " " + (pyrY + regions.Line2.y) + " " + "L" + " " + (pyrX + regions.Line3.x) + " " + (pyrY + regions.Line3.y) + " " + "L" + " " + (pyrX + regions.Line4.x) + " " + (pyrY + regions.Line4.y) + " " + "L" + " " + (pyrX + regions.Line5.x) + " " + (pyrY + regions.Line5.y) + " " + "L" + " " + (pyrX + regions.Line6.x) + " " + (pyrY + regions.Line6.y) + " " + "z";
            ej.EjCanvasRender.prototype.drawPath(options, ctx);
        },

        // canvas scatter logic
        canvasScatterHighlight: function (regions, color, borderWidth, opacity, borderColor) {
            var location, options = {}, size = {};
            for (var i = 0; i < regions.length; i++) {
                location = { startX: regions[i].Bounds.X + regions[i].Bounds.Height / 2, startY: regions[i].Bounds.Y + regions[i].Bounds.Width / 2 };
                size.height = regions[i].Bounds.Height;
                size.width = regions[i].Bounds.Width;
                options = {};
                options.ShapeSize = size;
                options.cx = location.startX;
                options.cy = location.startY;
                options.Style = {};
                options.Style.BorderColor = borderColor;
                options.Style.Color = color;
                options.Style.Opacity = opacity;
                options.Style.BorderWidth = borderWidth;
                ej.EjSvgRender.chartSymbol['_drawCircle'](location, options, this, ctx);
            }
        },

        // canvas bubble logic perform here
        canvasBubbleHighlight: function (highlight, regions, chart, seriesIndex, color, borderWidth, opacity, borderColor) {
            var size = 10, radius, fill, bubbleOptions = {};
            for (var i = 0; i < regions.length; i++) {
                radius = regions[i].Bounds.Height / 2;
                fill = (highlight.color != "" ? highlight.color : chart.model.seriesColors[seriesIndex]);
                bubbleOptions = {
                    'cx': regions[i].Bounds.X - this.model.series[seriesIndex].xAxis.x + radius + this.canvasX,
                    'cy': regions[i].Bounds.Y - this.model.series[seriesIndex].yAxis.y + radius + this.canvasY,
                    'r': radius,
                    'fill': color,
                    'stroke-width': borderWidth,
                    'opacity': opacity,
                    'stroke': borderColor
                };
                ej.EjCanvasRender.prototype.drawCircle(bubbleOptions, ctx);
            }
        },

        // canvas circle draw
        canvasHighlightCircle: function (chart, highlight, pointIndex, opacity, borderColor, borderWidth, color, regions, seriesType, ctx) {
            for (var i = 0; i < regions.length; i++) {
                var fill = (highlight.color != "" ? highlight.color : (highlight.mode == "series" && chart.model._visibleSeries.length > 1) ? chart.model.pointColors[i] : chart.model.pointColors[pointIndex]);
                var options = {
                    'opacity': opacity,
                    'stroke': borderColor,
                    'lineWidth': borderWidth,
                    'color': color,
                    'x': regions[i].StartX,
                    'y': regions[i].StartY,
                    'radius': chart.model._isPieOfPie ? chart.model.circularRadius[regions[i].PieSeriesIndex] : chart.model.circularRadius[regions[i].SeriesIndex],
                    'innerRadius': chart.model.innerRadius[regions[i].SeriesIndex],
                    'startAngle': regions[i].StartAngle,
                    'endAngle': regions[i].EndAngle,
                    'type': seriesType
                }
                this.highlightSegment(ctx, options);
            }
        },

        // canvas marker logic
        canvasHighlightMarker: function (chart, series, points, settings, ctx, evt, colors) {
            var highlight = settings;
            var patternName = highlight.pattern.toLowerCase();
            var seriesType = series.type.toLowerCase();
            var options = {};
            var fill = (highlight.color != "" ? highlight.color : chart.model.seriesColors[series.seriesIndex]);
            color = (patternName == "none" || patternName == "") ? fill : this.canvasPattern(ctx, chart, evt, fill, highlight);
            options.Style = {};
            options.Style.BorderColor = highlight.border.color;
            options.Style.Opacity = highlight.opacity;
            options.Style.BorderWidth = highlight.border.width;
            var symbolLocation, location, markerOptions, symbolName;
            for (var i = 0; i < points.length; i++) {
                symbolLocation = points[i].symbolLocation;
                symbolLocation = (seriesType.indexOf("line") != -1 || seriesType.indexOf("area") != -1) ? points[i].location : points[i].symbolLocation;
                if (symbolLocation) {
                    location = this.model.AreaType == "cartesianaxes" ? { startX: symbolLocation.X + this.canvasX, startY: symbolLocation.Y + this.canvasY } : { startX: symbolLocation.X, startY: symbolLocation.Y };
                    markerOptions = series.marker;
                    symbolName;
                    $.each(chart.model.symbolShape, function (name) {
                        if (markerOptions.shape.toLowerCase() == name.toLowerCase())
                            symbolName = name;
                    });
                    options.ShapeSize = markerOptions.size;
                    options.r = Math.sqrt(markerOptions.size.height * markerOptions.size.height + markerOptions.size.width * markerOptions.size.width) / 2;
                    options.cx = location.startX;
                    options.cy = location.startY;
                    options.Style.Color = colors ? colors[i] : color;
                    ej.EjSvgRender.chartSymbol['_draw' + symbolName](location, options, chart, ctx);
                }
            }

        },

        // canvas selction legend logic perform here
        canvasHighlightLegend: function (chart, series, settings, name, containerStyle, color) {
            var length = this.model._visibleSeries.length;
            var index = (chart.model.AreaType == 'none' && length == 1) ? series.pointIndex : series.seriesIndex,
                id = chart._id + '_' + name + '_Legend' + index + '_canvas';
            if ($('#' + id).length == 0 && index < series.points.length) {
                legendCtx = this.createCanvasElement(chart._id + '_' + name + '_Legend' + index + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                if (chart.model.AreaType != 'none' || (chart.model.AreaType == "none" && length > 1))
                    legendRegion = chart.model.legendRegion[series.seriesIndex];
                else
                    legendRegion = chart.model.legendRegion[series.pointIndex];
                var legendBounds = { startX: legendRegion.Bounds.LegendBound.X + legendRegion.Location.startX, startY: legendRegion.Bounds.LegendBound.Y + legendRegion.Location.startY },
                    svgData = { svgRenderer: chart.svgRenderer, svgObject: chart.svgObject },
                    symbolStyle = { 'SeriesIndex': index, 'Style': { 'Color': color, 'Opacity': settings.opacity, 'Visibility': true, 'BorderWidth': 0, BorderColor: color }, 'context': true, 'ShapeSize': legendRegion.Style.ShapeSize }
                if (legendRegion.SymbolShape.toLowerCase() == 'seriestype') {
                    chart.legendItem = legendRegion.LegendItem;
                    ej.EjSvgRender.chartSymbol["_draw" + legendRegion.SymbolShape](legendBounds, symbolStyle, chart);
                } else
                    ej.EjSvgRender.chartSymbol["_draw" + legendRegion.SymbolShape](legendBounds, symbolStyle, svgData, legendCtx);
            }
        },

        // canvas create element 
        createCanvasElement: function (id, width, height, style) {
            var chartCavasOffset, highLightCanvas;
            svgObj = document.createElement('canvas');
            _rootId = jQuery(this.element).attr("id");
            svgObj.setAttribute('id', id);
            svgObj.height = height;
            svgObj.width = width;
            svgObj.style["touch-action"] && (svgObj.style["touch-action"] = "none")
            svgObj.style["-ms-touch-action"] && (svgObj.style["-ms-touch-action"] = "none")
            this.svgRenderer.append(svgObj, this.element);
            var main = document.getElementById(id);
            main.style.left = style.left + $(document).scrollLeft() + 'px';
            main.style.top = style.top + $(document).scrollTop() + 'px';
            main.style.position = "absolute";
            chartCavasOffset = $("#" + this._id + "_canvas").offset();
            highLightCanvas = $(main).offset();
            if (chartCavasOffset.left < highLightCanvas.left) main.style.left = (style.left - Math.abs(chartCavasOffset.left - highLightCanvas.left) + $(document).scrollLeft()) + "px";
            if (chartCavasOffset.top < highLightCanvas.top) main.style.top = (style.top - Math.abs(chartCavasOffset.top - highLightCanvas.top) + $(document).scrollTop()) + "px";
            return svgObj.getContext("2d");
        },

        // canvas pie doughnut logic
        highlightSegment: function (ctx, options) {
            ctx.save();
            ctx.beginPath();
            if (options.type == 'pie' || options.type == "pieofpie") {
                ctx.moveTo(options.x, options.y);
                ctx.arc(options.x, options.y, options.radius, options.startAngle - 1.57, options.endAngle - 1.57, false);
            } else {
                ctx.arc(options.x, options.y, options.radius, options.startAngle - 1.57, options.endAngle - 1.57, false);
                ctx.arc(options.x, options.y, options.innerRadius, options.endAngle - 1.57, options.startAngle - 1.57, true);
            }
            ctx.fillStyle = options.color;
            ctx.globalAlpha = options.opacity;
            ctx.fill();
            ctx.lineWidth = options.lineWidth;
            ctx.strokeStyle = options.stroke;
            ctx.clip();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        },

        // Canvas pattern started here
        canvasPattern: function (ctx, chart, evt, fill, settings) {

            var hoverStyle = settings;
            var name = hoverStyle.name;
            var style = hoverStyle.pattern.toLowerCase();
            var color = fill;
            var opacity = hoverStyle.opacity;
            var backgroundColor = "#ffffff";
            var borderColor = hoverStyle.border.color;
            var borderWidth = hoverStyle.border.width;
            var patternStyle = document.createElement('canvas');
            var patternContext = patternStyle.getContext('2d');
            var pathOptions = [], translate = [];
            switch (style) {
                case "chessboard":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 10, 'height': 10, 'fill': 'white', 'stroke': 'white', 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = { 'x': 0, 'y': 0, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[2] = { 'x': 5, 'y': 5, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                    patternStyle.width = 10;
                    patternStyle.height = 10;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "pacman":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 18, 'height': 18, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 9.081 9.194 L 14.887 6.114 C 14.075000000000001 4.618 12.484 3.0620000000000007 10.596 3.0620000000000007 L 8.835 3.0620000000000007 C 6.138 3.063 3 6.151 3 8.723 L 3 10.402000000000001 C 3 12.974 6.138 16.063000000000002 8.835 16.063000000000002 L 10.596 16.063000000000002 C 12.681000000000001 16.063000000000002 14.431000000000001 14.303000000000003 15.131 12.549000000000003 L 9.081 9.194 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 18;
                    patternStyle.height = 18;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "crosshatch":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 8, 'height': 8, 'fill': 'white', 'stroke': fill, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M 0 0 L 8 8 Z',
                        'stroke-width': 1,
                        'stroke': color,
                        'name': 'path'
                    };
                    pathOptions[2] = {
                        'd': 'M 8 0 L 0 8 Z',
                        'stroke-width': 1,
                        'stroke': color,
                        'name': 'path'
                    };
                    patternStyle.width = 8;
                    patternStyle.height = 8;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "dots":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 7, 'height': 7, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'cx': 3,
                        'cy': 3,
                        'r': 2,
                        'stroke-width': 1,
                        'fill': color,
                        'name': 'circle'
                    };
                    patternStyle.width = 7;
                    patternStyle.height = 7;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "diagonalforward":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'fill': 'white', 'stroke': fill, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M 3 -3 L 9 3 M 6 6 L 0 0 M 3 9 L -3 3',
                        'stroke-width': 2,
                        'stroke': color,
                        'name': 'path'
                    };
                    patternStyle.width = 6;
                    patternStyle.height = 6;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "diagonalbackward":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'stroke-width': 2, 'fill': 'white', 'stroke': fill, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9',
                        'stroke-width': 2,
                        'stroke': color,
                        'name': 'path'
                    };
                    patternStyle.width = 6;
                    patternStyle.height = 6;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "grid":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M 1 3.5 L 11 3.5 M 0 3.5 L 11 3.5 M 0 7.5 L 11 7.5 M 0 11.5 L 11 11.5 M 5.5 0 L 5.5 12 M 11.5 0 L 11.5 12 Z',
                        'stroke-width': 1,
                        'stroke': color
                    };
                    patternStyle.width = 6;
                    patternStyle.height = 6;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "turquoise":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 17, 'height': 17, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 2.697 0.5319999999999996 C 3.8695005238907747 0.5319999999999996 4.82 1.4771268931071944 4.82 2.643 C 4.82 3.808873106892805 3.8695005238907747 4.754 2.697 4.754 C 1.5244994761092252 4.754 0.5739999999999998 3.808873106892805 0.5739999999999998 2.643 C 0.5739999999999998 1.4771268931071944 1.5244994761092252 0.5319999999999996 2.697 0.5319999999999996 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[2] = { 'name': 'path', 'd': 'M 13.928 0.5319999999999996 C 15.100500523890776 0.5319999999999996 16.051000000000002 1.4771268931071944 16.051000000000002 2.643 C 16.051000000000002 3.808873106892805 15.100500523890776 4.754 13.928 4.754 C 12.755499476109225 4.754 11.805 3.808873106892805 11.805 2.643 C 11.805 1.4771268931071944 12.755499476109225 0.5319999999999996 13.928 0.5319999999999996 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[3] = { 'name': 'path', 'd': 'M 8.313 0.5319999999999996 C 9.485500523890776 0.5319999999999996 10.436 1.4771268931071944 10.436 2.643 C 10.436 3.808873106892805 9.485500523890776 4.754 8.313 4.754 C 7.140499476109226 4.754 6.19 3.808873106892805 6.19 2.643 C 6.19 1.4771268931071944 7.140499476109226 0.5319999999999996 8.313 0.5319999999999996 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[4] = { 'name': 'path', 'd': 'M 13.928 6.16 C 15.100500523890776 6.16 16.051000000000002 7.105126893107196 16.051000000000002 8.271 C 16.051000000000002 9.436873106892806 15.100500523890776 10.382000000000001 13.928 10.382000000000001 C 12.755499476109225 10.382000000000001 11.805 9.436873106892806 11.805 8.271 C 11.805 7.105126893107196 12.755499476109225 6.16 13.928 6.16 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[5] = { 'name': 'path', 'd': 'M 8.313 6.16 C 9.485500523890776 6.16 10.436 7.105126893107196 10.436 8.271 C 10.436 9.436873106892806 9.485500523890776 10.382000000000001 8.313 10.382000000000001 C 7.140499476109226 10.382000000000001 6.19 9.436873106892806 6.19 8.271 C 6.19 7.105126893107196 7.140499476109226 6.16 8.313 6.16 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[6] = { 'name': 'path', 'd': 'M 13.928 11.787999999999998 C 15.100500523890776 11.787999999999998 16.051000000000002 12.733126893107194 16.051000000000002 13.899 C 16.051000000000002 15.064873106892804 15.100500523890776 16.009999999999998 13.928 16.009999999999998 C 12.755499476109225 16.009999999999998 11.805 15.064873106892804 11.805 13.899 C 11.805 12.733126893107194 12.755499476109225 11.787999999999998 13.928 11.787999999999998 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[7] = { 'name': 'path', 'd': 'M 8.313 11.787999999999998 C 9.485500523890776 11.787999999999998 10.436 12.733126893107194 10.436 13.899 C 10.436 15.064873106892804 9.485500523890776 16.009999999999998 8.313 16.009999999999998 C 7.140499476109226 16.009999999999998 6.19 15.064873106892804 6.19 13.899 C 6.19 12.733126893107194 7.140499476109226 11.787999999999998 8.313 11.787999999999998 Z', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    patternStyle.width = 17;
                    patternStyle.height = 17;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "star":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 21, 'height': 21, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M 15.913 18.59 L 10.762 12.842 L 5.613 18.75 L 8.291 11.422 L 0.325 9.91 L 8.154 8.33 L 5.337 0.91 L 10.488 6.658 L 15.637 0.75 L 12.959 8.078 L 20.925 9.59 L 13.096 11.17 z',
                        'stroke-width': 1,
                        'stroke': color,
                        'fill': color
                    };
                    patternStyle.width = 21;
                    patternStyle.height = 21;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "triangle":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 10, 'height': 10, 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M 4.987 0 L 7.48 4.847 L 9.974 9.694 L 4.987 9.694 L 0 9.694 L 2.493 4.847 z',
                        'stroke-width': 1,
                        'stroke': color,
                        'fill': color
                    };
                    patternStyle.width = 10;
                    patternStyle.height = 10;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "circle":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 9, 'height': 9, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'circle',
                        'cx': 5.125,
                        'cy': 3.875,
                        'r': 3.625,
                        'stroke-width': 1,
                        'fill': color
                    };
                    patternStyle.width = 9;
                    patternStyle.height = 9;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "tile":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 18, 'height': 18, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 0 9 L 0 0 L 9 0 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[2] = { 'name': 'path', 'd': 'M 9 9 L 9 0 L 18 0 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[3] = { 'name': 'path', 'd': 'M 0 18 L 0 9 L 9 9 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[4] = { 'name': 'path', 'd': 'M 9 18 L 9 9 L 18 9 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 18;
                    patternStyle.height = 18;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "horizontaldash":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 12, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 0 1.5 L 10 1.5 M 0 5.5 L 10 5.5 M 0 9.5 L 10 9.5 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 12;
                    patternStyle.height = 12;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "verticaldash":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 12, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 1.5 0 L 1.5 10 M 5.5 0 L 5.5 10 M 9.5 0 L 9.5 10 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 12;
                    patternStyle.height = 12;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "rectangle":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'name': 'rect', 'width': 12, 'height': 12, 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'rect', 'x': 1, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                    pathOptions[2] = { 'name': 'rect', 'x': 7, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                    patternStyle.width = 12;
                    patternStyle.height = 12;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "box":
                    pathOptions[0] = { 'x': 0, 'y': 0, 'name': 'rect', 'width': 13, 'height': 13, 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'rect', 'x': 1.5, 'y': 1.5, 'width': 10, 'height': 9, 'fill': color, 'opacity': opacity };
                    patternStyle.width = 10;
                    patternStyle.height = 10;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "horizontalstripe":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 10, 'height': 12, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 0 0.5 L 10 0.5 M 0 4.5 L 10 4.5 M 0 8.5 L 10 8.5 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 10;
                    patternStyle.height = 12;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "verticalstripe":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 10, 'transform': "translate(0,0)", 'fill': 'white', 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M 0.5 0 L 0.5 10 M 4.5 0 L 4.5 10 M 8.5 0 L 8.5 10 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    patternStyle.width = 12;
                    patternStyle.height = 10;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;
                case "bubble":
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 20, 'height': 20, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'circle', 'cx': 5.217, 'cy': 11.325, 'r': 3.429, 'stroke-width': 1, 'fill': '#D0A6D1' };
                    pathOptions[2] = { 'name': 'circle', 'cx': 13.328, 'cy': 6.24, 'r': 4.884, 'stroke-width': 1, 'fill': color };
                    pathOptions[3] = { 'name': 'circle', 'cx': 13.277, 'cy': 14.66, 'r': 3.018, 'stroke-width': 1, 'fill': '#D0A6D1' };
                    patternStyle.width = 20;
                    patternStyle.height = 20;
                    this.loadPattern(chart, pathOptions, '', patternContext);
                    break;



                case "custom":
                    patternStyle = document.getElementById(hoverStyle.customPattern);
                    break;
            }
            var pattern = ctx.createPattern(patternStyle, 'repeat');
            return pattern;
        },
        // Canvas pattern end
        // Canvas highlight and selection end

        //Get selected class for removing lengeds selection in multiselection mode
        foundClasses: function (id) {
            var pointClasses = [];
            $("[id*=" + id + "]").each(function () {
                var pointClass = $(this).attr('class') ? $(this).attr('class') : '';
                if (pointClass.indexOf('Selection') >= 0) {
                    pointClasses.push(pointClass);
                }
            });
            return pointClasses;
        },
        // SVG selection started here
        selection: function (chart, evt, series, tracker, legendData, seriesIndex, pointIndex, parentNodeId, targetId, data) {
            var clusterPoints = this.model.clusterPoints,
                clusterPointslength = clusterPoints ? clusterPoints.length : 0,
                seriesCollection = this.model._visibleSeries,
                seriesLenth = seriesCollection.length,
                index = (this.model.AreaType == 'none' && seriesLenth == 1) ? pointIndex : seriesIndex,
                highlight = series.selectionSettings,
                isMultiSelection = this.model._visibleSeries[seriesIndex].selectionSettings.type.toLowerCase() == 'multiple' ? true : false,
                name = 'series' + seriesIndex,
                found_class = false,
                pathName = $('#' + targetId).attr('name'),
                patternName = highlight.pattern.toLowerCase(),
                mode = highlight.mode, isElement;
            if (parentNodeId)
                isElement = (parentNodeId.indexOf(this.svgObject.id + "_SeriesGroup_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_Chart3D") >= 0) ? true : false;

            if (this.model.AreaType != 'none' || (this.model.AreaType == 'none' && mode == "series" && seriesLenth > 1)) {
                $('style').each(function () {
                    if ($(this).html().indexOf('.' + chart._id + 'SelectionStyle' + name) > -1) {
                        found_class = true;
                    }
                });
            }
            if (!chart.vmlRendering && this.model.enable3D) {
                if ((mode == 'series' || legendData) && (this.model.AreaType != 'none' || (this.model.AreaType == 'none' && seriesLenth != 1))) {
                    this.highlightSeries(chart, seriesIndex, pointIndex, 'Selection', name, highlight, evt, legendData, data)
                    $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', 'Selection' + name + 'Style' + name + '1');
                }
                else if (mode == 'cluster' && chart.model.AreaType != 'none')
                    this.highlightCluster(chart, seriesIndex, pointIndex, 'Selection', name, highlight, evt, data)
                else {
                    if (this.model.AreaType == 'none') {
                        this.highlightPoint(chart, seriesIndex, pointIndex, 'Selection', name + index, highlight, evt, data);
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', 'Selection' + name + index + 'Style' + name + index + '1');
                    } else {
                        this.highlightPoint(chart, seriesIndex, pointIndex, 'Selection', name, highlight, evt, data)
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', 'Selection' + name + 'Style' + name + '1');
                    }
                }
            }
            else {
                if ((mode != 'cluster' || legendData) || chart.model.AreaType == 'none') {
                    var colorStyle = {};
                    colorStyle.name = "2D",
                        colorStyle.index = this.model.AreaType == 'none' ? index : seriesIndex; colorStyle.api = "Selection",
                            colorStyle.color = highlight.color != "" ? highlight.color : legendData ? (this.model.AreaType == 'none' ? this.model.pointColors[index] : this.model.seriesColors[index]) :
                                $('#' + targetId).attr('fill') != 'none' ? $('#' + targetId).attr('fill') : $('#' + targetId).attr('stroke');
                    if (Object.prototype.toString.call(colorStyle.color) === '[object Array]')
                        colorStyle.color = colorStyle.color[1].color;
                    var fill = ((patternName == "none" || chart.vmlRendering) || patternName == "") ? highlight.color : this.pattern(chart, evt, colorStyle, highlight),
                        opacity = highlight.opacity,
                        strokeColor = highlight.border.color,
                        strokeWidth = highlight.border.width;
                    if (!found_class) {
                        if (this.model.AreaType == 'none' && (((mode == 'series' || legendData) && seriesLenth == 1) || (mode != 'series' && !legendData))) {
                            $('style').each(function () {
                                if ($(this).html().indexOf('.SelectionStyle' + name + 'Point' + index) > -1) {
                                    found_class = true;
                                }
                            });
                            if (!found_class) {
                                this.createStyle(chart, chart._id + 'Selection', name + 'Point' + index, opacity, fill, strokeColor, strokeWidth);
                                this.createStyle(chart, chart._id + 'SelectionLegend', name + 'Point' + index, opacity, fill, 'transparent', 0);
                            }
                        } else if (this.model.AreaType == 'none' && seriesLenth > 1 || this.model.AreaType != 'none') {
                            this.createStyle(chart, chart._id + 'Selection', name, opacity, fill, strokeColor, strokeWidth);
                            this.createStyle(chart, chart._id + 'SelectionLegend', name, opacity, fill, 'transparent', 0);
                        }

                    }
                }
                if ((mode == 'series' || legendData) && ((chart.model.AreaType == 'none' && seriesLenth > 1) || (chart.model.AreaType != 'none'))) {
                    if (!isElement) {
                        var otherElements = $('#' + parentNodeId).childNodes ? $('#' + parentNodeId).childNodes : [];
                        for (var i = 0; i < otherElements.length; i++)
                            $('#' + otherElements[i].id).attr('class', chart._id + 'SelectionStyle');
                    }
                    $("[id*=" + this.svgObject.id + '_Series' + index + "]").each(function () {
                        if (this.parentNode.id == chart.svgObject.id + '_SeriesGroup_' + index || this.parentNode.id == chart.svgObject.id + '_symbolGroup_' + index) {
                            var className = $(this).attr("name") ? chart._id + 'SelectionPathStyle' + name : chart._id + 'SelectionStyle' + name;
                            $(this).attr('class', className);
                        }
                    });

                    //for legend selection sets here              
                    $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', chart._id + 'SelectionLegendStyle' + name);

                    // removed tracker symbol
                    if (tracker) $('#' + parentNodeId).remove();

                }

                else if (mode == "cluster" && (chart.model.AreaType != 'none') && !ej.util.isNullOrUndefined(targetId)) {
                    var matchString, clustername, indexVal, text, colorStyle, opacity, strokeColor, fill, strokeWidth;
                    matchString = this.svgObject.id + "_Series";
                    var clusterPoints = chart.model.clusterPoints;
                    index = targetId.match(/(\d+)/g);
                    pointIndex = parseInt(index[index.length - 1]);
                    if (targetId.indexOf('SeriesText') >= 0) {
                        var datas = this.GetSeriesPoint(evt);
                        pointIndex = datas.region.Region.PointIndex;
                    }
                    var findClass, seriesSelectionIndex;
                    for (k = 0; k < clusterPoints.length; k++) {
                        seriesSelectionIndex = clusterPoints[k].seriesIndex;
                        name = 'ClusterSeries' + seriesSelectionIndex;
                        //creating individual styles for the points in different series
                        colorStyle = {};
                        colorStyle.index = seriesSelectionIndex;
                        colorStyle.name = "2D"; colorStyle.api = "Selection" + name;
                        highlight = seriesCollection[seriesSelectionIndex].selectionSettings;
                        colorStyle.color = highlight.color != "" ? highlight.color : this.model.seriesColors[seriesSelectionIndex];
                        if (Object.prototype.toString.call(colorStyle.color) === '[object Array]')
                            colorStyle.color = colorStyle.color[1].color;
                        opacity = highlight.opacity;
                        var strokeColor = highlight.border.color;
                        var strokeWidth = highlight.border.width;
                        var fill = ((patternName == "none" || chart.vmlRendering) || patternName == "") ? colorStyle.color : this.pattern(chart, evt, colorStyle, highlight);
                        $('style').each(function () {
                            if ($(this).html().indexOf('.' + chart._id + 'SelectionStyle' + name) > -1) {
                                findClass = true;
                            }
                        });
                        if (!findClass) {
                            this.createStyle(chart, chart._id + 'Selection', name, opacity, fill, strokeColor, strokeWidth);
                            this.createStyle(chart, chart._id + 'SelectionLegend', name, opacity, fill, 'transparent', 0);
                        }
                        var className = $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex).attr("name") ? chart._id + 'SelectionPathStyle' + name : chart._id + 'SelectionStyle' + name;
                        $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex).attr('class', className);
                        $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex + '_symbol').attr('class', className);
                        if (chart.model._visibleSeries[seriesSelectionIndex].visibility != "hidden")
                            $('#' + this.svgObject.id + '_LegendItemShape' + seriesSelectionIndex).not("[class*='Highlight']").attr('class', chart._id + 'SelectionLegendStyle' + name);
                        // checked condition for financial series
                        var finName = $('#' + targetId).attr("name");
                        if (finName != undefined && (finName == 'candle' || finName.indexOf('hilo') >= 0)) {
                            $('[id$=' + matchString + clusterPoints[k].seriesIndex + '_' + 'Point' + clusterPoints[k].pointIndex + ']').attr('class', 'HighlightStyle' + name);
                        }
                    }
                    if (tracker) {
                        $('#' + this.svgObject.id + '_Series' + seriesSelectionIndex + '_Point' + pointIndex).attr('class', chart._id + 'SelectionStyle' + name);
                        $('#' + this.svgObject.id + '_Series' + seriesSelectionIndex + '_Point' + pointIndex + '_symbol').attr('class', chart._id + 'SelectionStyle' + name);
                        $('#' + parentNodeId).remove();
                    }
                }


                else {
                    // checked condition for whether target id is area related or not
                    if ((!$('#' + targetId).attr("name") && targetId != chart.svgObject.id + '_Series' + index) && chart.model.AreaType != 'none') {
                        $('#' + targetId).attr('class', chart._id + 'SelectionStyle' + name);
                        if (this.model.commonSeriesOptions.columnFacet == 'cylinder' || series.columnFacet == 'cylinder') {
                            for (i = 0; i < 2; i++) {
                                $('#' + targetId.replace(/2$/, i)).attr('class', chart._id + 'SelectionStyle' + name);
                            }
                        }
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', chart._id + 'SelectionLegendStyle' + name);
                        $('#' + targetId + '_symbol').attr('class', chart._id + 'SelectionStyle' + name);

                        if (tracker) {
                            $('#' + targetId + '_symbol').attr('class', chart._id + 'SelectionStyle' + name);
                            $('#' + parentNodeId).remove();
                        }
                    } else {
                        $('#' + targetId).attr('class', chart._id + 'SelectionStyle' + name + 'Point' + index);
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', chart._id + 'SelectionLegendStyle' + name + 'Point' + index);
                        if (tracker) $('#' + parentNodeId).remove();
                    }

                    // checked condition for financial series
                    var finName = $('#' + targetId).attr("name");
                    if (finName != undefined && (finName == 'candle' || finName.indexOf('hilo') >= 0)) {
                        $('[id$=' + targetId + ']').attr('class', chart._id + 'SelectionStyle' + name);
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class', chart._id + 'SelectionLegendStyle' + name);
                    }
                }
            }
        },

        //Selection Removing Logic
        removeSelection: function (seriesIndex, pointIndex, seriesCollection, mode, isMultiSelection, legendData, isSelected) {
            var seriesLength = seriesCollection.length,
                clusterPoints = this.model.clusterPoints,
                clusterPointslength = clusterPoints ? clusterPoints.length : 0, selectionSettings;
            //Removing selectiond mode series
            if ((mode == 'series' || legendData) && (this.model.AreaType != 'none' || (this.model.AreaType == 'none' && seriesLength > 1))) {
                for (var i = 0; i < seriesLength; i++) {
                    selectionSettings = seriesCollection[i].selectionSettings;
                    if ((selectionSettings.mode != 'point' && selectionSettings.type.toLowerCase() == 'single') || (legendData && selectionSettings.type.toLowerCase() == 'single')) {
                        $(this.svgObject).find('[id*=' + this.svgObject.id + '_SeriesGroup_' + i + '],[id*=' + this.svgObject.id + '_symbolGroup_' + i + '],[id*=_Region_Series_' + i + '_]').each(function () {
                            $(this).find("*").attr('class', '');
                            $(this).attr('class', '');
                        });
                        $('#' + this._id + '_Selection_Legend' + i + '_canvas').remove();
                        $('#' + this._id + '_Selection_series' + i + '_canvas').remove();
                        $("[id*=" + '_Region_Series_' + i + "]").attr('class', '');
                        $('#' + this.svgObject.id + '_LegendItemShape' + i).attr('class', '');
                    } else if (isSelected && selectionSettings.type.toLowerCase() == 'multiple') {
                        $('#' + this._id + '_Selection_series' + seriesIndex + '_canvas').remove();
                        $('#' + this._id + '_Selection_Legend' + seriesIndex + '_canvas').remove();
                        $("[id*=" + '_Region_Series_' + seriesIndex + "]").attr('class', '');
                        $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + "]").attr('class', '');
                        $('#' + this.svgObject.id + '_LegendItemShape' + seriesIndex).attr('class', '');
                    }
                }
            }
            //Removing selection mode Cluster
            if (mode == 'cluster' && this.model.AreaType != 'none' && !legendData) {
                if (!isMultiSelection) {
                    if (this.model.enableCanvasRendering) {
                        $('[id*=' + this._id + '_Selection_Cluster' + ']').remove();
                        $('[id*=' + this._id + '_SelectionCluster_Legend' + ']').remove();
                        this.selectedPoint = null;
                    } else
                        for (var k = 0; k < clusterPointslength; k++) {
                            $("[id*=" + '_Region_Series_' + clusterPoints[k].seriesIndex + '_Point_' + "]").attr('class', '');
                            $("[id*=" + this.svgObject.id + '_Series' + clusterPoints[k].seriesIndex + '_Point' + "]").attr('class', '');
                            $('#' + this.svgObject.id + '_LegendItemShape' + clusterPoints[k].seriesIndex).attr('class', '');
                        }
                }
                else {
                    if (!this.model.enableCanvasRendering) {
                        for (var k = 0; k < clusterPointslength; k++) {
                            $("[id*=" + "_Region_Series_" + clusterPoints[k].seriesIndex + "_Point_" + clusterPoints[k].pointIndex + "]").attr('class', '');
                            $("[id*=" + this.svgObject.id + '_Series' + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex + "]").attr('class', '');
                        }
                        pointClasses = this.model.enable3D ? this.foundClasses('_Region_Series_' + seriesIndex) : this.foundClasses(this.svgObject.id + '_Series' + seriesIndex);
                        (pointClasses.length == 0) ? $("[id*=" + this.svgObject.id + '_LegendItemShape' + "]").attr('class', '') : 0;
                    } else {
                        $('[id*=' + this._id + '_Selection_Cluster' + '_point_' + pointIndex + ']').remove();
                        $('[id*=' + this._id + '_Selection_Cluster' + ']').length == 0 ? $('[id*=' + this._id + '_SelectionCluster_Legend' + ']').remove() : 0;
                    }
                }
            }

            //Removing selection mode point
            if (mode == 'point' && this.model.AreaType != 'none' && !legendData) {
                if (!isMultiSelection) {
                    $('[id*=' + this._id + '_Selection_series' + seriesIndex + '_point_' + ']').remove();
                    $('[id*=' + this._id + '_Selection_Legend' + seriesIndex + ']').remove();
                    $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + "]").attr('class', '');
                    $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + "]").attr('class', '');
                    $('#' + this.svgObject.id + '_LegendItemShape' + seriesIndex).attr('class', '');
                }
                else {
                    $('#' + this._id + '_Selection_series' + seriesIndex + '_point_' + pointIndex + '_canvas').remove();
                    $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + pointIndex + "]").attr('class', '');
                    $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex + "]").attr('class', '');
                    $("[id*=" + this._id + '_Selection_series' + seriesIndex + "]").length == 0 ? $('#' + this._id + '_Selection_Legend' + seriesIndex + '_canvas').remove() : 0;
                    pointClasses = this.model.enable3D ? this.foundClasses('_Region_Series_' + seriesIndex) : this.foundClasses(this.svgObject.id + '_Series' + seriesIndex);
                    (pointClasses.length == 0) ? $('#' + this.svgObject.id + '_LegendItemShape' + seriesIndex).attr('class', '') : 0;
                }
            }

            //Removing accoumulation series types selections
            if ((mode == 'point' || mode == 'cluster') || (mode == "series" && this.model._visibleSeries.length == 1) && this.model.AreaType == 'none' && !legendData) {
                if (!isMultiSelection) {
                    $("[id*=" + this._id + '_Selection_series' + ']').remove();
                    $("[id*=" + this._id + '_Selection_Legend' + ']').remove()
                    $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + "]").attr('class', '');
                    $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + "]").attr('class', '');
                    (this.model._visibleSeries.length > 1) ? $("[id*=" + this.svgObject.id + '_LegendItemShape' + seriesIndex + "]").attr('class', '') : $("[id*=" + this.svgObject.id + '_LegendItemShape' + "]").attr('class', '');
                } else {
                    $('#' + this._id + '_Selection_series' + seriesIndex + '_point_' + pointIndex + '_canvas').remove();
                    $("[id*=" + '_Region_Series_' + seriesIndex + '_Point_' + pointIndex + "]").attr('class', '');
                    $("[id*=" + this.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex + "]").attr('class', '');
                    (this.model._visibleSeries.length > 1) ? $('#' + this.svgObject.id + '_LegendItemShape' + seriesIndex).attr('class', '') : $('#' + this.svgObject.id + '_LegendItemShape' + pointIndex).attr('class', '');
                    (this.model._visibleSeries.length > 1) ? $('#' + this._id + '_Selection_Legend' + seriesIndex + '_canvas').remove() : $('#' + this._id + '_Selection_Legend' + pointIndex + '_canvas').remove();
                }
            }
        },
        // style append operation perform here
        createStyle: function (chart, api, name, opacity, fill, strokeColor, strokeWidth, strokeOpacity) {
            if (chart.vmlRendering) {
                var style = document.createElement('style');
                style.id = api + "Segment";
                opacity = opacity * 100;
                var text = "." + api + "Style" + name + " {filter: alpha(opacity=" + opacity + ");}." + api + "PathStyle" + name + "  {filter: alpha(opacity=" + opacity + ");}";
                style.setAttribute("type", "text/css");
                if (style.styleSheet) {   // for IE
                    style.styleSheet.cssText = text;
                } else {                // others
                    var textnode = document.createTextNode(text);
                    style.appendChild(textnode);
                }
                var header = document.getElementsByTagName('head')[0];
                header.appendChild(style);
            } else {
                $("<style id=" + api + "Segment" + name + " type='text/css'> ." + api + "Style" + name + "{ fill:" + fill + ";opacity:" + opacity + ";stroke:" + strokeColor + ";stroke-width:" + strokeWidth + ";stroke-opacity:" + strokeOpacity + "}</style>").appendTo("body");
                $("<style id=" + api + "Path" + name + " type='text/css'> ." + api + "PathStyle" + name + "{ opacity:" + opacity + ";stroke:" + strokeColor + ";stroke-width:" + strokeWidth + ";stroke-opacity:" + strokeOpacity + "}</style>").appendTo("body");
            }
        },

        // point highlight 3D perform here
        highlightPoint: function (chart, seriesIndex, pointIndex, api, name, highlight, evt) {
            var pathId = "_Region_Series_" + seriesIndex + "_Point_" + pointIndex,
                gElement = $(this.svgObject).find('[id$=' + pathId + '],[id*=' + pathId + 'back],[id*=' + pathId + 'front]');
            for (var i = 0; i < gElement.length; i++) {
                var style3D = [];
                style3D.api = api + name; style3D.seriesName = name;
                style3D.name = $("[id=" + gElement[i].id + "]").attr('name');
                style3D.index = i;
                var color = this.highlightFill(highlight, chart, seriesIndex, pointIndex);
                var className = ($('#' + gElement[i].id).attr('class'));
                className = className ? className : '';
                if (className.indexOf('Selection') < 0) {
                    $("[id=" + gElement[i].id + "]").attr('class', this.dStyle(style3D, color, chart, evt, highlight));
                }
            }
        },
        //cluster highlight of 3D is perfomed here
        highlightCluster: function (chart, seriesIndex, pointIndex, api, name, highlight, evt) {
            if (chart.model.AreaType != 'none') {
                var name, pathId, gElement, style3D, color, classname, clusterPoints = [];
                var xvalue = chart.model._visibleSeries[seriesIndex]._visiblePoints[pointIndex].x;
                for (var i = 0, len = chart.model._visibleSeries.length; i < len; i++) {
                    for (var j = 0; j < chart.model._visibleSeries[i]._visiblePoints.length; j++) {
                        if (xvalue == chart.model._visibleSeries[i]._visiblePoints[j].x)
                            clusterPoints[clusterPoints.length] = { seriesIndex: i, pointIndex: j };
                    }
                }
                for (k = 0; k < clusterPoints.length; k++) {
                    name = 'series' + k;
                    pathId = "_Region_Series_" + clusterPoints[k].seriesIndex + "_Point_" + clusterPoints[k].pointIndex;
                    gElement = $(this.svgObject).find('[id$=' + pathId + '],[id*=' + pathId + 'back],[id*=' + pathId + 'front]');
                    for (var j = 0; j < gElement.length; j++) {
                        style3D = [];
                        style3D.api = api + name; style3D.seriesName = 'series' + k;
                        style3D.name = $("[id=" + gElement[j].id + "]").attr('name');
                        style3D.index = j;
                        seriesIndex = k;
                        highlight = (api == 'Highlight') ? chart.model._visibleSeries[k].highlightSettings : chart.model._visibleSeries[k].selectionSettings;
                        color = this.highlightFill(highlight, chart, seriesIndex, pointIndex);
                        className = ($('#' + gElement[j].id).attr('class'));
                        className = className ? className : '';
                        if ((className.indexOf('Selection' + name + 'Style') < 0) && (className.indexOf('SelectionStyle') < 0)) {
                            $("[id=" + gElement[j].id + "]").attr('class', this.dStyle(style3D, color, chart, evt, highlight));
                        }

                    }
                    if (api == 'Highlight')
                        $('#' + this.svgObject.id + '_LegendItemShape' + k).not("[class*='Selection']").attr('class', 'Highlight' + name + 'Style' + name + '1');
                    else
                        $('#' + this.svgObject.id + '_LegendItemShape' + k).attr('class', 'Selection' + name + 'Style' + name + '1');
                }

            }
        },
        // point series 3D perform here
        highlightSeries: function (chart, seriesIndex, index, api, name, highlight, evt, legendData) {
            var seriesIndex = seriesIndex,
                pointIndex = index,
                length = chart.model._visibleSeries.length,
                pathId = (chart.model.AreaType == 'none' && length == 1) ? "_Region_Series_" + seriesIndex + "_Point_" + index : "_Region_Series_" + seriesIndex + "_Point_",
                gElement = $(this.svgObject).find('[id*=' + pathId + ']'), style3D, color,
                className = legendData ? $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class') : evt ? ($('#' + evt.target.id).attr('class')) : '';
            className = className ? className : '';
            if (className.indexOf('SelectionStyle') < 0 || legendData) {
                for (var i = 0; i < gElement.length; i++) {
                    style3D = [];
                    style3D.api = api + name, style3D.seriesName = name,
                        style3D.name = $("[id=" + gElement[i].id + "]").attr('name'),
                        style3D.index = i;
                    color = this.highlightFill(highlight, chart, seriesIndex, pointIndex, legendData);
                    className = $('#' + gElement[i].id).attr('class');
                    className = className ? className : '';
                    if (className.indexOf('SelectionStyle') < 0 && (className.indexOf('Selection' + name + 'Style') < 0)) {
                        $("[id=" + gElement[i].id + "]").attr('class', this.dStyle(style3D, color, chart, evt, highlight));
                    }
                }
            }
        },

        //SVG highlight logic started here
        highlight: function (chart, evt, series, legendData, data, parentNodeId, targetID, tracker) {
            var highlight = series.highlightSettings;
            var seriesIndex = $.inArray(series, chart.model._visibleSeries), pointIndex;
            var name = 'series' + seriesIndex;//series.name.replace(/ /g, ''); // removed space for series name
            var found_class = false;
            var index = seriesIndex;
            var targetId = targetID || evt.target.id;
            var matched = jQuery.uaMatch(navigator.userAgent);
            if (!tracker && this.isTouch(evt) && matched.browser == 'chrome') {
                myLocation = evt.originalEvent.changedTouches[0];
                targetId = document.elementFromPoint(myLocation.clientX, myLocation.clientY).id;
            }
            parentNodeId = parentNodeId || evt.target.parentNode.id;
            var isElement = (parentNodeId.indexOf(this.svgObject.id + "_SeriesGroup_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_Chart3D") >= 0) ? true : false;
            var pathName = $('#' + targetId).attr('name');
            var patternName = highlight.pattern.toLowerCase();
            var length = chart.model._visibleSeries.length;
            if (chart.model.AreaType == 'none' && length == 1) {
                if (!chart.model.enable3D) {
                    var matchStr = legendData ? this.svgObject.id + '_LegendItemShape' : this.svgObject.id + "_Series" + seriesIndex + "_Point";
                    var id = legendData ? this.svgObject.id + '_LegendItemShape' + legendData.legendItem.LegendItem.PointIndex : targetId;
                    pointIndex = id.substr(matchStr.length);
                    index = pointIndex;
                } else {
                    index = legendData ? legendData.legendItem.LegendItem.PointIndex : data.region.Region.PointIndex;
                }
            }
            $('style').each(function () {
                if ($(this).html().indexOf('.HighlightStyle' + name) > -1) {
                    found_class = true;
                }
            });
            if (chart.model.enable3D && !chart.vmlRendering) {
                if ((highlight.mode == 'series' || legendData) && ((chart.model.AreaType == 'none' && length != 1) || chart.model.AreaType != 'none')) {
                    this.highlightSeries(chart, seriesIndex, index, 'Highlight', name, highlight, evt, legendData)
                    $('#' + this.svgObject.id + '_LegendItemShape' + index).not("[class*='Selection']").attr('class', 'Highlight' + name + 'Style' + name + '1');
                } else if (highlight.mode == 'cluster' && chart.model.AreaType != 'none') {
                    this.highlightCluster(chart, seriesIndex, data.pointData.pointIndex, 'Highlight', name, highlight, evt);

                } else {
                    pointIndex = data ? data.pointData.pointIndex : index;
                    this.highlightPoint(chart, seriesIndex, pointIndex, 'Highlight', name + pointIndex, highlight, evt)
                    $('#' + this.svgObject.id + '_LegendItemShape' + index).not("[class*='Selection']").attr('class', 'Highlight' + name + pointIndex + 'Style' + name + pointIndex + '1');
                }
            } else {
                if (highlight.mode || this.model.AreaType == 'none') {
                    var colorStyle = {};
                    colorStyle.name = "2D";
                    colorStyle.index = seriesIndex; colorStyle.api = "Highlight"; colorStyle.color = highlight.color != "" ? highlight.color : legendData ? (this.model.AreaType == 'none' ? this.model.pointColors[index] : this.model.seriesColors[index]) : $('#' + targetId).attr('fill');
                    if (Object.prototype.toString.call(colorStyle.color) === '[object Array]')
                        colorStyle.color = colorStyle.color[1].color;
                    var fill = ((patternName == "none" || chart.vmlRendering) || patternName == "") ? highlight.color : this.pattern(chart, evt, colorStyle, highlight);
                    var opacity = tracker ? 1 : highlight.opacity;
                    var strokeColor = (tracker) ? ((series.type.toLowerCase().indexOf("hilo") == -1) ? chart.model.highlightColor : fill) : highlight.border.color;
                    var strokeWidth = tracker ? 3.5 : highlight.border.width;
                    var strokeOpacity = (tracker && series.type.toLowerCase().indexOf("hilo") == -1) ? 0.5 : 1;
                    if (!found_class) {
                        this.createStyle(chart, 'Highlight', name, opacity, fill, strokeColor, strokeWidth, strokeOpacity);
                        this.createStyle(chart, 'HighlightLegend', name, opacity, fill, 'transparent', 0, strokeOpacity);
                    }
                }

                // sets the style for the segment or path started here
                var className = legendData ? $('#' + this.svgObject.id + '_LegendItemShape' + index).attr('class') : $('#' + targetId).attr('class');
                className = className ? className : '';
                if (className.indexOf("Selection") == -1) {
                    // checked mode of the highlight series
                    if (((highlight.mode == 'series' && !tracker) || legendData) && ((chart.model.AreaType == 'none' && length != 1) || chart.model.AreaType != 'none')) {
                        $("[id*=" + this.svgObject.id + '_Series' + index + "]").each(function () {
                            if (this.parentNode.id == chart.svgObject.id + '_SeriesGroup_' + index || this.parentNode.id == chart.svgObject.id + '_symbolGroup_' + index) {
                                var selectClass = $(this).attr('class');
                                var className = $(this).attr("name") ? 'HighlightPathStyle' + name : 'HighlightStyle' + name;
                                // this condition is checked for whether already selected and it's symbol
                                if ((selectClass == undefined || selectClass.indexOf('SelectionStyle') == -1) && selectClass != 'SelectionStyle' + name && selectClass != 'SelectionStyleClusterSeries' + seriesIndex && selectClass != 'SelectionPathStyle' + name && parentNodeId.indexOf(chart.svgObject.id + '_symbolGroup_' + index) <= 0) {
                                    $(this).attr('class', className);
                                }
                            }
                        });
                        //for legend highlight sets here
                        $('#' + this.svgObject.id + '_LegendItemShape' + index).not("[class*='Selection']").attr('class', 'HighlightLegendStyle' + name);
                    }
                    else if (highlight.mode == "cluster" && chart.model.AreaType != 'none' && !tracker) {
                        var matchString = this.svgObject.id + "_Series";
                        var clusterPoints = [], seriesHighlightIndex;
                        index = targetId.match(/(\d+)/g);
                        if (index && targetId.toLowerCase().indexOf("point") > 0) {
                            pointIndex = parseInt(index[index.length - 1]);
                            var xvalue = chart.model._visibleSeries[seriesIndex]._visiblePoints[pointIndex].xValue, point;
                            for (var i = 0, len = chart.model._visibleSeries.length; i < len; i++) {
                                for (var j = 0; j < chart.model._visibleSeries[i]._visiblePoints.length; j++) {
                                    point = chart.model._visibleSeries[i]._visiblePoints[j];
                                    if (xvalue == point.xValue && point.isEmpty == false && point.visible == true)
                                        clusterPoints[clusterPoints.length] = { seriesIndex: i, pointIndex: j };
                                }
                            }
                        }
                        for (k = 0; k < clusterPoints.length; k++) {
                            seriesHighlightIndex = clusterPoints[k].seriesIndex;
                            name = 'series' + seriesHighlightIndex;
                            //creating individual styles for the points in different series
                            colorStyle = {};
                            colorStyle.name = "2D"; colorStyle.api = "Highlight" + name;
                            highlight = chart.model._visibleSeries[seriesHighlightIndex].highlightSettings;
                            colorStyle.color = highlight.color != "" ? highlight.color : this.model.seriesColors[seriesHighlightIndex];
                            if (Object.prototype.toString.call(colorStyle.color) === '[object Array]')
                                colorStyle.color = colorStyle.color[1].color;
                            opacity = highlight.opacity;
                            strokeColor = highlight.border.color;
                            strokeWidth = highlight.border.width;
                            fill = ((patternName == "none" || chart.vmlRendering) || patternName == "") ? colorStyle.color : this.pattern(chart, evt, colorStyle, highlight);
                            if (!found_class) {
                                this.createStyle(chart, 'Highlight', name, opacity, fill, strokeColor, strokeWidth);
                                this.createStyle(chart, 'HighlightLegend', name, opacity, fill, 'transparent', 0);
                            }

                            //applying the created style to the selected element 
                            var selectClass = $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex).attr('class');
                            var symbol = $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex + '_symbol').attr('class');
                            var className = $('#' + matchString + clusterPoints[k].seriesIndex + '_Point' + clusterPoints[k].pointIndex).attr("name") ? 'HighlightPathStyle' + name : 'HighlightStyle' + name;
                            // this condition is checked for whether already selected and it's symbol
                            if ((selectClass == undefined || selectClass.indexOf('SelectionStyleseries' + k) == -1) && selectClass != 'SelectionStyle' + 'series' + k && selectClass != 'SelectionPathStyle' + name && parentNodeId.indexOf(chart.svgObject.id + '_symbolGroup_' + k) <= 0) {
                                $('#' + matchString + clusterPoints[k].seriesIndex + '_' + 'Point' + clusterPoints[k].pointIndex).attr('class', className);
                                $('#' + matchString + clusterPoints[k].seriesIndex + '_' + 'Point' + clusterPoints[k].pointIndex + '_symbol').attr('class', className);
                            }
                            if (chart.model._visibleSeries[seriesHighlightIndex].visibility != "hidden")
                                $('#' + this.svgObject.id + '_LegendItemShape' + seriesHighlightIndex).not("[class*='Selection']").attr('class', 'HighlightLegendStyle' + name);
                            // checked condition for financial series
                            var finName = $('#' + targetId).attr("name");
                            if (finName != undefined && (finName == 'candle' || finName.indexOf('hilo') >= 0)) {
                                $('[id$=' + matchString + clusterPoints[k].seriesIndex + '_' + 'Point' + clusterPoints[k].pointIndex + ']').attr('class', 'HighlightStyle' + name);
                            }
                        }

                    }

                    else {
                        // checked condition for whether target id is area related or not
                        if (!$('#' + targetId).attr("name") && targetId != chart.svgObject.id + '_Series' + index) {
                            selectClass = $('#' + targetId).attr('class') ? $('#' + targetId).attr('class') : '';
                            if ((selectClass.indexOf('Selection') != 0 && parentNodeId.indexOf(chart.svgObject.id + '_symbolGroup_' + index) <= 0 && (data || legendData))) {
                                if (isElement) {
                                    $('#' + targetId).attr('class', 'HighlightStyle' + name);
                                    if (this.model.commonSeriesOptions.columnFacet == 'cylinder' || series.columnFacet == 'cylinder') {
                                        for (i = 0; i < 2; i++) {
                                            $('#' + targetId.replace(/2$/, i)).attr('class', 'HighlightStyle' + name);
                                        }
                                    }
                                }
                                $('#' + targetId + '_symbol').attr('class', 'HighlightStyle' + name);
                                $('#' + this.svgObject.id + '_Series' + seriesIndex + '_Point' + pointIndex).not("[class*='Selection']").attr('class', 'HighlightStyle' + name);
                                $('#' + this.svgObject.id + '_LegendItemShape' + index).not("[class*='Selection']").attr('class', 'HighlightLegendStyle' + name);
                            }
                            if (targetId.indexOf("symbol") > -1)
                                $('#' + targetId).attr('class', 'HighlightStyle' + name);
                        }
                        // checked condition for financial series
                        var finName = $('#' + targetId).attr("name");
                        if (finName != undefined && (finName == 'candle' || finName.indexOf('hilo') >= 0)) {
                            $('[id$=' + targetId + ']').attr('class', 'HighlightStyle' + name);
                            $('#' + this.svgObject.id + '_LegendItemShape' + index).not("[class*='Selection']").attr('class', 'HighlightLegendStyle' + name);
                        }

                    }
                }
            }

        },

        // 3D style class created here
        dStyle: function (style3D, color, chart, evt, settings) {
            var vector = ej.Ej3DRender.prototype.polygon3D.prototype;
            var highlight = settings;
            var name = style3D.api;
            var seriesName = style3D.seriesName;
            var opacity = highlight.opacity;
            color = chart.colorNameToHex(color);
            if (style3D.name == "XLight")
                color = vector.applyXLight(color, chart);
            else if (style3D.name == "ZLight")
                color = vector.applyZLight(color, chart);
            else
                color = color;
            var colorStyle = {};
            colorStyle.name = style3D.name; colorStyle.color = color; colorStyle.api = name;
            color = (highlight.pattern == "none") ? color : this.pattern(chart, evt, colorStyle, highlight);
            if (document.getElementById(name + "Segment" + seriesName)) {
                var style = document.getElementById(name + "Segment" + seriesName);
                style.innerHTML = style.innerHTML + '.' + name + 'Style' + seriesName + style3D.index + ' { fill:' + color + ";opacity:" + opacity + ' }';
            } else {
                var style = document.createElement('style');
                style.id = name + "Segment" + seriesName;
                style.type = 'text/css';
                style.innerHTML = '.' + name + 'Style' + seriesName + style3D.index + ' { fill:' + color + ";opacity:" + opacity + ' }';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
            return name + "Style" + seriesName + style3D.index;

        },

        // 3D style class end

        // pattern of the SVG started here
        pattern: function (chart, evt, colorStyle, settings) {
            var hoverStyle = settings;
            var name = colorStyle.api;
            var style = hoverStyle.pattern.toLowerCase();
            var color = colorStyle.color;
            var opacity = hoverStyle.opacity != "" ? hoverStyle.opacity : $('#' + evt.target.id).attr('opacity');
            var backgroundColor = "#ffffff";
            if (document.getElementById(name + "Def")) {
                var svg = $("#" + name + "Def")[0];
            } else {
                var svgid = { 'id': name + "Def" }
                var svg = chart.svgRenderer.createPattern(svgid, 'svg');
                chart.svgRenderer.append(svg, chart.svgObject);
            }
            if (chart.model.enable3D) {
                if (colorStyle.name == "XLight")
                    backgroundColor = "#595959";
                else if (colorStyle.name == "ZLight")
                    backgroundColor = "#737373";
                else
                    backgroundColor = "#808080";
            }
            if (("#" + style + '_' + name + '_' + colorStyle.name + '_' + colorStyle.index))
                $("#" + style + '_' + name + '_' + colorStyle.name + '_' + colorStyle.index).remove();

            var pathOptions = [];
            switch (style) {
                case "chessboard":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'x': 0, 'y': 0, 'width': 10, 'height': 10 }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 10, 'height': 10, 'fill': backgroundColor, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = { 'x': 0, 'y': 0, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[2] = { 'x': 5, 'y': 5, 'width': 5, 'height': 5, 'fill': color, 'opacity': opacity, 'name': 'rect' };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "pacman":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '17.917', 'height': '18.384' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 17.917, 'height': 18.384, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M9.081,9.194l5.806-3.08c-0.812-1.496-2.403-3.052-4.291-3.052H8.835C6.138,3.063,3,6.151,3,8.723v1.679   c0,2.572,3.138,5.661,5.835,5.661h1.761c2.085,0,3.835-1.76,4.535-3.514L9.081,9.194z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "crosshatch":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '8', 'height': '8' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 8, 'height': 8, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M0 0L8 8ZM8 0L0 8Z',
                        'stroke-width': 1,
                        'stroke': color,
                        'name': 'path'
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "dots":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '6', 'height': '6' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 7, 'height': 7, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'cx': 3,
                        'cy': 3,
                        'r': 2,
                        'stroke-width': 1,
                        'fill': color,
                        'name': 'circle'
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "diagonalforward":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '6', 'height': '6' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M 3 -3 L 9 3 M 6 6 L 0 0 M 3 9 L -3 3',
                        'stroke-width': 2,
                        'stroke': color,
                        'name': 'path'
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "diagonalbackward":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '6', 'height': '6' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity, 'name': 'rect' };
                    pathOptions[1] = {
                        'd': 'M 3 -3 L -3 3 M 0 6 L 6 0 M 9 3 L 3 9',
                        'stroke-width': 2,
                        'stroke': color,
                        'name': 'path'
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "grid":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '6', 'height': '6' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 6, 'height': 6, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M1 3.5L11 3.5 M0 3.5L11 3.5 M0 7.5L11 7.5 M0 11.5L11 11.5 M5.5 0L5.5 12 M11.5 0L11.5 12Z',
                        'stroke-width': 1,
                        'stroke': color
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "turquoise":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '17', 'height': '17' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 17, 'height': 17, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M0.5739999999999998,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[2] = { 'name': 'path', 'd': 'M11.805,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[3] = { 'name': 'path', 'd': 'M6.19,2.643a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[4] = { 'name': 'path', 'd': 'M11.805,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[5] = { 'name': 'path', 'd': 'M6.19,8.217a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[6] = { 'name': 'path', 'd': 'M11.805,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    pathOptions[7] = { 'name': 'path', 'd': 'M6.19,13.899a2.123,2.111 0 1,0 4.246,0a2.123,2.111 0 1,0 -4.246,0', 'stroke-width': 1, 'stroke-miterlimit': 10, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "star":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '21', 'height': '21' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 21, 'height': 21, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M15.913,18.59L10.762 12.842 5.613 18.75 8.291 11.422 0.325 9.91 8.154 8.33 5.337 0.91 10.488 6.658 15.637 0.75 12.959 8.078 20.925 9.59 13.096 11.17 z',
                        'stroke-width': 1,
                        'stroke': color,
                        'fill': color
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "triangle":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '10', 'height': '10' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 10, 'height': 10, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'path',
                        'd': 'M4.987,0L7.48 4.847 9.974 9.694 4.987 9.694 0 9.694 2.493 4.847 z',
                        'stroke-width': 1,
                        'stroke': color,
                        'fill': color
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "circle":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '9', 'height': '9' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 9, 'height': 9, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = {
                        'name': 'circle',
                        'cx': 5.125,
                        'cy': 3.875,
                        'r': 3.625,
                        'stroke-width': 1,
                        'fill': color
                    };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "tile":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '18', 'height': '18' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 18, 'height': 18, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M0,9L0 0 9 0 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[2] = { 'name': 'path', 'd': 'M9,9L9 0 18 0 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[3] = { 'name': 'path', 'd': 'M0,18L0 9 9 9 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    pathOptions[4] = { 'name': 'path', 'd': 'M9,18L9 9 18 9 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "horizontaldash":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '12', 'height': '12' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 12, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M0,1.5 L10 1.5 M0,5.5 L10 5.5 M0,9.5 L10 9.5 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "verticaldash":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '12', 'height': '12' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 12, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M1.5,0 L1.5 10 M5.5,0 L5.5 10 M9.5,0 L9.5 10 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "rectangle":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'x': 0, 'y': 0, 'width': 12, 'height': 12 }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'width': 12, 'height': 12, 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'rect', 'x': 1, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                    pathOptions[2] = { 'name': 'rect', 'x': 7, 'y': 2, 'width': 4, 'height': 9, 'fill': color, 'opacity': opacity };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "box":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'x': 0, 'y': 0, 'width': 10, 'height': 10 }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'width': 13, 'height': 13, 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'rect', 'x': 1.5, 'y': 1.5, 'width': 10, 'height': 9, 'fill': color, 'opacity': opacity };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "horizontalstripe":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '10', 'height': '12' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 10, 'height': 12, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M0,0.5 L10 0.5 M0,4.5 L10 4.5 M0,8.5 L10 8.5 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "verticalstripe":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '12', 'height': '10' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 12, 'height': 10, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'path', 'd': 'M0.5,0 L0.5 10 M4.5,0 L4.5 10 M8.5,0 L8.5 10 z', 'stroke-width': 1, 'stroke': color, 'fill': color };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "bubble":
                    var patternGroup = { 'id': style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index, 'patternUnits': 'userSpaceOnUse', 'width': '20', 'height': '20' }
                    var pattern = chart.svgRenderer.createPattern(patternGroup, 'pattern');
                    pathOptions[0] = { 'name': 'rect', 'x': 0, 'y': 0, 'width': 20, 'height': 20, 'transform': "translate(0,0)", 'fill': backgroundColor, 'opacity': opacity };
                    pathOptions[1] = { 'name': 'circle', 'cx': 5.217, 'cy': 11.325, 'r': 3.429, 'stroke-width': 1, 'fill': '#D0A6D1' };
                    pathOptions[2] = { 'name': 'circle', 'cx': 13.328, 'cy': 6.24, 'r': 4.884, 'stroke-width': 1, 'fill': color };
                    pathOptions[3] = { 'name': 'circle', 'cx': 13.277, 'cy': 14.66, 'r': 3.018, 'stroke-width': 1, 'fill': '#D0A6D1' };
                    this.loadPattern(chart, pathOptions, pattern);
                    svg.appendChild(pattern);
                    return "url(#" + style + "_" + name + "_" + colorStyle.name + "_" + colorStyle.index + ")";
                case "custom":
                    return "url(#" + hoverStyle.customPattern + ")";
            }

        },
        loadPattern: function (chart, options, pattern, ctx) {
            var path;
            for (var i = 0; i < options.length; i++) {
                if (!ctx) {
                    path = chart.svgRenderer.createPattern(options[i], options[i].name);
                    pattern.appendChild(path);
                } else {
                    if (options[i].name == 'rect') {
                        options[i].stroke = 'transparent';
                        this.drawRect(options[i], ctx);
                    }
                    else if (options[i].name == 'path')
                        ej.EjCanvasRender.prototype.drawPath(options[i], ctx);
                    else if (options[i].name == 'circle') {
                        options[i].stroke = 'transparent';
                        ej.EjCanvasRender.prototype.drawCircle(options[i], ctx);
                    }
                }
            }
        },
        drawRect: function (options, element) {
            element.save();
            element.beginPath();
            element.globalAlpha = options.opacity;
            element.lineWidth = options["stroke-width"];
            element.strokeStyle = options.stroke;
            element.rect(options.x, options.y, options.width, options.height);
            if (options.fill == "none") options.fill = "transparent";
            element.fillStyle = options.fill;
            if (options.transform) element.translate(options.transform[0], options.transform[1]);
            element.rotate(options.rotate * Math.PI / 180);
            element.fillRect(options.x, options.y, options.width, options.height);
            element.clip();
            element.stroke();
            element.restore();
        },
        // pattern of the SVG end
        // SVG highlight and selection end

        chartRightClick: function (evt) {
            this.chartRightClick = true;
            if (this.isTouch(evt) && this.model.crosshair.visible) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        },

        chartMouseUpTouch: function (evt) {
            var chart = this,
                matched = jQuery.uaMatch(navigator.userAgent),
                mouseMoveCords = this.calMousePosition(evt),
                browserInfo = this.model.browserInfo,
                element;
            this.mousemoveX = mouseMoveCords.X;
            this.mousemoveY = mouseMoveCords.Y;
            this.enableTrackBall();

            clearTimeout(this.model.doubleTapTimer);

            if (!this.drag)
                this.model.doubleTapTimer = setTimeout(function () {
                    if ((chart.model.tapNum < 2 || chart.model.crosshair.visible))
                        chart.singleTap(evt);
                    chart.model.tapNum = 0;
                    chart.model.cachedX = 0;
                    chart.model.cachedY = 0;

                }, 200);

            if (chart.model.tapNum == 2)
                chart.model.doubleTapped = false;

            return true;
        },
        getEvent: function (event) {
            return event.targetTouches && event.targetTouches[0] ? event.targetTouches[0] : event
        },

        // Method to check the double tap in chart.
        doubleTap: function (e) {

            var pointer = this.getEvent(e),
                currX = pointer.pageX,
                currY = pointer.pageY,
                model = this.model,
                padding = 200,
                element,
                bounds = model.m_AreaBounds;

            this.model.cachedX = this.model.cachedX || currX;

            this.model.cachedY = this.model.cachedY || currY;

            var timestamp = new Date().getTime();


            if (this.mouseDownX >= bounds.X && this.mouseDownX < (bounds.X + bounds.Width) && this.mouseDownY < (bounds.Y + bounds.Height) && this.mouseDownY >= bounds.Y && Math.abs(currX - this.model.cachedX) < padding && Math.abs(currY - this.model.cachedY) < padding)
                this.model.tapNum++;


            if (this.model.tapNum == 2) {
                this.model.doubleTapped = true;
                this.multiSelectMouseDown(e);
                this.drag = this.model.zooming.enable || this._isMultiSelect;
                element = this.model.trackerElement;
                if (element) {
                    $(element).finish();
                    element = null;
                }
            }

        },
        // Method invoking userinteraction in single Tap.
        singleTap: function (evt) {
            var chart = this,
                targetid = evt.target.id,
                seriesCollection = this.model._visibleSeries,
                element,
                pointer = this.getEvent(evt),
                currX = pointer.pageX,
                currY = pointer.pageY,
                swipeThreshold = 10;

            if ((!this.panning && !this.isZoomButtonHovered(evt.target))) {
                this.cancelEvent(evt);
                if (chart.model.trackerElement) {
                    if ($.finish)
                        $(chart.model.trackerElement).finish();
                    else
                        $(chart.model.trackerElement).stop(true, true);
                    chart.model.trackerElement = null;
                }
                $(".ejTooltip" + this._id).remove();
                //if ($(element).find("#" + chart.svgObject.id + "_CrosshairGroup").length==0) {
                if ((!chart.model.crosshair.visible || chart.model.AreaType != "cartesianaxes") && Math.abs(currX - chart.model.cachedX) < swipeThreshold && Math.abs(currY - chart.model.cachedY) < swipeThreshold) {
                    this.chartInteractiveBehavior(evt);
                }

                else {

                    chart.model.element = $(document).find("#" + this.svgObject.id + "_CrosshairGroup");
                    chart.model.trackerElement = $(chart.model.element).children().not('.Tracker').not("defs");
                    if ($(chart.model.trackerElement).length > 0)
                        $(chart.model.trackerElement).fadeOut(1000, function () {
                            $(chart.model.element).find('[id*="trackSymbol"]').attr("visibility", "hidden");
                            chart.model.trackerElement = null;
                            chart._removeHighlight();
                        });
                    var groupElement = $(document).find('[id*="_trackball_grouping_tooltip"]');
                    if ($(groupElement).length > 0)
                        $(groupElement).fadeOut(1000, function () {
                            $(groupElement).remove();
                        });
                }

                this.axisTooltip(evt, targetid);

                this.showTitleTooltip(evt, targetid);

                if (this.model.enableCanvasRendering) {
                    this._textTooltip(evt, this.model.xAxisLabelRegions);
                    this._textTooltip(evt, this.model.yAxisLabelRegions);
                }

                for (var i = 0, seriesLength = this.model.series.length; i < seriesLength; i++) {
                    var series = this.model.series[i], dataLabel = series.marker.dataLabel;
                    if (series._enableSmartLabels && !this.model.enable3D && !dataLabel.enableWrap) {
                        var template = dataLabel.template;
                        var font = dataLabel.font;
                        if (this.model.AreaType == "none" && ej.util.isNullOrUndefined(template)) {
                            this.datalabelTooltip(evt, i, font);
                        }
                    }
                }

                if ($(".ejTooltip" + this._id).length > 0)
                    element = $(".ejTooltip" + this._id);
                if ($(".tooltipDiv" + this._id).length > 0)
                    element = $(".tooltipDiv" + this._id);
                window.clearTimeout(chart.model.timer);
                chart.model.trackerElement = element;
                chart.model.timer = setTimeout(function () {
                    var pointData = chart.model.prevPoint;
                    if (chart.model.trackerElement) {
                        chart.model.trackerElement.fadeOut(500, function () {
                            if (pointData) {
                                if (chart.model.AreaType != "polaraxes") {
                                    var prevLocation = ej.EjSvgRender.utils._getPoint(pointData.point, pointData.series);
                                    chart.drawTrackerSymbol(pointData.series, pointData.seriesIndex, pointData.pointIndex, null, prevLocation);
                                }
                                $("#" + "canvas" + "_trackSymbol").remove();
                            }
                            $("[id*=" + "_TrackSymbol" + "]").remove();
                        });
                    }
                    else {
                        if (pointData) {
                            if (chart.model.AreaType != "polaraxes") {
                                var prevLocation = ej.EjSvgRender.utils._getPoint(pointData.point, pointData.series);
                                chart.drawTrackerSymbol(pointData.series, pointData.seriesIndex, pointData.pointIndex, null, prevLocation);
                            }
                        }
                        if (!chart.model.crosshair.visible) {
                            $("#" + "canvas" + "_trackSymbol").remove();
                            $("[id*=" + "_TrackSymbol" + "]").remove();
                        }
                    }

                }, 1200);


            }
            if (!evt.originalEvent.pointerType && !this.panning && (this.model.selectionEnable || ((this.isDevice() && this._isSafari))))
                this._doClick(evt);
        },
        _getPieOfPiePoint: function (index, series, legenddata) {
            var visiblePoints = legenddata ? series.points : series._visiblePoints;
            var length = visiblePoints.length;
            for (var j = 0; j < length; j++) {
                if (index == visiblePoints[j].actualIndex)
                    var seriesPoint = visiblePoints[j];
            }
            return seriesPoint;
        },
        tooltip: function (chart, evt) {
            var tooltipShowing = false;
            var chartSeries;
            var seriesIndex;
            var data = this.GetSeriesPoint(evt);
            $("#" + "canvas" + "_trackSymbol").remove();
            if (ej.util.isNullOrUndefined(data) && !this.dragPoint) // To hide the tooltip when it is moved on chartArea other than series
                $("#" + chart.svgObject.id + "_TrackToolTip").remove();

            if (!this.model.crosshair.visible && this.model.AreaType == "cartesianaxes") {
                var indicators = this.model.indicators,
                    seriesCollection = this.model._visibleSeries,
                    currentIndicator, l, k, trendLines,
                    length = seriesCollection.length;
                var trackcount = 0;
                for (k = 0; k < length; k++) {
                    trendLines = seriesCollection[k].trendlines;
                    for (l = 0; l < trendLines.length; l++) {
                        if (trendLines[l].visibility.toLowerCase() == "visible" && !trendLines[l].isNull && this.model.series[0].type != "boxandwhisker") {
                            trendLines[l]._visiblePoints = trendLines[l].points;
                            seriesCollection = seriesCollection.concat(trendLines[l]);
                        }
                    }
                }

                for (var j = 0; j < indicators.length && indicators[j].segment; j++) {
                    currentIndicator = indicators[j];
                    if (currentIndicator.visible)
                        seriesCollection = seriesCollection.concat(currentIndicator.segment);
                }
                var seriesCollectionLength = seriesCollection.length;
                for (var i = 0; i < seriesCollectionLength; i++) {
                    chartSeries = seriesCollection[i];
                    seriesIndex = i;

                    var type = chartSeries.type.toLowerCase();
                    if (chartSeries.visibility.toLowerCase() == 'visible' && type !== "scatter" && type !== "bubble" && type !== "column" && (type.indexOf("bar") == -1) && type !== "stackingcolumn" && type !== "stackingcolumn100" && !chartSeries._hiloTypes) {
                        $("#" + chart.svgObject.id + "_TrackToolTipTemplate_" + seriesIndex).remove();
                        if (!($(".tooltipDiv" + this._id).hasClass(chart.svgObject.id)))
                            $(".tooltipDiv" + this._id).remove();
                        $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackSymbol" + '_' + seriesIndex).remove();
                        $('#' + chart.svgObject.id + '_TrackSymbol' + '_' + seriesIndex).remove();
                        var serY = [];
                        var serX = [];
                        location = null;
                        var closestXyPoint = chart.getClosesPointXY(serX, serY, chartSeries, chart.mousemoveX, chart.mousemoveY, evt);
                        if (ej.util.isNullOrUndefined(closestXyPoint.point) && (!this.model.prevPoint || (this.model.prevPoint.seriesIndex && !this.model.series[this.model.prevPoint.seriesIndex].tooltip.visible)) && !this.dragPoint && ($(".tooltipDiv" + this._id).hasClass(this.svgObject.id))) {
                            clearTimeout(this.removeTooltip);
                            chart.removeTooltip = setTimeout(function () {   // To hide the tooltip when it is moved on chartArea other than series
                                $(".tooltipDiv" + chart._id).remove();
                            }, 1000);
                        }
                        if (closestXyPoint.point) {
                            if (chartSeries.type.toLowerCase() == "boxandwhisker") {
                                trackcount++;
                                location = closestXyPoint.outlierPosition;
                            } else
                                location = ej.EjSvgRender.utils._getPoint(closestXyPoint.point, chartSeries);
                            var commonPointEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                            commonPointEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveX }, region: { SeriesIndex: i, Region: { PointIndex: closestXyPoint.index } } };
                            chart._trigger("pointRegionMouseMove", commonPointEventArgs);
                        }
                        var pointData = this.model.prevPoint;
                        if (pointData && pointData.seriesIndex == i && !closestXyPoint.point) {
                            if (chartSeries.type.toLowerCase() == "boxandwhisker") {
                                trackcount++;
                                pointLocation = pointData.outlierPosition;

                            }
                            else
                                var pointLocation = ej.EjSvgRender.utils._getPoint(pointData.point, pointData.series);
                            if (!chart.model.enableCanvasRendering) // No need to draw again in canvas chart after explode marker
                                chart.drawTrackerSymbol(pointData.series, pointData.seriesIndex, pointData.pointIndex, null, pointLocation);
                            this.model.prevPoint = null;
                        }
                        if (!chartSeries.isIndicator && !chartSeries.isTrendLine && !chartSeries.selectionSettings.enable && !chartSeries.highlightSettings.enable && (chartSeries.marker.visible || chartSeries.type.toLowerCase() == "boxandwhisker") && closestXyPoint.point && !commonPointEventArgs.cancel) {
                            if (ej.util.isNullOrUndefined(closestXyPoint.point.marker) || ej.util.isNullOrUndefined(closestXyPoint.point.marker.visible) || (closestXyPoint.point.marker && closestXyPoint.point.marker.visible))
                                chart.drawTrackerSymbol(chartSeries, seriesIndex, closestXyPoint.index, false, location);
                            else if (chartSeries.type == "boxandwhisker" && !closestXyPoint.point.marker)
                                chart.drawTrackerSymbol(chartSeries, seriesIndex, closestXyPoint.index, false, location);
                            if (pointData && closestXyPoint.point != pointData.point) {
                                if (chartSeries.type.toLowerCase() == "boxandwhisker") {
                                    trackcount++;
                                    prevLocation = pointData.outlierPosition;
                                }
                                else
                                    var prevLocation = ej.EjSvgRender.utils._getPoint(pointData.point, pointData.series);
                                chart.drawTrackerSymbol(pointData.series, pointData.seriesIndex, pointData.pointIndex, null, prevLocation, id, trackcount);
                            }
                            if (ej.util.isNullOrUndefined(closestXyPoint.point.marker) || ej.util.isNullOrUndefined(closestXyPoint.point.marker.visible) || (closestXyPoint.point.marker && closestXyPoint.point.marker.visible))
                                this.model.prevPoint = { point: closestXyPoint.point, pointIndex: closestXyPoint.index, series: chartSeries, seriesIndex: seriesIndex, outlierPosition: closestXyPoint.outlierPosition };
                        }


                        if (chartSeries.tooltip.visible && closestXyPoint.point && (!data || (i > data.region.SeriesIndex && !(chartSeries._zOrder < this.model._visibleSeries[data.region.SeriesIndex]._zOrder)))) {
                            trans = ej.EjSvgRender.utils._getTransform(chartSeries.xAxis, chartSeries.yAxis, chart.model.requireInvertedAxes);
                            if ((location.X + trans.x) <= (trans.x + trans.width) && ((location.X + trans.x) >= trans.x || location.X == 0) && (Math.abs(location.Y - (trans.y + trans.height)) <= (trans.y + trans.height))
                                && (Math.abs(location.Y - (trans.y + trans.height)) >= trans.y || location.Y == 0)) {
                                if (!commonPointEventArgs.cancel) {
                                    if ($(chart.svgObject).find("#" + chart.svgObject.id + "_TrackToolTip").length == 0) {
                                        var transOptions = { 'id': chart.svgObject.id + '_TrackToolTip', 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
                                        chart.gTransToolEle = chart.svgRenderer.createGroup(transOptions);
                                    }
                                    chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_TrackToolTip"), { 'transform': 'translate(' + trans.x + ',' + trans.y + ')', 'visibility': 'visible' });
                                    if (ej.util.isNullOrUndefined(chartSeries.tooltip.template)) {
                                        tooltipShowing = true;
                                        $(".tooltipDiv" + this._id).remove();
                                        chart.displayShowTooltip(location, closestXyPoint.point, chartSeries, closestXyPoint.index);
                                    }
                                    else {
                                        tooltipShowing = true;
                                        $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                                        var region = { SeriesIndex: seriesIndex, Region: { PointIndex: closestXyPoint.index } };
                                        chart.createTooltip(region, evt, chartSeries);
                                    }

                                    //Comment the below code for VML -The line series tooltip color not displayed due to attach and detach the element to DOM
                                    // var detachEle = $(chart.svgObject).find("#" + chart.svgObject.id + "_TrackToolTip").detach();
                                    //detachEle.appendTo(chart.svgObject);
                                }

                            }
                        }
                    }
                    else if (ej.util.isNullOrUndefined(data) && !this.dragPoint && ($(".tooltipDiv" + this._id).hasClass(this.svgObject.id))) {
                        clearTimeout(this.removeTooltip);
                        chart.removeTooltip = setTimeout(function () {   // To hide the tooltip when it is moved on chartArea other than series
                            $(".tooltipDiv" + chart._id).remove();
                        }, 1000);
                    }
                }
            }
            else {
                $("#" + this.svgObject.id).find("#" + this.svgObject.id + "_TrackToolTip").hide();
                if (ej.util.isNullOrUndefined(data)) {
                    clearTimeout(this.removeTooltip);
                    chart.removeTooltip = setTimeout(function () {   // To hide the tooltip when it is moved on chartArea other than series
                        $(".tooltipDiv" + chart._id).remove();
                    }, 1000);
                }
            }

            if (!($(".tooltipDiv" + this._id).hasClass(this.svgObject.id)))
                $(".tooltipDiv" + this._id).remove();
            if (data && ej.util.isNullOrUndefined(data.region.isStripLine)) {
                var seriesType = this.model._visibleSeries[data.region.SeriesIndex].type.toLowerCase();
                if ((seriesType == "pie" || seriesType == "pieofpie" || seriesType == "doughnut") && this.model._visibleSeries[data.region.SeriesIndex].explode) {
                    if (this.model._visibleSeries[data.region.SeriesIndex].enableAnimation) {
                        if (this.model.AnimationComplete || this.model.enableCanvasRendering)
                            this.pieExplosion(data, evt);
                    }
                    else if (!this.model.enable3D)
                        this.pieExplosion(data, evt);
                }
                if (data.region.isIndicator) {
                    series = this.model.indicators[data.region.SeriesIndex];
                    var seriesPoint = series.segment[0]._visiblePoints[data.region.Region.PointIndex];
                    series.fill = series.segment[0].fill;
                } else {
                    series = this.model._visibleSeries[data.region.SeriesIndex];
                    if (series.type == "pieofpie" && !this.model.enable3D)
                        var seriesPoint = this._getPieOfPiePoint(data.region.Region.PointIndex, series);
                    else if ((series.type == "pie" || series.type == "doughnut") && !this.model.enable3D) {
                        for (var v = 0; v < series._visiblePoints.length; v++) {
                            if (data.region.Region.length == series._visiblePoints.length) {
                                if (data.region.Region.PointIndex == series._visiblePoints[v].actualIndex) {
                                    var seriesPoint = this.model._visibleSeries[data.region.SeriesIndex]._visiblePoints[v];
                                    break;
                                }
                            }
                            else {
                                if (data.region.Region.Index == v) {
                                    var seriesPoint = this.model._visibleSeries[data.region.SeriesIndex]._visiblePoints[v];
                                    break;
                                }
                            }
                        }
                    }
                    else
                        var seriesPoint = this.model._visibleSeries[data.region.SeriesIndex]._visiblePoints[data.region.Region.PointIndex];
                }

                if (seriesPoint && this.model.AreaType == 'polaraxes') {
                    for (var i = 0; i < this.model._visibleSeries.length; i++) {
                        $("[id*=" + "_TrackSymbol" + "]").remove();
                        var trackId = "canvas_trackSymbol_" + i;
                        $("#" + this._id).find('[id*=' + trackId + ']').remove();
                    }
                    var pointlocation = (this.model.AreaType != "polaraxes")
                        ? ej.EjSvgRender.utils._getPoint(seriesPoint, series)
                        : (ej.EjSvgRender.utils.TransformToVisible(series, seriesPoint.xValue, seriesPoint.y, this))
                    var prevPoint = this.model.prevPoint;
                    if (!ej.util.isNullOrUndefined(prevPoint) && prevPoint != data && series.marker.visible) {
                        var series = this.model._visibleSeries[prevPoint.region.SeriesIndex],
                            prevSeriesPoint = this.model._visibleSeries[prevPoint.region.SeriesIndex]._visiblePoints[prevPoint.region.Region.PointIndex],
                            prevlocation = ej.EjSvgRender.utils.TransformToVisible(series, prevSeriesPoint.xValue, prevSeriesPoint.y, this);
                        this.drawTrackerSymbol(series, prevPoint.region.SeriesIndex, prevPoint.region.Region.PointIndex, null, prevlocation);
                        this.model.prevPoint = null;
                    }
                    if ((series.marker.visible && series.drawType != "column") && (series.drawType.toLowerCase() != "rangecolumn")) {
                        this.drawTrackerSymbol(series, data.region.SeriesIndex, data.region.Region.PointIndex, true, pointlocation);
                        this.model.prevPoint = data;
                    }
                }

                if (series.tooltip.visible && !tooltipShowing) {

                    if (series.visibility.toLowerCase() == 'visible') {
                        if (ej.util.isNullOrUndefined(series.tooltip.template)) {
                            var location;
                            if (this.model.AreaType == "cartesianaxes") {

                                var trans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, this.model.requireInvertedAxes);
                                if ($(this.svgObject).find("#" + this.svgObject.id + "_TrackToolTip").length == 0) {
                                    var transToolOptions = { 'id': this.svgObject.id + '_TrackToolTip', 'transform': 'translate(' + trans.x + ',' + trans.y + ')' };
                                    this.gTransToolEle = this.svgRenderer.createGroup(transToolOptions);
                                }
                                this.svgRenderer._setAttr($(this.svgObject).find("#" + this.svgObject.id + "_TrackToolTip"), { 'transform': 'translate(' + trans.x + ',' + trans.y + ')' });
                                $('#' + this.svgObject.id + "_TrackToolTip").attr("visibility", "visible");
                                location = { X: (data.location.x - this.model.m_AreaBounds.X), Y: Math.abs(data.location.y - (this.model.m_AreaBounds.Y)) };
                            } else {
                                if ($(this.svgObject).find("#" + this.svgObject.id + "_TrackToolTip").length == 0) {
                                    var transToolTipOptions = { 'id': this.svgObject.id + '_TrackToolTip' };
                                    this.gTransToolEle = this.svgRenderer.createGroup(transToolTipOptions);
                                }
                                location = { X: (data.location.x), Y: Math.abs(data.location.y) };
                            }


                            $(".tooltipDiv" + this._id).remove();
                            this.displayShowTooltip(location, seriesPoint, series, data.region.Region.PointIndex);

                            //Comment the below code for VML -The line series tooltip color not displayed due to attach and detach the element to DOM
                            // if (series.type.toLowerCase() == "bubble" || series.type.toLowerCase() == "scatter") {
                            //     var detachEle = $(this.svgObject).find("#" + this.svgObject.id + "_TrackToolTip").detach();
                            //    detachEle.appendTo(this.svgObject);
                            // }
                        } else {
                            $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                            this.createTooltip(data.region, evt);
                        }
                    }
                }
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = data;
                this._trigger("pointRegionMouseMove", commonEventArgs);
            }
            else if (!ej.util.isNullOrUndefined(this.model.prevPoint) && this.model.AreaType == "polaraxes") {
                var prevPoint = this.model.prevPoint;
                series = this.model._visibleSeries[prevPoint.region.SeriesIndex];
                seriesPoint = this.model._visibleSeries[prevPoint.region.SeriesIndex]._visiblePoints[prevPoint.region.Region.PointIndex];
                pointlocation = ej.EjSvgRender.utils.TransformToVisible(series, seriesPoint.xValue, seriesPoint.y, this);
                this.drawTrackerSymbol(series, prevPoint.region.SeriesIndex, prevPoint.region.Region.PointIndex, null, pointlocation);
                this.model.prevPoint = null;
            }
            else {
                if (!ej.util.isNullOrUndefined(this.model.explodeValue)) {
                    var type = this.model.series[this.model.explodeValue.SeriesIndex].type.toLowerCase();
                    var series = this.model._visibleSeries[this.model.explodeValue.SeriesIndex];
                    var seriesType = new ej.seriesTypes[type]();
                    var targetElement;
                    var id;
                    var _labelPosition = series.labelPosition.toLowerCase();
                    var seriesIndex = this.model.explodeValue.SeriesIndex;
                    var visiblePoint = (this.model._isPieOfPie) ? this._getPieOfPiePoint(this.model.explodeValue.PointIndex, series) : series._visiblePoints[this.model.explodeValue.Index];
                    var result = seriesType._calculateArcData(this, this.model.explodeValue.PointIndex, visiblePoint, series, seriesIndex, this.model.explodeValue.PieSeriesIndex);
                    if (this.model.enableCanvasRendering) {
                        this.model.series[seriesIndex].explodeIndex = null;
                        var chartRect = document.getElementById(this.svgObject.id).getClientRects()[0];
                        this.svgRenderer.ctx.clearRect(chartRect.left, chartRect.top, chartRect.width, chartRect.height);
                        $("#" + this._id).ejChart("redraw");
                    }
                    id = this.svgObject.id + '_SeriesGroup' + '_' + seriesIndex;
                    targetElement = this.model.explodeValue.PieSeriesIndex == 1 ? $(this.gSeriesEle).children('#' + id)[1] : $(this.gSeriesEle).children('#' + id)[0];
                    var elements = $(targetElement).children();
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        var index = this.svgRenderer._getAttrVal($(element)[0], "data-pointIndex");
                        if (parseInt(index) == this.model.explodeValue.PointIndex) {
                            this.svgRenderer._setAttr($(element), { 'd': result.Direction });
                            break;
                        }
                    }
                    seriesType.drawDataLabelAcc(this, series, this.model.explodeValue.Index, visiblePoint, seriesIndex, this.model.explodeValue.PieSeriesIndex);
                    this.model.explodeValue = null;
                    this.model.explode = false;
                }
            }
        },

        chartTrackball: function (chart, mouseLocation, evt) {
            this.crosshairLinePath = [];
            var requireInvertedAxes = chart.model.requireInvertedAxes, store = [], color = [], point, seriesColor, closePointLength, seriesIndex, series, dir, indicators = this.model.indicators, seriesCollection = this.model._visibleSeries,
                showTrackLine = false, seriesIndex, serX, insideBounds, closestPoint, seriesArray = [], visibleRange, chartPos, pathOptions, leftPos, topPos, chartAreaStartPos, chartAreaEndPos, pointPos, seriesLength, data,
                crossHairTrans, tToolOptions, prePoint, initialPoint, rectxt, tooltipfont, textarea, tgap = 0, currentLength, tX, tY, chartLocation, element, visiblepts = [], tooltipRanges = [],
                DisplayTooltipOptions = [], enableCanvas = this.model.enableCanvasRendering, totalVisible = 0, maxWidth = 0, heightwidth = 0, chartOffset = $("#" + this._id).offset(),
                textCollection = [], textOptionsCollection = [], groupingTextId = [], trackballDisplayMode = this.model.crosshair.trackballTooltipSettings.mode.toLowerCase(), groupTooltipId = chart._id + "_trackball_grouping_tooltip",
                locale = this.model.locale, boxSeriesCount = 0, trackOutlier = 0;
            if ((!this.model.enable3D) && this.model.crosshair.visible && this.model.crosshair.type.toLowerCase() == "trackball") {

                if ($("#" + this.svgObject.id + "_CrosshairGroup").length == 0) {     // condition to check track axis tooltip is existing in DOM
                    var gTrackballOptions = { 'id': chart.svgObject.id + '_CrosshairGroup', 'visibility': 'visible' };
                    if (enableCanvas) {
                        gTrackballOptions.position = "absolute";
                        chart.svgRenderer.drawCrosshairLine(gTrackballOptions, '#chartContainer_' + this._id);
                    }
                    else {
                        chart.gTrackball = chart.svgRenderer.createGroup(gTrackballOptions);
                        chart.svgRenderer.append(chart.gTrackball, chart.svgObject);
                    }
                }
                else {
                    if (chart.model.trackerElement) {
                        if ($.finish)
                            $(chart.model.trackerElement).finish();
                        else
                            $(chart.model.trackerElement).stop(true, true);
                        chart.model.trackerElement = null;
                    }
                }
                if (!this.model.enableCanvasRendering) {
                    // removed highlight style
                    $("[class*=" + "HighlightStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightLegendStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightLegendPathStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightPathStyle" + "]").attr('class', '');
                    $("[class*=" + "Highlightseries" + "]").attr('class', '');
                    $("[id*=" + this._id + "_Highlight_" + "]").remove();// removed canvas highlight           
                }
                //Hiding previous trackball and tooltip when moving from one column to another
                $("#secondCanvas").remove(), $("#" + this._id).find('[id*="_gTooltip_"]').remove(), $("#" + groupTooltipId).children().remove(), $(document).find('[id*="TrackGroupToolTipTemplate"]').remove(), $(document).find('[id*="TrackToolTipTemplate"]').remove();
                if (enableCanvas) {
                    $("#" + this._id).find('[id*="canvas_trackSymbol"]').css("visibility", "hidden");
                }
                var seriesLenIndicator = seriesCollection.length;
                for (var j = 0; j < indicators.length && indicators[j].segment; j++) {
                    seriesCollection = seriesCollection.concat(indicators[j].segment);
                }
                seriesLength = seriesCollection.length;
                for (var i = 0; i < seriesLength; i++) {
                    if (seriesCollection[i].visibility == "visible" && seriesCollection[i].enableTrackTooltip) {
                        seriesIndex = i;
                        serX = [];

                        if (!requireInvertedAxes)
                            insideBounds = chart.mousemoveX + seriesCollection[i].xAxis.plotOffset > seriesCollection[i].xAxis.x && chart.mousemoveX < seriesCollection[i].xAxis.x + seriesCollection[i].xAxis.width + seriesCollection[i].xAxis.plotOffset;
                        else
                            insideBounds = chart.mousemoveY + seriesCollection[i].xAxis.plotOffset > seriesCollection[i].xAxis.y && chart.mousemoveY < seriesCollection[i].xAxis.y + seriesCollection[i].xAxis.height + seriesCollection[i].xAxis.plotOffset;
                        if (enableCanvas)
                            this.canvasX = seriesCollection[i].xAxis.x;
                        closestPoint = chart.getClosestPointX(serX, seriesCollection[i], chart.mousemoveX, chart.mousemoveY);
                        visibleRange = seriesCollection[i].xAxis.visibleRange;   // condition to check the closestPoint is inside the visible range
                        if (closestPoint.point != "") {
                            var closestPointValues = seriesCollection[i].type.toLowerCase() == "boxandwhisker" ? closestPoint.point[0].boxPlotLocation[0].YValues : closestPoint.point[0].YValues[0];
                            if (closestPoint.point != "" && (closestPointValues >= seriesCollection[i].yAxis.visibleRange.min || trackballDisplayMode == "grouping") && (closestPoint.point[0].xValue >= visibleRange.min) && (closestPoint.point[0].xValue <= visibleRange.max)) {
                                if (insideBounds) {
                                    for (var t = 0; t < closestPoint.point.length; t++) {
                                        if (closestPoint.point[t].visible) {
                                            if (!seriesCollection[i].isIndicator) {
                                                totalVisible++;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                for (var i = 0; i < seriesLength; i++) {
                    //   if(seriesCollection[0].xAxis.name == seriesCollection[i].xAxis.name)
                    seriesIndex = i, series = seriesCollection[i];
                    var trackPoints = [];
                    if (series.visibility.toLowerCase() == 'visible' && series.enableTrackTooltip) {
                        serX = [];
                        if (!requireInvertedAxes)
                            insideBounds = chart.mousemoveX + seriesCollection[i].xAxis.plotOffset > series.xAxis.x && chart.mousemoveX < series.xAxis.x + series.xAxis.width + seriesCollection[i].xAxis.plotOffset;
                        else
                            insideBounds = chart.mousemoveY + seriesCollection[i].xAxis.plotOffset > series.xAxis.y && chart.mousemoveY < series.xAxis.y + series.xAxis.height + seriesCollection[i].xAxis.plotOffset;
                        if (enableCanvas)
                            this.canvasX = series.xAxis.x;
                        closestPoint = chart.getClosestPointX(serX, series, chart.mousemoveX, chart.mousemoveY);
                        visibleRange = series.xAxis.visibleRange;   // condition to check the closestPoint is inside the visible range
                        var point1;
                        if (closestPoint.point != "") {
                            var closestPointValues = seriesCollection[i].type.toLowerCase() == "boxandwhisker" ? closestPoint.point[0].boxPlotValues.midvalue : closestPoint.point[0].YValues[0];
                            if ((closestPointValues >= seriesCollection[i].yAxis.visibleRange.min || trackballDisplayMode == "grouping") && (closestPoint.point[0].xValue >= visibleRange.min) && (closestPoint.point[0].xValue <= visibleRange.max)) {
                                if (insideBounds) {
                                    var closePointLength = closestPoint.point.length;
                                    for (var t = 0; t < closePointLength; t++) {
                                        if (closestPoint.point[t].visible) {
                                            if (!series.isIndicator) {
                                                if (series.type == "boxandwhisker") {
                                                    boxSeriesCount++;
                                                    var boxvalue = { "xValue": closestPoint.point[t].xValue, "YValues": closestPoint.point[t].boxPlotLocation[0].YValues };
                                                    point = ej.EjSvgRender.utils._getPoint(boxvalue, series);
                                                    point.YValues = boxvalue.YValues;
                                                    trackPoints.push(point);
                                                    for (var q = 0; q < closestPoint.point[t].boxPlotLocation.length; q++) {
                                                        if (closestPoint.point[t].boxPlotLocation[q].outlier == true) {
                                                            point1 = { X: closestPoint.point[t].boxPlotLocation[q].X, Y: closestPoint.point[t].boxPlotLocation[q].Y, YValues: closestPoint.point[t].boxPlotLocation[q].YValues, outlier: closestPoint.point[t].boxPlotLocation[q].outlier };
                                                            trackPoints.push(point1);
                                                        }
                                                    }
                                                } else
                                                    point = ej.EjSvgRender.utils._getPoint(closestPoint.point[t], series);
                                                this.model.financial = seriesLenIndicator == 1 && closePointLength == 1 && series._hiloTypes || false;
                                                if (requireInvertedAxes) {
                                                    if (this.model.financial) {
                                                        var high = point.X > point.low ? point.X : point.low;
                                                        var low = point.X < point.low ? point.X : point.low;
                                                        dir = "M" + " " + (series.yAxis.x) + " " + (point.Y + series.xAxis.y) + " " + "L" + " " + (low + series.yAxis.x) + " " + (point.Y + series.xAxis.y) + " " + "M" + " " + (series.yAxis.x + high) + " " + (point.Y + series.xAxis.y) + " " + "L" + " " + (series.yAxis.x + series.yAxis.width) + " " + (point.Y + series.xAxis.y);
                                                    }
                                                    else
                                                        dir = "M" + " " + (series.yAxis.x) + " " + (point.Y + series.xAxis.y) + " " + "L" + " " + (series.yAxis.x + series.yAxis.width) + " " + (point.Y + series.xAxis.y);
                                                    if (series.type == "boxandwhisker") {
                                                        for (var p = 0; p < trackPoints.length; p++) {
                                                            visiblepts.push({ X: (trackPoints[p].X), Y: (trackPoints[p].Y), YValues: trackPoints[p].YValues, outlier: trackPoints[p].outlier });
                                                        }
                                                    } else
                                                        visiblepts.push({ X: (closestPoint.point[t].location.X + series.yAxis.x), Y: (closestPoint.point[t].location.Y + series.xAxis.y) });
                                                }
                                                else {
                                                    if (this.model.financial) {
                                                        var high = point.Y < point.low ? point.Y : point.low;
                                                        var low = point.Y > point.low ? point.Y : point.low;
                                                        dir = "M" + " " + (point.X + series.xAxis.x) + " " + (chart.model.m_AreaBounds.Y) + " " + "L" + " " + (point.X + series.xAxis.x) + " " + (high + series.yAxis.y) + " " + "M" + " " + (point.X + series.xAxis.x) + " " + (low + series.yAxis.y) + " " + "L" + " " + (point.X + series.xAxis.x) + " " + (chart.model.m_AreaBounds.Y + chart.model.m_AreaBounds.Height);
                                                    }
                                                    else
                                                        dir = "M" + " " + (point.X + series.xAxis.x) + " " + (chart.model.m_AreaBounds.Y) + " " + "L" + " " + (point.X + series.xAxis.x) + " " + (chart.model.m_AreaBounds.Y + chart.model.m_AreaBounds.Height);
                                                    if (series.type == "boxandwhisker") {
                                                        for (var p = 0; p < trackPoints.length; p++) {
                                                            visiblepts.push({ X: (trackPoints[p].X), Y: (trackPoints[p].Y), YValues: trackPoints[p].YValues, outlier: trackPoints[p].outlier });
                                                        }
                                                    } else
                                                        visiblepts.push({ X: (closestPoint.point[t].location.X + series.xAxis.x), Y: (closestPoint.point[t].location.Y + series.yAxis.y) });
                                                }

                                                chartPos = { left: chartOffset.left, top: chartOffset.top };

                                                pathOptions = {
                                                    'id': chart.svgObject.id + "_Tracker",
                                                    'fill': 'none',
                                                    'stroke-width': chart.model.crosshair.line.width,
                                                    'clip-path': 'url(#' + chart.svgObject.id + '_ChartAreaClipRect)',
                                                    'stroke': chart.model.crosshair.line.color,
                                                    'd': dir
                                                };
                                                this.crosshairLinePath.push(pathOptions);
                                                if ($("#" + chart.svgObject.id + "_Tracker").length == 0) {
                                                    if (enableCanvas) {
                                                        var obj = this.svgRenderer.createCrosshairCanvas();
                                                        obj.ctx = obj.getContext('2d');
                                                    }
                                                    else {
                                                        var obj = this.svgRenderer;
                                                        var parentElement = chart.gTrackball;
                                                    }

                                                    chart.svgRenderer.drawPath.call(obj, pathOptions, parentElement);
                                                    showTrackLine = true;

                                                }
                                                else {
                                                    showTrackLine = true;
                                                    if (!ej.util.isNullOrUndefined(this._closest)) {
                                                        if (this._beforeMin) {
                                                            if (this._closest >= closestPoint.point[t].xValue)
                                                                chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_Tracker"), { "d": dir, "visibility": "visible" });

                                                        }
                                                        else if (this._afterMax) {
                                                            if (this._closest <= closestPoint.point[t].xValue)
                                                                chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_Tracker"), { "d": dir, "visibility": "visible" });
                                                        }
                                                    }
                                                    else {
                                                        chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_Tracker"), { "d": dir, "visibility": "visible" });
                                                    }
                                                    $("#" + chart.svgObject.id + "_Tracker").css({ "display": "block" });
                                                    if (enableCanvas) {
                                                        var obj = this.svgRenderer.createCrosshairCanvas();
                                                        obj.ctx = obj.getContext('2d');
                                                        chart.svgRenderer.drawPath.call(obj, pathOptions, chart.gTrackball);

                                                    }
                                                    $("#" + this._id).find('[id*="canvas_Tracker"]').css("visibility", "visible");
                                                }

                                                crossHairTrans = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, requireInvertedAxes);
                                                tToolOptions = { 'transform': 'translate(' + crossHairTrans.x + ',' + crossHairTrans.y + ')', 'id': chart.svgObject.id + '_TrackToolTip' + '_' + seriesIndex };
                                                chart.gTransToolEle = chart.svgRenderer.createGroup(tToolOptions);
                                                prePoint = this.model.prePoint;

                                                //To check the current closestPoint and previous point is same
                                                if (ej.util.isNullOrUndefined(prePoint) || prePoint.pointIndex[0] != closestPoint.index[0] || !$('#' + chart.svgObject.id + "_trackSymbol_" + seriesIndex + '_' + closestPoint.index)) {

                                                    //Remove the track elements only once on point change
                                                    if (ej.util.isNullOrUndefined(initialPoint)) {
                                                        if (chart.gTransToolEle && chart.gTrackerEle) {
                                                            $(this.svgObject).find('[id*="_TrackSymbol_"],[id*="_TrackToolTip"]').attr("visibility", "hidden");
                                                            $("#" + this._id).find('[id*="canvas_trackSymbol"]').css("visibility", "hidden");
                                                        }
                                                        initialPoint = closestPoint;
                                                    }
                                                    var type = series.type.toLowerCase(), trackcount = 0;
                                                    if (!series._hiloTypes || type.indexOf("rangearea") > -1)
                                                        if (trackballDisplayMode != "grouping" || (trackballDisplayMode == "grouping" && type.indexOf("column") < 0 && type.indexOf("bar") < 0))
                                                            if (series.type == "boxandwhisker") {
                                                                for (var z = 0; z < trackPoints.length; z++) {
                                                                    chart.drawTrackerSymbol(series, seriesIndex, closestPoint.index[t], true, trackPoints[z], null, trackcount);
                                                                    trackcount++;
                                                                }
                                                            }
                                                            else
                                                                chart.drawTrackerSymbol(series, seriesIndex, closestPoint.index[t], true, point);
                                                    series.trackerRemoved = true;

                                                    // Condition to find the crosshair is specified with tooltip template
                                                    if (!chart.model.crosshair.trackballTooltipSettings.tooltipTemplate) {
                                                        var currentLength = visiblepts.length - 1, trackOutlier = trackPoints.length;
                                                        if (trackballDisplayMode == "grouping") {
                                                            var seriesColor = this.getSeriesColor(closestPoint.point[t], seriesIndex, series),
                                                                textOptions, tooltipFormat = series.tooltip.format, currentText, boxgroupingtext, boxtext = [];
                                                            if (series.type == "boxandwhisker") {
                                                                for (var p = 0; p < trackOutlier; p++) {
                                                                    boxgroupingtext = this.getTooltipFormat(closestPoint.point[t], series, seriesIndex, closestPoint.index[t], tooltipFormat, trackPoints[p]);
                                                                    boxtext.push(boxgroupingtext);
                                                                    currentText = null;
                                                                }
                                                            }
                                                            else
                                                                currentText = this.getTooltipFormat(closestPoint.point[t], series, seriesIndex, closestPoint.index[t], tooltipFormat);

                                                            var textColor = series.tooltip.font ? ((series.tooltip.font.color ? series.tooltip.font.color : seriesColor)) : seriesColor,
                                                                font = series.tooltip.font ? $.extend(false, series.font, {}, series.tooltip.font) : series.font;
                                                            if (typeof (textColor) == "object") {
                                                                textColor = seriesColor[1].color;
                                                            }
                                                            if (series.type == "boxandwhisker") {
                                                                for (var b = 0; b < boxtext.length; b++)
                                                                    textCollection.push({ text: boxtext[b].text, seriesIndex: seriesIndex, pointIndex: closestPoint.index[t] });
                                                            }
                                                            else {
                                                                currentText.text = "&nbsp" + currentText.text + "&nbsp";
                                                                textCollection.push({ text: currentText.text, seriesIndex: seriesIndex, pointIndex: closestPoint.index[t] });
                                                            }
                                                            if ((series._hiloTypes && type != "rangearea") || type.indexOf("column") > -1 || type.indexOf("bar") > -1) {
                                                                data = { region: { Region: { PointIndex: closestPoint.index[t] }, SeriesIndex: seriesIndex } };
                                                                this.highlightStart(evt, data, this._id + "_svg_SeriesGroup_" + seriesIndex, this._id + "_svg_Series" + seriesIndex + "_Point" + closestPoint.index[t], true);
                                                            }
                                                            if (series.type == "boxandwhisker") {
                                                                for (var b = 0; b < boxtext.length; b++) {
                                                                    groupingTextId.push(chart._id + "_grouping_text_" + seriesIndex + "_" + closestPoint.index[t] + b);
                                                                }
                                                            }
                                                            else
                                                                groupingTextId.push(chart._id + "_grouping_text_" + seriesIndex + "_" + closestPoint.index[t]);
                                                            textOptions = {
                                                                "color": textColor,
                                                                'font-size': font.size,
                                                                'font-family': font.fontFamily,
                                                                'font-style': font.fontStyle,
                                                                'font-weight': font.fontWeight,
                                                            };
                                                            if (series.type == "boxandwhisker") {
                                                                for (var b = 0; b < boxtext.length; b++) {
                                                                    textOptionsCollection.push(textOptions);
                                                                }
                                                            }
                                                            else
                                                                textOptionsCollection.push(textOptions);
                                                            if (boxSeriesCount == totalVisible && series.type == "boxandwhisker")
                                                                chart.displayTooltip(true, { point: closestPoint.point[t], series: series, textCollection: textCollection, textOptionsCollection: textOptionsCollection, groupingTextId: groupingTextId });
                                                            else if (totalVisible == textCollection.length && series.type != "boxandwhisker") {
                                                                chart.displayTooltip(true, { point: closestPoint.point[t], series: series, textCollection: textCollection, textOptionsCollection: textOptionsCollection, groupingTextId: groupingTextId });
                                                            }
                                                        }
                                                        else {
                                                            var rectxt = this.getTooltipFormat(closestPoint.point[t], series, seriesIndex, i, series.tooltip.format, i),
                                                                tooltip = series.tooltip, font = tooltip.font ? $.extend(false, series.font, {}, tooltip.font) : series.font, textarea = ej.EjSvgRender.utils._measureText(rectxt.text, null, font), padding, heightwidth = (requireInvertedAxes) ? textarea.height : textarea.width, maxWidth = (maxWidth > heightwidth) ? maxWidth : heightwidth, newLines = Math.ceil(rectxt.text.toString().split("<br/>").length / 2);
                                                            this.model.tooltipPadding = Number(font.size.toString().replace(/px/i, '')) / 3;
                                                            padding = this.model.tooltipPadding + series.tooltip.border.width * 2;
                                                            if (!requireInvertedAxes) {
                                                                if (series.type == "boxandwhisker") {
                                                                    for (var p = 0; p < trackOutlier; p++) {
                                                                        tooltipRanges.push({ Start: trackPoints[p].Y - padding * newLines - textarea.height / 2, End: trackPoints[p].Y + padding * newLines + textarea.height / 2 });
                                                                        DisplayTooltipOptions.push({ Point: trackPoints[p], ClosestPoint: closestPoint.point[t], Series: series, ClosestPointIndex: closestPoint.index[t], Tgap: tgap, StEnd: tooltipRanges[p], TextArea: textarea, ReqInvertAxis: requireInvertedAxes });
                                                                    }
                                                                }
                                                                else {
                                                                    tooltipRanges.push({ Start: visiblepts[currentLength].Y - padding * newLines - textarea.height / 2, End: visiblepts[currentLength].Y + padding * newLines + textarea.height / 2 });
                                                                    DisplayTooltipOptions.push({ Point: visiblepts[currentLength], ClosestPoint: closestPoint.point[t], Series: series, ClosestPointIndex: closestPoint.index[t], Tgap: tgap, StEnd: tooltipRanges[currentLength], TextArea: textarea, ReqInvertAxis: requireInvertedAxes });
                                                                }
                                                            }
                                                            else {
                                                                tooltipRanges.push({ Start: visiblepts[currentLength].X - padding - (textarea.width / 2), End: visiblepts[currentLength].X + padding + (textarea.width / 2) });
                                                                DisplayTooltipOptions.push({ Point: visiblepts[currentLength], ClosestPoint: closestPoint.point[t], Series: series, ClosestPointIndex: closestPoint.index[t], Tgap: tgap, StEnd: tooltipRanges[currentLength], TextArea: textarea, ReqInvertAxis: requireInvertedAxes });
                                                            }
                                                            if (series.type == "boxandwhisker" && boxSeriesCount == totalVisible) {
                                                                maxWidth += (2 * padding);
                                                                if (requireInvertedAxes) {
                                                                    DisplayTooltipOptions = DisplayTooltipOptions.sort(function (a, b) { return a.Point.X - b.Point.X });
                                                                }
                                                                else {
                                                                    DisplayTooltipOptions = DisplayTooltipOptions.sort(function (a, b) { return a.Point.Y - b.Point.Y });
                                                                }
                                                                this.SmartTooltipPosition(DisplayTooltipOptions);
                                                                var displayLength = DisplayTooltipOptions.length;
                                                                chart.displayTooltip(false, DisplayTooltipOptions, maxWidth);
                                                                for (var i = 0; i < displayLength; i++) {
                                                                    var seriesIndex = $.inArray(DisplayTooltipOptions[i].Series, this.model._visibleSeries);
                                                                    if (DisplayTooltipOptions[i].Series._hiloTypes) {
                                                                        data = { region: { Region: { PointIndex: DisplayTooltipOptions[i].ClosestPointIndex }, SeriesIndex: seriesIndex } };
                                                                        this.highlightStart(evt, data, this._id + "_svg_SeriesGroup_" + seriesIndex, this._id + "_svg_Series" + seriesIndex + "_Point" + DisplayTooltipOptions[i].ClosestPointIndex, true);
                                                                    }
                                                                }
                                                            }
                                                            else if (DisplayTooltipOptions.length == totalVisible && series.type != "boxandwhisker") {
                                                                maxWidth += (2 * padding);
                                                                if (requireInvertedAxes) {
                                                                    DisplayTooltipOptions = DisplayTooltipOptions.sort(function (a, b) { return a.Point.X - b.Point.X });
                                                                }
                                                                else {
                                                                    DisplayTooltipOptions = DisplayTooltipOptions.sort(function (a, b) { return a.Point.Y - b.Point.Y });
                                                                }
                                                                this.SmartTooltipPosition(DisplayTooltipOptions);
                                                                var displayLength = DisplayTooltipOptions.length;
                                                                chart.displayTooltip(false, DisplayTooltipOptions, maxWidth);
                                                                for (var i = 0; i < displayLength; i++) {
                                                                    var seriesIndex = $.inArray(DisplayTooltipOptions[i].Series, this.model._visibleSeries);
                                                                    if (DisplayTooltipOptions[i].Series._hiloTypes) {
                                                                        data = { region: { Region: { PointIndex: DisplayTooltipOptions[i].ClosestPointIndex }, SeriesIndex: seriesIndex } };
                                                                        this.highlightStart(evt, data, this._id + "_svg_SeriesGroup_" + seriesIndex, this._id + "_svg_Series" + seriesIndex + "_Point" + DisplayTooltipOptions[i].ClosestPointIndex, true);
                                                                    }
                                                                }

                                                            }
                                                        }
                                                    }
                                                    else {
                                                        if (trackballDisplayMode === 'grouping') {
                                                            closestPoint = chart.getClosestPointX(serX, series, chart.mousemoveX, chart.mousemoveY);
                                                            seriesColor = this.getSeriesColor(closestPoint.point[t], seriesIndex, series);
                                                            color.push({ seriesColor: seriesColor });
                                                            closePointLength = closestPoint.point.length;
                                                            currentText = this.getTooltipFormat(closestPoint.point[t], series, seriesIndex, closestPoint.index[t], tooltipFormat),
                                                                currentText.text = "&nbsp" + currentText.text + "&nbsp";
                                                            textCollection.push({ text: currentText.text, seriesIndex: seriesIndex, pointIndex: closestPoint.index[t] });
                                                            store.push({ point: closestPoint.point[t] }); seriesArray.push({ series: series });
                                                            if ((series._hiloTypes && type != "rangearea") || type.indexOf("column") > -1 || type.indexOf("bar") > -1) {
                                                                data = { region: { Region: { PointIndex: closestPoint.index[t] }, SeriesIndex: seriesIndex } };
                                                                this.highlightStart(evt, data, this._id + "_svg_SeriesGroup_" + seriesIndex, this._id + "_svg_Series" + seriesIndex + "_Point" + closestPoint.index[t], true);
                                                            }
                                                            if (totalVisible === textCollection.length) {
                                                                chartLocation = document.getElementById(this.svgRenderer.svgObj.id).getClientRects()[0];
                                                                chart.displayGroupingTemplate(tX, tY, point, store, seriesArray, seriesIndex, closestPoint.index[t], chartLocation, color);
                                                            }
                                                        } else {
                                                            tX, tY;
                                                            chartLocation = document.getElementById(this.svgRenderer.svgObj.id).getClientRects()[0];
                                                            chart.displayTemplateTooltip(tX, tY, point, closestPoint.point[t], series, seriesIndex, closestPoint.index[t], chartLocation);
                                                        }
                                                    }
                                                } else {
                                                    // If both are same points, then viibility is set to visible
                                                    element = $(this.svgObject).find('[id*="_TrackSymbol_"],[id*="_TrackToolTip"]');
                                                    this.svgRenderer._setAttr($(element), { "visibility": 'visible' });
                                                    $("#" + this._id).find('[id*="canvas_trackSymbol"]').css("visibility", "visible");
                                                    element = $(this.svgObject).find('[id*="_TrackToolTip"]').children();
                                                    this.svgRenderer._setAttr($(element), { "visibility": 'visible' });

                                                    element = $(this.svgObject).find('[id*="_trackSymbol_"]');
                                                    this.svgRenderer._setAttr($(element), { "visibility": 'visible' });

                                                    $(chart.svgObject).find('[id*="_TrackAxisToolTip"]').attr("visibility", "visible");

                                                    // Sets the tooltip template visibility to visible
                                                    if (this.model.crosshair.trackballTooltipSettings.tooltipTemplate != null) {
                                                        if (trackballDisplayMode === 'grouping') {
                                                            element = $(document).find('[id*="TrackGroupToolTipTemplate"]');
                                                            this.svgRenderer._setAttr($(element), { "visibility": 'visible' });
                                                        } else {
                                                            element = $(document).find('[id*="_TrackToolTipTemplate_"]');
                                                            this.svgRenderer._setAttr($(element), { "visibility": 'visible' });
                                                        }
                                                    }
                                                }
                                            }
                                        } else {

                                            $('#' + this.svgObject.id + '_TrackSymbol_' + seriesIndex).remove();
                                        }
                                    }
                                }
                                else {
                                    this._removeTrackBall();
                                }
                            }
                        } else {
                            if (!showTrackLine) // //condition checked to display Track line for single series when chart have more than one series. 
                                $(chart.svgObject).find('[id*="_Tracker"]').remove();
                            var elem = $("#" + chart.svgObject.id + "_TrackSymbol_" + i);
                            var trackId = this.svgObject.id + '_TrackSymbol' + '_' + seriesIndex;
                            $("#" + this._id).find('[id*=' + trackId + ']').remove();
                            $("#" + chart._id).find('[id*=' + "_canvas_trackSymbol_" + i + ']').css("visibility", "hidden");
                            if (!this.model.enableCanvasRendering) {
                                // removed highlight style
                                $("[class*=" + "HighlightStyle" + "]").attr('class', '');
                                $("[class*=" + "HighlightLegendStyle" + "]").attr('class', '');
                                $("[class*=" + "HighlightLegendPathStyle" + "]").attr('class', '');
                                $("[class*=" + "HighlightPathStyle" + "]").attr('class', '');
                                $("[class*=" + "Highlightseries" + "]").attr('class', '');
                                $("[id*=" + this._id + "_Highlight_" + "]").remove();// removed canvas highlight           
                            }
                        }
                    }
                    series.trackerRemoved = false;
                }


                // To get the previous point values
                if (this.model.closestPoint != null) {
                    this.model.prePoint = { point: closestPoint.point, pointIndex: closestPoint.index, series: series, seriesIndex: seriesIndex };
                }
                if ($("#" + this.svgObject.id + "_TrackAxisToolTip").length == 0 && this.model.crosshairLabelVisibility) {     // condition to check track axis tooltip is existing in DOM
                    var gTrackAxisOptions = { 'id': chart.svgObject.id + '_TrackAxisToolTip', 'visibility': 'visible' };
                    chart.gTrackAxisEle = chart.svgRenderer.createGroup(gTrackAxisOptions);
                    chart.svgRenderer.append(chart.gTrackAxisEle, chart.gTrackball);
                }
                else {
                    $("#" + this.svgObject.id + "_TrackAxisToolTip").css("display", "block");
                }

                if (point) {
                    var pointValue = closestPoint.point[0];
                    //Hide unnecessary crosshair labels. SVG and Canvas renders crosshair labels differently
                    if (enableCanvas)
                        $(chart.svgObject.parentElement).find('[id*="AxisToolTipRect"]').css({ "visibility": "hidden", "display": "none" });
                    else
                        $(chart.svgObject).find('[id*="_TrackAxisToolTip"]').attr("visibility", "visible").children().attr({ "display": "none" });
                    $.each(chart.model._axes, function (axisIndex, axis) {
                        var areaX = axis.x;
                        var opposedPosition = axis._opposed;
                        if (!requireInvertedAxes) {
                            if (axis.orientation.toLowerCase() == "horizontal" && axis.crosshairLabel.visible) {
                                if ((point.X + areaX) <= (axis.x + axis.width) && axis.x <= (visiblepts[visiblepts.length - 1].X)) {
                                    var valueType = axis._valueType.toLowerCase(), xVal, pointLocation;
                                    xVal = ((point.X / (axis.width)) * (axis.visibleRange.delta) + axis.visibleRange.min).toFixed(2).replace(new RegExp("\\.0{" + 2 + "}"), "");
                                    if (valueType == "logarithmic") xVal = Math.pow(axis.logBase, xVal);
                                    if (valueType == "datetime") xVal = (ej.format(new Date(Math.floor(xVal)), ((ej.util.isNullOrUndefined(axis.labelFormat)) ? ej.EjSvgRender.utils._dateTimeLabelFormat(axis._intervalType, axis) : axis.labelFormat), locale));
                                    if (valueType == "category" || valueType == "datetimecategory") {
                                        if (typeof (pointValue.x) !== "object")
                                            xVal = pointValue.xValue;
                                        if (valueType == "category" || !ej.util.isNullOrUndefined(axis.labelFormat))
                                            xVal = ej.EjSvgRender.utils._getLabelContent(Math.floor(xVal), axis, locale);
                                        else
                                            xVal = ej.format(new Date(axis.labels[Math.floor(xVal)]), ej.EjSvgRender.utils._dateTimeLabelFormat(axis.intervalType, axis), locale);
                                        xVal = xVal ? xVal : "undefined";
                                    }
                                    pointLocation = { X: (visiblepts[visiblepts.length - 1].X), Y: (opposedPosition) ? (axis.y + axis.height - axis.majorTickLines.size) : (axis.y + axis.height + axis.majorTickLines.size + 10) };
                                    chart.displayAxisTooltip(pointLocation, xVal, axis, axisIndex, mouseLocation, true);
                                }
                            }
                        }
                        else {
                            if (axis.orientation.toLowerCase() == "vertical" && axis.crosshairLabel.visible) {
                                if ((chart.mousemoveY) <= (axis.y + axis.height) && axis.y <= (chart.mousemoveY)) {
                                    var valueType = axis._valueType.toLowerCase(), yVal = pointValue.xValue, ypointLocation = [];
                                    if (valueType == "logarithmic") yVal = Math.pow(axis.logBase, yVal).toFixed(2).replace(new RegExp("\\.0{" + 2 + "}"), "");
                                    if (valueType == "datetime") yVal = (ej.format(new Date(Math.floor(yVal)), ((ej.util.isNullOrUndefined(axis.labelFormat)) ? ej.EjSvgRender.utils._dateTimeLabelFormat(axis._intervalType, axis) : axis.labelFormat), locale));
                                    if (valueType == "category") yVal = ej.EjSvgRender.utils._getLabelContent(yVal, axis, locale);
                                    ypointLocation = { X: axis.x, Y: (point.Y + axis.y) };
                                    chart.displayAxisTooltip(ypointLocation, yVal, axis, axisIndex, mouseLocation);
                                }
                            }
                        }

                    });
                }
                if (trackballDisplayMode !== "grouping" && chart.model.crosshair.trackballTooltipSettings.tooltipTemplate) {
                    var floatElements = $(document).find('[id*="_TrackToolTipTemplate_"]');
                    for (var i = 0; i < floatElements.length; i++) {
                        $(floatElements[i]).appendTo(this.templateContainer);
                        $(this.templateContainer).appendTo(this.chartContainer);
                    }
                }
            }
        },
        chartCrossHair: function (chart, mouseLocation) {
            var round = ((ej.util.isNullOrUndefined(this.model.primaryYAxis.roundingPlaces)) ? 2 : this.model.primaryYAxis.roundingPlaces),
                enableCanvas = chart.model.enableCanvasRendering, locale = this.model.locale;
            if ((!this.model.enable3D) && this.model.crosshair.visible && this.model.crosshair.type.toLowerCase() == "crosshair") {
                if ($("#" + this.svgObject.id + "_CrosshairGroup").length == 0) {
                    var gTrackballOptions = { 'id': this.svgObject.id + '_CrosshairGroup', 'visibility': 'visible' };
                    if (enableCanvas) {
                        gTrackballOptions.position = "absolute";
                        chart.svgRenderer.drawCrosshairLine(gTrackballOptions, '#chartContainer_' + this._id);
                    }
                    else {
                        this.gCrosshair = this.svgRenderer.createGroup(gTrackballOptions);
                        this.svgRenderer.append(this.gCrosshair, this.svgObject);
                    }
                }
                else
                    $("#" + this.svgObject.id + "_CrosshairGroup").css("display", "block");
                if (chart.model.trackerElement) {
                    if ($.finish)
                        $(this.model.trackerElement).finish();
                    else
                        $(this.model.trackerElement).stop(true, true);
                    this.model.trackerElement = null;
                }


                var minX, maxX, minY, maxY;
                for (var i = 0; i < this.model._axes.length; i++) {
                    var axis = this.model._axes[i];
                    if (axis.orientation.toLowerCase() == 'vertical') {
                        if (mouseLocation.y >= axis.y && mouseLocation.y <= axis.y + axis.height)
                            if (axis.x < mouseLocation.x)
                                minX = Math.min(minX || axis.x, axis.x);
                            else
                                maxX = Math.max(maxX || axis.x, axis.x);
                    }
                    else
                        if (mouseLocation.x >= axis.x && mouseLocation.x <= axis.x + axis.width)
                            if (axis.y < mouseLocation.y)
                                minY = Math.min(minY || axis.y, axis.y);
                            else
                                maxY = Math.max(maxY || axis.y, axis.y);
                }
                var left = minX || this.model.m_AreaBounds.X,
                    width = maxX ? maxX - left : this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width - left,
                    top = minY || this.model.m_AreaBounds.Y,
                    height = maxY ? maxY - top : this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height - top;

                var d = "M" + " " + (this.mousemoveX) + " " + (top) + " " + "L" + " " + (this.mousemoveX) + " " + (top + height),
                    dhor = "M" + " " + (left) + " " + (this.mousemoveY) + " " + "L" + " " + (left + width) + " " + (this.mousemoveY),
                    chartOffset = $("#" + this._id).offset(),
                    svgObject = chart.svgObject, options, optionsHor,
                    chartPos = {
                        left: svgObject.offsetLeft > chartOffset.left ? svgObject.offsetLeft : chartOffset.left,
                        top: svgObject.offsetTop > chartOffset.top ? svgObject.offsetTop : chartOffset.top
                    };
                if ($("#" + chart.svgObject.id + "_CrosshairVertical").length == 0) {
                    options = {
                        'id': chart.svgObject.id + "_CrosshairVertical",
                        'fill': 'none',
                        'stroke-width': chart.model.crosshair.line.width,
                        'stroke': chart.model.crosshair.line.color,
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)',
                        'd': d
                    };
                    if (enableCanvas) {
                        options.width = 0,
                            options.height = height,
                            options.top = top,
                            options.left = left,
                            options.position = "absolute", options.style = "solid", options.opacity = 0.5,
                            chart.svgRenderer.drawCrosshairLine(options, '#' + this.svgObject.id + '_CrosshairGroup');
                    }
                    else
                        chart.svgRenderer.drawPath(options, chart.gCrosshair);
                } else {
                    chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_CrosshairVertical"), { "d": d });
                    if (enableCanvas) {
                        $("#secondCanvas").remove();
                        $("#" + chart.svgObject.id + "_CrosshairVertical").css("left", this.mousemoveX).css({ "top": top, "height": height, "display": "block" });
                    }
                    $("#" + chart.svgObject.id + "_CrosshairVertical").attr("visibility", "visible").css("display", "block");
                }

                if ($("#" + chart.svgObject.id + "_CrosshairHorizontal").length == 0) {
                    optionsHor = {
                        'id': chart.svgObject.id + "_CrosshairHorizontal",
                        'fill': 'none',
                        'stroke-width': chart.model.crosshair.line.width,
                        'stroke': chart.model.crosshair.line.color,
                        'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)',
                        'd': dhor
                    };
                    if (enableCanvas) {
                        optionsHor.top = top + chartPos.top,
                            optionsHor.left = left + chartPos.left,
                            optionsHor.width = width,
                            optionsHor.height = 0,
                            optionsHor.position = "absolute", optionsHor.style = "solid", optionsHor.opacity = 0.5,
                            chart.svgRenderer.drawCrosshairLine(optionsHor, '#' + this.svgObject.id + '_CrosshairGroup');
                    }
                    else
                        chart.svgRenderer.drawPath(optionsHor, chart.gCrosshair);
                } else {
                    chart.svgRenderer._setAttr($(chart.svgObject).find("#" + chart.svgObject.id + "_CrosshairHorizontal"), { "d": dhor });
                    $("#" + chart.svgObject.id + "_CrosshairHorizontal").attr("visibility", "visible").css("display", "block");
                    if (enableCanvas) {
                        $("#" + chart.svgObject.id + "_CrosshairHorizontal").css("top", this.mousemoveY).css({ "left": left, "width": width, "display": "block" });
                    }
                }
                if ($('#' + chart.svgObject.id + '_AxisCrossToolTip').length == 0) {
                    var gAxisCrossOptions = { 'id': chart.svgObject.id + '_AxisCrossToolTip', 'visibility': 'visible' };
                    chart.gTrackAxisEle = chart.svgRenderer.createGroup(gAxisCrossOptions);
                    chart.svgRenderer.append(chart.gTrackAxisEle, chart.gCrosshair);
                }
                else {
                    this.svgRenderer._setAttr($(chart.gTrackAxisEle), { "visibility": 'visible' });
                    $(chart.gTrackAxisEle).css('display', 'block');
                }

                $.each(chart.model._axes, function (axisIndex, axis) {
                    var valueType = axis._valueType.toLowerCase();
                    if (axis.orientation.toLowerCase() == "horizontal" && axis.crosshairLabel.visible) {
                        if ((chart.mousemoveX) <= (axis.x + axis.width) && axis.x <= (chart.mousemoveX)) {
                            var labelplacement = (axis._valueType == "category" && axis.labelPlacement.toLowerCase() == 'betweenticks') ? 0.5 : 0;
                            var xVal = ((Math.abs(chart.mousemoveX - (axis.isInversed ? axis.x + axis.width : axis.x)) / (axis.width)) * (axis.visibleRange.delta) + axis.visibleRange.min + labelplacement).toFixed(2).replace(new RegExp("\\.0{" + 2 + "}"), "");
                            if (valueType == "logarithmic") xVal = Math.pow(axis.logBase, xVal).toFixed(2).replace(new RegExp("\\.0{" + 2 + "}"), "");
                            if (valueType == "datetime") xVal = (ej.format(new Date(Math.floor(xVal)), ((ej.util.isNullOrUndefined(axis.labelFormat)) ? ej.EjSvgRender.utils._dateTimeLabelFormat(axis._intervalType, axis) : axis.labelFormat), locale));
                            if (valueType == "category" || valueType == "datetimecategory") {
                                if (valueType == "category" || !ej.util.isNullOrUndefined(axis.labelFormat))
                                    xVal = ej.EjSvgRender.utils._getLabelContent(xVal, axis, locale);
                                else {
                                    xVal = xVal < 0 ? 0 : xVal;
                                    xVal = (ej.format(new Date(axis.labels[Math.floor(xVal)]), ej.EjSvgRender.utils._dateTimeLabelFormat(axis.intervalType, axis), locale));
                                }
                            }
                            var xPointLocation = { X: (chart.mousemoveX), Y: (axis.y) };
                            chart.displayAxisTooltip(xPointLocation, xVal, axis, axisIndex, mouseLocation);
                            $("#" + chart.svgObject.id + '_AxisToolTipText' + '_' + axisIndex).show();
                            $("#" + chart.svgObject.id + '_AxisToolTipRect' + '_' + axisIndex).show();
                        }
                        else {
                            $("#" + chart.svgObject.id + '_AxisToolTipText' + '_' + axisIndex).hide();
                            $("#" + chart.svgObject.id + '_AxisToolTipRect' + '_' + axisIndex).hide();
                        }
                    } else if (axis.orientation.toLowerCase() == "vertical" && axis.crosshairLabel.visible) {
                        if ((chart.mousemoveY) <= (axis.y + axis.height) && axis.y <= (chart.mousemoveY)) {
                            var yVal = ((Math.abs(1 - (Math.abs(chart.mousemoveY - (axis.isInversed ? axis.y + axis.height : axis.y)) / (axis.width)) / (axis.height)) * (axis.visibleRange.delta) + axis.visibleRange.min).toFixed(round).replace(new RegExp("\\.0{" + round + "}"), ""));
                            if (valueType == "logarithmic") yVal = Math.pow(axis.logBase, yVal).toFixed(2).replace(new RegExp("\\.0{" + 2 + "}"), "");
                            if (valueType == "datetime") yVal = (ej.format(new Date(Math.floor(yVal)), ((ej.util.isNullOrUndefined(axis.labelFormat)) ? ej.EjSvgRender.utils._dateTimeLabelFormat(axis._intervalType, axis) : axis.labelFormat), locale));
                            if (valueType == "category" || valueType == "datetimecategory") {
                                if (valueType == "category" || ej.util.isNullOrUndefined(axis.labelFormat))
                                    yVal = ej.EjSvgRender.utils._getLabelContent(yVal, axis, locale);
                                else
                                    yVal = ej.format(new Date(axis.labels[Math.floor(yVal)]), ej.EjSvgRender.utils._dateTimeLabelFormat(axis.intervalType, axis), locale);

                            }
                            var ypointLocation = { X: axis.x, Y: (chart.mousemoveY) };
                            chart.displayAxisTooltip(ypointLocation, yVal, axis, axisIndex, mouseLocation);
                            $("#" + chart.svgObject.id + '_AxisToolTipText' + '_' + axisIndex).show();
                            $("#" + chart.svgObject.id + '_AxisToolTipRect' + '_' + axisIndex).show();
                        }
                        else {
                            $("#" + chart.svgObject.id + '_AxisToolTipText' + '_' + axisIndex).hide();
                            $("#" + chart.svgObject.id + '_AxisToolTipRect' + '_' + axisIndex).hide();
                        }
                    }
                });

            }
        },
        chartTouchMove: function (evt) {
            this.cancelEvent(evt);
            evt = evt.originalEvent.touches[0];
            this.chartInteractiveBehavior(evt);

        },

        isZoomButtonHovered: function (target) {
            if (target.parentNode != null) {
                var parentId = target.parentNode.id;
                var id = target.id;
                if (id.indexOf('_ZoomInBtn ') == -1 && id.indexOf('ZoomOutBtn') == -1 && id.indexOf('_ZoomBtn') == -1 && id.indexOf('_ResetZoom') == -1 && id.indexOf('_PanBtn') == -1 && parentId && parentId.indexOf('_ZoomInBtn') == -1 && parentId.indexOf('_ZoomOutBtn') == -1 && parentId.indexOf('_ZoomBtn') == -1 && parentId.indexOf('_ResetZoom') == -1 && parentId.indexOf('_PanBtn') == -1)
                    return false;
            }
            return true;
        },
        showTooltipOnDrag: function (chart, evt) {
            $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'visible');
            $("#" + chart.svgObject.id + "_TrackToolTip").show();
            $(".tooltipDiv").css("display", "block");
        },
        chartInteractiveBehavior: function (evt) {
            var mouseMoveCords = this.calMousePosition(evt);
            this.mousemoveX = mouseMoveCords.X;
            this.mousemoveY = mouseMoveCords.Y;

            var id = "#" + this.svgObject.id;
            if (this.mouseWheelCoords) {
                var changeX = Math.abs(this.mouseWheelCoords.x - evt.pageX);
                var changeY = Math.abs(this.mouseWheelCoords.y - evt.pageY);
                if ((changeX > 0 || changeY > 0) && !(this.panning)) {
                    this.enableTrackBall();
                } else {
                    this.disableTrackBall();
                }
            }

            var chart = this,
                targetId = evt.target.id;
            if (chart.model.AreaType == "cartesianaxes" && this.mousemoveX >= this.model.m_AreaBounds.X && this.mousemoveX < (this.model.m_AreaBounds.X + this.model.m_AreaBounds.Width) && this.mousemoveY < (this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height) && this.mousemoveY >= this.model.m_AreaBounds.Y && this.model.initSeriesRender) {
                var mouseLocation = { x: chart.mousemoveX, y: chart.mousemoveY };
                var targetId = chart.svgRenderer._getAttrVal($(evt.target).parent(), "id");
                if ((targetId != undefined) && (targetId == chart.svgRenderer._getAttrVal($(this.svgObject).find(id + '_ZoomBtn'), "id") || targetId == chart.svgRenderer._getAttrVal($(this.svgObject).find(id + '_ResetZoom'), "id") || targetId == chart.svgRenderer._getAttrVal($(this.svgObject).find(id + '_PanBtn'), "id"))) {
                    this.disableTrackBall();
                }
                else {
                    this.enableTrackBall();
                }

                //show tooltip and track ball
                if (!this.model.crosshair.visible && !this.isZoomButtonHovered(evt.target))
                    this.tooltip(chart, evt);
                else {
                    if (this.dragPoint)
                        this.showTooltipOnDrag(chart, evt)
                    else if (!this.closestXyPoint) {
                        $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                        $("#" + chart.svgObject.id + "_TrackToolTip").hide();
                        $(".tooltipDiv" + this._id).css("display", "none");
                    }
                }
                if (!this.model.enable3D) {
                    //crossHair of chart
                    this.chartTrackball(chart, mouseLocation, evt);

                    //crossHair for chart area
                    this.chartCrossHair(chart, mouseLocation);
                }

            } else {
                if ((chart.model.AreaType == "none" || chart.model.AreaType == 'polaraxes') && !this.isZoomButtonHovered(evt.target))
                    this.tooltip(chart, evt);
                else {
                    if (this.dragPoint)
                        this.showTooltipOnDrag(chart, evt)
                    else if (!this.closestXyPoint) {
                        $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                        $("#" + chart.svgObject.id + "_TrackToolTip").hide();
                        $(".tooltipDiv" + this._id).css("display", "none");
                        this._removeTrackBall();
                        this._removeHighlight();
                    }
                }
                //Removing exploded marker symbol when placing mouse outside chart area
                var pointData = this.model.prevPoint;
                if (pointData && pointData.point) {
                    if (this.model.enableCanvasRendering)
                        $("#canvas_trackSymbol").remove();
                    else {
                        if (pointData.series.type == "boxandwhisker")
                            var pointLocation = pointData.outlierPosition;
                        else
                            var pointLocation = ej.EjSvgRender.utils._getPoint(pointData.point, pointData.series);
                        chart.drawTrackerSymbol(pointData.series, pointData.seriesIndex, pointData.pointIndex, null, pointLocation);
                    }
                    this.model.prevPoint = null;
                }
            }

        },

        // highlight SVG logic started here
        highlightSvg: function (chart, parentNodeId, isElement, evt, data, targetID, tracker) {
            if (parentNodeId != undefined) {
                var matchStr = this.svgObject.id + "_SeriesGroup_";
                var serIndex = parentNodeId.substr(matchStr.length);
                if (parentNodeId.indexOf(this.svgObject.id + "_symbolGroup_") >= 0) {
                    matchStr = this.svgObject.id + "_symbolGroup_";
                    serIndex = parentNodeId.substr(matchStr.length);
                }
            }

            serIndex = data != undefined ? data.region.SeriesIndex : serIndex
            var series = this.model.series[serIndex];
            if (isElement && series) {
                if (series.highlightSettings.enable || tracker)
                    this.highlight(chart, evt, series, null, data, parentNodeId, targetID, tracker);
            }

        },

        // canvas highlight logic started here
        highlightCanvas: function (chart, evt, data) {
            for (var i = 0; i < this.model._visibleSeries.length; i++) {
                var seriesIndex;
                var chartSeries;
                seriesIndex = i;
                chartSeries = this.model._visibleSeries[i];
                var type = chartSeries.type.toLowerCase();
                if (this.model.AreaType == "cartesianaxes" && chartSeries.visibility.toLowerCase() == 'visible' && type !== "scatter" && type !== "bubble" && type !== "column" && type.indexOf("bar") == -1 && type !== "stackingcolumn" && type !== "stackingcolumn100" && !chartSeries._hiloTypes) {
                    var serY = [];
                    var serX = [];
                    var location = null;
                    var mouseMoveCords = this.calMousePosition(evt);
                    this.mousemoveX = mouseMoveCords.X;
                    this.mousemoveY = mouseMoveCords.Y;
                    var closestXyPoint = this.getClosesPointXY(serX, serY, chartSeries, this.mousemoveX, this.mousemoveY, evt);
                    if (!ej.util.isNullOrUndefined(closestXyPoint.point)) {
                        var commonPointEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                        commonPointEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, region: { SeriesIndex: i, Region: { PointIndex: closestXyPoint.index } } };
                    }
                }
            }
            var data = commonPointEventArgs ? commonPointEventArgs.data : data;
            if (data && this.model.series[data.region.SeriesIndex].highlightSettings.enable) {
                var series = $.extend({}, this.model.series[data.region.SeriesIndex]);
                series.pointIndex = data.region.Region.PointIndex;
                series.seriesIndex = data.region.SeriesIndex;
                series.data = data;
                if ($('#' + this._id + '_Selection_series' + series.seriesIndex + '_canvas').length == 0) {
                    // removed canvas highlight
                    $("[id*=" + this._id + "_Highlight_" + "]").remove();
                    if (!this.findCanvasSelection(series.seriesIndex, series.pointIndex, series.selectionSettings.mode.toLowerCase()))
                        this.canvasHighlight(this, evt, series);
                }
            }
        },
        //change cursor symbols after resizing
        resizeCursor: function (containerSvg, mousemoveX, mousemoveY, chartAreaX, chartAreaY, chartAreaWidth, chartAreaHeight) {
            var selectedRectIndex = this.selectedRectIndex;
            if ((mousemoveX <= chartAreaX) || (mousemoveY <= chartAreaY) || (mousemoveX >= (chartAreaWidth + chartAreaX)) || (mousemoveY >= (chartAreaHeight + chartAreaY))) {
                $("#" + containerSvg + '_resize_rightRect' + selectedRectIndex).css({ 'cursor': 'default' });
                $("#" + containerSvg + '_resize_leftRect' + selectedRectIndex).css({ 'cursor': 'default' });
                $("#" + containerSvg + '_resize_bottomRect' + selectedRectIndex).css({ 'cursor': 'default' });
                $("#" + containerSvg + '_resize_topRect' + selectedRectIndex).css({ 'cursor': 'default' });
                $("#" + containerSvg + '_resize_bottomRightCornerCircle' + selectedRectIndex).css({ 'cursor': 'default' });
            }
            else if ((mousemoveX >= chartAreaX) || (mousemoveY >= chartAreaY) || (mousemoveX <= (chartAreaWidth + chartAreaX)) || (mousemoveY <= (chartAreaHeight + chartAreaY))) {
                $("#" + containerSvg + '_resize_rightRect' + selectedRectIndex).css({ 'cursor': 'e-resize' });
                $("#" + containerSvg + '_resize_leftRect' + selectedRectIndex).css({ 'cursor': 'w-resize' });
                $("#" + containerSvg + '_resize_bottomRect' + selectedRectIndex).css({ 'cursor': 's-resize' });
                $("#" + containerSvg + '_resize_topRect' + selectedRectIndex).css({ 'cursor': 'n-resize' });
                $("#" + containerSvg + '_resize_bottomRightCornerCircle' + selectedRectIndex).css({ 'cursor': 'se-resize' });
            }
        },
        multiSelectMouseMove: function (evt) {
            if (this._isMultiSelect && (this.multiSelectMode == 'range') && !this.dragPoint) {
                var mouseMoveCords = this.calMousePosition(evt),
                    mouseMoveX = mouseMoveCords.X,
                    mouseMoveY = mouseMoveCords.Y,
                    gripMouseMoveX, gripMouseMoveY, translate,
                    selectionSettingsType = this.multiSelectType,
                    width, height, x, y,
                    rectX, rectY, rectWidth, rectHeight, id,
                    x1, x2, y1, y2, xPlotOffset, yPlotOffset,
                    modifiedX, modifiedY,
                    mouseDownX = this.mouseDownX,
                    mouseDownY = this.mouseDownY,
                    selectedRectIndex = this.selectedRectIndex,
                    containerSvg = this.svgObject.id,
                    chartArea = '#' + containerSvg + '_ChartArea',
                    chartAreaX = parseInt($(chartArea).attr('x')),
                    chartAreaY = parseInt($(chartArea).attr('y')),
                    chartAreaWidth = parseInt($(chartArea).attr('width')),
                    chartAreaHeight = parseInt($(chartArea).attr('height')),
                    multiSelectMouseDownId = this.multiSelectMouseDownId,
                    selctRectId = '#' + containerSvg + '_selectRect',
                    multiAxis = this.multiAxis;
                for (var q = 0; q < multiAxis.length; q++) {
                    if (multiAxis[q].orientation.toLowerCase() == 'horizontal') {
                        x1 = multiAxis[q].Location.X1; x2 = multiAxis[q].Location.X2;
                        xPlotOffset = multiAxis[q].plotOffset;
                    }
                    else {
                        y1 = multiAxis[q].Location.Y1; y2 = multiAxis[q].Location.Y2;
                        yPlotOffset = multiAxis[q].plotOffset;
                    }
                }
                if ((this.drag) && (!this.resize) && (!this.rectPan) && (!this.removeRect)) {
                    var currentX = mouseMoveX,
                        currentY = mouseMoveY,
                        areaBounds = this.model.m_AreaBounds;
                    this.multiSelectDraw = true;
                    if (mouseMoveX < areaBounds.X) {
                        currentX = areaBounds.X;
                    }
                    else if (mouseMoveX > (areaBounds.X + areaBounds.Width)) {
                        currentX = areaBounds.X + areaBounds.Width;
                    }
                    if (mouseMoveY < areaBounds.Y) {
                        currentY = areaBounds.Y;
                    } else if (mouseMoveY > (areaBounds.Y + areaBounds.Height)) {
                        currentY = areaBounds.Y + areaBounds.Height;
                    }
                    else {
                        currentY = mouseMoveY;
                    }
                    switch (selectionSettingsType) {
                        case 'x':
                            width = Math.abs(currentX - mouseDownX);
                            height = y1 - y2 + yPlotOffset + yPlotOffset;
                            x = currentX > mouseDownX ? mouseDownX : currentX;
                            y = y2 - yPlotOffset;
                            break;
                        case 'y':
                            width = x2 - x1 + xPlotOffset + xPlotOffset;
                            height = Math.abs(currentY - mouseDownY);
                            x = x1 - xPlotOffset;
                            y = currentY > mouseDownY ? mouseDownY : currentY;
                            break;
                        case 'xy':
                            width = Math.abs(currentX - mouseDownX);
                            height = Math.abs(currentY - mouseDownY);
                            x = currentX > mouseDownX ? mouseDownX : currentX;
                            y = currentY > mouseDownY ? mouseDownY : currentY;
                            break;
                    }
                    if (width > 0 && height > 0) {
                        var rectOptions = {
                            'id': this.svgObject.id + '_selectRect' + this.selectedRectIndex,
                            'x': x,
                            'y': y,
                            'width': width,
                            'height': height,
                            'fill': 'rgba(41,136,214,0.2)',
                            'stroke-width': 2,
                            'stroke': 'rgba(41,136,214,0.5)',
                            'cursor': 'pointer',
                            'clip-path': 'url(#' + this.svgObject.id + '_ChartAreaClipRect)'
                        };
                        if ((x >= x1 + xPlotOffset) && (mouseMoveX <= x2 - xPlotOffset) && (mouseMoveY <= y1 + yPlotOffset) && (y >= y2 - yPlotOffset))
                            this.svgRenderer.drawRect(rectOptions, this.gEle);
                        if ((this.gEle != null)) {
                            $(this.gEle).appendTo(this.parentgEle);
                            if (this.selectedRectIndex == 0) {
                                this.model.gCurrentEle = this.gEle;
                            }
                            $(this.parentgEle).appendTo(this.svgObject);
                        }
                    }
                }
                rectX = parseInt($(selctRectId + selectedRectIndex).attr('x'));
                rectY = parseInt($(selctRectId + selectedRectIndex).attr('y'));
                rectWidth = parseInt($(selctRectId + selectedRectIndex).attr('width'));
                rectHeight = parseInt($(selctRectId + selectedRectIndex).attr('height'));
                if (!this.drag && (evt.target.id.indexOf("selectRect") >= 0 || evt.target.id.indexOf("resize") >= 0)) {
                    if (evt.target.parentNode.id.indexOf("selectedRect") >= 0) {
                        id = evt.target.parentNode.id.split("selectedRect")[1].match(/\d+/)[0];
                        this.gripIndex = eval(id);
                    }
                    var selectRectId = '#' + containerSvg + '_selectRect',
                        selectRectWidth = parseInt($(selectRectId + this.gripIndex).attr("width")),
                        selectRectHeight = parseInt($(selectRectId + this.gripIndex).attr("height")),
                        selectRectX = parseInt($(selectRectId + this.gripIndex).attr("x")),
                        selectRectY = parseInt($(selectRectId + this.gripIndex).attr("y"));
                    $("#" + containerSvg + "_gripCollection" + selectedRectIndex).css({ 'visibility': 'hidden' });
                    if (selectRectX + selectRectWidth - 16 >= selectRectX || selectRectY + selectRectHeight - 16 >= selectRectY)
                        $("#" + this.svgObject.id + "_gripCollection" + this.gripIndex).attr({ 'transform': "" });
                    if (selectRectX + selectRectWidth - 16 < selectRectX || selectRectY + selectRectHeight - 16 < selectRectY) {
                        var translate = 'translate(' + 15 + ',' + 15 + ')';
                        $("#" + this.svgObject.id + "_gripCollection" + this.gripIndex).attr({ 'transform': translate });
                    }
                    if (this.oldId != evt.target.id)
                        $("#" + containerSvg + "_gripCollection" + this.oldGripIndex).css({ 'visibility': 'hidden' });
                    $("#" + containerSvg + "_gripCollection" + this.gripIndex).css({ 'visibility': 'visible' });
                    this.oldId = evt.target.id;
                    this.oldGripIndex = this.gripIndex;
                }
                if ((evt.target.id.indexOf("selectRect") < 0) && (evt.target.id.indexOf("resize") < 0))
                    $("#" + containerSvg + "_gripCollection" + this.gripIndex).css({ 'visibility': 'hidden' });
                if (this.resize) {
                    $("#" + containerSvg + "_closeTopRightCornerCircle" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_closePath" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_closePathOpposite" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_gripCollection" + selectedRectIndex).css({ 'visibility': 'hidden' });
                    var oldRectX = this.oldRectX[selectedRectIndex], oldRectY = this.oldRectY[selectedRectIndex],
                        oldRectHeight = this.oldRectHeight[selectedRectIndex], oldRectWidth = this.oldRectWidth[selectedRectIndex],
                        oldReBottomRectY = this.oldReBottomRectY[selectedRectIndex],
                        oldReRightRectX = this.oldReRightRectX[selectedRectIndex];
                    switch (selectionSettingsType) {
                        case 'x':
                            if (multiSelectMouseDownId == containerSvg + '_resize_rightRect' + selectedRectIndex) {
                                rectWidth = mouseMoveX - oldRectX;
                                $("#" + containerSvg + "_resize_rightRect" + selectedRectIndex).attr('x', mouseMoveX - 5);
                                if (mouseMoveX < oldRectX) {
                                    rectX = mouseMoveX;
                                    rectWidth = oldRectX - mouseMoveX;
                                }
                                else if (mouseMoveX >= oldRectX) rectX = oldRectX;
                            }
                            else if (multiSelectMouseDownId == containerSvg + '_resize_leftRect' + selectedRectIndex) {
                                rectX = mouseMoveX;
                                rectWidth = oldRectWidth + oldRectX - mouseMoveX;
                                $("#" + containerSvg + "_resize_leftRect" + selectedRectIndex).attr('x', mouseMoveX - 5);
                                if (mouseMoveX > (oldReRightRectX + 5)) {
                                    rectX = oldReRightRectX + 5;
                                    rectWidth = mouseMoveX - oldRectX - oldRectWidth;
                                }
                            }
                            this.resizeCursor(containerSvg, mouseMoveX, mouseMoveY, chartAreaX, chartAreaY, chartAreaWidth, chartAreaHeight);
                            break;
                        case 'y':
                            if (multiSelectMouseDownId == containerSvg + '_resize_topRect' + selectedRectIndex) {
                                rectHeight = oldRectHeight + oldRectY - mouseMoveY;
                                rectY = mouseMoveY;
                                $("#" + containerSvg + "_resize_topRect" + selectedRectIndex).attr('y', mouseMoveY - 5);
                                if (mouseMoveY > (oldReBottomRectY + 5)) {
                                    rectY = oldReBottomRectY + 5;
                                    rectHeight = mouseMoveY - oldRectY - oldRectHeight;
                                }
                            }
                            else if (multiSelectMouseDownId == (containerSvg + '_resize_bottomRect' + selectedRectIndex)) {
                                rectHeight = mouseMoveY - oldRectY;
                                $("#" + containerSvg + "_resize_bottomRect" + selectedRectIndex).attr('y', mouseMoveY - 5);
                                if (mouseMoveY < oldRectY) {
                                    rectY = mouseMoveY;
                                    rectHeight = oldRectY - mouseMoveY;
                                }
                                else if (mouseMoveY >= oldRectY) rectY = oldRectY;
                            }
                            this.resizeCursor(containerSvg, mouseMoveX, mouseMoveY, chartAreaX, chartAreaY, chartAreaWidth, chartAreaHeight);
                            break;
                        case 'xy':
                            if (multiSelectMouseDownId == containerSvg + '_resize_rightRect' + selectedRectIndex) {
                                rectWidth = mouseMoveX - oldRectX;
                                $("#" + containerSvg + "_resize_rightRect" + selectedRectIndex).attr('x', mouseMoveX - 5);
                                if (mouseMoveX < oldRectX) {
                                    rectX = mouseMoveX;
                                    rectWidth = oldRectX - mouseMoveX;
                                }
                                else if (mouseMoveX >= oldRectX)
                                    rectX = oldRectX;
                            }
                            else if (multiSelectMouseDownId == containerSvg + '_resize_leftRect' + selectedRectIndex) {
                                rectX = mouseMoveX;
                                rectWidth = oldRectWidth + oldRectX - mouseMoveX;
                                $("#" + containerSvg + "_resize_leftRect" + selectedRectIndex).attr('x', mouseMoveX - 5);
                                if (mouseMoveX > (oldReRightRectX + 5)) {
                                    rectX = oldReRightRectX + 5;
                                    rectWidth = mouseMoveX - oldRectX - oldRectWidth;
                                }
                            }
                            else if (multiSelectMouseDownId == containerSvg + '_resize_topRect' + selectedRectIndex) {
                                rectHeight = oldRectHeight + oldRectY - mouseMoveY;
                                rectY = mouseMoveY;
                                $("#" + containerSvg + "_resize_topRect" + selectedRectIndex).attr('y', mouseMoveY - 5);
                                if (mouseMoveY > (oldReBottomRectY + 5)) {
                                    rectY = oldReBottomRectY + 5;
                                    rectHeight = mouseMoveY - oldRectY - oldRectHeight;
                                }
                            }
                            else if (multiSelectMouseDownId == (containerSvg + '_resize_bottomRect' + selectedRectIndex)) {
                                rectHeight = mouseMoveY - oldRectY;
                                $("#" + containerSvg + "_resize_bottomRect" + selectedRectIndex).attr('y', mouseMoveY - 5);
                                if (mouseMoveY < oldRectY) {
                                    rectY = mouseMoveY;
                                    rectHeight = oldRectY - mouseMoveY;
                                }
                                else if (mouseMoveY >= oldRectY)
                                    rectY = oldRectY;
                            }
                            else if (multiSelectMouseDownId == containerSvg + '_resize_bottomRightCornerCircle' + selectedRectIndex) {
                                rectWidth = mouseMoveX - oldRectX;
                                rectHeight = mouseMoveY - oldRectY;
                                $("#" + containerSvg + "_resize_bottomRightCornerCircle" + selectedRectIndex).attr({ 'cx': mouseMoveX, 'cy': mouseMoveY });
                                if ((mouseMoveX < oldRectX) && (mouseMoveY < oldRectY)) {
                                    rectX = mouseMoveX;
                                    rectY = mouseMoveY;
                                    rectWidth = oldRectX - mouseMoveX;
                                    rectHeight = oldRectY - mouseMoveY;
                                }
                                else if (mouseMoveX < oldRectX) {
                                    rectX = mouseMoveX;
                                    rectWidth = oldRectX - mouseMoveX;
                                }
                                else if (mouseMoveY < oldRectY) {
                                    rectY = mouseMoveY;
                                    rectHeight = oldRectY - mouseMoveY;
                                }
                                else if ((mouseMoveX >= oldRectX) && (mouseMoveY >= oldRectY)) {
                                    rectX = oldRectX;
                                    rectY = oldRectY;
                                }
                            }
                            this.resizeCursor(containerSvg, mouseMoveX, mouseMoveY, chartAreaX, chartAreaY, chartAreaWidth, chartAreaHeight);
                            break;
                    }
                    switch (selectionSettingsType) {
                        case 'x':
                            if (rectX >= x1 - xPlotOffset && (rectWidth + rectX - x1 <= x2 - x1 - xPlotOffset))
                                $(selctRectId + selectedRectIndex).attr({ 'x': rectX, 'width': rectWidth });
                            break;
                        case 'y':
                            if (((rectHeight + rectY - y2) <= y1 - y2 + yPlotOffset) && (rectY >= y2 - yPlotOffset))
                                $(selctRectId + selectedRectIndex).attr({ 'y': rectY, 'height': rectHeight });
                            break;
                        case 'xy':
                            if (rectX >= x1 - xPlotOffset && (rectWidth + rectX - x1 <= x2 - x1 - xPlotOffset) && (rectHeight + rectY - y2 <= y1 - y2 + yPlotOffset) && rectY >= y2 - yPlotOffset)
                                $(selctRectId + selectedRectIndex).attr({ 'x': rectX, 'y': rectY, 'width': rectWidth, 'height': rectHeight });;
                            break;
                    }
                }
                if ((this.rectPan)) {
                    $("#" + containerSvg + "_closeTopRightCornerCircle" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_closePath" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_closePathOpposite" + selectedRectIndex).hide();
                    $("#" + containerSvg + "_gripCollection" + selectedRectIndex).css({ 'visibility': 'hidden' });
                    if ((mouseMoveX <= chartAreaX || mouseMoveY <= chartAreaY || (mouseMoveX >= chartAreaX + chartAreaWidth) || (mouseMoveY >= chartAreaY + chartAreaHeight)))
                        this.multiSelectMouseUp(evt);
                    modifiedX = this.PreviousCoords.X - evt.pageX;
                    modifiedY = this.PreviousCoords.Y - evt.pageY;
                    rectX = rectX - modifiedX;
                    rectY = rectY - modifiedY;
                    this.PreviousCoords.X = evt.pageX;
                    this.PreviousCoords.Y = evt.pageY;
                    switch (selectionSettingsType) {
                        case 'x':
                            if (rectX >= x1 - xPlotOffset && (rectWidth + rectX - x1 <= x2 - x1 - xPlotOffset))
                                $(selctRectId + selectedRectIndex).attr({ 'x': rectX });
                            break;
                        case 'y':
                            if ((rectHeight + rectY - y2 <= y1 - y2 + yPlotOffset) && rectY >= y2 - yPlotOffset)
                                $(selctRectId + selectedRectIndex).attr({ 'y': rectY });
                            break;
                        case 'xy':
                            if (rectX >= x1 - xPlotOffset && (rectWidth + rectX - x1 <= x2 - x1 - xPlotOffset) && (rectHeight + rectY - y2 <= y1 - y2 + yPlotOffset) && rectY >= y2 - yPlotOffset)
                                $(selctRectId + selectedRectIndex).attr({ 'x': rectX, 'y': rectY });
                            break;
                    }
                }
            }
        },
        isTouch: function (evt) {
            var browserInfo = this.model.browserInfo,
                event = evt.originalEvent ? evt.originalEvent : evt;
            if ((event.pointerType == "touch") || (event.pointerType == 2) || (event.type.indexOf("touch") > -1))
                return true;
            return false;

        },
        highlightStart: function (evt, data, parentNodeId, targetID, tracker) {
            if (evt.target.parentNode != null) {
                var parentNodeId = parentNodeId || evt.target.parentNode.id;
                var isElement = (parentNodeId.indexOf(this.svgObject.id + "_SeriesGroup_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_symbolGroup_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_TrackSymbol_") >= 0 || parentNodeId.indexOf(this.svgObject.id + "_Chart3D") >= 0) ? true : false;
            }

            if (this.model.enableCanvasRendering)
                this.highlightCanvas(this, evt, data);
            else
                this.highlightSvg(this, parentNodeId, isElement, evt, data, targetID, tracker)
        },

        _changeDraggingPoints: function (chartSeries, index, X, Y) {
            X = chartSeries.xAxis._valueType == "datetime" ? new Date(X) : X;
            Y = chartSeries.yAxis._valueType == "datetime" ? new Date(Y) : Y;
            var dragType = chartSeries.dragSettings.type.toLowerCase();
            if ((dragType == "x" || dragType == "xy") && chartSeries.xAxis._valueType != "category") {
                if (this.dragPoint) {
                    chartSeries.pointCollection[index].x = X;
                    chartSeries.pointCollection[index].xValue = (chartSeries.xAxis._valueType == "datetime" && typeof X != "object") ? new Date(X) : X;
                }
                else {
                    chartSeries._visiblePoints[index].x = chartSeries.points[index].x = X;
                    chartSeries._visiblePoints[index].xValue = chartSeries.points[index].xValue = (chartSeries.xAxis._valueType == "datetime" && typeof X == "object") ? Date.parse(X) : X;
                }
                if (!ej.util.isNullOrUndefined(chartSeries.dataSource))
                    chartSeries.dataSource[index][chartSeries.xName] = X;
            }
            if (dragType == "y" || dragType == "xy") {
                if (this.dragPoint) {
                    chartSeries.pointCollection[index].y = Y
                    chartSeries.pointCollection[index].YValues[0] = (chartSeries.yAxis._valueType == "datetime" && typeof Y != "object") ? new Date(Y) : Y;
                }
                else {
                    chartSeries._visiblePoints[index].y = chartSeries.points[index].y = Y;
                    chartSeries._visiblePoints[index].YValues[0] = chartSeries.points[index].YValues[0] = (chartSeries.yAxis._valueType == "datetime" && typeof Y == "object") ? Date.parse(Y) : Y;
                }
                if (!ej.util.isNullOrUndefined(chartSeries.dataSource))
                    chartSeries.dataSource[index][chartSeries.yName] = Y;
            }
        },

        // Triggers while dragging the point
        _dragDelta: function (newXval, newYval, oldXval, oldYval, srIndex, ptIndex) {
            var chart = this,
                oldValue = { X: oldXval, Y: oldYval },
                newValue = { X: newXval, Y: newYval },
                commonDragEventArgs = $.extend({}, this.commonDragEventArgs);
            commonDragEventArgs.data = { seriesIndex: srIndex, pointIndex: ptIndex, oldValue: oldValue, newValue: newValue };
            this._trigger("dragging", commonDragEventArgs);
            this.commonDragEventArgs = commonDragEventArgs;
        },
        _getDraggedPoint: function (chartSeries, currentX, currentY) {
            var mousePoint, PointX, PointY, x, y;
            var valAxis = ej.EjSvgRender.utils._getTransform(chartSeries.xAxis, chartSeries.yAxis, this.model.requireInvertedAxes);
            if (this.model.requireInvertedAxes) {
                x = (valAxis.y + valAxis.height) - currentY;
                y = (currentX - valAxis.x);
            }
            else {
                x = (currentX - valAxis.x);
                y = (valAxis.y + valAxis.height) - currentY;
            }
            mousePoint = ej.EjSvgRender.utils._getValuebyPoint(x, y, chartSeries, this.model.requireInvertedAxes);
            PointX = parseFloat(mousePoint.PointX.toFixed(2));
            PointY = parseFloat(mousePoint.PointY.toFixed(2));
            return { X: PointX, Y: PointY };
        },

        _pointDragandDrop: function (chartSeries, evt, chart) {
            var i = chartSeries.data.seriesIndex,
                pointCollection = [], translate = null,
                chartType = chartSeries.type.toLowerCase();
            var params = {};
            params.axes = {};
            for (var k = 0; k < this.model._axes.length; k++)
                params.axes[this.model._axes[k].name] = {};


            $("[id*=" + "_Marker" + "]").remove();
            var draggedPoints = this._getDraggedPoint(chartSeries, this.mousemoveX, this.mousemoveY),
                xPoint = draggedPoints.X,
                yPoint = draggedPoints.Y,
                xVal = this.commonDragEventArgs.data.currentPoint ? this.commonDragEventArgs.data.currentPoint.xValue : this.commonDragEventArgs.data.oldValue.X,
                yVal = this.commonDragEventArgs.data.currentPoint ? this.commonDragEventArgs.data.currentPoint.yValue[0] : this.commonDragEventArgs.data.oldValue.Y;
            if (chartSeries.region) {
                var region = chartSeries.region;
                chart._dragDelta(xPoint, yPoint, xVal, yVal, region.SeriesIndex, region.Region.PointIndex);
            }
            else {
                var closestPoint = chartSeries.pointData;
                chart._dragDelta(xPoint, yPoint, xVal, yVal, closestPoint.seriesIndex, closestPoint.index);
            }
            if (this.model.enableCanvasRendering) {
                if (this.canvasElement) this.canvasElement.clearRect(0, 0, chart.svgWidth, chart.svgHeight);
                if ($('#' + chart._id + '_PreviewSeries' + i + '_canvas').length == 0) {
                    var containerStyle = document.getElementById(chart._id + '_canvas').getBoundingClientRect();
                    canvasElement = this.createCanvasElement(chart._id + '_PreviewSeries' + i + '_canvas', chart.svgWidth, chart.svgHeight, containerStyle);
                    this.createRect(chart, canvasElement);
                    this.canvasElement = canvasElement;
                }
            }
            else {
                chartSeries.xAxis = (chartSeries.xAxis === null || chartSeries.xAxis === undefined) ? this.model._axes[0] : chartSeries.xAxis;
                chartSeries.yAxis = (chartSeries.yAxis === null || chartSeries.yAxis === undefined) ? this.model._axes[1] : chartSeries.yAxis;
                var trans = ej.EjSvgRender.utils._getTransform(chartSeries.xAxis, chartSeries.yAxis, this.model.requireInvertedAxes);
                var translate = 'translate(' + trans.x + ',' + trans.y + ')';
                var serOptions = { 'id': this.svgObject.id + '_PreviewSeriesGroup', 'transform': translate, 'cursor': 'default', 'visibility': 'visible' };
                $("#" + this.svgObject.id + "_PreviewSeriesGroup").attr("transform", translate);
                if (!this.gPreviewSeriesGroupEle) {
                    this.chartObj = chart;
                    this.chartObj.gPreviewSeriesGroupEle = this.gPreviewSeriesGroupEle = this.svgRenderer.createGroup(serOptions);
                }
                if (this.gPreviewSeriesGroupEle.childNodes.length > 0)
                    this.gPreviewSeriesGroupEle.removeChild(this.gPreviewSeriesGroupEle.childNodes[0]);
            }
            pointCollection = $.extend(true, {}, chartSeries._visiblePoints);
            chartSeries.pointCollection = pointCollection;
            pointCollection.length = chartSeries._visiblePoints.length;
            var dragEventArgs = chart.commonDragEventArgs.data;
            var ptindex = dragEventArgs.pointIndex,
                srindex = dragEventArgs.seriesIndex;
            chart._changeDraggingPoints(chartSeries, ptindex, dragEventArgs.newValue.X, dragEventArgs.newValue.Y);

            var series = new ej.seriesTypes[chartType](),
                point = chartSeries.pointCollection[ptindex];
            if (chartType == "bubble") {
                var location = ej.EjSvgRender.utils._getPoint(point, chartSeries);
                var options = {
                    'id': this.svgObject.id + '_PreviewSeries' + srindex + '_Point' + ptindex,
                    'cx': location.X + this.canvasX,
                    'cy': (location.Y) + this.canvasY,
                    'r': point.radius,
                    'fill': chartSeries.fill,
                    'stroke-width': 2,
                    'visibility': 'visible',
                    'stroke-dasharray': "",
                    'opacity': 0.6,
                    'stroke': 'transparent'
                };
                if (this.model.enableCanvasRendering)
                    ej.EjCanvasRender.prototype.drawCircle(options, canvasElement);
                else
                    this.svgRenderer.drawCircle(options, this.gPreviewSeriesGroupEle);
                this.svgRenderer.append(this.gPreviewSeriesGroupEle, this.gSeriesEle);
            }
            else if (chartType == "scatter") {
                var location = ej.EjSvgRender.utils._getPoint(point, chartSeries);
                var symbolName = (chartSeries.marker.shape).capitalizeFirstString();
                var location = { startX: location.X + this.canvasX, startY: location.Y + this.canvasY };
                var style = {
                    ShapeSize: { width: chartSeries.marker.size.width, height: chartSeries.marker.size.height },
                    ID: this.svgObject.id + '_PreviewSeries' + srindex + '_Point' + ptindex,
                    Style: {
                        Color: chartSeries.fill,
                        BorderWidth: chartSeries.marker.border.width,
                        BorderColor: 'transparent',
                        Opacity: 0.6,
                        Visibility: 'visible'
                    }
                };
                if (this.model.enableCanvasRendering)
                    ej.EjSvgRender.chartSymbol["_draw" + symbolName](location, style, this, canvasElement);
                else
                    ej.EjSvgRender.chartSymbol["_draw" + symbolName](location, style, this, this.gPreviewSeriesGroupEle);
                this.svgRenderer.append(this.gPreviewSeriesGroupEle, this.gSeriesEle);
            }

            else if (chartType == "column" || chartType == "bar") {
                point.xValue = (typeof point.xValue == "object") ? Date.parse(point.xValue) : point.xValue;
                var origin = ej.EjSeriesRender.prototype.getOrigin(chart, chartSeries, params);
                var sidebysideinfo = chartSeries.sidebysideInfo;
                var y1 = point.YValues[0];
                var y2 = origin;
                //calculate sides
                var data = ej.EjSeriesRender.prototype.calculateSides(point, sidebysideinfo);
                var x1 = data.x1;
                var x2 = data.x2;
                var rect = ej.EjSeriesRender.prototype.getRectangle(x1, y1, x2, y2, chartSeries, chart);
                options = {
                    'id': this.svgObject.id + '_PreviewSeries' + srindex + '_Point' + ptindex,
                    'x': rect.X + this.canvasX,
                    'y': rect.Y + this.canvasY,
                    'width': rect.Width,
                    'height': rect.Height,
                    'cornerRadius': chartSeries.cornerRadius,
                    'fill': chartSeries.fill,
                    'stroke-width': 2,
                    'plot': y1 < 0 ? "negative" : "positive",
                    'opacity': 0.6,
                    'stroke': 'transparent',
                    'stroke-dasharray': "",
                };
                if (this.model.enableCanvasRendering)
                    ej.EjCanvasRender.prototype.drawRect(options, canvasElement);
                else {
                    this.svgRenderer.drawRect(options, this.gPreviewSeriesGroupEle);
                    this.svgRenderer.append(this.gPreviewSeriesGroupEle, this.gSeriesEle);
                }
            }
            else {
                if (chartType == "spline" || chartType == "splinearea")
                    point.xValue = (typeof point.xValue == "object") ? Date.parse(point.xValue) : point.xValue;
                series.draw(this, chartSeries, params);
            }
            var location = ej.EjSvgRender.utils._getPoint(point, chartSeries);
            if (chartSeries.tooltip.visible) {
                if (ej.util.isNullOrUndefined(chartSeries.tooltip.template)) {
                    $(".tooltipDiv" + this._id).remove();
                    chart.displayShowTooltip(location, point, chartSeries, point.actualIndex);
                }
                else {
                    $("#" + chart.svgObject.id).find("#" + chart.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
                    var region = { SeriesIndex: srindex, Region: { PointIndex: point.actualIndex } };
                    chart.createTooltip(region, evt, chartSeries);
                }
            }

        },
        // to show marker symbol for line type charts in dragdrop
        _dragPointMarker: function (chartSeries, currentX, currentY, evt, closestXyPoint) {
            var location = null,
                srIndex = chartSeries.seriesIndex;
            location = ej.EjSvgRender.utils._getPoint(closestXyPoint.point, chartSeries);
            if (this.model.enableCanvasRendering) {
                if ($('#' + this.svgObject.id + '_Marker').length == 0) {
                    var containerStyle = document.getElementById(this.svgObject.id).getBoundingClientRect();
                    ctx = this.createCanvasElement(this.svgObject.id + '_Marker', this.svgWidth, this.svgHeight, containerStyle);
                }
            }
            else {
                var markerOptions = { 'id': this.svgObject.id + '_markerGroup' + '_' + srIndex };
                if (!this.gMarkerGroupEle)
                    this.gMarkerGroupEle = this.svgRenderer.createGroup(markerOptions);
            }
            var options = {
                'id': this.svgObject.id + '_Series' + srIndex + '_Point' + closestXyPoint.index + '_Marker',
                'cx': location.X + this.model.m_AreaBounds.X,
                'cy': location.Y + this.model.m_AreaBounds.Y,
                'r': 7,
                'fill': chartSeries.fill,
                'stroke-width': 3,
                'opacity': 1,
                'stroke': 'white',
                'visibility': 'visible'
            };
            if (this.model.enableCanvasRendering)
                ej.EjCanvasRender.prototype.drawCircle(options, ctx);
            else {
                this.svgRenderer.drawCircle(options, this.gMarkerGroupEle);
                this.svgRenderer.append(this.gMarkerGroupEle, this.gSeriesEle);
            }
        },
        // to show 3 circles for column and bar while hovering rect in dragdrop
        _dragPointGripper: function (data) {
            var type = data.region.type.toLowerCase(),
                chartSeries = this.model._visibleSeries[data.region.SeriesIndex],
                point = chartSeries._visiblePoints[data.region.Region.PointIndex],
                transposed = chartSeries.isTransposed,
                inversed = chartSeries.yAxis.isInversed;
            if (type == "column" || type == "bar") {
                if (this.model.enableCanvasRendering) {
                    var containerStyle = document.getElementById(this.svgObject.id).getBoundingClientRect();
                    canvasGripper = this.createCanvasElement(this.svgObject.id + '_Marker', this.svgWidth, this.svgHeight, containerStyle);
                    document.getElementById(canvasGripper.canvas.id).style.zIndex = 1;
                }
                else {
                    var markerOptions = { 'id': this.svgObject.id + '_markerGroup' + '_' + data.region.SeriesIndex };
                    if (!this.gMarkerGroupEle)
                        this.gMarkerGroupEle = this.svgRenderer.createGroup(markerOptions);
                }
                var circleLength = 3, value, boundValue, loc, diff, radius, cxy,
                    bounds = data.region.Region.Bounds;
                if ((transposed && type == "bar") || (type == "column" && !transposed)) {
                    value = bounds.Width;
                    boundValue = bounds.X;
                }
                if ((!transposed && type == "bar") || (type == "column" && transposed)) {
                    value = bounds.Height;
                    boundValue = bounds.Y;
                }
                loc = value < 75 ? value - value / 3 : 75 - 25;
                diff = value > 75 ? value - 75 : 0;
                radius = (loc - 6) / 6;
                cxy = diff / 2 + boundValue + loc / 6 + radius / 2;
                for (var k = 1; k <= circleLength; k++) {
                    var options = {
                        'id': this.svgObject.id + '_Series' + data.region.SeriesIndex + '_Point' + data.region.Region.PointIndex + '_Marker' + k,
                        'fill': 'white',
                        'opacity': 1,
                        'stroke': 'white',
                        'visibility': 'visible'
                    };
                    if (k == 1)
                        cxy += radius;
                    else
                        cxy += 2 * radius + 3;
                    options.r = Math.abs(radius);
                    if ((transposed && type == "bar") || (type == "column" && !transposed)) {
                        options.cx = cxy;
                        options.cy = inversed ? bounds.Y + bounds.Height - radius - 5 : bounds.Y + radius + 5;
                    }
                    if ((!transposed && type == "bar") || (type == "column" && transposed)) {
                        options.cx = inversed ? bounds.X + radius + 5 : bounds.X + bounds.Width - radius - 5;
                        options.cy = cxy;
                    }
                    if (this.model.enableCanvasRendering)
                        ej.EjCanvasRender.prototype.drawCircle(options, canvasGripper);
                    else
                        this.svgRenderer.drawCircle(options, this.gMarkerGroupEle);
                }
                this.svgRenderer.append(this.gMarkerGroupEle, this.gSeriesEle);
            }
        },
        chartMouseMove: function (evt) {

            var data = this.GetSeriesPoint(evt),
                svgObject = this.svgObject,
                model = this.model, zooming = model.zooming.enable,
                enableCanvas = model.enableCanvasRendering;
            model.event = evt;
            clearTimeout(this.removeTooltip); // to clear the set timeout used to remove the tooltip template
            if (this.doPan && evt.target.id.indexOf(this._id + '_scrollbar') > -1)
                this.doPan = false;
            var classList = evt.target.classList,
                chartOffset = { left: 0, top: 0 };
            if (this.multiSelectAreaType == 'cartesianaxes' && (!zooming) && (!enableCanvas))
                this.multiSelectMouseMove(evt);
            if (this.rotateActivate && this.oPreviousCoords) {
                var difY = (this.oPreviousCoords.Y - this.mousemoveY);
                var difX = (this.oPreviousCoords.X - this.mousemoveX);
                if (difX || difY) {
                    model.tilt -= difY;
                    model.rotation += difX;
                    // store the class name 
                    if (this.model.isSelected)
                        var selection = this.selectedStyle(this);
                    if (!this.isTouch(evt))
                        $(this.chart3D).empty();
                    $('#template_group_' + this._id).empty();
                    var size = { Width: $(svgObject).width(), Height: $(svgObject).height() };
                    this.graphics.view(svgObject, this, model.rotation, model.tilt, size, model.perspectiveAngle, model.depth);
                    this.svgRenderer.append(this.chart3D, svgObject);
                    // Apply the class
                    if (this.model.isSelected)
                        for (var i = 0; i < selection.length; i++) {
                            $('#' + selection[i].id).attr('class', selection[i].className);
                        }
                }
                this.oPreviousCoords.Y = this.mousemoveY;
                this.oPreviousCoords.X = this.mousemoveX;
            }

            var targetId = evt.target.id,
                svgObjectId = svgObject.id,
                isZoom = this.isZoomButtonHovered(evt.target),
                visibleSeries = model._visibleSeries,
                seriesLength = visibleSeries.length;
            $("[id*=" + "_Marker" + "]").remove();
            for (var i = seriesLength - 1; i >= 0; i--) {
                var chartSeries = visibleSeries[i];
                type = chartSeries.type.toLowerCase();
                if (chartSeries.dragSettings.enable && !model.enable3D) {
                    this._enableDragging(chartSeries, i, evt);
                    if (this.dragPoint)
                        break;
                    mouseMoveCords = this.calMousePosition(evt);
                    this.mousemoveX = mouseMoveCords.X;
                    this.mousemoveY = mouseMoveCords.Y;
                    var regionData = this.GetSeriesPoint(evt);
                    if (!chartSeries.marker.visible && type != "bubble" && type != "scatter" && type != "column" && type != "bar") {
                        var closestXyPoint = this.getClosesPointXY(serX, serY, chartSeries, this.mousemoveX, this.mousemoveY, evt);
                        if (closestXyPoint.point) {
                            chartSeries.seriesIndex = i;
                            this._dragPointMarker(chartSeries, this.mousemoveX, this.mousemoveY, evt, closestXyPoint);
                            this.closestXyPoint = closestXyPoint;
                            break;
                        }
                    }
                    if (regionData && regionData.region.SeriesIndex == i) {
                        this._dragPointGripper(regionData);
                        break;
                    }
                }
            }

            var chart = this;
            if (this.dragPoint) {
                var serX = [], serY = [], type;
                $(document).keyup(function (evt) {
                    if (evt.keyCode == 27) {
                        $(".tooltipDiv" + this._id).remove();
                        $("#" + svgObjectId + "_TrackToolTip").remove();
                        chart.dragPoint = false;
                        visibleSeries[chart.commonDragEventArgs.data.seriesIndex].pointCollection = null;
                        chart.chartMouseUp(evt);
                    }
                });
                var index = this.dragIndex.seriesIndex;
                chart._pointDragandDrop(visibleSeries[index], evt, chart);
            }

            this.calMousePosition(evt)
            $("#" + this._id + "_tooltip").remove();

            if (this.dragPoint || (!this.drag && !isZoom && ((!this.isTouch(evt) && !model.doubleTapped) || model.crosshairMoved))) {
                this.chartInteractiveBehavior(evt);
            }
            // Checked condition for series highlighting
            if ((!model.crosshair.visible || model.AreaType != "cartesianaxes")) {
                if (!enableCanvas || !data) {
                    // removed highlight style
                    $("[class*=" + "HighlightStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightLegendStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightLegendPathStyle" + "]").attr('class', '');
                    $("[class*=" + "HighlightPathStyle" + "]").attr('class', '');
                    $("[class*=" + "Highlightseries" + "]").attr('class', '');
                    $("[id*=" + this._id + "_Highlight_" + "]").remove();// removed canvas highlight           
                }
                this.highlightStart(evt, data);
            }
            if (!this.panning) {
                var id = "#" + svgObjectId;
                if (zooming && model.AreaType == "cartesianaxes" && !model.enable3D) {
                    if (this.drag && !this.dragPoint && !this.chartRightClick) {
                        this.disableTrackBall();
                        $('#' + svgObjectId + '_ZoomArea').remove();
                        var width, height, x, y;
                        var currentX = this.mousemoveX,
                            currentY = this.mousemoveY,
                            areaBounds = model.m_AreaBounds;
                        if (this.mousemoveX < areaBounds.X) {
                            currentX = areaBounds.X;
                        } else if (this.mousemoveX > (areaBounds.X + areaBounds.Width)) {
                            currentX = areaBounds.X + areaBounds.Width;
                        }
                        if (this.mousemoveY < areaBounds.Y) {
                            currentY = areaBounds.Y;
                        } else if (this.mousemoveY > (areaBounds.Y + areaBounds.Height)) {
                            currentY = areaBounds.Y + areaBounds.Height;
                        }
                        else {
                            currentY = this.mousemoveY;
                        }
                        var zoomingType = model.zooming.type.toLowerCase();
                        if (zoomingType == "x") {
                            width = Math.abs(currentX - this.mouseDownX);
                            height = areaBounds.Height;
                            x = currentX > this.mouseDownX ? this.mouseDownX : currentX;
                            y = areaBounds.Y;
                        } else if (zoomingType == "y") {
                            width = areaBounds.Width;
                            height = Math.abs(currentY - this.mouseDownY);
                            x = areaBounds.X;
                            y = currentY > this.mouseDownY ? this.mouseDownY : currentY;

                        } else {
                            width = Math.abs(currentX - this.mouseDownX);
                            height = Math.abs(currentY - this.mouseDownY);
                            x = currentX > this.mouseDownX ? this.mouseDownX : currentX;
                            y = currentY > this.mouseDownY ? this.mouseDownY : currentY;

                        }
                        $(svgObject).css({
                            '-moz-user-select': '-moz-none',
                            '-khtml-user-select': 'none',
                            '-webkit-user-select': 'none',
                            '-ms-user-select': 'none',
                            'user-select': 'none'
                        });

                        this.zooming = true;

                        var rectOptions = {
                            'id': svgObjectId + '_ZoomArea',
                            'x': x + chartOffset.left,
                            'y': y + chartOffset.top,
                            'width': width,
                            'height': height,
                            'fill': 'rgba(69,114,167,0.25)',
                            'stroke-width': 1,
                            'stroke': 'rgba(69,114,167,0.25)',
                            'clip-path': 'url(#' + svgObjectId + '_ChartAreaClipRect)'
                        };
                        if (enableCanvas)
                            this.svgRenderer.drawZoomRect(rectOptions, this);
                        else
                            this.svgRenderer.drawRect(rectOptions, svgObject);
                    }

                }
            }
            var deferredZoom = model.zooming.enableDeferredZoom;
            // Panning
            if (this.panning && this.doPan && model.AreaType == "cartesianaxes" && !this.dragPoint) {
                this.currentPageX = evt.pageX;
                this.currentPageY = evt.pageY;
                $("#" + this._id + "_canvas").css({ "cursor": "pointer" });
                if (!ej.isTouchDevice() && !deferredZoom) {
                    var oDelta;
                    oDelta = {
                        'x': this.oPreviousCoords.x - evt.pageX,
                        'y': this.oPreviousCoords.y - evt.pageY
                    };

                    this.oPreviousCoords = {
                        'x': evt.pageX,
                        'y': evt.pageY
                    };
                    $.each(model._axes, function (index, axis) {
                        var currentScale = Math.max(1 / ej.EjSvgRender.utils._minMax(axis.zoomFactor, 0, 1), 1);
                        chart.translate(axis, (oDelta.x), (oDelta.y), currentScale);
                    });
                    this._updateScroll();
                    this.redraw(true, null, evt.target, this.isTouch(evt));
                    this._cursorToPointer();
                    this._enableZoomingButtons();
                }
                // Translate the series for other devices
                else if (ej.isTouchDevice() || deferredZoom) {
                    for (var k = 0; k < visibleSeries.length; k++) {
                        var series = model.series[k],
                            transform = ej.EjSvgRender.utils._getTransform(series.xAxis, series.yAxis, model.requireInvertedAxes),
                            transX = (evt.pageX - this.oPreviousCoords.x) + transform.x,
                            transY = (evt.pageY - this.oPreviousCoords.y) + transform.y,
                            translate = 'translate(' + transX + ',' + transY + ')';

                        $("#" + svgObjectId + "_SeriesGroup_" + k).attr("transform", translate);
                        $("#" + svgObjectId + "_symbolGroup_" + k).attr("transform", translate);
                        $("#" + svgObjectId + "_TextGroup_" + k).attr("transform", translate);

                    }
                    for (var index = 0; index < model.indicators.length && model.indicators[index]._points.length > 0; index++) {
                        var indicator = model.indicators[index];
                        transform = ej.EjSvgRender.utils._getTransform(indicator.xAxis, indicator.yAxis, model.requireInvertedAxes);
                        transX = (evt.pageX - this.oPreviousCoords.x) + transform.x;
                        transY = (evt.pageY - this.oPreviousCoords.y) + transform.y;
                        translate = 'translate(' + transX + ',' + transY + ')';
                        $("#" + svgObjectId + "_indicatorGroup_" + index).attr("transform", translate);
                    }
                }
            }

            //Declaration
            var targetid = evt.target.id;
            if (targetid == "" && !ej.util.isNullOrUndefined(evt.target.parentNode))
                targetid = evt.target.parentNode.id.indexOf("_XLabel_") >= 0 || evt.target.parentNode.id.indexOf("_YLabel_") >= 0 ? evt.target.parentNode.id : targetid;
            var id = this._id;
            var parentId = ej.util.isNullOrUndefined(evt.target.parentNode) ? "" : evt.target.parentNode.id;

            //condition to find the buttons and display tooltip on hover
            if (zooming) {
                if (parentId == id + '_svg_ResetZoom')
                    createBtnTooltip(this._localizedLabels.reset);
                else if (parentId == id + '_svg_PanBtn')
                    createBtnTooltip(this._localizedLabels.pan);
                else if (parentId == id + '_svg_ZoomBtn')
                    createBtnTooltip(this._localizedLabels.zoom);
                else if (parentId == id + '_svg_ZoomInBtn')
                    createBtnTooltip(this._localizedLabels.zoomIn);
                else if (parentId == id + '_svg_ZoomOutBtn')
                    createBtnTooltip(this._localizedLabels.zoomOut);
            }
            // method to create tooltip for zooming and panning buttons
            function createBtnTooltip(text) {
                var id = chart._id;
                if ($("#" + id + "_tooltip").length <= 0) {
                    var tooltipdiv = $("<div></div>").attr({ 'id': id + "_tooltip", "class": "zoom" + id });
                    $(tooltipdiv).html("&nbsp" + text + "&nbsp");
                    $(document.body).append(tooltipdiv);
                    // adding css prop to the div
                    $(tooltipdiv).css({
                        "left": evt.pageX + 10,
                        "top": evt.pageY + 10,
                        "display": "block",
                        "position": "absolute",
                        "z-index": "13000",
                        "cursor": "default",
                        "font-family": "Segoe UI",
                        "color": "#707070",
                        "font-size": "12px",
                        "background-color": "#FFFFFF",
                        "border": "1px solid #707070"
                    });
                } else {
                    $("#" + id + "_tooltip").css({
                        "left": evt.pageX + 10,
                        "top": evt.pageY + 10
                    });
                }

            }
            // axisLabelMouseMove event
            var axisData = this.getAxisLabelData(evt);
            if (axisData) {
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = axisData;
                this._trigger("axisLabelMouseMove", commonEventArgs);
            }

            if (!this.isTouch(evt)) {
                this.axisTooltip(evt, targetid);
                if (model.title.enableTrim)
                    this.showTitleTooltip(evt, targetid);
                for (var i = 0, seriesLength = model.series.length; i < seriesLength; i++) {
                    var series = model.series[i], dataLabel = series.marker && series.marker.dataLabel;
                    if (series._enableSmartLabels && !this.model.enable3D && !dataLabel.enableWrap) {
                        var template = dataLabel.template;
                        var font = dataLabel.font;
                        if (model.AreaType == "none" && ej.util.isNullOrUndefined(template)) {
                            this.datalabelTooltip(evt, i, font);
                        }
                    }
                }
            }



            if ($(svgObject).find(id + '_ResetZoom,' + id + '_PanBtn,' + id + '_ZoomBtn').length > 0) {
                $(svgObject).find(id + '_ResetZoom,' + id + '_PanBtn,' + id + '_ZoomBtn').appendTo(svgObject);
            }

            var legenddata = this.getLegendData(evt);
            if (legenddata) {
                var isLegendRTL = this.model.legend.isReversed;
                var font = this.model.legend.font;
                var commonLegendMoveEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonLegendMoveEventArgs.data = legenddata;
                if (legenddata.series.highlightSettings.enable) {
                    if (enableCanvas) {
                        var series = $.extend({}, legenddata.series);
                        series.seriesIndex = legenddata.legendItem.LegendItem.SeriesIndex;
                        series.pointIndex = legenddata.legendItem.LegendItem.PointIndex;
                        var index = this.model.AreaType == 'none' ? series.pointIndex : series.seriesIndex;
                        if ($('#' + chart._id + '_Selection_Legend' + index + '_canvas').length == 0) {
                            //remove canvas legend highlight 
                            $("[id*=" + this._id + "_Highlight_" + "]").remove();
                            this.canvasHighlight(chart, evt, series, legenddata);
                        }
                    }
                    else
                        this.highlight(chart, evt, legenddata.series, legenddata);
                }
                this._trigger("legendItemMouseMove", commonLegendMoveEventArgs);
                if (enableCanvas) {
                    var mouseMoveCords = this.calMousePosition(evt),
                        mousemoveX = mouseMoveCords.X,
                        mousemoveY = mouseMoveCords.Y,
                        legendBounds = model.LegendBounds;
                    $(this.legendContainer).children().css({ "cursor": "pointer" });
                    if ((mousemoveX >= legendBounds.X) && (mousemoveX <= legendBounds.X + model.LegendViewerBounds.Width)) {
                        if ((mousemoveY <= legendBounds.Y + (model.LegendViewerBounds.Height)) && (mousemoveY >= legendBounds.Y)) {
                            this._textTooltip(evt, model.legendTextRegion, isLegendRTL, font);
                        }
                    }
                }
                else
                    this._textTooltip(evt, model.legendTextRegion, isLegendRTL, font);
            }
            else if (enableCanvas)
                $(this.legendContainer).children().css('cursor', 'default');
            if (enableCanvas) {

                //condition to find the buttons and display tooltip on hover for Canvas
                if (targetid.indexOf("_ResetZoom") != -1 || parentId.indexOf("_ResetZoom") != -1)
                    createBtnTooltip(this._localizedLabels.reset);
                else if (targetid.indexOf("_PanBtn") != -1 || parentId.indexOf("_PanBtn") != -1)
                    createBtnTooltip(this._localizedLabels.pan);
                else if (targetid.indexOf("_ZoomBtn") != -1 || parentId.indexOf("_ZoomBtn") != -1)
                    createBtnTooltip(this._localizedLabels.zoom);
                else if (targetid.indexOf("_ZoomInBtn") != -1 || parentId.indexOf("_ZoomInBtn") != -1)
                    createBtnTooltip(this._localizedLabels.zoomIn);
                else if (targetid.indexOf("_ZoomOutBtn") != -1 || parentId.indexOf("_ZoomOutBtn") != -1)
                    createBtnTooltip(this._localizedLabels.zoomOut);
                if (!this.isTouch(evt)) {
                    this._textTooltip(evt, model.xAxisLabelRegions);
                    this._textTooltip(evt, model.yAxisLabelRegions);
                }
            }

            var proxy = this;
            if (model.xAxisTitleRegion) {
                var currentX = this.mousemoveX,
                    currentY = this.mousemoveY;
                var isTitleRTL = this.model.primaryXAxis.title.isReversed,
                    titleFont = this.model.primaryXAxis.font;
                $.each(model.xAxisTitleRegion, function (index, regionItem) {
                    if ((currentX >= regionItem.Bounds.X) && (currentX <= regionItem.Bounds.X + regionItem.Bounds.Width)) {
                        if ((currentY >= regionItem.Bounds.Y - (regionItem.Bounds.Height)) && (currentY <= regionItem.Bounds.Y)) {
                            if (regionItem.trimText != regionItem.labelText) {
                                proxy.showAxisTooltip(evt.pageX, evt.pageY, regionItem.labelText, regionItem.trimText, isTitleRTL, titleFont);
                            }
                        }
                    }
                });
            }
            if (model.yAxisTitleRegion) {
                var currentX = this.mousemoveX,
                    currentY = this.mousemoveY;
                var isTitleRTL = this.model.primaryXAxis.title.isReversed,
                   titleFont = this.model.primaryXAxis.font;
                $.each(model.yAxisTitleRegion, function (index, regionItem) {
                    if ((currentX >= regionItem.Bounds.X) && (currentX <= regionItem.Bounds.X + regionItem.Bounds.Width)) {
                        if ((currentY >= regionItem.Bounds.Y - (regionItem.Bounds.Height)) && (currentY <= regionItem.Bounds.Y)) {
                            if (regionItem.trimText != regionItem.labelText) {
                                proxy.showAxisTooltip(evt.pageX, evt.pageY, regionItem.labelText, regionItem.trimText, isTitleRTL, titleFont);
                            }
                        }
                    }
                });
            }
            if (model.axisMultiLevelLabelRegions) {
                var currentX = this.mousemoveX,
                    currentY = this.mousemoveY;
                $.each(model.axisMultiLevelLabelRegions, function (index, regionItem) {
                    if ((currentX >= regionItem.Bounds.X) && (currentX <= regionItem.Bounds.X + regionItem.Bounds.Width)) {
                        if ((currentY >= regionItem.Bounds.Y - (regionItem.Bounds.Height)) && (currentY <= regionItem.Bounds.Y)) {
                            if (regionItem.trimText != regionItem.labelText) {
                                proxy.showAxisTooltip(evt.pageX, evt.pageY, regionItem.labelText);
                            }
                        }
                    }
                });
            }

            //chartMouseMove event
            var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
            commonEventArgs.data = { location: { x: this.mousemoveX, y: this.mousemoveY }, size: { height: model.svgHeight, width: model.svgWidth }, id: evt.target.id, pageX: evt.pageX, pageY: evt.pageY };
            this._trigger("chartMouseMove", commonEventArgs);
        },

        axisTooltip: function (evt, targetid) {
            var svgId = this.svgObject.id,
                hAxes = this.model.hAxes,
                vAxes = this.model.vAxes;

            //axis label tooltip for 3d 
            if (targetid.indexOf("svghorizontal") > -1) {
                var axis = hAxes[0];
                // Loop to find the axis
                var labelIndex = ((targetid.replace(this._id, '')).replace('_svghorizontal', ''));
                var ele = axis.visibleLabels[parseInt(labelIndex)];
                ele.Text = ele.Text.toString();
                if (ele.Text.indexOf('...') > -1) {
                    var str = ele.Text == ele.originalText ? "" : ele.originalText;
                    this.showAxisTooltip(evt.pageX, evt.pageY, str);
                }

            }

            if (targetid.indexOf("_YLabel_") >= 0) {
                var axis;
                // Loop to find the axis
                for (var j = 0; j < vAxes.length; j++) {
                    if (targetid.indexOf(svgId + '_' + vAxes[j].name + '_YLabel_') >= 0) {
                        axis = vAxes[j];
                        break;
                    }
                }
                if (axis && axis.enableTrim) {
                    // Loop to find the labels in the axis
                    visibleLabelsLength = axis.visibleLabels.length;
                    for (var i = 0; i < visibleLabelsLength && this.model.AreaType == 'cartesianaxes'; i++) {
                        if (targetid == svgId + '_' + vAxes[j].name + '_YLabel_' + i) {
                            var ele = axis.visibleLabels[i];
                            var str = ele.Text == ele.displayText ? "" : ((axis.labelFormat) ? axis.labelFormat.replace("{value}", ele.Text) : ele.Text);
                            if (str == "") break;
                            if (axis.labelPosition.toLowerCase() == 'inside') {
                                this._hideTooltip();
                                this._removeTrackBall();
                            }
                            this.showAxisTooltip(evt.pageX, evt.pageY, str, ele.displayText);
                        }
                    }
                }
            }

            if (targetid.indexOf("_XLabel_") >= 0) {
                var axis, visibleLabelsLength;
                // Loop to find the axis
                for (var j = 0; j < hAxes.length; j++) {
                    if (targetid.indexOf(svgId + '_' + hAxes[j].name + '_XLabel_') >= 0) {
                        axis = hAxes[j];
                        break;
                    }
                }
                if (axis && (axis.enableTrim || axis.labelIntersectAction.toLowerCase() == "trim" || axis.labelIntersectAction.toLowerCase() == "wrapbyword")) {
                    // Loop to find the labels in the axis
                    visibleLabelsLength = axis.visibleLabels.length;
                    var xLabelRTL = axis.isInversed;
                    var font = axis.font;
                    for (var i = 0; i < visibleLabelsLength && this.model.AreaType == 'cartesianaxes'; i++) {
                        if (targetid == svgId + '_' + hAxes[j].name + '_XLabel_' + i) {
                            var ele = axis.visibleLabels[i];
                            var str = ele.Text == ele.displayText ? "" : ele.Text;
                            if (str == "") break;
                            if (axis.labelPosition.toLowerCase() == 'inside') {
                                this._hideTooltip();
                                this._removeTrackBall();
                            }
                            this.showAxisTooltip(evt.pageX, evt.pageY, str, ele.displayText, xLabelRTL, font);
                        }
                    }
                }
            }
        },

        showTitleTooltip: function (evt, targetid) {
            var measureTitle = ej.EjSvgRender.utils._measureText(this.model.title.text, $(this.svgObject).width() - this.model.margin.left - this.model.margin.right, this.model.title.font), model = this.model,
                titleLocation = model._titleLocation,
                subTitleLocation = model._subTitleLocation,
                titleEnableTrim = model.title.enableTrim,
                elementSpacing = model.elementSpacing,
                currentX = this.mousemoveX, currentY = this.mousemoveY,
                titleTextOverflow = model.title.textOverflow.toLowerCase(),
                subTitleEnableTrim = model.title.subTitle.enableTrim,
                subTitleTextOverflow = model.title.subTitle.textOverflow.toLowerCase(),
                titleText = model.title.text, subTitleText = model.title.subTitle.text;
                titleRTL = model.title.isReversed;

            if (titleEnableTrim && this.model.trimTooltip) {
                trimmedText = ej.EjSvgRender.utils._trimText(titleText, model.title.maximumWidth, model.title.font);
                if (targetid.indexOf("ChartTitleText") >= 0)
                    this.showAxisTooltip(evt.pageX, evt.pageY, titleText, trimmedText, titleRTL, model.title.font);
                else if (this.model.enableCanvasRendering && currentX >= titleLocation.X - elementSpacing && currentX <= titleLocation.X - elementSpacing + titleLocation.size.width &&
                    currentY >= (titleLocation.Y - (titleLocation._height)) && currentY <= titleLocation.Y + titleLocation.size.height)
                    this.showAxisTooltip(evt.pageX, evt.pageY, titleText, trimmedText, titleRTL, model.title.font);
            }

            if (subTitleEnableTrim && model.subTitleTooltip) {
                trimmedText = ej.EjSvgRender.utils._trimText(subTitleText, model.title.subTitle.maximumWidth,model.title.subTitle.font);
                if (targetid.indexOf("ChartSubTitleText") >= 0)
                    this.showAxisTooltip(evt.pageX, evt.pageY, subTitleText, trimmedText, titleRTL, model.title.subTitle.font);
                else if (model.enableCanvasRendering && currentX >= subTitleLocation.X && currentX <= subTitleLocation.X + subTitleLocation.size.width &&
                    currentY >= (subTitleLocation.Y) && currentY <= (subTitleLocation.Y) + subTitleLocation.size.height)
                    this.showAxisTooltip(evt.pageX, evt.pageY, subTitleText, trimmedText, titleRTL, model.title.subTitle.font);
            }
        },

        _updateScroll: function () {

            var scrollObj = this.model.scrollObj,
                scrollLength = scrollObj ? scrollObj.length : 0,
                axes = this.model._axes,
                scroll = this.scrollbarContainer, obj;
            for (var i = 0; i < scrollLength; i++) {
                if (scrollObj[i]) {
                    obj = scrollObj[i];
                    if (obj.zoomPosition != axes[i].zoomPosition || obj.zoomFactor != axes[i].zoomFactor) {
                        obj.zoomPosition = axes[i].zoomPosition;
                        obj.zoomFactor = axes[i].zoomFactor;
                        scroll._initializeScrollbarVariables(obj);
                        scroll._scrollbarUpdate.call(this, obj);
                        scroll._setScrollPosition.call(this, obj.startX, obj.startX + obj.rectWidth, obj);
                    }
                }
            }
        },

        _hideTooltip: function () {
            $("#" + this.svgObject.id).find("#" + this.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden');
            $("#" + this.svgObject.id + "_TrackToolTip").attr('visibility', 'hidden').hide();
            $('.tooltipDiv' + this._id).css("display", "none");
        },
        _removeHighlight: function () {
            $("[id*=" + "HighlightSegment" + "]").remove();
            $("[id*=" + "HighlightPath" + "]").remove();
            $("[id*=" + "HighlightLegendSegment" + "]").remove();
            $("[id*=" + "HighlightLegendPath" + "]").remove();
            $("[id*=" + "HighlightDef" + "]").remove();
            $("[id*=" + "Highlightseries" + "]").remove();
            $("[id*=" + this._id + "_Highlight_" + "]").remove();
            if (!this.model.enableCanvasRendering && !this.vmlRendering) {
                var highlightedElement = this.svgObject.querySelector("[class^='Highlight']");
                if (highlightedElement !== null && highlightedElement.length == null)
                    highlightedElement.removeAttribute("class");
                else
                    for (var j = highlightedElement && highlightedElement.length; j--;)
                        highlightedElement.removeAttribute("class");
            }
        },
        _removeSelection: function () {
            $("[id*=" + this._id + '_SelectionCluster_Legend' + "]").remove();
            $("[id*=" + this._id + '_Selection_series' + "]").remove();
            $("[id*=" + this._id + '_Selection_Cluster' + "]").remove();
            $("[id*=" + this._id + "SelectionSegment" + "]").remove();
            $("[id*=" + this._id + "SelectionPath" + "]").remove();
            $("[id*=" + this._id + "SelectionLegend" + "]").remove();
            $("[id*=" + this._id + "SelectionDef" + "]").remove();
            $("[id*=" + this._id + "Selectionseries" + "]").remove();
            $('[id*=' + this._id + '_Selection_' + ']').remove();
        },


        //tooltip for trimmed datalabel
        datalabelTooltip: function (evt, i, font) {
            var mouseMoveCords = this.calMousePosition(evt);
            this.mousemoveX = mouseMoveCords.X;
            this.mousemoveY = mouseMoveCords.Y;
            var containerId = this._id;
            var currentX = this.mousemoveX;
            var currentY = this.mousemoveY;
            var vmlRendering = this.vmlRendering;
            var space = this.model.elementSpacing;
            var chart = this;
            var minX, minY, maxX, maxY;
            var tooltipdiv, tooltipLength;
            var remaining, left;
            if (!ej.util.isNullOrUndefined(this.accDataLabelRegion[i])) {
                $.each(this.accDataLabelRegion[i], function (index, regionItem) {
                    minX = regionItem.bounds.minX;
                    minY = regionItem.bounds.minY;
                    maxX = regionItem.bounds.maxX;
                    maxY = regionItem.bounds.maxY;
                    if (vmlRendering) {
                        minX = regionItem.bounds.minX + (regionItem.bounds.width / 2);
                        maxX = regionItem.bounds.maxX + (regionItem.bounds.width / 2);
                        minY = regionItem.bounds.minY;
                        maxY = regionItem.bounds.maxY;
                    }
                    if (currentX >= minX && currentX <= maxX) {
                        if (currentY >= minY && currentY <= maxY) {
                            $("#" + containerId + "_tooltip").remove();
                            tooltipdiv = $("<div></div>").attr({ 'id': containerId + "_tooltip", 'class': 'ejTooltip' + containerId });
                            if (regionItem.trimmedText != regionItem.text) {
                                $("#" + chart.svgObject.id + "_TrackToolTip").hide();
                                $(tooltipdiv).html(regionItem.text);
                                $(document.body).append(tooltipdiv);
                                tooltipLength = ej.EjSvgRender.utils._measureText(regionItem.text, regionItem.text.length, regionItem.font).width;
                                $(tooltipdiv).css({
                                    "top": evt.pageY + space,
                                    "display": "block",
                                    "position": "absolute",
                                    "z-index": "13000",
                                    "cursor": "default",
                                    "color": "#000000",
                                    "font-size": font.size,
                                    "background-color": "#FFFFFF",
                                    "border": "1px solid #707070",
                                    "white-space": "nowrap",
                                    "padding": "5px"
                                });
                                if (regionItem.type == "pyramid" || regionItem.type == "funnel") {
                                    remaining = chart.model.m_AreaBounds.Width + chart.model.m_AreaBounds.X - evt.pageX;
                                    if (remaining > tooltipLength)
                                        $(tooltipdiv).css({ "left": evt.pageX + space });
                                    else {
                                        left = evt.pageX - tooltipLength + (2 * space);
                                        $(tooltipdiv).css({ "left": left });

                                    }
                                }
                                if (regionItem.type == "pie" || regionItem.type == "doughnut" || regionItem.type == "pieofpie") {
                                    if (minX > regionItem.bounds.centerX) {
                                        remaining = chart.svgWidth - chart.model.margin.left - chart.model.margin.right - currentX;
                                        if (remaining < tooltipLength) {
                                            left = evt.pageX - tooltipLength;
                                            $(tooltipdiv).css({ "left": left + space });
                                        }
                                        else
                                            $(tooltipdiv).css({ "left": evt.pageX + space });
                                    }
                                    else {
                                        remaining = currentX;
                                        if (remaining < tooltipLength) {
                                            $(tooltipdiv).css({ "left": evt.pageX + space });
                                        }
                                        else {
                                            left = evt.pageX - tooltipLength;
                                            $(tooltipdiv).css({ "left": left - (2 * space) });
                                        }
                                    }
                                }

                            }
                        }
                    }
                });
            }
        },
        // Tooltip in svg 
        showAxisTooltip: function (pageX, pageY, str, trimmedText, isRTL, font) {
            var id = this._id;
            var tooltipdiv = $("<div></div>").attr({ 'id': id + "_tooltip", 'class': 'ejTooltip' + id });
            $(tooltipdiv).html(str);
            if (isRTL && !ej.util.isNullOrUndefined(font)) {
                var labelTextWidth = ej.EjSvgRender.utils._measureText(str, null, font).width;
                var trimmedTextWidth = ej.EjSvgRender.utils._measureText(trimmedText, null, font).width;
                var textWidth = trimmedTextWidth <= labelTextWidth ? labelTextWidth : trimmedTextWidth;
            }
            $(document.body).append(tooltipdiv);
            // adding css prop to the div
            $(tooltipdiv).css({
                "left": isRTL ? pageX - textWidth : pageX + 10,
                "top": pageY + 10,
                "display": "block",
                "position": "absolute",
                "padding-left": "3px",
                "padding-right": "3px",
                "z-index": "13000",
                "cursor": "default",
                "font-family": "Segoe UI",
                "color": "#707070",
                "font-size": "12px",
                "background-color": "#FFFFFF",
                "border": "1px solid #707070"
            });
        },
        _textTooltip: function (evt, region, isRTL, font) {
            var chart = this,
                mouseMoveCords = this.calMousePosition(evt),
                isEjScroll = this.model.legend._ejScroller,
                scrollleft = 0, scrolltop = 0,
				vScrollerWidth = 18,
                mousemoveX = isRTL && ($("#legend_" + this._id).find('[class*="e-vscrollbar"]').length || $("#legend_" + this._id)[0].style.overflowY == "scroll")? mouseMoveCords.X - vScrollerWidth : mouseMoveCords.X,
                mousemoveY = mouseMoveCords.Y,
                currentX = mousemoveX,
                currentY = mousemoveY,
                containerId = this._id,
                chartModel = chart.model,
                legend = chartModel.legend,
                isScroll = legend.enableScrollbar,
                textOverflow = legend.textOverflow.toLowerCase(),
                displayText, tooltipdiv;
            scrolltop = isEjScroll ? $("#legend_" + this._id).ejScroller('instance').model.scrollTop : $("#legend_" + this._id).scrollTop();
            scrollleft = isEjScroll ? $("#legend_" + this._id).ejScroller('instance').model.scrollLeft : $("#legend_" + this._id).scrollLeft();
            if (isRTL && isEjScroll) {
                if (scrollleft == 0)
                    scrollleft = $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue;
                else if ($("#legend_" + this._id).ejScroller('instance').model.scrollLeft == $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue)
                    scrollleft = 0;
                else
                    scrollleft = $("#legend_" + this._id).ejScroller('instance')._rtlScrollLeftValue - $("#legend_" + this._id).ejScroller('instance').model.scrollLeft;

            }
            if (isScroll || isEjScroll) {
                currentX = mousemoveX + (scrollleft ? scrollleft : 0);
                currentY = mousemoveY + (scrolltop ? scrolltop : 0);
            }

            $.each(region, function (index, regionItem) {

                if ((currentX >= regionItem.bounds.x) && (currentX <= regionItem.bounds.x + regionItem.bounds.width)) {
                    if (((currentY >= regionItem.bounds.y) && (currentY <= regionItem.bounds.y + regionItem.bounds.height)) || ((currentY >= regionItem.bounds.y - (regionItem.bounds.height / 3)) && (currentY <= regionItem.bounds.y))) {

                        $("#" + containerId + "_tooltip").remove();
                        tooltipdiv = $("<div></div>").attr({ 'id': containerId + "_tooltip", 'class': 'ejTooltip' + containerId });
                        displayText = jQuery.type(regionItem.trimText) == "array" ? regionItem.trimText.join(" ") : regionItem.trimText;
                        if (displayText != regionItem.labelText) {
                            $(tooltipdiv).html(regionItem.labelText);
                            if (isRTL && !ej.util.isNullOrUndefined(font))
                                var labelTextWidth = ej.EjSvgRender.utils._measureText(regionItem.labelText, null, font).width;
                            $(document.body).append(tooltipdiv);
                            // adding css prop to the div
                            $(tooltipdiv).css({
                                "left": isRTL ? evt.pageX - labelTextWidth - 15 : evt.pageX + 10,
                                "top": evt.pageY + 10,
                                "display": "block",
                                "position": "absolute",
                                "padding-left": "3px",
                                "padding-right": "3px",
                                "z-index": "13000",
                                "cursor": "default",
                                "font-family": "Segoe UI",
                                "color": "#707070",
                                "font-size": "12px",
                                "background-color": "#FFFFFF",
                                "border": "1px solid #707070"
                            });
                        }
                    }
                }
            });
        },
        pieExplosion: function (data) {
            this.model.explode = true;
            var region = data;
            var id;
            var targetElement;
            var symbolName, pieSeriesIndex;
            var series = region.region.Series;
            var seriesIndex = region.region.SeriesIndex;
            var seriesType = new ej.seriesTypes[series.type.toLowerCase()]();
            var explodePoint = series.explodeIndex;
            var _labelPosition = series.labelPosition.toLowerCase();
            var currentExplodePoint = { SeriesIndex: region.pointData[0].SeriesIndex, PointIndex: region.pointData[0].Index };
            var pieActualIndex = this.model._isPieOfPie ? region.pointData[0].PointIndex : region.region.Series._visiblePoints[region.pointData[0].Index].actualIndex;
            if (explodePoint != pieActualIndex && !region.region.Series.explodeAll) {
                series.explodeIndex = pieActualIndex;
                pieSeriesIndex = region.pointData[0].PieSeriesIndex;
                if (!ej.util.isNullOrUndefined(this.model.explodeValue) && this.model.explodeValue != currentExplodePoint) {
                    if (this.model.explodeValue.SeriesIndex != region.region.SeriesIndex)
                        series = this.model._visibleSeries[this.model.explodeValue.SeriesIndex];
                    var visiblePoint = this.model._isPieOfPie ? this._getPieOfPiePoint(this.model.explodeValue.PointIndex, series) : series._visiblePoints[this.model.explodeValue.Index];
                    var result = seriesType._calculateArcData(this, this.model.explodeValue.PointIndex, visiblePoint, series, this.model.explodeValue.SeriesIndex, this.model.explodeValue.PieSeriesIndex);
                    id = this.svgObject.id + '_SeriesGroup' + '_' + this.model.explodeValue.SeriesIndex;

                    targetElement = (this.model.explodeValue.PieSeriesIndex == 1) ? $(this.gSeriesEle).children('#' + id)[1] : $(this.gSeriesEle).children('#' + id)[0];
                    var elements = $(targetElement).children();
                    for (var i = 0; i < elements.length; i++) {
                        var element = elements[i];
                        var index = this.svgRenderer._getAttrVal($(element)[0], "data-pointIndex");
                        if (parseInt(index) == this.model.explodeValue.PointIndex) {
                            this.svgRenderer._setAttr($(element), { 'd': result.Direction });
                            break;
                        }
                    }

                    seriesType.drawDataLabelAcc(this, series, this.model.explodeValue.Index, visiblePoint, this.model.explodeValue.SeriesIndex, this.model.explodeValue.PieSeriesIndex)

                }

                var seriesPoint = this.model._isPieOfPie ? this._getPieOfPiePoint(data.region.Region.PointIndex, series) : series._visiblePoints[region.pointData[0].Index];

                result = seriesType._calculateArcData(this, region.pointData[0].PointIndex, seriesPoint, region.region.Series, seriesIndex, pieSeriesIndex);

                id = this.svgObject.id + '_SeriesGroup' + '_' + region.region.SeriesIndex;
                targetElement = pieSeriesIndex == 1 ? $(this.gSeriesEle).children('#' + id)[1] : $(this.gSeriesEle).children('#' + id)[0];


                var elements = $(targetElement).children();

                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var index = this.svgRenderer._getAttrVal($(element)[0], "data-pointIndex");
                    if (parseInt(index) == region.pointData[0].PointIndex) {
                        this.svgRenderer._setAttr($(element), { 'd': result.Direction });
                        break;
                    }
                }
                if (this.model.enableCanvasRendering) {
                    var chartRect = document.getElementById(this.svgObject.id).getClientRects()[0];
                    this.svgRenderer.ctx.clearRect(chartRect.left, chartRect.top, chartRect.width, chartRect.height);
                    $("#" + this._id).ejChart("redraw");
                }


                seriesType.drawDataLabelAcc(this, series, region.pointData[0].Index, seriesPoint, seriesIndex, pieSeriesIndex)


                this.model.explodeValue = { SeriesIndex: region.pointData[0].SeriesIndex, PointIndex: region.pointData[0].PointIndex, Index: region.pointData[0].Index, PieSeriesIndex: region.pointData[0].PieSeriesIndex };
            }
            region.region.Series.explodeIndex = explodePoint;
        },
        displayGroupingTemplate: function (x, y, location, seriesPoint, series, serIndex, ptIndex, chartLoc, seriescolor) {
            var point = [], color = [], childNode = [], seriesCollection = [], seriesLength, padding, templateLocX, templateLocY, xLoc, yLoc, div;
            color = $.extend(true, {}, seriescolor);
            seriesCollection = $.extend(true, {}, series);
            seriesLength = Object.keys(seriesCollection).length;// calculate object length.
            point = $.extend(true, {}, seriesPoint);
            padding = 5;
            for (var i = 0; i < seriesLength; i++) {
                isTrans = seriesCollection[i].series.isTransposed;
                point[i].point.x = point[i].point.x;
                if (seriesCollection[i].series.xAxis._valueType.toLowerCase() == "datetime")
                    point[i].point.x = (ej.format(new Date(point[i].point.x), (ej.EjSvgRender.utils._dateTimeLabelFormat(seriesCollection[i].series.xAxis.intervalType, seriesCollection[i].series.xAxis))));
                if (seriesCollection[i].series.xAxis._valueType.toLowerCase() == "category") point[i].point.x = ej.EjSvgRender.utils._getLabelContent(ptIndex, seriesCollection[i].series.xAxis);
                x = ej.util.isNullOrUndefined(x) ? 0 : x;
                y = ej.util.isNullOrUndefined(y) ? 0 : y;
                templateLocX = this.model.m_AreaBounds.X;
                templateLocY = this.model.m_AreaBounds.Y;
                xLoc = ((isTrans) || this.model.requireInvertedAxes) ? seriesCollection[i].series.yAxis.y : location.X + x + templateLocX + this.model.crosshair.marker.size.width + padding;
                yLoc = ((isTrans) || this.model.requireInvertedAxes) ? seriesCollection[i].series.xAxis.x + location.Y : this.model.m_AreaBounds.Height / 2 + templateLocY;
                div = $("#" + this.model.crosshair.trackballTooltipSettings.tooltipTemplate).clone();
                $(div).css("background-color", color[i].seriesColor);
                $(div).css("display", "block");
                point[i].point.count = 1;
                series.count = length;
                var data = { series: series, point: point[i].point };
                childNode.push($(div).html($(div).html().parseTemplate(data)));
            }
            if ($("#" + this.svgObject.id + "_TrackGroupToolTipTemplate").length == 0) {
                tooltipdiv = $("<div id =" + this.svgObject.id + 'TrackGroupToolTipTemplate' + " style='pointer-events:none; position: absolute; z-index: 13000; display: block;'></div>");
                $(tooltipdiv).appendTo(this.chartContainer);
            }
            $(tooltipdiv).append(childNode);
            var border = this.model.crosshair.trackballTooltipSettings.border;
            $(tooltipdiv).css("border", border.width + "px solid " + border.color);
            var templateHeight = parseFloat($(tooltipdiv).css('height'));
            var templateWidth = parseFloat($(tooltipdiv).css('width'));

            yLoc = ((isTrans) || this.model.requireInvertedAxes) ? yLoc : yLoc - templateHeight / 2;

            if ((seriesLength == 1) && !isTrans) {
                yLoc = location.Y + templateLocY + templateHeight / 2;
            }
            if (seriesLength == 1 && ((isTrans) || this.model.requireInvertedAxes)) {
                xLoc = location.X + x + templateLocX + this.model.crosshair.marker.size.width + padding - templateWidth / 2;
                yLoc = location.Y + templateLocY - templateHeight - this.model.crosshair.marker.size.height - padding;
            }
            if ((yLoc + (templateHeight)) < this.model.m_AreaBounds.Y) {
                yLoc = this.model.m_AreaBounds.Y;
            } else if ((yLoc + (templateHeight / 2)) > (this.model.m_AreaBounds.Height)) {
                yLoc -= templateHeight;
            }
            if ((xLoc + templateWidth > templateLocX + this.model.m_AreaBounds.Width) && (!isTrans)) {
                xLoc = location.X + x + templateLocX - this.model.crosshair.marker.size.width - padding - templateWidth;
            }

            $(tooltipdiv).css("left", xLoc);
            $(tooltipdiv).css("top", yLoc);

        },
        displayTemplateTooltip: function (x, y, location, seriesPoint, series, serIndex, ptIndex, chartLoc) {
            var point = $.extend(true, {}, seriesPoint);
            var padding = 5;
            point.x = point.x;
            if (series.xAxis._valueType.toLowerCase() == "datetime")
                point.x = (ej.format(new Date(point.x), (ej.EjSvgRender.utils._dateTimeLabelFormat(series.xAxis.intervalType, series.xAxis))));
            if (series.xAxis._valueType.toLowerCase() == "category") point.x = ej.EjSvgRender.utils._getLabelContent(ptIndex, series.xAxis);
            x = ej.util.isNullOrUndefined(x) ? 0 : x;
            y = ej.util.isNullOrUndefined(y) ? 0 : y;
            var templateLocX = this.model.m_AreaBounds.X;
            var axes = this.model._axes, pointXAxis = series._xAxisName, pointYAxis = series._yAxisName;
            var axisY, axisX;
            for (var j = 0, len = axes.length; j < len; j++) {
                if (pointXAxis == axes[j].name) {
                    if (!series._isTransposed) {
                        axisX = axes[j].Location.X1;
                    } else {
                        axisY = axes[j].Location.Y2;
                    }
                } else if (pointYAxis == axes[j].name) {
                    if (!series._isTransposed) {
                        axisY = axes[j].Location.Y2;
                    } else {
                        axisX = axes[j].Location.X1;
                    }
                }
            }
            var xLoc = location.X + this.model.crosshair.marker.size.width + axisX;
            var yLoc = location.Y + y + axisY;
            var tooltipdiv;
            if ($("#" + this.svgObject.id + "_TrackToolTipTemplate_" + serIndex).length == 0) {
                tooltipdiv = $("<div id=" + this.svgObject.id + '_TrackToolTipTemplate_' + serIndex + " style='pointer-events:none;position: absolute; z-index: 13000; display: block;'></div>");
                $(document.body).append(tooltipdiv);
            }
            if (this.model.crosshair.trackballTooltipSettings.tooltipTemplate != null) {
                var cloneNode = document.getElementById(this.model.crosshair.trackballTooltipSettings.tooltipTemplate).cloneNode(true);
                $(cloneNode).css("display", "block").appendTo(tooltipdiv);
                series.count = 1;
                point.count = 1;
                var seriesColor = this.getSeriesColor(point, serIndex, series);
                $(tooltipdiv).css("background-color", jQuery.type(seriesColor) == "array" ? seriesColor[0].color : seriesColor);
                var data = { series: series, point: point };
                $(tooltipdiv).html($(tooltipdiv).html().parseTemplate(data));
            }
            yLoc -= parseFloat($(tooltipdiv).css('height')) / 2;
            var templateHeight = parseFloat($(tooltipdiv).css('height'));
            var templateWidth = parseFloat($(tooltipdiv).css('width'));
            if ((series.isTransposed) || (this.model.requireInvertedAxes)) {
                yLoc = (location.Y + this.model.m_AreaBounds.Y) - templateHeight - padding - this.model.crosshair.marker.size.height;
                xLoc = location.X + templateLocX - templateWidth / 2;
            }
            if ((yLoc + templateHeight < this.model.m_AreaBounds.Y) && ((series.isTransposed) || this.model.requireInvertedAxes)) {
                yLoc += templateHeight + this.model.crosshair.marker.size.height + padding + chartLoc.top;
            }
            if (xLoc + templateWidth > templateLocX + this.model.m_AreaBounds.Width) {
                xLoc -= (templateWidth + (padding * 2) + this.model.crosshair.marker.size.width);
            }
            $(tooltipdiv).css("left", xLoc);
            $(tooltipdiv).css("top", yLoc);
        },
        displayAxisTooltip: function (location, text, axis, index, mouseLoc, tracker) {

            if (axis._valueType.toLowerCase() == "double") {
                var customFormat = (!(axis.labelFormat)) ? null : axis.labelFormat.match('{value}');
                text = (!(axis.labelFormat)) ? text : (customFormat != null) ? (axis.labelFormat == "${value}") ? axis.labelFormat.replace('{value}', '$' + Number(text)) : axis.labelFormat.replace('{value}', Number(text)) : (ej.format(Number(text), axis.labelFormat, this.model.locale));
            }
            var maxTickSize = 0,
                orientation = axis.orientation.toLowerCase(), position,
                hPadding = 0,
                vPadding = 0,
                opposedPosition = axis._opposed,
                enableCanvas = this.model.enableCanvasRendering,
                maxLocation = opposedPosition ? ((maxTickSize + 10) + (axis.x + axis.width)) : (axis.x + axis.width);
            for (var i = 0; i < this.model._axes.length; i++) {
                if (this.model._axes[i].majorTickLines.size > maxTickSize) {
                    maxTickSize = this.model._axes[i].majorTickLines.size;
                }
            }

            if (location.X >= 0 && location.X <= maxLocation) {
                var x = (location.X);
                var y = location.Y;
                var padding = 5;
                var commonTrackTextArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonTrackTextArgs.data = { axisIndex: index, chartAxis: axis, currentTrackText: text, location: mouseLoc };
                this._trigger("trackAxisToolTip", commonTrackTextArgs);

                var trackAxisText = commonTrackTextArgs.data.currentTrackText;

                var textOffset = ej.EjSvgRender.utils._measureText(trackAxisText, null, axis.crosshairLabel.font);
                if (orientation == 'horizontal') {
                    x = x - textOffset.width / 2;
                    if (axis.labelPosition == 'inside' || (opposedPosition ? mouseLoc.y < axis.y : mouseLoc.y > axis.y)) {
                        if (opposedPosition == false) {
                            y = axis.y - textOffset.height + maxTickSize - (axis._isScroll ? this.model.scrollerSize : 0);
                            position = "top";
                        }
                        if (opposedPosition == true) {
                            y = axis.y + textOffset.height - maxTickSize;
                            position = "bottom";
                        }
                    }
                    else {
                        if (opposedPosition == true) {
                            y = axis.y - textOffset.height / 2 - padding - maxTickSize;
                            position = "bottom";
                        }
                        if (opposedPosition == false) {
                            y = axis.y + textOffset.height - padding + maxTickSize;
                            position = "top";
                        }
                    }
                    hPadding = padding;
                    y = y + (axis._isScroll ? (axis.opposedPosition ? -this.model.scrollerSize : this.model.scrollerSize) : 0);
                }
                if (!(opposedPosition) && (x + textOffset.width) > (this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X)) {
                    x = ((this.model.m_AreaBounds.Width + this.model.m_AreaBounds.X) - textOffset.width) + padding + this.model.elementSpacing;
                }
                if (orientation == 'vertical') {
                    y = location.Y + textOffset.height / 4;
                    if (axis.labelPosition == 'inside' || (!opposedPosition && mouseLoc.x < axis.x)) {
                        if (opposedPosition == true) {
                            x = axis.x - textOffset.width + padding - maxTickSize;
                            position = "left";
                        }
                        if (opposedPosition == false) {
                            // Space between the marker and the trackball
                            x = axis.x + 2 * padding + (axis._isScroll ? this.model.scrollerSize : 0);
                            position = "right";
                        }
                    } else {
                        if (opposedPosition == true) {
                            // Space between the marker and the trackball
                            x = axis.x + 3 * padding;
                            position = "left";
                        }
                        if (opposedPosition == false) {
                            x = axis.x - textOffset.width - maxTickSize;
                            position = "right";
                        }
                    }
                    x = x + (axis._isScroll ? (axis.opposedPosition ? this.model.scrollerSize : -this.model.scrollerSize) : 0);
                    vPadding = padding;
                }

                var textAxisOptions = {
                    'id': this.svgObject.id + '_AxisToolTipText' + '_' + index,
                    'x': x - vPadding,
                    'y': y + hPadding,
                    'fill': axis.crosshairLabel.font.color,
                    'font-size': axis.crosshairLabel.font.size,
                    'font-family': axis.crosshairLabel.font.fontFamily,
                    'font-style': axis.crosshairLabel.font.fontStyle,
                    'font-weight': axis.crosshairLabel.font.fontWeight,
                    'text-anchor': 'start',
                    'opacity': axis.crosshairLabel.font.opacity

                };
                var canvasPadding = (enableCanvas) ? padding / 4 : 0,
                    fontSize = ej.EjSvgRender.utils._measureText(commonTrackTextArgs.data.currentTrackText, this.model.m_AreaBounds.Width, axis.crosshairLabel.font),
                    crosshairLabel = axis.crosshairLabel,
                    x = (x - padding),
                    y = (y - (fontSize.height)),
                    width = (fontSize.width) + (2 * padding),
                    height = (2 * fontSize.height) - (2 * padding);
                var toolAxisRectOptions = {
                    'x': x - vPadding,
                    'y': y + hPadding,
                    'width': width,
                    'height': height,
                    'rx': crosshairLabel.rx * ((enableCanvas) ? 2 : 1),
                    'ry': crosshairLabel.ry * ((enableCanvas) ? 2 : 1)
                };
                var direction = ej.EjSvgRender.utils._calculateroundedCorner(null, toolAxisRectOptions, true, position, 0, tracker);
                toolAxisRectOptions = {
                    'id': this.svgObject.id + '_AxisToolTipRect' + '_' + index,
                    'd': direction,
                    'fill': crosshairLabel.fill,
                    'stroke-width': crosshairLabel.border.width,
                    'stroke': crosshairLabel.border.color
                };

                var axes = this.model._axes[index];
                if ((mouseLoc.y < (axes.y + axes.height) && mouseLoc.y > axes.y) || (mouseLoc.x < (axes.x + axes.width) && mouseLoc.x > axes.x)) {
                    this.svgRenderer._setAttr($('#' + this.svgObject.id + '_AxisToolTipRect' + '_' + index), { "display": 'block' });
                    this.svgRenderer._setAttr($('#' + this.svgObject.id + '_AxisToolTipText' + '_' + index), { "display": 'block' });
                    toolAxisRectOptions.display = 'block';
                }
                else {
                    this.svgRenderer._setAttr($('#' + this.svgObject.id + '_AxisToolTipRect' + '_' + index), { "display": 'none' });
                    this.svgRenderer._setAttr($('#' + this.svgObject.id + '_AxisToolTipText' + '_' + index), { "display": 'none' });
                    toolAxisRectOptions.display = 'none';
                }
                if (enableCanvas) {
                    var obj = this.svgRenderer.createCrosshairCanvas();
                    obj.ctx = obj.getContext('2d');
                }
                else
                    var obj = this.svgRenderer;
                this.svgRenderer.drawPath.call(obj, toolAxisRectOptions, this.gTrackAxisEle);
                this.svgRenderer.drawText.call(obj, textAxisOptions, commonTrackTextArgs.data.currentTrackText, this.gTrackAxisEle);
            }
        },
        maxWdithArrayCollection: function (arrayCollection, font) {
            var maxTextWidth = 0, size, width = 0, height = 0,
                measureText = ej.EjSvgRender.utils._measureText;
            for (var txt = 0, txtlength = arrayCollection.length; txt < txtlength; txt++) {
                size = measureText(arrayCollection[txt], 0, font);
                width = size.width;
                height += size.height;
                maxTextWidth = (maxTextWidth == 0) ? width : (maxTextWidth < width) ? width : maxTextWidth;
            }
            return { maxTextWidth: maxTextWidth, totalHeight: height };
        },
        displayTooltip: function (grouping, tooltipCollections, maxWidth) {
            // common variables for both grouping and float
            var crosshair = this.model.crosshair, trackball = crosshair.trackballTooltipSettings, rx = trackball.rx, ry = trackball.ry, trackballBorder = trackball.border,
                m_AreaBounds = this.model.m_AreaBounds;
            var isRTL = this.model.crosshair.isReversed;
            if (grouping) {
                var series = tooltipCollections.series, groupSize, groupHeight, container = document.getElementById(this._id),
                    offset = $(container).offset(),
                    rectOptions = series.tooltip, font = rectOptions.font ? $.extend(false, series.font, {}, rectOptions.font) : series.font,
                    point = series.type == "boxandwhisker" ? tooltipCollections.point.boxPlotLocation[3] : tooltipCollections.point.location,
                    m_width = ((series.marker.size.width / 2 + series.marker.border.width + trackballBorder.width)) + 5,// 5 for space between group element and tracker
                    yAxisY = ((series._isTransposed) ? (series.xAxis.y + m_width) : series.yAxis.y),
                    xAxisX = ((series._isTransposed) ? series.yAxis.x : (series.xAxis.x + m_width)),
                    location = { X: xAxisX + point.X, Y: yAxisY + point.Y },
                    textCollection = tooltipCollections.textCollection, textOptionsCollection = tooltipCollections.textOptionsCollection,
                    groupingTextId = tooltipCollections.groupingTextId,
                    options, span,
                    groupLocation = { X: (location.X), Y: location.Y },
                    groupElement = document.getElementById(this._id + "_trackball_grouping_tooltip");
                this._trigger("trackToolTip", { data: { currentText: textCollection, location: groupLocation } });
                if (!ej.util.isNullOrUndefined(this.model.trackToolTip) && this.model.trackToolTip != "") {
                    for (var tx = 0, len = textCollection.length; tx < len - 1; tx++) {
                        if (textCollection[tx].text == "") {
                            textCollection.splice(tx, 1);
                            textOptionsCollection.splice(tx, 1);
                            groupingTextId.splice(tx, 1);
                        }
                    }
                }
                if (ej.util.isNullOrUndefined(groupElement)) {
                    groupElement = document.createElement("div");
                    options = {
                        'left': groupLocation.X,
                        'top': groupLocation.Y,
                        'border': parseInt((trackballBorder.width) ? trackballBorder.width : 1) + "px solid " + ((trackballBorder.color) ? trackballBorder.color : "#000000"),
                        'background': (trackball.fill) ? trackball.fill : "#ffffff",
                        'opacity': trackball.opacity,
                        'position': 'absolute',
                        'height': 'auto',
                        'width': 'auto',
                        'border-radius': rx + "px " + ry + "px",
                        'pointer-events': 'none'
                    };
                    groupElement.setAttribute('id', this._id + "_trackball_grouping_tooltip");
                }
                else {
                    options = {
                        'left': groupLocation.X,
                        'top': groupLocation.Y,
                    }
                }
                for (var tx = 0, len = textCollection.length; tx < len; tx++) {
                    span = document.createElement("span");
                    span.setAttribute("id", groupingTextId[tx]);
                    span.innerHTML = textCollection[tx].text + "</br>";
                    $(span).css(textOptionsCollection[tx]);
                    groupElement.appendChild(span);
                }
                var arrayCollection = textCollection.map(function (a) { return a.text; });
                groupSize = this.maxWdithArrayCollection(arrayCollection, font);
                maxWidth = groupSize.maxTextWidth;
                groupHeight = groupSize.totalHeight;
                options.top = (series._isTransposed) ? options.top : (options.top - (groupHeight * 0.5));
                options.left = (series._isTransposed) ? (options.left - (maxWidth * 0.5)) : options.left;
                if (textCollection.length > 1) {
                    options.top = (series._isTransposed) ? options.top : (yAxisY + (m_AreaBounds.Height * 0.5 - (0.5 * groupHeight)));
                    options.left = (series._isTransposed) ? (((m_AreaBounds.Width / 2) + m_AreaBounds.X) - (maxWidth * 0.5)) : options.left;
                }
                if (!series._isTransposed) {
                    if (options.left + maxWidth >= (m_AreaBounds.X + m_AreaBounds.Width))
                        options.left -= (maxWidth + (m_width + trackballBorder.width) * 2);// extra space on edge group element swifting for already added need to remove 
                }
                else {

                    if ((groupHeight + options.top) > (m_AreaBounds.Y + m_AreaBounds.Height))
                        options.top -= (groupHeight + (m_width * 2));// extra space on edge group element swifting
                }
                options.left = (groupLocation.X == location.X) ? options.left : groupLocation.X;
                options.top = (groupLocation.Y == location.Y) ? options.top : groupLocation.Y;
                $(groupElement).css(options);
                $(groupElement).appendTo(this.chartContainer);

            }
            else {
                for (var init = 0, tlength = tooltipCollections.length; init < tlength; init++) {

                    var location = tooltipCollections[init].Point, point = tooltipCollections[init].ClosestPoint, series = tooltipCollections[init].Series, pointIndex = tooltipCollections[init].ClosestPointIndex, tgap = tooltipCollections[init].Tgap,
                        seriesIndex = $.inArray(series, this.model._visibleSeries),
                        Axis = { X1: m_AreaBounds.X, Y1: (m_AreaBounds.Y + m_AreaBounds.Height), X2: (m_AreaBounds.X + m_AreaBounds.Width), Y2: m_AreaBounds.Y },
                        axes = this.model._axes, pointXAxis = series._xAxisName, pointYAxis = series._yAxisName;

                    for (var j = 0, len = axes.length; j < len; j++) {
                        if (pointXAxis == axes[j].name) {
                            if (!series._isTransposed)
                                Axis.X1 = axes[j].Location.X1, Axis.X2 = axes[j].Location.X2;
                            else
                                Axis.Y1 = axes[j].Location.Y1, Axis.Y2 = axes[j].Location.Y2;
                        }
                        else if (pointYAxis == axes[j].name) {
                            if (!series._isTransposed)
                                Axis.Y1 = axes[j].Location.Y1, Axis.Y2 = axes[j].Location.Y2;
                            else
                                Axis.X1 = axes[j].Location.X1, Axis.X2 = axes[j].Location.X2;
                        }
                    }
                    location.X = (series.type == "boxandwhisker") ? location.X + Axis.X1 : location.X;
                    location.Y = (series.type == "boxandwhisker") ? location.Y + Axis.Y2 : location.Y;
                    if ((location.X >= Axis.X1 && location.X <= Axis.X2 && location.Y >= Axis.Y2 && location.Y <= Axis.Y1) || (grouping)) {
                        var requireInvertedAxes = this.model.requireInvertedAxes, tx, ty,
                            x = location.X + (!series.isIndicator ? ((ej.util.isNullOrUndefined(series._trackMarker)) ? series.marker.size.width : (series._trackMarker.size.width)) : 0) + padding + 1,
                            y = (location.Y), format = series.tooltip.format, numberToFixed = ((ej.util.isNullOrUndefined(series.yAxis.roundingPlaces)) ? 2 : series.yAxis.roundingPlaces);
                        if (tooltipCollections[init].Series.type == "boxandwhisker" && location.outlier)
                            var trackTooltipText = this.getTooltipFormat(point, series, seriesIndex, pointIndex, format, location);
                        else
                            var trackTooltipText = this.getTooltipFormat(point, series, seriesIndex, pointIndex, format, numberToFixed);
                        var seriesName = (series.name) ? (series.name).replace(' ', '') : "series" + seriesIndex, commonTrackTextArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs),
                            toolRectOptions, direction;
                        commonTrackTextArgs.data = { Location: { X: x, Y: y }, Series: series, serIndex: seriesIndex, pointIndex: pointIndex, currentText: trackTooltipText.text };
                        this._trigger("trackToolTip", commonTrackTextArgs);
                        if (!commonTrackTextArgs.cancel) {
                            x = commonTrackTextArgs.data.Location.X;
                            y = commonTrackTextArgs.data.Location.Y;
                            var padding = this.model.tooltipPadding, tip_pos = tgap, rectOptions = series.tooltip, font = rectOptions.font ? $.extend(false, series.font, {}, rectOptions.font) : series.font, textOffset = ej.EjSvgRender.utils._measureText(commonTrackTextArgs.data.currentText, series.xAxis.width, font), seriesColor = this.getSeriesColor(point, seriesIndex, series);
                            var toolTipOptions = this.getTooltipOptions(seriesColor, series), rectBorderColor = toolTipOptions.rectBColor, rectFillColor = toolTipOptions.rectFColor, textColor = toolTipOptions.rectTextColor, rectWidth = textOffset.width + (2 * padding), rectHeight = textOffset.height + (2 * padding), poly, tipOpen = (requireInvertedAxes) ? ((rectWidth * 10) / 100) : ((rectHeight * 30) / 100),
                                axisWidth = (requireInvertedAxes) ? series.yAxis.width : series.xAxis.width, tooltipStartPosition = (requireInvertedAxes) ? (tgap + location.X - rectWidth / 2) : (tgap + location.Y - rectHeight / 2), tooltipEndPosition = (requireInvertedAxes) ? (tgap + location.X + rectWidth / 2) : (tgap + location.Y + rectHeight / 2), boundryStart = (requireInvertedAxes) ? (m_AreaBounds.X) : (m_AreaBounds.Y), boundryEnd = (requireInvertedAxes) ? (m_AreaBounds.X + m_AreaBounds.Width) : (m_AreaBounds.Y + m_AreaBounds.Height), text_pos = [],
                                marker_width = 3 + crosshair.marker.border.width + ((!requireInvertedAxes) ? crosshair.marker.size.width : crosshair.marker.size.height) / 2,
                                swp = (!this.model.financial) ? marker_width + 5 : 0, type = series.type.toLowerCase(),
                                position, hsize = type.indexOf("rangearea") == 0 ? this.model.crosshair.marker.size.height / 2 : 0;
                            if ((tooltipStartPosition >= boundryStart && tooltipEndPosition <= (boundryEnd)) || this.model.financial) {
                                if (requireInvertedAxes) {
                                    if (location.Y - swp - maxWidth < m_AreaBounds.Y) {
                                        toolRectOptions = {
                                            'x': location.X - rectWidth / 2 + tip_pos,
                                            'y': location.Y + swp,
                                            'width': rectWidth,
                                            'height': rectHeight,
                                            'rx': rx,
                                            'ry': ry
                                        };
                                        text_pos.push({ X: location.X - rectWidth / 2 + padding + tip_pos, Y: location.Y + swp + rectHeight / 2 - padding });
                                        position = "top";

                                    } else {
                                        if (this.model.financial) {
                                            x = location.X - rectWidth / 2 + tip_pos; y = location.Y + padding + hsize; tx = x + padding; ty = y + 2 * padding;
                                            position = "top";
                                        }
                                        else {
                                            x = location.X - rectWidth / 2 + tip_pos; y = location.Y - swp - rectHeight; tx = location.X - rectWidth / 2 + padding + tip_pos; ty = location.Y - swp - rectHeight / 2 - padding;
                                            position = "bottom";
                                        }
                                        toolRectOptions = {
                                            'x': x,
                                            'y': y,
                                            'width': rectWidth,
                                            'height': rectHeight,
                                            'rx': rx,
                                            'ry': ry
                                        };
                                        text_pos.push({ X: tx, Y: ty });

                                    }
                                }
                                else {

                                    if (location.X + swp + maxWidth - m_AreaBounds.X >= axisWidth || isRTL) {
                                        if (this.model.financial) {
                                            x = location.X - rectWidth / 2; y = location.Y - rectHeight - padding - hsize; tx = x + padding; ty = y + tip_pos + rectHeight;
                                            position = "bottom";
                                        }
                                        else {
                                            if (location.X - maxWidth <= this.model.m_AreaBounds.X && isRTL) {
                                                x = location.X + swp; y = location.Y - rectHeight / 2 + tip_pos; tx = x + padding; ty = location.Y + tip_pos + rectHeight / 2;
                                                position = "left";
                                            }
                                            else {
                                                x = location.X - swp - rectWidth; y = location.Y - rectHeight / 2 + tip_pos; tx = x + padding; ty = location.Y + tip_pos + rectHeight / 2;
                                                position = "right";
                                            }
                                        }
                                        toolRectOptions = {
                                            'x': x,
                                            'y': y,
                                            'width': rectWidth,
                                            'height': rectHeight,
                                            'rx': rx,
                                            'ry': ry
                                        };

                                        text_pos.push({ X: tx, Y: ty });

                                    }
                                    else {
                                        if (this.model.financial) {
                                            x = location.X - rectWidth / 2; y = location.Y - hsize - rectHeight - 2 * padding; tx = x + padding; ty = y + tip_pos + rectHeight;
                                            position = "bottom";
                                        }
                                        else {
                                            x = location.X + swp; y = location.Y - rectHeight / 2 + tip_pos; tx = x + padding; ty = location.Y + tip_pos + rectHeight / 2;
                                            position = "left";
                                        }

                                        toolRectOptions = {
                                            'x': x,
                                            'y': y,
                                            'width': rectWidth,
                                            'height': rectHeight,
                                            'rx': rx,
                                            'ry': ry
                                        };

                                        text_pos.push({ X: tx, Y: ty });


                                    }
                                }




                                var tooltipfill = seriesColor;
                                if (typeof (tooltipfill) == "object") {
                                    tooltipfill = seriesColor[1].color;
                                }



                                var text = commonTrackTextArgs.data.currentText, fontText = text, fontSize = ej.EjSvgRender.utils._measureText(text, series.xAxis.width, font).height, len;
                                if (commonTrackTextArgs.data.currentText.indexOf("<br/>") >= 0) {
                                    text = commonTrackTextArgs.data.currentText.split("<br/>");
                                    fontText = text[0];
                                    if (!requireInvertedAxes) {
                                        var isCandle = (type.indexOf("candle") >= 0 || type.indexOf("hiloopenclose") >= 0) || false;
                                        if (location.X + swp + maxWidth - m_AreaBounds.X >= axisWidth) {
                                            if (!this.model.financial) {
                                                tx = location.X - rectWidth - swp + padding;
                                                ty = ((location.Y + tip_pos) - (rectHeight / 2) + fontSize / text.length);
                                            }
                                            else {
                                                tx = location.X - rectWidth / 2 + padding;
                                                ty = ((location.Y + tip_pos) - (rectHeight)) - hsize + ((isCandle) ? 0 : 2 * padding);
                                                toolRectOptions.y -= (isCandle) ? padding * 3 : padding;
                                                toolRectOptions.height += (isCandle) ? padding * 2 : padding;
                                            }


                                            text_pos.push({ X: tx, Y: ty });
                                        }
                                        else {
                                            if (!this.model.financial) {
                                                tx = location.X + swp + padding;
                                                ty = ((location.Y + tip_pos) - (rectHeight / 2) + fontSize / text.length);
                                            }
                                            else {

                                                tx = location.X - rectWidth / 2 + padding;
                                                ty = ((location.Y + tip_pos) - (rectHeight)) - hsize + ((isCandle) ? 0 : padding);
                                                toolRectOptions.y -= (isCandle) ? padding * 2 : padding;
                                                toolRectOptions.height += (isCandle) ? padding * 2 : padding;
                                            }
                                            text_pos.push({ X: tx, Y: ty });
                                        }
                                    }
                                    else {
                                        if (location.Y - swp - maxWidth < m_AreaBounds.Y) {
                                            text_pos.push({ X: location.X - rectWidth / 2 + padding + tip_pos, Y: location.Y + swp + (fontSize / text.length) });
                                        }
                                        else {
                                            if (!this.model.financial) {
                                                tx = location.X - rectWidth / 2 + padding + tip_pos;
                                                ty = location.Y - swp - rectHeight + (fontSize / text.length);
                                            }
                                            else {
                                                tx = location.X - rectWidth / 2 + padding + tip_pos;
                                                ty = (location.Y + 4 * padding) + hsize;
                                            }
                                            text_pos.push({ X: tx, Y: ty });
                                        }
                                    }
                                    fontSize = 0;
                                }
                                len = text_pos.length - 1;
                                fontSize = (requireInvertedAxes) ? fontSize : -fontSize;
                                var index = series.type == "boxandwhisker" ? init : pointIndex;
                                var textOptions = {
                                    'id': this.svgObject.id + '_ToolTipText' + '_' + seriesIndex + "_" + index,
                                    'x': text_pos[len].X,
                                    'y': text_pos[len].Y + fontSize / 2,
                                    'fill': rectOptions.font ? (rectOptions.font.color ? rectOptions.font.color : "#ffffff") : "#ffffff",
                                    'font-size': font.size,
                                    'font-family': font.fontFamily,
                                    'font-style': font.fontStyle,
                                    'font-weight': font.fontWeight,
                                    'text-anchor': 'start',
                                    'isTrackball': true,
                                    'padding': this.model.tooltipPadding
                                };

                                direction = ej.EjSvgRender.utils._calculateroundedCorner(null, toolRectOptions, true, position, tip_pos);

                                var arrowPath = {
                                    'id': this.svgObject.id + '_gTooltip_' + seriesIndex + '_' + index,
                                    'd': direction,
                                    'fill': ((trackball.fill) ? trackball.fill : tooltipfill),
                                    "stroke-width": parseInt(trackball.border.width ? trackball.border.width : 0) + "px",
                                    "stroke": trackball.border.color ? trackball.border.color : 'transparent',
                                    'fill-opacity': trackball.opacity
                                };

                                if (this.model.enableCanvasRendering) {
                                    var obj = this.svgRenderer.createCrosshairCanvas();
                                    obj.ctx = obj.getContext('2d');
                                }

                                else
                                    var obj = this.svgRenderer;


                                var gTooltip = this.svgRenderer.createGroup({ 'id': this.svgObject.id + '_gTooltip_' + seriesIndex + "_" + index, });

                                this.svgRenderer.drawPath.call(obj, arrowPath, gTooltip);
                                this.svgRenderer.drawText.call(obj, textOptions, text, gTooltip, font);

                            }
                        }                        
                        if ($('#' + this.svgObject.id + "_TrackToolTip_" + seriesIndex).length == 0)
                            this.svgRenderer.append($(gTooltip), this.gTrackball);
                    }
                }
            }
        },
        SmartTooltipPosition: function (SmartTooltipOptions) {
            var InitialRanges = [[], []], exceed, length_SmartTooltips = SmartTooltipOptions.length, visibleLocation = [], totalSapce = (SmartTooltipOptions[0].Series._isTransposed) ? this.model.m_AreaBounds.Width : this.model.m_AreaBounds.Height, tooltipPadding = this.model.tooltipPadding, tooltipWidth = -tooltipPadding;
            for (var a = 0; a < length_SmartTooltips; a++) {
                InitialRanges[0][a] = $.extend({}, SmartTooltipOptions[a].StEnd);
                InitialRanges[1][a] = { yAxis: SmartTooltipOptions[a].Series._yAxisName, xAxis: SmartTooltipOptions[a].Series._xAxisName, isTransposed: SmartTooltipOptions[a].Series._isTransposed };
                if (SmartTooltipOptions[a].ReqInvertAxis) {
                    visibleLocation[a] = SmartTooltipOptions[a].Point.X;
                }
                else {
                    visibleLocation[a] = SmartTooltipOptions[a].Point.Y;
                }
                tooltipWidth += SmartTooltipOptions[a].StEnd.End - SmartTooltipOptions[a].StEnd.Start + tooltipPadding;
            }
            this.ContinousOverlappingPoints(InitialRanges[0], visibleLocation);
            if (tooltipWidth < totalSapce)
                this.verticalArrangeMents(InitialRanges);
            for (var a = 0; a < length_SmartTooltips; a++) {
                SmartTooltipOptions[a].Tgap = (!this.model.financial) ? InitialRanges[0][a].Start - SmartTooltipOptions[a].StEnd.Start : 0;
            }
        },
        verticalArrangeMents: function (startEndRanges) {
            var pointsRanges = startEndRanges[0],
                axisNames = startEndRanges[1], //axis names contains isTransposed also
                obj = this.model.m_AreaBounds,
                padding = this.model.tooltipPadding,
                isTransposed,
                chartHeight,
                startPos,
                yAxisName,
                axes = this.model._axes,
                temp,//current trackabll tooltip start end
                secTemp,//vertical arrangements
                secWidth,//vertical arrange width
                condition,
                width, length = pointsRanges.length, i = length - 1, j = 0, k = 0, axisLength = axes.length;
            for (; i >= 0; i--) {
                isTransposed = axisNames[i].isTransposed;
                yAxisName = axisNames[i].yAxis;
                for (k = 0; k < axisLength; k++) {
                    if (yAxisName == axes[k].name) {
                        if (isTransposed) {
                            chartHeight = axes[k].Location.X2;
                            startPos = axes[k].Location.X1;
                        }
                        else {
                            chartHeight = axes[k].Location.Y1;
                            startPos = axes[k].Location.Y2;
                        }
                    }
                }
                temp = pointsRanges[i];
                width = temp.End - temp.Start;
                if (chartHeight < temp.End) {
                    temp.End = chartHeight - 2;
                    temp.Start = temp.End - width;
                    for (j = i - 1; j >= 0; j--) {
                        secTemp = pointsRanges[j];
                        secWidth = secTemp.End - secTemp.Start;
                        if (secTemp.End > pointsRanges[j + 1].Start && (pointsRanges[j + 1].Start > startPos && pointsRanges[j + 1].End < chartHeight)) {
                            secTemp.End = pointsRanges[j + 1].Start - padding;
                            secTemp.Start = secTemp.End - secWidth;
                        }
                    }
                }
            }
            for (i = 0; i < length; i++) {
                isTransposed = axisNames[i].isTransposed;
                yAxisName = axisNames[i].yAxis;
                for (k = 0; k < axisLength; k++) {
                    if (yAxisName == axes[k].name) {
                        if (isTransposed) {
                            chartHeight = axes[k].Location.X2;
                            startPos = axes[k].Location.X1;
                        }
                        else {
                            chartHeight = axes[k].Location.Y1;
                            startPos = axes[k].Location.Y2;
                        }
                    }
                }
                temp = pointsRanges[i];
                width = temp.End - temp.Start;
                if (temp.Start < startPos) {
                    temp.Start = startPos + 1;
                    temp.End = temp.Start + width;
                    for (j = i + 1; j <= (length - 1); j++) {
                        secTemp = pointsRanges[j];
                        secWidth = secTemp.End - secTemp.Start;
                        if (secTemp.Start < pointsRanges[j - 1].End && (pointsRanges[j - 1].Start > startPos && pointsRanges[j - 1].End < chartHeight)) {
                            secTemp.Start = pointsRanges[j - 1].End + padding;
                            secTemp.End = secTemp.Start + secWidth;
                        }
                    }
                }
            }
        },
        ContinousOverlappingPoints: function (TooltipRanges, visibleLocation) {
            var padding = this.model.tooltipPadding, temp = 0, Count = 0, Start = 0, StartPoint = 0, endPoint = TooltipRanges.length - 1, Range = (TooltipRanges[0].End - TooltipRanges[0].Start) + padding, halfHeight, midPos, tRange, kRange;
            temp = TooltipRanges[0].Start + Range;
            Start = TooltipRanges[0].Start;
            for (var i = 0; i < endPoint; i++) {
                if (temp >= TooltipRanges[i + 1].Start) {
                    Range = TooltipRanges[i + 1].End - TooltipRanges[i + 1].Start + padding;
                    temp += Range;
                    Count++;
                    if (Count - 1 == endPoint - 1 || i == endPoint - 1) {
                        halfHeight = (temp - Start) / 2;
                        midPos = (visibleLocation[StartPoint] + visibleLocation[i + 1]) / 2;
                        tRange = TooltipRanges[StartPoint].End - TooltipRanges[StartPoint].Start;
                        TooltipRanges[StartPoint].Start = midPos - halfHeight;
                        TooltipRanges[StartPoint].End = TooltipRanges[StartPoint].Start + tRange;
                        for (var k = StartPoint; k > 0; k--) {
                            if (TooltipRanges[k].Start <= TooltipRanges[k - 1].End + padding) {
                                kRange = TooltipRanges[k - 1].End - TooltipRanges[k - 1].Start;
                                TooltipRanges[k - 1].Start = TooltipRanges[k].Start - kRange - padding;
                                TooltipRanges[k - 1].End = TooltipRanges[k - 1].Start + kRange;
                            }
                            else {
                                break;
                            }
                        }
                        for (var j = StartPoint + 1; j <= StartPoint + Count; j++) {
                            tRange = TooltipRanges[j].End - TooltipRanges[j].Start;
                            TooltipRanges[j].Start = TooltipRanges[j - 1].End + padding;
                            TooltipRanges[j].End = TooltipRanges[j].Start + tRange;

                        }
                    }

                }
                else {
                    Count = i > 0 ? Count : 0;
                    if (Count > 0) {
                        halfHeight = (temp - Start) / 2;
                        midPos = (visibleLocation[StartPoint] + visibleLocation[i]) / 2;
                        tRange = TooltipRanges[StartPoint].End - TooltipRanges[StartPoint].Start;
                        TooltipRanges[StartPoint].Start = midPos - halfHeight;
                        TooltipRanges[StartPoint].End = TooltipRanges[StartPoint].Start + tRange;
                        for (var k = StartPoint; k > 0; k--) {
                            if (TooltipRanges[k].Start <= TooltipRanges[k - 1].End + padding) {
                                kRange = TooltipRanges[k - 1].End - TooltipRanges[k - 1].Start;
                                TooltipRanges[k - 1].Start = TooltipRanges[k].Start - kRange - padding;
                                TooltipRanges[k - 1].End = TooltipRanges[k - 1].Start + kRange;
                            }
                            else {
                                break;
                            }
                        }
                        for (var j = StartPoint + 1; j <= StartPoint + Count; j++) {
                            tRange = TooltipRanges[j].End - TooltipRanges[j].Start;
                            TooltipRanges[j].Start = TooltipRanges[j - 1].End + padding;
                            TooltipRanges[j].End = TooltipRanges[j].Start + tRange;
                        }
                        Count = 0;
                    }
                    Range = (TooltipRanges[i + 1].End - TooltipRanges[i + 1].Start + padding);
                    temp = TooltipRanges[i + 1].Start + Range;
                    Start = TooltipRanges[i + 1].Start;
                    StartPoint = i + 1;
                }

            }
        },
        getTooltipOptions: function (seriesColor, series) {
            var rectBorderColor, rectFillColor, rX, rY, textColor;
            if (this.model.theme.indexOf("gradient") >= 0) {
                rectBorderColor = jQuery.type(seriesColor) == "array" ? seriesColor[0].color : seriesColor;
                rectFillColor = 'white';
                textColor = "#333333";
                rX = 5;
                rY = 5;

            } else {
                var type = series.type.toLowerCase();
                if (type.indexOf("column") == -1 && type.indexOf("waterfall") == -1 && type.indexOf("bar") == -1 && type.indexOf("box") == -1 && type != "rangearea" && this.model.AreaType != "none") {
                    rectFillColor = jQuery.type(seriesColor) == "array" ? seriesColor[0].color : seriesColor;
                    rectBorderColor = 'transparent';
                    textColor = "white";
                } else {
                    rectBorderColor = "#333333";
                    rectFillColor = 'white';
                    textColor = "#333333";
                }
                rX = 0;
                rY = 0;
            }
            return { rectBColor: rectBorderColor, rectFColor: rectFillColor, rectTextColor: textColor, rectX: rX, rectY: rY };
        },
        getSeriesColor: function (point, seriesIndex, series) {
            var seriesColor;
            if (series && !series.isIndicator && !series.isTrendLine) {
                if (point._hiloFill) {
                    if (!point._hiloFill._gradientStop)
                        seriesColor = point._hiloFill;
                    else {
                        seriesColor = point._hiloFill._gradientStop[0].color;
                    }
                }
                else if (point.fill) {
                    if (!point.fill._gradientStop)
                        seriesColor = point.fill;
                    else {
                        seriesColor = point.fill._gradientStop[0].color;
                    }
                }
                else {
                    if (series.type.toLowerCase() == "waterfall" && series.positiveFill &&
                        ((point.y > 0 && !point.showIntermediateSum && !point.showTotalSum) || point.waterfallSum > 0))
                        seriesColor = series.positiveFill;
                    else
                        seriesColor = this.model.seriesColors[seriesIndex];

                }
            } else {
                seriesColor = series.fill;
            }
            return seriesColor;
        },
        getFormat: function (series, boxLocation) {

            if (!series.tooltip.format) {
                var type = series.type.toLowerCase();
                var outlierVisible = series.type != "boxandwhisker" ? 'null' : boxLocation.outlier;
                if (type.indexOf("range") > -1 || (type.indexOf("hilo") > -1 && type.indexOf("open") == -1))
                    return "#point.x# <br/> High : #point.high# <br/> Low : #point.low#";
                else if (type.indexOf("candle") > -1 || type.indexOf("open") > -1)
                    return "#point.x# <br/> High : #point.high# <br/> Low : #point.low# <br/> Open : #point.open# <br/> Close : #point.close#";
                else if (type.indexOf("bubble") > -1)
                    return "#point.x# : #point.y# : #point.size#"
                else if (type.indexOf("box") > -1 && outlierVisible)
                    return "X : #boxPlotPoints.xValue#  Y : #boxPlotPoints.YValues#";
                else if (type.indexOf("box") > -1)
                    return "Minimum : #boxPlotPoints.Minimum# <br/> Upper Quartile : #boxPlotPoints.UpperQuartile# <br/> Median : #boxPlotPoints.midvalue# <br/> Lower Quartile : #boxPlotPoints.LowerQuartile# <br/> Maximum : #boxPlotPoints.Maximum#  ";
                else
                    return "#point.x# : #point.y#"
            }
            return series.tooltip.format;
        },
        getTooltipFormat: function (seriesPoint, series, serIndex, ptIndex, format, boxLocation) {
            var point = $.extend(true, {}, seriesPoint),
                areaType = this.model.AreaType,
                locale = this.model.locale,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                xAxisValueType = xAxis._valueType.toLowerCase(),
                nullorundefined = ej.util.isNullOrUndefined,
                xAxisLabelFormat = xAxis.labelFormat,
                yAxisLabelFormat = yAxis.labelFormat,
                dateTimeFormat = ej.EjSvgRender.utils._dateTimeLabelFormat,
                decimalPlaces = ej.EjSvgRender.utils._decimalPlaces,
                xGlobalize = false, yGlobalize = false,
                xFormat, yFormat,
                customFormat, data, substr,
                xPrecision, yPrecision, precisionDefault = 6, precisionHighest = 20;
            series.count = 1;
            point.count = 1;
            format = this.getFormat(series, boxLocation);
            while (format.indexOf('ej.format(') >= 0) {
                substr = format.substring(format.indexOf('ej.format('), format.indexOf(")") + 1);
                var calculate = substr.substring(substr.indexOf('(') + 1, substr.indexOf(","));
                if (calculate == "#point.x#") {
                    xGlobalize = true,
                        xFormat = substr.substring(substr.indexOf(',') + 1, substr.indexOf(")"));
                }
                else if (calculate == "#point.y#") {
                    yGlobalize = true,
                        yFormat = substr.substring(substr.indexOf(',') + 1, substr.indexOf(")"));
                } else {
                    globalizeformat = substr.substring(substr.indexOf(',') + 1, substr.indexOf(")"));
                    subStr1 = calculate.substring(calculate.indexOf('#') + 1);
                    val = subStr1.substring(subStr1.indexOf('.') + 1, subStr1.indexOf('#'));
                    if (point.hasOwnProperty(val) && point[val])
                        point[val] = ej.format(point[val], globalizeformat, locale);
                }
                format = format.replace(substr, calculate)
            }
            if (areaType == "cartesianaxes") {
                if (xAxisValueType.toLowerCase() == "datetime") {
                    point.x = ej.format(new Date(point.xValue), ((nullorundefined(xAxisLabelFormat)) ? dateTimeFormat(xAxis._intervalType, xAxis) : series.xAxis.labelFormat), locale);
                    point.x = xGlobalize ? (ej.format(new Date(point.xValue), xFormat, locale)) : point.x;
                }
                else if (xAxisValueType.toLowerCase() == "datetimecategory") {
                    point.x = ej.format(new Date(point.x), ((nullorundefined(xAxisLabelFormat)) ? dateTimeFormat(xAxis.intervalType, xAxis) : xAxis.labelFormat), locale);
                    point.x = xGlobalize ? (ej.format(new Date(point.x), xFormat, locale)) : point.x;
                }
                else if (xAxisValueType.toLowerCase() == "category") {
                    if (this.model.primaryXAxis.isIndexed)
                        point.x = (point.x) ? point.x : "undefined";
                    else
                        point.x = ej.EjSvgRender.utils._getLabelContent(point.xValue, series.xAxis, locale);
                }
                else {
                    if ((xGlobalize && (xFormat.indexOf('e') == 0 || xFormat.indexOf('E') == 0))) {
                        point.x = this.convertExponential(xPrecision, precisionDefault, precisionHighest, point.x, xFormat);
                    }
                    else
                        point.x = xGlobalize ? ej.format(point.x, xFormat, locale) : point.x;
                    customFormat = (!(xAxisLabelFormat)) ? null : xAxisLabelFormat.match('{value}');
                    point.x = (!(xAxisLabelFormat)) ? point.x : (customFormat != null) ? (xAxisLabelFormat == "${value}") ? xAxisLabelFormat.replace('{value}', '$' + point.x) : xAxisLabelFormat.replace('{value}', point.x) : (xGlobalize || (xAxisLabelFormat.indexOf('e') == 0 || xAxisLabelFormat.indexOf('E') == 0)) ? point.x : (ej.format(Number(point.x), xAxisLabelFormat, locale));

                }
            }
            else {
                if (xAxisValueType == "date") {
                    point.x = (ej.format(new Date(point.xValue), (dateTimeFormat('days')), locale));
                    point.x = xGlobalize ? (ej.format(new Date(point.xValue), xFormat, locale)) : point.x;
                }
            }
            if ((yGlobalize && (yFormat.indexOf('e') == 0 || yFormat.indexOf('E') == 0))) {
                point.y = this.convertExponential(yPrecision, precisionDefault, precisionHighest, point.y, yFormat);
            }
            else {
                point.y = point.waterfallSum ? point.waterfallSum : point.y;
                point.y = yGlobalize ? ej.format(point.y, yFormat, locale) : point.y;
            }
            customFormat = (!(yAxisLabelFormat)) ? null : yAxisLabelFormat.match('{value}');
            point.y = (!(yAxisLabelFormat)) ? point.y : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + point.y) : yAxisLabelFormat.replace('{value}', point.y) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? point.y : (ej.format(Number(point.y), yAxisLabelFormat, locale));
            if ((areaType == 'none' || areaType == 'polaraxes') && xGlobalize && (xFormat.indexOf('e') == 0 || xFormat.indexOf('E') == 0)) {
                point.x = this.convertExponential(xPrecision, precisionDefault, precisionHighest, point.x, xFormat);
            }
            if (series.isStacking && series.drawType == "area" && ((series.type == "polar") || (series.type == "radar"))) {
                point.y = series.stackedValue.EndValues[ptIndex] - series.stackedValue.StartValues[ptIndex];
            }
            if (series.type.toLowerCase() == "boxandwhisker") {
                var boxPlotLabels;
                boxPlotLabels = series._visiblePoints[ptIndex].boxPlotValues;
                if (boxLocation.outlier == true) {
                    for (var z = 0; z < boxPlotLabels.outliers.length; z++) {
                        if (boxLocation.YValues == boxPlotLabels.outliers[z])
                            boxLocation.YValues = (!(yAxisLabelFormat)) ? boxLocation.YValues : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxLocation.YValues) : yAxisLabelFormat.replace('{value}', boxLocation.YValues) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxLocation.YValues : (ej.format(Number(boxLocation.YValues), yAxisLabelFormat, locale));
                    }
                }
                else {
                    if (boxLocation.YValues == boxPlotLabels.Minimum)
                        boxPlotLabels.Minimum = (!(yAxisLabelFormat)) ? boxPlotLabels.Minimum : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxPlotLabels.Minimum) : yAxisLabelFormat.replace('{value}', boxPlotLabels.Minimum) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxPlotLabels.Minimum : (ej.format(Number(boxPlotLabels.Minimum), yAxisLabelFormat, locale));
                    else if (boxLocation.YValues == boxPlotLabels.Maximum)
                        boxPlotLabels.Maximum = (!(yAxisLabelFormat)) ? boxPlotLabels.Maximum : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxPlotLabels.Maximum) : yAxisLabelFormat.replace('{value}', boxPlotLabels.Maximum) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxPlotLabels.Maximum : (ej.format(Number(boxPlotLabels.Maximum), yAxisLabelFormat, locale));
                    else if (boxLocation.YValues == boxPlotLabels.UpperQuartile)
                        boxPlotLabels.UpperQuartile = (!(yAxisLabelFormat)) ? boxPlotLabels.UpperQuartile : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxPlotLabels.UpperQuartile) : yAxisLabelFormat.replace('{value}', boxPlotLabels.UpperQuartile) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxPlotLabels.UpperQuartile : (ej.format(Number(boxPlotLabels.UpperQuartile), yAxisLabelFormat, locale));
                    else if (boxLocation.YValues == boxPlotLabels.LowerQuartile)
                        boxPlotLabels.LowerQuartile = (!(yAxisLabelFormat)) ? boxPlotLabels.LowerQuartile : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxPlotLabels.LowerQuartile) : yAxisLabelFormat.replace('{value}', boxPlotLabels.LowerQuartile) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxPlotLabels.LowerQuartile : (ej.format(Number(boxPlotLabels.LowerQuartile), yAxisLabelFormat, locale));
                    else if (boxLocation.YValues == boxPlotLabels.midvalue)
                        boxPlotLabels.midvalue = (!(yAxisLabelFormat)) ? boxPlotLabels.midvalue : (customFormat != null) ? (yAxisLabelFormat == "${value}") ? yAxisLabelFormat.replace('{value}', '$' + boxPlotLabels.midvalue) : yAxisLabelFormat.replace('{value}', boxPlotLabels.midvalue) : (yGlobalize || (yAxisLabelFormat.indexOf('e') == 0 || yAxisLabelFormat.indexOf('E') == 0)) ? boxPlotLabels.midvalue : (ej.format(Number(boxPlotLabels.midvalue), yAxisLabelFormat, locale));
                }
                boxPlotLabels.count = series.count;
                boxPlotLabels.xValue = point.x;
                boxPlotLabels.YValues = boxLocation.YValues;
                data = { boxPlotPoints: boxPlotLabels };
            }
            else
                data = { series: series, point: point };
            format = format.parseTemplate(data);
            return { data: point, text: format };
        },
        convertExponential: function (precision, precisionDefault, precisionHighest, point, format) {
            precision = format.match(/(\d+)/g);
            precision = precision == null ? precisionDefault : precision > precisionHighest ? precisionHighest : precision;
            point = point.toExponential(precision);
            return point;
        },
        displayShowTooltip: function (location, point, series, pointIndex) {
            var requireInvertedAxes = this.model.requireInvertedAxes;
            var isRTL = series.tooltip.isReversed;
            if (point.visible !== false) {
                // fixed multiple tooltip issue in mobile
                $(".ejTooltip" + this._id).not("#" + this.svgObject.id + "_TrackToolTip").remove();
                if ($.finish)
                    $(".ejTooltip" + this._id).finish();
                else
                    $(".ejTooltip" + this._id).stop(true, true);
                var measureText, parentZindex, seriesIndex = (!series.isIndicator && !series.isTrendLine) ? $.inArray(series, this.model._visibleSeries) : 0,
                    seriesColor,
                    textOffset,
                    padding = 7, bubbleSpacing = 15,
                    x,
                    y,
                    trackTooltipText,
                    format = series.tooltip.format;
                var position = document.getElementById(this.svgObject.id).getClientRects()[0];
                var chartPos = this.model.m_AreaBounds;
                var type = series.type.toLowerCase();
                //Set tooltip position ,text and color
                switch (this.model.AreaType) {

                    case "cartesianaxes":
                        x = isRTL ? location.X - ((!series.isIndicator && !series.isTrendLine) ? ((ej.util.isNullOrUndefined(series._trackMarker)) ?
                            (type == "bubble" ? (point.radius + bubbleSpacing) : series.marker.size.width) : (series._trackMarker.size.width)) : 0) + (type == "column" || type == "bar" || type == "stackingbar" || type == "stackingcolumn" || type == "waterfall" || type == "rangecolumn" ? chartPos.X : (requireInvertedAxes) ? series.yAxis.x : series.xAxis.x)
                            : location.X + ((!series.isIndicator && !series.isTrendLine) ? ((ej.util.isNullOrUndefined(series._trackMarker)) ?
                            (type == "bubble" ? (point.radius + bubbleSpacing) : series.marker.size.width) : (series._trackMarker.size.width)) : 0) + (type == "column" || type == "bar" || type == "stackingbar" || type == "stackingcolumn" || type == "waterfall" || type == "rangecolumn" ? chartPos.X : (requireInvertedAxes) ? series.yAxis.x : series.xAxis.x);
                        //condition checked for multipleaxis line tooltip position changed
                        y = (location.Y) + (type.indexOf("column") != -1 || type.indexOf("waterfall") != -1 || type.indexOf("bar") != -1 || type.indexOf("rangearea") != -1 || type == "scatter" || type == "bubble" ?
                            (this.dragPoint ? (requireInvertedAxes ? series.xAxis.y : series.yAxis.y) : chartPos.Y) : (requireInvertedAxes) ? series.xAxis.y : series.yAxis.y);
                        if (this.dragPoint) {
                            x = x > series.xAxis.x ? x : series.xAxis.x;
                            y = y < series.yAxis.height + series.yAxis.y ? y : series.yAxis.height + series.yAxis.y;
                        }
                        seriesColor = this.getSeriesColor(point, seriesIndex, series);
                        break;

                    case "polaraxes":
                        x = isRTL ? location.X - padding + ((ej.util.isNullOrUndefined(series._trackMarker)) ? series.marker.size.width : (series._trackMarker.size.width)) :location.X + padding + ((ej.util.isNullOrUndefined(series._trackMarker)) ? series.marker.size.width : (series._trackMarker.size.width));
                        y = location.Y;
                        seriesColor = this.getSeriesColor(point, seriesIndex, series);
                        break;

                    case "none":
                        x = isRTL ? location.X - series.marker.size.width + padding : location.X + series.marker.size.width + padding;
                        y = (location.Y);
                        seriesColor = this.model.pointColors[pointIndex];
                        break;
                }


                if (series.type.toLowerCase() == "boxandwhisker") {
                    for (var p = 0; p < series._visiblePoints[pointIndex].boxPlotLocation.length; p++) {
                        var boxLocation = series._visiblePoints[pointIndex].boxPlotLocation[p];
                        var outlierVisible = boxLocation.outlier;
                        if (outlierVisible) {
                            if (boxLocation.X + (series.outlierSettings.size.width / 2) > location.X && boxLocation.X - (series.outlierSettings.size.width / 2) < location.X) {
                                if (boxLocation.Y + (series.outlierSettings.size.height / 2) > location.Y && boxLocation.Y - (series.outlierSettings.size.height / 2) < location.Y) {
                                    trackTooltipText = this.getTooltipFormat(point, series, seriesIndex, pointIndex, format, boxLocation);
                                    textOffset = ej.EjSvgRender.utils._measureText(trackTooltipText.text);
                                }
                            }
                        }
                        else {
                            trackTooltipText = this.getTooltipFormat(point, series, seriesIndex, pointIndex, format, boxLocation);
                            textOffset = ej.EjSvgRender.utils._measureText(trackTooltipText.text);
                        }
                    }
                }
                else {
                    trackTooltipText = this.getTooltipFormat(point, series, seriesIndex, pointIndex, format);
                    textOffset = ej.EjSvgRender.utils._measureText(trackTooltipText.text);
                }
                var toolTipOptions = this.getTooltipOptions(seriesColor, series);
                var rectBorderColor = toolTipOptions.rectBColor;
                var rectFillColor = toolTipOptions.rectFColor;
                var textColor = toolTipOptions.rectTextColor;
                var rX = toolTipOptions.rectX;
                var rY = toolTipOptions.rectY;
                var rectOptions = series.tooltip;
                //draw tooltip rectangle
                var tooltipdivRect;
                var padding = 5;

                if (document.getElementById(this.svgObject.id + "_TrackToolTip") == null)
                    tooltipdivRect = $("<div></div>").attr({ 'id': this.svgObject.id + "_TrackToolTip", 'class': 'ejTooltip' + this._id });
                else
                    tooltipdivRect = $("#" + this.svgObject.id + "_TrackToolTip");
                var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
                if (ej.isTouchDevice() && !isIE11 && !this.vmlRendering) {
                    if (window.navigator.msPointerEnabled)
                        this._on(tooltipdivRect, 'MSPointerMove', this.chartTooltipHover);
                    else
                        this._on(tooltipdivRect, 'touchmove', this.chartTooltipHover);
                }
                else {
                    this._on(tooltipdivRect, 'mousemove', this.chartTooltipHover);
                }
                $("#" + this.svgObject.id + "_TrackToolTip").show();
                parentZindex = $('#' + this._id).parent()[0].style.zIndex;
                var rectOptions = {
                    'top': y + $(document).scrollTop(),
                    'left': x + $(document).scrollLeft(),
                    "background-color": (rectOptions.fill) ? rectOptions.fill : rectFillColor,
                    "border-style": "solid",
                    "position": "absolute",
                    "border-color": (rectOptions.border.color) ? rectOptions.border.color : rectBorderColor,
                    "border-width": (rectOptions.border.width || rectOptions.border.width == 0) ? rectOptions.border.width : 1,
                    "opacity": rectOptions.opacity,
                    'z-index': parentZindex + 1000000,
                    'border-radius': ((rectOptions.rx) ? rectOptions.rx : rX).toString() + "px " + ((rectOptions.ry) ? rectOptions.ry : rY).toString() + "px",
                    "padding-left": '5px',
                    "padding-right": '5px',
                    "padding-top": '2px',
                    "padding-bottom": '2px'
                };
                $(tooltipdivRect).css(rectOptions);

                //event for tooltip text
                var commonTrackTextArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonTrackTextArgs.data = { seriesIndex: seriesIndex, pointIndex: pointIndex, currentText: trackTooltipText.text, isTrendLine: series.isTrendLine, trendlineIndex: series.trendlineIndex };
                this._trigger("toolTipInitialize", commonTrackTextArgs);
                if (!commonTrackTextArgs.cancel) {
                    //draw tooltip text
                    var fontSize = 0;
                    var tooltip = series.tooltip;
                    var font = (tooltip.font) ? $.extend(false, series.font, {}, tooltip.font) : series.font;

                    // draw tooltip text styles
                    var textOptions = {
                        'top': y + $(document).scrollTop(),
                        'left': x + $(document).scrollLeft(),
                        "color": (tooltip.font && tooltip.font.color) ? font.color : textColor,
                        'font-size': font.size,
                        'font-family': font.fontFamily,
                        'font-style': font.fontStyle,
                        'font-weight': font.fontWeight,
                        "align-self": "baseline"
                    };
                    $(tooltipdivRect).css(textOptions);

                    // append the tooltip Div (condition for performance without remove div)
                    if (document.getElementById(this.svgObject.id + "_TrackToolTip") == null)
                        $(document.body).append(tooltipdivRect[0]);

                    // Add string in text array for tooltip format
                    var text = measureText = commonTrackTextArgs.data.currentText;
                    $("#" + this.svgObject.id + "_TrackToolTip").html(text);

                    // div size calculation perform here
                    var textHeight = 0;
                    var textWidth = 0;
                    text = text.replace(/<br >/g, "<br/>")
                        .replace(/<br \/>/g, "<br/>")
                        .replace(/<br>/g, "<br/>");
                    text = text.split("<br/>");
                    for (var i = 0; i < text.length; i++) {
                        var text1 = text[i];
                        text1 = text1.split('</tr>');
                        for (var j = 0; j < text1.length; j++) {
                            var text2 = text1[j];
                            text2 = this.RemoveTableAttr(text2);
                            text2 = text2.replace(/&nbsp;/g, " ");
                            textHeight += ej.EjSvgRender.utils._measureText(text2, null, font).height;
                            var width = ej.EjSvgRender.utils._measureText(text2, null, font).width;
                            if (textWidth < width)
                                textWidth = width;
                        }
                    }

                    fontSize = (this.model.AreaType == "cartesianaxes") ? ej.EjSvgRender.utils._measureText(measureText, series.xAxis.width, font).height : ej.EjSvgRender.utils._measureText(text, null, font).height;
                    var maxWidth = (this.model.AreaType == "cartesianaxes") ? (this.model.requireInvertedAxes) ? series.yAxis.width : series.xAxis.width : $(this.svgObject).width() - (this.model.legend.position.toLowerCase() == "right" ? (this.model.LegendViewerBounds.Width + 2 * this.model.elementSpacing) : 0);
                    var maxHeight = (this.model.AreaType == "cartesianaxes") ? (this.model.requireInvertedAxes) ? series.xAxis.height : series.yAxis.height : $(this.svgObject).height() - (this.model.legend.position.toLowerCase() == "bottom" ? (this.model.LegendViewerBounds.Height + this.model.elementSpacing) : 0);

                    //Adjust x-position to display tooltip within chart area 
                    var box = $("#" + this.svgObject.id + "_TrackToolTip")[0].getBoundingClientRect();

                    $("#" + this.svgObject.id + "_TrackToolTip").css("top", ($(document).scrollTop() + box.top + position.top - ((textHeight + 4) / 2)));
                    $("#" + this.svgObject.id + "_TrackToolTip").css("left", ($(document).scrollLeft() + box.left + position.left + (box.left - x)));
                    if ((x + (textWidth + padding)) >= maxWidth + series.xAxis.x && !isRTL) {
                        var areaPos = document.getElementById(this.svgObject.id).getClientRects()[0];
                        var diff = x - ((textWidth + padding * 2) + ((!series.isIndicator && !series.isTrendLine) ? ((ej.util.isNullOrUndefined(series._trackMarker)) ? ((series.marker.visible) ?
                            series.marker.size.width : (type == "bubble" ? (point.radius + bubbleSpacing) : 0)) : series._trackMarker.size.width) : 0) + (2 * padding));
                        $("#" + this.svgObject.id + "_TrackToolTip").css("left", diff + areaPos.left - (padding) + $(document).scrollLeft());
                    }
                    box = $("#" + this.svgObject.id + "_TrackToolTip")[0].getBoundingClientRect();
                    if (box.bottom >= (series.yAxis.y + maxHeight + position.top) || box.bottom >= (series.xAxis.y + maxHeight + position.top)) {
                        var diffY = y - (((box.bottom - box.top) + ((!series.isIndicator && !series.isTrendLine) ? ((ej.util.isNullOrUndefined(series._trackMarker)) ? ((series.marker.visible) ? series.marker.size.height : 0) : series._trackMarker.size.height) : 0))) + padding + position.top;
                        $("#" + this.svgObject.id + "_TrackToolTip").css("top", diffY + $(document).scrollTop());
                    }
                    //adjust rectangle size based on text length  
                    box = $("#" + this.svgObject.id + "_TrackToolTip")[0].getBoundingClientRect();
                    if (box.left < 0) {
                        // checked condition for whether left position display outsude of the chart area
                        $("#" + this.svgObject.id + "_TrackToolTip").css("left", x);
                    }
                    if (box.top < position.top || box.top < 0)
                        $("#" + this.svgObject.id + "_TrackToolTip").css("top", (position.top < 0 ? $(document).scrollTop() : position.top) + 'px');
                    if (isRTL) {
                        var boxWidth = box.right - box.left;
                        $("#" + this.svgObject.id + "_TrackToolTip").css("left", box.x - boxWidth);
						if (box.x < series.xAxis.x) // to display tooltip within chartarea when it is outside for RTL
                        {
                            var diff = ((textWidth + padding * 2) + ((!series.isIndicator && !series.isTrendLine) ? ((ej.util.isNullOrUndefined(series._trackMarker)) ? ((series.marker.visible) ?
                            series.marker.size.width : (type == "bubble" ? (point.radius + bubbleSpacing) : 0)) : series._trackMarker.size.width) : 0) + (2 * padding));
                            $("#" + this.svgObject.id + "_TrackToolTip").css("left", box.x + diff);
                        }
                    }
                    $("#" + this.svgObject.id + "_TrackToolTip").show();
                }
            }
        },
		RemoveTableAttr: function (text) {
			if (text.indexOf('<table>') != -1 || text.indexOf('</table>') != -1 || text.indexOf('<td>') != -1 || text.indexOf('</td>') != -1 || 	text.indexOf('<tr>') != -1)
                     text = text.replace(/\//g, "").replace(/<table>/g, "").replace(/<th>/g, "").replace(/<tr>/g, "").replace(/<td>/g, "");
            while(text.search(/<td/i) > -1){
								if(text.search(/<tr/) > -1) text = text.slice(text.search(/<td/i))
								else {
									if(text.search(/<td/) > -1 && (text.indexOf('>') > text.search(/<td/)) ) {
										text = text.slice(text.indexOf(">") + 1);
										var splitText = text.split('<td');
										for (var i =0; i < splitText.length; i++){
											var currentText = splitText[i];
											splitText[i] = currentText.indexOf(">") > -1 ? currentText.slice(currentText.indexOf(">") + 1) : currentText;
										}
										text = splitText.join("");
									}
								}
							}
			return text;
		},
        chartTooltipHover: function (evt) {
            var box = $("#" + evt.target.id)[0].getBoundingClientRect();
            var diff = evt.clientX - box.left;
            var padding = 5;
            $("#" + evt.target.id).css("left", box.left + diff + padding);
            box = $("#" + evt.target.id)[0].getBoundingClientRect();
            var areaPos = document.getElementById(this.svgObject.id).getClientRects()[0];
            if (box.right > areaPos.right + padding)
                $("#" + evt.target.id).css("left", evt.clientX - (box.right - box.left) - padding);
        },
        _initializeSeriesColors: function () {
            var chartObj = this;
            var modelColor = (chartObj.model.palette) ? chartObj.model.palette : chartObj.model.colors;
            var count = modelColor.length;
            var areaType = chartObj.model.AreaType;
            chartObj.model.seriesColors = [];
            chartObj.model.seriesBorderColors = [];
            chartObj.model.pointColors = [];
            chartObj.model.pointBorderColors = [];
            var elementCollection, color, borderColor, element, tlines, visibleSeriesLength = chartObj.model._visibleSeries.length, visibleSeries = chartObj.model._visibleSeries
            if (areaType != "none") {
                elementCollection = chartObj.model._visibleSeries;
                color = chartObj.model.seriesColors;
                borderColor = chartObj.model.seriesBorderColors;
            }
            else {
                var lgth = 0;
                var longest;
                for (var i = 0; i < visibleSeriesLength; i++) {
                    var type = chartObj.model._visibleSeries[i].type.toLowerCase();
                    if (chartObj.model._visibleSeries[i].points.length > lgth) {
                        var lgth = chartObj.model._visibleSeries[i].points.length;
                        longest = chartObj.model._visibleSeries[i].points;
                    }
                    else if (chartObj.model._visibleSeries[i].points.length == lgth && type != "funnel" && type != "pieofpie" && type != "pyramid")
                        longest = chartObj.model._visibleSeries[i].points;
                }
                elementCollection = longest || [];
                color = chartObj.model.pointColors;
                borderColor = chartObj.model.pointBorderColors;
            }
            if (areaType == "none" && visibleSeriesLength > 1) {
                for (var k = 0; k < visibleSeriesLength; k++) {
                    chartObj.model.seriesColors[k] = modelColor[k % count];
                }
            }
            for (var i = 0; i < elementCollection.length; i++) {
                element = elementCollection[i];
                tlines = element.trendlines;
                element.isFill = (element.isFill == undefined) ? ((element.fill && element.fill != "") ? true : false) : element.isFill;
                if (element.isFill) {
                    color[i] = element.fill;
                } else {
                    color[i] = modelColor[i % count];
                    if (!element._hiloTypes)
                        element.fill = color[i];
                }
                if (areaType != "none" && tlines.length > 0)
                    this._initializeTrendlinesColors(tlines, color[i]);
                if (!ej.util.isNullOrUndefined(element.border) && !ej.util.isNullOrUndefined(element.border.color) && element.border.color != "") {
                    borderColor[i] = element.border.color;
                } else {
                    borderColor[i] = chartObj.model.seriesBorderDefaultColors[i % 10];
                    if (areaType != "none")
                        element.border.color = borderColor[i];
                }
                element.dataPoint = element.points;
            }
        },

        _initializeTrendlinesColors: function (tlines, color) {
            for (var k in tlines) {
                if (ej.util.isNullOrUndefined(tlines[k].fill) || tlines[k].fill == "")
                    tlines[k].fill = color;
            }
        },

        _createAxisLabelAndRange: function () {
            var count = 0,
                model = this.model,
                seriesCollection = model.series,
                seriesLength = seriesCollection.length,
                indicatorSeries,
                series,
                axisScroll,
                scrollRange,
                axis,
                primaryX = model.primaryXAxis,
                primaryY = model.primaryYAxis,
                axesLength;

            for (var i = 0; i < seriesLength; i++) {
                series = seriesCollection[i];
                if (series._isTransposed && this.model.AreaType != "polaraxes")
                    count++;
            }

            if (seriesLength) {
                if (count == seriesLength)
                    model.requireInvertedAxes = true;
                else {
                    series = seriesCollection[0];
                    if (series._isTransposed && this.model.AreaType != "polaraxes")
                        model.requireInvertedAxes = true;
                }
            }
            if (model.requireInvertedAxes) {
                primaryY.orientation = "horizontal";
                primaryX.orientation = "vertical";
                primaryY.labelPlacement = (!(primaryY.labelPlacement)) ? ej.datavisualization.Chart.LabelPlacement.OnTicks : primaryY.labelPlacement;
            }
            else {
                primaryY.orientation = "vertical";
                primaryX.orientation = "horizontal";
            }

            primaryY.name = ej.util.isNullOrUndefined(primaryY.name) ? "SecondaryAxis" : primaryY.name;
            primaryX.name = ej.util.isNullOrUndefined(primaryX.name) ? "PrimaryAxis" : primaryX.name;

            model._axes = [];
            model._axes[0] = primaryX;
            model._axes[1] = primaryY;

            axesLength = model.axes.length;
            indicatorSeries = model.indicators;

            for (var i = 0; i < axesLength; i++) {
                axis = model.axes[i];
                if (axis.name) {
                    //Sets orientation for axes collections
                    for (var j = 0; j < seriesLength; j++) {
                        var type = seriesCollection[j].type.toLowerCase();
                        if (seriesCollection[j].xAxisName == axis.name) {
                            axis.orientation = (type.indexOf("bar") != -1) ? seriesCollection[j].isTransposed ? "horizontal" : "vertical" : seriesCollection[j].isTransposed ? "vertical" : "horizontal";
                            break;
                        }
                        else if (seriesCollection[j].yAxisName == axis.name) {
                            axis.orientation = (type.indexOf("bar") != -1) ? seriesCollection[j].isTransposed ? "vertical" : "horizontal" : seriesCollection[j].isTransposed ? "horizontal" : "vertical";
                            break;
                        }
                    }
                    for (var k = 0; k < indicatorSeries.length; k++) {
                        if (indicatorSeries[k].xAxisName == axis.name) {
                            axis.orientation = "horizontal";
                            break;
                        }
                        else if (indicatorSeries[k].yAxisName == axis.name) {
                            axis.orientation = "vertical";
                            break;
                        }
                    }
                    if (!axis.orientation) continue;
                    if (axis.orientation.toLowerCase() == "horizontal")
                        model.axes[i] = $.extend(true, {}, model.secondaryX, axis);
                    else
                        model.axes[i] = $.extend(true, {}, model.secondaryY, axis);
                    model._axes.push(model.axes[i]);
                }
            }
            for (var k = 0; k < model._axes.length; k++) {
                var axis = this.model._axes[k],
                    axisScrollSetings = axis.scrollbarSettings,
                    scrollRange = axisScrollSetings.range,
                    orientation = axis.orientation.toLowerCase();
                axis.visibleLabels = [];
                axis.range = (axis.range.min == null && axis.range.max == null && axis.range.interval == null) ? null : axis.range;
                axis.setRange = (!(axis.range)) ? false : (ej.util.isNullOrUndefined(axis.setRange)) ? true : axis.setRange;
                axis.setRange = ((axis.actual_Range) || (axis.setRange != false)) ? true : false;
                axis.actualRange = (!(axis.actualRange)) ? (axis.range == null) ? {} : $.extend(true, {}, axis.range) : axis.actualRange;
                axis.visibleRange = (!(axis.visibleRange)) ? (axis.range == null) ? {} : axis.range : axis.visibleRange;
                axis.name = !(axis.name) ? k.toString() : axis.name;
                axis._isScroll = ((axisScrollSetings.visible && (axisScrollSetings.pointsLength != null || scrollRange.min != null || scrollRange.max != null)) || ((model.zooming.enableScrollbar && axisScrollSetings.visible) && (axis.zoomFactor < 1 || axis.zoomPosition > 0)))
                axis._pointsLength = axisScrollSetings.pointsLength;
                if (typeof scrollRange.min == "string" && scrollRange.min.indexOf("/Date(") != -1)
                    scrollRange.min = new Date(parseInt(scrollRange.min.substr(6)));
                if (typeof scrollRange.max == "string" && scrollRange.max.indexOf("/Date(") != -1)
                    scrollRange.max = new Date(parseInt(scrollRange.max.substr(6)));
            }
        },






        _drawTitle: function () {
            var title = this.model.title;
            var margin = this.model.margin;
            var svgWidth = $(this.svgObject).width();
            var measureTitle = ej.EjSvgRender.utils._measureText(title.text, svgWidth - margin.left - margin.right, title.font);
            var elementSpacing = this.model.elementSpacing;
            var modelTitleHeight = (title.text == "" || !title.visible) ? 0 : (measureTitle.height + elementSpacing);
            var margin = margin;
            var areaBounds = this.model.m_AreaBounds;
            var areaType = this.model.AreaType;
            var legendSpace = (this.model.legend.position.toLowerCase() == "left") ? this.model.LegendViewerBounds.Width / 2 : ((this.model.legend.position.toLowerCase() == "right" ? (-this.model.LegendViewerBounds.Width / 2) : 0));
            // Drawing the chart title
            var leftSpace = margin.left + elementSpacing + this.model.border.width;
            var rightSpace = margin.right + elementSpacing + this.model.border.width;
            var collection = this.model.titleWrapTextCollection;

            var titleLocation, textBorderConstant = 1.2,
                titleFontSize = parseInt(title.font.size),
                titleTextHeight = parseInt(title.font.size) * textBorderConstant,
                enableTrim = title.enableTrim, textAnchor,
                maxTitleWidth = title.maximumWidth,
                textAlignment = title.textAlignment.toLowerCase(),
                textOverflow = title.textOverflow.toLowerCase(),
                titleText = title.text,
                isRTL = title.isReversed;
                titleEnable = enableTrim && (textOverflow == "wrap" || textOverflow == "wrapandtrim") && (collection.length > 1) ? true : false;
            if (maxTitleWidth.toString() == 'auto' || maxTitleWidth.toString() == '') {
                maxTitleWidth = (areaBounds.Width * 0.75);
                this.model.titleMaxWidth = maxTitleWidth;
            }
            else
                maxTitleWidth = parseInt(maxTitleWidth);

            var titleWidthEnable = measureTitle.width > maxTitleWidth ? true : false;
            //title trim
            if (enableTrim && titleWidthEnable && textOverflow == "trim") {
                titleText = ej.EjSvgRender.utils._trimText(titleText, maxTitleWidth, title.font);
                this.model.titleTrim = measureTitle = ej.EjSvgRender.utils._measureText(titleText, svgWidth - margin.left - margin.right, title.font);
                this.model.trimTooltip = true;
            }

            if (this.model.trimTooltip && textOverflow == "wrap")
                this.model.trimTooltip = false;

            var textSize = { width: ((this.model.trimTooltip && titleEnable) || collection.length > 1) ? this.model.titleMaxWidth : measureTitle.width, height: (measureTitle.height * (collection.length > 0 ? collection.length - 1 : 1)) };
            if (title.text != "" && title.text != null) {
                if ((title.border.color == 'transparent') && (title.background == 'transparent')) {
                    titleLocation = margin.top + (modelTitleHeight / 2) + (elementSpacing);
                } else {
                    titleLocation = margin.top + (titleTextHeight / 2) + (elementSpacing) + (titleFontSize / 4);
                }
                var locX = ((areaType != "cartesianaxes") ? (svgWidth - margin.left - margin.right) / 2 + (margin.left + legendSpace) : (leftSpace + (svgWidth - rightSpace) / 2)) - textSize.width / 2;

                if (this.model.title.textAlignment.toLowerCase() == "near") {
                    locX = isRTL ? (svgWidth - rightSpace - measureTitle.width) : leftSpace;
                }
                else if (this.model.title.textAlignment.toLowerCase() == "far") {
                    locX = isRTL ? leftSpace : (svgWidth - rightSpace - textSize.width);
                }
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { title: titleText, location: { x: locX, y: titleLocation }, size: measureTitle };
                this._trigger("titleRendering", commonEventArgs);
                var options = {
                    'id': this.svgObject.id + '_ChartTitleText',
                    'x': commonEventArgs.data.location.x,
                    'y': commonEventArgs.data.location.y,
                    'fill': title.font.color,
                    'font-size': title.font.size,
                    'font-family': title.font.fontFamily,
                    'font-style': title.font.fontStyle,
                    'font-weight': title.font.fontWeight,
                    'opacity': title.font.opacity,
                    'text-anchor': 'start'
                };
                var borderOptions = {
                    'id': this.svgObject.id + '_ChartTitleBorder',
                    'x': commonEventArgs.data.location.x - elementSpacing,
                    'y': commonEventArgs.data.location.y - titleTextHeight + (titleTextHeight / 4),
                    'rx': title.border.cornerRadius,
                    'ry': title.border.cornerRadius,
                    'width': titleEnable && titleWidthEnable ? this.model.titleMaxWidth + (2 * elementSpacing) : measureTitle.width + (2 * elementSpacing),
                    'height': titleEnable && titleWidthEnable ? measureTitle.height * collection.length : titleTextHeight,
                    'fill': title.background,
                    'stroke-width': title.border.width,
                    'stroke': title.border.color,
                    'opacity': title.border.opacity,
                    'class': "e-titleborder"
                };
                this.svgRenderer.drawRect(borderOptions, this.gTitleEle);

                if (titleEnable && titleWidthEnable) {
                    for (var k = 0; k < collection.length; k++) {
                        options.id = this.svgObject.id + '_ChartTitleText_' + k;
                        if (k != 0) options.y = options.y + measureTitle.height;
                        this.svgRenderer.drawText(options, collection[k], this.gTitleEle);
                    }
                }
                else this.svgRenderer.drawText(options, commonEventArgs.data.title, this.gTitleEle);

                this.model._titleLocation = { X: commonEventArgs.data.location.x, Y: commonEventArgs.data.location.y, size: textSize, _height: measureTitle.height };

                this.svgRenderer.append(this.gTitleEle, this.svgObject);
                if (title.subTitle.text != "" && title.subTitle.text && title.subTitle.visible)
                    this._drawSubTitle();
            }
        },



        _getLegendSize: function (series) {

            var legend = this.model.legend,
                symbolSize = legend.itemStyle,
                textSize = ej.EjSvgRender.utils._measureText(series.Text, null, series.Font),
                padding = 10,
                width = symbolSize.width + padding + textSize.width,
                height = Math.max(symbolSize.height, textSize.height);

            return { Width: width, Height: height };

        },

        _getYValues: function (points) {
            var values = [],
                length = points.length;
            for (var i = 0; i < length; i++)
                values.push(points[i].y);
            return values;
        },
        _getXValues: function (points) {
            var values = [],
                length = points.length;
            for (var i = 0; i < length; i++)
                values.push(points[i].xValue);
            return values;
        },




        _drawSubTitle: function () {

            var title = this.model.title;
            var isTitleRTL = title.isReversed;
            var subTitle = title.subTitle;
            var svgWidth = $(this.svgObject).width();
            var measureTitle = ej.EjSvgRender.utils._measureText(title.text, svgWidth - this.model.margin.left - this.model.margin.right, title.font);
            var measuresubTitle = ej.EjSvgRender.utils._measureText(subTitle.text, svgWidth - this.model.margin.left - this.model.margin.right, subTitle.font);

            var textanchor = "middle";
            var subTitleLocation, textBorderConstant = 1.2, titleBorderSpacing = 10, subTitleBorderSpacing = 10, elementSpacing = this.model.elementSpacing,
                subTitleFontSize = parseInt(subTitle.font.size),
                areaBounds = this.model.m_AreaBounds.Width,
                titleTextHeight = parseInt(title.font.size) * textBorderConstant,
                subTitleTextHeight = parseInt(subTitle.font.size) * textBorderConstant,
                modelsubTitleHeight = (subTitle.text == "" || !subTitle.visible) ? 0 : (measuresubTitle.height + elementSpacing),
                enableTrim = subTitle.enableTrim,
                maxSubTitleWidth = subTitle.maximumWidth,
                maxTitleWidth = title.maximumWidth,
                textOverflow = subTitle.textOverflow.toLowerCase(),
                titleTextAlignment = title.textAlignment.toLowerCase(),
                subTitleTextAlignment = subTitle.textAlignment.toLowerCase(),
                titleText = title.text,
                titleEnableTrim = title.enableTrim,
                titleTextOverflow = title.textOverflow.toLowerCase(),
                subTitleText = subTitle.text, locX,
                regionX,
                titleVisibility = titleEnableTrim && (titleTextOverflow == "wrap" || titleTextOverflow == "wrapandtrim") ? true : false,
                titleWidthVisibility,
                subTitleVisibility = enableTrim && (textOverflow == 'wrap' || textOverflow == 'wrapandtrim') ? true : false;

            maxTitleWidth = (maxTitleWidth.toString() == 'auto' || maxTitleWidth.toString() == '') ? (areaBounds * 0.75) : parseInt(maxTitleWidth);
            maxSubTitleWidth = (maxSubTitleWidth.toString() == 'auto' || maxSubTitleWidth.toString() == '') ? (areaBounds * 0.75) : parseInt(maxSubTitleWidth);
            var measureTitle = ej.EjSvgRender.utils._measureText(title.text, svgWidth - this.model.margin.left - this.model.margin.right, title.font);
            var titleWidthEnable = measureTitle.width > maxTitleWidth ? true : false;

            //subtitle trim
            if (enableTrim && measuresubTitle.width > maxSubTitleWidth && textOverflow == "trim") {
                titleText = titleEnableTrim && titleTextOverflow == 'trim' ? ej.EjSvgRender.utils._trimText(titleText, maxTitleWidth, title.font) : titleText;
                subTitleText = ej.EjSvgRender.utils._trimText(subTitleText, maxSubTitleWidth, subTitle.font);
                measureTitle = ej.EjSvgRender.utils._measureText(titleText, $(this.svgObject).width() - this.model.margin.left - this.model.margin.right, title.font);
                measuresubTitle = ej.EjSvgRender.utils._measureText(subTitleText, $(this.svgObject).width() - this.model.margin.left - this.model.margin.right, subTitle.font);
                this.model.subTitleTooltip = true;
            }
            titleWidthVisibility = measureTitle.width > maxTitleWidth;
            // Drawing the chart subtitle

            if (subTitleText != "" && subTitleText != null) {
                if (((this.model.title.border.color == 'transparent') && (this.model.title.background == 'transparent')) || ((this.model.title.subTitle.border.color == 'transparent') && (this.model.title.subTitle.background == 'transparent'))) {
                    subTitleLocation = (modelsubTitleHeight) / 2 + elementSpacing + this.model._titleLocation.Y + this.model._titleLocation._height * (this.model.titleWrapTextCollection ? (this.model.titleWrapTextCollection.length - 1) : 0);
                } else {
                    subTitleLocation = (subTitleTextHeight / 2) + subTitleBorderSpacing + elementSpacing + ((titleVisibility && titleWidthVisibility) ? (measureTitle.height * this.model.titleWrapTextCollection.length) : titleTextHeight) + titleBorderSpacing + (subTitleFontSize / 3);
                }
                var locX = this.model._titleLocation.X + (this.model._titleLocation.size.width / 2);

                if (subTitleTextAlignment == "near") {
                    locX = regionX = isTitleRTL ? this.model._titleLocation.X + this.model._titleLocation.size.width : this.model._titleLocation.X;
                    textanchor = isTitleRTL ? "end" : "start";
                }
                else if (subTitleTextAlignment == "far") {
                    locX = isTitleRTL ? this.model._titleLocation.X : this.model._titleLocation.X + this.model._titleLocation.size.width;
                    textanchor = isTitleRTL ? "start" : "end";

                }
                var commonEventArgs = $.extend({}, ej.EjSvgRender.commonChartEventArgs);
                commonEventArgs.data = { subTitle: subTitleText, location: { x: locX, y: subTitleLocation }, size: measuresubTitle };
                this._trigger("subTitleRendering", commonEventArgs);
                var subTitleYposition = (((title.border.color == 'transparent') && (title.background == 'transparent')) || ((title.subTitle.border.color == 'transparent') && (title.subTitle.background == 'transparent'))) ? commonEventArgs.data.location.y : commonEventArgs.data.location.y - (elementSpacing / 2);

                var options = {
                    'id': this.svgObject.id + '_ChartSubTitleText',

                    'x': commonEventArgs.data.location.x,
                    'y': subTitleYposition,
                    'fill': subTitle.font.color,
                    'font-size': subTitle.font.size,
                    'font-family': subTitle.font.fontFamily,
                    'font-style': subTitle.font.fontStyle,
                    'font-weight': subTitle.font.fontWeight,
                    'opacity': subTitle.font.opacity,
                    'text-anchor': textanchor
                };

                var x, y, subTitleXLocation = commonEventArgs.data.location.x;
                if (textanchor == "start") x = subTitleXLocation - elementSpacing;
                else if (textanchor == "end")
                    x = subTitleVisibility ? subTitleXLocation - elementSpacing - this.model.subTitleMaxWidth : subTitleXLocation - elementSpacing - (measuresubTitle.width);
                else
                    x = subTitleVisibility ? subTitleXLocation - elementSpacing - (this.model.subTitleMaxWidth / 2) : subTitleXLocation - elementSpacing - (measuresubTitle.width / 2);
                y = (((title.border.color == 'transparent') && (title.background == 'transparent')) || ((subTitle.border.color == 'transparent') && (subTitle.background == 'transparent'))) ? commonEventArgs.data.location.y - subTitleTextHeight + (subTitleTextHeight / 4) : commonEventArgs.data.location.y - subTitleTextHeight + (subTitleTextHeight / 4) - (elementSpacing / 2);
                var borderOptions = {
                    'id': this.svgObject.id + '_ChartSubTitleBorder',
                    'x': x,
                    'y': y,
                    'rx': subTitle.border.cornerRadius,
                    'ry': subTitle.border.cornerRadius,
                    'width': subTitleVisibility ? this.model.subTitleMaxWidth + (2 * elementSpacing) : measuresubTitle.width + (2 * elementSpacing),
                    'height': subTitleVisibility ? measuresubTitle.height * this.model.subTitleWrapTextCollection.length : subTitleTextHeight,
                    'fill': subTitle.background,
                    'stroke-width': subTitle.border.width,
                    'stroke': subTitle.border.color,
                    'opacity': subTitle.border.opacity,
                    'class': "e-subtitleborder"
                };

                this.svgRenderer.drawRect(borderOptions, this.gSubTitleEle);

                if (subTitleVisibility && measuresubTitle.width > maxSubTitleWidth) {
                    for (var k = 0; k < this.model.subTitleWrapTextCollection.length; k++) {
                        options.id = this.svgObject.id + '_ChartSubTitleText_' + k;
                        if (k != 0) options.y = options.y + measuresubTitle.height;
                        this.svgRenderer.drawText(options, this.model.subTitleWrapTextCollection[k], this.gSubTitleEle);
                    }

                }
                else this.svgRenderer.drawText(options, commonEventArgs.data.subTitle, this.gSubTitleEle);

                var subSize = { width: (this.model.subTitleTooltip) ? maxSubTitleWidth : measuresubTitle.width, height: (measuresubTitle.height * (this.model.subTitleWrapTextCollection.length)) };
                if (textanchor == "middle")
                    regionX = locX - subSize.width / 2;
                else if (textanchor == "end")
                    regionX = locX - subSize.width;
                this.model._subTitleLocation = { X: regionX, Y: (commonEventArgs.data.location.y - measuresubTitle.height / 2), size: subSize };

                this.svgRenderer.append(this.gSubTitleEle, this.gTitleEle);
            }
        },


        _calculateStackingValues: function (seriesCollection, axis, params) {

            var chartModel = this.model;
            chartModel.stackedValue[axis.name] = [];
            var stackedValue = chartModel.stackedValue[axis.name];
            stackedValue.min = 0;
            stackedValue.max = 0;
            var stackAxes = (!chartModel.requireInvertedAxes) ? chartModel.hAxes : chartModel.vAxes,
                stackAxesLength = stackAxes.length, visiblePointsLength, yValues, stackingGroup,
                seriesLength = seriesCollection.length, visiblePoints,
                lastPosValue, lastNegValue, values, lastValue, currentValue,
                isNul = ej.util.isNullOrUndefined;

            for (var k = 0; k < stackAxesLength; k++) {
                j = 0;
                var lastPosValue = [], lastNegValue = [], firstPositive = [], firstNegative = [],
                    crossing = 0, series, visiblePointIndex;
                for (var i = 0; i < seriesCollection.length; i++) {
                    if (seriesCollection[i]._xAxisName == stackAxes[k].name) {
                        if (seriesCollection[i].type.toLowerCase().indexOf("stacking") != -1 || seriesCollection[i].isStacking) {
                            values = {};
                            values.StartValues = [];
                            values.EndValues = [];
                            stackingGroup = seriesCollection[i].stackingGroup;
                            if (stackingGroup && seriesCollection[i].type.toLowerCase() != "stackingarea") {
                                if (isNul(lastPosValue[stackingGroup])) {
                                    lastPosValue[stackingGroup] = [];
                                    lastNegValue[stackingGroup] = [];
                                    firstPositive[stackingGroup] = [];
                                    firstNegative[stackingGroup] = [];
                                }
                            }

                            else {
                                stackingGroup = "";
                                if (isNul(lastPosValue[stackingGroup])) {
                                    lastPosValue[stackingGroup] = [];
                                    lastNegValue[stackingGroup] = [];
                                    firstPositive[stackingGroup] = [];
                                    firstNegative[stackingGroup] = [];
                                }
                            }
                            series = seriesCollection[i];
                            crossing = this._getXCrossValue(series, stackAxes[k], params);
                            if (typeof (crossing) !== 'number')
                                crossing = 0;
                            visiblePoints = ej.EjSeriesRender.prototype._isVisiblePoints(series);
                            yValues = this._getYValues(series._visiblePoints);
                            visiblePointsLength = visiblePoints.length;
                            for (var j = 0; j < visiblePointsLength; j++) {
                                var lastValue = 0, correction = 0, currentValue = yValues[j];
                                if (isNul(lastPosValue[stackingGroup][series._visiblePoints[j].xValue])) {
                                    lastPosValue[stackingGroup][series._visiblePoints[j].xValue] = crossing;
                                }
                                if (isNul(lastNegValue[stackingGroup][series._visiblePoints[j].xValue])) {
                                    lastNegValue[stackingGroup][series._visiblePoints[j].xValue] = crossing;
                                }
                                if (values.StartValues.length <= j) {
                                    values.StartValues.push(0);
                                    values.EndValues.push(0);
                                }
                                if (currentValue >= 0) {
                                    firstPositive[stackingGroup][j] = firstPositive[stackingGroup][j] == null;
                                    currentValue -= firstPositive[stackingGroup][j] && crossing;
                                    if (series.type.toLowerCase().indexOf("stacking") != -1 || currentValue > 0)
                                        lastValue = lastPosValue[stackingGroup][series._visiblePoints[j].xValue];
                                    else
                                        lastValue = 0;
                                    lastPosValue[stackingGroup][series._visiblePoints[j].xValue] += currentValue;
                                    correction = lastValue < crossing ? crossing - lastValue : 0;
                                    values.StartValues[j] = lastValue + correction;
                                    values.EndValues[j] = currentValue + lastValue;
                                }
                                else {
                                    firstNegative[stackingGroup][j] = firstNegative[stackingGroup][j] == null;
                                    currentValue -= firstNegative[stackingGroup][j] && crossing;
                                    lastValue = lastNegValue[stackingGroup][series._visiblePoints[j].xValue];
                                    lastNegValue[stackingGroup][series._visiblePoints[j].xValue] += currentValue;
                                    values.StartValues[j] = lastValue;
                                    values.EndValues[j] = currentValue + lastValue;
                                    if (crossing < values.EndValues[j]) {
                                        lastNegValue[stackingGroup][series._visiblePoints[j].xValue] = values.StartValues[j];
                                        lastPosValue[stackingGroup][series._visiblePoints[j].xValue] = values.EndValues[j];
                                        firstPositive[stackingGroup][j] = firstPositive[stackingGroup][j] == null;
                                    }
                                }

                                visiblePointIndex = visiblePoints[j].actualIndex;
                                series.points[visiblePointIndex].YValues = [values.EndValues[j]];
                            }
                            values.stackedSeries = true;
                            stackedValue.push(values);
                            if (stackedValue.min > Math.min.apply(0, values.StartValues))
                                stackedValue.min = Math.min.apply(0, values.StartValues);
                            if (stackedValue.max < Math.max.apply(0, values.EndValues))
                                stackedValue.max = Math.max.apply(0, values.EndValues);
                            series.stackedValue = values;
                        }
                    }
                }
            }
        },
        _calculateStackingCumulativeValues: function (seriesCollection, axis, params) {
            this.model.stackedValue[axis.name] = [];
            this.model.stackedValue[axis.name].min = 0;
            this.model.stackedValue[axis.name].max = 0;
            var stackAxes = (!this.model.requireInvertedAxes) ? this.model.hAxes : this.model.vAxes;
            var seriesLength = seriesCollection.length;
            var axesLength = stackAxes.length;
            var percent;
            for (var k = 0; k < axesLength; k++) {
                var posValues = [], negValues = [], frequencies = [], stackingName = " ", firstPositive = [], firstNegative = [], crossing = 0, seriesGroupCount = [];

                //calculate the cumulative frequencies from the collection of series  
                for (var i = 0; i < seriesLength; i++) {
                    var visiblePoints = ej.EjSeriesRender.prototype._isVisiblePoints(seriesCollection[i]);
                    stackingName = seriesCollection[i].stackingGroup;
                    if (seriesCollection[i].type.toLowerCase().indexOf("100") != -1) {
                        if (seriesCollection[i]._xAxisName == stackAxes[k].name) {
                            if (seriesCollection[i].stackingGroup && seriesCollection[i].type.toLowerCase() != " stackingarea100 ") {
                                if (!posValues[stackingName]) {
                                    frequencies[stackingName] = [];
                                    posValues[stackingName] = [];
                                    negValues[stackingName] = [];
                                    firstPositive[stackingName] = [];
                                    firstNegative[stackingName] = [];
                                }
                            }
                            else {
                                seriesCollection[i].stackingGroup = "";
                                stackingName = seriesCollection[i].stackingGroup;
                                if (!posValues[stackingName]) {
                                    frequencies[stackingName] = [];
                                    posValues[stackingName] = [];
                                    negValues[stackingName] = [];
                                    firstPositive[stackingName] = [];
                                    firstNegative[stackingName] = [];
                                }
                            }
                            seriesGroupCount[stackingName] = i;
                            var yValues = this._getYValues(seriesCollection[i]._visiblePoints);
                            var yValuesLength = yValues.length;
                            for (var j = 0; j < yValuesLength; j++) {
                                var getYValue = yValues[j];
                                if (!frequencies[stackingName][seriesCollection[i].points[j].xValue]) {
                                    frequencies[stackingName][seriesCollection[i].points[j].xValue] = 0;
                                }
                                frequencies[stackingName][seriesCollection[i].points[j].xValue] += Math.abs(getYValue);
                            }
                        }
                    }

                }

                //calculate the cumulative percentage for each series points
                for (var i = 0; i < seriesLength; i++) {
                    stackingName = seriesCollection[i].stackingGroup;
                    if (seriesCollection[i].type.toLowerCase().indexOf("100") != -1) {
                        var stackedSeries = false;
                        if (seriesCollection[i]._xAxisName == stackAxes[k].name) {
                            var values = {};
                            values.StartValues = [];
                            values.EndValues = [];
                            var series = seriesCollection[i];
                            crossing = this._getXCrossValue(series, stackAxes[k], params);
                            if (typeof (crossing) !== 'number')
                                crossing = 0;
                            var yValues = this._getYValues(series._visiblePoints);
                            var yValuesLength = yValues.length;
                            for (var j = 0; j < yValuesLength; j++) {
                                var lastValue, correction = 0;
                                var currentValue = yValues[j];

                                //Pecentage calculation for point 
                                percent = (currentValue / frequencies[stackingName][series.points[j].xValue]) * 100
                                currentValue = !isNaN(percent) ? percent : 0;
                                series.points[j].percentage = currentValue.toFixed(2);
                                if (!posValues[stackingName][series.points[j].xValue]) {
                                    posValues[stackingName][series.points[j].xValue] = crossing;
                                }
                                if (!negValues[stackingName][series.points[j].xValue]) {
                                    negValues[stackingName][series.points[j].xValue] = crossing;
                                }
                                if (values.StartValues.length <= j) {
                                    values.StartValues.push(0);
                                    values.EndValues.push(0);
                                }
                                if (currentValue >= 0) {
                                    var posValue = posValues[stackingName][series.points[j].xValue];
                                    firstPositive[stackingName][j] = firstPositive[stackingName][j] == null;
                                    currentValue -= firstPositive[stackingName][j] && crossing;
                                    correction = posValue < crossing ? crossing - posValue : 0;
                                    lastValue = posValue;
                                    posValues[stackingName][series.points[j].xValue] += currentValue;
                                }
                                else {
                                    var negValue = negValues[stackingName][series.points[j].xValue];
                                    firstNegative[stackingName][j] = firstNegative[stackingName][j] == null;
                                    currentValue -= firstNegative[stackingName][j] && crossing;
                                    correction = negValue > crossing ? crossing - negValue : 0;
                                    lastValue = negValue;
                                    negValues[stackingName][series.points[j].xValue] += currentValue;
                                }
                                values.StartValues[j] = lastValue + correction;
                                values.EndValues[j] = lastValue + currentValue;
                                if (values.EndValues[j] > 100) values.EndValues[j] = 100;
                                series.points[j].YValues = [values.EndValues[j]];
                                stackedSeries = seriesGroupCount[stackingName] == i ? false || (stackedSeries) : true;
                            }
                            values.stackedSeries = stackedSeries;
                            this.model.stackedValue[axis.name].push(values);
                            if (this.model.stackedValue[axis.name].min > Math.min.apply(0, values.StartValues))
                                this.model.stackedValue[axis.name].min = Math.min.apply(0, values.StartValues);
                            if (this.model.stackedValue[axis.name].max < Math.max.apply(0, values.EndValues))
                                this.model.stackedValue[axis.name].max = Math.max.apply(0, values.EndValues);
                            if (this.model.stackedValue[axis.name].min > Math.min.apply(0, values.EndValues))
                                this.model.stackedValue[axis.name].min = -100;

                            series.stackedValue = values;
                        }
                    }
                }
            }
        },
        _legendItemBounds: function (itemCount, legendItemWidth, legendItemHeight) {
            var legend = this.model.legend, legVal,
                position = legend.position.toLowerCase(),
                itemPadding = legend.itemPadding,
                legnedHeightIncr, column, legendWidth = 0, legendHeight = 0;
            if (ej.util.isNullOrUndefined(legend.columnCount) && legend.rowCount) {
                legnedHeightIncr = legend.rowCount;
                column = Math.ceil(itemCount / legnedHeightIncr);
                legendWidth = legendItemWidth * column;
                legendHeight = legendItemHeight * legnedHeightIncr;
            }
            else if (ej.util.isNullOrUndefined(legend.rowCount) && legend.columnCount) {
                legnedHeightIncr = Math.ceil(itemCount / legend.columnCount);
                legVal = legend.columnCount;
                legendWidth = legendItemWidth * legVal;
                legendHeight = legendItemHeight * legnedHeightIncr;
            }
            else if ((legend.rowCount) && (legend.columnCount)) {
                if (legend.columnCount < legend.rowCount) {
                    legnedHeightIncr = legend.rowCount;
                    column = Math.ceil(itemCount / legnedHeightIncr);
                    legendWidth = legendItemWidth * column;
                    legendHeight = legendItemHeight * legnedHeightIncr;
                }
                else if (legend.columnCount > legend.rowCount) {
                    if (position === 'top' || position === 'bottom' || position === 'custom') {
                        legnedHeightIncr = Math.ceil(itemCount / legend.columnCount);
                        legVal = legend.columnCount;
                        legendWidth = legendItemWidth * legVal;
                        legendHeight = legendItemHeight * legnedHeightIncr;
                    } else {
                        legnedHeightIncr = Math.ceil(itemCount / legend.columnCount);
                        column = Math.ceil(itemCount / legnedHeightIncr);
                        legendWidth = legendItemWidth * column;
                        legendHeight = legendItemHeight * legnedHeightIncr;
                    }
                }
                else {
                    if (position === 'top' || position === 'bottom' || position === 'custom') {
                        legnedHeightIncr = Math.ceil(itemCount / legend.columnCount);
                        legVal = Math.ceil(itemCount / legend.rowCount);
                        legendWidth = legendItemWidth * legend.columnCount;
                        legendHeight = legendItemHeight * legVal;
                    } else {
                        legnedHeightIncr = legend.rowCount;
                        column = Math.ceil(itemCount / legnedHeightIncr);
                        legendWidth = legendItemWidth * column;
                        legendHeight = legendItemHeight * legnedHeightIncr;
                    }

                }

            }
            legendHeight += this.model.elementSpacing;
            return { LegendWidth: legendWidth, LegendHeight: legendHeight };
        },

        _isEjScroller: function () {
            var chart = this,
                chartModel = chart.model,
                legendContainer = $(chart.legendContainer),
                legend = chartModel.legend;
            if (ej.util.isNullOrUndefined($('#' + legendContainer[0].id).ejScroller))
                legend._ejScroller = false;
            else
                legend._ejScroller = legend.enableScrollbar;
        },

        //legend text wrapping
        _rowsCalculation: function (data, textmaxwidth, textOverflow) {
            var chart = this,
                chartModel = chart.model,
                legend = chartModel.legend,
                word, textCollection = [], currentWidth, nextWidth,
                text = data.legendItem ? data.legendItem.Text.toString() : data.text,
                legendTextCollection = text.split(' '),
                textMaxWidth = textmaxwidth,
                font = data.legendItem ? data.legendItem.LegendStyle.Font : data.font,
                legendTextLength = legendTextCollection.length,
                wordMax = 0;

            for (var i = 0; i < legendTextLength; i++) {
                word = legendTextCollection[i];
                currentWidth = ej.EjSvgRender.utils._measureText(word, null, font).width;
                if (currentWidth <= textMaxWidth) {
                    while (i < legendTextLength) {
                        currentWidth = ej.EjSvgRender.utils._measureText(word, null, font).width;
                        nextWidth = (legendTextCollection[i + 1]) ? ej.EjSvgRender.utils._measureText(legendTextCollection[i + 1], null, font).width : 0;
                        if ((currentWidth + nextWidth) <= textMaxWidth && nextWidth > 0) {
                            word = word.concat(' ' + legendTextCollection[i + 1]);
                            i++;
                        }
                        else {
                            wordMax = Math.max(wordMax, currentWidth);
                            break;
                        }
                    }
                    textCollection.push(word);
                }
                else {
                    if (textOverflow == "wrapandtrim") {
                        word = ej.EjSvgRender.utils._trimText(word, textMaxWidth, font);
                        textCollection.push(word);
                        this.model._legendMaxWidth = textMaxWidth;
                        wordMax = Math.max(wordMax, textMaxWidth);
                        if (!data.legendItem) this.model.trimTooltip = true;
                    }
                    else {
                        textCollection.push(word);
                        if (data.legendItem)
                            this.model._legendMaxWidth = Math.max(this.model._legendMaxWidth, currentWidth);
                        else wordMax = Math.max(wordMax, currentWidth);
                    }
                }
            }
            this.model._legendMaxHeight = Math.max(this.model._legendMaxHeight, textCollection.length);
            return { textCollection: textCollection, wordMax: wordMax };
        },

        _triggerLegendEvent: function (name, color, index) {
            var chart = this,
                chartModel = chart.model,
                legend = chartModel.legend,
                areaType = chartModel.AreaType,
                itemStyle = legend.itemStyle,
                border = itemStyle.border,
                elementSpacing = chartModel.elementSpacing,
                textMaxWidth = legend.textWidth,
                svgRender = ej.EjSvgRender,
                chartSvgRender = chart.svgRenderer,
                seriesLength = chartModel._visibleSeries.length,
                svgObject = chart.svgObject,
                isCanvas = chartModel.enableCanvasRendering,
                elementSpacing = chartModel.elementSpacing,
                textOverflow = legend.textOverflow.toLowerCase(),
                legendItem, legendFont, textWidth, commonEventArgs,
                style = {
                    BorderColor: border.color,
                    BorderWidth: border.width,
                    Opacity: legend.opacity,
                    Color: color,
                    Font: legend.font
                };

            commonEventArgs = $.extend({}, svgRender.commonChartEventArgs);
            commonEventArgs.data = {
                svgRenderer: chartSvgRender,
                svgObject: svgObject,
                symbolShape: legend.shape,
                legendItem: {
                    Text: name,
                    Shape: legend.shape,
                    LegendStyle: style,
                    SeriesIndex: (areaType == "none" && seriesLength == 1) ? 0 : index,
                },
                style: {
                    ShapeSize: itemStyle,
                    ElementSpace: elementSpacing,
                    Style: style,
                    ID: chart.svgObject.id + '_LegendItemShape' + index,
                    SeriesIndex: (areaType == "none" && seriesLength == 1) ? 0 : index,
                },
                gLegendItemEle: chart.gLegendItemEle
            };
            if (isCanvas)
                commonEventArgs.data.style.context = true;
            chart._trigger("legendItemRendering", commonEventArgs);
            legendItem = commonEventArgs.data.legendItem.Text;
            legendFont = commonEventArgs.data.legendItem.LegendStyle.Font;
            textWidth = ej.EjSvgRender.utils._measureText(legendItem, null, legendFont).width;
            if (textOverflow == "trim") {
                if (textWidth > textMaxWidth) {
                    legendItem = ej.EjSvgRender.utils._trimText(legendItem, textMaxWidth, legendFont);
                    chart.model._legendMaxWidth = textMaxWidth;
                }
            }
            else if (textOverflow == "wrap" || textOverflow == "wrapandtrim") {
                legendItem = chart._rowsCalculation(commonEventArgs.data, textMaxWidth, this.model.legend.textOverflow.toLowerCase()).textCollection;
            }
            return { commonEventArgs: commonEventArgs, legendItem: legendItem };
        },

        _calculateLegendBounds: function () {
            // intialize
            this.model.legendCollection = [];
            this.model.legendTextRegion = [];
            this.model.legendRegion = [];
            this.model.svgHeight = $(this.svgObject).height();
            this.model.svgWidth = $(this.svgObject).width();
            this.model._legendMaxWidth = 0;
            this.model._legendMaxHeight = 0;

            var chart = this,
                chartModel = chart.model,
                math = Math,
                max = math.max,
                min = math.min,
                abs = math.abs,
                legend = chartModel.legend,
                padding = 10,
                legendSizeHeight = legend.size.height,
                legendSizeWidth = legend.size.width,
                isRTL = legend.isReversed,
                itemPadding = legend.itemPadding > 0 ? legend.itemPadding : 0,
                position = legend.position.toLowerCase(),
                width = 0, height = 0,
                svgHeight = chartModel.svgHeight,
                svgWidth = chartModel.svgWidth,
                legendItemWidth = 0,
                legendItemHeight = 0,
                legendWidth = 0,
                legendHeight = 0,
                legnedHeightIncr = 1,
                currentLegend,
                index,
                bounds, legendBounds,
                legendviewerHeight = 0, legendviewerWidth = 0,
                legendHeightTemp, legendWidthTemp,
                tempSeries = {},
                legendSeries = [], trendLineLength, trendLines,
                trendLine, j,
                trendlineType,
                areaType = chartModel.AreaType,
                visibleSeries = chartModel._visibleSeries,
                rowCount = legend.rowCount, point,
                columnCount = legend.columnCount,
                elementSpacing = chartModel.elementSpacing,
                visiblePoints, series,
                length, legendColor, legendName, legendStyleColor, legendSeriesLength, legendContainer, legendSvgContainer,
                titleSize = ej.EjSvgRender.utils._measureText(legend.title.text, null, legend.title.font),
                legendsize, colorGradName, visibleOnLegend,
                vScrollSize = 0, hScrollSize = 0,
                borderSize = chartModel.border.width,
                legendBorder = legend.border.width, type,
                legendInfo, legendStyle, legendFont, shapeWidth,
                textOverflow = legend.textOverflow.toLowerCase(),
                svgObjectHeight = svgHeight - ((elementSpacing * 4) + (borderSize * 2) + (legend.border.width * 2)),
                svgObjectWidth = svgWidth - ((elementSpacing * 4) + (borderSize * 2) + (legendBorder * 2));

            if (visibleSeries && legend.visible && visibleSeries.length != 0) {
                type = visibleSeries[0].type.toLowerCase();
                if (areaType == "none" && visibleSeries.length == 1 || type == 'pieofpie' || type == 'pyramid' || type == 'funnel') {

                    series = visibleSeries[0];
                    visiblePoints = ej.EjSeriesRender.prototype._calculateVisiblePoints(series).legendPoints;
                    length = visiblePoints.length;
                    for (isRTL && (position == "top" || position == "bottom") ? j = length - 1 : j = 0; isRTL && (position == "top" || position == "bottom") ? j >= 0 : j < length; isRTL && (position == "top" || position == "bottom") ? j-- : j++) {
                        legendColor = legend.fill ? (!(legend.fill._gradientStop) ? legend.fill : legend.fill._gradientStop) : chartModel.pointColors[visiblePoints[j].actualIndex];
                        point = visiblePoints[j];
                        legendName = !ej.util.isNullOrUndefined(point.x) ? point.x : 'series' + j;
                        visibleOnLegend = !(point.visibleOnLegend) ? 'visible' : point.visibleOnLegend;
                        if (!point.isEmpty && visibleOnLegend.toLowerCase() == 'visible' && series.visibleOnLegend.toLowerCase() == "visible") {
                            legendInfo = this._triggerLegendEvent(legendName, legendColor, j);
                            legendStyle = legendInfo.commonEventArgs.data.legendItem.LegendStyle;
                            tempSeries = {
                                Text: legendInfo.legendItem,
                                displayText: legendInfo.commonEventArgs.data.legendItem.Text,
                                Font: legendStyle.Font,
                                SeriesIndex: 0,
                                PointIndex: j,
                                ActualIndex: point.actualIndex,
                                fill: legendStyle.Color,
                                visibility: (point.visible !== false) ? 'visible' : 'hidden',
                                Shape: legendInfo.commonEventArgs.data.legendItem.Shape,
                                LegendStyle: legendStyle,
                                CommonEventArgs: { cancel: legendInfo.commonEventArgs.cancel, data: legendInfo.commonEventArgs.data }
                            };
                            legendSeries.push(tempSeries);
                        }
                    }
                }
                else {
                    length = visibleSeries.length;
                    for (isRTL && (position == "top" || position == "bottom") ? j = length - 1 : j = 0; isRTL && (position == "top" || position == "bottom") ? j >= 0 : j < length; isRTL && (position == "top" || position == "bottom") ? j-- : j++) {
                        legendColor = legend.fill ? (!(legend.fill._gradientStop) ? legend.fill : legend.fill._gradientStop) : ej.util.isNullOrUndefined(chartModel.seriesColors[j]) ? chartModel.pointColors[j] : chartModel.seriesColors[j];
                        series = visibleSeries[j];
                        legendName = series.name ? series.name : 'series' + j;
                        if (series.visibleOnLegend.toLowerCase() == "visible") {
                            legendInfo = this._triggerLegendEvent(legendName, legendColor, j);
                            legendStyle = legendInfo.commonEventArgs.data.legendItem.LegendStyle;
                            tempSeries = {
                                Text: legendInfo.legendItem,
                                displayText: legendInfo.commonEventArgs.data.legendItem.Text,
                                Font: legendStyle.Font,
                                SeriesIndex: j,
                                fill: legendStyle.Color,
                                visibility: series.visibility,
                                Shape: legendInfo.commonEventArgs.data.legendItem.Shape,
                                LegendStyle: legendStyle,
                                CommonEventArgs: { cancel: legendInfo.commonEventArgs.cancel, data: legendInfo.commonEventArgs.data }
                            };
                            legendSeries.push(tempSeries);
                        }
                        trendLines = series.trendlines;
                        trendLineLength = trendLines.length;
                        for (var i = 0; i < trendLineLength; i++) {
                            trendLine = trendLines[i];
                            legendColor = legend.fill ? (!(legend.fill._gradientStop) ? legend.fill : legend.fill._gradientStop) : trendLine.fill;
                            legendName = trendLine.name ? trendLine.name : 'series' + j;
                            if (trendLine.visibility != '' && trendLine.visibleOnLegend.toLowerCase() == "visible") {
                                legendInfo = this._triggerLegendEvent(legendName, legendColor, j);
                                legendStyle = legendInfo.commonEventArgs.data.legendItem.LegendStyle;
                                tempSeries = {
                                    Text: legendInfo.legendItem,
                                    displayText: legendInfo.commonEventArgs.data.legendItem.Text,
                                    Font: legendStyle.Font,
                                    SeriesIndex: j,
                                    trendLineIndex: i,
                                    fill: legendStyle.Color,
                                    isTrendLine: true,
                                    visibility: series.visibility.toLowerCase() == "visible" ? trendLine.visibility : "hidden",
                                    Shape: legendInfo.commonEventArgs.data.legendItem.Shape,
                                    LegendStyle: legendStyle,
                                    CommonEventArgs: { cancel: legendInfo.commonEventArgs.cancel, data: legendInfo.commonEventArgs.data }
                                };
                                legendSeries.push(tempSeries);
                            }
                        }
                    }
                }

                legendSeriesLength = legendSeries.length;
                for (var j = 0; j < legendSeriesLength; j++) {
                    currentLegend = legendSeries[j];
                    shapeWidth = currentLegend.CommonEventArgs.data.style.ShapeSize.width;
                    legendsize = chart._getLegendSize(currentLegend);
                    legendItemWidth = max(this.model._legendMaxWidth > 0 ? (this.model._legendMaxWidth + itemPadding + shapeWidth) : legendsize.Width, legendItemWidth);
                    legendItemHeight = max((textOverflow == "wrap" || textOverflow == "wrapandtrim") ? legendsize.Height * this.model._legendMaxHeight : legendsize.Height, legendItemHeight);
                }
                legendHeight = legendItemHeight + elementSpacing * 2;
                legendWidth = legendItemWidth;

                if (columnCount || rowCount) {
                    legendBounds = chart._legendItemBounds(legendSeries.length, legendItemWidth + (itemPadding), legendItemHeight + (itemPadding));
                    legendWidth = legendBounds.LegendWidth;
                    legendHeight = legendBounds.LegendHeight;
                    if (position === 'top' || position === 'bottom' || position === 'custom')
                        legendHeight = legendHeight - itemPadding + elementSpacing;
                    else
                        legendWidth = legendWidth - itemPadding;
                }
                for (var k = 0; k < legendSeriesLength; k++) {
                    currentLegend = legendSeries[k];
                    index = currentLegend.SeriesIndex;
                    series = chartModel.series[index];
                    legendsize = chart._getLegendSize(currentLegend);
                    if (textOverflow == "wrap" || textOverflow == "wrapandtrim") {
                        legendsize.Width = legendItemWidth;
                        legendsize.Height = legendItemHeight;
                    }
                    if (!(rowCount) && !(columnCount)) {

                        if ((position == 'top' || position == 'bottom' || position == 'custom')) {
                            width += legendsize.Width + itemPadding;
                            if (width > svgObjectWidth && k != 0) {
                                width -= legendsize.Width + itemPadding;
                                legendWidth = max(legendWidth, width);
                                width = legendsize.Width + itemPadding;
                                legnedHeightIncr++;
                                legendHeight += legendItemHeight + itemPadding;
                            }
                            else
                                legendWidth = max(legendWidth, width);

                            height = max(height, legendItemHeight);
                        }
                        else {
                            height += legendsize.Height + itemPadding;
                            if (height > svgObjectHeight) {
                                height -= legendsize.Height + itemPadding;
                                legendHeight = max(legendHeight, height);
                                height = legendsize.Height + itemPadding;
                                legendWidth += legendItemWidth + itemPadding;
                            }
                            else
                                legendHeight = max(legendHeight, height);

                            width = max(width, legendItemWidth);
                        }
                    }
                    if (currentLegend.visibility.toLowerCase() == "visible")
                        colorGradName = chart.svgRenderer.createGradientElement('legend' + k, legendSeries[k].fill, 0, 0, 0, svgObjectHeight, chart.gLegendEle);
                    else
                        colorGradName = 'gray';
                    currentLegend.CommonEventArgs.data.legendItem.LegendStyle.Color = colorGradName;
                    bounds = (rowCount || columnCount) ? { Width: legendItemWidth, Height: legendItemHeight } : legendsize;
                    bounds._Width = legendsize.Width;

                    if (currentLegend.isTrendLine) {
                        currentLegend.TrendLineIndex = currentLegend.trendLineIndex;
                        trendlineType = series.trendlines[currentLegend.trendLineIndex].type.toLowerCase();
                        currentLegend.CommonEventArgs.data.legendItem.drawType = currentLegend.drawType = trendlineType == 'linear' || trendlineType == "movingaverage" ? 'line' : 'spline';
                    }
                    legendSeries[k].Bounds = bounds;
                    chartModel.legendCollection.push(currentLegend);
                }

                //LegendBounds calculation Perform here..
                if (position === 'top' || position === 'bottom' || position === 'custom') {
                    legendWidth = titleSize.width > legendWidth - itemPadding ? (titleSize.width + padding * 2 + itemPadding) : legendWidth + padding * 2;
                    width += padding;
                    height += padding * 2;
                    chartModel.LegendBounds = { Width: max(legendWidth, width) - itemPadding, Height: max(legendHeight, height), Rows: legnedHeightIncr };
                }
                else {
                    legendWidth = titleSize.width > legendWidth ? (titleSize.width + padding * 2) : legendWidth + padding * 2;
                    width += padding;
                    height += padding;
                    chartModel.LegendBounds = { Width: max(legendWidth, width), Height: max(legendHeight, height) + padding - itemPadding, Columns: legnedHeightIncr };
                }
                //Calculating legend viewer bounds or calculate user specified legend bounds
                chartModel.LegendViewerBounds = { Width: "0", Height: "0" };

                if (legendSizeHeight == "" || legendSizeHeight == null) {
                    if (position == 'left' || position == 'right' || position == 'custom')
                        legendHeightTemp = abs(svgHeight);
                    else
                        legendHeightTemp = abs((svgHeight / 100) * parseInt('20%'));
                    chartModel.LegendViewerBounds.Height = min(legendHeightTemp, chartModel.LegendBounds.Height);
                }
                else {
                    if (legendSizeHeight.indexOf("%") != -1)
                        chartModel.LegendViewerBounds.Height = abs((svgHeight / 100) * parseInt(legendSizeHeight));
                    else
                        chartModel.LegendViewerBounds.Height = parseInt(legendSizeHeight);
                }

                if (legendSizeWidth == "" || legendSizeWidth == null) {
                    if (position == 'top' || position == 'bottom' || position == 'custom')
                        legendWidthTemp = abs(svgWidth);
                    else
                        legendWidthTemp = abs((svgWidth / 100) * parseInt('20%'));
                    chartModel.LegendViewerBounds.Width = min(legendWidthTemp, chartModel.LegendBounds.Width);
                }
                else {
                    if (legendSizeWidth.indexOf("%") != -1)
                        chartModel.LegendViewerBounds.Width = abs((svgWidth / 100) * parseInt(legendSizeWidth));
                    else
                        chartModel.LegendViewerBounds.Width = parseInt(legendSizeWidth);
                }
            }
            else {
                chartModel.LegendBounds = { Width: 0, Height: 0 };
                chartModel.LegendViewerBounds = { Width: 0, Height: 0 };
            }
            legendContainer = $(chart.legendContainer);
            legendSvgContainer = $(chart.legendSvgContainer);
            if (legend.enableScrollbar) {
                chartModel.LegendActualBounds = chartModel.LegendViewerBounds;
                legendContainer.removeAttr("style");
                legendContainer.css({ "visibility": 'hidden', "width": chartModel.LegendViewerBounds.Width, "height": chartModel.LegendViewerBounds.Height });
                legendSvgContainer.css({ "height": chartModel.LegendBounds.Height, "width": chartModel.LegendBounds.Width });

                if (legend._ejScroller) {
                    if (legend._ejScroller && isRTL) {
                        legendContainer.addClass("e-rtl");
                    }
                    $('#' + legendContainer[0].id).ejScroller({ width: chartModel.LegendViewerBounds.Width, height: chartModel.LegendViewerBounds.Height })
                }
                else {
                    legendContainer.css({ "overflow": "scroll" });
                    if(legendContainer.hasClass("e-rtl"))
                        legendContainer.removeClass("e-rtl");
                }

                if (chartModel.LegendBounds.Width > chartModel.LegendViewerBounds.Width && chartModel.LegendBounds.Height > chartModel.LegendViewerBounds.Height) {
                    if (legend._ejScroller) {
                        hScrollSize = $('.e-hscrollbar').height() || 0;
                        vScrollSize = $('.e-vscrollbar').width() || 0;
                    } else {
                        legendContainer.css({ "overflow": "scroll" });
                        hScrollSize = legendContainer[0].offsetHeight - (legendBorder * 2) - legendContainer[0].clientHeight;
                        vScrollSize = legendContainer[0].offsetWidth - (legendBorder * 2) - legendContainer[0].clientWidth;
                    }
                } else if (chartModel.LegendBounds.Width > chartModel.LegendViewerBounds.Width) {
                    if (legend._ejScroller) {
                        hScrollSize = $('.e-hscrollbar').height() || 0;
                        vScrollSize = 0;
                    }
                    else {
                        legendContainer[0].style.overflowX = "scroll";
                        legendContainer[0].style.overflowY = "hidden";
                        hScrollSize = legendContainer[0].offsetHeight - (legendBorder * 2) - legendContainer[0].clientHeight;
                        vScrollSize = 0;
                    }
                } else if (chartModel.LegendBounds.Height > chartModel.LegendViewerBounds.Height) {
                    if (legend._ejScroller) {
                        hScrollSize = 0;
                        vScrollSize = $('.e-vscrollbar').width();
                    }
                    else {
                        legendContainer[0].style.overflowY = "scroll";
                        legendContainer[0].style.overflowX = "hidden";
                        hScrollSize = 0;
                        vScrollSize = legendContainer[0].offsetWidth - (legendBorder * 2) - legendContainer[0].clientWidth;
                    }
                }

            }
            else {
                chartModel.LegendActualBounds = chartModel.LegendBounds;
                if (legendSizeWidth != "" && legendSizeWidth != null)
                    chartModel.LegendActualBounds.Width = parseInt(legendSizeWidth);
                if (legendSizeHeight != "" && legendSizeHeight != null)
                    chartModel.LegendActualBounds.Height = parseInt(legendSizeHeight);
            }
            chartModel.LegendActualBounds.Height += Math.abs(hScrollSize);
            chartModel.LegendActualBounds.Width += Math.abs(vScrollSize);
            chartModel.LegendActualBounds.hScrollSize = hScrollSize;
            chartModel.LegendActualBounds.vScrollSize = vScrollSize;
        },

        GetPointXYOrgin: function (x, y, orginX, orginY) {

            var xvalue = ((x - orginX) / (this.model.axes.PrimaryXaxis.visibleRange.max - orginX)) * (this.model.m_AreaBounds.Width);
            var yvalue = ((y - orginY) / (this.model.axes.PrimaryYaxis.visibleRange.max - orginY)) * (this.model.m_AreaBounds.Height - this.GetPointXY(this.model.axes.PrimaryXaxis.visibleRange.min, Math.max(this.model.axes.PrimaryYaxis.visibleRange.min, 0)).Y);

            return { X: xvalue, Y: yvalue };
        },

        _wrap: function (axis, gap, labelText, textOverflow, font, textSize) {
            var text = labelText, textWidth = textSize.width, textCollection = [], unTrimmedText = [], textLength = text.length,
                line = 0, i = 0, labelCollection = labelText.split(' '), labelCollectionLength = labelCollection.length;
            if (textOverflow == 'wrap') {
                if (textWidth > gap) {
                    for (var w = 1; w <= text.length; w++) {
                        labelText = text.substring(0, w);
                        textWidth = ej.EjSvgRender.utils._measureText(labelText, null, font).width;
                        if (textWidth > gap) {
                            line = line + 1; // To find the no of rows splitted
                            labelText = text.substring(0, w - 1);
                            textCollection[i] = labelText;
                            text = text.slice(w - 1, textLength);
                            currentTextCollextion = text.split(' ');
                            text = labelCollection.indexOf(currentTextCollextion[0]) > -1 ? text : '-' + text;
                            var newTextWidth = ej.EjSvgRender.utils._measureText(labelText, null, font).width;
                            i++;
                            w = 0;
                        }
                    }
                }
                textCollection[i] = labelText;
            }
            else if (textOverflow == "wrapandtrim") {
                var max = 0, word, currentWidth, nextWidth;
                for (var i = 0; i < labelCollectionLength; i++) {
                    word = labelCollection[i];
                    currentWidth = ej.EjSvgRender.utils._measureText(word, null, font).width;
                    if (currentWidth < gap && textWidth > gap) {
                        while (i < labelCollectionLength) {
                            currentWidth = ej.EjSvgRender.utils._measureText(word, null, font).width;
                            nextWidth = (labelCollection[i + 1]) ? ej.EjSvgRender.utils._measureText(labelCollection[i + 1], null, font).width : 0;
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
                        textCollection.push(word);
                    }
                    else {
                        if (textWidth > gap) {
                            unTrimmedText.push(word);
                            word = ej.EjSvgRender.utils._trimText(word, gap, font);
                            newTextWidth = ej.EjSvgRender.utils._measureText(word, null, font).width;
                            max = Math.max(max, newTextWidth)
                            textCollection.push(word);
                        } else {
                            textCollection.push(labelText);
                            break;
                        }
                    }
                }
            }
            return { text: textCollection, unTrimmedText: unTrimmedText };
        },

        // to get the size of multi level labels
        getMultiLevelLabelSize: function (axis) {
            var value = 0;
            axis._multiLevelLabelHeight = 0;

            // declaration
            var grpLabelArr = [], multiLevelLabelHeight = [], prevHeight = [], grpLabelLength = axis.multiLevelLabels.length,
                range = axis.visibleRange, grpLabel, level, i, startX, endX, labelSize, gap, height, padding = 10, textCollection, axisValue, borderStyle, greaterIndex, textOverflow,
                orientation = axis.orientation.toLowerCase(), braceFlag = [];
            if (orientation == "vertical")
                axisValue = axis.length;
            else
                axisValue = axis.width ? axis.width : (this.model.primaryYAxis.AxisMaxWidth ? axis.length - this.model.primaryYAxis.AxisMaxWidth : axis.length);
            for (i = 0; i < grpLabelLength; i++) {
                grpLabel = axis.multiLevelLabels[i] = grpLabelArr[i] = $.extend(true, {}, this.model.multiLevelLabelsDefault, axis.multiLevelLabels[i]);
                borderStyle = grpLabel.border.type.toLowerCase();
                level = grpLabel.level;
                if (grpLabel.visible && grpLabel.text != "" && !ej.util.isNullOrUndefined(grpLabel.start) && !ej.util.isNullOrUndefined(grpLabel.end)) {
                    startX = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.start, range, axis.isInversed) * (axisValue));
                    endX = Math.ceil(ej.EjSvgRender.utils._getPointXY(grpLabel.end, range, axis.isInversed) * (axisValue));
                    labelSize = ej.EjSvgRender.utils._measureText(grpLabel.text, null, grpLabel.font);
                    textOverflow = grpLabel.textOverflow.toLowerCase();
                    gap = ej.util.isNullOrUndefined(grpLabel.maximumTextWidth) ? endX - startX : grpLabel.maximumTextWidth;
                    height = orientation == "vertical" ? (grpLabel.maximumTextWidth ? grpLabel.maximumTextWidth : labelSize.width) : labelSize.height;
                    height += 2 * grpLabel.border.width;
                    if (labelSize.width > gap - padding && (textOverflow == "wrap" || textOverflow == "wrapandtrim")) {   // for wrap
                        textCollection = this._wrap(axis, gap - padding, grpLabel.text, textOverflow, grpLabel.font, labelSize);
                        textCollection = textCollection["text"];
                        height = orientation == "vertical" ? gap - padding : (height * (textCollection.length));
                    }
                    if (ej.util.isNullOrUndefined(multiLevelLabelHeight[level]))
                        multiLevelLabelHeight[level] = height;
                    else
                        multiLevelLabelHeight[level] = multiLevelLabelHeight[level] < height ? height : multiLevelLabelHeight[level];
                }
            }
            // to sort based on level
            grpLabelArr.sort(function (a, b) {
                return parseFloat(a.level) - parseFloat(b.level);
            });
            axis.multiLevelLabels.sort(function (a, b) {
                return parseFloat(a.level) - parseFloat(b.level);
            });
            // to modify the level
            for (var j = 0; j < grpLabelArr.length; j++) {
                if (j == 0) {
                    axis.multiLevelLabels[j]._level = grpLabelArr[j]._level = 0;
                    greaterIndex = 0;
                }
                else if (grpLabelArr[j].level > greaterIndex + 1) {
                    axis.multiLevelLabels[j]._level = grpLabelArr[j]._level = greaterIndex + 1;
                    greaterIndex = grpLabelArr[j]._level;
                }
                else {
                    axis.multiLevelLabels[j]._level = grpLabelArr[j]._level = grpLabelArr[j].level;
                    greaterIndex = grpLabelArr[j].level > greaterIndex ? grpLabelArr[j].level : greaterIndex;
                }
                if (borderStyle == "curlybrace")
                    braceFlag[axis.multiLevelLabels[j]._level] = true;
            }
            // to find the sum
            for (var i = 0; i < multiLevelLabelHeight.length; i++) {
                prevHeight[i] = value;
                if (!ej.util.isNullOrUndefined(multiLevelLabelHeight[i])) {
                    value = borderStyle == "brace" ? value + multiLevelLabelHeight[i] : value + multiLevelLabelHeight[i] + padding / 2;
                    if (braceFlag[i]) {
                        value += padding;
                        multiLevelLabelHeight[i] += padding;
                    }
                }
                else {
                    multiLevelLabelHeight.splice(i, 1);
                    i--;
                }
            }
            axis._multiLevelLabelHeight = value;
            axis.multiLevelLabelHeight = multiLevelLabelHeight;
            axis.prevHeight = prevHeight;

            return value;
        },

        _saturationColor: function (color, lum) {

            // validate hex string
            color = this.colorNameToHex(color);
            color = String(color).replace(/[^0-9a-f]/gi, '');
            if (color.length < 6) {
                color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(color.substr(i * 2, 2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00" + c).substr(c.length);
            }

            return rgb;
        },

        _drawChartAreaRect: function () {

            var fillColor = !(this.model.background && this.model.background._gradientStop) ? this.model.background : 'url(#' + this.svgObject.id + '_backGradient)';

            if (this.model.backGroundImageUrl)
                fillColor = 'transparent';

            var chartBorder = this.model.border;
            var options = {
                'id': this.svgObject.id + '_SvgRect',
                'x': chartBorder.width / 2,
                'y': chartBorder.width / 2,
                'width': $(this.svgObject).width() - (2 * chartBorder.width),
                'height': $(this.svgObject).height() - (2 * chartBorder.width),
                'fill': fillColor,
                'opacity': chartBorder.opacity,
                'stroke-width': chartBorder.width,
                'stroke': chartBorder.color,
                'class': "e-chartborder"
            };
            this.svgRenderer.drawRect(options, this.svgObject);



            if (this.model.backGroundImageUrl)
                this._drawBackImage();

            if (this.model.AreaType == 'cartesianaxes' && !this.model.enable3D) {
                var borderOptions = {
                    'id': this.svgObject.id + '_ChartArea',
                    'x': this.model.m_AreaBounds.X,
                    'y': this.model.m_AreaBounds.Y,
                    'width': this.model.m_AreaBounds.Width,
                    'height': this.model.m_AreaBounds.Height,
                    'fill': this.model.chartArea.background,
                    'stroke-width': this.model.chartArea.border.width,
                    'opacity': this.model.chartArea.border.opacity,
                    'stroke': this.model.chartArea.border.color,
                    'class': "e-chartareaborder"
                };
                this.svgRenderer.drawRect(borderOptions, this.svgObject);


            }

        },
        axesIndexCount: function (axis, index) {
            var vRowcount = [];
            for (var k = 0; k < axis.length; k++) {
                var currentAxis = axis[k];
                if (currentAxis.orientation.toLowerCase() == "vertical") {
                    if (currentAxis.rowIndex == index)
                        vRowcount.push(currentAxis);
                }
                else {
                    if (currentAxis.columnIndex == index)
                        vRowcount.push(currentAxis);
                }
            }
            return vRowcount;
        },
        axesCount: function (axis) {
            var vRowcount = [], indexValue = [], definitionsLength = 0;
            var chartModel = this.model;
            $.each(axis, function (index, currentAxis) {
                if (currentAxis.orientation.toLowerCase() == "vertical") {
                    definitionsLength = (chartModel.rowDefinitions) ? chartModel.rowDefinitions.length : 0;
                    if (index == 0) vRowcount.push({ axis: currentAxis, index: currentAxis.rowIndex });
                    else if (currentAxis.rowIndex != vRowcount[vRowcount.length - 1].axis.rowIndex)
                        vRowcount.push({ axis: currentAxis, index: currentAxis.rowIndex });
                }
                else {
                    definitionsLength = (chartModel.columnDefinitions) ? chartModel.columnDefinitions.length : 0;
                    if (index == 0) vRowcount.push({ axis: currentAxis, index: currentAxis.columnIndex });
                    else if (currentAxis.columnIndex != vRowcount[vRowcount.length - 1].axis.columnIndex)
                        vRowcount.push({ axis: currentAxis, index: currentAxis.columnIndex });
                }
            });
            var length = vRowcount.length;
            if (definitionsLength > length) {
                length = definitionsLength;
                for (var l = 0; l < definitionsLength; l++)
                    indexValue.push(l);
            } else {
                for (var i = 0; i < length; i++)
                    indexValue.push(vRowcount[i].index);
            }

            return { length: length, indexValue: indexValue };

        },

        //Calculate position for each vertical axis
        _calRowSize: function () {
            var start = 0;
            var yaxisOrign = [];
            var totalRealLength = 0;
            var orginY = this.model.m_AreaBounds.Y + this.model.m_AreaBounds.Height;
            //Caluculate size for rowdefinitions values
            if (this.model._rowDefinitions[0].rowDefinitions != null) {
                for (var i = 0, rowMax = this.model._rowDefinitions.length; i < rowMax; i++) {
                    var rowDef = this.model._rowDefinitions[i].rowDefinitions;
                    rowDef.rowHeight = Math.abs(rowDef.rowHeight);
                    var realLength = 0;
                    if (rowDef.unit.toLowerCase() == "percentage") {
                        var length = this._axisRowDefinitionSize(this.model.rowDefinitions);
                        realLength = Math.floor((this.model.m_AreaBounds.Height) * (rowDef.rowHeight / length));
                    }
                    else
                        realLength = rowDef.rowHeight;
                    if (i == 0) yaxisOrign.push(orginY);

                    yaxisOrign.push((orginY - realLength - totalRealLength));
                    totalRealLength += realLength;


                }

            }
            //Calculate size based on chart area size
            else {
                var height = Math.floor((this.model.m_AreaBounds.Height) / this.model._rowDefinitions.length);

                for (start = (orginY); start >= this.model.m_AreaBounds.Y; start = start - height) {
                    yaxisOrign.push(start);
                }
            }
            return yaxisOrign;
        },

        //Calculate position for each horizontal axis
        _calColumnSize: function () {
            var xaxisOrign = [];
            var orginX = this.model.m_AreaBounds.X;
            var areaWidth = this.model.m_AreaBounds.Width;
            var totalRealLength = 0;
            var columnDef = this.model._columnDefinitions;
            //Caluculate size for columndefinitions values
            if (columnDef[0].columnDefinitions != null) {
                for (var i = 0, max = columnDef.length; i < max; i++) {
                    var rowDef = columnDef[i].columnDefinitions;
                    rowDef.columnWidth = Math.abs(rowDef.columnWidth);
                    var realLength;
                    if (rowDef.unit.toLowerCase() == "percentage") {
                        var length = this._axisColumnDefinitionSize(this.model.columnDefinitions);
                        realLength = Math.floor((areaWidth) * (rowDef.columnWidth / length));
                    }
                    else
                        realLength = rowDef.columnWidth;
                    if (i == 0) xaxisOrign.push(orginX);

                    xaxisOrign.push((orginX + realLength + totalRealLength));
                    totalRealLength += realLength;
                }
            }
            //Caluculate size based on chart area size
            else {
                var width = Math.floor((areaWidth) / columnDef.length);
                for (var start = orginX, maxStart = orginX + areaWidth; start <= maxStart; start = start + width) {
                    xaxisOrign.push(start);

                }
            }
            return xaxisOrign;
        },

        //Calculate position and size for each axis
        _calculateAxisSize: function (params) {

            //For Horizontal
            var isInitAxes = true, isOppInitAxes = true;
            var xaxisOrign = this._calColumnSize();
            var columnDefinition = this.model._columnDefinitions;
            for (var i = 0, maxLength = columnDefinition.length; i < maxLength; i++) {
                var x1 = xaxisOrign[i];
                var x2 = xaxisOrign[i + 1];
                var nearIndexVal = 0;
                var farIndexVal = 0;;
                var isColFirstAxes = true, isColOppFirstAxes = true;
                var oppY = this.model.m_AreaBounds.Y;
                var norY = oppY + this.model.m_AreaBounds.Height;
                for (var j = 0, maxCol = columnDefinition[i].axis.length; j < maxCol; j++) {
                    var currentColAxis = columnDefinition[i].axis[j];
                    var realY = 0, axisColumnSpace = 0;
                    var opposedPosition = currentColAxis._opposed;
                    if (!params.axes[currentColAxis.name]._validCross) {
                        if (!opposedPosition) {
                            if (!(isColFirstAxes && (isInitAxes || nearIndexVal == 0))) {
                                axisColumnSpace = columnDefinition.nearSizes[nearIndexVal];
                                realY = norY = (norY + axisColumnSpace);
                                nearIndexVal++;
                            }
                            else {
                                realY = norY;
                                isColFirstAxes = false;
                            }

                        } else {
                            if (!(isColOppFirstAxes && (isOppInitAxes || farIndexVal == 0))) {
                                axisColumnSpace = columnDefinition.farSizes[farIndexVal];
                                realY = oppY = (oppY - axisColumnSpace);
                                farIndexVal++;
                            }
                            else {
                                realY = oppY;
                                isColOppFirstAxes = false;
                            }
                        }
                    }
                    if (currentColAxis.columnSpan) {
                        //Skip the axis size calculation for duplicate span axis
                        if (!(columnDefinition[i].index == currentColAxis.columnIndex))
                            continue;
                        var axisSize = (maxLength >= (i + currentColAxis.columnSpan)) ? i + currentColAxis.columnSpan : i + 1;
                        x2 = xaxisOrign[axisSize];
                        if (!opposedPosition && nearIndexVal == 0) isInitAxes = isColFirstAxes;
                        if (opposedPosition && farIndexVal == 0) isOppInitAxes = isColOppFirstAxes;
                    } else {
                        x2 = xaxisOrign[i + 1];
                        isInitAxes = true;
                        isOppInitAxes = true;
                    }

                    currentColAxis.Location = {};
                    currentColAxis.Location.X1 = x1 + currentColAxis.plotOffset;
                    currentColAxis.Location.Y1 = realY;
                    currentColAxis.Location.X2 = x2 - currentColAxis.plotOffset;
                    currentColAxis.Location.Y2 = realY;
                    currentColAxis.x = currentColAxis.Location.X1;
                    currentColAxis.y = currentColAxis.Location.Y1;
                    currentColAxis.width = (currentColAxis.Location.X2 - currentColAxis.Location.X1);
                    currentColAxis.height = currentColAxis.Location.Y2 - currentColAxis.Location.Y1;

                }
            }

            //For Vertical
            isInitAxes = true, isOppInitAxes = true;
            var yaxisOrign = this._calRowSize();
            var rowDefinition = this.model._rowDefinitions;
            for (var i = 0, rowLength = rowDefinition.length; i < rowLength; i++) {
                var y1 = yaxisOrign[i];
                var y2 = yaxisOrign[i + 1];
                var nearIndex = 0;
                var farIndex = 0;
                var isFirstAxes = true, isOppFirstAxes = true;
                var x = this.model.m_AreaBounds.X;
                var norX = x, oppX = x + this.model.m_AreaBounds.Width;
                for (var j = 0, maxRow = rowDefinition[i].axis.length; j < maxRow; j++) {
                    var axisSpace = 0;
                    var realX = 0;

                    var currentAxis = rowDefinition[i].axis[j];
                    var opposedPosition = currentAxis._opposed;
                    if (!params.axes[currentAxis.name]._validCross) {
                        if (!opposedPosition) {
                            if (!(isFirstAxes && (isInitAxes || nearIndex == 0))) {
                                axisSpace = rowDefinition.nearSizes[nearIndex];
                                realX = norX = (norX - axisSpace);
                                nearIndex++;
                            } else {
                                realX = x;
                                isFirstAxes = false;
                            }

                        } else {
                            if (!(isOppFirstAxes && (isOppInitAxes || isOppInitAxes == 0))) {
                                axisSpace = rowDefinition.farSizes[farIndex];
                                realX = oppX = (oppX + axisSpace);
                                farIndex++;
                            } else {
                                realX = oppX;
                                isOppFirstAxes = false;
                            }
                        }
                    }
                    if (currentAxis.rowSpan) {
                        //Skip the axis size calculation for duplicate span axis
                        if (!(rowDefinition[i].index == currentAxis.rowIndex))
                            continue;
                        var axisRowSize = (rowLength >= (i + currentAxis.rowSpan)) ? i + currentAxis.rowSpan : i + 1;
                        y2 = yaxisOrign[axisRowSize];
                        if (!opposedPosition && nearIndex == 0) isInitAxes = isFirstAxes;
                        if (opposedPosition && farIndex == 0) isOppInitAxes = isOppFirstAxes;
                    } else {
                        y2 = yaxisOrign[i + 1];
                        isInitAxes = true;
                        isOppInitAxes = true;
                    }
                    currentAxis.Location = {};
                    currentAxis.Location.X1 = realX;
                    currentAxis.Location.Y1 = y1 - currentAxis.plotOffset;
                    currentAxis.Location.X2 = realX;
                    currentAxis.Location.Y2 = y2 + currentAxis.plotOffset;
                    currentAxis.x = currentAxis.Location.X1;
                    currentAxis.y = currentAxis.Location.Y2;
                    currentAxis.height = (currentAxis.Location.Y1 - currentAxis.Location.Y2);
                    currentAxis.width = currentAxis.axisLine.width;

                }
            }
        },

        //Validates whether provided crossing value is valid or not
        _validateCrossing: function (axis) {
            axis._opposedPosition = false;
            if (axis.crossesAt != null) {
                var crossAxis = this._getCrossAxis(this.model._axes, axis.orientation.toLowerCase() == 'horizontal', axis.crossesInAxis);
                axis._crossValue = this._getCrossValue(axis, crossAxis, crossAxis._valueType);
                if ((crossAxis.isInversed ? !axis.opposedPosition : axis.opposedPosition) ? axis._crossValue <= crossAxis.visibleRange.min : axis._crossValue >= crossAxis.visibleRange.max)
                    axis._opposedPosition = true;
                return (crossAxis.visibleRange.min < axis._crossValue && crossAxis.visibleRange.max > axis._crossValue);
            }
            return false;
        },

        //Method to place axis at crossed location
        _axisCrossing: function (axis, locateAxis, params) {
            var hor = axis.orientation.toLowerCase() == 'horizontal';
            var crossAxis = this._getCrossAxis(this.model._axes, hor, axis.crossesInAxis);
            var crossValue = axis._crossValue;
            var delta = Math.abs((crossAxis.isInversed ? crossAxis.visibleRange.max : crossAxis.visibleRange.min) - crossValue);
            this._locateAxis(axis, crossAxis, hor, delta);
            if (!locateAxis)
                params._crossAxisOverlap = this._avoidOverlapping(axis, this.model.m_AreaBounds, hor, axis.opposedPosition, params) || params._crossAxisOverlap;
        },

        _locateAxis: function (axis, crossAxis, hor, delta) {
            var loc = (hor ? crossAxis.height : crossAxis.width) * delta / crossAxis.visibleRange.delta;
            if (hor)
                axis.y = crossAxis.y + crossAxis.height - loc;
            else
                axis.x = crossAxis.x + loc;
        },

        _avoidOverlapping: function (axis, bounds, hor, opposed, params) {
            var diff = 0;
            var axisbounds = axis.showNextToAxisLine ? params.axes[axis.name]._bounds : 0;
            if (hor) {
                if (!opposed && axis.y + axisbounds > bounds.Y + bounds.Height) {
                    bounds.Height -= diff = axis.y + axisbounds - bounds.Y - bounds.Height;
                    this._recalculateSpace(axis, hor, opposed, diff);
                    return true;
                }
                else if (opposed && axis.y - axisbounds < bounds.Y) {
                    bounds.Y += diff = axisbounds - (axis.y - bounds.Y);
                    bounds.Height -= diff;
                    this._recalculateSpace(axis, hor, opposed, diff);
                    return true;
                }
            }
            else {
                if (!opposed && axis.x - axisbounds < bounds.X) {
                    bounds.X += diff = axisbounds - (axis.x - bounds.X);
                    bounds.Width -= diff;
                    this._recalculateSpace(axis, hor, opposed, diff);
                    return true;
                }
                else if (opposed && axis.x + axisbounds > bounds.X + bounds.Width) {
                    bounds.Width -= diff = axis.x + axisbounds - bounds.X - bounds.Width;
                    this._recalculateSpace(axis, hor, opposed, diff);
                    return true;
                }
                else if (axis.labelPosition == "inside" && axis.x + axisbounds > bounds.X + bounds.Width) {
                    bounds.Width -= diff = axis.x + axisbounds - bounds.X - bounds.Width;
                    this._recalculateSpace(axis, hor, opposed, diff, axis.showNextToAxisLine);
                    return true;
                }
            }
        },

        _recalculateSpace: function (axis, isHor, opposed, diff, isCrossing) {
            if (isHor) {
                var def = this.model._rowDefinitions;
                var index = opposed ? def.length - 1 : 0;
                for (var i = 0, len = def[index].axis.length; i < len; i++) {
                    def[index].axis[i].height -= diff;
                    def[index].axis[i].Location.Y2 -= diff;
                    if (opposed)
                        def[index].axis[i].Location.Y1 = def[index].axis[i].y += diff;
                }
                var colIndex = axis.columnIndex;
                def = this.model._columnDefinitions
                for (var i = 0, len = def.length; i < len; i++)
                    if (i !== colIndex)
                        for (var j = 0, length = def[i].axis.length; j < length; j++)
                            if (def[i].axis[j]._opposed === opposed)
                                def[i].axis[j].Location.Y1 = def[i].axis[j].Location.Y2 = def[i].axis[j].y += (opposed ? 1 : -1) * diff;
            }
            else {
                var def = this.model._columnDefinitions;
                var index = opposed ? def.length - 1 : 0;
                for (var i = 0, len = def[index].axis.length; i < len; i++) {
                    def[index].axis[i].width -= diff;
                    if (!isCrossing) {
                        if (opposed)
                            def[index].axis[i].Location.X2 -= diff;
                        else
                            def[index].axis[i].Location.X1 = def[index].axis[i].x += diff;
                    }

                }
                var rowIndex = axis.rowIndex;
                def = this.model._rowDefinitions
                for (var i = 0, len = def.length; i < len; i++)
                    if (i !== rowIndex)
                        for (var j = 0, length = def[i].axis.length; j < length; j++)
                            if (def[i].axis[j]._opposed === opposed)
                                def[i].axis[j].Location.X1 = def[i].axis[j].Location.X2 = def[i].axis[j].x += (opposed ? -1 : 1) * diff;
            }
        },

        _getCrossValue: function (axis, crossAxis, type) {
            switch (type.toLowerCase()) {
                case 'category':
                    return crossAxis.labels.indexOf(axis.crossesAt) != -1 ? crossAxis.labels.indexOf(axis.crossesAt) : axis.crossesAt;
                case 'datetime':
                    return isNaN(Date.parse(axis.crossesAt)) ? null : Date.parse(axis.crossesAt);
                case 'logarithmic':
                    return Math.log(axis.crossesAt) / Math.log(crossAxis.logBase);
            }
            return axis.crossesAt;
        },

        _getXCrossValue: function (series, axis, params) {
            var crossesInAxis = axis.crossesInAxis, yAxisName = series._yAxisName, validCross = params.axes[axis.name]._validCross || params.axes[axis.name]._validCross == null;
            //Checks whether origin should be changed for current series or not.
            return validCross && axis.crossesAt && ((!crossesInAxis && yAxisName === this.model.primaryYAxis.name) || (crossesInAxis && this._getCrossAxis(this.model._axes, true, crossesInAxis).name === yAxisName)) ? axis.crossesAt : 0;
        },

        _getAxisByName: function (axes, hor, name) {
            if (name) {
                for (var i = 0, count = axes.length; i < count; i++)
                    if (axes[i].name === name && (hor ? axes[i].orientation == 'vertical' : axes[i].orientation == 'horizontal'))
                        return axes[i];
            }
        },

        _getCrossAxis: function (axes, hor, value) {
            return this._getAxisByName(axes, hor, value) || (this.model.requireInvertedAxes ? hor ? this.model.primaryXAxis : this.model.primaryYAxis : hor ? this.model.primaryYAxis : this.model.primaryXAxis);
        },

        _arrangeAxis: function () {
            var chartobj = this;
            var axis;
            var customRow;
            //Generate columnIndex/RowIndex value if it is not specify in sample  
            for (var i = 0; i < this.model._axes.length; i++) {
                axis = this.model._axes[i];
                if (axis.orientation.toLowerCase() == "horizontal") {
                    chartobj.model.hAxes.push(axis);
                    axis.columnIndex = (ej.util.isNullOrUndefined(axis.columnIndex)) ? 0 : (axis.columnIndex);
                    chartobj.model.hAxes[chartobj.model.hAxes.length - 1].columnIndex = axis.columnIndex;
                } else if (axis.orientation.toLowerCase() == "vertical") {

                    chartobj.model.vAxes.push(axis);
                    axis.rowIndex = (ej.util.isNullOrUndefined(axis.rowIndex)) ? 0 : (axis.rowIndex);
                    chartobj.model.vAxes[chartobj.model.vAxes.length - 1].rowIndex = axis.rowIndex;
                    customRow = (!ej.util.isNullOrUndefined(chartobj.model.rowDefinitions)) ? chartobj.model.rowDefinitions[axis.rowIndex] : null;
                    if (customRow) {
                        axis.axisBottomLine = {};
                        axis.axisBottomLine.visible = true;
                        axis.axisBottomLine.lineWidth = customRow.lineWidth;
                        axis.axisBottomLine.color = customRow.lineColor;
                    }
                }
            }

            this.model.hAxes = ej.DataManager(this.model.hAxes, ej.Query().sortBy("columnIndex")).executeLocal();

            this.model.vAxes = ej.DataManager(this.model.vAxes, ej.Query().sortBy("rowIndex")).executeLocal();

            //column axis information push into _rowDefinitions
            var rowCount = this.axesCount(chartobj.model.vAxes);
            chartobj.model._rowDefinitions = [];
            if (chartobj.model.vAxes.length > 0) {
                for (var j = 0; j < rowCount.length; j++) {
                    var rowCollection = chartobj.model.rowDefinitions;
                    var rowDefinitions = ((rowCollection)) ? (rowCollection[j] ? rowCollection[j] : rowCollection[0]) : null;
                    chartobj.model._rowDefinitions.push({
                        axis: this.axesIndexCount(chartobj.model.vAxes, rowCount.indexValue[j])
                        , index: rowCount.indexValue[j], rowDefinitions: rowDefinitions
                    });
                }
            }

            var rowDefinition = chartobj.model._rowDefinitions;
            //Using filter to get spanning row axis collection
            var spanningRow = this._axisFilter(rowDefinition, "rowSpan");
            //Arrange the entire axis for row span
            this._SpanningAxes(rowDefinition, spanningRow, true);

            //column axis information push into _columnDefinitions
            var columnCount = this.axesCount(chartobj.model.hAxes);
            chartobj.model._columnDefinitions = [];
            if (chartobj.model.hAxes.length > 0) {
                for (var k = 0; k < columnCount.length; k++) {
                    var columnCollection = chartobj.model.columnDefinitions;
                    var columnDefinitions = (columnCollection) ? (columnCollection[k] ? columnCollection[k] : columnCollection[0]) : null;
                    chartobj.model._columnDefinitions.push({
                        axis: this.axesIndexCount(chartobj.model.hAxes, columnCount.indexValue[k])
                        , index: columnCount.indexValue[k], columnDefinitions: columnDefinitions
                    });
                }
            }

            var columnDefinition = chartobj.model._columnDefinitions;
            //Using filter to get spanning column axis collection
            var spanningColumn = this._axisFilter(columnDefinition, "columnSpan");
            //Arrange the entire axis for column span
            this._SpanningAxes(columnDefinition, spanningColumn, false);

            this._axisSize();


        },

        //Arrange the entire axis for spanning
        _SpanningAxes: function (definition, spanningCollection, isRow) {
            for (var spanIndex = 0, spanMax = spanningCollection.length; spanIndex < spanMax; spanIndex++) {
                var currentAxis = spanningCollection[spanIndex];
                if (currentAxis == null) break;
                var span = isRow ? currentAxis.rowSpan : currentAxis.columnSpan;
                var index = isRow ? currentAxis.rowIndex : currentAxis.columnIndex;
                if (definition[index] != undefined) {
                    var axisIndex = definition[index].axis.indexOf(currentAxis);
                    for (var k = 1, m = index + 1; k < span && m < definition.length; k++ , m++) {
                        if (definition[m].axis.length >= axisIndex) {
                            //Insert duplicate span row to appropriate rowdefinition
                            definition[m].axis.splice(axisIndex, 0, currentAxis);
                        }
                    }
                }
            }
        },

        //Filter span axis from axes
        _axisFilter: function (definition, fieldName) {
            var axisResult = [];
            definition.filter(function (axes) {
                //Execute query to get spanning axis from axis array
                var axisCollection = ej.DataManager(axes["axis"], ej.Query().where(fieldName, ">", 1)).executeLocal();
                for (var i = 0, max = axisCollection.length; i < max; i++)
                    axisResult.push(axisCollection[i]);
            });
            return axisResult;
        },

        _axisSize: function () {
            //The below calcultion to get approximate length of axis
            var spaceValue = this._getLegendSpace();
            var hSpace = $(this.svgObject).width() - this.model.margin.left - this.model.margin.right - (this.model.elementSpacing * 2) - spaceValue.leftLegendWidth - spaceValue.rightLegendWidth;
            var hWidth = Math.floor(hSpace / this.axesCount(this.model.hAxes).length);

            var vSpace = $(this.svgObject).height() - this.model.margin.top - this.model.margin.bottom - (this.model.elementSpacing * 2) - spaceValue.topLegendHeight - spaceValue.bottomLegendHeight - spaceValue.modelTitleHeight - spaceValue.modelsubTitleHeight;
            var vWidth = Math.floor(vSpace / this.axesCount(this.model.vAxes).length);



            for (var j = 0; j < this.model._axes.length; j++) {
                var axis = this.model._axes[j];
                if (axis.orientation.toLowerCase() == "horizontal") {
                    if (this.model.AreaType != "polaraxes") {
                        var customColumn = (!ej.util.isNullOrUndefined(this.model.columnDefinitions)) ? this.model.columnDefinitions[axis.columnIndex] : [];
                        var columnLength = hWidth;
                        if (customColumn) {
                            customColumn.unit = (customColumn.unit == undefined) ? "percentage" : customColumn.unit;
                            customColumn.columnWidth = (customColumn.columnWidth == undefined) ? 100 : customColumn.columnWidth;
                            if (customColumn.unit.toLowerCase() == "percentage") {
                                var length = this._axisColumnDefinitionSize(this.model.columnDefinitions);
                                columnLength = Math.floor((hWidth) * (customColumn.columnWidth / length));
                            }
                            else
                                columnLength = customColumn.columnWidth;

                        }
                        axis.length = axis.columnSpan ? axis.columnSpan * columnLength : columnLength;
                    }
                    else {
                        if (hSpace > vSpace * 2)
                            axis.length = hSpace - vSpace;
                        else
                            axis.length = hSpace;
                    }
                } else if (axis.orientation.toLowerCase() == "vertical") {
                    if (this.model.AreaType != "polaraxes") {
                        var customRow = (!ej.util.isNullOrUndefined(this.model.rowDefinitions)) ? this.model.rowDefinitions[axis.rowIndex] : [];
                        var realLength = vWidth;
                        if (customRow) {
                            customRow.unit = (customRow.unit == undefined) ? "percentage" : customRow.unit;
                            customRow.rowHeight = (customRow.rowHeight == undefined) ? 100 : customRow.rowHeight;
                            if (customRow.unit.toLowerCase() == "percentage") {
                                var length = this._axisRowDefinitionSize(this.model.rowDefinitions);
                                realLength = Math.floor((vWidth) * (customRow.rowHeight / length));
                            }
                            else
                                realLength = customRow.rowHeight;

                        }
                        axis.length = axis.rowSpan ? (axis.rowSpan * realLength) : realLength;
                    }
                    else {
                        axis.length = vSpace / 2;
                    }
                }
            }
        },
        _axisRowDefinitionSize: function (array) {
            var length = 0;
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    length = length + array[i].rowHeight;
                }
            }
            length = length > 100 ? length : 100;
            return length;
        },
        _axisColumnDefinitionSize: function (array) {
            var length = 0;
            if (array) {
                for (var i = 0; i < array.length; i++) {
                    length = length + array[i].columnWidth;
                }
            }
            length = length > 100 ? length : 100;
            return length;
        },
        _axisMeasure: function (axis, realWidth, orientation, j) {
            var axisTitleHeight = 0, labelSize = 0, multiLevelLabelSize = 0;
            axis.axisLine.width = axis.axisLine.width < 0 ? 0 : axis.axisLine.width;
            axis.majorTickLines.size = axis.majorTickLines.size < 0 ? 0 : axis.majorTickLines.size;
            var axisLineWidth = !this.model.enable3D && axis.axisLine.visible && axis.axisLine.width;
            var size = ej.EjSvgRender.utils._measureText(axis.title.text, realWidth, axis.title.font);
            if (orientation == "vertical") {
                labelSize = axis._LableMaxWidth.width;
                axisTitleHeight = (axis.title.text == "" || !(axis.title.visible) || !(axis.visible)) ? 0 : ((document.documentMode === 8) ? size.width : size.height + (2 * this.model.elementSpacing));
            }
            else {
                labelSize = (axis._LableMaxWidth.height);
                axisTitleHeight = (axis.title.text == "" || !(axis.title.visible) || !(axis.visible)) ? 0 : (size.height + (this.model.elementSpacing));
            }
            axisTitleHeight = axis.title.position.toLowerCase() == "inside" ? 0 : axisTitleHeight;
            multiLevelLabelSize = this.getMultiLevelLabelSize(axis);
            var width;
            if ((j == 0) && (axis.tickLinesPosition == 'inside' && axis.labelPosition == 'inside'))
                axis.AxisMaxWidth = axisTitleHeight + multiLevelLabelSize + axisLineWidth + (this.model.elementSpacing);
            else if ((j == 0) && (axis.tickLinesPosition == 'inside' && axis.labelPosition != 'inside'))
                axis.AxisMaxWidth = axisTitleHeight + multiLevelLabelSize + axisLineWidth + (this.model.elementSpacing) + labelSize;
            else if ((j == 0) && (axis.tickLinesPosition != 'inside' && axis.labelPosition == 'inside'))
                axis.AxisMaxWidth = axisTitleHeight + multiLevelLabelSize + axisLineWidth + (this.model.elementSpacing) + axis.majorTickLines.size;
            else
                axis.AxisMaxWidth = axisTitleHeight + multiLevelLabelSize + axisLineWidth + this.model.elementSpacing + axis.majorTickLines.size + labelSize;
            axis.AxisMaxWidth += axis._isScroll ? 18 : 0;
            return axis.AxisMaxWidth;
        },

        _arraySum: function (val) {
            var total = 0;
            for (var i = 0; i < val.length; i++) {
                total += parseFloat(val[i]) || 0;
            }
            return total;
        },
        _calSpace: function (realWidth, definitions, orientation, params) {
            var nearSizes = [];
            var farSizes = [];
            var bounds, validCross, measureValue;
            for (var i = 0; i < definitions.length; i++) {
                var nearIndex = 0, farIndex = 0;
                for (var j = 0; j < definitions[i].axis.length; j++) {
                    var currentaxis = definitions[i].axis[j];
                    bounds = params.axes[currentaxis.name]._bounds = this._axisMeasure(currentaxis, realWidth, orientation, j);
                    validCross = params.axes[currentaxis.name]._validCross = this._validateCrossing(currentaxis);
                    measureValue = validCross ? 0 : bounds;
                    currentaxis._opposed = currentaxis.opposedPosition ? !currentaxis._opposedPosition : currentaxis._opposedPosition || currentaxis.opposedPosiiton || false;
                    if (validCross && definitions[i].axis[j].showNextToAxisLine)
                        continue;
                    if (!currentaxis.showNextToAxisLine) { measureValue = (currentaxis.labelPosition == "inside") ? bounds - currentaxis._multiLevelLabelHeight : bounds; }
                    if (!currentaxis._opposed) {
                        if (nearSizes.length <= nearIndex) {
                            nearSizes.push(measureValue);
                        } else if (nearSizes[nearIndex] < (measureValue)) {
                            nearSizes[nearIndex] = measureValue;
                        }
                        nearIndex++;
                    }
                    else {
                        if (farSizes.length <= farIndex) {
                            farSizes.push(measureValue);
                        } else if (farSizes[farIndex] < (measureValue)) {
                            farSizes[farIndex] = measureValue;
                        }
                        farIndex++;
                    }

                }
            }
            return { nearSizes: nearSizes, farSizes: farSizes };
        },

        _getLegendSpace: function () {
            var chart = this.model,
                legend = chart.legend,
                position = legend.position.toLowerCase(),
                bounds = chart.LegendActualBounds,
                measureText = ej.EjSvgRender.utils._measureText,
                title = chart.title,
                subTitle = title.subTitle,
                elementSpacing = chart.elementSpacing,
                margin = chart.margin,
                svgWidth = chart.svgWidth,
                legendBorder = legend.border.width,
                ltheight = 0, space = 0,
                itemPadding = 10,
                leftLegendWidth = 0, rightLegendWidth = 0,
                topLegendHeight = 0, bottomLegendHeight = 0,
                labelCollection = title.text.split(' '),
                text, line = 0, enableTrim = title.enableTrim,
                maxTitleWidth = title.maximumWidth,
                maxTitleWidth = (maxTitleWidth.toString() == 'auto' || maxTitleWidth.toString() == '') ? (svgWidth * 0.75) : parseInt(maxTitleWidth),
                textOverflow = title.textOverflow.toLowerCase(),
                titleText = title.text,
                titleVisible = title.visible, titleCollection, subTitleCollection, data,
                measureTitle = ej.EjSvgRender.utils._measureText(title.text, $(this.svgObject).width() - this.model.margin.left - this.model.margin.right, title.font),
                subTitleLabelCollection = subTitle.text.split(' '),
                subTitleEnableTrim = subTitle.enableTrim,
                maxSubTitleWidth = subTitle.maximumWidth,
                maxSubTitleWidth = (maxSubTitleWidth.toString() == 'auto' || maxSubTitleWidth.toString() == '') ? (svgWidth * 0.75) : parseInt(maxSubTitleWidth),
                subTitleTextOverflow = subTitle.textOverflow.toLowerCase(),
                subTitleText = subTitle.text,
                subTitleVisible = subTitle.visible,
                measureSubTitle = ej.EjSvgRender.utils._measureText(subTitle.text, $(this.svgObject).width() - this.model.margin.left - this.model.margin.right, subTitle.font),
                titleVisibility = titleVisible && enableTrim && measureTitle.width > maxTitleWidth ? true : false,
                subTitleVisibility = subTitleVisible && subTitleEnableTrim && measureSubTitle.width > maxSubTitleWidth ? true : false,
                textOverflowVisibility = textOverflow == "wrap" || textOverflow == "wrapandtrim" ? true : false,
                subTitleTextOverflowVisibility = subTitleTextOverflow == "wrap" || subTitleTextOverflow == "wrapandtrim" ? true : false;
            this.model.titleWrapTextCollection = [];
            this.model.subTitleWrapTextCollection = [];
            this.model.trimTooltip = false;
            this.model.subTitleTooltip = false;
            if (legend.visible) {
                space = (bounds.Width + (itemPadding / 2) + elementSpacing + (2 * legendBorder));
                leftLegendWidth = position == 'left' ? space : 0;
                rightLegendWidth = position == 'right' ? space : 0;
                if (legend.title.text)
                    ltheight = measureText(legend.title, null, legend.title.font).height;
                topLegendHeight = position == 'top' ? (bounds.Height + ltheight + (2 * legendBorder)) : 0;
                bottomLegendHeight = position == 'bottom' ? (bounds.Height + ltheight + (2 * legendBorder)) : 0;
            }
            if (titleVisibility && textOverflow == "wrap") {
                data = { text: titleText, font: title.font };
                titleCollection = this._rowsCalculation(data, maxTitleWidth, textOverflow);
            }
            else if (titleVisibility && textOverflow == "wrapandtrim") {
                data = { text: titleText, font: title.font };
                titleCollection = this._rowsCalculation(data, maxTitleWidth, textOverflow);
            }
            else if (textOverflow == "wrapandtrim" || textOverflow == "wrap") {
                data = { text: titleText, font: title.font };
                titleCollection = this._rowsCalculation(data, ej.EjSvgRender.utils._measureText(titleText, null, title.font).width, textOverflow);
            }
            this.model.titleWrapTextCollection = titleCollection ? titleCollection.textCollection : "";
            this.model.titleMaxWidth = titleCollection ? titleCollection.wordMax : maxTitleWidth;
            if (subTitleVisibility && subTitleTextOverflow == "wrap") {
                data = { text: subTitleText, font: subTitle.font };
                subTitleCollection = this._rowsCalculation(data, maxSubTitleWidth, subTitleTextOverflow);
            }
            else if (subTitleVisibility && subTitleTextOverflow == "wrapandtrim") {
                data = { text: subTitleText, font: subTitle.font };
                subTitleCollection = this._rowsCalculation(data, maxSubTitleWidth, subTitleTextOverflow);
                this.model.subTitleTooltip = this.model.trimTooltip;
            }
            else if (subTitleTextOverflow == "wrapandtrim" || subTitleTextOverflow == "wrap") {
                data = { text: subTitleText, font: subTitle.font };
                subTitleCollection = this._rowsCalculation(data, maxSubTitleWidth, subTitleTextOverflow);
            }
            this.model.subTitleWrapTextCollection = subTitleCollection ? subTitleCollection.textCollection : "";
            this.model.subTitleMaxWidth = subTitleCollection ? subTitleCollection.wordMax : maxSubTitleWidth;
            var titleHeight = measureText(title.text, svgWidth - margin.left - margin.right, title.font).height,
                subTitleHeight = measureText(subTitle.text, svgWidth - margin.left - margin.right, subTitle.font).height;
            var modelTitleHeight = (title.text == "" || !title.visible) ? 0 : (enableTrim && (textOverflowVisibility) && measureTitle.width > maxTitleWidth) ?
                ((titleHeight * this.model.titleWrapTextCollection.length) + elementSpacing) : (titleHeight + elementSpacing);
            var modelsubTitleHeight = (subTitle.text == "" || !subTitle.visible || !title.visible) ? 0 : (subTitleEnableTrim && (subTitleTextOverflowVisibility) && measureSubTitle.width > maxSubTitleWidth) ?
                ((subTitleHeight * this.model.subTitleWrapTextCollection.length) + elementSpacing) : (subTitleHeight + elementSpacing);

            return {
                leftLegendWidth: leftLegendWidth, rightLegendWidth: rightLegendWidth, topLegendHeight: topLegendHeight, bottomLegendHeight: bottomLegendHeight, modelTitleHeight: modelTitleHeight, modelsubTitleHeight: modelsubTitleHeight
            };
        },


        _arraySome: function (axes, orientation) {
            var scroll = false,
                isZoomScroll = this.model.zooming.enableScrollbar,
                count = axes.length,
                scrollbar,
                pointLength;

            for (var i = 0; i < count; i++) {
                scrollbar = axes[i].scrollbarSettings.enableScrollbar;
                pointLength = axes[i].scrollbarSettings.pointsLength;
                scroll = (scroll || (((axes[i]._isScroll && axes[i].maxPointLength < pointLength) || (axes[i].zoomFactor < 1 && scrollbar && isZoomScroll)) && axes[i].orientation.toLowerCase() == orientation));
            }

            return scroll;
        },

        _calculateAreaBounds: function (params) {
            var chartobj = this,
                realWidth = $(this.svgObject).width() - this.model.margin.left - this.model.margin.right,
                // Calculate area bounds X and width
                chartBorderWidth = chartobj.model.border.width,
                axis = this.model._axes[0],
                zomming = this.model.zooming.enableScrollbar,
                type = this.model.zooming.type.toLowerCase();
            chartobj.model.scrollerSize = 18;
            this.model._yScroll = this._arraySome(this.model._axes, 'vertical');
            this.model._xScroll = this._arraySome(this.model._axes, 'horizontal');

            //Calcultion for multiple axes(vertical)
            var sizes = this._calSpace(realWidth, chartobj.model._rowDefinitions, "vertical", params);
            chartobj.model._rowDefinitions.nearSizes = sizes.nearSizes;
            chartobj.model._rowDefinitions.farSizes = sizes.farSizes;
            var vAxesWidth = this._arraySum(sizes.nearSizes);
            var vAxesOppWidth = this._arraySum(sizes.farSizes);

            var spaceValue = this._getLegendSpace();

            var x = vAxesWidth + spaceValue.leftLegendWidth + chartobj.model.margin.left + chartBorderWidth;
            var rightSpacing = vAxesOppWidth + spaceValue.rightLegendWidth + chartobj.model.margin.right + chartobj.model.margin.left + (2 * chartBorderWidth);
            var width = $(this.svgObject).width();
            var boundsWidth = width - (x + rightSpacing);
			boundsWidth = Math.round(boundsWidth) <=0 ? 0 : boundsWidth;
            if (boundsWidth <= 0 && this.model.AreaType == "cartesianaxes") {
                $(this.svgObject).width(width - boundsWidth + 1);
                this._calculateAreaBounds(params);
            }
            else {
                // Calculate area bounds Y and Height   

                //Calcultion for multiple axes(Horizontal)
                var columnSizes = this._calSpace(realWidth, chartobj.model._columnDefinitions, "horizontal", params);
                chartobj.model._columnDefinitions.nearSizes = columnSizes.nearSizes;
                chartobj.model._columnDefinitions.farSizes = columnSizes.farSizes;
                var hAxesWidth = this._arraySum(columnSizes.nearSizes);
                var hAxesOppWidth = this._arraySum(columnSizes.farSizes);

                var y = hAxesOppWidth + this.model.margin.top + (this.model.elementSpacing) + spaceValue.modelTitleHeight + (spaceValue.modelsubTitleHeight) + spaceValue.topLegendHeight + chartBorderWidth;
                var bottomSpacing = hAxesWidth + this.model.margin.bottom + spaceValue.bottomLegendHeight + (2 * chartBorderWidth);
                var boundsHeight = Math.abs($(this.svgObject).height() - (y + bottomSpacing));
                boundsHeight = boundsHeight == 0 ? 1 : boundsHeight;
                this.model.m_AreaBounds = { X: x, Y: y, Width: boundsWidth, Height: boundsHeight };
                this.model.m_Spacing = { Left: x, Top: y, Right: rightSpacing, Bottom: bottomSpacing };

                if (this.model.enableCanvasRendering) {  // for adding bounds in canvas rendering
                    this.canvasX = x;
                    this.canvasY = y;
                    this.canvasWidth = boundsWidth;
                    this.canvasHeight = boundsHeight;
                } else
                    this.canvasX = this.canvasY = this.canvasHeight = this.canvasWidth = 0;
            }
        }
    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };



})(jQuery);