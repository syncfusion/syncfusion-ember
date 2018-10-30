/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej) {
    "use strict";
    //#region HitTesting
    ej.datavisualization.Diagram.HitTesting = {
        _getResizeHandleCenter: function (shape, position, scale) {
            if (!scale) scale = 1;
            var corners = this.bounds(shape);
            var center = ej.datavisualization.Diagram.Point(0, 0);
            switch (position) {
                case "topleft":
                    center = corners.topLeft;
                    break;
                case "topcenter":
                    center = corners.top;
                    break;
                case "topright":
                    center = corners.topRight;
                    break;
                case "middleleft":
                    center = corners.left;
                    break;
                case "middleright":
                    center = corners.right;
                    break;
                case "bottomleft":
                    center = corners.bottomLeft;
                    break;
                case "bottomcenter":
                    center = corners.bottom;
                    break;
                case "bottomright":
                    center = corners.bottomRight;
                    break;
                case "pivot":
                    center = ej.datavisualization.Diagram.Point(shape.offsetX, shape.offsetY);
                    break;
                case "rotate":
                    var thumbHeight = 20;
                    var dist = 20 / scale; //distance between element top and rotator thumb
                    var pt = ej.datavisualization.Diagram.Point(shape.offsetX, (shape.offsetY - shape.height * shape.pivot.y) - thumbHeight / 2 - dist);
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, shape.rotateAngle, shape.offsetX, shape.offsetY);
                    center = ej.Matrix.transform(matrix, pt);
                    break;
            }
            return center;
        },
        findResizeHandleAtPoint: function (node, point) {
            var resizeDirection = null;
            if (node) {
                var center;
                var success;
                var directions = ["topleft", "topcenter", "topright", "middleleft", "middleright", "bottomleft", "bottomcenter", "bottomright"];
                for (var i = 0, len = directions.length; i < len; i++) {
                    center = this._getResizeHandleCenter(node, directions[i]);
                    if (center !== ej.datavisualization.Diagram.Point(0, 0)) {
                        success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(center.x, center.y), 7); // right now 7 is default handle radius size, need to give as constant variable
                        if (success) {
                            resizeDirection = directions[i];
                            break;
                        }
                    }
                }
            }
            return resizeDirection;
        },
        findRotationHandleAtPoint: function (node, point, scale) {
            var center = this._getResizeHandleCenter(node, "rotate", scale);
            var success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(center.x, center.y), 10); // right now 7 is default handle radius size, need to give as constant variable
            if (success) {
                return true;
            }
            return false;
        },
        findPivotHandleAtPoint: function (node, point) {
            var center = this._getResizeHandleCenter(node, "pivot");
            var success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(center.x, center.y), 7); // right now 7 is default handle radius size, need to give as constant variable
            if (success) {
                return true;
            }
            return false;
        },
        findEndPointHandleAtPoint: function (connector, point) {
            var endPointHandle = null;
            if (connector) {
                var success;
                var points = connector.line.points;
                var pt = points[points.length - 1];
                success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(pt.x, pt.y), 7); // right now 7 is default handle radius size, need to give as constant variable
                if (success) {
                    endPointHandle = "targetEndPoint";
                }
                if (!success) {
                    pt = points[0];
                    success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(pt.x, pt.y), 7); // right now 7 is default handle radius size, need to give as constant variable
                    if (success) {
                        endPointHandle = "sourceEndPoint";
                    }
                }
                if (!success && connector.line.type === "bezier") {
                    pt = connector.line._point1;
                    success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(pt.x, pt.y), 7); // right now 7 is default handle radius size, need to give as constant variable
                    if (success) {
                        endPointHandle = "bezierpoint1";
                    }
                    if (!success) {
                        var pt1 = connector.line._point2;
                        success = ej.datavisualization.Diagram.Geometry.checkPointOnCircle(point, ej.datavisualization.Diagram.Point(pt1.x, pt1.y), 7); // right now 7 is default handle radius size, need to give as constant variable
                        if (success) {
                            endPointHandle = "bezierpoint2";
                        }
                    }
                }
            }
            return endPointHandle;
        }
    };
    //#endregion

    ej.datavisualization.Diagram.LayoutUtil = {
        expandSubTree: function (diagram, node, reference, isAnimate, select, bringIntoView, collapse) {
            if (!diagram._isAnimating) {
                var zoom = diagram.model.scrollSettings.currentZoom;
                var hOffset = node.offsetX * zoom - diagram.model.scrollSettings.viewPortWidth / 2 - diagram.model.scrollSettings.horizontalOffset;
                if (node.offsetY * zoom < diagram.model.scrollSettings.verticalOffset || node.offsetY * zoom > (diagram.model.scrollSettings.verticalOffset + diagram.model.scrollSettings.viewPortHeight - 3 * node.height * zoom))
                    diagram.update({ scrollSettings: { verticalOffset: node.offsetY - diagram.model.scrollSettings.viewPortHeight / 2 } });
                var i = 0;
                if (hOffset != 0 && bringIntoView) {
                    diagram._preventScrollerUpdate = true;
                    var panningAnimation = setInterval(function () {
                        if (i < 4)
                            diagram.update({ scrollSettings: { horizontalOffset: diagram.model.scrollSettings.horizontalOffset + hOffset / 4 } });
                        i++;
                        if (i == 5) {
                            clearInterval(panningAnimation);
                            delete diagram._preventScrollerUpdate;
                            if ((collapse !== false || !node.isExpanded) && node.outEdges.length)
                                ej.datavisualization.Diagram.LayoutUtil.expand(diagram, node, reference, isAnimate, select);
                            else
                                ej.datavisualization.Diagram.ScrollUtil._setScrollContentSize(diagram);

                        }
                    }, 25);
                }
                else {
                    delete diagram._preventScrollerUpdate;
                    if ((collapse !== false || !node.isExpanded) && node.outEdges.length)
                        this.expand(diagram, node, reference, isAnimate, select);
                    else
                        ej.datavisualization.Diagram.ScrollUtil._setScrollContentSize(diagram);
                }
            }
        },
        _updateVisiblity: function (diagram, node, opacity) {
            for (var k = 0; k < node.outEdges.length; k++) {
                var edge = node.outEdges[k];
                edge = diagram.findNode(edge);
                var targetNode = diagram.findNode(edge.targetNode);
                edge.opacity = targetNode.opacity = opacity / 100;
                ej.datavisualization.Diagram.DiagramContext.updateNodeStyle(targetNode, diagram);
                ej.datavisualization.Diagram.DiagramContext.updateConnectorStyle(edge, diagram);
                if (targetNode.isExpanded && targetNode.outEdges.length) this._updateVisiblity(diagram, targetNode, opacity);
            }
        },
        expand: function (diagram, node, reference, isAnimate, select) {
            if (reference === undefined) {
                reference = node.name;
            }
            var temp = diagram.model.layout.fixedNode;
            diagram.model.layout.fixedNode = reference;
            var selectedItem = diagram.selectionList[0] ? diagram.selectionList[0].name : "";
            if (selectedItem)
                diagram._clearSelection(true);
            if (!isAnimate)
                diagram.layout();
            else if (!diagram._isAnimating) {
                node._updateExpander = true;
                diagram._updateEdgeCollection();

                //Expand or collapse the sub tree
                if (node.isExpanded) {
                    diagram._collapseChildren(node); node.isExpanded = false;
                } else { diagram._expandChildren(node); node.isExpanded = true; }
                diagram._isAnimating = true;
                //Layout the nodes
                var objects = ej.datavisualization.Diagram.Layout.doLayout(diagram, false);

                var i = 0;

                if (objects.length) {
                    $(".ej-d-connector").attr("opacity", 0);
                    $(".ej-d-icon-template").attr("opacity", 0);
                    diagram._layoutInAction = true;
                    var leftTimer = setInterval(function () {
                        i++;
                        if (i < 5) {
                            //Move the objects towards the corresponding direction
                            for (var l = 0; l < objects.length; l++) {
                                var obj = diagram.nameTable[objects[l].object];
                                diagram._disableSegmentChange = true;
                                diagram.updateNode(obj.name, { offsetX: obj.offsetX + objects[l].diff / 4, offsetY: obj.offsetY + objects[l].diffy / 4 });
                                diagram._disableSegmentChange = false;
                            }
                        }
                        if (i == 5) {
                            clearInterval(leftTimer);
                            delete diagram._layoutInAction;
                            //update the connectors
                            var layout = diagram._internalLayout;
                            for (i = 0; i < layout._firstLevelNodes.length; i++) {
                                ej.datavisualization.Diagram.HierarchicalLayout._updateConnectors(layout, layout._firstLevelNodes[i], 1);
                            }
                            delete diagram._internalLayout;
                            $(".ej-d-connector").attr("opacity", 1);
                            $(".ej-d-icon-template").attr("opacity", 1);
                            if (selectedItem || select) diagram._addSelection(diagram.findNode(selectedItem || reference), !select);
                            diagram._isAnimating = false;
                            delete diagram._preventScrollerUpdate;
                            ej.datavisualization.Diagram.ScrollUtil._setScrollContentSize(diagram);
                        }
                    }, 50);
                }
                else {
                    //update the connectors
                    var layout = diagram._internalLayout;
                    for (i = 0; i < layout._firstLevelNodes.length; i++) {
                        ej.datavisualization.Diagram.HierarchicalLayout._updateConnectors(layout, layout._firstLevelNodes[i], 1);
                    }
                    if (selectedItem || select) diagram._addSelection(diagram.findNode(selectedItem || reference), !select);
                    diagram._isAnimating = false;
                    delete diagram._internalLayout;
                }

                //Update the opacity of the expanded or collapsed sub tree
                var opacity = 0;
                var current = this;
                if (node.isExpanded) {
                    current._updateVisiblity(diagram, node, 0)
                    var settimer = setInterval(function () {
                        if (node.isExpanded) {
                            if (opacity <= 100)
                                current._updateVisiblity(diagram, node, opacity)
                            if (opacity == 120) {
                                clearInterval(settimer);
                            }
                            opacity += 5;
                        }
                    }, 25);
                }
                ej.datavisualization.Diagram.PageUtil._updatePageSize(diagram);
            }
            diagram.model.layout.fixedNode = temp;
        }
    };

    //#region Util
    ej.datavisualization.Diagram.Util = {

        convertPathToArray: function (string) {
            var pathSegList = [], pathDataList = this.parsePathData(string);
            if (pathDataList.length > 0) {
                for (var i = 0; i < pathDataList.length; i++) {
                    var pathArray = pathDataList[i];
                    var startChar = pathArray[0];
                    switch (startChar.toLowerCase()) {
                        case "m":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x: pathArray[j], y: pathArray[j + 1] });
                                j = j + 1;
                                if (startChar === "m")
                                    startChar = "l";
                                else if (startChar === "M")
                                    startChar = "L";
                            }
                            break;
                        case "l":
                        case "t":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x: pathArray[j], y: pathArray[j + 1] });
                                j = j + 1;
                            }
                            break;
                        case "h":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x: pathArray[j] });
                            }
                            break;
                        case "v":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, y: pathArray[j] });
                            }
                            break;
                        case "z":
                            pathSegList.push({ pathSegTypeAsLetter: startChar });
                            break;
                        case "c":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x1: pathArray[j], y1: pathArray[j + 1], x2: pathArray[j + 2], y2: pathArray[j + 3], x: pathArray[j + 4], y: pathArray[j + 5] });
                                j = j + 5;
                            }
                            break;
                        case "s":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x2: pathArray[j], y2: pathArray[j + 1], x: pathArray[j + 2], y: pathArray[j + 3] });
                                j = j + 3;
                            }
                            break;
                        case "q":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, x1: pathArray[j], y1: pathArray[j + 1], x: pathArray[j + 2], y: pathArray[j + 3] });
                                j = j + 3;
                            }
                            break;
                        case "a":
                            for (var j = 1; j < pathArray.length; j++) {
                                pathSegList.push({ pathSegTypeAsLetter: startChar, r1: pathArray[j], r2: pathArray[j + 1], angle: pathArray[j + 2], largeArcFlag: this.parseArcFlag(pathArray[j + 3]), sweepFlag: this.parseArcFlag(pathArray[j + 4]), x: pathArray[j + 5], y: pathArray[j + 6] });
                                j = j + 6;
                            }
                            break;
                    }
                }
            }
            return pathSegList;
        },
        _getImageAlignment: function (option) {
            if (option) {
                switch (option.toLowerCase()) {
                    case "xminymin":
                        return "xMinYMin";
                    case "xminymid":
                        return "xMinYMid";
                    case "xminymax":
                        return "xMinYMax";
                    case "xmidymin":
                        return "xMidYMin";
                    case "xmidymid":
                        return "xMidYMid";
                    case "xmidymax":
                        return "xMidYMax";
                    case "xmaxymin":
                        return "xMaxYMin";
                    case "xmaxymid":
                        return "xMaxYMid";
                    case "xmaxymax":
                        return "xMaxYMax";
                    case "none":
                        return "none";
                }
            }
            return "none";
        },
        parseArcFlag: function (char) {
            var flag;
            if (char === "0" || char === 0)
                flag = false;
            else if (char === "1" || char === 1)
                flag = true;
            return flag;
        },

        parsePathData: function (pathData) {
            var tokenizer = /([a-z]+)|([+-]?(?:\d+\.?\d*|\.\d+))/gi, match, current, commands = [];
            tokenizer.lastIndex = 0;
            var isExponential = false;
            while (match = tokenizer.exec(pathData)) {
                if (match[1] === "e") {
                    var s1 = "";
                    isExponential = true;
                }
                else if (match[1]) {
                    if (match[1].toLowerCase() === "zm") {
                        if (current)
                            commands.push(current);
                        commands.push(["Z"]);
                        current = [match[1].substring(1, 2)]
                    }
                    else {
                        if (current)
                            commands.push(current);
                        current = [match[1]];
                    }
                    isExponential = false;
                }
                else {
                    if (!current)
                        current = [];
                    if (!isExponential)
                        current.push(Number(match[2]));
                    isExponential = false;
                }
            }
            if (current) commands.push(current);
            return commands;
        },

        pathSegArrayAsString: function (pathSegArray) {
            var string = "";
            for (var i = 0; i < pathSegArray.length; i++) {
                var pathSeg = pathSegArray[i];
                if (i === 0)
                    string += this.pathToString(pathSeg);
                else
                    string += " " + this.pathToString(pathSeg);
            }
            return string;
        },
        canEnablePointerEvents: function (node, diagram) {
            var temp = node;
            var enabled;
            if (diagram) {
                while (temp) {
                    if (temp.segments)
                        enabled = temp.constraints & ej.datavisualization.Diagram.ConnectorConstraints.PointerEvents;
                    else
                        enabled = temp.constraints & ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
                    if (!enabled) return enabled;
                    temp = typeof temp.parent == "string" ? diagram.nameTable[temp.parent] : temp;
                }

            }
            return true;
        },
        isClassifier: function (evt) {
            var className = typeof evt.target.className == "string" ? evt.target.className : evt.target.className.baseVal;
            if ($(evt.target).hasClass("ej-d-classifier") || className.indexOf("ej-d-classifier") > -1)
                return true;
            else
                return false;
        },
        pathToString: function (pathSeg) {
            var string;
            switch (pathSeg.pathSegTypeAsLetter) {
                case "Z":
                case "z":
                    string = pathSeg.pathSegTypeAsLetter;
                    break;
                case "M":
                case "m":
                case "L":
                case "l":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x + " " + pathSeg.y;
                    break;
                case "C":
                case "c":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x1 + " " + pathSeg.y1 + " " + pathSeg.x2 + " " + pathSeg.y2 + " " + pathSeg.x + " " + pathSeg.y;
                    break;
                case "Q":
                case "q":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x1 + " " + pathSeg.y1 + " " + pathSeg.x + " " + pathSeg.y;
                    break;
                case "A":
                case "a":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.r1 + " " + pathSeg.r2 + " " + pathSeg.angle + " " + (pathSeg.largeArcFlag ? "1" : "0") + " " + (pathSeg.sweepFlag ? "1" : "0") + " " + pathSeg.x + " " + pathSeg.y;
                    break;
                case "H":
                case "h":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x;
                    break;
                case "V":
                case "v":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.y;
                    break;
                case "S":
                case "s":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x2 + " " + pathSeg.y2 + " " + pathSeg.x + " " + pathSeg.y;
                    break;
                case "T":
                case "t":
                    string = pathSeg.pathSegTypeAsLetter + " " + pathSeg.x + " " + pathSeg.y;
            }
            return string;
        },

        findPortByName: function (node, portName) {
            var port;
            if (node) {
                if (node.ports) {
                    for (var i = 0, len = node.ports.length; i < len; i++) {
                        port = node.ports[i];
                        if (port.name === portName) {
                            return port;
                        }
                    }
                }
                if (node._ports) {
                    for (var i = 0, len = node._ports.length; i < len; i++) {
                        port = node._ports[i];
                        if (port.name === portName) {
                            return port;
                        }
                    }
                }
            }
            return null;
        },
        attr: function (element, attributes) {
            for (var atr in attributes) {
                element.setAttribute(atr.toString(), attributes[atr]);
            }
        },
        removeChildFromGroup: function (array, item) {
            var index = array.indexOf(item);
            if (index < 0) {
                for (var i = 0 ; i < array.length; i++) { 
                    if (typeof (array[i]) === "object" && typeof (item) === "string") {
                        if (array[i].name === item) {
                            index = i;
                            break;
                        }
                    }
                }
            }
            if (index >= 0)
                array.splice(index, 1);
        },
        removeFromCollection: function (diagram, array, item) {
            if (diagram) {
                var item = diagram.nameTable[diagram._getChild(item)];
                for (var i = 0 ; i < array.length; i++) {
                    var child = diagram.nameTable[diagram._getChild(array[i])];
                    if (child.name === item.name) {
                        array.splice(i, 1);
                    }
                }
            }
        },
        removeItem: function (array, item) {
            var index = array.indexOf(item);
            if (index >= 0)
                array.splice(index, 1);
        },
        clear: function (array) {
            while (array.length > 0) {
                array.pop();
            }
        },
        getChild: function (child) {
            if (child) {
                if (typeof (child) == "object") {
                    return child.name;
                } else {
                    return child;
                }
            }
        },
        randomId: function () {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
            var id = "";
            //get 4 random chars
            for (var i = 0; i < 4; i++) {
                var num = ej.getRandomValue(0, chars.length - 1);
                id += chars.substring(num, num + 1);
            }
            return id;
        },
        htmlEncode: function (html) {
            var str = html.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'');
            return str;
        },
        canMove: function (node) {
            if (this.canSelect(node)) {
                if (node.segments) {
                    return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Drag;
                } else if (node._type == "label")
                    return node.constraints & ej.datavisualization.Diagram.LabelConstraints.Draggable;
                else
                    return node.constraints & ej.datavisualization.Diagram.NodeConstraints.Drag;
            }
        },

        canRouteDiagram: function (diagram) {
            return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Routing;
        },

        canRouteConnector: function (connector, diagram) {
            if (connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Routing) {
                return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Routing;
            }
            else if (connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.InheritRouting) {
                return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Routing;
            }
        },

        canMoveLabel: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.DragLabel;
            } else
                return node.constraints & ej.datavisualization.Diagram.NodeConstraints.DragLabel;
        },
        canRotate: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Rotate;
            } else if (node._type == "label")
                return node.constraints & ej.datavisualization.Diagram.LabelConstraints.Rotatable;
            else
                return node.constraints & ej.datavisualization.Diagram.NodeConstraints.Rotate;
        },
        canShowTooltip: function (node, diagram) {
            if (node.segments) {
                var inherit = node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.InheritTooltip;
            } else
                var inherit = node.constraints & ej.datavisualization.Diagram.NodeConstraints.InheritTooltip;
            if (inherit) {
                return diagram.model.tooltip;
            } return node.tooltip;
        },
        canSelect: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Select;
            } else if (node._type == "label")
                return node.constraints & ej.datavisualization.Diagram.LabelConstraints.Selectable;
            else
                return node.constraints & ej.datavisualization.Diagram.NodeConstraints.Select;
        },
        enableLayerOption: function (node, option, diagram) {
            var count = 0;
            var objectCount = 0;
            var layers = diagram.model.layers;
            var visible, i, layerOption;
            if (layers && layers.length === 0)
                return true;
            for (i = 0; layers && i < layers.length; i++) {
                if (option === "active" && layers[i][option]) {
                    count++;
                    layerOption = layers[i];
                } else {
                    if (node && layers[i].objects && (layers[i].objects.indexOf(node.name) > -1) || diagram._isParent(node, layers[i].objects)) {
                        count++;
                        visible = layers[i][option];
                        if (layers[i][option]) {
                            objectCount++;
                        }
                    }
                }
            }
            if (option === "active") {
                if (count === 1) {
                    return layerOption;
                }
                else
                    return false;
            } else {
                if (count === 1) {
                    return (option !== "lock") ? visible : !visible;
                }
                else if (count > 1 && objectCount > 0)
                    return true;
                else
                    return true;
            }

        },
        canBridge: function (connector, diagram) {
            if (connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Bridging) {
                return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Bridging;
            }
            else if (connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.InheritBridging) {
                return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Bridging;
            }
        },
        canBridgeObstacle: function (connector, diagram) {
            if (connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.BridgeObstacle) {
                return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.BridgeObstacle;
            }
        },
        canCrispEdges: function (node, diagram) {
            if (node.segments) {
                if (node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.CrispEdges) {
                    return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.CrispEdges;
                }
                else if (diagram && node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.InheritCrispEdges) {
                    return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.CrispEdges;
                }
            } else {
                if (node.constraints & ej.datavisualization.Diagram.NodeConstraints.CrispEdges) {
                    return node.constraints & ej.datavisualization.Diagram.NodeConstraints.CrispEdges;
                }
                else if (diagram && node.constraints & ej.datavisualization.Diagram.NodeConstraints.InheritCrispEdges) {
                    return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.CrispEdges;
                }
            }
        },
        canAllowPan: function (node) {
            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.AllowPan;
        },
        canAllowDrop: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.AllowDrop;
            } else
                return node.constraints & ej.datavisualization.Diagram.NodeConstraints.AllowDrop;
        },
        isAllowDragLimit: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.DragLimit;
            }
        },
        canDelete: function (node) {
            if (node.segments) {
                return node.constraints & ej.datavisualization.Diagram.ConnectorConstraints.Delete;
            } else
                return node.constraints & ej.datavisualization.Diagram.NodeConstraints.Delete;
        },
        isPageEditable: function (diagram) {
            if (diagram) {
                return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.UserInteraction;
            }
        },
        canFloatElements: function (diagram) {
            if (diagram) return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.FloatElements;
        },

        canEnableAPIMethods: function (diagram) {
            if (diagram && diagram._enableAPIMethods) {
                return diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.APIUpdate;
            }
        },

        canDoMultipleSelection: function (diagram) {
            if (diagram && this.isPageEditable(diagram)) {
                return diagram.tool() & ej.datavisualization.Diagram.Tool.MultipleSelect;
            }
        },
        canDoSingleSelection: function (diagram) {
            if (diagram && this.isPageEditable(diagram)) {
                return diagram.tool() & ej.datavisualization.Diagram.Tool.SingleSelect;
            }
        },
        canMoveOutofBoundary: function (diagram) {
            if (diagram.model.pageSettings.boundaryConstraints != "infinity")
                return true;
            return false;
        },
        _getPseudoGroupConstraints: function (diagram, node, selectionlist) {
            var pseudoGroupConstraints;
            if (selectionlist && selectionlist.type === "pseudoGroup") {
                if (selectionlist.children.indexOf(node.name) >= 0 || node.name === selectionlist.name)
                    if (diagram.model.selectedItems.getConstraints) {
                        var getConstraints = diagram.model.selectedItems.getConstraints;
                        if (typeof getConstraints == "string")
                            getConstraints = ej.util.getObject(getConstraints, window);
                    }
                if (getConstraints && $.isFunction(getConstraints))
                    pseudoGroupConstraints = getConstraints();
                else {
                    if (selectionlist.children) {
                        pseudoGroupConstraints = ej.datavisualization.Diagram.NodeConstraints.Default;
                        for (var i = 0; i < selectionlist.children.length ; i++) {
                            var nodes = diagram.nameTable[diagram._getChild(selectionlist.children[i])];
                            if (nodes) {
                                var nodeConstraints = nodes.constraints;
                                if (!(nodeConstraints & ej.datavisualization.Diagram.NodeConstraints.Resize))
                                    pseudoGroupConstraints = pseudoGroupConstraints & ~ej.datavisualization.Diagram.NodeConstraints.Resize;
                                if (!(nodeConstraints & ej.datavisualization.Diagram.NodeConstraints.Rotate))
                                    pseudoGroupConstraints = pseudoGroupConstraints & ~ej.datavisualization.Diagram.NodeConstraints.Rotate;
                                if (!(nodeConstraints & ej.datavisualization.Diagram.NodeConstraints.Drag))
                                    pseudoGroupConstraints = pseudoGroupConstraints & ~ej.datavisualization.Diagram.NodeConstraints.Drag;
                            }
                        }
                    }
                }
            }

            return pseudoGroupConstraints;
        },
        canPanning: function (diagram) {
            if (diagram) {
                return (diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.PannableX) || (diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.PannableY);
            }
        },
        canZooming: function (diagram) {
            if (diagram) {
                return (diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Zoomable);
            }
        },
        canUndo: function (diagram) {
            if (diagram) {
                return (diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.Undoable);
            }
        },
        canZoomTextEditor: function (diagram) {
            if (diagram) return (diagram.model.constraints & ej.datavisualization.Diagram.DiagramConstraints.ZoomTextEditor);
        },
        canMultiSelectOnLane: function (node) {
            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.MultiSelect;
        },
        canMultiSelectOnNode: function (node) {
            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.PointerEvents;
        },
        canEnableTooltip: function (diagram) {
            if (diagram.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.Tooltip)
                return true;
            else
                return false;
        },
        canDragHelper: function (diagram) {
            return diagram.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.DragOnEmptySpace ? true : false;
        },
        canShowResizeThumbs: function (diagram) {
            return diagram.model.selectedItems.constraints & ej.datavisualization.Diagram.SelectorConstraints.AutoHideThumbs;
        },
        canDrawStackHighlighter: function (diagram, node, overNode) {
            if (ej.datavisualization.Diagram.Util.canMoveOutofBoundary(diagram)) {
                if (diagram && node && overNode) {
                    var laneStack = diagram.nameTable[overNode.parent];
                    if (laneStack && laneStack.isLaneStack) {
                        var swimlane = diagram.nameTable[laneStack.parent];
                        if (swimlane && swimlane.isSwimlane) {
                            var swimlaneBounds = this.bounds(swimlane);
                            var size = diagram.activeTool._getPageBounds();
                            if (swimlane.orientation === "horizontal") {
                                if ((node.height + swimlaneBounds.bottom >= size.height) || (node.width - swimlane.width + swimlaneBounds.right > size.width)) {
                                    diagram.activeTool.updateCursor("not-allowed");
                                    diagram._notAllow = true;
                                    return false;
                                }
                            }
                            else {
                                if ((node.width + swimlaneBounds.right >= size.width) || (node.height - swimlane.height + swimlaneBounds.bottom > size.height)) {
                                    diagram.activeTool.updateCursor("not-allowed");
                                    diagram._notAllow = true;
                                    return false;
                                }
                            }
                        }
                    }

                }
            }
            return true;
        },
        canDragSourceEnd: function (connector) {
            return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.DragSourceEnd;
        },
        canDragTargetEnd: function (connector) {
            return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.DragTargetEnd;
        },
        canDragSegmentThumbs: function (connector) {
            return connector.constraints & ej.datavisualization.Diagram.ConnectorConstraints.DragSegmentThumb;
        },
        isTargetConnected: function (connector) {
            return connector.targetNode ? true : false;
        },
        isSourceConnected: function (connector) {
            return connector.sourceNode ? true : false;
        },
        bounds: function (object, excludeRotation) {
            var rect = {};
            if (object) {
                if (object.segments) {
                    for (var i = 0; i < object.segments.length; i++) {
                        var segment = object.segments[i];
                        if (i == 0) {
                            if (segment.points)
                                rect = ej.datavisualization.Diagram.Geometry.rect(segment.points);
                        }
                        else
                            rect = ej.datavisualization.Diagram.Geometry.union(rect, ej.datavisualization.Diagram.Geometry.rect(segment.points));
                        if (rect.width == 0) { rect.width = object.lineWidth; rect.x -= object.lineWidth / 2; }
                        if (rect.height == 0) { rect.height = object.lineWidth; rect.y -= object.lineWidth / 2; }
                    }
                }
                else if (object._type == "node" || object._type === "group" || object.type == "umlclassifier" || object._type == "pseudoGroup") {
                    var width = object.width ? object.width : object._width || 0;
                    var height = object.height ? object.height : object._height || 0;
                    rect = { x: object.offsetX - width * object.pivot.x, y: object.offsetY - height * object.pivot.y, width: width, height: height };
                }
                else
                    rect = object;
            }
            else
                rect = ej.datavisualization.Diagram.Rectangle();
            if (rect) {
                var bounds = {};
                rect.x = Math.round(rect.x * 100) / 100;
                rect.y = Math.round(rect.y * 100) / 100;
                rect.width = Math.round(rect.width * 100) / 100;
                rect.height = Math.round(rect.height * 100) / 100;
                bounds["width"] = rect.width;
                bounds["height"] = rect.height;
                bounds["x"] = bounds["left"] = rect.x;
                bounds["right"] = rect.x + rect.width;
                bounds["y"] = bounds["top"] = rect.y;
                bounds["bottom"] = rect.y + rect.height;
                bounds["center"] = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
                bounds["topLeft"] = { x: rect.x, y: rect.y };
                bounds["topCenter"] = { x: rect.x + rect.width / 2, y: rect.y };
                bounds["topRight"] = { x: rect.x + rect.width, y: rect.y };
                bounds["middleLeft"] = { x: rect.x, y: rect.y + rect.height / 2 };
                bounds["middleRight"] = { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
                bounds["bottomLeft"] = { x: rect.x, y: rect.y + rect.height };
                bounds["bottomCenter"] = { x: rect.x + rect.width / 2, y: rect.y + rect.height };
                bounds["bottomRight"] = { x: rect.x + rect.width, y: rect.y + rect.height };
                if (object && object.rotateAngle && !excludeRotation) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, object.rotateAngle, object.offsetX, object.offsetY);
                    bounds.topLeft = ej.Matrix.transform(matrix, bounds.topLeft);
                    bounds.topCenter = ej.Matrix.transform(matrix, bounds.topCenter);
                    bounds.topRight = ej.Matrix.transform(matrix, bounds.topRight);
                    bounds.middleLeft = ej.Matrix.transform(matrix, bounds.middleLeft);
                    bounds.middleRight = ej.Matrix.transform(matrix, bounds.middleRight);
                    bounds.bottomLeft = ej.Matrix.transform(matrix, bounds.bottomLeft);
                    bounds.bottomCenter = ej.Matrix.transform(matrix, bounds.bottomCenter);
                    bounds.bottomRight = ej.Matrix.transform(matrix, bounds.bottomRight);
                    var rbounds = ej.datavisualization.Diagram.Geometry.rect([bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft]);
                    bounds.x = bounds.left = rbounds.x;
                    bounds.y = bounds.top = rbounds.y;
                    bounds.right = rbounds.x + rbounds.width;
                    bounds.bottom = rbounds.y + rbounds.height;
                    bounds.center = ej.datavisualization.Diagram.Point(rbounds.x + rbounds.width / 2, rbounds.y + rbounds.height / 2);
                }
                bounds["points"] = [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft];
                return bounds;
            }
            return rect;
        },
        _swapBounds: function (object, bounds) {
            var object, bounds;
            bounds = bounds;
            if (object.rotateAngle) {
                if (object.rotateAngle < 45) { }
                else if (object.rotateAngle <= 135) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, object.rotateAngle, object.offsetX, object.offsetY);
                    var temp;
                    temp = bounds["topCenter"];
                    bounds["topCenter"] = bounds["middleLeft"];
                    bounds["middleLeft"] = bounds["bottomCenter"];
                    bounds["bottomCenter"] = bounds["middleRight"];
                    bounds["middleRight"] = temp;
                    temp = bounds["topLeft"];
                    bounds["topLeft"] = bounds["bottomLeft"];
                    bounds["bottomLeft"] = bounds["bottomRight"];
                    bounds["bottomRight"] = bounds["topRight"];
                    bounds["topRight"] = temp;
                }
                else if (object.rotateAngle <= 225) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, object.rotateAngle, object.offsetX, object.offsetY);
                    var temp;
                    temp = bounds["topCenter"];
                    bounds["topCenter"] = bounds["bottomCenter"];
                    bounds["bottomCenter"] = temp;
                    temp = bounds["middleLeft"];
                    bounds["middleLeft"] = bounds["middleRight"];
                    bounds["middleRight"] = temp;
                    temp = bounds["bottomLeft"];
                    bounds["bottomLeft"] = bounds["topLeft"];
                    bounds["topLeft"] = temp;
                    temp = bounds["bottomRight"];
                    bounds["bottomRight"] = bounds["topRight"];
                    bounds["topRight"] = temp;
                }
                else if (object.rotateAngle <= 315) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, object.rotateAngle, object.offsetX, object.offsetY);
                    var temp;
                    temp = bounds["topCenter"];
                    bounds["topCenter"] = bounds["middleRight"];
                    bounds["middleRight"] = bounds["bottomCenter"];
                    bounds["bottomCenter"] = bounds["middleLeft"];
                    bounds["middleLeft"] = temp;
                    temp = bounds["topRight"];
                    bounds["topRight"] = bounds["bottomRight"];
                    bounds["bottomRight"] = bounds["bottomLeft"];
                    bounds["bottomLeft"] = bounds["topLeft"];
                    bounds["topLeft"] = temp;
                }
                bounds["points"] = [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft];
                return bounds;
            }
        },
        canResize: function (node, dir) {
            if (node._type !== "label") {
                if (dir) {
                    switch (dir) {
                        case "n-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorth;
                        case "s-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouth;
                        case "e-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeEast;
                        case "w-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeWest;
                        case "se-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast;
                        case "ne-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast;
                        case "sw-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest;
                        case "nw-resize":
                            return node.constraints & ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest;
                    }
                }
                else
                    return node.constraints & ej.datavisualization.Diagram.NodeConstraints.Resize;
            }
            else
                return node.constraints & ej.datavisualization.Diagram.LabelConstraints.Resizable;
        },
        canConnect: function (node, isPort) {
            var connect = null;
            if (node) {
                if (isPort) {
                    connect = node.constraints & ej.datavisualization.Diagram.PortConstraints.Connect;
                }
                else if (!node.segments)
                    connect = node.constraints & ej.datavisualization.Diagram.NodeConstraints.Connect;
            }
            return connect;
        },
        _initializeSegments: function (connector, defaultType) {
            if (connector.segments && connector.segments.length <= 1) {
                if (!connector.segments.length) {
                    connector.segments.push(ej.datavisualization.Diagram.Segment({ type: defaultType || "straight" }));
                }
                var first = connector.segments[0];
                switch (first.type) {
                    case "straight":
                        if (!first.point) { first._point = connector.targetPoint; }
                        else if (first.point.x != connector.targetPoint.x || first.point.y != connector.targetPoint.y) {
                            //Need to add a method
                            connector.segments.push({ type: first.type || "straight" });
                        }
                        break;
                    case "orthogonal":
                        if (first.length && first.direction) {
                            ej.datavisualization.Diagram.Util._addOrthogonalPoints(first, null, null, connector.sourcePoint, connector.targetPoint);
                            if (first._endPoint.x != connector.targetPoint.x || first._endPoint.y != connector.targetPoint.y) {
                                connector.segments.push({ type: first.type || "straight" });
                            }
                        }
                        else {
                            first._length = first.length || 20;
                            first._direction = first.direction || "auto";
                        }
                        break;
                    case "bezier":
                        if (!first.point) first._point = connector.targetPoint;
                        else if (first.point.x != connector.targetPoint.x || first.point.y != connector.targetPoint.y) {
                            //Need to add a method
                            connector.segments.push({ type: first.type || "straight" });
                        }
                        break;
                }
            }
            var startPoint = connector.sourcePoint;
            var prev = null;
            var next = null;
            var runAngle;
            for (var i = 0; i < connector.segments.length; i++) {
                var segment = connector.segments[i];
                segment._startPoint = startPoint;
                next = connector.segments[i + 1];
                segment = connector.segments[i] = ej.datavisualization.Diagram.Segment(connector.segments[i]);
                if (segment.type == "orthogonal") {
                    segment._direction = segment.direction || "auto";
                    segment._length = segment.length || 20;
                    runAngle = ej.datavisualization.Diagram.Util._addOrthogonalPoints(connector.segments[i], prev, next, connector.sourcePoint, connector.targetPoint, runAngle);
                    startPoint = connector.segments[i]._endPoint;
                    if (!segment.length || !segment.direction) {
                        break;
                    }
                }
                else if (segment.type == "straight") {
                    segment.points.push(startPoint);
                    segment.points.push(connector.segments[i].point || connector.targetPoint);
                    segment._point = segment._endPoint = connector.segments[i].point || connector.targetPoint;
                    runAngle = ej.datavisualization.Diagram.Geometry.findAngle(startPoint, segment._endPoint);
                    startPoint = connector.segments[i]._endPoint;
                    if (!segment.point) {
                        break;
                    }
                }
                else if (segment.type == "bezier") {
                    segment._point = segment._endPoint = connector.segments[i].point || connector.targetPoint;
                    segment.points.push(startPoint);
                    segment.points.push(connector.segments[i].point || connector.targetPoint);
                    runAngle = ej.datavisualization.Diagram.Geometry.findAngle(startPoint, segment._endPoint);
                    ej.datavisualization.Diagram.Util._updateBezierPoints(segment);
                    startPoint = connector.segments[i]._endPoint;
                    if (!segment.point) {
                        break;
                    }
                }
                else {
                    var segment = ej.datavisualization.Diagram.Segment({ type: "orthogonal" });
                    segment._direction = "auto";
                    segment._length = 20;
                    segment._startPoint = startPoint;
                    segment._endPoint = connector.targetPoint;
                    connector.segments.push(segment);
                    ej.datavisualization.Diagram.Util._addOrthogonalPoints(segment, prev, null, connector.sourcePoint, connector.targetPoint, runAngle);
                    break;
                }
                prev = connector.segments[i];
            }
            if (startPoint.x != connector.targetPoint.x || startPoint.y != connector.targetPoint.y) {
                var segment = ej.datavisualization.Diagram.Segment({ type: (prev ? prev.type : defaultType) || "straight", });
                segment._startPoint = startPoint;
                segment._endPoint = connector.targetPoint;
                if (segment.type == "orthogonal") {
                    ej.datavisualization.Diagram.Util._addOrthogonalPoints(segment, prev, null, connector.sourcePoint, connector.targetPoint, runAngle);
                }
                else {
                    segment._point = connector.targetPoint;
                    segment.points.push(startPoint);
                    segment.points.push(connector.targetPoint);
                    if (segment.type == "bezier") { this._updateBezierPoints(segment); }
                }
                connector.segments.push(segment);
            }
        },
        _getDockableBPMNNode: function (node, connector, nameTable, isTarget) {
            var segment = isTarget ? connector.segments[connector.segments.length - 1] : connector.segments[0];
            if (node && node.type == "bpmn")
                if (segment.type == "orthogonal") {
                    return node;
                } else if (node._type == "group")
                    node = (typeof node.children[0] == "object") ? node.children[0] : nameTable[node.children[0]];
            return node;
        },
        dock: function (connector, nameTable, diagram) {
            var targetNode, targetPort = null, sourceNode, sourcePort = null;
            var srcDecoratorSize = connector._srcDecoratorSize, tarDecoratorSize = connector._tarDecoratorSize;
            if (connector.sourcePadding) connector._srcDecoratorSize += connector.sourcePadding;
            if (connector.targetPadding) connector._tarDecoratorSize += connector.targetPadding
            targetNode = nameTable[connector.targetNode];
            if (targetNode)
                targetPort = connector._targetPortLocation || this.findPortByName(targetNode, connector.targetPort);
            sourceNode = nameTable[connector.sourceNode];
            if (sourceNode)
                sourcePort = connector._sourcePortLocation || this.findPortByName(sourceNode, connector.sourcePort);
            var sourceConnected = this.isSourceConnected(connector);
            var targetConnected = this.isTargetConnected(connector);
            if (!sourcePort) {
                sourceNode = this._getDockableBPMNNode(sourceNode, connector, nameTable, false);
                if (sourceNode && sourceNode.connectorPadding) connector._srcDecoratorSize += sourceNode.connectorPadding;
            } else if (sourcePort.connectorPadding) connector._srcDecoratorSize += sourcePort.connectorPadding;
            if (!targetPort) {
                targetNode = this._getDockableBPMNNode(targetNode, connector, nameTable, true);
                if (targetNode && targetNode.connectorPadding) connector._tarDecoratorSize += targetNode.connectorPadding;
            } else if (targetPort.connectorPadding) connector._tarDecoratorSize += targetPort.connectorPadding;
            if (targetConnected && sourceConnected && targetPort && sourcePort) {
                this._dockPortToPort(connector, targetNode, targetPort, sourceNode, sourcePort);
            }
            else if (targetConnected && targetPort) {
                if (sourceConnected) {
                    if (connector.segments.length == 1) {
                        this._dockNode(connector, sourceNode, null, targetConnected, sourceConnected);
                        this._dockPortToNode(connector, targetNode, targetPort, sourceNode, sourcePort, true);
                    }
                    else {
                        this._dockNode(connector, sourceNode, null, targetConnected, sourceConnected);
                        this._updateIntermediateSegments(connector);
                        this._dockPortToPoint(connector, targetNode, targetPort, true);
                        this._updatePreviousSegment(connector);
                    }
                }
                else {
                    this._dockPortToPoint(connector, targetNode, targetPort, true);
                    this._updatePreviousSegment(connector);
                }
            }
            else if (sourceConnected && sourcePort) {
                if (targetConnected) {
                    if (connector.segments.length == 1) {
                        this._dockNode(connector, targetNode, null, targetConnected, sourceConnected);
                        this._dockPortToNode(connector, sourceNode, sourcePort, targetNode, targetPort, false);
                    }
                    else {
                        this._dockPortToPoint(connector, sourceNode, sourcePort, false);
                        this._updateIntermediateSegments(connector);
                        this._dockNode(connector, targetNode, null, targetConnected, sourceConnected);
                        this._updatePreviousSegment(connector);
                    }
                }
                else {
                    this._dockPortToPoint(connector, sourceNode, sourcePort, false);
                    this._updateIntermediateSegments(connector);
                }
            }
            else if (targetConnected && sourceConnected) {
                if (targetNode && sourceNode)
                    this._dockNode(connector, targetNode, sourceNode, targetConnected, sourceConnected, diagram);
            }
            else if (targetConnected) {
                this._dockNode(connector, targetNode, null, targetConnected, sourceConnected);

            }
            else if (sourceConnected) {
                this._dockNode(connector, sourceNode, null, targetConnected, sourceConnected);
            }
            this._adjustEndPoint(connector, sourceNode, sourcePort, targetNode, targetPort);
            connector._srcDecoratorSize = srcDecoratorSize;
            connector._tarDecoratorSize = tarDecoratorSize;
        },
        _dockPortToPort: function (connector, targetNode, targetPort, sourceNode, sourcePort) {
            if (connector.segments.length == 1) {
                var portLocation;
                if (targetNode)
                    var targetBounds = this.bounds(targetNode, true);
                if (sourceNode)
                    var sourceBounds = this.bounds(sourceNode, true);
                var matrix;
                var first = connector.segments[0];
                var last = connector.segments[connector.segments.length - 1];
                var segment = connector.segments[0];
                if (segment.type !== "orthogonal") {
                    if (targetPort) {
                        portLocation = this._getPortPosition(targetPort, targetBounds);
                        if (targetNode.rotateAngle) {
                            matrix = ej.Matrix.identity();
                            ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                            portLocation = ej.Matrix.transform(matrix, portLocation);
                        }
                        this._setLineEndPoint(connector, portLocation, true);
                    }
                    if (sourcePort) {
                        portLocation = this._getPortPosition(sourcePort, sourceBounds);
                        if (sourceNode.rotateAngle) {
                            matrix = ej.Matrix.identity();
                            ej.Matrix.rotate(matrix, sourceNode.rotateAngle, sourceNode.offsetX, sourceNode.offsetY);
                            portLocation = ej.Matrix.transform(matrix, portLocation);
                        }
                        this._setLineEndPoint(connector, portLocation, false);
                    }
                    if (segment.type === "bezier")
                        this._updateBezierPoints(segment, targetNode, targetPort, targetBounds, sourceNode, sourcePort, sourceBounds);
                } else {
                    var targetPortLocation = connector._targetPortLocation || this._getPortPosition(targetPort, targetBounds);
                    var sourcePortLocation = connector._sourcePortLocation || this._getPortPosition(sourcePort, sourceBounds);
                    var targetDirection = this._swapDirection(targetNode.rotateAngle, this._getDirection(targetBounds, targetPortLocation));
                    var sourceDirection = this._swapDirection(sourceNode.rotateAngle, this._getDirection(sourceBounds, sourcePortLocation));
                    if (sourceNode.rotateAngle) {
                        matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, sourceNode.rotateAngle, sourceNode.offsetX, sourceNode.offsetY);
                        sourcePortLocation = ej.Matrix.transform(matrix, sourcePortLocation);
                    }
                    if (targetNode.rotateAngle) {
                        matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                        targetPortLocation = ej.Matrix.transform(matrix, targetPortLocation);
                    }
                    this._constructSegements(connector, first, targetBounds, targetPortLocation, targetDirection, sourceBounds, sourcePortLocation, sourceDirection);
                    this._setLineEndPoint(connector, first.points[0], false);
                    this._setLineEndPoint(connector, first.points[first.points.length - 1], true);
                }
            }
            else {
                this._dockPortToPoint(connector, sourceNode, sourcePort, false);
                this._updateIntermediateSegments(connector);
                this._dockPortToPoint(connector, targetNode, targetPort, true);
                this._updatePreviousSegment(connector);
            }
        },
        _dockPortToNode: function (connector, targetNode, targetPort, sourceNode, sourcePort, isTarget) {
            var first = connector.segments[0];
            var last = connector.segments[connector.segments.length - 1];
            if (targetNode)
                var targetBounds = this.bounds(targetNode, true);
            if (sourceNode)
                var sourceBounds = this.bounds(sourceNode, true);
            var matrix;
            var segment = isTarget ? last : first;
            if (segment.type !== "orthogonal") {
                var portLocation = this._getPortPosition(targetPort, targetBounds);
                matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                portLocation = ej.Matrix.transform(matrix, portLocation);
                //segment._endPoint = portLocation;
                this._setLineEndPoint(connector, portLocation, isTarget);
            }
            else {
                var targetPortLocation = (isTarget ? connector._targetPortLocation : connector._sourcePortLocation) || this._getPortPosition(targetPort, targetBounds);
                var targetDirection = this._swapDirection(targetNode.rotateAngle, this._getDirection(targetBounds, targetPortLocation));
                matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                targetPortLocation = ej.Matrix.transform(matrix, targetPortLocation);
                var sourcePortLocation;
                if (!isTarget) {
                    sourcePortLocation = connector.targetPoint;
                }
                else {
                    sourcePortLocation = connector.sourcePoint;
                }
                var sourceDirection;
                if (sourceNode) {
                    sourceDirection = this._getDirection(sourceBounds, sourcePortLocation);
                }
                else sourceDirection = "top";
                if (sourceDirection) {
                    targetBounds = this.bounds(targetNode);
                    if (sourceNode)
                        sourceBounds = this.bounds(sourceNode);
                    else sourceBounds = { left: sourcePortLocation.x, right: sourcePortLocation.x, top: sourcePortLocation.y, bottom: sourcePortLocation.y };
                    if (isTarget) {
                        this._setLineEndPoint(connector, targetPortLocation, true);
                        this._constructSegements(connector, last, targetBounds, targetPortLocation, targetDirection, sourceBounds, sourcePortLocation, sourceDirection);
                    }
                    else {
                        this._setLineEndPoint(connector, targetPortLocation, false);
                        this._constructSegements(connector, first, sourceBounds, sourcePortLocation, sourceDirection, targetBounds, targetPortLocation, targetDirection);
                    }
                }
            }
        },
        _dockPortToPoint: function (connector, targetNode, targetPort, isTarget) {
            var first = connector.segments[0];
            var last = connector.segments[connector.segments.length - 1];
            var segment = isTarget ? last : first;
            if (segment.type !== "orthogonal") {
                this._dockPortToNode(connector, targetNode, targetPort, null, null, isTarget);
            }
            else {
                var targetBounds = this.bounds(targetNode, true);
                var targetPortLocation = (isTarget ? connector._targetPortLocation : connector._sourcePortLocation) || this._getPortPosition(targetPort, targetBounds);
                var targetDirection = this._swapDirection(targetNode.rotateAngle, this._getDirection(targetBounds, targetPortLocation));
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                targetPortLocation = ej.Matrix.transform(matrix, targetPortLocation);
                var sourcePortLocation;

                if (!isTarget) {
                    sourcePortLocation = first._endPoint;
                }
                else {
                    sourcePortLocation = last._startPoint;
                }
                var sourceBounds = this.bounds(ej.datavisualization.Diagram.Rectangle(sourcePortLocation.x, sourcePortLocation.y, 0, 0));
                targetBounds = this.bounds(targetNode);
                var sourceDirection = "top";
                if (isTarget) {
                    this._setLineEndPoint(connector, targetPortLocation, true);
                    this._pointsFromNodeToPoint(connector, last, targetDirection, targetBounds, targetNode.rotateAngle, targetPortLocation, sourcePortLocation, true); //{(connector, last, targetBounds, targetPortLocation, targetDirection, sourceBounds, sourcePortLocation, sourceDirection);
                }
                else {
                    this._setLineEndPoint(connector, targetPortLocation, false);
                    this._pointsFromNodeToPoint(connector, first, targetDirection, targetBounds, targetNode.rotateAngle, targetPortLocation, sourcePortLocation, false);
                }
            }
        },
        _containsminSpaceBetweenNode: function (diagram, sourceNode, targetNode) {
            var state = false;
            if (diagram && diagram.minSpaceBetweenNode && sourceNode && targetNode) {
                if (diagram.minSpaceBetweenNode && diagram.minSpaceBetweenNode.length > 0) {
                    for (var i = 0; i < diagram.minSpaceBetweenNode; i++) {
                        if (diagram.minSpaceBetweenNode[i] === sourceNode.name)
                            return true;
                        if (diagram.minSpaceBetweenNode[i] === targetNode.name)
                            return true;
                    }
                }
            }
            return state;
        },
        _dockNode: function (connector, targetNode, sourceNode, targetConnected, sourceConnected, diagram) {
            var startsegment, endsegment;
            var minSpace = connector._srcDecoratorSize + connector._tarDecoratorSize;
            minSpace = this._containsminSpaceBetweenNode(diagram, sourceNode, targetNode) ? 0 : minSpace;
            if (connector.segments.length == 1) {
                startsegment = endsegment = connector.segments[0];
            }
            else {
                startsegment = connector.segments[0];
                endsegment = connector.segments[connector.segments.length - 1];
            }
            if (targetConnected && sourceConnected && !connector.targetPort && !connector.sourcePort) {
                if (connector.segments.length == 1) {
                    if (connector.segments[0].type == "orthogonal") {
                        var sourceBounds = this.bounds(sourceNode);
                        var targetBounds = this.bounds(targetNode);
                        this._swapBounds(sourceNode, sourceBounds);
                        this._swapBounds(targetNode, targetBounds);
                        var srcPoint, tarPoint, srcDirection, tarDirection;
                        ////Test top side.
                        if (sourceBounds.y - minSpace >= targetBounds.bottom) {
                            srcPoint = sourceBounds.topCenter;
                            srcDirection = "top";
                            tarPoint = targetBounds.bottomCenter;
                            tarDirection = "bottom";
                        }
                            ////Test bottom side.
                        else if (sourceBounds.bottom + minSpace <= targetBounds.y) {
                            tarPoint = targetBounds.topCenter;
                            tarDirection = "top";
                            srcPoint = sourceBounds.bottomCenter;
                            srcDirection = "bottom";
                        }
                        if ((sourceBounds.bottom + minSpace > targetBounds.y) && (sourceBounds.y < targetBounds.bottom + minSpace)) {
                            if (sourceBounds.right + minSpace < targetBounds.x || (targetBounds.right >= sourceBounds.x - minSpace && sourceBounds.x > targetBounds.x)) {
                                ////rightleft
                                srcPoint = sourceBounds.middleRight;
                                srcDirection = "right";
                                tarPoint = targetBounds.middleLeft;
                                tarDirection = "left";
                            }
                            else {
                                if (targetBounds.right + minSpace < sourceBounds.x || (sourceBounds.right >= targetBounds.x - minSpace && sourceBounds.x < targetBounds.x)) {
                                    srcPoint = sourceBounds.middleLeft;
                                    srcDirection = "left";
                                    tarPoint = targetBounds.middleRight;
                                    tarDirection = "right";
                                }
                                else if (sourceBounds.x <= targetBounds.x) {
                                    srcPoint = sourceBounds.middleLeft;
                                    srcDirection = "left";
                                    tarPoint = targetBounds.middleLeft;
                                    tarDirection = "left";
                                    ////left left
                                }
                                else if (sourceBounds.x <= targetBounds.right) {
                                    ////right right
                                    srcPoint = sourceBounds.middleRight;
                                    srcDirection = "right";
                                    tarPoint = targetBounds.middleRight;
                                    tarDirection = "right";
                                }
                                else {
                                    ////left right
                                    srcPoint = sourceBounds.middleLeft;
                                    srcDirection = "left";
                                    tarPoint = targetBounds.middleRight;
                                    tarDirection = "right";
                                }
                            }
                        }
                        var targetPoint;
                        targetPoint = this._findEndPoint(srcDirection, srcPoint, sourceNode) || sourceBounds.center;
                        srcPoint = this._findIntersection(sourceNode, sourceBounds, connector, srcPoint, targetPoint, false) || srcPoint;
                        targetPoint = this._findEndPoint(tarDirection, tarPoint, targetNode) || targetBounds.center;
                        tarPoint = this._findIntersection(targetNode, targetBounds, connector, tarPoint, targetPoint, true) || tarPoint;
                        this._setLineEndPoint(connector, srcPoint, false);
                        this._setLineEndPoint(connector, tarPoint, true);
                        if (connector.segments[0].type == "orthogonal") {
                            this._constructSegements(connector, connector.segments[0], targetBounds, connector.targetPoint, tarDirection, sourceBounds, connector.sourcePoint, srcDirection);
                            connector.segments[0]._direction = srcDirection;
                        }
                    }
                    else {
                        if (targetNode) {
                            targetBounds = this.bounds(targetNode);
                            this._swapBounds(targetNode, targetBounds);
                            if (sourceNode) {
                                sourceBounds = this.bounds(sourceNode);
                                this._swapBounds(sourceNode, sourceBounds);
                                this._setLineEndPoint(connector, sourceBounds.center, false);
                                this._setLineEndPoint(connector, targetBounds.center, true);
                                this._dockBounds(connector, sourceNode, sourceBounds, false);
                            }
                            this._setLineEndPoint(connector, targetBounds.center, true);
                            this._dockBounds(connector, targetNode, targetBounds, true);
                        }
                        if (connector.segments[0].type == "bezier") {
                            this._updateBezierPoints(connector.segments[0]);
                        }
                    }
                }
                else {
                    this._dock(connector, startsegment, sourceNode, null, false);
                    this._updateIntermediateSegments(connector);
                    if (connector.segments.length == 1) {
                        this._dock(connector, startsegment, sourceNode, targetNode, false);
                        this._dock(connector, endsegment, targetNode, sourceNode, true);
                    }
                    else {
                        this._dock(connector, endsegment, targetNode, null, true);
                        this._updatePreviousSegment(connector);
                    }
                }
            }
            else if (targetConnected && !connector.targetPort) {
                this._dock(connector, endsegment, targetNode, sourceNode, true);
                this._updatePreviousSegment(connector);
            }
            else if (sourceConnected && !connector.sourcePort) {
                this._dock(connector, startsegment, targetNode, sourceNode, false);
                this._updateIntermediateSegments(connector);
            }
        },
        _adjustEndPoint: function (connector, sourceNode, sourcePort, targetNode, targetPort) {
            if (connector.sourcePadding || connector.targetPadding || sourcePort && sourcePort.connectorPadding || targetPort && targetPort.connectorPadding) {
                var length = 0;
                var targetBounds = targetNode ? this.bounds(targetNode) : null;
                var sourceBounds = sourceNode ? this.bounds(sourceNode) : null;
                if (sourceNode) {
                    var endPoint;
                    var segment = connector.segments[0];
                    if (segment.type !== "orthogonal") endPoint = segment.type !== "bezier" ? segment._endPoint : segment._point1;
                    else endPoint = segment.points[1];
                    if (sourcePort) length = connector.sourcePadding + sourcePort.connectorPadding;
                    var sourcePortLocation = this._adjustPoint(segment._startPoint, endPoint, true, length);
                    this._setLineEndPoint(connector, sourcePortLocation, false);
                    if (segment.type == "bezier") this._updateBezierPoints(segment, targetNode, targetPort, targetBounds, sourceNode, sourcePort, sourceBounds);
                }
                if (targetNode) {
                    var startPoint;
                    var segment = connector.segments[connector.segments.length - 1];
                    if (segment.type !== "orthogonal") startPoint = segment.type !== "bezier" ? segment._startPoint : segment._point2;
                    else startPoint = segment.points[segment.points.length - 2];
                    if (targetPort) length = connector.targetPadding + targetPort.connectorPadding;
                    var targetPortLocation = this._adjustPoint(startPoint, segment._endPoint, false, length);
                    this._setLineEndPoint(connector, targetPortLocation, true);
                    if (segment.type == "bezier") this._updateBezierPoints(segment, targetNode, targetPort, targetBounds, sourceNode, sourcePort, sourceBounds);
                }
            }
        },
        _findEndPoint: function (direction, point, node) {
            var targetPoint;
            switch (direction) {
                case "top":
                    targetPoint = { x: point.x, y: point.y + Math.max(node.width, node.height) };
                    break;
                case "bottom":
                    targetPoint = { x: point.x, y: point.y - Math.max(node.width, node.height) };
                    break;
                case "left":
                    targetPoint = { y: point.y, x: point.x + Math.max(node.width, node.height) };
                    break;
                case "right":
                    targetPoint = { y: point.y, x: point.x - Math.max(node.width, node.height) };
                    break;
            }
            return targetPoint;
        },
        _dock: function (connector, line, targetNode, sourceNode, isTarget) {
            var sourceBounds;
            if (targetNode) {
                var node = targetNode;
                var point = isTarget ? line._startPoint : line._endPoint;
                sourceBounds = this.bounds(targetNode);
                this._swapBounds(targetNode, sourceBounds);
                if (!isTarget) {
                    if (line.type == "orthogonal" && connector.segments[1] && connector.segments[1].type == "orthogonal") {
                        if (connector.segments[0]._isInternal && ej.datavisualization.Diagram.Geometry.containsPoint(sourceBounds, line._endPoint)) {
                            this._insertSegmentAtSourceEnd(connector, line, sourceBounds, targetNode, isTarget);
                        }
                        else if (ej.datavisualization.Diagram.Geometry.containsPoint(sourceBounds, line._endPoint)) {
                            this._removeFirstSegment(connector, line, sourceBounds, targetNode, isTarget);
                        }
                        else {
                            var dockPoint, dockDirection;;
                            switch (line.direction) {
                                case "left":
                                    dockDirection = "left";
                                    dockPoint = sourceBounds.middleLeft;
                                    break;
                                case "right": dockDirection = "right";
                                    dockPoint = sourceBounds.middleRight;
                                    break;
                                case "top": dockDirection = "top";
                                    dockPoint = sourceBounds.topCenter;
                                    break;
                                case "bottom": dockDirection = "bottom";
                                    dockPoint = sourceBounds.bottomCenter;
                                    break;
                            }
                            line.points = [];
                            var targetPoint = this._findEndPoint(dockDirection, dockPoint, targetNode) || sourceBounds.center;
                            dockPoint = this._findIntersection(targetNode, sourceBounds, connector, dockPoint, targetPoint, isTarget) || dockPoint;
                            line.points.push(dockPoint);
                            line.points.push(line._endPoint);
                            this._setLineEndPoint(connector, dockPoint, isTarget);
                        }
                    }
                    else {
                        this._dockNodeToPoint(connector, line._endPoint, targetNode, isTarget);
                    }
                }
                else {
                    if (line.type == "orthogonal") {
                        var second = connector.segments[connector.segments.length - 2];
                        if (second && second.type == "orthogonal") {
                            if (line.points.length > 2 &&
                                ej.datavisualization.Diagram.Geometry.containsPoint(sourceBounds, line.points[line.points.length - 2])) {
                                var removePreSegment = false;
                                if (second.direction == "top" || second.direction == "bottom") {
                                    if (second._endPoint.x >= sourceBounds.left && second._endPoint.x <= sourceBounds.right) {
                                        this._removeLastSegment(connector, line, second, targetNode, sourceNode, isTarget); return;
                                    }
                                    else {
                                        second._length = second.length = Math.abs(second._startPoint.y - sourceBounds.middleLeft.y);;
                                        if (second.length == 0) {
                                            removePreSegment = true;
                                        }
                                        else {
                                            if (second.length < 0) {
                                                second._length = second.length *= -1;
                                                second._direction = second.direction = (second.direction == "top") ? "bottom" : "top";
                                            }
                                            connector.targetPoint = second._endPoint.x > sourceBounds.right ? sourceBounds.middleRight : sourceBounds.middleLeft;
                                        }
                                    }
                                }
                                else {
                                    if (second._endPoint.y >= sourceBounds.top && second._endPoint.y <= sourceBounds.bottom) {
                                        this._removeLastSegment(connector, line, second, targetNode, sourceNode, isTarget); return;
                                    }
                                    else {
                                        second._length = second.length = Math.abs(second._startPoint.x - sourceBounds.topCenter.x);;
                                        if (second.length == 0) removePreSegment = true;
                                        else {
                                            if (second.length < 0) {
                                                second._length = second.length *= -1;
                                                second._direction = second.direction = (second.direction == "left") ? "right" : "left";
                                            }
                                            connector.targetPoint = second._endPoint.y > sourceBounds.bottom ? sourceBounds.bottomCenter : sourceBounds.topCenter;
                                        }
                                    }
                                }
                                if (removePreSegment) {
                                    connector.segments.splice(connector.segments.length - 2, 1);
                                    this._dock(connector, line, targetNode, sourceNode, isTarget);
                                    return;
                                }
                                connector.targetPoint = this._findIntersection(targetNode, sourceBounds, connector, connector.targetPoint, sourceBounds.center, isTarget) || connector.targetPoint;
                                this._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort);
                                line._direction = this._getOrthoDirection(line._startPoint, line._endPoint, second);
                                this._setLineEndPoint(connector, connector.targetPoint, isTarget);
                            }
                            else if (ej.datavisualization.Diagram.Geometry.containsPoint(sourceBounds, line._startPoint)) {
                                var diflength = second.direction == "left" || second.direction == "right" ? node.width / 2 : node.height / 2;
                                second._length = second.length -= diflength + 30;
                                if (second.length == 0) {
                                    connector.segments.splice(connector.segments.length - 2, 1);
                                    this._dock(connector, line, targetNode, sourceNode, isTarget);
                                    return;
                                }
                                if (second.direction == "left" || second.direction == "right")
                                    connector.targetPoint = second.direction == "right" ? sourceBounds.middleLeft : sourceBounds.middleRight;
                                else
                                    connector.targetPoint = second.direction == "bottom" ? sourceBounds.topCenter : sourceBounds.bottomCenter;
                                connector.targetPoint = this._findIntersection(targetNode, sourceBounds, connector, connector.targetPoint, sourceBounds.center, isTarget) || connector.targetPoint;
                                this._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort);
                                line._direction = this._getOrthoDirection(line._startPoint, line._endPoint, second);
                                this._setLineEndPoint(connector, connector.targetPoint, isTarget);
                            }
                            else {
                                this._dockNodeToPoint(connector, point, targetNode, isTarget);
                            }
                        } else {
                            this._dockNodeToPoint(connector, point, targetNode, isTarget);
                        }
                    }
                    else { this._dockNodeToPoint(connector, point, targetNode, isTarget); }
                }
            }
        },
        _removeLastSegment: function (connector, line, second, targetNode, sourceNode, isTarget) {
            connector.segments.splice(connector.segments.length - 1, 1);
            second.length = second._length = null;
            second.direction = null;
            second._direction = line._direction;
            this._dock(connector, second, targetNode, sourceNode, isTarget);
        },
        _insertSegmentAtSourceEnd: function (connector, line, sourceBounds, sourceNode, isTarget) {
            var second = connector.segments[1];
            var third = connector.segments[2];
            if (connector.segments[0].direction == "left" || connector.segments[0].direction == "right") {
                var orientation = "horizontal";
                connector.sourcePoint = second.direction == "top" ? sourceBounds.topCenter : sourceBounds.bottomCenter;
                if (second && (second.length || second.length === 0))
                    second._length = second.length = Math.max(Math.abs(connector.sourcePoint.y - second._endPoint.y), 25);
                if (third && (third.length || third.length === 0)) {
                    third.length = third._length = Math.abs(sourceBounds.topCenter.x - third._endPoint.x);
                }
            }
            else {
                var orientation = "vertical";
                connector.sourcePoint = second.direction == "left" ? sourceBounds.middleLeft : sourceBounds.middleRight;
                if (second && (second.length || second.length === 0))
                    second._length = second.length = Math.max(Math.abs(connector.sourcePoint.x - second._endPoint.x), 25);
                if (third && (third.length || third.length === 0)) {
                    third.length = third._length = Math.abs(sourceBounds.middleRight.y - third._endPoint.y);
                }
            }
            //Updating adjacent segments
            if (connector.segments[3] && (connector.segments[3].length || connector.segments[3].length == 0)) {
                var value = second.direction == "bottom" || second.direction == "right" ? second.length : -second.length;
                connector.segments[3].length = connector.segments[3]._length = orientation == "vertical" ?
                    Math.abs(connector.sourcePoint.x + value - connector.segments[3]._endPoint.x) :
                    Math.abs(connector.sourcePoint.y + value - connector.segments[3]._endPoint.y);
                if (connector.segments[3].length < 0) {
                    var value = second.direction == "bottom" || second.direction == "right" ? second.length : -second.length;
                    connector.segments[3].length = connector.segments[3]._length = orientation == "vertical" ?
                        Math.abs(connector.sourcePoint.x + value - connector.segments[3]._endPoint.x) :
                    Math.abs(connector.sourcePoint.y + value - connector.segments[3]._endPoint.y);
                }
            }
            connector.segments.splice(0, 1);
            connector.sourcePoint = this._findIntersection(sourceNode, sourceBounds, connector, connector.sourcePoint, sourceBounds.center, isTarget) || connector.sourcePoint;
            this._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort);
            this._setLineEndPoint(connector, connector.sourcePoint, isTarget);
        },
        _removeFirstSegment: function (connector, line, sourceBounds, sourceNode, isTarget) {
            var newLength, firstSegLength;
            var direction = connector.segments[1].direction || this._getBezierDirection(connector.segments[1].points[0], connector.segments[1].points[1]);
            if (direction == "left" || direction == "right") {
                var length = line._endPoint.y - sourceBounds.middleRight.y;
                connector.segments[0].direction = connector.segments[0]._direction = length >= 0 ? "bottom" : "top";
                connector.segments[0].length = connector.segments[0]._length = Math.abs(length);
                var actualdist = direction == "right" ? connector.segments[1]._endPoint.x - sourceBounds.right :
                    sourceBounds.left - connector.segments[1]._endPoint.x;
                connector.sourcePoint = direction == "left" ? sourceBounds.middleLeft : sourceBounds.middleRight;
                newLength = Math.abs(connector.sourcePoint.x - connector.segments[0]._startPoint.x);
                firstSegLength = Math.abs(connector.sourcePoint.y - connector.segments[0]._endPoint.y);
            }
            else {
                if (connector.segments[0].length || connector.segments[0].length == 0) {
                    var length = line._endPoint.x - sourceBounds.bottomCenter.x;
                    connector.segments[0].direction = connector.segments[0]._direction = length >= 0 ? "right" : "left";
                    connector.segments[0].length = connector.segments[0]._length = Math.abs(length);
                }
                var actualdist = direction == "bottom" ? connector.segments[1]._endPoint.y - sourceBounds.bottom :
                    sourceBounds.top - connector.segments[1]._endPoint.y;
                connector.sourcePoint = direction == "top" ? sourceBounds.topCenter : sourceBounds.bottomCenter;
                newLength = Math.abs(connector.sourcePoint.y - connector.segments[0]._startPoint.y);
                firstSegLength = Math.abs(connector.sourcePoint.x - connector.segments[0]._endPoint.x);
            }
            if (connector.segments[1] && (connector.segments[1].length || connector.segments[1].length === 0)) {
                connector.segments[1]._length = connector.segments[1].length = actualdist - 25;
                if (connector.segments[1]._length < 0) {
                    connector.segments.splice(0, 2);
                    if (connector.segments[0].length || connector.segments[0].length === 0)
                        connector.segments[0].length = connector.segments[0]._length = newLength;
                    var newSegment = ej.datavisualization.Diagram.Segment({ type: "orthogonal", length: firstSegLength, direction: direction });
                }
            }
            if (!newSegment) {
                newSegment = ej.datavisualization.Diagram.Segment({ type: "orthogonal", length: 25, direction: direction });
            }
            var segments = [newSegment];
            newSegment._isInternal = true;
            connector.segments = segments.concat(connector.segments);
            connector.sourcePoint = this._findIntersection(sourceNode, sourceBounds, connector, connector.sourcePoint, sourceBounds.center, isTarget) || connector.sourcePoint;
            this._updateConnectorSegments(connector, connector.sourcePort, connector.targetPort);
            this._setLineEndPoint(connector, connector.sourcePoint, isTarget);
        },
        _dockNodeToPoint: function (connector, fixedPoint, node, isTarget) {
            var line, sourceBounds, segment;
            line = isTarget ? connector.segments[connector.segments.length - 1] : connector.segments[0];
            if (line.type != "orthogonal") {
                sourceBounds = this.bounds(node);
                this._swapBounds(node, sourceBounds);
                this._setLineEndPoint(connector, sourceBounds.center, isTarget);
                this._dockBounds(connector, node, sourceBounds, isTarget);
            }
            else {
                sourceBounds = this.bounds(node);
                this._swapBounds(node, sourceBounds);
                var dockPoint, dockDirection, targetDirection;
                var point = fixedPoint;
                if (connector.segments.length > 1) {
                    var prev = connector.segments[connector.segments.length - 2];
                    var left = Math.abs(point.x - sourceBounds.left);
                    var right = Math.abs(point.x - sourceBounds.right);
                    var top = Math.abs(point.y - sourceBounds.top);
                    var bottom = Math.abs(point.y - sourceBounds.bottom);
                    if (prev && isTarget) {
                        var horizontal = prev.direction == "left" || prev.direction == "right";
                        var vertical = prev.direction == "top" || prev.direction == "bottom";
                    }
                    line = !isTarget ? connector.segments[0] : connector.segments[connector.segments.length - 1];
                    if ((line.points.length == 2 || !prev) && line.type == "orthogonal") {
                        horizontal = vertical = false;
                    }
                    var targetPoint;
                    if (sourceBounds.bottom < point.y && !horizontal) {
                        dockDirection = "bottom";
                        targetDirection = "top";
                        dockPoint = sourceBounds.bottomCenter;
                    }
                    else if (sourceBounds.y > point.y && !horizontal) {
                        dockDirection = "top";
                        targetDirection = "bottom";
                        dockPoint = sourceBounds.topCenter;
                    }
                    else if (sourceBounds.right < point.x && !vertical) {
                        dockDirection = "right";
                        targetDirection = "left";
                        dockPoint = sourceBounds.middleRight;
                    }
                    else if (sourceBounds.x > point.x && !vertical) {
                        dockDirection = "left";
                        targetDirection = "right";
                        dockPoint = sourceBounds.middleLeft;
                    }
                    else {
                        var min = left;
                        dockPoint = sourceBounds.middleLeft;
                        dockDirection = "left";
                        targetDirection = "right";
                        if (min >= right && right != 0) {
                            dockPoint = sourceBounds.middleRight;
                            dockDirection = "right";
                            targetDirection = "left";
                            min = right;
                        }
                        if (min > top && top != 0) {
                            dockPoint = sourceBounds.topCenter;
                            dockDirection = "top";
                            targetDirection = "bottom";
                            min = top;
                        }
                        if (min > bottom && bottom != 0) {
                            dockPoint = sourceBounds.bottomCenter;
                            dockDirection = "bottom";
                            targetDirection = "top";
                            min = bottom;
                        }
                    }
                }
                else {
                    dockPoint = sourceBounds.center;
                    dockDirection = this._getBezierDirection(fixedPoint, dockPoint);
                    switch (dockDirection) {
                        case "left":
                            targetDirection = "right";
                            break;
                        case "right":
                            targetDirection = "left";
                            break;
                        case "top":
                            targetDirection = "bottom";
                            break;
                        case "bottom":
                            targetDirection = "top";
                            break;
                    }
                }
                if (dockPoint) {
                    if (isTarget || connector.segments.length == 1) {
                        segment = connector.segments[connector.segments.length - 1];
                        if (segment.type == "orthogonal") {
                            segment._direction = isTarget ? dockDirection : targetDirection;
                        }
                    }
                    else { segment = connector.segments[0]; }
                    targetPoint = this._findEndPoint(dockDirection, dockPoint, node) || sourceBounds.center;
                    dockPoint = this._findIntersection(node, sourceBounds, connector, dockPoint, targetPoint, isTarget) || dockPoint;
                    isTarget ? connector.targetPoint = dockPoint : connector.sourcePoint = dockPoint;
                    if (connector.segments.length != 1)
                        this._addOrthogonalPoints(segment, !isTarget ? null : connector.segments[connector.segments.length - 2], !isTarget ? connector.segments[1] : null, connector.sourcePoint, connector.targetPoint);
                    this._setLineEndPoint(connector, dockPoint, isTarget);
                }
            }
        },
        _getDockSegment: function (connector, line, rotateAngle, bounds, isTarget, direction) {
            var segment; var segments = this._getEdges(rotateAngle, bounds);
            {
                var direction = "", segment, intersecSeg;
                //var line = connector.line;
                var length = ej.datavisualization.Diagram.Geometry.distance(line._startPoint, line._endPoint);
                if (isTarget)
                    intersecSeg = ej.datavisualization.Diagram.LineSegment(line.points[line.points.length - 2], line.points[line.points.length - 1]);
                else {
                    if (length > 5) {
                        intersecSeg = ej.datavisualization.Diagram.LineSegment(line._startPoint, line._endPoint);
                    }
                    else {
                        intersecSeg = ej.datavisualization.Diagram.LineSegment(line._startPoint, connector.segments[1] ? connector.segments[1]._endPoint : connector.targetPoint);
                    }
                }
                if (ej.datavisualization.Diagram.Geometry.intersectSegment(intersecSeg, segments.left)) {
                    segment = segments.left;
                    direction = "left";
                }
                else if (ej.datavisualization.Diagram.Geometry.intersectSegment(intersecSeg, segments.top)) {
                    segment = segments.top;
                    direction = "top";
                }
                else if (ej.datavisualization.Diagram.Geometry.intersectSegment(intersecSeg, segments.right)) {
                    segment = segments.right;
                    direction = "right";
                }
                else if (ej.datavisualization.Diagram.Geometry.intersectSegment(intersecSeg, segments.bottom)) {
                    segment = segments.bottom;
                    direction = "bottom";
                }
            }
            direction = this._swapDirection(rotateAngle, direction);
            if (segment) {
                return { "dockPoint": ej.datavisualization.Diagram.Geometry.midPoint(segment), "direction": direction };
            }
            return null;
        },
        _dockBounds: function (connector, node, bounds, isTarget) {
            var line;
            line = isTarget ? connector.segments[connector.segments.length - 1] : connector.segments[0];
            var strPt = line._startPoint;
            var endPt = line._endPoint || line.point;
            if (line.type == "bezier" && (line.point1 || line.point2)) {
                if (isTarget) strPt = line._point2;
                else endPt = line._point1;
            }
            var intersection = this._findIntersection(node, bounds, connector, strPt, endPt, isTarget);
            if (intersection) {
                this._setLineEndPoint(connector, intersection, isTarget);
                if (line.type === "bezier") {
                    this._updateBezierPoints(line);
                }
            }
        },
        _findIntersection: function (node, bounds, connector, strPt, endPt, isTarget) {
            var segmentPoints, length;
            var line = isTarget ? connector.segments[connector.segments.length - 1] : connector.segments[0];
            var pad = node.connectorPadding;
            pad += isTarget ? connector.targetPadding : connector.sourcePadding;
            if (line.type == "orthogonal") {
                strPt = { x: strPt.x, y: strPt.y };
                if (strPt.x == endPt.x) if (strPt.y < endPt.y) strPt.y -= pad + 5; else strPt.y += pad + 5;
                if (strPt.y == endPt.y) if (strPt.x < endPt.x) strPt.x -= pad + 5; else strPt.x += pad + 5;
            }
            var angle;
            var point = isTarget || line.type == "orthogonal" ? strPt : endPt;
            if (line.type != "orthogonal") {
                if (isTarget) {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(strPt, endPt);
                    endPt = ej.datavisualization.Diagram.Geometry.transform({ x: endPt.x, y: endPt.y }, angle, Math.max(node.width / 2, node.height / 2));
                }
                else {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(endPt, strPt);
                    strPt = ej.datavisualization.Diagram.Geometry.transform({ x: strPt.x, y: strPt.y }, angle, Math.max(node.width / 2, node.height / 2));
                }
            }
            if (node._shape === "ellipse") {
                var thisSegment = ej.datavisualization.Diagram.LineSegment(strPt, endPt);
                intersection = this._getEllipseIntersectCoords(node, thisSegment, connector, point, isTarget);
                return intersection;
            }
            else if (node._shape === "polygon" && !(node.type == "bpmn" && line.type == "orthogonal")) {
                segmentPoints = [];
                if (!node._segmentPoints) {
                    segmentPoints = this._findSegmentPoints(node, connector, isTarget);
                } else segmentPoints = node._segmentPoints;

                if (node.rotateAngle) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                }
                length = segmentPoints.length;
                var pts = [];
                for (var i = 0; i < length; i++) {
                    var pt1 = ej.datavisualization.Diagram.Point(segmentPoints[i].x + (node.offsetX - node.width * node.pivot.x), segmentPoints[i].y + (node.offsetY - node.height * node.pivot.y));
                    if (node.rotateAngle != 0) {
                        pt1 = ej.Matrix.transform(matrix, pt1);
                    }
                    if (node.connectorPadding || connector.sourcePadding || connector.targetPadding) {
                        var x = node.offsetX == pt1.x ? 0 : (node.offsetX < pt1.x ? 1 : -1);
                        var y = node.offsetY == pt1.y ? 0 : (node.offsetY < pt1.y ? 1 : -1);
                        pt1 = pad ? ej.datavisualization.Diagram.Geometry.translate(pt1, x * pad, y * pad) : pt1;
                    }
                    pts[i] = pt1;
                }
                segmentPoints = pts;
            }
            else if (node.pathData && node._shape === "path" && !(node.type == "bpmn" && line.type == "orthogonal")) {
                if (!node._segmentPoints) {
                    var pts = this._findSegmentPoints(node, connector, isTarget);
                }
                segmentPoints = pts || node._segmentPoints;
                if (((node.pathData.split("m").length - 1) + (node.pathData.split("M").length - 1)) == 1) segmentPoints[segmentPoints.length] = segmentPoints[0];
                length = segmentPoints.length;
            }
            else {
                if (node.connectorPadding || connector.sourcePadding || connector.targetPadding) {
                    var rect = ej.datavisualization.Diagram.Rectangle(bounds.x - pad, bounds.y - pad, node.width + 2 * pad, node.height + 2 * pad);
                    bounds = this.bounds(rect);
                }
                segmentPoints = bounds.points;
                segmentPoints[segmentPoints.length] = segmentPoints[0];
                length = bounds.points.length;
            }
            var thisSegment = ej.datavisualization.Diagram.LineSegment(strPt, endPt);
            var intersection = this._getIntersectionPoints(thisSegment, segmentPoints, true, point);
            return intersection;
        },
        _getIntersectionPoints: function (thisSegment, segmentPoints, minimal, point) {
            var i;
            var length = segmentPoints.length;
            var segment = ej.datavisualization.Diagram.LineSegment(segmentPoints[0], segmentPoints[1]);
            var intersection = ej.datavisualization.Diagram.Geometry.intersectSegment(thisSegment, segment);
            if (intersection) {
                if (!minimal) return intersection;
                var min = ej.datavisualization.Diagram.Geometry.distance(intersection, point);
            }
            //if (intersection)
            if (isNaN(min) || min > 0) {
                for (i = 1; i < length - 1 ; i++) {
                    segment = ej.datavisualization.Diagram.LineSegment(segmentPoints[i], segmentPoints[i + 1]);
                    var intersect = ej.datavisualization.Diagram.Geometry.intersectSegment(thisSegment, segment);
                    if (intersect) {
                        if (!minimal) return intersect;
                        var dist = ej.datavisualization.Diagram.Geometry.distance(intersect, point);
                        if (isNaN(min) || min > dist) { min = dist; intersection = intersect; }
                        if (min >= 0 && min <= 1)
                            break;
                    }
                }
            }
            return intersection;
        },

        _findSegmentPoints: function (node, connector, isTarget) {
            var pts = [];
            if (node._shape == "path") {
                var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
                document.body.appendChild(svg);
                var pathNode = document.createElementNS('http://www.w3.org/2000/svg', "path");
                pathNode.setAttributeNS(null, "d", node._absolutePath || node.pathData);
                svg.appendChild(pathNode);
                var pathBounds = (!node._absoluteBounds || node._scaled || node._absolutePath) ? pathNode.getBBox() : node._absoluteBounds;
                var pad = node.connectorPadding;
                if (connector)
                    pad += isTarget ? connector.targetPadding : connector.sourcePadding;
                if (pad || !node._absolutePath || node._scaled) {
                    var pathData = ej.datavisualization.Diagram.Geometry.updatePath(-pad, -pad, node.width + 2 * pad, node.height + 2 * pad, node._absolutePath || node.pathData, null, pathBounds, pad ? null : node);
                    pathNode.setAttributeNS(null, "d", pathData);
                    if ((node._scaled && !pad) || !node._absolutePath) {
                        node._absolutePath = pathData;
                        node._scaled = false;
                    }
                } else pathNode.setAttributeNS(null, "d", node._absolutePath);
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
                var pathLength = pathNode.getTotalLength();
                for (var sample, sampleLength = 0; sampleLength <= pathLength; sampleLength += 10) {
                    sample = pathNode.getPointAtLength(sampleLength);
                    var pt1 = { x: node.offsetX - node.width * node.pivot.x + sample.x, y: node.offsetY - node.height * node.pivot.y + sample.y };
                    if (node.rotateAngle != 0) {
                        pt1 = ej.Matrix.transform(matrix, pt1);
                    }
                    pts.push(pt1);
                }
                document.body.removeChild(svg);
            }
            else if (node._shape == "polygon") {
                var length = node.points.length;
                for (var i = 0; i < length; i++) pts[i] = node.points[i];
                ej.datavisualization.Diagram.Geometry.updatePolygonPoints(node, pts);
                pts[pts.length] = pts[0];
            } else return null;
            return pts;
        },
        _getEdges: function (rotateAngle, bounds) {
            var points = bounds.points;
            var segments = {};
            var angle = rotateAngle % 360;
            var temp;
            segments.left = ej.datavisualization.Diagram.LineSegment(points[3], points[0]);
            segments.top = ej.datavisualization.Diagram.LineSegment(points[0], points[1]);
            segments.right = ej.datavisualization.Diagram.LineSegment(points[1], points[2]);
            segments.bottom = ej.datavisualization.Diagram.LineSegment(points[2], points[3]);
            if (angle < 0) {
                angle += 360;
            }
            if (angle > 315 || angle < 45) {
            }
            else if (angle < 135) {
                temp = segments.top;
                segments.top = segments.left;
                segments.left = segments.bottom;
                segments.bottom = segments.right;
                segments.right = temp;
            }
            else if (angle < 225) {
                temp = segments.top;
                segments.top = segments.bottom;
                segments.bottom = temp;
                temp = segments.left;
                segments.left = segments.right;
                segments.right = temp;
            }
            else {
                temp = segments.bottom;
                segments.bottom = segments.left;
                segments.left = segments.top;
                segments.top = segments.right;
                segments.right = temp;
            }
            return segments;
        },
        _pointsFromNodeToPoint: function (connector, segment, direction, bounds, angle, point, endPoint, isTarget) {
            var dir, num;
            var minSpace = isTarget ? connector._tarDecoratorSize : connector._srcDecoratorSize;
            var points = [];
            points.push(point);
            var straight;
            straight = (point.y == endPoint.y && (direction == "left" && endPoint.x < point.x || direction == "right" && endPoint.x > point.x)) ||
               (point.x == endPoint.x && (direction == "top" && endPoint.y < point.y || direction == "bottom" && endPoint.y > point.y));
            //if (angle == 0)
            //if (!straight && !isTarget) straight = point.x > bounds.left && point.x < bounds.right && point.y > bounds.top && point.y < bounds.bottom;
            if (!straight) {
                if (direction == "top" || direction == "bottom") {
                    if (direction == "top" && endPoint.y < point.y && endPoint.y > point.y - minSpace || direction == "bottom" && endPoint.y > point.y && endPoint.y < point.y + minSpace) {
                        var y = direction == "top" ? bounds.top - minSpace : bounds.bottom + minSpace;
                        points.push({ x: point.x, y: y });
                        points.push({ x: point.x + (endPoint.x - point.x) / 2, y: y });
                        points.push({ x: point.x + (endPoint.x - point.x) / 2, y: endPoint.y });
                    }
                    else if (Math.abs(point.x - endPoint.x) > minSpace && (direction == "top" && endPoint.y < point.y || direction == "bottom" && endPoint.y > point.y)) {
                        //twosegments
                        points.push({ x: point.x, y: endPoint.y });
                    }
                    else if (Math.abs(point.x - endPoint.x) <= minSpace || ((endPoint.x < bounds.left || endPoint.x > bounds.right) && endPoint.y != point.y)) {
                        //three segments
                        var y = direction == "top" ? bounds.top - minSpace : bounds.bottom + minSpace;
                        points.push({ x: point.x, y: y });
                        points.push({ x: endPoint.x, y: y });
                    }
                    else {
                        //four segments
                        var y = direction == "top" ? bounds.top - minSpace : bounds.bottom + minSpace;
                        var x = (endPoint.x < point.x) ? bounds.left - minSpace : bounds.right + minSpace;
                        points.push({ x: point.x, y: y });
                        points.push({ x: x, y: y });
                        points.push({ x: x, y: endPoint.y });
                    }
                }
                else {
                    if (direction == "left" && endPoint.x < point.x && endPoint.x > point.x - minSpace || direction == "right" && endPoint.x > point.x && endPoint.x < point.x + minSpace) {
                        var x = direction == "left" ? bounds.left - minSpace : bounds.right + minSpace;
                        points.push({ x: x, y: point.y });
                        points.push({ x: x, y: point.y + (endPoint.y - point.y) / 2 });
                        points.push({ x: endPoint.x, y: point.y + (endPoint.y - point.y) / 2 });
                    }
                    else if (Math.abs(point.y - endPoint.y) > minSpace && (direction == "left" && endPoint.x < point.x || direction == "right" && endPoint.x > point.x)) {
                        points.push({ x: endPoint.x, y: point.y });
                        //twosegments
                    }
                    else if (Math.abs(point.y - endPoint.y) <= minSpace || ((endPoint.y < bounds.top || endPoint.y > bounds.bottom) && endPoint.x != point.x)) {
                        //three segments
                        var x = direction == "left" ? bounds.left - minSpace : bounds.right + minSpace;
                        points.push({ x: x, y: point.y });
                        points.push({ x: x, y: endPoint.y });
                    }
                    else {
                        //four segments
                        var y = (endPoint.y < point.y) ? bounds.top - minSpace : bounds.bottom + minSpace;
                        var x = direction == "left" ? bounds.left - minSpace : bounds.right + minSpace;
                        points.push({ x: x, y: point.y });
                        points.push({ x: x, y: y });
                        points.push({ x: endPoint.x, y: y });
                    }
                }
            }
            points.push(endPoint);
            if (isTarget) points.reverse();
            segment._startPoint = points[0];
            segment._endPoint = points[points.length - 1];
            segment.points = points;
            if (segment.direction) {
                if (segment.direction == "left" || segment.direction == "right") {
                    segment.length = segment._length = Math.abs(segment._startPoint.x - segment._endPoint.x);
                    if (segment._startPoint.x < segment._endPoint.x) segment._direction = segment.direction = "right"; else segment._direction = segment.direction = "left";
                }
                else {
                    segment.length = segment._length = Math.abs(segment._startPoint.y - segment._endPoint.y);
                    if (segment._startPoint.y < segment._endPoint.y) segment._direction = segment.direction = "bottom"; else segment._direction = segment.direction = "top";
                }
            }
        },
        _constructSegements: function (connector, segment, targetBounds, targetPortLocation, targetDirection, sourceBounds, sourcePortLocation, sourceDirection) {
            var points, reverse;
            if (sourceDirection === "right") {
                if (targetDirection === "left") {
                    points = this._rightToLeft(connector, segment, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
                else if (targetDirection === "right") {
                    points = this._rightToRight(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation);
                }
                else if (targetDirection === "top") {
                    points = this._rightToTop(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
                else if (targetDirection === "bottom") {
                    points = this._rightToBottom(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
            }
            if (sourceDirection === "left") {
                if (targetDirection === "right") {
                    points = this._rightToLeft(connector, segment, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "left") {
                    points = this._leftToLeft(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation);
                }
                if (targetDirection === "top") {
                    points = this._leftToTop(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
                if (targetDirection === "bottom") {
                    points = this._leftToBottom(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
            }
            if (sourceDirection === "top") {
                if (targetDirection === "left") {
                    points = this._leftToTop(connector, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "right") {
                    points = this._rightToTop(connector, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "top") {
                    points = this._topToTop(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation);
                }
                if (targetDirection === "bottom") {
                    points = this._topToBottom(connector, segment, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, false);
                }
            }
            if (sourceDirection === "bottom") {
                if (targetDirection === "left") {
                    points = this._leftToBottom(connector, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "right") {
                    points = this._rightToBottom(connector, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "top") {
                    points = this._topToBottom(connector, segment, sourceBounds, sourcePortLocation, targetBounds, targetPortLocation, true);
                    reverse = true;
                }
                if (targetDirection === "bottom") {
                    points = this._bottomToBottom(connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation);
                }
            }
            if (reverse) {
                points.reverse();
            }
            var point1 = points[points.length - 1];
            var point2 = points[points.length - 2];
            while (points.length > 2 && point1.x == point2.x && point1.y == point2.y) {
                points.splice(points.length - 1, 1);
                point1 = points[points.length - 1];
                point2 = points[points.length - 2];
            }
            point1 = points[0];
            point2 = points[1];
            while (points.length > 2 && point1.x == point2.x && point1.y == point2.y) {
                points.splice(0, 1);
                point1 = points[0];
                point2 = points[1];
            }
            segment._startPoint = points[0];
            segment._endPoint = points[points.length - 1];
            segment.points = points;
            //this._setPoints(connector.line, points);
        },
        _updateIntermediateSegments: function (connector) {
            var startPoint = connector.segments[0]._endPoint;
            var prev = connector.segments[0];
            var length = prev.points.length;
            var next = null;
            var runAngle;
            if (connector.segments[1]) {
                var segment = connector.segments[1];
                segment._startPoint = startPoint;
                if (segment.type == "orthogonal" && (segment.length || segment.length === 0)) {
                    if (segment.direction == "left" || segment.direction == "right") {
                        if (connector.segments[2]) {
                            if (connector.segments[2].length || connector.segments[2].length === 0) {
                                if (connector.segments[2].direction == "top")
                                    connector.segments[2].length += segment._startPoint.y - segment._endPoint.y;
                                else
                                    connector.segments[2].length -= segment._startPoint.y - segment._endPoint.y;
                                if (connector.segments[2].length < 0) {
                                    connector.segments[2].length *= -1;
                                    connector.segments[2].direction = connector.segments[2]._direction = connector.segments[2]._direction == "bottom" ? "top" : "bottom";
                                }
                                connector.segments[2]._length = connector.segments[2].length;
                            }
                        }
                        segment._endPoint.y = segment._startPoint.y;
                    }
                    else {
                        if (connector.segments[2]) {
                            if (connector.segments[2].length || connector.segments[2].length === 0) {
                                if (connector.segments[2].direction == "left")
                                    connector.segments[2].length += segment._startPoint.x - segment._endPoint.x;
                                else
                                    connector.segments[2].length -= segment._startPoint.x - segment._endPoint.x;
                                if (connector.segments[2].length < 0) {
                                    connector.segments[2].length *= -1;
                                    connector.segments[2].direction = connector.segments[2]._direction = connector.segments[2]._direction == "right" ? "left" : "right";
                                }
                                connector.segments[2]._length = connector.segments[2].length;
                            }
                        }
                        segment._endPoint.x = segment._startPoint.x;
                    }
                    if (connector.sourcePort && prev.points.length > 2) {
                        if (segment.direction == "left" || segment.direction == "right") {
                            if (prev.points[prev.points.length - 1].y == prev.points[prev.points.length - 2].y) {
                                segment._startPoint = segment.points[0] = prev.points[prev.points.length - 2];
                                prev.points.splice(prev.points.length - 1, 1);
                                prev._endPoint = prev.points[prev.points.length - 1];
                                if (segment.points.length == 2) {
                                    segment._endPoint.y = segment._startPoint.y;
                                }
                            }
                        }
                        else {
                            if (prev.points[prev.points.length - 1].x == prev.points[prev.points.length - 2].x) {
                                segment._startPoint = segment.points[0] = prev.points[prev.points.length - 2];
                                prev.points.splice(prev.points.length - 1, 1);
                                prev._endPoint = prev.points[prev.points.length - 1];
                                if (segment.points.length == 2) {
                                    segment._endPoint.x = segment._startPoint.x;
                                }
                            }
                        }
                    }
                    if (segment.length || segment.length === 0)
                        segment.length = segment._length = ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, segment.points[1]);
                    if (segment.length > 0)
                        segment.direction = segment._direction = this._getBezierDirection(segment._startPoint, segment._endPoint) || segment._direction;
                    this._addOrthogonalPoints(segment, prev, connector.segments[2], connector.sourcePoint, connector.targetPoint);
                    if (connector.segments[2])
                        this._addOrthogonalPoints(connector.segments[2], connector.segments[1], connector.segments[3], connector.sourcePoint, connector.targetPoint);
                }
                else if (segment.type == "orthogonal" && segment.length === null) {
                    if (connector.sourcePort && prev.points.length > 2) {
                        if (segment._direction == "left" || segment._direction == "right") {
                            if (prev.points[prev.points.length - 1].y == prev.points[prev.points.length - 2].y) {
                                segment._startPoint = segment.points[0] = prev.points[prev.points.length - 2];
                                prev.points.splice(prev.points.length - 1, 1);
                                prev._endPoint = prev.points[prev.points.length - 1];
                            }
                        }
                        else {
                            if (prev.points[prev.points.length - 1].x == prev.points[prev.points.length - 2].x) {
                                segment._startPoint = segment.points[0] = prev.points[prev.points.length - 2];
                                prev.points.splice(prev.points.length - 1, 1);
                                prev._endPoint = prev.points[prev.points.length - 1];
                            }
                        }
                    }
                    segment._startPoint = segment.points[0] = connector.segments[0]._endPoint;
                    this._addOrthogonalPoints(connector.segments[1], connector.segments[0], null, connector.sourcePoint, connector.targetPoint);
                }
                else {
                    segment._startPoint = segment.points[0] = connector.segments[0]._endPoint;
                    if (segment.type == "bezier") {
                        this._updateBezierPoints(segment);
                    }
                }
            }
        },
        _updatePreviousSegment: function (connector) {
            var previousSegment = connector.segments[connector.segments.length - 2];
            var current = connector.segments[connector.segments.length - 1];
            if (previousSegment) {
                if (previousSegment.type == "orthogonal" && current.points.length > 2) {
                    var update = false;
                    var direction = previousSegment.points.length == 2 ? previousSegment.direction :
                        ej.datavisualization.Diagram.Util._getBezierDirection(previousSegment.points[previousSegment.points.length - 2],
                        previousSegment.points[previousSegment.points.length - 1]);
                    if (direction == "left" || direction == "right") {
                        if (current.points[0].y == current.points[1].y) {
                            update = true;
                            var dif = current.points[1].x - current.points[0].x;
                            current.points.splice(0, 1);
                            current._startPoint = current.points[0];
                            previousSegment._endPoint = current.points[0];
                        }
                    }
                    else {
                        if (current.points[0].x == current.points[1].x) {
                            update = true;
                            current.points.splice(0, 1);
                            current._startPoint = current.points[0];
                            previousSegment._endPoint = current.points[0];
                        }
                    }
                }
                previousSegment._endPoint = current._startPoint;
                previousSegment.points[previousSegment.points.length - 1] = current._startPoint;
                if (previousSegment.type == "orthogonal" && update) {
                    previousSegment._length = previousSegment.length = ej.datavisualization.Diagram.Geometry.distance(previousSegment._startPoint, previousSegment._endPoint);
                    if (previousSegment._length > 0)
                        previousSegment._direction = previousSegment.direction = this._getBezierDirection(previousSegment._startPoint, previousSegment._endPoint);
                    if (connector.segments.length > 2 || !connector.sourcePort)
                        this._addOrthogonalPoints(previousSegment, connector.segments[connector.segments.length - 3], current, connector.sourcePoint, connector.targetPoint);
                }
                else {
                    previousSegment.point = current._startPoint;
                }
            }
        },
        _initConnectionEnds: function (connector, diagram) {
            if (connector.segments && connector.segments[0] && connector.segments[0].type == "orthogonal" && connector.segments[0].length) {
                var port, bounds;
                if (connector.sourceNode) {
                    var srcNode = diagram.nameTable[connector.sourceNode];
                    if (srcNode) {
                        bounds = ej.datavisualization.Diagram.Util.bounds(srcNode, true);
                        if (connector.sourcePort) {
                            port = ej.datavisualization.Diagram.Util.findPortByName(diagram.nameTable[connector.sourceNode], connector.sourcePort);
                            connector.sourcePoint = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds);
                        }
                        else {
                            var line = connector.segments[0];
                            switch (line.direction) {
                                case "left":
                                    connector.sourcePoint = bounds.middleLeft;
                                    break;
                                case "right":
                                    connector.sourcePoint = bounds.middleRight;
                                    break;
                                case "top":
                                    connector.sourcePoint = bounds.topCenter;
                                    break;
                                case "bottom":
                                    connector.sourcePoint = bounds.bottomCenter;
                                    break;
                            }
                        }
                    }
                }
                if (connector.targetNode) {
                    var trgNode = diagram.nameTable[connector.targetNode];
                    if (trgNode) {
                        bounds = ej.datavisualization.Diagram.Util.bounds(trgNode, true);
                        if (connector.targetPort) {
                            port = ej.datavisualization.Diagram.Util.findPortByName(diagram.nameTable[connector.targetNode], connector.targetPort);
                            connector.targetPoint = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds);
                        }
                        else {
                            var line = connector.segments[0];
                            switch (line.direction) {
                                case "left":
                                    connector.targetPoint = bounds.middleLeft;
                                    break;
                                case "right":
                                    connector.targetPoint = bounds.middleRight;
                                    break;
                                case "top":
                                    connector.targetPoint = bounds.topCenter;
                                    break;
                                case "bottom":
                                    connector.targetPoint = bounds.bottomCenter;
                                    break;
                            }
                        }
                    }
                }
            }
            else {
                if (connector.sourceNode) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(diagram.nameTable[connector.sourceNode], true);
                    if (connector.sourcePort) {
                        port = ej.datavisualization.Diagram.Util.findPortByName(diagram.nameTable[connector.sourceNode], connector.sourcePort);
                        connector.sourcePoint = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds);
                    }
                    else
                        connector.sourcePoint = bounds.center;
                }
                if (connector.targetNode) {
                    bounds = ej.datavisualization.Diagram.Util.bounds(diagram.nameTable[connector.targetNode], true);
                    if (connector.targetPort) {
                        port = ej.datavisualization.Diagram.Util.findPortByName(diagram.nameTable[connector.targetNode], connector.targetPort);
                        connector.targetPoint = ej.datavisualization.Diagram.Util._getPortPosition(port, bounds);
                    }
                    else
                        connector.targetPoint = bounds.center;
                }
            }
        },
        _swapDirection: function (rotateAngle, direction) {
            var dir;
            var angle = rotateAngle % 360;
            if (angle < 0) {
                angle += 360;
            }
            var dirs;
            if (angle > 315 || angle < 45) {
                dir = direction;
            }
            else if (angle < 135) {
                dirs = { left: "top", top: "right", right: "bottom", bottom: "left" };
                dir = dirs[direction];
            }
            else if (angle < 225) {
                dirs = { left: "right", top: "bottom", right: "left", bottom: "top" };
                dir = dirs[direction];
            }
            else {
                dirs = { left: "bottom", top: "left", right: "top", bottom: "right" };
                dir = dirs[direction];
            }
            return dir;
        },
        _getEllipseIntersectCoords: function (node, connectorSeg, connector, point, isTarget) {
            var segmentPoints = [], intersection;
            var pad = node.connectorPadding;
            if (connector) pad += isTarget ? connector.targetPadding : connector.sourcePadding;
            if (!pad) pad = 0;
            var rx = node.width / 2;
            var ry = node.height / 2;
            //var cx = node.offsetX - node.width * node.pivot.x - pad;
            //var cy = node.offsetY - node.height * node.pivot.y - pad;
            var matrix = ej.Matrix.identity();
            ej.Matrix.rotate(matrix, node.rotateAngle, node.offsetX, node.offsetY);
            //Convert Top Round Side to Path
            var topArchPath = "M " + (node.offsetX - node.width * node.pivot.x - pad) + ", " + (node.offsetY) + " A " + rx + " " + ry + " 0 0 " + 1 + " " + (node.offsetX + node.width * (1 - node.pivot.x) + pad) + ", " + (node.offsetY) +
                 " A " + rx + " " + ry + " 0 0 " + 1 + " " + (node.offsetX - node.width * node.pivot.x - pad) + ", " + (node.offsetY) + "z";
            var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
            path.setAttributeNS(null, "d", topArchPath);
            var len = path.getTotalLength(), pts = [], pt1, pt2, coor;
            for (var i = 0; i < len; i = i + 3) {
                var pathSeg = path.getPointAtLength(i);
                if (node.rotateAngle != 0) {
                    pathSeg = ej.Matrix.transform(matrix, pathSeg);
                }
                pts[pts.length] = pathSeg;
            }
            if (pts[pts.length - 1] != path.getPointAtLength(len)) pts[pts.length] = path.getPointAtLength(len);
            segmentPoints = pts;
            intersection = this._getIntersectionPoints(connectorSeg, segmentPoints, true, point);
            return intersection;
        },
        _rightToLeft: function (connector, segment, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (targetPortLocation.x > sourcePortLocation.x) {
                if (sourcePortLocation.y != targetPortLocation.y) {
                    if ((sourcePortLocation.x) > targetBounds.left) {
                        x = sourceBounds.right + srcExtension;
                        y = sourcePortLocation.y;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (targetPortLocation.y > sourceBounds.top) {
                            y = targetPortLocation.y;
                        }
                        else {
                            y = targetBounds.bottom + tarExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (targetPortLocation.y <= sourceBounds.top) {
                            x = targetBounds.right + tarExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                            y = targetBounds.top - tarExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                            x = targetBounds.left - tarExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                            y = targetPortLocation.y;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                        }
                    }
                    else {
                        if (!segment.direction && segment.length != undefined) x = sourceBounds.right + segment.length;
                        else if (targetBounds.left - sourceBounds.right > 0) x = sourceBounds.right + (targetBounds.left - sourceBounds.right) / 2;
                        else x = sourceBounds.right + srcExtension;
                        y = sourcePortLocation.y;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetPortLocation.y;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            else {
                //5 segment
                if (Math.abs(targetBounds.top - sourceBounds.bottom) < min || Math.abs(targetBounds.bottom - sourceBounds.top) < min) {
                    if ((sourcePortLocation.x) > targetBounds.right) {
                        x = sourcePortLocation.x + srcExtension;
                        y = sourcePortLocation.y;
                    }
                    else {
                        x = targetBounds.right + tarExtension;
                        y = sourcePortLocation.y;
                    }
                }
                else {
                    x = sourceBounds.right + srcExtension;
                    y = sourcePortLocation.y;
                }
                points.push(ej.datavisualization.Diagram.Point(x, y));
                if ((targetBounds.top - sourceBounds.bottom) >= min) {
                    y = targetBounds.top - tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                else if (sourcePortLocation.y > targetPortLocation.y) {
                    if ((sourceBounds.top - targetBounds.bottom) < min) {
                        if (targetBounds.left > sourceBounds.right) y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2
                        else y = Math.min((targetBounds.top - tarExtension), (sourceBounds.top - srcExtension));
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                else {
                    if (targetBounds.left > sourceBounds.right) y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                    else y = Math.max((targetBounds.bottom + tarExtension), (sourceBounds.bottom + srcExtension));
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                x = targetBounds.left - tarExtension;
                points.push(ej.datavisualization.Diagram.Point(x, y));
                y = targetPortLocation.y;
                points.push(ej.datavisualization.Diagram.Point(x, y));
            }
            points.push(targetPortLocation);
            return points;
        },
        _rightToRight: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            if (targetBounds.right >= sourceBounds.left) {
                if (sourcePortLocation.y >= targetBounds.top - tarExtension && sourcePortLocation.y <= targetBounds.bottom + tarExtension) {
                    x = sourcePortLocation.x + srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (sourcePortLocation.y >= targetBounds.center.y) {
                        if (sourcePortLocation.x > targetBounds.left) {
                            if (sourcePortLocation.y > targetPortLocation.y) {
                                y = targetBounds.bottom + tarExtension;
                            }
                            else {
                                y = targetBounds.top - tarExtension;
                            }
                        }
                        else {
                            y = targetBounds.top - tarExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else if (targetBounds.right < sourceBounds.right) {
                    x = sourceBounds.right + srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    //points.push(ej.datavisualization.Diagram.Point(x, targetPortLocation.y));
                } else {
                    x = targetPortLocation.x + tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    //points.push(ej.datavisualization.Diagram.Point(x, targetPortLocation.y));
                }
            }
            else {
                x = sourcePortLocation.x + srcExtension;
                points.push(ej.datavisualization.Diagram.Point(x, y));
                if (targetPortLocation.y >= sourceBounds.top - srcExtension && targetPortLocation.y <= sourceBounds.bottom + srcExtension) {
                    if (targetPortLocation.y <= sourceBounds.center.y) {
                        y = sourceBounds.top - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = sourceBounds.bottom + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            points.push(ej.datavisualization.Diagram.Point(x, targetPortLocation.y));
            points.push(targetPortLocation);
            return points;
        },
        _rightToTop: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (targetPortLocation.x >= sourcePortLocation.x + srcExtension) {
                if ((sourcePortLocation.y + srcExtension) >= targetPortLocation.y && targetBounds.height !== 0) {
                    if (targetBounds.left <= sourceBounds.right) {
                        x = targetBounds.right + tarExtension;
                    }
                    else if ((targetBounds.left - sourceBounds.right) > min) {
                        x = sourceBounds.right + srcExtension;
                    }
                    else {
                        x = sourceBounds.right + (targetBounds.left - sourceBounds.right) / 2;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    y = targetBounds.top - tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
            }
            else {
                if (sourceBounds.bottom + srcExtension > targetBounds.top - tarExtension) {
                    if ((sourcePortLocation.x + srcExtension) <= targetBounds.right) {
                        x = targetBounds.right + tarExtension;
                    }
                    else {
                        x = sourceBounds.right + srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (sourceBounds.top >= targetBounds.top) {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                    }
                    else if (sourceBounds.top >= targetBounds.top - tarExtension)
                        y = targetBounds.top - tarExtension - srcExtension;
                    else {
                        y = sourceBounds.top - srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                else {
                    x = sourcePortLocation.x + srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if ((targetBounds.top - sourceBounds.bottom) < min && targetBounds.height !== 0) {
                        if ((sourceBounds.left - targetBounds.right) >= min) {
                            y = sourceBounds.bottom + srcExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                            x = sourceBounds.left - srcExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                            y = targetBounds.top - tarExtension;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                        }
                        else {
                            y = targetBounds.top - (targetBounds.top - sourceBounds.bottom) / 2;
                            points.push(ej.datavisualization.Diagram.Point(x, y));
                        }
                    }
                    else {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            points.push(targetPortLocation);
            return points;
        },
        _rightToBottom: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (targetPortLocation.x >= sourcePortLocation.x) {
                if (sourcePortLocation.y <= targetBounds.bottom + tarExtension) {
                    if (targetBounds.left > (sourceBounds.right + srcExtension)) {
                        x = sourcePortLocation.x + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if ((sourceBounds.right + srcExtension) > targetPortLocation.x) {
                        x = sourcePortLocation.x + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((sourceBounds.top - targetBounds.bottom) > min) {
                            y = targetBounds.bottom + tarExtension;
                        }
                        else {
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = sourcePortLocation.y;
                    }
                }
            }
            else {
                if (sourcePortLocation.y <= targetBounds.bottom) {
                    if ((sourceBounds.right + srcExtension) > targetBounds.right) {
                        x = sourceBounds.right + srcExtension;
                    }
                    else {
                        x = targetBounds.right + tarExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    y = targetBounds.bottom + tarExtension;
                    if (y <= (sourceBounds.bottom + srcExtension)) {
                        y = sourceBounds.bottom + srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                else {
                    if ((targetBounds.bottom + tarExtension) < sourceBounds.top - srcExtension) {
                        x = sourceBounds.right + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((sourceBounds.top - targetBounds.bottom) < min) {
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        }
                        else {
                            y = targetBounds.bottom + tarExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        x = sourceBounds.right + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = sourceBounds.bottom + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            points.push(targetPortLocation);
            return points;
        },
        _leftToLeft: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (targetPortLocation.x - tarExtension >= sourcePortLocation.x - srcExtension) {
                x = sourceBounds.left - srcExtension;
                points.push(ej.datavisualization.Diagram.Point(x, y));
                if (sourcePortLocation.y > targetPortLocation.y) {
                    if ((targetPortLocation.y + tarExtension) >= sourceBounds.top) {
                        y = sourceBounds.top - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((targetBounds.left - sourceBounds.right) > min) {
                            x = targetBounds.left - tarExtension;
                        }
                        else {
                            x = sourceBounds.right + (targetBounds.left - sourceBounds.right) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = targetPortLocation.y;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetPortLocation.x;
                    }
                }
                else {
                    if ((sourceBounds.bottom + srcExtension) < targetPortLocation.y) {
                        y = targetPortLocation.y;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetPortLocation.x;
                    }
                    else {
                        y = sourceBounds.bottom + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((targetBounds.left - sourceBounds.right) > min) {
                            x = targetBounds.left - tarExtension;
                        }
                        else {
                            x = sourceBounds.right + (targetBounds.left - sourceBounds.right) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            else {
                if (targetPortLocation.y > sourcePortLocation.y) {
                    if (sourcePortLocation.y > (targetBounds.top - tarExtension)) {
                        if ((sourceBounds.left - targetBounds.right) < min) {
                            x = targetBounds.right + (sourceBounds.left - targetBounds.right) / 2;
                        }
                        else {
                            x = sourceBounds.left - srcExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.top - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if ((targetBounds.bottom + tarExtension) >= sourcePortLocation.y) {
                        if ((sourceBounds.left - targetBounds.right) < min) {
                            x = targetBounds.right + (sourceBounds.left - targetBounds.right) / 2;
                        }
                        else {
                            x = sourceBounds.left - srcExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.left - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                x = targetBounds.left - tarExtension;
                points.push(ej.datavisualization.Diagram.Point(x, y));
            }
            points.push(ej.datavisualization.Diagram.Point(x, targetPortLocation.y));
            points.push(targetPortLocation);
            return points;
        },
        _leftToTop: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            if (sourcePortLocation.x <= targetPortLocation.x) {
                if (sourcePortLocation.y > targetPortLocation.y && targetBounds.left <= sourceBounds.left) {
                    x = targetBounds.left - tarExtension;
                }
                else {
                    x = sourceBounds.left - srcExtension;
                }
                points.push(ej.datavisualization.Diagram.Point(x, y));
                if (sourceBounds.bottom <= targetBounds.top) {
                    if ((sourceBounds.bottom + srcExtension) < targetBounds.top - tarExtension) {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                    }
                    else if (targetPortLocation.x < sourceBounds.right) {
                        y = sourceBounds.bottom + (targetBounds.top - sourceBounds.bottom) / 2;
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                    }
                }
                else {
                    if (sourceBounds.top - srcExtension >= targetBounds.top - tarExtension) {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                    }
                }
                points.push(ej.datavisualization.Diagram.Point(x, y));
            }
            else {
                if (targetPortLocation.y <= (sourcePortLocation.y + srcExtension)) {
                    if (sourceBounds.left - srcExtension > targetBounds.right + tarExtension) {
                        x = sourceBounds.left - srcExtension;
                    }
                    else {
                        if (targetBounds.right + tarExtension >= sourceBounds.left - srcExtension) {
                            x = targetBounds.left - tarExtension;
                        }
                        else {
                            x = targetBounds.right + (sourceBounds.left - targetBounds.right) / 2;
                        }
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    y = targetBounds.top - tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
            }
            points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            points.push(targetPortLocation);
            return points;
        },
        _leftToBottom: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            y = sourcePortLocation.y;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (sourcePortLocation.x - srcExtension <= targetPortLocation.x) {
                if (targetBounds.left <= sourcePortLocation.x && sourcePortLocation.y <= targetBounds.top) {
                    x = targetBounds.left - tarExtension;
                }
                else {
                    x = sourceBounds.left - srcExtension;
                }
                points.push(ej.datavisualization.Diagram.Point(x, y));
                if (targetBounds.bottom + tarExtension < sourceBounds.top - srcExtension) {
                    if ((sourceBounds.top - targetBounds.bottom) < min) {
                        y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                else {
                    if (targetBounds.bottom < sourceBounds.bottom) {
                        y = sourceBounds.bottom + srcExtension;
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
            }
            else {
                if (!(sourcePortLocation.y - srcExtension > targetPortLocation.y)) {
                    if (targetBounds.right >= sourceBounds.left) {
                        x = targetBounds.left - tarExtension;
                    }
                    else if ((sourceBounds.left - targetBounds.right) < min) {
                        x = sourceBounds.left - (sourceBounds.left - targetBounds.right) / 2;
                    }
                    else {
                        x = sourceBounds.left - srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    y = targetBounds.bottom + tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
            }
            points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            points.push(targetPortLocation);
            return points;
        },
        _topToTop: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            x = sourcePortLocation.x;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var min = srcExtension + tarExtension;
            if (targetPortLocation.x >= sourcePortLocation.x) {
                if (targetPortLocation.y - tarExtension >= sourcePortLocation.y - srcExtension) {
                    y = sourceBounds.top - srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (targetPortLocation.x <= sourceBounds.right) {
                        x = sourceBounds.right + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (targetBounds.height !== 0) {
                            if ((targetBounds.top - sourceBounds.bottom) > min) {
                                y = targetBounds.top - tarExtension;
                            }
                            else {
                                y = sourceBounds.bottom + (targetBounds.top - sourceBounds.bottom) / 2;
                            }
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (targetBounds.left <= sourcePortLocation.x) {
                        if ((sourceBounds.top - targetBounds.bottom) > min) {
                            y = sourceBounds.top - srcExtension;
                        }
                        else {
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.left - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.top - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            else {
                if (targetPortLocation.y - tarExtension >= sourcePortLocation.y - srcExtension) {
                    y = sourceBounds.top - srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (targetPortLocation.x >= sourceBounds.left) {
                        x = sourceBounds.left - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (targetBounds.height !== 0) {
                            if ((targetBounds.top - sourceBounds.bottom) > min) {
                                y = targetBounds.top - tarExtension;
                            }
                            else {
                                y = sourceBounds.bottom + (targetBounds.top - sourceBounds.bottom) / 2;
                            }
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (targetBounds.right >= sourcePortLocation.x) {
                        if ((sourceBounds.top - targetBounds.bottom) > min) {
                            y = sourceBounds.top - srcExtension;
                        }
                        else {
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.top - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        if (targetBounds.height !== 0) {
                            y = targetBounds.top - tarExtension;
                        }
                        else {
                            y = targetPortLocation.y;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            x = targetPortLocation.x;
            points.push(ej.datavisualization.Diagram.Point(x, y));
            points.push(targetPortLocation);
            return points;
        },
        _topToBottom: function (connector, segment, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation, swap) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            x = sourcePortLocation.x;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (swap) {
                tarExtension = connector._srcDecoratorSize;
                srcExtension = connector._tarDecoratorSize;
            }
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var minSpace = srcExtension + tarExtension;
            if (targetPortLocation.x > sourcePortLocation.x) {
                if (sourceBounds.top >= targetBounds.bottom) {
                    if ((sourceBounds.top - targetBounds.bottom) > 0) {
                        if (segment.length != undefined && !segment.direction)
                            y = targetBounds.bottom + segment.length;
                        else if (sourceBounds.top - targetBounds.bottom > 0)
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        else
                            y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((targetBounds.left - sourceBounds.right) >= minSpace) {
                            x = sourceBounds.right + srcExtension;
                        }
                        else {
                            x = sourceBounds.right + (targetBounds.left - sourceBounds.right) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (targetBounds.top < sourceBounds.top) {
                        if (targetBounds.left >= (sourceBounds.right + srcExtension)) {
                            y = sourceBounds.top - srcExtension;
                        }
                        else {
                            y = targetBounds.top - tarExtension;
                        }
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (targetBounds.left >= (sourceBounds.right + srcExtension)) {
                        x = sourceBounds.right + srcExtension;
                    }
                    else {
                        x = targetBounds.right + tarExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    y = targetBounds.bottom + tarExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            }
            else if (targetPortLocation.x < sourcePortLocation.x) {
                if (sourceBounds.top >= targetBounds.bottom) {
                    if ((sourceBounds.top - targetBounds.bottom) > 0) {
                        if (segment.length != undefined && !segment.direction)
                            y = targetBounds.bottom + segment.length;
                        else if (sourceBounds.top - targetBounds.bottom > 0)
                            y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                        else
                            y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if ((sourceBounds.left - targetBounds.right) >= minSpace) {
                            x = sourceBounds.left - srcExtension;
                        }
                        else {
                            x = targetBounds.right + (sourceBounds.left - targetBounds.right) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (sourceBounds.left - srcExtension >= (targetBounds.right + tarExtension)) {
                        y = sourceBounds.top - srcExtension;
                    }
                    else {
                        y = sourceBounds.top - srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (sourceBounds.left >= (targetBounds.right + tarExtension) || ((sourceBounds.right + srcExtension) < (targetBounds.right + tarExtension))) {
                        x = targetBounds.right + tarExtension;
                    }
                    else {
                        x = sourceBounds.right + srcExtension;
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (sourceBounds.left >= (targetBounds.right + tarExtension)) {
                        y = targetBounds.bottom + tarExtension;
                    }
                    else {
                        if (targetBounds.bottom <= sourceBounds.bottom) {
                            y = sourceBounds.bottom + srcExtension;
                        }
                        else {
                            y = targetBounds.bottom + tarExtension;
                        }
                    }
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                }
                points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            }
            points.push(targetPortLocation);
            return points;
        },
        _bottomToBottom: function (connector, targetBounds, targetPortLocation, sourceBounds, sourcePortLocation) {
            var points = [];
            var x, y;
            points.push(sourcePortLocation);
            x = sourcePortLocation.x;
            var srcExtension = connector._srcDecoratorSize;
            var tarExtension = connector._tarDecoratorSize;
            if (sourceBounds.width == 0) srcExtension = 0;
            if (targetBounds.width == 0) tarExtension = 0;
            var minSpace = srcExtension + tarExtension;
            if (targetPortLocation.x >= sourcePortLocation.x) {
                if (sourceBounds.bottom + srcExtension >= targetBounds.bottom + srcExtension) {
                    y = sourceBounds.bottom + srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if ((targetPortLocation.x) < sourceBounds.right) {
                        x = sourceBounds.right + srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (sourceBounds.top - srcExtension >= targetBounds.bottom + tarExtension) {
                            if ((sourceBounds.top - targetBounds.bottom) >= minSpace) {
                                y = targetBounds.bottom + tarExtension;
                            }
                            else {
                                y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                            }
                        }
                        else {
                            y = targetBounds.bottom + tarExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (sourcePortLocation.x > targetBounds.left) {
                        if ((targetBounds.bottom - sourceBounds.bottom) >= minSpace) {
                            y = sourceBounds.bottom + srcExtension;
                        }
                        else {
                            y = sourceBounds.bottom + (targetBounds.bottom - sourceBounds.bottom) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.left - tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            else {
                if (sourceBounds.bottom + srcExtension >= targetBounds.bottom + srcExtension) {
                    y = sourceBounds.bottom + srcExtension;
                    points.push(ej.datavisualization.Diagram.Point(x, y));
                    if (targetPortLocation.x > sourceBounds.left) {
                        x = sourceBounds.left - srcExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        if (sourceBounds.top - srcExtension >= targetBounds.bottom + tarExtension) {
                            if ((sourceBounds.top - targetBounds.bottom) >= minSpace) {
                                y = targetBounds.bottom + tarExtension;
                            }
                            else {
                                y = targetBounds.bottom + (sourceBounds.top - targetBounds.bottom) / 2;
                            }
                        }
                        else {
                            y = targetBounds.bottom + tarExtension;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
                else {
                    if (sourcePortLocation.x < targetBounds.right) {
                        if ((targetBounds.bottom - sourceBounds.bottom) >= minSpace) {
                            y = sourceBounds.bottom + srcExtension;
                        }
                        else {
                            y = sourceBounds.bottom + (targetBounds.bottom - sourceBounds.bottom) / 2;
                        }
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        x = targetBounds.right + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                    else {
                        y = targetBounds.bottom + tarExtension;
                        points.push(ej.datavisualization.Diagram.Point(x, y));
                    }
                }
            }
            points.push(ej.datavisualization.Diagram.Point(targetPortLocation.x, y));
            points.push(targetPortLocation);
            return points;
        },
        _addOrthogonalPoints: function (line, prev, next, sourcePt, endPt, runAngle) {
            var points = [];
            var strt = prev ? prev._endPoint : sourcePt;
            points.push(strt);
            if (!line._direction) line._direction = this._getOrthoDirection(strt, endPt, prev);
            if (line._direction === "auto" && !prev && !next)
                line._direction = this._getBezierDirection(strt, endPt);
            var angle = (!runAngle && runAngle != 0) ? this._directionToAngle(line._direction || this._getBezierDirection(strt, endPt)) : runAngle;
            var direction = line._direction;
            var angles = { "right": 0, "left": 180, "top": 270, "bottom": 90, "auto": 90 };
            if (direction == "left" || direction == "right" || direction == "top" || direction == "bottom") {
                angle = angles[direction];
            }
            else {
                switch (direction) {
                    case "straight":
                        angle = 1 - 1;
                        break;
                    case "clockWise90":
                        angle += 91 - 1;
                        break;
                    case "opposite":
                        angle += 181 - 1;
                        break;
                    case "antiClockWise90":
                        angle += 271 - 1;
                        break;
                }
            }
            if ((line.length || line.length == 0) && line.direction) {
                var ctrlPoint1 = ej.datavisualization.Diagram.Geometry.transform(strt, angle || 0, line._length);
                ctrlPoint1.x = Math.round(ctrlPoint1.x * 100) / 100;
                ctrlPoint1.y = Math.round(ctrlPoint1.y * 100) / 100;
                points.push(ctrlPoint1);
                line._endPoint = ctrlPoint1;
                if (next) {
                    next._startPoint = line._endPoint;
                    if (next.points) {
                        next.points[0] = line._endPoint;
                        if (next.type == "bezier") {
                            this._updateBezierPoints(next);
                        }
                    }
                }
            }
            else {
                if (strt.x != endPt.x && strt.y != endPt.y || (prev && prev._startPoint.x == endPt.x)) {
                    var extra = 20;
                    var tempx = endPt.x - (ctrlPoint1 ? ctrlPoint1.x : strt.x);
                    var tempy = endPt.y - (ctrlPoint1 ? ctrlPoint1.y : strt.y);
                    tempx = Math.abs(tempx) <= 0.0001 ? 0 : tempx;
                    tempy = Math.abs(tempy) <= 0.0001 ? 0 : tempy;
                    var ptsCount;
                    var twoPt;
                    switch (angle) {
                        case 0: if (endPt.x < strt.x) break;
                            twoPt = Math.abs(strt.x - endPt.x) < 30;
                            break;
                        case 180: if (endPt.x > strt.x) break;
                            twoPt = Math.abs(strt.x - endPt.x) < 30;
                            break;
                        case 90: if (endPt.y < strt.y) break; twoPt = Math.abs(strt.y - endPt.y) < 30; break;
                        case 270: if (endPt.y > strt.y) break;
                            twoPt = Math.abs(strt.y - endPt.y) < 30;
                            break;
                    }
                    if (!prev) {
                        if (twoPt) {
                            extra = (angle == 90 || angle == 270) ? Math.abs(strt.y - endPt.y) : Math.abs(strt.x - endPt.x);
                            ptsCount = 2;
                            if (extra < 10) { extra += 20; ptsCount = 3 }
                        }
                        else ptsCount = 3;
                        if (ptsCount != 2 || (Math.abs(tempy) > 1 && Math.abs(tempx) > 1))
                            var ctrlPoint1 = ej.datavisualization.Diagram.Geometry.transform(strt, angle, extra);
                    }
                    else ptsCount = (prev && prev._startPoint.x == endPt.x) ? 3 : (tempx == 0 || tempy == 0) ? 2 : 3;
                    if (ptsCount == 3) {
                        var direction = line._direction == "auto" ? prev ? prev._direction == "left" || prev.direction == "right" ? "left" : "top" : "bottom" : line._direction;
                        if ((direction == "left" || direction == "right") || tempy == 0) {
                            tempy = tempy > 0 ? tempy : -tempy;
                            var ctrlPoint2 = ej.datavisualization.Diagram.Geometry.transform(ctrlPoint1 || strt, 90, endPt.y - (ctrlPoint1 ? ctrlPoint1.y : strt.y));
                        }
                        else {
                            tempx = tempx > 0 ? tempx : -tempx;
                            var ctrlPoint2 = ej.datavisualization.Diagram.Geometry.transform(ctrlPoint1 || strt, 0, endPt.x - (ctrlPoint1 ? ctrlPoint1.x : strt.x));
                        }
                    }
                    if (ctrlPoint1) {
                        ctrlPoint1.x = Math.round(ctrlPoint1.x * 100) / 100;
                        ctrlPoint1.y = Math.round(ctrlPoint1.y * 100) / 100;
                        points.push(ctrlPoint1);
                    }
                    if (ctrlPoint2) {
                        ctrlPoint2.x = Math.round(ctrlPoint2.x * 100) / 100;
                        ctrlPoint2.y = Math.round(ctrlPoint2.y * 100) / 100;
                        points.push(ctrlPoint2);
                    }
                }
                line._direction = this._getBezierDirection(points[points.length - 1], endPt);
                points.push(endPt);
                line._endPoint = endPt;
                if (next) {
                    next._startPoint = line._endPoint;
                    if (!next.points) next.points = [];
                    next.points[0] = line._endPoint;
                    if (next.type == "bezier") {
                        this._updateBezierPoints(next);
                    }
                }
            }
            line.points = points;
            return angle;
        },
        _getOrthoDirection: function (src, point, prev) {
            if (!prev) {
                if (src.y < point.y) {
                    return "bottom";
                }
                else if (src.y > point.y) {
                    return "top";
                }
                else if (src.x < point.x) {
                    return "right";
                }
                else if (src.x > point.x) {
                    return "left";
                }
            }
            else {
                var tar = point;
                if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y) && (prev && (prev._direction == "left" || prev._direction == "right"))) {
                    return src.x < tar.x ? "right" : "left";
                }
                else {
                    return src.y < tar.y ? "bottom" : "top";
                }
            }
        },
        _directionToAngle: function (direction) {
            var angles = { "right": 0, "left": 180, "top": 270, "bottom": 90, "auto": 90 };
            return angles[direction];
        },
        _resetOrthogonalPoints: function (line) {
            var points = [];
            points.push(line.sourcePoint);
            points.push(line.targetPoint);
            line.points = [];
            line.sourcePoint = points[0];
            line.points.push(points[0]);
            var ctrlPoints = this._constructOrthogonalPoints(points[0], points[1]);
            line.points.push(ctrlPoints[0]);
            line.points.push(ctrlPoints[1]);
            line.targetPoint = points[1];
            line.points.push(points[1]);
        },
        _updateBezierPoints: function (line, targetNode, targetPort, targetBounds, sourceNode, sourcePort, sourceBounds) {
            var bounds;
            var angles = { "right": 0, "left": 180, "top": 270, "bottom": 90 };
            if (line.vector1 || line.vector2) {
                if (line.vector1) {
                    line._point1 = ej.datavisualization.Diagram.Geometry.transform(line._startPoint, line.vector1.angle, line.vector1.distance);
                }
                if (line.vector2) {
                    line._point2 = ej.datavisualization.Diagram.Geometry.transform(line._endPoint, line.vector2.angle, line.vector2.distance);
                }
            }
            if ((line.point1 == null && !line.vector1) || (line.point2 == null && !line.vector2)) {
                var target = line._endPoint;
                var source = line._startPoint;
                var dir;
                var matrix;
                if (!sourcePort)
                    dir = this._getBezierDirection(source, target);
                else {
                    bounds = sourceBounds;
                    source = this._getPortPosition(sourcePort, bounds);
                    if (sourceNode.rotateAngle !== 0) {
                        matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, sourceNode.rotateAngle, sourceNode.offsetX, sourceNode.offsetY);
                        source = ej.Matrix.transform(matrix, source);
                    }
                    dir = this._getDirection(bounds, source, true);
                }
                if (!line.vector1)
                    line._point1 = line.point1 || this._getBezierAdjPoint(angles[dir], line._startPoint, line._endPoint);
                if (!targetPort) {
                    dir = this._getBezierDirection(target, source);
                }
                else {
                    bounds = targetBounds;
                    target = this._getPortPosition(targetPort, bounds);
                    if (targetNode.rotateAngle !== 0) {
                        matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, targetNode.rotateAngle, targetNode.offsetX, targetNode.offsetY);
                        target = ej.Matrix.transform(matrix, target);
                    }
                    dir = this._getDirection(bounds, target, true);
                }
                if (!line.vector2)
                    line._point2 = line.point2 || this._getBezierAdjPoint(angles[dir], line._endPoint, line._startPoint);
            }
        },
        _getBezierDirection: function (src, tar) {
            if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
                return src.x < tar.x ? "right" : "left";
            }
            else {
                return src.y < tar.y ? "bottom" : "top";
            }
        },

        _findDocAngle: function (s, e) {
            var r = { x: e.x, y: s.y };
            var sr = this.findLength(s, r);
            var re = this.findLength(r, e);
            var es = this.findLength(e, s);
            var ang = Math.asin(re / es);
            ang = isNaN(ang) ? 0 : ang;
            ang = ang * 180 / Math.PI;
            if (s.x < e.x) {
                if (s.y < e.y) {

                }
                else {
                    ang = 360 - ang;
                }
            }
            else {
                if (s.y < e.y) {
                    ang = 180 - ang;
                }
                else {
                    ang = 180 + ang;
                }
            }
            return ang;

        },
        _getDirection: function (bounds, point, excludeBounds) {
            var center = bounds.center, fourty5, one35, two25, three15, dir, angle;
            if (excludeBounds) {
                //earlier implementation only for bezeir connector to get the bezeir angle.
                var points = bounds.points;
                var part = excludeBounds ? 45 : (180 / (2 + 2 / (bounds.height / bounds.width)));
                fourty5 = part;
                one35 = (180 - part);
                two25 = one35 + (2 * part);
                three15 = 360 - part;
                angle = ej.datavisualization.Diagram.Geometry.findAngle(point, center);
                if (angle > fourty5 && angle < one35) {
                    dir = "top";
                }
                else if (angle > one35 && angle < two25) {
                    dir = "right";
                }
                else if (angle > two25 && angle < three15) {
                    dir = "bottom";
                }
                else {
                    dir = "left";
                }
            }
            else {
                //source code have been derived from WPF source to get the dock angle.
                angle = this._findDocAngle(center, point);
                fourty5 = this._findDocAngle(center, bounds.bottomRight);
                one35 = this._findDocAngle(center, bounds.bottomLeft);
                two25 = this._findDocAngle(center, bounds.topLeft);
                three15 = this._findDocAngle(center, bounds.topRight);
                if (angle > two25 && angle < three15) {
                    dir = "top";
                }
                else if (angle >= fourty5 && angle < one35) {
                    dir = "bottom";
                }
                else if (angle >= one35 && angle <= two25) {
                    dir = "left";
                }
                else if (angle >= three15 || angle < fourty5) {
                    dir = "right";
                }
            }
            return dir;
        },
        _getBezierAdjPoint: function (angle, srcEnd, tarEnd) {
            var distance = 60;
            var endAdj = ej.datavisualization.Diagram.Point(0, 0);
            var dir;
            if (angle > 45 && angle < 135) {
                dir = "Bottom";
            }
            else if (angle > 135 && angle < 225) {
                dir = "Left";
            }
            else if (angle > 225 && angle < 315) {
                dir = "Top";
            }
            else {
                dir = "Right";
            }
            switch (dir) {
                case "Right":
                    distance = Math.min(Math.abs(srcEnd.x - tarEnd.x) * 0.45, distance);
                    endAdj = ej.datavisualization.Diagram.Point(srcEnd.x + distance, srcEnd.y);
                    break;
                case "Bottom":
                    distance = Math.min(Math.abs(srcEnd.y - tarEnd.y) * 0.45, distance);
                    endAdj = ej.datavisualization.Diagram.Point(srcEnd.x, srcEnd.y + distance);
                    break;
                case "Left":
                    distance = Math.min(Math.abs(srcEnd.x - tarEnd.x) * 0.45, distance);
                    endAdj = ej.datavisualization.Diagram.Point(srcEnd.x - distance, srcEnd.y);
                    break;
                case "Top":
                    distance = Math.min(Math.abs(srcEnd.y - tarEnd.y) * 0.45, distance);
                    endAdj = ej.datavisualization.Diagram.Point(srcEnd.x, srcEnd.y - distance);
                    break;
            }
            return endAdj;
        },
        _setLineEndPoint: function (connector, point, isTarget, dock) {
            var line = connector;
            point.x = Math.round(point.x * 100) / 100;
            point.y = Math.round(point.y * 100) / 100;
            if (isTarget) {
                var lastsegment = connector.segments[connector.segments.length - 1];
                line.targetPoint = point;
                if (lastsegment.type != "orthogonal") {
                    if (lastsegment.point) {
                        lastsegment.point = point;
                    }
                    lastsegment._point = point;
                }
                lastsegment.points[lastsegment.points.length - 1] = point;
                lastsegment._endPoint = point;
            }
            else {
                line.sourcePoint = point;
                var first = connector.segments[0];
                first.points[0] = point;
                first._startPoint = point;
                if (first.type == "orthogonal" && !connector.sourcePort && !connector._staticLength) {
                    if ((first.length || first.length === 0) && first.direction) {
                        if (first.points.length == 2) {
                            if (first._direction == "left" || first._direction == "right") {
                                first._endPoint.y = first._startPoint.y;
                                var length = Math.abs(first._startPoint.x - first._endPoint.x);
                            }
                            else {
                                first._endPoint.x = first._startPoint.x;
                                var length = Math.abs(first._startPoint.y - first._endPoint.y);
                            }
                            connector.segments[0]._length = length;
                            connector.segments[0].length = connector.segments[0]._length;
                            connector.segments[0].direction = connector.segments[0]._direction;
                        }
                    }
                }
            }
            var segment = isTarget ? connector.segments[connector.segments.length - 1] : connector.segments[0];
            if (segment.type === "orthogonal" && ((!isTarget && !connector.sourcePort) || isTarget && !connector.targetPort) && (!(connector.sourceNode && connector.targetNode) || connector.segments.length > 1)) {
                segment.points = [];
                this._addOrthogonalPoints(segment, isTarget ? connector.segments[connector.segments.length - 2] : null,
                    isTarget ? null : connector.segments[1], connector.sourcePoint, connector.targetPoint);
            }
            else if (segment.type === "bezier") {
                this._updateBezierPoints(segment);
            }
        },
        _setBezierPoint: function (segment, point, whichpoint) {
            if (whichpoint === "bezierpoint1") {
                if (segment.vector1) {
                    segment.vector1 = {
                        distance: ej.datavisualization.Diagram.Geometry.distance(segment._startPoint, point),
                        angle: ej.datavisualization.Diagram.Geometry.findAngle(segment._startPoint, point),
                    };
                    segment._point1 = point;
                }
                else
                    segment.point1 = segment._point1 = point;
            }
            else {
                if (segment.vector2) {
                    segment.vector2 = {
                        distance: ej.datavisualization.Diagram.Geometry.distance(segment._endPoint, point),
                        angle: ej.datavisualization.Diagram.Geometry.findAngle(segment._endPoint, point),
                    };
                    segment._point2 = point;
                }
                else
                    segment.point2 = segment._point2 = point;
            }
        },
        _setPoints: function (line, points) {
            line.sourcePoint = line.points[0] = points[0];
            line.targetPoint = line.points[line.points.length - 1] = points[points.length - 1];
            line.points = points;
            if (line.type === "bezier") {
                line.point1 = points[2] || line.point1;
                line.point2 = points[3] || line.point2;
                if (!line.point1)
                    line._point1 = line.point1;
                if (!line.point2)
                    line._point2 = line.point2;
                this._updateBezierPoints(line);
            }
        },
        _updateConnectorSegments: function (connector, ignoreSource, ignoreTarget, diagram) {
            var runAngle;
            var startPoint = connector.sourcePoint;
            for (var i = 0; i < connector.segments.length; i++) {
                var segment = connector.segments[i];
                var prev = connector.segments[i - 1];
                var next = connector.segments[i + 1];
                segment._startPoint = prev ? prev._endPoint : startPoint;
                if (!(i == 0 && ignoreSource) && !(i == connector.segments.length - 1 && ignoreTarget)) {
                    if (segment.type == "orthogonal")
                        runAngle = ej.datavisualization.Diagram.Util._addOrthogonalPoints(segment, prev, next, connector.sourcePoint, connector.targetPoint, runAngle);
                    else {
                        runAngle = ej.datavisualization.Diagram.Geometry.findAngle(startPoint, segment._endPoint);
                        if (segment.type == "bezier") {
                            this._updateBezierPoints(segment);
                        }
                    }
                }
                startPoint = segment._endPoint;
            }
            if (diagram) {
                diagram._dock(connector, diagram.nameTable);
            }
        },
        _translateLine: function (connector, dx, dy) {
            for (var i = 0; i < connector.segments.length; i++) {
                var segment = connector.segments[i];
                for (var j = 0; j < segment.points.length; j++) {
                    if (j == 0) {
                        segment._startPoint = segment.points[j] = ej.datavisualization.Diagram.Geometry.translate(segment.points[j], dx, dy);
                        if (i == 0) {
                            connector.sourcePoint = segment._startPoint;
                        }
                    }
                    else if (j == segment.points.length - 1) {
                        segment._endPoint = segment.points[j] = ej.datavisualization.Diagram.Geometry.translate(segment.points[j], dx, dy);
                        if (i == connector.segments.length - 1)
                            connector.targetPoint = segment._endPoint;
                    }
                    else segment.points[j] = ej.datavisualization.Diagram.Geometry.translate(segment.points[j], dx, dy);
                }
                if (segment.type === ej.datavisualization.Diagram.Segments.Bezier) {
                    segment._point1 = ej.datavisualization.Diagram.Geometry.translate(segment._point1, dx, dy);
                    segment._point2 = ej.datavisualization.Diagram.Geometry.translate(segment._point2, dx, dy);
                    if (segment.point1) { segment.point1 = segment._point1; }
                    if (segment.point2) { segment.point2 = segment._point2; }
                    if (segment.point) {
                        segment.point = segment._endPoint;
                    }
                    segment._point = segment._endPoint;
                }
                else if (segment.type == "straight") {
                    if (segment.point) {
                        segment.point = segment._endPoint;
                    }
                    segment._point = segment._endPoint;
                }
            }
        },
        _adjustPoint: function (source, target, isStart, length) {
            var pt = isStart ? { x: source.x, y: source.y } : { x: target.x, y: target.y };
            if (source.x == target.x) {
                if (source.y < target.y && isStart || source.y > target.y && !isStart)
                    pt.y += length;
                else pt.y -= length;
            }
            else if (source.y == target.y) {
                if (source.x < target.x && isStart || source.x > target.x && !isStart)
                    pt.x += length;
                else pt.x -= length;
            }
            else {
                var angle;
                if (isStart) {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(source, target);
                    pt = ej.datavisualization.Diagram.Geometry.transform(source, angle, length);
                }
                else {
                    angle = ej.datavisualization.Diagram.Geometry.findAngle(target, source);
                    pt = ej.datavisualization.Diagram.Geometry.transform(target, angle, length);
                }
            }
            return pt;
        },
        _getIconPosition: function (icon, bounds, bExcludeBoundsLocation) {
            if (icon) {
                var marginX, marginY;
                marginX = icon.margin.left - icon.margin.right;
                marginY = icon.margin.top - icon.margin.bottom;
                var offsetX = icon.offset.x;
                var offsetY = icon.offset.y;
                if (bExcludeBoundsLocation) {
                    var point = ej.datavisualization.Diagram.Point(bounds.width * offsetX + marginX, bounds.height * offsetY + marginY);
                    if (point.x > bounds.width || point.y > bounds.height)
                        var point = ej.datavisualization.Diagram.Point(bounds.width * offsetX, bounds.height * offsetY);
                    return point;
                }

                else {
                    var x = bounds.center.x - bounds.width / 2 + (bounds.width * offsetX) + marginX;
                    var y = bounds.center.y - bounds.height / 2 + (bounds.height * offsetY) + marginY;
                    return ej.datavisualization.Diagram.Point(x, y);
                }
            }
        },
        _rBounds: function (object, rotateAngle) {
            var rect = {};
            if (object) {
                rect.x = object.x;
                rect.y = object.y;
                rect.width = object.width;
                rect.height = object.height;
                rect.rotateAngle = rotateAngle;
            }
            else
                rect = ej.datavisualization.Diagram.Rectangle();
            if (rect) {
                var bounds = {};
                rect.x = Math.round(rect.x * 100) / 100;
                rect.y = Math.round(rect.y * 100) / 100;
                rect.width = Math.round(rect.width * 100) / 100;
                rect.height = Math.round(rect.height * 100) / 100;
                bounds["width"] = rect.width;
                bounds["height"] = rect.height;
                bounds["x"] = bounds["left"] = rect.x;
                bounds["right"] = rect.x + rect.width;
                bounds["y"] = bounds["top"] = rect.y;
                bounds["bottom"] = rect.y + rect.height;
                bounds["center"] = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
                bounds["topLeft"] = { x: rect.x, y: rect.y };
                bounds["topCenter"] = { x: rect.x + rect.width / 2, y: rect.y };
                bounds["topRight"] = { x: rect.x + rect.width, y: rect.y };
                bounds["middleLeft"] = { x: rect.x, y: rect.y + rect.height / 2 };
                bounds["middleRight"] = { x: rect.x + rect.width, y: rect.y + rect.height / 2 };
                bounds["bottomLeft"] = { x: rect.x, y: rect.y + rect.height };
                bounds["bottomCenter"] = { x: rect.x + rect.width / 2, y: rect.y + rect.height };
                bounds["bottomRight"] = { x: rect.x + rect.width, y: rect.y + rect.height };
                if (rect && rect.rotateAngle) {
                    var matrix = ej.Matrix.identity();
                    ej.Matrix.rotate(matrix, rect.rotateAngle, rect.x + rect.width / 2, rect.y + rect.height / 2);
                    bounds.topLeft = ej.Matrix.transform(matrix, bounds.topLeft);
                    bounds.topCenter = ej.Matrix.transform(matrix, bounds.topCenter);
                    bounds.topRight = ej.Matrix.transform(matrix, bounds.topRight);
                    bounds.middleLeft = ej.Matrix.transform(matrix, bounds.middleLeft);
                    bounds.middleRight = ej.Matrix.transform(matrix, bounds.middleRight);
                    bounds.bottomLeft = ej.Matrix.transform(matrix, bounds.bottomLeft);
                    bounds.bottomCenter = ej.Matrix.transform(matrix, bounds.bottomCenter);
                    bounds.bottomRight = ej.Matrix.transform(matrix, bounds.bottomRight);
                    var rbounds = ej.datavisualization.Diagram.Geometry.rect([bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft]);
                    bounds.x = bounds.left = rbounds.x;
                    bounds.y = bounds.top = rbounds.y;
                    bounds.right = rbounds.x + rbounds.width;
                    bounds.bottom = rbounds.y + rbounds.height;
                    bounds.center = ej.datavisualization.Diagram.Point(rbounds.x + rbounds.width / 2, rbounds.y + rbounds.height / 2);
                    bounds.width = -(bounds.topLeft.x) + bounds.right
                    bounds.height = -(bounds.topRight.y) + bounds.bottom
                }
                bounds["points"] = [bounds.topLeft, bounds.topRight, bounds.bottomRight, bounds.bottomLeft];
                return bounds;
            }
            return rect;
        },
        _getLabelPosition: function (label, bounds, offset, isheaderY, isheaderX, text) {
            if (text) {
                var lBounds = text.getBBox();
                var rBounds = this._rBounds(lBounds, label.rotateAngle)
            }
            var x = bounds.width * (offset ? offset.x : label.offset.x);
            var y = bounds.height * (offset ? offset.y : label.offset.y);
            if (label.horizontalAlignment == "left")
                x += label.margin.left;
            else if (label.horizontalAlignment == "right")
                x -= label.margin.right;
            else
                x += label.margin.left - label.margin.right + (isheaderX ? -(((rBounds ? rBounds.width : bounds.width) / 2)) : 0);
            if (label.verticalAlignment == "top")
                y += label.margin.top;
            else if (label.verticalAlignment == "bottom")
                y -= label.margin.bottom;
            else
                y += label.margin.top - label.margin.bottom + (isheaderY ? label.fontSize / 2 : 0);
            return ej.datavisualization.Diagram.Point(x, y);
        },
        _getPortPosition: function (port, bounds, bExcludeBoundsLocation) {
            if (port) {
                var marginX = ((port.margin.left) ? (port.margin.left) : 0) + ((port.margin.right) ? (port.margin.right) : 0);
                var marginY = ((port.margin.top) ? (port.margin.top) : 0) + ((port.margin.bottom) ? (port.margin.bottom) : 0);
                if (bExcludeBoundsLocation) {
                    return ej.datavisualization.Diagram.Point(bounds.width * port.offset.x + marginX, bounds.height * port.offset.y + marginY);
                }
                else {
                    var x = bounds.center.x - bounds.width / 2 + (bounds.width * port.offset.x) + marginX;
                    var y = bounds.center.y - bounds.height / 2 + (bounds.height * port.offset.y) + marginY;
                    return ej.datavisualization.Diagram.Point(x, y);
                }
            }
        },
        _translate: function (node, dx, dy, nameTable, isContainer, diagram) {
            // if (ej.datavisualization.Diagram.Util.canMove(node))
            {
                if (!node.segments) {
                    node.offsetX += dx;
                    node.offsetY += dy;
                    if (node._type === "group" && !isContainer) {
                        var nodes = diagram._getChildren(node.children);
                        var child;
                        for (var i = 0; i < nodes.length; i++) {
                            child = nameTable[nodes[i]];
                            this._translate(child, dx, dy, nameTable, null, diagram);
                            if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], diagram);
                        }
                        if (node._type != "group" && node.container)
                            ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                    }
                } else {
                    ej.datavisualization.Diagram.Util._translateLine(node, dx, dy, node);
                }
            }
        },
        scale: function (node, sw, sh, pivot, nameTable, skipScalOnChild, updateMinMax, isHelper, diagram) {
            if (!node.container) {
                var matrix = ej.Matrix.identity();
                if (!node.segments) {
                    if (node._type === "group") {
                        var nodes = diagram._getChildren(node.children);
                        var child;
                        for (var i = 0; i < nodes.length; i++) {
                            child = nameTable[nodes[i]];
                            if (child) {
                                this.scale(child, sw, sh, pivot, nameTable, undefined, undefined, undefined, diagram);
                                if (child.parent && (child.parent != node.name && node.type != "pseudoGroup"))
                                    ej.datavisualization.Diagram.Util._updateGroupBounds(nameTable[child.parent], diagram);
                            }
                        }
                        ej.datavisualization.Diagram.Util._updateGroupBounds(node, diagram);
                    } else {
                        ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                        ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                        ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                        var newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                        var width = node.width * sw;
                        var height = node.height * sh;
                        if (width > 1) {
                            node.width = width;
                            node.offsetX = newPosition.x;
                        }
                        if (height > 1) {
                            node.height = height;
                            node.offsetY = newPosition.y;
                        }
                    }
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
                }
            }
            else {
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
                        if (isHelper != true)
                            newSize = diagram._getMinMaxSize(node, width, height);
                        else {
                            newSize.width = width;
                            newSize.height = height;
                        }
                        if (newSize && newSize.width > 1) {
                            var x = node.offsetX - node.width / 2;
                            node.width = newSize.width;
                            node.offsetX = x + node.width / 2;
                        }
                        if (newSize && newSize.height > 1) {
                            var y = node.offsetY - node.height / 2;
                            node.height = newSize.height;
                            node.offsetY = y + node.height / 2;
                        }
                        break;
                    case "stack":
                        var matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, -node.rotateAngle, pivot.x, pivot.y);
                        ej.Matrix.scale(matrix, sw, sh, pivot.x, pivot.y);
                        ej.Matrix.rotate(matrix, node.rotateAngle, pivot.x, pivot.y);
                        newPosition = ej.Matrix.transform(matrix, ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY));
                        width = (node.width * sw) - (node.marginLeft + node.marginRight);
                        height = (node.height * sh) - (node.marginTop + node.marginBottom);
                        newSize = diagram._getMinMaxSize(node, width, height);
                        if (newSize.width > 1) {
                            x = node.offsetX - node.width / 2;
                            node.width = newSize.width - node.marginLeft;
                            node.offsetX = x + node.width / 2 + (node.marginLeft);
                        }
                        if (newSize.height > 1) {
                            y = node.offsetY - node.height / 2;
                            node.height = newSize.height - node.marginTop;
                            node.offsetY = y + node.height / 2 + (node.marginTop);
                        }
                        ej.datavisualization.Diagram.SvgContext._alignOnStack(node, diagram);
                        break;
                }
            }
        },
        _getIntersectingElement: function (diagram, bounds) {
            var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(diagram._spatialSearch, bounds);
            var elements = [];
            for (var i = 0; i < quads.length; i++) {
                var quad = quads[i];
                if (quad.objects.length > 0) {
                    for (var j = 0; j < quad.objects.length; j++) {
                        var quadNode = quad.objects[j];
                        if (quadNode.visible) {
                            var nodebounds = ej.datavisualization.Diagram.Util.bounds(quadNode);
                            if (ej.datavisualization.Diagram.Geometry.intersectsRect(bounds, nodebounds)) {
                                quadNode = diagram._sortByZIndex(quadNode, true);
                                elements.push(quadNode);
                            }
                        }
                    }
                }
            }
            return elements;
        },
        _getIntersectingNodeElement: function (diagram, bounds) {
            var quads = ej.datavisualization.Diagram.SpatialUtil.findQuads(diagram._spatialSearch, bounds);
            var elements = [];
            for (var i = 0; i < quads.length; i++) {
                var quad = quads[i];
                if (quad.objects.length > 0) {
                    for (var j = 0; j < quad.objects.length; j++) {
                        var quadNode = quad.objects[j];
                        if (quadNode.visible) {
                            var nodebounds = ej.datavisualization.Diagram.Util.bounds(quadNode);
                            if (ej.datavisualization.Diagram.Geometry.intersectsRect(bounds, nodebounds)) {
                                quadNode = diagram._sortByZIndex(quadNode, true);
                                if (!quadNode.segments)
                                    elements.push(quadNode);
                            }
                        }
                    }
                }
            }
            return elements;
        },
        _updateChildBounds: function (node, diagram) {
            var offX, offY, dx, dy;
            dx = node.width;
            dy = node.height;
            offX = node.offsetX;
            offY = node.offsetY;
            var childBounds = ej.datavisualization.Diagram.Util._getChildrenBounds(node, diagram);
            node.offsetX = childBounds.x + childBounds.width / 2;
            node.offsetY = childBounds.y + childBounds.height / 2;
            node.height = childBounds.height;
            node.width = childBounds.width;
            var deltaWidth = dx / node.width;
            var deltaHeight = dy / node.height;
            this.scale(node, deltaWidth, deltaHeight, node.pivot, diagram.nameTable, null, null, null, diagram);
            this._translate(node, offX - node.offsetX, offY - node.offsetY, diagram.nameTable, null, diagram);
        },
        _updateGroupBounds: function (node, diagram, needUpdate, angleChange) {
            var exWidth, exHeight, exOffX, exOffY;
            if (node && !node.container) {
                if (node && ((node.type === "pseudoGroup") || (node.children && node.children.length > 0))) {
                    exWidth = node.width;
                    exHeight = node.height;
                    exOffX = node.offsetX;
                    exOffY = node.offsetY;
                    if (angleChange)
                        this._updateRotateAngle(node, diagram.nameTable);
                    var bounds = this._getChildrenBounds(node, diagram, needUpdate);
                    var x = bounds.x + bounds.width * node.pivot.x;
                    var y = bounds.y + bounds.height * node.pivot.y;
                    var newposition = { x: x, y: y };
                    if (node.rotateAngle && (!diagram._isNodeInitializing || diagram._isGroupNode)) {
                        var matrix = ej.Matrix.identity();
                        ej.Matrix.rotate(matrix, node.rotateAngle);
                        newposition = ej.Matrix.transform(matrix, newposition);
                    }
                    if (bounds) {
                        node.offsetX = newposition.x;
                        node.offsetY = newposition.y;
                        node.width = bounds.width;
                        node.height = bounds.height;
                    }
                    if (needUpdate) {
                        var child = null;
                        if (node.children && node.children.length > 0) {
                            for (var k = 0; k < node.children.length; k++) {
                                if (diagram._getChild(node.children[k]))
                                    child = diagram.nameTable[diagram._getChild(node.children[k])];
                                if (child) {
                                    if (child._type === "group" || (child.children && child.children.length > 0)) {
                                        this._updateGroupBounds(child, diagram, needUpdate);
                                    }
                                }
                            }
                        }
                        //update the initial size of the group
                        if (exWidth && exWidth != node.width)
                            diagram.scale(node, exWidth / node.width, 1, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), diagram.nameTable, undefined, undefined, undefined, diagram);
                        if (exHeight && exHeight != node.height)
                            diagram.scale(node, 1, exHeight / node.height, new ej.datavisualization.Diagram.Point(node.offsetX, node.offsetY), diagram.nameTable, undefined, undefined, undefined, diagram);
                        //update the initial offset of the group
                        if (exOffX && exOffX != node.offsetX)
                            diagram._translate(node, exOffX - node.offsetX, 1, diagram.nameTable, undefined);
                        if (exOffX && exOffY != node.offsetY)
                            diagram._translate(node, 1, exOffY - node.offsetY, diagram.nameTable, undefined);
                    }
                }
            }
        },
        _getChildrenBounds: function (group, diagram, needUpdate) {
            var children = diagram._getChildren(group.children), rect,
                bounds = ej.datavisualization.Diagram.Rectangle(), child;
            if (children.length > 0) {
                child = diagram.nameTable[children[0]];
                if (child)
                    bounds = this._rotateChildBounds(child, group, diagram);
            }
            for (var i = 0, len = children.length; i < len; i++) {
                child = diagram.nameTable[children[i]];
                if (child && (diagram.selectedItem || !child._isInternalShape)) {
                    if (child._type === "group") {
                        this._updateGroupBounds(child, diagram, needUpdate);
                        rect = this._rotateChildBounds(child, group, diagram);
                    } else
                        rect = this._rotateChildBounds(child, group, diagram);
                }
                if (rect)
                    bounds = ej.datavisualization.Diagram.Geometry.union(bounds, rect);
            }
            return bounds;
        },
        _updateRotateAngle: function (node, nameTable) {
            if (node.offsetX == 0 && node.offsetY == 0 && node.width == 0 && node.height == 0) {
                for (var i = 0; i < node.children.length; i++) {
                    var child = nameTable[node.children[i]];
                    if (child && !child.segments && !node.rotateAngle) {
                        node.rotateAngle = child.rotateAngle;
                        return;
                    }
                }
            }
        },
        _rotateChildBounds: function (child, group, diagram) {
            if (child.segments || ((group.rotateAngle || child.rotateAngle) && (!diagram._isNodeInitializing || diagram._isGroupNode))) {
                var bounds = this.bounds(child);
                var matrix = ej.Matrix.identity();
                ej.Matrix.rotate(matrix, -group.rotateAngle);
                var topleft = ej.Matrix.transform(matrix, bounds.topLeft);
                var topright = ej.Matrix.transform(matrix, bounds.topRight);
                var bottomLeft = ej.Matrix.transform(matrix, bounds.bottomLeft);
                var bottomRight = ej.Matrix.transform(matrix, bounds.bottomRight);
                var x = Math.min(topleft.x, topright.x, bottomLeft.x, bottomRight.x);
                var y = Math.min(topleft.y, topright.y, bottomLeft.y, bottomRight.y);
                return {
                    x: x,
                    width: Math.max(topleft.x, topright.x, bottomLeft.x, bottomRight.x) - x,
                    y: y,
                    height: Math.max(topleft.y, topright.y, bottomLeft.y, bottomRight.y) - y
                };
            }
            return {
                x: child.offsetX - (child.width || child._width) * child.pivot.x, y: child.offsetY - (child.height || child._height) * child.pivot.y,
                width: child.width || child._width, height: child.height || child._height
            };
        },

        _emptyBridging: function (intersects, diagram) {
            if (intersects && intersects.length > 0 && diagram) {
                var i, line;
                for (i = 0; i < intersects.length; i++) {
                    line = diagram.nameTable[diagram._getChild(intersects[i])];
                    if (line) {
                        for (var m = 0; m < line.segments.length; m++) {
                            var segmentBridges = line.segments[m]._bridges;
                            for (var n = 0; n < segmentBridges.length; n++) {
                                segmentBridges.splice(n, 1);
                            }
                        }
                        ej.datavisualization.Diagram.DiagramContext.update(line, diagram);
                    }

                }
            }
        },
        updateBridging: function (connector, diagram, intersectingConnectors) {
            var bounds, bounds1;
            var lstBridge = [];
            if (intersectingConnectors && intersectingConnectors.length) {
                if (connector.segments.length > 0) {
                    for (var m = 0; m < connector.segments.length; m++) {
                        var segmentBridges = connector.segments[m]._bridges;
                        for (var n = 0; n < segmentBridges.length; n++) {
                            if (segmentBridges[n]._target == intersectingConnectors[0].name)
                                segmentBridges.splice(n, 1);
                            else if (this.findLength(segmentBridges[n].startPoint, segmentBridges[n].endPoint) > intersectingConnectors[0].bridgeSpace) {
                                if (diagram.nameTable[segmentBridges[n]._target]) intersectingConnectors.push(diagram.nameTable[segmentBridges[n]._target]);
                                segmentBridges.splice(n, 1);
                            }
                        }
                    }
                }
            }
            else if (connector.segments.length > 0) {
                for (var m = 0; m < connector.segments.length; m++) {
                    connector.segments[m]._bridges = [];
                }
            }
            if (!intersectingConnectors)
                this._emptyBridging(connector._intersects, diagram)
            connector._intersects = [];
            if (ej.datavisualization.Diagram.Util.canBridge(connector, diagram)) {
                var points1 = this.getPoints(connector);
                var bridgeSpacing = connector.bridgeSpace;
                var bridgeDirection = diagram.bridgeDirection();
                var count = -1;
                bounds = intersectingConnectors && diagram.boundaryTable[connector.name] ? diagram.boundaryTable[connector.name] : ej.datavisualization.Diagram.Util.bounds(connector);
                diagram.boundaryTable[connector.name] = bounds;

                var child;
                if (intersectingConnectors && intersectingConnectors.length > 0) {
                    var list = [];
                    for (var i = 0; i < intersectingConnectors.length; i++) {
                        child = diagram.nameTable[diagram._getChild(intersectingConnectors[i])];
                        if (child)
                            list.push(child);
                    }
                }

                var quads = list ? list : diagram._getConnectors();
                if (quads.length > 0) {
                    for (var q = 0; q < quads.length; q++) {
                        var connector1 = quads[q];
                        if (ej.datavisualization.Diagram.Util.canBridgeObstacle(connector1, diagram)) {
                            if ((connector && connector.segments && connector.segments.length > 0 && connector.segments[0].type != "bezier") && (connector1 && connector1.segments && connector1.segments.length > 0 && connector1.segments[0].type != "bezier") &&
                                (connector1.segments && connector1.visible) && connector.name !== connector1.name) {
                                bounds1 = diagram.boundaryTable[connector1.name] ? diagram.boundaryTable[connector1.name] : ej.datavisualization.Diagram.Util.bounds(connector1);
                                diagram.boundaryTable[connector1.name] = bounds1;
                                if (ej.datavisualization.Diagram.Geometry.intersectsRect(bounds, bounds1)) {
                                    var points2 = this.getPoints(connector1);
                                    var intersectPts = this.interSect(points1, points2, false, diagram, true);
                                    connector._intersects.push(connector1.name);
                                    /* Start For Loop */
                                    if (intersectPts.length > 0) {
                                        for (var i = 0; i < intersectPts.length; i++) {
                                            var fullLength = 0;
                                            var segmentIndex = 0;
                                            var length = 0;
                                            var pointIndex = 0;
                                            var obj = this.getLengthAtFractionPoint(connector, intersectPts[i]);
                                            length = obj.lengthAtFractionPt, fullLength = obj.fullLength, segmentIndex = obj.segmentIndex, pointIndex = obj.pointIndex;
                                            if (segmentIndex < 0) {
                                                continue;
                                            }
                                            if (connector.segments[0]) {
                                                var startBridge, endBridge;
                                                var fractLength = (length - (bridgeSpacing / 2)) / fullLength;
                                                startBridge = this.getPointAtLength((length - (bridgeSpacing / 2)), points1);
                                                fractLength = (length + (bridgeSpacing / 2)) / fullLength;
                                                endBridge = this.getPointAtLength((length + (bridgeSpacing / 2)), points1);
                                                if (ej.datavisualization.Diagram.Geometry.isEmptyPoint(endBridge))
                                                    endBridge = startBridge;
                                                var start, end;
                                                if (segmentIndex === 0) {
                                                    start = connector.sourcePoint;
                                                }
                                                else {
                                                    start = connector.segments[segmentIndex - 1]._endPoint;
                                                }
                                                if (connector.segments[segmentIndex].type === "straight")
                                                    end = connector.segments[segmentIndex]._point;
                                                else
                                                    end = connector.segments[segmentIndex].points[pointIndex];
                                                var angle = this._findAngle(start, end);
                                                if (lstBridge.length > segmentIndex && lstBridge[segmentIndex] != null) {
                                                    var fixedPoint;
                                                    if (segmentIndex === 0) {
                                                        fixedPoint = connector.sourcePoint;
                                                    }
                                                    else {
                                                        fixedPoint = connector.segments[segmentIndex - 1]._endPoint;
                                                    }
                                                    var fix = Math.abs(this.findLength(fixedPoint, endBridge));
                                                    var var1 = 0;
                                                    var insertAt = -1;
                                                    count = -1;
                                                    for (var k = 0; k < lstBridge[segmentIndex].bridges.length; k++) {
                                                        count++;
                                                        var arcSeg = lstBridge[segmentIndex].bridges[k];
                                                        var1 = Math.abs(this.findLength(fixedPoint, arcSeg.endPoint));
                                                        if (fix < var1) {
                                                            insertAt = count;
                                                            break;
                                                        }
                                                    }
                                                    if (insertAt >= 0) {
                                                        var paths;
                                                        paths = this.createSegment(startBridge, endBridge, angle, bridgeDirection, pointIndex, connector, diagram);
                                                        paths._target = connector1.name;
                                                        lstBridge[segmentIndex].bridges.splice(insertAt, 0, paths);
                                                        lstBridge[segmentIndex].bridges.join();
                                                        lstBridge[segmentIndex].bridgeStartPoint.splice(insertAt, 0, startBridge);
                                                        lstBridge[segmentIndex].bridgeStartPoint.join();
                                                        lstBridge[segmentIndex].segmentIndex = segmentIndex;
                                                    }
                                                    else {
                                                        var paths = this.createSegment(startBridge, endBridge, angle, bridgeDirection, pointIndex, connector, diagram);
                                                        paths._target = connector1.name;
                                                        lstBridge[segmentIndex].bridges.push(paths);
                                                        lstBridge[segmentIndex].bridgeStartPoint.push(startBridge);
                                                        lstBridge[segmentIndex].segmentIndex = segmentIndex;
                                                    }
                                                }
                                                else {
                                                    if (!isNaN(startBridge.x) && !isNaN(startBridge.y) && !ej.datavisualization.Diagram.Geometry.isEmptyPoint(endBridge)) {
                                                        var arcs = this.createSegment(startBridge, endBridge, angle, bridgeDirection, pointIndex, connector, diagram);
                                                        arcs._target = connector1.name;
                                                        var stPoints = [];
                                                        var edPoints = [];
                                                        stPoints.push(startBridge);
                                                        edPoints.push(endBridge);
                                                        if (lstBridge.length < segmentIndex + 1) {
                                                        }
                                                        lstBridge[segmentIndex] = $.extend(true, {}, ej.datavisualization.Diagram.BridgeSegments, {});
                                                        lstBridge[segmentIndex].bridges.push(arcs);
                                                        lstBridge[segmentIndex].bridgeStartPoint = stPoints;
                                                        lstBridge[segmentIndex].segmentIndex = segmentIndex;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    /* End For Loop */
                                }
                            }
                        }
                    }
                }
                if (intersectingConnectors && intersectingConnectors.length) {
                    if (connector.segments.length > 0) {
                        for (var m = 0; m < connector.segments.length; m++) {
                            var segment = connector.segments[m];
                            var segmentBridges = connector.segments[m]._bridges;
                            if (!lstBridge[m]) {
                                lstBridge[m] = $.extend(false, {}, ej.datavisualization.Diagram.BridgeSegments);
                                lstBridge[m].segmentIndex = m;
                            }
                            lstBridge[m].bridges = lstBridge[m].bridges.concat(segmentBridges).sort(function (a, b) {
                                if (segment._startPoint.x != segment._endPoint.x)
                                    return segment._startPoint.x < segment._endPoint.x ? a.startPoint.x - b.startPoint.x : b.startPoint.x - a.startPoint.x;
                                else
                                    return segment._startPoint.y < segment._endPoint.y ? a.startPoint.y - b.startPoint.y : b.startPoint.y - a.startPoint.y;
                            });
                            lstBridge[m].bridgeStartPoint = lstBridge[m].bridges.map(function (e) { return e.startPoint });
                            connector.segments[m]._bridges = [];
                        }
                    }
                }
                if (lstBridge.length != 0) {
                    for (var i = 0; i < lstBridge.length; i++) {
                        var bridge = lstBridge[i];
                        if (!bridge)
                            continue;
                        for (var k = 1; k < bridge.bridges.length; k++) {
                            if (this.findLength(bridge.bridges[k].endPoint, bridge.bridges[k - 1].endPoint) < bridgeSpacing) {
                                bridge.bridges[k - 1].endPoint = bridge.bridges[k].endPoint;
                                var subBridge = bridge.bridges[k - 1];
                                var arc = diagram.getBridgeSegment(subBridge.startPoint, subBridge.endPoint, subBridge.angle, bridgeSpacing, subBridge.sweep);
                                bridge.bridges[k - 1].path = arc;
                                if (intersectingConnectors && intersectingConnectors.length && bridge.bridges[k - 1]._target == intersectingConnectors[0].name)
                                    bridge.bridges[k - 1]._target = bridge.bridges[k]._target;
                                bridge.bridges.splice(k, 1);
                                bridge.bridgeStartPoint.splice(k, 1);
                                k--;
                            }
                        }
                        var pre = connector.sourcePoint;
                        for (var j = 0; j < bridge.bridges.length; j++) {
                            var subBridge = bridge.bridges[j];
                            var preventChecking = true;
                            for (var k = 0; intersectingConnectors && k < intersectingConnectors.length; k++)
                                if (subBridge._target == intersectingConnectors[k].name)
                                    preventChecking = false;
                            if (!preventChecking) {
                                var end;
                                if (connector.segments[bridge.segmentIndex].type === "straight")
                                    end = connector.segments[bridge.segmentIndex]._endPoint;
                                else if (connector.segments[bridge.segmentIndex].type === "orthogonal")
                                    end = connector.segments[bridge.segmentIndex].points[subBridge.segmentPointIndex];
                                if (segmentIndex != 0)
                                    pre = connector.segments[bridge.segmentIndex]._endPoint;
                                var rectPoints = [];
                                rectPoints.push(ej.datavisualization.Diagram.Point(end.x - bridgeSpacing, end.y - bridgeSpacing));
                                rectPoints.push(ej.datavisualization.Diagram.Point(end.x + bridgeSpacing, end.y + bridgeSpacing));
                                var rect = ej.datavisualization.Diagram.Geometry.rect(rectPoints);
                                rectPoints = [];
                                rectPoints.push(ej.datavisualization.Diagram.Point(pre.x - bridgeSpacing, pre.y - bridgeSpacing));
                                rectPoints.push(ej.datavisualization.Diagram.Point(pre.x + bridgeSpacing, pre.y + bridgeSpacing));
                                var rect1 = ej.datavisualization.Diagram.Geometry.rect(rectPoints);
                                if (!ej.datavisualization.Diagram.Geometry.containsPoint(rect, bridge.bridgeStartPoint[j]) &&
                                    !ej.datavisualization.Diagram.Geometry.containsPoint(rect1, subBridge.endPoint)) {
                                    connector.segments[bridge.segmentIndex]._bridges.push(subBridge);
                                    pre = subBridge.endPoint;
                                }
                            }
                            else {
                                connector.segments[bridge.segmentIndex]._bridges.push(subBridge);
                                pre = subBridge.endPoint;
                            }
                        }
                    }
                }
            }
        },
        createSegment: function (start, end, angle, bridgeDirection, segmentPointIndex, connector, diagram) {
            var arc, sweep;
            //var pathSegment = ej.datavisualization.Diagram.Util.cloneObject(ej.datavisualization.Diagram.PathSegment);
            var pathSegment = $.extend(false, {}, ej.datavisualization.Diagram.PathSegment);
            sweep = this.sweepDirection(angle, bridgeDirection, connector, diagram);
            arc = diagram.getBridgeSegment(start, end, angle, connector.bridgeSpace, sweep);
            pathSegment.path = arc;
            pathSegment.startPoint = start;
            pathSegment.endPoint = end;
            pathSegment.angle = angle;
            pathSegment.segmentPointIndex = segmentPointIndex;
            pathSegment.sweep = sweep;
            return pathSegment;
        },
        sweepDirection: function (angle, bridgeDirection, connector, diagram) {
            var angle1 = Math.abs(angle);
            if (bridgeDirection === "top" || bridgeDirection === "bottom") {
                var sweep = 1;
                if (angle1 >= 0 && angle1 <= 90) {
                    sweep = 0;
                }
            }
            else if (bridgeDirection === "right" || bridgeDirection === "left") {
                var sweep = 1;
                if (angle < 0 && angle >= -180) {
                    sweep = 0;
                }
            }
            if (bridgeDirection === "right" || bridgeDirection === "bottom") {
                if (sweep === 0)
                    sweep = 1;
                else
                    sweep = 0;
            }
            return sweep;
        },
        getPointAtLength: function (length, pts) {
            var run = 0;
            var pre = null;
            var found = ej.datavisualization.Diagram.Point(0, 0);
            for (var i = 0; i < pts.length; i++) {
                var pt = pts[i];
                if (!pre) {
                    pre = pt;
                    continue;
                }
                else {
                    var l = this.findLength(pre, pt);
                    if (run + l > length) {
                        var r = length - run;
                        var deg = this.findAngle(pre, pt);
                        var x = r * Math.cos(deg * Math.PI / 180);
                        var y = r * Math.sin(deg * Math.PI / 180);
                        found = ej.datavisualization.Diagram.Point(pre.x + x, pre.y + y);
                        break;
                    }
                    else {
                        run += l;
                    }
                }
                pre = pt;
            }
            return found;
        },
        getLengthAtFractionPoint: function (connector, pointAt) {
            var confirm = 100, fullLength = 0, segmentIndex = -1, count = 0, lengthAtFractionPt = 0, pointIndex = -1;
            if (connector.segments === null)
                return 0;
            var segments = connector.segments;
            var pt1 = connector.sourcePoint;
            var previouspt2 = pt1;
            for (var i = 0; i < connector.segments.length; i++) {
                var points = [];
                var segment1 = connector.segments[i];
                for (var j = 0; j < segment1.points.length; j++) {
                    var point2 = segment1.points[j];
                    points.push(point2);
                }
                for (var j = 0; j < points.length; j++) {
                    var pt2 = points[j];
                    var suspect = this.getSlope(pt2, pt1, pointAt, connector);
                    if (suspect < confirm) {
                        confirm = suspect;
                        lengthAtFractionPt = fullLength + this.findLength(pointAt, previouspt2);
                        segmentIndex = count;
                        pointIndex = j;
                    }
                    fullLength += this.findLength(pt2, pt1);
                    pt1 = pt2;
                    previouspt2 = pt2;
                }
                count++;
            }
            return { "lengthAtFractionPt": lengthAtFractionPt, "fullLength": fullLength, "segmentIndex": segmentIndex, "pointIndex": pointIndex };
        },
        getSlope: function (startPt, endPt, point, connector) {
            var three = 3.0;
            var delX = Math.abs(startPt.x - endPt.x);
            var delY = Math.abs(startPt.y - endPt.y);
            var lhs = ((point.y - startPt.y) / (endPt.y - startPt.y));
            var rhs = ((point.x - startPt.x) / (endPt.x - startPt.x));
            if (!isFinite(lhs) || !isFinite(rhs) || isNaN(lhs) || isNaN(rhs)) {
                if (startPt.x === endPt.x) {
                    if (startPt.y === endPt.y) {
                        return 10000;
                    }
                    else if (((startPt.y > point.y) && (point.y > endPt.y)) || ((startPt.y < point.y) && (point.y < endPt.y))) {
                        return Math.abs(startPt.x - point.x);
                    }
                    else {
                        return 10000;
                    }
                }
                else if (startPt.y == endPt.y) {
                    if (((startPt.x > point.x) && (point.x > endPt.x)) || ((startPt.x < point.x) && (point.x < endPt.x))) {
                        return Math.abs(startPt.y - point.y);
                    }
                    else {
                        return 10000;
                    }
                }
                else {
                    return 10000;
                }
            }
            else if (connector.segments.length > 0) {
                if ((startPt.x >= point.x && point.x >= endPt.x) || (startPt.x <= point.x && point.x <= endPt.x) || delX < three) {
                    if ((startPt.y >= point.y && point.y >= endPt.y) || (startPt.y <= point.y && point.y <= endPt.y) || delY < three) {
                        return Math.abs(lhs - rhs);
                    }
                    else {
                        return 10000;
                    }
                }
                else {
                    return 10000;
                }
            }
            else {
                return 10000;
            }
        },
        getPoints: function (connector) {
            var points = [];
            // points.push(connector.sourcePoint);
            if (connector.segments.length > 0) {
                for (var i = 0; i < connector.segments.length; i++) {
                    var segment = connector.segments[i];
                    if (segment.type === "straight" || segment.type === "bezier") {
                        if (i === 0)
                            points.push(connector.sourcePoint);
                        if (segment._point)
                            points.push(segment._point);
                    }
                    else if (segment.type === "orthogonal") {
                        for (var j = 0; j < connector.segments[i].points.length; j++) {
                            points.push(connector.segments[i].points[j]);
                        }
                    }
                }
            }
            return points;
        },
        interSect: function (points1, points2, self, diagram, zOrder) {
            if (self && points2.length >= 2) {
                points2.splice(0, 1);
                points2.splice(0, 1);
            }
            var points = [];
            var bridgeDirection = diagram.bridgeDirection();
            for (var i = 0; i < points1.length - 1; i++) {
                var pt = this.interSect1(points1[i], points1[i + 1], points2, diagram, zOrder, bridgeDirection);
                if (pt.length > 0) {
                    for (var k = 0; k < pt.length; k++) {
                        points.push(pt[k]);
                    }
                }
                if (self && points2.length >= 1) {
                    points2.splice(0, 1);
                }
            }
            return points;
        },
        checkforHorizontalLine: function (angle) {
            var temp = 0;
            var ang = Math.abs(angle);
            if (ang > 90) {
                temp = 180 - ang;
            }
            else {
                temp = ang;
            }
            return temp;
        },
        interSect1: function (startPoint, endPoint, points, diagram, zOrder, bridgeDirection) {
            var points1 = [];
            for (var i = 0; i < points.length - 1; i++) {
                var point = this.interSect2(startPoint, endPoint, points[i], points[i + 1]);
                if (!ej.datavisualization.Diagram.Geometry.isEmptyPoint(point)) {
                    var angle = this._findAngle(startPoint, endPoint);
                    var angle1 = this._findAngle(points[i], points[i + 1]);
                    angle = this.checkforHorizontalLine(angle);
                    angle1 = this.checkforHorizontalLine(angle1);
                    if (bridgeDirection === "left" || bridgeDirection === "right") {
                        if (angle > angle1) {
                            points1.push(point);
                        }
                    }
                    else if (bridgeDirection === "top" || bridgeDirection === "bottom") {
                        if (angle < angle1) {
                            points1.push(point);
                        }
                    }
                    if ((angle === angle1 && zOrder) || diagram._autoConnectEndPoint) {
                        points1.push(point);
                    }
                }
            }
            return points1;
        },
        interSect2: function (start1, end1, start2, end2) {
            var lineUtil1 = ej.datavisualization.Diagram.LineUtil(start1.x, start1.y, end1.x, end1.y);
            var lineUtil2 = ej.datavisualization.Diagram.LineUtil(start2.x, start2.y, end2.x, end2.y);
            var line3 = this.interSect3(lineUtil1, lineUtil2);
            if (line3.enabled) {
                return line3.intersectPt;
            }
            else {
                return ej.datavisualization.Diagram.Point(0, 0);
            }
        },
        interSect3: function (lineUtil1, lineUtil2) {
            var point = ej.datavisualization.Diagram.Point(0, 0);
            var l1 = lineUtil1;
            var l2 = lineUtil2;
            var d = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
            var n_a = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
            var n_b = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
            if (d == 0)
                return { enabled: false, intersectPt: point };
            var ua = n_a / d;
            var ub = n_b / d;
            if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
                point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
                point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
                return { enabled: true, intersectPt: point };
            }
            return { enabled: false, intersectPt: point };
        },
        findLength: function (startPt, endPt) {
            try {
                var length = Math.sqrt(((startPt.x - endPt.x) * (startPt.x - endPt.x)) + ((startPt.y - endPt.y) * (startPt.y - endPt.y)));
                return length;
            }
            catch (e) {
                throw e;
            }
        },
        _findAngle: function (startPt, endPt) {
            var xDiff = startPt.x - endPt.x; var yDiff = startPt.y - endPt.y;
            return Math.atan2(yDiff, xDiff) * (180 / Math.PI);
        },
        findAngle: function (startPt, endPt) {
            if (ej.datavisualization.Diagram.Geometry.isEqualPoint(startPt, endPt))
                return 0;
            var r = ej.datavisualization.Diagram.Point(endPt.x, startPt.y);
            var sr = this.findLength(startPt, r);
            var re = this.findLength(r, endPt);
            var es = this.findLength(endPt, startPt);
            var ang = Math.asin(re / es);
            ang = ang * 180 / Math.PI;
            if (startPt.x < endPt.x) {
                if (startPt.y < endPt.y) {
                }
                else {
                    ang = 360 - ang;
                }
            }
            else {
                if (startPt.y < endPt.y) {
                    ang = 180 - ang;
                }
                else {
                    ang = 180 + ang;
                }
            }
            return ang;
        },
        _mapPalettePhase: function (item) {
            var sPoint, ePoint;
            if (item.orientation && item.orientation == "horizontal") {
                sPoint = { x: 0, y: 0 };
                ePoint = { x: 40, y: 0 };
            }
            else {
                sPoint = { x: 0, y: 0 };
                ePoint = { x: 0, y: 40 };
            }
            var phase = ej.datavisualization.Diagram.Connector({
                name: item ? item.name : ej.datavisualization.Diagram.Util.randomId(),
                segments: [{ type: "straight" }], sourcePoint: { x: sPoint.x, y: sPoint.y }, targetPoint: { x: ePoint.x, y: ePoint.y },
                lineWidth: item.lineWidth ? item.lineWidth : 1,
                lineDashArray: item.lineDashArray ? item.lineDashArray : null,
                lineColor: item.lineColor ? item.lineColor : "#606060",
                targetDecorator: { shape: "none" },
                isPhase: true,
                orientation: item.orientation ? item.orientation : "horizontal",
                labels: item.label ? [item.label] : [],
                paletteItem: item.paletteItem ? item.paletteItem : null,
            });
            return phase;
        },
        _updateShapeProperties: function (options) {
            options._type = "node";
            if (!options.shape.type) options.shape.type = "rectangle";
            switch (options.shape.type) {
                case "rectangle":
                    options.type = "basic";
                    options._shape = options.shape.type;
                    if (options.shape.cornerRadius)
                        options.cornerRadius = options.shape.cornerRadius;
                    break;
                case "ellipse":
                    options.type = "basic";
                    options._shape = options.shape.type;
                    break;
                case "path":
                    options.type = "basic";
                    options._shape = options.shape.type;
                    options.pathData = options.shape.pathData;
                    break;
                case "polygon":
                    options.type = "basic";
                    options._shape = options.shape.type;
                    options.points = options.shape.points;
                    break;
                case "image":
                    options.type = "image";
                    options._shape = options.shape.type;
                    options.source = options.shape.src;
                    break;
                case "native":
                    options.type = "native";
                    options._shape = options.shape.type;
                    options.templateId = options.shape.templateId;
                    break;
                case "text":
                    options.type = "text";
                    options._shape = options.shape.type;
                    options.textBlock = options.shape.textBlock;
                    break;
                case "html":
                    options.type = "html";
                    options._shape = options.shape.type;
                    options.templateId = options.shape.templateId;
                    break;
                default:
                    break;
            }
        },
        _refreshParentGroup: function (node, diagram) {
            var parentObj = diagram.nameTable[node.parent];
            if (parentObj) {
                this._updateGroupBounds(parentObj, diagram);
                var parent = parentObj.parent ? document.getElementById(parentObj.parent) : diagram._diagramLayer;
                ej.datavisualization.Diagram.DiagramContext.renderGroup(parentObj, diagram);
                var cause = diagram._isUndo ? ej.datavisualization.Diagram.GroupChangeCause.HistoryChange : ej.datavisualization.Diagram.GroupChangeCause.Unknown;
                diagram._raiseGroupChangeEvent(node, undefined, parentObj, cause);
            }
        },
        intersectsWith: function (rect, point1, point2) {
            var point = point1;
            var success = ((((rect.x < point.x) && (point.x < (rect.x + rect.width)))
           && (rect.y < point.y)) && (point.y < (rect.y + rect.height)));
            return success;
        },
        _findOffsetOnConnector: function (connector, handle, offset, diagram) {
            var length = 0;
            var lengths = [];
            //find connector length
            for (var i = 0; i < connector.segments.length; i++) {
                lengths[i] = [];
                for (var j = 0; j < connector.segments[i].points.length - 1; j++) {
                    length += ej.datavisualization.Diagram.Geometry.distance(connector.segments[i].points[j], connector.segments[i].points[j + 1]);
                    lengths[i][j] = length;
                }
            }
            var targetNode = connector.sourceNode && handle.offset == 0 && diagram.nameTable[connector.sourceNode] ||
                connector.targetNode && handle.offset == 1 && diagram.nameTable[connector.targetNode];
            var bnds = targetNode ? this.bounds(targetNode) : null;
            var offset = handle.segmentOffset || 0;
            var prevLength, targetSegment, angle, pt;
            //offset length
            var offLength = length * offset;
            for (var i = 0; i < lengths.length; i++) {
                for (var j = 0; j < lengths[i].length; j++) {
                    //segment where offset lies 
                    if (lengths[i][j] >= offLength) {
                        targetSegment = connector.segments[i];
                        angle = ej.datavisualization.Diagram.Geometry.findAngle(targetSegment.points[j], connector.segments[i].points[j + 1]);
                        pt = ej.datavisualization.Diagram.Geometry.transform(targetSegment.points[j], angle, offLength - (prevLength || 0));
                        var endPt;
                        if (targetNode) {
                            if (this.intersectsWith(bnds, pt) && !ej.datavisualization.Diagram.Geometry.containsRect(bnds, this.bounds(connector))) {
                                var direction = handle.offset == 0 ? this._getBezierDirection(targetSegment.points[j], connector.segments[i].points[j + 1])
                                    : this._getBezierDirection(targetSegment.points[j + 1], connector.segments[i].points[j]);
                                endPt = handle.offset == 0 ? targetSegment.points[j + 1] : targetSegment.points[j];
                                var skip = false;
                                switch (direction) {
                                    case "top":
                                        if (bnds.y > endPt.y)
                                            pt.y = bnds.top;
                                        else {
                                            skip = true;
                                        }
                                        break;
                                    case "bottom":
                                        if (bnds.bottom < endPt.y)
                                            pt.y = bnds.bottom;
                                        else {
                                            skip = true;
                                        }
                                        break;
                                    case "right":
                                        if (bnds.right < endPt.x)
                                            pt.x = bnds.right;
                                        else {
                                            skip = true;
                                        }
                                        break;
                                    case "left":
                                        if (bnds.left > endPt.x)
                                            pt.x = bnds.left;
                                        else {
                                            skip = true;
                                        }
                                        break;
                                }
                                if (skip) {
                                    offLength = handle.offset == 1 ? (prevLength || 0) : lengths[i][j];
                                    prevLength = handle.offset == 0 ? lengths[i][j] : (lengths[i][j - 2] || (
                                        lengths[i - 1] && lengths[i - 1].length > 1 ? lengths[i - 1][lengths[i - 1].length - 1] : lengths[i - 2] && lengths[i - 2][lengths[i - 2].length - 1]) || 0);
                                    handle.offset == 0 ? i = i : !j ? i -= 2 : j -= 2;
                                    continue;
                                }
                            } return { segment: i, point: j, offset: { x: pt.x, y: pt.y } };
                        }
                        else return { segment: i, point: j, offset: { x: pt.x, y: pt.y } };
                    }
                    prevLength = lengths[i][j];
                }
            }
        },
        _alignLabelOnSegments: function (node, label, diagram, obj) {
            var angle = obj.angle % 360;
            obj.angle %= 360;
            var fourty5 = 45;
            var one35 = 135;
            var two25 = 225;
            var three15 = 315;
            var bnds;
            if (label.segmentOffset == 0 && node.sourceNode || label.segmentOffset == 1 && node.targetNode) {
                var source = label.segmentOffset == 0 && node.sourceNode ? diagram.nameTable[node.sourceNode] : diagram.nameTable[node.targetNode];
                if (source) bnds = this.bounds(source);
                if (bnds) {
                    var part = 180 / (2 + 2 / (bnds.height / bnds.width));
                    fourty5 = part;
                    one35 = (180 - part);
                    two25 = one35 + (2 * part);
                    three15 = 360 - part;
                }
            }
            var hAlign, vAlign;
            switch (label.alignment) {
                case "before":
                    if (obj.angle >= fourty5 && obj.angle <= one35) { hAlign = "right"; vAlign = label.segmentOffset == 0.5 ? "center" : "top" }
                    else if (obj.angle >= two25 && obj.angle <= three15) { hAlign = "left"; vAlign = label.segmentOffset == 0.5 ? "center" : "bottom" }
                    else if (obj.angle > fourty5 && obj.angle < two25) { vAlign = "top"; hAlign = label.segmentOffset == 0.5 ? "center" : "right" }
                    else { vAlign = "bottom"; hAlign = (label.segmentOffset == 0.5) ? "center" : "left" }
                    break
                case "after":
                    if (obj.angle >= fourty5 && obj.angle <= one35) { hAlign = "left"; vAlign = label.segmentOffset == 0.5 ? "center" : "top" }
                    else if (obj.angle >= two25 && obj.angle <= three15) { hAlign = "right"; vAlign = label.segmentOffset == 0.5 ? "center" : "bottom" }
                    else if (obj.angle > fourty5 && obj.angle < two25) { vAlign = "bottom"; hAlign = label.segmentOffset == 0.5 ? "center" : "right" }
                    else { vAlign = "top"; hAlign = label.segmentOffset == 0.5 ? "center" : "left" }
                    break;
                case "center":
                    hAlign = "center";
                    vAlign = "center";
                    break;
            }
            if (label.boundaryConstraints && (label.segmentOffset == 0 || label.segmentOffset == 1)) {
                var length, direction;
                if (node.segments.length > 1)
                    var segment = node.segments[node.segments.length - 1];
                length = segment ? segment.points.length : node.segments[0].points.length;
                if (node.labels[0].name == label.name)
                    direction = ej.datavisualization.Diagram.Util._getBezierDirection(node.segments[0].points[0], node.segments[0].points[1]);
                else {
                    segment = segment ? segment : node.segments[0];
                    direction = ej.datavisualization.Diagram.Util._getBezierDirection(segment.points[length - 2], segment.points[length - 1]);
                }
                switch (direction) {
                    case "left":
                        hAlign = label.segmentOffset == 0 ? "right" : "left";
                        break;
                    case "right":
                        hAlign = label.segmentOffset == 0 ? "left" : "right";
                        break;
                    case "bottom":
                        vAlign = label.segmentOffset == 0 ? "top" : "bottom";
                        break;
                    case "top":
                        vAlign = label.segmentOffset == 0 ? "bottom" : "top";
                        break;
                }

            }
            return { hAlign: hAlign, vAlign: vAlign };
        },
        getObjectType: function (element) {
            if (element) {
                if (element.segments) return "connector";
                else if (element.type == "bpmn" && element.container) return "group";
                else if ((element._type === "node" || element.type == "bpmn" || element.type == "basic" || element.type == "flow" || element.type == "arrow")) return "node";
                else if (element.type === "text" || element.type === "image" || element.type === "native" || element.type === "html") return "node";
                else if (element._type != "group" && element.type == "pseudoGroup") return "pseudoGroup";
                else if (element._type === "group" || element.isLane || element.isSwimlane) return "group";
                else if (element.isSwimlane) return "swimlane";
                else return null;
            }
            return null;
        },
        _canBeTarget: function (diagram, node) {
            if (node) {
                if (diagram.activeTool.helper && diagram.activeTool.helper._name) {
                    if (diagram.activeTool.helper._name === node.name)
                        return false;
                }
            }
            return true;
        },


        getLabelbounds: function (diagram, node, label) {
            var element;

            if (label) {
                if (diagram.model.labelRenderingMode === "svg") {
                    if (diagram._svg) {
                        var bounds, layerBounds, elementBounds;
                        element = diagram._svg.document.getElementById(node.name + "_" + label.name);
                        layerBounds = diagram._svg.document.getBoundingClientRect();
                        if (element) {
                            elementBounds = element.getBoundingClientRect();
                            bounds = { x: elementBounds.left, y: elementBounds.top, width: elementBounds.width, height: elementBounds.height };
                            var labelCenter = diagram.tools["labelMove"].getCenterOfLabel(label, label.segmentOffset, bounds);
                            return {
                                x: elementBounds.left - layerBounds.left,
                                y: elementBounds.top - layerBounds.top,
                                width: elementBounds.right - elementBounds.left,
                                height: elementBounds.bottom - elementBounds.top,
                                centerX: labelCenter.x,
                                centerY: labelCenter.y
                            };
                        }
                    }
                }
                else {
                    if (diagram._svg) {
                        var htmlLayer = diagram._svg.document.parentNode.getElementsByClassName("htmlLayer")[0];
                        var layerBounds = htmlLayer.getBoundingClientRect();
                        var layerleft = layerBounds.left;
                        var layertop = layerBounds.top;
                        element = $(htmlLayer).find("#" + node.name + "_" + label.name)[0];;
                        if (element) {
                            var elementBounds = element.getBoundingClientRect();
                            var elementleft = ((elementBounds.left - layerleft) / diagram.model.scrollSettings.currentZoom) + (layerleft + diagram.model.scrollSettings.horizontalOffset);
                            var elementtop = ((elementBounds.top - layertop) / diagram.model.scrollSettings.currentZoom) + (layertop + diagram.model.scrollSettings.verticalOffset);
                            var width = elementBounds.width / diagram.model.scrollSettings.currentZoom;
                            var height = elementBounds.height / diagram.model.scrollSettings.currentZoom;

                            layerleft += diagram.model.scrollSettings.horizontalOffset;
                            layertop += diagram.model.scrollSettings.verticalOffset;
                            return ej.datavisualization.Diagram.Rectangle((elementleft - layerleft), (elementtop - layertop), width, height);
                        }
                    }
                }
            }
        },
        _updateBpmnChild: function (options, diagram) {
            switch (options.shape) {
                case "event":
                    options = ej.datavisualization.Diagram.DefautShapes._getBPMNEventShape(options, diagram);
                    break;
                case "gateway":
                    options = ej.datavisualization.Diagram.DefautShapes._getBPMNGatewayShape(options, diagram);
                    break;
                case "dataobject":
                    options = ej.datavisualization.Diagram.DefautShapes._getBPMNDataShape(options, diagram);
                    break;
                case "activity":
                    options = ej.datavisualization.Diagram.DefautShapes._getBPMNActivityShape(options, diagram);
                    break;
                case "group":
                    options = ej.datavisualization.Diagram.DefautShapes._getBPMNGroupShape(options, diagram);
                    break;
            }
            return ej.datavisualization.Diagram.DefautShapes.initBPMNAnnotationShape(options, diagram);
        },
        _getUndoObject: function (diagram, node) {
            var childTable = {};
            var childTable = diagram._getChildTable(node, childTable);
            diagram.activeTool._undoObject = $.extend(true, {}, { node: node, childTable: childTable });
        },
        _getRedoObject: function (diagram, node) {
            var childTable = {};
            var childTable = diagram._getChildTable(node, childTable);
            diagram.activeTool._redoObject = $.extend(true, {}, { node: node, childTable: childTable });
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
        _updateActivityChildOffset: function (node, offset, diagram) {
            if (node.children && node.children.length > 0) {
                for (var i = 0; i < node.children.length; i++) {
                    node.children[i].offsetX = offset.x;
                    node.children[i].offsetY = offset.y;
                    this._updateActivityChildOffset(node.children[i], offset, diagram);
                }
            }
        },
        _updateBPMNProperties: function (node, diagram, nameTable, isScaling) {
            switch (node.shape) {
                case "activity":
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                    var offsetX = node.offsetX, offsetY = node.offsetY;
                    var children = diagram._getChildren(node.children);
                    for (var i = 0; i < children.length; i++) {
                        var child = typeof children[i] == "object" ? children[i] : nameTable[children[i]];
                        if (isScaling && i == 0) {
                            bounds = ej.datavisualization.Diagram.Util.bounds(child, true);
                            offsetX = child.offsetX, offsetY = child.offsetY;
                        }
                        if (i == 0) {
                            child.pathData = child._absolutePath = ej.datavisualization.Diagram.DefautShapes._updateRoundedRectanglePath(node, 12);
                            if (node.subProcess.type == "transaction") {
                                var innerRect = { x: 3, y: 3, width: node.width - 3, height: node.height - 3 };
                                child.pathData = child._absolutePath += ej.datavisualization.Diagram.DefautShapes._updateRoundedRectanglePath(innerRect, 12)
                            }
                            delete child._absoluteBounds;
                        }
                        if (isScaling && ej.datavisualization.Diagram.Util.canResize(child)) continue;
                        var addInfo = child.addInfo;
                        if (addInfo && addInfo.offset) {
                            var offset = ej.datavisualization.Diagram.Point(bounds.x + bounds.width * addInfo.offset.x, bounds.y + bounds.height * addInfo.offset.y);
                            addInfo.margin = ej.datavisualization.Diagram.Margin(addInfo.margin ? addInfo.margin : {});
                            if (addInfo.hAlign) {
                                offset.x += addInfo.margin.left - addInfo.margin.right;
                                offset.x = addInfo.hAlign == "left" ? offset.x + addInfo.margin.right : (addInfo.hAlign == "right" ? offset.x - addInfo.margin.left : offset.x);
                            }
                            if (addInfo.vAlign) {
                                offset.y += addInfo.margin.top - addInfo.margin.bottom;
                                offset.y = addInfo.vAlign == "top" ? offset.y + addInfo.margin.bottom : (addInfo.vAlign == "bottom" ? offset.y - addInfo.margin.top : offset.y);
                            }
                            if (node.rotateAngle) {
                                var matrix = ej.Matrix.identity();
                                ej.Matrix.rotate(matrix, node.rotateAngle, offsetX, offsetY);
                                offset = ej.Matrix.transform(matrix, offset);
                            }
                            child.offsetX = offset.x;
                            child.offsetY = offset.y;
                            this._updateActivityChildOffset(child, offset, diagram);
                        }
                    }
                    break;
                case "group":
                    node.pathData = node._absolutePath = ej.datavisualization.Diagram.DefautShapes._updateRoundedRectanglePath(node, 15);
                    node._scaled = false;
                    break;
                case "annotation":
                    var connector;
                    for (var i = 0; i < node.outEdges.length; i++) {
                        var edge = diagram.nameTable[node.outEdges[i]];
                        if (edge._isAnnotationLine) {
                            connector = edge;
                            break;
                        }
                    }
                    if (connector) ej.datavisualization.Diagram.DefautShapes.updateBPMNAnnotationShape(connector, node, null, null, diagram);
                    break;
                case "dataobject":
                    var bounds = ej.datavisualization.Diagram.Util.bounds(node, true);
                    var offsetX = node.offsetX, offsetY = node.offsetY;
                    var children = diagram._getChildren(node.children);
                    var pivot = node.pivot || { x: 0.5, y: 0.5 };
                    var x = node.offsetX ? node.offsetX - node.width * pivot.x : node.width * pivot.x;
                    var y = node.offsetY ? node.offsetY - node.height * pivot.y : node.height * pivot.y;
                    for (var i = 0; i < children.length; i++) {
                        var child = typeof children[i] == "object" ? children[i] : nameTable[children[i]];
                        if (isScaling && ej.datavisualization.Diagram.Util.canResize(child)) continue;
                        var addInfo = child.addInfo;
                        addInfo.margin = ej.datavisualization.Diagram.Margin(addInfo.margin ? addInfo.margin : {});
                        if (addInfo.offset) {
                            var offset = ej.datavisualization.Diagram.Point({})
                            offset.x = x + ((addInfo.offset.x * node.width)) + addInfo.margin.left - addInfo.margin.right;
                            offset.y = y + ((addInfo.offset.y * node.height)) + addInfo.margin.top - addInfo.margin.bottom;
                            if (node.rotateAngle) {
                                var matrix = ej.Matrix.identity();
                                ej.Matrix.rotate(matrix, node.rotateAngle, offsetX, offsetY);
                                offset = ej.Matrix.transform(matrix, offset);
                            }
                            child.offsetX = offset.x;
                            child.offsetY = offset.y;
                        }
                    }
                    break;
            }
        },
        indexOf: function (array, obj) {
            if (array != null && obj != null) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i] == obj) {
                        return i;
                    }
                }
            }

            return -1;
        },
    };
    ej.datavisualization.Diagram.BridgeSegments = {
        bridges: [],
        bridgeStartPoint: [],
        segmentIndex: -1
    };
    ej.datavisualization.Diagram.PathSegment = {
        path: "",
        startPoint: { "x": 0, "y": 0 },
        endPoint: { "x": 0, "y": 0 },
        angle: 0,
        segmentPointIndex: -1,
        sweep: 1
    };
    ej.datavisualization.Diagram.LineUtil = function (x1, y1, x2, y2) {
        return { "x1": Number(x1) || 0, "y1": Number(y1) || 0, "x2": Number(x2) || 0, "y2": Number(y2) || 0 };
    };
    //#endregion
    //#region Geometry
    ej.datavisualization.Diagram.Geometry = {
        checkPointOnCircle: function (point, center, radius) {
            var r2 = Math.pow(radius, 2);
            var x2 = Math.pow((point.x - center.x), 2);
            var y2 = Math.pow((point.y - center.y), 2);
            if ((x2 + y2) <= r2) {
                return true;
            }
            return false;
        },
        rect: function (points) {
            var rectangle = ej.datavisualization.Diagram.Rectangle();
            if (arguments.length === 1) {
                var left = Number.MAX_VALUE;
                var top = Number.MAX_VALUE;
                var right = -Number.MAX_VALUE;
                var bottom = -Number.MAX_VALUE;
                var len = points.length;
                var x, y;
                for (var i = 0; i < len; i++) {
                    x = points[i].x;
                    y = points[i].y;
                    if (x < left) {
                        left = x;
                    }
                    if (x > right) {
                        right = x;
                    }
                    if (y < top) {
                        top = y;
                    }
                    if (y > bottom) {
                        bottom = y;
                    }
                }
                rectangle = ej.datavisualization.Diagram.Rectangle(left, top, right - left, bottom - top);
            }
            else if (arguments.length === 2) {
                var ptStart = ej.datavisualization.Diagram.Point(arguments[0]);
                var ptEnd = ej.datavisualization.Diagram.Point(arguments[1]);
                var swap;
                if (ptStart.x > ptEnd.x) {
                    swap = ptStart.x;
                    ptStart.x = ptEnd.x;
                    ptEnd.x = swap;
                }
                if (ptStart.y > ptEnd.y) {
                    swap = ptStart.y;
                    ptStart.y = ptEnd.y;
                    ptEnd.y = swap;
                }
                rectangle = ej.datavisualization.Diagram.Rectangle(ptStart.x, ptStart.y, ptEnd.x - ptStart.x, ptEnd.y - ptStart.y);
            }
            return rectangle;
        },
        union: function (rect1, rect2) {
            var x = Math.min(rect1.x, rect2.x);
            var y = Math.min(rect1.y, rect2.y);
            var width = Math.max(rect1.x + rect1.width, rect2.x + rect2.width);
            var height = Math.max(rect1.y + rect1.height, rect2.y + rect2.height);
            return ej.datavisualization.Diagram.Rectangle(x, y, width - x, height - y);
        },
        distance: function (pt1, pt2) {
            return Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
        },
        translate: function (pt1, dx, dy) {
            return ej.datavisualization.Diagram.Point(pt1.x + dx, pt1.y + dy);
        },
        intersectsRect: function (rect1, rect2) {
            return ((((rect2.x < (rect1.x + rect1.width)) && (rect1.x < (rect2.x + rect2.width)))
                && (rect2.y < (rect1.y + rect1.height))) && (rect1.y < (rect2.y + rect2.height)));
        },
        findAngle: function (point1, point2) {
            var angle = Math.atan2(point2.y - point1.y, point2.x - point1.x);
            angle = (180 * angle / Math.PI);
            angle %= 360;
            if (angle < 0) {
                angle += 360;
            }
            return angle;
        },
        intersectSegment: function (segment1, segment2) {
            var x1 = segment1.point1.x;
            var y1 = segment1.point1.y;
            var x2 = segment1.point2.x;
            var y2 = segment1.point2.y;
            var x3 = segment2.point1.x;
            var y3 = segment2.point1.y;
            var x4 = segment2.point2.x;
            var y4 = segment2.point2.y;
            var a1, a2, b1, b2, c1, c2, x, y;
            var r1, r2, r3, r4;
            var denom, offset, num;
            a1 = y2 - y1;
            b1 = x1 - x2;
            c1 = (x2 * y1) - (x1 * y2);
            r3 = ((a1 * x3) + (b1 * y3) + c1);
            r4 = ((a1 * x4) + (b1 * y4) + c1);
            if ((r3 !== 0) && (r4 !== 0) && this.sameSign(r3, r4)) {
                return null;
            }
            a2 = y4 - y3;
            b2 = x3 - x4;
            c2 = (x4 * y3) - (x3 * y4);
            r1 = (a2 * x1) + (b2 * y1) + c2;
            r2 = (a2 * x2) + (b2 * y2) + c2;
            if ((r1 !== 0) && (r2 !== 0) && (this.sameSign(r1, r2))) {
                return null;
            }
            denom = (a1 * b2) - (a2 * b1);

            if (denom === 0) {
                return null;
            }
            if (denom < 0) {
                offset = -denom / 2;
            }
            else {
                offset = denom / 2;
            }
            offset = 0;
            num = (b1 * c2) - (b2 * c1);
            if (num < 0) {
                x = (num - offset) / denom;
            }
            else {
                x = (num + offset) / denom;
            }
            num = (a2 * c1) - (a1 * c2);
            if (num < 0) {
                y = (num - offset) / denom;
            }
            else {
                y = (num + offset) / denom;
            }
            return ej.datavisualization.Diagram.Point(x, y);
        },
        updatePath: function (x, y, width, height, pathData, svg, bounds, appendBoundsTo) {
            var bBox, isInit;
            if (svg && svg.pathBounds) {
                isInit = true;
                bBox = bounds || svg.pathBounds(pathData);
            }
            else {
                if (appendBoundsTo && !appendBoundsTo._absolutePath) isInit = true; else isInit = false;
                bBox = bounds;
            }
            if (appendBoundsTo) appendBoundsTo._absoluteBounds = bBox;
            var newX = 0, newY = 0;
            var isResize = false;
            if (x.toString() !== bBox.x || y.toString() !== bBox.y) {
                newX = x - Number(bBox.x);
                newY = y - Number(bBox.y);
            }
            if (width !== bBox.width || height !== bBox.height) {
                newX = width / Number(bBox.width ? bBox.width : 1);
                newY = height / Number(bBox.height ? bBox.height : 1);
                isResize = true;
            }
            return ej.datavisualization.Diagram.Geometry.processPathData(pathData, newX, newY, isResize, bBox.x, bBox.y, x, y, isInit, svg);
        },
        processPathData: function (path, newX, newY, isResizing, oldX, oldY, offsetX, offsetY, isInit, svg) {
            var shape = document.createElementNS('http://www.w3.org/2000/svg', "path");
            shape.setAttribute("d", path);
            if (isInit) {
                svg = svg || new ej.datavisualization.Diagram.Svg({});
                path = svg.absolutePath(shape).getAttribute('d');
                shape.setAttribute("d", path);
            }
            var x0, y0, x1, y1, x2, y2, segs = ej.datavisualization.Diagram.Util.convertPathToArray(path);
            for (var x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                var seg = segs[i], char = seg.pathSegTypeAsLetter;
                if ('x1' in seg) x1 = seg.x1;
                if ('x2' in seg) x2 = seg.x2;
                if ('y1' in seg) y1 = seg.y1;
                if ('y2' in seg) y2 = seg.y2;
                if ('x' in seg) x = seg.x;
                if ('y' in seg) y = seg.y;
                if (isResizing) {
                    if (x != undefined) {
                        x = ej.datavisualization.Diagram.Geometry.scalePathData(x, newX, oldX, offsetX);
                        x = Number(x.toFixed(2));
                    }
                    if (y != undefined) {
                        y = ej.datavisualization.Diagram.Geometry.scalePathData(y, newY, oldY, offsetY);
                        y = Number(y.toFixed(2));
                    }
                    if (x1 != undefined) {
                        x1 = ej.datavisualization.Diagram.Geometry.scalePathData(x1, newX, oldX, offsetX);
                        x1 = Number(x1.toFixed(2));
                    }
                    if (y1 != undefined) {
                        y1 = ej.datavisualization.Diagram.Geometry.scalePathData(y1, newY, oldY, offsetY);
                        y1 = Number(y1.toFixed(2));
                    }
                    if (x2 != undefined) {
                        x2 = ej.datavisualization.Diagram.Geometry.scalePathData(x2, newX, oldX, offsetX);
                        x2 = Number(x2.toFixed(2));
                    }
                    if (y2 != undefined) {
                        y2 = ej.datavisualization.Diagram.Geometry.scalePathData(y2, newY, oldY, offsetY);
                        y2 = Number(y2.toFixed(2));
                    }
                }
                else {
                    if (x != undefined) {
                        x = (x + newX);
                    }
                    if (y != undefined) {
                        y = (y + newY);
                    }
                    if (x1 != undefined) {
                        x1 = (x1 + newX);
                    }
                    if (y1 != undefined) {
                        y1 = (y1 + newY);
                    }
                    if (x2 != undefined) {
                        x2 = (x2 + newX);
                    }
                    if (y2 != undefined) {
                        y2 = (y2 + newY);
                    }
                }
                var newSeg;
                switch (char) {
                    case 'M':
                        newSeg = { pathSegTypeAsLetter: "M", x: x, y: y };
                        break;
                    case 'L':
                        newSeg = { pathSegTypeAsLetter: "L", x: x, y: y };
                        break;
                    case 'H':
                        newSeg = { pathSegTypeAsLetter: "H", x: x };
                        break;
                    case 'V':
                        newSeg = { pathSegTypeAsLetter: "V", y: y };
                        break;
                    case 'C':
                        newSeg = { pathSegTypeAsLetter: "C", x: x, y: y, x1: x1, y1: y1, x2: x2, y2: y2 };
                        break;
                    case 'S':
                        newSeg = { pathSegTypeAsLetter: "S", x: x, y: y, x2: x2, y2: y2 };
                        break;
                    case 'Q':
                        newSeg = { pathSegTypeAsLetter: "Q", x: x, y: y, x1: x1, y1: y1 };
                        break;
                    case 'T':
                        newSeg = { pathSegTypeAsLetter: "T", x: x, y: y };
                        break;
                    case 'A':
                        var r1 = seg.r1, r2 = seg.r2;
                        if (isResizing) {
                            r1 = (r1 * newX);
                            r2 = (r2 * newY);
                        }
                        newSeg = { pathSegTypeAsLetter: "A", x: x, y: y, r1: r1, r2: r2, angle: seg.angle, largeArcFlag: seg.largeArcFlag, sweepFlag: seg.sweepFlag };
                        break;
                    case 'z':
                    case 'Z':
                        x = x0; y = y0;
                        newSeg = segs[i];
                        break;
                }
                if (newSeg)
                    segs[i] = newSeg;
                // Record the start of a subpath
                if (char === 'M' || char === 'm') x0 = x, y0 = y;
            }
            var pathData = ej.datavisualization.Diagram.Util.pathSegArrayAsString(segs);
            return pathData;
        },
        scalePathData: function (val, scaleFactor, oldOffset, newOffset) {
            if (val !== oldOffset) {
                if (newOffset !== oldOffset) {
                    val = (((val * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)))
                        + (newOffset - Number(oldOffset)));
                }
                else
                    val = ((Number(val) * scaleFactor) - (Number(oldOffset) * scaleFactor - Number(oldOffset)));
            }
            else {
                if (newOffset !== oldOffset) {
                    val = newOffset;
                }
            }
            return val;
        },
        updatePolygonPoints: function (node, points) {
            if (node.points) {
                if (!points)
                    points = node.points;
                ej.datavisualization.Diagram.Geometry.scalePoints(points, node);
                var bounds = ej.datavisualization.Diagram.Geometry.rect(node.points);
                for (var i = 0, len = node.points.length; i < len; ++i) {
                    var point = ej.datavisualization.Diagram.Geometry.translate(points[i], -bounds.x, -bounds.y);
                    point = ej.datavisualization.Diagram.Geometry.translate(point, 0, 0);
                    points[i] = point;
                }
            }
        },
        scalePoints: function (points, node) {
            var bounds = ej.datavisualization.Diagram.Geometry.rect(node.points);
            if (bounds.width > 0 && bounds.height > 0) {
                var scaleX = node.width / bounds.width;
                var scaleY = node.height / bounds.height;
                for (var i = 0, len = node.points.length; i < len; ++i) {
                    points[i].x = points[i].x * scaleX;
                    points[i].y = points[i].y * scaleY;
                }
            }
        },
        sameSign: function (a, b) {
            return ((a * b) >= 0);
        },
        containsPoint: function (rect, point) {
            return ((((rect.x <= point.x) && (point.x <= (rect.x + rect.width)))
            && (rect.y <= point.y)) && (point.y <= (rect.y + rect.height)));
        },
        containsRect: function (rect, value) {
            return ((((rect.x <= value.x) && ((value.x + value.width) <= (rect.x + rect.width)))
               && (rect.y <= value.y)) && ((value.y + value.height) <= (rect.y + rect.height)));
        },
        inflate: function (rect, x, y) {
            rect.x -= x;
            rect.y -= y;
            rect.width += 2 * x;
            rect.height += 2 * y;
        },
        isEmptyRect: function (rect) {
            return rect.x === 0 && rect.y === 0 && rect.width === 0 && rect.height === 0;
        },
        isEmptyPoint: function (point) {
            return point.x === 0 && point.y === 0;
        },
        isEqualPoint: function (point1, point2) {
            return (point1 && point2 && point1.x === point2.x && point1.y === point2.y);
        },
        isEmptySize: function (size) {
            return size.width === 0 && size.height === 0;
        },
        length: function (segment) {
            return ej.datavisualization.Diagram.Geometry.distance(segment.point1, segment.point2);
        },
        midPoint: function (segment) {
            return ej.datavisualization.Diagram.Point((segment.point1.x + segment.point2.x) / 2, (segment.point1.y + segment.point2.y) / 2);
        },
        transform: function (point, angle, length) {
            var pt = {};
            pt.x = Math.round((point.x + length * Math.cos(angle * Math.PI / 180)) * 100) / 100;
            pt.y = Math.round((point.y + length * Math.sin(angle * Math.PI / 180)) * 100) / 100;
            return pt;
        }
    };
    ej.datavisualization.Diagram.LineSegment = function (point1, point2) {
        return { "point1": point1, "point2": point2 };
    };
    ej.datavisualization.Diagram.Point = function (x, y) {
        return { "x": Number(x) || 0, "y": Number(y) || 0 };
    };
    ej.datavisualization.Diagram.Size = function (width, height) {
        return { "width": Number(width) || 0, "height": Number(height) || 0 };
    };
    ej.datavisualization.Diagram.Rectangle = function (x, y, width, height) {
        return { "x": Number(x) || 0, "y": Number(y) || 0, "width": Number(width) || 0, "height": Number(height) || 0 };
    };
    //#endregion
    //#region Enums
    ej.datavisualization.Diagram.ImageAlignment = {
        None: "none",
        XMinYMin: "xminymin",
        XMinYMid: "xminymid",
        XMinYMax: "xminymax",
        XMidYMin: "xmidymin",
        XMidYMid: "xmidymid",
        XMidYMax: "xmidymax",
        XMaxYMin: "xmaxymin",
        XMaxYMid: "xmaxymid",
        XMaxYMax: "xmaxymax"
    }
    ej.datavisualization.Diagram.ActiveTool = {
        None: "none",
        Drag: "drag",
        Draw: "draw"
    }
    ej.datavisualization.Diagram.ScaleConstraints = {
        None: "none",
        Stretch: "stretch",
        Meet: "meet",
        Slice: "slice"
    }
    ej.datavisualization.Diagram.KeyModifiers = {
        None: 0,
        Control: 1 << 0,
        Meta: 1 << 0,
        Alt: 1 << 1,
        Shift: 1 << 2
    };
    ej.datavisualization.Diagram.Keys = {
        None: "",
        Number0: 0,
        Number1: 1,
        Number2: 2,
        Number3: 3,
        Number4: 4,
        Number5: 5,
        Number6: 6,
        Number7: 7,
        Number8: 8,
        Number9: 9,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        Left: 37,
        Up: 38,
        Right: 39,
        Down: 40,
        Escape: 27,
        Delete: 46,
        Tab: 9,
        Enter: 13,
    };
    ej.datavisualization.Diagram.LabelRenderingMode = {
        Html: "html",
        Svg: "svg"
    };
    ej.datavisualization.Diagram.TemplateType = {
        Html: "html",
        Svg: "svg"
    };
    ej.datavisualization.Diagram.DecoratorShapes = {
        None: "none",
        Arrow: "arrow",
        OpenArrow: "openarrow",
        Circle: "circle",
        Diamond: "diamond",
        Path: "path"
    };
    ej.datavisualization.Diagram.ConnectorType = {
        StraightLine: "straightLine",
        OrthogonalLine: "orthogonalLine",
        Polyline: "polyline",
    };
    ej.datavisualization.Diagram.ActionType = {
        Unknown: "unknown",
        Nudge: "nudge",
        Touch: "touch",
        Mouse: "mouse",
        Order: "order",
        Align: "align",
        Size: "size",
        HistoryChange: "historyChange"
    };
    ej.datavisualization.Diagram.dependentconnector = {
        dependent: 1,
        independent: 2
    }
    ej.datavisualization.Diagram.ContainerType = {
        Canvas: "canvas",
        Stack: "stack",
    };
    ej.datavisualization.Diagram.IconShapes = {
        Minus: "minus",
        Plus: "plus",
        ArrowUp: "arrowup",
        ArrowDown: "arrowdown",
        Template: "template",
        Path: "path",
        Image: "image",
        None: "none",
    };
    ej.datavisualization.Diagram.PortShapes = {
        X: "x",
        Circle: "circle",
        Square: "square",
        Path: "path"
    };
    ej.datavisualization.Diagram.TickAlignment = {
        LeftOrTop: "leftortop",
        RightOrBottom: "rightorbottom",
    },
    ej.datavisualization.Diagram.PortVisibility = {
        Visible: 1 << 0,
        Hidden: 1 << 1,
        Hover: 1 << 2,
        Connect: 1 << 3,
        Default: 1 << 3
    };
    ej.datavisualization.Diagram.TextAlign = {
        Left: "left",
        Center: "center",
        Right: "right",
        Justify: "justify"
    };
    ej.datavisualization.Diagram.HorizontalAlignment = {
        Left: "left",
        Center: "center",
        Right: "right",
        Stretch: "stretch"
    };
    ej.datavisualization.Diagram.Alignment = {
        Before: "before",
        After: "after",
        Center: "center"
    };
    ej.datavisualization.Diagram.LabelRelativeMode = {
        SegmentBounds: "segmentbounds",
        SegmentPath: "segmentpath"
    }
    ej.datavisualization.Diagram.LabelEditMode = {
        Edit: "edit",
        View: "view"
    };
    ej.datavisualization.Diagram.RelativeMode = {
        Object: "object",
        Mouse: "mouse"
    };
    ej.datavisualization.Diagram.TextWrapping = {
        NoWrap: "nowrap",
        Wrap: "wrap",
        WrapWithOverflow: "wrapwithoverflow",
    };
    ej.datavisualization.Diagram.VerticalAlignment = {
        Top: "top",
        Center: "center",
        Bottom: "bottom",
        Stretch: "stretch"
    };
    ej.datavisualization.Diagram.TextDecorations = {
        Underline: "underline",
        Overline: "overline",
        LineThrough: "line-through",
        None: "none"
    };
    ej.datavisualization.Diagram.PaletteConstraints = {
        HeaderVisibility: 1 << 1,
        Visible: 1 << 2,
        Expandable: 1 << 3,
        Default: 1 << 1 | 1 << 2 | 1 << 3
    };
    ej.datavisualization.Diagram.NodeConstraints = {
        None: 1 << 0,
        Select: 1 << 1,
        Delete: 1 << 2,
        Drag: 1 << 3,
        Rotate: 1 << 4,
        Connect: 1 << 5,
        ResizeNorthEast: 1 << 6,
        ResizeEast: 1 << 7,
        ResizeSouthEast: 1 << 8,
        ResizeSouth: 1 << 9,
        ResizeSouthWest: 1 << 10,
        ResizeWest: 1 << 11,
        ResizeNorthWest: 1 << 12,
        ResizeNorth: 1 << 13,
        Resize: 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9 | 1 << 10 | 1 << 11 | 1 << 12 | 1 << 13,
        Shadow: 1 << 14,
        DragLabel: 1 << 15,
        AllowPan: 1 << 16,
        AspectRatio: 1 << 17,
        AllowDrop: 1 << 18,
        InheritTooltip: 1 << 19,
        MultiSelect: 1 << 20,
        PointerEvents: 1 << 21,
        PointerVisibility: 1 << 21,
        CrispEdges: 1 << 22,
        InheritCrispEdges: 1 << 23,
        Interaction: 1 << 1 | 1 << 3 | 1 << 4 | 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9 | 1 << 10 | 1 << 11 | 1 << 12 | 1 << 13 | 1 < 21,
        Default: 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8 | 1 << 9 | 1 << 10 | 1 << 11 | 1 << 12 | 1 << 13 | 1 << 19 | 1 << 21 | 1 << 23
    };
    ej.datavisualization.Diagram.LabelConstraints = {
        None: 1 << 0,
        Selectable: 1 << 1,
        Draggable: 1 << 2,
        Resizable: 1 << 3,
        Rotatable: 1 << 4,
        All: 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4
    };
    ej.datavisualization.Diagram.HistoryChangeCause = {
        Undo: "undo",
        Redo: "redo",
        CustomAction: "customAction"
    };
    ej.datavisualization.Diagram.CollectionChangeCause = {
        ClipBoard: "clipBoard",
        Drop: "drop",
        HistoryChange: "historyChange",
        Unknown: "unknown",
    };
    ej.datavisualization.Diagram.GroupChangeCause = {
        Group: "group",
        Ungroup: "ungroup",
        Drop: "drop",
        HistoryChange: "historyChange",
        Unknown: "unknown"
    };
    ej.datavisualization.Diagram.SelectionChangeCause = {
        Keydown: "keydown",
        RubberBand: "rubberBand",
        Mouse: "mouse",
        Touch: "touch",
        Unknown: "unknown",
    };
    ej.datavisualization.Diagram.ScrollChangeCause = {
        Zoom: "zoom",
        Pan: "pan",
        Unknown: "unknown"
    };
    ej.datavisualization.Diagram.ConnectorConstraints = {
        None: 1 << 0,
        Select: 1 << 1,
        Delete: 1 << 2,
        Drag: 1 << 3,
        DragSourceEnd: 1 << 4,
        DragTargetEnd: 1 << 5,
        DragSegmentThumb: 1 << 6,
        Bridging: 1 << 7,
        DragLabel: 1 << 8,
        InheritBridging: 1 << 9,
        AllowDrop: 1 << 10,
        InheritTooltip: 1 << 11,
        PointerEvents: 1 << 12,
        PointerVisibility: 1 << 12,
        CrispEdges: 1 << 13,
        InheritCrispEdges: 1 << 14,
        DragLimit: 1 << 15,
        BridgeObstacle: 1 << 16,
        Routing: 1 << 17,
        InheritRouting: 1 << 18,
        Interaction: 1 << 1 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 || 1 << 12,
        Default: 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 9 | 1 << 11 | 1 << 12 | 1 << 14 | 1 << 16 | 1 << 18
    };
    ej.datavisualization.Diagram.PortConstraints = {
        None: 1 << 0,
        Connect: 1 << 1,
        ConnectOnDrag: 1 << 2,
    };
    ej.datavisualization.Diagram.SelectorConstraints = {
        None: 1 << 0,
        Rotator: 1 << 1,
        Resizer: 1 << 2,
        UserHandles: 1 << 3,
        Tooltip: 1 << 4,
        DragOnEmptySpace: 1 << 5,
        AutoHideThumbs: 1 << 6,
        All: 1 << 1 | 1 << 2 | 1 << 3 | 1 << 4
    };
    ej.datavisualization.Diagram.UserHandlePositions = {
        TopLeft: "topleft",
        TopCenter: "topcenter",
        TopRight: "topright",
        MiddleLeft: "middleleft",
        MiddleRight: "middleright",
        BottomLeft: "bottomleft",
        BottomCenter: "bottomcenter",
        BottomRight: "bottomright"
    };
    ej.datavisualization.Diagram.SnapConstraints = {
        None: 0,
        SnapToHorizontalLines: 1,
        SnapToVerticalLines: 2,
        SnapToLines: 1 | 2,
        ShowHorizontalLines: 4,
        ShowVerticalLines: 8,
        ShowLines: 4 | 8,
        All: 1 | 2 | 4 | 8
    };
    ej.datavisualization.Diagram.PageOrientations = {
        Landscape: "landscape",
        Portrait: "portrait"
    };
    ej.datavisualization.Diagram.ScrollLimit = {
        Infinity: "infinity",
        Diagram: "diagram",
        Limited: "limited"
    };
    ej.datavisualization.Diagram.BoundaryConstraints = {
        Infinity: "infinity",
        Diagram: "diagram",
        Page: "page"
    };
    ej.datavisualization.Diagram.LayoutOrientations = {
        TopToBottom: "toptobottom",
        BottomToTop: "bottomtotop",
        LeftToRight: "lefttoright",
        RightToLeft: "righttoleft"
    };
    ej.datavisualization.Diagram.ObjectTypes = {
        Diagram: "diagram",
        Palette: "palette",
        Lane: "lane",
        Group: "group"
    };
    ej.datavisualization.Diagram.PaletteDefaults = {
        name: "",
        expanded: false,
        subControlId: null,
        items: [],
        constraints: ej.datavisualization.Diagram.PaletteConstraints.Default,
    };
    ej.datavisualization.Diagram.Palette = function (options) {
        options.items = options.items ? options.items.slice() : [];
        return $.extend(false, {}, ej.datavisualization.Diagram.PaletteDefaults, options);
    };
    ej.datavisualization.Diagram.Shapes = {
        Image: "image",
        Text: "text",
        Html: "html",
        Native: "native",
        Basic: "basic",
        Flow: "flow",
        Arrow: "arrow",
        BPMN: "bpmn",
    };
    ej.datavisualization.Diagram.ClipBoardChangeType = {
        All: "all",
        None: "none",
        Specific: "specific"
    };
    ej.datavisualization.Diagram.OverflowType = {
        Clip: "clip",
        Ellipsis: "ellipsis"
    };
    ej.datavisualization.Diagram.ShapeDefaults = {
        shape: "",
        source: "",
        pathData: "",
        textBlock: null,
        points: [],
        templateId: null,
        scale: "meet",
        contentAlignment: "xmidymid"
    };
    ej.datavisualization.Diagram.Shape = function (options) {
        if (options) {
            options.points = options.points ? options.points.slice() : [];
            if (options.type === "html") {
                if (typeof (options.html) === "string")
                    options.html = ej.datavisualization.Diagram.Util.htmlEncode(options.html);
            }
            if (options.type === "text") {
                options.textBlock = ej.datavisualization.Diagram.TextBlock(options.textBlock ? options.textBlock : {});
                options.fillColor = options.fillColor ? options.fillColor : "transparent";
                options.borderColor = options.borderColor ? options.borderColor : "transparent";
                options.borderWidth = options.borderWidth ? options.borderWidth : 0;
            }
            if (options.type == "image" || options.type == "native" || options.type === "text" || options.type === "html")
                options._shape = options.type;
            if (!options._type)
                options._type = options.type ? options.type : "node";
            if (!options._shape)
                options._shape = options.shape ? options.shape : "rectangle";
            options.points = options.points ? options.points.slice() : [];
        }

        return $.extend(false, {}, ej.datavisualization.Diagram.ShapeDefaults, options);
    };
    ej.datavisualization.Diagram.Segments = {
        Straight: "straight",
        Orthogonal: "orthogonal",
        Bezier: "bezier"
    };
    ej.datavisualization.Diagram.SegmentDefaults = {
        type: ej.datavisualization.Diagram.Segments.Straight,
        point: null,
        point1: null,
        point2: null,
        vector1: null,
        vector2: null,
        _point1: ej.datavisualization.Diagram.Point(),
        _point2: ej.datavisualization.Diagram.Point(),
        length: null, _length: null,
        _bridges: [],
        direction: null, _direction: null,
    };
    ej.datavisualization.Diagram.Segment = function (options) {
        var line = $.extend(true, {}, ej.datavisualization.Diagram.SegmentDefaults, options);
        line._bridges = line._bridges ? line._bridges.slice() : [];
        var points = [];
        line["points"] = points;
        if (line.type == "orthogonal") {
            line._length = line.length;
            line._direction = line.direction;
        }
        else {
            if (line.type == "bezier") {
                line._point1 = line.point1;
                line._point2 = line.point2;
            }
            if (line.point) {
                line._point = line.point;
            }
        }
        return line;
    };
    //#endregion


    ej.datavisualization.Diagram.DragLimitDefaults = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 10
    };
    ej.datavisualization.Diagram.DragLimit = function (options) {
        return $.extend(true, {}, ej.datavisualization.Diagram.DragLimitDefaults, options);
    };

    //#region Margin
    ej.datavisualization.Diagram.MarginDefaults = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    ej.datavisualization.Diagram.Margin = function (options) {
        options = options || {};
        return $.extend(false, {}, ej.datavisualization.Diagram.MarginDefaults, options);
    };
    ej.datavisualization.Diagram.PaddingDefaults = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    ej.datavisualization.Diagram.Padding = function (options) {
        options = options || {};
        return $.extend(false, {}, ej.datavisualization.Diagram.PaddingDefaults, options);
    };

    ej.datavisualization.Diagram.EndPointHitPaddingDefaults = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };
    ej.datavisualization.Diagram.EndPointHitPadding = function (options) {
        options = options || {};
        options.top = options.top || 0;
        options.left = options.left || 0;
        options.right = options.right || 0;
        options.bottom = options.bottom || 0;
        return options;
    };

    ej.datavisualization.Diagram.GestureDefaults = {
        key: ej.datavisualization.Diagram.Keys.None,
        keyModifiers: ej.datavisualization.Diagram.KeyModifiers.None
    };
    ej.datavisualization.Diagram.Gesture = function (options) {
        return $.extend(true, {}, ej.datavisualization.Diagram.GestureDefaults, options);
    };
    //#region Command
    ej.datavisualization.Diagram.CommandDefaults = {
        gesture: ej.datavisualization.Diagram.Gesture(),
        execute: null,
        canExecute: null,
        parameter: null
    };
    ej.datavisualization.Diagram.Command = function (options) {
        if (options.gesture) options.gesture = ej.datavisualization.Diagram.Gesture(options.gesture);
        if (!options.canExecute) options.canExecute = function (args) {
            return true;
        }
        if (!options.execute) options.execute = function (args) {
        }
        return $.extend(true, {}, ej.datavisualization.Diagram.CommandDefaults, options);
    };
    //#endregion
    //#region Tooltip
    ej.datavisualization.Diagram.TooltipDefaults = {
        templateId: "",
        relativeMode: "object",
        alignment: {
            horizontal: "center",
            vertical: "bottom",
        },
        margin: { left: 5, right: 5, top: 5, bottom: 5 },
        offset: null,
        delay: 0
    };
    ej.datavisualization.Diagram.Tooltip = function (options) {
        options.margin = options.margin || {};
        options.margin.top = options.margin.top !== undefined ? options.margin.top : 5;
        options.margin.left = options.margin.left !== undefined ? options.margin.left : 5;
        options.margin.right = options.margin.right !== undefined ? options.margin.right : 5;
        options.margin.bottom = options.margin.bottom !== undefined ? options.margin.bottom : 5;
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);

        options.alignment = options.alignment || {};
        if (options.alignment) {
            options.alignment.horizontal = options.alignment.horizontal ? options.alignment.horizontal : "center";
            options.alignment.vertical = options.alignment.vertical ? options.alignment.vertical : "bottom";
        }
        return $.extend(false, {}, ej.datavisualization.Diagram.TooltipDefaults, options);
    };
    ej.datavisualization.Diagram.BackgroundImageDefaults = {
        source: "",
        alignment: "xmidymid",
        scale: "meet"
    };
    ej.datavisualization.Diagram.BackgroundImage = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.BackgroundImageDefaults, options);
    };
    //#endregion
    //#region Path Util
    ej.datavisualization.Diagram.Path = function () {
        this._path = "";
    };
    ej.datavisualization.Diagram.Path.prototype = {
        moveTo: function (x, y) {
            this._path += "M" + x + "," + y; return this;
        },
        lineTo: function (x, y) {
            this._path += "L" + x + "," + y; return this;
        },
        cubicBezierTo: function (points, isSmooth) {
            if (isSmooth)
                this._path += "S";
            else
                this._path += "C";
            this._addPoints(points);
            return this;
        },
        quadraticBezierTo: function (points, isSmooth) {
            if (isSmooth)
                this._path += "T";
            else
                this._path += "Q";
            this._addPoints(points);
            return this;
        },
        ellipticalArcTo: function (rx, ry, xAngle, arcFlag, sweepFlag, x, y) {
            this._path += "A" + rx + "," + ry + " " + xAngle + " " + arcFlag + "," + sweepFlag + " " + x + "," + y;
            return this;
        },
        close: function () {
            this._path += "Z"; return this;
        },
        toString: function () {
            return this._path;
        },
        _addPoints: function (points) {
            var point;
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                this._path += point.x + ", " + point.y;
                if (i !== (points.length - 1))
                    this._path += " ";
            }
        }
    };
    //#endregion
    ej.datavisualization.Diagram.DecoratorDefaults = {
        shape: ej.datavisualization.Diagram.DecoratorShapes.Arrow,
        width: 8,
        height: 8,
        borderColor: "black",
        borderWidth: 1,
        fillColor: "black",
        pathData: "",
        cssClass: ""
    };
    ej.datavisualization.Diagram.Decorator = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.DecoratorDefaults, options);
    };
    //#endregion
    ej.datavisualization.Diagram.TextBlockDefaults = {
        readOnly: false,
        bold: false,
        italic: false,
        text: "",
        textDecoration: ej.datavisualization.Diagram.TextDecorations.None,
        fontSize: 12,
        fontFamily: "Arial",
        fontColor: "black",
        boundaryConstraints: true,
        segmentOffset: 0.5,
        offset: ej.datavisualization.Diagram.Point(0.5, 0.5),
        textAlign: ej.datavisualization.Diagram.TextAlign.Center,
        alignment: ej.datavisualization.Diagram.Alignment.Center,
        relativeMode: ej.datavisualization.Diagram.LabelRelativeMode.SegmentPath,
        horizontalAlignment: ej.datavisualization.Diagram.HorizontalAlignment.Center,
        verticalAlignment: ej.datavisualization.Diagram.VerticalAlignment.Center,
        wrapping: ej.datavisualization.Diagram.TextWrapping.WrapWithOverflow,
        margin: ej.datavisualization.Diagram.Margin(),
        padding: ej.datavisualization.Diagram.Padding(),
        textOverflow: false,
        overflowType: ej.datavisualization.Diagram.OverflowType.Ellipsis,
        mode: ej.datavisualization.Diagram.LabelEditMode.Edit,
        width: 50,
        rotateAngle: 0,
        opacity: 1,
        templateId: "",
        templateType: "html"
    };
    ej.datavisualization.Diagram.TextBlock = function (options) {
        options.offset = options.offset || {};
        options.offset = ej.datavisualization.Diagram.Point(options.offset.x !== undefined ? options.offset.x : 0.5, options.offset.y !== undefined ? options.offset.y : 0.5);
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        if (options.wrapText !== undefined) {
            if (options.wrapText) options.wrapping = "wrapwithoverflow";
            else options.wrapping = "nowrap";
        }
        return $.extend(false, {}, ej.datavisualization.Diagram.TextBlockDefaults, options);
    };
    ej.datavisualization.Diagram.LabelDefaults = $.extend(false, {}, ej.datavisualization.Diagram.TextBlockDefaults, {
        name: "",
        visible: true,
        borderColor: "transparent",
        borderWidth: 0,
        fillColor: "transparent",
        cssClass: "",
        hyperlink: "",
        dragLimit: ej.datavisualization.Diagram.DragLimit(),
        height: 0,
        constraints: ej.datavisualization.Diagram.LabelConstraints.None,
        _type: "label"
    });
    ej.datavisualization.Diagram.Label = function (options) {
        options.offset = options.offset || {};
        options.offset = ej.datavisualization.Diagram.Point(options.offset.x !== undefined ? options.offset.x : 0.5, options.offset.y !== undefined ? options.offset.y : 0.5);
        options.dragLimit = ej.datavisualization.Diagram.DragLimit(options.dragLimit);
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        options.padding = ej.datavisualization.Diagram.Margin(options.padding);
        var label = $.extend(false, {}, ej.datavisualization.Diagram.LabelDefaults, options);
        if (!label.name)
            label.name = "label_" + ej.datavisualization.Diagram.Util.randomId();
        return label;
    };
    //#endregion

    //#region serializationSettings
    ej.datavisualization.Diagram.serializationSettingsDefaults = {
        preventDefaultValues: false
    };
    ej.datavisualization.Diagram.serializationSettings = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.serializationSettingsDefaults, options);
    };
    //#endregion
    //#region ExportSettings
    ej.datavisualization.Diagram.ExportSettingsDefaults = {
        multiplePage: false,
        pageWidth: null,
        pageHeight: null,
        pageOrientation: "portrait",
        stretch: "none"
    };
    ej.datavisualization.Diagram.ExportSettings = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ExportSettingsDefaults, options);
    };
    //#endregion

    //#layer settings
    ej.datavisualization.Diagram.LayersDefaults = {
        name: "",
        visible: true,
        print: true,
        active: false,
        lock: false,
        snap: false,
        objects: []
    }
    ej.datavisualization.Diagram.Layers = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.LayersDefaults, options);
    }
    //#endregion
    //#region PrintSettings
    ej.datavisualization.Diagram.PrintSettingsDefaults = {
        multiplePage: false,
        pageWidth: null,
        pageHeight: null,
        pageOrientation: "portrait",
        margin: { left: 0, top: 0, right: 0, bottom: 0 },
        region: "pageSettings"
    };
    ej.datavisualization.Diagram.PrintSettings = function (options) {
        options = options || {};
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        return $.extend(false, {}, ej.datavisualization.Diagram.PrintSettingsDefaults, options);
    };
    //#endregion

    ej.datavisualization.Diagram.IconDefaults = {
        shape: ej.datavisualization.Diagram.IconShapes.None,
        width: 15,
        height: 15,
        offset: { x: 0.5, y: 1 },
        borderColor: "#1a1a1a",
        borderWidth: 1,
        margin: ej.datavisualization.Diagram.Margin(),
        horizontalAlignment: ej.datavisualization.Diagram.HorizontalAlignment.Center,
        verticalAlignment: ej.datavisualization.Diagram.VerticalAlignment.Center,
        cornerRadius: 0,
        fillColor: "white",
        source: "",
        pathData: "",
        templateId: "",
    };
    ej.datavisualization.Diagram.expandIcon = function (options) {
        options.offset = options.offset || {};
        options.offset = ej.datavisualization.Diagram.Point(options.offset.x !== undefined ? options.offset.x : 0.5, options.offset.y !== undefined ? options.offset.y : 1);
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        return $.extend(false, {}, ej.datavisualization.Diagram.IconDefaults, options);
    };
    ej.datavisualization.Diagram.collapseIcon = function (options) {
        options.offset = options.offset || {};
        options.offset = ej.datavisualization.Diagram.Point(options.offset.x !== undefined ? options.offset.x : 0.5, options.offset.y !== undefined ? options.offset.y : 1);
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        return $.extend(false, {}, ej.datavisualization.Diagram.IconDefaults, options);
    };
    //#region Port
    ej.datavisualization.Diagram.PortDefaults = {
        name: "",
        visibility: ej.datavisualization.Diagram.PortVisibility.Default,
        constraints: ej.datavisualization.Diagram.PortConstraints.Connect,
        size: 8,
        offset: ej.datavisualization.Diagram.Point(0, 0),
        borderColor: "#1a1a1a",
        borderWidth: 1,
        fillColor: "white",
        shape: ej.datavisualization.Diagram.PortShapes.Square,
        pathData: "",
        connectorPadding: 0,
        cssClass: "",
        margin: ej.datavisualization.Diagram.Margin(),
        parent: ""
    };
    //#region Shadow
    ej.datavisualization.Diagram.ShadowDefaults = {
        distance: 5,
        angle: 45,
        opacity: 0.7
    };
    ej.datavisualization.Diagram.Shadow = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ShadowDefaults, options);
    };
    ej.datavisualization.Diagram.Port = function (options) {
        options.offset = options.offset || {};
        options.offset = ej.datavisualization.Diagram.Point(options.offset.x ? options.offset.x : 0, options.offset.y ? options.offset.y : 0);
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        var port = $.extend(false, {}, ej.datavisualization.Diagram.PortDefaults, options);
        if (!port.name)
            port.name = "port_" + ej.datavisualization.Diagram.Util.randomId();
        return port;
    };
    //#endregion
    //#region Gradient
    ej.datavisualization.Diagram.StopDefaults = {
        color: "",
        offset: 0,
        opacity: 1
    };
    ej.datavisualization.Diagram.Stop = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.StopDefaults, options);
    };
    ej.datavisualization.Diagram.LinearGradientDefaults = {
        type: "linear",
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        stops: []
    };
    ej.datavisualization.Diagram.LinearGradient = function (options) {
        options.stops = options.stops ? options.stops.slice() : [];
        for (var i = 0; options.stops && i < options.stops.length; i++) {
            options.stops[i] = ej.datavisualization.Diagram.Stop(options.stops[i]);
        }
        return $.extend(false, {}, ej.datavisualization.Diagram.LinearGradientDefaults, options);
    };
    ej.datavisualization.Diagram.RadialGradientDefaults = {
        type: "radial",
        cx: 0,
        cy: 0,
        fx: 0,
        fy: 0,
        r: 50,
        stops: []
    };
    ej.datavisualization.Diagram.RadialGradient = function (options) {
        options.stops = options.stops ? options.stops.slice() : [];
        for (var i = 0; i < options.stops.length; i++) {
            options.stops[i] = ej.datavisualization.Diagram.Stop(options.stops[i]);
        }
        return $.extend(false, {}, ej.datavisualization.Diagram.RadialGradientDefaults, options);
    };
    //#region Node
    ej.datavisualization.Diagram.NodeBaseDefaults = {
        name: "",
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0,
        visible: true,
        zOrder: -1,
        excludeFromLayout: false,
        constraints: ej.datavisualization.Diagram.NodeConstraints.Default,
        parent: "",
        labels: [],
        expandIcon: {
            shape: ej.datavisualization.Diagram.IconShapes.None,
            width: 13,
            height: 10,
            margin: ej.datavisualization.Diagram.Margin(),
            offset: { x: 0.5, y: 1 },
            borderColor: "#1a1a1a",
            borderWidth: 1,
            cornerRadius: 0,
            fillColor: "black",
            pathData: "",
            templateId: "",
        },
        collapseIcon: {
            shape: ej.datavisualization.Diagram.IconShapes.None,
            width: 13,
            height: 10,
            margin: ej.datavisualization.Diagram.Margin(),
            offset: { x: 0.5, y: 1 },
            borderColor: "#1a1a1a",
            borderWidth: 1,
            cornerRadius: 0,
            fillColor: "black",
            pathData: "",
            templateId: "",
        },
        ports: [],
        inEdges: [],
        outEdges: [],
        rotateAngle: 0,
        pivot: ej.datavisualization.Diagram.Point(0.5, 0.5),
        addInfo: {},
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        horizontalAlign: ej.datavisualization.Diagram.HorizontalAlignment.Left,
        verticalAlign: ej.datavisualization.Diagram.VerticalAlignment.Top,
        minWidth: 0,
        maxWidth: 0,
        minHeight: 0,
        maxHeight: 0,
        connectorPadding: 0,
        cornerRadius: 0,
        paletteItem: null,
    };

    ej.datavisualization.Diagram.NodeBase = function (options) {
        var i;
        options.labels = options.labels ? options.labels.slice() : [];
        options.ports = options.ports ? options.ports.slice() : [];
        options.inEdges = options.inEdges ? options.inEdges.slice() : [];
        options.outEdges = options.outEdges ? options.outEdges.slice() : [];
        if (options.expandIcon)
            options.expandIcon = ej.datavisualization.Diagram.expandIcon(options.expandIcon ? options.expandIcon : {});
        if (options.collapseIcon)
            options.collapseIcon = ej.datavisualization.Diagram.collapseIcon(options.collapseIcon ? options.collapseIcon : {});
        if (options.labels)
            for (i = 0; i < options.labels.length; i++) {
                options.labels[i] = ej.datavisualization.Diagram.Label(options.labels[i]);
                if (ej.datavisualization.Diagram.Util.canMoveLabel(options)) {
                    options.labels[i].constraints = ej.datavisualization.Diagram.LabelConstraints.All
                    & ~ej.datavisualization.Diagram.LabelConstraints.Selectable
                }
                options.labels[i]._parent = options.name;
            }
        if (options.ports)
            for (i = 0; i < options.ports.length; i++) {
                options.ports[i].parent = options.name;
                options.ports[i] = ej.datavisualization.Diagram.Port(options.ports[i]);
            }
        options.paletteItem = ej.datavisualization.Diagram.PaletteItem(options.paletteItem ? options.paletteItem : {});
        return $.extend(false, {}, ej.datavisualization.Diagram.NodeBaseDefaults, options);
    };
    ej.datavisualization.Diagram.NodeDefaults = {
        fillColor: "white",
        borderColor: "black",
        borderWidth: 1,
        borderDashArray: "",
        opacity: 1,
        gradient: null,
        borderGradient: null,
        type: ej.datavisualization.Diagram.Shapes.Basic,
        isExpanded: true,
        shadow: ej.datavisualization.Diagram.Shadow(),
        cssClass: ""
    };
    ej.datavisualization.Diagram.Node = function (options) {
        options = options || {};
        options.pivot = options.pivot || {};
        options.pivot = ej.datavisualization.Diagram.Point(options.pivot.x !== undefined ? options.pivot.x : 0.5, options.pivot.y !== undefined ? options.pivot.y : 0.5);
        if (options.container && $.isEmptyObject(options.container)) {
            options.container = null;
        }
        if (options.linearGradient || options.radialGradient) options.gradient = options.linearGradient || options.radialGradient;
        if (options.gradient) {
            if (options.gradient.type === "linear") {
                options.gradient = ej.datavisualization.Diagram.LinearGradient(options.gradient);
            }
            else if (options.gradient.type === "radial") {
                options.gradient = ej.datavisualization.Diagram.RadialGradient(options.gradient);
            }
        }
        if (options.borderGradient) {
            if (options.borderGradient.type === "linear") {
                options.borderGradient = ej.datavisualization.Diagram.LinearGradient(options.borderGradient);
            }
            else if (options.borderGradient.type === "radial") {
                options.borderGradient = ej.datavisualization.Diagram.RadialGradient(options.borderGradient);
            }
        }
        if (options.shadow) {
            options.shadow = ej.datavisualization.Diagram.Shadow(options.shadow);
        }
        if (options.tooltip) {
            options.tooltip = ej.datavisualization.Diagram.Tooltip(options.tooltip);
        }
        if (options && !options.name) {
            options.name = "node_" + ej.datavisualization.Diagram.Util.randomId();
        }
        options.minWidth = options.minWidth ? options.minWidth : 0;
        options.minHeight = options.minHeight ? options.minHeight : 0;
        options.maxWidth = options.maxWidth ? options.maxWidth : 0;
        options.maxHeight = options.maxHeight ? options.maxHeight : 0;
        if (!options.width && !options._width) options._width = options.minWidth ? options.minWidth : options.maxWidth;
        if (!options.height && !options._height) options._height = options.minHeight ? options.minHeight : options.maxHeight;
        if (options._hidePorts)
            options.ports = [];
        return $.extend(false, {}, ej.datavisualization.Diagram.NodeDefaults, ej.datavisualization.Diagram.NodeBase(options), ej.datavisualization.Diagram.Shape(options));
    };
    //#endregion
    //#region Connector
    ej.datavisualization.Diagram.ConnectorDefaults = {
        name: "",
        visible: true,
        lineDashArray: "",
        targetDecorator:
            {
                shape: ej.datavisualization.Diagram.DecoratorShapes.Arrow,
                width: 8,
                height: 8,
                borderColor: "black",
                fillColor: "black",
                pathData: ""
            },
        sourceDecorator:
            {
                shape: ej.datavisualization.Diagram.DecoratorShapes.Arrow,
                width: 8,
                height: 8,
                borderColor: "black",
                fillColor: "black",
                pathData: ""
            },
        shape: undefined,
        segments: [ej.datavisualization.Diagram.Segment({ type: "straight" })],
        sourcePoint: ej.datavisualization.Diagram.Point(),
        targetPoint: ej.datavisualization.Diagram.Point(),
        lineColor: "black",
        lineWidth: 1,
        constraints: ej.datavisualization.Diagram.ConnectorConstraints.Default,
        opacity: 1,
        parent: "",
        labels: [],
        zOrder: -1,
        lineHitPadding: 10,
        addInfo: {},
        targetNode: null,
        targetPort: null,
        sourceNode: null,
        sourcePort: null,
        marginLeft: 0,
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        horizontalAlign: ej.datavisualization.Diagram.HorizontalAlignment.Left,
        verticalAlign: ej.datavisualization.Diagram.VerticalAlignment.Top,
        cornerRadius: 0,
        bridgeSpace: 10,
        sourcePadding: 0,
        targetPadding: 0,
        type: "connector",
        cssClass: "",
        _endPointHitPadding: ej.datavisualization.Diagram.EndPointHitPadding()
    };
    ej.datavisualization.Diagram.Connector = function (options) {
        options = options || {};
        options.labels = options.labels ? options.labels.slice() : [];
        options.segments = options.segments ? options.segments.slice() : [];
        options._endPointHitPadding = ej.datavisualization.Diagram.EndPointHitPadding(options.endPointHitPadding);
        options.sourcePoint = options.sourcePoint || {};
        options.sourcePoint = ej.datavisualization.Diagram.Point(options.sourcePoint.x !== undefined ? options.sourcePoint.x : 0.5, options.sourcePoint.y !== undefined ? options.sourcePoint.y : 0.5);
        options.targetPoint = options.targetPoint || {};
        options.targetPoint = ej.datavisualization.Diagram.Point(options.targetPoint.x !== undefined ? options.targetPoint.x : 0.5, options.targetPoint.y !== undefined ? options.targetPoint.y : 0.5);
        options.name = options.name ? options.name : ej.datavisualization.Diagram.Util.randomId();
        options.targetDecorator = ej.datavisualization.Diagram.Decorator(options.targetDecorator || {});
        options.sourceDecorator = ej.datavisualization.Diagram.Decorator((options.sourceDecorator && !$.isEmptyObject(options.sourceDecorator)) ? options.sourceDecorator : { shape: ej.datavisualization.Diagram.DecoratorShapes.None });
        options.segments = options.segments || [ej.datavisualization.Diagram.Segment({ type: "straight" })];
        options._srcDecoratorSize = Math.max(parseInt(options.sourceDecorator.height), parseInt(options.sourceDecorator.width)) + 5 * options.sourceDecorator.borderWidth;
        options._tarDecoratorSize = Math.max(parseInt(options.targetDecorator.height), parseInt(options.targetDecorator.width)) + 5 * options.targetDecorator.borderWidth;
        options._inlineDecorators = [];
        if (options.segments) {
            options.sourcePoint = options.sourcePoint || ej.datavisualization.Diagram.Point();
            options.targetPoint = options.targetPoint || ej.datavisualization.Diagram.Point();
            ej.datavisualization.Diagram.Util._initializeSegments(options, options.defaultType);
        }
        if (options.labels)
            for (var i = 0; i < options.labels.length; i++) {
                options.labels[i] = ej.datavisualization.Diagram.Label(options.labels[i]);
                if (ej.datavisualization.Diagram.Util.canMoveLabel(options)) {
                    options.labels[i].constraints = ej.datavisualization.Diagram.LabelConstraints.All
                    & ~ej.datavisualization.Diagram.LabelConstraints.Selectable
                }
                options.labels[i]._parent = options.name;
            }
        if (options.tooltip) {
            options.tooltip = ej.datavisualization.Diagram.Tooltip(options.tooltip);
        }
        options.paletteItem = ej.datavisualization.Diagram.PaletteItem(options.paletteItem ? options.paletteItem : {});
        return $.extend(false, {}, ej.datavisualization.Diagram.ConnectorDefaults, options);
    };
    //#endregion
    //#region Container
    ej.datavisualization.Diagram.ContainerDefaults = {
        type: ej.datavisualization.Diagram.ContainerType.Canvas,
        orientation: "vertical",
    };
    ej.datavisualization.Diagram.Container = function (options) {
        return $.extend(false, {}, ej.datavisualization.Diagram.ContainerDefaults, options);
    };
    // #endregion
    //#region Group
    ej.datavisualization.Diagram.GroupDefaults = {
        children: [],
        canUngroup: true,
        allowDrop: true,
        container: null,
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        minWidth: 100,
        maxWidth: Number.POSITIVE_INFINITY,
        minHeight: 100,
        maxHeight: Number.POSITIVE_INFINITY,
        type: "group"
    };
    ej.datavisualization.Diagram.Group = function (options) {
        options = options ? options : {};
        options.children = options.children ? options.children.slice() : [];
        if (options.type == "bpmn") options = ej.datavisualization.Diagram.Node(options);
        options.minWidth = options.minWidth ? options.minWidth : 100;
        options.minHeight = options.minHeight ? options.minHeight : 100;
        options.maxWidth = options.maxWidth ? options.maxWidth : Number.POSITIVE_INFINITY;
        options.maxHeight = options.maxHeight ? options.maxHeight : Number.POSITIVE_INFINITY;
        options.container = options.container ? ej.datavisualization.Diagram.Container(options.container) : null;
        options.fillColor = options.fillColor ? options.fillColor : "transparent";
        options.borderColor = options.borderColor ? options.borderColor : "transparent";
        options = options || {};
        if (options.container && $.isEmptyObject(options.container)) {
            options.container = null;
        }
        if (options && !options.name) {
            options.name = "group_" + ej.datavisualization.Diagram.Util.randomId();
        }
        if (options.tooltip) {
            options.tooltip = ej.datavisualization.Diagram.Tooltip(options.tooltip);
        }
        if (options.type === "pseudoGroup") {
            options.minWidth = 0;
            options.minHeight = 0;
            options.maxHeight = 0;
            options.maxWidth = 0;
        }
        if (!options._type && !(options.type == "umlclassifier")) options._type = options.type ? options.type : "group";
        return $.extend(true, {}, ej.datavisualization.Diagram.NodeDefaults, ej.datavisualization.Diagram.GroupDefaults, ej.datavisualization.Diagram.NodeBase(options));
    };
    //#endregion
    //#region ZoomCommand
    ej.datavisualization.Diagram.ZoomCommand = {
        ZoomIn: 1,
        ZoomOut: 2
    };
    ej.datavisualization.Diagram.Zoom = function (options) {
        return $.extend(true, {}, { zoomFactor: 0.2, focusPoint: null, zoomCommand: ej.datavisualization.Diagram.ZoomCommand.ZoomIn }, options);
    };
    //#endregion
    ej.datavisualization.Diagram.DragState = {
        Starting: "starting",
        Dragging: "dragging",
        Completed: "completed"
    };
    ej.datavisualization.Diagram.ResizeState = {
        Starting: "starting",
        Resizing: "resizing",
        Completed: "completed"
    };
    ej.datavisualization.Diagram.DiagramConstraints = {
        None: 1 << 0,
        UserInteraction: 1 << 1,
        APIUpdate: 1 << 2,
        PageEditable: 1 << 1 | 1 << 2,
        Bridging: 1 << 3,
        Zoomable: 1 << 4,
        PannableX: 1 << 5,
        PannableY: 1 << 6,
        Pannable: 1 << 5 | 1 << 6,
        Undoable: 1 << 7,
        Resizable: 1 << 8,
        ZoomTextEditor: 1 << 9,
        FloatElements: 1 << 10,
        CrispEdges: 1 << 11,
        Routing: 1 << 12,
        Default: 1 << 1 | 1 << 2 | 1 << 4 | 1 << 5 | 1 << 6 | 1 << 7 | 1 << 8
    };
    ej.datavisualization.Diagram.BridgeDirection = {
        Top: "top",
        Bottom: "bottom",
        Left: "left",
        Right: "right"
    };
    ej.datavisualization.Diagram.Tool = {
        None: 1 << 0,
        SingleSelect: 1 << 1,
        MultipleSelect: 1 << 2,
        ZoomPan: 1 << 3,
        DrawOnce: 1 << 4,
        ContinuesDraw: 1 << 5
    };
    ej.datavisualization.Diagram.Region = {
        Content: "content",
        PageSettings: "pageSettings"
    };
    ej.datavisualization.Diagram.FileFormats = {
        JPG: "jpg",
        PNG: "png",
        BMP: "bmp",
        SVG: "svg"
    };
    ej.datavisualization.Diagram.ExportModes = {
        Download: "download",
        Data: "data"
    };
    ej.datavisualization.Diagram.FitMode = {
        Page: "page",
        Width: "width",
        Height: "height"
    };
    ej.datavisualization.Diagram.Stretch = {
        None: "none",
        Fill: "fill",
        Uniform: "uniform",
        UniformToFill: "uniformtofill"
    };
    ej.datavisualization.Diagram.shapeType = {
        Image: "image",
        Path: "path",
        Native: "native"
    };

    //#endregion
    //#region UserHandle
    ej.datavisualization.Diagram.UserHandleDefaults = {
        name: "",
        pathData: "",
        templateId: "",
        source: "",
        shape: ej.datavisualization.Diagram.shapeType.Path,
        borderColor: "",
        backgroundColor: "#2382c3",
        position: "",
        offset: ej.datavisualization.Diagram.Point(0.5, 1),
        margin: { left: 0, right: 0, top: 0, bottom: -25 },
        horizontalAlignment: ej.datavisualization.Diagram.HorizontalAlignment.Center,
        verticalAlignment: ej.datavisualization.Diagram.VerticalAlignment.Center,
        pathColor: "white",
        tool: "",
        size: 20,
        visible: true,
        enableMultiSelection: false
    };
    ej.datavisualization.Diagram.UserHandle = function (options) {
        return $.extend(true, {}, ej.datavisualization.Diagram.UserHandleDefaults, options);
    };
    //#endregion
    //#region Swimlane
    ej.datavisualization.Diagram.SwimLaneDefaults = {
        header: $.extend(true, {}, ej.datavisualization.Diagram.LabelDefaults, {
            text: "Title",
            borderColor: "black",
            fillColor: "#C7D4DF",
            horizontalAlignment: ej.datavisualization.Diagram.HorizontalAlignment.Stretch,
            verticalAlignment: ej.datavisualization.Diagram.VerticalAlignment.Stretch,
            width: 50,
            height: 50
        }),
        fillColor: "transparent",
        orientation: "vertical",
        type: "group",
        isSwimlane: true,
        offsetX: 100,
        offsetY: 100,
        minHeight: 100,
        maxHeight: Number.POSITIVE_INFINITY,
        minWidth: 100,
        maxWidth: Number.POSITIVE_INFINITY,
        height: 100,
        width: 100,
        lanes: [],
        phases: [],
        phaseSize: 20,
        constraints: ej.datavisualization.Diagram.NodeConstraints.Default | ej.datavisualization.Diagram.NodeConstraints.AllowDrop & ~(ej.datavisualization.Diagram.NodeConstraints.ResizeNorth |
                      ej.datavisualization.Diagram.NodeConstraints.ResizeWest | ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest |
                  ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast | ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest),
        addInfo: {},
        cssClass: ""
    };
    ej.datavisualization.Diagram.SwimLane = function (options) {
        options = options || {};
        options.lanes = options.lanes ? options.lanes.slice() : [];
        options.phases = options.phases ? options.phases.slice() : [];
        if (options && !options.name) {
            options.name = "swimlane_" + ej.datavisualization.Diagram.Util.randomId();
        }
        if (options.tooltip) {
            options.tooltip = ej.datavisualization.Diagram.Tooltip(options.tooltip);
        }
        if (!options.header)
            options.header = {};
        options.header.height = options.header.height != undefined ? options.header.height : 50;
        options.header.width = options.header.width != undefined ? options.header.width : 50;

        return $.extend(true, {}, ej.datavisualization.Diagram.SwimLaneDefaults, options);
    };
    //#endregion  
    //#region Lane
    ej.datavisualization.Diagram.LaneDefaults = {
        header: $.extend(true, {}, ej.datavisualization.Diagram.LabelDefaults, {
            text: "Function",
            borderColor: "black",
            fillColor: "#C7D4DF",
            horizontalAlignment: ej.datavisualization.Diagram.HorizontalAlignment.Stretch,
            verticalAlignment: ej.datavisualization.Diagram.VerticalAlignment.Stretch,
            width: 50,
            height: 50
        }),
        name: "",
        children: [],
        isLane: true,
        orientation: "horizontal",
        fillColor: "#f5f5f5",
        labels: [],
        addInfo: {},
        minHeight: 100,
        minWidth: 100,
        maxHeight: Number.POSITIVE_INFINITY,
        maxWidth: Number.POSITIVE_INFINITY,
        constraints: ej.datavisualization.Diagram.NodeConstraints.Default | ej.datavisualization.Diagram.NodeConstraints.AllowDrop & ~ej.datavisualization.Diagram.NodeConstraints.Connect,
        cssClass: ""
    };
    ej.datavisualization.Diagram.Lane = function (options) {
        options = options || {};
        options.labels = options.labels ? options.labels.slice() : [];
        options.children = options.children ? options.children.slice() : [];
        if (options && !options.name) {
            options.name = "lane_" + ej.datavisualization.Diagram.Util.randomId();
        }
        if (options.tooltip) {
            options.tooltip = ej.datavisualization.Diagram.Tooltip(options.tooltip);
        }
        return $.extend(true, {}, ej.datavisualization.Diagram.LaneDefaults, options);
    };
    //#endregion  
    //#region phase
    ej.datavisualization.Diagram.PhaseDefaults = {
        name: "",
        type: "phase",
        offset: 100,
        lineWidth: 1,
        lineDashArray: "3,3",
        lineColor: "#606060",
        parent: "",
        fillColor: "white",
        orientation: "horizontal",
        label: { text: "Phase" }
    };
    ej.datavisualization.Diagram.Phase = function (options) {
        if (options.label) {
            options.label = ej.datavisualization.Diagram.Label(options.label);
            if (!options._UndoRedo && !options._isUndo)
                options.label.text = options.label.text ? options.label.text : "Phase"
        }
        return $.extend(true, {}, ej.datavisualization.Diagram.PhaseDefaults, options);
    };
    //#endregion 
    //#region paletteItem
    ej.datavisualization.Diagram.PaletteItemDefaults = {
        width: undefined,
        height: undefined,
        enableScale: true,
        previewHeight: undefined,
        previewWidth: undefined,
        wrapping: ej.datavisualization.Diagram.TextWrapping.NoWrap,
        label: null,
        margin: ej.datavisualization.Diagram.Margin({ left: 4, right: 4, top: 4, bottom: 4 })
    };
    ej.datavisualization.Diagram.PaletteItem = function (options) {
        options.margin = options.margin || {};
        options.margin.left = options.margin.left !== undefined ? options.margin.left : 4;
        options.margin.right = options.margin.right !== undefined ? options.margin.right : 4;
        options.margin.top = options.margin.top !== undefined ? options.margin.top : 4;
        options.margin.bottom = options.margin.bottom !== undefined ? options.margin.bottom : 4;
        options.margin = ej.datavisualization.Diagram.Margin(options.margin);
        return $.extend(false, {}, ej.datavisualization.Diagram.PaletteItemDefaults, options);
    };
    //#endregion 
    ej.datavisualization.Diagram.SwimLaneHelper = {
        //#region diagram
        _initSwimLane: function (obj, diagram, headAdded) {
            var canvas = null;
            var lanes = null;
            var obj = ej.datavisualization.Diagram.SwimLane(obj);
            obj.orientation = obj.orientation ? obj.orientation : "vertical";
            var phases = this._initphases(obj, diagram);
            lanes = this._initLanes(obj, diagram, headAdded);
            var childern = [];
            var header = null;
            if (!obj.header) {
                obj.header = { text: "", height: 0, fillColor: "white" };
            }
            if (obj.orientation === "horizontal") {
                var height = obj.header.height;
            } else {
                var width = obj.header.width;
            }
            if (obj.header) {
                header = ej.datavisualization.Diagram.Node({
                    _type: "node",
                    _isHeader: true,
                    name: obj.name + "_header_swimlane",
                    labels: [obj.header],
                    height: height ? height : 50,
                    width: width ? width : 50,
                    fillColor: obj.header.fillColor ? obj.header.fillColor : "white",
                    rotateAngle: 0,
                    constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
                    horizontalAlign: "stretch",
                    parent: obj.name,
                });
            }
            if (header) {
                diagram.nodes().push(header);
                diagram._nodes = $.extend(true, [], diagram.nodes());
                diagram.nameTable[header.name] = header;
                childern.push(header.name);
            }
            //var phaseNode = this._initPhaseNode(obj, diagram, childern);
            var seprtrValue = null;
            if (obj.phaseSize == 0)
                var seprtrValue = 0.001;
            else
                var seprtrValue = obj.phaseSize ? obj.phaseSize : 20;
            var PhaseStack = this._initPhaseStack(obj, diagram, childern, seprtrValue);
            var hAlign = null, vAlign = null;
            if (obj.orientation == "vertical")
                vAlign = "stretch";
            else
                hAlign = "stretch";
            var orientation, marginLeft = 0, marginTop = 0, minHeight = 0;
            if (obj.orientation == "horizontal") {
                orientation = "vertical";
                marginTop = (obj.header ? obj.header.height : 50) + seprtrValue;
                minHeight = 0;
            }
            else {
                orientation = "horizontal";
                marginTop = (obj.header ? obj.header.height : 50);
                marginLeft = (obj.phaseSize ? obj.phaseSize : seprtrValue);
                minHeight = (obj.header ? obj.header.height : 50) + seprtrValue;
            }
            var stack = ej.datavisualization.Diagram.Group({
                name: obj.name + "_stack",
                children: lanes,
                parent: obj.name,
                container: { type: ej.datavisualization.Diagram.ContainerType.Stack, orientation: orientation },
                horizontalAlign: "stretch",
                verticalAlign: "stretch",
                marginTop: marginTop,
                width: 10,
                height: 10,
                marginLeft: marginLeft,
                minHeight: minHeight,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default & ~
                    (ej.datavisualization.Diagram.NodeConstraints.Select | ej.datavisualization.Diagram.NodeConstraints.Connect),
            });
            var cW = 0, cH = 0;
            if (obj.orientation == "horizontal") {
                cW = obj.width;
                cH = 100;
            }
            else if (obj.orientation == "vertical") {
                cW = 100;
                cH = obj.height - header.height;
            }
            diagram.nodes().push(stack);
            diagram._nodes = $.extend(true, [], diagram.nodes());
            diagram.nameTable[stack.name] = stack;
            childern.push(stack.name);
            canvas = ej.datavisualization.Diagram.Group({
                name: obj.name ? obj.name : "",
                type: "group",
                addInfo: obj.addInfo ? obj.addInfo : {},
                parent: "",
                offsetX: obj.offsetX ? obj.offsetX : 100,
                offsetY: obj.offsetY ? obj.offsetY : 100,
                children: childern,
                zOrder: (obj.zOrder || obj.zOrder === 0) ? obj.zOrder : -1,
                fillColor: "transparent",
                labels: [{ mode: ej.datavisualization.Diagram.LabelEditMode.View }],
                container: { type: ej.datavisualization.Diagram.ContainerType.Canvas, },
                minHeight: cH ? cH : 100,
                maxHeight: obj.maxHeight ? obj.maxHeight : Number.POSITIVE_INFINITY,
                minWidth: cW ? cW : 100,
                maxWidth: obj.maxWidth ? obj.maxWidth : Number.POSITIVE_INFINITY,
                constraints: obj.constraints ? obj.constraints | ej.datavisualization.Diagram.NodeConstraints.AllowDrop : (ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.AllowDrop ^ ej.datavisualization.Diagram.NodeConstraints.ResizeNorth ^
                        ej.datavisualization.Diagram.NodeConstraints.ResizeWest ^ ej.datavisualization.Diagram.NodeConstraints.ResizeNorthWest ^
                    ej.datavisualization.Diagram.NodeConstraints.ResizeNorthEast ^ ej.datavisualization.Diagram.NodeConstraints.ResizeSouthWest),
                phaseSize: seprtrValue,
                cssClass: obj.cssClass
            });
            //diagram._setZorder(canvas);
            canvas.isSwimlane = true;
            //this.nodes().push(canvas);
            canvas.phases = phases;
            canvas.orientation = obj.orientation;
            if (canvas.orientation == "horizontal")
                canvas.constraints = canvas.constraints ^ ej.datavisualization.Diagram.NodeConstraints.ResizeEast ^ ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast;
            else
                canvas.constraints = canvas.constraints ^ ej.datavisualization.Diagram.NodeConstraints.ResizeSouth ^ ej.datavisualization.Diagram.NodeConstraints.ResizeSouthEast;
            return canvas;
        },
        _initPhaseStack: function (obj, diagram, children, seprtrValue) {
            var orientation = "horizontal", horizontalAlign = "left", verticalAlign = "top", isHoizon;
            if (orientation) {
                if (obj.orientation == "horizontal") {
                    orientation = "horizontal";
                    horizontalAlign = "stretch";
                    isHoizon = true;
                }
                else {
                    orientation = "vertical";
                    verticalAlign = "stretch";
                    isHoizon = false;
                }
            }
            var phaseStack = ej.datavisualization.Diagram.Group({
                name: obj.name + "phaseStack",
                container: { type: "stack", orientation: orientation },
                type: "group",
                parent: obj.name,
                offsetX: 0,
                offsetY: 0,
                minHeight: seprtrValue,
                maxHeight: seprtrValue,
                minWidth: seprtrValue,
                maxWidth: seprtrValue,
                marginTop: obj.header ? obj.header.height : 50,
                isPhaseStack: true,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect
                //horizontalAlign: horizontalAlign,
                //verticalAlign: verticalAlign,
            });
            var df = 0;
            var rotateAngle = 0;
            if (obj.phaseSize) {
                obj.phaseSize = obj.phaseSize < 1 ? 20 : obj.phaseSize;
            }
            var height, width;
            for (var i = 0; i < obj.phases.length; i++) {
                if (isHoizon) {
                    height = obj.phaseSize ? obj.phaseSize : 20;
                    width = obj.phases[i].offset - df;
                }
                else {
                    height = obj.phases[i].offset - df;
                    if (i == 0)
                        height = height - (obj.header ? obj.header.height : 50);//added swimlane header height
                    width = obj.phaseSize ? obj.phaseSize : 20;
                    if (obj.phases[i].label)
                        obj.phases[i].label.rotateAngle = 270;
                }
                var node = ej.datavisualization.Diagram.Node({
                    parent: obj.name + "phaseStack",
                    _isHeader: true,
                    name: "phaseStack" + obj.phases[i].name,
                    height: height, width: width,
                    labels: [obj.phases[i].label],
                    constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect
                });
                node.labels[0].name = "phaseStack" + obj.phases[i].name + "label",
                node.labels[0].mode = ej.datavisualization.Diagram.LabelEditMode.View,
                node.isPhase = true;
                df = obj.phases[i].offset;
                diagram.nameTable[node.name] = node;
                phaseStack.children.push(node.name);
                diagram.nodes().push(node);
                diagram._nodes = $.extend(true, [], diagram.nodes());
            }
            diagram.nodes().push(phaseStack);
            diagram._nodes = $.extend(true, [], diagram.nodes());
            children.push(phaseStack);
            diagram.nameTable[phaseStack.name] = phaseStack;
        },

        _setDefaultLaneProperties: function (obj) {
            obj.lanes = obj.lanes ? obj.lanes : [];
            obj.lanes.push(ej.datavisualization.Diagram.Lane({}))
        },

        _initLanes: function (obj, diagram, headAdded) {
            var lanes = [], lane = null;
            if (!obj.lanes || obj.lanes.length === 0) {
                this._setDefaultLaneProperties(obj);
            }
            if (obj.lanes) {
                for (var i = 0; i < obj.lanes.length; i++) {
                    if (jQuery.isEmptyObject(obj.lanes[i])) {
                        obj.lanes[i] = ej.datavisualization.Diagram.Lane();
                    }
                    obj.lanes[i]._laneHeader = obj.lanes[i]._laneHeader ? obj.lanes[i]._laneHeader : obj.lanes[i].header
                    lane = this._initLane(obj.lanes[i], obj, diagram, headAdded);
                    lanes.push(lane.name);
                    diagram.nodes().push(lane);
                    diagram._nodes = $.extend(true, [], diagram.nodes());
                    diagram.nameTable[lane.name] = lane;
                }
            }
            return lanes;
        },
        _initLane: function (laneobj, obj, diagram, headAdded) {
            var hAlign = null, vAlign = null;
            if (obj.orientation == "horizontal")
                hAlign = "stretch";
            else vAlign = "stretch";
            var success = false;
            var lane = ej.datavisualization.Diagram.Group({
                name: laneobj.name,
                addInfo: laneobj.addInfo ? laneobj.addInfo : {},
                type: "group",
                isLane: true,
                parent: obj.name + "_stack",
                offsetX: 0,
                offsetY: 0,
                borderColor: laneobj.borderColor ? laneobj.borderColor : "black",
                orientation: obj.orientation ? obj.orientation : "horizontal",
                fillColor: laneobj.fillColor,
                container: { type: ej.datavisualization.Diagram.ContainerType.Canvas, },
                horizontalAlign: hAlign ? hAlign : "left",
                verticalAlign: vAlign ? vAlign : "top",
                minHeight: laneobj.height ? laneobj.height : 100,
                maxHeight: laneobj.maxHeight ? laneobj.maxHeight : Number.POSITIVE_INFINITY,
                minWidth: laneobj.width ? laneobj.width : 100,
                maxWidth: laneobj.maxWidth ? laneobj.maxWidth : Number.POSITIVE_INFINITY,
                paddingTop: 20,
                paddingRight: 20,
                paddingBottom: 20,
                paddingLeft: 20,
                constraints: laneobj.constraints ? laneobj.constraints | ej.datavisualization.Diagram.NodeConstraints.AllowDrop : (ej.datavisualization.Diagram.NodeConstraints.Default | ej.datavisualization.Diagram.NodeConstraints.AllowDrop & ~ej.datavisualization.Diagram.NodeConstraints.Connect),
                cssClass: laneobj.cssClass
            });
            if (laneobj.labels && laneobj.labels.length > 0) {
                for (var h = 0; h < laneobj.labels.length; h++) {
                    laneobj.labels[h] = ej.datavisualization.Diagram.Label(laneobj.labels[h]);
                }
                lane.labels = laneobj.labels;
            }
            if (!headAdded) {
                var laneHeader = laneobj._laneHeader ? laneobj._laneHeader : null;
                var header = this._iniLaneHeader(laneobj, lane.name, obj, diagram, laneHeader);
                if (header) {
                    diagram.nodes().push(header);
                    diagram._nodes = $.extend(true, [], diagram.nodes());
                    diagram.nameTable[header.name] = header;
                    lane.children.push(header.name);
                }
            }
            var laneChildren;
            laneChildren = this._initChildren(laneobj, lane.name, diagram);
            for (var i = 0; i < laneChildren.length; i++) {
                lane.children.push(laneChildren[i]);
            }

            return lane;
        },
        _iniLaneHeader: function (headObj, parentName, obj, diagram, laneHeader) {
            var node = null;
            if (headObj.header) {
                node = ej.datavisualization.Diagram.Node({
                    _isHeader: true,
                    name: parentName + "_Headerr_",
                    type: "node",
                    labels: [obj.header],
                    height: laneHeader.height ? laneHeader.height : 50,
                    width: laneHeader.width ? laneHeader.width : 50,
                    fillColor: headObj.header.fillColor ? headObj.header.fillColor : "white",
                    rotateAngle: 0,
                    constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
                    marginLeft: -20,
                    marginTop: -20,
                    marginRight: -20,
                    marginBottom: -20,
                    parent: parentName,
                });
                if (obj.orientation && obj.orientation == "horizontal") {
                    node.verticalAlign = "stretch";
                    node.height = 1;
                    node.width = laneHeader.width ? laneHeader.width : 50;
                }
                else if (obj.orientation && obj.orientation == "vertical") {
                    node.horizontalAlign = "stretch";
                    node.labels[0].rotateAngle = 0;
                    node.height = laneHeader.width ? laneHeader.width : 50;
                    node.width = 1;
                }
            }
            return node;
        },
        _initChildren: function (laneObj, parentName, diagram) {
            var children = [], child = null;
            if (laneObj.children) {
                for (var i = 0; i < laneObj.children.length; i++) {
                    if (typeof laneObj.children[i] == "object") {
                        if (laneObj.type && laneObj.type === "bpmn")
                            child = laneObj.children[i]
                        else
                            child = this._initChild(laneObj.children[i], parentName, diagram);
                    }
                    else
                        child = diagram.nameTable[diagram._getChild(laneObj.children[i])];
                    if (child) {
                        if (!child.segments) {
                            if (child.children)
                                var childNodes = this._initChildren(child, child.name, diagram);
                            if (childNodes) child.children = childNodes;
                            diagram.nodes().push(child);
                            diagram._nodes = $.extend(true, [], diagram.nodes());
                        }
                        else {
                            diagram.connectors().push(child);
                            diagram._connectors = $.extend(true, [], diagram.connectors());
                        }
                        children.push(child.name);
                        diagram.nameTable[child.name] = child;
                    }
                }
            }
            return children;
        },
        _initChild: function (child, parentName, diagram) {
            var node = null;
            if (child && child.children && child.children.length > 0) {
                node = diagram._getNewGroup(ej.datavisualization.Diagram.NodeType(child, diagram))
            }
            else
                node = diagram._getNewNode(ej.datavisualization.Diagram.NodeType(child, diagram));
            node.parent = parentName;
            return node;
        },
        _swapPhaseSize: function (obj) {
            if (obj.phases.length > 0) {
                var phases = obj.phases, i, j, temp;
                for (i = 0; i < phases.length; i++) {
                    for (j = 0; j < (phases.length - i - 1) ; j++) {
                        if (phases[j].offset > phases[j + 1].offset) {
                            temp = phases[j];
                            phases[j] = phases[j + 1];
                            phases[j + 1] = temp;
                        }
                    }
                }
            }
        },
        _setSwimlaneSize: function (obj) {
            if (obj.phases.length > 0) {
                var phase;
                for (var i in obj.phases) {
                    phase = obj.phases[i];
                    if (obj.orientation === "horizontal") {
                        if (phase.offset > obj.width)
                            obj.width = phase.offset;
                    }
                    else {
                        if (phase.offset > obj.height)
                            obj.height = phase.offset;
                    }
                }
            }
        },
        _setLastPhaseSize: function (obj) {
            if (obj.phases.length > 0) {
                var lastPhase = obj.phases[obj.phases.length - 1];
                if (obj.orientation === "horizontal")
                    lastPhase.offset = obj.width;
                else
                    lastPhase.offset = obj.height;
            }
        },
        _NeedDefaultPhase: function (obj, offset) {
            if (obj.phases.length > 0)
                return false;
            return true;
        },
        _checkForDefPhase: function (obj) {
            if (obj.phases.length > 0)
                return false;
            return true;
        },
        _initphases: function (obj, diagram) {
            var phases = [];
            var phase = null, angle = 0;
            //if (!diagram.model.phases)
            //    diagram.model.phases = [];
            var offset = 0;

            if (obj.orientation === "vertical") {
                offset = obj.height;
                angle = 270;
            }
            else {
                offset = obj.width;
            }
            var defPhase = ej.datavisualization.Diagram.Phase({ name: obj.name + "defPhase", offset: offset, label: obj._lastPhase ? obj._lastPhase.labels[0] : { text: "Phase", rotateAngle: angle } });
            if (this._NeedDefaultPhase(obj))
                obj.phases.push(defPhase);
            else {
                this._swapPhaseSize(obj);
                this._setSwimlaneSize(obj);
                this._setLastPhaseSize(obj);
            }
            if (obj.phases && obj.phases.length > 0) {
                for (var i = 0; i < obj.phases.length; i++) {
                    phase = ej.datavisualization.Diagram.Phase(obj.phases[i]);
                    phase.parent = obj.name;
                    phase.orientation = obj.orientation;
                    //diagram.model.phases.push(phase);
                    diagram.nameTable[phase.name] = phase;
                    phases.push(phase.name);
                }
            }
            return phases;
        },
        //#endregion
        //#region palette
        _createSwimlane: function (obj, diagram, data, fromObject, header) {
            var children = [], child = null, headAdded = false;
            var nameTable = data ? data.childTable : diagram.nameTable;
            var height = 500, width = 500;
            var headNode = null;
            var constraints = obj.constraints ? obj.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            if (obj.children[0]) {
                var node = fromObject ? obj.children[0] : nameTable[diagram._getChild(obj.children[0])];
                if (!node)
                    node = header;
                if (typeof (node) === "string")
                    node = nameTable[node];
                headNode = { text: "Title", width: 50, fillColor: node.fillColor ? node.fillColor : obj.fillColor, height: 50 };

            } else headNode = { text: "Title", width: 50, fillColor: "white", height: 50 };

            if (!obj.orientation) {
                if (obj.container)
                    obj.orientation = obj.container.orientation;
            }
            var swlnHeight = 0;
            if (obj.orientation == "horizontal" && diagram._selectedSymbol) {
                height = obj.height ? obj.height : 100;
                width = obj.width ? obj.width : 650;
                swlnHeight = height;
            } else {
                height = obj.height ? obj.height : 650;
                width = obj.width ? obj.width : 100;
                swlnHeight = obj.height + headNode.height
            }
            if (obj.children.length > 1) {
                obj.children.splice(0, 1);
                children = obj.children;
            }

            var nSwimLane = {
                name: obj.name + ej.datavisualization.Diagram.Util.randomId(),
                header: headNode,
                fillColor: "white",
                isSwimlane: true,
                minWidth: width,
                minHeight: height,
                height: swlnHeight + 1,
                width: width + 1,
                maxHeight: height + Number.POSITIVE_INFINITY,
                maxWidth: width + Number.POSITIVE_INFINITY,
                offsetX: obj.offsetX,
                offsetY: obj.offsetY,
                orientation: obj.orientation ? obj.orientation : "horizontal",
                addInfo: obj.addInfo ? obj.addInfo : null,
                paletteItem: obj.paletteItem ? obj.paletteItem : null,
                lanes: [
                    {
                        name: obj.name,
                        addInfo: obj.addInfo ? obj.addInfo : {},
                        constraints: constraints,
                        header: {
                            text: (node.labels[0].text || node.labels[0].text === "") ? node.labels[0].text : "HEADER",
                            fontSize: node.labels[0].fontSize ? node.labels[0].fontSize : 11,
                            width: node.width ? node.width : 50,
                            height: node.height ? node.height : 50,
                            fillColor: node.fillColor,
                            bold: node.labels[0].bold ? true : false,
                            italic: node.labels[0].italic ? true : false,
                            fontFamily: node.labels[0].fontFamily ? node.labels[0].fontFamily : "Arial",
                            fontColor: node.labels[0].fontColor ? node.labels[0].fontColor : "black",
                        },
                        fillColor: obj.fillColor ? obj.fillColor : "white",
                        height: height,
                        width: width,
                        minHeight: height,
                        minWidth: width,
                        children: children ? children : [],
                        _laneHeader: obj._laneHeader ? obj._laneHeader : null
                    },
                ]
            };
            //var item = this._initSwimLane(ej.datavisualization.Diagram.SwimLane(nSwimLane), diagram, headAdded);
            var item = ej.datavisualization.Diagram.ContainerHelper._initContainer(diagram, nSwimLane);
            return item;
        },
        _createDiagramLane: function (obj, nameTable) {
            var objLane = obj._lane ? obj._lane : null;
            var orientation = obj.orientation;
            var constraints = obj.constraints ? obj.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            var lane = {
                children: [
                    {
                        name: obj.name + "_Headerr_",
                        height: objLane.header ? objLane.header.height : 50,
                        width: objLane.header ? objLane.header.width : 50,
                        fillColor: objLane.header ? objLane.header.fillColor : 50,
                        labels: objLane.header ? [objLane.header] : [],
                        horizontalAlign: orientation === "vertical" ? "stretch" : "left",
                        verticalAlign: orientation === "vertical" ? "top" : "stretch",
                    }
                ],
                container: { type: "canvas" },
                name: obj.name ? obj.name : ej.datavisualization.Diagram.Util.randomId(),
                minHeight: objLane.minHeight ? objLane.minHeight : 100,
                minWidth: objLane.minWidth ? objLane.minWidth : 100,
                maxHeight: Number.POSITIVE_INFINITY,
                maxWidth: Number.POSITIVE_INFINITY,
                borderColor: "black",
                constraints: constraints | ej.datavisualization.Diagram.NodeConstraints.AllowDrop & ~ej.datavisualization.Diagram.NodeConstraints.Connect,
                cssClass: objLane.cssClass ? objLane.cssClass : "",
                addInfo: objLane.addInfo ? objLane.addInfo : null,
                paletteItem: obj.paletteItem ? obj.paletteItem : null,
                fillColor: objLane.fillColor ? objLane.fillColor : "white",
                isLane: true,
                offsetX: obj.offsetX ? obj.offsetX : 100,
                offsetY: obj.offsetY ? obj.offsetY : 100,
                orientation: orientation ? orientation : "horizontal"
            };
            lane.children[0].labels[0].rotateAngle = orientation === "horizontal" ? 270 : 0;
            return lane;
        },
        _createPaletteLane: function (obj, nameTable) {
            var height = 0, width = 0, offsetX = 0, offsetY = 0, rotateAngle = 0, mleft = 0, mTop = 0, align = "left";
            var offx = 0, offY = 0;
            obj = ej.datavisualization.Diagram.Lane(obj);
            var constraints = obj.constraints ? obj.constraints : ej.datavisualization.Diagram.NodeConstraints.Default;
            if (obj.paletteItem && !obj.paletteItem.enableScale && !obj.paletteItem.width) {
                if (obj.orientation === "horizontal") {
                    offx += 2;
                }
            }
            if (obj.orientation == "horizontal") {
                height = obj.height ? obj.height : 50;
                width = 25;
                offsetX = 14 + offx;
                offsetY = height / 2 + 1;
                rotateAngle = 270;
                align = "left";
            }
            else if (obj.orientation == "vertical") {
                height = 25;
                width = obj.width ? obj.width : 50;
                offsetX = width / 2;
                offsetY = 15;
                align = "left";
            }
            var name = obj.header.text ? obj.header.text : "";
            var header = ej.datavisualization.Diagram.Node({
                name: obj.name + "_" + name,
                _type: "node",
                labels: [
                    { text: obj.header.text ? obj.header.text : "Function", fontSize: obj.header.fontSize ? obj.header.fontSize : 11, offset: { x: 0.5, y: .5 }, width: 100, rotateAngle: rotateAngle, }
                ],
                height: height,
                width: width,
                fillColor: obj.header.fillColor ? obj.header.fillColor : "white",
                //constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select,
                parent: obj.name,
                offsetX: offsetX,
                offsetY: offsetY,
                constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Connect,
            });
            nameTable[header.name] = header;
            if (obj.orientation == "horizontal") {
                height = obj.height;
                width = obj.width - 25;
                offsetX = 25 + width / 2 + offx;
                offsetY = height / 2 + 1;
            }
            else if (obj.orientation == "vertical") {
                height = obj.height - 25;
                width = obj.width;
                offsetX = width / 2;
                offsetY = 25 + height / 2;
            }
            var content = ej.datavisualization.Diagram.Node({
                name: obj.name + "content",
                _type: "node",
                height: height,
                width: width,
                fillColor: obj.fillColor ? obj.fillColor : "white",
                //constraints: ej.datavisualization.Diagram.NodeConstraints.Default ^ ej.datavisualization.Diagram.NodeConstraints.Select,
                parent: obj.name,
                offsetX: offsetX,
                offsetY: offsetY,
            });
            content._laneHeader = obj.header;
            nameTable[content.name] = content;
            var group = ej.datavisualization.Diagram.Group({
                name: obj.name + "_group",
                addInfo: obj.addInfo ? obj.addInfo : {},
                height: obj.height,
                width: obj.width,
                header: obj.header ? obj.header : null,
                offsetX: obj.offsetX,
                offsetY: obj.offsetY,
                children: [header.name, content.name, ],
                paletteItem: obj.paletteItem ? obj.paletteItem : null,
            });
            group._lane = obj;
            group.constraints = constraints;
            group.isLane = true;
            group.orientation = obj.orientation;
            return group;
        },
        //#endregion
        //#region Map swimlane
        _mapObject: function (diagram, node, type, childTable) {
            var obj;
            switch (type) {
                case "lane":
                    obj = this._mapLane(diagram, node);
                    break;
                case "phase":
                    obj = this._mapPhase(diagram, node);
                    break;
                case "swimlane":
                    obj = this._mapSwimlane(diagram, node, childTable);
                    break;
            }
            return obj;
        },
        //#region for mapping the Lane
        _mapLane: function (diagram, lane, childTable) {
            var nLane = ej.datavisualization.Diagram.Lane();
            this._mapLaneHeader(diagram, lane, nLane, childTable);
            this._mapChildren(diagram, lane, nLane, childTable);
            nLane.name = lane.name;
            nLane.labels = lane.labels;
            nLane.fillColor = lane.fillColor;
            nLane.orientation = lane.orientation;
            nLane.maxHeight = lane.maxHeight;
            nLane.maxWidth = lane.maxWidth;
            nLane.minHeight = lane.height > lane.minHeight ? lane.height : lane.minHeight;
            nLane.minWidth = lane.width > lane.minWidth ? lane.width : lane.minWidth;
            nLane.constraints = lane.constraints;
            nLane.addInfo = lane.addInfo ? lane.addInfo : {};
            if (lane.orientation === "horizontal") {
                nLane.height = lane.height;
                nLane.width = null;
            }
            else {
                nLane.height = null;
                nLane.width = lane.width;
            }
            return nLane;
        },
        _mapLaneHeader: function (diagram, orgobj, clObj, childTable) {
            if (orgobj.children[0])
                var head = diagram.nameTable[diagram._getChild(orgobj.children[0])];
            if (!head && childTable)
                var head = childTable[diagram._getChild(orgobj.children[0])];
            if (head) {
                //clObj.header.name = head.name;
                if (head.labels && head.labels[0]) {
                    if (head.name)
                        clObj.header.name = head.name;
                    clObj.header.text = head.labels[0].text;
                    clObj.header.fontColor = head.labels[0].fontColor;
                    clObj.header.fontSize = head.labels[0].fontSize;
                    clObj.header.fontFamily = head.labels[0].fontFamily;
                    clObj.header.bold = head.labels[0].bold;
                    clObj.header.italic = head.labels[0].italic;
                    clObj.header.textDecoration = head.labels[0].textDecoration;
                    clObj.header.rotateAngle = head.labels[0].rotateAngle;
                    clObj.header.textOverflow = head.labels[0].textOverflow;
                    clObj.header.overflowType = head.labels[0].overflowType;
                    if (head.labels[0].name) {
                        clObj.header._labelName = head.labels[0].name;
                    }
                }
                clObj.header.fillColor = head.fillColor;
                if (orgobj.orientation === "vertical") {
                    clObj.header.height = head.height;
                    clObj.header.width = null;
                }
                else {
                    clObj.header.height = null;
                    clObj.header.width = head.width;
                }
            }
        },
        _mapChildren: function (diagram, orgobj, clObj, childTable) {
            var child;
            if (orgobj.children && orgobj.children.length >= 2) {
                for (var i = 1; i < orgobj.children.length; i++) {
                    if (diagram._getChild(orgobj.children[i]))
                        child = diagram.nameTable[diagram._getChild(orgobj.children[i])];
                    if (childTable && !child)
                        child = childTable[diagram._getChild(orgobj.children[i])];
                    if (child) {
                        child.marginRight = 0;
                        child.marginBottom = 0;
                        clObj.children.push(child);
                    }
                }
            }
        },
        //#endregion 
        //#region for mapping the swimlane
        _mapSwimlane: function (diagram, swimlane, childTable) {
            var nSwimlane = ej.datavisualization.Diagram.SwimLane();
            this._mapSwimlaneHeader(diagram, swimlane, nSwimlane, childTable);
            this._mapLanes(diagram, swimlane, nSwimlane, childTable);
            this._mapPhases(diagram, swimlane, nSwimlane, childTable);
            nSwimlane.name = swimlane.name;
            nSwimlane.orientation = swimlane.orientation;
            nSwimlane.offsetX = swimlane.offsetX;
            nSwimlane.offsetY = swimlane.offsetY;
            nSwimlane.maxHeight = swimlane.maxHeight;
            nSwimlane.maxWidth = swimlane.maxWidth;
            nSwimlane.minHeight = swimlane.minHeight;
            nSwimlane.minWidth = swimlane.minWidth;
            if (nSwimlane.orientation === "horizontal")
                nSwimlane.minWidth = (swimlane.width && swimlane.minWidth && swimlane.width > swimlane.minWidth) ? swimlane.width : swimlane.minWidth;
            else
                nSwimlane.minWidth = swimlane.minWidth;
            nSwimlane.phaseSize = swimlane.phaseSize;
            nSwimlane.constraints = swimlane.constraints;
            nSwimlane.zOrder = swimlane.zOrder;
            nSwimlane.addInfo = swimlane.addInfo ? swimlane.addInfo : {};
            nSwimlane.height = swimlane.height;
            nSwimlane.width = swimlane.width;
            return nSwimlane;
        },
        _mapSwimlaneHeader: function (diagram, orgobj, clObj, childTable) {
            if (orgobj.children[0])
                var head = diagram.nameTable[diagram._getChild(orgobj.children[0])];
            if (!head && childTable)
                head = childTable[diagram._getChild(orgobj.children[0])];
            if (head) {
                if (head.labels && head.labels[0]) {
                    clObj.header.text = head.labels[0].text
                    clObj.header.fontColor = head.labels[0].fontColor
                    clObj.header.fontSize = head.labels[0].fontSize
                    clObj.header.fontFamily = head.labels[0].fontFamily
                    clObj.header.bold = head.labels[0].bold
                    clObj.header.italic = head.labels[0].italic
                    clObj.header.textDecoration = head.labels[0].textDecoration
                    clObj.header.textOverflow = head.labels[0].textOverflow
                    clObj.header.overflowType = head.labels[0].overflowType
                }
                clObj.header.fillColor = head.fillColor;
                clObj.header.height = head.height;
                clObj.header.width = head.width;
            }
        },
        _mapLanes: function (diagram, orgobj, clObj, childTable) {
            var laneStack, lane, nLane;
            if (orgobj.children[2] && diagram._getChild(orgobj.children[2]))
                laneStack = childTable ? childTable[diagram._getChild(orgobj.children[2])] : diagram.nameTable[diagram._getChild(orgobj.children[2])];
            if (laneStack && laneStack.children && laneStack.children.length > 0) {
                for (var i = 0; i < laneStack.children.length; i++) {
                    if (diagram._getChild(laneStack.children[i]))
                        lane = childTable ? childTable[diagram._getChild(laneStack.children[i])] : diagram.nameTable[diagram._getChild(laneStack.children[i])];
                    if (lane) {
                        nLane = this._mapLane(diagram, lane, childTable);
                        if (nLane) clObj.lanes.push(nLane);
                    }
                }

            }
        },
        _mapPhases: function (diagram, orgobj, clObj, childTable) {
            var phases = ej.datavisualization.Diagram.SwimLaneContainerHelper.getPhases(diagram, orgobj, childTable);
            if (phases && phases.length > 0) {
                var length = phases.length;
                var nameTable = childTable ? childTable : diagram.nameTable;
                if (phases[phases.length - 1] && nameTable[phases[phases.length - 1]]) {
                    var lstPhse = nameTable[phases[phases.length - 1]];
                    if (!(lstPhse.name.split("defPhase").length > 1) && (lstPhse.offset != orgobj.width))
                        length++;
                }
                for (var i = 0; i < length; i++) {
                    var cphase = this._mapPhase(diagram, nameTable[diagram._getChild(phases[i])], childTable);
                    if (cphase) {
                        clObj.phases.push(cphase);
                    }
                }
                if (nameTable["phaseStack" + phases[phases.length - 1]])
                    clObj._lastPhase = this._mapPhase(diagram, nameTable["phaseStack" + phases[phases.length - 1]], childTable);
            }
        },
        //#endregion 
        //#region for mapping the Phase
        _mapPhase: function (diagram, phase, childTable) {
            var cphase;
            if (phase)
                cphase = childTable ? childTable[phase.name] : diagram.nameTable[phase.name];
            if (cphase)
                return cphase;
            else return null;
        },
        _getSwimLaneNode: function (node, selNode, isPhase, diagram) {
            if (node.isSwimlane) {
                if (isPhase) {
                    if (diagram.nameTable[diagram._getChild(node.children[2])].container.orientation == selNode.orientation)
                        return node;
                }
                else if (diagram.nameTable[diagram._getChild(node.children[2])].container.orientation != selNode.orientation)
                    return node;
            }
            if (node.parent) {
                var parent = diagram.nameTable[node.parent];
                if (parent) {
                    return this._getSwimLaneNode(parent, selNode, undefined, diagram);
                }
            }
            return null;
        }
        //#endregion 
        //#endregion 
    };
})(jQuery, Syncfusion);

