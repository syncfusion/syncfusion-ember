var SizeF = (function () {
    function SizeF(width, height) {
        this.width = width;
        this.height = height;
    }
    return SizeF;
}());
var GraphForceNode = (function () {
    function GraphForceNode(gnNode) {
        this.m_fVelocityX = 0;
        this.m_fVelocityY = 0;
        this.m_lstNodes = [];
        this.m_gnNode = gnNode;
        var bounds = ej.datavisualization.Diagram.Util.bounds(gnNode);
        this.m_ptLocation = bounds._center;
        this.m_lstNodes = [];
        if (!gnNode._parents) {
            gnNode._parents = [];
        }
        if (!gnNode._children) {
            gnNode._children = [];
        }
        this.m_lstNodes = (gnNode._parents).concat(gnNode._children);
    }
    Object.defineProperty(GraphForceNode.prototype, "graphNode", {
        get: function () {
            return this.m_gnNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphForceNode.prototype, "nodes", {
        get: function () {
            return this.m_lstNodes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphForceNode.prototype, "location", {
        get: function () {
            return this.m_ptLocation;
        },
        set: function (value) {
            this.m_ptLocation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphForceNode.prototype, "velocityX", {
        get: function () {
            return this.m_fVelocityX;
        },
        set: function (value) {
            this.m_fVelocityX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphForceNode.prototype, "velocityY", {
        get: function () {
            return this.m_fVelocityY;
        },
        set: function (value) {
            this.m_fVelocityY = value;
        },
        enumerable: true,
        configurable: true
    });
    GraphForceNode.prototype.ApplyChanges = function () {
        this.m_gnNode._center = this.m_ptLocation;
    };
    return GraphForceNode;
}());
var SymmetricLayoutManager = (function () {
    function SymmetricLayoutManager() {
        this.m_szMaxForceVelocity = new SizeF(SymmetricLayoutManager.c_fMAX_VELOCITY, SymmetricLayoutManager.c_fMAX_VELOCITY);
        this.m_fVertexDistance = 0;
        this.m_dSpringFactor = SymmetricLayoutManager.c_dCOEF;
        this.m_nMaxIteraction = SymmetricLayoutManager.c_nMAX_ITERACTION;
        this.m_fVertexDistance = SymmetricLayoutManager.c_nSPRING_LENGTH;
    }
    Object.defineProperty(SymmetricLayoutManager.prototype, "SpringLength", {
        get: function () {
            return this.m_fVertexDistance;
        },
        set: function (value) {
            this.m_fVertexDistance = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymmetricLayoutManager.prototype, "SpringFactor", {
        get: function () {
            return this.m_dSpringFactor;
        },
        set: function (value) {
            this.m_dSpringFactor = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymmetricLayoutManager.prototype, "MaxIteraction", {
        get: function () {
            return this.m_nMaxIteraction;
        },
        set: function (value) {
            this.m_nMaxIteraction = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SymmetricLayoutManager.prototype, "selectedNode", {
        get: function () {
            return this.m_objSelectedNode;
        },
        set: function (value) {
            if (this.m_objSelectedNode !== value) {
                this.m_objSelectedNode = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    SymmetricLayoutManager.prototype.doGraphLayout = function (graphLayoutManager) {
        var graph = this.selectedNode;
        this.diagram = graphLayoutManager.diagram;
        graph.Bounds = graphLayoutManager._getModelBounds(this.diagram.nodes());
        var lstGraphNodes = graph.GraphNodes;
        var lstNodes = this._convertGraphNodes(lstGraphNodes);
        var count = lstNodes.length;
        count = Math.min(this.m_nMaxIteraction, count * count * count);
        this._preLayoutNodes(lstNodes, graph.Bounds);
        for (var i = 0, nLenght = count; i < nLenght; i++) {
            this._makeSymmetricLayout(lstNodes);
            this._appendForces(lstNodes);
        }
        this._resetGraphPosition(lstNodes, graph);
    };
    SymmetricLayoutManager.prototype._preLayoutNodes = function (lstNodes, rcBounds) {
        var fMaxSize = Math.max(rcBounds ? rcBounds.width : 25, rcBounds ? rcBounds.height : 25);
        var ptCenter = { x: fMaxSize / 2, y: fMaxSize / 2 };
        var dRotateAngle = 2 * Math.PI / lstNodes.length;
        var dAngle = dRotateAngle;
        for (var i = 0; i < lstNodes.length; i++) {
            var gnNode = lstNodes[i];
            var forceNode = this._getForceNode(gnNode);
            forceNode.location = {
                x: ptCenter.x + fMaxSize * Number((Math.cos(dAngle)).toFixed(2)),
                y: ptCenter.y + fMaxSize * Number(Math.sin(dAngle).toFixed(2))
            };
            dAngle -= dRotateAngle;
        }
    };
    SymmetricLayoutManager.prototype.DoLayout = function (GraphLayoutManager) {
        this.selectedNode = GraphLayoutManager.selectedNode;
        this.doGraphLayout(GraphLayoutManager);
    };
    SymmetricLayoutManager.prototype._collectionContains = function (name, coll) {
        for (var i = 0; i < coll.length; i++) {
            if (coll[i].name === name) {
                return true;
            }
        }
    };
    SymmetricLayoutManager.prototype._makeSymmetricLayout = function (lstNodes) {
        var forceNode;
        var force;
        for (var k = 0; k < lstNodes.length; k++) {
            var gnNode = lstNodes[k];
            forceNode = this._getForceNode(gnNode);
            var nodes = forceNode.nodes;
            for (var l = 0; l < nodes.length; l++) {
                var gnChild = nodes[l];
                if (this._collectionContains(gnChild.name, lstNodes)) {
                    this._calcNodesForce(forceNode, this._getForceNode(gnChild));
                }
            }
            for (var i = 0, length = nodes.length; i < length; i++) {
                if (length < 2) {
                    break;
                }
                var vtx1 = this._getForceNode(nodes[i]);
                var vtx2 = (i + 1 >= length) ? this._getForceNode(nodes[0]) : this._getForceNode((nodes[i + 1]));
                var angle = (360 / nodes.length / 2) * Math.PI / 180;
                var normalDistance = 2 * this.m_fVertexDistance * Math.sin(angle);
                this._calcRelatesForce(vtx1, vtx2, normalDistance);
            }
            for (var s = 0; s < lstNodes.length; s++) {
                var gnChild = lstNodes[s];
                if (!this._collectionContains(gnChild.name, nodes) && gnChild.name !== gnNode.name) {
                    force = this._getForceNode(gnChild);
                    this._updateNeigbour(forceNode, force);
                }
            }
        }
    };
    SymmetricLayoutManager.prototype._appendForces = function (lstNodes) {
        var gfnNode = null;
        for (var k = 0; k < lstNodes.length; k++) {
            var gnNode = lstNodes[k];
            gfnNode = this._getForceNode(gnNode);
            var ptPoint = gfnNode.location;
            ptPoint.x += Math.min(gfnNode.velocityX, this.m_szMaxForceVelocity.width);
            ptPoint.y += Math.min(gfnNode.velocityY, this.m_szMaxForceVelocity.height);
            gfnNode.velocityX = 0;
            gfnNode.velocityY = 0;
            gfnNode.location = ptPoint;
        }
    };
    SymmetricLayoutManager.prototype._resetGraphPosition = function (lstNodes, graph) {
        var szMin = new SizeF(Number.MAX_VALUE, Number.MAX_VALUE);
        var gfnNode = null;
        for (var k = 0; k < lstNodes.length; k++) {
            var gnNode = lstNodes[k];
            gfnNode = this._getForceNode(gnNode);
            var ptLocation = { x: gfnNode.location.x - gnNode.width / 2, y: gfnNode.location.y - gnNode.height / 2 };
            szMin.width = Math.min(szMin.width, ptLocation.x);
            szMin.height = Math.min(szMin.height, ptLocation.y);
        }
        for (var k = 0; k < lstNodes.length; k++) {
            gnNode = lstNodes[k];
            gfnNode = this._getForceNode(gnNode);
            var ptLocation = gfnNode.location;
            ptLocation.x -= szMin.width - graph.location ? graph.location.x : 0;
            ptLocation.y -= szMin.height - graph.location ? graph.location.y : 0;
            gfnNode.location = ptLocation;
            gfnNode.ApplyChanges();
        }
    };
    SymmetricLayoutManager.prototype._convertGraphNodes = function (lstNodes) {
        var lstToReturn = [];
        for (var k in lstNodes) {
            if (lstNodes[k]) {
                var gnNode = lstNodes[k];
                var forceNode = new GraphForceNode(gnNode);
                gnNode._tag = forceNode;
                lstToReturn.push(gnNode);
            }
        }
        return lstToReturn;
    };
    SymmetricLayoutManager.prototype._getForceNode = function (gnNode) {
        return gnNode._tag;
    };
    SymmetricLayoutManager.prototype._updateNeigbour = function (vtSource, vtTarget) {
        if (vtTarget == null || vtSource == null) {
            return;
        }
        var distance = this._pointDistance(vtSource.location, vtTarget.location);
        var angle = this._lineAngle(vtSource.location, vtTarget.location);
        var normalDistance = (this.m_fVertexDistance * 0.9);
        if (distance < normalDistance) {
            this._calcForce(distance, normalDistance, angle, vtTarget);
        }
    };
    SymmetricLayoutManager.prototype._lineAngle = function (pt1, pt2) {
        var radians = 0;
        var vx = pt2.x - pt1.x;
        var vy = pt2.y - pt1.y;
        if (vx === 0) {
            if (vy <= 0) {
                radians = (3.0 * Math.PI) / 2.0;
            }
            else {
                radians = Math.PI / 2.0;
            }
        }
        else if (vy === 0) {
            if (vx < 0) {
                radians = Math.PI;
            }
            else {
                radians = 0;
            }
        }
        else {
            radians = Math.atan(vy / vx);
            if (vx < 0 && vy > 0) {
                radians = Math.PI + radians;
            }
            else if (vx < 0 && vy < 0) {
                radians = Math.PI + radians;
            }
            else if (vx > 0 && vy < 0) {
                radians = 2.0 * Math.PI + radians;
            }
        }
        return radians;
    };
    SymmetricLayoutManager.prototype._pointDistance = function (pt1, pt2) {
        var d = 0;
        var dx = pt2.x - pt1.x;
        var dy = pt2.y - pt1.y;
        var t = (dx * dx) + (dy * dy);
        if (t > 0) {
            d = Math.sqrt(t);
        }
        return d;
    };
    SymmetricLayoutManager.prototype._calcRelatesForce = function (vtSource, vtTarget, normalDistance) {
        var distance = this._pointDistance(vtSource.location, vtTarget.location);
        var angle = this._lineAngle(vtSource.location, vtTarget.location);
        if (distance < normalDistance) {
            this._calcForce(distance, normalDistance, angle, vtTarget);
        }
    };
    SymmetricLayoutManager.prototype._calcNodesForce = function (vtSource, vtTarget) {
        var distance = this._pointDistance(vtSource.location, vtTarget.location);
        var angle = this._lineAngle(vtSource.location, vtTarget.location);
        if (distance > this.m_fVertexDistance || distance < this.m_fVertexDistance) {
            this._calcForce(distance, this.m_fVertexDistance, angle, vtTarget);
        }
    };
    SymmetricLayoutManager.prototype._calcForce = function (distance, minDist, angle, vtTarget) {
        var count = vtTarget.nodes.length;
        var length = distance - minDist;
        var factor = this.m_dSpringFactor / (count * count) * Math.sqrt(count);
        if (length !== 0) {
            var fVelocity = length * factor;
            var fOffset = fVelocity;
            var offsetX = Math.cos(angle) * fOffset;
            var offsetY = Math.sin(angle) * fOffset;
            vtTarget.velocityX -= offsetX;
            vtTarget.velocityY -= offsetY;
        }
    };
    SymmetricLayoutManager.c_dCOEF = 0.442;
    SymmetricLayoutManager.c_fMAX_VELOCITY = 50;
    SymmetricLayoutManager.c_nMAX_ITERACTION = 1000;
    SymmetricLayoutManager.c_nSPRING_LENGTH = 100;
    return SymmetricLayoutManager;
}());
var GraphLayoutManager = (function () {
    function GraphLayoutManager() {
        this.visitedStack = [];
        this.cycleEdgesCollection = [];
        this.m_hashPassedNodes = {};
    }
    Object.defineProperty(GraphLayoutManager.prototype, "selectedNode", {
        get: function () {
            return this.m_objSelectedNode;
        },
        set: function (value) {
            if (this.m_objSelectedNode !== value) {
                this.m_objSelectedNode = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GraphLayoutManager.prototype, "passedNodes", {
        get: function () {
            if (this.m_hashPassedNodes == null) {
                this.m_hashPassedNodes = {};
            }
            return this.m_hashPassedNodes;
        },
        set: function (value) {
            if (this.m_hashPassedNodes !== value) {
                this.m_hashPassedNodes = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    GraphLayoutManager.prototype.updateLayout = function (diagram, smtLayout) {
        this.diagram = diagram;
        var selectionList = diagram.nodes();
        if (selectionList.length > 0) {
            this.m_helperSelectedNode = $.extend(true, {}, selectionList[0]);
        }
        var nodes = [];
        for (var i = 0; i < diagram.nodes().length; i++) {
            nodes.push(diagram.nodes()[i]);
        }
        for (i = 0; i < diagram.connectors().length; i++) {
            nodes.push(diagram.connectors()[i]);
        }
        this._updateLayout1(nodes, smtLayout);
        var modelBounds = this._getModelBounds(diagram.nodes());
        var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(diagram, true);
        for (i = 0; i < diagram.nodes().length; i++) {
            var node = diagram.nodes()[i];
            var trnsX = (viewPort.width - modelBounds.width) / 2;
            var margin = diagram.model.layout.margin || {}, marginX, marginY;
            margin.left = margin.left || 0;
            margin.right = margin.right || 0;
            margin.top = margin.top || 0;
            margin.bottom = margin.bottom || 0;
            if (diagram.model.layout.marginX) {
                margin.left = diagram.model.layout.marginX;
            }
            if (diagram.model.layout.marginY) {
                margin.top = diagram.model.layout.marginY;
            }
            var dx = (node._tag.location.x - (node.offsetX - (node.width / 2)) - modelBounds.x + trnsX + margin.left);
            var dy = (node._tag.location.y - (node.offsetY - (node.height / 2)) - modelBounds.y + margin.top);
            this.diagram._translate(node, dx, dy, diagram.nameTable);
            delete node._tag;
            delete node._center;
            delete node._children;
            delete node._isCycleEdge;
            delete node._parents;
            if (!this.diagram._isInit) {
                ej.datavisualization.Diagram.DiagramContext.update(node, this.diagram);
            }
        }
        return;
    };
    GraphLayoutManager.prototype._getModelBounds = function (lnodes) {
        lnodes = lnodes.slice();
        var rect = null, rect1 = null, node;
        for (var i = 0; i < lnodes.length; i++) {
            node = lnodes[i];
            var bounds = ej.datavisualization.Diagram.Util.bounds(node);
            rect = {
                x: node._tag ? node._tag.location.x : bounds.x,
                y: node._tag ? node._tag.location.y : bounds.y,
                width: node.width, height: node.height
            };
            if (rect1) {
                rect1 = ej.datavisualization.Diagram.Geometry.union(rect1, rect);
            }
            else {
                rect1 = rect;
            }
        }
        ;
        return rect1;
    };
    GraphLayoutManager.prototype._updateLayout1 = function (nodesToLayout, smtLayout) {
        this._detectCyclesInGraph(nodesToLayout);
        var nodesCount = nodesToLayout.length;
        if (nodesCount > 0) {
            var cycleConnColln = [];
            var nodes = [];
            var nodeSymbols = [];
            for (var s = 0; s < nodesToLayout.length; s++) {
                var nd = nodesToLayout[s];
                if (nd._isCycleEdge === undefined) {
                    nd._isCycleEdge = false;
                }
                if (nd.segments && !nd._isCycleEdge) {
                    nodes.push(nd);
                }
                else if (nd.segments) {
                    cycleConnColln.push(nd);
                }
                else {
                    nodeSymbols.push(nd);
                }
            }
            nodes = nodes.concat(nodeSymbols);
            nodes = cycleConnColln.concat(nodes);
            while (nodesCount > this._dictionaryLength(this.passedNodes)) {
                this._getNodesToPosition(nodes);
                if (this.selectedNode == null) {
                    continue;
                }
                smtLayout.DoLayout(this);
                this.selectedNode = null;
                this.visitedStack = [];
                this.cycleEdgesCollection.forEach(function (connector) {
                    connector._isCycleEdge = false;
                });
            }
            this.m_hashPassedNodes = null;
            this.m_objSelectedNode = null;
        }
        return false;
    };
    GraphLayoutManager.prototype._getNodesToPosition = function (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (!this._collectionContains(node.name, this.passedNodes)) {
                if (node) {
                    this._selectNodes(node);
                }
                break;
            }
        }
    };
    GraphLayoutManager.prototype._selectNodes = function (node) {
        var nodeGraph = node;
        if (node.segments) {
            this._exploreGraphEdge(node);
        }
        else if (nodeGraph != null) {
            if (this._addNode(node, "passed")) {
                this._addNode(node, "selected");
                if (this._isConnectedToAnotherNode(nodeGraph)) {
                    this.selectedNode = {};
                    this.selectedNode.LeftMargin = 10;
                    this.selectedNode.TopMargin = 10;
                    this._selectConnectedNodes(nodeGraph);
                }
                else {
                    this.selectedNode = node;
                }
            }
        }
    };
    GraphLayoutManager.prototype._selectConnectedNodes = function (nodeGraph) {
        var graph = this.selectedNode;
        if (!graph.GraphNodes) {
            graph.GraphNodes = {};
        }
        var node = nodeGraph;
        if (node != null && this._addNode(node, "passed")) {
            var nodeName = node.name;
            if (!this._dictionaryContains(graph.GraphNodes, node)) {
                var gnNode = this._addGraphNode(node);
                this._getConnectedRelatives(gnNode);
                this._exploreRelatives(nodeGraph);
            }
            else {
                var graphNode = graph.GraphNodes[nodeName];
                if (graphNode.Added) {
                    graphNode.Added = false;
                    this._getConnectedRelatives(graphNode);
                    this._exploreRelatives(nodeGraph);
                }
            }
        }
    };
    GraphLayoutManager.prototype._exploreRelatives = function (nodeGraph) {
        this._exploreRelatives1(nodeGraph, "Parents");
        this._exploreRelatives1(nodeGraph, "Children");
    };
    GraphLayoutManager.prototype._exploreRelatives1 = function (nodeGraph, relativesToExplore) {
        var edges = [];
        if (relativesToExplore === "Parents") {
            edges = nodeGraph.inEdges;
        }
        else if (relativesToExplore === "Children") {
            edges = nodeGraph.outEdges;
        }
        for (var i = 0; i < edges.length; i++) {
            var edge = this.diagram.nameTable[edges[i]];
            if (this._addNode(edge, "passed")) {
                var fromNode = this.diagram.nameTable[edge.sourceNode];
                var toNode = this.diagram.nameTable[edge.targetNode];
                if (relativesToExplore === "Parents" && fromNode != null &&
                    this._collectionContains(fromNode.name, this.diagram.nodes())) {
                    this._selectConnectedNodes(this.diagram.nameTable[edge.sourceNode]);
                }
                else if (relativesToExplore === "Children" && toNode != null &&
                    this._collectionContains(toNode.name, this.diagram.nodes())) {
                    this._selectConnectedNodes(this.diagram.nameTable[edge.targetNode]);
                }
            }
        }
    };
    GraphLayoutManager.prototype._getConnectedRelatives = function (graphNode) {
        this._getConnectedParents(graphNode);
        this._getConnectedChildren(graphNode);
    };
    GraphLayoutManager.prototype._dictionaryContains = function (obj, keyObj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            if (obj[keys[i]].name === keyObj.name) {
                return true;
            }
        }
        return false;
    };
    GraphLayoutManager.prototype._dictionaryLength = function (obj) {
        var keys = Object.keys(obj);
        return keys.length;
    };
    GraphLayoutManager.prototype._getConnectedChildren = function (graphNode) {
        var graph = this.selectedNode;
        var nodeGraph = graphNode;
        for (var s = 0; s < nodeGraph.outEdges.length; s++) {
            var edge = this.diagram.nameTable[nodeGraph.outEdges[s]];
            if (!edge._isCycleEdge) {
                var node = this.diagram.nameTable[edge.targetNode];
                if (this._collectionContains(node.name, this.diagram.nodes()) && node != null && node.visible) {
                    var gnNode;
                    if (!this._dictionaryContains(graph.GraphNodes, node)) {
                        gnNode = this._addGraphNode(node);
                        gnNode.Added = true;
                    }
                    else {
                        gnNode = graph.GraphNodes[node.name];
                    }
                    if (!graphNode._children) {
                        graphNode._children = [];
                    }
                    if (!gnNode._parents) {
                        gnNode._parents = [];
                    }
                    this._setNode(gnNode._parents, graphNode);
                    if (this._findNode(graphNode._children, gnNode.name) < 0) {
                        graphNode._children.push(gnNode);
                    }
                }
            }
        }
    };
    GraphLayoutManager.prototype._getConnectedParents = function (graphNode) {
        var graph = this.selectedNode;
        var nodeGraph = graphNode;
        for (var s = 0; s < nodeGraph.inEdges.length; s++) {
            var edge = this.diagram.nameTable[nodeGraph.inEdges[s]];
            if (!edge._isCycleEdge) {
                var node = this.diagram.nameTable[edge.sourceNode];
                if (this._collectionContains(node.name, this.diagram.nodes()) && node != null && node.visible) {
                    var gnNode;
                    if (!this._dictionaryContains(graph.GraphNodes, node)) {
                        gnNode = this._addGraphNode(node);
                        gnNode.Added = true;
                    }
                    else {
                        gnNode = graph.GraphNodes[node.name];
                    }
                    if (!graphNode._parents) {
                        graphNode._parents = [];
                    }
                    if (!gnNode._children) {
                        gnNode._children = [];
                    }
                    this._setNode(gnNode._children, graphNode);
                    if (this._findNode(graphNode._parents, gnNode.name) < 0) {
                        graphNode._parents.push(gnNode);
                    }
                }
            }
        }
    };
    GraphLayoutManager.prototype._setNode = function (list, node) {
        var nIndex = this._findNode(list, node.name);
        if (nIndex >= 0 && nIndex < list.length) {
            list[nIndex] = node;
        }
        else {
            list.push(node);
        }
    };
    GraphLayoutManager.prototype._findNode = function (list, fullName) {
        var nIndex = -1;
        if (list != null && fullName !== "") {
            for (var i = 0, nLength = list.length; i < nLength; i++) {
                var gnNode = list[i];
                if (typeof (gnNode) === "string" && gnNode === fullName) {
                    nIndex = i;
                    break;
                }
                else if (gnNode != null && gnNode.name === fullName) {
                    nIndex = i;
                    break;
                }
            }
        }
        return nIndex;
    };
    GraphLayoutManager.prototype._addGraphNode = function (node) {
        var graph = this.selectedNode;
        if (!graph.GraphNodes) {
            graph.GraphNodes = {};
        }
        var gnNode = node;
        if (graph != null) {
            graph.GraphNodes[gnNode.name] = gnNode;
            var nodeHelper = this.m_helperSelectedNode;
            if (nodeHelper != null && node.name === nodeHelper.name) {
                this.m_helperSelectedNode = gnNode;
            }
        }
        return gnNode;
    };
    GraphLayoutManager.prototype._isConnectedToAnotherNode = function (gnNode) {
        var bFoundConnectedNode = false;
        var edges = (gnNode.inEdges).concat(gnNode.outEdges);
        if (edges.length > 0) {
            if ((gnNode.inEdges != null) && (gnNode.inEdges.length > 0)) {
                bFoundConnectedNode = this._searchEdgeCollection(gnNode.inEdges, "FromNode");
            }
            if ((!bFoundConnectedNode) && (gnNode.outEdges != null) && (gnNode.outEdges.length > 0)) {
                bFoundConnectedNode = this._searchEdgeCollection(gnNode.outEdges, "ToNode");
            }
        }
        return bFoundConnectedNode;
    };
    GraphLayoutManager.prototype._searchEdgeCollection = function (edgesToSearchThrough, connectionDirection) {
        var bFoundConnectedNode = false;
        for (var i = 0; i < edgesToSearchThrough.length - 1; i++) {
            var edge = this.diagram.nameTable[edgesToSearchThrough[i]];
            if (!this._addNode(edge, "passed")) {
                continue;
            }
            if (!edge._isCycleEdge && ((connectionDirection === "FromNode" && this.diagram.nameTable[edge.sourceNode] != null)
                || (connectionDirection === "ToNode" && this.diagram.nameTable[edge.targetNode] != null))) {
                bFoundConnectedNode = true;
                break;
            }
        }
        return bFoundConnectedNode;
    };
    GraphLayoutManager.prototype._exploreGraphEdge = function (node) {
        var nodeLink = node;
        if (nodeLink != null && !nodeLink._isCycleEdge && this._addNode(node, "passed")) {
            this._addNode(node, "selected");
            var fromNode = this.diagram.nameTable[nodeLink.sourceNode];
            var toNode = this.diagram.nameTable[nodeLink.targetNode];
            if (fromNode != null) {
                this._selectNodes(fromNode);
            }
            else if (toNode != null) {
                this._selectNodes(toNode);
            }
            else {
                this.selectedNode = node;
            }
        }
    };
    GraphLayoutManager.prototype._addNode = function (nodeToAdd, collectionToAdd) {
        var bResult = true;
        var node = nodeToAdd;
        if (collectionToAdd === "passed" || !node.visible) {
            if (!this._dictionaryContains(this.passedNodes, node)) {
                this.passedNodes[node.name] = node;
            }
        }
        if (!node.visible) {
            return false;
        }
        return bResult;
    };
    GraphLayoutManager.prototype._detectCyclesInGraph = function (nodes) {
        var vertex = [];
        var currentStack = [];
        for (var k = 0; k < nodes.length; k++) {
            if (!nodes[k].segments) {
                vertex.push(nodes[k]);
            }
        }
        if (vertex.length > 0) {
            currentStack.push(vertex[0]);
            this.visitedStack.push(vertex[0]);
            while (currentStack.length > 0) {
                var top = currentStack[currentStack.length - 1];
                var childNodes = this._getUnVisitedChildNodes(top);
                if (childNodes.length > 0) {
                    var child = childNodes[0];
                    var currentEdge = childNodes[childNodes.length - 1];
                    if (this._collectionContains(child.name, this.visitedStack)) {
                        currentEdge._isCycleEdge = true;
                        this.cycleEdgesCollection.push(currentEdge);
                    }
                    else {
                        currentStack.push(child);
                        this.visitedStack.splice(0, 0, child);
                    }
                }
                else {
                    currentStack.pop();
                }
            }
        }
    };
    GraphLayoutManager.prototype._getUnVisitedChildNodes = function (top) {
        var childNodes = [];
        if (top.outEdges.length > 0) {
            for (var i = 0; i < top.outEdges.length; i++) {
                var con = this.diagram.nameTable[top.outEdges[i]];
                if (!this._collectionContains(con.name, this.visitedStack)) {
                    var toNode = this.diagram.nameTable[con.targetNode];
                    if (toNode != null) {
                        childNodes.push(toNode);
                    }
                    childNodes.push(con);
                    this.visitedStack.splice(0, 0, con);
                    return childNodes;
                }
            }
            return childNodes;
        }
        return childNodes;
    };
    GraphLayoutManager.prototype._collectionContains = function (name, coll) {
        for (var i = 0; i < coll.length; i++) {
            if (coll[i].name === name) {
                return true;
            }
        }
    };
    return GraphLayoutManager;
}());
