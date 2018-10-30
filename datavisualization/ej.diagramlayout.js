(function ($, ej) {
    "use strict";
    ej.datavisualization.Diagram.LayoutTypes = {
        None: "none",
        HierarchicalTree: "hierarchicaltree",
        OrganizationalChart: "organizationalchart",
        RadialTree: "radialtree",
        SymmetricLayout: "symmetriclayout"
    };
    ej.datavisualization.Diagram.ChartOrientations = {
        Horizontal: "horizontal",
        Vertical: "vertical"
    };
    ej.datavisualization.Diagram.ChartTypes = {
        Left: "left",
        Right: "right",
        Alternate: "alternate",
        Center: "center"
    };
    ej.datavisualization.Diagram.Layout = {
        doLayout: function (diagram, updateView) {
            var model = diagram.model;
            var layout = {
                diagram: diagram, _anchorX: 0, _anchorY: 0, _graphNodes: {},
                _firstLevelNodes: [], _centerNode: null, levels: [], maxLevel: 0, layoutNodes: [],
            };
            for (var prop in model.layout) {
                if (prop == "type") layout.type = diagram._layoutType();
                else if (prop == "orientation") layout.orientation = diagram._layoutOrientation();
                else if (prop == "fixedNode") layout.fixedNode = diagram._fixedNode();
                else if (prop == "horizontalSpacing") layout.horizontalSpacing = Number(diagram._horizontalSpacing());
                else if (prop == "verticalSpacing") layout.verticalSpacing = Number(diagram._verticalSpacing());
                else if (prop == "marginX") layout.marginX = Number(diagram._layoutMarginX());
                else if (prop == "marginY") layout.marginY = Number(diagram._layoutMarginY());
                else if (prop == "getLayoutInfo") {
                    if (typeof model.layout.getLayoutInfo === "string") {
                        layout.getLayoutInfo = ej.util.getObject(model.layout.getLayoutInfo, window);
                    }
                    else
                        if ($.isFunction(model.layout.getLayoutInfo)) {
                            layout.getLayoutInfo = model.layout.getLayoutInfo;
                        }
                }
                else if (prop == "getConnectorSegments") {
                    if (typeof model.layout.getConnectorSegments === "string") {
                        layout.getConnectorSegments = ej.util.getObject(model.layout.getConnectorSegments, window);
                    }
                    else
                        if ($.isFunction(model.layout.getConnectorSegments)) {
                            layout.getConnectorSegments = model.layout.getConnectorSegments;
                        }
                }
                else layout[prop] = model.layout[prop];
            }
            layout.updateView = updateView === undefined ? true : layout.updateView;
            layout.objects = [];
            if (layout.type === "symmetriclayout") {
                var smtLayout = new SymmetricLayoutManager(layout.diagram, 50);
                smtLayout.MaxIteration = layout.maxIteration;
                smtLayout.SpringLength = layout.springLength;
                smtLayout.SpringFactor = layout.springFactor;
                var graphLayoutManager = new GraphLayoutManager();
                graphLayoutManager.updateLayout(layout.diagram, smtLayout);
            }
            else if (layout.type != "radialtree")
                ej.datavisualization.Diagram.HierarchicalLayout.doLayout(layout);
            else
                ej.datavisualization.Diagram.RadialTreeLayout.doLayout(layout);
            if (!layout.updateView) return layout.objects;
        }
    };
    //region Hierarchical layout
    ej.datavisualization.Diagram.HierarchicalLayout = {
        doLayout: function (layout) {
            var diagram, model, nodes, node, layoutInfo, i;
            diagram = layout.diagram
            model = diagram.model;
            nodes = diagram.nodes();
            var distributeLine;
            if (this._checkMultiparent(nodes, layout)) {
                distributeLine = new ej.datavisualization.Diagram.LineDistribution(this);
                if (layout.avoidSegmentOverlapping) {
                    distributeLine._initLineDistribution(layout);
                }
                ej.datavisualization.Diagram.MultipleParentHierarchicalLayout.doLayout(layout);
            }
            else {
                if (nodes.length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        node = nodes[i];
                        if (!node.excludeFromLayout) {
                            layoutInfo = layout._graphNodes[node.name] = this._setUpLayoutInfo(layout, node);
                            layoutInfo.tree.hasSubTree = false;
                            if (!node.inEdges || !node.inEdges.length || this._isAnnotationShape(node, false)) { layout._firstLevelNodes.push(node); }
                        }
                    }
                    //Update relationship(parent and children)
                    if (layout.root || diagram.model.dataSourceSettings.root) {
                        var root;
                        if (layout.root)
                            layout.rootNode = root = diagram.nameTable[diagram._getChild(layout.root)];
                        else {
                            var rootId = diagram.model.dataSourceSettings.root;
                            var dataSourceId = diagram.model.dataSourceSettings.id;
                            for (var i = 0; i < nodes.length; i++) {
                                if (nodes[i][dataSourceId] === rootId)
                                    layout.rootNode = root = diagram.nameTable[diagram._getChild(nodes[i].name)];
                            }
                        }
                        if (root && layout._firstLevelNodes.length === 0) {
                            ej.datavisualization.Diagram.MultipleParentHierarchicalLayout.doLayout(layout);
                            return;
                        }
                    }
                    for (i = 0; i < layout._firstLevelNodes.length; i++) {
                        node = layout._firstLevelNodes[i];
                        this._updateEdges(layout, node, 1);
                    }
                    if (layout._firstLevelNodes.length > 0) {
                        layout._rootNode = layout._firstLevelNodes[0];
                        var bounds, x = 0, y = 0, minX, maxX, minY, maxY;
                        for (i = 0; i < layout._firstLevelNodes.length; i++) {
                            bounds = this._updateTree(layout, x, y, layout._firstLevelNodes[i], 0, layout._firstLevelNodes[i - 1]);
                            var rootInfo = layout._graphNodes[layout._firstLevelNodes[i].name];
                            if (rootInfo.y < bounds.y) bounds.y = rootInfo.y;
                            if (rootInfo.x < bounds.x) bounds.x = rootInfo.x;
                            if (layout.orientation == "lefttoright" || layout.orientation == "righttoleft") y = bounds.right + layout.horizontalSpacing;
                            else x = bounds.right + layout.horizontalSpacing;
                            if (i == 0) { minX = bounds.x; minY = bounds.y; maxX = bounds.right; maxY = bounds.bottom; }
                            else {
                                minX = Math.min(minX, bounds.x); minY = Math.min(minY, bounds.y); maxX = Math.max(maxX, bounds.right); maxY = Math.max(maxY, bounds.bottom);
                            }
                        }
                        this._updateAnchor(layout, { x: minX, y: minY, right: maxX, bottom: maxY });
                        diagram._layoutInAction = true;
                        for (i = 0; i < layout._firstLevelNodes.length; i++) {
                            this._updateNodes(layout, layout._firstLevelNodes[i], 0);
                        }
                        diagram._layoutInAction = false;
                        if (!layout.updateView) diagram._internalLayout = layout;
                        if (layout.updateView) {
                            for (i = 0; i < layout._firstLevelNodes.length; i++) {
                                this._updateConnectors(layout, layout._firstLevelNodes[i], 1);
                            }
                        }
                            for (var j = 0; j < layout.diagram.model.connectors.length; j++) {
                                delete layout.diagram.model.connectors[j]._visited;
                            }
                            for (var j = 0; j < layout.diagram.model.nodes.length; j++) {
                                delete layout.diagram.model.nodes[j]._visited1;
                                delete layout.diagram.model.nodes[j]._isRightAdded;
                            }
                        }
                    }
                }
            if (layout.avoidSegmentOverlapping) {
                distributeLine._distributeLines(layout);
            }
            delete layout.diagram.minSpaceBetweenNode;
        },
        _checkMultiparent: function (nodes, layout) {
            if (nodes && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var node = nodes[i];
                    layout._processedNodes = [];
                    if (node && (((node.inEdges && node.inEdges.length > 1) && !this._isAnnotationShape(node, true)) ||
                        this._checkCyclicNodes(node, layout, node.name))) {
                        delete layout._processedNodes;
                        return true;
                }
            }
            }
            delete layout._processedNodes;
            return false;
        },

        _checkCyclicNodes: function (node, layout, nodeName) {
            if (node.outEdges && node.outEdges.length > 0 && !this._isLoopProcessed(layout, node.name)) {
                layout._processedNodes.push(node.name);
                for (var i = 0; i < node.outEdges.length; i++) {
                    var connector = layout.diagram.nameTable[node.outEdges[i]];
                    if (connector) {
                        if (connector.targetNode === nodeName) {
                            return true;
                        }
                        else {
                        var targetNode = layout.diagram.nameTable[connector.targetNode];
                            if (targetNode) {
                                if (targetNode.outEdges && targetNode.outEdges.length > 0) {
                                    var isCycle = this._checkCyclicNodes(targetNode, layout, nodeName);
                                    if (isCycle)
                            return true;
                        }
                    }
                }
            }
                }
            }
            return false;
        },

        _isLoopProcessed: function (layout, name) {
            var processedNodes = layout._processedNodes;
            for (var i = 0; i < processedNodes.length; i++) {
                if (processedNodes[i] === name)
                    return true;
                }
            return false;
        },

        _isAnnotationShape: function (node, isMultiParentCheck) {
            if (node && node.type === "bpmn" && node._type === "group" && node.annotation && node.annotation.text) {
                if (isMultiParentCheck) {
                    if (node.inEdges.length <= 2)
                        return true;
                }
                else if (node.inEdges.length <= 1) {
                    return true;
                }
            }
            return false;
        },

        _updateTree: function (layout, x, y, shape, level, prev, dontupdate) {
            if (!shape._visited1) {
                shape._visited1 = true;
                var dimensions, info, lev, obj, hasChild;
                dimensions = this._getDimensions(layout, shape, x, y, level);
                info = layout._graphNodes[shape.name];
                //Set maximum level of layout
                layout.maxLevel = Math.max(layout.maxLevel, level);
                lev = level;
                hasChild = this._hasChild(layout, shape);
                if (!hasChild && !info.tree.assistants.length) {
                    //update leaf nodes
                    shape._treeBounds = this._updateLeafNode(layout, shape, prev, dimensions, level, dontupdate);
                    return shape._treeBounds;
                }
                else {
                    var treeBounds, shapeBounds, levelBounds, d, asstBounds, space;
                    var bottom = dimensions.y + dimensions.height + layout.verticalSpacing;
                    if (info.tree.assistants.length) {
                        //Vertically place assistants
                        obj = this._setDepthSpaceForAssistants(layout, shape, bottom, dimensions.height, level, layout.verticalSpacing);
                        lev = obj.level;
                        bottom = obj.bottom;
                    }
                    if (!info.tree.assistants.length && info.tree.orientation != "horizontal") bottom = dimensions.y + dimensions.height + layout.verticalSpacing / 2;
                    if (info.tree.children.length) {
                        if (info.tree.orientation == "horizontal" && (info.tree.type != "balanced" || info.tree.children.length == 1))
                            treeBounds = this._updateHorizontalTree(layout, shape, prev, dimensions.x, bottom, lev);
                        else if (info.tree.type == "balanced")
                            treeBounds = this._updateHorizontalTreeWithMultipleRows(layout, shape, prev, dimensions.x, bottom, lev);
                        else
                            treeBounds = this._updateVerticalTree(layout, shape, dimensions.x, bottom, lev, dontupdate);
                    }
                    if (!(info.y && info.y > dimensions.y))
                        info.y = dimensions.y;
                    if (info.mid)
                        x = info.mid;
                    if (info.tree.assistants.length) {
                        //Set breadth space for assistants
                        space = x !== undefined ? x : dimensions.x;
                        asstBounds = this._setBreadthSpaceForAssistants(layout, shape, dimensions, space, bottom, level);
                        if (!hasChild) {
                            levelBounds = treeBounds = asstBounds;
                            x = (levelBounds.x + levelBounds.right) / 2 - dimensions.width / 2;
                            treeBounds = levelBounds;
                        }
                        d = asstBounds ? asstBounds.canMoveBy : undefined;
                    }
                    info.x = x;
                    if (!info.translate) info._treeWidth = treeBounds.right - treeBounds.x;
                    shapeBounds = { x: x, y: dimensions.y, right: x + dimensions.width, bottom: dimensions.y + dimensions.height };
                    this._translateSubTree(layout, shape, shapeBounds, treeBounds, dimensions, level, d, prev != undefined, dontupdate);
                    if (typeof info.firstChild != "string")
                        info.firstChild.x += info.subTreeTranslation;
                    shape._treeBounds = treeBounds;
                    return treeBounds;
                }
            }
            else {
                return shape._treeBounds;
            }
        },
        _updateLeafNode: function (layout, shape, prev, dimensions, level, dontupdate) {
            var info, bounds;
            info = layout._graphNodes[shape.name];
            if (!(info.x && info.x > dimensions.x))
                info.x = dimensions.x;
            if (!(info.y && info.y > dimensions.y))
                info.y = dimensions.y;
            info.maxLevel = Math.max(level, info.maxLevel || 0);
            bounds = { x: dimensions.x, y: dimensions.y, right: dimensions.x + dimensions.width, bottom: dimensions.y + dimensions.height };
            info.maxLevel = Math.max(info.maxLevel || 0, level);
            this._translateSubTree(layout, shape, bounds, bounds, dimensions, level, undefined, prev != undefined, dontupdate);
            return { x: info.x, y: info.y, right: info.x + dimensions.width, bottom: info.y + dimensions.height };
        },
        _translateSubTree: function (layout, shape, shapeBounds, treeBounds, dimensions, level, assistDiff, translate, dontupdate) {
            var info = layout._graphNodes[shape.name];
            var firstChild = layout.diagram.nameTable[info.firstChild ? info.firstChild.child : info.tree.children[0]];
            var firstChildInfo = firstChild ? layout._graphNodes[firstChild.name] : null;
            var hasChild = this._hasChild(layout, shape);
            var intersect = this._findIntersectingLevels(layout, shapeBounds, level, info.actualLevel);
            var treeIntersect = this._findIntersectingLevels(layout, treeBounds, level, info.actualLevel);
            var levelBounds = [], diff;
            if (intersect.length && info.translate) {
                info.intersect = intersect;
                this._spaceLeftFromPrevSubTree(layout, shape, shapeBounds);
                info.canMoveBy = info.diff;
                if (assistDiff !== undefined)
                    info.canMoveBy = Math.min(assistDiff, info.canMoveBy);
                if (firstChild && firstChildInfo.canMoveBy !== undefined) {
                    if (firstChildInfo.canMoveBy >= info.canMoveBy) info.translated = true;
                    info.canMoveBy = Math.min(info.canMoveBy, firstChildInfo.canMoveBy);
                }
                if (translate) {
                    info.x -= info.canMoveBy;
                    info.subTreeTranslation -= info.canMoveBy;
                    if (hasChild) {
                        this._shiftSubordinates(layout, treeIntersect, info.canMoveBy);
                        treeBounds.x = Math.min(treeBounds.x, info.x);
                        treeBounds.right = Math.max(treeBounds.right, info.x + dimensions.width);
                        treeBounds.bottom = Math.max(treeBounds.bottom, info.y + dimensions.height);
                        treeBounds.x -= info.canMoveBy;
                        treeBounds.right -= info.canMoveBy;
                    }
                    if (firstChild && firstChildInfo.canMoveBy > info.canMoveBy) {
                        info.canMoveBy = firstChildInfo.canMoveBy - info.canMoveBy;
                    }
                    else if (firstChild && info.canMoveBy !== undefined) {
                        info.canMoveBy = 0;
                    }
                }
            }
            else {
                if (hasChild) {
                    treeBounds.x = Math.min(treeBounds.x, shapeBounds.x);
                    treeBounds.right = Math.max(treeBounds.right, shapeBounds.x + dimensions.width);
                    treeBounds.bottom = Math.max(treeBounds.bottom, info.y + dimensions.height);
                }
                if (!info.translate) {
                    info.canMoveBy = 0;
                    info.subTreeTranslation = 0;
                }
            }
            if (!dontupdate) {
                shapeBounds = { x: info.x, y: dimensions.y, right: info.x + dimensions.width, bottom: dimensions.y + dimensions.height };
                levelBounds.push({ rBounds: shapeBounds });
                this._updateRearBounds(layout, shape, levelBounds, level);
            }
        },
        _updateRearBounds: function (layout, shape, levelBounds, level, intersect) {
            var bnds, index, intersect, firstLevel, lastLevel, isLastLeaf = true;
            if (shape) {
                var info = layout._graphNodes[shape.name];
                intersect = info.intersect;
                isLastLeaf = !info.tree.children.length && !info.tree.assistants.length;
            }
            firstLevel = levelBounds[0].rBounds;
            lastLevel = levelBounds[levelBounds.length - 1].rBounds;
            if (intersect && intersect.length) {
                bnds = layout.levels[intersect[0]].rBounds;
                var bottom = bnds.bottom;
                if (bnds.y < firstLevel.y) {
                    bnds.bottom = firstLevel.y;
                    levelBounds.splice(0, 0, { rBounds: bnds });
                }
                if (bottom > lastLevel.bottom) {
                    levelBounds.push({ rBounds: { x: bnds.x, right: bnds.right, y: firstLevel.bottom, bottom: bottom } });
                }
                else {
                    bnds = layout.levels[intersect[intersect.length - 1]].rBounds;
                    if (isLastLeaf && bnds.bottom > lastLevel.bottom) {
                        bnds.y = lastLevel.bottom;
                        levelBounds.push({ rBounds: bnds });
                    }
                }
                index = intersect[0];
                for (var i = levelBounds.length - 1; i >= 0; i--)
                    layout.levels.splice(index, 0, levelBounds[i]);
                index += levelBounds.length;
                layout.levels.splice(index, intersect.length);
            }
            else {
                index = this._findLevel(layout, levelBounds[levelBounds.length - 1].rBounds, level);
                for (var i = levelBounds.length - 1; i >= 0; i--)
                    layout.levels.splice(index, 0, levelBounds[i]);
            }
        },
        _shiftSubordinates: function (layout, intersect, diff) {
            var i;
            //Shift the sublevels by the distance diff
            if (diff != 0) {
                for (i = 0; i < intersect.length; i++) {
                    if (layout.levels[intersect[i]].rBounds) {
                        layout.levels[intersect[i]].rBounds.x -= diff;
                        layout.levels[intersect[i]].rBounds.right -= diff;
                    }
                }
            }
        },
        _setDepthSpaceForAssistants: function (layout, shape, bottom, height, lev, verticalSpacing) {
            var info = layout._graphNodes[shape.name];
            var asst, asstHeight, i, asstElement;
            var max = bottom;
            //Vertically place the assistants as alternate layout(alternatively at both right and left sides of parent)
            for (i = 0; i < info.tree.assistants.length; i++) {
                asst = layout._graphNodes[info.tree.assistants[i]];
                if (asst) {
                    asst.tree.children = asst.tree.assistants = [];
                    asst.y = bottom;
                    asstElement = layout.diagram.nameTable[info.tree.assistants[i]];
                    asstHeight = asstElement.height ? asstElement.height : asstElement._height;
                    if (layout.orientation == "lefttoright" || layout.orientation == "righttoleft")
                        asstHeight = asstElement.width ? asstElement.width : asstElement._width;
                    max = bottom + asstHeight + verticalSpacing / 2;
                    layout.maxLevel = lev + 1;
                    if (i % 2 == 1 && i != info.tree.assistants.length - 1) {
                        bottom = max;
                        lev++;
                    }
                }
            }
            return { level: layout.maxLevel, bottom: bottom + asstHeight + verticalSpacing };
        },
        _setBreadthSpaceForAssistants: function (layout, shape, dimensions, space, bottom, level) {
            var asst, asstWidth, prevBounds, bounds, asstElement;
            var info = layout._graphNodes[shape.name];
            var max = bottom;
            var lev = level;
            var left, diff, levelBounds, intersect, i;
            for (i = 0; i < info.tree.assistants.length; i++) {
                asst = layout._graphNodes[info.tree.assistants[i]];
                //Arrange assistants at both left and right sides of parent(like alternate layout)
                //Check - By default, distance to be left between parent and child nodes is assumed as 20. It can be modified/customized later.
                if (asst) {
                    asstElement = layout.diagram.nameTable[info.tree.assistants[i]];
                    asstWidth = asstElement.width ? asstElement.width : asstElement._width;
                    if (layout.orientation == "lefttoright" || layout.orientation == "righttoleft")
                        asstWidth = asstElement.height ? asstElement.height : asstElement._height;
                    if (i % 2 == 0) left = space + dimensions.width / 2 - 20 - asstWidth;
                    else left = space + dimensions.width / 2 + 20;
                    //Check - What will happen if update leaf node is called? Since assistants don't have children
                    bounds = this._updateTree(layout, left, asst.y, layout.diagram.nameTable[info.tree.assistants[i]], lev + 1);
                    if (!this._hasChild(layout, shape))
                        if (i == 0) levelBounds = bounds;
                        else this._uniteRects(levelBounds, bounds);
                    if (i % 2 == 0 && asst.prevBounds) {
                        if (diff === undefined) diff = asst.canMoveBy;
                        else diff = Math.min(diff, asst.canMoveBy);
                    }
                    if (i % 2 == 1 || i == info.tree.assistants.length - 1) {
                        intersect = this._findIntersectingLevels(layout, bounds, lev + 1);
                        //Update rightmost positions of known layout levels
                        this._updateRearBounds(layout, null, [{ rBounds: bounds }], lev + 1, intersect);
                        lev++;
                    }
                }
            }
            if (levelBounds)
                levelBounds.canMoveBy = diff;
            return levelBounds;
        },
        _updateHorizontalTree: function (layout, shape, prev, x, y, level) {
            var child, childInfo, childBounds, childWidth, childHeight, firstChildInfo;
            var prevBounds, bounds, actBounds, maxLevel, translateSibilingsBy;
            //Get dimensions with respect to layout orientations
            var dimensions = this._getDimensions(layout, shape, x, y, level);
            var info = layout._graphNodes[shape.name];
            var side = info.tree.type;
            var lev = level;
            var right = x;
            var bottom = y;
            var width, height;
            var prevLayoutLevels = layout.levels.slice(0, layout.levels.length);
            if (this._hasChild(layout, shape)) {
                var h = layout.orientation == "lefttoright" || layout.orientation == "righttoleft" ? true : false;
                for (var i = 0; i < info.tree.children.length; i++) {
                    var oldActBounds;
                    child = layout.diagram.nameTable[info.tree.children[i]];
                    width = child.width ? child.width : child._width;
                    height = child.height ? child.height : child._height;
                    childWidth = h ? height : width;
                    childHeight = h ? width : height;
                    prevBounds = layout.levels[lev + 1] ? layout.levels[lev + 1].rBounds : null;
                    //Update sub tree
                    childBounds = this._updateTree(layout, right, bottom, child, lev + 1, layout.diagram.nameTable[info.tree.children[i - 1]]);
                    childInfo = layout._graphNodes[child.name];
                    info.maxLevel = Math.max(info.maxLevel || 0, childInfo.maxLevel || 0);
                    actBounds = { x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth, bottom: childInfo.y + childHeight };
                    if (i == 0) {
                        //Compare with previous(right most) subtree
                        bounds = { x: Math.min(childInfo.x, childBounds.x), y: Math.min(childInfo.y, childBounds.y), right: childBounds.right, bottom: childBounds.bottom };
                        firstChildInfo = childInfo;
                    }
                    if (!oldActBounds)
                        oldActBounds = actBounds;
                    else {
                        oldActBounds.x = actBounds.x;
                        oldActBounds.y = actBounds.y;
                        if (actBounds.right > oldActBounds.right)
                            oldActBounds.right = actBounds.right;
                        oldActBounds.bottom = actBounds.bottom;
                        //oldActBounds = actBounds;
                    }
                    //Compare with previous subtree if level of the child is greater than the level of previous sub tree
                    //Check - what will happen if level of second child is greater than current child
                    if (i == 0) info.firstChild = { x: childInfo.x, canMoveBy: childInfo.canMoveBy, child: child.name };
                    if (this._hasChild(layout, child)) {
                        if (!info.firstChild || info.firstChild.x >= childInfo.firstChild.x) {
                            if (childInfo.firstChild && info.firstChild.canMoveBy < childInfo.canMoveBy) {
                                var canMoveBy = info.firstChild.canMoveBy;
                                childInfo.canMoveBy = canMoveBy;
                                layout._graphNodes[info.firstChild.child].canMoveBy = canMoveBy;
                                info.firstChild.canMoveBy = canMoveBy;
                            }
                            info.firstChild = { x: childInfo.firstChild.x, canMoveBy: canMoveBy !== undefined ? canMoveBy : childInfo.canMoveBy, child: child.name }
                        }
                        else if (childInfo.firstChild && childInfo.translated && info.firstChild.canMoveBy > childInfo.canMoveBy) {
                            info.firstChild.canMoveBy = layout._graphNodes[info.firstChild.child].canMoveBy = childInfo.canMoveBy;
                        }
                    }
                    maxLevel = maxLevel ? Math.max(childInfo.maxLevel, maxLevel) : childInfo.maxLevel;
                    if (!child._isRightAdded) {
                        this._uniteRects(bounds, childBounds);
                        if (i != 0 && !this._hasChild(layout, child) && childInfo.subTreeTranslation < 0)
                            right = childBounds.right - childInfo.subTreeTranslation + layout.horizontalSpacing;
                        else
                            right = childBounds.right + layout.horizontalSpacing;
                    }
                    child._isRightAdded = true;
                }
                if (!isNaN(translateSibilingsBy)) firstChildInfo.canMoveBy = translateSibilingsBy;
                info.mid = (firstChildInfo.x + oldActBounds.right) / 2 - dimensions.width / 2;
                //Set parent based on the chart type
                if (side == "left") info.mid = actBounds.right - dimensions.width; else if (side == "right") info.mid = x;
            }
            return bounds;
        },
        _updateHorizontalTreeWithMultipleRows: function (layout, shape, prev, x, y, level, centered) {
            var child, childInfo, childBounds, childWidth, childHeight, firstChildInfo;
            var prevBounds, bounds, actBounds, maxLevel, translateSibilingsBy, rowBounds;
            //Get dimensions with respect to layout orientations
            var dimensions = this._getDimensions(layout, shape, x, y, level);
            var info = layout._graphNodes[shape.name];
            var side = info.tree.type;
            var lev = level;
            var right = x;
            var bottom = y;
            var width, height;
            var prevLayoutLevels = layout.levels.slice(0, layout.levels.length);
            var fchild;
            var centered = [];
            var maxRowWidth;
            var minTranslation = 0;
            if (this._hasChild(layout, shape)) {
                var h = layout.orientation == "lefttoright" || layout.orientation == "righttoleft" ? true : false;
                var rows = this._splitChildrenInRows(layout, shape);
                var unique = info.tree.children.length == 5 && rows[0].length == 3;
                var left = [];
                var centerTree = [];
                var rightTree = [];
                if (!unique)
                    for (var i = 0; i < rows.length; i++) {
                        left[i] = []; rightTree[i] = [];
                        var half = rows[i].length;
                        if (rows[i].length % 2 != 1) {
                            half = Math.ceil(rows[i].length / 2);
                            for (var k = 0; k < half ; k++) {
                                left[i].push(rows[i][k]);
                            }
                        }
                        for (var j = left[i].length; j < rows[i].length; j++)
                            rightTree[i].push(rows[i][j]);
                    }
                else rightTree = rows;
                var leftBounds = [];
                var rightMost, minTranslation = 0;
                //Arrange left side
                for (var i = 0; i < left.length && left[i].length; i++) {
                    right = x;
                    if (leftBounds[i - 1]) bottom = leftBounds[i - 1].bottom + layout.verticalSpacing;
                    for (var j = 0; j < left[i].length; j++) {
                        child = layout.diagram.nameTable[left[i][j]];
                        width = child.width ? child.width : child._width;
                        height = child.height ? child.height : child._height;
                        childWidth = h ? height : width;
                        childHeight = h ? width : height;
                        prevBounds = layout.levels[lev + 1] ? layout.levels[lev + 1].rBounds : null;
                        //Update sub tree
                        childInfo = layout._graphNodes[child.name];
                        childInfo.actualLevel = lev + 1 + i;
                        childBounds = this._updateTree(layout, right, bottom, child, lev + 1, layout.diagram.nameTable[left[i][j - 1]]);
                        if (j == 0) {
                            leftBounds[i] = { x: childBounds.x, y: childBounds.y, right: childBounds.right, bottom: childBounds.bottom };
                        }
                        else {
                            this._uniteRects(leftBounds[i], childBounds);
                        }
                        if (i == 0 && j == 0) {
                            minTranslation = childInfo.canMoveBy;
                            info.firstChild = { x: childInfo.x, child: child.name, canMoveBy: childInfo.canMoveBy };
                        }
                        else if (j == 0 && childInfo.canMoveBy !== undefined && minTranslation > childInfo.canMoveBy) {
                            minTranslation = Math.min(minTranslation, childInfo.canMoveBy || 0);
                            info.firstChild = { x: childInfo.x, child: child.name, canMoveBy: childInfo.canMoveBy };
                        }
                        right = childBounds.right + layout.horizontalSpacing;
                    }
                    if (i == 0)
                        rightMost = leftBounds[i].right;
                    else rightMost = Math.max(rightMost, leftBounds[i].right);
                    prevBounds = actBounds;
                }
                //Translate to same positions
                for (var i = 0; i < left.length && left[i].length; i++) {
                    if (rightMost != leftBounds[i].right) {
                        var diff = rightMost - leftBounds[i].right;
                        for (var j = 0; j < left[i].length; j++) {
                            var element = layout.diagram.nameTable[left[i][j]];
                            var elementInfo = layout._graphNodes[left[i][j]];
                            elementInfo.x += diff;
                        }
                        //leftBounds[i].x += diff;
                        //leftBounds[i].right += diff;
                    }
                    if (i == 0) {
                        bounds = { x: leftBounds[0].x, y: leftBounds[0].y, right: leftBounds[0].right, bottom: leftBounds[0].bottom };
                    }
                    else this._uniteRects(bounds, leftBounds[i]);
                    prevBounds = childBounds;
                }
                var center = (rightMost || 0) + (rightMost !== undefined ? (layout.horizontalSpacing / 2) : 0);
                if (rightMost !== undefined) {
                    info.mid = center - dimensions.width / 2;
                    var rightX = rightMost + layout.horizontalSpacing;
                }
                var maxRowWidth;
                bottom = y;
                var rightBounds = [];
                for (var i = 0; i < rightTree.length; i++) {
                    if (rows[i].length % 2 == 1 && i == rightTree.length - 1 || unique) right = x;
                    else right = rightX || x;
                    if (i != 0) bottom = rightBounds[i - 1].bottom + layout.verticalSpacing;
                    for (var j = 0; j < rightTree[i].length; j++) {
                        child = layout.diagram.nameTable[rightTree[i][j]];
                        width = child.width ? child.width : child._width;
                        height = child.height ? child.height : child._height;
                        childWidth = h ? height : width;
                        childHeight = h ? width : height;
                        prevBounds = layout.levels[lev + 1] ? layout.levels[lev + 1].rBounds : null;
                        //Update sub tree
                        childInfo = layout._graphNodes[child.name];
                        childInfo.actualLevel = lev + 1 + i;
                        if (j == 0 && left[i] && left[i].length) childInfo.translate = false;
                        if (unique && i == 1) {
                            if (j == 0 && leftCenter + childWidth + layout.horizontalSpacing <= rightCenter) {
                                var align = true;
                                right = leftCenter - childWidth / 2;
                            }
                            if (align && j == 1) { right = rightCenter - childWidth / 2; }
                        }
                        childBounds = this._updateTree(layout, right, bottom, child, lev + 1, layout.diagram.nameTable[rightTree[i][j - 1]]);
                        if (unique && j <= 2 && i == 0) {
                            if (j == 1) {
                                var leftCenter = childBounds.x - layout.horizontalSpacing / 2;
                                var rightCenter = childBounds.x + childWidth + layout.horizontalSpacing / 2;
                            }
                        }
                        if (j == 0) {
                            rightBounds[i] = { x: childBounds.x, y: childBounds.y, right: childBounds.right, bottom: childBounds.bottom };
                        }
                        else {
                            this._uniteRects(rightBounds[i], childBounds);
                        }
                        if (!bounds) bounds = { x: rightBounds[i].x, y: rightBounds[i].y, right: rightBounds[i].right, bottom: rightBounds[i].bottom };
                        this._uniteRects(bounds, rightBounds[i]);
                        right = childBounds.right + layout.horizontalSpacing;
                        prevBounds = childBounds;
                        if (!info.firstChild || ((i == rightTree.length - 1 && rows[i].length % 2 == 1) || unique) && j == 0 && childInfo.canMoveBy !== undefined && minTranslation > childInfo.canMoveBy) {
                            minTranslation = Math.min(minTranslation, childInfo.canMoveBy || 0);
                            info.firstChild = { x: childInfo.x, child: child.name, canMoveBy: childInfo.canMoveBy };
                        }
                    }
                    if (unique && i == 1) {
                        var max = (rightBounds[0].right - rightBounds[0].x) >= (rightBounds[1].right - rightBounds[1].x) ? 0 : 1;
                    }
                    if (i == rows.length - 1) {
                        if (rows[i].length % 2 == 1 || unique && i == 1) {
                            var centered = rightTree[i][Math.floor(rightTree[i].length / 2)];
                            var centerObjct = layout.diagram.nameTable[centered];
                            var childDimension = this._getDimensions(layout, centerObjct, layout._graphNodes[centered].x, layout._graphNodes[centered].y, lev + 1);
                            diff = undefined;
                            if (!align && unique) {
                                if (max == 1) i = 0;
                                diff = (rightBounds[max].x + rightBounds[max].right) / 2 - (rightBounds[i].x + rightBounds[i].right) / 2;
                                if (i == 0) info.mid += diff;
                            }
                            else if (!unique && rightX !== undefined) diff = rightX - layout.horizontalSpacing / 2 - (layout._graphNodes[centered].x + childDimension.width / 2);
                            if (diff !== undefined) {
                                for (var j = 0; j < rightTree[i].length; j++) {
                                    layout._graphNodes[rightTree[i][j]].x += diff;
                                    layout._graphNodes[rightTree[i][j]].canMoveBy += diff;
                                    if (j == rightTree[i].length - 1) {
                                        var chldDimensions = this._getDimensions(layout, layout.diagram.nameTable[rightTree[i][j]], layout._graphNodes[rightTree[i][j]].x, layout._graphNodes[rightTree[i][j]].y, layout._graphNodes[rightTree[i][j]].actualLevel);
                                        var child = layout._graphNodes[rightTree[i][j]];
                                        var intersect = this._findIntersectingLevels(layout, { x: child.x, y: child.y, right: child.x + dimensions.width, bottom: child.y + dimensions.height }, layout._graphNodes[rightTree[i][j]].actualLevel);
                                        this._updateRearBounds(layout, null, [{ rBounds: { x: child.x, y: child.y, right: child.x + dimensions.width, bottom: child.y + dimensions.height } }], layout._graphNodes[rightTree[i][j]].actualLevel, intersect);
                                    }
                                }
                            }
                            if (unique)
                                info.mid = (rightCenter + leftCenter) / 2 + (i == 0 ? diff : 0) - dimensions.width / 2;
                            if (info.mid == undefined && layout._graphNodes[centered]) { info.mid = layout._graphNodes[centered].x; }
                            align = false;
                            i++;
                        }
                    }
                }
            }
            return bounds;
        },
        _updateVerticalTree: function (layout, shape, x, y, level, dontupdate) {
            //declare local variables
            var child, childInfo, childBounds, childWidth, childHeight, prevBounds, bounds, actBounds, oddBounds, evenBounds;
            var dimensions, info, firstChild, h, factor, right, bottom, lev, i;
            var diff, type, canMoveBy, levels = [], oddLevels = [], intersect;
            var width, height;
            //Get dimensions with respect to layout orientations
            dimensions = this._getDimensions(layout, shape, x, y, level);
            info = layout._graphNodes[shape.name];
            firstChild = layout.diagram.nameTable[info.tree.children[0]];
            h = layout.orientation == "lefttoright" || layout.orientation == "righttoleft" ? true : false;
            factor = info.tree.type == "left" || info.tree.type == "leftoffset" ? -1 : 0;
            right = x;
            bottom = y;
            lev = level;
            for (i = 0; i < info.tree.children.length; i++) {
                if (info.tree.type == "alternate") {
                    //arrange at both left and right
                    type = (i % 2 == 0 && info.tree.children.length > 2) ? "left" : "right";
                    factor = (i % 2 == 0 && info.tree.children.length > 2) ? -1 : 0;
                }
                right = x + this._findOffset(layout, shape, info, type);
                child = layout.diagram.nameTable[info.tree.children[i]];
                width = child.width ? child.width : child._width;
                height = child.height ? child.height : child._height;
                childWidth = h ? height : width;
                childHeight = h ? width : height;
                //Update sub tree
                childBounds = this._updateTree(layout, right + factor * childWidth, bottom, child, level + 1, undefined, true);
                childInfo = layout._graphNodes[child.name];
                actBounds = { x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth, bottom: childInfo.y + childHeight };
                if (i == 0) {
                    this._uniteRects(childBounds, actBounds);
                    bounds = childBounds;
                }
                else
                    this._uniteRects(bounds, childBounds);
                //Check and adjust the space left from previous subtree/sibling
                if (childInfo.prevBounds && !(info.tree.type == "alternate" && i % 2 == 1 && info.tree.children.length > 2)) {
                    canMoveBy = canMoveBy !== undefined ? Math.min(childInfo.canMoveBy, canMoveBy) : childInfo.canMoveBy;
                }
                //Max level of the subtree node
                info.maxLevel = Math.max(info.maxLevel || 0, childInfo.maxLevel || 0);
                if (!(info.tree.type == "alternate" && info.tree.children.length > 2 && i % 2 == 0)) {
                    if (info.tree.type == "alternate" && info.tree.children.length > 2)
                        //alternate - arrange children with even index(0,2,4,6,..) at the next level
                        bottom = Math.max(childBounds.bottom, prevBounds.bottom) + layout.verticalSpacing / 2;
                    else
                        // left/right - arrange next child at the nect level(bottom)
                        bottom = childBounds.bottom + layout.verticalSpacing / 2;
                    level = info.maxLevel;
                    levels.push({ rBounds: actBounds });
                    if (!evenBounds) evenBounds = { x: childInfo.x, y: childInfo.y, right: childInfo.x + childWidth, bottom: childInfo.y + childHeight };
                    else this._uniteRects(evenBounds, actBounds);
                    if (childInfo.levelBounds) levels = levels.concat(childInfo.levelBounds);
                }
                else {
                    if (i != 0) bottom = prevBounds.bottom + layout.verticalSpacing / 2;
                    oddLevels.push({ rBounds: actBounds });
                    if (childInfo.levelBounds) oddLevels = oddLevels.concat(childInfo.levelBounds);
                }
                if (i == 0) info.firstChild = { x: childInfo.x, canMoveBy: childInfo.canMoveBy, child: child.name };
                if (this._hasChild(layout, child)) {
                    if (!info.firstChild || info.firstChild.x >= childInfo.firstChild.x) {
                        if (childInfo.firstChild && info.firstChild.canMoveBy < childInfo.canMoveBy) {
                            var canMoveBy = info.firstChild.canMoveBy;
                            childInfo.canMoveBy = canMoveBy;
                            layout._graphNodes[info.firstChild.child].canMoveBy = canMoveBy;
                            info.firstChild.canMoveBy = canMoveBy;
                        }
                        info.firstChild = { x: childInfo.firstChild.x, canMoveBy: canMoveBy !== undefined ? canMoveBy : childInfo.canMoveBy, child: child.name }
                    }
                    else if (childInfo.firstChild && childInfo.translated && info.firstChild.canMoveBy > childInfo.canMoveBy) {
                        info.firstChild.canMoveBy = layout._graphNodes[info.firstChild.child].canMoveBy = childInfo.canMoveBy;
                    }
                }
                prevBounds = actBounds;
            }
            //To set level bounds(right most position of levels)
            if (!dontupdate) {
                if (info.tree.type == "alternate" && info.tree.children.length > 2) {
                    oddBounds = { x: oddLevels[0].rBounds.x, y: oddLevels[0].rBounds.y, right: oddLevels[oddLevels.length - 1].rBounds.right, bottom: oddLevels[oddLevels.length - 1].rBounds.bottom };
                    intersect = this._findIntersectingLevels(layout, oddBounds, lev + 1);
                    this._updateRearBounds(layout, null, oddLevels, lev + 1, intersect);
                }
                intersect = this._findIntersectingLevels(layout, evenBounds || bounds, lev + 1);
                this._updateRearBounds(layout, null, evenBounds ? levels : [{ rBounds: bounds }], lev + 1, intersect);
            }
            else info.levelBounds = levels;
            if (!isNaN(canMoveBy))
                layout._graphNodes[firstChild.name].canMoveBy = canMoveBy;
            info.childBounds = bounds;
            info.mid = x;
            return bounds;
        },
        _splitChildrenInRows: function (layout, shape) {
            var info = layout._graphNodes[shape.name];
            var column = 4;
            var rows = [];
            var childNodes = info.tree.children.length;
            var children = $.extend([], true, info.tree.children);
            if (info.tree.rows) {
                var count = info.tree.children.length;
                var columns = Math.ceil(count / info.tree.rows);
                if (columns % 2 == 0)
                    column = columns;
                else {
                    column = columns + 1;
                }
            }
            else if (info.tree.children.length == 3 || info.tree.children.length == 4)
                column = 2;
            else if (info.tree.children.length == 5) {
                column = 3;
            }
            while (childNodes > 0) {
                rows[rows.length] = children.splice(0, column);
                childNodes -= column;
                if (childNodes < column) {
                    column = childNodes;
                }
            }
            return rows;
        },
        _findOffset: function (layout, shape, info, type) {
            var offset = 0;
            var space = (layout.orientation == "lefttoright" || layout.orientation == "righttoleft") ? shape.height ? shape.height : shape._height : shape.width ? shape.width : shape._width;
            var ch = type ? type : info.tree.type;
            offset = info.tree.offset || (info.tree.offset === 0 ? 0 : 20);
            if (info.tree.type == "alternate")
                if (offset >= layout.horizontalSpacing) offset = layout.horizontalSpacing / 2;
            switch (ch) {
                case "left":
                    offset = space / 2 - offset;
                    break;
                case "right":
                    offset = offset + space / 2;
                    break;
            }
            return offset;
        },
        _translateSiblings: function (layout, shape, child) {
            var i, childInfo, info, diff;
            info = layout._graphNodes[shape.name];
            diff = layout._graphNodes[child.name].diff - layout._graphNodes[child.name].canMoveBy;
            for (i = 0; i < info.tree.children.length; i++) {
                if (child.name == info.tree.children[i])
                    break;
                childInfo = layout._graphNodes[info.tree.children[i]];
                childInfo.x += diff;
            }
        },
        _uniteRects: function (rect1, rect2) {
            //Unite two rects
            rect1.x = Math.min(rect1.x, rect2.x);
            rect1.right = Math.max(rect1.right, rect2.right);
            rect1.bottom = Math.max(rect1.bottom, rect2.bottom);
        },
        _spaceLeftFromPrevSubTree: function (layout, shape, bounds) {
            var info = layout._graphNodes[shape.name];
            var dif, prevBounds, intersect, k;
            var space = layout.horizontalSpacing;
            //Find the minimum distance to move towards previous sub tree
            for (k = 0; k < info.intersect.length; k++) {
                prevBounds = layout.levels[info.intersect[k]].rBounds;
                dif = bounds.x - (prevBounds.right + space);
                if (info.diff == undefined || dif < info.diff) {
                    info.diff = dif;
                    info.prevBounds = layout.levels[info.intersect[k]];
                }
            }
        },
        _findIntersectingLevels: function (layout, bounds, level, actualLevel) {
            //intersecting with exact Level
            var bnds = { x: bounds.x, y: bounds.y, right: bounds.right, bottom: bounds.bottom };
            bnds.y -= layout.verticalSpacing / 2;
            bnds.bottom += layout.verticalSpacing / 2;
            var intersectingLevels = [];
            var rBounds;
            var l = actualLevel !== undefined ? actualLevel : level;
            rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            //Performance - We can consider only the intersecting levels
            do {
                if (rBounds && ((bnds.y < rBounds.y && bnds.bottom > rBounds.y) || (bnds.y < rBounds.bottom && rBounds.bottom < bnds.bottom) ||
                    bnds.y >= rBounds.y && bnds.bottom <= rBounds.bottom || bnds.y < rBounds.y && bnds.bottom > rBounds.bottom)) {
                    intersectingLevels.splice(0, 0, l);
                }
                else if (rBounds && rBounds.bottom < bnds.y) break;
                l--;
                rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            } while (l >= 0);
            l = (actualLevel !== undefined ? actualLevel : level) + 1;
            rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            do {
                if (rBounds && ((bnds.y < rBounds.y && bnds.bottom > rBounds.y) || (bnds.y < rBounds.bottom && rBounds.bottom < bnds.bottom) ||
                    bnds.y >= rBounds.y && bnds.bottom <= rBounds.bottom || bnds.y < rBounds.y && bnds.bottom > rBounds.bottom)) {
                    intersectingLevels.push(l);
                }
                else if (rBounds && rBounds.y > bnds.bottom) break;
                l++;
                rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            } while (l <= layout.levels.length);
            return intersectingLevels;
        },
        _findLevel: function (layout, bounds, level) {
            var bnds = bounds;
            var l = 0;
            var rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            while (l < layout.levels.length) {
                if (rBounds && bnds.bottom < rBounds.y) {
                    return l;
                }
                else l++;
                rBounds = layout.levels[l] ? layout.levels[l].rBounds : null;
            }
            return l;
        },
        _updateEdges: function (layout, node, depth) {
            var layoutInfo = layout._graphNodes[node.name];
            if (node.outEdges && node.outEdges.length && node.isExpanded) {
                for (var j = 0; j < node.outEdges.length; j++) {
                    var edge = layout.diagram.nameTable[layout.diagram.nameTable[node.outEdges[j]].targetNode];
                    if (!edge.excludeFromLayout) {
                        if (!ej.datavisualization.Diagram.Util._collectionContains(edge.name, layoutInfo.tree.children)) {
                            layoutInfo.tree.children.push(edge.name);
                        }
                        if (edge.outEdges && edge.outEdges.length && edge.isExpanded) {
                            layoutInfo.tree.hasSubTree = true;
                        }
                        this._updateEdges(layout, edge, depth + 1);
                    }
                }
            }
            //set level info
            layoutInfo.tree.level = depth;
            //By default, orientation is horizontal for nested trees
            if (layoutInfo.tree.hasSubTree) layoutInfo.tree.orientation = "horizontal";
            //Customizing assistants and children collection
            //Performance-Instead of reading the method everytime, we can set once and can reuse that
            if (layout.getLayoutInfo && layout.type == "organizationalchart") {
                layout.getLayoutInfo(layout.diagram, node, layoutInfo.tree);
                if (layoutInfo.tree.type == "balanced" && layoutInfo.tree.hasSubTree) { layoutInfo.tree.type = "center"; layoutInfo.tree.orientation = "horizontal" }
            }
            if (layout.level && layoutInfo.tree.type != "alternate" && depth >= layout.level)
                layoutInfo.tree.hasSubTree = false;
        },
        _updateAnchor: function (layout, bounds) {
            var node, viewPort, fixedNode, width, height, mod;
            //Update anchor based on viewport
            layout.diagram.viewPort = viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(layout.diagram, true);
            viewPort.x = 0; viewPort.y = 0;
            var layoutbounds = layout.bounds ? layout.bounds : viewPort;
            var orientation = layout.diagram._layoutOrientation();
            if (orientation == "toptobottom" || orientation == "bottomtotop") {
                switch (layout.horizontalAlignment) {
                    case "left":
                        layout._anchorX = (layoutbounds.x - bounds.x) + layout.margin.left;
                        break;
                    case "right":
                        layout._anchorX = layoutbounds.x + layoutbounds.width - layout.margin.right - bounds.right;
                        break;
                    case "center":
                        layout._anchorX = layoutbounds.x + layoutbounds.width / 2 - (bounds.x + bounds.right) / 2;
                        break;
                }
                switch (layout.verticalAlignment) {
                    case "top":
                        var top = layoutbounds.y + layout.margin.top;
                        layout._anchorY = orientation == "toptobottom" ? top : bounds.bottom + top;
                        break;
                    case "bottom":
                        var bottom = layoutbounds.y + layoutbounds.height - layout.margin.bottom;
                        layout._anchorY = orientation == "toptobottom" ? bottom - bounds.bottom : bottom;
                        break;
                    case "center":
                        var center = layoutbounds.y + layoutbounds.height / 2;
                        layout._anchorY = layout.orientation == "toptobottom" ? center - (bounds.y + bounds.bottom) / 2 : center + (bounds.y + bounds.bottom) / 2;
                        break;
                }
            }
            else if (orientation == "lefttoright" || orientation == "righttoleft") {
                switch (layout.horizontalAlignment) {
                    case "left":
                        var left = layoutbounds.x + layout.margin.left;
                        layout._anchorX = orientation == "lefttoright" ? left : bounds.bottom + left;
                        break;
                    case "right":
                        var right = layoutbounds.x + layoutbounds.width - layout.margin.right;
                        layout._anchorX = orientation == "lefttoright" ? right - bounds.bottom : right;
                        break;
                    case "center":
                        var center = layoutbounds.width / 2 + layoutbounds.x;
                        layout._anchorX = layout.orientation == "lefttoright" ? center - (bounds.y + bounds.bottom) / 2 : center + (bounds.y + bounds.bottom) / 2;
                        break;
                }
                switch (layout.verticalAlignment) {
                    case "top":
                        layout._anchorY = layoutbounds.y + layout.margin.top - bounds.x;
                        break;
                    case "center":
                        layout._anchorY = layoutbounds.y + layoutbounds.height / 2 - (bounds.right + bounds.x) / 2;
                        break;
                    case "bottom":
                        layout._anchorY = layoutbounds.y + layoutbounds.height - layout.margin.bottom - bounds.right;
                        break;
                }
            }
            //Anchor based on fixed nodes
            if (layout.fixedNode) {
                fixedNode = layout.diagram.nameTable[layout.fixedNode];
                width = fixedNode.width ? fixedNode.width : fixedNode._width;
                height = fixedNode.height ? fixedNode.height : fixedNode._height;
                layout._anchorX = fixedNode.offsetX;
                layout._anchorY = fixedNode.offsetY;
                layout._anchorX += layout.orientation == "righttoleft" ? width * fixedNode.pivot.x : -width * fixedNode.pivot.x;
                layout._anchorY += layout.orientation == "bottomtotop" ? height * fixedNode.pivot.y : -height * fixedNode.pivot.y;
                node = fixedNode, mod = 0;
                while (node.inEdges.length) {
                    node = this._getParentNode(layout, node);
                    mod += layout._graphNodes[node.name].subTreeTranslation || 0;
                }
                if (layout.orientation == "lefttoright" || layout.orientation == "righttoleft") {
                    layout._anchorX -= layout._graphNodes[fixedNode.name].y;
                    layout._anchorY -= layout._graphNodes[fixedNode.name].x + mod;
                } else {
                    layout._anchorX -= layout._graphNodes[fixedNode.name].x + mod;
                    layout._anchorY -= layout._graphNodes[fixedNode.name].y;
                }
            }
        },
        _updateConnectors: function (layout, node, level) {
            var i, conn, target, info, direction, offsetDir, segments;
            var nodeWidth = 0, nodeHeight = 0, targetWidth = 0, targetHeight = 0, length = 0, offsetLen = 0;
            //Route out edges
            info = layout._graphNodes[node.name];
            if (node.outEdges.length) {
                for (i = 0; i < node.outEdges.length; i++) {
                    conn = layout.diagram.nameTable[node.outEdges[i]];
                    target = layout.diagram.nameTable[conn.targetNode];
                    if (conn.visible && !conn._visited) {
                        conn._visited = true;
                        if (layout.getConnectorSegments) {
                            segments = layout.getConnectorSegments(layout.diagram, conn);
                        }
                        else {
                            if (info && info.tree.children.indexOf(conn.targetNode) != -1) {
                                var nwidth = node.width ? node.width : node._width;
                                var nheight = node.height ? node.height : node._height;
                                var twidth = target.width ? target.width : target._width;
                                var theight = target.height ? target.height : target._height;
                                if (layout.type == "organizationalchart") {
                                    if (layout.orientation == "toptobottom" || layout.orientation == "bottomtotop") {
                                        //Connector routing - vertical layouts
                                        nodeHeight = layout.orientation == "toptobottom" ? nheight : -nheight;
                                        targetHeight = layout.orientation == "toptobottom" ? -theight : theight;
                                        direction = layout.orientation == "toptobottom" ? "bottom" : "top";
                                        if (info.tree.assistants.length) {
                                            //Route inedge of child node, if the parent has assistants
                                            length = Math.abs((target.offsetY + targetHeight / 2) - (node.offsetY + nodeHeight / 2)) - layout.verticalSpacing / 2;
                                            segments = [{ type: "orthogonal", length: length, direction: direction }];
                                        }
                                        else {
                                            //Route inedge of child node
                                            if (info.tree.orientation == "horizontal" && (conn.segments.length == 1 || info.tree.type == "balanced")) {
                                                if (info.tree.type == "balanced") {
                                                    if (info.tree.children.length == 5 && i > 2) {
                                                        var relative = info.tree.children[1];
                                                        if (isNaN(layout._graphNodes[relative]._treeWidth)) layout._graphNodes[relative]._treeWidth = layout.diagram.nameTable[relative].width;
                                                        if (i == 3)
                                                            var center = layout.diagram.nameTable[relative].offsetX - layout._graphNodes[relative]._treeWidth / 2 - layout.horizontalSpacing / 2;
                                                        else
                                                            var center = layout.diagram.nameTable[relative].offsetX + layout._graphNodes[relative]._treeWidth / 2 + layout.horizontalSpacing / 2;
                                                        segments = [
                                                        { type: "orthogonal", length: layout.verticalSpacing / 2, direction: "bottom" },
                                                        {
                                                            type: "orthogonal", length: node.offsetX - center, direction: "left"
                                                        }, {
                                                            type: "orthogonal", length: target.offsetY + targetHeight / 2 - (node.offsetY + nodeHeight / 2) - layout.verticalSpacing, direction: "bottom"
                                                        }
                                                        ];
                                                    }
                                                    else {
                                                        var spacing = Math.min(30, layout.verticalSpacing / 2) * (direction == "bottom" ? 1 : -1);
                                                        length = Math.abs(target.offsetY + (targetHeight * target.pivot.y) - spacing - (node.offsetY + nodeHeight * (1 - target.pivot.y)));
                                                        segments = [{ type: "orthogonal", length: length, direction: direction }];
                                                    }
                                                }
                                                else
                                                    layout.diagram._dock(conn, layout.diagram.nameTable);
                                            }
                                            else {
                                                if (info.tree.orientation == "horizontal") {
                                                    segments = [{ type: "orthogonal" }];
                                                }
                                                else {
                                                    if (info.tree.enableRouting) {
                                                        length = Math.abs(target.offsetY - (node.offsetY + nodeHeight / 2));
                                                        segments = [{ type: "orthogonal", length: length, direction: direction }];
                                                        if (info.tree.offset < 5) {
                                                            offsetDir = info.tree.type == "left" ? "right" : "left";
                                                            length = layout.verticalSpacing / 4;
                                                            offsetLen = Math.abs(info.tree.offset) + layout.horizontalSpacing / 2;
                                                            segments = [{ type: "orthogonal", length: length, direction: direction },
                                                             { type: "orthogonal", length: offsetLen, direction: offsetDir }];
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        //Connector routing - Horizontal layout orientation
                                        nodeWidth = layout.orientation == "lefttoright" ? nwidth : -nwidth;
                                        targetWidth = layout.orientation == "lefttoright" ? -twidth : twidth;
                                        direction = layout.orientation == "lefttoright" ? "right" : "left";
                                        if (info.tree.assistants.length) {
                                            //Route inedge of child node, if the parent has assistants
                                            length = Math.abs((target.offsetX + targetWidth / 2) - (node.offsetX + nodeWidth / 2)) - layout.verticalSpacing / 2;
                                            segments = [{ type: "orthogonal", length: length, direction: direction }];
                                        }
                                        else {
                                            //Route inedge of child node
                                            if (info.tree.orientation == "horizontal" && (conn.segments.length == 1 || info.tree.type == "balanced")) {
                                                if (info.tree.type == "balanced") {
                                                    if (info.tree.children.length == 5 && i > 2) {
                                                        var relative = info.tree.children[1];
                                                        if (isNaN(layout._graphNodes[relative]._treeWidth)) layout._graphNodes[relative]._treeWidth = layout.diagram.nameTable[relative].width;
                                                        if (i == 3)
                                                            var center = layout.diagram.nameTable[relative].offsetY - layout._graphNodes[relative]._treeWidth / 2 - layout.verticalSpacing / 2;
                                                        else
                                                            var center = layout.diagram.nameTable[relative].offsetY + layout._graphNodes[relative]._treeWidth / 2 + layout.verticalSpacing / 2;
                                                        segments = [
                                                        { type: "orthogonal", length: layout.horizontalSpacing / 2, direction: "right" },
                                                        {
                                                            type: "orthogonal", length: node.offsetY - center, direction: "top"
                                                        }, {
                                                            type: "orthogonal", length: target.offsetX + targetWidth / 2 - (node.offsetX + nodeWidth / 2) - layout.horizontalSpacing, direction: "right"
                                                        }
                                                        ];
                                                    }
                                                    else {
                                                        var spacing = Math.min(30, layout.horizontalSpacing / 2) * (direction == "right" ? 1 : -1);
                                                        length = Math.abs(target.offsetX + (targetWidth * target.pivot.x) - spacing - (node.offsetX + nodeWidth * (1 - target.pivot.x)));
                                                        segments = [{ type: "orthogonal", length: length, direction: direction }];
                                                    }
                                                }
                                                else {
                                                    layout.diagram._dock(conn, layout.diagram.nameTable);
                                                }
                                            }
                                            else {
                                                if (info.tree.orientation == "horizontal") {
                                                    segments = [{ type: "orthogonal" }];
                                                }
                                                else {
                                                    length = Math.abs(target.offsetX - (node.offsetX + nodeWidth / 2));
                                                    segments = [{ type: "orthogonal", length: length, direction: direction }];
                                                    if (info.tree.offset < 5) {
                                                        offsetDir = info.tree.type == "left" ? "bottom" : "top";
                                                        length = layout.verticalSpacing / 4;
                                                        offsetLen = Math.abs(info.tree.offset) + 10;
                                                        segments = [{ type: "orthogonal", length: length, direction: direction },
                                                         { type: "orthogonal", length: offsetLen, direction: offsetDir }];
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (segments)
                            layout.diagram.updateConnector(conn.name, { segments: segments });
                        else layout.diagram._dock(conn, layout.diagram.nameTable);
                        if (layout.diagram._svg)
                            ej.datavisualization.Diagram.DiagramContext.update(conn, layout.diagram);
                        if (target && !target.excludeFromLayout && (target.isExpanded || this._hasChild(layout, target)))
                            this._updateConnectors(layout, target, level + 1);
                    }
                }
            }
            if (info && info.tree.assistants.length) {
                //In-Edge routing of assistant nodes
                for (i = 0; i < info.tree.assistants.length; i++) {
                    target = layout.diagram.nameTable[info.tree.assistants[i]];
                    conn = layout.diagram.nameTable[target.inEdges[0]];
                    length = Math.abs(target.offsetY - (node.offsetY + nodeHeight / 2));
                    segments = [{ type: "orthogonal", length: length, direction: direction }];
                    if (segments) { layout.diagram.updateConnector(conn.name, { segments: segments }); }
                    if (layout.diagram._svg)
                        ej.datavisualization.Diagram.DiagramContext.update(conn, layout.diagram);
                    if (target.isExpanded || this._hasChild(layout, target))
                        this._updateConnectors(layout, target, level + 1);
                }
            }
        },
        _updateNodes: function (layout, node, mod, update, dx, dy) {
            var child, i;
            node._visited = true;
            var width = node.width ? node.width : node._width;
            var height = node.height ? node.height : node._height;
            var offsetX = node.offsetX;
            var offsetY = node.offsetY;
            if (!node.excludeFromLayout) {
                offsetX = layout._anchorX;
                offsetY = layout._anchorY;
                //Performance - instead of checking conditions for every node, we can make the layout related conditions once and we can reuse them
                if (layout.orientation == "lefttoright") {
                    offsetX += layout._graphNodes[node.name].y + width / 2;
                    offsetY += layout._graphNodes[node.name].x + mod + height / 2;
                }
                else if (layout.orientation == "righttoleft") {
                    offsetX -= layout._graphNodes[node.name].y + width / 2;
                    offsetY += layout._graphNodes[node.name].x + mod + height / 2;
                }
                else if (layout.orientation == "toptobottom") {
                    offsetX += layout._graphNodes[node.name].x + mod + width / 2;
                    offsetY += layout._graphNodes[node.name].y + height / 2;
                }
                else {
                    offsetX += layout._graphNodes[node.name].x + mod + width / 2;
                    offsetY -= layout._graphNodes[node.name].y + height / 2;
                }
                if (layout._graphNodes) {
                    var updNode = layout._graphNodes[node.name]
                    if (updNode) {
                        var upnodeTree = updNode.tree;
                        if (!upnodeTree.enableRouting) {
                            if (!layout.diagram.minSpaceBetweenNode)
                                layout.diagram.minSpaceBetweenNode = []
                            layout.diagram.minSpaceBetweenNode.push(node.name);
                        }
                    }
                }
                dx = dx ? dx : 0;
                dy = dy ? dy : 0;
                offsetX += dx;
                offsetY += dy;
                if (!layout.updateView) {
                    update = (node.name == layout.fixedNode) || update;
                    if (!update && this._withinView(offsetX, offsetY, width, height, node, layout)) {
                        if (offsetX != node.offsetX || offsetY != node.offsetY)
                            layout.objects.push({
                                object: node.name, diff: offsetX - node.offsetX, diffy: offsetY - node.offsetY
                            });
                    } else
                        layout.diagram._translate(node, offsetX - (node.offsetX || 0), offsetY - (node.offsetY || 0), layout.diagram.nameTable);
                }
                else
                    layout.diagram._translate(node, offsetX - (node.offsetX || 0), offsetY - (node.offsetY || 0), layout.diagram.nameTable);
            }
            var list = [];
            if (this._hasChild(layout, node)) {
                for (i = 0; i < layout._graphNodes[node.name].tree.children.length; i++) {
                    child = layout.diagram.nameTable[layout._graphNodes[node.name].tree.children[i]];
                    this._updateNodes(layout, child, mod + (layout._graphNodes[node.name].subTreeTranslation || 0), update, dx, dy);
                    list.push(child);
                }
            }
            //this._updateChildTreePosition(layout, list);
            if (layout._graphNodes[node.name].tree.assistants.length) {
                for (i = 0; i < layout._graphNodes[node.name].tree.assistants.length; i++) {
                    child = layout.diagram.nameTable[layout._graphNodes[node.name].tree.assistants[i]];
                    this._updateNodes(layout, child, mod + (layout._graphNodes[node.name].subTreeTranslation || 0), null, dx, dy);
                }
            }
            layout.diagram._updateQuad(layout.diagram.nameTable[node.name]);
            layout.diagram._setBounds(node);
            if (layout.diagram._svg)
                ej.datavisualization.Diagram.DiagramContext.update(node, layout.diagram);
        },
        _withinView: function (newoffsetX, newoffsetY, width, height, node, layout) {
            var left = layout.diagram.model.scrollSettings.horizontalOffset / layout.diagram.model.scrollSettings.currentZoom;
            var top = layout.diagram.model.scrollSettings.verticalOffset / layout.diagram.model.scrollSettings.currentZoom;
            var right = layout.diagram.model.scrollSettings.viewPortWidth / layout.diagram.model.scrollSettings.currentZoom + left;
            var bottom = layout.diagram.model.scrollSettings.viewPortHeight / layout.diagram.model.scrollSettings.currentZoom + top;
            if ((newoffsetX + width / 2 > left || node.offsetX + width / 2 > left) && (newoffsetX - width / 2 < right || node.offsetX - width / 2 < right) &&
            (newoffsetY + height / 2 > top || node.offsetY + height / 2 > top) && (newoffsetY - height / 2 < bottom || node.offsetY - height / 2 < bottom)) {
                return true;
            }
            return false;
        },
        _getDimensions: function (layout, shape, x, y, level) {
            var width = shape.width ? shape.width : shape._width;
            var height = shape.height ? shape.height : shape._height;
            if (layout.orientation == "lefttoright" || layout.orientation == "righttoleft") {
                if (!level) {
                    var temp = x;
                    x = y;
                    y = temp;
                }
                height = shape.width ? shape.width : shape._width;
                width = shape.height ? shape.height : shape._height;
            }
            return { x: x, y: y, width: width, height: height };
        },
        _getParentNode: function (layout, node) {
            //Return the first parent node
            if (node.inEdges && node.inEdges.length) {
                return layout.diagram.nameTable[layout.diagram.nameTable[node.inEdges[0]].sourceNode];
            }
        },
        _hasChild: function (layout, shape) {
            //Check whether the node has children
            var shape = layout._graphNodes[shape.name];
            return shape.tree.children && shape.tree.children.length;
        },
        _setUpLayoutInfo: function (layout, item) {
            //Initialize graph node info
            var info = {};
            info.subTreeTranslation = 0;
            if (layout.type == "organizationalchart")
                info.tree = { orientation: "vertical", type: "alternate", offset: 20, enableRouting: true };
            else if (layout.type == "hierarchicaltree")
                info.tree = { orientation: "horizontal", type: "center", enableRouting: true };
            info.tree.children = [];
            info.tree.assistants = [];
            info.tree.level = 0;
            info.translate = true;
            return info;
        }
    };
    //end region
    //region Radialtree layout
    ej.datavisualization.Diagram.RadialTreeLayout = {
        doLayout: function (layout) {
            var diagram, nodes, node;
            diagram = layout.diagram;
            nodes = diagram.nodes();
            for (var i = 0; i < nodes.length; i++) {
                if (!nodes[i].excludeFromLayout) {
                    layout._graphNodes[nodes[i].name] = this._setUpLayoutInfo(layout, nodes[i]);
                    if (!nodes[i].inEdges || !nodes[i].inEdges.length) { layout._firstLevelNodes.push(nodes[i]); }
                }
            }
            if (layout.rootNode && diagram.nameTable[layout.rootNode])
                layout._centerNode = diagram.nameTable[layout.rootNode];
            else if (layout._firstLevelNodes.length) {
                layout._centerNode = layout._firstLevelNodes[0];
                diagram.model.layout.rootNode = layout._centerNode.name;
            }
            if (layout._centerNode) {
                this._updateEdges(layout, layout._centerNode, 0);
                this._depthFirstAllignment(layout, layout._centerNode, 0, 0);
                this._populateLevels(layout);
                this._transformToCircleLayout(layout);
                this._updateAnchor(layout);
                this._updateNodes(layout, layout._centerNode)
            }
        },
        _updateEdges: function (layout, node, depth) {
            var nodeInfo = layout._graphNodes[node.name];
            layout.layoutNodes.push(nodeInfo);
            nodeInfo.level = depth;
            nodeInfo.visited = true;
            layout.maxLevel = Math.max(layout.maxLevel, depth);
            for (var j = 0; j < node.outEdges.length; j++) {
                var edge = layout.diagram.nameTable[layout.diagram.nameTable[node.outEdges[j]].targetNode];
                if (!edge.excludeFromLayout && !edge.visited) {
                    nodeInfo.children.push(edge);
                    this._updateEdges(layout, edge, depth + 1);
                }
            }
        },
        _depthFirstAllignment: function (layout, node, x, y) {
            if (node) {
                var newValue;
                var nodeInfo = layout._graphNodes[node.name];
                if (nodeInfo.children.length) {
                    y += 300;
                    for (var i = 0; i < nodeInfo.children.length; i++) {
                        newValue = this._depthFirstAllignment(layout, nodeInfo.children[i], x, y);
                        x = newValue.x; y = newValue.y;
                    }
                    nodeInfo.children = nodeInfo.children.sort(function (obj1, obj2) { return layout._graphNodes[obj1.name].x - layout._graphNodes[obj2.name].x; });
                    var min = layout._graphNodes[nodeInfo.children[0].name].min;
                    var max = layout._graphNodes[nodeInfo.children[nodeInfo.children.length - 1].name].max;
                    nodeInfo.x = min + (max - min) / 2;
                    x = max + layout.horizontalSpacing;
                    nodeInfo.segmentOffset = max + layout.horizontalSpacing;
                    nodeInfo.x -= nodeInfo.width / 2;
                    nodeInfo.y -= nodeInfo.height / 2;
                    nodeInfo.min = min;
                    nodeInfo.max = max;
                    if (nodeInfo.x < min && nodeInfo.visited) {
                        nodeInfo.x = min;
                        x = nodeInfo.x + nodeInfo.width / 2 - (max - min) / 2;
                        nodeInfo.visited = false;
                        for (var i = 0; i < nodeInfo.children.length; i++) {
                            newValue = this._depthFirstAllignment(layout, nodeInfo.children[i], x, y);
                        }
                        nodeInfo.visited = true;
                        x = nodeInfo.x + nodeInfo.width + layout.horizontalSpacing;
                    }
                    max = layout._graphNodes[nodeInfo.children[nodeInfo.children.length - 1].name].segmentOffset;
                    x = x < max ? max : x;
                    y -= 300;
                    nodeInfo.y = y;
                }
                else {
                    nodeInfo.x = x;
                    nodeInfo.y = y;
                    nodeInfo.min = x;
                    nodeInfo.max = x + nodeInfo.width;
                    x += nodeInfo.width + layout.horizontalSpacing;
                }
                return { x: x, y: y };
            }
        },
        _populateLevels: function (layout) {
            var stages = [];
            var min = Math.min.apply(Math, layout.layoutNodes.map(function (nodeInfo) { return nodeInfo.x; }));
            var max = Math.max.apply(Math, layout.layoutNodes.map(function (nodeInfo) { return nodeInfo.x + nodeInfo.width + layout.horizontalSpacing; }));
            var full = max - min;
            layout.levels = [];
            for (var i = 0; i <= layout.maxLevel; i++) {
                stages = layout.layoutNodes.filter(function (nodeInfo) { if (nodeInfo.level == i) return nodeInfo; });
                var newlevel = {};
                stages = stages.sort(function (nodeInfo1, nodeInfo2) { return nodeInfo1.x - nodeInfo2.x; });
                newlevel.min = stages[0].x;
                newlevel.max = stages[stages.length - 1].x + stages[stages.length - 1].width + layout.horizontalSpacing;
                newlevel._actualCircumference = 0;
                newlevel.height = 0;
                for (var k = 0; k < stages.length; k++) {
                    if (stages[k].height > newlevel.height) newlevel.height = stages[k].height;
                    newlevel._actualCircumference += Math.max(stages[k].width, stages[k].height);
                    if (k != stages.length - 1) newlevel._actualCircumference += layout.horizontalSpacing;
                }
                newlevel.circumference = newlevel.max - newlevel.min;
                if (newlevel._actualCircumference < newlevel.circumference) newlevel.circumference = (newlevel.circumference + newlevel._actualCircumference) / 2;
                newlevel.radius = newlevel.circumference / (2 * Math.PI) + newlevel.height;
                newlevel.nodes = [];
                if (i > 1) {
                    if (layout.levels[i - 1].radius + layout.levels[i - 1].height >= newlevel.radius)
                        newlevel.radius = layout.levels[i - 1].radius + layout.levels[i - 1].height;
                }
                for (var j = 0; j < stages.length; j++) {
                    stages[j].ratio = Math.abs(stages[j].x + stages[j].width / 2 - min) / full;
                    newlevel.nodes.push(stages[j]);
                }
                layout.levels.push(newlevel);
            }
        },
        _transformToCircleLayout: function (layout) {
            var root = layout._graphNodes[layout._centerNode.name];
            root.x = 0;
            root.y = 0;
            //root.x = -root.width;
            //root.y = -root.height;
            for (var i = 1; i < layout.levels.length; i++) {
                for (var j = 0; j < layout.levels[i].nodes.length; j++) {
                    var nodeInfo = layout.levels[i].nodes[j];
                    nodeInfo.x = Math.cos(nodeInfo.ratio * 360 * Math.PI / 180) * (layout.levels[i].radius + layout.verticalSpacing * i);
                    nodeInfo.y = Math.sin(nodeInfo.ratio * 360 * Math.PI / 180) * (layout.levels[i].radius + layout.verticalSpacing * i);
                    //nodeInfo.x -= nodeInfo.width / 2;
                    //nodeInfo.y -= nodeInfo.height / 2;
                    layout._anchorX = Math.min(layout._anchorX, nodeInfo.x);
                    layout._anchorY = Math.min(layout._anchorY, nodeInfo.y);
                }
            }
        },
        _updateAnchor: function (layout) {
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(layout.diagram);
            if (layout._centerNode) {
                layout._anchorX = layout._centerNode.offsetX || viewPort.width / 2;
                layout._anchorY = layout._centerNode.offsetY || viewPort.height / 2;
            }
            else {
                layout._anchorX = viewPort.width / 2;
                layout._anchorY = viewPort.height / 2;
            }
        },
        _updateNodes: function (layout, node) {
            var nodeInfo = layout._graphNodes[node.name];
            var offsetX = nodeInfo.x + layout._anchorX;
            var offsetY = nodeInfo.y + layout._anchorY;
            layout.diagram._translate(node, offsetX - node.offsetX || 0, offsetY - node.offsetY || 0, layout.diagram.nameTable);
            for (var i = 0; i < nodeInfo.children.length; i++) {
                var childInfo = nodeInfo.children[i];
                this._updateNodes(layout, layout.diagram.nameTable[childInfo.name]);
            }
            if (layout.diagram._svg)
                ej.datavisualization.Diagram.DiagramContext.update(node, layout.diagram);
        },
        _isValidLayout: function (layout) {
            if (layout._centerNode) {
                var maxParents = Math.max.apply(Math, layout.diagram.nodes().map(function (obj) { return obj.inEdges.length; }));
                if (maxParents < 2) return true;
            }
            return false;
        },
        _setUpLayoutInfo: function (layout, item) {
            var info = {};
            info.name = item.name;
            info.x = 0;
            info.y = 0;
            info.min = 0;
            info.max = 0;
            info.width = item.width ? item.width : item._width;
            info.height = item.height ? item.height : item._height;
            info.children = [];
            info.level = 0;
            info.ratio = 0;
            info.visited = false;
            return info;
        },
    };
    //region Multi Parent Hierarchical Layout
    ej.datavisualization.Diagram.MultipleParentHierarchicalLayout = {
        doLayout: function (layout) {
            this.diagram = layout.diagram;
            var dnodes = this.diagram.nodes();
            this.nodes = [];
            var filledVertexSet = {};
            var distributeLine = new ej.datavisualization.Diagram.LineDistribution(this);
            distributeLine.edgeMapper = [];
            for (var i = 0; i < dnodes.length; i++) {
                var node = this._createVertex(dnodes[i], dnodes[i].name, 0, 0, dnodes[i].width, dnodes[i].height);

                var outEdges = dnodes[i].outEdges.slice();
                for (var j = 0; j < outEdges.length; j++) {
                    var outEdge = layout.diagram.nameTable[outEdges[j]];
                    distributeLine._setEdgeMapper({ key: outEdge, value: [] });
                }

                this.nodes.push(node);
                filledVertexSet[node.name] = node;
            }
            var hierarchyVertices = [];
            if (this.roots == null && parent != null) {
                var candidateRoots = this._findRoots(filledVertexSet, layout);
                for (var i = 0; i < candidateRoots.length; i++) {
                    var vertexSet = Object();
                    hierarchyVertices.push(vertexSet);
                    this._traverse(candidateRoots[i], true, null, vertexSet, hierarchyVertices, filledVertexSet);
                }
            }
            var limit = { marginX: 0, marginY: 0 };
            var matrixModel;
            for (var i = 0; i < hierarchyVertices.length; i++) {
                var vertexSet = hierarchyVertices[i];
                var tmp = [];
                for (var key in vertexSet) {
                    tmp.push(vertexSet[key]);
                }
                var model = new ej.datavisualization.Diagram.MultiParentModel(this, tmp, candidateRoots, layout);
                this._cycleStage(model);
                this._layeringStage(model, candidateRoots);
                this._crossingStage(model);

                // New implementation for placing elements
                var matrixModel = new ej.datavisualization.Diagram.MatrixModel({ model: model, matrix: [], rowOffset: [] });
                distributeLine._arrangeElements(matrixModel);

                //limit = this._placementStage(model, limit.marginX, limit.marginY, parent);
            }
            var modelBounds = this._getModelBounds(this.nodes);
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(layout.diagram, true);
            var trnsX = ((viewPort.width - modelBounds.width) / 2) - modelBounds.x;
            var trnsY = ((viewPort.height - modelBounds.height) / 2) - modelBounds.y;

            trnsX = Math.round(trnsX);
            trnsY = Math.round(trnsY);
            var margin = layout.margin || {};
            margin.left = margin.left || 0;
            margin.right = margin.right || 0;
            margin.top = margin.top || 0;
            margin.bottom = margin.bottom || 0;

            var isHorizontal = layout.orientation == "lefttoright"
                     || layout.orientation == "righttoleft";
            var inversespacing = !isHorizontal ? layout.verticalSpacing : layout.horizontalSpacing;
            var nodeWithMultiEdges = [];

            for (var i = 0; i < this.nodes.length; i++) {
                var clnode = this.nodes[i];
                if (clnode && !clnode.source && !clnode.target) {
                    var dnode = this.diagram.nameTable[clnode.name];
                    var dx = (clnode.geometry.x + (clnode.geometry.width / 2));
                    var dy = (clnode.geometry.y + (clnode.geometry.height / 2));
                    var x = dx, y = dy;
                    if (layout.orientation === "bottomtotop") {
                        y = modelBounds.height - dy;
                    }
                    else if (layout.orientation === "righttoleft") {
                        x = modelBounds.width - dx;
                    }
                    x += margin.left;
                    y += margin.top;
                    x += trnsX;
                    y += trnsY;
                    if (dnode != null)
                    {
                        this.diagram._translate(dnode, x - dnode.offsetX, y - dnode.offsetY, layout.diagram.nameTable);
                        if (!this.diagram._isInit)
                            ej.datavisualization.Diagram.DiagramContext.update(dnode, this.diagram);
                        if (clnode.inEdges.length > 0 || clnode.outEdges.length > 0)
                        {
                            nodeWithMultiEdges.push(dnode);
                        }
                    }
                }
            }
            var modifiedConnectors = [];
            var transModelBounds = new ej.datavisualization.Diagram.Rectangle(
                modelBounds.x + trnsX,
                modelBounds.y + trnsY,
                modelBounds.width,
                modelBounds.height);
            for (var i = 0 ; i < nodeWithMultiEdges.length; i++) {
                var node = nodeWithMultiEdges[i];
                if (node.outEdges != null && node.outEdges.length > 0) {
                    var count = node.outEdges.length;
                    for (var j = 0; j < count; j++) {
                        var internalConnector = layout.diagram.nameTable[node.outEdges[j]];
                        internalConnector._pointCollection = [];
                        if (count > 1) {
                            var segmentsize = inversespacing / 2.0;
                            var intermediatePoint = null;
                            var key;
                            var edgeMapper = distributeLine._getEdgeMapper();
                            for (var k = 0; k < edgeMapper.length; k++) {
                                if (edgeMapper[k].key == internalConnector) {
                                    key = k;
                                    break;
                                }
                            }
                            if (edgeMapper[key].value.length > 0) {
                                var edgePt = edgeMapper[key].value[0];
                                var dx1 = edgePt.x + margin.left;
                                var dy1 = edgePt.y + margin.top;
                                var x1 = dx1, y1 = dy1;
                                if (layout.orientation == "bottomtotop") {
                                    y1 = modelBounds.height - dy1;
                                }
                                else if (layout.orientation == "righttoleft") {
                                    x1 = modelBounds.width - dx1;
                                }

                                x1 += trnsX;
                                y1 += trnsY;

                                intermediatePoint = new ej.datavisualization.Diagram.Point(x1, y1);
                            }

                            var pts = [];
                            for (var p = 0 ; p < internalConnector.segments.length; p++) {
                                var pt = internalConnector.segments[p].points;
                                for (var temp in pt) {
                                        pts.push(pt[temp]);
                                }
                            }

                            pts = distributeLine._updateConnectorPoints(pts, segmentsize, intermediatePoint, transModelBounds);

                            for (p = 0; p < pts.length; p++) {
                                var pt = pts[p];

                                internalConnector._pointCollection.push(new ej.datavisualization.Diagram.Point(pt.x, pt.y));
                            }
                            distributeLine._resetConnectorPoints(internalConnector, layout.diagram);
                        }
                        modifiedConnectors.push(internalConnector);
                    }
                }

                if (node.inEdges != null && node.inEdges.length > 1) {
                    var count = node.inEdges.length;
                    var edgeMapper = distributeLine._getEdgeMapper();
                    for (var j = 0; j < count; j++) {
                        var internalConnector = layout.diagram.nameTable[node.inEdges[j]];
                        if (!distributeLine._containsValue(modifiedConnectors, internalConnector))  //!modifiedConnectors.Contains(internalConnector))
                        {
                            internalConnector._pointCollection = [];// new List<Syncfusion.Base.Diagram.Primitives.Point>();
                            //internalConnector.ResetPoints();
                        }

                        if (count > 1) {
                            var segmentsize = inversespacing / 2.0;
                            var intermediatePoint = null;
                            var key;
                            for (var k = 0; k < edgeMapper.length; k++) {
                                if (edgeMapper[k].key == internalConnector) {
                                    key = k;
                                    break;
                                }
                            }
                            if (edgeMapper[key].value.length > 0
                                && !distributeLine._containsValue(modifiedConnectors, internalConnector))  //!modifiedConnectors.Contains(internalConnector))
                            {                               
                                var edgePt = edgeMapper[k].value[0];
                                var dx1 = edgePt.x + margin.left;
                                var dy1 = edgePt.y + margin.top;
                                var x1 = dx1, y1 = dy1;
                                if (layout.orientation == "bottomtotop") {
                                    y1 = modelBounds.height - dy1;
                                }
                                else if (layout.orientation == "righttoleft") {
                                    x1 = modelBounds.width - dx1;
                                }

                                x1 += trnsX;
                                y1 += trnsY;
                                intermediatePoint = new ej.datavisualization.Diagram.Point(x1, y1);
                            }

                            var pts = [];// internalConnector.ToPoints(true).Reverse().ToList();
                            for (var p = 0 ; p < internalConnector.segments.length; p++) {
                                var pt = internalConnector.segments[p].points;
                                for (var temp in pt) {
                                    //if (temp == 0 || (temp > 0 && !(pt[temp - 1].x == pt[temp].x && pt[temp - 1].y == pt[temp].y)))
                                        pts.push(pt[temp]);
                                }
                            }
                            pts.reverse();
                            pts = distributeLine._updateConnectorPoints(pts, segmentsize, intermediatePoint, transModelBounds);
                            pts.reverse();
                            internalConnector._pointCollection = [];
                            for (p = 0; p < pts.length; p++) {
                                var pt = pts[p];
                                internalConnector._pointCollection.push(new ej.datavisualization.Diagram.Point(pt.x, pt.y));
                            }
                            //internalConnector.segments[0].points = internalConnector._points;
                            //layout.diagram.updateConnector(internalConnector.name, { segments: internalConnector.segments });
                            distributeLine._resetConnectorPoints(internalConnector, layout.diagram);
                        }
                    }
                }
            }
        },
        //get the bounds of the layout model
        _getModelBounds: function (lnodes) {
            lnodes = lnodes.slice();
            var rect = null, rect1 = null;
            for (var i = 0; i < lnodes.length; i++) {
                rect = lnodes[i].geometry;
                if (rect1) {
                    rect1 = ej.datavisualization.Diagram.Geometry.union(rect1, rect)
                }
                else
                    rect1 = rect;
            };
            return rect1;
        },
        _placementStage: function (model, marginX, marginY, parent) {
            var placementStage = this._coordinateAssignment(marginX, marginY, parent, model);
            placementStage.model = model;
            placementStage.widestRankValue = null;
            this._placementStageExecute(placementStage, parent);
            return { marginX: placementStage.marginX + model.layout.horizontalSpacing, marginY: placementStage.marginY + model.layout.verticalSpacing }///####
        },
        //calculate the largest size of the node either height or width depends upon the layoutorientation
        _calculateWidestRank: function (plalementChange, graph, model) {
            var isHorizontal = false;
            if (plalementChange.model.layout.orientation === "lefttoright" || plalementChange.model.layout.orientation === "righttoleft") {
                isHorizontal = true;
            }
            var offset = -plalementChange.verticalSpacing;
            var lastRankMaxCellSize = 0.0;
            plalementChange.rankSizes = [];
            plalementChange.rankOffset = [];
            for (var rankValue = model.maxRank; rankValue >= 0; rankValue--) {
                var maxCellSize = 0.0;
                var rank = model.ranks[rankValue];
                var localOffset = isHorizontal ? plalementChange.marginY : plalementChange.marginX;
                for (var i = 0; i < rank.length; i++) {
                    var node = rank[i];
                    if (node.cell && (node.cell.inEdges || node.cell.outEdges)) {
                        var bounds = ej.datavisualization.Diagram.Util.bounds(this.diagram.nameTable[node.cell.name]);
                        if (bounds != null) {
                            node.width = bounds.width;
                            node.height = bounds.height;
                        }
                        maxCellSize = Math.max(maxCellSize, (isHorizontal ? node.width : node.height));
                    }
                    else if (!ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(node)) {
                        var numEdges = 1;
                        if (node.edges != null) {
                            numEdges = node.edges.length;
                        }
                        node.width = (numEdges - 1) * 10;
                    }
                    if (isHorizontal) {
                        if (!node.height)
                            node.height = 0;
                    }
                    // Set the initial x-value as being the best result so far
                    localOffset += (isHorizontal ? node.height : node.width) / 2.0;
                    this._setXY(node, rankValue, localOffset, isHorizontal ? true : false);
                    this._setTempVariable(node, rankValue, localOffset);
                    localOffset += ((isHorizontal ? node.height : node.width) / 2.0) + plalementChange.horizontalSpacing;
                    if (localOffset > plalementChange.widestRankValue) {
                        plalementChange.widestRankValue = localOffset;
                        plalementChange.widestRank = rankValue;
                    }
                    plalementChange.rankSizes[rankValue] = localOffset;
                }
                plalementChange.rankOffset[rankValue] = offset;
                var distanceToNextRank = maxCellSize / 2.0 + lastRankMaxCellSize / 2.0 + plalementChange.verticalSpacing;
                lastRankMaxCellSize = maxCellSize;
                if (plalementChange.orientation == "north" || plalementChange.orientation == "west") {
                    offset += distanceToNextRank;
                }
                else {
                    offset -= distanceToNextRank;
                }
                for (var i = 0; i < rank.length; i++) {
                    var cell = rank[i];
                    var realOffset = this._getOffset(cell, offset, maxCellSize, isHorizontal ? false : true)
                    this._setXY(cell, rankValue, realOffset, isHorizontal ? false : true);
                }
            }
        },

        _getOffset: function (cell, offset, maxCellSize, isHorizontal) {
            if (isHorizontal) {
                offset -= (maxCellSize - cell.height) / 2;
            } else {
                offset -= (maxCellSize - cell.width) / 2;
            }
            return offset;
        },

        //set the temp position of the node on the layer
        _setTempVariable: function (node, layer, value) {
            if (ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(node)) {
                node.temp[0] = value;
            }
            else {
                node.temp[layer - node.minRank - 1] = value;
            }
        },
        //initialize the layout properties for positioning 
        _coordinateAssignment: function (marginX, marginY, parent, model) {
            var plalementChange = {};
            plalementChange.horizontalSpacing = model.layout.horizontalSpacing;
            plalementChange.verticalSpacing = model.layout.verticalSpacing;
            plalementChange.orientation = "north";
            plalementChange.marginX = plalementChange.marginX = marginX ? marginX : 0;
            plalementChange.marginY = plalementChange.marginY = marginY ? marginY : 0;
            return plalementChange;
        },
        //get the X value of the cell
        _getXY: function (node, layer, isY) {
            if (ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(node)) {
                if (isY)
                    return node.y[0];
                return node.x[0];
            }
            else {
                if (isY)
                    return node.y[layer - this.minRank - 1];
                return node.x[layer - this.minRank - 1];
            }
        },
        //set the geometry position of the cell         
        _setXY: function (node, layer, value, isY) {
            if (node && node.cell) {
                if (node.cell.inEdges || node.cell.outEdges) {
                    if (isY)
                        node.y[0] = value;
                    else
                        node.x[0] = value;
                }
                else {
                    if (isY)
                        node.y[layer - node.minRank - 1] = value;
                    else
                        node.x[layer - node.minRank - 1] = value;
                }
            }
        },
        //set geometry position of the layout node on the layout model
        _rankCoordinates: function (plalementChange, rankValue, graph, model) {
            var isHorizontal = false;
            if (plalementChange.model.layout.orientation === "lefttoright" || plalementChange.model.layout.orientation === "righttoleft") {
                isHorizontal = true;
            }
            var rank = model.ranks[rankValue];
            var maxOffset = 0.0;
            var localOffset = (isHorizontal ? plalementChange.marginY : plalementChange.marginX) + (plalementChange.widestRankValue - plalementChange.rankSizes[rankValue]) / 2;
            for (var i = 0; i < rank.length; i++) {
                var node = rank[i];
                if (ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(node)) {
                    var bounds = ej.datavisualization.Diagram.Util.bounds(this.diagram.nameTable[node.cell.name]);
                    if (bounds != null) {
                        node.width = bounds.width;
                        node.height = bounds.height;
                    }
                    maxOffset = Math.max(maxOffset, node.height);
                }
                else if (!ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(node)) {
                    var numEdges = 1;
                    if (node.edges != null) {
                        numEdges = node.edges.length;
                    }
                    if (isHorizontal)
                        node.height = (numEdges - 1) * 10;
                    else
                        node.width = (numEdges - 1) * 10;
                }
                var size = (isHorizontal ? node.height : node.width) / 2.0;
                localOffset += size;
                this._setXY(node, rankValue, localOffset, isHorizontal ? true : false);
                this._setTempVariable(node, rankValue, localOffset);
                localOffset += (size + plalementChange.horizontalSpacing);
            }
        },
        //sets the layout in an initial positioning.it will arange all the ranks as much as possible
        _initialCoords: function (plalementChange, facade, model) {
            this._calculateWidestRank(plalementChange, facade, model);
            // Reverse sweep direction each time from widest rank 
            for (var i = plalementChange.widestRank; i >= 0; i--) {
                if (i < model.maxRank) {
                    this._rankCoordinates(plalementChange, i, facade, model);
                }
            }
            for (var i = plalementChange.widestRank + 1; i <= model.maxRank; i++) {
                if (i > 0) {
                    this._rankCoordinates(plalementChange, i, facade, model);
                }
            }
        },
        _isAncestor: function (node, otherNode) {
            // Firstly, the hash code of this node needs to be shorter than the other node
            if (otherNode != null && node.hashCode != null && otherNode.hashCode != null
                    && node.hashCode.length < otherNode.hashCode.length) {
                if (node.hashCode == otherNode.hashCode) {
                    return true;
                }
                if (node.hashCode == null || node.hashCode == null) {
                    return false;
                }
                for (var i = 0; i < node.hashCode.length; i++) {
                    if (node.hashCode[i] != otherNode.hashCode[i]) {
                        return false;
                    }
                }
                return true;
            }
            return false;
        },
        //initialize the sorter object
        _weightedCellSorter: function (cell, weightedValue) {
            var weightedCellSorter = {};
            weightedCellSorter.cell = cell ? cell : null;
            weightedCellSorter.weightedValue = weightedValue ? weightedValue : 0;
            weightedCellSorter.visited = false;
            weightedCellSorter.rankIndex = null;
            return weightedCellSorter;
        },
        //Performs one node positioning in both directions
        _minNode: function (plalementChange, model) {
            var nodeList = [];
            var map = { map: {} };
            var rank = [];
            for (var i = 0; i <= model.maxRank; i++) {
                rank[i] = model.ranks[i];
                for (var j = 0; j < rank[i].length; j++) {
                    var node = rank[i][j];
                    var nodeWrapper = this._weightedCellSorter(node, i);
                    nodeWrapper.rankIndex = j;
                    nodeWrapper.visited = true;
                    nodeList.push(nodeWrapper);
                    ej.datavisualization.Diagram.MultiParentModel.prototype._setDictionary(map, node, nodeWrapper, true);
                }
            }
            var maxTries = nodeList.length * 10;
            var count = 0;
            var tolerance = 1;
            while (nodeList.length > 0 && count <= maxTries) {
                var cellWrapper = nodeList.shift();
                var cell = cellWrapper.cell;
                var rankValue = cellWrapper.weightedValue;
                var rankIndex = parseInt(cellWrapper.rankIndex);
                var nextLayerConnectedCells = ej.datavisualization.Diagram.CrossReduction.prototype._getConnectedCellsOnLayer(cell, rankValue);
                var previousLayerConnectedCells = ej.datavisualization.Diagram.CrossReduction.prototype._getConnectedCellsOnLayer(cell, rankValue, true);
                var numNextLayerConnected = nextLayerConnectedCells.length;
                var numPreviousLayerConnected = previousLayerConnectedCells.length;
                var medianNextLevel = this._medianXValue(plalementChange, nextLayerConnectedCells, rankValue + 1);
                var medianPreviousLevel = this._medianXValue(plalementChange, previousLayerConnectedCells, rankValue - 1);
                var numConnectedNeighbours = numNextLayerConnected + numPreviousLayerConnected;
                var currentPosition = ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(cell, rankValue);
                var cellMedian = currentPosition;
                if (numConnectedNeighbours > 0) {
                    cellMedian = (medianNextLevel * numNextLayerConnected + medianPreviousLevel * numPreviousLayerConnected) / numConnectedNeighbours;
                }
                var positionChanged = false;
                var tempValue = null;
                if (cellMedian < currentPosition - tolerance) {
                    if (rankIndex == 0) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    }
                    else {
                        var leftCell = rank[rankValue][rankIndex - 1];
                        var leftLimit = ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(leftCell, rankValue);
                        leftLimit = leftLimit + leftCell.width / 2 + plalementChange.intraCellSpacing + cell.width / 2;
                        if (leftLimit < cellMedian) {
                            tempValue = cellMedian;
                            positionChanged = true;
                        }
                        else if (leftLimit < ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(cell, rankValue) - tolerance) {
                            tempValue = leftLimit;
                            positionChanged = true;
                        }
                    }
                }
                else if (cellMedian > currentPosition + tolerance) {
                    var rankSize = rank[rankValue].length;
                    if (rankIndex == rankSize - 1) {
                        tempValue = cellMedian;
                        positionChanged = true;
                    }
                    else {
                        var rightCell = rank[rankValue][rankIndex + 1];
                        var rightLimit = ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(rightCell, rankValue);
                        rightLimit = rightLimit - rightCell.width / 2 - plalementChange.intraCellSpacing - cell.width / 2;
                        if (rightLimit > cellMedian) {
                            tempValue = cellMedian;
                            positionChanged = true;
                        }
                        else if (rightLimit > ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(cell, rankValue) + tolerance) {
                            tempValue = rightLimit;
                            positionChanged = true;
                        }
                    }
                }
                if (positionChanged) {
                    this._setTempVariable(cell, rankValue, tempValue);
                    // Add connected nodes to map and list
                    this._updateNodeList(nodeList, map, nextLayerConnectedCells);
                    this._updateNodeList(nodeList, map, previousLayerConnectedCells);
                }
                if (ej.datavisualization.Diagram.CrossReduction.prototype._isVertex(cellWrapper.cell)) {
                    cellWrapper.visited = false;
                }
                count++;
            }
        },
        _updateNodeList: function (nodeList, map, collection) {
            for (var i = 0; i < collection.length; i++) {
                var connectedCell = collection[i];
                var connectedCellWrapper = ej.datavisualization.Diagram.MultiParentModel.prototype._getDictionary(map, connectedCell);
                if (connectedCellWrapper != null) {
                    if (connectedCellWrapper.visited == false) {
                        connectedCellWrapper.visited = true;
                        nodeList.push(connectedCellWrapper);
                    }
                }
            }
        },
        //calculates the node position of the connected cell on the specified rank
        _medianXValue: function (plalementChange, connectedCells, rankValue) {
            if (connectedCells.length == 0) {
                return 0;
            }
            var medianValues = [];
            for (var i = 0; i < connectedCells.length; i++) {
                medianValues[i] = ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(connectedCells[i], rankValue);
            }
            medianValues.sort(function (a, b) {
                return a - b;
            });
            if (connectedCells.length % 2 == 1) {
                return medianValues[Math.floor(connectedCells.length / 2)];
            }
            else {
                var medianPoint = connectedCells.length / 2;
                var leftMedian = medianValues[medianPoint - 1];
                var rightMedian = medianValues[medianPoint];
                return ((leftMedian + rightMedian) / 2);
            }
        },
        _placementStageExecute: function (plalementChange, parent) {
            var isHorizontal = false;
            if (plalementChange.model.layout.orientation === "lefttoright" || plalementChange.model.layout.orientation === "righttoleft") {
                isHorizontal = true
            }
            plalementChange.jettyPositions = Object();
            var model = plalementChange.model;
            isHorizontal ? plalementChange.currentYDelta = 0.0 : plalementChange.currentXDelta = 0.0;
            this._initialCoords(plalementChange, { model: model }, model);
            this._minNode(plalementChange, model);
            var bestOffsetDelta = 100000000.0;
            if (!plalementChange.maxIterations)
                plalementChange.maxIterations = 8;
            for (var i = 0; i < plalementChange.maxIterations; i++) {
                // if the total offset is less for the current positioning, there are less heavily angled edges and so the current positioning is used
                if ((isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta) < bestOffsetDelta) {
                    for (var j = 0; j < model.ranks.length; j++) {
                        var rank = model.ranks[j];
                        for (var k = 0; k < rank.length; k++) {
                            var cell = rank[k];
                            this._setXY(cell, j, ej.datavisualization.Diagram.CrossReduction.prototype._getTempVariable(cell, j), isHorizontal ? true : false);
                        }
                    }
                    bestOffsetDelta = isHorizontal ? plalementChange.currentYDelta : plalementChange.currentXDelta;
                }
                isHorizontal ? plalementChange.currentYDelta = 0 : plalementChange.currentXDelta = 0;
            }
            this._setCellLocations(plalementChange, model);
        },
        //sets the cell position in the after the layout operation
        _setCellLocations: function (plalementChange, model) {
            var vertices = this._getValues(model.vertexMapper);
            for (var i = 0; i < vertices.length; i++) {
                this._setVertexLocation(plalementChange, vertices[i]);
            }
        },
        //used to specify the geometrical position of the layout model cell
        _garphModelsetVertexLocation: function (plalementChange, cell, x, y) {
            var model = plalementChange.model;
            var geometry = cell.geometry;
            var result = null;
            if (geometry != null) {
                result = new ej.datavisualization.Diagram.Rectangle(x, y, geometry.width, geometry.height);
                if (geometry.x != x || geometry.y != y) {
                    geometry = $.extend(true, {}, geometry);
                    geometry.x = x;
                    geometry.y = y;
                    cell.geometry = geometry;
                }
            }
            return result;
        },
        //set the position of the specified node
        _setVertexLocation: function (plalementChange, cell) {
            var isHorizontal = false;
            if (plalementChange.model.layout.orientation === "lefttoright" || plalementChange.model.layout.orientation === "righttoleft")
                isHorizontal = true;
            var realCell = cell.cell;
            var positionX = cell.x[0] - cell.width / 2;
            var positionY = cell.y[0] - cell.height / 2;
            this._garphModelsetVertexLocation(plalementChange, realCell, positionX, positionY);
            if (isHorizontal) {
                if (!plalementChange.marginY)
                    plalementChange.marginY = null;
                plalementChange.marginY = Math.max(plalementChange.marginY, positionY + cell.height);
            }
            else {
                if (!plalementChange.marginX)
                    plalementChange.marginX = null;
                plalementChange.marginX = Math.max(plalementChange.marginX, positionX + cell.width);
            }
        },
        //get the specific value from the key value pair
        _getValues: function (mapper) {
            var list = [];
            if (mapper.map) {
                for (var key in mapper.map)
                    list.push(mapper.map[key]);
            }
            return list;
        },
        //used to create a duplicate of the node as vertex for layout
        _createVertex: function (dnode, value, x, y, width, height) {            
            var geometry = new ej.datavisualization.Diagram.Rectangle(x, y, width, height);
            geometry.relative = true;
            var vertex = {
                value: value, geometry: geometry, name: value, vertex: true, inEdges: (dnode.inEdges).slice(), outEdges: (dnode.outEdges).slice()
            }
            return vertex;
        },
        //used to remove the any duplicate nodes persist on the multiple number of ranks
        _crossingStage: function (model) {
            var _crossingStage = new ej.datavisualization.Diagram.CrossReduction(this);
            _crossingStage._execute(model);
        },
        _layeringStage: function (model) {
            this._initialRank(model);
            this._fixRanks(model);
        },
        //determine the initial rank for the each vertex on the relevent direction
        _initialRank: function (model) {
            var startNodes = model._startNodes;
            var internalNodes = ej.datavisualization.Diagram.MultiParentModel.prototype._getDictionaryValues(model.vertexMapper);
            var startNodesCopy = startNodes.slice();
            while (startNodes.length > 0) {
                var internalNode = startNodes[0];
                var layerDeterminingEdges = internalNode.connectsAsTarget;
                var edgesToBeMarked = internalNode.connectsAsSource;
                var allEdgesScanned = true;
                var minimumLayer = 100000000;
                for (var i = 0; i < layerDeterminingEdges.length; i++) {
                    var internalEdge = layerDeterminingEdges[i];
                    if (internalEdge.temp[0] == 5270620) {
                        // This edge has been scanned, get the layer of the node on the other end
                        var otherNode = internalEdge.source;
                        minimumLayer = Math.min(minimumLayer, otherNode.temp[0] - 1);
                    }
                    else {
                        allEdgesScanned = false;
                        break;
                    }
                }
                // If all edge have been scanned, assign the layer, mark all edges in the other direction and remove from the nodes list
                if (allEdgesScanned) {
                    internalNode.temp[0] = minimumLayer;
                    if (!model.maxRank)
                        model.maxRank = 100000000
                    model.maxRank = Math.min(model.maxRank, minimumLayer);
                    if (edgesToBeMarked != null) {
                        for (var i = 0; i < edgesToBeMarked.length; i++) {
                            var internalEdge = edgesToBeMarked[i];
                            internalEdge.temp[0] = 5270620;
                            // Add node on other end of edge to LinkedList of nodes to be analysed
                            var otherNode = internalEdge.target;
                            // Only add node if it hasn't been assigned a layer
                            if (otherNode.temp[0] == -1) {
                                startNodes.push(otherNode);
                                // Mark this other node as neither being unassigned nor assigned so it isn't added to this list again, but it's layer isn't used in any calculation.
                                otherNode.temp[0] = -2;
                            }
                        }
                    }
                    startNodes.shift();
                }
                else {
                    // Not all the edges have been scanned, get to the back of the class and put the dunces cap on
                    var removedCell = startNodes.shift();
                    startNodes.push(internalNode);
                    if (removedCell == internalNode && startNodes.length == 1) {
                        // This is an error condition, we can't get out of this loop. It could happen for more than one node but that's a lot harder to detect. Log the error
                        break;
                    }
                }
            }
            for (var i = 0; i < internalNodes.length; i++) {
                internalNodes[i].temp[0] -= model.maxRank;
            }
            for (var i = 0; i < startNodesCopy.length; i++) {
                var internalNode = startNodesCopy[i];
                var currentMaxLayer = 0;
                var layerDeterminingEdges = internalNode.connectsAsSource;
                for (var j = 0; j < layerDeterminingEdges.length; j++) {
                    var internalEdge = layerDeterminingEdges[j];
                    var otherNode = internalEdge.target;
                    internalNode.temp[0] = Math.max(currentMaxLayer,
                            otherNode.temp[0] + 1);
                    currentMaxLayer = internalNode.temp[0];
                }
            }
            model.maxRank = 100000000 - model.maxRank;
        },
        //used to set the optimum value of each vertex on the layout
        _fixRanks: function (model) {
            model._fixRanks();
        },
        //used to determine any cyclic stage have been created on the layout model
        _cycleStage: function (model) {
            var seenNodes = new Object();
            model._startNodes = [];
            var unseenNodesArray = ej.datavisualization.Diagram.MultiParentModel.prototype._getDictionaryValues(model.vertexMapper);
            var unseenNodes = new Object();
            for (var i = 0; i < unseenNodesArray.length; i++) {
                unseenNodesArray[i].temp[0] = -1;
                unseenNodes[unseenNodesArray[i].id] = unseenNodesArray[i];
            }
            window.model = model;
            window.objLayout = this;
            var rootsArray = null;
            if (model.roots != null) {
                var modelRoots = model.roots;
                rootsArray = [];
                for (var i = 0; i < modelRoots.length; i++) {
                    rootsArray[i] = ej.datavisualization.Diagram.MultiParentModel.prototype._getDictionary(model.vertexMapper, modelRoots[i]);
                    if (rootsArray[i] != null) {
                        model._startNodes.push(rootsArray[i]);
                    }
                }
            }
            model._visit("removeParentConnection", rootsArray, true, null, seenNodes, unseenNodes);
            var seenNodesCopy = ej.datavisualization.Diagram.MultiParentModel.prototype._clone(seenNodes, null, true);
            model._visit("removeNodeConnection", unseenNodes, true, seenNodesCopy, seenNodes, unseenNodes);
        },
        _remove: function (obj, array) {
            var result = null;
            if (typeof (array) == 'object') {
                var index = ej.datavisualization.Diagram.Util.indexOf(array, obj);
                while (index >= 0) {
                    array.splice(index, 1);
                    result = obj;
                    index = ej.datavisualization.Diagram.Util.indexOf(array, obj);
                }
            }
            for (var key = 0; key < array.length; key++) {
                if (array[key] == obj) {
                    delete array[key];
                    result = obj;
                }
            }
            return result;
        },
        _invert: function (connectingEdge, layer) {
            var temp = connectingEdge.source;
            connectingEdge.source = connectingEdge.target;
            connectingEdge.target = temp;
            connectingEdge.isReversed = !connectingEdge.isReversed;
        },
        //used to confirm each vertex is visited once to avoid more no of cycle
        _traverse: function (vertex, directed, edge, currentComp, hierarchyVertices, filledVertexSet) {
            if (vertex != null) {
                var vertexID = vertex.name;
                if ((filledVertexSet == null ? true : filledVertexSet[vertexID] != null)) {
                    if (currentComp[vertexID] == null) {
                        currentComp[vertexID] = vertex;
                    }
                    if (filledVertexSet !== null) {
                        delete filledVertexSet[vertexID];
                    }
                    var edges = this._getEdges(vertex);
                    var edgeIsSource = [];
                    for (var i = 0; i < edges.length; i++) {
                        edgeIsSource[i] = (this._getVisibleTerminal(edges[i], true) == vertex);
                    }
                    for (var i = 0; i < edges.length; i++) {
                        if (!directed || edgeIsSource[i]) {
                            var next = this._getVisibleTerminal(edges[i], !edgeIsSource[i]);
                            var netCount = 1;
                            for (var j = 0; j < edges.length; j++) {
                                if (j == i) {
                                    continue;
                                }
                                else {
                                    var isSource2 = edgeIsSource[j];
                                    var otherTerm = this._getVisibleTerminal(edges[j], !isSource2);
                                    if (otherTerm == next) {
                                        if (isSource2) {
                                            netCount++;
                                        }
                                        else {
                                            netCount--;
                                        }
                                    }
                                }
                            }
                            if (netCount >= 0) {
                                currentComp = this._traverse(next, directed, edges[i],
                                    currentComp, hierarchyVertices,
                                    filledVertexSet);
                            }
                        }
                    }
                }
                else {
                    if (currentComp[vertexID] == null) {
                        // We've seen this vertex before, but not in the current component This component and the one it's in need to be merged
                        for (var i = 0; i < hierarchyVertices.length; i++) {
                            var comp = hierarchyVertices[i];
                            if (comp[vertexID] != null) {
                                for (var key in comp) {
                                    currentComp[key] = comp[key];
                                }
                                // Remove the current component from the hierarchy set
                                hierarchyVertices.splice(i, 1);
                                return currentComp;
                            }
                        }
                    }
                }
            }
            return currentComp;
        },
        //used to get the root nodes on the given layout
        _findRoots: function (vertices, layout) {
            var roots = [], root;
            var best = null;
            var maxDiff = -100000;
            for (var i in vertices) {
                var cell = vertices[i];
                var conns = this._getEdges(cell);
                var outEdges = 0;
                var inEdges = 0;
                for (var k = 0; k < conns.length; k++) {
                    var src = this._getVisibleTerminal(conns[k], true);
                    if (src.name == cell.name) {
                        outEdges++;
                    }
                    else {
                        inEdges++;
                    }
                }
                if (inEdges == 0 && outEdges > 0) {
                    roots.push(cell);
                }
                var diff = outEdges - inEdges;
                if (diff > maxDiff) {
                    maxDiff = diff;
                    best = cell;
                }
                if (layout.rootNode && vertices[i].name === layout.rootNode.name) {
                    root = cell;
                }
            }
            if (roots.length == 0 && best != null) {
                if (layout && layout.rootNode) {
                    roots.push(root);
                }
                else
                    roots.push(best);
            }
            return roots;
        },
        //used to get the no of edges connected to the specific node
        _getEdges: function (node) {
            var edges = [];
            if (node) {
                for (var i = 0; node.inEdges.length > 0 && i < node.inEdges.length; i++) {
                    edges.push(this.diagram.nameTable[node.inEdges[i]]);
                }
                for (var i = 0; node.outEdges.length > 0 && i < node.outEdges.length; i++) {
                    edges.push(this.diagram.nameTable[node.outEdges[i]]);
                }
            }
            return edges;
        },
        //used to get the source or target node of the conenctor(edge)
        _getVisibleTerminal: function (edge, source) {
            var terminalCache = this.diagram.nameTable[edge.targetNode];
            if (source) {
                terminalCache = this.diagram.nameTable[edge.sourceNode];
            }
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes[i].name === terminalCache.name)
                    return this.nodes[i];
            }
        },
        // used to get the edges between the given source and target 
        _getEdgesBetween: function (source, target, directed) {
            directed = (directed != null) ? directed : false;
            var edges = this._getEdges(source);
            var result = [];
            for (var i = 0; i < edges.length; i++) {
                var src = this._getVisibleTerminal(edges[i], true);
                var trg = this._getVisibleTerminal(edges[i], false);
                if ((src == source && trg == target) || (!directed && src == target && trg == source)) {
                    result.push(edges[i]);
                }
            }
            return result;
        },
    };
    var MultiParentModel = (function () {
        function MultiParentModel(layout, vertices, roots, dlayout) {
            this.roots = roots;
            this.vertexMapper = { map: {} };
            var internalVertices = [];
            this.layout = dlayout;
            this.maxRank = 100000000;
            this._createInternalCells(layout, vertices, internalVertices);
            for (var i = 0; i < vertices.length; i++) {
                var edges = internalVertices[i].connectsAsSource;
                for (var j = 0; j < edges.length; j++) {
                    var internalEdge = edges[j];
                    var realEdges = internalEdge.edges;
                    if (realEdges != null && realEdges.length > 0) {
                        var realEdge = realEdges[0];
                        var targetCell = layout._getVisibleTerminal(realEdge, false);
                        var internalTargetCell = this._getDictionary(this.vertexMapper, targetCell);
                        if (internalVertices[i] == internalTargetCell) {
                            targetCell = layout._getVisibleTerminal(realEdge, true);
                            internalTargetCell = this._getDictionary(this.vertexMapper, targetCell);
                        }
                        if (internalTargetCell != null && internalVertices[i] != internalTargetCell) {
                            internalEdge.target = internalTargetCell;
                            if (internalTargetCell.connectsAsTarget.length == 0) {
                                internalTargetCell.connectsAsTarget = [];
                            }
                            if (ej.datavisualization.Diagram.Util.indexOf(internalTargetCell.connectsAsTarget, internalEdge) < 0) {
                                internalTargetCell.connectsAsTarget.push(internalEdge);
                            }
                        }
                    }
                }
                internalVertices[i].temp[0] = 1;
            }
        };
        //used to count the no of times the parent have been used
        MultiParentModel.prototype.dfsCount = 0;
        //used to create the duplicate of the edges on the layout model
        MultiParentModel.prototype._createInternalCells = function (layout, vertices, internalVertices) {
            for (var i = 0; i < vertices.length; i++) {
                internalVertices[i] = { x: [], y: [], temp: [], cell: vertices[i], id: vertices[i].name, connectsAsTarget: [], connectsAsSource: [],identicalSibilings:null, type:"internalVertex" };
                this._setDictionary(this.vertexMapper, vertices[i], internalVertices[i]);
                var conns = ej.datavisualization.Diagram.MultipleParentHierarchicalLayout._getEdges(vertices[i]);
                internalVertices[i].connectsAsSource = [];
                for (var j = 0; j < conns.length; j++) {
                    var cell = layout._getVisibleTerminal(conns[j], false);
                    if (cell != vertices[i]) {
                        var undirectedEdges = layout._getEdgesBetween(vertices[i], cell, false);
                        var directedEdges = layout._getEdgesBetween(vertices[i], cell, true);
                        if (undirectedEdges != null && undirectedEdges.length > 0 && directedEdges.length * 2 >= undirectedEdges.length) {
                            var internalEdge = { x: [], y: [], temp: [], edges: undirectedEdges, ids: [], identicalSibilings:null, type:"internalEdge" };
                            for (var m = 0; m < undirectedEdges.length; m++) {
                                internalEdge.ids.push(undirectedEdges[m].name);
                            }
                            internalEdge.source = internalVertices[i];
                            if (!internalVertices[i].connectsAsSource)
                                internalVertices[i].connectsAsSource = [];
                            if (ej.datavisualization.Diagram.Util.indexOf(internalVertices[i].connectsAsSource, internalEdge) < 0) {
                                internalVertices[i].connectsAsSource.push(internalEdge);
                            }
                        }
                    }
                }
                internalVertices[i].temp[0] = 0;
            }
        };
        MultiParentModel.prototype._getType = function (type) {
            if (type === "internalVertex")
                return "internalVertex";
            else
                return "internalEdge";
        };
        //used to set the optimum value of each vertex on the layout
        MultiParentModel.prototype._fixRanks = function () {
            var rankList = [];
            this.ranks = [];
            for (var i = 0; i < this.maxRank + 1; i++) {
                rankList[i] = [];
                this.ranks[i] = rankList[i];
            }
            var rootsArray = null;
            if (this.roots != null) {
                var oldRootsArray = this.roots;
                rootsArray = [];
                for (var i = 0; i < oldRootsArray.length; i++) {
                    var cell = oldRootsArray[i];
                    var internalNode = this._getDictionary(this.vertexMapper, cell);
                    rootsArray[i] = internalNode;
                }
            }
            this._visit("updateMinMaxRank", rootsArray, false, null, null, null, rankList);
        };
        MultiParentModel.prototype._updateMinMaxRank = function (parent, node, edge, layer, seen, seenNodes1, unseenNodes1, rankList) {
            if (!node.maxRank && node.maxRank != 0)
                node.maxRank = -1;
            if (!node.minRank && node.minRank != 0)
                node.minRank = -1;
            if (seen == 0 && node.maxRank < 0 && node.minRank < 0) {
                rankList[node.temp[0]].push(node);
                node.maxRank = node.temp[0];
                node.minRank = node.temp[0];
                node.temp[0] = rankList[node.maxRank].length - 1;
            }
            if (parent != null && edge != null) {
                var parentToCellRankDifference = parent.maxRank - node.maxRank;
                if (parentToCellRankDifference > 1) {
                    edge.maxRank = parent.maxRank;
                    edge.minRank = node.maxRank;
                    edge.temp = [];
                    edge.x = [];
                    edge.y = [];
                    for (var i = edge.minRank + 1; i < edge.maxRank; i++) {
                        rankList[i].push(edge);
                        ej.datavisualization.Diagram.MultipleParentHierarchicalLayout._setTempVariable(edge, i, rankList[i].length - 1);
                    }
                }
            }
        };
        //used to store the value of th given key on the object
        MultiParentModel.prototype._setDictionary = function (dic, key, value) {
            var id = key.name;
            if (!id) {
                id = this._getDictionary(dic, key);
            }
            var previous = dic.map[id];
            dic.map[id] = value;
            return previous;
        };
        //used to get the value of the given key
        MultiParentModel.prototype._getDictionary = function (dic, key) {
            if (!this.multiObjectIdentityCounter && this.multiObjectIdentityCounter != 0)
                this.multiObjectIdentityCounter = 0;
            var id = key.name;
            if (!id) {
                if (!key["layoutObjectId"]) {///####
                    key["layoutObjectId"] = "graphHierarchyNode#" + this.multiObjectIdentityCounter++;
                    return key["layoutObjectId"];
                }
                else return dic.map[key["layoutObjectId"]];
            }
            return dic.map[id];
        };
        //used to get all the values of the dictionary object
        MultiParentModel.prototype._getDictionaryValues = function (dic, key) {
            var result = [];
            for (var key in dic.map) {
                result.push(dic.map[key]);
            }
            return result;
        };
        //used to visit all the entries on the given dictionary with given function
        MultiParentModel.prototype._visit = function (visitor, dfsRoots, trackAncestors, seenNodes, seenNodes1, unseenNodes1, rankList) {
            // Run depth first search through on all roots
            if (dfsRoots != null) {
                for (var i = 0; i < dfsRoots.length; i++) {
                    var internalNode = dfsRoots[i];
                    if (internalNode != null) {
                        if (seenNodes == null) {
                            seenNodes = new Object();
                        }
                        if (trackAncestors) {
                            // Set up hash code for root
                            internalNode.hashCode = [];
                            internalNode.hashCode[0] = this.dfsCount;
                            internalNode.hashCode[1] = i;
                            this._extendedDfs(null, internalNode, null, visitor, seenNodes, internalNode.hashCode, i, 0, seenNodes1, unseenNodes1, rankList);
                        }
                        else {
                            this._depthFirstSearch(null, internalNode, null, visitor, seenNodes, 0, seenNodes1, unseenNodes1, rankList);
                        }
                    }
                }
                this.dfsCount++;
            }
        };
        //used to perform the depth fisrt search on the layout model
        MultiParentModel.prototype._depthFirstSearch = function (parent, root, connectingEdge, visitor, seen, layer, seenNodes1, unseenNodes1, rankList) {
            if (root != null) {
                var rootId = root.id;
                if (seen[rootId] == null) {
                    seen[rootId] = root;
                    this._updateConnectionRank(visitor, parent, root, connectingEdge, layer, 0, seenNodes1, unseenNodes1, rankList);
                    // Copy the connects as source list so that visitors can change the original for edge direction inversions
                    var outgoingEdges = root.connectsAsSource.slice();
                    for (var i = 0; i < outgoingEdges.length; i++) {
                        var internalEdge = outgoingEdges[i];
                        var targetNode = internalEdge.target;
                        // Root check is O(|roots|)
                        this._depthFirstSearch(root, targetNode, internalEdge, visitor, seen, layer + 1, seenNodes1, unseenNodes1, rankList);
                    }
                }
                else {
                    this._updateConnectionRank(visitor, parent, root, connectingEdge, layer, 1, seenNodes1, unseenNodes1, rankList);
                }
            }
        };
        MultiParentModel.prototype._updateConnectionRank = function (visitor, parent, root, connectingEdge, layer, seen, seenNodes1, unseenNodes1, rankList) {
            if (visitor === "removeParentConnection" || visitor === "removeNodeConnection")
                this._removeConnectionEdge(parent, root, connectingEdge, layer, seen, seenNodes1, unseenNodes1, rankList, visitor === "removeNodeConnection" ? true : false);
            if (visitor === "updateMinMaxRank")
                this._updateMinMaxRank(parent, root, connectingEdge, layer, seen, seenNodes1, unseenNodes1, rankList);
        };
        MultiParentModel.prototype._removeConnectionEdge = function (parent, node, connectingEdge, layer, seen, seenNodes, unseenNodes, removeNodeConnection) {
            if (window.objLayout._isAncestor(node, parent)) {
                window.objLayout._invert(connectingEdge);
                window.objLayout._remove(connectingEdge, parent.connectsAsSource);
                if (removeNodeConnection) {
                    node.connectsAsSource.push(connectingEdge);
                    parent.connectsAsTarget.push(connectingEdge);
                    window.objLayout._remove(connectingEdge, node.connectsAsTarget);
                }
                else {
                    parent.connectsAsTarget.push(connectingEdge);
                    window.objLayout._remove(connectingEdge, node.connectsAsTarget);
                    node.connectsAsSource.push(connectingEdge);
                }
            }
            seenNodes[node.id] = node;
            delete unseenNodes[node.id];
        };

        //the dfs extends the default version by keeping track of cells ancestors, but it should be only used when necessary
        MultiParentModel.prototype._extendedDfs = function (parent, root, connectingEdge, visitor, seen, ancestors, childHash, layer, seenNodes1, unseenNodes1, rankList) {
            if (root != null) {
                if (parent != null) {
                    if (root.hashCode == null ||
                        root.hashCode[0] != parent.hashCode[0]) {
                        var hashCodeLength = parent.hashCode.length + 1;
                        root.hashCode = parent.hashCode.slice();
                        root.hashCode[hashCodeLength - 1] = childHash;
                    }
                }
                var rootId = root.id;
                if (seen[rootId] == null) {
                    seen[rootId] = root;
                    this._updateConnectionRank(visitor, parent, root, connectingEdge, layer, 0, seenNodes1, unseenNodes1, rankList)
                    var outgoingEdges = root.connectsAsSource.slice();
                    for (var i = 0; i < outgoingEdges.length; i++) {
                        var internalEdge = outgoingEdges[i];
                        var targetNode = internalEdge.target;
                        this._extendedDfs(root, targetNode, internalEdge, visitor, seen, root.hashCode, i, layer + 1, seenNodes1, unseenNodes1, rankList);
                    }
                }
                else {
                    this._updateConnectionRank(visitor, parent, root, connectingEdge, layer, 1, seenNodes1, unseenNodes1, rankList);
                }
            }
        };
        //used to clone the specified object ignoring all fieldnames in the given array of transient fields
        MultiParentModel.prototype._clone = function (obj, transients, shallow) {
            shallow = (shallow != null) ? shallow : false;
            if (obj != null && typeof (obj.constructor) == 'function') {
                var _clone = new obj.constructor();
                for (var i in obj) {
                    if (i != "layoutObjectId" && (transients == null || ej.datavisualization.Diagram.Util.indexOf(transients, i) < 0)) {
                        if (!shallow && typeof (obj[i]) == 'object') {
                            _clone[i] = $.extend(true, {}, obj[i]);
                        }
                        else {
                            _clone[i] = obj[i];
                        }
                    }
                }
            }
            return _clone;
        };
        return MultiParentModel;
    })();
    ej.datavisualization.Diagram.MultiParentModel = MultiParentModel;
    var CrossReduction = (function () {
        function CrossReduction() {
        };
        //used to calculate the number of edges crossing the layout model
        CrossReduction.prototype._calculateCrossings = function (model) {
            var numRanks = model.ranks.length;
            var totalCrossings = 0;
            for (var i = 1; i < numRanks; i++) {
                totalCrossings += this._calculateRankCrossing(i, model);
            }
            return totalCrossings;
        };
        //used to get the temp value specified for the node or connector
        CrossReduction.prototype._getTempVariable = function (node, layer) {
            if (node) {
                if (this._isVertex(node)) {
                    return node.temp[0];
                }
                else {
                    return node.temp[layer - node.minRank - 1];
                }
            }
        },
        //used to specify the number of conenctors crossing between the specified rank and its below rank 
        CrossReduction.prototype._calculateRankCrossing = function (i, model) {
            var totalCrossings = 0;
            var rank = model.ranks[i];
            var previousRank = model.ranks[i - 1];
            var tmpIndices = [];
            // Iterate over the top rank and fill in the connection information
            for (var j = 0; j < rank.length; j++) {
                var node = rank[j];
                var rankPosition = this._getTempVariable(node, i);
                var connectedCells = this._getConnectedCellsOnLayer(node, i, true);
                ///#### 
                var nodeIndices = [];
                for (var k = 0; k < connectedCells.length; k++) {
                    var connectedNode = connectedCells[k];
                    var otherCellRankPosition = this._getTempVariable(connectedNode, i - 1);
                    nodeIndices.push(otherCellRankPosition);
                }
                nodeIndices.sort(function (x, y) { return x - y; });
                tmpIndices[rankPosition] = nodeIndices;
            }
            var indices = [];
            for (var j = 0; j < tmpIndices.length; j++) {
                indices = indices.concat(tmpIndices[j]);
            }
            var firstIndex = 1;
            while (firstIndex < previousRank.length) {
                firstIndex <<= 1;
            }
            var treeSize = 2 * firstIndex - 1;
            firstIndex -= 1;
            var tree = [];
            for (var j = 0; j < treeSize; ++j) {
                tree[j] = 0;
            }
            for (var j = 0; j < indices.length; j++) {
                var index = indices[j];
                var treeIndex = index + firstIndex;
                ++tree[treeIndex];
                while (treeIndex > 0) {
                    if (treeIndex % 2) {
                        totalCrossings += tree[treeIndex + 1];
                    }
                    treeIndex = (treeIndex - 1) >> 1;
                    ++tree[treeIndex];
                }
            }
            return totalCrossings;
        };
        CrossReduction.prototype._execute = function (model) {
            // Stores initial ordering 
            this.nestedBestRanks = [];
            for (var i = 0; i < model.ranks.length; i++) {
                this.nestedBestRanks[i] = model.ranks[i].slice();
            }
            var iterationsWithoutImprovement = 0;
            var currentBestCrossings = this._calculateCrossings(model);
            for (var i = 0; i < 24 && iterationsWithoutImprovement < 2; i++) {
                this._weightedMedian(i, model);
                var candidateCrossings = this._calculateCrossings(model);
                if (candidateCrossings < currentBestCrossings) {
                    currentBestCrossings = candidateCrossings;
                    iterationsWithoutImprovement = 0;
                }
                else {
                    // Increase count of iterations  
                    iterationsWithoutImprovement++;
                    // Restore the best values to the cells
                    for (var j = 0; j < this.nestedBestRanks.length; j++) {
                        var rank = model.ranks[j];
                        for (var k = 0; k < rank.length; k++) {
                            var cell = rank[k];
                            this._setTempVariable(cell, j, k);
                        }
                    }
                }
                if (currentBestCrossings == 0) {
                    break;
                }
            }
            // Store the best rankings but in the model
            var ranks = [];
            var rankList = [];
            for (var i = 0; i < model.maxRank + 1; i++) {
                rankList[i] = [];
                ranks[i] = rankList[i];
            }
            for (var i = 0; i < this.nestedBestRanks.length; i++) {
                for (var j = 0; j < this.nestedBestRanks[i].length; j++) {
                    rankList[i].push(this.nestedBestRanks[i][j]);
                }
            }
            model.ranks = ranks;
        };
        //check whether the object is vertext or edge on the layout model.
        CrossReduction.prototype._isVertex = function (node) {
            if (node && node.cell && (node.cell.inEdges || node.cell.outEdges)) {
                return true
            }
            return false;
        };
        //used to move up or move down the node position on the adjacent ranks 
        CrossReduction.prototype._weightedMedian = function (iteration, model) {
            // Reverse sweep direction each time through this method
            var downwardSweep = (iteration % 2 == 0);
            if (downwardSweep) {
                for (var j = model.maxRank - 1; j >= 0; j--) {
                    this._medianRank(j, downwardSweep);
                }
            }
            else {
                for (var j = 1; j < model.maxRank; j++) {
                    this._medianRank(j, downwardSweep);
                }
            }
        };
        //used to get the node next(up) connected to the specified node or connector
        CrossReduction.prototype._getConnectedCellsOnLayer = function (cell, layer, isPrevious) {
            var connectedlayer = "nextLayerConnectedCells";
            var connectedAs = "connectsAsTarget"
            if (isPrevious) {
                connectedlayer = "previousLayerConnectedCells";
                connectedAs = "connectsAsSource"
            }
            if (cell) {
                if (this._isVertex(cell)) {
                    if (cell[connectedlayer] == null) {
                        cell[connectedlayer] = [];
                        cell[connectedlayer][0] = [];
                        for (var i = 0; i < cell[connectedAs].length; i++) {
                            var edge = cell[connectedAs][i];
                            if (edge.maxRank == undefined)
                                edge.maxRank = -1;
                            if (edge.maxRank == -1 || (isPrevious ? (edge.minRank == layer - 1) : (edge.maxRank == layer + 1))) {
                                // Either edge is not in any rank or no dummy nodes in edge, add node of other side of edge
                                cell[connectedlayer][0].push(isPrevious ? edge.target : edge.source);
                            }
                            else {
                                // Edge spans at least two layers, add edge
                                cell[connectedlayer][0].push(edge);
                            }
                        }
                    }
                    return cell[connectedlayer][0];
                }
                else {
                    if (cell[connectedlayer] == null) {
                        cell[connectedlayer] = [];
                        for (var i = 0; i < cell.temp.length; i++) {
                            cell[connectedlayer][i] = [];
                            if (i == (isPrevious ? 0 : (cell.temp.length - 1))) {
                                cell[connectedlayer][i].push(isPrevious ? cell.target : cell.source);
                            }
                            else {
                                cell[connectedlayer][i].push(cell);
                            }
                        }
                    }
                    return cell[connectedlayer][layer - cell.minRank - 1];
                }
            }
        };
        //calculates the rank elements on the specified rank
        CrossReduction.prototype._medianValue = function (connectedCells, rankValue) {
            var medianValues = [];
            var arrayCount = 0;
            for (var i = 0; i < connectedCells.length; i++) {
                var cell = connectedCells[i];
                medianValues[arrayCount++] = this._getTempVariable(cell, rankValue);
            }
            // sorts numerical order sort
            medianValues.sort(function (a, b) { return a - b; });
            if (arrayCount % 2 == 1) {
                // For odd numbers of adjacent vertices return the median
                return medianValues[Math.floor(arrayCount / 2)];
            }
            else if (arrayCount == 2) {
                return ((medianValues[0] + medianValues[1]) / 2.0);
            }
            else {
                var medianPoint = arrayCount / 2;
                var leftMedian = medianValues[medianPoint - 1] - medianValues[0];
                var rightMedian = medianValues[arrayCount - 1]
                        - medianValues[medianPoint];
                return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint] * leftMedian) / (leftMedian + rightMedian);
            }
        };
        //get the temp value of the specified layer
        CrossReduction.prototype._setTempVariable = function (cell, layer, value) {
            if (cell)
                cell.temp[0] = value;
        };
        //used to minimize the node position on this rank and one of its adjacent ranks
        CrossReduction.prototype._medianRank = function (rankValue, downwardSweep) {
            var numCellsForRank = this.nestedBestRanks[rankValue].length;
            var medianValues = [];
            var reservedPositions = [];
            for (var i = 0; i < numCellsForRank; i++) {
                var cell = this.nestedBestRanks[rankValue][i];
                var sorterEntry = { _medianValue: 0, cell: false };
                sorterEntry.cell = cell;
                // Flip whether or not equal medians are flipped on up and down sweeps TODO re-implement some kind of nudge medianValues[i].nudge = !downwardSweep;
                var nextLevelConnectedCells;
                if (downwardSweep) nextLevelConnectedCells = this._getConnectedCellsOnLayer(cell, rankValue);
                else nextLevelConnectedCells = this._getConnectedCellsOnLayer(cell, rankValue, true);
                var nextRankValue;
                downwardSweep ? nextRankValue = rankValue + 1 : nextRankValue = rankValue - 1;
                if (nextLevelConnectedCells != null && nextLevelConnectedCells.length != 0) {
                    sorterEntry._medianValue = this._medianValue(nextLevelConnectedCells, nextRankValue);
                    medianValues.push(sorterEntry);
                }
                else {
                    // Nodes with no adjacent vertices are flagged in the reserved array to indicate they should be left in their current position.
                    reservedPositions[this._getTempVariable(cell, rankValue)] = true;
                }
            }
            medianValues.sort(this._compare);
            // Set the new position of each node within the rank using its temp variable
            for (var i = 0; i < numCellsForRank; i++) {
                if (reservedPositions[i] == null) {
                    var cell = medianValues.shift().cell;
                    this._setTempVariable(cell, rankValue, i);
                }
            }
        };
        //compares two values, it sends the values to the compare function, and sorts the values according to the returned (negative, zero, positive) value
        CrossReduction.prototype._compare = function (a, b) {
            if (a != null && b != null) {
                if (b._medianValue > a._medianValue)
                    return -1;
                else if (b._medianValue < a._medianValue)
                    return 1;
            }
            return 0;
        };
        return CrossReduction;
    })();
    ej.datavisualization.Diagram.CrossReduction = CrossReduction;
    //end region

    var LineDistribution = (function () {
        var edgeMapper = [];
        function LineDistribution() {
            this.edgeMapper = [];
        };
        LineDistribution.prototype._setEdgeMapper = function (value){
            this.edgeMapper.push(value);
        };
        LineDistribution.prototype._getEdgeMapper = function(){
            return this.edgeMapper;
        };
        LineDistribution.prototype._initLineDistribution = function (graph) {            
            var srcDirection = "bottom";
            var tarDirection = "top";

            if (graph.orientation == ej.datavisualization.Diagram.LayoutOrientations.BottomToTop) {
                srcDirection = "top";
                tarDirection = "bottom";
            }
            else if (graph.orientation == ej.datavisualization.Diagram.LayoutOrientations.RightToLeft) {
                srcDirection = "left";
                tarDirection = "right";
            }
            else if (graph.orientation == ej.datavisualization.Diagram.LayoutOrientations.LeftToRight) {
                srcDirection = "right";
                tarDirection = "left";
            }
            var graphnodes = graph.diagram._spatialSearch.parentQuad.objects;
            if (graphnodes.length > 0) {
                for (var i = 0 ; i < graphnodes.length; i++) {
                    var node = graphnodes[i];
                    this._addDynamicPortandDistrrbuteLine(graph, node, srcDirection, tarDirection);
                }
            }
        };
        LineDistribution.prototype._addDynamicPortandDistrrbuteLine = function (layout, node, sourceDirection, targetDirection) {
            if (!(node._ports && node._ports == null)) {
                node._ports = [];
            }
            var existingPorts = node._ports;

            var portColls = [];
            var outConnectors = node.outEdges;
            var inConnectors = node.inEdges;

            for (var name in outConnectors) {
                var internalConnector = layout.diagram.nameTable[outConnectors[name]];
                var sourceNodePort = ej.datavisualization.Diagram.Util.findPortByName(node, internalConnector.sourcePort);
                var direction = sourceDirection;
                if (sourceNodePort == null) {
                    sourceNodePort = ej.datavisualization.Diagram.Port({});
                    sourceNodePort.type = "internal";
                    node._ports.push(sourceNodePort);
                    //delete internalConnector._sourcePortLocation;
                    layout.diagram.updateConnector(internalConnector.name, { sourcePort: sourceNodePort.name });

                    //internalConnector.sourcePort = sourceNodePort;
                }

                if (direction == null) {
                    var pts = internalConnector.segments[0].points;
                    direction = ej.datavisualization.Diagram.Util._getBezierDirection(pts[0], pts[1]);// ej.datavisualization.Diagram.Geometry._findDirection(pts[0], pts[1]);
                }

                portColls.push({ port: sourceNodePort, direction: direction });
            }

            for (var name in inConnectors) {
                var internalConnector = layout.diagram.nameTable[inConnectors[name]];
                var targetNodePort = ej.datavisualization.Diagram.Util.findPortByName(node, internalConnector.targetPort);
                var direction = targetDirection;
                if (targetNodePort == null) {
                    targetNodePort = ej.datavisualization.Diagram.Port({});
                    targetNodePort.type = "internal";
                    node._ports.push(targetNodePort);
                    //delete internalConnector._targetPortLocation;
                    layout.diagram.updateConnector(internalConnector.name, { targetPort: targetNodePort.name });
                }
                if (direction == null) {
                    var pts = internalConnector.segments[0].points;
                    direction = ej.datavisualization.Diagram.Util._getBezierDirection(pts[pts.length - 2], (pts[pts.length - 1]));
                }
                portColls.push({ port: targetNodePort, direction: direction });
            }

            var topPorts = [];
            var leftPorts = [];
            var bottomPorts = [];
            var rightPorts = [];

            for (var key in portColls) {
                var temp = portColls[key];

                if (temp.direction == "top")
                    topPorts.push(temp);
                else if (temp.direction == "left")
                    leftPorts.push(temp);
                else if (temp.direction == "bottom")
                    bottomPorts.push(temp);
                else
                    rightPorts.push(temp);
            }

            if (topPorts.length > 0) {
                for (var i = 0; i < topPorts.length; i++) {
                    var port = topPorts[i].port;
                    port.offset = { x: (i + 1) * (1.0 / (topPorts.length + 1)), y: 0 };
                }
            }

            if (bottomPorts.length > 0) {
                for (var i = 0; i < bottomPorts.length; i++) {
                    var port = bottomPorts[i].port;
                    port.offset = { x: (i + 1) * (1.0 / (bottomPorts.length + 1)), y: 1 };
                }
            }

            if (leftPorts.length > 0) {
                for (var i = 0; i < leftPorts.length; i++) {
                    var port = leftPorts[i].port;
                    port.offset = { x: 0, y: (i + 1) * (1.0 / (leftPorts.length + 1)) };
                }
            }

            if (rightPorts.length > 0) {
                for (var i = 0; i < rightPorts.length; i++) {
                    var port = rightPorts[i].port;
                    port.offset = { x: 1, y: (i + 1) * (1.0 / (rightPorts.length + 1)) };
                }
            }
        };
        LineDistribution.prototype._containsValue = function (list, keyValue) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].key == keyValue || list[i] == keyValue) {
                    return true;
                }
            }
            return false;
        };
        LineDistribution.prototype._distributeLines = function (layout) {
            var isHorizontal = layout.orientation == "lefttoright"
                               || layout.orientation == "righttoleft";
            var inversespacing = !isHorizontal ? layout.verticalSpacing : layout.horizontalSpacing;
            var srcdecoratorSize = 8.0, tardecoratorSize = 10.0;
            var avaibaleSpace = inversespacing - srcdecoratorSize - tardecoratorSize;
            var graph = [];// new SortedList<double, List<ObstacleSegment>>();
            var connectorObstacles = [];//new List<ConnectorObstacle>();
            var globalConnectors = layout.diagram.connectors();
            for (var i = 0; i < globalConnectors.length; i++)  //foreach (var connector in this.Graph.SharedData.GlobalConnectors.Values)
            {
                var connector = globalConnectors[i];
                var pts = [];
                for (var key in connector.segments) {
                    var seg = connector.segments[key];
                    for (var k in seg.points) {
                        var pt = seg.points[k];
                        if (pts.length == 0 || !(ej.datavisualization.Diagram.Geometry.isEqualPoint(pt, pts[pts.length - 1])))
                            pts.push(pt);
                    }
                }
                var obssegments = [];
                for (var j = 1; j < pts.length; j++) {
                    var obstacle = ej.datavisualization.Diagram.ObstacleSegment({ startpt: pts[j - 1], endpt: pts[j], id: connector.id });
                    obssegments.push(obstacle);
                }

                var connectorObstacle = { wrapper: connector, segments: obssegments };
                var segments = [];
                if (!isHorizontal) {
                    for (var key in connectorObstacle.segments) {
                        var obstacle = connectorObstacle.segments[key];
                        if (obstacle.orientation == "horizontal")
                            segments.push(obstacle);
                    }
                }
                else {
                    for (var key in connectorObstacle.segments) {
                        var obstacle = connectorObstacle.segments[key];
                        if (obstacle.orientation == "vertical")
                            segments.push(obstacle);
                    }
                }

                for (var j = 0; j < segments.length; j++) {
                    var obstacleSegment = segments[j];
                    if (!this._containsValue(graph, obstacleSegment.coord)) {//  !graph.ContainsKey(obstacleSegment.Coord)) {
                        graph.push({ key: obstacleSegment.coord, value: [] });
                    }

                    var index;
                    for (var k in graph) {
                        var key = graph[k].key;
                        if (key == obstacleSegment.coord) {
                            index = k;
                            break;
                        }
                    }
                    graph[index].value.push(obstacleSegment);
                }

                connectorObstacles.push(connectorObstacle);
            }

            var modifiedgrap = [];// new SortedList<double, List<ObstacleSegment>>();
            for (var m = 0; m < graph.length; m++) {
                var row = graph[m];
                var sortedrow = row.value;//.OrderBy(e => e.Start);
                sortedrow.sort(function (a, b) { return a.start - b.start });

                var groupby = [];

                var index = 0;

                var maxEnd = Number.MIN_VALUE;
                groupby.push([]);
                for (var n = 0 ; n < sortedrow.length; n++) {
                    var obstacleSegment = sortedrow[n];
                    if (!(groupby[index].length > 0) || maxEnd >= obstacleSegment.start) {
                        groupby[index].push(obstacleSegment);
                        maxEnd = Math.max(maxEnd, groupby[index][groupby[index].length - 1].end);
                    }
                    else {
                        index++;
                        groupby.push([]);
                        groupby[index].push(obstacleSegment);
                        maxEnd = groupby[index][groupby[index].length - 1].end;
                    }
                }

                for (var n = 0 ; n < groupby.length; n++) {
                    var group = groupby[n];
                    var sortedGroup = [];//group.Value.OrderBy(e => e.Start).ToList();
                    for (var j = 0; j < group.length; j++) {
                        var e = group[j];
                        if (e.start)
                            sortedGroup.push(e);
                    }
                    var comparingDir = isHorizontal ? "bottom" : "right";

                    var directed = [];//sortedGroup.Where(e => e.Direction == comparingDir).ToList();
                    for (var j = 0; j < sortedGroup.length; j++) {
                        var e = sortedGroup[j];
                        if (e.direction == comparingDir)
                            directed.push(e);
                    }

                    var reversedirected = [];//sortedGroup.Where(e => e.Direction != comparingDir).ToList();
                    for (var j = 0; j < sortedGroup.length; j++) {
                        var e = sortedGroup[j];
                        if (e.direction != comparingDir)
                            reversedirected.push(e);
                    }

                    var mutual = [];//new List<ObstacleSegment>();
                    if (directed.length > 0) {
                        var temp = directed[0].start;

                        var j = 0;
                        while (j < reversedirected.length) {
                            if (reversedirected[j].end > temp) {
                                mutual.push(reversedirected[j]);
                                reversedirected.splice(j, 1);
                            }
                            else {
                                j++;
                            }
                            for (var i = 0; i < layout.diagram.model.connectors.length; i++) {
                                delete layout.diagram.model.connectors[i]._visited;
                                for (var j = 0; j < layout.diagram.model.connectors.length; j++) {
                                    delete layout.diagram.model.connectors[j]._visited;
                                }
                                for (var j = 0; j < layout.diagram.model.nodes.length; j++) {
                                    delete layout.diagram.model.nodes[j]._visited1;
                                    delete layout.diagram.model.nodes[j]._isRightAdded;
                                }
                            }
                        }
                    }
                    var mutualRow = [];// new Dictionary<int, List<ObstacleSegment>>();
                    mutualRow = this._updateSegmentRow(mutual, mutualRow);

                    var directedRow = [];//new Dictionary<int, List<ObstacleSegment>>();
                    directedRow = this._updateSegmentRow(reversedirected, directedRow);
                    directed.reverse();
                    directedRow = this._updateSegmentRow(directed, directedRow);


                    if (!mutualRow[mutualRow.length - 1].length > 0) {
                        mutualRow.splice(mutualRow.length - 1, 1);
                    }

                    if (!directedRow[directedRow.length - 1].length > 0) {
                        directedRow.splice(directedRow.length - 1, 1);
                    }

                    var subrow = [];// new Dictionary<int, List<ObstacleSegment>>();
                    var descAdding = mutual.length > 0 && (sortedGroup[0].direction == mutual[0].direction
                                                      || sortedGroup[sortedGroup.length - 1].direction == mutual[mutual.length - 1].direction);
                    if (descAdding) {
                        subrow = directedRow;
                        for (var p = 0; p < mutualRow.length; p++) {
                            var obj = mutualRow[p];
                            subrow[subrow.length] = obj;
                        }
                        for (var j = 0; j < layout.diagram.model.nodes.length; j++) {
                            delete layout.diagram.model.nodes[j]._visited1;
                            delete layout.diagram.model.nodes[j]._isRightAdded;
                        }
                    }
                    else {
                        subrow = mutualRow;
                        for (var p = 0; p < directedRow.length; p++) {
                            var obj = directedRow[p];
                            subrow[subrow.length] = obj;
                        }
                    }

                    if (subrow.length > 1) {
                        var directionModifier = 1;
                        if (layout.orientation == "bottomtotop"
                            || layout.orientation == "righttoleft") {
                            directionModifier = -1;
                        }

                        var startCoord = row.key - (directionModifier * avaibaleSpace / 2.0);
                        var diff = avaibaleSpace / subrow.length;

                        for (var i = 0; i < subrow.length; i++) {
                            var newcoord = startCoord + (i * diff * directionModifier);
                            for (var p = 0; p < subrow[i].length; p++) {
                                var obstacleSegment = subrow[i][p];
                                obstacleSegment.coord = newcoord;
                                if (!this._containsValue(modifiedgrap, obstacleSegment.coord)) {  //!modifiedgrap.ContainsKey(obstacleSegment.Coord)) {
                                    modifiedgrap.push({ key: obstacleSegment.coord, value: [] });
                                }
                                var index;
                                for (var k in modifiedgrap) {
                                    var key = modifiedgrap[k].key;
                                    if (key == obstacleSegment.coord) {
                                        index = k;
                                        break;
                                    }
                                }
                                modifiedgrap[index].value.push(obstacleSegment);
                            }
                        }
                    }
                }
            }

            for (var m = 0; m < connectorObstacles.length; m++) {
                var connectorObstacle = connectorObstacles[m];
                var pts = [];//new List<Point>();
                for (var i = 0; i < connectorObstacle.segments.length; i++) {
                    if (i == 0) {
                        pts.push(this._getObstacleStartPoint(connectorObstacle.segments[i]));
                    }
                    else if (isHorizontal) {
                        if (connectorObstacle.segments[i].orientation == "vertical") {
                            pts[pts.length - 1] = this._getObstacleStartPoint(connectorObstacle.segments[i]);
                        }
                    }
                    else if (!isHorizontal) {
                        if (connectorObstacle.segments[i].orientation == "horizontal") {
                            pts[pts.length - 1] = this._getObstacleStartPoint(connectorObstacle.segments[i]);
                        }
                    }

                    pts.push(this._getObstacleEndPoint(connectorObstacle.segments[i]));
                }

                //connectorObstacle.Wrapper.Points =
                //    pts.Select(p => new Syncfusion.Base.Diagram.Primitives.Point(p.X, p.Y)).ToList();
                connectorObstacle.wrapper._pointCollection = [];
                for (j = 0; j < pts.length; j++) {
                    var p = pts[j];
                    if (j == 0 || (j > 0 && !(ej.datavisualization.Diagram.Geometry.isEqualPoint(p, pts[j - 1]))))
                        connectorObstacle.wrapper._pointCollection.push(new ej.datavisualization.Diagram.Point(p.x, p.y));
                }
                this._resetConnectorPoints(connectorObstacle.wrapper, layout.diagram);
                delete connectorObstacle.wrapper._pointCollection;
            }
        };        
        LineDistribution.prototype._getObstacleStartPoint = function (segment) {
            if (segment.orientation == "horizontal") {
                if (segment.direction == "left") {
                    return new ej.datavisualization.Diagram.Point(segment.end, segment.coord);
                }

                return new ej.datavisualization.Diagram.Point(segment.start, segment.coord);
            }

            if (segment.direction == "top") {
                return new ej.datavisualization.Diagram.Point(segment.coord, segment.end);
            }

            return new ej.datavisualization.Diagram.Point(segment.coord, segment.start);
        };
        LineDistribution.prototype._getObstacleEndPoint = function (segment) {
            if (segment.orientation == "horizontal") {
                if (segment.direction == "left") {
                    return new ej.datavisualization.Diagram.Point(segment.start, segment.coord);
                }

                return new ej.datavisualization.Diagram.Point(segment.end, segment.coord);
            }

            if (segment.direction == "top") {
                return new ej.datavisualization.Diagram.Point(segment.coord, segment.start);
            }

            return new ej.datavisualization.Diagram.Point(segment.coord, segment.end);
        };
        LineDistribution.prototype._updateSegmentRow = function (obstacleSegments, segmentRow) {
            var k = 0;
            if (!(segmentRow.length > 0)) {
                segmentRow[0] = [];
            }

            for (var i = 0; i < obstacleSegments.length; i++) {
                var obstacleSegment = obstacleSegments[i];
                while (k < segmentRow.length) {
                    if (k == segmentRow.length - 1) {
                        segmentRow[k + 1] = [];
                    }

                    if (!(segmentRow[k].length > 0) || segmentRow[k][segmentRow[k].length - 1].end < obstacleSegment.start) {
                        segmentRow[k].push(obstacleSegment);
                        break;
                    }

                    k++;
                }
            }
            return segmentRow;
        };
        LineDistribution.prototype._resetConnectorPoints = function (edge, diagram) {
            if (edge._pointCollection && edge._pointCollection.length > 0) {
                var connector = edge;
                connector.segments = [];
                connector.sourcePoint = edge._pointCollection[0];
                connector.targetPoint = edge._pointCollection[edge._pointCollection.length - 1];
                var points = [];
                var segments = [];
                for (var i = 0; i < edge._pointCollection.length - 1; i++) {
                    var point1 = edge._pointCollection[i];
                    var point2 = edge._pointCollection[i + 1];
                    var length = ej.datavisualization.Diagram.Geometry.distance(point1, point2);
                    var direction = ej.datavisualization.Diagram.Util._getBezierDirection(point1, point2);
                    segments.push({ length: length, direction: direction, type: "orthogonal" });
                }
                diagram.updateConnector(connector.name, { segments: segments });
            }
        };
        LineDistribution.prototype._updateConnectorPoints = function (connectorPoints, startSegmentSize, intermediatePoint, layoutBounds) {
            var isHorizontal = this.orientation == "lefttoright"
                             || this.orientation == "righttoleft";
            var pts = connectorPoints;
            if (pts.length > 2) {
                var newPt = ej.datavisualization.Diagram.Geometry.transform(pts[0], ej.datavisualization.Diagram.Util.findAngle(pts[0], pts[1]), startSegmentSize);   //pts[0].Transform(startSegmentSize, pts[0].FindAngle(pts[1]));
                var nextPt = ej.datavisualization.Diagram.Geometry.transform(newPt, ej.datavisualization.Diagram.Util.findAngle(pts[1], pts[2]), ej.datavisualization.Diagram.Util.findLength(pts[1], pts[2]));// newPt.Transform(pts[1].FindLength(pts[2]), pts[1].FindAngle(pts[2]));
                pts.splice(1, 2, newPt, nextPt);
                if (intermediatePoint != null) {
                    var index = 2;
                    var ptsCount = pts.length;
                    var newPt1 = ej.datavisualization.Diagram.Geometry.transform(
                        pts[ptsCount - 1],
                        ej.datavisualization.Diagram.Util.findAngle(pts[ptsCount - 1], pts[ptsCount - 2]),
                        startSegmentSize);
                    pts.splice(ptsCount - 1, 0, newPt1);
                    while (index < (pts.length - 2)) {
                        pts.splice(index, 1);
                    }

                    var edgePt = intermediatePoint;
                    ej.datavisualization.Diagram.Geometry.inflate(layoutBounds, layoutBounds.width, layoutBounds.height);

                    var line1 = [];
                    line1[0] = new ej.datavisualization.Diagram.Point(edgePt.x, layoutBounds.y);
                    line1[1] = new ej.datavisualization.Diagram.Point(edgePt.x, layoutBounds.y + layoutBounds.height);

                    var line2 = [];
                    line2[0] = new ej.datavisualization.Diagram.Point(layoutBounds.x, pts[1].y);
                    line2[1] = new ej.datavisualization.Diagram.Point(layoutBounds.x + layoutBounds.width, pts[1].y);

                    var line3 = [];
                    line3[0] = new ej.datavisualization.Diagram.Point(layoutBounds.x, newPt1.y);
                    line3[1] = new ej.datavisualization.Diagram.Point(layoutBounds.x + layoutBounds.width, newPt1.y);


                    if (isHorizontal) {
                        line1[0] = new ej.datavisualization.Diagram.Point(layoutBounds.x, edgePt.y);
                        line1[1] = new ej.datavisualization.Diagram.Point(layoutBounds.x + layoutBounds.width, edgePt.y);

                        line2[0] = new ej.datavisualization.Diagram.Point(pts[1].x, layoutBounds.y);
                        line2[1] = new ej.datavisualization.Diagram.Point(pts[1].x, layoutBounds.y + layoutBounds.height);

                        line3[0] = new ej.datavisualization.Diagram.Point(newPt1.x, layoutBounds.y);
                        line2[1] = new ej.datavisualization.Diagram.Point(newPt1.x, layoutBounds.y + layoutBounds.height);
                    }

                    var intercepts1 = [ej.datavisualization.Diagram.Util.interSect2(line1[0], line1[1], line2[0], line2[1])];
                    var intercepts2 = [ej.datavisualization.Diagram.Util.interSect2(line1[0], line1[1], line3[0], line3[1])];

                    if (intercepts2.length > 0) {
                        pts.splice(2, 0, intercepts2[0]);
                    }

                    if (intercepts1.length > 0) {
                        pts.splice(2, 0, intercepts1[0]);
                    }
                }
            }

            var i = 1;
            while (i < pts.length - 1) {
                if (ej.datavisualization.Diagram.Geometry.isEqualPoint(pts[i - 1], pts[i])) {
                    pts.splice(i, 1);
                }
                else if (ej.datavisualization.Diagram.Util.findAngle(pts[i - 1], pts[i]) == ej.datavisualization.Diagram.Util.findAngle(pts[i], pts[i + 1])) {
                    pts.splice(i, 1);
                }
                else {
                    i++;
                }
            }

            return pts;
        };
        LineDistribution.prototype._updateMutualSharing = function (cell, id)
        {
            if (cell.identicalSibilings != null)
            {
                cell.identicalSibilings.push(id);
            }
            else
            {
                cell.identicalSibilings = [];
                cell.identicalSibilings.push(id);
            }
        };
        LineDistribution.prototype._groupLayoutCells = function (matrixModel) {
            var ranks = matrixModel.model.ranks;
            for (var j = ranks.length - 1; j >= 0; j--) {
                var vertices = [];
                for (var v = 0 ; v < ranks[j].length; v++) {
                    var rank = ranks[j][v];
                    var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(rank.type);
                    if (type === "internalVertex")
                        vertices.push(ranks[j][v]);
                }

                var edges = [];
                for (var e = 0 ; e < ranks[j].length; e++) {
                    var rank = ranks[j][e];
                    var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(rank.type);
                    if (type === "internalEdge")
                        edges.push(rank);
                }

                while (vertices.length > 1) {
                    var vertex1 = vertices[0];
                    var parentset1 = this._selectIds(vertex1.connectsAsTarget, true); //  internalVertex.connectsAsTarget.Select(e => e.Source.ID);
                    var childset1 = this._selectIds(vertex1.connectsAsSource, false); //internalVertex.connectsAsSource.Select(e => e.Target.ID);
                    while (vertices.length > 1) {
                        var vertex2 = vertices[1];
                        var parentset2 = this._selectIds(vertex2.connectsAsTarget, true); // internalVertex1.connectsAsTarget.Select(e => e.Source.ID);
                        var childset2 = this._selectIds(vertex2.connectsAsSource, false);  // internalVertex1.connectsAsSource.Select(e => e.Target.ID);
                        var parentequals = this._compareLists(parentset1, parentset2);
                        var childequals = this._compareLists(childset1, childset2);
                        if (parentequals && childequals) {
                            this._updateMutualSharing(vertices[0], vertex2.id);
                            this._updateMutualSharing(vertices[1], vertex1.id);
                            vertices.splice(1, 1);
                            continue;
                        }
                        break;
                    }
                    vertices.splice(0, 1);
                }


                while (edges.length > 1) {
                    var internalEdge = edges[0];
                    var parentset = internalEdge.source;
                    var childset = internalEdge.target;
                    if (parentset.identicalSibilings != null) {

                        var groupedges = [];

                        for (var i = 0; i < edges.length; i++) {
                            var edge = edges[i];
                            if (edge.target == childset) {
                                groupedges.push(edge);
                            }
                        }

                        for (var i = 0 ; i < groupedges.length; i++) {
                            var internalEdgese = groupedges[i];
                            if (this._containsValue(parentset.identicalSibilings, internalEdgese.source.id)) {
                                internalEdgese.Source.identicalSibilings = null;
                            }
                        }
                        internalEdge.source.identicalSibilings = null;
                    }
                    edges.splice(0, 1);
                }
            }
        };
        LineDistribution.prototype._selectIds = function (node, source) {
            var returnIds = [];
            for (var i = 0; i < node.length; i++) {
                var connector = node[i];
                if (source) {
                    returnIds.push(connector.source.id);
                }
                else {
                    returnIds.push(connector.target.id);
                }
            }
            return returnIds;
        };
        LineDistribution.prototype._createMatrixCells = function (matrixModel) {
            var layoutSettings = matrixModel.model.layout;
            var isHorizontal = layoutSettings.orientation == "lefttoright"
                               || layoutSettings.orientation == "righttoleft";
            var spacing = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
            var spacingInverse = !isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
            
            var ranks = matrixModel.model.ranks;
            var matrixCellMapper = [];// new Dictionary<int, Dictionary<object, MatrixCellGroup>>();
            var rowoffset = -spacingInverse;
            for (var j = ranks.length - 1; j >= 0; j--) {
                var maxDimension = 0.0;
                var index = (ranks.length - 1) - j;
                var rank = ranks[j].slice();//.ToList();

                // Creating new row and adding it to matrix
                var matrixRow = [];//new List<MatrixCellGroup>();                
                matrixModel.matrix.push({ key: index, value: matrixRow });

                // Creating new row mapper
                var tempMatrixRow = [];//new Dictionary<object, MatrixCellGroup>();
                matrixCellMapper.push({ index: index, value: tempMatrixRow });

                while (rank.length > 0) //.Any())
                {
                    var layoutCell = rank[0];
                    var matrixCell = ej.datavisualization.Diagram.MatrixCellGroup({ level: index, parents: [], children: [], visitedParents: [], visitedChildren: [], ignoredChildren: [], cells: [], size: 0, offset: 0, initialOffset: 0 });
                    matrixRow.push(matrixCell);
                    var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(layoutCell.type);
                    if (type === "internalVertex")//is InternalVertex)
                    {
                        matrixCell.cells.push(layoutCell);
                        if (layoutCell.identicalSibilings != null) {
                            for (var i = 0 ; i < rank.length; i++) //foreach (var internalVertex in rank.OfType<InternalVertex>())
                            {
                                var internalVertex = rank[i];
                                var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(internalVertex.type);

                                if (type === "internalVertex" && this._containsValue(layoutCell.identicalSibilings, internalVertex.id)) {
                                    matrixCell.cells.push(internalVertex);
                                    if (matrixCell.cells.length > layoutCell.identicalSibilings.length) {
                                        break;
                                    }
                                }
                            }
                        }

                        for (var i = 0; i < matrixCell.cells.length; i++)// foreach (var internalVertex in matrixCell.Cells.OfType<InternalVertex>())
                        {
                            var internalVertex = matrixCell.cells[i];
                            var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(internalVertex.type);
                            if (type === "internalVertex") {
                                var geometry = internalVertex.cell.geometry;
                                matrixCell.size += isHorizontal ? geometry.height : geometry.width;
                                maxDimension = Math.max(maxDimension, !isHorizontal ? geometry.height : geometry.width);
                                tempMatrixRow.push({ key: internalVertex.id, value: matrixCell });
                                if (internalVertex.connectsAsTarget.length > 0) {
                                    for (var k = 0; k < internalVertex.connectsAsTarget.length; k++) //foreach (var internalEdgese in internalVertex.ConnectsAsTarget)
                                    {
                                        var internalEdgese = internalVertex.connectsAsTarget[k];
                                        var key = null;
                                        if (this._containsValue(matrixCellMapper[index - 1].value, internalEdgese.ids)) { //matrixCellMapper[index - 1].ContainsKey(internalEdgese.ids)) {
                                            key = internalEdgese.ids;
                                        }
                                        else if (this._containsValue(matrixCellMapper[index - 1].value, internalEdgese.source.id)) { //matrixCellMapper[index - 1].ContainsKey(internalEdgese.Source.ID)) {
                                            key = internalEdgese.source.id;
                                        }

                                        if (key != null) {
                                            var parentcell = matrixCellMapper[index - 1].value;
                                            var parentMartixCell;
                                            for (var v = 0 ; v < parentcell.length; v++) {
                                                if (parentcell[v].key == key) {
                                                    parentMartixCell = parentcell[v].value;
                                                    break;
                                                }
                                            }
                                            if (!this._containsValue(matrixCell.parents, parentMartixCell)) { //   !matrixCell.Parents.Contains(parentMartixCell)) {
                                                matrixCell.parents.push(parentMartixCell);
                                            }

                                            if (!this._containsValue(parentMartixCell.children, matrixCell)) { //!parentMartixCell.Children.Contains(matrixCell)) {
                                                parentMartixCell.children.push(matrixCell);
                                            }
                                        }
                                    }
                                }
                                rank.reverse();
                                rank.pop();
                                rank.reverse();
                            }
                        }
                        matrixCell.size += (matrixCell.cells.length - 1) * spacing;
                    }
                    else if (type === "internalEdge")
                    {
                        matrixCell.cells.push(layoutCell);

                        for (var i = 0; i < matrixCell.cells.length; i++) //  foreach (var internalEdge in matrixCell.Cells.OfType<InternalEdges>())
                        {
                            var internalEdge = matrixCell.cells[i];
                            var type1 = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(internalEdge.type);

                            if (type1 === "internalEdge" && internalEdge.edges != null) {
                                // need to spacing based on its source and target Node
                                var edgeSpacing = 5;
                                var cellSize = -edgeSpacing;
                                for (var k = 0; k < internalEdge.edges.length; k++)  //foreach (var internalConnector in internalEdge.Edges)
                                {
                                    var internalConnector = internalEdge.edges[k];
                                    // need to summ up the line width
                                    cellSize += 1 + edgeSpacing;
                                }

                                matrixCell.size += cellSize;
                            }

                            tempMatrixRow.push({ key: internalEdge.ids, value: matrixCell });

                            var key = null;
                            if (this._containsValue(matrixCellMapper[index - 1].value, internalEdge.ids)) {     //matrixCellMapper[index - 1].ContainsKey(internalEdge.ids)) {
                                key = internalEdge.ids;
                            }
                            else if (this._containsValue(matrixCellMapper[index - 1].value, internalEdge.source.id)) {  //matrixCellMapper[index - 1].ContainsKey(internalEdge.Source.ID)) {
                                key = internalEdge.source.id;
                            }

                            if (key != null) {
                                var parentcell = matrixCellMapper[index - 1].value;
                                var parentMartixCell;
                                for (var v = 0 ; v < parentcell.length; v++) {
                                    if (parentcell[v].key == key) {
                                        parentMartixCell = parentcell[v].value;
                                        break;
                                    }
                                }
                                if (!this._containsValue(matrixCell.parents, parentMartixCell)) {//   !matrixCell.Parents.Contains(parentMartixCell)) {
                                    matrixCell.parents.push(parentMartixCell);
                                }

                                if (!this._containsValue(parentMartixCell.children, matrixCell)) {//!parentMartixCell.Children.Contains(matrixCell)) {
                                    parentMartixCell.children.push(matrixCell);
                                }
                            }

                            rank.reverse();
                            rank.pop();
                            rank.reverse();
                        }

                        matrixCell.size += (matrixCell.cells.length - 1) * spacing;
                    }
                }

                matrixModel.rowOffset.push(rowoffset + (maxDimension / 2) + spacingInverse);
                rowoffset += maxDimension + spacingInverse;
            }
        };
        LineDistribution.prototype._setXYforMatrixCell = function (matrixModel) {
            var layoutSettings = matrixModel.model.layout;
            var isHorizontal = layoutSettings.orientation == "lefttoright"
                               || layoutSettings.orientation == "righttoleft";
            var spacing = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

            for (var i = 0; i < matrixModel.matrix.length; i++) //foreach (var matrixrow1 in matrixModel.Matrix.Values)  //i
            {
                var matrixrow1 = matrixModel.matrix[i].value;
                for (var j = 0; j < matrixrow1.length; j++) //  foreach (var matrixCell in matrixrow1) //j
                {
                    var matrixCell = matrixrow1[j];
                    var start = matrixCell.offset - (matrixCell.size / 2);
                    for (var k = 0; k < matrixCell.cells.length; k++) // foreach (var cell in matrixCell.Cells) //k
                    {
                        var cell = matrixCell.cells[k];
                        var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(cell.type);
                        if (type === "internalVertex") {
                            var internalVertex = cell;
                            var width = internalVertex.cell.geometry.width;
                            var height = internalVertex.cell.geometry.height;
                            if (isHorizontal) {
                                internalVertex.cell.geometry = new ej.datavisualization.Diagram.Rectangle(
                                    matrixModel.rowOffset[matrixCell.level] - (width / 2),
                                    start,
                                    width,
                                    height);
                            }
                            else {
                                internalVertex.cell.geometry = new ej.datavisualization.Diagram.Rectangle(
                                    start,
                                    matrixModel.rowOffset[matrixCell.level] - (height / 2),
                                    width,
                                    height);
                            }

                            start += (isHorizontal ? height : width) + spacing;
                        }
                        else if (type === "internalEdge") {
                            var internalEdges = cell;
                            var parent = matrixCell.visitedParents[0];
                            var isContainSibilingVertex = false;
                            for (var l = 0; l < parent.visitedChildren.length; l++) {
                                var children = parent.visitedChildren[l];
                                var cells = [];
                                for (var m = 0; m < children.cells.length; m++) {
                                    var cell = children.cells[m];
                                    var type = ej.datavisualization.Diagram.MultiParentModel.prototype._getType(cell.type);
                                    if (type === "internalVertex") {
                                        cells.push(cell);
                                    }
                                }
                                if (cells.length > 0) {
                                    isContainSibilingVertex = true;
                                    break;
                                }
                            }

                            // Need to updated line width
                            var lineWidth = 1, edgeSpacing = 5;
                            for (var m = 0; m < internalEdges.edges.length; m++) {
                                var internalConnector = internalEdges.edges[m];
                                var pt = new ej.datavisualization.Diagram.Point(start + (lineWidth / 2.0), matrixModel.rowOffset[matrixCell.Level]);
                                if (isHorizontal) {
                                    pt = new ej.datavisualization.Diagram.Point(matrixModel.rowOffset[matrixCell.level], start + (lineWidth / 2.0));
                                }
                                
                                if (this._containsValue(this._getEdgeMapper(), internalConnector)) {  //matrixModel.Model.Layout.EdgesMapper.ContainsKey(internalConnector)) {
                                    var key;
                                    for (var l = 0; l < this._getEdgeMapper().length; l++)
                                    {
                                        if (this._getEdgeMapper()[l].key == internalConnector) {
                                            key = l;
                                            break;
                                        }
                                    }
                                    this._getEdgeMapper()[key].value.push(pt);
                                }

                                start += lineWidth + edgeSpacing;
                            }

                            start += spacing;
                        }
                    }
                }
            }
        };
        LineDistribution.prototype._arrangeElements = function (matrixModel) {
            var layoutSettings = matrixModel.model.layout;
            var isHorizontal = layoutSettings.orientation == ej.datavisualization.Diagram.LayoutOrientations.LeftToRight
            || layoutSettings.orientation == ej.datavisualization.Diagram.LayoutOrientations.RightToLeft;

            var spacing = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
            var spacingInverse = !isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;
            // Need to group element before
            this._groupLayoutCells(matrixModel);
            this._createMatrixCells(matrixModel);
           
            for (var j = 0; j < matrixModel.matrix.length; j++) { // foreach (var matrixKey in this.matrix.Keys)
                var matrixKey = matrixModel.matrix[j].key;
                var matrixrow = matrixModel.matrix[matrixKey].value;
                for (var i = 1; i < matrixrow.length; i++) {
                    var cell = matrixrow[i];
                    var prevCell = matrixrow[i - 1];
                    cell.offset += prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
                }
            }


            for (var j = 0; j < matrixModel.matrix[0].value.length; j++) {
                var root = matrixModel.matrix[0].value[j];
                this._arrangeMatrix(root, null, matrixModel);
            }

            for (var k = 0; k < matrixModel.matrix.length; k++) {
                var row = matrixModel.matrix[k].value;
                for (var i = 0; i < row.length; i++) {
                    var cell = row[i];
                    if (cell.visitedParents.length > 1) {
                        var firstParent = cell.visitedParents[0];
                        var lastParent = cell.visitedParents[cell.visitedParents.length - 1];
                        var firstVertexParent = this._findParentVertexCellGroup(firstParent);
                        var lastVertexParent = this._findParentVertexCellGroup(lastParent);

                        if (firstParent != firstVertexParent && firstVertexParent.offset < firstParent.offset)
                        {
                            firstParent = firstVertexParent;
                        }

                        if (lastParent != lastVertexParent && lastVertexParent.offset > lastParent.offset)
                        {
                            lastParent = firstVertexParent;
                        }

                        var newoffset = (firstParent.offset + lastParent.offset) / 2;
                        var availOffsetMin = cell.initialOffset, availOffsetMax = cell.offset;
                        if (!(availOffsetMax == availOffsetMin))
                        {
                            if (newoffset >= availOffsetMin && newoffset <= availOffsetMax)
                            {
                                this._translateMatrixCells(newoffset - cell.offset, cell);
                            }
                            else if (newoffset < availOffsetMin)
                            {
                                this._translateMatrixCells(availOffsetMin - cell.offset, cell);
                            }
                        }
                    }
                }
            }

            this._setXYforMatrixCell(matrixModel);
        };
        LineDistribution.prototype._findParentVertexCellGroup = function (cell) {
            if (cell.cells[0]) {
                return cell;
            }

            if (cell.parents.length > 0) {
                return this._findParentVertexCellGroup(cell.parents[0]);
            }

            return cell;
        };
        LineDistribution.prototype._translateMatrixCells = function (value, cell)
        {
            if (!(value == 0)) {
                cell.offset += value;
                if (cell.visitedChildren.length > 0) {
                    for (var i = 0 ; i < cell.visitedChildren.length; i++) //foreach (var cellVisitedChild in cell.visitedChildren)
                    {
                        var cellVisitedChild = cell.visitedChildren[i];
                        this._translateMatrixCells(value, cellVisitedChild);
                    }
                }
            }
        };
        LineDistribution.prototype._arrangeMatrix = function (cell, parent, matrixModel) {
            var layoutSettings = matrixModel.model.layout;
            var isHorizontal = layoutSettings.orientation == "lefttoright"
                               || layoutSettings.orientation == "righttoleft";
            var spacing = isHorizontal ? layoutSettings.verticalSpacing : layoutSettings.horizontalSpacing;

            var matrix = matrixModel.matrix;
            var matrixRow = matrix[cell.level].value;
            var matrixIndex = matrixRow.indexOf(cell);

            if (cell.visitedParents.length > 0) {
                if (cell.visitedParents.length == 1) {
                    cell.initialOffset = cell.offset;
                }

                if (matrixIndex + 1 < matrixRow.length) {
                    var nextCell = matrixRow[matrixIndex + 1];
                    if (nextCell.visitedParents.length > 0) {
                        if (!this._containsValue(cell.visitedParents, parent)) {   //   !cell.VisitedParents.Contains(parent)) {
                            cell.visitedParents.push(parent);
                            parent.ignoredChildren.push(cell);
                            return;
                        }
                    }
                }
            }

            if (!(cell.children.length > 0))//!cell.Children.Any())
            {
                var validOffset = cell.offset;
                if (matrixIndex > 0) {
                    var prevCell = matrixRow[matrixIndex - 1];
                    validOffset = prevCell.offset + (prevCell.size / 2) + spacing + (cell.size / 2);
                }

                this._shiftMatrixCells(validOffset - cell.offset, cell, false, null, matrixModel);
            }
            else {
                for (var i = 0 ; i < cell.children.length; i++)// foreach (var matrixCellChild in cell.Children)
                {
                    var matrixCellChild = cell.children[i];
                    if (!this._containsValue(cell.visitedChildren, matrixCellChild)) {  //!cell.visitedChildren.Contains(matrixCellChild)) {
                        this._arrangeMatrix(matrixCellChild, cell, matrixModel);
                        cell.visitedChildren.push(matrixCellChild);
                    }
                }

                if (cell.visitedChildren.length > 0)//.Any())
                {
                    var children = cell.visitedChildren.slice();
                    for (var i = 0 ; i < cell.ignoredChildren.length; i++)  //foreach (var cellIgnoredChild in cell.IgnoredChildren)
                    {
                        var cellIgnoredChild = cell.ignoredChildren[i];
                        children.splice(i, 1, cellIgnoredChild);//.Remove(cellIgnoredChild);
                    }

                    if (children.length > 0) {
                        var firstChild = cell.visitedChildren[0];
                        var lastChild = cell.visitedChildren[cell.visitedChildren.length -1];
                        var x1 = firstChild.offset - (firstChild.size / 2);
                        var x2 = lastChild.offset + (lastChild.size / 2);
                        var newoffset = (x1 + x2) / 2;
                        if (newoffset < cell.offset) {
                            this._shiftMatrixCells(cell.offset - newoffset, firstChild, true, cell, matrixModel);
                        }
                        else if (newoffset > cell.offset) {
                            this._shiftMatrixCells(newoffset - cell.offset, cell, false, null, matrixModel);
                        }
                    }
                }
            }

            if (!this._containsValue(cell.visitedParents, parent)) {   //  !cell.VisitedParents.Contains(parent))
                cell.visitedParents.push(parent);
            }
        };
        LineDistribution.prototype._shiftMatrixCells = function (value, startingCell, shiftChildren, parentCell, matrixModel) {
            if (!(value == 0)) {
                var matrix = matrixModel.matrix;
                var matrixRow = matrix[startingCell.level].value;
                var index = matrixRow.indexOf(startingCell);

                for (var i = index; i < matrixRow.length; i++) {
                    matrixRow[i].offset += value;
                }

                if (shiftChildren) {
                    if (startingCell.visitedChildren.length > 0) {
                        this._shiftMatrixCells(
                            value,
                            startingCell.visitedChildren[0],
                            true,
                            startingCell,
                            matrixModel);
                    }
                    else {
                        var i = 1;
                        var nextSibilingwithChild = null;
                        while (index + i < matrixRow.length) {
                            var nextCell = matrixRow[index + i];
                            if (parentCell != null && this._containsValue(nextCell.visitedParents, parentCell)) {   // nextCell.VisitedParents.Contains(parentCell)) {
                                if (nextCell.visitedChildren.length > 0) {
                                    nextSibilingwithChild = nextCell;
                                }
                                else {
                                    i++;
                                    continue;
                                }
                            }

                            break;
                        }

                        if (nextSibilingwithChild != null) {
                            this._shiftMatrixCells(
                                value,
                                nextSibilingwithChild.visitedChildren[0],                                
                                true,
                                nextSibilingwithChild,
                                matrixModel);
                        }
                    }
                }
            }
        };
        LineDistribution.prototype._compareLists = function (list1, list2) {
            var newList1 = list1.slice();
            var newList2 = list2.slice();
            if (newList1.length == newList2.length) {
                if (newList1.length == 0) {
                    return true;
                }
                else {
                    var isSame = true;
                    for (var i = 0; i < newList2.length; i++)// foreach (var o in newList2)
                    {
                        var o = newList2[i];
                        for (var j = i ; j < newList1.length; j++) {
                            if (!(newList1[j] == o)) {
                                isSame = false;
                                break;
                            }
                        }
                    }

                    return isSame;
                }
            }

            return false;
        };
        return LineDistribution;
    })();
    ej.datavisualization.Diagram.LineDistribution = LineDistribution;

    ej.datavisualization.Diagram.ConnectorObstacleDefaults = {
        wrapper: null,
        segments: []
    };
    ej.datavisualization.Diagram.ConnectorObstacle = function (options) {
        options.wrapper = options.wrapper;
        options.segments = options.segments;        
        return $.extend(false, {}, ej.datavisualization.Diagram.ConnectorObstacleDefaults, options);
    };
    ej.datavisualization.Diagram.ObstacleSegmentDefaults = {
        start: Number,
        end: Number,
        coord: Number,
        direction: null,
        distance: Number,
        orientation: null,
        id: Number,
        startpoint: ej.datavisualization.Diagram.Point,
        endpoint: ej.datavisualization.Diagram.Point
    };
    ej.datavisualization.Diagram.ObstacleSegment = function (options) {
        options.direction = ej.datavisualization.Diagram.Util._getBezierDirection(options.startpt, options.endpt); // ej.datavisualization.Diagram.Geometry._findDirection(options.startpt, options.endpt);
        options.distance = ej.datavisualization.Diagram.Util.findLength(options.startpt, options.endpt);
        options.orientation = options.direction == "left" || options.direction == "right" ? "horizontal" : "vertical";
        options.id = options.id;
        if (options.orientation == "horizontal") {
            options.coord = options.startpt.y;
            if (options.direction == "left") {
                options.start = options.endpt.x;
                options.end = options.startpt.x;
            }
            else {
                options.start = options.startpt.x;
                options.end = options.endpt.x;
            }
        }
        else {
            options.coord = options.startpt.x;
            if (options.direction == "top") {
                options.start = options.endpt.y;
                options.end = options.startpt.y;
            }
            else {
                options.start = options.startpt.y;
                options.end = options.endpt.y;
            }
        }

        return $.extend(false, {}, ej.datavisualization.Diagram.ObstacleSegmentDefaults, options);
    };
    ej.datavisualization.Diagram.MatrixModelDefaults = {
        model: null,
        matrix: [],
        rowOffset: []
    };
    ej.datavisualization.Diagram.MatrixModel = function (options) {
        options.model = options.model;
        options.matrix = options.matrix || [];
        options.rowOffset = options.rowOffset || [];
        return $.extend(false, {}, ej.datavisualization.Diagram.MatrixModelDefaults, options);
    };
    ej.datavisualization.Diagram.MatrixCellGroupDefaults = {
        parents: [],
        children: [],
        visitedParents: [],
        visitedChildren: [],
        ignoredChildren: [],
        cells: [],
        size: Number,
        offset: Number,
        level: Number,
        initialOffset: Number
    };
    ej.datavisualization.Diagram.MatrixCellGroup = function (options) {
        options.level = options.level;
        options.parents = options.parents;
        options.children = options.children;
        options.visitedChildren = options.visitedChildren;
        options.visitedParents = options.visitedParents;
        options.ignoredChildren = options.ignoredChildren;
        options.cells = options.cells;
        options.offset = options.offset;
        options.initialOffset = options.initialOffset
        return $.extend(false, {}, ej.datavisualization.Diagram.MatrixCellGroupDefaults, options);
    };



})(jQuery, Syncfusion);
