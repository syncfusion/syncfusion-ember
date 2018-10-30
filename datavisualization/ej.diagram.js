/**
* @fileOverview Plugin to style the Html Diagram elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
* Use of this code is subject to the terms of our license.
* A copy of the current license can be obtained at any time by e-mailing
* licensing@syncfusion.com. Any infringement will be prosecuted under
* applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    "use strict";
    //#region ej.Diagram widget
    ej.widget("ejDiagram", "ej.datavisualization.Diagram", {
        element: null,
        model: null,
        _requiresID: true,
        validTags: ["div"],
        //#region defaults
        defaults: {
            width: "",
            height: "",
            nodes: [],
            connectors: [],
            labelRenderingMode: "html",
            defaultSettings: {
                connector: null,
                node: null,
                group: null
            },
            nodeTemplate: null,
            connectorTemplate: null,
            dataSourceSettings: {
                dataSource: null,
                query: null,
                tableName: null,
                id: "",
                parent: "",
                nodes: null,
                connectors: null,
                root: "",
                crudAction: {
                    create: "",
                    update: "",
                    destroy: "",
                    read: ""
                },
                customFields: [],
                connectionDataSource: {
                    dataSource: null,
                    id: "",
                    sourceNode: "",
                    targetNode: "",
                    sourcePointX: "",
                    sourcePointY: "",
                    targetPointX: "",
                    targetPointY: "",
                    crudAction: {
                        create: "",
                        update: "",
                        destroy: "",
                        read: ""
                    },
                    customFields: []
                }
            },
            serializationSettings: {
                preventDefaultValues: false
            },
            rulerSettings: {
                showRulers: false,
                horizontalRuler: {
                    interval: 5,
                    segmentWidth: 100,
                    arrangeTick: null,
                    tickAlignment: "rightorbottom",
                    markerColor: "red",
                    length: null,
                    thickness: 25
                },
                verticalRuler: {
                    interval: 5,
                    segmentWidth: 100,
                    arrangeTick: null,
                    tickAlignment: "rightorbottom",
                    markerColor: "red",
                    length: null,
                    thickness: 25
                }
            },
            snapSettings: {
                horizontalGridLines: {
                    linesInterval: null,
                    snapInterval: [20],
                    lineDashArray: "",
                    lineColor: "lightgray"
                },
                verticalGridLines: {
                    linesInterval: null,
                    snapInterval: [20],
                    lineDashArray: "",
                    lineColor: "lightgray"
                },
                snapConstraints: 1 | 2 | 4 | 8,
                enableSnapToObject: true,
                snapAngle: 5,
                snapObjectDistance: 5
            },
            scrollSettings: {
                horizontalOffset: 0,
                verticalOffset: 0,
                currentZoom: 1,
                viewPortHeight: 0,
                viewPortWidth: 0,
                minZoom: 0.25,
                maxZoom: 30,
                zoomFactor: 0.2,
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            pageSettings: {
                pageWidth: null,
                pageHeight: null,
                multiplePage: false,
                pageBorderWidth: 0,
                pageBackgroundColor: "#ffffff",
                pageBorderColor: "#565656",
                pageMargin: 24,
                showPageBreak: false,
                pageOrientation: "portrait",
                scrollLimit: "diagram",
                scrollableArea: { x: Number.POSITIVE_INFINITY, y: Number.POSITIVE_INFINITY, width: Number.POSITIVE_INFINITY, height: Number.POSITIVE_INFINITY },
                autoScrollBorder: { left: 15, top: 15, right: 15, bottom: 15 },
                boundaryConstraints: "infinity"
            },
            locale: "en-US",
            contextMenu: {
                items: [],
                showCustomMenuItemsOnly: false
            },
            enableContextMenu: true,
            enableAutoScroll: true,
            tooltip: {
                templateId: "",
                relativeMode: "object",
                alignment: {
                    horizontal: "center",
                    vertical: "bottom",
                },
                margin: { left: 5, right: 5, top: 5, bottom: 5 }
            },
            showTooltip: true,
            layout: {
                avoidSegmentOverlapping: false,
                bounds: null,
                type: "none",
                horizontalAlignment: "center",
                verticalAlignment: "top",
                orientation: "toptobottom",
                horizontalSpacing: 30,
                verticalSpacing: 30,
                margin: { left: 0, right: 0, top: 0, bottom: 0 },
                marginX: 0,
                marginY: 0,
                fixedNode: "",
                getLayoutInfo: null,
                getConnectorSegments: null,
                root: "",
                springLength: 100,
                springFactor: 0.442,
                maxIteration: 1000
            },
            drawingTools: {},
            backgroundImage: {
                source: "",
                scale: "meet",
                alignment: "xmidymid"
            },
            backgroundColor: "transparent",
            bridgeDirection: "top",
            version: "13.1",
            constraints: 1 << 1 | 1 << 2 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8,
            tool: null,
            drawType: {},
            selectedItems: {
                offsetX: 0,
                offsetY: 0,
                width: 0,
                height: 0,
                rotateAngle: 0,
                children: [],
                constraints: 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4,
                userHandles: [],
                tooltip: {
                    templateId: "",
                    alignment: { horizontal: "center", vertical: "bottom" },
                    margin: { top: 10 }
                },
                getConstraints: null
            },
            commandManager: {
                commands: {}
            },
            historyManager: {
                push: null,
                pop: null,
                canPop: null,
                canLog: null,
                undo: null,
                redo: null,
                startGroupAction: null,
                closeGroupAction: null,
                stackLimit: null,
                undoStack: [],
                redoStack: []
            },
            layers: [],
            connectorType: "straightLine",
            editorFocusChange: null,
            nodeCollectionChange: null,
            templateNodeRendering: null,
            historyChange: null,
            autoScrollChange: null,
            itemClick: null,
            connectorCollectionChange: null,
            selectionChange: null,
            mouseLeave: null,
            mouseEnter: null,
            mouseOver: null,
            click: null,
            doubleClick: null,
            dragEnter: null,
            dragOver: null,
            dragLeave: null,
            drop: null,
            drag: null,
            textChange: null,
            sizeChange: null,
            connectionChange: null,
            rotationChange: null,
            contextMenuClick: null,
            contextMenuBeforeOpen: null,
            contextMenuClose: null,
            connectorSourceChange: null,
            connectorTargetChange: null,
            scrollChange: null,
            segmentChange: null,
            propertyChange: null,
            groupChange: null,
            create: null,
            destroy: null
        },
        observables: [
            "nodes",
            "connectors",
            "locale",
            "enableContextMenu",
            "backgroundColor",
            "backgroundImage",
            "enableAutoScroll",
            "showTooltip",
            "bridgeDirection",
            "tool",
            "pageSettings.pageHeight",
            "pageSettings.pageWidth",
            "pageSettings.multiplePage",
            "pageSettings.pageBorderWidth",
            "pageSettings.pageBackgroundColor",
            "pageSettings.pageBorderColor",
            "pageSettings.pageMargin",
            "pageSettings.showPageBreak",
            "pageSettings.pageOrientation",
            "pageSettings.scrollLimit",
            "snapSettings.enableSnapToObject",
            "snapSettings.snapAngle",
            "snapSettings.snapObjectDistance",
            "snapSettings.snapConstraints",
            "dataSourceSettings.id",
            "dataSourceSettings.parent",
            "dataSourceSettings.root",
            "dataSourceSettings.dataSource",
            "dataSourceSettings.tableName",
            "dataSourceSettings.query",
            "layout.type",
            "layout.orientation",
            "layout.horizontalSpacing",
            "layout.avoidSegmentOverlapping ",
            "layout.verticalSpacing",
            "layout.marginX",
            "layout.marginY",
            "layout.fixedNode",
            "selectedItems.offsetX",
            "selectedItems.offsetY",
            "selectedItems.width",
            "selectedItems.height",
            "selectedItems.rotateAngle",
            "scrollSettings.horizontalOffset",
            "scrollSettings.verticalOffset",
            "scrollSettings.zoomFactor",
            "tooltip.templateId",
            "tooltip.relativeMode",
            "tooltip.alignment.horizontal",
            "tooltip.alignment.vertical",
            "contextMenu.items",
            "contextMenu.showCustomMenuItemsOnly"
        ],
        nodes: ej.util.valueFunction("nodes"),
        connectors: ej.util.valueFunction("connectors"),
        locale: ej.util.valueFunction("locale"),
        enableContextMenu: ej.util.valueFunction("enableContextMenu"),
        enableAutoScroll: ej.util.valueFunction("enableAutoScroll"),
        showTooltip: ej.util.valueFunction("showTooltip"),
        bridgeDirection: ej.util.valueFunction("bridgeDirection"),
        tool: ej.util.valueFunction("tool"),
        _backgroundColor: ej.util.valueFunction("backgroundColor"),
        _backgroundImage: ej.util.valueFunction("backgroundImage"),
        _pageHeight: ej.util.valueFunction("pageSettings.pageHeight"),
        _pageWidth: ej.util.valueFunction("pageSettings.pageWidth"),
        _multiplePage: ej.util.valueFunction("pageSettings.multiplePage"),
        _pageBorderWidth: ej.util.valueFunction("pageSettings.pageBorderWidth"),
        _pageBackgroundColor: ej.util.valueFunction("pageSettings.pageBackgroundColor"),
        _pageBorderColor: ej.util.valueFunction("pageSettings.pageBorderColor"),
        _pageMargin: ej.util.valueFunction("pageSettings.pageMargin"),
        _showPageBreak: ej.util.valueFunction("pageSettings.showPageBreak"),
        _pageOrientation: ej.util.valueFunction("pageSettings.pageOrientation"),
        _scrollLimit: ej.util.valueFunction("pageSettings.scrollLimit"),
        _enableSnapToObject: ej.util.valueFunction("snapSettings.enableSnapToObject"),
        _snapConstraints: ej.util.valueFunction("snapSettings.snapConstraints"),
        _snapAngle: ej.util.valueFunction("snapSettings.snapAngle"),
        _snapObjectDistance: ej.util.valueFunction("snapSettings.snapObjectDistance"),
        _selectorOffsetX: ej.util.valueFunction("selectedItems.offsetX"),
        _selectorOffsetY: ej.util.valueFunction("selectedItems.offsetY"),
        _selectorWidth: ej.util.valueFunction("selectedItems.width"),
        _selectorHeight: ej.util.valueFunction("selectedItems.height"),
        _selectorRotateAngle: ej.util.valueFunction("selectedItems.rotateAngle"),
        _horizontalOffset: ej.util.valueFunction("scrollSettings.horizontalOffset"),
        _verticalOffset: ej.util.valueFunction("scrollSettings.verticalOffset"),
        zoomFactor: ej.util.valueFunction("scrollSettings.zoomFactor"),
        _layoutType: ej.util.valueFunction("layout.type"),
        _layoutOrientation: ej.util.valueFunction("layout.orientation"),
        _horizontalSpacing: ej.util.valueFunction("layout.horizontalSpacing"),
        _avoidSegmentOverlapping: ej.util.valueFunction("layout.avoidSegmentOverlapping "),
        _verticalSpacing: ej.util.valueFunction("layout.verticalSpacing"),
        _layoutMarginX: ej.util.valueFunction("layout.marginX"),
        _layoutMarginY: ej.util.valueFunction("layout.marginY"),
        _fixedNode: ej.util.valueFunction("layout.fixedNode"),
        _dataSourceUniqueId: ej.util.valueFunction("dataSourceSettings.id"),
        _dataSourceParentId: ej.util.valueFunction("dataSourceSettings.parent"),
        _dataSource: ej.util.valueFunction("dataSourceSettings.dataSource"),
        _dataSourceTableName: ej.util.valueFunction("dataSourceSettings.tableName"),
        _dataSourceQueryString: ej.util.valueFunction("dataSourceSettings.query"),
        _dataSourceRoot: ej.util.valueFunction("dataSourceSettings.root"),
        _tooltipTemplateId: ej.util.valueFunction("tooltip.templateId"),
        _horizontalTooltipAlignment: ej.util.valueFunction("tooltip.alignment.horizontal"),
        _verticalTooltipAlignment: ej.util.valueFunction("tooltip.alignment.vertical"),
        _tooltipMode: ej.util.valueFunction("tooltip.relativeMode"),
        _showCustomContextMenuItems: ej.util.valueFunction("contextMenu.showCustomMenuItemsOnly"),
        _contextMenuItems: ej.util.valueFunction("contextMenu.items"),
        dataTypes: {
            nodes: "data",
            connectors: "data",
            contextMenu: {
                items: "array"
            },
            dataSourceSettings: {
                dataSource: "data"
            },
            defaultSettings: {
                connector: {
                    segments: "data",
                    labels: "data"
                },
                node: {
                    children: "data",
                    gradient: {
                        stops: "data"
                    },
                    labels: "data",
                    lanes: "data",
                    phases: "data",
                    points: "data",
                    ports: "data",
                },
                group: {
                    children: "data",
                    gradient: {
                        stops: "data"
                    },
                    labels: "data",
                    lanes: "data",
                    phases: "data",
                    points: "data",
                    ports: "data",
                }
            },
            snapSettings: {
                horizontalGridLines: {
                    linesInterval: "data",
                    snapInterval: "data",
                },
                verticalGridLines: {
                    linesInterval: "data",
                    snapInterval: "data",
                }
            },
            selectedItems: {
                children: "data",
                userHandles: "data"
            }
        },
        //#endregion
        //#region Local members
        _doubleClickEvent: false,
        _nodes: [],
        _connectors: [],
        _canvas: null,
        _svg: null,
        _toolToActivate: null,
        _inAction: false,
        _isPinching: false,
        _isEditing: false,
        _nodeToHit: null,
        _enableAPIMethods: true,
        _currentCursor: null,
        _pasteIndex: null,
        _page: null,
        _view: null,
        _currentLabel: null,
        _zOrder: 0,
        _clipboardData: null,
        _currZoom: 1,
        _UndoRedo: false,
        _mouseEventTriggered: false,
        _selectedItem: "",
        _historyList: {
            currentEntry: {
                next: null,
                previous: null
            },
            canUndo: false,
            canRedo: false
        },
        _historyCount: 0,
        _lastbefore: null,
        _defaultContextMenuItems: [
            { name: "cut", text: "Cut" },
            { name: "copy", text: "Copy" },
            { name: "paste", text: "Paste" },
            { name: "undo", text: "Undo" },
            { name: "redo", text: "Redo" },
            { name: "selectAll", text: "Select All" },
            {
                name: "grouping",
                text: "Grouping",
                subItems: [
                    { name: "group", text: "Group" },
                    { name: "ungroup", text: "Ungroup" }
                ]
            },
            {
                name: "order",
                text: "Order",
                subItems: [
                    { name: "bringToFront", text: "Bring To Front" },
                    { name: "moveForward", text: "Move Forward" },
                    { name: "sendToBack", text: "Send To Back" },
                    { name: "sendBackward", text: "Send Backward" }
                ]
            }
        ],
        _hScrollOffset: 0,
        _vScrollOffset: 0,
        _hScrollbar: null,
        _vScrollbar: null,
        _scrollPixel: 30,
        _previousSelectedItems: [],
        _eventCause: {},
        _crudDeleteNodes: [],
        _isMobile: false,
        _labelHashTable: {},
        //#endregion
        //#region public members
        activeTool: null,
        selectionList: [],
        tools: null,
        nameTable: {},
        boundaryTable: {},
        //#endregion
        //#region Initialization
        _init: function () {
            this.boundaryTable = {};
            this.nameTable = {};
            this.selectionList = [];
            this._isInit = true;
            this.nameTable = {};
            this.boundaryTable = {};
            var svgSupport = (window.SVGSVGElement) ? true : false;
            if (svgSupport) {
                if (this.model.version === "NewVersion") {
                    this.model.version = ej.version;
                }
                if (!this.model.height)
                    this.model.height = "18px";
                if (ej.widget.unobtrusive !== undefined) {
                    if (this.model.snapSettings.horizontalGridLines && this.model.snapSettings.horizontalGridLines.linesInterval && typeof (this.model.snapSettings.horizontalGridLines.linesInterval) === "string")
                        this.model.snapSettings.horizontalGridLines.linesInterval = JSON.parse(this.model.snapSettings.horizontalGridLines.linesInterval);
                    if (this.model.snapSettings.verticalGridLines && this.model.snapSettings.verticalGridLines.linesInterval && typeof (this.model.snapSettings.verticalGridLines.linesInterval) === "string")
                        this.model.snapSettings.verticalGridLines.linesInterval = JSON.parse(this.model.snapSettings.verticalGridLines.linesInterval);
                    if (this.model.defaultSettings.connector) {
                        var connector = ej.datavisualization.Diagram.Connector({});
                        this.model.defaultSettings.connector = this._equivalentPropMap(connector, this.model.defaultSettings.connector);
                    }
                    if (this.model.defaultSettings.node) {
                        var node = ej.datavisualization.Diagram.Node({});
                        this.model.defaultSettings.node = this._equivalentPropMap(node, this.model.defaultSettings.node);
                    }
                }
                if (this.model.snapSettings.horizontalGridLines && this.model.snapSettings.horizontalGridLines.linesInterval == null)
                    this.model.snapSettings.horizontalGridLines.linesInterval = [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75];
                if (this.model.snapSettings.verticalGridLines && this.model.snapSettings.verticalGridLines.linesInterval == null)
                    this.model.snapSettings.verticalGridLines.linesInterval = [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75];

                var tempObj = this;
                if (tempObj.model.dataSourceSettings.crudAction.read) {
                    var callback = $.ajax({
                        type: 'GET',
                        url: tempObj.model.dataSourceSettings.crudAction.read,
                        async: false,
                        success: function (data, textStatus, xhr) {
                            tempObj.model.dataSourceSettings.dataSource = data;
                        },
                        error: function (xhr, textStatus, errorThrown) {
                        }
                    });
                    this._isWebAPI = true;
                }
                if (tempObj.model.dataSourceSettings.connectionDataSource.crudAction.read) {
                    var callback = $.ajax({
                        type: 'GET',
                        url: tempObj.model.dataSourceSettings.connectionDataSource.crudAction.read,
                        async: false,
                        success: function (data) {
                            tempObj.model.dataSourceSettings.connectionDataSource.dataSource = data;
                        },
                        error: function (errData) {

                        }
                    });
                    this._isWebAPI = true;
                }
                if (this.model.backgroundImage) {
                    var imagePath;
                    if (typeof this.model.backgroundImage === "string")
                        imagePath = this.model.backgroundImage;
                    if (typeof this.model.backgroundImage === "function")
                        imagePath = this.model.backgroundImage();
                    if (imagePath)
                        this.model.backgroundImage = ej.datavisualization.Diagram.BackgroundImage({ source: imagePath });
                }
                if (this._layoutMarginX()) {
                    this.model.layout.margin.left = this.model.layout.margin.right = this._layoutMarginX();
                }
                if (this._layoutMarginY()) {
                    this.model.layout.margin.top = this.model.layout.margin.bottom = this._layoutMarginY();
                }
                this._cloneGlobalVariables();
                this._spatialSearch = ej.datavisualization.Diagram.SpatialSearch(this);
                this._initDefaults();
                this._initViews();
                this._initLineRouting();
                this._initData();
                this._initCanvas();
                this._initDiagramTool();
                this._initVisualGuide();
                this._wireEvents();
                this._initHandles();
                this._initContextMenu();
                this._drawingTool = false;
                this._isDropped = false;
                this._initCommands();
                this._initHistoryManager();
                if (this.model.zoomFactor && this.model.zoomFactor !== .2)
                    this.model.scrollSettings.zoomFactor = this.model.zoomFactor;
                this._updateScrollSettings(this.model.scrollSettings);
                delete this._viewPort;
                this._cloneModel = $.extend(true, {}, this.model);
            }
            delete this._isInit;
        },

        _initLineRouting: function () {
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this)) {
                this.lineRouting = new LineRouting();
                this.lineRouting.firstLoad = true;
                this.lineRouting.Init(this.model);
                this.lineRouting.SetLineRoutingSettings();
            }
        },
        _resetConnectorPoints : function (edge, diagram) {
            if (edge._undoSegments || edge._redoSegments) {
                var segments = edge._undoSegments ? edge._undoSegments : edge._redoSegments;
                this.updateConnector(edge.name, { segments: segments });
            }
            else {
            if (edge._points && edge._points.size() > 0) {
                var connector = diagram.nameTable[edge.name];
                    if (!this._isUndo && (this.activeTool.name == "move" || this.activeTool.name === "resize" || this.activateTool.name === "rotatetool"))
                        this.tools[this.activeTool.name].undoObject.connectors[connector.name] = { name: connector.name, segments: connector.segments };
                connector.segments = [];
                connector.sourcePoint = edge._points.get(0);
                connector.targetPoint = edge._points.get(edge._points.size() - 1);
                connector._sourcePortLocation = $.extend(true, {}, edge._points.get(0));
                connector._targetPortLocation = $.extend(true, {}, edge._points.get(edge._points.size() - 1));
                var points = [];
                var segments = [];
                for (var i = 0; i < edge._points.size() - 1; i++) {                    
                    var point1 = edge._points.get(i);
                    var point2 = edge._points.get(i + 1);
                    if (point1.x == point2.x && point1.y == point2.y) {
                        edge._points.RemoveAt(i + 1);
                        if (i + 1 == edge._points.size())
                            break;
                        point2 = edge._points.get(i + 1);
                    }
                    var length = Point.findLength(point1, point2);
                    var direction = ej.datavisualization.Diagram.Util._getBezierDirection(point1, point2);
                    segments.push({ length: length, direction: direction, type: "orthogonal" });
                }
                this.updateConnector(connector.name, { segments: segments });
                    if (!this._isUndo && (this.activeTool.name == "move" || this.activeTool.name === "resize" || this.activateTool.name === "rotate"))
                        this.tools[this.activeTool.name]._redoConnectors[connector.name] = { name: connector.name, segments: connector.segments };
                delete connector._sourcePortLocation;
                delete connector._targetPortLocation;
            } else {
                var connector = diagram.nameTable[edge.name];
                connector.segments = [];
                var segments = [{ type: "orthogonal" }];
                this.updateConnector(connector.name, { segments: segments });
            }
            }
        },
        _equivalentPropMap: function (obj, sourceObj) {
            var obj1 = {}, field;
            for (var prop in obj) {
                field = prop.toLowerCase();
                if (ej.isPlainObject(sourceObj[field]) || ej.isPlainObject(sourceObj[prop])) {
                    obj1[prop] = this._equivalentPropMap(obj[prop], sourceObj[field] ? sourceObj[field] : sourceObj[prop]);
                }
                else if (sourceObj[field] || sourceObj[prop])
                    obj1[prop] = sourceObj[field] ? sourceObj[field] : sourceObj[prop];
            }
            return obj1;
        },

        getDiagramBounds: function () {

            var bounds = this._getDigramBounds();
            bounds.width = bounds.width > this.model.scrollSettings.viewPortWidth ? bounds.width + (bounds.x > 0 ? bounds.x : 0) : this.model.scrollSettings.viewPortWidth;
            bounds.height = bounds.height > this.model.scrollSettings.viewPortHeight ? bounds.height + (bounds.y > 0 ? bounds.y : 0) : this.model.scrollSettings.viewPortHeight;

            bounds.x = bounds.x > 0 ? 0 : bounds.x;
            bounds.y = bounds.y > 0 ? 0 : bounds.y;

            return bounds;
        },

        getDiagramContent: function (styleSheets) {
            var margin = {};
            margin = {
                top: !isNaN(margin.top) ? margin.top : 0,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
                left: !isNaN(margin.left) ? margin.left : 0,
                right: !isNaN(margin.right) ? margin.right : 0
            };
            var oldZoom = this._currZoom, oldHorizontalOffset = this._hScrollOffset, oldVerticalOffset = this._vScrollOffset,
                hScrollVisibility, vScrollVisibility;
            var minHorOffset = 0, minVerOffset = 0;

            var oldWidth = this.model.width, oldHeight = this.model.height;

            var bounds = this.getDiagramBounds();

            if (this._hScrollbar && this._hScrollbar._scrollData) {
                minHorOffset = this._hScrollbar.model.minimum / oldZoom;
            }

            if (this._vScrollbar && this._vScrollbar._scrollData) {
                minVerOffset = this._vScrollbar.model.minimum / oldZoom;
            }

            this._preventZoomEvent = true;

            if (this._currZoom !== 1) {
                var zoomAction = new ej.datavisualization.Diagram.Zoom();
                zoomAction.zoomFactor = (1 / oldZoom) - 1;
                this.zoomTo(zoomAction);
            }

            var scrollSettings = {};
            if (bounds.x !== this._hScrollOffset / oldZoom) {
                scrollSettings.horizontalOffset = bounds.x;
            }
            if (bounds.y !== this._vScrollOffset / oldZoom) {
                scrollSettings.verticalOffset = bounds.y;
            }

            if (Object.keys(scrollSettings).length > 0)
                this.update({ scrollSettings: scrollSettings });


            $("#" + this.element[0].id).ejDiagram({
                width: bounds.width + "px",
                height: bounds.height + "px"
            });

            hScrollVisibility = this._hScrollbar.element[0].style.visibility;
            this._hScrollbar.element[0].style.visibility = "hidden";

            vScrollVisibility = this._vScrollbar.element[0].style.visibility;
            this._vScrollbar.element[0].style.visibility = "hidden";


            var snapConstraints = this.model.snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.ShowLines;

            if (snapConstraints) {
                $("#" + this.element[0].id).ejDiagram({
                    snapSettings: {
                        snapConstraints: this.model.snapSettings.snapConstraints
                            & ~ej.datavisualization.Diagram.SnapConstraints.ShowLines
                    }
                })
            }

            this._clearSelection(true);
            styleSheets = styleSheets || document.styleSheets;
            var styleSheetRef = "";
            for (var i = 0; i < styleSheets.length; i++) {
                if (styleSheets[i].href || typeof styleSheets[i] === "string")
                    styleSheetRef += "<link href=\"" + (styleSheets[i].href || styleSheets[i]) + "\" rel=\"stylesheet\" />";
            }

            var htmlData = $(this.element).html();
            var marginStyle = "margin-left:" + margin.left + "px;margin-top:" + margin.top + "px;margin-right:" + margin.right + "px;margin-bottom:" + margin.bottom + "px;";
            htmlData = styleSheetRef + "<body style='margin:0px;padding:0px'><div style=\"" + marginStyle + "\">" + htmlData + "</div></body>";

            htmlData = htmlData.replace(/ transform: t/g, " -webkit-transform: t");

            $("#" + this.element[0].id).ejDiagram({
                width: oldWidth,
                height: oldHeight
            });

            if (oldZoom) {
                var zoomAction = new ej.datavisualization.Diagram.Zoom();
                zoomAction.zoomFactor = (oldZoom / this._currZoom) - 1;
                this.zoomTo(zoomAction);
            }


            this.update({ scrollSettings: { horizontalOffset: oldHorizontalOffset, verticalOffset: oldVerticalOffset } });

            delete this._preventZoomEvent;

            if (this._hScrollbar) {
                this._hScrollbar.element[0].style.visibility = hScrollVisibility;
            }

            if (this._vScrollbar) {
                this._vScrollbar.element[0].style.visibility = vScrollVisibility;
            }

            if (snapConstraints) {
                $("#" + this.element[0].id).ejDiagram({
                    snapSettings: {
                        snapConstraints: this.model.snapSettings.snapConstraints
                            | ej.datavisualization.Diagram.SnapConstraints.ShowLines
                    }
                });
            }
            return htmlData;
        },

        refresh: function () {
            this._updateTableNodes();
            this._updateGroupChildren(this.model);
            if (this._isSwimlaneExist) {
                var connectors = this.connectors();
                for (var i = 0; i < connectors.length; i++) {
                    connectors[i].zOrder = -1;
                }
                delete this._isSwimlaneExist;
            }
            this._updateScrollOffset(0, 0);
            this._destroy();
            this.element.addClass("e-datavisualization-diagram");
            this._currZoom = 1;
            this._hScrollbar = null;
            this._vScrollbar = null;
            this._view = null;
            this._svg = null;
            this._page = null;
            this._pageBackgroundLayer = null;
            this._diagramLayer = null;
            this._htmlLayer = null;
            this.clearHistory();
            this._spatialSearch = ej.datavisualization.Diagram.SpatialSearch(this);
            if ((this.model.dataSourceSettings && this.model.dataSourceSettings.dataSource)) {
                this.nodes([]);
                this.connectors([]);
                this._nodes = [];
                this._connectors = [];
            }
            this._init();
        },

        _initCommands: function (newCommands) {
            var modifiers = ej.datavisualization.Diagram.KeyModifiers;
            var keys = ej.datavisualization.Diagram.Keys;
            var commands;
            if (newCommands) {
                commands = this.model.commandManager.commands;
            } else {
                newCommands = this.model.commandManager.commands;
                commands = {
                    "copy":
                        {
                            gesture: { key: keys.C, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "paste":
                        {
                            gesture: { key: keys.V, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "cut":
                        {
                            gesture: { key: keys.X, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "delete":
                        {
                            gesture: { key: keys.Delete },
                            _isDefault: true
                        },
                    "undo":
                        {
                            gesture: { key: keys.Z, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "redo":
                        {
                            gesture: { key: keys.Y, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "selectAll":
                        {
                            gesture: { key: keys.A, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "nudgeUp":
                        {
                            parameter: "up",
                            gesture: { key: keys.Up },
                            _isDefault: true
                        },
                    "nudgeRight":
                        {
                            parameter: "right",
                            gesture: { key: keys.Right },
                            _isDefault: true
                        },
                    "nudgeDown":
                        {
                            parameter: "down",
                            gesture: { key: keys.Down },
                            _isDefault: true
                        },
                    "nudgeLeft":
                        {
                            parameter: "left",
                            gesture: { key: keys.Left },
                            _isDefault: true
                        },
                    "startEdit":
                        {
                            gesture: { key: 113 },
                            _isDefault: true
                        },
                    "endEdit":
                        {
                            gesture: { key: keys.Escape },
                            _isDefault: true
                        },
                    "focusToNextItem":
                        {
                            gesture: { key: keys.Tab },
                            _isDefault: true
                        },
                    "focusToPreviousItem":
                        {
                            gesture: { key: keys.Tab, keyModifiers: modifiers.Control },
                            _isDefault: true
                        },
                    "selectFocusedItem":
                        {
                            gesture: { key: keys.Enter },
                            _isDefault: true
                        },
                };
                for (var j in commands)
                    this._initCommandValues(j, commands[j]);

            }
            var i;
            for (i in newCommands) {
                if (commands[i]) {
                    if (newCommands[i]) {
                        if (newCommands[i] && commands[i].gesture && newCommands[i].gesture) {
                            if (!this._isLoad) {
                                if (commands[i]._isDefault)
                                    delete commands[i]._isDefault;
                            }
                            newCommands[i].gesture = ej.datavisualization.Diagram.Gesture($.extend({}, true, commands[i].gesture, newCommands[i].gesture));
                            if (this._tempCommandManager && this._tempCommandManager.commands && this._tempCommandManager.commands[i]._isDefault) {
                                this._initCommandValues(i, newCommands[i]);
                            }
                        }
                        $.extend(commands[i], true, newCommands[i]);
                    } else commands[i] = null;
                } else {
                    if (newCommands[i]) {
                        var cmd = ej.datavisualization.Diagram.Command(newCommands[i]);
                        commands[i] = cmd;
                    }
                }
            }
            this.model.commandManager.commands = commands;
        },
        _initCommandValues: function (command, newCommands) {
            switch (command) {
                case "copy":
                    newCommands.execute = $.proxy(this.copy, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "paste":
                    newCommands.execute = $.proxy(this._commandPaste, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "cut":
                    newCommands.execute = $.proxy(this.cut, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "delete":
                    newCommands.execute = $.proxy(this.remove, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "undo":
                    newCommands.execute = $.proxy(this.undo, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "redo":
                    newCommands.execute = $.proxy(this.redo, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "selectAll":
                    newCommands.execute = $.proxy(this._selectCommand, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "nudgeUp":
                case "nudgeRight":
                case "nudgeDown":
                case "nudgeLeft":
                    newCommands.execute = $.proxy(this._nudgeCommand, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "startEdit":
                    newCommands.execute = $.proxy(this._startEditCommand, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "endEdit":
                    newCommands.execute = $.proxy(this._endEdit, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "focusToNextItem":
                case "focusToPreviousItem":
                    newCommands.execute = $.proxy(this._focusToItem, this);
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
                case "selectFocusedItem":
                    newCommands.execute = $.proxy(this._selectFocusedItem, this),
                    newCommands.canExecute = $.proxy(this._canExecute, this);
                    break;
            }
        },
        _initViews: function (isLoad) {
            if (!isLoad) {
                this._views = [];
                this._views.push(this._id);
            }
            this._views[this._id] = {
                "type": "mainview",
                "context": ej.datavisualization.Diagram.SvgContext,
                "style": "position:relative; height:" + this.model.height + "; width:" + this.model.width + ";"
            };
        },
        _initDefaults: function () {
            if (!(this.tool())) {
                if (ej.isMobile()) {
                    this.tool(ej.datavisualization.Diagram.Tool.ZoomPan);
                    this._isMobile = true;
                }
                else {
                    this.tool(ej.datavisualization.Diagram.Tool.SingleSelect | ej.datavisualization.Diagram.Tool.MultipleSelect);
                }
            }
            this._initTools();
        },
        _initCanvas: function (isload) {
            this._renderCanvas(isload);
        },
        _initVisualGuide: function () {
            if (this.model.tooltip) {
                this.model.tooltip = ej.datavisualization.Diagram.Tooltip(this.model.tooltip);
            }
            if (this.model.selectedItems) {
                if (this.model.selectorConstraints) {
                    this.model.selectedItems.constraints = this.model.selectorConstraints;
                }
                if (!ej.datavisualization.Diagram.Util.canEnableTooltip(this) || !this.showTooltip()) {
                    this.model.selectedItems.tooltip = null;
                }
                else {
                    if (this.model.selectedItems.tooltip) {
                        this.model.selectedItems.tooltip = ej.datavisualization.Diagram.Tooltip(this.model.selectedItems.tooltip);
                    }
                    else {
                        this.model.selectedItems.tooltip = ej.datavisualization.Diagram.Tooltip({ margin: { top: 10 } });
                    }

                }
                if (this.model.selectedItems.tooltip && this.model.tooltipTemplateId) {
                    this.model.selectedItems.tooltip.templateId = this.model.selectedItems.tooltip.templateId || this.model.tooltipTemplateId;
                }
            }
        },
        _initTools: function () {
            this.tools = {
                "select": new ej.datavisualization.Diagram.SelectTool(this),
                "move": new ej.datavisualization.Diagram.MoveTool(this),
                "resize": new ej.datavisualization.Diagram.ResizeTool(this),
                "rotate": new ej.datavisualization.Diagram.RotateTool(this),
                //"pivot": new ej.datavisualization.Diagram.PivotTool(this),
                "endPoint": new ej.datavisualization.Diagram.ConnectionEditTool(this),
                "panTool": new ej.datavisualization.Diagram.PanTool(this),
                "portTool": new ej.datavisualization.Diagram.PortTool(this),
                "straightLine": new ej.datavisualization.Diagram.StraightLineTool(this),
                "orthogonalLine": new ej.datavisualization.Diagram.OrthogonalLineTool(this),
                "bezierLine": new ej.datavisualization.Diagram.BezierLineTool(this),
                "phase": new ej.datavisualization.Diagram.PhaseTool(this),
                "shapeTool": new ej.datavisualization.Diagram.ShapeTool(this),
                "text": new ej.datavisualization.Diagram.TextTool(this),
                "labelMove": new ej.datavisualization.Diagram.LabelMoveTool(this),
                "labelResize": new ej.datavisualization.Diagram.LabelResizeTool(this),
                "labelRotate": new ej.datavisualization.Diagram.LabelRotateTool(this),
            };
            this._toolToActivate = "select";
            this.activeTool = this.tools[this._toolToActivate];
            this._registerDrawingTools();
        },
        _initDiagramTool: function () {
            var tool = this.tool();
            var shape;
            if (tool & ej.datavisualization.Diagram.Tool.ContinuesDraw) {
                if (this.model.drawType) {
                    shape = this.model.drawType.shape ? this.model.drawType.shape : this.model.drawType.type;
                    this._drawToolShape(shape, false);
                }
            } else if (tool & ej.datavisualization.Diagram.Tool.DrawOnce) {
                if (this.model.drawType) {
                    shape = this.model.drawType.shape ? this.model.drawType.shape : this.model.drawType.type;
                    this._drawToolShape(shape, true);
                }
            } else if (tool & ej.datavisualization.Diagram.Tool.ZoomPan) {
                if (ej.datavisualization.Diagram.Util.canPanning(this)) {
                    this._toolToActivate = "panTool";
                    this.activeTool = this.tools[this._toolToActivate];
                    this.activeTool._isMouseDown = false;
                    this._currentCursor = "pointer";
                }
            } else if (tool & ej.datavisualization.Diagram.Tool.MultipleSelect) {
                this.activateTool("select");
                this.activeTool.singleAction = false;
            }
        },
        _initHandles: function () {
            var userHandles = this.model.selectedItems.userHandles;
            if (userHandles) {
                for (var i = 0; i < userHandles.length; i++) {
                    userHandles[i] = ej.datavisualization.Diagram.UserHandle(userHandles[i]);
                    if (userHandles[i].tool) {
                        userHandles[i].tool.diagram = this;
                        this.tools[userHandles[i].name] = userHandles[i].tool;
                    }
                }
            }
        },
        _initHistoryManager: function () {
            this.model.historyManager.push = $.proxy(this.addHistoryEntry, this);
            this.model.historyManager.pop = $.proxy(this.removeHistoryEntry, this);
            this.model.historyManager.canPop = $.proxy(this.canRemoveHistoryEntry, this);
            this.model.historyManager.startGroupAction = $.proxy(this._startGroupAction, this);
            this.model.historyManager.closeGroupAction = $.proxy(this._closeGroupAction, this);
        },

        _cloneGlobalVariables: function () {
            this._historyList = $.extend(true, {}, this._historyList);
        },
        _setNodesConnectors: function (options, isLoad) {
            var nodes = [], sNodes = false, sConnectors = false;
            var nLength = options.nodes ? (typeof options.nodes === 'function' ? options.nodes().length : options.nodes.length) : 0;
            var cLength = options.connectors ? (options.connectors && typeof options.connectors === 'function' ? options.connectors().length : options.connectors.length) : 0;
            if (options.nodes && nLength != this._nodes.length) {
                for (var i = 0; i < this.nodes().length; i++)
                    this._removeElementFromCollection(this.nameTable[this.nodes()[i].name]);
                this._isPreventModelChange = true;
                this.nodes(typeof options.nodes === 'function' ? options.nodes() : options['nodes']);
                this._isPreventModelChange = false;
                this._initNodeCollection(isLoad);
                sNodes = true;
            }
            if (options.connectors && cLength != this._connectors.length) {
                for (var i = 0; i < this.connectors().length; i++)
                    this._removeElementFromCollection(this.nameTable[this.connectors()[i].name]);
                this._isPreventModelChange = true;
                this.connectors(typeof options.connectors === 'function' ? options.connectors() : options['connectors']);
                this._isPreventModelChange = false;
                this._initConnectorCollection(); sConnectors = true;
            }
            nodes = this.nodes();
            nodes = nodes.length > 0 ? this.nodes().concat(this.connectors()) : this.connectors();
            if (nodes.length > 0 || options.nodes.length == 0 || options.connectors.length == 0) {
                this._resetObjectCollection(nodes, isLoad, sNodes, sConnectors);
            }
            return true;
        },
        _removeElementFromCollection: function (item) {
            if (item) {
                if (item.children) {
                    for (var i = 0; i < item.children.length; i++)
                        this._removeElementFromCollection(this.nameTable[this._getChild(item.children[i])]);
                }
                if (item.segments)
                    this._removeEdges(item);
                else {
                    this._disConnect(item, {});
                    item.inEdges = item.outEdges = [];
                }
                ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[item.name], item);
                ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, item);
                this._removeElement(item);
                delete this.nameTable[item.name];
            }
        },
        _updateCloneModel: function (arg) {
            if (arg) {
                this._cloneModel[arg] = typeof (this.model[arg]) === "string" ? this.model[arg] : $.extend(true, {}, this.model[arg]);
            }
        },
        _compareModelProperty: function (arg, interaction, root) {
            if (arg) {
                if (this._cloneModel[arg] !== this.model[arg]) {
                    var args = {};
                    args[arg] = this.model[arg];
                    this._comparePropertyValues(this._cloneModel, arg, args, interaction, root);
                    this._updateCloneModel(arg);
                }
            }
        },

        _setModel: function (options) {
            var initObject = false;
            var diagram, object;
            for (var option in options) {
                switch (option) {
                    case "height":
                    case "width":
                        this._svgParentDimention = null;
                        if (options["dataSourceSettings"]) {
                            this._layoutUpdate = true;
                        }
                        this._initViews(true);
                        this._initCanvas(true);
                        delete this._layoutUpdate;
                        break;
                    case "nodes":
                    case "connectors":
                        if (!initObject && !this._isPreventModelChange && (!(this._isRefreshTriggered && typeof this.model.nodes === "function"))) {
                            this._initLineRouting();
                            initObject = this._setNodesConnectors(options, this._isLoad);
                            this._trigger("refresh");
                        }
                        delete this._isRefreshTriggered;
                        break;
                    case "enableContextMenu":
                        this.model.enableContextMenu = options[option];
                        this._initContextMenu(this._isLoad);
                        break;
                    case "contextMenu":
                        this.model.contextMenu = $.extend({}, this.model.contextMenu, options[option]);
                        this._initContextMenu(this._isLoad);
                        break;
                    case "rulerSettings":
                        this._updateRulerSettings(options[option]);
                        break;
                    case "snapSettings":
                        object = options[option];
                        if (object && Object.keys(object).length > 0) {
                            this._updateSnapSettings(options[option]);
                            ej.datavisualization.Diagram.SvgContext._renderGrid(this._canvas, this._svg, this._page, this);
                        }
                        break;
                    case "selectorConstraints":
                        this._setSelectorConstraints(options[option]);
                        break;
                    case "constraints":
                        this.model.constraints = options[option];
                        if (this._hasSelection() && !ej.datavisualization.Diagram.Util.isPageEditable(this))
                            this._clearSelection();
                        var totalConnectors = this._getConnectors();
                        if (totalConnectors.length > 0) {
                            for (var i = 0; i < totalConnectors.length; i++) {
                                ej.datavisualization.Diagram.Util.updateBridging(this.model.connectors[i], this);
                                ej.datavisualization.Diagram.DiagramContext.update(this.model.connectors[i], this);
                            }
                        }

                        break;
                    case "drawingTools":
                        this.model.drawingTools = options[option];
                        this._registerDrawingTools();
                        break;
                    case "backgroundImage":
                        if (this.model.backgroundImage && typeof this.model.backgroundImage == "string") {
                            this.model.backgroundImage = ej.datavisualization.Diagram.BackgroundImage({ source: this.model.backgroundImage });
                        }
                        else
                            this.model.backgroundImage = $.extend(true, {}, this.model.backgroundImage, options[option]);
                        ej.datavisualization.Diagram.SvgContext._renderBackground(this, this._canvas, this._svg, this._page, this.model);
                        break;
                    case "backgroundColor":
                        this.model.backgroundColor = options[option];
                        ej.datavisualization.Diagram.SvgContext._renderBackground(this, this._canvas, this._svg, this._page, this.model);
                        break;
                    case "enableAutoScroll":
                        this.enableAutoScroll(options[option]);
                        break;
                    case "autoScrollMargin":
                        this.model.autoScrollMargin = options[option];
                        break;
                    case "layout":
                        if (!this._isLoad) {
                        if (options[option].marginX)
                            this.model.layout.margin.left = this.model.layout.margin.right = Number(typeof options[option].marginX === 'function' ? this._layoutMarginX() : options[option].marginX);
                        if (options[option].marginY)
                            this.model.layout.margin.top = this.model.layout.margin.bottom = Number(typeof options[option].marginY === 'function' ? this._layoutMarginY() : options[option].marginY);
                        this.model.layout = $.extend(true, {}, this.model.layout, options[option]);
                        this._setLayout(options[option]);                       
                        }
                        break;
                    case "selectedItems":
                        this.updateSelector(options[option]);
                        break;
                    case "pageSettings":
                        this.updatePageSettings(options[option]);
                        break;
                    case "scrollSettings":
                        this._updateScrollSettings(options[option]);
                        break;
                    case "locale":
                        this.locale(options[option]);
                        var contextmenu = document.getElementById(this.element[0].id + "_contextMenu");
                        contextmenu.parentNode.removeChild(contextmenu);
                        if (this.model.contextMenu && this.model.contextMenu.items && this.model.contextMenu.items.length > 0)
                            this.model.contextMenu.items = [];
                        this._renderContextMenu();
                        break;
                    case "nodeTemplate":
                        if (!this._isLoad) {
                            if (!options["dataSourceSettings"] && !options["nodes"]) {
                                this._clearElementCollection();
                                this._initData();
                                diagram = this;
                                this._views.forEach(function (viewid) {
                                    var view = diagram._views[viewid];
                                    var nodes = diagram._setNodeZOrder(view);
                                    diagram._renderDiagramObjects(nodes, view);
                                });
                                this.layout();
                            }
                        }
                        break;
                    case "bridgeDirection":
                    case "tool":
                        this.update(options);
                        break;
                    case "connectorTemplate":
                        this._updateConnectors();
                        break;
                    case "commandManager":
                        var commands = options[option] && options[option]["commands"] ? options[option]["commands"] : undefined;
                        this._initCommands(commands);
                        break;
                    case "historyManager":
                        this.model.historyManager = $.extend(true, this.model.historyManager, {}, options[option]);
                        var stackLimit = this.model.historyManager.stackLimit;
                        var rLength = this.model.historyManager.redoStack.length
                        var uLength = this.model.historyManager.undoStack.length
                        if (rLength > 0) {
                            if (rLength > stackLimit) {
                                var sliceEnd = rLength - stackLimit;
                                this.model.historyManager.redoStack.splice(0, sliceEnd);
                                this.model.historyManager.undoStack = [];
                            }
                            else {
                                var remaiRemove = stackLimit - rLength;
                                var sliceEnd = uLength - remaiRemove;
                                this.model.historyManager.undoStack.splice(0, sliceEnd);
                            }
                        }
                        if (uLength > 0) {
                            var sliceEnd = uLength - stackLimit;
                            if (sliceEnd > 0) {
                                this.model.historyManager.undoStack.splice(0, sliceEnd);
                            }
                        }
                        this._initHistoryManager();
                        break;
                    case "showTooltip":
                        this.model.showTooltip = options[option];
                        if (this.showTooltip())
                            this.model.selectedItems.tooltip = ej.datavisualization.Diagram.Tooltip({ margin: { top: 10 } });
                        else
                            this.model.selectedItems.tooltip = null;
                        break;
                    case "toolTipTemplateId":
                        if (!this.model.selectedItems.tooltip)
                            this.model.selectedItems.tooltip = ej.datavisualization.Diagram.Tooltip({ margin: { top: 10 } });
                        this.model.selectedItems.tooltip.templateId = options[option];
                        break;
                    case "tooltip":
                        if (options[option] === null) this.model.tooltip = null;
                        else
                            this.model.tooltip = ej.datavisualization.Diagram.Tooltip($.extend(true, this.model.tooltip, {}, options[option]));
                        break;
                    case "dataSourceSettings":
                        if (!this._isLoad) {
                        object = options[option];
                        if (object && Object.keys(object).length > 0 && object.dataSource) {
                            this.clear();
                            $.extend(this.model.dataSourceSettings, options[option]);
                            this._initLineRouting();
                            this._initData();
                            diagram = this;
                            this._views.forEach(function (viewid) {
                                var view = diagram._views[viewid];
                                var nodes = diagram._setNodeZOrder(view);
                                diagram._renderDiagramObjects(nodes, view);
                                });
                                this.layout();
                                var nodes = diagram.connectors();
                                if (nodes.length > 1 && (ej.datavisualization.Diagram.Util.canRouteDiagram(this))) {
                                    diagram.lineRouting.GenerateVisibilityGraph(diagram, nodes.length);
                                    for (var i = 0; i < nodes.length; i++)
                                            diagram._routeEdge(nodes[i]);
                                }
                            }
                        }
                        break;
                }
                if (!(option === "nodes" || option === "connectors" || option === "selectorConstraints" || option === "selectedItems" || option === "bridgeDirection" || option === "tool" || option === "dataSourceSettings"))
                    this._compareModelProperty(option);
            }
        },
        _resetObjectCollection: function (nodes, isLoad, sNode, sConnectors) {
            if (sNode) {
                $(this.element).find(".ej-d-node").remove();
                $(this.element).find(".ej-d-group").remove();
                $(this.element).find(".ej-d-seperator").remove();
            }
            if (sConnectors) {
                var children = $(this.element).find(".ej-d-connector");
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = this.nameTable[children[i].id];
                    if (child && child.parent == "")
                        $(children[i]).remove();
                }
            }
            if (this._hasSelection())
                this._clearSelection();
            var diagram = this;
            this._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                var nodes = diagram._setNodeZOrder(view);
                diagram._renderDiagramObjects(nodes, view);
            });

        },
        _getConnectors: function () {
            var connectors = [];
            for (var prop in this.nameTable) {
                var connector = this.nameTable[prop];
                if (connector._type === "connector" || connector.segments)
                    connectors.push(connector);
            }
            return connectors;
        },

        _generateNodes: function (dataSource) {
            var nodes = [];
            for (var i = 0; i < dataSource.length; i++) {
                var row = dataSource[i];
                var node = this._makeNode(row);
                if (node != null && node.name && !this._findNodeByName(nodes, node.name)) {
                    nodes.push(node);
                }
            }
            return nodes;
        },

        _generateConnectors: function (dataSource) {
            var connectors = [];
            for (var i = 0; i < dataSource.length; i++) {
                var row = dataSource[i];
                var conn = this._makeLine(row);
                if (conn && conn.name && !this._findNodeByName(connectors, conn.name))
                    connectors.push(conn);
            }
            return connectors;
        },

        _findNodeByName: function (nodes, name) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].name === name)
                    return true;
            }
            return false;
        },

        _makeNode: function (row) {
            var fields = this.model.dataSourceSettings;
            var node = {};
            var nodeName = row[fields.id];
            if (nodeName) {
                node.name = nodeName;
                if (fields.customFields && fields.customFields.length > 0) {
                    for (var i = 0; i < fields.customFields.length; i++)
                        node[fields.customFields[i]] = row[fields.customFields[i]];
                }
                return node;
            }
            else
                return null;
        },

        _makeLine: function (row) {
            var fields = this.model.dataSourceSettings.connectionDataSource;
            var conn = {};
            conn.name = row[fields.id] ? row[fields.id] : "connector_" + ej.datavisualization.Diagram.Util.randomId();
            conn.sourceNode = row[fields.sourceNode];
            conn.targetNode = row[fields.targetNode];
            if (row[fields.sourcePointX] && row[fields.sourcePointY])
                conn.sourcePoint = { "x": Number(row[fields.sourcePointX]), "y": Number(row[fields.sourcePointY]) };
            if (row[fields.targetPointX] && row[fields.targetPointY])
                conn.targetPoint = { "x": Number(row[fields.targetPointX]), "y": Number(row[fields.targetPointY]) };
            if (fields.customFields && fields.customFields.length > 0) {
                for (var i = 0; i < fields.customFields.length; i++)
                    conn[fields.customFields[i]] = row[fields.customFields[i]];
            }
            return conn;
        },

        insertData: function (node) {
            var mappingData;
            if (node) {
                var data, url;
                data = this._parameterMap(node);
                if (node.type === "connector")
                    url = this.model.dataSourceSettings.connectionDataSource.crudAction.create;
                else
                    url = this.model.dataSourceSettings.crudAction.create;
                if (data) {
                    this._raiseAjaxPost(JSON.stringify({ "data": [data] }), url);
                }
            }
            else {
                var newObjects = this._getNewNodes();
                if (newObjects.nodes) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.nodes.length; i++) {
                        data.push(this._parameterMap(newObjects.nodes[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.crudAction.create);
                }
                if (newObjects.connectors) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.connectors.length; i++) {
                        data.push(this._parameterMap(newObjects.connectors[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.connectionDataSource.crudAction.create);
                }
            }

        },

        updateData: function (node) {
            var mappingData;
            if (node) {
                var data, url;
                data = this._parameterMap(node);
                if (node.type === "connector")
                    url = this.model.dataSourceSettings.connectionDataSource.crudAction.update;
                else
                    url = this.model.dataSourceSettings.crudAction.update;
                if (data) {
                    this._raiseAjaxPost(JSON.stringify({ "data": [data] }), url);
                }
            }
            else {
                var newObjects = this._getUpdatedNodes();
                if (newObjects.nodes) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.nodes.length; i++) {
                        data.push(this._parameterMap(newObjects.nodes[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.crudAction.update);
                }
                if (newObjects.connectors) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.connectors.length; i++) {
                        data.push(this._parameterMap(newObjects.connectors[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.connectionDataSource.crudAction.update);
                }
            }
        },

        removeData: function (node) {
            var mappingData;
            if (node) {
                var data, url;
                data = this._parameterMap(node);
                if (node.type === "connector")
                    url = this.model.dataSourceSettings.connectionDataSource.crudAction.destroy;
                else
                    url = this.model.dataSourceSettings.crudAction.destroy;
                if (data) {
                    this._raiseAjaxPost(JSON.stringify({ "data": [data] }), url);
                }
            }
            else {
                var newObjects = this._getDeletedNodes();
                if (newObjects.nodes) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.nodes.length; i++) {
                        data.push(this._parameterMap(newObjects.nodes[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.crudAction.destroy);
                }
                if (newObjects.connectors) {
                    var mappingData, data = [];
                    for (var i = 0; i < newObjects.connectors.length; i++) {
                        data.push(this._parameterMap(newObjects.connectors[i]));
                    }
                    if (data && data.length > 0)
                        this._raiseAjaxPost(JSON.stringify({ "data": data }), this.model.dataSourceSettings.connectionDataSource.crudAction.destroy);
                }
            }
        },

        _parameterMap: function (object, url) {
            var mappingObj = {};
            if (object.type === "connector") {
                var fields = this.model.dataSourceSettings.connectionDataSource;
                if (fields.id)
                    mappingObj[fields.id] = object.name;
                if (fields.sourcePointX && fields.sourcePointY) {
                    mappingObj[fields.sourcePointX] = object.sourcePoint.X;
                    mappingObj[fields.sourcePointY] = object.sourcePoint.Y;
                }
                if (fields.targetPointX && fields.targetPointY) {
                    mappingObj[fields.targetPointX] = object.targetPoint.X;
                    mappingObj[fields.targetPointY] = object.targetPoint.Y;
                }
                if (fields.sourceNode)
                    mappingObj[fields.sourceNode] = object.sourceNode;
                if (fields.targetNode)
                    mappingObj[fields.targetNode] = object.targetNode;
                if (fields.customFields && fields.customFields.length > 0) {
                    for (var i = 0; i < fields.customFields.length; i++)
                        mappingObj[fields.customFields[i]] = object[fields.customFields[i]];
                }
            }
            else {
                var fields = this.model.dataSourceSettings;
                if (fields.id)
                    mappingObj[fields.id] = object.name;
                if (fields.width)
                    mappingObj[fields.width] = object.width;
                if (fields.height)
                    mappingObj[fields.height] = object.height;
                if (fields.offsetX)
                    mappingObj[fields.offsetX] = object.offsetX;
                if (fields.offsetY)
                    mappingObj[fields.offsetY] = object.offsetY;
                if (fields.customFields && fields.customFields.length > 0) {
                    for (var i = 0; i < fields.customFields.length; i++)
                        mappingObj[fields.customFields[i]] = object[fields.customFields[i]];
                }
            }
            return mappingObj;
        },

        _raiseAjaxPost: function (data, url) {
            var tempObj = this;
            var callback = $.ajax({
                contentType: 'application/json',
                type: 'POST',
                url: url,
                data: this._isWebAPI ? JSON.stringify(JSON.parse(data).data) : JSON.stringify(JSON.parse(data)),
                dataType: "json",
                error: function (errData) {
                    if (errData.status === 404) {
                        console.log("Method not found");
                    }
                }
            });
        },

        _initData: function () {
            if (this.model.dataSourceSettings) {
                var dataSourceSettings = {};
                if (this.model.dataSourceSettings.dataSource && this.model.dataSourceSettings.connectionDataSource.dataSource) {
                    dataSourceSettings.dataSource = this.model.dataSourceSettings.dataSource;
                    dataSourceSettings.isBinding = true;
                    dataSourceSettings.nodes = this._generateNodes(this.model.dataSourceSettings.dataSource);
                    dataSourceSettings.connectors = this._generateConnectors(this.model.dataSourceSettings.connectionDataSource.dataSource);
                }
                else if (this.model.dataSourceSettings.dataSource) {
                    dataSourceSettings.id = this._dataSourceUniqueId();
                    dataSourceSettings.parent = this._dataSourceParentId();
                    dataSourceSettings.root = this._dataSourceRoot();
                    dataSourceSettings.dataSource = this._dataSource();
                    dataSourceSettings.tableName = this._dataSourceTableName();
                    dataSourceSettings.query = this._dataSourceQueryString();
                }
                var dataSource = dataSourceSettings.dataSource || this.model.dataSourceSettings.nodes || this.model.dataSourceSettings.connectors;
            }
            if (dataSource) {
                var nodes = [];
                var connectors = [];
                var dataSourceApplied;
                if (dataSourceSettings && dataSourceSettings.isBinding) {
                    if (dataSourceSettings.nodes && dataSourceSettings.nodes.length > 0) {
                        this._applyTemplate(this.model.dataSourceSettings, dataSourceSettings.nodes, nodes, "nodes");
                    }
                    if (dataSourceSettings.connectors && dataSourceSettings.connectors.length > 0) {
                        this._applyTemplate(this.model.dataSourceSettings, dataSourceSettings.connectors, connectors, "connectors");
                    }
                    //dataSourceApplied = true;
                }
                else if (this.model.dataSourceSettings.nodes || this.model.dataSourceSettings.connectors) {
                    if (this.model.dataSourceSettings.nodes) {
                        dataSource = this.model.dataSourceSettings.nodes || this.model.dataSourceSettings.dataSource;
                        if (dataSource) {
                            if (dataSource instanceof ej.DataManager) {
                                $.ajaxSetup({
                                    async: false
                                });
                                var query = this._findQuery(this.model.dataSourceSettings.nodes, this.model.dataSourceSettings.nodeBinding);
                                var queryPromise = dataSource.executeQuery(eval(query));
                                var diagram = this;
                                queryPromise.done(function (e) {
                                    diagram.retriveData = e.result;
                                    diagram._applyTemplate(diagram.model.dataSourceSettings, e.result, nodes, "nodes");
                                });
                            } else
                                this._applyTemplate(this.model.dataSourceSettings, dataSource, nodes, "nodes");
                        }
                        if (this.model.dataSourceSettings.connectors) {
                            dataSource = this.model.dataSourceSettings.connectors || this.model.dataSourceSettings.dataSource;
                            if (dataSource) {
                                if (dataSource instanceof ej.DataManager) {
                                    $.ajaxSetup({
                                        async: false
                                    });
                                    query = this._findQuery(this.model.dataSourceSettings.connectors, this.model.dataSourceSettings.connectorBinding);
                                    queryPromise = dataSource.executeQuery(eval(query));
                                    queryPromise.done(function (e) {
                                        diagram.retriveData = e.result;
                                        diagram._applyTemplate(diagram.model.dataSourceSettings, e.result, connectors, "connectors");
                                    });
                                } else {
                                    this._applyTemplate(this.model.dataSourceSettings, dataSource, connectors, "connectors");
                                }
                            }
                        }
                    }
                } else if (dataSource instanceof ej.DataManager) {
                    this._initDataSource(dataSourceSettings, nodes, connectors);
                    if (dataSourceSettings.parent)
                        dataSourceApplied = true;
                }
                else if (typeof dataSource != "string" && dataSource.length) {
                    this._applyDataSource(dataSourceSettings, dataSource, nodes, connectors);
                    if (this.model.dataSourceSettings.parent)
                        dataSourceApplied = true;
                }
                var tempNodes = [], tempconnectors = [];
                if (this.nodes().length > 0)
                    tempNodes = this.nodes();
                if (this.connectors().length > 0)
                    tempconnectors = this.connectors();
                this.nodes(nodes);
                this.connectors(connectors);
                var i;
                for (i = 0; i < tempNodes.length; i++) {
                    this.nodes().push(tempNodes[i]);
                    this._nodes = $.extend(true, [], this.nodes());
                }
                for (i = 0; i < tempconnectors.length; i++) {
                    this.connectors().push(tempconnectors[i]);
                    this._connectors = $.extend(true, [], this.connectors());
                }
            }
            var collapsedNodes = this._initNodeCollection(false, dataSourceApplied);
            this._initConnectorCollection(dataSourceApplied);
            if (collapsedNodes.length > 0) {
                this._collapseNodes(collapsedNodes);
            }
            this._cloneModel = $.extend(true, {}, this.model);
        },

        _getSetTool: function () {
            var setTool;
            if (this.model.setTool) {
                if (typeof this.model.setTool === "string") {
                    setTool = ej.util.getObject(this.model.setTool, window);
                }

                if ($.isFunction(this.model.setTool)) {
                    setTool = this.model.setTool;
                }
            }
            return setTool;
        },

        _getNodeTemplate: function () {
            var nodeTemplate;
            if (this.model.nodeTemplate) {
                if (typeof this.model.nodeTemplate === "string") {
                    nodeTemplate = ej.util.getObject(this.model.nodeTemplate, window);
                }
                if ($.isFunction(this.model.nodeTemplate)) {
                    nodeTemplate = this.model.nodeTemplate;
                }
            }
            return nodeTemplate;
        },

        _getConnectorTemplate: function () {
            var connectorTemplate;
            if (this.model.connectorTemplate) {
                if (typeof this.model.connectorTemplate === "string") {
                    this.model.connectorTemplate = ej.util.getObject(this.model.connectorTemplate, window);
                }
                if ($.isFunction(this.model.connectorTemplate)) {
                    connectorTemplate = this.model.connectorTemplate;
                }
            }
            return connectorTemplate;
        },

        _initNodeCollection: function (isLoad, dataSourceApplied) {
            var collapsedNodes = [];
            var nodes = this.nodes();
            var nodeTemplate;
            if (!this.model.dataSourceSettings.dataSource || this._isLoad)
                nodeTemplate = this._getNodeTemplate();
            this._isNodeInitializing = true;
            for (var i = 0; i < nodes.length; i++) {
                if ((nodes[i].container && !$.isEmptyObject(nodes[i].container)) || nodes[i].isSwimlane || nodes[i].type === "swimlane") {
                    i = this._convertGroupChild(nodes[i], nodes);
                    nodes[i] = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, nodes[i]);
                }
                else if (typeof nodes[i].shape !== "object") {
                    nodes[i] = ej.datavisualization.Diagram.NodeType(nodes[i], this);
                }
                if (nodes[i].name == "") {
                    nodes[i].name = "node_" + ej.datavisualization.Diagram.Util.randomId();
                }
                if (nodes[i].type === "swimlane" || nodes[i].isSwimlane) {
                    this.nameTable[nodes[i].name] = ej.datavisualization.Diagram.Group(nodes[i]);

                } else if (nodes[i]._type === "group" || (nodes[i].children && nodes[i].children.length > 0)) {
                    if (nodes[i].type == "bpmn" && nodes[i].container)
                        nodes[i] = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, nodes[i]);
                    else {
                        i = this._convertGroupChild(nodes[i], nodes);
                        nodes[i] = this._getNewGroup(nodes[i]);
                    }
                    nodes[i]._type = "group";
                    this.nameTable[nodes[i].name] = nodes[i];
                    this._initGroupNode(nodes[i]);
                    if (!isLoad && nodes[i].type !== "bpmn")
                        this._udpateChildRotateAngle(nodes[i]);
                } else {
                    if (!dataSourceApplied) {
                        nodes[i] = this._getNewNode(nodes[i]); //ej.datavisualization.Diagram.Node(nodes[i]);
                        this.nameTable[nodes[i].name] = nodes[i];
                    } else if (nodes[i].shape && typeof nodes[i].shape === "object")
                        ej.datavisualization.Diagram.Util._updateShapeProperties(nodes[i]);
                }
                if (!dataSourceApplied && nodeTemplate) {
                    nodeTemplate(this, nodes[i]);
                    if (typeof nodes[i].shape !== "object") {
                        nodes[i] = ej.datavisualization.Diagram.NodeType(nodes[i], this);
                    }
                    if (nodes[i]._type === "group" || (nodes[i].children && nodes[i].children.length > 0)) {
                        if (nodes[i].type == "bpmn" && nodes[i].container)
                            nodes[i] = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, nodes[i]);
                        else
                            nodes[i] = this._getNewGroup(nodes[i]);
                        this._initGroupNode(nodes[i]);
                    }
                }
                if (nodes[i]._type === "node" && nodes[i].labels.length && (nodes[i].width == 0 || nodes[i].height == 0))
                    this._getNodeDimension(nodes[i]);
                this.nameTable[nodes[i].name] = nodes[i];
                this._updateQuad(nodes[i]);
                if (!nodes[i].isExpanded) {
                    collapsedNodes.push(nodes[i]);
                }
                this._setBounds(nodes[i]);
            }
            delete this._isNodeInitializing;
            this._nodes = $.extend(false, [], nodes);
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this)) {
                this.lineRouting.GenerateVisibilityGraph(this);
                for (var i = 0; i < this._nodes.length; i++) {
                    this._resetValues(this._nodes[i]);
                }
            }
            return collapsedNodes;
        },

        _convertGroupChild: function (group, nodesCollection) {
            if (group.children && group.children.length > 0) {
                for (var i = 0; i < group.children.length; i++) {
                    var child = group.children[i];
                    if (child && typeof child === "string") {
                        child = this.nameTable[child];
                        group.children[i] = child;
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[child.name], child);
                        ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, child, false);
                        if (child.type === "group") {
                            i = this._convertGroupChild(child, group.children);
                        }
                        if (child.type === "connector")
                            ej.datavisualization.Diagram.Util.removeItem(this.connectors(), child);
                        else
                            ej.datavisualization.Diagram.Util.removeItem(this.nodes(), child);
                    }
                }
            }
            var index = nodesCollection.indexOf(group);
            return index;
        },
        _checkFromSwimlane: function (node) {
            if (node) {
                if (node.isSwimlane || node.isLane || node.isLaneStack || node.isPhaseStack || node.isPhase || node.type == "phase")
                    return true;
                if (node.parent) {
                    var parent = this.nameTable[node.parent];
                    if (parent) {
                        return this._checkFromSwimlane(parent);
                    }
                }
            }
            return false
        },
        _setBounds: function (node) {
            if (!this._selectedSymbol && ej.datavisualization.Diagram.Util.canRouteDiagram(this)) {
                if (!node.segments) {
                    if (!this._checkFromSwimlane(node)) {
                        if (this.nodes().length == 1 && !this.lineRouting.router && !this.lineRouting.router.graph)
                            this.lineRouting.GenerateVisibilityGraph(this, this.nodes().length == 1);
                        this.lineRouting.RemoveNode(node);
                        if (!this._isInit) {
                            //this.renderGraph();
                            this._setObstacle();
                            this.lineRouting.AddNode(node);
                        }
                    }
                }
            }
        },
        _setObstacle: function () {
            this.lineRouting.IsDirt = true
        },

        _initConnectorCollection: function (dataSourceApplied) {
            var connectors = this.connectors();
            var connector;
            var connectorTemplate = this._getConnectorTemplate();
            for (var i = 0, len = connectors.length; i < len; i++) {
                connector = dataSourceApplied ? connectors[i] : this._getNewConnector(connectors[i]);
                this.nameTable[connector.name] = connector;
                if (!dataSourceApplied) {
                    if ((this.model.layout && this._layoutType() === ej.datavisualization.Diagram.LayoutTypes.None) || this._isLoad)
                        this._dock(connector, this.nameTable);
                }
                this._updateEdges(connector);
                if (connectorTemplate && !dataSourceApplied) connectorTemplate(this, connector);
                connectors[i] = connector;
                if (this.model.layout && this._layoutType() === ej.datavisualization.Diagram.LayoutTypes.None)   {
                    this._isUndo = true;
                    this._routeEdge(connectors[i]);
                    this._isUndo = false;
                }
            }
            this._connectors = $.extend(true, [], connectors);
        },

        //#region Data Source
        _initDataSource: function (dataSourceSettings, nodes, connectors) {
            var dataSource = dataSourceSettings.dataSource;
            var diagram = this;
            if (dataSource.dataSource.json && dataSource.dataSource.json.length > 0) {
                diagram._applyDataSource(dataSourceSettings, dataSource.dataSource.json, nodes, connectors);
            }
            else if (!dataSource.dataSource.table) {
                var mapper = dataSourceSettings;
                if (dataSource instanceof ej.DataManager) {
                    $.ajaxSetup({
                        async: false
                    });
                    var query = this._findQuery(mapper, dataSourceSettings.nodeBinding);
                    var queryPromise = dataSourceSettings["dataSource"].executeQuery(eval(query));
                    queryPromise.done(function (e) {
                        diagram.retriveData = e.result;
                        diagram._applyDataSource(dataSourceSettings, e.result, nodes, connectors);
                    });
                }
            }
        },
        _findQuery: function (mapper, binding) {
            var column = [], queryManager = ej.Query();
            var query = mapper.query || this.model.dataSourceSettings.query;

            if (ej.isNullOrUndefined(query)) {
                var dataSource = mapper.dataSource || this.model.dataSourceSettings.dataSource;
                var tableName = mapper.tableName || this.model.dataSourceSettings.tableName;;
                for (var col in mapper) {
                    if (col !== "tableName" && col !== "dataSource" && col !== "designTemplate" && !col.match("Binding"))
                        if (mapper[col]) column.push(mapper[col]);
                }
                for (var tempcol in binding) {
                    if (tempcol === "labels") {
                        var labels = binding[tempcol];
                        for (var i = 0; i < labels.length; i++) {
                            if (labels[i].text) column.push(labels[i].text);
                        }
                    } else if (tempcol == "shape" || tempcol == "line") {
                        if (binding[tempcol][type]) col.push(binding[tempcol][type]);
                    } else
                        if (binding[tempcol]) column.push(binding[tempcol]);
                }
                if (column.length > 0)
                    queryManager.select(column);
                if (!dataSource["dataSource"].url.match(tableName + "$"))
                    !ej.isNullOrUndefined(tableName) && queryManager.from(tableName);
            } else
                queryManager = query;
            return queryManager;
        },
        _updateMultipleRootNodes: function (obj, rootNodes, mapper, data) {
            var parents = obj[mapper.parent], parent;
            if (parents && parents.length > 0) {
                for (var i = 0; i < parents.length; i++) {
                    parent = parents[i];
                    if (rootNodes[parent])
                        rootNodes[parent].items.push(obj);
                    else
                        rootNodes[parent] = { items: [obj] };
                }
            }
            return rootNodes;
        },

        _applyDataSource: function (mapper, data, nodes, connectors) {
            var rootNodes = [];
            var firstNode, r, i, j, item, node, n, obj, firstLvel, nextLevel, nodeTemplate, connectorTemplate;
            for (r = 0; r < data.length; r++) {
                obj = data[r];
                if (!(Array.isArray(obj[mapper.parent]))) {
                    if (rootNodes[obj[mapper.parent]])
                        rootNodes[obj[mapper.parent]].items.push(obj);
                    else
                        rootNodes[obj[mapper.parent]] = { items: [obj] };
                }
                else
                    rootNodes = this._updateMultipleRootNodes(obj, rootNodes, mapper, data);
                if (mapper.root === obj[mapper.id])
                    firstNode = { items: [obj] };
            }
            firstLvel = [];
            if (mapper.parent) {
                if (firstNode)
                    firstLvel.push(firstNode);
                else {
                    for (n in rootNodes) {
                        if ((!n && n !== 0) || n == "undefined" || n == "\"\"" || n == "null") {
                            firstLvel.push(rootNodes[n]);
                        }
                    }
                }
            }
            else firstLvel.push(rootNodes[undefined]);
            if (this.model.nodeTemplate)
                nodeTemplate = this._getNodeTemplate();
            if (this.model.connectorTemplate)
                connectorTemplate = this._getConnectorTemplate();
            for (i = 0; i < firstLvel.length; i++) {
                for (j = 0; j < firstLvel[i].items.length; j++) {
                    item = firstLvel[i].items[j];
                    node = this._applyNodeTemplate(mapper, item, nodeTemplate);
                    nodes.push(node);
                    if (mapper.parent) {
                        nextLevel = rootNodes[node[mapper.id]];
                        if (nextLevel && nextLevel.items)
                            this._renderChildNodes(mapper, nextLevel, node.name, nodes, connectors, rootNodes, nodeTemplate, connectorTemplate);
                    }
                }
            }
        },

        _getNewNodes: function () {
            var nodes = [], connectors = [];
            for (var name in this.nameTable) {
                var node = this.nameTable[name];
                if (node && node.type === "connector" && node._status === "new") {
                    node._status = "";
                    connectors.push(node);
                }
                else if (node && node._status === "new") {
                    node._status = "";
                    nodes.push(node);
                }
            }
            return { nodes: nodes, connectors: connectors };
        },

        _getUpdatedNodes: function () {
            var nodes = [], connectors = [];
            for (var name in this.nameTable) {
                var node = this.nameTable[name];
                if (node && node.type === "connector" && node._status === "update") {
                    node._status = "";
                    connectors.push(node);
                }
                else if (node && node._status === "update") {
                    node._status = "";
                    nodes.push(node);
                }
            }
            return { nodes: nodes, connectors: connectors };
        },

        _getDeletedNodes: function () {
            var nodes = [], connectors = [];
            for (var i = 0; i < this._crudDeleteNodes.length; i++) {
                var node = this._crudDeleteNodes[i];
                if (node && node.type === "connector")
                    connectors.push(node);
                else if (node) {
                    nodes.push(node);
                }
            }
            this._crudDeleteNodes = [];
            return { nodes: nodes, connectors: connectors };
        },

        _isContainsSameConnector: function (connectors, sourceNode, targetNode) {
            if (sourceNode && targetNode) {
                for (var i = 0; i < connectors.length; i++) {
                    var connector = connectors[i];
                    if (connector && (connector.sourceNode === sourceNode && connector.targetNode === targetNode)) {
                        return true;
                    }
                }
            }
            return false;
        },
        _renderChildNodes: function (mapper, parent, ancestor, nodes, connectors, rootNodes, nodeTemplate, connectorTemplate) {
            var j, child, node, nextLevel;
            for (j = 0; j < parent.items.length; j++) {
                child = parent.items[j];
                node = this._applyNodeTemplate(mapper, child, nodeTemplate);
                var canBreak = false;
                if (!this._collectionContains(node.name, nodes))
                    nodes.push(node);
                else
                    canBreak = true;
                if (!this._isContainsSameConnector(connectors, ancestor, node.name))
                    connectors.push(this._applyConnectorTemplate(mapper, null, ancestor, node.name, connectorTemplate));
                if (!canBreak) {
                nextLevel = rootNodes[child[mapper.id]]
                if (nextLevel)
                    this._renderChildNodes(mapper, nextLevel, node.name, nodes, connectors, rootNodes, nodeTemplate, connectorTemplate);
            }            
            }
        },
        _applyTemplate: function (mapper, data, collection, collname) {
            var nodeTemplate, i, node, conn, connectorTemplate;
            if (this.model.nodeTemplate)
                nodeTemplate = this._getNodeTemplate();
            if (this.model.connectorTemplate)
                connectorTemplate = this._getConnectorTemplate();
            if (collname == "nodes") {
                for (i = 0; i < data.length; i++) {
                    node = this._applyNodeTemplate(mapper, data[i], nodeTemplate);
                    collection.push(node);
                }
            }
            if (collname == "connectors") {
                for (i = 0; i < data.length; i++) {
                    conn = this._applyConnectorTemplate(mapper, data[i], data[i].sourceNode, data[i].targetNode, connectorTemplate);
                    collection.push(conn);
                }
            }
        },

        _applyNodeTemplate: function (mapper, item, nodeTemplate) {
            var root = item;
            if (root.name === "" || !root.name)
                root.name = ej.datavisualization.Diagram.Util.randomId();
            if (root.type != "group")
                root = this._getNewNode(root);
            else
                root = this._getNewGroup(root);
            if (nodeTemplate) {
                nodeTemplate(this, root);
            }
            if (root._type === "group") {
                //root = this._getNewGroup(root);
                this._initGroupNode(root);
            }
            return root;
        },
        _applyConnectorTemplate: function (mapper, item, sourceNode, targetNode, connectorTemplate) {
            var connector = {};
            connector.name = item && item.name ? item.name : ej.datavisualization.Diagram.Util.randomId();
            connector.sourceNode = sourceNode;
            connector.targetNode = targetNode;
            connector = this._getNewConnector(connector);
            if (connectorTemplate) {
                connectorTemplate(this, connector);
            }
            return connector;
        },
        _collapseNodes: function (nodes) {
            var node;
            for (var i = 0; i < nodes.length; i++) {
                node = nodes[i];
                this._collapseChildren(node);
            }
        },
        //#endregion
        //#region Get elements
        _getNewNode: function (options) {
            if (options.shape && typeof options.shape === "object")
                ej.datavisualization.Diagram.Util._updateShapeProperties(options);
            return ej.datavisualization.Diagram.Node($.extend(true, {}, this.model.defaultSettings.node, options));
        },
        _getNewGroup: function (options) {
            var child = null, index = 0;
            if (options.type == "bpmn") options = ej.datavisualization.Diagram.Util._updateBpmnChild(ej.datavisualization.Diagram.Node(options), this);
            if (options.children && options.children.length > 0) {
                for (var i = 0; i < options.children.length; i++) {
                    child = this.nameTable[this._getChild(options.children[i])];
                    if (child) {
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[child.name], child);
                        ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, child);
                        if (child.segments) {
                            index = this.connectors().indexOf(child);
                            delete this.nameTable[child.name];
                            this.nameTable[child.name] = this._getNewConnector(child);
                            if (index >= 0) this.connectors()[index] = this.nameTable[child.name];
                            this._dock(this.nameTable[child.name], this.nameTable);
                            ej.datavisualization.Diagram.Util.updateBridging(this.nameTable[child.name], this);
                        } else if (child._type === "node") {
                            index = this.nodes().indexOf(child);
                            delete this.nameTable[child.name];
                            this.nameTable[child.name] = this._getNewNode(child);
                            if (index >= 0) this.nodes()[index] = this.nameTable[child.name];
                        } else if (child._type === "group") {
                            index = this.nodes().indexOf(child);
                            delete this.nameTable[child.name];
                            this.nameTable[child.name] = this._getNewGroup(child);
                            if (index >= 0) this.nodes()[index] = this.nameTable[child.name];
                        }
                    }
                }
            }
            return ej.datavisualization.Diagram.Group($.extend(false, {}, this.model.defaultSettings.group, options));
        },
        _isEmptyDiagramObject: function (obj) {
            if ($.isEmptyObject(obj))
                return true;
            else {
                for (var prop in obj) {
                    if (typeof obj[prop] === "object")
                        return this._isEmptyDiagramObject(obj[prop]);
                }
            }
            return false;

        },
        _getNewConnector: function (options) {
            var obj = $.extend(true, {}, this.model.defaultSettings.connector, options);
            if (this.model.layout && this.model.layout.type == "organizationalchart")
                obj = $.extend(true, {}, { segments: [{ type: "orthogonal" }] }, obj);
            if (this.model.defaultSettings.connector && (this.model.defaultSettings.connector.segments && this.model.defaultSettings.connector.segments[0])) {
                obj.defaultType = this.model.defaultSettings.connector.segments[0].type;
            }
            if (obj.shape && !this._isEmptyDiagramObject(obj.shape)) {
                if (obj.shape.type == "umlactivity") {
                    obj = ej.datavisualization.Diagram.UMLConnectorShape(obj);
                    if (obj.sourceNode)
                        var sourceNode = this.nameTable[obj.sourceNode];
                    if (obj.targetNode)
                        var targetNode = this.nameTable[obj.targetNode];
                    var node = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(targetNode, sourceNode, obj, this);
                    if (node)
                        obj.targetNode = node.name;
                    else
                        obj.targetNode = null;
                }
                if (obj.shape.type == "umlclassifier") {
                    obj = ej.datavisualization.Diagram.UMLConnectorShape(obj);
                    if (obj.sourceNode)
                        var sourceNode = this.nameTable[obj.sourceNode];
                    if (obj.targetNode)
                        var targetNode = this.nameTable[obj.targetNode];
                    var node = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(targetNode, sourceNode, obj, this);
                    if (node)
                        obj.targetNode = node.name;
                    else
                        obj.targetNode = null;
                }
                else {
                    obj.shape = $.extend(true, {}, ej.datavisualization.Diagram.ConnectorShapeDefaults, obj.shape);
                    if (obj.shape.flow == "sequence") {
                        if (obj.shape.sequence == "normal")
                            obj = $.extend(true, {}, { segments: [{ type: "straight" }], targetDecorator: { shape: "arrow" }, lineWidth: 2 }, obj);
                        if (obj.shape.sequence == "conditional") {
                            obj = $.extend(true, {}, { segments: [{ type: "straight" }], targetDecorator: { shape: "arrow" }, lineWidth: 2 }, obj);
                            obj.sourceDecorator = { shape: "diamond", fillColor: "white", width: 20, height: 10 };
                        }
                        if (obj.shape.sequence == "default")
                            obj = $.extend(true, { segments: [{ type: "straight" }], targetDecorator: { shape: "arrow" }, lineWidth: 2 }, obj);
                    }
                    if (obj.shape.flow == "association") {
                        if (obj.shape.association == "directional")
                            obj = $.extend(true, {}, { segments: [{ type: "straight" }], lineWidth: 2, lineDashArray: "2 2", targetDecorator: { shape: "openarrow", width: 5, height: 10 } }, obj);
                        if (obj.shape.association == "nondirectional")
                            obj = $.extend(true, {}, { segments: [{ type: "straight" }], lineWidth: 2, lineDashArray: "2 2", targetDecorator: { shape: "none" } }, obj);
                        if (obj.shape.association == "bidirectional") {
                            obj = $.extend(true, {}, { segments: [{ type: "straight" }], lineWidth: 2, lineDashArray: "2 2", targetDecorator: { shape: "openarrow", width: 5, height: 10 } }, obj);
                            obj.sourceDecorator = { shape: "openarrow", width: 5, height: 10 };
                        }
                    }
                    if (obj.shape.flow == "message") {
                        obj = $.extend(true, {}, { segments: [{ type: "straight" }], sourceDecorator: { shape: "circle", fillColor: "white" }, targetDecorator: { shape: "arrow", fillColor: "white" }, lineWidth: 2, lineDashArray: "4 4" }, obj);
                    }
                }

            }

            ej.datavisualization.Diagram.Util._initConnectionEnds(obj, this);
            return ej.datavisualization.Diagram.Connector(obj);
        },
        //#endregion
        _setOverview: function (overview, id) {
            if (overview) {
                this._overview = overview;
                this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
                if (!this._views[overview._id]) {
                    this._views.push(overview._id);
                    this._views[overview._id] = { "context": ej.datavisualization.Diagram.SvgContext, "type": "overview" };
                    overview._renderDocument(this._views[overview._id]);
                    var view = this._views[overview._id];
                    var nodes = this._setNodeZOrder(view);
                    this._renderDiagramObjects(nodes, view, null, true);
                    overview._updateOverview(view);
                }
                delete this._viewPort;
            } else {
                overview = $("#" + id).ejOverview("instance");
                overview._removeDocument(this._views[id]);
                this._views[id] = undefined;
                var index = this._views.indexOf(id);
                this._views.splice(index, 1);
                //this._overview = null;
            }
        },
        _updateScrollOffset: function (hScrollOffset, vScrollOffset, canScale) {
            this._hScrollOffset = Number(hScrollOffset);
            this._vScrollOffset = Number(vScrollOffset);
            this._verticalOffset(Number(vScrollOffset));
            this._horizontalOffset(Number(hScrollOffset));
            this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            ej.datavisualization.Diagram.ScrollUtil._transform(this, hScrollOffset, vScrollOffset, canScale);
            var diagram = this;
            this._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                if (view.type == "overview") {
                    var ovw = $("#" + viewid).ejOverview("instance");
                    if (ovw)
                        ovw._scrollOverviewRect(hScrollOffset, vScrollOffset, diagram._currZoom);
                }
            });
            this.model.scrollSettings.viewPortHeight = this._viewPort.height;
            this.model.scrollSettings.viewPortWidth = this._viewPort.width;
            this.model.scrollSettings.currentZoom = this._currZoom;
        },
        _getChild: function (child) {
            return ej.datavisualization.Diagram.Util.getChild(child);
        },
        _getChildren: function (children) {
            if (children) {
                var children1 = [];
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    if (child) {
                        if (typeof (child) == "object") {
                            children1.push(child.name);
                        } else {
                            children1.push(child);
                        }
                    }
                }
                return children1;
            }
        },
        _initGroupNode: function (group, childTable) {
            var child = null, childNode;
            for (var i = 0; group.children && i < group.children.length; i++) {
                childNode = childTable ? $.extend(true, {}, childTable[this._getChild(group.children[i])]) : group.children[i];
                child = typeof childNode == "string" ? this.nameTable[childNode] : childNode;
                if (child) {
                    if (!child._type && child.type == "umlclassifier")
                        child._type = "group";
                    if (child.container) {
                        child._type = "group"
                        child.labels = child.labels || [];
                    }
                    if (childNode && typeof (childNode) == "object") {
                        if (typeof child.shape !== "object" && group.type != "bpmn")
                            child = ej.datavisualization.Diagram.NodeType(child, this);
                        if (child._type != "group" && !child.children && !child.segments && child.type != "connector") {
                            if (group.type != "bpmn" && group.type != "umlclassifier") {
                                var extendChild = false;
                                if (group.parent) {
                                    var parent1 = this.getNode(group.parent);
                                    if (parent1 && ((parent1.subProcess && parent1.subProcess.events.length > 0) || (parent1.task && parent1.task.events.length > 0))) {
                                        extendChild = true;
                                    }
                                }
                                if (!extendChild) {
                                    child = this._getNewNode(child);
                                }
                            }
                            if (child.name == "")
                                child.name = ej.datavisualization.Diagram.Util.randomId();
                            if (child._type == "node" && child.labels.length && (child.width == 0 || child.height == 0))
                                this._getNodeDimension(child);
                        }
                        else if (child.segments || child.type == "connector") {
                            child = this._getNewConnector(child);
                            if (child.name == "") {
                                child.name = ej.datavisualization.Diagram.Util.randomId();
                            }
                        }
                        else {
                            child = this._getNewGroup(child);
                            if (child.name == "") {
                                child.name = ej.datavisualization.Diagram.Util.randomId();
                            }
                            this._initGroupNode(child);
                        }
                        group.children[i] = child;
                        child.parent = group.name;
                        this.nameTable[child.name] = child;
                        if (child.segments)
                            this._dock(child, this.nameTable);
                    }
                    this._updateQuad(this.nameTable[this._getChild(group.children[i])]);
                }
            }
            if (!this._isLoad) {
                ej.datavisualization.Diagram.Util._updateGroupBounds(group, this);
            }
            else if (group.parent) {
                var parentNode = this.findNode(group.parent);
                if (parentNode.subProcess.events.length > 0 || parentNode.task.events.length > 0) {
                    ej.datavisualization.Diagram.Util._updateGroupBounds(group, this);
                }
            }
        },
        _udpateChildRotateAngle: function (group) {
            var pinx, piny, child;
            if (group.rotateAngle) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, group.rotateAngle, group.offsetX, group.offsetY);
                for (var i = 0; i < group.children.length; i++) {
                    child = this.nameTable[this._getChild(group.children[i])];
                    child.rotateAngle = child.rotateAngle ? child.rotateAngle + group.rotateAngle : group.rotateAngle;
                    child.rotateAngle %= 360;
                    if (child.rotateAngle < 0) child.rotateAngle += 360;
                    if (!(child.segments)) {
                        if (child.type == "group") this._udpateChildRotateAngle(child);
                        var pinx = child.offsetX;
                        piny = child.offsetY;
                        var actualpt = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(pinx, piny));
                        this._translate(child, actualpt.x - pinx, actualpt.y - piny, this.nameTable);
                        this._updateAssociatedConnectorEnds(child, this.nameTable);
                    } else {
                        if (!child.sourceNode)
                            this._setEndPoint(child, ej.Matrix.transform(matrix, child.sourcePoint), false);
                        if (!child.targetNode)
                            this._setEndPoint(child, ej.Matrix.transform(matrix, child.targetPoint), true);
                    }
                }
            }
        },
        _getNodeDimension: function (node) {
            var prevWidth = node._width, prevHeight = node._height;
            var width = node.width ? node.width : (node.maxWidth ? node.maxWidth : node.minWidth);
            var text = document.createElement("span");
            var w = 0, h = 0, label, i;
            if (node.labels.length) {
                ej.datavisualization.Diagram.Util.attr(text, { "id": node.name + "_label", "class": "ej-d-label", "style": "display: inline-block; position: absolute; pointer-events: all; line-height: normal;" });
                this.element[0].appendChild(text);
                for (i = 0; i < node.labels.length; i++) {
                    label = node.labels[i];
                    if (label.bold) text.style.fontWeight = "bold";
                    if (label.italic) text.style.fontStyle = "italic";
                    text.style.textDecoration = label.textDecoration;
                    text.style.fontFamily = label.fontFamily;
                    text.style.fontSize = label.fontSize + "px";
                    text.style.color = label.fontColor;
                    text.style.backgroundColor = label.fillColor;
                    text.style.borderColor = label.borderColor;
                    text.style.borderWidth = label.borderWidth + "px";
                    text.textContent = label.text;
                    if (label.wrapping == "nowrap") {
                        text.style.whiteSpace = "nowrap";
                        text.style.wordWrap = "normal";
                    } else {
                        if (label.wrapping == "wrap") {
                            text.style.wordBreak = "break-all";
                        }
                        text.style.wordWrap = "break-word";
                        text.style.whiteSpace = "pre";

                    }
                    if (node.maxWidth) text.style.maxWidth = width - (label.margin.left + label.margin.right) - label.fontSize + "px";
                    if (node.minWidth) text.style.minWidth = width - (label.margin.left + label.margin.right) - label.fontSize + "px";
                    w += text.offsetWidth + label.margin.left + label.margin.right + 5;
                    h += text.offsetHeight + label.margin.top + label.margin.bottom;
                }
                var type = node.name.match("_attribute") ? "attribute" : (node.name.match("_method") ? "method" : (node.name.match("_member") ? "member" : "header"));
                node._width = Math.max(node.minWidth || 0, w || 0);
                if (node.maxWidth) node._width = Math.min(node.maxWidth, node._width);
                node._height = Math.max(node.minHeight || 0, h || 0);
                if (node.maxHeight) node._height = Math.min(node.maxHeight, node._height);
                if (!node.width && node.labels[0].horizontalAlignment == "left" && type != "attribute" && type != "method" && type != "member") node.offsetX += (node._width - prevWidth) / 2;
                if (!node.width && node.labels[0].horizontalAlignment == "right") node.offsetX -= (node._width - prevWidth) / 2;
                if (!node.height && node.labels[0].verticalAlignment == "top") node.offsetY += (node._height - prevHeight) / 2;
                if (!node.height && node.labels[0].verticalAlignment == "bottom") node.offsetY -= (node._height - prevHeight) / 2;
                if (node.parent) var parent = this.nameTable[node.parent];
                this.element[0].removeChild(text);
            }
        },
        _getMinMaxSize: function (node, width, height, stretch, isExeed) {
            var nw = null, nh = null;
            if (width >= node.minWidth && width <= node.maxWidth) {
                nw = width;
            } else {
                if (node.horizontalAlign == "stretch" && node.parent && !stretch && !isExeed) {
                    var group = this.nameTable[node.parent];
                    if (group) {
                        var rSize = ej.datavisualization.Diagram.Util.bounds(group); // ej.datavisualization.Diagram.SvgContext._measureCanvasSize(group, this);
                        if (rSize.width == 0 && rSize.height == 0) {
                            rSize.width = width;
                            rSize.height = height;
                        }
                        var newSize = this._getMinMaxSize(group, rSize.width, rSize.height);
                        if (group.isSwimlane && group.orientation == "vertical") {
                            var head = this.nameTable[this._getChild(group.children[0])];
                            if (head)
                                newSize.height -= head.height;
                        }
                        newSize.width -= (group.paddingLeft + group.paddingRight + group.marginLeft + group.marginRight);
                        newSize.height -= (group.paddingTop + group.paddingBottom + group.marginTop + group.marginBottom);
                        nw = newSize.width ? newSize.width : width;
                    }
                }
                else if (isExeed) {
                    var group = this.nameTable[node.parent];
                    if (group) {
                        var rSize = ej.datavisualization.Diagram.Util.bounds(group); // ej.datavisualization.Diagram.SvgContext._measureCanvasSize(group, this);
                        var newSize = this._getMinMaxSize(group, rSize.width, rSize.height);
                        nw = newSize.width ? newSize.width : width;
                    }
                }
                else if (width < node.minWidth && node.minWidth != 0)
                    nw = node.minWidth;
                else if (width > node.maxWidth && node.maxWidth != 0 && !node.isSwimlane)
                    nw = node.maxWidth;
                else
                    nw = width;
            }
            if (height >= node.minHeight && height <= node.maxHeight) {
                nh = height;
            } else {
                var group = this.nameTable[node.parent];
                if (node.verticalAlign == "stretch" && node.parent && !stretch && !node.isLane) {
                    var rSize = ej.datavisualization.Diagram.Util.bounds(group);
                    if (rSize.width == 0 && rSize.height == 0) {
                        //rSize.width = width;
                        //rSize.height = height;
                        var status = null;
                        var state = false;
                        rSize.width = node.minWidth;
                        rSize.height = node.minHeight;
                        if (node.minWidth == 0 || node.minHeight == 0) {
                            rSize.width = width;
                            rSize.height = height;
                            status = false;
                            state = true;
                        }
                        if (!state)
                            status = true;
                    }
                    var newSize = this._getMinMaxSize(group, rSize.width, rSize.height);
                    newSize.width -= (group.paddingLeft + group.paddingRight + group.marginLeft + group.marginRight);
                    newSize.height -= (group.paddingTop + group.paddingBottom + group.marginTop + group.marginBottom);
                    if (status) {
                        newSize.height -= node.marginTop;

                    }
                    nh = newSize.height ? newSize.height : height;
                } else if (height < node.minHeight && node.minHeight != 0)
                    nh = node.minHeight;
                else if (height > node.maxHeight && node.maxHeight != 0)
                    nh = node.maxHeight;
                else
                    nh = height;
            }
            return { width: nw, height: nh };
        },
        _updateConnectorBridging: function (baseConnector) {
            var intersectingConnectors = [];
            this.boundaryTable[baseConnector.name] = ej.datavisualization.Diagram.Util.bounds(baseConnector);
            if (baseConnector._intersects && baseConnector._intersects.length)
                intersectingConnectors = baseConnector._intersects;
            for (var q = 0; q < intersectingConnectors.length; q++) {
                var connector = this.nameTable[intersectingConnectors[q]];
                if (connector && connector.visible) {
                    if (connector.segments) {
                        if (connector != baseConnector && ej.datavisualization.Diagram.Util.canBridge(connector, this)) {
                            ej.datavisualization.Diagram.Util.updateBridging(connector, this, [baseConnector]);
                            if (!this._disableSegmentChange)
                                ej.datavisualization.Diagram.DiagramContext._refreshOnlySegments(connector, this);
                        }
                    }
                }
            }
        },
        _drawToolShape: function (type, args) {
            if (type == "image" || type == "native" || type == "html" || type === "text" || type === "basic" || type === "flow" || type === "arrow" || type === "bpmn" || this.activeTool._isPolyline()) {
                this.activateTool("shapeTool", args);
            }
            else if (type == "straightLine") {
                this.activateTool("straightLine", args);
            }
            else if (type == "orthogonalLine") {
                this.activateTool("orthogonalLine", args);
            }
            else if (type == "bezierLine") {
                this.activateTool("bezierLine", args);
            }
        },
        _destroy: function () {
            this.element.empty().removeClass("e-datavisualization-diagram");
            if (this.enableContextMenu()) {
                var menuObj = $("#" + this.element[0].id + "_contextMenu").data("ejMenu");
                menuObj.destroy();
            }
            $("#" + this.element[0].id + "_contextMenu").remove();
        },
        //#endregion      
        _updateRuler: function (option, ruler) {
            var object = {}
            if (option.interval)
                object.interval = option.interval;
            if (option.segmentWidth)
                object.segmentWidth = option.segmentWidth;
            if (option.tickAlignment)
                object.tickAlignment = option.tickAlignment;
            if (option.markerColor)
                object.markerColor = option.markerColor;
            if (option.thickness)
                object.thickness = option.thickness;
            if (option.arrangeTick)
                object.arrangeTick = option.arrangeTick;
            if (!$.isEmptyObject(object))
                $("#" + ruler[0].id).ejRuler(object)
        },
        _updateRulerSettings: function (option) {
            this.updateViewPort();
            if (option.showRulers != undefined ||
                ((option.horizontalRuler && option.horizontalRuler.thickness) || (option.verticalRuler && option.verticalRuler.thickness))) {
                this._svgParentDimention = null;
                this._initViews(true);
                this._initCanvas(true);
            } if (option.horizontalRuler)
                this._updateRuler(option.horizontalRuler, this._hRuler);
            if (option.verticalRuler)
                this._updateRuler(option.verticalRuler, this._vRuler);
            ej.datavisualization.Diagram.SvgContext._updateGrid(this._hScrollOffset, this._vScrollOffset, this._currZoom, this);
            ej.datavisualization.Diagram.ScrollUtil._updateRuler(this, this._hScrollOffset, this._vScrollOffset);
        },
        _updateScrollSettings: function (option) {
            var isLimited = this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Limited ? true : false;
            var scrollableArea = this.model.pageSettings.scrollableArea;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            if (option.horizontalOffset !== undefined || option.verticalOffset !== undefined) {
                var oVal = {
                    zoom: this._getCurrentZoom(), horizontalOffset: this._hScrollOffset,
                    verticalOffset: this._vScrollOffset, viewPort: viewPort
                };
                if ((option.horizontalOffset !== undefined)) {
                    var hValue = Number((typeof option.horizontalOffset === 'function' ? option.horizontalOffset() : option.horizontalOffset));
                    if (!isLimited || (hValue >= scrollableArea.x && hValue <= scrollableArea.x + scrollableArea.width)) {
                        if (this._scrollLimit() == "diagram") {
                            hValue = Math.max(this._hScrollbar.model.minimum, hValue);
                            hValue = Math.min(this._hScrollbar.model.maximum, hValue);
                        }
                        this._updateScrollOffset(hValue, this._verticalOffset());
                    }
                }
                if ((option.verticalOffset !== undefined)) {
                    var vValue = Number((typeof option.verticalOffset === 'function' ? option.verticalOffset() : option.verticalOffset));
                    if (!isLimited || (vValue >= scrollableArea.y && vValue <= scrollableArea.y + scrollableArea.height)) {
                        if (this._scrollLimit() == "diagram") {
                            vValue = Math.max(this._vScrollbar.model.minimum, vValue);
                            vValue = Math.min(this._vScrollbar.model.maximum, vValue);
                        }
                        this._updateScrollOffset(this._horizontalOffset(), vValue);
                    }
                }
                var nVal = {
                    zoom: this._getCurrentZoom(), horizontalOffset: this._hScrollOffset,
                    verticalOffset: this._vScrollOffset, viewPort: viewPort
                };
                this._raiseEvent("scrollChange", { newValues: nVal, oldValues: oVal });
            }
            if (option.zoomFactor)
                this.zoomFactor((typeof option.zoomFactor === 'function' ? option.zoomFactor() : option.zoomFactor));
            if (option.padding) {
                $.extend(this.model.scrollSettings.padding, option.padding);
                this._updateScrollOffset(this._horizontalOffset(), this._verticalOffset());
            }

        },
        updatePageSettings: function (option) {
            if (option) {
                var oldValue = $.extend(true, {}, this.model.pageSettings);
                if (option.pageHeight) {
                    this._pageHeight(Number(typeof option.pageHeight === 'function' ? option.pageHeight() : option.pageHeight));
                }
                if (option.pageWidth) {
                    this._pageWidth(Number(typeof option.pageWidth === 'function' ? option.pageWidth() : option.pageWidth));
                }
                if (typeof option.multiplePage === 'function' || typeof option.multiplePage === "boolean") {
                    this._multiplePage(typeof option.multiplePage === 'function' ? option.multiplePage() : option.multiplePage);
                }
                if (typeof option.showPageBreak === 'function' || typeof option.showPageBreak === "boolean") {
                    this._showPageBreak(typeof option.showPageBreak === 'function' ? option.showPageBreak() : option.showPageBreak);
                }
                if (option.pageBorderColor || option.pageBorderColor === "") {
                    this._pageOrientation(typeof option.pageOrientation === 'function' ? option.pageOrientation() : option.pageOrientation);
                }
                if (option.pageBorderWidth || option.pageBorderWidth === 0) {
                    this._pageBorderWidth(Number(typeof option.pageBorderWidth === 'function' ? option.pageBorderWidth() : option.pageBorderWidth));
                }
                if (option.pageMargin || option.pageMargin === 0) {
                    this._pageMargin(Number(typeof option.pageMargin === 'function' ? option.pageMargin() : option.pageMargin));
                }
                if (option.pageBackgroundColor || option.pageBackgroundColor === "") {
                    this._pageBackgroundColor(typeof option.pageBackgroundColor === 'function' ? option.pageBackgroundColor() : option.pageBackgroundColor);
                }
                if (option.scrollLimit) {
                    this._scrollLimit(typeof option.scrollLimit === 'function' ? option.scrollLimit() : option.scrollLimit);
                }
                if (option.scrollableArea) {
                    this.model.pageSettings.scrollableArea = option.scrollableArea;
                }
                if (option.pageBorderColor || option.pageBorderColor === "") {
                    this._pageBorderColor(typeof option.pageBorderColor === 'function' ? option.pageBorderColor() : option.pageBorderColor);
                }
                this._compareModelProperty("pageSettings");
                if (!this._isUndo)
                    this.addHistoryEntry({ type: "pagesettingschanged", undoObject: oldValue, category: "internal", redoObject: $.extend(true, {}, this.model.pageSettings) });
                ej.datavisualization.Diagram.PageUtil._updatePageSize(this);
                ej.datavisualization.Diagram.SvgContext._updateBackground(this._hScrollOffset, this._vScrollOffset, this._currZoom, this);
                ej.datavisualization.Diagram.SvgContext._updateGrid(this._hScrollOffset, this._vScrollOffset, this._currZoom, this);
            }
        },
        _updateSnapSettings: function (option) {
            if (option) {
                if (option.horizontalGridLines && option.horizontalGridLines.linesInterval)
                    this.model.snapSettings.horizontalGridLines.linesInterval = option.horizontalGridLines.linesInterval;
                if (option.verticalGridLines && option.verticalGridLines.linesInterval)
                    this.model.snapSettings.verticalGridLines.linesInterval = option.verticalGridLines.linesInterval;
                if (option.snapAngle) {
                    this._snapAngle(Number(typeof option.snapAngle === 'function' ? option.snapAngle() : option.snapAngle));
                }
                if (option.snapObjectDistance) {
                    this._snapObjectDistance(Number(typeof option.snapObjectDistance === 'function' ? option.snapObjectDistance() : option.snapObjectDistance));
                }
            }
        },
        //#region Public methods
        _cloneObject: function (node) {
            if ((this.getObjectType(node) === "node" || this.getObjectType(node) === "connector") && node.type != "bpmn") {
                node = $.extend(true, {}, node);
                return node;
            }
            else if ((this.getObjectType(node) === "group" || node.type === "bpmn") && !node.isSwimlane) {
                var group = ($.extend(true, {}, node));
                for (var i = 0; group.children && group.children.length > 0 && i < group.children.length; i++) {
                    group.children[i] = this._cloneObject(this.nameTable[this._getChild(group.children[i])]);
                    group.children[i].parent = group.name;
                }
                return group;
            }
            else if (this.getObjectType(node) === "group" && node.isSwimlane) {
                var swmlnObj = this.getNode(node);
                return swmlnObj;
            }
        },
        _cloneSelectionList: function () {
            var obj = [];
            for (var i = 0 && this.selectionList && this.selectionList.length > 0; i < this.selectionList.length; i++) {
                if (this.getObjectType(this.selectionList[i]) === "pseudoGroup") {
                    var pGroup = this.selectionList[0];
                    for (var j = 0 ; pGroup.children && pGroup.children.length > 0 && j < pGroup.children.length; j++) {
                        obj.push(this._cloneObject(this.nameTable[this._getChild(pGroup.children[j])]));
                    }
                }
                else {
                    obj.push(this._cloneObject(this.selectionList[i]));
                }
            }
            return obj;
        },
        getNode: function (name, childTable) {
            if (name) {
                return this._getNode(name, childTable);
            }
        },
        addPhase: function (name, options) {
            this._addPhase(name, options);
        },
        stopEvents: function (evt) {
            if (this.activeTool.inAction) {
                if (!evt.originalEvent.target && evt.target) {
                    evt.originalEvent.target = evt.target;
                    this._mouseup(evt);
                }
            }
        },
        _updateSwimlanePhase: function (phase, options, selupdate, updateChildren) {
            if (phase && options) {
                if (options.label) {
                    var psStkNode = this.nameTable[phase.name];
                    if (psStkNode) {
                        this._comparePropertyValues(phase, "label", options);
                        options.label = $.extend(true, {}, options.label);
                        options.label.rotateAngle = (options.orientation === "vertical") ? 270 : 0;
                        options.label.name = psStkNode.labels[0].name;
                        options.label.mode = ej.datavisualization.Diagram.LabelEditMode.View
                        phase.label = options.label;
                        this.updateLabel(psStkNode.name, psStkNode.labels[0], phase.label);
                    }
                }
                if (options.lineColor || options.lineDashArray || options.lineWidth) {
                    var attr = {}
                    if (options.lineColor) {
                        this._comparePropertyValues(phase, "lineColor", options);
                        phase.lineColor = options.lineColor;
                        attr["stroke"] = options.lineColor;
                    }
                    if (options.lineDashArray) {
                        this._comparePropertyValues(phase, "lineDashArray", options);
                        phase.lineDashArray = options.lineDashArray;
                        attr["stroke-dasharray"] = options.lineDashArray;
                    }
                    if (options.lineWidth) {
                        this._comparePropertyValues(phase, "lineWidth", options);
                        phase.lineWidth = options.lineWidth;
                        attr["stroke-width"] = options.lineWidth;
                    }

                    ej.datavisualization.Diagram.SvgContext._updatePhaseStyle(phase, attr, this);
                }
                if (options.fillColor) {
                    this._comparePropertyValues(phase, "fillColor", options);
                    phase.fillColor = options.fillColor;
                    ej.datavisualization.Diagram.DiagramContext.updateNodeStyle(phase, this);
                }
            }
        },
        _updateNodeVisibility: function (node, options) {
            if (node) {
                if (node.type === "group") {
                    for (var i = 0; i < node.children.length; i++) {
                        var child = this.nameTable[this._getChild(node.children[i])];
                        if (child)
                            this._updateNodeVisibility(child, options);
                    }
                }
                if (node.isSwimlane) {
                    var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, node);
                    if (phases) {
                        for (var i = 0; i < phases.length; i++) {
                            var phase = this.nameTable[this._getChild(phases[i])];
                            phase.visible = options.visible;
                            ej.datavisualization.Diagram.SvgContext._updatePhaseStyle(phase, options, this);
                        }
                    }
                }
                node.visible = options.visible;
            }
        },

        _compareInnerProperties: function (sElement, tElement) {
            var state = true;
            if (sElement && tElement)
                for (var k in tElement) {
                    if (typeof (sElement[k]) === "object") {
                        state = this._compareInnerProperties(sElement[k], tElement[k]);
                        if (!state)
                            return false;
                    }
                    else if (sElement[k] !== tElement[k])
                        return false
                }
            return true;
        },
        _comparePropertyValues: function (element, property, options, interaction, root) {
            if (element) {
                var resource = null;
                var srobject = element;
                var trobject = options;
                var prCol = property.split(".");
                var prlength = prCol.length;
                if (prlength > 1) {
                    var i = 0;
                    while (prlength > i) {
                        srobject = srobject[prCol[i]]
                        trobject = trobject[prCol[i]]
                        i++;
                        if (srobject && trobject) {
                            if (i == (prlength - 1)) {
                                if (srobject[prCol[i]] != trobject[prCol[i]]) {
                                    resource = {
                                        element: element,
                                        cause: root ? root : (interaction ? ej.datavisualization.Diagram.ActionType.Mouse : ej.datavisualization.Diagram.ActionType.Unknown),
                                        propertyName: prCol[0],
                                        oldValue: srobject,
                                        newValue: trobject
                                    };
                                    this._raisePropertyChange(resource);
                                }
                            }
                        }
                        else
                            break;
                    }
                }
                else {
                    resource = {
                        cause: root ? root : (interaction ? ej.datavisualization.Diagram.ActionType.Mouse : ej.datavisualization.Diagram.ActionType.Unknown),
                        propertyName: property,
                        oldValue: element[property],
                        newValue: options[property]
                    };
                    if ((property !== "labels" && property !== "ports" && property !== "segments") && ((typeof (element[property]) === "object" && !this._compareInnerProperties(element[property], options[property])) || !element[property] || (typeof (element[property]) !== "object" && element[property] != options[property]))) {
                        resource.element = element;
                    }
                    else if (property === "segments") {
                        if (element[property] != options[property]) {
                            resource.element = element;
                        }
                    }
                    else if (property === "labels" || property === "ports") {
                        if (element[property].length > 0) {
                            if (property === "ports")
                                var obj = this._findPort(element, options.name);
                            else
                                obj = this._findLabel(element, options.name);
                            if (!this._compareInnerProperties(obj, options)) {
                                resource.element = obj;
                                resource.oldValue = obj,
                                resource.newValue = options

                            }
                        }
                    }
                    if (resource.element)
                        this._raisePropertyChange(resource);
                }
            }
        },
        updateNode: function (name, options) {
            if (name) {
                var node = this._findNode(name);
                var matrix = ej.Matrix.identity();
                var bounds, dx, dy, pt;
                var groupAction = false;
                var nodeConstraints = ej.datavisualization.Diagram.NodeConstraints;
                var cont = (node && (node.isSwimlane || node.isLane || node.isPhase || node.type === "phase"));
                if ((cont) || !cont) { // if ((cont && this._needUpdate) || !cont) {
                    this._needUpdate = false;
                    var resource = null;
                    if (node) {
                        if ((node.isSwimlane || node.isLane) && options.header) {
                            var headerObject = options.header;
                            delete options.header;
                            this.model.historyManager.startGroupAction();
                            groupAction = true;
                        }
                        if (!this._isUndo && !this._isSizingCommand)
                            this._recordPropertiesChanged(node, options, "node");
                        if (options.pivot != undefined) {
                            bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                            ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                            if (options.pivot.x !== undefined) {
                                this._comparePropertyValues(node, "pivot.x", options);
                                var difx = options.pivot.x - node.pivot.x;
                                node.pivot.x = options.pivot.x;
                                node.offsetX += difx * (node.width || node._width || 0);
                            }
                            if (options.pivot.y !== undefined) {
                                this._comparePropertyValues(node, "pivot.y", options);
                                var dify = options.pivot.y - node.pivot.y;
                                node.pivot.y = options.pivot.y;
                                node.offsetY += dify * (node.height || node._height || 0);
                            }
                            pt = ej.Matrix.transform(matrix, { x: node.offsetX, y: node.offsetY });
                            node.offsetX = pt.x;
                            node.offsetY = pt.y;
                        }
                        if (options.offsetX != undefined) {
                            dx = options.offsetX - node.offsetX;
                            if (this._outOfBoundsOnNudge(node, dx, 0)) {
                                resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "offsetX", oldValue: node.offsetX, newValue: node.offsetX + dx };
                                this._raisePropertyChange(resource);
                                this._translate(node, dx, 0, this.nameTable);
                                if (node.marginLeft != 0) node.marginLeft += dx;
                            }
                        }
                        if (options.offsetY != undefined) {
                            dy = options.offsetY - node.offsetY;
                            if (this._outOfBoundsOnNudge(node, 0, dy)) {
                                resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "offsetY", oldValue: node.offsetY, newValue: node.offsetY + dy }
                                this._raisePropertyChange(resource);
                                this._translate(node, 0, dy, this.nameTable);
                                if (node.marginTop != 0) node.marginTop += dy;
                            }
                        }
                        if (options.rotateAngle != undefined) {
                            this._comparePropertyValues(node, "rotateAngle", options);
                            this._rotate(node, options.rotateAngle - node.rotateAngle, this.nameTable);
                        }
                        if (!node.isSwimlane && !node.isLane) {
                            var tool = this.tools["resize"];

                            if (options.width != undefined) {
                                node.width = node.width ? node.width : 1;
                                resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "width", oldValue: node.width, newValue: options.width };
                                this._raisePropertyChange(resource);
                                var swimchild = false;
                                var parsemin = !node.isLane ? false : true;
                                if (tool._outOfBoundsDrag(node, options.width / node.width, 1, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY))) {
                                    this.scale(node, options.width / node.width, 1, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), this.nameTable, swimchild, parsemin);
                                    if (node.type === "bpmn" && node._type === "group")
                                        ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                                }
                            }
                            if (options.height != undefined) {
                                node.height = node.height ? node.height : 1;
                                resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "height", oldValue: node.height, newValue: options.height };
                                this._raisePropertyChange(resource);
                                var swimchild = false;
                                var parsemin = !node.isLane ? false : true;
                                if (tool._outOfBoundsDrag(node, 1, options.height / node.height, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY))) {
                                    this.scale(node, 1, options.height / node.height, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), this.nameTable, swimchild, parsemin);
                                    if (node.type === "bpmn" && node._type === "group")
                                        ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                                }
                            }
                        }
                        else
                            this._updateSwimlaneSize(node, options);
                        if (options.connectorPadding != undefined) {
                            this._comparePropertyValues(node, "connectorPadding", options);
                            node.connectorPadding = options.connectorPadding;
                            this.scale(node, 1, 1, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), this.nameTable);
                        }
                        if (options.visible != undefined) {
                            this._comparePropertyValues(node, "visible", options);
                            this._updateNodeVisibility(node, options);
                            if (!options.visible)
                                this._clearSelection();
                        }
                        if (options.constraints != undefined) {
                            this._comparePropertyValues(node, "constraints", options);
                            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                                if (node._type != "group" || node.type === "bpmn") {
                                    if (node.constraints & nodeConstraints.Shadow || options.constraints & nodeConstraints.Shadow) {
                                        if (!(node.constraints & nodeConstraints.Shadow) && (options.constraints & nodeConstraints.Shadow)) {
                                            node.constraints = options.constraints;
                                            if (node.type === "bpmn" && node.children && (node.shape != "group")) {
                                                ej.datavisualization.Diagram.DiagramContext.updateBPMNNodeStyle(node, this);
                                                ej.datavisualization.Diagram.DiagramContext.renderShadow(this.nameTable[this._getChild(node.children[0])], this);
                                            }
                                            else
                                                ej.datavisualization.Diagram.DiagramContext.renderShadow(node, this);
                                        }
                                        else if ((node.constraints & nodeConstraints.Shadow) && !(options.constraints & nodeConstraints.Shadow)) {
                                            node.constraints = options.constraints;
                                            ej.datavisualization.Diagram.DiagramContext.removeShadow(node, this);
                                        }
                                    }
                                }
                                node.constraints = options.constraints;
                                if (this.selectionList[0] && this.selectionList[0].name === node.name) {
                                    if (ej.datavisualization.Diagram.Util.canSelect(this.selectionList[0])) {
                                        ej.datavisualization.Diagram.SvgContext.clearSelector(this._adornerSvg, this._adornerLayer, this);

                                        ej.datavisualization.Diagram.SvgContext.renderSelector(this.selectionList[0], this._adornerSvg, this._adornerLayer, this._currZoom, this.model.selectedItems.constraints, undefined, this);
                                        if (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                                            ej.datavisualization.Diagram.SvgContext.renderUserHandles(this.model.selectedItems.userHandles, this.selectionList[0], this._adornerSvg, this.selectionList[0].type === "pseudoGroup",
                                                this._currZoom, this._adornerLayer, this);
                                    }
                                    else this._clearSelection(true);
                                }
                            }
                        }
                        if (options.fillColor != undefined) {
                            this._comparePropertyValues(node, "fillColor", options);
                            node.fillColor = options.fillColor;
                        }
                        if (options.cssClass != undefined) {
                            this._comparePropertyValues(node, "cssClass", options);
                            node.cssClass = options.cssClass;
                        }
                        if (options.opacity != undefined) {
                            this._comparePropertyValues(node, "opacity", options);
                            node.opacity = options.opacity;
                        }
                        if (options.borderColor != undefined) {
                            this._comparePropertyValues(node, "borderColor", options);
                            node.borderColor = options.borderColor;
                        }
                        if (options.borderWidth != undefined) {
                            this._comparePropertyValues(node, "borderWidth", options);
                            node.borderWidth = options.borderWidth;
                        }
                        if (options.borderDashArray != undefined) {
                            this._comparePropertyValues(node, "borderDashArray", options);
                            node.borderDashArray = options.borderDashArray;
                        }
                        if (options.shadow != undefined) {
                            this._comparePropertyValues(node, "shadow", options);
                            if (node.type === "bpmn" && node.children && (node.shape != "group")) {
                                node.children[0].shadow = ej.datavisualization.Diagram.Shadow($.extend(true, node.children[0].shadow, {}, options.shadow));
                                ej.datavisualization.Diagram.DiagramContext.updateShadow(node.children[0], this);
                            }
                            else {
                                node.shadow = ej.datavisualization.Diagram.Shadow($.extend(true, node.shadow, {}, options.shadow));
                                ej.datavisualization.Diagram.DiagramContext.updateShadow(node, this);
                            }
                        }
                        if (options.gradient !== undefined) {
                            this._comparePropertyValues(node, "gradient", options);
                            if (options.gradient === null)
                                node.gradient = options.gradient;
                            else if (options.gradient && options.gradient.type === "radial")
                                node.gradient = ej.datavisualization.Diagram.RadialGradient(options.gradient);
                            else
                                node.gradient = ej.datavisualization.Diagram.LinearGradient(options.gradient);
                        }
                        if (options.borderGradient !== undefined) {
                            this._comparePropertyValues(node, "borderGradient", options);
                            if (options.borderGradient === null)
                                node.borderGradient = options.borderGradient;
                            else if (options.borderGradient && options.borderGradient.type === "radial")
                                node.borderGradient = ej.datavisualization.Diagram.RadialGradient(options.borderGradient);
                            else
                                node.borderGradient = ej.datavisualization.Diagram.LinearGradient(options.borderGradient);
                        }
                        if (options.isExpanded !== undefined) {
                            this._comparePropertyValues(node, "isExpanded", options);
                            node._updateExpander = true;
                            if (options.isExpanded) {
                                node.isExpanded = true;
                                this._expandChildren(node);
                            }
                            else {
                                node.isExpanded = false;
                                this._collapseChildren(node);
                            }
                            var select;
                            if (this._selectionContains(node)) {
                                select = true;
                                this._clearSelection(true);
                            }
                            this.layout();
                            if (select)
                                this._addSelection(node, true);
                        }
                        if (options.tooltip !== undefined) {
                            this._comparePropertyValues(node, "tooltip", options);
                            node.tooltip = ej.datavisualization.Diagram.Tooltip($.extend(true, node.tooltip, {}, options.tooltip));
                        }
                        if (options.excludeFromLayout != undefined) {
                            this._comparePropertyValues(node, "excludeFromLayout", options);
                            node.excludeFromLayout = options.excludeFromLayout;
                            this.layout();
                        }
                        if (options.addInfo != undefined) {
                            this._comparePropertyValues(node, "addInfo", options);
                            node.addInfo = options.addInfo;
                        }
                        if (options.maxWidth != undefined) {
                            this._comparePropertyValues(node, "maxWidth", options);
                            node.maxWidth = options.maxWidth;
                        }
                        if (options.maxHeight != undefined) {
                            this._comparePropertyValues(node, "maxHeight", options);
                            node.maxHeight = options.maxHeight;
                        }
                        node = this._findNode(name);
                        if (options.shape) {
                            if (typeof options.shape == "object") {
                                this._comparePropertyValues(node, "shape", options);
                                ej.datavisualization.Diagram.Util._updateShapeProperties(options);
                                if (node.type == "html") {
                                    var htmlelement = document.getElementById(node.name + "_parentdiv");
                                    htmlelement.parentNode.removeChild(htmlelement);
                                }
                                ej.datavisualization.Diagram.DiagramContext.setNodeShape(node, this);
                            }

                        }
                        if (this.getObjectType(node) == "node")
                            node = this._updateShape(node, options);

                        if (node && node.type != "phase") {
                            ej.datavisualization.Diagram.DiagramContext.update(node, this);
                            if (node.type == "bpmn")
                                ej.datavisualization.Diagram.DiagramContext.updateBPMNNodeStyle(node, this);
                            else
                                ej.datavisualization.Diagram.DiagramContext.updateNodeStyle(node, this);
                        }
                        if (this.selectionList[0] && this.selectionList[0].name === node.name)
                            ej.datavisualization.Diagram.SvgContext.updateSelector(node, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                    }
                }
                if (name) {
                    var oldabsolutepath;
                    if (options && options.pathData) {
                        oldabsolutepath = node._absolutePath;
                    }
                    var node = this._findNode(name);
                    if (oldabsolutepath) {
                        node._absolutePath = oldabsolutepath;
                        node._absoluteBounds = null;
                    }
                    if (node && node._type === "node" && options && options.type === "group" && options.children && options.children.length > 0) {
                        var isRendered = false;
                        if (this._svg.document.getElementById(node.name))
                            isRendered = true;
                        this.remove(node);
                        node.borderColor = "transparent";
                        node.borderDashArray = "";
                        node.borderWidth = 1;
                        node.fillColor = "#1BA0E2";
                        node.labels = [];
                        node.fillColor = "";
                        node.type = options.type;
                        node.children = options.children;
                        node = ej.datavisualization.Diagram.Group(node);
                        this._initGroupNode(node);
                        if (isRendered) {
                            ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                            this.add(node);
                        }
                    }
                }
                if (node && (node.isLane || node.isSwimlane || node.type === "phase" || node.isPhase)) {
                    this._needUpdate = true;
                    options.header = headerObject;
                    if (node.isLane)
                        this._updateLane(node, options);
                    else if (node.isSwimlane) {
                        this._needUpdate = false;
                        this._updateSwimlane(node, options, true);
                    }
                    else if (node.type === "phase" || node.phase) {
                        this._needUpdate = false;
                        if (options.offset) {
                            this._updatePhase({ name: node.name, offset: options.offset });
                        }
                        this._updateSwimlanePhase(node, options);
                    }
                }
                if (groupAction) {
                    this.model.historyManager.closeGroupAction();
                }
            }
        },
        _updateSwimlaneSize: function (object, options) {
            if (object) {
                if (options.height) {
                    this._comparePropertyValues(object, "height", options);
                    var dif = options.height - object.height;
                    this._comparePropertyValues(object, "offsetY", { offsetY: object.offsetY + (dif / 2) });
                }
                if (options.width) {
                    this._comparePropertyValues(object, "width", options);
                    var dif = options.width - object.width;
                    this._comparePropertyValues(object, "offsetX", { offsetX: object.offsetX + (dif / 2) });
                }
                if (object.isSwimlane && (options.height || options.width)) {
                    var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(this, object);
                    if (lanes.length > 0) {
                        var lastLane = this.nameTable[this._getChild(lanes[lanes.length - 1])];
                        if (lastLane) {
                            if (object.orientation === "vertical") {
                                if (options.width) {
                                    if (options.width > object.width) {
                                        lastLane.minWidth = lastLane.width + options.width - object.width;
                                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, lastLane, true);
                                    }
                                }
                                if (options.height) {
                                    for (var i = 0; i < lanes.length; i++) {
                                        var lane = this.nameTable[this._getChild(lanes[i])];
                                        if (options.height >= object.height)
                                            lane.minHeight = options.height;
                                    }
                                }
                            }
                            else {
                                if (options.width) {
                                    for (var i = 0; i < lanes.length; i++) {
                                        var lane = this.nameTable[this._getChild(lanes[i])];
                                        if (options.width >= object.width)
                                            lane.minWidth = options.width;
                                    }
                                }
                                if (options.height) {
                                    if (options.height > object.height) {
                                        lastLane.minHeight = lastLane.height + options.height - object.height;
                                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, lastLane, true);
                                    }
                                }
                            }
                            ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, object, true);
                            ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, object);

                        }
                    }
                }
                else if (object.isLane && (options.height || options.width)) {
                    var swimlane = this.nameTable[object.parent.split("laneStack")[0]];
                    var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(this, swimlane);
                    ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                    if (swimlane && swimlane.orientation === "vertical") {
                        if (options.width) {
                            options.minWidth = options.width;
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, object, true);
                        }
                        if (options.height) {
                            for (var i = 0; i < lanes.length; i++) {
                                var lane = this.nameTable[this._getChild(lanes[i])];
                                if (options.height >= lane.height) {
                                    lane.minHeight = options.height;
                                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, lane, true);
                                }
                            }
                        }
                    }
                    else {
                        if (options.width) {
                            for (var i = 0; i < lanes.length; i++) {
                                var lane = this.nameTable[this._getChild(lanes[i])];
                                if (options.width >= lane.width) {
                                    lane.minWidth = options.width;
                                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, lane, true);
                                }
                            }
                        }
                        if (options.height) {
                            options.minHeight = options.height;
                            ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, object, true);
                        }
                    }
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, swimlane, true);
                    ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, swimlane);
                }
            }
        },

        _updateShape: function (node, options) {
            var isShapeModified = false;
            if (options.type) {
                this._comparePropertyValues(node, "type", options);
                node.type = node._shape = options.type;
                isShapeModified = true;
            }
            if (options.shape) {
                this._comparePropertyValues(node, "shape", options);
                node.shape = node._shape = options.shape;
                isShapeModified = true;
            }
            if (node.type != "bpmn") {
                if (options.cornerRadius != undefined) {
                    this._comparePropertyValues(node, "cornerRadius", options);
                    node.cornerRadius = options.cornerRadius;
                    isShapeModified = true;
                }
                if (options.pathData) {
                    this._comparePropertyValues(node, "pathData", options);
                    node.pathData = options.pathData;
                    isShapeModified = true;
                }
                if (options.templateId !== undefined) {
                    node.templateId = options.templateId;
                    isShapeModified = true;
                }
                if (options.html !== undefined) {
                    this._comparePropertyValues(node, "html", options);
                    node.html = options.html;
                    isShapeModified = true;
                }
                if (options.contentId !== undefined) {
                    this._comparePropertyValues(node, "contentId", options);
                    node.contentId = options.contentId;
                    isShapeModified = true;
                }
                if (options.source) {
                    this._comparePropertyValues(node, "source", options);
                    node.source = options.source;
                    isShapeModified = true;
                }
                if (options.textBlock) {
                    this._comparePropertyValues(node, "textBlock", options);
                    node.textBlock = options.textBlock;
                    isShapeModified = true;
                }
                if (options.points) {
                    this._comparePropertyValues(node, "points", options);
                    node.points = options.points;
                    isShapeModified = true;
                }
                if (isShapeModified) {
                    if (node.children) delete node.children;
                    node = ej.datavisualization.Diagram.NodeType(node, this);
                    var htmlelement = document.getElementById(node.name + "_parentdiv");
                    if (htmlelement)
                        htmlelement.parentNode.removeChild(htmlelement);
                    ej.datavisualization.Diagram.DiagramContext.setNodeShape(node, this);
                    this._clearSelection(true);
                    this._addSelection(node, true);
                }
            }
            else {
                var shape = $.extend(true, {}, this.nameTable[node.name]);
                if (options.event) {
                    this._comparePropertyValues(node, "event", options);
                    shape.event = options.event;
                    isShapeModified = true;
                }
                if (options.trigger) {
                    this._comparePropertyValues(node, "trigger", options);
                    shape.trigger = options.trigger;
                    isShapeModified = true;
                }
                if (options.gateway) {
                    this._comparePropertyValues(node, "gateway", options);
                    shape.gateway = options.gateway;
                    isShapeModified = true;
                }
                if (options.data) {
                    this._comparePropertyValues(node, "data", options);
                    shape.data = $.extend(shape.data, options.data);;
                    isShapeModified = true;
                }
                if (options.activity) {
                    this._comparePropertyValues(node, "activity", options);
                    shape.activity = options.activity;
                    isShapeModified = true;
                }
                if (options.task !== undefined) {
                    this._comparePropertyValues(node, "task", options);
                    shape.task = $.extend(shape.task, options.task);
                    isShapeModified = true;
                }
                if (options.annotation !== undefined) {
                    this._comparePropertyValues(node, "annotation", options);
                    shape.annotation = $.extend(shape.annotation, options.annotation);
                    isShapeModified = true;
                }
                if (options.subProcess !== undefined) {
                    this._comparePropertyValues(node, "subProcess", options);
                    shape.subProcess = $.extend(shape.subProcess, options.subProcess);
                    isShapeModified = true;
                }
                if (options.direction) {
                    this._comparePropertyValues(node, "direction", options);
                    shape.direction = options.direction;
                    isShapeModified = true;
                }
                if (isShapeModified) {
                    var nextNode = this._svg.getElementById(node.name).nextSibling;
                    this._removeElement(node);
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[node.name], node);
                    ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this.nameTable[node.name]);
                    this._nodes = $.extend(true, [], this.nodes());
                    node = ej.datavisualization.Diagram.NodeType(shape, this);
                    if (node.type == "bpmn" && node.container)
                        node = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, node);
                    else
                        node = this._getNewGroup(node);
                    this._initGroupNode(node);
                    this.nameTable[node.name] = node;
                    this.nodes().push(node);
                    if (node.parent) {
                        var parentNode = this.nameTable[node.parent];
                        if (parentNode) {
                            var index1 = this._getChildIndexFromParent(parentNode, node.name);
                            parentNode.children[index1] = node;
                        }
                    }
                    this._nodes = $.extend(true, [], this.nodes());
                    this._updateQuad(node);
                    ej.datavisualization.Diagram.DiagramContext.renderGroup(node, this);
                    if (nextNode) this._svg.getElementById(node.name).parentNode.insertBefore(this._svg.getElementById(node.name), this._svg.getElementById(nextNode.id));
                    this._clearSelection(true);
                    this._addSelection(node, true);
                }
            }
            return node;
        },

        _getChildIndexFromParent: function (parentNode, childName) {
            for (var i = 0; i < parentNode.children.length; i++) {
                var child = parentNode.children[i];
                child = typeof child === "object" ? child.name : child;
                if (child === childName) {
                    return i;
                }
            }
            return null;
        },

        _updateObject: function (node) {
            if (node) {
                if (node.type == "pseudoGroup") {
                    var child;
                    var children = this._getChildren(node.children);
                    for (var i = 0, len = children.length; i < len; i++) {
                        child = this.nameTable[this._getChild(children[i])];
                        ej.datavisualization.Diagram.DiagramContext.update(child, this);
                    }
                }
                else {
                    if (node.parent) {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(this.nameTable[node.parent], this);
                    }
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                }
            }
        },
        _udatePhaseSize: function (node, options) {
            var phsStack = this.nameTable[this._getChild(node.children[1])];
            if (node.orientation === "vertical") {
                if (phsStack.minWidth != options.phaseSize) {
                    phsStack.width = phsStack.maxWidth;
                    phsStack.minWidth = options.phaseSize;
                    var xdif = phsStack.maxWidth - options.phaseSize;
                    var xVar = (options.phaseSize / phsStack.maxWidth)
                    phsStack.maxWidth = options.phaseSize;
                    this.scale(phsStack, xVar, .0001, ej.datavisualization.Diagram.Point(phsStack.offsetX, phsStack.offsetY), this.nameTable);
                    if (phsStack.children && phsStack.children.length > 0) {
                        for (var i = 0; i < phsStack.children.length; i++) {
                            var child = this.nameTable[this._getChild(phsStack.children[i])];
                            if (child) {
                                this.scale(child, xVar, .0001, ej.datavisualization.Diagram.Point(child.offsetX, child.offsetY), this.nameTable);
                            }
                        }
                    }
                    var laneStack = this.nameTable[this._getChild(node.children[2])];
                    laneStack.marginLeft -= xdif;
                }
            }
            else if (node.orientation === "horizontal") {
                if (phsStack.minHeight != options.phaseSize) {
                    phsStack.height = phsStack.maxHeight;
                    phsStack.minHeight = options.phaseSize;
                    var ydif = phsStack.maxHeight - options.phaseSize;
                    var yVar = (options.phaseSize / phsStack.maxHeight)
                    yVar = (yVar === Infinity) ? 0 : yVar;
                    phsStack.maxHeight = options.phaseSize;
                    this.scale(phsStack, .0001, yVar, ej.datavisualization.Diagram.Point(phsStack.offsetX, phsStack.offsetY), this.nameTable);
                    if (phsStack.children && phsStack.children.length > 0) {
                        for (var i = 0; i < phsStack.children.length; i++) {
                            var child = this.nameTable[this._getChild(phsStack.children[i])];
                            if (child) {
                                this.scale(child, .0001, yVar, ej.datavisualization.Diagram.Point(child.offsetX, child.offsetY), this.nameTable);
                            }
                        }
                    }
                    var laneStack = this.nameTable[this._getChild(node.children[2])];
                    laneStack.marginTop -= ydif;
                }
            }
        },

        _updateLane: function (node, options) {
            if (node && options) {
                //#region updateHeader 
                if (options.header) {
                    this._comparePropertyValues(this.getNode(node.name), "header", options);
                    if (node.children && node.children.length > 0) {
                        var hdname, head;
                        hdname = this._getChild(node.children[0]);
                        if (hdname) {
                            head = this.nameTable[hdname];
                        }
                        if (head) {
                            this.updateLabel(head.name, head.labels[0], options.header);
                            if (options.header.fillColor && options.header.fillColor != head.fillColor) {
                                this.updateNode(head.name, { fillColor: options.header.fillColor })
                            }
                        }
                    }
                }
                //#endregion
                if (options.fillColor && options.fillColor != node.fillColor) {
                    this._comparePropertyValues(node, "fillColor", options);
                    this.updateNode(node.name, { fillColor: options.fillColor })
                }
                if ((options.minHeight && options.minHeight != node.minHeight) || (options.minWidth && options.minWidth != node.minWidth)) {
                    if (options.minHeight) {
                        this._comparePropertyValues(node, "minHeight", options);
                        node.minHeight = options.minHeight;
                    }
                    if (options.minWidth) {
                        this._comparePropertyValues(node, "minWidth", options);
                        node.minWidth = options.minWidth;
                    }
                    var laneStack = this.nameTable[node.parent];
                    if (laneStack) {
                        var swimlane = this.nameTable[laneStack.parent];
                        if (swimlane)
                            ej.datavisualization.Diagram.SwimLaneContainerHelper._updateSwimlane(this, swimlane);
                    }
                    ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, swimlane);
                    ej.datavisualization.Diagram.SvgContext.updateSelector(swimlane, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                }

                if (options.constraints && options.constraints != node.constraints) {
                    this._comparePropertyValues(node, "constraints", options);
                    node.constraints = options.constraints;
                }
            }
        },
        _updateLastPhase: function (node, options, needUpdate) {
            if (node.isSwimlane) {
                if (node.phases && node.phases.length == 1) {
                    var df = 0;
                    var phase = this.nameTable[this._getChild(node.phases[0])];
                    if (node.orientation === "horizontal") {
                        phase.offset = node.minWidth - df;
                        this.updateNode(this.nameTable["phaseStack" + this._getChild(node.phases[0])].name, { width: node.minWidth - df });
                        if (needUpdate) {
                            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                            this.updateNode(this.nameTable["phaseStack" + this._getChild(node.phases[0])].name, { offsetX: bounds.x + node.width / 2 });
                        }
                    } else if (node.orientation === "vertical") {
                        phase.offset = node.minHeight - df
                        var height = phase.offset - df;
                        height = height - (options.header ? options.header.height : 50);
                        this.updateNode(this.nameTable["phaseStack" + this._getChild(node.phases[0])].name, { height: height });

                        if (needUpdate) {
                            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                            this.updateNode(this.nameTable["phaseStack" + this._getChild(node.phases[0])].name, { offsetY: (options.header ? options.header.height : 50) / 2 + bounds.y + node.height / 2 });
                        }
                    }
                }
            }
        },
        _updateSwimlane: function (node, options, update) {
            //#region updateHeader 
            if (options.header) {
                if (node.children && node.children.length > 0) {
                    var hdname, head;
                    hdname = this._getChild(node.children[0]);
                    if (hdname) {
                        head = this.nameTable[hdname];
                    }
                    if (head) {
                        this._comparePropertyValues(this.getNode(node.name), "header", options);
                        this.updateLabel(head.name, head.labels[0], options.header);
                        if (options.header.fillColor && options.header.fillColor != head.fillColor) {
                            this.updateNode(head.name, { fillColor: options.header.fillColor })
                        }
                    }
                }
            }
            for (var item in options) {
                if (node[item]) {
                    if (options[item] !== node[item]) {
                        if (item === "offsetX") {
                            this._comparePropertyValues(this.getNode(node.name), "offsetX", options);
                            var dx = options.offsetX - node.offsetX;
                            if (this._outOfBoundsOnNudge(node, dx, 0))
                                this._translate(node, dx, 0, this.nameTable);
                        }
                        else if (item === "offsetY") {
                            this._comparePropertyValues(this.getNode(node.name), "offsetY", options);
                            var dy = options.offsetY - node.offsetY;
                            if (this._outOfBoundsOnNudge(node, 0, dy))
                                this._translate(node, 0, dy, this.nameTable);
                        }
                        else if (item !== "minWidth" && item !== "minHeight" && item !== "maxwidth" && item !== "maxHeight" && item != "width" && item != "height" && item != "phaseSize")
                            node[item] = options[item];
                    }
                }
            }
            //#region phases
            if (options.phases && options.phases.length > 0) {
                var phase;
                for (var i = 0; i < options.phases.length; i++) {
                    phase = this.nameTable[this._getChild(options.phases[i])];
                    if (phase)
                        this._updateSwimlanePhase(phase, options.phases[i], true);
                }
            }
            if (update) {
                if ((options.phaseSize || options.phaseSize === 0) && (options.phaseSize !== node.phaseSize)) {
                    this._comparePropertyValues(this.getNode(node.name), "phaseSize", options);
                    if (options.phaseSize != node.phaseSize)
                        var lastPhase = true;
                    var phaseStack = this.nameTable[node.name + "phaseStack"];
                    var laneStack = this.nameTable[node.name + "laneStack"];
                    var phase;
                    var d = options.phaseSize - node.phaseSize;
                    for (var i = 0; i < phaseStack.children.length; i++) {
                        phase = this.nameTable[this._getChild(phaseStack.children[i])];
                        if (phase) {
                            options.phaseSize = options.phaseSize === 0 ? .0001 : options.phaseSize;
                            node.orientation === "horizontal" ? phase.height = options.phaseSize : phase.width = options.phaseSize;
                        }
                    }
                    node.phaseSize += d;
                    node.orientation === "horizontal" ? laneStack.marginTop += d : laneStack.marginLeft += d;
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, phaseStack, null, node);
                }
            }
            //#endregion
            //#region lanes
            if (options.lanes && options.lanes.length > 0) {
                var lane;
                for (var i = 0; i < options.lanes.length; i++) {
                    lane = this.nameTable[this._getChild(options.lanes[i])];
                    if (lane) {
                        this._updateLane(lane, options.lanes[i]);
                    }
                }
            }
            //#endregion
            if (!update) {
                if (options && options.phaseSize)
                    var isPhaseUpdate = false;

                if (options.minHeight && options.minHeight != node.minHeight) {
                    this._comparePropertyValues(this.getNode(node.name), "minHeight", options);
                    node.minHeight = options.minHeight;
                    isPhaseUpdate = true;
                }
                if (options.minWidth && options.minWidth != node.minWidth) {
                    this._comparePropertyValues(this.getNode(node.name), "minWidth", options);
                    node.minWidth = options.minWidth;
                    isPhaseUpdate = true;
                }
                if (options.maxHeight && options.maxHeight != node.maxHeight) {
                    this._comparePropertyValues(this.getNode(node.name), "maxHeight", options);
                    node.minHeight = options.maxHeight;
                    isPhaseUpdate = true;
                }
                if (options.maxWidth && options.maxWidth != node.maxWidth) {
                    this._comparePropertyValues(this.getNode(node.name), "maxWidth", options);
                    node.minWidth = options.maxWidth;
                    isPhaseUpdate = true;
                }
                if (isPhaseUpdate && !this._isUndo) {
                    this._updateLastPhase(node, options);
                };
                if ((options.phaseSize || (options.phaseSize === 0)) && options.phaseSize != node.phaseSize) {
                    this._comparePropertyValues(this.getNode(node.name), "phaseSize", options);
                    this._udatePhaseSize(node, options);
                    if (options.phaseSize === 0)
                        node.phaseSize = 0;
                }
            }
            ej.datavisualization.Diagram.DiagramContext.update(node, this);
            if (this.selectionList[0] && this.selectionList[0].name === node.name)
                ej.datavisualization.Diagram.SvgContext.updateSelector(node, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
        },

        updateConnector: function (name, options) {
            if (name) {
                var connector = this._findConnector(name);
                if (connector) {
                    if (!this._isUndo && !ej.datavisualization.Diagram.Util.canRouteDiagram(this))
                        this._recordPropertiesChanged(connector, options, "connector");
                    if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                        if (options.constraints !== undefined) {
                            this._comparePropertyValues(connector, "constraints", options);
                            connector.constraints = options.constraints;
                            if (!ej.datavisualization.Diagram.Util.canSelect(connector) && ej.datavisualization.Diagram.Util.enableLayerOption(connector, "lock", this))
                                this._clearSelection(true);
                        }
                    }
                    if (options.lineColor) {
                        this._comparePropertyValues(connector, "lineColor", options);
                        connector.lineColor = options.lineColor;
                    }
                    if (options.cssClass || options.cssClass === "") {
                        this._comparePropertyValues(connector, "cssClass", options);
                        connector.cssClass = options.cssClass;
                    }
                    if (options.lineWidth || options.lineWidth === 0) {
                        this._comparePropertyValues(connector, "lineWidth", options);
                        connector.lineWidth = options.lineWidth;
                    }
                    if (options.lineDashArray !== undefined) {
                        this._comparePropertyValues(connector, "lineDashArray", options);
                        connector.lineDashArray = options.lineDashArray;
                    }
                    if (connector.shape && connector.shape.type == "umlclassifier") {
                        if (options.shape && options.shape.multiplicity != undefined) {
                            connector.shape.multiplicity = options.shape.multiplicity;
                            connector.shape.multiplicity = ej.datavisualization.Diagram.UMLConnectorMultiplicity(connector.shape.multiplicity);
                            var labels = ej.datavisualization.Diagram.ClassifierHelper.umlConnectorMultiplicity(connector)
                            for (var i = 0; i < connector.labels.length; i++) {
                                if (connector.labels[i].name == connector.name + "_sourcelabel")
                                    connector.labels[i].text = labels[0].text;
                                else if (connector.labels[i].name == connector.name + "_targetlabel")
                                    connector.labels[i].text = labels[1].text;
                            }
                        }
                    }
                    if (options.opacity !== undefined) {
                        this._comparePropertyValues(connector, "opacity", options);
                        connector.opacity = options.opacity;
                    }
                    if (options.cornerRadius !== undefined) {
                        this._comparePropertyValues(connector, "cornerRadius", options);
                        connector.cornerRadius = options.cornerRadius;
                    }
                    if (options.lineHitPadding !== undefined) {
                        this._comparePropertyValues(connector, "lineHitPadding", options);
                        connector.lineHitPadding = options.lineHitPadding;
                    }
                    if (options.sourcePadding != undefined) {
                        this._comparePropertyValues(connector, "sourcePadding", options);
                        connector.sourcePadding = options.sourcePadding;
                        this._dock(connector, this.nameTable);
                    }
                    if (options.targetPadding != undefined) {
                        this._comparePropertyValues(connector, "targetPadding", options);
                        connector.targetPadding = options.targetPadding;
                        this._dock(connector, this.nameTable);
                    }
                    if (options.visible != undefined) {
                        this._comparePropertyValues(connector, "visible", options);
                        connector.visible = options.visible;
                        if (!options.visible)
                            this._clearSelection();
                    }
                    if (options.bridgeSpace != undefined) {
                        this._comparePropertyValues(connector, "bridgeSpace", options);
                        connector.bridgeSpace = options.bridgeSpace;
                    }
                    if (options.tooltip !== undefined) {
                        this._comparePropertyValues(connector, "tooltip", options);
                        connector.tooltip = ej.datavisualization.Diagram.Tooltip($.extend(true, connector.tooltip, {}, options.tooltip));
                    }
                    if (options.segments) {
                        this._comparePropertyValues(connector, "segments", options);
                        if (options.segments.length > 1) {
                            var newarray = $.extend(true, [], options.segments);
                            connector.segments = newarray;
                        }
                        else {
                            connector.segments = options.segments;
                        }
                        ej.datavisualization.Diagram.Util._initConnectionEnds(connector, this);
                        if (this.model.defaultSettings.connector && this.model.defaultSettings.connector.segments && this.model.defaultSettings.connector.segments.length) {
                            var defaultType = this.model.defaultSettings.connector.segments[0].type;
                        }
                        ej.datavisualization.Diagram.Util._initializeSegments(connector, defaultType);
                        this._dock(connector, this.nameTable);
                        ej.datavisualization.Diagram.Util.updateBridging(connector, this);
                        //this._updateQuad(this, connector);
                        if (connector == this.selectionList[0]) {
                            ej.datavisualization.Diagram.SvgContext.clearSegments(this._adornerSvg);
                            ej.datavisualization.Diagram.SvgContext.addSegments(this._adornerSvg, this.selectionList[0], this._currZoom);

                        }
                    }
                    var decorator;
                    if (options.targetDecorator) {
                        this._comparePropertyValues(connector, "targetDecorator", options);
                        if (connector.targetDecorator) {
                            decorator = $.extend(true, {}, connector.targetDecorator, options.targetDecorator);
                        } else {
                            decorator = ej.datavisualization.Diagram.Decorator(options.targetDecorator);
                        }

                        connector.targetDecorator = decorator;
                    }
                    if (options.sourceDecorator) {
                        this._comparePropertyValues(connector, "sourceDecorator", options);
                        if (connector.sourceDecorator) {
                            decorator = $.extend(true, {}, connector.sourceDecorator, options.sourceDecorator);
                        } else {
                            decorator = ej.datavisualization.Diagram.Decorator(options.sourceDecorator);
                        }
                        connector.sourceDecorator = decorator;
                    }
                    if (options.sourceDecorator || options.targetDecorator) {
                        ej.datavisualization.Diagram.DiagramContext.clearDecorators(connector, this);
                        ej.datavisualization.Diagram.DiagramContext.renderDecorators(connector, this);
                    }
                    if (options.hasOwnProperty("sourceNode") || options.hasOwnProperty("targetNode") || options.hasOwnProperty("targetPort") || options.hasOwnProperty("sourcePort") || options.hasOwnProperty("targetPoint") || options.hasOwnProperty("sourcePoint")) {
                        if (options.sourceNode !== undefined) {
                            this._comparePropertyValues(connector, "sourceNode", options);
                            var node = this.nameTable[connector.sourceNode];
                            var sourceNode = this.nameTable[options.sourceNode];
                            var targetNode = this.nameTable[connector.targetNode];
                            var node1 = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(sourceNode, targetNode, connector, this);
                            if (node1)
                                options.sourceNode = node1.name;
                            else
                                options.sourceNode = null;
                            if (node && node.outEdges.indexOf(connector.name) != -1)
                                ej.datavisualization.Diagram.Util.removeItem(node.outEdges, connector.name);
                            connector.sourceNode = options.sourceNode;
                        }
                        if (options.targetNode !== undefined) {
                            this._comparePropertyValues(connector, "targetNode", options);
                            var sourceNode = this.nameTable[connector.sourceNode];
                            var targetNode = this.nameTable[options.targetNode];
                            var node = this.nameTable[connector.targetNode];
                            var node1 = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(targetNode, sourceNode, connector, this);
                            if (node1)
                                options.targetNode = node1.name;
                            else
                                options.targetNode = null;
                            if (node && node.inEdges.indexOf(connector.name) != -1)
                                ej.datavisualization.Diagram.Util.removeItem(node.inEdges, connector.name);
                            connector.targetNode = options.targetNode;
                        }
                        if (options.targetPort !== undefined) {
                            this._comparePropertyValues(connector, "targetPort", options);
                            connector.targetPort = options.targetPort;
                        }
                        if (options.sourcePort !== undefined) {
                            this._comparePropertyValues(connector, "sourcePort", options);
                            connector.sourcePort = options.sourcePort;
                        }
                        if (options.targetPoint !== undefined) {
                            this._comparePropertyValues(connector, "targetPoint", options);
                            ej.datavisualization.Diagram.Util._setLineEndPoint(connector, options.targetPoint, true);
                        }
                        if (options.sourcePoint !== undefined) {
                            this._comparePropertyValues(connector, "sourcePoint", options);
                            ej.datavisualization.Diagram.Util._setLineEndPoint(connector, options.sourcePoint, false);
                        }
                        this._updateEdges(connector);
                        this._dock(connector, this.nameTable);
                    }
                    ej.datavisualization.Diagram.Util.updateBridging(connector, this);
                    if (this._svg) {
                        this._updateConnectorBridging(connector);
                        ej.datavisualization.Diagram.DiagramContext.update(connector, this);
                        ej.datavisualization.Diagram.DiagramContext.updateConnectorStyle(connector, this);
                    }
                    if (this.selectionList[0] && this.selectionList[0].name === connector.name)
                        ej.datavisualization.Diagram.SvgContext.updateSelector(connector, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                }
            }
        },
        _updateDrawType: function (option) {
            var shape, singleAction = false, shapes;
            var tool = option.tool;
            if (tool & ej.datavisualization.Diagram.Tool.ContinuesDraw)
                singleAction = false;
            else if (tool & ej.datavisualization.Diagram.Tool.DrawOnce)
                singleAction = true;
            var drawType = option.drawType ? option.drawType : this.model.drawType;
            if (drawType) {
                if (drawType.type === "connector" && !this.activeTool._isPolyline()) {
                    var defaultconnectorsettings = this.model.defaultSettings.connector;
                    var defaultType = defaultconnectorsettings && defaultconnectorsettings.segments && defaultconnectorsettings.segments.length ? defaultconnectorsettings.segments[0].type : "";
                    var type = drawType.segments && drawType.segments.length && drawType.segments[0].type ? drawType.segments[0].type : defaultType;
                    if (type === "bezier" || this.model.connectorType === "bezierLine")
                        this.activateTool("bezierLine", singleAction);
                    else if (type === "orthogonal" || this.model.connectorType === "orthogonalLine")
                        this.activateTool("orthogonalLine", singleAction);
                    else if (type === "straight" || this.model.connectorType === "straightLine")
                        this.activateTool("straightLine", singleAction);
                }
                else if (drawType.type === "text")
                    this.activateTool("text", singleAction);
                else if (drawType.type || drawType.shape) {
                    shape = drawType.shape ? drawType.shape : drawType.type;
                    if (drawType.type == "basic")
                        shapes = ej.datavisualization.Diagram.BasicShapes;
                    else if (drawType.type == "flow")
                        shapes = ej.datavisualization.Diagram.FlowShapes;
                    else if (drawType.type == "arrow")
                        shapes = ej.datavisualization.Diagram.ArrowShapes;
                    else if (drawType.type == "bpmn")
                        shapes = ej.datavisualization.Diagram.BPMNShapes;
                    for (var key in shapes) {
                        if (shapes[key] == drawType.shape) {
                            shape = drawType.type;
                            break;
                        }
                    }
                    if (shape)
                        this._drawToolShape(shape, singleAction);
                }
            }
        },
        update: function (option) {
            if (option.scrollSettings) {
                this._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Unknown;
                this._setModel({ scrollSettings: option.scrollSettings });
            }
            if (option.backgroundColor) {
                this._setModel({ backgroundColor: option.backgroundColor });
            }
            if (option.tool) {
                this.activeTool._showAllPorts(true);
                var tool = option.tool;
                this.tool(tool);
                this._compareModelProperty("tool");
                if (tool & ej.datavisualization.Diagram.Tool.ContinuesDraw || tool & ej.datavisualization.Diagram.Tool.DrawOnce) {
                    this._updateDrawType(option);
                }
                else if (tool & ej.datavisualization.Diagram.Tool.ZoomPan) {
                    if (ej.datavisualization.Diagram.Util.canPanning(this)) {
                        this._toolToActivate = "panTool";
                        this.activeTool = this.tools[this._toolToActivate];
                        this.activeTool._isMouseDown = false;
                        this._currentCursor = "pointer";
                    }
                }
                else if (tool & ej.datavisualization.Diagram.Tool.MultipleSelect) {
                    this.activateTool("select", false);
                }
            }
            if (option.bridgeDirection) {
                this.bridgeDirection(typeof option.bridgeDirection === 'function' ? option.bridgeDirection() : option.bridgeDirection);
                this._compareModelProperty("bridgeDirection");
                var connectors = this.connectors();
                for (var i = 0, len = connectors.length; i < len; i++) {
                    var connector = connectors[i];
                    if (connector && ej.datavisualization.Diagram.Util.canBridge(connector, this)) {
                        ej.datavisualization.Diagram.Util.updateBridging(connector, this);
                        ej.datavisualization.Diagram.DiagramContext.update(connector, this);
                    }
                }
            }
            if (option.rulerSettings) {
                this._setModel({ scrollSettings: option.scrollSettings });
            }
        },
        bringToCenter: function (rect) {
            var scale = this._currZoom;
            var viewPort = this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            var actualbounds = { x: rect.x * scale, y: rect.y * scale, width: rect.width * scale, height: rect.height * scale };
            var hoffset = actualbounds.x + actualbounds.width / 2 - viewPort.width / 2;
            var voffset = actualbounds.y + actualbounds.height / 2 - viewPort.height / 2;
            ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, 1, this._hScrollOffset - hoffset, this._vScrollOffset - voffset, null, false);
        },
        bringIntoView: function (bounds) {
            var x = 0, y = 0;
            var scale = this._currZoom;
            bounds.right = bounds.right ? bounds.right : bounds.x + bounds.width;
            bounds.bottom = bounds.bottom ? bounds.bottom : bounds.y + bounds.height;
            var hoffset = this._hScrollOffset;
            var voffset = this._vScrollOffset;
            var viewPort = this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            bounds = { x: bounds.x * scale, y: bounds.y * scale, width: bounds.width * scale, height: bounds.height * scale, right: bounds.right * scale, bottom: bounds.bottom * scale };
            var view = { x: this._hScrollOffset, y: this._vScrollOffset, width: viewPort.width, height: viewPort.height };
            if (!(ej.datavisualization.Diagram.Geometry.containsRect(view, bounds))) {
                if (bounds.right > (-hoffset + viewPort.width)) {
                    x = bounds.right - viewPort.width;
                }
                if (bounds.x < -hoffset) {
                    x = bounds.x;
                }
                if (bounds.bottom > (-voffset + viewPort.height)) {
                    y = bounds.bottom - viewPort.height;
                }
                if (bounds.y < -voffset) {
                    y = bounds.y;
                }
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, 1, this._hScrollOffset - x, this._vScrollOffset - y, null, false);
            }
        },
        getBridgeSegment: function (startPt, endPt, angle, bridgeSpace, sweep) {
            var path = "A " + bridgeSpace / 2 + " " + bridgeSpace / 2 + "  " + angle + " , 1 " + sweep + " " + endPt.x + "," + endPt.y;
            return path;
        },
        fitToPage: function (mode, region, margin, canZoomIn) {
            var zoomFactor, factor, scale = {}, bounds;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            //margin
            margin = margin || {};
            margin = {
                top: !isNaN(margin.top) ? margin.top : 25,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 25,
                left: !isNaN(margin.left) ? margin.left : 25,
                right: !isNaN(margin.right) ? margin.right : 25
            };
            //region
            region = region ? region : "pageSettings";
            //fit mode
            if ((region == "pageSettings" && this.model.pageSettings.pageWidth && this.model.pageSettings.pageHeight) || (this.nodes().length > 0 || this.connectors().length > 0)) {
                mode = mode ? mode : "page";
                if (region != "custom") {
                    bounds = this._getDigramBounds(region);
                    bounds.x -= this.model.scrollSettings.padding.left;
                    bounds.y -= this.model.scrollSettings.padding.top;
                    bounds.width += (this.model.scrollSettings.padding.left + this.model.scrollSettings.padding.right);
                    bounds.height += (this.model.scrollSettings.padding.top + this.model.scrollSettings.padding.bottom);
                }
                var width = bounds.width;
                var height = bounds.height;
                scale.x = (viewPort.width - (margin.left + margin.right)) / width;
                scale.y = (viewPort.height - (margin.top + margin.bottom)) / height;
                if (!canZoomIn && (!(this._vScrollbar && this._vScrollbar._scrollData) && !(this._hScrollbar && this._hScrollbar._scrollData))) {
                    scale.x = Math.min(1, scale.x);
                    scale.y = Math.min(1, scale.y);
                }
                var deltaX = this._hScrollOffset;
                var deltaY = this._vScrollOffset;
                var centerX, centerY;
                switch (mode) {
                    case "width":
                        zoomFactor = scale.x;
                        factor = zoomFactor / this._getCurrentZoom();
                        centerX = (viewPort.width - (region != "content" ? bounds.width : width) * zoomFactor) / 2 - bounds.x * zoomFactor;
                        deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                        //deltaX -= bounds.x * zoomFactor;
                        deltaY -= this._vScrollOffset * factor;
                        deltaY = region != "custom" ? deltaY : deltaY + this._vScrollOffset * factor;
                        break;
                    case "height":
                        zoomFactor = scale.y;
                        factor = zoomFactor / this._getCurrentZoom();
                        //var centerX = (viewPort.width - (bounds.x > 0 ? bounds.width : width) * zoomFactor - bounds.x * zoomFactor) / 2;
                        //deltaX += centerX - (bounds.x * zoomFactor) / 4 + margin.left;
                        //deltaY -= bounds.y * zoomFactor - margin.top;
                        centerX = (viewPort.width - (region != "content" ? bounds.width : width) * zoomFactor) / 2 - bounds.x * zoomFactor;
                        centerY = (viewPort.height - (region != "content" ? bounds.height : height) * zoomFactor) / 2 - bounds.y * zoomFactor;
                        deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                        deltaY += centerY + (margin.top - margin.bottom) / 2 * zoomFactor;
                        break;
                    case "page":
                        zoomFactor = Math.min(scale.x, scale.y);
                        factor = zoomFactor / this._getCurrentZoom();
                        centerX = (viewPort.width - (region != "content" ? bounds.width : width) * zoomFactor) / 2 - bounds.x * zoomFactor;
                        centerY = (viewPort.height - (region != "content" ? bounds.height : height) * zoomFactor) / 2 - bounds.y * zoomFactor;
                        deltaX += centerX + (margin.left - margin.right) / 2 * zoomFactor;
                        deltaY += centerY + (margin.top - margin.bottom) / 2 * zoomFactor;
                        break;
                }
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, factor, deltaX, deltaY, new ej.datavisualization.Diagram.Point(0, 0), true);
            } else {
                factor = 1 / this._getCurrentZoom();
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, factor, this._hScrollOffset, this._vScrollOffset, new ej.datavisualization.Diagram.Point(0, 0), true);
            }
        },

        _convertImagesToBuffer: function (images) {
            var buffers = [];
            for (var g = 0; g < images.length; g++) {
                var image = images[g];
                image = image.replace(/^data:[a-z]*;,/, '');
                var image1 = image.split(',');
                var byteString = atob(image1[1]);
                var buffer = new ArrayBuffer(byteString.length);
                var intArray = new Uint8Array(buffer);
                for (var i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                buffers.push(buffer);
            }
            return buffers;
        },

        _downloadImage: function (buffers, fileName, fileType, content) {
            var browserInfo = ej.browserInfo();
            if (browserInfo.name === "msie" && parseFloat(browserInfo.version) < 10 || browserInfo.name == "webkit") {
                var info = browserInfo.name == "webkit" ? "Safari" : "IE-9";
                alert("Downloading option is not supported in " + info + ", Please use the returned data");
                return content;
            }
            else {
                for (var b = 0; b < buffers.length; b++) {
                    var blob = new Blob([buffers[b]], { type: 'application/octet-stream' });
                    if (browserInfo.name === "msie" || browserInfo.name === "edge")
                        window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + fileType);
                    else {
                        var pom = document.createElement('a');
                        var url = URL.createObjectURL(blob);
                        pom.href = url;
                        pom.setAttribute('download', fileName + '.' + fileType);
                        if (document.createEvent) {
                            var e = document.createEvent("MouseEvents");
                            e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                            pom.dispatchEvent(e);
                        } else if (pom.fireEvent) {
                            pom.fireEvent("onclick");
                        }
                    }
                }
            }
        },

        exportImage: function (image, options) {
            options = ej.datavisualization.Diagram.ExportSettings(options);
            var region = options && options.region ? options.region : "content";
            var margin = options.margin || {};
            margin = {
                top: !isNaN(margin.top) ? margin.top : 25,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 25,
                left: !isNaN(margin.left) ? margin.left : 25,
                right: !isNaN(margin.right) ? margin.right : 25
            };

            var bounds = this._getDigramBounds(region);

            if (options.bounds) {
                bounds = {
                    x: (!isNaN(options.bounds.x) ? options.bounds.x : bounds.x),
                    y: (!isNaN(options.bounds.y) ? options.bounds.y : bounds.y),
                    width: (options.bounds.width || bounds.width),
                    height: (options.bounds.height || bounds.height)
                };
            }

            var img = document.createElement('img');
            var attr = {
                "src": image
            };
            ej.datavisualization.Diagram.Util.attr(img, attr);
            var context = this;
            img.onload = function () {
                var canvas = new ej.datavisualization.Diagram.Canvas({ "width": bounds.width + (margin.left + margin.right), "height": bounds.height + (margin.top + margin.bottom) });
                var ctx = canvas.document.getContext("2d");
                ctx.fillStyle = context._pageBackgroundColor();
                ctx.fillRect(0, 0, bounds.width + (margin.left + margin.right), bounds.height + (margin.top + margin.bottom));
                ctx.drawImage(this, bounds.x, bounds.y, bounds.width, bounds.height, margin.left, margin.top, bounds.width, bounds.height);
                image = canvas.document.toDataURL();
                if (options.printOptions) {
                    context._raisePrintAction(image, options.printOptions);
                    return;
                }
                ctx.restore();
                var fileName = options.fileName || "diagram", fileType = options.format || "jpg";
                if (options.multiplePage) {
                    options.pageHeight = options.pageHeight ? options.pageHeight : context.model.pageSettings.pageHeight;
                    options.pageWidth = options.pageWidth ? options.pageWidth : context.model.pageSettings.pageWidth;
                    options.pageHeight = options.pageHeight ? options.pageHeight : canvas.width;
                    options.pageWidth = options.pageWidth ? options.pageWidth : canvas.height;
                    options.pageOrientation = context.model.pageSettings.pageOrientation || options.pageOrientation;
                    margin = options.margin || {};
                    var swap = false;
                    if (options.pageOrientation == ej.datavisualization.Diagram.PageOrientations.Landscape) {
                        if (options.pageHeight > options.pageWidth) {
                            swap = true;
                        }
                    }
                    else {
                        if (options.pageWidth > options.pageHeight) {
                            swap = true;
                        }
                    }
                    if (swap) {
                        var temp = options.pageWidth;
                        options.pageWidth = options.pageHeight;
                        options.pageHeight = temp;
                    }

                    options.margin = {
                        top: !isNaN(margin.top) ? margin.top : 0,
                        bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
                        left: !isNaN(margin.left) ? margin.left : 0,
                        right: !isNaN(margin.right) ? margin.right : 0
                    }

                    var img = document.createElement('img');
                    var attr = {
                        "id": context.element[0].id + "_printImage",
                        "src": image,
                    };
                    ej.datavisualization.Diagram.Util.attr(img, attr);
                    img.onload = function () {
                        var images = context._getMultipleImage(img, options, true);
                        var buffers = context._convertImagesToBuffer(images);
                        context._downloadImage(buffers, fileName, fileType, images);
                    }
                }
                else {
                    var images = [image];
                    var buffers = context._convertImagesToBuffer(images);
                    context._downloadImage(buffers, fileName, fileType, images);
                }
            }
        },

        exportDiagram: function (options) {
            options = ej.datavisualization.Diagram.ExportSettings(options);
            var fileType, customBounds, content, buffers = [];
            if (!options) options = {};
            //region
            var region = options && options.region ? options.region : "content";
            //mode
            var mode = options && options.mode ? options.mode : "download";
            //margin
            var margin = options.margin || {};
            margin = {
                top: !isNaN(margin.top) ? margin.top : 25,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 25,
                left: !isNaN(margin.left) ? margin.left : 25,
                right: !isNaN(margin.right) ? margin.right : 25
            };
            //region
            var bounds = this._getDigramBounds(region);
            if (options.bounds) {
                customBounds = true;
                bounds = {
                    x: (!isNaN(options.bounds.x) ? options.bounds.x : bounds.x),
                    y: (!isNaN(options.bounds.y) ? options.bounds.y : bounds.y),
                    width: (options.bounds.width || bounds.width),
                    height: (options.bounds.height || bounds.height)
                };
            }
            if (!options.bounds) {
                var nodes = this.nodes();
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    var labels = node.labels;
                    for (var j = 0; j < labels.length; j++) {
                        var label = labels[j];
                        if (label.visible)
                            var labelbounds = ej.datavisualization.Diagram.Util.getLabelbounds(this, node, label);
                        if (labelbounds) {
                            bounds = this._union(labelbounds, bounds);
                        }
                    }

                }
            }
            bounds.x -= margin.left;
            bounds.y -= margin.top;
            bounds.width += margin.left + margin.right;
            bounds.height += margin.top + margin.bottom;
            //Target file name
            var fileName = options.fileName || "diagram";
            if (options.format != "svg") {
                this._setScaleValueforCanvas(options, bounds);
                var canvas = this._diagramAsCanvas({ bounds: bounds, margin: margin, region: region, scaleX: options._scaleX, scaleY: options._scaleY }, customBounds);
                fileType = options.format || "jpg";
                var image = content = canvas.toDataURL();
                if (mode == "data") return content;
                if (!(ej.browserInfo().name === "msie" && parseFloat(ej.browserInfo().version) < 10)) {
                    if (options.multiplePage) {
                        options.pageHeight = options.pageHeight ? options.pageHeight : this.model.pageSettings.pageHeight;
                        options.pageWidth = options.pageWidth ? options.pageWidth : this.model.pageSettings.pageWidth;
                        options.pageHeight = options.pageHeight ? options.pageHeight : canvas.width;
                        options.pageWidth = options.pageWidth ? options.pageWidth : canvas.height;
                        options.pageOrientation = this.model.pageSettings.pageOrientation || options.pageOrientation;
                        margin = options.margin || {};
                        var swap = false;
                        if (options.pageOrientation == ej.datavisualization.Diagram.PageOrientations.Landscape) {
                            if (options.pageHeight > options.pageWidth) {
                                swap = true;
                            }
                        }
                        else {
                            if (options.pageWidth > options.pageHeight) {
                                swap = true;
                            }
                        }
                        if (swap) {
                            var temp = options.pageWidth;
                            options.pageWidth = options.pageHeight;
                            options.pageHeight = temp;
                        }

                        options.margin = {
                            top: !isNaN(margin.top) ? margin.top : 0,
                            bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
                            left: !isNaN(margin.left) ? margin.left : 0,
                            right: !isNaN(margin.right) ? margin.right : 0
                        }
                        var img = document.createElement('img');
                        var attr = {
                            "id": this.element[0].id + "_printImage",
                            "src": image,
                        };
                        ej.datavisualization.Diagram.Util.attr(img, attr);
                        var context = this;
                        img.onload = function () {
                            var images = context._getMultipleImage(img, options, true);
                            buffers = context._convertImagesToBuffer(images);
                            context._downloadImage(buffers, fileName, fileType, content);
                        }
                    }
                    else {
                        var images = [image];
                        buffers = this._convertImagesToBuffer(images);
                    }

                }

            } else {
                fileType = options.format || "svg";
                var svg = content = this._diagramAsSvg({ bounds: bounds, margin: margin });
                if (mode == "data") return content;
                if (!(ej.browserInfo().name === "msie" && parseFloat(ej.browserInfo().version) < 10)) {
                    var buffer = new XMLSerializer().serializeToString(svg);
                    buffers.push(buffer);
                }
            }
            if (mode == "download") {
                this._downloadImage(buffers, fileName, fileType, content);
            }
        },
        _diagramAsSvg: function (options) {
            var svg = new ej.datavisualization.Diagram.Svg({ "id": "diagram_svg", "width": options.bounds.width, "height": options.bounds.height });
            document.body.appendChild(svg.document);
            var g = this._svg.document.getElementById(this._canvas.id + "_pageBackground");
            g = $(g).find("#pageback")[0];
            g = g.cloneNode(true);
            var bounds = this._getDigramBounds();
            var left = bounds.x;
            var top = bounds.y;
            var width = bounds.width;
            var height = bounds.height;
            svg.appendChild(g);
            g.setAttribute("transform", "translate(" + (-options.bounds.x) + ", " + (-options.bounds.y) + ")");
            g.setAttribute("x", left);
            g.setAttribute("y", top);
            g.setAttribute("width", width);
            g.setAttribute("height", height);
            g = this._svg.document.getElementById(this._canvas.id + "_diagramLayer");
            g = g.cloneNode(true);
            svg.appendChild(g);
            g.setAttribute("transform", "translate(" + (-options.bounds.x) + ", " + (-options.bounds.y) + ")");

            var nodes = this.nodes();
            //renderLabels
            for (var i = 0; i < nodes.length; i++) {
                var node = nodes[i];
                if (node._type == "group")
                    ej.datavisualization.Diagram.SvgContext._renderLabelGroup(node, svg, this);
                else
                    ej.datavisualization.Diagram.SvgContext._renderLabelsAsSvg(node, svg, this);
                if (node.annotation) {
                    if (node._annotation && node._annotation.length) {
                        for (var n = 0; n < node._annotation.length; n++) {
                            if (diagram.nameTable[node._annotation[n]]) {
                                var element = diagram.nameTable[node._annotation[n]];
                                ej.datavisualization.Diagram.SvgContext._renderLabelsAsSvg(element, svg, this);
                            }
                        }
                    }
                }
            }
            var connectors = this.connectors();
            for (var i = 0; i < connectors.length; i++) {
                var connector = connectors[i];
                ej.datavisualization.Diagram.SvgContext._renderLabelsAsSvg(connector, svg, this);
            }
            document.body.removeChild(svg.document);
            svg.appendChild(this._svg.document.getElementById(this._canvas.id + "patterndefinition").cloneNode(true));
            return svg.document;
        },

        _setScaleValueforCanvas: function (options, bounds) {
            options._scaleX = 1;
            options._scaleY = 1;
            options.pageHeight = options.pageHeight ? options.pageHeight : this.model.pageSettings.pageHeight;
            options.pageWidth = options.pageWidth ? options.pageWidth : this.model.pageSettings.pageWidth;
            var height = options.pageHeight ? options.pageHeight : bounds.height;
            var width = options.pageWidth ? options.pageWidth : bounds.width;
            if (options.stretch === "fill" || options.stretch === "uniform" || options.stretch === "uniformtofill") {
                options._scaleX = width / bounds.width;
                options._scaleY = height / bounds.height;
                if (options.stretch === "uniform")
                    options._scaleX = options._scaleY = Math.min(options._scaleX, options._scaleY);
                else if (options.stretch === "uniformtofill")
                    options._scaleX = options._scaleY = Math.max(options._scaleX, options._scaleY);
                bounds.width = width;
                bounds.height = height;
            }
            bounds.x *= options._scaleX;
            bounds.y *= options._scaleY;
        },
        _diagramAsCanvas: function (options, customBounds) {
            var elements, element, pageBounds;
            var margin = options.margin;
            var region = pageBounds = options.bounds;
            var bgColor = this._pageBackgroundColor();
            var canvas = new ej.datavisualization.Diagram.Canvas({ "id": "mycanvas", "width": region.width, "height": region.height });
            canvas._diagram = this;
            canvas._scaleX = options.scaleX;
            canvas._scaleY = options.scaleY;
            var context = canvas.document.getContext("2d");
            context.fillStyle = this._backgroundColor();
            context.translate(-region.x, -region.y);
            context.fillRect(region.x, region.y, region.width, region.height);
            var bgImg = this._backgroundImage();
            if (bgImg && bgImg.source) {
                var image = new Image();
                image.src = bgImg.source;
                var proportionX = pageBounds.width / image.width;
                var proportionY = pageBounds.height / image.height;
                var x = pageBounds.x;
                var y = pageBounds.y;
                var width = pageBounds.width;
                var height = pageBounds.height;
                var exportable = ej.datavisualization.Diagram.CanvasContext._isImageExportable(bgImg);
                if (bgImg.scale != "none" && bgImg.alignment != "none") {
                    var proportion = bgImg.scale == "meet" ? Math.min(proportionX, proportionY) : Math.max(proportionX, proportionY);
                    width = proportion * image.width;
                    height = proportion * image.height;
                    if (bgImg.alignment.indexOf("xmid") > -1) {
                        x += (pageBounds.width - width) / 2;
                    }
                    else if (bgImg.alignment.indexOf("xmax") > -1) {
                        x = x + pageBounds.width - width;
                    }
                    if (bgImg.alignment.indexOf("ymid") > -1) {
                        y += (pageBounds.height - height) / 2;
                    }
                    else if (bgImg.alignment.indexOf("ymax") > -1) {
                        y = y + pageBounds.height - height;
                    }
                    if (this._backgroundColor() == "none" || this._backgroundColor() == "transparent") {
                        context.fillStyle = "white";
                        context.fillRect(pageBounds.x * options.scaleX, pageBounds.y * options.scaleY, pageBounds.width * options.scaleX, pageBounds.height * options.scaleY);
                    }
                    if (exportable)
                        context.drawImage(image, x, y, proportion * image.width, proportion * image.height);
                }
                else if (exportable) context.drawImage(image, x, y, pageBounds.width, pageBounds.height);
            }
            else {
                context.fillStyle = bgColor;
                context.fillRect((pageBounds.x * options.scaleX) - margin.left, (pageBounds.y * options.scaleY) - margin.top, (pageBounds.width * options.scaleX) + margin.left + margin.right, (options.scaleY * pageBounds.height) + margin.top + margin.bottom);
            }
            var brColor = this._pageBorderColor();
            var brWidth = this._pageBorderWidth();
            if (brWidth) {
                context.strokeStyle = brColor == "none" ? "transparent" : brColor;
                context.lineWidth = brWidth;
                context.strokeRect(pageBounds.x * options.scaleX, pageBounds.y * options.scaleY, pageBounds.width * options.scaleX, pageBounds.height * options.scaleY);
            }
            elements = this.nodes().concat(this.connectors());
            elements = this._sortByZIndex(elements, true);
            this._sortByGroupChildrenZIndex(true);
            for (var i = 0; i < elements.length; i++) {
                element = elements[i];
                if (ej.datavisualization.Diagram.Util.enableLayerOption(element, "print", this)) {
                    if (element.segments)
                        ej.datavisualization.Diagram.CanvasContext.renderConnector(element, canvas);
                    else if (element._type === "group" && !element.parent) {
                        ej.datavisualization.Diagram.CanvasContext.renderGroup(element, canvas, this);
                    }
                    else if (element._type === "node" && !element.isPhase && !element.parent)
                        ej.datavisualization.Diagram.CanvasContext.renderNode(element, canvas, this);
                }
            }
            /*canvas.line({ x: region.x + margin.left / 2, y: region.y }, { x: region.x + margin.left / 2, y: region.y + region.height }, { lineWidth: margin.left, stroke: bgColor });
        var y = region.y + region.height - margin.bottom / 2;
        canvas.line({ x: region.x, y: y }, { x: region.x + region.width, y: y }, { lineWidth: margin.bottom, stroke: bgColor });
        var x = region.x + region.width - margin.right / 2;
        canvas.line({ x: x, y: region.y + region.height }, { x: x, y: region.y }, { lineWidth: margin.right, stroke: bgColor });
        y = region.y + margin.top / 2;
        canvas.line({ x: region.x + region.width, y: y }, { x: region.x, y: y }, { lineWidth: margin.top, stroke: bgColor });*/
            return canvas.document;
        },
        _renderCanvasPhase: function (element, canvas) {

            var tx = 0, ty = 0;
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, element), phase;
            if (phases) {
                for (var i = 0; i < phases.length; i++) {
                    phase = this.nameTable[this._getChild(phases[i])];
                    var parNode = this.nameTable[element.name];
                    if (parNode) {
                        var children = this._getChildren(parNode.children);
                        if (children.length > 1)
                            var header = this.nameTable[children[0]];
                        var bounds = ej.datavisualization.Diagram.Util.bounds(parNode);
                        var points = [], nPoint;
                        var top = bounds.top + 50;
                        var left = bounds.left + 50;
                        if (phase.orientation == "vertical") {
                            points.push({ x: 0, y: 0 });
                            points.push({ x: bounds.width, y: 0 });
                            nPoint = ej.datavisualization.Diagram.SvgContext._convertToSVGPoints(points);
                            tx = bounds.x;
                            ty = bounds.y + phase.offset;
                            if (header)
                                ty += header.height;
                            for (var j = 0, len = points.length; j < len; ++j) {
                                var point = ej.datavisualization.Diagram.Geometry.translate(points[j], tx, ty);
                                points[j] = point;
                            }
                        } else {
                            points.push({ x: 0, y: header.height ? header.height : 0 });
                            points.push({ x: 0, y: bounds.height });
                            tx = bounds.x + phase.offset;
                            ty = bounds.y;
                            for (var j = 0, len = points.length; j < len; ++j) {
                                var point = ej.datavisualization.Diagram.Geometry.translate(points[j], tx, ty);
                                points[j] = point;
                            }
                        }
                    }
                    for (var k = 0; k < points.length; k++) {
                        var point = points[k];
                        point.x *= canvas._scaleX;
                        point.y *= canvas._scaleY;
                    }
                    ej.datavisualization.Diagram.CanvasContext.renderPhases(phase, canvas, points);
                }
            }
        },

        _getPrintCanvasStyle: function (img, options) {
            var width = 0, height = 0;
            if (img) {
                width = img.width;
                height = img.height;
            }
            if (options) {
                if (options.pageHeight || options.pageWidth) {
                    height = options.pageHeight ? options.pageHeight : height;
                    width = options.pageWidth ? options.pageWidth : width;
                }
                if (options.pageOrientation) {
                    var temp;
                    if (options.pageOrientation === "landscape" && height > width) {
                        temp = width;
                    }
                    else if (options.pageOrientation === "portrait" && width > height) {
                        temp = width;
                    }
                    if (temp) {
                        width = height;
                        height = temp;
                    }
                }
            }
            return { height: height, width: width };
        },

        _getMultipleImage: function (img, printSettings, isExport) {
            var imageArray = [];
            var div = document.createElement("div");
            var pageSize = this._getPrintCanvasStyle(img, printSettings), pageWidth, pageHeight;
            var margin = printSettings.margin;
            var mLeft = margin.left;
            var mTop = margin.top;
            var mRight = margin.right;
            var mBottom = margin.bottom;
            var x = 0, y = 0;
            pageWidth = pageSize.width + x;
            pageHeight = pageSize.height + y;
            var drawnX = 0;
            var drawnY = 0;
            if (printSettings && printSettings.multiplePage) {
                div.style.height = "auto";
                div.style.width = "auto";
                var imgHeight = img.height;
                var imgWidth = img.width;
                if (img) {
                    var i = 0, j = 0, url, ctx, canvas, clipWidth = 0, clipHeight = 0;
                    do {
                        do {
                            clipWidth = pageSize.width;
                            clipHeight = pageSize.height;
                            if ((drawnX + pageSize.width) >= imgWidth)
                                clipWidth = (imgWidth - drawnX);
                            if ((drawnY + pageSize.height) >= imgHeight)
                                clipHeight = (imgHeight - drawnY);
                            canvas = new ej.datavisualization.Diagram.Canvas({ "id": "multiplePrint" + i + "" + j, "width": pageSize.width, "height": pageSize.height });
                            ctx = canvas.document.getContext("2d");
                            ctx.drawImage(img, x + drawnX + mLeft,
                                               y + drawnY + mTop,
                                               clipWidth - mRight - mLeft,
                                               clipHeight - mBottom - mTop,
                                               0 + mLeft,
                                               0 + mTop,
                                               clipWidth - mRight - mLeft,
                                               clipHeight - mBottom - mTop);

                            if ((drawnX + pageSize.width) >= imgWidth)
                                drawnX -= (drawnX - imgWidth);
                            url = canvas.document.toDataURL();
                            ctx.restore();
                            drawnX += pageWidth;
                            if (isExport)
                                imageArray.push(url);
                            else
                                this._printImage(div, url, i + "" + j); i++;
                        } while (drawnX < imgWidth)
                        j++;
                        i = x = drawnX = 0;
                        if ((drawnY + pageSize.height) >= imgHeight)
                            drawnY -= (drawnY - imgHeight);
                        drawnY += pageHeight;
                    } while (drawnY < imgHeight)
                }
            }
            else if (printSettings && printSettings.region === "content" && !printSettings.pageWidth && !printSettings.pageHeight) {               
                canvas = new ej.datavisualization.Diagram.Canvas({ "id": "multiplePrint10", "width": img.width, "height": img.height });
                ctx = canvas.document.getContext("2d");
                ctx.drawImage(img, x + mLeft, y + mTop, img.width - (mRight + mLeft), img.height - (mTop + mBottom), 0 + mLeft, 0 + mTop, img.width - (mRight + mLeft), img.height - (mTop + mBottom));
                url = canvas.document.toDataURL();
                ctx.restore();
                this._printImage(div, url, 0)
            }
            else {
                var x = 0, y = 0;
                var pageSize = this._getPrintCanvasStyle(img, printSettings), pageWidth, pageHeight;
                pageWidth = pageSize.width;
                pageHeight = pageSize.height;
                canvas = new ej.datavisualization.Diagram.Canvas({ "id": "multiplePrint0", "width": img.width, "height": img.height });
                ctx = canvas.document.getContext("2d");
                var ratio = Math.min(img.width / pageWidth, img.height / pageHeight);
                pageWidth = img.width * ratio;
                pageHeight = img.height * ratio;
               
                ctx.drawImage(img, x + mLeft, y + mTop, img.width - (mRight + mLeft), img.height - (mTop + mBottom), 0 + mLeft, 0 + mTop, pageWidth - (mRight + mLeft), pageHeight - (mTop + mBottom));
                url = canvas.document.toDataURL();
                ctx.restore();
                this._printImage(div, url, 0)
            }
            if (isExport)
                return imageArray;
            else
                return div;
        },

        _printImage: function (div, url, i) {
            var img1, innerDiv, attr;
            img1 = document.createElement('img');
            innerDiv = document.createElement('div');
            attr = { "class": "e-diagram-print-page", };
            ej.datavisualization.Diagram.Util.attr(innerDiv, attr);
            attr = { "id": this.element[0].id + "_multiplePrint_img" + i, "style": "float:left", "src": url };
            ej.datavisualization.Diagram.Util.attr(img1, attr);
            innerDiv.appendChild(img1);
            div.appendChild(innerDiv);
        },

        printImage: function (image, options) {
            options = options || {};
            var margin = options.margin || {};
            margin = {
                top: !isNaN(margin.top) ? margin.top : 0,
                bottom: !isNaN(margin.bottom) ? margin.bottom : 0,
                left: !isNaN(margin.left) ? margin.left : 0,
                right: !isNaN(margin.right) ? margin.right : 0
            };
            options = ej.datavisualization.Diagram.PrintSettings(options);
            this.exportImage(image, { printOptions: options, region: options.region, margin: margin });
        },

        _raisePrintAction: function (url, options) {
            var img = document.createElement('img');
            var attr = {
                "id": this.element[0].id + "_printImage",
                "src": url,
            };
            ej.datavisualization.Diagram.Util.attr(img, attr);
            var tempObj = this;
            img.onload = function () {
                var div = tempObj._getMultipleImage(img, options);
                // specify window parameters
                var PrintWind = window.open('');
                if (PrintWind != null) {
                    PrintWind.document.write('<html><head><style> body{margin:0px;}  @media print { .e-diagram-print-page {page-break-after: left; }.e-diagram-print-page:last-child {page-break-after: avoid;}}  </style><title></title></head>');
                    PrintWind.document.write('<BODY onload="setTimeout(function(){window.print();}, 100)">');
                    PrintWind.document.write("<center>" + div.innerHTML + "</center>");
                    PrintWind.document.close();
                }
            }
        },
        print: function (options) {
            options = ej.datavisualization.Diagram.PrintSettings(options);
            var url = this.exportDiagram({ mode: "data", region: options.region, margin: { top: 10, bottom: 10, left: 10, right: 10, }, stretch: options.stretch });
            this._raisePrintAction(url, options);
        },
        save: function () {
            var drawingTools = this.model.drawingTools;
            var userHandles = this.model.selectedItems.userHandles;
            this.model.drawingTools = null;
            this.model.selectedItems.userHandles = [];
            if (this.nameTable["multipleSelection"]) {
                ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this.nameTable["multipleSelection"]);
                this._nodes = $.extend(true, [], this.nodes());
            }
            this._updateTableNodes();
            var model = jQuery.extend(true, {}, this.model);
            for (var i = 0; i < model.nodes.length; i++) {
                this._resetValues(model.nodes[i]);
            }
            for (var i = 0; i < model.connectors.length ; i++) {
                this._resetValues(model.connectors[i]);
            }
            delete model.historyManager;
            if (ej.version)
                model.version = ej.version;
            this._updateGroupChildren(model);
            this.model.drawingTools = drawingTools;
            this.model.selectedItems.userHandles = userHandles;
            this._checkForNullValues(model);
            if (this.model.serializationSettings.preventDefaultValues) {
                model = this._optimizeJson(model);
            }
            return model;
        },
        _updateDefaults: function (node) {
            if (!this.defaultTabels) {
                this.defaultTabels = {};
                this.defaultTabels["defaults"] = $.extend(true, {}, this.defaults);
                this.defaultTabels["defaults"].snapSettings.verticalGridLines.linesInterval = [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75];
                this.defaultTabels["defaults"].snapSettings.horizontalGridLines.linesInterval = [1.25, 18.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75, 0.25, 19.75];
                this.defaultTabels["defaults"].tooltip = this.defaultTabels["defaults"].selectedItems.tooltip = ej.datavisualization.Diagram.TooltipDefaults;
            }
            if (node) {
                if (node.type) {
                    if (!this.defaultTabels[node.type]) {
                        if (node.type === "group" && node.isSwimlane) {
                            var Swimlane = ej.datavisualization.Diagram.SwimLane({});
                            Swimlane.phases = [ej.datavisualization.Diagram.Phase({ label: { text: "Phase" } })];
                            Swimlane.lanes = [ej.datavisualization.Diagram.Lane({})];
                            this.defaultTabels["Swimlane"] = Swimlane;
                        }
                        else if (node.type === "group") {
                            this.defaultTabels[node.type] = $.extend(false, ej.datavisualization.Diagram.Group(this.model.defaultSettings.group ? this.model.defaultSettings.group : { type: node.type }));
                        }
                        else if (node.type === "connector") {
                            this.defaultTabels[node.type] = ej.datavisualization.Diagram.ConnectorDefaults;
                        }
                        else if (node.type === "textBlock") {
                            this.defaultTabels[node.type] = ej.datavisualization.Diagram.TextBlockDefaults;
                        }
                        else if (node.type === "labels" || node.type === "label") {
                            this.defaultTabels[node.type] = ej.datavisualization.Diagram.LabelDefaults;
                        }
                        else if (node.type === "ports") {
                            this.defaultTabels[node.type] = ej.datavisualization.Diagram.PortDefaults;
                        }
                        else if (node.type === "basic" || node.type === "flow" || node.type === "arrow" || node.type === "bpmn" || node.type === "text" || node.type === "image" || node.type === "native" || node.type === "html" || node.type === "node") {
                            var nodeDefault = ej.datavisualization.Diagram.Node($.extend(false, { type: node.type }, ej.datavisualization.Diagram.NodeBase({ type: node.type }), ej.datavisualization.Diagram.NodeType({ type: node.type, shape: node.shape }, this)));
                            if (nodeDefault.container) {
                                nodeDefault.container = ej.datavisualization.Diagram.Container(nodeDefault.container);
                            }
                            this.defaultTabels[node.type] = nodeDefault;
                        }
                        else if (node.type === "umlclassifier" || node.type === "umlactivity") {
                            var nodeDefault = ej.datavisualization.Diagram.Node(
                                $.extend(false, { "type": node.type },
                                ej.datavisualization.Diagram.NodeBase({ "type": node.type }),
                                ej.datavisualization.Diagram.NodeType(
                                {
                                    "type": node.type, shape: node.shape,
                                    classifier: node.classifier,
                                    "class": node['class'], "interface": node.interface,
                                    enumeration: node.enumeration
                                },
                                this)
                                ));
                            this.defaultTabels[node.type] = nodeDefault;
                        }
                    }
                }
            }
        },
        _optimizeJson: function (data) {
            var jsonData = data;
            this._updateDefaults();
            var jsonData = this._compareObject(data, this.defaultTabels["defaults"]);
            return jsonData;
        },
        _updateHistoryManager: function (data) {
            for (var key in data) {
                if (data[key] !== "push" || data[key] !== "stackLimit" || data[key] !== "pop") {
                    delete data[key];
                }
            }
            return data;
        },
        _compareObject: function (orgValue, defaultValue) {
            if (orgValue && defaultValue) {
                for (var key in orgValue) {
                    var datavalue = orgValue[key];
                    if (datavalue === null || datavalue === "") {
                        delete orgValue[key];
                    }
                    else if (orgValue.hasOwnProperty(key)) {
                        if (key.charAt(0) === "_" || (orgValue["type"] === "bpmn" && key === "container")) {
                            delete orgValue[key];
                        }
                        else {
                            var defaultValues = defaultValue[key] === undefined ? this.defaultTabels[key] : defaultValue[key];
                            if (datavalue !== undefined && defaultValues !== undefined) {
                                if (key === "collapseIcon" || key === "expandIcon" || key === "layout") {
                                    if (datavalue.shape === defaultValues.shape) {
                                        delete orgValue[key].shape;
                                    }
                                    if (datavalue.type === defaultValues.type) {
                                        delete orgValue[key].type;
                                    }
                                }
                                if (key !== "isSwimlane" && key !== "classifier" && key !== "type" && key !== "shape") {
                                    if (datavalue === defaultValues) {
                                        delete orgValue[key];
                                    }
                                }
                            }
                            if ((datavalue !== null) && (typeof datavalue === 'object')) {
                                if ((datavalue !== null) && (datavalue instanceof Array)) {
                                    if (datavalue.length === 0) {
                                        delete orgValue[key];
                                    }
                                    else {
                                        for (var subKey in datavalue) {
                                            if (typeof (datavalue[subKey]) === 'object') {
                                                var defaultJson;
                                                if (key === "labels" || key === "label" || key === "textBlock" || key === "ports") {
                                                    this._updateDefaults({ type: key })
                                                    defaultJson = this.defaultTabels[key];
                                                    if (orgValue && orgValue.type === 'bpmn' && key === "labels") {
                                                        defaultJson = $.extend(true, {}, defaultJson);
                                                        defaultJson.offset = { x: 0.5, y: 1 };
                                                    }
                                                    if (key === "label") {
                                                        defaultJson = this.defaultTabels["labels"];
                                                    }
                                                    if (key === "labels" || key === "ports") {
                                                        if (this.model.defaultSettings) {
                                                            var defaultSetting = this.model.defaultSettings;
                                                            for (var innerKey in defaultSetting) {
                                                                var defaultSettingValue = defaultSetting[innerKey]
                                                                if (defaultSettingValue) {
                                                                    if (defaultSettingValue[key]) {
                                                                        for (var subInnerKey in defaultSettingValue[key][subKey]) {
                                                                            this.defaultTabels[key][subInnerKey] = defaultSettingValue[key][subInnerKey];
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                } else if (key === "children") {
                                                    this._updateDefaults({ type: datavalue[subKey].type })
                                                    defaultJson = this.defaultTabels[datavalue[subKey].type];
                                                }
                                                else {
                                                    this._updateDefaults(datavalue[subKey])
                                                    defaultJson = this.defaultTabels[datavalue[subKey].type];
                                                }
                                                if (datavalue[subKey].isSwimlane) {
                                                    defaultJson = this.defaultTabels["Swimlane"]
                                                }
                                                else if (datavalue[subKey].type === "umlclassifier" || datavalue[subKey].type === "bpmn") {
                                                    delete orgValue[key][subKey]["children"]
                                                }
                                                orgValue[key][subKey] = this._compareObject(datavalue[subKey], defaultJson === undefined ? defaultValues : defaultJson)
                                            }
                                            else {
                                                orgValue[key] = this._compareObject(datavalue, defaultValues);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (key !== "class" && key !== "interface" && key !== "enumeration") {
                                        if (key === "commandManager" || key === "contextMenu") {
                                            if (key === "contextMenu" && !this.model.enableContextMenu) {
                                                delete orgValue[key];
                                            } else if (key === "commandManager") {
                                                var commands = datavalue.commands;
                                                for (var Commandkey in commands) {
                                                    if (commands[Commandkey]._isDefault) {
                                                        delete commands[Commandkey];
                                                    }
                                                } if ($.isEmptyObject(datavalue.commands)) { delete orgValue[key].commands; }
                                            }
                                        }
                                        if (key === "historyManager") {
                                            orgValue[key] = this._updateHistoryManager(datavalue);
                                        }
                                        else {
                                            orgValue[key] = this._compareObject(datavalue, defaultValues);
                                        }
                                    }
                                }
                                if ($.isEmptyObject(datavalue) || datavalue.length === 0) {
                                    delete orgValue[key];
                                }
                            }
                        }
                    }
                }
            } return orgValue;
        },
        _checkForNullValues: function (model) {
            this._checkTargetNull(model.pageSettings);
        },
        _checkTargetNull: function (target) {
            for (var member in target) {
                if (target[member] == null || target[member] == Infinity) {
                    target[member] = 0;
                }
                else if (typeof (target[member]) === "object" && target[member])
                    this._checkTargetNull(target[member]);
            }
        },
        _updateGroupChildren: function (model) {
            var nodes = [], connectors = [], swimlane;
            var tempNodes = typeof model.nodes === 'function' ? model.nodes() : model.nodes;
            if (tempNodes && tempNodes.length > 0) {
                for (var i = 0; i < tempNodes.length; i++) {
                    if (tempNodes[i].parent === "" && !tempNodes[i].isSwimlane) {
                        this._updateChildren(tempNodes[i]);
                        nodes.push(jQuery.extend(true, {}, tempNodes[i]))
                    }
                    else if (tempNodes[i].isSwimlane) {
                        swimlane = this._getNode(tempNodes[i].name);
                        this._isSwimlaneExist = true;
                        if (swimlane)
                            nodes.push(jQuery.extend(true, {}, swimlane))
                    }
                }
            }
            var tempConnectors = typeof model.connectors === 'function' ? model.connectors() : model.connectors;
            if (tempConnectors && tempConnectors.length > 0) {
                for (var i = 0; i < tempConnectors.length; i++) {
                    connectors.push(tempConnectors[i]);
                }
            }
            model.connectors = connectors;
            model.nodes = nodes;
        },
        _updateChildren: function (node) {
            var children = [];
            if (node && node.children && node.children.length > 0) {
                var child, childName;
                for (var i = 0; i < node.children.length; i++) {
                    childName = this._getChild(node.children[i]);
                    if (childName)
                        child = this.nameTable[childName];
                    if (child)
                        children.push(jQuery.extend(true, {}, child));
                }
                node.children = children;
            }
        },
        _containsNode: function (node) {
            node = this._getChild(node);
            var chnode = null;
            for (var i = 0; i < this.nodes().length; i++) {
                chnode = this.nodes()[i];
                if (chnode) {
                    if (chnode.name === node)
                        return true;
                }
            }
            return null;
        },

        _updateTableNodes: function () {
            var i = 0, node, connector, cphase;
            for (i; i < this.nodes().length; i++) {
                node = this.nameTable[this.nodes()[i].name];
                if (node) {
                    this.nodes()[i] = node;
                    if (node._type === "group") {
                        this._updateTableGroup(node);
                    }
                }
            }
            for (i; i < this.connectors().length; i++) {
                connector = this.nameTable[this.connectors()[i].name];
                if (connector) {
                    this.connectors()[i] = connector;
                }
            }
        },
        _updateTableGroup: function (group) {
            var children = group.children;
            for (var i = 0; i < group.children.length; i++) {
                group.children[i] = this.nameTable[this._getChild(group.children[i])];
                if (group.children[i] && group.children[i]._type === "group") {
                    this._updateTableGroup(group.children[i]);
                }
            }
        },
        upgrade: function (data) {
            if (data) {
                //Support to upgrade diagram JSON data from 12.1
                var version = Number(data.version);
                if (isNaN(version) && data.version) {
                    version = data.version.split(".");
                    data.version = version = Number(version[0] + "." + version[1]);
                }
                if (!data.version) {
                    //CommonAPIChanges
                    this.commonAPIChanges(data);
                    //Node and Connector constraints set to default
                    if (data.nodes) {
                        for (var i = 0 ; i < data.nodes.length; i++) {
                            if (!data.nodes[i].inEdges) {
                                data.nodes[i].inEdges = [];
                                data.nodes[i].outEdges = [];
                            }
                            data.nodes[i].constraints = ej.datavisualization.Diagram.NodeConstraints.Default;
                        }
                    }
                }
                else if (version < 14.2) {
                    if (data.nodes) {
                        if (version < 14.1) {
                            for (var i = 0 ; i < data.nodes.length; i++) {
                                var node = data.nodes[i];
                                this.setConstraints(node);
                                if (node && (node.type === "native" || node.type === "image" || node.type === "html"))
                                    node.scale = "stretch";
                            }
                        }
                    }
                    if (data.connectors) {
                        for (var j = 0; j < data.connectors.length ; j++) {
                            var connector = data.connectors[j];
                            if (version < 14.1) {
                                connector.constraints |= ej.datavisualization.Diagram.ConnectorConstraints.PointerEvents;
                                if (connector.labels && connector.labels.length > 0) {
                                    for (var label, m = 0; m < connector.labels.length ; m++) {
                                        label = connector.labels[m];
                                        label.relativeMode = ej.datavisualization.Diagram.LabelRelativeMode.SegmentBounds;
                                    }
                                }
                            }
                            if (version < 14.2) {
                                if (connector && connector.segments && connector.segments.length === 1 && connector.segments[0].type === "orthogonal") {
                                    connector.segments[0].length = 13;
                                }
                            }
                        }
                    }
                }
                else if (data.version == "13.1") {
                    //No Code Changes
                }
                if (data.version < 15.4) {
                    if (data.scrollSettings) {
                        data.scrollSettings.minZoom = 0.25;
                        data.scrollSettings.maxZoom = 30;
                    }
                    else {
                        data.scrollSettings = {
                            horizontalOffset: 0,
                            verticalOffset: 0,
                            currentZoom: 1,
                            viewPortHeight: 0,
                            viewPortWidth: 0,
                            zoomFactor: 0.2,
                            minZoom: 0.25,
                            maxZoom: 30,
                            padding: { left: 0, right: 0, top: 0, bottom: 0 }
                        };
                    }
                }
                data.version = ej.version;
            }
        },
        setConstraints: function (node) {
            if (node && node.type == "group" && !node.isSwimlane) {
                node.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child.type == "group") {
                        this.setConstraints(child);
                    }
                    else {
                        child.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                    }
                }
            }
            else if (node && node.type == "group" && node.isSwimlane) {
                node.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                for (var j = 0; j < node.lanes.length; j++) {
                    var lane = node.lanes[j];
                    lane.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                    if (lane.children) {
                        for (var k = 0; k < lane.children.length; k++) {
                            var child = lane.children[k];
                            if (child.type == "group") {
                                this.setConstraints(child);
                            }
                            else {
                                child.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                            }
                        }
                    }
                }
            }
            else {
                node.constraints |= ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
            }
        },
        commonAPIChanges: function (data) {
            // defaultSettings API Added
            data.defaultSettings = { node: data.nodeDefaults, connectors: data.connectorDefaults };
            // line is changed to segments; Inserting segments
            if (data.connectors) {
                for (var i = 0 ; i < data.connectors.length; i++) {
                    //Setting the Connector's constraints to Default
                    data.connectors[i].constraints = ej.datavisualization.Diagram.ConnectorConstraints.Default;
                    if (data.connectors[i].line) {
                        if (data.connectors[i].line.type == "straight") {
                            var segments = [{
                                type: "straight",
                                startPoint: data.connectors[i].line.startPoint,
                                endPoint: data.connectors[i].line.endPoint
                            }];
                            this.commonSourceTargetChanges(data.connectors[i]);
                        }
                        else if (data.connectors[i].line.type == "orthogonal") {
                            var segments = [{
                                type: "orthogonal",
                                startPoint: data.connectors[i].line.startPoint,
                                endPoint: data.connectors[i].line.endPoint,
                            }];
                            this.commonSourceTargetChanges(data.connectors[i]);
                        }
                        else if (data.connectors[i].line.type == "bezier") {
                            var segments = [{
                                type: "bezier",
                                startPoint: data.connectors[i].line.startPoint,
                                endPoint: data.connectors[i].line.endPoint,
                                point1: data.connectors[i].line.point1,
                                point2: data.connectors[i].line.point2
                            }];
                            this.commonSourceTargetChanges(data.connectors[i]);
                        }
                        data.connectors[i].sourcePoint = data.connectors[i].line.startPoint;
                        data.connectors[i].targetPoint = data.connectors[i].line.endPoint;
                        data.connectors[i].segments = segments;
                    }
                }
            }
        },
        commonSourceTargetChanges: function (data) {
            if (data.sourceNodeName)
                data.sourceNode = data.sourceNodeName;
            if (data.sourceNodePort)
                data.sourcePort = data.sourceNodePort;
            if (data.targetNodeName)
                data.targetNode = data.targetNodeName;
            if (data.targetPortName)
                data.targetPort = data.targetPortName;
        },
        load: function (data) {
            if (data && data.version === "NewVersion") {
                data.version = ej.version;
            }
            this._isLoad = true;
            this._isOptimize = true;
            this._spatialSearch = ej.datavisualization.Diagram.SpatialSearch(this);
            this.clear();
            this._zOrder = 0;
            if (this.enableContextMenu()) {
                if (!this.model.serializationSettings.preventDefaultValues || data.contextMenu) {
                    var menuObj = $("#" + this.element[0].id + "_contextMenu").data("ejMenu");
                    menuObj.destroy();
                    $("#" + this.element[0].id + "_contextMenu").remove();
                }
            }

            if (data && data.nodes && data.nodes.length > 0) {
                for (var i = data.nodes.length - 1; i >= 0; i--) {
                    var node = data.nodes[i];
                    if (node && (node.type === "connector" || node.segments)) {
                        data.connectors.push(node);
                        data.nodes.splice(i, 1);
                    }
                    if (node._shape)
                        this._isOptimize = false;
                }
            }
            if (data && data.connectors && data.connectors.length > 0) {
                for (var i = data.connectors.length - 1; i >= 0; i--) {
                    var connector = data.connectors[i];
                    var isConnectorRemoved = false;
                    if (connector.targetNode) {
                        if (!this._isExist(data, connector.targetNode)) {
                            isConnectorRemoved = true;
                            data.connectors.splice(i, 1);
                        }
                    }
                    if (connector.sourceNode) {
                        if (!this._isExist(data, connector.sourceNode) && !isConnectorRemoved) {
                            data.connectors.splice(i, 1);
                        }
                    }
                }
            }
            if (data.selectedItems) {
                data.selectedItems.userHandles = this.model.selectedItems.userHandles ? this.model.selectedItems.userHandles : [];
            }
            this.upgrade(data);
            var load = {
                nodes: data.nodes ? data.nodes : [],
                connectors: data.connectors ? data.connectors : [],
                commandManager: data.commandManager ? data.commandManager : {},
                contextMenu: data.contextMenu ? data.contextMenu : {},
                snapSettings: data.snapSettings ? data.snapSettings : {},
                historyManager: data.historyManager ? data.historyManager : this._initHistoryManager(),
                backgroundImage: data.backgroundImage ? data.backgroundImage : ej.datavisualization.Diagram.BackgroundImage({ source: "" }),
                enableAutoScroll: data.enableAutoScroll ? data.enableAutoScroll : true,
                autoScrollMargin: data.autoScrollMargin ? data.autoScrollMargin : 20,
                layout: data.layout ? data.layout : {},
                pageSettings: data.pageSettings ? data.pageSettings : {},
                click: data.click ? data.click : null,
                connectionChange: data.connectionChange ? data.connectionChange : null,
                defaultSettings: data.defaultSettings ? data.defaultSettings : { node: null, connector: null },
                dataSourceSettings: data.dataSourceSettings ? data.dataSourceSettings : {},                
                doubleClick: data.doubleClick ? data.doubleClick : null,
                enableContextMenu: data.enableContextMenu === undefined ? true : data.enableContextMenu,
                tooltip: data.tooltip ? data.tooltip : null,
                height: data.height ? data.height : null,
                mouseEnter: data.mouseEnter ? data.mouseEnter : null,
                mouseOver: data.mouseOver ? data.mouseOver : null,
                mouseLeave: data.mouseLeave ? data.mouseLeave : null,
                nodeTemplate: data.nodeTemplate ? data.nodeTemplate : null,
                rotationChange: data.rotationChange ? data.rotationChange : null,
                selectedItems: data.selectedItems ? data.selectedItems : this.model.selectedItems,
                width: data.width ? data.width : null,
                constraints: data.constraints,
                phases: data.phases ? data.phases : [],
                scrollSettings: data.scrollSettings,
                rulerSettings: data.rulerSettings ? data.rulerSettings : this.rulerSettings,
            };
            this._tempCommandManager = data.commandManager;
            if (data.showTooltip !== undefined) {
                load.showTooltip = data.showTooltip;
            }
            if (data.tooltipTemplateId !== undefined) {
                load.tooltipTemplateId = data.tooltipTemplateId;
            }
            $("#" + this._id).ejDiagram(load);
            this._isLoad = false;
            delete this._isOptimize;
            delete this._tempCommandManager;
        },

        _isExist: function (data, name) {
            var isExist = false;
            for (var i = 0; data.nodes && i < data.nodes.length; i++) {
                if (!isExist) {
                    var node = data.nodes[i];
                    if (node) {
                        if (node.isSwimlane) {
                            if (node.lanes) {
                                var lanes = node.lanes;
                                for (var j = 0; j < lanes.length; j++) {
                                    isExist = this._checkNodeExist(lanes[j], name);
                                    if (isExist)
                                        break;
                                }
                            }
                        }
                        else {
                            isExist = this._checkNodeExist(node, name);
                            if (isExist)
                                break;
                        }
                    }
                }
            }
            return isExist;
        },
        _checkNodeExist: function (node, name) {
            if (node.children) {
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    var state = this._checkNodeExist(child, name)
                    if (state) return true;
                }
            }
            else if (this.model.serializationSettings.preventDefaultValues) {
                if (node && (node.subProcess && node.subProcess.events.length > 0 || node.task && node.task.events.length > 0)) {
                    var eventsCollection = node.subProcess.events.length > 0 ? node.subProcess.events : node.task.events;
                    for (var k = 0; k < eventsCollection.length; k++) {
                        if (eventsCollection[k].name === name) {
                            return true;
                        }
                    }
                }
            }
            if (node.name === name)
                return true;
            return false;
        },

        layout: function () {
            this._setLayout();
        },
        _setLayout: function () {
            //this.model.layout = new ej.datavisualization.Diagram.HierarchicalLayout(this.model.layout);
            this._doLayout();
            ej.datavisualization.Diagram.PageUtil._updatePageSize(this);
            this._clearSelection();
            //this._updateNodes();
            //this._updateConnectors();
        },
        addSelection: function (node, clearSelection) {
            var selectedItem, pseudoGroup;
            if (node && !this._selectionContains(node)) {
                if (this.model.selectedItems.children.length > 0 && !clearSelection) {
                    pseudoGroup = this.nameTable["multipleSelection"];
                    if (!pseudoGroup) {
                        pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                        this.nodes().push(pseudoGroup);
                        this.nameTable[pseudoGroup.name] = pseudoGroup;
                    }
                    if (this.model.selectedItems.children.length > 1)
                        pseudoGroup.children = this.selectionList[0].children;
                    else
                        pseudoGroup.children.push(this.selectionList[0].name)
                    pseudoGroup.children.push(node.name);
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this, null, true);
                    selectedItem = pseudoGroup;
                }
                else {
                    selectedItem = node;
                }
                if (this._hasSelection())
                    this._clearSelection(true);
                if (pseudoGroup && this.nameTable["multipleSelection"] === undefined && clearSelection === false) {
                    this.nodes().push(pseudoGroup);
                    this.nameTable[pseudoGroup.name] = pseudoGroup;
                }
                this._addSelection(selectedItem);
            }
        },

        clearSelection: function () {
            this._clearSelection();
        },
        removeSelection: function (node) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                if (node) {
                    var node = this.nameTable[node.name];
                    if (this.selectionList[0] == node || this.selectionList[0].type == "pseudoGroup" && this.selectionList[0].children.length == 1) { this._clearSelection(); }
                    else if (this.selectionList[0].type == "pseudoGroup" && this._collectionContains(node.name, this.selectionList[0].children)) {
                        var index = this.selectionList[0].children.indexOf(node.name);
                        if (index != -1)
                            ej.datavisualization.Diagram.Util.removeItem(this.selectionList[0].children, node.name);
                        else
                            ej.datavisualization.Diagram.Util.removeItem(this.selectionList[0].children, node);
                        ej.datavisualization.Diagram.Util.removeItem(this.model.selectedItems.children, node);
                        ej.datavisualization.Diagram.Util._updateGroupBounds(this.selectionList[0], this);
                        this._updateSelectionHandle();
                    }
                }
            }
        },
        updateSelectedObject: function (nodeName, parent) {
            var node = this.nameTable[nodeName];
            if (node && ej.datavisualization.Diagram.Util.enableLayerOption(node, "lock", this) && (ej.datavisualization.Diagram.Util.canSelect(node) || node._isHeader)) {
                this.activeTool.selectedObject = node;
            }
            if (parent && parent.isSwimlane)
                this.activeTool.selectedObject = parent
        },
        updateSelection: function (isDragging) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._updateSelectionHandle(isDragging);
            }
        },
        activateTool: function (toolName, singleAction) {
            if (this.tools[toolName]) {
                if (this.activeTool instanceof ej.datavisualization.Diagram.LineTool) {
                    this.activeTool._showAllPorts(true);
                }
                this._toolToActivate = toolName;
                this.activeTool = this.tools[this._toolToActivate];
                this.activeTool.singleAction = true;
                if (singleAction === false || toolName === "panTool")
                    this.activeTool.singleAction = false;
            }
            if (this.activeTool instanceof ej.datavisualization.Diagram.PanTool) {
                this._currentCursor = "pointer";
                this.activeTool.startPoint = ej.datavisualization.Diagram.Point(0, 0);
                this.activeTool._isMouseDown = false;
            }
            if (this.activeTool instanceof ej.datavisualization.Diagram.LineTool) {
                if (this.activeTool.singleAction)
                    this.tool(this.tool() | ej.datavisualization.Diagram.Tool.DrawOnce);
                else
                    this.tool(this.tool() | ej.datavisualization.Diagram.Tool.ContinuesDraw);
                this.activeTool._showAllPorts();
            }
            this._drawingTool = true;
        },
        deactivateTool: function () {
            if (this.activeTool instanceof ej.datavisualization.Diagram.LineTool) {
                this.activeTool._showAllPorts(true);
            }
            if (this.tool() & ej.datavisualization.Diagram.Tool.DrawOnce)
                this.tool(this.tool() ^ ej.datavisualization.Diagram.Tool.DrawOnce);
            if (this.tool() & ej.datavisualization.Diagram.Tool.ContinuesDraw)
                this.tool(this.tool() ^ ej.datavisualization.Diagram.Tool.ContinuesDraw);
            if (this.tool() & ej.datavisualization.Diagram.Tool.ZoomPan) {
                this._toolToActivate = "panTool";
                this.activeTool = this.tools[this._toolToActivate];
                this.activeTool._mousedown = false;
                this._currentCursor = "pointer";
            } else {
                this._toolToActivate = "select";
                this.activeTool = this.tools[this._toolToActivate];
                this.tool(ej.datavisualization.Diagram.Tool.SingleSelect | ej.datavisualization.Diagram.Tool.MultipleSelect);
            }
            this.activeTool._removeHighLighter();
            ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this._adornerSvg, this._adornerLayer);
        },
        updateLabel: function (nodeName, label, obj) {
            if (nodeName && (ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                var mNode = this._findNode(nodeName);
                if (!mNode)
                    mNode = this._findConnector(nodeName);
                if (obj && label && !obj.name || label.name == obj.name) {
                    if (mNode) {
                        if (obj.templateId && label.templateId && label.templateId != obj.templateId) {
                            ej.datavisualization.Diagram.DiagramContext.setLabelTemplate(mNode, label, this);
                        }
                        if (!this._isUndo)
                            this._recordPropertiesChanged(mNode, obj, "label", label);
                        if (mNode.type !== "text") {
                            label = this._findLabel(mNode, label.name);
                        }
                        obj.name = label.name;
                        this._comparePropertyValues(mNode, "labels", obj);
                        for (var prop in obj)
                            if (label.hasOwnProperty(prop)) {
                                if (typeof obj[prop] == "object")
                                    label[prop] = $.extend(true, {}, label[prop], obj[prop]);
                                else
                                    label[prop] = obj[prop];
                            }
                        if (obj["wrapText"] !== undefined) label["wrapping"] = obj["wrapText"] ? "wrapwithoverflow" : "nowrap";
                        if (mNode.segments || mNode.type !== "text") {
                            ej.datavisualization.Diagram.DiagramContext.updateLabelStyle(mNode, label, this);
                            ej.datavisualization.Diagram.DiagramContext.updateLabel(mNode, label, this);
                        } else if (mNode.type === "text") {
                            ej.datavisualization.Diagram.DiagramContext.updateTextBlock(mNode, label, this);
                        }
                        this._updateQuad(mNode);
                    }
                    if (obj.mode === ej.datavisualization.Diagram.LabelEditMode.Edit) {
                        this.startLabelEdit(mNode, label);
                    }
                }
            }
            return label;
        },
        startLabelEdit: function (node, label) {
            if (node) {
                //Disables the edit mode of labels in the selectionList
                for (var i = 0; i < this.selectionList.length; i++) {
                    var mNode = this.selectionList[i];
                    if (mNode !== node && typeof mNode.labels.length != "undefined") {
                        for (var j = 0; j < mNode.labels.length; j++)
                            mNode.labels[j].mode = ej.datavisualization.Diagram.LabelEditMode.View;
                    }
                }
                if (!label && node.type === "text")
                    label = node.textBlock;
                if (this._setLabelEditing(label))
                    this._startEdit(node);
                else {
                    this._endEdit();
                }
            }
        },
        _setSelectorConstraints: function (constraints) {
            this.model.selectedItems.constraints = constraints;
            if (this.selectionList[0]) {
                ej.datavisualization.Diagram.SvgContext.clearSelector(this._adornerSvg, this._adornerLayer, this);
                ej.datavisualization.Diagram.SvgContext.renderSelector(this.selectionList[0], this._adornerSvg, this._adornerLayer, this._currZoom, constraints, undefined, this);
                if (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                    ej.datavisualization.Diagram.SvgContext.renderUserHandles(this.model.selectedItems.userHandles, this.selectionList[0], this._adornerSvg, this.selectionList[0].type == "pseudoGroup",
                        this._currZoom, this._adornerLayer, this);
            }
        },
        _raiseGroupChangeEvent: function (element, oldParent, newParent, cause) {
            var args = {};
            args.element = element ? element : null;
            args.oldParent = oldParent ? oldParent : null;
            args.newParent = newParent ? newParent : null;
            args.cause = cause ? cause : null;
            if (oldParent != newParent)
                this._raiseEvent("groupChange", args);
            return args;
        },
        group: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup") {
                var selectionList = [];
                var i;
                for (i = 0; i < this.selectionList[0].children.length; i++)
                    selectionList.push(this.nameTable[this._getChild(this.selectionList[0].children[i])]);
                this._sortByZIndex(selectionList, true);
                var element;
                var groupName = ej.datavisualization.Diagram.Util.randomId();
                var group = new ej.datavisualization.Diagram.Group({ name: groupName, rotateAngle: this.selectionList[0].rotateAngle });
                var oldParent, newParent;
                this._clearSelection(true);
                for (i = 0; i < selectionList.length; i++) {
                    this._isUndo = true;
                    group.children.push(selectionList[i]);
                    if (selectionList[i].parent) {
                        oldParent = this.nameTable[selectionList[i].parent];
                        if (oldParent) {
                            ej.datavisualization.Diagram.Util.removeChildFromGroup(oldParent.children, selectionList[i]);
                        }
                    }
                    selectionList[i].parent = groupName;
                    ej.datavisualization.Diagram.Util.removeItem(this.selectionList, selectionList[i].name);
                    if (!selectionList[i].segments) {
                        ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this.nameTable[selectionList[i].name]);
                        this._nodes = $.extend(true, [], this.nodes());
                    }
                    else {
                        ej.datavisualization.Diagram.Util.removeItem(this.connectors(), this.nameTable[selectionList[i].name]);
                        this._connectors = $.extend(true, [], this.connectors());
                    }
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[selectionList[i].name], selectionList[i]);
                    if (selectionList[i].type == "html") {
                        element = document.getElementById(selectionList[i].name + "_parentdiv");
                        element.parentNode.removeChild(element);
                    } else {
                        if (selectionList[i]._type === "group")
                            this._checkForHtmlNode(selectionList[i]);
                    }
                    // $("#" + selectionList[i].name)[0].parentNode.removeChild($("#" + selectionList[i].name)[0]);
                    element = this._svg.document.getElementById(selectionList[i].name);
                    if (element)
                        element.parentNode.removeChild(element);
                    this._removeElement(selectionList[i]);
                    this._raiseGroupChangeEvent(selectionList[i], oldParent, group, "group");
                }
                ej.datavisualization.Diagram.Util.clear(this.selectionList);
                group = this._getNewGroup(group);
                this._eventCause["nodeCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.Unknown;
                this._isGroupNode = true;
                this.add(group);
                //this._addSelection(group);
                var entry = { type: "groupchanged", object: group, actionType: "group", category: "internal" };
                this.addHistoryEntry(entry);
                //var entry = new ej.datavisualization.Diagram.HistoryEntry(new ej.datavisualization.Diagram.GroupHandleCmd(group, "group"));
                //this.historyManager.addHistoryEntry(entry);
                this._isUndo = false;
                delete this._isGroupNode;
            }
        },
        _checkForHtmlNode: function (group) {
            var children = this._getChildren(group.children);
            for (var i = 0; i < children.length; i++) {
                var child = this.nameTable[children[i]];
                if (child) {
                    if (child._type === "group") {
                        this._checkForHtmlNode(child);
                    } else {
                        if (child.type == "html") {
                            var element = document.getElementById(child.name + "_parentdiv");
                            element.parentNode.removeChild(element);
                        }
                    }
                }
            }
        },
        _removeChildren: function (group, args) {
            var children = this._getChildren(group.children);
            for (var i = 0; i < children.length; i++) {
                var child = this.nameTable[children[i]];
                if (child) {
                    if (group.isLane || ((child.inEdges.length > 0) || (child.outEdges.length > 0))) {
                        this._disConnect(child, args);
                        this._removeConnector(child, args);
                    }
                    else {
                        if (child.segments) {
                            this._removeEdges(child);
                            child.sourceNode = child.sourcePort = child.targetNode = child.targetPort = null;
                        }
                        else {
                            this._disConnect(child, args, true);
                            // this._removeConnector(child, args);
                        }
                    }
                    ej.datavisualization.Diagram.Util.removeItem(this.nodes(), child);
                    this._nodes = $.extend(true, [], this.nodes());
                    if (child._type === "group") {
                        this._removeChildren(child, args);
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[child.name], child);
                        ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, child);
                        delete this.nameTable[child.name];
                    } else {
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[child.name], child);
                        ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, child);
                        delete this.nameTable[child.name];
                    }
                    this._removeElement(child);
                }
            }
        },
        ungroup: function () {
            if (this.selectionList[0] && this.selectionList[0]._type === "group" && this.selectionList[0].canUngroup && !(this.selectionList[0].isSwimlane || this.selectionList[0].isLane)) {
                this._isUndo = true;
                var selectionList = this.selectionList[0].children;
                var i, node;
                var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                node = this.selectionList[0];
                $("#" + this.selectionList[0].name)[0].parentNode.removeChild($("#" + this.selectionList[0].name)[0]);
                this._removeElement(this.selectionList[0]);
                this._checkForHtmlNode(this.selectionList[0]);
                this._clearSelection();
                var object;
                ej.datavisualization.Diagram.Util.clear(this.selectionList);
                var newParent, oldParent;
                for (i = 0; i < selectionList.length; i++) {
                    var item = this.nameTable[this._getChild(selectionList[i])];
                    if (item.parent)
                        oldParent = this.nameTable[item.parent];
                    if ($(htmlLayer).children("#" + item.name)[0])
                        htmlLayer.removeChild($(htmlLayer).children("#" + item.name)[0]);
                    if (item) {
                        if (item.parent)
                            item.parent = null;
                        if (item.segments) {
                            object = item;
                            object.parent = "";
                            this._updateEdges(object);
                            this._dock(object, this.nameTable);
                            ej.datavisualization.Diagram.DiagramContext.renderConnector(object, this);
                            if (this.connectors().indexOf(object) === -1) {
                                this.connectors().push(object);
                                this._connectors = $.extend(true, [], this.connectors());
                            }
                        }
                        else {
                            object = item;
                            object.parent = "";
                            if (object._type === "group") {
                                this._updateChildrenEdges(object);
                                if (object.isLane || object.isSwimlane) {
                                    object.width = 0;
                                    object.height = 0;
                                }
                                ej.datavisualization.Diagram.DiagramContext.renderGroup(object, this);
                            }
                            else
                                ej.datavisualization.Diagram.DiagramContext.renderNode(object, this);
                            if (this.nodes().indexOf(object) === -1) {
                                this.nodes().push(object);
                                this._nodes = $.extend(true, [], this.nodes());
                            }
                        }
                        if (item.parent)
                            newParent = this.nameTable[item.parent];
                        this._raiseGroupChangeEvent(item, oldParent, newParent, "unGroup");
                    }
                }
                //this._clearSelection();
                ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this._findNode(node.name));
                ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[node.name], node);
                ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, node);
                var entry = { type: "groupchanged", object: node, actionType: "ungroup", category: "internal" };
                this.addHistoryEntry(entry);

                //var entry = new ej.datavisualization.Diagram.HistoryEntry(new ej.datavisualization.Diagram.GroupHandleCmd(node, "ungroup"));
                //this.historyManager.addHistoryEntry(entry);
                this._isUndo = false;
            }
        },
        nudge: function (direction, delta) {
            delta = !delta ? 1 : delta;
            var dir = { up: { x: 0, y: -delta }, down: { x: 0, y: delta }, left: { x: -delta, y: 0 }, right: { x: delta, y: 0 } };
            var nudge = dir[direction];
            var undoDirection;
            if (direction === "up")
                undoDirection = "down";
            else if (direction === "down")
                undoDirection = "up";
            else if (direction === "left")
                undoDirection = "right";
            else if (direction === "right")
                undoDirection = "left";

            if (nudge && this.selectionList[0] && !this.selectionList[0].isLane && !this.selectionList[0].isPhase) {
                if (!this._isUndo) {
                    this.addHistoryEntry({
                        type: "nudge", object: this.selectionList[0], undoDirection: undoDirection, redoDirection: direction, values: delta,
                        category: "internal"
                    });
                }
                this._nudge(this.selectionList[0], nudge.x, nudge.y, direction);
            }
        },
        selectAll: function () {
            var collection, nodes, i, len, item = null;
            this._clearSelection(true);
            collection = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", name: "multipleSelection" });
            nodes = this.nodes();
            for (i = 0, len = nodes.length; i < len; i++) {
                if (ej.datavisualization.Diagram.Util.canSelect(nodes[i]) && ej.datavisualization.Diagram.Util.enableLayerOption(nodes[i], "lock", this)) {
                    item = this.nameTable[nodes[i].name];
                    if (item && item.parent == "" && item.type != "pseudoGroup" && item.visible) {
                        collection.children.push(item.name);
                    }
                }
            }
            var connectors = this.connectors();
            for (i = 0, len = connectors.length; i < len; i++) {
                if (ej.datavisualization.Diagram.Util.canSelect(connectors[i]) && ej.datavisualization.Diagram.Util.enableLayerOption(connectors[i], "lock", this)) {
                    if (connectors[i].parent == "" && connectors[i].visible) {
                        collection.children.push(connectors[i].name);
                    }
                }
            }
            ej.datavisualization.Diagram.Util._updateGroupBounds(collection, this);
            //ej.datavisualization.Diagram.Util.clear(this.selectionList);
            if (collection.children.length > 1) {
                this.nodes().push(collection);
                this._nodes = $.extend(true, [], this.nodes());
                this.nameTable[collection.name] = collection;
                this._addSelection(collection);
            }
            else if (collection.children.length === 1) {
                this._addSelection(this.nameTable[collection.children[0]]);
            }
        },
        align: function (direction) {
            if (this.selectionList[0] && (this.selectionList[0].type === "group" || this.selectionList[0].type == "pseudoGroup") && this.selectionList[0].children && this.selectionList[0].children.length > 0) {
                var list = this.nameTable[this.selectionList[0].name].children;
                var history = [];
                var cNode;
                var cornerNodes = this._findCornerNodes();
                if (direction === "left")
                    cNode = cornerNodes.left;
                else if (direction === "right")
                    cNode = cornerNodes.right;
                else if (direction === "top")
                    cNode = cornerNodes.top;
                else if (direction === "bottom")
                    cNode = cornerNodes.bottom;
                var cNodeBounds;
                if (cNode)
                    cNodeBounds = ej.datavisualization.Diagram.Util.bounds(cNode);
                else if (direction === "center" || direction === "middle") {
                    cNodeBounds = ej.datavisualization.Diagram.Util.bounds(this.selectionList[0]);
                }
                if (cNodeBounds) {
                    this._associatedConnectorsUpdate = true;
                    var i, bounds, node, x = 0, y = 0;
                    for (i = 0; i < list.length; i++) {
                        node = this.nameTable[this._getChild(list[i])];
                        bounds = ej.datavisualization.Diagram.Util.bounds(node);
                        if (direction === "left")
                            x = -(bounds.x - cNodeBounds.x);
                        else if (direction === "right")
                            x = -((bounds.x + bounds.width) - (cNodeBounds.x + cNodeBounds.width));
                        else if (direction === "top")
                            y = -(bounds.y - cNodeBounds.y);
                        else if (direction === "bottom")
                            y = -((bounds.y + bounds.height) - (cNodeBounds.y + cNodeBounds.height));
                        else if (direction === "center")
                            x = -((bounds.x + bounds.width / 2) - (cNodeBounds.x + cNodeBounds.width / 2));
                        else if (direction === "middle")
                            y = -((bounds.y + bounds.height / 2) - (cNodeBounds.y + cNodeBounds.height / 2));
                        this._moveNode(x, y, node);
                        this._updateContainerOnNudge(node);
                        history.push({ object: node, delta: { x: x, y: y } });
                    }
                    delete this._associatedConnectorsUpdate;

                    for (i = 0; i < list.length; i++) {
                        var node = this.nameTable[this._getChild(list[i])];
                        if (!node.segments) {
                            this._updateAssociateConnector(node)
                        }
                    }
                    ej.datavisualization.Diagram.Util._updateGroupBounds(this.selectionList[0], this);
                    ej.datavisualization.Diagram.SvgContext.updateSelector(this.selectionList[0], this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                }
                this.addHistoryEntry({ type: "alignCommand", values: history, category: "internal", object: this.selectionList[0] });
            }
        },
        _updateAssociateConnector: function (node) {
            if (node.children) {
                var child;
                var list = node.children;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        child = this.nameTable[this._getChild(list[i])];
                        if (child)
                            this._updateAssociateConnector(child);
                    }
                }
            }
            ej.datavisualization.Diagram.SvgContext._updateAssociatedConnector(node, this._svg, this);
        },
        sameSize: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup" && this.selectionList[0].children && this.selectionList[0].children.length > 0) {
                var list = this.nameTable[this.selectionList[0].name].children;
                var fNode = this.nameTable[this._getChild(this.selectionList[0].children[0])];
                var fNodeBounds = ej.datavisualization.Diagram.Util.bounds(fNode);
                var history = [];
                this._isSizingCommand = true;
                for (var i = 0; i < list.length; i++) {
                    var element = this.nameTable[this._getChild(list[i])];
                    if (!(element.segments)) {
                        //if ((element._shape === "path") && ((element.height !== fNodeBounds.height) || (element.width !== fNodeBounds.width)))
                        //    element._scaled = true;
                        history.push({ object: element, values: { width: element.width || element._width || 0, height: element.height || element._height || 0 } });
                        this.updateNode(element.name, { width: fNodeBounds.width, height: fNodeBounds.height });
                    }
                }
                delete this._isSizingCommand;
                this.addHistoryEntry({ type: "sizeCommand", category: "internal", object: this.selectionList[0], values: history });
                ej.datavisualization.Diagram.Util._updateGroupBounds(this.selectionList[0], this);
                ej.datavisualization.Diagram.SvgContext.updateSelector(this.selectionList[0], this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
            }
        },
        sameHeight: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup" && this.selectionList[0].children && this.selectionList[0].children.length > 0) {
                var list = this.nameTable[this.selectionList[0].name].children;
                var fNode = this.nameTable[this._getChild(this.selectionList[0].children[0])];
                var history = [];
                var fNodeBounds = ej.datavisualization.Diagram.Util.bounds(fNode);
                this._isSizingCommand = true;
                for (var i = 0; i < list.length; i++) {
                    var element = this.nameTable[this._getChild(list[i])];
                    if (!(element.segments)) {
                        //if ((element._shape === "path") && ((element.height !== fNodeBounds.height)))
                        //    element._scaled = true;
                        history.push({ object: element, values: { width: element.width || element._width || 0, height: element.height || element._height || 0 } });
                        this.updateNode(element.name, { height: fNodeBounds.height });
                    }
                }
                delete this._isSizingCommand;
                this.addHistoryEntry({ type: "sizeCommand", category: "internal", object: this.selectionList[0], values: history });
                ej.datavisualization.Diagram.Util._updateGroupBounds(this.selectionList[0], this);
                ej.datavisualization.Diagram.SvgContext.updateSelector(this.selectionList[0], this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
            }
        },
        sameWidth: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup" && this.selectionList[0].children && this.selectionList[0].children.length > 0) {
                var list = this.nameTable[this.selectionList[0].name].children;
                var fNode = this.nameTable[this._getChild(this.selectionList[0].children[0])];
                var fNodeBounds = ej.datavisualization.Diagram.Util.bounds(fNode);
                var history = [];
                this._isSizingCommand = true;
                for (var i = 0; i < list.length; i++) {
                    var element = this.nameTable[this._getChild(list[i])];
                    if (!(element.segments)) {
                        //if ((element._shape === "path") && (element.width !== fNodeBounds.width))
                        //    element._scaled = true;
                        history.push({ object: element, values: { width: element.width || element._width || 0, height: element.height || element._height || 0 } });
                        this.updateNode(element.name, { width: fNodeBounds.width });
                    }
                }
                delete this._isSizingCommand;
                this.addHistoryEntry({ type: "sizeCommand", category: "internal", object: this.selectionList[0], values: history });
                ej.datavisualization.Diagram.Util._updateGroupBounds(this.selectionList[0], this);
                ej.datavisualization.Diagram.SvgContext.updateSelector(this.selectionList[0], this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
            }
        },
        spaceDown: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup") {
                var lstSelections = this.selectionList[0].children;
                this._sliceDockLines(lstSelections);
                this._sortByYvalue(this.selectionList[0].children);
                var selectionCount = lstSelections.length, fSpacing;
                var history = [];
                if (lstSelections && selectionCount > 2) {
                    var cornerNodes = this._findCornerNodes();
                    var firstNode = cornerNodes.top;
                    var dHei = 0;
                    var pre = null, nxt = null;
                    for (var i = 0; i < lstSelections.length; i++) {
                        var pre = null, nxt = null;
                        pre = this.nameTable[this._getChild(lstSelections[i])];
                        nxt = this.nameTable[this._getChild(lstSelections[Number(i) + 1])];
                        if (pre && nxt) {
                            var preBounds = ej.datavisualization.Diagram.Util.bounds(pre);
                            var nxtBounds = ej.datavisualization.Diagram.Util.bounds(nxt);
                            dHei += nxtBounds.y - (preBounds.y + preBounds.height);
                        }
                    }
                    var space = dHei / (selectionCount - 1);
                    for (var i = 0; i < lstSelections.length; i++) {
                        pre = this.nameTable[this._getChild(lstSelections[i])];
                        nxt = this.nameTable[this._getChild(lstSelections[Number(i) + 1])];
                        if (pre && nxt) {
                            var preBounds = ej.datavisualization.Diagram.Util.bounds(pre);
                            var nxtBounds = ej.datavisualization.Diagram.Util.bounds(nxt);
                            this._comparePropertyOnAlign(nxt, 0, (preBounds.bottom - (nxtBounds.top)) + space);
                            this._translate(nxt, 0, (preBounds.bottom - (nxtBounds.top)) + space, this.nameTable);
                            history.push({ object: nxt, delta: { x: 0, y: (preBounds.bottom - (nxtBounds.top)) + space } });
                            this._updateQuad(this, nxt);
                            this._updateNodeMargin(nxt);
                            ej.datavisualization.Diagram.DiagramContext.update(nxt, this);
                        }
                    }
                    this.addHistoryEntry({ type: "spacingCommand", values: history, category: "internal", object: this.selectionList[0] });
                }
            }
        },
        spaceAcross: function () {
            if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup") {
                var lstSelections = this.selectionList[0].children;
                this._sliceDockLines(lstSelections);
                this._sortByXvalue(this.selectionList[0].children);
                var selectionCount = lstSelections.length, fSpacing;
                var history = [];
                if (lstSelections && selectionCount > 2) {
                    var cornerNodes = this._findCornerNodes();
                    var firstNode = cornerNodes.left;
                    var dWid = 0;
                    var pre = null, nxt = null;
                    for (var i = 0; i < lstSelections.length; i++) {

                        var pre = null, nxt = null;
                        pre = this.nameTable[this._getChild(lstSelections[i])];
                        nxt = this.nameTable[this._getChild(lstSelections[Number(i) + 1])];
                        if (pre && nxt) {
                            var preBounds = ej.datavisualization.Diagram.Util.bounds(pre);
                            var nxtBounds = ej.datavisualization.Diagram.Util.bounds(nxt);
                            dWid += nxtBounds.x - (preBounds.x + preBounds.width);
                        }
                    }
                    var space = dWid / (selectionCount - 1);
                    var sdx = 0;
                    for (var i = 0; i < lstSelections.length; i++) {
                        pre = this.nameTable[this._getChild(lstSelections[i])];
                        nxt = this.nameTable[this._getChild(lstSelections[Number(i) + 1])];
                        if (pre && nxt) {
                            var preBounds = ej.datavisualization.Diagram.Util.bounds(pre);
                            var nxtBounds = ej.datavisualization.Diagram.Util.bounds(nxt);
                            this._comparePropertyOnAlign(nxt, (preBounds.right - (nxtBounds.left)) + space, 0);
                            this._translate(nxt, (preBounds.right - (nxtBounds.left)) + space, 0, this.nameTable);
                            history.push({ object: nxt, delta: { x: (preBounds.right - (nxtBounds.left)) + space, y: 0 } });
                            this._updateQuad(this, nxt);
                            this._updateNodeMargin(nxt);
                            ej.datavisualization.Diagram.DiagramContext.update(nxt, this);
                        }
                    }
                    this.addHistoryEntry({ type: "spacingCommand", values: history, category: "internal", object: this.selectionList[0] });
                }
            }
        },
        sendBackward: function () {
            var ovarLapNodes, i;
            var prevNode;
            if (this.selectionList[0] && this.selectionList[0].type != "pseudoGroup") {
                var node = this.selectionList[0];
                if (node) {
                    ovarLapNodes = this._findOverlapNode(node, "sendBackward");
                    this._sortByZIndex(ovarLapNodes);
                    for (var k = 0; k < ovarLapNodes.length; k++)
                        if (node.zOrder > ovarLapNodes[k].zOrder) {
                            prevNode = ovarLapNodes[k];
                            break;
                        }
                    var start = node.zOrder;
                    if (prevNode) {
                        var end = prevNode.zOrder;
                        this._comparePropertyValues(node, "zOrder", { zOrder: end }, null, ej.datavisualization.Diagram.ActionType.Order);
                        this._sendElementsToBack(start, end, node, prevNode);
                        this.addHistoryEntry({ type: "zOrder", command: "back", start: end, end: start, nearestNode: prevNode, object: node, category: "internal" });
                    }
                }
            }
        },
        _sendElementsToBack: function (start, end, node, prevNode) {
            var i;
            for (i = end; i < start; i++) {
                if (node.parent != "") {
                    var object = this._findObjectByIndex(i, true);
                    if (object)
                        object.zOrder += 1;
                }
                else {
                    object = this._findObjectByIndex(i);
                    if (object)
                        object.zOrder += 1;
                }
            }
            this._deleteZorderProcess();
            if (node.parent != "") {
                if (node.parent) {
                    var parent = this.nameTable[node.parent];
                    this._findChildren(parent, node.name).zOrder = end;
                }
            } else
                this._findObjectByName(node.name).zOrder = end;
            var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var textElement = $(htmlLayer).find("#" + node.name + "_label")[0];
            var htmlElement = $(htmlLayer).find("#" + node.name + "_parentdiv")[0];
            var element = $(htmlLayer).find("#" + prevNode.name + "_parentdiv")[0];
            if (!element)
                element = $(htmlLayer).find("#" + prevNode.name)[0];
            if (element && htmlElement)
                element.parentNode.insertBefore(htmlElement, element);
            if (element && textElement)
                element.parentNode.insertBefore(textElement, element);
            this._svg.getElementById(prevNode.name).parentNode.insertBefore(this._svg.getElementById(node.name), this._svg.getElementById(prevNode.name));
            this._updateSelectionHandle();
        },
        _deleteZorderProcess: function () {
            var nodes = this.nodes();
            for (var i = 0 ; i < nodes.length; i++) {
                if (nodes[i]._isProcessed) delete nodes[i]._isProcessed;
            }
            var connectors = this.connectors()
            for (var i = 0 ; i < connectors.length; i++) {
                if (connectors[i]._isProcessed) delete connectors[i]._isProcessed;
            }
        },
        _bringElementsToFront: function (start, end, node, prevNode) {
            var i;
            for (i = end; i > start; i--) {
                if (node.parent != "") {
                    var obj = this._findObjectByIndex(i, true)
                    if (obj)
                        obj.zOrder -= 1;
                }
                else {
                    obj = this._findObjectByIndex(i);
                    if (obj)
                        obj.zOrder -= 1;
                }
            }
            this._deleteZorderProcess();
            if (node.parent) {
                var parent = this.nameTable[node.parent];
                this._findChildren(parent, node.name).zOrder = end;
            } else
                this._findObjectByName(node.name).zOrder = end;
            var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var textElement = $(htmlLayer).find("#" + node.name + "_label")[0];
            var textElement1 = $(htmlLayer).find("#" + prevNode.name + "_label")[0];
            var htmlElement = $(htmlLayer).find("#" + node.name + "_parentdiv")[0];
            var element = $(htmlLayer).find("#" + prevNode.name + "_parentdiv")[0];
            if (!element)
                element = $(htmlLayer).find("#" + prevNode.name)[0];
            if (textElement1 && htmlElement)
                textElement1.parentNode.insertBefore(htmlElement, textElement1.nextSibling);
            if (htmlElement && textElement)
                htmlElement.parentNode.insertBefore(textElement, htmlElement.nextSibling);
            if (element && htmlElement)
                element.parentNode.insertBefore(htmlElement, element.nextSibling);
            this._svg.getElementById(prevNode.name).parentNode.insertBefore(this._svg.getElementById(node.name), this._svg.getElementById(prevNode.name).nextSibling);
            this._updateSelectionHandle();
        },
        moveForward: function () {
            var ovarLapNodes, i;
            var prevNode;
            if (this.selectionList[0] && this.selectionList[0].type != "pseudoGroup") {
                var node = this.selectionList[0];
                if (node) {
                    ovarLapNodes = this._findOverlapNode(node, "moveForward");
                    this._sortByZIndex(ovarLapNodes);
                    for (var k = ovarLapNodes.length - 1; k >= 0; k--)
                        if (node.zOrder < ovarLapNodes[k].zOrder) {
                            prevNode = ovarLapNodes[k];
                            break;
                        }

                    var start = node.zOrder;
                    if (prevNode) {
                        var end = prevNode.zOrder;
                        this._comparePropertyValues(node, "zOrder", { zOrder: end }, null, ej.datavisualization.Diagram.ActionType.Order);
                        this._bringElementsToFront(start, end, node, prevNode);
                        this.addHistoryEntry({ type: "zOrder", command: "front", start: end, end: start, nearestNode: prevNode, object: node, category: "internal" });
                    }
                }
            }
        },
        sendToBack: function () {
            var node = this.selectionList[0];
            var prevNode;
            if (node && node.type != "pseudoGroup") {
                var ovarLapNodes = this._findOverlapNode(node, "sendToBack");
                var nodes = this._sortByZIndex(ovarLapNodes);
                var start = node.zOrder;
                var end = node.zOrder;
                var firstNode;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].zOrder < end) {
                        if (i == 0) firstNode = nodes[i];
                        end = nodes[i].zOrder;
                        prevNode = nodes[i];
                    }
                }
                if (prevNode) {
                    this._comparePropertyValues(node, "zOrder", { zOrder: end }, null, ej.datavisualization.Diagram.ActionType.Order);
                    this._sendElementsToBack(start, end, node, prevNode);
                    this.addHistoryEntry({ type: "zOrder", command: "back", start: end, end: start, nearestNode: firstNode, object: node, category: "internal" });
                }
            }
        },
        bringToFront: function () {
            var node = this.selectionList[0];
            var prevNode;
            if (node && node.type != "pseudoGroup") {
                var ovarLapNodes = this._findOverlapNode(node, "bringToFront");
                var nodes = this._sortByZIndex(ovarLapNodes);
                var start = node.zOrder;
                var end = node.zOrder;
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].zOrder > end) {
                        end = nodes[i].zOrder;
                        prevNode = nodes[i];
                    }
                }
                if (prevNode) {
                    this._comparePropertyValues(node, "zOrder", { zOrder: end }, null, ej.datavisualization.Diagram.ActionType.Order);
                    this._bringElementsToFront(start, end, node, prevNode);
                    this.addHistoryEntry({ type: "zOrder", command: "front", start: end, end: start, nearestNode: nodes[i - 1], object: node, category: "internal" });
                }
            }
        },
        _getChildFromCollection: function (collection, name) {
            if (collection && collection.length > 0 && name) {
                for (var i = 0; i < collection.length; i++) {
                    if (collection[i].name === name)
                        return collection[i];
                }
            }
        },

        _updateNameTable: function (node) {
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    var child = typeof node.children[i] == "object" ? node.children[i] : null;
                    if (child) {
                        this.nameTable[child.name] = child;
                        if (child.children && child.children.length > 0)
                            this._updateNameTable(child);
                    }
                }
            }
        },
        _recordPageSettingsChanged: function (args) {
            var value = args.redoObject;
            if (args.isUndo)
                value = args.undoObject;
            if (value)
                this.updatePageSettings(value);
        },
        _recordMultiRotationChanged: function (args) {
            ej.datavisualization.Diagram.canvasHelper._undoMultiRotateNode(this, args);
        },
        _recordMultiPinPointChanged: function (args) {
            ej.datavisualization.Diagram.canvasHelper._undoMultiDragNode(this, args);
        },
        _recordMultiSizeChanged: function (args) {
            ej.datavisualization.Diagram.canvasHelper._undoMultiResizeNode(this, args);
        },
        undo: function () {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this)) && ej.datavisualization.Diagram.Util.canUndo(this)) {
                var args;
                this._getHistoryList();
                this._isUndo = true;
                var entryItem = this.getUndoEntry();
                if (entryItem) {
                    if (entryItem.type == "closeGroup") {
                        this._groupUndo = true;
                    }
                    else if (entryItem.type == "startGroup") {
                        this._groupUndo = false;
                    }
                    else this._undo(entryItem);
                    if (this._groupUndo) {
                        entryItem = this.getUndoEntry();
                        while (entryItem && entryItem.type != "startGroup") {
                            this._undo(entryItem);
                            if (!this._groupUndo) {
                                break;
                            }
                            entryItem = this.getUndoEntry();
                        }
                        delete this._groupUndo;
                    }
                }
                this._isUndo = false;
            }
        },
        redo: function () {
            this._isUndo = true;
            //this.historyManager.redo();
            var entryItem = this.getRedoEntry();
            if (entryItem) {
                if (entryItem.type == "startGroup") {
                    this._groupRedo = true;
                }
                else this._redo(entryItem);
                if (this._groupRedo) {
                    entryItem = this.getRedoEntry();
                    while (entryItem && entryItem.type != "closeGroup") {
                        this._isUndo = true;
                        this._redo(entryItem);
                        entryItem = this.getRedoEntry();
                    }
                    delete this._groupRedo;
                }
            }
            this._isUndo = false;
        },


        _ComparehistoryChangeEvent: function (object, entryItem) {
            var item, i, objNode, argument;
            var changes = { source: [], changes: [] };
            switch (entryItem.type) {
                case "positionchanged":
                case "rotationchanged":
                case "sizechanged":
                    changes = this._getPseudoGroupElements(object, entryItem);
                    break;
                case "endpointchanged":
                    var args;
                    if (this._UndoRedo) {
                        args = this._historyChangeEvent(entryItem.undoObject, entryItem.redoObject, entryItem);
                        argument = { type: entryItem.type, oldValues: args.changes ? args.changes.oldValues : args.oldValues, newValues: args.changes ? args.changes.newValues : args.newValues, cancel: false };
                        changes.source.push(entryItem.undoObject);
                    }
                    else {
                        args = this._historyChangeEvent(entryItem.redoObject, entryItem.undoObject, entryItem);
                        argument = { type: entryItem.type, oldValues: args.changes ? args.changes.oldValues : args.oldValues, newValues: args.changes ? args.changes.newValues : args.newValues, cancel: false };
                        changes.source.push(entryItem.redoObject);
                    }
                    changes.changes.push(argument);
                    break;
                case "collectionchanged":
                    if (entryItem.changeType == "remove")
                        argument = { type: entryItem.type, addedItems: [], deletedItems: [object] };
                    if (entryItem.changeType == "insert")
                        argument = { type: entryItem.type, addedItems: [object], deletedItems: [] };
                    changes.changes.push(argument);
                    changes.source.push(object);
                    break;
                case "labelchanged":
                    if (this._UndoRedo)
                        argument = { type: entryItem.type, newValues: { text: entryItem.previousLabelValue }, oldValues: { text: entryItem.updatedLabelValue } };
                    else
                        argument = { type: entryItem.type, newValues: { text: entryItem.updatedLabelValue }, oldValues: { text: entryItem.previousLabelValue } };
                    changes.changes.push(argument);
                    changes.source.push(entryItem.shape);
                    break;
                case "labelcollectionchanged":
                    argument = { type: entryItem.type, source: entryItem.shape, addedItems: [entryItem.label], deletedItems: [] };
                    changes.changes.push(argument);
                    changes.source.push(entryItem.shape);
                case "groupchanged":
                    if (entryItem.actionType == "group")
                        argument = { type: entryItem.type, source: entryItem.object, addedItems: [entryItem.object], deletedItems: [] };
                    else
                        argument = { type: entryItem.type, source: entryItem.object, addedItems: [], deletedItems: [entryItem.object] }
                    changes.changes.push(argument);
                    changes.source.push(entryItem.object);
                    break;
                case "phasepositionchanged":
                    if (this._UndoRedo) {
                        argument = { type: entryItem.type, newValues: { offset: entryItem.undoObject.offset }, oldValues: { offset: entryItem.redoObject.offset } };
                        changes.source.push(entryItem.undoObject);
                    }
                    else {
                        argument = { type: entryItem.type, newValues: { offset: entryItem.redoObject.offset }, oldValues: { offset: entryItem.undoObject.offset } };
                        changes.source.push(entryItem.redoObject);
                    }
                    changes.changes.push(argument);
                    break;
                case "phasecollectionchanged":
                    if (entryItem.isAdded)
                        argument = { type: entryItem.type, addedItems: [entryItem.phase], deletedItems: [] };
                    else
                        argument = { type: entryItem.type, addedItems: [], deletedItems: [entryItem.phase] };
                    changes.source.push(entryItem.phase);
                    changes.changes.push(argument);
                    break;
                case "propertiesChanged":
                    argument = this._propertyChangeEventValues(entryItem);
                    changes.source.push(argument.source);
                    changes.changes.push(argument.changes);
                    break;
                case "portscollectionchanged":
                    if (entryItem.changeType == "insert")
                        argument = { type: entryItem.type, addedItems: [entryItem.collection], deletedItems: [] };
                    if (entryItem.changeType == "remove")
                        argument = { type: entryItem.type, addedItems: [], deletedItems: [entryItem.collection] };
                    changes.source.push(entryItem.object);
                    changes.changes.push(argument);
                    break;
                case "nudge":
                    var newValues = {}, oldValues = {};
                    if (entryItem.object._type !== "label") {
                        if (this._UndoRedo) {
                            if (entryItem.undoDirection == "left") {
                                newValues.offsetX = entryItem.object.offsetX - entryItem.values;
                                oldValues.offsetX = entryItem.object.offsetX;
                            }
                            if (entryItem.undoDirection == "right") {
                                newValues.offsetX = entryItem.object.offsetX + entryItem.values;
                                oldValues.offsetX = entryItem.object.offsetX;
                            }
                            if (entryItem.undoDirection == "up") {
                                newValues.offsetY = entryItem.object.offsetY - entryItem.values;
                                oldValues.offsetY = entryItem.object.offsetY;
                            }
                            if (entryItem.undoDirection == "down") {
                                newValues.offsetY = entryItem.object.offsetY + entryItem.values;
                                oldValues.offsetY = entryItem.object.offsetY;
                            }
                            argument = { type: entryItem.type, newValues: newValues, oldValues: oldValues };
                        }
                        else {
                            if (entryItem.redoDirection == "left") {
                                newValues.offsetX = entryItem.object.offsetX - entryItem.values;
                                oldValues.offsetX = entryItem.object.offsetX;
                            }
                            if (entryItem.redoDirection == "right") {
                                newValues.offsetX = entryItem.object.offsetX + entryItem.values;
                                oldValues.offsetX = entryItem.object.offsetX;
                            }
                            if (entryItem.redoDirection == "up") {
                                newValues.offsetY = entryItem.object.offsetY - entryItem.values;
                                oldValues.offsetY = entryItem.object.offsetY;
                            }
                            if (entryItem.redoDirection == "down") {
                                newValues.offsetY = entryItem.object.offsetY + entryItem.values;
                                oldValues.offsetY = entryItem.object.offsetY;
                            }
                            argument = { type: entryItem.type, newValues: newValues, oldValues: oldValues };
                        }
                    }
                    else
                        argument = this._labelNudge(entryItem);
                    changes.source.push(entryItem.object);
                    changes.changes.push(argument);
                    break;
                case "spacingCommand":
                case "alignCommand":
                    var newValues = {}, oldValues = {}, newVal = [], oldVal = [];
                    for (var i = 0; i < entryItem.values.length; i++) {
                        var node = entryItem.values[i];
                        if (!node.object.segments) {
                            newValues = { offsetX: node.object.offsetX - node.delta.x, offsetY: node.object.offsetY - node.delta.y };
                            newVal.push(newValues);
                            oldValues = { offsetX: node.object.offsetX, offsetY: node.object.offsetY };
                            oldVal.push(oldValues);
                        }
                        else {
                            var connector = $.extend(true, {}, node.object);
                            oldValues = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint };
                            oldVal.push(oldValues);
                            ej.datavisualization.Diagram.Util._translateLine(connector, node.delta.x, node.delta.y);
                            newValues = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint };
                            newVal.push(newValues);
                        }
                    }
                    argument = { type: entryItem.type, newValues: newVal, oldValues: oldVal };
                    changes.source.push(entryItem.object);
                    changes.changes.push(argument);
                    break;
                case "sizeCommand":
                    var newValues = {}, oldValues = {}, newVal = [], oldVal = [];
                    for (var i = 0; i < entryItem.values.length; i++) {
                        var node = entryItem.values[i];
                        newValues = { width: node.values.width, height: node.values.height };
                        newVal.push(newValues);
                        oldValues = { width: node.object.width, height: node.object.height };
                        oldVal.push(oldValues);
                    }
                    argument = { type: entryItem.type, newValues: newVal, oldValues: oldVal };
                    changes.source.push(entryItem.object);
                    changes.changes.push(argument);
                    break;
                case "zOrder":
                    argument = { type: entryItem.type, source: entryItem.object, newValues: { zOrder: entryItem.end }, oldValues: { zOrder: entryItem.object.zOrder } };
                    changes.source.push(entryItem.object);
                    changes.changes.push(argument);
                    break;
            }
            return changes;
        },
        _labelNudge: function (entryItem) {
            var node = this.findNode(entryItem.object._parent);
            var newValues = {}, oldValues = {}, argument;
            var direction = this._UndoRedo ? entryItem.undoDirection : entryItem.redoDirection;
            if (direction == "left" || direction == "right") {
                newValues.offsetX = (direction == "left") ? (entryItem.object.offset.x - (entryItem.values / node.width)) : (entryItem.object.offset.x + (entryItem.values / node.width));
                oldValues.offsetX = entryItem.object.offset.x;
            }
            else if (direction == "up" || direction == "down") {
                newValues.offsetY = (direction == "up") ? (entryItem.object.offset.y - (entryItem.values / node.height)) : (entryItem.object.offset.y + (entryItem.values / node.height));
                oldValues.offsetY = entryItem.object.offset.y;
            }
            argument = { type: entryItem.type, newValues: newValues, oldValues: oldValues };
            return argument;
        },
        _getPseudoGroupElements: function (object, entryItem) {
            var item, i, objNode, argument;
            var changes;
            var originalObject = this._UndoRedo || !this._isUndo ? entryItem.undoObject.node : entryItem.redoObject.node;
            argument = { source: [], changes: [] };
            if (object && object.type == "pseudoGroup") {
                var children = this._getChildren(object.children);
                for (i = 0; i < children.length; i++) {
                    item = this.nameTable[this._getChild(children[i])];
                    var objNode = this._UndoRedo || !this._isUndo ? entryItem.undoObject.childTable[children[i]] : entryItem.redoObject.childTable[children[i]];
                    if (!this._isUndo) {
                        changes = this._historyChangeEvent(item, objNode, entryItem);
                    }
                    else {
                        changes = this._historyChangeEvent(objNode, item, entryItem);
                    }
                    if (changes.source)
                        argument.source.push(changes.source);
                    if (changes.changes)
                        argument.changes.push(changes.changes);
                }
            }
            else {
                if (!this._isUndo) {
                    changes = this._historyChangeEvent(object, originalObject, entryItem);
                }
                else {
                    changes = this._historyChangeEvent(originalObject, object, entryItem);
                }
                if (changes.source)
                    argument.source.push(changes.source);
                if (changes.changes)
                    argument.changes.push(changes.changes);
            }
            return argument;
        },

        _propertyChangeEventValues: function (entryItem) {
            var args;
            var changes = [];
            var values = entryItem.updateValues ? entryItem.updateValues : entryItem.values;
            if (entryItem.elementType == "label") {
                var node = entryItem.label;
            }
            else if (entryItem.elementType == "port") {
                var node = entryItem.port;
            }
            else {
                var node = entryItem.object;
            }
            var oldValues = {}, newValues = {};
            for (var property in values) {
                if (node[property] != values[property]) {
                    oldValues[property] = node[property];
                    newValues[property] = values[property];
                }
            }
            args = { type: entryItem.type, newValues: newValues, oldValues: oldValues, deletedItems: [], addedItems: [] };
            changes.push(args);
            return { changes: changes, source: node };
        },

        _historyChangeEvent: function (object, originalObject, entryItem) {
            var args = { type: entryItem.type, deletedItems: [], addedItems: [], oldValues: {}, newValues: {} };
            if (object.offsetX != originalObject.offsetX) {
                args.oldValues.offsetX = originalObject.offsetX;
                args.newValues.offsetX = object.offsetX;
            }
            if (object.offsetY != originalObject.offsetY) {
                args.oldValues.offsetY = originalObject.offsetY;
                args.newValues.offsetY = object.offsetY;
            }
            if (object.width != originalObject.width) {
                args.oldValues.width = originalObject.width;
                args.newValues.width = object.width;
            }
            if (object.height != originalObject.height) {
                args.oldValues.height = originalObject.height;
                args.newValues.height = object.height;
            }
            if (object.rotateAngle != originalObject.rotateAngle) {
                args.oldValues.rotateAngle = originalObject.rotateAngle;
                args.newValues.rotateAngle = object.rotateAngle;
            }
            if (object.sourcePoint || originalObject.sourcePoint) {
                var newObject = object.sourcePoint || {};
                var oldObject = originalObject.sourcePoint || {};
                if (newObject.x != oldObject.x || newObject.y != oldObject.y) {
                    args.oldValues.sourcePoint = originalObject.sourcePoint;
                    args.newValues.sourcePoint = object.sourcePoint;
                }
            }
            if (object.targetPoint || originalObject.targetPoint) {
                var newObject = object.targetPoint || {};
                var oldObject = originalObject.targetPoint || {};
                if (newObject.x != oldObject.x || newObject.y != oldObject.y) {
                    args.oldValues.targetPoint = originalObject.targetPoint;
                    args.newValues.targetPoint = object.targetPoint;
                }
            }
            return { changes: args, source: originalObject };
        },

        _undo: function (entryItem) {
            var argument = [];
            this._UndoRedo = true;

            if (entryItem) {
                if (entryItem.category == "internal") {
                    var object = entryItem.object || (entryItem.undoObject ? entryItem.undoObject.node || entryItem.undoObject : undefined) || entryItem.shape;
                    if (!object && entryItem.phase) object = entryItem.phase;
                    if (object && entryItem.undoObject && entryItem.undoObject.node)
                        object = this.nameTable[object.name] || object;
                    if (!object) {
                        this.undo();
                        return;
                    }
                    if (this.model.historyManager.undoStack.length > 0) {
                        var addObject = this.model.historyManager.undoStack.splice(0, 1);
                        this.model.historyManager.redoStack.splice(0, 0, addObject[0]);
                    }
                    argument = this._ComparehistoryChangeEvent(object, entryItem);
                    argument.cause = ej.datavisualization.Diagram.HistoryChangeCause.Undo;
                    this._raiseEvent("historyChange", argument);
                    if (object && object.parent)
                        var parent = typeof object.parent == "object" ? object.parent.name : object.parent;
                    if (parent && !object.isLane) {
                        if (!this.nameTable[parent]) {
                            this._isUndo = false;
                            this.undo();
                            return;
                        }
                    }
                    var args;
                    switch (entryItem.type) {
                        case "pagesettingschanged":
                            var entry = { isUndo: true, undoObject: entryItem.undoObject, redoObject: entryItem.redoObject }
                            this._recordPageSettingsChanged(entry);
                            break;
                            break;
                        case "positionchanged":
                            if (entryItem.swimlaneMultiSelection) {
                                entryItem.undo = true;
                                this._recordMultiPinPointChanged(entryItem);
                            }
                            else {
                                args = { object: entryItem.undoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordPinPointChanged(args);
                            }
                            this._undoredoUpdateRouting(entryItem.undoObject.connectors);
                            break;
                        case "rotationchanged":
                            if (entryItem.swimlaneMultiSelection) {
                                entryItem.undo = true;
                                this._recordMultiRotationChanged(entryItem);
                            }
                            else {
                                args = { object: entryItem.undoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordRotationChanged(args);
                            }
                            this._undoredoUpdateRouting(entryItem.undoObject.connectors);
                            break;
                        case "sizechanged":
                            entryItem.undo = true;
                            if (entryItem.swimlaneMultiSelection) {
                                this._recordMultiSizeChanged(entryItem);
                            }
                            else {
                                args = { object: entryItem.undoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordSizeChanged(args, entryItem);
                            }
                            this._undoredoUpdateRouting(entryItem.undoObject.connectors);
                            break;
                        case "endpointchanged":
                            args = { undoObject: entryItem.undoObject, redoObject: entryItem.redoObject, removePortType: entryItem.removePortType, removedPort: entryItem.removedPort, isMultipleNode: entryItem.isMultipleNode, _isUndo: true };
                            this._recordEndPointChanged(args);
                            break;
                        case "collectionchanged":
                            if (entryItem.changeType == "insert") {
                                if (!this.nameTable[entryItem.object.name]) {
                                    if (entryItem.object._type !== "pseudoGroup") {
                                        if (this._groupUndo) return;
                                        this._isUndo = false;
                                        this.undo();
                                    }
                                }
                            }
                            args = { changeType: entryItem.changeType, childTable: entryItem.childTable, edgeTable: entryItem.edgeTable, isUndo: true, sourcePorts: entryItem.sourcePorts, targetPorts: entryItem.targetPorts, index: entryItem.index };
                            args.object = jQuery.extend(true, {}, entryItem.object);
                            var update = this._recordCollectionChanged(args, entryItem);
                            if (update) {
                                entryItem.sourcePorts = args.sourcePorts;
                                entryItem.targetPorts = args.targetPorts;
                                entryItem.edgeTable = args.edgeTable;
                                entryItem.childTable = args.childTable;
                            }
                            break;
                        case "labelchanged":
                            args = { object: entryItem.shape, label: entryItem.previousLabelValue, index: entryItem.index ? entryItem.index : 0 };
                            this._recordLabelChanged(args);
                            break;
                        case "labelpositionchanged":
                            entryItem.undo = true;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelsizechanged":
                            entryItem.undo = true;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelrotationchanged":
                            entryItem.undo = true;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelcollectionchanged":
                            entryItem.isUndo = true;
                            this.labelcollectionchanged(entryItem);
                            break;
                        case "groupchanged":
                            args = { object: entryItem.object, isUndo: true, actionType: entryItem.actionType };
                            this._recordGroupChanged(args);
                            break;
                        case "phasepositionchanged":
                            entryItem.undo = true;
                            this._recordPhasesizeChanged(entryItem);
                            break;
                        case "phasecollectionchanged":
                            entryItem = $.extend(true, {}, { phase: entryItem.phase, group: entryItem.group, isAdded: entryItem.isAdded, phaseObject: entryItem.phaseObject, islastPhase: entryItem.islastPhase, });
                            entryItem.undo = true;
                            this._recordPhaseCollectionChanged(entryItem);
                            break;
                        case "propertiesChanged":
                            var node = this.nameTable[entryItem.object.name];
                            if (node) {
                                var currentState = this._getModifiedProperties(node, entryItem.values, entryItem[entryItem.elementType]);
                                if (entryItem.elementType == "node")
                                    this.updateNode(node.name, entryItem.values);
                                else if (entryItem.elementType == "connector")
                                    this.updateConnector(node.name, entryItem.values);
                                else if (entryItem.elementType == "label")
                                    entryItem.label = this.updateLabel(node.name, entryItem.label, entryItem.values);
                                else if (entryItem.elementType == "port")
                                    this.updatePort(node.name, entryItem.port, entryItem.values);
                                entryItem.values = currentState;
                            }
                            break;
                        case "portpositionchanged":
                            entryItem.undo = true;
                            this._recordPortPositionChanged(entryItem);
                            break;
                        case "portscollectionchanged":
                            entryItem.isUndo = true;
                            this._recordPortsCollectionChanged(entryItem);
                            break;
                        case "nudge":
                            this._recordNudgingChanges(object, entryItem);
                            break;
                        case "spacingCommand":
                        case "alignCommand":
                            this._recordAlignCommandChanges(entryItem);
                            break;
                        case "sizeCommand":
                            this._recordSizeCommandChanges(entryItem);
                            break;
                        case "swapLane":
                            entryItem = jQuery.extend(true, {}, { undoObject: entryItem.undoObject, redoObject: entryItem.redoObject, moveIndex: entryItem.moveIndex, insertIndex: entryItem.currentIndex });
                            entryItem.undo = true;
                            ej.datavisualization.Diagram.canvasHelper._undoSwap(this, entryItem);
                            break;
                        case "zOrder":
                            var end = entryItem.start;
                            var node = this.nameTable[entryItem.object.name];
                            this._comparePropertyValues(node, "zOrder", { zOrder: entryItem.end });
                            if (entryItem.command == "back") {
                                this._bringElementsToFront(entryItem.start, entryItem.end, entryItem.object, entryItem.nearestNode);
                                entryItem.command = "front";
                            }
                            else {
                                this._sendElementsToBack(entryItem.start, entryItem.end, entryItem.object, entryItem.nearestNode);
                                entryItem.command = "back";
                            }
                            entryItem.nearestNode = this._findObjectByIndex(end);
                            var temp = entryItem.start;
                            entryItem.start = entryItem.end;
                            entryItem.end = temp;
                            this._deleteZorderProcess();
                            break;
                    }
                    if (!entryItem.activeLabel) {
                        if (this.selectionList.length && object && this.selectionList[0].name != object.name) {
                            this._clearSelection(true);
                            this._addSelection(this.nameTable[object.name], true);
                        }
                    }
                    else {
                        this._clearSelection(true);
                        this._addSelection(entryItem.activeLabel, true);
                    }
                } else {
                    if (this.model.historyManager.undo) {
                        var undo = this.model.historyManager.undo;
                        if (typeof undo == "string") undo = ej.util.getObject(undo, window);
                        if ($.isFunction(undo)) {
                            var data = undo(entryItem.data);
                            if (data) entryItem.data = data;
                        }
                    }
                }
            }
        },
        _undoredoUpdateRouting: function (connectors) {
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this) && connectors) {
                var keys = Object.keys(connectors);
                for (var i = 0; i < keys.length; i++) {
                    var edge = this.nameTable[keys[i]];
                    edge._undoSegments = connectors[keys[i]].segments
                    this._resetConnectorPoints(edge, null);
                    delete edge._undoSegments;
                }
            }
        },
        _redo: function (entryItem) {
            var argument = [];
            this._UndoRedo = false;
            if (entryItem) {
                if (entryItem.category == "internal") {
                    var object = entryItem.object || (entryItem.undoObject ? entryItem.undoObject.node || entryItem.undoObject : undefined) || entryItem.shape;
                    if (!object && entryItem.phase) object = entryItem.phase;
                    if (object && entryItem.undoObject && entryItem.undoObject.node)
                        object = this.nameTable[object.name] || object;
                    if (!object) {
                        this.redo();
                        return;
                    }

                    if (this.model.historyManager.redoStack.length > 0) {
                        var addObject = this.model.historyManager.redoStack.splice(0, 1);
                        this.model.historyManager.undoStack.splice(0, 0, addObject[0]);
                    }
                    argument = this._ComparehistoryChangeEvent(object, entryItem);
                    argument.cause = ej.datavisualization.Diagram.HistoryChangeCause.Redo;
                    this._raiseEvent("historyChange", argument);
                    if (object && object.parent)
                        var parent = typeof object.parent == "object" ? object.parent.name : object.parent;
                    if (parent) {
                        if (!this.nameTable[parent]) {
                            this._isUndo = false;
                            this.redo();
                            return;
                        }
                    }
                    var args;
                    switch (entryItem.type) {
                        case "pagesettingschanged":
                            var entry = { isUndo: false, undoObject: entryItem.undoObject, redoObject: entryItem.redoObject }
                            this._recordPageSettingsChanged(entry);
                            break;
                        case "positionchanged":
                            if (entryItem.swimlaneMultiSelection) {
                                entryItem.undo = false;
                                this._recordMultiPinPointChanged(entryItem);
                            }
                            else {
                                var args = { object: entryItem.redoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordPinPointChanged(args);
                            }
                            this._undoredoUpdateRouting(entryItem.redoObject.connectors);
                            break;
                        case "rotationchanged":
                            if (entryItem.swimlaneMultiSelection) {
                                entryItem.undo = false;
                                this._recordMultiRotationChanged(entryItem);
                            }
                            else {
                                args = { object: entryItem.redoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordRotationChanged(args);
                            }
                            this._undoredoUpdateRouting(entryItem.redoObject.connectors);
                            break;
                        case "sizechanged":
                            entryItem.undo = false;
                            if (entryItem.swimlaneMultiSelection) {
                                this._recordMultiSizeChanged(entryItem);
                            }
                            else {
                                args = { object: entryItem.redoObject, isMultipleNode: entryItem.isMultipleNode };
                                this._recordSizeChanged(args);
                            }
                            this._undoredoUpdateRouting(entryItem.redoObject.connectors);
                            break;
                        case "endpointchanged":
                            args = { undoObject: entryItem.undoObject, redoObject: entryItem.redoObject, removePortType: entryItem.removePortType, removedPort: entryItem.removedPort, isMultipleNode: entryItem.isMultipleNode, _isUndo: false };
                            this._recordEndPointChanged(args);
                            break;
                        case "collectionchanged":
                            args = {
                                changeType: entryItem.changeType, childTable: entryItem.childTable, edgeTable: entryItem.edgeTable,
                                isUndo: false, sourcePorts: entryItem.sourcePorts, targetPorts: entryItem.targetPorts, index: entryItem.index
                            };
                            args.object = jQuery.extend(true, {}, entryItem.object);
                            this._recordCollectionChanged(args, entryItem.object);
                            break;
                        case "labelchanged":
                            args = { object: entryItem.shape, label: entryItem.updatedLabelValue, index: entryItem.index ? entryItem.index : 0 };
                            this._recordLabelChanged(args);
                            break;
                        case "labelpositionchanged":
                            entryItem.undo = false;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelsizechanged":
                            entryItem.undo = false;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelrotationchanged":
                            entryItem.undo = false;
                            this._recordLabelPositionChanged(entryItem);
                            break;
                        case "labelcollectionchanged":
                            entryItem.isUndo = false;
                            this.labelcollectionchanged(entryItem);
                            break;
                        case "groupchanged":
                            args = { object: entryItem.object, actionType: entryItem.actionType, isUndo: false };
                            this._recordGroupChanged(args);
                            break;
                        case "phasepositionchanged":
                            entryItem.undo = false;
                            this._recordPhasesizeChanged(entryItem);
                            break;
                        case "phasecollectionchanged":
                            entryItem = $.extend(true, {}, { phase: entryItem.phase, group: entryItem.group, phaseObject: entryItem.phaseObject, islastPhase: entryItem.islastPhase, isAdded: entryItem.isAdded });
                            entryItem.undo = false;
                            this._recordPhaseCollectionChanged(entryItem);
                            break;
                        case "propertiesChanged":
                            var node = this.nameTable[entryItem.object.name];
                            if (node) {
                                var currentState = this._getModifiedProperties(node, entryItem.values, entryItem[entryItem.elementType]);
                                if (entryItem.elementType == "node")
                                    this.updateNode(node.name, entryItem.values);
                                else if (entryItem.elementType == "connector")
                                    this.updateConnector(node.name, entryItem.values);
                                else if (entryItem.elementType == "label")
                                    entryItem.label = this.updateLabel(node.name, entryItem.label, entryItem.values);
                                else if (entryItem.elementType == "port")
                                    this.updatePort(node.name, entryItem.port, entryItem.values);
                                entryItem.values = currentState;
                            }
                            break;
                        case "portpositionchanged":
                            entryItem.undo = false;
                            this._recordPortPositionChanged(entryItem);
                            break;
                        case "portscollectionchanged":
                            entryItem.isUndo = false;
                            this._recordPortsCollectionChanged(entryItem);
                            break;
                        case "nudge":
                            this._recordNudgingChanges(object, entryItem, true);
                            break;
                        case "spacingCommand":
                        case "alignCommand":
                            this._recordAlignCommandChanges(entryItem);
                            break;
                        case "sizeCommand":
                            this._recordSizeCommandChanges(entryItem);
                            break;
                        case "swapLane":
                            entryItem = jQuery.extend(true, {}, { undoObject: entryItem.undoObject, redoObject: entryItem.redoObject, moveIndex: entryItem.moveIndex, insertIndex: entryItem.currentIndex });
                            entryItem.undo = false;
                            ej.datavisualization.Diagram.canvasHelper._undoSwap(this, entryItem);
                            break;
                        case "zOrder":
                            var end = entryItem.start;
                            var node = this.nameTable[entryItem.object.name];
                            this._comparePropertyValues(node, "zOrder", { zOrder: entryItem.end });
                            if (entryItem.command == "back") {
                                this._bringElementsToFront(entryItem.start, entryItem.end, entryItem.object, entryItem.nearestNode);
                                entryItem.command = "front";
                            }
                            else {
                                this._sendElementsToBack(entryItem.start, entryItem.end, entryItem.object, entryItem.nearestNode);
                                entryItem.command = "back";
                            }
                            entryItem.nearestNode = this._findObjectByIndex(end);
                            var temp = entryItem.start;
                            entryItem.start = entryItem.end;
                            entryItem.end = temp;
                            this._deleteZorderProcess();
                            break;
                    }
                    if (!entryItem.activeLabel) {
                        if (this.selectionList.length && object && this.selectionList[0].name != object.name) {
                            this._clearSelection(true);
                            this._addSelection(this.nameTable[object.name], true);
                        }
                    }
                    else {
                        this._clearSelection(true);
                        this._addSelection(entryItem.activeLabel, true);
                    }
                } else if (this.model.historyManager.redo) {
                    var redo = this.model.historyManager.redo;
                    if (typeof redo == "string") redo = ej.util.getObject(redo, window);
                    if ($.isFunction(redo)) {
                        var data = redo(entryItem.data);
                        if (data) entryItem.data = data;
                    }
                }
            }
        },
        _startGroupAction: function () {
            this.addHistoryEntry({ type: "startGroup", category: "internal" });
        },
        _closeGroupAction: function () {
            this.addHistoryEntry({ type: "closeGroup", category: "internal" });
        },

        addHistoryEntry: function (entry) {
            var canLog, object, params, args;
            if (!this._preventHistoryEntry) {
                if (!this.model.historyManager.suspend) {
                    if (this.model.historyManager.canLog) {
                        canLog = this.model.historyManager.canLog;
                        if (typeof canLog == "string") canLog = ej.util.getObject(canLog, window);
                        if ($.isFunction(canLog)) {
                            object = this.getNode(entry.object || (entry.undoObject && entry.undoObject.node) || entry.shape);
                            params = this._ComparehistoryChangeEvent(object, entry);
                            args = { changes: params.changes.length ? params.changes[0] : null, source: params.source.length ? this.getNode(params.source[0]) : null };
                            if (canLog(args) == false) return;
                        }
                    }
                    if (entry.category != "internal") {
                        entry = { data: entry };
                    }
                    if (this._historyList.canUndo) {
                        if (this._historyList.currentEntry && (this._historyList.currentEntry.data || this._historyList.currentEntry.category == "internal")) {
                            var cEntry = this._historyList.currentEntry;
                            if (cEntry.next) {
                                if (cEntry.previous) {
                                    var entry1 = cEntry.next;
                                    entry1.previous = null;
                                    cEntry.next = entry;
                                    entry.previous = cEntry;
                                }
                            } else {
                                cEntry.next = entry;
                                entry.previous = cEntry;
                            }
                        }
                    }
                    this._historyList.currentEntry = entry;
                    if (this.model.historyManager.stackLimit) {
                        if (this._historyList.currentEntry && this._historyList.currentEntry.previous && !this._lastbefore) {
                            this._lastbefore = entry;
                        }
                        else if (!this._historyList.currentEntry.previous) {
                            this._lastbefore = null;
                            this._historyCount = 0;
                        }

                        if (this._historyCount < this.model.historyManager.stackLimit)
                            this._historyCount++;
                        else {
                            if (this._lastbefore) {
                                if (this._lastbefore.previous)
                                    delete this._lastbefore.previous
                                if (this._lastbefore.next)
                                    this._lastbefore = this._lastbefore.next;
                            }
                        }
                    }

                    var object = entry.object || (entry.redoObject ? entry.redoObject.node || entry.redoObject : undefined) || entry.shape;
                    var args = this._ComparehistoryChangeEvent(object, entry);
                    args.cause = ej.datavisualization.Diagram.HistoryChangeCause.CustomAction;
                    this._getHistoryList();
                    this._raiseEvent("historyChange", args);
                    this._historyList.canUndo = true;
                    this._historyList.canRedo = false;
                }
            }
        },
        removeHistoryEntry: function (entry) {
            if (this._historyList.currentEntry != null) {
                var cEntry = this._historyList.currentEntry;
                //previous and next entries of target entry
                var prev, nxt;
                if (cEntry) {
                    if (cEntry == entry) {
                        prev = cEntry.previous;
                        nxt = cEntry.next;
                        this._historyList.currentEntry = nxt || prev;
                    } else {
                        var nextEntry = cEntry.next;
                        while (nextEntry) {
                            if (nextEntry == entry) {
                                prev = nextEntry.previous;
                                nxt = nextEntry.next;
                                break;
                            } else nextEntry = nextEntry.next;
                        }
                        var prevEntry = cEntry.previous;
                        while (prevEntry) {
                            if (prevEntry == entry) {
                                prev = prevEntry.previous;
                                nxt = prevEntry.next;
                                break;
                            } else prevEntry = prevEntry.previous;
                        }
                    }
                }
                if (prev && nxt) {
                    prev.next = nxt;
                    nxt.previous = prev;
                } else if (prev) {
                    prev.next = null;
                } else if (nxt) {
                    nxt.previous = null;
                }
            }
        },
        canRemoveHistoryEntry: function (entry) {
            return entry.category != "internal";
        },
        clearHistory: function () {
            var hList = this._historyList;
            hList.currentEntry = null;
            hList.canUndo = false;
            hList.canRedo = false;
            this.model.historyManager.undoStack = [];
            this.model.historyManager.redoStack = [];
            //this._hScrollbar._scrollData = null;
            //this._vScrollbar._scrollData = null;
        },

        _getHistroyObject: function (list, object) {
            if (object) {
                list.push({
                    redoObject: object.redoObject ? object.redoObject : null,
                    undoObject: object.undoObject ? object.undoObject : null,
                    type: object.type ? object.type : null,
                    isMultipleNode: object.isMultipleNode ? object.isMultipleNode : null,
                    category: object.category ? object.category : ""
                });
            }
        },

        _getHistoryList: function () {
            var undoStack = [], redoStack = [];
            var currEntry = this._historyList.currentEntry;
            var undoObj, redoObj;


            currEntry = this._historyList.currentEntry;
            if (this._historyList.canUndo || this.model.historyManager.undoStack.length === 0)
                this._getHistroyObject(undoStack, currEntry)
            else
                this._getHistroyObject(redoStack, currEntry)

            while (currEntry && currEntry.previous) {
                undoObj = currEntry.previous;
                this._getHistroyObject(undoStack, undoObj)
                currEntry = currEntry.previous;
            }

            currEntry = this._historyList.currentEntry;
            while (currEntry && currEntry.next) {
                redoObj = currEntry.next;
                this._getHistroyObject(redoStack, redoObj)
                currEntry = currEntry.next;
            }
            this.model.historyManager.undoStack = undoStack;
            this.model.historyManager.redoStack = redoStack;
        },
        getUndoEntry: function () {
            var undoEntry = null;
            var currentEntry;
            var hList = this._historyList;
            if (hList.canUndo) {
                undoEntry = hList.currentEntry;
                currentEntry = hList.currentEntry.previous;
                if (currentEntry) {
                    hList.currentEntry = currentEntry;
                    if (!hList.canRedo)
                        hList.canRedo = true;
                } else {
                    hList.canRedo = true;
                    hList.canUndo = false;
                }
            }
            return undoEntry;
        },
        getRedoEntry: function () {
            var redoEntry = null;
            var entryCurrent;
            var hList = this._historyList;
            if (hList.canRedo) {
                if (!hList.currentEntry.previous && !hList.canUndo) {
                    entryCurrent = hList.currentEntry;
                } else
                    entryCurrent = hList.currentEntry.next;
                if (entryCurrent) {
                    hList.currentEntry = entryCurrent;
                    if (!hList.canUndo)
                        hList.canUndo = true;
                    if (!entryCurrent.next) {
                        hList.canRedo = false;
                        hList.canUndo = true;
                    }
                }
                redoEntry = hList.currentEntry;
            }
            return redoEntry;
        },
        cut: function () {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._pasteIndex = 0;
                this._setClipboard();
                this._eventCause["nodeCollectionChange"] = this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.ClipBoard;
                this._multipleAction = true;
                this._delete();
                delete this._multipleAction;
            }
        },

        insertLabel: function (name, label, index) {
            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var node = this.nameTable[name];
                if (node && label) {
                    var obj = this.getObjectType(node) == "node" ? this.model.defaultSettings.node : this.model.defaultSettings.connector;
                    obj = obj ? obj : {};
                    if (obj && obj.labels && node.labels && obj.labels[index !== undefined ? index : node.labels.length])
                        label = $.extend(true, {}, obj.labels[index !== undefined ? index : node.labels.length], label);
                    obj.labels = obj.labels ? obj.labels : [];
                    label = ej.datavisualization.Diagram.Label(label);
                    label._parent = name;
                    var prtyLabels = obj.labels;
                    prtyLabels.splice();
                    if (!this._collectionContains(label, node.labels)) {
                        node.labels.splice(index, 0, label);
                    }
                    //node.labels.push(label);
                    var resource = { element: node, index: index, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "labels", oldValue: prtyLabels, newValue: node.labels };
                    this._raisePropertyChange(resource);
                    ej.datavisualization.Diagram.DiagramContext.addLabel(node, label, this, index);
                    if (!this._isUndo)
                        this.addHistoryEntry({ type: "labelcollectionchanged", shape: node, label: label, isUndo: true, category: "internal", index: index });
                }
            }
        },
        addLabel: function (name, label) {
            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var node = this.nameTable[name];
                if (node && label) {
                    var oldlabels;
                    var obj = this.getObjectType(node) == "node" ? this.model.defaultSettings.node : this.model.defaultSettings.connector;
                    if (obj && obj.labels && node.labels && obj.labels[node.labels.length])
                        label = $.extend(true, {}, obj.labels[node.labels.length], label);
                    label = ej.datavisualization.Diagram.Label(label);
                    label._parent = name;
                    oldlabels = node.labels;
                    node.labels.push(label);
                    var resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "labels", oldValue: oldlabels, newValue: node.labels };
                    this._raisePropertyChange(resource);
                    ej.datavisualization.Diagram.DiagramContext.addLabel(node, label, this);
                    this.addHistoryEntry({ type: "labelcollectionchanged", shape: node, label: label, isUndo: true, category: "internal" });
                }
            }
        },
        removeLabels: function (name, labels) {
            var removeCollection = [];
            if (labels && labels.length > 0) {
                var node = this.nameTable[name];
                if (node && node.labels && node.labels.length > 0) {
                    for (var j = labels.length - 1; j >= 0; j--) {
                        for (var i = node.labels.length - 1; i >= 0; i--) {
                            if (node.labels[i].name === labels[j].name) {
                                ej.datavisualization.Diagram.SvgContext.deleteLabel(node, node.labels[i], this);
                                removeCollection.push({ index: i, label: $.extend(true, {}, node.labels[i]) })
                                node.labels.splice(i, 1);
                            }
                        }
                    }
                }
                if (!this._isUndo)
                    this.addHistoryEntry({ type: "labelcollectionchanged", shape: node, labels: removeCollection, isLabelRemove: true, isUndo: true, category: "internal" });
            }
        },
        _initLayer: function () {
            var modelLayers = this.model.layers;
            var layer, i
            for (i = 0; i < modelLayers.length; i++) {
                modelLayers[i] = ej.datavisualization.Diagram.Layers(modelLayers[i])
                layer = modelLayers[i];
                if (!layer.visible || layer.lock) {
                    layer.active = false;
                }
                this._updateLayer(modelLayers[i])
            }
        },
        _updateLayer: function (layer) {
            var node = layer.objects;
            var i, nodeName
            for (i = 0; i < node.length; i++) {
                nodeName = node[i]
                if (this._isUpdate(this.nameTable[nodeName], layer))
                    this.updateNode(nodeName, {})
            }
        },
        _findLayer: function (name) {
            var modelLayers = this.model.layers;
            var i, layer
            for (i = 0; i < modelLayers.length; i++) {
                if (modelLayers[i].name === name) {
                    layer = modelLayers[i];
                }
            }
            return layer
        },
        _checkGroupChild: function (group) {
            var children, child, childlayer, j, index;
            children = this._getChildren(group.children);
            for (var i = 0; children && i < children.length; i++) {
                child = this.nameTable[children[i]];
                childlayer = this.model.layers;
                if (child.length > 0) {
                    for (j = 0; j < childlayer.length; j++) {
                        index = childlayer[j].objects.indexOf(child.name)
                        if (index > -1) {
                            this.model.layers[j].objects.splice(index, 1);
                            this._updateLayer(childlayer[j])
                        }
                    }
                    if (child.children) {
                        this._checkGroupChild(child);
                    }
                }
            }
        },
        addLayers: function (layers) {
            var layer, j, i, layerObject, modelLayers;
            for (j = 0; j < layers.length; j++) {
                modelLayers = this.model.layers
                layers[j] = ej.datavisualization.Diagram.Layers(layers[j])
                layer = layers[j];
                if (!layer.visible || layer.lock) {
                    layer.active = false;
                }
                if (!this._findLayer(layer.name)) {
                    this.model.layers.push(layer)
                    if (layer.objects && layer.objects.length) {
                        for (i = 0; layer && i < layer.objects.length ; i++) {
                            layerObject = this.nameTable[layer.objects[i]];
                            if (layerObject) {
                                if (layerObject.type === "group")
                                    this._checkGroupChild(layerObject);
                                if (layerObject && !layerObject.isLane && !layerObject.isPhase) {
                                    if (this._isUpdate(layerObject, layer)) {
                                        this.updateNode(layerObject.name, {})
                                        this._clearSelection(true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        addNodeToLayer: function (layerName, nodes) {
            var layer, objects, i
            layer = this._findLayer(layerName)
            if (layer) {
                objects = layer.objects;
                for (i = 0; i < nodes.length; i++) {
                    if (objects.indexOf(nodes[i]) < 0) {
                        objects.push(nodes[i]);
                        this.updateNode(nodes[i], {})
                    }
                }
            }
        },
        _isUpdate: function (node, layer) {
            var visible = ej.datavisualization.Diagram.Util.enableLayerOption(this.nameTable[node], "visible", this);
            var lock = ej.datavisualization.Diagram.Util.enableLayerOption(this.nameTable[node], "lock", this)
            if (layer.visible !== visible || layer.lock !== lock) {
                return true
            } else return false
        },
        removeNodeToLayer: function (layerName, nodes) {
            var layer, objects, i, index
            layer = this._findLayer(layerName)
            if (layer) {
                objects = layer.objects;
                for (i = 0; i < nodes.length; i++) {
                    index = objects.indexOf(nodes[i].name)
                    if (index > 0) {
                        objects.splice(index, 1);
                        this.updateNode(nodes[i], {})
                    }
                }
            }
        },
        removeLayers: function (layers) {
            var modelLayer, i, layersObject, index
            for (i = 0; i < layers.length; i++) {
                modelLayer = this.model.layers
                layersObject = this._findLayer(layers[i].name)
                index = modelLayer.indexOf(layersObject)
                this.model.layers.splice(index);
                this._updateLayer(layersObject)
            }
        },
        updateLayer: function (layerName, option) {
            var exixtingLayer = this._findLayer(layerName)
            var isUpdate = false;
            if (option.visible !== undefined) {
                if (exixtingLayer.visible !== option.visible) {
                    isUpdate = true;
                }
                exixtingLayer.visible = option.visible;
            }
            if (option.lock !== undefined) {
                if (exixtingLayer.lock !== option.lock) {
                    isUpdate = true;
                }
                exixtingLayer.lock = option.lock;
            }
            if (option.print !== undefined) {
                exixtingLayer.print = option.print;
            }
            if (option.active !== undefined) {
                exixtingLayer.active = option.active;
            }
            if (option.snap !== undefined) {
                if (exixtingLayer.snap !== option.snap) {
                    isUpdate = true;
                }
                exixtingLayer.snap = option.snap;
            }
            if (option.objects !== undefined) {
                this._updateNodeToLayer(exixtingLayer.objects, option.objects);
            }
            if (!option.visible || option.lock) {
                exixtingLayer.active = false;
            }
            if (isUpdate)
                this._updateLayer(exixtingLayer);
            this._clearSelection(true);
        },
        _updateNodeToLayer: function (exixtingLayer, newObject) {
            var commonNode, node, options, i
            for (i = 0; i < newObject.length ; i++) {
                if (exixtingLayer.objects.indexOf(newObject[i]) > -1) {
                    commonNode.push(newObject[i]);
                }
            }
            if (commonNode.length > 0) {
                for (i = 0; i < newObject.length ; i++) {
                    node = newObject[i]
                    if (commonNode.indexOf(node) < 0) {
                        this.addNodeToLayer(exixtingLayer.name, node)
                    }
                }
            } else {
                options = ej.datavisualization.Diagram.Layers();
                for (i = 0; i < exixtingLayer.objects.length ; i++) {
                    this.updateLayer(exixtingLayer.objects[i], options)
                }
                exixtingLayer.objects = newObject;
                this._updateLayer(exixtingLayer);
            }
        },
        _isParent: function (node, layerNode) {
            var parent
            if (node) {
                if ((layerNode.indexOf(node.parent) > -1) || (layerNode.indexOf(node.name) > -1)) {
                    return true
                } else {
                    if (node.parent && this.nameTable[node.parent].parent) {
                        var parent = this._isParent(this.nameTable[this.nameTable[node.parent].parent], layerNode)
                        return parent;
                    }
                }
            }
        },
        _updatePortConnection: function (node, collection, port) {
            var line;
            for (var m = 0; m < collection.length; m++) {
                line = this.nameTable[collection[m]]
                if (line) {
                    if (line.sourcePort === port.name) {
                        port._removeFromSourcePort = true;
                        port._removeLine = line.name;
                        line.sourcePort = null;
                    }
                    else if (line.targetPort === port.name) {
                        port._removeFromTargetPort = true;
                        port._removeLine = line.name;
                        line.targetPort = null;
                    }
                    if (port._removeFromSourcePort || port._removeFromTargetPort) {
                        this._dock(line, this.nameTable);
                        ej.datavisualization.Diagram.DiagramContext.update(line, this);
                    }
                }
            }
        },
        removePorts: function (name, ports) {
            var removeCollection = [];
            if (ports && ports.length > 0) {
                var node = this.nameTable[name];
                if (node && node.ports && node.ports.length > 0) {
                    for (var j = ports.length - 1; j >= 0; j--) {
                        for (var i = node.ports.length - 1; i >= 0; i--) {
                            if (node.ports[i].name === ports[j].name) {
                                ej.datavisualization.Diagram.SvgContext.deletePort(node, node.ports[i], this);
                                this._updatePortConnection(node, node.inEdges, node.ports[i]);
                                this._updatePortConnection(node, node.outEdges, node.ports[i]);
                                removeCollection.push($.extend(true, {}, node.ports[i]));
                                node.ports.splice(i, 1)[0];
                            }
                        }
                    }
                }
                if (!this._isUndo)
                    this.addHistoryEntry({ type: "portscollectionchanged", object: node, collection: removeCollection, changeType: "remove", isUndo: true, category: "internal" });
            }
        },
        _insertPort: function (name, port, index) {
            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var node = this.nameTable[name];
                if (node && port) {
                    port = ej.datavisualization.Diagram.Port(port);
                    if (!this._collectionContains(port, node.ports)) {
                        node.ports.splice(index, 0, port);
                        ej.datavisualization.Diagram.DiagramContext.renderPort(node, port, this, index);
                    }
                }
                var ports = [port];
                this.addHistoryEntry({ type: "portscollectionchanged", object: node, collection: ports.slice(), changeType: "insert", isUndo: true, category: "internal" });
            }
        },
        addPorts: function (name, ports) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                var node = this.nameTable[name];
                if (node && ports) {
                    for (var i = 0; i < ports.length; i++) {
                        var port = ej.datavisualization.Diagram.Port(ports[i]);
                        port.parent = node.name;
                        node.ports.push(port);
                        this._raisePropertyChange({ element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "ports", oldValue: null, newValue: port });
                        ej.datavisualization.Diagram.DiagramContext.renderPort(node, port, this);
                    }
                    this.addHistoryEntry({ type: "portscollectionchanged", object: node, collection: node.ports, changeType: "insert", isUndo: true, category: "internal" });
                }
            }
        },
        updatePort: function (nodeName, port, options) {
            if (nodeName && (ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                var mNode = this._findNode(nodeName);
                if (options && port && (!options.name || port.name == options.name)) {
                    if (mNode) {
                        port = this._findPort(mNode, port.name);
                        if (!this._isUndo)
                            this._recordPropertiesChanged(mNode, options, "port", port);
                        options.name = port.name;
                        this._comparePropertyValues(mNode, "ports", options);
                        for (var prop in options)
                            if (port.hasOwnProperty(prop)) {
                                if (typeof options[prop] == "object")
                                    port[prop] = $.extend(true, {}, port[prop], options[prop]);
                                else
                                    port[prop] = options[prop];
                            }
                        ej.datavisualization.Diagram.DiagramContext.updatePort(mNode, port, this);
                    }
                }
                if (options.offset) {
                    this._updateAssociatedConnectorEnds(mNode, this.nameTable);
                    ej.datavisualization.Diagram.SvgContext._updateAssociatedConnector(mNode, this._svg, this);
                }
            }
        },
        copy: function () {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._pasteIndex = 1;
                if (this.selectionList && this.selectionList.length > 0) {
                    this._setClipboard();
                }
            }
            return this._cloneSelectionList();
        },
        paste: function (object, rename) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                //this._isUndo = true; 
                if (object || this._clipboardData)
                    this._eventCause["nodeCollectionChange"] = this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.ClipBoard;
                this._pasteMultipleLane();
                this._paste(object, rename !== undefined ? rename : true);
                //this._isUndo = false;
            }
        },
        _pasteMultipleLane: function () {
            var name, child, laneCollection = [], parentCollection = [], pseudoChildren, i, nodeCollection = [];
            if (this._clipboardData) {
                var data = this._clipboardData;
                data = $.extend(true, {}, this._clipboardData);
                var node = data.node;
                if (node._type == "pseudoGroup") {
                    for (i = 0; i < node.children.length; i++) {
                        name = node.children[i];
                        child = data.childTable[name];
                        if (child) {
                            if (child.isLane) {
                                child._laneIndex = this._getRemoveIndex(child);
                                if (!this._collectionContains(child.parent, parentCollection))
                                    parentCollection.push(child.parent);
                                laneCollection[i] = child;
                            }
                            else {
                                nodeCollection.push(child.name);
                            }
                        }
                    }
                    if (laneCollection.length > 0) {
                        pseudoChildren = this._sameParent(laneCollection, parentCollection, this._clipboardData.childTable);
                        if (nodeCollection.length > 0) {
                            for (i = 0 ; i < nodeCollection.length; i++)
                                if (!this._collectionContains(nodeCollection[i], pseudoChildren.children))
                                    pseudoChildren.children.push(nodeCollection[i]);
                        }
                        if (pseudoChildren && pseudoChildren.children)
                            this._clipboardData.node.children = pseudoChildren.children;
                    }
                }
            }
        },

        _sameParent: function (laneCollection, parentCollection, childTable) {
            var i, j, k, node, child, nameId, lanes = [], laneObj, phases = [], swimlane, laneStack, pseudoGroup;
            pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
            if (laneCollection.length > 1 && parentCollection.length > 0) {
                laneCollection = this._sortByLaneIndex(laneCollection);
                for (i = 0; i < parentCollection.length; i++) {
                    nameId = ej.datavisualization.Diagram.Util.randomId();
                    lanes = [];
                    for (j = 0; j < laneCollection.length; j++) {
                        node = laneCollection[j];
                        if (node && node.isLane && (node.parent === parentCollection[i])) {
                            child = this.getNode(node);
                            laneObj = this._cloneLaneObj(child, nameId, childTable);
                            lanes.push(laneObj);
                        }
                    }
                    laneStack = this.nameTable[parentCollection[i]];
                    if (laneStack && laneStack.parent) {
                        swimlane = this.nameTable[laneStack.parent];
                        if (swimlane.isSwimlane) {
                            phases = swimlane.children[1].children.slice();
                            for (k = 0; k < phases.length; k++) {
                                phases[k] = $.extend(true, {}, phases[k]);
                                phases[k].name += nameId;
                            }
                        }
                    }
                    if (lanes && phases && lanes.length > 0 && phases.length > 0) {
                        swimlane = {
                            type: "swimlane", offsetX: swimlane.offsetX + 10, offsetY: swimlane.offsetY + 10,
                            orientation: swimlane.orientation,
                            lanes: lanes,
                            phases: phases
                        }
                        pseudoGroup.children.push(swimlane);
                    }
                }
                return pseudoGroup;
            }
        },
        _commandPaste: function () {
            this.paste();
        },
        _getNodesfrombounds: function (rect, eachNode) {
            var i, isCollection = false;
            var len;
            var type;
            var bounds;
            var collection = [];
            var nodes = this.nodes();
            for (i = 0, len = nodes.length; i < len; i++) {
                var node = this.nameTable[nodes[i].name];
                if (eachNode && node) {
                    isCollection = (eachNode.name === node.name) ? true : false;
                }
                if (node && node.visible && !isCollection) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    bounds = ej.datavisualization.Diagram.Geometry.rect([bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft]);
                    if (ej.datavisualization.Diagram.Util.canSelect(node) && ej.datavisualization.Diagram.Util.enableLayerOption(node, "lock", this)) {
                        type = this.getObjectType(node);
                        if (ej.datavisualization.Diagram.Geometry.containsRect(rect, bounds)) {
                            if (node.parent === "")
                                collection.push(node);
                        }
                        else if (type === "group") {
                            if (this.activeTool && this.activeTool.inAction) this.activeTool._checkGroupChildren(collection, node, rect);
                        }
                    }
                }

            }
            var connectors = this.connectors();
            for (i = 0, len = connectors.length; i < len; i++) {
                var connector = this.nameTable[connectors[i].name];
                if (eachNode && connector) {
                    isCollection = (eachNode.name === connector.name) ? true : false;
                }
                if (connector && connector.visible && !isCollection) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(connector);
                    bounds = ej.datavisualization.Diagram.Geometry.rect([bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft]);
                    if (ej.datavisualization.Diagram.Util.canSelect(connector) && ej.datavisualization.Diagram.Util.enableLayerOption(connectors, "lock", this) && ej.datavisualization.Diagram.Geometry.containsRect(rect, bounds)) {
                        if (connector.parent === "")
                            collection.push(connector);
                    }
                }
            }
            return collection;
        },
        _setClipboard: function () {
            if (this.selectionList.length > 0) {
                var data, node = this.selectionList[0];
                var childTable = {}, collection = [], rectBounds, rect;
                if (node._type === "group" || node.type === "pseudoGroup") {
                    var temp, i, j;
                    var children = this._getChildren(node.children);                    
                    for (i = 0; i < children.length; i++) {
                        for (j = i + 1; j < children.length; j++) {
                            var nodei = this.nameTable[this._getChild(children[i])];
                            var nodej = this.nameTable[this._getChild(children[j])];
                            if (nodej && nodei) {
                                if (nodej.zOrder < nodei.zOrder) {
                                    temp = children[i];
                                    children[i] = children[j];
                                    children[j] = temp;
                                }
                            }
                        }
                    } 
                    var connectorCollection = [];
                    for (var m = node.children.length - 1; m >= 0; m--) {
                        var element = this.nameTable[this._getChild(node.children[m])];
                        if (element.type === "connector") {
                            node.children.splice(node.children.indexOf(element.name), 1);
                            connectorCollection.push(element.name)
                        }
                    }
                    node.children = node.children.concat(connectorCollection);
                    childTable = this._getChildTable(node, childTable);
                }
                childTable[node.name] = node;
                rectBounds = ej.datavisualization.Diagram.Util.bounds(node);
                rect = { x: rectBounds.x, y: rectBounds.y, width: rectBounds.width, height: rectBounds.height };
                collection = this._getNodesfrombounds(rect, node);
                data = $.extend(true, {}, { "childTable": childTable, "node": node, "collection": collection });
                if (data.node.segments) {
                    data.node.targetNode = null;
                    data.node.targetPort = null;
                    data.node.sourceNode = null;
                    data.node.sourcePort = null;
                }
                data.addInfo = this._updateClipBoardConnectors(node, childTable);
                this._clipboardData = data;
                //this._clipboardData = this._getCollectionEvent(data);


            }
        },
        _updateClipBoardConnectors: function (pseudoGroup, childTable) {
            var child, connectors = [];
            if (pseudoGroup && pseudoGroup.type === "pseudoGroup" && pseudoGroup.children.length > 0) {
                for (var i = 0; i < pseudoGroup.children.length; i++) {
                    child = this.nameTable[this._getChild(pseudoGroup.children[i])];
                    if (child && (child.isSwimlane || child.isLane)) {
                        this._updateSwimlaneGroupConnectors(pseudoGroup, child, childTable, connectors);
                    }
                }
            }
            else this._updateSwimlaneGroupConnectors(null, pseudoGroup, childTable, connectors);
            return connectors;
        },
        _updateEdgesToClipboard: function (edge, children, node, childTable, connectors, outEdges) {
            if (node.parent && edge) {
                var sNode = this.nameTable[edge.sourceNode];
                var tNode = this.nameTable[edge.targetNode];
                if (sNode && tNode) {
                    var sparent = this.nameTable[sNode.parent];
                    var tparent = this.nameTable[tNode.parent];
                    if ((sparent && sparent.isLane && tparent && tparent.isLane) || (sparent && tparent && (sparent.type == 'group' || tparent.type == 'group'))) {
                        if (this._collectionContains(edge.name, outEdges ? node.outEdges : node.inEdges) && !this._collectionContains(edge.name, connectors) && !this._collectionContains(edge.name, children ? children : [])) {
                            connectors.push(this.nameTable[this._getChild(edge)]);
                        }
                    }
                }
            }
        },
        _updateSwimlaneConnectors: function (children, node, childTable, connectors) {
            if (node) {
                var edge, i
                for (i = 0; i < node.inEdges.length > 0; i++) {
                    edge = this.nameTable[this._getChild(node.inEdges[i])]
                    this._updateEdgesToClipboard(edge, children, node, childTable, connectors);
                }
                for (i = 0; i < node.outEdges.length > 0; i++) {
                    edge = this.nameTable[this._getChild(node.outEdges[i])]
                    this._updateEdgesToClipboard(edge, children, node, childTable, connectors, true);
                }
            }
        },
        _updateSwimlaneGroupConnectors: function (pseudoGroup, node, childTable, connectors) {

            var lanes = ej.datavisualization.Diagram.SwimLaneContainerHelper.getLanes(this, node), children;
            if (!lanes && pseudoGroup && node.isLane)
                lanes = [node.name];
            for (var i = 0; lanes && i < lanes.length; i++) {
                var lane = this.nameTable[this._getChild(lanes[i])];
                if (lane && lane.children && lane.children.length > 0) {
                    children = lane.children;
                    for (var j = 0; j < children.length; j++) {
                        var child = this.nameTable[this._getChild(children[j])];
                        if (child) {
                            this._updateSwimlaneGroupChildConnectors((pseudoGroup && pseudoGroup.children) ? pseudoGroup.children : null, child, childTable, connectors);
                        }
                    }
                }
            }
        },
        _updateSwimlaneGroupChildConnectors: function (pseudoGroup, node, childTable, connectors) {
            var i = 0, k = 0, child, subChild, subChildren;
            this._updateSwimlaneConnectors((pseudoGroup && pseudoGroup.children) ? pseudoGroup.children : null, node, childTable, connectors);
            subChildren = node.children;
            if (subChildren) {
                for (k = 0; k < subChildren.length; k++) {
                    subChild = this.nameTable[this._getChild(subChildren[k])];
                    if (subChild) {
                        this._updateSwimlaneGroupChildConnectors(pseudoGroup, subChild, childTable, connectors);
                    }
                }
            }
        },
        //_getCollectionEvent: function (data){
        //	var args =  {};
        //	args.clipboardCollection = data.collection ? data.collection : null;
        //	args.collectiontype = ej.datavisualization.Diagram.ClipBoardChangeType.None;
        //	args.specificCollection = [];
        //	this._raiseEvent("clipboardChange", args);
        //	switch(args.collectiontype){
        //		case "all":
        //		   data.addInfo = args.clipboardCollection;
        //		   break;
        //		case "none":
        //		   data.addInfo = [];
        //		   break;
        //		case "specific":
        //		   data.addInfo = args.specificCollection;
        //	}
        //	return data;
        // },
        _getChildTable: function (group, childTable) {
            var child, names, name;
            names = this._getChildren(group.children);
            if (names) {
                for (var i = 0; i < names.length; i++) {
                    name = names[i];
                    child = this.nameTable[name];
                    if (child && (child.parent === group.name || group.type == "pseudoGroup")) {
                        var node = childTable[child.name] = $.extend(true, {}, child);
                        if (node._type === "group" || node.type === "pseudoGroup")
                            childTable = this._getChildTable(node, childTable);
                        if (node.inEdges && node.inEdges.length > 0) {
                            for (var e in node.inEdges) {
                                var cCon = this.nameTable[node.inEdges[e]];
                                if (cCon) {
                                    if (childTable[cCon.name])
                                        delete childTable[cCon.name];
                                    childTable[cCon.name] = cCon;
                                }
                            }
                        }
                        if (node.outEdges && node.outEdges.length > 0) {
                            for (var f in node.outEdges) {
                                var cCon = this.nameTable[node.outEdges[f]];
                                if (cCon) {
                                    if (childTable[cCon.name])
                                        delete childTable[cCon.name];
                                    childTable[cCon.name] = cCon;
                                }
                            }
                        }
                    }
                }
            }
            return childTable;
        },

        isSameParent: function (array) {
            var i, node;
            if (array.length > 1) {
                for (i = 1; i < array.length; i++) {
                    if (array[i] !== array[0])
                        return false;
                }
                return true;
            }
        },

        _sortByLaneIndex: function (array) {
            return array.sort(function (a, b) {
                return (a._laneIndex > b._laneIndex) ? 1 : ((b._laneIndex > a._laneIndex) ? -1 : 0);
            });
        },

        _paste: function (object, rename) {
            if (!object) {
                if (this._clipboardData) {
                    var data = this._clipboardData;
                    var dx, child, connectors = [];
                    data = $.extend(true, {}, this._clipboardData);
                    var node = data.node;
                    var startGroupAction = false;
                    node.zOrder = -1;
                    if (this.tools["move"]._outOfBoundsDrag(node, this._pasteIndex * 10, this._pasteIndex * 10)) {
                        if (node && node.type != "phase") {
                            if (!node.container) {
                                if (node.type == "pseudoGroup") {
                                    var names = node.children;
                                    var pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                                    this._isUndo = true;
                                    this._eventCause["nodeCollectionChange"] = this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.ClipBoard;
                                    this._multipleAction = true;
                                    for (var i = 0; i < names.length; i++) {
                                        var name = names[i];
                                        child = (typeof name == "object") ? name : data.childTable[name];
                                        child.zOrder = -1;
                                        if (child._annotation) delete child._annotation;
                                        if (child && (child.isSwimlane || child.type === "swimlane")) {
                                            startGroupAction = true;
                                            var child = this._pasteSwimlaneObj(child, data);
                                            if (child && this._isUndo) {
                                                var dx = this._pasteIndex * 10;
                                                this._translate(child, dx, dx, this.nameTable);
                                                ej.datavisualization.Diagram.DiagramContext.update(child, this);
                                            }
                                            if (!child) {
                                                this.add(name);
                                                child = this.nameTable[name.name];
                                                this._clipboardData.childTable = this._getChildTable(child, data.childTable);
                                                this._clipboardData.node.children[i] = child;
                                                this._clipboardData.childTable[child.name] = child;
                                                var lanePaste = true;
                                            }
                                            if (child)
                                                pseudoGroup.children.push(child.name);
                                            node = pseudoGroup;
                                        }
                                        else if (child && (child.isLane)) {
                                            var swimChild = this._pasteSwimlane(child, data, true, this._pasteIndex * 10);
                                            if (swimChild)
                                                pseudoGroup.children.push(swimChild.name);
                                            dx = this._pasteIndex * 10;
                                            this._translate(swimChild, dx, dx, this.nameTable);
                                            ej.datavisualization.Diagram.DiagramContext.update(swimChild, this);
                                        } else if (child) {
                                            name = name + ej.datavisualization.Diagram.Util.randomId();
                                            delete (data.childTable[child.name]);
                                            if (lanePaste) this._clipboardData.childTable[child.name] = child;
                                            child.name = name;
                                            child.parent = "";
                                            data.childTable[child.name] = child;
                                            this._preserveConnection(data.childTable, child);
                                            var drawChild = true;
                                            if (child.segments) {
                                                var drawChild1 = true, drawChild2 = true;
                                                if (data.childTable[child._oldSourceNode] && !this.nameTable[child.sourceNode]) {
                                                    drawChild1 = false;
                                                    child.sourceNode = null;
                                                }
                                                if (data.childTable[child._oldTargetNode] && !this.nameTable[child.targetNode]) {
                                                    drawChild2 = false;
                                                    child.targetNode = null;
                                                }
                                                if (!drawChild1 && !drawChild2)
                                                    drawChild = false;
                                            }
                                            if (drawChild) {
                                                pseudoGroup.children.push(name);
                                                if (child._type === "group" && child.type != "bpmn") {
                                                    this._pasteChildren(data.childTable, child);
                                                }
                                                else
                                                    child.children = [];
                                                dx = this._pasteIndex * 10;
                                                this._translate(child, dx, dx, this.nameTable);
                                                if (child.segments && child.segments.length == 1 && child.segments[0].type == "orthogonal" && !child.sourceNode && !child.targetNode) {
                                                    points = child.segments[0].points;
                                                }
                                                var success = false;
                                                success = this.add(child);
                                                if (points && success) {
                                                    child = this.nameTable[child.name];
                                                    child.segments[0].points = points;
                                                    ej.datavisualization.Diagram.DiagramContext.update(child, this);
                                                    ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.selectionList[0], this._adornerSvg, this._currZoom);
                                                }
                                            }
                                        }
                                    }
                                    if (startGroupAction) {
                                        this.model.historyManager.startGroupAction();
                                    }
                                    delete this._multipleAction;
                                    this._clearSelection();
                                    if (pseudoGroup && pseudoGroup.children.length > 0) {
                                        this.nodes().push(pseudoGroup);
                                        this._nodes = $.extend(true, [], this.nodes());
                                        this.nameTable[pseudoGroup.name] = pseudoGroup;
                                        ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this);
                                        this._addSelection(pseudoGroup);
                                        var childTable = {};
                                        childTable = this._getChildTable(this.selectionList[0], childTable);
                                        var entry = { type: "collectionchanged", object: this._updatePsedoGroupChildren(this.selectionList[0]), childTable: jQuery.extend(true, {}, childTable), changeType: "insert", category: "internal" };
                                        this.addHistoryEntry(entry);
                                        this._isUndo = false;
                                    }
                                } else if (node.type == "bpmn") {
                                    var randomId = ej.datavisualization.Diagram.Util.randomId();
                                    node.parent = "";
                                    node.name = node.name + randomId;
                                    node.inEdges = [];
                                    node.outEdges = [];
                                    node.children = [];
                                    if (node._annotation) delete node._annotation;
                                    dx = this._pasteIndex * 10;
                                    this._translate(node, dx, dx, this.nameTable);
                                    this.add(node);
                                } else {
                                    node.name = node.name + ej.datavisualization.Diagram.Util.randomId();
                                    node.parent = "";
                                    if (node._type === "group") {
                                        this._pasteChildren(data.childTable, node);
                                    } else if (node.segments) {
                                        //this._disConnect(node);
                                    } else if (!node.segments) {
                                        //@Fix
                                        //this._disConnect(node);
                                        node.inEdges = [];
                                        node.outEdges = [];
                                    }
                                    dx = this._pasteIndex * 10;
                                    this._translate(node, dx, dx, this.nameTable);
                                    if (node.segments && node.segments.length == 1 && node.segments[0].type == "orthogonal" && !node.sourceNode && !node.targetNode) {
                                        var points = node.segments[0].points;
                                    }
                                    var success = this.add(node);
                                    if (success && points) {
                                        node = this.nameTable[node.name];
                                        node.segments[0].points = points;
                                        ej.datavisualization.Diagram.DiagramContext.update(node, this);
                                        ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.selectionList[0], this._adornerSvg, this._currZoom);
                                    }
                                    this._updateSelectionHandle();
                                    //this._clearSelection();
                                    //this._addSelection(node);
                                }
                            } else {
                                if (node.isSwimlane) {
                                    this.model.historyManager.startGroupAction();
                                    startGroupAction = true;
                                    node = this._pasteSwimlaneObj(node, data);
                                    data.childTable = this._getChildTable(node, data.childTable);
                                }
                                else {
                                    if (node.isLane) {
                                        node = this._cloneLaneObj(node, ej.datavisualization.Diagram.Util.randomId(), data.childTable);
                                        if (node.orientation === "vertical") {
                                            node.height = node.height;
                                        }
                                        var swimlane = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(node, this, this._clipboardData, true);
                                        if (swimlane) {
                                            this._pasteObj = true;
                                            this.add(swimlane);
                                            this._pasteObj = false;
                                        }
                                        node = swimlane;
                                    }
                                    else if (node.container && !node.isLane && !node.isSwimlane) {
                                        node = this._cloneContainer(node, ej.datavisualization.Diagram.Util.randomId(), data.childTable)
                                        this._preserveConnection(data.childTable, node);
                                        this.add(node);
                                        node = this.nameTable[node.name];
                                    }
                                    dx = this._pasteIndex * 10;
                                    this._translate(node, dx, dx, this.nameTable);
                                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                                }
                                if (this._selectionContains(node)) {
                                    this._clearSelection(true);
                                    this._addSelection(node);
                                }
                            }
                            if (data.addInfo.length) {
                                for (var m in data.addInfo) {
                                    var addobj, cName;
                                    addobj = data.addInfo[m];
                                    if (addobj.isSwimlane) {
                                        data.childTable[addobj.name] = addobj;
                                        data.childTable = this._getChildTable(addobj, data.childTable);
                                        addobj = this._pasteSwimlaneObj(addobj, data);
                                        data.childTable[addobj.name] = addobj;
                                        data.childTable = this._getChildTable(addobj, data.childTable);
                                    }
                                    else {
                                        if (data.childTable[addobj.name] && addobj !== data.childTable[addobj.name]) {
                                            addobj = $.extend(true, {}, data.childTable[addobj.name]);
                                        }
                                        cName = addobj.name + ej.datavisualization.Diagram.Util.randomId();
                                        addobj.name = cName;
                                        addobj.parent = "";
                                        if (addobj._oldSourceNode && addobj._oldTargetNode) {
                                            data.childTable[addobj.name] = addobj;
                                            this._preserveConnection(data.childTable, addobj);
                                            dx = this._pasteIndex * 10;
                                            this._translate(addobj, dx, dx, this.nameTable);
                                            this.add(addobj);
                                            if (lanePaste) {
                                                connectors[m] = addobj;
                                            }
                                            if (this._selectionContains(addobj)) {
                                                this._clearSelection(true);
                                            }
                                        }
                                    }
                                }
                                if (lanePaste) {
                                    this._clipboardData.addInfo = connectors;
                                }
                                if (!this._selectionContains(node)) {
                                    this._addSelection(node);
                                }
                            }
                            if (startGroupAction) {
                                this.model.historyManager.closeGroupAction();
                            }
                            this._pasteIndex++;
                        }
                    }
                }
            }
            else {
                var name = "";
                var connectors = [];
                var pseudoGroup = ej.datavisualization.Diagram.Group({ "name": "multipleSelection", type: "pseudoGroup" });
                if (rename)
                    name = ej.datavisualization.Diagram.Util.randomId();
                for (var i = 0; i < object.length; i++) {
                    object[i].name += name;
                    if (object[i].outEdges) object[i].outEdges = [];
                    if (object[i].inEdges) object[i].inEdges = [];
                    if (object.length > 1) pseudoGroup.children.push(object[i].name);
                    if (object[i].type != "connector") {
                        if ((object[i].type === "group" || object[i].type === "bpmn") && !object[i].isSwimlane) {
                            this._clonePasteGroup(object[i], name, object);
                            this.add($.extend({}, object[i]));
                        }
                        if (object[i].isSwimlane) {
                            this._clonePasteSwimlaneObj(object[i], name, object);
                            var cloneObj = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, object[i], data);
                            if (this._outOfBoundsOnNudge(cloneObj, diagram._pasteIndex * 10, this._pasteIndex * 10)) {
                                this.add(cloneObj);
                            }
                        }
                        else this.add($.extend({}, object[i]));

                    }
                    else
                        connectors.push(object[i]);

                }
                for (var i = 0; i < connectors.length; i++) {
                    if (connectors[i].sourceNode && this.nameTable[connectors[i].sourceNode + name])
                        connectors[i].sourceNode += name;
                    else {
                        connectors[i].sourceNode = "";
                        connectors[i].sourcePort = "";
                    }
                    if (connectors[i].targetNode && this.nameTable[connectors[i].targetNode + name])
                        connectors[i].targetNode += name;
                    else {
                        connectors[i].targetNode = "";
                        connectors[i].targetPort = "";
                    }
                    if (object.length > 1) pseudoGroup.children.push(connectors[i].name);
                    this.add($.extend({}, connectors[i]));
                }
                if (object.length > 1) {
                    this.nodes().push(pseudoGroup);
                    this._nodes = $.extend(true, [], this.nodes());
                    this.nameTable[pseudoGroup.name] = pseudoGroup;
                    this._clearSelection(true);
                    ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this);
                    this.addSelection(pseudoGroup, true);
                }
            }
        },

        _cloneContainer: function (group, name, childTable) {
            group.name = group.name + name;
            for (var i = 0; i < group.children.length; i++) {
                var nameTable = childTable ? childTable : this.nameTable;
                var child = nameTable[this._getChild(group.children[i])];
                child.name += name;
                child.parent = group.name;
                if (child.children && child.children.length > 0) {
                    child = this._cloneContainer(child, name, childTable);
                }
                group.children[i] = child;
            }
            ej.datavisualization.Diagram.bpmnHelper.updateProcessCollection(group, this);
            return group
        },

        _clonePasteGroup: function (group, name, objects) {
            for (var i = 0; i < group.children.length; i++) {
                group.children[i].name += name;
                group.children[i].parent = group.name;
                if (group.children[i].segments) {
                    if (group.children[i].sourceNode)
                        group.children[i].sourceNode += name;
                    if (group.children[i].targetNode)
                        group.children[i].targetNode += name;
                }
                else {
                    var edge;
                    for (var e = 0; e < group.children[i].inEdges.length; e++) {
                        edge = group.children[i].inEdges[e];
                        if (this._collectionContains(edge, group.children) || (objects && this._collectionContains(edge, objects))) {
                            edge += name;
                        }
                        else group.children[i].inEdges.splice(e, 1);
                    }
                    for (var e = 0; e < group.children[i].outEdges.length; e++) {
                        edge = group.children[i].outEdges[e];
                        if (this._collectionContains(edge, group.children) || (objects && this._collectionContains(edge, objects))) {
                            edge += name;
                        }
                        else group.children[i].outEdges.splice(e, 1);
                    }
                }
            }
        },
        _clonePasteSwimlaneObj: function (obj, name, objects) {
            //obj.name += name;
            //update lanes
            if (obj.lanes && obj.lanes.length > 0) {
                for (var i = 0; i < obj.lanes.length; i++) {
                    if (obj.lanes[i]) {
                        obj.lanes[i].name += name;
                        if (obj.lanes[i].children && obj.lanes[i].children.length > 0) {
                            var children = obj.lanes[i].children;
                            var nChildren = [];
                            for (var m = 0; m < children.length; m++) {
                                var child = jQuery.extend(true, {}, children[m]);
                                child.name += name;
                                child.parent = obj.lanes[i].name;
                                for (var e = 0; e < child.inEdges.length; e++) {
                                    if (this._collectionContains(child.inEdges[e], objects)) {
                                        child.inEdges[e] += name;
                                        obj.lanes[i].children[m] = child;
                                    }
                                    else child.inEdges.splice(e, 1);
                                }
                                for (var e = 0; e < child.outEdges.length; e++) {
                                    if (this._collectionContains(child.outEdges[e], objects)) {
                                        child.outEdges[e] += name;
                                        obj.lanes[i].children[m] = child;
                                    }
                                    else child.outEdges.splice(e, 1);
                                }
                                nChildren.push(child)
                            }
                            obj.lanes[i].children = nChildren;
                        }
                    }
                }
            }
            //update phases
            if (obj.phases && obj.phases.length > 0) {
                var phases = [];
                for (var i = 0; i < obj.phases.length; i++) {
                    if (obj.phases[i]) {
                        var phase = jQuery.extend(true, {}, obj.phases[i]);
                        phase.name += name;
                        phase.parent = "";
                        phases.push(phase);
                    }
                }
                obj.phases = phases;
            }
        },

        _cloneLaneObj: function (obj, name, childTable) {
            var obj = ej.datavisualization.Diagram.SwimLaneContainerHelper._cloneLaneObj(this, obj, name, childTable)
            return obj;
        },

        _cloneSwimlaneObj: function (obj, name, data) {
            obj = $.extend(true, {}, obj);
            var obj = ej.datavisualization.Diagram.SwimLaneContainerHelper._cloneSwimlaneObj(this, obj, name, data)
            return obj;
        },

        _pasteSwimlaneObj: function (node, data) {
            node = ej.datavisualization.Diagram.SwimLaneContainerHelper._pasteSwimlaneObj(this, node, data)
            return node;
        },

        _pasteSwimlane: function (node, data, mSelection, x) {
            if (node && node.isSwimlane) {
                var cloneObj = ej.datavisualization.Diagram.SwimLaneContainerHelper._pasteSwimlane(this, node, data, mSelection, x)
                return cloneObj;
            }
        },
        _cloneNode: function (node, data, name, pnode) {
            var nameState = false;
            var parentName = null;
            if (node) {
                node = (typeof (node) === "string") ? node : node.name;
                var node = jQuery.extend(true, {}, data.childTable[node]);
                if (node.isPhaseStack) {
                    node.name = node.name.split("phaseStack")[0] + name + "phaseStack";
                    nameState = true;
                    parentName = node.name;
                }
                if (node.children && node.children.length > 0) {
                    for (var i = 0 ; i < node.children.length; i++) {
                        this._cloneNode(node.children[i], data, name, parentName);
                        if (node.children[i]) (typeof (node.children[i]) === "string") ? node.children[i] += name : node.children[i].name += name;
                    }
                }
                if (pnode) {
                    node.parent = (typeof (pnode) === "string") ? pnode : pnode.name;
                }
                else if (node.parent != "")
                    node.parent += name;
                if (!nameState)
                    node.name += name;
                this._preserveConnection(data.childTable, node);
                this.nameTable[node.name] = node;
            }
        },
        _cloneSwimlane: function (node, data, name) {
            var tempName = node.name;
            node.name += name;
            if (node.children && node.children.length > 0) {
                for (var i = 0 ; i < node.children.length; i++) {
                    this._cloneNode(node.children[i], data, name, node);
                    if (typeof (node.children[i]) === "string") {
                        (node.children[i] += name)
                    }
                    else {
                        if (node.children[i].isPhaseStack)
                            node.children[i] = tempName + name + "phaseStack";
                        else
                            node.children[i] = node.children[i].name + name;
                    }
                }
            }
            if (node.phases && node.phases.length > 0) {
                var phase;
                for (var i = 0 ; i < node.phases.length; i++) {
                    phase = jQuery.extend(true, {}, this.nameTable[this._getChild(node.phases[i])]);
                    phase.name += name;
                    phase.parent += name;
                    this.nameTable[phase.name] = phase;
                    node.phases[i] = phase.name;
                }
            }
            this.nameTable[node.name] = node;
        },
        _pasteChild: function (child, childTable, group, childNames) {
            var name = child.name + ej.datavisualization.Diagram.Util.randomId();
            delete (childTable[child.name]);
            child.name = name;
            childTable[child.name] = child;
            this._preserveConnection(childTable, child);
            child.parent = group.name;
            childNames.push(name);
            if (child._type === "group") {
                this._pasteChildren(childTable, child);
            }
            this.add(child);
        },
        _pasteChildren: function (childTable, group) {
            var child, names, name;
            var childNames = [];
            names = group.children;
            for (var i = 0; i < names.length; i++) {
                name = this._getChild(names[i]);
                child = childTable[name];
                child.zOrder = -1;
                if (child) {
                    this._pasteChild(child, childTable, group, childNames);
                }
            }
            group.children = [];
            for (var i = 0; i < childNames.length; i++) {
                group.children.push(this.nameTable[childNames[i]]);
            }
            this._preserveConnection(childTable, group);
        },
        _preserveConnections: function (childTable, group) {
            var child, names;
            names = this._getChildren(group.children);
            for (var i = 0; i < names.length; i++) {
                child = childTable[names[i]];
                if (child) {
                    this._preserveConnection(childTable, child);
                    if (child._type === "group")
                        this._preserveConnections(childTable, group);
                }
            }
        },
        _preserveConnection: function (childTable, child) {
            var i, connection, len;
            if (!child.segments) {
                len = child.inEdges.length;
                if (len > 0) {
                    for (i = 0; i < len; i++) {
                        connection = childTable[child.inEdges[i]];
                        if (connection) {
                            connection._oldTargetNode = connection.targetNode;
                            connection.targetNode = child.name;
                        }
                    }
                    child.inEdges = [];
                }
                len = child.outEdges.length;
                if (len > 0) {
                    for (i = 0; i < child.outEdges.length; i++) {
                        connection = childTable[child.outEdges[i]];
                        if (connection) {
                            connection._oldSourceNode = connection.sourceNode;
                            connection.sourceNode = child.name;
                        }
                    }
                    child.outEdges = [];
                }
            } else {
                var node;
                if (child.targetNode) {
                    node = childTable[child.targetNode];
                    if (node)
                        node.inEdges.push(child.name);
                    //else
                    //    child.targetNode = null;
                }
                if (child.sourceNode) {
                    node = childTable[child.sourceNode];
                    if (node)
                        node.outEdges.push(child.name);
                    //else
                    //    child.sourceNode = null;
                }
            }
        },
        _expandChildren: function (node) {
            for (var i = 0; i < node.outEdges.length; i++) {
                var conn = this.nameTable[node.outEdges[i]];
                var target = this.nameTable[conn.targetNode];
                if (!target.excludeFromLayout) {
                    conn.visible = true;
                    ej.datavisualization.Diagram.DiagramContext.update(conn, this);
                    this._updateQuad(conn);
                    if (target.isExpanded)
                        this._expandChildren(target);
                    target.visible = true;
                    ej.datavisualization.Diagram.DiagramContext.update(target, this);
                    this._updateQuad(target);
                }
            }
        },
        _collapseChildren: function (node) {
            for (var i = 0; i < node.outEdges.length; i++) {
                var conn = this.nameTable[node.outEdges[i]];
                var target = this.nameTable[conn.targetNode];
                if (!target.excludeFromLayout) {
                    conn.visible = false;
                    ej.datavisualization.Diagram.DiagramContext.update(conn, this);
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[conn.name], conn);
                    ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, conn);
                    if (target.isExpanded)
                        this._collapseChildren(target);
                    target.visible = false;
                    ej.datavisualization.Diagram.DiagramContext.update(target, this);
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[target.name], target);
                    ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, target);
                }
            }
        },
        zoomTo: function (zoom) {
            if (!zoom) {
                zoom = new ej.datavisualization.Diagram.Zoom();
            }
            if (zoom.zoomCommand & ej.datavisualization.Diagram.ZoomCommand.ZoomIn) {
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, (1 + zoom.zoomFactor), 0, 0, zoom.focusPoint, true);
            } else {
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, (1 / (1 + zoom.zoomFactor)), 0, 0, zoom.focusPoint, true);
            }
        },
        remove: function (node) {
            if (node && this.nameTable[node.name] && (ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._delete(node);
            }
            else
                this._delete();
        },
        clear: function () {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._clearSelection();
                var i;
                var diagram = this;
                this._views.forEach(function (viewid) {
                    var view = diagram._views[viewid];
                    $(view.diagramLayer).empty();
                    $(diagram._expander).empty();
                    $(diagram._adornerLayer.children).empty();
                    $(view.svg.document.parentNode.getElementsByClassName("htmlLayer")[0]).empty();
                });
                while (this.nodes().length > 0) {
                    this.nodes().pop();
                }
                while (this.connectors().length > 0) {
                    this.connectors().pop();
                }
                this._nodes = [];
                this._connectors = [];
                this.nameTable = {};
                this.selectionList = [];
                this.clearHistory();
                this._spatialSearch = ej.datavisualization.Diagram.SpatialSearch(this);
                this._updateScrollOffset(0, 0);
            }
        },
        _clearElementCollection: function () {
            $(this.element).find(".ej-d-node").remove();
            $(this.element).find(".ej-d-group").remove();
            $(this.element).find(".ej-d-seperator").remove();
            var dataSource = this.model.dataSourceSettings.dataSource;
            if (typeof dataSource != "string" && dataSource.length) {
                $(this.element).find(".ej-d-connector").remove();
                while (this.nodes().length > 0) {
                    this.nodes().pop();
                }
                while (this.connectors().length > 0) {
                    this.connectors().pop();
                }
                this._nodes = [];
                this._connectors = [];
                this.nameTable = {};
                this.selectionList = [];
                this._spatialSearch = ej.datavisualization.Diagram.SpatialSearch(this);
            }
        },

        _updateChildOnGroup: function (node) {
            var parent = null;
            if (node && node.parent) {
                parent = this._svg.document.getElementById(node.parent);
                var parentObj = this.nameTable[node.parent];
                if (parentObj) {
                    if (parentObj.container) {
                        ej.datavisualization.Diagram.ContainerHelper._add(this, node);
                    }
                    else {
                        node = this.nameTable[this._getChild(node)];
                        if (node != null) {
                            parentObj.children.push(node);
                        }
                        if (node._type == "group")
                            this._initGroupNode(node);
                        ej.datavisualization.Diagram.Util._refreshParentGroup(node, this);
                    }
                }
            }
            return parent;
        },
        _raiseChildrenPropertyChange: function (node, isAdd) {
            if (node && node.parent) {
                var parent = this._findNode(node.parent);
                var element, property, currCollection = [], preCollection = [];
                if (parent) {
                    if (parent.isLaneStack) {
                        var swimlane = this._getNode(parent.parent);
                        preCollection = swimlane.lanes;
                        preCollection = preCollection.slice();
                        if (isAdd)
                            swimlane.lanes.push(node);
                        else {
                            var index = ej.datavisualization.Diagram.canvasHelper._getLaneIndex(swimlane, node);
                            swimlane.lanes.splice(index, 1);
                        }
                        currCollection = swimlane.lanes
                        element = swimlane;
                        property = "lanes";
                    }
                    else if (parent.isPhaseStack) {
                        var swimlane = this._getNode(parent.parent);
                        preCollection = swimlane.phases;
                        preCollection = preCollection.slice();
                        if (isAdd)
                            swimlane.phases.push(node);
                        else {
                            var index = ej.datavisualization.Diagram.SwimLaneContainerHelper._getPhaseIndex(this, node.name);
                            swimlane.phases.splice(index, 1);
                        }
                        currCollection = swimlane.phases
                        element = swimlane;
                        property = "phases";
                    }
                    else {
                        var parent = this._getNode(node.parent);

                        var children = [];
                        var index = -1;
                        for (var k = 0; k < parent.children.length; k++) {
                            var child = this._getNode(parent.children[k]);
                            if (child) {
                                if (child.name === node.name) {
                                    index = k;
                                }
                                children.push(child);
                            }
                        }
                        preCollection = children.slice();
                        currCollection = children.slice();
                        if (isAdd)
                            currCollection.push(node);
                        else
                            currCollection.splice(index, 1)

                        element = parent;
                        property = "children";
                    }

                    var resource = {
                        element: element, cause: this._isDragg || (this.activeTool.inAction) ?
                        ej.datavisualization.Diagram.ActionType.Mouse : ej.datavisualization.Diagram.ActionType.Unknown,
                        propertyName: property, oldValue: preCollection, newValue: currCollection
                    };
                    this._raisePropertyChange(resource);
                }
            }
        },
        addLane: function (node, index) {
            this._isLaneApi = true;
            if (node.isLane) {
                node = this._dynamicLane(node, this);
                if (!index && !node.parent) {
                    node = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(node, this);
                    this.add(node);
                }
                else {
                    var swimlane = this._updateDynamicLane(this, node, index);
                    if (swimlane && swimlane.isSwimlane) {
                        var stack = this.nameTable[this._getChild(swimlane.children[2])];
                        node = ej.datavisualization.Diagram.canvasHelper._updateDropLaneProperties(this, node, swimlane);
                        if (index || index === 0) {
                            stack.children.splice(index, 0, node);
                        }
                        else
                            stack.children.push(node);
                        node.parent = stack.name;
                        this._swimlaneObject = true;
                    }
                    else
                        node = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(node, this);
                    this.add(node);
                    if (stack && swimlane) {
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, stack);
                        ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, swimlane);
                        this._clearSelection(true);
                        this._addSelection(swimlane);
                    }
                    delete this._swimlaneObject;
                }
            }
            delete this._isLaneApi;
        },
        _dynamicLane: function (node, diagram) {
            var obj = ej.datavisualization.Diagram.SwimLaneHelper._createPaletteLane(node, diagram.nameTable);
            var orientation = obj.orientation;
            obj = ej.datavisualization.Diagram.SwimLaneHelper._createDiagramLane(obj, diagram.nameTable);
            obj.minHeight = node.height;
            obj.minWidth = node.width;
            obj.parent = node.parent;
            obj.orientation = orientation;
            if (node.orientation)
                obj.orientation = node.orientation;
            if (obj.isLane)
                obj = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, obj);
            return obj;
        },
        _updateDynamicLane: function (diagram, node, arg) {
            if (node.parent)
                var swimlane = diagram.nameTable[node.parent];
            else {
                for (var i = 0; i < this.selectionList.length; i++)
                    var swimlane = this.selectionList[i];
            }
            return swimlane;
        },

        _resetValues: function (node) {
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (node) {
                    if (node._points)
                        delete node._points
                    if (node._sourceNodeInfo)
                        delete node._sourceNodeInfo;
                    if (node._targetNodeInfo)
                        delete node._targetNodeInfo;
                    if (node._obstacle)
                        delete node._obstacle;
                    if (node._outerBounds)
                        delete node._outerBounds;
                    if (node._sourcePointInfo)
                        delete node._sourcePointInfo;
                    if (node._sourcePortInfo)
                        delete node._sourcePortInfo;
                    if (node._targetPointInfo)
                        delete node._targetPointInfo;
                    if (node._targetPortInfo)
                        delete node._targetPortInfo;
                }
            }
        },

        _add: function (node, render, arg, restrictSelection) {
            this._resetValues(node);
            if (!node.length > 0) {
                node = ej.datavisualization.Diagram.NodeType(node, this);
                var nodeTemplate, connectorTemplate;
                if (this.model.nodeTemplate && node._type === "node")
                    nodeTemplate = this._getNodeTemplate();
                else
                    connectorTemplate = this._getConnectorTemplate();
                if (nodeTemplate)
                    nodeTemplate(this, node);
                if (connectorTemplate)
                    connectorTemplate(this, node);
            }
            if (!node.pivot) node.pivot = { x: 0.5, y: 0.5 };

            var node1;
            if (node && (node.segments || node.sourcePoint || node.targetPoint || node.sourceNode || node.targetNode)
                && !((node.segments && node.segments[0] && node.segments[0].points))) {
                node1 = $.extend(true, {}, node);
                node1 = this._getNewConnector(node1);
            }
            if ((node1 && this._outOfBoundsOnNudge(node1, 0, 0)) || (!node1 && this._outOfBoundsOnNudge(node, 0, 0))) {
                var tempEventCause = this._eventCause;
                this._raiseChildrenPropertyChange(node, true);
                this._eventCause = tempEventCause;
                var success = false, type;
                if ((node.isSwimlane || node.type === "swimlane") && !this._pasteObj) {
                    if (this._isNewNode)
                        node = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, node);
                }
                if (node.length > 0) {
                    for (var i = 0; i < node.length; i++) {
                        this.add(node[i]);
                    }
                } else {
                    //#region for temporary
                    if (node.addInfo) {
                        if (node.addInfo.height)
                            node.height = node.addInfo.height;
                        if (node.addInfo.width)
                            node.width = node.addInfo.width;
                    }
                    //#endregion
                    if (node.type == "connector") type = "connector"; else type = "node";
                    var args = { changeType: "insert", element: this.getNode(node) };
                    if (node.isLane) {
                        if (this._isDragg || !this._selectedSymbol) {
                            var cause = this._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Drop;
                            if (this._isLaneApi) {
                                cause = ej.datavisualization.Diagram.GroupChangeCause.Unknown;
                            }

                            var laneNode = this.getNode(node);
                            var args = { changeType: "insert", element: laneNode, state: "changing" };
                            this._eventCause["nodeCollectionChange"] = cause;

                            var args1 = args;
                            args = this._raiseEvent(type + "CollectionChange", args);
                            if (!args)
                                args = args1;

                            if (!args.cancel) {
                                this._updateLane(node, args.element);
                                this._raiseGroupChangeEvent(laneNode, null, this.getNode(node.parent), cause);
                            }
                        }
                        else {
                            this._updateLane(node, args.element);
                        }
                    }
                    else if (node.isSwimlane) {
                        args = this._raiseCollectionChangeEvent(node, type);
                        this._updateSwimlane(node, args.element, true);

                    }
                    else if (node.container && !$.isEmptyObject(node.container)) {
                        node = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, node);
                    }
                    if (!(node.isLane || node.isSwimlane)) {
                        if (node.type != "connector") {
                            var cause = this._eventCause[type + "CollectionChange"];
                            if (!cause)
                                this._eventCause[type + "CollectionChange"] = this._isUndo ? ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange : ej.datavisualization.Diagram.CollectionChangeCause.Unknown;
                            if (node._type === "group" || (node.children && node.children.length > 0)) {
                                this._convertGroupChild(node, []);
                                node = ej.datavisualization.Diagram.Group(node);
                                this.nameTable[node.name] = node;
                                args = this._raiseCollectionChangeEvent(node, type);
                                node._type = "group";
                                if (node.type == "bpmn") node = ej.datavisualization.Diagram.Util._updateBpmnChild(node, this);
                                this._initGroupNode(node);
                                if (!this._isGroupNode && node.type !== "bpmn")
                                    this._udpateChildRotateAngle(node);
                            }
                            else if (!node.isPhase) {
                                //if (!(this.activeTool && this.activeTool.name === "textTool"))
                                node = this._getNewNode(node);
                                this.nameTable[node.name] = node;
                                args = this._raiseCollectionChangeEvent(node, type);
                                this._getNodeDimension(node);
                            }
                            if (!args.cancel) {
                                node._status = "new";
                                success = (!node.parent) ? this.nodes().push(node) : true;
                                this._nodes = $.extend(true, [], this.nodes());
                                this.nameTable[node.name] = node;

                                if (success) {
                                    if (this._containerOverNode) {
                                        ej.datavisualization.Diagram.canvasHelper._addNodeToContainer(this, node, this._containerOverNode);
                                        delete this._containerOverNode;
                                    }
                                    if (node._type === "group" || (node.children && node.children.length > 0)) {
                                        this._updateParent(node);

                                        if (node.offsetX == 0 && node.offsetY == 0)
                                            ej.datavisualization.Diagram.Util._updateGroupBounds(node, this, true);
                                        this._updateChildrenEdges(node);
                                        var parent = null;
                                        parent = this._updateChildOnGroup(node);
                                        if (render && !node.parent) {
                                            delete this._isNodeInitializing;
                                            //ej.datavisualization.Diagram.Util._updateGroupBounds(node, this, true);
                                            ej.datavisualization.Diagram.DiagramContext.renderGroup(node, this);
                                        }
                                    } else {
                                        if (render) {
                                            var parent = null;
                                            parent = this._updateChildOnGroup(node);
                                            if ((node.parent === "" || node.isPhase) || this._isInsert)
                                                ej.datavisualization.Diagram.DiagramContext.renderNode(node, this, parent);                                            
                                            if (this._selectedSymbol && node.textBlock) {
                                                var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                                                if (htmlLayer) {
                                                    var textElement = $(htmlLayer).find("#" + node.name + "label")[0];
                                                    if (textElement && textElement.childNodes && textElement.childNodes.length > 0)
                                                        textElement.childNodes[0].style.display = "none";
                                                }
                                            }
                                        }
                                    }
                                    this._updateQuad(node);
                                    this.nameTable[node.name] = node;
                                    if (node._type === "group" || (node.children && node.children.length > 0)) {
                                        for (var i = 0; i < node.children.length; i++) {
                                            var child = node.children[i];
                                            this.nameTable[child.name] = child;
                                        }
                                    }
                                    if (render && !restrictSelection) {
                                        this._clearSelection(true);
                                        this._addSelection(node);
                                    }
                                }
                            }
                            this._addNodeToGraph(node)
                        }
                        else {
                            node = this._getNewConnector(node);
                            this.nameTable[node.name] = node;
                            var cause = this._eventCause[type + "CollectionChange"];
                            if (!cause)
                                this._eventCause[type + "CollectionChange"] = this._isUndo ? ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange : ej.datavisualization.Diagram.CollectionChangeCause.Unknown;
                            args = this._raiseCollectionChangeEvent(node, type);
                            if (!args.cancel) {
                                success = (!node.parent) ? this.connectors().push(node) : true;
                                node._status = "new";
                                if (success) {
                                    this._updateEdges(node);
                                    this._dock(node, this.nameTable);
                                    this._routeEdge(node);
                                    ej.datavisualization.Diagram.Util.updateBridging(node, this);
                                    this._updateConnectorBridging(node);
                                    if (!node.parent) {
                                        if (render) {
                                            ej.datavisualization.Diagram.DiagramContext.renderConnector(node, this);
                                        }
                                    }
                                    this.nameTable[node.name] = node;
                                    this._updateQuad(node);
                                    this._updateChildOnGroup(node);
                                    if (render && !restrictSelection) {
                                        this._clearSelection(true);
                                        this._addSelection(node);
                                    }
                                }
                            }

                        }
                    }
                    else {
                        if (!args.cancel) {
                            if (node.isLane && (((this._selectedSymbol && this._selectedSymbol.isLane) || this._swimlaneObject) || this._isUndo))
                                success = true;
                            else
                                success = this.nodes().push(node);

                            this._nodes = $.extend(true, [], this.nodes());
                            this.nameTable[node.name] = node;

                            if (success) {
                                if (node._type === "group") {
                                    if (render) {
                                        if (this._paletteItemClick) {
                                            node.offsetX = node.minWidth / 2 + 50;
                                            node.offsetY = node.minHeight / 2 + 50;
                                        }
                                        ej.datavisualization.Diagram.DiagramContext.renderGroup(node, this);
                                        if (node.phases && node.phases.length > 0) {
                                            var cphase = null;
                                            for (var i = 0, len = node.phases.length; i < len; i++) {
                                                cphase = this.nameTable[this._getChild(node.phases[i])];
                                                if (cphase.type == "phase") {
                                                    ej.datavisualization.Diagram.SvgContext.renderphase(cphase, this._svg, this._diagramLayer, this);
                                                }
                                            }
                                        }
                                        this._clearSelection(true);
                                        this._addSelection(node);
                                    }
                                }
                                this._updateQuad(node);
                            }
                        }
                    }
                }
                this._setZorder(node);
                if (!this._isUndo && (!this._selectedSymbol || this._endEditing) && success) {
                    var childTable = {};
                    if (this.selectionList && this.selectionList.length > 0)
                        childTable = this._getChildTable(this.selectionList[0], childTable);
                    //if (node.isSwimlane) {
                    //    node = this._getNode(node.name, this.nameTable);
                    //}
                    if ((!arg || (arg && !arg.entryHistory)) && !node.isPhase) {
                        var entry = { type: "collectionchanged", object: jQuery.extend(true, {}, node), childTable: jQuery.extend(true, {}, childTable), changeType: "insert", category: "internal" };
                        this.addHistoryEntry(entry);
                    }
                }
                this._trigger("refresh");
                this._isRefreshTriggered = true;
                if (success && !node.isPhase && !node.isLane && (!this._selectedSymbol || this._endEditing)) {
                    args.state = "changed";
                    this._raiseEvent(type + "CollectionChange", args);
                }
            }
            delete this._isNewNode;
            return success;
        },
        _raiseCollectionChangeEvent: function (node, type) {
            var args = { changeType: "insert", element: this.getNode(node), state: "changing" };
            if (!node.isPhase && (!this._selectedSymbol || this._endEditing)) {
                this._raiseEvent(type + "CollectionChange", args);
                node._absolutePath = null;
            }
            return args;
        },
        add: function (node, args) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                this._isNodeInitializing = true;
                this._isNewNode = true;
                var activelayer = ej.datavisualization.Diagram.Util.enableLayerOption({}, "active", this);

                if (activelayer) {
                    activelayer = ej.datavisualization.Diagram.Layers(activelayer);
                    if (activelayer.objects.indexOf(node.name) < 0) {
                        activelayer.objects.push(node.name)
                    }
                }
                var returnVal = this._add(node, true, args);
                delete this._isNodeInitializing;
                return returnVal;
            }
        },
        updateUserHandles: function (node) {
            node = this.nameTable[node.name];
            ej.datavisualization.Diagram.SvgContext.updateUserHandles(this.model.selectedItems.userHandles, node, this._adornerSvg, false, false, this._currZoom, this);
        },
        scrollToNode: function (node) {
            var nodeX, nodeY;
            var hScrollPadding = (this._vScrollbar && this._vScrollbar._scrollData) ? this._vScrollbar._scrollData.buttonSize : 0;
            var vScrollPadding = (this._hScrollbar && this._hScrollbar._scrollData) ? this._hScrollbar._scrollData.buttonSize : 0;
            var curZoomfactor = this._currZoom;
            var elementBounds = this.element[0].getBoundingClientRect();
            var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
            nodeX = (nodeBounds.x + nodeBounds.width / 2) * curZoomfactor;
            nodeY = (nodeBounds.y + nodeBounds.height / 2) * curZoomfactor;
            var hScrollOffset = this._hScrollOffset, vScrollOffset = this._vScrollOffset;
            if (elementBounds.width + this._hScrollOffset < (nodeX + ((nodeBounds.width / 2) * curZoomfactor))) {
                hScrollOffset = (nodeX + ((nodeBounds.width / 2 + hScrollPadding) * curZoomfactor) - elementBounds.width); // * 20 as scroll bar width 
            }
            if (elementBounds.height + this._vScrollOffset < (nodeY + ((nodeBounds.height / 2) * curZoomfactor))) {
                vScrollOffset = (nodeY + ((nodeBounds.height / 2 + vScrollPadding) * curZoomfactor) - elementBounds.height); // * 20 as scroll bar height 
            }
            this._updateScrollOffset(hScrollOffset, vScrollOffset);
        },
        findNode: function (id) {
            return this._findNode(id);
        },
        getObjectType: function (element) {
            return ej.datavisualization.Diagram.Util.getObjectType(element);
        },
        //#endregion
        //#region support methods       
        _registerDrawingTools: function () {
            for (var toolname in this.model.drawingTools) {
                var tool = this.model.drawingTools[toolname];
                tool.diagram = this;
                this.tools[tool.name] = tool;
            }
        },
        _sortByXvalue: function (nodes) {
            var temp, i, j;
            var fNode, lNode;
            for (i = 0; i < nodes.length; i++) {
                for (j = i + 1; j < nodes.length; j++) {
                    var nodei = this.nameTable[this._getChild(nodes[i])];
                    var nodej = this.nameTable[this._getChild(nodes[j])];
                    fNode = ej.datavisualization.Diagram.Util.bounds(nodei);
                    lNode = ej.datavisualization.Diagram.Util.bounds(nodej);
                    if ((fNode.x > lNode.x) || (fNode.right > lNode.right)) {
                        temp = nodes[i];
                        nodes[i] = nodes[j];
                        nodes[j] = temp;
                    }
                }
            }
            return nodes;
        },
        _sortByYvalue: function (nodes) {
            var temp, i, j;
            var fNode, lNode;
            for (i = 0; i < nodes.length; i++) {
                for (j = i + 1; j < nodes.length; j++) {
                    var nodei = this.nameTable[this._getChild(nodes[i])];
                    var nodej = this.nameTable[this._getChild(nodes[j])];
                    fNode = ej.datavisualization.Diagram.Util.bounds(nodei);
                    lNode = ej.datavisualization.Diagram.Util.bounds(nodej);
                    if ((fNode.y > lNode.y) || (fNode.bottom > lNode.bottom)) {
                        temp = nodes[i];
                        nodes[i] = nodes[j];
                        nodes[j] = temp;
                    }
                }
            }
            return nodes;
        },
        _sortByZIndex: function (nodes, asc) {
            var temp, i, j;
            if (!asc) {
                for (i = 0; i < nodes.length; i++) {
                    for (j = i + 1; j < nodes.length; j++) {
                        if (nodes[i].zOrder < nodes[j].zOrder) {
                            temp = nodes[i];
                            nodes[i] = nodes[j];
                            nodes[j] = temp;
                        }
                    }

                }
            }
            else {
                for (i = 0; i < nodes.length; i++) {
                    for (j = i + 1; j < nodes.length; j++) {
                        if (nodes[i].zOrder > nodes[j].zOrder) {
                            temp = nodes[i];
                            nodes[i] = nodes[j];
                            nodes[j] = temp;
                        }
                    }

                }
            }
            return nodes;
        },
        _updateBPMNIndex: function (node, asc) {
            var temp, i, j;
            if (node.type === "bpmn" && node.parent) {
                var parent = this.nameTable[node.parent];
                if (parent && parent.isLane) {
                    var children = parent.children;
                    for (i = 0; i < children.length; i++) {
                        for (j = i + 1; j < children.length; j++) {
                            var childeNode1 = this.nameTable[this._getChild(children[i])];
                            var childeNode2 = this.nameTable[this._getChild(children[j])];
                            if ((!asc ? childeNode1.zOrder < childeNode2.zOrder : childeNode1.zOrder > childeNode2.zOrder) &&
                                !childeNode1.isPhase && !childeNode2.isPhase && !childeNode1.isLane && !childeNode2.isLane) {
                                temp = children[i];
                                children[i] = children[j];
                                children[j] = temp;
                            }
                        }
                    }
                }
            }
        },
        _sortByGroupChildrenZIndex: function (asc) {
            var nodes = this.nodes();
            var temp, i, j, k;
            for (k = 0; k < nodes.length; k++) {
                var node = nodes[k];
                this._updateBPMNIndex(node, asc);
                if (node._type === "group" && node.type !== "bpmn" && !node.isSwimlane) {
                    var children = this._getChildren(node.children);
                    for (i = 0; i < children.length; i++) {
                        for (j = i + 1; j < children.length; j++) {
                            var childeNode1 = this.nameTable[this._getChild(children[i])];
                            var childeNode2 = this.nameTable[this._getChild(children[j])];
                            if ((!asc ? childeNode1.zOrder < childeNode2.zOrder : childeNode1.zOrder > childeNode2.zOrder) &&
                                !childeNode1.isPhase && !childeNode2.isPhase && !childeNode1.isLane && !childeNode2.isLane) {
                                temp = children[i];
                                children[i] = children[j];
                                children[j] = temp;
                            }
                        }
                    }
                    node.children = children;
                }
            }
        },
        _findCornerNodes: function () {
            var lNode, rNode, tNode, bNode, i, nBounds;
            var list = this.selectionList[0].children;
            var fnode = this.nameTable[this._getChild(this.selectionList[0].children[0])];
            lNode = fnode, rNode = fnode, tNode = fnode, bNode = fnode;
            if (list.length > 1) {
                for (i = 0; i < list.length; i++) {
                    var node = this.nameTable[this._getChild(list[i])];
                    nBounds = ej.datavisualization.Diagram.Util.bounds(node);

                    var rNodeBounds = ej.datavisualization.Diagram.Util.bounds(rNode);
                    if ((nBounds.x + nBounds.width) > (rNodeBounds.x + rNodeBounds.width))
                        rNode = node;

                    var bNodeBounds = ej.datavisualization.Diagram.Util.bounds(bNode);
                    if ((nBounds.y + nBounds.height) > (bNodeBounds.y + bNodeBounds.height))
                        bNode = node;

                    var lNodeBounds = ej.datavisualization.Diagram.Util.bounds(lNode);
                    if (nBounds.x < lNodeBounds.x)
                        lNode = node;

                    var tNodeBounds = ej.datavisualization.Diagram.Util.bounds(tNode);
                    if (nBounds.y < tNodeBounds.y)
                        tNode = node;
                }
            }
            return { left: lNode, right: rNode, top: tNode, bottom: bNode };
        },

        _comparePropertyOnAlign: function (node, diffX, diffY, root) {
            if (node) {
                if (!node.segments) {
                    if (node.offsetX != (node.offsetX + diffX))
                        this._comparePropertyValues(node, "offsetX", { offsetX: node.offsetX + diffX }, null, root);
                    if (node.offsetY != node.offsetY + diffY)
                        this._comparePropertyValues(node, "offsetY", { offsetX: node.offsetY + diffY }, null, root);
                }
                else {
                    this._comparePropertyValues(node, "sourcePoint", { sourcePoint: { x: node.sourcePoint.x + diffX, y: node.sourcePoint.y + diffY } }, root);
                    this._comparePropertyValues(node, "targetPoint", { targetPoint: { x: node.targetPoint.x + diffX, y: node.targetPoint.y + diffY } }, root);
                }
            }
        },

        _moveNode: function (diffX, diffY, node) {
            this._comparePropertyOnAlign(node, diffX, diffY, ej.datavisualization.Diagram.ActionType.Align);
            this._translate(node, diffX, diffY, this.nameTable);
            this._updateNodeMargin(node);
            ej.datavisualization.Diagram.DiagramContext.update(node, this);
        },

        _updateContainerOnNudge: function (node) {
            var parent = this.nameTable[node.parent];
            if (parent && parent.container) {
                ej.datavisualization.Diagram.canvasHelper._updateNodeMargin(this, node, parent);
                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, parent, true);
            }
        },


        _outOfBoundsOnNudge: function (node, ptX, ptY) {
            var lane = this.nameTable[this._getChild(node.parent)];
            if (lane && lane.isLane && lane.parent) {
                var stack = this.nameTable[this._getChild(lane.parent)];
                if (stack && stack.isLaneStack && stack.parent) {
                    var swimlane = this.nameTable[this._getChild(stack.parent)];
                    if (swimlane && this.model.pageSettings.boundaryConstraints != "infinity") {
                        var laneBounds = ej.datavisualization.Diagram.Util.bounds(lane);
                        var nodeBounds = ej.datavisualization.Diagram.Util.bounds(node);
                        var swmlnBounds = ej.datavisualization.Diagram.Util.bounds(swimlane);
                        var swimRight = swmlnBounds.right;
                        var swimBottom = swmlnBounds.bottom;
                        if ((nodeBounds.bottom + ptY + 20 >= laneBounds.bottom))
                            swimBottom += ptY;
                        if ((nodeBounds.right + ptX + 20 >= laneBounds.right))
                            swimRight += ptX;
                        var size = this.activeTool._getPageBounds();
                        if ((ptY > 0 && swmlnBounds.bottom != swimBottom && swimBottom > size.height) || (ptX > 0 && swmlnBounds.right != swimRight && swimRight > size.width))
                            return false
                    }
                }
            }
            else {
                var tool = this.tools['move'];
                return tool._outOfBoundsDrag(node, ptX, ptY);
            }
            return true;
        },
        _anyFromSwimlane: function (node) {
            if (node.parent) {
                var parent = this.nameTable[node.parent];
                if (parent && parent.container && parent.isLane) {
                    return this._getSwimlane(parent);
                }
                else {
                    return this._anyFromSwimlane(parent)
                }
            }
            return null;
        },
        _nudge: function (node, x, y, direction, isChild, lastChild) {
            if (node && node.segments && (node.sourceNode && node.targetNode))
                return;
            var proceedY = true, proceedX = true, child;
            var pNode = this.nameTable[node.parent];

            var resource;
            if (node._type !== "label") {
                if (this._outOfBoundsOnNudge(node, x, y)) {
                    if (!isChild) {
                        if (!node.segments) {
                            var oldValue = (direction === "right" || direction === "left") ? node.offsetX : node.offsetY;
                            var newValue = (direction === "right" || direction === "left") ? node.offsetX + x : node.offsetY + y;
                            var propertyName = (direction === "right" || direction === "left") ? "offsetX" : "offsetY";
                            resource = { element: node, cause: ej.datavisualization.Diagram.ActionType.Nudge, keyCode: direction, propertyName: propertyName, oldValue: oldValue, newValue: newValue };
                            this._raisePropertyChange(resource);
                        }
                        else {
                            resource = {
                                element: node, cause: ej.datavisualization.Diagram.ActionType.Nudge, keyCode: direction, propertyName: "sourcePoint", oldValue: { sourcePoint: node.sourcePoint },
                                newValue: { sourcePoint: { x: node.sourcePoint.x + x, y: node.sourcePoint.y + y } }
                            };
                            this._raisePropertyChange(resource);
                            resource = {
                                element: node, cause: ej.datavisualization.Diagram.ActionType.Nudge, keyCode: direction, propertyName: "targetPoint", oldValue: { targetPoint: node.targetPoint },
                                newValue: { targetPoint: { x: node.targetPoint.x + x, y: node.targetPoint.y + y } }
                            };
                            this._raisePropertyChange(resource);
                        }
                    }
                    var parent = this.nameTable[node.parent];
                    var move
                    if (parent && parent.isLane)
                        move = this._moveOnLane(node, parent, x, y);
                    if (!proceedY || (move && !move.proceedY))
                        y = 0;
                    if (!proceedX || (move && !move.proceedX))
                        x = 0;
                    if (node.type == "pseudoGroup") {
                        var children = this._removeContainerConnector(this._getChildren(node.children));
                        children = this._sortByYvalue(children);
                        children = this._sortByXvalue(children);
                        //ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                        for (var i = children.length - 1; i >= 0; i--) {
                            child = this.nameTable[this._getChild(children[i])];
                            if (child) {
                                if (!this._nudge(child, x, y, direction, true, (i === 0))) {
                                    break;
                                }
                                //this._updateContainerOnNudge(child);
                            }
                        }
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdateNode(this, child);
                        delete this._disableSwimlaneUptate;
                        ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                    }
                    else {
                        this._translate(node, x, y, this.nameTable, undefined, undefined, true);
                        if (!lastChild) {
                            if (node.parent) {
                                var parent = this.nameTable[node.parent];
                                var swimlane = this._anyFromSwimlane(node);
                                if (swimlane && swimlane.isSwimlane) {
                                    ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                                    this._disablePhaseUpdate = true;
                                    this._disableSwimlaneUptate = true;
                                }
                            }
                        }
                        this._updateContainerOnNudge(node);
                    }
                    this._updateNodeMargin(node);
                    if (node.parent) {
                        var parent = this.nameTable[node.parent];
                        if (parent && parent.container) {
                            ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                            this._disablePhaseUpdate = true;
                            this._disableSwimlaneUptate = true;
                            if (parent.container.type === "canvas")
                                ej.datavisualization.Diagram.canvasHelper._updateCollectionChange(this, parent);
                            delete this._disablePhaseUpdate;
                            if (!isChild) {
                                //delete this._disableSwimlaneUptate;
                            }
                            var swimlane = this._anyFromSwimlane(node);
                            if (swimlane) {
                                ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, swimlane);
                                if (!isChild) {
                                    //delete this._disableSwimlaneUptate;
                                    //ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, swimlane);
                                }
                                if (!this._updateSwimlanes) {
                                    this._updateSwimlanes = [];
                                }
                                if (!this._collectionContains(swimlane.name, this._updateSwimlanes))
                                    this._updateSwimlanes.push(swimlane.name)
                                if (!isChild) {
                                    delete this._disableSwimlaneUptate;
                                    ej.datavisualization.Diagram.DiagramContext.update(swimlane, this);
                                    ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, swimlane, true);

                                }
                            }
                        }
                        if (lastChild && this._updateSwimlanes) {
                            delete this._disableSwimlaneUptate;
                            for (var m = 0; m < this._updateSwimlanes.length; m++) {
                                ej.datavisualization.Diagram.DiagramContext.update(this.nameTable[this._updateSwimlanes[m]], this);
                                ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, this.nameTable[this._updateSwimlanes[m]]);
                            }
                            delete this._updateSwimlanes;
                        }
                    }
                    else {
                        if (lastChild && this._updateSwimlanes) {
                            for (var m = 0; m < this._updateSwimlanes.length; m++) {
                                ej.datavisualization.Diagram.DiagramContext.update(this.nameTable[this._updateSwimlanes[m]], this);
                                ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, this.nameTable[this._updateSwimlanes[m]]);
                            }
                            delete this._updateSwimlanes;
                        }
                        else if (node.type != "pseudoGroup")
                            ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    }
                    this._updateSelectionHandle(true);
                    return true;
                }
                else return false;
                //ej.datavisualization.Diagram.SvgContext.updateSelector(node, this._svg, this._currZoom, this, this.model.selectedItems.constraints);
            }
            else {
                pNode = this.findNode(node._parent);
                this.translateLabel(pNode, node, x, y);
                ej.datavisualization.Diagram.DiagramContext.update(node, this);
                this._updateSelectionHandle(true);
                return true;
            }
        },
        _removeContainerConnector: function (collection) {
            var rCollection = [];
            if (collection && collection.length > 0) {
                for (var i = 0; i < collection.length; i++) {
                    var child = this.nameTable[this._getChild(collection[i])];
                    if (child && !child.segments) {
                        rCollection.push(collection[i]);
                    }
                    else if (child.segments && ((!child.sourceNode && !child.targetNode))) {
                        rCollection.push(collection[i]);
                    }
                }
            }
            return rCollection;
        },
        _moveOnLane: function (node, parent, x, y) {
            var proceedY = false, dx = 0, proceedX = false, dy = 0;
            x = x ? x : 0; y = y ? y : 0;
            if (parent.children && parent.children.length > 0) {
                var header = this.nameTable[this._getChild(parent.children[0])];
                if (header && header.name.indexOf("_Headerr") != -1) {
                    if (parent.orientation === "horizontal") {
                        dx = header.width;
                    }
                    else if (parent.orientation === "vertical") {
                        dy = header.height;
                    }
                }
            }
            if (node && parent) {
                var nBBox = ej.datavisualization.Diagram.Util.bounds(node);
                var gBBox = ej.datavisualization.Diagram.Util.bounds(parent);
                if (nBBox.y + y >= gBBox.y + parent.paddingTop + dy) {
                    proceedY = true;
                }
                if (nBBox.x + x >= gBBox.x + parent.paddingLeft + dx) {
                    proceedX = true;
                }
                return {
                    proceedY: proceedY, proceedX: proceedX,
                    x: (gBBox.x + parent.paddingLeft + dx) - nBBox.x + x,
                    y: (gBBox.y + parent.paddingTop + dy) - nBBox.y + y,
                };
            }
        },
        _selectCommand: function (args) {
            if (this._isEditing) {
                this._endEdit();
                document.getElementById(this._id).focus();
            }
            args.keyDownEventArgs.preventDefault();
            this.selectAll();
        },
        _nudgeCommand: function (args) {
            if (!this._currentState && this.selectionList[0]) { this._currentState = { x: this.selectionList[0].offsetX, y: this.selectionList[0].offsetY }; }
            this.nudge(args.parameter, args.keyDownEventArgs.shiftKey ? 5 : 1);
            args.keyDownEventArgs.preventDefault();
        },
        _startEditCommand: function () {
            if (this.selectionList.length > 0) {
                var shape = this.selectionList[0];
                if (!(shape.type == "pseudoGroup")) {
                    if (shape.type === "text" && this._setLabelEditing(shape.textBlock))
                        this._startEdit(shape);
                    if (shape.isSwimlane) {
                        var header = this.nameTable[shape.name + "_header_swimlane"];
                        if (header)
                            this._startEdit(header);
                    }
                    else if (shape.isLane) {
                        if (shape.children && shape.children.length > 0) {
                            header = this.nameTable[this._getChild(shape.children[0])];
                            if (header)
                                this._startEdit(header);
                        }
                    }
                    else if (shape.type && shape.type === "phase") {
                        var phase = this.nameTable["phaseStack" + shape.name]
                        if (phase)
                            this._startEdit(phase);
                    }
                    else if (shape.labels.length > 0 && this._setLabelEditing(shape.labels[0]))
                        this._startEdit(shape);
                }
            }
        },
        _findObjectByName: function (name) {
            var node = null;
            if (this._findNode(name))
                node = this._findNode(name);
            if (this._findConnector(name))
                node = this._findConnector(name);
            return node;
        },
        _findObjectByIndex: function (index, group) {
            var nodes, findNode = null, node, m, k;
            if (group) {
                var parent = this.nameTable[this.selectionList[0].parent];
                if (parent) {
                    nodes = this._getChildren(parent.children);
                    for (k = 0; k < nodes.length; k++) {
                        node = this.nameTable[nodes[k]];
                        if (node.zOrder === index)
                            findNode = nodes[k];
                    }
                }
            } else {
                for (m = 0; m < this.nodes().length; m++) {
                    node = this.nodes()[m];
                    if (node.zOrder === index && !node._isProcessed) {
                        findNode = node;
                        node._isProcessed = true;
                    }
                }
                for (m = 0; m < this.connectors().length; m++) {
                    node = this.connectors()[m];
                    if (node.zOrder === index && !node._isProcessed) {
                        findNode = node;
                        node._isProcessed = true;
                    }
                }
            }
            if (typeof (findNode) === "string")
                return this.nameTable[findNode];
            return findNode;
        },
        _findOverlapNode: function (node, orderType) {
            var oNodes = [], m, i, rNodes = [];
            if (!node.parent) {
                for (m = 0; m < this.nodes().length; m++) {
                    oNodes.push(this.nameTable[this._getChild(this.nodes()[m])]);
                }
                for (m = 0; m < this.connectors().length; m++) {
                    oNodes.push(this.nameTable[this._getChild(this.connectors()[m])]);
                }
                if (orderType === "sendToBack" || orderType === "bringToFront")
                    return oNodes;
                var nBound = ej.datavisualization.Diagram.Util.bounds(node);
                if (node) {
                    for (i = 0; i < oNodes.length; i++) {
                        var chBound = ej.datavisualization.Diagram.Util.bounds(oNodes[i]);
                        if (node.name !== oNodes[i].name && !(node.children && this._collectionContains(oNodes[i].name, node.children))) {
                            if (this._intersect(nBound, chBound))
                                rNodes.push(oNodes[i]);
                        }
                    }
                }
            } else {
                var nBound = ej.datavisualization.Diagram.Util.bounds(node);
                var parent = this.nameTable[node.parent], child;
                if (parent) {
                    var children = this._getChildren(parent.children);
                    for (m = 0; m < children.length; m++) {
                        if (children[m] !== node.name) {
                            child = this.nameTable[children[m]];
                            var chBound = ej.datavisualization.Diagram.Util.bounds(child);
                            if (child && this._intersect(nBound, chBound))
                                rNodes.push(child);
                        }
                    }
                }
            }
            return rNodes;
        },
        _intersect: function (a, b) {
            return (a.x <= (b.x + b.width) &&
                b.x <= (a.x + a.width) &&
                a.y <= (b.y + b.height) &&
                b.y <= (a.y + a.height));
        },
        _focusToItem: function (args) {
            var nodes = this.nodes(), connectors = this.connectors();
            var index = 0, elements = [], bounds;
            var diagram = this;
            if (nodes.length || connectors.length) {
                if (!this._diagramElements) {
                    elements = this.nodes().concat(this.connectors());
                    elements = this._sortByZIndex(elements, true);
                    elements = elements.map(function (item) { return item.name; })
                    this._diagramElements = elements;
                }
                if (!this._focusedElement && !this.selectionList.length && this._diagramElements.length) {
                    index = args.keyDownEventArgs.shiftKey ? 0 : this._diagramElements.length - 1;
                }
                else {
                    if (!this._focusedElement) {
                        if (this.selectionList[0].type != "pseudoGroup")
                            index = this._diagramElements.indexOf(this.selectionList[0].name);
                        else
                            index = Math.min.apply(Math, this.selectionList[0].children.map(function (child) { return diagram._diagramElements.indexOf(child.name || child); }));
                    }
                    else index = this._diagramElements.indexOf(this._focusedElement);
                }
                do {
                    if (args.keyDownEventArgs.shiftKey)
                        index = index != 0 ? --index : this._diagramElements.length - 1;
                    else
                        index = index != this._diagramElements.length - 1 ? ++index : 0;
                    if (this.nameTable[this._diagramElements[index]].type == "pseudoGroup") continue;
                    this._focusedElement = this._diagramElements[index];
                } while (!ej.datavisualization.Diagram.Util.canSelect(this.nameTable[this._focusedElement]) && ej.datavisualization.Diagram.Util.enableLayerOption(this.nameTable[this._focusedElement], "lock", this));

                bounds = ej.datavisualization.Diagram.Util.bounds(this.nameTable[this._focusedElement]);
                bounds = { x: bounds.x - 8, y: bounds.y - 8, width: bounds.width + 16, height: bounds.height + 16 };
                this.bringIntoView({ x: bounds.x - 25, y: bounds.y - 25, width: bounds.width + 50, height: bounds.height + 50 });
                ej.datavisualization.Diagram.SvgContext._drawNavigationHighlighter(bounds, this._adornerSvg, this._adornerLayer, this._currZoom);
                args.keyDownEventArgs.preventDefault();
            }
        },
        _selectFocusedItem: function (args) {
            ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this._adornerSvg, this._adornerLayer);
            var element = this.nameTable[this._focusedElement];
            this._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Keydown;
            if (element) this.addSelection(element, true);
            this._diagramElements = null;
            this._focusedElement = null;
            args.keyDownEventArgs.preventDefault();
        },
        //#endregion 
        //#region Rendering
        _createDefaultTooltip: function () {
            var div = document.createElement("div");
            var attr = {
                "id": this.element[0].id + "_DefaulttooltipDiv",
                "class": "e-diagram-tooltip-default",
                "style": "padding-top:3px; height: 24px;pointer-events:none;",
            };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            this._tooltipLayer.appendChild(div);
            if (!this.model.tooltipTemplateId) {
                var span = document.createElement("span");
                attr = { "class": "e-diagram-tooltipLabel-default", "id": "e-diagram-tooltipLabel-default" };
                ej.datavisualization.Diagram.Util.attr(span, attr);
                div.appendChild(span);
            }
            return div;
        },
        _createMouseOverTooltip: function () {
            var div = document.createElement("div");
            var attr = {
                "id": this.element[0].id + "_mouseovertooltipDiv",
                "class": "e-diagram-tooltip-mouseover",
                "style": "pointer-events:none;",
            };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            this._tooltipLayer.appendChild(div);
            return div;
        },
        _renderTooltip: function (object, start) {
            if ((object.parent && this.nameTable[object.parent] && this.nameTable[object.parent].container)) {
                var scale = this._currZoom;
                var bounds = ej.datavisualization.Diagram.Util.bounds(this.activeTool.helper, true);
                object = { x: (bounds.x) * scale, y: (bounds.y) * scale, width: (bounds.width) * scale, height: (bounds.height) * scale, rotateAngle: this.activeTool.helper.rotateAngle, offsetX: this.activeTool.helper.offsetX, offsetY: this.activeTool.helper.offsetY, type: "SwimlaneHelper" };
            }
            if (this.model.selectedItems.tooltip) {
                var tooltipDiv = document.getElementById(this.element[0].id + "_DefaulttooltipDiv");
                if (!tooltipDiv) {
                    tooltipDiv = this._createDefaultTooltip();
                }
                var template;
                var objectValues;
                var html;
                var width;
                var curZoomfactor = this._currZoom;
                if (!this.model.selectedItems.tooltip.templateId) {
                    if (start) tooltipDiv.style.width = "150px";
                    width = 150;
                    var span = tooltipDiv.childNodes[0];
                    if (this.activeTool instanceof ej.datavisualization.Diagram.MoveTool) {
                        if (!object.segments) {
                            if (object.type !== "SwimlaneHelper") {
                                 objectValues = "X : " +Math.round((object.offsetX -object.width * object.pivot.x)) + "px  " + "Y : " +Math.round((object.offsetY -object.height * object.pivot.y)) + "px";
                            }
                              else {
                                    objectValues = "X : " +Math.round(object.x) + "px  " + "Y : " +Math.round(object.y) + "px";
                          }
                          }
                          } else if (this.activeTool instanceof ej.datavisualization.Diagram.ResizeTool) {                             
                            objectValues = "W : " +Math.round(object.width) + "px  H : " +Math.round(object.height) + "px";                          
                          } else if (this.activeTool instanceof ej.datavisualization.Diagram.RotateTool) {
                            if (start) tooltipDiv.style.width = "50px";
                             width = 50;
                             objectValues = Math.round(object.rotateAngle) + "\xB0";                             
                             }
                          if (objectValues) {
                            var obj = this._getTooltipPosition(object, this.model.selectedItems.tooltip);
                            obj.x = -this._hScrollOffset +obj.x * curZoomfactor;
                            obj.y = - this._vScrollOffset +obj.y * curZoomfactor;
                            tooltipDiv.style.top = obj.y + "px";
                            tooltipDiv.style.left = obj.x + "px";
                            tooltipDiv.style.transform = "translate(" +obj.tx + " ," +obj.ty + ")";
                            span.textContent = objectValues;
                        } else {
                            this._removeTooltip();
                            }
                    } else if ($.templates && this.model.selectedItems.tooltip) {
                        if (!object.segments) {
                            var obj = this._getTooltipPosition(object, this.model.selectedItems.tooltip);
                            obj.x = -this._hScrollOffset +obj.x * curZoomfactor;
                            obj.y = - this._vScrollOffset +obj.y * curZoomfactor;
                            tooltipDiv.style.top = obj.y + "px";
                            tooltipDiv.style.left = obj.x + "px";
                            tooltipDiv.style.transform = "translate(" +obj.tx + " ," +obj.ty + ")";
                            template = $.templates("#" +this.model.selectedItems.tooltip.templateId);
                        // objectValues = [{ name: this.activeTool.selectedObject.name, x: (object.offsetX - object.width / 2) + "px", y: (object.offsetY - object.height / 2) + "px", width: object.width + "px", height: object.height + "px", rotationAngle: object.rotateAngle }];
                        html = template.render(object);
                        $(tooltipDiv).html(html);
                    }
                }
            }
        },

        _removeTooltip: function () {
            var tooltipDiv = document.getElementById(this.element[0].id + "_DefaulttooltipDiv");
            if (tooltipDiv) {
                tooltipDiv.parentNode.removeChild(tooltipDiv);
            }
        },
        _removeMouseOverTooltip: function () {
            var tooltipDiv = document.getElementById(this.element[0].id + "_mouseovertooltipDiv");
            if (tooltipDiv) {
                tooltipDiv.parentNode.removeChild(tooltipDiv);
            }
        },
        _renderCanvas: function (isLoad) {
            this._browserInfo = ej.browserInfo();
            this._canvas = document.getElementById(this.element[0].id + "_canvas");
            if (!this._canvas) {
                this._canvas = document.createElement("div");
                this.element.append(this._canvas);
            }
            this._canvas.setAttribute("id", this.element[0].id + "_canvas");
            if (this._canvas.getAttribute("class") === null || this._canvas.getAttribute("class") === "")
                this._canvas.setAttribute("class", "drawing");
            $(this._canvas).css({
                position: "relative", height: this.model.height, width: this.model.width
            });
            this.element.css({
                overflow: "hidden", outline: "none", display: "block", height: this.model.height, width: this.model.width
            });
            this._views[this._id].canvas = this._canvas;
            this.element[0].setAttribute("tabindex", "0");

            this._renderDiagram(isLoad);
            if (ej.datavisualization.Diagram.Util.canFloatElements(this)) this._setItemDraggable(this._canvas);
        },
        _getDigramBounds: function (mode) {
            var left, top, right, bottom;
            left = this._spatialSearch.pageLeft || 0;
            top = this._spatialSearch.pageTop || 0;
            right = this._spatialSearch.pageRight - this._spatialSearch.pageLeft || 0;
            bottom = this._spatialSearch.pageBottom - this._spatialSearch.pageTop || 0;
            if (mode != "content") {
                if (this.model.pageSettings && this._multiplePage()) {
                    left = this._spatialSearch.pageLeft;
                    top = this._spatialSearch.pageTop;
                    if (this._pageWidth()) {
                        left = Math.floor(left / this._pageWidth()) * this._pageWidth();
                        right = Math.ceil(this._spatialSearch.pageRight / this._pageWidth()) * this._pageWidth() - left;
                    }
                    if (this._pageHeight()) {
                        top = Math.floor(top / this._pageHeight()) * this._pageHeight();
                        bottom = Math.ceil(this._spatialSearch.pageBottom / this._pageHeight()) * this._pageHeight() - top;
                    }
                    if (this._spatialSearch.pageRight === null) {
                        if (this._pageWidth() !== 0) {
                            right = this._pageWidth();
                        }
                    }
                    if (this._spatialSearch.pageBottom === null) {
                        if (this._pageHeight() !== 0) {
                            bottom = this._pageHeight();
                        }
                    }
                }
                else {
                    if (this._pageWidth()) {
                        left = 0;
                        right = this._pageWidth();
                    }
                    if (this._pageHeight()) {
                        top = 0;
                        bottom = this._pageHeight();
                    }
                }
            }
            var svgBounds = new ej.datavisualization.Diagram.Rectangle();
            svgBounds.x = left;
            svgBounds.y = top;
            svgBounds.width = right;
            svgBounds.height = bottom;
            return svgBounds;
        },
        _initContextMenu: function (isLoad) {
            if (this.enableContextMenu()) {
                this._renderContextMenu(isLoad);
            }
            else {
                $("#" + this.element[0].id + "_contextMenu").remove();
            }
        },
        _renderContextMenuItem: function (item) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            var menu = ej.datavisualization.Diagram.Locale[this.locale()];
            if (!menu)
                menu = ej.datavisualization.Diagram.Locale["en-US"];
            a.innerHTML = menu[item.name] || item.text;
            li.setAttribute("id", this.element[0].id + "_contextMenu_" + item.name);
            var div = document.createElement("span");
            div.setAttribute("id", item.name + "_image");
            var imageUrlAttribute = "display:table-cell; vertical-align:middle; text-align:center;"
            if (item.imageUrl)
                imageUrlAttribute = imageUrlAttribute + "background-image: url(" + item.imageUrl + ");width:25px;height:25px";
            div.setAttribute("style", imageUrlAttribute);
            var cssClassAttribute = "sf-d-menuitem " + item.name;
            if (item.cssClass)
                cssClassAttribute = cssClassAttribute + " " + item.cssClass;
            div.setAttribute("class", cssClassAttribute);
            a.appendChild(div);
            if (item.subItems && item.subItems.length > 0) {
                var subUl = document.createElement("ul");
                var i = 0, subli;
                for (i; i < item.subItems.length; i++) {
                    subli = this._renderContextMenuItem(item.subItems[i], subUl);
                    subli.setAttribute("style", "display:block;");
                    subUl.appendChild(subli);
                }
                li.appendChild(subUl);
            }
            li.appendChild(a);
            return li;
        },
        _renderContextMenu: function (isLoad) {
            var menuCollection = $.extend(true, [], this.model.contextMenu.items);
            if (!this.model.contextMenu.showCustomMenuItemsOnly) {
                var additionalItems = [];
                for (var i = 0; i < this._defaultContextMenuItems.length; i++) {
                    var isExist = false;
                    if (this.model.contextMenu.items.length) {
                        for (var j = 0; j < this.model.contextMenu.items.length; j++) {
                            if (this.model.contextMenu.items[j].name === this._defaultContextMenuItems[i].name) {
                                isExist = true;
                                break;
                            }
                            if (j === this.model.contextMenu.items.length - 1 && !isExist) {
                                additionalItems.push(this._defaultContextMenuItems[i])
                            }
                        }
                    }
                    else
                        additionalItems.push(this._defaultContextMenuItems[i])
                }

                for (var i = 0; i < additionalItems.length; i++) {
                    menuCollection.push(additionalItems[i]);
                }
            }

            var i = 0, item, mItem;
            var ul = document.createElement("ul");
            ul.setAttribute("id", this.element[0].id + "_contextMenu");
            for (i = 0; i < menuCollection.length; i++) {
                item = menuCollection[i];
                if (item.templateId) {

                    var temptag = this._renderEjTemplate("#" + item.templateId, item);
                    if (temptag)
                        ul.innerHTML = temptag;
                }
                else {
                    if (item && item.name) {
                        mItem = this._renderContextMenuItem(item, ul);
                        ul.appendChild(mItem);
                    }
                }
            }
            this._canvas.appendChild(ul);
            $("#" + this.element[0].id + "_contextMenu").ejMenu({
                menuType: ej.MenuType.ContextMenu,
                contextMenuTarget: "#" + this.element[0].id + "_canvas",
                click: $.proxy(this._onMenuItemClick, this),
                beforeOpen: $.proxy(this._onContextMenuOpen, this),
                mouseover: $.proxy(this._onMenuItemMouseOver, this),
                mouseout: $.proxy(this._onMenuItemMouseOut, this),
                close: $.proxy(this._onContextMenuClose, this),
            });
            $("#" + this.element[0].id + "_contextMenu")[0].style.display = "none";
        },
        _onContextMenuClose: function (args) {
            if (this.model.contextMenuClose) {
                var obj = ({ diagram: this, contextMenu: args });
                this._trigger("contextMenuClose", obj);
            }
            else
                this.element[0].focus();
        },
        _onContextMenuOpen: function (args) {
            if (args.events && !args.events.originalEvent)
                args.events.originalEvent = args.events;
            if (this.activeTool.mouseup) {
                if (this.activeTool.name == "textTool") {
                    this._endEdit();
                    if (this.activeTool.singleAction) {
                        this.activeTool.diagram.deactivateTool();
                    }
                }
                else
                    this.activeTool.mouseup(args.events, true);
            }
            if (this._disableDefaultContextMenu) {
                delete this._disableDefaultContextMenu;
                return false;
            }
            var _id = this.element[0].id;
            var node = this._findNodeUnderMouse(args);
            if (node === null && args.target) {
                if ($(args.target).attr("class") === "segmentEnd" && this.selectionList[0]) {
                    node = this.selectionList[0];
                }
            }
            var isMulSel = false;
            if ($(args.target).parents(".e-scrollbar").length && this.enableContextMenu()) {
                args.cancel = true;
                $("#" + this.element[0].id + "_contextMenu").ejMenu("instance").hideContextMenu();
            }
            if (this.selectionList[0] && (this.selectionList[0].type === "pseudoGroup" || this.selectionList[0]._type === "group"))
                isMulSel = true;
            if (!node && this.selectionList.length > 0 && !isMulSel && !(this.activeTool && this.activeTool.name == "textTool")) {
                this._clearSelection();
            }
            if (this.enableContextMenu()) {
                if ($("#" + _id + "_contextMenu_cut")[0])
                    $("#" + _id + "_contextMenu_cut")[0].style.display = this.selectionList.length ? "block" : "none";
                if ($("#" + _id + "_contextMenu_copy")[0])
                    $("#" + _id + "_contextMenu_copy")[0].style.display = this.selectionList.length ? "block" : "none";
                if ($("#" + _id + "_contextMenu_paste")[0])
                    $("#" + _id + "_contextMenu_paste")[0].style.display = this._clipboardData ? "block" : "none";
                if ($("#" + _id + "_contextMenu_undo")[0])
                    $("#" + _id + "_contextMenu_undo")[0].style.display = this._historyList && this._historyList.canUndo ? "block" : "none";
                if ($("#" + _id + "_contextMenu_redo")[0])
                    $("#" + _id + "_contextMenu_redo")[0].style.display = this._historyList && this._historyList.canRedo ? "block" : "none";
                if ($("#" + _id + "_contextMenu_selectAll")[0])
                    $("#" + _id + "_contextMenu_selectAll")[0].style.display = this.nodes().length + this.connectors().length ? "block" : "none";
                if ($("#" + _id + "_contextMenu_grouping")[0])
                    $("#" + _id + "_contextMenu_grouping")[0].style.display = this.selectionList[0] && (this.selectionList[0].type == "group" ||
                        this.selectionList[0].type == "pseudoGroup") ? "block" : "none";
                if ($("#" + _id + "_contextMenu_order")[0])
                    $("#" + _id + "_contextMenu_order")[0].style.display = this.selectionList.length ? "block" : "none";
            }
            var obj = ({ diagram: this, contextMenu: args, contextmenu: args });
            obj.target = this.selectionList.length ? this.selectionList[0] : this.activeTool.prevSelectObject ? this.activeTool.prevSelectObject : this;
            this._trigger("contextMenuBeforeOpen", obj);
            if (this.enableContextMenu()) {
                $("#" + _id + "_contextMenu")[0].style.display = "block";
                if ($("#" + _id + "_contextMenu")[0].clientHeight <= 2) args.cancel = true;
                $("#" + _id + "_contextMenu")[0].style.display = "none";
            }

        },
        _onMenuItemClick: function (args) {
            var menuId = args.events.ID.replace(this._id + "_" + "contextMenu_", "");
            args.canExecute = true;
            args.target = this.selectionList.length ? this.selectionList[0] : this.activeTool.prevSelectObject ? this.activeTool.prevSelectObject : this;
            this._trigger("contextMenuClick", args);
            if (args.canExecute) {
                switch (menuId) {
                    case "cut":
                        this.cut();
                        break;
                    case "copy":
                        this.copy();
                        break;
                    case "paste":
                        this.paste();
                        break;
                    case "undo":
                        this.undo();
                        break;
                    case "redo":
                        this.redo();
                        break;
                    case "selectAll":
                        this.selectAll();
                        break;
                    case "group":
                        this.group();
                        break;
                    case "ungroup":
                        this.ungroup();
                        break;
                    case "bringToFront":
                        this.bringToFront();
                        break;
                    case "sendToBack":
                        this.sendToBack();
                        break;
                    case "moveForward":
                        this.moveForward();
                        break;
                    case "sendBackward":
                        this.sendBackward();
                        break;
                    default:
                        break;
                }
            }
        },
        _onMenuItemMouseOver: function (args) {
            var t = args.events.element.lastChild.childNodes[1];
            $(t).addClass("hover");
        },
        _onMenuItemMouseOut: function (args) {
            var t = args.events.element.lastChild.childNodes[1];
            $(t).removeClass("hover");
        },
        _renderDiagram: function (isload) {
            var diagram = this;
            this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            if (!this._layoutUpdate) {
                this._doLayout();
            }
            this._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                if (view.type == "mainview" && view.context == ej.datavisualization.Diagram.SvgContext) {
                    view.context._renderDocument(view, diagram, isload);
                    diagram._createScrollbar(diagram._canvas, diagram);
                    ej.datavisualization.Diagram.ScrollUtil._initScrollbar(diagram);
                    ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram);
                }
                if (!isload) {
                    var nodes = diagram._setNodeZOrder(view);
                    diagram._renderDiagramObjects(nodes, view);
                }
            });
            $(this._svg.document).pinchDiagram(this._view, this);
        },
        _createScrollbar: function (canvas, diagram) {
            var hScrollbar = document.createElement("div");
            hScrollbar.setAttribute("id", canvas.id + "_hScrollbar");
            if (!document.getElementById(canvas.id + "_hScrollbar")) {
                diagram._svgParent.appendChild(hScrollbar);
            }
            var vScrollbar = document.createElement("div");
            vScrollbar.setAttribute("id", canvas.id + "_vScrollbar");
            if (!document.getElementById(canvas.id + "_vScrollbar")) {
                diagram._svgParent.appendChild(vScrollbar);
            }
        },
        _disableScrollbar: function () {
            if (this._isMobile) {
                $("#" + this._hScrollbar._id).addClass("e-disable").attr({ "aria-disabled": true, "style": "display: none;" });
                $("#" + this._vScrollbar._id).addClass("e-disable").attr({ "aria-disabled": true, "style": "display: none;" });
            }
        },
        _doLayout: function () {
            if (this.model.layout && this._layoutType() !== ej.datavisualization.Diagram.LayoutTypes.None && !this._isLoad) {
                //this.model.layout = new ej.datavisualization.Diagram.HierarchicalLayout(this.model.layout);
                //this.model.layout._setModel(this);
                this._updateEdgeCollection();
                ej.datavisualization.Diagram.Layout.doLayout(this);
                //this.model.layout.doLayout(this);
                if (ej.datavisualization.Diagram.Util.canRouteDiagram(this)) {
                    var nodes = this.nodes();
                    if (nodes.length > 1) {
                        this.lineRouting.GenerateVisibilityGraph(this, nodes.length);
                        for (var i = 0; i < nodes.length; i++)
                                this._updateAllEdges(nodes[i]);
                    }
                }
            }
        },
        _updateNodes: function () {
            var nodes = this.nodes();
            for (var i = 0; i < nodes.length; i++) {
                ej.datavisualization.Diagram.DiagramContext.update(nodes[i], this);
            }
        },
        _updateConnectors: function () {
            var connections = this.connectors();
            for (var i = 0; i < connections.length; i++) {
                ej.datavisualization.Diagram.DiagramContext.update(connections[i], this);
            }
        },
        _updateEdgeCollection: function () {
            for (var i = 0; i < this.connectors().length; i++) {
                this._updateEdges(this.connectors()[i]);
            }
        },
        updateViewPort: function () {
            this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            ej.datavisualization.Diagram.DiagramContext.updateViewPort(this);
            this.model.scrollSettings.viewPortHeight = this._viewPort.height;
            this.model.scrollSettings.viewPortWidth = this._viewPort.width;
            var diagram = this;
            this._views.forEach(function (viewid) {
                var view = diagram._views[viewid];
                if (view.type == "overview") {
                    var ovw = $("#" + viewid).ejOverview("instance");
                    if (ovw)
                        ovw._scrollOverviewRect(diagram._hScrollOffset, diagram._vScrollOffset, diagram._currZoom);
                }
            });
            ej.datavisualization.Diagram.ScrollUtil._updateRuler(this, diagram._hScrollOffset, diagram._vScrollOffset)
        },
        _containsSameIndex: function (index, parent) {
            //if (!parent) {
            //    var nodes = this.nodes(), cNode;
            //    for (var i = 0; i < nodes.length > 0; i++) {
            //        cNode = nodes[i];
            //        if (cNode && cNode.zOrder === index)
            //            return true;
            //    }
            //    var connectors = this.connectors(), cConnector;
            //    for (var i = 0; i < connectors.length > 0; i++) {
            //        cConnector = connectors[i];
            //        if (cConnector && cConnector.zOrder === index)
            //            return true;
            //    }
            //}
            //else {
            //    var children = parent.children, child;
            //    for (var i = 0; i < children.length; i++) {
            //        child = this.nameTable[this._getChild(children[i])];
            //        if (child && child.zOrder) {
            //            if (child.zOrder === index)
            //                return true;
            //        }
            //    }
            //}
            return false;
        },
        _setZorder: function (node) {
            if (node && node.zOrder) {
                if (node.zOrder == -1) {
                    if (this._containsSameIndex(this._zOrder)) {
                        do {
                            this._zOrder++;
                        } while (this._containsSameIndex(this._zOrder));
                        node.zOrder = this._zOrder;
                    }
                    else {
                        node.zOrder = this._zOrder;
                        this._zOrder++;
                    }
                }
                else {
                }
                if (node._type === "group") {
                    var children = node.children, child;
                    for (var i = 0; i < children.length; i++) {
                        child = this.nameTable[this._getChild(children[i])];
                        if (child && child.zOrder && child.zOrder === -1) {
                            this._setZorder(child);
                        }
                    }
                }
            }
        },
        _union: function (rect1, rect2) {
            var x = Math.min(rect1.x, rect2.x);
            var y = Math.min(rect1.y, rect2.y);
            var overWidth = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
            var overheight = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
            return new ej.datavisualization.Diagram.Rectangle(x, y, overWidth - x, overheight - y);
        },
        _getSeperetor: function (id) {
            return this.nameTable[id];
        },

        _updateNextPhase: function (swimlane, dif, index) {
            ej.datavisualization.Diagram.SwimLaneContainerHelper._updateNextPhase(this, swimlane, dif, index);
        },

        _getOuterNodes: function (swimlane, x, y) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._getOuterNodes(this, swimlane, x, y);
        },

        _getInnerNodes: function (swimlane, value1, value2) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._getInnerNodes(this, swimlane, value1, value2);
        },

        _moveOuterNodes: function (swimlane, dif, index) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._moveOuterNodes(this, swimlane, dif, index);
        },

        _moveOnPhaseChange: function (phase, dif, index) {
            ej.datavisualization.Diagram.SwimLaneContainerHelper._moveOnPhaseChange(this, phase, dif, index);
        },

        _getPhaseDifferece: function (swimlane, index, difference) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._getPhaseDifferece(this, swimlane, index, difference);
        },

        _updatePhaseOffset: function (obj) {
            var node = this.nameTable[obj.name], phase, dif;
            var phaseStack = this.nameTable[node.parent];
            var children = this._getChildren(phaseStack.children);
            var index = children.indexOf(node.name);
            if (children && children.length > 0) {
                if (index > -1 && obj.offset != undefined) {
                    phase = this.nameTable[children[index]];
                    dif = obj.offset - node.offset;
                    var swimlane = this.nameTable[phaseStack.parent]
                    dif = this._getPhaseDifferece(swimlane, index, dif);
                    this._moveOuterNodes(swimlane, dif, index);
                    if (index === 0) {
                        if (node.orientation === "horizontal") {
                            node.width += dif;
                            node.offset = node.width;
                            this._comparePropertyValues(swimlane, "offsetX", { offsetX: swimlane.offsetX + (dif / 2) }, this.activeTool.inAction);
                        }
                        else {
                            node.height += dif;
                            node.offset = node.height;
                            this._comparePropertyValues(swimlane, "offsetY", { offsetY: swimlane.offsetY + (dif / 2) }, this.activeTool.inAction);
                        }
                    }
                    else {
                        if (node.orientation === "horizontal") {
                            node.width += dif;
                            node.offset += dif;
                            this._comparePropertyValues(swimlane, "offsetX", { offsetX: swimlane.offsetX + (dif / 2) }, this.activeTool.inAction);
                        }
                        else {
                            node.height += dif;
                            node.offset += dif;
                            this._comparePropertyValues(swimlane, "offsetY", { offsetY: swimlane.offsetY + (dif / 2) }, this.activeTool.inAction);
                        }
                    }
                    this._disablePhaseUpdate = true;
                    this._disableSwimlaneUptate = true;
                    ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                    this._moveOnPhaseChange(node, dif, index);
                    this._updateNextPhase(swimlane, dif, index);
                    delete this._disablePhaseUpdate;
                    delete this._disableSwimlaneUptate;
                    ej.datavisualization.Diagram.DiagramContext.update(swimlane, this);
                    ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, swimlane);
                }
            }
        },
        _updatePhase: function (obj) {
            var node = this.nameTable[obj.name], phase, prevPhase, dif;
            if (node) {
                if ((node.offset != undefined && obj.offset != undefined) && obj.offset != node.offset) {
                    this._comparePropertyValues(node, "offset", { offset: obj.offset }, this.activeTool.inAction);
                    this._updatePhaseOffset(obj);
                    if (this._hasSelection())
                        this._clearSelection(true);
                }
                this._updateSwimlanePhase(node, obj);
            }
        },

        _setNodeZOrder: function (view) {
            var temp = null, jindex, iindex;
            var nodes = this.nodes();
            nodes = nodes.concat(this.connectors());
            for (var f = 0; f < nodes.length; f++) {
                if (nodes[f].parent === "")
                    this._setZorder(nodes[f]);
            }
            for (var i = 0; i < nodes.length; i++) {
                for (var j = i + 1; j < nodes.length; j++) {
                    if (nodes[i].zOrder > nodes[j].zOrder && (nodes[i].parent === "" && nodes[j].parent === "")) {
                        temp = nodes[i];
                        nodes[i] = nodes[j];
                        nodes[j] = temp;
                    }
                }
                if (nodes[i]._type === "group") {
                    var children = nodes[i].children;
                    if (!nodes[i].isSwimlane) {
                        for (var m = 0; m < children.length; m++) {
                            for (var n = m + 1; n < children.length; n++) {
                                var child1 = typeof (children[m]) === "object" ? children[m] : this.nameTable[children[m]];
                                var child2 = typeof (children[n]) === "object" ? children[n] : this.nameTable[children[n]];
                                if (child1.zOrder > child2.zOrder && !child1.isPhase && !child2.isPhase && !child1.isLane && !child2.isLane) {
                                    temp = children[m];
                                    children[m] = children[n];
                                    children[n] = temp;
                                }
                            }
                        }
                    }
                }
            }
            return nodes;
        },

        _renderDiagramObjects: function (nodes, view, isLoad, isoverView) {
            var rejectedNodes = new Array();
            var rejectedConnectors = new Array();
            this._initLayer();
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (this.getObjectType(nodes[i]) === "node" || this.getObjectType(nodes[i]) === "group") {
                    var node = this.nameTable[nodes[i].name];
                    if (node && this._outOfBoundsOnNudge(node, 0, 0)) {
                        if (this._isLoad)
                            this._disableSegmentChange = true;
                        ej.datavisualization.Diagram.DiagramContext._renderNodeObject(node, view, isLoad, isoverView, this)
                        if (this._isLoad)
                            delete this._disableSegmentChange;
                        this._updateQuad(node);
                    }
                    else
                        rejectedNodes.push(i)
                }
                else {
                    var connector = this.nameTable[nodes[i].name] || nodes[i];
                    if (connector && this._outOfBoundsOnNudge(connector, 0, 0)) {
                        ej.datavisualization.Diagram.DiagramContext._renderConnectorObject(connector, view, this);
                        this._updateQuad(connector);
                    }
                    else
                        rejectedConnectors.push(i);
                }

            }
            if (rejectedNodes.length > 0 || rejectedConnectors.length > 0) {
                if (rejectedNodes.length > 0) {
                    for (var i = rejectedNodes.length - 1; i >= 0; i--) {
                        this._removeFromNameTable(this.nodes()[i]);
                        this.nodes().splice(i, 1);
                    }
                    this._nodes = $.extend(true, [], this.nodes());
                }
                if (rejectedConnectors.length > 0) {
                    for (var i = rejectedConnectors.length - 1; i >= 0; i--) {
                        this._removeFromNameTable(this.connectors()[i]);
                        this.connectors().splice(i, 1);
                    }
                    this._connectors = $.extend(true, [], this.connectors());
                }
            }
        },

        _removeFromNameTable: function (node) {
            if (node && node._type === "group") {
                for (var i = 0; i < node.children.length; i++) {
                    var child = node.children[i];
                    if (child._type === "group") {
                        this._removeChildrenFromNameTable(child);
                    }
                    else
                        delete this.nameTable[this._getChild(child)];
                }
            }
            delete this.nameTable[this._getChild(node)];
        },


        _unWireEvents: function () {
            var svgDocument = $(this._canvas);
            this._off(svgDocument, ej.eventType.mouseDown, this._mousedown);
            this._off(svgDocument, ej.eventType.mouseMove, this._mousemove);
            this._off(svgDocument, ej.eventType.mouseUp, this._mouseup);
            this._off(svgDocument, ej.eventType.mouseLeave, this._documentmouseup);
            this._off(svgDocument, "doubletap", this._doubleclick);
            this._off(this.element, "keydown", this._keydown);
            this._off(this.element, "keyup", this._keyup);
            //this._on(this.element, "contextmenu", this._contextmenu);
            this._off(svgDocument, "pinchin", this._pinchin);
            this._off(svgDocument, "pinchout", this._pinchout);
            this._off(this.element, "touchstart", this._handleTouchStart);
            if (ej.browserInfo().name === "mozilla") {
                this._off(this.element, "DOMMouseScroll", this._handleMouseWheel);
            }
            else
                this._off(this.element, "mousewheel", this._handleMouseWheel);
            //window document event
            this._off($(document), "mouseup", this._documentmouseup);

            if (window && (this.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Resizable)) {
                this._off($(window), "resize", this.updateViewPort);
            }
        },

        //#endregion
        //#region Events
        _wireEvents: function () {
            //svg document events
            var svgDocument = $(this._canvas);
            this._on(svgDocument, ej.eventType.mouseDown, this._mousedown);
            this._on(svgDocument, ej.eventType.mouseMove, this._mousemove);
            this._on(svgDocument, ej.eventType.mouseUp, this._mouseup);
            this._on(svgDocument, ej.eventType.mouseLeave, this._documentmouseup);
            this._on(svgDocument, "doubletap", this._doubleclick);
            this._on(this.element, "keydown", this._keydown);
            this._on(this.element, "keyup", this._keyup);
            this._on(this.element, "contextmenu", this._preventDefaultContextMenu);
            //this._on(this.element, "contextmenu", this._contextmenu);
            this._on(svgDocument, "pinchin", this._pinchin);
            this._on(svgDocument, "pinchout", this._pinchout);
            this._on(this.element, "touchstart", this._handleTouchStart);
            if (ej.browserInfo().name === "mozilla") {
                this._on(this.element, "DOMMouseScroll", this._handleMouseWheel);
            }
            else
                this._on(this.element, "mousewheel", this._handleMouseWheel);
            //window document event
            this._on($(document), "mouseup", this._documentmouseup);

            if (window && (this.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Resizable)) {
                this._on($(window), "resize", this.updateViewPort);
            }
            var obj = this;
            $(svgDocument).ejDroppable({
                over: function (event, ui) {
                    obj._isDropOver = true;
                    var isTouch = false;
                    if (event.originalEvent && event.originalEvent.changedTouches) {
                        isTouch = true;
                    }
                    else if (event && event.changedTouches) {
                        isTouch = true;
                    }
                    if (!isTouch) {
                        if ((obj.activeTool.inAction === false) && obj._selectedSymbol) {
                            if (!obj._viewPort) obj._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(obj, true);
                            obj._addSymbolToDiagram(event);
                            obj._isSvgDropover = true;
                        }
                    }
                },
                out: function (event) {
                    delete obj._isDropOver;
                },
                drop: function (event, ui) {
                    obj._svgdrop(event, ui);
                    obj._isDropped = true;
                },
            });
        },
        _preventDefaultContextMenu: function (e) {
            if (this._disableDefaultContextMenu) {
                e.preventDefault();
                e.stopPropagation();
                delete this._disableDefaultContextMenu;
                return false;
            }
        },
        _mousePosition: function (evt, exOffset) {
            var e = this._isTouchEvent(evt);
            var scrollLeft = this._scrollLeft !== undefined ? this._scrollLeft : this._canvas.scrollLeft;
            var scrollTop = this._scrollTop !== undefined ? this._scrollTop : this._canvas.scrollTop;
            var controlBBox = this._controlBBox ? this._controlBBox : this._canvas.getBoundingClientRect();
            var layerx = (e.clientX + scrollLeft) - controlBBox.left;
            var layery = (scrollTop + e.clientY) - controlBBox.top;
            var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(this)
            if (!exOffset) {
                layerx = (layerx + this._hScrollOffset - rulerSize.left) / this._currZoom;
                layery = (layery + this._vScrollOffset - rulerSize.top) / this._currZoom;
            }
            return new ej.datavisualization.Diagram.Point(Math.round(layerx * 100) / 100, Math.round(layery * 100) / 100);
        },
        _contextmenu: function (evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
        _pinchin: function (evt) {
            this._getTouchEvent(evt);
            evt.preventDefault();
        },
        _pinchout: function (evt) {
            this._getTouchEvent(evt);
            evt.preventDefault();
        },
        _handleTouchStart: function (evt) {
            this._getTouchEvent(evt);
            var foreignObject = this._isForeignObject(evt.originalEvent.target);
            if (!foreignObject) {
            evt.preventDefault();
            }
        },

        _getTouchEvent: function (evt) {
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend")
                this._isTouchedEvent = true;
            else
                this._isTouchedEvent = false;
        },
        _getvalues: function (evt) {
            var parent = $(evt.target).parents(".ej-d-node,.ej-d-connector,.ej-d-group");
            var obj;
            var id = evt.target.id.split('_');
            obj = this.findNode(id[0]);
            var point = this._mousePosition(evt);
            var curport = this._findPortAtPoint(point, obj);
            return { "source": curport, "action": ej.datavisualization.Diagram.ActiveTool };
        },
        _mousedown: function (evt) {
            this._getTouchEvent(evt);
            this._isPinching = false;
            this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            this._diagramElements = null;
            ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this._adornerSvg, this._adornerLayer);
            if (this._invoke(evt)) {
                this._scrollLeft = this._canvas.scrollLeft;
                this._scrollTop = this._canvas.scrollTop;
                this._controlBBox = this._canvas.getBoundingClientRect();
                var position = this._mousePosition(evt);
                var foreignObject = this._isForeignObject(evt.originalEvent.target);
                if ((!foreignObject && !this._isHyperLink(evt)) || this._isForeignEvent(evt))
                    evt.preventDefault();
                if (this.model.contextMenu && $("#" + this.element[0].id + "_contextMenu").css("display") !== "none") {
                    evt.cancel = true;
                }
                if (this._isEditing) {
                    this._endEdit();
                    if (this.activeTool.name === "textTool") {
                        if (this.activeTool.singleAction) {
                            this.activeTool.diagram.deactivateTool();
                        }
                    }
                }
                if ((evt.which === 1 || evt.which === 3) || (evt.which === 0 && evt.originalEvent.changedTouches)) {
                    this._removeMouseOverTooltip();
                    if (evt.which === 0 && evt.originalEvent.changedTouches) {
                        var node = null;
                        var isUserHandle = this._isUserHandle(evt);
                        if ((this._isInternalTool(this.activeTool) && !this.activeTool.inAction)) {
                            if (!isUserHandle) {
                                node = this._findNodeUnderMouse(evt);
                                this._raiseMouseEvents(node, position);
                            }
                            if (!node && this.selectionList[0]) {
                                node = this.selectionList[0];
                            }
                            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                                this._checkToolToActivate(evt, node);
                            }
                        }
                    }
                    if ((navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey) && evt.shiftKey) {
                        node = this._findNodeUnderMouse(evt);
                        if (!node && this.selectionList[0]) {
                            node = this.selectionList[0];
                        }
                        this._checkToolToActivate(evt, node);
                    }
                    if (this._toolToActivate === "panTool") {
                        this.activeTool = this.tools[this._toolToActivate];
                    }
                    else {
                        if (this._toolToActivate === "move") {
                            node = this._findNodeUnderMouse(evt);
                            if (node && node.isLane && ej.datavisualization.Diagram.Util.canMultiSelectOnLane(node)) {
                                this._toolToActivate = "select";
                                this._currentCursor = "default";
                                this._updateCursor();
                            }
                        }
                        var tool = this.tools[this._toolToActivate] || this.activeTool;
                        this.activateTool(this._toolToActivate, tool ? tool.singleAction : null);
                    }
                    if (this.activeTool.mousedown)
                        this.activeTool.mousedown(evt);
                    if (this.activeTool._findNodeUnderMouse)
                        this._focusedElement = this.activeTool._findNodeUnderMouse(evt, true);
                }
            }
        },

        _getParentNode: function (name) {
            var parentNode;
            var node = this.findNode(name);
            if (node.parent) {
                parentNode = this.findNode(node.parent);
                if (parentNode.parent) {
                    this._getParentNode(parentNode.name);
                }
            }
            return parentNode.name;
        },

        _getDiagramElements: function (node) {
            if (node && (node.isSwimlane || node.isLane)) {
                node = this.getNode(node);
            }
            return node;
        },

        _mousemove: function (evt) {
            this._getTouchEvent(evt);
            this._mouseEventTriggered = true;
            if (!this._viewPort) this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            if (evt.type == "touchmove" && evt.originalEvent.touches.length > 1) {
                this._isPinching = true;
            } else {
                this._isPinching = false;
                var node = null;
                var isUserHandle = this._isUserHandle(evt);

                if ((this.activeTool.inAction === false) && this._selectedSymbol) {
                    this._previousData = null;
                    this._addSymbolToDiagram(evt);
                } else {
                    if (this.activeTool.inAction && this.activeTool.name === "move" && this.selectionList[0]) {
                        var currentNode = this._findNodeUnderMouse(evt);
                        if (this.nameTable[this._previousData] && (!currentNode || (this._previousData != (currentNode._isHeader ? currentNode.parent : currentNode.name)))) {
                            if (this.nameTable[this._previousData].parent) {
                                var actualObject = this._getParentNode(this.nameTable[this._previousData].name);
                            }
                            var args = { element: this._getDiagramElements(this.selectionList[0]), target: this._getDiagramElements(this.nameTable[this._previousData]), targetType: this.getObjectType(this.nameTable[this._previousData]), actualObject: this.findNode(actualObject) ? actualObject : null };
                            this._raiseEvent("dragLeave", args);
                            this._previousData = null;
                        }
                        if (currentNode && this._previousData && this.nameTable[this._previousData] !== (currentNode._isHeader ? this.nameTable[currentNode.parent] : currentNode)) {
                            this._previousData = currentNode._isHeader ? currentNode.parent : currentNode.name;
                            if (this.nameTable[this._previousData].parent) {
                                var actualObject = this._getParentNode(this.nameTable[this._previousData].name);
                            }
                            var args = { element: this._getDiagramElements(this.selectionList[0]), target: this._getDiagramElements(this.nameTable[this._previousData]), targetType: this.getObjectType(this.nameTable[this._previousData]), actualObject: this.findNode(actualObject) ? actualObject : null };
                            this._raiseEvent("dragEnter", args);
                        }
                    }
                    if (ej.datavisualization.Diagram.Util.isClassifier(evt))
                        var node = ej.datavisualization.Diagram.ClassifierHelper.getSelectableElementUnderMouse(evt, this);
                    else
                        node = this._findNodeUnderMouse(evt)
                    if ((this._isInternalTool(this.activeTool) && !this.activeTool.inAction)) {
                        if (!isUserHandle) {
                            if (node) {
                                if (this._nodeUnderMouse && this._nodeUnderMouse != node && !this._nodeUnderMouse.segments) {
                                    this.activeTool._showPort(this._nodeUnderMouse, true);
                                }
                                if (!node.segments) {
                                    this.activeTool._showPort(node);
                                }
                            }
                            //this._raiseMouseEvents(node);
                        }
                        if (!node && this.selectionList[0]) {
                            node = this.selectionList[0];
                        }
                        if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                            this._checkToolToActivate(evt, node);
                        }
                        if (evt.which == 1 && evt.buttons == 1)
                            this._focusedElement = this.activeTool._findNodeUnderMouse(evt, true);
                    } else {
                        var canProceed = true;
                        if (this._activatedFromPort && !this.activeTool.inAction) {
                            var point, port = null;
                            if (this._nodeUnderMouse && !this._nodeUnderMouse.segments) {
                                point = this._mousePosition(evt);
                                port = this._findPortAtPoint(point, this._nodeUnderMouse);
                            }
                            if (!port || (port && !(port.constraints & ej.datavisualization.Diagram.PortConstraints.ConnectOnDrag))) {
                                ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this._adornerSvg, this._adornerLayer);
                                this.deactivateTool();
                                canProceed = false;
                                delete this._activatedFromPort;
                            }
                        }
                        if (canProceed) {
                            if (!this.activeTool.inAction) {
                                this._toolToActivate = this.activeTool.name;
                                this._currentCursor = this.activeTool.cursor;
                            }
                            if (ej.datavisualization.Diagram.Util.isClassifier(evt))
                                nodeUnderMouse = ej.datavisualization.Diagram.ClassifierHelper.getDropableElementUnderMouse(evt, this);
                            else
                                nodeUnderMouse = this._findNodeUnderMouse(evt);
                            if (node) {
                                //this._raiseMouseEvents(node);
                            }
                        }
                    }
                    this._updateCursor();
                    var nodeUnderMouse = nodeUnderMouse || this._findNodeUnderMouse(evt);
                    if (this.activeTool.mousemove)
                        this.activeTool.mousemove(evt);
                    // var position = this._mousePosition(evt);
                    this._raiseMouseEvents(nodeUnderMouse, evt);
                    var canAvoidConnection = false;
                    if (this.activeTool.inAction) {
                        do {
                            if (nodeUnderMouse && !ej.datavisualization.Diagram.Util.canAllowDrop(nodeUnderMouse)) {
                                if (nodeUnderMouse.parent) nodeUnderMouse = this.nameTable[nodeUnderMouse.parent];
                                else
                                    if (nodeUnderMouse.segments)
                                    { canAvoidConnection = true; break; }
                                    else if (nodeUnderMouse.container) {
                                        break;
                                    }
                                    else
                                        nodeUnderMouse = null;
                            }
                            else break;
                        } while (nodeUnderMouse);
                        if (this._nodeUnderMouse && this._nodeUnderMouse.segments && this._nodeUnderMouse != nodeUnderMouse)
                            ej.datavisualization.Diagram.SvgContext._removeConnectorHighlighter(this._adornerLayer, this._adornerSvg);
                        if (nodeUnderMouse && ((nodeUnderMouse != this._focusedElement && nodeUnderMouse != this.nodeUnderMouse) &&
                            (canAvoidConnection || ej.datavisualization.Diagram.Util.canAllowDrop(nodeUnderMouse)))) {
                            var type = this.getObjectType(nodeUnderMouse);
                            if (!((this._focusedElement && (this._focusedElement.isLane || this._focusedElement.isSwimlane || this._focusedElement.isPhase)) && type == "node" && type == "connector")) {
                                if (!((this._nodeUnderMouse && (this._nodeUnderMouse.isLane || this._nodeUnderMouse.isSwimlane || this._nodeUnderMouse.isPhase))
                                    && nodeUnderMouse.segments)) {
                                    this._nodeUnderMouse = nodeUnderMouse;
                                }
                            }
                            else this._nodeUnderMouse = null;
                        }
                        else if (nodeUnderMouse && nodeUnderMouse.container)
                        { }
                        else
                            this._nodeUnderMouse = null;
                    } else if (!this._focusedElement)
                        this._nodeUnderMouse = nodeUnderMouse;
                    this._initiateAutoScroll(evt);
                }
            }
        },
        _mouseup: function (evt) {
            this._getTouchEvent(evt);
            if (!this._isPinching && evt.originalEvent && evt.originalEvent.target) {
                if (this._invoke(evt)) {
                    var foreignObject = this._isForeignObject(evt.originalEvent.target);
                    if (!foreignObject && this._isHyperLink(evt))
                        evt.preventDefault();
                    if (this.activeTool instanceof ej.datavisualization.Diagram.PanTool) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                        if ((!ej.datavisualization.Diagram.Util.isPageEditable(this) || this.activeTool instanceof ej.datavisualization.Diagram.PanTool) && !this.activeTool.inAction) {
                            var obj = this.activeTool._findNodeUnderMouse(evt);
                            if (obj)
                                this._raiseEvent("itemClick", { actualObject: obj, selectedObject: obj, model: this.model, cancel: false, event: evt });
                            var mousePosition = this._mousePosition(evt.originalEvent);
                            this._raiseEvent("click", { element: obj, actualObject: this.getNode(this.activeTool.actualObject), count: this._getEventDetail(evt), offsetX: mousePosition.x, offsetY: mousePosition.y, event: evt });
                            if (this.activeTool instanceof ej.datavisualization.Diagram.PanTool) {
                                document.onmousemove = null;
                                document.onmouseup = null;
                            }
                        }
                    } else if (evt.target.id === this._id + "_canvas_svg" && (!this.activeTool.name == "panTool" || !this.activeTool.inAction)) {
                        var mousePosition = this._mousePosition(evt.originalEvent);
                        this._raiseEvent("click", { element: this, actualObject: this.getNode(this.activeTool.actualObject), count: this._getEventDetail(evt), offsetX: mousePosition.x, offsetY: mousePosition.y, event: evt });
                    }
                    if (evt.target && !this._isAnimating) {
                        var parent = $(evt.target).parents(".ej-d-icon-template");
                        if (parent) {
                            if (parent.length) {
                                var target = parent[0];
                                if (target.id.endsWith("_expander")) {
                                    var id = target.id.replace("_expander", "");
                                    var obj = this.nameTable[id];
                                    if (obj) {
                                        var type = this.getObjectType(obj);
                                        if (type == "node" || type == "group") {
                                            this.clearSelection();
                                            ej.datavisualization.Diagram.LayoutUtil.expandSubTree(this, obj, obj.name, true, ej.datavisualization.Diagram.Util.canSelect(obj));
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this._selectedSymbol && !this._selectedSymbol.isLane && !this._isNodeEnters) {
                        this._findLabelEditing = true;
                        this._dropSymbol(null, evt);
                        delete this._findLabelEditing;
                        this._isDragg = true;
                    }
                    else if (this._selectedSymbol && this._isNodeEnters) {
                        var element = this.findNode(this.selectionList[0].name);
                        if (this.edgeTable)
                            delete this.edgeTable;
                        else {
                            var childTable = {};
                            childTable = this._getChildTable(this.selectionList[0], childTable);
                            if (this._selectedSymbol.type == "pseudoGroup")
                                var entry = { type: "collectionchanged", object: this._updatePsedoGroupChildren(this._selectedSymbol), childTable: jQuery.extend(true, {}, childTable), changeType: "insert", category: "internal" };
                            else if (!this._selectedSymbol.isPhase)
                                var entry = { type: "collectionchanged", object: jQuery.extend(true, {}, this._selectedSymbol), childTable: jQuery.extend(true, {}, childTable), changeType: "insert", category: "internal" };
                            this.addHistoryEntry(entry);
                            this._isDragg = true;
                        }
                        this._clearSelection(true);
                        this._selectedSymbol = null;
                        delete this._isNodeEnters;

                        if (element.type == "pseudoGroup") {
                            this.nodes().push(element);
                            this._nodes = $.extend(true, [], this.nodes());
                            this.nameTable[element.name] = element;
                            ej.datavisualization.Diagram.Util._updateGroupBounds(element, this);
                        }
                        this._addSelection(element);
                    }
                    var cursor;
                    if (ej.browserInfo().name === "msie" && this._doubleClickEvent)
                        this.activeTool._isMouseDown = true;
                    if (this.activeTool.mouseup) {
                        if (!this.activeTool.inAction)
                            this._isSelectMode = true;
                        this.activeTool.mouseup(evt);
                        delete this._isSelectMode;
                    }
                    else if (!this._isInternalTool(this.activeTool)) {
                        if (this._isUserHandle(evt))
                            cursor = this.activeTool.cursor;
                        this.deactivateTool()
                    };
                    if ((!(this.activeTool instanceof ej.datavisualization.Diagram.TextTool)) && document.activeElement && document.activeElement.id !== this.element[0].id)
                        if (!this._isEditing && !foreignObject && !(evt.which === 3 && this.enableContextMenu()))
                            this.element[0].focus();
                    this._currentCursor = cursor ? cursor : this.activeTool.cursor;
                    if (this.activeTool.name === "move" && this._focusedElement && !ej.datavisualization.Diagram.Util.canSelect(this._focusedElement) && ej.datavisualization.Diagram.Util.enableLayerOption(this._focusedElement, "lock", this)) {
                        this._currentCursor = "default"
                        this._updateCursor();
                    }
                    else
                        this._updateCursor();
                }
            }
            if (this._isSvgDropover) {
                $("#" + this.element[0].id + "_canvas").ejDroppable("instance")._mouseOver = false;
            }
            delete this._isSvgDropover;
            this._focusedElement = null;
            this._nodeUnderMouse = this._findNodeUnderMouse(evt);
            delete this._scrollLeft;
            delete this._scrollTop;
            delete this._controlBBox;
            this._mouseEventTriggered = false;
            this._isDragg = false;
            delete this._viewPort;
            delete this._isDropOver;
            this._timeStamp = evt.timeStamp;
        },
        _doubleclick: function (evt) {
            this._getTouchEvent(evt);
            this._doubleClickEvent = !this._doubleClickEvent;
            var args;
            var obj = this._nodeUnderMouse || this;
            args = { element: this.getNode(obj), cancel: false, actualObject: this.getNode(this.activeTool.actualObject) }
            if (!this._isEditing)
                this._raiseEvent("doubleClick", args);
            var preventEditing = this.activeTool._drawingPolygon;
            if (this.activeTool.name != "panTool") {
                if (this._nodeUnderMouse)
                    this.activeTool._doubleClick(this._nodeUnderMouse);
                if (ej.datavisualization.Diagram.Util.isClassifier(evt))
                    var editableElement = ej.datavisualization.Diagram.ClassifierHelper.getEditableElementUnderMouse(evt, this);
                if (ej.datavisualization.Diagram.Util.isPageEditable(this) && !this.activeTool.inAction && (((this.selectionList.length > 0) || editableElement) || this.activeTool.selectedObject) && !args.cancel && !preventEditing) {
                    if (this.activeTool.selectedObject)
                        var obj = this.activeTool.selectedObject;
                    else if (this.selectionList[0])
                        var obj = this.selectionList[0];
                    else
                        obj = editableElement;
                    if (obj.type == "umlclassifier") {
                        for (var i = 0; i < obj.children.length; i++) {
                            obj.children[i] = typeof obj.children[i] == "string" ? this.nameTable[obj.children[i]] : obj.children[i];
                            if (i != obj.children.length - obj.children.length && i == obj.children.length - 1)
                                obj.children[i].labels[0].text = "\n" + "---" + "\n" + obj.children[i].labels[0].text;
                            if (i != obj.children.length - obj.children.length && i == obj.children.length - 2)
                                obj.children[i].labels[0].text = "\n" + "---" + "\n" + obj.children[i].labels[0].text;
                            obj.labels[0].text += obj.children[i].labels[0].text;
                        }
                    }
                    if (!this._isEditing && !(obj.type == "pseudoGroup") && !args.cancel) {
                        this.activeTool._findLabelUnderMouse(evt, false, this._mousePosition(evt.originalEvent), true);
                        if (obj.labels && obj.labels.length > 0) {
                            var label = this.activeTool.getLabelUnderMouse();
                            if (!label) label = obj.labels[0];
                        }
                        if (!this._isEditing && obj.type === "text" && this._setLabelEditing(obj.textBlock)) {
                            this.scrollToNode(obj);
                            this._startEdit(obj);
                        }
                        else if (!this._isEditing && !obj.isLaneStack && !obj.isLane && !obj.isSwimlane && (obj.labels && (obj.labels.length === 0 || typeof obj.labels.length === "undefined") || (obj.labels && obj.labels.length > 0 && this._setLabelEditing(label)))) {
                            this.scrollToNode(obj);
                            this._startEdit(obj);
                        }
                        else if (obj.isLane && (obj.labels && obj.labels.length > 0 && this._setLabelEditing(label))) {
                            if (obj.labels && obj.labels.length > 0) {
                                this.scrollToNode(obj);
                                this._startEdit(obj);
                            }
                            else
                                this.activeTool.selectedObject = null;
                        }
                        else if (obj.isLane) {
                            this.activeTool.selectedObject = null;
                        }
                    }
                }
            }
            this.activeTool._isMouseDown = false;
        },
        _documentmouseup: function (evt) {
            this._getTouchEvent(evt);
            var selectedSymbol = this._selectedSymbol;
            this._removeMouseOverTooltip();
            if (!this._viewPort) this._viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this, true);
            if (this.activeTool && this.activeTool.inAction && !(this.activeTool instanceof ej.datavisualization.Diagram.TextTool) &&
                !(this.activeTool instanceof ej.datavisualization.Diagram.ShapeTool && this.activeTool._drawingPolygon)) {


                if (this._selectedSymbol && evt.type != "mouseleave") {
                    this._findLabelEditing = true;
                    this._dropSymbol(null, evt);
                    delete this._findLabelEditing;
                    this._isDragg = true;
                }

                this.activeTool.mouseup(evt, true);
            }
            this.activeTool._removeRulerMarkers();
            if (selectedSymbol) {
                if (evt.keyCode != 27 && evt.keyCode != 46) {
                    var preview = document.getElementsByClassName("e-paletteItem dragClone")[0];
                    if (preview != null) {
                        preview.style.display = "block";
                    }
                    this._selectedSymbol = selectedSymbol;
                }
                this._raiseEvent("dragLeave", { element: this.selectionList[0], target: this, targetType: "diagram" });
                if (this._mouseEventTriggered) {
                    this._delete(this.selectionList[0]);
                }
            }
            if (this._isNodeEnters) {
                delete this._isNodeEnters;
                this._selectedSymbol = null;
                var preview = document.getElementsByClassName("dragClone")[0];
                if (preview != null) {
                    preview.style.display = "block";
                }
            }
            delete this._viewPort;
            delete this._isDropOver;
            this._mouseEventTriggered = false;
            this._isDragg = false;
        },
        _invoke: function (evt) {
            if (evt.originalEvent.target) {
                var className = evt.originalEvent.target.className;
                if (className && typeof className === "string" && (className == "edit" || className == "editBox" || className.indexOf("e-hhandle") > -1 || className.indexOf("e-hhandlespace") > -1 || className.indexOf("e-vhandle") > -1 || className.indexOf("e-vhandlespace") > -1)) {
                    return false;
                }
            }
            return true;
        },
        _handleMouseWheel: function (evt) {
            if (!this._isForeignEvent(evt, true)) {
                if (evt.originalEvent.preventDefault)
                    evt.originalEvent.preventDefault();
                var position = new ej.datavisualization.Diagram.Point(0, 0);
                if (this._isEditing) {
                    this._endEdit();
                }
                //this.deactivateTool();
                if ((navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey)) {
                    position = this._mousePosition(evt.originalEvent);
                    if (evt.originalEvent.wheelDelta > 0 || -40 * evt.originalEvent.detail > 0) {
                        ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, (1 + Number(this.zoomFactor())), 0, 0, position, true);
                    } else {
                        ej.datavisualization.Diagram.ZoomUtil.zoomPan(this, (1 / (1 + Number(this.zoomFactor()))), 0, 0, position, true);
                    }
                } else {
                    var offsetY = 0;
                    var oVal = {
                        zoom: this._getCurrentZoom(), horizontalOffset: this._hScrollOffset,
                        verticalOffset: this._vScrollOffset, viewPort: this._viewPort
                    };
                    var scrolled;
                    if (evt.originalEvent.wheelDelta > 0 || -40 * evt.originalEvent.detail > 0) {
                        var top = this._vScrollbar.model.minimum;

                        var limited = this._scrollLimit() === "limited" && (this._vScrollOffset - this._scrollPixel) >= this.model.pageSettings.scrollableArea.y * this._currZoom;
                        if ((this._vScrollOffset - this._scrollPixel) >= top || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity || limited) {
                            var executeScroll = false;
                            if (this._scrollLimit() !== "diagram") {
                                executeScroll = true;
                            } else {
                                if (this._vScrollbar && this._vScrollbar._scrollData) {
                                    var vScrollElement = this._vScrollbar.element[0];
                                    if (vScrollElement && (vScrollElement.style.visibility === "visible" || vScrollElement.style.visibility === "")) {
                                        executeScroll = true;
                                    }
                                }
                            }
                            if (executeScroll) {
                                this._updateScrollOffset(this._hScrollOffset, (this._vScrollOffset - this._scrollPixel));
                                scrolled = true;
                                offsetY = -this._scrollPixel;
                            }
                        } else {
                            this._updateScrollOffset(this._hScrollOffset, top);
                            scrolled = true;
                            offsetY = 0;
                        }
                    } else {
                        var cHeight = this._vScrollbar.model.maximum;
                        var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this);
                        limited = this._scrollLimit() === "limited" &&
                           (this.model.pageSettings.scrollableArea.y + this.model.pageSettings.scrollableArea.height) * this._currZoom >=
                           (this._vScrollOffset + this._scrollPixel + viewPort.height);
                        if ((cHeight) >= (this._vScrollOffset + this._scrollPixel) || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity || limited) {
                            this._updateScrollOffset(this._hScrollOffset, (this._vScrollOffset + this._scrollPixel));
                            scrolled = true;
                            offsetY = this._scrollPixel;
                        } else {
                            this._updateScrollOffset(this._hScrollOffset, cHeight);
                            scrolled = true;
                            offsetY = 0;
                        }
                    }
                    if (scrolled) {
                        var nVal = {
                            zoom: this._getCurrentZoom(), horizontalOffset: this._hScrollOffset,
                            verticalOffset: this._vScrollOffset, viewPort: this._viewPort
                        };
                        if ((oVal.horizontalOffset != nVal.horizontalOffset) || (oVal.verticalOffset != nVal.verticalOffset)) {
                            this._eventCause["scrollChange"] = ej.datavisualization.Diagram.ScrollChangeCause.Pan;
                            this._raiseEvent("scrollChange", { newValues: nVal, oldValues: oVal });
                        }
                    }
                    this._updateEditBox(0, offsetY);
                }
            }
        },
        _setActiveTool: function (evt) {
            var point = this._mousePosition(evt);
            if (!this.activeTool.inAction && (this._isUserHandleActive(this.activeTool.name) || !this.model.selectedItems.userHandles || !this.model.selectedItems.userHandles.length)) {
                if (this._isInternalTool(this.activeTool) || this.activeTool.singleAction) {
                    var node;
                    var success = false;
                    //var handle = this._isHandle(evt);
                    if (this.selectionList[0]) {
                        node = this.selectionList[0];
                        success = this._checkToolToActivate(evt, node);
                    }
                    if (!success) {
                        node = this._findNodeUnderMouse(evt);
                        if (this._isUserHandle(evt)) {
                            var handleName = $(evt.target).parents("g").first().context.id.split("_")[0];
                            this._checkToolToActivate(evt, node);
                            this.activeTool = this.tools[this._toolToActivate];
                        }
                        else {
                            this._checkToolToActivate(evt, node);
                            this._raiseMouseEvents(node);
                            if (this._isUserHandleActive(this.activateTool.name) && !this._drawingTool)
                                this.activeTool = this.tools[this._toolToActivate];
                        }
                    }
                }
            }
        },
        _beginAutoScroll: function (option, evt, delay1) {
            var delay = delay1 ? delay1 : 100;
            var callBack = this;
            var left = 0, top = 0;
            var counter = 0;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this);
            var cWidth = this._hScrollbar.model.maximum + viewPort.width;
            var cHeight = this._vScrollbar.model.maximum + viewPort.height;
            var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(this);
            var intervalID;
            if (this._canAutoScroll) {
                switch (option) {
                    case "right":
                        if ((this._hScrollOffset + viewPort.width + 10) - rulerSize.left < cWidth || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity) {
                            left = 10;
                        }
                        break;
                    case "left":
                        if (this._hScrollOffset - 10 > this._hScrollbar.model.minimum - rulerSize.left || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity) {
                            left = -10;
                        }
                        break;
                    case "bottom":
                        if ((this._vScrollOffset + viewPort.height + 10) - rulerSize.top < cHeight || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity) {
                            top = 10;
                        }
                        break;
                    case "top":
                        if (this._vScrollOffset - 10 > this._vScrollbar.model.minimum - rulerSize.top || this._scrollLimit() === ej.datavisualization.Diagram.ScrollLimit.Infinity) {
                            top = -10;
                        }
                        break;
                }
                callBack._clearTimeOutValue = window.setTimeout(function (args) {
                    var s1 = this;
                    var args = { delay: delay };
                    callBack._raiseEvent("autoScrollChange", args);
                    callBack._updateScrollBar(left, top, option, evt, args.delay);
                }, delay);

            }
        },
        _updateScrollBar: function (x, y, option, evt, delay) {
            if (this._clearTimeOutValue)
                window.clearTimeout(this._clearTimeOutValue);
            if (x === 0 && y === 0) {
                this._canAutoScroll = false;
            }
            else if (this.activeTool.inAction) {
                var hScrollOffset = this._hScrollOffset + (x * this._currZoom);
                var vScrollOffset = this._vScrollOffset + (y * this._currZoom);
                var isUpdated = this._updateSelectionOnScroll(x, y);
                if (isUpdated) {
                    this._updateScrollOffset(hScrollOffset, vScrollOffset);
                    this._beginAutoScroll(option, evt, delay);
                }
                else {
                    this._canAutoScroll = false;
                }
            }
        },
        _updateSelectionOnScroll: function (x, y) {
            var tool = this.activeTool;
            if (tool.name === "select") {
                tool.currentPoint = new ej.datavisualization.Diagram.Point(tool.currentPoint.x + x, tool.currentPoint.y + y);
                tool._updateHelper();
            } else if (tool.name === "orthogonalLine" || tool.name === "straightLine") {
                tool.currentPoint = new ej.datavisualization.Diagram.Point(tool.currentPoint.x + x, tool.currentPoint.y + y);
                tool._targetPossibleConnection = tool._currentPossibleConnection;
                tool._targetPort = tool._possibleConnectionPort;
                tool._updateHelper();
            } else if (this.selectionList.length > 0) {
                var node = this.selectionList[0];
                if (!node.isLane)
                    tool.currentPoint = ej.datavisualization.Diagram.Point(tool.currentPoint.x + x, tool.currentPoint.y + y);
                if (tool.name === "move") {
                    if (!node.isLane && tool._outOfBoundsDrag(node, x, y)) {
                        if (tool._canMoveLabel)
                            this._translateLabel(node, tool.activeLabel, x, y);
                        else
                            this._translate(node, x, y, this.nameTable);
                    }
                    else
                        return false;
                } else if (tool.name === "resize") {
                    ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this);
                    tool._updateSize(node, tool.previousPoint, tool.currentPoint);
                } else if (tool.name === "endPoint") {
                    if (tool.selectedSegment && tool._endPoint == "segmentEnd") {
                        var difx = tool.currentPoint.x - tool.previousPoint.x;
                        var dify = tool.currentPoint.y - tool.previousPoint.y;
                        tool._updateAdjacentSegments(difx, dify);

                    } else {
                        var cancelEvent = tool._updatePoints(node);
                        if (!cancelEvent.cancel) {
                            tool._disconnect(node);
                            tool._updateConnection(node, cancelEvent.updateSelection);
                        }
                    }
                }
                tool.previousPoint = ej.datavisualization.Diagram.Point(tool.currentPoint.x, tool.currentPoint.y);
                if (!tool._canMoveLabel && node.type != "phase") {
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    this._updateSelectionHandle(true);
                    this._renderTooltip(node);
                }
            }
            return true;
        },
        _isUserHandle: function (evt) {
            if (evt.target.parentNode.className.animVal === "userHandle") {
                return true;
            } else {
                return false;
            }
        },
        _isUserHandleActive: function (name) {
            var userHandleActive = false;
            if (this.model.selectedItems.userHandles && this.model.selectedItems.userHandles.length > 0) {
                var i = 0;
                var length = this.model.selectedItems.userHandles.length;
                for (i; i < length; i++) {
                    if (this.model.selectedItems.userHandles[i].name === name) {
                        userHandleActive = true;
                        break;
                    } else
                        userHandleActive = true;
                }
            }
            return userHandleActive;
        },
        _getEventDetail: function (evt) {
            if (ej.browserInfo().name === "msie") {
                if (!this._timeStamp)
                    return 1;
                return ((evt.timeStamp - this._timeStamp) >= 300) ? 1 : 2;
            }
            return evt.originalEvent.detail;
        },
        _raiseMouseEvents: function (node, evt) {
            if (!this._isEditing) {
                if (this.nameTable[this._lastNodeUnderMouse] && (!node || (this._lastNodeUnderMouse != (node._isHeader ? node.parent : node.name)))) {
                    var tooltipDiv = document.getElementById(this.element[0].id + "_mouseovertooltipDiv");
                    if (tooltipDiv) {
                        tooltipDiv.parentNode.removeChild(tooltipDiv);
                    }
                    if (!this.activeTool.inAction) {
                        this._raiseEvent("mouseLeave", { element: this.getNode(this.nameTable[this._lastNodeUnderMouse]) });
                        this._lastNodeUnderMouse = null;
                    }
                    if (this._nodeUnderMouse != null && (!this._nodeUnderMouse.segments) && !(this.activeTool instanceof ej.datavisualization.Diagram.LineTool)) {
                        if (this.activeTool._showPort)
                            this.activeTool._showPort(this._nodeUnderMouse, true);
                    }
                }
                if (node && !this.activeTool.inAction) {
                    if (!this._lastNodeUnderMouse || (this._lastNodeUnderMouse != (node._isHeader ? node.parent : node.name))) {
                        this._lastNodeUnderMouse = node._isHeader ? node.parent : node.name;
                        this._raiseEvent("mouseEnter", { element: this.getNode(this._lastNodeUnderMouse) });
                    }
                }
                if (node) {
                    var args = { element: this.getNode(node) };
                    this._raiseEvent("mouseOver", args);
                    if (args.element && !this.activeTool.inAction) {
                        this._renderMouseOverTooltip(node, evt);
                    }
                    else {
                        this._removeMouseOverTooltip();
                    }
                }
            }
        },
        _renderMouseOverTooltip: function (node, evt) {
            if (ej.datavisualization.Diagram.Util.canShowTooltip(node, this)) {
                var type = this.getObjectType(node);
                var tooltip;
                if (type == "node" || type == "group")
                    var Constraints = ej.datavisualization.Diagram.NodeConstraints;
                else Constraints = ej.datavisualization.Diagram.ConnectorConstraints;
                if (node.constraints & Constraints.InheritTooltip) {
                    tooltip = this.model.tooltip;
                    var modeltooltip = true;
                }
                else tooltip = node.tooltip;
                if (tooltip && (!modeltooltip || this._tooltipTemplateId())) {
                    var x, y, tx, ty;
                    var obj = this._getTooltipPosition(node, tooltip, evt, modeltooltip);
                    x = obj.x; y = obj.y; tx = obj.tx; ty = obj.ty;
                    x = -this._hScrollOffset + x * this._currZoom;
                    y = -this._vScrollOffset + y * this._currZoom;
                    var style = "left:" + x + "px; top:" + y + "px; display: block; position: absolute; pointer-events: none; transform:" + "translate(" + tx + "," + ty + ")";
                    var tooltipDiv = document.getElementById(this.element[0].id + "_mouseovertooltipDiv");
                    if (!tooltipDiv) {
                        tooltipDiv = this._createMouseOverTooltip();
                    }
                    tooltipDiv.style.left = x + "px";
                    tooltipDiv.style.top = y + "px";
                    tooltipDiv.style.transform = "translate(" + tx + " ," + ty + ")";
                    tooltipDiv.style.display = "block";
                    tooltipDiv.style.position = "absolute";
                    if ($.templates) {
                        var templateId = modeltooltip ? this._tooltipTemplateId() : tooltip.templateId;
                        var template = $.templates("#" + templateId).render(node);
                    }
                    $(tooltipDiv).html(template);
                    var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(this);
                    tooltipDiv.style.marginLeft = tooltipDiv.style.marginTop = "0px";
                    var diagramBounds = this.element[0].getBoundingClientRect();
                    var tooltipBounds = tooltipDiv.getBoundingClientRect();
                    var currentZoom = this.model.scrollSettings.currentZoom;
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node, this.activeTool.name == "rotatetool" ? true : false);
                    if ((diagramBounds.left > tooltipBounds.left) || (diagramBounds.right < tooltipBounds.right)) {
                        if ((modeltooltip ? this._tooltipMode() : tooltip.relativeMode) == "mouse" || tooltip.alignment.horizontal == "center") {
                            var side = diagramBounds.left > tooltipBounds.left ? "left" : "right";
                            var alignment = side == "right" ? tooltipBounds.right - diagramBounds.right : diagramBounds.left - tooltipBounds.left;
                            var position = side == "right" ? -alignment - tooltip.margin.right : tooltip.margin.left + alignment;
                        }
                        else {
                            if ((tooltip.alignment.horizontal == "left" || tooltip.alignment.horizontal == "right") && (tooltip.alignment.vertical == "center")) {
                                position = bounds.width * currentZoom + tooltipBounds.width + tooltip.margin.left + tooltip.margin.right;
                                position = tooltip.alignment.horizontal == "left" ? position * 1 : position * (-1);
                            }
                            else {

                                side = tooltip.alignment.horizontal;
                                if (side == "center") side = diagramBounds.left > tooltipBounds.left ? "left" : "right";
                                alignment = side == "right" ? tooltipBounds.right - diagramBounds.right : diagramBounds.left - tooltipBounds.left;
                                position = side == "right" ? -alignment - tooltip.margin.right : tooltip.margin.left + alignment;
                            }
                        }
                        tooltipDiv.style.marginLeft = position + "px";
                    }
                    if ((diagramBounds.bottom < tooltipBounds.bottom) || (diagramBounds.top > tooltipBounds.top)) {
                        if ((modeltooltip ? this._tooltipMode() : tooltip.relativeMode) == "mouse" || tooltip.alignment.vertical == "center") {
                            side = diagramBounds.top > tooltipBounds.top ? "top" : "bottom";
                            alignment = side == "top" ? tooltipBounds.top - diagramBounds.top : tooltipBounds.bottom - diagramBounds.bottom;
                            position = side == "top" ? tooltip.margin.top - alignment : -(alignment + tooltip.margin.bottom);
                        }
                        else {
                            if ((tooltip.alignment.horizontal == "center") && (tooltip.alignment.vertical == "bottom" || tooltip.alignment.vertical == "top")) {
                                position = bounds.height * currentZoom + tooltipBounds.height + (tooltip.margin.bottom + tooltip.margin.top);
                                position = tooltip.alignment.vertical == "bottom" ? position * (-1) : position * 1;
                            }
                            else {
                                alignment = tooltip.alignment.vertical == "top" ?
                                    diagramBounds.top - tooltipBounds.top : diagramBounds.bottom - tooltipBounds.bottom;
                                position = tooltip.alignment.vertical == "top" ? tooltip.margin.top + alignment : alignment - tooltip.margin.bottom;
                            }
                        }
                        tooltipDiv.style.marginTop = position + "px";
                    }
                }
            }
        },
        _getTooltipPosition: function (node, tooltip, evt, model) {
            var bounds = ej.datavisualization.Diagram.Util.bounds(node, false);
            var x, y, tx, ty;
            if ((model ? this._tooltipMode() : tooltip.relativeMode) == "object") {
                switch (model ? this._horizontalTooltipAlignment() : tooltip.alignment.horizontal) {
                    case "left":
                        x = bounds.x;
                        x -= tooltip.margin.left;
                        tx = "-100%";
                        break;
                    case "right":
                        x = bounds.right;
                        x += tooltip.margin.right;
                        tx = "0%";
                        break;
                    case "center":
                        x = bounds.center.x;
                        tx = "-50%";
                        break;
                }
                switch (model ? this._verticalTooltipAlignment() : tooltip.alignment.vertical) {
                    case "top":
                        y = bounds.y;
                        y -= tooltip.margin.top;
                        ty = "-100%";
                        break;
                    case "bottom":
                        y = bounds.bottom;
                        y += tooltip.margin.bottom;
                        ty = "0%";
                        break;
                    case "center":
                        y = bounds.center.y;
                        ty = "-50%";
                        break;
                }
            }
            else if (evt) {
                var position = this._mousePosition(evt);
                x = position.x + tooltip.margin.left; y = position.y + tooltip.margin.top;
            }
            return { x: x, y: y, tx: tx, ty: ty };
        },
        _isHandle: function (evt) {
            var handle = $(evt.target).parent("g.handle");
            if (handle.length > 0) {
                return true;
            }
            return false;
        },
        _findNodeUnderMouse: function (evt, defalt) {
            var node = null;
            var type;
            if (evt.target) {
                var parent = $(evt.target).parents(".ej-d-node,.ej-d-connector,.ej-d-group");
                var className = evt.target.className;
                var id = evt.target.id.split('_');
                if (id[id.length - 1] == "lblbg") return;
                if (parent) {
                    type = parent.attr("class");
                    if (type && (type === "ej-d-node" || type === "ej-d-group" || ej.datavisualization.Diagram.Util.isClassifier(evt))) {
                        node = this._findNode(parent.attr("id"));
                        if (!node) node = this._findNode(parent.attr("id").split("_label")[0]);
                        //  node = ej.datavisualization.Diagram.ClassifierHelper.getmoveelement(node,this)
                        if (!node) node = this._findNode(parent.attr("id").split('_parentdiv')[0]);
                        if (node && node._isInternalShape && node.parent && this.nameTable[node.parent] && this.nameTable[node.parent].type == "bpmn")
                            node = this.nameTable[node.parent];
                    } else if (type === "ej-d-connector") {
                        node = this._findConnector(parent.attr("id"));
                        if (!node) node = this._findConnector(parent.attr("id").split("_label")[0]);
                    }
                    if (!node && evt.target && evt.target.parentNode) {
                        var id = (evt.target.parentNode.id).split("_ej_ports");
                        node = this.findNode(id[0]);
                    }

                }
            }
            return node;
        },
        _findConnectableNodeUnderMouse: function (evt) {
            var node = null;
            if (evt && evt.type === "touchmove") {
                var epoint = this._mousePosition(evt);
                var bounds = ej.datavisualization.Diagram.Rectangle(epoint.x, epoint.y, 0, 0);
                var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(this._spatialSearch, bounds);
                for (var i = 0; i < quads.length; i++) {
                    var quad = quads[i];
                    if (quad.objects.length > 0) {
                        for (var j = 0; j < quad.objects.length; j++) {
                            var nd = quad.objects[j];
                            var nodebounds = ej.datavisualization.Diagram.Util.bounds(nd);
                            if (ej.datavisualization.Diagram.Geometry.intersectsRect(bounds, nodebounds)) {
                                if (!nd.segments && nd.visible) {
                                    return nd;
                                }
                            }
                        }
                    }
                }
            }
            else {
                var type;
                var parents = $(evt.target).parents(".ej-d-node,.ej-d-group");
                var parent = parents[0];
                var i = 1;
                while (parent) {
                    type = parent.getAttribute("class");
                    node = this._findNode(parent.getAttribute("id"));
                    if (!node)
                        node = this._findNode(parent.getAttribute("id").split('_parentdiv')[0]);
                    if (node && (ej.datavisualization.Diagram.Util.canConnect(node) || !node.parent)) {
                        parent = null;
                    } else {
                        parent = parents[i];
                        i++;
                    }
                }
                if (node) {
                    if (node.type == "umlclassifier")
                        var connector = this.activeTool.selectedObject;
                    if (connector && connector.sourceNode)
                        var sourceNode = this.nameTable[connector.sourceNode];
                    if (connector && connector.targetNode)
                        var targetNode = this.nameTable[connector.targetNode];
                    if (sourceNode)
                        node = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(node, sourceNode, connector, this);
                    if (targetNode)
                        node = ej.datavisualization.Diagram.ClassifierHelper.EnableorDisableConnection(node, targetNode, connector, this);
                }
                if (!node && evt.target && evt.target.parentNode) {
                    var id = (evt.target.parentNode.id).split("_ej_ports");
                    node = this.findNode(id[0]);
                }
            }
            return node;
        },
        _isForeignEvent: function (evt, keyDown) {
            if (evt.originalEvent && evt.originalEvent.target) {
                if (keyDown) {
                    if ((evt.originalEvent.target.localName === "input" && (
                        evt.originalEvent.target.type === "text" || evt.originalEvent.target.type === "password")) ||
                        evt.originalEvent.target.localName === "textarea" && !(this._isEditing && evt.originalEvent.target.id === this.element[0].id + "_editBox"))
                        return true;

                }
                else if (evt.originalEvent.target.localName === "img") {
                    return true;
                }
            }
        },
        _isForeignObject: function (target) {
            var foreignObj = target;
            if (foreignObj) {
                while (foreignObj.parentNode != null) {
                    if (foreignObj.tagName === "foreignObject" || (typeof foreignObj.className == "string" && foreignObj.className.split(' ').indexOf("foreignObject") !== -1)) {
                        return foreignObj;
                    } else {
                        foreignObj = foreignObj.parentNode;
                    }
                }
            }
            return null;
        },
        _altKeyPressed: function (keyModifier) {
            return keyModifier & ej.datavisualization.Diagram.KeyModifiers.Alt;
        },
        _ctrlKeyPressed: function (keyModifier) {
            return keyModifier & ej.datavisualization.Diagram.KeyModifiers.Control;
        },
        _shiftKeyPressed: function (keyModifier) {
            return keyModifier & ej.datavisualization.Diagram.KeyModifiers.Shift;
        },
        _keydown: function (evt) {
            this._isKeyDown = true;
            this._removeMouseOverTooltip();
            var keycode = evt.keyCode ? evt.keyCode : evt.which;
            var ctrlKey = navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey;
            var key = evt.key;
            if (!this._isForeignEvent(evt, true)) {
                for (var i in this.model.commandManager.commands) {
                    var command = this.model.commandManager.commands[i];
                    if (command && command.gesture) {
                        if (command.gesture.keyModifiers || command.gesture.key) {
                            if ((!command.gesture.key || (keycode == command.gesture.key || key == command.gesture.key) || (navigator.platform.match("Mac") && key === "Backspace" && i === "delete"))
                                && (!command.gesture.keyModifiers || ((ctrlKey || evt.altKey || evt.shiftKey) &&
                                (!this._altKeyPressed(command.gesture.keyModifiers) || evt.altKey) &&
                                (!this._shiftKeyPressed(command.gesture.keyModifiers) || evt.shiftKey) &&
                                (!this._ctrlKeyPressed(command.gesture.keyModifiers) || ctrlKey)))) {
                                this._currentCommand = i;
                                if (this._currentCommand !== "focusToNextItem" && this._currentCommand !== "focusToPreviousItem" && this._currentCommand !== "selectFocusedItem") {
                                    this._diagramElements = null;
                                    this._focusedElement = null;
                                    ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this._adornerSvg, this._adornerLayer);
                                }
                                if (command.execute && command.canExecute) {
                                    var canExecute = command.canExecute;
                                    if (typeof command.canExecute == "string") canExecute = ej.util.getObject(command.canExecute, window);
                                    if ($.isFunction(canExecute) && canExecute({ model: this.model })) {
                                        var execute = command.execute;
                                        if (typeof command.execute === "string") {
                                            execute = ej.util.getObject(command.execute, window);
                                        }
                                        if ($.isFunction(execute))
                                            execute({ keyDownEventArgs: evt, parameter: command.parameter, model: this.model });
                                    }
                                }
                            }
                        }
                    }
                }
                if (this.activeTool.keydown)
                    this.activeTool.keydown(evt);
            }
            this._isKeyDown = false;
        },
        _keyup: function (evt) {
            var keycode = evt.keyCode ? evt.keyCode : evt.which;
            if (!this._isEditing && (keycode === 37 || keycode === 38 || keycode === 39 || keycode === 40)) {
                if (this._currentState) {
                    //this.addHistoryEntry({ type: "nudge", category: "internal", values: this._currentState, object: this.selectionList[0] });
                }
                delete this._currentState;
                evt.preventDefault();
                this.activeTool.inAction = false;
                this._updateSelectionHandle();
            }
        },
        _registerHistoryEvents: function () {
            this.historyManager.addEventHandler("collectionchanged", $.proxy(this._recordCollectionChanged, this));
            this.historyManager.addEventHandler("positionchanged", $.proxy(this._recordPinPointChanged, this));
            this.historyManager.addEventHandler("sizechanged", $.proxy(this._recordResizeChanged, this));
            this.historyManager.addEventHandler("rotationchanged", $.proxy(this._recordRotationChanged, this));
            this.historyManager.addEventHandler("endpointchanged", $.proxy(this._recordEndPointChanged, this));
            this.historyManager.addEventHandler("labelchanged", $.proxy(this._recordLabelChanged, this));
            this.historyManager.addEventHandler("groupingchanged", $.proxy(this._recordGroupChanged, this));
        },
        _svgdrop: function (evt, ui) {
            if (this._selectedSymbol && ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var args = {};
                var e = evt.originalEvent;
                if (e.preventDefault)
                    e.preventDefault();
                else
                    e.returnValue = false;
                var scale = this._currZoom;
                var offset = $("#" + this.element[0].id).offset();
                var coor = this._isTouchEvent(evt);
                if (!coor.pageX && !evt.pageX) {
                    if (evt.originalEvent && evt.originalEvent.changedTouches) {
                        coor = evt.originalEvent.changedTouches[0];
                    }
                    else if (evt && evt.changedTouches) {
                        coor = evt.changedTouches[0];
                    }
                }
                var x = (coor ? coor.pageX : evt.pageX) + this._hScrollOffset - offset.left;
                var y = (coor ? coor.pageY : evt.pageY) + this._vScrollOffset - offset.top;
                var paletteItem = $.extend(true, {}, this._selectedSymbol);
                var symbolPaletteId = ui.helper[0].getAttribute("paletteId");
                var symbolPalette = $("#" + symbolPaletteId).ejSymbolPalette("instance");
                if (symbolPaletteId) {
                    this._selectedSymbol = null;
                    paletteItem.name += ej.datavisualization.Diagram.Util.randomId();
                    if (!paletteItem.isPhase && paletteItem.segments) {
                        if (paletteItem.segments) {
                            ej.datavisualization.Diagram.Util._translateLine(paletteItem, x, y);
                        }
                        paletteItem = this.getNode(paletteItem);
                    } else if (!paletteItem.isPhase) {
                        var palNameTable = $.extend(true, {}, symbolPalette.nameTable);
                        paletteItem.offsetX = x / scale;
                        paletteItem.offsetY = y / scale;
                        if (paletteItem._type === "group") {
                            var children = this._getChildren(paletteItem.children);
                            for (var j = 0; j < children.length; j++) {
                                var newObj = $.extend(true, {}, palNameTable[children[j]]);
                                newObj.parent = paletteItem.name;
                                newObj.name = paletteItem.name + newObj.name;
                                children[j] = newObj.name;
                                this.nameTable[newObj.name] = newObj;
                                this.nodes().push(newObj);
                                this._nodes = $.extend(true, [], this.nodes());
                                this._updateQuad(this.nameTable[newObj.name]);
                            }
                            paletteItem.height = paletteItem.width = 0;
                            this._updateChildBounds(paletteItem, this.nameTable);
                        }
                        if (paletteItem._type === "group")
                            paletteItem = this._getNewGroup(paletteItem);
                        else if (paletteItem.segments)
                            paletteItem = this._getNewConnector(paletteItem);
                        else if (!(paletteItem.isPhase || paletteItem.type === "phase"))
                            paletteItem = this._getNewNode(paletteItem);
                    }
                    if (paletteItem && paletteItem.isLane) {
                        this._cloneGroupNode(paletteItem, ej.datavisualization.Diagram.Util.randomId());
                        paletteItem = ej.datavisualization.Diagram.SwimLaneHelper._createDiagramLane(paletteItem, this.nameTable)
                        paletteItem = this._initLaneContaier(paletteItem);
                    }
                    args = { element: paletteItem, cancel: false };
                    this._raiseDropEvent(args);

                    if (paletteItem && paletteItem.isLane) {
                        var header = paletteItem.children[0];
                        var swimlane = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(paletteItem, this, null, null, header);
                        if (swimlane && swimlane.isSwimlane)
                            paletteItem = swimlane;
                    }
                    if (!paletteItem.isPhase) {
                        if (!args.cancel) {
                            this.add(paletteItem);
                        }
                        paletteItem = this.selectionList[0];
                        this.scrollToNode(paletteItem);
                        if (paletteItem.labels.length > 0 && paletteItem.labels[0].mode === "edit") {
                            this._isEditing = true;
                            this.startLabelEdit(paletteItem, paletteItem.labels[0]);
                        } else
                            this.element[0].focus();
                    }
                }
            } else {
                var node = null;
                node = this._findNodeUnderMouse(evt);
                args = { element: ui.helper, e: evt, draggable: ui.draggable, targetNode: node };
                this._raiseDropEvent(args);
            }
        },
        _isTouchEvent: function (evt) {
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend") {
                return evt.originalEvent ? evt.originalEvent.changedTouches[0] : evt.changedTouches[0];
            }
            return evt;
        },
        _raiseDropEvent: function (args) {
            args.source = this._symbolPalette ? this._symbolPalette : null;
            args.objectType = args.source ? ej.datavisualization.Diagram.ObjectTypes.Palette : ej.datavisualization.Diagram.ObjectTypes.Diagram;
            this._raiseEvent("drop", args);
            this._symbolPalette = null;
        },
        //#endregion
        //#region Undo Redo
        _recordCollectionChanged: function (args, orgObj) {
            this._isUndo = true;
            this._isInsert = true;
            var i;
            var changeType = args.changeType;
            if (args.isUndo) {
                if (args.changeType == "insert")
                    changeType = "remove";
                else
                    changeType = "insert";
            }
            this._clearSelection(changeType == "insert" ? false : true);
            if (changeType == "insert") {
                if (!args.object.container && !args.object._isMultipleLaneDelete) {
                    if (args.object.type != "pseudoGroup") {
                        if (!args.object.segments) {
                            var port = null;
                            if (args.object.inEdges && args.object.inEdges.length > 0) {
                                for (i = 0; i < args.object.inEdges.length; i++) {
                                    if (this.nameTable[args.object.inEdges[i]])
                                        this.nameTable[args.object.inEdges[i]].targetNode = args.object.name;
                                    if (args.targetPorts)
                                        port = args.targetPorts[args.object.inEdges[i]];
                                    if (port)
                                        if (this.nameTable[args.object.inEdges[i]])
                                            this.nameTable[args.object.inEdges[i]].targetPort = port;
                                }
                            }
                            if (args.object.outEdges && args.object.outEdges.length > 0) {
                                for (i = 0; i < args.object.outEdges.length; i++) {
                                    if (this.nameTable[args.object.outEdges[i]])
                                        this.nameTable[args.object.outEdges[i]].sourceNode = args.object.name;
                                    if (args.sourcePorts)
                                        port = args.sourcePorts[args.object.outEdges[i]];
                                    if (port)
                                        if (this.nameTable[args.object.outEdges[i]])
                                            this.nameTable[args.object.outEdges[i]].sourcePort = port;
                                }
                            }
                        }
                        if (args.object._type === "group")
                            this._addChildren(args.object, args.childTable);
                        if (args.object.isSwimlane)
                            args.object = ej.datavisualization.Diagram.SwimLaneHelper._initSwimLane(args.object, this)
                        this.add(args.object, args);
                        if (args.object.parent) {
                            var pNode = this.nameTable[args.object.parent];
                        }
                        if (args.object._type === "group") {
                            this._addConnector(args.object, args);
                            this._addGroupConnector(args.object, args);
                        }
                        else {
                            this._addConnector(args.object, args);
                        }
                    } else {
                        delete this.nameTable["multipleSelection"];
                        var node, j, objectType, childConnectors = [];
                        var pseudoGroup = ej.datavisualization.Diagram.Group({ "name": "multipleSelection", type: "pseudoGroup" });

                        for (i = 0; i < args.object.children.length; i++) {
                            child = typeof args.object.children[i] === "object" ? args.object.children[i] : args.childTable[args.object.children[i]];
                            if (child) {
                                objectType = this.getObjectType(child);
                                if (objectType === "group" && !child.isSwimlane)
                                    this._addChildren(child, args.childTable);
                                if (child.isSwimlane) {
                                    this._swimlanePaste = true;
                                    this._isUndo = true;
                                    var child = this._pasteSwimlaneObj(child, args);
                                    delete this._swimlanePaste;
                                }
                                else if (objectType != "connector")
                                    this.add(child, args);
                                else
                                    childConnectors.push(child);
                                if (child)
                                    pseudoGroup.children.push(child.name);
                            }
                        }
                        for (i = 0; i < childConnectors.length; i++) {
                            this.add(childConnectors[i], args);
                            //  pseudoGroup.children.push(childConnectors[i].name);
                        }
                        this._addGroupConnector(args.object, args);
                        for (i = 0; i < pseudoGroup.children.length; i++) {
                            node = this.nameTable[this._getChild(pseudoGroup.children[i])];
                            if (node && !node.segments) {
                                if (node.inEdges.length > 0) {
                                    for (j = 0; j < node.inEdges.length; j++) {
                                        if (!this._isUndo) {
                                            this.nameTable[node.inEdges[j]].targetNode = node.name;
                                        }
                                        else {
                                            args.childTable[node.inEdges[j]].targetNode = node.name;
                                        }
                                    }
                                }
                                if (node.outEdges.length > 0) {
                                    for (j = 0; j < node.outEdges.length; j++) {
                                        if (!this._isUndo) {
                                            this.nameTable[node.outEdges[j]].sourceNode = node.name;
                                        }
                                        else {
                                            args.childTable[node.outEdges[j]].sourceNode = node.name;
                                        }
                                    }
                                }
                            }
                        }
                        this._clearSelection();
                        this.nodes().push(pseudoGroup);
                        this._nodes = $.extend(true, [], this.nodes());
                        pseudoGroup.offsetX = args.object.offsetX;
                        pseudoGroup.offsetY = args.object.offsetY;
                        pseudoGroup.height = args.object.height;
                        pseudoGroup.width = args.object.width;
                        pseudoGroup.rotateAngle = args.object.rotateAngle;
                        this.nameTable[pseudoGroup.name] = pseudoGroup;
                        this.addSelection(pseudoGroup, true);
                    }
                } else {
                    var child, laneChild = [], laneCollection;
                    for (var i in args.childTable) {
                        child = args.childTable[i];
                        this.nameTable[i] = child;
                    }
                    node = args.object;
                    if (node.isSwimlane) {
                        this.nameTable[node.name] = node;
                        node.width = 0;
                        node.height = 0;
                        this._swimlanePaste = true;
                        this._multipleAction = true;
                        this._eventCause["nodeCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange;
                        this._pasteSwimlaneObj(node);
                        delete this._swimlanePaste;
                        this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange;
                        this._addAssiciatedChildConnectors(node);
                        delete this._multipleAction;
                        this._clearSelection(true);
                    } else if ((node._type == "pseudoGroup") || (node.isLane)) {
                        if (node._type == "pseudoGroup") {
                            for (i = 0; i < node.children.length; i++) {
                                child = node.children[i];
                                laneChild[i] = args.childTable[child.name];
                                if (child.isLane) {
                                    if (this.nameTable[child.name]) delete this.nameTable[child.name];
                                }
                            }
                            laneCollection = this._sortByLaneIndex(laneChild);
                            for (i = 0; i < laneCollection.length; i++) {
                                child = laneCollection[i];
                                if (child.isLane)
                                    this._recordCollectionChangedAddLane(child, child._laneIndex);
                                else {
                                    this.add(child, args);
                                    this._clearSelection(true);
                                }
                            }
                        }
                        else
                            this._recordCollectionChangedAddLane(args.object, args.index)
                    }
                    else {
                        this.add(node);
                        this._addConnector(node, args);
                    }
                }
            }
            else if (changeType == "remove") {
                if (args.object.type != "pseudoGroup" && !args.object.isLane) {
                    this._removeAdjacentConnections(args.object, args);
                    if (args.object.isSwimlane || args.object.annotation)
                        this._remove(this.nameTable[args.object.name]);
                    else
                        this._remove(args.object);
                    return true;
                }
                else if (args.object.isLane) {
                    var obj = args.object;
                    if (!args.index && args.index != 0) {
                        var index = null;
                        if (args.object.isLane && orgObj) {
                            orgObj.index = this._getRemoveIndex(args.object, true);
                        }
                    }
                    this._remove(obj);
                }
                else {
                    for (i = 0; i < args.object.children.length; i++) {
                        this._remove(this.nameTable[this._getChild(args.object.children[i])]);
                    }
                }
            }
            if (!this._groupUndo)
                this._isUndo = false;
            this._isInsert = false;
            this.tools['move']._isLane = false;
        },

        _recordCollectionChangedAddLane: function (child, index) {
            var swimlane, parentStack;
            if (child && child.isLane && child.parent) {
                if (child && child.parent)
                    parentStack = this.nameTable[child.parent];
                if (parentStack) {
                    if (parentStack)
                        swimlane = this.nameTable[parentStack.parent];
                }
                if (swimlane) {
                    this.activeTool.selectedObject = child;
                    this._eventCause["nodeCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange;
                    ej.datavisualization.Diagram.canvasHelper._addNewLane(this, child, swimlane, true, index);
                    this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange;
                    this._addAssiciatedChildConnectors(child);
                    this._clearSelection(true);
                }
            }
        },

        _addAssiciatedChildConnectors: function (group) {
            var children = this._getChildren(group.children);
            if (children && children.length > 0) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var child = this.nameTable[children[i]];
                    if (child) {
                        this._addConnector(child);
                        if (child.type === "group") {
                            this._addAssiciatedChildConnectors(child);
                        }
                    }
                }
            }
        },
        _updateRecordPinPoint: function (node, childTable, isMultipleSelection) {
            var object, i, item, objNode;
            // this._clearSelection();
            if (node.type == "pseudoGroup") {
                var undoObj = node;
                var children = this._getChildren(node.children);
                for (i = 0; i < children.length; i++) {
                    item = this.nameTable[children[i]];
                    objNode = childTable[children[i]];
                    if (objNode) {
                        if (!item.segments) {
                            this._propertyChangeValues(item, objNode);
                            this._translate(item, objNode.offsetX - item.offsetX, objNode.offsetY - item.offsetY, this.nameTable);
                        } else {
                            var objLine = childTable[item.name];
                            item.sourcePoint = objLine.sourcePoint;
                            item.targetPoint = objLine.targetPoint;
                            item.segments = jQuery.extend(true, item.segments, objLine.segments);
                        }
                        ej.datavisualization.Diagram.DiagramContext.update(item, this);
                    }
                }
                if (this.selectionList[0]) {
                    if (this.selectionList[0].name === undoObj.name) {
                        this.selectionList[0].offsetX = undoObj.offsetX;
                        this.selectionList[0].offsetY = undoObj.offsetY;
                    }
                }
                ej.datavisualization.Diagram.SvgContext.updateSelector(undoObj, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
            } else {
                if (node.segments) {
                    if (isMultipleSelection) {
                        object = childTable[node.name];
                        node.sourcePoint = object.sourcePoint;
                        node.targetPoint = object.targetPoint;
                        node.segments = $.extend(true, [], object.segments);
                        ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    } else {
                        this._clearSelection(true);
                        object = this._findConnector(node.name);
                        var obj;

                        if (node.targetNode) {
                            obj = this.nameTable[node.targetNode];
                            ej.datavisualization.Diagram.Util.removeItem(obj.inEdges, node);
                        }
                        if (node.sourceNode) {
                            obj = this.nameTable[node.sourceNode];
                            ej.datavisualization.Diagram.Util.removeItem(obj.outEdges, node);
                        }
                        if (node.targetNode) {
                            obj = this.nameTable[node.targetNode];
                            obj.inEdges.push(node.name);
                        }
                        if (node.sourceNode) {
                            obj = this.nameTable[node.sourceNode];
                            obj.outEdges.push(node.name);
                        }
                        this._propertyChangeConnectorValues(object, node);
                        object.targetNode = node.targetNode;
                        object.sourceNode = node.sourceNode;
                        object.targetPort = node.targetPort;
                        object.sourcePort = node.sourcePort;
                        object.sourcePoint = node.sourcePoint;
                        object.targetPoint = node.targetPoint;
                        object.segments = $.extend(true, [], node.segments);
                        ej.datavisualization.Diagram.DiagramContext.update(object, this);
                        ej.datavisualization.Diagram.SvgContext.updateSelector(node, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                        this.addSelection(node, true);
                    }
                } else {
                    if (isMultipleSelection) {
                        object = childTable[node.name];
                        this._translate(node, object.offsetX - node.offsetX, object.offsetY - node.offsetY, childTable);
                        ej.datavisualization.Diagram.DiagramContext.update(object, this);
                    } else {
                        object = this._findNode(node.name);
                        this._clearSelection(true);
                        this._propertyChangeValues(object, node);
                        if (node.parent)
                            parent = this.nameTable[node.parent];
                        if (!parent) {
                            parent = this.nameTable[object.parent];
                            var update = true;
                        }
                        if (parent && parent.container) {
                            this._raiseGroupChangeEvent(node, object.parent ? this.nameTable[object.parent] : null, this.nameTable[node.parent], ej.datavisualization.Diagram.GroupChangeCause.HistoryChange);
                            ej.datavisualization.Diagram.canvasHelper._undoDragNode(this, this.nameTable[node.name], node);
                            if (update) {
                                var swimlane = this.nameTable[parent.parent.split("laneStack")[0]];
                                if (swimlane) {
                                    ej.datavisualization.Diagram.DiagramContext.update(swimlane, this);
                                }
                            }
                        }
                        else {
                            this._translate(object, node.offsetX - object.offsetX, node.offsetY - object.offsetY, this.nameTable);
                            if (node.parent) {
                                ej.datavisualization.Diagram.Util._updateGroupBounds(this.nameTable[object.parent], this);
                            }
                            if (object.parent) {
                                var parent = this.nameTable[object.parent];
                                if (parent && object.parent && node.parent == "") {
                                    ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, object.name);
                                    this._delete(object);
                                    if (node.type === "group" || node.type === "bpmn")
                                        this._initGroupNode(node, childTable);
                                    this.add(node);
                                }
                            }
                            if (node.parent) {
                                var parent = this.nameTable[node.parent];
                                if (node.parent && object.parent == "") {
                                    this._delete(object);
                                    node = $.extend(true, {}, node);
                                    if (node.type === "group" || node.type === "bpmn")
                                        this._initGroupNode(node, childTable);
                                    this.add(node);
                                }
                            }
                        }
                        ej.datavisualization.Diagram.DiagramContext.update(object, this);
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, object);
                        this.addSelection(object, true);
                    }
                }
            }
        },

        _propertyChangeValues: function (item, objNode) {
            var propertyNamex = (item.offsetX === objNode.offsetX) ? "" : "offsetX";
            var propertyNamey = (item.offsetY === objNode.offsetY) ? "" : "offsetY";
            if (propertyNamex === "offsetX") {
                var resource = { element: objNode, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyNamex, oldValue: item.offsetX, newValue: objNode.offsetX };
                this._raisePropertyChange(resource);
            }
            if (propertyNamey === "offsetY") {
                resource = { element: objNode, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyNamey, oldValue: item.offsetY, newValue: objNode.offsetY };
                this._raisePropertyChange(resource);
            }
        },
        _propertyChangeResizeValues: function (item, childObj) {
            var propertyName = (childObj.width === item.width) ? "" : "width";
            var propertyName1 = (childObj.height === item.height) ? "" : "height";
            if (propertyName === "width") {
                var resource = { element: item, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyName, oldValue: item.width, newValue: childObj.width };
                this._raisePropertyChange(resource);
            }
            if (propertyName1 === "height") {
                resource = { element: item, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyName1, oldValue: item.height, newValue: childObj.height };
                this._raisePropertyChange(resource);
            }
        },
        _propertyChangeConnectorValues: function (connector, currentObject) {
            var propertyName = (connector.sourcePoint.x === currentObject.sourcePoint.x || connector.sourcePoint.y === currentObject.sourcePoint.y) ? "" : "sourcePoint";
            var propertyName1 = (connector.targetPoint.x === currentObject.targetPoint.x || connector.targetPoint.y === currentObject.targetPoint.y) ? "" : "targetPoint";
            if (propertyName === "sourcePoint") {
                var resource = { element: currentObject, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyName, oldValue: connector.sourcePoint, newValue: currentObject.sourcePoint };
                this._raisePropertyChange(resource);
            }
            if (propertyName1 === "targetPoint") {
                resource = { element: currentObject, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: propertyName1, oldValue: connector.targetPoint, newValue: currentObject.targetPoint };
                this._raisePropertyChange(resource);
            }
        },

        _renderNodeOnLane: function (group, parent) {
            var view, panel;
            var diagram = this;
            diagram._views.forEach(function (viewid) {
                var isOverView
                view = diagram._views[viewid];
                panel = view.svg || view._canvas;
                parent = view.svg.getElementById(group.parent);
                if (view.type == "overview") {
                    isOverView = true;
                }
                if (group._type === "group")
                    view.context.renderGroup(group, panel, parent || view.diagramLayer, diagram.nameTable, diagram, null, true);
                else if (diagram.getObjectType(group) === "node")
                    view.context.renderNode(group, panel, parent || view.diagramLayer);
            });
        },

        _updateUndoObject: function (node, object) {
            if (object.parent)
                var parent = this.nameTable[object.parent];
            if (parent && this._collectionContains(object.name, parent.children)) {
                ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, object.name);
                if (node.parent)
                    var newParent = this.nameTable[node.parent];
                if (newParent && newParent.children && !this._collectionContains(object.name, newParent.children)) {
                    newParent.children.push(node.name);
                    this.nameTable[node.name].parent = newParent.name;
                    if (newParent.isLane) {
                        var moveTool = this.tools["move"];
                        moveTool._updateMargin(object, newParent);
                    }
                }
            }
            else {
                if (node.parent) {
                    var parent = this.nameTable[node.parent];
                }
            }
        },
        _collectionContains: function (name, coll) {
            for (var i = 0; i < coll.length; i++) {
                if (typeof (coll[i]) === "string" && coll[i] === name) {
                    return true;
                }
                else if (coll[i].name === name) {
                    return true;
                }
            }
        },

        _recordPinPointChanged: function (args) {
            var node = args.object.node;
            var childTable = args.object.childTable;
            if (node || node.isSwimlane)
                this._updateRecordPinPoint(node, childTable);
        },

        _updateRecordRotation: function (object, childTable) {
            var node, i, item, objNodeChild;
            if (object.type == "pseudoGroup") {
                this._clearSelection(true);
                this.nameTable[object.name] = object;
                node = this.nameTable[object.name];
                var children = object.children;
                for (i = 0; i < children.length; i++) {
                    item = this.nameTable[this._getChild(children[i])];
                    objNodeChild = childTable[children[i]];
                    if (item) {
                        if (!item.segments) {
                            if (objNodeChild) {
                                this._translate(item, objNodeChild.offsetX - item.offsetX, objNodeChild.offsetY - item.offsetY, this.nameTable);
                                this._comparePropertyValues(item, "rotateAngle", { rotateAngle: objNodeChild.rotateAngle });
                                this._rotate(item, objNodeChild.rotateAngle - item.rotateAngle, this.nameTable);
                            }
                        } else {
                            var objLine = childTable[item.name];
                            item.sourcePoint = objLine.sourcePoint;
                            item.targetPoint = objLine.targetPoint;
                        }
                        ej.datavisualization.Diagram.DiagramContext.update(item, this);
                    }
                }
                if (node) {
                    var newangle = object.rotateAngle - node.rotateAngle;
                    node.rotateAngle += newangle;
                    if (this.selectionList[0])
                        this.selectionList[0].rotateAngle = node.rotateAngle;
                }
                this.nameTable[object.name] = object;
                this.addSelection(object, true);
            }
            else {
                var parent = null;
                if (object.parent) {
                    parent = this.nameTable[object.parent];
                }
                if (parent && parent.container) {
                    var node = this._findNode(object.name);
                    ej.datavisualization.Diagram.canvasHelper._undoRotateNode(this, node, object);
                }
                else if (object) {
                    this._clearSelection(true);
                    node = this._findNode(object.name);
                    this._comparePropertyValues(node, "rotateAngle", { rotateAngle: object.rotateAngle });
                    this._rotate(node, object.rotateAngle - node.rotateAngle, this.nameTable);
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    this.addSelection(node, true);
                }
            }
        },

        _recordSizeChanged: function (args, entryItem) {
            var node = args.object.node;
            var childTable = args.object.childTable;
            //  if (!node.container)
            this._updateRecordSize(node, childTable, entryItem);
        },

        _updateRecordSize: function (object, childTable, args) {
            var node, i, childObj;
            this._clearSelection(true);
            if ((object._type === "group" || object.type === "pseudoGroup") && !(object.isLane || object.isSwimlane || object.type === "bpmn")) {
                if (object.type == "pseudoGroup")
                    this.nameTable[object.name] = object;
                node = this._findNode(object.name);
                var nodeChildren = this._getChildren(node.children);
                var objChildren = this._getChildren(object.children);
                for (i = 0; nodeChildren && i < nodeChildren.length; i++) {
                    var item = this.nameTable[objChildren[i]];
                    childObj = childTable[objChildren[i]];
                    if (childObj) {
                        if (!item.segments) {
                            this._propertyChangeResizeValues(item, childObj);
                            this._translate(item, childObj.offsetX - item.offsetX, childObj.offsetY - item.offsetY, this.nameTable);
                            this.scale(item, (childObj.width / item.width), (childObj.height / item.height), ej.datavisualization.Diagram.Point(item.offsetX, item.offsetY), this.nameTable);
                            //ej.datavisualization.Diagram.DiagramContext.update(item, this);
                        } else {
                            var kk = childTable[item.name];
                            item.sourcePoint = kk.sourcePoint;
                            item.targetPoint = kk.targetPoint;
                            item.segments = $.extend(true, [], kk.segments);;
                            //ej.datavisualization.Diagram.DiagramContext.update(item, this);
                        }
                    }
                }
                //if (node.name === object.name) {
                var parent = null;
                if (object.parent) {
                    parent = this.nameTable[object.parent];
                }
                if (parent && parent.container) {
                    node = this._findNode(object.name);
                    ej.datavisualization.Diagram.canvasHelper._undoResizeNode(this, node, object);
                }
                else {
                    node.offsetX = object.offsetX;
                    node.offsetY = object.offsetY;
                    node.width = object.width;
                    node.height = object.height;
                    if (!(this.activeTool.name == "resize" && this.activeTool.inAction && this.selectionList[0].type != "pseudoGroup" && this.selectionList[0].type != "group"))
                        this._updateAssociatedConnectorEnds(node, this.nameTable);

                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    this.addSelection(node, true);
                }
            }
            else if (object.isLane || object.isSwimlane) {
                node = this._findNode(object.name);
                ej.datavisualization.Diagram.canvasHelper._undoResizeLane(this, object, args);
            }
            else if (object.type == "bpmn" && object.container) {
                node = this._findNode(object.name);
                ej.datavisualization.Diagram.canvasHelper._undoResizeNode(this, node, object);
            }
            else {
                var parent = null;
                if (object.parent) {
                    parent = this.nameTable[object.parent];
                }
                if (parent && parent.container) {
                    node = this._findNode(object.name);
                    ej.datavisualization.Diagram.canvasHelper._undoResizeNode(this, node, object);
                }
                else if (!object.segments) {
                    node = this._findNode(object.name);
                    this._propertyChangeResizeValues(node, object);
                    this._translate(node, object.offsetX - node.offsetX, object.offsetY - node.offsetY, this.nameTable);
                    this.scale(node, object.width / node.width, object.height / node.height, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), this.nameTable);
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    this.addSelection(node, true);
                }
                else { }
            }

        },

        _recordRotationChanged: function (args) {
            var node = args.object.node;
            var childTable = args.object.childTable;
            //  if (!node.container)
            this._updateRecordRotation(node, childTable);
        },

        _recordEndPointChanged: function (args) {
            this.clearSelection(true);
            var connector, currentObject, previousObject, obj;
            if (args._isUndo) {
                connector = currentObject = args.undoObject;
                previousObject = args.redoObject;
            }
            else {
                connector = currentObject = args.redoObject;
                previousObject = args.undoObject;
            }
            if (connector.parent) {
                connector = this._findChildren(this.nameTable[connector.parent], connector.name);
            }
            else
                connector = this._findConnector(connector.name);

            if (previousObject.targetNode) {
                obj = this.nameTable[previousObject.targetNode];
                ej.datavisualization.Diagram.Util.removeItem(obj.inEdges, previousObject.name);
            }
            if (previousObject.sourceNode) {
                obj = this.nameTable[previousObject.sourceNode];
                ej.datavisualization.Diagram.Util.removeItem(obj.outEdges, previousObject.name);
            }
            if (currentObject.targetNode) {
                obj = this.nameTable[currentObject.targetNode];
                obj.inEdges.push(currentObject.name);
            }
            if (currentObject.sourceNode) {
                obj = this.nameTable[currentObject.sourceNode];
                obj.outEdges.push(currentObject.name);
            }
            this._propertyChangeConnectorValues(connector, currentObject);
            this._comparePropertyValues(connector, "targetNode", { targetNode: currentObject.targetNode });
            connector.targetNode = currentObject.targetNode;
            this._comparePropertyValues(connector, "sourceNode", { sourceNode: currentObject.sourceNode });
            connector.sourceNode = currentObject.sourceNode;
            this._comparePropertyValues(connector, "targetPort", { targetPort: currentObject.targetPort });
            if (args.removePortType == "targetpoint" || args.removePortType == "sourcepoint") {
                var connectedNode = null;
                if (args.removePortType == "targetpoint")
                    connectedNode = this._findNode(args.undoObject.targetNode);
                else
                    connectedNode = this._findNode(args.undoObject.sourceNode);
                var connectedPort = this._findPort(connectedNode, args.removedPort.name);
                if (connectedNode._ports) {
                    if (this._UndoRedo)
                        connectedNode._ports.push(args.removedPort);
                    else {
                        var idx = connectedNode._ports.indexOf(args.removedPort);
                        connectedNode._ports.splice(idx, 1);
                    }
                }
            }
            connector.targetPort = currentObject.targetPort;
            this._comparePropertyValues(connector, "sourcePort", { sourcePort: currentObject.sourcePort });
            connector.sourcePort = currentObject.sourcePort;
            this._comparePropertyValues(connector, "sourcePoint", { sourcePoint: currentObject.sourcePoint });
            connector.sourcePoint = currentObject.sourcePoint;
            this._comparePropertyValues(connector, "targetPoint", { targetPoint: currentObject.targetPoint });
            connector.targetPoint = currentObject.targetPoint;
            connector.segments = $.extend(true, [], currentObject.segments);
            this._updateEdges(connector);
            this._dock(connector, this.nameTable);
            ej.datavisualization.Diagram.Util._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort, this);
            ej.datavisualization.Diagram.DiagramContext._refreshSegments(connector, this);
            ej.datavisualization.Diagram.Util.updateBridging(connector, this);
            ej.datavisualization.Diagram.DiagramContext.update(connector, this);
            this._updateConnectorBridging(connector);
            this._addSelection(connector, this._selectionContains(connector) ? true : false);
            if (this.selectionList[0])
                ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.selectionList[0], this._adornerSvg, this._currZoom);
            ej.datavisualization.Diagram.SvgContext.updateSelector(connector, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
        },
        _recordLabelPositionChanged: function (entryItem) {
            var label = entryItem.activeLabel, node, obj;
            if (label) {
                node = entryItem.redoObject ? entryItem.redoObject.node : null;
                if (entryItem.undo)
                    node = entryItem.undoObject ? entryItem.undoObject.node : null;
                if (node) {
                    obj = this._findLabel(node, label.name);
                    this.updateLabel(node.name, label, { margin: obj.margin, offset: obj.offset, segmentOffset: obj.segmentOffset, width: obj.width, height: obj.height, rotateAngle: obj.rotateAngle });
                }
            }
        },
        _recordPortPositionChanged: function (entryItem) {
            var port = entryItem.activePort, node, obj;
            if (port) {
                node = entryItem.redoObject ? entryItem.redoObject.node : null;
                if (entryItem.undo)
                    node = entryItem.undoObject ? entryItem.undoObject.node : null;
                if (node) {
                    obj = this._findPort(node, port.name);
                    this.updatePort(node.name, port, { offset: obj.offset });
                }
            }
        },
        _recordLabelChanged: function (args) {
            var node = this.nameTable[args.object.name];
            this._comparePropertyValues(node.labels[args.index ? args.index : 0], "text", { text: args.label });
            if (args.object.type === "text") {
                node.textBlock.text = args.label;
                ej.datavisualization.Diagram.DiagramContext.updateTextBlock(node, node.textBlock, this);
            } else {
                if (node.type == "umlclassifier") {
                    this._clearSelection(true);
                    args.label = ej.datavisualization.Diagram.ClassifierHelper.getEditboxValue(args.label, node, this);
                    node = ej.datavisualization.Diagram.ClassifierHelper.getClassifierNodeDimension(node, this);
                    node.labels[args.index].text = "";
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                    this.addSelection(node, true);
                }
                else if (node.shape && node.shape.type == "umlclassifier") {
                    node = ej.datavisualization.Diagram.ClassifierHelper.getUMLConnectorValue(node, args.label, node.labels[args.index]);
                    ej.datavisualization.Diagram.DiagramContext.update(node, this);
                }
                else {
                    if (node.labels[args.index]) {
                        node.labels[args.index].text = args.label;
                        ej.datavisualization.Diagram.DiagramContext.updateLabel(node, node.labels[args.index], this);
                    }
                    else {
                        node.labels[args.index] = ej.datavisualization.Diagram.Label({ text: args.label });
                        ej.datavisualization.Diagram.DiagramContext.addNodeLabel(node, node.labels[args.index], null, this);
                    }
                }
            }
        },
        labelcollectionchanged: function (args) {
            var node = this.nameTable[args.shape.name];
            var prtyLabels = node.labels;
            prtyLabels.slice(0);
            if (args.isLabelRemove) {
                if (args.labels && args.labels.length > 0) {
                    var labels = args.labels.slice();
                    var index, label;
                    for (var i = 0; i < labels.length; i++) {
                        index = labels[i].index;
                        label = labels[i].label;
                        if (index != undefined && label) {
                            if (args.isUndo)
                                this.insertLabel(node.name, label, index);
                            else
                                this.removeLabels(node.name, [label]);

                        }
                    }
                }
            }
            else {
                if (args.isUndo) {
                    this.removeLabels(node.name, [args.label]);
                }
                else {
                    this.addLabel(node.name, args.label);
                }
                this._raisePropertyChange({ element: node, cause: ej.datavisualization.Diagram.ActionType.Unknown, propertyName: "labels", oldValue: prtyLabels, newValue: node.labels });
            }

        },
        _recordGroupChanged: function (args) {
            var actionType = args.actionType;
            if (args.isUndo) {
                if (args.actionType === "group")
                    actionType = "ungroup";
                if (args.actionType === "ungroup")
                    actionType = "group";
            }
            this._clearSelection(actionType == "group" ? true : false);
            var selectionList = this._getChildren(args.object.children);
            if (actionType === "group") {
                var group = new ej.datavisualization.Diagram.Group(args.object);
                group.children = [];
                for (i = 0; i < selectionList.length; i++) {
                    var childNode = this.nameTable[selectionList[i]];
                    group.children.push(childNode);
                    ej.datavisualization.Diagram.Util.removeItem(this.nodes(), childNode);
                    if (childNode.parent)
                        oldParent = this.nameTable[childNode.parent];
                    childNode.parent = group.name;
                    var groupElement = this._svg.document.getElementById(selectionList[i]);
                    if (groupElement)
                        groupElement.parentNode.removeChild(groupElement);
                    if (childNode.parent)
                        newParent = this.nameTable[childNode.parent];
                    this._raiseGroupChangeEvent(childNode, oldParent, newParent, "group");
                }
                //group.name = args.object.name;
                this._eventCause["nodeCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange;
                this.add(group);
                this._addSelection(group);
            }
            else {
                var i, node, oldParent, newParent;
                node = args.object;
                var groupElement = this._svg.document.getElementById(node.name);
                if (groupElement)
                    groupElement.parentNode.removeChild(groupElement);
                var nodeChildren = this._getChildren(node.children);
                for (i = 0; i < nodeChildren.length; i++) {
                    var childNode = this.nameTable[nodeChildren[i]];
                    if (childNode.parent)
                        oldParent = this.nameTable[childNode.parent];
                    childNode.parent = "";
                    this._isUndo = true;
                    if (!childNode.segments) {
                        if (childNode._type == "group")
                            ej.datavisualization.Diagram.DiagramContext.renderGroup(childNode, this);
                        else
                            ej.datavisualization.Diagram.DiagramContext.renderNode(childNode, this);
                        if (this.nodes().indexOf(childNode) === -1) {
                            this.nodes().push(childNode);
                            this._nodes = $.extend(true, [], this.nodes());
                        }
                    }
                    if (childNode.segments) {
                        ej.datavisualization.Diagram.DiagramContext.renderConnector(childNode, this);
                        if (this.connectors().indexOf(childNode) === -1) {
                            this.connectors().push(childNode);
                            this._connectors = $.extend(true, [], this.connectors());
                        }
                    }
                    this._isUndo = false;
                    this._nodes = $.extend(true, [], this.nodes());
                    if (childNode.parent)
                        newParent = this.nameTable[childNode.parent];
                    this._raiseGroupChangeEvent(childNode, oldParent, newParent, "ungroup");
                }
                this._removeElement(node);
                ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this._findNode(node.name));
                this._nodes = $.extend(true, [], this.nodes());
            }
        },

        _recordNudgingChanges: function (obj, entryItem, isRedo) {
            this._isUndo = true;
            var direction = entryItem.undoDirection;
            if (isRedo)
                direction = entryItem.redoDirection;
            this._clearSelection(true);
            if (obj.type === "pseudoGroup") {
                var pseudoGroup = ej.datavisualization.Diagram.Group(obj);
                delete this.nameTable[pseudoGroup.name];
                this.nameTable[pseudoGroup.name] = obj;
            }
            this._addSelection(obj._type == "label" ? obj : this.nameTable[obj.name], true);
            this.nudge(direction, entryItem.values);
            this._isUndo = false;
        },

        _recordPropertiesChanged: function (node, options, type, object) {
            var currentState = this._getModifiedProperties((type == "port" || type == "label") ? object : node, options);
            if (currentState && Object.keys(currentState).length) {
                if (type == "connector") {
                    if (options.sourcePoint || options.sourceNode) {
                        currentState.sourcePoint = node.sourcePoint;
                        currentState.sourceNode = node.sourceNode;
                        currentState.sourcePort = node.sourcePort;
                    }
                    if (options.targetPoint || options.targetNode) {
                        currentState.targetNode = node.targetNode;
                        currentState.targetPort = node.targetPort;
                        currentState.targetPoint = node.targetPoint;
                    }
                }
                var entry = { type: "propertiesChanged", values: currentState, category: "internal", object: node, elementType: type, updateValues: options };
                entry[type] = object;
                this.addHistoryEntry(entry);
            }
        },
        _recordAlignCommandChanges: function (entryItem) {
            if (entryItem && entryItem.values.length) {
                this._associatedConnectorsUpdate = true;
                for (var i = 0; i < entryItem.values.length; i++) {
                    var obj = entryItem.values[i];
                    if (obj.object && obj.delta) {
                        var current = { x: -obj.delta.x, y: -obj.delta.y };
                        var child = this.nameTable[this._getChild(obj.object)];
                        this._comparePropertyOnAlign(child, -obj.delta.x, -obj.delta.y);
                        this._translate(child, -obj.delta.x, -obj.delta.y, this.nameTable);
                        this._updateContainerOnNudge(child);
                        obj.delta = current;
                        this._updateObject(child);
                    }
                }

                delete this._associatedConnectorsUpdate;

                for (i = 0; i < entryItem.values.length; i++) {
                    var node = this.nameTable[this._getChild(entryItem.values[i].object)];
                    if (!node.segments) {
                        this._updateAssociateConnector(node)
                    }
                }
                if (!this.nameTable[entryItem.object.name]) this.nameTable[entryItem.object.name] = entryItem.object;
                ej.datavisualization.Diagram.Util._updateGroupBounds(entryItem.object, this);
                if (this._hasSelection())
                    ej.datavisualization.Diagram.SvgContext.updateSelector(entryItem.object, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                else
                    this.addSelection(entryItem.object, true);
            }
        },
        _recordPhaseCollectionChanged: function (entryItem) {
            if (entryItem.undo) {
                if (entryItem.isAdded) {
                    if (entryItem.phase)
                        this._removePhase(entryItem.phase.name);
                }
                else {
                    if (entryItem.phase) {
                        this._addPhase(entryItem.group, entryItem.phase, entryItem);
                    }
                }
            }
            else {
                if (entryItem.isAdded) {
                    if (entryItem.phase) {
                        this._addPhase(entryItem.group, entryItem.phase, entryItem);
                    }
                }
                else {
                    if (entryItem.phase)
                        this._removePhase(entryItem.phase.name);
                }
            }
            this._clearSelection(true)
        },
        _recordSizeCommandChanges: function (entryItem) {
            if (entryItem && entryItem.values.length) {
                for (var i = 0; i < entryItem.values.length; i++) {
                    var obj = entryItem.values[i];
                    if (obj.object && obj.values) {
                        var current = { width: obj.object.width || obj.object._width || 0, height: obj.object.height || obj.object._height || 0 };
                        var child = this.nameTable[this._getChild(obj.object)];
                        this._comparePropertyValues(child, "height", { height: obj.values.height });
                        this._comparePropertyValues(child, "width", { width: obj.values.width });
                        this.scale(child, obj.values.width / (child.width || child._width || 0),
                            obj.values.height / (child.height || child.height || 0),
                          { x: child.offsetX, y: child.offsetY }, this.nameTable);
                        obj.values = current;
                        this._updateObject(child);
                    }
                }
                if (!this.nameTable[entryItem.object.name] && entryItem.object.type == "pseudoGroup") this.nameTable[entryItem.object.name] = entryItem.object;
                ej.datavisualization.Diagram.Util._updateGroupBounds(entryItem.object, this);
                if (this._hasSelection())
                    ej.datavisualization.Diagram.SvgContext.updateSelector(entryItem.object, this._adornerSvg, this._currZoom, this, this.model.selectedItems.constraints);
                else
                    this.addSelection(entryItem.object, true);
            }
        },
        _getModifiedProperties: function (node, options, object) {
            object = object || node;
            if (options && Object.keys(options).length && object) {
                var current = {};
                for (var prop in options) {
                    if (options[prop] != object[prop] || typeof object[prop] == "object") {
                        if (object[prop] && object[prop] instanceof Array)
                            current[prop] = object[prop];
                        else if (object[prop] && typeof object[prop] == "object")
                            current[prop] = $.extend(true, {}, object[prop]);
                        else
                            current[prop] = object[prop];
                    }
                }
                return current;
            }
        },
        _addCollectionChangeToHistory: function (node) {
            if (node.parent == "") {
                var childTable = {};
                if (this.selectionList && this.selectionList.length > 0)
                    childTable = this._getChildTable(this.selectionList[0], childTable);
                var entry = { type: "collectionchanged", object: jQuery.extend(true, {}, node), childTable: jQuery.extend(true, {}, childTable), changeType: "insert", category: "internal" };
                this.addHistoryEntry(entry);
            }
        },
        _recordPhasesizeChanged: function (args) {
            var undoObject = $.extend(true, {}, args.undoObject);
            var redoObject = $.extend(true, {}, args.redoObject);
            if (args.undo) {
                this._updatePhase({ name: undoObject.name, offset: undoObject.offset })
            }
            else {
                this._updatePhase({ name: redoObject.name, offset: redoObject.offset })
            }
        },
        _recordPortsCollectionChanged: function (args) {
            var changeType = args.changeType;
            if (args.isUndo) {
                if (args.changeType == "insert")
                    changeType = "remove";
                else
                    changeType = "insert";
            }
            var node = this.nameTable[args.object.name];
            if (changeType == "remove") {
                for (var i = 0; i < args.collection.length; i++) {
                    this._updatePortConnection(node, node.inEdges, args.collection[i]);
                    this._updatePortConnection(node, node.outEdges, args.collection[i]);
                    ej.datavisualization.Diagram.Util.removeItem(node.ports, args.collection[i]);
                    for (var j = 0; j < this._views.length; j++) {
                        var view = this._views[j];
                        var element = this._views[view].svg.document.getElementById(node.name + "_" + args.collection[i].name);
                        if (element)
                            element.parentNode.removeChild(element);
                    }
                }
            }
            else {
                for (var i = 0; i < args.collection.length; i++) {
                    node.ports.push(args.collection[i]);
                    ej.datavisualization.Diagram.DiagramContext.renderPort(node, args.collection[i], this);
                    if (args.collection[i]._removeLine) {
                        var lineName = args.collection[i]._removeLine, line;
                        if (lineName) {
                            line = this.nameTable[lineName];
                            if (line && (args.collection[i]._removeFromSourcePort || args.collection[i]._removeFromTargetPort)) {
                                if (args.collection[i]._removeFromSourcePort)
                                    line.sourcePort = args.collection[i].name;
                                if (args.collection[i]._removeFromTargetPort)
                                    line.targetPort = args.collection[i].name;
                                this._dock(line, this.nameTable);
                                ej.datavisualization.Diagram.DiagramContext.update(line, this);
                            }
                        }

                    }
                }
            }
        },

        //#endregion
        //#region Helper methods
        _initLaneContaier: function (element) {
            if (element.isLane) {
                element = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, element);
            }
            return element;
        },
        _addSymbolToDiagram: function (evt) {
            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var scale = this._currZoom;
                var offset = $("#" + this.element[0].id).offset();
                var coor = this._isTouchEvent(evt);
                if (!coor.pageX && !evt.pageX) {
                    if (evt.originalEvent && evt.originalEvent.changedTouches) {
                        coor = evt.originalEvent.changedTouches[0];
                    }
                    else if (evt && evt.changedTouches) {
                        coor = evt.changedTouches[0];
                    }
                }
                var x = (coor ? coor.pageX : evt.pageX) + this._hScrollOffset - offset.left;
                var y = (coor ? coor.pageY : evt.pageY) + this._vScrollOffset - offset.top;
                var paletteItem = $.extend(true, {}, this._selectedSymbol);
                var element;
                if (this._selectedSymbol) {
                    element = paletteItem;
                    if (!this._isNodeEnters) {
                        if (element && element.type != "pseudoGroup")
                            paletteItem.name += ej.datavisualization.Diagram.Util.randomId();
                        if (paletteItem.segments) {
                            ej.datavisualization.Diagram.Util._translateLine(paletteItem, x / scale, y / scale);
                        }
                        else {
                            this._cloneGroupNode(paletteItem, ej.datavisualization.Diagram.Util.randomId());
                            if (paletteItem._type === "group") {
                                var cBound = ej.datavisualization.Diagram.Util._getChildrenBounds(paletteItem, this);
                                ej.datavisualization.Diagram.Util._translate(paletteItem, (x / scale - cBound.x - cBound.height / 2), (y / scale - cBound.y - cBound.width / 2), this.nameTable, null, this);
                            } else {
                                paletteItem.offsetX = x / scale;
                                paletteItem.offsetY = y / scale;
                            }
                            if (paletteItem.isLane) {
                                var obj = ej.datavisualization.Diagram.SwimLaneHelper._createDiagramLane(paletteItem, this.nameTable);
                                obj.isLane = paletteItem.isLane;
                                obj.orientation = paletteItem.orientation;
                                element = obj;
                            }
                            if (paletteItem.type == "bpmn") delete element.children;
                        }
                    } else if (element.isSwimlane) {
                        this.nameTable[element.name] = element;
                        element = ej.datavisualization.Diagram.ContainerHelper._initContainer(this, element, { childTable: this.childTable, object: element });
                        this._addAssiciatedChildConnectors(element);
                    }
                    if (element) {
                        var args = { element: element, target: this, targetType: "diagram" };
                        this._raiseEvent("dragEnter", args);
                        if (!args.cancel) {
                            if (this._isEditing) {
                                this._endEditing = true;
                                this._endEdit();
                                delete this._endEditing;
                            }
                            if (element && !this._isNodeEnters) {
                                element = this._initLaneContaier(element);
                            }
                            if (element.type != "pseudoGroup") {
                                if (element.isLane) {
                                    this.nameTable[this._getChild(element.children[0])]._isHeader = true;
                                }
                                this.add(element);
                            }
                            else {
                                for (var k = 0; k < element.children.length; k++) {
                                    this.add(element.children[k]);
                                    element.children[k] = element.children[k].name;
                                }
                                for (var conn in this.edgeTable) if (!this.nameTable[conn]) this.add(this.edgeTable[conn]);
                                if (this._hasSelection()) this._clearSelection(true);
                                this.nodes().push(element);
                                this._nodes = $.extend(true, [], this.nodes());
                                this.nameTable[element.name] = element;
                                ej.datavisualization.Diagram.Util._updateGroupBounds(element, this);
                                this.addSelection(element, true);
                            }
                            this._focusedElement = element;
                            if (element.isLane)
                                ej.datavisualization.Diagram.SvgContext._hideNode(element, this._svg);
                            this.element[0].focus();
                            this._toolToActivate = "move";
                            if (document.getElementsByClassName("e-paletteItem dragClone")[0]) {
                                $(".e-paletteItem.dragClone").css("display", "none");
                            }
                            this.activateTool("move", false);
                            this._symbolDrop = true;
                            this.activeTool.mousedown(evt);
                            this.activeTool.mousemove(evt);
                        }
                    }
                }
            }
            delete this._symbolDrop;
        },
        _removeSymbolFromDiagram: function () {
            if (this._selectedSymbol) {
                var displays = document.getElementsByClassName("e-paletteItem dragClone")[0];
                if (displays != null) {
                    displays.style.display = "block";
                }
                this._remove(this.selectionList[0]);
                this._selectedSymbol = null;
            }
        },
        _updateGroupChild: function (group) {
            var children = group.children;
            for (var i = 0; i < group.children.length; i++) {
                group.children[i] = this.nameTable[this._getChild(group.children[i])];
                if (group.children[i] && group.children[i]._type === "group") {
                    this._updateGroupChild(group.children[i]);
                }
            }
        },
        _dropSymbol: function (object, evt) {
            if (ej.datavisualization.Diagram.Util.isPageEditable(this)) {
                var actualObject = object || this.selectionList[0] || this.activeTool.selectedObject;
                var args = { element: this.getNode(actualObject) };
                if (this._nodeUnderMouse) {
                    args.target = this._nodeUnderMouse;
                }
                var added = false;
                if (!args.target) args.target = this.model;
                if (actualObject && actualObject._type === "group")
                    this._updateGroupChild(actualObject);
                this._remove(actualObject);
                this.nameTable[args.element.name] = args.element;
                this._selectedSymbol = null;
                var newElement = object || args.element;
                var overNode = this.activeTool._getMouseOverElement(evt);
                if (this.activeTool._outOfBoundsDrag(newElement) && ej.datavisualization.Diagram.canvasHelper._outOfBoundaryNodeDrop(this, this.activeTool.selectedObject, overNode)) {


                    this._raiseDropEvent(args);



                    if (!args.cancel) {
                        this._isInsert = true;
                        this._containerOverNode = null;
                        if (overNode && overNode.container && ej.datavisualization.Diagram.Util.canAllowDrop(overNode) && !overNode.isSwimlane && ej.datavisualization.Diagram.bpmnHelper.canAllowDropOnContainer(this.activeTool.selectedObject, overNode)) {
                            if (this.getObjectType(newElement) !== "connector") {
                                newElement.parent = overNode.name;
                                this._containerOverNode = overNode;
                            }
                        }
                        this._eventCause["nodeCollectionChange"] = this._eventCause["connectorCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.Drop;
                        added = this.add(newElement);
                        delete this._containerOverNode;
                        this.activeTool.selectedObject = this.selectionList[0];
                        this._isInsert = false;

                    }
                    if (added) {
                        var node = this.nameTable[args.element.name];
                        this._updateDroppedSymbol(node);
                    }
                    else
                        this.activeTool.selectedObject = null;
                }
                else {
                    this.activeTool.selectedObject = null;
                    delete this.nameTable[args.element.name];
                    this._clearSelection(true);
                }
                if (!ej.datavisualization.Diagram.Util.canDoSingleSelection(this)) {
                    this._clearSelection(true);
                    if (this.tool() & ej.datavisualization.Diagram.Tool.ZoomPan) {
                        this.activateTool("panTool");
                    }
                }
            }
        },
        _updateDroppedSymbol: function (node) {
            if (node && this.selectionList.length > 0) {
                this.scrollToNode(node);
                if ((node.labels.length > 0 && node.labels[0].mode === "edit") && !node.labels[0].readOnly) {
                    if (!node.isPhase && !(node.isSwimlane || node.isLane)) {
                        if (node.type !== "umlclassifier") {
                            this._isEditing = true;
                            this.startLabelEdit(node, node.labels[0]);
                        }
                    }
                } else {
                    this.element[0].focus();
                }
                if (this._nodeUnderMouse && this._nodeUnderMouse.segments) {
                    ej.datavisualization.Diagram.SvgContext._removeConnectorHighlighter(this._adornerLayer, this._adornerSvg);
                }
            }
        },
        _initiateAutoScroll: function (evt) {
            if (this.activeTool.inAction && this.enableAutoScroll() && !(this.activeTool instanceof ej.datavisualization.Diagram.RotateTool)) {
                var viewPort = this._viewPort;
                var pt = this._mousePosition(evt, true);
                var autoScrollBorder = this.model.pageSettings.autoScrollBorder;
                var rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(this);
                if (pt.x + autoScrollBorder.right - rulerSize.left >= viewPort.width - 18) {
                    this._beginAutoScroll("right", evt);
                    this._canAutoScroll = true;
                }
                else if (pt.x <= (autoScrollBorder.left + rulerSize.left)) {
                    this._beginAutoScroll("left", evt);
                    this._canAutoScroll = true;
                }
                else if (pt.y + autoScrollBorder.bottom + rulerSize.top >= viewPort.height - 18) {
                    this._beginAutoScroll("bottom", evt);
                    this._canAutoScroll = true;
                }
                else if (pt.y <= autoScrollBorder.top + rulerSize.top) {
                    this._beginAutoScroll("top", evt);
                    this._canAutoScroll = true;
                }
                else {
                    this._canAutoScroll = false;
                }
            }
        },
        _updatePoints: function (helper, startPoint, endPoint, isTarget) {
            var offset = new ej.datavisualization.Diagram.Point(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
            if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(offset)) {
                helper._updateEndPoint(offset.x, offset.y, isTarget);
            }
        },
        _cloneGroupNode: function (node, id, nameTable) {
            var child = null, clnObj;
            var children = node.children = this._getChildren(node.children);
            if (node._type === "group") {
                for (var i = 0; i < children.length; i++) {
                    if (nameTable)
                        child = nameTable[children[i]];
                    else {
                        if (this._paletteTable)
                            child = this._paletteTable[children[i]];
                    }
                    if (child) {
                        child = $.extend(true, {}, child);
                        if (child._type === "group")
                            this._cloneGroupNode(child, id);
                        clnObj = $.extend(true, {}, child);
                        clnObj.name += id;
                        clnObj.parent = node.name;
                        children[i] = clnObj.name;
                        this.nameTable[clnObj.name] = clnObj;
                    }
                }
            }
        },
        _addGroupConnector: function (group, arg) {
            var edges;
            var connector;
            var k, j, len, l;
            if (!group.segments) {
                var children = this._getChildren(group.children);
                for (k = 0; k < children.length; k++) {
                    var child = this.nameTable[children[k]];
                    if (child) {
                        if (child.inEdges && child.inEdges.length > 0) {
                            edges = child.inEdges;
                            for (j = 0, len = edges.length; j < len; j++) {
                                if (arg.edgeTable)
                                    connector = arg.edgeTable[edges[j]];
                                else
                                    connector = arg.childTable[edges[j]];
                                if (connector && !this.nameTable[connector.name])
                                    this.add(connector);
                            }
                        }
                        if (child.outEdges && child.outEdges.length > 0) {
                            edges = child.outEdges;
                            for (j = 0, len = edges.length; j < len; j++) {
                                if (arg.edgeTable)
                                    connector = arg.edgeTable[edges[j]];
                                else
                                    connector = arg.childTable[edges[j]];
                                if (connector && !this.nameTable[connector.name])
                                    this.add(connector);
                            }
                        }
                    }
                }
            }
        },
        _addConnector: function (node, arg) {
            var edges;
            var connector;
            var k, j, len, l;
            if (!node.segments) {
                if (node.inEdges && node.inEdges.length > 0) {
                    edges = node.inEdges;
                    for (j = 0, len = edges.length; j < len; j++) {
                        connector = arg ? arg.edgeTable[edges[j]] : this.nameTable[edges[j]];
                        connector.zOrder = -1;
                        this.add(connector);
                    }
                }
                if (node.outEdges && node.outEdges.length > 0) {
                    edges = node.outEdges;
                    for (j = 0, len = edges.length; j < len; j++) {
                        connector = arg ? arg.edgeTable[edges[j]] : this.nameTable[edges[j]];
                        connector.zOrder = -1;
                        this.add(connector);
                    }
                }
            }
        },
        _addChildren: function (group, childTable) {
            var children = this._getChildren(group.children);
            for (var i = 0; i < children.length; i++) {
                var node = childTable[children[i]];
                if (node._type === "group")
                    this._addChildren(node, childTable);
                this.nameTable[children[i]] = node;
                group.children[i] = node;
            }
        },
        _updateLabels: function (node, labels) {
            node.labels = labels;
            for (var i = 0; i < node.labels.length; i++)
                ej.datavisualization.Diagram.DiagramContext.updateLabel(node, node.labels[i], this);
        },
        _getNode: function (name, childTable) {
            if (!childTable)
                var node = typeof (name) === "object" ? this.nameTable[name.name] : this.nameTable[name];
            else var node = typeof (name) === "object" ? childTable[name.name] : childTable[name];
            if (!node && typeof (name) === "object") {
                node = name;
            }
            else if (node && typeof (name) === "string") {
                node = childTable ? childTable[name] : this.nameTable[name];
            }
            if (node) {
                if (node.isLane) {
                    return ej.datavisualization.Diagram.SwimLaneHelper._mapObject(this, node, "lane")
                }
                else if (node.isPhase || node.type === "phase") {
                    return ej.datavisualization.Diagram.SwimLaneHelper._mapObject(this, node, "phase")
                }
                else if (node.isSwimlane) {
                    return ej.datavisualization.Diagram.SwimLaneHelper._mapObject(this, node, "swimlane", childTable)
                }
                else if (node._type === "node" || node._type === "group" || node._type === "pseudoGroup" || this.getObjectType(node) == "node") {
                    return node;
                }
                    //else if (node.shape) {
                    //    return this._getNewNode(node);
                    //}
                    //else if (node.segments) {
                    //    return this._getNewConnector(node);
                    //}
                else
                    return node;
            }
            return null;
        },
        _updateEdges: function (connector) {
            var node;
            if (ej.datavisualization.Diagram.Util.isTargetConnected(connector)) {
                node = this.nameTable[connector.targetNode];
                if (node && node.inEdges.indexOf(connector.name) == -1)
                    node.inEdges.push(connector.name);
            }
            if (ej.datavisualization.Diagram.Util.isSourceConnected(connector)) {
                node = this.nameTable[connector.sourceNode];
                if (node && node.outEdges.indexOf(connector.name) == -1)
                    node.outEdges.push(connector.name);
            }
        },
        _updateChildrenEdges: function (object) {
            var children = this._getChildren(object.children);
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.segments) {
                    this._updateEdges(child);
                    this._dock(child, this.nameTable);
                }
                else if (child._type === "group") {
                    this._updateChildrenEdges(child);
                }
            }
        },
        _updateParent: function (object) {
            var children = this._getChildren(object.children);
            for (var i = 0; i < children.length; i++) {
                var index = this.nodes().indexOf(this.nameTable[children[i]]);
                var child = this.nameTable[children[i]];
                child = (child.type != "bpmn" && child.type != "connector") ? this._getNewNode(child) : child;
                if (child && child._type === "group") {
                    this._updateParent(child);
                }
                else if (child) {
                    child.parent = object.name;
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[child.name], this.nameTable[child.name]);
                    ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, this.nameTable[child.name]);
                    this.nameTable[child.name] = child;
                    if (index != -1) {
                        this.nodes()[index] = child;
                    }
                }
                this._updateQuad(this.nameTable[child.name]);
            }
        },
        _findPortAtPoint: function (point, node) {
            var ports;
            var port;
            var location;
            var size, pt, x, y;
            var bounds;
            if (node) {
                bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                ports = node.ports;
                var matrix;
                for (var i = 0, len = ports.length; i < len; ++i) {
                    port = ports[i];
                    size = ej.datavisualization.Diagram.Size(port.size, port.size);
                    pt = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds);
                    matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                    pt = ej.Matrix.transform(matrix, pt);
                    x = pt.x - port.size / 2;
                    y = pt.y - port.size / 2;
                    location = ej.datavisualization.Diagram.Rectangle(x, y, size.width, size.height);
                    if (ej.datavisualization.Diagram.Geometry.containsPoint(location, point)) {
                        return ej.datavisualization.Diagram.Util.canConnect(port, true) ? port : null;
                    }
                    else {
                        if (this.portHighlight) {
                            location = ej.datavisualization.Diagram.Rectangle(x - 1, y - 1, size.width + 1, size.height + 1);
                            if (ej.datavisualization.Diagram.Geometry.containsPoint(location, point)) {
                                return ej.datavisualization.Diagram.Util.canConnect(port, true) ? port : null;
                                delete this.portHighlight;
                            }
                        }
                    }
                }
            }
            return null;
        },
        _findLabelAtPoint: function (point, node) {
            var labels, label = null;
            var location;
            var size, pt, x, y, width, height, tempPt;
            var bounds, textElement, matrix;
            var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
            var intersectingLabels = [];
            if (node && this.model.labelRenderingMode !== ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                labels = node.labels;
                if (labels && labels.length > 0) {
                    label = labels[0];
                    for (var i = 0, len = labels.length; i < len; i++) {
                        label = labels[i];
                        textElement = $(htmlLayer).find("#" + node.name + "_" + label.name)[0];

                        width = textElement ? textElement.offsetWidth : 0;
                        height = textElement ? textElement.offsetHeight : 0;
                        if (!width) width = bounds.width;
                        if (!height) height = label.fontSize;
                        size = ej.datavisualization.Diagram.Size(width, height);
                        pt = ej.datavisualization.Diagram.Util._getLabelPosition(label, bounds);
                        pt.x = bounds.x + pt.x;
                        pt.y = bounds.y + pt.y;
                        matrix = ej.Matrix.identity();
                        if (!node.segments) ej.Matrix.rotate(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
                        else ej.Matrix.rotate(matrix, 0, bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
                        tempPt = ej.Matrix.transform(matrix, point);
                        matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, -label.rotateAngle, pt.x, pt.y);
                        tempPt = ej.Matrix.transform(matrix, tempPt);

                        if (label.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Top) pt.y += size.height / 2;
                        else if (label.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Bottom) pt.y -= size.height / 2;

                        if (label.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Left) pt.x += size.width / 2;
                        else if (label.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Right) pt.x -= size.width / 2;

                        x = pt.x - size.width / 2;
                        y = pt.y - size.height / 2;
                        location = ej.datavisualization.Diagram.Rectangle(x, y, size.width, size.height);
                        if (ej.datavisualization.Diagram.Geometry.containsPoint(location, tempPt))
                            intersectingLabels.push(label);
                        if (i == labels.length - 1)
                            return (intersectingLabels.length ? intersectingLabels[intersectingLabels.length - 1] : null);
                    }
                }
            }
            return label;
        },
        _getCurrentZoom: function () {
            return this._currZoom;
        },
        _findNode: function (id) {
            return this.nameTable[id];
        },
        _findPort: function (node, portId) {
            var ports = node.ports;
            for (var i = 0, len = ports.length; i < len; i++) {
                if (ports[i].name === portId) {
                    return ports[i];
                }
            }
            return null;
        },
        _findLabel: function (node, labelId) {
            var labels = node.labels;
            for (var i = 0, len = labels.length; i < len; i++) {
                if (labels[i].name === labelId) {
                    return labels[i];
                }
            }
            return null;
        },
        _findLabelRotateAngle: function (label) {
            var node = this.findNode(label._parent);
            var rotateAngle = 0;
            if (node) {
                if (node.segments)
                    rotateAngle = label.rotateAngle;
                else
                    rotateAngle = label.rotateAngle + node.rotateAngle;
                if (rotateAngle > 360) {
                    rotateAngle %= 360;
                }
            }
            return rotateAngle;
        },
        _findConnector: function (id) {
            return this.nameTable[id];
        },
        _findChildren: function (group, name) {
            var child, innerchild;
            var children = this._getChildren(group.children);
            for (var i = 0; i < children.length; i++) {
                child = this.nameTable[children[i]];
                if (child) {
                    if (name == child.name) {
                        return child;
                    }
                    if (child._type === "group") {
                        innerchild = this._findChildren(child, name);
                        if (innerchild) return innerchild;
                    }
                }
            }
            return null;
        },
        _removeLaneParent: function (node) {
            var swimlane, i, parentCollection = [], laneStack, stack, child = [];
            var uniqueParent = [], j, k, count = 0, selectLane = false, selectedNode = [], parentNode, pseudoGroup;
            if (node.isLane && node.parent) {
                stack = this.nameTable[node.parent];
                if (stack.children && stack.children.length === 1) {
                    if (stack && stack.parent) {
                        var swimlane = this.nameTable[stack.parent];
                        if (swimlane) {
                            return { remove: true, node: swimlane };
                        }
                    }
                }
            }
            else if (node._type == "pseudoGroup") {
                for (i = 0; i < node.children.length; i++) {
                    child[i] = this.nameTable[node.children[i]];
                    if (child[i] && child[i].isLane && child[i].parent) {
                        parentCollection[i] = child[i].parent;
                        selectLane = true;
                    }
                    else
                        selectedNode.push(child[i]);
                }
                if (this.isSameParent(parentCollection) && (parentCollection.length == node.children.length)) {
                    laneStack = this.nameTable[parentCollection[0]];
                    if (laneStack.children.length == parentCollection.length) {
                        swimlane = this.nameTable[laneStack.parent];
                        if (swimlane && swimlane.isSwimlane) {
                            return { remove: true, node: swimlane };
                        }
                    }
                }
                else if (selectLane) {
                    pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                    uniqueParent = parentCollection.filter(function (item, index, inputArray) {
                        return inputArray.indexOf(item) == index;
                    });
                    for (i = 0; i < uniqueParent.length; i++) {
                        count = 0;
                        for (j = 0; j < parentCollection.length; j++) {
                            if (uniqueParent[i] == parentCollection[j])
                                count++;
                        }
                        parentNode = this.nameTable[uniqueParent[i]];
                        if (count && parentNode && parentNode.children && parentNode.children.length == count) {
                            swimlane = this.nameTable[parentNode.parent];
                            if (swimlane && swimlane.isSwimlane)
                                pseudoGroup.children.push(swimlane);
                        }
                        else if (count) {
                            for (k = 0; k < node.children.length; k++) {
                                child = this.nameTable[node.children[k]];
                                if (child.parent == uniqueParent[i])
                                    pseudoGroup.children.push(child);
                            }
                        }
                    }
                    if (selectedNode.length > 0) {
                        for (k = 0; k < selectedNode.length; k++)
                            pseudoGroup.children.push(selectedNode[k]);
                    }
                    if (pseudoGroup && pseudoGroup.children.length > 1) {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this);
                        return { remove: true, node: pseudoGroup };
                    }
                }
            }
            return { remove: false }
        },
        _delete: function (node) {

            var clearSelection = false;
            var child, lane, pseudoGroup, children, obj, i, removeParent, swimChild, isMultipleLane = false;
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                node = node || this.selectionList[0];
                if (node) {
                    if (!node.isPhase && ((node.type && node.type != "phase") || node.segments || node._type == "node" || node._type == "pseudoGroup") || this._dropPhase) {
                        removeParent = this._removeLaneParent(node)
                        if (removeParent.remove) {
                            node = removeParent.node;
                        }
                        obj = node;
                        if (obj.type == "pseudoGroup") {
                            for (i = 0; i < obj.children.length; i++) {
                                lane = (typeof obj.children[i] == "object") ? obj.children[i].name : obj.children[i];
                                child = this.findNode(lane);
                                if (child && child.parent) {
                                    if (child.isLane) {
                                        child._laneIndex = this._getRemoveIndex(child);
                                        isMultipleLane = true;
                                    }
                                }
                            }
                        }

                        if (obj.type == "pseudoGroup" && (isMultipleLane)) {
                            pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                            children = this._getChildren(obj.children);
                            this._multipleAction = true;
                            for (i = children.length - 1; i >= 0; i--) {
                                child = this.nameTable[children[i]];
                                if (child.isLane && child.parent) {
                                    removeParent = this._removeLaneParent(child)
                                    swimChild = removeParent.remove ? removeParent.node : child;
                                }
                                else swimChild = child;
                                if (swimChild)
                                    pseudoGroup.children.push(swimChild);
                            }
                            if (isMultipleLane)
                                pseudoGroup._isMultipleLaneDelete = true;
                            if (pseudoGroup && pseudoGroup.children.length > 0) {
                                ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this);
                                if (!this._selectedSymbol) this._removeAdjacentConnections(pseudoGroup);
                            }
                            children = pseudoGroup.children;
                            for (i = children.length - 1; i >= 0; i--) {
                                child = (typeof children[i] == "object") ? children[i] : this.nameTable[children[i]];
                                this._isUndo = false;
                                clearSelection = this._remove(child);
                                this._isUndo = true;
                            }
                            delete this._multipleAction;
                            this._isUndo = false;
                        }
                        else if (obj._type == "pseudoGroup") {
                            for (i = 0; i < node.children.length; i++) {
                                node.children[i] = (typeof node.children[i] == "object") ? node.children[i].name : node.children[i];
                            }
                            if (!this._selectedSymbol) this._removeAdjacentConnections(node);
                            children = this._getChildren(obj.children);
                            this._multipleAction = true;
                            for (i = children.length - 1; i >= 0; i--) {
                                if (this._remove(this.nameTable[children[i]]))
                                    clearSelection = true;
                                this._isUndo = true;
                            }
                            delete this._multipleAction;
                            this._isUndo = false;
                        }
                        else {
                            if (!this._selectedSymbol) this._removeAdjacentConnections(node);
                            if (this._nodeUnderMouse === obj)
                                this._nodeUnderMouse = null;
                            clearSelection = this._remove(obj);
                            if (obj.container && obj.parent) {
                                var parent = this.nameTable[obj.parent];
                                if (parent && parent.container) {
                                    if (parent.container.type == "stack") {
                                        if (this._getChild(parent.children[0])) {
                                            var swimlane = this._getSwimlane(obj);
                                            if (swimlane)
                                                this._updateChildAdjacentConnectors(swimlane, true);
                                            ej.datavisualization.Diagram.DiagramContext.update(parent, this);
                                        } else {
                                            var prePar = this.nameTable[parent.parent];
                                            if (prePar) {
                                                this._remove(prePar);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (clearSelection)
                            this._clearSelection();
                    }
                    else if (node.type && node.type == "phase") {
                        this._removePhase(node.name);
                        this._clearSelection();
                    }
                    this._removeNodeFromGraph(node);
                }
            }
        },

        _canUpdateOnGraph: function (node) {
            if (!node.parent)
                return true;
            return false;
        },
        _addNodeToGraph: function (node) {
            if (node.type !== "pseudoGroup" && ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (this._canUpdateOnGraph(node)) {
                    this._setBounds(node);
                }
            }
        },
        _updateNodeFromGraph: function (node) {
            if (node.type !== "pseudoGroup" && ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (this._canUpdateOnGraph(node)) {
                    this._setBounds(node);
                }
            }
        },
        _routeEdge: function (node) {
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (!this.activeTool.inAction)
                    this.lineRouting.routeEdge(node, this);
            }
        },
        _updateAllEdges: function (node) {
            if (ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (this.lineRouting) {
                    this.lineRouting.updateAllQuadObjects(this._spatialSearch.parentQuad);
                    this.lineRouting.RerouteConnectors(this, node);
                }
            }
        },
        _removeNodeFromGraph: function (node) {
            if (node.type !== "pseudoGroup" && ej.datavisualization.Diagram.Util.canRouteDiagram(this) && !this._checkFromSwimlane(node)) {
                if (this._canUpdateOnGraph(node)) {
                    this.lineRouting.RemoveNode(node);
                }
            }
        },

        _removeAdjacentConnections: function (node, entry) {
            var childTable = {};
            var edgeTable = {};
            childTable = this._getChildTable(node, childTable);
            edgeTable = this._getEdgeTable(node, edgeTable);
            if (!this._isUndo || entry) {
                var sourcePorts = {}, targetPorts = {}, connector, count, i;
                if (!node.segments) {
                    if (node.outEdges && node.outEdges.length > 0) {
                        count = node.outEdges.length;
                        for (i = 0; i < count; i++) {
                            connector = this.nameTable[node.outEdges[i]];
                            if (connector && connector.sourcePort)
                                sourcePorts[connector.name] = connector.sourcePort;
                        }
                    }
                    if (node.inEdges && node.inEdges.length > 0) {
                        count = node.inEdges.length;
                        for (i = 0; i < count; i++) {
                            connector = this.nameTable[node.inEdges[i]];
                            if (connector && connector.targetPort)
                                targetPorts[connector.name] = connector.targetPort;
                        }
                    }
                }
                if (!this._isUndo) {
                    var index = null;
                    if (node.isLane) {
                        index = this._getRemoveIndex(node);
                    }
                    var entry = { type: "collectionchanged", object: this._updatePsedoGroupChildren(node), index: index, childTable: jQuery.extend(true, {}, childTable), edgeTable: jQuery.extend(true, {}, edgeTable), sourcePorts: sourcePorts, targetPorts: targetPorts, changeType: "remove", category: "internal" };
                    if (!node.isPhase) {
                        if (ej.datavisualization.Diagram.Util.canDelete(node))
                            this.addHistoryEntry(entry);
                    }
                }
                else {
                    entry.targetPorts = targetPorts;
                    entry.sourcePorts = sourcePorts;
                    entry.edgeTable = edgeTable;
                    entry.childTable = childTable;
                }
            }
        },
        _updatePsedoGroupChildren: function (node) {
            var obj = jQuery.extend(true, {}, node), child;
            if (node && node.type == "pseudoGroup") {
                for (var i = 0; i < obj.children.length; i++) {
                    child = this.nameTable[this._getChild(obj.children[i])];
                    if (child && (child.isSwimlane || (child.isLane && node._isMultipleLaneDelete))) {
                        obj.children[i] = this.getNode(child);
                    }
                }
            }
            return obj;
        },
        _getRemoveIndex: function (lane, isReverse) {
            if (lane.parent) {
                var parent = this.nameTable[lane.parent], child;
                if (parent && parent.children && parent.children.length > 0) {
                    for (var i = 0; i < parent.children.length; i++) {
                        child = this._getChild(parent.children[i])
                        if (child === this._getChild(lane)) {
                            return Number(i);
                        }
                    }
                }
            }
            return 0;
        },
        _getSwimlaneHeader: function (group) {
            var header;
            if (group && group.isSwimlane) {
                if (group.children && group.children.length > 0) {
                    header = this.nameTable[this._getChild(group.children[0])];
                }
            }
            return header;
        },
        _addPhase: function (name, options, entryItem) {
            var group = this.nameTable[name];
            var excess = false;
            if (group && group.isSwimlane && options) {
                if (group && group.orientation && options.offset) {
                    if (group.orientation == "horizontal") {
                        var stoffset = group.offsetX - group.width / 2;
                        var laneHdr = this._getFirstLane(group);
                        if (laneHdr)
                            stoffset += laneHdr.width;
                        excess = ((options.offset > group.width) || (((group.offsetX - group.width / 2) + options.offset) < stoffset)) ? true : false;
                    }
                    else if (group.orientation == "vertical") {
                        stoffset = group.offsetY - group.height / 2;
                        var swlnhdr = this._getSwimlaneHeader(group);
                        if (swlnhdr)
                            stoffset += swlnhdr.height;
                        var laneHdr = this._getFirstLane(group);
                        if (laneHdr)
                            stoffset += laneHdr.height;
                        excess = (options.offset > group.height || (((group.offsetY - group.height / 2) + options.offset) < stoffset)) ? true : false;
                    }
                }
                if (options.offset && !excess) {
                    if (entryItem && entryItem.islastPhase) {
                        var itemPhase = entryItem.phase;
                        if (group.orientation === "horizontal") {
                            if (group.width > options.offset) {
                                options.width += (group.width - options.offset);
                                options.offset = group.width;
                            }
                        }
                        else {
                            if ((group.height - swlnhdr.height) > options.offset) {
                                options.height += ((group.height - swlnhdr.height) - options.offset);
                                options.offset = group.height - swlnhdr.height;
                            }
                        }
                    }
                    var phase = ej.datavisualization.Diagram.Phase(options);
                    phase.orientation = group.orientation;
                    phase.label = ej.datavisualization.Diagram.Label(options.label ? options.label : { text: "Phase" });
                    phase.parent = group.name;
                    if (this.nameTable[phase.name]) {
                        ej.datavisualization.Diagram.Util.removeItem(this.model.phases, this.nameTable[phase.name]);
                        delete this.nameTable[phase.name];
                    }
                    if (entryItem && entryItem.islastPhase) {
                        var index = this._getInsertIndex(phase) + 1;
                        var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, group);
                        var prevPhase = $.extend(true, {}, entryItem.phaseObject.prevPhase);
                        this._updateInsertPhase(phase, prevPhase.name, group, index, entryItem);
                        ej.datavisualization.Diagram.SvgContext.renderphase(phase, this._svg, this._diagramLayer, this, group);
                        ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, this.nameTable[this._getChild(group.children[1])], true);
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdatePhase(this, phase);
                    }
                    else {
                        var index = this._getInsertIndex(phase) + 1;
                        var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, group);
                        var prevPhase = $.extend(true, {}, this.nameTable[this._getChild(phases[index - 1])]);
                        this._updateInsertPhase(phase, phases[index], group, index);
                        ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                        ej.datavisualization.Diagram.SvgContext.renderphase(phase, this._svg, this._diagramLayer, this, group);
                        ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, this.nameTable[this._getChild(group.children[1])], true);
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdatePhase(this, phase);
                    }
                    if (!this._isUndo) {
                        var entry = { type: "phasecollectionchanged", phase: phase, category: "internal", group: group.name, isAdded: true };
                        this.addHistoryEntry(entry);
                    }
                }
            }
            this._clearSelection(true);
        },
        _removePhase: function (name, needDelete) {
            var phase = this.nameTable[name];
            var islastPhase = false;
            var phaseObject = null;
            if (phase) {
                this._raiseChildrenPropertyChange(phase);
                var parent = this.nameTable[phase.parent.split('phaseStack')[0]];
                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, parent);

                if (parent && phases && phases.length > 1) {
                    var diagram = this;
                    var index = phases.indexOf(phase.name);

                    this._views.forEach(function (viewid) {
                        var view = diagram._views[viewid];
                        var phaseEle = view.svg.getElementById(name + "_phase_g");
                        if (phaseEle)
                            phaseEle.parentNode.removeChild(phaseEle);
                    });
                    var nextPhase = ej.datavisualization.Diagram.SwimLaneContainerHelper._getNextPhase(this, phase);
                    if (index === phases.length - 1) {
                        nextPhase = ej.datavisualization.Diagram.SwimLaneContainerHelper._getPrevPhase(this, phase);
                        phaseObject = $.extend(true, {}, { prevPhase: nextPhase, currPhase: phase });
                        nextPhase.offset = phase.offset;
                        islastPhase = true;
                    }
                    if (parent.orientation === "horizontal")
                        nextPhase.width += phase.width;
                    else
                        nextPhase.height += phase.height;

                    var delNode = this.nameTable[name];
                    ej.datavisualization.Diagram.Util.removeItem(this.nodes(), delNode);
                    this._nodes = $.extend(true, [], this.nodes());
                    var stack = this.nameTable[delNode.parent];
                    delete this.nameTable[name];
                    ej.datavisualization.Diagram.SvgContext._updatephase(nextPhase, this);
                    ej.datavisualization.Diagram.Util.removeItem(phases, phase.name);
                    ej.datavisualization.Diagram.Util.removeItem(stack.children, delNode);
                    ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                    ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, stack, true);
                    ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdatePhase(this, phase);
                    var diagram = this;
                    this._views.forEach(function (viewid) {
                        var view = diagram._views[viewid];
                        var phaseEle = view.svg.getElementById(name);
                        if (phaseEle)
                            phaseEle.parentNode.removeChild(phaseEle);
                        var htmlLayer = view.svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                        var label = $(htmlLayer).find("#" + delNode.name + "_label")[0];
                        var element = view.svg.getElementById(delNode.name);
                        if (element && element.parentNode)
                            element.parentNode.removeChild(element);
                        if (label)
                            htmlLayer.removeChild(label);
                    });
                    if (!this._isUndo) {
                        var entry = { type: "phasecollectionchanged", phase: phase, group: parent.name, category: "internal", phaseObject: phaseObject, islastPhase: islastPhase, isAdded: false };
                        this.addHistoryEntry(entry);
                    }
                }
            }
        },

        _getEdgeTable: function (group, edgeTable) {
            var edges, len, i, j, depend;
            if (!group.segments) {
                if (group._type === "group" || group._type === "pseudoGroup") {
                    var children = this._getChildren(group.children);
                    for (i = 0; i < children.length; i++) {
                        var node = this.nameTable[children[i]];
                        if (node && node.inEdges && node.inEdges.length > 0) {
                            edges = node.inEdges;
                            for (j = 0, len = edges.length; j < len; j++) {
                                depend = this.nameTable[edges[j]];
                                if (depend)
                                    var table = edgeTable[depend.name] = $.extend(true, {}, depend);
                            }
                        }
                        if (node && node.outEdges && node.outEdges.length > 0) {
                            edges = node.outEdges;
                            for (j = 0, len = edges.length; j < len; j++) {
                                depend = this.nameTable[edges[j]];
                                if (depend)
                                    var table = edgeTable[depend.name] = $.extend(true, {}, depend);
                            }
                        }
                    }
                }
                if (group.inEdges && group.inEdges.length > 0) {
                    edges = group.inEdges;
                    for (j = 0, len = edges.length; j < len; j++) {
                        depend = this.nameTable[edges[j]];
                        if (depend)
                            var table = edgeTable[depend.name] = $.extend(true, {}, depend);
                    }
                }
                if (group.outEdges && group.outEdges.length > 0) {
                    edges = group.outEdges;
                    for (j = 0, len = edges.length; j < len; j++) {
                        depend = this.nameTable[edges[j]];
                        if (depend)
                            var table = edgeTable[depend.name] = $.extend(true, {}, depend);
                    }
                }
            }
            return edgeTable;
        },
        _remove: function (obj, dependent, isClear) {
            var isObjectDeleted = false;
            this._raiseChildrenPropertyChange(obj);
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                if (obj && (ej.datavisualization.Diagram.Util.canDelete(obj) || isClear)) {
                    var type;
                    if (obj.segments) type = "connector";
                    else type = "node";
                    var dependent = dependent ? ej.datavisualization.Diagram.dependentconnector.dependent : ej.datavisualization.Diagram.dependentconnector.independent;
                    var args = { changeType: "remove", element: this.getNode(obj), cancel: false, dependent: dependent, state: "changing" };
                    if (!obj.segments) { args.adjustDependent = true; args.deleteDependent = true; }

                    var cause = this._eventCause[type + "CollectionChange"];
                    if (!cause) {
                        if (this._isKeyDown || this._isUndo)
                            this._eventCause[type + "CollectionChange"] = (this._isUndo && !this._multipleAction) ? ej.datavisualization.Diagram.CollectionChangeCause.HistoryChange : ej.datavisualization.Diagram.CollectionChangeCause.Keydown;
                    }
                    if (!obj.isPhase && !this._selectedSymbol)
                        this._raiseEvent(type + "CollectionChange", args);
                    if (!args.cancel) {
                        isObjectDeleted = true;
                        var name = obj.name;
                        if (obj.type == "group" && obj.type != "pseudoGroup") {
                            var children = this._getChildren(obj.children);
                            for (var i = 0; i < children.length; i++) {
                                var child = this.nameTable[children[i]];
                                if (child && !ej.datavisualization.Diagram.Util.canDelete(child)) return;
                            }
                        }
                        if (obj.isSwimlane) {
                            ej.datavisualization.Diagram.SvgContext._removephases(obj, this);
                        }
                        if (obj.type == "bpmn") {
                            var children = this._getChildren(obj.children);
                            for (var i = 0; children && i < children.length; i++) {
                                var child = this.nameTable[children[i]];
                                if (child && child.annotation && child._annotation)
                                    for (var n = 0; n < child._annotation.length; n++)
                                        if (this.nameTable[child._annotation[n]]) this._remove(this.nameTable[child._annotation[n]], dependent, true);
                            }
                        }

                        if (!obj.segments) {
                            if (obj.annotation && obj._annotation) {
                                for (var n = 0; n < obj._annotation.length; n++)
                                    if (this.nameTable[obj._annotation[n]]) this._remove(this.nameTable[obj._annotation[n]]);
                            }
                            this._disConnect(obj, args);
                            //if (obj.type != "group")
                            this._removeConnector(obj, args);
                            if (this._crudDeleteNodes && !this._selectedSymbol) {
                                this._crudDeleteNodes.push(this.nameTable[obj.name]);
                            }
                            ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this.nameTable[obj.name]);
                            this._nodes = $.extend(true, [], this.nodes());
                            this._removeNodeFromGraph(obj);
                        } else {
                            this._removeEdges(obj);
                            obj.sourceNode = obj.sourcePort = obj.targetNode = obj.targetPort = null;
                            if (this._crudDeleteNodes && !this._selectedSymbol) {
                                this._crudDeleteNodes.push(this.nameTable[obj.name]);
                            }
                            ej.datavisualization.Diagram.Util.removeItem(this.connectors(), this.nameTable[obj.name]);
                            this._connectors = $.extend(true, [], this.connectors());
                        }
                        type = this.getObjectType(obj);
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(this._spatialSearch, this._spatialSearch.quadTable[obj.name], obj);
                        ej.datavisualization.Diagram.SpatialUtil._updateBounds(this, this._spatialSearch, obj, false);
                        if (obj.parent) {
                            var parent = this.nameTable[obj.parent];
                            if (parent && (parent.type == "group" || parent.type == "bpmn" || parent.type == "umlclassifier")) {
                                ej.datavisualization.Diagram.Util.removeChildFromGroup(parent.children, obj.name);
                                ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                                //this._disableSwimlaneUptate = true;
                                var prevObj = $.extend(true, {}, parent)
                                ej.datavisualization.Diagram.ContainerHelper._updateCollectionChange(this, parent, true);
                                //delete this._disableSwimlaneUptate;
                                if (parent.parent)
                                    ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, this.nameTable[parent.parent]);
                                ej.datavisualization.Diagram.Util._refreshParentGroup(obj, this);
                                ej.datavisualization.Diagram.canvasHelper._updateAddRemoveNodeConnectors(this, parent, prevObj);
                                ej.datavisualization.Diagram.canvasHelper._updateAddRemoveLaneConnectors(this, obj)
                                ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, this.nameTable[parent.parent]);
                                this._updateQuad(parent);
                            }
                        }
                        delete this.nameTable[name];
                        if (obj.segments)
                            this._updateConnectorBridging(obj);
                        var element = this._svg.getElementById(obj.name);
                        if (obj._type == "group" && obj.type != "pseudoGroup") {
                            this._removeChildren(obj, args);
                        }
                        this._removeElement(obj);

                        if (element && element.parentNode)
                            element.parentNode.removeChild(element);
                        ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.activeTool.selectedObject, this._adornerSvg, this._adornerLayer);
                        this._clearSelection((this._selectedSymbol || this._dropPhase) ? true : false);

                    }
                }
            }
            if (isObjectDeleted && !obj.isPhase && !this._selectedSymbol) {
                args.state = "changed";
                if (obj.type === "connector")
                    this._raiseEvent("connectorCollectionChange", args);
                else
                    this._raiseEvent("nodeCollectionChange", args);
            }
            return isObjectDeleted;
        },
        _removeConnector: function (node, args) {
            var edges;
            var connector;
            var i, len;
            if (!node.segments) {
                //If adjustDependent is false all connector associated with Nodes get deleted.
                if (args.deleteDependent && !(args.adjustDependent)) {
                    if (node.inEdges && node.inEdges.length > 0) {
                        edges = node.inEdges;
                        for (i = edges.length - 1 ; i >= 0; i--) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                    if (node.outEdges && node.outEdges.length > 0) {
                        edges = node.outEdges;
                        for (i = 0, len = edges.length; i < len; i++) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                }
                //If both deleteDependent & adjustDependent are true changes to Visio behaviour
                if (args.deleteDependent && args.adjustDependent) {
                    if (node.inEdges && node.inEdges.length > 0 && node.outEdges && node.outEdges.length > 0) {
                        edges = node.outEdges;
                        for (i = edges.length - 1 ; i >= 0; i--) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                        edges = node.inEdges;
                        for (i = edges.length - 1 ; i >= 0; i--) {
                            //Remove the Connector
                            if (this.nameTable[edges[i]])
                                this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                    else if (node.inEdges && node.inEdges.length == 0 && node.outEdges.length > 0) {
                        edges = node.outEdges;
                        for (i = edges.length - 1 ; i >= 0; i--) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                    else if (node.outEdges && node.outEdges.length == 0 && node.inEdges.length > 0) {
                        edges = node.inEdges;
                        for (i = edges.length - 1 ; i >= 0; i--) {
                            //Remove the Connector
                            if (this.nameTable[edges[i]])
                                this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                    else if ((node.inEdges && node.inEdges.length == 1 || node.inEdges.length > 1) && (node.outEdges.length == 1)) {
                        edges = node.outEdges;
                        for (i = 0, len = edges.length; i < len; i++) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                    else if (!(node.inEdges && node.inEdges.length > 1 && node.outEdges.length > 1)) {
                        edges = node.inEdges;
                        for (i = 0, len = edges.length; i < len; i++) {
                            //Remove the Connector
                            this._updateConnection(this.nameTable[edges[i]], true);
                        }
                    }
                }
            }
        },
        _updateConnection: function (connector, args) {
            if (connector && ej.datavisualization.Diagram.Util.canDelete(connector)) {
                this._remove(connector, args);
                this.updateConnector(connector.name);
            }
        },
        _removeElement: function (element) {
            for (var i = 0; i < this._views.length; i++) {
                var view = this._views[i];
                this._views[view].context.removeChild(element, this._views[view]);
            }
        },
        _disConnect: function (node, args, isChild) {
            var edgesIn, edgesOut, connector, parentNode, targetNode, data;
            var i, j, leni, lenj, canDelete;
            if (node.inEdges && node.inEdges.length > 0) {
                edgesIn = node.inEdges;
                for (i = 0, leni = edgesIn.length; i < leni; i++) {
                    if (ej.datavisualization.Diagram.Util.canDelete(this.nameTable[edgesIn[i]]))
                        canDelete = true;
                }
            }
            if (node.outEdges && node.outEdges.length > 0) {
                edgesOut = node.outEdges;
                for (i = 0, leni = edgesOut.length; i < leni; i++) {
                    if (ej.datavisualization.Diagram.Util.canDelete(this.nameTable[edgesOut[i]]))
                        canDelete = true;
                }
            }
            if (args.deleteDependent && args.adjustDependent && !isChild && canDelete) {
                if (node.inEdges && node.inEdges.length > 0 && node.outEdges.length > 0) {
                    edgesIn = node.inEdges;
                    edgesOut = node.outEdges;
                    if ((node.inEdges.length > 1 || node.inEdges.length == 1) && node.outEdges.length == 1) {
                        for (i = 0, leni = edgesIn.length; i < leni; i++) {
                            if (this.nameTable[edgesIn[i]] && this.nameTable[edgesOut[0]]) {
                                if ((this.nameTable[edgesIn[i]].targetNode == this.nameTable[edgesOut[0]].sourceNode)) {
                                    targetNode = this.nameTable[this.nameTable[edgesOut[0]].targetNode];
                                    if (targetNode) {
                                        data = $.extend(true, {}, targetNode);
                                        if (this.nameTable[edgesIn[i]].sourceNode != this.nameTable[edgesOut[0]].targetNode) {
                                            this.nameTable[edgesIn[i]].targetNode = this.nameTable[edgesOut[0]].targetNode;
                                            this.nameTable[edgesIn[i]].targetPort = this.nameTable[edgesOut[0]].targetPort;
                                            targetNode.inEdges.push(this.nameTable[edgesIn[i]].name);
                                        }
                                    }
                                    //Updating the Connector Dock and Connector
                                    ej.datavisualization.Diagram.Util.dock(this.nameTable[edgesIn[i]], this.nameTable);
                                    ej.datavisualization.Diagram.DiagramContext.update(this.nameTable[edgesIn[i]], this);
                                }
                            }
                        }
                        if (this.nameTable[edgesOut[0]]) {
                            this.nameTable[edgesOut[0]].sourceNode = null;
                            this.nameTable[edgesOut[0]].sourcePort = null;
                        }
                    }
                    else if (!(node.inEdges.length > 1 && node.outEdges.length > 1)) {
                        // Need to code when many in and only one out 
                        for (i = 0, leni = edgesIn.length; i < leni; i++) {
                            if (node.outEdges.length > 0) {
                                if (this.nameTable[edgesIn[i]]) {
                                    parentNode = this.nameTable[this.nameTable[edgesIn[i]].sourceNode];
                                    data = $.extend(true, {}, parentNode);
                                    for (j = 0, lenj = edgesOut.length; j < lenj; j++) {
                                        if ((this.nameTable[edgesIn[i]].targetNode == this.nameTable[edgesOut[j]].sourceNode)) {
                                            this.nameTable[edgesOut[j]].sourceNode = this.nameTable[edgesIn[i]].sourceNode;
                                            this.nameTable[edgesOut[j]].sourcePort = this.nameTable[edgesIn[i]].sourcePort;
                                            parentNode.outEdges[data.outEdges.length + j] = this.nameTable[edgesOut[j]].name;
                                            //Updating the Connector Dock and Connector
                                            ej.datavisualization.Diagram.Util.dock(this.nameTable[edgesOut[j]], this.nameTable);
                                            ej.datavisualization.Diagram.DiagramContext.update(this.nameTable[edgesOut[j]], this);
                                        }
                                    }
                                    this.nameTable[edgesIn[i]].targetNode = null;
                                    this.nameTable[edgesIn[i]].targetPort = null;
                                }
                            }
                        }
                    }
                } return;
            }
            if (node.inEdges && node.inEdges.length > 0) {
                edgesIn = node.inEdges;
                for (i = 0, leni = edgesIn.length; i < leni; i++) {
                    connector = this.nameTable[edgesIn[i]];
                    if (connector) {
                        connector.targetNode = null;
                        connector.targetPort = null;
                    }
                }
            }
            if (node.outEdges && node.outEdges.length > 0) {
                edgesOut = node.outEdges;
                for (i = 0, leni = edgesOut.length; i < leni; i++) {
                    connector = this.nameTable[edgesOut[i]];
                    if (connector) {
                        connector.sourceNode = null;
                        connector.sourcePort = null;
                    }
                }
            }
        },
        _removeEdges: function (connector) {
            if (connector.targetNode) {
                if (this.nameTable[connector.targetNode] && this.nameTable[connector.targetNode].inEdges)
                    ej.datavisualization.Diagram.Util.removeItem(this.nameTable[connector.targetNode].inEdges, connector.name);
            }
            if (connector.sourceNode) {
                if (this.nameTable[connector.sourceNode] && this.nameTable[connector.sourceNode].outEdges)
                    ej.datavisualization.Diagram.Util.removeItem(this.nameTable[connector.sourceNode].outEdges, connector.name);
            }
        },
        _selectionContains: function (node) {
            if (this._hasSelection() && node)
                for (var i = 0; i < this.selectionList.length; i++) {
                    if (node.name === this.selectionList[i].name)
                        return true;
                }
            return false;
        },
        _getPhaseIndex: function (name) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._getPhaseIndex(this, name);
        },
        _getPhaseBounds: function (phase) {
            return ej.datavisualization.Diagram.SwimLaneContainerHelper._getPhaseBounds(this, phase);
        },
        _addSelection: function (selectedShape, preventEvent) {
            if ((ej.datavisualization.Diagram.Util.isPageEditable(this) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this)) && (ej.datavisualization.Diagram.Util.canDoSingleSelection(this) || (selectedShape && selectedShape._type === "pseudoGroup" || this._selectedSymbol) || ej.datavisualization.Diagram.Util.canEnableAPIMethods(this))) {
                if (selectedShape && ej.datavisualization.Diagram.Util.enableLayerOption(selectedShape, "lock", this) && (ej.datavisualization.Diagram.Util.canSelect(selectedShape) || selectedShape.type == "phase")) {
                    if (!this._selectionContains(selectedShape)) {
                        var newItems = [], oldItems = [], selectedItems = [];
                        if (this._previousSelectedItems) oldItems = this._previousSelectedItems;
                        if (selectedShape.type == "pseudoGroup") {
                            var children = this._getChildren(selectedShape.children);
                            for (var i = 0; i < children.length; i++) {
                                var child = this.nameTable[children[i]];
                                if (oldItems.indexOf(child) == -1) newItems.push(child);
                                else ej.datavisualization.Diagram.Util.removeItem(oldItems, child);
                                selectedItems.push(child);
                            }
                        }
                        else {
                            newItems.push(selectedShape);
                            selectedItems.push(selectedShape);
                        }
                        var cause = this._eventCause["selectionChange"];
                        if (!cause)
                            this._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Unknown;
                        var element = this.getNode(selectedShape)
                        var args = { changeType: "insert", element: this.getNode(selectedShape), state: "changing", selectedItems: selectedItems, oldItems: oldItems, newItems: newItems, cancel: false };
                        if ((!this._selectedSymbol || this._endEditing) && !preventEvent) {
                            this._raiseEvent("selectionChange", args);
                            this._previousSelectedItems = args.newItems;
                        }
                        if (!args.cancel) {
                            this.selectionList.push(selectedShape);
                            this._updateSelectorObject(selectedShape);
                            if (selectedShape.isPhase)
                                var bounds = this._getPhaseBounds(selectedShape);
                            //  if (selectedShape.type !="umlclassifier")
                            ej.datavisualization.Diagram.SvgContext.renderSelector(selectedShape, this._adornerSvg, this._adornerLayer, this._currZoom,
                                this.model.selectedItems.constraints, bounds, this);
                            if ((this.model.selectedItems.userHandles != null && this.model.selectedItems.userHandles.length > 0)) {
                                var isMultipleSelection = false;
                                if (selectedShape.type == "pseudoGroup")
                                    isMultipleSelection = true;
                                if (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                                    ej.datavisualization.Diagram.SvgContext.renderUserHandles(this.model.selectedItems.userHandles, selectedShape, this._adornerSvg, isMultipleSelection, this._currZoom, this._adornerLayer, this);
                            }
                            if ((!this._selectedSymbol || this._endEditing) && !preventEvent) {
                                args = { changeType: "insert", element: this.getNode(selectedShape), state: "changed", cause: args.cause, selectedItems: selectedItems, oldItems: oldItems, newItems: newItems, cancel: false };
                                this._raiseEvent("selectionChange", args);
                            }
                        }
                        else {
                            if (selectedShape && selectedShape.type == "pseudoGroup") {
                                ej.datavisualization.Diagram.Util.removeItem(this.nodes(), selectedShape);
                                this._nodes = $.extend(true, [], this.nodes());
                                delete this.nameTable[selectedShape.name];
                            }
                        }
                    }
                }
            }
        },
        _getInsertIndex: function (phase) {
            var index = -1, offset, cphase;
            var group = this.nameTable[phase.parent];
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this, group);
            if (phases && phases.length > 0) {
                if (this.nameTable[this._getChild(phases[0])]) {
                    offset = this.nameTable[this._getChild(phases[0])].offset;
                    for (var i = 0; i < phases.length; i++) {
                        cphase = this.nameTable[this._getChild(phases[i])];
                        if (cphase && cphase.offset <= phase.offset && cphase.offset >= offset) {
                            offset = cphase.offset;
                            index = i;
                        }
                    }
                }
            }
            return index;
        },
        _updateInsertPhase: function (nphase, ophase, group, index, entryItem) {
            var oldPhase = this.nameTable[ophase];
            var phaseStack = this.nameTable[this._getChild(group.children[1])];

            if (phaseStack && phaseStack.children && phaseStack.children.length > 0) {
                var oldChild = this.nameTable[ophase];
                var newStackChild = ej.datavisualization.Diagram.Node(nphase);
                if (group.isSwimlane && group.orientation && group.orientation == "vertical") {
                    if (entryItem) {
                        h = nphase.height
                        oldChild.height = entryItem.phaseObject.prevPhase.height;
                        oldChild.offset = entryItem.phaseObject.prevPhase.offset;
                    }
                    else {
                        var h = oldChild.height;
                        oldChild.height = oldPhase.offset - nphase.offset;
                        var dH = h - oldChild.height;
                        newStackChild.height = dH;
                    }
                    newStackChild.parent = phaseStack.name;
                    newStackChild.name = nphase.name;
                    newStackChild.width = oldChild.width;
                    newStackChild.isPhase = true;
                }
                else {
                    if (entryItem) {
                        w = nphase.width
                        oldChild.width = entryItem.phaseObject.prevPhase.width;
                        oldChild.offset = entryItem.phaseObject.prevPhase.offset;
                    }
                    else {
                        var w = oldChild.width;
                        oldChild.width = oldPhase.offset - nphase.offset;
                        var dW = w - oldChild.width;
                        newStackChild.width = dW;
                    }
                    newStackChild.parent = phaseStack.name;
                    newStackChild.name = nphase.name;
                    newStackChild.height = oldChild.height;

                    newStackChild.isPhase = true;
                    //var newStackChild = ej.datavisualization.Diagram.Node({ parent: phaseStack.name, name: nphase.name, height: oldChild.height, width: dW, isPhase: true });
                }
                newStackChild.x = 0;
                newStackChild.y = 0;
                if (!this._isUndo || newStackChild.labels.length === 0)
                    newStackChild.labels = [(nphase.label ? nphase.label : ej.datavisualization.Diagram.Label())];
                newStackChild.labels[0].rotateAngle = (nphase.orientation == "horizontal") ? 0 : 270;
                newStackChild.constraints = ej.datavisualization.Diagram.NodeConstraints.Default & ~(ej.datavisualization.Diagram.NodeConstraints.Select | ej.datavisualization.Diagram.NodeConstraints.Connect);
                newStackChild.isPhase = true;
                newStackChild._type = "node";
                this.add(newStackChild, { entryHistory: true });
                //#region swapping the element 
                phaseStack.children.pop(newStackChild);
                phaseStack.children.splice(index, 0, newStackChild);
                //#endregion  
            }
        },
        _getFirstLane: function (group) {
            if (group.children[2])
                var stack = this.nameTable[this._getChild(group.children[2])];
            if (stack && stack.children && stack.children.length > 0) {
                var lane = this.nameTable[this._getChild(stack.children[0])]
                if (lane && lane.children && lane.children.length > 0) {
                    var laneHdr = this.nameTable[this._getChild(lane.children[0])];
                    if (laneHdr)
                        return laneHdr;
                }
            }
            return null;
        },
        updateSelector: function (option) {
            if (this._selectedItem != "") {
                var options = {};
                if (option.offsetX)
                    options.offsetX = Number(typeof option.offsetX === 'function' ? option.offsetX() : option.offsetX);
                if (option.offsetY)
                    options.offsetY = Number(typeof option.offsetY === 'function' ? option.offsetY() : option.offsetY);
                if (option.width)
                    options.width = Number(typeof option.width === 'function' ? option.width() : option.width);
                if (option.height)
                    options.height = Number(typeof option.height === 'function' ? option.height() : option.height);
                if (option.rotateAngle)
                    options.rotateAngle = Number(typeof option.rotateAngle === 'function' ? option.rotateAngle() : option.rotateAngle);
                this.updateNode(this._selectedItem, options);
            }
            if (option.userHandles) {
                this.model.selectedItems.userHandles = option.userHandles;
                this._initHandles();
                if (this.selectionList[0] && this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                    ej.datavisualization.Diagram.SvgContext.updateUserHandles(this.model.selectedItems.userHandles, this.selectionList[0], this._adornerSvg, this.selectionList[0].type == "pseudoGroup", false, this._currZoom, this);
            }
            if (option.tooltip) {
                this.model.selectedItems.tooltip = ej.datavisualization.Diagram.Tooltip($.extend(true, this.model.selectedItems.tooltip, {}, option.tooltip));
            }
        },
        _updateSelectorObject: function (selectedShape) {
            if (!selectedShape.segments) {
                this._selectorOffsetX(selectedShape.offsetX);
                this._selectorOffsetY(selectedShape.offsetY);
                this._selectorWidth(selectedShape.width);
                this._selectorHeight(selectedShape.height);
                this._selectorRotateAngle(selectedShape.rotateAngle);
                this._selectedItem = selectedShape.name;
            }
            if (selectedShape.type == "pseudoGroup") {
                for (var i = 0; i < selectedShape.children.length; i++) {
                    var child = selectedShape.children[i];
                    if (typeof (child) === "object") {
                        if (this.model.selectedItems.children.indexOf(child) < 0)
                            this.model.selectedItems.children.push(child);
                    }
                    else if (typeof (child) === "string") {
                        if (this.model.selectedItems.children.indexOf(this.nameTable[this._getChild(child)]) < 0)
                            this.model.selectedItems.children.push(this.nameTable[this._getChild(child)]);
                    }
                }
            }
            else {
                if (this.model.selectedItems.children.indexOf(selectedShape) < 0)
                    this.model.selectedItems.children.push(selectedShape);
            }
        },
        _clearSelectorObject: function () {
            this._selectorOffsetX(0);
            this._selectorOffsetY(0);
            this._selectorWidth(0);
            this._selectorHeight(0);
            this._selectorRotateAngle(0);
            this._selectedItem = "";
            this.model.selectedItems.children = [];
        },
        _raiseEvent: function (type, args) {
            if (this.model[type]) {
                args.elementType = this.getObjectType(args.element);
                if (((type === "nodeCollectionChange" || type === "connectorCollectionChange" || type === "selectionChange") && args.state === "changing") || type === "scrollChange")
                    args.cause = this._eventCause[type] ? this._eventCause[type] : "unknown";
                if (!this._multipleAction)
                    this._eventCause = {};
                args.diagramId = this.element[0].id;
                return this._trigger(type, args);
            }
        },
        _clearSelection: function (preventEvent) {
            if (this._hasSelection()) {
                if (this._isEditing && this.selectionList.length > 0 && !this._isDragg) {
                    this._endEdit();
                }
                var args = { changeType: "remove", state: "changing", element: null, selectedItems: [], oldItems: this.model.selectedItems.children, newItems: [], cancel: false };
                if (!this._selectedSymbol && !preventEvent) {
                    this._raiseEvent("selectionChange", args);
                    this._previousSelectedItems = [];
                }
                if (!args.cancel) {
                    this._clearSelectorObject();
                    if (this.selectionList[0] && this.selectionList[0].type == "pseudoGroup") {
                        ej.datavisualization.Diagram.Util.removeItem(this.nodes(), this.selectionList[0]);
                        this._nodes = $.extend(true, [], this.nodes());
                        delete this.nameTable[this.selectionList[0].name];
                    }
                    ej.datavisualization.Diagram.Util.clear(this.selectionList);
                    ej.datavisualization.Diagram.SvgContext.clearSelector(this._adornerSvg, this._adornerLayer, this);
                    if (!this._selectedSymbol && !preventEvent) {
                        args = { changeType: "remove", state: "changed", cause: args.cause, element: null, selectedItems: [], oldItems: this.model.selectedItems.children, newItems: [], cancel: false };
                        this._raiseEvent("selectionChange", args);
                    }
                }
            }
        },
        _updateSelectionHandle: function (isDragging) {
            if (this.selectionList.length > 0) {
                var shape = this.selectionList[0]._type == "label" ? this.selectionList[0] : this.nameTable[this.selectionList[0].name];
                var constraints = this.model.selectedItems.constraints;
                if (isDragging && (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles))
                    constraints = constraints & ~ej.datavisualization.Diagram.SelectorConstraints.UserHandles;
                if (this.selectionList[0]._type !== "label")
                    this._updateSelectorObject(shape);
                var updated = ej.datavisualization.Diagram.SvgContext.updateSelector(shape, this._adornerSvg, this._currZoom, this, constraints, this.activeTool._resizeDirection, isDragging);
                if (!updated) {
                    if ((this.model.selectedItems.userHandles != null && this.model.selectedItems.userHandles.length > 0)) {
                        var isMultipleSelection = false;
                        if (shape.type == "pseudoGroup")
                            isMultipleSelection = true;
                        if (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.UserHandles)
                            ej.datavisualization.Diagram.SvgContext.updateUserHandles(this.model.selectedItems.userHandles, shape, this._adornerSvg, isMultipleSelection, isDragging, this._currZoom, this);
                    }
                }
            }
        },
        _hasSelection: function () {
            return this.selectionList.length > 0;
        },
        _canActivateLabelTool: function (evt, node) {
            if (node) {
                var label = this._findLabelAtPoint(this._mousePosition(evt), node);
                if (label == null) {
                    var targetClass = "", id1, target = evt.target;
                    if (this.model.labelRenderingMode === ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                        var target1 = $(evt.target).parents(".ej-d-label");
                        if (target1[0]) {
                            target = target1[0];
                        }
                    }
                    if (target) {
                        targetClass = target.getAttribute("class");
                        if (targetClass == "ej-d-label") {
                            var id = target.id.split('_');
                            for (var i = 0; i < node.labels.length; i++) {
                                id1 = node.labels[i].name.split('_');
                                if (id[id.length - 1] == id1[id1.length - 1])
                                    label = node.labels[i];
                            }
                        }
                    }
                }
                if (label) {
                    if (ej.datavisualization.Diagram.Util.canMoveLabel(node))
                        return 1;
                    return (ej.datavisualization.Diagram.Util.canSelect(label) || ej.datavisualization.Diagram.Util.canMove(label) ||
                   ej.datavisualization.Diagram.Util.canResize(label) || ej.datavisualization.Diagram.Util.canRotate(label));
                }
            }
            return false;
        },
        _checkToolToActivate: function (evt, node) {
            var success = false, label = false;
            var pseudoGroupConstraints;
            pseudoGroupConstraints = ej.datavisualization.Diagram.Util._getPseudoGroupConstraints(this, node, this.selectionList[0]);
            if (node) {
                if (node.segments && ((navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey) && evt.shiftKey) || ((navigator.platform.match("Mac") ? evt.metaKey : evt.ctrlKey) && evt.altKey)) {
                    this._toolToActivate = "endPoint";
                    this._currentCursor = "move";
                    success = true;
                }
                if (!success) {
                    if (evt.target && evt.target.getAttribute("class") != "ej-d-port" && this._selectionContains(node)) {
                        if (node.segments) {
                            success = this._canActivateEndPointTool(evt, node);
                        }
                        else {
                            if (!pseudoGroupConstraints || pseudoGroupConstraints & ej.datavisualization.Diagram.NodeConstraints.Resize)
                                success = this._canActivateResizeTool(evt, node);
                            if (!success) {
                                if ((!pseudoGroupConstraints || (pseudoGroupConstraints & ej.datavisualization.Diagram.NodeConstraints.Rotate)))
                                    success = this._canActivateRotateTool(evt, node);
                            }
                        }
                        if (!success) {
                            success = this._canActivateUserHandle(evt, node);
                        }
                        if (!success) {
                            if (!pseudoGroupConstraints || pseudoGroupConstraints & ej.datavisualization.Diagram.NodeConstraints.Drag)
                                if (node && node.isLane && ej.datavisualization.Diagram.Util.canMultiSelectOnLane(node)) {
                                    this._toolToActivate = "select";
                                    this._currentCursor = "default";
                                }
                                else if ((evt && evt.target) && this._canActivateLabelTool(evt, node) && (evt.target.getAttribute("class") === "ej-d-label" || 
                                    evt.target.parentNode.getAttribute("class") === "ej-d-label" || this.model.labelRenderingMode === ej.datavisualization.Diagram.LabelRenderingMode.Svg )) {
                                    label = true;
                                }
                                else
                                    success = this._canActivateMoveTool(evt, node);
                        }
                        if (!success) {
                            success = this._canActivatephaseTool(evt);
                        }
                    }
                    else {
                        if (evt && evt.target && evt.target.classList && evt.target.classList.contains("ej-d-port")) {
                            var point = this._mousePosition(evt);
                            var port = this._findPortAtPoint(point, node);
                            if (port) {
                                var args = this._getvalues(evt);
                                var setTool = this._getSetTool();
                                if (setTool)
                                    setTool(args, port);
                                if ((setTool && args.action === "draw") || (args.action != "drag" && port.constraints & ej.datavisualization.Diagram.PortConstraints.ConnectOnDrag && ej.datavisualization.Diagram.PortConstraints.Connect) && ((port.visibility & ej.datavisualization.Diagram.PortVisibility.Visible) || (port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover))) {
                                    this._currentCursor = "crosshair";
                                    var drawType = this.model.drawType;
                                    var type = drawType.segments && drawType.segments.length && drawType.segments[0].type ? drawType.segments[0].type : "orthogonal";
                                    if (type === "orthogonal")
                                        this.activateTool("orthogonalLine", true);
                                    else
                                        this.activateTool("straightLine", true);
                                    this._activatedFromPort = true;
                                    success = true;
                                }
                            }
                        }
                        if (evt && this._canActivateLabelTool(evt, node) && evt.target && (evt.target.getAttribute("class") === "ej-d-label"
                            || evt.target.parentNode.getAttribute("class") === "ej-d-label" || this.model.labelRenderingMode === ej.datavisualization.Diagram.LabelRenderingMode.Svg)) {
                            label = true;
                        }
                        else
                            if (!pseudoGroupConstraints || pseudoGroupConstraints & ej.datavisualization.Diagram.NodeConstraints.Drag)
                                success = this._canActivateMoveTool(evt, node);
                    }
                }
            }
            else {
                success = this._canActivatephaseTool(evt);
            }
            if (port && args.action === "drag") {
                this._currentCursor = "pointer";
                this._toolToActivate = "portTool";
            }
            if (label) {
                this._currentCursor = "pointer";
                this._toolToActivate = "labelMove";
                success = true;
            }
            if (!success) {
                if (this.tool() & ej.datavisualization.Diagram.Tool.ZoomPan) {
                    if (this.tool() & ej.datavisualization.Diagram.Tool.SingleSelect) {
                        var findNode = this._findNodeUnderMouse(evt);
                        if (findNode) {
                            this._toolToActivate = "select";
                            this._currentCursor = "default";
                            success = true;
                        }
                    }
                    if (!success) {
                        this._toolToActivate = "panTool";
                        this._currentCursor = "pointer";
                    }

                }
                else {
                    this._toolToActivate = "select";
                    this._currentCursor = "default";
                }
            }
            if ((this._toolToActivate != "rotate") && (this._toolToActivate != "labelRotate")) {
                this._adornerSvg.document.removeAttribute("class");
            }
            return success;
        },
        _canActivatephaseTool: function (evt) {
            if ($(evt.target).parents(".ej-d-seperator").first()[0]) {
                var id = $(evt.target).parents("g").first()[0].id;
                var phase = this._getSeperetor(id.split('_phase_g')[0]);
                var swimlane = this.nameTable[phase.parent.split("phaseStack")[0]];
                if (swimlane && ej.datavisualization.Diagram.Util.canResize(swimlane)) {
                    if (phase) {
                        if (phase.orientation == "horizontal")
                            this._currentCursor = "e-resize";
                        else
                            this._currentCursor = "n-resize";
                    }
                    else
                        this._currentCursor = "default";
                    this._toolToActivate = "phase";
                    return true;
                }
            }
        },
        _canActivateUserHandle: function (evt) {
            if (this._isUserHandle(evt) && evt.target) {
                var handleName = evt.target.id.split("_")[0];
                this._toolToActivate = handleName;
                this._currentCursor = this.tools[this._toolToActivate].cursor;
                return true;
            }
            return false;
        },

        _canActivateEndPointTool: function (evt, connector) {
            if (connector) {
                var endPointHandle = evt.target.getAttribute("class");
                if (endPointHandle && ((endPointHandle === "targetEndPoint" && ej.datavisualization.Diagram.Util.canDragTargetEnd(connector)) ||
                    (endPointHandle === "sourceEndPoint" && ej.datavisualization.Diagram.Util.canDragSourceEnd(connector)) ||
                (endPointHandle.match("bezierpoint") || endPointHandle == "segmentEnd") && ej.datavisualization.Diagram.Util.canDragSegmentThumbs(connector))
                    ) {
                    this._toolToActivate = "endPoint";
                    this._currentCursor = "move";
                    return true;
                }
            }
            return false;
        },
        _canActivateResizeTool: function (evt, node) {
            var dir = evt.target.getAttribute("class");
            var rotateAngle;
            if (ej.datavisualization.Diagram.Util.canResize(node, dir) && (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.Resizer)) {
                if (dir === "nw-resize" || dir === "n-resize" || dir === "ne-resize" || dir === "w-resize" || dir === "e-resize" || dir === "sw-resize" || dir === "s-resize" || dir === "se-resize") {
                    if (node._type !== "label") {
                        this._toolToActivate = "resize";
                        rotateAngle = node.rotateAngle
                    } else {
                        this._toolToActivate = "labelResize";
                        rotateAngle = this._findLabelRotateAngle(node);
                    }
                    if ((rotateAngle >= 0 && rotateAngle < 25) || (rotateAngle >= 160 && rotateAngle <= 205) || (rotateAngle >= 340 && rotateAngle <= 360)) {
                        this._currentCursor = dir;
                    }
                    else if ((rotateAngle >= 25 && rotateAngle <= 70) || (rotateAngle >= 205 && rotateAngle <= 250)) {

                        if (dir === "n-resize" || dir === "s-resize") {
                            this._currentCursor = "ne-resize";
                        }
                        else if (dir === "nw-resize" || dir === "se-resize") {
                            this._currentCursor = "n-resize";
                        }
                        else if (dir === "e-resize" || dir === "w-resize") {
                            this._currentCursor = "nw-resize";
                        }
                        else {
                            this._currentCursor = "e-resize";
                        }
                    }
                    else if ((rotateAngle >= 70 && rotateAngle <= 115) || (rotateAngle >= 250 && rotateAngle <= 295)) {
                        if (dir === "n-resize" || dir === "s-resize") {
                            this._currentCursor = "e-resize";
                        }
                        else if (dir === "nw-resize" || dir === "se-resize") {
                            this._currentCursor = "ne-resize";
                        }
                        else if (dir === "e-resize" || dir === "w-resize") {
                            this._currentCursor = "n-resize";
                        }
                        else {
                            this._currentCursor = "nw-resize";
                        }
                    }
                    else if ((rotateAngle >= 115 && rotateAngle <= 155) || (rotateAngle >= 295 && rotateAngle <= 340)) {
                        if (dir === "n-resize" || dir === "s-resize") {
                            this._currentCursor = "nw-resize";
                        }
                        else if (dir === "nw-resize" || dir === "se-resize") {
                            this._currentCursor = "e-resize";
                        }
                        else if (dir === "e-resize" || dir === "w-resize") {
                            this._currentCursor = "ne-resize";
                        }
                        else {
                            this._currentCursor = "n-resize";
                        }
                    }
                    return true;
                }
            }
            return false;
        },
        _canActivateMoveTool: function (evt, node) {
            if (evt.target)
                var className = evt.target.className;
            if (className && ej.datavisualization.Diagram.Util.isClassifier(evt))
                var findNode = ej.datavisualization.Diagram.ClassifierHelper.getMovableElementUnderMouse(evt, this);
            else if (className && className.animVal === "ej-d-multiselector" && node && node.type == "pseudoGroup" && ej.datavisualization.Diagram.Util.canDragHelper(this)) {
                findNode = this.selectionList[0];
            }
            else
                findNode = this._findNodeUnderMouse(evt);
            if (findNode && findNode.name === node.name) {
                var canMove = true;
                if (node.parent) {
                    if (this.selectionList.length > 0 && this._selectionContains(node))
                        canMove = true;
                    else
                        canMove = false;
                }
                var swimlane = false;
                if (node.parent) {
                    var parent = this.nameTable[node.parent];
                    if (parent && (((parent.isSwimlane || parent.isLane) && ej.datavisualization.Diagram.Util.canMove(parent)) || parent.isPhaseStack)) {
                        swimlane = true;
                    }
                }
                if (ej.datavisualization.Diagram.Util.canMove(node) || swimlane) {
                    this._toolToActivate = "move";
                    if (this._isHyperLink(evt)) {
                        this._currentCursor = "pointer";
                    }
                    else if (this.selectionList.length > 0 && (this._selectionContains(node) || (this.selectionList[0].children && this._findChildren(this.selectionList[0], node.name)))) {
                        this._currentCursor = "move";
                    }
                    else {
                        this._currentCursor = "default";
                    }
                    return true;
                }
            }
            return false;
        },
        _isLabelTemplate: function (evt) {
            if (evt) {
                var parents = $(evt.target).parents(".ej-label-template");
                var parent = parents[0]
                if (parent) {
                    var id = parent.parentNode.id.split('_');
                    if (id[id.length - 1] == "lblbg") {
                        return true;
                    }
                    else {
                        var parentNode = evt.target.parentNode;
                        var targetClass = parentNode.getAttribute("class");
                        while (parentNode) {
                            if (targetClass === "ej-label-template")
                                return true;
                            parentNode = parentNode.parentNode;
                            targetClass = parentNode.getAttribute("class");
                        }
                    }
                }
            }
        },
        _isHyperLink: function (evt) {
            var target = evt.target;
            var targetClass = target.getAttribute("class");
            if (!targetClass || !targetClass == "ej-d-label") {
                if (target.parentNode)
                    if ($(target.parentNode).hasClass("ej-d-label")) {
                        target = target.parentNode;
                        if ($(target.parentNode).hasClass("ej-d-anchor")) {
                            return true;
                        }
                    }
            }
            return false;
        },
        _canActivateRotateTool: function (evt, node) {
            if (ej.datavisualization.Diagram.Util.canRotate(node) && (this.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.Rotator)) {
                var rotateHandle = evt.target.getAttribute("class");
                if (rotateHandle === "rotateHandle") {
                    if (node._type !== "label")
                        this._toolToActivate = "rotate";
                    else
                        this._toolToActivate = "labelRotate";
                    if (ej.browserInfo().name === "msie") {
                        this._currentcursor = "default";
                        this._adornerSvg.document.setAttribute("class", "svg-rotate-ie");
                        this._currentCursor = "";
                    }
                    else {
                        this._adornerSvg.document.setAttribute("class", "svg-rotate");
                        this._currentCursor = "";
                    }
                    return true;
                }
            }
            return false;
        },
        _canActivatePivotTool: function (evt) {
            var pivotHandle = evt.target.getAttribute("class");
            if (pivotHandle === "pivot") {
                this._toolToActivate = "pivot";
                this._currentCursor = "default";
                return true;
            }
            return false;
        },
        _updateCursor: function () {
            if (!this._isInit) {
                this.element[0].style.cursor = this._currentCursor;
                this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0].style.cursor = this._currentCursor;
            }
        },
        _getResizeCursor: function (resizeDirection) {
            var cursor = "default";
            switch (resizeDirection) {
                case "topleft": cursor = "nw-resize";
                    break;
                case "topcenter": cursor = "n-resize";
                    break;
                case "topright": cursor = "ne-resize";
                    break;
                case "middleleft": cursor = "w-resize";
                    break;
                case "middleright": cursor = "e-resize";
                    break;
                case "bottomleft": cursor = "sw-resize";
                    break;
                case "bottomcenter": cursor = "s-resize";
                    break;
                case "bottomright": cursor = "se-resize";
                    break;
            }
            return cursor;
        },
        _startEdit: function (shape) {
            var label;
            var centerX, centerY;
            var bbox;
            var nodeBounds;
            var bounds;
            var curZoomfactor;
            var matrix = ej.Matrix.identity();
            var width = shape.width ? shape.width : shape._width;
            var height = shape.height ? shape.height : shape._height;
            ej.Matrix.rotate(matrix, shape.rotateAngle, width / 2, height / 2);
            if (shape.type === "text") {
                if (this._svg.getElementById(shape.name + "_shape") !== null)
                    bbox = this._svg.getElementById(shape.name + "_shape").getBBox();
                else
                    bbox = { x: shape.offsetX - width * shape.pivot.x, y: shape.offsetY - height * shape.pivot.y, width: width, height: height };
                label = shape.textBlock;
                if (label && !label.readOnly) {
                    nodeBounds = ej.datavisualization.Diagram.Util.bounds(shape);
                    bounds = new ej.datavisualization.Diagram.Rectangle(bbox.x - label.fontSize, bbox.y - label.fontSize, bbox.width + label.fontSize / 2, bbox.height + label.fontSize / 2);
                    curZoomfactor = this._currZoom;
                    var diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds));
                    centerX = shape.offsetX - width * shape.pivot.x + diff.x;
                    centerY = shape.offsetY - height * shape.pivot.y + diff.y;
                    if (label.horizontalAlignment == "left")
                        centerX += bbox.width / 2;
                    else if (label.horizontalAlignment == "right")
                        centerX -= bbox.width / 2;
                    if (label.verticalAlignment == "top")
                        centerY += bbox.height / 2;
                    else if (label.verticalAlignment == "bottom")
                        centerY -= bbox.height / 2;
                    if (bbox.width === 0 || bbox.height === 0) {
                        bbox = ej.datavisualization.Diagram.Util.bounds(shape);
                        bounds.width = bbox.width == 0 ? 50 : nodeBounds.width * curZoomfactor;
                        bounds.x = (centerX * curZoomfactor - bounds.width / 2 * curZoomfactor) - this._hScrollOffset;

                        bounds.height = label.fontSize;
                        bounds.y = (centerY * curZoomfactor - bounds.height / 2 * curZoomfactor) - this._vScrollOffset;
                    }
                    else {
                        bounds.width = 50;
                        bounds.height = label.fontSize;
                        bounds.x = (centerX * curZoomfactor - (bounds.width / 2 * curZoomfactor)) - this._hScrollOffset;
                        bounds.y = (centerY * curZoomfactor - (bounds.height / 2 * curZoomfactor)) - this._vScrollOffset;
                    }
                    this._boundingBox = bounds;
                    this._createEditBox(label, bounds.x, bounds.y, bounds.width, bounds.height, shape);
                    this._isEditing = true;
                }
            }
            else {
                if (shape.labels.length > 0) {
                    label = this.activeTool.getLabelUnderMouse();
                    if (!label) label = shape.labels[0];
                }
                else {
                    this._newLabelCreated = true;
                    var mNode = this._findNode(shape.name);
                    label = new ej.datavisualization.Diagram.Label({ "name": "label" + ej.datavisualization.Diagram.Util.randomId() });
                    shape.labels.push(label);
                    var parent = (mNode !== shape) ? mNode : null;
                    ej.datavisualization.Diagram.DiagramContext.addNodeLabel(shape, label, parent, this);
                    if (this.activeTool.name === "textTool")
                        this.activateTool.activeLabel = label;
                }
                if (label && !label.readOnly && label.hyperlink === "" && label.templateId === "") {
                    if (this.model.labelRenderingMode !== "svg") {
                        var htmlLayer = this._htmlLayer ? this._htmlLayer : this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0]
                        var element = $(htmlLayer).find("#" + shape.name + "_" + label.name)[0];
                    }
                    else {
                        var element = this._svg.document.getElementById(shape.name + "_" + label.name);
                    }
                    if (element) {
                        nodeBounds = ej.datavisualization.Diagram.Util.bounds(shape);
                        if (this.model.labelRenderingMode !== "svg") {
                            bounds = new ej.datavisualization.Diagram.Rectangle(element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight);
                            bbox = bounds;
                        }
                        else {
                            bbox = element.getBBox();
                            bounds = new ej.datavisualization.Diagram.Rectangle(0, 0, bbox.width, bbox.height);
                        }
                        curZoomfactor = this.model.labelRenderingMode != "svg" ? this._currZoom : 1;
                        var position = ej.datavisualization.Diagram.Util._getLabelPosition(label, nodeBounds);
                        if (shape.segments || label.relativeMode == "segmentpath") {
                            bounds = element.getBoundingClientRect();
                            bounds = { x: bounds.left, y: bounds.top, width: bounds.width, height: bounds.height };
                            var controlBBox = this._controlBBox ? this._controlBBox : this._canvas.getBoundingClientRect();
                            centerX = (bounds.x + bounds.width / 2 - controlBBox.left + this._hScrollOffset) / curZoomfactor;
                            centerY = (bounds.y + bounds.height / 2 - controlBBox.top + this._vScrollOffset) / curZoomfactor;
                        }
                        else {
                            if (label.horizontalAlignment == "left")
                                position.x += bbox.width / 2;
                            else if (label.horizontalAlignment == "right")
                                position.x -= bbox.width / 2;
                            if (label.verticalAlignment == "top")
                                position.y += bbox.height / 2;
                            else if (label.verticalAlignment == "bottom")
                                position.y -= bbox.height / 2;
                            var diff = ej.Matrix.transform(matrix, position);
                            centerX = shape.offsetX - width * shape.pivot.x + diff.x;
                            centerY = shape.offsetY - height * shape.pivot.y + diff.y;
                        }
                        if (bbox.width === 0 || bbox.height === 0) {
                            bbox = ej.datavisualization.Diagram.Util.bounds(shape);
                            if (shape.segments) {
                                bounds.width = bbox.width < 50 ? 50 : nodeBounds.width;
                                bounds.x = (centerX * curZoomfactor - bounds.width / 2) - this._hScrollOffset;
                            }
                            else {
                                bounds.width = bbox.width < 50 ? 50 : nodeBounds.width;
                                bounds.x = (centerX * curZoomfactor - bounds.width / 2) - this._hScrollOffset;
                            }
                            if (shape.type == "umlclassifier")
                                bounds.height = shape.height;
                            else
                                bounds.height = label.fontSize;
                            bounds.y = (centerY * curZoomfactor - bounds.height / 2 * curZoomfactor) - this._vScrollOffset;
                        }
                        else {
                            bounds.x = (centerX * curZoomfactor - (bounds.width / 2 * curZoomfactor)) - this._hScrollOffset;
                            bounds.y = (centerY * curZoomfactor - (bounds.height / 2 * curZoomfactor)) - this._vScrollOffset;
                        }
                        this._boundingBox = bounds;
                        this._createEditBox(label, bounds.x, bounds.y, bounds.width, bounds.height, shape);
                        this._isEditing = true;
                    }
                    else {
                        this.activeTool.selectedObject = null;
                    }
                }
            }
        },

        _hideShowSVGLabels: function (label, shape, show) {
            if (this._svg && shape) {
                var lblEle;
                if (shape.type === "text")
                    lblEle = this._svg.document.getElementById(shape.name + "_shape_lblbg");
                else
                    lblEle = this._svg.document.getElementById(shape.name + "_" + label.name);
                if (lblEle) {
                    lblEle.setAttribute("visibility", show && (label.visible || shape.visible) ? "visible" : "hidden");
                }

                lblEle = this._svg.document.getElementById(shape.name + "_" + label.name + "_lblbg");
                if (lblEle) {
                    lblEle.setAttribute("visibility", show && label.visible ? "visible" : "hidden");
                }

            }
        },

        _createEditBox: function (label, x, y, width, height, shape) {
            if (this._svg) {
                if (this.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                    this._hideShowSVGLabels(label, shape)
                }
                else {
                    var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                    if (htmlLayer) {
                        if (shape.type === "text")
                            var lblEle = $(htmlLayer).find("#" + shape.name + "_shape_lblbg")[0];
                        else
                            var lblEle = $(htmlLayer).find("#" + shape.name + "_" + label.name + "_lblbg")[0];
                        if (lblEle) {
                            lblEle.style.display = "none";
                        }
                    }
                }
                var nodeBounds = ej.datavisualization.Diagram.Util.bounds(shape);
                var div = document.createElement("div");
                if (label.horizontalAlignment == "stretch" && label.textOverflow && label.rotateAngle == 0 && shape.isSwimlane)
                    y = y - label.fontSize;
                else if (label.horizontalAlignment == "stretch" && !shape.isSwimlane && shape._isHeader && label.textOverflow && label.rotateAngle != 0)
                    x = -x - label.fontSize - width / 4;
                var attr = {
                    "id": this.element[0].id + "_editBoxDiv",
                    "class": "edit",
                    "style": "top:" + y + "px;left:" + x + "px;width:" + width + "px;" +
                        "font-family:" + label.fontFamily + ";font-size:" + label.fontSize + "px;min-width: 50px;min-height:" + label.fontSize + "px;",
                };
                if (ej.datavisualization.Diagram.Util.canZoomTextEditor(this))
                    attr.style += "transform: scale(" + this._currZoom + ");";
                ej.datavisualization.Diagram.Util.attr(div, attr);
                var textBox = document.createElement("textarea");
                var fontColor = label.fontColor ? label.fontColor.toLowerCase() : "black";
                fontColor = fontColor != "white" && fontColor != "ffffff" && fontColor != "rgb(255,255,255)" ? fontColor : "black";
                attr = {
                    "id": this.element[0].id + "_editBox",
                    "class": "editBox",
                    "style": "font-size:" + label.fontSize + "px;font-family:" + label.fontFamily + ";min-height:"
                        + label.fontSize + "px; height: " + height + "px; line-height: normal; color:" + fontColor +
                        ";font-weight:" + (label.bold ? "bold" : "normal") + ";font-style:" + (label.italic ? "italic" : "normal") + ";text-decoration:" + (label.textDecoration),
                    "nodeWidth": nodeBounds.width, "nodeHeight": nodeBounds.height, "fontSize": label.fontSize, "nodeOffsetX": shape.offsetX, "nodeOffsetY": shape.offsetY, "containerName": shape.name,
                };
                ej.datavisualization.Diagram.Util.attr(textBox, attr);
                textBox.value = label.text;
                div.appendChild(textBox);
                $(this._canvas).append(div);
                if (label.text !== "") {
                    this._updateEditor(null, div, textBox, nodeBounds.width, label.fontSize, label, shape);
                }
                this._on($(textBox), "focusout", this._editboxfocusout);
                this._on($(textBox), "keyup", this._editBoxKeyUp);
                this._on($(textBox), "input", this._editBoxTextChange);
                this._on($(textBox), "focusin", this._editboxfocusin);
                textBox.focus();
            }
        },
        _editBoxKeyUp: function (evt) {
            this._updateLabelPosition(evt);
        },
        _editBoxTextChange: function (evt) {
            this._updateLabelPosition(evt);
        },
        _updateEditBox: function (x, y) {
            var editBox = document.getElementById(this.element[0].id + "_editBoxDiv");
            if (editBox) {
                editBox.style.left = editBox.offsetLeft - x + "px";
                editBox.style.top = editBox.offsetTop - y + "px";
            }
        },
        _editboxfocusout: function () {
            this._endEditing = true;
            this._endEdit();
            delete this._endEditing;
        },
        _editboxfocusin: function (evt) {
            evt.target.select();
            this._raiseEvent("editorFocusChange", evt);
        },
        _updateLabelPosition: function (evt) {
            var minWidth = 50;
            var curZoomfactor = this._currZoom;
            var parentBoundary = this._boundingBox;
            var fontSize = Number(evt.target.getAttribute("fontSize"));
            var nodeWidth = Number(evt.target.getAttribute("nodeWidth"));
            var conCenterX = parentBoundary.x + (parentBoundary.width / 2);
            var conCenterY = parentBoundary.y + (parentBoundary.height / 2);
            var bounds = this._textLength(evt);
            var width;
            if (bounds.width === 0) {
                width = parentBoundary.width < minWidth ? minWidth : parentBoundary.width;
                evt.target.parentNode.style.width = width + "px";
                evt.target.parentNode.style.left = conCenterX - width / 2 - fontSize / 4 + "px";
            }
            else {
                if (bounds.width <= (nodeWidth * curZoomfactor))
                    width = bounds.width < minWidth ? minWidth : bounds.width;
                else if (bounds.width >= (nodeWidth * curZoomfactor))
                    width = bounds.width > minWidth ? bounds.width : minWidth;
                else
                    width = nodeWidth < minWidth ? minWidth : (nodeWidth * curZoomfactor);
                evt.target.parentNode.style.width = width + "px";
                evt.target.parentNode.style.left = conCenterX - (width / 2) + "px";
            }
            if (bounds.height === 0) {
                evt.target.style.height = fontSize + "px";
                evt.target.parentNode.style.top = conCenterY - fontSize / 2 + 'px';
            }
            else {
                if (this._selectedItem) {
                    var node = this.nameTable[this._selectedItem];
                    if (node.type === "text") {
                        var label = this._currentLabel;
                    }
                }
            }


            this._updateEditor(evt, evt.target.parentNode, evt.target, nodeWidth, fontSize, label);

        },
        _updateEditor: function (evt, div, textBox, nodeWidth, fontSize, label, shape) {
            var offsetX, offsetY;
            var elHeight;
            var bounds = this._textLength(evt, label);
            var curZoomfactor = (this.model.labelRenderingMode != "svg" || (shape && shape.type === "text")) ? this._currZoom : 1;
            var minWidth = 50;
            var x = this._boundingBox.x;
            var y = this._boundingBox.y;
            var width = this._boundingBox.width;
            var height = this._boundingBox.height;
            var str = textBox.value;
            var line = str.split('\n');
            if (!shape)
                shape = this.activeTool.selectedObject;
            if (shape && shape.parent) {
                var node = this.nameTable[shape.parent];
            }
            if (this._nodeUnderMouse) {
                this.old = this._nodeUnderMouse;
                var type = this._nodeUnderMouse.name.match("_attribute") ? "attribute" : (this._nodeUnderMouse.name.match("_method") ? "method" : (this._nodeUnderMouse.name.match("_member") ? "member" : this._nodeUnderMouse.name.match("_header_classifier") ? "header" : "null"));
            }
            if (this.old)
                var type = this.old.name.match("_attribute") ? "attribute" : (this.old.name.match("_method") ? "method" : (this.old.name.match("_member") ? "member" : this.old.name.match("_header_classifier") ? "header" : "null"));
            if (type && type != "null")
                var temp = bounds.width > nodeWidth ? bounds.width : nodeWidth;
            else
                var temp = nodeWidth < bounds.width ? nodeWidth : bounds.width;
            if (this._browserInfo.name === "mozilla") temp += 2;
            var elWidth = temp < minWidth ? minWidth : temp;
            div.style.width = elWidth + "px";
            if (evt)
                offsetX = (elWidth - width) / 2;
            else
                offsetX = (elWidth - width * curZoomfactor) / 2;
            if (node && node.isLane && label && label.horizontalAlignment == "stretch" && label.textOverflow && label.rotateAngle != 0)
                div.style.left = x - offsetX - fontSize - width / 4 + "px";
            else
                div.style.left = x - offsetX - fontSize / 4 + "px";
            if (line.length > 1 || bounds.width != nodeWidth) {
                if (shape && shape.type != "umlclassifier")
                    textBox.style.height = '0';
                elHeight = (this._browserInfo.name === "mozilla") ? textBox.scrollHeight - 5 : textBox.scrollHeight - 4;
            }
            else
                elHeight = fontSize;
            var offset = $(textBox).offset();
            var canvasOffset = $(this._canvas).offset();
            var canvasHeight = $(this._canvas).height();
            if (!canvasHeight)
                canvasHeight = this._getCanvasHeight(this._canvas, canvasHeight);
            if (offset.top - canvasOffset.top + Number(elHeight) > canvasHeight) {
                elHeight = elHeight - ((offset.top - canvasOffset.top + Number(elHeight)) - (canvasHeight));
                if (this._browserInfo.name === "mozilla")
                    elHeight = elHeight - 7;
                else
                    elHeight = elHeight - 6;
            }
            textBox.style.height = elHeight + "px";
            var top = 0;
            if (evt) {
                offsetY = (elHeight - height) / 2;
                top = y - offsetY * curZoomfactor;
            }
            else {
                if (node && node.isSwimlane && label && label.horizontalAlignment == "stretch" && label.textOverflow && label.rotateAngle == 0)
                    offsetY = (elHeight - height * curZoomfactor) / 2 + label.fontSize;
                else
                    offsetY = (elHeight - height * curZoomfactor) / 2;
                top = y - offsetY - 3 * curZoomfactor;
            }

            div.style.top = top + "px";
            this._boundingBox = new ej.datavisualization.Diagram.Rectangle(x - offsetX, top, elWidth, elHeight);
        },
        _getCanvasHeight: function (canvas, canvasHeight) {
            var height = canvasHeight, element = canvas;
            while (height <= 0) {
                element = element.parentNode;
                if (element) {
                    height = $(element).height();
                }
            }
            return height;
        },
        _textLength: function (evt, label) {
            var temp = document.createElement("div");
            var textElement = document.getElementById(this.element[0].id + "_editBox");
            var attr = {
                "id": this.element[0].id + "_editBoxHiddenDiv",
                "style": "position : absolute; width : auto; height : auto;" +
                         "font-size:" + textElement.style.fontSize + "px;font-family:" + textElement.style.fontFamily + ";word-wrap: break-word;white-space:pre-wrap;",
            };
            if (label) {
                attr.style = "position : absolute; width : auto; height : auto;" + "font-weight:" + (label.bold ? "bold" : "normal") + ";font-style:" + (label.italic ? "italic" : "normal") + ";text-decoration:" + (label.textDecoration) + ";font-size:" + label.fontSize + "px;font-family:" + label.fontFamily + ";word-wrap: break-word;white-space:pre-wrap;";
            }
            ej.datavisualization.Diagram.Util.attr(temp, attr);
            if (evt) {
                temp.appendChild(document.createTextNode(evt.target.value));
            } else {
                temp.appendChild(document.createTextNode(textElement.value));
            }
            document.body.appendChild(temp);
            var bounds = temp.getBoundingClientRect();
            document.body.removeChild(temp);
            return bounds;
        },
        _endEdit: function (keyCode) {
            var args, entry, label, prevWidth, prevHeight;
            var editBox = document.getElementById(this.element[0].id + "_editBox");
            if (editBox) {
                var shape = this._findNode(editBox.getAttribute("containerName"));;
                if (this.activeTool.name === "textTool")
                    shape = this.activeTool.selectedObject;
                else if (!shape) {
                    for (var i = 0; i < this.selectionList.length; i++) {
                        var mNode = this.selectionList[i];
                        if (typeof mNode.labels.length != "undefined" && mNode.labels.length > 0 && mNode.labels[0].mode === ej.datavisualization.Diagram.LabelEditMode.Edit)
                            shape = this.selectionList[i];
                    }
                }
                if (shape) {
                    this._isEditing = false;
                    var label;
                    if (shape.type == "text") label = shape.textBlock;
                    else {
                        label = this.activeTool.getLabelUnderMouse();
                        if (!label) label = shape.labels[0];
                    }
                    if (shape.type == "umlclassifier")
                        editBox.value = ej.datavisualization.Diagram.ClassifierHelper.getEditboxValue(editBox.value, shape, this);
                    if (label) var prevText = label.text;
                    if (shape._type == "node" && (!shape.width || !shape.height) && this.nameTable[shape.name]) {
                        prevWidth = shape._width;
                        prevHeight = shape._height;
                        shape.labels[0].text = editBox.value;
                        this._getNodeDimension(shape);
                    }
                    if (shape.type == "umlclassifier")
                        shape = ej.datavisualization.Diagram.ClassifierHelper.getClassifierNodeDimension(shape, this);
                    var tempKeyCode;
                    if (keyCode) {
                        tempKeyCode = keyCode.keyDownEventArgs.keyCode === 27 ? "ESC" : String.fromCharCode(keyCode.keyDownEventArgs.keyCode);
                    }
                    if (editBox.value != prevText)
                        args = this._raiseEvent("textChange", { element: this.getNode(shape), label: label, value: editBox.value, keyCode: tempKeyCode });
                    if (!args) {
                        if (shape && shape.type !== undefined && shape.type === "text") {
                            var oldText = prevText;
                            shape.textBlock.text = editBox.value;
                            shape.textBlock.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                            if (!this._findNode(shape.name)) {
                                if (editBox.value !== "") {
                                    var height = Number(editBox.style.height.substring(0, editBox.style.height.length - 2));
                                    if (shape.height < height) {
                                        shape.offsetY = (shape.offsetY - (shape.height / 2)) + (height / 2);
                                        shape.height = height;
                                    }
                                    if (this.selectionList.length > 0)
                                        this._clearSelection(true);
                                    if (this.tools["move"]._outOfBoundsDrag(shape)) {
                                        this.add(shape);
                                        var parent = this.nameTable[shape.parent];
                                        if (parent && parent.isLane) {
                                            var move = this._moveOnLane(shape, parent);
                                            if (!move.proceedX)
                                                this.updateNode(shape.name, { offsetX: shape.offsetX + move.x });
                                            if (!move.proceedY)
                                                this.updateNode(shape.name, { offsetY: shape.offsetY + move.y });
                                            //delete this._preventDocking;

                                            this._updateNodeMargin(shape);
                                            ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this);
                                            this._disableSwimlaneUptate = true;
                                            ej.datavisualization.Diagram.canvasHelper._updateCollectionChange(this, parent);
                                            if (parent.isLane) {
                                                var swimlane = this._getSwimlane(parent);
                                                if (swimlane) {
                                                    this._updateChildAdjacentConnectors(swimlane, true);
                                                    delete this._disableSwimlaneUptate;
                                                    ej.datavisualization.Diagram.canvasHelper._updateLastPhase(this, swimlane);
                                                    ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this, swimlane);
                                                }
                                            }
                                        }
                                    }
                                }
                                this.activeTool.selectedObject = null;
                            } else {
                                //delete this._preventDocking;
                                ej.datavisualization.Diagram.DiagramContext.update(shape, this);
                                entry = { type: "labelchanged", shape: shape, previousLabelValue: oldText, updatedLabelValue: editBox.value, category: "internal" };
                                this.addHistoryEntry(entry);
                                //entry = new ej.datavisualization.Diagram.HistoryEntry(new ej.datavisualization.Diagram.TextChangeCmd(shape, shape.textBlock.text, editBox.value));
                                //this.historyManager.addHistoryEntry(entry);
                            }
                        } else if (shape != undefined && !(shape.type == "pseudoGroup")) {
                            if (label != undefined) {
                                this._comparePropertyValues(label, "text", { text: editBox.value });
                                prevText = prevText ? prevText : label.text;
                                if (prevText != editBox.value) {
                                    if (this._newLabelCreated) {
                                        label.text = editBox.value;
                                        entry = { type: "labelcollectionchanged", shape: shape, label: label, isUndo: true, category: "internal" };
                                    }
                                    else entry = { type: "labelchanged", shape: shape, previousLabelValue: label.text, updatedLabelValue: editBox.value, index: shape.labels.indexOf(label), category: "internal" };
                                    this.addHistoryEntry(entry);
                                    //entry = new ej.datavisualization.Diagram.HistoryEntry(new ej.datavisualization.Diagram.LabelChangeCmd(shape, label.text, editBox.value));
                                    //this.historyManager.addHistoryEntry(entry);
                                }
                                label.text = editBox.value;
                                label.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                                ej.datavisualization.Diagram.DiagramContext.updateLabel(shape, label, this);
                                if (shape.isPhase) {
                                    if ((shape.name).split("phaseStack")[1])
                                        var phase = this.nameTable[(shape.name).split("phaseStack")[1]];
                                    if (phase && phase.label)
                                        phase.label.text = editBox.value;
                                }
                                this.activeTool.selectedObject = null;
                            }
                            else if (shape.labels.length == 0) {
                                label = ej.datavisualization.Diagram.Label();
                                label.text = editBox.value;
                                label.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                                shape.labels.push(label);
                                ej.datavisualization.Diagram.DiagramContext.addNodeLabel(shape, label, null, this);
                            }
                            if (this.activeTool.activeLabel) this.activeTool.activeLabel = null;
                        }
                        if (shape.shape && shape.shape.type == "umlclassifier")
                            shape = ej.datavisualization.Diagram.ClassifierHelper.getUMLConnectorValue(shape, editBox.value, label);
                        if (shape._type == "node" && (!shape.width || !shape.height) && this.nameTable[shape.name]) {
                            ej.datavisualization.Diagram.DiagramContext.update(shape, this);
                            if (shape.parent) ej.datavisualization.Diagram.DiagramContext.update(this.nameTable[shape.parent], this);

                        }

                        if (shape.type == "umlclassifier") {
                            shape.labels[0].text = "";
                            ej.datavisualization.Diagram.DiagramContext.update(shape, this);
                        }
                        if (shape.shape && shape.shape.type == "umlclassifier")
                            ej.datavisualization.Diagram.DiagramContext.update(shape, this);
                    }
                    else {
                        if (shape._width && prevWidth) shape._width = prevWidth;
                        if (shape._height && prevHeight) shape._height = prevHeight;
                        if (shape && shape.type === "text") {
                            ej.datavisualization.Diagram.DiagramContext.update(shape, this);
                        }
                        else {
                            label = this.activeTool.activeLabel ? this.activeTool.activeLabel : (shape.labels.length > 0 ? shape.labels[0] : null);
                            if (label != undefined) {
                                label.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                                ej.datavisualization.Diagram.DiagramContext.updateLabel(shape, label, this);
                            }
                        }
                        if (this.activeTool) {
                            this.activeTool.activeLabel = null;
                            this.activeTool.selectedObject = null;
                        }
                    }
                }
                this._off($(editBox), "focusout", this._editboxfocusout);
                this._off($(editBox), "keyup", this._editBoxKeyUp);
                this._off($(editBox), "input", this._editBoxTextChange);
                var element = $("#" + this.element[0].id + "_editBoxDiv")[0];
                if (element)
                    element.parentNode.removeChild(element);
                if (this._svg) {
                    if (this.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                        this._hideShowSVGLabels(label, shape, true);
                    } else {
                        var htmlLayer = this._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                        if (htmlLayer) {
                            if (shape.type === "text")
                                var lblEle = $(htmlLayer).find("#" + shape.name + "_shape_lblbg")[0];
                            else {
                                if (label)
                                    var lblEle = $(htmlLayer).find("#" + shape.name + "_" + label.name + "_lblbg")[0];
                            }
                            if (lblEle) {
                                lblEle.style.display = "block";
                            }
                        }
                    }
                    if (shape)
                        this._updateQuad(shape);
                }
            }
            if (keyCode && keyCode.keyDownEventArgs && keyCode.keyDownEventArgs.keyCode === 27)
                this.element[0].focus();
            delete this._newLabelCreated;
        },
        _getSwimlane: function (lane) {
            var swimlane;
            lane = typeof (lane) === "string" ? this.nameTable[lane] : lane;
            var laneStack = this.nameTable[lane.parent];
            if (laneStack)
                swimlane = this.nameTable[laneStack.parent];
            return swimlane
        },
        _setLabelEditing: function (label) {
            var success;
            if (label) {
                if (label.readOnly) {
                    label.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                    success = false;
                }
                else {
                    if (this._currentLabel)
                        this._currentLabel.mode = ej.datavisualization.Diagram.LabelEditMode.View;
                    label.mode = ej.datavisualization.Diagram.LabelEditMode.Edit;
                    this._currentLabel = label;
                    success = true;
                }
                return success;
            }
        },
        _isInternalTool: function (tool) {
            if (tool instanceof ej.datavisualization.Diagram.SelectTool || tool instanceof ej.datavisualization.Diagram.ConnectionEditTool || tool instanceof ej.datavisualization.Diagram.MoveTool || tool instanceof ej.datavisualization.Diagram.ResizeTool
                || tool instanceof ej.datavisualization.Diagram.LabelMoveTool || tool instanceof ej.datavisualization.Diagram.LabelResizeTool || tool instanceof ej.datavisualization.Diagram.LabelRotateTool
                  || tool instanceof ej.datavisualization.Diagram.PhaseTool || tool instanceof ej.datavisualization.Diagram.RotateTool || (tool instanceof ej.datavisualization.Diagram.PanTool && (this.tool() & ej.datavisualization.Diagram.Tool.SingleSelect) && (this.tool() & ej.datavisualization.Diagram.Tool.ZoomPan)))
                return true;
            else
                return false;
        },
        _updateNodeMargin: function (node) {
            if (node.parent != "") {
                var group = this.nameTable[node.parent];
                if (group && group.container && group.container.type == "canvas") {
                    var groupBounds = ej.datavisualization.Diagram.Util.bounds(group);
                    var bounds1 = ej.datavisualization.Diagram.Util.bounds(node);
                    var bounds = ej.datavisualization.Diagram.Geometry.rect([bounds1.topLeft, bounds1.topRight, bounds1.bottomRight, bounds1.bottomLeft]);
                    node.marginLeft = bounds.x - (groupBounds.x + group.paddingLeft);
                    var right = (groupBounds.x + group.width) - (bounds.x + bounds.width) - group.paddingRight;
                    (right < 0) ? node.marginRight = 0 : node.marginRight = right;
                    node.marginTop = bounds.y - (groupBounds.y + group.paddingTop);
                    var bottom = (groupBounds.y + group.height) - (bounds.y + bounds.height) - group.paddingBottom;
                    (bottom < 0) ? node.marginBottom = 0 : node.marginBottom = bottom;
                    if (group.isLane) {
                        var left = 0, top = 0;
                        if (group.orientation === "horizontal") {
                            left = 50, top = 0;
                        }
                        else {
                            left = 0, top = 50;
                        }
                        node.marginLeft = node.marginLeft >= left ? node.marginLeft : left;
                        node.marginTop = node.marginTop >= top ? node.marginTop : top;
                    }
                }
            }
            if ((node.type == "pseudoGroup" || node.name == "multipleSelection") && node.children.length > 0) {
                var child;
                for (var i = 0; i < node.children.length; i++) {
                    child = this.nameTable[this._getChild(node.children[i])];
                    if (child) {
                        this._updateNodeMargin(child);
                    }
                }
            }
        },
        _raisePropertyChange: function (resource) {
            if (resource) {
                if (this._isSizingCommand)
                    resource.cause = ej.datavisualization.Diagram.ActionType.Size;
                else if (this._isUndo)
                    resource.cause = ej.datavisualization.Diagram.ActionType.HistoryChange;
                else if (this._isTouchedEvent)
                    resource.cause = ej.datavisualization.Diagram.ActionType.Touch;
                this._raiseEvent("propertyChange", resource);
            }
        },
        _updateAdjacentEdges: function (node, connTable) {
            var i, len;
            if (node.inEdges && node.inEdges.length > 0) {
                for (i = 0, len = node.inEdges.length; i < len; i++) {
                    connTable[node.inEdges[i]] = this.nameTable[node.inEdges[i]];
                }
            }
            if (node.outEdges && node.outEdges.length > 0) {
                for (i = 0, len = node.outEdges.length; i < len; i++) {
                    connTable[node.outEdges[i]] = this.nameTable[node.outEdges[i]];
                }
            }
        },
        _translate: function (node, dx, dy, nameTable, isContainer, connectorTable) {
            if (dx || dy) {
                if (!node.segments) {
                    if (!connectorTable) { var init = true; }
                    var connectorTable = connectorTable || {};
                    this._updateAdjacentEdges(node, connectorTable);
                    node.offsetX += dx;
                    node.offsetY += dy;
                    if (!this._parentNode && this.activeTool.name != "phase") this._parentNode = node;
                    if ((node._type === "group" || node.type === "pseudoGroup") && !isContainer) {
                        var nodes = this._getChildren(node.children);
                        var child;
                        for (var i = 0; i < nodes.length; i++) {
                            child = nameTable[this._getChild(nodes[i])];
                            if (child) {
                                this._translate(child, dx, dy, nameTable, undefined, connectorTable);
                                if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                    ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], this);
                            }
                        }
                        if (node.type != "group" && node.container)
                            ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                        if (!this._isUndo)
                            this._updateNodeFromGraph(node);
                    }
                    if (node != this.activeTool.helper) {
                        //this._updateAssociatedConnectorEnds(node, nameTable);
                        if (this.nameTable[node.name]) this._updateQuad(node);
                        ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(node, dx, dy, null, this);
                        if (!this._isUndo)
                            this._updateNodeFromGraph(node);
                    }
                    if (this._parentNode == node) delete this._parentNode;
                    if (init && !this._preventDocking && node != this.activeTool.helper && !this._disableSegmentChange) {
                        for (var i in connectorTable) {
                            var child = this.nameTable[i];
                            if (child) {
                                if (node.isSwimlane || ((node.type == "pseudoGroup" || node.type == "group") && !this._containsChild(node, child)))
                                    ej.datavisualization.Diagram.Util._translateLine(child, dx, dy, child);
                                this._dock(child, this.nameTable);
                                if (this._isLayoutRoute)
                                    this._routeEdge(child);
                                if (child.annotation) ej.datavisualization.Diagram.DefautShapes.updateAnnotationProperties(child, this);
                            }
                        }
                    }
                } else {
                    ej.datavisualization.Diagram.Util._translateLine(node, dx, dy, node);
                    this._dock(node, nameTable);
                    ej.datavisualization.Diagram.Util.updateBridging(node, this);
                    this._updateConnectorBridging(node);
                }
            }
            else return false;
        },
        _containsChild: function (group, child) {
            if (group.children && group.children.length > 0) {
                var children = this._getChildren(group.children);
                for (var i = 0; i < children.length; i++) {
                    var connector = this._collectionContains(child.name, children);
                    if (!connector) {
                        var subgroup = this._getChild(children[i]);
                        if (subgroup && subgroup.children)
                            this._containsChild(subgroup, child);
                    }
                    else return true;

                }
            }
        },
        _translatePort: function (node, port, dx, dy) {
            port.offset["x"] = port.offset["x"] + dx / node.width;
            port.offset["y"] = port.offset["y"] + dy / node.height;
            ej.datavisualization.Diagram.DiagramContext.updatePort(node, port, this);
            var panel = this._adornerSvg;
            this._updateAssociatedConnectorEnds(node, this.nameTable, true);
        },
        _translateLabel: function (node, label, dx, dy) {
            var preventLabelupdate = false;
            if (node && node.segments && label.relativeMode === "segmentpath" && ej.datavisualization.Diagram.Util.isAllowDragLimit(node)) {
                preventLabelupdate = true;
            }
            if (!preventLabelupdate) {
                var clnLabel = $.extend(true, {}, label);
                label.margin["left"] += dx;
                label.margin["top"] += dy;
                label.margin["right"] -= dx;
                label.margin["bottom"] -= dy;
                if (label.horizontalAlignment == "center") label.margin["right"] = 0;
                if (label.verticalAlignment == "center") label.margin["bottom"] = 0;
                ej.datavisualization.Diagram.DiagramContext.updateLabel(node, label, this);
                this._comparePropertyValues(node, "labels", clnLabel);
            }
        },
        translateLabel: function (node, label, dx, dy) {
            if (node) {
                if (node.segments && label.relativeMode === "segmentpath" && !ej.datavisualization.Diagram.Util.isAllowDragLimit(node)) {
                    var clnLabel = $.extend(true, {}, label);
                    label.margin["left"] += dx;
                    label.margin["top"] += dy;
                    label.margin["right"] -= dx;
                    label.margin["bottom"] -= dy;
                    if (label.horizontalAlignment == "center") label.margin["right"] = 0;
                    if (label.verticalAlignment == "center") label.margin["bottom"] = 0;
                    ej.datavisualization.Diagram.DiagramContext.updateLabel(node, label, this);
                    this._comparePropertyValues(node, "labels", clnLabel);
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    label.offset["x"] += dx / bounds.width;
                    label.offset["y"] += dy / bounds.height;
                    ej.datavisualization.Diagram.DiagramContext.updateLabel(node, label, this);
                }
            }
        },
        _rotate: function (node, angle, nameTable) {
            if (!node.segments && angle) {
                node.rotateAngle += angle;
                node.rotateAngle %= 360;
                if (node.rotateAngle < 0) node.rotateAngle += 360;
                if ((node._type === "group" || node.type === "pseudoGroup")) {
                    var matrix = ej.Matrix.identity();
                    var child, pinx, piny;
                    ej.Matrix.rotate(matrix, angle, node.offsetX, node.offsetY);
                    var nodes = this._getChildren(node.children);
                    var child;
                    for (var i = 0; i < nodes.length; i++) {
                        child = nameTable[nodes[i]];
                        if (child) {
                            if (!(child.segments)) {
                                this._rotate(child, angle, nameTable);
                                pinx = child.offsetX;
                                piny = child.offsetY;
                                var actualpt = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(pinx, piny));
                                this._translate(child, actualpt.x - pinx, actualpt.y - piny, nameTable);
                                this._updateAssociatedConnectorEnds(child, nameTable);
                            } else {
                                if (!child.sourceNode)
                                    this._setEndPoint(child, ej.Matrix.transform(matrix, child.sourcePoint), false);
                                if (!child.targetNode)
                                    this._setEndPoint(child, ej.Matrix.transform(matrix, child.targetPoint), true);
                            }
                            if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], this);
                        }
                    }
                    ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                }
                if (node.parent) {
                    this._updateParentBounds(node.parent);
                }
                if (node != this.activeTool.helper)
                    this._updateQuad(node);
                this._updateAssociatedConnectorEnds(node, nameTable);
            }
        },

        _raiseOffsetPropertyChange: function (shape, offsetX, offsetY, interaction) {
            if (shape && !shape.segments) {
                offsetX = offsetX ? offsetX : 0;
                offsetY = offsetY ? offsetY : 0;
                if (offsetX != shape.offsetX)
                    this._comparePropertyValues(shape, "offsetX", { offsetX: offsetX }, interaction);
                if (offsetY != shape.offsetY)
                    this._comparePropertyValues(shape, "offsetY", { offsetY: offsetY }, interaction);
            }
            else {
                offsetX = offsetX ? offsetX : 0;
                offsetY = offsetY ? offsetY : 0;
                this._comparePropertyValues(shape, "sourcePoint", { sourcePoint: { x: shape.sourcePoint.x + offsetX, y: shape.sourcePoint.y + offsetY } }, interaction);
                this._comparePropertyValues(shape, "targetPoint", { targetPoint: { x: shape.targetPoint.x + offsetX, y: shape.targetPoint.y + offsetY } }, interaction);
            }
        },
        _raiseSizePropertyChange: function (shape, delWidth, delHeight, interaction) {
            if (shape && delHeight && delWidth) {
                var height = shape.height * delHeight;
                var width = shape.width * delWidth;
                if (height != shape.height) {
                    this._comparePropertyValues(shape, "height", { height: height }, interaction);
                    this._comparePropertyValues(shape, "offsetY", { offsetY: shape.offsetY + (height - shape.height) }, interaction);
                }
                if (width != shape.width) {
                    this._comparePropertyValues(shape, "width", { width: width }, interaction);
                    this._comparePropertyValues(shape, "offsetX", { offsetX: shape.offsetX + (width - shape.width) / 2 }, interaction);
                }
            }
        },

        scale: function (node, sw, sh, pivot, nameTable, skipScalOnChild, updateMinMax, isHelper) {
            if ((sw && sw != 1) || (sh && sh != 1) || node.isPhase) {
                if (!node.container) {
                    var matrix = ej.Matrix.identity();
                    if (!node.segments) {
                        if ((node._type === "group" || node.type === "pseudoGroup") && !this._scalePseudoGroup) {
                            if (node.type != "bpmn" || (node.width * sw >= 1 && node.height * sh >= 1)) {
                                var oldOffsetX = { x: node.offsetX, y: node.offsetY }
                                var nodes = this._getChildren(node.children);
                                var child;
                                for (var i = 0; i < nodes.length; i++) {
                                    child = nameTable[nodes[i]];
                                    if (child && (node.type != "bpmn" || ej.datavisualization.Diagram.Util.canResize(child))) {
                                        this.scale(child, sw, sh, pivot, nameTable);
                                        if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                            ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], this);
                                    }
                                }
                                if (node.type == "bpmn")
                                    ej.datavisualization.Diagram.Util._updateBPMNProperties(node, this, nameTable, true);
                                if (node.children.length <= 0) {
                                    ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                                    ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                                    ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                                    var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                                    var width = node.width ? node.width * sw : node._width * sw;
                                    var height = node.height ? node.height * sh : node._height * sh;
                                    if (width > 1) {
                                        if (node.width) {
                                            if (width != node.width) node._scaled = true;
                                            node.width = width;
                                            node.offsetX = newPosition.x;
                                        } else {
                                            if (width != node._width) node._scaled = true;
                                            node.maxWidth = (node.parent && nameTable[node.parent].width != node.maxWidth) ? nameTable[node.parent].width : width;
                                            node.offsetX = newPosition.x - (node._width * sw - node._width) / 2;
                                        }
                                    }
                                    if (height > 1) {
                                        if (node.height) {
                                            if (height != node.height) node._scaled = true;
                                            node.height = height;
                                            node.offsetY = newPosition.y;
                                        } else {
                                            if (height != node._height) node._scaled = true;
                                            node.maxHeight = (node.parent && nameTable[node.parent].height > height) ? nameTable[node.parent].height : height;
                                            node.offsetY = newPosition.y - (node._height * sh - node._height) / 2;
                                        }
                                    }
                                }
                                if (node.type === "pseudoGroup") {
                                    this._scalePseudoGroup = true;
                                    this.scale(node, sw, sh, pivot, nameTable);
                                    delete this._scalePseudoGroup;
                                }
                                else {
                                ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                                }
                                if (node != this.activeTool.helper) ej.datavisualization.Diagram.DefautShapes.translateBPMNAnnotationShape(node, 1 / sw, 1 / sh, oldOffsetX, this);
                            }
                        } else {
                            ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                            ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                            ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                            var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                            var width = node.width * sw;
                            var height = node.height * sh;

                            if (node.maxWidth != 0)
                                width = Math.min(node.maxWidth, width);
                            if (node.minWidth != 0)
                                width = Math.max(node.minWidth, width);
                            if (node.maxHeight != 0)
                                height = Math.min(node.maxHeight, height)
                            if (node.minHeight != 0)
                                height = Math.max(node.minHeight, height);

                            if (width > 0) {
                                if (width != node.width) {
                                    node._scaled = true;
                                }
                                if (width != node.maxWidth && width != node.minWidth) {
                                    node.width = width;
                                    node.offsetX = newPosition.x;
                                    for (var i = 0; i < node.labels.length; i++) {
                                        node.labels[i].width = node.labels[i].width * sw;
                                    }
                                }
                            }

                            if (height > 0) {
                                if (height != node.height) {
                                    node._scaled = true;
                                }
                                if (height != node.maxHeight && height != node.minHeight) {
                                    node.height = height;
                                    node.offsetY = newPosition.y;
                                    for (var i = 0; i < node.labels.length; i++) {
                                        node.labels[i].height = node.labels[i].height * sh;
                                    }
                                }
                            }
                        }
                        if (node.parent) {
                            this._updateParentBounds(node.parent);
                        }
                        ej.datavisualization.Diagram.Util._updateBPMNProperties(node, this, nameTable, true);
                        if (!(this.activeTool.name == "resize" && this.activeTool.inAction && this.selectionList[0] &&
                            this.selectionList[0].type != "pseudoGroup" && this.selectionList[0].type != "group"))
                            this._updateAssociatedConnectorEnds(node, nameTable);
                        if (node != this.activeTool.helper)
                            this._updateQuad(node);
                    } else {
                        ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                        for (var i = 0; i < node.segments.length; i++) {
                            var segment = node.segments[i];
                            for (var j = 0; j < segment.points.length; j++) {
                                segment.points[j] = ej.Matrix.transform(matrix, segment.points[j]);
                                if (i == 0 && j == 0 && !node.sourceNode) {
                                    segment._startPoint = segment.points[0];
                                    segment._endPoint = segment.points[segment.points.length - 1];
                                    ej.datavisualization.Diagram.Util._setLineEndPoint(node, ej.Matrix.transform(matrix, node.sourcePoint), false);
                                }
                                if (i == node.segments.length - 1 && j == segment.points.length - 1 && !node.targetNode) {
                                    segment._startPoint = segment.points[0];
                                    segment._endPoint = segment.points[segment.points.length - 1];
                                    node.targetPoint = segment._endPoint;
                                }
                            }
                            segment._startPoint = segment.points[0];
                            segment._endPoint = segment.points[segment.points.length - 1];
                            if (segment.type == "orthogonal") {
                                if (segment.length || segment.length === 0)
                                    segment.length = segment._length = ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, segment._endPoint);
                                else
                                    ej.datavisualization.Diagram.Util._addOrthogonalPoints(segment, node.segments[i - 1], node.segments[i + 1], node.sourcePoint, node.targetPoint);
                            } else {
                                if (segment.point) {
                                    segment.point = segment._endPoint;
                                }
                                segment._point = segment._endPoint;
                            }

                        }
                        if (node.sourceNode || node.targetNode)
                            this._dock(node, nameTable);
                    }
                } else {
                    switch (node.container.type) {
                        case "canvas":
                            var newSize = {};
                            var matrix = ej.Matrix.identity();
                            ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                            ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                            ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                            newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                            width = node.width * sw;
                            height = node.height * sh;

                            if (updateMinMax) {
                                node.minHeight = height;
                                node.minWidth = width;
                            }
                            newSize.width = width;
                            newSize.height = height;
                            if (newSize && newSize.width > 1) {
                                var x = node.offsetX - node.width / 2;
                                if (node.width != newSize.width) node._scaled = true;
                                node.width = newSize.width;
                                node.offsetX = node._isBpmn ? newPosition.x : x + node.width / 2;
                            }
                            if (newSize && newSize.height > 1) {
                                var y = node.offsetY - node.height / 2;
                                if (node.height != newSize.height) node._scaled = true;
                                node.height = newSize.height;
                                node.offsetY = node._isBpmn ? newPosition.y : y + node.height / 2;
                            }

                            break;
                        case "stack":
                            var matrix = ej.Matrix.identity();
                            ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                            ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                            ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                            newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                            var marginLeft = 0;
                            var marginRight = 0;
                            if (sw != 0) {
                                marginLeft = node.marginLeft;
                                marginRight = node.marginRight;
                            }
                            width = (node.width * sw) - (marginLeft + marginRight);
                            height = (node.height * sh) - (node.marginTop + node.marginBottom);
                            newSize = { height: node.height, width: node.width }
                            if (this._resizeStack) {
                                node.width = width;
                                node.height = height;

                                node.offsetX = newPosition.x;
                                node.offsetY = newPosition.y;
                            }
                            break;
                    }
                }
            }
        },
        _updateParentBounds: function (node) {
            node = this.nameTable[this._getChild(node)];
            if (node && node.type != "bpmn" && !node.container) {
                ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                ej.datavisualization.Diagram.DiagramContext.update(node, this);
                if (node.parent) {
                    this._updateParentBounds(node.parent);
                }
            }
        },
        _dock: function (connector, nameTable, updateSelection) {
            if (!this._preventDocking && !this._disableSegmentChange && (!this._layoutInAction || !this._isAnimating)) {
                var length = connector.segments.length;
                var srcPointslength = connector.segments[0].points.length;
                var targetPointslength = connector.segments[connector.segments.length - 1].points.length;
                if (this._preventSegmentAdjusting) connector._preventSegmentAdjusting = true;
                ej.datavisualization.Diagram.Util.dock(connector, nameTable, this);
                delete connector._preventSegmentAdjusting;
                if (length != connector.segments.length && this._svg) {
                    ej.datavisualization.Diagram.Util._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort, this);
                    ej.datavisualization.Diagram.DiagramContext._refreshSegments(connector, this);
                }
                if (this.selectionList[0] == connector) {
                    if (updateSelection || srcPointslength != connector.segments[0].points.length || targetPointslength != connector.segments[connector.segments.length - 1].points.length) {
                        ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.selectionList[0], this._adornerSvg, this._currZoom);
                    }
                }
                this._updateQuad(connector);
            }
        },

        _updateChildAdjacentConnectors: function (node, dock) {
            var childTable = this._getChildTable(node, {});
            for (var child in childTable) {
                var childNode = this.nameTable[child];
                if (childNode && childNode.segments && node.children.indexOf(child) == -1) {
                    if (!dock)
                        childNode._staticLength = true;
                    this._dock(childNode, this.nameTable);
                    delete childNode._staticLength;
                    ej.datavisualization.Diagram.DiagramContext.update(childNode, this);
                }
            }
        },

        _setEndPoint: function (connector, point, isTarget) {
            ej.datavisualization.Diagram.Util._setLineEndPoint(connector, point, isTarget);
            this._updateQuad(connector);
        },
        _updateAssociatedConnectorEnds: function (node, nameTable, translatePort) {
            var i, len;
            var connector;
            if (!node.segments && (node.inEdges.length || node.outEdges.length)) {
                //Finding the segment points to avoid calculating path points multiple times to dock every edge
                var nodeToNode = this._isNodeToNodeConnection(node);
                var nodeToDock = node;
                if (node.type == "bpmn" && node._type == "group") {
                    nodeToDock = typeof node.children[0] == "object" ? node.children[0] : this.nameTable[node.children[0]];
                }
                if (nodeToNode) {
                    var segmentPoints = ej.datavisualization.Diagram.Util._findSegmentPoints(nodeToDock);
                }
                var childTable = {};
                if (this._parentNode) {
                    childTable = this._getChildTable(this._parentNode, {});
                }
                for (i = 0, len = node.inEdges.length; i < len; i++) {
                    connector = nameTable[node.inEdges[i]];
                    if (connector && !(this._parentNode && childTable[connector.sourceNode])) {
                        if (!connector.targetPadding) {
                            nodeToDock._segmentPoints = segmentPoints;
                        }
                        else delete nodeToDock._segmentPoints;
                        this._dock(connector, nameTable);
                        if (translatePort)
                            ej.datavisualization.Diagram.DiagramContext.update(connector, this);
                    }
                }
                for (i = 0, len = node.outEdges.length; i < len; i++) {
                    connector = nameTable[node.outEdges[i]];
                    if (connector && !(this._parentNode && childTable[connector.targetNode])) {
                        if (!connector.sourcePadding) { nodeToDock._segmentPoints = segmentPoints; }
                        else delete nodeToDock._segmentPoints;
                        this._dock(connector, nameTable);
                        if (translatePort)
                            ej.datavisualization.Diagram.DiagramContext.update(connector, this);
                    }
                }
                delete nodeToDock._segmentPoints;
            }
        },
        _isNodeToNodeConnection: function (node) {
            var i, len;
            if (node.inEdges.length) {
                for (i = 0, len = node.inEdges.length; i < len; i++) {
                    if (this.nameTable[node.inEdges[i]] && !this.nameTable[node.inEdges[i]].targetPort && (node.type != "bpmn" || this.nameTable[node.inEdges[i]].segments[0].type != "orthogonal")) return true;
                }
            }
            if (node.outEdges.length) {
                for (i = 0, len = node.outEdges.length; i < len; i++) {
                    if (this.nameTable[node.outEdges[i]] && !this.nameTable[node.outEdges[i]].sourcePort && (node.type != "bpmn" || this.nameTable[node.outEdges[i]].segments[this.nameTable[node.outEdges[i]].segments.length - 1].type != "orthogonal")) return true;
                }
            }
        },
        _updateChildBounds: function (node, nameTable) {
            var offX, offY;
            if (node.width == 0 && node.height == 0) {
                offX = node.offsetX;
                offY = node.offsetY;
                ej.datavisualization.Diagram.Util._updateGroupBounds(node, this);
                this._translate(node, offX - node.offsetX, offY - node.offsetY, nameTable);
            }
            else {
                offX = node.offsetX;
                offY = node.offsetY;
                var childBounds = ej.datavisualization.Diagram.Util._getChildrenBounds(node, this);
                node.offsetX = (childBounds.x + childBounds.width * node.pivot.x);
                node.offsetY = (childBounds.y + childBounds.height * node.pivot.y);
                var dx = offX - node.offsetX;
                var dy = offX - node.offsetY;
                this._translate(node, dx, dy, nameTable);
                var deltaWidth = node.width / childBounds.width;
                var deltaHeight = node.height / childBounds.height;
                this.scale(node, deltaWidth, deltaHeight, node.pivot, nameTable);;
                this._translate(node, offX - node.offsetX, offY - node.offsetY, nameTable);
            }
        },
        _isLastChildOfParent: function (object) {
            var parent = this.nameTable[object.parent], child;
            if (parent.children) {
                for (var i = 0; i < parent.children.length; i++) {
                    child = this.nameTable[this._getChild(parent.children[i])];
                    if (child && child.name == object.name && i == parent.children.length - 1) {
                        return true;
                    }
                }
            }
            return false;
        },
        _updateQuad: function (object) {
            if (this._spatialSearch && this.nameTable[object.name]) {
                var type = this.getObjectType(object), skip = false;
                if (object.isPhase || object.isLane || object._isHeader || object.isLaneStack || object.isPhaseStack || object._isInternalShape || object.type == "pseudoGroup") skip = true;
                if (object.parent && this.nameTable[object.parent]) {
                    var parent = this.nameTable[object.parent];
                    if (parent.isPhaseStack || parent.isSwimlane) skip = true;
                    if (parent.type != "bpmn" && this._isLastChildOfParent(object)) this._updateQuad(parent);
                }
                if (this._selectedSymbol != null)
                    if (this._selectedSymbol.isLane && object.isLane && !object.parent) {
                        skip = false;
                    }
                if (this._disableUpdateQuad)
                    skip = true;
                if (!skip && !object._connectorType) {
                    this._spatialSearch._isRouting = ej.datavisualization.Diagram.Util.canRouteDiagram(this);
                    if (this._spatialSearch._isRouting) {
                        var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this);
                        this._spatialSearch._viewPortWidth = viewPort.width || 1000;
                        this._spatialSearch._viewPortHeight = viewPort.height || 1000;
                    }
                    ej.datavisualization.Diagram.SpatialUtil._updateQuad(this, this._spatialSearch, object);
                    if (this._spatialSearch._isRouting) {
                        delete this._spatialSearch._isRouting;
                        delete this._spatialSearch._viewPortWidth;
                        delete this._spatialSearch._viewPortHeight;
                    }
                }
            }
        },
        _sliceDockLines: function (list) {
            var list1 = $.extend({}, list);
            var child = null;
            for (var i in list1) {
                child = this.nameTable[this._getChild(list1[i])];
                if (child && child.segments) {
                    if (child.sourceNode || child.targetNode) {
                        list.pop(child.name);
                    }
                }
            }
        },
        _canExecute: function () {
            if (this._isEditing && (this._currentCommand == "delete" || this._currentCommand == "cut" || this._currentCommand == "focusToPreviousItem" ||
                this._currentCommand == "undo" || this._currentCommand == "redo" || this._currentCommand == "focusToNextItem" || this._currentCommand == "selectFocusedItem" ||
            this._currentCommand == "selectAll" || this._currentCommand == "copy" || this._currentCommand == "paste" || this._currentCommand.match("nudge")))
                return false;
            if (this._currentCommand == "endEdit" && !this._isEditing) return false;
            return true;
        },

        _setItemDraggable: function (container) {
            var diagram = this;
            var perventAddingConnector = false;
            this._canDragGlobally = true;
            $(container).ejDraggable({
                clone: true,
                helper: function (event) {
                    this._selectedSymbol = null;
                    this._isDragged = false;
                    var svg = diagram._renderItemContainer("diagram_clone", document.body);
                    svg.document.setAttribute("drag", "true");
                    if (diagram.activeTool && diagram.activeTool.selectedObject && !diagram.activeTool.helper) {
                        var item = $.extend(true, {}, diagram.activeTool.selectedObject);
                        diagram._updateChildren(item);
                        diagram.edgeTable = {};
                        diagram.edgeTable = diagram._getEdgeTable(item, diagram.edgeTable);
                        this._updateSelectedItem(item, item.isSwimlane);
                        this._selectedSymbol = item;
                        this._isDragged = false;
                        this._targetId = diagram._id;
                        var bounds = ej.datavisualization.Diagram.Util.bounds(item);
                        this.cursorAt = { top: 105, left: 105 };
                        var node = ej.datavisualization.Diagram.NodeType({ offsetX: item.offsetX, offsetY: item.offsetY, width: 100, height: 100, shape: "path", opacity: 0.5, pathData: "M49.955,50.7915L1.74601,99L98.164,99zM1,1.83699L1,98.332L49.2477,50.0843zM99,1.74699L50.662,50.0845L99,98.422zM1.57701,1L49.9548,49.3773L98.332,1zM0,0L100,0L100,100L0,100z " }, diagram);
                        node = diagram._getNewNode(node);
                        ej.datavisualization.Diagram.SvgContext.renderNode(node, svg, null, true, diagram);
                    }
                    var helper = document.getElementById("diagram_clone_paletteItem");
                    $(helper).addClass("dragClone");
                    $(helper).css("display", "none");
                    return $(helper);
                },
                drag: function (evt) {
                    var diagramElement = $(evt.target).parents(".e-datavisualization-diagram");
                    if (diagramElement.length) {
                        var diagram = $("#" + diagramElement.attr("id")).ejDiagram("instance");
                        if ((this.model._isDragged || this.model._targetId != diagram._id) && this.model._selectedSymbol) {
                            if (!this.model._isDragged && this.model._targetId != diagram._id) {
                                var instance = $("#" + this.model._targetId).ejDiagram("instance");
                                instance._delete(instance.nameTable[this.model._selectedSymbol.name]);
                                perventAddingConnector = false;
                                var cur = instance._historyList.currentEntry;
                                var pre = cur.previous;
                                cur.object = pre.undoObject.node;
                                if (pre.undoObject.childTable) cur.childTable = pre.undoObject.childTable;
                                if (pre.undoObject.edgeTable) cur.edgeTable = pre.undoObject.edgeTable;
                                instance.removeHistoryEntry(pre);
                            }
                            else if (this.model._targetId != diagram._id) {
                                if (diagram.edgeTable) delete diagram.edgeTable;
                                perventAddingConnector = false;
                            }
                            this.model._isDragged = true;
                            diagram._selectedSymbol = this.model._selectedSymbol;
                            diagram._isNodeEnters = true;
                            var item = diagram._selectedSymbol;
                            var scale = diagram._currZoom;
                            var offset = $("#" + diagram.element[0].id).offset();
                            var coor = diagram._isTouchEvent(evt.event);
                            var x = ((coor ? coor.pageX : evt.event.pageX) + diagram._hScrollOffset - offset.left) / scale;
                            var y = ((coor ? coor.pageY : evt.event.pageY) + diagram._vScrollOffset - offset.top) / scale;
                            if (!item.segments)
                                this.model._translate(item, x - item.offsetX / scale, y - item.offsetY / scale);
                            else
                                this.model._translate(item, x - (item.sourcePoint.x + item.targetPoint.x) / 2 * scale, y - (item.sourcePoint.y + item.targetPoint.y) / 2 * scale);
                            if (this.model._isDragged && diagram.edgeTable && diagram.nameTable[item.name] && !perventAddingConnector && item.type != "pseudoGroup") {
                                for (var conn in diagram.edgeTable) {
                                    if (!diagram.nameTable[conn]) diagram.add(diagram.edgeTable[conn]);
                                    else {
                                        var connector = diagram.nameTable[conn];
                                        connector.sourceNode = diagram.edgeTable[conn].sourceNode;
                                        connector.sourcePort = diagram.edgeTable[conn].sourcePort;
                                        connector.targetNode = diagram.edgeTable[conn].targetNode;
                                        connector.targetPort = diagram.edgeTable[conn].targetPort;
                                    }
                                }
                                diagram._clearSelection(true);
                                diagram._addSelection(diagram.nameTable[item.name], true);
                                perventAddingConnector = true;
                            }
                        }
                        this.helper.css("display", "none");
                    }
                    else if (this.model._selectedSymbol) {
                        var diagram = $("#" + this.model._targetId).ejDiagram("instance");
                        diagram._delete(diagram.nameTable[this.model._selectedSymbol.name]);
                        perventAddingConnector = false;
                        if (!this.model._isDragged) {
                            var cur = diagram._historyList.currentEntry;
                            var pre = cur.previous;
                            cur.object = pre.undoObject.node;
                            if (pre.undoObject.childTable) cur.childTable = pre.undoObject.childTable;
                            if (pre.undoObject.edgeTable) cur.edgeTable = pre.undoObject.edgeTable;
                            diagram.removeHistoryEntry(pre);
                        }
                        this.helper.css("display", "block");
                        this.model._isDragged = true;
                    }
                    $('html,body').css('cursor', 'no-drop');
                },
                dragStop: function (evt, ui) {
                    var diagramElement = $(evt.target).parents(".e-datavisualization-diagram");
                    if (diagramElement) {
                        var diagram = $("#" + diagramElement.attr("id")).ejDiagram("instance");
                        if (this.model._isDragged && this.model._targetId == diagram._id) {
                            var cur = diagram._historyList.currentEntry;
                            var pre = cur.previous;
                            cur.undoObject.node = pre.object;
                            if (pre.childTable) cur.undoObject.childTable = pre.childTable;
                            if (pre.edgeTable) cur.undoObject.edgeTable = pre.edgeTable;
                            diagram.removeHistoryEntry(pre);
                        }
                        diagram._selectedSymbol = null;
                        delete diagram._isNodeEnters;

                    }
                    $(this.helper).remove();
                    $('html,body').css('cursor', 'default');
                },
                _translate: function (item, dx, dy) {
                    if (!item.segments) {
                        item.offsetX += dx;
                        item.offsetY += dy;
                        if (item.type == "pseudoGroup" || item.type == "group") {
                            for (var i = 0; i < item.children.length; i++)
                                this._translate(item.children[i], dx, dy);
                        }
                    }
                    else {
                        ej.datavisualization.Diagram.Util._translateLine(item, dx, dy, item);
                    }
                },
                _updateSelectedItem: function (item, isSwimlane) {
                    if (item.type == "pseudoGroup" || item.type == "group") {
                        for (var i = 0; i < item.children.length; i++) {
                            if (typeof item.children[i] === "string")
                                item.children[i] = diagram.nameTable[diagram._getChild(item.children[i])];
                            this._updateSelectedItem(item.children[i], isSwimlane);
                        }
                    }
                    if (!isSwimlane) {
                        if (!item.segments) {
                            for (var i = 0; i < item.inEdges.length; i++) {
                                var edge = diagram.findNode(item.inEdges[i]);
                                if (diagram.model.selectedItems.children.indexOf(edge) == -1) item.inEdges.splice(i, 1);
                            }
                            for (var i = 0; i < item.outEdges.length; i++) {
                                var edge = diagram.findNode(item.outEdges[i]);
                                if (diagram.model.selectedItems.children.indexOf(edge) == -1) item.outEdges.splice(i, 1);
                            }
                        }
                        else
                            item.sourceNode = item.targetNode = item.sourcePort = item.targetPort = "";
                    }
                }
            });
        },

        _renderItemContainer: function (id, content) {
            var container = document.createElement("div");
            var bounds = { width: 100, height: 100 };
            var attr = { "id": id + "_paletteItem", "draggable": "true", "height": bounds.height + "px", "width": bounds.width + "px", "style": "padding: 4; height:" + (bounds.height + 1) + "px;width:" + (bounds.width + 1) + "px;-ms-touch-action: none;touch-action: none;" };
            ej.datavisualization.Diagram.Util.attr(container, attr);
            content.appendChild(container);
            this._setItemDraggable(container);
            return this._renderAnchor(container, id, bounds);
        },
        _renderAnchor: function (container, id, itemSize) {
            var anchor = document.createElement("div");
            var attr = { "id": id + "_anchor", "height": itemSize.height + "px", "class": "e-anchor" };
            ej.datavisualization.Diagram.Util.attr(anchor, attr);
            container.appendChild(anchor);
            return this._renderSvg(anchor, id, itemSize);
        },
        _renderSvg: function (anchor, id, itemSize) {
            var parent;
            var wrapper = document.createElement("div");
            var attr = { "id": id + "_svgWrapper", "class": "e-svg-container", "style": "width:" + itemSize.width + "px;height:" + itemSize.height + "px;" };
            ej.datavisualization.Diagram.Util.attr(wrapper, attr);
            attr = {
                "id": id + "_svg", "width": itemSize.width, "height": itemSize.height,
                "version": "1.1", "xlink": "http://www.w3.org/1999/xlink"
            };
            var svg = new ej.datavisualization.Diagram.Svg(attr);
            wrapper.appendChild(svg.document);
            anchor.appendChild(wrapper);
            return svg;
        },
        //#endregion
    });
    ej.datavisualization.Diagram.Locale = {};

    ej.datavisualization.Diagram.Locale["default"] = {
        cut: "Cut",
        copy: "Copy",
        paste: "Paste",
        undo: "Undo",
        redo: "Redo",
        selectAll: "Select All",
        grouping: "Grouping",
        group: "Group",
        ungroup: "Ungroup",
        order: "Order",
        bringToFront: "Bring To Front",
        moveForward: "Move Forward",
        sendBackward: "Send Backward",
        sendToBack: "Send To Back"
    }

    ej.datavisualization.Diagram.Locale["en-US"] = {
        cut: "Cut",
        copy: "Copy",
        paste: "Paste",
        undo: "Undo",
        redo: "Redo",
        selectAll: "Select All",
        grouping: "Grouping",
        group: "Group",
        ungroup: "Ungroup",
        order: "Order",
        bringToFront: "Bring To Front",
        moveForward: "Move Forward",
        sendBackward: "Send Backward",
        sendToBack: "Send To Back"
    }

    $.fn.pinchDiagram = function (rootgroup, map) {
        var startTouches = [],
        handleTouchStart = function (evt) {
            var touches = evt.touches;
            if (touches.length >= 2) {
                for (var i = 0; i < touches.length; i++) {
                    var touch = touches[i]
                      , found = false;
                    for (var j = 0; j < startTouches.length; j++) {
                        var startTouch = startTouches[j];
                        if (touch.identifier === startTouch.identifier) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        var touchCopy = $.extend({}, touch);
                        startTouches.push(touchCopy);
                    }
                }
            }
            evt.preventDefault();
        },
        getDistance = function (touch1, touch2) {
            var x = touch2.pageX - touch1.pageX,
                y = touch2.pageY - touch1.pageY;
            return Math.sqrt((x * x) + (y * y));
        },
        handleTouchEnd = function (evt) {
            var changedTouches = evt.changedTouches;
            for (var i = 0; i < changedTouches.length; i++) {
                var changedTouch = changedTouches[i];
                for (var j = 0; j < startTouches.length; j++) {
                    var startTouch = startTouches[j];
                    if (startTouch.identifier === changedTouch.identifier) {
                        var idx = startTouches.indexOf(startTouch);
                        startTouches.splice(idx, 1);
                    }
                }
            }
            evt.preventDefault();
        },
        updateTouch = function (dstTouch, srcTouch) {
            dstTouch.pageX = srcTouch.pageX;
            dstTouch.pageY = srcTouch.pageY;
        },
        handleTouchMove = function (evt) {
            evt.preventDefault();
            var touches = evt.touches, z;
            if (touches.length >= 2) {
                var touch0 = touches[0]
                  , touch1 = touches[1]
                  , startTouch0 = startTouches[0]
                  , startTouch1 = startTouches[1];
                z = getDistance(touch0, touch1) / getDistance(startTouch0, startTouch1);
                var focusPoint = map._mousePosition(evt, false);
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(map, z, 0, 0, focusPoint, true, true);
                updateTouch(startTouch0, touch0);
                updateTouch(startTouch1, touch1);
            }
        };
        this[0].addEventListener('touchstart', handleTouchStart, false);
        this[0].addEventListener('touchend', handleTouchEnd, false);
        this[0].addEventListener('touchmove', handleTouchMove, false);
    };
    //#endregion
})(jQuery, Syncfusion);