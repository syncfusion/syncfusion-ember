"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
(function ($) {
    var Heatmap = (function (_super) {
        __extends(Heatmap, _super);
        function Heatmap(element, options) {
            _super.call(this);
            this._rootCSS = "e-heatmap";
            this._grid = null;
            this.PluginName = "ejHeatMap";
            this._setFirst = false;
            this.id = "null";
            this.model = null;
            this.validTags = ['div'];
            this.defaults = {
                itemsSource: null,
                itemsMapping: {
                    itemsSource: null,
                    columnStyle: {
                        headerTemplateID: "",
                        templateID: "",
                        textAlign: "",
                        width: null
                    },
                    headerMapping: {
                        columnStyle: {
                            headerTemplateID: "",
                            templateID: "",
                            textAlign: "",
                            width: null
                        },
                        displayName: "",
                        propertyName: ""
                    },
                    column: {
                        displayName: "",
                        propertyName: ""
                    },
                    columnMapping: null,
                    row: {
                        displayName: "",
                        propertyName: ""
                    },
                    value: {
                        displayName: "",
                        propertyName: ""
                    },
                },
                colorMappingCollection: null,
                selectedItem: null,
                legendCollection: [],
                heatMapCell: {
                    showContent: "visible",
                    showColor: true,
                },
                cellMouseOver: null,
                cellMouseEnter: null,
                cellMouseLeave: null,
                cellSelected: null,
                create: null,
                destroy: null,
                isResponsive: false,
                enableVirtualization: false,
                enableRTL: false,
                defaultColumnStyle: {
                    textAlign: "center",
                    headerTemplateID: "",
                    templateID: "",
                },
                enableTooltip: false,
                tooltipSettings: {
                    templateId: null,
                    position: {
                        stem: { horizontal: "left", vertical: "center" },
                        target: { horizontal: "right", vertical: "center" }
                    },
                    isBalloon: true,
                    animation: {
                        effect: "none",
                        speed: 0
                    },
                    associate: "mouseFollow",
                    trigger: "hover"
                },
                width: null,
                height: null
            };
            this.observables = [
                "heatMapCell.showContent",
                "heatMapCell.showColor",
            ];
            this.dataTypes = {
                colorMappingCollection: "data",
                itemsMapping: {
                    columnMapping: "data"
                },
                itemsSource: "data",
                legendCollection: "data"
            };
            this._tags = [
                {
                    tag: "colorMappingCollection",
                    attr: [
                        "value",
                        "color",
                        "label.bold",
                        "label.italic",
                        "label.text",
                        "label.textDecoration",
                        "label.fontSize",
                        "label.fontFamily",
                        "label.fontColor",
                    ],
                    singular: "colorMapping"
                }
            ];
            this._heatmapShowContent = ej.util.valueFunction("heatMapCell.showContent");
            this._heatmapShowColor = ej.util.valueFunction("heatMapCell.showColor");
            if (element) {
                if (!element["jquery"]) {
                    element = $("#" + element);
                }
                if (element.length) {
                    return $(element).ejHeatMap(options).data(this.PluginName);
                }
            }
        }
        Heatmap.prototype.setModel = function (opt, forceSet) {
            this.setModel(opt, forceSet);
        };
        Heatmap.prototype._destroy = function () {
            this.element.removeClass("e-heatmap e-js e-grid").empty();
        };
        Heatmap.prototype._setModel = function (options) {
            var update = false;
            var grid = this._grid;
            if (grid) {
                for (var item in options) {
                    switch (item) {
                        case "colorMappingCollection":
                            if (options.colorMappingCollection && options.colorMappingCollection.length > 0) {
                                this.model.colorMappingCollection = options.colorMappingCollection;
                                update = true;
                            }
                            break;
                        case "itemsSource":
                            if (options.itemsSource) {
                                this.model.itemsSource = options.itemsSource;
                                var data = void 0;
                                if (this.model.itemsMapping && this.model.itemsMapping.column && this.model.itemsMapping.row)
                                    data = this._bindCellMapValues();
                                else
                                    data = this._bindTableMapValues();
                                grid.dataSource(data.dataTableMapping, false);
                                update = true;
                            }
                            break;
                        case "legendCollection":
                            if (options.legendCollection && options.legendCollection > 0) {
                                this.model.legendCollection = options.legendCollection;
                            }
                            break;
                        case "heatMapCell":
                        case "heatmapCell":
                            if (options.heatmapCell) {
                                if (options.heatmapCell.showContent != undefined)
                                    options.heatMapCell.showContent = options.heatmapCell.showContent;
                                if (options.heatmapCell.showColor != undefined)
                                    options.heatMapCell.showColor = options.heatmapCell.showColor;
                            }
                            if (options.heatMapCell) {
                                if (options.heatMapCell.showColor) {
                                    if (typeof (options.heatMapCell.showColor()) === "boolean")
                                        this._heatmapShowColor(options.heatMapCell.showColor());
                                    else
                                        this.model.heatMapCell.showColor = (options.heatMapCell.showColor || options.heatMapCell.showColor === false) ? options.heatMapCell.showColor : this.model.heatMapCell.showColor;
                                }
                                if (options.heatMapCell.showContent) {
                                    if (typeof (options.heatMapCell.showContent()) === "function")
                                        this._heatmapShowContent(options.heatMapCell.showContent());
                                    else
                                        this.model.heatMapCell.showContent = (options.heatMapCell.showContent || options.heatMapCell.showContent === false) ? options.heatMapCell.showContent : this.model.heatMapCell.showContent;
                                }
                                update = true;
                            }
                            break;
                        case "tooltipSettings":
                        case "enableTooltip":
                            if (options.enableTooltip != undefined)
                                this.model.enableTooltip = options.enableTooltip;
                            if (options.tooltipSettings) {
                                if (options.tooltipSettings.position)
                                    this.model.tooltipSettings.position = options.tooltipSettings.position;
                                if (options.tooltipSettings.isBalloon != undefined)
                                    this.model.tooltipSettings.isBalloon = options.tooltipSettings.isBalloon;
                                if (options.tooltipSettings.animation)
                                    this.model.tooltipSettings.animation = options.tooltipSettings.animation;
                                if (options.tooltipSettings.associate)
                                    this.model.tooltipSettings.associate = options.tooltipSettings.associate;
                                if (options.tooltipSettings.trigger)
                                    this.model.tooltipSettings.trigger = options.tooltipSettings.trigger;
                                if (options.tooltipSettings.templateId !== undefined && options.tooltipSettings.templateId !== null)
                                    this.model.tooltipSettings.templateId = options.tooltipSettings.templateId;
                            }
                            if (this._hasClass(this.element[0], "e-tooltip")) {
                                $("#" + this.element[0].id).data("ejTooltip").destroy();
                                this.element.addClass("e-js");
                            }
                            this._renderTooltip();
                            break;
                    }
                }
                if (update) {
                    grid.refreshContent();
                    this._updateResponsiveSize(grid);
                }
            }
        };
        Heatmap.prototype._hasClass = function (el, cn) {
            var classes = el.classList;
            for (var j = 0; j < classes.length; j++) {
                if (classes[j] == cn) {
                    return true;
                }
            }
        };
        Heatmap.prototype._init = function () {
            var availSpace = this._getSpace();
            this._initData();
            this._updateDataSource();
            this._wireEvents();
            this._renderMapGrid();
            this._renderTooltip();
        };
        Heatmap.prototype._wireEvents = function () {
            this._on($(window), "resize", this._updateResponsiveSize);
            this._on($(window), "load", this._updateResponsiveSize);
            $(window).bind("mousewheel DOMMouseScroll", $.proxy(this._hideLegendMarker, this));
        };
        Heatmap.prototype._hideLegendMarker = function () {
            var triangles = $(".gradient_scale_marker");
            for (var i = 0; triangles.length > 0 && i < triangles.length; i++) {
                if (triangles[i]) {
                    var tri = triangles[i];
                    tri.style.visibility = "hidden";
                }
            }
        };
        Heatmap.prototype._getBoundingClientRect = function (element) {
            var rect = element.getBoundingClientRect();
            if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0") {
                rect = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: $(element).width(), height: $(element).height() };
            }
            return rect;
        };
        Heatmap.prototype._getSpace = function () {
            var availSapace = this._getBoundingClientRect(this.element[0]);
        };
        Heatmap.prototype._initData = function () {
            if (typeof this.model.legendCollection === 'string') {
                this.model.legendCollection = JSON.parse(this.model.legendCollection);
            }
            ;
            this._updateHeatMapCellData(this.model);
            if (this.model.enableTooltip && this.model.tooltipSettings && !this.model.tooltipSettings.templateId)
                this.model.tooltipSettings.templateId = this.element[0].id + "_DefaultTooltipDiv";
        };
        Heatmap.prototype._updateHeatMapCellData = function (options) {
            if (options && options.heatmapCell) {
                if (options.heatmapCell.showContent != undefined)
                    this.model.heatMapCell.showContent = options.heatmapCell.showContent;
                if (options.heatmapCell.showColor != undefined)
                    this.model.heatMapCell.showColor = options.heatmapCell.showColor;
            }
        };
        Heatmap.prototype._updateDataSource = function () {
        };
        Heatmap.prototype._bindTableMapValues = function () {
            var dataTableMapping = [];
            var columns = [];
            if (this.model.itemsSource && this.model.itemsSource.length > 0) {
                var itemsSource = this.model.itemsSource;
                for (var i = 0; i < itemsSource.length; i++) {
                    dataTableMapping.push(itemsSource[i]);
                }
            }
            var headerMapping = this.model.itemsMapping.headerMapping;
            var columnStyle = headerMapping.columnStyle;
            columnStyle = this._mergeDefaultSettings(columnStyle, true);
            var freeze = true;
            freeze = this.model.enableVirtualization ? false : freeze;
            if (headerMapping) {
                columns.push({
                    field: headerMapping.propertyName,
                    headerText: headerMapping.displayName,
                    isFrozen: freeze,
                    width: columnStyle && columnStyle.width ? columnStyle.width : null,
                    textAlign: columnStyle && columnStyle.textAlign ? columnStyle.textAlign : "center",
                    headerTemplateID: columnStyle && columnStyle.headerTemplateID ? columnStyle.headerTemplateID : "",
                    templateID: columnStyle && columnStyle.templateID ? columnStyle.templateID : ""
                });
            }
            var columnMapping = this.model.itemsMapping.columnMapping;
            for (var i = 0; columnMapping && i < columnMapping.length; i++) {
                columnStyle = columnMapping[i].columnStyle;
                columnStyle = this._mergeDefaultSettings(columnStyle, false);
                columns.push({
                    field: columnMapping[i].propertyName,
                    headerText: columnMapping[i].displayName,
                    width: columnStyle && columnStyle.width ? columnStyle.width : null,
                    textAlign: columnStyle && columnStyle.textAlign ? columnStyle.textAlign : "center",
                    headerTemplateID: columnStyle && columnStyle.headerTemplateID ? columnStyle.headerTemplateID : "",
                    templateID: columnStyle && columnStyle.templateID ? columnStyle.templateID : "",
                });
            }
            return { dataTableMapping: dataTableMapping, columns: columns };
        };
        Heatmap.prototype._renderMapGrid = function () {
            var data = null;
            if (this.model.itemsMapping && this.model.itemsMapping.column && this.model.itemsMapping.column.propertyName != "" && this.model.itemsMapping.row && this.model.itemsMapping.row.propertyName != "")
                data = this._bindCellMapValues();
            else
                data = this._bindTableMapValues();
            var dd = null;
            if (this.model.height === null) {
                delete this.model.height;
            }
            if (this.model.width === null) {
                delete this.model.width;
            }
            if (data && $("#" + this.element[0].id)[0]) {
                var hGrid = ej.HeatMapGrid({}, this);
                var scrollSettings = {
                    height: (this.model.height !== undefined) ? (this.model.height - 40) : "auto",
                    width: (this.model.width !== undefined) ? Number(this.model.width) : "100%",
                    allowVirtualScrolling: this.model.enableVirtualization ? true : false,
                    virtualScrollMode: "normal",
                    enableVirtualization: this.model.enableVirtualization ? true : false,
                };
                if (this.model.width === undefined) {
                    delete scrollSettings["width"];
                }
                var options = {
                    dataSource: data.dataTableMapping ? data.dataTableMapping : [],
                    columns: data.columns ? data.columns : [],
                    enableRowHover: false,
                    allowScrolling: true,
                    selectionSettings: { selectionMode: [ej.HeatMapGrid.SelectionMode.Cell] },
                    queryCellInfo: $.proxy(this._setBinding, this),
                    cellSelected: $.proxy(this._cellSelected, this),
                    isResponsive: this.model.isResponsive ? this.model.isResponsive : false,
                    enableResponsiveRow: false,
                    scrollSettings: scrollSettings,
                    minWidth: 10,
                    enableRTL: this.model.enableRTL ? this.model.enableRTL : false,
                };
                hGrid._init($("#" + this.element[0].id), options, this);
                this._updateResponsiveSize(hGrid);
            }
        };
        Heatmap.prototype._updateResponsiveSize = function (hGrid) {
            if (this.model.isResponsive) {
                var header = $(".e-movableheaderdiv");
                var content = $(".e-movablecontentdiv");
                header.css("width", "100%");
                content.css("width", "100%");
                if (header[0]) {
                    var headerColGroup = header[0].getElementsByTagName('colgroup')[0];
                    if (headerColGroup && headerColGroup.childNodes && headerColGroup.childNodes.length > 0) {
                        for (var i = 0; this.model.itemsMapping.columnMapping && i < this.model.itemsMapping.columnMapping.length; i++) {
                            var column = this.model.itemsMapping.columnMapping[i];
                            if (column && (!column.columnStyle || !column.columnStyle.width)) {
                                var child = $(headerColGroup.childNodes[i]);
                                if (child && child[0])
                                    child[0].style.width = "";
                            }
                        }
                    }
                }
                if (content[0]) {
                    var contentColGroup = content[0].getElementsByTagName('colgroup')[0];
                    if (contentColGroup && contentColGroup.childNodes && contentColGroup.childNodes.length > 0) {
                        for (var i = 0; this.model.itemsMapping.columnMapping && i < this.model.itemsMapping.columnMapping.length; i++) {
                            var column = this.model.itemsMapping.columnMapping[i];
                            if (column && (!column.columnStyle || !column.columnStyle.width)) {
                                var child = $(contentColGroup.childNodes[i]);
                                if (child && child[0])
                                    child[0].style.width = "";
                            }
                        }
                    }
                }
                if (hGrid && hGrid._refreshScroller) {
                    var ele = $(this.element).find('.e-scrollbar')[0];
                    if (ele) {
                        if (!this.model.enableVirtualization)
                            ele.parentNode.removeChild(ele);
                        hGrid._initScrolling();
                    }
                }
            }
        };
        Heatmap.prototype._cellSelected = function (evt) {
            this.model.selectedItem = { cellValue: evt.currentCell[0].ejHeatMapData.cellValue, source: evt.currentCell[0].ejHeatMapData.data, cell: evt.currentCell[0] };
            this._raiseEvent("cellSelected", { cellValue: evt.currentCell[0].ejHeatMapData.cellValue, source: this._getTableData(evt.currentCell[0].ejHeatMapData), cell: evt.currentCell[0] });
        };
        Heatmap.prototype._componentToHex = function (c) {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };
        Heatmap.prototype._rgbToHex = function (r, g, b) {
            if (isNaN(r) && isNaN(g) && isNaN(b))
                return "";
            else
                return "#" + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
        };
        Heatmap.prototype._setBinding = function (args) {
            var $element = $(args.cell);
            var rbg = this._convertToRBG(ej.parseFloat(ej.format(args.text, "c")), this.model.colorMappingCollection);
            var rgb = this._rgbToHex(rbg.R, rbg.G, rbg.B);
            var columnStyle = this.model.itemsMapping.columnStyle && this.model.itemsMapping.columnStyle[args.column.field] ? this.model.itemsMapping.columnStyle[args.column.field] : null;
            if (this._heatmapShowColor() != undefined) {
                if (args.column.field && columnStyle && columnStyle.fillColor) {
                    var fColor = this._getForeGroundColor(columnStyle.fillColor);
                    $element.css("background-color", columnStyle.fillColor).css("color", fColor ? fColor : "black");
                }
                else {
                    if (this._heatmapShowColor() === false)
                        $element.css("background-color", "white");
                    else {
                        var fColor = this._getForeGroundColor(rbg);
                        $element.css("background-color", rgb).css("color", fColor ? fColor : "");
                    }
                    if (this._setClassOnForzen(args.cell) && $element.index() === 0) {
                        $element.css("font-weight", "normal").css("font-size", 12);
                    }
                }
            }
            if (this._canEnableContent(args))
                $element[0].innerHTML = "&nbsp;";
            this._bindHoverOutEvents(args, rgb);
            if (!(this.model.itemsMapping.headerMapping && args.column.field && this.model.itemsMapping.headerMapping.propertyName === args.column.field)) {
                $element.addClass("sf-ht-enabletooltip");
            }
        };
        Heatmap.prototype._canEnableContent = function (args) {
            if (this._heatmapShowContent() === ej.datavisualization.HeatMap.CellVisibility.Hidden) {
                if (this.model.itemsMapping.headerMapping && args.column && this.model.itemsMapping.headerMapping.propertyName === args.column.field)
                    return false;
                return true;
            }
        };
        Heatmap.prototype._setClassOnForzen = function (cell) {
            do {
                if (cell) {
                    cell = cell.parentNode;
                    if (cell) {
                        if (cell.className === "e-movablecontent") {
                            return true;
                        }
                    }
                    else
                        break;
                }
            } while (cell && cell.className !== "e-gridcontent");
            return false;
        };
        Heatmap.prototype._getForeGroundColor = function (rgb) {
            if (rgb.R !== undefined && rgb.G !== undefined && rgb.B !== undefined) {
                var average = (rgb.R + rgb.G + rgb.B) / 3;
                if (average < 255 * .5) {
                    return "white";
                }
                else if (isNaN(rgb.R) && isNaN(rgb.G) && isNaN(rgb.B))
                    return "";
                else
                    return "black";
            }
            else
                return null;
        };
        Heatmap.prototype._getTableData = function (ejData) {
            var heatmapData = ejData.data;
            if (this.model.itemsMapping && this.model.itemsMapping.column && this.model.itemsMapping.row) {
                var row = this.model.itemsMapping.row;
                var column = this.model.itemsMapping.column;
                if (ejData.column.field) {
                    var field = ejData.column.field;
                    var obj = {};
                    obj[row.propertyName] = heatmapData[row.propertyName];
                    obj["value"] = ejData.cellValue;
                    obj[column.propertyName] = field;
                    return obj;
                }
            }
            else
                return ejData.data;
        };
        Heatmap.prototype._bindHoverOutEvents = function (args, rgb) {
            $(args.cell)
                .mouseenter($.proxy(this._cellMouseEnter, this))
                .mousemove($.proxy(this._cellMouseHover, this))
                .mouseleave($.proxy(this._cellMouseOut, this));
            args.cell.ejHeatMapData = { column: args.column, cellValue: args.text, data: args.data, rgb: rgb };
        };
        Heatmap.prototype._cellMouseOut = function (evt) {
            this._raiseEvent("cellMouseLeave", { cellValue: evt.currentTarget.ejHeatMapData.cellValue, source: this._getTableData(evt.currentTarget.ejHeatMapData), cell: evt.currentTarget });
            var triangles = $(".gradient_scale_marker");
            for (var i = 0; triangles.length > 0 && i < triangles.length; i++) {
                if (triangles[i]) {
                    var tri = triangles[i];
                    tri.style.visibility = "hidden";
                }
            }
        };
        Heatmap.prototype._cellMouseHover = function (evt) {
            this._raiseEvent("cellMouseOver", { cellValue: evt.currentTarget.ejHeatMapData.cellValue, source: this._getTableData(evt.currentTarget.ejHeatMapData), cell: evt.currentTarget });
        };
        Heatmap.prototype._cellMouseEnter = function (evt) {
            if (this.model.legendCollection.length > 0) {
                var i = 0;
                var value = null;
                for (; i < this.model.legendCollection.length; i++) {
                    var legend = this.model.legendCollection[i];
                    if (legend) {
                        if ($("#" + legend)[0]) {
                            var gridLegend = $("#" + legend).data("ejHeatMapLegend");
                            if (gridLegend) {
                                if (evt.currentTarget.ejHeatMapData)
                                    value = evt.currentTarget.ejHeatMapData.cellValue;
                                if (value && gridLegend.model.legendMode === (ej.datavisualization.HeatMap.LegendMode.Gradient).toString()) {
                                    value = Number(value);
                                    if (this.model.itemsMapping.headerMapping && evt.currentTarget.ejHeatMapData && evt.currentTarget.ejHeatMapData.column.field && this.model.itemsMapping.headerMapping.propertyName === evt.currentTarget.ejHeatMapData.column.field)
                                        this._hideLegendMarker();
                                    else
                                        this._drawLegendMarker(gridLegend, value);
                                }
                            }
                        }
                    }
                }
            }
            this._raiseEvent("cellMouseEnter", { cellValue: evt.currentTarget.ejHeatMapData.cellValue, source: this._getTableData(evt.currentTarget.ejHeatMapData), cell: evt.currentTarget });
        };
        Heatmap.prototype._raiseEvent = function (type, args) {
            if (this.model[type]) {
                return this._trigger(type, args);
            }
        };
        Heatmap.prototype._drawDefaultTooltip = function (args) {
            var tooltipDiv = document.getElementById(this.element[0].id + "_DefaultTooltipDiv");
            if (!tooltipDiv) {
                tooltipDiv = this._createDefaultTooltip(args);
            }
            return tooltipDiv;
        };
        Heatmap.prototype._createDefaultTooltip = function (args) {
            var div = document.createElement("div"), attr, disText, data, disVal;
            attr = {
                "id": this.element[0].id + "_DefaultTooltipDiv",
                "class": "e-heatmap-tooltip-default",
                "style": "padding-top:3px; height: 24px;pointer-events:none;position: absolute",
            };
            disText = this.model.itemsMapping.headerMapping && this.model.itemsMapping.headerMapping.displayName ? this.model.itemsMapping.headerMapping.displayName : "";
            if (disText == "")
                disText = this.model.itemsMapping.row && this.model.itemsMapping.row.displayName ? this.model.itemsMapping.headerMapping.displayName : "";
            if (args.event.currentTarget && args.event.currentTarget.ejHeatMapData) {
                if (this.model.itemsMapping.headerMapping && this.model.itemsMapping.headerMapping.propertyName) {
                    data = args.event.currentTarget && args.event.currentTarget.ejHeatMapData;
                    disVal = data.data[this.model.itemsMapping.headerMapping.propertyName];
                }
            }
            div.innerHTML = "<table><tr><td style='min-width:50px;padding-right: 10px;'>" + disText + "</td><td>" + disVal + "</td></tr><tr><td>Value</td><td>" + data.cellValue + "</td></tr></table>";
            return div;
        };
        Heatmap.prototype._renderTooltip = function () {
            var context = this;
            if (context.model.enableTooltip) {
                $("#" + this.element[0].id).ejTooltip({
                    target: ".sf-ht-enabletooltip",
                    position: this.model.tooltipSettings.position,
                    isBalloon: this.model.tooltipSettings.isBalloon,
                    animation: this.model.tooltipSettings.animation,
                    associate: this.model.tooltipSettings.associate,
                    trigger: this.model.tooltipSettings.trigger,
                    beforeOpen: function (args) {
                        if (context.model.enableTooltip) {
                            $("#" + context.element[0].id).ejTooltip("instance").hide();
                            if (args.event.currentTarget && args.event.currentTarget.ejHeatMapData && context.model.tooltipSettings.templateId != this.element[0].id + "_DefaultTooltipDiv") {
                                $("#" + context.element[0].id).ejTooltip({
                                    content: $.templates("#" + context.model.tooltipSettings.templateId).render(args.event.currentTarget.ejHeatMapData)
                                });
                            }
                            else {
                                var defDiv = context._drawDefaultTooltip(args);
                                $("#" + context.element[0].id).ejTooltip({
                                    content: $.templates(defDiv).render(args.event.currentTarget.ejHeatMapData)
                                });
                            }
                        }
                    }
                });
            }
        };
        Heatmap.prototype._drawLegendMarker = function (legend, value) {
            if (legend && value !== undefined && !isNaN(value)) {
                var scaleDiv = $("#" + legend._id + "_gradient_scale")[0];
                if (scaleDiv) {
                    var style = "position:absolute;visibility:visible;box-sizing:border-box;";
                    var triangle = $("#" + legend._id + "_gradient_scale_marker")[0];
                    if (!triangle) {
                        triangle = document.createElement("div");
                        triangle.setAttribute("id", legend._id + "_gradient_scale_marker");
                        triangle.setAttribute("class", "gradient_scale_marker");
                        scaleDiv.appendChild(triangle);
                    }
                    var bbox = this._getBoundingClientRect(scaleDiv);
                    var tbox = this._getBoundingClientRect(triangle);
                    var scrollValue = this._getScroll();
                    var colorMapping = this.model.colorMappingCollection;
                    var lastValue = colorMapping[colorMapping.length - 1].value;
                    if (legend.model.orientation === "horizontal")
                        style += "width: 0;height: 0;border-left:" + bbox.height / 2 + "px solid transparent;border-right: " + bbox.height / 2 + "px solid transparent;border-bottom: " + bbox.height + "px solid green;";
                    else
                        style += "border-left: none;border-right: " + bbox.width + "px solid green;border-bottom: " + bbox.width / 2 + "px solid transparent;border-top: " + bbox.width / 2 + "px solid transparent;";
                    var fValue = colorMapping[0].value;
                    var lValue = colorMapping[colorMapping.length - 1].value;
                    var diff = lValue - fValue;
                    if (legend.model.orientation === "horizontal") {
                        if (this.model.enableRTL)
                            style += "left:" + (Math.round((bbox.left + scrollValue.x - (tbox.width / 2)) + 1) + (((Number(((lValue - value) * 100) / lastValue) / 100) * bbox.width) - 3)) + "px;";
                        else
                            style += "left:" + (Math.round((bbox.left + scrollValue.x - (tbox.width / 2)) + 1) + (((Number(((value) * 100) / lastValue) / 100) * bbox.width) - 3)) + "px;";
                        style += "top:" + ((bbox.top + scrollValue.y) + 2) + "px;";
                    }
                    else {
                        style += "left:calc(" + ((bbox.left + scrollValue.x)) + "px + " + (0) + "px);";
                        if (this.model.enableRTL)
                            style += "top: calc( " + Math.round((bbox.top + scrollValue.y - (tbox.height / 2)) + 1) + "px + " + (((Number(((lValue - value) * 100) / lastValue) / 100) * bbox.height) - 3) + "px);";
                        else
                            style += "top: calc( " + Math.round((bbox.top + scrollValue.y - (tbox.height / 2)) + 1) + "px + " + (((Number((value * 100) / lastValue) / 100) * bbox.height) - 3) + "px);";
                    }
                    triangle.setAttribute("style", style);
                }
            }
            else {
                this._hideLegendMarker();
            }
        };
        Heatmap.prototype._getScroll = function () {
            if (window.pageYOffset !== undefined) {
                return { x: pageXOffset ? pageXOffset : 0, y: pageYOffset ? pageYOffset : 0 };
            }
            else {
                var sx = void 0, sy = void 0, d = document, r = d.documentElement, b = d.body;
                sx = r.scrollLeft || b.scrollLeft || 0;
                sy = r.scrollTop || b.scrollTop || 0;
                return { x: sx ? sx : 0, y: sy ? sy : 0 };
            }
        };
        Heatmap.prototype._convertToRBG = function (value, ColorMapping) {
            var num = 0;
            if (typeof (value) === "number") {
                num = Number(value);
            }
            else if (typeof (value) === "string") { }
            else if (value == null) { }
            else { }
            var offsets = [];
            var previousOffset = 0;
            var nextOffset = 0;
            ColorMapping = this._orderbyOffset(ColorMapping);
            for (var i = 0; i < ColorMapping.length; i++) {
                var offset = Number(ColorMapping[i].value);
                if (offset !== undefined) {
                    if (num <= offset) {
                        nextOffset = offset;
                        break;
                    }
                    else {
                        nextOffset = offset;
                        previousOffset = offset;
                    }
                }
            }
            if (num < previousOffset) { }
            else if (num > nextOffset) { }
            else { }
            var percent = 0;
            if (previousOffset !== undefined) {
                var full = nextOffset - previousOffset;
                percent = (num - previousOffset) / full;
                (isNaN(percent) && num === 0) ? percent = 0 : percent = percent;
            }
            else {
                previousOffset = nextOffset;
            }
            if (percent < 0 || percent > 1) { }
            var previousColor = this._getEqualColor(ColorMapping, previousOffset);
            var nextColor = this._getEqualColor(ColorMapping, nextOffset);
            return this._getPercentageColor(percent, previousColor, nextColor);
        };
        Heatmap.prototype._hashCode = function (str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        };
        Heatmap.prototype._intToRGB = function (i) {
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();
            return "00000".substring(0, 6 - c.length) + c;
        };
        Heatmap.prototype._getPercentageColor = function (percent, previousValue, nextValue) {
            var next = nextValue, nextColor;
            var previous = previousValue;
            if (next.split("#").length > 1) {
                nextColor = next.split("#")[1];
            }
            else {
                var color = this._intToRGB(this._hashCode(next));
                nextColor = color;
            }
            var prevColor = null;
            if (previous.split("#").length > 1) {
                prevColor = previous.split("#")[1];
            }
            else {
                var color = this._intToRGB(this._hashCode(previous));
                prevColor = color;
            }
            var r = this._getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
            var g = this._getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
            var b = this._getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
            return { R: r, G: g, B: b };
        };
        Heatmap.prototype._getPercentage = function (percent, previous, next) {
            var full = next - previous;
            return Math.round((previous + (full * percent)));
        };
        Heatmap.prototype._getEqualColor = function (list, offset) {
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (item) {
                    if (Number(item.value) === offset)
                        return item.color;
                }
            }
            return "#00000";
        };
        Heatmap.prototype._orderbyOffset = function (offsets) {
            var offset1, offset2;
            for (var i = 0; i < offsets.length - 1; i++) {
                offset1 = offsets[i];
                offset2 = offsets[i + 1];
                if (offset1 && offset2 && offset1.value && offset2.value) {
                    if (offset1.value > offset2.value) {
                        var temp = offset1;
                        offset1 = offset2;
                        offset2 = temp;
                    }
                }
            }
            return offsets;
        };
        Heatmap.prototype._mergeDefaultSettings = function (args, header) {
            var wState;
            if (args) {
                wState = args.width === undefined ? true : false;
            }
            var columnStyle = $.extend(true, {}, this.model.defaultColumnStyle, args);
            if (header && this.model.enableRTL)
                columnStyle.textAlign = (!args || (args && !args.textAlign)) ? "right" : args.textAlign;
            if (wState)
                delete columnStyle["width"];
            return columnStyle;
        };
        Heatmap.prototype._bindCellMapValues = function () {
            var dataTableMapping = [];
            var columns = [];
            var columnBind = {
                prLeft: this.model.itemsMapping.row.propertyName,
                prTop: this.model.itemsMapping.column.propertyName,
                prValue: this.model.itemsMapping.value.propertyName
            };
            var dataValues = this._convertToCellBindingData(this.model.itemsSource, columnBind);
            var row = this.model.itemsMapping.row;
            var column = this.model.itemsMapping.column;
            var columnStyle = this._getCellBingingColumnData(row.propertyName, true);
            columnStyle = this._mergeDefaultSettings(columnStyle, false);
            if (row) {
                var freeze = true;
                freeze = this.model.enableVirtualization ? false : freeze,
                    columns.push({
                        field: row.propertyName,
                        headerText: row.displayName,
                        isFrozen: freeze,
                        width: columnStyle && columnStyle.width ? columnStyle.width : null,
                        textAlign: columnStyle && columnStyle.textAlign ? columnStyle.textAlign : "center",
                        headerTemplateID: columnStyle && columnStyle.headerTemplateID ? columnStyle.headerTemplateID : "",
                        templateID: columnStyle && columnStyle.templateID ? columnStyle.templateID : ""
                    });
            }
            for (var i = 0; i < dataValues.items.length; i++) {
                columnStyle = this._getCellBingingColumnData(dataValues.items[i], false);
                columnStyle = this._mergeDefaultSettings(columnStyle, false);
                columns.push({
                    field: dataValues.items[i],
                    headerText: dataValues.items[i],
                    width: columnStyle && columnStyle.width ? columnStyle.width : null,
                    textAlign: columnStyle && columnStyle.textAlign ? columnStyle.textAlign : "center",
                    headerTemplateID: columnStyle && columnStyle.headerTemplateID ? columnStyle.headerTemplateID : "",
                    templateID: columnStyle && columnStyle.templateID ? columnStyle.templateID : ""
                });
            }
            return { dataTableMapping: dataValues.dataTableMapping, columns: columns };
        };
        Heatmap.prototype._getCellBingingColumnData = function (field, isRow) {
            if (isRow) {
                var headerMapping = this.model.itemsMapping && this.model.itemsMapping.headerMapping;
                if (headerMapping.propertyName === field) {
                    return this._mergeColumnStyle(headerMapping.columnStyle, true);
                }
            }
            else {
                var columnMapping = this.model.itemsMapping && this.model.itemsMapping.columnMapping;
                if (columnMapping && columnMapping.length > 0) {
                    for (var i = 0; i < columnMapping.length; i++) {
                        var column = this._mergeDefaultSettings(columnMapping[i], false);
                        if (column.propertyName === field) {
                            return this._mergeColumnStyle(column.columnStyle, false);
                        }
                    }
                }
            }
            return null;
        };
        Heatmap.prototype._mergeColumnStyle = function (style, header) {
            style = this._mergeDefaultSettings(style, header);
            style = $.extend(true, {}, {
                textAlign: style && style.textAlign ? style.textAlign : "center"
            }, style);
            return style;
        };
        Heatmap.prototype._convertToCellBindingData = function (data, columnBind) {
            var list = [];
            var itemsList = [];
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                if (item) {
                    var newData = {};
                    if (item[columnBind.prLeft]) {
                        if (list.length === 0) {
                            var state = false;
                            if (!newData.hasOwnProperty(item[columnBind.prLeft])) {
                                newData[columnBind.prLeft] = item[columnBind.prLeft];
                                list.push(newData);
                                state = true;
                            }
                            if (state) {
                                newData[item[columnBind.prTop].toString()] = item[columnBind.prValue];
                            }
                        }
                        else {
                            var state = false;
                            for (var j = 0; j < list.length; j++) {
                                var lchild = list[j];
                                if (lchild && lchild[columnBind.prLeft] === item[columnBind.prLeft]) {
                                    lchild[item[columnBind.prTop]] = item[columnBind.prValue];
                                    if (itemsList.indexOf(item[columnBind.prTop]) === -1)
                                        itemsList.push(item[columnBind.prTop].toString());
                                    state = true;
                                }
                            }
                            if (!state) {
                                var colState = false;
                                if (!newData.hasOwnProperty(item[columnBind.prLeft])) {
                                    newData[columnBind.prLeft] = item[columnBind.prLeft];
                                    list.push(newData);
                                    colState = true;
                                }
                                if (colState) {
                                    newData[item[columnBind.prTop].toString()] = item[columnBind.prValue];
                                    if (itemsList.indexOf(item[columnBind.prTop]) === -1)
                                        itemsList.push(item[columnBind.prTop].toString());
                                }
                            }
                        }
                    }
                }
            }
            return { dataTableMapping: list, items: itemsList };
        };
        return Heatmap;
    }(ej.WidgetBase));
    window.ej.widget("ejHeatMap", "ej.datavisualization.HeatMap", new Heatmap());
    ej.datavisualization.HeatMap.CellVisibility = {
        Visible: "visible",
        Hidden: "hidden",
    };
    ej.datavisualization.HeatMap.Effect = {
        Slide: "slide",
        Fade: "fade",
        None: "none"
    };
    ej.datavisualization.HeatMap.Trigger = {
        Hover: "hover",
        Click: "click"
    };
    ej.datavisualization.HeatMap.Associate = {
        MouseFollow: "mouseFollow",
        MouseEnter: "mouseEnter",
        Target: "target"
    };
    ej.datavisualization.HeatMap.Horizontal = {
        Left: "left",
        Center: "center",
        Right: "right"
    };
    ej.datavisualization.HeatMap.Vertical = {
        Top: "top",
        Center: "center",
        Bottom: "bottom"
    };
    ej.datavisualization.HeatMap.TextAlign = {
        Right: "right",
        Left: "left",
        Center: "center",
    };
    ej.datavisualization.HeatMap.LegendMode = {
        Gradient: "gradient",
        List: "list",
    };
    ej.datavisualization.HeatMap.LegendOrientation = {
        Horizontal: "horizontal",
        Vertical: "vertical",
    };
    ej.datavisualization.HeatMap.TextDecorations = {
        Underline: "underline",
        Overline: "overline",
        LineThrough: "line-through",
        None: "none"
    };
    "use strict";
    var HeatmapLegend = (function (_super) {
        __extends(HeatmapLegend, _super);
        function HeatmapLegend(element, options) {
            _super.call(this);
            this.defaults = {
                colorMappingCollection: null,
                orientation: ej.datavisualization.HeatMap.LegendOrientation.Horizontal,
                showLabel: true,
                legendMode: "gradient",
                height: null,
                width: null,
                isResponsive: false,
                enableRTL: false,
                create: null,
                destroy: null
            };
            this.validTags = ['div'];
            this._rootCSS = "e-heatmaplegend";
            this._id = "";
            this.setFirst = false;
            this.PluginName = "ejHeatMapLegend";
            this.id = "null";
            this.model = null;
            this.dataTypes = {
                colorMappingCollection: "data"
            };
            this._tags = [
                {
                    tag: "colorMappingCollection",
                    attr: [
                        "value",
                        "color",
                        "label.bold",
                        "label.italic",
                        "label.text",
                        "label.textDecoration",
                        "label.fontSize",
                        "label.fontFamily",
                        "label.fontColor",
                    ],
                    singular: "colorMapping"
                }
            ];
            if (element) {
                if (!element["jquery"])
                    element = $("#" + element);
                if (element.length) {
                    return $(element).ejHeatMapLegend(options).data(this.PluginName);
                }
            }
        }
        HeatmapLegend.prototype._init = function () {
            this._initLegendData();
            this._wireEvents();
            this._renderLegend();
        };
        HeatmapLegend.prototype._setLabel = function (options) {
            var label = options ? options : {};
            label.bold = (label && label.bold !== undefined) ? label.bold : false;
            label.italic = (label && label.italic !== undefined) ? label.italic : false;
            label.text = (label && label.text) ? label.text : "";
            label.textDecoration = (label && label.textDecoration) ? label.textDecoration : ej.datavisualization.HeatMap.TextDecorations.None;
            label.fontSize = (label && label.fontSize) ? label.fontSize : 10;
            label.fontFamily = (label && label.fontFamily) ? label.fontFamily : "Arial";
            label.fontColor = (label && label.fontColor) ? label.fontColor : "black";
            return label;
        };
        HeatmapLegend.prototype._initLegendData = function () {
            this.model.colorMappingCollection = this._getSortedMappingList(this.model.colorMappingCollection);
            for (var i = 0; i < this.model.colorMappingCollection.length; i++)
                this.model.colorMappingCollection[i].label = this._setLabel(this.model.colorMappingCollection[i].label);
        };
        HeatmapLegend.prototype._wireEvents = function () {
            this._on($(window), "resize", this._updateLegendSize);
            $(this.element[0].parentNode).scroll($.proxy(this._hideLegendMarker, this));
        };
        HeatmapLegend.prototype._hideLegendMarker = function (args) {
            var triangles = $(".gradient_scale_marker");
            for (var triangle = 0; triangle < triangles.length; triangle++) {
                if (triangles[triangle] && triangles[triangle].parentNode) {
                    triangles[triangle].parentNode.removeChild(triangles[triangle]);
                }
            }
        };
        HeatmapLegend.prototype._scrollElement = function () {
            var triangle = $("#" + this._id + "_gradient_scale_marker")[0];
            if (triangle) {
                triangle.parentNode.removeChild(triangle);
            }
        };
        HeatmapLegend.prototype._getLargerGradientLabel = function () {
            var rect1, bounds = { left: 0, top: 0, width: 0, height: 0 };
            var clrCollection = this.model.colorMappingCollection;
            for (var i = 0; clrCollection && i < clrCollection.length; i++) {
                var child = clrCollection[i];
                var span = document.createElement("span");
                this.element[0].appendChild(span);
                this._mergeLabelProperties(span, child);
                if (child.label) {
                    rect1 = this._getBoundingClientRect(span);
                    bounds = this._union(bounds, rect1);
                }
                span.parentNode.removeChild(span);
            }
            return bounds;
        };
        HeatmapLegend.prototype._getBoundingClientRect = function (element) {
            var rect = element.getBoundingClientRect();
            if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0") {
                rect = { left: rect.left < 0 ? 0 : rect.left, top: rect.top < 0 ? 0 : rect.top, right: rect.right < 0 ? 0 : rect.right, bottom: rect.bottom < 0 ? 0 : rect.bottom, width: $(element).outerWidth(), height: $(element).outerHeight() };
            }
            return { left: rect.left < 0 ? 0 : rect.left, top: rect.top < 0 ? 0 : rect.top, right: rect.right < 0 ? 0 : rect.right, bottom: rect.bottom < 0 ? 0 : rect.bottom, width: rect.width, height: rect.height };
        };
        HeatmapLegend.prototype._getSpace = function (resize) {
            var lBBox = this._getLargerGradientLabel();
            var bbox = this._getBoundingClientRect(this.element[0]);
            bbox = { bottom: bbox.bottom, height: bbox.height - (lBBox.height / 2 + 2), left: bbox.left, right: bbox.right, top: bbox.top, width: this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal ? bbox.width - 10 : bbox.width };
            if (this.model.legendMode === ej.datavisualization.HeatMap.LegendMode.Gradient)
                this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal ? bbox.width = bbox.width - lBBox.width / 2 : bbox.height = bbox.height - lBBox.height / 2;
            return bbox;
        };
        HeatmapLegend.prototype._renderLegend = function () {
            var gridLegend = $("#" + this.element[0].id)[0];
            if (gridLegend) {
                $("div." + this.element[0].id).find("*").removeAttr("style");
                $("#" + this.element[0].id).empty();
            }
            var height = this.model.height ? this.model.height : "100%";
            var width = this.model.width ? this.model.width : "100%";
            $("#" + this.element[0].id).attr("data-role", "heatmap-legend").css("height", height).css("width", width).css("overflow", "hidden");
            var size = this._getSpace(null);
            if (this.model.legendMode === ej.datavisualization.HeatMap.LegendMode.Gradient) {
                this._renderGradient(size, gridLegend, null);
            }
            else
                this._renderList(size, gridLegend, null);
        };
        HeatmapLegend.prototype._mergeLabelProperties = function (element, colorMap) {
            if (element && colorMap && colorMap.label) {
                var label = colorMap.label;
                if (label) {
                    element.innerHTML = (this.model.legendMode !== "gradient" && label.text) ? label.text : colorMap.value;
                    element.style.fontFamily = label.fontFamily;
                    element.style.fontSize = label.fontSize + "px";
                    element.style.fontColor = label.fontColor;
                    element.style.textDecoration = label.textDecoration;
                    if (label.bold)
                        element.style.fontWeight = "bold";
                    else
                        element.style.fontWeight = "";
                    if (label.italic)
                        element.style.fontStyle = "italic";
                    else
                        element.style.fontStyle = "";
                }
            }
        };
        HeatmapLegend.prototype._union = function (rect1, rect2) {
            var left = Math.min(rect1.left, rect2.left);
            var top = Math.min(rect1.top, rect2.top);
            var width = Math.max(rect1.width, rect2.width);
            var height = Math.max(rect1.height, rect2.height);
            return { left: left, top: top, width: width - left, height: height - top };
        };
        HeatmapLegend.prototype._updateLegendSize = function (update) {
            if (this.model.isResponsive) {
                var height = this.model.height ? this.model.height : "100%";
                var width = this.model.width ? this.model.width : "100%";
                var gridLegend = $("#" + this.element[0].id)[0];
                var size = this._getSpace(true);
                if (this.model.legendMode === ej.datavisualization.HeatMap.LegendMode.Gradient) {
                    this._renderGradient(size, gridLegend, update);
                }
                else {
                    this._renderList(size, gridLegend, update);
                }
            }
        };
        HeatmapLegend.prototype._renderListBox = function (legend, id, colorMap, width, height, lastlist) {
            var div = $("#" + id)[0];
            if (!div) {
                div = document.createElement("div");
                div.setAttribute("id", id);
                this.model.enableRTL ? $(legend).prepend(div) : legend.appendChild(div);
                div.setAttribute("style", "height:auto;height:auto;float:left;vertical-align: middle;");
            }
            div.setAttribute("data-role", "list");
            var style = "";
            var listdiv = $("#" + div.id + "_colordiv_")[0];
            if (!listdiv) {
                listdiv = document.createElement("div");
                listdiv.setAttribute("id", div.id + "_colordiv_");
                div.appendChild(listdiv);
            }
            style = "background-color:" + colorMap.color + ";";
            listdiv.setAttribute("style", style + "height:" + height + "px;width:" + width + "px;float:left");
            if (this.model.showLabel) {
                var lBBox = this._getBoundingClientRect(div);
                var spanDiv = $("#" + div.id + "_labelSpan_")[0];
                if (!spanDiv) {
                    spanDiv = document.createElement("span");
                    spanDiv.setAttribute("id", div.id + "_labelSpan_");
                    spanDiv.setAttribute("aria-label", "label");
                    spanDiv.setAttribute("class", "sf-ht-label");
                    spanDiv.innerHTML = colorMap.label && colorMap.label.text ? colorMap.label.text : colorMap.value;
                    div.appendChild(spanDiv);
                }
                spanDiv.setAttribute("style", "float:left;margin-left:3px;margin-right:3px;margin-right:3px;margin-bottom:3px;");
                this._mergeLabelProperties(spanDiv, colorMap);
                var sBBBox = this._getBoundingClientRect(spanDiv);
                spanDiv.style.marginTop = ((lBBox.height / 2) - (sBBBox.height / 2)) + "px";
            }
            if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                div.style.margin = "10px";
            }
            else {
                if (!lastlist || this.model.enableRTL) {
                    if (!$("#" + div.id + "_colordiv_br")[0])
                        $(div).after("<div id=" + div.id + "_colordiv_br" + "> </br></br></div> ");
                }
            }
        };
        HeatmapLegend.prototype._renderList = function (size, legend, update) {
            var div = $("#" + legend.id + "_list")[0];
            if (!div) {
                div = document.createElement("div");
                div.setAttribute("id", legend.id + "_list");
                legend.appendChild(div);
                div.setAttribute("style", "height:auto;height:auto;float:left;");
            }
            else if (update) {
                div.innerHTML = "";
            }
            var colorMapping = this.model.colorMappingCollection;
            for (var i = 0; i < colorMapping.length; i++) {
                this._renderListBox(div, legend.id + "_listBox_" + i, colorMapping[i], 15, 15, i === colorMapping.length - 1 ? true : false);
            }
            var legBBox = this._getBoundingClientRect(legend);
            var bbox = this._getBoundingClientRect(div);
            var left = legBBox.width / 2 - bbox.width / 2;
            div.style.marginLeft = left <= 0 ? "0px" : left + "px";
            var top = legBBox.height / 2 - bbox.height / 2;
            div.style.marginTop = top <= 0 ? "0px" : top + "px";
        };
        HeatmapLegend.prototype._setAttribute = function (element, attrs) {
            if (element) {
                for (var att in attrs) {
                    element.setAttribute(att, attrs[att]);
                }
            }
        };
        HeatmapLegend.prototype._renderGradient = function (size, legend, update) {
            var grValdiv = $("#" + this.element[0].id + "_gradient_scale_line")[0];
            if (!grValdiv) {
                grValdiv = document.createElement("div");
                legend.appendChild(grValdiv);
            }
            var style1 = this.model.orientation === "horizontal" ? "" : "float:left;";
            if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                style1 += "height:" + (((40 / 100) * size.height) + ((20 / 100) * size.height)) + "px;width:" + (size.width) + "px; ";
            }
            else {
                style1 += "height:" + (size.height) + "px;width:" + (((40 / 100) * size.width) + ((20 / 100) * size.width)) + "px;";
            }
            var stlblBounds = this._getStartlabelOffset();
            if (this.model.orientation === "horizontal")
                style1 += "padding-left:" + stlblBounds.width + "px;";
            else
                style1 += "padding-top:" + (stlblBounds.height / 2 - 1) + "px;";
            grValdiv.setAttribute("style", style1);
            this._setAttribute(grValdiv, {
                "id": "#" + this.element[0].id + "_gradient_scale_line",
            });
            grValdiv.setAttribute("style", style1);
            var div = $("#" + this.element[0].id + "_gradient")[0];
            if (!div) {
                div = document.createElement("div");
                grValdiv.appendChild(div);
            }
            else if (update) {
                div.innerHTML = "";
            }
            this._setAttribute(div, {
                "id": this.element[0].id + "_gradient",
                "data-role": "gradient"
            });
            var background = "to right , ";
            var style = "float:left; ";
            if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                style += "height:" + ((40 / 100) * size.height - 2) + "px; width:" + (size.width) + "px; ";
            }
            else {
                background = "to bottom , ";
                style += "height:" + (size.height) + "px;width:" + ((40 / 100) * size.width - 2) + "px;";
            }
            div.setAttribute("style", style);
            this._renderGradientElements(div);
            this._renderGradientScale(size, grValdiv, update);
            this._renderGradientScaleValue(size, legend, update);
        };
        HeatmapLegend.prototype._renderGradientElements = function (div) {
            var ColorMapping = this.model.colorMappingCollection;
            var firstValue = Number(ColorMapping[0].value);
            var length = ColorMapping.length;
            var lastValue = Number(ColorMapping[ColorMapping.length - 1].value);
            if (length > 0) {
                var prevWidth = 0;
                var prevHeight = 0;
                var bbox = this._getBoundingClientRect(div);
                for (var i = 1; ColorMapping && i < length; i++) {
                    {
                        var style = "float:left;border:none;";
                        var inGrad = $("#" + this.element[0].id + "_inner_gradient" + i)[0];
                        var tWidth = this._childElementsBounds(div).width ? this._childElementsBounds(div).width : 0;
                        if (!inGrad) {
                            inGrad = document.createElement("div");
                            this.model.enableRTL ? $(div).prepend(inGrad) : div.appendChild(inGrad);
                        }
                        if (this.model.orientation === "horizontal") {
                            var w = (((ColorMapping[i].value * 100) / lastValue));
                            var w1 = (bbox.width * (w / 100)) - prevWidth;
                            if (i === length - 1)
                                w1 = bbox.width - tWidth - 1;
                            style += "height:100%;width:" + w1 + "px;";
                            if (this.model.enableRTL) {
                                if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0" || ej.browserInfo().version === "9.0")
                                    style += "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=" + ColorMapping[i].color + ", endColorstr=" + ColorMapping[i - 1].color + ",GradientType=1 );";
                                else
                                    style += "background:linear-gradient(to right ," + ColorMapping[i].color + ", " + ColorMapping[i - 1].color + ");";
                            }
                            else {
                                if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0" || ej.browserInfo().version === "9.0")
                                    style += "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=" + ColorMapping[i - 1].color + ", endColorstr=" + ColorMapping[i].color + ",GradientType=1 );";
                                else
                                    style += "background:linear-gradient(to right ," + ColorMapping[i - 1].color + ", " + ColorMapping[i].color + ");";
                            }
                        }
                        else {
                            var h = (((ColorMapping[i].value * 100) / lastValue));
                            var h1 = (bbox.height * (h / 100)) - prevHeight;
                            style += "width:100%;height:" + h1 + "px;";
                            if (this.model.enableRTL) {
                                if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0" || ej.browserInfo().version === "9.0")
                                    style += "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=" + ColorMapping[i].color + ", endColorstr=" + ColorMapping[i - 1].color + ",GradientType=0 );";
                                else
                                    style += "background:linear-gradient(to bottom ," + ColorMapping[i].color + ", " + ColorMapping[i - 1].color + ");";
                            }
                            else {
                                if (ej.browserInfo().name === "msie" && ej.browserInfo().version === "8.0" || ej.browserInfo().version === "9.0")
                                    style += "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr=" + ColorMapping[i - 1].color + ", endColorstr=" + ColorMapping[i].color + ",GradientType=0 );";
                                else
                                    style += "background:linear-gradient(to bottom ," + ColorMapping[i - 1].color + ", " + ColorMapping[i].color + ");";
                            }
                        }
                        this._setAttribute(inGrad, {
                            "id": this.element[0].id + "_inner_gradient" + i,
                            "style": style
                        });
                        prevWidth = this._childElementsBounds(div).width;
                        prevHeight = this._childElementsBounds(div).height;
                    }
                }
            }
        };
        HeatmapLegend.prototype._getStartlabelOffset = function () {
            var span = document.createElement("span");
            this.element[0].appendChild(span);
            var child = this.model.colorMappingCollection[0];
            this._mergeLabelProperties(span, child);
            var bounds = null;
            if (child.label) {
                bounds = this._getBoundingClientRect(span);
            }
            span.parentNode.removeChild(span);
            return bounds;
        };
        HeatmapLegend.prototype._renderGradientScaleValue = function (size, legend, update) {
            var div = $("#" + this.element[0].id + "_gradient_scale_value")[0];
            if (!div) {
                div = document.createElement("div");
                legend.appendChild(div);
            }
            else if (update) {
                div.innerHTML = "";
            }
            this._setAttribute(div, {
                "id": this.element[0].id + "_gradient_scale_value",
            });
            var style = "float:left;";
            if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                style += "width: 100%;";
            }
            else {
                style += "height:100%;width:" + 12 + "px;margin-left:2px;";
            }
            div.setAttribute("style", style);
            var colorMapping = this.model.colorMappingCollection;
            var bbox = this._getBoundingClientRect(div);
            var prevMargin = null;
            var stlblBounds = this._getStartlabelOffset();
            if (this.model.enableRTL) {
                for (var i = colorMapping.length - 1; i >= 0; i--)
                    prevMargin = this._createGradientLabel(size, colorMapping[i], div, this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal ? true : false, i, prevMargin, i === 0 ? stlblBounds.width / 2 : 0, 0);
            }
            else {
                for (var i = 0; i < colorMapping.length; i++)
                    prevMargin = this._createGradientLabel(size, colorMapping[i], div, this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal ? true : false, i, prevMargin, i === 0 ? stlblBounds.width / 2 : 0, 0);
            }
        };
        HeatmapLegend.prototype._createGradientLabel = function (size, colorMap, div, ishorizontal, i, prevMargin, sx, sy) {
            if (this.model.showLabel) {
                var bbox = this._getBoundingClientRect(div);
                var span = $("#" + this.element[0].id + "_gradient_scale_value" + colorMap.value)[0];
                if (!span) {
                    span = document.createElement("span");
                    div.appendChild(span);
                }
                span.setAttribute("id", this.element[0].id + "_gradient_scale_value" + colorMap.value);
                var style = "float:left;";
                style += "height:auto;";
                style += "width:auto;";
                span.setAttribute("style", style);
                span.innerHTML = colorMap.value;
                this._mergeLabelProperties(span, colorMap);
                var spanBBox = this._getBoundingClientRect(span);
                var colorMapping = this.model.colorMappingCollection;
                var lastValue = colorMapping[colorMapping.length - 1].value;
                var scrollValue = this._getScroll();
                var gdiv = $("#" + this.element[0].id + "_gradient")[0];
                var fValue = 0;
                var lValue = colorMapping[colorMapping.length - 1].value - colorMapping[0].value;
                var diff = lValue - fValue;
                var sValue = colorMapping[0].value;
                var x = 0, y = 0;
                if (gdiv)
                    bbox = this._getBoundingClientRect(gdiv);
                if (ishorizontal) {
                    if (this.model.enableRTL)
                        x = Math.round(ishorizontal ? (((lValue - (colorMap.value - sValue)) / diff) * bbox.width) : 0);
                    else
                        x = Math.round(ishorizontal ? ((((colorMap.value - sValue) / diff) * bbox.width)) : 0);
                    style += "position:absolute;left:" + x + "px;margin-left:" + (bbox.left - spanBBox.width / 2) + "px;";
                }
                else {
                    if (this.model.enableRTL)
                        y = Math.round(((lValue - (colorMap.value - sValue)) / diff) * bbox.height);
                    else
                        y = Math.round(((((colorMap.value - sValue) / diff)) * bbox.height));
                    style += "position:absolute;top:" + y + "px;margin-top:" + (bbox.top - spanBBox.height / 2) + "px;";
                }
                if (!ishorizontal) {
                    x = 0;
                }
                else {
                    y = 0;
                }
                span.setAttribute("style", style);
                span.setAttribute("aria-label", "label");
                span.setAttribute("class", "sf-ht-label");
                this._mergeLabelProperties(span, colorMap);
                var spanBox = this._getBoundingClientRect(span);
                return { x: x + spanBox.width + (sx ? (spanBox.width / 2) : 0), y: y + spanBox.height - (i === 0 ? 0 : 0) + (sy ? (spanBox.height / 2) : 0) };
            }
        };
        HeatmapLegend.prototype._renderGradientScale = function (size, legend, update) {
            var div = $("#" + this.element[0].id + "_gradient_scale")[0];
            if (!div) {
                div = document.createElement("div");
                legend.appendChild(div);
            }
            else if (update) {
                div.innerHTML = "";
            }
            this._setAttribute(div, {
                "id": this.element[0].id + "_gradient_scale",
            });
            var style = "float:left;";
            if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                style += "height:" + ((20 / 100) * size.height) + "px; width:" + (size.width) + "px; margin-top:2px;";
            }
            else {
                style += "height:" + (size.height) + "px;width:" + ((20 / 100) * size.width) + "px; margin-left:2px";
            }
            div.setAttribute("style", style);
            if (this.model.legendMode === ej.datavisualization.HeatMap.LegendMode.Gradient) {
                var colorMapping = this.model.colorMappingCollection;
                var bbox = this._getBoundingClientRect(div);
                var lastValue = colorMapping[colorMapping.length - 1].value;
                if (this.model.orientation === ej.datavisualization.HeatMap.LegendOrientation.Horizontal) {
                    var preWidth = this._createValueLine(this.element[0].id + "_gradient_scale_first", true, size, "", div);
                    for (var i = 1; i < colorMapping.length; i++) {
                        preWidth += this._createSpaceLine(this.element[0].id + i + "space", true, size, "", div, preWidth, colorMapping[i], i, colorMapping[i - 1]);
                        preWidth += this._createValueLine(this.element[0].id + i + "value", true, size, "", div);
                    }
                }
                else {
                    var preWidth = this._createValueLine(this.element[0].id + "_gradient_scale_first", false, size, "", div);
                    for (var i = 1; i < colorMapping.length; i++) {
                        preWidth += this._createSpaceLine(this.element[0].id + i + "space", false, size, "", div, preWidth, colorMapping[i], i, colorMapping[i - 1]);
                        preWidth += this._createValueLine(this.element[0].id + i + "value", false, size, "", div);
                    }
                }
            }
        };
        HeatmapLegend.prototype._childElementsBounds = function (element) {
            var childNodes = element.childNodes;
            var rect = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
            var rect1;
            if (childNodes.length > 0) {
                for (var i = 0; i < childNodes.length; i++) {
                    if (childNodes[i]) {
                        rect1 = this._getBoundingClientRect(childNodes[i]);
                        if (rect1) {
                            rect.width += rect1.width;
                            rect.height += rect1.height;
                        }
                    }
                }
            }
            return rect;
        };
        ;
        HeatmapLegend.prototype._createSpaceLine = function (id, isHorizontal, size, cStyle, div, preWidth, colorMap, i, prevColorMap) {
            var bbox = this._getBoundingClientRect(div);
            var childBounds = this._childElementsBounds(div);
            var line = $("#" + id)[0];
            if (!line) {
                line = document.createElement("div");
                line.setAttribute("id", id);
                this.model.enableRTL ? $(div).prepend(line) : div.appendChild(line);
            }
            var style = "float:left;";
            style += "border: 1px solid gray; ";
            var colorMapping = this.model.colorMappingCollection;
            var fValue = 0;
            var lValue = colorMapping[colorMapping.length - 1].value - colorMapping[0].value;
            var diff = lValue - fValue;
            var width = isHorizontal ? (((colorMap.value - prevColorMap.value) / diff) * bbox.width) : 0;
            if (i === 1 || i === colorMapping.length - 1)
                width -= 6;
            else
                width -= 4;
            var height = Math.round(isHorizontal ? 0 : (((colorMap.value - prevColorMap.value) / diff) * bbox.height));
            if (i === 1 || i === colorMapping.length - 1)
                height -= 6;
            else
                height -= 4;
            style += "height:" + Math.floor(height) + "px;";
            style += "width:" + Math.floor(width) + "px;";
            line.setAttribute("style", style);
            var lineBBox = this._getBoundingClientRect(line);
            return isHorizontal ? lineBBox.width : lineBBox.height;
        };
        HeatmapLegend.prototype._createValueLine = function (id, isHorizontal, size, cStyle, div) {
            var bbox = this._getBoundingClientRect(div);
            var line = $("#" + id)[0];
            if (!line) {
                line = document.createElement("div");
                line.setAttribute("id", id);
                this.model.enableRTL ? $(div).prepend(line) : div.appendChild(line);
            }
            var style = "float:left;";
            var width = isHorizontal ? 0 : bbox.width;
            var height = isHorizontal ? bbox.height : 0;
            style += "height:" + height + "px;";
            style += "width:" + width + "px;";
            style += "border: 1px solid gray; ";
            if (cStyle)
                style += cStyle;
            line.setAttribute("style", style);
            var lineBBox = this._getBoundingClientRect(line);
            return isHorizontal ? lineBBox.width : lineBBox.height;
        };
        HeatmapLegend.prototype._getScroll = function () {
            if (window.pageYOffset !== undefined) {
                return { x: pageXOffset ? pageXOffset : 0, y: pageYOffset ? pageYOffset : 0 };
            }
            else {
                var sx = void 0, sy = void 0, d = document, r = d.documentElement, b = d.body;
                sx = r.scrollLeft || b.scrollLeft || 0;
                sy = r.scrollTop || b.scrollTop || 0;
                return { x: sx ? sx : 0, y: sy ? sy : 0 };
            }
        };
        HeatmapLegend.prototype._getSortedMappingList = function (list) {
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    for (var j = i + 1; j < list.length; j++) {
                        if (Number(list[i].value) > Number(list[j].value)) {
                            var temp = list[i];
                            list[i] = list[j];
                            list[j] = temp;
                        }
                    }
                }
                return list;
            }
        };
        HeatmapLegend.prototype._setModel = function (options) {
            for (var item in options) {
                switch (item) {
                    case "colorMappingCollection":
                        this.model.colorMappingCollection = options.colorMappingCollection ? options.colorMappingCollection : this.model.colorMappingCollection;
                        this.model.colorMappingCollection = this._getSortedMappingList(this.model.colorMappingCollection);
                        var i = 0;
                        for (; i < this.model.colorMappingCollection.length; i++)
                            this.model.colorMappingCollection[i].label = this._setLabel(this.model.colorMappingCollection[i].label);
                        this._updateLegendSize(true);
                        break;
                    case "legendMode":
                        this._renderLegend();
                        break;
                }
            }
        };
        HeatmapLegend.prototype._destroy = function () {
            this.element.removeClass("e-heatmaplegend e-js").empty();
        };
        return HeatmapLegend;
    }(ej.WidgetBase));
    window.ej.widget("ejHeatMapLegend", "ej.datavisualization.HeatMapLegend", new HeatmapLegend());
})(jQuery);
