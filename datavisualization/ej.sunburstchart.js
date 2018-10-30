var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ejSunburstChart;
(function (ejSunburstChart) {
    (function (sunburstHorizontalAlignment) {
        sunburstHorizontalAlignment[sunburstHorizontalAlignment["left"] = "left"] = "left";
        sunburstHorizontalAlignment[sunburstHorizontalAlignment["right"] = "right"] = "right";
        sunburstHorizontalAlignment[sunburstHorizontalAlignment["center"] = "center"] = "center";
    })(ejSunburstChart.sunburstHorizontalAlignment || (ejSunburstChart.sunburstHorizontalAlignment = {}));
    var sunburstHorizontalAlignment = ejSunburstChart.sunburstHorizontalAlignment;
    (function (sunburstLegendShape) {
        sunburstLegendShape[sunburstLegendShape["circle"] = "circle"] = "circle";
        sunburstLegendShape[sunburstLegendShape["diamond"] = "diamond"] = "diamond";
        sunburstLegendShape[sunburstLegendShape["cross"] = "cross"] = "cross";
        sunburstLegendShape[sunburstLegendShape["pentagon"] = "pentagon"] = "pentagon";
        sunburstLegendShape[sunburstLegendShape["rectangle"] = "rectangle"] = "rectangle";
        sunburstLegendShape[sunburstLegendShape["triangle"] = "triangle"] = "triangle";
    })(ejSunburstChart.sunburstLegendShape || (ejSunburstChart.sunburstLegendShape = {}));
    var sunburstLegendShape = ejSunburstChart.sunburstLegendShape;
    (function (sunburstVerticalAlignment) {
        sunburstVerticalAlignment[sunburstVerticalAlignment["top"] = "top"] = "top";
        sunburstVerticalAlignment[sunburstVerticalAlignment["bottom"] = "bottom"] = "bottom";
        sunburstVerticalAlignment[sunburstVerticalAlignment["middle"] = "middle"] = "middle";
    })(ejSunburstChart.sunburstVerticalAlignment || (ejSunburstChart.sunburstVerticalAlignment = {}));
    var sunburstVerticalAlignment = ejSunburstChart.sunburstVerticalAlignment;
    (function (sunburstTheme) {
        sunburstTheme[sunburstTheme["flatlight"] = "flatlight"] = "flatlight";
        sunburstTheme[sunburstTheme["flatdark"] = "flatdark"] = "flatdark";
    })(ejSunburstChart.sunburstTheme || (ejSunburstChart.sunburstTheme = {}));
    var sunburstTheme = ejSunburstChart.sunburstTheme;
    (function (sunburstHighlightType) {
        sunburstHighlightType[sunburstHighlightType["opacity"] = "opacity"] = "opacity";
        sunburstHighlightType[sunburstHighlightType["color"] = "color"] = "color";
    })(ejSunburstChart.sunburstHighlightType || (ejSunburstChart.sunburstHighlightType = {}));
    var sunburstHighlightType = ejSunburstChart.sunburstHighlightType;
    (function (sunburstAnimationType) {
        sunburstAnimationType[sunburstAnimationType["rotation"] = "rotation"] = "rotation";
        sunburstAnimationType[sunburstAnimationType["fadeIn"] = "fadeIn"] = "fadeIn";
    })(ejSunburstChart.sunburstAnimationType || (ejSunburstChart.sunburstAnimationType = {}));
    var sunburstAnimationType = ejSunburstChart.sunburstAnimationType;
    (function (sunburstSelectionType) {
        sunburstSelectionType[sunburstSelectionType["opacity"] = "opacity"] = "opacity";
        sunburstSelectionType[sunburstSelectionType["color"] = "color"] = "color";
    })(ejSunburstChart.sunburstSelectionType || (ejSunburstChart.sunburstSelectionType = {}));
    var sunburstSelectionType = ejSunburstChart.sunburstSelectionType;
    (function (sunburstLegendPosition) {
        sunburstLegendPosition[sunburstLegendPosition["top"] = "top"] = "top";
        sunburstLegendPosition[sunburstLegendPosition["bottom"] = "bottom"] = "bottom";
        sunburstLegendPosition[sunburstLegendPosition["left"] = "left"] = "left";
        sunburstLegendPosition[sunburstLegendPosition["right"] = "right"] = "right";
        sunburstLegendPosition[sunburstLegendPosition["float"] = "float"] = "float";
    })(ejSunburstChart.sunburstLegendPosition || (ejSunburstChart.sunburstLegendPosition = {}));
    var sunburstLegendPosition = ejSunburstChart.sunburstLegendPosition;
    (function (sunburstLegendClickAction) {
        sunburstLegendClickAction[sunburstLegendClickAction["none"] = "none"] = "none";
        sunburstLegendClickAction[sunburstLegendClickAction["toggleSegmentVisibility"] = "toggleSegmentVisibility"] = "toggleSegmentVisibility";
        sunburstLegendClickAction[sunburstLegendClickAction["toggleSegmentSelection"] = "toggleSegmentSelection"] = "toggleSegmentSelection";
    })(ejSunburstChart.sunburstLegendClickAction || (ejSunburstChart.sunburstLegendClickAction = {}));
    var sunburstLegendClickAction = ejSunburstChart.sunburstLegendClickAction;
    (function (sunburstAlignment) {
        sunburstAlignment[sunburstAlignment["near"] = "near"] = "near";
        sunburstAlignment[sunburstAlignment["far"] = "far"] = "far";
        sunburstAlignment[sunburstAlignment["center"] = "center"] = "center";
    })(ejSunburstChart.sunburstAlignment || (ejSunburstChart.sunburstAlignment = {}));
    var sunburstAlignment = ejSunburstChart.sunburstAlignment;
    (function (sunburstHighlightMode) {
        sunburstHighlightMode[sunburstHighlightMode["point"] = "point"] = "point";
        sunburstHighlightMode[sunburstHighlightMode["all"] = "all"] = "all";
        sunburstHighlightMode[sunburstHighlightMode["child"] = "child"] = "child";
        sunburstHighlightMode[sunburstHighlightMode["parent"] = "parent"] = "parent";
    })(ejSunburstChart.sunburstHighlightMode || (ejSunburstChart.sunburstHighlightMode = {}));
    var sunburstHighlightMode = ejSunburstChart.sunburstHighlightMode;
    (function (sunburstSelectionMode) {
        sunburstSelectionMode[sunburstSelectionMode["point"] = "point"] = "point";
        sunburstSelectionMode[sunburstSelectionMode["all"] = "all"] = "all";
        sunburstSelectionMode[sunburstSelectionMode["child"] = "child"] = "child";
        sunburstSelectionMode[sunburstSelectionMode["parent"] = "parent"] = "parent";
    })(ejSunburstChart.sunburstSelectionMode || (ejSunburstChart.sunburstSelectionMode = {}));
    var sunburstSelectionMode = ejSunburstChart.sunburstSelectionMode;
    (function (sunburstLabelOverflowMode) {
        sunburstLabelOverflowMode[sunburstLabelOverflowMode["trim"] = "trim"] = "trim";
        sunburstLabelOverflowMode[sunburstLabelOverflowMode["hide"] = "hide"] = "hide";
        sunburstLabelOverflowMode[sunburstLabelOverflowMode["none"] = "none"] = "none";
    })(ejSunburstChart.sunburstLabelOverflowMode || (ejSunburstChart.sunburstLabelOverflowMode = {}));
    var sunburstLabelOverflowMode = ejSunburstChart.sunburstLabelOverflowMode;
    (function (sunburstLabelRotationMode) {
        sunburstLabelRotationMode[sunburstLabelRotationMode["angle"] = "angle"] = "angle";
        sunburstLabelRotationMode[sunburstLabelRotationMode["normal"] = "normal"] = "normal";
    })(ejSunburstChart.sunburstLabelRotationMode || (ejSunburstChart.sunburstLabelRotationMode = {}));
    var sunburstLabelRotationMode = ejSunburstChart.sunburstLabelRotationMode;
    (function (titleAlignment) {
        titleAlignment[titleAlignment["center"] = "center"] = "center";
        titleAlignment[titleAlignment["near"] = "near"] = "near";
        titleAlignment[titleAlignment["far"] = "far"] = "far";
    })(ejSunburstChart.titleAlignment || (ejSunburstChart.titleAlignment = {}));
    var titleAlignment = ejSunburstChart.titleAlignment;
    (function ($) {
        var SunburstChart = (function (_super) {
            __extends(SunburstChart, _super);
            function SunburstChart(id, options) {
                _super.call(this);
                this.defaults = {
                    enableAnimation: false,
                    load: null,
                    preRender: null,
                    loaded: null,
                    dataLabelRendering: null,
                    titleRendering: null,
                    tooltipInitialize: null,
                    pointRegionClick: null,
                    drillDownClick: null,
                    drillDownBack: null,
                    drillDownReset: null,
                    pointRegionMouseMove: null,
                    legendItemRendering: null,
                    legendItemClick: null,
                    segmentRendering: null,
                    animationType: sunburstAnimationType.rotation,
                    palette: null,
                    opacity: 1,
                    valueMemberPath: null,
                    margin: { top: 10, bottom: 10, left: 10, right: 10 },
                    points: {
                        x: null,
                        y: null,
                        text: null,
                        fill: null
                    },
                    border: {
                        color: null,
                        width: 2
                    },
                    segmentBorder: {
                        color: null,
                        width: 2
                    },
                    startAngle: null,
                    endAngle: null,
                    dataSource: null,
                    isResponsive: true,
                    size: {
                        height: "",
                        width: ""
                    },
                    innerRadius: 0.4,
                    radius: 1,
                    tooltip: {
                        visible: false,
                        border: {
                            color: "#707070",
                            width: 1
                        },
                        fill: "#FFFFFF",
                        opacity: 0.95,
                        font: {
                            fontFamily: "Segoe UI",
                            fontStyle: "Normal",
                            fontWeight: "Regular",
                            color: "#707070",
                            opacity: 1,
                            size: "12px"
                        },
                        template: null,
                        format: "#point.x# : #point.y#",
                    },
                    dataLabelSettings: {
                        visible: false,
                        labelRotationMode: sunburstLabelRotationMode.angle,
                        font: {
                            fontFamily: "Segoe UI",
                            fontStyle: "Normal",
                            fontWeight: "Regular",
                            color: null,
                            opacity: 1,
                            size: "12px"
                        },
                        template: null,
                        fill: null,
                        labelOverflowMode: sunburstLabelOverflowMode.trim
                    },
                    title: {
                        text: "",
                        textAlignment: sunburstAlignment.center,
                        font: {
                            fontFamily: "Segoe UI",
                            fontWeight: "Regular",
                            fontStyle: "Normal",
                            color: null,
                            opacity: 1,
                            size: "20px"
                        },
                        subtitle: {
                            visible: true,
                            textAlignment: sunburstAlignment.far,
                            text: "",
                            font: {
                                fontFamily: "Segoe UI",
                                fontWeight: "Regular",
                                fontStyle: "Normal",
                                color: null,
                                opacity: 1,
                                size: "12px"
                            },
                        },
                        visible: true
                    },
                    zoomSettings: {
                        enable: false,
                        toolbarHorizontalAlignment: sunburstHorizontalAlignment.right,
                        toolbarVerticalAlignment: sunburstVerticalAlignment.top
                    },
                    highlightSettings: {
                        enable: false,
                        mode: sunburstHighlightMode.point,
                        opacity: 0.5,
                        color: "red",
                        type: sunburstHighlightType.opacity
                    },
                    selectionSettings: {
                        enable: false,
                        mode: sunburstSelectionMode.point,
                        opacity: 0.5,
                        color: "green",
                        type: sunburstSelectionType.opacity
                    },
                    levels: null,
                    legend: {
                        clickAction: sunburstLegendClickAction.toggleSegmentVisibility,
                        visible: false,
                        position: sunburstLegendPosition.bottom,
                        rowCount: null,
                        columnCount: null,
                        shape: sunburstLegendShape.circle,
                        alignment: sunburstAlignment.center,
                        title: {
                            font: {
                                fontFamily: "Segoe UI",
                                fontWeight: "Regular",
                                fontStyle: "Normal",
                                color: null,
                                opacity: 1,
                                size: "12px"
                            },
                            text: "",
                            textAlignment: sunburstAlignment.center,
                            visible: true
                        },
                        itemStyle: {
                            height: 7.5,
                            width: 7.5,
                        },
                        itemPadding: 10,
                        size: {
                            height: null,
                            width: null
                        },
                        border: {
                            color: null,
                            width: 1
                        },
                        font: {
                            fontFamily: "Segoe UI",
                            fontWeight: "Regular",
                            fontStyle: "Normal",
                            color: null,
                            opacity: 1,
                            size: "12px"
                        },
                        location: {
                            x: null,
                            y: null
                        },
                    },
                    theme: sunburstTheme.flatlight,
                    background: null
                };
                this.model = null;
                this.svgLink = "http://www.w3.org/2000/svg";
                this.elementSpacing = 10;
                this._id = null;
                this._legendHighlight = false;
                this.legendClicked = false;
                this._legendMaxWidth = 0;
                this._legendMaxHeight = 0;
                this._drillInnerRadius = [];
                this._drillOuterRadius = [];
                this.common = { data: null, cancel: false };
                this.legendPages = [];
                this.groupID = [];
                this.highlightgroupID = [];
                this.selectedgroupID = [];
                this.baseID = null;
                this._previousState = [];
                this._drillDownStartAngle = [];
                this._drillDownEndAngle = [];
                this._sunburstRedraw = false;
                this._isDoubleClickEvent = false;
                this.tapCount = 0;
                this.drilldownCount = 0;
                this.tapped = 0;
                this._points = [];
                this.visiblePoints = [];
                this.parentNames = [];
                this.levelNames = [];
                this.isResize = false;
                this.revAnimation = false;
                this.validTags = ['div'];
                this._id = id;
                if (!!options)
                    this.model = ejSunburstChart.compareExtend({}, options, this.defaults);
            }
            SunburstChart.prototype._destroy = function () {
                var container;
                container = document.getElementById(this.container.id);
                if (!this.isNullOrUndefined(container)) {
                    this.unBindEvents(this.parentElement);
                    this.unbindResizeEvents();
                    container.parentNode.removeChild(container);
                }
            };
            SunburstChart.prototype.unBindEvents = function (element) {
                var insideEvents = "", browserInfo = this.browserInfo(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove";
                insideEvents = touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                for (var event_1 = 0; event_1 < insideEvents.length; event_1++) {
                    element.removeEventListener(insideEvents[event_1], this.sunburstMousemove);
                    element.removeEventListener(touchStopEvent, this.sunburstLeave);
                }
                element.removeEventListener('mouseout', this.sunburstLeave);
                element.removeEventListener('dblclick', this.sunburstChartDoubleClick);
                element.removeEventListener('contextmenu', this.sunburstChartRightClick);
            };
            SunburstChart.prototype.unbindResizeEvents = function () {
                if (ej.isTouchDevice() && this._isOrientationSupported())
                    window.removeEventListener("orientationchange", this.sunBurstResize);
                else
                    window.removeEventListener('resize', this.sunBurstResize);
            };
            SunburstChart.prototype._setModel = function (options) {
                for (var prop in options) {
                    switch (prop) {
                        default:
                            ejSunburstChart.deepExtend(true, this.model, {}, options[prop]);
                    }
                }
                this.redraw();
            };
            SunburstChart.prototype.supportSVG = function () {
                return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg");
            };
            SunburstChart.prototype._init = function () {
                if (this.supportSVG()) {
                    var element = void 0, svgElement = void 0, commonLoadEventArgs = void 0, commonpreRenderEventArgs = void 0, commonLoadedEventArgs = void 0;
                    this._startAngle = this.model.startAngle;
                    this._endAngle = this.model.endAngle;
                    if (!this.isResize) {
                        this._enableAnimation = this.model.enableAnimation;
                        this._drillDownStartAngle = [];
                        this._drillDownEndAngle = [];
                        this._drillInnerRadius = [];
                        this._drillOuterRadius = [];
                    }
                    commonLoadEventArgs = $.extend({}, this.common);
                    this._trigger("load", commonLoadEventArgs);
                    this.parentElement = this.isNullOrUndefined(this.parentElement) ? document.getElementById(this._id) : this.parentElement;
                    svgElement = this.createSvg({ 'id': this._id + '_svg' });
                    this.container = svgElement;
                    this.parentElement.appendChild(svgElement);
                    this.setSvgsize(this.model.size, this._id);
                    if (this._sunburstRedraw == false)
                        this.bindEvents(this.parentElement);
                    if (!this.isResize) {
                        if (!this.isNullOrUndefined(this.model.dataSource) && this.model.dataSource.length > 0)
                            this.processDataSource(this.model.dataSource);
                        this.setColors(this.model.points);
                        this._previousState.push(this.model.points);
                        this.processData(this.model.points);
                    }
                    else
                        this.isResize = this.isResize ? false : true;
                    commonpreRenderEventArgs = $.extend({}, this.common);
                    commonpreRenderEventArgs['data'] = {};
                    this._trigger("preRender", commonpreRenderEventArgs);
                    this.drawSunburst(this.layerData);
                    if (this._isDrillDown)
                        this.drawToolbar(svgElement);
                    commonLoadedEventArgs = $.extend({}, this.common);
                    commonLoadedEventArgs['data'] = { model: this.model };
                    this._trigger("loaded", commonLoadedEventArgs);
                }
                else {
                    alert("Sunburst will not be support in IE version < 8");
                }
            };
            SunburstChart.prototype.drawSunburst = function (layerData) {
                var rect, titleEle, sunburst, datalabelEle, size, title = this.model.title, legend = this.model.legend, dataLabel = this.model.dataLabelSettings, enableAnimation = this.model.enableAnimation;
                rect = this.drawContainerRect();
                document.getElementById(this._id + '_svg').appendChild(rect);
                if (legend['visible'] && !this.legendClicked) {
                    this.calculateLegendBounds();
                }
                size = { width: this.width, height: this.height };
                if (title['text'] != "" && title['visible']) {
                    titleEle = this.drawTitle(title, size);
                    document.getElementById(this._id + '_svg').appendChild(titleEle);
                }
                this.areaBounds = this.calculateSize(size, title);
                sunburst = this.sunburstRender(layerData);
                document.getElementById(this._id + "_svg").appendChild(sunburst);
                if (this._enableAnimation) {
                    var endAngle = void 0, length_1;
                    this.groupingRegions(this.model.points);
                    if (this.animationRegions.length > 0) {
                        if (this.model.animationType == sunburstAnimationType.rotation) {
                            if (!this._isDrillDown)
                                this.rotateAnimation(this, this.animationRegions);
                            else
                                this.rotateDrillDownAnimation(this, this.animationRegions);
                        }
                        else {
                            if (this.totallayerCount > 1) {
                                length_1 = this.animationRegions[0].length;
                                endAngle = this.animationRegions[0][length_1 - 1]['endAngle'];
                            }
                            else {
                                length_1 = this.animationRegions.length;
                                endAngle = this.animationRegions[length_1 - 1][0]['endAngle'];
                            }
                            this.animateLayer(this, sunburst, this.animationRegions[0], 0, 0, endAngle);
                        }
                    }
                }
                if (dataLabel['visible']) {
                    datalabelEle = this.drawDatalabel(layerData);
                    if (dataLabel['template'] == null) {
                        if (this._enableAnimation)
                            datalabelEle.setAttribute('visibility', 'hidden');
                        document.getElementById(this._id + "_svg").appendChild(datalabelEle);
                    }
                    else {
                        if (this._enableAnimation)
                            document.getElementById(datalabelEle.id).style.visibility = 'hidden';
                    }
                    this.sunburstDoubleClick = this.sunburstDoubleClick.bind(this);
                    document.getElementById(datalabelEle.id).addEventListener('dblclick', this.sunburstDoubleClick, true);
                }
                if (legend['visible']) {
                    this.gLegendElement = this.createGroup({ id: this._id + "SunburstLegend" });
                    if (this.model.legendInitialize) {
                        var commonEventArgs = $.extend({}, this.common);
                        this._trigger("legendInitialize", commonEventArgs);
                    }
                    this.drawSunburstLegend();
                }
            };
            SunburstChart.prototype.animateLayer = function (sunburst, sunburstEle, layer, pointInd, layerInd, totalendAngle) {
                var startAngle = layer[pointInd]['startAngle'], endAngle = layer[pointInd]['endAngle'], totalDegree, point, layerNumber, layerIndex, pointIndex, end, result, radius, path, start = startAngle, elementId, opacityRatio, opacity = 0, frameCount = 50, ct;
                totalDegree = (endAngle - startAngle) / Math.ceil(((frameCount * (endAngle - startAngle)) / totalendAngle));
                opacityRatio = (sunburst.model.opacity / 2) / Math.ceil(((frameCount * (endAngle - startAngle)) / totalendAngle));
                point = layer[pointInd];
                this.layerAnimate = setInterval(function () {
                    layerNumber = point['layerNumber'];
                    layerIndex = point['layerIndex'];
                    pointIndex = point['pointIndex'];
                    radius = sunburst.circularRadius[layerNumber - 1];
                    elementId = point['id'];
                    start = start + totalDegree;
                    end = start;
                    point['endAngle'] = end > endAngle ? endAngle : end;
                    if (sunburst.isNullOrUndefined(sunburst.model))
                        clearInterval(sunburst.layerAnimate);
                    else {
                        result = sunburst.calculateArcData(point, layerNumber, radius);
                        path = sunburstEle.querySelector('#' + elementId);
                        opacity += opacityRatio;
                        if (path) {
                            path.setAttribute('d', result['Direction']);
                            path.setAttribute('opacity', opacity.toString());
                        }
                        if (document.getElementById(elementId).getAttribute('visibility') == 'hidden') {
                            document.getElementById(elementId).setAttribute('visibility', 'visible');
                        }
                        if (end >= endAngle) {
                            clearInterval(sunburst.layerAnimate);
                            sunburst.fadeIn(path, opacity, sunburst, opacityRatio);
                            pointInd = pointInd + 1;
                            if (pointInd < layer.length) {
                                sunburst.animateLayer(sunburst, sunburstEle, layer, pointInd, layerInd, totalendAngle);
                            }
                            else {
                                pointInd = 0;
                                layerInd = layerInd + 1;
                                if (layerInd < sunburst.animationRegions.length)
                                    sunburst.animateLayer(sunburst, sunburstEle, sunburst.animationRegions[layerInd], pointInd, layerInd, totalendAngle);
                                else {
                                    if (sunburst.model.dataLabelSettings.visible)
                                        document.getElementById(sunburst._id + "_svg_DataLabelGroup").style.visibility = "visible";
                                }
                            }
                        }
                    }
                }, 10);
            };
            SunburstChart.prototype.fadeIn = function (path, opacity, sunburst, opacityRatio) {
                var fadeIn = setInterval(function () {
                    opacity = opacity + 0.1;
                    path.setAttribute('opacity', opacity.toString());
                    if (sunburst.model == null || opacity >= sunburst.model.opacity)
                        clearInterval(fadeIn);
                }, 50);
            };
            SunburstChart.prototype.rotateAnimation = function (sunburst, region) {
                var length = region.length, start = 0, end = 0, existingGroup, currentGroupPath, endAngle, startAngle, svg, scaleX = 0, transX, transY, angleDiff, scaleIncr, increaseAngle = 0;
                svg = document.getElementById(sunburst._id + "_svg");
                startAngle = sunburst.model.startAngle || 0;
                endAngle = sunburst.model.endAngle || 360;
                angleDiff = Math.abs(endAngle - startAngle);
                scaleIncr = 1 / (angleDiff / 10);
                end = (20 / 360) * angleDiff + startAngle;
                if (length > 0) {
                    this.rotateAnimate = setInterval(function () {
                        if (sunburst.model) {
                            existingGroup = document.getElementById(sunburst._id + "_svg_SunBurstElementGroup");
                            if (existingGroup != null)
                                existingGroup.parentNode.removeChild(existingGroup);
                            sunburst.model.startAngle = startAngle;
                            sunburst.model.endAngle = end > endAngle ? endAngle : end;
                            sunburst._enableAnimation = false;
                            currentGroupPath = sunburst.sunburstRender(sunburst.layerData);
                            svg.appendChild(currentGroupPath);
                            scaleX = scaleX + scaleIncr;
                            scaleX = scaleX > 1 ? 1 : scaleX;
                            transX = (sunburst.width / 2) * (1 - scaleX);
                            transY = (sunburst.height / 2) * (1 - scaleX);
                            currentGroupPath.setAttribute("transform", "translate(" + transX + "," + transY + ") scale(" + scaleX + ")");
                            if (end >= endAngle) {
                                clearInterval(sunburst.rotateAnimate);
                                sunburst.rotateAnimate = undefined;
                                sunburst._enableAnimation = true;
                                sunburst.model.startAngle = startAngle;
                                sunburst.model.endAngle = endAngle;
                                if (sunburst.model.dataLabelSettings.visible) {
                                    var dataLabel = document.getElementById(sunburst._id + "_svg_DataLabelGroup"), opacity = 0.1;
                                    if (sunburst.model.dataLabelSettings.template == null)
                                        document.getElementById(sunburst._id + "_svg").appendChild(dataLabel);
                                    else
                                        document.getElementById(sunburst._id).appendChild(dataLabel);
                                    dataLabel.style.visibility = "visible";
                                    dataLabel.style.opacity = opacity.toString();
                                    sunburst.dLAnimate = setInterval(function () {
                                        dataLabel.style.opacity = opacity.toString();
                                        opacity = opacity + 0.05;
                                        if (opacity > 1)
                                            clearInterval(sunburst.dLAnimate);
                                    }, 10);
                                }
                            }
                            end = end + (10 - increaseAngle);
                            increaseAngle = increaseAngle + 0.1;
                            scaleIncr = 1 / (angleDiff / 10 - increaseAngle);
                        }
                        else
                            clearInterval(sunburst.rotateAnimate);
                    }, 25);
                }
            };
            SunburstChart.prototype.rotateDrillDownAnimation = function (sunburst, region) {
                var length = region.length, start = 0, end = 0, existingGroup, currentGroupPath, endAngle, startAngle, svg, increaseAngle = 0, animationStartAngle = 0, increaseStartAngle, increaseEndAngle, interval = 1, increaseInterval = 0.05, animationEndAngle = 0;
                svg = document.getElementById(sunburst._id + "_svg");
                startAngle = sunburst.model.startAngle || 0;
                endAngle = sunburst.model.endAngle || 360;
                start = animationStartAngle = sunburst._drillDownStartAngle[sunburst.drilldownCount - 1];
                end = animationEndAngle = sunburst._drillDownEndAngle[sunburst.drilldownCount - 1];
                increaseStartAngle = (start - startAngle) / 20;
                increaseEndAngle = (endAngle - end) / 20;
                if (length > 0) {
                    var animate_1 = setInterval(function () {
                        existingGroup = document.getElementById(sunburst._id + "_svg_SunBurstElementGroup");
                        existingGroup.parentNode.removeChild(existingGroup);
                        sunburst.model.startAngle = animationStartAngle < startAngle ? startAngle : animationStartAngle;
                        sunburst.model.endAngle = animationEndAngle > endAngle ? endAngle : animationEndAngle;
                        sunburst._enableAnimation = false;
                        currentGroupPath = sunburst.sunburstRender(sunburst.layerData);
                        svg.appendChild(currentGroupPath);
                        if (animationStartAngle <= startAngle && animationEndAngle >= endAngle) {
                            clearInterval(animate_1);
                            sunburst._enableAnimation = true;
                            sunburst.model.startAngle = startAngle;
                            sunburst.model.endAngle = endAngle;
                            if (sunburst.model.dataLabelSettings.visible) {
                                var dataLabel = document.getElementById(sunburst._id + "_svg_DataLabelGroup"), opacity = 0.1;
                                if (sunburst.model.dataLabelSettings.template == null)
                                    document.getElementById(sunburst._id + "_svg").appendChild(dataLabel);
                                else
                                    document.getElementById(sunburst._id).appendChild(dataLabel);
                                dataLabel.style.visibility = "visible";
                                dataLabel.style.opacity = opacity.toString();
                                var dataLabelAnimate_1 = setInterval(function () {
                                    dataLabel.style.opacity = opacity.toString();
                                    opacity = opacity + 0.05;
                                    if (opacity > 1)
                                        clearInterval(dataLabelAnimate_1);
                                }, 10);
                            }
                        }
                        interval = interval + (1 - increaseInterval);
                        increaseInterval = increaseInterval + 0.015;
                        increaseInterval = increaseInterval > 0.7 ? 0.7 : increaseInterval;
                        animationStartAngle = start - (increaseStartAngle * interval);
                        animationEndAngle = end + (increaseEndAngle * interval);
                    }, 25);
                }
            };
            SunburstChart.prototype.groupingRegions = function (points) {
                var regions = this.sunburstRegions, elements, layer, parentRegion = this.sunburstRegions[this.sunburstRegions.length - 1]['region'], layerData, layerNumber, layers = [], groupNumber;
                this.animationRegions = [];
                layers.push(parentRegion);
                for (var i = 0; i < parentRegion.length; i++) {
                    if (regions.length > 1) {
                        elements = [];
                        layer = this.layerData[parentRegion[i]['layerIndex']]['point'][parentRegion[i]['pointIndex']];
                        groupNumber = layer['groupNumber'];
                        if (!this.isNullOrUndefined(layer['point'])) {
                            this.findChildRegions(layer['point'], elements, layer['layerNumber'], layers, groupNumber);
                        }
                        if (this.model.animationType == sunburstAnimationType.rotation) {
                            elements.splice(0, 0, layer);
                            layer['count'] = 0;
                            layer['groupLength'] = elements.length;
                            this.animationRegions.push(elements);
                        }
                        else {
                            this.animationRegions = layers;
                        }
                    }
                    else {
                        elements = [];
                        elements.push(parentRegion[i]);
                        this.animationRegions.push(elements);
                    }
                }
            };
            SunburstChart.prototype.findChildRegions = function (layer, elements, layerNumber, layers, groupNumber) {
                for (var i = 0; i < layer['length']; i++) {
                    layer[i]['pointIndex'] = i;
                    layer[i]['layerNumber'] = this.layerData[layer['layerData']]['layerNumber'];
                    layer[i]['groupNumber'] = groupNumber;
                    layer[i]['count'] = 0;
                    if (this.model.animationType == sunburstAnimationType.rotation)
                        elements.push(layer[i]);
                    else {
                        if (this.isNullOrUndefined(layers[layer[i]['layerNumber'] - 1]))
                            layers[layer[i]['layerNumber'] - 1] = [];
                        layers[layer[i]['layerNumber'] - 1].push(layer[i]);
                    }
                    if (!this.isNullOrUndefined(layer[i]['point'])) {
                        this.findChildRegions(layer[i]['point'], elements, layerNumber, layers, groupNumber);
                    }
                }
            };
            SunburstChart.prototype.bindEvents = function (element) {
                var insideEvents = "", mouseMove = "", browserInfo = this.browserInfo(), isDevice = ej.isDevice(), isPointer = browserInfo.isMSPointerEnabled, isIE11Pointer = browserInfo.pointerEnabled, touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : "touchend mouseup", touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : "touchmove mousemove";
                insideEvents = touchMoveEvent;
                insideEvents = insideEvents.split(" ");
                this.sunburstMousemove = this.sunburstMousemove.bind(this);
                this.sunburstClick = this.sunburstClick.bind(this);
                this.sunburstChartDoubleClick = this.sunburstChartDoubleClick.bind(this);
                this.sunburstChartRightClick = this.sunburstChartRightClick.bind(this);
                element.addEventListener('click', this.sunburstClick, true);
                this.sunburstLeave = this.sunburstLeave.bind(this);
                for (var event_2 = 0; event_2 < insideEvents.length; event_2++) {
                    element.addEventListener(touchStopEvent, this.sunburstLeave);
                    mouseMove = insideEvents[event_2];
                    if (isDevice && mouseMove == "mousemove")
                        continue;
                    element.addEventListener(mouseMove, this.sunburstMousemove);
                }
                if (isDevice)
                    element.addEventListener("mousedown", this.sunburstMousemove);
                element.addEventListener('mouseout', this.sunburstLeave, true);
                if (this.getIEversion() != -1) {
                    this.sunburstDoubletap = this.sunburstDoubletap.bind(this);
                    element.addEventListener('pointerdown', this.sunburstDoubletap, true);
                }
                if (this.model.isResponsive)
                    this.bindResizeEvents();
                element.addEventListener("dblclick", this.sunburstChartDoubleClick, true);
                element.addEventListener("contextmenu", this.sunburstChartRightClick, true);
            };
            SunburstChart.prototype.browserInfo = function () {
                var browser = {}, clientInfo = [], browserClients = {
                    webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie) ([\w.]+)/i,
                    opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
                };
                for (var client in browserClients) {
                    if (browserClients.hasOwnProperty(client)) {
                        clientInfo = navigator.userAgent.match(browserClients[client]);
                        if (clientInfo) {
                            browser.name = clientInfo[1].toLowerCase();
                            browser.version = clientInfo[2];
                            if (!!navigator.userAgent.match(/Trident\/7\./)) {
                                browser.name = "msie";
                            }
                            break;
                        }
                    }
                }
                browser.isMSPointerEnabled = (browser.name == 'msie') && browser.version > 9 && window.navigator.msPointerEnabled;
                browser.pointerEnabled = window.navigator.pointerEnabled;
                return browser;
            };
            SunburstChart.prototype.sunburstChartDoubleClick = function (event) {
                if (this.model.doubleClick != '') {
                    var commonEventArgs = $.extend({}, this.common);
                    commonEventArgs.model = this.model;
                    commonEventArgs['event'] = event;
                    this._trigger("doubleClick", commonEventArgs);
                }
            };
            SunburstChart.prototype.sunburstChartRightClick = function (event) {
                if (this.model.rightClick != '') {
                    var commonEventArgs = $.extend({}, this.common);
                    commonEventArgs.model = this.model;
                    commonEventArgs['event'] = event;
                    this._trigger("rightClick", commonEventArgs);
                }
            };
            SunburstChart.prototype.sunburstDoubletap = function (event) {
                var targetid = event.target['id'], totalnum;
                if (targetid.indexOf("reset") == -1 && targetid.indexOf("back") == -1) {
                    event.preventDefault();
                    this.tapped = this.tapped + 1;
                    totalnum = this.tapped;
                }
            };
            SunburstChart.prototype.bindResizeEvents = function () {
                this.sunBurstResize = this.sunBurstResize.bind(this);
                if (ej.isTouchDevice() && this._isOrientationSupported())
                    window.addEventListener("orientationchange", this.sunBurstResize, true);
                else
                    window.addEventListener('resize', this.sunBurstResize.bind(this), true);
            };
            SunburstChart.prototype._isOrientationSupported = function () {
                return ("orientation" in window && "onorientationchange" in window);
            };
            SunburstChart.prototype.sunBurstResize = function (element) {
                var sunburst = this;
                var $svgObj = $(sunburst.container);
                if (this._resizeTO)
                    clearTimeout(this._resizeTO);
                this._resizeTO = setTimeout(function () {
                    if (sunburst.model) {
                        sunburst.isResize = true;
                        if (!sunburst.isNullOrUndefined(document.getElementById(sunburst._id + 'reset'))) {
                            sunburst._isDrillDown = true;
                        }
                        sunburst.legendClicked = true;
                        sunburst._enableAnimation = false;
                        sunburst.redraw();
                        sunburst._enableAnimation = sunburst.model.enableAnimation;
                        sunburst._isDrillDown = false;
                        sunburst.legendClicked = false;
                    }
                }, 500);
            };
            SunburstChart.prototype.getIEversion = function () {
                var rv = -1, ua, re;
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    ua = navigator.userAgent;
                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                        rv = parseFloat(RegExp.$1);
                }
                else if (navigator.appName == 'Netscape') {
                    ua = navigator.userAgent;
                    re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                        rv = parseFloat(RegExp.$1);
                }
                return rv;
            };
            SunburstChart.prototype.sunburstDoubleClick = function (event) {
                var data;
                if (this.model.zoomSettings.enable) {
                    data = this.getSunburstPoint(event);
                    if (!this.isNullOrUndefined(data)) {
                        if (data['pointData'][0]['layerNumber'] == 1) {
                            if (this.drilldownCount == 0) {
                                this.drillDown(data);
                            }
                        }
                        else {
                            this.drillDown(data);
                        }
                    }
                }
            };
            SunburstChart.prototype.drillDown = function (data) {
                var layer, point = [], option, drillDownData, element, commonEventArgs, svgElement;
                element = document.getElementById(this._id + '_svg');
                element.parentNode.replaceChild(element.cloneNode(false), element);
                layer = this.layerData[data.pointData[0].layerIndex]['point'][data.pointData[0].pointIndex];
                this.drilldownCount = this.drilldownCount + 1;
                this._drillDownStartAngle.push((layer['startAngle'] * 180) / Math.PI);
                this._drillDownEndAngle.push((layer['endAngle'] * 180) / Math.PI);
                this._isDrillDown = true;
                this._isDoubleClickEvent = true;
                if (this.model.enableAnimation && this.model.animationType == sunburstAnimationType.rotation) {
                    var layerNumber = data.pointData[0].layerNumber;
                    if (layerNumber == 1) {
                        this._drillInnerRadius.push(this.innerRadius);
                        this._drillOuterRadius.push(this.circularRadius);
                    }
                    else {
                        var inRadius = this.innerRadius.slice(layerNumber - 1, this.innerRadius.length);
                        var outrRadius = this.circularRadius.slice(layerNumber - 1, this.circularRadius.length);
                        this._drillInnerRadius.push(inRadius);
                        this._drillOuterRadius.push(outrRadius);
                    }
                }
                if (!this.isNullOrUndefined(this.model.dataSource))
                    drillDownData = { 'fill': data['pointData'][0].fill, 'x': data['pointData'][0].x, 'parentChildName': data['pointData'][0].parentChildName, 'y': data['pointData'][0].y, 'point': layer['point'], 'text': data['pointData'][0].text };
                else
                    drillDownData = { 'fill': data['pointData'][0].fill, 'x': data['pointData'][0].x, 'y': data['pointData'][0].y, 'point': layer['point'], 'text': data['pointData'][0].text };
                if (this.model.drillDownClick) {
                    commonEventArgs = $.extend({}, this.common);
                    commonEventArgs['data'] = drillDownData;
                    this._trigger("drillDownClick", commonEventArgs);
                }
                point.push(drillDownData);
                this._previousState.push(point);
                this.processData(point);
                this.drawSunburst(this.layerData);
                this._isDrillDown = false;
                if (this.isNullOrUndefined(document.getElementById(this._id + 'reset'))) {
                    svgElement = document.getElementById(this._id + '_svg');
                    this.drawToolbar(svgElement);
                }
            };
            SunburstChart.prototype.drawToolbar = function (svgElement) {
                var backGroup, resetGroup, svgBounds;
                svgBounds = svgElement.getBoundingClientRect();
                resetGroup = this.drawResetButton(svgBounds);
                svgElement.appendChild(resetGroup);
                this.reset = this.reset.bind(this);
                document.getElementById(this._id + "reset").addEventListener('click', this.reset, true);
                backGroup = this.drawBackButton(svgBounds);
                svgElement.appendChild(backGroup);
                this.back = this.back.bind(this);
                document.getElementById(this._id + "back").addEventListener('click', this.back, true);
                if (!ej.isDevice()) {
                    document.getElementById(this._id + "back").addEventListener('mousemove', this.sunburstMousemove, true);
                    document.getElementById(this._id + "reset").addEventListener('mousemove', this.sunburstMousemove, true);
                }
                this.toolbarPositioning(backGroup, resetGroup);
            };
            SunburstChart.prototype.toolbarPositioning = function (backGroup, resetGroup) {
                var translate, resettransX, backtransX, transY, resetOptions, backOptions, elementSpacing = this.elementSpacing, tbhorizontalalignment = this.model.zoomSettings.toolbarHorizontalAlignment, tbverticalalignment = this.model.zoomSettings.toolbarVerticalAlignment;
                backOptions = backGroup.getBoundingClientRect();
                resetOptions = resetGroup.getBoundingClientRect();
                if (tbhorizontalalignment == sunburstHorizontalAlignment.right) {
                    resettransX = this.width - elementSpacing - resetOptions['width'];
                    backtransX = this.width - (2 * elementSpacing) - (2 * resetOptions['width']);
                }
                else if (tbhorizontalalignment == sunburstHorizontalAlignment.left) {
                    backtransX = elementSpacing;
                    resettransX = (backOptions['width']) + (2 * elementSpacing);
                }
                else if (tbhorizontalalignment == sunburstHorizontalAlignment.center) {
                    backtransX = (this.width / 2) - ((backOptions['width'] + elementSpacing + resetOptions['width']) / 2);
                    resettransX = backtransX + elementSpacing + backOptions['width'];
                }
                if (tbverticalalignment == sunburstVerticalAlignment.top) {
                    transY = elementSpacing;
                }
                else if (tbverticalalignment == sunburstVerticalAlignment.bottom) {
                    transY = this.height - elementSpacing - backOptions['height'];
                }
                else if (tbverticalalignment == sunburstVerticalAlignment.middle) {
                    transY = (this.height / 2) - (backOptions['height'] / 2);
                }
                translate = 'translate(' + resettransX.toString() + ',' + transY.toString() + ')';
                resetGroup.setAttribute('transform', translate);
                translate = 'translate(' + backtransX.toString() + ',' + transY.toString() + ')';
                backGroup.setAttribute('transform', translate);
            };
            SunburstChart.prototype.drawBackButton = function (rect) {
                var options, element, backGroup;
                backGroup = this.createGroup({ 'id': this._id + 'back' });
                options = {
                    'id': this._id + 'backPath',
                    'd': "M24,27H3c-1.7,0-3-1.3-3-3V3c0-1.7,1.3-3,3-3h21c1.7,0,3,1.3,3,3v21C27,25.7,25.7,27,24,27z",
                    'fill': '#D6D6D6',
                };
                element = this.drawPath(options);
                backGroup.appendChild(element);
                options = {
                    'id': this._id + 'backPath1',
                    'x': 7.7,
                    'y': 12.5,
                    'width': 13.8,
                    'height': 2,
                    'fill': "#5E5C5C"
                };
                element = this.drawRect(options);
                backGroup.appendChild(element);
                options = {
                    'id': this._id + 'backPath2',
                    'points': "11.4,19.8 5.5,13.5 11.4,7.2 12.9,8.6 8.2,13.5 12.9,18.4",
                    'fill': "#5E5C5C",
                };
                element = this.drawPolygon(options);
                backGroup.appendChild(element);
                return backGroup;
            };
            SunburstChart.prototype.back = function (event) {
                var layerData = this.layerData, element = document.getElementById(this._id + '_svg'), backEle = document.getElementById(this._id + "back"), resetEle = document.getElementById(this._id + "reset"), model = this.model, rootEle, commonDrillDownBackEventArgs;
                if (!this.revAnimation) {
                    if (model['drillDownBack']) {
                        commonDrillDownBackEventArgs = $.extend({}, this.common);
                        commonDrillDownBackEventArgs['data'] = layerData;
                        this._trigger("drillDownBack", commonDrillDownBackEventArgs);
                    }
                    if (this._enableAnimation && model['animationType'] == sunburstAnimationType.rotation) {
                        this._enableAnimation = false;
                        this.reverseAnimation(this, this.animationRegions);
                    }
                    else {
                        element.parentNode.replaceChild(element.cloneNode(false), element);
                        var len = this._previousState.length - 1;
                        this.layerData = this._previousState[len - 1];
                        this._previousState.splice(len, 1);
                        this.drilldownCount = this.drilldownCount - 1;
                        this.processData(this.layerData);
                        this.drawSunburst(this.layerData);
                        if (this.drilldownCount != 0) {
                            rootEle = document.getElementById(this._id + "_svg");
                            rootEle.appendChild(resetEle);
                            rootEle.appendChild(backEle);
                        }
                    }
                }
            };
            SunburstChart.prototype.reverseAnimation = function (sunburst, region) {
                var length = region.length, start = 0, end = 0, existingGroup, currentGroupPath, endAngle, startAngle, svg, sAngle, eAngle, increaseStartAngle, increaseEndAngle, interval = 0, dataLabel, backEle = document.getElementById(sunburst._id + "back"), resetEle = document.getElementById(sunburst._id + "reset"), pieSegmentGroup, tempLabel, len, container, opacity = 0.1;
                svg = document.getElementById(sunburst._id + "_svg");
                startAngle = sunburst.model.startAngle || 0;
                endAngle = sunburst.model.endAngle || 360;
                start = sunburst._drillDownStartAngle[sunburst.drilldownCount - 1], end = sunburst._drillDownEndAngle[sunburst.drilldownCount - 1];
                increaseStartAngle = (start - startAngle) / 20;
                increaseEndAngle = (endAngle - end) / 20;
                dataLabel = document.getElementById(sunburst._id + "_svg_DataLabelGroup");
                if (length > 0) {
                    var animate_2 = setInterval(function () {
                        sunburst.revAnimation = true;
                        existingGroup = document.getElementById(sunburst._id + "_svg_SunBurstElementGroup");
                        if (existingGroup)
                            existingGroup.parentNode.removeChild(existingGroup);
                        if (dataLabel)
                            dataLabel.style.visibility = "hidden";
                        sAngle = increaseStartAngle * interval + startAngle;
                        sunburst.model.startAngle = sAngle >= start ? start : sAngle;
                        eAngle = endAngle - (increaseEndAngle * interval);
                        sunburst.model.endAngle = eAngle < end ? end : eAngle;
                        currentGroupPath = sunburst.sunburstRender(sunburst.layerData);
                        svg.appendChild(currentGroupPath);
                        if (eAngle <= end && sAngle >= start) {
                            clearInterval(animate_2);
                            pieSegmentGroup = document.getElementById(sunburst._id + "_svg_SunBurstElementGroup");
                            pieSegmentGroup.id = sunburst._id + "_svg_tempSeg";
                            tempLabel = document.getElementById(sunburst._id + "_svg_DataLabelGroup");
                            svg.parentNode.replaceChild(svg.cloneNode(false), svg);
                            document.getElementById(sunburst._id + "_svg").appendChild(pieSegmentGroup);
                            if (tempLabel) {
                                tempLabel.id = sunburst._id + "_svg_tempLabel";
                                document.getElementById(sunburst._id + "_svg").appendChild(tempLabel);
                            }
                            len = sunburst._previousState.length - 1;
                            sunburst.layerData = sunburst._previousState[len - 1];
                            sunburst._previousState.splice(len, 1);
                            sunburst.model.startAngle = startAngle;
                            sunburst.model.endAngle = endAngle;
                            sunburst.drilldownCount = sunburst.drilldownCount - 1;
                            sunburst._drillDownStartAngle.length = sunburst.drilldownCount;
                            sunburst._drillDownEndAngle.length = sunburst.drilldownCount;
                            sunburst._drillInnerRadius.length = sunburst.drilldownCount;
                            sunburst._drillOuterRadius.length = sunburst.drilldownCount;
                            sunburst.processData(sunburst.layerData);
                            sunburst.drawSunburst(sunburst.layerData);
                            if (sunburst.drilldownCount != 0) {
                                svg = document.getElementById(sunburst._id + "_svg");
                                svg.appendChild(resetEle);
                                svg.appendChild(backEle);
                            }
                            sunburst._enableAnimation = true;
                            container = document.getElementById(sunburst._id + "_svg_SunBurstElementGroup");
                            container.style.opacity = opacity.toString();
                            if (dataLabel)
                                dataLabel.style.opacity = opacity.toString();
                            if (sunburst.model.dataLabelSettings.visible) {
                                dataLabel = document.getElementById(sunburst._id + "_svg_DataLabelGroup");
                                if (sunburst.model.dataLabelSettings.template == null)
                                    document.getElementById(sunburst._id + "_svg").appendChild(dataLabel);
                                else
                                    document.getElementById(sunburst._id).appendChild(dataLabel);
                                dataLabel.style.visibility = "visible";
                                dataLabel.style.opacity = opacity.toString();
                            }
                            var animateByOpacity_1 = setInterval(function () {
                                container.style.opacity = opacity.toString();
                                if (dataLabel)
                                    dataLabel.style.opacity = opacity.toString();
                                if (opacity >= 1) {
                                    clearInterval(animateByOpacity_1);
                                    sunburst.revAnimation = false;
                                    pieSegmentGroup.parentNode.removeChild(pieSegmentGroup);
                                    if (tempLabel)
                                        tempLabel.parentNode.removeChild(tempLabel);
                                }
                                opacity = opacity + 0.1;
                            }, 50);
                        }
                        interval = interval + 1;
                    }, 40);
                }
            };
            SunburstChart.prototype.drawResetButton = function (rect) {
                var options, path, resetGroup, polygon;
                resetGroup = this.createGroup({ 'id': this._id + 'reset' });
                options = {
                    'id': this._id + 'resetPath',
                    'd': "M24,27H3c-1.7,0-3-1.3-3-3V3c0-1.7,1.3-3,3-3h21c1.7,0,3,1.3,3,3v21C27,25.7,25.7,27,24,27z",
                    'fill': '#D6D6D6',
                };
                path = this.drawPath(options);
                resetGroup.appendChild(path);
                options = {
                    'id': this._id + 'resetPath1',
                    'd': "M13.6,21.9c-3.6,0-6.8-2.3-8-5.7l1.8-0.6c0.9,2.6,3.4,4.4,6.2,4.4c3.4,0,6.2-2.6,6.5-6l1.9,0.2   C21.6,18.6,18,21.9,13.6,21.9z",
                    'fill': "#5E5C5C"
                };
                path = this.drawPath(options);
                resetGroup.appendChild(path);
                options = {
                    'id': this._id + 'resetPath2',
                    'd': "M7.1,12.5l-1.9-0.3c0.6-4.1,4.2-7.1,8.3-7.1c3,0,5.8,1.6,7.3,4.2c0.1,0.2,0.2,0.4,0.3,0.6l-1.7,0.8   c-0.1-0.2-0.2-0.3-0.2-0.4c-1.2-2-3.3-3.3-5.7-3.3C10.4,7,7.6,9.3,7.1,12.5z",
                    'fill': "#5E5C5C"
                };
                path = this.drawPath(options);
                resetGroup.appendChild(path);
                options = {
                    'id': this._id + 'resetPath3',
                    'points': "21.4,11.9 16.2,10.7 16.6,8.9 19.9,9.6 20.7,6.3 22.5,6.7",
                    'fill': "#5E5C5C"
                };
                polygon = this.drawPolygon(options);
                resetGroup.appendChild(polygon);
                options = {
                    'id': this._id + 'resetPath4',
                    'points': "6.3,20.3 4.5,19.9 5.6,14.8 10.8,16 10.4,17.8 7.1,17.1",
                    'fill': "#5E5C5C"
                };
                polygon = this.drawPolygon(options);
                resetGroup.appendChild(polygon);
                return resetGroup;
            };
            SunburstChart.prototype.reset = function (event) {
                if (this.model.drillDownReset) {
                    var commonDrillDownResetEventArgs = $.extend({}, this.common);
                    this._trigger("drillDownReset", commonDrillDownResetEventArgs);
                }
                this.redraw();
            };
            SunburstChart.prototype.redraw = function () {
                this.legendPages = [];
                if (!this.isResize) {
                    this.drilldownCount = 0;
                    this._previousState = [];
                    this._drillDownStartAngle = [];
                    this._drillDownEndAngle = [];
                    this._drillInnerRadius = [];
                    this._drillOuterRadius = [];
                }
                this._sunburstRedraw = true;
                var element = document.getElementById(this._id + "_svg");
                if (!this.isNullOrUndefined(element)) {
                    element.parentNode.removeChild(element);
                    if (this.rotateAnimate || this.model.enableAnimation) {
                        this.stopAnimation();
                    }
                    this.parentElement = undefined;
                    this._init();
                    this._sunburstRedraw = false;
                }
            };
            SunburstChart.prototype.stopAnimation = function () {
                if (this.rotateAnimate) {
                    clearInterval(this.rotateAnimate);
                    if (!this.isResize)
                        this._enableAnimation = this.model.enableAnimation;
                    this.model.startAngle = this._startAngle;
                    this.model.endAngle = this._endAngle;
                    if (this.dLAnimate)
                        clearInterval(this.dLAnimate);
                }
                if (this.layerAnimate)
                    clearInterval(this.layerAnimate);
            };
            SunburstChart.prototype.sunburstMousemove = function (event) {
                var elementId = event.target.id, element, data, commonPointRegionMouseMoveEventArgs, transToolTipOptions, location, layerPoint, layer;
                if (elementId.indexOf('reset') != -1 || elementId.indexOf('back') != -1) {
                    this.toolbarTooltip(event, elementId);
                    if (elementId.indexOf('reset') != -1) {
                        element = document.getElementById(this._id + "reset");
                        for (var i = 0; i < 5; i++) {
                            if (i == 0)
                                document.getElementById(this._id + "resetPath").setAttribute("fill", "rgb(20, 185, 255)");
                            else
                                document.getElementById(this._id + "resetPath" + i.toString()).setAttribute("fill", "#FFFFFF");
                        }
                    }
                    else {
                        for (var i = 0; i < 3; i++) {
                            if (i == 0)
                                document.getElementById(this._id + "backPath").setAttribute("fill", "rgb(20, 185, 255)");
                            else
                                document.getElementById(this._id + "backPath" + i.toString()).setAttribute("fill", "#FFFFFF");
                        }
                    }
                }
                else {
                    if (document.getElementById(this._id + "toolbarTooltip") != null && document.getElementById(this._id + "toolbarTooltip").style.visibility != "hidden") {
                        document.getElementById(this._id + "toolbarTooltip").style.visibility = "hidden";
                        if (document.getElementById(this._id + "reset") != null && document.getElementById(this._id + "back") != null) {
                            for (var i = 0; i < 5; i++) {
                                if (i == 0) {
                                    document.getElementById(this._id + "resetPath").setAttribute("fill", "#D6D6D6");
                                }
                                else
                                    document.getElementById(this._id + "resetPath" + i.toString()).setAttribute("fill", "#5E5C5C");
                            }
                            for (var i = 0; i < 3; i++) {
                                if (i == 0) {
                                    document.getElementById(this._id + "backPath").setAttribute("fill", "#D6D6D6");
                                }
                                else
                                    document.getElementById(this._id + "backPath" + i.toString()).setAttribute("fill", "#5E5C5C");
                            }
                        }
                    }
                }
                data = this.getSunburstPoint(event);
                if (data != undefined && this.model.pointRegionMouseMove) {
                    commonPointRegionMouseMoveEventArgs = $.extend({}, this.common);
                    commonPointRegionMouseMoveEventArgs['data'] = data;
                    this._trigger("pointRegionMouseMove", commonPointRegionMouseMoveEventArgs);
                }
                if (!this.isNullOrUndefined(data) && this.model.tooltip.visible) {
                    transToolTipOptions = { 'id': this._id + '_ToolTip' };
                    this.gTransToolElement = this.createGroup(transToolTipOptions);
                    location = { X: (data['location'].x), Y: Math.abs(data['location'].y) };
                    for (var i = 0; i < this.layerData.length; i++) {
                        if (this.layerData[i]['layerNumber'] == data['pointData'][0].layerNumber) {
                            if (this.isNullOrUndefined(data['pointData'][0].parentName)) {
                                layer = this.layerData[0];
                                layerPoint = this.layerData[0]['point'][data['pointData'][0].pointIndex];
                            }
                            else {
                                if (this.layerData[i]['parentName'] == data['pointData'][0].parentName) {
                                    layer = this.layerData[i];
                                    layerPoint = this.layerData[i]['point'][data['pointData'][0].pointIndex];
                                }
                            }
                        }
                    }
                    if (this.model.tooltip.template) {
                        this.createTooltiptemplate(location, layerPoint, layer, data);
                    }
                    else {
                        this.showTooltip(location, layerPoint, layer, data);
                    }
                }
                else {
                    if (!this.isNullOrUndefined(document.getElementById(this._id + "_ToolTip"))) {
                        document.getElementById(this._id + "_ToolTip").style.visibility = "hidden";
                    }
                }
                if (this.model.highlightSettings.enable) {
                    var legendItem = void 0, highlightSettings = this.model.highlightSettings;
                    this.highlightSunburst(data);
                    if (!this.isNullOrUndefined(data) && this.model.legend.visible) {
                        for (var j = 0; j < this.model.points.length; j++) {
                            legendItem = document.getElementById(this._id + "_svg_LegendItemShape" + j);
                            if (highlightSettings['type'] == sunburstHighlightType.opacity) {
                                if (this.selectedGroupNumber - 1 != j) {
                                    if (data['pointData'][0].legendIndex != j) {
                                        if (!this.isNullOrUndefined(legendItem))
                                            legendItem.style.opacity = highlightSettings['opacity'].toString();
                                    }
                                }
                            }
                            else {
                                if (data['pointData'][0].legendIndex == j) {
                                    if (legendItem.getAttribute('class') != "SelectionStyleSunburst") {
                                        legendItem.setAttribute("class", "HighlightStyleSunburst");
                                        legendItem.style.opacity = highlightSettings['opacity'].toString();
                                    }
                                }
                                else {
                                    if (!this.isNullOrUndefined(legendItem) && !(legendItem.getAttribute("class") == "HighlightStyleSunburst"))
                                        legendItem.removeAttribute("class");
                                }
                            }
                        }
                    }
                }
                if (elementId.indexOf(this._id + "_svg_LegendItem") != -1 && this.model.legend.clickAction == sunburstLegendClickAction.toggleSegmentSelection) {
                    this.legendSegments(elementId);
                }
            };
            SunburstChart.prototype.legendSegments = function (elementid) {
                var legendId, legendIndex, legendSegment, childNodes, highlightOpacity, pieSegment, dataLabelGroup;
                legendId = elementid.replace(this._id + "_svg", "");
                legendIndex = parseInt(legendId.replace(/[^0-9\.]/g, ''));
                legendSegment = document.getElementById(this._id + "legendItem_Group");
                childNodes = legendSegment.childNodes;
                highlightOpacity = this.model.highlightSettings.opacity.toString();
                for (var l = 0; l < childNodes.length; l++) {
                    if (legendIndex != l)
                        document.getElementById(childNodes[l]['id']).style.opacity = highlightOpacity;
                    else
                        document.getElementById(childNodes[l]['id']).style.opacity = "1";
                }
                pieSegment = document.getElementById(this._id + '_svg_SunBurstElementGroup');
                childNodes = pieSegment.childNodes;
                for (var j = 0; j < childNodes.length; j++) {
                    if (childNodes[j]['id'].indexOf("_legendIndex" + legendIndex) == -1)
                        document.getElementById(childNodes[j]['id']).style.opacity = highlightOpacity;
                }
                if (this.model.dataLabelSettings.visible) {
                    dataLabelGroup = document.getElementById(this._id + '_svg_DataLabelGroup');
                    if (dataLabelGroup) {
                        childNodes = dataLabelGroup.childNodes;
                        for (var j = 0; j < childNodes.length; j++) {
                            if (childNodes[j]['id'].indexOf("_legendIndex" + legendIndex) == -1)
                                document.getElementById(childNodes[j]['id']).style.opacity = highlightOpacity;
                        }
                    }
                }
                this._legendHighlight = true;
            };
            SunburstChart.prototype.toolbarTooltip = function (event, elementid) {
                var tooltipdiv, rectoptions;
                if (elementid.indexOf("reset") != -1) {
                    elementid = 'Reset';
                }
                else
                    elementid = 'Back';
                rectoptions = {
                    'top': event['clientY'],
                    'left': event['clientX'],
                    'background-color': "white",
                    "border-style": "solid",
                    "position": "absolute",
                    "border-color": "#2F4F4F",
                    "border-width": "1px",
                    "opacity": 0.95,
                    'z-index': 1000000,
                    "border-radius": "0px 0px",
                    "padding-left": '5px',
                    "padding-right": '5px',
                    "padding-top": '2px',
                    "padding-bottom": '2px'
                };
                if (this.isNullOrUndefined(document.getElementById(this._id + "toolbarTooltip"))) {
                    tooltipdiv = document.createElement('div');
                    tooltipdiv.setAttribute('id', this._id + "toolbarTooltip");
                }
                else {
                    tooltipdiv = document.getElementById(this._id + "toolbarTooltip");
                }
                tooltipdiv['style'].pointerEvents = "none";
                this.setStyles(rectoptions, tooltipdiv);
                var textOptions = {
                    'top': event['clientY'],
                    'left': event['clientX'],
                    "color": this.model.tooltip.font.color,
                    'font-size': this.model.tooltip.font.size,
                    'font-family': this.model.tooltip.font.fontFamily,
                    'font-style': this.model.tooltip.font.fontStyle,
                    'font-weight': this.model.tooltip.font.fontWeight,
                    "align-self": "baseline"
                };
                this.setStyles(textOptions, tooltipdiv);
                if (this.isNullOrUndefined(document.getElementById(this._id + "toolbarTooltip"))) {
                    document.body.appendChild(tooltipdiv);
                }
                tooltipdiv.innerHTML = elementid;
                if (tooltipdiv['style'].visibility == "hidden") {
                    tooltipdiv['style'].visibility = "visible";
                }
                tooltipdiv['style'].left = (event['clientX'] + window.pageXOffset + 10).toString() + 'px';
                tooltipdiv['style'].top = (event['clientY'] + window.pageYOffset + 10).toString() + 'px';
            };
            SunburstChart.prototype.removeHighlight = function (ID) {
                for (var i = 0; i < ID.length && document.getElementById(ID[i]) != null; i++) {
                    if (document.getElementById(ID[i]).getAttribute('class') == "HighlightStyleSunburst")
                        document.getElementById(ID[i]).removeAttribute('class');
                }
            };
            SunburstChart.prototype.isSelectedElement = function (elementId, selectedgrpId) {
                var selected = false;
                for (var i = 0; i < selectedgrpId.length; i++) {
                    if (elementId == selectedgrpId[i])
                        selected = true;
                }
                return selected;
            };
            SunburstChart.prototype.highlightSunburst = function (pointObj) {
                var path = document.getElementsByTagName('path'), pointIndex, data = pointObj, highele, element, groupElements, baseid, highlightgroup, legendItem, legend = this.model.legend, highlightSettings = this.model.highlightSettings, points = this.model.points, selected;
                if (!this.isNullOrUndefined(data)) {
                    if (highlightSettings['mode'] == sunburstHighlightMode.point) {
                        if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                            highele = document.getElementsByClassName("HighlightStyleSunburst");
                            if (highlightSettings['mode'] == sunburstHighlightMode.point) {
                                if (highele.length > 0) {
                                    highele[0].removeAttribute('class');
                                }
                            }
                            element = document.getElementById(data['pointData'][0]['id']);
                            selected = this.isSelectedElement(element.id, this.selectedgroupID);
                            if (document.getElementById(element.id).getAttribute("class") == null && !selected)
                                this.createHighlightStyle(element, highlightSettings);
                            this.baseID = element.id;
                        }
                        else {
                            for (var j = 0; j < path.length; j++) {
                                if (this.selectedgroupID.indexOf(path[j].id) == -1)
                                    path[j].style.opacity = highlightSettings['opacity'].toString();
                            }
                            document.getElementById(data['pointData'][0]['id']).style.opacity = '1';
                        }
                    }
                    else if (highlightSettings['mode'] == sunburstHighlightMode.all) {
                        groupElements = this.findGroupElements(data);
                        baseid = this._id + '_legendIndex' + groupElements[0].legendIndex + '_layerNumber1_layerIndex0_pointIndex' + groupElements[0].pointIndex.toString();
                        if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                            highlightgroup = document.getElementsByClassName("HighlightStyleSunburst");
                            if (highlightgroup.length > 0) {
                                for (var k_1 = 0; k_1 < highlightgroup.length; k_1++) {
                                    this.highlightgroupID.push(highlightgroup[k_1].id);
                                    if (this.highlightgroupID[k_1].indexOf(this._id + "_svg_LegendItemShape") < 0)
                                        this.removeHighlight(this.highlightgroupID);
                                }
                            }
                            this.groupID = undefined;
                            this.highlightgroupID = [];
                            this.selelectedElementId = undefined;
                        }
                        this.highlightGroup(groupElements, data);
                        if (highlightSettings['type'] == sunburstHighlightType.opacity) {
                            for (var k = 0; k < path.length; k++) {
                                if (this.selectedgroupID.indexOf(path[k].id) == -1)
                                    path[k].style.opacity = highlightSettings['opacity'].toString();
                            }
                            for (var j = 0; j < this.highlightgroupID.length; j++) {
                                document.getElementById(this.highlightgroupID[j]).style.opacity = '1';
                            }
                        }
                    }
                    else if (highlightSettings['mode'] == sunburstHighlightMode.child) {
                        baseid = data['pointData'][0]['id'];
                        if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                            if (!this.isNullOrUndefined(this.highlightgroupID) && this.highlightgroupID.length > 0) {
                                this.removeHighlight(this.highlightgroupID);
                            }
                            this.highlightgroupID = [];
                            this.highlightedElementId = undefined;
                        }
                        this.highlightChild(data);
                        if (highlightSettings['type'] == sunburstHighlightType.opacity) {
                            for (var l = 0; l < path.length; l++) {
                                if (this.selectedgroupID.indexOf(path[l].id) == -1)
                                    path[l].style.opacity = highlightSettings['opacity'].toString();
                            }
                            for (var j = 0; j < this.highlightgroupID.length; j++) {
                                document.getElementById(this.highlightgroupID[j]).style.opacity = '1';
                            }
                            this.highlightedElementId = undefined;
                        }
                    }
                    else {
                        baseid = data['pointData'][0]['id'];
                        if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                            if (!this.isNullOrUndefined(this.groupID) && this.groupID.length > 0)
                                this.removeHighlight(this.groupID);
                            this.groupID = undefined;
                            this.selelectedElementId = undefined;
                        }
                        this.highlightParent(data);
                        if (highlightSettings['type'] == sunburstHighlightType.opacity) {
                            for (var m = 0; m < path.length; m++) {
                                if (this.selectedgroupID.indexOf(path[m].id) == -1)
                                    path[m].style.opacity = this.model.selectionSettings.opacity.toString();
                            }
                            for (var j = 0; j < this.groupID.length; j++) {
                                document.getElementById(this.groupID[j]).style.opacity = '1';
                            }
                        }
                    }
                }
                else {
                    if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                        if (highlightSettings['mode'] == sunburstHighlightMode.point) {
                            highele = document.getElementsByClassName("HighlightStyleSunburst");
                            if (highele.length > 0) {
                                highele[0].removeAttribute('class');
                                this.baseID = undefined;
                            }
                        }
                        else if (highlightSettings['mode'] == sunburstHighlightMode.all) {
                            if (!this.isNullOrUndefined(this.highlightgroupID)) {
                                for (var i = 0; i < this.highlightgroupID.length; i++) {
                                    if (document.getElementById(this.highlightgroupID[i]) != null && (document.getElementById(this.highlightgroupID[i]).getAttribute("class") == null || document.getElementById(this.highlightgroupID[i]).getAttribute("class") == "HighlightStyleSunburst"))
                                        document.getElementById(this.highlightgroupID[i]).removeAttribute('class');
                                }
                                this.groupID = undefined;
                                this.selelectedElementId = undefined;
                            }
                        }
                        else {
                            highele = document.getElementsByClassName('HighlightStyleSunburst');
                            if (highele.length > 0) {
                                for (var i_1 = 0; i_1 < highele.length; i_1++) {
                                    this.highlightgroupID.push(highele[i_1].id);
                                }
                                this.removeHighlight(this.highlightgroupID);
                                this.highlightgroupID = [];
                                this.highlightedElementId = null;
                            }
                        }
                    }
                    else {
                        for (var j = 0; j < path.length; j++) {
                            if (this.selectedgroupID.length == 0) {
                                if (this.selectedgroupID.indexOf(path[j].id) == -1) {
                                    path[j].style.opacity = '1';
                                }
                            }
                            else {
                                if (this.selectedgroupID.indexOf(path[j].id) == -1) {
                                    path[j].style.opacity = this.model.selectionSettings.opacity.toString();
                                }
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.highlightGroup = function (groupElement, data) {
                var element, highlightSettings = this.model.highlightSettings, selected = false;
                this.highlightgroupID = [];
                for (var i = 0; i < groupElement.length; i++) {
                    if ((groupElement[i].layerNumber == 1)) {
                        element = document.getElementById(this._id + '_legendIndex' + data.pointData[0].legendIndex + '_layerNumber1_layerIndex0_pointIndex' + groupElement[i].pointIndex.toString());
                        selected = this.isSelectedElement(element.id, this.selectedgroupID);
                        if (highlightSettings['type'] != sunburstHighlightType.opacity && (document.getElementById(element.id).getAttribute("class") == null) && !selected) {
                            this.createHighlightStyle(element, highlightSettings);
                            this.selelectedElementId = element.id;
                        }
                        this.highlightgroupID.push(element.id);
                    }
                    else {
                        for (var j = 0; j < groupElement[i].point.length; j++) {
                            if (groupElement[i].layerNumber != 1) {
                                element = document.getElementById(this._id + '_legendIndex' + data.pointData[0].legendIndex + '_layerNumber' + groupElement[i].layerNumber.toString() + '_layerIndex' + groupElement[i].layerIndex.toString() + '_pointIndex' + j.toString());
                                selected = this.isSelectedElement(element.id, this.selectedgroupID);
                                if (highlightSettings['type'] != sunburstHighlightType.opacity && (document.getElementById(element.id).getAttribute("class") == null) && !selected)
                                    this.createHighlightStyle(element, highlightSettings);
                                this.highlightgroupID.push(element.id);
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.highlightParent = function (data) {
                var element, style, baseid, highlightSettings = this.model.highlightSettings, selected = false, pointData = data.pointData[0];
                this.groupID = [];
                this.baseElement = [];
                this.baseElement.push(pointData);
                baseid = pointData['id'];
                if (!this.isNullOrUndefined(pointData.parentName)) {
                    this.findSelectionParent(pointData, pointData.legendIndex);
                }
                for (var i = 0; i < this.baseElement.length; i++) {
                    if (!document.getElementById("selectionSunburst")) {
                        element = document.getElementById(this._id + '_legendIndex' + pointData.legendIndex + '_layerNumber' + this.baseElement[i]['layerNumber'].toString() + '_layerIndex' + this.baseElement[i]['layerIndex'].toString() + '_pointIndex' + this.baseElement[i]['pointIndex']);
                        selected = this.isSelectedElement(element.id, this.selectedgroupID);
                        if (highlightSettings['type'] != sunburstHighlightType.opacity && !selected)
                            this.createHighlightStyle(element, highlightSettings);
                        this.groupID.push(element.id);
                        this.highlightgroupID.push(element.id);
                    }
                    else {
                        element = document.getElementById(this._id + '_legendIndex' + pointData.legendIndex + '_layerNumber' + this.baseElement[i]['layerNumber'].toString() + '_layerIndex' + this.baseElement[i]['layerIndex'].toString() + '_pointIndex' + this.baseElement[i]['pointIndex']);
                        selected = this.isSelectedElement(element.id, this.selectedgroupID);
                        if (highlightSettings['type'] != sunburstHighlightType.opacity && !selected)
                            this.createHighlightStyle(element, highlightSettings);
                        this.groupID.push(element.id);
                        this.highlightgroupID.push(element.id);
                    }
                }
            };
            SunburstChart.prototype.highlightChild = function (data) {
                var layer, baseid, highlightSettings = this.model.highlightSettings, layerNumber, childid, childele, selected = false;
                this.childrenElement = [];
                this.highlightgroupID = [];
                layer = this.layerData[data.pointData[0].layerIndex]['point'][data.pointData[0].pointIndex];
                baseid = data.pointData[0]['id'];
                var element = document.getElementById(baseid);
                selected = this.isSelectedElement(element.id, this.selectedgroupID);
                if (!layer['point'] && layer['layerIndex'] != 0 && !selected) {
                    if (highlightSettings['type'] != sunburstHighlightType.opacity) {
                        this.createHighlightStyle(element, highlightSettings);
                        this.highlightedElementId = baseid;
                    }
                    this.highlightgroupID.push(element.id);
                }
                else {
                    layerNumber = data.pointData[0].layerNumber;
                    if (!this.isNullOrUndefined(layer['point']))
                        this.findChild(layer, layerNumber);
                    if (highlightSettings['type'] != sunburstHighlightType.opacity && !selected)
                        this.createHighlightStyle(element, highlightSettings);
                    this.highlightgroupID.push(element.id);
                    this.highlightedElementId = baseid;
                    for (var i = 0; i < this.childrenElement.length; i++) {
                        if (this.childrenElement[i].layerNumber > data.pointData[0].layerNumber) {
                            for (var j = 0; j < this.childrenElement[i].length; j++) {
                                childid = this._id + '_legendIndex' + data.pointData[0].legendIndex + '_layerNumber' + this.childrenElement[i].layerNumber.toString() + '_layerIndex' + this.childrenElement[i].layerIndex + '_pointIndex' + j.toString();
                                childele = document.getElementById(childid);
                                selected = this.isSelectedElement(childid, this.selectedgroupID);
                                if (highlightSettings['type'] != sunburstHighlightType.opacity && !selected)
                                    this.createHighlightStyle(childele, highlightSettings);
                                this.highlightgroupID.push(childele.id);
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.createHighlightStyle = function (element, settings) {
                var style, fill, opacity;
                if (element.getAttribute('class') != "SelectionStyleSunburst") {
                    if (!document.getElementById("highlightSunburst")) {
                        style = document.createElement('style');
                        style.type = 'text/css';
                        fill = settings.color;
                        opacity = '1';
                        style.innerHTML = ' .HighlightStyleSunburst{ fill:' + fill + ';' + 'opacity:' + opacity + ';' + 'stroke:;stroke-width:1}';
                        style.setAttribute('id', "highlightSunburst");
                        document.body.appendChild(style);
                    }
                    element.setAttribute('class', 'HighlightStyleSunburst');
                }
            };
            SunburstChart.prototype.showTooltip = function (location, layerPoint, layer, data) {
                var padding = 7, tooltipText, tooltipdivRect, rectOptions, x, y, commonToolTipTextArgs, tooltip = this.model.tooltip;
                var svgEle = document.getElementById(this._id + "_svg"), scrlltop = window.pageYOffset, scrollleft = window.pageXOffset, rect = svgEle.getBoundingClientRect();
                x = location.X + (padding / 2) + scrollleft + rect['left'];
                y = location.Y - (3 * padding) + scrlltop + rect['top'];
                if (document.getElementById(this._id + "_ToolTip") == null) {
                    tooltipdivRect = document.createElement("div");
                    tooltipdivRect.id = this._id + "_ToolTip";
                    tooltipdivRect.style.pointerEvents = 'none';
                }
                else {
                    tooltipdivRect = document.getElementById(this._id + "_ToolTip");
                    tooltipdivRect.style.pointerEvents = 'none';
                }
                tooltipText = this.formatTooltip(data.pointData[0], tooltip['format']);
                commonToolTipTextArgs = $.extend({}, this.common);
                commonToolTipTextArgs['data'] = { pointIndex: data.pointData[0].pointIndex, currentText: tooltipText, Location: { x: x, Y: y } };
                this._trigger("tooltipInitialize", commonToolTipTextArgs);
                tooltipdivRect.innerHTML = commonToolTipTextArgs['data'].currentText;
                rectOptions = {
                    'top': commonToolTipTextArgs['data'].Location.X,
                    'left': commonToolTipTextArgs['data'].Location.Y,
                    'background-color': tooltip['fill'],
                    "border-style": "solid",
                    "position": "absolute",
                    "border-color": tooltip['border'].color,
                    "border-width": tooltip['border'].width + "px",
                    "opacity": tooltip['opacity'],
                    "z-index": 1000000,
                    "border-radius": "0px 0px",
                    "padding-left": '5px',
                    "padding-right": '5px',
                    "padding-top": '2px',
                    "padding-bottom": '2px'
                };
                this.setStyles(rectOptions, tooltipdivRect);
                var textOptions = {
                    'top': y,
                    'left': x,
                    "color": tooltip['font'].color,
                    'font-size': tooltip['font'].size,
                    'font-family': tooltip['font'].fontFamily,
                    'font-style': tooltip['font'].fontStyle,
                    'font-weight': tooltip['font'].fontWeight,
                    "align-self": "baseline"
                };
                this.setStyles(textOptions, tooltipdivRect);
                if (this.isNullOrUndefined(document.getElementById(this._id + "Tooltip"))) {
                    document.body.appendChild(tooltipdivRect);
                }
                if (tooltipdivRect.style.visibility == "hidden") {
                    tooltipdivRect.style.visibility = "visible";
                }
                tooltipdivRect.style.left = x.toString() + 'px';
                tooltipdivRect.style.top = y.toString() + 'px';
            };
            SunburstChart.prototype.formatTooltip = function (pointData, format) {
                var text = format;
                if (text.search("#point.x#") != -1) {
                    text = text.replace("#point.x#", pointData['x']);
                }
                if (text.search("#point.y#") != -1)
                    text = text.replace("#point.y#", pointData['y']);
                return text;
            };
            SunburstChart.prototype.setStyles = function (Options, element) {
                var properties = Object.keys(Options), temp;
                var values = properties.map(function (property) { return Options[property]; });
                for (var i = 0, len = properties.length; i < len; i++) {
                    temp = properties[i];
                    element.style[temp] = values[i];
                }
            };
            SunburstChart.prototype.createTooltiptemplate = function (location, layerPoint, layer, data) {
                var tooltipdiv = document.getElementById('tooltipDiv'), x, y, svgEle = document.getElementById(this._id + "_svg"), scrlltop = window.pageYOffset, padding = 10, scrollleft = window.pageXOffset, rect = svgEle.getBoundingClientRect();
                x = location['X'] + scrollleft + rect['left'] + padding;
                y = location['Y'] + scrlltop + rect['top'];
                if (this.isNullOrUndefined(tooltipdiv)) {
                    this.tooltipFirst = true;
                    tooltipdiv = document.createElement("div");
                    tooltipdiv.className = "tooltipDiv";
                    tooltipdiv.style.position = 'absolute';
                    tooltipdiv.style.zIndex = '13000';
                    tooltipdiv.style.display = 'block';
                    tooltipdiv.id = "tooltipDiv";
                    tooltipdiv.style.backgroundColor = "white";
                    document.body.appendChild(tooltipdiv);
                    this.clonenode = document.getElementById(this.model.tooltip.template).cloneNode(true);
                    this.clonenode['style'].display = 'block';
                    document.getElementById('tooltipDiv').innerHTML = '';
                    this.clonenode['innerHTML'] = this.parseTooltipTemplate(data.pointData[0], this.clonenode['innerHTML']);
                    document.getElementById('tooltipDiv').appendChild(this.clonenode);
                }
                else {
                    tooltipdiv.style.display = 'block';
                    this.tooltipFirst = false;
                    this.clonenode['innerHTML'] = this.parseTooltipTemplate(data.pointData[0], this.clonenode['innerHTML']);
                }
                document.getElementById('tooltipDiv').style.left = x.toString() + 'px';
                document.getElementById('tooltipDiv').style.top = y.toString() + 'px';
            };
            SunburstChart.prototype.parseTooltipTemplate = function (point, clonenode) {
                var clone = document.getElementById(this.model.tooltip.template).cloneNode(true);
                var text = clone.innerHTML;
                if (text.search('#point.x#') != -1) {
                    text = text.replace('#point.x#', point['x'].toString());
                }
                if (text.search('#point.y#') != -1) {
                    text = text.replace('#point.y#', point['y'].toString());
                }
                if (text.search('#point.text#') != -1) {
                    if (!this.isNullOrUndefined(point['text'])) {
                        text = text.replace('#point.text#', point['text'].toString());
                    }
                    else {
                        text = text.replace('#point.text#', point['y'].toString());
                    }
                }
                return text;
            };
            SunburstChart.prototype.bindClickEvent = function (event) {
                var data, commonPointClickEventArgs;
                data = this.getSunburstPoint(event);
                if (!this.isNullOrUndefined(data) && this.model.pointRegionClick) {
                    commonPointClickEventArgs = $.extend({}, this.common);
                    commonPointClickEventArgs['data'] = data;
                    this._trigger("pointRegionClick", commonPointClickEventArgs);
                }
                return data;
            };
            SunburstChart.prototype.sunburstClick = function (event) {
                var data = this.bindClickEvent(event), sunburst, doubleTapTimer, backTooltip, selectionSettings = this.model.selectionSettings, point, legendItem, end = new Date();
                if (this.model.click != null) {
                    var eventArgs = { model: this.model, event: event };
                    this._trigger("click", eventArgs);
                }
                if (ej.isTouchDevice() && this._doubleTapTimer != null && (end - this._doubleTapTimer) < 300)
                    this.sunburstChartDoubleClick(event);
                this._doubleTapTimer = end;
                if (selectionSettings['enable']) {
                    this.selectSunburst(data, event);
                    if (!this.isNullOrUndefined(data) && this.model.legend.visible) {
                        for (var i = 0; i < this.model.points.length; i++) {
                            legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + i);
                            if (!this.isNullOrUndefined(legendItem)) {
                                point = this.model.points[i];
                                if (selectionSettings['type'] == sunburstSelectionType.opacity) {
                                    if (data['pointData'][0].legendIndex != i) {
                                        legendItem.style.opacity = selectionSettings['opacity'].toString();
                                    }
                                }
                                else {
                                    if (this.selectedGroupNumber - 1 == i) {
                                        legendItem.setAttribute('class', 'SelectionStyleSunburst');
                                        legendItem.style.opacity = selectionSettings['opacity'].toString();
                                    }
                                    else {
                                        if (!(legendItem.getAttribute("class") == "SelectionStyleSunburst"))
                                            legendItem.removeAttribute("class");
                                    }
                                }
                            }
                        }
                    }
                }
                sunburst = this;
                sunburst.tapCount++;
                doubleTapTimer = setTimeout(function () {
                    if (sunburst.tapCount >= 2 && sunburst._isDoubleClickEvent == false) {
                        sunburst.sunburstDoubleClick(event);
                        sunburst._isDoubleClickEvent = false;
                    }
                    sunburst.tapCount = 0;
                }, 200);
                backTooltip = document.getElementById(sunburst._id + "toolbarTooltip");
                if (!sunburst.isNullOrUndefined(backTooltip)) {
                    backTooltip.parentNode.removeChild(backTooltip);
                }
            };
            SunburstChart.prototype.isTouch = function (evt) {
                var browserInfo, event;
                browserInfo = this.browserInfo();
                event = evt['originalEvent'] ? evt['originalEvent'] : evt;
                if ((event['pointerType'] == "touch") || (event['pointerType'] == 2) || (event.type.indexOf("touch") > -1))
                    return true;
                return false;
            };
            SunburstChart.prototype.sunburstLeave = function (event) {
                var sunburst = this, elementId = event.target.id, legendSegment, childNodes, legendIndex, sunburstSegment, legendItem, tooltipDiv, backTooltip;
                if (this._legendHighlight) {
                    legendSegment = document.getElementById(this._id + "legendItem_Group");
                    childNodes = legendSegment.childNodes;
                    for (var l = 0; l < childNodes.length; l++)
                        document.getElementById(childNodes[l]['id']).style.opacity = "1";
                    sunburstSegment = document.querySelectorAll("[id^=" + this._id + "_legendIndex]");
                    for (var j = 0; j < sunburstSegment.length; j++)
                        document.getElementById(sunburstSegment[j].id).style.opacity = "1";
                    this._legendHighlight = false;
                }
                if (this.model.legend.visible && this.model.highlightSettings.enable) {
                    for (var l = 0; l < this.model.points.length; l++) {
                        legendItem = document.getElementById(this._id + "_svg_LegendItemShape" + l);
                        if (legendItem != null) {
                            legendItem.style.opacity = "1";
                            legendItem.removeAttribute("class");
                        }
                    }
                }
                if (!this.isNullOrUndefined(document.getElementById(sunburst._id + "_ToolTip"))) {
                    if (ej.isTouchDevice() || this.isTouch(event)) {
                        var hideTooltip = setTimeout(function () {
                            document.getElementById(sunburst._id + "_ToolTip").style.visibility = "hidden";
                        }, 3000);
                    }
                    else if (elementId == sunburst._id + "_svg_svgRect") {
                        if (!this._hideTooltip)
                            clearTimeout(this._hideTooltip);
                        this._hideTooltip = setTimeout(function () {
                            document.getElementById(sunburst._id + "_ToolTip").style.visibility = "hidden";
                        }, 1000);
                    }
                }
                backTooltip = document.getElementById(sunburst._id + "toolbarTooltip");
                if (!sunburst.isNullOrUndefined(backTooltip)) {
                    backTooltip.parentNode.removeChild(backTooltip);
                }
                tooltipDiv = document.getElementById('tooltipDiv');
                if (!sunburst.isNullOrUndefined(tooltipDiv)) {
                    if (ej.isTouchDevice() || this.isTouch(event)) {
                        var hideTooltipTemplate = setTimeout(function () {
                            tooltipDiv.style.display = "none";
                        }, 3000);
                    }
                    else if (elementId == sunburst._id + "_svg_svgRect") {
                        if (!this._hideTooltipTemplate)
                            clearTimeout(this._hideTooltipTemplate);
                        this._hideTooltipTemplate = setTimeout(function () {
                            tooltipDiv.style.display = "none";
                        }, 1000);
                    }
                }
                if (elementId.indexOf(this._id + 'reset') != -1) {
                    for (var i = 0; i < 5; i++) {
                        if (i == 0)
                            document.getElementById(this._id + "resetPath").setAttribute("fill", "#D6D6D6");
                        else
                            document.getElementById(this._id + "resetPath" + i.toString()).setAttribute("fill", "#5E5C5C");
                    }
                }
                if (elementId.indexOf(this._id + 'back') != -1) {
                    for (var i = 0; i < 3; i++) {
                        if (i == 0)
                            document.getElementById(this._id + "backPath").setAttribute("fill", "#D6D6D6");
                        else
                            document.getElementById(this._id + "backPath" + i.toString()).setAttribute("fill", "#5E5C5C");
                    }
                }
            };
            SunburstChart.prototype.selectSunburst = function (data, event) {
                var element, selectedele, pointIndex, style, baseID, canvas, styleOptions, fill, highlighted, selected, selectionMode = this.model.selectionSettings.mode.toString(), path = document.getElementsByTagName('path'), mouseClickedElement, selectionOpacity = this.model.selectionSettings.opacity.toString(), selecttype = this.model.selectionSettings.type, legend = this.model.legend, points = this.model.points, legendItem, groupElements, selectedEle, highlightEle;
                if (!this.isNullOrUndefined(data)) {
                    if (this.selectedgroupID.length > 0)
                        this.removeSelection(this.selectedgroupID);
                    if (selectionMode == "point") {
                        this.selectedgroupID = [];
                        mouseClickedElement = event.target.id.replace('_layerIndex' + data.pointData[0].layerIndex.toString(), "");
                        if (sunburstSelectionType.opacity != selecttype) {
                            if (!this.isNullOrUndefined(this.highlightgroupID) && this.highlightgroupID.length > 0) {
                                this.removeHighlight(this.highlightgroupID);
                            }
                            element = document.getElementById(data.pointData[0]['id']);
                            if (element.getAttribute('class') == 'SelectionStyleSunburst') {
                                element.removeAttribute('class');
                                if (this.highlightgroupID.indexOf(element.id) != -1) {
                                    element.setAttribute('class', 'HighlightStyleSunburst');
                                }
                            }
                            else {
                                selectedEle = document.getElementsByClassName('SelectionStyleSunburst');
                                if (this.highlightgroupID.length > 0 && selectedEle.length > 0) {
                                    if (this.highlightgroupID.indexOf(selectedEle[0].id) != -1) {
                                        selectedEle[0].setAttribute('class', 'HighlightStyleSunburst');
                                    }
                                }
                                if (selectedEle.length > 0 && selectedEle[0].getAttribute('class') == "SelectionStyleSunburst")
                                    selectedEle[0].removeAttribute('class');
                                if (!this.isNullOrUndefined(this.highlightgroupID) && this.highlightgroupID.length > 0) {
                                    this.removeHighlight(this.highlightgroupID);
                                }
                                this.selectPointData(element);
                                this.selectedgroupID.push(element.id);
                            }
                        }
                        else {
                            if (this.mouseClickedElementId != mouseClickedElement) {
                                for (var i = 0; i < path.length; i++) {
                                    path[i].style.opacity = selectionOpacity;
                                }
                                document.getElementById(data.pointData[0]['id']).style.opacity = '1';
                                this.mouseClickedElementId = mouseClickedElement;
                                this.selectedgroupID.push(data.pointData[0]['id']);
                            }
                            else {
                                for (var j = 0; j < path.length; j++) {
                                    path[j].style.opacity = '1';
                                }
                                this.mouseClickedElementId = "";
                            }
                            this.selectedGroupNumber = data.pointData[0].groupNumber;
                        }
                        if (legend['visible'] && this.selectedgroupID.length > 0) {
                            for (var k = 0; k < points.length; k++) {
                                legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + k);
                                if (data.pointData[0].legendIndex != k) {
                                    if (legendItem != null) {
                                        legendItem.style.opacity = selectionOpacity;
                                        legendItem.removeAttribute("class");
                                    }
                                }
                                else {
                                    if (sunburstSelectionType.opacity == selecttype)
                                        legendItem.style.opacity = '1';
                                    else {
                                        legendItem.setAttribute("class", "SelectionStyleSunburst");
                                        legendItem.style.opacity = selectionOpacity;
                                    }
                                }
                            }
                        }
                        if (this.selectedgroupID.length == 0)
                            this.removeLegendSelection();
                    }
                    else if (selectionMode == "all") {
                        groupElements = this.findGroupElements(data);
                        baseID = data.pointData[0]['id'];
                        if (this.selectedgroupID.indexOf(baseID) == -1) {
                            if (this.selectedGroupNumber != groupElements[0]['groupNumber']) {
                                if (this.selectedgroupID.length > 0) {
                                    this.removeSelection(this.selectedgroupID);
                                }
                                this.selectGroup(groupElements, data);
                                this.selectedGroupNumber = groupElements[0]['groupNumber'];
                            }
                            else {
                                if (this.selectedgroupID.length > 0) {
                                    this.removeSelection(this.selectedgroupID);
                                }
                                this.selectedgroupID = [];
                                this.selectedGroupNumber = null;
                            }
                            if (sunburstSelectionType.opacity == selecttype) {
                                for (var i = 0; i < path.length; i++) {
                                    path[i].style.opacity = selectionOpacity;
                                }
                                for (var j = 0; j < this.selectedgroupID.length; j++) {
                                    document.getElementById(this.selectedgroupID[j]).style.opacity = '1';
                                }
                                this.isSelected = true;
                            }
                            if (legend['visible']) {
                                for (var k_2 = 0; k_2 < points.length; k_2++) {
                                    legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + k_2);
                                    if (legendItem != null) {
                                        legendItem.style.opacity = selectionOpacity;
                                        legendItem.removeAttribute("class");
                                    }
                                }
                                if (sunburstSelectionType.opacity != selecttype)
                                    document.getElementById(this._id + '_svg_LegendItemShape' + groupElements[0]['pointIndex'].toString()).setAttribute("class", "SelectionStyleSunburst");
                                else
                                    document.getElementById(this._id + '_svg_LegendItemShape' + groupElements[0]['pointIndex'].toString()).style.opacity = '1';
                            }
                        }
                        else {
                            if (this.selectedgroupID.length > 0) {
                                if (sunburstSelectionType.opacity != selecttype)
                                    this.removeSelection(this.selectedgroupID);
                                else {
                                    for (var i = 0; i < path.length; i++) {
                                        path[i].style.opacity = '1';
                                    }
                                }
                            }
                            this.isSelected = false;
                            this.selectedGroupNumber = null;
                            this.selectedgroupID = [];
                            this.baseID = '';
                            this.removeLegendSelection();
                        }
                    }
                    else if (selectionMode == "child") {
                        baseID = data.pointData[0]['id'];
                        if (this.selectedgroupID.indexOf(baseID) == -1) {
                            if (!this.isNullOrUndefined(this.selectedgroupID) && this.selectedgroupID.length > 0) {
                                this.removeSelection(this.selectedgroupID);
                            }
                            if (!this.isNullOrUndefined(this.highlightgroupID) && this.highlightgroupID.length > 0) {
                                this.removeHighlight(this.highlightgroupID);
                            }
                            this.selectedgroupID = [];
                            this.selelectedElementId = undefined;
                            this.selectchild(data);
                            if (sunburstSelectionType.opacity == selecttype) {
                                for (var i = 0; i < path.length; i++) {
                                    path[i].style.opacity = selectionOpacity;
                                }
                                for (var j = 0; j < this.selectedgroupID.length; j++) {
                                    document.getElementById(this.selectedgroupID[j]).style.opacity = '1';
                                }
                                this.isSelected = true;
                            }
                            this.selectedGroupNumber = data.pointData[0].groupNumber;
                            if (legend['visible']) {
                                for (var k = 0; k < points.length; k++) {
                                    legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + k);
                                    if (data.pointData[0].legendIndex != k) {
                                        if (legendItem != null) {
                                            legendItem.style.opacity = selectionOpacity;
                                            legendItem.removeAttribute("class");
                                        }
                                    }
                                    else {
                                        if (sunburstSelectionType.opacity == selecttype)
                                            legendItem.style.opacity = '1';
                                        else {
                                            legendItem.setAttribute("class", "SelectionStyleSunburst");
                                            legendItem.style.opacity = selectionOpacity;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            this.selectedgroupID = [];
                            this.selelectedElementId = this.baseID = '';
                            this.removeSegmentSelection(path, selecttype);
                            this.removeLegendSelection();
                            this.isSelected = false;
                            this.childrenElement = [];
                        }
                    }
                    else {
                        baseID = data.pointData[0]['id'];
                        if (this.selectedgroupID.indexOf(baseID) == -1) {
                            if (!this.isNullOrUndefined(this.groupNumber) && this.groupNumber != data.pointData[0].groupNumber)
                                this.removeSegmentSelection(path, this.model.selectionSettings.type);
                            else if (this.selectedgroupID.length > 0) {
                                this.removeSelection(this.selectedgroupID);
                                this.selectedgroupID = [];
                            }
                            if (!this.isNullOrUndefined(this.highlightgroupID) && this.highlightgroupID.length > 0) {
                                this.removeHighlight(this.highlightgroupID);
                            }
                            this.selectParent(data);
                            this.groupNumber = data.pointData[0].groupNumber;
                            if (sunburstSelectionType.opacity == selecttype) {
                                for (var i = 0; i < path.length; i++) {
                                    path[i].style.opacity = selectionOpacity;
                                }
                                for (var j = 0; j < this.selectedgroupID.length; j++) {
                                    document.getElementById(this.selectedgroupID[j]).style.opacity = '1';
                                }
                            }
                            this.selectedGroupNumber = data.pointData[0].groupNumber;
                            pointIndex = data.pointData[0].legendIndex;
                            if (legend['visible']) {
                                for (var k_3 = 0; k_3 < points.length; k_3++) {
                                    legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + k_3);
                                    if (legendItem != null) {
                                        legendItem.style.opacity = selectionOpacity;
                                        legendItem.removeAttribute("class");
                                    }
                                }
                                if (sunburstSelectionType.opacity != selecttype)
                                    document.getElementById(this._id + '_svg_LegendItemShape' + pointIndex.toString()).setAttribute("class", "SelectionStyleSunburst");
                                else
                                    document.getElementById(this._id + '_svg_LegendItemShape' + pointIndex.toString()).style.opacity = '1';
                            }
                        }
                        else {
                            this.selectedgroupID = [];
                            this.selelectedElementId = this.baseID = '';
                            this.removeSegmentSelection(path, this.model.selectionSettings.type);
                            this.removeLegendSelection();
                            this.baseElement = [];
                        }
                    }
                }
                else {
                    if (sunburstSelectionType.opacity != selecttype) {
                        if (selectionMode == "point") {
                            selectedEle = document.getElementsByClassName('SelectionStyleSunburst');
                            if (selectedEle.length > 0)
                                selectedEle[0].removeAttribute('class');
                        }
                        else {
                            if (this.selectedgroupID.length > 0) {
                                this.removeSelection(this.selectedgroupID);
                                this.selectedgroupID = [];
                                this.selectedGroupNumber = null;
                                if (selectionMode == "child")
                                    this.selelectedElementId = null;
                                if (selectionMode == "parent") {
                                    this.groupNumber = null;
                                }
                            }
                        }
                    }
                    else {
                        this.selectedgroupID = [];
                        for (var j = 0; j < path.length; j++) {
                            path[j].style.opacity = '1';
                        }
                        this.mouseClickedElementId = "";
                        this.selectedGroupNumber = null;
                    }
                    this.removeLegendSelection();
                }
            };
            SunburstChart.prototype.removeSegmentSelection = function (path, selectType) {
                for (var i = 0; i < path.length; i++) {
                    if (selectType == sunburstSelectionType.opacity)
                        path[i].style.opacity = "1";
                    else
                        path[i].removeAttribute('class');
                }
            };
            SunburstChart.prototype.removeLegendSelection = function () {
                var legendItem;
                if (this.model.legend.visible) {
                    for (var k = 0; k < this.model.points.length; k++) {
                        legendItem = document.getElementById(this._id + '_svg_LegendItemShape' + k);
                        if (legendItem != null) {
                            legendItem.style.opacity = "1";
                            legendItem.removeAttribute("class");
                        }
                    }
                }
            };
            SunburstChart.prototype.selectParent = function (data) {
                var element, style, lgndIndx, selectionSettings = this.model.selectionSettings, selectedEle, highlightEle;
                this.baseElement = [];
                lgndIndx = data.pointData[0].legendIndex;
                if (sunburstSelectionType.opacity == selectionSettings['type'])
                    this.selectedgroupID = [];
                this.baseElement.push(data.pointData[0]);
                var baseid = data.pointData[0]['id'];
                if (sunburstSelectionType.opacity != selectionSettings['type']) {
                    this.selectedgroupID = [];
                    this.removeSelection(this.selectedgroupID);
                    this.selelectedElementId = baseid;
                }
                if (!this.isNullOrUndefined(data.pointData[0].parentName)) {
                    this.findSelectionParent(data.pointData[0], lgndIndx);
                }
                for (var i = 0; i < this.baseElement.length; i++) {
                    if (!document.getElementById("selectionSunburst")) {
                        element = document.getElementById(this._id + '_legendIndex' + lgndIndx + '_layerNumber' + this.baseElement[i]['layerNumber'].toString() + '_layerIndex' + this.baseElement[i]['layerIndex'].toString() + '_pointIndex' + this.baseElement[i]['pointIndex']);
                        if (sunburstSelectionType.opacity != this.model.selectionSettings.type) {
                            style = this.createselectionStyle(element, this.model.selectionSettings);
                            document.body.appendChild(style);
                            element.setAttribute('class', 'SelectionStyleSunburst');
                        }
                        this.selectedgroupID.push(element.id);
                    }
                    else {
                        element = document.getElementById(this._id + '_legendIndex' + lgndIndx + '_layerNumber' + this.baseElement[i]['layerNumber'].toString() + '_layerIndex' + this.baseElement[i]['layerIndex'].toString() + '_pointIndex' + this.baseElement[i]['pointIndex']);
                        if (sunburstSelectionType.opacity != this.model.selectionSettings.type)
                            element.setAttribute('class', 'SelectionStyleSunburst');
                        this.selectedgroupID.push(element.id);
                    }
                }
            };
            SunburstChart.prototype.findSelectionParent = function (data, legendIndex) {
                var regions = this.sunburstRegions, length = regions.length, region;
                loop1: for (var i = 0; i < length; i++) {
                    region = regions[i];
                    for (var j = 0; j < region['region'].length; j++) {
                        if (!this.isNullOrUndefined(this.model.dataSource)) {
                            if (data['parentName'] == region['region'][j]['x'] && region['region'][j]['parentChildName'] + "_" + data['x'] == data['parentChildName'] && legendIndex == region['region'][j].legendIndex) {
                                this.baseElement.push(region['region'][j]);
                                if (!this.isNullOrUndefined(region['region'][j]['parentName'])) {
                                    this.findSelectionParent(region['region'][j], region['region'][j].legendIndex);
                                    break loop1;
                                }
                                else {
                                    break loop1;
                                }
                            }
                        }
                        else {
                            if (data['parentName'] == region['region'][j]['x'] && legendIndex == region['region'][j].legendIndex) {
                                this.baseElement.push(region['region'][j]);
                                if (!this.isNullOrUndefined(region['region'][j]['parentName'])) {
                                    this.findSelectionParent(region['region'][j], region['region'][j].legendIndex);
                                    break loop1;
                                }
                                else {
                                    break loop1;
                                }
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.selectchild = function (data) {
                var layer, baseid, element, selectionSettings = this.model.selectionSettings, style, lgndIndx, childid, childele;
                this.childrenElement = [];
                layer = this.layerData[data.pointData[0].layerIndex]['point'][data.pointData[0].pointIndex];
                baseid = data.pointData[0]['id'];
                element = document.getElementById(baseid);
                if (!layer['point'] && layer['layerIndex'] != 0) {
                    if (selectionSettings['type'] != sunburstSelectionType.opacity) {
                        if (!document.getElementById("selectionSunburst")) {
                            style = this.createselectionStyle(element, selectionSettings);
                            document.body.appendChild(style);
                        }
                        element.setAttribute('class', 'SelectionStyleSunburst');
                        this.selelectedElementId = baseid;
                    }
                    this.selectedgroupID.push(element.id);
                }
                else {
                    var layerNumber = data.pointData[0].layerNumber;
                    if (!this.isNullOrUndefined(layer['point']))
                        this.findChild(layer, layerNumber);
                    if (selectionSettings['type'] != sunburstSelectionType.opacity) {
                        if (!document.getElementById("SelectionStyleSunburst")) {
                            style = this.createselectionStyle(element, selectionSettings);
                            document.body.appendChild(style);
                        }
                        element.setAttribute('class', 'SelectionStyleSunburst');
                    }
                    this.selectedgroupID.push(element.id);
                    this.selelectedElementId = baseid;
                    lgndIndx = data.pointData[0].legendIndex;
                    for (var i = 0; i < this.childrenElement.length; i++) {
                        if (this.childrenElement[i].layerNumber > data.pointData[0].layerNumber) {
                            for (var j = 0; j < this.childrenElement[i].length; j++) {
                                childid = this._id + '_legendIndex' + lgndIndx + '_layerNumber' + this.childrenElement[i].layerNumber.toString() + '_layerIndex' + this.childrenElement[i].layerIndex + '_pointIndex' + j.toString();
                                childele = document.getElementById(childid);
                                if (selectionSettings['type'] != sunburstSelectionType.opacity)
                                    childele.setAttribute('class', 'SelectionStyleSunburst');
                                this.selectedgroupID.push(childele.id);
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.findChild = function (layer, layerNumber) {
                var points = [];
                for (var i = 0; i < layer['point'].length; i++) {
                    if (layer['point'][i].point) {
                        points.push(layer['point'][i]);
                        this.findChild(layer['point'][i], layerNumber + 1);
                    }
                    else {
                        points.push(layer['point'][i]);
                    }
                }
                points.layerNumber = layerNumber + 1;
                points.layerIndex = layer['point'].layerData;
                this.childrenElement.push(points);
            };
            SunburstChart.prototype.selectGroup = function (groupElement, data) {
                var legendIndex, selectionSettings = this.model.selectionSettings, element, style;
                this.selectedgroupID = [];
                legendIndex = data.pointData[0].legendIndex;
                for (var i = 0; i < groupElement.length; i++) {
                    if (groupElement[i].layerNumber == 1) {
                        element = document.getElementById(this._id + '_legendIndex' + legendIndex + '_layerNumber1_layerIndex0_pointIndex' + groupElement[i].pointIndex.toString());
                        if (selectionSettings['type'] != sunburstSelectionType.opacity) {
                            style = this.createselectionStyle(element, selectionSettings);
                            document.body.appendChild(style);
                            element.setAttribute('class', 'SelectionStyleSunburst');
                        }
                        this.selectedgroupID.push(element.id);
                    }
                    else {
                        for (var j = 0; j < groupElement[i].point.length; j++) {
                            element = document.getElementById(this._id + '_legendIndex' + legendIndex + '_layerNumber' + groupElement[i].layerNumber.toString() + '_layerIndex' + groupElement[i].layerIndex.toString() + '_pointIndex' + j.toString());
                            if (selectionSettings['type'] != sunburstSelectionType.opacity) {
                                var selele = document.getElementById('selectionSunburst');
                                if (selele)
                                    element.setAttribute('class', 'SelectionStyleSunburst');
                                else {
                                    style = this.createselectionStyle(element, selectionSettings);
                                    document.body.appendChild(style);
                                    element.setAttribute('class', 'SelectionStyleSunburst');
                                }
                            }
                            this.selectedgroupID.push(element.id);
                        }
                    }
                }
            };
            SunburstChart.prototype.removeSelection = function (ID) {
                for (var i = 0; i < ID.length && document.getElementById(ID[i]) != null; i++) {
                    if (document.getElementById(ID[i]).getAttribute('class') == "SelectionStyleSunburst")
                        document.getElementById(ID[i]).removeAttribute('class');
                }
            };
            SunburstChart.prototype.findGroupElements = function (data) {
                var groupNumber = data.pointData[0].groupNumber ? data.pointData[0].groupNumber : data.pointData[0].pointIndex + 1, groupPoints = [];
                for (var i = 0; i < this.layerData.length; i++) {
                    if (i == 0) {
                        for (var j = 0; j < this.layerData[i]['point'].length; j++) {
                            if (this.layerData[i]['point'][j].groupNumber == groupNumber) {
                                groupPoints.push(this.layerData[i]['point'][j]);
                            }
                        }
                    }
                    else {
                        if (this.layerData[i]['groupNumber'] == groupNumber) {
                            this.layerData[i]['layerIndex'] = i;
                            groupPoints.push(this.layerData[i]);
                        }
                    }
                }
                return groupPoints;
            };
            SunburstChart.prototype.selectPointData = function (element) {
                var style;
                if (!document.getElementById("selectionSunburst")) {
                    style = this.createselectionStyle(element, this.model.selectionSettings);
                    document.body.appendChild(style);
                    element.setAttribute('class', 'SelectionStyleSunburst');
                    this.selelectedElementId = element.id;
                }
                else {
                    element.setAttribute('class', 'SelectionStyleSunburst');
                    this.selelectedElementId = element.id;
                }
            };
            SunburstChart.prototype.createselectionStyle = function (element, settings) {
                var style, fill, opacity;
                style = document.createElement('style');
                style.type = 'text/css';
                fill = settings.color;
                opacity = '1';
                style.innerHTML = ' .SelectionStyleSunburst{ fill:' + fill + ';' + 'opacity:' + opacity + ';' + 'stroke:;stroke-width:1}';
                style.setAttribute('id', "selectionSunburst");
                return style;
            };
            SunburstChart.prototype.getSunburstPoint = function (event) {
                var mouseX, mouseY, currentX, currentY, region, width, height, distanceFromcenter, radiusCollection, mouseposition, startAngle, endAngle, sunStartAngle;
                mouseposition = this.calMousePosition(event);
                radiusCollection = this.circularRadius;
                currentX = mouseposition['X'];
                currentY = mouseposition['Y'];
                startAngle = this.model.startAngle;
                endAngle = this.model.endAngle;
                width = this.areaBounds['actualWidth'];
                height = this.areaBounds['actualHeight'];
                sunStartAngle = this.model.startAngle * (Math.PI / 180);
                this.sunburstRegions.forEach(function (regionItem, regionIndex) {
                    var sunburstData = regionItem.sunburstData, regionData = regionItem.region, fromCenterX, fromCenterY, innerRadius, segment, arcAngle = 0, clickAngle, pointStartAngle, pointEndAngle, pointData = [], totalDegree, chartStartAngle;
                    innerRadius = sunburstData['innerRadius'] ? sunburstData['innerRadius'] : 0;
                    fromCenterX = (currentX) - (sunburstData['centerX']);
                    fromCenterY = (currentY) - (sunburstData['centerY']);
                    segment = regionItem.region;
                    startAngle = startAngle < 0 ? startAngle + 360 : startAngle;
                    endAngle = endAngle < 0 ? endAngle + 360 : endAngle;
                    totalDegree = endAngle - startAngle;
                    chartStartAngle = (-.5 * Math.PI) + sunStartAngle;
                    if (totalDegree < 0) {
                        endAngle = endAngle / 360;
                        arcAngle = (endAngle) ? 2 * Math.PI * (endAngle < 0 ? 1 + endAngle : endAngle) : 0;
                        clickAngle = (Math.atan2(fromCenterY, fromCenterX) - chartStartAngle - arcAngle) % (2 * Math.PI);
                        if (clickAngle < 0)
                            clickAngle = 2 * Math.PI + clickAngle;
                        for (var i = 0; i < regionData.length; i++) {
                            pointStartAngle = parseFloat(regionData[i]['startAngle'].toFixed(14));
                            pointEndAngle = parseFloat(regionData[i]['endAngle'].toFixed(14));
                            pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                            pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                            pointStartAngle -= arcAngle;
                            pointEndAngle -= arcAngle;
                            pointStartAngle = parseFloat(pointStartAngle.toFixed(14));
                            pointEndAngle = parseFloat(pointEndAngle.toFixed(14));
                            if (clickAngle <= pointStartAngle && clickAngle >= pointEndAngle) {
                                pointData.push(regionData[i]);
                                break;
                            }
                        }
                    }
                    else {
                        clickAngle = (Math.atan2(fromCenterY, fromCenterX) - chartStartAngle) % (2 * Math.PI);
                        if (clickAngle < 0)
                            clickAngle = 2 * Math.PI + clickAngle;
                        for (var i = 0; i < regionData.length; i++) {
                            pointStartAngle = parseFloat(regionData[i]['startAngle'].toFixed(14));
                            pointEndAngle = parseFloat(regionData[i]['endAngle'].toFixed(14));
                            pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                            pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                            pointStartAngle = parseFloat(pointStartAngle.toFixed(14));
                            pointEndAngle = parseFloat(pointEndAngle.toFixed(14));
                            if (clickAngle >= pointStartAngle && clickAngle <= pointEndAngle) {
                                pointData.push(regionData[i]);
                                break;
                            }
                        }
                    }
                    if (pointData.length > 0) {
                        var distanceFromCenter = Math.sqrt(Math.pow(Math.abs(fromCenterX), 2) + Math.pow(Math.abs(fromCenterY), 2));
                        if (distanceFromCenter <= sunburstData['Radius'] && distanceFromCenter > innerRadius) {
                            region = { pointData: pointData, location: { x: currentX, y: currentY } };
                        }
                    }
                });
                return region;
            };
            SunburstChart.prototype.calMousePosition = function (evt) {
                var mouseX, mouseY, pageX, pageY, mouseposition, element, rect, scrlltop, scrollleft;
                mouseposition = this.mousePosition(evt);
                pageX = mouseposition['x'];
                pageY = mouseposition['y'];
                element = document.getElementById(this._id + "_svg");
                scrlltop = window.pageYOffset;
                scrollleft = window.pageXOffset;
                rect = element.getBoundingClientRect();
                mouseX = pageX - scrollleft - rect['left'];
                mouseY = pageY - scrlltop - rect['top'];
                return { X: mouseX, Y: mouseY };
            };
            SunburstChart.prototype.mousePosition = function (evt) {
                if (!this.isNullOrUndefined(evt.pageX) && evt.pageX > 0)
                    return { x: evt.pageX, y: evt.pageY };
                else
                    return { x: 0, y: 0 };
            };
            SunburstChart.prototype.drawSunburstLegend = function () {
                var legend = this.model.legend, legendTitle = this.model.legend.title, maximumLegendSpace, translate, width, x, legendBounds, y, scrollButtons, divele, isScroll = false, legendGrp, legElegrp, elementSpacing = this.elementSpacing, legendItems, titleTransform, legendgrp, legendItemgrp;
                this.gLegendElement = this.createGroup({ 'id': this._id + "_legend_group" });
                if (legend['position'] == sunburstLegendPosition.top || legend['postion'] == sunburstLegendPosition.bottom) {
                    maximumLegendSpace = this.height * (20 / 100);
                }
                document.getElementById(this._id + '_svg').appendChild(this.gLegendElement);
                if (legendTitle['text'] != "" && legendTitle['visible'])
                    this.gLegendElement.appendChild(this.drawLegendTitle(legendTitle, legend));
                legendGrp = this.drawlegendItem(legend, this.legendCollection, isScroll);
                if (this.drilldownCount == 0) {
                    this.legendClick = this.legendClick.bind(this);
                    this.legendItemGroup.addEventListener('click', this.legendClick, true);
                }
                this.gLegendElement.appendChild(legendGrp);
                if (this.legendPages.length > 0) {
                    this.drawScrollbuttons(legend);
                }
                this.legendPositioning(legend, isScroll);
            };
            SunburstChart.prototype.legendPositioning = function (legend, isScroll) {
                var legendgrp, legendItemgrp, legendItems, legendBounds, width, x, elementSpacing = this.elementSpacing, y, translate, divele, scrollButtons, titleTransform;
                legendgrp = document.getElementById(this._id + "_legend_group");
                legendItemgrp = document.getElementById(this._id + "legendItem_Group");
                if (legend['position'] == sunburstLegendPosition.bottom || legend['position'] == sunburstLegendPosition.top) {
                    legendItems = document.getElementById(this._id + "legendItem_Group");
                    legendBounds = legendItems.getBoundingClientRect();
                    width = legendBounds['width'];
                    x = (this.width / 2) - (width / 2);
                    if (legend['position'] == sunburstLegendPosition.bottom) {
                        if (this.isNullOrUndefined(legend['size']['height']))
                            y = this.LegendBounds['Height'] - elementSpacing;
                        else
                            y = legendBounds['height'] + elementSpacing;
                    }
                    else {
                        if (this.isNullOrUndefined(legend['size']['height']))
                            y = 0;
                        else {
                            y = this.LegendBounds['Height'] - legendBounds['top'] + elementSpacing;
                        }
                    }
                    translate = 'translate(' + x.toString() + ',' + '0)';
                    legendItems.setAttribute('transform', translate);
                    if (legend['title']['text'] != "" && legend['title']['visible'])
                        document.getElementById(this._id + "_LegendTitleText").setAttribute('transform', translate);
                    if (this.legendPages.length > 0) {
                        divele = document.getElementById(this._id).getBoundingClientRect();
                        x = (this.width / 2) - (document.getElementById("scrollButtons").getBoundingClientRect().width / 2);
                        if (legend['position'] == sunburstLegendPosition.bottom) {
                            y = legendBounds['bottom'] - divele['top'];
                        }
                        else if (legend['position'] == sunburstLegendPosition.top) {
                            y = legendBounds['top'] + legendBounds['height'];
                        }
                        translate = 'translate(' + x.toString() + ',' + y.toString() + ')';
                        document.getElementById("scrollButtons").setAttribute('transform', translate);
                    }
                }
                else if ((legend['position'] == sunburstLegendPosition.left || legend['position'] == sunburstLegendPosition.right)) {
                    if (!isScroll) {
                        var grpXTransform = void 0;
                        var grpYTransform = (document.getElementById(this._id + "_svg").getBoundingClientRect().height / 2) - (legendgrp.getBoundingClientRect().height / 2);
                        if (legend['position'] == sunburstLegendPosition.left)
                            translate = 'translate(' + '0' + ',' + grpYTransform.toString() + ')';
                        else {
                            if (this.isNullOrUndefined(legend['size']['width']))
                                grpXTransform = (this.width - legendgrp.getBoundingClientRect().width - (2 * this.elementSpacing));
                            else {
                                grpXTransform = (this.width - legendgrp.getBoundingClientRect().width - legendgrp.getBoundingClientRect().left - (2 * this.elementSpacing));
                                grpXTransform = grpXTransform - legend['size']['width'];
                            }
                            translate = 'translate(' + grpXTransform.toString() + ',' + grpYTransform.toString() + ')';
                        }
                        legendgrp.setAttribute('transform', translate);
                    }
                    if (this.legendPages.length > 0) {
                        legendBounds = legendgrp.getBoundingClientRect();
                        scrollButtons = document.getElementById("scrollButtons").getBoundingClientRect();
                        x = legendBounds['width'] / 2 - scrollButtons['width'] / 2;
                        y = legendBounds['height'];
                        translate = 'translate(' + x.toString() + ',' + y.toString() + ')';
                        document.getElementById("scrollButtons").setAttribute('transform', translate);
                    }
                }
                else {
                    if (legend['title']['visible'] && legend['title']['text'] != "") {
                        titleTransform = (legendItemgrp.getBoundingClientRect().width - document.getElementById(this._id + "_LegendTitleText").getBoundingClientRect().width) / 2;
                        translate = 'translate(' + titleTransform.toString() + ',0)';
                        document.getElementById(this._id + "_LegendTitleText").setAttribute('transform', translate);
                    }
                }
                if ((legend['position'] == sunburstLegendPosition.bottom || legend['position'] == sunburstLegendPosition.top) && legend['alignment'] != sunburstAlignment.center) {
                    if (legend['alignment'] == sunburstAlignment.near) {
                        x = -Math.abs(legendItemgrp.getBoundingClientRect().left) + this.elementSpacing;
                        translate = 'translate(' + x.toString() + '0)';
                        legendgrp.setAttribute('transform', translate);
                    }
                    else if (legend['alignment'] == sunburstAlignment.far) {
                        x = Math.abs(legendItemgrp.getBoundingClientRect().right - legendItemgrp.getBoundingClientRect().width);
                        x = x - (this.elementSpacing + this.model.margin.right);
                        translate = 'translate(' + x.toString() + ',0)';
                        legendgrp.setAttribute('transform', translate);
                    }
                }
                else if ((legend['position'] == sunburstLegendPosition.left || legend['position'] == sunburstLegendPosition.right) && legend['alignment'] != sunburstAlignment.center) {
                    var trans = legendgrp.getAttribute("transform").split(" ");
                    if (legend['alignment'] == sunburstAlignment.near) {
                        x = legendgrp.getBoundingClientRect().left + this.elementSpacing;
                        y = this.elementSpacing + this.model.margin.top;
                        translate = trans[0] + ',' + y.toString() + ')';
                        legendgrp.setAttribute('transform', translate);
                    }
                    else {
                        x = legendgrp.getBoundingClientRect().left + this.elementSpacing;
                        y = this.areaBounds['actualHeight'] - legendgrp.getBoundingClientRect().height + this.elementSpacing + this.model.margin.bottom;
                        translate = trans[0] + ',' + y.toString() + ')';
                        legendgrp.setAttribute('transform', translate);
                    }
                }
            };
            SunburstChart.prototype.drawScrollbuttons = function (legend) {
                var legendItemgroup, legendItemsize, position = legend['position'], options, scrollgroup, scrollPath, pageText, pageNumber;
                if (legend['position'] != sunburstLegendPosition.float) {
                    scrollgroup = this.createGroup({ 'id': 'scrollButtons' });
                    options = {
                        'id': 'scrollUp',
                        'd': 'M 6 0 L 12 12 0 12 Z',
                        'fill': '#3E576F'
                    };
                    scrollPath = this.drawPath(options);
                    scrollgroup.appendChild(scrollPath);
                    options = {
                        'id': 'scrollDown',
                        'd': 'M 40.359375 0 L 52.359375 0 46.359375 12 Z',
                        'fill': '#3E576F'
                    };
                    scrollPath = this.drawPath(options);
                    scrollgroup.appendChild(scrollPath);
                    options = {
                        'id': 'pageNumber',
                        'x': 15,
                        'y': 10,
                        'fill': legend['font']['color'],
                        'font-size': legend['font']['size'],
                        'font-style': legend['font']['fontStyle'],
                        'font-family': legend['font']['fontFamily'],
                        'font-weight': legend['font']['fontWeight'],
                        'text-anchor': 'start',
                    };
                    pageNumber = this.currentpageNumber.toString() + '/' + this.totalpageNumbers;
                    pageText = this.createText(options, pageNumber);
                    scrollgroup.appendChild(pageText);
                    this.scrollClick = this.scrollClick.bind(this);
                    scrollgroup.addEventListener('click', this.scrollClick, true);
                }
                this.gLegendElement.appendChild(scrollgroup);
            };
            SunburstChart.prototype.scrollClick = function (event) {
                var legend = this.model.legend, targetId = event.target['id'], legendGroupEle, transform, currentPageNumber = this.currentpageNumber, totalPageNumber = this.totalpageNumbers, pageNumber, legendGrp;
                legendGroupEle = document.getElementById(this._id + "legendItem_Group");
                pageNumber = document.getElementById("pageNumber");
                if (targetId == 'scrollDown' && currentPageNumber != totalPageNumber) {
                    this.currentpageNumber = currentPageNumber + 1;
                    legendGroupEle.parentNode.removeChild(legendGroupEle);
                    legendGrp = this.drawlegendItem(legend, this.legendPages[this.currentpageNumber - 1], true);
                    this.gLegendElement.appendChild(legendGrp);
                    document.getElementById(this._id + "_svg").appendChild(this.gLegendElement);
                    pageNumber.textContent = this.currentpageNumber.toString() + '/' + this.totalpageNumbers.toString();
                    this.legendClick = this.legendClick.bind(this);
                    legendGrp.addEventListener('click', this.legendClick, true);
                }
                else if (targetId == 'scrollUp' && currentPageNumber != 1) {
                    this.currentpageNumber = currentPageNumber - 1;
                    legendGroupEle.parentNode.removeChild(legendGroupEle);
                    legendGrp = this.drawlegendItem(legend, this.legendPages[this.currentpageNumber - 1], true);
                    this.gLegendElement.appendChild(legendGrp);
                    document.getElementById(this._id + "_svg").appendChild(this.gLegendElement);
                    pageNumber.textContent = this.currentpageNumber.toString() + '/' + this.totalpageNumbers.toString();
                    this.legendClick = this.legendClick.bind(this);
                    legendGrp.addEventListener('click', this.legendClick, true);
                }
                if (legend['position'] == sunburstLegendPosition.top || legend['position'] == sunburstLegendPosition.bottom)
                    this.legendPositioning(legend, false);
            };
            SunburstChart.prototype.drawLegendTitle = function (legendTitle, legend) {
                var text = legendTitle['text'], textLocation, textSize = this.measureText(legendTitle['text'], legendTitle['font']), options, elementSpacing = this.elementSpacing, radius = this.circularRadius[this.totallayerCount - 1], x, y, textAnchor, titleText, startX = 0, startY = 0, fill = legendTitle['font'].color;
                fill = this.isNullOrUndefined(fill) ? (this.model.theme.toString().indexOf("dark") != -1 ? "white" : "black") : fill;
                if (legend['position'] == sunburstLegendPosition.bottom) {
                    startY = this.areaBounds['actualHeight'] + (textSize['height'] / 2) + elementSpacing + this.yOffset;
                }
                else if (legend['position'] == sunburstLegendPosition.top) {
                    startY = elementSpacing + this.yOffset + (textSize['height'] / 2);
                    if (!this.isNullOrUndefined(legend['size']['height']))
                        startY = legend['size']['height'] + this.yOffset;
                }
                else if (legend['position'] == sunburstLegendPosition.left || legend['position'] == sunburstLegendPosition.right) {
                    startY = elementSpacing + this.model.margin.top;
                    startX -= elementSpacing;
                }
                else {
                    startY = legend['location'].y;
                    startX = legend['location'].x;
                }
                switch (legendTitle['textAlignment']) {
                    case 'far':
                        startX += this.LegendBounds['Width'] - textSize['width'] / 2;
                        break;
                    case 'near':
                        startX += (textSize['width']) / 2;
                        break;
                    case 'center':
                        startX += this.LegendBounds['Width'] / 2;
                }
                this.legendTitleLocation = { 'x': startX, 'y': startY, width: textSize['width'], height: textSize['height'] };
                options = {
                    'id': this._id + '_LegendTitleText',
                    'x': startX,
                    'y': startY,
                    'fill': fill,
                    'font-size': legendTitle['font']['size'],
                    'font-style': legendTitle['font']['fontStyle'],
                    'font-family': legendTitle['font']['fontFamily'],
                    'font-weight': legendTitle['font']['fontWeight'],
                    'text-anchor': 'middle',
                };
                titleText = this.createText(options, legendTitle['text']);
                return titleText;
            };
            SunburstChart.prototype.drawlegendItem = function (legend, legendCollection, isScroll) {
                var xlocation = 0, ylocation = 0, textSize, radius, symbol = this.model.legend.itemStyle, fill, shape, textwidth = 0, legendGroup, textoptions, text, itemPadding;
                this.legendItemGroup = this.createGroup({ 'id': this._id + 'legendItem_Group' });
                if (this.model.legend.position == sunburstLegendPosition.bottom || this.model.legend.position == sunburstLegendPosition.top) {
                    return this.drawBottomTopLegend(legend, legendCollection);
                }
                else if (this.model.legend.position == sunburstLegendPosition.left || this.model.legend.position == sunburstLegendPosition.right) {
                    return this.drawLeftRightLegend(legend, legendCollection, isScroll);
                }
                else {
                    itemPadding = 0;
                    if (legend['title']['visible'] && legend['title']['text'] != " ") {
                        textSize = this.measureText(legend['title']['text'], legend['title']['font']);
                        ylocation = legend['location']['y'] + (textSize['height'] / 2) + this.elementSpacing;
                    }
                    else
                        ylocation = legend['location']['y'];
                    xlocation = legend['location']['x'];
                    for (var i = 0; i < legendCollection.length; i++) {
                        xlocation += textwidth + itemPadding;
                        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
                        fill = legendCollection[i]['visibility'] ? legendCollection[i]['fill'] : 'grey';
                        shape = this.drawLegendShape(legendCollection[i], xlocation, ylocation, i);
                        if (this.model.legendItemRendering) {
                            var commonEventArgs = $.extend({}, this.common);
                            var data = {
                                location: { x: xlocation, y: ylocation },
                                text: legendCollection[i]['Text'],
                                shape: legendCollection[i]['sunburstLegendShape']
                            };
                            commonEventArgs.data = data;
                            this._trigger("legendItemRendering", commonEventArgs);
                        }
                        textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius) + this.model.legend.itemPadding;
                        itemPadding = legend['itemPadding'];
                        legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                        legendGroup['style']['cursor'] = 'pointer';
                        textoptions = {
                            'id': this._id + '_svg' + '_LegendItemText' + i.toString(),
                            'x': xlocation + (radius),
                            'y': ylocation + (((radius * 3) / 4)),
                            'fill': legendCollection[i]['font']['color'],
                            'font-size': legendCollection[i]['font']['size'],
                            'font-style': legendCollection[i]['font']['fontStyle'],
                            'font-family': legendCollection[i]['font']['fontFamily'],
                            'font-weight': legendCollection[i]['font']['fontWeight'],
                            'text-anchor': 'start',
                        };
                        text = this.createText(textoptions, legendCollection[i]['Text']);
                        legendGroup.appendChild(shape);
                        legendGroup.appendChild(text);
                        this.legendItemGroup.appendChild(legendGroup);
                    }
                    return this.legendItemGroup;
                }
            };
            SunburstChart.prototype.legendClick = function (event) {
                var targetId, childElement, legendText, points = [], legendpoint = {}, circleElement, fill, parentElement, element;
                if (this.rotateAnimate || this.model.enableAnimation) {
                    this.stopAnimation();
                }
                if (this.model.legend.clickAction == sunburstLegendClickAction.toggleSegmentVisibility) {
                    targetId = event['target']['id'];
                    parentElement = document.getElementById(targetId).parentNode;
                    childElement = parentElement.childNodes[1];
                    circleElement = parentElement.childNodes[0];
                    legendText = childElement.textContent;
                    element = document.getElementById(this._id + '_svg');
                    element.parentNode.replaceChild(element.cloneNode(false), element);
                    for (var i = 0; i < this.legendCollection.length; i++) {
                        if (legendText == this.legendCollection[i]['Text']) {
                            if (this.legendCollection[i]['visibility']) {
                                this.legendCollection[i]['visibility'] = false;
                                legendpoint = { 'x': this.legendCollection[i]['x'], 'parentChildName': this.legendCollection[i]['x'], 'y': this.legendCollection[i]['y'], 'fill': this.legendCollection[i]['fill'], 'text': this.legendCollection[i]['Text'], 'point': this.legendCollection[i]['points'] };
                            }
                            else {
                                this.legendCollection[i]['visibility'] = true;
                                points.push({ 'x': this.legendCollection[i]['x'], 'parentChildName': this.legendCollection[i]['x'], 'y': this.legendCollection[i]['y'], 'fill': this.legendCollection[i]['fill'], 'text': this.legendCollection[i]['Text'], 'point': this.legendCollection[i]['points'] });
                            }
                        }
                        else {
                            if (this.legendCollection[i]['visibility'])
                                points.push({ 'x': this.legendCollection[i]['x'], 'parentChildName': this.legendCollection[i]['x'], 'y': this.legendCollection[i]['y'], 'fill': this.legendCollection[i]['fill'], 'text': this.legendCollection[i]['Text'], 'point': this.legendCollection[i]['points'] });
                        }
                    }
                    if (this.model.legendItemClick) {
                        var commonEventArgs = $.extend({}, this.common);
                        var data = {
                            location: { x: legendpoint['x'], y: legendpoint['y'] },
                            text: legendText,
                            point: legendpoint['point']
                        };
                        commonEventArgs.data = data;
                        this._trigger("legendItemClick", commonEventArgs);
                    }
                    this.processData(points);
                    this.legendClicked = true;
                    this.drawSunburst(this.layerData);
                    this.legendClicked = false;
                }
            };
            SunburstChart.prototype.drawLegendShape = function (legendCollection, locX, locY, index) {
                var symbol = this.model.legend.itemStyle, width = symbol['width'], height = symbol['height'], fill = legendCollection['visibility'] ? legendCollection['fill'] : 'grey', shape = legendCollection['sunburstLegendShape'], funcName = 'Path', stroke = legendCollection['visibility'] ? this.model.legend.border.color : 'grey', path, x = locX + (-width / 2), y = locY + (-height / 2), radius, renderOption, eq, xValue, yValue;
                renderOption = {
                    'id': this._id + '_svg' + '_LegendItemShape' + index.toString(),
                    'fill': fill,
                    'stroke': stroke,
                    'stroke-width': this.model.legend.border.width,
                };
                switch (shape) {
                    case 'circle':
                        funcName = 'Circle';
                        radius = Math.sqrt(height * height + width * width) / 2;
                        renderOption['r'] = radius;
                        renderOption['cx'] = locX;
                        renderOption['cy'] = locY;
                        break;
                    case 'diamond':
                        path = 'M' + ' ' + x + ' ' + locY + ' ' +
                            'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                            'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                            'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                            'L' + ' ' + x + ' ' + locY + ' z';
                        renderOption['d'] = path;
                        break;
                    case 'rectangle':
                        path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                            'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                            'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
                        renderOption['d'] = path;
                        break;
                    case 'triangle':
                        path = 'M' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                            'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                            'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                            'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' z';
                        renderOption['d'] = path;
                        break;
                    case 'pentagon':
                        eq = 72;
                        radius = Math.sqrt(height * height + width * width) / 2;
                        for (var i = 0; i <= 5; i++) {
                            xValue = radius * Math.cos((Math.PI / 180) * (i * eq));
                            yValue = radius * Math.sin((Math.PI / 180) * (i * eq));
                            if (i === 0) {
                                path = 'M' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ';
                            }
                            else {
                                path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
                            }
                        }
                        path = path.concat('Z');
                        renderOption['d'] = path;
                        break;
                    case 'cross':
                        path = "M" + " " + (locX - width) + " " + locY + " " + "L" + " " + (locX + width) + " " + locY + " " +
                            "M" + " " + locX + " " + (locY + height) + " " + "L" + " " + locX + " " + (locY - height);
                        renderOption['d'] = path;
                        renderOption['stroke'] = fill;
                        break;
                }
                return this['draw' + funcName](renderOption);
            };
            SunburstChart.prototype.drawBottomTopLegend = function (legend, legendCollection) {
                var legendTitleLocation = this.legendTitleLocation, margin = this.model.margin, yOffset = this.yOffset, xlocation = 0, itemPadding = 0, elementSpacing = this.elementSpacing, legendTextcolor, ylocation, textSize, radius, symbol = this.model.legend.itemStyle, fill = this.model.legend.font.color, circleoptions, shape, textwidth = 0, legendGroup, textoptions, text;
                legendTextcolor = this.isNullOrUndefined(fill) ? (this.model.theme.toString().indexOf("dark") != -1 ? "white" : "black") : fill;
                if (this.isNullOrUndefined(legend['rowCount'] || legend['columnCount'])) {
                    this.legendItemGroup = this.createGroup({ 'id': this._id + 'legendItem_Group' });
                    if (legend['title'].visible && legend['title'].text != " ") {
                        textSize = this.measureText(legend['title']['text'], legend['title']['font']);
                        if (legend['position'] == sunburstLegendPosition.bottom)
                            ylocation = this.areaBounds['actualHeight'] + (textSize['height']) + (2 * elementSpacing) + yOffset;
                        else
                            ylocation = yOffset + textSize['height'] + (2 * elementSpacing);
                    }
                    else {
                        if (legend['position'] = sunburstLegendPosition.bottom)
                            ylocation = elementSpacing + margin['top'] + (2 * this.circularRadius[this.totallayerCount - 1]) + yOffset + elementSpacing;
                        else
                            ylocation = elementSpacing + margin['top'] + yOffset + elementSpacing;
                    }
                    for (var i = 0; i < legendCollection.length; i++) {
                        xlocation += elementSpacing + textwidth + itemPadding;
                        textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'];
                        if (xlocation + elementSpacing + textwidth + itemPadding > this.width) {
                            xlocation = elementSpacing;
                            ylocation += this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['height'];
                        }
                        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
                        fill = legendCollection[i]['visibility'] ? legendCollection[i]['fill'] : 'grey';
                        if (xlocation + textwidth > 900) {
                            ylocation = ylocation + this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['height'] + elementSpacing;
                            xlocation = elementSpacing;
                        }
                        this.findLegendPosition(radius, xlocation, ylocation, legend, legendCollection[i]);
                        if (this.legendInRegion) {
                            if (this.model.legendItemRendering) {
                                var commonEventArgs = $.extend({}, this.common);
                                var data = {
                                    location: { x: xlocation, y: ylocation },
                                    text: legendCollection[i]['Text'],
                                    shape: legendCollection[i]['sunburstLegendShape']
                                };
                                commonEventArgs.data = data;
                                this._trigger("legendItemRendering", commonEventArgs);
                            }
                            legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                            legendGroup['style']['cursor'] = 'pointer';
                            shape = this.drawLegendShape(legendCollection[i], xlocation, ylocation, i);
                            legendGroup.appendChild(shape);
                            textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius * 2);
                            textoptions = {
                                'id': this._id + '_svg' + '_LegendItemText' + i.toString(),
                                'x': xlocation + elementSpacing,
                                'y': ylocation + ((radius * 3) / 4),
                                'fill': legendTextcolor,
                                'font-size': legendCollection[i]['font']['size'],
                                'font-style': legendCollection[i]['font']['fontStyle'],
                                'font-family': legendCollection[i]['font']['fontFamily'],
                                'font-weight': legendCollection[i]['font']['fontWeight'],
                                'text-anchor': 'start',
                            };
                            itemPadding = legend['itemPadding'];
                            text = this.createText(textoptions, legendCollection[i]['Text']);
                            legendGroup.appendChild(text);
                            this.legendItemGroup.appendChild(legendGroup);
                        }
                        else {
                            this.legendPaging(legend, i, legendCollection);
                            break;
                        }
                    }
                }
                else {
                    var rowCount = legend['rowCount'], columnCount = legend['columnCount'], legendItemCount = legendCollection.length, Num = 0, renderasper = void 0, count = void 0, currentX = 10, currentY = 26, startX = 10;
                    if (legend['title'].visible && legend['title'].text != " ") {
                        textSize = this.measureText(legend['title']['text'], legend['title']['font']);
                        if (legend['position'] == sunburstLegendPosition.bottom)
                            ylocation = (2 * elementSpacing) + margin['top'] + (2 * this.circularRadius[this.totallayerCount - 1]) + yOffset + (textSize['height']);
                        else
                            ylocation = (2 * elementSpacing) + margin['top'] + yOffset + textSize['height'];
                    }
                    else {
                        if (legend['position'] == sunburstLegendPosition.bottom)
                            ylocation = (2 * elementSpacing) + margin['top'] + (2 * this.circularRadius[this.totallayerCount - 1]) + yOffset;
                        else
                            ylocation = (2 * elementSpacing) + margin['top'] + yOffset;
                    }
                    for (var i = 0; i < legendItemCount; i++) {
                        fill = legendCollection[i]['visibility'] ? legendCollection[i]['fill'] : 'grey';
                        legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
                        if (currentX + legendCollection[i]['Bounds']['Width'] > this.LegendBounds['Width'] + startX) {
                            currentX = textwidth = 10;
                            ylocation += elementSpacing + legendCollection[i]['Bounds']['Height'];
                        }
                        this.findLegendPosition(radius, currentX, ylocation, legend, legendCollection[i]);
                        if (this.legendInRegion) {
                            if (this.model.legendItemRendering) {
                                var commonEventArgs = $.extend({}, this.common);
                                var data = {
                                    location: { x: currentX, y: ylocation },
                                    text: legendCollection[i]['Text'],
                                    shape: legendCollection[i]['sunburstLegendShape']
                                };
                                commonEventArgs.data = data;
                                this._trigger("legendItemRendering", commonEventArgs);
                            }
                            textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius * 2);
                            legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                            legendGroup['style']['cursor'] = 'pointer';
                            shape = this.drawLegendShape(legendCollection[i], currentX, ylocation, i);
                            legendGroup.appendChild(shape);
                            textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius * 2);
                            textoptions = {
                                'id': this._id + '_svg' + '_LegendItemText' + i.toString(),
                                'x': currentX + elementSpacing,
                                'y': ylocation + (((radius * 3) / 4)),
                                'fill': legendTextcolor,
                                'font-size': legendCollection[i]['font']['size'],
                                'font-style': legendCollection[i]['font']['fontStyle'],
                                'font-family': legendCollection[i]['font']['fontFamily'],
                                'font-weight': legendCollection[i]['font']['fontWeight'],
                                'text-anchor': 'start',
                            };
                            currentX += textwidth + elementSpacing;
                            text = this.createText(textoptions, legendCollection[i]['Text']);
                            legendGroup.appendChild(text);
                            this.legendItemGroup.appendChild(legendGroup);
                        }
                        else {
                            this.legendPaging(legend, i, legendCollection);
                            break;
                        }
                    }
                }
                return this.legendItemGroup;
            };
            SunburstChart.prototype.drawLeftRightLegend = function (legend, legendCollection, isScroll) {
                var xlocation = 0, itemPadding = 0, legendTextcolor, ylocation = 0, textSize, radius, symbol = this.model.legend.itemStyle, fill = this.model.legend.font.color, shape, textwidth = 0, legendGroup, textoptions, text, textheight = 0, elementSpacing = this.elementSpacing, margin = this.model.margin;
                legendTextcolor = this.isNullOrUndefined(fill) ? (this.model.theme.toString().indexOf("dark") != -1 ? "white" : "black") : fill;
                if (this.isNullOrUndefined(legend['rowCount'] || legend['columnCount'])) {
                    if (legend['title'].visible && legend['title'].text != " ") {
                        textSize = this.measureText(legend['title']['text'], legend['title']['font']);
                        textheight = (textSize['height']) + elementSpacing;
                    }
                    ylocation = textheight + elementSpacing + itemPadding;
                    xlocation = elementSpacing + margin['left'];
                    for (var i = 0; i < legendCollection.length; i++) {
                        textSize = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font']);
                        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
                        fill = legendCollection[i]['visibility'] ? legendCollection[i]['fill'] : 'grey';
                        this.findLegendPosition(radius, xlocation, ylocation, legend, legendCollection[i]);
                        if (this.legendInRegion) {
                            if (this.model.legendItemRendering) {
                                var commonEventArgs = $.extend({}, this.common);
                                var data = {
                                    location: { x: xlocation, y: ylocation },
                                    text: legendCollection[i]['Text'],
                                    shape: legendCollection[i]['sunburstLegendShape']
                                };
                                commonEventArgs.data = data;
                                this._trigger("legendItemRendering", commonEventArgs);
                            }
                            shape = this.drawLegendShape(legendCollection[i], xlocation, ylocation, i);
                            textwidth += textSize['width'] + (radius);
                            legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                            textoptions = {
                                'id': this._id + '_svg' + '_LegendItemText' + i.toString(),
                                'x': xlocation + (this.elementSpacing),
                                'y': ylocation + (((radius * 3) / 4)),
                                'fill': legendTextcolor,
                                'font-size': legendCollection[i]['font']['size'],
                                'font-style': legendCollection[i]['font']['fontStyle'],
                                'font-family': legendCollection[i]['font']['fontFamily'],
                                'font-weight': legendCollection[i]['font']['fontWeight'],
                                'text-anchor': 'start',
                            };
                            itemPadding = legend['itemPadding'];
                            ylocation += textSize['height'] / 2 + this.elementSpacing;
                            text = this.createText(textoptions, legendCollection[i]['Text']);
                            legendGroup.appendChild(shape);
                            legendGroup.appendChild(text);
                            this.legendItemGroup.appendChild(legendGroup);
                        }
                        else {
                            this.legendPaging(legend, i, legendCollection);
                            break;
                        }
                    }
                    return this.legendItemGroup;
                }
                else {
                    var rowCount = legend['rowCount'], columnCount = legend['columnCount'], legendItemCount = legendCollection.length, Num = 0, renderasper = void 0, count = void 0, currentX = 10, currentY = 26, startX = 10, maxWidth = 0;
                    if (!isScroll)
                        this.LegendBounds['Height'] += this.measureText(legend['title']['text'], legend['title']['font'])['height'];
                    if (this.model.legend.title.visible && this.model.legend.title.text != " ") {
                        textSize = this.measureText(legend['title']['text'], legend['title']['font']);
                        textheight = (textSize['height']);
                    }
                    ylocation = textheight + this.elementSpacing;
                    xlocation = this.elementSpacing + this.model.margin.left;
                    for (var i = 0; i < legendItemCount; i++) {
                        fill = legendCollection[i]['visibility'] ? legendCollection[i]['fill'] : 'grey';
                        legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                        radius = Math.sqrt(symbol['width'] * symbol['width'] + symbol['height'] * symbol['height']) / 2;
                        if (((currentY + legendCollection[i]['Bounds']['Height'] + legend['itemPadding']) + textheight + 2 > this.LegendBounds['Height'] + 26)) {
                            currentY = 26;
                            currentX += maxWidth + (legend['itemPadding']);
                        }
                        currentY += (legendCollection[i]['Bounds']['Height'] / 2) + legend['itemPadding'];
                        maxWidth = Math.max(maxWidth, legendCollection[i]['Bounds']['Width']);
                        this.findLegendPosition(radius, currentX, currentY, legend, legendCollection[i]);
                        if (this.legendInRegion) {
                            if (this.model.legendItemRendering) {
                                var commonEventArgs = $.extend({}, this.common);
                                var data = {
                                    location: { x: currentX, y: currentY },
                                    text: legendCollection[i]['Text'],
                                    shape: legendCollection[i]['sunburstLegendShape']
                                };
                                commonEventArgs.data = data;
                                this._trigger("legendItemRendering", commonEventArgs);
                            }
                            textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius * 2);
                            legendGroup = this.createGroup({ id: this._id + '_svg' + '_Legend' + i.toString() });
                            legendGroup['style']['cursor'] = 'pointer';
                            shape = this.drawLegendShape(legendCollection[i], currentX, currentY, i);
                            legendGroup.appendChild(shape);
                            textwidth = this.measureText(legendCollection[i]['Text'], legendCollection[i]['font'])['width'] + (radius * 2);
                            textoptions = {
                                'id': this._id + '_svg' + '_LegendItemText' + i.toString(),
                                'x': currentX + radius,
                                'y': currentY + (((radius * 3) / 4)),
                                'fill': legendTextcolor,
                                'font-size': legendCollection[i]['font']['size'],
                                'font-style': legendCollection[i]['font']['fontStyle'],
                                'font-family': legendCollection[i]['font']['fontFamily'],
                                'font-weight': legendCollection[i]['font']['fontWeight'],
                                'text-anchor': 'start',
                            };
                            text = this.createText(textoptions, legendCollection[i]['Text']);
                            legendGroup.appendChild(text);
                            this.legendItemGroup.appendChild(legendGroup);
                        }
                        else {
                            this.legendPaging(legend, i, legendCollection);
                            break;
                        }
                    }
                    return this.legendItemGroup;
                }
            };
            SunburstChart.prototype.legendPaging = function (legend, drawnLegendCount, legendCollection) {
                var totalLegendCount = this.legendCollection.length, visibleLegendCount = drawnLegendCount, pages;
                this.legendPages = [];
                this.currentpageNumber = 1;
                this.totalpageNumbers = drawnLegendCount == 0 ? totalLegendCount : (totalLegendCount % drawnLegendCount) == 0 ? Math.floor(totalLegendCount / drawnLegendCount) : Math.floor(totalLegendCount / drawnLegendCount) + 1;
                for (var i = 0; i < totalLegendCount; i = i + visibleLegendCount) {
                    pages = [];
                    for (var j = 0; j < visibleLegendCount; j++) {
                        if ((i + j) < totalLegendCount)
                            pages.push(legendCollection[i + j]);
                    }
                    if (visibleLegendCount == 0) {
                        pages.push(legendCollection[i]);
                        this.legendPages.push(pages);
                        break;
                    }
                    this.legendPages.push(pages);
                }
            };
            SunburstChart.prototype.findLegendPosition = function (radius, xlocation, ylocation, legend, legendItem) {
                var elementSpacing = this.elementSpacing, textsize, maximum = 20 / 100;
                if (legend['position'] == sunburstLegendPosition.bottom) {
                    if (radius + ylocation + elementSpacing > this.height - elementSpacing) {
                        this.legendInRegion = false;
                    }
                    else
                        this.legendInRegion = true;
                }
                else if (legend['position'] == sunburstLegendPosition.top) {
                    if ((this.yOffset + (maximum * this.height) - this.elementSpacing - radius) > ylocation)
                        this.legendInRegion = true;
                    else
                        this.legendInRegion = false;
                }
                else if ((legend['position'] == sunburstLegendPosition.left) || (legend['position'] == sunburstLegendPosition.right)) {
                    if (!this.isNullOrUndefined(legend['rowCount']) || !this.isNullOrUndefined(legend['columnCount'])) {
                        textsize = this.measureText(legendItem['Text'], legendItem['font']);
                        if ((maximum * this.width + elementSpacing) > (xlocation + radius + textsize['width']))
                            this.legendInRegion = true;
                        else
                            this.legendInRegion = false;
                    }
                    else {
                        if (radius + ylocation + elementSpacing > this.height - elementSpacing)
                            this.legendInRegion = false;
                        else
                            this.legendInRegion = true;
                    }
                }
            };
            SunburstChart.prototype.drawDatalabel = function (layerData) {
                this.dataLabelGroupEle = this.createGroup({ 'id': this._id + '_svg_DataLabelGroup' });
                for (var i = 0; i < layerData.length; i++) {
                    var layerPoints = layerData[i];
                    var point = void 0, text = void 0, textsize = void 0, sunburstStartAngle = void 0, midAngle = void 0, midPoint = void 0, childMidPoint = void 0, bounds = void 0, radius = void 0, size = void 0, position = void 0, positionX = void 0, positionY = void 0, textAnchor = void 0, textOptions = void 0, textele = void 0, startPoint = void 0, textOffset = void 0, startX = void 0, startY = void 0, midX = void 0, midY = void 0, childMidX = void 0, childMidY = void 0, layerNumber = void 0, dMidX = void 0, dMidY = void 0, model = this.model, sliceRadius = this.circularRadius[0] - this.innerRadius[0], sunburstMidPoint = void 0;
                    for (var j = 0; j < layerPoints.point.length; j++) {
                        point = layerPoints.point[j];
                        if (point['y'] != null) {
                            layerNumber = layerPoints['layerNumber'];
                            text = point['text'] ? point['text'] : (model['dataSource']) ? point['x'] : point['y'].toString();
                            textsize = this.measureText(text, model['dataLabelSettings'].font);
                            sunburstStartAngle = -0.5 * Math.PI;
                            radius = this.circularRadius[layerPoints.layerNumber - 1];
                            textOffset = textsize['height'] / 2;
                            startX = this.circleCenterX;
                            startY = this.circleCenterY;
                            midAngle = point['midAngle'] + sunburstStartAngle;
                            midX = this.getXcordinate(startX, radius, midAngle);
                            midY = this.getYcordinate(startY, radius, midAngle);
                            dMidX = this.getXcordinate(startX, this.innerRadius[layerNumber - 1], midAngle);
                            dMidY = this.getYcordinate(startY, this.innerRadius[layerNumber - 1], midAngle);
                            sunburstMidPoint = { 'dMidX': dMidX, 'dMidY': dMidY };
                            if (layerPoints.layerNumber > 1) {
                                childMidX = this.getXcordinate(startX, this.circularRadius[layerPoints.layerNumber - 2], midAngle);
                                childMidY = this.getYcordinate(startY, this.circularRadius[layerPoints.layerNumber - 2], midAngle);
                            }
                            midPoint = { midX: midX, midY: midY };
                            childMidPoint = { childMidX: childMidX, childMidY: childMidY };
                            bounds = { midPoint: midPoint, childMidPoint: childMidPoint, 'sunburstMidPoint': sunburstMidPoint };
                            startPoint = { startX: startX, startY: startY };
                            size = {
                                width: this.width, height: this.height
                            };
                            position = this.calculateLabelPosition(startPoint, bounds);
                            positionX = position['positionX'];
                            positionY = position['positionY'];
                            textAnchor = "middle";
                            textOptions = this.textOptions(point, positionX, positionY, textsize, textAnchor, layerPoints.layerNumber, j);
                            if (this.isNullOrUndefined(model['dataLabelSettings'].template)) {
                                var commonDataLabelEventArgs = $.extend({}, this.common);
                                commonDataLabelEventArgs.data = { Text: text, location: { x: positionX, y: positionY }, pointIndex: point['pointIndex'] };
                                this._trigger("dataLabelRendering", commonDataLabelEventArgs);
                                if (model['dataLabelSettings'].labelRotationMode == sunburstLabelRotationMode.normal && model['dataLabelSettings'].labelOverflowMode != sunburstLabelOverflowMode.none && this.isNullOrUndefined(model['dataLabelSettings'].template)) {
                                    text = this.horizontalTrim(textOptions, textsize['width'], commonDataLabelEventArgs.data.Text, startX, startY, point, this.model.dataLabelSettings.font, layerNumber - 1);
                                }
                                else if (model['dataLabelSettings'].labelRotationMode == sunburstLabelRotationMode.angle && model['dataLabelSettings'].labelOverflowMode != sunburstLabelOverflowMode.none && this.isNullOrUndefined(model['dataLabelSettings'].template)) {
                                    text = this.rotatedTrim(textOptions, textsize['width'], commonDataLabelEventArgs.data.Text, sliceRadius, point);
                                }
                                if (text != '') {
                                    textele = this.createText(textOptions, text);
                                    this.dataLabelGroupEle.appendChild(textele);
                                }
                            }
                            else {
                                this.labelTemplate(positionX, positionY, textOptions, textsize, point);
                            }
                        }
                    }
                }
                return this.dataLabelGroupEle;
            };
            SunburstChart.prototype.labelTemplate = function (positionX, positionY, textOptions, textsize, point) {
                var areaBoundsX, areaBoundsY, areaBoundsWidth, areaBoundsHeight, xPosition = 0, yPosition = 0, sunburstContainer = this._id, style = { 'interior': this.model.dataLabelSettings.fill, 'opacity': 1, 'borderColor': 'white', 'borderWidth': 0.1 }, color, width, height, templateContainer, templategroup, left, top, right, backgroundColor;
                if (!this.isNullOrUndefined(style) && style['interior']) {
                    color = style['interior'];
                }
                else {
                    color = "transparent";
                }
                templategroup = document.getElementById(this._id + "_svg_DataLabelGroup");
                if (this.isNullOrUndefined(templategroup)) {
                    templategroup = document.createElement('div');
                    templategroup.id = this._id + "_svg_DataLabelGroup";
                    templategroup.style.zIndex = '5000';
                    document.getElementById(this._id).appendChild(templategroup);
                }
                templateContainer = document.createElement('div');
                templateContainer.id = 'template_ele_' + this._id;
                this.clonenode = document.getElementById(this.model.dataLabelSettings.template).cloneNode(true);
                this.clonenode['style'].display = 'block';
                this.clonenode['innerHTML'] = this.parseTemplate(this.clonenode, point);
                templateContainer.style.backgroundColor = color;
                templateContainer.style.display = 'block';
                templateContainer.style.cursor = 'default';
                templateContainer.style.position = 'absolute';
                templateContainer.appendChild(this.clonenode);
                document.getElementById(this._id + "_svg_DataLabelGroup").appendChild(templateContainer);
                left = templateContainer.clientWidth;
                top = templateContainer.clientHeight;
                templateContainer.style.left = (textOptions['x'] - left / 2).toString() + 'px';
                templateContainer.style.top = (textOptions['y'] - top / 2).toString() + 'px';
            };
            SunburstChart.prototype.parseTemplate = function (clonenode, point) {
                var str;
                str = clonenode.innerHTML;
                if (str.search('#point.x#') != -1) {
                    str = str.replace('#point.x#', point['x'].toString());
                }
                if (str.search('#point.y#') != -1) {
                    str = str.replace('#point.y#', point['y'].toString());
                }
                if (str.search('#point.text#') != -1) {
                    if (!this.isNullOrUndefined(point['text'])) {
                        str = str.replace('#point.text#', point['text'].toString());
                    }
                    else {
                        str = str.replace('#point.text#', point['y'].toString());
                    }
                }
                return str;
            };
            SunburstChart.prototype.rotatedTrim = function (textOptions, textSize, text, radius, point) {
                var ellipsis = '...', model = this.model;
                while (radius - model['segmentBorder'].width < textSize) {
                    if (model['dataLabelSettings'].labelOverflowMode == sunburstLabelOverflowMode.trim) {
                        text = this.trimText(text, text.length, ellipsis);
                        if (text == '...') {
                            text = '';
                            break;
                        }
                        else
                            textSize = this.measureText(text, model['dataLabelSettings'].font)['width'];
                    }
                    else {
                        text = '';
                        break;
                    }
                }
                return text;
            };
            SunburstChart.prototype.trimText = function (text, maxLength, ellipsis) {
                var length, trimmedText;
                maxLength--;
                length = maxLength - ellipsis.length;
                trimmedText = text.substr(0, length);
                return trimmedText + ellipsis;
            };
            SunburstChart.prototype.horizontalTrim = function (textOptions, datalabelLength, datalabelText, startX, startY, point, datalabelFont, layerNumber) {
                var sunburstStartAngle = -0.5 * Math.PI, startAngle, endAngle, pointStartAngle, pointEndAngle, ellipsis = '...', totalDegree, distanceFromCenter, textinRegion, model = this.model, position;
                position = this.calculatePosition(textOptions, datalabelLength, startX, startY);
                startAngle = model['startAngle'];
                endAngle = model['endAngle'];
                totalDegree = endAngle - startAngle;
                startAngle = (Math.atan2(position['rightEndY'], position['rightEndX']) - sunburstStartAngle) % (2 * Math.PI);
                if (startAngle < 0)
                    startAngle = 2 * Math.PI + startAngle;
                endAngle = (Math.atan2(position['leftEndY'], position['leftEndX']) - sunburstStartAngle) % (2 * Math.PI);
                if (endAngle < 0)
                    endAngle = 2 * Math.PI + endAngle;
                pointStartAngle = parseFloat(point['start'].toFixed(14));
                pointEndAngle = parseFloat(point['end'].toFixed(14));
                if (totalDegree > 0) {
                    pointStartAngle = pointStartAngle;
                    pointEndAngle = pointEndAngle;
                }
                else {
                    pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                    pointEndAngle = pointEndAngle < 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                }
                if (startAngle < 0 && (endAngle > 0 || endAngle == null)) {
                    pointStartAngle = pointStartAngle < 0 ? 2 * Math.PI + pointStartAngle : pointStartAngle;
                    pointEndAngle = pointEndAngle <= 0 ? 2 * Math.PI + pointEndAngle : pointEndAngle;
                }
                if (this.circleCenterX < textOptions['x'])
                    distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position['rightEndX']), 2) + Math.pow(Math.abs(position['rightEndY']), 2));
                else
                    distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position['leftEndX']), 2) + Math.pow(Math.abs(position['leftEndY']), 2));
                if (totalDegree < 0)
                    pointEndAngle = [pointStartAngle, pointStartAngle = pointEndAngle][0];
                if ((endAngle >= pointStartAngle && endAngle <= pointEndAngle) && (startAngle >= pointStartAngle && startAngle <= pointEndAngle) &&
                    (distanceFromCenter <= this.circularRadius[layerNumber] - model['segmentBorder'].width && distanceFromCenter > 0)) {
                    textinRegion = true;
                }
                else {
                    if (model['dataLabelSettings'].labelOverflowMode == sunburstLabelOverflowMode.hide) {
                        return '';
                    }
                    else {
                        textinRegion = false;
                        while (!textinRegion) {
                            datalabelText = this.trimText(datalabelText, datalabelText.length, ellipsis);
                            if (datalabelText == ellipsis) {
                                datalabelText = '';
                                break;
                            }
                            datalabelLength = this.measureText(datalabelText, model['dataLabelSettings'].font)['width'];
                            position = this.calculatePosition(textOptions, datalabelLength, startX, startY);
                            startAngle = (Math.atan2(position['rightEndY'], position['rightEndX']) - sunburstStartAngle) % (2 * Math.PI);
                            if (startAngle < 0)
                                startAngle = 2 * Math.PI + startAngle;
                            endAngle = (Math.atan2(position['leftEndY'], position['leftEndX']) - sunburstStartAngle) % (2 * Math.PI);
                            if (endAngle < 0)
                                endAngle = 2 * Math.PI + endAngle;
                            if (this.circleCenterX < textOptions['x'])
                                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position['rightEndX']), 2) + Math.pow(Math.abs(position['rightEndY']), 2));
                            else
                                distanceFromCenter = Math.sqrt(Math.pow(Math.abs(position['leftEndX']), 2) + Math.pow(Math.abs(position['leftEndY']), 2));
                            if ((endAngle >= pointStartAngle && endAngle <= pointEndAngle) && (startAngle >= pointStartAngle && startAngle <= pointEndAngle) && (distanceFromCenter <= this.circularRadius[layerNumber] && distanceFromCenter > 0)) {
                                textinRegion = true;
                            }
                        }
                    }
                }
                return datalabelText;
            };
            SunburstChart.prototype.calculatePosition = function (textOptions, datalabelLength, startX, startY) {
                var rightEndX, rightEndY, leftEndX, leftEndY;
                rightEndX = (textOptions['x'] + (datalabelLength / 2)) - startX;
                rightEndY = textOptions['y'] - startY;
                leftEndX = (textOptions['x'] - (datalabelLength / 2)) - startX;
                leftEndY = textOptions['y'] - startY;
                return { 'rightEndX': rightEndX, 'rightEndY': rightEndY, 'leftEndX': leftEndX, 'leftEndY': leftEndY };
            };
            SunburstChart.prototype.textOptions = function (point, positionX, positionY, textsize, textAnchor, layerNumber, pointIndex) {
                var degree, correctAngle, angle = 0, textOptions, hexaValue, pointColor, dataLabelFont = this.model.dataLabelSettings.font, textColor = dataLabelFont['color'];
                if (this.model.dataLabelSettings.labelRotationMode == sunburstLabelRotationMode.angle) {
                    if (point.midAngle > (2 * Math.PI) || point.midAngle < 0) {
                        correctAngle = this.findAngle(point.midAngle);
                    }
                    if (point.midAngle <= Math.PI || !this.isNullOrUndefined(correctAngle)) {
                        if (this.isNullOrUndefined(correctAngle))
                            angle = (((point.startAngle - (Math.PI / 2)) + (point.endAngle - (Math.PI / 2))) / 2) * (180 / Math.PI);
                        else {
                            if (correctAngle <= Math.PI)
                                angle = (((point.startAngle - (Math.PI / 2)) + (point.endAngle - (Math.PI / 2))) / 2) * (180 / Math.PI);
                            else
                                angle = ((((point.startAngle + point.endAngle) / 2) * 180) / Math.PI) - 270;
                        }
                    }
                    else {
                        angle = ((((point.startAngle + point.endAngle) / 2) * 180) / Math.PI) - 270;
                    }
                }
                pointColor = this._colorNameToHex(point.fill);
                if (this.isNullOrUndefined(textColor) || textColor == "") {
                    var rgbValue = this._hexToRgb(pointColor);
                    var contrast = Math.round(((parseInt(rgbValue.r) * 299) + (parseInt(rgbValue.g) * 587) + (parseInt(rgbValue.b) * 114)) / 1000);
                    textColor = (contrast >= 128) ? "black" : "white";
                }
                textOptions = {
                    'id': this._id + '_legendIndex' + point.legendIndex + '_layerNumber' + layerNumber.toString() + '_pointIndex' + pointIndex.toString(),
                    'x': positionX,
                    'y': positionY + (textsize.height / 4),
                    'fill': textColor,
                    'font-size': dataLabelFont['size'],
                    'font-family': dataLabelFont['fontFamily'],
                    'font-style': dataLabelFont['fontStyle'],
                    'font-weight': dataLabelFont['fontWeight'],
                    'opacity': dataLabelFont['opacity'],
                    'text-anchor': textAnchor,
                    'cursor': 'default',
                    'transform': 'rotate(' + angle + ',' + (positionX) + ',' + (positionY) + ')',
                };
                return textOptions;
            };
            SunburstChart.prototype._colorNameToHex = function (colour) {
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
            };
            SunburstChart.prototype._hexToRgb = function (hex) {
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                return result ? {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                } : null;
            };
            SunburstChart.prototype.findAngle = function (midAngle) {
                var totalangle;
                if (midAngle > 0) {
                    totalangle = midAngle % (2 * Math.PI);
                    if (totalangle > (2 * Math.PI)) {
                        this.findAngle(totalangle);
                    }
                    else
                        return totalangle;
                }
                else {
                    return ((2 * Math.PI) + midAngle);
                }
            };
            SunburstChart.prototype.calculateLabelPosition = function (startPoints, bounds) {
                var positionX, positionY, midX, midY, childMidX, childMidY, startX, startY, dMidX, dMidY;
                midX = bounds.midPoint.midX;
                midY = bounds.midPoint.midY;
                childMidX = bounds.childMidPoint.childMidX;
                childMidY = bounds.childMidPoint.childMidY;
                startX = startPoints.startX;
                startY = startPoints.startY;
                dMidX = bounds.sunburstMidPoint.dMidX;
                dMidY = bounds.sunburstMidPoint.dMidY;
                if (this.isNullOrUndefined(childMidX)) {
                    positionX = (midX + dMidX) / 2;
                    positionY = (midY + dMidY) / 2;
                }
                else {
                    positionX = (midX + childMidX) / 2;
                    positionY = (midY + childMidY) / 2;
                }
                return { positionX: positionX, positionY: positionY };
            };
            SunburstChart.prototype.drawPath = function (Options) {
                var path = document.getElementById(Options._id);
                if (path === null) {
                    path = this.createElement('path');
                }
                this.setAttributes(Options, path);
                return path;
            };
            SunburstChart.prototype.sunburstRender = function (layerData) {
                this.circleCenterX = [];
                this.circleCenterY = [];
                this.circularRadius = [];
                this.sunburstRegions = [];
                this.startX = [];
                this.startY = [];
                this._visiblePoints = layerData;
                var layer;
                this.calculateSliceAngle(layerData[0].point);
                for (layer = 2; layer <= this.totallayerCount; layer++) {
                    for (var j = 1; j < layerData.length; j++) {
                        if (layer == layerData[j].layerNumber) {
                            if (layerData[j].point.length > 0)
                                this.calculateChildAngle(layerData[j]);
                        }
                    }
                }
                this.circularRadius = this.calculateRadius((this.areaBounds['actualWidth']), (this.areaBounds['actualHeight']), this.totallayerCount);
                if (this._drillInnerRadius.length == 0)
                    this.circularRadius = this.calculateRadius((this.areaBounds['actualWidth']), (this.areaBounds['actualHeight']), this.totallayerCount);
                else {
                    this.circularRadius = this._drillOuterRadius[this.drilldownCount - 1];
                    this.innerRadius = this._drillInnerRadius[this.drilldownCount - 1];
                }
                this.gSeriesGroupEle = this.createGroup({ 'id': this._id + '_svg_SunBurstElementGroup' });
                for (var i = this.totallayerCount; i > 0; i--) {
                    for (var j = 0; j < layerData.length; j++) {
                        if (i == layerData[j].layerNumber) {
                            this.drawRegion(layerData[j], j);
                        }
                    }
                }
                this.sunburstDoubleClick = this.sunburstDoubleClick.bind(this);
                this.gSeriesGroupEle.addEventListener('dblclick', this.sunburstDoubleClick, true);
                return this.gSeriesGroupEle;
            };
            SunburstChart.prototype.calculateArcData = function (point, layerNumber, radius) {
                var visiblePoints, chartStartAngle, startAngle, endAngle, totalDegree, longArc, midAngle, direction, startX, startY, clockWise, x1, x2, y1, y2, centerx, centery;
                visiblePoints = this.model.points;
                chartStartAngle = -.5 * Math.PI;
                startAngle = point.startAngle + chartStartAngle;
                endAngle = point.endAngle + chartStartAngle - 0.000001;
                totalDegree = this.model.endAngle - this.model.startAngle;
                longArc = endAngle - startAngle < Math.PI ? 0 : 1;
                midAngle = (startAngle + endAngle) / 2;
                if (point.currentMidAngle == undefined) {
                    point.currentMidAngle = (startAngle + endAngle) / 2;
                }
                clockWise = totalDegree > 0 ? 1 : 0;
                longArc = clockWise ? endAngle - startAngle < Math.PI ? 0 : 1 : endAngle - startAngle > -1 * Math.PI ? 0 : 1;
                startX = this.circleCenterX;
                startY = this.circleCenterY;
                x1 = startX + radius * Math.cos(startAngle);
                y1 = startY + radius * Math.sin(startAngle);
                x2 = startX + radius * Math.cos(endAngle);
                y2 = startY + radius * Math.sin(endAngle);
                var dStartX = startX + this.innerRadius[layerNumber - 1] * Math.cos(startAngle);
                var dStartY = startY + this.innerRadius[layerNumber - 1] * Math.sin(startAngle);
                var dEndX = startX + this.innerRadius[layerNumber - 1] * Math.cos(endAngle);
                var dEndY = startY + this.innerRadius[layerNumber - 1] * Math.sin(endAngle);
                var dClockWise = clockWise ? 0 : 1;
                if ((startAngle < 0) && Math.round(point.endAngle - point.startAngle) == 6) {
                    dEndX = dEndX - 0.01;
                    x2 = x2 - 0.01;
                }
                direction = "M" + " " + x1 + " " + y1 + " " + "A" + " " + radius + " " + radius + " " + "0" + " " + longArc + " " + clockWise + " " + x2 + " " + y2 + " " + "L" + " " + dEndX + " " + dEndY + " " + "A" + " " + this.innerRadius[layerNumber - 1] + " " + this.innerRadius[layerNumber - 1] + " " + "1" + " " + longArc + " " + dClockWise + " " + dStartX + " " + dStartY + " " + "z";
                return { Direction: direction, centerX: centerx, centerY: centery };
            };
            SunburstChart.prototype.findParent = function (visiblePoints) {
                var parentLayer = visiblePoints.layerNumber - 1, parentChildName;
                for (var i = 0; i < this._visiblePoints.length; i++) {
                    if (parentLayer == this._visiblePoints[i]['layerNumber']) {
                        for (var j = 0; j < this._visiblePoints[i]['point'].length; j++) {
                            if (this._visiblePoints[i]['point'][j].x == visiblePoints.parentName
                                && this._visiblePoints[i]['point'][j].legendIndex == visiblePoints.legendIndex) {
                                if (!this.isNullOrUndefined(this.model.dataSource)) {
                                    for (var k = 0; k < visiblePoints.point.length; k++) {
                                        parentChildName = this._visiblePoints[i]['point'][j].parentChildName;
                                        var len = visiblePoints.point[k].parentChildName.length - visiblePoints.point[k].x.length - 1;
                                        if (visiblePoints.point[k].parentChildName.substr(0, len) == parentChildName)
                                            return this._visiblePoints[i]['point'][j];
                                    }
                                }
                                else {
                                    return this._visiblePoints[i]['point'][j];
                                }
                            }
                        }
                    }
                }
            };
            SunburstChart.prototype.drawRegion = function (visiblePoints, layerIndex) {
                var result, options, sliceXY, point, id, region, sunburstRegion = [], sunburstData, radius, model = this.model, startAngle, opacity, fill = model["segmentBorder"].color, commonsegmentRendering, selected, selection, regionColor, pathElement;
                startAngle = this.model.startAngle * (Math.PI / 180);
                selection = model['selectionSettings'];
                fill = this.isNullOrUndefined(fill) ? (this.model.theme.toString().search("dark") != -1 ? "black" : "white") : fill;
                for (var j = 0; j < visiblePoints.point.length; j++) {
                    selected = false;
                    opacity = model['opacity'];
                    if (isNaN(visiblePoints.point[j].startAngle))
                        continue;
                    point = visiblePoints.point[j];
                    regionColor = point['fill'];
                    result = this.calculateArcData(point, visiblePoints.layerNumber, this.circularRadius[visiblePoints.layerNumber - 1]);
                    sliceXY = result['Direction'].split(" ");
                    radius = this.circularRadius[visiblePoints.layerNumber - 1];
                    point['layerIndex'] = layerIndex;
                    id = this._id + '_legendIndex' + point['legendIndex'] + '_layerNumber' + visiblePoints.layerNumber.toString() + '_layerIndex' + layerIndex.toString() + '_pointIndex' + j.toString();
                    for (var i = 0; i < this.selectedgroupID.length; i++) {
                        if (id == this.selectedgroupID[i]) {
                            selected = true;
                        }
                    }
                    if (selection['type'] == sunburstSelectionType.opacity && !selected && this.selectedgroupID.length > 0)
                        opacity = selection['opacity'];
                    point['id'] = id;
                    options = {
                        'id': id,
                        'fill': point['fill'],
                        'stroke-width': model['segmentBorder'].width,
                        'stroke-dasharray': '',
                        'd': result['Direction'],
                        'stroke': fill,
                        'stroke-linecap': "butt",
                        'stroke-linejoin': "round",
                        'opacity': opacity,
                        'visibility': this._enableAnimation ? 'hidden' : 'visible'
                    };
                    commonsegmentRendering = $.extend({}, this.common);
                    commonsegmentRendering['data'] = { 'point': point, pathOptions: options };
                    this._trigger("segmentRendering", commonsegmentRendering);
                    pathElement = this.drawPath(options);
                    if (selected && selection['type'] == sunburstSelectionType.color)
                        this.selectPointData(pathElement);
                    this.gSeriesGroupEle.appendChild(pathElement);
                    region = {
                        'x': point['x'], 'y': point['y'], 'fill': point['fill'], 'text': point['text'],
                        layerNumber: visiblePoints.layerNumber, layerIndex: layerIndex, parentName: visiblePoints.parentName,
                        pointIndex: j, startAngle: point['startAngle'] - startAngle, endAngle: point['endAngle'] - startAngle, startX: this.startX,
                        startY: this.startY, groupNumber: visiblePoints.groupNumber, id: id,
                        legendIndex: point['legendIndex'], 'parentChildName': point['parentChildName']
                    };
                    sunburstRegion.push(region);
                }
                sunburstData = { Radius: this.circularRadius[visiblePoints.layerNumber - 1], centerX: this.circleCenterX, centerY: this.circleCenterY, innerRadius: this.innerRadius[visiblePoints['layerNumber'] - 1] };
                var finalRegion = { sunburstData: sunburstData, region: sunburstRegion };
                this.sunburstRegions.push(finalRegion);
            };
            SunburstChart.prototype.calculateRadius = function (width, height, layercount) {
                var radius = 0, radiusCollection = [], sunburstCoefficient, coefficient = this.model.radius, minimum = Math.min(width, height), availableRadius, holeCoefficient = this.model.innerRadius;
                this.innerRadius = [];
                sunburstCoefficient = coefficient > 1 ? 1 : coefficient < 0 ? 0 : coefficient;
                availableRadius = (minimum / 2) * sunburstCoefficient;
                if (holeCoefficient != 0)
                    this.innerRadius.push(holeCoefficient * availableRadius);
                else
                    this.innerRadius.push(0);
                for (var i = 0; i < layercount; i++) {
                    if (i == 0) {
                        radius = ((availableRadius - this.innerRadius[0]) / layercount) + this.innerRadius[0];
                        radiusCollection[i] = radius;
                    }
                    else {
                        this.innerRadius.push(radius);
                        radius = (radius - this.innerRadius[i - 1]) + radius;
                        radiusCollection[i] = radius;
                    }
                }
                return radiusCollection;
            };
            SunburstChart.prototype.calculateSliceAngle = function (visiblePoints) {
                var visiblePointLength = visiblePoints.length, sumofYValues = 0, totalDegree = 360, point, margin = this.model.margin, actualHeight, actualWidth, endAngle, itemCurrentXPos = 0, seriesIndex = 0, chartStarttingAngle, sunburstFactor, pointIndex, midAngle, legXSpace = 0, legYSpace = 0, borderWidth = this.model.border.width, legend = this.model.legend;
                for (var i = 0; i < visiblePointLength; i++) {
                    visiblePoints[i].y = !this.isNullOrUndefined(visiblePoints[i].y) ? visiblePoints[i].y : (!this.isNullOrUndefined(visiblePoints[i].point) ? this.calculateSumofY(visiblePoints[i], sumofYValues) : 0);
                    sumofYValues += visiblePoints[i].y;
                }
                if (this.model.startAngle > this.model.endAngle) {
                    if (this.model.endAngle == 0)
                        this.model.endAngle = 360;
                    else if (this.model.endAngle < 0) {
                        this.model.endAngle = 360 + this.model.endAngle;
                    }
                }
                if (this.model.endAngle != null && this.model.startAngle < this.model.endAngle)
                    totalDegree = this.model.endAngle - this.model.startAngle;
                else if (this.model.startAngle > this.model.endAngle && !this.isNullOrUndefined(this.model.endAngle)) {
                    totalDegree = (360 - this.model.startAngle) + this.model.endAngle;
                }
                else
                    totalDegree = 360;
                totalDegree = (totalDegree != 360 && totalDegree != -360) ? totalDegree % 360 : totalDegree;
                if (this.model.startAngle) {
                    this.model.startAngle = this.model.startAngle % 360;
                    this.model.endAngle = this.model.startAngle + totalDegree;
                    itemCurrentXPos = this.model.startAngle ? (sumofYValues / 360) * this.model.startAngle : 0;
                    itemCurrentXPos = itemCurrentXPos / sumofYValues;
                }
                else
                    this.model.endAngle = totalDegree;
                if (legend['visible']) {
                    if (legend['position'] == sunburstLegendPosition.right || legend['position'] == sunburstLegendPosition.left) {
                        legXSpace += this.elementSpacing + this.LegendBounds['Width'];
                        if (!this.isNullOrUndefined(legend['size']['width']))
                            legXSpace = parseFloat(legend['size']['width']);
                    }
                    else if (legend['position'] == sunburstLegendPosition.bottom || legend['position'] == sunburstLegendPosition.top) {
                        legYSpace += this.elementSpacing + this.LegendBounds['Height'];
                        if (!this.isNullOrUndefined(legend['size']['height']))
                            legYSpace = parseFloat(legend['size']['height']);
                    }
                }
                actualHeight = this.height - (legYSpace + margin['top'] + margin['bottom'] + (borderWidth * 2) + this.yOffset);
                actualWidth = this.width - (legXSpace + margin['left'] + margin['right'] + (borderWidth * 2));
                this.circleCenterX = (actualWidth * 0.5) + margin['left'] + ((legend['visible'] && legend['position'] == sunburstLegendPosition.left) ? legXSpace : 0);
                this.circleCenterY = (actualHeight * 0.5) + margin['top'] + this.yOffset + ((legend['visible'] && legend['position'] == sunburstLegendPosition.top) ? legYSpace : 0);
                totalDegree = this.model.endAngle - this.model.startAngle;
                sunburstFactor = totalDegree / 180;
                for (pointIndex = 0; pointIndex < visiblePointLength; pointIndex++) {
                    point = visiblePoints[pointIndex];
                    if (pointIndex == 0)
                        point.startAngle = 2 * Math.PI * itemCurrentXPos;
                    else
                        point.startAngle = endAngle;
                    endAngle = point.endAngle = sunburstFactor * Math.PI * (point.y / sumofYValues) + point.startAngle;
                    endAngle = point.endAngle = (isNaN(endAngle)) ? point.startAngle : endAngle;
                    point.start = point.startAngle;
                    point.end = point.endAngle;
                    point.midAngle = (point.endAngle + point.startAngle) / 2;
                    point.pointIndex = pointIndex;
                    chartStarttingAngle = -.5 * Math.PI;
                    point.radian = (point.midAngle / 2) % (2 * Math.PI);
                    itemCurrentXPos += point.y / sumofYValues;
                    midAngle = point.midAngle + chartStarttingAngle;
                    this.startX[pointIndex] = this.circleCenterX;
                    this.startY[pointIndex] = this.circleCenterY;
                }
            };
            SunburstChart.prototype.calculateTotaldegree = function (startAngle, endAngle) {
                var totalDegree = 0;
                if (startAngle < endAngle) {
                    totalDegree = endAngle - startAngle;
                }
                else if (startAngle > endAngle) {
                    totalDegree = 360 - startAngle + endAngle;
                }
                return totalDegree;
            };
            SunburstChart.prototype.calculateSumofY = function (visiblePoints, sumofYvalues) {
                var point = visiblePoints.point;
                for (var i = 0; i < point.length; i++) {
                    if (!this.isNullOrUndefined(point[i]['y']))
                        sumofYvalues += point[i]['y'];
                    else {
                        if (!this.isNullOrUndefined(point[i]['point'])) {
                            point[i]['y'] = this.calculateSumofY(point[i], sumofYvalues);
                            sumofYvalues += point[i]['y'];
                        }
                    }
                }
                return sumofYvalues;
            };
            SunburstChart.prototype.calculateChildAngle = function (visiblePoints) {
                var parentNode, endAngle, startAngle, totalAngle, sumofY = 0, parentY, ratio;
                parentNode = this.findParent(visiblePoints);
                for (var j = 0; j < visiblePoints.point.length; j++) {
                    sumofY = sumofY + visiblePoints.point[j].y;
                }
                parentY = parentNode.y;
                startAngle = endAngle = parentNode.startAngle;
                totalAngle = parentNode.endAngle - parentNode.startAngle;
                for (var i = 0; i < visiblePoints.point.length; i++) {
                    if (i == 0) {
                        visiblePoints.point[i].startAngle = startAngle;
                        visiblePoints.point[i].start = startAngle;
                        endAngle = ((visiblePoints.point[i].y / sumofY) * totalAngle) + startAngle;
                        visiblePoints.point[i].end = visiblePoints.point[i].endAngle = endAngle;
                        visiblePoints.point[i].midAngle = (visiblePoints.point[i].startAngle + visiblePoints.point[i].endAngle) / 2;
                    }
                    else {
                        visiblePoints.point[i].startAngle = endAngle;
                        visiblePoints.point[i].start = endAngle;
                        endAngle = ((visiblePoints.point[i].y / sumofY) * totalAngle) + endAngle;
                        visiblePoints.point[i].end = visiblePoints.point[i].endAngle = endAngle;
                        visiblePoints.point[i].midAngle = (visiblePoints.point[i].startAngle + visiblePoints.point[i].endAngle) / 2;
                    }
                }
            };
            SunburstChart.prototype.calculateSize = function (size, title) {
                var actualWidth, actualHeight, titleText, yOffset, realwidth, borderWidth = this.model.border.width, spaceValue, x, rightSpace, width, y, margin = this.model.margin, elementSpacing = this.elementSpacing;
                spaceValue = this._getLegendSpace(this.model.legend);
                x = spaceValue['leftLegendWidth'] + borderWidth + margin['left'];
                rightSpace = spaceValue['rightLegendWidth'] + margin['right'] + margin['left'] + (2 * borderWidth);
                width = size['width'];
                actualWidth = width - (x + rightSpace);
                y = margin['top'] + elementSpacing + spaceValue['modelTitleHeight'] + (spaceValue['modelsubTitleHeight']) + spaceValue['topLegendHeight'] + borderWidth;
                this.yOffset = (title['text'] && title['visible']) ? (this.titleLocation['size'].height + elementSpacing) + (title['subtitle'].text == '' ? 0 : (title['subtitle'].text && title['subtitle'].visible) ? (this.subTitleLocatation['size'].height) : 0) : 0;
                actualHeight = size['height'] - (spaceValue['modelTitleHeight'] + elementSpacing + margin['top'] + spaceValue['modelsubTitleHeight'] + spaceValue['topLegendHeight'] + spaceValue['bottomLegendHeight']);
                return { x: x, y: y, actualWidth: actualWidth, actualHeight: actualHeight };
            };
            SunburstChart.prototype._getLegendSpace = function (legend) {
                var bounds = this.LegendActualBounds, itemPadding = 10, elementSpacing = this.elementSpacing, legendBorder = this.model.legend.border.width, leftLegendWidth = 0, rightLegendWidth = 0, topLegendHeight = 0, bottomLegendHeight = 0, space, position = this.model.legend.position, ltheight = 0, titleHeight = 0, subtitleHeight = 0, modelTitleHeight, modelsubTitleHeight, maxHeight, maxWidth, title = this.model.title;
                elementSpacing = this.legendClicked ? 0 : elementSpacing;
                if (legend['visible']) {
                    space = (parseFloat(bounds['Width']) + (itemPadding / 2) + elementSpacing + (2 * legendBorder));
                    maxWidth = this.width * (20 / 100);
                    leftLegendWidth = position == sunburstLegendPosition.left ? space : 0;
                    if (leftLegendWidth > maxWidth && this.isNullOrUndefined(legend['size']['width'])) {
                        leftLegendWidth = maxWidth;
                    }
                    rightLegendWidth = position == sunburstLegendPosition.right ? space : 0;
                    if (rightLegendWidth > maxWidth && this.isNullOrUndefined(legend['size']['width'])) {
                        rightLegendWidth = maxWidth;
                    }
                    maxHeight = this.height * (20 / 100);
                    ltheight = legend['title'].visible ? this.measureText(legend['title'].text, legend['title'].font)['height'] : 0;
                    topLegendHeight = position == sunburstLegendPosition.top ? elementSpacing + parseFloat(bounds['Height']) + ltheight : 0;
                    bottomLegendHeight = position == sunburstLegendPosition.bottom ? elementSpacing + parseFloat(bounds['Height']) + ltheight : 0;
                    if (topLegendHeight > maxHeight && this.isNullOrUndefined(legend['size']['height'])) {
                        topLegendHeight = maxHeight;
                    }
                    else if (bottomLegendHeight > maxHeight && this.isNullOrUndefined(legend['size']['height'])) {
                        bottomLegendHeight = maxHeight;
                    }
                    this.LegendActualBounds['Height'] = (topLegendHeight == 0 && bottomLegendHeight != 0) ? bottomLegendHeight : (topLegendHeight != 0) ? topLegendHeight : this.LegendActualBounds['Height'];
                    this.LegendActualBounds['Width'] = (rightLegendWidth == 0 && leftLegendWidth != 0) ? leftLegendWidth : (rightLegendWidth != 0) ? rightLegendWidth : this.LegendActualBounds['Width'];
                }
                titleHeight = this.measureText(title['text'], title['font'])['height'];
                subtitleHeight = this.measureText(title['subtitle'].text, title['subtitle'].font)['height'];
                modelTitleHeight = (title['text'] == "" || !title['visible']) ? 0 : (titleHeight + elementSpacing);
                modelsubTitleHeight = (title['subtitle'].text == "" || !title['subtitle'].visible) ? 0 : (subtitleHeight);
                return {
                    leftLegendWidth: leftLegendWidth, rightLegendWidth: rightLegendWidth, topLegendHeight: topLegendHeight, bottomLegendHeight: bottomLegendHeight, modelTitleHeight: modelTitleHeight, modelsubTitleHeight: modelsubTitleHeight
                };
            };
            SunburstChart.prototype.calculateLegendBounds = function () {
                this.legendCollection = [];
                this.legendRegion = [];
                this.legendTextRegion = [];
                this._legendMaxHeight = 0;
                this._legendMaxWidth = 0;
                var legend = this.model.legend, padding = 10, legendSizeHeight = legend['size']['height'], legendSizeWidth = legend['size']['width'], itemPadding = legend['itemPadding'] > 0 ? legend['itemPadding'] : 0, position = legend['position'].toLowerCase(), width = 0, height = 0, svgHeight = this.height, svgWidth = this.width, legendItemWidth = 0, legendItemHeight = 0, legendWidth = 0, legendHeight = 0, legnedHeightIncr = 1, legendviewerHeight = 0, legendviewerWidth = 0, tempSeries = {}, legendSeries = [], rowCount = this.model.legend.rowCount, columnCount = this.model.legend.columnCount, elementSpacing = this.elementSpacing, titleSize = this.measureText(legend['title']['text'], legend['title']['font']), legendBorder = legend['border']['width'], borderSize = this.model.border.width, svgObjectHeight = svgHeight - ((elementSpacing * 4) + (borderSize * 2) + (legendBorder * 2)), svgObjectWidth = svgWidth - ((elementSpacing * 4) + (borderSize * 2) + (legendBorder * 2)), visiblePoints = [], length, legendColor, legendName, legendSeriesLength, currentLegend, shapeWidth, legendsize, colorGradName, point, bounds, legendHeightTemp, legendBounds;
                if (legend['visible']) {
                    visiblePoints = this.layerData[0]['point'];
                    length = visiblePoints.length;
                    for (var i = 0; i < length; i++) {
                        point = visiblePoints[i];
                        legendColor = visiblePoints[i]['fill'];
                        legendName = visiblePoints[i]['x'];
                        tempSeries = {
                            'sunburstLegendShape': legend['shape'],
                            'Text': legendName,
                            'displayText': legendName,
                            'font': legend['font'],
                            'groupNumber': visiblePoints[i]['groupNumber'],
                            'layerIndex': visiblePoints[i]['layerIndex'],
                            'layerNumber': visiblePoints[i]['layerNumber'],
                            'Shape': 'None',
                            'visibility': true,
                            'fill': visiblePoints[i]['fill'],
                            'points': visiblePoints[i]['point'],
                            'x': visiblePoints[i]['x'],
                            'y': visiblePoints[i]['y']
                        };
                        legendSeries.push(tempSeries);
                    }
                    legendSeriesLength = legendSeries.length;
                    for (var j = 0; j < legendSeriesLength; j++) {
                        currentLegend = legendSeries[j];
                        shapeWidth = legend['itemStyle']['width'];
                        legendsize = this._getLegendSize(currentLegend);
                        legendItemWidth = Math.max(this._legendMaxWidth > 0 ? (this._legendMaxWidth + itemPadding + shapeWidth) : legendsize['Width'], legendItemWidth);
                        legendItemHeight = Math.max(legendsize['Height'], legendItemHeight);
                    }
                    legendHeight = legendItemHeight + elementSpacing * 2;
                    legendWidth = legendItemWidth;
                    if (rowCount || columnCount) {
                        legendBounds = this.legendItemBounds(legendSeriesLength, legendItemWidth + itemPadding, legendItemHeight + itemPadding);
                        legendWidth = legendBounds['LegendWidth'];
                        legendHeight = legendBounds['LegendHeight'];
                        if (position === 'top' || position === 'bottom' || position === 'custom')
                            legendHeight = legendHeight - itemPadding + elementSpacing;
                        else
                            legendWidth = legendWidth - itemPadding;
                    }
                    for (var k_4 = 0; k_4 < legendSeriesLength; k_4++) {
                        currentLegend = legendSeries[k_4];
                        legendsize = this._getLegendSize(currentLegend);
                        bounds = (rowCount || columnCount) ? { 'Width': legendItemWidth, 'Height': legendItemHeight } : legendsize;
                        bounds['_Width'] = legendsize['Width'];
                        legendSeries[k_4]['Bounds'] = bounds;
                        this.legendCollection.push(currentLegend);
                    }
                    for (var k = 0; k < legendSeriesLength; k++) {
                        currentLegend = legendSeries[k];
                        legendsize = this._getLegendSize(currentLegend);
                        if (!(rowCount) && !(columnCount)) {
                            if ((position == 'top' || position == 'bottom' || position == 'custom')) {
                                width += legendsize['Width'] + itemPadding;
                                if (width > svgObjectWidth && k != 0) {
                                    width -= legendsize['Width'] + itemPadding;
                                    legendWidth = Math.max(legendWidth, width);
                                    width = legendsize['Width'] + itemPadding;
                                    legnedHeightIncr++;
                                    legendHeight += legendItemHeight + itemPadding;
                                }
                                else
                                    legendWidth = Math.max(legendWidth, width);
                                height = Math.max(height, legendItemHeight);
                            }
                            else {
                                height += legendsize['Height'] + itemPadding;
                                if (height > svgObjectHeight) {
                                    height -= legendsize['Height'] + itemPadding;
                                    legendHeight = Math.max(legendHeight, height);
                                    height = legendsize['Height'] + itemPadding;
                                    legendWidth += legendItemWidth + itemPadding;
                                }
                                else
                                    legendHeight = Math.max(legendHeight, height);
                                width = Math.max(width, legendItemWidth);
                            }
                        }
                        bounds = (rowCount || columnCount) ? { Width: legendItemWidth, Height: legendItemHeight } : legendsize;
                        bounds['_Width'] = legendsize['Width'];
                        legendSeries[k]['Bounds'] = bounds;
                    }
                    if (position === 'top' || position === 'bottom' || position === 'custom') {
                        legendWidth = titleSize['width'] > legendWidth - itemPadding ? (titleSize['width'] + padding * 2 + itemPadding) : legendWidth + padding * 2;
                        width += padding;
                        height += padding * 2;
                        this.LegendBounds = { 'Width': Math.max(legendWidth, width) - itemPadding, 'Height': Math.max(legendHeight, height), 'Rows': legnedHeightIncr };
                    }
                    else {
                        legendWidth = titleSize['width'] > legendWidth - itemPadding ? (titleSize['width'] + padding * 2 + itemPadding) : legendWidth + padding * 2;
                        width += padding;
                        height += padding * 2;
                        if (legend['rowCount'] == null && legend['columnCount'] == null)
                            this.LegendBounds = { 'Width': width, 'Height': height, 'Columns': legnedHeightIncr };
                        else
                            this.LegendBounds = { 'Width': Math.max(legendWidth, width), 'Height': Math.max(legendHeight, height) + padding - itemPadding, 'Columns': legnedHeightIncr };
                    }
                }
                else {
                    this.LegendBounds = { Width: 0, Height: 0 };
                }
                this.LegendActualBounds = this.LegendBounds;
                if (legendSizeWidth != null)
                    this.LegendActualBounds['Width'] = legendSizeWidth;
                if (legendSizeHeight != null)
                    this.LegendActualBounds['Height'] = legendSizeHeight;
            };
            SunburstChart.prototype._getLegendSize = function (series) {
                var legend = this.model.legend, symbolSize = legend['itemStyle'], textsize = this.measureText(series['Text'], series['font']), padding = 10, width = symbolSize['width'] + padding + textsize['width'], height = Math.max(symbolSize['height'], textsize['height']);
                return { 'Width': width, 'Height': height };
            };
            SunburstChart.prototype.legendItemBounds = function (itemCount, legendItemWidth, legendItemHeight) {
                var legend = this.model.legend, legVal, position = legend['position'], itemPadding = legend['itemPadding'], legnedHeightIncr, column, legendWidth = 0, legendHeight = 0;
                if (this.isNullOrUndefined(legend['columnCount']) && legend['rowCount']) {
                    legnedHeightIncr = legend['rowCount'];
                    column = Math.ceil(itemCount / legnedHeightIncr);
                    legendWidth = legendItemWidth * column;
                    legendHeight = legendItemHeight * legnedHeightIncr;
                }
                else if (this.isNullOrUndefined(legend['rowCount']) && legend['columnCount']) {
                    legnedHeightIncr = Math.ceil(itemCount / legend['columnCount']);
                    legVal = legend['columnCount'];
                    legendWidth = legendItemWidth * legVal;
                    legendHeight = legendItemHeight * legnedHeightIncr;
                }
                else if ((legend['rowCount']) && legend['columnCount']) {
                    if (legend['columnCount'] < legend['rowCount']) {
                        legnedHeightIncr = legend['rowCount'];
                        column = Math.ceil(itemCount / legnedHeightIncr);
                        legendWidth = legendItemWidth * column;
                        legendHeight = legendItemHeight * legnedHeightIncr;
                    }
                    else if (legend['columnCount'] > legend['rowCount']) {
                        if (position === 'top' || position === 'bottom' || position === 'custom') {
                            legnedHeightIncr = Math.ceil(itemCount / legend['columnCount']);
                            legVal = legend['columnCount'];
                            legendWidth = legendItemWidth * legVal;
                            legendHeight = legendItemHeight * legnedHeightIncr;
                        }
                        else {
                            legnedHeightIncr = Math.ceil(itemCount / legend['columnCount']);
                            column = Math.ceil(itemCount / legnedHeightIncr);
                            legendWidth = legendItemWidth * column;
                            legendHeight = legendItemHeight * legnedHeightIncr;
                        }
                    }
                    else {
                        if (position === 'top' || position === 'bottom') {
                            legnedHeightIncr = Math.ceil(itemCount / legend['columnCount']);
                            legVal = Math.ceil(itemCount / legend['rowCount']);
                            legendWidth = legendItemWidth * legend['columnCount'];
                            legendHeight = legendItemHeight * legVal;
                        }
                        else {
                            legnedHeightIncr = legend['rowCount'];
                            column = Math.ceil(itemCount / legnedHeightIncr);
                            legendWidth = legendItemWidth * column;
                            legendHeight = legendItemHeight * legnedHeightIncr;
                        }
                    }
                }
                legendHeight += this.elementSpacing;
                return { LegendWidth: legendWidth, LegendHeight: legendHeight };
            };
            SunburstChart.prototype.drawTitle = function (titleOptions, size) {
                var textSize, x, y, options, titleEle, commonTitleEventArgs, elementSpacing = this.elementSpacing, fill = titleOptions['font'].color;
                fill = this.isNullOrUndefined(fill) ? (this.model.theme.toString().indexOf("dark") != -1 ? "white" : "black") : fill;
                textSize = this.measureText(titleOptions['text'], titleOptions['font']);
                x = titleOptions['textAlignment'] == sunburstAlignment.center ? (size['width'] / 2 - textSize['width'] / 2) : (titleOptions['textAlignment'] == sunburstAlignment.near ? (2 * elementSpacing) : (size['width'] - textSize['width'] - (2 * elementSpacing)));
                y = textSize['height'] / 2 + elementSpacing;
                commonTitleEventArgs = $.extend({}, this.common);
                commonTitleEventArgs.data = { TitleText: titleOptions['text'], location: { X: x, Y: y }, size: textSize };
                this._trigger("titleRendering", commonTitleEventArgs);
                options = {
                    'id': this._id + "SunburstTitle",
                    'x': commonTitleEventArgs.data.location.X,
                    'y': commonTitleEventArgs.data.location.Y,
                    'fill': fill,
                    'font-size': titleOptions['font'].size,
                    'font-family': titleOptions['font'].fontFamily,
                    'font-style': titleOptions['font'].fontStyle,
                    'font-weight': titleOptions['font'].fontWeight,
                    'opacity': titleOptions['font'].opacity,
                    'text-anchor': 'start'
                };
                this.gTitleGroupElement = this.createGroup({ id: this._id + "_Sunburst_Title" });
                titleEle = this.createText(options, commonTitleEventArgs.data.TitleText);
                this.gTitleGroupElement.appendChild(titleEle);
                this.titleLocation = { size: textSize, x: commonTitleEventArgs.data.location.X, y: commonTitleEventArgs.data.location.Y };
                if (titleOptions['subtitle'].text != "" && titleOptions['subtitle'].visible) {
                    this.drawSubtitle(titleOptions, size, textSize, this.titleLocation);
                }
                return this.gTitleGroupElement;
            };
            SunburstChart.prototype.drawSubtitle = function (titleOptions, size, titleSize, titleLocation) {
                var subtitleSize, x, y, options, subtitleEle, textAnchor, fill = titleOptions['subtitle'].font.color;
                fill = this.isNullOrUndefined(fill) ? (this.model.theme.toString().indexOf("dark") != -1 ? "white" : "black") : fill;
                subtitleSize = this.measureText(titleOptions['subtitle'].text, titleOptions['subtitle'].font);
                x = titleOptions['subtitle'].textAlignment == sunburstAlignment.far ? titleLocation['x'] + titleLocation['size'].width : (titleOptions['subtitle'].textAlignment == sunburstAlignment.near) ? titleLocation['x'] : (titleLocation['x'] + (titleSize['width'] / 2));
                y = titleLocation['size'].height + (2 * this.elementSpacing);
                textAnchor = titleOptions['subtitle'].textAlignment == sunburstAlignment.far ? "end" : (titleOptions['subtitle'].textAlignment == sunburstAlignment.near) ? "start" : "middle";
                options = {
                    'id': this._id + "SunburstSunbtitle",
                    'x': x,
                    'y': y,
                    'fill': fill,
                    'font-size': titleOptions['subtitle'].font.size,
                    'font-family': titleOptions['subtitle'].font.fontFamily,
                    'font-style': titleOptions['subtitle'].font.fontStyle,
                    'font-weight': titleOptions['subtitle'].font.fontWeight,
                    'opacity': titleOptions['subtitle'].font.opacity,
                    'text-anchor': textAnchor,
                };
                this.subTitleLocatation = { size: subtitleSize, x: x, y: y };
                subtitleEle = this.createText(options, titleOptions['subtitle'].text);
                this.gTitleGroupElement.appendChild(subtitleEle);
            };
            SunburstChart.prototype.measureText = function (text1, fontOptions) {
                var element = document.querySelectorAll("#measureTex"), textObj;
                if (element.length == 0) {
                    textObj = document.createElement('text');
                    textObj.setAttribute('id', 'measureTex');
                    document.body.appendChild(textObj);
                }
                else {
                    textObj = element[0];
                    textObj.style.display = 'block';
                }
                textObj.innerHTML = text1;
                textObj.style.fontSize = fontOptions['size'];
                textObj.style.fontFamily = fontOptions['fontFamily'];
                textObj.style.fontWeight = fontOptions['fontWeight'];
                textObj.style.backgroundColor = 'white';
                textObj.style.position = 'absolute';
                textObj.style.visibility = 'hidden';
                textObj.style.whiteSpace = 'nowrap';
                return { width: textObj.offsetWidth, height: textObj.offsetHeight };
            };
            SunburstChart.prototype.drawContainerRect = function () {
                var rect, rectOptions;
                rectOptions = {
                    'id': this._id + "_svg" + '_svgRect',
                    'x': 0,
                    'y': 0,
                    'width': this.width,
                    'height': this.height,
                    'fill': this.model.background || "transparent",
                    'stroke': this.model.border.color,
                    'stroke-width': this.model.border.width,
                    'opacity': '0.5'
                };
                rect = this.drawRect(rectOptions);
                return rect;
            };
            SunburstChart.prototype.processData = function (visiblePoints) {
                var visiblePointsLength = visiblePoints.length, point;
                this.findBaseData(visiblePoints);
                for (var i = 0; i < visiblePoints.length; i++) {
                    point = visiblePoints[i];
                    point['legendIndex'] = i;
                    if (visiblePoints[i].point) {
                        this.findLayerData(visiblePoints[i].point, visiblePoints[i].x, 1, visiblePoints[i].groupNumber, i);
                    }
                }
            };
            SunburstChart.prototype.findBaseData = function (visiblePoins) {
                var layerpoints = [];
                this.layerData = [];
                for (var i = 0; i < visiblePoins.length; i++) {
                    layerpoints.push(visiblePoins[i]);
                    layerpoints[i]['groupNumber'] = i + 1;
                    layerpoints[i]['layerIndex'] = 0;
                    layerpoints[i]['layerNumber'] = 1;
                    layerpoints[i]['legendIndex'] = i;
                    visiblePoins[i].groupNumber = i + 1;
                }
                this.layerData.push({ point: layerpoints, layerNumber: 1, legendIndex: 0 });
                this.totallayerCount = 1;
            };
            SunburstChart.prototype.findLayerData = function (point, parentName, layerNumber, groupNumber, legendIndex) {
                var points = [];
                for (var j = 0; j < point.length; j++) {
                    if (point[j].point && point[j].point.length > 0) {
                        point[j].legendIndex = legendIndex;
                        this.findLayerData(point[j].point, point[j].x, layerNumber + 1, groupNumber, legendIndex);
                        point[j].layerIndex = this.layerData.length;
                        points.push(point[j]);
                    }
                    else {
                        point[j].legendIndex = legendIndex;
                        point[j].layerIndex = this.layerData.length;
                        points.push(point[j]);
                    }
                }
                point.layerData = this.layerData.length;
                this.layerData.push({ point: points, parentName: parentName, layerNumber: layerNumber + 1, groupNumber: groupNumber, layerIndex: this.layerData.length, legendIndex: legendIndex });
                if ((layerNumber + 1) > this.totallayerCount) {
                    this.totallayerCount = layerNumber + 1;
                }
            };
            SunburstChart.prototype.setColors = function (points) {
                var defaultColors = ["#3082bd", "#e55725", "#9cbb59", "#F6851F", "#8165a3", "#4fa045", "#d456a0", "#0dbdef", "#e2a325", "#03a09c"], index, palette = this.model.palette, fill;
                for (var i = 0; i < points.length; i++) {
                    if (this.isNullOrUndefined(points[i]['fill']) || this._sunburstRedraw) {
                        if (!this.isNullOrUndefined(palette) && palette.length == 0)
                            points[i]['fill'] = "black";
                        else {
                            points[i]['fill'] = (this.isNullOrUndefined(palette)) ? defaultColors[i % defaultColors.length] : palette[i % palette.length];
                            if (points[i]['fill'].trim().length == 0)
                                points[i]['fill'] = "black";
                        }
                        if (!this.isNullOrUndefined(points[i]['point'])) {
                            this.setchildColors(points[i]['point'], points[i]['fill']);
                        }
                    }
                    else {
                        if (!this.isNullOrUndefined(points[i]['point'])) {
                            if (points[i]['fill'].trim().length == 0)
                                points[i]['fill'] = "black";
                            this.setchildColors(points[i]['point'], points[i]['fill']);
                        }
                    }
                }
            };
            SunburstChart.prototype.setchildColors = function (point, fill) {
                fill = fill.trim().length == 0 ? "black" : fill;
                for (var i = 0; i < point.length; i++) {
                    if (this.isNullOrUndefined(point[i]['fill']) || this._sunburstRedraw) {
                        point[i]['fill'] = fill;
                        if (point[i]['fill'].trim().length == 0)
                            point[i]['fill'] = "black";
                        if (!this.isNullOrUndefined(point[i]['point'])) {
                            this.setchildColors(point[i]['point'], fill);
                        }
                    }
                    else {
                        if (!this.isNullOrUndefined(point[i]['point'])) {
                            this.setchildColors(point[i]['point'], fill);
                        }
                    }
                }
            };
            SunburstChart.prototype.processDataSource = function (dataSource) {
                var levelscount = this.model.levels.length, checkPoints = [], i = 0, data, memberPath, xValue, check;
                this.model.points = [];
                this.parentNames = [];
                this.levelNames = [];
                this.childProcess = undefined;
                for (var j = 0; j < dataSource.length; j++) {
                    data = dataSource[j];
                    memberPath = this.model.levels[i]['groupMemberPath'];
                    xValue = data[memberPath];
                    check = $.inArray(xValue, checkPoints);
                    if (check < 0) {
                        this.model.points.push({ x: xValue, y: dataSource[j][this.model.valueMemberPath], layer: i + 1, parentName: xValue, parentChildName: xValue });
                        checkPoints.push(xValue);
                    }
                    else {
                        for (var k = 0; k < this.model.points.length; k++)
                            if (this.model.points[k].x == xValue)
                                this.model.points[k].y += dataSource[j][this.model.valueMemberPath];
                    }
                }
                if (this.model.levels.length > 1)
                    this.createOtherLayerPoints(dataSource, 1);
            };
            SunburstChart.prototype.createOtherLayerPoints = function (dataSource, startLevel) {
                var data = dataSource, currentMemberPath = this.model.levels[startLevel]["groupMemberPath"], yValue, levels = this.model.levels, points = this.model.points;
                for (var j = 0; j < data.length; j++) {
                    var parent_level_Name = "", parentName = "", count = 0, parent_1 = void 0, member = void 0, check = void 0, member1 = void 0;
                    for (var start = 0; start <= startLevel; start++) {
                        member = levels[start]["groupMemberPath"];
                        parentName = data[j][member];
                        if (!this.isNullOrUndefined(parentName))
                            parent_level_Name += parentName + "_";
                        if ((count) == startLevel) {
                            parent_level_Name = parent_level_Name.substring(0, parent_level_Name.length - 1);
                            break;
                        }
                        count++;
                    }
                    check = $.inArray(parent_level_Name, this.levelNames);
                    member1 = levels[startLevel - 1]["groupMemberPath"];
                    parent_1 = data[j][member1];
                    if (check < 0 && !this.isNullOrUndefined((data[j][currentMemberPath]))) {
                        this.levelNames.push(parent_level_Name);
                        yValue = data[j][this.model.valueMemberPath];
                        points.push({ x: data[j][currentMemberPath], 'y': yValue, layer: startLevel + 1, parentChildName: parent_level_Name, parentName: parent_1 });
                    }
                    else if (!this.isNullOrUndefined((data[j][currentMemberPath]))) {
                        for (var i = 0; i < points.length; i++) {
                            if (points[i]['parentName'] == parent_1 && parent_level_Name == points[i]['parentChildName'])
                                points[i]['y'] += yValue;
                        }
                    }
                }
                if (startLevel < (levels.length - 1))
                    this.createOtherLayerPoints(data, startLevel + 1);
                else {
                    this._points = points;
                    this.model.points = [];
                    this.alignDataSourcePoints(data, 1);
                }
            };
            SunburstChart.prototype.alignDataSourcePoints = function (dataSource, startLevel) {
                var levels = this.model.levels;
                for (var i = startLevel; i < levels.length; i++) {
                    for (var j = 0; j < this._points.length; j++) {
                        if (i == this._points[j]["layer"]) {
                            this.parentNames.push(this._points[j]["parentName"] + "_layer_" + this._points[j]["layer"]);
                        }
                        else {
                            i = levels.length;
                            break;
                        }
                    }
                }
                this.findParentElements(this.model.points);
            };
            SunburstChart.prototype.findParentElements = function (points) {
                for (var i = 0; i < this.parentNames.length; i++) {
                    var name = this.parentNames[i];
                    for (var j = 0; j < this._points.length; j++) {
                        if (name == this._points[j]["x"] + "_layer_" + this._points[j]["layer"]) {
                            points.push(this._points[j]);
                        }
                    }
                }
                if (this.isNullOrUndefined(this.childProcess) || this.childProcess)
                    this.findChildElements(points, 0);
            };
            SunburstChart.prototype.findChildElements = function (points, pointCount) {
                var point, currentPoints;
                this.visiblePoints = [];
                if (pointCount <= points.length - 1) {
                    this.childProcess = true;
                    this.visiblePoints.push(points[pointCount]);
                    this.findOtherChildElements(this.visiblePoints, this.parentNames[pointCount], 2, 0, point, currentPoints, pointCount);
                }
                else
                    this.childProcess = false;
            };
            SunburstChart.prototype.findOtherChildElements = function (points, parentName, startLayer, count, previousPoints, currentPoints, pointCount) {
                var parenPoints = points;
                var childPoint;
                var parentActualName = parentName.substring(0, parentName.indexOf("_layer_"));
                for (var i = 0; i < parenPoints.length; i++) {
                    parenPoints[i]["point"] = [];
                    for (var j = 0; j < this._points.length; j++) {
                        if (startLayer == this._points[j]["layer"] && parenPoints[i]['parentChildName'] + "_" + this._points[j]['x'] == this._points[j]['parentChildName'] && parenPoints[i]["x"] == this._points[j]["parentName"] && this._points[j]["parentChildName"].indexOf(parentActualName) >= 0) {
                            parenPoints[i]["point"].push(this._points[j]);
                        }
                    }
                    if (this.isNullOrUndefined(previousPoints)) {
                        previousPoints = parenPoints;
                        currentPoints = [];
                        currentPoints.push({ layer: startLayer });
                        currentPoints[0]["point"] = [];
                    }
                    else if (count >= previousPoints[i]["point"].length) {
                        if (count >= previousPoints[i]["point"].length && startLayer >= this.model.levels.length) {
                            this.findChildElements(this.model.points, (pointCount + 1));
                        }
                        count = 0;
                        for (var m = 0; m < parenPoints[i]["point"].length; m++) {
                            currentPoints[0].point.push(parenPoints[i]["point"][m]);
                        }
                        previousPoints = currentPoints;
                    }
                    else {
                        for (var m = 0; m < parenPoints[i]["point"].length; m++) {
                            currentPoints[0]["point"].push(parenPoints[i]["point"][m]);
                        }
                    }
                    for (var p = count; p < previousPoints[i]["point"].length; p++) {
                        if (count < previousPoints[i]["point"].length) {
                            startLayer = (count == 0) ? (startLayer + 1) : startLayer;
                            count++;
                            var totalPoint = previousPoints[i]["point"][p];
                            childPoint = [];
                            childPoint.push(totalPoint);
                        }
                        if (this.childProcess && this.isNullOrUndefined(previousPoints[i]["point"][p]['point'])) {
                            this.findOtherChildElements(childPoint, parentName, childPoint[0]['layer'] + 1, count, previousPoints, currentPoints, pointCount);
                        }
                    }
                }
            };
            SunburstChart.prototype.setSvgsize = function (size, id) {
                var containerWidth, containerHeight, height, width, chartWidth, chartHeight;
                containerWidth = document.getElementById(id).clientWidth;
                containerHeight = document.getElementById(id).clientHeight;
                height = 450;
                width = (ej.isTouchDevice()) ? 250 : 600;
                if (size['width'] != "" && (!this.isResize || !this.model.isResponsive)) {
                    chartWidth = size['width'];
                    if (typeof (chartWidth) == "string" && chartWidth.indexOf("%") != -1)
                        width = (containerWidth / 100) * parseInt(chartWidth);
                    else
                        width = parseFloat(size['width']);
                }
                else if (containerWidth > 0)
                    width = containerWidth;
                this.width = width;
                this.container.setAttribute('width', width.toString());
                if (size['height'] != "") {
                    chartHeight = size['height'];
                    if (typeof (chartHeight) == "string" && chartHeight.indexOf("%") != -1)
                        height = (containerHeight / 100) * parseInt(chartHeight);
                    else
                        height = parseFloat(size['height']);
                }
                else if (containerHeight > 0)
                    height = containerHeight;
                this.height = height;
                this.container.setAttribute('height', height.toString());
            };
            SunburstChart.prototype.isNullOrUndefined = function (value) {
                return value === undefined || value === null;
            };
            SunburstChart.prototype.createSvg = function (option) {
                var svg = this.createElement("svg");
                this.setAttributes(option, svg);
                return svg;
            };
            SunburstChart.prototype.drawPolygon = function (Options) {
                var polygon = document.getElementById(Options['id']);
                if (this.isNullOrUndefined(polygon))
                    polygon = this.createElement('polygon');
                this.setAttributes(Options, polygon);
                return polygon;
            };
            SunburstChart.prototype.createText = function (options, label) {
                var text = this.createElement("text");
                this.setAttributes(options, text);
                if (label)
                    text.textContent = label;
                return text;
            };
            SunburstChart.prototype.createGroup = function (options) {
                var group = this.createElement("g");
                this.setAttributes(options, group);
                return group;
            };
            SunburstChart.prototype.drawRect = function (Options) {
                var rectangle = document.getElementById(Options._id);
                if (rectangle === null) {
                    rectangle = this.createElement('rect');
                }
                this.setAttributes(Options, rectangle);
                return rectangle;
            };
            SunburstChart.prototype.drawCircle = function (Options) {
                var circle = document.getElementById(Options['id']);
                if (this.isNullOrUndefined(circle))
                    circle = this.createElement('circle');
                this.setAttributes(Options, circle);
                return circle;
            };
            SunburstChart.prototype.createElement = function (elementName) {
                return document.createElementNS("http://www.w3.org/2000/svg", elementName);
            };
            SunburstChart.prototype.getXcordinate = function (x, radius, angle) {
                return (x + radius * (Math.cos(angle)));
            };
            SunburstChart.prototype.getYcordinate = function (y, radius, angle) {
                return (y + radius * (Math.sin(angle)));
            };
            SunburstChart.prototype.setAttributes = function (Options, element) {
                var properties, values;
                properties = Object.keys(Options);
                values = properties.map(function (property) { return Options[property]; });
                for (var i = 0, len = properties.length; i < len; i++) {
                    element.setAttribute(properties[i], values[i]);
                }
            };
            return SunburstChart;
        }(ej.WidgetBase));
        ejSunburstChart.SunburstChart = SunburstChart;
        ej.widget("ejSunburstChart", "ej.SunburstChart", new SunburstChart());
    })(jQuery);
    ejSunburstChart.compareExtend = function (temp, src, def) {
        if (typeof def === 'object' && def !== null) {
            var defProp = Object.keys(def), len = defProp.length, currPro;
            for (var i = 0; i < len; i++) {
                currPro = defProp[i];
                if (src.hasOwnProperty(currPro) && src[currPro] != null) {
                    if (Array.isArray(src[currPro]) || typeof src[currPro] === 'object' && src[currPro] !== null) {
                        ejSunburstChart.compareExtend({}, src[currPro], def[currPro]);
                    }
                }
                else {
                    src[currPro] = def[currPro];
                }
            }
        }
        return src;
    };
    ejSunburstChart.deepExtend = function (out) {
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];
            if (!obj)
                continue;
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        out[key] = ejSunburstChart.deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }
        return out;
    };
})(ejSunburstChart || (ejSunburstChart = {}));
