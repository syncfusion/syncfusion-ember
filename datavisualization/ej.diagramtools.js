

(function ($, ej) {
    "use strict";
    //#region Extends
    ej.datavisualization.Diagram.extend = function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    }
    //#endregion

    //#region Tool
    var ToolBase = (function () {
        function ToolBase(name, diagram) {
            this.name = name;
            this.diagram = diagram;
            this.helper = null;
            this.inAction = false;
            this.selectedObject = null;
            this.startPoint = ej.datavisualization.Diagram.Point(0, 0);
            this.currentPoint = ej.datavisualization.Diagram.Point(0, 0);
            this.previousPoint = ej.datavisualization.Diagram.Point(0, 0);
            this.cursor = "default";
            this._currentPossibleConnection = null;
            this._previousPossibleConnection = null;
            this._possibleConnectionPort = null;
            this.singleAction = false;
            this.svgHelper = null;
            this.single = null;
            this._centralPoint = ej.datavisualization.Diagram.Point(0, 0);
            this._enableAutoNode = null;
            this._prevTool = null;
            this.activeLabel = null;
            this._adjustLines = {
                lines: []
            }
        }
        ToolBase.prototype.abort = function (evt) {
            this._endAction();
            if (this.diagram.selectionList && this.diagram.selectionList[0])
                ej.datavisualization.Diagram.SvgContext.updateSelector(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom, this.diagram, this.diagram.model.selectedItems.constraints);
            this.diagram._removeTooltip();
        };
        ToolBase.prototype._snapTop = function (horizontalsnap, verticalsnap, delx, dely, shape, ended) {
            var dify = dely;
            verticalsnap.top = true;
            horizontalsnap.left = horizontalsnap.right = false;
            var snapSettings = this.diagram.model.snapSettings;
            var zoomFactor = this.diagram._currZoom;
            if (this.diagram._enableSnapToObject() && !shape.rotateAngle &&
                (!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
                var y = this.initialBounds.y - this.initialBounds.height * shape.pivot.y + dely - (shape.offsetY - shape.height * shape.pivot.y);
                ej.datavisualization.Diagram.SnapUtil._snapSize(this.diagram, horizontalsnap, verticalsnap, delx, y, this.selectedObject, ended);
            }
            if (!verticalsnap.snapped) {
                if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines) {
                    var top = this.initialBounds.y - this.initialBounds.height * shape.pivot.y;
                    var actualTop = top + dely;
                    var roundedTop = ej.datavisualization.Diagram.SnapUtil._round(actualTop, snapSettings.horizontalGridLines.snapInterval, zoomFactor);
                    dify = roundedTop - top;
                }
            }
            else {
                dify = (dely - y) + verticalsnap.offset;
            }
            return dify;
        };
        ToolBase.prototype._checkGroupChildren = function (collection, group, bounds) {
            var child, childBounds;
            var children = this.diagram._getChildren(group.children);
            for (var i = 0; i < children.length; i++) {
                child = this.diagram.nameTable[children[i]];
                if (child && ej.datavisualization.Diagram.Util.canSelect(child) && ej.datavisualization.Diagram.Util.enableLayerOption(child, "lock", this.diagram)) {
                    childBounds = ej.datavisualization.Diagram.Util.bounds(child);
                    if (ej.datavisualization.Diagram.Geometry.containsRect(bounds, childBounds) && collection.indexOf(child) < 0) {
                        collection.push(child);
                    }
                    else if (child._type === "group") {
                        this._checkGroupChildren(collection, child, bounds);
                    }
                }
            }
        }
        ToolBase.prototype._getSwimLaneStackIndex = function (node) {
            var index = null;
            if (node.container.type == "canvas") {
                if (node.parent)
                    var parent = this.diagram.nameTable[node.parent];
                if (parent) {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    if (parent.container.orientation === "vertical") {
                        if (this.currentPoint.y >= bounds.y && this.currentPoint.y < bounds.center.y) {
                            index = this._getIndex(parent.children, node);
                        }
                        else {
                            index = this._getIndex(parent.children, node) + 1;
                        }
                    }
                    else {
                        if (this.currentPoint.x >= bounds.x && this.currentPoint.x < bounds.center.x) {
                            index = this._getIndex(parent.children, node);
                        }
                        else {
                            index = this._getIndex(parent.children, node) + 1;
                        }
                    }
                }
            }
            return index;
        };
        ToolBase.prototype._getIndex = function (list, node) {
            if (list && node) {
                var child = null;
                for (var i = 0; i < list.length; i++) {
                    child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                    if (child) {
                        if (child.name == node.name)
                            return i;
                    }
                }
            }
            else return -1;
        };
        ToolBase.prototype._snapLeft = function (horizontalsnap, verticalsnap, delx, dely, shape, ended) {
            var difx = delx;
            horizontalsnap.left = true;
            verticalsnap.top = verticalsnap.bottom = false;
            var snapSettings = this.diagram.model.snapSettings;
            var zoomFactor = this.diagram._currZoom;
            if (this.diagram._enableSnapToObject() && !shape.rotateAngle &&
                (!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
                var x = this.initialBounds.x - this.initialBounds.width * shape.pivot.x + delx - (shape.offsetX - shape.width * shape.pivot.x);
                ej.datavisualization.Diagram.SnapUtil._snapSize(this.diagram, horizontalsnap, verticalsnap, x, dely, this.selectedObject, ended);;
            }
            var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
            if (!horizontalsnap.snapped) {
                if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines) {
                    var left = this.initialBounds.x - this.initialBounds.width * shape.pivot.x;
                    var actualLeft = left + delx;
                    var roundedLeft = ej.datavisualization.Diagram.SnapUtil._round(actualLeft, snapSettings.horizontalGridLines.snapInterval, zoomFactor);
                    difx = roundedLeft - left;
                }
            }
            else {
                difx = (delx - x) + horizontalsnap.offset;
            }
            return difx;
        };
        ToolBase.prototype._snapBottom = function (horizontalsnap, verticalsnap, delx, dely, shape, ended, disableSnap) {
            var dify = dely;
            if (!this.diagram._disableSnap) {
                verticalsnap.bottom = true;
                horizontalsnap.left = horizontalsnap.right = false;
                var snapSettings = this.diagram.model.snapSettings;
                var zoomFactor = this.diagram._currZoom;
                if (this.diagram._enableSnapToObject() && !shape.rotateAngle &&
                       (!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
                    var y = this.initialBounds.y + this.initialBounds.height * (1 - shape.pivot.y) + dely - (shape.offsetY + shape.height * (1 - shape.pivot.y));
                    ej.datavisualization.Diagram.SnapUtil._snapSize(this.diagram, horizontalsnap, verticalsnap, delx, y, this.selectedObject, ended);;
                }
                var bounds = ej.datavisualization.Diagram.Util.bounds(shape);
                if (!verticalsnap.snapped) {
                    if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines) {
                        var bottom = this.initialBounds.y + this.initialBounds.height * (1 - shape.pivot.y);
                        var actualBottom = bottom + dely;
                        var roundedBottom = ej.datavisualization.Diagram.SnapUtil._round(actualBottom, snapSettings.horizontalGridLines.snapInterval, zoomFactor);
                        dify = roundedBottom - bottom;
                    }
                }
                else {
                    dify = (dely - y) + verticalsnap.offset;
                }
            }
            return dify;
        };

        ToolBase.prototype._snapRight = function (horizontalsnap, verticalsnap, delx, dely, shape, ended, disableSnap) {
            var difx = delx;
            if (!this.diagram._disableSnap) {
                horizontalsnap.right = true;
                verticalsnap.top = verticalsnap.bottom = false;
                var snapSettings = this.diagram.model.snapSettings;
                var zoomFactor = this.diagram._currZoom;
                if (this.diagram._enableSnapToObject() && !shape.rotateAngle &&
                       (!this.selectedObject.isLane && !this.selectedObject.isSwimlane)) {
                    var x = this.initialBounds.x + this.initialBounds.width * (1 - shape.pivot.x) + delx - (shape.offsetX + shape.width * (1 - shape.pivot.x));
                    ej.datavisualization.Diagram.SnapUtil._snapSize(this.diagram, horizontalsnap, verticalsnap, x, dely, this.selectedObject, ended);
                }
                if (!horizontalsnap.snapped) {
                    if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines) {
                        var right = this.initialBounds.x + this.initialBounds.width * (1 - shape.pivot.x);
                        var actualRight = right + delx;
                        var roundedRight = ej.datavisualization.Diagram.SnapUtil._round(actualRight, snapSettings.verticalGridLines.snapInterval, zoomFactor);
                        difx = roundedRight - right;
                    }
                }
                else {
                    difx = (delx - x) + horizontalsnap.offset;
                }
            }

            return difx;
        };

        ToolBase.prototype.keydown = function (evt) {
            var keycode = evt.keyCode ? evt.keyCode : evt.which;
            if (keycode === 27 && this.inAction) {

                if (this.diagram._selectedSymbol) {
                    this.diagram._documentmouseup(evt);
                    this._removeHighLighter();
                    ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
                    this.diagram._selectedSymbol = null;
                }
                else {
                    if (this.seletedObject || this.selectedObject) {
                        if (this.selectedObject) {
                            ej.datavisualization.Diagram.SvgContext._enableSelectedNode(this.selectedObject, this.diagram._svg, this.diagram);
                            ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                        }
                        if (this.seletedObject) {
                            ej.datavisualization.Diagram.SvgContext._enableSelectedNode(this.seletedObject, this.diagram._svg, this.diagram);
                            ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.seletedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                        }
                        this._removeHighLighter();
                        ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
                    }
                }
                this.abort();
            }
            else if (keycode === 46 && this.inAction) {
                if (this.diagram._selectedSymbol) {
                    this.diagram._documentmouseup(evt);
                    this.diagram._selectedSymbol = null;
                }
                this.abort();
            }
            else if (!this.inAction && keycode == 27) {
                this.diagram._clearSelection();
            }
        };
        ToolBase.prototype._getSwimlaneHeader = function (group) {
            var header;
            if (group && group.isSwimlane) {
                if (group.children && group.children.length > 0) {
                    header = this.diagram.nameTable[this.diagram._getChild(group.children[0])];
                }
            }
            return header;
        };
        ToolBase.prototype._removeHelpers = function () {
            ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
            ej.datavisualization.Diagram.SvgContext._removeConnectorHighlighter(this.diagram._adornerLayer, this.diagram._adornerSvg);
            this._removeHighLighter();
        };
        ToolBase.prototype._cloneGroupNode = function (node, id) {
            var child = null, child1, clnObj, node1;
            node1 = $.extend(true, {}, node);
            node1.name += id;
            if (node && node._type === "group") {
                node1.children = [];
                var children = this.diagram._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[this.diagram._getChild(children[i])];
                    child1 = $.extend(true, {}, child);
                    child1.name += id;
                    if (child1.parent)
                        child1.parent += id;
                    if (child1._type === "group")
                        this._cloneGroupNode(child1, id);
                    this.diagram.nameTable[child1.name] = child1;
                    node1.children.push(child1);
                }
            }
            return node1;
        };
        ToolBase.prototype._updateNextPhases = function (seperator, dx, dy) {
            var dif = 0, index, cphase;
            var group;
            if (seperator.orientation == "horizontal") {
                dif = dx;
            }
            else {
                dif = dy;
            }
            index = this.diagram._getPhaseIndex(seperator.name);
            group = this.diagram.nameTable[seperator.parent];
            for (var i = index + 1; i < group.phases.length; i++) {
                cphase = this.diagram.nameTable[this.diagram._getChild(group.phases[i])];
                if (cphase)
                    cphase.offset += dif;
                ej.datavisualization.Diagram.SvgContext._updatephase(cphase, this.diagram);
            }
        };

        ToolBase.prototype._getphase = function (id) {
            return this.diagram.nameTable[id];
        };


        ToolBase.prototype._containsSwimlane = function (list) {
            for (var i in list) {
                var child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                if (child.isSwimlane || child.isLane)
                    return true;
            }
            return false;
        };

        ToolBase.prototype._raiseEndPointDrag = function (connector, isTarget, isSource, dragState) {
            if (isTarget || isSource) {
                var type, node, port, point;
                node = this._currentPossibleConnection ? this._currentPossibleConnection : null;
                port = this._possibleConnectionPort ? this._possibleConnectionPort : null;
                point = this.currentPoint;
                if (isTarget)
                    type = "Target";
                else type = "Source";
                return this._raiseEvent("connector" + type + "Change", { element: connector, node: node, port: port, point: point, dragState: dragState, cancel: false });
            }
        };

        ToolBase.prototype._decideSelectedItem = function (evt, node, skip) {
            var obj = null;
            if (node) {
                if (node.parent) {
                    if (this.diagram.selectionList && this.diagram.selectionList[0] && node.parent == this.diagram.selectionList[0].name && !skip) {
                        obj = node;
                        if (this.diagram.selectionList[0].type == "bpmn")
                            obj = this.diagram.selectionList[0];
                    }
                    else {
                        if (skip && this.diagram.selectionList[0] && this.diagram.selectionList[0].name == node.name) {
                            obj = node;
                        }
                        else {
                            var item = this.diagram.nameTable[node.parent];
                            if (node.isPhase) {
                                var name = (node.name).split("phaseStack")[1];
                                if (name) {
                                    node = this.diagram.nameTable[name];
                                }
                                obj = node;
                            }
                            else {
                                obj = this._decideSelectedItem(evt, item, skip);
                                if (this.diagram.selectionList && this.diagram.selectionList[0]) {
                                    if (obj && this.diagram.selectionList[0].name == obj.name && !skip)
                                        obj = node;
                                }
                            }
                        }
                    }
                } else {
                    obj = node;
                }
            }
            else {
                return null;
            }
            return obj;
        };
        ToolBase.prototype._isParentAsLane = function (pGroup) {
            var child, lane, laneStack;
            for (var i = 0; pGroup.children && i < pGroup.children.length > 0; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(pGroup.children[i])];
                if (child) {
                    lane = this.diagram.nameTable[child.parent];
                    if (lane && lane.isLane) {
                        laneStack = this.diagram.nameTable[lane.parent];
                        this.diagram._activeSwimLane = this.diagram.nameTable[laneStack.parent];
                        return true;
                    }
                }
            }
            return null;
        };
        ToolBase.prototype._getAdjustjecentLines = function (child) {
            if (!child.segments) {
                for (var i = 0; child.inEdges && child.inEdges.length > 0 && i < child.inEdges.length ; i++) {
                    if (!this._containsCollection(this._adjustLines.lines, this.diagram.nameTable[child.inEdges[i]]))
                        this._adjustLines.lines.push(jQuery.extend(true, {}, this.diagram.nameTable[child.inEdges[i]]));
                }
                for (i = 0; child.outEdges && child.outEdges.length > 0 && i < child.outEdges.length ; i++) {
                    if (!this._containsCollection(this._adjustLines.lines, this.diagram.nameTable[child.outEdges[i]]))
                        this._adjustLines.lines.push(jQuery.extend(true, {}, this.diagram.nameTable[child.outEdges[i]]));
                }
            }
        };
        ToolBase.prototype._containsCollection = function (collection, obj) {
            for (var i = 0; collection && collection.length > 0 && i < collection.length; i++) {
                if (obj && collection[i].name === obj.name)
                    return true;
            }
        };
        ToolBase.prototype._updateMultipleUndoObject = function (psedoGroup) {
            var child, collection = [];
            for (var i = 0; psedoGroup.children && psedoGroup.children.length > 0 && i < psedoGroup.children.length; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(psedoGroup.children[i])];
                if (child) {
                    collection.push(jQuery.extend(true, {}, child));
                    this._getAdjustjecentLines(child);
                }
            }
            if (!this._undoObject) {
                this._undoObject = {
                    collection: collection,
                    adjustLines: jQuery.extend(true, {}, this._adjustLines)
                };
            }
        };
        ToolBase.prototype._updateNameTable = function (node) {
            this.diagram._updateNameTable(node);
        };
        ToolBase.prototype._getParentSwimlane = function (lane) {
            var laneStack;
            if (lane && lane.isLane) {
                laneStack = this.diagram.nameTable[lane.parent];
                return this.diagram.nameTable[laneStack.parent];
            }
            return null;
        };
        ToolBase.prototype._removeHighLighter = function () {
            ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
        };
        ToolBase.prototype._getPadding = function (node) {
            var padX = 0, padY = 0;
            if (node && node.parent) {
                var parent = this.diagram.nameTable[node.parent];
                if (parent) {
                    padX = parent.paddingRight;
                    padY = parent.paddingBottom;
                }
            }
            return { x: padX, y: padY };
        };

        ToolBase.prototype._findStackOverNode = function (node, evt) {
            if (node) {
                var parent = this.diagram.nameTable[node.parent];
                var child = null, pos, childBounds;
                if (parent) {
                    var length = parent.children.length;
                    for (var i = 0; i < length; i++) {
                        child = this.diagram.nameTable[this.diagram._getChild(parent.children[i])];
                        pos = this.mousePosition(evt);
                        childBounds = ej.datavisualization.Diagram.Util.bounds(child);
                        var lastChild = this.diagram.nameTable[this.diagram._getChild(parent.children[length - 1])];
                        var firstChild = this.diagram.nameTable[this.diagram._getChild(parent.children[0])];
                        if (parent.container.orientation == "vertical") {
                            if (pos.y >= childBounds.y && pos.y <= childBounds.bottom) {
                                return child;
                            }
                            else if (pos.y <= firstChild.offsetY - firstChild.height / 2) {
                                return firstChild;
                            }
                            else if (pos.y >= lastChild.offsetY + lastChild.height / 2) {
                                return lastChild;
                            }

                        }
                        else {
                            if (pos.x >= childBounds.x && pos.x <= childBounds.right) {
                                return child;
                            }
                            else if (pos.x <= firstChild.offsetX - firstChild.width / 2) {
                                return firstChild;
                            }
                            else if (pos.x >= lastChild.offsetX + lastChild.width / 2) {
                                return lastChild;
                            }
                        }
                    }
                }
            }
        };

        ToolBase.prototype._getPageBounds = function () {
            var size = ej.datavisualization.Diagram.Rectangle(0, 0, 0, 0);
            var pageSettings = this.diagram.model.pageSettings;
            size.x = (pageSettings.boundaryConstraints === "diagram") ? Math.min(this.diagram._getDigramBounds().x, 0) : 0;
            size.y = (pageSettings.boundaryConstraints === "diagram") ? Math.min(this.diagram._getDigramBounds().y, 0) : 0;
            size.width = (pageSettings.boundaryConstraints === "page") ? (pageSettings.pageWidth ? pageSettings.pageWidth : this.diagram.element.width()) : this.diagram.element.width();
            size.height = (pageSettings.boundaryConstraints === "page") ? (pageSettings.pageHeight ? pageSettings.pageHeight : this.diagram.element.height()) : this.diagram.element.height();
            return size;
        };
        ToolBase.prototype._nodeHighLighter = function (overNode, evt) {
            var source = null, childBounds = null, target = null;
            if (overNode && this.selectedObject.parent) //&& this.selectedObject.parent != overNode.name)
            {
                var parent = this.diagram.nameTable[this.selectedObject.parent];
                if (parent) {
                    if (parent.container && parent.container.type == "stack" && this.selectedObject.name != overNode.name) {
                        var stackOverNode = this._stackOverNode;
                        ej.datavisualization.Diagram.SvgContext._drawStackHighlighter(stackOverNode, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom, this.currentPoint, (parent.container.orientation === "vertical") ? true : false);
                    }
                    else if (parent.container && parent.container.type == "canvas" && this.selectedObject.parent != overNode.name && !overNode.isPhase && ej.datavisualization.Diagram.Util.canAllowDrop(overNode)) {
                        if (ej.datavisualization.Diagram.Util._canBeTarget(this.diagram, overNode))
                            ej.datavisualization.Diagram.SvgContext._drawNodeHighlighter(overNode, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
                    }
                    else this._removeHighLighter();
                }
            }
            else if (overNode && overNode.container && !overNode.isSwimlane) {
                if (this.selectedObject.isLane) {
                    parent = this.diagram.nameTable[overNode.parent];
                    if (parent && overNode.name.indexOf("phaseStack") === -1 && (ej.datavisualization.Diagram.Util.canDrawStackHighlighter(this.diagram, this.selectedObject, overNode)))
                        ej.datavisualization.Diagram.SvgContext._drawStackHighlighter(overNode, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom, this.currentPoint, (parent.container.orientation === "vertical") ? true : false);
                }
                else
                    ej.datavisualization.Diagram.SvgContext._drawNodeHighlighter(overNode, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
            }
            else if (!overNode.segments) {
                ej.datavisualization.Diagram.SvgContext._drawNodeHighlighter(overNode, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
            }
            else
                this._removeHighLighter();
            if (this._nodeToHit && overNode && overNode.name != this._nodeToHit.name) {
                childBounds = ej.datavisualization.Diagram.Util.bounds(this._nodeToHit);
                target = this._getTargetNode(this._nodeToHit, childBounds);
                this._raiseEvent("mouseLeave", { element: this.diagram.getNode(this.selectedObject), source: this.diagram.getNode(this._nodeToHit), target: this.diagram.getNode(target) });
            }
            if (overNode) {
                if (this._nodeToHit && this._nodeToHit.name !== overNode.name || !this._nodeToHit) {
                    this._nodeToHit = overNode;
                    if (this.selectedObject.parent)
                        source = this.diagram.nameTable[this.selectedObject.parent];
                    if (this.selectedObject.type == "pseudoGroup") {
                        var fChild = this.diagram.nameTable[this.diagram._getChild(this.selectedObject.children[0])];
                        if (fChild && fChild.parent)
                            source = this.diagram.nameTable[fChild.parent];
                    }
                    childBounds = ej.datavisualization.Diagram.Util.bounds(overNode);
                    target = this._getTargetNode(overNode, childBounds);
                    this._raiseEvent("mouseEnter", { element: this.diagram.getNode(this.selectedObject), source: this.diagram.getNode(source), target: this.diagram.getNode(target) });
                }
            }
            else {
                this._nodeToHit = null;
            }
            if (overNode) {
                if (this.selectedObject.parent)
                    source = this.diagram.nameTable[this.selectedObject.parent];
                childBounds = ej.datavisualization.Diagram.Util.bounds(overNode);
                target = this._getTargetNode(overNode, childBounds);
                this._raiseEvent("mouseOver", { element: this.diagram.getNode(this.selectedObject), source: this.diagram.getNode(source), target: this.diagram.getNode(target) });
            }
        };

        ToolBase.prototype._doubleClick = function (element) {
            if (element && element.parent) {
                var parent = this.diagram.nameTable[element.parent];
                if (parent) {
                    var name = element.name;
                    this.diagram.updateSelectedObject(name);
                    if (!parent.isLane && !parent.isSwimlane && !parent.isPhaseStack) {
                        this.diagram._clearSelection(true);
                        this.diagram.addSelection(element, true);
                    }
                }
            }
        };

        ToolBase.prototype._itemClick = function (element, actualObject, selectedObject, prevSelected) {

            if (actualObject && actualObject.parent) {
                var parent = this.diagram.nameTable[actualObject.parent];
                if (parent) {
                    if (parent.container) {
                        if (actualObject && !this.diagram._selectedSymbol) {
                            var name = actualObject.name;
                            if (name.indexOf("_header_swimlane") != -1) {
                                if (element)
                                    this.diagram.updateSelectedObject(element.parent, parent);
                            }
                            else if (name.indexOf("_Headerr_") != -1)
                                this.diagram.updateSelectedObject(actualObject.parent);
                            else if (actualObject && actualObject.isPhase) {
                                if (element.isPhase) {
                                    var obj = this.diagram.nameTable[element.parent];
                                    if (obj && (this.diagram.selectionList.length === 0 || this.diagram.selectionList[0].name != obj.name)) {
                                        this.diagram._clearSelection(true);
                                        this.diagram.addSelection(element, true);
                                        this.selectedObject = null;
                                    }
                                }
                            }
                            else
                                this.diagram.updateSelectedObject(name);
                        }
                        this.diagram._selectedGNode = null;
                    }
                    else if (parent.type === "group") {
                        if (parent.parent) {
                            if (!(this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y)) {
                                while (parent.parent) {
                                    var lane = this.diagram.nameTable[parent.parent];
                                    if (lane && lane.isLane)
                                        break
                                    else {
                                        var tParent = this.diagram.nameTable[parent.parent];
                                        if (this.diagram._selectedGNode && tParent) {
                                            if (tParent.name === this.diagram._selectedGNode.name) {
                                                this.diagram.updateSelectedObject(parent.name);
                                                break;
                                            }
                                            else parent = tParent;
                                        }
                                        else parent = tParent;
                                    }
                                }
                            }
                            else lane = this.diagram.nameTable[parent.parent];
                            if (lane && lane.isLane) {
                                var obj = this._getSelectedItem(actualObject, prevSelected);
                                if (obj)
                                    this.diagram.updateSelectedObject(obj.name)
                            }
                        }
                        if (this.selectedObject && this.selectedObject.parent)
                            this.diagram._selectedGNode = this.selectedObject;
                    }
                }
            }
            else if (actualObject) {
                if (!this.diagram._selectedSymbol)
                    this.diagram.updateSelectedObject(actualObject.name);
            }
            else this.diagram._selectedGNode = null;
            if (element && (element.type == "pseudoGroup" || element.name == "multipleSelection") && actualObject && !this._containsChild(element, actualObject.name)) {
                this.diagram.updateSelectedObject(element.name)
            }

        };

        ToolBase.prototype._getSelectedItem = function (item, prevSelected) {
            var parent;
            if (item) {
                if (item.parent) {
                    parent = this.diagram.nameTable[item.parent];
                    if (prevSelected && prevSelected.name == parent.name) {
                        return item
                    }
                    else if (parent.isLane)
                        return item;
                    else return this._getSelectedItem(parent);
                }
            }
        };

        ToolBase.prototype._getTargetNode = function (node, childBounds) {
            var bounds = null, nodes = [];
            var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(this.diagram._spatialSearch, childBounds);
            for (var i = 0; i < quads.length; i++) {
                var quad = quads[i];
                if (quad.objects.length > 0) {
                    for (var j = 0; j < quad.objects.length; j++) {
                        var nd = quad.objects[j];
                        if (!nd.segments && nd.visible) {
                            bounds = ej.datavisualization.Diagram.Util.bounds(nd);
                            if (nodes.indexOf(nd) == -1 && ej.datavisualization.Diagram.Geometry.intersectsRect(childBounds, bounds))
                                nodes.push(nd);

                        }
                    }
                }
            }
            var collection = [];
            collection.push(node);
            for (i = 0; i < nodes.length; i++) {
                if (nodes[i].name != node.name)
                    collection.push(nodes[i]);
            }
            return collection;
        };
        ToolBase.prototype._updateMargin = function (node, group) {
            if (node.type == "pseudoGroup") {
                var child = null;
                var children = this.diagram._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[children[i]];
                    this._updateMargin(child, group);
                }
            }
            else if (group && group.container && group.container.type == "canvas") {
                var groupBounds = ej.datavisualization.Diagram.Util.bounds(group); //ej.datavisualization.Diagram.SvgContext.getCanvasBoundingBox(group, this.diagram, node, true);
                var bounds1 = ej.datavisualization.Diagram.Util.bounds(node);
                var bounds = ej.datavisualization.Diagram.Geometry.rect([bounds1.topLeft, bounds1.topRight, bounds1.bottomRight, bounds1.bottomLeft]);
                node.marginLeft = bounds.x - (groupBounds.x + group.paddingLeft);
                //node.marginRight = (groupBounds.x + group.width) - (bounds.x + bounds.width) - group.paddingRight;
                node.marginTop = bounds.y - (groupBounds.y + group.paddingTop);
                //node.marginBottom = groupBounds.bottom - (bounds.y + bounds.height) - group.paddingBottom;
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

        };
        ToolBase.prototype._getNodeUnderMouse = function (evt) {
            var node = this.diagram._nodeUnderMouse; var obj, skip;
            if (this.diagram._focusedElement && (this.diagram._focusedElement.isPhase || this.diagram._focusedElement.isLane || this.diagram._focusedElement.isSwimlane)) skip = true;
            if (this.diagram._focusedElement && node && this._containsChild(this.diagram._focusedElement, node.name)) {
                if (node && (skip || !ej.datavisualization.Diagram.Util.canAllowDrop(node))) {
                    var type = this.diagram.getObjectType(node);
                    if (type == "connector" || type === "group") {
                        obj = node;
                    }
                    else {
                        if (node.parent) {
                            var parent1 = this.diagram.nameTable[node.parent];
                            if (parent1 && parent1.container && parent1.container.type == "stack" && ej.datavisualization.Diagram.Util.canAllowDrop(node)) {
                                return obj = node;
                            }
                            type = this.diagram.getObjectType(parent1);
                            if (parent1 && type != "node") {
                                obj = parent1;
                            }
                        }
                    }
                }
            }
            if (!obj) {
                if (node && this.selectedObject != node && ej.datavisualization.Diagram.Util.canAllowDrop(node))
                    return node;
            }
            else if (this.selectedObject != obj && ej.datavisualization.Diagram.Util.canAllowDrop(obj) && (obj.type != "bpmn" || this.selectedObject.type == "bpmn"))
                return obj;

        };

        ToolBase.prototype._isChange = function (obj1, obj2) {
            var status = null;
            if (obj1._type === "group" || obj1.type === "pseudoGroup" || obj2._type === "group" || obj2.type === "pseudoGroup") {
                if ((obj1._type === "group" || obj1.type === "pseudoGroup") && !(obj2._type === "group" || obj2.type === "pseudoGroup")) {
                    status = !this._containsChild(obj1, obj2.name);
                }
                if (!(obj1._type === "group" || obj1.type === "pseudoGroup") && (obj2._type === "group" || obj2.type === "pseudoGroup")) {
                    status = !this._containsChild(obj2, obj1.name);
                }
                else if ((obj1._type === "group" || obj1.type === "pseudoGroup") && (obj2._type === "group" || obj2.type === "pseudoGroup")) {
                    if (obj1.name == obj2.name)
                        status = true;
                }
            }
            else {
                if (obj1.name == obj2.name)
                    status = true;
            }
            return status;
        };
        ToolBase.prototype._containsChild = function (node, childName) {
            var status = true;
            var child = null;
            var type;
            if (node.children) {
                var children = this.diagram._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[children[i]];
                    type = this.diagram.getObjectType(child);
                    if (type === "group")
                        status = this._containsChild(child, childName);
                    else {
                        if (child && child.name == childName)
                            status = false;
                    }
                }
            }
            return status;
        };

        ToolBase.prototype._findNodeUnderMouse = function (evt, skip) {
            var obj = null;
            var node = null;
            var type;
            var foreignObject = this.diagram._isForeignObject(evt.target);
            if (foreignObject)
                evt.target = foreignObject;
            var parent = $(evt.target).parents(".ej-d-node,.ej-d-connector,.ej-d-group");
            var className = evt.target.className;
            if (parent && (foreignObject || evt.target.localName != "div")) {
                type = parent.attr("class");
                if (type && (type === "ej-d-node" || type === "ej-d-group" || ej.datavisualization.Diagram.Util.isClassifier(evt))) {
                    node = this.diagram._findNode(parent.attr("id"));
                    if (!node) node = this.diagram._findNode(parent.attr("id").split("_label")[0]);
                    if (!node) node = this.diagram._findNode(parent.attr("id").split('_parentdiv')[0]);
                } else if (type === "ej-d-connector") {
                    node = this.diagram._findConnector(parent.attr("id"));
                    if (!node) node = this.diagram._findConnector(parent.attr("id").split("_label")[0]);
                }
                else if (className.animVal === "ej-d-multiselector")
                    node = this.diagram.selectionList[0];
                if (!node && evt.target && evt.target.parentNode) {
                    var id = (evt.target.parentNode.id).split("_ej_ports");
                    node = this.diagram.findNode(id[0]);
                }
            }
            else {
                if (this.diagram._isLabelTemplate(evt)) {
                    node = this.diagram._findNode(parent.attr("id"));
                    if (!node) {
                        node = this.diagram._findConnector(parent.attr("id"));
                    }
                }
            }
            if (node && !node.parent)
                obj = node;
            else
                obj = this._decideSelectedItem(evt, node, skip);
            this.prevSelectObject = obj;

            if (skip && this.diagram.selectionList[0]) {
                if (obj && obj._type === "group" && !this._containsChild(obj, this.diagram.selectionList[0].name))
                    obj = obj;
                else if (obj && this.diagram.selectionList[0].name != obj.name && this._isChange(this.diagram.selectionList[0], obj))
                    obj = this.diagram.selectionList[0];
                else if (node && node.name == this.diagram.selectionList[0].name && !this._isChange(this.diagram.selectionList[0], obj)) {
                    obj = this.diagram.selectionList[0];

                }
            }
            if (node && this.diagram._selectedSymbol && node.name != this.diagram._selectedSymbol.name && this.diagram._symbolDrop)
                this.actualObject = this.diagram._selectedSymbol;
            else
                this.actualObject = node;
            return obj;

        };

        ToolBase.prototype._findLabelUnderMouse = function (evt, skip, mousePosition, drag) {
            var obj;
            var target = $(evt.target);
            var targetClass = target[0].getAttribute("class");
            if (this.diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                if (!targetClass || !targetClass == "ej-d-label") {
                    if (target[0].parentNode)
                        var className = target[0].parentNode.getAttribute("class");
                    if (className === "ej-d-label") {
                        var nameArray = target[0].parentNode.id.split("_");
                        var name = "";
                        for (var i = 1; i < nameArray.length; i++) {
                            name += nameArray[i]
                            if (i != nameArray.length - 1) {
                                name += "_"
                            }
                        }
                        var node = this.diagram.nameTable[nameArray[0]];
                        if (node && node.labels.length > 0) {
                            for (var i = 0; i < node.labels.length; i++) {
                                if (node.labels[i].name === name) {
                                    this.activeLabel = node.labels[i];
                                    return node.labels[i];
                                }
                            }
                        }
                    }
                    else {
                        var parentNode = evt.target.parentNode;
                        while (parentNode) {
                            if (parentNode)
                                var targetClass = parentNode.getAttribute("class");
                            if (targetClass === "ej-label-template") {
                                var id = parentNode.id.split('_');
                                obj = this.diagram._findNode(id[0]);
                                if (!obj)
                                    obj = this.diagram._findConnector(id[0]);
                                for (var i = 0; obj && i < obj.labels.length; i++) {
                                    id1 = obj.labels[i].name.split('_');
                                    if (id[id.length - 1] == id1[id1.length - 1]) {
                                        curlabel = obj.labels[i];
                                        if (!this.diagram._selectedSymbol)
                                            this.activeLabel = curlabel;
                                        return curlabel;
                                    }
                                }
                            }
                            if (parentNode && parentNode.id === this.diagram.element[0].id + "_canvas_svg") {
                                break;
                            }
                            else
                                parentNode = parentNode.parentNode;
                        }
                    }
                }
            }
            else if (targetClass == "ej-d-label") {
                var parent = $(evt.target).parents(".ej-d-node,.ej-d-connector,.ej-d-group");
                if (parent) {
                    var id = parent[0].getAttribute("id");
                    var type = parent[0].getAttribute("class");
                    if (type) {
                        if (type === "ej-d-node" || type === "ej-d-group") {
                            obj = this.diagram._findNode(id);
                            if (!obj) obj = this.diagram._findNode(id.split("_label")[0]);
                            var curlabel = this.diagram._findLabelAtPoint(mousePosition ? mousePosition : this.currentPoint, obj);
                            if (!this.diagram._selectedSymbol)
                                this.activeLabel = curlabel;
                        }
                        else if (type === "ej-d-connector") {
                            obj = this.diagram._findConnector(id);
                            if (!obj) obj = this.diagram._findConnector(id.split("_label")[0]);
                            var curlabel = this.diagram._findLabelAtPoint(mousePosition ? mousePosition : this.currentPoint, obj);
                            if (ej.datavisualization.Diagram.Util.canMoveLabel(obj) || drag) {
                                if (curlabel == null) {
                                    var target = $(evt.target);
                                    var id1;
                                    var targetClass = target[0].getAttribute("class");
                                    if (targetClass == "ej-d-label") {
                                        var id = evt.target.id.split('_');
                                        for (var i = 0; i < obj.labels.length; i++) {
                                            id1 = obj.labels[i].name.split('_');
                                            if (id[id.length - 1] == id1[id1.length - 1])
                                                curlabel = obj.labels[i];
                                        }
                                    }
                                }
                            }
                            else
                                curlabel = null;
                            if (!this.diagram._selectedSymbol)
                                this.activeLabel = curlabel;
                        }
                    }
                }
            }
            else if (this.diagram._isLabelTemplate(evt)) {

                var parents = $(evt.target).parents(".ej-label-template");
                var parent = parents[0]
                if (parent) {
                    //var id = parent.parentNode.id.split('_');

                    var id = parent.parentNode.id.split('_')
                    obj = this.diagram._findNode(id[0]);
                    if (!obj)
                        obj = this.diagram._findConnector(id[0]);
                    if (obj) {
                        for (var i = 0; i < obj.labels.length; i++) {
                            id1 = obj.labels[i].name.split('_');
                            if (id[2] == id1[id1.length - 1])
                                curlabel = obj.labels[i];
                        }
                    }
                    if (!this.diagram._selectedSymbol)
                        this.activeLabel = curlabel;
                }
            }
            else {
                this.activeLabel = null;
            }
            return obj;
        };

        ToolBase.prototype._findLabelAtNode = function (node, text) {
            var labels, label = null;
            var size, pt, x, y;
            var bounds, matrix, point;
            if (node && node.labels.length > 0) {
                bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                labels = node.labels;
                for (var i = 0, len = labels.length; i < len; i++) {
                    label = labels[i];
                    if (label.name == text.name) {
                        pt = ej.datavisualization.Diagram.Util._getLabelPosition(label, bounds);
                        pt.x = bounds.x + pt.x;
                        pt.y = bounds.y + pt.y;
                        var width, height;
                        if (this.diagram.model.labelRenderingMode == ej.datavisualization.Diagram.LabelRenderingMode.Svg) {
                            var textElement = document.getElementById(node.name + "_" + label.name).getBBox();
                            width = textElement.width ? textElement.width : 0;
                            height = textElement.height ? textElement.height : 0;
                        }
                        else {
                            var htmlLayer = this.diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                            var textElement = $(htmlLayer).find("#" + node.name + "_" + label.name)[0];
                            width = textElement ? textElement.offsetWidth : 0;
                            height = textElement ? textElement.offsetHeight : 0;
                        }
                        if (!width) width = node.width;
                        if (!height) height = label.fontSize;
                        var size = ej.datavisualization.Diagram.Size(width, height);
                        if (label.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Top) pt.y += size.height / 2;
                        else if (label.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Bottom) pt.y -= size.height / 2;

                        if (label.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Left) pt.x += size.width / 2;
                        else if (label.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Right) pt.x -= size.width / 2;
                        x = pt.x - (label.width ? label.width / 2 : node.width / 2);
                        y = pt.y - (label.height ? label.height / 2 : node.height / 2);
                        point = ej.datavisualization.Diagram.Point(x, y);
                        if (!node.segments) {
                            matrix = ej.Matrix.identity();
                            ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                            point = ej.Matrix.transform(matrix, point);
                        }
                        var location = { x: point.x, y: point.y, width: size.width, height: size.height };
                    }
                }
            }
            return location;
        };

        ToolBase.prototype._getLabelCenter = function (label) {
            var node = this.diagram.findNode(label._parent);
            var labelPosition = this._findLabelAtNode(node, label);
            if (!node.segments) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
                var point = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(labelPosition.x, labelPosition.y));
                var centerPoint = ej.datavisualization.Diagram.Point(point.x + label.width / 2, point.y + label.height / 2);
                var trans = ej.Matrix.identity();
                ej.Matrix.rotate(trans, node.rotateAngle, node.offsetX, node.offsetY);
                var pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(centerPoint.x, centerPoint.y));
            }
            else {
                if (label.relativeMode == "segmentpath") {
                    var labelPosition = ej.datavisualization.Diagram.SvgContext._getConnectorHandlePosition(label, node, 1, this.diagram);
                    pivot = ej.datavisualization.Diagram.Point((labelPosition.position.x + label.margin.left - label.margin.right), (labelPosition.position.y + label.margin.top - label.margin.bottom));
                }
                else
                    pivot = ej.datavisualization.Diagram.Point(labelPosition.x + label.width / 2, labelPosition.y + label.height / 2);
            }
            return pivot;
        };

        ToolBase.prototype._resizeObject = function (shape, difx, dify, phase, disableSnap) {
            var deltaWidth, deltaHeight, diff, rotateAngle, center, x, y;
            var horizontalsnap = { snapped: false, offset: 0, left: false, right: false };
            var verticalsnap = { snapped: false, offset: 0, top: false, bottom: false };
            var startPoint = this.previousPoint;
            var endPoint = this.currentPoint;
            var pivot = ej.datavisualization.Diagram.Point(0, 0);
            if (shape._type !== "label")
                rotateAngle = shape.rotateAngle;
            else
                rotateAngle = this.diagram._findLabelRotateAngle(shape);
            var matrix = ej.Matrix.identity();
            ej.Matrix.rotate(matrix, -rotateAngle);

            var trans = ej.Matrix.identity();
            if (!shape.text)
                center = ej.datavisualization.Diagram.Point(shape.offsetX, shape.offsetY);
            else
                center = this._getLabelCenter(shape);
            ej.Matrix.rotate(trans, rotateAngle, center.x, center.y);
            var w = shape.width;
            var h = shape.height;
            if (shape._type !== "label") {
                x = shape.offsetX - w * shape.pivot.x;
                y = shape.offsetY - h * shape.pivot.y;
            }
            else {
                x = center.x - shape.width / 2;
                y = center.y - shape.height / 2;
            }

            switch (this._resizeDirection) {
                case "n-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x + w / 2, y + h));
                    var deltaWidth = 1;
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify));
                    difx = diff.x; dify = diff.y;
                    if (shape._type !== "label")
                        dify = this._snapTop(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    deltaHeight = (this.initialBounds.height - dify) / shape.height;
                    break;
                case "e-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x, y + h / 2));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label")
                        difx = this._snapRight(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint, disableSnap);
                    dify = 0;
                    deltaWidth = (this.initialBounds.width + difx) / shape.width;
                    deltaHeight = 1;
                    break;
                case "w-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x + w, y + h / 2));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label")
                        difx = this._snapLeft(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    dify = 0;
                    deltaWidth = (this.initialBounds.width - difx) / shape.width;
                    deltaHeight = 1;
                    break;
                case "s-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x + w / 2, y));
                    deltaWidth = 1;
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify));
                    difx = diff.x; dify = diff.y;
                    if (shape._type !== "label")
                        dify = this._snapBottom(horizontalsnap, verticalsnap, diff.x, diff.y, shape, (endPoint && startPoint && endPoint == startPoint) ? true : false);
                    deltaHeight = (this.initialBounds.height + dify) / shape.height;
                    break;
                case "ne-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x, y + h));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label") {
                        difx = this._snapRight(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint, disableSnap);
                        dify = this._snapTop(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    }
                    deltaWidth = (this.initialBounds.width + difx) / shape.width;
                    deltaHeight = (this.initialBounds.height - dify) / shape.height;
                    break;
                case "nw-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x + w, y + h));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label") {
                        dify = this._snapTop(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                        difx = this._snapLeft(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    }
                    deltaWidth = (this.initialBounds.width - difx) / shape.width;
                    deltaHeight = (this.initialBounds.height - dify) / shape.height;
                    break;
                case "se-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x, y));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label") {
                        dify = this._snapBottom(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint, disableSnap);
                        difx = phase ? difx : this._snapRight(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    }
                    deltaWidth = (this.initialBounds.width + difx) / shape.width;
                    deltaHeight = (this.initialBounds.height + dify) / shape.height;
                    break;
                case "sw-resize":
                    pivot = ej.Matrix.transform(trans, ej.datavisualization.Diagram.Point(x + w, y));
                    diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
                    if (shape._type !== "label") {
                        dify = this._snapBottom(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint, disableSnap);
                        difx = this._snapLeft(horizontalsnap, verticalsnap, difx, dify, shape, endPoint == startPoint);
                    }
                    deltaWidth = (this.initialBounds.width - difx) / shape.width;
                    deltaHeight = (this.initialBounds.height + dify) / shape.height;
                    break;
            }
            var point = ej.datavisualization.Diagram.Rectangle(pivot.x, pivot.y, deltaWidth, deltaHeight);
            return point;

        };

        ToolBase.prototype._selectionContainsChild = function (name) {
            if (this.diagram.selectionList[0].children) {
                var children = this.diagram._getChildren(this.diagram.selectionList[0].children);
                var child = null;
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[children[i]];
                    if (child && child.name == name)
                        return true;
                }
            }
            else if (this.diagram.selectionList[0]._type === "group" && this.diagram.selectionList[0].type != "pseudoGroup") {
                if (this.diagram.selectionList[0].name == name)
                    return true;
            }
            else if (this.diagram.nameTable[name] && this.diagram.nameTable[name]._type === "group") {
                children = this.diagram._getChildren(this.diagram.nameTable[name].children);
                for (var j = 0; j < children.length; j++) {
                    child = this.diagram.nameTable[children[j]];
                    if (child)
                        var status = this._selectionContainsChild(child.name);
                    if (status)
                        return status;
                }
            }
            else if (this.diagram.selectionList[0].name == name)
                return true;

            return false;
        };

        ToolBase.prototype._isSelected = function (name) {
            var child = null;
            var node = this.diagram.nameTable[name];
            if (this._selectionContainsChild(node.name))
                return true;
            else if (node._type === "group") {
                var children = this.diagram._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = children[i];
                    if (this._selectionContainsChild(child))
                        return true;
                }
            }
            return false;
        };
        ToolBase.prototype._isColleagueSelected = function (name) {
            var node = this.diagram.nameTable[name];
            var child = null;
            if (node.parent) {
                var parent = this.diagram.nameTable[node.parent];
                if (parent) {
                    var children = this.diagram._getChildren(parent.children);
                    for (var i = 0; i < children.length; i++) {
                        child = children[i];
                        if (this._isSelected(child))
                            return true;
                    }
                }
            }
            return false;
        };
        ToolBase.prototype._isInSelection = function (name) {
            if (this.diagram.selectionList[0].type == "pseudoGroup" && this.diagram.selectionList[0].children) {
                var children = this.diagram._getChildren(this.diagram.selectionList[0].children);
                var child = null;
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[children[i]];
                    if (child.name == name)
                        return true;
                }
            }
        };
        ToolBase.prototype._getCloneNode = function (node) {
            var obj = null;
            obj = jQuery.extend(true, {}, node);
            obj.children = [];
            obj.minHeight = 0;
            obj.minWidth = 0;
            obj.maxHeight = 0;
            obj.maxWidth = 0;
            return obj;
        };
        ToolBase.prototype._getProcessedObject = function (name, obj) {
            var node = this.diagram.nameTable[name];
            if (node) {
                if (this._isInSelection(name)) {
                    return null;
                }
                else if (this._selectionContainsChild(node.name))
                    return { add: node, remove: null };
                else {
                    if (node.parent) {
                        if (this._selectionContainsChild(node.parent)) {
                            if (this._isInSelection(node.parent))
                                return { add: node, remove: this.diagram.nameTable[node.parent] };
                            else {
                                var parent = this.diagram.nameTable[node.parent];
                                if (parent)
                                    return { add: parent, remove: this.diagram.nameTable[parent.parent] };
                            }
                        } else {
                            if (this._isColleagueSelected(node.parent) && !this._selectionContainsChild(node.parent)) {
                                if (this._isSelected(node.parent)) {
                                    return { add: node, remove: null };
                                }
                                else
                                    return { add: this.diagram.nameTable[node.parent], remove: null };
                            }
                            else if (this.diagram.selectionList[0] && this._isInSelection(node.parent)) {
                                return { add: this.diagram.nameTable[node.name], remove: this.diagram.nameTable[node.parent] };

                            }
                            else
                                return this._getProcessedObject(node.parent);
                        }
                    }
                    else {
                        return { add: node, remove: null };
                    }
                }
            }
        };

        ToolBase.prototype.hasSameParent = function () {
            if (this.selectedObject.type == "pseudoGroup") {
                var list = this.selectedObject;
                var child = null;
                if (this.diagram.nameTable[this.diagram._getChild(list.children[0])]) {
                    var parent = this.diagram.nameTable[this.diagram._getChild(list.children[0])].parent;
                    var lChildren = this.diagram._getChildren(list.children);
                    for (var i = 0; i < lChildren.length; i++) {
                        child = this.diagram.nameTable[lChildren[i]];
                        if (child.parent != parent || child.parent == "")
                            return false;
                    }
                }
                return true;
            }
            return false;
        };
        ToolBase.prototype._fromDiagram = function (list) {
            var state = true;
            var child = null;
            for (var i = 0; i < list.length; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                if (child && child.parent) {
                    state = false;
                    break;
                }
            }
            return state;
        };
        ToolBase.prototype._fromContainer = function (list) {
            var child = null, parent = null;
            for (var i = 0; i < list.length; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                if (child.parent) {
                    parent = this.diagram.nameTable[child.parent];
                    if (parent) {
                        if (parent.container)
                            return true;
                    }
                }
            }
        };

        ToolBase.prototype._fromSameContainer = function (list) {
            var child = null;
            var parent = null;
            for (var i = 0; i < list.length; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                if (!parent && child.parent)
                    parent = child.parent;
                if (child.parent) {
                    if (child.parent != parent)
                        return false;
                }
            }
            return true;
        };
        ToolBase.prototype._anyFromContainer = function (list) {
            var child = null;
            var parent = null;
            for (var i = 0; i < list.length; i++) {
                child = this.diagram.nameTable[this.diagram._getChild(list[i])];
                if (child.parent)
                    var parent = this.diagram.nameTable[child.parent];
                if (parent && parent.container && parent.container.type === "canvas") {
                    return true;
                }
            }
            return false;
        };

        ToolBase.prototype._processCtrlKey = function (evt) {
            var obj;
            if (this.diagram.selectionList.length > 0 && ej.datavisualization.Diagram.Util.canDoMultipleSelection(this.diagram)) {
                var selectionList = this.diagram.selectionList;
                var isMultipleSelection, nObj, changeType, newItems = [], oldItems = [], selectedItems = [];
                if (selectionList[0].type == "pseudoGroup") {
                    isMultipleSelection = true;
                    obj = this._findNodeUnderMouse(evt);
                }
                else {

                    obj = this._findNodeUnderMouse(evt);
                }
                var obj1 = this._findNodeUnderMouse(evt, true);
                var tempVal = this.selectedObject;
                var args = this._raiseEvent("itemClick", { element: this.selectedObject, actualObject: this.actualObject, selectedObject: obj1, cancel: false, event: evt });
                this._itemClick(this.selectedObject, this.actualObject, obj1);
                if (args.cancel)
                    this.selectedObject = tempVal;
                if (this.actualObject) {
                    if (this.actualObject.parent) {
                        if (isMultipleSelection) {

                            var mulSelection = selectionList[0];
                            var temp = this._getProcessedObject(this.actualObject.name);
                            if (temp) {
                                if (this.selectedObject) {
                                    mulSelection.children = this.diagram._getChildren(mulSelection.children);
                                    ej.datavisualization.Diagram.Util.removeItem(mulSelection.children, this.selectedObject.name);
                                }
                                else if (temp.remove) {
                                    mulSelection.children = this.diagram._getChildren(mulSelection.children);
                                    ej.datavisualization.Diagram.Util.removeItem(mulSelection.children, temp.remove.name);
                                }


                                if (this.selectedObject) {
                                    if (!this._hasMultipleSelection(this.selectedObject)) {
                                        mulSelection.children.push(this.selectedObject.name);
                                    }
                                } else if (temp.add) {
                                    if (!this._hasMultipleSelection(temp.add)) {
                                        mulSelection.children.push(temp.add.name);
                                    }
                                }
                            } else {
                                nObj = this.actualObject;
                                if (this.selectedObject) {
                                    if (!this._hasMultipleSelection(this.selectedObject))
                                        mulSelection.children.push(this.selectedObject.name);
                                    else {
                                        mulSelection.children = this.diagram._getChildren(mulSelection.children);
                                        ej.datavisualization.Diagram.Util.removeItem(mulSelection.children, this.selectedObject.name);
                                    }
                                } else {
                                    if (!this._hasMultipleSelection(nObj))
                                        mulSelection.children.push(nObj.name);
                                    else {
                                        mulSelection.children = this.diagram._getChildren(mulSelection.children);
                                        ej.datavisualization.Diagram.Util.removeItem(mulSelection.children, nObj.name);
                                    }
                                }
                            }
                            ej.datavisualization.Diagram.Util._updateGroupBounds(mulSelection, this.diagram);
                            if (mulSelection.children.length <= 1) {
                                var child = this.diagram.nameTable[this.diagram._getChild(mulSelection.children[0])];
                                if (this.diagram._hasSelection()) {
                                    this.diagram._clearSelection(true);
                                }
                                this.selectedObject = child;
                                this.diagram._addSelection(this.selectedObject);
                            } else {
                                this.selectedObject = selectionList[0];
                                this.diagram.updateSelection()
                            }

                        } else {
                            if (this.diagram.selectionList[0]._type === "group" && this.diagram.selectionList[0].type !== "bpmn") {
                                selectionList = this.diagram.selectionList[0];
                                temp = this._getProcessedObject(this.actualObject.name);
                                nObj = temp.add;
                                if (temp) {
                                    if (this.diagram._hasSelection()) {
                                        this.diagram._clearSelection();
                                    }
                                }

                            } else {
                                temp = null;
                                if (obj._type === "group") {
                                    temp = this._getProcessedObject(this.actualObject.name);
                                }
                                if (temp)
                                    nObj = temp.add;
                                else
                                    nObj = obj;
                                selectionList = this.diagram.selectionList[0];
                                if (this.diagram._hasSelection()) {
                                    this.diagram._clearSelection();
                                }
                            }
                            this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Keydown
                            pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                            if (selectionList.name != nObj.name)
                                pseudoGroup.children.push(selectionList.name);
                            if (this.selectedObject)
                                pseudoGroup.children.push(this.selectedObject.name);
                            else
                                if (this._containsChild(pseudoGroup, nObj.name))
                                    pseudoGroup.children.push(nObj.name);

                            this._checkRepeatedChild(pseudoGroup.children);

                            this.diagram.nodes().push(pseudoGroup);
                            this.diagram._nodes = $.extend(true, [], this.diagram.nodes());
                            this.diagram.nameTable[pseudoGroup.name] = pseudoGroup;
                            ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this.diagram);
                            this.selectedObject = pseudoGroup;
                            this.diagram._addSelection(this.selectedObject);
                        }
                    }
                    else {
                        if (isMultipleSelection) {
                            mulSelection = selectionList[0];
                            nObj = this.selectedObject ? this.selectedObject : this.actualObject;
                            changeType = (!this._hasMultipleSelection(nObj)) ? "insert" : "remove";
                            if (changeType == "insert") {
                                mulSelection.children.push(nObj.name);
                                newItems.push(nObj);
                            }
                            else {
                                ej.datavisualization.Diagram.Util.removeItem(mulSelection.children, nObj.name);
                                oldItems.push(nObj);
                            }
                            for (var i = 0; i < mulSelection.children.length; i++)
                                selectedItems.push(this.diagram.nameTable[this.diagram._getChild(mulSelection.children[i])]);
                            args = { changeType: changeType, state: "changing", element: this.diagram.nameTable["multipleSelection"], selectedItems: selectedItems, oldItems: oldItems, newItems: newItems, cancel: false };
                            this._raiseEvent("selectionChange", args);
                            if (!args.cancel) {
                                if (changeType == "remove") ej.datavisualization.Diagram.Util.removeItem(this.diagram.model.selectedItems.children, nObj);
                                this.diagram.updateSelection(this.selectedObject);
                                ej.datavisualization.Diagram.Util._updateGroupBounds(mulSelection, this.diagram);
                                this.selectedObject = selectionList[0];
                                if (this.diagram.model.selectedItems.children.length)
                                    ej.datavisualization.Diagram.SvgContext.updateSelector(this.selectedObject, this.diagram._adornerSvg, this.diagram._currZoom, this.diagram, this.diagram.model.selectedItems.constraints);
                                else {
                                    ej.datavisualization.Diagram.Util.clear(this.diagram.selectionList);
                                    ej.datavisualization.Diagram.SvgContext.clearSelector(this.diagram._adornerSvg, this.diagram._adornerLayer, this);
                                }
                                args = { changeType: changeType, state: "changed", element: this.diagram.nameTable["multipleSelection"], selectedItems: selectedItems, oldItems: oldItems, newItems: newItems, cancel: false };
                                this._raiseEvent("selectionChange", args);
                            }
                        }
                        else {
                            var nObj = this.actualObject;
                            this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Keydown
                            selectionList = this.diagram.selectionList[0];
                            if (nObj != selectionList) {
                                if (this.diagram._hasSelection()) {
                                    this.diagram._clearSelection(true);
                                }
                                var pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                                pseudoGroup.children.push(selectionList.name);
                                if (this.selectedObject)
                                    pseudoGroup.children.push(this.selectedObject.name);
                                else
                                    pseudoGroup.children.push(nObj.name);
                                this.diagram.nodes().push(pseudoGroup);
                                this.diagram._nodes = $.extend(true, [], this.diagram.nodes());
                                this.diagram.nameTable[pseudoGroup.name] = pseudoGroup;
                                ej.datavisualization.Diagram.Util._updateGroupBounds(pseudoGroup, this.diagram, null, true);
                                this.selectedObject = pseudoGroup;
                                this.diagram._addSelection(this.selectedObject);
                            }
                        }
                    }
                }

                this.selectedObject = this.diagram.selectionList[0];
            }
            else {
                obj = this._findNodeUnderMouse(evt);
                if ((ej.datavisualization.Diagram.Util.canDoSingleSelection(this.diagram)))
                    this.selectedObject = obj;
            }
            return obj;
        };

        ToolBase.prototype._checkRepeatedChild = function (list) {
            var child = null;
            var cloneList = $.extend(true, {}, list);
            cloneList = this.diagram._getChildren(cloneList);
            for (var i = 0; i < cloneList.length; i++) {
                child = this.diagram.nameTable[cloneList.children[i]];
                if (child._type === "group") {
                    for (var j = 0; j < cloneList.children.length; j++) {
                        if (!this._containsChild(child, cloneList.children[j])) {
                            list.children = this.diagram._getChildren(list.children);
                            ej.datavisualization.Diagram.Util.removeItem(list.children, cloneList.children[j]);
                        }
                    }
                }
            }
        };
        ToolBase.prototype._hasMultipleSelection = function (node) {
            var children = this.diagram._getChildren(this.diagram.selectionList[0].children);
            for (var i = 0; i < children.length; i++) {
                if (node.name == children[i])
                    return true;
            }
            return false;
        };

        ToolBase.prototype._getNextParent = function (node) {
            if (node.parent) {
                var parent = this.diagram.nameTable[node.parent];
                if (this._hasMultipleSelection(parent))
                    return node;
                else
                    return this._getNextParent(parent);
            }
            else
                return node;
        };
        ToolBase.prototype._findObj = function (element, group) {
            var obj;
            var id = element.getAttribute("id");
            if (group) {
                obj = this.diagram._findChildren(group, id);
            }
            else {
                var type = element.getAttribute("class");
                if (type) {
                    if (type === "ej-d-node" || type === "ej-d-group") {
                        obj = this.diagram._findNode(id);
                    }
                    else if (type === "ej-d-connector") {
                        obj = this.diagram._findConnector(id);
                    }
                }
            }
            return obj;
        };
        ToolBase.prototype.mousedown = function (evt) {
            this.startPoint = this.mousePosition(evt);
            this.currentPoint = this.startPoint;
            this.previousPoint = this.startPoint;
            this.diagramBounds = this.diagram._getDigramBounds();
        };
        ToolBase.prototype._isPolyline = function () {
            if (this.diagram.model.drawType.type === "connector" && this.diagram.model.drawType.segments &&
                this.diagram.model.drawType.segments.length > 0 && this.diagram.model.drawType.segments[0].type === "polyline")
                return true;
        };
        ToolBase.prototype.mousemove = function (evt) {
            if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(this.startPoint) ||
                this instanceof ej.datavisualization.Diagram.LineTool || this._isPolyline() || this.diagram.model.rulerSettings.showRulers)
                this.currentPoint = this.mousePosition(evt);
            this._drawRulerMarkers(evt);
        };
        ToolBase.prototype._removeRulerMarkers = function () {
            var markers = document.getElementsByClassName("ej-d-ruler-marker"), marker, i;
            if (markers && markers.length > 0) {
                for (i = markers.length - 1; i >= 0; i--) {
                    marker = markers[i];
                    if (marker)
                        marker.parentNode.removeChild(marker);
                }
            }
        };
        ToolBase.prototype._drawRulerMarker = function (ruler, rulerObj, rulerInstance, isVertical) {
            if (ruler) {
                var rulerSvg, rulerSize, scale, diff, i, attr, line, rulerSvgElements = rulerObj[0].getElementsByTagName("svg");
                if (rulerSvgElements.length > 0) {
                    for (i in rulerSvgElements) {
                        rulerSvg = rulerSvgElements[i]
                        break;
                    }
                }
                if (rulerSvg) {
                    rulerSize = ej.datavisualization.Diagram.ScrollUtil._getRulerSize(this.diagram);
                    if (!isVertical)
                        attr = { "id": rulerObj[0].id + "_marker", 'x1': 0, 'y1': 0, 'x2': 0, 'y2': rulerSize.top, 'stroke': ruler.markerColor, 'stroke-width': 1.5, "class": "ej-d-ruler-marker" };
                    else
                        attr = { "id": rulerObj[0].id + "_marker", 'x1': 0, 'y1': 0, 'x2': rulerSize.left, 'y2': 0, 'stroke': ruler.markerColor, 'stroke-width': 1.5, "class": "ej-d-ruler-marker" };
                    line = this._createMarkarLine(rulerObj, attr);
                    scale = this.diagram._currZoom;
                    diff = rulerInstance.model.offset - rulerInstance._starValue;
                    if (!isVertical) {
                        var xMove = (this.currentPoint.x * scale) - (this.diagram._hScrollOffset) + diff;
                        line.setAttribute('transform', "translate(" + (xMove) + " 0)");
                    }
                    else {
                        var yMove = (this.currentPoint.y * scale) - (this.diagram._vScrollOffset) + diff;
                        line.setAttribute('transform', "translate(0 " + (yMove) + ")");
                    }
                    rulerSvg.appendChild(line)
                }
            }
        };
        ToolBase.prototype._createMarkarLine = function (rulerObj, attr) {
            if (rulerObj) {
                var line = document.getElementById(rulerObj[0].id + "_marker")
                if (line)
                    line.parentNode.removeChild(line);
                line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                ej.datavisualization.Diagram.Util.attr(line, attr);
                return line;
            }
        };
        ToolBase.prototype._drawRulerMarkers = function (evt) {
            if (this.diagram.model.rulerSettings.showRulers) {
                this._drawRulerMarker(this.diagram.model.rulerSettings.horizontalRuler, this.diagram._hRuler, this.diagram._hRulerInstance, false);
                this._drawRulerMarker(this.diagram.model.rulerSettings.verticalRuler, this.diagram._vRuler, this.diagram._vRulerInstance, true);
            }
        };
        ToolBase.prototype.mouseup = function (evt) {
            this._endAction();
            if (this.diagram._pageBackgroundLayer) {
                ej.datavisualization.Diagram.PageUtil._updatePageSize(this.diagram);
            }
            if (this.singleAction) {
                this.diagram.activateTool("select");
            }
            delete this.diagramBounds;
            this._adjustLines = {
                lines: []
            }
            this._undoObject = null;
            this._redoObject = null;
        };
        ToolBase.prototype.mousePosition = function (evt) {
            return this.diagram._mousePosition(evt);
        };
        ToolBase.prototype.updateCursor = function (cursor) {
            this.diagram._currentCursor = cursor;
            this.diagram._updateCursor();
        };
        ToolBase.prototype.nearestGridPoint = function (point) {
            var snapPt = ej.datavisualization.Diagram.Point();
            if (this.diagram.model.snap & ej.datavisualization.Diagram.Snap.Grid) {
                var magnification = this.diagram.model.magnification / 100;
                var hSpacing = this.diagram.model.grid.horizontalSpacing * magnification;
                var vSpacing = this.diagram.model.grid.verticalSpacing * magnification;
                var width = point.x % hSpacing;
                var height = point.y % vSpacing;
                if (width >= (hSpacing / 2)) {
                    snapPt.x = point.x + hSpacing - width;
                }
                else {
                    snapPt.x = point.x - width;
                }
                if (height >= (vSpacing / 2)) {
                    snapPt.y = point.y + vSpacing - height;
                }
                else {
                    snapPt.y = point.y - height;
                }
            }
            return snapPt;
        };
        ToolBase.prototype.snap = function (point) {
            var snapSettings = this.diagram.model.snapSettings;
            var zoomFactor = this.diagram._currZoom;
            if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines)
                point.x = ej.datavisualization.Diagram.SnapUtil._round(point.x, snapSettings.verticalGridLines.snapInterval, zoomFactor);
            if (snapSettings.snapConstraints & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines)
                point.y = ej.datavisualization.Diagram.SnapUtil._round(point.y, snapSettings.horizontalGridLines.snapInterval, zoomFactor);
            return point;

        };
        ToolBase.prototype._endAction = function () {
            this.inAction = false;

            if (this.svgHelper) {
                var helper = this.helper;
                var search = this.diagram._spatialSearch;
                if (helper._type != "group") {
                    ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(search, search.quadTable[helper.name], helper);
                }
                else {
                    var length = this.helper.children.length - 1;
                    for (var i = length; i >= 0; i--) {
                        ej.datavisualization.Diagram.SpatialUtil._removeFromaQuad(search, search.quadTable[helper.children[i].name], helper.children[i]);
                    }
                }
            }
            if (this.helper) {
                if (this.svgHelper) {
                    var diagram = this.diagram;
                    var _currTool = this;
                    this.diagram._views.forEach(function (viewid) {
                        var view = diagram._views[viewid];
                        if (_currTool.helper) {
                            var element = view.svg.getElementById(_currTool.helper.name);
                            var htmlLayer = view.svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                            var label = $(htmlLayer).find("#" + _currTool.helper.name)[0];
                        }
                        if (element && element.parentNode)
                            element.parentNode.removeChild(element);
                        if (label)
                            htmlLayer.removeChild(label);

                    });
                }
                if (this.helper.gradient) {
                    var defs = this.diagram._svg.getElementsByTagName("defs")[0];
                    var hlprEle = this.diagram._svg.getElementById(this.helper.name + "_gradient");
                    if (defs && hlprEle)
                        defs.removeChild(this.diagram._svg.getElementById(this.helper.name + "_gradient"));
                }
                var htmlElement = document.getElementById(this.helper.name + "_parentdiv");
                if (htmlElement)
                    htmlElement.parentNode.removeChild(htmlElement);
            }
            if (this._previousPossibleConnection) {
                this._previousPossibleConnection = null;
                ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
            }
            this._currentPossibleConnection = null;
            this._possibleConnectionPort = null;
            this.helper = null;
            this.svgHelper = null;
            this.selectedObject = null;
            this.startPoint = ej.datavisualization.Diagram.Point(0, 0);
            this.currentPoint = ej.datavisualization.Diagram.Point(0, 0);
            this.previousPoint = ej.datavisualization.Diagram.Point(0, 0);
        };
        ToolBase.prototype._isResizeCorner = function (type) {
            var isResizeCorner = false;
            switch (type) {
                case "n-resize":
                case "e-resize":
                case "w-resize":
                case "s-resize":
                case "ne-resize":
                case "nw-resize":
                case "se-resize":
                case "sw-resize":
                case "targetEndPoint":
                case "sourceEndPoint":
                    isResizeCorner = true;
                    break;
            }
            return isResizeCorner;
        };
        ToolBase.prototype._initHelper = function () {
            if (this.selectedObject) {
                this.helper = $.extend(true, {}, this.selectedObject);
                this._updateHelperName(this.helper);
            }
        };
        ToolBase.prototype._updateHelperName = function (helper, child) {
            if (child) {
                helper.name += "helper";
            }
            else
                helper.name = "helper";
            helper.opacity = 0.5;
            var labels = helper.labels;
            for (var i = 0, len = labels.length; i < len; ++i) {
                labels[i].name += "helper";
            }
            if (helper.ports) {
                var ports = helper.ports;
                for (i = 0, len = ports.length; i < len; ++i) {
                    ports[i].name += "helper";
                }
            }
            if (helper._type === "group") {
                var children = this.diagram._getChildren(helper.children);
                for (i = 0, len = children.length; i < len; i++) {
                    this._updateHelperName(children[i], true);
                }
            }
        };
        ToolBase.prototype._raiseEvent = function (type, args) {
            if (this.diagram.model[type]) {
                args.elementType = this.diagram.getObjectType(args.element);
                args.diagramId = this.diagram.element[0].id;
                this.diagram._trigger(type, args);
            }
            return args;
        };
        ToolBase.prototype._findPort = function (pt, node) {
            var port = this.diagram._findPortAtPoint(pt, node);
            if (!port && node._type === "group") {
                var childPort;
                var children = this.diagram._getChildren(node.children);
                for (var j = 0; j < children.length; j++) {
                    var child = this.diagram.nameTable[children[j]];
                    if (child && !child.segments && !child._isInternalShape) {
                        childPort = this._findPort(pt, child);
                        if (childPort && this.diagram.getObjectType(child) != "group") {
                            this._currentPossibleConnection = child;
                            port = childPort;
                        }
                        else if (childPort) {
                            return childPort;
                        }
                    }
                }
            }
            return port;
        };
        ToolBase.prototype._checkConnectionPossible = function (evt) {
            var port = null, possibleConnector = null;
            var connectedNode = this._sourcePossibleConnection;
            var pt = ej.datavisualization.Diagram.Point(this.currentPoint.x, this.currentPoint.y);
            var node = this.diagram._findConnectableNodeUnderMouse(evt);
            if (node && (this._sourcePossibleConnection || this.selectedObject)) {
                if (this.selectedObject) {
                    if (this._endPoint == "targetEndPoint" && this.selectedObject.sourceNode)
                        connectedNode = this.diagram.nameTable[this.selectedObject.sourceNode];
                    if (this._endPoint == "sourceEndPoint" && this.selectedObject.targetNode)
                        connectedNode = this.diagram.nameTable[this.selectedObject.targetNode];
                }
                if (this.selectedObject && !this.selectedObject._isAnnotationLine)
                    node = ej.datavisualization.Diagram.bpmnHelper.canAllowConnection(this.diagram, connectedNode, node);
            }
            if (node && !(node.segments)) {
                if (!(node.type == "pseudoGroup") && !node.isLane && !node.isSwimlane) {
                    this._showPorts(node);
                    this._currentPossibleConnection = node;
                    if (this._previousPossibleConnection == null || this._previousPossibleConnection.name !== this._currentPossibleConnection.name) {
                        this._previousPossibleConnection = this._currentPossibleConnection;
                    }
                }
                else {
                    this._currentPossibleConnection = null;
                    this._possibleConnectionPort = null;
                }
            }
            else if (this.diagram.activeTool instanceof ej.datavisualization.Diagram.LineTool) {
                this._showPorts();
                this._currentPossibleConnection = null;
                this._possibleConnectionPort = null;
            }
            else {
                var epoint = ej.datavisualization.Diagram.Point(0, 0);
                if (this._endPoint == "targetEndPoint") {
                    epoint.x = this.selectedObject.targetPoint.x - 25;
                    epoint.y = this.selectedObject.targetPoint.y - 25;
                }
                else if (this._endPoint == "sourceEndPoint") {

                    epoint.x = this.selectedObject.sourcePoint.x - 25;
                    epoint.y = this.selectedObject.sourcePoint.y - 25;
                }
                var bounds = ej.datavisualization.Diagram.Rectangle(epoint.x, epoint.y, 50, 50);
                var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(this.diagram._spatialSearch, bounds);
                for (var i = 0; this._nearestNodes && i < this._nearestNodes.length; i++)
                    this._showPort(this._nearestNodes[i], true);
                this._nearestNodes = [];
                for (var i = 0; i < quads.length; i++) {
                    var quad = quads[i];
                    if (quad.objects.length > 0) {
                        for (var j = 0; j < quad.objects.length; j++) {
                            var nd = quad.objects[j];
                            var nodebounds = ej.datavisualization.Diagram.Util.bounds(nd);
                            if (ej.datavisualization.Diagram.Geometry.intersectsRect(bounds, nodebounds)) {
                                if (!nd.segments && nd.visible) {
                                    this._showPort(nd);
                                    this._nearestNodes.push(nd);
                                }
                            }
                            else {
                                if (!nd.segments) {
                                    this._showPort(nd, true);
                                }
                            }
                        }
                    }
                }

                this._currentPossibleConnection = null;
                this._possibleConnectionPort = null;
            }
            if (this._currentPossibleConnection) {
                port = this._findPort(pt, this._currentPossibleConnection);
                if (this._currentPossibleConnection && (this._sourcePossibleConnection || this.selectedObject)) {
                    if (this.selectedObject && !this.selectedObject._isAnnotationLine) {
                        possibleConnector = ej.datavisualization.Diagram.bpmnHelper.canAllowConnection(this.diagram, connectedNode, this._currentPossibleConnection);
                        if (this._currentPossibleConnection != possibleConnector) {
                            this._showPort(this._currentPossibleConnection, true);
                            if (possibleConnector) this._showPort(possibleConnector);
                            port = null;
                        }
                        this._currentPossibleConnection = possibleConnector;
                    }
                }
                if ((port && ej.datavisualization.Diagram.Util.canConnect(port, true)) || ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection)) {
                    ej.datavisualization.Diagram.SvgContext._drawPortHighlighter(port, this._currentPossibleConnection, this.diagram._adornerSvg, this.diagram._adornerLayer,
                        this.diagram._currZoom, this.diagram);
                }
                else {
                    ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                }
                this._possibleConnectionPort = port;
                if (port && ej.datavisualization.Diagram.Util.canConnect(port, true)) {
                    var connectionNode = this._currentPossibleConnection;
                    var point = ej.datavisualization.Diagram.Util._getPortPosition(this._possibleConnectionPort, ej.datavisualization.Diagram.Util.bounds(connectionNode, true));
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, connectionNode.rotateAngle, connectionNode.offsetX, connectionNode.offsetY);
                    point = ej.Matrix.transform(matrix, point);
                    this.currentPoint = point;
                }
            }
            else {
                if (this._previousPossibleConnection) {
                    this._previousPossibleConnection = null;
                    ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                    this._possibleConnectionPort = null;
                }
            }

        };
        ToolBase.prototype._showPorts = function (node) {
            if (node) {
                if (this._currentPossibleConnection && this._currentPossibleConnection.name !== node.name) {
                    this._showPort(this._currentPossibleConnection, true);
                }
                this._showPort(node);
            }
            else {
                if (this._currentPossibleConnection != null) {
                    this._showPort(this._currentPossibleConnection, true);
                }
            }
        };
        ToolBase.prototype._showPort = function (node, hide) {
            var ports;
            var port;
            var portShape;
            var i;
            var len;
            if (hide) {
                ports = node.ports;
                if (ports) {
                    for (i = 0, len = ports.length; i < len; ++i) {
                        port = ports[i];
                        if (port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover ||
                            (port.visibility & ej.datavisualization.Diagram.PortVisibility.Connect &&
                            (this.name == "endPoint" || this instanceof ej.datavisualization.Diagram.LineTool))) {
                            portShape = this.diagram._adornerSvg.getElementById(node.name + "_" + port.name);
                            if (portShape)
                                portShape.setAttribute("visibility", "hidden");
                        }
                    }
                }
            }
            else {
                if (node.visible) {
                    ports = node.ports;
                    if (ports) {
                        for (i = 0, len = ports.length; i < len; ++i) {
                            port = ports[i];
                            if (port.visibility & ej.datavisualization.Diagram.PortVisibility.Hover ||
                                (port.visibility & ej.datavisualization.Diagram.PortVisibility.Connect &&
                                (this.name == "endPoint" && this.inAction || this instanceof ej.datavisualization.Diagram.LineTool))) {
                                portShape = this.diagram._adornerSvg.getElementById(node.name + "_" + port.name);
                                if (portShape)
                                    portShape.setAttribute("visibility", "visible");
                            }
                        }
                    }
                }
            }
        };
        ToolBase.prototype._getAllLaneChildren = function (node, list) {
            var swilane = this.diagram.getNode(node.name)
            if (swilane && swilane.lanes && swilane.lanes.length > 0) {
                for (var i = 0; i < swilane.lanes.length; i++) {
                    for (var j = 0; j < swilane.lanes[i].children.length; j++) {
                        list.push(swilane.lanes[i].children[j]);
                    }
                }
            }
            return list;
        };
        ToolBase.prototype._getAllChildren = function (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].isSwimlane)
                    list.concat(this._getAllLaneChildren(list[i], list));
            }
            return list;
        };
        ToolBase.prototype._showAllPorts = function (hide) {
            var i;
            var len;
            var nodes = this.diagram.nodes();
            nodes = nodes.slice();
            nodes = this._getAllChildren(nodes);
            if (!ej.datavisualization.Diagram.Util.isPageEditable(this.diagram)) hide = true;
            if (hide) {
                for (i = 0, len = nodes.length; i < len; i++) {
                    this._showPort(nodes[i], hide);
                }
            }
            else {
                for (i = 0, len = nodes.length; i < len; ++i) {
                    this._showPort(nodes[i]);
                }
            }
        };
        ToolBase.prototype._disconnect = function (connector) {
            var args;
            var node = this.diagram.nameTable[connector.targetNode];
            var port = null;
            if (node) {
                port = ej.datavisualization.Diagram.Util.findPortByName(node, connector.targetPort);
                args = this._raiseEvent("connectionChange", { element: connector, connection: null, port: null, cancel: false });
                ej.datavisualization.Diagram.Util.removeItem(node.inEdges, connector.name);
                if (!args.cancel) {
                    connector.targetNode = null;
                    connector.targetPort = null;
                }
            }
            node = this.diagram.nameTable[connector.sourceNode];
            if (node) {
                port = ej.datavisualization.Diagram.Util.findPortByName(node, connector.sourcePort);
                args = this._raiseEvent("connectionChange", { element: connector, connection: null, port: null, cancel: false });
                ej.datavisualization.Diagram.Util.removeItem(node.outEdges, connector.name);
                if (!args.cancel) {
                    connector.sourceNode = null;
                    connector.sourcePort = null;
                }
            }
        };
        ToolBase.prototype.getLabelUnderMouse = function () {
            if (!this.diagram._findLabelEditing)
                return this.activeLabel;
            return null;
        };
        ToolBase.prototype._getNodesfrombounds = function (rect, point) {
            var collection = [], bounds, interSectPoints, i, node, len, points;
            var nodes = this.diagram._sortByZIndex(this.diagram.nodes())
            for (i = 0, len = nodes.length; i < len; i++) {
                node = this.diagram.nameTable[nodes[i].name];
                if (ej.datavisualization.Diagram.Util.canConnect(node)) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(node, false);
                    points = [bounds.points[0], bounds.points[1], bounds.points[2], bounds.points[3], bounds.points[0]];
                    var rectPoint = [{ x: rect.left, y: rect.top },
                             { x: rect.right, y: rect.top },
                             { x: rect.right, y: rect.bottom },
                             { x: rect.left, y: rect.bottom },
                             { x: rect.left, y: rect.top }];
                    this.diagram._autoConnectEndPoint = true;
                    interSectPoints = ej.datavisualization.Diagram.Util.interSect(points, rectPoint, null, this.diagram)
                    delete this.diagram._autoConnectEndPoint;
                    var pointInsideRect = false;
                    if (interSectPoints.length == 0) {
                        pointInsideRect = ej.datavisualization.Diagram.Geometry.containsPoint(bounds, point);
                    }
                    if ((interSectPoints && interSectPoints.length) || pointInsideRect) {
                        collection.push(node);
                    }
                }
            }
            collection = this._getAllChildren(collection);
            return collection;
        };
        ToolBase.prototype._slopDistance = function (point1, point2, point) {
            var x1, y1, x2, y2, x, y;
            x = point.x; y = point.y; x1 = point1.x; y1 = point1.y; x2 = point2.x; y2 = point2.y;
            var A = x - x1; var B = y - y1; var C = x2 - x1; var D = y2 - y1;
            var dot = A * C + B * D;
            var len_sq = C * C + D * D;
            var param = -1;
            if (len_sq != 0)
                param = dot / len_sq;
            var xx, yy;
            if (param < 0) {
                xx = x1;
                yy = y1;
            }
            else if (param > 1) {
                xx = x2;
                yy = y2;
            }
            else {
                xx = x1 + param * C;
                yy = y1 + param * D;
            }
            var dx = x - xx;
            var dy = y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        };
        ToolBase.prototype._getNearestNodePorts = function (connector, collection, point, rect) {
            var i, j, node, port, minDist, nearestPort = null, portPoint, bounds, distance, nearestNode = null;
            var matrix, points, slope, nearestPoint = null;
            rect.x = rect.left; rect.y = rect.top;
            rect.width = rect.right - rect.left; rect.height = rect.bottom - rect.top;
            for (i = 0; i < collection.length; i++) {
                node = this.diagram.nameTable[collection[i].name];
                bounds = ej.datavisualization.Diagram.Util.bounds(node);
                for (j = 0; node.ports && node.ports.length > 0 && j < node.ports.length; j++) {
                    port = node.ports[j];
                    portPoint = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds)
                    matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                    portPoint = ej.Matrix.transform(matrix, portPoint);
                    distance = ej.datavisualization.Diagram.Geometry.distance(portPoint, this.currentPoint);
                    if (!minDist || (minDist && minDist > distance)) {
                        minDist = distance;
                        if (ej.datavisualization.Diagram.Geometry.containsPoint(rect, portPoint)) {
                            nearestPort = port;
                        }
                        nearestNode = node;
                    }
                }
            }
            return { nearestNode: nearestNode, nearestPort: nearestPort };
        };
        ToolBase.prototype._updateConnectionTarget = function (connector, isHelper) {
            var istarget = this._endPoint == "targetEndPoint" ? true : false;
            connector = isHelper ? connector : this.diagram.nameTable[this.diagram._getChild(connector)];
            if (connector) {
                var point = this.currentPoint;
                var rect = {
                    left: point.x - connector._endPointHitPadding.left,
                    top: point.y - connector._endPointHitPadding.top,
                    right: connector._endPointHitPadding.right + point.x,
                    bottom: connector._endPointHitPadding.bottom + point.y
                };
                var collection = this._getNodesfrombounds(rect, point);
                var nearestValues = this._getNearestNodePorts(connector, collection, point, rect);
                if (nearestValues.nearestNode) {
                    this._currentPossibleConnection = nearestValues.nearestNode;
                    if (nearestValues.nearestPort) {
                        if ((ej.datavisualization.Diagram.Util.canConnect(nearestValues.nearestPort, true)) || ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection)) {
                            this._possibleConnectionPort = nearestValues.nearestPort
                        }
                    }
                }
                this._removeHighLighter();
                ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                if (this._possibleConnectionPort && ej.datavisualization.Diagram.Util.canConnect(this._possibleConnectionPort, true))
                    ej.datavisualization.Diagram.SvgContext._drawPortHighlighter(this._possibleConnectionPort, this._currentPossibleConnection, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
                else if (this._currentPossibleConnection && ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection))
                    ej.datavisualization.Diagram.SvgContext._drawNodeHighlighter(this._currentPossibleConnection, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
                this.diagram._dock(connector, this.diagram.nameTable, true);
            }
        };
        ToolBase.prototype._raiseConnectionChangeEvent = function (connector, isTarget) {
            var args = { element: connector, endPoint: this._endPoint, connection: this._currentPossibleConnection, port: this._possibleConnectionPort, cancel: false };
            var connectionName = args.connection ? args.connection.name : null;
            var portName = args.port ? args.port.name : null;
            if (isTarget) {
                if (connectionName != connector.targetNode || portName != connector.targetPort)
                    args = this._raiseEvent("connectionChange", args);
            }
            else {
                if (connectionName != connector.sourceNode || portName != connector.sourcePort)
                    args = this._raiseEvent("connectionChange", args);
            }

            if (!args.cancel) {
                if (isTarget) {
                    if (!this._currentPossibleConnection || connector.targetNode != this._currentPossibleConnection.name) {
                        if (this._currentPossibleConnection)
                            this._currentPossibleConnection.inEdges.push(connector.name);
                        if (connector.targetNode) {
                            var node = this.diagram.nameTable[connector.targetNode];
                            if (node)
                                ej.datavisualization.Diagram.Util.removeItem(node.inEdges, connector.name);
                        }
                    }
                    this.diagram._comparePropertyValues(connector, "targetNode", { targetNode: this._currentPossibleConnection ? this._currentPossibleConnection.name : null }, true);
                    connector.targetNode = this._currentPossibleConnection ? this._currentPossibleConnection.name : null;
                    this.diagram._comparePropertyValues(connector, "targetPort", { targetPort: this._possibleConnectionPort ? this._possibleConnectionPort.name : null }, true);
                    connector.targetPort = this._possibleConnectionPort ? this._possibleConnectionPort.name : null;
                }
                else {
                    if (!this._currentPossibleConnection || connector.sourceNode != this._currentPossibleConnection.name) {
                        if (this._currentPossibleConnection)
                            this._currentPossibleConnection.outEdges.push(connector.name);
                        if (connector.sourceNode) {
                            var node = this.diagram.nameTable[connector.sourceNode];
                            if (node)
                                ej.datavisualization.Diagram.Util.removeItem(node.outEdges, connector.name);
                        }
                    }
                    this.diagram._comparePropertyValues(connector, "sourceNode", { sourceNode: this._currentPossibleConnection ? this._currentPossibleConnection.name : null }, true);
                    connector.sourceNode = this._currentPossibleConnection ? this._currentPossibleConnection.name : null;
                    this.diagram._comparePropertyValues(connector, "sourcePort", { sourcePort: this._possibleConnectionPort ? this._possibleConnectionPort.name : null }, true);
                    connector.sourcePort = this._possibleConnectionPort ? this._possibleConnectionPort.name : null;
                }

                return true;
            }
        }
        return ToolBase;
    })();

    ej.datavisualization.Diagram.ToolBase = ToolBase;
    //#endregion

    //#region SelectTool
    var SelectTool = (function (base) {
        ej.datavisualization.Diagram.extend(SelectTool, base);
        function SelectTool(diagram) {
            base.call(this, "select", diagram);
            this.cursor = "default";
            this._svgHelper = null;
        }
        SelectTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            var node = this._findNodeUnderMouse(evt);
            if (node && ej.datavisualization.Diagram.Util.canSelect(node) && ej.datavisualization.Diagram.Util.enableLayerOption(node, "lock", this.diagram)) {
                this.selectedObject = node;
            }
            else
                this.selectedObject = null;

            this._itemClick(this.selectedObject, this.actualObject, this.selectedObject);
            this._nodeUnderMouseDown = this.diagram._findNodeUnderMouse(evt);
        };
        SelectTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            var node = this._nodeUnderMouseDown;
            if ((!this.selectedObject && !ej.datavisualization.Diagram.Geometry.isEmptyPoint(this.startPoint)) ||
            (node && node.isLane && ej.datavisualization.Diagram.Util.canMultiSelectOnLane(node)) || (node && node._type != "connector" && ej.datavisualization.Diagram.Util.canMultiSelectOnNode(node))) {
                if (ej.datavisualization.Diagram.Util.canDoMultipleSelection(this.diagram)) {
                    if (!this.inAction && (this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y)) {
                        this.inAction = true;
                        this._initHelper();
                    }
                    else
                        this._updateHelper();
                }
            }
        };
        SelectTool.prototype.mouseup = function (evt) {
            this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Mouse;
            if (this.inAction) {
                this.currentPoint = this.mousePosition(evt);
                var rect = ej.datavisualization.Diagram.Geometry.rect([{ x: this.startPoint.x, y: this.startPoint.y }, { x: this.currentPoint.x, y: this.currentPoint.y }]);
                if (rect.width !== 0 || rect.height !== 0) {
                    var collection = [];
                    collection = this.diagram._getNodesfrombounds(rect);
                    if (this.diagram._hasSelection()) {
                        collection = this.diagram._getChildren(collection);
                        ej.datavisualization.Diagram.Util.removeItem(collection, "multipleSelection");
                        this.diagram._clearSelection(collection.length ? true : false);
                    }
                    if (collection.length > 0) {
                        var children = collection;
                        var selection;
                        this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.RubberBand
                        if (children.length > 1) {
                            var pseudoGroup = ej.datavisualization.Diagram.Group({ type: "pseudoGroup", "name": "multipleSelection" });
                            for (var i = 0 ; i < children.length; i++) {
                                //children[i].parent = "multipleSelection";
                                pseudoGroup.children.push(this.diagram._getChild(children[i]));
                            }
                            this.diagram.nodes().push(pseudoGroup);
                            this.diagram._nodes = $.extend(true, [], this.diagram.nodes());
                            this.diagram.nameTable[pseudoGroup.name] = pseudoGroup;
                            selection = pseudoGroup;
                        }
                        else {
                            if (ej.datavisualization.Diagram.Util.canDoSingleSelection(this.diagram))
                                selection = collection[0];
                        }
                        if (selection) {
                            if (selection._type === "group" || selection.type === "pseudoGroup")
                                ej.datavisualization.Diagram.Util._updateGroupBounds(selection, this.diagram);
                            this.diagram._addSelection(selection);
                        }
                    }
                }
                else {
                    if (this.diagram._hasSelection() && !this.diagram._isDropped) {
                        this.diagram._clearSelection();
                    }
                }
            }
            else {
                if (this.selectedObject || this.diagram._hasSelection()) {
                    if (evt.ctrlKey || evt.shiftKey) {
                        if (ej.datavisualization.Diagram.Util.canDoMultipleSelection(this.diagram)) {
                            this._processCtrlKey(evt);
                        }
                    }
                    else if (this.diagram._hasSelection() && (!this.selectedObject || (this.diagram.selectionList[0].name != this.selectedObject.name)))
                        this.diagram._clearSelection(this.selectedObject ? true : false);
                    this.diagram._enableAPIMethods = false;
                    this.diagram._addSelection(this.selectedObject);
                    this.diagram._enableAPIMethods = true;
                }
                else if (this.diagram._hasSelection() && !this.diagram._isDropped) {
                    this.diagram._clearSelection();
                }
            }
            this.diagram._isDropped = false;
            this._nodeUnderMouseDown = null;
            if (this.selectedObject || this.actualObject) {
                var obj = this._findNodeUnderMouse(evt);
                var mousePosition = this.diagram._mousePosition(evt.originalEvent);
                this._raiseEvent("click", { element: this.diagram.getNode(obj), actualObject: this.actualObject, count: this.diagram._getEventDetail(evt), offsetX: mousePosition.x, offsetY: mousePosition.y, event: evt });
            }
            base.prototype.mouseup.call(this, evt);

        };
        SelectTool.prototype._endAction = function () {
            if (this._svgHelper) {
                this.diagram._adornerLayer.removeChild(this._svgHelper);
                this.selectedObject = null;
                this._svgHelper = null;
            }
            base.prototype._endAction.apply(this);
        };
        SelectTool.prototype._initHelper = function () {
            if (!this._svgHelper) {
                var g = this.diagram._adornerSvg.g();
                this.diagram._adornerLayer.appendChild(g);

                var scale = this.diagram._currZoom;
                var selectionRect = this.diagram._svg.rect({
                    "id": "helper", "class": "rubberBandSelection", "x": this.startPoint.x * scale, "y": this.startPoint.y * scale,
                    "fill": "transparent", "stroke": "gray", "stroke-dasharray": "2 2", "shape-rendering": "crispEdges"
                });
                g.appendChild(selectionRect);
                g.setAttribute("pointer-events", "none");
                this._svgHelper = g;
            }
        };
        SelectTool.prototype._updateHelper = function () {
            var helper = this.diagram._adornerSvg.getElementById("helper");
            var width = Math.abs(this.startPoint.x - this.currentPoint.x);
            var height = Math.abs(this.startPoint.y - this.currentPoint.y);
            var scale = this.diagram._currZoom;
            var x = ((this.startPoint.x > this.currentPoint.x) ? this.currentPoint.x : this.startPoint.x) * scale;
            var y = ((this.startPoint.y > this.currentPoint.y) ? this.currentPoint.y : this.startPoint.y) * scale;

            if (helper) {
                this.diagram._adornerSvg.rect({
                    "id": helper.id, "x": x,
                    "y": y, "width": width * scale, "height": height * scale
                });
            }
        };
        return SelectTool;
    })(ToolBase);

    ej.datavisualization.Diagram.SelectTool = SelectTool;
    //#endregion

    //#region MoveTool
    var MoveTool = (function (base) {

        ej.datavisualization.Diagram.extend(MoveTool, base);

        function MoveTool(diagram) {
            base.call(this, "move", diagram);
            this.cursor = "move";
            this._isMouseDown = false;
            this.diffx = 0;
            this.diffy = 0;
            this.helper = null;
            this.hoverNode = null;
            this.stackOverNode = null;
            this.undoObject = [];
            this.activeLabel = null;
            this._canMoveLabel = false;
            this.dragState = "";
        }

        MoveTool.prototype.mousedown = function (evt) {
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            this.diffx = 0;
            this.diffy = 0;
            this._allowPan(this.selectedObject, "mousedown", evt);
            base.prototype.mousedown.call(this, evt);
            this._isMouseDown = true;
            this._canMoveLabel = false;
            this.activeLabel = null;
            if (evt)
                var node = this._findNodeUnderMouse(evt);
            if (node && !ej.datavisualization.Diagram.Util.canSelect(node) && ej.datavisualization.Diagram.Util.enableLayerOption(node, "lock", this.diagram)) {
                this.updateCursor("default");
            }
            else if (this.diagram._currentCursor != "pointer")
                this.updateCursor(this.cursor);
            this.dragState = ej.datavisualization.Diagram.DragState.Starting;
        };

        MoveTool.prototype.mousemove = function (evt) {
            this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Mouse;
            this._allowPan(this.selectedObject, "mousemove", evt);
            base.prototype.mousemove.call(this, evt);
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            var start = !this.inAction;
            //Initiate move action
            if (this._isMouseDown && !this.inAction &&
                (this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y || this.diagram._selectedSymbol)) {
                if (!this.selectedObject && ((this.diagram.selectionList && this.diagram.selectionList[0] && this.diagram.selectionList[0].type === "pseudoGroup") || this.diagram._selectedSymbol || (ej.datavisualization.Diagram.Util.canDoSingleSelection(this.diagram)))) {
                    //set the selected object
                    this._updateSelectedObject();
                    // raise item click event
                    //var tempVal = this.selectedObject;
                    //var args = this._raiseEvent("itemClick",
                    //    { actualObject: this.actualObject, selectedObject: this.selectedObject, model: this.diagram.model, cancel: false });
                    this._itemClick(this.selectedObject, this.actualObject, this.diagram.model);
                    //if (args.cancel)
                    //this.selectedObject = tempVal;
                    if (this.selectedObject != null) {
                        var newbounds, oldbounds;
                        newbounds = oldbounds = ej.datavisualization.Diagram.Util.bounds(this.selectedObject);
                        var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                        var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                        if (this.diagram.selectionList[0] != this.selectedObject)
                            this.diagram._clearSelection(true);
                        this._raiseDragEvent({ element: this.diagram.getNode(this.selectedObject), offset: { x: 0, y: 0 }, oldValue: oldValue, newValue: newValue, cancel: false });
                        var childTable = {};
                        if (this.selectedObject && (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup"))
                            childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                        var data = $.extend(true, {}, { "childTable": childTable, "node": this.selectedObject });
                        this.undoObject = jQuery.extend(true, {}, data);
                    }
                }
            }

            if (this._isMouseDown && this.selectedObject && ej.datavisualization.Diagram.Util.canSelect(this.selectedObject) && !this.diagram._isEditing && ej.datavisualization.Diagram.Util.enableLayerOption(this.selectedObject, "lock", this.diagram)) {
                this.dragState = ej.datavisualization.Diagram.DragState.Dragging;
                if (!this.inAction) {
                    this.inAction = true;
                    this.updateCursor("move");
                    this._updateSelection();
                    //Disconnect the connector, if it is being dragged
                    if (this.selectedObject.segments) {
                        if (ej.datavisualization.Diagram.Util.isTargetConnected(this.selectedObject) ||
                            ej.datavisualization.Diagram.Util.isSourceConnected(this.selectedObject)) {
                            this._disconnect(this.selectedObject);
                        }
                    }
                    //disable pointer events to the selected object
                    ej.datavisualization.Diagram.SvgContext._disableSelectedNode(this.selectedObject, this.diagram._svg, this.diagram);
                }

                if (this.diagram && !this.diagram._isEditing) {
                    this._containerMouseMove(evt);

                    //visually update the selected object
                    if (!this.helper)
                        this._updateObject();
                    //update the tooltip
                    if (!this.selectedObject.segments && !this.selectedObject.isLane)
                        this.diagram._renderTooltip(this.selectedObject, start);
                    //not needed since it is enough to update the selection for the first time
                    //this._updateSelection();
                    this.diagram._updateSelectionHandle(true);
                }
            }
            this.previousPoint = this.currentPoint;
            this._stackOverNode = this._findStackOverNode(this.helper, evt);
            delete this.diagram._notAllow;
        };

        //set the selected object
        MoveTool.prototype._updateSelectedObject = function () {
            var selectedObject = this.diagram._focusedElement;
            if (selectedObject) {
                if (this.diagram.selectionList[0] && this.diagram.selectionList[0].type == "pseudoGroup") {
                    this.selectedObject = this.diagram.selectionList[0];
                } else {
                    if (this.diagram.selectionList[0] != selectedObject) {
                        this.diagram._clearSelection(true);
                        this.selectedObject = this.diagram.nameTable[selectedObject.name];
                    } else {
                        this.selectedObject = this.diagram.nameTable[this.diagram.selectionList[0].name];
                    }
                }
            }
        };
        MoveTool.prototype._nodeCanHighlight = function (hoverNode) {
            var status = false;
            if ((this.diagram._getChildren(hoverNode.children)).indexOf(this.selectedObject.name) == -1) {
                if (this.selectedObject._type != "group") {
                    status = true;
                }
                else {
                    if (hoverNode._type === "group") {
                        if (!this._containsChild(this.selectedObject, hoverNode.name))
                            status = true;
                    }
                }
            }
            return status;
        },
        MoveTool.prototype._swimlanPhaseDrag = function (evt) {
            if (this.selectedObject && this.selectedObject.isPhase) {
                var swimlane = null;
                var btmNode = this._getNodeUnderMouse();
                if (btmNode)
                    swimlane = this._getSwimLaneNode(btmNode, this.selectedObject, true);
                if (swimlane) {
                    ej.datavisualization.Diagram.SvgContext._drawNodeHighlighter(swimlane, this.diagram._adornerSvg, this.diagram._adornerLayer, this.diagram._currZoom);
                }
            }
        };
        MoveTool.prototype._containerMouseMove = function (evt) {
            //#region for Container
            var overNode, gHighLight;
            var parent = this.selectedObject.parent && this.diagram.nameTable[this.selectedObject.parent];
            if (parent && parent.container) {
                var container = parent.container;
                if (container.type == "canvas" || container.type == "stack") {
                    ej.datavisualization.Diagram.canvasHelper._updateHelper(this.diagram);
                    ej.datavisualization.Diagram.canvasHelper._updateHighlighter(this.diagram, evt);
                }
            } else {
                if (!this.selectedObject.isSwimlane) {
                    if ((this.selectedObject.type == "pseudoGroup") && this._isParentAsLane(this.selectedObject)) {
                        this._removeHighLighter();
                    }
                    else if (!this.isDiagram(evt) && !this.selectedObject.segments) {
                        overNode = this._getNodeUnderMouse();
                        //this.hoverNode = this.stackOverNode;
                        if (overNode && overNode.container && (this.selectedObject.isSwimlane || this.selectedObject.isLane)) {
                            if (this._getSwimLaneNode(overNode, this.selectedObject))
                                this._nodeHighLighter(overNode);
                        }
                        else if (overNode && overNode.container && overNode.container.type != "stack") {
                            if (this.selectedObject.name != overNode.name && this.selectedObject.type != "pseudoGroup" && ej.datavisualization.Diagram.bpmnHelper.canAllowDropOnContainer(this.selectedObject, overNode))
                                this._nodeHighLighter(overNode);

                            if (overNode && (this.selectedObject.type == "pseudoGroup" || this.selectedObject.name == "multipleSelection")) {
                                if (this._fromDiagram(this.selectedObject.children)) {
                                    this._nodeHighLighter(overNode);
                                }
                            }
                        }
                        else if (overNode) {
                            this._removeHighLighter();
                            if (!overNode.segments)
                                this._nodeHighLighter(overNode);
                            else {
                                ej.datavisualization.Diagram.SvgContext._drawConnectorHighlighter(overNode, this.diagram, this.diagram._currZoom);
                            }
                        }
                    }
                    else if (!this.isDiagram(evt) && this.selectedObject.isPhase) {
                        ej.datavisualization.Diagram.SvgContext._disableSelectedNode(this.selectedObject, this.diagram._svg, this.diagram);
                    }
                    else
                        this._removeHighLighter();
                }
                if (!gHighLight) {
                    if (this.selectedObject.type == "pseudoGroup") {
                        if (this._fromDiagram(this.diagram._getChildren(this.selectedObject.children))) {
                            if (!this._undoObject)
                                ej.datavisualization.Diagram.Util._getUndoObject(this.diagram, this.selectedObject);
                            this._updateXY(this.selectedObject, this.previousPoint, this.currentPoint);
                        }
                        else if ((this._fromSameContainer(this.diagram._getChildren(this.selectedObject.children)) && this.hasSameParent()) || this._anyFromContainer(this.diagram._getChildren(this.selectedObject.children))) {

                            this._updateXY(this.selectedObject, this.previousPoint, this.currentPoint);

                        }
                    }
                    else if (ej.datavisualization.Diagram.Util.canMove(this.selectedObject))
                        this._updateXY(this.selectedObject, this.previousPoint, this.currentPoint);
                }
            }
            //#endregion  
            this._swimlanPhaseDrag(evt);
        };

        MoveTool.prototype.isDiagram = function (evt) {
            if (evt.target.id == this.diagram._id + "_canvas_svg" || evt.target.id.match(this.selectedObject.name))
                return true;
            else
                return false;
        };
        MoveTool.prototype._allowPan = function (node, moveType, evt) {
            if (moveType === "mousedown")
                this.diagram.tools["panTool"].mousedown(evt);
            if (node && (node._type === "group" || node._type == "node") && (node.constraints & ej.datavisualization.Diagram.NodeConstraints.AllowPan)) {
                if (moveType === "mousemove")
                    this.diagram.tools["panTool"].mousemove(evt);
                else if (moveType === "mouseup")
                    this.diagram.tools["panTool"].mouseup(evt);
            }
        };
        MoveTool.prototype._checkForDropEvent = function (hoverNode, skip) {
            if (!this.diagram._selectedSymbol) {
                var source = this.diagram, target = hoverNode, childBounds = null, objectType = ej.datavisualization.Diagram.ObjectTypes.Diagram;
                if (this.selectedObject && this.selectedObject.parent) {
                    source = this.diagram.nameTable[this.selectedObject.parent];
                    if (source.isLane) objectType = ej.datavisualization.Diagram.ObjectTypes.Lane;
                    else if (source._type == "group") objectType = ej.datavisualization.Diagram.ObjectTypes.Group;
                }
                if (hoverNode && !skip) {
                    childBounds = ej.datavisualization.Diagram.Util.bounds(hoverNode);
                    target = this._getTargetNode(hoverNode, childBounds);
                }
                do {
                    if (hoverNode && !ej.datavisualization.Diagram.Util.canAllowDrop(hoverNode)) {
                        if (hoverNode.parent) hoverNode = this.diagram.nameTable[hoverNode.parent];
                        else
                            if (hoverNode.container) {
                                break;
                            }
                            else
                                hoverNode = null;
                    }
                    else break;
                } while (hoverNode);
                if (hoverNode) {
                    var args = this._raiseEvent("drop", { cancel: false, element: this.selectedObject, source: this.diagram.getNode(source), target: this.diagram.getNode(target), sourceType: objectType });
                    return args.cancel;
                }
            }
            return false;
        };

        MoveTool.prototype._getSwimLaneNode = function (node, selNode, isPhase) {
            if (node.isSwimlane) {
                if (isPhase) {
                    if (this.diagram.nameTable[this.diagram._getChild(node.children[2])].container.orientation == selNode.orientation)
                        return node;
                }
                else if (this.diagram.nameTable[this.diagram._getChild(node.children[2])].container.orientation != selNode.orientation)
                    return node;
            }
            if (node.parent) {
                var parent = this.diagram.nameTable[node.parent];
                if (parent) {
                    return this._getSwimLaneNode(parent, selNode, isPhase);
                }
            }
            return null;
        };
        MoveTool.prototype._cloneGroupNode = function (node, id) {
            var child = null, child1, clnObj, node1;
            node1 = $.extend(true, {}, node);
            node1.name += id;
            if (node && node._type === "group") {
                node1.children = [];
                var children = this.diagram._getChildren(node.children);
                for (var i = 0; i < children.length; i++) {
                    child = this.diagram.nameTable[children[i]];
                    child1 = $.extend(true, {}, child);
                    child1.name += id;
                    if (child1.parent)
                        child1.parent += id;
                    if (child1._type === "group")
                        this._cloneGroupNode(child1, id);
                    this.diagram.nameTable[child1.name] = child1;
                    node1.children.push(child1);
                }
            }
            return node1;
        };
        MoveTool.prototype._outOfBoundsLaneDrop = function (node, swimlane) {
            if (node && node.isLane && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                var size = this._getPageBounds();
                var offsetX = swimlane.offsetX, offsetY = swimlane.offsetY, height = 0, width = 0, phaseSize = 0, headHeight = 0;
                var laneStack = this.diagram.nameTable[this.diagram._getChild(swimlane.children[2])];
                var header = this.diagram.nameTable[this.diagram._getChild(swimlane.children[0])];
                headHeight = header ? header.height : headHeight;
                phaseSize = swimlane.phaseSize ? swimlane.phaseSize : phaseSize;
                if (laneStack) {
                    var lane = this.diagram.nameTable[this.diagram._getChild(laneStack.children[0])];
                    if (lane) {
                        height = lane.minHeight > 100 ? lane.minHeight : 100;
                        width = lane.minWidth > 100 ? lane.minWidth : 100;
                    }
                }
                if (node.orientation === "horizontal") {
                    var aX = width;
                    var aY = height + header.height + phaseSize;
                }
                else {
                    var aX = width + phaseSize;
                    var aY = height + header.height;
                }

                if (offsetX + aX / 2 + 5 >= size.width || offsetX - aX / 2 - 5 <= size.x) {
                    return false
                }
                if (offsetY + aY / 2 + 5 >= size.height || offsetY - aY / 2 - 5 <= size.y) {
                    return false
                }

            }
            return true;
        };
        MoveTool.prototype._getMouseOverElement = function (evt, mouseup) {
            var node = null;
            if (evt && evt.target) {
                var parents = $(evt.target).parents(".ej-d-node,.ej-d-connector,.ej-d-group,.ej-d-group ej-d-classifier,.ej-d-node ej-d-classifier,.ej-d-label ej-d-classifier");
                var parent = parents[0];
                var i = 1;
                while (parent) {
                    var foreignObject = this.diagram._isForeignObject(evt.target);
                    if (foreignObject)
                        node = this.diagram._findNode(parent.getAttribute("id").split('_parentdiv')[0]);
                    else {
                        node = this.diagram._findNode(parent.getAttribute("id"));
                        if (!node) node = this.diagram._findNode(parent.getAttribute("id").split("_label")[0]);
                    }
                    if (node && node.container) {
                        parent = null;
                    } else {
                        if (node && mouseup && node._isHeader && node.parent) {
                            var pObj = this.diagram.nameTable[node.parent];
                            if (pObj && pObj.isSwimlane) {
                                break;
                            }
                        }
                        parent = parents[i];
                        if (!parent && node && node.parent) {
                            var parentObj = this.diagram.nameTable[node.parent];
                            if (parentObj && parentObj.isLane)
                                node = parentObj;
                        }
                        i++;
                    }
                }
            }
            return node;
        };
        MoveTool.prototype._multiNodedrag = function (evt, overNode) {
            if (ej.datavisualization.Diagram.canvasHelper && !this._containsSwimlane(this.selectedObject.children))
                ej.datavisualization.Diagram.canvasHelper._multiNodedrag(this.diagram, evt, this.selectedObject);
        },
        MoveTool.prototype._changeNodeState = function (evt, doc, mouseup) {
            var newObj, pNode, mergNode = null;
            var overNode = this._getMouseOverElement(evt, mouseup);
            if (overNode) overNode = (this.selectedObject && !this.selectedObject.isLane || overNode.isLane) ? overNode : null;
            //#region drop fropm palette
            if (this.diagram._selectedSymbol && this.diagram._selectedSymbol.isLane && !doc) {
                this.diagram._isDragg = true;
                if (overNode)
                    mergNode = this._getSwimLaneNode(overNode, this.selectedObject);
                if (overNode && mergNode) {
                    ej.datavisualization.Diagram.canvasHelper._addNewLane(this.diagram, overNode, mergNode);
                }
                else {
                    //add new stack
                    var header = this.diagram.nameTable[this.diagram._getChild(this.selectedObject.children[0])];
                    this.diagram._isUndo = true;
                    this.diagram.remove(this.selectedObject);
                    ej.datavisualization.Diagram.containerCommon._removeObject(this.diagram, this.selectedObject);
                    if (this.diagram._selectedSymbol)
                        ej.datavisualization.Diagram.containerCommon._removeObject(this.diagram, this.diagram._selectedSymbol);
                    this.diagram._isUndo = false;


                    var swimlane = ej.datavisualization.Diagram.SwimLaneHelper._createSwimlane(this.selectedObject, this.diagram, null, null, header);
                    if (swimlane) {
                        var args;
                        args = { element: this.diagram.getNode(this.selectedObject), cancel: false };

                        this.diagram._selectedSymbol = null;
                        if (this._outOfBoundsLaneDrop(this.selectedObject, swimlane)) {
                            this.diagram._raiseDropEvent(args);
                            if (!args.cancel) {
                                this.diagram._eventCause["nodeCollectionChange"] = ej.datavisualization.Diagram.CollectionChangeCause.Drop;
                                if (this.diagram.add(swimlane)) {
                                    swimlane = this.diagram.nameTable[swimlane.name] || swimlane;
                                    this.diagram._selectedSymbol = swimlane;
                                    this.diagram._updateDroppedSymbol(swimlane);
                                    this.selectedObject = swimlane;
                                }
                                else {
                                    this.selectedObject = null;
                                }
                            }
                            else {
                                this.selectedObject = null;
                            }
                        }
                        else this.selectedObject = null;
                    }
                }
            }//#endregion
                //#region for Container 
            else if (this.selectedObject && this.selectedObject.parent && this.diagram.nameTable[this.selectedObject.parent].container) {
                var selectedParent = this.diagram.nameTable[this.selectedObject.parent];
                if (selectedParent) {
                    var container = selectedParent.container;
                    this._removeHelpers();
                    if (container && container.type == "canvas") {
                        ej.datavisualization.Diagram.SvgContext._showNode(this.selectedObject, this.diagram._svg);
                        if (this.selectedObject.type != "pseudoGroup" && !this.diagram._isDragg)
                            this._swimlaneNodeDragged = ej.datavisualization.Diagram.canvasHelper._singleNodedrag(this.diagram, evt, overNode);
                    } else if (container.type == "stack") {
                        ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                    } else { //add to diagram
                        if (this.isDiagram(evt)) {
                            this._addToDiagram();
                        }
                        this.diffx = this.diffy = 0;
                    }
                }
            }
            else {///added from diagram to container
                if (this.selectedObject && !this.selectedObject.isSwimlane) {
                    if (this.selectedObject.type == "pseudoGroup" && this.hasSameParent()) {
                        this.currentPoint = this.previousPoint;
                        this.diffx = 0; this.diffy = 0;
                        this._removeHelpers();
                        this._multiNodedrag(evt, overNode);
                    }
                    else if ((this.selectedObject.type != "connector" || this.selectedObject.isPhase) && !this.isDiagram(evt) && this.selectedObject.type != "pseudoGroup") {
                        var overNode = this._getMouseOverElement(evt);
                        if (!this.diagram._isDragg) {
                            if (overNode && overNode.container && ej.datavisualization.Diagram.Util.canAllowDrop(overNode) && (!this._checkForDropEvent(overNode)) && !overNode.isSwimlane && ej.datavisualization.Diagram.bpmnHelper.canAllowDropOnContainer(this.selectedObject, overNode)) {
                                var drgNode = this.helper ? this.helper : this.selectedObject;
                                if (ej.datavisualization.Diagram.canvasHelper._outOfBoundaryNodeDrop(this.diagram, drgNode, overNode)) {
                                    ej.datavisualization.Diagram.canvasHelper._addNodeToContainer(this.diagram, this.selectedObject, overNode);
                                    var cause1 = this.diagram._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Drop;
                                    this.diagram._raiseGroupChangeEvent(this.selectedObject, null, overNode, cause1);
                                }
                                else {
                                    this.diagram._translate(this.selectedObject, (this.undoObject.node.offsetX - this.selectedObject.offsetX), (this.undoObject.node.offsetY - this.selectedObject.offsetY), this.diagram.nameTable);
                                    this.diagram._updateAssociatedConnectorEnds(this.selectedObject, this.diagram.nameTable);
                                }
                            }
                            else if (overNode && this.selectedObject.name != overNode.name) {
                                this._checkForDropEvent(overNode, true);
                            }
                        }
                    }
                    else {
                        if (this.selectedObject.type != "connector" || this.selectedObject.isPhase) {
                            var oldParent = ""
                            if ((this.selectedObject.type == "pseudoGroup" || this.selectedObject.name == "multipleSelection") && this.diagram._activeSwimLane) {
                                //this._updateChildContainer(this.selectedObject);
                                this._multiNodedrag(evt, overNode);
                                this.diagram._raiseGroupChangeEvent(this.selectedObject, null, this.diagram._activeSwimLane, "group")
                                this.selectedObject = null;
                            }
                            else if (!this.diagram._activeSwimLane && overNode && overNode.isLane) {
                                this.diagram._activeSwimLane = this._getParentSwimlane(overNode);
                                //this._updateChildContainer(this.selectedObject);
                                this._multiNodedrag(evt, overNode);
                                this.diagram._raiseGroupChangeEvent(this.selectedObject, null, overNode, "group")
                                this.selectedObject = null;
                            }
                            else if (overNode && (overNode.type == "bpmn" || overNode.container)) {
                                this._multiNodedrag(evt, overNode);
                                this.diagram._raiseGroupChangeEvent(this.selectedObject, null, overNode, "group")
                                this.selectedObject = null;
                            }
                        }
                        else if (overNode && (this.selectedObject.type == "pseudoGroup" || this.selectedObject.name == "multipleSelection")) {
                            if (this._fromDiagram(this.selectedObject.children)) {
                                if (ej.datavisualization.Diagram.Util.canAllowDrop(overNode)) {
                                    ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                                    ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                                    this._multiNodedrag(evt, overNode);
                                }

                            }
                        }
                    }
                }
            }
            this._removeHelpers();
            this._checkPhaseDrop(evt);
            return newObj;
            //#endregion   
        };
        MoveTool.prototype._checkPhaseDrop = function (evt) {
            var swimlane = null, nOffset, orientation;
            if (this.selectedObject && this.selectedObject.isPhase) {
                var btmNode = this._findNodeUnderMouse(evt);
                if (btmNode)
                    swimlane = this._getSwimLaneNode(btmNode, this.selectedObject, true);
                if (swimlane) {
                    ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                    ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                    var swimlaneHeader = this._getSwimlaneHeader(swimlane)
                    if (this.selectedObject.orientation == "vertical") {
                        nOffset = this.currentPoint.x - (swimlane.offsetX - (swimlane.width / 2));
                        orientation = "horizontal";
                    }
                    else {
                        nOffset = this.currentPoint.y - (swimlane.offsetY - (swimlane.height / 2));
                        nOffset -= swimlaneHeader ? swimlaneHeader.height : 0;
                        orientation = "vertical";
                    }
                    var args;
                    args = { element: this.selectedObject, cancel: false, target: swimlane };
                    this.diagram._dropPhase = true;
                    this.diagram.remove(this.selectedObject);
                    delete this.diagram._dropPhase;
                    this.diagram._selectedSymbol = null;
                    this.inAction = false;
                    var label = (this.selectedObject.labels && this.selectedObject.labels.length > 0) ? this.selectedObject.labels[0] : { text: "Phase" };
                    this.diagram._addPhase(swimlane.name, {
                        name: ej.datavisualization.Diagram.Util.randomId(), offset: nOffset, orientation: orientation,
                        label: label,
                        lineColor: this.selectedObject.lineColor,
                        lineDashArray: this.selectedObject.lineDashArray,
                        lineWidth: this.selectedObject.lineWidth,
                    });
                    this.diagram._selectedSymbol = null;
                }
                else {
                    this.diagram._remove(this.selectedObject);
                    this.diagram._clearSelection(true);
                    this.selectedObject = null;
                    this.diagram._selectedSymbol = null;
                }
            }
        };
        MoveTool.prototype._removeHelpers = function () {
            ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
            ej.datavisualization.Diagram.SvgContext._removeConnectorHighlighter(this.diagram._adornerLayer, this.diagram._adornerSvg);
            this._removeHighLighter();
            this.diffx = 0;
            this.diffy = 0;
        };
        MoveTool.prototype._updateNodeState = function (evt, newObj) {
            if (this.diagram.nameTable[this.selectedObject.parent])
                var container = this.diagram.nameTable[this.selectedObject.parent].container;
            var overNode = this._getNodeUnderMouse();
            if (overNode) overNode = (!this.selectedObject.isLane || overNode.isLane) ? overNode : null;
            if (container) {
                if (container.type == "canvas") {
                    if (overNode && newObj) {
                        var pNode = this.selectedObject.parent;
                        var swimlane = this.diagram._getSwimlane(pNode);
                        if (swimlane)
                            this.diagram._updateChildAdjacentConnectors(swimlane, true);
                        ej.datavisualization.Diagram.DiagramContext.update(newObj, this.diagram);
                    }
                }
                else if (container.type == "stack") {
                    var evtArgs = this._checkForDropEvent(overNode);
                    if (!evtArgs) {
                        var stackOverNode = this._stackOverNode;
                        if (stackOverNode) {
                            var parent = this.diagram.nameTable[stackOverNode.parent];
                            if (!parent) parent = overNode;
                            var groupBounds123 = ej.datavisualization.Diagram.Util.bounds(parent);
                            var grAngle = parent.rotateAngle;
                            if (!(parent.rotateAngle == 0) && (grAngle == 0))
                                this.diagram._rotate(parent, -parent.rotateAngle, this.diagram.nameTable);
                            parent.children = this.diagram._getChildren(parent.children);
                            if (this.selectedObject.name != stackOverNode.name) {
                                ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this.diagram)
                                ej.datavisualization.Diagram.canvasHelper._swapLane(this.diagram, parent.children, this.selectedObject.name, stackOverNode.name, ((parent.container.orientation === "vertical") ? true : false), parent);
                                if (parent.children && parent.children.length > 0) {
                                    for (var i = 0; i < parent.children.length; i++) {
                                        parent.children[i] = this.diagram.nameTable[parent.children[i]];
                                    }
                                }
                            }

                        } else {
                            this.diffx = this.diffy = 0;
                        }
                    }
                }
            }
            else if (this.selectedObject.type == "pseudoGroup") {
                var fNode = this.diagram.nameTable[this.diagram._getChild(this.selectedObject.children[0])];
                if (fNode && fNode.parent)
                    container = this.diagram.nameTable[fNode.parent].container;
                if (container && container.type == "canvas") {
                    if (overNode && newObj) {
                        pNode = this.selectedObject.parent;
                        this.diagram._updateChildAdjacentConnectors(pNode, true);
                        ej.datavisualization.Diagram.DiagramContext.update(newObj, this.diagram);
                    }
                }
            }
            if (this.selectedObject && this.selectedObject.lebels && this.selectedObject.lebels.length > 0 && this.diagram.nameTable[this.selectedObject.name]) {
                this.diagram._updateQuad(this.selectedObject);
            }
        };
        MoveTool.prototype.mouseup = function (evt, doc) {
            var skip = this.inAction;
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            var clickedObject, newObj;
            this.diagram._eventCause["selectionChange"] = ej.datavisualization.Diagram.SelectionChangeCause.Mouse;
            if (this.inAction) {
                this.dragState = ej.datavisualization.Diagram.DragState.Completed;
                ej.datavisualization.Diagram.SvgContext._enableSelectedNode(this.selectedObject, this.diagram._svg, this.diagram);
                newObj = this._changeNodeState(evt, doc, true);
                this.inAction = false;
                if (this.selectedObject) {
                    var newbounds, oldbounds;
                    newbounds = oldbounds = ej.datavisualization.Diagram.Util.bounds(this.selectedObject);
                    var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                    var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                    if (!this.selectedObject.isLane) {
                        if (!this._swimlaneNodedragged)
                            var endAction = this._updateXY(this.selectedObject, this.previousPoint, this.currentPoint);
                        if (!(this.selectedObject && this.selectedObject.parent && this.diagram.nameTable[this.selectedObject.parent].container) || !newObj) {
                            this._raiseDragEvent({ element: this.diagram.getNode(this.selectedObject), offset: { x: 0, y: 0 }, oldValue: oldValue, newValue: newValue, cancel: false });
                            this.dragState = "";

                        }
                    }
                    //#region for Container
                    if (!doc) this._updateNodeState(evt, newObj);
                    //#endregion 
                    this._updateObject();
                    var data;
                    var childTable = {};
                    if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup")
                        childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                    if (!this.diagram._selectedSymbol && !this.selectedObject.isPhase && !this.selectedObject.isLane && !this._isLane && !this.diagram._isDragg) {
                        var temp = { "childTable": childTable, "node": this.selectedObject };
                        data = $.extend(true, {}, temp);
                        var entry = { type: "positionchanged", undoObject: jQuery.extend(true, {}, this.undoObject), redoObject: jQuery.extend(true, {}, data), isMultipleNode: (this.selectedObject._type === "group") ? true : false, category: "internal", activeLabel: this.activeLabel };
                        if (!this._multipleUndo)
                            this.diagram.addHistoryEntry(entry);
                        if (this.selectedObject.parent && this.diagram.nameTable[this.selectedObject.parent].type == "bpmn" && this.diagram._isGroupActionEnabled) {
                            this.diagram._closeGroupAction();
                            delete this.diagram._isGroupActionEnabled;
                        }
                    }
                    if (this.diagram._selectedSymbol && this.diagram._selectedSymbol.isSwimlane) this.diagram._selectedSymbol = null;
                    this.diagram._updateSelectionHandle();
                    clickedObject = this.selectedObject;
                    this._isLane = false;
                    this._multipleUndo = false;
                }
            }
            else {
                if (!this.selectedObject) {
                    if (evt.ctrlKey || evt.shiftKey) {
                        clickedObject = this._processCtrlKey(evt);
                    }
                    else {
                        var isMulSelect = true;
                        var className = evt.target.className;
                        if (ej.datavisualization.Diagram.Util.isClassifier(evt))
                            var mNode = ej.datavisualization.Diagram.ClassifierHelper.getSelectableElementUnderMouse(evt, this.diagram);
                        else
                            mNode = this._findNodeUnderMouse(evt);
                        if (evt.which === 3 && this.diagram.selectionList[0] && (this.diagram.selectionList[0].type === "pseudoGroup" || this.diagram.selectionList[0]._type === "group") && this._hasMultipleSelection(mNode))
                            isMulSelect = false;
                        if (ej.datavisualization.Diagram.Util.canDoSingleSelection(this.diagram) && this._isMouseDown) {
                            if (isMulSelect)
                                this.selectedObject = mNode;
                            else
                                this.selectedObject = this.diagram.selectionList[0];
                        }
                        clickedObject = this.selectedObject;
                    }
                    var selectedObject = this.diagram.selectionList.length > 0 ? this.diagram.selectionList[0] : null;
                    if (this.selectedObject && !this.diagram._selectionContains(this.selectedObject))
                        this.diagram._clearSelection(true);
                }
                else {
                    clickedObject = this._findNodeUnderMouse(evt);
                }
            }
            if (!endAction && this.selectedObject) {
                if (this.selectedObject && this.selectedObject.type != "pseudoGroup") {
                    if (!skip) {
                        var obj1 = this._findNodeUnderMouse(evt, true);
                        var tempVal = this.selectedObject;
                        var args = this._raiseEvent("itemClick", { element: this.selectedObject, actualObject: this.actualObject, selectedObject: obj1, model: this.diagram.model, cancel: false, event: evt });
                        this._itemClick(this.selectedObject, this.actualObject, obj1, selectedObject);
                        if (args.cancel)
                            this.selectedObject = tempVal;
                    }
                }
                if (this.selectedObject) {
                    this._allowPan(this.selectedObject, "mouseup", evt);
                    if (!this.selectedObject.isPhase)
                        this._updateSelection();
                    this._enableLabel(this.selectedObject, this.activeLabel);
                    if (this.selectedObject && this.selectedObject.parent === "") {
                        if (!this.selectedObject.isSwimlane) {
                            if (!this.diagram._isHyperLink(evt))
                                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                        }
                        else {
                            ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this.diagram);
                            ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                            ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this.diagram, this.selectedObject);
                        }
                        var selectObj = this.selectedObject;
                        if (this.diagram._isDragg && !this.diagram._selectionContains(selectObj)) {
                            this.diagram._clearSelection();
                            if (!selectObj.isPhase)
                                this.diagram._addSelection(selectObj);
                        }
                    }
                }
                if (clickedObject && !skip) {
                    //raise click event
                    var mousePosition = this.diagram._mousePosition(evt.originalEvent);
                    this._raiseEvent("click", { element: this.diagram.getNode(clickedObject), actualObject: this.diagram.getNode(this.actualObject), count: this.diagram._getEventDetail(evt), offsetX: mousePosition.x, offsetY: mousePosition.y, event: evt });
                }
            }
            this._multipleUndo = false;
            delete this.diffx;
            delete this.diffy;
            delete this._isMouseDown;
            delete this.actualObject;
            delete this._swimlaneNodedragged;
            this.diagram._removeTooltip();
            if (!this.diagram._isEditing && !this.diagram._isDragg)
                this.diagram._endEdit();
            delete this.hoverNode;

            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            this.diagram._activeSwimLane = null;
            base.prototype.mouseup.call(this, evt);
        };
        MoveTool.prototype._updateObject = function () {
            if (this.selectedObject) {
                if (this.selectedObject.type == "pseudoGroup") {
                    var child;
                    var children = this.diagram._getChildren(this.selectedObject.children);
                    for (var i = 0, len = children.length; i < len; i++) {
                        child = this.diagram.nameTable[children[i]];
                        if (child) {
                            ej.datavisualization.Diagram.DiagramContext.update(child, this.diagram);
                        }
                    }
                }
                else {
                    if (this.selectedObject.parent) {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);
                        this.diagram._updateParentBounds(this.diagram.nameTable[this.selectedObject.parent]);
                    }
                    if (!this.selectedObject.isSwimlane)
                        ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                    else {
                        ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this.diagram);
                        ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                        ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this.diagram, this.selectedObject);
                    }
                }
            }
        };
        MoveTool.prototype._endAction = function () {
            base.prototype._endAction.apply(this);
            this._isMouseDown = false;
            this._mouseOffset = ej.datavisualization.Diagram.Size(0, 0);
        };
        MoveTool.prototype._updateHelperXY = function (shape, startPoint, endPoint) {
            var towardsLeft = endPoint.x < startPoint.x;
            var towardsTop = endPoint.y < startPoint.y;
            var difx = this.diffx + (endPoint.x - startPoint.x);
            var dify = this.diffy + (endPoint.y - startPoint.y);
            var offset;
            if (((this.diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines) ||
                (this.diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines)) &&
                this.diagram._enableSnapToObject())
                offset = ej.datavisualization.Diagram.SnapUtil._snapPoint(this.diagram, this.helper, towardsLeft, towardsTop, ej.datavisualization.Diagram.Point(difx, dify),
                    endPoint, startPoint);
            if (!offset)
                offset = ej.datavisualization.Diagram.Point(difx, dify);
            this.diffx = difx - offset.x;
            this.diffy = dify - offset.y;
            if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(offset)) {
                var oldbounds = ej.datavisualization.Diagram.Util.bounds(shape);
                oldbounds = ej.datavisualization.Diagram.Rectangle(oldbounds.left, oldbounds.top, oldbounds.right - oldbounds.left, oldbounds.bottom - oldbounds.top);
                var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
                if (this._outOfBoundsDrag(shape, offset.x, offset.y))
                    this.diagram._translate(shape, offset.x, offset.y, this.diagram.nameTable);
                var newbounds = ej.datavisualization.Diagram.Util.bounds(shape);
                newbounds = ej.datavisualization.Diagram.Rectangle(newbounds.left, newbounds.top, newbounds.right - newbounds.left, newbounds.bottom - newbounds.top);
                var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
                var args = this._raiseDragEvent({ element: this.diagram.getNode(this.helper), offset: offset, oldValue: oldValue, newValue: newValue, cancel: false });
                if (args && !args.cancel) {
                    if (!this.inAction)
                        if (shape._type === "group") {
                            ej.datavisualization.Diagram.Util._updateGroupBounds(shape, this.diagram);
                        }
                }
                else { this.diagram._translate(shape, -offset.x, -offset.y, this.diagram.nameTable); }
            }
        };


        MoveTool.prototype._outOfBoundsDrag = function (node, ptX, ptY, orientation) {
            ptX = ptX ? ptX : 0;
            ptY = ptY ? ptY : 0;
            if (node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                var size = this._getPageBounds();
                if (orientation) {
                    ptX = (orientation === "horizontal") ? 0 : ptX;
                    ptY = (orientation === "vertical") ? 0 : ptY;
                }
                if (bounds) {
                    var padding = this._getPadding(node);
                    if (node.isPhase)
                        return true;
                    if ((!this.diagram._selectedSymbol || this._skipSelectedSymbol) && (bounds.right + ptX + padding.x > size.width || bounds.left + ptX - padding.x < size.x)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                    if ((!this.diagram._selectedSymbol || this._skipSelectedSymbol) && (bounds.bottom + ptY + padding.y > size.height || bounds.top + ptY - padding.y < size.y)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                }
            }
            if (!this.diagram._notAllow)
                this.updateCursor("move");
            return true
        };

        MoveTool.prototype._updateXY = function (shape, startPoint, endPoint, preventSegmentAdjusting) {
            var towardsLeft = endPoint.x < startPoint.x;
            var towardsTop = endPoint.y < startPoint.y;
            var difx = this.diffx + (endPoint.x - startPoint.x);
            var dify = this.diffy + (endPoint.y - startPoint.y);
            var offset;
            if (((this.diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToHorizontalLines) ||
                (this.diagram._snapConstraints() & ej.datavisualization.Diagram.SnapConstraints.SnapToVerticalLines)) || this.diagram._enableSnapToObject())
                offset = ej.datavisualization.Diagram.SnapUtil._snapPoint(this.diagram, this.selectedObject, towardsLeft, towardsTop, ej.datavisualization.Diagram.Point(difx, dify),
                    endPoint, startPoint);

            if (!offset)
                offset = ej.datavisualization.Diagram.Point(difx, dify);

            this.diffx = difx - offset.x;
            this.diffy = dify - offset.y;
            if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(offset) || this.diagram._selectedSymbol && !this.inAction) {
                var args;
                var oldbounds = ej.datavisualization.Diagram.Util.bounds(shape);
                oldbounds = ej.datavisualization.Diagram.Rectangle(oldbounds.left, oldbounds.top, oldbounds.right - oldbounds.left, oldbounds.bottom - oldbounds.top);
                var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
                if (!shape.segments) {
                    if (ej.datavisualization.Diagram.Util.canAllowPan(shape)) {
                        if (this.diagram._hScrollOffset === 0) {
                            offset.x = 0;
                        }
                        if (this.diagram._vScrollOffset === 0) {
                            offset.y = 0;
                        }
                    }
                }
                if (preventSegmentAdjusting && !shape.isSwimlane && shape.type != "pseudoGroup")
                    this.diagram._preventDocking = true;
                if (this._outOfBoundsDrag(shape, offset.x, offset.y)) {
                    this.diagram._raiseOffsetPropertyChange(shape, offset.x, offset.y, true);
                    this.diagram._translate(shape, offset.x, offset.y, this.diagram.nameTable);
                    delete this.diagram._preventDocking;
                    var newbounds = ej.datavisualization.Diagram.Util.bounds(shape);
                    newbounds = ej.datavisualization.Diagram.Rectangle(newbounds.left, newbounds.top, newbounds.right - newbounds.left, newbounds.bottom - newbounds.top);
                    var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
                    if (!this.diagram._selectedSymbol) {
                        args = this._raiseDragEvent({ element: this.diagram.getNode(this.selectedObject), offset: offset, oldValue: oldValue, newValue: newValue, cancel: false });
                    }
                    else {
                        args = { element: this.diagram.getNode(this.selectedObject), allowDrop: true, target: this._getNodeUnderMouse(), oldValue: oldValue, newValue: newValue, cancel: false };
                        if (args.target && args.target.segments) {
                            ej.datavisualization.Diagram.SvgContext._drawConnectorHighlighter(args.target, this.diagram, this.diagram._currZoom);
                        }
                        this._raiseEvent("dragOver", args);
                        if (!args.allowDrop) {
                            this.updateCursor("not-allowed");
                            if (!this.inAction) { this.diagram._removeSymbolFromDiagram(); return true; }
                        }
                        else {
                            if (!this.diagram._notAllow)
                                this.updateCursor("move");
                        }
                    }
                    if ((args && !args.cancel) || this.diagram._selectedSymbol) {
                        if (shape._type === "group" && shape.type != "bpmn" || (shape.type === "pseudoGroup")) {
                            ej.datavisualization.Diagram.Util._updateGroupBounds(shape, this.diagram);
                            if ((this._fromSameContainer(this.diagram._getChildren(this.selectedObject.children)) && this.hasSameParent()) || this._anyFromContainer(this.diagram._getChildren(this.selectedObject.children)))
                                ej.datavisualization.Diagram.canvasHelper._removeFromParentContainer(this.diagram, this.selectedObject);
                        }
                    }
                    else if (args && args.cancel) {
                        this.diagram._translate(shape, -offset.x, -offset.y, this.diagram.nameTable);
                    }
                }
            }
        };

        MoveTool.prototype._boundsInterSects = function (polyLine, bounds, self) {
            var intersect = []
            if (bounds) {
                var polyLine2 = [
                    { x: bounds.x, y: bounds.y },
                    { x: bounds.x + bounds.width, y: bounds.y },
                    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
                    { x: bounds.x, y: bounds.y + bounds.height },
                    { x: bounds.x, y: bounds.y }
                ];
                intersect = this._intersect(polyLine, polyLine2, intersect);
            }
            return intersect;
        };
        MoveTool.prototype._intersect = function (polyLine1, polyLine2, self) {
            var intersect = [];
            for (var i = 0; i < polyLine1.length - 1; i++) {
                for (var j = 0; j < polyLine2.length - 1; j++) {
                    var p = ej.datavisualization.Diagram.Util.interSect2(polyLine1[i], polyLine1[i + 1], polyLine2[j], polyLine2[j + 1]);
                    if (!ej.datavisualization.Diagram.Geometry.isEqualPoint(ej.datavisualization.Diagram.Point(0, 0), p)) {
                        intersect.push(p);
                    }
                }

                if (self && polyLine2.length >= 1) { }
            }
            return intersect;
        };

        MoveTool.prototype._getInterceptWithSegment = function (currenPosition, conPoints) {
            var intercepts = [], tarAngle, srcAngle, imgLine, segemnt, i, maxLength;
            maxLength = ej.datavisualization.Diagram.Util.findLength(ej.datavisualization.Diagram.Point(0, 0), ej.datavisualization.Diagram.Point(this.diagram._viewPort.width, this.diagram._viewPort.height));
            for (i = 1; i < conPoints.length; i++) {
                segemnt = [conPoints[i - 1], conPoints[i]];
                imgLine = [];
                srcAngle = Math.round(ej.datavisualization.Diagram.Util.findAngle(segemnt[0], segemnt[1]) % 360, 2);
                tarAngle = Math.round(ej.datavisualization.Diagram.Util.findAngle(segemnt[1], segemnt[0]) % 360, 2);
                var angleAdd = (srcAngle > 0 && srcAngle <= 90) || (srcAngle > 180 && srcAngle <= 270) ? 90 : -90;

                imgLine.push(ej.datavisualization.Diagram.Geometry.transform(currenPosition, srcAngle + angleAdd, maxLength));
                imgLine.push(ej.datavisualization.Diagram.Geometry.transform(currenPosition, tarAngle + angleAdd, maxLength));

                var intercept = this._intersect(segemnt, imgLine, false);
                for (var m in intercept) {
                    intercepts.push(intercept[m]);
                }
            }
            return intercepts;
        };

        MoveTool.prototype._raiseDragEvent = function (args) {
            if (!this.diagram._selectedSymbol && !this.diagram._isDragg) {
                args.dragState = this.dragState;
                return this._raiseEvent("drag", args);
            }
        };

        MoveTool.prototype._updateSelection = function () {
            if (!this.diagram._selectionContains(this.selectedObject)) {
                this.diagram._clearSelection(true);
                this.diagram._addSelection(this.selectedObject);
            }
        };
        MoveTool.prototype._disableLabel = function (selectedObject, label) {
            if (selectedObject && label) {
                var htmlLayer = this.diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                var name = selectedObject._shape == "text" ? selectedObject.name : selectedObject.name + "_" + label.name;
                var text = $(htmlLayer).find("#" + name + ".ej-d-label")[0];
                if (text) text.style.pointerEvents = "none";
            }
        };
        MoveTool.prototype._enableLabel = function (selectedObject, label) {
            if (selectedObject && label) {
                var htmlLayer = this.diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                var name = selectedObject._shape == "text" ? selectedObject.name : selectedObject.name + "_" + label.name;
                var text = $(htmlLayer).find("#" + name + ".ej-d-label")[0];
                if (text) text.style.pointerEvents = "all";
            }
        };
        return MoveTool;
    })(ToolBase);

    ej.datavisualization.Diagram.MoveTool = MoveTool;
    //#endregion
    var PortTool = (function (base) {
        ej.datavisualization.Diagram.extend(PortTool, base);
        function PortTool(diagram) {
            base.call(this, "Port", diagram);
            this.cursor = "pointer";
            this._isMouseDown = false;
        }
        PortTool.prototype.mousedown = function (evt) {
            this._isMouseDown = true;
            base.prototype.mousedown.call(this, evt);
            this.activePort = this.diagram._getvalues(evt);
        };

        PortTool.prototype.mousemove = function (evt) {
            if (this.activePort) {
                base.prototype.mousemove.call(this, evt);
                if (!this.inAction) {
                    this.inAction = true;
                    this.selectedObject = this.diagram.nameTable[this.diagram._getChild(this.activePort.source.parent)];
                    this.undoObject = jQuery.extend(true, {}, { "node": this.selectedObject });
                }
                this._updatePortXY(this.activePort.source, this.previousPoint, this.currentPoint);
            }
            this.previousPoint = this.currentPoint;
        };

        PortTool.prototype.mouseup = function (evt) {
            this._isMouseDown = false;
            this.diagram.deactivateTool(evt);
            if (this.inAction) {
                this.inAction = false;
                var entry = { type: "portpositionchanged", undoObject: this.undoObject, redoObject: jQuery.extend(true, {}, { "node": this.selectedObject }), category: "internal", activePort: this.activePort.source };
                if (!this._multipleUndo)
                    this.diagram.addHistoryEntry(entry);
            }
        };

        PortTool.prototype._updatePortXY = function (port, startPoint, endPoint) {
            var difx = endPoint.x - startPoint.x;
            var dify = endPoint.y - startPoint.y;
            if (this.activePort) {
                if (!this.selectedObject)
                    this.selectedObject = this.diagram.nameTable[this.diagram._getChild(this.activePort.source.parent)]
                this.diagram._translatePort(this.selectedObject, port, difx, dify);
            }
        }
        return PortTool;
    })(ToolBase);
    ej.datavisualization.Diagram.PortTool = PortTool;

    //#region ResizeTool
    var ResizeTool = (function (base) {
        ej.datavisualization.Diagram.extend(ResizeTool, base);
        function ResizeTool(diagram) {
            base.call(this, "resize", diagram);
            this.cursor = "default";//update resize cursor during action i.e in action
            this._resizeDirection = null;
            this._mouseOffset = ej.datavisualization.Diagram.Size(0, 0);
            this.diffx = 0;
            this.diffy = 0;
            this._startPoint = ej.datavisualization.Diagram.Size(0, 0);
            this.undoObject = null;
            this.pseudoGroupConstraints = null;
            this._mouseDown = false;
            this.resizeState = "";
        }

        ResizeTool.prototype.mousedown = function (evt) {
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            base.prototype.mousedown.call(this, evt);
            this._mouseDown = true;
            this.resizeState = ej.datavisualization.Diagram.ResizeState.Starting;
        };
        ResizeTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            var start = !this.inAction;
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);

            if (!this.inAction && this.diagram.selectionList[0] && this._mouseDown) {
                this.selectedObject = this.diagram.nameTable[this.diagram.selectionList[0].name];
                var data;
                var childTable = {};
                var newbounds, oldbounds;
                newbounds = oldbounds = ej.datavisualization.Diagram.Util.bounds(this.selectedObject);
                var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: this.selectedObject.offsetX, offsetY: this.selectedObject.offsetY, width: this.selectedObject.width, height: this.selectedObject.height };
                this._raiseEvent("sizeChange", { element: this.diagram.getNode(this.selectedObject), resizeState: this.resizeState, offset: { x: 0, y: 0 }, oldValue: oldValue, newValue: newValue, cancel: false, direction: this._resizeDirection });
                if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup")
                    childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                var temp = { "childTable": childTable, "node": this.selectedObject };
                if (this.selectedObject && this.selectedObject.type === "pseudoGroup") {
                    if (this.diagram.model.selectedItems.getConstraints && $.isFunction(this.diagram.model.selectedItems.getConstraints)) {
                        this.pseudoGroupConstraints = this.diagram.model.selectedItems.getConstraints();
                    }
                    else this.pseudoGroupConstraints = ej.datavisualization.Diagram.Util._getPseudoGroupConstraints(this.diagram, this.selectedObject, this.selectedObject);
                }
                data = $.extend(true, {}, temp);
                this.undoObject = jQuery.extend(true, {}, data);
                //this.undoObject = ej.datavisualization.Diagram.Util.clone(this.selectedObject);
                this._resizeDirection = evt.target.getAttribute("class");
                if (!this.selectedObject.width) this.selectedObject.width = this.selectedObject._width;
                if (!this.selectedObject.height) this.selectedObject.height = this.selectedObject._height;
                this.initialBounds = { width: this.selectedObject.width, height: this.selectedObject.height, y: this.selectedObject.offsetY, x: this.selectedObject.offsetX };
                ej.datavisualization.Diagram.SvgContext._removePivotPoint(this.selectedObject, this.diagram._svg, this.diagram._currZoom);
                this.inAction = true;
            }
            if (this.selectedObject) {
                this.resizeState = ej.datavisualization.Diagram.DragState.Resizing;
                var canvasChild = false;
                if (this.selectedObject && this.selectedObject.parent) {
                    var parNode = this.diagram.nameTable[this.selectedObject.parent];
                    if (parNode.container && (parNode.container.type == "canvas" || parNode.container.type == "stack"))
                        canvasChild = true;
                }
                else if (this.selectedObject.type == "pseudoGroup" && this.hasSameParent() && this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {
                    canvasChild = true;
                }
                if ((this.selectedObject && canvasChild) || (this.selectedObject.type === "pseudoGroup" && this._anyFromContainer(this.diagram._getChildren(this.selectedObject.children)))) {
                    if (this.selectedObject.type === "pseudoGroup" && this._isParentAsLane(this.selectedObject)) {
                        ej.datavisualization.Diagram.canvasHelper._removeFromParentContainer(this.diagram, this.selectedObject);
                    }
                    else ej.datavisualization.Diagram.canvasHelper._updateResizeHelper(this.diagram);
                }
                else if (this.selectedObject && this.diagram.nameTable[this.selectedObject.name].container) {
                    ej.datavisualization.Diagram.canvasHelper._updateResizeHelper(this.diagram);
                }
                else if (this.selectedObject.parent && this.diagram.nameTable[this.selectedObject.parent] &&
                    this.diagram.nameTable[this.selectedObject.parent].container && this.diagram.nameTable[this.selectedObject.parent].container.type == "stack") {
                    if (!this.helper) {
                        this.helper = this._getCloneNode(this.selectedObject);
                    }
                    ej.datavisualization.Diagram.SvgContext._drawContainerHelper(this.diagram);
                    this._startPoint = this.currentPoint;
                    this._updateSize(this.helper, this.previousPoint, this.currentPoint);
                    ej.datavisualization.Diagram.DiagramContext.update(this.helper, this.diagram);
                }
                else {
                    if (this.selectedObject.type != "pseudoGroup")
                        this._updateSize(this.selectedObject, this.previousPoint, this.currentPoint);
                    else if (this.selectedObject.type == "pseudoGroup" && !this._fromContainer(this.diagram._getChildren(this.selectedObject.children)) && this._fromSameContainer(this.diagram._getChildren(this.selectedObject.children))) {
                        if (!this._undoObject)
                            ej.datavisualization.Diagram.Util._getUndoObject(this.diagram, this.selectedObject);
                        this._updateSize(this.selectedObject, this.previousPoint, this.currentPoint);
                    }
                }
                if (!this.helper) {
                    if (!this.selectedObject.isSwimlane)
                        ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                    else {
                        if (!this._isMouseDown) {
                            ej.datavisualization.Diagram.canvasHelper._disableConnectorUpdate(this.diagram);
                            ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                            ej.datavisualization.Diagram.canvasHelper._enableConnectorUpdate(this.diagram, this.selectedObject);
                        }
                    }
                }
                this.diagram._renderTooltip(this.selectedObject, start);
                this.diagram._updateSelectionHandle(true);
            }

            this.previousPoint = this.currentPoint;
        };
        ResizeTool.prototype.mouseup = function (evt) {
            var undoObj = null;
            this._mouseDown = false;
            if (this.inAction) {
                this.resizeState = ej.datavisualization.Diagram.ResizeState.Completed;
                ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
                this.inAction = false;
                var canvasChild = false;
                var newbounds, oldbounds;
                oldbounds = ej.datavisualization.Diagram.Util.bounds(this.undoObject.node);
                var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: this.undoObject.node.offsetX, offsetY: this.undoObject.node.offsetY, width: this.undoObject.node.width, height: this.undoObject.node.height };
                newbounds = ej.datavisualization.Diagram.Util.bounds(this.selectedObject);
                if (this.selectedObject.parent) {
                    var parent = this.diagram.nameTable[this.selectedObject.parent];
                    if (parent && parent.container)
                        newbounds = ej.datavisualization.Diagram.Util.bounds(this.helper);
                }
                var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: newbounds.x + (newbounds.width) / 2, offsetY: newbounds.y + (newbounds.height) / 2, width: newbounds.width, height: newbounds.height };
                this._raiseEvent("sizeChange", { element: this.diagram.getNode(this.selectedObject), resizeState: this.resizeState, offset: { x: 0, y: 0 }, oldValue: oldValue, newValue: newValue, cancel: false, direction: this._resizeDirection });
                this.resizeState = "";
                var needDOMupdate = true;
                if (this.selectedObject.isLane || this.selectedObject.isSwimlane) {
                    var childTable = {};
                    childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                    undoObj = $.extend(true, {}, { "childTable": childTable, "node": this.selectedObject });
                }
                if (this.selectedObject && this.selectedObject.parent) {
                    var parNode = this.diagram.nameTable[this.selectedObject.parent];
                    if (parNode.container && (parNode.container.type == "canvas" || parNode.container.type == "stack"))
                        canvasChild = true;
                }
                else if (this.selectedObject.type == "pseudoGroup" && this.hasSameParent() && this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {
                    canvasChild = true;
                }
                if (this.selectedObject && canvasChild && !parNode.isLaneStack) {
                    ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                    if (ej.datavisualization.Diagram.canvasHelper._outOfBoundaryNodeDrop(this.diagram, this.diagram.activeTool.helper, parNode)) {
                        if (!this.selectedObject.isLane)
                            ej.datavisualization.Diagram.canvasHelper._singleNodeResize(this.diagram, evt, this.selectedObject);
                        else
                            ej.datavisualization.Diagram.canvasHelper._resizeLane(this.diagram, this.selectedObject);
                        ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
                    }
                }
                else if (this.selectedObject && this.diagram.nameTable[this.selectedObject.name].container) {
                    ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                    ej.datavisualization.Diagram.canvasHelper._resizeLane(this.diagram, this.selectedObject);
                    needDOMupdate = false;
                }
                else if ((this.selectedObject.type == "pseudoGroup" || this.selectedObject.name == "multipleSelection") && this.diagram._activeSwimLane) {
                    ej.datavisualization.Diagram.canvasHelper._multiNodeResize(this.diagram, evt, this.selectedObject);
                }
                if (this.selectedObject.parent) {
                    ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);
                }
                if (needDOMupdate)
                    ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                this.diagram._updateSelectionHandle();

                var data;
                var childTable = {};
                if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup")
                    childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                var temp = { "childTable": childTable, "node": this.selectedObject };
                data = $.extend(true, {}, temp);

                var entry = { type: "sizechanged", undoObject: undoObj ? undoObj : this.undoObject, redoObject: jQuery.extend(true, {}, data), isMultipleNode: (this.selectedObject._type === "group") ? true : false, category: "internal" };
                if (!this._multipleUndo)
                    this.diagram.addHistoryEntry(entry);
                this.diagram._removeTooltip();
                this._multipleUndo = false;
            }
            base.prototype.mouseup.call(this, evt);
        };
        ResizeTool.prototype._updateSize = function (shape, startPoint, endPoint, x1, y1, updateMinMax, isHelper, phase, disableSnap) {
            var difx = x1 ? x1 : (this.currentPoint.x - this.startPoint.x);
            var dify = y1 ? y1 : (this.currentPoint.y - this.startPoint.y);
            var point = this._resizeObject(shape, difx, dify, phase, disableSnap);
            var pivot = ej.datavisualization.Diagram.Point(point.x, point.y);
            var deltaWidth = point.width;
            var deltaHeight = point.height;
            if (shape)
                if (!this.pseudoGroupConstraints) {
                    this.pseudoGroupConstraints = shape.constraints;
                }
            if (this.pseudoGroupConstraints & ej.datavisualization.Diagram.NodeConstraints.AspectRatio) {
                if (this._resizeDirection == "n-resize" || this._resizeDirection == "s-resize" || this._resizeDirection == "w-resize" || this._resizeDirection == "e-resize") {
                    var matrix = ej.Matrix.identity();
                    var rotatedDif = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(startPoint.x - endPoint.x, startPoint.y - endPoint.y));
                    if (Math.abs(rotatedDif.x) > Math.abs(rotatedDif.y))
                        deltaHeight = deltaWidth;
                    else
                        deltaWidth = deltaHeight;
                }
                else if (startPoint != endPoint)
                    deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
                else
                    deltaHeight = deltaWidth = 0;
            }
            var size = ej.datavisualization.Diagram.Size();
            if (deltaWidth < 0) deltaWidth = 1;
            if (deltaHeight < 0) deltaHeight = 1;
            size.width = deltaWidth;
            size.height = deltaHeight;
            var oldbounds = ej.datavisualization.Diagram.Util.bounds(shape);
            oldbounds = ej.datavisualization.Diagram.Rectangle(oldbounds.left, oldbounds.top, oldbounds.right - oldbounds.left, oldbounds.bottom - oldbounds.top);
            var oldValue = { bounds: { x: oldbounds.x, y: oldbounds.y, width: oldbounds.width, height: oldbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
            if (!ej.datavisualization.Diagram.Geometry.isEmptySize(size)) {
                this.resizeState = ej.datavisualization.Diagram.ResizeState.Resizing;
                if (this._outOfBoundsDrag(shape, deltaWidth, deltaHeight, pivot)) {
                    this.diagram._raiseSizePropertyChange(shape, deltaWidth, deltaHeight, true);
                    this.diagram.scale(shape, deltaWidth, deltaHeight, pivot, this.diagram.nameTable, null, updateMinMax, isHelper);
                    var newbounds = ej.datavisualization.Diagram.Util.bounds(shape);
                    newbounds = ej.datavisualization.Diagram.Rectangle(newbounds.left, newbounds.top, newbounds.right - newbounds.left, newbounds.bottom - newbounds.top);
                    var newValue = { bounds: { x: newbounds.x, y: newbounds.y, width: newbounds.width, height: newbounds.height }, offsetX: shape.offsetX, offsetY: shape.offsetY, width: shape.width, height: shape.height };
                    var pathData = shape.pathData;
                    if (oldbounds.width != newbounds.width || oldbounds.height != newbounds.height) {
                        var args = this._raiseEvent("sizeChange", { element: this.diagram.getNode(this.selectedObject), resizeState: this.resizeState, offset: size, oldValue: oldValue, newValue: newValue, direction: this._resizeDirection });
                    }
                    if (pathData && shape.pathData != pathData) {
                        shape._absoluteBounds = null;
                        shape._scaled = true;
                    }
                    if (args && args.cancel && !isHelper) {
                        this.diagram.scale(shape, 1 / deltaWidth, 1 / deltaHeight, pivot, this.diagram.nameTable);
                    }
                    if (shape._type === "group") {
                        ej.datavisualization.Diagram.Util._updateGroupBounds(shape, this.diagram);
                    }
                    this.diagram._updateAssociatedConnectorEnds(shape, this.diagram.nameTable);
                }
                else return true;
            }
            this.pseudoGroupConstraints = null;
        };
        ResizeTool.prototype._getSwimLaneNode = function (node) {
            if (node) {
                var laneStackName = node.parent;
                var laneStack = this.diagram.nameTable[laneStackName];
                if (laneStack) {
                    var swimlaneName = laneStack.parent;
                    if (swimlaneName) {
                        var swimlane = this.diagram.nameTable[swimlaneName];
                        if (swimlane)
                            return swimlane;
                    }
                }
            }
        };
        ResizeTool.prototype._outOfBoundsDrag = function (node, delWidth, delHeight, pivot) {
            if (!this.diagram._skipoutOfBounds && node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var size = this._getPageBounds();
                var incY = (node.height * delHeight) - node.height;
                var incX = (node.width * delWidth) - node.width;
                if (!this.inAction && node.isLane) {
                    var getSwimlane = this._getSwimLaneNode(node);
                    var bounds = ej.datavisualization.Diagram.Util.bounds(getSwimlane);
                    var padding = this._getPadding(node);

                    if (!this.diagram._selectedSymbol && (bounds.right + incX + padding.x > size.width)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                    if (!this.diagram._selectedSymbol && (bounds.bottom + incY + padding.y > size.height)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                }
                else {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node);
                    var padding = this._getPadding(node);
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                    ej.Matrix.scale(matrix, delWidth, delHeight, pivot.x, pivot.y);
                    ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                    var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                    if (!this.diagram._selectedSymbol && (newPosition.x + (bounds.width + incX) / 2 + padding.x > size.width || newPosition.x - (bounds.width + incX) / 2 < size.x)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                    if (!this.diagram._selectedSymbol && (newPosition.y + (bounds.height + incY) / 2 + padding.y > size.height || newPosition.y - (bounds.height + incY) / 2 < size.y)) {
                        this.updateCursor("not-allowed");
                        return false
                    }
                }
                this.updateCursor(this._resizeDirection)
            }
            return true
        };
        return ResizeTool;
    })(ToolBase);

    ej.datavisualization.Diagram.ResizeTool = ResizeTool;
    //#endregion

    //#region EndPointTool
    var ConnectionEditTool = (function (base) {
        ej.datavisualization.Diagram.extend(ConnectionEditTool, base);
        function ConnectionEditTool(diagram) {
            base.call(this, "endPoint", diagram);
            this.cursor = "move";
            this._endPoint = null;
            this._undoObject = null;
        }
        ConnectionEditTool.prototype.mousedown = function (evt) {
            if (!this.inAction) {
                base.prototype.mousedown.call(this, evt);
                if (evt.ctrlKey && evt.shiftKey) {
                    var parent = $(evt.target).parents(".ej-d-connector");
                    if (parent.length > 0) {
                        this.selectedObject = this.diagram.nameTable[parent[0].id];
                        if (this.diagram._hasSelection())
                            this.diagram._clearSelection(true);
                        this.diagram._addSelection(this.selectedObject);
                    }
                }
                this._initialValue = null;
                if (this.diagram.selectionList[0] && !this.selectedObject) this.selectedObject = this.diagram.nameTable[this.diagram.selectionList[0].name];
                this.undoObject = this._getClonedObject(this.selectedObject);
                this._endPoint = evt.target.getAttribute("class");
                this.targetid = evt.target.id;
                this._selectedSegment = "";
                this._nearestNodes = [];
                var isTarget = (this._endPoint == "targetEndPoint") ? true : false;
                var isSource = (this._endPoint == "sourceEndPoint") ? true : false;
                var dragargs = this._raiseEndPointDrag(this.selectedObject, isTarget, isSource, ej.datavisualization.Diagram.DragState.Starting);
            }
        };
        ConnectionEditTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            var start = !this.inAction;
            if (this.selectedObject && !(evt.ctrlKey && evt.shiftKey)) {
                //  if (ej.datavisualization.Diagram.Util.canMove(this.selectedObject)) {
                var isTwo = false;
                if (this.selectedObject.segments.length == 2) isTwo = true;
                var difx = this.currentPoint.x - this.previousPoint.x;
                var dify = this.currentPoint.y - this.previousPoint.y;
                var _srcPoint = $.extend(true, {}, this.selectedObject.sourcePoint);
                var _trgPoint = $.extend(true, {}, this.selectedObject.targetPoint);
                var _segments = $.extend(true, {}, this.selectedObject.segments);
                if (this._outOfBoundsDrag(this.selectedObject, this.currentPoint.x, this.currentPoint.y)) {
                    if (!this.inAction && (this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y)) {
                        this.inAction = true;
                        if (this.selectedObject.segments.length > 0) {
                            for (var m = 0; m < this.selectedObject.segments.length; m++) {
                                this.selectedObject.segments[m]._bridges = [];
                            }
                        }
                        var hitTest = (this.diagram._svg.getElementById(this.selectedObject.name + "_hitTest"));
                        if (hitTest) hitTest.setAttribute("pointer-events", "none");
                        var sNode = this.diagram._svg.getElementById(this.selectedObject.name);
                        if (sNode) sNode.setAttribute("pointer-events", "none");
                        var handle = this.diagram._adornerSvg.getElementById(this.diagram._adornerSvg.document.id + "handle_g");
                        if (handle) handle.setAttribute("pointer-events", "none");
                        var coll = this.targetid.split("_");
                        coll.reverse();
                        var index = Number(coll[0]);
                        this.selectedSegment = this.selectedObject.segments[index];
                        var segment = this.selectedSegment;
                        if (this.selectedSegment && this.selectedSegment.type == "orthogonal") {
                            var refresh = false;
                            if (index === 0) {
                                var editfirstsegment = true;
                            }
                            if (!this.selectedSegment.length || !this.selectedSegment.direction) {
                                this._addTerminalSegment(difx, dify, coll);
                                refresh = true;
                            }
                            else if (index == 0) {
                                this.insertFirstSegment(difx, dify, coll);
                                refresh = true;
                            }
                            else {
                                this.nextSegment = this.selectedObject.segments[index + 1];
                            }
                        }
                        else
                            this.nextSegment = this.selectedObject.segments[index + 1];
                        if (refresh) {
                            ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, !(isTwo || editfirstsegment || !this.selectedObject.sourcePort), !(isTwo || !(segment.length || segment.length === 0) || !this.selectedObject.targetPort), this.diagram);
                            ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                            ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                        }
                        if (!this.selectedSegment && this._endPoint == "targetEndPoint") this.selectedSegment = this.selectedObject.segments[this.selectedObject.segments.length - 1];
                        if (!this.selectedSegment && this._endPoint == "sourceEndPoint") {
                            this.selectedSegment = this.selectedObject.segments[0];
                            this.nextSegment = this.selectedObject.segments[1];
                        }
                        if (this.selectedSegment)
                            this._initialValue = { x: this.selectedSegment._endPoint.x, y: this.selectedSegment._endPoint.y };
                        this.diagram._updateSelectionHandle(true);
                        this._raiseSegmentEditEvent(ej.datavisualization.Diagram.DragState.Starting);
                    }
                    else if (this.inAction) {
                        if (this.selectedSegment && this._endPoint == "segmentEnd") {
                            var args = this._raiseSegmentEditEvent(ej.datavisualization.Diagram.DragState.Dragging);
                            if (!args.cancel && (difx != 0 || dify != 0)) {
                                var actualdifX = this.currentPoint.x - this.startPoint.x;
                                var actualdifY = this.currentPoint.y - this.startPoint.y;
                                if (this._initialValue) {
                                    actualdifX = this._initialValue.x + actualdifX - this.selectedSegment._endPoint.x;
                                    actualdifY = this._initialValue.y + actualdifY - this.selectedSegment._endPoint.y;
                                }
                                if (difx * actualdifX < 0) difx = 0; else difx = actualdifX;
                                if (dify * actualdifY < 0) dify = 0; else dify = actualdifY;
                                this._updateAdjacentSegments(difx, dify);
                            }
                        }
                        else if (this._endPoint != "segmentEnd") {
                            if (this._endPoint == "targetEndPoint" || this._endPoint == "sourceEndPoint")
                                this._checkConnectionPossible(evt);
                            var cancelEvent = this._updatePoints(this.selectedObject, ej.datavisualization.Diagram.DragState.Dragging);
                            if (!cancelEvent.cancel) {
                                this._disconnect(this.selectedObject);
                                this._updateConnection(this.selectedObject, cancelEvent.updateSelection);
                            }
                        }
                        this.diagram._updateSelectionHandle(true);
                        this.diagram._updateQuad(this.selectedObject);
                        ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                        //}
                    }
                }
                this.diagram._comparePropertyValues(this.selectedObject, "sourcePoint", { sourcePoint: _srcPoint }, true);
                this.diagram._comparePropertyValues(this.selectedObject, "targetPoint", { targetPoint: _trgPoint }, true);
                this.diagram._comparePropertyValues(this.selectedObject, "segments", { segments: _segments }, true);
            }
            this.previousPoint = this.currentPoint;
        };
        ConnectionEditTool.prototype._raiseSegmentEditEvent = function (state) {
            return this._raiseEvent("segmentChange", { element: this.selectedObject, dragState: state, point: this.currentPoint, cancel: false });
        };
        ConnectionEditTool.prototype._updateAdjacentSegments = function (difx, dify) {
            var current = this.selectedSegment;
            var pt = { x: difx + current._endPoint.x, y: dify + current._endPoint.y };
            pt = this.snap(pt);
            if (current.type == "orthogonal") {
                if (current._direction == "left" || current._direction == "right") {
                    dify = pt.y - current._endPoint.y;
                    current._startPoint.y += dify;
                    current._endPoint.y = current._startPoint.y;
                }
                else {
                    difx = pt.x - current._endPoint.x;
                    current._startPoint.x += difx;
                    current._endPoint.x = current._startPoint.x;
                }
                current.points[0] = current._startPoint;
                current.points[current.points.length - 1] = current._endPoint;
                var index = this.selectedObject.segments.indexOf(this.selectedSegment);
                var prev = this.selectedObject.segments[index - 1];
                if (prev) this.updatePreviousSegment(current, prev, difx, dify);
            }
            else if (current.type == "straight") {
                current.points[current.points.length - 1] = current._endPoint = pt;
                current._point = current.point = pt;
            }
            else {
                current.points[current.points.length - 1] = current._endPoint = pt;
                current._point = current.point = pt;
                ej.datavisualization.Diagram.Util._updateBezierPoints(current);
            }
            if (this.nextSegment)
                this.updateNextSegment(current, this.nextSegment, difx, dify);
        }
        ConnectionEditTool.prototype._addTerminalSegment = function (difx, dify, coll) {
            var segment = this.selectedSegment;
            this.selectedObject.segments.pop();
            var first = this.selectedObject.segments[this.selectedObject.segments.length - 1] && this.selectedObject.segments[this.selectedObject.segments.length - 1].type == "orthogonal" ? this.selectedObject.segments[this.selectedObject.segments.length - 1] : null;
            for (var i = 0; i < segment.points.length - 2; i++) {
                var seg = ej.datavisualization.Diagram.Segment({
                    type: "orthogonal",
                    length: ej.datavisualization.Diagram.Geometry.distance(segment.points[i], segment.points[i + 1]),
                    direction: ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[i], segment.points[i + 1])
                });
                if (seg.length == 0) {
                    if (first.direction == "top" || first.direction == "bottom") {
                        seg._direction = seg.direction = difx > 0 ? "right" : "left";
                    }
                    else {
                        seg._direction = seg.direction = dify > 0 ? "bottom" : "top";
                    }
                }
                first = seg;
                this.selectedObject.segments.push(seg);
            }
            var sec = Number(coll[1]);
            if (segment.points.length == 2 || sec == segment.points.length - 2) {
                if (first) {
                    first.length += 5;
                    first._length = first.length;
                }
                if (sec != 0) {
                    var length = ej.datavisualization.Diagram.Geometry.distance(segment.points[segment.points.length - 2], segment._endPoint);
                    var direction = ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[segment.points.length - 2], segment._endPoint);
                    var newsegment = ej.datavisualization.Diagram.Segment({ type: "orthogonal", length: 2 * length / 3, direction: direction });
                    this.selectedObject.segments.push(newsegment);

                }
            }
            var lastseg = ej.datavisualization.Diagram.Segment({ type: "orthogonal" });
            this.selectedObject.segments.push(lastseg);
            var index = Number(coll[0]) + (Number(coll[1]) || 0);
            this.selectedSegment = this.selectedObject.segments[index];
            this.nextSegment = this.selectedObject.segments[index + 1];
            if (index == this.selectedObject.segments.length - 2) {
                if (Number(coll[0]) == 0) {
                    this.nextSegment._direction = ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[segment.points.length - 2], segment._endPoint);;
                }
                else
                    this.nextSegment._direction = segment._direction;
            }
            else {
                lastseg._direction = ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[segment.points.length - 2], segment._endPoint);;
            }
            if (index == 0) this.insertFirstSegment(difx, dify, coll);

        },
        ConnectionEditTool.prototype.insertFirstSegment = function (difx, dify, coll) {
            var segment = this.selectedSegment;
            if (this.selectedObject.sourcePort && segment.length && this.selectedObject.segments[0].points.length > 2) {
                this.selectedObject.segments.splice(0, 1);
                var segments = [];
                var prev;
                for (var i = 0; i < segment.points.length - 1; i++) {
                    var first = ej.datavisualization.Diagram.Segment({
                        type: "orthogonal",
                        length: ej.datavisualization.Diagram.Geometry.distance(segment.points[i], segment.points[i + 1]),
                        direction: ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[i], segment.points[i + 1])
                    });
                    if (first.length == 0) {
                        if (prev && (prev.direction == "top" || prev.direction == "bottom")) {
                            first._direction = first.direction = difx > 0 ? "right" : "left";
                        }
                        else {
                            first._direction = first.direction = dify > 0 ? "bottom" : "top";
                        }
                    }
                    prev = first;
                    segments.push(first);
                }
                this.selectedObject.segments = segments.concat(this.selectedObject.segments);
                this.selectedSegment = this.selectedObject.segments[Number(coll[1])];
                this.nextSegment = this.selectedObject.segments[Number(coll[1]) + 1];
            }
            else {
                var segment = this.selectedObject.segments[0];
                var segments = [];
                segments.push(ej.datavisualization.Diagram.Segment({ type: "orthogonal", "direction": segment.direction, length: segment.length / 3 }));
                if (segment.direction == "bottom" || segment.direction == "top") {
                    var length = Math.max(5, Math.abs(difx));
                    var direction = difx > 0 ? "right" : "left";
                }
                else {
                    var length = Math.max(5, Math.abs(dify));
                    var direction = dify > 0 ? "bottom" : "top";
                }
                segments.push(ej.datavisualization.Diagram.Segment({ type: "orthogonal", "direction": direction, length: length }));
                var nextseg = this.selectedObject.segments[1];
                if (nextseg && nextseg.length) {
                    if (direction != nextseg.direction) {
                        length *= -1;
                    }
                    nextseg.length -= length;
                    nextseg._length = nextseg.length;
                }
                segment.length = segment._length = 2 * segment._length / 3;
                this.selectedObject.segments = segments.concat(this.selectedObject.segments);
                var index = Number(coll[0]) + Number(coll[1]);
                this.selectedSegment = this.selectedObject.segments[2];
                this.nextSegment = this.selectedObject.segments[3];
            }
        },
        ConnectionEditTool.prototype.updatePreviousSegment = function (current, prev, difx, dify) {
            prev._endPoint = prev.points[prev.points.length - 1] = current._startPoint;
            if (prev.type == "orthogonal") {
                if (prev.direction == "bottom") {
                    prev.length += dify;
                    if (prev.length < 0) {
                        prev._direction = prev.direction = "top";
                        prev.length *= -1;
                    }
                }
                else if (prev.direction == "top") {
                    prev.length -= dify;
                    if (prev.length < 0) {
                        prev._direction = prev.direction = "bottom";
                        prev.length *= -1;
                    }
                }
                else if (prev.direction == "right") {
                    prev.length += difx
                    if (prev.length < 0) {
                        prev._direction = prev.direction = "left";
                        prev.length *= -1;
                    }
                }
                else if (prev.direction == "left") {
                    prev.length -= difx;
                    if (prev.length < 0) {
                        prev._direction = prev.direction = "right";
                        prev.length *= -1;
                    }
                }
                prev._length = prev.length;
            }
            else {
                if (prev.type == "bezier") {
                    ej.datavisualization.Diagram.Util._updateBezierPoints(prev);
                }
            }
        };
        ConnectionEditTool.prototype.updateNextSegment = function (current, next, difx, dify) {
            var pt = current._endPoint;
            next._startPoint = next.points[0] = this.selectedSegment._endPoint;
            if (next) {
                if (next.type == "orthogonal") {
                    if (next.length || next.length === 0) {
                        if (next._direction == "left" || next._direction == "right") {
                            if (difx != 0) {
                                if (next._direction == "right") {
                                    next._length -= difx;
                                }
                                else {
                                    next._length += difx;
                                }

                                if (next.length || next.length === 0) {
                                    next.length = next._length;
                                    if (next.length < 0) {
                                        if (next.direction == "left") next.direction = "right";
                                        else if (next.direction == "right") next.direction = "left";
                                        next.length *= -1;
                                        next._direction = next.direction;
                                        next._length = next.length;
                                    }
                                }

                            }
                            if (dify != 0) {
                                if (current.type != "orthogonal") {
                                    next._startPoint.y = next.points[0].y = next._endPoint.y = next.points[next.points.length - 1].y = pt.y;
                                    var index = this.selectedObject.segments.indexOf(next);
                                    var segment = this.selectedObject.segments[index + 1];
                                    segment._startPoint.y = segment.points[0].y = next._endPoint.y;
                                    if (segment.length) {
                                        if (segment.direction == "bottom") {
                                            segment.length -= dify;
                                            if (segment.length < 0) {
                                                segment.direction = "top";
                                                segment.length *= -1;
                                            }
                                        }
                                        else {
                                            segment.length += dify;
                                            if (segment.length < 0) {
                                                segment.direction = "bottom";
                                                segment.length *= -1;
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        else {
                            if (dify != 0) {
                                if (next._direction == "bottom") {
                                    next._length -= dify;
                                }
                                else {
                                    next._length += dify;
                                }

                                if (next.length || next.length === 0) {
                                    next.length = next._length;
                                    if (next.length < 0) {
                                        if (next.direction == "top") next.direction = "bottom";
                                        else if (next.direction == "bottom") next.direction = "top";
                                        next.length *= -1;
                                        next._length = next.length;
                                        next._direction = next.direction;
                                    }
                                }

                            }
                            if (difx != 0) {
                                if (current.type != "orthogonal") {
                                    next._startPoint.x = next.points[0].x = next._endPoint.x = next.points[next.points.length - 1].x = pt.x;
                                    var index = this.selectedObject.segments.indexOf(next);
                                    var segment = this.selectedObject.segments[index + 1];
                                    if (segment.length) {
                                        if (segment.direction == "right") {
                                            segment.length += difx;
                                            if (segment.length < 0) {
                                                segment.direction = "left";
                                                segment.length *= -1;
                                            }
                                        }
                                        else {
                                            segment.length -= difx;
                                            if (segment.length < 0) {
                                                segment.direction = "right";
                                                segment.length *= -1;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
                else {

                    if (next.type == "bezier")
                        ej.datavisualization.Diagram.Util._updateBezierPoints(next);
                }
            }
        };
        ConnectionEditTool.prototype.mouseup = function (evt) {
            if (evt.shiftKey && evt.ctrlKey) {
                this._addOrRemoveStraightSegments(evt);
            }
            else
                if (this.inAction) {
                    this.inAction = false;
                    if (this._endPoint == "segmentEnd" && this.selectedSegment.type == "orthogonal") {
                        var args = this._raiseSegmentEditEvent(ej.datavisualization.Diagram.DragState.Completed);
                        if (!args.cancel) {
                            var index = this.selectedObject.segments.indexOf(this.selectedSegment);
                            var prev = this.selectedObject.segments[index - 1];
                            var next = this.selectedObject.segments[index + 1];
                            var refresh = false;
                            if (prev && prev.type == "orthogonal" && Math.abs(prev.length) < 5) {
                                if (index != 1) {
                                    refresh = this._removePrevSegment(index);
                                }
                            }
                            else if (next && next.type == "orthogonal") {
                                var length = (next.length || next.length === 0) ? next.length : ej.datavisualization.Diagram.Geometry.distance(next.points[0], next.points[1]);
                                if (Math.abs(length <= 5)) {
                                    refresh = this._removeNextSegment(index);
                                }
                            }
                            if (refresh) {
                                ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                                ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                                ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                            }
                        }
                    }
                    else if (this._endPoint != "segmentEnd") {
                        var cancelEvent = this._updatePoints(this.selectedObject, ej.datavisualization.Diagram.DragState.Completed);
                        if (!this.diagram.nameTable[this.selectedObject.name]) this.selectedObject = null;
                        if (this.selectedObject) {
                            if (!cancelEvent.cancel) {
                                this._disconnect(this.selectedObject);
                                var args;
                                if (this._currentPossibleConnection && !this.inAction) {
                                    this._updateConnection(this.selectedObject);
                                }
                                else {
                                    if (this.selectedObject.sourceNode || this.selectedObject.targetNode) {
                                        this._updateConnection(this.selectedObject);
                                    }
                                }
                                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                                if (this.selectedObject.parent)
                                    ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);

                                this._removeHighLighter();
                                ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);
                            }
                            else {
                                if (cancelEvent && cancelEvent.cancel && cancelEvent.eventType) {
                                    if (cancelEvent.eventType === "connectorSourceChange") {
                                        if (this.undoObject.sourceNode) {
                                            this.selectedObject.sourceNode = this.undoObject.sourceNode;
                                            this.diagram.nameTable[this.undoObject.sourceNode].outEdges.push(this.selectedObject.name);
                                            this.selectedObject.sourcePort = this.undoObject.sourcePort;
                                        }
                                        else if (this.undoObject.sourceNode == null && this.selectedObject.sourceNode) {
                                            this.selectedObject.sourceNode = this.undoObject.sourceNode;
                                            this.selectedObject.sourcePort = this.undoObject.sourcePort;
                                            this.selectedObject.sourcePoint = this.undoObject.sourcePoint;
                                            this.selectedObject.segments = this.undoObject.segments;
                                        }
                                        else {
                                            this.selectedObject.sourcePoint = this.undoObject.sourcePoint;
                                            this.selectedObject.segments = this.undoObject.segments;
                                        }
                                    }
                                    if (cancelEvent.eventType === "connectorTargetChange") {
                                        if (this.undoObject.targetNode) {
                                            this.selectedObject.targetNode = this.undoObject.targetNode;
                                            this.diagram.nameTable[this.undoObject.targetNode].inEdges.push(this.selectedObject.name);
                                            this.selectedObject.targetPort = this.undoObject.targetPort;
                                        }
                                        else if (this.undoObject.targetNode == null && this.selectedObject.targetNode) {
                                            this.selectedObject.targetNode = this.undoObject.targetNode;
                                            this.selectedObject.targetPort = this.undoObject.targetPort;
                                            this.selectedObject.targetPoint = this.undoObject.targetPoint;
                                            this.selectedObject.segments = this.undoObject.segments;
                                        }
                                        else {
                                            this.selectedObject.segments = this.undoObject.segments;
                                            this.selectedObject.targetPoint = this.undoObject.targetPoint;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (this.selectedObject) {
                        if (this.selectedObject.annotation) {
                            var targetNode = this.diagram.nameTable[this.selectedObject.targetNode];
                            ej.datavisualization.Diagram.DefautShapes.updateBPMNAnnotationShape(this.selectedObject, this.undoObject.targetNode, targetNode, null, this.diagram);
                        }
                        this.diagram._dock(this.selectedObject, this.diagram.nameTable, true);
                        ej.datavisualization.Diagram.Util.updateBridging(this.selectedObject, this.diagram);
                        ej.datavisualization.Diagram.SvgContext.update(this.selectedObject, this.diagram);
                        this.diagram._updateConnectorBridging(this.selectedObject);
                        this.diagram._updateQuad(this.selectedObject);
                        this.diagram._updateSelectionHandle();
                        if (this.selectedObject.annotation)
                            ej.datavisualization.Diagram.DefautShapes.updateAnnotationProperties(this.selectedObject, this.diagram);
                        if (this.selectedObject) {
                            (this.diagram._svg.getElementById(this.selectedObject.name + "_hitTest")).setAttribute("pointer-events", "stroke");
                            (this.diagram._svg.getElementById(this.selectedObject.name)).setAttribute("pointer-events", "auto");
                        }
                        (this.diagram._adornerSvg.getElementById(this.diagram._adornerSvg.document.id + "handle_g")).setAttribute("pointer-events", "visible");
                        this._initialValue = null;
                    }
                }
            if (this.selectedObject) {
                var entry = { type: "endpointchanged", undoObject: this.undoObject, redoObject: this._getClonedObject(this.selectedObject), isMultipleNode: (this.selectedObject._type === "group") ? true : false, category: "internal" };
                this.diagram.addHistoryEntry(entry);
                for (var i = 0; i < this._nearestNodes.length; i++)
                    this._showPort(this._nearestNodes[i], true);
            }
            delete this._nearestNodes;
            base.prototype.mouseup.call(this, evt);
        };
        ConnectionEditTool.prototype._addOrRemoveStraightSegments = function (evt) {
            if (this._endPoint == "segmentEnd") {
                var targetid = evt.target.id;
                var coll = targetid.split("_");
                coll.reverse();
                var index = Number(coll[0]);
                var segment = this.selectedObject.segments[index];
                if (segment && segment.type == "straight") {
                    var prevseg = this.selectedObject.segments[index + 1];
                    if (prevseg) {
                        this.selectedObject.segments.splice(index, 1);
                        prevseg._startPoint = prevseg.points[0] = segment._startPoint;
                        update = true;
                    }
                }
            }
            else {
                var className = evt.target.getAttribute("class");
                var targetid = evt.target.id;
                var update = false;
                var index = this._findIndex();
                if (this.selectedObject.segments && this.selectedObject.segments[index] && this.selectedObject.segments[index].type == "straight") {
                    var segment = this.selectedObject.segments[index];
                    var newseg = ej.datavisualization.Diagram.Segment({ type: "straight", _point: segment._endPoint });
                    this.selectedObject.segments.splice(index + 1, 0, newseg);
                    if (index + 1 != this.selectedObject.segments.length - 1) {
                        newseg.point = newseg._point;
                    }
                    segment._point = segment.point = segment.points[1] = segment._endPoint = this.currentPoint;
                    newseg.points[0] = newseg._startPoint = this.currentPoint;
                    newseg.points[1] = newseg._endPoint = newseg._point;
                    update = true;
                }
            }
            if (update) {
                ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                ej.datavisualization.Diagram.Util.updateBridging(this.selectedObject, this.diagram);
                ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                //ej.datavisualization.Diagram.SvgContext.clearSelector(this.diagram._svg, this.diagram._adornerLayer);
                ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
            }
        };
        ConnectionEditTool.prototype._findIndex = function () {
            var intersectingSegs = [];
            for (var i = 0; i < this.selectedObject.segments.length; i++) {
                var segment = this.selectedObject.segments[i];
                var rect;
                rect = {
                    x: Math.min(segment._startPoint.x, segment._endPoint.x), y: Math.min(segment._startPoint.y, segment._endPoint.y),
                    width: Math.abs(segment._startPoint.x - segment._endPoint.x), height: Math.abs(segment._startPoint.y - segment._endPoint.y)
                };
                ej.datavisualization.Diagram.Geometry.inflate(rect, this.selectedObject.lineHitPadding / 2, this.selectedObject.lineHitPadding / 2);
                if (ej.datavisualization.Diagram.Geometry.containsPoint(rect, this.currentPoint)) {
                    intersectingSegs.push(segment);
                }
            }
            if (intersectingSegs.length == 1) {
                return this.selectedObject.segments.indexOf(intersectingSegs[0]);
            }
            else {
                var ratio, min, index, seg, v, h;
                for (var i = 0; i < intersectingSegs.length; i++) {
                    seg = intersectingSegs[i];
                    var point = this.currentPoint;
                    v = (point.y - seg._startPoint.y) / (seg._endPoint.y - point.y);
                    h = (point.x - seg._startPoint.x) / (seg._endPoint.x - point.x);
                    ratio = Math.abs(v - h);
                    if (i == 0) { min = ratio; index = 0; }
                    if (ratio < min) { min = ratio; index = i; }
                }
                return this.selectedObject.segments.indexOf(intersectingSegs[index]);
            }
        }
        ConnectionEditTool.prototype._removeNextSegment = function (index) {
            var first = this.selectedObject.segments[index - 1];
            var last = this.selectedObject.segments[index + 2];
            var next = this.selectedObject.segments[index + 1];
            if (next.length || next.length === 0) {
                this.selectedObject.segments.splice(index, 2);
                if (this.selectedSegment.direction == "top" || this.selectedSegment.direction == "bottom") {
                    last._startPoint.y = this.selectedSegment._startPoint.y;
                    first._endPoint.x = last._startPoint.x;
                }
                else {
                    last._startPoint.x = this.selectedSegment._startPoint.x;
                    first._endPoint.y = last._startPoint.y;
                }
            }
            else {
                this.selectedObject.segments.splice(index + 1, 1);
                if (this.selectedSegment.direction == "top" || this.selectedSegment.direction == "bottom") {
                    first._endPoint.x = next._endPoint.x;
                }
                else {
                    first._endPoint.y = next._endPoint.y;
                }
                first._length = first.length = ej.datavisualization.Diagram.Geometry.distance(first._startPoint, first._endPoint);
                if (first.length)
                    first._direction = first.direction = ej.datavisualization.Diagram.Util._getBezierDirection(first._startPoint, first._endPoint);
                this.selectedSegment.length = this.selectedSegment._length = this.selectedSegment.direction = null;
            }

            if (first && last) {
                first._length = first.length = ej.datavisualization.Diagram.Geometry.distance(first._startPoint, last._startPoint);
                if (first.length)
                    first._direction = first.direction = ej.datavisualization.Diagram.Util._getBezierDirection(first._startPoint, last._startPoint);
                if (last.length || last.length === 0) {
                    last._length = last.length = ej.datavisualization.Diagram.Geometry.distance(first._endPoint, last._endPoint);
                    if (last.length)
                        last._direction = last.direction = ej.datavisualization.Diagram.Util._getBezierDirection(first._endPoint, last._endPoint);
                }
            }
            return true;
        },
        ConnectionEditTool.prototype._removePrevSegment = function (index) {
            var first = this.selectedObject.segments[index - 2];
            var next = this.selectedObject.segments[index + 1];
            var length = (next.length || next.length === 0) ? next.length : ej.datavisualization.Diagram.Geometry.distance(next.points[0], next.points[1]);
            if (length <= 5) {
                var end = this.selectedObject.segments[index + 2];
                if (next.length === length)
                    this.selectedObject.segments.splice(index - 1, 4);
                else
                    this.selectedObject.segments.splice(index - 1, 3);
                if (end) {
                    if (first.direction == "top" || first.direction == "bottom") {
                        first._endPoint.y = end._endPoint.y;
                        end._startPoint.x = first._endPoint.x;
                    }
                    else {
                        first._endPoint.x = end._endPoint.x;
                        end._startPoint.y = first._endPoint.y;
                    }
                    if (first.length || first.length === 0) {
                        first._length = first.length = ej.datavisualization.Diagram.Geometry.distance(first._startPoint, first._endPoint);
                        if (first.length)
                            first._direction = first.direction = ej.datavisualization.Diagram.Util._getBezierDirection(first._startPoint, first._endPoint);
                    }
                    if (end.length || end.length === 0) {
                        end._length = end.length = ej.datavisualization.Diagram.Geometry.distance(end._startPoint, end._endPoint);
                        if (end._length)
                            end._direction = end.direction = ej.datavisualization.Diagram.Util._getBezierDirection(end._startPoint, end._endPoint);
                    }
                }
                else {
                    first._endPoint = this.selectedObject.endPoint;
                    first.direction = first.length = first._length = null;
                    first._direction = next._direction;
                }
            }
            else {

                var last = this.selectedObject.segments[index + 1];
                this.selectedObject.segments.splice(index - 1, 2);
                var segment = this.selectedSegment;
                if (segment.direction == "left" || segment.direction == "right") {
                    first._endPoint.x = last._startPoint.x;
                    last._startPoint.y = first._endPoint.y;
                }
                else {
                    first._endPoint.y = last._startPoint.y;
                    last._startPoint.x = first._endPoint.x;
                }
                if (this.selectedSegment.length || this.selectedSegment.length === 0) {
                    first._length = first.length = ej.datavisualization.Diagram.Geometry.distance(first._startPoint, first._endPoint);
                    if (first._length)
                        first._direction = first.direction = ej.datavisualization.Diagram.Util._getBezierDirection(first._startPoint, first._endPoint);
                }
                if (last.length || last.length === 0) {
                    last._length = last.length = ej.datavisualization.Diagram.Geometry.distance(last._startPoint, last._endPoint);
                    if (last.length)
                        last._direction = last.direction = ej.datavisualization.Diagram.Util._getBezierDirection(last._startPoint, last._endPoint);
                }
            }

            return true;
        },
        ConnectionEditTool.prototype._getClonedObject = function (connector) {
            if (connector) {
                var clonedObject = $.extend(true, {}, connector);
                clonedObject.targetNode = connector.targetNode;
                clonedObject.sourceNode = connector.sourceNode;
                clonedObject.targetPort = connector.targetPort;
                clonedObject.sourcePort = connector.sourcePort;
                return clonedObject;
            }
        };
        ConnectionEditTool.prototype._updateConnection = function (connector, updateSelection) {
            var connectionChange;
            this._updateConnectionTarget(connector);
            if (this._endPoint == "targetEndPoint") {
                if (this._currentPossibleConnection) {
                    if (this._possibleConnectionPort && ej.datavisualization.Diagram.Util.canConnect(this._possibleConnectionPort, true)) {
                        if (connector.targetNode != this._currentPossibleConnection.name || connector.targetPort != this._possibleConnectionPort.name) {
                            connectionChange = this._raiseConnectionChangeEvent(connector, true);
                        }
                    }
                    else if (ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection)) {
                        if (connector.targetNode != this._currentPossibleConnection.name || connector.targetPort) {
                            connectionChange = this._raiseConnectionChangeEvent(connector, true);
                        }
                    }
                }
                else {
                    if (this.selectedObject.targetNode) {
                        connectionChange = this._raiseConnectionChangeEvent(connector, true);
                    }
                }
                if (connectionChange) {
                    ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                    ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                    if (connector.segments.length > 2 || connector.segments[0].points.length == 2)
                        ej.datavisualization.Diagram.Util._updatePreviousSegment(connector);
                    ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                }
            }
            else if (this._endPoint == "sourceEndPoint") {
                if (this._currentPossibleConnection) {
                    if (this._possibleConnectionPort && ej.datavisualization.Diagram.Util.canConnect(this._possibleConnectionPort, true)) {
                        if (connector.sourceNode != this._currentPossibleConnection.name || connector.sourcePort != this._possibleConnectionPort.name) {
                            connectionChange = this._raiseConnectionChangeEvent(connector);
                        }
                    }
                    else if (ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection)) {
                        if (connector.sourceNode != this._currentPossibleConnection.name || connector.sourcePort) {
                            connectionChange = this._raiseConnectionChangeEvent(connector);
                        }
                    }

                }
                else {
                    if (this.selectedObject.sourceNode) {
                        connectionChange = this._raiseConnectionChangeEvent(connector);
                        //if (connectionChange)
                        {
                            ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                            ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);

                        }
                    }
                    if (connectionChange) {
                        ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                    }
                }

            }

            var endPoint = this.selectedSegment._endPoint;
            this.diagram._dock(connector, this.diagram.nameTable, updateSelection);
            if (connectionChange && this._endPoint == "sourceEndPoint" && this.selectedObject.segments.length > 1) {
                if (this.selectedSegment.points.length == 2 && !this.selectedObject.sourcePort && this.selectedSegment.length) {
                    if (this.selectedSegment.direction == "right" || this.selectedSegment.direction == "left") {
                        if (this.selectedSegment._startPoint.x < endPoint.x) {
                            this.selectedSegment.direction = this.selectedSegment._direction = "right";
                        }
                        else this.selectedSegment.direction = this.selectedSegment._direction = "left";
                        this.selectedSegment.length = this.selectedSegment._length = Math.abs(this.selectedSegment._startPoint.x - endPoint.x);
                    }
                    else {
                        if (this.selectedSegment._startPoint.y < endPoint.y) {
                            this.selectedSegment.direction = this.selectedSegment._direction = "bottom";
                        }
                        else this.selectedSegment.direction = this.selectedSegment._direction = "top";
                        this.selectedSegment.length = this.selectedSegment._length = Math.abs(this.selectedSegment._startPoint.y - endPoint.y);

                    }
                    ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                    ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                    ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                }
                else {
                    if (connectionChange) {
                        ej.datavisualization.Diagram.Util._updateConnectorSegments(this.selectedObject, this.selectedObject.sourcePort, this.selectedObject.targetPort, this.diagram);
                        ej.datavisualization.Diagram.DiagramContext._refreshSegments(this.selectedObject, this.diagram);
                        ej.datavisualization.Diagram.SvgContext._refreshEndPointHandles(this.diagram.selectionList[0], this.diagram._adornerSvg, this.diagram._currZoom);
                    }
                }
            }
        };

        ConnectionEditTool.prototype._disconnect = function (connector) {
            var args;
            //var node = this.diagram.nameTable[connector.targetNode];
            var port = null;
            //if (this._endPoint == "targetEndPoint" && node) {
            //    port = ej.datavisualization.Diagram.Util.findPortByName(node, connector.targetPort);
            //    args = this._raiseEvent("connectionChange", { element: connector, endPoint: this._endPoint, connection: node, port: port, cancel: false });
            //    if (!args.cancel) {
            //        ej.datavisualization.Diagram.Util.removeItem(node.inEdges, connector.name);
            //        connector.targetNode = null;
            //        connector.targetPort = null;
            //    }

            //}
            //var node = this.diagram.nameTable[connector.sourceNode];
            //if ((this._endPoint == "sourceEndPoint") && node) {
            //    port = ej.datavisualization.Diagram.Util.findPortByName(node, connector.sourcePort);
            //    args = this._raiseEvent("connectionChange", { element: connector, endPoint: this._endPoint, connection: node, port: port, cancel: false });
            //    if (!args.cancel) {
            //        ej.datavisualization.Diagram.Util.removeItem(node.outEdges, connector.name);
            //        connector.sourceNode = null;
            //        connector.sourcePort = null;
            //    }
            //}
        };
        ConnectionEditTool.prototype._endAction = function () {
            this._showPorts();
            var possibleConnection;
            if (this._currentPossibleConnection && !this._possibleConnectionPort) {
                possibleConnection = this._currentPossibleConnection;
            }
            base.prototype._endAction.apply(this);
            if (this._endPoint) {
                this._endPoint = null;
                if (possibleConnection) {
                    this.diagram._checkToolToActivate(possibleConnection, this.currentPoint);
                    this.diagram._updateCursor();
                }
            }
        };

        ConnectionEditTool.prototype._outOfBoundsDrag = function (node, ptX, ptY, isTarget) {
            ptX = ptX ? ptX : 0;
            ptY = ptY ? ptY : 0;
            if (node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var size = this._getPageBounds();
                if (!this.diagram._selectedSymbol && (ptX >= size.width || ptX <= size.x)) {
                    this.updateCursor("not-allowed");
                    return false;
                }
                if (!this.diagram._selectedSymbol && (ptY >= size.height || ptY <= size.y)) {
                    this.updateCursor("not-allowed");
                    return false;
                }
            }
            else if (!ej.datavisualization.Diagram.bpmnHelper.canMoveOutofBounds(this.diagram, node, ptX, ptY)) {
                this.updateCursor("not-allowed");
                return false;
            }
            this.updateCursor(this.cursor);
            return true;
        };
        ConnectionEditTool.prototype._updatePoints = function (connector, dragState) {
            var cancel = false, eventType = "";
            if (this._endPoint && this._endPoint != "segmentEnd" && this.selectedSegment) {
                var isTarget = (this._endPoint == "targetEndPoint") ? true : false;
                var isSource = (this._endPoint == "sourceEndPoint") ? true : false;

                var endPoint;
                if (this._endPoint) {
                    var end = this._endPoint.match("bezierpoint1") ? "bezierpoint1" : this._endPoint.match("bezierpoint2") ? "bezierpoint2" : this._endPoint;;

                    switch (end) {
                        case "targetEndPoint":
                            endPoint = this.selectedSegment._endPoint;
                            break;
                        case "sourceEndPoint":
                            endPoint = this.selectedSegment._startPoint;
                            break;
                        case "bezierpoint1":
                            endPoint = this.selectedSegment._point1;
                            break;
                        case "bezierpoint2":
                            endPoint = this.selectedSegment._point2;
                            break;
                    }

                    var ptCur = this.currentPoint;
                    if (this._possibleConnectionPort == null) {
                        ptCur = this.snap(ptCur);
                    }
                    var offset = ej.datavisualization.Diagram.Point(endPoint.x - ptCur.x, endPoint.y - ptCur.y);

                    var dragargs = this._raiseEndPointDrag(connector, isTarget, isSource, dragState);
                    if (dragargs) {
                        cancel = dragargs.cancel;
                        eventType = dragargs.type;
                    }
                    if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(offset)) {
                        if (!cancel) {
                            if (isTarget || isSource) {
                                var connected = this._currentPossibleConnection ? ej.datavisualization.Diagram.Util.canConnect(this._currentPossibleConnection, false) : false;
                                if (this._outOfBoundsDrag(this.selectedObject, ptCur.x, ptCur.y, isTarget)) {
                                    if (this.selectedObject.segments.length > 1) {
                                        if (!isTarget && !connected && this.selectedSegment.type == "orthogonal" && (this.selectedSegment.length || this.selectedSegment.length === 0)) {
                                            this.selectedObject.sourcePoint = ptCur;
                                            var difx = ptCur.x - this.selectedSegment._startPoint.x;
                                            var dify = ptCur.y - this.selectedSegment._startPoint.y;
                                            if (this.selectedSegment.direction == "left" || this.selectedSegment.direction == "right") {
                                                this.selectedSegment._endPoint.y = this.selectedSegment.points[this.selectedSegment.points.length - 1].y = ptCur.y;
                                            }
                                            else {
                                                this.selectedSegment._endPoint.x = this.selectedSegment.points[this.selectedSegment.points.length - 1].x = ptCur.x;
                                            }
                                            this.selectedSegment._startPoint = this.selectedSegment.points[0] = ptCur;
                                            this.selectedSegment._length = this.selectedSegment.length = ej.datavisualization.Diagram.Geometry.distance(ptCur, this.selectedSegment._endPoint);
                                            if (this.selectedSegment._length)
                                                this.selectedSegment._direction = this.selectedSegment.direction = ej.datavisualization.Diagram.Util._getBezierDirection(ptCur, this.selectedSegment._endPoint);

                                            this.updateNextSegment(this.selectedObject.segments[0], this.selectedObject.segments[1], difx,
                                                dify);
                                            var next = this.selectedObject.segments[1];
                                            var updated = false;
                                            if (next && (next.length)) {
                                                next.length = next._length = ej.datavisualization.Diagram.Geometry.distance(this.selectedSegment._endPoint, next._endPoint);
                                                if (next.length)
                                                    next.direction = next._direction = ej.datavisualization.Diagram.Util._getBezierDirection(this.selectedSegment._endPoint, next._endPoint);
                                            }
                                            if (this.selectedSegment.length == 0 || next.length === 0) {
                                                if (next.length == 0 && this.selectedObject.segments.length > 2) {
                                                    this.selectedObject.segments.splice(0, 2);
                                                }
                                                else if (this.selectedObject.segments.length > 1) {
                                                    this.selectedObject.segments.splice(0, 1);
                                                }
                                                this.selectedSegment = this.selectedObject.segments[0];
                                                this.selectedSegment._startPoint = this.selectedSegment.points[0] = ptCur;
                                                if (this.selectedSegment._direction == "left" || this.selectedSegment._direction == "right") {
                                                    this.selectedSegment._endPoint.y = this.selectedSegment.points[this.selectedSegment.points.length - 1].y = ptCur.y;
                                                }
                                                else {
                                                    this.selectedSegment._endPoint.x = this.selectedSegment.points[this.selectedSegment.points.length - 1].x = ptCur.x;
                                                }

                                                var next = this.selectedObject.segments[1];
                                                if (this.selectedObject.segments.length > 1) {
                                                    this.selectedSegment._length = this.selectedSegment.length = ej.datavisualization.Diagram.Geometry.distance(ptCur, next._startPoint);
                                                    ej.datavisualization.Diagram.Util._addOrthogonalPoints(this.selectedSegment, null, connector.segments[1], connector.sourcePoint, connector.targetPoint);
                                                    ej.datavisualization.Diagram.Util._addOrthogonalPoints(connector.segments[1], connector.segments[0], connector.segments[2], connector.sourcePoint, connector.targetPoint);
                                                    next._startPoint = next.points[0] = connector.segments[0]._endPoint;
                                                }
                                                else ej.datavisualization.Diagram.Util._addOrthogonalPoints(this.selectedSegment, null, connector.segments[1], connector.sourcePoint, connector.targetPoint);

                                                updated = true;
                                            }
                                            else ej.datavisualization.Diagram.Util._addOrthogonalPoints(this.selectedSegment, null, connector.segments[1], connector.sourcePoint, connector.targetPoint);
                                            if (next && (next.length)) {
                                                next.length = next._length = ej.datavisualization.Diagram.Geometry.distance(this.selectedSegment._endPoint, next._endPoint);
                                                if (next.length)
                                                    next.direction = next._direction = ej.datavisualization.Diagram.Util._getBezierDirection(this.selectedSegment._endPoint, next._endPoint);
                                            }
                                        }
                                        else if (isTarget && !connected && this.selectedSegment.type == "orthogonal" && this.selectedSegment.points.length == 2) {
                                            var difx = ptCur.x - this.selectedSegment._endPoint.x;
                                            var dify = ptCur.y - this.selectedSegment._endPoint.y;

                                            if (this.selectedSegment._direction == "left" || this.selectedSegment._direction == "right") {
                                                this.selectedSegment._startPoint.y = (this.selectedSegment.points[0].y += dify);
                                                this.selectedSegment._endPoint.y = this.selectedSegment.points[1].y = this.selectedSegment._startPoint.y;
                                            }
                                            else {
                                                this.selectedSegment._startPoint.x = (this.selectedSegment.points[0].x += difx);
                                                this.selectedSegment._endPoint.x = this.selectedSegment.points[1].x = this.selectedSegment._startPoint.x;
                                            }
                                            var index = this.selectedObject.segments.length - 1;
                                            if (this.selectedObject.segments[index - 1])
                                                this.updatePreviousSegment(this.selectedObject.segments[index], this.selectedObject.segments[index - 1], difx,
                                                    dify);
                                        }
                                    }
                                    if ((isSource || isTarget) && !connected) {
                                        var srclength = this.selectedSegment.points.length;
                                        this.diagram._setEndPoint(connector, ej.datavisualization.Diagram.Point(ptCur.x, ptCur.y), isTarget);
                                        if (srclength != this.selectedSegment.points.length || updated) {
                                            return { updateSelection: true, cancel: cancel };
                                        }
                                    }
                                }
                            }
                            else
                                ej.datavisualization.Diagram.Util._setBezierPoint(this.selectedSegment, ej.datavisualization.Diagram.Point(ptCur.x, ptCur.y), end);
                        }
                    }
                }
            }
            return { cancel: cancel, eventType: eventType };
        };
        return ConnectionEditTool;
    })(ToolBase);

    ej.datavisualization.Diagram.ConnectionEditTool = ConnectionEditTool;
    //#endregion

    //#region ShapeTool
    var ShapeTool = (function (base) {
        ej.datavisualization.Diagram.extend(ShapeTool, base);
        function ShapeTool(diagram) {
            base.call(this, "shapeTool", diagram);
            this.cursor = "crosshair";
            this._drawingPolygon = false;
            this._points = [];
        }
        ShapeTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);

            if (this._isPolyline() && evt && !this._sourcePossibleConnection) {
                if (this._currentPossibleConnection) {
                    var point = this.mousePosition(evt);
                    this._possibleConnectionPort = this.diagram._findPortAtPoint(point, this._currentPossibleConnection);
                }
                if (this._currentPossibleConnection) {
                    this._sourcePossibleConnection = this._currentPossibleConnection;
                    this._sourcePort = this._possibleConnectionPort;
                }
            }

            if (!this._drawingPolygon) {
                this.selectedObject = this.createNode();
                if (this.selectedObject.type == "bpmn") this.diagram._initGroupNode(this.selectedObject);
                this.selectedObject._type = "node";
            }
            else {
                var pt = this.helper.points[this.helper.points.length - 1];
                pt = { x: pt.x, y: pt.y };
                this.helper.points.push(pt);
                this._points.push(this.snap(this.currentPoint));
            }

            this._prevPoint = this.currentPoint;
        };

        ShapeTool.prototype._getStartPoint = function () {
            var ptStart;
            if (this._sourcePossibleConnection && this._sourcePort) {
                ptStart = ej.datavisualization.Diagram.Util._getPortPosition(this._sourcePort, ej.datavisualization.Diagram.Util.bounds(this._sourcePossibleConnection));
            }
            else {
                ptStart = this.snap(this.startPoint);
            }
            return ptStart;
        };
        ShapeTool.prototype._getCurrentPoint = function () {
            var ptCur;
            if (this._targetPossibleConnection && this._targetPort) {
                ptCur = ej.datavisualization.Diagram.Util._getPortPosition(this._targetPort, ej.datavisualization.Diagram.Util.bounds(this._targetPossibleConnection));
            }
            else {
                ptCur = this.snap(this.currentPoint);
            }
            return ptCur;
        };

        ShapeTool.prototype.createNode = function () {
            if (this._isPolyline()) {
                var connector = $.extend(true, {}, this.diagram.model.drawType);
                connector.sourcePoint = this.currentPoint,
                connector.targetPoint = this.currentPoint,
                connector.segments = [{ type: "straight" }]
                node = this.diagram._getNewConnector(connector);
            }
            else
                var node = this.diagram._getNewNode(this.diagram.model.drawType);
            if (this.diagram.model.drawType.name) {
                node.name = this.diagram.model.drawType.name + ej.datavisualization.Diagram.Util.randomId();
            }
            else {
                node.name = "node" + ej.datavisualization.Diagram.Util.randomId();
            }
            var currentPoint = this.snap(this.currentPoint);
            if (!this._isPolyline()) {
                node.offsetX = currentPoint.x;
                node.offsetY = currentPoint.y;
                node.width = 5;
                node.height = 5;
            }
            if (node.type != "text" && !this._isPolyline())
                node.shape = this.diagram.model.drawType.shape ? this.diagram.model.drawType.shape : node.shape;

            if ((this.diagram.model.drawType.shape == "polygon" || this._isPolyline()) && (!this.diagram.model.drawType.points || !this.diagram.model.drawType.points.length)) {
                this._drawingPolygon = true;
                var startPoint = this.snap(this.startPoint);
                node.points = [{ x: startPoint.x, y: startPoint.y },
                    { x: currentPoint.x, y: currentPoint.y }];
                this._points = [{ x: startPoint.x, y: startPoint.y },
                    { x: currentPoint.x, y: currentPoint.y }];
            }
            return ej.datavisualization.Diagram.NodeType(node, this.diagram);
        };
        ShapeTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (this.selectedObject) {
                if (!this.inAction) {
                    this.inAction = true;
                    if (this.selectedObject.shape === "polygon" && (!this.diagram.model.drawType.points || !this.diagram.model.drawType.points.length)) {
                        if (this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y) {
                            var startPoint = this.snap(this.startPoint);
                            var currentPoint = this.snap(this.currentPoint);
                            this.selectedObject.points = [{ x: startPoint.x, y: startPoint.y },
                                { x: currentPoint.x, y: currentPoint.y }];
                            this._points = [{ x: startPoint.x, y: startPoint.y },
                                { x: currentPoint.x, y: currentPoint.y }];
                        }
                    }
                    this._initHelper();
                    this._renderHelper();
                }
                else {
                    this._updateHelper();
                }
            }
            if (this._isPolyline() && evt) {
                this._checkConnectionPossible(evt);
            }
            this.previousPoint = this.currentPoint;
        };
        ShapeTool.prototype._addPolyline = function (evt) {
            if (this._currentPossibleConnection) {
                var point = this.mousePosition(evt);
                this._targetPossibleConnection = this._currentPossibleConnection;
                this._targetPort = this.diagram._findPortAtPoint(point, this._currentPossibleConnection);
            }
            var segments = [];
            if (this._currentPossibleConnection && this._sourcePossibleConnection)
                this._sourcePossibleConnection = this._sourcePossibleConnection.name === this._currentPossibleConnection.name ? null : this._sourcePossibleConnection;
            for (var i = 1; i < this.selectedObject.points.length - 2; i++)
                segments.push({ type: "straight", point: this.selectedObject.points[i] });
            var connector = this.diagram._getNewConnector(this.selectedObject)
            connector.name = this.selectedObject.name;
            connector.sourcePoint = this.selectedObject.points[0];
            connector.targetPoint = this.selectedObject.points[this.selectedObject.points.length - 1];
            connector.segments = segments;
            connector.sourceNode = this._sourcePossibleConnection ? this._sourcePossibleConnection.name : null;
            connector.targetNode = this._targetPossibleConnection ? this._targetPossibleConnection.name : null;
            connector.sourcePort = this._sourcePort ? this._sourcePort.name : null;
            connector.targetPort = this._targetPort ? this._targetPort.name : null;
            this.diagram.add(connector);
            this._sourcePossibleConnection = null;
            this._targetPossibleConnection = null;
            this._sourcePort = null;
            this._targetPort = null;
        };
        ShapeTool.prototype.mouseup = function (evt) {
            var resetTool = false;
            if ((!this._drawingPolygon || evt.button == 2 || this.diagram._getEventDetail(evt) == 2) || (this._sourcePossibleConnection && this._currentPossibleConnection
                    && (this._sourcePossibleConnection.name != this._currentPossibleConnection.name)
                    || (this._sourcePort && this._targetPort && this._sourcePort.name !== this._targetPort.name))) {
                if (this.inAction) {
                    this.inAction = false;
                    if (this._drawingPolygon) this.selectedObject.points = this.helper.points;
                    this._updateSize(this.selectedObject, this.startPoint, this.currentPoint);
                    if (this._isPolyline()) {
                        this._addPolyline(evt);
                    }
                    else
                        this.diagram.add(this.selectedObject);
                }
                resetTool = true;
            }
            else if (this._currentPossibleConnection && this.helper) {
                if (this.selectedObject.points.length > 0) {
                    if (this._drawingPolygon) this.selectedObject.points = this.helper.points;
                    this._updateSize(this.selectedObject, this.startPoint, this.currentPoint);
                    if (this._isPolyline()) {
                        this._addPolyline(evt);
                    }
                }
                resetTool = true;
            }

            if (resetTool) {
                this.diagram._toolToActivate = "selectTool";
                this.diagram._drawingTool = false;
                base.prototype.mouseup.call(this, evt);
                if (this._drawingPolygon) {
                    this.diagram._disableDefaultContextMenu = true;
                    delete this._drawingPolygon;
                    delete this._points;
                }
            }
        };
        ShapeTool.prototype._renderHelper = function () {
            if (!this.svgHelper) {
                if (this._isPolyline())
                    this.svgHelper = ej.datavisualization.Diagram.SvgContext.renderConnector(this.helper, this.diagram._svg, this.diagram._diagramLayer, this.diagram);
                else if (this.helper.type != "bpmn")
                    this.svgHelper = ej.datavisualization.Diagram.SvgContext.renderNode(this.helper, this.diagram._svg, this.diagram._diagramLayer, undefined, this.diagram);
                else {
                    this.helper._type = "group";
                    this.diagram._initGroupNode(this.helper);
                    this.svgHelper = ej.datavisualization.Diagram.SvgContext.renderGroup(this.helper, this.diagram._svg, this.diagram._diagramLayer, this.diagram.nameTable, this.diagram);
                }
                this.svgHelper = document.getElementById(this.helper.name);
                this.svgHelper.setAttribute("pointer-events", "none");
            }
        };
        ShapeTool.prototype._outOfBoundsDrag = function (node, ptX, ptY, isTarget) {
            ptX = ptX ? ptX : 0;
            ptY = ptY ? ptY : 0;
            if (node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var size = this._getPageBounds();
                if (!this.diagram._selectedSymbol && (ptX >= size.width || ptX <= size.x)) {
                    this.updateCursor("not-allowed");
                    return false
                }
                if (!this.diagram._selectedSymbol && (ptY >= size.height || ptY <= size.y)) {
                    this.updateCursor("not-allowed");
                    return false
                }
            }
            else if (node.sourceNode != null && !ej.datavisualization.Diagram.bpmnHelper.canMoveOutofBounds(this.diagram, node, ptX, ptY)) {
                this.updateCursor("not-allowed");
                return false;
            }
            this.updateCursor(this.cursor);
            return true
        };
        ShapeTool.prototype._updateHelper = function () {
            var ptStart = this._getStartPoint();
            var ptEnd = this._getCurrentPoint();
            if (this._drawingPolygon && (this._outOfBoundsDrag(this.helper, ptEnd.x, ptEnd.y) && this._outOfBoundsDrag(this.helper, ptStart.x, ptStart.y))) {
                var currentPoint = this.snap(this.currentPoint);
                var previousPoint = this.snap(this.previousPoint);
                var dif = { x: currentPoint.x - previousPoint.x, y: currentPoint.y - previousPoint.y };
                this.helper.points[this.helper.points.length - 1].x += dif.x;
                this.helper.points[this.helper.points.length - 1].y += dif.y;
                this._points[this._points.length - 1].x += dif.x;
                this._points[this._points.length - 1].y += dif.y;
                if (this._isPolyline()) {
                    var segments = [];
                    for (var i = 0; i < this.helper.points.length - 1  ; i++)
                        segments.push({ type: "straight", point: this.helper.points[i] });
                    this.helper.sourcePoint = this.helper.points[0];
                    this.helper.targetPoint = this.helper.points[this.helper.points.length - 1];
                    this.helper.segments = segments;
                    this.helper = this.diagram._getNewConnector(this.helper)
                    this.diagram._dock(this.helper, this.diagram.nameTable);
                }
            }
            var prtyObject = $.extend(true, {}, this.helper);
            this._updateSize(this.helper, this.snap(this.startPoint), this.snap(this.currentPoint));
            this.diagram._comparePropertyValues(this.helper, "height", { height: prtyObject.height }, true);
            this.diagram._comparePropertyValues(this.helper, "width", { width: prtyObject.width }, true);
            this.diagram._comparePropertyValues(this.helper, "offsetX", { offsetX: prtyObject.offsetX }, true);
            this.diagram._comparePropertyValues(this.helper, "offsetY", { offsetY: prtyObject.offsetY }, true);
            if (this.helper.shape == "polygon" && !this._drawingPolygon) {
                this.helper.width = this.helper.width != 0 ? this.helper.width : 5;
                this.helper.height = this.helper.height != 0 ? this.helper.height : 5;
            }
            ej.datavisualization.Diagram.SvgContext.update(this.helper, this.diagram);
        };
        ShapeTool.prototype._updateSize = function (shape, startPoint, currentPoint) {
            if ((this._outOfBoundsDrag(this.helper, currentPoint.x, currentPoint.y) && this._outOfBoundsDrag(this.helper, startPoint.x, startPoint.y))) {
                var pts = this._drawingPolygon ? this._points : [startPoint, currentPoint];
                var rect = ej.datavisualization.Diagram.Geometry.rect(pts);
                var size = { width: rect.width, height: rect.height };
                var offset = { x: rect.x, y: rect.y };
                if (!ej.datavisualization.Diagram.Geometry.isEmptySize(size)) {
                    if (this.helper.type != "bpmn") {
                        shape.offsetX = offset.x + size.width / 2;
                        shape.offsetY = offset.y + size.height / 2;
                        shape.width = size.width;
                        shape.height = size.height;
                        if (shape._shape === "path")
                            shape._scaled = true;
                    }
                    else {
                        shape._type = "group";
                        this.diagram._translate(shape, (offset.x + size.width / 2) - shape.offsetX, (offset.y + size.height / 2) - shape.offsetY, this.diagram.nameTable);
                        this.diagram.scale(shape, size.width / this.helper.width, size.height / this.helper.height, new ej.datavisualization.Diagram.Point(shape.offsetX, shape.offsetY), this.diagram.nameTable);
                        ej.datavisualization.Diagram.Util._updateGroupBounds(shape, this.diagram);
                    }
                }
            }
        };
        return ShapeTool;
    })(ToolBase)

    ej.datavisualization.Diagram.ShapeTool = ShapeTool;
    //#endregion

    //#region LineTool
    var LineTool = (function (base) {
        ej.datavisualization.Diagram.extend(LineTool, base);
        function LineTool(name, diagram) {
            base.call(this, name, diagram);
            this.cursor = "crosshair";
            this._isMouseDown = false;
            this._targetPossibleConnection = null;
            this._sourcePossibleConnection = null;
            this._targetPort = null;
            this._sourcePort = null;
        }
        LineTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            if (ej.datavisualization.Diagram.Util.isPageEditable(this.diagram)) {
                this._isMouseDown = true;
                if (this.diagram._hasSelection()) {
                    this.diagram._clearSelection();
                }
                if (evt && evt.type === "touchstart") {
                    this._currentPossibleConnection = this.diagram._findConnectableNodeUnderMouse(evt);
                    if (this._currentPossibleConnection) {
                        var point = this.mousePosition(evt);
                        this._possibleConnectionPort = this.diagram._findPortAtPoint(point, this._currentPossibleConnection);
                    }
                }
                if (this._currentPossibleConnection) {
                    this._sourcePossibleConnection = this._currentPossibleConnection;
                    this._sourcePort = this._possibleConnectionPort;
                }
                this._raiseEndPointDrag(this.helper, true, false, ej.datavisualization.Diagram.DragState.Starting);
            }
        };

        LineTool.prototype._updateConnection = function (connector, updateSelection) {
            if (connector) {
                this._updateConnectionTarget(this.helper, true);
                this._raiseConnectionChangeEvent(connector, this._endPoint == "sourceEndPoint" ? false : true);
            }
        };
        LineTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            this._checkConnectionPossible(evt);
            if (this._isMouseDown) {
                if (!this.inAction) {
                    this.inAction = true;
                    this._initHelper();
                    this._renderHelper();
                }
                else {
                    this._targetPossibleConnection = this._currentPossibleConnection;
                    this._targetPort = this._possibleConnectionPort;
                    this._updateConnection(this.helper)
                    if (this.helper) {
                        var dragargs = this._raiseEndPointDrag(this.helper, true, false, ej.datavisualization.Diagram.DragState.Dragging);
                        var prptyObject = $.extend(true, {}, this.helper);
                        if (!dragargs.cancel)
                            this._updateHelper();
                        this.diagram._comparePropertyValues(this.helper, "sourcePoint", { sourcePoint: prptyObject.sourcePoint }, true);
                        this.diagram._comparePropertyValues(this.helper, "targetPoint", { targetPoint: prptyObject.targetPoint }, true);
                        this.diagram._comparePropertyValues(this.helper, "segments", { segments: prptyObject.segments }, true);
                        this.diagram._comparePropertyValues(this.helper, "targetNode", { targetNode: this._targetPossibleConnection }, true);
                        this.diagram._comparePropertyValues(this.helper, "targetPort", { targetPort: this._targetPort }, true);
                    }
                }
            }
            this.previousPoint = this.currentPoint;
        };
        LineTool.prototype.mouseup = function (evt) {

            this._targetPort = this._possibleConnectionPort || this._targetPort;
            this._targetPossibleConnection = this._targetPossibleConnection ? this._targetPossibleConnection : this._currentPossibleConnection;
            this._removeHighLighter();
            ej.datavisualization.Diagram.SvgContext._removePortHighlighter(this.diagram._adornerSvg, this.diagram._adornerLayer);

            this._isMouseDown = false;
            if (this.inAction) {
                this.inAction = false;
                var ptStart = this._getStartPoint();
                var ptEnd = this._getCurrentPoint();
                var distance = ej.datavisualization.Diagram.Geometry.distance(ptStart, ptEnd);
                if (this._outOfBoundsDrag(this.helper, ptEnd.x, ptEnd.y) && this._outOfBoundsDrag(this.helper, ptStart.x, ptStart.y)) {
                    if (distance > 0) {
                        var connector = this.createConnector(ptStart, ptEnd);
                        connector.name = "connector" + ej.datavisualization.Diagram.Util.randomId();
                        var args, dragargs;
                        if (this._sourcePossibleConnection) {
                            if (this._sourcePort && ej.datavisualization.Diagram.Util.canConnect(this._sourcePort, true)) {
                                args = this._raiseEvent("connectionChange", { element: connector, connection: this._sourcePossibleConnection, port: this._sourcePort, cancel: false });
                                ej.datavisualization.Diagram.Util.removeItem(this._sourcePossibleConnection.outEdges, this.helper.name);
                                dragargs = this._raiseEndPointDrag(connector, true, false, ej.datavisualization.Diagram.DragState.Completed);
                                if (!args.cancel && !dragargs.cancel) {
                                    connector.sourceNode = this._sourcePossibleConnection.name;
                                    connector.sourcePort = this._sourcePort.name;
                                }
                            }
                            else if (ej.datavisualization.Diagram.Util.canConnect(this._sourcePossibleConnection)) {
                                args = this._raiseEvent("connectionChange", { element: connector, connection: this._sourcePossibleConnection, port: this._sourcePort, cancel: false });
                                ej.datavisualization.Diagram.Util.removeItem(this._sourcePossibleConnection.outEdges, this.helper.name);
                                dragargs = this._raiseEndPointDrag(connector, true, false, ej.datavisualization.Diagram.DragState.Completed);
                                if (!args.cancel && !dragargs.cancel) {
                                    connector.sourceNode = this._sourcePossibleConnection.name;
                                }
                            }
                        }
                        if (this._targetPossibleConnection) {
                            if (this._targetPort && ej.datavisualization.Diagram.Util.canConnect(this._targetPort, true)) {
                                args = this._raiseEvent("connectionChange", { element: connector, connection: this._targetPossibleConnection, port: this._targetPort, cancel: false });
                                ej.datavisualization.Diagram.Util.removeItem(this._targetPossibleConnection.inEdges, this.helper.name);
                                dragargs = this._raiseEndPointDrag(connector, true, false, ej.datavisualization.Diagram.DragState.Completed);
                                if (!args.cancel && !dragargs.cancel) {
                                    connector.targetNode = this._targetPossibleConnection.name;
                                    connector.targetPort = this._targetPort.name;
                                }
                            }
                            else if (ej.datavisualization.Diagram.Util.canConnect(this._targetPossibleConnection)) {
                                args = this._raiseEvent("connectionChange", { element: connector, connection: this._targetPossibleConnection, port: this._targetPort, cancel: false });
                                ej.datavisualization.Diagram.Util.removeItem(this._targetPossibleConnection.inEdges, this.helper.name);
                                dragargs = this._raiseEndPointDrag(connector, true, false, ej.datavisualization.Diagram.DragState.Completed);
                                if (!args.cancel && !dragargs.cancel) {
                                    connector.targetNode = this._targetPossibleConnection.name;
                                }
                            }
                        }
                        var success = this.diagram.add(connector);
                        if (success) {
                            connector = this.diagram.nameTable[connector.name];
                            ej.datavisualization.Diagram.Util.updateBridging(connector, this.diagram);
                            ej.datavisualization.Diagram.SvgContext.update(connector, this.diagram);
                            this.diagram._updateConnectorBridging(connector);
                        }
                    }
                }
            }
            if (this.singleAction)
                this.diagram.deactivateTool();
            if (this._prevTool)
                this._prevTool.inAction = false;
            this._showPorts();
            base.prototype.mouseup.call(this, evt);
        };

        LineTool.prototype._getStartPoint = function () {
            var ptStart;
            if (this._sourcePossibleConnection && this._sourcePort) {
                ptStart = ej.datavisualization.Diagram.Util._getPortPosition(this._sourcePort, ej.datavisualization.Diagram.Util.bounds(this._sourcePossibleConnection));
            }
            else {
                ptStart = this.snap(this.startPoint);
            }
            return ptStart;
        };
        LineTool.prototype._getCurrentPoint = function () {
            var ptCur;
            if (this._targetPossibleConnection && this._targetPort) {
                ptCur = ej.datavisualization.Diagram.Util._getPortPosition(this._targetPort, ej.datavisualization.Diagram.Util.bounds(this._targetPossibleConnection));
            }
            else {
                ptCur = this.snap(this.currentPoint);
            }
            return ptCur;
        };
        LineTool.prototype._initHelper = function () {
            this.helper = this.createConnector(ej.datavisualization.Diagram.Point(0, 0), ej.datavisualization.Diagram.Point(0, 0));
            this.diagram._setZorder(this.helper);
            this.helper.name = "helper";
            this.helper._connectorType = "helper";
        };
        LineTool.prototype.createConnector = function (startPoint, endPoint) {
            return null;
        };
        LineTool.prototype._renderHelper = function () {
            if (!this.svgHelper) {
                this.svgHelper = ej.datavisualization.Diagram.SvgContext.renderConnector(this.helper, this.diagram._svg, this.diagram._diagramLayer, this.diagram);
                this.svgHelper = this.diagram._svg.document.getElementById(this.helper.name);
                this.svgHelper.setAttribute("pointer-events", "none");
                $(this.diagram._svg.getElementById(this.svgHelper.id)).attr("pointer-events", "none");
                $(this.diagram._svg.getElementById(this.svgHelper.id + "_hitTest")).attr("pointer-events", "none");
            }
        };

        LineTool.prototype._outOfBoundsDrag = function (node, ptX, ptY, isTarget) {
            ptX = ptX ? ptX : 0;
            ptY = ptY ? ptY : 0;
            if (node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var size = this._getPageBounds();
                if (!this.diagram._selectedSymbol && (ptX >= size.width || ptX <= size.x)) {
                    this.updateCursor("not-allowed");
                    return false
                }
                if (!this.diagram._selectedSymbol && (ptY >= size.height || ptY <= size.y)) {
                    this.updateCursor("not-allowed");
                    return false
                }
            }
            else if (node.sourceNode != null && !ej.datavisualization.Diagram.bpmnHelper.canMoveOutofBounds(this.diagram, node, ptX, ptY)) {
                this.updateCursor("not-allowed");
                return false;
            }
            this.updateCursor(this.cursor);
            return true
        };

        LineTool.prototype._updateHelper = function () {
            var points = [];
            var ptStart = this._getStartPoint();
            var ptEnd = this._getCurrentPoint();
            points.push(ptStart);
            points.push(ptEnd);
            if (this._outOfBoundsDrag(this.helper, ptEnd.x, ptEnd.y) && this._outOfBoundsDrag(this.helper, ptStart.x, ptStart.y)) {
                this.diagram._setEndPoint(this.helper, ptStart, false);
                this.diagram._setEndPoint(this.helper, ptEnd, true);
                this._disconnect(this.helper);
                if (this._sourcePossibleConnection) {
                    if (this._sourcePort && ej.datavisualization.Diagram.Util.canConnect(this._sourcePort, true)) {
                        this.helper.sourceNode = this._sourcePossibleConnection.name;
                        this.helper.sourcePort = this._sourcePort.name;
                        this._sourcePossibleConnection.outEdges.push(this.helper.name);
                    }
                    else if (ej.datavisualization.Diagram.Util.canConnect(this._sourcePossibleConnection)) {
                        this.helper.sourceNode = this._sourcePossibleConnection.name;
                        this._sourcePossibleConnection.outEdges.push(this.helper.name);
                    }
                }
                if (this._targetPossibleConnection) {
                    if (this._targetPort && ej.datavisualization.Diagram.Util.canConnect(this._targetPort, true)) {
                        this.helper.targetNode = this._targetPossibleConnection.name;
                        this.helper.targetPort = this._targetPort.name;
                        this._targetPossibleConnection.inEdges.push(this.helper.name);
                    }
                    else if (ej.datavisualization.Diagram.Util.canConnect(this._targetPossibleConnection)) {
                        this.helper.targetNode = this._targetPossibleConnection.name;
                        this._targetPossibleConnection.inEdges.push(this.helper.name);
                    }
                }
                this.diagram._dock(this.helper, this.diagram.nameTable);
            }
            ej.datavisualization.Diagram.SvgContext.update(this.helper, this.diagram);
        };
        LineTool.prototype._endAction = function () {
            base.prototype._endAction.apply(this);
            this._targetPossibleConnection = null;
            this._sourcePossibleConnection = null;
            this._targetPort = null;
            this._sourcePort = null;
            this._isMouseDown = false;
        };
        LineTool.prototype._showPorts = function (node) {
        };
        LineTool.prototype._showAllPorts = function (hide) {
            base.prototype._showAllPorts.call(this, hide);
        };
        return LineTool;
    })(ToolBase);

    ej.datavisualization.Diagram.LineTool = LineTool;
    //#endregion

    //#region StraightLineTool
    var StraightLineTool = (function (base) {
        ej.datavisualization.Diagram.extend(StraightLineTool, base);
        function StraightLineTool(diagram) {
            base.call(this, "straightLine", diagram);
        }
        StraightLineTool.prototype.createConnector = function (startPoint, endPoint) {
            var connector = { "segments": [{ "type": "straight" }], "sourcePoint": startPoint, "targetPoint": endPoint };
            return this.diagram._getNewConnector($.extend(true, {}, connector, this.diagram.model.drawType));
        };
        return StraightLineTool;
    })(LineTool);

    ej.datavisualization.Diagram.StraightLineTool = StraightLineTool;
    //#endregion

    //#region OrthogonalLineTool
    var OrthogonalLineTool = (function (base) {
        ej.datavisualization.Diagram.extend(OrthogonalLineTool, base);
        function OrthogonalLineTool(diagram) {
            base.call(this, "orthogonalLine", diagram);
        }
        OrthogonalLineTool.prototype.createConnector = function (startPoint, endPoint) {
            var connector = { "segments": [{ "type": "orthogonal" }], "sourcePoint": startPoint, "targetPoint": endPoint };
            return this.diagram._getNewConnector($.extend(true, {}, connector, this.diagram.model.drawType));
        };
        return OrthogonalLineTool;
    })(LineTool);

    ej.datavisualization.Diagram.OrthogonalLineTool = OrthogonalLineTool;
    //#endregion

    //#region BezierLineTool
    var BezierLineTool = (function (base) {
        ej.datavisualization.Diagram.extend(BezierLineTool, base);
        function BezierLineTool(diagram) {
            base.call(this, "bezierLine", diagram);
        }
        BezierLineTool.prototype.createConnector = function (startPoint, endPoint) {
            var connector = { "segments": [{ "type": "bezier" }], "sourcePoint": startPoint, "targetPoint": endPoint };
            return this.diagram._getNewConnector($.extend(true, {}, connector, this.diagram.model.drawType));
        };
        return BezierLineTool;
    })(LineTool);
    ej.datavisualization.Diagram.BezierLineTool = BezierLineTool;
    //#endregion

    //#region RotateTool
    var RotateTool = (function (base) {
        ej.datavisualization.Diagram.extend(RotateTool, base);
        function RotateTool(diagram) {
            base.call(this, "rotatetool", diagram);
            this._mouseOffset = ej.datavisualization.Diagram.Size(0, 0);
            this.undoObject = null;
        }
        RotateTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.selectedObject = this.diagram.selectionList[0];
            //this.undoObject = ej.datavisualization.Diagram.Util.clone(this.selectedObject);

            var data;
            var childTable = {};
            if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup")
                childTable = this.diagram._getChildTable(this.selectedObject, childTable);
            var temp = { "childTable": childTable, "node": this.selectedObject };
            data = $.extend(true, {}, temp);
            this.undoObject = jQuery.extend(true, {}, data);

            var scale = this.diagram._currZoom;
            //ej.datavisualization.Diagram.SvgContext.renderPivotPoint(this.selectedObject, this.diagram._currZoom, this.diagram._svg);

        };
        RotateTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            var start = !this.inAction;
            if (this.selectedObject) {
                if (!this.inAction) {
                    if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup") {
                        var children = this.diagram._getChildren(this.selectedObject.children);
                        for (var i = 0; i < children.length; i++) {
                            var child = this.diagram.nameTable[children[i]];
                            if (!child.segments)
                                if (!ej.datavisualization.Diagram.Util.canRotate(child)) return;
                        }
                    }
                    this._initialValue = this.selectedObject.rotateAngle;
                    this.inAction = true;
                }
                {
                    var isContainer = false;
                    if (this.selectedObject.parent) {
                        var parent = this.diagram.nameTable[this.selectedObject.parent];
                        if (parent.container) {
                            isContainer = true;
                        }
                    }
                    else if (this.selectedObject.type == "pseudoGroup" && this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {
                        isContainer = true;
                    }
                    if (isContainer) {
                        if (this.selectedObject.type == "pseudoGroup" && this._isParentAsLane(this.selectedObject)) {
                            ej.datavisualization.Diagram.canvasHelper._removeFromParentContainer(this.diagram, this.selectedObject);
                            this._rotate(this.selectedObject);
                            if (this.selectedObject.parent) {
                                ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);
                            }
                        }
                        else {
                            if (!this.helper) {
                                this.helper = this._getCloneNode(this.selectedObject);
                                this.helper.inEdges = this.helper.outEdges = [];
                                this.helper.type = null;
                                this.helper.name = "helper";
                            }
                            this._rotate(this.helper);
                            ej.datavisualization.Diagram.SvgContext._drawContainerHelper(this.diagram);
                        }
                    }

                    else {
                        if (this.selectedObject.type == "pseudoGroup" && this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {// && this._fromContainer(this.selectedObject.children) && this.hasSameParent()) {
                            if (this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {
                                this._rotate(this.selectedObject);
                                if (this.selectedObject.parent) {
                                    ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);
                                }
                                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                                this.diagram._updateSelectionHandle(true);
                                this.diagram._renderTooltip(this.selectedObject, start);
                            }
                        }
                        else {
                            if (this.selectedObject.type === "pseudoGroup")
                                this._updateMultipleUndoObject(this.selectedObject);
                            this._rotate(this.selectedObject);
                            if (this.selectedObject.parent) {
                                ej.datavisualization.Diagram.Util._updateGroupBounds(this.diagram.nameTable[this.selectedObject.parent], this.diagram);
                            }
                            ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                            this.diagram._updateSelectionHandle(true);
                            this.diagram._renderTooltip(this.selectedObject, start);
                        }
                    }
                }
            }
            this.previousPoint = this.currentPoint;
        };
        RotateTool.prototype._rotate = function (node) {
            var cancel = false;
            var oldbounds, newbounds;
            var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
            var crntpoint = this.currentPoint;
            var angle = ej.datavisualization.Diagram.Geometry.findAngle(ej.datavisualization.Diagram.Point(pt.x, pt.y), crntpoint) + 90;
            angle = ej.datavisualization.Diagram.SnapUtil._snapAngle(this.diagram, angle) - node.rotateAngle;
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            oldbounds = ej.datavisualization.Diagram.Rectangle(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
            var oldValue = { bounds: oldbounds, offsetX: node.offsetX, offsetY: node.offsetY, width: node.width, height: node.height };
            this.diagram._comparePropertyValues(node, "rotateAngle", { rotateAngle: angle }, true);
            this.diagram._rotate(node, angle, this.diagram.nameTable);
            bounds = ej.datavisualization.Diagram.Util.bounds(node);
            newbounds = ej.datavisualization.Diagram.Rectangle(bounds.left, bounds.top, bounds.right - bounds.left, bounds.bottom - bounds.top);
            var newValue = { bounds: newbounds, offsetX: node.offsetX, offsetY: node.offsetY, width: node.width, height: node.height };
            var args = this._raiseEvent("rotationChange", { element: this.diagram.getNode(node), angle: node.rotateAngle, oldValue: oldValue, newValue: newValue, cancel: false });
            if (args.cancel)
                this.diagram._rotate(node, -angle, this.diagram.nameTable);
        };
        RotateTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                var isContainer = false;
                var rotateState = true;
                var canvasChild = false;
                if (this.selectedObject.parent) {
                    var parent = this.diagram.nameTable[this.selectedObject.parent];
                    if (parent.container) {
                        isContainer = true;
                    }
                }
                else if (this.selectedObject.type == "pseudoGroup" && this.hasSameParent() && this._fromContainer(this.diagram._getChildren(this.selectedObject.children))) {
                    var fNode = this.diagram.nameTable[this.diagram._getChild(this.selectedObject.children[0])];
                    parent = this.diagram.nameTable[fNode.parent];
                    if (parent.container) {
                        isContainer = true;
                    }
                }
                if ((this.selectedObject.type == "pseudoGroup" || this.selectedObject.name == "multipleSelection") && this.diagram._activeSwimLane) {
                    ej.datavisualization.Diagram.canvasHelper._multiNodeRotate(this.diagram, evt, this.selectedObject);
                }
                else if (isContainer) {
                    ej.datavisualization.Diagram.SvgContext._removeContainerHelper(this.selectedObject, this.diagram._adornerSvg, this.diagram._adornerLayer);
                    this._removeHighLighter(); //ej.datavisualization.Diagram.SvgContext._removeNodeHighlighter(this.diagram._svg, this.diagram._adornerLayer);
                    if (parent.container.type == "canvas")
                        canvasChild = true;
                    if (canvasChild) {
                        if (ej.datavisualization.Diagram.canvasHelper._outOfBoundaryNodeDrop(this.diagram, this.diagram.activeTool.helper, parent)) {
                            ej.datavisualization.Diagram.canvasHelper._singleNodeRotate(this.diagram, evt, this.selectedObject);
                        }
                        else {
                            rotateState = false;
                        }
                    }
                }
                if (this.selectedObject.type != "pseudoGroup") {
                    if (rotateState)
                        this._rotate(this.selectedObject);
                }
                else {
                    if (!this._fromContainer(this.diagram._getChildren(this.selectedObject.children)))
                        this._rotate(this.selectedObject);
                }
                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);

                var data;
                var childTable = {};
                if (this.selectedObject._type === "group" || this.selectedObject.type === "pseudoGroup")
                    childTable = this.diagram._getChildTable(this.selectedObject, childTable);
                var temp = { "childTable": childTable, "node": this.selectedObject };
                data = $.extend(true, {}, temp);
                var entry = { type: "rotationchanged", undoObject: this.undoObject, redoObject: jQuery.extend(true, {}, data), isMultipleNode: (this.selectedObject._type === "group") ? true : false, category: "internal" };
                if (!this._multipleUndo)
                    this.diagram.addHistoryEntry(entry);
                if (this.selectedObject)
                    ej.datavisualization.Diagram.SvgContext._removePivotPoint(this.selectedObject, this.diagram._adornerSvg, this.diagram._currZoom);
                this.diagram._updateSelectionHandle();
                this.diagram._removeTooltip();
            }
            this._multipleUndo = false;
            //this.diagram._removeTooltip(); 
            base.prototype.mouseup.call(this, evt);
        };
        return RotateTool;
    })(ToolBase);

    ej.datavisualization.Diagram.RotateTool = RotateTool;
    //#endregion 

    //#region PivotTool
    var PivotTool = (function (base) {
        ej.datavisualization.Diagram.extend(PivotTool, base);
        function PivotTool(diagram) {
            base.call(this, "PivotTool", diagram);
            this._mouseOffset = ej.datavisualization.Diagram.Size(0, 0);
        }
        PivotTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.selectedObject = this.diagram.selectionList[0];
        };
        PivotTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);

            if (this.selectedObject) {
                if (!this.inAction) {
                    this.inAction = true;
                }
                else {
                    var delx = this.currentPoint.x - this.previousPoint.x;
                    var dely = this.currentPoint.y - this.previousPoint.y;
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, -this.selectedObject.rotateAngle);
                    var delta = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(delx, dely));
                    var difx = (this.selectedObject.width * this.selectedObject.pivot.x + delta.x) / this.selectedObject.width;
                    var dify = (this.selectedObject.height * this.selectedObject.pivot.y + delta.y) / this.selectedObject.height;
                    this.selectedObject.pivot.x = difx;
                    this.selectedObject.pivot.y = dify;
                    this.selectedObject.offsetX += delx;
                    this.selectedObject.offsetY += dely;
                    this.diagram._updateSelectionHandle();
                }
            }
            this.previousPoint = this.currentPoint;
        };
        PivotTool.prototype._rotate = function (node) {
            var pt = ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY);
            var crntpoint = this.currentPoint;
            var angle = this.FindAngle(pt, crntpoint);
            this.diagram._rotate(node, angle - node.rotateAngle, pt, this.diagram.nameTable);
        };
        PivotTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                this.diagram._updateSelectionHandle();
            }
            base.prototype.mouseup.call(this, evt);
        };
        return PivotTool;
    })(ToolBase);
    ej.datavisualization.Diagram.PivotTool = PivotTool;
    //#endregion

    //#region PanTool
    var PanTool = (function (base) {
        ej.datavisualization.Diagram.extend(PanTool, base);
        function PanTool(diagram) {
            base.call(this, "panTool", diagram);
            this.diagram = diagram;
            this._isMouseDown = false;
            this.cursor = "pointer";
        }
        PanTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            var svgDocument = this.diagram._svg.document;
            var pt = this.diagram._svg.document.createSVGPoint();
            var originalEvent = this.diagram._isTouchEvent(evt);
            pt.x = originalEvent.clientX;
            pt.y = originalEvent.clientY;
            var mousept = pt.matrixTransform(this.diagram._svg.document.getScreenCTM().inverse());
            svgDocument.lastMouseX = mousept.x;
            svgDocument.lastMouseY = mousept.y;
            this._isMouseDown = true;
            return false;
        };

        PanTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (this._isMouseDown && (this.startPoint.x != this.currentPoint.x || this.startPoint.y != this.currentPoint.y)) {
                this.inAction = true;
                var svgDocument = this.diagram._svg.document;
                var pt = this.diagram._svg.document.createSVGPoint();
                var originalEvent = this.diagram._isTouchEvent(evt);
                pt.x = originalEvent.clientX;
                pt.y = originalEvent.clientY;
                var mousept = pt.matrixTransform(this.diagram._svg.document.getScreenCTM().inverse());
                var ex = mousept.x;
                var ey = mousept.y;
                var nx, ny;

                nx = ((ex - svgDocument.lastMouseX));
                ny = ((ey - svgDocument.lastMouseY));
                if (!(this.diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.PannableX))
                    nx = 0;
                if (!(this.diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.PannableY))
                    ny = 0;
                ej.datavisualization.Diagram.ZoomUtil.zoomPan(this.diagram, 1, nx, ny, ej.datavisualization.Diagram.Point(ex, ey));
                svgDocument.lastMouseX = ex;
                svgDocument.lastMouseY = ey;
                return false;
            }
        };
        PanTool.prototype.mouseup = function (evt) {
            this.inAction = false;
            document.onmousemove = null;
            document.onmouseup = null;
            this._isMouseDown = false;
            this.diagram._removeTooltip();
            if (!this.diagram._isEditing && !this.diagram._isDragg)
                this.diagram._endEdit();
            delete this.hoverNode;
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            base.prototype.mouseup.call(this, evt);
        };
        return PanTool;
    })(ToolBase);
    ej.datavisualization.Diagram.PanTool = PanTool;
    //#endregion

    //#region TextToolBase
    var TextToolBase = (function (base) {
        ej.datavisualization.Diagram.extend(TextToolBase, base);
        function TextToolBase(name, diagram) {
            base.call(this, name, diagram);
            this.boundingRect = ej.datavisualization.Diagram.Rectangle();
            this.activeLabel = null;
            this._overNode = "";
            this.cursor = "crosshair";
        }
        TextToolBase.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this._findNodeUnderMouse(evt);
            var overNode = this._getNodeUnderMouse();
            if (overNode) this._overNode = (this.selectedObject && !this.selectedObject.isLane || overNode.isLane) ? overNode.name : "";
            if (this.diagram._isEditing) {
                this.diagram._endEdit();
            }
        };
        TextToolBase.prototype.createNode = function (rect) {

        };
        TextToolBase.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (ej.datavisualization.Diagram.Util.isPageEditable(this.diagram)) {
                if (!this.selectedObject && !ej.datavisualization.Diagram.Geometry.isEmptyPoint(this.startPoint) && !this.diagram._isEditing) {
                    if (!this.inAction) {
                        this.inAction = true;
                        this._initHelper();
                    }
                    else {
                        this._updateHelper();
                    }
                }
            }
        };
        TextToolBase.prototype.mouseup = function (evt) {
            this.activeLabel = null;
            var minHeight = 12;
            if (this.inAction) {
                var rect = this.getBoundingRect(this.startPoint, this.currentPoint);
                this._endAction();
                if (rect.width === 0 || rect.height === 0) {
                    rect.width = 90;
                    rect.height = minHeight;
                }
                this.selectedObject = this.createNode(rect.x + (rect.width / 2), (rect.y + (rect.height / 2)), rect.width, rect.height);
                this.diagram._startEdit(this.selectedObject);
            }
            else {
                var node = this._findNodeUnderMouse(evt);
                if (ej.datavisualization.Diagram.Util.isPageEditable(this.diagram)) {
                    if (node != null && !node.isSwimlane && !node.isLane) {
                        this.selectedObject = node;
                        this.diagram._startEdit(this.selectedObject);
                    }
                    else {
                        var rect = ej.datavisualization.Diagram.Rectangle(this.currentPoint.x - (90 / 2), this.currentPoint.y - (minHeight / 2), 90, minHeight);
                        this._endAction();
                        this.selectedObject = this.createNode(rect.x + (rect.width / 2), rect.y + (rect.height / 2), rect.width, minHeight);
                        this.diagram._startEdit(this.selectedObject);
                    }
                }
            }
            this._overNode = "";
        };
        TextToolBase.prototype.getBoundingRect = function (startPoint, currentPoint) {
            var startPoint = this.snap(this.startPoint);
            var currentPoint = this.snap(this.currentPoint);
            var width = Math.abs(startPoint.x - currentPoint.x);
            var height = Math.abs(startPoint.y - currentPoint.y);
            var x = (startPoint.x > currentPoint.x) ? currentPoint.x : startPoint.x;
            var y = (startPoint.y > currentPoint.y) ? currentPoint.y : startPoint.y;
            return { x: x, y: y, width: width, height: height };
        };
        TextToolBase.prototype._initHelper = function () {
            if (!this._svgHelper) {
                var g = this.diagram._adornerSvg.g();
                this.diagram._adornerLayer.appendChild(g);
                var scale = this.diagram._currZoom;
                var selectionRect = this.diagram._svg.rect({ "id": "helper", "x": this.startPoint.x * scale, "y": this.startPoint.y * scale, "fill": "transparent", "stroke": "gray", "stroke-dasharray": "2 2", "shape-rendering": "crispEdges" });
                g.appendChild(selectionRect);
                g.setAttribute("pointer-events", "none");
                this._svgHelper = g;
            }
        };
        TextToolBase.prototype._updateHelper = function () {
            var startPoint = this.snap(this.startPoint);
            var currentPoint = this.snap(this.currentPoint);
            var helper = this.diagram._adornerSvg.getElementById("helper");
            var width = Math.abs(startPoint.x - currentPoint.x);
            var height = Math.abs(startPoint.y - currentPoint.y);
            var scale = this.diagram._currZoom;
            var x = ((startPoint.x > currentPoint.x) ? currentPoint.x : startPoint.x) * scale;
            var y = ((startPoint.y > currentPoint.y) ? currentPoint.y : startPoint.y) * scale;
            if (helper) {
                this.diagram._adornerSvg.rect({ "id": helper.id, "x": x, "y": y, "width": width * scale, "height": height * scale });
            }
        };
        TextToolBase.prototype._endAction = function () {
            if (this._svgHelper) {
                this.diagram._adornerLayer.removeChild(this._svgHelper);
                this._svgHelper = null;
            }
            base.prototype._endAction.apply(this);
        };
        TextToolBase.prototype._findNodeUnderMouse = function (evt, skip) {
            var obj;
            var foreignObject = this.diagram._isForeignObject(evt.target);
            if (foreignObject)
                evt.target = foreignObject;
            var textElement = evt.target;
            if (textElement.getAttribute("class") == "ej-d-label") {
                var parentNode = $(textElement).parents(".ej-d-node,.ej-d-connector,.ej-d-group")[0];
                obj = this._findObj(parentNode);
                this.activeLabel = this.diagram._findLabelAtPoint(this.currentPoint, obj);
            }
            else {
                var parents = $(evt.target).parents("g");
                if (parents.length > 3) {
                    var element = parents[parents.length - 4];
                    var id = element.getAttribute("id");
                    var type = element.getAttribute("class");
                    if (type) {
                        if (type === "ej-d-node" || type === "ej-d-group") {
                            obj = this.diagram._findNode(id);
                            var curlabel = this.diagram._findLabelAtPoint(this.currentPoint, obj);
                            this.activeLabel = curlabel;
                        }
                        else if (type === "ej-d-connector") {
                            obj = this.diagram._findConnector(id);
                            var curlabel = this.diagram._findLabelAtPoint(this.currentPoint, obj);
                            this.activeLabel = curlabel;
                        }
                    }
                }
            }
            return obj;
        };
        return TextToolBase;
    })(ej.datavisualization.Diagram.ToolBase);
    ej.datavisualization.Diagram.TextToolBase = TextToolBase;
    //#endregion

    //#region TextTool
    var TextTool = (function (base) {
        ej.datavisualization.Diagram.extend(TextTool, base);
        function TextTool(diagram) {
            base.call(this, "textTool", diagram);
        }
        TextTool.prototype.createNode = function (x, y, width, height) {
            var textnode = { "offsetX": x, "offsetY": y, "width": width, "height": height, "parent": this._overNode, "labels": [], "ports": [], "type": "text" };
            var node = this.diagram._getNewNode($.extend(true, {}, textnode, this.diagram.model.drawType));
            if (this.diagram.model.drawType.name) {
                node.name = this.diagram.model.drawType.name + ej.datavisualization.Diagram.Util.randomId();
            }
            else {
                node.name = "text" + ej.datavisualization.Diagram.Util.randomId();
            }
            if (node._type = "text") node._type = "node";
            var parent = this.diagram.nameTable[node.parent];
            if (parent && parent.container)
                this._updateMargin(node, parent);
            return node;
        };
        return TextTool;
    })(ej.datavisualization.Diagram.TextToolBase);
    ej.datavisualization.Diagram.TextTool = function (diagram) {
        return new TextTool(diagram);
    };
    //#endregion

    //#region PhaseTool
    var PhaseTool = (function (base) {
        ej.datavisualization.Diagram.extend(PhaseTool, base);
        function PhaseTool(diagram) {
            base.call(this, "phase", diagram);
            this.selectedSeperator = null;
            this._svgHelper = null;
        }
        PhaseTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.inAction = true;
            this.diagram._selectedGNode = null;
        };
        PhaseTool.prototype._getSeperator = function (evt) {
            if ($(evt.target).parents("g").first()[0]) {
                var id = $(evt.target).parents("g").first()[0].id;
                if (id) {
                    return this._getphase(id.split('_phase_g')[0]);
                }
            }
        };
        PhaseTool.prototype._removePhasehelper = function () {
            ej.datavisualization.Diagram.SvgContext._removePhasehelper(this.diagram);
        };
        PhaseTool.prototype._outOfBoundsDrag = function (node) {
            var diffX = this.currentPoint.x - this.startPoint.x;
            var diffY = this.currentPoint.y - this.startPoint.y;
            if (node && ej.datavisualization.Diagram.Util.canMoveOutofBoundary(this.diagram)) {
                var size = this._getPageBounds();
                var parent = this.diagram.nameTable[node.parent];
                if (parent) {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(parent)
                    if (!this.diagram._selectedSymbol && (bounds.right + diffX >= size.width || node.offset + diffX < size.x)) {
                        this.updateCursor("not-allowed")
                        return false
                    }
                    if (!this.diagram._selectedSymbol && (bounds.bottom + diffY >= size.height || node.offset + diffY < size.y)) {
                        this.updateCursor("not-allowed")
                        return false
                    }
                }
                node.orientation == "horizontal" ? this.updateCursor("e-resize") : this.updateCursor("n-resize");
            }


            return true
        };
        PhaseTool.prototype._updatePhasehelper = function (phase) {
            var bounds = this._bounds ? jQuery.extend(true, {}, this._bounds) : this.diagram._getPhaseBounds(phase), dx, dy;
            var ptSrt = this.startPoint;
            var ptCur = this.currentPoint;
            var horizontalsnap = { snapped: false, offset: 0, left: false, right: false };
            var verticalsnap = { snapped: false, offset: 0, top: false, bottom: false };
            this.selectedObject = this.diagram.nameTable[this.selectedSeperator.parent];
            this.initialBounds = { width: this.selectedObject.width, height: this.selectedObject.height, y: this.selectedObject.offsetY, x: this.selectedObject.offsetX };

            if (phase.orientation === "horizontal") {
                dx = ptCur.x - ptSrt.x;
                dx = this._snapRight(horizontalsnap, verticalsnap, dx, 0, this.selectedObject, false);
                dy = 0;
                this.diagram._comparePropertyValues(phase, "offset", { offset: phase.offset + dx }, true);
            }
            else {
                dx = 0;
                dy = ptCur.y - ptSrt.y;
                dy = this._snapBottom(horizontalsnap, verticalsnap, 0, dy, this.selectedObject, false);
                this.diagram._comparePropertyValues(phase, "offset", { offset: phase.offset + dy }, true);
            }
            if (bounds) {
                bounds.width += dx;
                bounds.height += dy;
                this._helperBounds = $.extend(true, {}, bounds);
                ej.datavisualization.Diagram.SvgContext._updatePhaseHelper(this.diagram, phase, bounds);
            }
        };
        PhaseTool.prototype._drawPhasehelper = function (phase) {
            var bounds = this.diagram._getPhaseBounds(phase);
            if (phase && bounds)
                ej.datavisualization.Diagram.SvgContext._phasehelper(this.diagram, phase, bounds);
        };
        PhaseTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            if (this._outOfBoundsDrag(this.selectedSeperator)) {
                if (!this.selectedSeperator) {
                    if (this.inAction) {
                        var phase = this._getSeperator(evt);
                        if (phase && !this.selectedSeperator) {
                            this.selectedSeperator = phase;
                        }
                    }
                    this._drawPhasehelper(this.selectedSeperator);
                    if (this.diagram.selectionList[0] && this.diagram.selectionList[0].type != "phase") {
                        this.diagram._clearSelection(true);
                        this.diagram.addSelection(this.selectedSeperator, true);
                    }
                    else
                        this.diagram.addSelection(this.selectedSeperator, true);
                }
                else if (this.selectedSeperator) {
                    if (!this._bounds)
                        this._bounds = this.diagram._getPhaseBounds(this.selectedSeperator);
                    this._updatePhasehelper(this.selectedSeperator);
                }
                this.previousPoint = this.currentPoint;
            }
        };
        PhaseTool.prototype._getPadding = function (swimlane) {
            var xpad = 20, ypad = 20;
            var laneStack = this.diagram.nameTable[this.diagram._getChild(swimlane.children[swimlane.children.length - 1])];
            if (laneStack) {
                var lanes = laneStack.children;
                if (lanes.length > 0) {
                    var lane = this.diagram.nameTable[this.diagram._getChild(lanes[0])];
                    if (lane && lane.isLane) {
                        xpad = lane.paddingRight;
                        ypad = lane.paddingBottom;
                    }
                }
            }
            return { x: xpad, y: ypad };
        };
        PhaseTool.prototype.mouseup = function (evt) {
            var phase = this._getSeperator(evt);

            if (this.diagram.selectionList.length > 0 && phase && this.diagram.selectionList[0].name != phase.name)
                this.diagram._clearSelection(true);
            if (phase && !this.selectedSeperator) {
                this.selectedSeperator = phase;
                this.diagram.addSelection(this.selectedSeperator, true);
            }
            else {
                if (this.selectedSeperator) {
                    var swimlaneName = this.selectedSeperator.parent.split('phaseStack')[0];
                    if (swimlaneName) {
                        var swimlane = this.diagram.nameTable[swimlaneName];
                        if (swimlane && this._helperBounds) {
                            if (swimlane.isSwimlane) {
                                var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(this.diagram, swimlane);
                                var prevOffset = 0;
                                var index = phases.indexOf(this.selectedSeperator.name);
                                if (index > 0) {
                                    prevOffset = this.diagram.nameTable[this.diagram._getChild(phases[index - 1])].offset;
                                }
                                else {
                                    if (swimlane.orientation === "horizontal")
                                        prevOffset = 50;
                                }

                                var undoObject = jQuery.extend(true, {}, this.selectedSeperator);
                                if (swimlane.orientation === "horizontal")
                                    this.diagram._updatePhase({ name: this.selectedSeperator.name, offset: prevOffset + this._helperBounds.width })
                                else
                                    this.diagram._updatePhase({ name: this.selectedSeperator.name, offset: prevOffset + this._helperBounds.height })
                                var entry = { type: "phasepositionchanged", undoObject: jQuery.extend(true, {}, undoObject), redoObject: jQuery.extend(true, {}, jQuery.extend(true, {}, this.selectedSeperator)), category: "internal" };
                                if (!this._multipleUndo)
                                    this.diagram.addHistoryEntry(entry);
                                this.diagram.addSelection(this.selectedSeperator, true);
                            }
                        }
                    }
                }
            }

            this._removePhasehelper();
            this._bounds = null;
            this.inAction = false;
            this.selectedSeperator = null;
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            base.prototype.mouseup.call(this, evt);
        };
        PhaseTool.prototype._getOuterPhaseNodes = function (group, isVertical) {
            if (group) {
                var stack = this.diagram.nameTable[this.diagram._getChild(group.children[2])];
                var tchildren = [];
                var tchild = null;
                var bounds = null;
                var laneChild = null
                for (var i = 0; stack && i < stack.children.length; i++) {
                    var lane = this.diagram.nameTable[this.diagram._getChild(stack.children[i])];
                    if (lane && lane.children && lane.children.length > 1) {
                        for (var j = 0; j < lane.children.length; j++) {
                            laneChild = this.diagram.nameTable[this.diagram._getChild(lane.children[j])];
                            if (laneChild) {
                                bounds = ej.datavisualization.Diagram.Util.bounds(laneChild);
                                if (isVertical) {
                                    if (bounds.y > ((group.offsetY - group.height / 2) + this.selectedSeperator.offset))
                                        tchildren.push(laneChild);
                                }
                                else {
                                    if (bounds.x > ((group.offsetX - group.width / 2) + this.selectedSeperator.offset))
                                        tchildren.push(laneChild);
                                }
                            }
                        }
                    }
                }
            }
            return tchildren;
        };
        return PhaseTool;
    })(ToolBase);
    ej.datavisualization.Diagram.PhaseTool = PhaseTool;
    //#endregion

    //#region LabelMoveTool
    var LabelMoveTool = (function (base) {
        ej.datavisualization.Diagram.extend(LabelMoveTool, base);
        function LabelMoveTool(diagram) {
            base.call(this, "labelMove", diagram);
            this._isMouseDown = false;
            this.undoObject = [];
            this.inAction = false;
        }
        LabelMoveTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this._isMouseDown = true;
            if (evt && (evt.target.className == "ej-d-label" || evt.target.parentNode.getAttribute("class") === "ej-d-label")) {
                var node = this.diagram._nodeUnderMouse;
                var id = evt.target.id;
                if (!id) id = evt.target.parentNode.id;
                var labels = id.split("_");
                this.selectedObject = this.diagram._findLabel(node, labels[1]);
                if (!this.selectedObject) this.selectedObject = node.labels[0];
                if (!node.segments) {
                    this.selectedObject.width = this.selectedObject.width > node.width ? this.selectedObject.width : node.width;
                    this.selectedObject.height = this.selectedObject.height > node.height ? this.selectedObject.height : node.height;
                }
                if (this.diagram.selectionList[0] != this.selectedObject)
                    this.diagram._clearSelection(true);
            }
        };
        LabelMoveTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (this.selectedObject && this.selectedObject._parent) {
                var node = this.diagram.findNode(this.selectedObject._parent);
                if (this._isMouseDown && !this.inAction) {
                    if (!this.inAction && this.selectedObject) {
                        this.inAction = true;
                        var childTable = {};
                        var data = $.extend(true, {}, { "childTable": childTable, "node": node, "activeLabel": this.selectedObject });
                        this.undoObject = jQuery.extend(true, {}, data);
                    }
                }
                if (this._isMouseDown && this.selectedObject && ej.datavisualization.Diagram.Util.enableLayerOption(this.selectedObject, "lock", this.diagram) && ((ej.datavisualization.Diagram.Util.canSelect(this.selectedObject) && ej.datavisualization.Diagram.Util.canMove(this.selectedObject)) || ej.datavisualization.Diagram.Util.canMoveLabel(node)) && !this.diagram._isEditing) {

                    if (!this.inAction)
                        this.inAction = true;
                    this.updateCursor("move");
                    this._updateSelection();
                    this._updateLabelXY(this.selectedObject, this.previousPoint, this.currentPoint);
                    this.diagram._updateSelectionHandle(true);
                }
            }
            this.previousPoint = this.currentPoint;
        };
        LabelMoveTool.prototype.mouseup = function (evt, doc) {
            if (this.selectedObject && this.selectedObject._parent) {
                var node = this.diagram.findNode(this.selectedObject._parent);
                if ((ej.datavisualization.Diagram.Util.canSelect(this.selectedObject) && ej.datavisualization.Diagram.Util.enableLayerOption(this.selectedObject, "lock", this.diagram) && ej.datavisualization.Diagram.Util.canMove(this.selectedObject)) || ej.datavisualization.Diagram.Util.canMoveLabel(node)) {
                    this.diagram._addSelection(this.selectedObject, true);
                    if (this.inAction) {
                        this.inAction = false;
                        var childTable = {};
                        var data = $.extend(true, {}, { "childTable": childTable, "node": node, "label": this.selectedObject });
                        var entry = { type: "labelpositionchanged", undoObject: this.undoObject, redoObject: jQuery.extend(true, {}, data), category: "internal", activeLabel: this.selectedObject };
                        this.diagram.addHistoryEntry(entry);
                    }
                }
            }
            delete this._isMouseDown;
            base.prototype.mouseup.call(this, evt);
        };
        LabelMoveTool.prototype._updateLabelXY = function (label, startPoint, endPoint) {
            var difx = endPoint.x - startPoint.x;
            var dify = endPoint.y - startPoint.y;
            var node = this.diagram.findNode(label._parent);
            if (!node.segments) {
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, -node.rotateAngle);
                var diff = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(difx, dify)); difx = diff.x; dify = diff.y;
            }

            if (node.segments && label.relativeMode == "segmentpath" && ej.datavisualization.Diagram.Util.isAllowDragLimit(node))
                this._updateLabelOffset(node, label, difx, dify);
            else
                this.diagram.translateLabel(node, label, difx, dify);
        };

        LabelMoveTool.prototype._updateSelection = function () {
            if (!this.diagram._selectionContains(this.selectedObject)) {
                this.diagram._clearSelection(true);
                this.diagram._addSelection(this.selectedObject, true);
            }
        };
        LabelMoveTool.prototype._updateLabelOffset = function (node, label, dx, dy, newOffset, width, height) {
            var minDistance = { minDistance: null };
            var prev = null;
            var pointLength = 0;
            if (node.segments && label.relativeMode === "segmentpath") {
                var clnLabel = $.extend(true, {}, label);
                var textBounds, labelBounds = { x: 0, y: 0, width: 0, height: 0, centerX: 0, centerY: 0 }, curLoc, _intialDelta, currentPoint, conPoints, intersetingPts, newOffset, totalLength, intersectingOffset, distance;
                if (!newOffset) {
                    labelBounds = ej.datavisualization.Diagram.Util.getLabelbounds(this.diagram, node, label);
                    var curZoomfactor = this.diagram._currZoom;
                    labelBounds.x = (labelBounds.x) + dx;
                    labelBounds.y = (labelBounds.y) + dy;
                    if (this.diagram.model.labelRenderingMode === "svg") {
                        curLoc = { x: labelBounds.centerX + dx, y: labelBounds.centerY + dy }
                    }
                    else {
                        curLoc = { x: (labelBounds.x + (labelBounds.width / 2)), y: labelBounds.y + (labelBounds.height / 2) };
                    }
                    _intialDelta = { x: this.currentPoint.x - curLoc.x, y: this.currentPoint.y - curLoc.y };
                    currentPoint = { x: this.currentPoint.x - _intialDelta.x, y: this.currentPoint.y - _intialDelta.y };
                }
                else
                    currentPoint = newOffset;
                conPoints = ej.datavisualization.Diagram.Util.getPoints(node);
                intersetingPts = this._getInterceptWithSegment(currentPoint, conPoints);
                newOffset = this._getRelativeOffset(currentPoint, conPoints, minDistance);
                totalLength = this._getLengthFromListOfPoints(conPoints);
                var nodebounds = ej.datavisualization.Diagram.Util.bounds(node)
                if (intersetingPts.length > 0) {
                    distance = { minDistance: null };
                    intersectingOffset = this._getRelativeOffset(currentPoint, intersetingPts, distance);
                    if (minDistance.minDistance != null && distance.minDistance < minDistance.minDistance)
                        newOffset = intersectingOffset;
                    if (newOffset) {
                        var p, bounds, offset;
                        for (p in conPoints) {
                            if (prev != null) {
                                bounds = ej.datavisualization.Diagram.Geometry.rect([prev, conPoints[p]]);
                                if (ej.datavisualization.Diagram.Geometry.containsPoint(bounds, newOffset)) {
                                    pointLength += ej.datavisualization.Diagram.Util.findLength(prev, newOffset);
                                    break;
                                }
                                else
                                    pointLength += ej.datavisualization.Diagram.Util.findLength(prev, conPoints[p]);
                            }
                            prev = conPoints[p];
                        }
                        offset = ej.datavisualization.Diagram.Point(pointLength / totalLength, 0);
                    }
                    this._updateLabelMargin(node, label, offset, currentPoint, dx, dy, width, height);
                }
                else {
                    this._updateLabelMargin(node, label, null, currentPoint, dx, dy);
                }
                this.diagram._comparePropertyValues(node, "labels", clnLabel, true);
            }
        };
        LabelMoveTool.prototype._updateLabelMargin = function (node, label, offset, tempPt, dx, dy, width, height) {
            offset = offset ? offset : { x: label.segmentOffset, y: 0 };
            if (label && offset) {
                var draggableBounds, contentDimension, angle, point, length, line;
                var dragLimit = label.dragLimit;
                line = ej.datavisualization.Diagram.Util.getPoints(node);
                length = this._getLengthFromListOfPoints(line)
                if (offset.x > 0 && offset.x < 1) {
                    angle = { angle: null };
                    point = this._getPointAtLength(length * offset.x, line, angle);
                    var curZoomfactor = this.diagram._currZoom
                    var labelBounds = ej.datavisualization.Diagram.Util.getLabelbounds(this.diagram, node, label);
                    var contentDimension = { x: 0, y: 0, width: 0, height: 0 };
                    contentDimension = ej.datavisualization.Diagram.Util.getLabelbounds(this.diagram, node, label, true);
                    contentDimension.x = (contentDimension.x / curZoomfactor) + dx;
                    contentDimension.y = (contentDimension.y / curZoomfactor) + dy;
                    contentDimension.width = contentDimension.width / curZoomfactor;
                    contentDimension.height = contentDimension.height / curZoomfactor;
                    draggableBounds = {
                        x: point.x - dragLimit.left - contentDimension.width / 2,
                        y: point.y - dragLimit.top - contentDimension.height / 2,
                        width: dragLimit.left + dragLimit.right + contentDimension.width,
                        height: dragLimit.top + dragLimit.bottom + contentDimension.height
                    };
                    if (ej.datavisualization.Diagram.Geometry.containsPoint(draggableBounds, tempPt)) {
                        tempPt = tempPt;
                    }
                    else {
                        var line1, lineIntersects, i;
                        line1 = [point, tempPt];
                        lineIntersects = this._boundsInterSects(line1, draggableBounds, false);
                        for (i in lineIntersects) {
                            var ptt = lineIntersects[i]
                            tempPt = ptt;
                        }
                    }
                    var cursorLimit = this._checkCursorLimit(label, point, tempPt, contentDimension);
                    label.margin = { left: cursorLimit.x ? tempPt.x - point.x : label.margin.left, top: cursorLimit.y ? tempPt.y - point.y : label.margin.top, right: 0, bottom: 0 };
                    label.segmentOffset = offset.x;
                    if (width && height) {
                        label.width = width;
                        label.height = height;
                    }
                    ej.datavisualization.Diagram.DiagramContext.updateLabel(node, label, this.diagram);
                }
                else {
                }
            }
        };
        LabelMoveTool.prototype._getInterceptWithSegment = function (currenPosition, conPoints) {
            var intercepts = [], tarAngle, srcAngle, imgLine, segemnt, i, maxLength;
            maxLength = ej.datavisualization.Diagram.Util.findLength(ej.datavisualization.Diagram.Point(0, 0), ej.datavisualization.Diagram.Point(this.diagram._viewPort.width, this.diagram._viewPort.height));
            for (i = 1; i < conPoints.length; i++) {
                segemnt = [conPoints[i - 1], conPoints[i]];
                imgLine = [];
                srcAngle = Math.round(ej.datavisualization.Diagram.Util.findAngle(segemnt[0], segemnt[1]) % 360, 2);
                tarAngle = Math.round(ej.datavisualization.Diagram.Util.findAngle(segemnt[1], segemnt[0]) % 360, 2);
                var angleAdd = (srcAngle > 0 && srcAngle <= 90) || (srcAngle > 180 && srcAngle <= 270) ? 90 : -90;

                imgLine.push(ej.datavisualization.Diagram.Geometry.transform(currenPosition, srcAngle + angleAdd, maxLength));
                imgLine.push(ej.datavisualization.Diagram.Geometry.transform(currenPosition, tarAngle + angleAdd, maxLength));

                var intercept = this._intersect(segemnt, imgLine, false);
                for (var m in intercept) {
                    intercepts.push(intercept[m]);
                }
            }
            return intercepts;
        };
        LabelMoveTool.prototype._getRelativeOffset = function (currentPosition, points, minDistance) {
            var newOffset, distance, pt, i;
            for (i = 0; i < points.length; i++) {
                pt = points[i];
                distance = Math.round(Math.sqrt(Math.pow((currentPosition.x - pt.x), 2) + Math.pow((currentPosition.y - pt.y), 2)));
                if (minDistance.minDistance == null || Math.min(Math.abs(minDistance.minDistance), Math.abs(distance)) == Math.abs(distance)) {
                    newOffset = pt;
                    minDistance.minDistance = distance;
                }
            }
            return newOffset;
        };
        LabelMoveTool.prototype._getLengthFromListOfPoints = function (list) {
            var length = 0, start, i;
            start = list[0];
            for (i in list) {
                length += ej.datavisualization.Diagram.Util.findLength(start, list[i]);
                start = list[i];
            }
            return length;
        };
        LabelMoveTool.prototype._getPointAtLength = function (length, pts, angle) {
            angle.angle = 0;
            var run = 0, pre = null, found = ej.datavisualization.Diagram.Point(0, 0), i, pt;
            for (i in pts) {
                pt = pts[i]
                if (!pre) {
                    pre = pt;
                    continue;
                }
                else {
                    var l = ej.datavisualization.Diagram.Util.findLength(pre, pt), r, deg, x, y;
                    if (run + l >= length) {
                        r = length - run;
                        deg = ej.datavisualization.Diagram.Util.findAngle(pre, pt);
                        x = r * Math.cos(deg * Math.PI / 180);
                        y = r * Math.sin(deg * Math.PI / 180);
                        found = ej.datavisualization.Diagram.Point(pre.x + x, pre.y + y);
                        angle.angle = deg;
                        break;
                    }
                    else {
                        run += l;
                    }
                }
                pre = pt;
            }
            return found;
        };
        LabelMoveTool.prototype._checkCursorLimit = function (label, point, tempPt, contentDimension) {
            var x = false, y = false;
            if ((tempPt.x >= (point.x - label.dragLimit.left - (contentDimension.width / 2))) && (tempPt.x <= point.x + label.dragLimit.right + (contentDimension.width / 2)))
                x = true
            if ((tempPt.y >= (point.y - label.dragLimit.top - (contentDimension.height / 2))) && (tempPt.y <= point.y + label.dragLimit.bottom + (contentDimension.height / 2)))
                y = true;
            return { x: x, y: y };
        };
        LabelMoveTool.prototype._boundsInterSects = function (polyLine, bounds, self) {
            var intersect = []
            if (bounds) {
                var polyLine2 = [
                    { x: bounds.x, y: bounds.y },
                    { x: bounds.x + bounds.width, y: bounds.y },
                    { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
                    { x: bounds.x, y: bounds.y + bounds.height },
                    { x: bounds.x, y: bounds.y }
                ];
                intersect = this._intersect(polyLine, polyLine2, intersect);
            }
            return intersect;
        };
        LabelMoveTool.prototype._intersect = function (polyLine1, polyLine2, self) {
            var intersect = [];
            for (var i = 0; i < polyLine1.length - 1; i++) {
                for (var j = 0; j < polyLine2.length - 1; j++) {
                    var p = ej.datavisualization.Diagram.Util.interSect2(polyLine1[i], polyLine1[i + 1], polyLine2[j], polyLine2[j + 1]);
                    if (!ej.datavisualization.Diagram.Geometry.isEqualPoint(ej.datavisualization.Diagram.Point(0, 0), p)) {
                        intersect.push(p);
                    }
                }

                if (self && polyLine2.length >= 1) { }
            }
            return intersect;
        };
        LabelMoveTool.prototype.getCenterOfLabel = function (label, offset, bounds) {
            var center = ej.datavisualization.Diagram.Point(0, 0);
            if (this.selectedObject && this.selectedObject._parent) {
                var points = ej.datavisualization.Diagram.Util.getPoints(this.diagram.findNode(this.selectedObject._parent));
                var length = this._getLengthFromListOfPoints(points);
                var center = this._getPointAtLength(length * offset, points, {});
                center.x += (label.margin.left - label.margin.right);
                center.y += (label.margin.top - label.margin.bottom);
            }
            return center;
        };
        return LabelMoveTool;
    })(ToolBase);
    ej.datavisualization.Diagram.LabelMoveTool = LabelMoveTool;

    var LabelResizeTool = (function (base) {
        ej.datavisualization.Diagram.extend(LabelResizeTool, base);
        function LabelResizeTool(diagram) {
            base.call(this, "labelResize", diagram);
            this._resizeDirection = null;
            this.undoObject = null;
            this._mouseDown = false;
        };
        LabelResizeTool.prototype.mousedown = function (evt) {
            ej.datavisualization.Diagram.SnapUtil._removeGuidelines(this.diagram);
            base.prototype.mousedown.call(this, evt);
            this._mouseDown = true;
            this.selectedObject = this.diagram.selectionList[0];
        };
        LabelResizeTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (!this.inAction && this.diagram.selectionList[0] && this._mouseDown) {
                this.selectedObject = this.diagram.selectionList[0];
                var childTable = {};
                var node = this.diagram.findNode(this.selectedObject._parent);
                var data = $.extend(true, {}, { "childTable": childTable, "node": node, "activeLabel": this.selectedObject });
                this.undoObject = jQuery.extend(true, {}, data);
                this._resizeDirection = evt.target.getAttribute("class");
                var labelPosition = this._getLabelCenter(this.selectedObject);
                this.initialBounds = { width: this.selectedObject.width, height: this.selectedObject.height, y: labelPosition.y, x: labelPosition.x };
                this.inAction = true;
            }
            if (this.selectedObject && this.inAction) {
                if (ej.datavisualization.Diagram.Util.canResize(this.selectedObject)) {
                    this._updateSize(this.selectedObject, this.previousPoint, this.currentPoint);
                    ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                    this.diagram._updateSelectionHandle(true);
                }
            }
            this.previousPoint = this.currentPoint;
        };
        LabelResizeTool.prototype.mouseup = function (evt) {
            this._mouseDown = false;
            if (this.inAction && this.selectedObject) {
                this.inAction = false;
                var childTable = {};
                var data = $.extend(true, {}, { "childTable": childTable, "node": this.diagram.findNode(this.selectedObject._parent), "label": this.selectedObject });
                var entry = { type: "labelsizechanged", undoObject: this.undoObject, redoObject: jQuery.extend(true, {}, data), isMultipleNode: (this.selectedObject._type === "group") ? true : false, category: "internal", activeLabel: this.selectedObject };
                this.diagram.addHistoryEntry(entry);
                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                this.diagram._updateSelectionHandle(true);
            }
            base.prototype.mouseup.call(this, evt);
        };
        LabelResizeTool.prototype._updateSize = function (shape, startPoint, endPoint) {
            var node = this.diagram.findNode(shape._parent);
            var deltaWidth, deltaHeight;
            var matrix = ej.Matrix.identity();
            var difx = this.currentPoint.x - this.startPoint.x;
            var dify = this.currentPoint.y - this.startPoint.y;
            var rotateAngle = this.diagram._findLabelRotateAngle(shape);
            var center = this._getLabelCenter(shape);
            var pivot = this._resizeObject(shape, difx, dify);
            deltaWidth = pivot.width;
            deltaHeight = pivot.height;
            if (deltaWidth < 0) deltaWidth = 1;
            if (deltaHeight < 0) deltaHeight = 1;
            if ((deltaWidth && deltaWidth != 1) || (deltaHeight && deltaHeight != 1)) {
                var newMat = ej.Matrix.identity();
                ej.Matrix.rotate(newMat, -node.rotateAngle, node.offsetX, node.offsetY);
                var bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                ej.Matrix.rotate(matrix, -rotateAngle, pivot.x, pivot.y);
                ej.Matrix.scale(matrix, deltaWidth, deltaHeight, pivot.x, pivot.y);
                ej.Matrix.rotate(matrix, rotateAngle, pivot.x, pivot.y);
                var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(center.x, center.y));
                var height = shape.height * deltaHeight;
                var width = shape.width * deltaWidth;
                if (node.segments && shape.relativeMode == "segmentpath") {
                    this.diagram.tools['labelMove']._updateLabelOffset(node, shape, 0, 0, newPosition, width, height);
                }
                else {
                    if (!node.segments)
                        newPosition = ej.Matrix.transform(newMat, newPosition);
                    newPosition.x = newPosition.x - shape.margin.left + shape.margin.right;
                    newPosition.y = newPosition.y - shape.margin.top + shape.margin.bottom;
                    var size = this._findLabelAtNode(node, shape);

                    if (shape.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Top) newPosition.y -= size.height / 2;
                    else if (shape.verticalAlignment == ej.datavisualization.Diagram.VerticalAlignment.Bottom) newPosition.y += size.height / 2;
                    if (shape.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Left) newPosition.x -= size.width / 2;
                    else if (shape.horizontalAlignment == ej.datavisualization.Diagram.HorizontalAlignment.Right) newPosition.x += size.width / 2;

                    var offsetx = bounds.width / (newPosition.x - bounds.x);
                    var offsety = bounds.height / (newPosition.y - bounds.y);
                    if (width > 1) {
                        shape.width = width;
                        shape.offset.x = 1 / offsetx;
                    }
                    if (height > 1) {
                        shape.height = height;
                        shape.offset.y = 1 / offsety;
                    }
                }
            }
        };
        return LabelResizeTool;
    })(ToolBase);
    ej.datavisualization.Diagram.LabelResizeTool = LabelResizeTool;

    var LabelRotateTool = (function (base) {
        ej.datavisualization.Diagram.extend(LabelRotateTool, base);
        function LabelRotateTool(diagram) {
            base.call(this, "labelRotate", diagram);
            this.inAction = false;
            this.undoObject = null;
        }
        LabelRotateTool.prototype.mousedown = function (evt) {
            base.prototype.mousedown.call(this, evt);
            this.selectedObject = this.diagram.selectionList[0];
            var childTable = {};
            var node = this.diagram.findNode(this.selectedObject._parent);
            var data = $.extend(true, {}, { "childTable": childTable, "node": node, "activeLabel": this.selectedObject });
            this.undoObject = jQuery.extend(true, {}, data);
        };
        LabelRotateTool.prototype.mousemove = function (evt) {
            base.prototype.mousemove.call(this, evt);
            if (this.selectedObject && ej.datavisualization.Diagram.Util.canRotate(this.selectedObject)) {
                if (!this.inAction)
                    this.inAction = true;
                this._rotate(this.selectedObject);
                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                this.diagram._updateSelectionHandle(true);
            }
            this.previousPoint = this.currentPoint;
        };
        LabelRotateTool.prototype._rotate = function (label) {
            var matrix = ej.Matrix.identity();
            var rotateAngle, pivot;
            rotateAngle = this.diagram._findLabelRotateAngle(label);
            var pivot = this._getLabelCenter(label);
            var angle = ej.datavisualization.Diagram.Geometry.findAngle(ej.datavisualization.Diagram.Point(pivot.x, pivot.y), this.currentPoint) + 90;
            angle = ej.datavisualization.Diagram.SnapUtil._snapAngle(this.diagram, angle) - (rotateAngle);
            label.rotateAngle += angle;
            label.rotateAngle %= 360;
            if (label.rotateAngle < 0) label.rotateAngle += 360;
        };
        LabelRotateTool.prototype.mouseup = function (evt) {
            if (this.inAction) {
                this.inAction = false;
                this._rotate(this.selectedObject);
                ej.datavisualization.Diagram.DiagramContext.update(this.selectedObject, this.diagram);
                var childTable = {};
                var data = $.extend(true, {}, { "childTable": childTable, "node": this.diagram.findNode(this.selectedObject._parent), "activeLabel": this.selectedObject });
                var entry = { type: "labelrotationchanged", undoObject: this.undoObject, redoObject: jQuery.extend(true, {}, data), category: "internal", activeLabel: this.selectedObject };
                this.diagram.addHistoryEntry(entry);
                if (this.selectedObject)
                    ej.datavisualization.Diagram.SvgContext._removePivotPoint(this.selectedObject, this.diagram._adornerSvg, this.diagram._currZoom);
                this.diagram._updateSelectionHandle();
            }
            base.prototype.mouseup.call(this, evt);
        };
        return LabelRotateTool;
    })(ToolBase);
    ej.datavisualization.Diagram.LabelRotateTool = LabelRotateTool;

})(jQuery, Syncfusion);