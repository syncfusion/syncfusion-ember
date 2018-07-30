/**
* @fileOverview Plugin to style the Html Chart elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/

(function ($, ej) {

    ej.widget("ejChart", "ej.datavisualization.Chart", {

        element: null,

        model: null,

        validTags: ["div"],

        defaults: {

            border: {

                color: 'transparent',

                width: 0,

                opacity: 0.3
            },

            chartArea:
                {

                    border: {

                        color: 'Gray',

                        width: 0.5,

                        opacity: 0.3
                    },

                    background: 'transparent'

                },

            highlightColor: null,

            primaryXAxis:
                {
                    crossesAt: null,

                    crossesInAxis: null,

                    isIndexed: false,

                    multiLevelLabelsColor: null,

                    multiLevelLabelsFontColor: null,

                    alignment: "center",

                    labelPlacement: "",

                    scrollbarSettings: {

                        visible: true,

                        canResize: true,

                        range: {

                            min: null,

                            max: null,
                        },

                        pointsLength: null

                    },

                    range: {

                        min: null,

                        max: null,

                        interval: null
                    },

                    labelPosition: 'outside',

                    tickLinesPosition: 'outside',

                    alternateGridBand:
                        {

                            odd: {

                                fill: "transparent",

                                opacity: 1
                            },

                            even: {

                                fill: "transparent",

                                opacity: 1
                            }
                        },

                    enableAutoIntervalOnZooming: true,


                    majorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true,

                            opacity: 1

                        },

                    majorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    minorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true

                        },

                    minorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    labelBorder:
                        {
                            color: null,

                            width: 0
                        },

                    multiLevelLabels: [{
                        visible: false,
                        text: "",
                        textAlignment: "center",
                        start: null,
                        end: null,
                        level: 0,
                        maximumTextWidth: null,
                        textOverflow: "trim",
                        font: {
                            fontFamily: 'Segoe UI',
                            fontStyle: 'Normal',
                            size: '12px',
                            fontWeight: 'Regular',
                            opacity: 1
                        },
                        border: {
                            type: 'rectangle',
                            width: 1
                        }
                    }],

                    minorTicksPerInterval: null,

                    columnIndex: null,

                    columnSpan: null,

                    labelRotation: null,

                    valueType: null,

                    name: null,

                    labelFormat: null,

                    desiredIntervals: null,

                    intervalType: null,

                    roundingPlaces: null,

                    logBase: 10,

                    plotOffset: 0,
                    labels: [],

                    stripLine: [
                        {

                            visible: false,

                            startFromAxis: false,

                            text: "",

                            width: 0,

                            textAlignment: "middlecenter",

                            font: {

                                fontFamily: 'Segoe UI',

                                fontStyle: 'Normal',

                                size: '12px',

                                fontWeight: 'Regular',

                                color: 'black',

                                opacity: 1
                            },

                            start: null,

                            end: null,

                            color: 'gray',

                            borderColor: 'black',

                            zIndex: 'over'
                        }
                    ],

                    title:
                        {


                            text: "",

                            visible: true,

                            enableTrim: false,

                            offset: 0,

                            alignment: 'center',

                            position: 'outside',

                            maximumTitleWidth: null,

                            font:
                                {

                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    size: '14px',

                                    opacity: 1,

                                    fontWeight: 'regular',

                                    color: null

                                }
                        },
                    rangePadding: 'Auto',
                    additionalPadding: [1, 1],
                    orientation: 'Horizontal',

                    maximumLabels: 3,

                    opposedPosition: false,

                    showNextToAxisLine: true,

                    axisLine:
                        {

                            visible: true,

                            width: 1,

                            dashArray: "",

                            offset: 0,

                            color: null

                        },

                    labelIntersectAction: "none",

                    maximumLabelWidth: 34,

                    enableTrim: false,


                    edgeLabelPlacement: "none",



                    isInversed: false,



                    font:
                        {

                            fontFamily: 'Segoe UI',

                            fontStyle: 'Normal',

                            size: '11px',

                            color: null,

                            fontWeight: 'regular',

                            opacity: 1

                        },

                    visible: true,

                    crosshairLabel:
                        {
                            rx: 3, ry: 3,
                            border: { color: null, width: 1 },
                            fill: null,
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: null },
                            visible: false
                        },

                    zoomFactor: 1,

                    zoomPosition: 0
                },


            primaryYAxis:
                {
                    crossesAt: null,
                    crossesInAxis: null,
                    showNextToAxisLine: true,

                    alignment: "center",

                    startFromZero: true,

                    range: {

                        min: null,

                        max: null,

                        interval: null
                    },

                    scrollbarSettings: {

                        visible: true,

                        canResize: true,

                        range: {

                            min: null,

                            max: null,
                        },

                        pointsLength: null

                    },

                    labelPlacement: "",

                    labelPosition: 'outside',

                    tickLinesPosition: 'outside',

                    multiLevelLabelsColor: null,
                    multiLevelLabelsFontColor: null,

                    alternateGridBand:
                        {

                            odd: {

                                fill: "transparent",

                                opacity: 1
                            },

                            even: {


                                fill: "transparent",

                                opacity: 1
                            }
                        },

                    enableAutoIntervalOnZooming: true,

                    majorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true,

                            opacity: 1

                        },

                    majorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    minorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true

                        },

                    minorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    labelBorder:
                        {

                            color: null,

                            width: 0
                        },

                    multiLevelLabels: [{
                        visible: false,
                        text: "",
                        textAlignment: "center",
                        start: null,
                        end: null,
                        level: 0,
                        maximumTextWidth: null,
                        textOverflow: "trim",
                        font: {
                            fontFamily: 'Segoe UI',
                            fontStyle: 'Normal',
                            size: '12px',
                            fontWeight: 'Regular',
                            opacity: 1
                        },
                        border: {
                            type: 'rectangle',
                            width: 1
                        }
                    }],

                    minorTicksPerInterval: null,

                    rowIndex: null,

                    rowSpan: null,

                    valueType: null,

                    name: null,

                    labelFormat: null,

                    desiredIntervals: null,

                    intervalType: null,

                    roundingPlaces: null,
                    labels: [],

                    title:
                        {

                            text: "",

                            visible: true,

                            enableTrim: false,

                            offset: 0,

                            alignment: 'center',

                            position: 'outside',

                            maximumTitleWidth: null,

                            font:
                                {
                                    color: null,

                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    opacity: 1,

                                    size: '14px',

                                    fontWeight: 'regular'
                                }
                        },

                    rangePadding: 'Auto',


                    stripLine: [
                        {

                            visible: false,

                            startFromAxis: false,

                            width: 0,

                            text: "",

                            textAlignment: "middlecenter",

                            font: {

                                fontFamily: 'Segoe UI',

                                fontWeight: 'Regular',

                                fontStyle: 'Normal',

                                size: '12px',

                                color: 'black',

                                opacity: 1
                            },

                            start: null,

                            end: null,

                            color: 'gray',

                            borderColor: 'black',

                            zIndex: 'over'
                        }
                    ],

                    logBase: 10,

                    plotOffset: 0,

                    orientation: 'Vertical',

                    maximumLabels: 3,

                    labelIntersectAction: "none",


                    maximumLabelWidth: 34,

                    enableTrim: false,

                    edgeLabelPlacement: "none",


                    isInversed: false,


                    crosshairLabel:
                        {
                            rx: 3, ry: 3,
                            border: { color: null, width: 1 },
                            fill: null,
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: null },
                            visible: false
                        },

                    visible: true,

                    opposedPosition: false,

                    font:
                        {

                            fontFamily: 'Segoe UI',

                            fontStyle: 'Normal',

                            size: '11px',

                            opacity: 1,

                            fontWeight: 'regular',

                            color: null

                        },

                    axisLine:
                        {

                            visible: true,

                            width: 1,

                            dashArray: "",

                            offset: 0,

                            color: null
                        },


                    zoomFactor: 1,

                    zoomPosition: 0
                },
            axes: [],

            secondaryX:
                {
                    crossesAt: null,
                    crossesInAxis: null,
                    showNextToAxisLine: true,
                    alignment: "center",
                    multiLevelLabelsColor: null,
                    multiLevelLabelsFontColor: null,
                    range: {
                        min: null,
                        max: null,
                        interval: null
                    },

                    scrollbarSettings: {

                        visible: true,

                        canResize: true,

                        range: {

                            min: null,

                            max: null,
                        },

                        pointsLength: null

                    },

                    tickLinesPosition: "outside",
                    labelPosition: "outside",

                    majorGridLines:
                        {

                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true
                        },
                    alternateGridBand:
                        {
                            odd: {
                                fill: "transparent",
                                opacity: 1
                            },
                            even: {
                                fill: "transparent",
                                opacity: 1
                            }
                        },

                    enableAutoIntervalOnZooming: true,

                    majorTickLines:
                        {

                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    minorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true

                        },

                    minorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    labelBorder:
                        {
                            color: null,

                            width: 0
                        },

                    multiLevelLabels: [{
                        visible: false,
                        text: "",
                        textAlignment: "center",
                        start: null,
                        end: null,
                        level: 0,
                        maximumTextWidth: null,
                        textOverflow: "trim",
                        font: {
                            fontFamily: 'Segoe UI',
                            fontStyle: 'Normal',
                            size: '12px',
                            fontWeight: 'Regular',
                            opacity: 1
                        },
                        border: {
                            type: 'rectangle',
                            width: 1
                        }
                    }],

                    minorTicksPerInterval: null,

                    columnIndex: null,

                    columnSpan: null,

                    labelRotation: null,

                    valueType: null,

                    name: null,

                    labelFormat: null,

                    labelPlacement: "",

                    desiredIntervals: null,

                    intervalType: null,

                    roundingPlaces: null,

                    logBase: 10,

                    plotOffset: 0,
                    labels: [],
                    stripLine: [
                        {
                            visible: false,
                            startFromAxis: false,
                            text: "",
                            textAlignment: "middlecenter",
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', fontWeight: 'regular', size: '12px', color: 'black', opacity: 1 },
                            start: null,
                            end: null,
                            color: 'gray',
                            borderColor: 'black',
                            zIndex: 'over'
                        }
                    ],

                    title:
                        {


                            text: "",
                            visible: true,
                            enableTrim: false,
                            offset: 0,
                            alignment: 'center',
                            position: 'outside',
                            maximumTitleWidth: null,
                            font:
                                {

                                    color: null,

                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    size: '14px',

                                    opacity: 1,

                                    fontWeight: 'regular'

                                }

                        },

                    rangePadding: 'Auto',
                    additionalPadding: [1, 1],

                    orientation: 'Horizontal',

                    maximumLabels: 3,

                    opposedPosition: false,

                    axisLine:
                        {

                            visible: true,

                            width: 1,

                            dashArray: "",

                            offset: 0,

                            color: null
                        },

                    labelIntersectAction: "none",

                    edgeLabelPlacement: "none",

                    font:
                        {
                            color: null,

                            fontFamily: 'Segoe UI',

                            fontStyle: 'Normal',

                            size: '11px',

                            fontWeight: 'regular',

                            opacity: 1
                        },

                    visible: true,

                    crosshairLabel:
                        {
                            rx: 3, ry: 3,
                            border: { color: null, width: 1 },
                            fill: null,
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: null },
                            visible: false
                        },

                    zoomFactor: 1,

                    zoomPosition: 0
                },

            secondaryY:
                {
                    crossesAt: null,
                    crossesInAxis: null,
                    showNextToAxisLine: true,
                    alignment: "center",
                    startFromZero: true,
                    multiLevelLabelsColor: null,
                    multiLevelLabelsFontColor: null,
                    range: {
                        min: null,
                        max: null,
                        interval: null
                    },

                    scrollbarSettings: {

                        visible: true,

                        canResize: true,

                        range: {

                            min: null,

                            max: null,
                        },

                        pointsLength: null

                    },

                    tickLinesPosition: "outside",
                    labelPosition: "outside",

                    majorGridLines:
                        {

                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true

                        },
                    alternateGridBand:
                        {
                            odd: {
                                fill: "transparent",
                                opacity: 1
                            },
                            even: {
                                fill: "transparent",
                                opacity: 1
                            }
                        },

                    enableAutoIntervalOnZooming: true,

                    majorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    minorGridLines:
                        {
                            color: null,

                            width: 1,

                            dashArray: "",

                            visible: true

                        },

                    minorTickLines:
                        {
                            color: null,

                            width: 1,

                            size: 5,

                            visible: true
                        },

                    labelBorder:
                        {
                            color: null,

                            width: 0
                        },

                    multiLevelLabels: [{
                        visible: false,
                        text: "",
                        textAlignment: "center",
                        start: null,
                        end: null,
                        level: 0,
                        maximumTextWidth: null,
                        textOverflow: "trim",
                        font: {
                            fontFamily: 'Segoe UI',
                            fontStyle: 'Normal',
                            size: '12px',
                            fontWeight: 'Regular',
                            opacity: 1
                        },
                        border: {
                            type: 'rectangle',
                            width: 1
                        }
                    }],

                    minorTicksPerInterval: null,

                    rowIndex: null,

                    rowSpan: null,

                    valueType: null,

                    name: null,

                    labelFormat: null,

                    desiredIntervals: null,

                    intervalType: null,

                    roundingPlaces: null,
                    labels: [],

                    title:
                        {

                            text: "",
                            visible: true,
                            enableTrim: false,
                            offset: 0,
                            alignment: 'center',
                            position: 'outside',
                            maximumTitleWidth: null,
                            font:
                                {
                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    opacity: 1,

                                    size: '14px',

                                    fontWeight: 'regular',

                                    color: null
                                }
                        },

                    rangePadding: 'Auto',

                    stripLine: [
                        {
                            visible: false,
                            startFromAxis: false,
                            text: "",
                            textAlignment: "middlecenter",
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', fontWeight: 'regular', size: '12px', color: 'black', opacity: 1 },
                            start: null,
                            end: null,
                            color: 'gray',
                            borderColor: 'black',
                            zIndex: 'over'
                        }
                    ],

                    logBase: 10,

                    plotOffset: 0,

                    orientation: 'Vertical',

                    maximumLabels: 3,

                    labelIntersectAction: "none",

                    labelPlacement: "",

                    edgeLabelPlacement: "none",

                    crosshairLabel:
                        {
                            rx: 3, ry: 3,
                            border: { color: null, width: 1 },
                            fill: null,
                            font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', size: '13px', fontWeight: 'regular', opacity: 1, color: null },
                            visible: false
                        },

                    visible: true,

                    opposedPosition: false,

                    font:
                        {
                            fontFamily: 'Segoe UI',

                            fontStyle: 'Normal',

                            size: '11px',

                            opacity: 1,

                            fontWeight: 'regular'

                        },

                    axisLine:
                        {
                            color: null,

                            visible: true,

                            width: 1,

                            dashArray: "",

                            offset: 0
                        },


                    zoomFactor: 1,

                    zoomPosition: 0
                },
            trendlineDefaults: {
                type: "linear",
                visibility: "",
                visibleOnLegend: "visible",
                name: "Trendline",
                fill: "",
                width: 1,
                opacity: 1,
                dashArray: "",
                forwardForecast: 0,
                backwardForecast: 0,
                polynomialOrder: 2,
                period: 2,
                intercept: null,
                tooltip: {
                    visible: false, format: null, fill: null, border: { width: 1, color: null }, duration: '500ms', enableAnimation: true, opacity: 0.95, font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', fontWeight: 'Regular', size: '12px', opacity: 1 }
                }
            },
            indicatorDefaults: {
                visible: true,
                points: [],
                tooltip: { visible: false, format: null, fill: null, border: { width: 1, color: null }, duration: '500ms', enableAnimation: true, opacity: 0.95 },
                seriesName: "",
                font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', fontWeight: 'Regular', size: '12px', color: '#707070', opacity: 1 },
                type: "SMA",
                period: 14,
                standardDeviations: 2,
                kPeriod: 3,
                dPeriod: 3,
                periodLine: { fill: "blue", width: 2 },
                lowerLine: { fill: "#008000", width: 2 },
                upperLine: { fill: "#ff0000", width: 2 },
                macdLine: { fill: "#ff9933", width: 2 },
                histogram: { fill: "#ccccff", opacity: 1, border: { color: "#9999ff", width: 1 } },
                fill: "#00008B",
                width: 2,
                xAxisName: "",
                yAxisName: "",
                visibility: "visible",
                macdType: "line",
                shortPeriod: 12,
                longPeriod: 26,
                trigger: 9,
                enableAnimation: false,
                animationDuration: null,
            },
            annotationsDefault: {
                visible: false,
                content: "",
                coordinateUnit: "none",
                verticalAlignment: "middle",
                horizontalAlignment: "middle",
                region: "chart",
                x: 0,
                y: 0,
                opacity: 1,
                angle: 0,
                xAxisName: "",
                yAxisName: "",
                margin: {
                    left: 0,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            multiLevelLabelsDefault: {
                visible: false,
                text: "",
                textAlignment: "center",
                start: null,
                end: null,
                level: 0,
                maximumTextWidth: null,
                textOverflow: "trim",
                font: {
                    fontFamily: 'Segoe UI',
                    fontStyle: 'Normal',
                    size: '12px',
                    fontWeight: 'Regular',
                    opacity: 1
                },
                border: {
                    type: 'rectangle',
                    width: 1
                }
            },
            stripLineDefault: {

                visible: false,

                startFromAxis: false,

                width: 0,

                text: "",

                textAlignment: 'middlecenter',

                font:
                    {

                        fontFamily: 'Segoe UI',

                        fontStyle: 'Normal',

                        fontWeight: 'Regular',

                        size: '12px',

                        color: 'black',

                        opacity: 1
                    },

                start: null,

                end: null,

                color: 'gray',

                borderColor: 'black',

                zIndex: 'over',

                borderWidth: 1
            },

            rowDefinitions: null,

            columnDefinitions: null,

            title:
                {

                    text: "",

                    enableTrim: false,

                    visible: true,

                    maximumWidth: 'auto',

                    textOverflow: "trim",

                    textAlignment: "center",

                    background: 'transparent',

                    border: {

                        color: 'transparent',

                        width: 1,

                        opacity: 0.8,

                        cornerRadius: 0.8

                    },

                    font: {

                        color: null,

                        fontFamily: 'Segoe UI',

                        fontStyle: 'Normal',

                        size: '16px',

                        opacity: 1,

                        fontWeight: 'regular'
                    },


                    subTitle:
                        {

                            text: "",

                            enableTrim: false,

                            visible: true,

                            maximumWidth: 'auto',

                            textOverflow: "trim",

                            textAlignment: 'far',

                            background: 'transparent',

                            border: {

                                color: 'transparent',

                                width: 1,

                                opacity: 0.8,

                                cornerRadius: 0.8

                            },


                            font:
                                {
                                    color: null,

                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    size: '12px',

                                    opacity: 1,

                                    fontWeight: 'regular'
                                }
                        }

                },





            lineCap: { butt: 'butt', round: 'round', square: 'square' },
            lineJoin: { round: 'round', bevel: 'bevel', miter: 'miter' },
            legendAlignment: { near: 'near', center: 'center', far: 'far' },
            legendPosition: { top: 'top', bottom: 'bottom', right: 'right', left: 'left', custom: 'custom' },

            enableAnimation: true,

            legend:
                {

                    title:
                        {
                            text: "",

                            textAlignment: 'center',

                            font:
                                {
                                    color: null,

                                    size: '12px',

                                    fontFamily: "Segoe UI",

                                    fontStyle: 'normal',

                                    fontWeight: 'regular'
                                }
                        },

                    border:
                        {

                            color: 'transparent',


                            width: 1
                        },

                    visible: true,

                    textOverflow: 'none',

                    textWidth: 34,

                    toggleSeriesVisibility: true,

                    enableScrollbar: true,

                    itemPadding: 10,

                    shape: 'None',

                    alignment: 'Center',

                    position: 'Bottom',

                    location:
                        {

                            x: 0,

                            y: 0
                        },

                    itemStyle:
                        {
                            height: 9,

                            width: 9,

                            border:
                                {

                                    color: 'transparent',

                                    width: 1
                                }
                        },

                    rowCount: null,

                    columnCount: null,

                    opacity: 1,

                    fill: null,

                    background: null,

                    font:
                        {
                            color: null,

                            fontFamily: 'Segoe UI',

                            fontStyle: 'Normal',

                            fontWeight: 'Regular',

                            size: '12px'
                        },

                    size:
                        {

                            height: null,

                            width: null
                        }
                },

            indicators: [
                {
                    points: [],

                    tooltip:
                        {

                            visible: false,

                            format: null,

                            fill: null,

                            border: {

                                width: 1,

                                color: null
                            },

                            duration: '500ms',

                            enableAnimation: true,

                            opacity: 0.95
                        },

                    seriesName: "",

                    animationDuration: null,

                    type: "SMA",

                    period: 14,

                    standardDeviations: 2,

                    kPeriod: 3,

                    dPeriod: 3,

                    periodLine: {

                        fill: "blue",

                        width: 2
                    },

                    lowerLine: {


                        fill: "#008000",

                        width: 2
                    },

                    upperLine: {

                        fill: "#ff0000",

                        width: 2
                    },

                    macdLine: {

                        fill: "#ff9933",

                        width: 2
                    },

                    histogram: {

                        fill: "#ccccff",

                        opacity: 1,

                        border: {

                            color: "#9999ff",

                            width: 1
                        }
                    },

                    fill: "#00008B",

                    visible: true,

                    font: {

                        fontFamily: 'Segoe UI',

                        fontStyle: 'Normal',

                        fontWeight: 'Regular',

                        size: '12px',

                        color: '#707070',

                        opacity: 1
                    },

                    width: 2,

                    xAxisName: "",

                    yAxisName: "",

                    macdType: "line",

                    shortPeriod: 12,

                    longPeriod: 26,

                    trigger: 9,

                    visibility: "visible",

                    enableAnimation: false
                }
            ],

            background: null,

            backGroundImageUrl: null,

            annotations: [{

                visible: false,

                content: "",

                coordinateUnit: "none",

                verticalAlignment: "middle",

                horizontalAlignment: "middle",

                region: "chart",

                x: 0,

                y: 0,

                opacity: 1,

                angle: 0,

                xAxisName: "",

                yAxisName: "",

                margin: {

                    left: 0,

                    right: 0,

                    bottom: 0,

                    top: 0
                }
            }],

            series: [
                {
                    dragSettings: {
                        enable: false,
                        type: 'xy'
                    },

                    type: 'column',

                    splitMode: 'value',

                    splitValue: null,

                    splineType: 'natural',

                    cardinalSplineTension: 0.5,

                    gapWidth: 50,

                    pieOfPieCoefficient: 0.6,

                    visibleOnLegend: "visible",

                    enableAnimation: false,

                    animationDuration: null,

                    animationType: 'linear',

                    isClosed: true,

                    isTransposed: false,

                    isStacking: true,

                    columnSpacing: 0,

                    columnWidth: 0.7,

                    columnFacet: 'rectangle',
                    drawType: 'line',

                    doughnutCoefficient: 0.4,

                    explodeOffset: 25,

                    pyramidMode: 'linear',

                    boxPlotMode: 'exclusive',

                    funnelWidth: '11.6%',

                    funnelHeight: '32.7%',

                    positiveFill: null,

                    showMedian: true,

                    outlierSettings: {

                        shape: 'circle',

                        size:
                            {
                                width: 6,

                                height: 6

                            },
                    },

                    cornerRadius: {

                        topLeft: 0,

                        topRight: 0,

                        bottomLeft: 0,

                        bottomRight: 0
                    },

                    connectorLine: {

                        width: 1,

                        opacity: 1,

                        dashArray: null
                    },

                    errorBar: {

                        visibility: "hidden",

                        mode: "vertical",

                        type: "fixedValue",

                        horizontalErrorValue: 1,

                        verticalErrorValue: 3,

                        horizontalPositiveErrorValue: 1,

                        horizontalNegativeErrorValue: 1,

                        verticalPositiveErrorValue: 5,

                        verticalNegativeErrorValue: 5,

                        direction: "both",

                        cap: {

                            visible: true,

                            width: 1,

                            length: 20,

                        },


                        width: 1,

                        opacity: 1,

                    },

                    highlightSettings: {

                        enable: false,

                        mode: 'series',

                        color: "",

                        opacity: 0.6,

                        border: {

                            color: "",

                            width: 2
                        },

                        pattern: 'none',

                        customPattern: ""
                    },

                    selectionSettings: {

                        type: 'Single',

                        enable: false,

                        mode: 'series',

                        rangeType: 'xy',

                        color: "",

                        opacity: 0.6,

                        border: {

                            color: "",

                            width: 2
                        },

                        pattern: 'none',

                        customPattern: ""
                    },

                    emptyPointSettings: {

                        visible: true,

                        style: {

                            color: '',

                            border: {

                                color: '',

                                width: 1

                            }

                        },

                        displayMode: 'gap'
                    },

                    labelPosition: 'inside',

                    gapRatio: 0,

                    points: null,

                    pieCoefficient: 0.8,

                    doughnutSize: 0.8,

                    dataSource: null,

                    high: '',

                    low: '',

                    open: '',

                    close: '',

                    bullFillColor: null,

                    bearFillColor: null,

                    query: null,

                    xName: '',

                    yName: '',

                    pointColorMappingName: '',



                    visibility: "visible",

                    startAngle: null,

                    endAngle: null,

                    xAxisName: null,

                    yAxisName: null,

                    explodeAll: null,

                    explode: false,

                    explodeIndex: null,

                    enableSmartLabels: null,

                    tooltip: {

                        visible: false,

                        format: null,

                        template: null,


                        fill: null,

                        border: {

                            width: 1,

                            color: null
                        },

                        enableAnimation: true,

                        duration: '500ms',

                        opacity: 0.95
                    },

                    fill: null,

                    opacity: 1,

                    lineCap: 'butt',

                    lineJoin: 'round',

                    dashArray: "",

                    border: {

                        width: 1,

                        color: 'transparent',

                        dashArray: ""
                    },
                    width: 2,

                    marker: {

                        shape: 'circle',

                        imageUrl: "",

                        size: {

                            width: 6,

                            height: 6
                        },

                        visible: false,

                        opacity: 1,

                        fill: null,

                        border: {

                            color: 'white',

                            width: 3
                        },

                        dataLabel: {

                            visible: false,

                            angle: 0,

                            showEdgeLabels: false,

                            enableContrastColor: false,

                            textMappingName: '',

                            verticalTextAlignment: 'center',

                            horizontalTextAlignment: 'center',

                            textPosition: 'top',

                            shape: 'none',

                            opacity: 1,

                            fill: null,

                            border: {

                                color: 'white',

                                width: 0.1
                            },

                            maximumLabelWidth: null,

                            enableWrap: false,

                            connectorLine: {

                                width: 0.5,

                                type: 'line',

                                color: null
                            },

                            offset: {

                                x: 0,

                                y: 0
                            },

                            font: {

                                fontFamily: 'Segoe UI',

                                fontStyle: 'Normal',

                                fontWeight: 'Regular',

                                color: null,

                                size: '11px',

                                opacity: 1
                            },

                            margin: {

                                left: 5,

                                top: 5,

                                bottom: 5,

                                right: 5
                            }

                        }
                    },

                    bubbleOptions: {

                        radiusMode: "minmax",

                        minRadius: 1,

                        maxRadius: 3

                    },

                    trendlines: [{

                        visibility: "",

                        visibleOnLegend: "visible",

                        type: "linear",

                        name: "Trendline",

                        fill: "",

                        width: 1,

                        opacity: 1,

                        dashArray: "",

                        forwardForecast: 0,

                        backwardForecast: 0,

                        polynomialOrder: 2,

                        period: 2,

                        intercept: null,

                        tooltip:
                            {

                                visible: false,

                                format: null,

                                fill: null,

                                border: {

                                    width: 1,

                                    color: null
                                },

                                duration: '500ms',

                                enableAnimation: true,

                                opacity: 0.95,

                                font: {

                                    fontFamily: 'Segoe UI',

                                    fontStyle: 'Normal',

                                    fontWeight: 'Regular',

                                    color: null,

                                    size: '12px',

                                    opacity: 1
                                }
                            }
                    }],


                    font: {

                        fontFamily: 'Segoe UI',

                        fontStyle: 'Normal',

                        fontWeight: 'Regular',

                        size: '12px',

                        color: '#707070',

                        opacity: 1
                    },
                    _isdesigntime: true

                }
            ],

            commonSeriesOptions: {
                dragSettings: {
                    enable: false,
                    type: 'xy'
                },

                type: 'column',

                splitMode: 'value',

                splitValue: null,

                splineType: 'natural',

                cardinalSplineTension: 0.5,

                gapWidth: 50,

                pieOfPieCoefficient: 0.6,

                visibleOnLegend: "visible",

                enableAnimation: false,

                animationDuration: null,

                animationType: 'linear',

                isClosed: true,

                isTransposed: false,

                isStacking: false,

                columnWidth: 0.7,

                columnSpacing: 0,

                columnFacet: 'rectangle',

                drawType: 'line',

                doughnutCoefficient: 0.4,

                explodeOffset: 25,

                pyramidMode: 'linear',

                boxPlotMode: 'exclusive',

                funnelWidth: '11.6%',

                funnelHeight: '32.7%',

                positiveFill: null,

                showMedian: true,

                outlierSettings: {

                    shape: 'circle',

                    size:
                        {
                            width: 6,

                            height: 6

                        },
                },

                cornerRadius: {

                    topLeft: 0,

                    topRight: 0,

                    bottomLeft: 0,

                    bottomRight: 0
                },

                connectorLine: {

                    width: 1,

                    opacity: 1,

                    dashArray: null
                },

                errorBar: {

                    visibility: "hidden",

                    mode: "vertical",

                    type: "fixedValue",

                    horizontalErrorValue: 1,

                    verticalErrorValue: 3,

                    horizontalPositiveErrorValue: 1,

                    horizontalNegativeErrorValue: 1,

                    verticalPositiveErrorValue: 5,

                    verticalNegativeErrorValue: 5,

                    direction: "both",

                    cap: {

                        visible: true,

                        width: 1,

                        length: 20,

                    },


                    width: 1,

                    opacity: 1,

                },

                highlightSettings: {

                    enable: false,

                    mode: 'series',

                    color: "",

                    opacity: 0.6,

                    border: {

                        color: "",

                        width: 2
                    },

                    pattern: 'none',

                    customPattern: ""
                },

                selectionSettings: {

                    type: 'Single',

                    enable: false,

                    mode: 'series',

                    rangeType: 'xy',

                    color: "",

                    opacity: 0.6,

                    border: {

                        color: "",

                        width: 2
                    },

                    pattern: 'none',

                    customPattern: ""
                },

                emptyPointSettings: {

                    visible: true,

                    style: {

                        color: '',

                        border: {

                            color: '',

                            width: 1

                        }

                    },

                    displayMode: 'gap'
                },

                labelPosition: 'inside',

                gapRatio: 0,

                pieCoefficient: 0.8,

                doughnutSize: 0.8,

                dataSource: null,

                xName: '',

                yName: '',

                pointColorMappingName: '',

                high: '',

                low: '',

                open: '',

                close: '',

                startAngle: null,

                endAngle: null,

                xAxisName: null,

                yAxisName: null,

                explodeAll: false,

                explode: false,

                explodeIndex: null,

                enableSmartLabels: null,

                tooltip: {

                    visible: false,

                    format: null,

                    template: null,

                    fill: null,

                    border: {

                        color: null,

                        width: 1
                    },

                    enableAnimation: true,

                    duration: '500ms',

                    opacity: 0.95
                },

                fill: null,

                opacity: 1,

                lineCap: 'butt',

                lineJoin: 'round',

                dashArray: "",

                border: {

                    color: 'transparent',

                    width: 1,

                    dashArray: ""
                },
                width: 2,

                marker:
                    {

                        shape: 'circle',

                        imageUrl: "",

                        size: {

                            width: 6,

                            height: 6
                        },

                        visible: false,

                        opacity: 1,

                        fill: null,

                        border: {

                            color: 'white',

                            width: 3
                        },

                        dataLabel:
                            {

                                visible: false,

                                angle: 0,

                                enableContrastColor: false,

                                showEdgeLabels: false,

                                textMappingName: '',

                                verticalTextAlignment: 'center',

                                horizontalTextAlignment: 'center',

                                textPosition: 'top',

                                shape: 'none',

                                maximumLabelWidth: null,

                                enableWrap: false,

                                opacity: 1,

                                fill: null,

                                border: {

                                    color: 'white',

                                    width: 0.1
                                },

                                offset: {

                                    x: 0,

                                    y: 0
                                },

                                connectorLine:
                                    {

                                        width: 0.5,

                                        type: 'line',

                                        height: null
                                    },

                                font:
                                    {

                                        fontFamily: 'Segoe UI',

                                        fontStyle: 'Normal',

                                        fontWeight: 'Regular',

                                        size: '11px',

                                        color: null,

                                        opacity: 1
                                    },

                                margin:
                                    {

                                        left: 5,

                                        top: 5,

                                        bottom: 5,

                                        right: 5
                                    }
                            }
                    },

                bubbleOptions: {

                    radiusMode: "minmax",

                    minRadius: 1,

                    maxRadius: 3

                },

                trendlines: [{

                    visibility: "",

                    visibleOnLegend: "visible",

                    type: "linear",

                    name: "Trendline",

                    fill: "",

                    width: 1,

                    opacity: 1,

                    dashArray: "",

                    forwardForecast: 0,

                    backwardForecast: 0,

                    polynomialOrder: 2,

                    period: 2,

                    intercept: null,

                    tooltip:
                        {

                            visible: false,

                            format: null,

                            fill: null,

                            border: {

                                width: 1,

                                color: null
                            },

                            duration: '500ms',

                            enableAnimation: true,

                            opacity: 0.95,

                            font: {

                                fontFamily: 'Segoe UI',

                                fontStyle: 'Normal',

                                fontWeight: 'Regular',

                                color: null,

                                size: '12px',

                                opacity: 1
                            }
                        }
                }],

                font: {

                    fontFamily: 'Segoe UI',

                    fontStyle: 'Normal',

                    fontWeight: 'Regular',

                    size: '12px',

                    color: '#707070',

                    opacity: 1
                }
            },

            crosshair:
                {
                    line: {


                        width: 1
                    },
                    marker:
                        {

                            visible: true,

                            size:
                                {

                                    width: 10,

                                    height: 10
                                },

                            opacity: 1,

                            border:
                                {

                                    width: 3
                                }
                        },

                    visible: false,

                    type: "crosshair",

                    trackballTooltipSettings: {

                        fill: null,

                        mode: "float",

                        border: {

                            width: null,

                            color: null,

                        },

                        rx: 3,

                        ry: 3,

                        opacity: 1,

                        tooltipTemplate: null
                    }
                },


            pointStyle:
                {
                    lineCap: 'butt', lineJoin: 'round', opacity: 1, interior: null, borderColor: null, borderWidth: 1
                },
            textStyle:
                {
                    marker: { textAlignment: 'center', textPosition: 'top' },
                    font: { fontFamily: 'Segoe UI', fontStyle: 'Normal', fontWeight: 'Regular', size: '12px', color: '#707070', opacity: 1 }
                },
            symbolShape: {
                None: 0,
                LeftArrow: 1,
                RightArrow: 2,
                Circle: 3,
                Cross: 4,
                HorizLine: 5,
                VertLine: 6,
                Diamond: 7,
                Rectangle: 8,
                Triangle: 9,
                InvertedTriangle: 10,
                Hexagon: 11,
                Pentagon: 12,
                Star: 13,
                Ellipse: 14,
                Wedge: 15,
                Trapezoid: 16,
                UpArrow: 17,
                DownArrow: 18,
                Image: 19,
                SeriesType: 20

            },
            initSeriesRender: true,

            theme: "flatlight",

            canResize: false,

            isResponsive: false,

            enable3D: false,

            enableRotation: false,

            sideBySideSeriesPlacement: null,

            perspectiveAngle: 90,

            rotation: 0,

            tilt: 0,

            wallSize: 2,

            depth: 100,

            enableCanvasRendering: false,

            selectedDataPointIndexes: [],

            exportSettings: {

                type: "png",

                fileName: "Chart",

                orientation: "portrait",

                angle: 0,

                mode: "client",

                action: "",

                multipleExport: false
            },

            zooming:
                {

                    enable: false,

                    enableScrollbar: false,

                    type: 'x,y',

                    enablePinching: true,

                    enableMouseWheel: false,

                    enableDeferredZoom: false,

                    toolbarItems: ["zoomIn", "zoomOut", "zoom", "pan", "reset"]
                },
            type: 'x,y',

            locale: null,

            xZoomFactor: 1,

            yZoomFactor: 1,

            xZoomPosition: 0,

            yZoomPosition: 0,

            load: "",

            axesLabelRendering: "",

            axesRangeCalculate: "",

            axesTitleRendering: "",

            dragStart: "",

            dragging: "",

            dragEnd: "",

            chartAreaBoundsCalculate: "",

            legendItemRendering: "",

            legendBoundsCalculate: "",

            preRender: "",

            seriesRendering: "",


            trendlineRendering: "",

            symbolRendering: "",

            titleRendering: "",
            subtitleRendering: "",

            axesLabelsInitialize: "",

            pointRegionClick: "",

            seriesRegionClick: "",

            annotationClick: "",

            axisLabelClick: "",

            chartClick: "",

            scrollStart: "",

            scrollEnd: "",

            scrollChanged: "",

            chartDoubleClick: "",

            pointRegionMouseMove: "",

            legendItemClick: "",

            axisLabelMouseMove: "",

            chartMouseMove: "",

            legendItemMouseMove: "",

            chartMouseLeave: "",

            displayTextRendering: "",

            toolTipInitialize: "",

            trackAxisToolTip: "",

            trackToolTip: "",

            animationComplete: "",

            zoomed: "",

            destroy: "",

            create: "",

            beforeResize: "",

            afterResize: "",

            rangeSelected: "",

            multiLevelLabelClick: "",

            multiLevelLabelRendering: "",

            margin: { left: 10, right: 10, top: 10, bottom: 10 },
            size: { width: null, height: null },
            elementSpacing: 10,

            dateStart: 25568.791666666668

        },

        dataTypes: {
            commonSeriesOptions: { dataSource: "data" },
            axes: "array",
            series: "array",
            annotations: "array",
            indicators: "array",
            seriesColors: "array",
            palette: "array",
            rowDefinitions: "array",
            columnDefinitions: "array",
            seriesBorderColors: "array",
            pointColors: "array",
            pointBorderColors: "array",
            initSeriesRender: "boolean",
            theme: "enum",
            canResize: "boolean",
            isResponsive: "boolean",
            elementSpacing: "number",
            primaryXAxis: {
                labels: "array",
                multiLevelLabels: "array",
                stripLine: "array",
                orientation: "enum",
                rangePadding: "enum",
                labelPlacement: "enum",
                tickLinesPosition: "enum",
                labelPosition: "enum",
                opposedPosition: "boolean",
                zoomFactor: "number",
                zoomPosition: "number",
                showNextToAxisLine: "boolean"
            },
            primaryYAxis: {
                labels: "array",
                multiLevelLabels: "array",
                stripLine: "array",
                orientation: "enum",
                rangePadding: "enum",
                labelPlacement: "enum",
                opposedPosition: "boolean",
                zoomFactor: "number",
                zoomPosition: "number"
            },
            legend: {
                textOverflow: "enum",
                shape: "enum",
                alignment: "enum",
                position: "enum",
                itemPadding: "number"
            },
            exportSettings: {
                type: "string",
                fileName: "string",
                orientation: "enum",
                angle: "number",
                mode: "enum",
                action: "string",
                multipleExport: "boolean"
            },
            zooming: {
                enable: "boolean",
                type: "string",
                enableMouseWheel: "boolean",
                toolbarItems: "array",
                enableScrollbar: "boolean"
            },
            size: {
                width: "string",
                height: "string"
            }

        },

        observables: ["xZoomFactor", "yZoomFactor", "xZoomPosition", "yZoomPosition"],

        _tags: [{
            tag: "series",
            attr: ["xAxisName", "yAxisName", "zOrder", "endAngle", "startAngle", "explodeIndex", "labelPosition", "xName", "yName", "pointColorMappingName", "pyramidMode", "boxPlotMode", "showMedian",
                "pieCoefficient", "explodeAll", "explodeOffset", "funnelWidth", "columnFacet", "funnelHeight", "gapRatio", "isClosed", "isTransposed",
                "isStacking", "bearFillColor", "bullFillColor", "dataSource", "enableAnimation", "animationDuration", "doughnutCoefficient", "doughnutSize",
                "enableSmartLabels", "drawType", "dashArray", "visibleOnLegend", "columnSpacing", "columnWidth", "drawType", "positiveFill", "explodeIndex", "cornerRadius",
                "lineCap", "lineJoin", "highlightSettings.enable", "highlightSettings.mode", "highlightSettings.pattern", "highlightSettings.color", "highlightSettings.opacity",
                "highlightSettings.customPattern", "highlightSettings.border.color", "highlightSettings.border.width", "selectionSettings.enable", "selectionSettings.mode", "selectionSettings.pattern",
                "selectionSettings.color", "selectionSettings.opacity", "selectionSettings.customPattern", "selectionSettings.type", "selectionSettings.rangeType",
                "selectionSettings.border.width", "selectionSettings.border.color", "dragSettings.enable", "dragSettings.type",
                "connectorLine.width", "connectorLine.opacity", "connectorLine.dashArray", "cornerRadius.topLeft", "cornerRadius.topRight", "cornerRadius.bottomLeft", "cornerRadius.bottomRight",
                "errorBar.visibility", "errorBar.mode", "errorBar.type", "errorBar.horizontalErrorValue", "errorBar.verticalErrorValue", "errorBar.horizontalPositiveErrorValue",
                "errorBar.horizontalNegativeErrorValue", "errorBar.verticalPositiveErrorValue", "errorBar.verticalNegativeErrorValue", "errorBar.direction",
                "errorBar.cap.visible", "errorBar.cap.width", "errorBar.cap.length", "errorBar.width", "errorBar.opacity", "emptyPointSettings.visible",
                "emptyPointSettings.style.color", "emptyPointSettings.style.border.color", "emptyPointSettings.style.border.width", "emptyPointSettings.displayMode",
                "bubbleOptions.minRadius", "bubbleOptions.maxRadius", "bubbleOptions.radiusMode",
                "tooltip.visible", "tooltip.format", "tooltip.template", "tooltip.fill", "tooltip.border.width", "tooltip.border.color", "tooltip.enableAnimation", "tooltip.duration",
                "tooltip.opacity", "tooltip.font.size", "tooltip.font.opacity", "tooltip.font.fontFamily", "tooltip.font.fontStyle", "tooltip.font.fontWeight", "tooltip.font.color", "border.width", "border.color", "border.dashArray", "marker.shape", "marker.imageUrl", "marker.size.width", "marker.size.height",
                "marker.visible", "marker.opacity", "marker.fill", "marker.border.color", "marker.border.width", "marker.dataLabel.visible", "marker.dataLabel.angle",
                "marker.dataLabel.template", "marker.dataLabel.textMappingName", "marker.dataLabel.verticalTextAlignment", "marker.dataLabel.horizontalTextAlignment", "marker.dataLabel.textPosition", "marker.dataLabel.shape",
                "marker.dataLabel.opacity", "marker.dataLabel.fill", "marker.dataLabel.border.color", "marker.dataLabel.border.width", "marker.dataLabel.maximumLabelWidth", "marker.dataLabel.enableWrap",
                "marker.dataLabel.connectorLine.width", "marker.dataLabel.connectorLine.type", "marker.dataLabel.connectorLine.color", "marker.dataLabel.offset", "marker.dataLabel.offset.x", "marker.dataLabel.offset.y",
                "marker.dataLabel.font.size", "marker.dataLabel.font.color", "marker.dataLabel.enableContrastColor", "marker.dataLabel.showEdgeLabels", "marker.dataLabel.font.opacity", "marker.dataLabel.font.fontFamily", "marker.dataLabel.font.fontStyle", "marker.dataLabel.font.fontWeight",
                "marker.dataLabel.margin", "marker.dataLabel.margin.left", "marker.dataLabel.margin.top", "marker.dataLabel.margin.bottom", "marker.dataLabel.margin.right",
                "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "font.color", "splineType", "cardinalSplineTension",
                [
                    {
                        tag: "trendlines", attr: ["visibility", "visibilityOnLegend", "dashArray", "forewardForecast", "backwardForecast", "polynomialOrder",
                            "tooltip.visible", "tooltip.format", "tooltip.fill", "tooltip.border.width", "tooltip.border.color", "tooltip.enableAnimation", "tooltip.duration",
                            "tooltip.opacity", "tooltip.font.size", "tooltip.font.opacity", "tooltip.font.fontFamily", "tooltip.font.fontStyle", "tooltip.font.fontWeight", "tooltip.font.color",
                        ], singular: "trendline"
                    }
                ],
                [
                    {
                        tag: "points", attr: ["x", "y", "text", "textMappingName", "isEmpty", "fill", "visible"], singular: "points"
                    }
                ]

            ],
            singular: "series"
        }, {
            tag: "axes",
            attr: ["columnIndex", "rowIndex", "desiredIntervals", "multiLevelLabelsColor", "multiLevelLabelsFontColor", "isIndexed", "labelPlacement", "edgeLabelPlacement", "intervalType", "labelFormat", "labelPosition", "labelRotation", "logBase",
                "labelIntersectAction", "opposedPosition", "plotOffset", "rangePadding", "roundingPlaces", "valueType", "zoomFactor", "zoomPosition", "orientation",
                "crossesAt", "crossesInAxis", "scrollbarSettings.visible", "scrollbarSettings.canResize", "scrollbarSettings.range.min", "scrollbarSettings.range.max", "scrollbarSettings.pointsLength",
                "range.min", "range.max", "range.interval", "tickLinesPosition", "alternateGridBand.odd.fill", "alternateGridBand.odd.opacity", "alternateGridBand.even.fill", "alternateGridBand.even.opacity",
                "enableAutoIntervalOnZooming", "majorGridLines.width", "majorGridLines.color", "majorGridLines.dashArray", "majorGridLines.visible", "majorGridLines.opacity", "majorTickLines.color", "majorTickLines.width", "majorTickLines.size", "majorTickLines.visible",
                "minorGridLines.width", "minorGridLines.dashArray", "minorGridLines.color", "minorGridLines.visible", "minorTickLines.color", "minorTickLines.width", "minorTickLines.size", "minorTickLines.visible", "labelBorder.color", "labelBorder.width", "minorTicksPerInterval",
                "columnSpan", "crosshairLabel.visible", "crosshairLabel.rx", "crosshairLabel.ry", "crosshairLabel.border.color", "crosshairLabel.border.width", "crosshairLabel.fill",
                "crosshairLabel.font.fontFamily", "crosshairLabel.font.fontStyle", "crosshairLabel.font.size", "crosshairLabel.font.fontWeight", "crosshairLabel.font.opacity", "crosshairLabel.font.color", "font.size", "font.color", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "isInversed", "enableTrim", "maximumLabelWidth",
                "axisLine.visible", "axisLine.width", "axisLine.color", "axisLine.dashArray", "axisLine.offset", "maximumLabels", "title.text", "title.visible", "title.enableTrim", "title.offset",
                "title.alignment", "title.position", "title.maximumTitleWidth", "title.font.size", "title.font.color", "title.font.opacity", "title.font.fontFamily", "title.font.fontStyle", "title.font.fontWeight",
                "additionalPadding", "showNextToAxisLine",
                [
                    {
                        tag: "stripLine", attr: ["borderColor", "startFromAxis", "zIndex", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "font.color"],
                        singular: "stripLine"
                    }
                ],
                [
                    {
                        tag: "multiLevelLabels", attr: ["textOverflow", "maximumTextWidth", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "border.type", "border.width"],
                        singular: "multiLevelLabel"
                    }
                ],
            ],
            singular: "axis"
        },
        {
            tag: "primaryXAxis.stripLine",
            attr: ["borderColor", "startFromAxis", "zIndex", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "font.color"],
            singular: "primaryXAxis.stripLine"
        },
        {
            tag: "primaryYAxis.stripLine",
            attr: ["borderColor", "startFromAxis", "zIndex", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "font.color"],
            singular: "primaryYAxis.stripLine"
        },
        {
            tag: "primaryXAxis.multiLevelLabels",
            attr: ["textOverflow", "maximumTextWidth", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "border.type", "border.width"],
            singular: "primaryXAxis.multiLevelLabel"
        },
        {
            tag: "primaryYAxis.multiLevelLabels",
            attr: ["textOverflow", "maximumTextWidth", "textAlignment", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "border.type", "border.width"],
            singular: "primaryYAxis.multiLevelLabel"
        },
        {
            tag: "indicators",
            attr: ["seriesName", "xName", "xAxisName", "macdType", "shortPeriod", "longPeriod", "enableAnimation", "animationDuration",
                "yAxisName", "standardDeviations", "kPeriod", "dPeriod", "periodLine.fill", "periodLine.width", "lowerLine.fill",
                "lowerLine.width", "upperLine.fill", "upperLine.width", "macdLine.fill", "macdLine.width", "histogram.fill", "histogram.opacity",
                "histogram.border.color", "histogram.border.width", "font.size", "font.opacity", "font.fontFamily", "font.fontStyle", "font.fontWeight", "font.color",
                "tooltip.visible", "tooltip.format", "tooltip.fill", "tooltip.border.width", "tooltip.border.color", "tooltip.enableAnimation", "tooltip.duration",
                "tooltip.opacity",
                [
                    {
                        tag: "points", attr: []
                    }
                ]
            ],
            singular: "indicator"
        },
        {
            tag: "annotations",
            attr: ["coordinateUnit", "verticalAlignment", "horizontalAlignment", "xAxisName", "yAxisName", "margin.left", "margin.right", "margin.top", "margin.bottom"],
            singular: "annotation"
        },
        {
            tag: "rowDefinitions",
            attr: ["rowHeight", "lineColor", "lineWidth", "unit"],
            singular: "rowDefinition"
        },
        {
            tag: "columnDefinitions",
            attr: ["columnWidth", "lineColor", "lineWidth", "unit"],
            singular: "columnDefinition"
        },
        ],
        _xZoomFactor: ej.util.valueFunction("xZoomFactor"),
        _yZoomFactor: ej.util.valueFunction("yZoomFactor"),
        _xZoomPosition: ej.util.valueFunction("xZoomPosition"),
        _yZoomPosition: ej.util.valueFunction("yZoomPosition"),


        _init: function () {

            this._renderSfChart();

        },
        _destroy: function () {
            $('#template_group_' + this._id).remove();
            $("#annotation_group_" + this._id).remove();
            $(this.element).removeClass("e-chart e-js").find("#" + this.svgObject.id).remove();
            $(this.element).removeClass("e-chart e-js").find("#legend_" + this.svgObject.id).remove();
        },

        _series: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },
        _series_points: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },
        _primaryXAxis_stripLine: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },
        _primaryYAxis_stripLine: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },
        _axes: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },
        _axes_stripLine: function (index, property, value, old) {
            this.redraw();
            this._trigger("refresh");
        },

        _ignoreOnExport: ["dataSource"],


        _removeZoomkit: function () {
            if (this.model.zooming.enable) {
                $("[id^=" + this._id + "_][id$=" + "_ResetZoom" + "]").remove();
                $("[id^=" + this._id + "_][id$=" + "_PanBtn" + "]").remove();
                $("[id^=" + this._id + "_][id$=" + "_ZoomBtn" + "]").remove();
                $("[id^=" + this._id + "_][id$=" + "_ZoomInBtn" + "]").remove();
                $("[id^=" + this._id + "_][id$=" + "_ZoomOutBtn" + "]").remove();
            }
        },

        //to create a new canvas element to export and print
        getCanvasElement: function (id) {
            var chart,
                printId = $("#" + id),
                exportPrintCanvas = document.createElement('canvas'),
                expCtx = exportPrintCanvas.getContext("2d"),
                chartWidth = $("#" + id + "_canvas").width(),
                chartHeight = $("#" + id + "_canvas").height();
            exportPrintCanvas.setAttribute('width', chartWidth);
            exportPrintCanvas.setAttribute('height', chartHeight);
            chart = $("#" + id + '_canvas')[0];
            expCtx.drawImage(chart, 0, 0, chartWidth, chartHeight);

            return { canvasContainer: exportPrintCanvas, canvasArea: expCtx, width: chartWidth, height: chartHeight };

        },
        // export and print the svg element
        getSVGElement: function (id) {
            var chartWidthSVG = $("#" + id + "_svg").width(),
                chartHeightSVG = $("#" + id + "_svg").height(),
                svgChart = document.getElementById(id + "_svg"),
                containerSVG = $('<div>').append($(svgChart).clone()).html(),
                legendChart = document.getElementById("legend_" + id + "_svg"),
                position = $("#legend_" + id).position(),
                element = $("#" + id + "_svg_Legend").attr('transform', "translate(" + position.left + "," + position.top + ")"),
                containerLegendSVG = $('<div>').append($(legendChart).clone()).html();

            return { chartSVG: containerSVG, legendChartSVG: containerLegendSVG, width: chartWidthSVG, height: chartHeightSVG };
        },

        print: function () {
            //declaration
            var contentSVG, Id, svgID, canvasElement, chartObj, printId, printCtxAnnot, legend, selectionChart, selectionLegendChart,
                selectionChartSVG, legendChartSVG, annotationChartCanvas, canvasChart = [], writeCode = [], containerselectionChartSVG,
                containerSelectionLegendSVG, legendPos, annotationChartSVG, containerAnnotationChartSVG,
                serIndex = this.model.series.length, scrollbar, TDStyle = "", oImg = "", chartHeight = 0, chartDistance = 50;
            for (var i = 0; i < arguments.length; i++) {

                printId = $("#" + arguments[i]);
                Id = arguments[i];

                //to check whether the div contains chart element
                if (printId.hasClass("e-datavisualization-chart")) {
                    chartObj = printId.ejChart("instance");
                    contentSVG = "<html> <div style='position:relative; left:0px; top:" + chartHeight + "px'>";
                    scrollbar = "";
                    svgID = chartObj.svgObject.id;

                    chartHeight = $("#" + svgID).height() + chartDistance;

                    if ($("#axisScrollbar_" + Id)[0])
                        scrollbar = $("#axisScrollbar_" + Id)[0].innerHTML;

                    var zoomButton = ["ResetZoom", "PanBtn", "ZoomBtn", "ZoomOutBtn", "ZoomInBtn"], zoomBtnObj = [], zoomToolbarID, btnCount = 5;
                    for (var l = 0; l < btnCount; l++) {
                        zoomToolbarID = "#" + svgID + "_" + zoomButton[l];
                        if ($(zoomToolbarID)[0]) {
                            zoomBtnObj.push($(zoomToolbarID));
                            //Remove zoomButtons on printing
                            $(zoomToolbarID).remove();
                        }
                    }

                    if (chartObj.model.enableCanvasRendering == true) { //to check the chart to render in canvas
                        canvasElement = this.getCanvasElement(Id);

                        //to find the lengend position  
                        legendPos = chartObj.model.LegendBounds;

                        oImg = document.createElement("img");
                        oImg.setAttribute('src', $('#legend_' + Id + '_canvas')[0].toDataURL());
                        $("#legend_Scroller" + Id).prepend(oImg);
                        contentSVG += document.getElementById('chartContainer_' + Id).outerHTML;
                        $(oImg).remove();
                        oImg = "";

                        var mode;
                        //selection chart to print in canvas
                        for (var index = 0; index < serIndex; index++) {
                            mode = chartObj.model.series[index].selectionSettings.mode.toLowerCase();
                            if (chartObj.model.AreaType != "none") {
                                if (mode == "series") {
                                    if ($(printId).find("#" + Id + "_Selection_series" + index + "_canvas").length > 0) {
                                        selectionChart = $("#" + Id + "_Selection_series" + index + "_canvas")[0];
                                        canvasElement.canvasArea.drawImage(selectionChart, 0, 0, canvasElement.width, canvasElement.height);
                                    }
                                    if ($(printId).find("#" + Id + "_Selection_Legend" + index + "_canvas").length > 0) {
                                        selectionLegendChart = $("#" + Id + "_Selection_Legend" + index + "_canvas")[0];
                                        oImg = "<img style='position:absolute;left:0px;' src='" + selectionLegendChart.toDataURL() + "'/>";
                                    }
                                } else if (mode == "point") {
                                    var selectedPoints = chartObj.model.selectedDataPointIndexes;
                                    for (var l = 0; l < selectedPoints.length; l++) {
                                        if (selectedPoints[l].seriesIndex == index) {
                                            if ($(printId).find("#" + Id + "_Selection_series" + index + "_point_" + selectedPoints[l].pointIndex + "_canvas").length > 0) {
                                                selectionChart = $("#" + Id + "_Selection_series" + index + "_point_" + selectedPoints[l].pointIndex + "_canvas")[0];
                                                canvasElement.canvasArea.drawImage(selectionChart, 0, 0, canvasElement.width, canvasElement.height);
                                            }
                                        }
                                    }
                                    if ($(printId).find("#" + Id + "_Selection_Legend" + index + "_canvas").length > 0) {
                                        selectionLegendChart = $("#" + Id + "_Selection_Legend" + index + "_canvas")[0];
                                        oImg = "<img style='position:absolute;left:0px;' src='" + selectionLegendChart.toDataURL() + "'/>";
                                    }
                                } else {
                                    var selectedPoints = chartObj.model.selectedDataPointIndexes;
                                    for (var l = 0; l < selectedPoints.length; l++) {
                                        if (selectedPoints[l].seriesIndex == index) {
                                            if ($(printId).find("#" + Id + "_Selection_Cluster_point_" + selectedPoints[l].pointIndex + "_canvas").length > 0) {
                                                selectionChart = $("#" + Id + "_Selection_Cluster_point_" + selectedPoints[l].pointIndex + "_canvas")[0];
                                                canvasElement.canvasArea.drawImage(selectionChart, 0, 0, canvasElement.width, canvasElement.height);
                                            }
                                        }
                                    }
                                    if ($(printId).find("#" + Id + "_SelectionCluster_Legend" + index + "_canvas").length > 0) {
                                        selectionLegendChart = $("#" + Id + "_SelectionCluster_Legend" + index + "_canvas")[0];
                                        oImg = "<img style='position:absolute;left:0px;' src='" + selectionLegendChart.toDataURL() + "'/>";
                                    }
                                }
                            } else {
                                var selectedPoints = chartObj.model.selectedDataPointIndexes;
                                for (var l = 0; l < selectedPoints.length; l++) {
                                    if (selectedPoints[l].seriesIndex == index) {
                                        if ($('#' + Id + '_Selection_series' + index + "_point_" + selectedPoints[l].pointIndex + "_canvas").length > 0) {
                                            selectionChart = document.getElementById(Id + '_Selection_series' + index + "_point_" + selectedPoints[l].pointIndex + "_canvas");
                                            canvasElement.canvasArea.drawImage(selectionChart, 0, 0, canvasElement.width, canvasElement.height);
                                            if ($('#' + Id + "_Selection_Legend" + selectedPoints[l].pointIndex + "_canvas").length > 0) {
                                                selectionLegendChart = document.getElementById(Id + "_Selection_Legend" + selectedPoints[l].pointIndex + "_canvas");
                                                oImg = "<img style='position:absolute;left:0px;' src='" + selectionLegendChart.toDataURL() + "'/>";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        canvasElement.canvasArea.save();
                        //to store the chart canvas element
                        canvasChart.push(canvasElement.canvasContainer);
                    }
                    //to check the chart to render in svg
                    else {
                        var printSvgElement = this.getSVGElement(Id);

                        $("#" + Id + "_svg_Legend").removeAttr("transform");
                        contentSVG += $("#chartContainer_" + Id)[0].outerHTML;

                        //selection chart to print in svg
                        contentSVG = this._getSelectionContentInSVG(chartObj, Id, contentSVG, "print");

                        //draw background image for chart
                        if (chartObj.model.backGroundImageUrl != null) {
                            var img = new Image();
                            img.src = chartObj.model.backGroundImageUrl;
                            var canvasObj = document.createElement('canvas');
                            var ctx = canvasObj.getContext("2d");
                            canvasObj.setAttribute('width', printSvgElement.width);
                            canvasObj.setAttribute('height', printSvgElement.height);
                            ctx.drawImage(img, 0, 0, printSvgElement.width, printSvgElement.height);
                            contentSVG += "<img src='" + canvasObj.toDataURL() + "'/>";
                        }
                        contentSVG += '<svg xmlns="http://www.w3.org/2000/svg" style="left:0px; top:0px; position:absolute;" width="' + printSvgElement.width + '" height="' + printSvgElement.height + '" >';
                        contentSVG += printSvgElement.chartSVG.toString() + " </svg>";

                        //Add zooming scrollbar with chart
                        contentSVG += scrollbar + "</div></html>";

                        //to store the chart svg element
                        writeCode.push(contentSVG);
                    }

                    for (var l = 0; l < zoomBtnObj.length; l++) {
                        //push zoomButtons again
                        $("#chartContainer_" + Id).append(zoomBtnObj[l]);
                    }
                }
                //the div does not contains the chart element
                else {
                    contentSVG = "<html>";
                    contentSVG += document.getElementById(arguments[i]).innerHTML;
                    contentSVG += "</html>";
                    //to store the div id elements
                    writeCode.push(contentSVG);
                }
            }
            //to print the chart in a new window
            var win = window.open();
            for (var s = 0; s < writeCode.length; s++)
                win.document.write(writeCode[s]);
            //to open a print window for canvas element
            if (canvasChart.length > 0) {
                var img = new Image();
                for (var y = 0; y < canvasChart.length; y++) {
                    contentSVG += "<img src='" + canvasChart[y].toDataURL() + "'/>";
                    img.src = canvasChart[y].toDataURL();
                }
                contentSVG += oImg;
                //Add zooming scrollbar with chart
                contentSVG += scrollbar + "</div></html>";
                img.onload = function () {
                    win.document.write(contentSVG);
                    contentSVG = "";
                    win.document.close();
                    win.focus();
                    win.print();
                    win.close();
                }
            }
            //to open a print window for svg element
            else if (writeCode.length > 0) {
                contentSVG = "";
                win.document.close();
                win.focus();
                win.print();
                win.close();
            }

        },


        redraw: function (excludeDataUpdate, pinchPanning, target, isTouch) {
            if (this.model.enableCanvasRendering) {
                if (this.model.zooming.enable && this.svgRenderer.ctx)
                    this.svgRenderer.ctx.clearRect(0, 0, $("#" + this._id).width(), $("#" + this._id).height());
                else {
                    $(this.svgObject).remove();
                    var width = this.svgWidth;
                    $("#canvas_trackSymbol").remove();
                    $("#" + this._id + "_canvas_Tracker").remove();
                    $("#secondCanvas").remove();
                    this.svgRenderer = new ej.EjCanvasRender(this.element); // to create canvas container
                    this.svgRenderer.svgObj.height = ej.util.isNullOrUndefined(this.model.size.height) ? "450" : this.model.size.height;
                    this.svgRenderer.svgObj.width = ej.util.isNullOrUndefined(this.model.size.width) ? width : this.model.size.width;
                    this.svgObject = this.svgRenderer.svgObj;
                    var ctx = this.svgRenderer.svgObj.getContext("2d");

                    $(this.scrollerContainer).remove();
                    $(this.legendSvgContainer).remove();
                    $(this.legendContainer).remove();
                    this.legendContainer = $("<div></div>").attr('id', "legend_" + this._id).css("height", "0px");
                    this.scrollerContainer = $("<div></div>").attr('id', "legend_Scroller" + this._id).css("height", "0px");
                    this.legendSvgContainer = this.svgRenderer.createLegendCanvas(this.element); //creating new CANVAS element for legend
                    this.svgRenderer.append(this.legendSvgContainer, this.scrollerContainer);
                    $(this.scrollerContainer).appendTo(this.legendContainer);
                    $(this.legendContainer).appendTo(this.chartContainer);
                }
            }
            else if ((this.svgObject.id).indexOf("_canvas") != -1) {
                this._removeZoomkit();
                $(this.svgObject).remove();
                this.svgRenderer = new ej.EjSvgRender(this.element);  // to create svg container
                this.svgObject = this.svgRenderer.svgObj;
                this.canvasX = this.canvasY = 0;

                $(this.scrollerContainer).remove();
                $(this.legendSvgContainer).remove();
                $(this.legendContainer).remove();
                this.legendContainer = $("<div></div>").attr('id', "legend_" + this._id).css("height", "0px");
                this.scrollerContainer = $("<div></div>").attr('id', "legend_Scroller" + this._id).css("height", "0px");
                this.legendSvgContainer = this.svgRenderer.createLegendSvg(this.element); //creating new SVG element for legend
                this.svgRenderer.append(this.legendSvgContainer, this.scrollerContainer);
                $(this.scrollerContainer).appendTo(this.legendContainer);
                $(this.legendContainer).appendTo(this.chartContainer);
            } else {
                if (!this.dragPoint || (!pinchPanning && (!this.panning || !target || this.scrollbarUpdate || (isTouch || this.panning && this.model.browserInfo.name != "chrome")) || this.model.enable3D)) {
                    $(this.svgObject).empty();  // using existing svg container
                    $(this.legendSvgContainer).empty();
                }
                else {
                    var svg = this.svgObject;
                    this.chartUpdating = true;
                    if (!this.continuePinching && target) {
                        target.id = "";
                        target.setAttribute("opacity", 0);
                        svg.appendChild(target);
                        this.continuePinching = false;
                    }
                    while (svg.childNodes.length > 1)
                        svg.removeChild(svg.firstChild);

                    $(this.legendSvgContainer).empty();
                }
            }
			if(this.model._chartAreaZoom)
			this.zoomed = this.model._chartAreaZoom = this.model._axes.some((function (val) {
                        return val.zoomFactor < 1 || val.zoomPosition > 0;
                    }));
			this._removeZoomkit();
            $("#annotation_group_" + this._id).remove();   // to remove annotation on redraw
            if (!excludeDataUpdate) {

                if (this.model.canResize || this.model.isResponsive)
                    this.bindResizeEvents();
                else
                    this.removeResizeEvents();
            }
            this.bindTo(excludeDataUpdate);
        },

        "export": function (type, action, multipleExport) {       // method to export chart
            var data,
                exporting = this.model.exportSettings,
                type = ej.util.isNullOrUndefined(type) ? exporting.type : type.toLowerCase(),
                action = ej.util.isNullOrUndefined(action) ? exporting.action : action.toLowerCase();

            if (type == "xlsx")
                this._getExportModel(type, action, multipleExport);
            else if (type == "svg" || !this.model.enableCanvasRendering)
                data = this.svgExport();
            else
                data = this.imageExport();

            return data;
        },

        _getExportModel: function (type, action, multipleExport) {           // to export chart as excel
            var modelClone = $.extend(true, {}, this.model),
                exporting = this.model.exportSettings,
                multipleExport = ej.util.isNullOrUndefined(type) ? exporting.multipleExport : multipleExport,
                svgHeight = this.svgHeight, svgWidth = this.svgWidth,
                actualHeight = modelClone.size.height, actualWidth = modelClone.size.width,
                attr = { action: action, method: 'post' },
                form = ej.buildTag('form', "", null, attr),
                series, chartobj = this;
            modelClone.event = null; // event is not API and having circular structure object type
            modelClone.primaryXAxis.range = modelClone.primaryXAxis.actualRange;
            modelClone.primaryYAxis.range = modelClone.primaryYAxis.actualRange;
            if (this._ignoreOnExport) {
                series = modelClone.series;
                for (var j = 0; j < series.length; j++) {
                    delete series[j].dataSource;
                    delete series[j].query;
                    series[j].fill = jQuery.type(series[j].fill) == "array" ? series[j].fill[0].color : series[j].fill;
                }
            }
            for (var j = 0; j < series.length; j++) {
                if (!series[j].dataPoint) {
                    series[j].dataPoint = series[j].points;
                    for (var k = 0; k < series[j].dataPoint.length; k++) {
                        if (!series[j].dataPoint[k].fill && modelClone.pointColors.length > k)
                            series[j].dataPoint[k].fill = modelClone.pointColors[k];
                    }
                }
            }
            if (ej.raiseWebFormsServerEvents) {
                this.raiseWebServerEvents(JSON.stringify(modelClone), "excelExporting");
                this.raiseWebServerEvents(JSON.stringify(modelClone));
            }
            else {
                if (modelClone.size.height && modelClone.size.height.indexOf("%") != -1)
                    modelClone.size.height = $(this.svgObject).height().toString();
                if (modelClone.size.width && modelClone.size.width.indexOf("%") != -1)
                    modelClone.size.width = $(this.svgObject).width().toString();

                if (multipleExport) {
                    var chartObjectArray = {};
                    $('body').find('.e-datavisualization-chart').each(function (index, object) {
                        var chartObject = $(object).data('ejChart');
                        if (!ej.isNullOrUndefined(chartObject)) {
                            chartObject.model.event = null;
                            var modelClone = JSON.parse(JSON.stringify(chartObject.model));
                            if (chartobj._ignoreOnExport) {
                                series = modelClone.series;
                                for (var j = 0; j < series.length; j++) {
                                    delete series[j].dataSource;
                                    delete series[j].query;
                                    series[j].fill = jQuery.type(series[j].fill) == "array" ? series[j].fill[0].color : series[j].fill;
                                }
                                chartObjectArray[index] = JSON.stringify(modelClone);
                                var inputAttr = { name: 'ChartModel', type: 'hidden', value: JSON.stringify(modelClone) }
                                var input = ej.buildTag('input', "", null, inputAttr);
                                form.append(input);
                            }
                        }
                    });
                }
                else {
                    var inputAttr = { name: 'ChartModel', type: 'hidden', value: JSON.stringify(modelClone) }
                    var input = ej.buildTag('input', "", null, inputAttr);
                    form.append(input);
                    form.append(this);
                }
                $('body').append(form);
                form.submit();
                modelClone.size = { width: actualWidth, height: actualHeight };
            }
            return modelClone;
        },

        imageExport: function () {       // to export chart as image
            var modelClone = $.extend(true, {}, this.model);
            modelClone.primaryXAxis.range = modelClone.primaryXAxis.actualRange;
            modelClone.primaryYAxis.range = modelClone.primaryYAxis.actualRange;
            modelClone.event = null; // event is not API and having circular structure object type
            var Id = this._id,
                selectionChart = $('[id*=' + Id + '_Selection_' + ']'),
                legend = $('#legend_' + Id + '_canvas')[0],
                exporting = this.model.exportSettings,
                angle = exporting.angle, exportChart, exprtCtx, chartWidth, chartHeight, chart,
                legendPos = this.model.LegendBounds, containerStyle, i, dataURL,
                exportCanvas = this.getCanvasElement(Id);
            exportChart = exportCanvas.canvasContainer;
            exprtCtx = exportCanvas.canvasArea;
            chartWidth = exportCanvas.width;
            chartHeight = exportCanvas.height;
            chart = $("#" + Id + '_canvas')[0];
            exportChart.setAttribute('id', 'Export_' + Id);
            if (angle == 0) {
                legendPos = this.model.LegendBounds;
                if (legendPos.X && (legendPos.Width != 0 && legendPos.Height != 0))
                    exprtCtx.drawImage(legend, legendPos.X, legendPos.Y);
            } else if (angle == 90 || angle == -90) {
                exportChart.setAttribute('width', chartHeight);
                exportChart.setAttribute('height', chartWidth);
                exprtCtx.save();
                exprtCtx.translate(chartHeight / 2, chartWidth / 2);
                exprtCtx.rotate(angle * Math.PI / 180);
                exprtCtx.drawImage(chart, -chartWidth / 2, - chartHeight / 2);
                exprtCtx.restore();
                if (legendPos.X) {
                    exprtCtx.save();
                    if (angle == 90)
                        exprtCtx.translate(chartHeight - legendPos.Y - legendPos.Height / 2, chartWidth - legendPos.X - legendPos.Width / 2);
                    else
                        exprtCtx.translate(legendPos.Y + legendPos.Height / 2, legendPos.X + legendPos.Width / 2);
                    exprtCtx.rotate(angle * Math.PI / 180);
                    exprtCtx.drawImage(legend, -legendPos.Width / 2, -legendPos.Height / 2);
                    exprtCtx.restore();
                }
            } else {
                exportChart.setAttribute('width', chartWidth);
                exportChart.setAttribute('height', chartHeight);
                exprtCtx.save();
                exprtCtx.translate(chartWidth, chartHeight);
                exprtCtx.rotate(180 * Math.PI / 180);
                exprtCtx.drawImage(chart, 0, 0);
                exprtCtx.restore();
                if (legendPos.X) {
                    exprtCtx.save();
                    exprtCtx.translate(legendPos.X + legendPos.Width / 2, chartHeight - legendPos.Y - legendPos.Height / 2);
                    exprtCtx.rotate(angle * Math.PI / 180);
                    exprtCtx.drawImage(legend, -legendPos.Width / 2, -legendPos.Height / 2);
                    exprtCtx.restore();
                }
            }

            for (i = 0; i < selectionChart.length; i++) {       // export for selection
                containerStyle = document.getElementById(selectionChart[i].id).getBoundingClientRect();
                if (angle == 0)
                    exprtCtx.drawImage(selectionChart[i], 0, 0);
                else if (angle == 90 || angle == -90) {
                    exprtCtx.save();
                    exprtCtx.translate(chartHeight / 2, chartWidth / 2);
                    exprtCtx.rotate(angle * Math.PI / 180);
                    exprtCtx.drawImage(selectionChart[i], -chartWidth / 2, -chartHeight / 2);
                    exprtCtx.restore();
                    if (angle == 90 && selectionChart[i].id.indexOf(Id + '_Selection_Legend') >= 0) {
                        exprtCtx.save();
                        exprtCtx.translate(chartHeight - legendPos.Y - legendPos.Height / 2, chartWidth - legendPos.X - legendPos.Width / 2);
                        exprtCtx.rotate(angle * Math.PI / 180);
                        exprtCtx.drawImage(selectionChart[i], -legendPos.Width / 2, -legendPos.Height / 2);
                        exprtCtx.restore();
                    }
                    else if (angle == -90 && selectionChart[i].id.indexOf(Id + '_Selection_Legend') >= 0) {
                        exprtCtx.save();
                        exprtCtx.translate(legendPos.X + legendPos.Width / 2, chartHeight - legendPos.Y - legendPos.Height / 2);
                        exprtCtx.rotate(angle * Math.PI / 180);
                        exprtCtx.drawImage(selectionChart[i], -legendPos.Width / 2, -legendPos.Height / 2);
                        exprtCtx.restore();
                    }
                }
                else if (angle == 180) {
                    exprtCtx.save();
                    exprtCtx.translate(chartWidth, chartHeight);
                    exprtCtx.rotate(180 * Math.PI / 180);
                    exprtCtx.drawImage(selectionChart[i], 0, 0);
                    exprtCtx.restore();
                    if (angle == 180 && selectionChart[i].id.indexOf(Id + '_Selection_Legend') >= 0) {
                        exprtCtx.save();
                        exprtCtx.translate(legendPos.X + legendPos.Width / 2, chartHeight - legendPos.Y - legendPos.Height / 2);
                        exprtCtx.rotate(angle * Math.PI / 180);
                        exprtCtx.drawImage(selectionChart[i], -legendPos.Width / 2, -legendPos.Height / 2);
                        exprtCtx.restore();
                    }
                }
            }
            dataURL = exporting.type == "jpg" ? exportChart.toDataURL("image/jpeg") : exportChart.toDataURL();
            if (exporting.mode == "client")                    // for client side
                return exportChart;
            else if (ej.raiseWebFormsServerEvents)                            // for web forms
                this.raiseWebServerEvents(dataURL);
            else if (exporting.mode == "server") {                       // server side
                var attr, form, chartModel, input1, data, input2;
                attr = { action: exporting.action, method: 'post' };
                form = ej.buildTag('form', "", null, attr);
                chartModel = { name: 'ChartModel', type: 'hidden', value: JSON.stringify(modelClone) };
                input1 = ej.buildTag('input', "", null, chartModel);
                data = { name: 'Data', type: 'hidden', value: dataURL };
                input2 = ej.buildTag('input', "", null, data);
                form.append(input1).append(input2).append(this);
                $('body').append(form);
                form.submit();
            }
        },

        svgExport: function () {                   // to export chart as SVG
            var svgObj = this.svgObject.id,
                modelClone = $.extend(true, {}, this.model);
            for (var i = 0; i < this.model._axes.length; i++)
                modelClone._axes[i].range = modelClone._axes[i].actual_Range;
            modelClone.event = null; // event is not API and having circular structure object type
            var Id = this._id,
                exportChartSVG = this.getSVGElement(Id),
                exporting = this.model.exportSettings, angle = exporting.angle, chartHeight = exportChartSVG.height,
                svg = exportChartSVG.chartSVG, legend = exportChartSVG.legendChartSVG, chartWidth = exportChartSVG.width,
                content = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">', selectionContent;
            if (angle == 0)
                content = content + svg.toString() + legend.toString() + "</svg>";
            else if (angle == 90)
                content = content + '<g transform="translate(' + chartHeight + ',0) rotate(90 0 0)">' + svg.toString() + legend.toString() + "</g></svg>";
            else if (angle == -90)
                content = content + '<g transform="translate(0,' + chartWidth + ') rotate(-90 0 0)">' + svg.toString() + legend.toString() + "</g></svg>";
            else
                content = content + '<g transform="translate(' + chartWidth + ',' + chartHeight + ') rotate(180 0 0)">' + svg.toString() + legend.toString() + "</g></svg>";
            selectionContent = this._getSelectionContentInSVG(this, Id, content, "export");//export the chart along with selection
            var selected = $('#' + Id).find('[class*="Selection"]');
            content = selected.length > 0 ? selectionContent : content;
            content = encodeURIComponent(content);
            $("#" + svgObj + "_Legend").removeAttr("transform");
            if (exporting.mode == "client")            // for client side
                return content;
            else if (ej.raiseWebFormsServerEvents)                               // for web forms
                this.raiseWebServerEvents(content);
            else if (exporting.mode == "server") {                         // server side
                var attr, form, inputAttr, input, input1, chartModel;
                attr = { action: exporting.action, method: 'post' };
                form = ej.buildTag('form', "", null, attr);
                chartModel = { name: 'ChartModel', type: 'hidden', value: JSON.stringify(modelClone) };
                input1 = ej.buildTag('input', "", null, chartModel);
                inputAttr = { name: 'Data', type: 'hidden', value: content };
                input = ej.buildTag('input', "", null, inputAttr);
                form.append(input).append(input1).append(this);
                $('body').append(form);
                form.submit();
            }
        },
        _getSelectionContentInSVG: function (chartObj, Id, contentSVG, method) {
            var serIndex = this.model.series.length, selectionContent;
            //selection chart to export/ print in SVG
            if (!chartObj.model.enable3D) {
                var mode;
                for (var index = 0; index < serIndex; index++) {
                    mode = chartObj.model.series[index].selectionSettings.mode.toLowerCase();
                    if (chartObj.model.AreaType != "none") {
                        if (mode != "cluster") {
                            if ($('#' + Id + 'SelectionSegmentseries' + index).length > 0) {
                                selectionChartSVG = document.getElementById(Id + "SelectionSegmentseries" + index);
                                containerselectionChartSVG = $('<div>').append($(selectionChartSVG).clone()).html();
                                legendChartSVG = document.getElementById(Id + "SelectionLegendSegmentseries" + index);
                                containerSelectionLegendSVG = $('<div>').append($(legendChartSVG).clone()).html();
                                if (method === "export") {
                                    selectionContent = contentSVG.slice(0, contentSVG.length - 6);
                                    selectionContent += '<svg>' + containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString() + "</svg>" + "</svg>";
                                }
                                else
                                    contentSVG += containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString();
                            }
                        } else {
                            if ($('#' + Id + 'SelectionSegmentClusterSeries' + index).length > 0) {
                                selectionChartSVG = document.getElementById(Id + "SelectionSegmentClusterSeries" + index);
                                containerselectionChartSVG = $('<div>').append($(selectionChartSVG).clone()).html();
                                legendChartSVG = document.getElementById(Id + "SelectionLegendSegmentClusterSeries" + index);
                                containerSelectionLegendSVG = $('<div>').append($(legendChartSVG).clone()).html();
                                if (method === "export") {
                                    selectionContent = ej.util.isNullOrUndefined(selectionContent) ? contentSVG.slice(0, contentSVG.length - 6) : selectionContent;
                                    selectionContent += '<svg >' + containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString() + "</svg>";
                                }
                                else
                                    contentSVG += containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString();
                            }
                        }
                    } else {
                        var selectedPoints = chartObj.model.selectedDataPointIndexes;
                        for (var l = 0; l < selectedPoints.length; l++) {
                            if (selectedPoints[l].seriesIndex == index) {
                                if ($('#' + Id + 'SelectionSegmentseries' + index + "Point" + selectedPoints[l].pointIndex).length > 0) {
                                    selectionChartSVG = document.getElementById(Id + 'SelectionSegmentseries' + index + "Point" + selectedPoints[l].pointIndex);
                                    containerselectionChartSVG = $('<div>').append($(selectionChartSVG).clone()).html();
                                    legendChartSVG = document.getElementById(Id + "SelectionLegendSegmentseries" + index + "Point" + selectedPoints[l].pointIndex);
                                    containerSelectionLegendSVG = $('<div>').append($(legendChartSVG).clone()).html();
                                    if (method === "export") {
                                        selectionContent = contentSVG.slice(0, contentSVG.length - 6);
                                        selectionContent += '<svg>' + containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString() + "</svg>" + "</svg>";
                                    }
                                    else
                                        contentSVG += containerselectionChartSVG.toString() + containerSelectionLegendSVG.toString();
                                }
                            }
                        }
                    }
                }
                if (mode == "cluster" && method === "export") selectionContent += "</svg>"
            } else {
                TDStyle = "";
                for (var index = 0; index < serIndex; index++) {
                    if ($("#Selectionseries" + index + "Segmentseries" + index).length > 0) {
                        TDStyle += $("#Selectionseries" + index + "Segmentseries" + index)[0].outerHTML;
                    }
                }
                contentSVG += TDStyle;
            }
            return method === "export" ? selectionContent : contentSVG;
        },
        raiseWebServerEvents: function (content, event) {             // to trigger server events in web forms
            var modelClone = $.extend(true, {}, this.model),
                exporting = this.model.exportSettings,
                event = ej.util.isNullOrUndefined(event) ? "exporting" : event;
            this.model.size._width = $(this.svgObject).width();
            this.model.size._height = $(this.svgObject).height();
            args = { model: modelClone, originalEventType: event },
                clientArgs = { Data: content, Format: exporting.type, Orientation: exporting.orientation, FileName: exporting.fileName };
            ej.raiseWebFormsServerEvents(event, args, clientArgs);
        },

        animate: function (options) {
            if (!options) { // Animate the entire series and indicators "previous behavior"
                var series = this.model.series;
                for (var i = 0; i < series.length; i++) {
                    series[i]._animatedSeries = false;
                    series[i]._animatedTrendline = false;
                    series[i].AnimationComplete = false; //pie doughnut animation with datalabel
                }
                var indicators = this.model.indicators;
                for (var j = 0; j < indicators.length; j++) {
                    indicators[j]._animatedSeries = false;
                    indicators[j]._animatedTrendline = false;
                }
            } else if (options.constructor === Array) { // Animate array of series
                for (var i = 0; i < options.length; i++) {
                    options[i]._animatedSeries = false;
                    options[i]._animatedTrendline = false;
                    options[i].AnimationComplete = false; //pie doughnut animation with datalabel
                }
            } else {   // Animate the specific series
                options._animatedSeries = false;
                options._animatedTrendline = false;
                options.AnimationComplete = false;  //pie doughnut animation with datalabel
            }
            this.redraw();
        },


        _setModel: function (options) {
            var series, axes;
            for (var prop in options) {
                this.disableAnimation();
                switch (prop) {
                    case "theme":
                        this.model._themeChanged = true;
                        this.model.theme = options[prop];
                        this.setTheme(ej.EjSvgRender.themes, this.model.theme);
                        $.extend(true, this.model.primaryXAxis, ej.EjSvgRender.themes[this.model.theme].primaryXAxis);
                        $.extend(true, this.model.primaryYAxis, ej.EjSvgRender.themes[this.model.theme].primaryYAxis);
                        for (var k = 0; k < this.model.axes.length; k++) {
                            if (this.model.axes[k].orientation && this.model.axes[k].orientation.toLowerCase() == "horizontal")
                                $.extend(true, this.model.axes[k], ej.EjSvgRender.themes[this.model.theme].secondaryX);
                            else
                                $.extend(true, this.model.axes[k], ej.EjSvgRender.themes[this.model.theme].secondaryY);
                        }
                        for (var l = 0; l < this.model.series.length; l++) {
                            $.extend(true, this.model.series[l], ej.EjSvgRender.themes[this.model.theme].commonSeriesOptions);
                        }
                        break;
                    case "commonSeriesOptions":
                        for (var i = 0; i < this.model.series.length; i++) {
                            if (options[prop].dataSource)
                                this.model.series[i].dataSource = null;
                            $.extend(true, this.model.series[i], {}, options[prop]);
                        }
                        break;
                    case "series":
						if (options[prop].length < this.model.series.length) { 
							this.model.series = this.model.series.slice(0, options[prop].length);
						} 
                        series = this.model.series;
                        for (var i = 0; i < series.length; i++) {
                            if (options[prop][i].dataSource) {
                                series[i].dataSource = null;
                            }
                        }
                        $.extend(true, series, {}, options[prop]);
                        for (var i = 0, len = series.length; i < len; i++) {
                            if (series[i].enableAnimation)
                                series[i]._animatedSeries = false;
                            if (options[prop][i] && options[prop][i].dataSource instanceof ej.DataManager)
                                //jQuery extends data manager as object.
                                series[i].dataSource = options[prop][i].dataSource;
                            if (options[prop][i] && options[prop][i].query instanceof ej.Query)
                                //jQuery.extend does not update the existing query with new one.
                                series[i].query = options[prop][i].query;
                        }
                        break;
                    case "legend":
                        $.extend(true, this.model.legend, {}, options[prop]);
                        break;
                    case "axes":
                        $.extend(true, this.model.axes, {}, options[prop]);
                        break;
                    case "primaryXAxis":
                        this.model.primaryXAxis.setRange = (options[prop].range) ? true : false;
                        this.model.primaryXAxis.setAxisInterval = (options[prop].range && options[prop].range.interval) ? true : this.model.primaryXAxis.setAxisInterval;
                        this.model.primaryXAxis.actual_Range = (this.model._axes[0].setRange) ? null : this.model._axes[0].actual_Range;
                        $.extend(true, this.model.primaryXAxis, {}, options[prop]);
                        break;
                    case "primaryYAxis":
                        this.model.primaryYAxis.setRange = (options[prop].range) ? true : false;
                        this.model.primaryYAxis.log_Range = options[prop].range ? options[prop].range : this.model.primaryYAxis.log_Range;
                        this.model.primaryYAxis.actual_Range = (this.model._axes[1].setRange) ? null : this.model._axes[1].actual_Range;
                        $.extend(true, this.model.primaryYAxis, {}, options[prop]);
                        break;
                    case "xZoomFactor":
                        this.model.primaryXAxis.zoomFactor = this._xZoomFactor();
                        axes = this.model.axes;
                        for (var i = 0; i < axes.length; i++) {
                            if (axes[i].orientation.toLowerCase() == "horizontal")
                                axes[i].zoomFactor = this._xZoomFactor();
                        }
                        break;
                    case "yZoomFactor":
                        this.model.primaryYAxis.zoomFactor = this._yZoomFactor();
                        axes = this.model.axes;
                        for (var i = 0; i < axes.length; i++) {
                            if (axes[i].orientation.toLowerCase() == "vertical")
                                axes[i].zoomFactor = this._yZoomFactor();
                        }
                        break;
                    case "xZoomPosition":
                        this.model.primaryXAxis.zoomPosition = this._xZoomPosition();
                        axes = this.model.axes;
                        for (var i = 0; i < axes.length; i++) {
                            if (axes[i].orientation.toLowerCase() == "horizontal")
                                axes[i].zoomPosition = this._xZoomPosition();
                        }
                        break;
                    case "yZoomPosition":
                        this.model.primaryYAxis.zoomPosition = this._yZoomPosition();
                        axes = this.model.axes;
                        for (var i = 0; i < axes.length; i++) {
                            if (axes[i].orientation.toLowerCase() == "vertical")
                                axes[i].zoomPosition = this._yZoomPosition();
                        }
                        break;
                    case "drilldown":
                        this.model.series = [];
                        this.model.explodeValue = null;
                        $.extend(true, this.model, {}, options[prop]);
                        break;
                    case "datasource":
                        for (var i = 0; i < this.model.series.length; i++) {
                            this.model.series[i].dataSource = null;
                            this.model.series[i].points = null;
                        }
                        $.extend(true, this.model, {}, options[prop]);
                        break;
                    case "chartArea":
                        $.extend(true, this.model.chartArea, {}, options[prop]);
                        break;

                    default:
                        $.extend(true, this.model, {}, options[prop]);
                        series = this.model.series;
                        for (var i = 0, len = series.length; i < len; i++) {
                            if (series[i].enableAnimation)
                                series[i]._animatedSeries = false;
                        }
                }
            }
            if (this.model.canResize || this.model.isResponsive)
                this.bindResizeEvents();
            else
                this.removeResizeEvents();
            $("#annotation_group_" + this._id).remove(); // to remove annotation on set model
            if (this.model.enableCanvasRendering) {
                $(this.svgObject).remove();
                $("#canvas_trackSymbol").remove();
                $("#" + this._id + "_canvas_Tracker").remove();
                $("#secondCanvas").remove();
                this.svgRenderer = new ej.EjCanvasRender(this.element); // to create canvas container
                this.svgRenderer.svgObj.height = ej.util.isNullOrUndefined(this.model.size.height) ? "450" : this.model.size.height;
                this.svgRenderer.svgObj.width = ej.util.isNullOrUndefined(this.model.size.width) ? $("#" + this._id).width() : this.model.size.width;
                this.svgObject = this.svgRenderer.svgObj;

                $(this.legendSvgContainer).remove();
                this.legendSvgContainer = this.svgRenderer.createLegendCanvas(this.element); //creating new CANVAS element for legend
                this.svgRenderer.append(this.legendSvgContainer, this.legendContainer);
            }
            else if ((this.svgObject.id).indexOf("_canvas") != -1) {
                this._removeZoomkit();
                $(this.svgObject).remove();
                this.svgRenderer = new ej.EjSvgRender(this.element);  // to create svg container
                this.svgObject = this.svgRenderer.svgObj;
                this.canvasX = this.canvasY = 0;

                $(this.legendSvgContainer).remove();
                this.legendSvgContainer = this.svgRenderer.createLegendSvg(this.element); //creating new SVG element for legend
                this.svgRenderer.append(this.legendSvgContainer, this.legendContainer);
            }
            else if (!this.chartUpdating) { // Condition checked to avoid knockout removing event.target
                $(this.svgObject).empty();              // using existing svg container
                $(this.legendSvgContainer).empty();
            }

            this.bindTo();
        }
    });

    ej.datavisualization.Chart.Locale = ej.datavisualization.Chart.Locale || {};
    ej.datavisualization.Chart.Locale['default'] = ej.datavisualization.Chart.Locale['en-US'] = {
        zoomIn: "Zoom In",
        zoomOut: "Zoom Out",
        zoom: "Zoom",
        pan: "Pan",
        reset: "Reset"
    };
    ej.datavisualization.Chart.CrosshairType = {

        Crosshair: 'crosshair',

        TrackBall: 'trackBall'
    };
    ej.datavisualization.Chart.TrackballDisplayMode = {

        Float: 'float',

        Grouping: 'grouping'
    };

    ej.datavisualization.Chart.VisibleOnLegend = {

        Visible: 'visible',

        Hidden: 'hidden'
    };

    ej.datavisualization.Chart.ExportingType = {

        PNG: 'png',

        JPG: 'jpg',

        PDF: 'pdf',

        SVG: 'svg',

        DOCX: 'docx',

        XLSX: 'xlsx'
    };

    ej.datavisualization.Chart.ExportingMode = {

        Client: 'client',

        Server: 'server'
    };

    ej.datavisualization.Chart.ExportingOrientation = {

        Portrait: 'portrait',

        Landscape: 'landscape'
    };

    ej.datavisualization.Chart.ValueType = {

        Double: 'double',

        DateTime: 'datetime',

        Category: 'category',

        Logarithmic: 'logarithmic',

        DateTimeCategory: 'datetimecategory'
    };

    ej.datavisualization.Chart.TextOverflow = {

        None: 'none',

        Wrap: 'wrap',

        Trim: 'trim',

        WrapAndTrim: 'wrapandtrim'
    };

    ej.datavisualization.Chart.Type = {

        Line: 'line',

        Spline: 'spline',

        Column: 'column',

        Doughnut: 'doughnut',

        Area: 'area',

        SplineArea: 'splinearea',

        StepLine: 'stepline',

        StepArea: 'steparea',

        Pie: 'pie',

        PieOfPie: 'pieofpie',

        Hilo: 'hilo',

        HiloOpenClose: 'hiloopenclose',

        Candle: 'candle',

        Bubble: 'bubble',

        Scatter: 'scatter',

        Bar: 'bar',

        StackingArea: 'stackingarea',

        StackingArea100: 'stackingarea100',

        RangeColumn: 'rangecolumn',

        StackingColumn: 'stackingcolumn',

        StackingColumn100: 'stackingcolumn100',

        StackingBar: 'stackingbar',

        StackingBar100: 'stackingbar100',

        Pyramid: 'pyramid',

        Funnel: 'funnel',

        Polar: 'polar',

        Radar: 'radar',

        RangeArea: 'rangearea',

        Waterfall: 'waterfall',

        BoxAndWhishker: 'boxandwhisker',

        StackingSplineArea: 'stackingsplinearea',

        StackingSplineArea100: 'stackingsplinearea100'

    };
    ej.datavisualization.Chart.SplitMode = {

        Position: 'position',

        Value: 'value',

        Percentage: 'percentage',

        Indexes: 'indexes'

    };

    ej.datavisualization.Chart.SplineType = {

        Natural: 'natural',

        Monotonic: 'monotonic',

        Cardinal: 'cardinal',

        Clamped: 'clamped'

    };
    ej.datavisualization.Chart.DragType = {

        XY: "xy",

        X: "x",

        Y: "y"
    };
    ej.datavisualization.Chart.LabelPlacement = {

        BetweenTicks: "betweenTicks",

        OnTicks: "onTicks"
    };

    ej.datavisualization.Chart.TrendlinesType = {

        Linear: "linear",

        Exponential: "exponential",

        Logarithmic: "logarithmic",

        Power: "power",

        Polynomial: "polynomial"
    };

    ej.datavisualization.Chart.ErrorBarType = {

        FixedValue: "fixedValue",

        Percentage: "percentage",

        StandardDeviation: "standardDeviation",

        StandardError: "standardError",

        Custom: "custom"
    };

    ej.datavisualization.Chart.ErrorBarMode = {

        Both: "both",

        Vertical: "vertical",

        Horizontal: "horizontal"
    };

    ej.datavisualization.Chart.ErrorBarDirection = {

        Both: "both",

        Plus: "plus",

        Minus: "minus"
    };

    ej.datavisualization.Chart.LabelIntersectAction = {

        None: "none",

        Rotate90: "rotate90",

        Rotate45: "rotate45",

        Wrap: "wrap",

        WrapByword: "wrapByWord",

        Trim: "trim",

        Hide: "hide",

        MultipleRows: "multipleRows"
    };

    ej.datavisualization.Chart.EdgeLabelPlacement = {

        None: "none",

        Shift: "shift",

        Hide: "hide"
    };

    ej.datavisualization.Chart.roundedCorner = {

        Both: "both",

        Start: "start",

        End: "end"

    };

    ej.datavisualization.Chart.Theme = {

        Azure: 'azure',

        FlatLight: 'flatlight',

        Azuredark: 'azuredark',

        Lime: 'lime',

        LimeDark: 'limedark',

        Saffron: 'saffron',

        SaffronDark: 'saffrondark',

        GradientLight: 'gradientlight',

        GradientDark: 'gradientdark',

        HighContrast01: 'highcontrast01',

        HighContrast02: 'highcontrast02',

        Material: 'material',

        Office365: 'office365',

        Bootstrap: 'bootstrap'
    };

    ej.datavisualization.Chart.FontStyle = {

        Normal: 'normal',

        Italic: 'italic'
    };

    ej.datavisualization.Chart.FontWeight = {

        Regular: 'regular',

        Bold: 'bold',

        Lighter: 'lighter'
    };

    ej.datavisualization.Chart.IntervalType = {

        Auto: 'auto',

        Days: 'days',

        Hours: 'hours',

        Seconds: 'seconds',

        Milliseconds: 'milliseconds',

        Minutes: 'minutes',

        Months: 'months',

        Years: 'years'
    };

    ej.datavisualization.Chart.RangePadding = {

        Additional: 'additional',

        Normal: 'normal',

        None: 'none',

        Round: 'round',

        Auto: 'auto'
    };

    ej.datavisualization.Chart.TextAlignment = {

        MiddleTop: 'middletop',

        MiddleCenter: 'middlecenter',

        MiddleBottom: 'middlebottom'
    };

    ej.datavisualization.Chart.LabelPosition = {

        Inside: 'inside',

        Outside: 'outside'
    };

    ej.datavisualization.Chart.ZIndex = {

        Over: 'over',

        Behind: 'behind'
    };

    ej.datavisualization.Chart.Unit = {

        percentage: 'percentage',

        pixel: 'pixel'
    };

    ej.datavisualization.Chart.PyramidMode = {

        Linear: 'linear',

        Surface: 'Surface'
    };

    ej.datavisualization.Chart.DrawType = {

        Line: 'line',

        Column: 'column',

        Area: 'area',

        RangeColumn: 'rangecolumn',

        Scatter: 'scatter',

        Spline: 'spline'
    };

    ej.datavisualization.Chart.AnimationType = {

        Linear: 'linear',

        Smooth: 'smooth'

    };

    ej.datavisualization.Chart.columnFacet = {

        Rectangle: 'rectangle',

        Cylinder: 'cylinder'
    };

    ej.datavisualization.Chart.EmptyPointMode = {

        Gap: 'gap',

        Zero: 'zero',

        Average: 'average'

    };

    ej.datavisualization.Chart.Pattern = {

        None: 'none',

        Chessboard: 'chessboard',

        Crosshatch: 'crosshatch',

        Dots: 'dots',

        Pacman: 'pacman',

        DiagonalBackward: 'diagonalBackward',

        DiagonalForward: 'diagonalForward',

        Grid: 'grid',

        Turquoise: 'turquoise',

        Star: 'star',

        Triangle: 'triangle',

        Circle: 'circle',

        Tile: 'tile',

        HorizontalDash: 'horizontalDash',

        VerticalDash: 'verticalDash',

        Rectangle: 'rectangle',

        Box: 'box',

        VerticalStripe: 'verticalStripe',

        HorizontalStripe: 'horizontalStripe',

        Bubble: 'bubble',

        Custom: 'custom'
    };

    ej.datavisualization.Chart.Mode = {

        Series: 'series',

        Point: 'point',

        Cluster: 'cluster',

        Range: 'range'
    };

    ej.datavisualization.Chart.SelectionType = {

        Single: 'single',

        Multiple: 'multiple'
    };
    ej.datavisualization.Chart.Shape = {

        None: 'none',

        LeftArrow: 'leftarrow',

        RightArrow: 'rightarrow',

        Circle: 'circle',

        Cross: 'cross',

        HorizLine: 'horizline',

        VertLine: 'vertLine',

        Diamond: 'diamond',

        Rectangle: 'rectangle',

        Triangle: 'triangle',

        InvertedTriangle: 'invertedtriangle',

        Hexagon: 'hexagon',

        Pentagon: 'pentagon',

        Star: 'star',

        Ellipse: 'ellipse',

        Wedge: 'wedge',

        Trapezoid: 'trapezoid',

        UpArrow: 'uparrow',

        DownArrow: 'downarrow',

        Image: 'image'
    };

    ej.datavisualization.Chart.DrawMode = {

        Both: 'both',

        Open: 'open',

        Close: 'close'
    };

    ej.datavisualization.Chart.LineCap = {

        Butt: 'butt',

        Round: 'round',

        Square: 'square'
    };

    ej.datavisualization.Chart.LineJoin = {

        Round: 'round',

        Bevel: 'bevel',

        Miter: 'miter'
    };

    ej.datavisualization.Chart.Position = {

        Top: 'top',

        Middle: 'middle',

        Bottom: 'bottom'
    };

    ej.datavisualization.Chart.Alignment = {

        Center: 'center',

        Near: 'near',

        Far: 'far'
    };

    ej.datavisualization.Chart.TickLinesPosition = {

        Inside: 'inside',

        Outside: 'outside'
    };

    ej.datavisualization.Chart.CoordinateUnit = {

        None: 'none',

        Pixels: 'pixels',

        Points: 'points'
    };

    ej.datavisualization.Chart.HorizontalAlignment = {

        Left: 'left',

        Right: 'right',

        Middle: 'middle'
    };

    ej.datavisualization.Chart.VerticalAlignment = {

        Top: 'top',

        Bottom: 'bottom',

        Middle: 'middle'
    };

    ej.datavisualization.Chart.Region = {

        Chart: 'chart',

        Series: 'series'
    };

    ej.datavisualization.Chart.ConnectorLineType = {

        Line: 'line',

        Bezier: 'bezier'
    };

    ej.datavisualization.Chart.HorizontalTextAlignment = {

        Near: 'near',

        Far: 'far',

        Center: 'center'
    };

    ej.datavisualization.Chart.VerticalTextAlignment = {

        Near: 'near',

        Far: 'far',

        Center: 'center'
    };

    ej.datavisualization.Chart.multiLevelLabelsBorderType = {

        None: 'none',

        Rectangle: 'rectangle',

        WithoutTopAndBottom: 'withouttopandbottom',

        Brace: 'brace',

        CurlyBrace: 'curlybrace'
    };

    ej.datavisualization.Chart.MACDType = {

        Line: 'line',

        Histogram: 'histogram',

        Both: 'both'
    };

    ej.datavisualization.Chart.IndicatorsType = {

        RSI: 'rsi',

        Momentum: 'momentum',

        Bollingerband: 'bollingerband',

        Accumulationdistribution: 'accumulationdistribution',

        EMA: 'ema',

        SMA: 'sma',

        Stochastic: 'stochastic',

        ATR: 'atr',

        MACD: 'macd',

        TMA: 'tma'
    };

    ej.datavisualization.Chart.BoxPlotMode = {

        Normal: 'normal',

        Exclusive: 'exclusive',

        Inclusive: 'inclusive',


    };

    ej.datavisualization.Chart.BubbleRadiusMode = {

        MinMax: 'minmax',

        Auto: 'auto'

    };

    $.extend(ej.datavisualization.Chart.prototype, ej.ejChart);
})(jQuery, Syncfusion);