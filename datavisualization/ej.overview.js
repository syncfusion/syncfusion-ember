/**
* @fileOverview Plugin to style the Html Overview elements
* @copyright Copyright Syncfusion Inc. 2001 - 2013. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {
    "use strict";
    //#region Overview widget
    ej.widget("ejOverview", "ej.datavisualization.Overview", {
        element: null,
        validTags: ["div"],
        model: null,
        //#region Initialization
        defaults: {
            sourceID: "",
            width: null,
            height: null
        },
        _canvas: null,
        _actionName: "",
        _startPoint: null,
        _currentPoint: null,
        _prevPoint: null,
        _helper: null,
        _viewPortRatio: 1,
        _resizeDirection: "",
        _inAction: false,
        _init: function () {
            if (!(ej.browserInfo().name === "msie" && Number(ej.browserInfo().version) < 9)) {
                this._wireEvents();
                this._renderCanvas();
                this._setParent(this.model.sourceID);
            }
        },
        _renderCanvas: function () {
            var canvas = $("#" + this.element[0].id + "_canvas")[0];
            if (!canvas) {
            var canvas = document.createElement("div");
                this.element.append(canvas);
            }
            canvas.setAttribute("id", this.element[0].id + "_canvas");
            canvas.setAttribute("class", "drawing");
            canvas.setAttribute("style", "position:relative; height:" + this.model.height + "; width:" + this.model.width + ";style:-ms-touch-action: none;touch-action: none;");
            this.element[0].setAttribute("tabindex", "0");
            this.element.css({
                overflow: "hidden", outline: "none", display: "block", height: this.model.height, width: this.model.width
            });
            this._canvas = canvas;
        },
        _renderDocument: function (view) {
            view.canvas = this._canvas;
            if (window.SVGSVGElement) {
                var svg = $("#" + this._canvas.id + "_svg")[0];
                if (svg)
                    svg.parentNode.removeChild(svg);
                var attr = {
                    id: this._canvas.id + "_svg",
                    version: "1.1",
                    xlink: "http://www.w3.org/1999/xlink",
                    "style": view.style,
                    "class": "overview_svg"
                };
                var svg = new ej.datavisualization.Diagram.Svg(attr);
                this._svg = svg;
                view.svg = svg;
                var ovw = document.getElementById(this._id);
                var element = ovw;
                var eWidth = $(element).width();
                var eHeight = $(element).height();
                var bRect = element.getBoundingClientRect();
                var screenX = (window.screenX < 0) ? window.screenX * -1 : window.screenX;
                if (eWidth === 0) {
                    eWidth = Math.floor(((window.innerWidth - screenX) - Math.floor(bRect.left)));
                }
                var screenY = (window.screenY < 0) ? window.screenY * -1 : window.screenY;
                if (eHeight === 0) {
                    eHeight = Math.floor(((window.innerHeight - screenY) - Math.floor(bRect.top)));
                }
                svg.document.setAttribute("width", eWidth);
                svg.document.setAttribute("height", eHeight);
                this.width = eWidth;
                this.height = eHeight;
                view.diagramLayer = ej.datavisualization.Diagram.SvgContext._renderDiagramLayer(view.canvas, view.svg, view.svg);
                var defs = svg.defs({ "id": view.canvas.id + "patterndefinition" });
                svg.appendChild(defs);
                view.canvas.appendChild(svg.document);
                this._renderHtmlLayer(view.canvas);
                this._addOverviewRectPanel(view);
            }
        },
        _removeDocument: function (view) {
            var svg = document.getElementById(this._canvas.id + "_svg");
            this._canvas.removeChild(svg);
            var htmlLayer = document.getElementById(this._canvas.id + "_htmlLayer");
            this._canvas.removeChild(htmlLayer);
            //var rect = document.getElementById("overview_canvasrect");
            //this._canvas.removeChild(rect);
        },
        _renderHtmlLayer: function (canvas) {
            var div = document.createElement("div");
            var attr = { "id": canvas.id + "_htmlLayer", "class": "htmlLayer" };
            ej.datavisualization.Diagram.Util.attr(div, attr);
            var htmlLayer = div;
            div.style.pointerEvents = "none";
            div.style.position = "absolute";
            div.style.left = "0px";
            div.style.top = "0px";
            canvas.appendChild(htmlLayer);
            return htmlLayer;
        },
        _setModel: function (options) {
            var updateSize = false;
            for (var option in options) {
                switch (option) {
                    case "sourceID":
                        this._setParent(options[option]);
                        break;
                    case "width":
                    case "height":
                        if (!updateSize) {
                            this._renderCanvas();
                            this._setParent(this.model.sourceID);
                }
                        updateSize = true;
                        break;
            }
            }
        },
        _setParent: function (diagram) {
            if (this._parent) {
                var oldparent = $("#" + this._parent._id).ejDiagram("instance");
                this._parent = null;
                oldparent._setOverview(null, this._id);
            }
            if (diagram) {
                this.model.sourceID = diagram;
                this._parent = $("#" + diagram).ejDiagram("instance");
                if (this._parent)
                    this._parent._setOverview(this);
            }
        },
        _destroy: function () {
            this.element.empty().removeClass(this.model.cssClass);
        },
        //#endregion
        //#region Events
        _wireEvents: function () {
            var canvas = $(this._canvas);
            this._on(canvas, ej.eventType.mouseDown, this._mousedown);
            this._on(canvas, ej.eventType.mouseMove, this._mousemove);
            this._on(canvas, ej.eventType.mouseUp, this._mouseup);
            this._on(canvas, ej.eventType.mouseLeave, this._documentmouseup);
            this._on(canvas, "touchstart", this.handleTouchStart);
            this._on(canvas, "touchmove", this.handleTouchMove);
            this._on(canvas, "touchend", this.handleTouchEnd);
        },
        _mouseup: function (evt) {
            this._currentPoint = this._mouseposition(evt);
            var offwidth = this.width;
            var offheight = this.height;
            if (this._actionName)
                if ((this._startPoint.x != this._currentPoint.x || this._startPoint.y != this._currentPoint.y)) {
                    if (this._actionName == "pan") { }
                    else {
                        if (this._helper) {
                            var bounds = this._helper.getBBox();
                            this._resizeDirection = this._resizeDirection || "";
                            var x = bounds.x;
                            var y = bounds.y;
                            var width = bounds.width;
                            var height = bounds.height;
                            var adjust = this._resizeDirection == "topleft" || this._resizeDirection == "topright" || this._resizeDirection == "bottomleft" ||
                                this._resizeDirection == "bottomright";
                            this._renderOverviewRect(x, y, width, height);
                        }
                    }
                }
                else
                    if (evt.target.id == this._canvas.id + "overviewbackrect" || evt.target.id == "helper")
                        if (this._startPoint.x == this._currentPoint.x && this._startPoint.y == this._currentPoint.y) {
                            var g = document.getElementById(this._canvas.id + "overviewrect");
                            var bounds = g.getBBox();
                            var width = bounds.width || 100;
                            var height = bounds.height || 100 / this._viewPortRatio;
                            this.inAction = true;
                            this._actionName = "pan";
                            this._renderOverviewRect(this._currentPoint.x - width / 2, this._currentPoint.y - height / 2, width, height);
                            this.inAction = false;
                        }
            if (this._helper) {
                var g = document.getElementById(this._canvas.id + "overviewhandle");
                g.removeChild(this._helper);
                this._helper = null;
            }
            this._actionName = "";
            this._startPoint = null;
            this._currentPoint = null;
            this._prevPoint = null;
            this._helper = null;
            this._viewPortRatio = 1;
            this._resizeDirection = "";
            this._inAction = false
        },
        _mousedown: function (evt) {
            if (evt.target.className.animVal == "overviewbackrect")
                this._actionName = "draw";
            if (evt.target.id == this._canvas.id + "overviewrect") this._actionName = "pan";
            if (evt.target.className.animVal == "overviewresizer") {
                this._actionName = "scale";
                switch (evt.target.id) {
                    case this._canvas.id + "left":
                        this._resizeDirection = "left";
                        break;
                    case this._canvas.id + "right":
                        this._resizeDirection = "right"; break;
                    case this._canvas.id + "top":
                        this._resizeDirection = "top"; break;
                    case this._canvas.id + "bottom":
                        this._resizeDirection = "bottom"; break;
                    case this._canvas.id + "topleft":
                        this._resizeDirection = "topleft"; break;
                    case this._canvas.id + "topright":
                        this._resizeDirection = "topright"; break;
                    case this._canvas.id + "bottomleft":
                        this._resizeDirection = "bottomleft"; break;
                    case this._canvas.id + "bottomright":
                        this._resizeDirection = "bottomright"; break;
                }
            }
            this._startPoint = this._prevPoint = this._mouseposition(evt);
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this._parent);
            this._viewPortRatio = viewPort.width / viewPort.height;
        },
        _mouseposition: function (evt) {
            var e = this._parent._isTouchEvent(evt);
            if (!e) {
                e = evt;
            }
            var scrollLeft = this._canvas.scrollLeft;
            var scrollTop = this._canvas.scrollTop;
            var controlBBox = this._canvas.getBoundingClientRect();
            var layerx = (e.clientX + scrollLeft) - controlBBox.left;
            var layery = (scrollTop + e.clientY) - controlBBox.top;
            return new ej.datavisualization.Diagram.Point(layerx, layery);
        },
        _updateCursor: function (evt) {
            if (evt.target.className.animVal == "overviewresizer") {
                switch (evt.target.id) {
                    case this._canvas.id + "left":
                        this._canvas.style.cursor = "w-resize";
                        break;
                    case this._canvas.id + "right":
                        this._canvas.style.cursor = "e-resize"; break;
                    case this._canvas.id + "top":
                        this._canvas.style.cursor = "n-resize"; break;
                    case this._canvas.id + "bottom":
                        this._canvas.style.cursor = "s-resize"; break;
                    case this._canvas.id + "topleft":
                        this._canvas.style.cursor = "nw-resize"; break;
                    case this._canvas.id + "topright":
                        this._canvas.style.cursor = "ne-resize"; break;
                    case this._canvas.id + "bottomleft":
                        this._canvas.style.cursor = "sw-resize"; break;
                    case this._canvas.id + "bottomright":
                        this._canvas.style.cursor = "se-resize"; break;
                }
            }
            else this._canvas.style.cursor = "default";
        },
        _mousemove: function (evt) {
            this._updateCursor(evt);
            this._currentPoint = this._mouseposition(evt);
            if (this._actionName)
                switch (this._actionName) {
                    case "draw":
                        if (!this._inAction && (this._startPoint.x != this._currentPoint.x || this._startPoint.y == this._currentPoint.y)) {
                            this._initHelper();
                            this._inAction = true;
                        }
                        if (this._inAction)
                            this._updateHelper();
                        break;
                    case "scale":
                        if (!this._inAction) {
                            this._initHelper();
                            this._inAction = true;
                        }
                        this._updateOverviewRectangle();
                        break;
                    case "pan":
                        if ((this._startPoint.x != this._currentPoint.x || this._startPoint.y == this._currentPoint.y) || this._inAction) {
                            this._inAction = true;
                            this._translateOverviewRectangle();
                        }
                        break;

                }
            this._prevPoint = this._currentPoint;
        },
        _documentmouseup: function (evt) {
            this._inAction = false;
            this._actionName = "";
            if (this._helper) {
                var g = document.getElementById(this._canvas.id + "overviewhandle");
                g.removeChild(this._helper);
                this._helper = null;
            }
        },
        _addOverviewRectPanel: function (view) {
            var svg = $("#" + this._canvas.id + "_overviewsvg")[0];
            if (svg)
                svg.parentNode.removeChild(svg)
            svg = new ej.datavisualization.Diagram.Svg({
                id: this._canvas.id + "_overviewsvg",
                version: "1.1",
                xlink: "http://www.w3.org/1999/xlink",
                "style": "position:absolute;left:0px;top:0px",
                width: this.width,
                height: this.height
            });
            this._canvas.appendChild(svg.document);
            var ovw = svg.g({ "id": this._id + "_overviewlayer" });
            svg.appendChild(ovw);
            var rect = svg.rect({ "fill": "transparent", "width": "100%", "height": "100%", "class": "overviewbackrect", "id": this._canvas.id + "overviewbackrect" });
            ovw.appendChild(rect);
            var svgDocument = $(ovw);
            this._on(svgDocument, ej.eventType.mouseDown, this._mousedown);
            this._on(svgDocument, ej.eventType.mouseMove, this._mousemove);
            this._on(svgDocument, ej.eventType.mouseUp, this._mouseup);
            this._on(svgDocument, ej.eventType.mouseLeave, this._documentmouseup);
            this._on(svgDocument, "touchstart", this.handleTouchStart);
            this._on(svgDocument, "touchmove", this.handleTouchMove);
            this._on(svgDocument, "touchend", this.handleTouchEnd);
            var g = svg.g({ "id": this._canvas.id + "overviewhandle" });
            ovw.appendChild(g);
            var innerrect = svg.rect({ "id": this._canvas.id + "overviewrect", "fill": "transparent" });
            g.appendChild(innerrect);
            this._renderOverviewCorner("left", g);
            this._renderOverviewCorner("right", g);
            this._renderOverviewCorner("top", g);
            this._renderOverviewCorner("bottom", g);
            this._renderOverviewCorner("topleft", g);
            this._renderOverviewCorner("topright", g);
            this._renderOverviewCorner("bottomleft", g);
            this._renderOverviewCorner("bottomright", g);
        },
        _updateOverview: function (view) {
            view = view || this._parent._views[this._id];
            var width, height;
            var bounds = this._parent._getDigramBounds();
            width = bounds.width;
            height = bounds.height;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this._parent);
            var offwidth = this.width;
            var offheight = this.height;
            if (view.context == ej.datavisualization.Diagram.SvgContext) {
                var w = Math.max(width, viewPort.width);
                var h = Math.max(height, viewPort.height);
                this.contentWidth = w = Math.max(w, (offwidth / offheight) * h);
                this.contentHeight = h = Math.max(h, (offheight / offwidth) * w);
                var g = document.getElementById(this._canvas.id + "_diagramLayer");
                var scale = Math.min(offwidth / w, offheight / h);
                this.scale = scale;
                g.setAttribute("transform", "scale(" + scale + "," + scale + "),translate(" + -bounds.x + "," + (-bounds.y) + ")");
                var htmlLayer = document.getElementById(this._canvas.id + "_htmlLayer");
                htmlLayer.style.webkitTransform = "scale(" + scale + ") translate(" + -bounds.x + "px," + (-bounds.y) + "px)";
                htmlLayer.style.MozTransform = "scale(" + scale + ") translate(" + -bounds.x + "px," + (-bounds.y) + "px)";
                htmlLayer.style.OTransform = "scale(" + scale + ") translate(" + -bounds.x + "px," + (-bounds.y) + "px)";
                htmlLayer.style.msTransform = "scale(" + scale + ") translate(" + -bounds.x + "px," + (-bounds.y) + "px)";
                htmlLayer.style.transform = "scale(" + scale + ") translate(" + -bounds.x + "px," + (-bounds.y) + "px)";
                // if (bounds.x < 0 || bounds.y < 0) 
                {
                    var ovw = document.getElementById(this._id + "_overviewlayer");
                    ovw.setAttribute("transform", "translate(" + (-bounds.x * scale) + "," + (-bounds.y * scale) + ")");
                }
            }
            else {
                var context = view._canvas.document.getContext("2d");
                if (view.scale) {
                    context.scale(1 / view.scale.x, 1 / view.scale.y);
                }
                view.scale = { x: scale, y: scale };
                context.scale(scale, scale);
                ej.datavisualization.Diagram.CanvasContext.refreshCanvas(this._parent.model, view);
            }
            this._scrollOverviewRect(this._parent._hScrollOffset, this._parent._vScrollOffset, this._parent._currZoom);
        },
        _updateOverviewRectangle: function () {
            var difx = this._currentPoint.x - this._prevPoint.x;
            var dify = this._currentPoint.y - this._prevPoint.y;
            if (this._actionName == "scale") {
                var size = { "width": 0, "height": 0 };
                var x = 0, y = 0; var w, h;
                switch (this._resizeDirection) {
                    case "left":
                        size.width -= difx;
                        size.height -= difx / this._viewPortRatio;
                        x = difx;
                        y = difx / this._viewPortRatio;
                        y /= 2;
                        break;
                    case "right":
                        size.width += difx;
                        size.height += difx / this._viewPortRatio;
                        y = difx / this._viewPortRatio;
                        y /= -2;
                        break;
                    case "top":
                        size.height -= dify;
                        size.width -= dify * this._viewPortRatio;
                        y = dify;
                        x = dify * this._viewPortRatio;
                        x /= 2;
                        break;
                    case "bottom":
                        size.height += dify;
                        size.width += dify * this._viewPortRatio;
                        x = dify * this._viewPortRatio;
                        x /= -2;
                        break;
                    case "topleft":
                        if (Math.abs(dify) > Math.abs(difx)) { difx = dify * this._viewPortRatio; }
                        else
                            dify = difx / this._viewPortRatio;
                        size.width -= difx;
                        size.height -= dify;
                        x = difx;
                        y = dify;
                        break;
                    case "topright":
                        if (Math.abs(dify) > Math.abs(difx)) { difx = -dify * this._viewPortRatio; }
                        else
                            dify = -(difx / this._viewPortRatio);
                        y = dify;
                        size.width += difx;
                        size.height -= dify;
                        break;
                    case "bottomleft":
                        if (Math.abs(dify) > Math.abs(difx)) { difx = -dify * this._viewPortRatio; }
                        else
                            dify = -difx / this._viewPortRatio;
                        x = difx;
                        size.width -= difx;
                        size.height += dify;
                        break;
                    case "bottomright":
                        if (Math.abs(dify) > Math.abs(difx)) { difx = dify * this._viewPortRatio; }
                        else
                            dify = difx / this._viewPortRatio;
                        size.width += difx;
                        size.height += dify;
                        break;
                }
                this._updateHelper(x, y, size, w, h);
            }
        },
        _initHelper: function () {
            if (!this._helper) {
                var svg = this._svg;
                var g = document.getElementById(this._canvas.id + "overviewhandle");
                var scale = this._parent._currZoom;
                var x = this._startPoint.x;
                var y = this._startPoint.y; var width = 1; var height = 1;
                if (this._actionName == "scale") {
                    var rect = document.getElementById(this._canvas.id + "overviewrect");
                    var bounds = rect.getBBox();
                    x = bounds.x; y = bounds.y; width = bounds.width; height = bounds.height;
                }
                var selectionRect = svg.rect({
                    "id": "helper", x: x, y: y, width: width, height: height,
                    "fill": "transparent", "stroke": "gray", "stroke-dasharray": "2 2", "shape-rendering": "crispEdges"
                });
                g.appendChild(selectionRect);
                this._helper = selectionRect;
            }
        },
        _updateHelper: function (difx, dify, size) {
            if (size) {
                var bounds = this._helper.getBBox();
                var x = bounds.x + difx;
                var y = bounds.y + dify;
                var width = bounds.width + size.width;
                var height = bounds.height + size.height;
            }
            else {
                var difx;
                if (this._currentPoint.x > this._startPoint.x)
                    difx = this._currentPoint.x - this._prevPoint.x;
                else
                    difx = this._prevPoint.x - this._currentPoint.x;
                var dify;
                if (this._currentPoint.y > this._startPoint.y)
                    dify = this._currentPoint.y - this._prevPoint.y;
                else dify = this._prevPoint.y - this._currentPoint.y;
                var w, h;
                if (Math.abs(dify) > Math.abs(difx)) {
                    difx = this._viewPortRatio * dify; h = true; w = false;
                }
                else { dify = difx / this._viewPortRatio; w = true; h = false; }
                var bounds = this._helper.getBBox();
                var x = ((this._startPoint.x > this._currentPoint.x) ?
                    bounds.x - difx : bounds.x);
                var y = ((this._startPoint.y > this._currentPoint.y) ? bounds.y - dify : bounds.y);
                var width = bounds.width + difx;
                var height = bounds.height + dify;
            }
            if (this._helper) {
                ej.datavisualization.Diagram.Util.attr(this._helper, {
                    "id": this._helper.id, "x": x, "y": y,
                    "width": (width < 0) ? 0 : width, "height": (height < 0) ? 0 : height
                });
            }
        },
        _renderOverviewCorner: function (name, parent) {
            var svg = this._svg;
            if (name == "top" || name == "bottom" || name == "right" || name == "left") {
                var innerrect = svg.rect({ "id": this._canvas.id + "visible" + name });
                parent.appendChild(innerrect);
                var transrect = svg.rect({ "id": this._canvas.id + name, "class": "overviewresizer", "fill": "transparent" });
                parent.appendChild(transrect);
            }
            else {
                var innerrect = svg.circle({ "id": this._canvas.id + "visible" + name });
                parent.appendChild(innerrect);
                var transrect = svg.circle({ "id": this._canvas.id + name, "class": "overviewresizer", "fill": "transparent" });
                parent.appendChild(transrect);
            }
        },
        _updateOverviewrect: function (x, y, width, height) {
            if (width && height) {
                var rect = document.getElementById(this._canvas.id + "overviewrect");
                var attr = { x: x, y: y, width: Math.max(1, width), height: Math.max(1, height) };
                ej.datavisualization.Diagram.Util.attr(rect, attr);
                this._updateOverviewCorner("top", x + 8, y - 2, Math.max(0, width - 16), 2);
                this._updateOverviewCorner("bottom", x + 8, y + height, Math.max(0, width - 16), 2);
                this._updateOverviewCorner("left", x - 2, y + 8, 2, Math.max(0, height - 16));
                this._updateOverviewCorner("right", x + width, y + 8, 2, Math.max(0, height - 16));
                this._updateOverviewCorner("topleft", x, y, 5, 5);
                this._updateOverviewCorner("topright", x + width, y, 5, 5);
                this._updateOverviewCorner("bottomleft", x, y + height, 5, 5);
                this._updateOverviewCorner("bottomright", x + width, y + height, 5, 5);
            }
        },
        _scrollOverviewRect: function (hoffset, voffset, currentzoom, isoverviewresize) {
            if (!(this._actionName) || isoverviewresize) {
                var offwidth = this.width;
                var offheight = this.height;
                var scale = Math.min(this.contentWidth / offwidth, this.contentHeight / offheight);
                var bounds = {};
                var x = bounds.x = (hoffset / currentzoom) / scale;
                var y = bounds.y = (voffset / currentzoom) / scale;
                var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this._parent);
                var width = bounds.width = (viewPort.width / currentzoom) / scale;
                var height = bounds.height = (viewPort.height / currentzoom) / scale;
                var ratio = viewPort.width / viewPort.height;
				if(isoverviewresize)
					return { x:x, y:y, width:width, height:height };
                this._updateOverviewrect(x, y, width, height);
            }
        },
        _updateOverviewCorner: function (name, x, y, width, height) {
            var rectname = "visible" + name;
            var rect = document.getElementById(this._canvas.id + rectname);
            if (name == "top" || name == "bottom" || name == "right" || name == "left") {
                var attr = { x: x, y: y, width: width, height: height, fill: "#ED1C24" };
                var transattr = { x: x - 2, y: y - 2, width: width == 2 ? 4 : width, height: height == 2 ? 4 : height };
            }
            else {
                var attr = { cx: x, cy: y, "r": 4, fill: "#ED1C24" };
                var transattr = { cx: x, cy: y, "r": 6, fill: "transparent" };
            }
            ej.datavisualization.Diagram.Util.attr(rect, attr);
            var transrect = document.getElementById(this._canvas.id + name);
            ej.datavisualization.Diagram.Util.attr(transrect, transattr);
        },
        _translateOverviewRectangle: function () {
            var offwidth = this.width;
            var offheight = this.height;
            var difx = this._currentPoint.x - this._prevPoint.x;
            var dify = this._currentPoint.y - this._prevPoint.y;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this._parent);
            var zoom = Math.min(viewPort.width / offwidth, viewPort.height / offheight);
            var panel = document.getElementById(this._canvas.id + "overviewrect");
            var bounds = panel.getBBox();
            var x = bounds.x + difx;
            var y = bounds.y + dify;
            var width = bounds.width;
            var height = bounds.height;
            this._updateOverviewrect(x, y, width, height);
            this._updateView(this._parent._currZoom, x, y, width, height, null);
        },
        _updateView: function (zoom, x, y, width, height, focuspoint) {
            var offwidth = this.width;
            var offheight = this.height;
            var scalex = this.contentWidth / offwidth;
            var scaley = this.contentHeight / offheight;
            var hoffset = x * scalex * zoom;
            var voffset = y * scaley * zoom;
            var bounds = this._parent._getDigramBounds();
            if (zoom != 1 || this._actionName == "pan") {
                var scrollModel = $("#" + this._parent._canvas.id + "_hScrollbar").ejScrollBar("instance").model;
                var scrollwidth = -hoffset + (scrollModel.maximum);
                var delx = -hoffset + this._parent._hScrollOffset;;
                var dely = -voffset + this._parent._vScrollOffset;
                if (bounds.width * zoom < scrollwidth) {
                    var difwidth = bounds.width * zoom - scrollwidth;
                    if (Math.abs(difwidth) < Math.abs(delx)) {
                        delx = delx - difwidth;
                    }
                    //else delx = 0;
                }
                scrollModel = $("#" + this._parent._canvas.id + "_vScrollbar").ejScrollBar("instance").model;
                var scrollheight = -voffset + (scrollModel.maximum);
                if (bounds.height * zoom < scrollheight) {
                    var difwidth = bounds.height * zoom - scrollheight;
                    if (Math.abs(difwidth) < Math.abs(dely)) {
                        dely = dely - difwidth;
                    }
                    //else dely = 0;
                }
            }
            ej.datavisualization.Diagram.ZoomUtil.zoomPan(this._parent, zoom / this._parent._currZoom, delx, dely, focuspoint, false);
        },
        _renderOverviewRect: function (x, y, width, height) {
            var offwidth = this.width;
            var offheight = this.height;
            var viewPort = ej.datavisualization.Diagram.ScrollUtil._viewPort(this._parent);
            var viewwidth = (width / offwidth) * this.contentWidth;
            var viewheight = (height / offheight) * this.contentHeight;
            var zoom = Math.max(viewPort.width / viewwidth, viewPort.height / viewheight);
            if (zoom >= 0.25 && zoom <= 30) {
                this._updateView(zoom, x, y, width, height, new ej.datavisualization.Diagram.Point(0, 0));
				var bounds = this._scrollOverviewRect( this._parent._hScrollOffset, this._parent._vScrollOffset, this._parent._currZoom, true);
				this._updateOverviewrect(bounds.x, bounds.y, bounds.width, bounds.height);
            }
        },
        handleTouchStart: function (evt) {
            evt.preventDefault();
        },
        handleTouchMove: function (evt) {
            evt.preventDefault();
        },
        handleTouchEnd: function (evt) {
            evt.preventDefault();
        },
        handleTouchLeave: function (evt) {
            evt.preventDefault();
        },
        //#endregion
    });
    //#endregion
})(jQuery, Syncfusion);